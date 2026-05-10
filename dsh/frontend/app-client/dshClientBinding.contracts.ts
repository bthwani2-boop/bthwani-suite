import type { DshClientState } from './client-state.preview-data';

export type DshClientId = string;

export type DshClientServiceabilityState = Extract<DshClientState, 'serviceability' | 'area_unserviceable'>;

export type DshClientCheckoutState = Extract<DshClientState, 'checkout_ready' | 'payment_pending' | 'order_created' | 'order_confirmed'>;

export type DshClientTrackingState = Extract<
  DshClientState,
  'tracking_active' | 'delivered' | 'cancelled' | 'failed' | 'refund_pending' | 'refunded' | 'support_required' | 'wallet_credit_visible' | 'wallet_refund_visible'
>;

export type DshClientDeliveryLifecycleStatus =
  | 'quote'
  | 'created'
  | 'confirmed'
  | 'partner_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'captain_assigned'
  | 'enroute_to_pickup'
  | 'arrived_at_pickup'
  | 'picked_up'
  | 'enroute_to_dropoff'
  | 'arrived_at_dropoff'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'returned'
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

export type DshClientCartLine = {
  id: DshClientId;
  itemId: DshClientId;
  title: string;
  qty: number;
  priceValue: number;
};

export type DshClientCartSnapshot = {
  lines: DshClientCartLine[];
  subtotalHalalas: number;
  deliveryHalalas: number;
  totalHalalas: number;
};

export type DshClientQuoteSnapshot = {
  subtotalHalalas: number;
  deliveryHalalas: number;
  totalHalalas: number;
  etaLabel?: string;
  serviceabilityState: DshClientServiceabilityState;
  serviceabilityNote?: string;
};

export type DshClientServiceabilitySnapshot = {
  state: DshClientServiceabilityState;
  addressLabel: string;
  note?: string;
};

export type DshClientCreateOrderRequest = {
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note: string;
  paymentMethod: 'cod' | 'wallet' | 'mixed' | 'official-wallets';
  walletAmountHalalas?: number;
  amountDueOnDeliveryHalalas?: number;
};

export type DshClientCreateOrderResponse = {
  orderId: DshClientId;
  status: Extract<DshClientCheckoutState, 'order_created' | 'order_confirmed'>;
};

export type DshClientCheckoutSnapshot = {
  orderId?: DshClientId;
  state: DshClientCheckoutState;
  quote: DshClientQuoteSnapshot;
  serviceability: DshClientServiceabilitySnapshot;
  cart: DshClientCartSnapshot;
  paymentMethod: DshClientCreateOrderRequest['paymentMethod'];
  walletAmountHalalas?: number;
  amountDueOnDeliveryHalalas?: number;
  note?: string;
};

export type DshClientBindingError = {
  code: string;
  message: string;
  retryable?: boolean;
  field?: string;
};

export type DshClientOrderSuccessPayload = {
  orderId: DshClientId;
  status: Extract<DshClientCheckoutState, 'order_created' | 'order_confirmed'>;
  successTitle?: string;
  successNote?: string;
};

export type DshClientOrderSuccessSnapshot = DshClientOrderSuccessPayload & {
  nextState?: Extract<DshClientState, 'tracking_active' | 'delivered' | 'support_required'>;
  nextAction?: 'tracking' | 'orders-list' | 'support';
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
  balanceHalalas?: number;
  refundHalalas?: number;
  note?: string;
};

export type DshClientRefundVisibility = DshClientWalletVisibility;

export type DshClientRefundSummary = {
  orderId: DshClientId;
  state: Extract<DshClientTrackingState, 'refund_pending' | 'refunded' | 'wallet_refund_visible'>;
  refundHalalas?: number;
  note?: string;
};

export type DshClientRatingPayload = {
  orderId: DshClientId;
  productRating: 1 | 2 | 3 | 4 | 5;
  captainRating: 1 | 2 | 3 | 4 | 5;
  note?: string;
};
