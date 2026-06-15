import { formatWltYer } from '../boundary/dshFinance.types';

export type WltRealtimeLedgerDisplayRow = {
  readonly id: string;
  readonly subject: string;
  readonly isCredit: boolean;
  readonly transactionKindLabel: string;
  readonly amountLabel: string;
  readonly referenceId: string;
  readonly createdAtDisplay: string;
  readonly status: string;
};

type RawLedgerEntry = {
  id: string;
  subject: string;
  transaction_type: string;
  amount: number;
  reference_id?: string | null;
  created_at: string;
  status: string;
};

export function mapToRealtimeLedgerDisplayRow(entry: RawLedgerEntry): WltRealtimeLedgerDisplayRow {
  const isCredit = entry.transaction_type === 'CREDIT';
  return {
    id: entry.id,
    subject: entry.subject,
    isCredit,
    transactionKindLabel: isCredit ? 'إيداع / دائن' : 'سحب / مدين',
    amountLabel: formatWltYer(Math.round(entry.amount * 100)),
    referenceId: entry.reference_id ?? '—',
    createdAtDisplay: new Date(entry.created_at).toLocaleString('ar-YE', { hour12: false }),
    status: entry.status,
  };
}

export function extractSortedDisplayRows(
  runtimeFinance: { state: string; data?: { ledgerEntries: ReadonlyArray<RawLedgerEntry> } },
): WltRealtimeLedgerDisplayRow[] {
  if (runtimeFinance.state !== 'runtime' || !runtimeFinance.data) return [];
  return [...runtimeFinance.data.ledgerEntries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(mapToRealtimeLedgerDisplayRow);
}
