import type { DshClientState } from '../orders/orders.client-state';
import type {
  HostCartItem,
  HostCanonicalMetadata,
  DshClientCartLine,
  DshClientCartSnapshot,
  DshFulfillmentDeliveryMode,
  DshFulfillmentDeliveryModeMeta,
} from '../cart/cart.contract';
import {
  isDshFulfillmentDeliveryMode,
  DSH_FULFILLMENT_DELIVERY_MODE_META,
  getDshFulfillmentDeliveryModeMeta,
} from '../cart/cart.contract';
import type {
  CreateOrderValues,
  DshClientCheckoutState,
  DshClientCreateOrderRequest,
  DshClientCreateOrderResponse,
  DshClientCheckoutSnapshot,
  DshClientQuoteSnapshot,
  DshClientServiceabilitySnapshot,
  DshClientServiceabilityState,
  DshClientOrderSuccessPayload,
  DshClientOrderSuccessSnapshot,
} from '../checkout/checkout.contract';
import {
  initialCreateOrderValues,
} from '../checkout/checkout.contract';

export type {
  CreateOrderValues,
  DshClientCheckoutState,
  DshClientCreateOrderRequest,
  DshClientCreateOrderResponse,
  DshClientCheckoutSnapshot,
  DshClientQuoteSnapshot,
  DshClientServiceabilitySnapshot,
  DshClientServiceabilityState,
  DshClientOrderSuccessPayload,
  DshClientOrderSuccessSnapshot,
  DshFulfillmentDeliveryMode,
  HostCartItem,
  HostCanonicalMetadata,
};
export {
  initialCreateOrderValues,
  getDshFulfillmentDeliveryModeMeta,
};


export type DshClientId = string;



export type DshClientTrackingState = Extract<
  DshClientState,
  'tracking_active' | 'delivered' | 'cancelled' | 'failed' | 'refund_pending' | 'refunded' | 'support_required' | 'wallet_credit_visible' | 'wallet_refund_visible'
>;

export type DshClientDeliveryLifecycleStatus =
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
  | 'refund_pending'
  | 'refunded';

export type DshClientExceptionReason =
  | 'store_closed'
  | 'item_unavailable'
  | 'customer_unreachable'
  | 'address_not_found'
  | 'unable_to_access'
  | 'captain_no_show'
  | 'partner_delay'
  | 'payment_failed'
  | 'system_outage'
  | 'area_unserviceable'
  | 'refund_required'
  | 'return_required'
  | 'redispatch_required';

// Timing modes (when) — separate concern from delivery modes (how).
// 'instant' and 'scheduled' describe when the order is fulfilled, not who delivers it.
export type DshClientFulfillmentMode = 'instant' | 'scheduled' | 'pickup' | 'partner_delivery' | 'bthwani_delivery';



export type DshClientEventActorRole = 'client' | 'store' | 'partner' | 'captain' | 'support' | 'system';

export type DshClientEventSource = 'client' | 'store' | 'partner' | 'captain' | 'support' | 'system';

export type DshClientProofOfDeliveryType = 'none' | 'photo' | 'signature' | 'otp' | 'pin' | 'qr' | 'barcode';

export type DshClientProofCapturedBy = 'client' | 'captain' | 'store' | 'partner' | 'system';

export type DshClientProofVerificationResult = 'not_required' | 'pending' | 'verified' | 'failed';

export type DshClientGeocodeConfidence = 'high' | 'medium' | 'low' | 'unknown';

export type DshClientFulfillmentCapacityState = 'available' | 'limited' | 'full' | 'paused';

export type DshClientEvidenceAttachment = {
  asset_id?: DshClientId;
  asset_url?: string;
  asset_type?: 'image' | 'video' | 'document' | 'code';
  note?: string;
};

export type DshClientPinAdjustment = {
  latitude: number;
  longitude: number;
  distance_meters?: number;
};

export type DshClientFulfillmentWindow = {
  start_at: string;
  end_at: string;
  label?: string;
};

