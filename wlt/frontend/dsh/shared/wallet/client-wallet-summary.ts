import type { WltWalletSummary } from '../wallet/wallet.types';

export type WltDshClientWalletReadModel = {
  readonly balanceYer: number;
  readonly currency: 'YER';
  readonly isLinked: boolean;
  readonly lastUpdatedAt?: string;
};

export function toClientWalletReadModel(summary: WltWalletSummary): WltDshClientWalletReadModel {
  const rawBalance = typeof summary.balance === 'number' && !isNaN(summary.balance)
    ? summary.balance
    : ((summary as unknown as Record<string, unknown>)['balanceMinorUnits'] as number ?? 0) / 100;

  return {
    balanceYer: Math.round(rawBalance),
    currency: 'YER',
    isLinked: true,
  };
}
