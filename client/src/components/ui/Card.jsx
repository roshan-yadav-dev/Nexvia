import React from 'react';

export default function Card({
  children,
  variant = 'dark',
  className = '',
  ...props
}) {
  const variants = {
    ivory: 'bg-nexvia-ivory border border-nexvia-beige text-nexvia-charcoal shadow-sm',
    white: 'bg-white border border-nexvia-beige text-nexvia-charcoal shadow-sm',
    cream: 'bg-nexvia-cream border border-nexvia-beige text-nexvia-charcoal',
    dark: 'bg-nexvia-charcoal-card border border-nexvia-charcoal-border text-white shadow-sm',
    darker: 'bg-nexvia-charcoal border border-white/10 text-white shadow-sm',
    amber: 'bg-nexvia-amber text-nexvia-charcoal border border-nexvia-amber-hover',
    outline: 'bg-transparent border border-nexvia-beige text-nexvia-charcoal'
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 transition-all ${variants[variant] || variants.dark} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
