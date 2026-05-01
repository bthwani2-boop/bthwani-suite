export type DshClientId = string;

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
  status: 'order_created' | 'order_confirmed';
};

export type DshClientOrderListItem = {
  id: DshClientId;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta?: string;
};

export type DshClientTrackingTimelineItem = {
  id: DshClientId;
  title: string;
  detail: string;
  done: boolean;
};

export type DshClientIssueReportRequest = {
  orderId: DshClientId;
  reason: string;
  details?: string;
};

export type DshClientWalletVisibility = {
  walletCreditVisible: boolean;
  walletRefundVisible: boolean;
};
