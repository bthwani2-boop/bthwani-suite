import {
  ApprovalRecord,
  ApprovalStage,
  getAllApprovalRecords,
  moveApprovalRecordToStage,
  upsertApprovalRecord,
} from './workflow';

// =====================================================================
// marketing-review-store.ts — DSH Media & Product Review SSOT v2
// الأنواع المسموحة: product | product-media | category-suggestion | store | media-conflict
// لا تشمل: partner-offer | banner | promo | video — لها مسارات مستقلة
// يعمل الآن فوق shared workflow store فعليًا
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
// Mappers
// =====================================================================

function mapToMediaReview(r: ApprovalRecord): MediaReviewRecord {
  return {
    ...r,
    mediaKey: r.metadata?.mediaKey,
    mediaPolicy: (r.metadata?.mediaPolicy as MediaPolicyKind) || 'catalog-owned-media',
    nextOwner: (r.metadata?.nextOwner as any) || 'control-panel-catalog',
    systemNote: r.metadata?.systemNote || r.metadata?.requiredFix || r.metadata?.rejectionReason,
  };
}

// =====================================================================
// Selectors
// =====================================================================

export function getMediaReviewItems(): MediaReviewRecord[] {
  return getAllApprovalRecords()
    .filter(r =>
      ['product', 'product-media', 'category-suggestion', 'store'].includes(r.entityType) &&
      ['marketing-review', 'marketing-approved', 'needs-fix', 'catalog-adopted', 'rejected'].includes(r.stage)
    )
    .map(mapToMediaReview);
}

export function getMediaReviewItem(id: string): MediaReviewRecord | undefined {
  const r = getAllApprovalRecords().find(it => it.id === id);
  return r ? mapToMediaReview(r) : undefined;
}

export function getMediaReviewKpis() {
  const items = getMediaReviewItems();
  return {
    pending: items.filter(r => r.stage === 'marketing-review').length,
    approved: items.filter(r => r.stage === 'marketing-approved').length,
    needsFix: items.filter(r => r.stage === 'needs-fix').length,
    catalogReady: items.filter(r => r.stage === 'catalog-adopted').length,
    conflicts: items.filter(r => r.mediaPolicy === 'media-conflict').length,
  };
}

// =====================================================================
// Mutations — delegate to shared workflow store
// =====================================================================

export function approveMediaReviewItem(id: string): void {
  moveApprovalRecordToStage(id, 'marketing-approved', 'control-panel-marketing', 'اعتماد تسويقي');
  // Update next owner in metadata
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: { ...item.metadata, nextOwner: 'control-panel-catalog' }
    });
  }
}

export function requestMediaFix(id: string, note?: string): void {
  moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-marketing', 'طلب تعديل');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: { ...item.metadata, nextOwner: 'app-partner', systemNote: note || item.systemNote }
    });
  }
}

export function rejectMediaReviewItem(id: string): void {
  moveApprovalRecordToStage(id, 'rejected', 'control-panel-marketing', 'رفض');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: { ...item.metadata, nextOwner: 'app-partner' }
    });
  }
}

export function sendMediaToCatalog(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-marketing', 'إرسال للكتالوج');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: { ...item.metadata, nextOwner: 'control-panel-catalog' }
    });
  }
}

export function upsertMediaReviewItem(record: Partial<MediaReviewRecord> & { id: string }): void {
  const { mediaKey, mediaPolicy, nextOwner, systemNote, ...rest } = record;
  const metadata = {
    ...rest.metadata,
    ...(mediaKey && { mediaKey }),
    ...(mediaPolicy && { mediaPolicy }),
    ...(nextOwner && { nextOwner }),
    ...(systemNote && { systemNote }),
  };
  upsertApprovalRecord({ ...rest, metadata });
}

// Legacy compat — kept for existing MarketingReviewQueue import
export { getMediaReviewItems as getMarketingReviewItems };
