import type {
  AnyOperationsWorkspaceId,
  CanonicalOperationsGroupId,
  LegacyOperationsWorkspaceId,
  LegacySectionRedirectId,
  NonOperationsSectionRootId,
  OperationsGroupMeta,
  OperationsNormalizationResult,
  OperationsPanelId,
} from './operations.types';

export const OPERATIONS_CANONICAL_GROUPS: readonly OperationsGroupMeta[] = [
  { id: 'overview', label: 'Overview', description: 'Operational pulse, blockers, and next best action.', badge: 'Pulse' },
  { id: 'orders', label: 'Orders', description: 'Orders queue with detail and chat panels inside the same lane.', badge: 'Core' },
  { id: 'dispatch-fleet', label: 'Dispatch fleet', description: 'Dispatch board, captains, reassign, capacity, and peak mode.', badge: 'Live' },
  { id: 'tracking-handoff', label: 'Tracking handoff', description: 'Live tracking, bells, handoff verification, and proof review.', badge: 'Flow' },
  { id: 'exceptions-sla', label: 'Exceptions SLA', description: 'Exceptions, issues, serviceability, zone set, and recovery actions.', badge: 'Risk' },
  { id: 'partner-readiness', label: 'Partner readiness', description: 'Partner prep, intake context, field ops, and readiness blockers.', badge: 'Ready' },
  { id: 'proxy-shein-awnak', label: 'Proxy Shein Awnak', description: 'Manual assignment, estimate, offer, schedule, and follow-up.', badge: 'Proxy' },
  { id: 'audit-evidence', label: 'Audit evidence', description: 'Manual action audit, guard status, evidence, and closure matrix.', badge: 'Proof' },
] as const;

export const OPERATIONS_CANONICAL_GROUP_IDS = OPERATIONS_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalOperationsGroupId[];

export const NON_OPERATIONS_SECTION_SHORTCUTS: ReadonlyArray<{
  id: NonOperationsSectionRootId;
  label: string;
  description: string;
  href: `/${NonOperationsSectionRootId}`;
}> = [
  { id: 'finance', label: 'Finance', description: 'Financial truth remains in the finance section.', href: '/finance' },
  { id: 'catalogs', label: 'Catalogs', description: 'Catalog governance remains in the catalogs section.', href: '/catalogs' },
  { id: 'marketing', label: 'Marketing', description: 'Marketing and growth remain in the marketing section.', href: '/marketing' },
  { id: 'partners', label: 'Partners', description: 'Partner management remains in the partners section.', href: '/partners' },
] as const;

const LEGACY_OPERATIONAL_TO_CANONICAL_GROUP: Record<Exclude<LegacyOperationsWorkspaceId, LegacySectionRedirectId> | 'orders' | 'overview', CanonicalOperationsGroupId> = {
  overview: 'overview',
  orders: 'orders',
  dashboard: 'audit-evidence',
  'captain-ops': 'dispatch-fleet',
  'field-ops': 'partner-readiness',
  issues: 'exceptions-sla',
  serviceability: 'exceptions-sla',
  'guard-status': 'audit-evidence',
  evidence: 'audit-evidence',
  'order-detail': 'orders',
  orderchat: 'orders',
  dispatch: 'dispatch-fleet',
  'live-tracking': 'tracking-handoff',
  exceptions: 'exceptions-sla',
  sla: 'exceptions-sla',
  audit: 'audit-evidence',
  'partner-prep': 'partner-readiness',
  handoff: 'tracking-handoff',
  'proof-review': 'tracking-handoff',
  capacity: 'dispatch-fleet',
  sheinproxy: 'proxy-shein-awnak',
  reassign: 'dispatch-fleet',
  'peak-mode': 'dispatch-fleet',
  bell: 'tracking-handoff',
  'arrival-bell': 'tracking-handoff',
  'zone-set': 'exceptions-sla',
};

const LEGACY_SECTION_REDIRECTS: Record<LegacySectionRedirectId, NonOperationsSectionRootId> = {
  finance: 'finance',
  settlements: 'finance',
  cod: 'finance',
  refunds: 'finance',
  catalogs: 'catalogs',
  'catalog-categories': 'catalogs',
  marketing: 'marketing',
  banners: 'marketing',
  growth: 'marketing',
  loyalty: 'marketing',
  'smart-signal': 'marketing',
  partners: 'partners',
};

type LegacyOperationalWorkspaceId = Exclude<LegacyOperationsWorkspaceId, LegacySectionRedirectId>;

export function coerceOperationsPanel(panel?: string): OperationsPanelId | undefined {
  if (panel === 'detail' || panel === 'chat') {
    return panel;
  }

  return undefined;
}

export function normalizeOperationsLocation(
  workspace?: string,
  panel?: string,
): OperationsNormalizationResult {
  const resolvedPanel = coerceOperationsPanel(panel);

  if (!workspace || workspace === 'overview') {
    return {
      kind: 'group',
      group: 'overview',
      sourceWorkspace: workspace as AnyOperationsWorkspaceId | undefined,
      panel: resolvedPanel,
    };
  }

  const directCanonical = OPERATIONS_CANONICAL_GROUP_IDS.find((groupId) => groupId === workspace);
  if (directCanonical) {
    return {
      kind: 'group',
      group: directCanonical,
      sourceWorkspace: directCanonical,
      panel: resolvedPanel,
    };
  }

  if (Object.prototype.hasOwnProperty.call(LEGACY_SECTION_REDIRECTS, workspace)) {
    const section = LEGACY_SECTION_REDIRECTS[workspace as LegacySectionRedirectId];
    return {
      kind: 'redirect',
      sourceWorkspace: workspace as AnyOperationsWorkspaceId,
      section,
      href: `/${section}`,
    };
  }

  const mapped = LEGACY_OPERATIONAL_TO_CANONICAL_GROUP[workspace as LegacyOperationalWorkspaceId | 'orders' | 'overview'];
  if (!mapped) {
    return {
      kind: 'group',
      group: 'overview',
      sourceWorkspace: workspace as AnyOperationsWorkspaceId,
      panel: resolvedPanel,
    };
  }

  const derivedPanel = workspace === 'order-detail'
    ? 'detail'
    : workspace === 'orderchat'
      ? 'chat'
      : resolvedPanel;

  return {
    kind: 'group',
    group: mapped,
    sourceWorkspace: workspace as AnyOperationsWorkspaceId,
    panel: derivedPanel,
  };
}

export function buildOperationsHref(
  group: CanonicalOperationsGroupId = 'overview',
  options?: {
    orderId?: string;
    panel?: OperationsPanelId;
  },
) {
  const searchParams = new URLSearchParams();

  if (group !== 'overview') {
    searchParams.set('workspace', group);
  }

  if (options?.orderId) {
    searchParams.set('orderId', options.orderId);
  }

  if (options?.panel) {
    searchParams.set('panel', options.panel);
  }

  const query = searchParams.toString();
  return query ? `/operations?${query}` : '/operations';
}

export function getOperationsGroupMeta(groupId: CanonicalOperationsGroupId) {
  return OPERATIONS_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? OPERATIONS_CANONICAL_GROUPS[0];
}