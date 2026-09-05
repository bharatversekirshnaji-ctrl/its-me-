import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';
import Flourish from '../components/Flourish';
import Logo from '../components/Logo';

export default function ContactPage({
  onOpenReservation,
  onShowToast,
}) {
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.message) {
      onShowToast?.('Please fill in your name and message.', 'error');
      return;
    }

    onShowToast?.('Message sent successfully! Our concierge will reply shortly.', 'success');
    setInquiry({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="w-full pt-20 bg-[#FFF9EF]">
      
      {/* ========================================================================= */}
      {/* 1. CONTACT HERO HEADER */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 bg-[#FFF9EF] text-[#4A321E] border-b border-[#B28A4A]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[#B28A4A] font-semibold block mb-1">
            Get In Touch
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E2D12] tracking-tight">
            Contact Us
          </h1>

          <Flourish variant="gold" width="w-36" className="my-2" />

          <p className="font-serif text-base sm:text-lg text-[#1E2D12]/80 italic max-w-lg mx-auto">
            “We’d love to hear from you. Visit us or get in touch!”
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN CONTACT LAYOUT */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
            
            {/* Left Column: Brand Contact Info & Quick Form */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Brand Title */}
              <div>
                <Logo variant="dark" size="sm" hideText={true} />
                <h2 className="font-serif text-3xl font-bold text-[#1E2D12] mt-2">
                  Bungalow No 6
                </h2>
                <span className="font-script text-2xl text-[#B28A4A] block">
                  Estate Café & Dining
                </span>
              </div>

              {/* Info Items List */}
              <div className="space-y-4 text-xs sm:text-sm text-[#4A321E]">
                
                {/* Address */}
                <div className="flex items-start space-x-3 p-3.5 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
                  <MapPin className="w-4 h-4 text-[#B28A4A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1E2D12] block">Address</span>
                    <span>120, Green Avenue, Your City</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 p-3.5 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
                  <Phone className="w-4 h-4 text-[#B28A4A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1E2D12] block">Phone & WhatsApp</span>
                    <a href="tel:+919876543210" className="hover:text-[#B28A4A] transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3 p-3.5 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
                  <Mail className="w-4 h-4 text-[#B28A4A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1E2D12] block">Email</span>
                    <a href="mailto:hello@bungalowno6.com" className="hover:text-[#B28A4A] transition-colors">
                      hello@bungalowno6.com
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start space-x-3 p-3.5 bg-[#F4E9D5]/60 border border-[#B28A4A]/30">
                  <Clock className="w-4 h-4 text-[#B28A4A] shrink-0 mt-0.5" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1E2D12]">Opening Hours</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-emerald-800 text-white rounded">
                        Open Now
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5 text-xs text-[#4A321E]/85">
                      <p>Monday – Friday: 9:00 AM – 11:00 PM</p>
                      <p>Saturday – Sunday: 8:00 AM – 12:00 AM</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Inquiry Form */}
              <div className="p-5 sm:p-6 bg-[#F4E9D5] border border-[#B28A4A]/40">
                <h3 className="font-serif text-lg font-bold text-[#1E2D12] mb-1">
                  Send a Message
                </h3>
                <p className="text-xs text-[#4A321E]/75 mb-4">
                  For private events, catering, table queries, or press.
                </p>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={inquiry.name}
                    onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={inquiry.email}
                    onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                  />
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we assist you today?"
                    value={inquiry.message}
                    onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12] resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.2em] border border-[#B28A4A] transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B28A4A]" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Styled Map + Large Café Image + Reserve Button */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Styled Map Area */}
              <div className="relative border border-[#B28A4A]/40 overflow-hidden bg-[#EAE3D2] shadow-luxury">
                
                {/* Visual Map Render / Vector Styled Map Canvas */}
                <div className="h-64 sm:h-72 w-full relative bg-[#EAE3D2] overflow-hidden flex items-center justify-center">
                  
                  {/* Subtle map road grid patterns */}
                  <svg className="w-full h-full opacity-40" viewBox="0 0 600 300">
                    <rect width="600" height="300" fill="#E8DEC8" />
                    {/* Water / Greenery area */}
                    <path d="M0,0 Q150,120 300,50 T600,100 L600,0 Z" fill="#D2DEC5" />
                    <path d="M0,200 Q200,180 400,280 L600,300 L0,300 Z" fill="#D2DEC5" />
                    {/* Roads */}
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#FAF4EB" strokeWidth="12" />
                    <line x1="300" y1="0" x2="300" y2="300" stroke="#FAF4EB" strokeWidth="12" />
                    <line x1="120" y1="0" x2="480" y2="300" stroke="#FAF4EB" strokeWidth="6" />
                    <line x1="0" y1="220" x2="600" y2="80" stroke="#FAF4EB" strokeWidth="6" />
                    {/* Road outline borders */}
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#B28A4A" strokeWidth="1" strokeDasharray="6,6" opacity="0.4" />
                    <line x1="300" y1="0" x2="300" y2="300" stroke="#B28A4A" strokeWidth="1" strokeDasharray="6,6" opacity="0.4" />
                  </svg>

                  {/* Stag Location Marker in Center of Map */}
                  <div className="absolute z-10 flex flex-col items-center animate-bounce">
                    <div className="p-2.5 rounded-full bg-[#1E2D12] text-[#F4E9D5] border-2 border-[#B28A4A] shadow-2xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#B28A4A]" />
                    </div>
                    <div className="mt-1 px-3 py-1 bg-[#1E2D12] border border-[#B28A4A] shadow-xl text-center">
                      <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#F4E9D5] block">
                        Bungalow No 6
                      </span>
                      <span className="text-[9px] text-[#B28A4A] uppercase tracking-widest block">
                        120, Green Avenue
                      </span>
                    </div>
                  </div>

                  {/* Open in Google Maps link overlay */}
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#FFF9EF]/90 backdrop-blur-sm border border-[#B28A4A]/50 text-[11px] font-medium text-[#1E2D12] hover:bg-[#1E2D12] hover:text-[#F4E9D5] transition-colors flex items-center space-x-1 shadow-sm"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>

              {/* Large Café Interior Image Below Map */}
              <div className="relative border border-[#B28A4A]/40 overflow-hidden bg-[#1E2D12] shadow-luxury">
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                    alt="Bungalow No 6 Evening Lounge"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/assets/contact_lounge.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16220E] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#F4E9D5]">
                        The Evening Lounge
                      </h4>
                      <p className="text-xs text-[#D9C09A]/80 font-light">
                        Reservations recommended for dinner & weekend evenings.
                      </p>
                    </div>

                    {/* Reserve a Table Button */}
                    <button
                      onClick={onOpenReservation}
                      className="px-6 py-2.5 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-[0.2em] font-bold transition-all shrink-0"
                    >
                      Reserve a Table
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
