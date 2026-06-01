/**
 * WLT DSH Audit Pack — Preview Contract
 *
 * Defines what a daily close produces as an audit record.
 * WLT owns all audit authority.
 * DSH assembles the preparation pack; WLT runtime validates and executes.
 *
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

export type WltAuditPackStatus =
  | 'preparing'
  | 'ready_for_review'
  | 'reviewed'
  | 'approved'
  | 'submitted_to_wlt'
  | 'executed'
  | 'rejected';

export type WltAuditEventType =
  | 'daily-close-initiated'
  | 'entry-prepared'
  | 'entry-reviewed'
  | 'entry-approved'
  | 'entry-rejected'
  | 'variance-detected'
  | 'evidence-uploaded'
  | 'gate-opened'
  | 'gate-closed'
  | 'pack-submitted'
  | 'wlt-executed';

export type WltAuditEvent = {
  readonly eventId: string;
  readonly type: WltAuditEventType;
  readonly actorId: string;
  readonly actorRole: string;
  readonly entryId?: string;
  readonly timestamp: string;
  readonly note?: string;
  readonly isPreview: true;
};

export type WltAuditEvidenceItem = {
  readonly entryId: string;
  readonly evidenceRef: string;
  readonly evidenceType: 'bank-statement' | 'pos-log' | 'audit-entry' | 'receipt-upload' | 'none';
  readonly isComplete: boolean;
};

export type WltAuditException = {
  readonly entryId: string;
  readonly reason: string;
  readonly severity: 'warning' | 'blocking';
};

export type WltAuditApproval = {
  readonly entryId: string;
  readonly approvedBy?: string;
  readonly approvedAt?: string;
  readonly state: string;
};

export type WltAuditPack = {
  readonly closingRunId: string;
  readonly businessDate: string;
  readonly status: WltAuditPackStatus;
  readonly openingBalanceMinorUnits: number;
  readonly expectedTotalMinorUnits: number;
  readonly actualTotalMinorUnits: number;
  readonly varianceTotalMinorUnits: number;
  readonly journalBatchId?: string;
  readonly evidenceList: ReadonlyArray<WltAuditEvidenceItem>;
  readonly exceptions: ReadonlyArray<WltAuditException>;
  readonly approvals: ReadonlyArray<WltAuditApproval>;
  readonly auditTrail: ReadonlyArray<WltAuditEvent>;
  readonly hashPreview: string;
  readonly exportTimestamp?: string;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly isPreview: true;
};

export const WLT_AUDIT_PACK_STATUS_LABELS: Readonly<Record<WltAuditPackStatus, string>> = {
  preparing: 'جار التحضير',
  ready_for_review: 'جاهز للمراجعة',
  reviewed: 'تمت المراجعة',
  approved: 'معتمد',
  submitted_to_wlt: 'مرسل لـ WLT',
  executed: 'نُفِّذ',
  rejected: 'مرفوض',
};

export function buildWltAuditPackPreview(params: {
  businessDate: string;
  expectedTotalMinorUnits: number;
  actualTotalMinorUnits: number;
  entries: ReadonlyArray<{
    id: string;
    evidenceStatus: 'complete' | 'partial' | 'missing';
    workflowState: string;
    varianceMinorUnits: number;
    evidenceSource: string;
    bankDepositRef?: string;
    cashBagRef?: string;
  }>;
}): WltAuditPack {
  const variance = params.expectedTotalMinorUnits - params.actualTotalMinorUnits;
  const dateSlug = params.businessDate.replace(/-/g, '');
  const closingRunId = `CLOSE-PRV-${dateSlug}`;
  const allBalanced = variance === 0;
  const allEvidenceComplete = params.entries.every((e) => e.evidenceStatus === 'complete');
  const allApproved = params.entries.every(
    (e) => e.workflowState === 'approved' || e.workflowState === 'checked_by_checker',
  );

  const status: WltAuditPackStatus =
    !allBalanced ? 'preparing'
    : !allEvidenceComplete ? 'preparing'
    : !allApproved ? 'ready_for_review'
    : 'reviewed';

  return {
    closingRunId,
    businessDate: params.businessDate,
    status,
    openingBalanceMinorUnits: 0,
    expectedTotalMinorUnits: params.expectedTotalMinorUnits,
    actualTotalMinorUnits: params.actualTotalMinorUnits,
    varianceTotalMinorUnits: variance,
    journalBatchId: allBalanced ? `JB-PRV-${dateSlug}` : undefined,
    evidenceList: params.entries.map((e) => ({
      entryId: e.id,
      evidenceRef: e.bankDepositRef ?? e.cashBagRef ?? `[معاينة] EVD-${e.id}`,
      evidenceType: (e.evidenceSource as WltAuditEvidenceItem['evidenceType']) ?? 'none',
      isComplete: e.evidenceStatus === 'complete',
    })),
    exceptions: params.entries
      .filter((e) => e.varianceMinorUnits !== 0 || e.evidenceStatus === 'missing')
      .map((e) => ({
        entryId: e.id,
        reason: e.varianceMinorUnits !== 0 ? `فارق: ${e.varianceMinorUnits}` : 'دليل مفقود',
        severity: (e.evidenceStatus === 'missing' || e.workflowState === 'blocked_wlt'
          ? 'blocking'
          : 'warning') as WltAuditException['severity'],
      })),
    approvals: params.entries.map((e) => ({
      entryId: e.id,
      approvedBy: e.workflowState === 'approved' ? '[معاينة] checker-001' : undefined,
      approvedAt: e.workflowState === 'approved' ? new Date().toISOString() : undefined,
      state: e.workflowState,
    })),
    auditTrail: [
      {
        eventId: `EVT-PRV-001`,
        type: 'daily-close-initiated',
        actorId: '[معاينة] maker-001',
        actorRole: 'finance-maker',
        timestamp: new Date().toISOString(),
        note: 'تحضير حزمة إغلاق اليوم المالي — معاينة فقط',
        isPreview: true,
      },
    ],
    hashPreview: '[معاينة] HASH-NOT-REAL — WLT runtime يولّد التوقيع الفعلي',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isPreview: true,
  };
}

export const WLT_AUDIT_PACK_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  isPreview: true,
} as const;
