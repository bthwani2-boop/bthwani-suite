// Canonical location: dsh/frontend/shared/discovery/client-home.composition.ts
// Authority: dsh/frontend/shared/discovery — home feed, discovery stores, categories.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshClientRuntimeStores } from '../checkout/useDshClientRuntimeStores';
import { useDshClientHomeCategories } from './useDshClientHomeCategories';
import type { DshHomeRecentOrder } from './dsh-home-types';

export type DshClientHomeCompositionResult = {
  clientDiscoveryStoresBridge: ReturnType<typeof useDshClientRuntimeStores>['clientDiscoveryStoresBridge'];
  clientVisibleDiscoveryStores: ReturnType<typeof useDshClientRuntimeStores>['clientVisibleDiscoveryStores'];
  clientVisibleHomeStores: ReturnType<typeof useDshClientRuntimeStores>['clientVisibleHomeStores'];
  homeRetryToken: number;
  setHomeRetryToken: (token: number) => void;
  homeScreenState: ReturnType<typeof useDshClientHomeCategories>['state'];
  homeCategories: ReturnType<typeof useDshClientHomeCategories>['categories'];
  homeRecentOrders: readonly DshHomeRecentOrder[];
};

export function useDshClientHomeComposition(): DshClientHomeCompositionResult {
  const {
    clientDiscoveryStoresBridge,
    clientVisibleDiscoveryStores,
    clientVisibleHomeStores,
    homeRetryToken,
    setHomeRetryToken,
  } = useDshClientRuntimeStores();

  const { state: homeScreenState, categories: homeCategories } = useDshClientHomeCategories(
    clientVisibleHomeStores,
    clientDiscoveryStoresBridge.state,
    homeRetryToken,
  );

  const homeRecentOrders = React.useMemo<readonly DshHomeRecentOrder[]>(
    () =>
      clientVisibleHomeStores.slice(0, 2).map((store, index) => ({
        id: `home-recent-order-${store.id}`,
        storeId: store.id,
        title: index === 0 ? 'الطلب النشط' : 'آخر طلب',
        subtitle: store.name,
        meta: `${store.distanceLabel ?? 'غير محدد'} · ${store.deliveryLabel ?? store.serviceLabel ?? 'غير محدد'}`,
        statusLabel: store.statusTone === 'open' ? 'مباشر' : 'مغلق',
      })),
    [clientVisibleHomeStores],
  );

  return {
    clientDiscoveryStoresBridge,
    clientVisibleDiscoveryStores,
    clientVisibleHomeStores,
    homeRetryToken,
    setHomeRetryToken,
    homeScreenState,
    homeCategories,
    homeRecentOrders,
  };
}