export type DshClientServiceabilityQuote = {
  address_valid: boolean;
  inside_coverage: boolean;
  store_open: boolean;
  items_available: boolean;
  delivery_fee: number;
  eta_pickup: string | null;
  eta_dropoff: string | null;
  quote_expires_at: string | null;
  unavailable_reason: DshClientExceptionReason | null;
  fallback_fulfillment_method: DshClientFulfillmentMode | null;
};

export type DshClientEventTimelineItem = {
  event_id: DshClientId;
  order_id: DshClientId;
  delivery_id: DshClientId | null;
  actor_id: DshClientId | null;
  actor_role: DshClientEventActorRole;
  from_status: DshClientDeliveryLifecycleStatus | null;
  to_status: DshClientDeliveryLifecycleStatus;
  timestamp: string;
  source: DshClientEventSource;
  reason_code: DshClientExceptionReason | null;
  notes: string | null;
  evidence_attachment_optional: DshClientEvidenceAttachment | null;
};

export type DshClientProofOfDeliveryVisibility = {
  proof_type: DshClientProofOfDeliveryType;
  is_required: boolean;
  captured_by: DshClientProofCapturedBy | null;
  captured_at: string | null;
  proof_asset_url: string | null;
  verification_result: DshClientProofVerificationResult;
  failure_reason: string | null;
  customer_visible: boolean;
};

export type DshClientHandoffVerification = {
  pickup_reference: string | null;
  pickup_code_or_barcode: string | null;
  dropoff_otp: string | null;
  contactless_allowed: boolean;
  customer_instructions: string | null;
  partner_instructions: string | null;
  captain_handoff_notes: string | null;
};

export type DshClientAddressSnapshot = {
  address_label: string;
  pin_adjustment: DshClientPinAdjustment | null;
  reverse_lookup_label: string | null;
  delivery_notes: string | null;
  building: string | null;
  floor: string | null;
  apartment: string | null;
  landmark: string | null;
  geocode_confidence: DshClientGeocodeConfidence;
  address_risk_flag: boolean;
};

export type DshClientFulfillmentModeSnapshot = {
  mode: DshClientFulfillmentMode;
  available_windows: DshClientFulfillmentWindow[];
  capacity_state: DshClientFulfillmentCapacityState;
  slot_reserved_until: string | null;
  store_busy: boolean;
  area_busy: boolean;
  captain_supply_low: boolean;
};

export type DshClientWalletImpactVisibility = {
  paid_amount: number;
  delivery_fee: number;
  discount: number;
  wallet_credit: number;
  wallet_debit: number;
  refund_pending: number;
  refund_completed: number;
  compensation: number;
  note: string | null;
};

export type DshClientStoreSummary = {
  id: DshClientId;
  name: string;
  subtitle: string;
  ratingLabel?: string;
  distanceLabel?: string;
  deliveryLabel?: string;
  serviceLabel?: string;
  statusLabel?: string;
};

export type DshClientStoreItem = {
  id: DshClientId;
  storeId: DshClientId;
  name: string;
  subtitle: string;
  priceValue: number;
  currency: 'YER';
  isAvailable?: boolean;
};





export type DshClientBindingError = {
  code: string;
  message: string;
  retryable?: boolean;
  field?: string;
};



export type DshClientOrderListItem = {
  id: DshClientId;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta?: string;
};

export type DshClientOrdersListResponse = {
  items: DshClientOrderListItem[];
};

export type DshClientTrackingTimelineItem = {
  id: DshClientId;
  title: string;
  detail: string;
  done: boolean;
};

export type DshClientTrackingSnapshot = {
  orderId: DshClientId;
  state: DshClientTrackingState;
  statusLabel: string;
  timeline: DshClientTrackingTimelineItem[];
  supportRequired?: boolean;
  walletVisibility?: DshClientWalletVisibility;
};

export type DshClientIssueReportRequest = {
  orderId: DshClientId;
  reason: string;
  details?: string;
};

export type DshClientSupportIssuePayload = {
  orderId: DshClientId;
  issueType: 'order_issue' | 'delivery_issue' | 'payment_issue' | 'refund_issue' | 'other';
  reason: string;
  details?: string;
  clientState?: Extract<DshClientState, 'support_required' | 'cancelled' | 'failed' | 'refund_pending' | 'refunded'>;
};

