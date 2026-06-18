import type { WltDshFinanceSummaryRecord } from '../boundary/dsh-finance-read-model.types';
import { toControlPanelFinanceSummary } from '../control-panel/control-panel-finance-summary';
import type { WltDshControlPanelFinanceSummary } from '../control-panel/control-panel-finance-summary';
import { resolveKindLabel } from '../formatters/finance-labels';

export type WltDshControlPanelFinanceRow = {
  readonly id: string;
  readonly actor: string;
  readonly kindLabel: string;
  readonly amountLabel: string;
  readonly statusLabel: string;
  readonly timeLabel: string;
  readonly cycleId?: string;
};

export function adaptControlPanelFinanceRecord(record: WltDshFinanceSummaryRecord): WltDshControlPanelFinanceRow {
  return {
    id: record.id,
    actor: record.actor,
    kindLabel: resolveKindLabel(record.kind),
    amountLabel: record.amountLabel,
    statusLabel: record.statusLabel ?? '',
    timeLabel: record.timeLabel,
    cycleId: record.settlementCycleId,
  };
}

export function adaptControlPanelFinanceRecords(
  records: readonly WltDshFinanceSummaryRecord[],
): readonly WltDshControlPanelFinanceRow[] {
  return records.map(adaptControlPanelFinanceRecord);
}

export function adaptControlPanelFinanceSummary(
  records: readonly WltDshFinanceSummaryRecord[],
): WltDshControlPanelFinanceSummary {
  return toControlPanelFinanceSummary(records);
}
