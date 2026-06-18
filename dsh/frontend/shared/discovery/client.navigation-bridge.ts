// Canonical location: dsh/frontend/shared/discovery/client.navigation-bridge.ts
// Authority: dsh/frontend/shared/discovery — client route mapping and bridge state.
// No JSX. No ui-kit. No Tamagui.

import {
  type CreateOrderValues as SharedCreateOrderValues,
  type HostOrderSummary as SharedHostOrderSummary,
  type HostCartItem as SharedHostCartItem,
  type HostCanonicalMetadata as SharedHostCanonicalMetadata,
  type DshCommandTarget,
  type DshRoute,
  hostClientStates as sharedHostClientStates,
  initialCreateOrderValues as sharedInitialCreateOrderValues,
  resolveStorePickupAddress as sharedResolveStorePickupAddress,
  publishedPromoCategoryIds as sharedPublishedPromoCategoryIds,
} from '../checkout/dsh-client-binding.contracts';

export type CreateOrderValues = SharedCreateOrderValues;
export type HostOrderSummary = SharedHostOrderSummary;
export type HostCartItem = SharedHostCartItem;
export type HostCanonicalMetadata = SharedHostCanonicalMetadata;

export const hostClientStates = sharedHostClientStates;
export const initialCreateOrderValues = sharedInitialCreateOrderValues;
export const publishedPromoCategoryIds = sharedPublishedPromoCategoryIds;

// Store lists — populated at runtime from GET /stores API.
// Empty on first load; components should render loading state until API responds.
export const clientVisibleDiscoveryStores: never[] = [];
export const clientVisibleHomeStores: never[] = [];

// Order and cart initial state — empty; populated from GET /orders API.
export const initialOrders: HostOrderSummary[] = [];

export const resolveStorePickupAddress = sharedResolveStorePickupAddress;

export function commandTargetToRoute(target: DshCommandTarget): DshRoute {
  switch (target) {
    case 'home': return 'home';
    case 'cart-get': return 'cart-get';
    case 'orders-list': return 'orders-list';
    case 'tracking': return 'tracking';
    case 'bell': return 'bell';
    case 'create-order': return 'cart-get';
    default: return 'home';
  }
}
