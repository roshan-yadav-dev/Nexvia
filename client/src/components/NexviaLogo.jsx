import React from 'react';
import { Link } from 'react-router-dom';

export default function NexviaLogo({
  size = 'md',
  variant = 'dark',
  showIcon = true,
  to = '/',
  className = ''
}) {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', glyph: 'w-3 h-3' },
    md: { icon: 'w-8 h-8', text: 'text-xl', glyph: 'w-4 h-4' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', glyph: 'w-5 h-5' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const textColor = {
    dark: 'text-nexvia-charcoal',
    light: 'text-white',
    amber: 'text-nexvia-amber'
  }[variant] || 'text-nexvia-charcoal';

  const iconBg = {
    dark: 'bg-nexvia-charcoal text-nexvia-amber',
    light: 'bg-nexvia-ivory text-nexvia-charcoal',
    amber: 'bg-nexvia-amber text-nexvia-charcoal'
  }[variant] || 'bg-nexvia-charcoal text-nexvia-amber';

  const content = (
    <span className={`inline-flex items-center gap-2.5 font-sans tracking-tight group ${className}`}>
      {showIcon && (
        <span
          className={`${currentSize.icon} ${iconBg} rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm border border-black/5`}
        >
          {/* Minimal forward connection mark */}
          <svg
            viewBox="0 0 24 24"
            className={`${currentSize.glyph} stroke-current`}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M17 7H9M17 7V15" />
          </svg>
        </span>
      )}
      <span className={`font-bold ${currentSize.text} ${textColor} tracking-tight font-display`}>
        nexvia
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-nexvia-amber rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
