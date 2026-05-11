export type WltDshPartnerWalletPreview = {
  balanceLabel: string;
  pendingPayoutsLabel: string;
  lastSettlementLabel: string;
};

export type WltDshPartnerBridgeState = {
  wallet: WltDshPartnerWalletPreview;
};
