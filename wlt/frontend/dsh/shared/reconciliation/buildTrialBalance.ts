import type { WltAccountCode } from '../ledger/chartOfAccounts.types';
import { getWltAccountByCode } from '../ledger/chartOfAccounts.types';
import type { WltTrialBalanceLine, WltTrialBalance } from '../reconciliation/trialBalance.types';
import { formatWltYer } from '../boundary/dshFinance.types';

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
    const net = debit - credit;
    lines.push({
      accountCode: code,
      accountLabel: account?.label ?? `حساب ${code}`,
      accountType: account?.type ?? 'unknown',
      debitMinorUnits: debit,
      creditMinorUnits: credit,
      netMinorUnits: net,
      debitLabel: debit > 0 ? formatWltYer(debit) : '—',
      creditLabel: credit > 0 ? formatWltYer(credit) : '—',
      netLabel: formatWltYer(net),
      isBalanced: debit === credit,
      isPreview: true,
    });
  }

  const imbalance = Math.abs(totalDebit - totalCredit);
  const sorted = [...lines].sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  return {
    businessDate,
    lines: sorted,
    totalDebitMinorUnits: totalDebit,
    totalCreditMinorUnits: totalCredit,
    isBalanced: totalDebit === totalCredit,
    imbalanceMinorUnits: imbalance,
    totalDebitLabel: formatWltYer(totalDebit),
    totalCreditLabel: formatWltYer(totalCredit),
    imbalanceLabel: formatWltYer(imbalance),
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
