import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Salad, Utensils, Coffee, Cake, Bell, ShoppingBag, 
  Plus, Minus, ArrowLeft, Check, CheckCircle2, ChevronRight, 
  ShieldAlert, ShieldCheck, Heart, Leaf, Shield, Zap, X, AlertCircle, Phone, Home, RefreshCw, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { secureOrderingService } from '../services/secureOrderingService.js';
import { MENU_ITEMS, ORDERING_CATEGORIES } from '../data/menuData.js';
import Logo from '../components/Logo.jsx';
import Flourish from '../components/Flourish.jsx';
import { triggerFlyToCart, AnimatedNumber, AnimatedSuccessCheckmark } from '../components/MotionEffects.jsx';
import { soundService } from '../services/soundService.js';


export default function CustomerTableOrderingPage({
  initialTable = null,
  isWalkInQr = false,
  onShowToast,
  onBackToHome,
  onOpenReservation,
}) {
  // If arrived via physical QR (/table/:tableNumber), we directly have the table
  // Otherwise, if arrived via /order or "Order at Your Table", require reservation code auth first!
  const [step, setStep] = useState(isWalkInQr && initialTable ? 'menu' : 'auth'); // 'auth' | 'menu' | 'cart' | 'confirmed'

  // Authentication State
  const [inputCode, setInputCode] = useState('');
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'invalid' | 'cancelled'
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Session & Table Context (STRICTLY READ-ONLY BY CUSTOMER)
  const [tableNumber, setTableNumber] = useState(6);
  const [tableName, setTableName] = useState('Table 06 — Jeep Courtyard View');
  const [customerName, setCustomerName] = useState('Nihal');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [activeBookingRef, setActiveBookingRef] = useState(null);

  // Menu Category Navigation
  const [activeCategory, setActiveCategory] = useState('recommended');

  // Cart State: { [dishId]: { dish, quantity, notes } }
  const [cart, setCart] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Motion State: Signature Physical Fly-to-Cart Trajectory
  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [removingItemIds, setRemovingItemIds] = useState(new Set());
  const cartButtonRef = useRef(null);

  // Order Receipt State
  const [placedOrder, setPlacedOrder] = useState(null);

  // Tactile Button Click Feedback State: { [dishId]: 'idle' | 'adding' | 'added' }
  const [buttonStates, setButtonStates] = useState({});


  // Call Service Modal State
  const [isCallServiceOpen, setIsCallServiceOpen] = useState(false);
  const [serviceReason, setServiceReason] = useState('Need Water');
  const [serviceSuccess, setServiceSuccess] = useState(false);

  // Auto-resolve if entered via physical table QR (/table/:id)
  useEffect(() => {
    if (isWalkInQr && initialTable) {
      const resolved = secureOrderingService.resolveTable(initialTable);
      if (resolved) {
        setTableNumber(resolved.tableNumber);
        setTableName(resolved.name);
        setStep('menu');
      }
    }
  }, [initialTable, isWalkInQr]);

  // Subscribe to live order updates to show real-time status in confirmation screen
  useEffect(() => {
    const unsubscribe = secureOrderingService.subscribe(() => {
      if (placedOrder) {
        const liveOrder = secureOrderingService.getOrderById(placedOrder.orderReference || placedOrder.order?.id);
        if (liveOrder) {
          setPlacedOrder((prev) => ({ ...prev, order: liveOrder, status: liveOrder.status }));
        }
      }
    });
    return () => unsubscribe();
  }, [placedOrder]);

  // --------------------------------------------------------------------------
  // SCREEN 1: ENTER RESERVATION CODE (AUTHENTICATION GATE)
  // --------------------------------------------------------------------------
  const handleVerifyCode = (e) => {
    e?.preventDefault();
    if (!inputCode.trim()) {
      setAuthStatus('invalid');
      setAuthError('Please enter your reservation code.');
      return;
    }

    setIsVerifying(true);
    setAuthStatus('idle');
    setAuthError('');

    setTimeout(() => {
      const res = secureOrderingService.validateReservationCode(inputCode);
      setIsVerifying(false);

      if (res.success && res.status === 'valid') {
        setTableNumber(res.tableNumber);
        setTableName(res.tableName);
        setActiveBookingRef(res.bookingReference || inputCode.trim().toUpperCase());
        if (res.customerName) setCustomerName(res.customerName);
        if (res.customerPhone) setCustomerPhone(res.customerPhone);
        soundService.playClick(2300);
        setStep('menu');
        onShowToast?.(`Welcome, ${res.customerName || 'Guest'}! Table 0${res.tableNumber} identified.`, 'success');
      } else if (res.status === 'cancelled') {
        soundService.playError();
        setAuthStatus('cancelled');
        setAuthError(res.error || 'This reservation is no longer active.');
      } else {
        soundService.playError();
        setAuthStatus('invalid');
        setAuthError(res.error || 'Invalid reservation code. Please check your code and try again.');
      }
    }, 350);
  };

  // --------------------------------------------------------------------------
  // TACTILE CART INTERACTIONS (Single Physical Fly-to-Cart + Bounce Reaction)
  // --------------------------------------------------------------------------
  const handleAddDish = (dish, clickEvent) => {
    // 1. Tactile transition: "Adding..."
    setButtonStates((prev) => ({ ...prev, [dish.id]: 'adding' }));

    // 2. Measure coordinates
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (clickEvent?.currentTarget) {
      const cardEl = clickEvent.currentTarget.closest('.food-card-interactive') || clickEvent.currentTarget;
      const imgEl = cardEl.querySelector('img') || cardEl;
      const rect = imgEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    let endX = window.innerWidth - 60;
    let endY = 40;
    if (cartButtonRef.current) {
      const cartRect = cartButtonRef.current.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    }

    // 3. Trigger single physical flight animation directly in DOM
    triggerFlyToCart({
      image: dish.highResImage || dish.image,
      startX,
      startY,
      endX,
      endY,
      onArrive: () => {
        // Update cart upon arrival
        setCart((prev) => {
          const currentQty = prev[dish.id]?.quantity || 0;
          return {
            ...prev,
            [dish.id]: {
              dish,
              quantity: currentQty + 1,
              notes: prev[dish.id]?.notes || '',
            },
          };
        });

        // Cart bounce reaction
        setIsCartBouncing(true);
        setTimeout(() => setIsCartBouncing(false), 580);

        // Tactile button state: "✓ Added"
        setButtonStates((prev) => ({ ...prev, [dish.id]: 'added' }));
        onShowToast?.(`Added ${dish.name} to table order`, 'success');

        setTimeout(() => {
          setButtonStates((prev) => ({ ...prev, [dish.id]: 'idle' }));
        }, 1100);
      },
    });
  };


  // --------------------------------------------------------------------------
  // SMOOTH MACOS-STYLE ITEM REMOVAL ANIMATION
  // --------------------------------------------------------------------------
  const handleUpdateQty = (dishId, delta) => {
    const current = cart[dishId];
    if (!current) return;

    if (current.quantity + delta <= 0) {
      // Trigger smooth item disappearance & soft descending removal sound
      soundService.playRemoveItem();
      setRemovingItemIds((prev) => new Set([...prev, dishId]));

      setTimeout(() => {
        setCart((prev) => {
          const copy = { ...prev };
          delete copy[dishId];
          return copy;
        });
        setRemovingItemIds((prev) => {
          const next = new Set(prev);
          next.delete(dishId);
          return next;
        });
      }, 360);
    } else {
      soundService.playQtyStep(delta > 0);
      setCart((prev) => ({
        ...prev,
        [dishId]: { ...current, quantity: current.quantity + delta },
      }));
    }
  };


  const cartItems = Object.values(cart);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  // --------------------------------------------------------------------------
  // ORDER SUBMISSION (Status: 'received')
  // --------------------------------------------------------------------------
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    const items = cartItems.map(({ dish, quantity, notes }) => ({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      notes,
    }));

    const res = secureOrderingService.placeOrder({
      tableIdentifier: tableNumber,
      customerName: customerName.trim() || 'Nihal',
      customerPhone: customerPhone || '+91 98765 43210',
      reservationReference: activeBookingRef,
      items,
      specialRequest: specialInstructions,
    });

    setIsPlacingOrder(false);

    if (res.success) {
      setPlacedOrder(res);
      setCart({});
      setStep('confirmed');
      soundService.playConfirmation();
      onShowToast?.(`Order #${res.orderReference} received for Table 0${tableNumber}!`, 'success');
      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#B28A4A', '#1E2D12', '#F4E9D5'],
        });
      } catch (e) {}
    } else {
      soundService.playError();
      onShowToast?.(res.error || 'Could not submit order.', 'error');
    }
  };

  // --------------------------------------------------------------------------
  // CALL SERVICE
  // --------------------------------------------------------------------------
  const handleSendServiceCall = () => {
    soundService.playServiceBell();
    secureOrderingService.callService({
      tableIdentifier: tableNumber,
      customerName: customerName || 'Nihal',
      requestType: serviceReason,
    });
    setServiceSuccess(true);
    setTimeout(() => {
      setServiceSuccess(false);
      setIsCallServiceOpen(false);

    }, 2000);
    onShowToast?.(`Service requested for Table 0${tableNumber}!`, 'success');
  };

  // --------------------------------------------------------------------------
  // CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const getFilteredDishes = () => {
    if (activeCategory === 'recommended') {
      return MENU_ITEMS.filter((item) => item.isSpecial || item.isChefSpecial || item.price >= 349).slice(0, 4);
    }
    if (activeCategory === 'starters') {
      return MENU_ITEMS.filter((item) => item.category === 'food' && item.price <= 350);
    }
    if (activeCategory === 'main_course') {
      return MENU_ITEMS.filter((item) => item.category === 'food' && item.price > 350);
    }
    if (activeCategory === 'beverages') {
      return MENU_ITEMS.filter((item) => item.category === 'beverages');
    }
    if (activeCategory === 'desserts') {
      return MENU_ITEMS.filter((item) => item.category === 'desserts' || item.name.toLowerCase().includes('truffle') || item.name.toLowerCase().includes('caramel'));
    }
    return MENU_ITEMS.slice(0, 4);
  };

  const displayedDishes = getFilteredDishes();
  const formattedTableNumber = tableNumber < 10 ? `0${tableNumber}` : `${tableNumber}`;

  // =========================================================================
  // SCREEN 1: ENTER RESERVATION CODE (CLEAN RESERVATION GATE — NO WALK-IN TEXT)
  // =========================================================================
  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-[#16220E] text-[#F4E9D5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39431E]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-[#1E2D12]/95 border border-[#B28A4A]/40 shadow-2xl p-8 sm:p-10 text-center animate-scale-up">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-6 cursor-pointer" onClick={onBackToHome}>
            <Logo variant="gold" size="lg" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4E9D5] mt-1">
            Enter Reservation Code
          </h1>
          <p className="text-xs sm:text-sm text-[#D9C09A]/80 font-light mt-1.5 leading-relaxed">
            Enter your secure reservation code to access your ordering portal.
          </p>

          {/* Invalid Code State */}
          {authStatus === 'invalid' && (
            <div className="mt-6 p-4 bg-rose-950/80 border border-rose-500/60 text-left space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-rose-300 font-serif font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Invalid Reservation Code</span>
              </div>
              <p className="text-xs text-rose-200/90 font-light">
                {authError || 'Please check your reservation code and try again.'}
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStatus('idle');
                    setInputCode('');
                  }}
                  className="flex-1 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-serif text-[11px] uppercase tracking-wider font-semibold"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-rose-200 font-serif text-[11px] uppercase tracking-wider"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Expired / Cancelled Code State */}
          {authStatus === 'cancelled' && (
            <div className="mt-6 p-4 bg-amber-950/80 border border-amber-500/60 text-left space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-amber-300 font-serif font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Reservation No Longer Active</span>
              </div>
              <p className="text-xs text-amber-200/90 font-light">
                This reservation code has expired or has been cancelled.
              </p>
              <button
                type="button"
                onClick={onOpenReservation}
                className="w-full py-2 bg-[#B28A4A] text-[#16220E] font-serif text-xs uppercase tracking-wider font-bold"
              >
                Make a New Reservation
              </button>
            </div>
          )}

          {/* Normal Entry Form */}
          {authStatus === 'idle' && (
            <form onSubmit={handleVerifyCode} className="mt-8 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter code (e.g. BN6-7X2M)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#16220E] text-[#F4E9D5] placeholder-[#D9C09A]/40 border border-[#B28A4A]/60 font-mono text-center tracking-widest text-sm sm:text-base focus:outline-none focus:border-[#F4E9D5] transition-colors uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-[0.25em] font-bold border border-[#F4E9D5] transition-all duration-150 active:scale-95 shadow-lg disabled:opacity-50"
              >
                {isVerifying ? 'Validating...' : 'Continue'}
              </button>
            </form>
          )}

          {/* Footer Assistance */}
          <div className="mt-8 pt-4 border-t border-[#B28A4A]/20 text-center">
            <span className="text-[11px] text-[#D9C09A]/70 block">
              Need assistance? Contact our concierge.
            </span>
            <a
              href="tel:+919876543210"
              className="font-serif font-bold text-xs text-[#B28A4A] hover:text-[#F4E9D5] transition-colors mt-0.5 inline-block"
            >
              +91 98765 43210
            </a>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3: CART / REVIEW ORDER (TABLE 06 READ-ONLY)
  // =========================================================================
  if (step === 'cart') {
    return (
      <div className="min-h-screen bg-[#FFF9EF] text-[#4A321E] pt-8 pb-20 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-xl w-full bg-[#FFF9EF] border border-[#B28A4A]/40 shadow-2xl overflow-hidden flex flex-col justify-between animate-scale-up">
          
          <div>
            {/* Header */}
            <div className="p-5 bg-[#1E2D12] text-[#F4E9D5] flex items-center justify-between border-b border-[#B28A4A]/30">
              <button
                onClick={() => { soundService.playClick(1800); setStep('menu'); }}
                className="flex items-center space-x-2 text-xs font-serif uppercase tracking-wider text-[#D9C09A] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Your Order</span>
              </button>

              {/* Table Read-Only Badge */}
              <div className="bg-[#16220E] border border-[#B28A4A]/60 px-3 py-1 text-center">
                <span className="text-[9px] uppercase tracking-widest text-[#B28A4A] block font-medium">TABLE</span>
                <span className="font-serif font-bold text-base text-[#F4E9D5] leading-none">{formattedTableNumber}</span>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="p-5 sm:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#4A321E]/60 space-y-2">
                  <ShoppingBag className="w-10 h-10 text-[#B28A4A]/50 mx-auto" />
                  <p className="font-serif text-base text-[#1E2D12] font-bold">Your cart is empty</p>
                  <p>Tap dishes from the menu to add them to your table tab.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map(({ dish, quantity }) => {
                    const isRemoving = removingItemIds.has(dish.id);

                    return (
                      <div
                        key={dish.id}
                        className={`p-3 bg-white border border-[#B28A4A]/30 flex items-center justify-between gap-3 shadow-sm transition-all ${
                          isRemoving ? 'animate-item-disappear' : ''
                        }`}
                      >
                        {/* Image Thumbnail */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1E2D12] shrink-0 border border-[#B28A4A]/40">
                          <img
                            src={dish.highResImage || dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-sm text-[#1E2D12] truncate">
                            {dish.name}
                          </h4>
                          <span className="text-xs text-[#B28A4A] font-semibold">
                            ₹{dish.price}
                          </span>
                        </div>

                        {/* Qty Controls with Rolling Number Animation */}
                        <div className="flex items-center space-x-2 bg-[#F4E9D5] border border-[#B28A4A]/40 px-2 py-0.5">
                          <button
                            onClick={() => handleUpdateQty(dish.id, -1)}
                            className="p-0.5 text-[#1E2D12] hover:text-[#B28A4A] active:scale-80 transition-transform"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <AnimatedNumber value={quantity} className="text-xs text-[#1E2D12]" />
                          <button
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            className="p-0.5 text-[#1E2D12] hover:text-[#B28A4A] active:scale-80 transition-transform"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Total line */}
                        <span className="font-mono font-bold text-xs text-[#1E2D12] w-12 text-right">
                          ₹{dish.price * quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Special Instructions */}
              {cartItems.length > 0 && (
                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E2D12] mb-1">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Less spicy for pasta, extra napkins"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: Total & Place Order */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#F4E9D5] border-t border-[#B28A4A]/30 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#4A321E]/70 block">
                  Total Amount
                </span>
                <span className="font-serif font-bold text-xl text-[#1E2D12]">
                  ₹{grandTotal}
                </span>
              </div>

              <button
                type="button"
                onClick={() => { soundService.playClick(2100); handlePlaceOrder(); }}
                disabled={isPlacingOrder}
                className="px-8 py-3.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-[0.25em] font-bold border border-[#B28A4A] transition-all duration-150 active:scale-95 shadow-md flex items-center space-x-2"
              >
                <span>{isPlacingOrder ? 'Submitting...' : 'Place Order'}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 4: ORDER RECEIVED CONFIRMATION SCREEN (NOT SENT TO KITCHEN YET)
  // =========================================================================
  if (step === 'confirmed') {
    const currentStatus = placedOrder?.status || 'received';

    return (
      <div className="min-h-screen bg-[#16220E] text-[#F4E9D5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full bg-[#1E2D12] border border-[#B28A4A]/50 shadow-2xl p-8 sm:p-10 text-center animate-scale-up">
          
          {/* Animated SVG Success Checkmark */}
          <AnimatedSuccessCheckmark size={68} color="#B28A4A" />

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4E9D5]">
            Order Received
          </h2>
          <p className="text-xs text-[#D9C09A] mt-1 font-light">
            Your order has been received and is being reviewed.
          </p>

          {/* Gold Framed Voucher Details */}
          <div className="my-5 p-4 bg-[#16220E] border-2 border-dashed border-[#B28A4A]/60 text-center space-y-1">
            <span className="font-mono text-sm tracking-widest text-[#F4E9D5] font-bold block">
              ORDER #{placedOrder?.orderReference || 'BN6-1042'}
            </span>
            <span className="font-serif text-xs tracking-widest text-[#B28A4A] font-semibold block uppercase">
              TABLE {formattedTableNumber}
            </span>
          </div>

          {/* Live Order Status Timeline */}
          <div className="my-5 p-4 bg-[#16220E]/80 border border-[#B28A4A]/30">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-semibold text-[#B28A4A] mb-4">
              <span>Order Progress</span>
              <span className="text-emerald-400 font-bold animate-pulse">● LIVE</span>
            </div>

            {/* Horizontal dot timeline */}
            <div className="flex items-center">
              {['received', 'confirmed', 'sent_to_kitchen', 'preparing', 'ready', 'served'].map((st, idx, arr) => {
                const steps = ['received', 'confirmed', 'sent_to_kitchen', 'preparing', 'ready', 'served', 'completed'];
                const stepIdx = steps.indexOf(currentStatus);
                const thisIdx = steps.indexOf(st);
                const isDone = thisIdx < stepIdx;
                const isCurrent = thisIdx === stepIdx;
                const labels = { received: 'Received', confirmed: 'Confirmed', sent_to_kitchen: 'Kitchen', preparing: 'Preparing', ready: 'Ready', served: 'Served' };

                return (
                  <React.Fragment key={st}>
                    {/* Dot */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isDone
                          ? 'bg-[#B28A4A] border-[#B28A4A]'
                          : isCurrent
                          ? 'bg-[#1E2D12] border-[#B28A4A] status-dot-pulse'
                          : 'bg-[#16220E] border-stone-600'
                      }`}>
                        {isDone ? (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : isCurrent ? (
                          <div className="w-2 h-2 rounded-full bg-[#B28A4A]" />
                        ) : null}
                      </div>
                      <span className={`text-[8px] mt-1 uppercase tracking-wide font-semibold ${
                        isDone || isCurrent ? 'text-[#B28A4A]' : 'text-stone-600'
                      }`}>
                        {labels[st]}
                      </span>
                    </div>
                    {/* Connector line */}
                    {idx < arr.length - 1 && (
                      <div className="flex-1 h-[2px] mx-1 rounded-full overflow-hidden bg-stone-700">
                        <div className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-[#B28A4A] w-full' : 'w-0'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <p className="text-[11px] text-[#D9C09A]/80 font-light mt-4 italic">
              {currentStatus === 'received' && 'Your order is received and waiting for staff confirmation.'}
              {currentStatus === 'confirmed' && 'Order confirmed by staff and queued for kitchen.'}
              {currentStatus === 'sent_to_kitchen' && 'Ticket received by kitchen.'}
              {currentStatus === 'preparing' && 'Chef is preparing your dishes. '}
              {currentStatus === 'ready' && 'Your food is ready and being plated for serving!'}
              {currentStatus === 'served' && 'Served to your table. Enjoy your meal!'}
              {currentStatus === 'completed' && 'Delivered & completed. Thank you for dining with us!'}
            </p>
          </div>

          <p className="text-xs text-[#D9C09A]/80 font-light italic mb-6">
            A team member will serve you shortly.
          </p>

          <button
            type="button"
            onClick={() => { soundService.playClick(1800); setStep('menu'); }}
            className="w-full py-3.5 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-[0.25em] font-bold border border-[#F4E9D5] transition-transform duration-150 active:scale-95 shadow-lg"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: MAIN MENU INTERFACE (TABLE AUTO-SHOWN, WITH LEFT SIDEBAR)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#4A321E] flex flex-col md:flex-row">
      
      {/* --------------------------------------------------------------------- */}
      {/* LEFT PERMANENT SIDEBAR (Visually matching reference image) */}
      {/* --------------------------------------------------------------------- */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#16220E] text-[#F4E9D5] shrink-0 border-r border-[#B28A4A]/30 flex flex-col justify-between p-6 z-20">
        <div>
          {/* Top Brand Logo */}
          <div className="flex flex-col items-start pb-6 border-b border-[#B28A4A]/25 cursor-pointer" onClick={onBackToHome}>
            <Logo variant="light" size="sm" />
          </div>

          {/* MENU CATEGORIES NAVIGATION */}
          <div className="mt-6 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B28A4A] font-semibold block mb-3">
              MENU
            </span>

            {ORDERING_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-none text-xs font-serif tracking-wider uppercase transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'bg-[#B28A4A] text-[#16220E] font-bold shadow-md'
                      : 'text-[#D9C09A]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.id === 'recommended' && <Sparkles className="w-4 h-4 shrink-0" />}
                  {cat.id === 'starters' && <Salad className="w-4 h-4 shrink-0" />}
                  {cat.id === 'main_course' && <Utensils className="w-4 h-4 shrink-0" />}
                  {cat.id === 'beverages' && <Coffee className="w-4 h-4 shrink-0" />}
                  {cat.id === 'desserts' && <Cake className="w-4 h-4 shrink-0" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-[#B28A4A]/25" />

          {/* ABOUT ORDERING / YOUR TABLE SECTION */}
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B28A4A] font-semibold block">
                YOUR TABLE
              </span>
              <span className="font-serif font-bold text-[#F4E9D5] text-lg block mt-0.5">
                TABLE {formattedTableNumber}
              </span>
              <span className="text-[11px] text-[#D9C09A]/70 block">{tableName}</span>
              
              {/* Clean customer-facing table status indicator (Requirement #15) */}
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/40 px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Your table is currently active.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#B28A4A]/20">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B28A4A] font-semibold block mb-1">
                NEED HELP?
              </span>
              <button
                onClick={() => setIsCallServiceOpen(true)}
                className="w-full py-2 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] border border-[#B28A4A]/50 text-xs font-serif uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-[#B28A4A]" />
                <span>Call Service</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Link */}
        <div className="pt-6 border-t border-[#B28A4A]/20">
          <button
            onClick={onBackToHome}
            className="text-[11px] text-[#D9C09A]/60 hover:text-[#F4E9D5] transition-colors"
          >
            ← Return to Café Website
          </button>
        </div>
      </aside>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR (Table 06 + Welcome, [Name] + Call Service + Sticky Cart) */}
        <header className="sticky top-0 z-30 bg-[#1E2D12] text-[#F4E9D5] px-5 sm:px-8 py-3.5 border-b border-[#B28A4A]/30 flex items-center justify-between shadow-md">
          
          {/* Left: Table 06 Badge + Welcome Message */}
          <div className="flex items-center space-x-4">
            <div className="bg-[#16220E] border border-[#B28A4A]/60 px-3 py-1 text-center shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-[#B28A4A] block font-medium">TABLE</span>
              <span className="font-serif font-bold text-lg sm:text-xl text-[#F4E9D5] leading-none">{formattedTableNumber}</span>
            </div>

            <div>
              <h2 className="font-serif font-bold text-sm sm:text-base text-[#F4E9D5] leading-tight">
                Welcome, {customerName}
              </h2>
              <span className="text-[11px] text-[#D9C09A]/80 font-light">
                Enjoy your experience!
              </span>
            </div>
          </div>

          {/* Right: Call Service + Sticky Cart Button */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button
              type="button"
              onClick={() => { soundService.playClick(1900); setIsCallServiceOpen(true); }}
              className="px-3 sm:px-4 py-2 bg-transparent hover:bg-white/10 text-[#F4E9D5] border border-[#B28A4A]/60 text-xs font-serif uppercase tracking-wider flex items-center space-x-1.5 transition-transform duration-150 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-[#B28A4A]" />
              <span className="hidden sm:inline">Call Service</span>
            </button>

            {/* Cart Button with Count Badge & Bounce Reaction */}
            <button
              ref={cartButtonRef}
              type="button"
              onClick={() => { soundService.playClick(2000); setStep('cart'); }}
              className={`relative px-3.5 sm:px-4 py-2 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-wider font-bold transition-all duration-150 active:scale-95 shadow-md flex items-center space-x-1.5 ${
                isCartBouncing ? 'animate-cart-bounce' : ''
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#16220E]" />
              <span>
                <AnimatedNumber value={totalItemCount} /> Items · ₹{grandTotal}
              </span>
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold font-mono border-2 border-[#1E2D12]">
                  <AnimatedNumber value={totalItemCount} />
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Categories Horizontal Bar */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-3 bg-[#F4E9D5] border-b border-[#B28A4A]/25 no-scrollbar">
          {ORDERING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-serif uppercase tracking-wider whitespace-nowrap font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1E2D12] text-[#F4E9D5] font-bold'
                  : 'bg-white text-[#4A321E] border border-[#B28A4A]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* MAIN FOOD CARDS CONTENT */}
        <div className="flex-1 p-5 sm:p-8 space-y-6">
          
          {/* Section Heading */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B28A4A] font-semibold block">
              Bungalow Cuisine
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2D12] uppercase tracking-wide mt-0.5">
              {activeCategory === 'recommended' ? 'RECOMMENDED FOR YOU' : activeCategory.replace('_', ' ')}
            </h3>
            <div className="w-16 h-[1.5px] bg-[#B28A4A] mt-1.5" />
          </div>

          {/* Food Cards Grid with Staggered Entrance and Interactive Hover */}
          <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayedDishes.map((dish, idx) => {
              const qty = cart[dish.id]?.quantity || 0;
              const buttonState = buttonStates[dish.id] || 'idle';

              return (
                <div
                  key={dish.id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="food-card-interactive bg-white border border-[#B28A4A]/35 shadow-sm flex flex-col justify-between overflow-hidden group animate-card-enter"
                >
                  {/* Dish Image Container with Physical Zoom */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#1E2D12] relative">
                    <img
                      src={dish.highResImage || dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        if (dish.image && e.target.src !== dish.image) {
                          e.target.src = dish.image;
                        }
                      }}
                    />
                    {/* Coffee steam — shown for hot beverage items */}
                    {(dish.category === 'coffee' || dish.category === 'beverages' || dish.name?.toLowerCase().includes('coffee') || dish.name?.toLowerCase().includes('chai') || dish.name?.toLowerCase().includes('tea')) && (
                      <>
                        <div className="steam-particle steam-1" />
                        <div className="steam-particle steam-2" />
                        <div className="steam-particle steam-3" />
                      </>
                    )}
                  </div>

                  {/* Dish Info */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1E2D12]">
                        {dish.name}
                      </h4>
                      <span className="font-serif font-bold text-sm text-[#B28A4A] block mt-0.5">
                        {dish.formattedPrice}
                      </span>
                      <p className="text-xs text-[#4A321E]/75 line-clamp-2 mt-1.5 font-light leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    {/* Controls & Add Button with Tactile Feedback */}
                    <div className="mt-4 pt-3 border-t border-[#B28A4A]/20 flex items-center justify-between gap-2">
                      {/* Quantity Controls with Animated Ticker */}
                      <div className="flex items-center space-x-1.5 bg-[#F4E9D5]/60 border border-[#B28A4A]/40 px-2 py-1 text-xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(dish.id, -1)}
                          className="p-0.5 text-[#1E2D12] hover:text-[#B28A4A] active:scale-80 transition-transform"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <AnimatedNumber value={qty > 0 ? qty : 1} className="text-xs text-[#1E2D12] px-1" />
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(dish.id, 1)}
                          className="p-0.5 text-[#1E2D12] hover:text-[#B28A4A] active:scale-80 transition-transform"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Add Button with Tactile Micro-Animations & Fly-to-Cart Trigger */}
                      <button
                        type="button"
                        onClick={(e) => handleAddDish(dish, e)}
                        className={`btn-shimmer px-4 py-1.5 font-serif text-xs uppercase tracking-wider font-semibold transition-all duration-150 active:scale-95 shadow-sm ${
                          buttonState === 'added'
                            ? 'bg-emerald-700 text-white border border-emerald-600'
                            : buttonState === 'adding'
                            ? 'bg-[#B28A4A] text-[#16220E]'
                            : 'bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] border border-[#B28A4A]'
                        }`}
                      >
                        {buttonState === 'added' ? '✓ Added' : buttonState === 'adding' ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* BOTTOM VALUE BAR */}
          <div className="mt-8 p-4 bg-[#F4E9D5] border border-[#B28A4A]/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-[#1E2D12]">
            <div className="flex items-center justify-center space-x-2">
              <Leaf className="w-4 h-4 text-[#B28A4A]" />
              <span className="font-serif font-medium">Fresh Ingredients</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-[#B28A4A]" />
              <span className="font-serif font-medium">Hygienic Kitchen</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-4 h-4 text-[#B28A4A]" />
              <span className="font-serif font-medium">Made with Love</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4 text-[#B28A4A]" />
              <span className="font-serif font-medium">Fast Service</span>
            </div>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* CALL SERVICE MODAL */}
      {/* ========================================================================= */}
      {isCallServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 relative animate-scale-up">
            <button
              onClick={() => setIsCallServiceOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full btn-tactile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-4">
              {/* Bell with ripple rings */}
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1E2D12] text-[#F4E9D5] flex items-center justify-center relative z-10">
                  <Bell className="w-6 h-6 text-[#B28A4A]" />
                </div>
                <div className="ripple-ring" />
                <div className="ripple-ring ripple-ring-delay" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E2D12]">
                Need Assistance?
              </h3>
              <p className="text-xs text-[#4A321E]/80">
                Service request for <strong>Table {formattedTableNumber}</strong>
              </p>
            </div>


            {serviceSuccess ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 text-center text-xs font-semibold animate-fadeIn">
                Service request sent ✓ A staff member is on the way.
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E2D12]">
                  How can we help?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Need Water', 'Need Cutlery', 'Need Assistance', 'Request Bill', 'Other'].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setServiceReason(reason)}
                      className={`p-2 text-xs font-serif text-left border transition-colors ${
                        serviceReason === reason
                          ? 'bg-[#1E2D12] text-[#F4E9D5] border-[#1E2D12] font-bold'
                          : 'bg-[#F4E9D5] text-[#4A321E] border-[#B28A4A]/30'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCallServiceOpen(false)}
                    className="flex-1 py-2.5 bg-stone-200 text-xs font-serif uppercase tracking-wider text-[#4A321E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendServiceCall}
                    className="flex-1 py-2.5 bg-[#1E2D12] text-[#F4E9D5] text-xs font-serif uppercase tracking-wider font-bold"
                  >
                    Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
