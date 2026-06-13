import React from 'react';
import { Platform, View } from 'react-native';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
} from '../shared';
import {
  usePlatformVars,
  FeatureFlagProvider,
  PlatformVarsProvider,
  useFeatureFlag,
} from '../platform';
import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import type { DshClientSurfaceProps } from './dsh-client.types';
import { useDshNavigation, useDshOrderTracking, useDshClientHomeCategories } from './hooks';
import { useDshClientRuntimeStores } from './hooks/useDshClientRuntimeStores';
import { useDshClientCartState } from './hooks/useDshClientCartState';
import { useDshClientStoreState } from './hooks/useDshClientStoreState';
import { useDshClientOrderExecution } from './hooks/useDshClientOrderExecution';
import { useDshClientMarketingState } from './hooks/useDshClientMarketingState';
import { useDshClientBellState } from './hooks/useDshClientBellState';
import { useDshClientHomeActions } from './hooks/useDshClientHomeActions';
import { mapStoreDetailToScreenStore } from './adapters/dshClientStoreAdapters';
import { DshClientBottomNav } from './DshClientBottomNav';
import { DshClientRouteRenderer } from './DshClientRouteRenderer';
import { commandTargetToRoute, initialOrders, hostClientStates } from './dsh-client.navigation-bridge';
import type { DshFulfillmentDeliveryMode } from './contracts/dsh-client-binding.contracts';
import { useWltDshWalletSession } from '../../../wlt/frontend/dsh/app-client';

const defaultTrackingOrderId = initialOrders[0]?.id;

export function DshClientSurface(props: DshClientSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshClientSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshClientSurfaceInner({ command, onExit, onOpenService, authToken, devClientId, renderApprovedVideoReelsViewer }: DshClientSurfaceProps) {
  const { dshApiBaseUrl, dshAuthBearerToken, dshClientId } = usePlatformVars();
  const isAwnakEnabled = useFeatureFlag('DSH:capability:awnak');
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = useAppClientAppearance();

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
  } = useDshNavigation({ command, onExit });

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
    checkoutAuth: React.useMemo(() => {
      const bearerToken = (authToken ?? dshAuthBearerToken ?? undefined)?.trim();
      if (bearerToken) return { bearerToken };
      const clientId = (devClientId ?? dshClientId ?? '').trim();
      return clientId ? { clientId } : {};
    }, [authToken, dshAuthBearerToken, devClientId, dshClientId]),
    createOrderValues, selectedFulfillmentMode, defaultFulfillmentMode,
    setRoute, setSelectedFulfillmentMode, setCreateOrderValues,
  });

  const checkoutAuth = React.useMemo(() => {
    const bearerToken = (authToken ?? dshAuthBearerToken ?? undefined)?.trim();
    if (bearerToken) return { bearerToken };
    const clientId = (devClientId ?? dshClientId ?? '').trim();
    return clientId ? { clientId } : {};
  }, [authToken, dshAuthBearerToken, devClientId, dshClientId]);

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

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
        <DshClientRouteRenderer
          session={{ dshAuthBearerToken, dshClientId, appearanceHydrated, appearanceMode, setAppearanceMode, bellSignalEvents, walletSession }}
          routeContext={{
            route, setRoute, returnHome: () => setRoute('home'), openCreateOrderJourney, openTrackedOrder,
            setSelectedOperationScreen, selectedOperationScreen, onExit, openSupportFlow,
            handleRegisterBackHandler, serviceDialTrigger, onOpenService,
          }}
          home={{
            categories: homeCategories, homeScreenState, homeMarketingPromos, homePromos, liveMarketingShorts,
            clientVisibleHomeStores, homeRecentOrders, homeSearchAutoOpenToken, favoriteOverrides,
            handleToggleFavorite: handleToggleHomeFavorite,
            handleOpenHomeCategory, handleOpenHomeStoreCategory, handleOpenHomeProduct, handleOpenHomeBenefits,
            openHomeInlineSearch, handleOpenHomeStore, setHomeRetryToken, sheinInlineOpen, setSheinInlineOpen,
            awnakInlineOpen, setAwnakInlineOpen, renderApprovedVideoReelsViewer, clientDiscoveryStoresBridge,
          }}
          store={{
            storeDetailState, activeStoreScreenStore, activeStoreItems, activeStoreId, activeStore, itemsQuery,
            setItemsQuery, itemsCategory, setItemsCategory, storeItemsEntryOrigin, setSelectedItemId,
            addItemToHostCart, handleOpenActiveStoreItems, handleOpenActiveStoreCart, fetchStoreDetail,
          }}
          checkout={{
            cartItems, selectedFulfillmentMode, selectedPaymentMethod, setSelectedPaymentMethod, paymentErrorMessage,
            checkoutState, setCheckoutState, createOrderValues, setCreateOrderValues, handleConfirmCheckout,
            handleConfirmedOrderExecution, checkoutClientMemo, checkoutAuth,
          }}
          orders={{
            filteredOrders, ordersQuery, setOrdersQuery, handleReorderClick, trackingClientState, activeTrackedOrder,
            trackingWltIntent, liveOrderDetails, trackingOrderValues, trackingTimeline, reopenTracking,
            handleCancelOrder, handleSupportEscalation, returnOrdersList,
          }}
          marketing={{
            liveMarketingPrograms, recordMarketingBannerClick, recordMarketingBannerImpression,
            recordMarketingGrowthClick, recordMarketingGrowthImpression,
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <DshClientBottomNav
          route={route}
          handleServiceLauncherPress={handleServiceLauncherPress}
          handleClientBottomNavSelect={handleClientBottomNavSelect}
        />
      </View>
    </View>
  );
}
