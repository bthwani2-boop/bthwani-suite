import React from 'react';
import { View, Platform } from 'react-native';
import { Text, colorPalette, spacing } from '@bthwani/ui-kit';

import { DshEntryScreen } from './screens/EntryScreen';
import { DshClientBellScreen } from './screens/BellScreen';
import { DshHomeGetScreen } from './screens/HomeScreen';
import { DshMySpaceScreen } from './screens/MySpaceScreen';
import { DshNotificationsScreen } from './screens/NotificationsScreen';
import { DshBenefitsHubScreen } from './screens/BenefitsScreen';
import { DshOrdersListScreen } from './screens/DshOrdersListScreen';
import { DshTrackingScreen } from './screens/DshTrackingScreen';
import { DshStoreGetScreen } from './screens/StoreScreen';
import { DshStoreItemsScreen } from './screens/StoreItemsScreen';
import { DshCartGetScreen } from './screens/CartScreen';
import { DshCheckoutIntentScreen } from './screens/DshCheckoutIntentScreen';
import { DshCheckoutFailureScreen, type DshCheckoutFailureReason } from './screens/DshCheckoutFailureScreen';
import { DshConversationHubScreen } from './screens/DshConversationHubScreen';
import { DshOrderIssueHubScreen } from './screens/DshOrderIssueHubScreen';
import { DshProxyHubScreen } from './screens/DshProxyHubScreen';
import { DshServiceSettingsHubScreen } from './screens/DshServiceSettingsHubScreen';
import { DshZoneSetScreen } from './screens/DshZoneSetScreen';
import { DshListingStatusUpdateScreen } from './screens/DshListingStatusUpdateScreen';
import { DshAddressLocationScreen } from './screens/AddressLocationScreen';
import { DshIdentityHubScreen } from './screens/DshIdentityHubScreen';
import { DshPreferencesHubScreen } from './screens/DshPreferencesHubScreen';
import { DshAppearanceHubScreen } from './screens/DshAppearanceHubScreen';
import { WltHomeGetScreen } from '../../../wlt/frontend/app-client-wlt';
import { hostClientStates } from './dsh-client.navigation-bridge';
import { buildDshClientCheckoutPresenterModel } from '../shared/checkout';
import { mapLiveOrderStatusToClientState } from '../shared/orders';
import { getDshClientStateMeta } from '../shared/orders/orders.client-state';
import type { DshClientRouteRendererProps } from './contracts/dsh-client-renderer.contracts';

