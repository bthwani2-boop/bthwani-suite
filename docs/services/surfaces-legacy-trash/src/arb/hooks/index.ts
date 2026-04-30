/**
 * ARB Hooks - Data layer for ARB service screens
 * 
 * هذه الطبقة تفصل الشاشات عن مصدر البيانات:
 * - الآن: تستخدم fixtures (بيانات تجريبية)
 * - لاحقاً: تستخدم api-clients (API حقيقي)
 */

// ============================================
// Hooks
// ============================================
export { useArbHome } from './useArbHome';
export type { UseArbHomeResult } from './useArbHome';

export { useArbOfferGet } from './useArbOfferGet';
export type { UseArbOfferGetResult } from './useArbOfferGet';

export { useArbOffersSearch } from './useArbOffersSearch';
export type { UseArbOffersSearchResult, UseArbOffersSearchOptions } from './useArbOffersSearch';

export { useArbBookingGet } from './useArbBookingGet';
export type { UseArbBookingGetResult } from './useArbBookingGet';

export { useArbBookingsList } from './useArbBookingsList';
export type { UseArbBookingsListResult } from './useArbBookingsList';

export { useArbAmendmentCreate } from './useArbAmendmentCreate';
export type { UseArbAmendmentCreateResult } from './useArbAmendmentCreate';

export { useArbAmendmentsList } from './useArbAmendmentsList';
export type { UseArbAmendmentsListResult } from './useArbAmendmentsList';

// ============================================
// Fixture Builders (re-exported for migration)
// ============================================
export {
  buildArbHomeMock,
  type ArbBanner,
  type ArbRecentBooking,
  type FeaturedOffer,
  type ArbHomeData,
} from '../fixtures/home';

export {
  buildArbOfferGetMock,
  type ArbOfferDetail,
} from '../fixtures/offerGet';

export {
  buildArbOffersSearchMock,
  type OfferHit,
} from '../fixtures/offersSearch';

export {
  buildArbBookingGetMock,
  type ArbBookingDetail,
} from '../fixtures/bookingGet';

export {
  buildArbBookingsListMock,
  type ArbBookingListItem,
} from '../fixtures/bookingsList';

export {
  buildArbAmendmentCreateMock,
  type ArbAmendmentCreateBooking,
} from '../fixtures/amendmentCreate';

export {
  buildArbAmendmentsListMock,
  type AmendmentItem,
} from '../fixtures/amendmentsList';
