/**
 * DSH Wallet & Finance Preview Data SSoT Adapter.
 *
 * This file dynamically adapts the central WLT-owned preview data from
 * `wlt/frontend/dsh/control-panel/dshFinancePreview.ts` to DSH's control panel views.
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
} from './dshFinancePreview';

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
  // P3: Typed actor/event fields â€” filters must use these, never string.includes()
  actorType: 'client' | 'partner' | 'captain' | 'field' | 'storeCourier' | 'platform';
  eventKind: WltDshFinanceEventKind | 'unknown';
  // P4: Zero-variance model â€” varianceMinorUnits must be 0 before "closed/matched" display
  expectedMinorUnits: number;
  actualMinorUnits: number;
  varianceMinorUnits: number;
  evidenceStatus: 'missing' | 'partial' | 'complete';
  reconciliationStatus: 'unmatched' | 'matched' | 'disputed' | 'closed';
  // Ownership + contract constants (always WLT / view_only in DSH)
  currencyCode: 'YER';
  ownerService: 'wlt';
  dshRole: 'view_only';
  // Source identifiers (optional â€” from WLT record)
  sourceOrderId?: string;
  sourceStoreId?: string;
  sourceCaptainId?: string;
  sourceFieldAgentId?: string;
  // Ledger identifiers (preview placeholders â€” real values from WLT ledger only)
  debitAccountId?: string;
  creditAccountId?: string;
  auditTrailId?: string;
  // Allowed DSH action for this row â€” never a real mutation
  allowedAction: 'review' | 'view_evidence' | 'prepare_decision' | 'none';
  blockedReason?: string;
  // P9: Independent source tracking â€” expected and actual must come from different sources
  expectedSource: 'order-invoice' | 'settlement-cycle' | 'commission-schedule' | 'eligibility-calc' | 'preview-seed';
  actualSource: 'bank-deposit' | 'wallet-debit' | 'cash-bag-delivery' | 'pos-receipt' | 'preview-seed';
  evidenceSource: 'bank-statement' | 'pos-log' | 'audit-entry' | 'receipt-upload' | 'none';
  varianceReason?: string;
  bankDepositRef?: string;
  cashBagRef?: string;
  ledgerEntryRef?: string;
  // P11: Maker-checker preview workflow state
  workflowState: 'draft' | 'prepared' | 'reviewed' | 'checked' | 'approved' | 'blocked_wlt';
};

export const dshWalletReferencePreviews: readonly DshWalletReferencePreview[] = [
  { id: 'wallet-customer-preview', ownerId: 'customer-360-001', ownerKind: 'customer', label: 'Ù…Ø­ÙØ¸Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„', balanceLabel: 'Ù…Ø±Ø¬Ø¹ WLT ÙÙ‚Ø·', wltOwned: true },
  { id: 'wallet-captain-preview', ownerId: 'captain-preview-001', ownerKind: 'captain', label: 'Ø±ØµÙŠØ¯ Ø§Ù„ÙƒØ§Ø¨ØªÙ†', balanceLabel: 'Ù…Ø±Ø¬Ø¹ WLT ÙÙ‚Ø·', wltOwned: true },
  { id: 'wallet-partner-preview', ownerId: 'store-101', ownerKind: 'partner', label: 'ØªØ³ÙˆÙŠØ© Ø§Ù„Ø´Ø±ÙŠÙƒ', balanceLabel: 'Ù…Ø±Ø¬Ø¹ WLT ÙÙ‚Ø·', wltOwned: true },
];

/**
 * Adapter mapping a WLT preview record to the DSH decision row format.
 */
