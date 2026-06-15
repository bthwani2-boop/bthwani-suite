import React from 'react';
import {
  resolveStorePickupAddress,
  type DshRoute,
  type DshFulfillmentDeliveryMode,
} from '../checkout/dsh-client-binding.contracts';

type DiscoveryStore = { id: string; canonicalStoreId?: string; isFavorite?: boolean };
type HomeStore = { id: string; name: string; isFavorite?: boolean };

export function useDshClientHomeActions({
  setRoute,
  clientVisibleDiscoveryStores,
  clientVisibleHomeStores,
  isAwnakEnabled,
  setSheinInlineOpen,
  setAwnakInlineOpen,
  activeStore,
  selectedFulfillmentMode,
  setSelectedFulfillmentMode,
  setCreateOrderValues,
  setActiveStoreId,
  setActiveCanonicalStoreId,
  setActiveCanonicalProductId,
  setItemsQuery,
  setItemsCategory,
  setSelectedItemId,
  setStoreItemsEntryOrigin,
  favoriteOverrides,
  setFavoriteOverrides,
  hasStoreTarget,
}: {
  setRoute: (r: DshRoute) => void;
  clientVisibleDiscoveryStores: readonly DiscoveryStore[];
  clientVisibleHomeStores: readonly HomeStore[];
  isAwnakEnabled: boolean;
  setSheinInlineOpen: (v: boolean) => void;
  setAwnakInlineOpen: (v: boolean) => void;
  activeStore: { id?: string; pickupAddress?: string } | null | undefined;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  setSelectedFulfillmentMode: (m: DshFulfillmentDeliveryMode) => void;
  setCreateOrderValues: (updater: (v: any) => any) => void;
  setActiveStoreId: (id: string) => void;
  setActiveCanonicalStoreId: (id?: string) => void;
  setActiveCanonicalProductId: (id?: string) => void;
  setItemsQuery: (q: string) => void;
  setItemsCategory: (c: string) => void;
  setSelectedItemId: (id: string) => void;
  setStoreItemsEntryOrigin: (o: string) => void;
  favoriteOverrides: Record<string, boolean>;
  setFavoriteOverrides: (updater: (v: Record<string, boolean>) => Record<string, boolean>) => void;
  hasStoreTarget: (storeId?: string) => boolean;
}) {
  const handleOpenActiveStoreItems = React.useCallback(() => {
    setStoreItemsEntryOrigin('store-get');
    setRoute('store-items');
  }, [setStoreItemsEntryOrigin, setRoute]);

  const handleOpenActiveStoreCart = React.useCallback((mode?: DshFulfillmentDeliveryMode) => {
    const nextMode = mode ?? selectedFulfillmentMode;
    setSelectedFulfillmentMode(nextMode);
    setCreateOrderValues((cur: any) => ({
      ...cur,
      fulfillmentMode: nextMode,
      pickupAddress: resolveStorePickupAddress(activeStore),
      dropoffAddress: nextMode === 'pickup' ? '' : cur.dropoffAddress,
    }));
    setRoute('cart-get');
  }, [activeStore, selectedFulfillmentMode, setSelectedFulfillmentMode, setCreateOrderValues, setRoute]);

  const handleToggleHomeFavorite = React.useCallback((storeId: string) => {
    const current = clientVisibleHomeStores.find((s) => s.id === storeId) || clientVisibleDiscoveryStores.find((s) => s.id === storeId);
    const currentVal = favoriteOverrides[storeId] ?? current?.isFavorite ?? false;
    setFavoriteOverrides((prev) => ({ ...prev, [storeId]: !currentVal }));
  }, [clientVisibleDiscoveryStores, clientVisibleHomeStores, favoriteOverrides, setFavoriteOverrides]);

  const handleOpenHomeCategory = React.useCallback((categoryId: string) => {
    if (categoryId === 'shein') { setSheinInlineOpen(true); setRoute('home'); return; }
    if (categoryId === 'awnak') { if (!isAwnakEnabled) return; setAwnakInlineOpen(true); setRoute('home'); return; }
    setRoute('home');
  }, [isAwnakEnabled, setSheinInlineOpen, setAwnakInlineOpen, setRoute]);

  const handleOpenHomeStoreCategory = React.useCallback((storeId: string, categoryId: string) => {
    const store = clientVisibleDiscoveryStores.find((e) => e.id === storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(store?.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setItemsCategory(categoryId);
    setStoreItemsEntryOrigin('home');
    setRoute('store-items');
  }, [clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setActiveCanonicalProductId, setItemsCategory, setStoreItemsEntryOrigin, setRoute]);

  const handleOpenHomeProduct = React.useCallback((storeId: string, itemId: string) => {
    const store = clientVisibleDiscoveryStores.find((e) => e.id === storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(store?.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setSelectedItemId(itemId);
    setRoute('cart-get');
  }, [clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setActiveCanonicalProductId, setSelectedItemId, setRoute]);

  const handleOpenHomeStore = React.useCallback((storeId: string) => {
    if (!hasStoreTarget(storeId)) return;
    const store = clientVisibleDiscoveryStores.find((e) => e.id === storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(store?.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setItemsQuery('');
    setItemsCategory('all');
    setSelectedItemId('');
    setRoute('store-get');
  }, [hasStoreTarget, clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setActiveCanonicalProductId, setItemsQuery, setItemsCategory, setSelectedItemId, setRoute]);

  const handleClientBottomNavSelect = React.useCallback((id: string) => {
    if (id === 'favorites') setRoute('home');
    if (id === 'orders') setRoute('orders-list');
    if (id === 'wallet') setRoute('wlt-home');
    if (id === 'profile') setRoute('my-space');
  }, [setRoute]);

  const recordMarketingBannerClick = React.useCallback((_item: unknown) => {}, []);
  const recordMarketingBannerImpression = React.useCallback((_item: unknown) => {}, []);
  const recordMarketingGrowthClick = React.useCallback((_item: unknown) => {}, []);
  const recordMarketingGrowthImpression = React.useCallback((_item: unknown) => {}, []);

  return {
    handleOpenActiveStoreItems,
    handleOpenActiveStoreCart,
    handleToggleHomeFavorite,
    handleOpenHomeCategory,
    handleOpenHomeStoreCategory,
    handleOpenHomeProduct,
    handleOpenHomeStore,
    handleClientBottomNavSelect,
    recordMarketingBannerClick,
    recordMarketingBannerImpression,
    recordMarketingGrowthClick,
    recordMarketingGrowthImpression,
  };
}
