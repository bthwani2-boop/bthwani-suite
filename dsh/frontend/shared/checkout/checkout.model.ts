// Canonical location: dsh/frontend/shared/checkout/checkout.model.ts
// Authority: dsh/frontend/shared/checkout — client checkout topic model wrapper.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshClientOrderExecution } from './checkout.view-model';
import type { HostCartItem, DshFulfillmentDeliveryMode } from '../cart';
import type { DshCheckoutAuthContext } from './checkout.api';
import type { WalletSessionContext, ActiveStore } from './checkout.view-model';
import type { CreateOrderValues } from './checkout.contract';
import type { DshRoute, HostOrderSummary } from '../checkout/dsh-client-binding.contracts';
import type { DshClientState } from '../orders/orders.client-state';

type UseDshClientCheckoutModelOptions = {
  cartItems: HostCartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<HostCartItem[]>>;
  activeStore: ActiveStore;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  setSelectedFulfillmentMode: (mode: DshFulfillmentDeliveryMode) => void;
  checkoutAuth: DshCheckoutAuthContext;
  walletPreview: WalletSessionContext;
  createOrderValues: CreateOrderValues;
  setCreateOrderValues: React.Dispatch<React.SetStateAction<CreateOrderValues>>;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  openTrackedOrder: (orderId?: string, opts?: Record<string, unknown>) => void;
  setOrdersListState: React.Dispatch<React.SetStateAction<HostOrderSummary[]>>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<string>>;
  setTrackingClientState: React.Dispatch<React.SetStateAction<DshClientState>>;
  setTrackingOrderOverride: React.Dispatch<React.SetStateAction<Partial<CreateOrderValues> | null>>;
};

export function useDshClientCheckoutModel(options: UseDshClientCheckoutModelOptions) {
  return useDshClientOrderExecution(options);
}
