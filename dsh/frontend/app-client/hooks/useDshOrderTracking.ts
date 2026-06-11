import React from 'react';
import { Platform } from 'react-native';
import {
  createDshOrderLifecycleHttpClient,
  type DshCheckoutAuthContext,
  type DshOrderDetailsResponse,
} from '../../shared';
import { resolveDshDiscoveryStoresRuntimeConfig } from '../shared/dsh-discovery-stores-runtime-config';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { CreateOrderValues, HostOrderSummary } from '../dsh-client.navigation-bridge';
import { initialOrders, hostClientStates } from '../dsh-client.navigation-bridge';
import { getClientWltIntentForState, type DshClientWltIntentEntry } from '../dsh-client-wlt-payment-bridge';
import { getDshClientStateMeta, type DshClientState } from '../../shared/client-state';
import type { DshRoute } from '../dsh-client.types';

const TERMINAL_STATUSES = new Set(['DELIVERED', 'CANCELLED', 'REFUNDED', 'FAILED_DELIVERY', 'RETURNED']);

function statusToLabel(status: string): string {
  const labels: Record<string, string> = {
    CREATED: 'قيد المراجعة', ACCEPTED: 'تم القبول', READY_FOR_PICKUP: 'جاهز للاستلام',
    ACCEPTED_BY_CAPTAIN: 'الكابتن قبل المهمة', PICKED_UP: 'تم الاستلام', EN_ROUTE: 'في الطريق',
    ARRIVED: 'وصل الكابتن', DELIVERED: 'تم التوصيل', CANCELLED: 'تم الإلغاء',
    REFUNDED: 'تم الاسترداد', FAILED_DELIVERY: 'فشل التوصيل', RETURNING_TO_STORE: 'عائد للمتجر',
    RETURNED: 'تم الإرجاع',
  };
  return labels[status] ?? status;
}

function statusToClientState(status: string): import('../../shared/client-state').DshClientState {
  if (status === 'DELIVERED') return hostClientStates.delivered;
  if (status === 'CANCELLED') return hostClientStates.cancelled;
  if (TERMINAL_STATUSES.has(status)) return hostClientStates.delivered;
  return hostClientStates.trackingActive;
}

function getWebWindow(): (Window & typeof globalThis) | null {
  if (Platform.OS !== 'web') return null;
  try { return typeof window !== 'undefined' ? window : null; } catch { return null; }
}

export type DshTrackingTimelineItem = { id: string; title: string; detail: string; done: boolean };

function buildTimeline(mode: DshFulfillmentDeliveryMode): DshTrackingTimelineItem[] {
  if (mode === 'partner_delivery') {
    return [
      { id: 'track-store-prep', title: 'يجهّز المتجر الطلب', detail: 'المتجر يجهّز طلبك ويسلّمه لموصله.', done: true },
      { id: 'track-store-courier', title: 'موصل المتجر في الطريق', detail: 'موصل المتجر يتجه إليك — هذا ليس كابتن بثواني.', done: false },
      { id: 'track-delivered-partner', title: 'تم التوصيل', detail: 'استلمت طلبك من موصل المتجر.', done: false },
    ];
  }
  if (mode === 'pickup') {
    return [
      { id: 'track-pickup-prep', title: 'يجهّز المتجر الطلب', detail: 'طلبك قيد التجهيز في المتجر.', done: true },
      { id: 'track-pickup-ready', title: 'الطلب جاهز للاستلام', detail: 'توجّه للمتجر لاستلام طلبك.', done: false },
      { id: 'track-pickup-done', title: 'استلمت طلبك', detail: 'تم تأكيد استلامك للطلب من المتجر.', done: false },
    ];
  }
  return [
    { id: 'track-captain-route', title: 'الكابتن في الطريق', detail: 'كابتن بثواني متجه إليك الآن.', done: true },
    { id: 'track-captain-arrived', title: 'وصل الكابتن', detail: 'الكابتن وصل وينتظر تسليم الطلب.', done: false },
    { id: 'track-client-received', title: 'استلمت طلبك', detail: 'بعد الاستلام تظهر تقييمات المنتج والكابتن.', done: false },
  ];
}

