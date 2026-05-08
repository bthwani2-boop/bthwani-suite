import {
  ApprovalRecord,
  ApprovalStage,
  moveApprovalRecordToStage,
} from './workflow';

// =====================================================================
// marketing-review-store.ts — DSH Media & Product Review SSOT v2
// الأنواع المسموحة: product | product-media | category-suggestion | store | media-conflict
// لا تشمل: partner-offer | banner | promo | video — لها مسارات مستقلة
// يعمل الآن فوق shared workflow store بدل in-memory مستقل
// =====================================================================

export type MediaPolicyKind =
  | 'catalog-owned-media'
  | 'partner-owned-exception'
  | 'media-conflict'
  | 'restaurant-exception';

export type MediaReviewRecord = ApprovalRecord & {
  /** رابط الصورة/الوسيط — LTR دائماً */
  mediaKey?: string;
  /** نوع السياسة الإعلامية */
  mediaPolicy: MediaPolicyKind;
  /** المالك التالي بعد الاعتماد */
  nextOwner: 'control-panel-catalog' | 'app-partner' | 'control-panel-marketing';
  /** ملاحظة النظام */
  systemNote?: string;
};

// =====================================================================
// In-memory media-specific records (seeded fixtures)
// هذه السجلات لا تتداخل مع الـ global store لأنها تحمل حقول إضافية
// (mediaKey, mediaPolicy, nextOwner, systemNote)
// =====================================================================
let _records: MediaReviewRecord[] = [
  {
    id: 'mr-001',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'صورة برغر كلاسيك — مطعم البيت',
    submittedAt: new Date(Date.now() - 3600_000 * 2).toISOString(),
    mediaKey: 'media/products/burger-classic-01.jpg',
    mediaPolicy: 'catalog-owned-media',
    nextOwner: 'control-panel-catalog',
    systemNote: 'جودة الصورة مقبولة، تحتاج قص RTL',
    auditTrail: [],
  },
  {
    id: 'mr-002',
    entityType: 'product',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'منتج جديد: عصير رمان طبيعي',
    submittedAt: new Date(Date.now() - 3600_000 * 5).toISOString(),
    mediaKey: 'media/products/juice-pomegranate-01.jpg',
    mediaPolicy: 'catalog-owned-media',
    nextOwner: 'control-panel-catalog',
    systemNote: 'منتج جديد يحتاج اعتماد تسويقي قبل الكتالوج',
    auditTrail: [],
  },
  {
    id: 'mr-003',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-approved',
    title: 'صورة بيتزا مارغريتا — شريك مطعم',
    submittedAt: new Date(Date.now() - 3600_000 * 8).toISOString(),
    mediaKey: 'media/products/pizza-margherita-01.jpg',
    mediaPolicy: 'partner-owned-exception',
    nextOwner: 'control-panel-catalog',
    systemNote: 'استثناء شريك: الصورة مرتبطة ببراند المطعم',
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
    mediaKey: 'media/categories/healthy-food-cover.jpg',
    mediaPolicy: 'catalog-owned-media',
    nextOwner: 'control-panel-catalog',
    systemNote: 'فئة جديدة تحتاج موافقة التسويق قبل إنشائها في الكتالوج',
    auditTrail: [],
  },
  {
    id: 'mr-005',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'needs-fix',
    title: 'صورة سلطة يونانية — دقة منخفضة',
    submittedAt: new Date(Date.now() - 3600_000 * 12).toISOString(),
    mediaKey: 'media/products/salad-greek-low.jpg',
    mediaPolicy: 'catalog-owned-media',
    nextOwner: 'app-partner',
    systemNote: 'الصورة أقل من 800×600 — يُرجى إعادة الرفع',
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
    mediaKey: 'media/stores/yasmin-cover-01.jpg',
    mediaPolicy: 'restaurant-exception',
    nextOwner: 'control-panel-catalog',
    systemNote: 'غلاف متجر — استثناء مطعم، يخضع لسياسة الوسائط الخاصة',
    auditTrail: [],
  },
  {
    id: 'mr-007',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-review',
    title: 'تعارض وسائط: صورة مكررة لمنتجين',
    submittedAt: new Date(Date.now() - 1800_000).toISOString(),
    mediaKey: 'media/products/conflict-duplicate-01.jpg',
    mediaPolicy: 'media-conflict',
    nextOwner: 'control-panel-marketing',
    systemNote: 'نفس الصورة مرتبطة بمنتجين مختلفين — يتطلب حلاً',
    auditTrail: [],
  },
  {
    id: 'mr-008',
    entityType: 'product',
    source: 'app-partner',
    stage: 'catalog-adopted',
    title: 'وجبة عائلية مكتملة — أُرسلت للكتالوج',
    submittedAt: new Date(Date.now() - 3600_000 * 24).toISOString(),
    mediaKey: 'media/products/family-meal-final.jpg',
    mediaPolicy: 'catalog-owned-media',
    nextOwner: 'control-panel-catalog',
    systemNote: 'مكتمل — ظاهر في الكتالوج',
    auditTrail: [
      { at: new Date(Date.now() - 3600_000 * 20).toISOString(), fromStage: 'marketing-review', toStage: 'marketing-approved', owner: 'control-panel-marketing', actionLabel: 'اعتماد تسويقي' },
      { at: new Date(Date.now() - 3600_000 * 16).toISOString(), fromStage: 'marketing-approved', toStage: 'catalog-adopted', owner: 'control-panel-marketing', actionLabel: 'إرسال للكتالوج' },
    ],
  },
];

