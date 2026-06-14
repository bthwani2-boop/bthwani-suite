import type { WltDshControlPanelPreviewContract } from './financeContract.types';

export type WltDshAccountStatementActor =
  | 'store'
  | 'captain'
  | 'store_courier'
  | 'field_agent'
  | 'customer_wallet'
  | 'platform';

export type WltDshAccountStatementLine = {
  readonly lineId: string;
  readonly date: string;
  readonly sourceType: 'order' | 'settlement' | 'refund' | 'payout' | 'commission' | 'wallet' | 'adjustment';
  readonly sourceId: string;
  readonly description: string;
  readonly debitMinorUnits: number;
  readonly debitLabel: string;
  readonly creditMinorUnits: number;
  readonly creditLabel: string;
  readonly runningBalanceMinorUnits: number;
  readonly runningBalanceLabel: string;
  readonly status: 'posted_preview' | 'pending_wlt' | 'held' | 'disputed';
  readonly evidenceRef: string;
};

export type WltDshAccountStatement = {
  readonly statementId: string;
  readonly actor: WltDshAccountStatementActor;
  readonly actorLabel: string;
  readonly actorId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly openingBalanceMinorUnits: number;
  readonly openingBalanceLabel: string;
  readonly periodDebitMinorUnits: number;
  readonly periodDebitLabel: string;
  readonly periodCreditMinorUnits: number;
  readonly periodCreditLabel: string;
  readonly adjustmentsMinorUnits: number;
  readonly adjustmentsLabel: string;
  readonly holdsMinorUnits: number;
  readonly holdsLabel: string;
  readonly releasesMinorUnits: number;
  readonly releasesLabel: string;
  readonly refundsMinorUnits: number;
  readonly refundsLabel: string;
  readonly payoutsMinorUnits: number;
  readonly payoutsLabel: string;
  readonly closingBalanceMinorUnits: number;
  readonly closingBalanceLabel: string;
  readonly lines: readonly WltDshAccountStatementLine[];
  readonly contract: WltDshControlPanelPreviewContract;
};
