import React, { useState } from 'react';
import { 
  ArrowDown, Sparkles, Utensils, HeartHandshake, ShieldCheck, Clock, 
  Award, Star, ArrowRight, Compass, Coffee, Cake, Flame, Check, Play,
  ChevronRight, Heart, Users, MapPin, Eye, UtensilsCrossed, Leaf, Music, Shield
} from 'lucide-react';
import Flourish, { OrnamentalHeading } from '../components/Flourish';
import { MENU_ITEMS } from '../data/menuData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function HomePage({
  setActivePage,
  onOpenReservation,
  onOpenTableOrder,
  onSelectDish,
  onOpenSpaceTour,
}) {
  const specials = MENU_ITEMS.filter((item) => item.isSpecial).slice(0, 4);

  // Scroll reveal hooks for each section
  const [welcomeRef, isWelcomeVisible] = useScrollReveal({ threshold: 0.15 });
  const [spacesRef, isSpacesVisible] = useScrollReveal({ threshold: 0.15 });
  const [specialsRef, isSpecialsVisible] = useScrollReveal({ threshold: 0.15 });
  const [ctaRef, isCtaVisible] = useScrollReveal({ threshold: 0.15 });

  const scrollToWelcome = () => {
    const el = document.getElementById('welcome-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTableOrder = () => {
    if (onOpenTableOrder) {
      onOpenTableOrder();
    } else {
      setActivePage('table-order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Measured Cinematic Royal Entrance & Ambient Lighting) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-[96vh] flex items-center justify-center bg-[#16220E] text-[#F4E9D5] overflow-hidden pt-20">
        
        {/* Background Image: Night Courtyard Atmosphere with Jeep & Lanterns */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/hero_ambience.jpg"
            alt="Bungalow No 6 Courtyard Evening"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[12000ms] ease-out"
            onError={(e) => {
              e.target.src = '/assets/hero_ambience.jpg';
            }}
          />
          {/* Tropical botanical texture overlay - subtle atmospheric depth */}
          <div className="absolute inset-0 pointer-events-none bg-repeat opacity-10 mix-blend-overlay" style={{backgroundImage:"url('/assets/texture_tropical.jpg')",backgroundSize:'400px auto'}} />
          {/* Dark luxury gradient overlays for pristine text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#16220E]/90 via-[#16220E]/70 to-[#16220E]/95" />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Slow Organic Ambient Warm Glows */}
          <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-[#B28A4A]/15 rounded-full blur-3xl pointer-events-none animate-aura-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-[#39431E]/35 rounded-full blur-3xl pointer-events-none animate-float-gentle" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center py-16">
          
          {/* Eyebrow Floating Pill */}
          <div 
            className="inline-flex items-center space-x-2.5 px-4 py-1.5 mb-5 border border-[#B28A4A]/50 bg-[#1E2D12]/85 backdrop-blur-md shadow-lg animate-hero-fade animate-float-gentle"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B28A4A]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#F4E9D5] font-semibold">
              PREMIUM CAFÉ & LOUNGE
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B28A4A]" />
          </div>

          {/* Main Heading */}
          <h1 
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F4E9D5] mb-2 drop-shadow-2xl animate-hero-fade"
            style={{ animationDelay: '0.25s' }}
          >
            Bungalow No 6
          </h1>

          {/* Supporting Script Line */}
          <span 
            className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#B28A4A] mb-4 drop-shadow-md animate-hero-fade animate-shimmer-text"
            style={{ animationDelay: '0.4s' }}
          >
            Soulful Moments & Artisanal Dining
          </span>

          {/* Gold Decorative Divider */}
          <div className="animate-hero-fade animate-breath" style={{ animationDelay: '0.45s' }}>
            <Flourish variant="gold" width="w-40 sm:w-64" className="my-3" />
          </div>

          {/* Supporting Text */}
          <p 
            className="font-serif text-lg sm:text-xl md:text-2xl text-[#F4E9D5]/95 max-w-2xl font-light tracking-wide mb-2 italic animate-hero-fade"
            style={{ animationDelay: '0.55s' }}
          >
            A perfect blend of luxury, comfort, and cuisine.
          </p>
          <p 
            className="text-xs sm:text-sm md:text-base text-[#D9C09A]/85 max-w-xl font-light tracking-wider leading-relaxed mb-10 animate-hero-fade"
            style={{ animationDelay: '0.65s' }}
          >
            Experience candlelit cobblestone courtyards, slow-brewed specialty coffees, and unforgettable dining.
          </p>

          {/* Hero Action Buttons: 3 Interactive Options */}
          <div 
            className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto animate-hero-fade"
            style={{ animationDelay: '0.75s' }}
          >
            
            {/* 1. Reserve a Table (Cream Filled) */}
            <button
              type="button"
              onClick={onOpenReservation}
              className="btn-shimmer animate-gold-pulse w-full sm:w-auto px-8 py-3.5 bg-[#F4E9D5] hover:bg-white text-[#1E2D12] font-serif text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Reserve a Table</span>
            </button>

            {/* 2. Order at Your Table (Gold Outlined) */}
            <button
              type="button"
              onClick={handleOpenTableOrder}
              className="btn-shimmer w-full sm:w-auto px-8 py-3.5 bg-[#1E2D12]/90 hover:bg-[#B28A4A]/30 text-[#F4E9D5] border border-[#B28A4A] font-serif text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 hover:border-[#F4E9D5] hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#B28A4A]" />
              <span>Order at Your Table</span>
            </button>

            {/* 3. View Menu Button */}
            <button
              type="button"
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-transparent hover:bg-white/10 text-[#D9C09A] hover:text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.2em] font-semibold transition-colors border border-transparent hover:border-white/20"
            >
              View Menu
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <button
            onClick={scrollToWelcome}
            aria-label="Scroll to Welcome Section"
            className="mt-14 p-2.5 rounded-full border border-[#B28A4A]/50 text-[#F4E9D5] hover:border-[#F4E9D5] hover:text-[#B28A4A] transition-all duration-300 animate-bounce cursor-pointer hover:bg-white/5"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WELCOME SECTION (Scroll-driven slide and depth reveal) */}
      {/* ========================================================================= */}
      <section
        id="welcome-section"
        ref={welcomeRef}
        className="py-20 sm:py-28 bg-[#FFF9EF] text-[#4A321E] relative border-b border-[#B28A4A]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Welcome Editorial (Slide in from Left) */}
            <div className={`lg:col-span-5 flex flex-col items-start space-y-4 reveal-left-init ${isWelcomeVisible ? 'reveal-left-active' : ''}`}>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B28A4A] font-semibold">
                Welcome to
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E2D12] tracking-tight leading-tight">
                Bungalow No 6
              </h2>

              <Flourish variant="gold" width="w-24" className="my-1 justify-start" />

              <p className="text-sm sm:text-base text-[#4A321E]/85 leading-relaxed font-light">
                Where elegance meets taste. Our space is inspired by nature, designed for comfort, and crafted for unforgettable experiences.
              </p>

              <p className="text-xs sm:text-sm text-[#4A321E]/75 leading-relaxed font-light">
                Nestled amidst towering foliage, Bungalow No 6 brings together artisanal culinary creations, slow-brewed specialty coffees, and cozy spaces meant for books, heartfelt conversations, and celebration.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-shimmer px-6 py-3 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.25em] font-semibold border border-[#B28A4A] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B28A4A]" />
                </button>

                <button
                  onClick={() => onOpenSpaceTour?.()}
                  className="px-5 py-3 bg-[#F4E9D5] hover:bg-[#1E2D12] hover:text-[#F4E9D5] text-[#1E2D12] font-serif text-xs uppercase tracking-[0.2em] font-semibold border border-[#B28A4A]/50 transition-all duration-300 hover:scale-105 flex items-center space-x-1.5 shadow-sm"
                >
                  <Compass className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>360° Space Tour</span>
                </button>
              </div>
            </div>

            {/* Right Column: Three Premium Vertical Cards (Staggered Slide up from Right) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              
              {/* Card 1: The Library Lounge */}
              <div
                onClick={() => onOpenSpaceTour?.()}
                className={`luxury-card group cursor-pointer relative overflow-hidden bg-[#1E2D12] border border-[#B28A4A]/35 shadow-md reveal-init delay-150 ${
                  isWelcomeVisible ? 'reveal-active' : ''
                }`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src="/assets/space_library_real.jpg"
                    alt="The Library & Reading Lounge"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/assets/about_library.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-[#16220E]/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] block mb-1 font-semibold">
                    Ambience
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#F4E9D5]">
                    Library Sanctuary
                  </h3>
                </div>
              </div>

              {/* Card 2: Culinary Excellence */}
              <div
                onClick={() => {
                  setActivePage('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`luxury-card group cursor-pointer relative overflow-hidden bg-[#1E2D12] border border-[#B28A4A]/35 shadow-md reveal-init delay-300 ${
                  isWelcomeVisible ? 'reveal-active' : ''
                }`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src="/assets/specials_pasta.jpg"
                    alt="Premium Cuisine"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/assets/welcome_food.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-[#16220E]/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] block mb-1 font-semibold">
                    Culinary
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#F4E9D5]">
                    Artisanal Cuisine
                  </h3>
                </div>
              </div>

              {/* Card 3: The Jeep Courtyard */}
              <div
                onClick={() => {
                  setActivePage('gallery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`luxury-card group cursor-pointer relative overflow-hidden bg-[#1E2D12] border border-[#B28A4A]/35 shadow-md reveal-init delay-450 ${
                  isWelcomeVisible ? 'reveal-active' : ''
                }`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src="/assets/space_jeep_real.jpg"
                    alt="Vintage Jeep Courtyard"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/assets/gallery_jeep.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-[#16220E]/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] block mb-1 font-semibold">
                    Heritage
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#F4E9D5]">
                    The Jeep Courtyard
                  </h3>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ARCHITECTURAL SPACES & CULINARY CRAFT (Editorial Heritage Showcase) */}
      {/* ========================================================================= */}
      <section 
        ref={spacesRef}
        className="py-20 sm:py-28 bg-[#16220E] text-[#F4E9D5] relative overflow-hidden border-b border-[#B28A4A]/30"
      >
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#39431E]/30 rounded-full blur-3xl pointer-events-none" />
        {/* Tropical botanical texture overlay - rich foliage pattern */}
        <div className="absolute inset-0 pointer-events-none bg-repeat opacity-40 mix-blend-screen" style={{backgroundImage:"url('/assets/texture_tropical.jpg')",backgroundSize:'450px auto'}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className={`text-center max-w-3xl mx-auto mb-16 reveal-init ${isSpacesVisible ? 'reveal-active' : ''}`}>
            <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-2">
              The Bungalow Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4E9D5]">
              Architectural Sanctuaries
            </h2>
            <Flourish variant="gold" width="w-36" className="my-2" />
            <p className="text-xs sm:text-sm text-[#D9C09A]/85 font-light leading-relaxed">
              Every corner of Bungalow No 6 is purposefully curated to provide warmth, intimacy, and timeless charm.
            </p>
          </div>

          {/* 3 Editorial Story Showcase Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Panel 1: The Courtyard Under Stars */}
            <div 
              className={`luxury-card card-glow-hover bg-[#1E2D12]/90 border border-[#B28A4A]/30 overflow-hidden flex flex-col justify-between shadow-xl reveal-init delay-150 ${
                isSpacesVisible ? 'reveal-active' : ''
              }`}
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src="/assets/space_jeep_real.jpg"
                  alt="Courtyard Under Stars with Safari Jeep"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/space_jeep.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D12] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#16220E]/90 border border-[#B28A4A]/50 text-[#F4E9D5] text-[9px] uppercase tracking-widest font-semibold animate-badge-float">
                  Al Fresco
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F4E9D5] mb-2">
                    The Courtyard Under Stars
                  </h3>
                  <p className="text-xs text-[#D9C09A]/80 font-light leading-relaxed">
                    Terracotta pathways, black-and-white chevron seating, vintage jeep lanterns, and gentle evening breezes.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#B28A4A]/20 flex items-center justify-between text-xs text-[#B28A4A] font-semibold">
                  <span>Candlelit Tables 01–06</span>
                  <button onClick={onOpenReservation} className="hover:text-white transition-colors flex items-center space-x-1 group">
                    <span>Reserve</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Panel 2: The Dining Pavilion */}
            <div 
              className={`luxury-card card-glow-hover bg-[#1E2D12]/90 border border-[#B28A4A]/30 overflow-hidden flex flex-col justify-between shadow-xl reveal-init delay-300 ${
                isSpacesVisible ? 'reveal-active' : ''
              }`}
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src="/assets/space_dining_real.jpg"
                  alt="The Dining Pavilion with Wicker Lanterns"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/space_dining.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D12] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#16220E]/90 border border-[#B28A4A]/50 text-[#F4E9D5] text-[9px] uppercase tracking-widest font-semibold animate-badge-float" style={{animationDelay: '1s'}}>
                  Indoor Sanctuary
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F4E9D5] mb-2">
                    The Dining Pavilion
                  </h3>
                  <p className="text-xs text-[#D9C09A]/80 font-light leading-relaxed">
                    High-pitched timber rafters, ambient spherical wicker basket lamps, and lush curved planter walls.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#B28A4A]/20 flex items-center justify-between text-xs text-[#B28A4A] font-semibold">
                  <span>Salon Tables 07–12</span>
                  <button onClick={onOpenReservation} className="hover:text-white transition-colors flex items-center space-x-1 group">
                    <span>Reserve</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Panel 3: The Artisan Café Bar */}
            <div 
              className={`luxury-card card-glow-hover bg-[#1E2D12]/90 border border-[#B28A4A]/30 overflow-hidden flex flex-col justify-between shadow-xl reveal-init delay-450 ${
                isSpacesVisible ? 'reveal-active' : ''
              }`}
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src="/assets/space_counter_real.jpg"
                  alt="Artisan Café Bar and Pastry Lounge"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/gallery_interior.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D12] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#16220E]/90 border border-[#B28A4A]/50 text-[#F4E9D5] text-[9px] uppercase tracking-widest font-semibold animate-badge-float" style={{animationDelay: '2s'}}>
                  Artisanal Brews
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F4E9D5] mb-2">
                    The Artisan Café Bar
                  </h3>
                  <p className="text-xs text-[#D9C09A]/80 font-light leading-relaxed">
                    Polished concrete, live-edge wood tables, circular moon window, and illuminated glass pastry showcase.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#B28A4A]/20 flex items-center justify-between text-xs text-[#B28A4A] font-semibold">
                  <span>Espresso Bar</span>
                  <button onClick={onOpenReservation} className="hover:text-white transition-colors flex items-center space-x-1">
                    <span>Reserve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OUR SPECIALS / SIGNATURE HARVESTS (Scroll-driven Dish Cards) */}
      {/* ========================================================================= */}
      <section 
        ref={specialsRef}
        className="py-20 sm:py-28 bg-[#FFF9EF] text-[#4A321E]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className={`text-center max-w-3xl mx-auto mb-14 reveal-init ${isSpecialsVisible ? 'reveal-active' : ''}`}>
            <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-1">
              Curated Gastronomy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E2D12]">
              Our Signature Specials
            </h2>
            <Flourish variant="gold" width="w-36" className="my-2" />
            <p className="text-xs sm:text-sm text-[#4A321E]/75 font-light">
              Crafted daily with seasonal ingredients and culinary precision.
            </p>
          </div>

          {/* Specials Grid with Staggered Entrance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specials.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectDish?.(item)}
                className={`luxury-card bg-white border border-[#B28A4A]/30 shadow-md flex flex-col justify-between overflow-hidden group cursor-pointer reveal-init ${
                  idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : 'delay-400'
                } ${isSpecialsVisible ? 'reveal-active' : ''}`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#1E2D12] relative">
                  <img
                    src={item.highResImage || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      if (item.image && e.target.src !== item.image) {
                        e.target.src = item.image;
                      }
                    }}
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#1E2D12]/90 border border-[#B28A4A]/60 text-white font-mono font-bold text-xs shadow-md">
                    {item.formattedPrice}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1E2D12] group-hover:text-[#B28A4A] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#4A321E]/75 line-clamp-2 mt-1.5 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#B28A4A]/20 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#B28A4A] font-semibold">
                      {item.category} • {item.prepTime}
                    </span>
                    <span className="text-xs font-serif font-semibold text-[#1E2D12] group-hover:text-[#B28A4A] flex items-center space-x-1">
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3 text-[#B28A4A]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Explore Menu Link */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-bold text-[#1E2D12] hover:text-[#B28A4A] transition-colors"
            >
              <span>Explore Complete Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOME — FINAL CTA (Deep forest green booking section) */}
      {/* ========================================================================= */}
      <section 
        ref={ctaRef}
        className="py-20 sm:py-28 bg-[#16220E] text-[#F4E9D5] relative overflow-hidden border-t border-[#B28A4A]/30"
      >
        {/* Ambient warm glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#39431E]/40 rounded-full blur-3xl pointer-events-none" />
        {/* Tropical botanical texture overlay - rich foliage pattern */}
        <div className="absolute inset-0 pointer-events-none bg-repeat opacity-40 mix-blend-screen" style={{backgroundImage:"url('/assets/texture_tropical.jpg')",backgroundSize:'450px auto'}} />

        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 reveal-init ${isCtaVisible ? 'reveal-active' : ''}`}>
          <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-2">
            Reservations & Dining
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4E9D5] mb-2">
            Make Your Moment Special
          </h2>

          <Flourish variant="gold" width="w-48" className="my-2" />

          <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#D9C09A] font-light italic max-w-xl mx-auto mb-8">
            “Come for the food. Stay for the atmosphere. Leave with a memory.”
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenReservation}
              className="btn-shimmer w-full sm:w-auto px-10 py-4 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs sm:text-sm uppercase tracking-[0.3em] font-bold border border-[#F4E9D5] transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            >
              Reserve a Table
            </button>

            <button
              onClick={handleOpenTableOrder}
              className="btn-shimmer w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-[#F4E9D5] font-serif text-xs sm:text-sm uppercase tracking-[0.25em] font-bold border border-[#B28A4A] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#B28A4A]" />
              <span>Order at Your Table</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
