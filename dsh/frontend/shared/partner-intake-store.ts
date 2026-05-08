import { ApprovalRecord } from './workflow';

export const partnerIntakeRecords: ApprovalRecord[] = [
  {
    id: 'intake-1',
    entityType: 'product',
    source: 'app-partner',
    stage: 'partner-submitted',
    title: 'منتج جديد من الشريك غير موجود في الكتالوج',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'intake-2',
    entityType: 'category-suggestion',
    source: 'app-partner',
    stage: 'partner-review',
    title: 'اقتراح فئة من الشريك',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'intake-3',
    entityType: 'store',
    source: 'app-field',
    stage: 'field-submitted',
    title: 'منتج/متجر من الميداني',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'intake-4',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'needs-fix',
    title: 'صورة المنتج غير واضحة',
    submittedAt: new Date().toISOString(),
    metadata: {
      requiredFix: 'يرجى إعادة تصوير المنتج بإضاءة أفضل وخلفية بيضاء.',
    },
  },
  {
    id: 'intake-5',
    entityType: 'partner-offer',
    source: 'app-partner',
    stage: 'rejected',
    title: 'عرض خصم 90%',
    submittedAt: new Date().toISOString(),
    metadata: {
      rejectionReason: 'نسبة الخصم عالية جداً وتؤثر على هامش الربح المتفق عليه.',
    },
  },
  {
    id: 'intake-6',
    entityType: 'product',
    source: 'app-partner',
    stage: 'marketing-approved',
    title: 'وجبة غداء عمل',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'intake-7',
    entityType: 'product',
    source: 'app-partner',
    stage: 'client-visible',
    title: 'ساندوتش دجاج مشوي',
    submittedAt: new Date().toISOString(),
  }
];

export function getPartnerIntakeItems(): ApprovalRecord[] {
  return partnerIntakeRecords;
}
