import type {
  WltDshFinancePreviewRecord,
  WltPartnerFinanceSnapshot,
} from '../../shared/finance/dshFinancePreview';

export type WltDshPartnerWalletPreview = {
  balanceLabel: string;
  pendingPayoutsLabel: string;
  lastSettlementLabel: string;
};

export type WltDshPartnerFinancePreviewState = {
  snapshot: WltPartnerFinanceSnapshot;
  settlementRecords: readonly WltDshFinancePreviewRecord[];
};

export type WltDshPartnerBridgeState = {
  wallet: WltDshPartnerWalletPreview;
  finance: WltDshPartnerFinancePreviewState;
};
