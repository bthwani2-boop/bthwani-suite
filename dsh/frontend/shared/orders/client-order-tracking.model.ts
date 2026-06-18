// Canonical location: dsh/frontend/shared/orders/client-order-tracking.model.ts
// Authority: dsh/frontend/shared/orders — client order tracking topic model wrapper.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshOrderTracking } from './orders.view-model';
import type { DshRoute } from '../checkout/dsh-client-binding.contracts';
import type { DshCheckoutAuthContext } from '../checkout';
import type { CreateOrderValues } from '../checkout/dsh-client-binding.contracts';
import type { DshFulfillmentDeliveryMode } from '../checkout/dsh-client-binding.contracts';

type UseDshOrderTrackingOptions = {
  route: DshRoute;
  checkoutAuth: DshCheckoutAuthContext;
  createOrderValues: CreateOrderValues;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  defaultFulfillmentMode: DshFulfillmentDeliveryMode;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  setSelectedFulfillmentMode: (mode: DshFulfillmentDeliveryMode) => void;
  setCreateOrderValues: React.Dispatch<React.SetStateAction<CreateOrderValues>>;
};

export function useDshClientOrderTrackingModel(options: UseDshOrderTrackingOptions) {
  return useDshOrderTracking(options);
}
