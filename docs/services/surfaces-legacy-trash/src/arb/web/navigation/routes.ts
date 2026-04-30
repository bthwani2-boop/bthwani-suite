/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Web Routes Configuration
// SSoT for web navigation paths

export const ARB_WEB_ROUTES = {
  // Main ARB routes
  BOOKINGS: '/arb/bookings',
  BOOKING_DETAILS: '/arb/booking/:id',
  BOOKING_CREATE: '/arb/booking/create',

  // Offers routes
  OFFERS: '/arb/offers',
  OFFER_DETAILS: '/arb/offer/:id',

  // Admin routes
  ADMIN_CONFIG: '/arb/admin/config',
  ADMIN_KPIS: '/arb/admin/kpis',

  // Support routes
  SUPPORT_DISPUTES: '/arb/support/disputes',

  // Chat routes
  CHAT: '/arb/chat/:bookingId',

  // Partner routes
  PARTNER_DASHBOARD: '/arb/partner',
  PARTNER_BOOKINGS: '/arb/partner/bookings',
  PARTNER_OFFERS: '/arb/partner/offers',

} as const;

export type ArbWebRoute = typeof ARB_WEB_ROUTES[keyof typeof ARB_WEB_ROUTES];
