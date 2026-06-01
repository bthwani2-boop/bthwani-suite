export type SupportTab =
  | 'queue'
  | 'customer-360'
  | 'call-intake'
  | 'disputes'
  | 'feedback'
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

export const SUPPORT_PRIMARY_TABS: readonly SupportTabItem[] = [
  { id: 'queue', label: 'صفوف الدعم' },
  { id: 'customer-360', label: 'ملف العميل المتكامل' },
  { id: 'call-intake', label: 'استقبال المكالمات' },
  { id: 'disputes', label: 'النزاعات' },
  { id: 'feedback', label: 'الآراء' },
  { id: 'escalation', label: 'التصعيد' },
  { id: 'sla-risk', label: 'خطر الالتزام' },
  { id: 'messaging', label: 'الرسائل' },
];

export const SUPPORT_TAB_WORKSPACE_MAP: Readonly<Record<SupportTab, string>> = {
  queue: 'queue',
  'customer-360': 'customer-360',
  'call-intake': 'call-intake',
  disputes: 'disputes',
  feedback: 'feedback',
  escalation: 'escalation',
  'sla-risk': 'sla-risk',
  messaging: 'messaging',
};

export const SUPPORT_SECONDARY_TABS: Readonly<Record<SupportTab, readonly SupportSubTabItem[]>> = {
  queue: [
    { id: 'الكل', label: 'الكل' },
    { id: 'الطلبات', label: 'الطلبات' },
    { id: 'الشركاء', label: 'الشركاء' },
    { id: 'الكباتن', label: 'الكباتن' },
    { id: 'الميدان', label: 'الميدان' },
  ],
  'customer-360': [{ id: 'overview', label: 'نظرة عامة' }],
  'call-intake': [{ id: 'manual', label: 'المكالمات اليدوية' }],
  disputes: [{ id: 'الكل', label: 'الكل' }],
  feedback: [{ id: 'الكل', label: 'الكل' }],
  escalation: [{ id: 'الكل', label: 'الكل' }],
  'sla-risk': [{ id: 'الكل', label: 'الكل' }],
  messaging: [
    { id: 'client', label: 'العملاء' },
    { id: 'partner', label: 'الشركاء' },
    { id: 'captain', label: 'الكباتن' },
  ],
};
