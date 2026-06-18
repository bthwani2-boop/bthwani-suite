// Canonical location: dsh/frontend/shared/control-panel/operations-registry.ts
// Authority: dsh/frontend/shared -- moved from control-panel/operations/operations.registry.ts
import type {
  AnyOperationsWorkspaceId,
  CanonicalOperationsGroupId,
  LegacyOperationsWorkspaceId,
  LegacySectionRedirectId,
  NonOperationsSectionRootId,
  OperationsFocusParams,
  OperationsGroupMeta,
  OperationsNormalizationResult,
  OperationsPanelId,
} from '../../shared/operations/operations.types';
import { DSH_OPERATIONAL_REGISTRY } from '../../shared/operations/dsh-operational-registry';

export type { AnyOperationsWorkspaceId } from '../../shared/operations/operations.types';

export const OPERATIONS_CANONICAL_GROUPS: readonly OperationsGroupMeta[] = [
  {
    id: 'command-center',
    label: 'مركز القيادة',
    description: 'Ù†Ø¨Ø¶ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§ØªØŒ Ø§Ù„Ù…Ø¹ÙˆÙ‚Ø§ØªØŒ ÙˆØ£ÙØ¶Ù„ Ø¥Ø¬Ø±Ø§Ø¡ ØªØ§Ù„ÙŠ.',
    badge: 'Ù‚ÙŠØ§Ø¯Ø©',
    subGroups: [
      { id: 'overview', label: 'Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø©' },
      { id: 'anomalies', label: 'Ø´ÙˆØ§Ø° Ø§Ù„Ù†Ø¸Ø§Ù…' },
      { id: 'recommendations', label: 'ØªÙˆØµÙŠØ§Øª Ø°ÙƒÙŠØ©' },
    ],
  },
  {
    id: 'live-orders',
    label: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø­ÙŠØ©',
    description: 'Ø§Ù„ØµÙ Ø§Ù„Ø­ÙŠØŒ ÙˆØ¶Ø¹ Ø§Ù„ØªÙ†ÙÙŠØ°ØŒ Ø§Ù„ØªØ¯Ø®Ù„ Ø§Ù„Ù…Ø¨Ø§Ø´Ø±ØŒ ÙˆØ§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© ÙˆØ§Ù„Ø¥Ù†Ù‚Ø§Ø°.',
    badge: 'Ø£Ø³Ø§Ø³',
    subGroups: [
      { id: 'queue', label: 'Ø§Ù„ØµÙ Ø§Ù„Ø­ÙŠ' },
      { id: 'bthwani_delivery', label: 'ØªÙˆØµÙŠÙ„ Ø¨Ø«ÙˆØ§Ù†ÙŠ' },
      { id: 'partner_delivery', label: 'ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±' },
      { id: 'pickup', label: 'Ø§Ø³ØªÙ„Ø§Ù… Ø¨Ù†ÙØ³ÙŠ' },
      { id: 'unassigned', label: 'ØºÙŠØ± Ù…Ø³Ù†Ø¯Ø©' },
      { id: 'delayed', label: 'Ù…ØªØ£Ø®Ø±Ø©' },
      { id: 'proofs', label: 'Ø§Ù„Ø¥Ø«Ø¨Ø§ØªØ§Øª' },
      { id: 'assisted', label: 'Ù…Ø³Ø§Ø¹Ø¯Ø©' },
      { id: 'rescue', label: 'Ø¥Ù†Ù‚Ø§Ø°' },
    ],
  },
  {
    id: 'dispatch-capacity',
    label: 'Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯ ÙˆØ§Ù„Ø³Ø¹Ø©',
    description: 'Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯ØŒ Ø§Ù„ÙƒØ¨Ø§ØªÙ†ØŒ Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ØŒ ÙˆØ§Ù„Ø³Ø¹Ø© Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© â€” Ù…Ø³Ø§Ø± ÙˆØ§Ø­Ø¯.',
    badge: 'Ø¥Ø³Ù†Ø§Ø¯',
    subGroups: [
      { id: 'pending', label: 'Ù‚ÙŠØ¯ Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯' },
      { id: 'captains', label: 'Ø§Ù„ÙƒØ¨Ø§ØªÙ†' },
      { id: 'heatmap', label: 'Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ù…Ù†Ø§Ø·Ù‚' },
      { id: 'zones', label: 'Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ ÙˆØ§Ù„Ø³Ø¹Ø©' },
    ],
  },
  {
    id: 'exceptions',
    label: 'Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡Ø§Øª ÙˆØ§Ù„ØªØµØ¹ÙŠØ¯',
    description: 'Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©ØŒ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ ÙˆØ§Ù„Ø§Ù„ØªØ²Ø§Ù…ØŒ ÙˆØ¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„Ù…ØªØ§Ø¬Ø±.',
    badge: 'Ù…Ø®Ø§Ø·Ø±',
    subGroups: [
      { id: 'active', label: 'Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©' },
      { id: 'audit', label: 'Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ ÙˆØ§Ù„Ø§Ù„ØªØ²Ø§Ù…' },
      { id: 'stores', label: 'Ø§Ù„Ù…ØªØ§Ø¬Ø±' },
    ],
  },
  {
    id: 'special-ops',
    label: 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø®Ø§ØµØ©',
    description: 'Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„ÙŠØ¯ÙˆÙŠØ© ÙˆØ§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø°Ø§Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø®Ø§ØµØ©.',
    badge: 'ÙŠØ¯ÙˆÙŠ',
    subGroups: [
      { id: 'shein', label: 'Ø´ÙŠ Ø¥Ù†' },
      { id: 'awnak', label: 'Ø¹ÙˆÙ†Ùƒ' },
    ],
  },
] as const;

