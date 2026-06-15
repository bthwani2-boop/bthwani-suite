/**
 * WLT DSH Trial Balance — types only.
 * Builder in selectors/buildTrialBalance.ts.
 * totalDebit must equal totalCredit. Any imbalance blocks daily close.
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

import type { WltAccountCode } from '../ledger/chartOfAccounts.types';

export type WltTrialBalanceLine = {
  readonly accountCode: WltAccountCode;
  readonly accountLabel: string;
  readonly accountType: string;
  readonly debitMinorUnits: number;
  readonly creditMinorUnits: number;
  readonly netMinorUnits: number;
  readonly debitLabel: string;
  readonly creditLabel: string;
  readonly netLabel: string;
  readonly isBalanced: boolean;
  readonly isPreview: true;
};

export type WltTrialBalance = {
  readonly businessDate: string;
  readonly lines: ReadonlyArray<WltTrialBalanceLine>;
  readonly totalDebitMinorUnits: number;
  readonly totalCreditMinorUnits: number;
  readonly isBalanced: boolean;
  readonly imbalanceMinorUnits: number;
  readonly totalDebitLabel: string;
  readonly totalCreditLabel: string;
  readonly imbalanceLabel: string;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly isPreview: true;
};
