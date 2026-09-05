import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { soundService } from '../services/soundService.js';

export default function LightboxModal({
  isOpen,
  activeImage,
  images = [],
  onClose,
  onNext,
  onPrev,
}) {
  // Play open whoosh when lightbox appears
  useEffect(() => {
    if (isOpen && activeImage) {
      soundService.playWhoosh(0.28);
    }
  }, [isOpen, activeImage?.id]);

  const handleClose = () => {
    soundService.playWhoosh(0.16); // shorter reverse-style fade on close
    onClose();
  };

  const handleNav = (direction) => {
    soundService.playClick(1600);
    direction === 'next' ? onNext() : onPrev();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNav('next');
      if (e.key === 'ArrowLeft') handleNav('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !activeImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md animate-fadeIn">

      {/* Top Bar with counter & close */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-[#F4E9D5]">
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase tracking-[0.2em] font-serif text-[#B28A4A]">
            Bungalow No 6 Gallery
          </span>
          <span className="text-xs text-[#D9C09A]/60">
            • {images.findIndex((img) => img.id === activeImage.id) + 1} / {images.length}
          </span>
        </div>

        <button
          onClick={handleClose}
          className="p-2 text-[#F4E9D5]/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => handleNav('prev')}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-[#F4E9D5] hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-all duration-200 z-20"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => handleNav('next')}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-[#F4E9D5] hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-all duration-200 z-20"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Center Image Container */}
      <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center z-10">
        <div className="relative overflow-hidden rounded-sm shadow-2xl border border-[#B28A4A]/30">
          <img
            src={activeImage.highResImage || activeImage.localImage}
            alt={activeImage.title}
            className="max-h-[70vh] w-auto max-w-full object-contain select-none"
            onError={(e) => {
              // fallback to local reference crop if high res fails
              if (activeImage.localImage && e.target.src !== activeImage.localImage) {
                e.target.src = activeImage.localImage;
              }
            }}
          />
        </div>

        {/* Caption & Category metadata */}
        <div className="mt-4 text-center text-[#F4E9D5] max-w-lg px-4">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#1E2D12] border border-[#B28A4A]/40 text-[10px] uppercase tracking-widest text-[#B28A4A] mb-1.5">
            <Tag className="w-2.5 h-2.5" />
            <span>{activeImage.categoryName || activeImage.category}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide">
            {activeImage.title}
          </h3>
          {activeImage.description && (
            <p className="text-xs sm:text-sm text-[#D9C09A]/80 font-light mt-1">
              {activeImage.description}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
