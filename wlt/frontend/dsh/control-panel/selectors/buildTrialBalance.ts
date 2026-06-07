import type { WltAccountCode } from '../models/chartOfAccounts.types';
import { getWltAccountByCode } from '../models/chartOfAccounts.types';
import type { WltTrialBalanceLine, WltTrialBalance } from '../models/trialBalance.types';

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
    const d = accountMap.get(entry.debitAccountCode) ?? { debit: 0, credit: 0 };
    accountMap.set(entry.debitAccountCode, { ...d, debit: d.debit + entry.amountMinorUnits });
    const c = accountMap.get(entry.creditAccountCode) ?? { debit: 0, credit: 0 };
    accountMap.set(entry.creditAccountCode, { ...c, credit: c.credit + entry.amountMinorUnits });
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
