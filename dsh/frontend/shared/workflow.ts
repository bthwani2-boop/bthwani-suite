import type { DshPartnerActivationStatus } from './dsh-partner-activation.model';

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

// =====================================================================
// DSH Approval Pipeline SSOT v2 — Shared In-Memory Workflow Store
// =====================================================================

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

/** Entity types routed to the marketing signal layer (media governance signals). */
export const MARKETING_SIGNAL_ENTITY_TYPES: ReadonlyArray<ApprovalEntityType> = [
  'product', 'product-media', 'category-suggestion', 'store',
];

/** Approval stages that produce active marketing governance signals. */
export const MARKETING_SIGNAL_STAGES: ReadonlyArray<ApprovalStage> = [
  'marketing-review', 'marketing-approved', 'needs-fix', 'catalog-adopted', 'rejected',
];

export type ApprovalSourceSurface =
  | 'app-partner'
  | 'app-field'
  | 'control-panel-partners'
  | 'control-panel-marketing'
  | 'control-panel-catalog'
  | 'app-client';

// ── Audit Trail ──────────────────────────────────────────────────────

export type AuditTrailEntry = {
  at: string;
  fromStage: ApprovalStage;
  toStage: ApprovalStage;
  owner: ApprovalSourceSurface;
  actionLabel: string;
};

export type ApprovalRecordMetadata = {
  requiredFix?: string;
  rejectionReason?: string;
  mediaPolicy?: string;
  mediaKey?: string;
  nextOwner?: string;
  systemNote?: string;
};

// ── ApprovalRecord ───────────────────────────────────────────────────

export type ApprovalRecord = {
  id: string;
  entityType: ApprovalEntityType;
  source: ApprovalSourceSurface;
  stage: ApprovalStage;
  title: string;
  submittedAt: string;
  metadata?: ApprovalRecordMetadata;
  auditTrail?: AuditTrailEntry[];
};

// ── Stage Transitions ────────────────────────────────────────────────

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

export function translateStage(stage: ApprovalStage | string | undefined): string {
  if (!stage) return 'غير محدد';
  switch (stage) {
    case 'partner-submitted':
    case 'field-submitted': return 'تم التقديم';
    case 'partner-review': return 'مراجعة الشركاء';
    case 'partner-approved': return 'معتمد شريكاً';
    case 'marketing-review': return 'مراجعة التسويق';
    case 'marketing-approved': return 'معتمد تسويقياً';
    case 'catalog-adopted': return 'معتمد في الكتالوج';
    case 'client-visible': return 'نشط للعميل';
    case 'needs-fix': return 'يتطلب تعديل';
    case 'rejected': return 'مرفوض';
    case 'published':
    case 'published-preview': return 'منشور (سابق)';
    default: return stage;
  }
}

export function translateEntityType(type: ApprovalEntityType | string | undefined): string {
  if (!type) return 'غير معروف';
  switch (type) {
    case 'product': return 'منتج';
    case 'product-media': return 'صورة منتج';
    case 'category-suggestion': return 'اقتراح فئة';
    case 'store': return 'بيانات متجر';
    case 'partner-offer': return 'عرض شريك';
    case 'video': return 'فيديو';
    case 'banner': return 'إعلان';
    case 'promo': return 'برومو';
    default: return type;
  }
}

