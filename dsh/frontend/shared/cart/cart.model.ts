// Canonical location: dsh/frontend/shared/cart/cart.model.ts
// Authority: dsh/frontend/shared/cart — client cart topic model wrapper.
// No JSX. No ui-kit. No Tamagui.

import { useDshClientCartState } from './cart.view-model';
import type { DshFulfillmentDeliveryMode } from './cart.contract';
import type { DshDiscoveryStore } from '../stores';
import type { DshRoute } from '../checkout/dsh-client-binding.contracts';
import React from 'react';

type UseDshClientCartModelOptions = {
  activeStore: DshDiscoveryStore;
  activeCanonicalStoreId: string | undefined;
  setActiveCanonicalStoreId: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeCanonicalProductId: string | undefined;
  setActiveCanonicalProductId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setActiveStoreId: React.Dispatch<React.SetStateAction<string>>;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  clientVisibleDiscoveryStores: DshDiscoveryStore[];
  defaultFulfillmentMode: DshFulfillmentDeliveryMode;
};

export function useDshClientCartModel(options: UseDshClientCartModelOptions) {
  return useDshClientCartState(options);
}
