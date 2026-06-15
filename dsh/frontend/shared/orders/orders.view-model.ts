import React from 'react';
import { Platform } from 'react-native';

import {
  resolveDshDiscoveryStoresRuntimeConfig,
} from '../stores';
import type { DshCheckoutAuthContext } from '../checkout';

import {
  type DshFulfillmentDeliveryMode,
  type CreateOrderValues,
  type HostOrderSummary,
  type DshClientCreateOrderRequest,
  type DshClientDeliveryLifecycleStatus,
  type DshClientExceptionReason,
  type DshClientHandoffVerification,
  type DshClientProofOfDeliveryVisibility,
  type DshClientAddressSnapshot,
  type DshClientFulfillmentModeSnapshot,
  type DshClientServiceabilityQuote,
  type DshClientEventTimelineItem,
  type DshClientWalletImpactVisibility,
  type DshRoute,
  hostClientStates,
  getDshClientFlowPolicy,
} from '../checkout/dsh-client-binding.contracts';

import {
  getClientWltIntentForState,
  type DshClientWltIntentEntry,
} from '../finance-boundary';

import {
  getDshClientStateMeta,
  type DshClientState,
} from './orders.client-state';

import {
  getDshFlowPolicySummary,
  resolveDshOnDemandPolicyLabel,
} from '../runtime/dsh-flow-registry';

import { resolveDshControlPanelSectionLabel } from '../control-panel';
import { getDshOrderLifecycleRuntimeClient } from '../runtime/ui-only-runtime-clients';
import { fetchDshRuntimeOrders } from '../operations/dsh-operational-runtime-adapter';

import {
  getClientOrderStatusLabel,
  CLIENT_ORDER_TERMINAL_STATUSES,
} from './orders.adapters';

import { mapRuntimeRowToPartnerOrderItem } from '../partner';

import {
  createDshOrderLifecycleHttpClient,
  resolveDshOrderApiBaseUrl,
  type DshOrderDetailsResponse,
} from './orders.api';

import {
  DSH_ORDER_JOURNEY_STEPS,
  type DshSmartProximityState,
  type DshSmartTrackingSnapshot,
  type DshOrderJourneyStage,
} from './orders.state-machine';

import { initialOrders } from './orders-seed-or-runtime.model';

// ─── useDshOrderTracking Hook ────────────────────────────────────────────────

