import { useDshClientWltReadModel } from '../finance-boundary';
import { useDshClientCartModel } from '../cart/cart.model';
import type { DshFulfillmentDeliveryMode } from '../cart';
import { useCheckoutAuth } from '../checkout/useCheckoutAuth';
import { useDshClientCheckoutModel } from '../checkout/checkout.model';
import { useDshClientNotificationsModel } from '../notifications/client-notifications.model';
import { useDshClientOrderTrackingModel } from '../orders/client-order-tracking.model';
import { useDshClientStoreModel } from '../stores/client-store.model';
import { useDshClientHomeActions } from './useDshClientHomeActions';
import { useDshClientHomeComposition } from './client-home.composition';
import { useDshClientNavigation } from './useDshClientNavigation';
import type { DshNavigationCommand } from '../checkout/dsh-client-binding.contracts';
import {
  useDshClientSurfaceModel as useDshClientSurfacePresenterModel,
  type DshClientAppearance,
} from './useDshClientSurfaceModel';

type UseDshClientSurfaceBindingProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
  authToken?: string;
  devClientId?: string;
  appearance: DshClientAppearance;
  dshApiBaseUrl: string | undefined;
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;
  isAwnakEnabled: boolean;
};

export function useDshClientSurfaceBinding(props: UseDshClientSurfaceBindingProps) {
  const homeComposition = useDshClientHomeComposition();
  const navigation = useDshClientNavigation({
    command: props.command,
    onExit: props.onExit,
  });

  const storeModel = useDshClientStoreModel({
    route: navigation.route,
    clientVisibleDiscoveryStores: homeComposition.clientVisibleDiscoveryStores,
  });

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

  const checkoutAuth = useCheckoutAuth({
    authToken: props.authToken,
    dshAuthBearerToken: props.dshAuthBearerToken,
    devClientId: props.devClientId,
    dshClientId: props.dshClientId,
  });
  const checkoutClientId = 'clientId' in checkoutAuth ? checkoutAuth.clientId : undefined;
  const checkoutBearerToken = 'bearerToken' in checkoutAuth ? checkoutAuth.bearerToken : undefined;
  const walletSession = useDshClientWltReadModel(checkoutClientId, checkoutBearerToken);

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

  const notificationsModel = useDshClientNotificationsModel({
    route: navigation.route,
    dshApiBaseUrl: props.dshApiBaseUrl,
    checkoutAuth,
    setRoute: navigation.setRoute,
  });

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

  return useDshClientSurfacePresenterModel({
    ...props,
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
