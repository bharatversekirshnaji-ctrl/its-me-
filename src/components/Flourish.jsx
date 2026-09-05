import React from 'react';

/**
 * Decorative Flourish Divider for Section Headings
 * Matches the reference mockup's elegant gold filigree style.
 */
export default function Flourish({
  variant = 'gold',
  className = '',
  width = 'w-44',
}) {
  const isDark = variant === 'dark';
  const isCream = variant === 'cream';

  const lineColor = isDark
    ? '#1E2D12'
    : isCream
    ? '#F4E9D5'
    : '#B28A4A';

  const dotColor = isDark
    ? 'bg-[#1E2D12]'
    : isCream
    ? 'bg-[#F4E9D5]'
    : 'bg-[#B28A4A]';

  return (
    <div className={`flex items-center justify-center space-x-3 my-3 select-none ${className}`}>
      {/* Left decorative line */}
      <div
        className={`h-[1px] ${width}`}
        style={{
          background: `linear-gradient(to right, transparent, ${lineColor})`,
          opacity: 0.75,
        }}
      />
      
      {/* Center filigree emblem */}
      <div className="flex items-center space-x-1.5 opacity-90">
        <span className={`w-1.5 h-1.5 rotate-45 ${dotColor}`} />
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke={lineColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2 L15 8 L21 9 L16.5 13.5 L18 19.5 L12 16 L6 19.5 L7.5 13.5 L3 9 L9 8 Z" />
        </svg>
        <span className={`w-1.5 h-1.5 rotate-45 ${dotColor}`} />
      </div>

      {/* Right decorative line */}
      <div
        className={`h-[1px] ${width}`}
        style={{
          background: `linear-gradient(to left, transparent, ${lineColor})`,
          opacity: 0.75,
        }}
      />
    </div>
  );
}

export function OrnamentalHeading({
  eyebrow,
  title,
  subtitle,
  scriptAccent,
  dark = false,
  className = '',
  align = 'center',
}) {
  const alignClass =
    align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#B28A4A] mb-1">
          {eyebrow}
        </span>
      )}

      {title && (
        <h2
          className={`font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide ${
            dark ? 'text-[#F4E9D5]' : 'text-[#1E2D12]'
          }`}
        >
          {title}
        </h2>
      )}

      <Flourish
        variant={dark ? 'gold' : 'gold'}
        className={align === 'left' ? 'justify-start my-2' : 'my-2'}
      />

      {scriptAccent && (
        <span className="font-script text-2xl sm:text-3xl text-[#B28A4A] my-1">
          {scriptAccent}
        </span>
      )}

      {subtitle && (
        <p
          className={`max-w-xl text-sm sm:text-base leading-relaxed ${
            dark ? 'text-[#D9C09A]/90' : 'text-[#4A321E]/80'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
