import React from 'react';
import { resolveDshDiscoveryStoresRuntimeConfig } dsh-discovery-stores-runtime-config';
import { createDshDiscoveryStoresClient, isDshDiscoveryStoresOfflineError } dsh-discovery-stores-transport';
import { createDshProductApiHttpClient } api/dsh-product-api.transport';
import { mapProductRecordToItem } from '../adapters/dshClientStoreAdapters';
import type { DshRoute } from '../dsh-client.types';
import type { DshDiscoveryStore } presentation-models/dshStoreProductCardModel';
import type { DshGetDiscoveryStoreResponse } dsh-discovery-stores-client';
import type { DshStoreMenuItem } presentation-models/dshStoreProductCardModel';

type UseDshClientStoreStateOptions = {
  route: DshRoute;
  clientVisibleDiscoveryStores: DshDiscoveryStore[];
};

export function useDshClientStoreState({
  route,
  clientVisibleDiscoveryStores,
}: UseDshClientStoreStateOptions) {
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [activeStoreDetail, setActiveStoreDetail] = React.useState<DshGetDiscoveryStoreResponse | null>(null);
  const [storeDetailState, setStoreDetailState] = React.useState<'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'not-found'>('loading');
  const [activeStoreItemsState, setActiveStoreItemsState] = React.useState<DshStoreMenuItem[]>([]);
  const [activeCanonicalStoreId, setActiveCanonicalStoreId] = React.useState<string | undefined>('store-1001');
  const [activeCanonicalProductId, setActiveCanonicalProductId] = React.useState<string | undefined>(undefined);
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');

  // Keep track of the product limit we fetched to avoid refetching unnecessarily
  const [fetchedLimit, setFetchedLimit] = React.useState<number>(0);
  const [fetchedStoreId, setFetchedStoreId] = React.useState<string>('');

  const activeStore = React.useMemo(
    () => clientVisibleDiscoveryStores.find((store) => store.id === activeStoreId) ?? clientVisibleDiscoveryStores[0],
    [activeStoreId, clientVisibleDiscoveryStores],
  );

  const targetLimit = React.useMemo(() => {
    const isFullView = route === 'store-items' || itemsQuery.trim() !== '' || itemsCategory !== 'all';
    return isFullView ? 100 : 15;
  }, [route, itemsQuery, itemsCategory]);

  const fetchStoreDetail = React.useCallback((
    storeId: string,
    _store: unknown,
    limit: number = 15,
  ) => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) {
      setStoreDetailState('offline');
      return () => {};
    }

    setStoreDetailState('loading');
    let cancelled = false;

    const client = createDshDiscoveryStoresClient(config);
    const prodClient = createDshProductApiHttpClient(config.baseUrl);

    Promise.all([
      client.getDiscoveryStore(storeId),
      prodClient.listProducts(storeId, { limit })
    ]).then(([storeResp, productsResp]) => {
      if (cancelled) return;
      setActiveStoreDetail(storeResp);

      const mappedItems = (productsResp.products || []).map(mapProductRecordToItem);

      setActiveStoreItemsState(mappedItems);
      setStoreDetailState('ready');
      setFetchedLimit(limit);
      setFetchedStoreId(storeId);
    }).catch((err) => {
      if (cancelled) return;
      let detailErrorState: 'offline' | 'not-found' | 'error' = 'error';
      if (isDshDiscoveryStoresOfflineError(err) || (typeof err === 'object' && err !== null && (err as any).kind === 'offline')) {
        detailErrorState = 'offline';
      } else if (typeof err === 'object' && err !== null && (err as any).kind === 'http' && (err as any).status === 404) {
        detailErrorState = 'not-found';
      }
      setStoreDetailState(detailErrorState);
    });

    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (route !== 'store-get' && route !== 'store-items') return undefined;
    if (!activeStoreId) return undefined;

    // Refetch only if store changed OR we need a larger limit than what was fetched
    const needsFetch = activeStoreId !== fetchedStoreId || targetLimit > fetchedLimit;
    if (!needsFetch) return undefined;

    return fetchStoreDetail(activeStoreId, activeStore, targetLimit);
  }, [activeStoreId, route, activeStore, targetLimit, fetchedLimit, fetchedStoreId, fetchStoreDetail]);

  return {
    activeStoreId,
    setActiveStoreId,
    activeStoreDetail,
    setActiveStoreDetail,
    storeDetailState,
    setStoreDetailState,
    activeStoreItemsState,
    setActiveStoreItemsState,
    activeCanonicalStoreId,
    setActiveCanonicalStoreId,
    activeCanonicalProductId,
    setActiveCanonicalProductId,
    selectedItemId,
    setSelectedItemId,
    favoriteOverrides,
    setFavoriteOverrides,
    itemsQuery,
    setItemsQuery,
    itemsCategory,
    setItemsCategory,
    activeStore,
    fetchStoreDetail,
  };
}
