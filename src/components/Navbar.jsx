import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Volume2, VolumeX, Sparkles, MapPin, Phone, 
  Clock, Compass, Shield, UtensilsCrossed, ChevronDown, Check
} from 'lucide-react';
import Logo from './Logo';
import { soundService } from '../services/soundService.js';

export default function Navbar({
  activePage,
  setActivePage,
  onOpenReservation,
  onOpenTableOrder,
  isAudioPlaying,
  toggleAudio,
  audioVolume = 0.65,
  setAudioVolume,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(() => soundService.getMuted());

  const handleToggleUiSound = () => {
    const nowMuted = soundService.toggleMute();
    setIsSoundMuted(nowMuted);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#16220E]/95 backdrop-blur-md py-3 shadow-luxury-deep border-b border-[#B28A4A]/30'
            : 'bg-[#1E2D12] py-4 border-b border-[#B28A4A]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo (Always navigates to Home) */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center"
            role="button"
            tabIndex={0}
            aria-label="Return to Bungalow No 6 Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavClick('home');
              }
            }}
          >
            <Logo variant="light" size="sm" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 relative py-1 group ${
                    isActive
                      ? 'text-[#B28A4A] font-semibold'
                      : 'text-[#F4E9D5]/90 hover:text-[#F4E9D5]'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Subtle active underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B28A4A] transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons: Audio Ambience + Order at Your Table + Reserve Button */}
          <div className="hidden md:flex items-center space-x-3.5 lg:space-x-4">
            
            {/* UI Sound Toggle (🔊 / 🔇) */}
            <button
              onClick={handleToggleUiSound}
              title={isSoundMuted ? 'UI Sounds Off — Click to Enable' : 'UI Sounds On — Click to Mute'}
              aria-label="Toggle UI Sounds"
              className={`px-2.5 py-1.5 rounded-none border text-[10px] font-serif uppercase tracking-wider transition-all duration-300 ${
                isSoundMuted
                  ? 'border-[#B28A4A]/30 text-[#D9C09A]/50 hover:border-[#B28A4A] hover:text-[#D9C09A]'
                  : 'border-[#B28A4A]/60 text-[#D9C09A] bg-[#B28A4A]/10 hover:bg-[#B28A4A]/20'
              }`}
            >
              {isSoundMuted ? '🔇 Sound Off' : '🔊 Sound On'}
            </button>

            {/* Ambient Soundscape Controller */}
            <div className="relative">
              <button
                onClick={toggleAudio}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className={`p-2 rounded-full border transition-all duration-300 ${
                  isAudioPlaying
                    ? 'border-[#B28A4A] bg-[#B28A4A]/20 text-[#F4E9D5] shadow-sm'
                    : 'border-[#B28A4A]/40 bg-transparent text-[#D9C09A]/75 hover:text-[#F4E9D5] hover:border-[#B28A4A]'
                }`}
                title={isAudioPlaying ? 'Mute Ambient Café Audio' : 'Play Ambient Café Audio'}
                aria-label="Toggle Ambient Audio"
              >
                {isAudioPlaying ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#B28A4A] animate-pulse" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Volume Controller Tooltip Dropdown */}
              {showVolumeSlider && isAudioPlaying && (
                <div
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="absolute right-0 top-full mt-2 p-3 bg-[#16220E] border border-[#B28A4A]/60 shadow-2xl rounded-none w-44 z-50 animate-fade-in-down text-left"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#D9C09A] font-serif uppercase tracking-wider mb-1.5">
                    <span>Soundscape</span>
                    <span className="font-mono text-[#B28A4A]">{Math.round((audioVolume || 0.65) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioVolume}
                    onChange={(e) => setAudioVolume?.(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#1E2D12] rounded-lg appearance-none cursor-pointer accent-[#B28A4A]"
                  />
                  <div className="flex justify-between text-[9px] text-[#D9C09A]/60 mt-1">
                    <button
                      onClick={() => setAudioVolume?.(0.35)}
                      className={`hover:text-[#F4E9D5] ${audioVolume === 0.35 ? 'text-[#B28A4A] font-bold' : ''}`}
                    >
                      Low
                    </button>
                    <button
                      onClick={() => setAudioVolume?.(0.65)}
                      className={`hover:text-[#F4E9D5] ${audioVolume === 0.65 ? 'text-[#B28A4A] font-bold' : ''}`}
                    >
                      Med
                    </button>
                    <button
                      onClick={() => setAudioVolume?.(0.95)}
                      className={`hover:text-[#F4E9D5] ${audioVolume === 0.95 ? 'text-[#B28A4A] font-bold' : ''}`}
                    >
                      High
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order at Your Table Button */}
            <button
              onClick={() => { soundService.playClick(2000); onOpenTableOrder(); }}
              title="Order at Your Table (Enter Reservation Code)"
              className="px-3.5 py-1.5 bg-[#2B3818] hover:bg-[#39431E] text-[#F4E9D5] border border-[#B28A4A]/50 text-[11px] uppercase tracking-wider font-medium transition-all duration-300 flex items-center space-x-1.5 shadow-sm"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#B28A4A]" />
              <span>Order at Your Table</span>
            </button>

            {/* Reserve a Table CTA Button */}
            <button
              onClick={() => { soundService.playClick(2200); onOpenReservation(); }}
              className="group relative px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium text-[#F4E9D5] rounded-none border border-[#B28A4A] hover:border-[#F4E9D5] bg-[#1E2D12] hover:bg-[#B28A4A]/25 transition-all duration-300 shadow-sm hover:shadow-luxury-gold"
            >
              <span>Reserve a Table</span>
            </button>
          </div>

          {/* Mobile Right Controls: Hamburger + Audio */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile UI Sound Toggle */}
            <button
              onClick={handleToggleUiSound}
              title={isSoundMuted ? 'UI Sounds Off' : 'UI Sounds On'}
              aria-label="Toggle UI Sounds"
              className="text-sm px-1"
            >
              {isSoundMuted ? '🔇' : '🔊'}
            </button>

            <button
              onClick={toggleAudio}
              className="p-1.5 text-[#D9C09A] hover:text-[#F4E9D5]"
              aria-label="Toggle Ambience Sound"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-[#B28A4A]" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-75" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F4E9D5] hover:text-[#B28A4A] transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#1E2D12] text-[#F4E9D5] z-50 shadow-2xl p-6 flex flex-col justify-between transition-transform duration-500 ease-in-out md:hidden border-l border-[#B28A4A]/40 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#B28A4A]/30">
            <Logo variant="light" size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-[#F4E9D5] hover:text-[#B28A4A]"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4 pt-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-lg font-serif tracking-widest uppercase py-2 text-left transition-colors duration-200 ${
                    isActive
                      ? 'text-[#B28A4A] font-bold border-b border-[#B28A4A]/30'
                      : 'text-[#F4E9D5]/80 hover:text-[#F4E9D5]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="w-full flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTableOrder?.();
              }}
              className="w-full py-3 border border-[#B28A4A]/60 bg-[#2B3818] text-[#F4E9D5] font-serif text-xs tracking-[0.2em] uppercase flex items-center justify-center space-x-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#B28A4A]" />
              <span>Order at Your Table</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-3.5 border border-[#B28A4A] bg-[#B28A4A] text-[#16220E] font-serif text-sm tracking-[0.25em] uppercase font-bold transition-all duration-300"
            >
              Reserve a Table
            </button>
          </div>
        </div>

        {/* Mobile Drawer Bottom Info */}
        <div className="text-center text-xs text-[#D9C09A]/70 space-y-1">
          <p className="font-serif italic text-sm text-[#F4E9D5]/90">
            A premium café & lounge crafted for unforgettable moments.
          </p>
          <p>120, Green Avenue, Your City • +91 98765 43210</p>
          <p className="text-[10px] text-[#B28A4A]">Open Daily: 9:00 AM – 11:00 PM</p>
        </div>
      </div>
    </>
  );
}
