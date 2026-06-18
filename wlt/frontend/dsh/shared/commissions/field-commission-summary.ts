import type { WltDshFinanceSummaryRecord } from '../boundary/dsh-finance-read-model.types';

export type WltDshFieldCommissionReadModel = {
  readonly fieldAgentId: string;
  readonly totalPendingYer: number;
  readonly totalApprovedYer: number;
  readonly currency: 'YER';
  readonly records: readonly WltDshFinanceSummaryRecord[];
};

export function toFieldCommissionReadModel(
  fieldAgentId: string,
  records: readonly WltDshFinanceSummaryRecord[],
): WltDshFieldCommissionReadModel {
  const fieldRecords = records.filter(
    (r) => r.kind === 'field-commission' || r.kind === 'field-commission-pending' || r.kind === 'field-payout',
  );
  const totalPending = fieldRecords
    .filter((r) => r.kind === 'field-commission-pending')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0) / 100;
  const totalApproved = fieldRecords
    .filter((r) => r.kind === 'field-commission')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0) / 100;

  return {
    fieldAgentId,
    totalPendingYer: Math.round(totalPending),
    totalApprovedYer: Math.round(totalApproved),
    currency: 'YER',
    records: fieldRecords,
  };
}
