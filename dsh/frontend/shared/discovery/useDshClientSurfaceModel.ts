// Canonical location: dsh/frontend/shared/discovery/useDshClientSurfaceModel.ts
// Authority: dsh/frontend/shared/discovery — thin orchestration shell for DshClientSurface.
// Calls topic-level models and wires cross-topic dependencies. No business state.
// Appearance is injected by the app-client shell (useAppClientAppearance is shell-specific).
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshClientHomeComposition } from './client-home.composition';
import { useDshClientNavigation } from './useDshClientNavigation';
import { useDshClientHomeActions } from './useDshClientHomeActions';
import { useDshClientStoreModel } from '../stores/client-store.model';
import { useDshClientCartState } from '../cart';
import { useDshOrderTracking } from '../orders';
import { useWltDshWalletSession } from '../../../../wlt/frontend/dsh/shared';
import { useDshClientOrderExecution } from '../checkout';
import { useDshClientNotificationsModel } from '../notifications/client-notifications.model';
import { useCheckoutAuth } from '../checkout/useCheckoutAuth';
import type {
  DshNavigationCommand,
  DshFulfillmentDeliveryMode,
} from '../checkout/dsh-client-binding.contracts';

// Topic-level models
import { useDshClientSessionModel } from './client-session.model';
import { useDshClientNavigationModel } from './client-navigation.model';
import { useDshClientHomeModel } from './client-home.model';
import { useDshClientStoreTopicModel } from './client-store-topic.model';
import { useDshClientCheckoutTopicModel } from './client-checkout-topic.model';
import { useDshClientOrdersTopicModel } from './client-orders-topic.model';
import { useDshClientMarketingTopicModel } from './client-marketing-topic.model';
import { useDshClientBellModel } from './client-bell.model';
import { useDshClientHomeActionsTopicModel } from './client-home-actions.model';

export type DshClientAppearance = {
  hydrated: boolean;
  mode: string;
  setMode: (mode: string) => void;
};

export type DshClientSurfaceSharedProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
  authToken?: string;
  devClientId?: string;
  dshApiBaseUrl: string | undefined;
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;
  isAwnakEnabled: boolean;
  appearance: DshClientAppearance;
};

