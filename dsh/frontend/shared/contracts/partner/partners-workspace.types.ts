// Canonical location: dsh/frontend/shared/contracts/partner/partners-workspace.types.ts
// Authority: dsh/frontend/shared — moved from control-panel/partners/partners.types.ts

export type PartnerWorkspaceTabId =
  | 'inbox'
  | 'activation'
  | 'documents'
  | 'readiness_escalations'
  | 'readiness_approvals'
  | 'overrides'
  | 'performance'
  | 'eligibility'
  | 'topology'
  | 'contracts'
  | 'deactivation';

export type PartnerSubTabItem = {
  id: string;
  label: string;
};

export type PartnerWorkspaceTabItem = {
  id: PartnerWorkspaceTabId;
  label: string;
};

export const PARTNER_PRIMARY_TABS: readonly PartnerWorkspaceTabItem[] = [
  { id: 'inbox', label: 'الوارد الجديد' },
  { id: 'activation', label: 'تفعيل الشريك' },
  { id: 'documents', label: 'وثائق الشراكة' },
  { id: 'readiness_escalations', label: 'تصاعد الجاهزية' },
  { id: 'readiness_approvals', label: 'اعتمادات الجاهزية' },
  { id: 'overrides', label: 'تجاوزات الكاتالوج' },
  { id: 'performance', label: 'الأداء والإحصاءات' },
  { id: 'eligibility', label: 'أهلية الترويج' },
  { id: 'topology', label: 'مستويات الخدمة' },
  { id: 'contracts', label: 'إدارة العقود والإحصاءات' },
  { id: 'deactivation', label: 'إلغاء التفعيل' },
];

export const PARTNER_SUB_TAB_DEFINITIONS: Partial<Record<PartnerWorkspaceTabId, readonly PartnerSubTabItem[]>> = {
  inbox: [
    { id: 'registration', label: 'طلبات التسجيل' },
    { id: 'modifications', label: 'تعديل البيانات' },
    { id: 'complaints', label: 'شكاوى الشراكة' },
  ],
  performance: [
    { id: 'performance', label: 'الأداء والسرعة' },
    { id: 'disputes', label: 'النزاعات والاستفسار' },
    { id: 'visibility', label: 'الظهور والتمييز' },
  ],
  eligibility: [
    { id: 'benefits', label: 'المزايا والعروض' },
  ],
};
