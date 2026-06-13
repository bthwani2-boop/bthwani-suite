import React from 'react';
import { Platform, View } from 'react-native';
import { usePlatformVars, FeatureFlagProvider, PlatformVarsProvider, useFeatureFlag, listNotifications, resolveDshAuthBaseUrl } from '../shared';
import type { DshSignalSummary, DshSignalEventKind, DshSignalEntityType } from '../shared';
import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import type { DshClientSurfaceProps, DshRoute } from './dsh-client.types';
import { useDshNavigation, useDshOrderTracking, useDshClientHomeCategories } from './hooks';

// Custom Hooks
import { useDshClientRuntimeStores } from './hooks/useDshClientRuntimeStores';
import { useDshClientCartState } from './hooks/useDshClientCartState';
import { useDshClientStoreState } from './hooks/useDshClientStoreState';
import { useDshClientOrderExecution } from './hooks/useDshClientOrderExecution';
import { useDshClientMarketingState } from './hooks/useDshClientMarketingState';

// Adapters
import { mapStoreDetailToScreenStore } from './adapters/dshClientStoreAdapters';

// Components
import { DshClientBottomNav } from './DshClientBottomNav';
import { DshClientRouteRenderer } from './DshClientRouteRenderer';

import { commandTargetToRoute, initialOrders, hostClientStates, resolveStorePickupAddress } from './dsh-client.navigation-bridge';
import type { ClientOperationScreenId } from './screens/parts/OperationScreenView';
import type { DshFulfillmentDeliveryMode } from './contracts/dsh-client-binding.contracts';
import { useWltDshWalletPreview } from '../../../wlt/frontend/dsh/app-client';