export function translateOwner(owner: ApprovalSourceSurface | string | undefined): string {
  if (!owner) return 'غير معروف';
  switch (owner) {
    case 'app-partner': return 'تطبيق الشريك';
    case 'app-field': return 'تطبيق الميداني';
    case 'control-panel-partners': return 'بوابة الشركاء';
    case 'control-panel-marketing': return 'بوابة التسويق';
    case 'control-panel-catalog': return 'بوابة الكتالوج';
    case 'app-client': return 'تطبيق العميل';
    default: return owner;
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

export type ClientVisibilityOptions = {
  mediaPolicy?: string;
};

export function isClientVisibleStage(stage: string | undefined): boolean {
  return stage === 'client-visible';
}

export function isLegacyPublishedPreview(stage: string | undefined): boolean {
  return stage === 'published-preview' || stage === 'published';
}

export function canRenderInClientSurface(
  stage: string | undefined,
  entityType?: ApprovalEntityType,
  options?: ClientVisibilityOptions
): boolean {
  // Strict hardening Phase R3: elements coming from the canonical/approval pipeline MUST have a valid stage.
  if (!stage) return false;

  // client-visible is the gold standard for production.
  if (isClientVisibleStage(stage)) return true;

  // published-preview / published are legacy bridges for pre-hardened data.
  if (isLegacyPublishedPreview(stage)) return true;

  // Exception for product-media: allows viewing before client-visible IF a valid exception policy is set.
  // Hardened Phase R4: limited to product-media only, and only if marketing-approved or partner-approved.
  if (entityType === 'product-media') {
    const policy = options?.mediaPolicy;
    const isAllowedPolicy = policy === 'partner-owned-exception' || policy === 'restaurant-exception';
    const isAllowedStage = stage === 'marketing-approved' || stage === 'partner-approved';

    if (isAllowedPolicy && isAllowedStage) {
      return true;
    }
  }

  // Explicitly deny internal approval stages from client visibility
  if (
    stage === 'catalog-adopted' ||
    stage === 'marketing-review' ||
    stage === 'marketing-approved' ||
    stage === 'partner-approved' ||
    stage === 'partner-review' ||
    stage === 'partner-submitted' ||
    stage === 'field-submitted' ||
    stage === 'needs-fix' ||
    stage === 'rejected'
  ) {
    return false;
  }

  // default: all other unknown stages are false for client view.
  return false;
}

export function isPartnerOwnedException(stage: ApprovalStage, entityType: ApprovalEntityType): boolean {
  return entityType === 'product-media' && (stage === 'marketing-approved' || stage === 'partner-approved');
}

export function isCatalogOwnedMedia(stage: ApprovalStage | string | undefined): boolean {
  return stage === 'catalog-adopted' || stage === 'client-visible';
}

// =====================================================================
// Global Shared Approval Store (in-memory, fixture-seeded)
// =====================================================================

const PARTNER_QUEUE_STAGES: ReadonlyArray<ApprovalStage> = [
  'partner-submitted', 'field-submitted', 'partner-review', 'partner-approved', 'needs-fix', 'rejected',
];

const MARKETING_QUEUE_STAGES: ReadonlyArray<ApprovalStage> = [
  'marketing-review', 'marketing-approved', 'needs-fix',
];

const CATALOG_QUEUE_STAGES: ReadonlyArray<ApprovalStage> = [
  'marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected',
];

// ── Seed fixtures ────────────────────────────────────────────────────

let _globalStore: ApprovalRecord[] = [
  // — من بوابة الشركاء (partner-intake) —
  {
    id: 'intake-1',
    entityType: 'product',
    source: 'app-partner',
    stage: 'partner-submitted',
    title: 'منتج جديد من الشريك غير موجود في الكتالوج',
    submittedAt: new Date(Date.now() - 3600_000 * 48).toISOString(),
    auditTrail: [],
  },
  {
    id: 'intake-2',
    entityType: 'category-suggestion',
    source: 'app-partner',
    stage: 'partner-review',
    title: 'اقتراح فئة من الشريك',
    submittedAt: new Date(Date.now() - 3600_000 * 36).toISOString(),
    auditTrail: [],
  },
  {
    id: 'intake-3',
    entityType: 'store',
    source: 'app-field',
    stage: 'field-submitted',
    title: 'منتج/متجر من الميداني',
    submittedAt: new Date(Date.now() - 3600_000 * 30).toISOString(),
    auditTrail: [],
  },
  {
    id: 'intake-4',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'needs-fix',
    title: 'صورة المنتج غير واضحة',
    submittedAt: new Date(Date.now() - 3600_000 * 24).toISOString(),
    metadata: {
      requiredFix: 'يرجى إعادة تصوير المنتج بإضاءة أفضل وخلفية بيضاء.',
    },
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 20).toISOString(), fromStage: 'partner-submitted', toStage: 'needs-fix', owner: 'control-panel-partners', actionLabel: 'طلب تعديل' },
    ],
  },
  {
    id: 'intake-5',
    entityType: 'partner-offer',
    source: 'app-partner',
    stage: 'rejected',
    title: 'عرض خصم 90%',
    submittedAt: new Date(Date.now() - 3600_000 * 72).toISOString(),
    metadata: {
      rejectionReason: 'نسبة الخصم عالية جداً وتؤثر على هامش الربح المتفق عليه.',
    },
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 68).toISOString(), fromStage: 'partner-submitted', toStage: 'rejected', owner: 'control-panel-partners', actionLabel: 'رفض' },
    ],
  },
  {
    id: 'intake-6',
    entityType: 'product',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'وجبة غداء عمل — من بوابة الشركاء',
    submittedAt: new Date(Date.now() - 3600_000 * 18).toISOString(),
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 16).toISOString(), fromStage: 'partner-submitted', toStage: 'partner-review', owner: 'control-panel-partners', actionLabel: 'قبول أولي' },
      { at: new Date(Date.now() - 3600_000 * 14).toISOString(), fromStage: 'partner-review', toStage: 'marketing-review', owner: 'control-panel-partners', actionLabel: 'تحويل للتسويق' },
    ],
  },
  {
    id: 'intake-7',
    entityType: 'product',
    source: 'app-partner',
    stage: 'client-visible',
    title: 'ساندوتش دجاج مشوي',
    submittedAt: new Date(Date.now() - 3600_000 * 96).toISOString(),
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 90).toISOString(), fromStage: 'partner-submitted', toStage: 'marketing-review', owner: 'control-panel-partners', actionLabel: 'قبول للتسويق' },
      { at: new Date(Date.now() - 3600_000 * 84).toISOString(), fromStage: 'marketing-review', toStage: 'marketing-approved', owner: 'control-panel-marketing', actionLabel: 'اعتماد تسويقي' },
      { at: new Date(Date.now() - 3600_000 * 78).toISOString(), fromStage: 'marketing-approved', toStage: 'catalog-adopted', owner: 'control-panel-catalog', actionLabel: 'اعتماد مركزي' },
      { at: new Date(Date.now() - 3600_000 * 72).toISOString(), fromStage: 'catalog-adopted', toStage: 'client-visible', owner: 'control-panel-catalog', actionLabel: 'تفعيل للعميل' },
    ],
  },

  // — من بوابة التسويق (marketing-review) —
  {
    id: 'mr-001',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'صورة برغر كلاسيك — مطعم البيت',
    submittedAt: new Date(Date.now() - 3600_000 * 2).toISOString(),
    metadata: {
      mediaKey: 'dsh.product.chicken.v1',
      mediaPolicy: 'catalog-owned-media',
      nextOwner: 'control-panel-catalog',
      systemNote: 'جودة الصورة مقبولة، تحتاج قص RTL',
    },
    auditTrail: [],
  },
  {
    id: 'mr-002',
    entityType: 'product',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'منتج جديد: عصير رمان طبيعي',
    submittedAt: new Date(Date.now() - 3600_000 * 5).toISOString(),
    metadata: {
      mediaKey: 'dsh.product.yogurt.v1',
      mediaPolicy: 'catalog-owned-media',
      nextOwner: 'control-panel-catalog',
      systemNote: 'منتج جديد يحتاج اعتماد تسويقي قبل الكتالوج',
    },
    auditTrail: [],
  },
  {
    id: 'mr-003',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-approved',
    title: 'صورة بيتزا مارغريتا — شريك مطعم',
    submittedAt: new Date(Date.now() - 3600_000 * 8).toISOString(),
    metadata: {
      mediaKey: 'dsh.product.pasta.v1',
      mediaPolicy: 'partner-owned-exception',
      nextOwner: 'control-panel-catalog',
      systemNote: 'استثناء شريك: الصورة مرتبطة ببراند المطعم',
    },
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 6).toISOString(), fromStage: 'marketing-review', toStage: 'marketing-approved', owner: 'control-panel-marketing', actionLabel: 'اعتماد تسويقي' },
    ],
  },
  {
    id: 'mr-004',
    entityType: 'category-suggestion',
    source: 'control-panel-marketing',
    stage: 'marketing-review',
    title: 'فئة مقترحة: مأكولات صحية',
    submittedAt: new Date(Date.now() - 3600_000 * 1).toISOString(),
    metadata: {
      mediaKey: 'dsh.category.main.restaurants.v1',
      mediaPolicy: 'catalog-owned-media',
      nextOwner: 'control-panel-catalog',
      systemNote: 'فئة جديدة تحتاج موافقة التسويق قبل إنشائها في الكتالوج',
    },
    auditTrail: [],
  },
  {
    id: 'mr-005',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'needs-fix',
    title: 'صورة سلطة يونانية — دقة منخفضة',
    submittedAt: new Date(Date.now() - 3600_000 * 12).toISOString(),
    metadata: {
      mediaKey: 'dsh.product.salad.v1',
      mediaPolicy: 'catalog-owned-media',
      nextOwner: 'app-partner',
      systemNote: 'الصورة أقل من 800×600 — يُرجى إعادة الرفع',
    },
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 10).toISOString(), fromStage: 'marketing-review', toStage: 'needs-fix', owner: 'control-panel-marketing', actionLabel: 'طلب تعديل' },
    ],
  },
  {
    id: 'mr-006',
    entityType: 'store',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'غلاف متجر: مطعم الياسمين',
    submittedAt: new Date(Date.now() - 3600_000 * 4).toISOString(),
    metadata: {
      mediaKey: 'dsh.store.hittin.cover.v1',
      mediaPolicy: 'restaurant-exception',
      nextOwner: 'control-panel-catalog',
      systemNote: 'غلاف متجر — استثناء مطعم، يخضع لسياسة الوسائط الخاصة',
    },
    auditTrail: [],
  },
  {
    id: 'mr-007',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'تعارض وسائط: صورة مكررة لمنتجين',
    submittedAt: new Date(Date.now() - 1800_000).toISOString(),
    metadata: {
      mediaKey: 'dsh.product.roll.v1',
      mediaPolicy: 'media-conflict',
      nextOwner: 'control-panel-marketing',
      systemNote: 'نفس الصورة مرتبطة بمنتجين مختلفين — يتطلب حلاً',
    },
    auditTrail: [],
  },
  {
    id: 'mr-008',
    entityType: 'product',
    source: 'app-partner',
    stage: 'catalog-adopted',
    title: 'وجبة عائلية مكتملة — أُرسلت للكتالوج',
    submittedAt: new Date(Date.now() - 3600_000 * 24).toISOString(),
    metadata: {
      mediaKey: 'dsh.product.chicken.v1',
      mediaPolicy: 'catalog-owned-media',
      nextOwner: 'control-panel-catalog',
      systemNote: 'مكتمل — ظاهر في الكتالوج',
    },
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 20).toISOString(), fromStage: 'marketing-review', toStage: 'marketing-approved', owner: 'control-panel-marketing', actionLabel: 'اعتماد تسويقي' },
      { at: new Date(Date.now() - 3600_000 * 16).toISOString(), fromStage: 'marketing-approved', toStage: 'catalog-adopted', owner: 'control-panel-marketing', actionLabel: 'إرسال للكتالوج' },
    ],
  },

  // — من بوابة الكتالوج (catalog-adoption) —
  {
    id: 'cat-1',
    entityType: 'product',
    source: 'control-panel-marketing',
    stage: 'catalog-adopted',
    title: 'عنصر معتمد — في الكتالوج (مسودة)',
    submittedAt: new Date(Date.now() - 3600_000 * 60).toISOString(),
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 56).toISOString(), fromStage: 'marketing-approved', toStage: 'catalog-adopted', owner: 'control-panel-catalog', actionLabel: 'اعتماد مركزي' },
    ],
  },
  {
    id: 'cat-2',
    entityType: 'product',
    source: 'control-panel-catalog',
    stage: 'client-visible',
    title: 'عنصر ظاهر للعميل',
    submittedAt: new Date(Date.now() - 3600_000 * 120).toISOString(),
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 100).toISOString(), fromStage: 'catalog-adopted', toStage: 'client-visible', owner: 'control-panel-catalog', actionLabel: 'تفعيل للعميل' },
    ],
  },
  {
    id: 'cat-3',
    entityType: 'partner-offer',
    source: 'control-panel-marketing',
    stage: 'marketing-approved',
    title: 'عرض ترويجي من التسويق',
    submittedAt: new Date(Date.now() - 3600_000 * 10).toISOString(),
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 8).toISOString(), fromStage: 'marketing-review', toStage: 'marketing-approved', owner: 'control-panel-marketing', actionLabel: 'اعتماد تسويقي' },
    ],
  },
  {
    id: 'cat-4',
    entityType: 'product-media',
    source: 'control-panel-marketing',
    stage: 'marketing-approved',
    title: 'صورة مطعم مخصصة',
    submittedAt: new Date(Date.now() - 3600_000 * 6).toISOString(),
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 4).toISOString(), fromStage: 'marketing-review', toStage: 'marketing-approved', owner: 'control-panel-marketing', actionLabel: 'اعتماد تسويقي' },
    ],
  },
  {
    id: 'price-conflict-1',
    entityType: 'product',
    source: 'app-partner',
    stage: 'partner-submitted',
    title: 'تعارض سعر: تفاح رويال غالا (سعر الشريك 32 ر.س مقابل المرجعي 18 ر.س)',
    submittedAt: new Date(Date.now() - 3600_000 * 12).toISOString(),
    metadata: {
      systemNote: 'فرق السعر يتجاوز حد التسامح المسموح به (20%).',
    },
    auditTrail: [],
  },
  {
    id: 'price-conflict-2',
    entityType: 'product',
    source: 'app-partner',
    stage: 'partner-review',
    title: 'تعارض سعر: حليب عضوي 1.5 لتر (سعر الشريك 25 ر.س مقابل المرجعي 11 ر.س)',
    submittedAt: new Date(Date.now() - 3600_000 * 6).toISOString(),
    metadata: {
      systemNote: 'تعارض تسعير نشط مع الفئات المجاورة.',
    },
    auditTrail: [],
  },
  {
    id: 'barcode-conflict-1',
    entityType: 'product',
    source: 'app-partner',
    stage: 'partner-submitted',
    title: 'تعارض باركود: خبز قمح كامل (الباركود 6281100223344 مستخدم بالفعل لـ منتج آخر)',
    submittedAt: new Date(Date.now() - 3600_000 * 8).toISOString(),
    metadata: {
      systemNote: 'الباركود متطابق مع منتج نشط في الكتالوج.',
    },
    auditTrail: [],
  },
];

