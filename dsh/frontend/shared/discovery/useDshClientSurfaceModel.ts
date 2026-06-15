// Canonical location: dsh/frontend/shared/discovery/useDshClientSurfaceModel.ts
// Authority: dsh/frontend/shared/discovery — surface state model for DshClientSurface.
// Appearance is injected by the app-client shell (useAppClientAppearance is shell-specific).
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshClientRuntimeStores } from '../checkout/useDshClientRuntimeStores';
import { useDshClientHomeCategories } from './useDshClientHomeCategories';
import { useDshClientNavigation } from './useDshClientNavigation';
import {
  useDshClientStoreState,
  mapStoreDetailToScreenStore,
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
} from '../stores';
import { useDshClientCartState } from '../cart';
import { useDshOrderTracking } from '../orders';
import { useWltDshWalletSession } from '../../../../wlt/frontend/dsh/shared';
import { useDshClientOrderExecution } from '../checkout';
import { useDshClientMarketingState } from '../marketing/useDshClientMarketingState';
import { useDshClientBellState } from './useDshClientBellState';
import { useDshClientHomeActions } from './useDshClientHomeActions';
import type {
  DshNavigationCommand,
  DshFulfillmentDeliveryMode,
} from '../checkout/dsh-client-binding.contracts';
import { initialOrders, commandTargetToRoute, hostClientStates } from './client.navigation-bridge';

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

