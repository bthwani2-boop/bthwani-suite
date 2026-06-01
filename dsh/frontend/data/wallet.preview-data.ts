/**
 * DSH Wallet & Finance Preview Data SSoT Adapter.
 *
 * This file dynamically adapts the central WLT-owned preview data from
 * `wlt/frontend/shared/finance/dshFinancePreview.ts` to DSH's control panel views.
 *
 * DSH has no independent financial truth.
 */

import {
  getWltControlPanelFinancePreview,
  getWltCaptainFinanceSnapshot,
  getWltDshStoreDeliveryFinancePreview,
  getWltFieldFinancePreview,
  type WltDshFinancePreviewRecord,
  type WltDshFinanceEventKind,
} from '../../../wlt/frontend/shared/finance/dshFinancePreview';

export const dshWalletPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'WLT-owned read-only preview reference',
} as const;

export type DshWalletReferencePreview = {
  id: string;
  ownerId: string;
  ownerKind: 'customer' | 'partner' | 'captain';
  label: string;
  balanceLabel: string;
  wltOwned: true;
};

export type DshFinancePreviewSurface =
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'refunds'
  | 'captain-eligibility'
  | 'payouts'
  | 'ledger'
  | 'risk-audit'
  | 'captain-finance'
  | 'store-delivery-finance';

export type DshFinancePreviewRow = {
  id: string;
  amount: string;
  owner: string;
  status: string;
  risk: 'danger' | 'warning' | 'success';
  evidence: string;
  nextAction: string;
  recommendation: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  sla: string;
  // P3: Typed actor/event fields — filters must use these, never string.includes()
  actorType: 'client' | 'partner' | 'captain' | 'field' | 'storeCourier' | 'platform';
  eventKind: WltDshFinanceEventKind | 'unknown';
  // P4: Zero-variance model — varianceMinorUnits must be 0 before "closed/matched" display
  expectedMinorUnits: number;
  actualMinorUnits: number;
  varianceMinorUnits: number;
  evidenceStatus: 'missing' | 'partial' | 'complete';
  reconciliationStatus: 'unmatched' | 'matched' | 'disputed' | 'closed';
  // Ownership + contract constants (always WLT / view_only in DSH)
  currencyCode: 'YER';
  ownerService: 'wlt';
  dshRole: 'view_only';
  // Source identifiers (optional — from WLT record)
  sourceOrderId?: string;
  sourceStoreId?: string;
  sourceCaptainId?: string;
  sourceFieldAgentId?: string;
  // Ledger identifiers (preview placeholders — real values from WLT ledger only)
  debitAccountId?: string;
  creditAccountId?: string;
  auditTrailId?: string;
  // Allowed DSH action for this row — never a real mutation
  allowedAction: 'review' | 'view_evidence' | 'prepare_decision' | 'none';
  blockedReason?: string;
};