// ── Selectors ────────────────────────────────────────────────────────

export function getAllApprovalRecords(): ApprovalRecord[] {
  return _globalStore;
}

export function getPartnerQueueRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => (PARTNER_QUEUE_STAGES as readonly any[]).indexOf(r.stage) >= 0);
}

export function getPartnerIntakeItems(): ApprovalRecord[] {
  return getPartnerQueueRecords();
}


export function getMarketingQueueRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => (MARKETING_QUEUE_STAGES as readonly any[]).indexOf(r.stage) >= 0);
}

export function getCatalogQueueRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => (CATALOG_QUEUE_STAGES as readonly any[]).indexOf(r.stage) >= 0);
}

export function getClientVisibleRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => r.stage === 'client-visible');
}

// ── Mutations ────────────────────────────────────────────────────────

export function upsertApprovalRecord(record: Partial<ApprovalRecord> & { id: string }): void {
  let idx = -1;
  for (let i = 0; i < _globalStore.length; i++) {
    if (_globalStore[i].id === record.id) {
      idx = i;
      break;
    }
  }
  if (idx >= 0) {
    _globalStore = _globalStore.map(r => (r.id === record.id ? { ...r, ...record } : r));
  } else {
    _globalStore = [..._globalStore, record as ApprovalRecord];
  }
}

