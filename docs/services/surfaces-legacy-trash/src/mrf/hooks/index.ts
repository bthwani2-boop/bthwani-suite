/**
 * MRF Hooks - Data layer for MRF service screens
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
export { useMrfMatchGet } from './useMrfMatchGet';
export type { UseMrfMatchGetResult } from './useMrfMatchGet';

export { useMrfReportGet } from './useMrfReportGet';
export type { UseMrfReportGetResult } from './useMrfReportGet';

// ============================================
// Fixture Builders (re-exported for migration)
// عند الانتقال للـ API الحقيقي، هذه الدوال ستُزال
// والشاشات ستستخدم الـ hooks فقط
// ============================================
export {
  buildMrfMatchGetMock,
  type MrfMatchDetail,
} from '../fixtures/matchGet';

export {
  buildMrfReportGetMock,
  type MrfReportDetail,
} from '../fixtures/reportGet';
