import React from 'react';
import type {
  HostCartItem,
  CreateOrderValues,
  HostCanonicalMetadata,
} from '../dsh-client.navigation-bridge';
import {
  initialCreateOrderValues,
  resolveStorePickupAddress,
  initialOrders,
} from '../dsh-client.navigation-bridge';
import {
  isDshFulfillmentDeliveryMode,
  type DshFulfillmentDeliveryMode,
} from '../contracts/dsh-client-binding.contracts';
import { performReorderMapping } from '../adapters/dshClientOrderAdapters';
import type { DshRoute } from '../dsh-client.types';

type UseDshClientCartStateOptions = {
  activeStore: any;
  activeCanonicalStoreId: string | undefined;
  setActiveCanonicalStoreId: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeCanonicalProductId: string | undefined;
  setActiveCanonicalProductId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setActiveStoreId: React.Dispatch<React.SetStateAction<string>>;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  clientVisibleDiscoveryStores: any[];
  defaultFulfillmentMode: DshFulfillmentDeliveryMode;
};

export function useDshClientCartState({
  activeStore,
  activeCanonicalStoreId,
  setActiveCanonicalStoreId,
  activeCanonicalProductId,
  setActiveCanonicalProductId,
  setActiveStoreId,
  setRoute,
  clientVisibleDiscoveryStores,
  defaultFulfillmentMode,
}: UseDshClientCartStateOptions) {
  const [selectedFulfillmentMode, setSelectedFulfillmentMode] = React.useState<DshFulfillmentDeliveryMode>(defaultFulfillmentMode);
  const [cartItems, setCartItems] = React.useState<HostCartItem[]>([]);
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [reorderAlertMessage, setReorderAlertMessage] = React.useState<string | undefined>(undefined);
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');

  const addItemToHostCart = React.useCallback((
    item: HostCartItem & { name?: string },
    _payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string },
  ) => {
    setReorderAlertMessage(undefined);
    const normalizedQty = Number.isFinite(_payload?.quantity) && (_payload?.quantity ?? 0) > 0 ? Number(_payload?.quantity) : 1;
    const nextTitle = item.name?.trim() || item.title?.trim() || item.id;
    const canonicalMetadata: HostCanonicalMetadata = {
      canonicalStoreId: item.canonicalStoreId ?? activeCanonicalStoreId ?? activeStore.canonicalStoreId,
      canonicalProductId: item.canonicalProductId ?? activeCanonicalProductId,
      sourceRecordId: item.sourceRecordId ?? activeStore.sourceRecordId,
      publishStage: item.publishStage ?? activeStore.publishStage,
    };
    const nextFulfillmentMode = isDshFulfillmentDeliveryMode(_payload?.deliveryMode)
      ? _payload.deliveryMode
      : defaultFulfillmentMode;
    const storePickupAddress = resolveStorePickupAddress(activeStore);

    setActiveCanonicalStoreId(canonicalMetadata.canonicalStoreId);
    setActiveCanonicalProductId(canonicalMetadata.canonicalProductId);
    setSelectedFulfillmentMode(nextFulfillmentMode);
    setCreateOrderValues((currentValues) => ({
      ...currentValues,
      fulfillmentMode: nextFulfillmentMode,
      pickupAddress: storePickupAddress,
      dropoffAddress: nextFulfillmentMode === 'pickup' ? '' : currentValues.dropoffAddress,
    }));

    setCartItems((current) => {
      const existingIndex = current.findIndex((entry) => entry.id === item.id && entry.storeId === activeStore.id);
      if (existingIndex === -1) {
        return [
          ...current,
          {
            id: item.id,
            title: nextTitle,
            priceLabel: item.priceLabel,
            qty: normalizedQty,
            storeId: activeStore.id,
            storeName: activeStore.name,
            canonicalStoreId: canonicalMetadata.canonicalStoreId,
            canonicalProductId: canonicalMetadata.canonicalProductId,
            sourceRecordId: canonicalMetadata.sourceRecordId,
            publishStage: canonicalMetadata.publishStage,
          },
        ];
      }

      return current.map((entry, index) => (
        index === existingIndex
          ? {
              ...entry,
              qty: entry.qty + normalizedQty,
              canonicalStoreId: entry.canonicalStoreId ?? canonicalMetadata.canonicalStoreId,
              canonicalProductId: entry.canonicalProductId ?? canonicalMetadata.canonicalProductId,
              sourceRecordId: entry.sourceRecordId ?? canonicalMetadata.sourceRecordId,
              publishStage: entry.publishStage ?? canonicalMetadata.publishStage,
            }
          : entry
      ));
    });
  }, [activeCanonicalProductId, activeCanonicalStoreId, activeStore, defaultFulfillmentMode, setActiveCanonicalProductId, setActiveCanonicalStoreId]);

  const handleReorderClick = React.useCallback((orderId: string) => {
    const order = initialOrders.find((o) => o.id === orderId);
    if (!order) return;

    const mapped = performReorderMapping(order, clientVisibleDiscoveryStores);

    setActiveStoreId(mapped.matchedStore.id);
    setActiveCanonicalStoreId(mapped.matchedStore.canonicalStoreId);
    setCartItems(mapped.newCartItems);
    setCreateOrderValues((current) => ({
      ...current,
      fulfillmentMode: mapped.fulfillmentMode,
      pickupAddress: mapped.pickupAddress,
      dropoffAddress: mapped.dropoffAddress,
      note: mapped.note,
    }));
    setSelectedFulfillmentMode(mapped.fulfillmentMode);
    setReorderAlertMessage('تنبيه: تم نسخ السلة من طلبك السابق وتحديث الأسعار ومطابقتها مباشرة مع المتجر بنجاح.');
    setRoute('cart-get');
  }, [clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setRoute]);

  const openCreateOrderJourney = React.useCallback(() => {
    setReorderAlertMessage(undefined);
    setRoute('cart-get');
  }, [setRoute]);

  return {
    selectedFulfillmentMode,
    setSelectedFulfillmentMode,
    cartItems,
    setCartItems,
    createOrderValues,
    setCreateOrderValues,
    reorderAlertMessage,
    setReorderAlertMessage,
    storeItemsEntryOrigin,
    setStoreItemsEntryOrigin,
    addItemToHostCart,
    handleReorderClick,
    openCreateOrderJourney,
  };
}