export const OPERATIONS_CANONICAL_GROUP_IDS = OPERATIONS_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalOperationsGroupId[];

export const NON_OPERATIONS_SECTION_SHORTCUTS: ReadonlyArray<{
  id: NonOperationsSectionRootId;
  label: string;
  description: string;
  href: `/${NonOperationsSectionRootId}`;
}> = [
  { id: 'support', label: 'Ø§Ù„Ø¯Ø¹Ù…', description: 'Ø§Ù„ØªØ°Ø§ÙƒØ± ÙˆØ§Ù„Ù…ØªØ§Ø¨Ø¹Ø© ÙˆØ§Ù„ØªØµØ¹ÙŠØ¯ ØªØ¨Ù‚Ù‰ ÙÙŠ Ù‚Ø³Ù… Ø§Ù„Ø¯Ø¹Ù….', href: '/support' },
  { id: 'finance', label: 'Ø§Ù„Ù…Ø§Ù„ÙŠØ©', description: 'Ø§Ù„Ø­Ù‚Ø§Ø¦Ù‚ Ø§Ù„Ù…Ø§Ù„ÙŠØ© ØªØ¨Ù‚Ù‰ ÙÙŠ Ù‚Ø³Ù… Ø§Ù„Ù…Ø§Ù„ÙŠØ©.', href: '/finance' },
  { id: 'catalogs', label: 'Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬Ø§Øª', description: 'Ø­ÙˆÙƒÙ…Ø© Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ ØªØ¨Ù‚Ù‰ ÙÙŠ Ù‚Ø³Ù… Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬Ø§Øª.', href: '/catalogs' },
  { id: 'marketing', label: 'Ø§Ù„ØªØ³ÙˆÙŠÙ‚', description: 'Ø§Ù„ØªØ³ÙˆÙŠÙ‚ ÙˆØ§Ù„Ù†Ù…Ùˆ ÙŠØ¨Ù‚ÙŠØ§Ù† ÙÙŠ Ù‚Ø³Ù… Ø§Ù„ØªØ³ÙˆÙŠÙ‚.', href: '/marketing' },
  { id: 'partners', label: 'Ø§Ù„Ø´Ø±ÙƒØ§Ø¡', description: 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø´Ø±ÙƒØ§Ø¡ ØªØ¨Ù‚Ù‰ ÙÙŠ Ù‚Ø³Ù… Ø§Ù„Ø´Ø±ÙƒØ§Ø¡.', href: '/partners' },
  { id: 'platform', label: 'Ø§Ù„Ù…Ù†ØµØ©', description: 'Ø§Ù„Ø³ÙŠØ§Ø³Ø§Øª ÙˆØ§Ù„Ù…ØªØºÙŠØ±Ø§Øª ÙˆØ§Ù„Ù€ rollouts ØªØ¨Ù‚Ù‰ ÙÙŠ Ù‚Ø³Ù… Ø§Ù„Ù…Ù†ØµØ©.', href: '/platform' },
  { id: 'administration', label: 'Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©', description: 'Ø§Ù„Ø£Ø¯ÙˆØ§Ø± ÙˆØ³Ù„Ø³Ù„Ø© Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ ØªØ¨Ù‚Ù‰ ÙÙŠ Ù‚Ø³Ù… Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.', href: '/administration' },
] as const;

type CanonicalMapping = { group: CanonicalOperationsGroupId; subGroup?: string };

type LegacyOperationalWorkspaceId = Exclude<LegacyOperationsWorkspaceId, LegacySectionRedirectId>;

const LEGACY_OPERATIONAL_TO_CANONICAL_GROUP: Record<LegacyOperationalWorkspaceId | 'orders' | 'overview', CanonicalMapping> = {
  // command-center
  overview:              { group: 'command-center' },
  dashboard:             { group: 'command-center' },
  // live-orders â€” queue/filters
  orders:                { group: 'live-orders', subGroup: 'queue' },
  'tracking-handoff':    { group: 'live-orders', subGroup: 'queue' },
  'order-detail':        { group: 'live-orders', subGroup: 'queue' },
  orderchat:             { group: 'live-orders', subGroup: 'queue' },
  'live-tracking':       { group: 'live-orders', subGroup: 'queue' },
  handoff:               { group: 'live-orders', subGroup: 'queue' },
  'proof-review':        { group: 'live-orders', subGroup: 'proofs' },
  bell:                  { group: 'live-orders', subGroup: 'queue' },
  'arrival-bell':        { group: 'live-orders', subGroup: 'queue' },
  // live-orders â€” assisted & rescue
  'assisted-order-desk': { group: 'live-orders', subGroup: 'assisted' },
  'order-rescue':        { group: 'live-orders', subGroup: 'rescue' },
  // dispatch-capacity
  'dispatch-assignment': { group: 'dispatch-capacity', subGroup: 'pending' },
  dispatch:              { group: 'dispatch-capacity', subGroup: 'pending' },
  'dispatch-fleet':      { group: 'dispatch-capacity', subGroup: 'pending' },
  reassign:              { group: 'dispatch-capacity', subGroup: 'pending' },
  'peak-mode':           { group: 'dispatch-capacity', subGroup: 'pending' },
  'captain-operations':  { group: 'dispatch-capacity', subGroup: 'captains' },
  'captain-ops':         { group: 'dispatch-capacity', subGroup: 'captains' },
  'geo-heatmap':         { group: 'dispatch-capacity', subGroup: 'heatmap' },
  'live-map-capacity':   { group: 'dispatch-capacity', subGroup: 'heatmap' },
  'area-capacity':       { group: 'dispatch-capacity', subGroup: 'zones' },
  capacity:              { group: 'dispatch-capacity', subGroup: 'zones' },
  'zone-set':            { group: 'dispatch-capacity', subGroup: 'zones' },
  serviceability:        { group: 'dispatch-capacity', subGroup: 'zones' },
  // exceptions
  'exceptions-escalations': { group: 'exceptions', subGroup: 'active' },
  'exceptions-sla':      { group: 'exceptions', subGroup: 'active' },
  exceptions:            { group: 'exceptions', subGroup: 'active' },
  issues:                { group: 'exceptions', subGroup: 'active' },
  'audit-support-sla':   { group: 'exceptions', subGroup: 'audit' },
  'audit-evidence':      { group: 'exceptions', subGroup: 'audit' },
  audit:                 { group: 'exceptions', subGroup: 'audit' },
  'guard-status':        { group: 'exceptions', subGroup: 'audit' },
  evidence:              { group: 'exceptions', subGroup: 'audit' },
  sla:                   { group: 'exceptions', subGroup: 'audit' },
  'partner-stores':      { group: 'exceptions', subGroup: 'stores' },
  'partner-readiness':   { group: 'exceptions', subGroup: 'stores' },
  'field-ops':           { group: 'exceptions', subGroup: 'stores' },
  'partner-prep':        { group: 'exceptions', subGroup: 'stores' },
  // special-ops
  sheinproxy:            { group: 'special-ops', subGroup: 'shein' },
  'awnak-operations':    { group: 'special-ops', subGroup: 'awnak' },
  'proxy-shein-awnak':   { group: 'special-ops', subGroup: 'awnak' },
};

const LEGACY_SECTION_REDIRECTS: Record<LegacySectionRedirectId, NonOperationsSectionRootId> = {
  support: 'support',
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
  platform: 'platform',
  administration: 'administration',
};

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
    group: mapped.group,
    subGroup: mapped.subGroup,
    sourceWorkspace: workspace as AnyOperationsWorkspaceId,
    panel: derivedPanel,
  };
}

