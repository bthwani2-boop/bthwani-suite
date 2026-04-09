/**
 * SND Hooks - Data layer for SND service screens
 *
 * هذه الطبقة تفصل الشاشات عن مصدر البيانات:
 * - Home: محتوى خدمة محلي ثابت بدون ادعاء runtime وهمي
 * - Requests: API حي بدون fallback صامت إلى fixtures
 *
 * الشاشات تستدعي hooks فقط، ولا تعرف مصدر البيانات.
 */

// ============================================
// Fixture Builders (re-exported for migration)
// أبقيت فقط أدوات fixtures المساعدة بعد إزالة wrappers غير المستخدمة
// ============================================
export {
  buildSndHomeMockServices,
  buildSndHomeMockInterests,
  type SndServiceFixture,
  type SndInterestFixture,
} from '../fixtures/home';

export {
  buildSndRequestsListMockRequests,
  type SndRequestFixture,
} from '../fixtures/requestsList';
