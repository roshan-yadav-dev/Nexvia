import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  Check,
  Save,
  Smartphone,
  FolderGit2,
  Briefcase,
  Layers,
  AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import NexviaLogo from '../components/NexviaLogo';

const PLATFORM_PRESETS = [
  'Website', 'Portfolio', 'GitHub', 'LinkedIn', 'Twitter / X',
  'Substack', 'YouTube', 'Instagram', 'Dribbble', 'Figma'
];

export default function BioBuilder() {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState('dark-slate');
  const [socialLinks, setSocialLinks] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bio/me');
      const profile = res.data.profile;
      if (profile) {
        setDisplayName(profile.displayName || user?.username || '');
        setHeadline(profile.headline || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatarUrl || '');
        setTheme(profile.theme || 'dark-slate');
        setSocialLinks(profile.socialLinks || []);
        setExperience(profile.experience || []);
        setProjectsCount((profile.projects || []).length);
      }
    } catch (err) {
      console.error('Failed to load bio profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      await api.post('/bio', {
        displayName,
        headline,
        bio,
        avatarUrl,
        theme,
        socialLinks,
        experience
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update bio profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = () => {
    setSocialLinks([
      ...socialLinks,
      {
        platform: 'Website',
        title: 'My Link',
        url: '',
        order: socialLinks.length
      }
    ]);
  };

  const handleUpdateLink = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const handleRemoveLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleMoveLink = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;
    const updated = [...socialLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSocialLinks(updated);
  };

  // Experience handlers
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        company: '',
        role: '',
        year: '2024 – Present',
        description: '',
        order: experience.length
      }
    ]);
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const publicUrl = `${window.location.origin}/bio/${user?.username}`;

  const handleCopyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen bg-nexvia-cream p-3 sm:p-6 lg:p-8 font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-6 sm:p-10 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-nexvia-charcoal-border/70">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-nexvia-ivory">
                  Bio <span className="text-nexvia-amber">Studio</span>
                </h1>
                <Badge variant="amber" size="sm">
                  @{user?.username}
                </Badge>
              </div>
              <p className="text-[#A5A298] text-xs sm:text-sm mt-1">
                Customize your digital presence, personal branding, experience, and destination links.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
                onClick={handleCopyPublicLink}
                title="Copy public bio link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                <span>{copied ? 'Copied' : 'Share Bio'}</span>
              </Button>
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Live
                </Button>
              </a>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={saving}
              >
                <Save className="w-4 h-4 mr-1" /> Save Presence
              </Button>
            </div>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Your Nexvia bio profile has been updated and published!
              </span>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                View Page Live →
              </a>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Builder Layout: Left Controls, Right Mockup Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Details Card */}
              <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-nexvia-amber">
                  01 · Identity Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    placeholder="e.g. Alex Morgan"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />

                  <Input
                    label="Headline / Profession"
                    placeholder="e.g. Systems Designer & Developer"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>

                <Input
                  label="Avatar Image URL"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Bio Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief statement of purpose, current focus, or creative mission..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={300}
                    className="w-full bg-nexvia-charcoal text-nexvia-ivory border border-nexvia-charcoal-border rounded-2xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 placeholder:text-[#65635C]"
                  />
                  <span className="text-[10px] text-[#77756D] block text-right mt-1">
                    {bio.length}/300 characters
                  </span>
                </div>
              </div>

              {/* Selected Work Banner */}
              <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-nexvia-amber mb-1">
                    02 · Selected Work Showcase
                  </h3>
                  <p className="text-xs text-[#A5A298]">
                    {projectsCount} {projectsCount === 1 ? 'project' : 'projects'} featured in your portfolio section.
                  </p>
                </div>
                <Link to="/portfolio">
                  <Button variant="outline" size="sm" className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5">
                    <FolderGit2 className="w-3.5 h-3.5 mr-1" /> Manage Work →
                  </Button>
                </Link>
              </div>

              {/* Theme Selector */}
              <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-nexvia-amber">
                  03 · Presentation Theme
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {/* Dark Slate (Nexvia Default) */}
                  <div
                    onClick={() => setTheme('dark-slate')}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-center ${
                      theme === 'dark-slate'
                        ? 'border-nexvia-amber ring-2 ring-nexvia-amber/50 bg-white/5'
                        : 'border-nexvia-charcoal-border hover:border-white/20'
                    }`}
                  >
                    <div className="h-10 w-full rounded-xl bg-nexvia-charcoal border border-nexvia-charcoal-border mb-2 flex items-center justify-center">
                      <div className="w-8 h-2 bg-nexvia-amber rounded-full" />
                    </div>
                    <span className="text-xs font-bold block text-nexvia-ivory">Dark Charcoal</span>
                  </div>

                  {/* Minimal Light (Warm Ivory) */}
                  <div
                    onClick={() => setTheme('minimal-light')}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-center ${
                      theme === 'minimal-light'
                        ? 'border-nexvia-amber ring-2 ring-nexvia-amber/50 bg-white/5'
                        : 'border-nexvia-charcoal-border hover:border-white/20'
                    }`}
                  >
                    <div className="h-10 w-full rounded-xl bg-nexvia-ivory border border-nexvia-beige mb-2 flex items-center justify-center">
                      <div className="w-8 h-2 bg-nexvia-charcoal rounded-full" />
                    </div>
                    <span className="text-xs font-bold block text-nexvia-ivory">Warm Ivory</span>
                  </div>

                  {/* Gold Gradient */}
                  <div
                    onClick={() => setTheme('gradient')}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-center ${
                      theme === 'gradient'
                        ? 'border-nexvia-amber ring-2 ring-nexvia-amber/50 bg-white/5'
                        : 'border-nexvia-charcoal-border hover:border-white/20'
                    }`}
                  >
                    <div className="h-10 w-full rounded-xl bg-gradient-to-r from-nexvia-amber via-[#E69E24] to-nexvia-charcoal mb-2 flex items-center justify-center">
                      <div className="w-8 h-2 bg-white/80 rounded-full" />
                    </div>
                    <span className="text-xs font-bold block text-nexvia-ivory">Amber Glow</span>
                  </div>
                </div>
              </div>

              {/* Curated Social / Custom Links Manager */}
              <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-nexvia-amber">
                    04 · Curated Links ({socialLinks.length})
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddLink} className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Link
                  </Button>
                </div>

                {socialLinks.length === 0 ? (
                  <div className="py-8 text-center text-[#77756D] text-xs">
                    No links added yet. Click "Add Link" to attach your first personal destination!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="bg-nexvia-charcoal p-4 rounded-2xl border border-nexvia-charcoal-border/80 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-nexvia-amber">
                            Link #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLink(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 rounded text-[#77756D] hover:text-white disabled:opacity-20"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLink(idx, 1)}
                              disabled={idx === socialLinks.length - 1}
                              className="p-1 rounded text-[#77756D] hover:text-white disabled:opacity-20"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveLink(idx)}
                              className="p-1 rounded text-[#A5A298] hover:text-red-400 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-[#A5A298] mb-1">
                              Platform / Preset
                            </label>
                            <select
                              value={link.platform}
                              onChange={(e) => handleUpdateLink(idx, 'platform', e.target.value)}
                              className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80"
                            >
                              {PLATFORM_PRESETS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-[#A5A298] mb-1">
                              Button Label
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Read Newsletter"
                              value={link.title}
                              onChange={(e) => handleUpdateLink(idx, 'title', e.target.value)}
                              className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#A5A298] mb-1">
                            Destination URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={link.url}
                            onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                            className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience / Roles Section */}
              <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-nexvia-amber">
                    05 · Experience & Roles ({experience.length})
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddExperience} className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Role
                  </Button>
                </div>

                {experience.length === 0 ? (
                  <div className="py-6 text-center text-[#77756D] text-xs">
                    No experience records added yet. Add past or current roles for your public portfolio.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className="bg-nexvia-charcoal p-4 rounded-2xl border border-nexvia-charcoal-border/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-nexvia-amber">
                            Role #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(idx)}
                            className="p-1 rounded text-[#A5A298] hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Company / Org"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                            className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80"
                          />
                          <input
                            type="text"
                            placeholder="Role / Title"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                            className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80"
                          />
                          <input
                            type="text"
                            placeholder="Period (e.g. 2023 – Present)"
                            value={exp.year}
                            onChange={(e) => handleUpdateExperience(idx, 'year', e.target.value)}
                            className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Brief summary of responsibility..."
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                          className="w-full bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Sticky Mobile Mockup Preview */}
            <div className="lg:col-span-5 sticky top-6">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A5A298] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-nexvia-amber" /> Live Mobile Mockup
                </span>
                <span className="text-[10px] text-[#77756D] font-mono">
                  /bio/{user?.username}
                </span>
              </div>

              {/* Phone Frame */}
              <div className="w-full max-w-sm mx-auto bg-[#10100E] rounded-5xl p-4 shadow-2xl border-4 border-[#2A2A24] relative overflow-hidden">
                {/* Speaker pill notch */}
                <div className="w-20 h-3.5 bg-[#2A2A24] rounded-full mx-auto mb-4" />

                {/* Inner Phone Screen */}
                <div className={`rounded-4xl p-5 min-h-[490px] transition-all flex flex-col justify-between ${
                  theme === 'minimal-light'
                    ? 'bg-nexvia-ivory text-nexvia-charcoal'
                    : theme === 'gradient'
                    ? 'bg-gradient-to-b from-nexvia-amber/20 via-nexvia-charcoal to-nexvia-charcoal text-nexvia-ivory'
                    : 'bg-nexvia-charcoal text-nexvia-ivory'
                }`}>
                  
                  {/* Bio Header */}
                  <div className="text-center pt-2">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-nexvia-amber/40 mb-2.5 shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full mx-auto bg-nexvia-amber text-nexvia-charcoal font-bold text-xl flex items-center justify-center mb-2.5 shadow-md">
                        {(displayName || user?.username || 'N')[0].toUpperCase()}
                      </div>
                    )}

                    <h3 className="font-bold text-base tracking-tight">
                      {displayName || `@${user?.username}`}
                    </h3>

                    {headline && (
                      <p className="text-[11px] font-semibold text-nexvia-amber mt-0.5">
                        {headline}
                      </p>
                    )}

                    <p className="text-[11px] opacity-75 mt-1 max-w-xs mx-auto leading-relaxed">
                      {bio || 'Welcome to my official presence.'}
                    </p>
                  </div>

                  {/* Links Stack */}
                  <div className="my-4 space-y-2">
                    {socialLinks.length === 0 ? (
                      <div className="py-6 text-center text-xs opacity-40">
                        Destination links will appear here
                      </div>
                    ) : (
                      socialLinks.map((link, idx) => (
                        <div
                          key={idx}
                          className={`w-full py-2.5 px-3.5 rounded-full text-xs font-semibold text-center transition-all flex items-center justify-between shadow-sm ${
                            theme === 'minimal-light'
                              ? 'bg-white text-nexvia-charcoal border border-nexvia-beige'
                              : 'bg-nexvia-charcoal-card text-nexvia-ivory border border-nexvia-charcoal-border'
                          }`}
                        >
                          <span className="w-3" />
                          <span className="truncate">{link.title || link.platform}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Nexvia Footer Tag */}
                  <div className="text-center pt-3 border-t border-current/10">
                    <span className="text-[10px] font-medium opacity-60 flex items-center justify-center gap-1.5">
                      Built with <NexviaLogo size="xs" dark={theme !== 'minimal-light'} showWordmark={true} />
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