export type DshClientIssueReportResponse = {
  issueId: DshClientId;
  orderId: DshClientId;
  accepted: boolean;
  error?: DshClientBindingError;
};

export type DshClientWalletVisibility = {
  state?: Extract<DshClientTrackingState, 'refund_pending' | 'refunded' | 'wallet_credit_visible' | 'wallet_refund_visible'>;
  walletCreditVisible: boolean;
  walletRefundVisible: boolean;
  balanceMinorUnits?: number;
  refundMinorUnits?: number;
  note?: string;
};

export type DshClientRefundVisibility = DshClientWalletVisibility;

export type DshClientRefundSummary = {
  orderId: DshClientId;
  state: Extract<DshClientTrackingState, 'refund_pending' | 'refunded' | 'wallet_refund_visible'>;
  refundMinorUnits?: number;
  note?: string;
};

export type DshClientRatingPayload = {
  orderId: DshClientId;
  productRating: 1 | 2 | 3 | 4 | 5;
  captainRating: 1 | 2 | 3 | 4 | 5;
  note?: string;
};

export type DshClientSmartProximityState = 'enroute' | 'near_customer' | 'at_door' | 'bell_rang';

export type DshClientSmartTrackingUpdate = {
  lastLocationUpdateMinutesAgo: number;
  etaMinutes: number | null;
  proximityState: DshClientSmartProximityState;
  bellRang: boolean;
};

export type DshClientOperationsDecisionKind = 'approve' | 'reject' | 'request_edit';

export type DshClientOperationsDecisionPayload = {
  orderId: DshClientId;
  decision: DshClientOperationsDecisionKind;
  note?: string;
  nextLifecycleStatus: DshClientDeliveryLifecycleStatus;
};

export type DshClientOperationsOrderDetail = {
  orderId: DshClientId;
  fulfillmentMode: DshFulfillmentDeliveryMode;
  customerName: string;
  customerPhone: string;
  dropoffAddress: string;
  pickupAddress: string;
  storeName: string;
  paymentMethod: DshClientCreateOrderRequest['paymentMethod'];
  paymentStatusLabel: string;
  cartLines: DshClientCartLine[];
  subtotalMinorUnits: number;
  deliveryMinorUnits: number;
  totalMinorUnits: number;
  couponCode?: string;
  discountMinorUnits?: number;
  customerNote?: string;
  customerInstructions?: string;
  eventTimeline: DshClientEventTimelineItem[];
  currentLifecycleStatus: DshClientDeliveryLifecycleStatus;
};

// --- Phase 2: DSH Flow Registry — client surface on-demand policy bridge ---
// DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION-20260521
// Registry is the SSoT for on-demand policy. Do not duplicate policy constants locally.
import type { DshOnDemandPolicy } from '../runtime/dsh-flow-registry';
import { getDshFlowById } from '../runtime/dsh-flow-registry';

/** Canonical registry flow IDs owned by the client surface. */
export const DSH_CLIENT_REGISTRY_FLOW_IDS = [
  'client-order-tracking',
  'client-cart-checkout',
  'client-order-issue',
] as const;
export type DshClientRegistryFlowId = (typeof DSH_CLIENT_REGISTRY_FLOW_IDS)[number];

/**
 * Returns the on-demand loading policy for a client registry flow from the central registry.
 * - 'client-order-tracking'  → 'summary-only'    (no detail loaded until explicit expand)
 * - 'client-cart-checkout'   → 'detail-on-open'
 * - 'client-order-issue'     → 'evidence-on-open' (evidence/attachments loaded only on explicit open)
 * Returns undefined if the flow is not found in the registry.
 */
export function getDshClientFlowPolicy(flowId: DshClientRegistryFlowId): DshOnDemandPolicy | undefined {
  return getDshFlowById(flowId)?.onDemandPolicy;
}

// MOVED FROM NAVIGATION BRIDGE


export type HostOrderSummary = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  clientState: DshClientState;
  fulfillmentMode: DshFulfillmentDeliveryMode;
  pickupAddress: string;
  dropoffAddress: string;
  note?: string;
  orderNumber?: string;
  summary?: string;
  total?: string;
  location?: string;
  timestamp?: string;
};



