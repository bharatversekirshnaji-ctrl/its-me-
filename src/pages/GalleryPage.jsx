import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Calendar, Tag } from 'lucide-react';
import Flourish from '../components/Flourish';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../data/galleryData';
import { soundService } from '../services/soundService.js';

export default function GalleryPage({
  onSelectImage,
  onOpenReservation,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayedItems, setDisplayedItems] = useState(GALLERY_ITEMS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [entryKey, setEntryKey] = useState(0);

  const handleCategoryChange = (catId) => {
    if (catId === activeCategory) return;
    soundService.playClick(1700);
    setIsTransitioning(true);

    setTimeout(() => {
      const filtered = catId === 'all'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.category === catId);
      setDisplayedItems(filtered);
      setActiveCategory(catId);
      setEntryKey((k) => k + 1);
      setIsTransitioning(false);
    }, 160);
  };

  const handleSelectImage = (item) => {
    soundService.playWhoosh(0.25);
    onSelectImage(item);
  };

  return (
    <div className="w-full pt-20 bg-[#FFF9EF]">

      {/* ========================================================================= */}
      {/* 1. GALLERY HEADER */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 bg-[#FFF9EF] text-[#4A321E] border-b border-[#B28A4A]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-1 hero-reveal hero-reveal-d1">
            Visual Memories &amp; Ambience
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E2D12] tracking-tight hero-reveal hero-reveal-d2">
            Gallery
          </h1>

          <Flourish variant="gold" width="w-36" className="my-2 hero-reveal hero-reveal-d3" />

          <p className="font-serif text-base sm:text-lg text-[#1E2D12]/80 italic max-w-lg mx-auto hero-reveal hero-reveal-d4">
            A glimpse into life at Bungalow No 6 — where nature, architecture, and gastronomy come together.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 hero-reveal hero-reveal-d5">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 btn-tactile ${isActive
                    ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                    : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                    }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. GALLERY GRID — Staggered entrance on category switch */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            key={entryKey}
          >
            {displayedItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleSelectImage(item)}
                className="gallery-card-enter group cursor-pointer relative overflow-hidden bg-[#1E2D12] border border-[#B28A4A]/30 shadow-luxury"
                style={{ animationDelay: `${idx * 55}ms` }}
              >
                {/* Image with smooth zoom */}
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={item.highResImage || item.localImage}
                    alt={item.title}
                    className="w-full h-full object-cover gallery-img-zoom"
                    onError={(e) => {
                      if (item.localImage && e.target.src !== item.localImage) {
                        e.target.src = item.localImage;
                      }
                    }}
                  />

                  {/* Dark gradient overlay — slides up on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-[#16220E]/30 to-transparent opacity-0 group-hover:opacity-95 transition-opacity duration-350" />

                  {/* Gold accent line at bottom — slides in on hover */}
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[#B28A4A] to-[#F4E9D5] transition-all duration-500" />

                  {/* Hover info content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-[#F4E9D5]">

                    {/* Top category badge */}
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-widest text-[#B28A4A] bg-[#1E2D12]/90 px-2 py-0.5 border border-[#B28A4A]/40">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{item.categoryName}</span>
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white ring-1 ring-[#B28A4A]/40">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Title & Caption */}
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#D9C09A]/80 font-light mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <span className="inline-block mt-2 text-[10px] uppercase tracking-widest text-[#B28A4A] font-semibold">
                        Tap to view
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BOTTOM CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-12 bg-[#1E2D12] text-[#F4E9D5] border-t border-[#B28A4A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-[#16220E] border border-[#B28A4A]/40 shadow-2xl">

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border border-[#B28A4A] flex items-center justify-center text-[#B28A4A] shrink-0 bg-[#1E2D12]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F4E9D5]">
                  Celebrate every moment with us.
                </h3>
                <p className="text-xs sm:text-sm text-[#D9C09A]/85 font-light mt-0.5">
                  Book your table now for evening dinners, birthdays, or intimate coffee dates.
                </p>
              </div>
            </div>

            <button
              onClick={() => { soundService.playClick(2200); onOpenReservation(); }}
              className="px-8 py-3.5 bg-transparent hover:bg-[#B28A4A] text-[#F4E9D5] hover:text-[#16220E] font-serif text-xs uppercase tracking-[0.25em] font-semibold border border-[#B28A4A] transition-all duration-300 shrink-0 shadow-lg btn-tactile"
            >
              Reserve a Table
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}