export function moveApprovalRecordToStage(
  id: string,
  toStage: ApprovalStage,
  owner: ApprovalSourceSurface,
  actionLabel: string,
): void {
  _globalStore = _globalStore.map(r => {
    if (r.id !== id) return r;
    const entry: AuditTrailEntry = {
      at: new Date().toISOString(),
      fromStage: r.stage,
      toStage,
      owner,
      actionLabel,
    };
    return {
      ...r,
      stage: toStage,
      auditTrail: [...(r.auditTrail || []), entry],
    };
  });
}

// =====================================================================
// DSH Shared Partner Activation, Documents & Overrides SSoT — UI_PREVIEW_ONLY
// =====================================================================

export type DshPartnerDocumentKind = 'commercial_registration' | 'tax_certificate' | 'identity_proof';

export type DshPartnerDocumentVerification = {
  id: string;
  kind: DshPartnerDocumentKind;
  label: string;
  status: 'uploaded' | 'missing' | 'verified' | 'rejected';
  uploadedAt?: string;
  rejectionReason?: string;
  verifiedByFieldAgent?: string;
  fieldVisitDate?: string;
  fieldEvidencePhoto?: string;
  geoCoordinates?: string;
};

export type DshPartnerCatalogOverride = {
  productId: string;
  priceOverride?: string;
  stockOverride?: number;
  availableOverride?: boolean;
  prepNoteOverride?: string;
  owner: 'partner' | 'cp_manager';
  state: 'active' | 'draft' | 'pending_review';
  lastUpdated: string;
};

