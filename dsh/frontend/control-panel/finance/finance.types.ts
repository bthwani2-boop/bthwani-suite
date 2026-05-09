export type CanonicalFinanceGroupId =
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'refunds'
  | 'ledger'
  | 'payouts'
  | 'tax-compliance'
  | 'risk-audit';

export type FinancePanelId = 'detail' | 'evidence';

export type FinanceViewState = 'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'disabled';

export interface FinanceGroupMeta {
  id: CanonicalFinanceGroupId;
  label: string;
  description: string;
  badge?: string;
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