export function buildOperationsHref(
  group: AnyOperationsWorkspaceId = 'command-center',
  options?: OperationsFocusParams,
) {
  const normalizedLocation = normalizeOperationsLocation(group, options?.panel);
  const searchParams = new globalThis.URLSearchParams();

  if (normalizedLocation.kind === 'group' && normalizedLocation.group !== 'command-center') {
    searchParams.set('workspace', normalizedLocation.group);
  }

  if (options?.orderId) {
    searchParams.set('orderId', options.orderId);
  }

  if (options?.customerId) {
    searchParams.set('customerId', options.customerId);
  }

  if (options?.ticketId) {
    searchParams.set('ticketId', options.ticketId);
  }

  if (options?.callId) {
    searchParams.set('callId', options.callId);
  }

  if (options?.requestId) {
    searchParams.set('requestId', options.requestId);
  }

  if (options?.panel) {
    searchParams.set('panel', options.panel);
  }

  // Explicit caller subGroup takes precedence; fall back to the legacy-derived subGroup
  const resolvedSubGroup = options?.subGroup ?? (normalizedLocation.kind === 'group' ? normalizedLocation.subGroup : undefined);
  if (resolvedSubGroup) {
    searchParams.set('subGroup', resolvedSubGroup);
  }

  const query = searchParams.toString();
  return query ? `/operations?${query}` : '/operations';
}

