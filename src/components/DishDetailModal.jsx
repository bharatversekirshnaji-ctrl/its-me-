import React, { useEffect } from 'react';
import { X, Clock, Flame, Utensils, Heart, Sparkles, Check } from 'lucide-react';
import Flourish from './Flourish';

export default function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onOpenReservation,
  onOpenTableOrder,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Sticky/Fixed Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Dish Details"
          className="absolute top-3 right-3 z-20 p-2 bg-[#1E2D12]/90 hover:bg-[#1E2D12] text-[#F4E9D5] rounded-full border border-[#B28A4A]/50 transition-transform active:scale-95 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
          
          {/* Dish Image Header */}
          <div className="relative aspect-[16/10] w-full bg-[#16220E] overflow-hidden">
            <img
              src={dish.highResImage || dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (dish.image && e.target.src !== dish.image) {
                  e.target.src = dish.image;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-transparent to-transparent opacity-80" />
            
            {/* Badge over image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {dish.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-[#1E2D12]/90 border border-[#B28A4A]/60 text-[10px] uppercase tracking-wider text-[#F4E9D5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-serif text-2xl font-bold text-[#F4E9D5] bg-[#1E2D12]/85 px-3 py-0.5 border border-[#B28A4A]/40">
                {dish.formattedPrice}
              </span>
            </div>
          </div>

          {/* Dish Info Body */}
          <div className="p-5 sm:p-6">
            
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold block">
                  Artisanal Recipe
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1E2D12]">
                  {dish.name}
                </h3>
              </div>
            </div>

            <Flourish variant="gold" width="w-24" className="my-2" />

            <p className="text-xs sm:text-sm text-[#4A321E]/85 leading-relaxed mt-2">
              {dish.description}
            </p>

            {/* Metadata chips */}
            <div className="grid grid-cols-2 gap-2 my-4 py-3 border-y border-[#B28A4A]/25 text-xs text-[#4A321E]">
              {dish.prepTime && (
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Prep: {dish.prepTime}</span>
                </div>
              )}
              {dish.calories && (
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Energy: {dish.calories}</span>
                </div>
              )}
            </div>

            {/* Key Ingredients */}
            {dish.ingredients && (
              <div className="mb-5">
                <span className="text-[10px] uppercase tracking-wider text-[#1E2D12] font-semibold block mb-1.5">
                  Key Ingredients & Infusions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dish.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-[11px] px-2 py-0.5 bg-[#F4E9D5] text-[#1E2D12] border border-[#B28A4A]/30"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReservation?.();
                }}
                className="flex-1 py-3 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-[0.2em] font-bold border border-[#F4E9D5] transition-all shadow-md text-center"
              >
                Reserve a Table
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTableOrder?.();
                }}
                className="flex-1 py-3 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.2em] font-semibold border border-[#B28A4A] transition-all text-center"
              >
                Order at Your Table
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