export const hostClientStates = {
  quote: 'quote',
  serviceability: 'serviceability',
  areaUnserviceable: 'area_unserviceable',
  cartEmpty: 'cart_empty',
  cartReady: 'cart_ready',
  checkoutReady: 'checkout_ready',
  paymentPending: 'payment_pending',
  paymentFailed: 'payment_failed',
  itemUnavailable: 'item_unavailable',
  orderCreated: 'order_created',
  orderConfirmed: 'order_confirmed',
  trackingActive: 'tracking_active',
  delivered: 'delivered',
  cancelled: 'cancelled',
  failed: 'failed',
  refundPending: 'refund_pending',
  refunded: 'refunded',
  supportRequired: 'support_required',
  walletCreditVisible: 'wallet_credit_visible',
  walletRefundVisible: 'wallet_refund_visible',
} as const;



export const clientVisibleDiscoveryStores: never[] = [];
export const clientVisibleHomeStores: never[] = [];
export const publishedPromoCategoryIds = new Set<string>();

export type ClientOperationScreenId =
  | 'awnak-order-create'
  | 'booking-create'
  | 'chat-read-ack'
  | 'chat-send'
  | 'checkout-gate'
  | 'delivery-attempt-create'
  | 'delivery-attempts-list'
  | 'delivery-close'
  | 'delivery-eta-get'
  | 'delivery-get'
  | 'delivery-reassign'
  | 'delivery-track-get'
  | 'entitlements-get'
  | 'estimate-create'
  | 'estimate-get'
  | 'external-order-create'
  | 'gas-refill-order-create'
  | 'listing-status-update'
  | 'loyalty-points-redeem'
  | 'loyalty-points-client-balance'
  | 'loyalty-points-client-history'
  | 'order-accept'
  | 'order-cancel'
  | 'order-complete'
  | 'order-create'
  | 'order-escrow-hold'
  | 'order-escrow-release'
  | 'order-get'
  | 'order-issue-flag'
  | 'order-proof-code-generate'
  | 'order-proof-verify'
  | 'order-rate'
  | 'order-receipt-get'
  | 'order-status-get'
  | 'order-status-update'
  | 'pricing-preview'
  | 'pricing-snapshot-get'
  | 'promo-apply'
  | 'proxy-request-create'
  | 'proxy-request-approve'
  | 'proxy-request-review'
  | 'proxy-request-reject'
  | 'proxy-request-tracking'
  | 'review-create'
  | 'reviews-list'
  | 'service-modes-resolve'
  | 'subscription-family-get'
  | 'subscription-family-members-get'
  | 'subscription-family-members-post'
  | 'subscription-pro-catalog'
  | 'subscription-sync'
  | 'subscription-tier-get'
  | 'subscription-upgrade-post'
  | 'zone-set';


export type DshRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'wlt-home'
  | 'preferences'
  | 'notifications'
  | 'store-items'
  | 'cart-get'
  | 'checkout-intent'
  | 'checkout-failure'
  | 'search'
  | 'store-get'
  | 'bell'
  | 'benefits'
  | 'conversation-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'service-settings'
  | 'zone-set'
  | 'orders-list'
  | 'addresses-location'
  | 'identity'
  | 'appearance'
  | 'tracking';

export function resolveStorePickupAddress(store: { subtitle?: string; name?: string }) {
  const subtitle = store.subtitle?.trim();
  if (subtitle) {
    return subtitle;
  }

  const name = store.name?.trim();
  if (name) {
    return name;
  }

  return 'موقع المتجر غير محدد';
}

export function buildPaymentMethodsList(formattedBalance: string, selectedPaymentMethod: string) {
  return [
    { id: 'wallet', label: `المحفظة (الرصيد: ${formattedBalance})`, icon: 'wallet-outline', isSelected: selectedPaymentMethod === 'wallet' },
    { id: 'cod', label: 'الدفع عند الاستلام (COD)', icon: 'cash-outline', isSelected: selectedPaymentMethod === 'cod' }
  ];
}
