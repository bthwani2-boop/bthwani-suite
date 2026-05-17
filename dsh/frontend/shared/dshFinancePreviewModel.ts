/**
 * LEGACY_BRIDGE — PREVIEW_ONLY
 *
 * هذا الملف جسر توافق قراءة فقط مع WLT المالك الأصلي.
 * DSH لا يملك أي منطق مالي — WLT يملك كل معنى مالي.
 *
 * لا تُنفَّذ هنا أي عمليات مالية حقيقية (لا dger، لا settlement، لا payment mutation).
 * العملة: YER / ر.ي — تمّت إزالة SAR / ر.س بالكامل.
 *
 * للاستخدام الجديد: استورد مباشرة من:
 *   wlt/frontend/shared/finance/dshFinancePreview
 */

export type {
  WltDshFinanceActor as DshFinanceActor,
  WltDshFinanceEventKind as DshFinanceEventKind,
  WltDshFinancePreviewRecord as DshFinancePreviewRecord,
} from '../../../wlt/frontend/shared/finance/dshFinancePreview';

export {
  getWltDshFinanceRecordsForActor as getDshFinanceRecordsForActor,
  getWltDshFinanceSummaryForActor as getDshFinanceSummaryForActor,
  getWltPartnerSettlementPreview as getDshPartnerSettlementPreview,
  getWltCaptainFinancePreview as getDshCaptainFinancePreview,
  getWltFieldFinancePreview as getDshFieldFinancePreview,
  resolveWltDshFinanceEventKindForPaymentMethod as resolveDshFinanceEventKindForPayment,
} from '../../../wlt/frontend/shared/finance/dshFinancePreview';
