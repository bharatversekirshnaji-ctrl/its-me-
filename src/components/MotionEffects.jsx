import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService.js';

export function triggerFlyToCart({ image, startX, startY, endX, endY, onArrive }) {
  if (typeof document === 'undefined') return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) {
    onArrive?.();
    return;
  }

  // Play initial tactile click + subtle whoosh sound
  soundService.playClick(2100);
  soundService.playWhoosh(0.4);

  // Create single physical element
  const flyEl = document.createElement('div');
  flyEl.style.position = 'fixed';
  flyEl.style.left = '0px';
  flyEl.style.top = '0px';
  flyEl.style.width = '64px';
  flyEl.style.height = '64px';
  flyEl.style.borderRadius = '50%';
  flyEl.style.backgroundImage = `url(${image})`;
  flyEl.style.backgroundSize = 'cover';
  flyEl.style.backgroundPosition = 'center';
  flyEl.style.boxShadow = '0 12px 32px rgba(22, 34, 14, 0.5), 0 0 16px rgba(178, 138, 74, 0.65)';
  flyEl.style.border = '2.5px solid #B28A4A';
  flyEl.style.zIndex = '999999';
  flyEl.style.pointerEvents = 'none';
  flyEl.style.willChange = 'transform, opacity';
  flyEl.style.transform = `translate3d(${startX}px, ${startY}px, 0) translate(-50%, -50%) scale(1.15)`;
  flyEl.setAttribute('aria-hidden', 'true');

  document.body.appendChild(flyEl);

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const midX = startX + deltaX * 0.45;
  const midY = Math.min(startY, endY) - Math.max(90, Math.abs(deltaX) * 0.28);

  const startTime = performance.now();
  const duration = 560; // ms

  let animFrameId;

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Quadratic Bezier curve
    const t = progress;
    const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const currentX = (1 - easeT) * (1 - easeT) * startX + 2 * (1 - easeT) * easeT * midX + easeT * easeT * endX;
    const currentY = (1 - easeT) * (1 - easeT) * startY + 2 * (1 - easeT) * easeT * midY + easeT * easeT * endY;

    const currentScale = 1.15 - easeT * 0.92;
    const currentRotation = easeT * 35;
    const currentOpacity = progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1;

    flyEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale}) rotate(${currentRotation}deg)`;
    flyEl.style.opacity = currentOpacity;

    if (progress < 1) {
      animFrameId = requestAnimationFrame(animate);
    } else {
      // Reached destination: trigger metallic gold cart tick sound & bounce
      cancelAnimationFrame(animFrameId);
      soundService.playCartArrival();
      onArrive?.();
      flyEl.remove();
    }
  };

  animFrameId = requestAnimationFrame(animate);
}

export function FlyingFoodItem() {
  return null;
}



// ----------------------------------------------------------------------------
// 2. ANIMATED TICKER NUMBER (Smooth Vertical Roll Transition)
// ----------------------------------------------------------------------------
export function AnimatedNumber({ value, className = '' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('up');

  useEffect(() => {
    if (value !== displayValue) {
      setDirection(value > displayValue ? 'up' : 'down');
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span className={`inline-block overflow-hidden h-[1.25em] leading-none relative ${className}`}>
      <span
        className={`inline-block transition-transform duration-180 ease-out font-mono font-bold ${
          isAnimating
            ? direction === 'up'
              ? '-translate-y-full opacity-0'
              : 'translate-y-full opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {displayValue}
      </span>
    </span>
  );
}

// ----------------------------------------------------------------------------
// 3. SUCCESS CHECKMARK DRAWING ANIMATION (Apple / Bungalow Luxury Style)
// ----------------------------------------------------------------------------
export function AnimatedSuccessCheckmark({ size = 64, color = '#B28A4A' }) {
  return (
    <div className="flex items-center justify-center my-4">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Outer Circular Path */}
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: 176,
            strokeDashoffset: 176,
            animation: 'drawCircle 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards',
          }}
        />
        {/* Glowing Background Disc */}
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="rgba(178, 138, 74, 0.15)"
          style={{
            animation: 'fadeInDisc 0.4s ease forwards 0.3s',
            opacity: 0,
          }}
        />
        {/* Inner Checkmark Path */}
        <path
          d="M20 33.5L28.5 42L44 24"
          stroke="#F4E9D5"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 40,
            strokeDashoffset: 40,
            animation: 'drawCheck 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.4s',
          }}
        />
      </svg>
      <style>{`
        @keyframes drawCircle {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeInDisc {
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
