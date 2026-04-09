/**
 * AMN Hooks - Data layer for AMN service screens
 * 
 * هذه الطبقة تفصل الشاشات عن مصدر البيانات:
 * - الآن: تستخدم fixtures (بيانات تجريبية)
 * - لاحقاً: تستخدم api-clients (API حقيقي)
 */

// ============================================
// Hooks
// ============================================
export { useAmnHome } from './useAmnHome';
export type { UseAmnHomeResult } from './useAmnHome';

export { useAmnTripGet } from './useAmnTripGet';
export type { UseAmnTripGetResult } from './useAmnTripGet';

export { useAmnTripsList } from './useAmnTripsList';
export type { UseAmnTripsListResult, UseAmnTripsListOptions } from './useAmnTripsList';

export { useAmnTripRate } from './useAmnTripRate';
export type { UseAmnTripRateResult, AmnTripRateData } from './useAmnTripRate';

// ============================================
// Fixture Builders (re-exported for migration)
// ============================================
export {
  buildAmnHomeMock,
  type AmnBanner,
  type AmnQuickAction,
  type AmnRecentTrip,
  type AmnHomeData,
  type AmnHomeRoles,
} from '../fixtures/home';

export {
  buildAmnTripGetMock,
  type AmnTripDetail,
} from '../fixtures/tripGet';

export {
  buildAmnTripsListMock,
  type AmnTripListItem,
} from '../fixtures/tripsList';

export { buildAmnTripRateMock } from '../fixtures/tripRate';
