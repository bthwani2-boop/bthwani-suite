export type DshPartnerIntakeSource = 'app-field' | 'app-partner';
export type DshPartnerIntakeStage = 'pending-partner' | 'pending-marketing' | 'published';

export type DshPartnerIntakeItem = {
  id: string;
  productName: string;
  categoryLabel: string;
  source: DshPartnerIntakeSource;
  stage: DshPartnerIntakeStage;
  ownerLabel: string;
  note: string;
  submittedAt: string;
};

export type DshPartnerIntakeMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

export const dshPartnerIntakeMetrics: ReadonlyArray<DshPartnerIntakeMetric> = [
  {
    id: 'metric-partner-pending',
    label: 'المراجعة الأولية',
    value: 4,
    description: 'عناصر وصلت من الميداني أو الشريك وتنتظر الموافقة الأولى.',
  },
  {
    id: 'metric-marketing-pending',
    label: 'المراجعة التسويقية',
    value: 2,
    description: 'بطاقات مرّت على الشركاء وتنتظر الموافقة التسويقية.',
  },
  {
    id: 'metric-live-catalog',
    label: 'الكتالوج المباشر',
    value: 28,
    description: 'كل ما نُشر بالفعل وأصبح ظاهرًا لكل الشركاء.',
  },
];

export const dshPartnerIntakeItems: ReadonlyArray<DshPartnerIntakeItem> = [
  {
    id: 'product-olive-oil',
    productName: 'زيت زيتون بكر ممتاز',
    categoryLabel: 'المقاضي',
    source: 'app-field',
    stage: 'pending-partner',
    ownerLabel: 'الميداني',
    note: 'أضيف من الحقل ويحتاج فقط للمراجعة الأولى قبل التحويل.',
    submittedAt: 'اليوم 09:40',
  },
  {
    id: 'product-coffee-beans',
    productName: 'حبوب قهوة مختصة',
    categoryLabel: 'المقاهي',
    source: 'app-partner',
    stage: 'pending-partner',
    ownerLabel: 'الشريك',
    note: 'منتج جديد أرسله الشريك مباشرة على بوابة الإضافة.',
    submittedAt: 'اليوم 10:05',
  },
  {
    id: 'product-cookie-box',
    productName: 'صندوق كوكيز موسمية',
    categoryLabel: 'المطاعم',
    source: 'app-partner',
    stage: 'pending-marketing',
    ownerLabel: 'الشريك',
    note: 'اجتاز المراجعة الأولية ويحتاج ضبطًا تسويقيًا قبل النشر.',
    submittedAt: 'اليوم 11:15',
  },
  {
    id: 'product-published-meal',
    productName: 'وجبة جاهزة عائلية',
    categoryLabel: 'المطاعم',
    source: 'app-field',
    stage: 'published',
    ownerLabel: 'الكتالوج',
    note: 'منتج منشور بالكامل ويظهر الآن لكل الشركاء.',
    submittedAt: 'أمس 07:55',
  },
];

export const dshPartnerApprovalLanes = [
  {
    id: 'lane-field',
    title: 'الوارد من الميداني',
    description: 'الطلب يدخل من الحقل ثم يمر على بوابة الشركاء أولًا.',
  },
  {
    id: 'lane-partner',
    title: 'مراجعة الشركاء',
    description: 'القبول أو الرفض الأولي يبقى واضحًا داخل نفس لوحة العمل.',
  },
  {
    id: 'lane-marketing',
    title: 'مراجعة التسويق',
    description: 'بعد القبول الأولي تنتقل البطاقة لتثبيت العرض التسويقي.',
  },
  {
    id: 'lane-catalog',
    title: 'نشر الكتالوج',
    description: 'بعد الاعتماد النهائي تصبح البطاقة عامة لكل الشركاء.',
  },
] as const;

export type DshPromotionIntentStatus = 'draft' | 'partner-review' | 'marketing-ready' | 'marketing-rejected';

export type DshPromotionCandidate = {
  id: string;
  kind: 'product' | 'store';
  title: string;
  subtitle: string;
  availability: string;
  eligibility: 'eligible' | 'review' | 'blocked';
  status: DshPromotionIntentStatus;
  offerHint: string;
};

