import { formatWltYer } from '../boundary/dshFinance.types';
import type { WltDshFinanceEventKind } from '../boundary/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../boundary/wltDshFinanceRuntime.adapter';

export type WltDailyReconciliationRow = {
  readonly id: string;
  readonly amount: string;
  readonly owner: string;
  readonly status: string;
  readonly risk: 'danger' | 'warning' | 'success';
  readonly evidence: string;
  readonly nextAction: string;
  readonly recommendation: string;
  readonly primaryActionLabel: string;
  readonly secondaryActionLabel: string;
  readonly sla: string;
  readonly actorType: 'client' | 'partner' | 'captain' | 'field' | 'storeCourier' | 'platform';
  readonly eventKind: WltDshFinanceEventKind | 'unknown';
  readonly expectedMinorUnits: number;
  readonly actualMinorUnits: number;
  readonly varianceMinorUnits: number;
  readonly expectedLabel: string;
  readonly actualLabel: string;
  readonly varianceLabel: string;
  readonly evidenceStatus: 'missing' | 'partial' | 'complete';
  readonly reconciliationStatus: 'unmatched' | 'matched' | 'disputed' | 'closed';
  readonly currencyCode: 'YER';
  readonly ownerService: 'wlt';
  readonly dshRole: 'view_only';
  readonly sourceOrderId?: string;
  readonly sourceStoreId?: string;
  readonly sourceCaptainId?: string;
  readonly sourceFieldAgentId?: string;
  readonly debitAccountId?: string;
  readonly creditAccountId?: string;
  readonly auditTrailId?: string;
  readonly allowedAction: 'review' | 'view_evidence' | 'prepare_decision' | 'none';
  readonly blockedReason?: string;
  readonly expectedSource: 'order-invoice' | 'settlement-cycle' | 'commission-schedule' | 'eligibility-calc' | 'unbound';
  readonly actualSource: 'bank-deposit' | 'wallet-debit' | 'cash-bag-delivery' | 'pos-receipt' | 'unbound';
  readonly evidenceSource: 'bank-statement' | 'pos-log' | 'audit-entry' | 'receipt-upload' | 'none';
  readonly varianceReason?: string;
  readonly bankDepositRef?: string;
  readonly cashBagRef?: string;
  readonly auditEntryRef?: string;
  readonly workflowState: 'draft' | 'prepared' | 'reviewed' | 'checked' | 'approved' | 'blocked_wlt';
};

