// Canonical location: dsh/frontend/shared/support/support.types.ts
// Authority: dsh/frontend/shared/support — support workspace types and metadata.

export type SupportTab =
  | 'queue'
  | 'customer-360'
  | 'call-intake'
  | 'escalation'
  | 'sla-risk'
  | 'messaging';

export type SupportTabItem = {
  id: SupportTab;
  label: string;
};

export type SupportSubTabItem = {
  id: string;
  label: string;
};

export type SupportVerificationStatus = 'verified' | 'required' | 'blocked' | string;
export type SupportTone = 'success' | 'warning' | 'danger' | 'neutral';

export const SUPPORT_VERIFICATION_STATUS_META: Record<string, { label: string; tone: SupportTone }> = {
  verified: { label: 'مكتمل', tone: 'success' },
  required: { label: 'مطلوب', tone: 'warning' },
  blocked: { label: 'محظور', tone: 'danger' },
};

export const SUPPORT_TICKET_STATUS_META: Record<string, { tone: SupportTone }> = {
  open: { tone: 'warning' },
  resolved: { tone: 'success' },
  escalated: { tone: 'danger' },
};

export const SUPPORT_PRIMARY_TABS: readonly SupportTabItem[] = [
  { id: 'queue', label: 'طابور الدعم والنزاعات' },
  { id: 'customer-360', label: 'ملف العميل الشامل' },
  { id: 'call-intake', label: 'استقبال المكالمات' },
  { id: 'escalation', label: 'التصاعد' },
  { id: 'sla-risk', label: 'خطر الالتزام' },
  { id: 'messaging', label: 'الرسائل' },
];

export const SUPPORT_TAB_WORKSPACE_MAP: Readonly<Record<SupportTab, string>> = {
  queue: 'queue',
  'customer-360': 'customer-360',
  'call-intake': 'call-intake',
  escalation: 'escalation',
  'sla-risk': 'sla-risk',
  messaging: 'messaging',
};

export const SUPPORT_SECONDARY_TABS: Readonly<Record<SupportTab, readonly SupportSubTabItem[]>> = {
  queue: [
    { id: 'الكل', label: 'الكل' },
    { id: 'الطلبات', label: 'الطلبات' },
    { id: 'الشكاوى', label: 'الشكاوى' },
    { id: 'الفقدان', label: 'الفقدان' },
    { id: 'المبالغ', label: 'المبالغ' },
    { id: 'النزاعات والاستفسارات', label: 'النزاعات والاستفسارات' },
    { id: 'الإبلاغ والتبليغات', label: 'الإبلاغ والتبليغات' },
  ],
  'customer-360': [{ id: 'overview', label: 'نظرة عامة' }],
  'call-intake': [{ id: 'manual', label: 'المكالمات اليدوية' }],
  escalation: [{ id: 'الكل', label: 'الكل' }],
  'sla-risk': [{ id: 'الكل', label: 'الكل' }],
  messaging: [
    { id: 'client', label: 'العملاء' },
    { id: 'partner', label: 'الشركاء' },
    { id: 'captain', label: 'الكباتن' },
  ],
};
