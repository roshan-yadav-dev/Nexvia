import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  variant = 'dark', // 'dark' | 'light'
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isLight = variant === 'light';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${isLight ? 'text-nexvia-charcoal' : 'text-gray-300'}`}>
          {label}
        </label>
      )}
      <div className="relative rounded-2xl">
        {Icon && (
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${isLight ? 'text-nexvia-muted' : 'text-gray-400'}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-2xl py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-nexvia-amber focus:border-nexvia-amber ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            isLight
              ? 'bg-white text-nexvia-charcoal border-nexvia-beige hover:border-nexvia-muted placeholder-nexvia-muted'
              : 'bg-[#181814] text-white border-white/10 hover:border-white/20 placeholder-gray-500'
          } ${
            error ? '!border-red-500 !focus:ring-red-500' : 'border'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
      {!error && helperText && <p className={`mt-1.5 text-xs ${isLight ? 'text-nexvia-muted' : 'text-gray-400'}`}>{helperText}</p>}
    </div>
  );
}
