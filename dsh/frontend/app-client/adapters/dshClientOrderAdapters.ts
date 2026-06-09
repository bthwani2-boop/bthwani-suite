import { hostClientStates } from '../dsh-client.navigation-bridge';
import type { HostOrderSummary, HostCartItem } from '../dsh-client.navigation-bridge';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import { dshDiscoveryStores, storeItemsByStoreId } from '../../data/stores.preview-data';

export function mapLiveOrderToSummary(
  liveOrder: any,
  activeStore: any,
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
  clientVisibleDiscoveryStores: any[],
): {
  matchedStore: any;
  newCartItems: HostCartItem[];
  fulfillmentMode: DshFulfillmentDeliveryMode;
  pickupAddress: string;
  dropoffAddress: string;
  note: string;
} {
  const matchedStore = clientVisibleDiscoveryStores.find((s) => s.name === order.title) ?? clientVisibleDiscoveryStores[0] ?? dshDiscoveryStores[0];
  const storeProducts = storeItemsByStoreId[matchedStore.id] ?? [];
  const summaryText = order.summary || '';
  const keywords = summaryText.split(/[\s+\u2014\u2022••,]+/);
  let matchedProducts = storeProducts.filter((p) =>
    keywords.some((kw) => kw.length > 1 && (p.name.includes(kw) || (p.subtitle && p.subtitle.includes(kw))))
  );

  if (matchedProducts.length === 0) {
    matchedProducts = storeProducts.slice(0, 2);
  }

  const newCartItems = matchedProducts.map((p, idx) => ({
    id: p.id,
    title: p.name,
    priceLabel: p.priceLabel,
    qty: idx === 0 ? 1 : 2,
    storeId: matchedStore.id,
    storeName: matchedStore.name,
    canonicalStoreId: matchedStore.canonicalStoreId,
    publishStage: p.publishStage || 'published-preview',
  }));

  return {
    matchedStore,
    newCartItems,
    fulfillmentMode: (order.fulfillmentMode ?? 'bthwani_delivery') as DshFulfillmentDeliveryMode,
    pickupAddress: order.pickupAddress || matchedStore.name,
    dropoffAddress: order.dropoffAddress || '',
    note: order.note || 'لا توجد ملاحظات',
  };
}
