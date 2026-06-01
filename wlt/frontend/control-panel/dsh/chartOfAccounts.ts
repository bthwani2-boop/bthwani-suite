/**
 * WLT DSH Chart of Accounts — Preview Contract
 *
 * Structure-only. No hardcoded rates, no real balances.
 * WLT owns all financial truth. DSH reads and displays only.
 * Every LedgerEntry debitAccountCode/creditAccountCode must reference an account here.
 *
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

export type WltAccountType = 'asset' | 'liability' | 'revenue' | 'expense' | 'clearing' | 'equity';

export type WltAccountClass =
  | 'cash'
  | 'bank-clearing'
  | 'wallet-liability'
  | 'receivable'
  | 'payable'
  | 'revenue'
  | 'commission'
  | 'expense'
  | 'settlement-clearing'
  | 'control';

export type WltAccountCode = string;

export type WltSubledgerId =
  | 'cod-captain-subledger'
  | 'partner-settlement-subledger'
  | 'refund-liability-subledger'
  | 'wallet-liability-subledger'
  | 'captain-payable-subledger'
  | 'field-commission-subledger'
  | 'store-courier-subledger'
  | 'platform-revenue-subledger';

export type WltAccount = {
  readonly code: WltAccountCode;
  readonly label: string;
  readonly labelEn: string;
  readonly type: WltAccountType;
  readonly class: WltAccountClass;
  readonly isControlAccount: boolean;
  readonly linkedSubledger?: WltSubledgerId;
  readonly isPreview: true;
};

export const WLT_CHART_OF_ACCOUNTS: readonly WltAccount[] = [
  // ─── Assets ───────────────────────────────────────────────────────
  {
    code: '1001',
    label: 'النقدية بالصندوق',
    labelEn: 'Cash on Hand',
    type: 'asset',
    class: 'cash',
    isControlAccount: false,
    isPreview: true,
  },
  {
    code: '1010',
    label: 'رصيد المقاصة البنكية',
    labelEn: 'Bank Clearing',
    type: 'asset',
    class: 'bank-clearing',
    isControlAccount: true,
    isPreview: true,
  },
  {
    code: '1020',
    label: 'ذمم COD مستحقة (كابتن)',
    labelEn: 'COD Receivable — Captain',
    type: 'asset',
    class: 'receivable',
    isControlAccount: true,
    linkedSubledger: 'cod-captain-subledger',
    isPreview: true,
  },
  {
    code: '1030',
    label: 'مقاصة التسوية',
    labelEn: 'Settlement Clearing',
    type: 'asset',
    class: 'settlement-clearing',
    isControlAccount: true,
    linkedSubledger: 'partner-settlement-subledger',
    isPreview: true,
  },

  // ─── Liabilities ──────────────────────────────────────────────────
  {
    code: '2001',
    label: 'رصيد محفظة العميل (التزام)',
    labelEn: 'Client Wallet Liability',
    type: 'liability',
    class: 'wallet-liability',
    isControlAccount: true,
    linkedSubledger: 'wallet-liability-subledger',
    isPreview: true,
  },
  {
    code: '2010',
    label: 'مستحقات الكابتن',
    labelEn: 'Captain Payable',
    type: 'liability',
    class: 'payable',
    isControlAccount: true,
    linkedSubledger: 'captain-payable-subledger',
    isPreview: true,
  },
  {
    code: '2020',
    label: 'مستحقات الشريك',
    labelEn: 'Partner Payable',
    type: 'liability',
    class: 'payable',
    isControlAccount: true,
    linkedSubledger: 'partner-settlement-subledger',
    isPreview: true,
  },
  {
    code: '2030',
    label: 'مستحقات الميداني',
    labelEn: 'Field Agent Payable',
    type: 'liability',
    class: 'payable',
    isControlAccount: true,
    linkedSubledger: 'field-commission-subledger',
    isPreview: true,
  },
  {
    code: '2040',
    label: 'مستحقات موصل المتجر',
    labelEn: 'Store Courier Payable',
    type: 'liability',
    class: 'payable',
    isControlAccount: true,
    linkedSubledger: 'store-courier-subledger',
    isPreview: true,
  },
  {
    code: '2050',
    label: 'التزام الاسترداد للعميل',
    labelEn: 'Refund Liability',
    type: 'liability',
    class: 'payable',
    isControlAccount: true,
    linkedSubledger: 'refund-liability-subledger',
    isPreview: true,
  },

  // ─── Revenue ──────────────────────────────────────────────────────
  {
    code: '4001',
    label: 'إيرادات عمولة المنصة',
    labelEn: 'Platform Commission Revenue',
    type: 'revenue',
    class: 'commission',
    isControlAccount: false,
    linkedSubledger: 'platform-revenue-subledger',
    isPreview: true,
  },
  {
    code: '4010',
    label: 'إيرادات رسوم التوصيل',
    labelEn: 'Delivery Fee Revenue',
    type: 'revenue',
    class: 'revenue',
    isControlAccount: false,
    isPreview: true,
  },

  // ─── Expenses ─────────────────────────────────────────────────────
  {
    code: '5001',
    label: 'مصروف الاسترداد',
    labelEn: 'Refund Expense',
    type: 'expense',
    class: 'expense',
    isControlAccount: false,
    isPreview: true,
  },
  {
    code: '5010',
    label: 'مصروف الترويج والخصومات',
    labelEn: 'Promotion/Discount Expense',
    type: 'expense',
    class: 'expense',
    isControlAccount: false,
    isPreview: true,
  },
] as const;

export function getWltAccountByCode(code: WltAccountCode): WltAccount | undefined {
  return WLT_CHART_OF_ACCOUNTS.find((a) => a.code === code);
}

export function getWltControlAccounts(): readonly WltAccount[] {
  return WLT_CHART_OF_ACCOUNTS.filter((a) => a.isControlAccount);
}

export function getWltAccountsByType(type: WltAccountType): readonly WltAccount[] {
  return WLT_CHART_OF_ACCOUNTS.filter((a) => a.type === type);
}

export const WLT_CHART_OF_ACCOUNTS_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  isPreview: true,
} as const;
