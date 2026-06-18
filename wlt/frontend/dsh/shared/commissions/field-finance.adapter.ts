import type { WltDshFinanceSummaryRecord } from '../boundary/dsh-finance-read-model.types';

export type WltDshFieldCommissionRow = {
  readonly id: string;
  readonly statusLabel: string;
  readonly amountLabel: string;
  readonly storeId?: string;
  readonly timeLabel: string;
  readonly isPending: boolean;
};

export function adaptFieldCommissionRecord(record: WltDshFinanceSummaryRecord): WltDshFieldCommissionRow {
  const isPending = record.kind === 'field-commission-pending';
  return {
    id: record.id,
    statusLabel: isPending ? 'معلقة' : record.kind === 'field-commission-rejected' ? 'مرفوضة' : 'مقبولة',
    amountLabel: record.amountLabel,
    storeId: record.sourceStoreId,
    timeLabel: record.timeLabel,
    isPending,
  };
}

export function adaptFieldCommissionRecords(
  records: readonly WltDshFinanceSummaryRecord[],
): readonly WltDshFieldCommissionRow[] {
  return records
    .filter((r) =>
      r.kind === 'field-commission' ||
      r.kind === 'field-commission-pending' ||
      r.kind === 'field-commission-rejected' ||
      r.kind === 'field-payout',
    )
    .map(adaptFieldCommissionRecord);
}