export function DshClientRouteRenderer({
  session,
  routeContext,
  home,
  store,
  checkout,
  orders,
  marketing,
}: DshClientRouteRendererProps) {
  const {
    dshAuthBearerToken,
    dshClientId,
    appearanceHydrated,
    appearanceMode,
    setAppearanceMode,
    bellSignalEvents,
    walletSession,
  } = session;
  const {
    route,
    setRoute,
    returnHome,
    openCreateOrderJourney,
    openTrackedOrder,
    setSelectedOperationScreen,
    selectedOperationScreen,
    onExit,
    openSupportFlow,
    handleRegisterBackHandler,
    serviceDialTrigger,
    onOpenService,
  } = routeContext;
  const {
    categories,
    homeScreenState,
    homeMarketingPromos,
    homePromos,
    liveMarketingShorts,
    clientVisibleHomeStores,
    homeRecentOrders,
    homeSearchAutoOpenToken,
    favoriteOverrides,
    handleToggleFavorite,
    handleOpenHomeCategory,
    handleOpenHomeStoreCategory,
    handleOpenHomeProduct,
    handleOpenHomeBenefits,
    openHomeInlineSearch,
    handleOpenHomeStore,
    setHomeRetryToken,
    sheinInlineOpen,
    setSheinInlineOpen,
    awnakInlineOpen,
    setAwnakInlineOpen,
    renderApprovedVideoReelsViewer,
    clientDiscoveryStoresBridge,
  } = home;
  const {
    storeDetailState,
    activeStoreScreenStore,
    activeStoreItems,
    activeStoreId,
    activeStore,
    itemsQuery,
    setItemsQuery,
    itemsCategory,
    setItemsCategory,
    storeItemsEntryOrigin,
    setSelectedItemId,
    addItemToHostCart,
    handleOpenActiveStoreItems,
    handleOpenActiveStoreCart,
    fetchStoreDetail,
  } = store;
  const {
    cartItems,
    selectedFulfillmentMode,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentErrorMessage,
    checkoutState,
    setCheckoutState,
    createOrderValues,
    setCreateOrderValues,
    handleConfirmCheckout,
    handleConfirmedOrderExecution,
    checkoutClientMemo,
    checkoutAuth,
  } = checkout;
  const {
    filteredOrders,
    ordersQuery,
    setOrdersQuery,
    handleReorderClick,
    trackingClientState,
    activeTrackedOrder,
    trackingWltIntent,
    liveOrderDetails,
    trackingOrderValues,
    trackingTimeline,
    reopenTracking,
    handleCancelOrder,
    handleSupportEscalation,
    returnOrdersList,
  } = orders;
  const {
    liveMarketingPrograms,
    recordMarketingBannerClick,
    recordMarketingBannerImpression,
    recordMarketingGrowthClick,
    recordMarketingGrowthImpression,
  } = marketing;
  // Sanity check
  const importedScreens: Array<[string, unknown]> = [
    ['DshEntryScreen', DshEntryScreen as unknown],
    ['DshHomeGetScreen', DshHomeGetScreen as unknown],
    ['DshMySpaceScreen', DshMySpaceScreen as unknown],
    ['DshNotificationsScreen', DshNotificationsScreen as unknown],
    ['DshBenefitsHubScreen', DshBenefitsHubScreen as unknown],
    ['DshOrdersListScreen', DshOrdersListScreen as unknown],
    ['DshTrackingScreen', DshTrackingScreen as unknown],
    ['DshStoreGetScreen', DshStoreGetScreen as unknown],
    ['DshStoreItemsScreen', DshStoreItemsScreen as unknown],
    ['DshClientBellScreen', DshClientBellScreen as unknown],
    ['DshCartGetScreen', DshCartGetScreen as unknown],
    ['DshConversationHubScreen', DshConversationHubScreen as unknown],
    ['DshOrderIssueHubScreen', DshOrderIssueHubScreen as unknown],
    ['DshProxyHubScreen', DshProxyHubScreen as unknown],
    ['DshServiceSettingsHubScreen', DshServiceSettingsHubScreen as unknown],
    ['DshZoneSetScreen', DshZoneSetScreen as unknown],
    ['DshListingStatusUpdateScreen', DshListingStatusUpdateScreen as unknown],
    ['DshAddressLocationScreen', DshAddressLocationScreen as unknown],
    ['DshIdentityHubScreen', DshIdentityHubScreen as unknown],
    ['DshPreferencesHubScreen', DshPreferencesHubScreen as unknown],
  ];

  const missing = importedScreens.filter(([, v]) => typeof v === 'undefined').map(([n]) => String(n));
  if (missing.length > 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[6] }}>
        <Text role="headingSm" weight="bold" style={{ color: colorPalette.brandStrong, marginBottom: spacing[3] }}>مكوّنات مفقودة</Text>
        <Text style={{ color: colorPalette.brandStrong }}>{missing.join(', ')}</Text>
      </View>
    );
  }

  if (route === 'wlt-home') {
    return (
      <WltHomeGetScreen
        onBack={() => setRoute('home')}
        dshAuthBearerToken={dshAuthBearerToken}
        dshClientId={dshClientId}
      />
    );
  }

  if (route === 'checkout-intent') {
    const checkoutPresenter = buildDshClientCheckoutPresenterModel({
      cartItems,
      createOrderValues,
      selectedFulfillmentMode,
      selectedPaymentMethod,
      walletSession,
    });

    return (
      <DshCheckoutIntentScreen
        state={checkoutState}
        address={checkoutPresenter.addressLabel}
        subtotal={checkoutPresenter.subtotalLabel}
        deliveryFee={checkoutPresenter.deliveryFeeLabel}
        total={checkoutPresenter.totalLabel}
        eta={checkoutPresenter.etaLabel}
        paymentMethods={checkoutPresenter.paymentMethods}
        paymentErrorMessage={paymentErrorMessage}
        onBack={() => setRoute('cart-get')}
        onConfirm={handleConfirmCheckout}
        onSelectPaymentMethod={(id) => setSelectedPaymentMethod(id)}
        onChangeAddress={() => setRoute('addresses-location')}
        onRetry={() => setCheckoutState('ready')}
      />
    );
  }

  if (route === 'checkout-failure') {
    const failureReason: DshCheckoutFailureReason =
      (checkoutAuth as unknown as { failureReason?: DshCheckoutFailureReason })?.failureReason ?? 'unknown';
    return (
      <DshCheckoutFailureScreen
        state="error"
        failureReason={failureReason}
        cartPreserved
        onRetry={() => { setCheckoutState('ready'); setRoute('checkout-intent'); }}
        onCancel={() => setRoute('cart-get')}
        onContactSupport={() => setRoute('conversation-workspace')}
      />
    );
  }

  if (route === 'entry') {
    return (
      <DshEntryScreen
        onStartDelivery={() => setRoute('cart-get')}
        onBrowseStores={() => setRoute('home')}
        onOpenOrders={() => setRoute('orders-list')}
        onRetry={() => setRoute('entry')}
      />
    );
  }

  if (route === 'my-space') {
    return (
      <DshMySpaceScreen
        appearanceHydrated={appearanceHydrated}
        appearanceMode={appearanceMode}
        marketingPrograms={liveMarketingPrograms.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          meta: item.routeTarget,
          badgeLabel: item.family === 'subscription' ? 'اشتراك' : item.family === 'promotion' ? 'برومو' : item.family === 'shorts' ? 'شورتات' : 'حملة',
        }))}
        onAppearanceModeChange={setAppearanceMode}
        onOpenOrders={() => setRoute('orders-list')}
        onOpenWallet={() => setRoute('wlt-home')}
        onOpenLoyalty={() => { setSelectedOperationScreen('loyalty-points-client-balance'); setRoute('benefits'); }}
        onOpenSubscriptions={() => { setSelectedOperationScreen('subscription-sync'); setRoute('benefits'); }}
        onOpenAddressesLocation={() => setRoute('addresses-location')}
        onOpenIdentity={() => setRoute('identity')}
        onOpenCommercial={() => { setSelectedOperationScreen('promo-apply'); setRoute('benefits'); }}
        onOpenAppearance={() => setRoute('appearance')}
        onOpenPreferences={() => setRoute('preferences')}
        onOpenTracking={() => openTrackedOrder()}
        onRepeatOrder={openCreateOrderJourney}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('my-space')}
      />
    );
  }

  if (route === 'notifications') {
    return (
      <DshNotificationsScreen
        onOpenBenefits={() => {
          setSelectedOperationScreen('subscription-sync');
          setRoute('benefits');
        }}
        onOpenTracking={() => openTrackedOrder()}
        onOpenOrders={() => setRoute('orders-list')}
        onOpenSearch={openHomeInlineSearch}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('notifications')}
      />
    );
  }

  if (route === 'store-get') {
    return (
      <DshStoreGetScreen
        appearanceMode={appearanceMode}
        state={storeDetailState}
        store={activeStoreScreenStore}
        menuItems={activeStoreItems}
        onAddItemToCart={addItemToHostCart}
        onOpenItems={handleOpenActiveStoreItems}
        onOpenCart={handleOpenActiveStoreCart}
        onOpenBenefits={() => {
          setSelectedOperationScreen('entitlements-get');
          setRoute('benefits');
        }}
        onBack={() => setRoute('home')}
        onRetry={() => fetchStoreDetail(activeStoreId, activeStore)}
        onSupport={openSupportFlow}
      />
    );
  }

  if (route === 'store-items') {
    return (
      <DshStoreItemsScreen
        storeName={activeStore.name}
        items={activeStoreItems}
        query={itemsQuery}
        activeCategory={itemsCategory}
        onQueryChange={setItemsQuery}
        onCategoryChange={setItemsCategory}
        onOpenItem={(itemId) => {
          setSelectedItemId(itemId);
          setRoute('cart-get');
        }}
        onOpenCart={() => setRoute('cart-get')}
        onBack={() => setRoute(storeItemsEntryOrigin === 'store-get' ? 'store-get' : 'home')}
        onRetry={() => setRoute('store-items')}
      />
    );
  }

  if (route === 'cart-get') {
    const cartClientState = cartItems.length > 0 ? hostClientStates.cartReady : hostClientStates.cartEmpty;
    const cartClientStateMeta = getDshClientStateMeta(cartClientState);

    const handleCartOrderPayload = async (payload: Parameters<NonNullable<React.ComponentProps<typeof DshCartGetScreen>['onOpenOrder']>>[0]) => {
      if (payload) {
        setSelectedPaymentMethod(payload.paymentMethod);
        setCreateOrderValues((current) => ({
          ...current,
          fulfillmentMode: payload.orderDraft.fulfillmentMode,
          pickupAddress: payload.orderDraft.pickupAddress,
          dropoffAddress: payload.orderDraft.dropoffAddress,
          note: payload.orderDraft.note ?? current.note,
        }));
        handleConfirmedOrderExecution({
          fulfillmentMode: payload.fulfillmentMode,
          orderDraft: payload.orderDraft,
          wltPaymentRefId: payload.wltPaymentRefId,
        });
      }
    };

    return (
      <DshCartGetScreen
        clientState={cartClientState}
        fulfillmentMode={selectedFulfillmentMode}
        reorderAlertMessage={undefined} // Alert managed in surface host/hooks if needed
        store={{
          id: activeStore.id,
          name: activeStore.name,
          subtitle: activeStore.subtitle,
          statusLabel: activeStore.statusLabel,
          ratingLabel: '4.8 / 5 جودة المتجر',
        }}
        items={cartItems}
        activeOrder={{
          id: cartItems[0]?.id ?? activeStore.id ?? 'cart-empty',
          title: cartItems[0] ? `تتضمن السلة ${cartItems[0].title}` : 'السلة جاهزة للدفع',
          subtitle: cartItems[0]
            ? `عناصر من ${cartItems[0].storeName}`
            : `عناصر من ${activeStore.name}`,
          meta: cartItems[0]?.priceLabel ?? 'راجع العناصر وتابع',
          statusLabel: 'جاهز',
        }}
        statusTitle={cartClientStateMeta.label}
        statusDescription={cartClientStateMeta.description}
        checkoutClient={checkoutClientMemo}
        clientId={checkoutAuth.clientId}
        bearerToken={checkoutAuth.bearerToken}
        onOpenStore={() => setRoute('store-get')}
        onOpenService={onOpenService}
        onOpenOrder={handleCartOrderPayload}
        onContinue={handleCartOrderPayload}
        onRetry={() => setRoute('cart-get')}
      />
    );
  }

  if (route === 'benefits') {
    return (
      <DshBenefitsHubScreen
        screenId={selectedOperationScreen}
        onPrimaryAction={returnHome}
        onSecondaryAction={returnHome}
        onRetry={() => setRoute('benefits')}
      />
    );
  }

  if (route === 'conversation-workspace') {
    return (
      <DshConversationHubScreen
        screenId={selectedOperationScreen as 'chat-read-ack' | 'chat-send'}
        onPrimaryAction={returnOrdersList}
        onSecondaryAction={returnOrdersList}
        onRetry={() => setRoute('conversation-workspace')}
      />
    );
  }

  if (route === 'order-issue-workspace') {
    return (
      <DshOrderIssueHubScreen
        onPrimaryAction={returnOrdersList}
        onSecondaryAction={returnOrdersList}
        onRetry={() => setRoute('order-issue-workspace')}
      />
    );
  }

  if (route === 'proxy-workspace') {
    return (
      <DshProxyHubScreen
        screenId={selectedOperationScreen as 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking'}
        onPrimaryAction={() => setRoute(selectedOperationScreen === 'proxy-request-tracking' ? 'tracking' : 'orders-list')}
        onSecondaryAction={returnOrdersList}
        onRetry={() => setRoute('proxy-workspace')}
      />
    );
  }

  if (route === 'listing-status-update') {
    return (
      <DshListingStatusUpdateScreen
        onPrimaryAction={returnHome}
        onSecondaryAction={returnHome}
        onRetry={() => setRoute('listing-status-update')}
      />
    );
  }

  if (route === 'appearance') {
    return (
      <DshAppearanceHubScreen
        appearanceMode={appearanceMode}
        onAppearanceModeChange={setAppearanceMode}
        onBack={() => setRoute('my-space')}
        onRetry={() => setRoute('appearance')}
      />
    );
  }

  if (route === 'addresses-location') {
    return (
      <DshAddressLocationScreen
        onBack={() => setRoute('my-space')}
      />
    );
  }

  if (route === 'identity') {
    return (
      <DshIdentityHubScreen
        onBack={() => setRoute('my-space')}
      />
    );
  }

  if (route === 'preferences') {
    return (
      <DshPreferencesHubScreen
        onBack={() => setRoute('my-space')}
        onRetry={() => setRoute('preferences')}
      />
    );
  }

  if (route === 'zone-set') {
    return (
      <DshZoneSetScreen
        onPrimaryAction={returnHome}
        onSecondaryAction={returnHome}
        onRetry={() => setRoute('zone-set')}
      />
    );
  }

  if (route === 'service-settings') {
    return (
      <DshServiceSettingsHubScreen
        screenId={selectedOperationScreen as 'listing-status-update' | 'service-modes-resolve' | 'zone-set'}
        onPrimaryAction={returnHome}
        onSecondaryAction={returnHome}
        onRetry={() => setRoute('service-settings')}
      />
    );
  }

  if (route === 'orders-list') {
    return (
      <DshOrdersListScreen
        items={filteredOrders}
        query={ordersQuery}
        onQueryChange={setOrdersQuery}
        onOpenOrder={openTrackedOrder}
        onReorder={handleReorderClick}
        onBack={returnHome}
      />
    );
  }

  if (route === 'tracking') {
    let liveClientState = trackingClientState;
    let liveStatusLabel = activeTrackedOrder?.statusLabel ?? trackingWltIntent?.clientUiHint;

    if (liveOrderDetails) {
      const mapped = mapLiveOrderStatusToClientState(liveOrderDetails.order.status);
      if (mapped) {
        liveClientState = mapped.clientState;
        liveStatusLabel = mapped.statusLabel;
      }
    }

    return (
      <DshTrackingScreen
        values={trackingOrderValues}
        clientState={liveClientState}
        currentStatusLabel={liveStatusLabel}
        fulfillmentMode={trackingOrderValues.fulfillmentMode}
        timeline={trackingTimeline}
        onSupport={openSupportFlow}
        onRetry={reopenTracking}
        onNextAction={() => setRoute('orders-list')}
        onReorder={openCreateOrderJourney}
        onCancelOrder={handleCancelOrder}
        onCreateSupportEscalation={handleSupportEscalation}
      />
    );
  }

  if (route === 'bell') {
    return (
      <DshClientBellScreen
        signalEvents={bellSignalEvents}
        onOpenTracking={reopenTracking}
        onOpenOrders={() => setRoute('orders-list')}
        onBack={reopenTracking}
        onRetry={() => setRoute('bell')}
      />
    );
  }

  // Fallback / default DshHomeGetScreen
  return (
    <DshHomeGetScreen
      state={homeScreenState}
      serviceDialTrigger={serviceDialTrigger}
      favoriteOverrides={favoriteOverrides}
      onToggleFavorite={handleToggleFavorite}
      categories={categories}
      promos={homeMarketingPromos}
      homePromos={homePromos}
      approvedVideoShorts={liveMarketingShorts}
      stores={clientVisibleHomeStores as DshHomeGetStore[]}
      recentOrders={homeRecentOrders}
      onBack={onExit}
      onOpenWallet={() => setRoute('wlt-home')}
      onOpenEntry={() => setRoute('entry')}
      onOpenMySpace={() => setRoute('my-space')}
      onOpenNotifications={() => setRoute('notifications')}
      onOpenCart={() => setRoute('cart-get')}
      onOpenService={onOpenService}
      onOpenList={() => setRoute('home')}
      onOpenCategory={handleOpenHomeCategory}
      onOpenDiscovery={() => setRoute('home')}
      onOpenStoreCategory={handleOpenHomeStoreCategory}
      onOpenProduct={handleOpenHomeProduct}
      onOpenBenefits={handleOpenHomeBenefits}
      onOpenFavorites={() => setRoute('home')}
      onOpenSearch={openHomeInlineSearch}
      onOpenOrders={() => setRoute('orders-list')}
      onOpenTracking={() => openTrackedOrder()}
      onPromoClick={recordMarketingBannerClick}
      onPromoImpression={recordMarketingBannerImpression}
      onVideoCtaClick={recordMarketingGrowthClick}
      onVideoImpression={recordMarketingGrowthImpression}
      onOpenSheinInfo={() => {
        setSheinInlineOpen(true);
        setRoute('home');
      }}
      onOpenStore={handleOpenHomeStore}
      searchAutoOpenToken={homeSearchAutoOpenToken}
      sheinInlineVisible={sheinInlineOpen}
      onCloseSheinInline={() => setSheinInlineOpen(false)}
      awnakInlineVisible={awnakInlineOpen}
      onCloseAwnakInline={() => setAwnakInlineOpen(false)}
      onRegisterBackHandler={handleRegisterBackHandler}
      renderApprovedVideoReelsViewer={renderApprovedVideoReelsViewer}
      onRetry={() => {
        setRoute('home');
        setHomeRetryToken((t) => t + 1);
      }}
    />
  );
}
