import {
  hostClientStates,
  type HostOrderSummary,
} from '../checkout/dsh-client-binding.contracts';
import type { HostCartItem, DshFulfillmentDeliveryMode } from '../cart';
import type { ActiveStore } from '../checkout';
import type { DshDiscoveryStore } from '../stores';

// ─── Client Order Adapters ───────────────────────────────────────────────────

export function mapLiveOrderToSummary(
  liveOrder: { id: string },
  activeStore: ActiveStore,
  totalPrice: number,
  fulfillmentMode: DshFulfillmentDeliveryMode,
  dropoffAddress: string,
  note: string,
  cartItems: HostCartItem[],
): HostOrderSummary {
  return {
    id: liveOrder.id,
    title: activeStore.name,
    subtitle: activeStore.subtitle || activeStore.name,
    statusLabel: 'مباشر',
    meta: `التوصيل · ${totalPrice} ر.ي`,
    clientState: hostClientStates.trackingActive,
    fulfillmentMode,
    pickupAddress: activeStore.name,
    dropoffAddress: dropoffAddress || '',
    note: note || 'تم الإنشاء برمجياً',
    orderNumber: liveOrder.id.replace('ord-', '').slice(0, 8),
    summary: cartItems.map(item => `${item.qty}x ${item.title}`).join(' ، '),
    total: `${totalPrice} ر.ي`,
  };
}

export function performReorderMapping(
  order: HostOrderSummary,
  clientVisibleDiscoveryStores: DshDiscoveryStore[],
): {
  matchedStore: DshDiscoveryStore | null;
  newCartItems: HostCartItem[];
  fulfillmentMode: DshFulfillmentDeliveryMode;
  pickupAddress: string;
  dropoffAddress: string;
  note: string;
} {
  const matchedStore = clientVisibleDiscoveryStores.find((s) => s.name === order.title) ?? clientVisibleDiscoveryStores[0];
  if (!matchedStore) {
    return {
      matchedStore: null,
      newCartItems: [],
      fulfillmentMode: (order.fulfillmentMode ?? 'bthwani_delivery') as DshFulfillmentDeliveryMode,
      pickupAddress: order.pickupAddress || '',
      dropoffAddress: order.dropoffAddress || '',
      note: order.note || '',
    };
  }

  const newCartItems: HostCartItem[] = [];

  return {
    matchedStore,
    newCartItems,
    fulfillmentMode: (order.fulfillmentMode ?? 'bthwani_delivery') as DshFulfillmentDeliveryMode,
    pickupAddress: order.pickupAddress || matchedStore.name,
    dropoffAddress: order.dropoffAddress || '',
    note: order.note || '',
  };
}

// ─── Client Order Status Helper ──────────────────────────────────────────────

const ORDER_STATUS_LABELS: Record<string, string> = {
  CREATED: 'قيد المراجعة',
  ACCEPTED: 'تم القبول',
  READY_FOR_PICKUP: 'جاهز للاستلام',
  ACCEPTED_BY_CAPTAIN: 'الكابتن قبل المهمة',
  PICKED_UP: 'تم الاستلام',
  EN_ROUTE: 'في الطريق',
  ARRIVED: 'وصل الكابتن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'تم الإلغاء',
  REFUNDED: 'تم الاسترداد',
  FAILED_DELIVERY: 'فشل التوصيل',
  RETURNING_TO_STORE: 'عائد للمتجر',
  RETURNED: 'تم الإرجاع',
};

export function getClientOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export const CLIENT_ORDER_TERMINAL_STATUSES = new Set([
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
  'FAILED_DELIVERY',
  'RETURNED',
]);