function mapWltRecordToDshRow(record: WltDshFinancePreviewRecord): DshFinancePreviewRow {
  let risk: 'danger' | 'warning' | 'success' = 'success';
  if (record.statusTone === 'error') risk = 'danger';
  else if (record.statusTone === 'warning') risk = 'warning';

  let nextAction = 'Ø¹Ø±Ø¶ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø­Ø±ÙƒØ© ÙˆØ¯Ø±Ø§Ø³Ø© Ø§Ù„Ø£Ø¯Ù„Ø© Ø§Ù„Ù…ØªØ§Ø­Ø©';
  let primaryActionLabel = 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„ØªÙØ§ØµÙŠÙ„';

  if (record.kind === 'captain-cod-liability') {
    nextAction = 'ØªØ­Ø¶ÙŠØ± Ø·Ù„Ø¨ Ù…Ø·Ø§Ø¨Ù‚Ø© COD â€” WLT ÙŠÙ†ÙØ° Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø¥ÙŠØ¯Ø§Ø¹';
    primaryActionLabel = 'ØªØ­Ø¶ÙŠØ± Ù…Ø·Ø§Ø¨Ù‚Ø©';
  } else if (record.kind === 'refund-adjustment') {
    nextAction = 'Ø¯Ø±Ø§Ø³Ø© Ù…Ø³ØªÙ†Ø¯Ø§Øª Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ ÙˆØ§Ù„Ù†Ø²Ø§Ø¹ â€” WLT ÙŠÙ‚Ø±Ø± Ø§Ù„Ù†ØªÙŠØ¬Ø©';
    primaryActionLabel = 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯';
  } else if (record.kind === 'partner-settlement') {
    nextAction = 'Ø¯Ø±Ø§Ø³Ø© Ø¯ÙˆØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠØ© â€” WLT ÙŠÙ†ÙØ° Ø§Ù„ØªØ­ÙˆÙŠÙ„';
    primaryActionLabel = 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªØ³ÙˆÙŠØ©';
  } else if (record.kind === 'field-commission-pending') {
    nextAction = 'Ø¯Ø±Ø§Ø³Ø© Ù…Ø³ØªÙ†Ø¯Ø§Øª Ø§Ù„Ø§Ø³ØªÙ‚Ø·Ø§Ø¨ ÙˆØ§Ù„ØªÙØ¹ÙŠÙ„ Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” WLT ÙŠØ¹ØªÙ…Ø¯';
    primaryActionLabel = 'ØªØ­Ø¶ÙŠØ± Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª';
  } else if (record.kind === 'reconciliation-export') {
    nextAction = 'Ø¨Ø¯Ø¡ Ù…Ø·Ø§Ø¨Ù‚Ø© Ø¯ÙˆØ±Ø© Ø§Ù„ÙŠÙˆÙ… Ø§Ù„Ù…Ø§Ù„ÙŠ';
    primaryActionLabel = 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø§Ù„ÙŠ';
  }

  // Construct a friendly arabic actor label
  const owner = record.actor === 'captain' && record.sourceCaptainId ? `ÙƒØ§Ø¨ØªÙ† Â· ${record.sourceCaptainId}`
    : record.actor === 'partner' && record.sourceStoreId ? `Ù…ØªØ¬Ø± Â· ${record.sourceStoreId}`
    : record.actor === 'field' && record.sourceFieldAgentId ? `Ù…ÙŠØ¯Ø§Ù†ÙŠ Â· ${record.sourceFieldAgentId}`
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

  const reconciliationStatus = (record.statusTone === 'error'
    ? 'unmatched'
    : record.statusTone === 'warning'
    ? 'disputed'
    : 'matched') as DshFinancePreviewRow['reconciliationStatus'];

  // P4: For preview, expected = record amount; actual = 0 if error (unknown), else same as expected.
  const expectedMinorUnits = record.amountMinorUnits;
  const actualMinorUnits = record.statusTone === 'error' ? 0 : record.amountMinorUnits;
  const varianceMinorUnits = expectedMinorUnits - actualMinorUnits;

  // Allowed DSH action based on event kind â€” DSH never mutates, always view-only
  const allowedAction: DshFinancePreviewRow['allowedAction'] =
    record.kind === 'refund-adjustment' ? 'review'
    : record.kind === 'captain-cod-liability' ? 'view_evidence'
    : record.kind === 'partner-settlement' || record.kind === 'field-payout' ? 'prepare_decision'
    : record.kind === 'reconciliation-export' || record.kind === 'platform-commission' ? 'review'
    : 'none';

  // Preview ledger account placeholders â€” real IDs come from WLT ledger only
  const captainSuffix = record.sourceCaptainId ? `:${record.sourceCaptainId}` : '';
  const storeSuffix = record.sourceStoreId ? `:${record.sourceStoreId}` : '';
  const fieldSuffix = record.sourceFieldAgentId ? `:${record.sourceFieldAgentId}` : '';
  const debitAccountId =
    record.actor === 'captain' ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:captain${captainSuffix}:cod-escrow`
    : record.actor === 'partner' ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:partner${storeSuffix}:settlement`
    : record.actor === 'field' ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:field${fieldSuffix}:commission`
    : `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:platform:fees`;
  const creditAccountId =
    record.actor === 'captain' ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:captain${captainSuffix}:earnings`
    : record.actor === 'partner' ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:partner${storeSuffix}:payout`
    : record.actor === 'field' ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:field${fieldSuffix}:payout`
    : `[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:platform:revenue`;

  const auditTrailId = record.settlementCycleId
    ? `AUD-${record.settlementCycleId}`
    : `AUD-PRV-${record.id}`;

  // P9: Source separation â€” expected from the originating financial event, actual from delivery
  const expectedSource: DshFinancePreviewRow['expectedSource'] =
    record.kind === 'captain-cod-liability' ? 'order-invoice'
    : record.kind === 'partner-settlement' || record.kind === 'field-payout' ? 'settlement-cycle'
    : record.kind === 'field-commission-pending' ? 'commission-schedule'
    : record.kind === 'reconciliation-export' || record.kind === 'platform-commission' ? 'order-invoice'
    : 'preview-seed';

  const actualSource: DshFinancePreviewRow['actualSource'] =
    record.kind === 'captain-cod-liability' ? 'cash-bag-delivery'
    : record.kind === 'partner-settlement' || record.kind === 'field-payout' ? 'bank-deposit'
    : record.kind === 'field-commission-pending' ? 'bank-deposit'
    : record.kind === 'platform-commission' ? 'wallet-debit'
    : 'preview-seed';

  const evidenceSource: DshFinancePreviewRow['evidenceSource'] =
    record.statusTone === 'error' ? 'none'
    : record.kind === 'captain-cod-liability' ? 'pos-log'
    : record.kind === 'partner-settlement' ? 'bank-statement'
    : record.kind === 'field-commission-pending' ? 'receipt-upload'
    : record.kind === 'reconciliation-export' ? 'audit-entry'
    : 'audit-entry';

  const varianceReason: string | undefined =
    varianceMinorUnits !== 0 ? (record.holdReason || 'ÙØ§Ø±Ù‚ ØºÙŠØ± Ù…Ø¨Ø±Ø± â€” ÙŠØ¬Ø¨ Ù…Ø±Ø§Ø¬Ø¹Ø© Ù…ØµØ¯Ø± Ø§Ù„ÙØ¹Ù„ÙŠ')
    : undefined;

  // Preview deposit/cash refs â€” placeholders only
  const bankDepositRef = actualSource === 'bank-deposit'
    ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] DEP-${record.id}`
    : undefined;
  const cashBagRef = actualSource === 'cash-bag-delivery'
    ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] BAG-${record.id}`
    : undefined;
  const ledgerEntryRef = record.settlementCycleId
    ? `[Ù…Ø¹Ø§ÙŠÙ†Ø©] LED-${record.settlementCycleId}`
    : `[Ù…Ø¹Ø§ÙŠÙ†Ø©] LED-PRV-${record.id}`;

  // P11: Maker-checker preview workflow â€” in preview all rows start as 'draft'
  const workflowState: DshFinancePreviewRow['workflowState'] =
    record.statusTone === 'error' ? 'blocked_wlt'
    : reconciliationStatus === 'closed' ? 'approved'
    : reconciliationStatus === 'matched' && evidenceStatus === 'complete' ? 'reviewed'
    : allowedAction === 'prepare_decision' ? 'draft'
    : 'draft';

  return {
    id: record.id,
    amount: record.amountLabel,
    owner,
    status: record.statusLabel,
    risk,
    evidence: record.subtitle,
    nextAction,
    recommendation: record.holdReason || 'ØªÙˆØµÙŠØ© Ø¨Ù…Ø·Ø§Ø¨Ù‚Ø© Ø§Ù„Ø­Ø±ÙƒØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø³Ø¬Ù„Ø§Øª WLT Ø§Ù„Ù…Ø±Ø¬Ø¹ÙŠØ© ÙˆØ§Ù„Ø§Ù„ØªØ²Ø§Ù… Ø¨Ø§Ù„Ø§ØªÙØ§Ù‚ Ø§Ù„Ù…Ø§Ù„ÙŠ.',
    primaryActionLabel,
    secondaryActionLabel: 'ÙØªØ­ Ø§Ù„Ø£Ø¯Ù„Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ©',
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
    expectedSource,
    actualSource,
    evidenceSource,
    varianceReason,
    bankDepositRef,
    cashBagRef,
    ledgerEntryRef,
    workflowState,
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

  // P6: Captain Eligibility Row from WLT snapshot â€” clearly marked [Ù…Ø¹Ø§ÙŠÙ†Ø©] fixture, not a real captain record.
  const celEligible = capSnap.isEligible;
  captainEligibilityRows.push({
    id: 'CEL-401',
    amount: capSnap.eligibilityBalanceLabel,
    owner: '[Ù…Ø¹Ø§ÙŠÙ†Ø©] ÙƒØ§Ø¨ØªÙ† Â· CAP-77',
    status: celEligible ? 'Ù…Ø¤Ù‡Ù„' : 'ØºÙŠØ± Ù…Ø¤Ù‡Ù„',
    risk: celEligible ? 'success' : 'warning',
    evidence: capSnap.eligibilityBlockReason,
    nextAction: 'ÙØ­Øµ Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø¶Ø§Ù…Ù† ÙˆØ§Ù„Ø´Ø­Ù† Ù„Ù„ØªØ£Ù‡Ù„',
    recommendation: capSnap.eligibilityBlockReason,
    primaryActionLabel: 'Ù…Ø­Ø§ÙƒØ§Ø© Ø´Ø­Ù† Ø§Ù„Ø±ØµÙŠØ¯',
    secondaryActionLabel: 'ÙØªØ­ Ù…Ù„Ù Ø§Ù„ÙƒØ§Ø¨ØªÙ†',
    sla: 'Ø®Ù„Ø§Ù„ Ù¢Ù¤ Ø³Ø§Ø¹Ø©',
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
    debitAccountId: '[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:captain:CAP-77:eligibility-reserve',
    creditAccountId: '[Ù…Ø¹Ø§ÙŠÙ†Ø©] wlt:captain:CAP-77:eligibility-balance',
    auditTrailId: 'AUD-PRV-CEL-401',
    allowedAction: celEligible ? 'view_evidence' : 'prepare_decision',
    blockedReason: celEligible ? undefined : capSnap.eligibilityBlockReason,
    expectedSource: 'eligibility-calc',
    actualSource: 'wallet-debit',
    evidenceSource: celEligible ? 'audit-entry' : 'none',
    varianceReason: celEligible ? undefined : capSnap.eligibilityBlockReason,
    ledgerEntryRef: '[Ù…Ø¹Ø§ÙŠÙ†Ø©] LED-PRV-CEL-401',
    workflowState: celEligible ? 'reviewed' : 'draft',
  });

  const emptyOverviewFallback: DshFinancePreviewRow = {
    id: 'FIN-EMPTY-1', amount: 'Ù  Ø±.ÙŠ', owner: '[Ù…Ø¹Ø§ÙŠÙ†Ø©] Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø©', status: 'Ù„Ø§ ÙÙˆØ§Ø±Ù‚ Ù…Ø¹Ø§ÙŠÙ†Ø©',
    risk: 'success', evidence: 'Ù„Ø§ ØªÙˆØ¬Ø¯ ÙÙˆØ§Ø±Ù‚ Ù…Ø§Ù„ÙŠØ© ÙÙŠ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©', nextAction: 'Ù…Ø±Ø§Ù‚Ø¨Ø© Ù…Ø³ØªÙ…Ø±Ø©',
    recommendation: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø¥Ø¶Ø§ÙÙŠØ© Ù…Ø·Ù„ÙˆØ¨Ø© ÙÙŠ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø©',
    primaryActionLabel: 'Ù…Ø¹Ø§ÙŠÙ†Ø©', secondaryActionLabel: 'ÙØªØ­ Ø§Ù„Ø³Ø¬Ù„', sla: 'Ù…Ø¨Ø§Ø´Ø±',
    actorType: 'platform', eventKind: 'reconciliation-export',
    expectedMinorUnits: 0, actualMinorUnits: 0, varianceMinorUnits: 0,
    evidenceStatus: 'complete', reconciliationStatus: 'closed',
    currencyCode: 'YER', ownerService: 'wlt', dshRole: 'view_only',
    allowedAction: 'none', auditTrailId: 'AUD-PRV-EMPTY',
    expectedSource: 'preview-seed', actualSource: 'preview-seed', evidenceSource: 'audit-entry',
    ledgerEntryRef: '[Ù…Ø¹Ø§ÙŠÙ†Ø©] LED-PRV-EMPTY',
    workflowState: 'approved',
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
