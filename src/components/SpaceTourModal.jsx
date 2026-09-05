import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Users, Sparkles, MapPin } from 'lucide-react';
import { SPACE_ZONES } from '../data/spaceData';
import Logo from './Logo';
import Flourish from './Flourish';

export default function SpaceTourModal({ isOpen, onClose, onOpenReservation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentZone = SPACE_ZONES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPACE_ZONES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SPACE_ZONES.length) % SPACE_ZONES.length);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      style={{ overflowY: 'auto' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] my-auto animate-scale-up"
      >
        {/* Top Gold Bar */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#1E2D12] via-[#B28A4A] to-[#1E2D12]" />

        {/* Sticky Header with Title and Close Button */}
        <div className="shrink-0 sticky top-0 z-30 bg-[#FFF9EF] border-b border-[#B28A4A]/25 px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold block">
              Bungalow Architecture Tour
            </span>
            <span className="text-xs text-[#4A321E]/60">• {currentIndex + 1} of {SPACE_ZONES.length}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#1E2D12]/10 hover:bg-[#1E2D12] hover:text-[#F4E9D5] text-[#1E2D12] border border-[#B28A4A]/40 transition-colors shrink-0"
            aria-label="Close Space Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Grid: Image on Left/Top, Details on Right/Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto overscroll-contain">
          {/* Left Column: Image with Nav Arrows */}
          <div className="md:col-span-7 relative h-64 md:h-auto min-h-[260px] bg-[#16220E] overflow-hidden">
            <img
              src={currentZone.highResImage || currentZone.image}
              alt={currentZone.title}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                if (currentZone.image && e.target.src !== currentZone.image) {
                  e.target.src = currentZone.image;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Slider arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white bg-black/60 hover:bg-[#B28A4A] rounded-full transition-colors"
              aria-label="Previous Zone"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white bg-black/60 hover:bg-[#B28A4A] rounded-full transition-colors"
              aria-label="Next Zone"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Badge */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-serif italic text-sm text-[#D9C09A]">
                {currentZone.subtitle}
              </span>
            </div>
          </div>

          {/* Right Column: Details & Features */}
          <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-[#FFF9EF]">
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold mb-1">
                <MapPin className="w-3 h-3" />
                <span>Zone Details</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1E2D12]">
                {currentZone.title}
              </h3>

              <div className="w-12 h-[1px] bg-[#B28A4A] my-2" />

              <p className="text-xs sm:text-sm text-[#4A321E]/80 leading-relaxed">
                {currentZone.description}
              </p>

              {/* Best for & capacity */}
              <div className="my-3 p-2.5 bg-[#F4E9D5]/60 border border-[#B28A4A]/30 text-xs space-y-1">
                <div className="flex items-center space-x-2 text-[#1E2D12] font-medium">
                  <Users className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>{currentZone.capacity}</span>
                </div>
                <div className="text-[11px] text-[#4A321E]/80 italic">
                  Best for: {currentZone.bestFor}
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-1 mb-4">
                <span className="text-[10px] uppercase tracking-wider text-[#1E2D12] font-semibold block">
                  Atmospheric Highlights
                </span>
                {currentZone.features.map((feat) => (
                  <div key={feat} className="flex items-center space-x-2 text-xs text-[#4A321E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B28A4A]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#B28A4A]/20">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReservation();
                }}
                className="w-full py-2.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.2em] border border-[#B28A4A] transition-colors"
              >
                Reserve in this Space
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
