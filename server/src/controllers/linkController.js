const Link = require('../models/Link');
const Click = require('../models/Click');
const { generateUniqueSlug, isReservedSlug } = require('../utils/slugGenerator');

const formatUrl = (url) => {
  let formatted = url.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }
  return formatted;
};

const createLink = async (req, res, next) => {
  try {
    const { destinationUrl, customAlias, title } = req.body;
    const userId = req.user.userId;

    const formattedUrl = formatUrl(destinationUrl);

    let shortCode;
    let isCustomAlias = false;

    if (customAlias && customAlias.trim()) {
      const alias = customAlias.trim().toLowerCase();

      if (isReservedSlug(alias)) {
        return res.status(400).json({
          error: {
            message: `The alias "${alias}" is reserved and cannot be used.`,
            code: 'RESERVED_SLUG'
          }
        });
      }

      const existing = await Link.findOne({ shortCode: alias });
      if (existing) {
        return res.status(409).json({
          error: {
            message: `The alias "${alias}" is already taken. Please choose another.`,
            code: 'CONFLICT'
          }
        });
      }

      shortCode = alias;
      isCustomAlias = true;
    } else {
      shortCode = await generateUniqueSlug();
    }

    const link = new Link({
      userId,
      destinationUrl: formattedUrl,
      shortCode,
      title: title?.trim() || '',
      isCustomAlias,
      isActive: true
    });

    await link.save();

    return res.status(201).json({
      message: 'Short link created successfully',
      link
    });
  } catch (error) {
    next(error);
  }
};

const getLinks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = req.query.search ? req.query.search.trim() : '';

    const query = { userId };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { shortCode: searchRegex },
        { destinationUrl: searchRegex },
        { title: searchRegex }
      ];
    }

    const totalCount = await Link.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const skip = (page - 1) * limit;

    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach total click count per link
    const linkIds = links.map(l => l._id);
    const clickCounts = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      { $group: { _id: '$linkId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    clickCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const enrichedLinks = links.map(link => ({
      ...link,
      totalClicks: countMap[link._id.toString()] || 0
    }));

    return res.status(200).json({
      links: enrichedLinks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const link = await Link.findOne({ _id: id, userId });
    if (!link) {
      return res.status(404).json({
        error: {
          message: 'Link not found or permission denied',
          code: 'NOT_FOUND'
        }
      });
    }

    await Link.deleteOne({ _id: id });
    await Click.deleteMany({ linkId: id });

    return res.status(200).json({
      message: 'Link and its analytics records deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const toggleLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const link = await Link.findOne({ _id: id, userId });
    if (!link) {
      return res.status(404).json({
        error: {
          message: 'Link not found or permission denied',
          code: 'NOT_FOUND'
        }
      });
    }

    link.isActive = !link.isActive;
    await link.save();

    return res.status(200).json({
      message: `Link ${link.isActive ? 'activated' : 'deactivated'} successfully`,
      link
    });
  } catch (error) {
    next(error);
  }
};

const updateLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { destinationUrl, title } = req.body;

    const link = await Link.findOne({ _id: id, userId });
    if (!link) {
      return res.status(404).json({
        error: {
          message: 'Link not found or permission denied',
          code: 'NOT_FOUND'
        }
      });
    }

    if (destinationUrl && destinationUrl.trim()) {
      link.destinationUrl = formatUrl(destinationUrl);
    }
    if (typeof title === 'string') {
      link.title = title.trim();
    }

    await link.save();

    return res.status(200).json({
      message: 'Link updated successfully',
      link
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLink,
  getLinks,
  updateLink,
  deleteLink,
  toggleLink
};
