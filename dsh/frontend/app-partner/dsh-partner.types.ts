export const DSH_PARTNER_OPERATIONAL_FLOW_IDS = [
  'order-accept',
  'order-get',
  'order-handoff',
  // Intentionally hidden compatibility-only flows: surfaced inline in the command center, not as standalone routes.
  'order-alerts',
  'order-sla-risk',
  'order-issue-queue',
  'order-issue-required',
  'order-out-for-delivery',
  'order-prepare',
  'order-ready',
  'order-reject',
  'order-store-delivered',
  'order-chat-read-ack',
  'order-chat-send',
  'order-quick-reply-config',
  'order-quick-reply-settings',
  'order-quick-reply-setup',
  'inventory-adjust',
  'inventory-update',
  'items-upsert',
  'doc-upload',
  'intake-start',
  'store-nomination',
  'video-upload',
  // WLT finance previews remain compatibility-only entry points; the command center may tag them but must not mutate them.
  'partner-finance-bridge',
  'partner-settlement-summary',
  'partner-commission-summary',
] as const;

export type DshPartnerOperationalFlowId = (typeof DSH_PARTNER_OPERATIONAL_FLOW_IDS)[number];

export const DSH_PARTNER_SUPPORT_ROUTE_IDS = [
  // Intentionally hidden compatibility-only route: keep for registry consumers, do not surface in the main IA.
  'auction-status-update',
  'chat-read-ack',
  'chat-send',
  'doc-upload',
  'intake-start',
  'inventory-adjust',
  'inventory-update',
  'items-upsert',
  'order-accept',
  'order-get',
  'order-handoff',
  'order-issue-queue',
  'order-out-for-delivery',
  'order-prepare',
  'order-ready',
  'order-reject',
  'order-store-delivered',
  'quick-reply-config',
  'quick-reply-settings',
  'quick-reply-setup',
  'store-nomination',
  'video-upload',
] as const;

export type DshPartnerSupportRouteId = (typeof DSH_PARTNER_SUPPORT_ROUTE_IDS)[number];

export const DSH_PARTNER_SUPPORT_ISSUE_CATEGORY_IDS = [
  'delayed-preparation',
  'item-unavailable',
  'partner-reject-request',
  'courier-not-arrived',
  'customer-not-responding',
  'handoff-mismatch',
  'wrong-item',
  'payment-refund-review',
] as const;

export type DshPartnerSupportIssueCategoryId = (typeof DSH_PARTNER_SUPPORT_ISSUE_CATEGORY_IDS)[number];

export type DshPartnerSupportCommandFilterId =
  | 'all'
  | 'active-orders'
  | 'order-issues'
  | 'conversations'
  | 'inventory-branch'
  | 'escalation';

export type DshPartnerSupportCommandContext = {
  filterId: DshPartnerSupportCommandFilterId;
  highlightedCaseId?: string | null;
  highlightedIssueCategoryId?: DshPartnerSupportIssueCategoryId | null;
  preferredOperationalFlowId?: DshPartnerOperationalFlowId | null;
  preferredSupportRouteId?: DshPartnerSupportRouteId | null;
  source?: 'operations' | 'bell' | 'settings' | 'orders' | 'hub';
};

export const DSH_PARTNER_HIDDEN_COMPAT_SUPPORT_ROUTE_IDS = [
  'auction-status-update',
] as const satisfies readonly DshPartnerSupportRouteId[];

export const DSH_PARTNER_HIDDEN_COMPAT_OPERATIONAL_FLOW_IDS = [
  'order-alerts',
  'order-sla-risk',
  'order-issue-required',
  'partner-finance-bridge',
  'partner-settlement-summary',
  'partner-commission-summary',
] as const satisfies readonly DshPartnerOperationalFlowId[];

export const DSH_PARTNER_SUPPORT_ROUTE_TO_OPERATIONAL_FLOW: Record<DshPartnerSupportRouteId, DshPartnerOperationalFlowId | null> = {
  'auction-status-update': null,
  'chat-read-ack': 'order-chat-read-ack',
  'chat-send': 'order-chat-send',
  'doc-upload': 'doc-upload',
  'intake-start': 'intake-start',
  'inventory-adjust': 'inventory-adjust',
  'inventory-update': 'inventory-update',
  'items-upsert': 'items-upsert',
  'order-accept': 'order-accept',
  'order-get': 'order-get',
  'order-handoff': 'order-handoff',
  'order-issue-queue': 'order-issue-queue',
  'order-out-for-delivery': 'order-out-for-delivery',
  'order-prepare': 'order-prepare',
  'order-ready': 'order-ready',
  'order-reject': 'order-reject',
  'order-store-delivered': 'order-store-delivered',
  'quick-reply-config': 'order-quick-reply-config',
  'quick-reply-settings': 'order-quick-reply-settings',
  'quick-reply-setup': 'order-quick-reply-setup',
  'store-nomination': 'store-nomination',
  'video-upload': 'video-upload',
};

