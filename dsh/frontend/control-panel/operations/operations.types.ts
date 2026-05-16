export type OperationsPanelId = 'detail' | 'chat';

export type CanonicalOperationsGroupId =
  | 'command-center'
  | 'live-orders'
  | 'dispatch-assignment'
  | 'geo-heatmap'
  | 'sheinproxy'
  // 'proxy-shein-awnak' is a LEGACY alias — canonical is 'awnak-operations'
  | 'awnak-operations'
  | 'captain-operations'
  | 'partner-stores'
  | 'area-capacity'
  | 'exceptions-escalations'
  | 'audit-support-sla';

export type LegacyOperationsWorkspaceId =
  | 'overview'
  | 'orders'
  | 'dashboard'
  | 'dispatch-fleet'
  | 'tracking-handoff'
  | 'exceptions-sla'
  | 'partner-readiness'
  | 'proxy-shein-awnak' // legacy alias → awnak-operations
  | 'audit-evidence'
  | 'captain-ops'
  | 'field-ops'
  | 'issues'
  | 'serviceability'
  | 'guard-status'
  | 'evidence'
  | 'order-detail'
  | 'orderchat'
  | 'dispatch'
  | 'live-tracking'
  | 'exceptions'
  | 'sla'
  | 'audit'
  | 'partner-prep'
  | 'handoff'
  | 'proof-review'
  | 'capacity'
  | 'partners'
  | 'catalogs'
  | 'catalog-categories'
  | 'marketing'
  | 'banners'
  | 'growth'
  | 'loyalty'
  | 'smart-signal'
  | 'sheinproxy'
  | 'reassign'
  | 'peak-mode'
  | 'bell'
  | 'arrival-bell'
  | 'zone-set'
  | 'live-map-capacity'
  | 'geo-heatmap'
  | 'live-tracking'
  | 'handoff'
  | 'proof-review'
  | 'capacity'
  | 'dispatch'
  | 'exceptions'
  | 'sla'
  | 'audit';

export type LegacySectionRedirectId =
  | 'finance'
  | 'settlements'
  | 'cod'
  | 'refunds'
  | 'catalogs'
  | 'catalog-categories'
  | 'marketing'
  | 'banners'
  | 'growth'
  | 'loyalty'
  | 'smart-signal'
  | 'partners';

export type AnyOperationsWorkspaceId = CanonicalOperationsGroupId | LegacyOperationsWorkspaceId | LegacySectionRedirectId | 'orders' | 'overview';

export type NonOperationsSectionRootId = 'finance' | 'catalogs' | 'marketing' | 'partners';

export type OperationsSubGroupMeta = {
  id: string;
  label: string;
};

export type OperationsTertiaryFilterId = 'الآن' | '١٥ دقيقة' | '٣٠ دقيقة' | 'خطر عالٍ' | 'نقص كباتن' | 'ضغط متاجر';

export type OperationsGroupMeta = {
  id: CanonicalOperationsGroupId;
  label: string;
  description: string;
  badge: string;
  subGroups?: readonly OperationsSubGroupMeta[];
  tertiaryFilters?: readonly OperationsTertiaryFilterId[];
};

export type OperationsNormalizationResult =
  | {
      kind: 'group';
      group: CanonicalOperationsGroupId;
      sourceWorkspace?: AnyOperationsWorkspaceId;
      panel?: OperationsPanelId;
    }
  | {
      kind: 'redirect';
      sourceWorkspace: AnyOperationsWorkspaceId;
      section: NonOperationsSectionRootId;
      href: `/${NonOperationsSectionRootId}`;
    };

export type OperationsViewState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type StateViewCopy = {
  stateId?: 'loading' | 'empty' | 'offline' | 'recoverableError';
  kind?: 'warning';
  title: string;
  description: string;
  actionLabel: string;
};
