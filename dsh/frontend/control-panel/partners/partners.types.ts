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
  { id: 'documents', label: 'وثائق الشركاء' },
  { id: 'readiness_escalations', label: 'تصعيد الجاهزية' },
  { id: 'readiness_approvals', label: 'اعتماد الجاهزية' },
  { id: 'overrides', label: 'تجاوزات الكتالوج' },
  { id: 'performance', label: 'الأداء والامتثال' },
  { id: 'eligibility', label: 'أهلية الترويج' },
  { id: 'topology', label: 'مسارات الخدمة' },
  { id: 'contracts', label: 'إدارة العقود والامتثال' },
  { id: 'deactivation', label: 'إلغاء التفعيل' },
];

export const PARTNER_SUB_TAB_DEFINITIONS: Partial<Record<PartnerWorkspaceTabId, readonly PartnerSubTabItem[]>> = {
  inbox: [
    { id: 'registration', label: 'طلبات التسجيل' },
    { id: 'modifications', label: 'تعديل البيانات' },
    { id: 'complaints', label: 'شكاوى الشركاء' },
  ],
  performance: [
    { id: 'performance', label: 'الأداء والسعة' },
    { id: 'disputes', label: 'النزاعات والاستئناف' },
    { id: 'visibility', label: 'الظهور والإيقاف' },
  ],
  eligibility: [
    { id: 'benefits', label: 'المزايا والعروض' },
  ],
};
