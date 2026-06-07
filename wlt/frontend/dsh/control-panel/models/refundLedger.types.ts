import type { WltDshControlPanelPreviewContract } from './financeContract.types';

export type WltDshRefundLedgerCase = {
  readonly refundCaseId: string;
  readonly orderId: string;
  readonly customerId: string;
  readonly storeId: string;
  readonly originalAmountMinorUnits: number;
  readonly originalAmountLabel: string;
  readonly approvedAmountMinorUnits: number;
  readonly approvedAmountLabel: string;
  readonly rejectedAmountMinorUnits: number;
  readonly rejectedAmountLabel: string;
  readonly reason: string;
  readonly evidence: readonly string[];
  readonly status: 'pending_wlt_review' | 'approved_preview' | 'rejected_preview' | 'disputed';
  readonly ledgerImpact: string;
  readonly walletImpact: string;
  readonly settlementImpact: string;
  readonly contract: WltDshControlPanelPreviewContract;
};