export function getOperationsGroupMeta(groupId: CanonicalOperationsGroupId) {
  return OPERATIONS_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? OPERATIONS_CANONICAL_GROUPS[0];
}

const STATE_COPY: Record<Exclude<import('../operations/operations.types').OperationsViewState, 'ready'>, import('../operations/operations.types').StateViewCopy> = {
  loading: {
    stateId: 'loading',
    title: 'Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
    description: 'ØªØ¬Ù‡Ù‘Ø² Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„ØªØ§Ù„ÙŠØ©.',
    actionLabel: 'ÙØªØ­ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
  },
  empty: {
    stateId: 'empty',
    title: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø­ØªÙˆÙ‰ Ø¨Ø¹Ø¯',
    description: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹ÙŠÙ†Ø© ØªØ´ØºÙŠÙ„ÙŠØ© Ù…ØªØ§Ø­Ø© Ù„Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø­Ø§Ù„ÙŠØ©.',
    actionLabel: 'Ù ØªØ­ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
  },
  error: {
    stateId: 'recoverableError',
    title: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© ØºÙŠØ± Ù…ØªØ§Ø­Ø©',
    description: 'ÙŠÙ…ÙƒÙ† Ø£Ù† ØªØªØ¹Ø§Ù Ù‰ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ø¨Ø¹Ø¯ Ø§Ù„ØªØ­Ø¯ÙŠØ« Ø§Ù„ØªØ§Ù„ÙŠ.',
    actionLabel: 'Ù ØªØ­ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
  },
  offline: {
    stateId: 'offline',
    title: 'Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ØºÙŠØ± Ù…ØªØµÙ„Ø©',
    description: 'Ø£Ø¹Ø¯ Ø§Ù„Ø§ØªØµØ§Ù„ Ø£Ùˆ Ø­Ø¯Ù‘Ø« Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©.',
    actionLabel: 'Ù ØªØ­ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
  },
  disabled: {
    kind: 'warning',
    title: 'ØªÙ… ØªØ¹Ø·ÙŠÙ„ ÙˆØ¶Ø¹ Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø©',
    description: 'ØªØ¸Ù„ Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© Ù…Ø®Ù ÙŠØ© Ø­ØªÙ‰ ØªØµØ¨Ø­ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø¹Ù…Ù„ Ø¬Ø§Ù‡Ø²Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.',
    actionLabel: 'Ù ØªØ­ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
  },
};

export function resolveOperationsStateCopy(state: Exclude<import('../operations/operations.types').OperationsViewState, 'ready'>): import('../operations/operations.types').StateViewCopy {
  return STATE_COPY[state];
}
