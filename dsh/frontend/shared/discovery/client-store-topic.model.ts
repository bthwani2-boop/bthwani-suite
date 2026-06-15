// Canonical location: dsh/frontend/shared/discovery/client-store-topic.model.ts
// Authority: dsh/frontend/shared/discovery — client store topic model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export type ClientStoreTopicModelProps = {
  storeModel: any;
  cart: any;
  homeActions: any;
};

export function useDshClientStoreTopicModel({
  storeModel,
  cart,
  homeActions,
}: ClientStoreTopicModelProps) {
  const {
    storeDetailState,
    activeStoreScreenStore,
    activeStoreItems,
    activeStoreId,
    activeStore,
    itemsQuery,
    setItemsQuery,
    itemsCategory,
    setItemsCategory,
    setSelectedItemId,
    fetchStoreDetail,
  } = storeModel;

  const {
    storeItemsEntryOrigin,
    addItemToHostCart,
  } = cart;

  const {
    handleOpenActiveStoreItems,
    handleOpenActiveStoreCart,
  } = homeActions;

  return {
    storeDetailState,
    activeStoreScreenStore,
    activeStoreItems,
    activeStoreId,
    activeStore,
    itemsQuery,
    setItemsQuery,
    itemsCategory,
    setItemsCategory,
    storeItemsEntryOrigin,
    setSelectedItemId,
    addItemToHostCart,
    handleOpenActiveStoreItems,
    handleOpenActiveStoreCart,
    fetchStoreDetail,
  };
}
