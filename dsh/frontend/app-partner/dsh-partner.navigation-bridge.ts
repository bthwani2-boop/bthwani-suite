import {
  type DshPartnerOperationalFlowId,
  type DshPartnerSupportCommandContext,
  type DshPartnerSupportCommandFilterId,
  type DshPartnerSupportIssueCategoryId,
  type DshPartnerSupportRouteId,
  mapDshPartnerOperationalFlowToSupportRoute,
  mapDshPartnerSupportRouteToOperationalFlow,
} from './dsh-partner.types';

export type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

export type PartnerStoreHoursDay = {
  id: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export const defaultStoreHours: readonly PartnerStoreHoursDay[] = [
  { id: 'sun', label: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'mon', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'tue', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'wed', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'thu', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'fri', label: 'Friday', isOpen: false, openTime: '14:00', closeTime: '23:30' },
  { id: 'sat', label: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:30' },
] as const;

export const defaultServiceModes = [
  {
    id: 'partner_delivery',
    label: 'توصيل المتجر',
    description: 'تفعيل توصيل المتجر عبر موصل الشريك عند الجاهزية التشغيلية.',
    enabled: true,
  },
  {
    id: 'pickup',
    label: 'استلام بنفسي',
    description: 'إظهار الاستلام الذاتي عندما يكون المتجر جاهزًا لتسليم العميل مباشرة.',
    enabled: true,
  },
  {
    id: 'bthwani_delivery',
    label: 'توصيل بثواني',
    description: 'فتح توصيل بثواني فقط عند توفر تغطية الكباتن والإسناد.',
    enabled: false,
  },
] as const;

export const defaultZone = {
  title: 'Yasmin',
} as const;

export const storeScopeOptions: readonly PartnerStoreScopeOption[] = [
  {
    id: 'all',
    label: 'كل الفروع',
    description: 'عرض موحّد لكل فروع الشريك.',
  },
  {
    id: 'fakhama-1',
    label: 'الفخامة 1',
    description: 'الفرع الأساسي الحالي.',
  },
  {
    id: 'fakhama-2',
    label: 'الفخامة 2',
    description: 'فرع المدينة الثاني للتشغيل.',
  },
  {
    id: 'fakhama-3',
    label: 'الفخامة 3',
    description: 'فرع داعم لنطاق الطلبات الممتد.',
  },
] as const;

export const defaultSupportCommandContext: DshPartnerSupportCommandContext = {
  filterId: 'all',
  highlightedCaseId: null,
  highlightedIssueCategoryId: null,
  preferredOperationalFlowId: null,
  preferredSupportRouteId: null,
  source: 'operations',
};

export function resolveSupportFilterFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId
): DshPartnerSupportCommandFilterId {
  if (flowId === 'order-alerts' || flowId === 'order-sla-risk') {
    return 'active-orders';
  }

  if (
    flowId === 'order-chat-read-ack'
    || flowId === 'order-chat-send'
    || flowId === 'order-quick-reply-config'
    || flowId === 'order-quick-reply-settings'
    || flowId === 'order-quick-reply-setup'
  ) {
    return 'conversations';
  }

  if (
    flowId === 'inventory-adjust'
    || flowId === 'inventory-update'
    || flowId === 'items-upsert'
    || flowId === 'doc-upload'
    || flowId === 'intake-start'
    || flowId === 'store-nomination'
  ) {
    return 'inventory-branch';
  }

  if (
    flowId === 'partner-finance-bridge'
    || flowId === 'partner-settlement-summary'
    || flowId === 'partner-commission-summary'
  ) {
    return 'escalation';
  }

  if (
    flowId === 'order-issue-queue'
    || flowId === 'order-issue-required'
    || flowId === 'order-reject'
  ) {
    return 'order-issues';
  }

  return 'active-orders';
}

export function resolveSupportFilterFromRoute(
  routeId: DshPartnerSupportRouteId
): DshPartnerSupportCommandFilterId {
  if (
    routeId === 'chat-read-ack'
    || routeId === 'chat-send'
    || routeId === 'quick-reply-config'
    || routeId === 'quick-reply-settings'
    || routeId === 'quick-reply-setup'
  ) {
    return 'conversations';
  }

  if (
    routeId === 'inventory-adjust'
    || routeId === 'inventory-update'
    || routeId === 'items-upsert'
    || routeId === 'doc-upload'
    || routeId === 'intake-start'
    || routeId === 'store-nomination'
    || routeId === 'video-upload'
  ) {
    return 'inventory-branch';
  }

  if (routeId === 'order-issue-queue' || routeId === 'order-reject') {
    return 'order-issues';
  }

  return 'active-orders';
}

export function resolveIssueCategoryFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId
): DshPartnerSupportIssueCategoryId | null {
  if (flowId === 'order-sla-risk') return 'delayed-preparation';
  if (flowId === 'order-reject') return 'partner-reject-request';
  if (flowId === 'order-handoff') return 'handoff-mismatch';
  if (flowId === 'order-chat-read-ack' || flowId === 'order-chat-send') return 'customer-not-responding';
  if (flowId === 'inventory-adjust' || flowId === 'inventory-update' || flowId === 'items-upsert') return 'item-unavailable';
  if (flowId === 'partner-finance-bridge' || flowId === 'partner-settlement-summary' || flowId === 'partner-commission-summary') {
    return 'payment-refund-review';
  }

  return null;
}

export function resolveIssueCategoryFromRoute(
  routeId: DshPartnerSupportRouteId
): DshPartnerSupportIssueCategoryId | null {
  if (routeId === 'order-reject') return 'partner-reject-request';
  if (routeId === 'order-handoff') return 'handoff-mismatch';
  if (routeId === 'chat-read-ack' || routeId === 'chat-send' || routeId === 'quick-reply-config' || routeId === 'quick-reply-settings' || routeId === 'quick-reply-setup') {
    return 'customer-not-responding';
  }
  if (routeId === 'inventory-adjust' || routeId === 'inventory-update' || routeId === 'items-upsert') {
    return 'item-unavailable';
  }

  return null;
}

export function isCommandCenterInlineManagedRoute(routeId: DshPartnerSupportRouteId): boolean {
  return routeId === 'order-issue-queue' || routeId === 'order-reject';
}

export function buildSupportCommandContextFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId,
  source: DshPartnerSupportCommandContext['source'] = 'operations'
): DshPartnerSupportCommandContext {
  return {
    filterId: resolveSupportFilterFromOperationalFlow(flowId),
    highlightedCaseId: null,
    highlightedIssueCategoryId: resolveIssueCategoryFromOperationalFlow(flowId),
    preferredOperationalFlowId: flowId,
    preferredSupportRouteId: mapDshPartnerOperationalFlowToSupportRoute(flowId),
    source,
  };
}

export function buildSupportCommandContextFromSupportRoute(
  routeId: DshPartnerSupportRouteId,
  source: DshPartnerSupportCommandContext['source'] = 'operations'
): DshPartnerSupportCommandContext {
  return {
    filterId: resolveSupportFilterFromRoute(routeId),
    highlightedCaseId: null,
    highlightedIssueCategoryId: resolveIssueCategoryFromRoute(routeId),
    preferredOperationalFlowId: mapDshPartnerSupportRouteToOperationalFlow(routeId),
    preferredSupportRouteId: routeId,
    source,
  };
}
