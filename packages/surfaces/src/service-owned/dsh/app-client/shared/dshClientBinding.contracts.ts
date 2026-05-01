import type { DshClientState } from './dshClientStateModel';

export type DshClientId = string;

export type DshClientServiceabilityState = Extract<DshClientState, 'serviceability' | 'area_unserviceable'>;

export type DshClientCheckoutState = Extract<DshClientState, 'checkout_ready' | 'payment_pending' | 'order_created' | 'order_confirmed'>;

export type DshClientTrackingState = Extract<
  DshClientState,
  'tracking_active' | 'delivered' | 'cancelled' | 'failed' | 'refund_pending' | 'refunded' | 'support_required' | 'wallet_credit_visible' | 'wallet_refund_visible'
>;

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