// =====================================================================
// Selectors
// =====================================================================

export function getMediaReviewItems(): MediaReviewRecord[] {
  return _records;
}

export function getMediaReviewItem(id: string): MediaReviewRecord | undefined {
  return _records.find(r => r.id === id);
}

export function getMediaReviewKpis() {
  return {
    pending: _records.filter(r => r.stage === 'marketing-review').length,
    approved: _records.filter(r => r.stage === 'marketing-approved').length,
    needsFix: _records.filter(r => r.stage === 'needs-fix').length,
    catalogReady: _records.filter(r => r.stage === 'catalog-adopted').length,
    conflicts: _records.filter(r => r.mediaPolicy === 'media-conflict').length,
  };
}

// =====================================================================
// Mutations — delegate to shared store + update local records
// =====================================================================

function addTrail(record: MediaReviewRecord, fromStage: ApprovalStage, toStage: ApprovalStage, owner: string, actionLabel: string): MediaReviewRecord {
  return {
    ...record,
    auditTrail: [
      ...(record.auditTrail || []),
      { at: new Date().toISOString(), fromStage, toStage, owner: owner as any, actionLabel },
    ],
  };
}

export function approveMediaReviewItem(id: string): void {
  _records = _records.map(r => {
    if (r.id !== id) return r;
    const updated = addTrail(r, r.stage, 'marketing-approved', 'control-panel-marketing', 'اعتماد تسويقي');
    return { ...updated, stage: 'marketing-approved' as ApprovalStage, nextOwner: 'control-panel-catalog' as const };
  });
  moveApprovalRecordToStage(id, 'marketing-approved', 'control-panel-marketing', 'اعتماد تسويقي');
}

export function requestMediaFix(id: string, note?: string): void {
  _records = _records.map(r => {
    if (r.id !== id) return r;
    const updated = addTrail(r, r.stage, 'needs-fix', 'control-panel-marketing', 'طلب تعديل');
    return { ...updated, stage: 'needs-fix' as ApprovalStage, nextOwner: 'app-partner' as const, systemNote: note || r.systemNote };
  });
  moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-marketing', 'طلب تعديل');
}

export function rejectMediaReviewItem(id: string): void {
  _records = _records.map(r => {
    if (r.id !== id) return r;
    const updated = addTrail(r, r.stage, 'rejected', 'control-panel-marketing', 'رفض');
    return { ...updated, stage: 'rejected' as ApprovalStage, nextOwner: 'app-partner' as const };
  });
  moveApprovalRecordToStage(id, 'rejected', 'control-panel-marketing', 'رفض');
}

export function sendMediaToCatalog(id: string): void {
  _records = _records.map(r => {
    if (r.id !== id) return r;
    const updated = addTrail(r, r.stage, 'catalog-adopted', 'control-panel-marketing', 'إرسال للكتالوج');
    return { ...updated, stage: 'catalog-adopted' as ApprovalStage, nextOwner: 'control-panel-catalog' as const };
  });
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-marketing', 'إرسال للكتالوج');
}

export function upsertMediaReviewItem(record: Partial<MediaReviewRecord> & { id: string }): void {
  const existing = _records.findIndex(r => r.id === record.id);
  if (existing >= 0) {
    _records = _records.map(r => (r.id === record.id ? { ...r, ...record } : r));
  } else {
    _records = [..._records, record as MediaReviewRecord];
  }
}

// Legacy compat — kept for existing MarketingReviewQueue import
export { getMediaReviewItems as getMarketingReviewItems };
