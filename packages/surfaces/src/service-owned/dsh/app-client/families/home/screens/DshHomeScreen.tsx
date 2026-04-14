import React from 'react';
import { DshHomeGetScreen, type DshHomeCategory } from './DshHomeGetScreen';
import {
  defaultCategories,
  defaultPromos,
  defaultStores,
  type DshHomePromo,
  type DshHomeScreenState,
  type DshHomeStore,
  toDiscoveryPromos,
  toDiscoveryStores,
  toRecentOrders,
} from './DshHomeScreen.mappers';

export type DshHomeScreenProps = {
  state?: DshHomeScreenState;
  categories?: DshHomeCategory[];
  featuredStores?: DshHomeStore[];
  promos?: DshHomePromo[];
  onStartDelivery?: () => void;
  onContinueOrder?: () => void;
  onOpenDiscovery?: () => void;
  onOpenEntry?: () => void;
  onOpenCart?: () => void;
  onOpenStoresList?: () => void;
  onOpenStoreCategory?: (storeId: string, categoryId: string) => void;
  onOpenProduct?: (storeId: string, itemId: string) => void;
  onOpenBenefits?: () => void;
  onOpenSearch?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenCategory?: (categoryId: string) => void;
  onOpenStore?: (storeId: string) => void;
  onRetry?: () => void;
};


export function DshHomeScreen({
  state = 'ready',
  categories = defaultCategories,
  featuredStores = defaultStores,
  promos = defaultPromos,
  onStartDelivery,
  onContinueOrder,
  onOpenDiscovery,
  onOpenStoresList,
  onOpenEntry,
  onOpenCart,
  onOpenStoreCategory,
  onOpenProduct,
  onOpenBenefits,
  onOpenSearch,
  onOpenOrders,
  onOpenTracking,
  onOpenCategory,
  onOpenStore,
  onRetry,
}: DshHomeScreenProps) {
  void onStartDelivery;
  void onContinueOrder;

  return (
    <DshHomeGetScreen
      categories={categories}
      state={state}
      promos={toDiscoveryPromos(promos)}
      stores={toDiscoveryStores(featuredStores)}
      recentOrders={toRecentOrders(featuredStores)}
      onOpenCategory={onOpenCategory}
      onOpenStoresList={onOpenStoresList ?? onOpenDiscovery}
      onOpenEntry={onOpenEntry}
      onOpenCart={onOpenCart}
      onOpenStoreCategory={onOpenStoreCategory}
      onOpenProduct={onOpenProduct}
      onOpenBenefits={onOpenBenefits}
      onOpenFavorites={() => onOpenCategory?.('favorites')}
      onOpenSearch={onOpenSearch}
      onOpenOrders={onOpenOrders}
      onOpenTracking={onOpenTracking}
      onOpenStore={onOpenStore}
      onRetry={onRetry}
    />
  );
}

export default DshHomeScreen;