import React from 'react';

interface EtenDelenLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'inverted' | 'stacked' | 'certificate';
  className?: string;
  onClick?: () => void;
}

export const EtenDelenLogo: React.FC<EtenDelenLogoProps> = ({
  size = 'md',
  showTagline = false,
  variant = 'full',
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    xs: 'w-7 h-8',
    sm: 'w-9 h-11',
    md: 'w-11 h-13',
    lg: 'w-16 h-19',
    xl: 'w-24 h-28',
    hero: 'w-32 h-38',
  };

  const scriptTextSizes = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
    hero: 'text-5xl sm:text-6xl',
  };

  const taglineSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-xs',
    lg: 'text-xs',
    xl: 'text-sm',
    hero: 'text-base',
  };

  const isInverted = variant === 'inverted';
  const isStacked = variant === 'stacked' || size === 'hero' || size === 'xl';

  return (
    <div
      onClick={onClick}
      className={`inline-flex ${
        isStacked ? 'flex-col items-center text-center' : 'items-center'
      } gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Official EtenDelen Logo Emblem (Teardrop Geopin + Green Leaf + Orange & Charcoal Embracing Figures + Food Bowl) */}
      <div
        className={`relative flex-shrink-0 ${iconDimensions[size]} transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* 1. Outer Map Pin / Teardrop Outline (Dark Charcoal #2b2f33) */}
          <path
            d="M100 226 C82 202, 28 148, 28 92 C28 44, 60 16, 100 16 C140 16, 172 44, 172 92 C172 148, 118 202, 100 226 Z"
            stroke={isInverted ? '#f1f5f9' : '#2b2f33'}
            strokeWidth="11"
            strokeLinejoin="round"
            fill={isInverted ? 'rgba(15, 23, 42, 0.7)' : '#ffffff'}
          />

          {/* 2. Left Side: Natural Green Leaf with Curved Vein (#439e33) */}
          <path
            d="M100 216 C95 180, 84 135, 62 105 C48 84, 46 58, 56 36 C68 24, 88 18, 92 36 C95 56, 85 86, 78 114 C71 144, 86 182, 100 216 Z"
            fill="#439e33"
          />
          <path
            d="M92 36 C84 65, 73 105, 80 148 C84 175, 94 200, 100 216"
            stroke={isInverted ? '#0f172a' : '#ffffff'}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 3. Right Side: Top Orange Person Head (#e06236) */}
          <circle cx="128" cy="58" r="11" fill="#e06236" />

          {/* Top Orange Person Arch / Reaching Arm (#e06236) */}
          <path
            d="M98 88 C105 68, 126 66, 146 78 C153 83, 156 94, 150 108"
            stroke="#e06236"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Center Orange Food Sharing Bowl (#e06236) */}
          <path
            d="M78 96 L124 96 C124 116, 78 116, 78 96 Z"
            fill="#e06236"
          />

          {/* Lower Charcoal Figure Embrace & Hand/Head dot (#2b2f33) */}
          <path
            d="M98 126 C114 138, 136 136, 144 120 C148 112, 146 102, 140 96"
            stroke={isInverted ? '#f1f5f9' : '#2b2f33'}
            strokeWidth="8.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx="139"
            cy="97"
            r="9.5"
            fill={isInverted ? '#f1f5f9' : '#2b2f33'}
          />
        </svg>
      </div>

      {/* Typography: Exact Calligraphic Script Wordmark "Eten Delen" */}
      {variant !== 'icon' && (
        <div className={`flex flex-col ${isStacked ? 'items-center' : 'items-start'} leading-none`}>
          <div
            className={`font-['Caveat','Dancing_Script',cursive] font-bold tracking-tight select-none ${scriptTextSizes[size]}`}
            style={{ letterSpacing: '0.02em' }}
          >
            {/* "Eten" */}
            <span className={isInverted ? 'text-white' : 'text-[#1e2327]'}>
              E
            </span>
            <span className={isInverted ? 'text-amber-400' : 'text-[#b88523]'}>
              ten
            </span>

            <span className="inline-block w-2 sm:w-3" />

            {/* "Delen" */}
            <span className={isInverted ? 'text-white' : 'text-[#1e2327]'}>
              D
            </span>
            <span className={isInverted ? 'text-amber-400' : 'text-[#b88523]'}>
              elen
            </span>
          </div>

          {showTagline && (
            <p
              className={`font-sans font-semibold tracking-wide mt-1.5 ${taglineSizes[size]} ${
                isInverted ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Share Surplus. Reduce Waste. Feed Communities.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
