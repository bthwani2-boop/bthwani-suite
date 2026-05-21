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
    nextOwner: (r.metadata?.nextOwner as MediaReviewRecord['nextOwner']) || 'control-panel-catalog',
    systemNote: r.metadata?.systemNote || r.metadata?.requiredFix || r.metadata?.rejectionReason,
  };
}

function appendMarketingSystemNote(currentNote: string | undefined, nextNote: string): string {
  if (!currentNote?.trim()) {
    return nextNote;
  }

  if (currentNote.includes(nextNote)) {
    return currentNote;
  }

  return `${nextNote} — ${currentNote}`;
}

// =====================================================================
// Selectors
// =====================================================================

export function getMediaReviewItems(): MediaReviewRecord[] {
  const entityTypes: string[] = ['product', 'product-media', 'category-suggestion', 'store'];
  const stages: string[] = ['marketing-review', 'marketing-approved', 'needs-fix', 'catalog-adopted', 'rejected'];

  return getAllApprovalRecords()
    .filter(r =>
      entityTypes.indexOf(r.entityType) >= 0 &&
      stages.indexOf(r.stage) >= 0
    )
    .map(mapToMediaReview);
}

export function getMediaReviewItem(id: string): MediaReviewRecord | undefined {
  const records = getAllApprovalRecords();
  let r: ApprovalRecord | undefined = undefined;
  for (let i = 0; i < records.length; i++) {
    if (records[i].id === id) {
      r = records[i];
      break;
    }
  }
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
      metadata: {
        ...item.metadata,
        nextOwner: 'control-panel-catalog',
        systemNote: appendMarketingSystemNote(item.systemNote, 'تم اعتماد العنصر تسويقياً مع توثيق قرار المرور إلى الكتالوج.'),
      }
    });
  }
}

export function requestMediaFix(id: string, note?: string): void {
  moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-marketing', 'طلب تعديل');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'app-partner',
        systemNote: appendMarketingSystemNote(item.systemNote, note || 'أُعيد العنصر للشريك مع ملاحظة مراجعة واضحة قبل أي ظهور جديد.'),
      }
    });
  }
}

export function rejectMediaReviewItem(id: string): void {
  moveApprovalRecordToStage(id, 'rejected', 'control-panel-marketing', 'رفض');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'app-partner',
        systemNote: appendMarketingSystemNote(item.systemNote, 'تم رفض العنصر تسويقياً مع حفظ مبرر يمنع ظهوره على العميل.'),
      }
    });
  }
}

export function sendMediaToCatalog(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-marketing', 'إرسال للكتالوج');
  const item = getMediaReviewItem(id);
  if (item) {
    upsertApprovalRecord({
      id,
      metadata: {
        ...item.metadata,
        nextOwner: 'control-panel-catalog',
        systemNote: appendMarketingSystemNote(item.systemNote, 'تم تمرير العنصر من التسويق إلى الكتالوج لتثبيت الظهور النهائي.'),
      }
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
