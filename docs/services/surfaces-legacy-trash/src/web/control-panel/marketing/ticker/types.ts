export type DshTickerAdminKind = 'platform' | 'order' | 'promo';
export type DshTickerAdminSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface DshTickerAdmin {
  id: string;
  /** نص الرسالة كما ستظهر في تطبيق DSH (الترجمة النهائية تأتي من i18n لاحقاً) */
  message: string;
  kind: DshTickerAdminKind;
  severity: DshTickerAdminSeverity;
  /** حالة النشر في التطبيق */
  status: 'draft' | 'published';
  /** بداية عرض الرسالة (UTC ISO string) */
  starts_at?: string;
  /** نهاية عرض الرسالة (UTC ISO string) */
  ends_at?: string;
}

