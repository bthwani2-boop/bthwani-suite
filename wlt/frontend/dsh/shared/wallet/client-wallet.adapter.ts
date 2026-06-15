import type { WltWalletSummary, WltLedgerEntry } from '../wallet/wallet.types';
import { toClientWalletReadModel } from '../wallet/client-wallet-summary';
import type { WltDshClientWalletReadModel } from '../wallet/client-wallet-summary';

export type WltDshClientWalletLedgerRow = {
  readonly id: string;
  readonly typeLabel: string;
  readonly amountYer: number;
  readonly amountLabel: string;
  readonly direction: 'credit' | 'debit';
  readonly description: string;
  readonly createdAt: string;
  readonly referenceId?: string;
};

export function adaptClientWalletSummary(summary: WltWalletSummary): WltDshClientWalletReadModel {
  return toClientWalletReadModel(summary);
}

export function adaptClientLedgerEntry(entry: WltLedgerEntry): WltDshClientWalletLedgerRow {
  const amountYer = Math.round(entry.amount);
  return {
    id: entry.id,
    typeLabel: entry.transaction_type === 'CREDIT' ? 'إيداع' : 'خصم',
    amountYer,
    amountLabel: `${amountYer.toLocaleString('ar-YE')} ر.ي`,
    direction: entry.transaction_type === 'CREDIT' ? 'credit' : 'debit',
    description: entry.description,
    createdAt: entry.created_at,
    referenceId: entry.reference_id,
  };
}

export function adaptClientLedgerEntries(
  entries: readonly WltLedgerEntry[],
): readonly WltDshClientWalletLedgerRow[] {
  return entries.map(adaptClientLedgerEntry);
}