function buildLiveTimeline(
  mode: DshFulfillmentDeliveryMode,
  orderStatus: string,
): DshTrackingTimelineItem[] {
  if (mode === 'partner_delivery') {
    return [
      { id: 'track-store-prep', title: 'يجهّز المتجر الطلب', detail: 'المتجر يجهّز طلبك ويسلّمه لموصله.', done: orderStatus !== 'CREATED' },
      { id: 'track-store-courier', title: 'موصل المتجر في الطريق', detail: 'موصل المتجر يتجه إليك.', done: orderStatus === 'DELIVERED' },
      { id: 'track-delivered-partner', title: 'تم التوصيل', detail: 'استلمت طلبك من موصل المتجر.', done: orderStatus === 'DELIVERED' },
    ];
  }
  if (mode === 'pickup') {
    return [
      { id: 'track-pickup-prep', title: 'يجهّز المتجر الطلب', detail: 'طلبك قيد التجهيز في المتجر.', done: orderStatus !== 'CREATED' },
      { id: 'track-pickup-ready', title: 'الطلب جاهز للاستلام', detail: 'توجّه للمتجر لاستلام طلبك.', done: orderStatus === 'READY_FOR_PICKUP' || orderStatus === 'DELIVERED' },
      { id: 'track-pickup-done', title: 'استلمت طلبك', detail: 'تم تأكيد استلامك للطلب من المتجر.', done: orderStatus === 'DELIVERED' },
    ];
  }
  return [
    { id: 'track-captain-route', title: 'الكابتن في الطريق', detail: 'كابتن بثواني متجه إليك الآن.', done: orderStatus !== 'CREATED' },
    { id: 'track-captain-arrived', title: 'وصل الكابتن', detail: 'الكابتن وصل وينتظر تسليم الطلب.', done: orderStatus === 'READY_FOR_PICKUP' || orderStatus === 'DELIVERED' },
    { id: 'track-client-received', title: 'استلمت طلبك', detail: 'بعد الاستلام تظهر تقييمات المنتج والكابتن.', done: orderStatus === 'DELIVERED' },
  ];
}

type UseDshOrderTrackingOptions = {
  route: DshRoute;
  checkoutAuth: DshCheckoutAuthContext;
  createOrderValues: CreateOrderValues;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  defaultFulfillmentMode: DshFulfillmentDeliveryMode;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  setSelectedFulfillmentMode: (mode: DshFulfillmentDeliveryMode) => void;
  setCreateOrderValues: React.Dispatch<React.SetStateAction<CreateOrderValues>>;
};

export type UseDshOrderTrackingResult = {
  selectedOrderId: string;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<string>>;
  ordersListState: HostOrderSummary[];
  setOrdersListState: React.Dispatch<React.SetStateAction<HostOrderSummary[]>>;
  liveOrderDetails: DshOrderDetailsResponse | null;
  trackingClientState: DshClientState;
  setTrackingClientState: React.Dispatch<React.SetStateAction<DshClientState>>;
  trackingOrderOverride: Partial<CreateOrderValues> | null;
  setTrackingOrderOverride: React.Dispatch<React.SetStateAction<Partial<CreateOrderValues> | null>>;
  ordersQuery: string;
  setOrdersQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredOrders: HostOrderSummary[];
  activeTrackedOrder: HostOrderSummary | undefined;
  trackingOrderValues: CreateOrderValues;
  trackingTimeline: DshTrackingTimelineItem[];
  trackingWltIntent: DshClientWltIntentEntry | undefined;
  openTrackedOrder: (orderId?: string, overrides?: { fulfillmentMode?: DshFulfillmentDeliveryMode; orderDraft?: Partial<CreateOrderValues> }) => void;
  reopenTracking: () => void;
  returnOrdersList: () => void;
  handleCancelOrder: () => void;
  handleSupportEscalation: (issueType: string, description: string) => Promise<void>;
};

