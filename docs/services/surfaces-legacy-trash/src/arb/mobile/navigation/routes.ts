/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Mobile Routes Configuration
// SSoT for mobile navigation screens

export const ARB_MOBILE_ROUTES = {
  // Main ARB screens
  BOOKINGS_LIST: 'ArbBookingsList',
  BOOKING_DETAILS: 'ArbBookingDetails',
  BOOKING_CREATE: 'ArbBookingCreate',
  BOOKING_STATUS: 'ArbBookingStatus',
  BOOKING_UPDATE: 'ArbBookingUpdate',
  BOOKING_RATE: 'ArbBookingRate',

  // Offers screens
  OFFERS_SEARCH: 'ArbOffersSearch',
  OFFERS_MANAGEMENT: 'ArbOffersManagement',
  PERSONAL_OFFERS: 'ArbPersonalOffers',
  ALL_OFFERS: 'ArbAllOffers',

  // Partner screens
  PARTNER_BOOKINGS: 'ArbPartnerBookings',
  PARTNER_OPERATIONS: 'ArbPartnerOperations',
  PARTNER_FINANCE_OVERVIEW: 'ArbPartnerFinanceOverview',

  // Chat and communication
  CHAT_MESSAGES: 'ArbChatMessages',
  CHAT_ESCALATION: 'ArbChatEscalation',

  // Escrow and payments
  ESCROW_STATUS: 'ArbEscrowStatus',
  ESCROW_MANAGEMENT: 'ArbEscrowManagement',
  PAYMENT_FORM: 'ArbPaymentForm',

  // Disputes and support
  DISPUTE_MANAGEMENT: 'ArbDisputeManagement',
  SUPPORT_DISPUTES: 'ArbSupportDisputes',

  // Admin screens
  ADMIN_CONFIG: 'ArbAdminConfig',
  ADMIN_KPIS: 'ArbAdminKpis',

  // Amendments
  AMENDMENT_CREATE: 'ArbAmendmentCreate',
  AMENDMENTS_LIST: 'ArbAmendmentsList',
  AMENDMENT_MANAGEMENT: 'ArbAmendmentManagement',

  // Vouchers
  VOUCHERS_LIST: 'ArbVouchersList',

  // Dashboard
  DASHBOARD: 'ArbDashboard',

} as const;

export type ArbMobileRoute = typeof ARB_MOBILE_ROUTES[keyof typeof ARB_MOBILE_ROUTES];
