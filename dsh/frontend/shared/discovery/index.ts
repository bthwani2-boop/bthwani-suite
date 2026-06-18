// Discovery topic — home feed, store discovery, service dial, category rails.
// DshServiceId and DiscoveryFilter are canonical here via dsh-discovery.contract.
// dsh-home-types re-exported selectively to avoid duplicating the above two types.

export * from './dsh-discovery.contract';
export type {
  DshHomeBannerActionType,
  DshHomeCategory,
  DshHomeGetPromo,
  DshHomeGetStore,
  DshHomeRecentOrder,
  StorePagerPage,
} from './dsh-home-types';

export * from './home-search-helpers';
export * from './home-promo-mappers';
export type {
  CreateOrderValues as DiscoveryCreateOrderValues,
  HostOrderSummary as DiscoveryHostOrderSummary,
  HostCartItem as DiscoveryHostCartItem,
  HostCanonicalMetadata as DiscoveryHostCanonicalMetadata,
} from './client.navigation-bridge';
export {
  hostClientStates as discoveryHostClientStates,
  publishedPromoCategoryIds as discoveryPublishedPromoCategoryIds,
  clientVisibleDiscoveryStores,
  clientVisibleHomeStores,
  resolveStorePickupAddress as discoveryResolveStorePickupAddress,
  commandTargetToRoute as discoveryCommandTargetToRoute,
} from './client.navigation-bridge';
export * from './useDshClientNavigation';
export * from './useDshClientBellState';
export * from './client-home.composition';
export * from './useDshClientSurfaceModel';
export * from './client-session.model';
export * from './client-navigation.model';
export * from './client-home.model';
export * from './client-store-topic.model';
export * from './client-checkout-topic.model';
export * from './client-orders-topic.model';
export * from './client-marketing-topic.model';
export * from './client-bell.model';
export * from './client-home-actions.model';
