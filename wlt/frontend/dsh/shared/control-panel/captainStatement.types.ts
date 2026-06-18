import type { WltDshControlPanelPreviewContract } from '../boundary/financeContract.types';

export interface WltDshCaptainCodBag {
  readonly bagId: string;
  readonly orderId: string;
  readonly date: string;
  readonly amountMinorUnits: number;
  readonly amountLabel: string;
  readonly status: 'unsubmitted' | 'pending_wlt_clearance' | 'cleared';
  readonly statusLabel: string;
  readonly evidenceRef: string;
  readonly notes: string;
}

export interface WltDshCaptainEarningLine {
  readonly earningId: string;
  readonly orderId: string;
  readonly date: string;
  readonly deliveryFeeMinorUnits: number;
  readonly deliveryFeeLabel: string;
  readonly bonusMinorUnits: number;
  readonly bonusLabel: string;
  readonly platformFeeMinorUnits: number;
  readonly platformFeeLabel: string;
  readonly netMinorUnits: number;
  readonly netLabel: string;
  readonly status: 'included' | 'withheld_payout' | 'paid';
  readonly statusLabel: string;
  readonly payoutDate: string;
  readonly evidenceRef: string;
}

export interface WltDshCaptainStatement {
  readonly captainId: string;
  readonly captainName: string;
  readonly status: 'active' | 'blocked' | 'pending_clearance';
  readonly statusLabel: string;
  readonly eligibilityBalanceMinorUnits: number;
  readonly eligibilityBalanceLabel: string;
  readonly minimumEligibilityMinorUnits: number;
  readonly minimumEligibilityLabel: string;
  readonly isEligible: boolean;
  readonly eligibilityShortfallMinorUnits: number;
  readonly eligibilityShortfallLabel: string;
  readonly hasEligibilityBlock: boolean;
  readonly eligibilityBlockReason: string;
  readonly grossEarningsMinorUnits: number;
  readonly grossEarningsLabel: string;
  readonly paidToDateMinorUnits: number;
  readonly paidToDateLabel: string;
  readonly outstandingCodLiabilityMinorUnits: number;
  readonly outstandingCodLiabilityLabel: string;
  readonly netPayableMinorUnits: number;
  readonly netPayableLabel: string;
  readonly codBags: readonly WltDshCaptainCodBag[];
  readonly earnings: readonly WltDshCaptainEarningLine[];
  readonly contract: WltDshControlPanelPreviewContract;
}
