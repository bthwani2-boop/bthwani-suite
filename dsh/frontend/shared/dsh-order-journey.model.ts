/**
 * DSH Order Journey — Shared Model (UI_PREVIEW_ONLY)
 *
 * Single source of truth for the full delivery journey shared across surfaces:
 * app-client (tracking), app-captain (execution), app-partner (preparation),
 * and control-panel/operations (approval). No backend binding.
 */

// ─── Journey stage identifiers ────────────────────────────────────────────────

export type DshOrderJourneyStageId =
  | 'order_submitted'
  | 'operations_review'
  | 'operations_approved'
  | 'order_received'
  | 'preparing'
  | 'ready_for_pickup'
  | 'captain_assigned'
  | 'picked_up'
  | 'enroute_to_customer'
  | 'near_customer'
  | 'at_door'
  | 'bell_rang'
  | 'delivered';

export type DshOrderJourneyStage = {
  id: DshOrderJourneyStageId;
  title: string;
  detail: string;
};

// ─── Journey actors and events ─────────────────────────────────────────────────

export type DshOrderJourneyActor = 'client' | 'store' | 'partner' | 'captain' | 'support' | 'system';

export type DshOrderJourneyEvent = {
  eventId: string;
  orderId: string;
  actor: DshOrderJourneyActor;
  fromStage: DshOrderJourneyStageId | null;
  toStage: DshOrderJourneyStageId;
  timestamp: string;
  note: string | null;
};

// ─── Lifecycle status (operations-facing, mirrors DshClientDeliveryLifecycleStatus) ──

export type DshOrderLifecycleStatus =
  | 'quote'
  | 'created'
  | 'confirmed'
  | 'operations_approved'
  | 'order_received'
  | 'partner_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'captain_assigned'
  | 'enroute_to_pickup'
  | 'arrived_at_pickup'
  | 'picked_up'
  | 'enroute_to_dropoff'
  | 'near_customer'
  | 'at_door'
  | 'bell_rang'
  | 'arrived_at_dropoff'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'returned'
  | 'refunded';

// ─── Smart tracking snapshot ───────────────────────────────────────────────────

export type DshSmartProximityState = 'enroute' | 'near_customer' | 'at_door' | 'bell_rang';

/**
 * Snapshot produced by a captain heartbeat tick.
 * source: 'captain_heartbeat_demo' — no live GPS, no real-time stream.
 * cadenceMinutes: 3 — ticks every 3 minutes.
 * isLiveMap: false — no map rendered from this data.
 */
export type DshSmartTrackingSnapshot = {
  source: 'captain_heartbeat_demo';
  cadenceMinutes: 3;
  isLiveMap: false;
  lastUpdateMinutesAgo: number;
  etaMinutes: number | null;
  proximityState: DshSmartProximityState;
  bellRang: boolean;
};

// ─── Captain heartbeat and bell event ─────────────────────────────────────────

export type DshCaptainHeartbeatSnapshot = {
  orderId: string;
  captainId: string;
  timestamp: string;
  etaMinutes: number | null;
  proximityState: DshSmartProximityState;
};

/** Emitted when the captain presses the doorbell. Consumed by client SmartTrackingCard. */
export type DshCaptainBellEvent = {
  orderId: string;
  captainId: string;
  timestamp: string;
  proximityState: DshSmartProximityState;
};

// ─── Operations types ──────────────────────────────────────────────────────────

export type DshOperationsDecisionKind = 'approve' | 'reject' | 'request_edit';

export type DshOperationsDecisionPayload = {
  orderId: string;
  decision: DshOperationsDecisionKind;
  note?: string;
  /** Explicit lifecycle transition — approve → operations_approved, reject → cancelled, request_edit → confirmed (back to review). */
  nextLifecycleStatus: DshOrderLifecycleStatus;
};

export type DshOperationsOrderDetail = {
  id: string;
  customerName: string;
  customerPhone: string;
  dropoffAddress: string;
  pickupAddress: string;
  storeName: string;
  paymentMethod: string;
  paymentStatus: string;
  cartItems: Array<{ title: string; qty: number; priceLabel: string }>;
  subtotalLabel: string;
  deliveryLabel: string;
  totalLabel: string;
  customerNote: string;
  customerInstructions: string;
  couponCode: string;
  eventLog: Array<{ status: string; actor: string; timestamp: string }>;
};