const defaultTrackingOrderId = initialOrders[0]?.id;

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
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = appearance;

  const {
    runtimeBridge,
    setRuntimeBridge,
    homeRetryToken,
    setHomeRetryToken,
    clientDiscoveryStoresBridge,
    clientVisibleDiscoveryStores,
    clientVisibleHomeStores,
  } = useDshClientRuntimeStores();

  const {
    state: homeScreenState,
    categories: homeCategories,
  } = useDshClientHomeCategories(clientVisibleHomeStores, clientDiscoveryStoresBridge.state, homeRetryToken);

  const {
    route, setRoute,
    sheinInlineOpen, setSheinInlineOpen,
    awnakInlineOpen, setAwnakInlineOpen,
    homeSearchAutoOpenToken, openHomeInlineSearch,
    handleRegisterBackHandler,
  } = useDshClientNavigation({ command, onExit });

  const {
    activeStoreId, setActiveStoreId,
    activeStoreDetail, setActiveStoreDetail,
    storeDetailState, setStoreDetailState,
    activeStoreItemsState, setActiveStoreItemsState,
    activeCanonicalStoreId, setActiveCanonicalStoreId,
    activeCanonicalProductId, setActiveCanonicalProductId,
    selectedItemId, setSelectedItemId,
    favoriteOverrides, setFavoriteOverrides,
    itemsQuery, setItemsQuery,
    itemsCategory, setItemsCategory,
    activeStore, fetchStoreDetail,
  } = useDshClientStoreState({ route, clientVisibleDiscoveryStores });

  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const {
    selectedFulfillmentMode, setSelectedFulfillmentMode,
    cartItems, setCartItems,
    createOrderValues, setCreateOrderValues,
    reorderAlertMessage, setReorderAlertMessage,
    storeItemsEntryOrigin, setStoreItemsEntryOrigin,
    addItemToHostCart, handleReorderClick, openCreateOrderJourney,
  } = useDshClientCartState({
    activeStore, activeCanonicalStoreId, setActiveCanonicalStoreId,
    activeCanonicalProductId, setActiveCanonicalProductId,
    setActiveStoreId, setRoute, clientVisibleDiscoveryStores, defaultFulfillmentMode,
  });

  const checkoutAuth = React.useMemo(() => {
    const bearerToken = (authToken ?? dshAuthBearerToken ?? undefined)?.trim();
    if (bearerToken) return { bearerToken };
    const clientId = (devClientId ?? dshClientId ?? '').trim();
    return clientId ? { clientId } : {};
  }, [authToken, dshAuthBearerToken, devClientId, dshClientId]);

  const {
    selectedOrderId, setSelectedOrderId,
    ordersListState, setOrdersListState,
    liveOrderDetails, trackingClientState, setTrackingClientState,
    trackingOrderOverride, setTrackingOrderOverride,
    ordersQuery, setOrdersQuery,
    filteredOrders, activeTrackedOrder,
    trackingOrderValues, trackingTimeline, trackingWltIntent,
    openTrackedOrder, reopenTracking, returnOrdersList,
    handleCancelOrder, handleSupportEscalation,
  } = useDshOrderTracking({
    route,
    checkoutAuth,
    createOrderValues, selectedFulfillmentMode, defaultFulfillmentMode,
    setRoute, setSelectedFulfillmentMode, setCreateOrderValues,
  });

  const walletSession = useWltDshWalletSession(checkoutAuth.clientId, checkoutAuth.bearerToken);

  const {
    handleConfirmedOrderExecution, selectedPaymentMethod, setSelectedPaymentMethod,
    checkoutState, setCheckoutState, paymentErrorMessage, checkoutIntentId,
    setCheckoutIntentId, checkoutClientMemo, handleConfirmCheckout,
  } = useDshClientOrderExecution({
    cartItems, setCartItems, activeStore, selectedFulfillmentMode, setSelectedFulfillmentMode,
    checkoutAuth, walletSession, createOrderValues, setCreateOrderValues, setRoute,
    openTrackedOrder, setOrdersListState, setSelectedOrderId, setTrackingClientState, setTrackingOrderOverride,
  });

  const hasStoreTarget = React.useCallback((storeId?: string): boolean =>
    typeof storeId === 'string' && clientVisibleDiscoveryStores.some((s) => s.id === storeId),
  [clientVisibleDiscoveryStores]);

  const hasStoreCategoryTarget = React.useCallback((storeId?: string, categoryId?: string): boolean => {
    if (!hasStoreTarget(storeId) || typeof categoryId !== 'string') return false;
    return activeStoreItemsState.some((item) => item.categoryId === categoryId);
  }, [hasStoreTarget, activeStoreItemsState]);

  const hasProductTarget = React.useCallback((storeId?: string, productId?: string): boolean => {
    if (!hasStoreTarget(storeId) || typeof productId !== 'string') return false;
    return activeStoreItemsState.some((item) => item.id === productId);
  }, [hasStoreTarget, activeStoreItemsState]);

  const { isMarketingGrowthRouteValid, liveMarketingPrograms, liveMarketingShorts, homeMarketingPromos, homePromos } =
    useDshClientMarketingState({ hasStoreTarget, hasStoreCategoryTarget, hasProductTarget });

  const {
    bellSignalEvents, selectedOperationScreen, setSelectedOperationScreen,
    serviceDialTrigger, handleServiceLauncherPress, handleOpenHomeBenefits, openSupportFlow,
  } = useDshClientBellState({ route, dshApiBaseUrl, checkoutAuth, setRoute });

  const {
    handleOpenActiveStoreItems, handleOpenActiveStoreCart, handleToggleHomeFavorite,
    handleOpenHomeCategory, handleOpenHomeStoreCategory, handleOpenHomeProduct,
    handleOpenHomeStore, handleClientBottomNavSelect,
    recordMarketingBannerClick, recordMarketingBannerImpression,
    recordMarketingGrowthClick, recordMarketingGrowthImpression,
  } = useDshClientHomeActions({
    setRoute, clientVisibleDiscoveryStores, clientVisibleHomeStores, isAwnakEnabled,
    setSheinInlineOpen, setAwnakInlineOpen, activeStore, selectedFulfillmentMode,
    setSelectedFulfillmentMode, setCreateOrderValues, setActiveStoreId, setActiveCanonicalStoreId,
    setActiveCanonicalProductId, setItemsQuery, setItemsCategory, setSelectedItemId,
    setStoreItemsEntryOrigin, favoriteOverrides, setFavoriteOverrides, hasStoreTarget,
  });

  React.useEffect(() => {
    if (commandTargetToRoute(command.target) === 'tracking') {
      if (defaultTrackingOrderId) {
        setSelectedOrderId(defaultTrackingOrderId);
        setTrackingClientState(hostClientStates.trackingActive);
      }
    }
  }, [command, setSelectedOrderId, setTrackingClientState]);

  // Suppress unused variable warnings for vars consumed only by setters
  void runtimeBridge;
  void setRuntimeBridge;
  void reorderAlertMessage;
  void setReorderAlertMessage;
  void storeItemsEntryOrigin;
  void setStoreItemsEntryOrigin;
  void ordersListState;
  void setOrdersListState;
  void trackingOrderOverride;
  void setTrackingOrderOverride;
  void selectedOrderId;
  void setCheckoutIntentId;
  void checkoutIntentId;
  void isMarketingGrowthRouteValid;
  void setActiveStoreDetail;
  void setStoreDetailState;
  void setActiveStoreItemsState;
  void selectedItemId;

  const activeStoreItems = activeStoreItemsState;
  const activeStoreCategories = React.useMemo(() => buildStoreCategories(activeStoreItems), [activeStoreItems]);
  const activeStoreDeliveryModes = React.useMemo(() => buildStoreDeliveryModes(activeStore), [activeStore]);
  const activeStoreTags = React.useMemo(() => buildStoreTags(activeStore), [activeStore]);
  const activeStoreScreenStore = React.useMemo(() =>
    mapStoreDetailToScreenStore(activeStoreDetail, activeStore, activeStoreTags, activeStoreDeliveryModes, activeStoreCategories),
  [activeStoreDetail, activeStore, activeStoreTags, activeStoreDeliveryModes, activeStoreCategories]);

  const homeRecentOrders = React.useMemo(() => clientVisibleHomeStores.slice(0, 2).map((store, index) => ({
    id: `home-recent-order-${store.id}`,
    storeId: store.id,
    title: index === 0 ? 'الطلب النشط' : 'آخر طلب',
    subtitle: store.name,
    meta: `${store.distanceLabel ?? 'غير محدد'} · ${store.deliveryLabel ?? store.serviceLabel ?? 'غير محدد'}`,
    statusLabel: store.statusTone === 'open' ? 'مباشر' : 'مغلق',
  })), [clientVisibleHomeStores]);

  return {
    session: { dshAuthBearerToken, dshClientId, appearanceHydrated, appearanceMode, setAppearanceMode, bellSignalEvents, walletSession },
    routeContext: {
      route, setRoute, returnHome: () => setRoute('home'), openCreateOrderJourney, openTrackedOrder,
      setSelectedOperationScreen, selectedOperationScreen, onExit, openSupportFlow,
      handleRegisterBackHandler, serviceDialTrigger, onOpenService,
    },
    home: {
      categories: homeCategories, homeScreenState, homeMarketingPromos, homePromos, liveMarketingShorts,
      clientVisibleHomeStores, homeRecentOrders, homeSearchAutoOpenToken, favoriteOverrides,
      handleToggleFavorite: handleToggleHomeFavorite,
      handleOpenHomeCategory, handleOpenHomeStoreCategory, handleOpenHomeProduct, handleOpenHomeBenefits,
      openHomeInlineSearch, handleOpenHomeStore, setHomeRetryToken, sheinInlineOpen, setSheinInlineOpen,
      awnakInlineOpen, setAwnakInlineOpen, clientDiscoveryStoresBridge,
    },
    store: {
      storeDetailState, activeStoreScreenStore, activeStoreItems, activeStoreId, activeStore, itemsQuery,
      setItemsQuery, itemsCategory, setItemsCategory, storeItemsEntryOrigin, setSelectedItemId,
      addItemToHostCart, handleOpenActiveStoreItems, handleOpenActiveStoreCart, fetchStoreDetail,
    },
    checkout: {
      cartItems, selectedFulfillmentMode, selectedPaymentMethod, setSelectedPaymentMethod, paymentErrorMessage,
      checkoutState, setCheckoutState, createOrderValues, setCreateOrderValues, handleConfirmCheckout,
      handleConfirmedOrderExecution, checkoutClientMemo, checkoutAuth,
    },
    orders: {
      filteredOrders, ordersQuery, setOrdersQuery, handleReorderClick, trackingClientState, activeTrackedOrder,
      trackingWltIntent, liveOrderDetails, trackingOrderValues, trackingTimeline, reopenTracking,
      handleCancelOrder, handleSupportEscalation, returnOrdersList,
    },
    marketing: {
      liveMarketingPrograms, recordMarketingBannerClick, recordMarketingBannerImpression,
      recordMarketingGrowthClick, recordMarketingGrowthImpression,
    },
    bell: {
      handleServiceLauncherPress,
    },
    homeActions: {
      handleClientBottomNavSelect,
    },
  };
}
