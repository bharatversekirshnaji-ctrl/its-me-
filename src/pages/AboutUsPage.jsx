import React from 'react';
import { Sparkles, BookOpen, Coffee, Leaf, Compass, ArrowRight, Quote, HeartHandshake, Award } from 'lucide-react';
import Flourish from '../components/Flourish';
import { SPACE_ZONES, REVIEWS } from '../data/spaceData';
import Logo from '../components/Logo';

export default function AboutUsPage({
  setActivePage,
  onOpenReservation,
  onOpenSpaceTour,
}) {
  const handleExploreSpace = () => {
    setActivePage('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full pt-20">
      
      {/* ========================================================================= */}
      {/* 1. ABOUT US HEADER & HERO */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#FFF9EF] text-[#4A321E] border-b border-[#B28A4A]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-1">
            Our Heritage & Philosophy
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E2D12] tracking-tight">
            About Us
          </h1>

          <Flourish variant="gold" width="w-40" className="my-2" />

          <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#1E2D12]/90 font-light italic">
            More than a café. It's an experience.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR STORY (Prominent Library Lounge Photo & Script Signature) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#FFF9EF] text-[#4A321E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#B28A4A] font-semibold">
                  Chapter 01
                </span>
                <span className="w-8 h-[1px] bg-[#B28A4A]" />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2D12] leading-tight">
                Our Story
              </h2>

              <p className="text-sm sm:text-base text-[#4A321E]/85 leading-relaxed font-light">
                Bungalow No 6 is more than a café. It is a destination where fine dining meets a relaxed atmosphere. Our passion is to bring people together over exceptional food, drinks, and memories.
              </p>

              <p className="text-xs sm:text-sm text-[#4A321E]/75 leading-relaxed font-light">
                Inspired by the serene pace of vintage colonial bungalows and surrounded by untouched botanicals, we created a sanctuary away from the city hustle. Whether you’re looking for a quiet corner to read with artisanal coffee, or gathering with loved ones around candlelit tables, Bungalow No 6 was crafted just for you.
              </p>

              {/* Elegant script accent as specified in mockup */}
              <div className="pt-2">
                <span className="font-script text-4xl sm:text-5xl text-[#B28A4A] block">
                  Bungalow No 6
                </span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#1E2D12] font-semibold">
                  Estate & Kitchen • Est. 2024
                </span>
              </div>
            </div>

            {/* Right Photo: Library Lounge with Neon Stag Plaque */}
            <div className="lg:col-span-6 relative">
              <div className="relative p-2 bg-[#F4E9D5] border border-[#B28A4A]/40 shadow-2xl">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#1E2D12] relative">
                  <img
                    src="/assets/space_library_real.jpg"
                    alt="Bungalow No 6 Library Lounge"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/assets/about_library.jpg';
                    }}
                  />
                  {/* Floating Circular Stag Plaque Emblem */}
                  <div className="absolute top-4 right-4 z-10 scale-90 sm:scale-100">
                    <Logo variant="plaque" />
                  </div>
                </div>
                <div className="p-3 text-center bg-[#F4E9D5] border-t border-[#B28A4A]/30">
                  <span className="text-xs font-serif italic text-[#1E2D12]">
                    The Library & Reading Lounge — Floor-to-Ceiling Backlit Bookshelf Sanctuary
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR SPACE (Dark green section with 3 spatial cards & Explore Space button) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#1E2D12] text-[#F4E9D5] relative overflow-hidden">
        {/* Tropical botanical texture overlay - rich foliage pattern */}
        <div className="absolute inset-0 pointer-events-none bg-repeat opacity-40 mix-blend-screen" style={{backgroundImage:"url('/assets/texture_tropical.jpg')",backgroundSize:'450px auto'}} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B28A4A] font-medium">
              Architectural Sanctuaries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4E9D5] mt-1">
              Our Space
            </h2>
            <Flourish variant="gold" width="w-36" className="my-2" />
            <p className="text-xs sm:text-sm text-[#D9C09A]/85 font-light leading-relaxed">
              “From intimate corners to open-air seating, every inch of Bungalow No 6 is designed to make you feel at home.”
            </p>
          </div>

          {/* 3 Spatial Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1: Botanical Veranda */}
            <div
              onClick={handleExploreSpace}
              className="group cursor-pointer bg-[#16220E] border border-[#B28A4A]/30 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B28A4A]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <img
                  src="/assets/space_terrace_real.jpg"
                  alt="Outdoor Seating & Botanical Veranda"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/space_terrace.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#B28A4A] block">
                    Zone 01
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#F4E9D5]">
                    The Botanical Veranda
                  </h3>
                  <p className="text-[11px] text-[#D9C09A]/80 font-light mt-1">
                    Breezy open-air terrace with timber rafters, woven wicker dome lamps, and cognac banquettes.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Vintage Jeep Courtyard */}
            <div
              onClick={handleExploreSpace}
              className="group cursor-pointer bg-[#16220E] border border-[#B28A4A]/30 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B28A4A]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <img
                  src="/assets/space_jeep_real.jpg"
                  alt="Vintage Jeep Courtyard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/space_jeep.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#B28A4A] block">
                    Zone 02
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#F4E9D5]">
                    The Vintage Jeep Courtyard
                  </h3>
                  <p className="text-[11px] text-[#D9C09A]/80 font-light mt-1">
                    Terracotta diamond patio, chevron dining chairs, and our iconic classic safari jeep.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Dining Pavilion */}
            <div
              onClick={handleExploreSpace}
              className="group cursor-pointer bg-[#16220E] border border-[#B28A4A]/30 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B28A4A]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <img
                  src="/assets/space_dining_real.jpg"
                  alt="The Dining Pavilion"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/assets/space_dining.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#B28A4A] block">
                    Zone 03
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#F4E9D5]">
                    The Dining Pavilion
                  </h3>
                  <p className="text-[11px] text-[#D9C09A]/80 font-light mt-1">
                    High pitched timber ceiling, warm wicker sphere lanterns, and curved planter partitions.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Button: Explore Our Space — Navigates directly to Gallery as requested */}
          <div className="text-center">
            <button
              onClick={handleExploreSpace}
              className="px-8 py-3.5 bg-transparent hover:bg-[#B28A4A] text-[#F4E9D5] hover:text-[#16220E] font-serif text-xs uppercase tracking-[0.25em] font-semibold border border-[#B28A4A] transition-all duration-300 shadow-md hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Explore Our Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OUR PHILOSOPHY (5 Core Pillars: Ingredients, Atmosphere, Hospitality, Food, Memories) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FFF9EF] text-[#4A321E] border-b border-[#B28A4A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B28A4A] font-medium">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2D12] mt-1">
              Our Philosophy
            </h2>
            <Flourish variant="gold" width="w-32" className="my-2" />
            <p className="text-xs sm:text-sm text-[#4A321E]/80 font-light">
              Crafting every culinary creation and serene corner with intention, mindfulness, and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
              <Award className="w-7 h-7 text-[#B28A4A] mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#1E2D12] mb-1.5">
                Premium Ingredients
              </h3>
              <p className="text-xs sm:text-sm text-[#4A321E]/80 font-light leading-relaxed">
                Direct-trade single-estate coffee beans, farm-fresh dairy, and ethically sourced organic botanicals.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
              <Sparkles className="w-7 h-7 text-[#B28A4A] mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#1E2D12] mb-1.5">
                Comfortable Atmosphere
              </h3>
              <p className="text-xs sm:text-sm text-[#4A321E]/80 font-light leading-relaxed">
                A nature-infused colonial estate designed for unhurried conversations, deep work, and slow reading.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
              <HeartHandshake className="w-7 h-7 text-[#B28A4A] mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#1E2D12] mb-1.5">
                Heartfelt Hospitality
              </h3>
              <p className="text-xs sm:text-sm text-[#4A321E]/80 font-light leading-relaxed">
                Warm, attentive table-side service that makes every guest feel at home from the moment they step in.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
              <Coffee className="w-7 h-7 text-[#B28A4A] mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#1E2D12] mb-1.5">
                Quality Gastronomy
              </h3>
              <p className="text-xs sm:text-sm text-[#4A321E]/80 font-light leading-relaxed">
                Handcrafted pizzas, slow-simmered pastas, and bespoke botanical coolers made fresh to order.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 bg-[#F4E9D5]/60 border border-[#B28A4A]/30 md:col-span-2">
              <BookOpen className="w-7 h-7 text-[#B28A4A] mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#1E2D12] mb-1.5">
                Memorable Experiences
              </h3>
              <p className="text-xs sm:text-sm text-[#4A321E]/80 font-light leading-relaxed">
                Creating lasting memories with every visit — from romantic candlelight dinners in the courtyard by the vintage jeep to quiet morning coffees in the library lounge.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. GUEST MOMENTS & TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FFF9EF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B28A4A] font-semibold block mb-1">
            Guest Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2D12]">
            Moments at Bungalow No 6
          </h2>
          <Flourish variant="gold" width="w-32" className="my-2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-[#F4E9D5] border border-[#B28A4A]/30 text-left flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-6 h-6 text-[#B28A4A]/40 mb-2" />
                  <p className="font-serif text-sm text-[#1E2D12] italic leading-relaxed">
                    {rev.text}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#B28A4A]/30">
                  <h4 className="font-serif font-bold text-xs text-[#1E2D12]">
                    {rev.name}
                  </h4>
                  <span className="text-[10px] text-[#4A321E]/70 block">
                    {rev.role}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button
              onClick={onOpenReservation}
              className="px-8 py-3.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.25em] font-medium border border-[#B28A4A] transition-all duration-300"
            >
              Reserve Your Experience
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
