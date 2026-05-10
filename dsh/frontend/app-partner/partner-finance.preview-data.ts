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
