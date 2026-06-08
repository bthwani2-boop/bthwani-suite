import { Platform } from 'react-native';
import { dshHomeGetFixtureStores } from '../data/stores.preview-data';
import {
  dshDiscoveryStores,
  storeItemsByStoreId,
} from '../data/stores.preview-data';
import {
  type MarketingGrowthRecord,
} from '../data/marketing.preview-data';
import { getDshClientStateMeta, type DshClientState } from '../data/operational-statuses.preview-data';
import { dshCategoryFixtures } from '../data/categories.preview-data';
import { dshPartnerIntakeItems } from '../shared/workflow';
import { resolveDshStoreClientVisibility } from '../shared/dsh-client-visibility.model';
import {
  dshClientInitialOrdersFixture,
  dshClientInitialCreateOrderValuesFixture,
} from '../data/orders.preview-data';
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

const publishedCategoryIds = new Set(
  dshPartnerIntakeItems
    .filter((item) => item.stage === 'published')
    .map((item) => dshCategoryFixtures.find((category) => category.label === item.categoryLabel)?.id)
    .filter((categoryId): categoryId is string => Boolean(categoryId)),
);

const publishedCategoryFixtures = dshCategoryFixtures.filter((category) => publishedCategoryIds.has(category.id));
export const publishedPromoCategoryIds = new Set(publishedCategoryFixtures.map((category) => category.id));

export const clientVisibleDiscoveryPreviewStores = dshDiscoveryStores.filter((store) => (
  resolveDshStoreClientVisibility({
    publishStage: store.publishStage,
    supportsPickup: store.supportsPickup,
    supportsPartnerDelivery: store.supportsPartnerDelivery,
    serviceLabel: store.serviceLabel,
    deliveryLabel: store.deliveryLabel,
    storeOpen: !store.statusLabel.includes('مغلق'),
  }).visible
));

export const clientVisibleHomePreviewStores = dshHomeGetFixtureStores.filter((store) => (
  resolveDshStoreClientVisibility({
    publishStage: store.publishStage,
    supportsPickup: store.supportsPickup,
    supportsPartnerDelivery: store.supportsPartnerDelivery,
    serviceLabel: store.serviceLabel,
    deliveryLabel: store.deliveryLabel,
    storeOpen: store.statusTone === 'open',
  }).visible
));

export const initialOrders: HostOrderSummary[] = dshClientInitialOrdersFixture as unknown as HostOrderSummary[];

export const initialCreateOrderValues: CreateOrderValues = dshClientInitialCreateOrderValuesFixture as unknown as CreateOrderValues;

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
