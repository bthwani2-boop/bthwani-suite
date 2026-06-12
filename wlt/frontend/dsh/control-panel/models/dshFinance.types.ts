/**
 * WLT DSH Finance — pure type definitions + formatWltYer.
 * No preview data. No functions that touch PREVIEW_SEEDS.
 * Imported by WLT selectors and models that need event kinds and record shapes.
 * PREVIEW_ONLY — not runtime, not accounting truth.
 */

export type WltDshFinanceActor = 'client' | 'partner' | 'captain' | 'field' | 'control-panel';

export type WltDshFinanceEventKind =
  | 'client-payment'
  | 'wallet-payment'
  | 'cash-on-delivery'
  | 'partner-settlement'
  | 'store-delivery-fee'
  | 'store-courier-compensation'
  | 'captain-earning'
  | 'captain-cod-liability'
  | 'captain-eligibility-topup'
  | 'field-commission'
  | 'field-commission-pending'
  | 'field-commission-rejected'
  | 'field-payout'
  | 'refund-adjustment'
  | 'platform-commission'
  | 'reconciliation-export';

export type WltDshFinanceTone = 'positive' | 'negative' | 'neutral';
export type WltDshFinanceStatusTone = 'success' | 'warning' | 'info' | 'error';
export type WltDshFinanceBindingState = 'preview_only' | 'contract_tbd' | 'runtime_unbound';

export type WltDshFinanceOwnership = {
  readonly ledger: 'wlt';
  readonly payment: 'wlt';
  readonly settlement: 'wlt';
  readonly refund: 'wlt';
  readonly payout: 'wlt';
  readonly commission: 'wlt';
  readonly deliveryContext: 'dsh';
};

export const WLT_DSH_FINANCE_OWNERSHIP = {
  ledger: 'wlt',
  payment: 'wlt',
  settlement: 'wlt',
  refund: 'wlt',
  payout: 'wlt',
  commission: 'wlt',
  deliveryContext: 'dsh',
} as const satisfies WltDshFinanceOwnership;

export interface WltDshFinancePreviewRecord {
  id: string;
  actor: WltDshFinanceActor;
  kind: WltDshFinanceEventKind;
  currencyCode: string;
  amountMinorUnits: number;
  amountLabel: string;
  tone: WltDshFinanceTone;
  title: string;
  subtitle: string;
  statusLabel: string;
  statusTone: WltDshFinanceStatusTone;
  timeLabel: string;
  sourceOrderId?: string;
  sourceStoreId?: string;
  sourceCaptainId?: string;
  sourceFieldAgentId?: string;
  settlementCycleId?: string;
  holdReason?: string;
  isPreview: boolean;
}

export type WltDshFinancePreviewMetadata = {
  readonly dataKind: 'preview';
  readonly runtimeTruth: 'none — runtime_unbound';
  readonly backendSource: 'none — preview_seeds_only';
  readonly bindingSource: 'wlt_frontend_shared_finance';
  readonly moneySemantics: 'display_only — no_accounting_effect';
  readonly ownerKind: 'wlt';
  readonly serviceId: 'wlt';
  readonly linkedServiceId: 'dsh';
  readonly currencyCode: 'YER';
  readonly isPreview: true;
};

export function getWltDshFinancePreviewMetadata(): WltDshFinancePreviewMetadata {
  return {
    dataKind: 'preview',
    runtimeTruth: 'none — runtime_unbound',
    backendSource: 'none — preview_seeds_only',
    bindingSource: 'wlt_frontend_shared_finance',
    moneySemantics: 'display_only — no_accounting_effect',
    ownerKind: 'wlt',
    serviceId: 'wlt',
    linkedServiceId: 'dsh',
    currencyCode: 'YER',
    isPreview: true,
  };
}

// ─── Snapshot types (shapes returned by preview builders) ──────────

export type WltCaptainFinanceSection = 'eligibility' | 'cod-liability' | 'earnings' | 'settlement';

export type WltCaptainFinanceSnapshot = {
  codLiabilityMinorUnits: number;
  codLiabilityLabel: string;
  earningsMinorUnits: number;
  earningsLabel: string;
  settlementMinorUnits: number;
  settlementLabel: string;
  pendingPayoutMinorUnits: number;
  pendingPayoutLabel: string;
  cycleLabel: string;
  eligibilityBalanceMinorUnits: number;
  eligibilityBalanceLabel: string;
  minimumEligibilityMinorUnits: number;
  minimumEligibilityLabel: string;
  isEligible: boolean;
  eligibilityShortfallMinorUnits: number;
  eligibilityShortfallLabel: string;
  hasEligibilityBlock: boolean;
  eligibilityBlockReason: string;
  contractState: 'CONTRACT_TBD';
  isPreview: boolean;
};

