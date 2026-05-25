import {
  ApprovalRecord,
  getCatalogQueueRecords,
  getClientVisibleRecords as _getClientVisible,
  moveApprovalRecordToStage,
} from '../shared/workflow';

// =====================================================================
// catalog-adoption-store.ts — Compatibility layer over shared workflow store
// يعرض الآن بيانات من الـ global store بدل قائمة ثابتة
// =====================================================================

/**
 * يعيد كل العناصر المؤهلة لبوابة الكتالوج:
 * marketing-approved | catalog-adopted | client-visible | needs-fix | rejected
 */
export function getCatalogAdoptionItems(): ApprovalRecord[] {
  return getCatalogQueueRecords();
}

/**
 * يعيد فقط العناصر الظاهرة للعميل
 */
export function getClientVisibleItems(): ApprovalRecord[] {
  return _getClientVisible();
}

// ── Shared Mutations ─────────────────────────────────────────────────

export function adoptCatalogCentral(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-catalog', 'اعتماد مركزي');
}

export function adoptCatalogException(id: string): void {
  moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-catalog', 'استثناء شريك');
}

export function activateClientVisible(id: string): void {
  moveApprovalRecordToStage(id, 'client-visible', 'control-panel-catalog', 'تفعيل للعميل');
}

export function returnToMarketing(id: string): void {
  moveApprovalRecordToStage(id, 'marketing-review', 'control-panel-catalog', 'إعادة للتسويق');
}

export function rejectFromCatalog(id: string): void {
  moveApprovalRecordToStage(id, 'rejected', 'control-panel-catalog', 'رفض من الكتالوج');
}

// Legacy compat — kept for any direct reference to the old array
export const catalogAdoptionRecords: ApprovalRecord[] = [];
