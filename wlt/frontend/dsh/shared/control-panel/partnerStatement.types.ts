import type { WltDshControlPanelPreviewContract } from '../boundary/financeContract.types';

export interface WltDshPartnerStoreLine {
  readonly storeId: string;
  readonly storeName: string;
  readonly grossSalesMinorUnits: number;
  readonly grossSalesLabel: string;
  readonly platformCommissionMinorUnits: number;
  readonly platformCommissionLabel: string;
  readonly deductionsMinorUnits: number;
  readonly deductionsLabel: string;
  readonly netSettlementMinorUnits: number;
  readonly netSettlementLabel: string;
  readonly payoutStatus: 'included' | 'held' | 'paid';
  readonly payoutStatusLabel: string;
  readonly expectedPayoutDate: string;
}

export interface WltDshPartnerStatement {
  readonly partnerId: string;
  readonly partnerName: string;
  readonly settlementCycleId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly expectedPayoutDate: string;
  readonly status: 'draft' | 'ready_for_payout' | 'held' | 'completed';
  readonly statusLabel: string;
  readonly grossSalesMinorUnits: number;
  readonly grossSalesLabel: string;
  readonly platformCommissionMinorUnits: number;
  readonly platformCommissionLabel: string;
  readonly deductionsMinorUnits: number;
  readonly deductionsLabel: string;
  readonly netSettlementMinorUnits: number;
  readonly netSettlementLabel: string;
  readonly paidToDateMinorUnits: number;
  readonly paidToDateLabel: string;
  readonly remainingPayableMinorUnits: number;
  readonly remainingPayableLabel: string;
  readonly storeBreakdown: readonly WltDshPartnerStoreLine[];
  readonly contract: WltDshControlPanelPreviewContract;
}
