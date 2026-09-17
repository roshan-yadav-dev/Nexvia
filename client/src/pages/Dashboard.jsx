import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Link2,
  Users,
  MousePointerClick,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Smartphone,
  Globe,
  Calendar,
  FolderGit2,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import CreateLinkModal from '../components/CreateLinkModal';

const DEVICE_COLORS = {
  Desktop: '#F4B33E',
  Mobile: '#34D399',
  Tablet: '#38BDF8',
  Other: '#A5A298'
};

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  // Quick link creation
  const [quickUrl, setQuickUrl] = useState('');
  const [quickAlias, setQuickAlias] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(null);
  const [quickError, setQuickError] = useState('');

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/overview');
      setOverview(res.data);
    } catch (err) {
      console.error('Failed to load overview analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    if (!quickUrl) return;
    setQuickLoading(true);
    setQuickError('');
    setQuickSuccess(null);

    try {
      const res = await api.post('/links', {
        destinationUrl: quickUrl,
        customAlias: quickAlias.trim() || undefined
      });
      setQuickSuccess(res.data.link);
      setQuickUrl('');
      setQuickAlias('');
      fetchOverview();
    } catch (err) {
      setQuickError(err.response?.data?.error?.message || 'Failed to shorten URL');
    } finally {
      setQuickLoading(false);
    }
  };

  const handleCopyLink = async (shortCode) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(shortCode);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-nexvia-cream p-3 sm:p-6 lg:p-8 font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-6 sm:p-10 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-nexvia-charcoal-border/70">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-nexvia-ivory">
                  {getTimeOfDayGreeting()},{' '}
                  <span className="text-nexvia-amber">@{user?.username}</span>
                </h1>
                <Badge variant="green" size="sm">Active Identity</Badge>
              </div>
              <p className="text-[#A5A298] text-xs sm:text-sm">
                Real-time performance analytics for your branded links, selected projects, and digital presence.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> New Link
              </Button>
              <Link to="/portfolio">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
                >
                  <FolderGit2 className="w-3.5 h-3.5 mr-1" /> Work
                </Button>
              </Link>
              <Link to="/bio-builder">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Bio Studio
                </Button>
              </Link>
              {user?.username && (
                <a
                  href={`/bio/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="primary" size="sm">
                    View Live <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Quick Shorten Bar */}
          <div className="bg-nexvia-charcoal-card p-4 sm:p-6 rounded-3xl border border-nexvia-charcoal-border/70">
            <h3 className="text-xs font-semibold text-[#A5A298] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-nexvia-amber" /> Quick Shorten Link
            </h3>
            <form onSubmit={handleQuickCreate} className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="url"
                placeholder="Paste destination URL (e.g. https://github.com/my-project)..."
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="flex-1 w-full bg-nexvia-charcoal text-nexvia-ivory border border-nexvia-charcoal-border rounded-full py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 placeholder:text-[#65635C]"
                required
              />
              <input
                type="text"
                placeholder="Vanity slug (optional)"
                value={quickAlias}
                onChange={(e) => setQuickAlias(e.target.value)}
                className="w-full sm:w-52 bg-nexvia-charcoal text-nexvia-ivory border border-nexvia-charcoal-border rounded-full py-2.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nexvia-amber/80 placeholder:text-[#65635C]"
              />
              <Button type="submit" variant="primary" size="md" isLoading={quickLoading} className="w-full sm:w-auto">
                Shorten Link
              </Button>
            </form>

            {quickSuccess && (
              <div className="mt-3 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Short link active: <strong className="font-mono text-white">{window.location.origin}/r/{quickSuccess.shortCode}</strong>
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(quickSuccess.shortCode)}
                    className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white transition-colors"
                    title="Copy short link"
                  >
                    {copiedLink === quickSuccess.shortCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <Link to="/links" className="font-bold underline hover:text-white">
                    View in Links Studio →
                  </Link>
                </div>
              </div>
            )}

            {quickError && (
              <p className="mt-2 text-xs text-red-400">{quickError}</p>
            )}
          </div>

          {/* Metrics Grid (Numbered, 100% Real Backend Data) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 01 Total Clicks */}
            <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70">
              <div className="flex items-center justify-between text-[#A5A298] mb-2">
                <span className="text-[11px] font-mono font-bold text-nexvia-amber uppercase tracking-wider">
                  01 · Total Clicks
                </span>
                <MousePointerClick className="w-4 h-4 text-nexvia-amber" />
              </div>
              <div className="text-3xl font-extrabold text-nexvia-amber">
                {loading ? '...' : (overview?.totalClicks || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-[#A5A298] mt-1 block">
                Across all active short links
              </span>
            </div>

            {/* 02 Unique Visitors */}
            <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70">
              <div className="flex items-center justify-between text-[#A5A298] mb-2">
                <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  02 · Unique Visitors
                </span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-extrabold text-nexvia-ivory">
                {loading ? '...' : (overview?.uniqueVisitors || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-[#A5A298] mt-1 block">
                Salted IP hashes tracked
              </span>
            </div>

            {/* 03 Active Links */}
            <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70">
              <div className="flex items-center justify-between text-[#A5A298] mb-2">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  03 · Active Links
                </span>
                <Link2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-nexvia-ivory">
                {loading ? '...' : (overview?.totalLinks || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-[#A5A298] mt-1 block">
                Managed in your library
              </span>
            </div>

            {/* 04 Digital Presence Hub */}
            <div className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#A5A298]">
                <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                  04 · Public Presence
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Published
                </span>
              </div>
              <div className="my-2">
                <span className="text-base font-bold text-nexvia-ivory block truncate">
                  /bio/{user?.username}
                </span>
                <span className="text-[11px] text-[#A5A298]">
                  Curated profile, projects & bio
                </span>
              </div>
              <Link
                to="/bio-builder"
                className="text-xs font-semibold text-nexvia-amber hover:underline flex items-center gap-1"
              >
                Customize Studio →
              </Link>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Clicks Over Time (Area Chart with Amber curve) */}
            <div className="lg:col-span-8 bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-nexvia-ivory flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-nexvia-amber" /> Aggregate Clicks Over Time
                </h3>
                <Badge variant="amber" size="sm">Daily Aggregate</Badge>
              </div>

              {overview?.clicksOverTime?.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overview.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="overviewClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F4B33E" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#F4B33E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#77756D" fontSize={11} tickLine={false} />
                      <YAxis stroke="#77756D" fontSize={11} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#171713', borderColor: '#2A2A24', borderRadius: '1rem', color: '#FAF8F2' }}
                        itemStyle={{ color: '#F4B33E' }}
                      />
                      <Area type="monotone" dataKey="clicks" stroke="#F4B33E" strokeWidth={2.5} fillOpacity={1} fill="url(#overviewClicks)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-20 text-center text-[#77756D] text-xs">
                  No clicks recorded yet. Share your short links to view real-time daily activity!
                </div>
              )}
            </div>

            {/* Device Split */}
            <div className="lg:col-span-4 bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-nexvia-ivory mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> Device Distribution
                </h3>
                {overview?.deviceDistribution?.length > 0 ? (
                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overview.deviceDistribution}
                          dataKey="count"
                          nameKey="device"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={5}
                        >
                          {overview.deviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={DEVICE_COLORS[entry.device] || '#A5A298'} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171713', borderColor: '#2A2A24', borderRadius: '1rem', color: '#FAF8F2' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-12 text-center text-[#77756D] text-xs">
                    No device analytics available yet.
                  </div>
                )}
              </div>

              {overview?.deviceDistribution?.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-nexvia-charcoal-border/60">
                  {overview.deviceDistribution.map((dev, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[dev.device] || '#A5A298' }} />
                      <span className="text-[#A5A298]">{dev.device} ({dev.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Referrers and Top Performing Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Top Traffic Referrers */}
            <div className="lg:col-span-5 bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70">
              <h3 className="text-sm font-bold text-nexvia-ivory mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" /> Top Referrers
              </h3>
              {overview?.topReferrers?.length > 0 ? (
                <div className="space-y-2.5">
                  {overview.topReferrers.map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-3 bg-nexvia-charcoal rounded-2xl border border-nexvia-charcoal-border/50">
                      <span className="text-nexvia-ivory font-medium truncate max-w-[200px]">{ref.referrer}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 text-nexvia-amber font-semibold border border-white/5">
                        {ref.count} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-[#77756D] text-xs">No referrer data collected yet.</p>
              )}
            </div>

            {/* Top Links Leaderboard (Editorial Inset Card) */}
            <div className="lg:col-span-7 bg-nexvia-ivory rounded-3xl p-6 text-nexvia-charcoal shadow-xl border border-nexvia-beige">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-nexvia-beige">
                <h3 className="text-sm font-bold text-nexvia-charcoal flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-nexvia-charcoal" /> Top Performing Links
                </h3>
                <Link
                  to="/links"
                  className="text-xs font-semibold text-nexvia-charcoal hover:text-nexvia-amber bg-black/5 hover:bg-black/10 px-3 py-1 rounded-full transition-colors"
                >
                  View All Links →
                </Link>
              </div>

              {overview?.topLinks?.length > 0 ? (
                <div className="space-y-2">
                  {overview.topLinks.map((link, idx) => (
                    <div key={link.linkId} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-nexvia-charcoal/10 font-bold text-xs flex items-center justify-center text-nexvia-charcoal">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold block text-nexvia-charcoal">
                            /{link.shortCode}
                          </span>
                          <span className="text-[11px] text-[#77756D] truncate max-w-[240px] block">
                            {link.title || link.destinationUrl}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-nexvia-amber/20 text-nexvia-charcoal font-semibold text-xs border border-nexvia-amber/30">
                          {link.clicks} clicks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-[#77756D] text-xs">
                  No links created yet. Use the Quick Shorten bar above to launch your first link!
                </p>
              )}
            </div>

          </div>

        </div>
      </div>

      <CreateLinkModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onLinkCreated={() => fetchOverview()}
      />
    </div>
  );
}
