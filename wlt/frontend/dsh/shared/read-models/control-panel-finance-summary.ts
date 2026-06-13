import type { WltDshFinanceSummaryRecord } from '../contracts/dsh-finance-read-model.types';

export type WltDshControlPanelFinanceSummary = {
  readonly totalSettlementsYer: number;
  readonly totalRefundsYer: number;
  readonly totalCommissionsYer: number;
  readonly currency: 'YER';
  readonly recordCount: number;
};

export function toControlPanelFinanceSummary(
  records: readonly WltDshFinanceSummaryRecord[],
): WltDshControlPanelFinanceSummary {
  const toYer = (minor: number) => Math.round(minor / 100);
  const totalSettlements = records
    .filter((r) => r.kind === 'partner-settlement')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0);
  const totalRefunds = records
    .filter((r) => r.kind === 'refund-adjustment')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0);
  const totalCommissions = records
    .filter((r) => r.kind === 'platform-commission')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0);

  return {
    totalSettlementsYer: toYer(totalSettlements),
    totalRefundsYer: toYer(totalRefunds),
    totalCommissionsYer: toYer(totalCommissions),
    currency: 'YER',
    recordCount: records.length,
  };
}
