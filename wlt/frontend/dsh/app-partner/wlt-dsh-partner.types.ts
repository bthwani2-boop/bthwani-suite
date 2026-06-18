import type {
  WltDshFinanceSummaryRecord,
  WltPartnerFinanceSnapshot,
} from '../shared';

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
