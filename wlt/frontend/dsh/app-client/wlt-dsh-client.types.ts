export type WltDshWalletPreviewState = {
  linked: boolean;
  balance: number | null;
  hydrated: boolean;
  refreshing: boolean;
  lastError: string | null;
};
