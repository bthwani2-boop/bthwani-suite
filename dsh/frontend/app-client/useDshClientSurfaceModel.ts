// Thin composition shell — authority moved to dsh/frontend/shared/discovery/useDshClientSurfaceModel.ts
// Instantiates the topic state-holding hooks and passes them to the shared orchestration model.

import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import {
  useDshClientSurfaceModel as useDshClientSurfaceModelShared,
  type DshClientSurfaceSharedProps,
} from '../shared/discovery/useDshClientSurfaceModel';
import type { DshClientSurfaceProps } from './dsh-client.types';

// Import state-holding topic hooks from shared
import { useDshClientHomeComposition } from '../shared/discovery/client-home.composition';
import { useDshClientNavigation } from '../shared/discovery/useDshClientNavigation';
import { useDshClientStoreModel } from '../shared/stores/client-store.model';
import { useDshClientCartModel } from '../shared/cart/cart.model';
import { useCheckoutAuth } from '../shared/checkout/useCheckoutAuth';
import { useWltDshWalletSession } from '../../../wlt/frontend/dsh/shared';
import { useDshClientOrderTrackingModel } from '../shared/orders/client-order-tracking.model';
import { useDshClientCheckoutModel } from '../shared/checkout/checkout.model';
import { useDshClientNotificationsModel } from '../shared/notifications/client-notifications.model';
import { useDshClientHomeActions } from '../shared/discovery/useDshClientHomeActions';
import type { DshFulfillmentDeliveryMode } from '../shared/cart';

type UseDshClientSurfaceModelProps = DshClientSurfaceProps & {
  dshApiBaseUrl: string | undefined;
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;
  isAwnakEnabled: boolean;
};

export function useDshClientSurfaceModel(props: UseDshClientSurfaceModelProps) {
  const appearance = useAppClientAppearance();

  // 1. Home composition (Home categories, discovery stores)
  const homeComposition = useDshClientHomeComposition();

  // 2. Navigation (Route state, back handler)
  const navigation = useDshClientNavigation({
    command: props.command,
    onExit: props.onExit,
  });

  // 3. Store topic model state
  const storeModel = useDshClientStoreModel({
    route: navigation.route,
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
  });

  // 4. Cart state
  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const cart = useDshClientCartModel({
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

  // 5. Auth context & WLT Wallet session
  const checkoutAuth = useCheckoutAuth({
    authToken: props.authToken,
    dshAuthBearerToken: props.dshAuthBearerToken,
    devClientId: props.devClientId,
    dshClientId: props.dshClientId,
  });
  const walletSession = useWltDshWalletSession(checkoutAuth.clientId, checkoutAuth.bearerToken);

  // 6. Orders tracking state
  const ordersTracking = useDshClientOrderTrackingModel({
    route: navigation.route,
    checkoutAuth,
    createOrderValues: cart.createOrderValues,
    selectedFulfillmentMode: cart.selectedFulfillmentMode,
    defaultFulfillmentMode,
    setRoute: navigation.setRoute,
    setSelectedFulfillmentMode: cart.setSelectedFulfillmentMode,
    setCreateOrderValues: cart.setCreateOrderValues,
  });

  // 7. Checkout execution state (Note: we map walletSession to the expected walletPreview parameter)
  const checkoutExecution = useDshClientCheckoutModel({
    cartItems: cart.cartItems,
    setCartItems: cart.setCartItems,
    activeStore: storeModel.activeStore,
    selectedFulfillmentMode: cart.selectedFulfillmentMode,
    setSelectedFulfillmentMode: cart.setSelectedFulfillmentMode,
    checkoutAuth,
    walletPreview: walletSession,
    createOrderValues: cart.createOrderValues,
    setCreateOrderValues: cart.setCreateOrderValues,
    setRoute: navigation.setRoute,
    openTrackedOrder: ordersTracking.openTrackedOrder,
    setOrdersListState: ordersTracking.setOrdersListState,
    setSelectedOrderId: ordersTracking.setSelectedOrderId,
    setTrackingClientState: ordersTracking.setTrackingClientState,
    setTrackingOrderOverride: ordersTracking.setTrackingOrderOverride,
  });

  // 8. Notifications / Bell state
  const notificationsModel = useDshClientNotificationsModel({
    route: navigation.route,
    dshApiBaseUrl: props.dshApiBaseUrl,
    checkoutAuth,
    setRoute: navigation.setRoute,
  });

  // 9. Home actions orchestration
  const homeActions = useDshClientHomeActions({
    setRoute: navigation.setRoute,
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
    clientVisibleHomeStores: homeComposition.clientVisibleHomeStores,
    isAwnakEnabled: props.isAwnakEnabled,
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

  return useDshClientSurfaceModelShared({
    ...props,
    appearance,
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
  });
}