// Global shared states
let _globalPartnerStatuses: Record<string, DshPartnerActivationStatus> = {
  'partner-saha': 'client_visible',
  'partner-shorouq': 'submitted',
  'partner-zawya': 'documents_uploaded',
  'partner-nokhba': 'ops_approved',
};

let _globalPartnerDocuments: Record<string, DshPartnerDocumentVerification[]> = {
  'partner-saha': [
    { id: 'doc-cr-saha', kind: 'commercial_registration', label: 'السجل التجاري (محمصة الساحة)', status: 'verified', uploadedAt: '2026-05-20T10:00:00Z', verifiedByFieldAgent: 'ناصر القحطاني', fieldVisitDate: '2026-05-22', fieldEvidencePhoto: 'CR_SAHA_01.jpg', geoCoordinates: '24.7136, 46.6753' },
    { id: 'doc-tax-saha', kind: 'tax_certificate', label: 'الشهادة الضريبية', status: 'verified', uploadedAt: '2026-05-20T10:05:00Z', verifiedByFieldAgent: 'ناصر القحطاني', fieldVisitDate: '2026-05-22', fieldEvidencePhoto: 'TAX_SAHA_01.jpg', geoCoordinates: '24.7136, 46.6753' },
    { id: 'doc-id-saha', kind: 'identity_proof', label: 'هوية المالك / المفوض', status: 'verified', uploadedAt: '2026-05-20T10:10:00Z', verifiedByFieldAgent: 'ناصر القحطاني', fieldVisitDate: '2026-05-22', fieldEvidencePhoto: 'ID_SAHA_01.jpg', geoCoordinates: '24.7136, 46.6753' },
  ],
  'partner-shorouq': [
    { id: 'doc-cr-shorouq', kind: 'commercial_registration', label: 'السجل التجاري (بوفيه الشروق)', status: 'uploaded', uploadedAt: '2026-05-28T14:30:00Z', verifiedByFieldAgent: 'عبد الله الشمري', fieldVisitDate: '2026-05-28', fieldEvidencePhoto: 'CR_SHOROUQ.png', geoCoordinates: '24.8122, 46.7329' },
    { id: 'doc-tax-shorouq', kind: 'tax_certificate', label: 'الشهادة الضريبية', status: 'missing' },
    { id: 'doc-id-shorouq', kind: 'identity_proof', label: 'هوية المالك / المفوض', status: 'uploaded', uploadedAt: '2026-05-28T14:35:00Z', verifiedByFieldAgent: 'عبد الله الشمري', fieldVisitDate: '2026-05-28', fieldEvidencePhoto: 'ID_SHOROUQ.png', geoCoordinates: '24.8122, 46.7329' },
  ],
  'partner-zawya': [
    { id: 'doc-cr-zawya', kind: 'commercial_registration', label: 'السجل التجاري (مخبز الزاوية)', status: 'verified', uploadedAt: '2026-05-15T09:00:00Z', verifiedByFieldAgent: 'ناصر القحطاني', fieldVisitDate: '2026-05-16', fieldEvidencePhoto: 'CR_ZAWYA.jpg', geoCoordinates: '24.7562, 46.6111' },
    { id: 'doc-tax-zawya', kind: 'tax_certificate', label: 'الشهادة الضريبية', status: 'verified', uploadedAt: '2026-05-15T09:02:00Z', verifiedByFieldAgent: 'ناصر القحطاني', fieldVisitDate: '2026-05-16', fieldEvidencePhoto: 'TAX_ZAWYA.jpg', geoCoordinates: '24.7562, 46.6111' },
    { id: 'doc-id-zawya', kind: 'identity_proof', label: 'هوية المالك / المفوض', status: 'rejected', uploadedAt: '2026-05-15T09:05:00Z', rejectionReason: 'صورة الهوية منتهية الصلاحية — يرجى رفع الهوية الوطنية سارية المفعول.', verifiedByFieldAgent: 'ناصر القحطاني' },
  ],
  'partner-nokhba': [
    { id: 'doc-cr-nokhba', kind: 'commercial_registration', label: 'السجل التجاري (تمور النخبة)', status: 'verified', uploadedAt: '2026-05-25T11:00:00Z', verifiedByFieldAgent: 'عبد العزيز الحربي', fieldVisitDate: '2026-05-26', fieldEvidencePhoto: 'CR_NOKHBA.png', geoCoordinates: '24.7891, 46.8012' },
    { id: 'doc-tax-nokhba', kind: 'tax_certificate', label: 'الشهادة الضريبية', status: 'verified', uploadedAt: '2026-05-25T11:05:00Z', verifiedByFieldAgent: 'عبد العزيز الحربي', fieldVisitDate: '2026-05-26', fieldEvidencePhoto: 'TAX_NOKHBA.png', geoCoordinates: '24.7891, 46.8012' },
    { id: 'doc-id-nokhba', kind: 'identity_proof', label: 'هوية المالك / المفوض', status: 'verified', uploadedAt: '2026-05-25T11:10:00Z', verifiedByFieldAgent: 'عبد العزيز الحربي', fieldVisitDate: '2026-05-26', fieldEvidencePhoto: 'ID_NOKHBA.png', geoCoordinates: '24.7891, 46.8012' },
  ],
};

