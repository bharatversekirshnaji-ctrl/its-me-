import React, { useState, useEffect, useRef } from 'react';
import {
  Utensils, QrCode, RefreshCw, Eye, ChefHat, Bell, Check,
  ArrowRight, X, Play, ShieldCheck, Clock, AlertCircle, ArrowRightLeft,
  Calendar, CheckCircle2, User, Phone, MapPin, Lock, LogOut, Shield,
  Layers, ChevronRight, Hash, DollarSign, LayoutDashboard, ShoppingCart,
  Copy, Printer, ExternalLink, Download, Share2, Search, Filter,
  Users, CheckCircle, TrendingUp, Sparkles, Receipt, ArrowUpRight
} from 'lucide-react';
import { secureOrderingService } from '../services/secureOrderingService.js';
import { soundService } from '../services/soundService.js';
import Logo from '../components/Logo.jsx';
import Flourish from '../components/Flourish.jsx';

export default function StaffDashboardPage({
  isLoginRoute = false,
  onNavigateToTableLanding,
  onShowToast,
  onBackToHome,
}) {
  // Staff Auth State
  const [currentUser, setCurrentUser] = useState(() => secureOrderingService.getCurrentStaff());
  const [emailInput, setEmailInput] = useState('admin@bungalowno6.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: 'orders' | 'history' | 'tables' | 'customers' | 'kitchen' | 'service' | 'reservations'
  const [activeTab, setActiveTab] = useState('orders');
  const [ordersSubFilter, setOrdersSubFilter] = useState('all'); // 'all' | 'received' | 'confirmed' | 'sent_to_kitchen' | 'preparing' | 'ready' | 'served'

  // Order History Filter States
  const [historyDateRange, setHistoryDateRange] = useState('all'); // 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  const [historyCustomStart, setHistoryCustomStart] = useState('');
  const [historyCustomEnd, setHistoryCustomEnd] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyTableFilter, setHistoryTableFilter] = useState('all');

  // Customer Filter States
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Selected Detail Modal States
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [selectedTableDetail, setSelectedTableDetail] = useState(null);

  // Close Table Confirmation Modal
  const [tableToClose, setTableToClose] = useState(null);

  // QR Modal & Standee State
  const [activeQrTable, setActiveQrTable] = useState(null);
  const [copiedTableId, setCopiedTableId] = useState(null);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState(false);

  // Move Table Modal State
  const [movingOrder, setMovingOrder] = useState(null);
  const [targetTableId, setTargetTableId] = useState('');
  const [moveNotes, setMoveNotes] = useState('');

  // Live Timer Tick State for Table Occupancy
  const [, setTimerTick] = useState(0);

  // Track which order IDs we've already notified so sound only plays on genuinely new arrivals
  const seenOrderIdsRef = useRef(new Set());

  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  const refreshData = (isInitial = false) => {
    const orders = secureOrderingService.getActiveOrders();

    // Play new order bell for genuinely new incoming orders (not on initial mount)
    if (!isInitial) {
      orders.forEach((ord) => {
        if (!seenOrderIdsRef.current.has(ord.id) && ord.status === 'received') {
          soundService.playServiceBell();
        }
      });
    }
    orders.forEach((ord) => seenOrderIdsRef.current.add(ord.id));

    setTables(secureOrderingService.getTables());
    setActiveOrders(orders);
    setAllOrders(secureOrderingService.getAllOrders());
    setServiceRequests(secureOrderingService.getServiceRequests());
    setReservations(secureOrderingService.reservations);
    setCustomers(secureOrderingService.getCustomers());
    setDashboardStats(secureOrderingService.getDashboardStats());
    setCurrentUser(secureOrderingService.getCurrentStaff());
  };

  useEffect(() => {
    refreshData(true); // initial load — no sound
    const unsubscribe = secureOrderingService.subscribe(() => {
      refreshData(false); // subsequent — check for new orders
    });

    // Auto-refresh occupancy timers every 10 seconds
    const interval = setInterval(() => {
      setTimerTick((t) => t + 1);
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // --------------------------------------------------------------------------
  // STAFF LOGIN HANDLER
  // --------------------------------------------------------------------------
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both Email and Password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    const res = await secureOrderingService.staffLogin(emailInput, passwordInput);
    setIsLoggingIn(false);

    if (res.success) {
      setCurrentUser(res.staff);
      if (res.staff.role === 'kitchen') setActiveTab('kitchen');
      else if (res.staff.role === 'service') setActiveTab('service');
      else setActiveTab('orders');

      soundService.playConfirmation();
      onShowToast?.(`Welcome back, ${res.staff.name}! (${res.staff.title})`, 'success');
    } else {
      setLoginError(res.error || 'Invalid credentials.');
    }
  };

  const handleStaffLogout = () => {
    secureOrderingService.staffLogout();
    setCurrentUser(null);
    setPasswordInput('');
    onShowToast?.('Logged out from staff terminal.', 'info');
  };

  // --------------------------------------------------------------------------
  // ORDER LIFECYCLE HANDLERS
  // --------------------------------------------------------------------------
  const handleConfirmOrder = (orderId) => {
    soundService.playClick(2000);
    const res = secureOrderingService.confirmOrder(orderId, currentUser?.name);
    if (res.success) {
      onShowToast?.(`Order #${res.order.orderReference} Confirmed!`, 'success');
    }
  };

  const handleSendToKitchen = (orderId) => {
    soundService.playWhoosh(0.28);
    const res = secureOrderingService.sendOrderToKitchen(orderId, currentUser?.name);
    if (res.success) {
      soundService.playClick(1900);
      onShowToast?.(`Order #${res.order.orderReference} sent to Kitchen for Table 0${res.tableNumber}!`, 'success');
    }
  };

  const handleUpdateOrderStatus = (orderId, nextStatus) => {
    const res = secureOrderingService.updateOrderStatus(orderId, nextStatus, currentUser?.name);
    if (res.success) {
      const label = nextStatus === 'completed' ? 'Delivered & Completed (Moved to History)' : nextStatus.replace(/_/g, ' ');
      onShowToast?.(`Order #${res.order.orderReference} status: ${label}`, 'success');
    }
  };

  const handleOpenMoveModal = (order) => {
    setMovingOrder(order);
    const available = tables.find((t) => t.id !== order.tableId);
    if (available) setTargetTableId(available.id);
  };

  const handleConfirmMoveTable = () => {
    if (!movingOrder || !targetTableId) return;
    const res = secureOrderingService.moveTable(
      movingOrder.id,
      targetTableId,
      moveNotes || 'Guest requested relocation'
    );
    if (res.success) {
      onShowToast?.(`Order #${movingOrder.orderReference} moved: Table 0${res.fromTableNumber} → Table 0${res.toTableNumber}!`, 'info');
      setMovingOrder(null);
      setMoveNotes('');
    }
  };

  const handleAcknowledgeService = (reqId) => {
    soundService.playClick(1700);
    secureOrderingService.acknowledgeService(reqId);
    onShowToast?.('Service request acknowledged.', 'success');
  };

  // --------------------------------------------------------------------------
  // TABLE CLOSING HANDLER (Preserves all history)
  // --------------------------------------------------------------------------
  const handleConfirmCloseTable = () => {
    if (!tableToClose) return;
    const res = secureOrderingService.closeTable(tableToClose.id, currentUser?.name || 'Staff');
    if (res.success) {
      onShowToast?.(`Table 0${res.tableNumber} closed. All orders completed and preserved in History.`, 'info');
      setTableToClose(null);
      if (selectedTableDetail?.table.id === tableToClose.id) {
        setSelectedTableDetail(null);
      }
    }
  };

  // --------------------------------------------------------------------------
  // QR CODE HELPERS & CLIPBOARD SHARING
  // --------------------------------------------------------------------------
  const getTableUrl = (tableNumber) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:5173';
    return `${origin}/table/${tableNumber}`;
  };

  const getQrImageUrl = (tableNumber) => {
    const url = encodeURIComponent(getTableUrl(tableNumber));
    return `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${url}&color=16220E&bgcolor=FFFFFF&margin=2`;
  };

  const handleCopyTableUrl = (tableNumber, tableId) => {
    const url = getTableUrl(tableNumber);
    try {
      navigator.clipboard.writeText(url);
      setCopiedTableId(tableId);
      onShowToast?.(`📋 Table 0${tableNumber} URL copied to clipboard: ${url}`, 'success');
      setTimeout(() => setCopiedTableId(null), 2500);
    } catch (e) {
      onShowToast?.(`Table URL: ${url}`, 'info');
    }
  };

  const handleShareQrLink = async (table) => {
    const url = getTableUrl(table.tableNumber);
    const title = `Bungalow No 6 — Table 0${table.tableNumber} Order Menu`;
    const text = `Order food and drinks at Bungalow No 6 from Table 0${table.tableNumber}: ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        onShowToast?.(`Shared Table 0${table.tableNumber} QR Link!`, 'success');
        return;
      } catch (e) { }
    }
    handleCopyTableUrl(table.tableNumber, table.id);
  };

  const handleWhatsAppShare = (table) => {
    const url = getTableUrl(table.tableNumber);
    const text = encodeURIComponent(`🍽️ Bungalow No 6 — Table 0${table.tableNumber} Order Menu:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    onShowToast?.(`Opening WhatsApp share for Table 0${table.tableNumber}...`, 'info');
  };

  const handleCopyAllTableLinks = () => {
    const lines = tables.map((t) => `Table 0${t.tableNumber} (${t.name}): ${getTableUrl(t.tableNumber)}`);
    const text = `=== BUNGALOW NO 6 — TABLE QR ORDERING URLS ===\n\n` + lines.join('\n');
    try {
      navigator.clipboard.writeText(text);
      onShowToast?.('📋 All 16 Table URLs copied to clipboard!', 'success');
    } catch (e) {
      onShowToast?.('Copied table URLs', 'info');
    }
  };

  // --------------------------------------------------------------------------
  // FILTERED DATASETS
  // --------------------------------------------------------------------------
  // Active Orders filtered by sub-tab
  const getFilteredActiveOrders = () => {
    if (ordersSubFilter === 'all') return activeOrders;
    return activeOrders.filter((o) => o.status === ordersSubFilter);
  };

  const displayedActiveOrders = getFilteredActiveOrders();

  // Order History filtered by date, query, table
  const displayedOrderHistory = secureOrderingService.getOrderHistory({
    dateRange: historyDateRange,
    startDate: historyCustomStart,
    endDate: historyCustomEnd,
    searchQuery: historySearchQuery,
    tableId: historyTableFilter,
    includeAllStatuses: false, // only completed
  });

  // Customers filtered by query
  const displayedCustomers = customers.filter((c) => {
    if (!customerSearchQuery.trim()) return true;
    const q = customerSearchQuery.trim().toLowerCase();
    const matchName = (c.name || '').toLowerCase().includes(q);
    const matchPhone = (c.phone || '').toLowerCase().includes(q);
    const matchEmail = (c.email || '').toLowerCase().includes(q);
    return matchName || matchPhone || matchEmail;
  });

  // Kitchen Orders (sent_to_kitchen, preparing, ready)
  const kitchenOrders = allOrders.filter((o) => ['sent_to_kitchen', 'preparing', 'ready'].includes(o.status));
  const pendingService = serviceRequests.filter((s) => s.status === 'pending');
  const newReviewOrders = activeOrders.filter((o) => o.status === 'received');

  // Stats fallback
  const stats = dashboardStats || {
    todaysOrdersCount: 0,
    todaysRevenue: 0,
    activeTablesCount: 0,
    availableTablesCount: 16,
    completedOrdersCount: 0,
    pendingOrdersCount: 0,
    todaysCustomersCount: 0,
    totalTables: 16,
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: STAFF LOGIN (PROTECTED ACCESS GATE AT /staff/login OR /staff)
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#16220E] text-[#F4E9D5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#39431E]/30 rounded-full blur-3xl pointer-events-none" />
        {/* Tropical botanical texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/assets/texture_tropical.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12, mixBlendMode: 'soft-light' }} />

        <div className="relative z-10 max-w-md w-full bg-[#1E2D12]/95 border border-[#B28A4A]/50 shadow-2xl p-8 sm:p-10 text-center animate-scale-up">

          <div className="flex flex-col items-center mb-6 cursor-pointer" onClick={onBackToHome}>
            <Logo variant="gold" size="lg" />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#16220E] border border-[#B28A4A]/40 mb-3">
            <Lock className="w-3.5 h-3.5 text-[#B28A4A]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D9C09A] font-semibold">
              Restricted Operations
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4E9D5]">
            STAFF LOGIN
          </h1>
          <p className="text-xs text-[#D9C09A]/80 font-light mt-1 max-w-xs mx-auto">
            Authorized personnel only. Enter your credentials to access the terminal.
          </p>

          <form onSubmit={handleStaffLogin} className="mt-8 space-y-4 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#D9C09A] mb-1">
                Staff Email / ID
              </label>
              <input
                type="text"
                required
                placeholder="admin@bungalowno6.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#16220E] text-[#F4E9D5] placeholder-[#D9C09A]/40 border border-[#B28A4A]/50 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#F4E9D5]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#D9C09A] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#16220E] text-[#F4E9D5] placeholder-[#D9C09A]/40 border border-[#B28A4A]/50 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#F4E9D5]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] font-serif text-xs uppercase tracking-[0.25em] font-bold border border-[#F4E9D5] transition-all duration-150 active:scale-95 shadow-lg mt-2"
            >
              {isLoggingIn ? 'Authenticating...' : 'Login to Staff Portal'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#B28A4A]/25 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-[#D9C09A]/60 hover:text-[#F4E9D5] transition-colors"
            >
              ← Return to Main Website
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ROLE PERMISSIONS
  // --------------------------------------------------------------------------
  const isRoleAdmin = currentUser.role === 'admin';
  const isRoleStaff = isRoleAdmin || currentUser.role === 'staff';
  const isRoleKitchen = isRoleAdmin || currentUser.role === 'kitchen';
  const isRoleService = isRoleAdmin || currentUser.role === 'service' || currentUser.role === 'staff';

  // --------------------------------------------------------------------------
  // SCREEN 2: AUTHENTICATED STAFF DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen pt-20 pb-20 bg-[#FFF9EF] text-[#4A321E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* STAFF TOP HEADER (Logo + Title + Staff Profile + Logout) */}
        {/* ========================================================================= */}
        <div className="mb-6 p-6 bg-[#16220E] text-[#F4E9D5] border border-[#B28A4A]/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          <div className="flex items-center space-x-3.5">
            <Logo variant="light" size="sm" hideText={true} />
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B28A4A] font-semibold block">
                Bungalow No 6 Operations
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4E9D5]">
                Staff Portal
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#1E2D12] border border-[#B28A4A]/40 px-3.5 py-1.5 text-right">
              <span className="font-serif font-bold text-xs text-[#F4E9D5] block">
                {currentUser.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#B28A4A] font-medium">
                {currentUser.title} ({currentUser.role?.toUpperCase()})
              </span>
            </div>

            <button
              onClick={refreshData}
              className="p-2 bg-[#1E2D12] hover:bg-[#2A3C1B] border border-[#B28A4A]/40 text-[#D9C09A] hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStaffLogout}
              className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 border border-rose-500/50 text-[#F4E9D5] text-xs font-serif uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* DASHBOARD METRICS SUMMARY CARDS (DYNAMIC FROM SUPABASE / STORE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">

          {/* Today's Orders */}
          <div className="p-3.5 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#4A321E]/70 font-semibold block">
              Today's Orders
            </span>
            <span className="font-serif font-bold text-2xl text-[#1E2D12] block mt-1">
              {stats.todaysOrdersCount}
            </span>
          </div>

          {/* Today's Revenue */}
          <div className="p-3.5 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#4A321E]/70 font-semibold block">
              Today's Revenue
            </span>
            <span className="font-serif font-bold text-xl text-[#B28A4A] block mt-1 font-mono">
              ₹{stats.todaysRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Active Tables */}
          <div className="p-3.5 bg-white border border-amber-400/60 shadow-sm bg-amber-50/20 flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-amber-900 font-semibold block">
              Active Tables
            </span>
            <span className="font-serif font-bold text-2xl text-amber-700 block mt-1">
              {stats.activeTablesCount} / {stats.totalTables}
            </span>
          </div>

          {/* Available Tables */}
          <div className="p-3.5 bg-white border border-emerald-400/60 shadow-sm bg-emerald-50/20 flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-emerald-900 font-semibold block">
              Available Tables
            </span>
            <span className="font-serif font-bold text-2xl text-emerald-700 block mt-1">
              {stats.availableTablesCount}
            </span>
          </div>

          {/* Completed Orders */}
          <div className="p-3.5 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#4A321E]/70 font-semibold block">
              Completed Orders
            </span>
            <span className="font-serif font-bold text-2xl text-emerald-800 block mt-1">
              {stats.completedOrdersCount}
            </span>
          </div>

          {/* Pending Orders */}
          <div className="p-3.5 bg-white border border-rose-400/60 shadow-sm bg-rose-50/20 flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-rose-900 font-semibold block">
              Pending Orders
            </span>
            <span className="font-serif font-bold text-2xl text-rose-700 block mt-1">
              {stats.pendingOrdersCount}
            </span>
          </div>

          {/* Today's Customers */}
          <div className="p-3.5 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#4A321E]/70 font-semibold block">
              Today's Customers
            </span>
            <span className="font-serif font-bold text-2xl text-[#1E2D12] block mt-1">
              {stats.todaysCustomersCount}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MAIN NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b border-[#B28A4A]/30">

          {isRoleStaff && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all relative ${activeTab === 'orders'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              <span>📋 Active Orders ({activeOrders.length})</span>
              {newReviewOrders.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                  {newReviewOrders.length} New
                </span>
              )}
            </button>
          )}

          {isRoleStaff && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all ${activeTab === 'history'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              📜 Order History
            </button>
          )}

          {isRoleStaff && (
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all ${activeTab === 'tables'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              🪑 Tables & Occupancy ({tables.length})
            </button>
          )}

          {isRoleStaff && (
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all ${activeTab === 'customers'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              👥 Customers ({customers.length})
            </button>
          )}

          {isRoleKitchen && (
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all relative ${activeTab === 'kitchen'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              <span>👨‍🍳 Kitchen KDS ({kitchenOrders.length})</span>
              {kitchenOrders.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                  {kitchenOrders.length}
                </span>
              )}
            </button>
          )}

          {isRoleService && (
            <button
              onClick={() => setActiveTab('service')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all relative ${activeTab === 'service'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              <span>🔔 Service Requests ({pendingService.length})</span>
              {pendingService.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                  {pendingService.length}
                </span>
              )}
            </button>
          )}

          {isRoleStaff && (
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 text-xs font-serif uppercase tracking-wider font-semibold transition-all ${activeTab === 'reservations'
                ? 'bg-[#1E2D12] text-[#F4E9D5] shadow-md border border-[#1E2D12]'
                : 'bg-[#F4E9D5] text-[#4A321E] border border-[#B28A4A]/30 hover:border-[#1E2D12]'
                }`}
            >
              📅 Reservations ({reservations.length})
            </button>
          )}

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ACTIVE ORDERS (Only Active / In-Progress Orders) */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && isRoleStaff && (
          <div className="space-y-6">

            {/* Orders Sub-Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { id: 'all', label: 'All Active', count: activeOrders.length },
                { id: 'received', label: 'New (Review)', count: activeOrders.filter((o) => o.status === 'received').length },
                { id: 'confirmed', label: 'Confirmed', count: activeOrders.filter((o) => o.status === 'confirmed').length },
                { id: 'sent_to_kitchen', label: 'In Kitchen', count: activeOrders.filter((o) => o.status === 'sent_to_kitchen').length },
                { id: 'preparing', label: 'Preparing', count: activeOrders.filter((o) => o.status === 'preparing').length },
                { id: 'ready', label: 'Ready to Serve', count: activeOrders.filter((o) => o.status === 'ready').length },
                { id: 'served', label: 'Served', count: activeOrders.filter((o) => o.status === 'served').length },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setOrdersSubFilter(filter.id)}
                  className={`px-3 py-1.5 text-xs font-serif uppercase tracking-wider font-medium border transition-colors ${ordersSubFilter === filter.id
                    ? 'bg-[#1E2D12] text-[#F4E9D5] border-[#1E2D12] font-bold'
                    : 'bg-white text-[#4A321E] border-[#B28A4A]/30 hover:border-[#1E2D12]'
                    }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {displayedActiveOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#B28A4A]/30 p-8 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <p className="font-serif text-lg font-bold text-[#1E2D12]">
                  No active orders in this view
                </p>
                <p className="text-xs text-[#4A321E]/70 max-w-sm mx-auto">
                  Completed orders automatically move to the permanent <strong>Order History</strong> tab and are never deleted.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedActiveOrders.map((ord) => {
                  const table = tables.find((t) => t.id === ord.tableId);
                  const isNew = ord.status === 'received';

                  return (
                    <div
                      key={ord.id}
                      className={`p-5 bg-white border shadow-sm space-y-3.5 transition-all ${isNew ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400/40' : 'border-[#B28A4A]/30'
                        }`}
                    >
                      {/* Top Bar: Table & Order Reference */}
                      <div className="flex justify-between items-start pb-2 border-b border-[#B28A4A]/20">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 bg-[#1E2D12] text-[#F4E9D5] font-serif font-bold text-xs">
                              TABLE 0{table?.tableNumber || '6'}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#B28A4A]">
                              #{ord.orderReference}
                            </span>
                          </div>

                          <div className="mt-1 space-y-0.5 text-xs text-[#1E2D12]">
                            <span className="font-semibold block">Customer: {ord.customerName}</span>
                            {ord.reservationReference && (
                              <span className="text-[11px] font-mono text-[#B28A4A] block">
                                Reservation: {ord.reservationReference} ({ord.guests || 2} Guests)
                              </span>
                            )}
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${ord.status === 'served'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'ready'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'preparing'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.status === 'sent_to_kitchen'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                          ● {ord.status === 'received' ? 'NEW (REVIEW)' : ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1.5 text-xs text-[#4A321E]">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>
                              <strong>{it.quantity}×</strong> {it.name}
                              {it.notes && <span className="text-[11px] text-[#B28A4A] italic ml-1.5">({it.notes})</span>}
                            </span>
                            <span className="font-mono font-medium">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Special Request */}
                      {ord.specialRequest && (
                        <div className="p-2 bg-[#F4E9D5]/60 border border-[#B28A4A]/30 text-[11px] text-[#4A321E]">
                          <span className="font-semibold text-[#1E2D12]">Special Request: </span>
                          <span>{ord.specialRequest}</span>
                        </div>
                      )}

                      {/* Total & Action Buttons */}
                      <div className="pt-3 border-t border-[#B28A4A]/20 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-serif font-bold text-sm text-[#1E2D12]">
                          Total: ₹{ord.totalAmount}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Status Progression Actions */}
                          {ord.status === 'received' && (
                            <>
                              <button
                                onClick={() => handleConfirmOrder(ord.id)}
                                className="px-3 py-1.5 bg-[#F4E9D5] hover:bg-[#B28A4A] text-[#16220E] font-serif text-[11px] uppercase tracking-wider font-bold transition-all border border-[#B28A4A]/60"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleSendToKitchen(ord.id)}
                                className="px-3.5 py-1.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-[11px] uppercase tracking-wider font-bold transition-transform active:scale-95 shadow-md flex items-center space-x-1"
                              >
                                <ChefHat className="w-3 h-3 text-[#B28A4A]" />
                                <span>Send to Kitchen</span>
                              </button>
                            </>
                          )}

                          {ord.status === 'confirmed' && (
                            <button
                              onClick={() => handleSendToKitchen(ord.id)}
                              className="px-3.5 py-1.5 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-[11px] uppercase tracking-wider font-bold transition-transform active:scale-95 shadow-md flex items-center space-x-1"
                            >
                              <ChefHat className="w-3 h-3 text-[#B28A4A]" />
                              <span>Send to Kitchen</span>
                            </button>
                          )}

                          {ord.status === 'sent_to_kitchen' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-serif text-[11px] uppercase tracking-wider font-bold"
                            >
                              Start Prep
                            </button>
                          )}

                          {ord.status === 'preparing' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-serif text-[11px] uppercase tracking-wider font-bold"
                            >
                              Mark Ready
                            </button>
                          )}

                          {ord.status === 'ready' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'served')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-serif text-[11px] uppercase tracking-wider font-bold"
                            >
                              Mark Served
                            </button>
                          )}

                          {ord.status === 'served' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-[#F4E9D5] font-serif text-[11px] uppercase tracking-wider font-bold border border-emerald-600 shadow-sm"
                              title="Complete order and move to history"
                            >
                              ✓ Complete Order
                            </button>
                          )}

                          {/* Move Table */}
                          <button
                            onClick={() => handleOpenMoveModal(ord)}
                            className="p-1.5 bg-[#F4E9D5] hover:bg-[#1E2D12] hover:text-[#F4E9D5] border border-[#B28A4A]/50 text-[#1E2D12] transition-colors"
                            title="Move to another table"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* View Order Details / Audit Timeline */}
                          <button
                            onClick={() => setSelectedOrderDetail(secureOrderingService.getOrderDetails(ord.id))}
                            className="p-1.5 bg-[#1E2D12] text-[#F4E9D5] hover:bg-[#2A3C1B] border border-[#B28A4A]/40 transition-colors"
                            title="View Order Details & Status History"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDER HISTORY (PERMANENT RETENTION & ADVANCED FILTERING) */}
        {/* ========================================================================= */}
        {activeTab === 'history' && isRoleStaff && (
          <div className="space-y-6">

            {/* Filter Toolbar */}
            <div className="p-5 bg-white border border-[#B28A4A]/30 shadow-sm space-y-4">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#B28A4A]/20">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E2D12]">
                    Permanent Order History
                  </h3>
                  <p className="text-xs text-[#4A321E]/70">
                    All completed orders are permanently preserved in the Supabase database.
                  </p>
                </div>

                <span className="font-mono text-xs bg-[#F4E9D5] px-3 py-1 border border-[#B28A4A]/40 font-bold text-[#1E2D12]">
                  {displayedOrderHistory.length} Completed Orders
                </span>
              </div>

              {/* Search + Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#4A321E]/50" />
                  <input
                    type="text"
                    placeholder="Search customer, order #, phone..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                  />
                </div>

                {/* Date Filter */}
                <div>
                  <select
                    value={historyDateRange}
                    onChange={(e) => setHistoryDateRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">This Week (Last 7 Days)</option>
                    <option value="month">This Month (Last 30 Days)</option>
                    <option value="custom">Custom Date Range...</option>
                  </select>
                </div>

                {/* Table Filter */}
                <div>
                  <select
                    value={historyTableFilter}
                    onChange={(e) => setHistoryTableFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                  >
                    <option value="all">All Tables (01–16)</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        Table 0{t.tableNumber} — {t.name.split('—')[1] || t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setHistorySearchQuery('');
                    setHistoryDateRange('all');
                    setHistoryTableFilter('all');
                    setHistoryCustomStart('');
                    setHistoryCustomEnd('');
                  }}
                  className="px-4 py-2 bg-[#F4E9D5] hover:bg-[#1E2D12] hover:text-[#F4E9D5] border border-[#B28A4A]/50 text-xs font-serif uppercase tracking-wider font-semibold transition-colors text-center"
                >
                  Clear Filters
                </button>
              </div>

              {/* Custom Date Picker (if selected) */}
              {historyDateRange === 'custom' && (
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#B28A4A]/20">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-semibold text-[#1E2D12]">From:</span>
                    <input
                      type="date"
                      value={historyCustomStart}
                      onChange={(e) => setHistoryCustomStart(e.target.value)}
                      className="px-2 py-1 bg-[#FFF9EF] border border-[#B28A4A]/40 text-xs"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-semibold text-[#1E2D12]">To:</span>
                    <input
                      type="date"
                      value={historyCustomEnd}
                      onChange={(e) => setHistoryCustomEnd(e.target.value)}
                      className="px-2 py-1 bg-[#FFF9EF] border border-[#B28A4A]/40 text-xs"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Historical Orders Roster */}
            {displayedOrderHistory.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#B28A4A]/30 p-8 space-y-2">
                <Receipt className="w-10 h-10 text-[#B28A4A]/50 mx-auto" />
                <p className="font-serif text-lg font-bold text-[#1E2D12]">
                  No orders match your filter criteria
                </p>
                <p className="text-xs text-[#4A321E]/70">
                  Try adjusting the date range or clear search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedOrderHistory.map((ord) => {
                  const table = tables.find((t) => t.id === ord.tableId);
                  const orderDate = new Date(ord.createdAt);
                  const formattedDate = orderDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const formattedTime = orderDate.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderDetail(secureOrderingService.getOrderDetails(ord.id))}
                      className="p-4 bg-white border border-[#B28A4A]/30 hover:border-[#1E2D12] hover:shadow-lg transition-all cursor-pointer space-y-3 relative group"
                    >
                      {/* Top Header */}
                      <div className="flex justify-between items-start pb-2 border-b border-[#B28A4A]/20">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-sm text-[#1E2D12]">
                              #{ord.orderReference}
                            </span>
                            <span className="px-2 py-0.5 bg-[#1E2D12] text-[#F4E9D5] text-[10px] font-serif font-bold">
                              Table 0{table?.tableNumber || '0'}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-[#1E2D12] block mt-1">
                            {ord.customerName}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] uppercase tracking-wider font-bold">
                          ✓ Completed
                        </span>
                      </div>

                      {/* Items Summary */}
                      <div className="space-y-1 text-xs text-[#4A321E]/85">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.quantity}× {it.name}</span>
                            <span className="font-mono">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer: Date & Total */}
                      <div className="pt-2 border-t border-[#B28A4A]/20 flex justify-between items-center text-xs">
                        <span className="text-[11px] text-[#4A321E]/70 font-mono">
                          {formattedDate} • {formattedTime}
                        </span>
                        <span className="font-serif font-bold text-sm text-[#1E2D12]">
                          ₹{ord.totalAmount}
                        </span>
                      </div>

                      {/* Hover Overlay Hint */}
                      <div className="text-[10px] text-[#B28A4A] font-semibold flex items-center justify-end space-x-1 group-hover:text-[#1E2D12]">
                        <span>View Details & Timeline</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TABLE OCCUPANCY & PHYSICAL QR STANDEES */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && isRoleStaff && (
          <div className="space-y-6">

            {/* Top Toolbar for QR Code Sharing & Printing */}
            <div className="p-4 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2D12]">
                  Physical Café Table Occupancy & QR Standees (Tables 01–16)
                </h3>
                <p className="text-xs text-[#4A321E]/75 mt-0.5">
                  Live occupancy timers, smart estimated free times, and physical standee controls.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyAllTableLinks}
                  className="px-3.5 py-2 bg-[#F4E9D5] hover:bg-[#1E2D12] hover:text-[#F4E9D5] border border-[#B28A4A]/50 text-xs font-serif uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Copy All Table Links</span>
                </button>

                <button
                  onClick={() => setIsPrintAllOpen(true)}
                  className="px-4 py-2 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] border border-[#B28A4A] text-xs font-serif uppercase tracking-wider font-bold transition-all shadow-md flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Print All Table Standees</span>
                </button>
              </div>
            </div>

            {/* Table Cards Grid (Requirement #16 Staff Table Card) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((tbl) => {
                const occ = secureOrderingService.calculateTableOccupancy(tbl.id);
                const isOccupied = occ.isOccupied;
                const isCopied = copiedTableId === tbl.id;

                return (
                  <div
                    key={tbl.id}
                    className={`p-4 bg-white border transition-all flex flex-col justify-between shadow-sm ${isOccupied
                      ? 'border-amber-400 bg-amber-50/25 ring-1 ring-amber-400/50'
                      : occ.activeReservation
                        ? 'border-blue-400 bg-blue-50/20'
                        : 'border-[#B28A4A]/30'
                      }`}
                  >
                    <div>
                      {/* Top Header: Table Number & Status Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-serif font-bold text-lg text-[#1E2D12]">
                          TABLE 0{tbl.tableNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${isOccupied
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : occ.activeReservation
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                            }`}
                        >
                          ● {isOccupied ? 'OCCUPIED' : occ.activeReservation ? 'RESERVED' : 'AVAILABLE'}
                        </span>
                      </div>

                      <p className="text-xs text-[#4A321E]/80 truncate">{tbl.name}</p>
                      <span className="text-[10px] text-[#B28A4A] block mt-0.5">
                        {tbl.zone} • {tbl.capacity} Seats
                      </span>

                      {/* OCCUPANCY DETAILS BLOCK */}
                      {isOccupied ? (
                        <div className="my-3 p-3 bg-amber-100/50 border border-amber-300 text-xs space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[#4A321E]/80 text-[11px]">Customer:</span>
                            <strong className="text-[#1E2D12]">{occ.customerName}</strong>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[#4A321E]/80 text-[11px]">Guests:</span>
                            <span className="font-semibold text-[#1E2D12]">{occ.guestsCount}</span>
                          </div>

                          {/* Live Occupancy Timer */}
                          <div className="flex items-center space-x-1.5 pt-1 text-amber-900 font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>{occ.occupiedFormatted}</span>
                          </div>

                          {/* Estimated Free Time */}
                          <div className="text-[11px] text-emerald-800 font-semibold bg-white/80 px-2 py-1 border border-emerald-300/50">
                            {occ.estimatedFreeFormatted}
                          </div>

                          <div className="text-[11px] text-[#4A321E] pt-0.5">
                            <strong>Active Orders:</strong> {occ.activeOrders.length}
                          </div>
                        </div>
                      ) : occ.activeReservation ? (
                        <div className="my-3 p-3 bg-blue-50 border border-blue-200 text-xs space-y-1">
                          <span className="font-bold text-blue-900 block">Reserved: {occ.activeReservation.bookingReference}</span>
                          <span className="text-blue-800 text-[11px] block">Guest: {occ.activeReservation.name} ({occ.activeReservation.guests} Guests)</span>
                          <span className="text-blue-700 text-[10px] block">{occ.activeReservation.reservationTime}</span>
                        </div>
                      ) : (
                        <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800">
                          <span className="font-semibold block">Available for Seating</span>
                          <span className="text-[10px] text-emerald-700">Ready for walk-in or QR order</span>
                        </div>
                      )}

                      {/* Scannable QR Code Thumbnail */}
                      <div
                        onClick={() => setActiveQrTable(tbl)}
                        className="p-2 bg-[#FFF9EF] border border-[#B28A4A]/30 text-center cursor-pointer hover:border-[#1E2D12] transition-colors group"
                      >
                        <img
                          src={getQrImageUrl(tbl.tableNumber)}
                          alt={`QR Table 0${tbl.tableNumber}`}
                          className="w-20 h-20 mx-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <span className="text-[9px] font-mono font-bold text-[#1E2D12] block mt-1">
                          /table/{tbl.tableNumber}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions: Requirement #16 ([View Table] [Close Table]) */}
                    <div className="mt-3 pt-2.5 border-t border-[#B28A4A]/20 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setSelectedTableDetail(occ)}
                          className="py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider bg-[#F4E9D5] text-[#1E2D12] border border-[#B28A4A]/50 hover:bg-[#1E2D12] hover:text-[#F4E9D5] transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3 h-3 text-[#B28A4A]" />
                          <span>View Table</span>
                        </button>

                        <button
                          onClick={() => setActiveQrTable(tbl)}
                          className="py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider bg-[#1E2D12] text-[#F4E9D5] hover:bg-[#2A3C1B] transition-colors flex items-center justify-center space-x-1"
                        >
                          <QrCode className="w-3 h-3 text-[#B28A4A]" />
                          <span>QR Standee</span>
                        </button>
                      </div>

                      {/* Close Table Button (Requirement #17) */}
                      {isOccupied && (
                        <button
                          onClick={() => setTableToClose(tbl)}
                          className="w-full py-2 text-[10px] font-bold uppercase tracking-wider bg-rose-700 hover:bg-rose-800 text-white transition-colors flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <span>Close Table 0{tbl.tableNumber}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CUSTOMERS MANAGEMENT (PERMANENT CUSTOMER PROFILES) */}
        {/* ========================================================================= */}
        {activeTab === 'customers' && isRoleStaff && (
          <div className="space-y-6">

            {/* Header & Search */}
            <div className="p-5 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2D12]">
                  Customer Profiles & Loyalty History
                </h3>
                <p className="text-xs text-[#4A321E]/75 mt-0.5">
                  Permanent guest records, total visits, lifetime orders, and cumulative spend.
                </p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#4A321E]/50" />
                <input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFF9EF] border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
                />
              </div>
            </div>

            {/* Customer Cards Grid */}
            {displayedCustomers.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#B28A4A]/30 p-8 space-y-2">
                <Users className="w-10 h-10 text-[#B28A4A]/50 mx-auto" />
                <p className="font-serif text-lg font-bold text-[#1E2D12]">No customers found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedCustomers.map((cust) => {
                  const lastVisit = new Date(cust.lastVisitAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomerProfile(secureOrderingService.getCustomerProfile(cust.id))}
                      className="p-5 bg-white border border-[#B28A4A]/30 hover:border-[#1E2D12] hover:shadow-lg transition-all cursor-pointer space-y-3 group"
                    >
                      {/* Name & Phone */}
                      <div className="flex justify-between items-start pb-2 border-b border-[#B28A4A]/20">
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#1E2D12]">
                            {cust.name}
                          </h4>
                          <span className="font-mono text-xs text-[#B28A4A] block">
                            {cust.phone}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 bg-[#F4E9D5] text-[#1E2D12] text-[10px] font-bold border border-[#B28A4A]/40 font-mono">
                          {cust.totalVisits} Visits
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-1">
                        <div className="p-2 bg-[#FFF9EF] border border-[#B28A4A]/20">
                          <span className="text-[10px] text-[#4A321E]/70 uppercase block">Total Orders</span>
                          <strong className="text-sm font-serif text-[#1E2D12]">{cust.totalOrders}</strong>
                        </div>
                        <div className="p-2 bg-[#FFF9EF] border border-[#B28A4A]/20">
                          <span className="text-[10px] text-[#4A321E]/70 uppercase block">Total Spent</span>
                          <strong className="text-sm font-serif text-[#B28A4A] font-mono">₹{cust.totalSpent.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-[#B28A4A]/20 flex justify-between items-center text-xs">
                        <span className="text-[11px] text-[#4A321E]/70">
                          Last Visit: {lastVisit}
                        </span>
                        <span className="text-[10px] text-[#B28A4A] font-bold group-hover:text-[#1E2D12] flex items-center space-x-1">
                          <span>View Profile</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: KITCHEN WORKFLOW (KDS) */}
        {/* ========================================================================= */}
        {activeTab === 'kitchen' && isRoleKitchen && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1E2D12]">
                  Kitchen Display System (KDS)
                </h3>
                <p className="text-xs text-[#4A321E]/70">
                  Live preparation tickets in kitchen order.
                </p>
              </div>
              <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-3 py-1 font-bold">
                {kitchenOrders.length} Active Tickets
              </span>
            </div>

            {kitchenOrders.length === 0 ? (
              <p className="text-xs text-[#4A321E]/70 py-12 text-center bg-white border border-[#B28A4A]/30">
                No tickets currently in kitchen preparation.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kitchenOrders.map((ord) => {
                  const table = tables.find((t) => t.id === ord.tableId);

                  return (
                    <div key={ord.id} className="p-5 bg-white border-2 border-[#1E2D12] shadow-md space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#1E2D12]/20">
                        <div>
                          <span className="font-serif font-bold text-lg text-[#1E2D12]">
                            TABLE 0{table?.tableNumber || '6'}
                          </span>
                          <span className="font-mono text-xs text-[#B28A4A] block">#{ord.orderReference}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-[#4A321E] block">
                            Guest: {ord.customerName}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-bold inline-block mt-0.5 ${ord.status === 'ready' ? 'bg-blue-100 text-blue-800' : ord.status === 'preparing' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-sm py-0.5">
                            <span className="font-bold text-[#1E2D12]">{it.quantity} × {it.name}</span>
                            {it.notes && <span className="text-xs italic text-[#B28A4A]">({it.notes})</span>}
                          </div>
                        ))}
                      </div>

                      {ord.specialRequest && (
                        <p className="text-xs text-rose-700 font-semibold bg-rose-50 p-2 border border-rose-200">
                          Special Request: {ord.specialRequest}
                        </p>
                      )}

                      <div className="pt-3 border-t border-[#B28A4A]/20 flex justify-end space-x-2">
                        {ord.status === 'sent_to_kitchen' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-serif text-xs uppercase font-bold"
                          >
                            Start Preparing
                          </button>
                        )}
                        {ord.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-serif text-xs uppercase font-bold"
                          >
                            Mark Ready
                          </button>
                        )}
                        {ord.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'served')}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-serif text-xs uppercase font-bold"
                          >
                            Mark Served ✓
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SERVICE REQUESTS (WAITER CALLS & BILL REQUESTS) */}
        {/* ========================================================================= */}
        {activeTab === 'service' && isRoleService && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#1E2D12]">
              Table Service & Waiter Calls
            </h3>

            {serviceRequests.length === 0 ? (
              <p className="text-xs text-[#4A321E]/70 py-10 text-center bg-white border border-[#B28A4A]/30">
                No active service requests.
              </p>
            ) : (
              <div className="space-y-3">
                {serviceRequests.map((req) => {
                  const table = tables.find((t) => t.id === req.tableId);
                  const isPending = req.status === 'pending';

                  return (
                    <div
                      key={req.id}
                      className={`p-4 bg-white border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isPending ? 'border-rose-400 bg-rose-50/20' : 'border-[#B28A4A]/30'
                        }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isPending ? 'bg-rose-600 text-white animate-bounce' : 'bg-stone-200 text-stone-700'
                          }`}>
                          T0{table?.tableNumber || '6'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-serif font-bold text-base text-[#1E2D12]">
                              SERVICE REQUEST: Table 0{table?.tableNumber || '6'}
                            </span>
                            <span className="text-xs text-[#4A321E]/70">({req.customerName})</span>
                          </div>
                          <p className="text-xs text-[#1E2D12] font-semibold mt-0.5">
                            Request: {req.requestType}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isPending ? (
                          <button
                            onClick={() => handleAcknowledgeService(req.id)}
                            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-serif text-xs uppercase tracking-wider font-bold"
                          >
                            Acknowledge Request
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold">
                            ✓ Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: RESERVATIONS ROSTER */}
        {/* ========================================================================= */}
        {activeTab === 'reservations' && isRoleStaff && (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="p-4 bg-white border border-[#B28A4A]/30 shadow-sm flex flex-col md:flex-row justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-sm text-[#1E2D12]">{res.name}</span>
                    <span className="font-mono text-[11px] bg-[#F4E9D5] px-2 py-0.5 font-bold border border-[#B28A4A]/40">
                      Code: {res.bookingReference}
                    </span>
                  </div>
                  <p className="text-[#4A321E]/80 mt-1">
                    {res.reservationDate} at {res.reservationTime} • {res.guests} Guests • {res.seatingArea}
                  </p>
                  {res.specialRequests && (
                    <p className="text-[#B28A4A] italic mt-0.5">"{res.specialRequests}"</p>
                  )}
                </div>
                <span className="font-semibold text-emerald-700 self-center">Confirmed</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CLOSE TABLE CONFIRMATION (Requirement #17) */}
      {/* ========================================================================= */}
      {tableToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 relative">
            <button
              onClick={() => setTableToClose(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E2D12]">
                Close Table 0{tableToClose.tableNumber}?
              </h3>
              <p className="text-xs text-[#4A321E]/80 leading-relaxed">
                This will end the current table session and mark Table 0{tableToClose.tableNumber} as <strong>Available</strong>.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1 mb-5">
              <strong>Data Retention Notice:</strong>
              <p>
                All customer records, completed orders, order items, and status timelines are <strong>permanently preserved</strong> in the database and accessible via Order History.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTableToClose(null)}
                className="flex-1 py-2.5 bg-stone-200 text-xs font-serif uppercase tracking-wider text-[#4A321E]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCloseTable}
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-serif uppercase tracking-wider font-bold shadow-md"
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ORDER DETAILS & STATUS HISTORY TIMELINE (Requirement #8) */}
      {/* ========================================================================= */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-lg bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrderDetail(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-3 border-b border-[#B28A4A]/30">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-lg text-[#1E2D12]">
                  #{selectedOrderDetail.order.orderReference}
                </span>
                <span className="px-2.5 py-0.5 bg-[#1E2D12] text-[#F4E9D5] text-xs font-serif font-bold">
                  Table 0{selectedOrderDetail.table?.tableNumber || '0'}
                </span>
                <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${selectedOrderDetail.order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                  ● {selectedOrderDetail.order.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="mt-2 text-xs text-[#4A321E]/80 flex justify-between">
                <span>Guest: <strong>{selectedOrderDetail.order.customerName}</strong></span>
                <span className="font-mono">{new Date(selectedOrderDetail.order.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="py-4 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1E2D12]">
                Order Items
              </h4>
              <div className="space-y-1.5 bg-white p-3 border border-[#B28A4A]/25 text-xs">
                {selectedOrderDetail.order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-0.5">
                    <div>
                      <strong>{it.quantity}×</strong> {it.name}
                      {it.notes && <span className="text-[11px] text-[#B28A4A] italic ml-1.5">({it.notes})</span>}
                    </div>
                    <span className="font-mono font-medium">₹{it.price * it.quantity}</span>
                  </div>
                ))}

                <div className="pt-2 border-t border-[#B28A4A]/20 flex justify-between font-bold text-sm text-[#1E2D12]">
                  <span>Total Amount</span>
                  <span className="font-serif">₹{selectedOrderDetail.order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Chronological Status Audit Timeline */}
            <div className="pt-2 pb-4 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1E2D12] flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B28A4A]" />
                <span>Order Status Audit Trail</span>
              </h4>

              <div className="space-y-2 bg-white p-3 border border-[#B28A4A]/25">
                {selectedOrderDetail.statusHistory.length === 0 ? (
                  <p className="text-xs text-[#4A321E]/60 italic">No status changes recorded.</p>
                ) : (
                  selectedOrderDetail.statusHistory.map((h, idx) => {
                    const t = new Date(h.changedAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div key={idx} className="flex items-start space-x-3 text-xs">
                        <span className="font-mono text-[11px] font-bold text-[#B28A4A] shrink-0 w-16">
                          {t}
                        </span>
                        <div className="flex-1">
                          <span className="font-bold text-[#1E2D12] uppercase tracking-wide text-[11px]">
                            {h.newStatus.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-[#4A321E]/70 block">
                            By {h.changedBy || 'System'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetail(null)}
              className="w-full py-2 bg-[#1E2D12] text-[#F4E9D5] text-xs font-serif uppercase tracking-wider font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CUSTOMER PROFILE & ORDER HISTORY (Requirements #20 & #21) */}
      {/* ========================================================================= */}
      {selectedCustomerProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedCustomerProfile(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="pb-3 border-b border-[#B28A4A]/30">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold block">
                Customer Record
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1E2D12]">
                {selectedCustomerProfile.customer.name}
              </h3>
              <div className="flex flex-wrap gap-4 text-xs text-[#4A321E]/80 mt-1">
                <span>Phone: <strong className="font-mono">{selectedCustomerProfile.customer.phone}</strong></span>
                {selectedCustomerProfile.customer.email && (
                  <span>Email: <strong>{selectedCustomerProfile.customer.email}</strong></span>
                )}
              </div>
            </div>

            {/* Visit Summary 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white border border-[#B28A4A]/30 text-center">
                <span className="text-[10px] uppercase text-[#4A321E]/70 font-semibold block">Total Visits</span>
                <span className="font-serif font-bold text-xl text-[#1E2D12]">{selectedCustomerProfile.customer.totalVisits}</span>
              </div>
              <div className="p-3 bg-white border border-[#B28A4A]/30 text-center">
                <span className="text-[10px] uppercase text-[#4A321E]/70 font-semibold block">Total Orders</span>
                <span className="font-serif font-bold text-xl text-[#1E2D12]">{selectedCustomerProfile.customer.totalOrders}</span>
              </div>
              <div className="p-3 bg-white border border-[#B28A4A]/30 text-center">
                <span className="text-[10px] uppercase text-[#4A321E]/70 font-semibold block">Total Spent</span>
                <span className="font-serif font-bold text-lg text-[#B28A4A] font-mono">₹{selectedCustomerProfile.customer.totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-white border border-[#B28A4A]/30 text-center">
                <span className="text-[10px] uppercase text-[#4A321E]/70 font-semibold block">Avg Order Value</span>
                <span className="font-serif font-bold text-lg text-[#1E2D12] font-mono">₹{selectedCustomerProfile.customer.averageOrderValue}</span>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#1E2D12]">
                Customer Order History ({selectedCustomerProfile.orders.length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedCustomerProfile.orders.map((ord) => {
                  const table = tables.find((t) => t.id === ord.tableId);
                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderDetail(secureOrderingService.getOrderDetails(ord.id));
                      }}
                      className="p-3 bg-white border border-[#B28A4A]/25 hover:border-[#1E2D12] transition-colors cursor-pointer flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#1E2D12]">#{ord.orderReference}</span>
                          <span className="px-2 py-0.5 bg-[#F4E9D5] text-[10px] font-bold">Table 0{table?.tableNumber || '0'}</span>
                        </div>
                        <span className="text-[11px] text-[#4A321E]/70 font-mono mt-0.5 block">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-[#1E2D12] block">₹{ord.totalAmount}</span>
                        <span className="text-[9px] uppercase font-bold text-emerald-800">{ord.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reservations List */}
            {selectedCustomerProfile.reservations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#1E2D12]">
                  Reservations History ({selectedCustomerProfile.reservations.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedCustomerProfile.reservations.map((r) => (
                    <div key={r.id} className="p-2.5 bg-white border border-[#B28A4A]/25 text-xs flex justify-between">
                      <div>
                        <strong>{r.bookingReference}</strong> • {r.reservationDate} at {r.reservationTime} ({r.guests} Guests)
                      </div>
                      <span className="text-emerald-700 font-semibold uppercase text-[10px]">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedCustomerProfile(null)}
              className="w-full py-2 bg-[#1E2D12] text-[#F4E9D5] text-xs font-serif uppercase tracking-wider font-bold"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TABLE DETAILS VIEW */}
      {/* ========================================================================= */}
      {selectedTableDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedTableDetail(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-2 border-b border-[#B28A4A]/30">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold block">
                Table Status & Occupancy
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1E2D12]">
                TABLE 0{selectedTableDetail.table.tableNumber}
              </h3>
              <p className="text-xs text-[#4A321E]/80">{selectedTableDetail.table.name}</p>
            </div>

            {selectedTableDetail.isOccupied ? (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-300 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <strong>{selectedTableDetail.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupied Duration:</span>
                    <strong className="text-amber-900">{selectedTableDetail.occupiedFormatted}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Free:</span>
                    <strong className="text-emerald-800">{selectedTableDetail.estimatedFreeFormatted}</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#1E2D12]">
                    Active Orders on Table ({selectedTableDetail.activeOrders.length})
                  </h4>
                  {selectedTableDetail.activeOrders.map((o) => (
                    <div key={o.id} className="p-2 bg-white border border-[#B28A4A]/25 text-xs flex justify-between">
                      <span>#{o.orderReference} ({o.items.length} items)</span>
                      <strong>₹{o.totalAmount}</strong>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const tbl = selectedTableDetail.table;
                    setSelectedTableDetail(null);
                    setTableToClose(tbl);
                  }}
                  className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-serif uppercase tracking-wider font-bold shadow-md"
                >
                  Close Table 0{selectedTableDetail.table.tableNumber}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <strong>Table is currently Available</strong>
                <p>No active customer session.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELIBERATE MOVE TABLE ACTION */}
      {/* ========================================================================= */}
      {movingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 relative">
            <button
              onClick={() => setMovingOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#1E2D12] mb-1">
              Move Order to Another Table
            </h3>
            <p className="text-xs text-[#4A321E]/80 mb-4">
              Order: <strong>#{movingOrder.orderReference}</strong> ({movingOrder.customerName})
            </p>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#1E2D12]">
                Select Destination Table:
              </label>
              <select
                value={targetTableId}
                onChange={(e) => setTargetTableId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#B28A4A]/40 focus:outline-none focus:border-[#1E2D12]"
              >
                {tables
                  .filter((t) => t.id !== movingOrder.tableId)
                  .map((tbl) => (
                    <option key={tbl.id} value={tbl.id}>
                      Table 0{tbl.tableNumber} — {tbl.name} ({tbl.status})
                    </option>
                  ))}
              </select>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#1E2D12] mb-1">
                  Staff Notes (Audit Log):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guest moved to courtyard terrace"
                  value={moveNotes}
                  onChange={(e) => setMoveNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#B28A4A]/40"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setMovingOrder(null)}
                className="flex-1 py-2.5 bg-stone-200 text-xs font-serif uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMoveTable}
                className="flex-1 py-2.5 bg-[#1E2D12] text-[#F4E9D5] text-xs font-serif uppercase tracking-wider font-bold"
              >
                Confirm Move Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SINGLE TABLE QR STANDEE CARD & SHARING */}
      {/* ========================================================================= */}
      {activeQrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#FFF9EF] text-[#4A321E] border border-[#B28A4A]/50 shadow-2xl p-6 text-center space-y-4 relative">
            <button
              onClick={() => setActiveQrTable(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1E2D12] hover:bg-[#F4E9D5] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Table Tent Design Preview */}
            <div className="p-6 bg-white border-2 border-[#1E2D12] shadow-md space-y-3">
              <Logo variant="dark" size="sm" hideText={true} />

              <div>
                <span className="font-serif text-sm font-bold text-[#1E2D12] block tracking-wide">
                  BUNGALOW NO 6
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B28A4A] font-semibold block">
                  PREMIUM CAFÉ & LOUNGE
                </span>
              </div>

              <div className="py-2 border-y border-[#B28A4A]/40 bg-[#FFF9EF]">
                <span className="font-serif text-2xl font-bold text-[#1E2D12] block">
                  TABLE 0{activeQrTable.tableNumber}
                </span>
                <span className="text-[10px] text-[#4A321E]/80 block font-medium">
                  {activeQrTable.zone}
                </span>
              </div>

              {/* Scannable QR Code */}
              <div className="p-3 bg-white border border-[#B28A4A]/30 inline-block shadow-inner">
                <img
                  src={getQrImageUrl(activeQrTable.tableNumber)}
                  alt={`QR Code Table 0${activeQrTable.tableNumber}`}
                  className="w-44 h-44 object-contain mx-auto"
                />
              </div>

              <p className="text-[10px] text-[#4A321E]/80 font-light italic">
                Scan with your phone camera to order directly from this table.
              </p>

              <div className="font-mono text-[9px] text-[#4A321E]/60 pt-1">
                {getTableUrl(activeQrTable.tableNumber)}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShareQrLink(activeQrTable)}
                  className="py-2.5 bg-[#B28A4A] hover:bg-[#F4E9D5] text-[#16220E] border border-[#F4E9D5] text-xs font-serif uppercase tracking-wider font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share QR Link</span>
                </button>

                <button
                  onClick={() => handleWhatsAppShare(activeQrTable)}
                  className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-serif uppercase tracking-wider font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopyTableUrl(activeQrTable.tableNumber, activeQrTable.id)}
                  className="py-2 bg-[#F4E9D5] hover:bg-[#1E2D12] hover:text-[#F4E9D5] border border-[#B28A4A]/60 text-xs font-serif uppercase tracking-wider font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Copy URL</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="py-2 bg-[#1E2D12] hover:bg-[#2A3C1B] text-[#F4E9D5] font-serif text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B28A4A]" />
                  <span>Print Standee</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const num = activeQrTable.tableNumber;
                  setActiveQrTable(null);
                  onNavigateToTableLanding?.(num);
                }}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#1E2D12] text-xs font-serif uppercase tracking-wider flex items-center justify-center space-x-1.5"
              >
                <ExternalLink className="w-3 h-3 text-[#B28A4A]" />
                <span>Simulate Customer Scan (Open Table 0{activeQrTable.tableNumber})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINT ALL 16 TABLE STANDEES (PRINTABLE SHEET) */}
      {/* ========================================================================= */}
      {isPrintAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-4xl bg-white text-[#4A321E] shadow-2xl p-6 my-8 space-y-4 relative border border-[#B28A4A]/50">

            <div className="flex items-center justify-between pb-4 border-b border-[#B28A4A]/30">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1E2D12]">
                  Printable Table QR Standees (Tables 01–16)
                </h3>
                <p className="text-xs text-[#4A321E]/70">
                  Ready-to-print café table tents for all physical tables.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-[#1E2D12] text-[#F4E9D5] font-serif text-xs uppercase tracking-wider font-bold flex items-center space-x-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4 text-[#B28A4A]" />
                  <span>Print Sheet</span>
                </button>

                <button
                  onClick={() => setIsPrintAllOpen(false)}
                  className="p-2 text-stone-500 hover:bg-stone-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-stone-50 border border-stone-200 max-h-[70vh] overflow-y-auto">
              {tables.map((tbl) => (
                <div key={tbl.id} className="p-4 bg-white border-2 border-[#1E2D12] text-center space-y-2 shadow-sm">
                  <Logo variant="dark" size="sm" hideText={true} />
                  <span className="font-serif text-xs font-bold text-[#1E2D12] block">
                    BUNGALOW NO 6
                  </span>

                  <div className="py-1 bg-[#FFF9EF] border-y border-[#B28A4A]/40">
                    <span className="font-serif font-bold text-base text-[#1E2D12] block">
                      TABLE 0{tbl.tableNumber}
                    </span>
                    <span className="text-[8px] text-[#4A321E]/70 block truncate">{tbl.zone}</span>
                  </div>

                  <img
                    src={getQrImageUrl(tbl.tableNumber)}
                    alt={`QR Table 0${tbl.tableNumber}`}
                    className="w-28 h-28 mx-auto object-contain"
                  />

                  <span className="text-[8px] text-[#4A321E]/70 block">
                    Scan to Order
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
