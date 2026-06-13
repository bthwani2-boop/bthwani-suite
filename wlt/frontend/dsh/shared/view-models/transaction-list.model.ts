import type { WltDshPartnerWalletTransaction } from '../adapters/partner-finance.adapter';

export type WltDshTransactionListViewModel = {
  readonly items: readonly WltDshPartnerWalletTransaction[];
  readonly totalCount: number;
  readonly hasMore: boolean;
  readonly isLoading: boolean;
  readonly errorMessage?: string;
};

export function buildTransactionListViewModel(
  items: readonly WltDshPartnerWalletTransaction[],
  totalCount: number,
  opts: { isLoading?: boolean; error?: string } = {},
): WltDshTransactionListViewModel {
  return {
    items,
    totalCount,
    hasMore: items.length < totalCount,
    isLoading: opts.isLoading ?? false,
    errorMessage: opts.error,
  };
}
