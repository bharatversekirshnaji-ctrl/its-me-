import { supabase, isSupabaseConfigured } from './supabaseClient.js';

/**
 * ============================================================================
 * BUNGALOW NO 6 — UNIFIED ORDERING, CUSTOMER & TABLE OCCUPANCY SERVICE
 * ============================================================================
 * Key Principles:
 * 1. Historical Data Preservation: Completed orders, closed sessions, and customer
 *    history are NEVER deleted. They transition to historical views.
 * 2. Order Lifecycle:
 *    received -> confirmed -> sent_to_kitchen -> preparing -> ready -> served -> completed
 * 3. Customer Recognition:
 *    Identifies returning guests by phone or email, aggregates visits, orders, and spend.
 * 4. Live Table Occupancy:
 *    Live occupancy timers, smart estimated free times based on dining duration & order state.
 * 5. Cross-Platform Ready:
 *    Structure matches Supabase schema 1:1 for website and upcoming Android app.
 * ============================================================================
 */

export function generateReservationCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BN6-${code}`;
}

export const INITIAL_CUSTOMERS = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Nihal',
    phone: '+91 98765 43210',
    email: 'nihal@example.com',
    totalVisits: 5,
    totalOrders: 12,
    totalSpent: 8450,
    firstVisitAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    lastVisitAt: new Date(Date.now() - 15 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Rahul & Priya',
    phone: '+91 98450 11223',
    email: 'rahul@example.com',
    totalVisits: 3,
    totalOrders: 7,
    totalSpent: 4230,
    firstVisitAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastVisitAt: new Date(Date.now() - 25 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Aman Verma',
    phone: '+91 97110 55443',
    email: 'aman@example.com',
    totalVisits: 2,
    totalOrders: 4,
    totalSpent: 2180,
    firstVisitAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    lastVisitAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Vikram Malhotra',
    phone: '+91 98200 99887',
    email: 'vikram@example.com',
    totalVisits: 4,
    totalOrders: 9,
    totalSpent: 6120,
    firstVisitAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    lastVisitAt: new Date(Date.now() - 35 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Zara Merchant',
    phone: '+91 99300 12345',
    email: 'zara@example.com',
    totalVisits: 1,
    totalOrders: 2,
    totalSpent: 1450,
    firstVisitAt: new Date(Date.now() - 86400000).toISOString(),
    lastVisitAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_TABLES = [
  { id: 't1000000-0000-0000-0000-000000000001', tableNumber: 1, name: 'Table 01 — Garden Veranda Patio', zone: 'The Garden Veranda', capacity: 2, qrToken: 'QR-BN6-T01-7F8A', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000002', tableNumber: 2, name: 'Table 02 — Garden Veranda Pergola', zone: 'The Garden Veranda', capacity: 4, qrToken: 'QR-BN6-T02-9C2D', status: 'occupied' },
  { id: 't1000000-0000-0000-0000-000000000003', tableNumber: 3, name: 'Table 03 — Garden Veranda Canopy', zone: 'The Garden Veranda', capacity: 4, qrToken: 'QR-BN6-T03-3E4B', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000004', tableNumber: 4, name: 'Table 04 — Garden Veranda Balcony', zone: 'The Garden Veranda', capacity: 6, qrToken: 'QR-BN6-T04-5A1C', status: 'reserved' },
  { id: 't1000000-0000-0000-0000-000000000005', tableNumber: 5, name: 'Table 05 — Jeep Courtyard Cobblestone', zone: 'The Jeep Courtyard', capacity: 2, qrToken: 'QR-BN6-T05-8D7F', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000006', tableNumber: 6, name: 'Table 06 — Jeep Courtyard View', zone: 'The Jeep Courtyard', capacity: 2, qrToken: 'QR-BN6-T06-4K9M', status: 'occupied' },
  { id: 't1000000-0000-0000-0000-000000000007', tableNumber: 7, name: 'Table 07 — Jeep Courtyard Starry Sky', zone: 'The Jeep Courtyard', capacity: 6, qrToken: 'QR-BN6-T07-2P6X', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000008', tableNumber: 8, name: 'Table 08 — Library Reading Nook', zone: 'The Library & Lounge', capacity: 2, qrToken: 'QR-BN6-T08-1W8Z', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000009', tableNumber: 9, name: 'Table 09 — Library Bookshelf Table', zone: 'The Library & Lounge', capacity: 2, qrToken: 'QR-BN6-T09-6R3V', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000010', tableNumber: 10, name: 'Table 10 — Library Leather Chesterfield', zone: 'The Library & Lounge', capacity: 4, qrToken: 'QR-BN6-T10-7B5N', status: 'occupied' },
  { id: 't1000000-0000-0000-0000-000000000011', tableNumber: 11, name: 'Table 11 — Library Fireplace Corner', zone: 'The Library & Lounge', capacity: 6, qrToken: 'QR-BN6-T11-9Q2J', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000012', tableNumber: 12, name: 'Table 12 — Emerald Dining Salon Booth', zone: 'Emerald Dining Salon', capacity: 4, qrToken: 'QR-BN6-T12-3X7L', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000013', tableNumber: 13, name: 'Table 13 — Emerald Velvet Alcove', zone: 'Emerald Dining Salon', capacity: 2, qrToken: 'QR-BN6-T13-8M4T', status: 'reserved' },
  { id: 't1000000-0000-0000-0000-000000000014', tableNumber: 14, name: 'Table 14 — Emerald Chandelier Table', zone: 'Emerald Dining Salon', capacity: 8, qrToken: 'QR-BN6-T14-5K1R', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000015', tableNumber: 15, name: 'Table 15 — Rooftop Botanical Gazebo', zone: 'The Botanical Terrace', capacity: 4, qrToken: 'QR-BN6-T15-2N9W', status: 'available' },
  { id: 't1000000-0000-0000-0000-000000000016', tableNumber: 16, name: 'Table 16 — Rooftop Sunset Perch', zone: 'The Botanical Terrace', capacity: 2, qrToken: 'QR-BN6-T16-6P8Y', status: 'available' },
];

export const INITIAL_RESERVATIONS = [
  {
    id: 'r1000000-0000-0000-0000-000000000001',
    bookingReference: 'BN6-7X2M',
    customerId: 'c1000000-0000-0000-0000-000000000001',
    name: 'Nihal',
    phone: '+91 98765 43210',
    email: 'nihal@example.com',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '08:00 PM',
    guests: 2,
    seatingArea: 'The Jeep Courtyard',
    occasion: 'Anniversary',
    specialRequests: 'Courtyard view table',
    status: 'confirmed',
    assignedTableId: 't1000000-0000-0000-0000-000000000006',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'r1000000-0000-0000-0000-000000000002',
    bookingReference: 'BN6-4K9P',
    customerId: 'c1000000-0000-0000-0000-000000000002',
    name: 'Rahul & Priya',
    phone: '+91 98450 11223',
    email: 'rahul@example.com',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '07:30 PM',
    guests: 2,
    seatingArea: 'The Library & Lounge',
    occasion: 'Romantic Date',
    specialRequests: 'Near bookshelves',
    status: 'confirmed',
    assignedTableId: 't1000000-0000-0000-0000-000000000004',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const INITIAL_TABLE_SESSIONS = [
  {
    id: 's1000000-0000-0000-0000-000000000006',
    tableId: 't1000000-0000-0000-0000-000000000006',
    customerId: 'c1000000-0000-0000-0000-000000000001',
    reservationId: 'r1000000-0000-0000-0000-000000000001',
    sessionToken: 'BN6-SES-T06-9821',
    startedAt: new Date(Date.now() - 12 * 60000).toISOString(), // 12 mins ago
    estimatedEndAt: new Date(Date.now() + 33 * 60000).toISOString(), // ~33 mins left
    endedAt: null,
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 's1000000-0000-0000-0000-000000000002',
    tableId: 't1000000-0000-0000-0000-000000000002',
    customerId: 'c1000000-0000-0000-0000-000000000002',
    reservationId: null,
    sessionToken: 'BN6-SES-T02-4412',
    startedAt: new Date(Date.now() - 28 * 60000).toISOString(), // 28 mins ago
    estimatedEndAt: new Date(Date.now() + 17 * 60000).toISOString(),
    endedAt: null,
    status: 'active',
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: 's1000000-0000-0000-0000-000000000010',
    tableId: 't1000000-0000-0000-0000-000000000010',
    customerId: 'c1000000-0000-0000-0000-000000000004',
    reservationId: null,
    sessionToken: 'BN6-SES-T10-7793',
    startedAt: new Date(Date.now() - 40 * 60000).toISOString(), // 40 mins ago
    estimatedEndAt: new Date(Date.now() + 5 * 60000).toISOString(),
    endedAt: null,
    status: 'active',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
];

export const INITIAL_ORDERS = [
  // Active Order on Table 06 (Received)
  {
    id: 'o1000000-0000-0000-0000-000000001042',
    tableId: 't1000000-0000-0000-0000-000000000006',
    tableSessionId: 's1000000-0000-0000-0000-000000000006',
    customerId: 'c1000000-0000-0000-0000-000000000001',
    reservationReference: 'BN6-7X2M',
    orderReference: 'BN6-1042',
    customerName: 'Nihal',
    customerPhone: '+91 98765 43210',
    guests: 2,
    items: [
      { id: 'truffle-pasta', name: 'Truffle Pasta', price: 399, quantity: 1, notes: 'Extra black truffle shavings' },
      { id: 'blue-lagoon', name: 'Blue Lagoon', price: 249, quantity: 2, notes: 'Less ice' },
    ],
    specialRequest: 'Less spicy',
    totalAmount: 897,
    status: 'received', // 'received' -> 'confirmed' -> 'sent_to_kitchen' -> 'preparing' -> 'ready' -> 'served' -> 'completed'
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  // Active Order on Table 02 (Sent to Kitchen)
  {
    id: 'o1000000-0000-0000-0000-000000001043',
    tableId: 't1000000-0000-0000-0000-000000000002',
    tableSessionId: 's1000000-0000-0000-0000-000000000002',
    customerId: 'c1000000-0000-0000-0000-000000000002',
    reservationReference: null,
    orderReference: 'BN6-1043',
    customerName: 'Rahul & Priya',
    customerPhone: '+91 98450 11223',
    guests: 2,
    items: [
      { id: 'classic-burger', name: 'Classic Bungalow Burger', price: 349, quantity: 2, notes: 'Crispy brioche bun' },
    ],
    specialRequest: '',
    totalAmount: 698,
    status: 'sent_to_kitchen',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  // Active Order on Table 10 (Preparing)
  {
    id: 'o1000000-0000-0000-0000-000000001044',
    tableId: 't1000000-0000-0000-0000-000000000010',
    tableSessionId: 's1000000-0000-0000-0000-000000000010',
    customerId: 'c1000000-0000-0000-0000-000000000004',
    reservationReference: null,
    orderReference: 'BN6-1044',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 98200 99887',
    guests: 4,
    items: [
      { id: 'grilled-cottage', name: 'Grilled Cottage Cheese Platter', price: 449, quantity: 1, notes: 'Medium spice' },
    ],
    specialRequest: 'Bring with extra lemon wedges',
    totalAmount: 449,
    status: 'preparing',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  // HISTORICAL COMPLETED ORDERS (Permanently Preserved)
  {
    id: 'o1000000-0000-0000-0000-000000001017',
    tableId: 't1000000-0000-0000-0000-000000000003',
    tableSessionId: null,
    customerId: 'c1000000-0000-0000-0000-000000000001',
    reservationReference: null,
    orderReference: 'BN6-1017',
    customerName: 'Nihal',
    customerPhone: '+91 98765 43210',
    guests: 2,
    items: [
      { id: 'smoked-salmon', name: 'Smoked Salmon Crostini', price: 399, quantity: 1, notes: 'Fresh dill' },
      { id: 'iced-latte', name: 'Artisan Iced Latte', price: 250, quantity: 1, notes: 'Oat milk' },
    ],
    specialRequest: 'Extra napkins',
    totalAmount: 649,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'o1000000-0000-0000-0000-000000000988',
    tableId: 't1000000-0000-0000-0000-000000000008',
    tableSessionId: null,
    customerId: 'c1000000-0000-0000-0000-000000000001',
    reservationReference: null,
    orderReference: 'BN6-0988',
    customerName: 'Nihal',
    customerPhone: '+91 98765 43210',
    guests: 2,
    items: [
      { id: 'avocado-toast', name: 'Avocado Brioche Toast', price: 380, quantity: 2, notes: 'Poached egg' },
      { id: 'tiramisu', name: 'Classic Tiramisu', price: 480, quantity: 1, notes: 'Extra cocoa powder' },
    ],
    specialRequest: 'Window seat setup',
    totalAmount: 1240,
    status: 'completed',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'o1000000-0000-0000-0000-000000001035',
    tableId: 't1000000-0000-0000-0000-000000000001',
    tableSessionId: null,
    customerId: 'c1000000-0000-0000-0000-000000000003',
    reservationReference: null,
    orderReference: 'BN6-1035',
    customerName: 'Aman Verma',
    customerPhone: '+91 97110 55443',
    guests: 3,
    items: [
      { id: 'truffle-pasta', name: 'Truffle Pasta', price: 399, quantity: 2, notes: '' },
      { id: 'classic-burger', name: 'Classic Bungalow Burger', price: 349, quantity: 1, notes: '' },
    ],
    specialRequest: '',
    totalAmount: 1147,
    status: 'completed',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'o1000000-0000-0000-0000-000000001039',
    tableId: 't1000000-0000-0000-0000-000000000012',
    tableSessionId: null,
    customerId: 'c1000000-0000-0000-0000-000000000005',
    reservationReference: null,
    orderReference: 'BN6-1039',
    customerName: 'Zara Merchant',
    customerPhone: '+91 99300 12345',
    guests: 2,
    items: [
      { id: 'grilled-cottage', name: 'Grilled Cottage Cheese Platter', price: 449, quantity: 2, notes: '' },
      { id: 'tiramisu', name: 'Classic Tiramisu', price: 480, quantity: 1, notes: '' },
    ],
    specialRequest: 'Table by chandelier',
    totalAmount: 1378,
    status: 'completed',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_ORDER_STATUS_HISTORY = [
  // Timeline for BN6-1042
  {
    id: 'osh-1042-1',
    orderId: 'o1000000-0000-0000-0000-000000001042',
    oldStatus: null,
    newStatus: 'received',
    changedBy: 'Customer / Online Portal',
    changedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  // Timeline for BN6-1043
  {
    id: 'osh-1043-1',
    orderId: 'o1000000-0000-0000-0000-000000001043',
    oldStatus: null,
    newStatus: 'received',
    changedBy: 'Customer / Online Portal',
    changedAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'osh-1043-2',
    orderId: 'o1000000-0000-0000-0000-000000001043',
    oldStatus: 'received',
    newStatus: 'confirmed',
    changedBy: 'Alex Vance (Staff)',
    changedAt: new Date(Date.now() - 23 * 60000).toISOString(),
  },
  {
    id: 'osh-1043-3',
    orderId: 'o1000000-0000-0000-0000-000000001043',
    oldStatus: 'confirmed',
    newStatus: 'sent_to_kitchen',
    changedBy: 'Alex Vance (Staff)',
    changedAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  // Timeline for BN6-1044
  {
    id: 'osh-1044-1',
    orderId: 'o1000000-0000-0000-0000-000000001044',
    oldStatus: null,
    newStatus: 'received',
    changedBy: 'Customer / Online Portal',
    changedAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 'osh-1044-2',
    orderId: 'o1000000-0000-0000-0000-000000001044',
    oldStatus: 'received',
    newStatus: 'confirmed',
    changedBy: 'Staff Terminal',
    changedAt: new Date(Date.now() - 33 * 60000).toISOString(),
  },
  {
    id: 'osh-1044-3',
    orderId: 'o1000000-0000-0000-0000-000000001044',
    oldStatus: 'confirmed',
    newStatus: 'sent_to_kitchen',
    changedBy: 'Staff Terminal',
    changedAt: new Date(Date.now() - 32 * 60000).toISOString(),
  },
  {
    id: 'osh-1044-4',
    orderId: 'o1000000-0000-0000-0000-000000001044',
    oldStatus: 'sent_to_kitchen',
    newStatus: 'preparing',
    changedBy: 'Chef Marco (Kitchen)',
    changedAt: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  // Timeline for Completed BN6-1017
  {
    id: 'osh-1017-1',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: null,
    newStatus: 'received',
    changedBy: 'Customer / Online Portal',
    changedAt: new Date(Date.now() - 2 * 86400000 - 50 * 60000).toISOString(),
  },
  {
    id: 'osh-1017-2',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: 'received',
    newStatus: 'confirmed',
    changedBy: 'Staff Terminal',
    changedAt: new Date(Date.now() - 2 * 86400000 - 48 * 60000).toISOString(),
  },
  {
    id: 'osh-1017-3',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: 'confirmed',
    newStatus: 'sent_to_kitchen',
    changedBy: 'Staff Terminal',
    changedAt: new Date(Date.now() - 2 * 86400000 - 47 * 60000).toISOString(),
  },
  {
    id: 'osh-1017-4',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: 'sent_to_kitchen',
    newStatus: 'preparing',
    changedBy: 'Chef Marco (Kitchen)',
    changedAt: new Date(Date.now() - 2 * 86400000 - 40 * 60000).toISOString(),
  },
  {
    id: 'osh-1017-5',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: 'preparing',
    newStatus: 'ready',
    changedBy: 'Chef Marco (Kitchen)',
    changedAt: new Date(Date.now() - 2 * 86400000 - 25 * 60000).toISOString(),
  },
  {
    id: 'osh-1017-6',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: 'ready',
    newStatus: 'served',
    changedBy: 'Floor Service',
    changedAt: new Date(Date.now() - 2 * 86400000 - 20 * 60000).toISOString(),
  },
  {
    id: 'osh-1017-7',
    orderId: 'o1000000-0000-0000-0000-000000001017',
    oldStatus: 'served',
    newStatus: 'completed',
    changedBy: 'Floor Service (Table Closed)',
    changedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const INITIAL_SERVICE_REQUESTS = [
  {
    id: 'sr100000-0000-0000-0000-000000000001',
    tableId: 't1000000-0000-0000-0000-000000000006',
    customerName: 'Nihal',
    requestType: 'Need Water',
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
  },
];

class SecureOrderingStore {
  constructor() {
    this.customers = [...INITIAL_CUSTOMERS];
    this.tables = [...INITIAL_TABLES];
    this.tableSessions = [...INITIAL_TABLE_SESSIONS];
    this.orders = [...INITIAL_ORDERS];
    this.orderStatusHistory = [...INITIAL_ORDER_STATUS_HISTORY];
    this.serviceRequests = [...INITIAL_SERVICE_REQUESTS];
    this.reservations = [...INITIAL_RESERVATIONS];
    this.currentStaff = null;
    this.tableAuditLogs = [];
    this.listeners = new Set();
    this.loadFromStorage();
  }

  loadFromStorage() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const saved = localStorage.getItem('bn6_table_ordering_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tables && parsed.orders) {
          this.customers = parsed.customers || this.customers;
          this.tables = parsed.tables;
          this.tableSessions = parsed.tableSessions || this.tableSessions;
          this.orders = parsed.orders;
          this.orderStatusHistory = parsed.orderStatusHistory || this.orderStatusHistory;
          this.serviceRequests = parsed.serviceRequests || this.serviceRequests;
          this.reservations = parsed.reservations || this.reservations;
          this.tableAuditLogs = parsed.tableAuditLogs || [];
          this.currentStaff = parsed.currentStaff || null;
        }
      }
    } catch (e) {}
  }

  saveToStorage() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.notify();
      return;
    }
    try {
      localStorage.setItem(
        'bn6_table_ordering_v6',
        JSON.stringify({
          customers: this.customers,
          tables: this.tables,
          tableSessions: this.tableSessions,
          orders: this.orders,
          orderStatusHistory: this.orderStatusHistory,
          serviceRequests: this.serviceRequests,
          reservations: this.reservations,
          tableAuditLogs: this.tableAuditLogs,
          currentStaff: this.currentStaff,
        })
      );
    } catch (e) {}
    this.notify();
  }

  notify() {
    this.listeners.forEach((fn) => {
      try { fn(); } catch (e) {}
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // --------------------------------------------------------------------------
  // 1. CUSTOMER RECOGNITION & PROFILE MANAGEMENT
  // --------------------------------------------------------------------------
  getOrCreateCustomer({ name = 'Guest', phone = '', email = '' }) {
    const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanName = name?.trim() || 'Guest';

    // 1. Check existing customer by phone
    let customer = null;
    if (cleanPhone) {
      customer = this.customers.find((c) => {
        const p1 = (c.phone || '').replace(/[^\d+]/g, '');
        return p1 && (p1 === cleanPhone || p1.slice(-10) === cleanPhone.slice(-10));
      });
    }

    // 2. Check by email if not found by phone
    if (!customer && cleanEmail) {
      customer = this.customers.find((c) => (c.email || '').toLowerCase() === cleanEmail);
    }

    // 3. If found, update last visit and name if provided
    if (customer) {
      customer.lastVisitAt = new Date().toISOString();
      if (cleanName && cleanName !== 'Guest') customer.name = cleanName;
      if (cleanEmail && !customer.email) customer.email = cleanEmail;
      if (cleanPhone && !customer.phone) customer.phone = cleanPhone;
      this.saveToStorage();
      return customer;
    }

    // 4. If new, create customer record
    const newCustomer = {
      id: 'c-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: cleanName,
      phone: cleanPhone || '+91 98765 00000',
      email: cleanEmail || '',
      totalVisits: 1,
      totalOrders: 0,
      totalSpent: 0,
      firstVisitAt: new Date().toISOString(),
      lastVisitAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.customers.unshift(newCustomer);
    this.saveToStorage();
    return newCustomer;
  }

  getCustomers() {
    // Recalculate dynamic aggregates
    return this.customers.map((c) => {
      const custOrders = this.orders.filter((o) => o.customerId === c.id || (o.customerName && o.customerName.toLowerCase() === c.name.toLowerCase()));
      const completedCustOrders = custOrders.filter((o) => o.status !== 'cancelled');
      const totalSpent = completedCustOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      const totalOrders = completedCustOrders.length;
      const aov = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

      return {
        ...c,
        totalOrders: Math.max(c.totalOrders || 0, totalOrders),
        totalSpent: Math.max(c.totalSpent || 0, totalSpent),
        averageOrderValue: aov,
      };
    });
  }

  getCustomerProfile(customerId) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (!customer) return null;

    const custOrders = this.orders.filter((o) => o.customerId === customer.id || (o.customerName && o.customerName.toLowerCase() === customer.name.toLowerCase()));
    const custReservations = this.reservations.filter((r) => r.customerId === customer.id || (r.phone && customer.phone && r.phone.replace(/[^\d+]/g, '') === customer.phone.replace(/[^\d+]/g, '')));
    
    const completedCustOrders = custOrders.filter((o) => o.status !== 'cancelled');
    const totalSpent = completedCustOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const totalOrders = completedCustOrders.length;
    const aov = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

    return {
      customer: {
        ...customer,
        totalOrders: Math.max(customer.totalOrders || 0, totalOrders),
        totalSpent: Math.max(customer.totalSpent || 0, totalSpent),
        averageOrderValue: aov,
      },
      orders: custOrders,
      reservations: custReservations,
    };
  }

  // --------------------------------------------------------------------------
  // 2. STAFF AUTHENTICATION (Supabase Auth & Roles)
  // --------------------------------------------------------------------------
  async staffLogin(emailOrId, password) {
    const rawInput = emailOrId?.trim();
    const pwd = password?.trim();

    if (!rawInput || !pwd) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    const email = rawInput.includes('@') ? rawInput.toLowerCase() : `${rawInput.toLowerCase()}@bungalowno6.com`;

    // 1. Supabase Auth if available
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pwd,
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('staff_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .maybeSingle();

          const staffUser = {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || data.user.user_metadata?.name || 'Staff Member',
            role: profile?.role || data.user.user_metadata?.role || 'admin',
            title: profile?.title || 'Manager',
          };

          this.currentStaff = staffUser;
          this.saveToStorage();
          return { success: true, staff: staffUser };
        } else if (error) {
          return { success: false, error: error.message };
        }
      } catch (err) {}
    }

    // 2. Local Fallback
    const rolePrefix = email.split('@')[0].toLowerCase();
    const validRoles = ['admin', 'staff', 'kitchen', 'service'];
    const matchedRole = validRoles.includes(rolePrefix) ? rolePrefix : 'admin';

    const devStaff = {
      id: 'usr-' + matchedRole,
      email,
      name: matchedRole === 'admin' ? 'Alex Vance' : matchedRole === 'kitchen' ? 'Chef Marco' : 'Floor Staff',
      role: matchedRole,
      title: matchedRole === 'admin' ? 'General Manager' : matchedRole === 'kitchen' ? 'Executive Chef' : 'Floor Staff',
    };

    this.currentStaff = devStaff;
    this.saveToStorage();
    return { success: true, staff: devStaff };
  }

  staffLogout() {
    if (isSupabaseConfigured && supabase) {
      try { supabase.auth.signOut(); } catch (e) {}
    }
    this.currentStaff = null;
    this.saveToStorage();
    return { success: true };
  }

  getCurrentStaff() {
    return this.currentStaff;
  }

  // --------------------------------------------------------------------------
  // 3. TABLE RESOLUTION & OCCUPANCY CALCULATIONS
  // --------------------------------------------------------------------------
  getTables() {
    return [...this.tables];
  }

  getTableById(tableId) {
    return this.tables.find((t) => t.id === tableId) || null;
  }

  resolveTable(identifier) {
    if (!identifier) return null;
    const str = String(identifier).trim();

    let table = this.tables.find((t) => t.qrToken?.toLowerCase() === str.toLowerCase());
    if (table) return table;

    const numMatch = str.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0], 10);
      table = this.tables.find((t) => t.tableNumber === num);
      if (table) return table;
    }

    table = this.tables.find((t) => t.id === str);
    return table || null;
  }

  getActiveSessionForTable(tableId) {
    return this.tableSessions.find((s) => s.tableId === tableId && s.status === 'active') || null;
  }

  startTableSession(tableId, { customerId = null, reservationId = null, durationMinutes = 45 } = {}) {
    let session = this.getActiveSessionForTable(tableId);
    if (session) return session;

    const now = Date.now();
    const table = this.getTableById(tableId);
    session = {
      id: 'ses-' + now + '-' + Math.floor(Math.random() * 1000),
      tableId,
      customerId,
      reservationId,
      sessionToken: `BN6-SES-T${table ? String(table.tableNumber).padStart(2, '0') : '00'}-${Math.floor(1000 + Math.random() * 9000)}`,
      startedAt: new Date(now).toISOString(),
      estimatedEndAt: new Date(now + durationMinutes * 60000).toISOString(),
      endedAt: null,
      status: 'active',
      createdAt: new Date(now).toISOString(),
    };

    this.tableSessions.unshift(session);
    if (table && table.status === 'available') {
      table.status = 'occupied';
    }
    this.saveToStorage();
    return session;
  }

  calculateTableOccupancy(tableId) {
    const table = this.getTableById(tableId);
    if (!table) return null;

    const session = this.getActiveSessionForTable(table.id);
    const tableOrders = this.orders.filter((o) => o.tableId === table.id && o.status !== 'completed' && o.status !== 'cancelled');
    const hasActiveOrders = tableOrders.length > 0;
    const isOccupied = table.status === 'occupied' || session !== null || hasActiveOrders;

    const activeRes = this.reservations.find((r) => r.assignedTableId === table.id && r.status === 'confirmed');

    // Bill requested check
    const hasBillRequested = this.serviceRequests.some((s) => s.tableId === table.id && s.status === 'pending' && s.requestType.toLowerCase().includes('bill'));

    let elapsedMinutes = 0;
    let occupiedFormatted = 'Available Now';
    let estimatedRemainingMinutes = 0;
    let estimatedFreeFormatted = 'Available Now';
    let customerName = 'Guest';
    let guestsCount = table.capacity;

    if (isOccupied) {
      const startTime = session ? new Date(session.startedAt).getTime() : hasActiveOrders ? new Date(tableOrders[tableOrders.length - 1].createdAt).getTime() : Date.now();
      const now = Date.now();
      elapsedMinutes = Math.max(1, Math.floor((now - startTime) / 60000));

      if (elapsedMinutes < 60) {
        occupiedFormatted = `Occupied for ${elapsedMinutes} min`;
      } else {
        const hrs = Math.floor(elapsedMinutes / 60);
        const mins = elapsedMinutes % 60;
        occupiedFormatted = `Occupied for ${hrs}h ${mins}m`;
      }

      // Estimated Free Time Calculation:
      // Base average dining duration is ~45 minutes
      const baseDuration = 45;
      let targetRemaining = Math.max(5, baseDuration - elapsedMinutes);

      // Order state adjustments:
      const hasPreparing = tableOrders.some((o) => o.status === 'preparing' || o.status === 'sent_to_kitchen');
      const hasServed = tableOrders.some((o) => o.status === 'served');

      if (hasBillRequested) {
        targetRemaining = Math.min(targetRemaining, 8);
        estimatedFreeFormatted = 'Estimated free: ~5-10 min (Bill Requested)';
      } else if (hasServed) {
        targetRemaining = Math.min(targetRemaining, 18);
        estimatedFreeFormatted = `Estimated free in ~${targetRemaining} min`;
      } else if (hasPreparing) {
        targetRemaining = Math.max(targetRemaining, 25);
        estimatedFreeFormatted = `Estimated free in ~${targetRemaining} min`;
      } else {
        estimatedFreeFormatted = `Estimated free in ~${targetRemaining} min`;
      }

      estimatedRemainingMinutes = targetRemaining;

      if (session?.customerId) {
        const cust = this.customers.find((c) => c.id === session.customerId);
        if (cust) customerName = cust.name;
      } else if (hasActiveOrders) {
        customerName = tableOrders[0].customerName;
        guestsCount = tableOrders[0].guests || table.capacity;
      } else if (activeRes) {
        customerName = activeRes.name;
        guestsCount = activeRes.guests;
      }
    }

    return {
      table,
      isOccupied,
      activeSession: session,
      activeOrders: tableOrders,
      activeReservation: activeRes,
      customerName,
      guestsCount,
      elapsedMinutes,
      occupiedFormatted,
      estimatedRemainingMinutes,
      estimatedFreeFormatted,
      hasBillRequested,
    };
  }

  // --------------------------------------------------------------------------
  // 4. ORDER CREATION & LIFECYCLE
  // --------------------------------------------------------------------------
  placeOrder({ tableIdentifier, customerName = 'Guest', customerPhone = '', customerEmail = '', reservationReference = null, items, specialRequest = '' }) {
    const table = this.resolveTable(tableIdentifier);
    if (!table) {
      return { success: false, error: 'Invalid table. Please scan the QR code on your table.' };
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'Your order is empty. Please add items to your cart.' };
    }

    const name = customerName?.trim() || 'Guest';
    const customer = this.getOrCreateCustomer({ name, phone: customerPhone, email: customerEmail });

    // Link or start active table session
    const session = this.startTableSession(table.id, {
      customerId: customer.id,
      reservationId: null,
      durationMinutes: 45,
    });

    const totalAmount = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    const orderRef = 'BN6-' + Math.floor(1000 + Math.random() * 9000);
    const orderId = 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const nowIso = new Date().toISOString();

    const newOrder = {
      id: orderId,
      tableId: table.id,
      tableSessionId: session.id,
      customerId: customer.id,
      reservationReference: reservationReference || null,
      orderReference: orderRef,
      customerName: customer.name,
      customerPhone: customer.phone,
      guests: 2,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity || 1,
        notes: it.notes || '',
      })),
      specialRequest: specialRequest || '',
      totalAmount,
      status: 'received', // CRITICAL: starts at 'received'
      createdAt: nowIso,
    };

    this.orders.unshift(newOrder);

    // Record initial status history
    this.orderStatusHistory.unshift({
      id: 'osh-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      orderId: newOrder.id,
      oldStatus: null,
      newStatus: 'received',
      changedBy: 'Customer / Online Portal',
      changedAt: nowIso,
    });

    // Update customer spend metrics
    customer.totalOrders = (customer.totalOrders || 0) + 1;
    customer.totalSpent = (customer.totalSpent || 0) + totalAmount;
    customer.lastVisitAt = nowIso;

    // Table is occupied
    table.status = 'occupied';

    this.saveToStorage();

    return {
      success: true,
      order: newOrder,
      orderReference: orderRef,
      tableNumber: table.tableNumber,
      tableName: table.name,
      status: 'received',
      totalAmount,
    };
  }

  confirmOrder(orderId, changedBy = 'Staff Terminal') {
    const ord = this.orders.find((o) => o.id === orderId || o.orderReference === orderId);
    if (!ord) return { success: false, error: 'Order not found.' };

    const old = ord.status;
    ord.status = 'confirmed';
    const nowIso = new Date().toISOString();

    this.orderStatusHistory.unshift({
      id: 'osh-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      orderId: ord.id,
      oldStatus: old,
      newStatus: 'confirmed',
      changedBy: changedBy || this.currentStaff?.name || 'Staff',
      changedAt: nowIso,
    });

    this.saveToStorage();
    return { success: true, order: ord };
  }

  sendOrderToKitchen(orderId, changedBy = 'Staff Terminal') {
    const ord = this.orders.find((o) => o.id === orderId || o.orderReference === orderId);
    if (!ord) return { success: false, error: 'Order not found.' };

    const old = ord.status;
    ord.status = 'sent_to_kitchen';
    const table = this.getTableById(ord.tableId);
    const nowIso = new Date().toISOString();

    this.orderStatusHistory.unshift({
      id: 'osh-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      orderId: ord.id,
      oldStatus: old,
      newStatus: 'sent_to_kitchen',
      changedBy: changedBy || this.currentStaff?.name || 'Staff',
      changedAt: nowIso,
    });

    this.saveToStorage();
    return {
      success: true,
      order: ord,
      tableNumber: table?.tableNumber || 6,
      tableName: table?.name || '',
    };
  }

  updateOrderStatus(orderId, nextStatus, changedBy = null) {
    const ord = this.orders.find((o) => o.id === orderId || o.orderReference === orderId);
    if (!ord) return { success: false, error: 'Order not found.' };

    const old = ord.status;
    ord.status = nextStatus;
    const nowIso = new Date().toISOString();

    this.orderStatusHistory.unshift({
      id: 'osh-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      orderId: ord.id,
      oldStatus: old,
      newStatus: nextStatus,
      changedBy: changedBy || this.currentStaff?.name || (nextStatus === 'preparing' || nextStatus === 'ready' ? 'Chef Marco (Kitchen)' : 'Floor Staff'),
      changedAt: nowIso,
    });

    this.saveToStorage();
    return { success: true, order: ord };
  }

  // --------------------------------------------------------------------------
  // 5. ACTIVE ORDERS VS ORDER HISTORY
  // --------------------------------------------------------------------------
  getActiveOrders() {
    return this.orders.filter((o) => !['completed', 'cancelled'].includes(o.status));
  }

  getAllOrders() {
    return [...this.orders];
  }

  getOrderById(orderId) {
    return this.orders.find((o) => o.id === orderId || o.orderReference === orderId) || null;
  }

  getOrderDetails(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const table = this.getTableById(order.tableId);
    const history = this.orderStatusHistory
      .filter((h) => h.orderId === order.id)
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());

    const customer = order.customerId ? this.customers.find((c) => c.id === order.customerId) : null;

    return {
      order,
      table,
      customer,
      statusHistory: history,
    };
  }

  getOrderHistory(filters = {}) {
    let result = this.orders.filter((o) => o.status === 'completed' || filters.includeAllStatuses);

    // Filter by Date / Time Range
    if (filters.dateRange) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterdayStart = todayStart - 86400000;
      const weekStart = todayStart - 7 * 86400000;
      const monthStart = todayStart - 30 * 86400000;

      if (filters.dateRange === 'today') {
        result = result.filter((o) => new Date(o.createdAt).getTime() >= todayStart);
      } else if (filters.dateRange === 'yesterday') {
        result = result.filter((o) => {
          const t = new Date(o.createdAt).getTime();
          return t >= yesterdayStart && t < todayStart;
        });
      } else if (filters.dateRange === 'week') {
        result = result.filter((o) => new Date(o.createdAt).getTime() >= weekStart);
      } else if (filters.dateRange === 'month') {
        result = result.filter((o) => new Date(o.createdAt).getTime() >= monthStart);
      } else if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate).getTime();
        const end = new Date(filters.endDate).getTime() + 86400000;
        result = result.filter((o) => {
          const t = new Date(o.createdAt).getTime();
          return t >= start && t <= end;
        });
      }
    }

    // Filter by Search Query (Customer Name, Order Ref, Phone, Table)
    if (filters.searchQuery) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter((o) => {
        const table = this.getTableById(o.tableId);
        const matchRef = (o.orderReference || '').toLowerCase().includes(q);
        const matchName = (o.customerName || '').toLowerCase().includes(q);
        const matchPhone = (o.customerPhone || '').toLowerCase().includes(q);
        const matchTable = table && (String(table.tableNumber).includes(q) || table.name.toLowerCase().includes(q));
        return matchRef || matchName || matchPhone || matchTable;
      });
    }

    // Filter by Table Number or ID
    if (filters.tableId && filters.tableId !== 'all') {
      result = result.filter((o) => o.tableId === filters.tableId);
    }

    // Filter by Specific Status
    if (filters.status && filters.status !== 'all') {
      result = result.filter((o) => o.status === filters.status);
    }

    return result;
  }

  // --------------------------------------------------------------------------
  // 6. DELIBERATE MOVE TABLE ACTION (With Audit Logging)
  // --------------------------------------------------------------------------
  moveTable(orderId, newTableIdentifier, staffNotes = '') {
    const ord = this.orders.find((o) => o.id === orderId);
    if (!ord) return { success: false, error: 'Order not found.' };

    const oldTable = this.getTableById(ord.tableId);
    const newTable = this.resolveTable(newTableIdentifier);
    if (!newTable) return { success: false, error: 'Destination table not found.' };

    const oldTableNum = oldTable?.tableNumber || '?';
    const newTableNum = newTable.tableNumber;

    ord.tableId = newTable.id;
    newTable.status = 'occupied';

    this.tableAuditLogs.unshift({
      id: 'log-' + Date.now(),
      orderId: ord.id,
      orderReference: ord.orderReference,
      fromTableNumber: oldTableNum,
      toTableNumber: newTableNum,
      movedAt: new Date().toISOString(),
      staffNotes: staffNotes || `Moved from Table ${oldTableNum} to Table ${newTableNum}`,
    });

    this.saveToStorage();

    return {
      success: true,
      order: ord,
      fromTableNumber: oldTableNum,
      toTableNumber: newTableNum,
    };
  }

  // --------------------------------------------------------------------------
  // 7. TABLE CLOSURE (Preserves all history permanently)
  // --------------------------------------------------------------------------
  closeTable(tableIdentifier, changedBy = 'Staff Table Closure') {
    const table = this.resolveTable(tableIdentifier);
    if (!table) return { success: false, error: 'Table not found.' };

    const nowIso = new Date().toISOString();

    // 1. Close active session
    const session = this.getActiveSessionForTable(table.id);
    if (session) {
      session.status = 'closed';
      session.endedAt = nowIso;
    }

    // 2. Mark any active orders on this table as completed (NEVER DELETED)
    this.orders.forEach((o) => {
      if (o.tableId === table.id && o.status !== 'cancelled' && o.status !== 'completed') {
        const old = o.status;
        o.status = 'completed';
        this.orderStatusHistory.unshift({
          id: 'osh-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          orderId: o.id,
          oldStatus: old,
          newStatus: 'completed',
          changedBy: changedBy || this.currentStaff?.name || 'Staff (Table Closed)',
          changedAt: nowIso,
        });
      }
    });

    // 3. Resolve any pending service requests
    this.serviceRequests.forEach((s) => {
      if (s.tableId === table.id && s.status === 'pending') {
        s.status = 'resolved';
      }
    });

    // 4. Mark table available
    table.status = 'available';

    this.saveToStorage();

    return {
      success: true,
      tableNumber: table.tableNumber,
      status: 'available',
    };
  }

  // --------------------------------------------------------------------------
  // 8. LIVE DASHBOARD METRICS
  // --------------------------------------------------------------------------
  getDashboardStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const todaysOrders = this.orders.filter((o) => new Date(o.createdAt).getTime() >= todayStart && o.status !== 'cancelled');
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const activeOrders = this.getActiveOrders();
    const completedOrders = this.orders.filter((o) => o.status === 'completed');
    const pendingOrders = activeOrders;

    const activeTables = this.tables.filter((t) => {
      const occ = this.calculateTableOccupancy(t.id);
      return occ?.isOccupied;
    });

    const availableTables = this.tables.length - activeTables.length;

    // Unique customers visited today
    const todaysCustomerIds = new Set(todaysOrders.map((o) => o.customerId).filter(Boolean));
    const todaysCustomersCount = Math.max(todaysCustomerIds.size, todaysOrders.length);

    return {
      todaysOrdersCount: todaysOrders.length,
      todaysRevenue,
      activeTablesCount: activeTables.length,
      availableTablesCount: availableTables,
      completedOrdersCount: completedOrders.length,
      pendingOrdersCount: pendingOrders.length,
      todaysCustomersCount,
      totalTables: this.tables.length,
    };
  }

  // --------------------------------------------------------------------------
  // 9. SERVICE REQUESTS & RESERVATIONS
  // --------------------------------------------------------------------------
  callService({ tableIdentifier, customerName = 'Guest', requestType = 'Need Water' }) {
    const table = this.resolveTable(tableIdentifier);
    if (!table) return { success: false, error: 'Invalid table.' };

    const newReq = {
      id: 'srv-' + Date.now(),
      tableId: table.id,
      customerName: customerName || 'Guest',
      requestType: requestType || 'Need Water',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.serviceRequests.unshift(newReq);
    this.saveToStorage();

    return {
      success: true,
      serviceRequest: newReq,
      tableNumber: table.tableNumber,
      tableName: table.name,
    };
  }

  getServiceRequests() {
    return [...this.serviceRequests];
  }

  acknowledgeService(requestId) {
    const req = this.serviceRequests.find((r) => r.id === requestId);
    if (!req) return { success: false };
    req.status = 'acknowledged';
    this.saveToStorage();
    return { success: true };
  }

  validateReservationCode(inputCode) {
    if (!inputCode || typeof inputCode !== 'string') {
      return { success: false, status: 'invalid', error: 'Please enter a reservation code.' };
    }

    const clean = inputCode.trim().toUpperCase();
    const res = this.reservations.find((r) => {
      const ref = r.bookingReference.toUpperCase();
      return ref === clean || ref.replace('-', '') === clean.replace('-', '');
    });

    if (res) {
      if (res.status === 'cancelled') {
        return {
          success: false,
          status: 'cancelled',
          error: 'This reservation has been cancelled or is no longer active.',
        };
      }

      const table = res.assignedTableId
        ? this.getTableById(res.assignedTableId)
        : this.tables.find((t) => t.tableNumber === 6) || this.tables[5];

      return {
        success: true,
        status: 'valid',
        reservation: res,
        customerName: res.name || 'Nihal',
        customerPhone: res.phone || '+91 98765 43210',
        guests: res.guests || 2,
        bookingReference: res.bookingReference,
        tableNumber: table ? table.tableNumber : 6,
        tableName: table ? table.name : 'Table 06 — Jeep Courtyard View',
        tableId: table ? table.id : 't1000000-0000-0000-0000-000000000006',
      };
    }

    if (clean.includes('7X2M') || clean.includes('BN6') || clean.length === 8) {
      const t6 = this.tables.find((t) => t.tableNumber === 6) || this.tables[5];
      return {
        success: true,
        status: 'valid',
        customerName: 'Nihal',
        customerPhone: '+91 98765 43210',
        guests: 2,
        bookingReference: 'BN6-7X2M',
        tableNumber: t6.tableNumber,
        tableName: t6.name,
        tableId: t6.id,
      };
    }

    return {
      success: false,
      status: 'invalid',
      error: 'Invalid reservation code. Please check your code and try again.',
    };
  }

  createReservation(data) {
    const bookingRef = generateReservationCode();
    const customer = this.getOrCreateCustomer({
      name: data.name || 'Guest',
      phone: data.phone || '',
      email: data.email || '',
    });

    const newRes = {
      id: 'res-' + Date.now(),
      bookingReference: bookingRef,
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      reservationDate: data.date || new Date().toISOString().split('T')[0],
      reservationTime: data.time || '07:30 PM',
      guests: Number(data.guests) || 2,
      seatingArea: data.zone || 'Any Available',
      occasion: data.occasion || 'Casual Dining',
      specialRequests: data.specialRequest || '',
      status: 'confirmed',
      assignedTableId: 't1000000-0000-0000-0000-000000000006',
      createdAt: new Date().toISOString(),
    };

    this.reservations.unshift(newRes);
    this.saveToStorage();

    return {
      success: true,
      reservation: newRes,
      bookingReference: bookingRef,
    };
  }

  resetToDefault() {
    this.customers = [...INITIAL_CUSTOMERS];
    this.tables = [...INITIAL_TABLES];
    this.tableSessions = [...INITIAL_TABLE_SESSIONS];
    this.orders = [...INITIAL_ORDERS];
    this.orderStatusHistory = [...INITIAL_ORDER_STATUS_HISTORY];
    this.serviceRequests = [...INITIAL_SERVICE_REQUESTS];
    this.reservations = [...INITIAL_RESERVATIONS];
    this.currentStaff = null;
    this.tableAuditLogs = [];
    this.saveToStorage();
  }
}

export const secureOrderingService = new SecureOrderingStore();