export const DSH_PARTNER_OPERATIONAL_FLOW_TO_SUPPORT_ROUTE: Record<DshPartnerOperationalFlowId, DshPartnerSupportRouteId | null> = {
  'order-accept': 'order-accept',
  'order-get': 'order-get',
  'order-handoff': 'order-handoff',
  'order-alerts': null,
  'order-sla-risk': null,
  'order-issue-queue': 'order-issue-queue',
  'order-issue-required': null,
  'order-out-for-delivery': 'order-out-for-delivery',
  'order-prepare': 'order-prepare',
  'order-ready': 'order-ready',
  'order-reject': 'order-reject',
  'order-store-delivered': 'order-store-delivered',
  'order-chat-read-ack': 'chat-read-ack',
  'order-chat-send': 'chat-send',
  'order-quick-reply-config': 'quick-reply-config',
  'order-quick-reply-settings': 'quick-reply-settings',
  'order-quick-reply-setup': 'quick-reply-setup',
  'inventory-adjust': 'inventory-adjust',
  'inventory-update': 'inventory-update',
  'items-upsert': 'items-upsert',
  'doc-upload': 'doc-upload',
  'intake-start': 'intake-start',
  'store-nomination': 'store-nomination',
  'video-upload': 'video-upload',
  'partner-finance-bridge': null,
  'partner-settlement-summary': null,
  'partner-commission-summary': null,
};

export function mapDshPartnerOperationalFlowToSupportRoute(
  flowId: DshPartnerOperationalFlowId
): DshPartnerSupportRouteId | null {
  return DSH_PARTNER_OPERATIONAL_FLOW_TO_SUPPORT_ROUTE[flowId];
}

export function mapDshPartnerSupportRouteToOperationalFlow(
  routeId: DshPartnerSupportRouteId
): DshPartnerOperationalFlowId | null {
  return DSH_PARTNER_SUPPORT_ROUTE_TO_OPERATIONAL_FLOW[routeId];
}

export function isDshPartnerHiddenCompatOperationalFlow(
  flowId: DshPartnerOperationalFlowId
): boolean {
  return DSH_PARTNER_HIDDEN_COMPAT_OPERATIONAL_FLOW_IDS.includes(flowId);
}

export function isDshPartnerHiddenCompatSupportRoute(
  routeId: DshPartnerSupportRouteId
): boolean {
  return DSH_PARTNER_HIDDEN_COMPAT_SUPPORT_ROUTE_IDS.includes(routeId);
}

export type DshPartnerRoute =
  | 'home'
  | 'entry'
  | 'inbox'
  | 'bell'
  | 'support-directory'
  | 'support-screen'
  | 'inventory-management'
  | 'order-rejection' // Intentionally hidden compatibility-only route; keep for legacy registry consumers.
  | 'store-courier';

export type DshPartnerSurfaceProps = {
  initialRoute?: DshPartnerRoute;
  initialOrderId?: string;
};

export type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings';

export type PartnerDshSurfaceState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshPartnerHubSurfaceProps = {
  state?: PartnerDshSurfaceState;
  section?: PartnerHubSection;
  onSectionChange?: (section: PartnerHubSection) => void;
  storeName?: string;
  branchLabel?: string;
  cityLabel?: string;
  managerLabel?: string;
  todayHoursLabel?: string;
  activeZoneLabel?: string;
  storeOpen?: boolean;
  listingEnabled?: boolean;
  serviceModes?: readonly { id: string; label: string; description: string; enabled: boolean }[];
  activeOrdersCount?: number;
  urgentOrdersCount?: number;
  pendingActionsCount?: number;
  onOpenOrdersBoard?: () => void;
  onOpenOrdersSearch?: () => void;
  onOpenInventoryManagement?: () => void;
  onOpenStoreScope?: () => void;
  onOpenSupportDirectory?: () => void;
  onOpenWalletHub?: () => void;
  onOpenBell?: () => void;
  onOpenOperationalFlow?: (screenId: DshPartnerOperationalFlowId) => void;
  onOpenSupportScreen?: (screenId: DshPartnerSupportRouteId) => void;
  onOpenStoreCourierSetup?: () => void;
  onToggleAvailability?: (isAvailable: boolean) => void;
  canonicalStoreId?: string;
};
