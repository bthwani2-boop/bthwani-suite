import { hostClientStates } from '../dsh-client.navigation-bridge';
import type { HostOrderSummary, HostCartItem } from '../dsh-client.navigation-bridge';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { ActiveStore } from '../hooks/useDshCheckout';
import type { DshDiscoveryStore } from 'presentation-models/dshStoreProductCardModel';

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
  // Reorder maps back to the same store by name from live API-provided store list.
  // Products are fetched from the API at order time, not pre-loaded from fixtures.
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

  // Cart items from reorder are rebuilt from the order summary text (best-effort).
  // The caller is responsible for fetching live product catalog from API if exact items are needed.
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
