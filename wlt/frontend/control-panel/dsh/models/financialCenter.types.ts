export type WltLedgerEntryKind =
  | 'cod-collection'
  | 'client-payment'
  | 'partner-settlement'
  | 'captain-earning'
  | 'field-commission'
  | 'store-fee'
  | 'platform-commission'
  | 'refund'
  | 'wallet-movement'
  | 'other';

export type WltLedgerEntryStatus = 'posted' | 'pending' | 'disputed' | 'blocked';

export type WltLedgerEntry = {
  readonly id: string;
  readonly debitAccountCode: string;
  readonly debitAccountLabel: string;
  readonly creditAccountCode: string;
  readonly creditAccountLabel: string;
  readonly amountMinorUnits: number;
  readonly amountLabel: string;
  readonly entryKind: WltLedgerEntryKind;
  readonly party: string;
  readonly partyKind: 'client' | 'captain' | 'partner' | 'field' | 'platform';
  readonly sourceRef: string;
  readonly statusLabel: string;
  readonly status: WltLedgerEntryStatus;
  readonly isPending: boolean;
  readonly needsReconciliation: boolean;
  readonly isPreview: true;
};

export type WltAccountPositionLine = {
  readonly accountCode: string;
  readonly accountLabel: string;
  readonly accountType: 'asset' | 'liability' | 'revenue' | 'expense';
  readonly totalMinorUnits: number;
  readonly totalLabel: string;
  readonly entryCount: number;
  readonly pendingCount: number;
  readonly entries: readonly WltLedgerEntry[];
  readonly isPreview: true;
};

export type WltFinancialCenterSection = {
  readonly sectionType: 'asset' | 'liability' | 'revenue' | 'expense';
  readonly sectionLabel: string;
  readonly totalMinorUnits: number;
  readonly totalLabel: string;
  readonly lines: readonly WltAccountPositionLine[];
};

export type WltFinancialCenterBlockingVariance = {
  readonly entryId: string;
  readonly description: string;
  readonly varianceMinorUnits: number;
  readonly varianceLabel: string;
  readonly partyKind: string;
  readonly reason: string;
};

export type WltFinancialCenter = {
  readonly businessDate: string;
  readonly sections: readonly WltFinancialCenterSection[];
  readonly allEntries: readonly WltLedgerEntry[];
  readonly totalAssets: number;
  readonly totalAssetsLabel: string;
  readonly totalLiabilities: number;
  readonly totalLiabilitiesLabel: string;
  readonly totalRevenue: number;
  readonly totalRevenueLabel: string;
  readonly totalExpenses: number;
  readonly totalExpensesLabel: string;
  readonly netPosition: number;
  readonly netPositionLabel: string;
  readonly blockingVariances: readonly WltFinancialCenterBlockingVariance[];
  readonly canClose: boolean;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly openingBalanceSource: 'none — no real ledger in preview';
  readonly closingBalanceSource: 'none — no real ledger in preview';
  readonly isPreview: true;
};
