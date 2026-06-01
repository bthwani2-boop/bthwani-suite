/**
 * WLT DSH Trial Balance — Preview Contract
 *
 * Groups ledger entries by account to verify totalDebit === totalCredit.
 * If they don't match, close gate stays shut.
 * WLT owns all trial balance authority. DSH view only.
 *
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

import type { WltAccountCode } from './chartOfAccounts';
import { getWltAccountByCode } from './chartOfAccounts';

export type WltTrialBalanceLine = {
  readonly accountCode: WltAccountCode;
  readonly accountLabel: string;
  readonly accountType: string;
  readonly debitMinorUnits: number;
  readonly creditMinorUnits: number;
  readonly netMinorUnits: number;
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
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly isPreview: true;
};

type JournalEntryInput = {
  debitAccountCode: WltAccountCode;
  creditAccountCode: WltAccountCode;
  amountMinorUnits: number;
};

export function buildWltTrialBalancePreview(
  businessDate: string,
  journalEntries: ReadonlyArray<JournalEntryInput>,
): WltTrialBalance {
  const accountMap = new Map<WltAccountCode, { debit: number; credit: number }>();

  for (const entry of journalEntries) {
    const debit = accountMap.get(entry.debitAccountCode) ?? { debit: 0, credit: 0 };
    accountMap.set(entry.debitAccountCode, { ...debit, debit: debit.debit + entry.amountMinorUnits });

    const credit = accountMap.get(entry.creditAccountCode) ?? { debit: 0, credit: 0 };
    accountMap.set(entry.creditAccountCode, { ...credit, credit: credit.credit + entry.amountMinorUnits });
  }

  const lines: WltTrialBalanceLine[] = [];
  let totalDebit = 0;
  let totalCredit = 0;

  for (const [code, { debit, credit }] of accountMap) {
    const account = getWltAccountByCode(code);
    totalDebit += debit;
    totalCredit += credit;
    lines.push({
      accountCode: code,
      accountLabel: account?.label ?? `حساب ${code}`,
      accountType: account?.type ?? 'unknown',
      debitMinorUnits: debit,
      creditMinorUnits: credit,
      netMinorUnits: debit - credit,
      isBalanced: debit === credit,
      isPreview: true,
    });
  }

  return {
    businessDate,
    lines: lines.sort((a, b) => a.accountCode.localeCompare(b.accountCode)),
    totalDebitMinorUnits: totalDebit,
    totalCreditMinorUnits: totalCredit,
    isBalanced: totalDebit === totalCredit,
    imbalanceMinorUnits: Math.abs(totalDebit - totalCredit),
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isPreview: true,
  };
}

export const WLT_TRIAL_BALANCE_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  principle: 'totalDebit must equal totalCredit. Any imbalance blocks daily close.',
  isPreview: true,
} as const;
