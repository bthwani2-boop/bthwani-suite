/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Mobile Shared - Shim for ../shared imports
// This file allows screens in packages/surfaces/src/arb/mobile/screens/* to import from '../shared'
// It re-exports from the actual shared location: packages/surfaces/src/arb/shared

export * from '../../shared';
export type {
  ArbBooking,
  ArbOffer,
  ArbChatMessage,
  ArbEscrowStatusData,
  ArbBookingFilters,
  ArbOfferFilters,
} from '../../shared/types/arb.types';
export { ARB_UI_CONFIG } from '../../shared/constants/ui-config';

// Explicitly export ArbBookingsList to ensure it's available
export { default as ArbBookingsList } from '../../shared/ArbBookingsList';