const defaultTrackingOrderId = initialOrders[0]?.id ?? 'dsh-10021';

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
  const { dshAuthBearerToken, dshClientId } = usePlatformVars();
  const isAwnakEnabled = useFeatureFlag('DSH:capability:awnak');
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = useAppClientAppearance();

  // 1. Runtime stores bridge
  const {
    runtimeBridge,
    setRuntimeBridge,
    homeRetryToken,
    setHomeRetryToken,
    clientDiscoveryStoresBridge,
    clientVisibleDiscoveryStores,
    clientVisibleHomeStores,
  } = useDshClientRuntimeStores();

  // 1b. Runtime home categories fetch and consolidated state
  const {
    state: homeScreenState,
    categories: homeCategories,
  } = useDshClientHomeCategories(clientVisibleHomeStores, clientDiscoveryStoresBridge.state, homeRetryToken);

  // 2. Navigation
  const {
    route, setRoute,
    sheinInlineOpen, setSheinInlineOpen,
    awnakInlineOpen, setAwnakInlineOpen,
    homeSearchAutoOpenToken, openHomeInlineSearch,
    handleRegisterBackHandler,
  } = useDshNavigation({ command, onExit });

  // 3. Store, items, details
  const {
    activeStoreId,
    setActiveStoreId,
    activeStoreDetail,
    setActiveStoreDetail,
    storeDetailState,
    setStoreDetailState,
    activeStoreItemsState,
    setActiveStoreItemsState,
    activeCanonicalStoreId,
    setActiveCanonicalStoreId,
    activeCanonicalProductId,
    setActiveCanonicalProductId,
    selectedItemId,
    setSelectedItemId,
    favoriteOverrides,
    setFavoriteOverrides,
    itemsQuery,
    setItemsQuery,
    itemsCategory,
    setItemsCategory,
    activeStore,
    fetchStoreDetail,
  } = useDshClientStoreState({
    route,
    clientVisibleDiscoveryStores,
  });

  // 4. Cart and fulfillment
  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const {
    selectedFulfillmentMode,
    setSelectedFulfillmentMode,
    cartItems,
    setCartItems,
    createOrderValues,
    setCreateOrderValues,
    reorderAlertMessage,
    setReorderAlertMessage,
    storeItemsEntryOrigin,
    setStoreItemsEntryOrigin,
    addItemToHostCart,
    handleReorderClick,
    openCreateOrderJourney,
  } = useDshClientCartState({
    activeStore,
    activeCanonicalStoreId,
    setActiveCanonicalStoreId,
    activeCanonicalProductId,
    setActiveCanonicalProductId,
    setActiveStoreId,
    setRoute,
    clientVisibleDiscoveryStores,
    defaultFulfillmentMode,
  });

  // 5. Order tracking
  const {
    selectedOrderId, setSelectedOrderId,
    ordersListState, setOrdersListState,
    liveOrderDetails,
    trackingClientState, setTrackingClientState,
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
      const clientId = (devClientId ?? dshClientId ?? 'client-101').trim();
      return { clientId };
    }, [authToken, dshAuthBearerToken, devClientId, dshClientId]),
    createOrderValues,
    selectedFulfillmentMode,
    defaultFulfillmentMode,
    setRoute,
    setSelectedFulfillmentMode,
    setCreateOrderValues,
  });

  // 6. Order execution & checkout integration
  const checkoutAuth = React.useMemo(() => {
    const bearerToken = (authToken ?? dshAuthBearerToken ?? undefined)?.trim();
    if (bearerToken) return { bearerToken };
    const clientId = (devClientId ?? dshClientId ?? 'client-101').trim();
    return { clientId };
  }, [authToken, dshAuthBearerToken, devClientId, dshClientId]);

  const walletPreview = useWltDshWalletPreview(checkoutAuth.clientId, checkoutAuth.bearerToken);

  const {
    handleConfirmedOrderExecution,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    checkoutState,
    setCheckoutState,
    paymentErrorMessage,
    checkoutIntentId,
    setCheckoutIntentId,
    checkoutClientMemo,
    handleConfirmCheckout,
  } = useDshClientOrderExecution({
    cartItems,
    setCartItems,
    activeStore,
    selectedFulfillmentMode,
    setSelectedFulfillmentMode,
    checkoutAuth,
    walletPreview,
    createOrderValues,
    setCreateOrderValues,
    setRoute,
    openTrackedOrder,
    setOrdersListState,
    setSelectedOrderId,
    setTrackingClientState,
    setTrackingOrderOverride,
  });

  // 7. Store, product, and category visibility mappers / filters
  const hasStoreTarget = React.useCallback((storeId?: string): boolean => {
    return typeof storeId === 'string' && clientVisibleDiscoveryStores.some((store) => store.id === storeId);
  }, [clientVisibleDiscoveryStores]);

  const hasStoreCategoryTarget = React.useCallback((storeId?: string, categoryId?: string): boolean => {
    if (!hasStoreTarget(storeId) || typeof categoryId !== 'string') return false;
    return activeStoreItemsState.some((item) => item.categoryId === categoryId);
  }, [hasStoreTarget, activeStoreItemsState]);

  const hasProductTarget = React.useCallback((storeId?: string, productId?: string): boolean => {
    if (!hasStoreTarget(storeId) || typeof productId !== 'string') return false;
    return activeStoreItemsState.some((item) => item.id === productId);
  }, [hasStoreTarget, activeStoreItemsState]);

  // 8. Marketing and banners
  const {
    isMarketingGrowthRouteValid,
    liveMarketingPrograms,
    liveMarketingShorts,
    homeMarketingPromos,
    homePromos,
  } = useDshClientMarketingState({
    hasStoreTarget,
    hasStoreCategoryTarget,
    hasProductTarget,
  });

  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('entitlements-get');
  const [serviceDialTrigger, setServiceDialTrigger] = React.useState(0);

  // J-013: Bell notifications — fetch from GET /notifications when bell route is active
  const [bellSignalEvents, setBellSignalEvents] = React.useState<readonly DshSignalSummary[]>([]);
  React.useEffect(() => {
    if (route !== 'bell') return undefined;
    const authBaseUrl = resolveDshAuthBaseUrl();
    const dshBase = checkoutAuth.bearerToken
      ? (typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? process.env?.NEXT_PUBLIC_DSH_API_BASE_URL ?? null : null)
      : null;
    const baseUrl = dshBase?.trim() || authBaseUrl?.replace(':18082', ':8080') || null;
    if (!baseUrl) return undefined;
    let cancelled = false;
    listNotifications(
      { baseUrl, bearerToken: checkoutAuth.bearerToken, devClientId: checkoutAuth.clientId },
      { limit: 30, unread_only: false },
    ).then((resp) => {
      if (cancelled) return;
      const summaries: DshSignalSummary[] = resp.notifications.map((n) => ({
        eventId: n.id,
        kind: n.kind as DshSignalEventKind,
        priority: n.priority,
        title: n.title,
        entityId: n.entity_id ?? '',
        entityType: (n.entity_type ?? 'order') as DshSignalEntityType,
        readState: n.is_read ? 'read' : 'unread',
        routeId: n.action_route ?? 'orders-list',
        emittedAt: n.created_at,
      }));
      setBellSignalEvents(summaries);
    }).catch(() => { /* non-fatal — bell shows empty state */ });
    return () => { cancelled = true; };
  }, [route, checkoutAuth]);

  // Command routing reset to tracking default
  React.useEffect(() => {
    if (commandTargetToRoute(command.target) === 'tracking') {
      setSelectedOrderId(defaultTrackingOrderId);
      setTrackingClientState(hostClientStates.trackingActive);
    }
  }, [command, setSelectedOrderId, setTrackingClientState]);

  // Computed data for routing & screens
  const activeStoreItems = React.useMemo(() => activeStoreItemsState, [activeStoreItemsState]);

  const activeStoreCategories = React.useMemo(() => buildStoreCategories(activeStoreItems), [activeStoreItems]);
  const activeStoreDeliveryModes = React.useMemo(() => buildStoreDeliveryModes(activeStore), [activeStore]);
  const activeStoreTags = React.useMemo(() => buildStoreTags(activeStore), [activeStore]);

  const activeStoreScreenStore = React.useMemo(() => {
    return mapStoreDetailToScreenStore(
      activeStoreDetail,
      activeStore,
      activeStoreTags,
      activeStoreDeliveryModes,
      activeStoreCategories,
    );
  }, [activeStoreDetail, activeStore, activeStoreTags, activeStoreDeliveryModes, activeStoreCategories]);

  const homeRecentOrders = React.useMemo(() => [
    { id: 'home-recent-order-1', storeId: clientVisibleHomeStores[0]?.id ?? 'store-1001', title: 'الطلب النشط', subtitle: clientVisibleHomeStores[0]?.name ?? 'مطعم القلعة', meta: `${clientVisibleHomeStores[0]?.distanceLabel ?? '2.1 كم'} · ${clientVisibleHomeStores[0]?.deliveryLabel ?? 'توصيل مجاني'}`, statusLabel: clientVisibleHomeStores[0]?.statusTone === 'open' ? 'مباشر' : 'مغلق' },
    { id: 'home-recent-order-2', storeId: clientVisibleHomeStores[1]?.id ?? 'store-1002', title: 'آخر طلب', subtitle: clientVisibleHomeStores[1]?.name ?? 'مطاعم الأرض الخضراء', meta: `${clientVisibleHomeStores[1]?.distanceLabel ?? '1.8 كم'} · ${clientVisibleHomeStores[1]?.serviceLabel ?? 'توصيل برو'}`, statusLabel: clientVisibleHomeStores[1]?.statusTone === 'open' ? 'مباشر' : 'مغلق' }
  ], [clientVisibleHomeStores]);

  const handleOpenActiveStoreItems = React.useCallback(() => {
    setStoreItemsEntryOrigin('store-get');
    setRoute('store-items');
  }, [setStoreItemsEntryOrigin, setRoute]);

  const handleOpenActiveStoreCart = React.useCallback((mode?: DshFulfillmentDeliveryMode) => {
    const nextFulfillmentMode = mode ?? selectedFulfillmentMode;
    setSelectedFulfillmentMode(nextFulfillmentMode);
    setCreateOrderValues((currentValues) => ({
      ...currentValues,
      fulfillmentMode: nextFulfillmentMode,
      pickupAddress: resolveStorePickupAddress(activeStore),
      dropoffAddress: nextFulfillmentMode === 'pickup' ? '' : currentValues.dropoffAddress,
    }));
    setRoute('cart-get');
  }, [activeStore, selectedFulfillmentMode, setSelectedFulfillmentMode, setCreateOrderValues, setRoute]);

  const handleToggleHomeFavorite = React.useCallback((storeId: string) => {
    const currentStore = clientVisibleHomeStores.find((s) => s.id === storeId) || clientVisibleDiscoveryStores.find((s) => s.id === storeId);
    const currentVal = favoriteOverrides[storeId] ?? currentStore?.isFavorite ?? false;
    setFavoriteOverrides((previous) => ({
      ...previous,
      [storeId]: !currentVal,
    }));
  }, [clientVisibleDiscoveryStores, clientVisibleHomeStores, favoriteOverrides, setFavoriteOverrides]);

  const handleOpenHomeCategory = React.useCallback((categoryId: string) => {
    if (categoryId === 'shein') {
      setSheinInlineOpen(true);
      setRoute('home');
      return;
    }
    if (categoryId === 'awnak') {
      if (!isAwnakEnabled) return;
      setAwnakInlineOpen(true);
      setRoute('home');
      return;
    }
    setRoute('home');
  }, [isAwnakEnabled, setSheinInlineOpen, setAwnakInlineOpen, setRoute]);

  const handleOpenHomeStoreCategory = React.useCallback((storeId: string, categoryId: string) => {
    const store = clientVisibleDiscoveryStores.find((entry) => entry.id === storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(store?.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setItemsCategory(categoryId);
    setStoreItemsEntryOrigin('home');
    setRoute('store-items');
  }, [clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setActiveCanonicalProductId, setItemsCategory, setStoreItemsEntryOrigin, setRoute]);

  const handleOpenHomeProduct = React.useCallback((storeId: string, itemId: string) => {
    const store = clientVisibleDiscoveryStores.find((entry) => entry.id === storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(store?.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setSelectedItemId(itemId);
    setRoute('cart-get');
  }, [clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setActiveCanonicalProductId, setSelectedItemId, setRoute]);

  const handleOpenHomeBenefits = React.useCallback((screenId?: string) => {
    setSelectedOperationScreen(screenId as ClientOperationScreenId);
    setRoute('benefits');
  }, [setSelectedOperationScreen, setRoute]);

  const handleOpenHomeStore = React.useCallback((storeId: string) => {
    if (!hasStoreTarget(storeId)) return;
    const store = clientVisibleDiscoveryStores.find((entry) => entry.id === storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(store?.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setItemsQuery('');
    setItemsCategory('all');
    setSelectedItemId('');
    setRoute('store-get');
  }, [hasStoreTarget, clientVisibleDiscoveryStores, setActiveStoreId, setActiveCanonicalStoreId, setActiveCanonicalProductId, setItemsQuery, setItemsCategory, setSelectedItemId, setRoute]);

  const handleClientBottomNavSelect = React.useCallback((id: string) => {
    if (id === 'favorites') setRoute('home');
    if (id === 'orders') setRoute('orders-list');
    if (id === 'wallet') setRoute('wlt-home');
    if (id === 'profile') setRoute('my-space');
  }, [setRoute]);

  const handleServiceLauncherPress = React.useCallback(() => {
    setServiceDialTrigger((token) => token + 1);
  }, []);

  const openSupportFlow = React.useCallback(() => {
    setSelectedOperationScreen('chat-send');
    setRoute('conversation-workspace');
  }, [setSelectedOperationScreen, setRoute]);

  const returnHome = React.useCallback(() => {
    setRoute('home');
  }, [setRoute]);

  // Analytics stubs — wire to real analytics service when ready
  const recordMarketingBannerClick = React.useCallback((_item: unknown) => {}, []);
  const recordMarketingBannerImpression = React.useCallback((_item: unknown) => {}, []);
  const recordMarketingGrowthClick = React.useCallback((_item: unknown) => {}, []);
  const recordMarketingGrowthImpression = React.useCallback((_item: unknown) => {}, []);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
        <DshClientRouteRenderer
          categories={homeCategories}
          homeScreenState={homeScreenState}
          route={route}
          setRoute={setRoute}
          dshAuthBearerToken={dshAuthBearerToken}
          dshClientId={dshClientId}
          cartItems={cartItems}
          selectedFulfillmentMode={selectedFulfillmentMode}
          walletPreview={walletPreview}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          paymentErrorMessage={paymentErrorMessage}
          checkoutState={checkoutState}
          setCheckoutState={setCheckoutState}
          createOrderValues={createOrderValues}
          setCreateOrderValues={setCreateOrderValues}
          handleConfirmCheckout={handleConfirmCheckout}
          handleConfirmedOrderExecution={handleConfirmedOrderExecution}
          appearanceHydrated={appearanceHydrated}
          appearanceMode={appearanceMode}
          setAppearanceMode={setAppearanceMode}
          liveMarketingPrograms={liveMarketingPrograms}
          setSelectedOperationScreen={setSelectedOperationScreen}
          openTrackedOrder={openTrackedOrder}
          openCreateOrderJourney={openCreateOrderJourney}
          returnHome={returnHome}
          storeDetailState={storeDetailState}
          activeStoreScreenStore={activeStoreScreenStore}
          activeStoreItems={activeStoreItems}
          addItemToHostCart={addItemToHostCart}
          handleOpenActiveStoreItems={handleOpenActiveStoreItems}
          handleOpenActiveStoreCart={handleOpenActiveStoreCart}
          fetchStoreDetail={fetchStoreDetail}
          activeStoreId={activeStoreId}
          activeStore={activeStore}
          itemsQuery={itemsQuery}
          setItemsQuery={setItemsQuery}
          itemsCategory={itemsCategory}
          setItemsCategory={setItemsCategory}
          storeItemsEntryOrigin={storeItemsEntryOrigin}
          setSelectedItemId={setSelectedItemId}
          checkoutClientMemo={checkoutClientMemo}
          checkoutAuth={checkoutAuth}
          onOpenService={onOpenService}
          selectedOperationScreen={selectedOperationScreen}
          returnOrdersList={returnOrdersList}
          filteredOrders={filteredOrders}
          ordersQuery={ordersQuery}
          setOrdersQuery={setOrdersQuery}
          handleReorderClick={handleReorderClick}
          trackingClientState={trackingClientState}
          activeTrackedOrder={activeTrackedOrder}
          trackingWltIntent={trackingWltIntent}
          liveOrderDetails={liveOrderDetails}
          trackingOrderValues={trackingOrderValues}
          trackingTimeline={trackingTimeline}
          reopenTracking={reopenTracking}
          handleCancelOrder={handleCancelOrder}
          handleSupportEscalation={handleSupportEscalation}
          clientDiscoveryStoresBridge={clientDiscoveryStoresBridge}
          serviceDialTrigger={serviceDialTrigger}
          favoriteOverrides={favoriteOverrides}
          handleToggleFavorite={handleToggleHomeFavorite}
          homeMarketingPromos={homeMarketingPromos}
          homePromos={homePromos}
          liveMarketingShorts={liveMarketingShorts}
          clientVisibleHomeStores={clientVisibleHomeStores}
          homeRecentOrders={homeRecentOrders}
          onExit={onExit}
          handleOpenHomeCategory={handleOpenHomeCategory}
          handleOpenHomeStoreCategory={handleOpenHomeStoreCategory}
          handleOpenHomeProduct={handleOpenHomeProduct}
          handleOpenHomeBenefits={handleOpenHomeBenefits}
          openHomeInlineSearch={openHomeInlineSearch}
          recordMarketingBannerClick={recordMarketingBannerClick}
          recordMarketingBannerImpression={recordMarketingBannerImpression}
          recordMarketingGrowthClick={recordMarketingGrowthClick}
          recordMarketingGrowthImpression={recordMarketingGrowthImpression}
          sheinInlineOpen={sheinInlineOpen}
          setSheinInlineOpen={setSheinInlineOpen}
          awnakInlineOpen={awnakInlineOpen}
          setAwnakInlineOpen={setAwnakInlineOpen}
          handleOpenHomeStore={handleOpenHomeStore}
          homeSearchAutoOpenToken={homeSearchAutoOpenToken}
          handleRegisterBackHandler={handleRegisterBackHandler}
          renderApprovedVideoReelsViewer={renderApprovedVideoReelsViewer}
          setHomeRetryToken={setHomeRetryToken}
          openSupportFlow={openSupportFlow}
          bellSignalEvents={bellSignalEvents}
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

// Imports required for helper derivations
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
} from '../shared/dsh-store-builders';
