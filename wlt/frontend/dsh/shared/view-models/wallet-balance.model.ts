export type WltDshWalletBalanceViewModel = {
  readonly balanceLabel: string;
  readonly balanceYer: number;
  readonly isLoading: boolean;
  readonly isLinked: boolean;
  readonly errorMessage?: string;
};

export function buildWalletBalanceViewModel(
  balanceYer: number,
  opts: { isLoading?: boolean; isLinked?: boolean; error?: string } = {},
): WltDshWalletBalanceViewModel {
  return {
    balanceYer,
    balanceLabel: `${balanceYer.toLocaleString('ar-YE')} ر.ي`,
    isLoading: opts.isLoading ?? false,
    isLinked: opts.isLinked ?? true,
    errorMessage: opts.error,
  };
}
