// Canonical location: dsh/frontend/shared/stores/client-store.model.ts
// Authority: dsh/frontend/shared/stores — client store topic model.
// Wraps useDshClientStoreState and derives screen-ready computed values.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshClientStoreState } from './stores.view-model';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  mapStoreDetailToScreenStore,
} from './stores.adapters';
import type { DshDiscoveryStore } from './stores.presentation';
import type { DshRoute } from '../checkout/dsh-client-binding.contracts';

type UseDshClientStoreModelOptions = {
  route: DshRoute;
  clientVisibleDiscoveryStores: DshDiscoveryStore[];
};

export function useDshClientStoreModel({ route, clientVisibleDiscoveryStores }: UseDshClientStoreModelOptions) {
  const storeState = useDshClientStoreState({ route, clientVisibleDiscoveryStores });

  const activeStoreItems = storeState.activeStoreItemsState;

  const activeStoreCategories = React.useMemo(
    () => buildStoreCategories(activeStoreItems),
    [activeStoreItems],
  );
  const activeStoreDeliveryModes = React.useMemo(
    () => buildStoreDeliveryModes(storeState.activeStore),
    [storeState.activeStore],
  );
  const activeStoreTags = React.useMemo(
    () => buildStoreTags(storeState.activeStore),
    [storeState.activeStore],
  );
  const activeStoreScreenStore = React.useMemo(
    () => mapStoreDetailToScreenStore(
      storeState.activeStoreDetail,
      storeState.activeStore,
      activeStoreTags,
      activeStoreDeliveryModes,
      activeStoreCategories,
    ),
    [storeState.activeStoreDetail, storeState.activeStore, activeStoreTags, activeStoreDeliveryModes, activeStoreCategories],
  );

  return {
    storeDetailState: storeState.storeDetailState,
    activeStoreScreenStore,
    activeStoreItems,
    activeStoreId: storeState.activeStoreId,
    activeStore: storeState.activeStore,
    itemsQuery: storeState.itemsQuery,
    setItemsQuery: storeState.setItemsQuery,
    itemsCategory: storeState.itemsCategory,
    setItemsCategory: storeState.setItemsCategory,
    selectedItemId: storeState.selectedItemId,
    setSelectedItemId: storeState.setSelectedItemId,
    fetchStoreDetail: storeState.fetchStoreDetail,
    activeCanonicalStoreId: storeState.activeCanonicalStoreId,
    activeCanonicalProductId: storeState.activeCanonicalProductId,
    setActiveStoreId: storeState.setActiveStoreId,
    setActiveStoreDetail: storeState.setActiveStoreDetail,
    setStoreDetailState: storeState.setStoreDetailState,
    setActiveStoreItemsState: storeState.setActiveStoreItemsState,
    setActiveCanonicalStoreId: storeState.setActiveCanonicalStoreId,
    setActiveCanonicalProductId: storeState.setActiveCanonicalProductId,
    favoriteOverrides: storeState.favoriteOverrides,
    setFavoriteOverrides: storeState.setFavoriteOverrides,
  };
}