let _globalPartnerOverrides: Record<string, DshPartnerCatalogOverride[]> = {
  'partner-saha': [
    { productId: 'item-apple-1', priceOverride: '22.00 ر.س', stockOverride: 45, availableOverride: true, prepNoteOverride: 'تفاح طازج مقطع عند الطلب', owner: 'partner', state: 'active', lastUpdated: 'أمس 18:30' },
    { productId: 'item-milk-1', priceOverride: '13.50 ر.س', stockOverride: 5, availableOverride: true, owner: 'cp_manager', state: 'active', lastUpdated: 'اليوم 08:40' },
    { productId: 'item-choco-2', availableOverride: false, prepNoteOverride: 'غير متوفر مؤقتاً بسبب نفاد الشوكولاتة الخاصة', owner: 'partner', state: 'active', lastUpdated: 'اليوم 10:15' },
  ],
  'partner-shorouq': [
    { productId: 'item-chicken-2', priceOverride: '18.00 ر.س', stockOverride: 120, availableOverride: true, prepNoteOverride: 'تحضير طازج يستغرق ١٥ دقيقة', owner: 'partner', state: 'active', lastUpdated: 'اليوم 09:20' },
  ],
  'partner-zawya': [
    { productId: 'item-bread-1', priceOverride: '12.00 ر.س', stockOverride: 0, availableOverride: false, owner: 'partner', state: 'pending_review', lastUpdated: 'أمس 12:00' },
  ],
  'partner-nokhba': [
    { productId: 'canonical-product-field-lead-5-featured', priceOverride: '95.00 ر.س', stockOverride: 300, availableOverride: true, prepNoteOverride: 'تغليف ملكي خاص للهدايا الميدانية', owner: 'cp_manager', state: 'active', lastUpdated: 'اليوم 12:15' },
  ],
};

