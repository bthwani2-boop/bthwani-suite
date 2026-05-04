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

export type { AnyOperationsWorkspaceId } from './operations.types';

export const OPERATIONS_CANONICAL_GROUPS: readonly OperationsGroupMeta[] = [
  { id: 'command-center', label: 'Command center', description: 'Operational pulse, blockers, and next best action.', badge: 'Hub' },
  { id: 'live-orders', label: 'Live orders', description: 'Orders queue, detail, chat, and fulfillment interventions.', badge: 'Core' },
  { id: 'dispatch-assignment', label: 'Dispatch assignment', description: 'Assignment board, captain coverage, and manual reassignment.', badge: 'Live' },
  { id: 'captain-operations', label: 'Captain operations', description: 'Captain availability, readiness, and coverage pressure.', badge: 'Crew' },
  { id: 'partner-stores', label: 'Partner stores', description: 'Partner store readiness, prep, and intake pressure.', badge: 'Stores' },
  { id: 'area-capacity', label: 'Area capacity', description: 'Capacity pressure, reserved windows, and surge controls.', badge: 'Capacity' },
  { id: 'exceptions-escalations', label: 'Exceptions & escalations', description: 'Exceptions queue, recovery actions, and owner routing.', badge: 'Risk' },
  { id: 'audit-support-sla', label: 'Audit, support & SLA', description: 'Manual action audit, support bridge, and SLA discipline.', badge: 'Proof' },
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
  overview: 'command-center',
  orders: 'live-orders',
  dashboard: 'command-center',
  'dispatch-fleet': 'dispatch-assignment',
  'tracking-handoff': 'live-orders',
  'exceptions-sla': 'exceptions-escalations',
  'partner-readiness': 'partner-stores',
  'audit-evidence': 'audit-support-sla',
  'captain-ops': 'captain-operations',
  'field-ops': 'partner-stores',
  issues: 'exceptions-escalations',
  serviceability: 'area-capacity',
  'guard-status': 'audit-support-sla',
  evidence: 'audit-support-sla',
  'order-detail': 'live-orders',
  orderchat: 'live-orders',
  dispatch: 'dispatch-assignment',
  'live-tracking': 'live-orders',
  exceptions: 'exceptions-escalations',
  sla: 'exceptions-escalations',
  audit: 'audit-support-sla',
  'partner-prep': 'partner-stores',
  handoff: 'live-orders',
  'proof-review': 'live-orders',
  capacity: 'area-capacity',
  sheinproxy: 'dispatch-assignment',
  reassign: 'dispatch-assignment',
  'peak-mode': 'dispatch-assignment',
  bell: 'live-orders',
  'arrival-bell': 'live-orders',
  'zone-set': 'area-capacity',
  'proxy-shein-awnak': 'dispatch-assignment',
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
      group: 'command-center',
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
      group: 'command-center',
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
  group: AnyOperationsWorkspaceId = 'command-center',
  options?: {
    orderId?: string;
    panel?: OperationsPanelId;
  },
) {
  const normalizedLocation = normalizeOperationsLocation(group, options?.panel);
  const searchParams = new URLSearchParams();

  if (normalizedLocation.kind === 'group' && normalizedLocation.group !== 'command-center') {
    searchParams.set('workspace', normalizedLocation.group);
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