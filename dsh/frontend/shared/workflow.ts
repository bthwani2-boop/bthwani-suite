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

export function isClientVisibleStage(stage: string | undefined): boolean {
  return stage === 'client-visible';
}

export function isLegacyPublishedPreview(stage: string | undefined): boolean {
  return stage === 'published-preview' || stage === 'published';
}

export function canRenderInClientSurface(stage: string | undefined, entityType?: ApprovalEntityType): boolean {
  // Strict hardening v2: elements coming from the canonical/approval pipeline MUST have a valid stage.
  // We no longer allow default visibility if stage is missing for elements intended for client view.
  if (!stage) return false;

  // Exception for product-media: allows viewing if marketing-approved or partner-approved (partner-owned-exception)
  if (entityType === 'product-media' && isPartnerOwnedException(stage as ApprovalStage, entityType)) {
    return true;
  }

  return isClientVisibleStage(stage) || isLegacyPublishedPreview(stage);
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
      mediaKey: 'media/products/burger-classic-01.jpg',
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
      mediaKey: 'media/products/juice-pomegranate-01.jpg',
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
      mediaKey: 'media/products/pizza-margherita-01.jpg',
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
      mediaKey: 'media/categories/healthy-food-cover.jpg',
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
      mediaKey: 'media/products/salad-greek-low.jpg',
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
      mediaKey: 'media/stores/yasmin-cover-01.jpg',
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
      mediaKey: 'media/products/conflict-duplicate-01.jpg',
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
      mediaKey: 'media/products/family-meal-final.jpg',
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
];

// ── Selectors ────────────────────────────────────────────────────────

export function getAllApprovalRecords(): ApprovalRecord[] {
  return _globalStore;
}

export function getPartnerQueueRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => PARTNER_QUEUE_STAGES.includes(r.stage));
}

export function getMarketingQueueRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => MARKETING_QUEUE_STAGES.includes(r.stage));
}

export function getCatalogQueueRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => CATALOG_QUEUE_STAGES.includes(r.stage));
}

export function getClientVisibleRecords(): ApprovalRecord[] {
  return _globalStore.filter(r => r.stage === 'client-visible');
}

// ── Mutations ────────────────────────────────────────────────────────

export function upsertApprovalRecord(record: Partial<ApprovalRecord> & { id: string }): void {
  const idx = _globalStore.findIndex(r => r.id === record.id);
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