// Getters & Setters
export function resolvePartnerIdForStore(storeId: string): string {
  if (storeId.includes('saha') || storeId === 'store-1001' || storeId === 'store-2001') return 'partner-saha';
  if (storeId.includes('shorouq') || storeId === 'store-1002' || storeId === 'store-2002') return 'partner-shorouq';
  if (storeId.includes('zawya') || storeId === 'store-1003' || storeId === 'store-2102') return 'partner-zawya';
  if (storeId.includes('nokhba') || storeId === 'store-visible-client' || storeId === 'canonical-store-field-lead-5') return 'partner-nokhba';
  return storeId;
}

export function getPartnerActivationStatus(partnerId: string): DshPartnerActivationStatus {
  return _globalPartnerStatuses[partnerId] ?? 'draft';
}

export function updatePartnerActivationStatus(partnerId: string, status: DshPartnerActivationStatus): void {
  _globalPartnerStatuses = { ..._globalPartnerStatuses, [partnerId]: status };
}

export function getAllPartnerActivationStatuses(): Record<string, DshPartnerActivationStatus> {
  return _globalPartnerStatuses;
}

export function getPartnerDocuments(partnerId: string): DshPartnerDocumentVerification[] {
  return _globalPartnerDocuments[partnerId] ?? [];
}

