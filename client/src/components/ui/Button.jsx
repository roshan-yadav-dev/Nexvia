import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexvia-amber disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-nexvia-amber hover:bg-nexvia-amber-hover text-nexvia-charcoal font-semibold shadow-sm active:scale-[0.98]',
    secondary: 'bg-nexvia-ivory hover:bg-white text-nexvia-charcoal border border-nexvia-beige active:scale-[0.98]',
    dark: 'bg-nexvia-charcoal hover:bg-black text-white font-semibold active:scale-[0.98]',
    outline: 'border border-nexvia-charcoal text-nexvia-charcoal hover:bg-nexvia-charcoal hover:text-white active:scale-[0.98]',
    ghost: 'text-nexvia-muted hover:text-nexvia-charcoal hover:bg-black/5 active:scale-[0.98]',
    darkGhost: 'text-gray-300 hover:text-white hover:bg-white/10 active:scale-[0.98]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]'
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-[11px] gap-1',
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}
