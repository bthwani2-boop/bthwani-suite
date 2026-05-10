import { ApprovalRecord, getPartnerQueueRecords } from './workflow';

// =====================================================================
// partner-intake-store.ts — Compatibility layer over shared workflow store
// =====================================================================

/**
 * @deprecated استخدم getPartnerQueueRecords() من workflow.ts مباشرة.
 * يعيد كل العناصر في المراحل الخاصة ببوابة الشركاء.
 */
export function getPartnerIntakeItems(): ApprovalRecord[] {
  return getPartnerQueueRecords().filter(r =>
    ['app-partner', 'app-field'].includes(r.source)
  );
}

// Legacy export — kept for InventoryCatalogWorkspaceContent import compat
export const partnerIntakeRecords: ApprovalRecord[] = [];
