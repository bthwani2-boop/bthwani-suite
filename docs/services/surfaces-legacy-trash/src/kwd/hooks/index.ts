/**
 * KWD Hooks - Data layer for KWD service screens
 * 
 * هذه الطبقة تفصل الشاشات عن مصدر البيانات:
 * - الآن: تستخدم fixtures (بيانات تجريبية)
 * - لاحقاً: تستخدم api-clients (API حقيقي)
 * 
 * الشاشات تستدعي hooks فقط، ولا تعرف مصدر البيانات.
 */

// ============================================
// Hooks
// ============================================
export { useKwdHome } from './useKwdHome';
export type { UseKwdHomeResult, UseKwdHomeOptions } from './useKwdHome';

export { useKwdMyListings } from './useKwdMyListings';
export type { UseKwdMyListingsResult } from './useKwdMyListings';

// ============================================
// Fixture Builders (re-exported for migration)
// عند الانتقال للـ API الحقيقي، هذه الدوال ستُزال
// والشاشات ستستخدم الـ hooks فقط
// ============================================
export {
  buildKwdHomeMockJobs,
  type KwdJobFixture,
} from '../fixtures/home';

export {
  buildKwdMyListingsMockJobs,
  buildKwdMyListingsMockApplications,
  type KwdMyListingsJobItem,
  type KwdMyListingsApplicationItem,
} from '../fixtures/myListings';
