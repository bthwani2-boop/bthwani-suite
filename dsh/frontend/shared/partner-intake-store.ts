import { ApprovalRecord, getAllApprovalRecords } from './workflow';

// =====================================================================
// partner-intake-store.ts — Compatibility layer over shared workflow store
// =====================================================================

/**
 * @deprecated استخدم getPartnerQueueRecords() من workflow.ts مباشرة.
 * يعيد كل العناصر في المراحل الخاصة ببوابة الشركاء.
 */
export function getPartnerIntakeItems(): ApprovalRecord[] {
  return getAllApprovalRecords().filter(r =>
    ['partner-submitted', 'field-submitted', 'partner-review', 'partner-approved',
     'marketing-review', 'marketing-approved', 'catalog-adopted', 'client-visible',
     'needs-fix', 'rejected'].includes(r.stage)
    && ['app-partner', 'app-field'].includes(r.source)
  );
}

// Legacy export — kept for InventoryCatalogWorkspaceContent import compat
export const partnerIntakeRecords: ApprovalRecord[] = [];