export function updatePartnerDocumentStatus(
  partnerId: string,
  docId: string,
  status: 'uploaded' | 'missing' | 'verified' | 'rejected',
  reason?: string
): void {
  const docs = _globalPartnerDocuments[partnerId] ?? [];
  const updated = docs.map(d => d.id === docId ? { ...d, status, rejectionReason: reason } : d);
  _globalPartnerDocuments = { ..._globalPartnerDocuments, [partnerId]: updated };
}

export function getPartnerCatalogOverrides(partnerId: string): DshPartnerCatalogOverride[] {
  return _globalPartnerOverrides[partnerId] ?? [];
}

export function upsertPartnerCatalogOverride(partnerId: string, override: DshPartnerCatalogOverride): void {
  const current = _globalPartnerOverrides[partnerId] ?? [];
  const filtered = current.filter(o => o.productId !== override.productId);
  _globalPartnerOverrides = { ..._globalPartnerOverrides, [partnerId]: [...filtered, override] };
}

export function deletePartnerCatalogOverride(partnerId: string, productId: string): void {
  const current = _globalPartnerOverrides[partnerId] ?? [];
  const filtered = current.filter(o => o.productId !== productId);
  _globalPartnerOverrides = { ..._globalPartnerOverrides, [partnerId]: filtered };
}
