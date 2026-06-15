// Canonical location: dsh/frontend/shared/discovery/client-home.model.ts
// Authority: dsh/frontend/shared/discovery — client home discovery model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export type ClientHomeModelProps = {
  homeComposition: any;
  marketingModel: any;
  storeModel: any;
  homeActions: any;
  notificationsModel: any;
  navigation: any;
};

export function useDshClientHomeModel({
  homeComposition,
  marketingModel,
  storeModel,
  homeActions,
  notificationsModel,
  navigation,
}: ClientHomeModelProps) {
  const {
    homeCategories,
    homeScreenState,
    clientVisibleHomeStores,
    homeRecentOrders,
    clientDiscoveryStoresBridge,
    setHomeRetryToken,
  } = homeComposition;

  const {
    homeMarketingPromos,
    homePromos,
    liveMarketingShorts,
  } = marketingModel;

  const { favoriteOverrides } = storeModel;

  const {
    handleToggleHomeFavorite,
    handleOpenHomeCategory,
    handleOpenHomeStoreCategory,
    handleOpenHomeProduct,
    handleOpenHomeStore,
  } = homeActions;

  const { handleOpenHomeBenefits } = notificationsModel;

  const {
    openHomeInlineSearch,
    homeSearchAutoOpenToken,
    sheinInlineOpen,
    setSheinInlineOpen,
    awnakInlineOpen,
    setAwnakInlineOpen,
  } = navigation;

  return {
    categories: homeCategories,
    homeScreenState,
    homeMarketingPromos,
    homePromos,
    liveMarketingShorts,
    clientVisibleHomeStores,
    homeRecentOrders,
    homeSearchAutoOpenToken,
    favoriteOverrides,
    handleToggleFavorite: handleToggleHomeFavorite,
    handleOpenHomeCategory,
    handleOpenHomeStoreCategory,
    handleOpenHomeProduct,
    handleOpenHomeBenefits,
    openHomeInlineSearch,
    handleOpenHomeStore,
    setHomeRetryToken,
    sheinInlineOpen,
    setSheinInlineOpen,
    awnakInlineOpen,
    setAwnakInlineOpen,
    clientDiscoveryStoresBridge,
  };
}
