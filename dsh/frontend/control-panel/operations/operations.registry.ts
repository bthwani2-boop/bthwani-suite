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
  { id: 'command-center', label: 'غرفة القيادة', description: 'نبض العمليات، المعوقات، وأفضل إجراء تالي.', badge: 'Hub' },
  { id: 'live-orders', label: 'الطلبات الحية', description: 'قائمة الطلبات، التفاصيل، الدردشة، وتدخلات التنفيذ.', badge: 'Core' },
  { id: 'dispatch-assignment', label: 'الإسناد والتوزيع', description: 'لوحة الإسناد، تغطية الكباتن، وإعادة الإسناد اليدوي.', badge: 'Live' },
  { id: 'sheinproxy', label: 'شي إن', description: 'مسار الإسناد اليدوي لطلبات شي إن والدفعات المرتبطة بها.', badge: 'Manual' },
  { id: 'proxy-shein-awnak', label: 'عونك', description: 'مسار عونك التشغيلي للدفعات اليدوية ومتابعة الطلبات.', badge: 'Manual' },
  { id: 'captain-operations', label: 'تشغيل الكباتن', description: 'توافر الكباتن، الجاهزية، وضغط التغطية.', badge: 'Crew' },
  { id: 'partner-stores', label: 'المتاجر والشركاء', description: 'جاهزية المتاجر، التحضير، وضغط الاستلام.', badge: 'Stores' },
  { id: 'area-capacity', label: 'المناطق والسعة', description: 'ضغط السعة، النوافذ المحجوزة، والتحكم في الطفرات.', badge: 'Capacity' },
  { id: 'exceptions-escalations', label: 'الاستثناءات والتصعيد', description: 'قائمة الاستثناءات، إجراءات التعافي، وتوجيه المالك.', badge: 'Risk' },
  { id: 'audit-support-sla', label: 'التدقيق والدعم وSLA', description: 'تدقيق الإجراءات اليدوية، جسر الدعم، وانضباط SLA.', badge: 'Proof' },
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
  'proxy-shein-awnak': 'proxy-shein-awnak',
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

const STATE_COPY: Record<Exclude<import('./operations.types').OperationsViewState, 'ready'>, import('./operations.types').StateViewCopy> = {
  loading: {
    stateId: 'loading',
    title: 'Loading operations preview',
    description: 'The preview workspace is preparing the next operational state.',
    actionLabel: 'Open operations',
  },
  empty: {
    stateId: 'empty',
    title: 'Nothing to show yet',
    description: 'No operational sample is available for the current workspace.',
    actionLabel: 'Open operations',
  },
  error: {
    stateId: 'recoverableError',
    title: 'Preview data is unavailable',
    description: 'The workspace can recover after the next refresh.',
    actionLabel: 'Open operations',
  },
  offline: {
    stateId: 'offline',
    title: 'Operations preview is offline',
    description: 'Restore connectivity or reload the workspace to continue.',
    actionLabel: 'Open operations',
  },
  disabled: {
    kind: 'warning',
    title: 'Preview mode is disabled',
    description: 'The operational preview is hidden until the workspace is ready again.',
    actionLabel: 'Open operations',
  },
};

export function resolveOperationsStateCopy(state: Exclude<import('./operations.types').OperationsViewState, 'ready'>): import('./operations.types').StateViewCopy {
  return STATE_COPY[state];
}