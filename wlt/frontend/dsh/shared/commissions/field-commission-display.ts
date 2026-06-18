import type { WltDshFieldCommissionStatement, WltDshFieldCommissionStoreLine } from '../contracts';
import { formatWltYer } from '../boundary/dshFinance.types';

export type WltFieldStatementDisplayAmounts = {
  readonly totalCommissionLabel: string;
  readonly paidLabel: string;
  readonly remainingLabel: string;
  readonly heldLabel: string;
};

export type WltFieldStoreLineDisplayAmounts = {
  readonly qualifiedOrderValueLabel: string;
  readonly commissionLabel: string;
  readonly paidLabel: string;
  readonly remainingLabel: string;
  readonly inspectorQualifiedOrderValueLabel: string;
};

export function buildFieldStatementDisplayAmounts(
  statement: WltDshFieldCommissionStatement,
): WltFieldStatementDisplayAmounts {
  return {
    totalCommissionLabel: formatWltYer(statement.totalCommissionMinorUnits),
    paidLabel: formatWltYer(statement.paidMinorUnits),
    remainingLabel: formatWltYer(statement.remainingMinorUnits),
    heldLabel: formatWltYer(statement.heldMinorUnits),
  };
}

export function buildFieldStoreLineDisplayAmounts(
  line: WltDshFieldCommissionStoreLine,
): WltFieldStoreLineDisplayAmounts {
  return {
    qualifiedOrderValueLabel: formatWltYer(line.qualifiedOrderValueMinorUnits),
    commissionLabel: formatWltYer(line.commissionMinorUnits),
    paidLabel: formatWltYer(line.paidMinorUnits),
    remainingLabel: formatWltYer(line.remainingMinorUnits),
    inspectorQualifiedOrderValueLabel: formatWltYer(line.qualifiedOrderValueMinorUnits),
  };
}
