import React, { useState } from 'react';
import { Send, ArrowUp, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ setActivePage, onOpenReservation, onShowToast }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast?.('Please enter a valid email address.', 'error');
      return;
    }
    onShowToast?.('Thank you for subscribing to Bungalow No 6 journal!', 'success');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#16220E] text-[#F4E9D5] border-t border-[#B28A4A]/25 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#39431E]/20 rounded-full blur-3xl pointer-events-none" />
      {/* Tropical botanical texture overlay - rich foliage pattern */}
      <div className="absolute inset-0 pointer-events-none bg-repeat opacity-40 mix-blend-screen" style={{backgroundImage:"url('/assets/texture_tropical.jpg')",backgroundSize:'450px auto'}} />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#F4E9D5]/10">
          
          {/* Col 1: Brand Info (Left) - 4 cols */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <div
              onClick={() => handleNav('home')}
              className="cursor-pointer group flex items-center"
            >
              <Logo variant="light" size="md" />
            </div>

            <p className="text-xs sm:text-sm text-[#D9C09A]/80 font-light leading-relaxed max-w-sm">
              A premium café & lounge crafted for unforgettable moments. Where fine dining, peaceful nature, and rich conversations blend seamlessly.
            </p>

            {/* Quick Contact Line */}
            <div className="space-y-1.5 text-xs text-[#D9C09A]/70 pt-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#B28A4A] shrink-0" />
                <span>120, Green Avenue, Your City</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#B28A4A] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#B28A4A] shrink-0" />
                <span>hello@bungalowno6.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links - 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm tracking-[0.25em] text-[#B28A4A] uppercase font-semibold">
              Quick Links
            </h4>
            <div className="w-8 h-[1px] bg-[#B28A4A]/50" />
            <ul className="space-y-2 text-xs sm:text-sm text-[#D9C09A]/80">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#F4E9D5] hover:translate-x-1 transition-all duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#F4E9D5] hover:translate-x-1 transition-all duration-200"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-[#F4E9D5] hover:translate-x-1 transition-all duration-200"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-[#F4E9D5] hover:translate-x-1 transition-all duration-200"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#F4E9D5] hover:translate-x-1 transition-all duration-200"
                >
                  Contact
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={onOpenReservation}
                  className="text-[#B28A4A] hover:text-[#F4E9D5] font-medium flex items-center space-x-1"
                >
                  <span>Book a Table →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Opening Hours - 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm tracking-[0.25em] text-[#B28A4A] uppercase font-semibold">
              Opening Hours
            </h4>
            <div className="w-8 h-[1px] bg-[#B28A4A]/50" />
            
            <div className="space-y-3 text-xs sm:text-sm text-[#D9C09A]/90">
              <div>
                <span className="block font-medium text-[#F4E9D5]">Monday – Friday</span>
                <span className="text-xs text-[#D9C09A]/70">9:00 AM – 11:00 PM</span>
              </div>
              <div>
                <span className="block font-medium text-[#F4E9D5]">Saturday – Sunday</span>
                <span className="text-xs text-[#D9C09A]/70">8:00 AM – 12:00 AM (Midnight)</span>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#39431E] text-[#F4E9D5] border border-[#B28A4A]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Kitchen Open Today
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter & Socials - 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm tracking-[0.25em] text-[#B28A4A] uppercase font-semibold">
              Follow Us
            </h4>
            <div className="w-8 h-[1px] bg-[#B28A4A]/50" />

            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[#B28A4A]/40 flex items-center justify-center text-[#F4E9D5] hover:bg-[#B28A4A] hover:text-[#16220E] transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-[#B28A4A]/40 flex items-center justify-center text-[#F4E9D5] hover:bg-[#B28A4A] hover:text-[#16220E] transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-[#B28A4A]/40 flex items-center justify-center text-[#F4E9D5] hover:bg-[#B28A4A] hover:text-[#16220E] transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs text-[#D9C09A]/80 mb-2">
                Subscribe for private tastings & weekend table alerts.
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1E2D12] text-xs text-[#F4E9D5] placeholder-[#D9C09A]/40 px-3 py-2 border border-[#B28A4A]/40 focus:outline-none focus:border-[#F4E9D5] w-full"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="bg-[#B28A4A] text-[#16220E] px-3 py-2 hover:bg-[#F4E9D5] transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D9C09A]/60 space-y-4 sm:space-y-0">
          <p>© 2026 Bungalow No 6. All Rights Reserved.</p>
          
          <div className="flex items-center space-x-6">
            <span className="font-script text-base text-[#B28A4A]">Bungalow No 6</span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-[#D9C09A]/80 hover:text-[#F4E9D5] transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
