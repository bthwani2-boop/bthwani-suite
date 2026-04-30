/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Web Surface Components ONLY
// Next.js implementation for webapp, CONTROL PANEL
// §34 Universal Surface - Web Shell Implementation
// This entrypoint prevents mobile screens from being bundled in web

// Export web ONLY
export * from './web';

// Export shared (platform-agnostic)
export * from './shared';

// Core ARB Components - Platform Agnostic
export { default as ArbBookingsList } from './shared/ArbBookingsList';
export { default as ArbBookingDetails } from './shared/ArbBookingDetails';
export { default as ArbBookingForm } from './shared/ArbBookingForm';
export { default as ArbOffersList } from './shared/ArbOffersList';
export { default as ArbOfferDetails } from './shared/ArbOfferDetails';
export { default as ArbChatInterface } from './shared/ArbChatInterface';
export { default as ArbEscrowStatus } from './shared/ArbEscrowStatus';
export { default as ArbPaymentForm } from './shared/ArbPaymentForm';

// UI State Components - Full States Implementation
export { default as ArbLoadingState } from './shared/ui-states/ArbLoadingState';
export { default as ArbEmptyState } from './shared/ui-states/ArbEmptyState';
export { default as ArbErrorState } from './shared/ui-states/ArbErrorState';
export { default as ArbSuccessState } from './shared/ui-states/ArbSuccessState';
export { default as ArbOfflineState } from './shared/ui-states/ArbOfflineState';

// Hooks and Utilities
export { useArbBookings } from './shared/hooks/useArbBookings';
export { useArbOffers } from './shared/hooks/useArbOffers';
export { useArbChat } from './shared/hooks/useArbChat';
export { useArbEscrow } from './shared/hooks/useArbEscrow';

// Types and Contracts
export type {
  ArbBooking,
  ArbOffer,
  ArbChatMessage,
  ArbEscrowStatusData,
  ArbBookingFilters,
  ArbOfferFilters,
} from './shared/types/arb.types';

// Constants and Config
export { ARB_SURFACE_ROUTES } from './shared/constants/routes';
export { ARB_UI_CONFIG } from './shared/constants/ui-config';

