const BioProfile = require('../models/BioProfile');
const User = require('../models/User');

const formatUrl = (url) => {
  let formatted = url.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }
  return formatted;
};

const getOwnProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let profile = await BioProfile.findOne({ userId });

    if (!profile) {
      // Find user to provide sensible initial defaults
      const user = await User.findById(userId);
      profile = {
        userId,
        username: user?.username || req.user.username,
        displayName: user?.username || '',
        headline: '',
        avatarUrl: '',
        bio: '',
        theme: 'dark-slate',
        socialLinks: [],
        projects: [],
        experience: []
      };
    }

    return res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

const upsertProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const username = req.user.username;
    const { avatarUrl, displayName, headline, bio, theme, socialLinks, projects, experience } = req.body;

    const formattedLinks = Array.isArray(socialLinks)
      ? socialLinks.map((link, index) => ({
          platform: link.platform?.trim() || 'Link',
          title: link.title?.trim() || link.platform?.trim() || 'Link',
          url: formatUrl(link.url || ''),
          order: typeof link.order === 'number' ? link.order : index
        }))
      : [];

    const formattedProjects = Array.isArray(projects)
      ? projects.map((p, index) => ({
          title: p.title?.trim() || 'Untitled Project',
          description: p.description?.trim() || '',
          imageUrl: p.imageUrl?.trim() || '',
          technologies: Array.isArray(p.technologies) ? p.technologies.map(t => String(t).trim()).filter(Boolean) : [],
          year: p.year?.trim() || '',
          url: p.url ? formatUrl(p.url) : '',
          githubUrl: p.githubUrl ? formatUrl(p.githubUrl) : '',
          caseStudy: p.caseStudy?.trim() || '',
          order: typeof p.order === 'number' ? p.order : index
        }))
      : [];

    const formattedExperience = Array.isArray(experience)
      ? experience.map((exp, index) => ({
          company: exp.company?.trim() || '',
          role: exp.role?.trim() || '',
          year: exp.year?.trim() || '',
          description: exp.description?.trim() || '',
          order: typeof exp.order === 'number' ? exp.order : index
        }))
      : [];

    const profileData = {
      userId,
      username: username.toLowerCase(),
      avatarUrl: avatarUrl?.trim() || '',
      displayName: displayName?.trim() || username,
      headline: headline?.trim() || '',
      bio: bio?.trim() || '',
      theme: theme || 'dark-slate',
      socialLinks: formattedLinks,
      projects: formattedProjects,
      experience: formattedExperience
    };

    const profile = await BioProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Bio profile saved successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const profile = await BioProfile.findOne({
      username: username.trim().toLowerCase()
    }).select('username displayName headline avatarUrl bio theme socialLinks projects experience updatedAt');

    if (!profile) {
      return res.status(404).json({
        error: {
          message: `Bio profile @${username} does not exist`,
          code: 'NOT_FOUND'
        }
      });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOwnProfile,
  upsertProfile,
  getPublicProfile
};