function statusToClientState(status: string): DshClientState {
  if (status === 'DELIVERED') return hostClientStates.delivered;
  if (status === 'CANCELLED') return hostClientStates.cancelled;
  if (CLIENT_ORDER_TERMINAL_STATUSES.has(status)) return hostClientStates.delivered;
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

  React.useEffect(() => {
    if (route !== 'orders-list') return undefined;
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) return undefined;
    let cancelled = false;
    const orderClient = getDshOrderLifecycleRuntimeClient(checkoutAuth);
    orderClient.listOrders({ limit: 50 })
      .then((resp) => {
        if (cancelled || !resp.orders.length) return;
        const mapped: HostOrderSummary[] = resp.orders.map((o) => ({
          id: o.id,
          title: o.store_id,
          subtitle: '',
          statusLabel: getClientOrderStatusLabel(o.status),
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

  React.useEffect(() => {
    if (route !== 'tracking' || !selectedOrderId) {
      setLiveOrderDetails(null);
      return undefined;
    }
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) { setLiveOrderDetails(null); return undefined; }

    const orderClient = getDshOrderLifecycleRuntimeClient(checkoutAuth);
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
          if (CLIENT_ORDER_TERMINAL_STATUSES.has(details.order.status)) return;
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

    const orderClient = getDshOrderLifecycleRuntimeClient(checkoutAuth);
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

    const orderClient = getDshOrderLifecycleRuntimeClient(checkoutAuth);
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

// ─── Tracking Helpers ────────────────────────────────────────────────────────

export type DshOrderListItem = {
  id: string;
  orderNumber?: string;
  title: string;
  statusLabel: string;
  timestamp?: string;
  total?: string;
  isActive?: boolean;
  fulfillmentMode?: DshFulfillmentDeliveryMode;
  rawStatus?: DshClientState;
  summary?: string;
  location?: string;
};

export type JourneyStep = { id: string; title: string; detail: string };
export type JourneyPhase = 'route' | 'arrived' | 'received';

export type OrderChatAttachmentKind = 'voice' | 'camera' | 'video' | 'attachment';

export type OrderChatAttachment = {
  kind: OrderChatAttachmentKind;
  label: string;
  selectedLabel: string;
  detail: string;
  tone: 'brand' | 'info' | 'warning';
  iconName: string;
};

export type OrderChatMessage = {
  id: string;
  senderLabel: string;
  body: string;
  time: string;
  tone: 'brand' | 'info' | 'warning';
  align: 'start' | 'end' | 'center';
  attachments?: OrderChatAttachmentKind[];
};

export const defaultCreateOrderValues: CreateOrderValues = {
  fulfillmentMode: 'bthwani_delivery',
  pickupAddress: 'رياض بارك، البوابة 2',
  dropoffAddress: 'العليا، طريق الملك فهد',
  contactName: 'أحمد',
  contactPhone: '770000000',
  note: 'لا توجد ملاحظات',
};

export const FULL_JOURNEY_STEPS: JourneyStep[] = DSH_ORDER_JOURNEY_STEPS;

export const orderChatAttachmentOptions: Record<OrderChatAttachmentKind, OrderChatAttachment> = {
  camera: { kind: 'camera', label: 'كاميرا', selectedLabel: 'صورة مرفقة', detail: 'إرسال صورة مرتبطة مباشرة بالطلب الحالي.', tone: 'brand', iconName: 'camera-outline' },
  video: { kind: 'video', label: 'فيديو', selectedLabel: 'فيديو مرفق', detail: 'إرسال فيديو قصير يوضح حالة الطلب.', tone: 'info', iconName: 'videocam-outline' },
  voice: { kind: 'voice', label: 'صوت', selectedLabel: 'رسالة صوتية', detail: 'إرسال رسالة صوتية مرتبطة بنفس الطلب.', tone: 'warning', iconName: 'mic-outline' },
  attachment: { kind: 'attachment', label: 'مرفق', selectedLabel: 'مرفق مرتبط', detail: 'إضافة مرفق مرجعي داخل سياق الطلب.', tone: 'brand', iconName: 'attach-outline' },
};

export const defaultOrderListItems: DshOrderListItem[] = [
  { id: 'order-active', orderNumber: '3770281', title: 'شاورما هليل', statusLabel: 'جاري التوصيل', timestamp: '2026-05-17T22:15:30+03:00', isActive: true, fulfillmentMode: 'bthwani_delivery', rawStatus: 'tracking_active', total: '4,500 ر.ي', summary: '٢ وجبة شاورما هليل كلاسيك، ١ بطاطس عائلي، ١ عصير برتقال', location: 'المنزل' },
  { id: 'order-review', orderNumber: '3770198', title: 'مطعم القلعة', statusLabel: 'قيد المراجعة', timestamp: '2026-05-17T21:46:43+03:00', isActive: true, fulfillmentMode: 'partner_delivery', rawStatus: 'order_created', total: '12,000 ر.ي', summary: '١ كبسة لحم حاشي، ٢ كولا، ١ سلطة حارة', location: 'العمل' },
  { id: 'order-done', orderNumber: '3768910', title: 'شاورمر', statusLabel: 'تم التسليم', timestamp: '2026-05-16T19:30:00+03:00', isActive: false, fulfillmentMode: 'bthwani_delivery', rawStatus: 'delivered', total: '8,400 ر.ي', summary: '٣ وجبة شاورما عربي، ١ بطاطس تويستر كبير', location: 'المنزل' },
  { id: 'order-pickup-ready', orderNumber: '3768800', title: 'دانكن دونتس', statusLabel: 'جاهز للاستلام', timestamp: '2026-05-16T11:00:00+03:00', isActive: false, fulfillmentMode: 'pickup', rawStatus: 'delivered', total: '3,500 ر.ي', summary: '٦ حبات دونات مشكل، ١ قهوة باردة كبيرة', location: 'فرع التحرير' },
  { id: 'order-failed', orderNumber: '3765100', title: 'بارنز كافيه', statusLabel: 'فشل الدفع', timestamp: '2026-05-15T09:15:00+03:00', isActive: false, fulfillmentMode: 'bthwani_delivery', rawStatus: 'failed', total: '2,800 ر.ي', summary: '١ قهوة تركية، ١ دونات زعتر', location: 'العمل' },
];

export const SMART_TRACKING_SEQUENCE: DshSmartProximityState[] = ['enroute', 'near_customer', 'at_door', 'bell_rang'];

export function resolveEscalationOwnerLabel(ownerSurface?: string): string {
  if (ownerSurface === 'control-panel') return resolveDshControlPanelSectionLabel('support');
  if (ownerSurface === 'app-field') return 'الفريق الميداني';
  if (ownerSurface === 'app-captain') return 'فريق الكابتن';
  if (ownerSurface === 'app-client') return 'واجهة العميل';
  return ownerSurface ?? 'غير محدد';
}

export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeClientFacingOrderState(clientState: DshClientState): DshClientState {
  if (['quote', 'serviceability', 'checkout_ready', 'payment_pending', 'payment_failed', 'item_unavailable', 'area_unserviceable'].includes(clientState)) {
    return 'order_created';
  }
  return clientState;
}

export function getStepModeOverride(stepId: string, mode: DshFulfillmentDeliveryMode): { title: string; detail: string } | null {
  const overrides: Record<DshFulfillmentDeliveryMode, Partial<Record<string, { title: string; detail: string }>>> = {
    bthwani_delivery: {
      ready_for_pickup: { title: 'جاهز للاستلام', detail: 'الطلب جاهز، الكابتن في الطريق.' },
      captain_assigned: { title: 'تم تعيين الكابتن', detail: 'كابتن مكلّف وهو في طريقه للاستلام.' },
      picked_up: { title: 'استلم الكابتن الطلب', detail: 'الطلب مع الكابتن متجهًا نحوك.' },
      enroute_to_customer: { title: 'في الطريق إليك', detail: 'الطلب في الطريق مع الكابتن. تحديث كل 3 دقائق.' },
      near_customer: { title: 'الطلب قريب منك', detail: 'الكابتن على مقربة من موقعك.' },
      at_door: { title: 'الكابتن عند بابك', detail: 'وصل الكابتن إلى موقع التسليم.' },
      bell_rang: { title: 'تم قرع الجرس', detail: 'الكابتن أرسل إشعار وصوله. استعد لاستلام طلبك.' },
    },
    partner_delivery: {
      ready_for_pickup: { title: 'جاهز للاستلام', detail: 'الطلب جاهز، بانتظار موصل المتجر.' },
      captain_assigned: { title: 'تم تعيين موصل المتجر', detail: 'موصل المتجر مكلّف وهو في طريقه.' },
      picked_up: { title: 'استلم موصل المتجر الطلب', detail: 'الطلب مع موصل المتجر متجهًا نحوك.' },
      enroute_to_customer: { title: 'في الطريق إليك', detail: 'موصل المتجر في الطريق. تحديث كل 3 دقائق.' },
      near_customer: { title: 'الطلب قريب منك', detail: 'موصل المتجر على مقربة من موقعك.' },
      at_door: { title: 'موصل المتجر عند بابك', detail: 'وصل موصل المتجر إلى موقع التسليم.' },
      bell_rang: { title: 'تم قرع الجرس', detail: 'أُرسل إشعار الوصول. استعد لاستلام طلبك.' },
    },
    pickup: {
      ready_for_pickup: { title: 'الطلب جاهز للاستلام', detail: 'توجه إلى المتجر لاستلام طلبك.' },
      captain_assigned: { title: 'بانتظار استلامك', detail: 'الطلب محفوظ بانتظار وصولك للمتجر.' },
      picked_up: { title: 'تأكيد من المتجر', detail: 'المتجر جاهز لتسليمك الطلب.' },
      enroute_to_customer: { title: 'في الطريق إلى المتجر', detail: 'يرجى التوجه إلى المتجر مباشرة.' },
      near_customer: { title: 'على وشك الوصول', detail: 'يبدو أنك قريب من المتجر.' },
      at_door: { title: 'استلم طلبك', detail: 'أنت عند المتجر. أبرز رقم طلبك للاستلام.' },
      bell_rang: { title: 'تأكيد الاستلام', detail: 'انتظر تأكيد المتجر لاستلامك للطلب.' },
    },
  };
  return overrides[mode]?.[stepId] ?? null;
}

export function lifecycleToStepId(status: DshClientDeliveryLifecycleStatus): string {
  switch (status) {
    case 'quote': case 'created': return 'order_submitted';
    case 'confirmed': return 'operations_review';
    case 'operations_approved': return 'operations_approved';
    case 'order_received': case 'partner_accepted': return 'order_received';
    case 'preparing': return 'preparing';
    case 'ready_for_pickup': return 'ready_for_pickup';
    case 'captain_assigned': case 'enroute_to_pickup': case 'arrived_at_pickup': return 'captain_assigned';
    case 'picked_up': return 'picked_up';
    case 'enroute_to_dropoff': return 'enroute_to_customer';
    case 'near_customer': return 'near_customer';
    case 'at_door': return 'at_door';
    case 'bell_rang': return 'bell_rang';
    case 'arrived_at_dropoff': case 'delivered': return 'delivered';
    default: return 'order_submitted';
  }
}

export function getMilestoneIndex(stepId: string): number {
  switch (stepId) {
    case 'order_submitted': case 'operations_review': case 'operations_approved': return 0;
    case 'order_received': case 'preparing': case 'ready_for_pickup': return 1;
    case 'captain_assigned': case 'picked_up': case 'enroute_to_customer': return 2;
    case 'near_customer': case 'at_door': case 'bell_rang': case 'delivered': return 3;
    default: return 0;
  }
}

export function formatOrderTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  } catch { return isoString; }
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const now = new Date();
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const diffMins = Math.floor((now.getTime() - d.getTime()) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffMins / 1440);
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) { if (diffHours === 1) return 'منذ ساعة'; if (diffHours === 2) return 'منذ ساعتين'; return `منذ ${diffHours} ساعات`; }
    if (diffDays === 1) return 'أمس';
    if (diffDays === 2) return 'قبل يومين';
    return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  } catch { return isoString; }
}

export function getClientWalletVisibilityCopy(clientStateMeta: ReturnType<typeof getDshClientStateMeta>): { title: string; description: string } | null {
  if (clientStateMeta.visibility.walletRefundVisible) {
    return {
      title: 'وضع الاسترداد',
      description: clientStateMeta.state === 'refund_pending'
        ? 'الاسترداد قيد المعالجة حاليًا. لا يلزم أي إجراء مالي إضافي من العميل حتى يكتمل تحديث الحالة.'
        : clientStateMeta.state === 'refunded'
          ? 'تم تثبيت الاسترداد للعميل ويمكنه مراجعة الأثر المالي النهائي بوضوح.'
          : 'توجد معلومة استرداد ظاهرة مرتبطة بهذه الحالة ويجب إبقاؤها واضحة للعميل داخل نفس المسار.',
    };
  }
  if (clientStateMeta.visibility.walletCreditVisible) {
    return { title: 'وضع الرصيد', description: 'يوجد رصيد ظاهر للعميل داخل المحفظة. هذا العرض يوضح المعلومة فقط من دون تنفيذ أي ربط أو حركة مالية.' };
  }
  return null;
}

export function formatDeliveryLifecycleStatus(status: DshClientDeliveryLifecycleStatus): string {
  const labels: Record<DshClientDeliveryLifecycleStatus, string> = {
    quote: 'التسعير والجاهزية', created: 'تم إنشاء الطلب', confirmed: 'قيد مراجعة العمليات', operations_approved: 'تمت الموافقة من العمليات', order_received: 'استلم المتجر الطلب', partner_accepted: 'قبول الشريك', preparing: 'قيد التجهيز', ready_for_pickup: 'جاهز للاستلام', captain_assigned: 'تم تعيين الكابتن', enroute_to_pickup: 'في الطريق إلى الاستلام', arrived_at_pickup: 'وصل إلى نقطة الاستلام', picked_up: 'تم الاستلام من المتجر', enroute_to_dropoff: 'في الطريق إلى العميل', near_customer: 'الطلب قريب منك', at_door: 'الطلب عند بابك', bell_rang: 'الكابتن ضغط زر الجرس', arrived_at_dropoff: 'وصل إلى العميل', delivered: 'تم التسليم', cancelled: 'تم الإلغاء', failed: 'فشل التنفيذ', returned: 'قيد الإرجاع / الاسترداد', refund_pending: 'الاسترداد قيد المعالجة', refunded: 'تم الاسترداد',
  };
  return labels[status];
}

export function formatExceptionReason(reason: DshClientExceptionReason): string {
  const labels: Record<DshClientExceptionReason, string> = {
    store_closed: 'المتجر مغلق', item_unavailable: 'العنصر غير متاح', customer_unreachable: 'تعذر الوصول إلى العميل', address_not_found: 'تعذر العثور على العنوان', unable_to_access: 'تعذر الوصول إلى نقطة التسليم', captain_no_show: 'الكابتن لم يحضر', partner_delay: 'تأخر الشريك', payment_failed: 'فشل الدفع', system_outage: 'عطل بالنظام', area_unserviceable: 'المنطقة خارج التغطية', refund_required: 'استرداد مطلوب', return_required: 'إرجاع مطلوب', redispatch_required: 'إعادة إسناد مطلوبة',
  };
  return labels[reason];
}

export function formatProofType(proofType: DshClientProofOfDeliveryVisibility['proof_type']): string {
  const labels: Record<DshClientProofOfDeliveryVisibility['proof_type'], string> = { none: 'لا يوجد', photo: 'صورة', signature: 'توقيع', otp: 'OTP', pin: 'PIN', qr: 'QR', barcode: 'Barcode' };
  return labels[proofType];
}

export function formatVerificationResult(result: DshClientProofOfDeliveryVisibility['verification_result']): string {
  const labels: Record<DshClientProofOfDeliveryVisibility['verification_result'], string> = { not_required: 'غير مطلوب', pending: 'قيد الانتظار', verified: 'تم التحقق', failed: 'فشل التحقق' };
  return labels[result];
}

export function formatFulfillmentMode(mode: DshClientFulfillmentModeSnapshot['mode']): string {
  const labels: Record<DshClientFulfillmentModeSnapshot['mode'], string> = { instant: 'فوري', scheduled: 'مجدول', pickup: 'استلام من المتجر', partner_delivery: 'توصيل المتجر', bthwani_delivery: 'توصيل بثواني' };
  return labels[mode];
}

export function formatCapacityState(state: DshClientFulfillmentModeSnapshot['capacity_state']): string {
  const labels: Record<DshClientFulfillmentModeSnapshot['capacity_state'], string> = { available: 'متاح', limited: 'محدود', full: 'ممتلئ', paused: 'متوقف مؤقتًا' };
  return labels[state];
}

export function getDefaultExceptionReason(clientState: DshClientState): DshClientExceptionReason | null {
  if (clientState === 'store_closed') return 'store_closed';
  if (clientState === 'area_unserviceable') return 'area_unserviceable';
  if (clientState === 'item_unavailable') return 'item_unavailable';
  if (clientState === 'payment_failed') return 'payment_failed';
  if (clientState === 'cancelled') return 'refund_required';
  if (clientState === 'failed') return 'redispatch_required';
  if (clientState === 'refund_pending' || clientState === 'refunded') return 'refund_required';
  return null;
}

export function buildDefaultServiceabilityQuote(clientState: DshClientState): DshClientServiceabilityQuote {
  const unavailableReason = getDefaultExceptionReason(clientState);
  const insideCoverage = clientState !== 'area_unserviceable';
  const itemsAvailable = clientState !== 'item_unavailable';
  const storeOpen = clientState !== 'store_closed';
  return {
    address_valid: insideCoverage, inside_coverage: insideCoverage, store_open: storeOpen, items_available: itemsAvailable,
    delivery_fee: insideCoverage && storeOpen ? 22 : 0,
    eta_pickup: storeOpen ? '2026-05-01T20:05:00+03:00' : null,
    eta_dropoff: insideCoverage && itemsAvailable ? '2026-05-01T20:28:00+03:00' : null,
    quote_expires_at: '2026-05-01T20:15:00+03:00',
    unavailable_reason: unavailableReason,
    fallback_fulfillment_method: insideCoverage ? (itemsAvailable ? null : 'pickup') : 'scheduled',
  };
}

export function buildDefaultAddressSnapshot(values: CreateOrderValues): DshClientAddressSnapshot {
  return {
    address_label: values.dropoffAddress || 'غير محدد',
    pin_adjustment: null,
    reverse_lookup_label: `${values.pickupAddress || 'الاستلام'} → ${values.dropoffAddress || 'التسليم'}`,
    delivery_notes: values.note || 'لا توجد ملاحظات',
    building: 'المدخل الرئيسي', floor: '1', apartment: 'A3',
    landmark: 'بجوار البوابة الرئيسية', geocode_confidence: 'medium', address_risk_flag: false,
  };
}

export function buildDefaultFulfillmentModeSnapshot(clientState: DshClientState): DshClientFulfillmentModeSnapshot {
  return {
    mode: clientState === 'area_unserviceable' ? 'scheduled' : 'bthwani_delivery',
    available_windows: [
      { start_at: '2026-05-01T20:00:00+03:00', end_at: '2026-05-01T20:45:00+03:00', label: 'فوري' },
      { start_at: '2026-05-01T21:00:00+03:00', end_at: '2026-05-01T21:45:00+03:00', label: 'النافذة التالية' },
    ],
    capacity_state: clientState === 'payment_failed' ? 'limited' : clientState === 'area_unserviceable' ? 'paused' : 'available',
    slot_reserved_until: clientState === 'area_unserviceable' ? null : '2026-05-01T20:12:00+03:00',
    store_busy: clientState === 'item_unavailable', area_busy: clientState === 'area_unserviceable',
    captain_supply_low: clientState === 'payment_pending',
  };
}

export function buildDefaultLifecycleStatus(clientState: DshClientState, phase: JourneyPhase = 'route'): DshClientDeliveryLifecycleStatus {
  if (['quote', 'serviceability', 'area_unserviceable', 'item_unavailable', 'payment_failed', 'checkout_ready', 'payment_pending'].includes(clientState)) return 'quote';
  if (clientState === 'order_created') return 'confirmed';
  if (clientState === 'order_confirmed') return 'operations_approved';
  if (clientState === 'cancelled') return 'cancelled';
  if (clientState === 'failed') return 'failed';
  if (clientState === 'refund_pending') return 'returned';
  if (clientState === 'refunded' || clientState === 'wallet_refund_visible') return 'refunded';
  if (clientState === 'delivered') return 'delivered';
  if (phase === 'received') return 'delivered';
  if (phase === 'arrived') return 'at_door';
  return 'enroute_to_dropoff';
}

export function buildDefaultEventTimeline(
  clientState: DshClientState,
  timeline: DshTrackingTimelineItem[],
  phase: JourneyPhase = 'route',
): DshClientEventTimelineItem[] {
  const defaultLifecycle = buildDefaultLifecycleStatus(clientState, phase);
  const exceptionReason = getDefaultExceptionReason(clientState);
  if (!timeline.length) {
    return [{ event_id: `event-${clientState}`, order_id: 'dsh-order-active', delivery_id: 'dsh-delivery-active', actor_id: 'system', actor_role: 'system', from_status: null, to_status: defaultLifecycle, timestamp: '2026-05-01T20:20:00+03:00', source: 'system', reason_code: exceptionReason, notes: getDshClientStateMeta(clientState).description, evidence_attachment_optional: null }];
  }
  const statusByStepId: Record<string, DshClientDeliveryLifecycleStatus> = { route: 'enroute_to_dropoff', arrived: 'at_door', received: 'delivered' };
  const defaultStatuses: DshClientDeliveryLifecycleStatus[] = ['enroute_to_dropoff', 'at_door', 'delivered'];
  return timeline.map((item, index) => {
    const toStatus = statusByStepId[item.id] ?? defaultStatuses[Math.min(index, defaultStatuses.length - 1)] ?? defaultLifecycle;
    const previousStatus = index === 0
      ? (clientState === 'tracking_active' || clientState === 'delivered' ? 'picked_up' : null)
      : (statusByStepId[timeline[index - 1]?.id] ?? defaultStatuses[Math.min(index - 1, defaultStatuses.length - 1)] ?? null);
    return {
      event_id: `event-${item.id}`, order_id: 'dsh-order-active', delivery_id: 'dsh-delivery-active',
      actor_id: item.id === 'received' ? 'client' : 'captain-01',
      actor_role: item.id === 'received' ? 'client' : 'captain',
      from_status: previousStatus, to_status: toStatus,
      timestamp: `2026-05-01T20:${10 + index * 8}:00+03:00`, source: 'system',
      reason_code: index === timeline.length - 1 ? exceptionReason : null,
      notes: item.detail,
      evidence_attachment_optional: item.id === 'received' ? { asset_id: 'proof-delivered-01', asset_type: 'image', note: 'إثبات مرتبط بتثبيت التسليم النهائي.' } : null,
    };
  });
}

export function buildDefaultProofOfDelivery(clientState: DshClientState, phase: JourneyPhase = 'route'): DshClientProofOfDeliveryVisibility {
  if (clientState === 'delivered' || phase === 'received') {
    return { proof_type: 'none', is_required: false, captured_by: 'captain', captured_at: '2026-05-01T20:30:00+03:00', proof_asset_url: null, verification_result: 'verified', failure_reason: null, customer_visible: false };
  }
  return { proof_type: 'none', is_required: false, captured_by: null, captured_at: null, proof_asset_url: null, verification_result: 'not_required', failure_reason: null, customer_visible: false };
}

export function buildDefaultHandoffVerification(): DshClientHandoffVerification {
  return { pickup_reference: 'PK-DSH-2201', pickup_code_or_barcode: 'PICK-2201', dropoff_otp: null, contactless_allowed: true, customer_instructions: 'سلّم الطلب عند الباب واتصل قبل الوصول.', partner_instructions: 'ثبّت المطابقة قبل تسليم الكيس النهائي.', captain_handoff_notes: 'جرى تثبيت نقطة التسليم في المدخل الرئيسي.' };
}

export function buildDefaultWalletImpact(clientState: DshClientState): DshClientWalletImpactVisibility | null {
  if (clientState === 'refund_pending') return { paid_amount: 148, delivery_fee: 22, discount: 8, wallet_credit: 0, wallet_debit: 140, refund_pending: 140, refund_completed: 0, compensation: 12, note: 'الاسترداد قيد المعالجة مع تعويض انتظار ظاهر للعميل.' };
  if (clientState === 'refunded' || clientState === 'wallet_refund_visible') return { paid_amount: 148, delivery_fee: 22, discount: 8, wallet_credit: 140, wallet_debit: 140, refund_pending: 0, refund_completed: 140, compensation: 12, note: 'اكتمل الأثر المالي النهائي ويمكن للعميل مراجعته من نفس المسار.' };
  if (clientState === 'wallet_credit_visible') return { paid_amount: 0, delivery_fee: 0, discount: 0, wallet_credit: 45, wallet_debit: 0, refund_pending: 0, refund_completed: 0, compensation: 45, note: 'تعويض رصيد ظاهر في المحفظة بدون أي ربط تنفيذي إضافي.' };
  return null;
}

export function mapLiveOrderStatusToClientState(status: string): { clientState: DshClientState; statusLabel: string } | null {
  switch (status) {
    case 'CREATED': return { clientState: 'order_created', statusLabel: 'قيد المراجعة' };
    case 'ACCEPTED': return { clientState: 'order_confirmed', statusLabel: 'تم القبول' };
    case 'READY_FOR_PICKUP': return { clientState: 'tracking_active', statusLabel: 'جاهز للاستلام' };
    case 'DELIVERED': return { clientState: 'delivered', statusLabel: 'تم التوصيل' };
    case 'CANCELLED': return { clientState: 'cancelled', statusLabel: 'تم الإلغاء' };
    default: return null;
  }
}

export function useSmartTrackingHeartbeat(phase: JourneyPhase): DshSmartTrackingSnapshot {
  const [state, setState] = React.useState<DshSmartTrackingSnapshot>({
    source: 'runtime_unbound', cadenceMinutes: 3, isLiveMap: false, lastUpdateMinutesAgo: 0,
    etaMinutes: null, proximityState: 'enroute', bellRang: false,
  });
  React.useEffect(() => {
    setState({ source: 'runtime_unbound', cadenceMinutes: 3, isLiveMap: false, lastUpdateMinutesAgo: 0, etaMinutes: null, proximityState: phase === 'arrived' ? 'near_customer' : 'enroute', bellRang: false });
  }, [phase]);
  return state;
}

// ─── useCaptainOrderRuntime Hook ─────────────────────────────────────────────

export type DshCaptainLifecycleStatus = 'EN_ROUTE' | 'ARRIVED';

export type DshCaptainLocationPush = {
  readonly orderId: string;
  readonly captainId: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly lifecycleStatus: string;
  readonly orderStatus?: DshCaptainLifecycleStatus;
};

export type DshCaptainActiveLocationPushConfig = {
  readonly activeOrderId: string;
  readonly captainId: string;
  readonly lifecycleStatus: string | undefined;
};

const activeDeliveryStates = new Set(['offer-accepting', 'offer-accepted']);

export function resolveDshRuntimeOrderId(orderId: string): string {
  return orderId.startsWith('captain-order-') ? orderId.replace('captain-order-', '') : orderId;
}

export function useCaptainOrderRuntime() {
  const orderLifecycleClient = React.useMemo(
    () => createDshOrderLifecycleHttpClient(resolveDshOrderApiBaseUrl()),
    [],
  );

  const acceptTask = React.useCallback(
    (orderId: string, captainId: string) =>
      orderLifecycleClient.acceptTask(resolveDshRuntimeOrderId(orderId), { captain_id: captainId }),
    [orderLifecycleClient],
  );

  const declineTask = React.useCallback(
    (orderId: string, captainId: string, reason: string) =>
      orderLifecycleClient.declineTask(resolveDshRuntimeOrderId(orderId), { captain_id: captainId, reason }),
    [orderLifecycleClient],
  );

  const confirmPickup = React.useCallback(
    (orderId: string, captainId: string) =>
      orderLifecycleClient.confirmPickup(resolveDshRuntimeOrderId(orderId), { captain_id: captainId }),
    [orderLifecycleClient],
  );

  const pushLocation = React.useCallback(
    (push: DshCaptainLocationPush) =>
      orderLifecycleClient.pushLocation(resolveDshRuntimeOrderId(push.orderId), {
        captain_id: push.captainId,
        latitude: push.latitude,
        longitude: push.longitude,
        lifecycle_status: push.lifecycleStatus,
        order_status: push.orderStatus,
      }),
    [orderLifecycleClient],
  );

  const deliverOrder = React.useCallback(
    (orderId: string, captainId: string, podMediaKey?: string) =>
      orderLifecycleClient.deliverOrder(resolveDshRuntimeOrderId(orderId), {
        captain_id: captainId,
        ...(podMediaKey ? { pod_media_key: podMediaKey } : {}),
      }),
    [orderLifecycleClient],
  );

  const failDelivery = React.useCallback(
    (orderId: string, captainId: string) =>
      orderLifecycleClient.failDelivery(resolveDshRuntimeOrderId(orderId), {
        captain_id: captainId,
        failure_reason: 'CLIENT_UNREACHABLE',
        return_required: true,
      }),
    [orderLifecycleClient],
  );

  return React.useMemo(
    () => ({
      acceptTask,
      declineTask,
      confirmPickup,
      pushLocation,
      deliverOrder,
      failDelivery,
    }),
    [acceptTask, confirmPickup, declineTask, deliverOrder, failDelivery, pushLocation],
  );
}

export function useCaptainActiveLocationPush({
  activeOrderId,
  captainId,
  lifecycleStatus,
}: DshCaptainActiveLocationPushConfig) {
  const captainOrderRuntime = useCaptainOrderRuntime();

  React.useEffect(() => {
    if (!lifecycleStatus || !activeDeliveryStates.has(lifecycleStatus)) return undefined;
    if (!activeOrderId || !captainId) return undefined;

    let cancelled = false;
    let watchId: number | null = null;

    const postLocation = (latitude: number, longitude: number) => {
      if (cancelled) return;
      captainOrderRuntime.pushLocation({
        orderId: activeOrderId,
        captainId,
        latitude,
        longitude,
        lifecycleStatus,
        orderStatus: 'EN_ROUTE',
      }).catch(() => {
        // Location push failures are non-fatal for the UI binding.
      });
    };

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => postLocation(pos.coords.latitude, pos.coords.longitude),
        () => undefined,
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 8000 },
      );
    }

    return () => {
      cancelled = true;
      if (watchId !== null && Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [activeOrderId, captainId, captainOrderRuntime, lifecycleStatus]);
}

// ─── usePartnerOrdersRuntime Hook ────────────────────────────────────────────

type PartnerOrderItemLike = ReturnType<typeof mapRuntimeRowToPartnerOrderItem>;
type PartnerOrdersState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';

export function usePartnerOrdersRuntime(route: string) {
  const [orders, setOrders] = React.useState<readonly PartnerOrderItemLike[]>([]);
  const [state, setState] = React.useState<PartnerOrdersState>('loading');

  const orderLifecycleClient = React.useMemo(
    () => createDshOrderLifecycleHttpClient(resolveDshOrderApiBaseUrl()),
    [],
  );

  React.useEffect(() => {
    if (route !== 'inbox') return;
    let cancelled = false;
    setState('loading');
    fetchDshRuntimeOrders({ limit: 100 }).then((result) => {
      if (cancelled) return;
      if (result.kind === 'ok') {
        const nextOrders = result.orders.map(mapRuntimeRowToPartnerOrderItem);
        setOrders(nextOrders);
        setState(nextOrders.length === 0 ? 'empty' : 'ready');
      } else if (result.kind === 'offline') {
        setState('offline');
      } else {
        setState('error');
      }
    }).catch(() => {
      if (!cancelled) setState('error');
    });
    return () => {
      cancelled = true;
    };
  }, [route]);

  const markReady = React.useCallback(
    (orderId: string) => {
      orderLifecycleClient
        .updateOrderStatus(orderId, { actor: 'partner', status: 'READY_FOR_PICKUP' })
        .then(() => {
          setOrders((prev) =>
            prev.map((item) =>
              item.id === orderId ? { ...item, status: 'ready' as const } : item,
            ),
          );
        })
        .catch(() => {
          // Keep the current row state so the caller can retry the action.
        });
    },
    [orderLifecycleClient],
  );

  return {
    orders,
    state,
    markReady,
  } as const;
}
