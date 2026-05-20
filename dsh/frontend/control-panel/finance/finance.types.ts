export type CanonicalFinanceGroupId =
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'captain-eligibility'
  | 'refunds'
  | 'ledger'
  | 'payouts'
  | 'tax-compliance'
  | 'risk-audit'
  | 'captain-finance'
  | 'store-delivery-finance';

export type FinancePanelId = 'detail' | 'evidence';

export type FinanceViewState = 'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'disabled';

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

export interface StateViewCopy {
  stateId: string;
  title: string;
  description: string;
  actionLabel: string;
  kind?: 'warning' | 'danger';
}