export function useDshOrderTracking({
  route,
  checkoutAuth,
  createOrderValues,
  selectedFulfillmentMode,
  defaultFulfillmentMode,
  setRoute,
  setSelectedFulfillmentMode,
  setCreateOrderValues,
}: UseDshOrderTrackingOptions): UseDshOrderTrackingResult {
  const defaultOrderId = initialOrders[0]?.id ?? 'dsh-10021';

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(defaultOrderId);
  const [ordersListState, setOrdersListState] = React.useState<HostOrderSummary[]>(initialOrders);
  const [liveOrderDetails, setLiveOrderDetails] = React.useState<DshOrderDetailsResponse | null>(null);
  const [trackingClientState, setTrackingClientState] = React.useState<DshClientState>(hostClientStates.trackingActive);
  const [trackingOrderOverride, setTrackingOrderOverride] = React.useState<Partial<CreateOrderValues> | null>(null);
  const [ordersQuery, setOrdersQuery] = React.useState('');

  const trackingWltIntent: DshClientWltIntentEntry | undefined = getClientWltIntentForState(trackingClientState);

  // Live orders list fetch when on orders-list route
  React.useEffect(() => {
    if (route !== 'orders-list') return undefined;
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) return undefined;
    let cancelled = false;
    const orderClient = createDshOrderLifecycleHttpClient(config.baseUrl, undefined, checkoutAuth);
    orderClient.listOrders({ limit: 50 })
      .then((resp) => {
        if (cancelled || !resp.orders.length) return;
        const mapped: HostOrderSummary[] = resp.orders.map((o) => ({
          id: o.id,
          title: o.store_id,
          subtitle: '',
          statusLabel: statusToLabel(o.status),
          clientState: statusToClientState(o.status),
          fulfillmentMode: 'bthwani_delivery' as DshFulfillmentDeliveryMode,
          pickupAddress: '',
          dropoffAddress: '',
          meta: o.created_at,
          total: `${o.total_price}`,
        }));
        setOrdersListState(mapped);
      })
      .catch(() => { /* keep initialOrders fallback */ });
    return () => { cancelled = true; };
  }, [checkoutAuth, route]);

  // Live order status polling while on tracking route
  React.useEffect(() => {
    if (route !== 'tracking' || !selectedOrderId) {
      setLiveOrderDetails(null);
      return undefined;
    }
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) { setLiveOrderDetails(null); return undefined; }

    const orderClient = createDshOrderLifecycleHttpClient(config.baseUrl, undefined, checkoutAuth);
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let nextDelayMs = 2000;
    let lastStatus = '';

    const fetchOrder = () => {
      if (getWebWindow()?.document?.hidden) {
        timeout = setTimeout(fetchOrder, Math.max(nextDelayMs, 15000));
        return;
      }
      orderClient.getOrder(selectedOrderId)
        .then((details) => {
          if (cancelled) return;
          setLiveOrderDetails(details);
          if (TERMINAL_STATUSES.has(details.order.status)) return;
          if (details.order.status === lastStatus) {
            nextDelayMs = Math.min(Math.round(nextDelayMs * 1.5), 30000);
          } else {
            nextDelayMs = 2000;
            lastStatus = details.order.status;
          }
          timeout = setTimeout(fetchOrder, nextDelayMs);
        })
        .catch((err) => {
          if (cancelled) return;
          console.warn('Failed to fetch live order details:', err);
          nextDelayMs = Math.min(nextDelayMs * 2, 60000);
          timeout = setTimeout(fetchOrder, nextDelayMs);
        });
    };

    fetchOrder();
    return () => { cancelled = true; if (timeout) clearTimeout(timeout); };
  }, [checkoutAuth, route, selectedOrderId]);

  const filteredOrders = React.useMemo(() => {
    const query = ordersQuery.trim().toLowerCase();
    if (!query) return ordersListState;
    return ordersListState.filter((order) => {
      const haystack = `${order.title} ${order.orderNumber || ''} ${order.summary || ''} ${order.subtitle} ${order.statusLabel} ${order.meta}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [ordersQuery, ordersListState]);

  const activeTrackedOrder = React.useMemo(
    () => ordersListState.find((o) => o.id === selectedOrderId) ?? ordersListState[0],
    [selectedOrderId, ordersListState],
  );

  const trackingOrderValues = React.useMemo<CreateOrderValues>(() => ({
    fulfillmentMode: trackingOrderOverride?.fulfillmentMode ?? activeTrackedOrder?.fulfillmentMode ?? createOrderValues.fulfillmentMode ?? selectedFulfillmentMode,
    pickupAddress: trackingOrderOverride?.pickupAddress ?? activeTrackedOrder?.pickupAddress ?? createOrderValues.pickupAddress,
    dropoffAddress: trackingOrderOverride?.dropoffAddress ?? activeTrackedOrder?.dropoffAddress ?? createOrderValues.dropoffAddress,
    contactName: createOrderValues.contactName,
    contactPhone: createOrderValues.contactPhone,
    note: trackingOrderOverride?.note ?? activeTrackedOrder?.note ?? createOrderValues.note,
  }), [activeTrackedOrder, createOrderValues, selectedFulfillmentMode, trackingOrderOverride]);

  const trackingTimeline = React.useMemo((): DshTrackingTimelineItem[] => {
    if (liveOrderDetails) {
      return buildLiveTimeline(trackingOrderValues.fulfillmentMode, liveOrderDetails.order.status);
    }
    return buildTimeline(trackingOrderValues.fulfillmentMode);
  }, [liveOrderDetails, trackingOrderValues.fulfillmentMode]);

  const openTrackedOrder = React.useCallback((
    orderId?: string,
    overrides?: { fulfillmentMode?: DshFulfillmentDeliveryMode; orderDraft?: Partial<CreateOrderValues> },
  ) => {
    const nextOrder = initialOrders.find((o) => o.id === orderId) ?? initialOrders[0];
    const nextFulfillmentMode = orderId
      ? nextOrder.fulfillmentMode
      : overrides?.fulfillmentMode ?? selectedFulfillmentMode ?? nextOrder.fulfillmentMode ?? defaultFulfillmentMode;
    const nextOrderDraft = orderId
      ? { fulfillmentMode: nextOrder.fulfillmentMode, pickupAddress: nextOrder.pickupAddress, dropoffAddress: nextOrder.dropoffAddress, note: nextOrder.note ?? createOrderValues.note }
      : overrides?.orderDraft;

    setSelectedOrderId(nextOrder.id);
    setTrackingClientState(hostClientStates.trackingActive);
    setSelectedFulfillmentMode(nextFulfillmentMode);
    setTrackingOrderOverride(orderId ? null : nextOrderDraft ?? null);
    setCreateOrderValues((cur) => ({ ...cur, ...nextOrderDraft, fulfillmentMode: nextFulfillmentMode }));
    setRoute((prev) => { void prev; return 'tracking'; });
  }, [createOrderValues.note, defaultFulfillmentMode, selectedFulfillmentMode, setCreateOrderValues, setRoute, setSelectedFulfillmentMode]);

  const reopenTracking = React.useCallback(() => {
    openTrackedOrder(
      trackingOrderOverride ? undefined : activeTrackedOrder?.id,
      trackingOrderOverride ? { fulfillmentMode: trackingOrderValues.fulfillmentMode, orderDraft: trackingOrderOverride } : undefined,
    );
  }, [activeTrackedOrder?.id, openTrackedOrder, trackingOrderOverride, trackingOrderValues.fulfillmentMode]);

  const returnOrdersList = React.useCallback(() => {
    setRoute((prev) => { void prev; return 'orders-list'; });
  }, [setRoute]);

  const handleCancelOrder = React.useCallback(() => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config || !selectedOrderId) return;

    const orderClient = createDshOrderLifecycleHttpClient(config.baseUrl, undefined, checkoutAuth);
    orderClient.cancelOrder(selectedOrderId, { actor: 'client', note: 'إلغاء الطلب من قبل العميل' })
      .then(() => orderClient.getOrder(selectedOrderId))
      .then((details) => {
        setLiveOrderDetails(details);
        setOrdersListState((cur) => cur.map((item) =>
          item.id === selectedOrderId ? { ...item, statusLabel: 'تم الإلغاء', clientState: hostClientStates.cancelled } : item
        ));
      })
      .catch((err) => console.error('Failed to cancel live order:', err));
  }, [checkoutAuth, selectedOrderId]);

  const handleSupportEscalation = React.useCallback(async (issueType: string, description: string) => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config || !selectedOrderId) return;

    const orderClient = createDshOrderLifecycleHttpClient(config.baseUrl, undefined, checkoutAuth);
    await orderClient.createSupportEscalation({ order_id: selectedOrderId, actor: 'client', issue_type: issueType as any, description });
    const details = await orderClient.getOrder(selectedOrderId);
    setLiveOrderDetails(details);
  }, [checkoutAuth, selectedOrderId]);

  return {
    selectedOrderId, setSelectedOrderId,
    ordersListState, setOrdersListState,
    liveOrderDetails,
    trackingClientState, setTrackingClientState,
    trackingOrderOverride, setTrackingOrderOverride,
    ordersQuery, setOrdersQuery,
    filteredOrders, activeTrackedOrder,
    trackingOrderValues, trackingTimeline, trackingWltIntent,
    openTrackedOrder, reopenTracking, returnOrdersList,
    handleCancelOrder, handleSupportEscalation,
  };
}