// ─── Partner preparation stage ─────────────────────────────────────────────────

export type DshPartnerPreparationStage = {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel: string;
  lifecycleStatus: DshOrderLifecycleStatus;
  prerequisiteStatus?: DshOrderLifecycleStatus;
};

// ─── DSH_ORDER_JOURNEY_STEPS ───────────────────────────────────────────────────

export const DSH_ORDER_JOURNEY_STEPS: DshOrderJourneyStage[] = [
  { id: 'order_submitted', title: 'تم تقديم الطلب', detail: 'الطلب بانتظار مراجعة فريق العمليات.' },
  { id: 'operations_review', title: 'مراجعة العمليات', detail: 'يراجع فريق العمليات الطلب قبل التأكيد.' },
  { id: 'operations_approved', title: 'اعتماد العمليات', detail: 'تمت الموافقة على الطلب.' },
  { id: 'order_received', title: 'استلم المتجر', detail: 'استلم المتجر الطلب وبدأ التجهيز.' },
  { id: 'preparing', title: 'قيد التجهيز', detail: 'يجهّز المتجر الطلب.' },
  { id: 'ready_for_pickup', title: 'جاهز للاستلام', detail: 'الطلب جاهز، الكابتن في الطريق.' },
  { id: 'captain_assigned', title: 'تم تعيين الكابتن', detail: 'كابتن مكلّف وهو في طريقه للاستلام.' },
  { id: 'picked_up', title: 'استلم الكابتن الطلب', detail: 'الطلب مع الكابتن متجهًا نحوك.' },
  { id: 'enroute_to_customer', title: 'في الطريق إليك', detail: 'الطلب في الطريق. تحديث كل 3 دقائق بدون خريطة حية.' },
  { id: 'near_customer', title: 'الطلب قريب منك', detail: 'الكابتن على مقربة من موقعك.' },
  { id: 'at_door', title: 'الكابتن عند بابك', detail: 'وصل الكابتن إلى موقع التسليم.' },
  { id: 'bell_rang', title: 'تم قرع الجرس', detail: 'أُرسل إشعار الوصول. استعد لاستلام طلبك.' },
  { id: 'delivered', title: 'تم التسليم', detail: 'استلمت طلبك. شكرًا لاستخدام بثواني.' },
];

// ─── Mapping functions ─────────────────────────────────────────────────────────

export function mapLifecycleToJourneyStage(status: DshOrderLifecycleStatus): DshOrderJourneyStageId {
  switch (status) {
    case 'quote':
    case 'created': return 'order_submitted';
    case 'confirmed': return 'operations_review';
    case 'operations_approved': return 'operations_approved';
    case 'order_received':
    case 'partner_accepted': return 'order_received';
    case 'preparing': return 'preparing';
    case 'ready_for_pickup': return 'ready_for_pickup';
    case 'captain_assigned':
    case 'enroute_to_pickup':
    case 'arrived_at_pickup': return 'captain_assigned';
    case 'picked_up': return 'picked_up';
    case 'enroute_to_dropoff': return 'enroute_to_customer';
    case 'near_customer': return 'near_customer';
    case 'at_door': return 'at_door';
    case 'bell_rang': return 'bell_rang';
    case 'arrived_at_dropoff':
    case 'delivered': return 'delivered';
    default: return 'order_submitted';
  }
}

/**
 * Maps an operations decision to the resulting lifecycle status.
 * - approve → operations_approved
 * - reject → cancelled
 * - request_edit → confirmed (order returns to ops review queue pending customer correction)
 */
export function mapOperationsDecisionToLifecycle(decision: DshOperationsDecisionKind): DshOrderLifecycleStatus {
  switch (decision) {
    case 'approve': return 'operations_approved';
    case 'reject': return 'cancelled';
    case 'request_edit': return 'confirmed';
  }
}
