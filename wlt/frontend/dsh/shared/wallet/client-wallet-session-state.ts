export type WltDshWalletSessionState = {
  linked: boolean;
  balance: number | null;
  hydrated: boolean;
  refreshing: boolean;
  lastError: string | null;
};
