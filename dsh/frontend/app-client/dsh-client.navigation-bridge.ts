import { Platform } from 'react-native';
import type { DshClientState } from 'state-machines/client-state';
import {
  type DshClientCreateOrderRequest,
  type DshFulfillmentDeliveryMode,
} from './contracts/dsh-client-binding.contracts';
import type { DshCommandTarget, DshRoute } from './dsh-client.types';

export type CreateOrderValues = Pick<
  DshClientCreateOrderRequest,
  'fulfillmentMode' | 'pickupAddress' | 'dropoffAddress' | 'contactName' | 'contactPhone' | 'note'
>;

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

export type HostCartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  qty: number;
  storeId: string;
  storeName: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
};

export type HostCanonicalMetadata = {
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
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

// Category IDs available for promo display — populated at runtime from GET /catalog/categories API.
// Empty on first load; components should fetch from API and update state.
export const publishedPromoCategoryIds = new Set<string>();

// Store lists — populated at runtime from GET /stores API.
// Empty on first load; components should render loading state until API responds.
export const clientVisibleDiscoveryStores: never[] = [];
export const clientVisibleHomeStores: never[] = [];

// Order and cart initial state — empty; populated from GET /orders API.
export const initialOrders: HostOrderSummary[] = [];

export const initialCreateOrderValues: CreateOrderValues = {
  fulfillmentMode: 'bthwani_delivery',
  pickupAddress: '',
  dropoffAddress: '',
  contactName: '',
  contactPhone: '',
  note: '',
};

export function commandTargetToRoute(target: DshCommandTarget): DshRoute {
  switch (target) {
    case 'home':
      return 'home';
    case 'cart-get':
      return 'cart-get';
    case 'orders-list':
      return 'orders-list';
    case 'tracking':
      return 'tracking';
    case 'bell':
      return 'bell';
    case 'create-order':
      return 'cart-get';
    default:
      return 'home';
  }
}

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