export type WltPartnerFinanceSnapshot = {
  settlementRecords: WltDshFinancePreviewRecord[];
  grossSalesMinorUnits: number;
  grossSalesLabel: string;
  platformCommissionMinorUnits: number;
  platformCommissionLabel: string;
  deductionsMinorUnits: number;
  deductionsLabel: string;
  netSettlementMinorUnits: number;
  netSettlementLabel: string;
  nextSettlementMinorUnits: number;
  nextSettlementLabel: string;
  totalLabel: string;
  cycleStatus: string;
  cycleStartDate: string;
  cycleEndDate: string;
  nextPayoutDate: string;
  contractState: 'CONTRACT_TBD';
  dataKind: 'preview';
  runtimeTruth: 'none — runtime_unbound';
  backendSource: 'none — preview_seeds_only';
  bindingSource: 'wlt_frontend_shared_finance';
  moneySemantics: 'display_only — no_accounting_effect';
  sourceLabel: string;
  warnings: readonly string[];
  isPreview: boolean;
};

export type WltFieldFinanceSnapshot = {
  records: WltDshFinancePreviewRecord[];
  commissionRecords: WltDshFinancePreviewRecord[];
  pendingRecords: WltDshFinancePreviewRecord[];
  rejectedRecords: WltDshFinancePreviewRecord[];
  payoutRecords: WltDshFinancePreviewRecord[];
  totalCommissionMinorUnits: number;
  totalCommissionLabel: string;
  pendingCommissionsMinorUnits: number;
  pendingCommissionsLabel: string;
  rejectedCommissionsMinorUnits: number;
  rejectedCommissionsLabel: string;
  eligibleFilesCount: number;
  lastPayoutMinorUnits: number;
  lastPayoutLabel: string;
  lastPayoutDate: string;
  nextPayoutDate: string;
  contractState: 'CONTRACT_TBD';
  isPreview: boolean;
};

// ─── Payment types ─────────────────────────────────────────────────

export type WltDshPaymentMethod = 'cod' | 'wallet' | 'mixed' | 'official-wallets';

export type WltDshPaymentOptionPreview = {
  id: WltDshPaymentMethod;
  titleLabel: string;
  descriptionLabel: string;
  availabilityLabel: string;
  availabilityTone: WltDshFinanceStatusTone;
  isAvailable: boolean;
  isPreview: true;
};

export type WltDshPaymentPreviewState = {
  method: WltDshPaymentMethod;
  orderTotalMinorUnits: number;
  walletBalanceMinorUnits: number;
  walletLinked: boolean;
  walletAmountMinorUnits: number;
  amountDueOnDeliveryMinorUnits: number;
  valid: boolean;
  summaryLabel: string;
  blockingLabel?: string;
  feedbackTone: WltDshFinanceStatusTone;
  financeEventKind: WltDshFinanceEventKind;
  contractState: 'LIVE' | 'CONTRACT_TBD';
  isPreview: true;
};

// ─── Fulfillment + commission types ───────────────────────────────

export type WltDshFulfillmentMode = 'bthwani_delivery' | 'partner_delivery' | 'pickup';

export type WltDshOrderLineItemApplicability =
  | { applies: true; label: string }
  | { applies: false; reason: string };

export type WltDshOrderCommissionBreakdown = {
  fulfillmentMode: WltDshFulfillmentMode;
  fulfillmentModeLabel: string;
  deliveryFee: WltDshOrderLineItemApplicability;
  platformCommission: WltDshOrderLineItemApplicability;
  captainPayout: WltDshOrderLineItemApplicability;
  partnerCourierCost: WltDshOrderLineItemApplicability;
  partnerNet: WltDshOrderLineItemApplicability;
  commissionRatePreview: string;
  isPreview: true;
};

export type WltDshPartnerModeRatePreview = {
  partnerId: string;
  storeLabel: string;
  rates: Readonly<Record<WltDshFulfillmentMode, string>>;
  isPreview: true;
};

// ─── Currency formatter (used by WLT selectors) ────────────────────

export function formatWltYer(minorUnits: number): string {
  const major = Math.abs(minorUnits) / 100;
  try {
    return `${major.toLocaleString('ar-YE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ر.ي`;
  } catch {
    return `${major.toLocaleString('ar', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ر.ي`;
  }
}

export function resolveWltDshFinanceEventKindForPaymentMethod(
  method: 'cod' | 'wallet' | 'mixed' | 'official-wallets',
): WltDshFinanceEventKind {
  if (method === 'cod') return 'cash-on-delivery';
  if (method === 'wallet' || method === 'mixed' || method === 'official-wallets') return 'wallet-payment';
  return 'client-payment';
}
