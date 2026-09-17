import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Link2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  FolderGit2,
  QrCode,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-nexvia-cream p-3 sm:p-6 lg:p-10 flex flex-col items-center justify-center font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="w-full max-w-7xl bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-6 sm:p-10 lg:p-14 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border relative overflow-hidden">
        
        {/* Editorial Top Navbar */}
        <header className="flex items-center justify-between pb-8 lg:pb-12 border-b border-nexvia-charcoal-border/70">
          <Link to="/" className="flex items-center gap-3">
            <NexviaLogo size="md" dark={true} showWordmark={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A5A298]">
            <a href="#work" className="hover:text-nexvia-ivory transition-colors">01 Selected Work</a>
            <a href="#links" className="hover:text-nexvia-ivory transition-colors">02 Branded Links</a>
            <a href="#bio" className="hover:text-nexvia-ivory transition-colors">03 Digital Presence</a>
            <a href="#insights" className="hover:text-nexvia-ivory transition-colors">04 Privacy Insights</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-[#A5A298] hover:text-white px-3 py-1.5 hidden sm:inline-block transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="pt-12 lg:pt-16 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-nexvia-charcoal-border text-xs text-[#DDD7C8]">
              <span className="w-2 h-2 rounded-full bg-nexvia-amber animate-pulse" />
              <span>Digital Presence & Identity Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-nexvia-ivory">
              Your work. <br />
              Your links. <br />
              <span className="text-nexvia-amber">Your next.</span>
            </h1>

            <p className="text-[#A5A298] text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Nexvia combines vanity short-links, curated project showcases, personal bio pages, and first-party audience analytics into one calm, unified digital identity.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button variant="primary" size="lg" className="px-6 py-3.5 text-sm font-semibold">
                  Claim Your Presence <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/links" : "/login"}>
                <Button variant="outline" size="lg" className="border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5 px-6 py-3.5 text-sm">
                  Explore Studio
                </Button>
              </Link>
            </div>

            {/* Feature Meta Pills */}
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="px-3 py-1 rounded-full bg-nexvia-charcoal-card text-[#A5A298] text-xs border border-nexvia-charcoal-border/70 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-nexvia-amber" /> Fast 302 Redirection
              </span>
              <span className="px-3 py-1 rounded-full bg-nexvia-charcoal-card text-[#A5A298] text-xs border border-nexvia-charcoal-border/70 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" /> Selected Work Portfolio
              </span>
              <span className="px-3 py-1 rounded-full bg-nexvia-charcoal-card text-[#A5A298] text-xs border border-nexvia-charcoal-border/70 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" /> First-Party Analytics
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Product Mockup */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Top Card: Presence Preview */}
            <div className="bg-nexvia-charcoal-card rounded-3xl p-6 border border-nexvia-charcoal-border shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-nexvia-charcoal-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-nexvia-amber text-nexvia-charcoal font-bold flex items-center justify-center text-sm">
                    N
                  </div>
                  <div>
                    <span className="text-xs font-bold text-nexvia-ivory block">Alex Morgan</span>
                    <span className="text-[11px] text-[#A5A298]">nexvia.io/bio/alex</span>
                  </div>
                </div>
                <Badge variant="amber" size="sm">Live Presence</Badge>
              </div>

              {/* Sample Short Link Routing Pill */}
              <div className="bg-nexvia-charcoal p-3.5 rounded-2xl border border-nexvia-charcoal-border/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-nexvia-amber" />
                  <span className="text-[#DDD7C8] font-mono">nexvia.io/r/portfolio-2026</span>
                </div>
                <span className="text-[#A5A298] text-[11px] font-medium">302 Redirect Active</span>
              </div>

              {/* Real-time stats preview */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-nexvia-charcoal p-3 rounded-2xl border border-nexvia-charcoal-border/50">
                  <span className="text-[10px] text-[#A5A298] uppercase tracking-wider block">Total Clicks</span>
                  <span className="text-base font-extrabold text-nexvia-amber">1,248</span>
                </div>
                <div className="bg-nexvia-charcoal p-3 rounded-2xl border border-nexvia-charcoal-border/50">
                  <span className="text-[10px] text-[#A5A298] uppercase tracking-wider block">Visitors</span>
                  <span className="text-base font-extrabold text-white">892</span>
                </div>
                <div className="bg-nexvia-charcoal p-3 rounded-2xl border border-nexvia-charcoal-border/50">
                  <span className="text-[10px] text-[#A5A298] uppercase tracking-wider block">Projects</span>
                  <span className="text-base font-extrabold text-emerald-400">04</span>
                </div>
              </div>
            </div>

            {/* Selected Work Numbered Inset (Inspired by the reference image) */}
            <div className="bg-nexvia-ivory rounded-3xl p-5 text-nexvia-charcoal shadow-xl space-y-3 border border-nexvia-beige">
              <div className="flex items-center justify-between text-xs font-bold text-[#77756D] pb-2 border-b border-nexvia-beige">
                <span className="uppercase tracking-wider">01 · Featured Projects</span>
                <span className="text-[11px] font-mono">2025 – 2026</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-nexvia-amber/20 text-nexvia-charcoal font-extrabold text-xs flex items-center justify-center">
                      01
                    </span>
                    <div>
                      <span className="text-xs font-bold block text-nexvia-charcoal">Design System Architecture</span>
                      <span className="text-[11px] text-[#77756D]">React · Tailwind · Figma Tokens</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#77756D] flex items-center gap-1">
                    Case Study <ExternalLink className="w-3 h-3" />
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-nexvia-charcoal/10 text-nexvia-charcoal font-extrabold text-xs flex items-center justify-center">
                      02
                    </span>
                    <div>
                      <span className="text-xs font-bold block text-nexvia-charcoal">Identity Platform API</span>
                      <span className="text-[11px] text-[#77756D]">Node.js · MongoDB · Express</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#77756D] flex items-center gap-1">
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* The Four Pillars Grid */}
        <div className="pt-12 pb-8 border-t border-nexvia-charcoal-border/70">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-nexvia-amber block mb-1">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nexvia-ivory">
              Everything for your digital presence. Nothing unnecessary.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 01 Short Links */}
            <div id="links" className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 hover:border-nexvia-amber/40 transition-colors">
              <span className="text-xs font-mono font-bold text-nexvia-amber block mb-3">01</span>
              <h3 className="text-base font-bold text-nexvia-ivory mb-1">Branded Short Links</h3>
              <p className="text-xs text-[#A5A298] leading-relaxed">
                Generate custom vanity slugs, generate instant high-res QR codes, and deliver instant 302 redirects with low latency.
              </p>
            </div>

            {/* 02 Selected Work */}
            <div id="work" className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 hover:border-nexvia-amber/40 transition-colors">
              <span className="text-xs font-mono font-bold text-nexvia-amber block mb-3">02</span>
              <h3 className="text-base font-bold text-nexvia-ivory mb-1">Selected Work & Portfolio</h3>
              <p className="text-xs text-[#A5A298] leading-relaxed">
                Present your projects, case studies, technologies, and live URLs in a structured editorial layout that looks exceptional everywhere.
              </p>
            </div>

            {/* 03 Digital Bio */}
            <div id="bio" className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 hover:border-nexvia-amber/40 transition-colors">
              <span className="text-xs font-mono font-bold text-nexvia-amber block mb-3">03</span>
              <h3 className="text-base font-bold text-nexvia-ivory mb-1">Digital Bio & Presence</h3>
              <p className="text-xs text-[#A5A298] leading-relaxed">
                Claim your personal handle at <span className="font-mono text-nexvia-ivory">/bio/:username</span>. Customize bio, experience, social links, and themes.
              </p>
            </div>

            {/* 04 Audience Insights */}
            <div id="insights" className="bg-nexvia-charcoal-card p-6 rounded-3xl border border-nexvia-charcoal-border/70 hover:border-nexvia-amber/40 transition-colors">
              <span className="text-xs font-mono font-bold text-nexvia-amber block mb-3">04</span>
              <h3 className="text-base font-bold text-nexvia-ivory mb-1">Privacy-First Insights</h3>
              <p className="text-xs text-[#A5A298] leading-relaxed">
                Track clicks over time, unique visitors, devices, and top referrers using salted one-way IP hashing. Zero surveillance bloat.
              </p>
            </div>

          </div>
        </div>

        {/* Minimal Editorial Footer */}
        <footer className="pt-8 mt-6 border-t border-nexvia-charcoal-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77756D]">
          <div className="flex items-center gap-2">
            <NexviaLogo size="xs" dark={true} showWordmark={true} />
            <span className="text-[#55534D]">·</span>
            <span>Your work. Your links. Your next.</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} Nexvia Platform. All rights reserved.</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