export function buildRuntimeReconciliationRows(
  runtimeFinance: WltDshFinanceRuntimeResult | null,
): ReadonlyArray<WltDailyReconciliationRow> {
  if (runtimeFinance?.state !== 'runtime') return [];

  return runtimeFinance.data.ledgerEntries.map((entry): WltDailyReconciliationRow => {
    const amountMinorUnits = Math.round(entry.amount * 100);
    const isPosted = entry.status === 'COMPLETED';
    const isBlocked = entry.status === 'FAILED' || entry.status === 'REVERSED';
    const actualMinorUnits = isPosted ? amountMinorUnits : 0;
    const varianceMinorUnits = amountMinorUnits - actualMinorUnits;
    const actorType: WltDailyReconciliationRow['actorType'] =
      entry.subject.startsWith('captain') ? 'captain'
      : entry.subject.startsWith('partner') ? 'partner'
      : entry.subject.startsWith('field') ? 'field'
      : entry.subject.startsWith('client') ? 'client'
      : 'platform';
    const entryRef = entry.reference_type;
    const eventKind: WltDailyReconciliationRow['eventKind'] =
      entryRef === 'payment_session' ? 'wallet-payment'
      : entryRef === 'refund' ? 'refund-adjustment'
      : entryRef === 'settlement' ? 'partner-settlement'
      : 'unknown';
    const expectedSource: WltDailyReconciliationRow['expectedSource'] =
      entryRef === 'settlement' ? 'settlement-cycle' : 'order-invoice';
    const actualSource: WltDailyReconciliationRow['actualSource'] =
      entryRef === 'payment_session' ? 'wallet-debit' : 'bank-deposit';

    return {
      id: `runtime-${entry.id}`,
      amount: formatWltYer(amountMinorUnits),
      owner: entry.subject,
      status: entry.status,
      risk: isBlocked ? 'danger' : isPosted ? 'success' : 'warning',
      evidence: entry.reference_id ?? entry.order_id ?? entry.id,
      nextAction: isPosted ? 'مراقبة القيد المرحل من WLT' : 'مطابقة القيد مع WLT runtime وإرفاق الدليل الناقص',
      recommendation: isPosted ? 'القيد مكتمل ومطابق.' : 'القيد يحتاج استكمال مطابقة قبل الإغلاق.',
      primaryActionLabel: isPosted ? 'عرض القيد' : 'تحضير مطابقة',
      secondaryActionLabel: isPosted ? 'مراجعة السجل' : 'عرض الأدلة',
      sla: isPosted ? 'مغلق' : 'يتطلب متابعة اليوم',
      actorType,
      eventKind,
      expectedMinorUnits: amountMinorUnits,
      actualMinorUnits,
      varianceMinorUnits,
      expectedLabel: formatWltYer(amountMinorUnits),
      actualLabel: formatWltYer(actualMinorUnits),
      varianceLabel: formatWltYer(varianceMinorUnits),
      evidenceStatus: isPosted ? 'complete' : isBlocked ? 'missing' : 'partial',
      reconciliationStatus: isPosted ? 'matched' : isBlocked ? 'disputed' : 'unmatched',
      currencyCode: 'YER',
      ownerService: 'wlt',
      dshRole: 'view_only',
      sourceOrderId: entry.order_id,
      sourceStoreId: actorType === 'partner' ? entry.subject : undefined,
      sourceCaptainId: actorType === 'captain' ? entry.subject : undefined,
      sourceFieldAgentId: actorType === 'field' ? entry.subject : undefined,
      debitAccountId: `[runtime] ${entryRef}:debit`,
      creditAccountId: `[runtime] ${entryRef}:credit`,
      auditTrailId: entry.id,
      allowedAction: isPosted ? 'review' : 'view_evidence',
      blockedReason: isBlocked ? (entry.reference_id ?? 'wlt_runtime_blocked') : undefined,
      expectedSource,
      actualSource,
      evidenceSource: isPosted ? 'audit-entry' : 'none',
      varianceReason: varianceMinorUnits !== 0 ? 'WLT runtime لم يؤكد الفعلي بعد' : undefined,
      bankDepositRef: actualSource === 'bank-deposit' ? (entry.reference_id ?? entry.id) : undefined,
      cashBagRef: undefined,
      auditEntryRef: entry.id,
      workflowState: isPosted ? 'approved' : isBlocked ? 'blocked_wlt' : 'prepared',
    };
  });
}

export function buildInitialReconciliationRows(
  runtimeFinance: WltDshFinanceRuntimeResult | null,
): ReadonlyArray<WltDailyReconciliationRow> {
  const rows = buildRuntimeReconciliationRows(runtimeFinance);
  return rows.length > 0 ? rows : [];
}

export function recomputeRowAmountLabels(
  row: WltDailyReconciliationRow,
  updates: Partial<WltDailyReconciliationRow>,
): Partial<WltDailyReconciliationRow> {
  if (updates.actualMinorUnits === undefined && updates.expectedMinorUnits === undefined) {
    return updates;
  }
  const expected = updates.expectedMinorUnits ?? row.expectedMinorUnits;
  const actual = updates.actualMinorUnits ?? row.actualMinorUnits;
  const variance = expected - actual;
  return {
    ...updates,
    varianceMinorUnits: variance,
    expectedLabel: formatWltYer(expected),
    actualLabel: formatWltYer(actual),
    varianceLabel: formatWltYer(variance),
  };
}

export type WltDailyReconciliationTotals = {
  readonly totalExpected: number;
  readonly totalActual: number;
  readonly totalVariance: number;
  readonly totalExpectedLabel: string;
  readonly totalActualLabel: string;
  readonly totalVarianceLabel: string;
};

export function buildReconciliationTotals(
  rows: ReadonlyArray<WltDailyReconciliationRow>,
): WltDailyReconciliationTotals {
  const totalExpected = rows.reduce((s, r) => s + r.expectedMinorUnits, 0);
  const totalActual = rows.reduce((s, r) => s + r.actualMinorUnits, 0);
  const totalVariance = totalExpected - totalActual;
  return {
    totalExpected,
    totalActual,
    totalVariance,
    totalExpectedLabel: formatWltYer(totalExpected),
    totalActualLabel: formatWltYer(totalActual),
    totalVarianceLabel: totalVariance !== 0 ? `${formatWltYer(totalVariance)} ⚠` : '٠ ر.ي ✓',
  };
}
