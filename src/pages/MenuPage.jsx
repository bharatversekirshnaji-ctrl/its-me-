import React, { useState } from 'react';
import { ChefHat, Search, Sparkles, Utensils, Heart, Info, Download, CheckCircle, Eye, UtensilsCrossed } from 'lucide-react';
import Flourish from '../components/Flourish';
import { MENU_CATEGORIES, MENU_ITEMS, CHEF_SPECIALS_FEATURE } from '../data/menuData';

export default function MenuPage({
  onSelectDish,
  onOpenReservation,
  onOpenTableOrder,
  onShowToast,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const categoryMatch =
      activeCategory === 'all'
        ? true
        : activeCategory === 'chef'
        ? item.isChefSpecial
        : item.category === activeCategory;

    const dietaryMatch =
      dietaryFilter === 'all' ? true : item.dietary === dietaryFilter;

    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && dietaryMatch && searchMatch;
  });

  const handleDownloadMenu = () => {
    onShowToast?.('Bungalow No 6 Tasting Menu (PDF) generated for download.', 'success');
  };

  return (
    <div className="w-full pt-20 bg-[#FFF9EF]">
      
      {/* ========================================================================= */}
      {/* 1. MENU HERO HEADER */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 bg-[#FFF9EF] text-[#4A321E] border-b border-[#B28A4A]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-1">
            Artisanal Dining & Brews
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E2D12] tracking-tight">
            Our Menu
          </h1>

          <Flourish variant="gold" width="w-36" className="my-2" />

          <p className="font-serif text-base sm:text-lg text-[#1E2D12]/80 italic max-w-lg mx-auto">
            Thoughtfully curated flavors prepared fresh with seasonal organic harvests and artisanal craftsmanship.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                      : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search & Dietary Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 max-w-2xl mx-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#B28A4A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12] text-[#1E2D12] placeholder-[#4A321E]/50"
              />
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[11px] text-[#4A321E]/70 uppercase tracking-wider mr-1">
                Filter:
              </span>
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-medium border ${
                  dietaryFilter === 'all'
                    ? 'bg-[#1E2D12] text-[#F4E9D5] border-[#1E2D12]'
                    : 'bg-transparent text-[#4A321E] border-[#B28A4A]/40'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-2.5 py-1 text-[11px] font-medium border ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-transparent text-[#4A321E] border-[#B28A4A]/40'
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-2.5 py-1 text-[11px] font-medium border ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-800 text-white border-rose-800'
                    : 'bg-transparent text-[#4A321E] border-[#B28A4A]/40'
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MENU GRID SECTION */}
      {/* ========================================================================= */}
      <section className="py-12 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Featured Chef Feature (4 Cols) */}
            <div className="lg:col-span-4 bg-[#1E2D12] text-[#F4E9D5] p-6 sm:p-7 border border-[#B28A4A]/40 shadow-xl relative overflow-hidden">
              <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Culinary Feature</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                {CHEF_SPECIALS_FEATURE.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#D9C09A]/85 font-light leading-relaxed mb-6">
                {CHEF_SPECIALS_FEATURE.description}
              </p>

              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#B28A4A]/40 mb-6 group">
                <img
                  src={CHEF_SPECIALS_FEATURE.image}
                  alt={CHEF_SPECIALS_FEATURE.dishName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <span className="font-serif font-bold text-sm block text-white">
                      {CHEF_SPECIALS_FEATURE.dishName}
                    </span>
                    <span className="text-[10px] text-[#B28A4A]">Executive Chef Pairing</span>
                  </div>
                  <span className="font-serif font-bold text-base text-[#F4E9D5] bg-[#16220E]/90 px-2 py-0.5 border border-[#B28A4A]/50">
                    {CHEF_SPECIALS_FEATURE.price}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onOpenReservation}
                  className="w-full py-3 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-[0.25em] font-bold border border-[#F4E9D5] transition-all shadow-md"
                >
                  Reserve a Table
                </button>
              </div>
            </div>

            {/* Right Dishes Grid (8 Cols) */}
            <div className="lg:col-span-8">
              
              {filteredItems.length === 0 ? (
                <div className="text-center py-16 bg-[#F4E9D5]/30 border border-[#B28A4A]/30 p-8">
                  <Utensils className="w-10 h-10 text-[#B28A4A]/60 mx-auto mb-3" />
                  <p className="font-serif text-lg text-[#1E2D12] font-semibold">
                    No dishes found matching your criteria.
                  </p>
                  <p className="text-xs text-[#4A321E]/70 mt-1">
                    Try searching for another dish or clear filters.
                  </p>
                </div>
              ) : (
                <div key={`${activeCategory}-${dietaryFilter}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${idx * 45}ms` }}
                      className="food-card-interactive bg-white border border-[#B28A4A]/35 shadow-sm hover:shadow-md flex overflow-hidden group cursor-pointer animate-card-enter"
                      onClick={() => onSelectDish(item)}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-24 sm:w-28 shrink-0 relative bg-[#1E2D12] overflow-hidden">
                        <img
                          src={item.highResImage || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            if (item.image && e.target.src !== item.image) {
                              e.target.src = item.image;
                            }
                          }}
                        />
                        {item.isSpecial && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#B28A4A] text-[#16220E] text-[8px] uppercase tracking-wider font-bold">
                            Special
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif font-bold text-sm sm:text-base text-[#1E2D12] group-hover:text-[#B28A4A] transition-colors truncate">
                              {item.name}
                            </h4>
                            <span className="font-serif font-bold text-sm sm:text-base text-[#1E2D12] shrink-0">
                              {item.formattedPrice}
                            </span>
                          </div>

                          <p className="text-[11px] sm:text-xs text-[#4A321E]/75 line-clamp-2 mt-0.5 font-light leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#B28A4A]/20">
                          <span className="text-[9px] uppercase tracking-wider text-[#B28A4A] font-semibold">
                            {item.category} • {item.prepTime}
                          </span>

                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1E2D12] group-hover:text-[#B28A4A] flex items-center space-x-1">
                            <Eye className="w-3 h-3 text-[#B28A4A]" />
                            <span>View Details</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar Under Menu */}
              <div className="mt-8 pt-6 border-t border-[#B28A4A]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A321E]/80">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onOpenReservation}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#B28A4A] text-[#16220E] font-serif uppercase tracking-wider text-xs font-bold hover:bg-[#1E2D12] hover:text-[#F4E9D5] transition-colors shadow-sm"
                  >
                    <span>Reserve a Table</span>
                  </button>

                  <button
                    onClick={onOpenTableOrder}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1E2D12] text-[#F4E9D5] font-serif uppercase tracking-wider text-xs font-semibold hover:bg-[#2A3C1B] transition-colors"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#B28A4A]" />
                    <span>Order at Your Table</span>
                  </button>
                </div>

                <button
                  onClick={handleDownloadMenu}
                  className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-[#1E2D12] hover:text-[#B28A4A] transition-colors"
                >
                  <Download className="w-4 h-4 text-[#B28A4A]" />
                  <span>Download Complete Menu (PDF)</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BOTTOM BANNER */}
      {/* ========================================================================= */}
      <section className="bg-[#1E2D12] text-[#F4E9D5] py-14 sm:py-16 border-t border-[#B28A4A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-[#F4E9D5]">
              Good Food &nbsp;|&nbsp; Good Mood &nbsp;|&nbsp; Great Memories
            </h2>
            <Flourish variant="gold" width="w-48" className="my-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border border-[#B28A4A]/30 bg-[#16220E]/50">
              <span className="font-serif font-bold text-2xl text-[#B28A4A] block">100%</span>
              <span className="text-xs uppercase tracking-wider text-[#D9C09A] mt-1 block">Fresh Ingredients</span>
            </div>
            <div className="p-4 border border-[#B28A4A]/30 bg-[#16220E]/50">
              <span className="font-serif font-bold text-2xl text-[#B28A4A] block">16+</span>
              <span className="text-xs uppercase tracking-wider text-[#D9C09A] mt-1 block">Signature Mocktails</span>
            </div>
            <div className="p-4 border border-[#B28A4A]/30 bg-[#16220E]/50">
              <span className="font-serif font-bold text-2xl text-[#B28A4A] block">4.9 ★</span>
              <span className="text-xs uppercase tracking-wider text-[#D9C09A] mt-1 block">Guest Rating</span>
            </div>
            <div className="p-4 border border-[#B28A4A]/30 bg-[#16220E]/50">
              <span className="font-serif font-bold text-2xl text-[#B28A4A] block">16</span>
              <span className="text-xs uppercase tracking-wider text-[#D9C09A] mt-1 block">Boutique Tables</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
