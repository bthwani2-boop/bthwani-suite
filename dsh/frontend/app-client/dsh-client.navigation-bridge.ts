import { Platform } from 'react-native';
import type { DshClientState } from '../shared/state-machines/client-state';
import {
  type DshClientCreateOrderRequest,
  type DshFulfillmentDeliveryMode,
  type CreateOrderValues as SharedCreateOrderValues,
  type HostOrderSummary as SharedHostOrderSummary,
  type HostCartItem as SharedHostCartItem,
  type HostCanonicalMetadata as SharedHostCanonicalMetadata,
  hostClientStates as sharedHostClientStates,
  initialCreateOrderValues as sharedInitialCreateOrderValues,
  resolveStorePickupAddress as sharedResolveStorePickupAddress,
  publishedPromoCategoryIds as sharedPublishedPromoCategoryIds,
} from '../shared/contracts/dsh-client-binding.contracts';
import type { DshCommandTarget, DshRoute } from './dsh-client.types';

export type CreateOrderValues = SharedCreateOrderValues;
export type HostOrderSummary = SharedHostOrderSummary;
export type HostCartItem = SharedHostCartItem;
export type HostCanonicalMetadata = SharedHostCanonicalMetadata;

export const hostClientStates = sharedHostClientStates;
export const initialCreateOrderValues = sharedInitialCreateOrderValues;

// Category IDs available for promo display — populated at runtime from GET /catalog/categories API.
// Empty on first load; components should fetch from API and update state.
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
    case 'home':
      return 'home';
    case 'cart-get':
      return 'cart-get';
    case 'orders-list':
      return 'orders-list';
    case 'tracking':
      return 'tracking';
    case 'bell':
      return 'bell';
    case 'create-order':
      return 'cart-get';
    default:
      return 'home';
  }
}
