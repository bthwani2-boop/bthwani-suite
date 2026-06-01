/**
 * LEGACY_BRIDGE — PREVIEW_ONLY
 *
 * هذا الملف جسر توافق قراءة فقط مع WLT المالك الأصلي.
 * DSH لا يملك أي منطق مالي — WLT يملك كل معنى مالي.
 *
 * لا تُنفَّذ هنا أي عمليات مالية حقيقية (لا dger، لا settlement، لا payment mutation).
 * العملة: YER / ر.ي — تمّت إزالة SAR / ر.س بالكامل.
 *
 * للاستخدام الجديد: استورد مباشرة من:
 *   wlt/frontend/shared/finance/dshFinancePreview
 */

export type {
  WltDshFinanceActor as DshFinanceActor,
  WltDshFinanceEventKind as DshFinanceEventKind,
  WltDshFinancePreviewRecord as DshFinancePreviewRecord,
} from '../../../wlt/frontend/shared/finance/dshFinancePreview';

export {
  getWltDshFinanceRecordsForActor as getDshFinanceRecordsForActor,
  getWltDshFinanceSummaryForActor as getDshFinanceSummaryForActor,
  getWltPartnerSettlementPreview as getDshPartnerSettlementPreview,
  getWltCaptainFinancePreview as getDshCaptainFinancePreview,
  getWltFieldFinancePreview as getDshFieldFinancePreview,
  resolveWltDshFinanceEventKindForPaymentMethod as resolveDshFinanceEventKindForPayment,
} from '../../../wlt/frontend/shared/finance/dshFinancePreview';

// --- P0-07: WLT Finance Bridge — DSH Read-Only Boundary Contracts ---
// All types below describe WHAT DSH DISPLAYS from WLT.
// DSH never computes, initiates, approves, or mutates any financial artifact.
// Mutation boundary: refund / settlement / payout / commission / platform-fee are WLT-only.

/** WLT-owned refund pipeline states displayed in DSH as read-only status labels.
 * DSH shows these for ops awareness only. WLT decides all refund outcomes. */
export type DshWltRefundBridgeStatus =
  | 'refund_pending_wlt'    // WLT is processing the refund — read-only display
  | 'refund_completed_wlt'  // WLT completed the refund — read-only display
  | 'refund_rejected_wlt';  // WLT rejected the refund — read-only display

/** Contract/binding state between DSH and the WLT finance endpoint. */
export type DshWltBridgeContractStatus =
  | 'connected'         // Bridge proven and active — live WLT data
  | 'pending_contract'  // Contract not yet proven — preview data only
  | 'blocked';          // Bridge explicitly blocked (policy / error)

/** Boundary record surface type for every DSH finance workspace.
 * These fields are DISPLAYED — none allow mutation. */
export type DshWltFinanceBoundaryRecord = {
  /** WLT finance domain this record represents */
  readonly domain:
    | 'refund'
    | 'settlement'
    | 'payout'
    | 'commission'
    | 'platform-fee'
    | 'field-commission'
    | 'cod-liability'
    | 'ledger-journal'
    | 'captain-eligibility'
    | 'store-delivery-fee'
    | 'risk-audit';
  /** Source of financial truth — always WLT */
  readonly source: 'WLT';
  /** DSH capability — always view-only */
  readonly dshRole: 'view-only';
  /** DSH mutation capability — always forbidden */
  readonly mutation: 'forbidden';
  /** Current binding / contract state */
  readonly contractStatus: DshWltBridgeContractStatus;
  /** Human-readable label for contractStatus (Arabic) */
  readonly contractStatusLabel: string;
  /** Last sync label — 'معاينة فقط' when not connected */
  readonly lastSyncLabel: string;
  /** Affected actor label (Kaptain / partner / field agent) */
  readonly affectedActor: string;
  /** Affected entity ID, if known */
  readonly affectedEntityId?: string;
  /** Reason bridge is blocked, if applicable */
  readonly blockedReason?: string;
  /** Whether audit trail entry is required for any status transition */
  readonly auditVisibilityRequired: boolean;
};

const CONTRACT_STATUS_LABELS: Record<DshWltBridgeContractStatus, string> = {
  connected: 'متصل — بيانات WLT حية',
  pending_contract: 'في انتظار ربط API — معاينة فقط',
  blocked: 'محظور — انظر سبب الحظر',
};

const WLT_REFUND_STATUS_LABELS: Record<DshWltRefundBridgeStatus, string> = {
  refund_pending_wlt: 'استرداد معلق — WLT',
  refund_completed_wlt: 'استرداد مكتمل — WLT',
  refund_rejected_wlt: 'استرداد مرفوض — WLT',
};

const WLT_REFUND_STATUS_TONES: Record<
  DshWltRefundBridgeStatus,
  'default' | 'success' | 'danger' | 'warning'
> = {
  refund_pending_wlt: 'warning',
  refund_completed_wlt: 'success',
  refund_rejected_wlt: 'danger',
};

export function getDshWltRefundStatusLabel(status: DshWltRefundBridgeStatus): string {
  return WLT_REFUND_STATUS_LABELS[status];
}

export function getDshWltRefundStatusTone(
  status: DshWltRefundBridgeStatus,
): 'default' | 'success' | 'danger' | 'warning' {
  return WLT_REFUND_STATUS_TONES[status];
}

/** Build a WLT boundary record for display in a DSH finance workspace.
 * All fields enforce the read-only contract — no mutation fields are present. */
export function buildDshWltFinanceBoundaryRecord(options: {
  domain: DshWltFinanceBoundaryRecord['domain'];
  contractStatus: DshWltBridgeContractStatus;
  affectedActor: string;
  affectedEntityId?: string;
  blockedReason?: string;
  auditVisibilityRequired?: boolean;
}): DshWltFinanceBoundaryRecord {
  return {
    domain: options.domain,
    source: 'WLT',
    dshRole: 'view-only',
    mutation: 'forbidden',
    contractStatus: options.contractStatus,
    contractStatusLabel: CONTRACT_STATUS_LABELS[options.contractStatus],
    lastSyncLabel:
      options.contractStatus === 'connected'
        ? 'مزامنة حية'
        : 'معاينة فقط — لا بيانات حية',
    affectedActor: options.affectedActor,
    affectedEntityId: options.affectedEntityId,
    blockedReason: options.blockedReason,
    auditVisibilityRequired: options.auditVisibilityRequired ?? false,
  };
}
