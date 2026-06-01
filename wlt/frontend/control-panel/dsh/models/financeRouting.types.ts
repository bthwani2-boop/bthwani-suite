export type FinanceCanonicalWorkspaceId =
  | 'financial-center'
  | 'account-statements'
  | 'store-settlements'
  | 'settlement-calendar'
  | 'refund-ledger'
  | 'cod-cash'
  | 'settlements-payouts'
  | 'ledger'
  | 'daily-close';

export type FinanceLegacyWorkspaceAlias =
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'captain-eligibility'
  | 'payouts'
  | 'tax-compliance'
  | 'risk-audit'
  | 'captain-finance'
  | 'store-delivery-finance'
  | 'refunds'
  | 'variances';

export type FinanceWorkspaceInput =
  | FinanceCanonicalWorkspaceId
  | FinanceLegacyWorkspaceAlias;

export type CanonicalFinanceGroupId = FinanceCanonicalWorkspaceId;

export type FinancePanelId = 'detail' | 'evidence';

export type FinanceViewState = 'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'disabled' | 'blocked';

export interface FinanceGroupMeta {
  id: CanonicalFinanceGroupId;
  label: string;
  description: string;
  badge?: string;
  subGroups?: readonly { id: string; label: string }[];
}

export type FinanceNormalizationResult =
  { kind: 'group'; group: CanonicalFinanceGroupId; sourceWorkspace?: string; panel?: FinancePanelId };
