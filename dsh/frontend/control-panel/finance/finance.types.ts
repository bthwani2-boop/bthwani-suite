export type CanonicalFinanceGroupId =
  | 'daily-close'
  | 'variances'
  | 'cod-cash'
  | 'settlements-payouts'
  | 'ledger'
  | 'refunds'
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'captain-eligibility'
  | 'payouts'
  | 'tax-compliance'
  | 'risk-audit'
  | 'captain-finance'
  | 'store-delivery-finance';

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
  | { kind: 'group'; group: CanonicalFinanceGroupId; sourceWorkspace?: string; panel?: FinancePanelId }
  | { kind: 'redirect'; sourceWorkspace: string; section: string; href: string };