export const dshWalletReferencePreviews: readonly DshWalletReferencePreview[] = [
  { id: 'wallet-customer-preview', ownerId: 'customer-360-001', ownerKind: 'customer', label: 'محفظة العميل', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-captain-preview', ownerId: 'captain-preview-001', ownerKind: 'captain', label: 'رصيد الكابتن', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-partner-preview', ownerId: 'store-101', ownerKind: 'partner', label: 'تسوية الشريك', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
];

/**
 * Adapter mapping a WLT preview record to the DSH decision row format.
 */
function mapWltRecordToDshRow(record: WltDshFinancePreviewRecord): DshFinancePreviewRow {
  let risk: 'danger' | 'warning' | 'success' = 'success';
  if (record.statusTone === 'error') risk = 'danger';
  else if (record.statusTone === 'warning') risk = 'warning';

  let nextAction = 'عرض تفاصيل الحركة ودراسة الأدلة المتاحة';
  let primaryActionLabel = 'معاينة التفاصيل';

  if (record.kind === 'captain-cod-liability') {
    nextAction = 'تأكيد إيداع COD في البنك والمطابقة';
    primaryActionLabel = 'مطابقة الإيداع';
  } else if (record.kind === 'refund-adjustment') {
    nextAction = 'مراجعة مستندات الاسترداد والنزاع';
    primaryActionLabel = 'معاينة الاسترداد';
  } else if (record.kind === 'partner-settlement') {
    nextAction = 'مراجعة دورة التسوية وتحويل المستحقات';
    primaryActionLabel = 'مراجعة التسوية';
  } else if (record.kind === 'field-commission-pending') {
    nextAction = 'مراجعة مستندات الاستقطاب والتفعيل الميداني';
    primaryActionLabel = 'اعتماد العمولات';
  } else if (record.kind === 'reconciliation-export') {
    nextAction = 'بدء مطابقة دورة اليوم المالي';
    primaryActionLabel = 'معاينة السجل المالي';
  }

  // Construct a friendly arabic actor label
  const owner = record.actor === 'captain' && record.sourceCaptainId ? `كابتن · ${record.sourceCaptainId}`
    : record.actor === 'partner' && record.sourceStoreId ? `متجر · ${record.sourceStoreId}`
    : record.actor === 'field' && record.sourceFieldAgentId ? `ميداني · ${record.sourceFieldAgentId}`
    : record.title;

  // P3: Typed actor type
  const actorType: DshFinancePreviewRow['actorType'] =
    record.actor === 'captain' ? 'captain'
    : record.actor === 'partner' ? 'partner'
    : record.actor === 'field' ? 'field'
    : record.actor === 'client' ? 'client'
    : 'platform';

  // P3: Evidence and reconciliation status from WLT record tone
  const evidenceStatus: DshFinancePreviewRow['evidenceStatus'] =
    record.statusTone === 'error' ? 'missing'
    : record.holdReason ? 'partial'
    : 'complete';

  const reconciliationStatus: DshFinancePreviewRow['reconciliationStatus'] =
    record.statusTone === 'error' ? 'unmatched'
    : record.statusTone === 'warning' ? 'disputed'
    : 'matched';

  // P4: For preview, expected = record amount; actual = 0 if error (unknown), else same as expected.
  const expectedMinorUnits = record.amountMinorUnits;
  const actualMinorUnits = record.statusTone === 'error' ? 0 : record.amountMinorUnits;
  const varianceMinorUnits = expectedMinorUnits - actualMinorUnits;

  // Allowed DSH action based on event kind — DSH never mutates, always view-only
  const allowedAction: DshFinancePreviewRow['allowedAction'] =
    record.kind === 'refund-adjustment' ? 'review'
    : record.kind === 'captain-cod-liability' ? 'view_evidence'
    : record.kind === 'partner-settlement' || record.kind === 'field-payout' ? 'prepare_decision'
    : record.kind === 'reconciliation-export' || record.kind === 'platform-commission' ? 'review'
    : 'none';

  // Preview ledger account placeholders — real IDs come from WLT ledger only
  const captainSuffix = record.sourceCaptainId ? `:${record.sourceCaptainId}` : '';
  const storeSuffix = record.sourceStoreId ? `:${record.sourceStoreId}` : '';
  const fieldSuffix = record.sourceFieldAgentId ? `:${record.sourceFieldAgentId}` : '';
  const debitAccountId =
    record.actor === 'captain' ? `[معاينة] wlt:captain${captainSuffix}:cod-escrow`
    : record.actor === 'partner' ? `[معاينة] wlt:partner${storeSuffix}:settlement`
    : record.actor === 'field' ? `[معاينة] wlt:field${fieldSuffix}:commission`
    : `[معاينة] wlt:platform:fees`;
  const creditAccountId =
    record.actor === 'captain' ? `[معاينة] wlt:captain${captainSuffix}:earnings`
    : record.actor === 'partner' ? `[معاينة] wlt:partner${storeSuffix}:payout`
    : record.actor === 'field' ? `[معاينة] wlt:field${fieldSuffix}:payout`
    : `[معاينة] wlt:platform:revenue`;

  const auditTrailId = record.settlementCycleId
    ? `AUD-${record.settlementCycleId}`
    : `AUD-PRV-${record.id}`;

  return {
    id: record.id,
    amount: record.amountLabel,
    owner,
    status: record.statusLabel,
    risk,
    evidence: record.subtitle,
    nextAction,
    recommendation: record.holdReason || 'توصية بمطابقة الحركة الحالية بناءً على سجلات WLT المرجعية والالتزام بالاتفاق المالي.',
    primaryActionLabel,
    secondaryActionLabel: 'فتح الأدلة المالية',
    sla: record.timeLabel,
    actorType,
    eventKind: record.kind,
    expectedMinorUnits,
    actualMinorUnits,
    varianceMinorUnits,
    evidenceStatus,
    reconciliationStatus,
    currencyCode: 'YER',
    ownerService: 'wlt',
    dshRole: 'view_only',
    sourceOrderId: record.sourceOrderId,
    sourceStoreId: record.sourceStoreId,
    sourceCaptainId: record.sourceCaptainId,
    sourceFieldAgentId: record.sourceFieldAgentId,
    debitAccountId,
    creditAccountId,
    auditTrailId,
    allowedAction,
    blockedReason: record.holdReason,
  };
}

/**
 * Dynamically build the rows for each control panel surface from WLT seeds.
 */
let cachedRows: Record<DshFinancePreviewSurface, ReadonlyArray<DshFinancePreviewRow>> | null = null;

/**
 * Dynamically build the rows for each control panel surface from WLT seeds.
 */
export function getAdaptedFinanceControlPanelRows(): Record<DshFinancePreviewSurface, ReadonlyArray<DshFinancePreviewRow>> {
  if (cachedRows) {
    return cachedRows;
  }

  const wltPreview = getWltControlPanelFinancePreview();
  const capSnap = getWltCaptainFinanceSnapshot();
  const fieldPreview = getWltFieldFinancePreview();

  const overviewRows: DshFinancePreviewRow[] = [];
  const settlementsRows: DshFinancePreviewRow[] = [];
  const codReconciliationRows: DshFinancePreviewRow[] = [];
  const refundsRows: DshFinancePreviewRow[] = [];
  const captainEligibilityRows: DshFinancePreviewRow[] = [];
  const payoutsRows: DshFinancePreviewRow[] = [];
  const ledgerRows: DshFinancePreviewRow[] = [];
  const riskAuditRows: DshFinancePreviewRow[] = [];
  const captainFinanceRows: DshFinancePreviewRow[] = [];
  const storeDeliveryFinanceRows: DshFinancePreviewRow[] = [];

  // Map each of allRecords
  wltPreview.allRecords.forEach((record) => {
    const row = mapWltRecordToDshRow(record);

    // 1. Overview: Platform and critical/warning items
    if (record.actor === 'control-panel' || record.statusTone === 'error' || record.statusTone === 'warning') {
      overviewRows.push(row);
    }

    // 2. Settlements
    if (record.kind === 'partner-settlement' || record.kind === 'field-payout') {
      settlementsRows.push(row);
    }

    // 3. COD Reconciliation
    if (record.kind === 'captain-cod-liability') {
      codReconciliationRows.push(row);
    }

    // 4. Refunds
    if (record.kind === 'refund-adjustment') {
      refundsRows.push(row);
    }

    // 5. Payouts
    if (record.kind === 'field-payout' || record.kind === 'partner-settlement') {
      payoutsRows.push(row);
    }

    // 6. Ledger
    if (record.kind === 'platform-commission' || record.kind === 'reconciliation-export') {
      ledgerRows.push(row);
    }

    // 7. Risk Audit
    if (record.statusTone === 'error' || record.statusTone === 'warning' || record.holdReason) {
      riskAuditRows.push(row);
    }

    // 8. Captain Finance
    if (record.actor === 'captain') {
      captainFinanceRows.push(row);
    }

    // 9. Store Delivery Finance
    if (record.kind === 'store-delivery-fee' || record.kind === 'store-courier-compensation') {
      storeDeliveryFinanceRows.push(row);
    }
  });

  // P6: Captain Eligibility Row from WLT snapshot — clearly marked [معاينة] fixture, not a real captain record.
  const celEligible = capSnap.isEligible;
  captainEligibilityRows.push({
    id: 'CEL-401',
    amount: capSnap.eligibilityBalanceLabel,
    owner: '[معاينة] كابتن · CAP-77',
    status: celEligible ? 'مؤهل' : 'غير مؤهل',
    risk: celEligible ? 'success' : 'warning',
    evidence: capSnap.eligibilityBlockReason,
    nextAction: 'فحص الرصيد الضامن والشحن للتأهل',
    recommendation: capSnap.eligibilityBlockReason,
    primaryActionLabel: 'محاكاة شحن الرصيد',
    secondaryActionLabel: 'فتح ملف الكابتن',
    sla: 'خلال ٢٤ ساعة',
    actorType: 'captain',
    eventKind: 'captain-eligibility-topup',
    expectedMinorUnits: capSnap.minimumEligibilityMinorUnits,
    actualMinorUnits: celEligible ? capSnap.minimumEligibilityMinorUnits : capSnap.eligibilityBalanceMinorUnits,
    varianceMinorUnits: celEligible ? 0 : capSnap.eligibilityShortfallMinorUnits,
    evidenceStatus: celEligible ? 'complete' : 'partial',
    reconciliationStatus: celEligible ? 'matched' : 'unmatched',
    currencyCode: 'YER',
    ownerService: 'wlt',
    dshRole: 'view_only',
    sourceCaptainId: 'CAP-77',
    debitAccountId: '[معاينة] wlt:captain:CAP-77:eligibility-reserve',
    creditAccountId: '[معاينة] wlt:captain:CAP-77:eligibility-balance',
    auditTrailId: 'AUD-PRV-CEL-401',
    allowedAction: celEligible ? 'view_evidence' : 'prepare_decision',
    blockedReason: celEligible ? undefined : capSnap.eligibilityBlockReason,
  });

  const emptyOverviewFallback: DshFinancePreviewRow = {
    id: 'FIN-EMPTY-1', amount: '٠ ر.ي', owner: '[معاينة] نظرة عامة', status: 'لا فوارق معاينة',
    risk: 'success', evidence: 'لا توجد فوارق مالية في بيانات المعاينة الحالية', nextAction: 'مراقبة مستمرة',
    recommendation: 'لا توجد إجراءات إضافية مطلوبة في بيانات المعاينة',
    primaryActionLabel: 'معاينة', secondaryActionLabel: 'فتح السجل', sla: 'مباشر',
    actorType: 'platform', eventKind: 'reconciliation-export',
    expectedMinorUnits: 0, actualMinorUnits: 0, varianceMinorUnits: 0,
    evidenceStatus: 'complete', reconciliationStatus: 'closed',
    currencyCode: 'YER', ownerService: 'wlt', dshRole: 'view_only',
    allowedAction: 'none', auditTrailId: 'AUD-PRV-EMPTY',
  };

  cachedRows = {
    overview: overviewRows.length > 0 ? overviewRows : [emptyOverviewFallback],
    settlements: settlementsRows,
    'cod-reconciliation': codReconciliationRows,
    refunds: refundsRows,
    'captain-eligibility': captainEligibilityRows,
    payouts: payoutsRows,
    ledger: ledgerRows,
    'risk-audit': riskAuditRows,
    'captain-finance': captainFinanceRows,
    'store-delivery-finance': storeDeliveryFinanceRows,
  };

  return cachedRows!;
}

export const dshFinanceControlPanelPreviewRows = {
  get overview() { return getAdaptedFinanceControlPanelRows().overview; },
  get settlements() { return getAdaptedFinanceControlPanelRows().settlements; },
  get 'cod-reconciliation'() { return getAdaptedFinanceControlPanelRows()['cod-reconciliation']; },
  get refunds() { return getAdaptedFinanceControlPanelRows().refunds; },
  get 'captain-eligibility'() { return getAdaptedFinanceControlPanelRows()['captain-eligibility']; },
  get payouts() { return getAdaptedFinanceControlPanelRows().payouts; },
  get ledger() { return getAdaptedFinanceControlPanelRows().ledger; },
  get 'risk-audit'() { return getAdaptedFinanceControlPanelRows()['risk-audit']; },
  get 'captain-finance'() { return getAdaptedFinanceControlPanelRows()['captain-finance']; },
  get 'store-delivery-finance'() { return getAdaptedFinanceControlPanelRows()['store-delivery-finance']; },
} as unknown as Record<DshFinancePreviewSurface, ReadonlyArray<DshFinancePreviewRow>>;
