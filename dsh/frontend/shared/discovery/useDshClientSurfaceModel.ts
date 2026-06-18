// Canonical location: dsh/frontend/shared/discovery/useDshClientSurfaceModel.ts
// Authority: dsh/frontend/shared/discovery — thin orchestration shell for DshClientSurface.
// Wires topic-level models and cross-topic dependencies. No business state.
// Appearance is injected by the app-client shell.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshAppearanceMode } from '../platform/appearance.contract';
import type { useDshClientHomeComposition } from './client-home.composition';
import type { useDshClientNavigation } from './useDshClientNavigation';
import type { useDshClientHomeActions } from './useDshClientHomeActions';
import type { useDshClientStoreModel } from '../stores/client-store.model';
import type { useDshClientCartModel } from '../cart/cart.model';
import type { useDshClientOrderTrackingModel } from '../orders/client-order-tracking.model';
import type { useDshClientWltReadModel } from '../finance-boundary';
import type { useDshClientCheckoutModel } from '../checkout/checkout.model';
import type { useDshClientNotificationsModel } from '../notifications/client-notifications.model';
import type { useCheckoutAuth } from '../checkout/useCheckoutAuth';
import type {
  DshNavigationCommand,
} from '../checkout/dsh-client-binding.contracts';

// Topic-level presenter models (pure computed models)
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
  mode: DshAppearanceMode;
  setMode: (mode: DshAppearanceMode) => void;
};

export type DshClientSurfaceSharedProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
  isAwnakEnabled: boolean;
  appearance: DshClientAppearance;
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;

  // Pre-instantiated models/states passed from the host container (app-client)
  homeComposition: ReturnType<typeof useDshClientHomeComposition>;
  navigation: ReturnType<typeof useDshClientNavigation>;
  storeModel: ReturnType<typeof useDshClientStoreModel>;
  cart: ReturnType<typeof useDshClientCartModel>;
  checkoutAuth: ReturnType<typeof useCheckoutAuth>;
  walletSession: ReturnType<typeof useDshClientWltReadModel>;
  ordersTracking: ReturnType<typeof useDshClientOrderTrackingModel>;
  checkoutExecution: ReturnType<typeof useDshClientCheckoutModel>;
  notificationsModel: ReturnType<typeof useDshClientNotificationsModel>;
  homeActions: ReturnType<typeof useDshClientHomeActions>;
};

export function useDshClientSurfaceModel({
  command,
  onExit,
  onOpenService,
  isAwnakEnabled,
  appearance,
  dshAuthBearerToken,
  dshClientId,
  homeComposition,
  navigation,
  storeModel,
  cart,
  checkoutAuth,
  walletSession,
  ordersTracking,
  checkoutExecution,
  notificationsModel,
  homeActions,
}: DshClientSurfaceSharedProps) {
  // Topic-level compositions (pure presenter models, no state ownership)
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
