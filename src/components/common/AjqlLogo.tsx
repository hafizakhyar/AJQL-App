import React from 'react';

interface AjqlLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem' | 'horizontal';
  showSubtitle?: boolean;
  className?: string;
}

export const AjqlLogo: React.FC<AjqlLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  className = '',
}) => {
  // Dimensions for the emblem / icon
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  // If horizontal variant: emblem icon on left + text on right
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src="/logo.svg"
          alt="AJQL Logo - Al Jannah Quran Learning"
          className={`${iconDimensions} object-contain shrink-0`}
        />
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg text-emerald-900 tracking-tight">
              AJQL App
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              Masjid Al-Jannah
            </span>
          </div>
          {showSubtitle && (
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Al Jannah Quran Learning
            </p>
          )}
        </div>
      </div>
    );
  }

  // If emblem only
  if (variant === 'emblem') {
    return (
      <img
        src="/favicon.svg"
        alt="AJQL Emblem"
        className={`${iconDimensions} object-contain ${className}`}
      />
    );
  }

  // Full official logo from /public/logo.svg
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src="/logo.svg"
        alt="AJQL Logo - Al Jannah Quran Learning"
        className={`${iconDimensions} object-contain`}
      />
    </div>
  );
};
