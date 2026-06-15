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
import { useDshClientMarketingModel } from '../marketing/client-marketing.model';
import { useCheckoutAuth } from '../checkout/useCheckoutAuth';
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

  // ── Home + discovery stores ───────────────────────────────────────────────────
  const homeComposition = useDshClientHomeComposition();
  const {
    clientDiscoveryStoresBridge,
    clientVisibleDiscoveryStores,
    clientVisibleHomeStores,
    homeRetryToken,
    setHomeRetryToken,
    homeScreenState,
    homeCategories,
    homeRecentOrders,
  } = homeComposition;

  // ── Navigation ────────────────────────────────────────────────────────────────
  const {
    route, setRoute,
    sheinInlineOpen, setSheinInlineOpen,
    awnakInlineOpen, setAwnakInlineOpen,
    homeSearchAutoOpenToken, openHomeInlineSearch,
    handleRegisterBackHandler,
  } = useDshClientNavigation({ command, onExit });

  // ── Store topic model ─────────────────────────────────────────────────────────
  const storeModel = useDshClientStoreModel({ route, clientVisibleDiscoveryStores });

  // ── Cart ──────────────────────────────────────────────────────────────────────
  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const {
    selectedFulfillmentMode, setSelectedFulfillmentMode,
    cartItems, setCartItems,
    createOrderValues, setCreateOrderValues,
    reorderAlertMessage, setReorderAlertMessage,
    storeItemsEntryOrigin, setStoreItemsEntryOrigin,
    addItemToHostCart, handleReorderClick, openCreateOrderJourney,
  } = useDshClientCartState({
    activeStore: storeModel.activeStore,
    activeCanonicalStoreId: storeModel.activeCanonicalStoreId,
    setActiveCanonicalStoreId: storeModel.setActiveCanonicalStoreId,
    activeCanonicalProductId: storeModel.activeCanonicalProductId,
    setActiveCanonicalProductId: storeModel.setActiveCanonicalProductId,
    setActiveStoreId: storeModel.setActiveStoreId,
    setRoute,
    clientVisibleDiscoveryStores,
    defaultFulfillmentMode,
  });

  // ── Auth + WLT wallet ─────────────────────────────────────────────────────────
  const checkoutAuth = useCheckoutAuth({ authToken, dshAuthBearerToken, devClientId, dshClientId });
  const walletSession = useWltDshWalletSession(checkoutAuth.clientId, checkoutAuth.bearerToken);

  // ── Orders tracking ───────────────────────────────────────────────────────────
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

  // ── Checkout execution ────────────────────────────────────────────────────────
  const {
    handleConfirmedOrderExecution, selectedPaymentMethod, setSelectedPaymentMethod,
    checkoutState, setCheckoutState, paymentErrorMessage, checkoutIntentId,
    setCheckoutIntentId, checkoutClientMemo, handleConfirmCheckout,
  } = useDshClientOrderExecution({
    cartItems, setCartItems, activeStore: storeModel.activeStore,
    selectedFulfillmentMode, setSelectedFulfillmentMode,
    checkoutAuth, walletSession, createOrderValues, setCreateOrderValues, setRoute,
    openTrackedOrder, setOrdersListState, setSelectedOrderId, setTrackingClientState, setTrackingOrderOverride,
  });

  // ── Cross-topic predicates (used by marketing model) ─────────────────────────
  const hasStoreTarget = React.useCallback(
    (storeId?: string): boolean =>
      typeof storeId === 'string' && clientVisibleDiscoveryStores.some((s) => s.id === storeId),
    [clientVisibleDiscoveryStores],
  );
  const hasStoreCategoryTarget = React.useCallback(
    (storeId?: string, categoryId?: string): boolean => {
      if (!hasStoreTarget(storeId) || typeof categoryId !== 'string') return false;
      return storeModel.activeStoreItems.some((item) => item.categoryId === categoryId);
    },
    [hasStoreTarget, storeModel.activeStoreItems],
  );
  const hasProductTarget = React.useCallback(
    (storeId?: string, productId?: string): boolean => {
      if (!hasStoreTarget(storeId) || typeof productId !== 'string') return false;
      return storeModel.activeStoreItems.some((item) => item.id === productId);
    },
    [hasStoreTarget, storeModel.activeStoreItems],
  );

  // ── Marketing topic model ─────────────────────────────────────────────────────
  const { isMarketingGrowthRouteValid, liveMarketingPrograms, liveMarketingShorts, homeMarketingPromos, homePromos } =
    useDshClientMarketingModel({ hasStoreTarget, hasStoreCategoryTarget, hasProductTarget });

  // ── Notifications topic model ─────────────────────────────────────────────────
  const {
    bellSignalEvents, selectedOperationScreen, setSelectedOperationScreen,
    serviceDialTrigger, handleServiceLauncherPress, handleOpenHomeBenefits, openSupportFlow,
  } = useDshClientNotificationsModel({ route, dshApiBaseUrl, checkoutAuth, setRoute });

  // ── Home actions (cross-topic) ────────────────────────────────────────────────
  const {
    handleOpenActiveStoreItems, handleOpenActiveStoreCart, handleToggleHomeFavorite,
    handleOpenHomeCategory, handleOpenHomeStoreCategory, handleOpenHomeProduct,
    handleOpenHomeStore, handleClientBottomNavSelect,
    recordMarketingBannerClick, recordMarketingBannerImpression,
    recordMarketingGrowthClick, recordMarketingGrowthImpression,
  } = useDshClientHomeActions({
    setRoute, clientVisibleDiscoveryStores, clientVisibleHomeStores, isAwnakEnabled,
    setSheinInlineOpen, setAwnakInlineOpen, activeStore: storeModel.activeStore, selectedFulfillmentMode,
    setSelectedFulfillmentMode, setCreateOrderValues, setActiveStoreId: storeModel.setActiveStoreId,
    setActiveCanonicalStoreId: storeModel.setActiveCanonicalStoreId,
    setActiveCanonicalProductId: storeModel.setActiveCanonicalProductId,
    setItemsQuery: storeModel.setItemsQuery, setItemsCategory: storeModel.setItemsCategory,
    setSelectedItemId: storeModel.setSelectedItemId,
    setStoreItemsEntryOrigin, favoriteOverrides: storeModel.favoriteOverrides,
    setFavoriteOverrides: storeModel.setFavoriteOverrides, hasStoreTarget,
  });

  // ── Command target effect ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (commandTargetToRoute(command.target) === 'tracking') {
      if (defaultTrackingOrderId) {
        setSelectedOrderId(defaultTrackingOrderId);
        setTrackingClientState(hostClientStates.trackingActive);
      }
    }
  }, [command, setSelectedOrderId, setTrackingClientState]);

  // Suppress unused variable lint warnings for internal-only refs
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

  return {
    session: { dshAuthBearerToken, dshClientId, appearanceHydrated, appearanceMode, setAppearanceMode, bellSignalEvents, walletSession },
    routeContext: {
      route, setRoute, returnHome: () => setRoute('home'), openCreateOrderJourney, openTrackedOrder,
      setSelectedOperationScreen, selectedOperationScreen, onExit, openSupportFlow,
      handleRegisterBackHandler, serviceDialTrigger, onOpenService,
    },
    home: {
      categories: homeCategories, homeScreenState, homeMarketingPromos, homePromos, liveMarketingShorts,
      clientVisibleHomeStores, homeRecentOrders, homeSearchAutoOpenToken, favoriteOverrides: storeModel.favoriteOverrides,
      handleToggleFavorite: handleToggleHomeFavorite,
      handleOpenHomeCategory, handleOpenHomeStoreCategory, handleOpenHomeProduct, handleOpenHomeBenefits,
      openHomeInlineSearch, handleOpenHomeStore, setHomeRetryToken, sheinInlineOpen, setSheinInlineOpen,
      awnakInlineOpen, setAwnakInlineOpen, clientDiscoveryStoresBridge,
    },
    store: {
      storeDetailState: storeModel.storeDetailState,
      activeStoreScreenStore: storeModel.activeStoreScreenStore,
      activeStoreItems: storeModel.activeStoreItems,
      activeStoreId: storeModel.activeStoreId,
      activeStore: storeModel.activeStore,
      itemsQuery: storeModel.itemsQuery,
      setItemsQuery: storeModel.setItemsQuery,
      itemsCategory: storeModel.itemsCategory,
      setItemsCategory: storeModel.setItemsCategory,
      storeItemsEntryOrigin,
      setSelectedItemId: storeModel.setSelectedItemId,
      addItemToHostCart,
      handleOpenActiveStoreItems,
      handleOpenActiveStoreCart,
      fetchStoreDetail: storeModel.fetchStoreDetail,
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