export const dshPromotionCandidates: ReadonlyArray<DshPromotionCandidate> = [
  {
    id: 'product-burger',
    kind: 'product',
    title: 'برغر كلاسيك',
    subtitle: 'منتج عالي الطلب مناسب لعروض الرفع السريع.',
    availability: 'متاح وبمخزون جيد',
    eligibility: 'eligible',
    status: 'draft',
    offerHint: 'اقترح خصمًا قصيرًا أو باقة مزدوجة.',
  },
  {
    id: 'store-yasmin',
    kind: 'store',
    title: 'متجر الياسمين',
    subtitle: 'فرع جاهز للظهور الترويجي مع نشاط ثابت.',
    availability: 'جاهز للظهور',
    eligibility: 'review',
    status: 'partner-review',
    offerHint: 'اربط العرض بوقت الذروة أو حزمة توصيل.',
  },
  {
    id: 'product-dessert',
    kind: 'product',
    title: 'حلويات موسمية',
    subtitle: 'منتج يطلب مراجعة قبل الترويج الواسع.',
    availability: 'بحاجة لمراجعة',
    eligibility: 'blocked',
    status: 'marketing-rejected',
    offerHint: 'أعد ضبط التوفر أو أضف سبب الرفض.',
  },
  {
    id: 'store-olaya',
    kind: 'store',
    title: 'فرع العليا',
    subtitle: 'أداء ممتاز ويستحق الإبراز في الرئيسية.',
    availability: 'جاهز تماماً',
    eligibility: 'eligible',
    status: 'marketing-ready',
    offerHint: 'توصيل مجاني أو خصم 20%.',
  }
];

// --- DSH Approval Pipeline SSOT v1 ---

export type ApprovalStage =
  | 'partner-submitted'
  | 'field-submitted'
  | 'partner-review'
  | 'partner-approved'
  | 'marketing-review'
  | 'marketing-approved'
  | 'catalog-adopted'
  | 'client-visible'
  | 'rejected'
  | 'needs-fix';

export type ApprovalEntityType =
  | 'product'
  | 'product-media'
  | 'category-suggestion'
  | 'store'
  | 'partner-offer'
  | 'video'
  | 'banner'
  | 'promo';

export type ApprovalSourceSurface =
  | 'app-partner'
  | 'app-field'
  | 'control-panel-partners'
  | 'control-panel-marketing'
  | 'control-panel-catalog'
  | 'app-client';

export type ApprovalRecord = {
  id: string;
  entityType: ApprovalEntityType;
  source: ApprovalSourceSurface;
  stage: ApprovalStage;
  title: string;
  submittedAt: string;
  metadata?: any;
};

export function transitionApprovalStage(current: ApprovalStage, action: 'approve' | 'reject' | 'fix'): ApprovalStage {
  if (action === 'reject') return 'rejected';
  if (action === 'fix') return 'needs-fix';

  switch (current) {
    case 'partner-submitted':
    case 'field-submitted':
      return 'partner-review';
    case 'partner-review':
      return 'partner-approved';
    case 'partner-approved':
      return 'marketing-review';
    case 'marketing-review':
      return 'marketing-approved';
    case 'marketing-approved':
      return 'catalog-adopted';
    case 'catalog-adopted':
      return 'client-visible';
    default:
      return current;
  }
}

export function resolveNextOwner(stage: ApprovalStage): ApprovalSourceSurface {
  switch (stage) {
    case 'partner-submitted':
    case 'field-submitted':
    case 'partner-review':
      return 'control-panel-partners';
    case 'partner-approved':
    case 'marketing-review':
      return 'control-panel-marketing';
    case 'marketing-approved':
    case 'catalog-adopted':
      return 'control-panel-catalog';
    case 'client-visible':
      return 'app-client';
    case 'rejected':
    case 'needs-fix':
      return 'app-partner';
    default:
      return 'control-panel-partners';
  }
}

export function isClientVisible(stage: ApprovalStage): boolean {
  return stage === 'client-visible';
}

export function isCatalogOwnedMedia(stage: ApprovalStage): boolean {
  return stage === 'catalog-adopted' || stage === 'client-visible';
}

export function isPartnerOwnedException(stage: ApprovalStage, entityType: ApprovalEntityType): boolean {
  return entityType === 'product-media' && (stage === 'marketing-approved' || stage === 'partner-approved');
}
