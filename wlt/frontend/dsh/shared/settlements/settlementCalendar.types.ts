import type { WltDshControlPanelPreviewContract } from '../boundary/financeContract.types';

export type WltDshSettlementCalendarCycle = {
  readonly cycleId: string;
  readonly ownerKind: 'store' | 'captain' | 'field_agent' | 'store_courier';
  readonly ownerLabel: string;
  readonly frequency: 'biweekly' | 'weekly' | 'monthly';
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly cutoffDate: string;
  readonly expectedPayoutDate: string;
  readonly actualPayoutDate?: string;
  readonly status: 'open_preview' | 'cutoff_locked' | 'wlt_review' | 'paid_preview' | 'held';
  readonly includedOrderCount: number;
  readonly excludedOrderCount: number;
  readonly netPayableMinorUnits: number;
  readonly netPayableLabel: string;
  readonly holdAmountMinorUnits: number;
  readonly holdAmountLabel: string;
  readonly releasePolicy: string;
  readonly contract: WltDshControlPanelPreviewContract;
};
