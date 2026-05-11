// UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
export const dshPartnerFinancePreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export type DshPartnerFinanceMode = 'pickup' | 'store_delivery' | 'platform_delivery';

export type DshPartnerSettlementSummary = {
  id: string;
  title: string;
  amountLabel: string;
  statusLabel: string;
  dateLabel: string;
};

export type DshPartnerCommissionSummary = {
  mode: DshPartnerFinanceMode;
  rateLabel: string;
  notesLabel: string;
};

export type DshPartnerFinanceBridgeState = {
  partnerBalanceLabel: string;
  pendingPayoutsLabel: string;
  lastSettlementLabel: string;
  financeNoteLabel: string;
};
