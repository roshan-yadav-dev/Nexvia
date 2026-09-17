import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Link2, Sparkles, FolderGit2, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from './NexviaLogo';
import Button from './ui/Button';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Selected Work', path: '/portfolio', icon: FolderGit2 },
    { name: 'Links Studio', path: '/links', icon: Link2 },
    { name: 'Bio Studio', path: '/bio-builder', icon: Sparkles }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between py-3.5 px-6 bg-nexvia-charcoal text-nexvia-ivory rounded-full border border-nexvia-charcoal-border/70 mb-8 shadow-xl">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
        <NexviaLogo size="sm" dark={true} showWordmark={true} />
      </Link>

      {/* Navigation */}
      {isAuthenticated && (
        <nav className="hidden lg:flex items-center gap-1 bg-nexvia-charcoal-card/90 p-1 rounded-full border border-nexvia-charcoal-border/50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-nexvia-amber text-nexvia-charcoal font-semibold shadow-sm'
                    : 'text-[#A5A298] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* User Actions */}
      <div className="flex items-center gap-2.5">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {user?.username && (
              <a
                href={`/bio/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#A5A298] hover:text-nexvia-amber bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-nexvia-charcoal-border transition-colors"
                title="View your live public presence"
              >
                <span>@{user.username}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-[#A5A298] hover:text-white hover:bg-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

