import React from 'react';

/**
 * BUNGALOW NO 6 — OFFICIAL OG BRAND LOGO
 * Features:
 * - Architectural golden bungalow arch with broken top apex
 * - Classical twin pillars with capital/base mouldings
 * - Botanical laurel/acanthus foliage leaves at the base
 * - Artisanal coffee cup & double-rim saucer
 * - Calligraphic steam gracefully rising in the numeral shape of "6"
 * - Dual floating steam wisps escaping the arch top
 * 
 * @param {Object} props
 * @param {'light'|'dark'|'gold'|'plaque'} [props.variant='light']
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {string} [props.className='']
 * @param {boolean} [props.hideText=false]
 */
export default function Logo({
  variant = 'light',
  size = 'md',
  className = '',
  hideText = false,
  onClick,
}) {
  const isDark = variant === 'dark';
  const isGold = variant === 'gold';

  const strokeColor = isDark ? '#1E2D12' : isGold ? '#B28A4A' : '#F4E9D5';
  const fillColor = isDark ? '#1E2D12' : isGold ? '#B28A4A' : '#F4E9D5';
  const textColor = isDark ? 'text-[#1E2D12]' : isGold ? 'text-[#B28A4A]' : 'text-[#F4E9D5]';
  const subtextColor = isDark ? 'text-[#4A321E]' : isGold ? 'text-[#CBA768]' : 'text-[#D9C09A]';

  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const titleSizes = {
    sm: 'text-xs tracking-[0.2em]',
    md: 'text-sm sm:text-base tracking-[0.25em]',
    lg: 'text-lg sm:text-xl tracking-[0.3em]',
    xl: 'text-2xl sm:text-3xl tracking-[0.35em]',
  };

  const subSizes = {
    sm: 'text-[8px] tracking-[0.28em]',
    md: 'text-[9px] sm:text-[10px] tracking-[0.35em]',
    lg: 'text-xs tracking-[0.4em]',
    xl: 'text-sm tracking-[0.45em]',
  };

  // SVG Unique ID for Gradients
  const gradId = `bn6-logo-gold-${variant}`;

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#2B3818' : '#D4AF37'} />
              <stop offset="50%" stopColor={isDark ? '#1E2D12' : '#F4E9D5'} />
              <stop offset="100%" stopColor={isDark ? '#16220E' : '#B28A4A'} />
            </linearGradient>
          </defs>

          {/* ================================================================= */}
          {/* 1. ARCHITECTURAL ARCH & TWIN PILLARS */}
          {/* ================================================================= */}
          
          {/* Outer Arch Left Curve */}
          <path
            d="M17 44 C17 24 32 16 43 14"
            stroke={`url(#${gradId})`}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Outer Arch Right Curve */}
          <path
            d="M57 14 C68 16 83 24 83 44"
            stroke={`url(#${gradId})`}
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Inner Concentric Arch Left Curve */}
          <path
            d="M22 44 C22 28 34 20 44 19"
            stroke={`url(#${gradId})`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Inner Concentric Arch Right Curve */}
          <path
            d="M56 19 C66 20 78 28 78 44"
            stroke={`url(#${gradId})`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Left Pillar Capital Moulding */}
          <path
            d="M14 44 H25"
            stroke={`url(#${gradId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Left Pillar Column Shafts */}
          <path
            d="M18 45 V77 M21 45 V77"
            stroke={`url(#${gradId})`}
            strokeWidth="1.2"
          />
          {/* Left Pillar Base Moulding */}
          <path
            d="M14 77 H25"
            stroke={`url(#${gradId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Right Pillar Capital Moulding */}
          <path
            d="M75 44 H86"
            stroke={`url(#${gradId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Right Pillar Column Shafts */}
          <path
            d="M79 45 V77 M82 45 V77"
            stroke={`url(#${gradId})`}
            strokeWidth="1.2"
          />
          {/* Right Pillar Base Moulding */}
          <path
            d="M75 77 H86"
            stroke={`url(#${gradId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* ================================================================= */}
          {/* 2. BOTANICAL FOLIAGE LEAVES AT PILLAR BASES */}
          {/* ================================================================= */}
          {/* Left Side Leaves */}
          <g stroke={`url(#${gradId})`} strokeWidth="1.1" fill="none">
            <path d="M16 75 C10 70 8 63 10 59 C13 64 16 69 17 73" />
            <path d="M12 65 C7 62 6 56 8 53 C10 57 12 61 14 64" />
            <path d="M14 71 C9 70 6 67 6 64 C9 66 12 68 15 70" />
            <path d="M15 76 C10 76 7 74 7 71 C10 72 13 74 16 75" />
          </g>

          {/* Right Side Leaves */}
          <g stroke={`url(#${gradId})`} strokeWidth="1.1" fill="none">
            <path d="M84 75 C90 70 92 63 90 59 C87 64 84 69 83 73" />
            <path d="M88 65 C93 62 94 56 92 53 C90 57 88 61 86 64" />
            <path d="M86 71 C91 70 94 67 94 64 C91 66 88 68 85 70" />
            <path d="M85 76 C90 76 93 74 93 71 C90 72 87 74 84 75" />
          </g>

          {/* ================================================================= */}
          {/* 3. COFFEE CUP & SAUCER */}
          {/* ================================================================= */}
          {/* Saucer Base */}
          <ellipse
            cx="50"
            cy="77"
            rx="20"
            ry="2.5"
            stroke={`url(#${gradId})`}
            strokeWidth="1.6"
            fill="none"
          />

          {/* Cup Bowl */}
          <path
            d="M32 59 C32 72 40 76 50 76 C60 76 68 72 68 59 Z"
            stroke={`url(#${gradId})`}
            strokeWidth="1.6"
            fill="none"
          />

          {/* Inner Cup Rim Line */}
          <path
            d="M36 61 C42 63 58 63 64 61"
            stroke={`url(#${gradId})`}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cup Handle (Right) */}
          <path
            d="M67 61 C73 61 74 67 69 71 C66 73 63 71 63 71"
            stroke={`url(#${gradId})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* ================================================================= */}
          {/* 4. CALLIGRAPHIC STEAM RISING AS NUMERAL "6" */}
          {/* ================================================================= */}
          <path
            d="M48 24 C45 28 43 35 44 42 C44 45 42 49 40 53 C38 57 41 62 46 63 C52 64 57 61 58 55 C59 49 53 45 46 46 C41 47 38 52 40 56 C41 58 44 59 47 58 C50 57 51 53 49 51 C47 49 44 51 44 53 C44 55 46 56 47 55 C48 54 48 53 47 52 C45 52 45 54 46 55 C43 55 42 50 46 48 C51 47 55 51 54 55 C53 59 48 61 44 59 C40 57 39 53 41 49 C43 45 47 38 47 33 C47 28 49 25 50 22 C49 23 48 23 48 24 Z"
            fill={`url(#${gradId})`}
          />

          {/* Left Steam Ribbon Accents */}
          <path
            d="M44 32 C41 36 39 42 41 46 C39 42 40 37 43 33 Z"
            fill={`url(#${gradId})`}
          />
          <path
            d="M43 27 C41 31 40 36 41 39 C39 36 40 32 42 28 Z"
            fill={`url(#${gradId})`}
          />

          {/* ================================================================= */}
          {/* 5. TOP ESCAPING STEAM WISPS (ABOVE BROKEN ARCH) */}
          {/* ================================================================= */}
          {/* Left Top Wisp */}
          <path
            d="M48 6 C46 9 46 14 49 18 C47 14 47 10 50 7 Z"
            fill={`url(#${gradId})`}
          />
          {/* Right Top Wisp */}
          <path
            d="M52 8 C50 12 50 17 53 20 C51 16 51 12 54 9 Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>

      {!hideText && (
        <div className="flex flex-col items-center mt-1.5 text-center">
          <span
            className={`font-serif font-bold uppercase ${titleSizes[size]} ${textColor} transition-colors duration-300 tracking-[0.25em]`}
          >
            BUNGALOW NO 6
          </span>
          <span
            className={`font-sans uppercase font-medium mt-0.5 ${subSizes[size]} ${subtextColor} tracking-[0.35em]`}
          >
            PREMIUM CAFÉ & LOUNGE
          </span>
        </div>
      )}
    </div>
  );
}