export function useDshClientSurfaceModel({
  command,
  onExit,
  onOpenService,
  authToken,
  devClientId,
  dshApiBaseUrl,
  dshAuthBearerToken,
  dshClientId,
  isAwnakEnabled,
  appearance,
}: DshClientSurfaceSharedProps) {
  // ── Home + discovery stores ───────────────────────────────────────────────────
  const homeComposition = useDshClientHomeComposition();

  // ── Navigation ────────────────────────────────────────────────────────────────
  const navigation = useDshClientNavigation({ command, onExit });

  // ── Store topic model ─────────────────────────────────────────────────────────
  const storeModel = useDshClientStoreModel({
    route: navigation.route,
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
  });

  // ── Cart ──────────────────────────────────────────────────────────────────────
  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const cart = useDshClientCartState({
    activeStore: storeModel.activeStore,
    activeCanonicalStoreId: storeModel.activeCanonicalStoreId,
    setActiveCanonicalStoreId: storeModel.setActiveCanonicalStoreId,
    activeCanonicalProductId: storeModel.activeCanonicalProductId,
    setActiveCanonicalProductId: storeModel.setActiveCanonicalProductId,
    setActiveStoreId: storeModel.setActiveStoreId,
    setRoute: navigation.setRoute,
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
    defaultFulfillmentMode,
  });

  // ── Auth + WLT wallet ─────────────────────────────────────────────────────────
  const checkoutAuth = useCheckoutAuth({ authToken, dshAuthBearerToken, devClientId, dshClientId });
  const walletSession = useWltDshWalletSession(checkoutAuth.clientId, checkoutAuth.bearerToken);

  // ── Orders tracking ───────────────────────────────────────────────────────────
  const ordersTracking = useDshOrderTracking({
    route: navigation.route,
    checkoutAuth,
    createOrderValues: cart.createOrderValues,
    selectedFulfillmentMode: cart.selectedFulfillmentMode,
    defaultFulfillmentMode,
    setRoute: navigation.setRoute,
    setSelectedFulfillmentMode: cart.setSelectedFulfillmentMode,
    setCreateOrderValues: cart.setCreateOrderValues,
  });

  // ── Checkout execution ────────────────────────────────────────────────────────
  const checkoutExecution = useDshClientOrderExecution({
    cartItems: cart.cartItems,
    setCartItems: cart.setCartItems,
    activeStore: storeModel.activeStore,
    selectedFulfillmentMode: cart.selectedFulfillmentMode,
    setSelectedFulfillmentMode: cart.setSelectedFulfillmentMode,
    checkoutAuth,
    walletSession,
    createOrderValues: cart.createOrderValues,
    setCreateOrderValues: cart.setCreateOrderValues,
    setRoute: navigation.setRoute,
    openTrackedOrder: ordersTracking.openTrackedOrder,
    setOrdersListState: ordersTracking.setOrdersListState,
    setSelectedOrderId: ordersTracking.setSelectedOrderId,
    setTrackingClientState: ordersTracking.setTrackingClientState,
    setTrackingOrderOverride: ordersTracking.setTrackingOrderOverride,
  });

  // ── Notifications topic model ─────────────────────────────────────────────────
  const notificationsModel = useDshClientNotificationsModel({
    route: navigation.route,
    dshApiBaseUrl,
    checkoutAuth,
    setRoute: navigation.setRoute,
  });

  // ── Home actions (cross-topic) ────────────────────────────────────────────────
  const homeActions = useDshClientHomeActions({
    setRoute: navigation.setRoute,
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
    clientVisibleHomeStores: homeComposition.clientVisibleHomeStores,
    isAwnakEnabled,
    setSheinInlineOpen: navigation.setSheinInlineOpen,
    setAwnakInlineOpen: navigation.setAwnakInlineOpen,
    activeStore: storeModel.activeStore,
    selectedFulfillmentMode: cart.selectedFulfillmentMode,
    setSelectedFulfillmentMode: cart.setSelectedFulfillmentMode,
    setCreateOrderValues: cart.setCreateOrderValues,
    setActiveStoreId: storeModel.setActiveStoreId,
    setActiveCanonicalStoreId: storeModel.setActiveCanonicalStoreId,
    setActiveCanonicalProductId: storeModel.setActiveCanonicalProductId,
    setItemsQuery: storeModel.setItemsQuery,
    setItemsCategory: storeModel.setItemsCategory,
    setSelectedItemId: storeModel.setSelectedItemId,
    setStoreItemsEntryOrigin: cart.setStoreItemsEntryOrigin,
    favoriteOverrides: storeModel.favoriteOverrides,
    setFavoriteOverrides: storeModel.setFavoriteOverrides,
    hasStoreTarget: (storeId?: string) =>
      typeof storeId === 'string' && homeComposition.clientVisibleDiscoveryStores.some((s) => s.id === storeId),
  });

  // ── Topic-level compositions ─────────────────────────────────────────────────
  const sessionTopic = useDshClientSessionModel({
    dshAuthBearerToken,
    dshClientId,
    appearance,
    bellSignalEvents: notificationsModel.bellSignalEvents,
    walletSession,
  });

  const navigationTopic = useDshClientNavigationModel({
    route: navigation.route,
    setRoute: navigation.setRoute,
    handleRegisterBackHandler: navigation.handleRegisterBackHandler,
    openCreateOrderJourney: cart.openCreateOrderJourney,
    openTrackedOrder: ordersTracking.openTrackedOrder,
    setSelectedOperationScreen: notificationsModel.setSelectedOperationScreen,
    selectedOperationScreen: notificationsModel.selectedOperationScreen,
    onExit,
    openSupportFlow: notificationsModel.openSupportFlow,
    serviceDialTrigger: notificationsModel.serviceDialTrigger,
    onOpenService,
  });

  const marketingTopic = useDshClientMarketingTopicModel({
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
    activeStoreItems: storeModel.activeStoreItems,
    homeActions,
  });

  const homeTopic = useDshClientHomeModel({
    homeComposition,
    marketingModel: marketingTopic,
    storeModel,
    homeActions,
    notificationsModel,
    navigation,
  });

  const storeTopic = useDshClientStoreTopicModel({
    storeModel,
    cart,
    homeActions,
  });

  const checkoutTopic = useDshClientCheckoutTopicModel({
    cart,
    checkoutExecution,
    checkoutAuth,
  });

  const ordersTopic = useDshClientOrdersTopicModel({
    ordersTracking,
    command,
  });

  const bellTopic = useDshClientBellModel({
    notificationsModel,
  });

  const homeActionsTopic = useDshClientHomeActionsTopicModel({
    homeActions,
  });

  return {
    session: sessionTopic,
    routeContext: navigationTopic,
    home: homeTopic,
    store: storeTopic,
    checkout: checkoutTopic,
    orders: ordersTopic,
    marketing: marketingTopic,
    bell: bellTopic,
    homeActions: homeActionsTopic,
  };
}
