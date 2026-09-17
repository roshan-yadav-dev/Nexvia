import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Github,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Share2,
  Check,
  FolderGit2,
  Briefcase
} from 'lucide-react';
import axios from 'axios';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';

export default function PublicBioPage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await axios.get(`/api/bio/${username}`);
        setProfile(res.data.profile);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error('Failed to load public presence:', err);
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nexvia-charcoal flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-nexvia-amber border-t-transparent mx-auto mb-3" />
          <p className="text-[#A5A298] text-xs font-semibold">Loading presence...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-nexvia-cream p-4 sm:p-8 flex items-center justify-center font-sans antialiased text-nexvia-charcoal">
        <div className="w-full max-w-md bg-nexvia-charcoal rounded-4xl p-8 sm:p-10 text-center text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border">
          <div className="w-16 h-16 rounded-full bg-nexvia-charcoal-card text-nexvia-amber flex items-center justify-center mx-auto mb-4 border border-nexvia-charcoal-border">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Presence Not Claimed</h2>
          <p className="text-[#A5A298] text-xs sm:text-sm mb-6">
            The handle <span className="font-mono text-nexvia-amber font-semibold">@{username}</span> is available on Nexvia.
          </p>
          <div className="space-y-3">
            <Link to="/signup">
              <Button variant="primary" className="w-full justify-center">
                Claim @{username} on Nexvia <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full justify-center text-xs border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5">
                Discover Nexvia Platform
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const theme = profile.theme || 'dark-slate';

  const themeStyles = {
    'minimal-light': {
      outerBg: 'bg-nexvia-cream text-nexvia-charcoal',
      cardBg: 'bg-nexvia-ivory border border-nexvia-beige shadow-xl text-nexvia-charcoal',
      itemCard: 'bg-white border border-nexvia-beige text-nexvia-charcoal hover:border-nexvia-charcoal/30',
      linkBtn: 'bg-white hover:bg-gray-50 text-nexvia-charcoal border border-nexvia-beige shadow-sm',
      textMuted: 'text-[#77756D]',
      accentText: 'text-nexvia-charcoal',
      avatarRing: 'ring-nexvia-beige',
      badgeBg: 'bg-black/5 text-nexvia-charcoal border-black/10'
    },
    'dark-slate': {
      outerBg: 'bg-[#12120F] text-nexvia-ivory',
      cardBg: 'bg-nexvia-charcoal border border-nexvia-charcoal-border shadow-2xl text-nexvia-ivory',
      itemCard: 'bg-nexvia-charcoal-card border border-nexvia-charcoal-border/70 text-nexvia-ivory hover:border-nexvia-amber/30',
      linkBtn: 'bg-nexvia-charcoal-card hover:bg-white/5 text-nexvia-ivory border border-nexvia-charcoal-border shadow-sm',
      textMuted: 'text-[#A5A298]',
      accentText: 'text-nexvia-amber',
      avatarRing: 'ring-nexvia-charcoal-border',
      badgeBg: 'bg-white/5 text-[#DDD7C8] border-white/10'
    },
    'gradient': {
      outerBg: 'bg-gradient-to-b from-[#1C1B17] via-[#171713] to-[#12120F] text-nexvia-ivory',
      cardBg: 'bg-nexvia-charcoal/90 backdrop-blur-md border border-nexvia-amber/20 shadow-2xl text-nexvia-ivory',
      itemCard: 'bg-nexvia-charcoal-card/80 border border-white/10 text-nexvia-ivory hover:border-nexvia-amber/40',
      linkBtn: 'bg-white/10 hover:bg-white/15 text-nexvia-ivory border border-white/10 shadow-sm',
      textMuted: 'text-[#C5C2B8]',
      accentText: 'text-nexvia-amber',
      avatarRing: 'ring-nexvia-amber/40',
      badgeBg: 'bg-nexvia-amber/10 text-nexvia-amber border-nexvia-amber/20'
    }
  };

  const style = themeStyles[theme] || themeStyles['dark-slate'];
  const projects = profile.projects || [];
  const experience = profile.experience || [];
  const socialLinks = profile.socialLinks || [];

  return (
    <div className={`min-h-screen ${style.outerBg} py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased transition-colors duration-200`}>
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Profile Card Container */}
        <div className={`${style.cardBg} rounded-4xl sm:rounded-5xl p-6 sm:p-10 relative shadow-2xl`}>
          
          {/* Top Bar: Share & Status */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-current/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border border-current/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for collaboration</span>
            </div>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-current/5 hover:bg-current/10 transition-colors text-current"
              title="Share profile link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Profile Header */}
          <div className="text-center space-y-3 pb-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className={`w-24 h-24 rounded-full mx-auto object-cover ring-4 ${style.avatarRing} shadow-xl`}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto bg-nexvia-amber text-nexvia-charcoal font-extrabold text-3xl flex items-center justify-center shadow-xl">
                {(profile.displayName || profile.username || 'N')[0].toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {profile.displayName || `@${profile.username}`}
              </h1>
              {profile.headline && (
                <p className={`text-sm font-semibold ${style.accentText} mt-1`}>
                  {profile.headline}
                </p>
              )}
              <span className={`text-xs font-mono ${style.textMuted} block mt-0.5`}>
                @{profile.username}
              </span>
            </div>

            {profile.bio && (
              <p className={`text-xs sm:text-sm ${style.textMuted} max-w-md mx-auto leading-relaxed pt-1`}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Section 01: Selected Work (Numbered Grid) */}
          {projects.length > 0 && (
            <div className="my-8 pt-6 border-t border-current/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${style.accentText}`}>
                  01 · Selected Work ({projects.length})
                </span>
                <span className={`text-[11px] font-mono ${style.textMuted}`}>Portfolio Showcase</span>
              </div>

              <div className="space-y-4">
                {projects.map((proj, idx) => {
                  const formattedNum = String(idx + 1).padStart(2, '0');
                  const techList = Array.isArray(proj.technologies) ? proj.technologies : [];

                  return (
                    <div
                      key={idx}
                      className={`${style.itemCard} rounded-3xl p-5 transition-all space-y-3 group`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-current/5">
                        <span className={`font-mono text-xs font-bold ${style.accentText}`}>
                          {formattedNum}
                        </span>
                        <span className={`text-[10px] uppercase font-mono ${style.textMuted}`}>
                          {proj.year || '2026'}
                        </span>
                      </div>

                      {proj.imageUrl && (
                        <div className="rounded-2xl overflow-hidden aspect-video bg-black/10 border border-current/5">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-base tracking-tight mb-1">
                          {proj.title}
                        </h3>
                        {proj.description && (
                          <p className={`text-xs ${style.textMuted} leading-relaxed`}>
                            {proj.description}
                          </p>
                        )}
                      </div>

                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techList.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${style.badgeBg}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {(proj.url || proj.githubUrl) && (
                        <div className="pt-2 flex items-center gap-3 text-xs font-semibold">
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`${style.accentText} hover:underline flex items-center gap-1`}
                            >
                              <span>View Project</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`${style.textMuted} hover:text-current flex items-center gap-1`}
                            >
                              <Github className="w-3 h-3" />
                              <span>Source</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 02: Curated Destination Links */}
          {socialLinks.length > 0 && (
            <div className="my-8 pt-6 border-t border-current/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${style.accentText}`}>
                  02 · Curated Links ({socialLinks.length})
                </span>
                <span className={`text-[11px] font-mono ${style.textMuted}`}>Verified Destinations</span>
              </div>

              <div className="space-y-2.5">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-5 rounded-full text-xs font-semibold transition-all flex items-center justify-between group active:scale-98 ${style.linkBtn}`}
                  >
                    <span className="w-4" />
                    <span className="truncate text-center flex-1">
                      {link.title || link.platform}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Section 03: Experience & Background */}
          {experience.length > 0 && (
            <div className="my-8 pt-6 border-t border-current/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${style.accentText}`}>
                  03 · Experience & Roles
                </span>
                <span className={`text-[11px] font-mono ${style.textMuted}`}>Career Timeline</span>
              </div>

              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className={`${style.itemCard} p-4 rounded-2xl border transition-all space-y-1`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">{exp.role || 'Role'}</span>
                      <span className={`text-[11px] font-mono ${style.textMuted}`}>{exp.year}</span>
                    </div>
                    <p className={`text-xs font-medium ${style.accentText}`}>
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className={`text-[11px] ${style.textMuted} pt-1 leading-relaxed`}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimalist Footer Badge */}
          <div className="text-center pt-8 border-t border-current/10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              <span>Built with</span>
              <NexviaLogo size="xs" dark={theme !== 'minimal-light'} showWordmark={true} />
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
