import React from 'react';

export default function Badge({
  children,
  variant = 'green',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    amber: 'bg-nexvia-amber/15 text-nexvia-charcoal border border-nexvia-amber/30 font-semibold',
    dark: 'bg-nexvia-charcoal text-white font-medium border border-white/10',
    muted: 'bg-nexvia-beige/50 text-nexvia-muted border border-nexvia-beige font-medium',
    light: 'bg-white text-nexvia-charcoal border border-nexvia-beige font-medium',
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
    blue: 'bg-sky-50 text-sky-800 border border-sky-200 font-medium',
    pink: 'bg-rose-50 text-rose-800 border border-rose-200 font-medium',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200 font-medium',
    yellow: 'bg-nexvia-amber/20 text-nexvia-charcoal border border-nexvia-amber/40 font-semibold',
    gold: 'bg-nexvia-amber text-nexvia-charcoal font-bold'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[9px] uppercase tracking-wider',
    sm: 'px-2.5 py-0.5 text-[10px] uppercase tracking-wider',
    md: 'px-3 py-1 text-xs tracking-normal',
    lg: 'px-3.5 py-1.5 text-xs tracking-normal'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${variants[variant] || variants.green} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
