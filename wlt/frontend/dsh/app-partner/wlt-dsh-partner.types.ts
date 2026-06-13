import type {
  WltDshFinanceSummaryRecord,
  WltPartnerFinanceSnapshot,
} from '../control-panel/financeContracts';

export type WltDshPartnerWalletPreview = {
  balanceLabel: string;
  pendingPayoutsLabel: string;
  lastSettlementLabel: string;
};

export type WltDshPartnerFinancePreviewState = {
  snapshot: WltPartnerFinanceSnapshot;
  settlementRecords: readonly WltDshFinanceSummaryRecord[];
};

export type WltDshPartnerBridgeState = {
  wallet: WltDshPartnerWalletPreview;
  finance: WltDshPartnerFinancePreviewState;
};
