import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, Sparkles, CheckCircle2, Copy, Download, Heart, LayoutGrid, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import Logo from './Logo';
import Flourish from './Flourish';
import { secureOrderingService } from '../services/secureOrderingService';
import { soundService } from '../services/soundService.js';

export default function ReservationModal({ isOpen, onClose, onShowToast }) {
  const [viewMode, setViewMode] = useState('details'); // 'details' | 'floorplan'
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    guests: '2',
    zone: 'The Jeep Courtyard (Outdoor)',
    tableNumber: 'Table 06 (Jeep Courtyard View)',
    occasion: 'Romantic Date',
    specialRequest: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const timeSlots = [
    '09:30 AM', '11:00 AM', '12:30 PM', '01:30 PM', 
    '03:30 PM', '05:00 PM', '07:00 PM', '08:00 PM', '09:30 PM'
  ];

  const occasions = [
    'Casual Gathering',
    'Romantic Date',
    'Birthday Celebration',
    'Anniversary',
    'Business / Work Catch-up',
    'Solo Reading & Coffee',
  ];

  // Visual Floorplan Tables
  const floorplanZones = [
    {
      name: 'The Jeep Courtyard (Outdoor)',
      icon: '🚙',
      tables: [
        { id: 'T1', name: 'Table 01', capacity: 2, status: 'available' },
        { id: 'T2', name: 'Table 02', capacity: 4, status: 'available' },
        { id: 'T3', name: 'Table 03', capacity: 4, status: 'occupied' },
        { id: 'T4', name: 'Table 04', capacity: 6, status: 'available' },
        { id: 'T5', name: 'Table 05', capacity: 2, status: 'available' },
        { id: 'T6', name: 'Table 06 (Jeep View)', capacity: 2, status: 'available', featured: true },
      ],
    },
    {
      name: 'The Library & Lounge (Indoor)',
      icon: '📚',
      tables: [
        { id: 'T7', name: 'Table 07 (Bookshelf)', capacity: 2, status: 'available' },
        { id: 'T8', name: 'Table 08 (Nook)', capacity: 2, status: 'available', featured: true },
        { id: 'T9', name: 'Table 09 (Chesterfield)', capacity: 4, status: 'occupied' },
        { id: 'T10', name: 'Table 10 (Fireplace)', capacity: 6, status: 'available' },
      ],
    },
    {
      name: 'The Garden Veranda (Sheltered)',
      icon: '🌿',
      tables: [
        { id: 'T11', name: 'Table 11 (Pergola)', capacity: 4, status: 'available' },
        { id: 'T12', name: 'Table 12 (Balcony)', capacity: 2, status: 'available' },
        { id: 'T13', name: 'Table 13 (Garden)', capacity: 6, status: 'available' },
        { id: 'T14', name: 'Table 14 (Canopy)', capacity: 4, status: 'occupied' },
      ],
    },
    {
      name: 'The Emerald Dining Salon (Fine Dining)',
      icon: '🕯️',
      tables: [
        { id: 'T15', name: 'Table 15 (Velvet Booth)', capacity: 4, status: 'available' },
        { id: 'T16', name: 'Table 16 (Private Alcove)', capacity: 2, status: 'available', featured: true },
        { id: 'T17', name: 'Table 17 (Chandelier Table)', capacity: 8, status: 'available' },
      ],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      soundService.playError();
      onShowToast?.('Please fill in your name and phone number.', 'error');
      return;
    }

    soundService.playClick(2200);

    const res = secureOrderingService.createReservation(formData);
    setBookingRef(res.bookingReference);
    setIsSubmitted(true);
    soundService.playConfirmation();

    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#B28A4A', '#1E2D12', '#F4E9D5'],
      });
    } catch (err) {}
  };

  const handleCopyPass = () => {
    soundService.playClick(2400);
    const text = `Bungalow No 6 Reservation Pass:
Booking ID: ${bookingRef}
Name: ${formData.name}
Guests: ${formData.guests} Guests
Date & Time: ${formData.date} at ${formData.time}
Seating Zone: ${formData.zone}
Table: ${formData.tableNumber}
Location: 120, Green Avenue, Your City`;

    navigator.clipboard?.writeText(text);
    onShowToast?.('Reservation details copied to clipboard!', 'success');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleResetAndClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      style={{ overflowY: 'auto' }}
    >
      {/* Modal Dialog Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl rounded-none flex flex-col max-h-[92dvh] sm:max-h-[90vh] my-auto overflow-hidden animate-scale-up"
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#1E2D12] via-[#B28A4A] to-[#1E2D12]" />

        {/* STICKY HEADER — Close button is ALWAYS visible in top-right regardless of scroll or viewport size */}
        <div className="shrink-0 sticky top-0 z-30 bg-[#FFF9EF] border-b border-[#B28A4A]/25 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <Logo variant="dark" size="sm" hideText={true} />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E2D12] leading-tight">
                {isSubmitted ? 'Reservation Confirmed' : 'Reserve a Table'}
              </h3>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-medium block">
                Bungalow No 6 • Estate Dining
              </span>
            </div>
          </div>

          {/* Guaranteed Visible Close Button */}
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#1E2D12]/10 hover:bg-[#1E2D12] hover:text-[#F4E9D5] text-[#1E2D12] border border-[#B28A4A]/40 transition-all duration-200 cursor-pointer shrink-0 shadow-sm"
            aria-label="Close Reservation Modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* SCROLLABLE MODAL BODY */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-5 overscroll-contain">
          {!isSubmitted ? (
            <div>
              {/* Intro & View Mode Switcher */}
              <div className="text-center mb-5">
                <p className="text-xs sm:text-sm text-[#4A321E]/80 max-w-md mx-auto">
                  Experience soulful moments, exceptional cuisine, and warm hospitality.
                </p>

                {/* View Switcher: Details vs Floorplan */}
                <div className="flex items-center justify-center space-x-2 mt-3.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('details')}
                    className={`px-3 sm:px-4 py-1.5 text-xs font-serif uppercase tracking-wider transition-all ${
                      viewMode === 'details'
                        ? 'bg-[#1E2D12] text-[#F4E9D5] font-bold border border-[#1E2D12]'
                        : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                    }`}
                  >
                    1. Guest & Time Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('floorplan')}
                    className={`px-3 sm:px-4 py-1.5 text-xs font-serif uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                      viewMode === 'floorplan'
                        ? 'bg-[#1E2D12] text-[#F4E9D5] font-bold border border-[#1E2D12]'
                        : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#B28A4A]" />
                    <span>2. Pick Visual Table ({formData.tableNumber.split('(')[0].trim()})</span>
                  </button>
                </div>
              </div>

              {viewMode === 'details' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:bg-white focus:border-[#1E2D12] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:bg-white focus:border-[#1E2D12] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Date & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                        Reservation Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:bg-white focus:border-[#1E2D12] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                        Number of Guests *
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:bg-white focus:border-[#1E2D12] focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, '9+', 'Large Party (10+)'].map((num) => (
                          <option key={num} value={num}>
                            {num} {typeof num === 'number' && num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Time Slot Picker */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-1.5 text-xs font-medium border transition-all duration-200 ${
                            formData.time === time
                              ? 'bg-[#1E2D12] text-[#F4E9D5] border-[#1E2D12] shadow-sm font-semibold'
                              : 'bg-[#F4E9D5]/40 text-[#4A321E] border-[#B28A4A]/30 hover:border-[#1E2D12]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 4: Occasion & Selected Table Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                        Occasion
                      </label>
                      <select
                        value={formData.occasion}
                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:bg-white focus:border-[#1E2D12] focus:outline-none transition-colors"
                      >
                        {occasions.map((occ) => (
                          <option key={occ} value={occ}>
                            {occ}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                        Assigned Table
                      </label>
                      <div
                        onClick={() => setViewMode('floorplan')}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5] border border-[#B28A4A] text-[#1E2D12] font-semibold cursor-pointer hover:bg-white transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{formData.tableNumber}</span>
                        <span className="text-[10px] text-[#B28A4A] uppercase tracking-wider underline shrink-0 ml-1">Change Map</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Special Request */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#1E2D12] mb-1">
                      Special Request (Dietary, Candlelight Setup, etc.)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us if you have dietary preferences or special arrangements..."
                      value={formData.specialRequest}
                      onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4E9D5]/60 border border-[#B28A4A]/40 focus:bg-white focus:border-[#1E2D12] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-sm tracking-[0.25em] uppercase border border-[#B28A4A] transition-all duration-300 shadow-md hover:shadow-luxury flex items-center justify-center space-x-2"
                    >
                      <span>Confirm Reservation</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* VISUAL FLOORPLAN SEAT SELECTOR */
                <div className="space-y-4">
                  <div className="p-3 bg-[#F4E9D5] border border-[#B28A4A]/40 text-xs flex justify-between items-center">
                    <span className="font-semibold text-[#1E2D12]">
                      Select your preferred table on the layout:
                    </span>
                    <div className="flex items-center space-x-3 text-[10px]">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-700" />
                        <span>Available</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-stone-400" />
                        <span>Occupied</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-[#B28A4A]" />
                        <span>Selected</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 pr-1">
                    {floorplanZones.map((zone) => (
                      <div key={zone.name} className="p-3.5 bg-white border border-[#B28A4A]/30">
                        <div className="flex items-center space-x-2 mb-2 pb-1 border-b border-[#B28A4A]/20">
                          <span className="text-base">{zone.icon}</span>
                          <h4 className="font-serif font-bold text-sm text-[#1E2D12]">{zone.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {zone.tables.map((tbl) => {
                            const isSelected = formData.tableNumber.includes(tbl.name);
                            const isOccupied = tbl.status === 'occupied';

                            return (
                              <button
                                key={tbl.id}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    zone: zone.name,
                                    tableNumber: `${tbl.name} (${zone.name.split('(')[0].trim()})`,
                                  });
                                  onShowToast?.(`Selected ${tbl.name} in ${zone.name.split('(')[0]}`, 'success');
                                }}
                                className={`p-2 text-left border transition-all text-xs relative ${
                                  isSelected
                                    ? 'bg-[#1E2D12] text-[#F4E9D5] border-[#B28A4A] shadow-md font-semibold'
                                    : isOccupied
                                    ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                                    : 'bg-[#F4E9D5]/40 text-[#1E2D12] border-[#B28A4A]/30 hover:border-[#1E2D12]'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-serif font-bold">{tbl.name}</span>
                                  <span className="text-[10px] opacity-80">{tbl.capacity}P</span>
                                </div>
                                {tbl.featured && (
                                  <span className="text-[8px] uppercase tracking-wider text-[#B28A4A] block mt-0.5">
                                    ★ Popular Choice
                                  </span>
                                )}
                                {isSelected && (
                                  <div className="absolute top-1 right-1 text-[#B28A4A]">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('details')}
                      className="w-full py-2.5 bg-[#1E2D12] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.2em] font-semibold border border-[#B28A4A]"
                    >
                      Confirm Table & Return to Form ({formData.tableNumber.split('(')[0].trim()})
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* RESERVATION CONFIRMATION VOUCHER */
            <div className="text-center py-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#1E2D12] text-[#F4E9D5] flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 className="w-6 h-6 text-[#B28A4A]" />
              </div>

              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#B28A4A]">
                Reservation Confirmed
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E2D12] mt-1">
                We Await Your Visit
              </h3>

              <p className="text-xs text-[#4A321E]/80 mt-1 max-w-sm mx-auto">
                Your table has been reserved at Bungalow No 6. An SMS confirmation has been dispatched.
              </p>

              {/* Vintage Boarding Pass Card with Secure Reservation Code */}
              <div className="my-5 p-4 sm:p-5 bg-[#F4E9D5] border-2 border-dashed border-[#B28A4A]/60 text-left relative shadow-lg">
                <div className="flex justify-between items-center pb-3 border-b border-[#B28A4A]/30">
                  <div className="flex items-center space-x-2">
                    <Logo variant="dark" size="sm" hideText={true} />
                    <div>
                      <h4 className="font-serif font-bold text-sm tracking-wider text-[#1E2D12]">
                        BUNGALOW NO 6
                      </h4>
                      <span className="text-[9px] uppercase tracking-widest text-[#B28A4A]">
                        Table Reservation Pass
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#4A321E]/60 uppercase tracking-widest block font-semibold">
                      Reservation Code
                    </span>
                    <span className="font-mono font-bold text-sm text-[#1E2D12] bg-white px-2.5 py-1 border border-[#B28A4A] inline-block animate-code-reveal">
                      {bookingRef}
                    </span>
                  </div>
                </div>

                {/* Pass details */}
                <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#4A321E]/60 uppercase tracking-wider block">
                      Guest Name
                    </span>
                    <span className="font-medium text-[#1E2D12]">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A321E]/60 uppercase tracking-wider block">
                      Party Size
                    </span>
                    <span className="font-medium text-[#1E2D12]">{formData.guests} Guests</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A321E]/60 uppercase tracking-wider block">
                      Date & Time
                    </span>
                    <span className="font-medium text-[#1E2D12]">
                      {formData.date} • {formData.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A321E]/60 uppercase tracking-wider block">
                      Assigned Table
                    </span>
                    <span className="font-medium text-[#1E2D12] truncate block">
                      {formData.tableNumber}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#B28A4A]/30 text-[10px] text-[#4A321E]/70 flex items-center justify-between">
                  <span>📍 120, Green Avenue, Your City</span>
                  <span className="font-serif italic text-[#B28A4A]">Bungalow No 6</span>
                </div>
              </div>

              {/* Pass Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(bookingRef);
                    onShowToast?.(`Copied Reservation Code: ${bookingRef}`, 'success');
                  }}
                  className="flex-1 py-2.5 px-4 bg-white border border-[#B28A4A] text-xs font-medium uppercase tracking-wider text-[#1E2D12] hover:bg-[#F4E9D5] transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Copy Code ({bookingRef})</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 px-4 bg-[#1E2D12] text-[#F4E9D5] text-xs font-medium uppercase tracking-wider hover:bg-[#2A3C1B] transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
