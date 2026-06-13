import React from 'react';
import { View, Platform } from 'react-native';
import { Text, colorPalette,
  spacing,
} from '@bthwani/ui-kit';

import { DshEntryScreen } from './screens/EntryScreen';
import { DshClientBellScreen } from './screens/BellScreen';
import { DshHomeGetScreen } from './screens/HomeScreen';
import type {
  DshHomeCategory,
  DshHomeGetPromo,
  DshHomeGetStore,
  DshHomeRecentOrder,
} from './contracts/dsh-home-types';
import { DshMySpaceScreen } from './screens/MySpaceScreen';
import { DshNotificationsScreen } from './screens/NotificationsScreen';
import { DshBenefitsHubScreen } from './screens/BenefitsScreen';
import { DshOrdersListScreen } from './screens/DshOrdersListScreen';
import { DshTrackingScreen } from './screens/DshTrackingScreen';
import { DshStoreGetScreen, type DshStoreGetScreenProps } from './screens/StoreScreen';
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

import type { ClientOperationScreenId } from './screens/parts/OperationScreenView';
import type { DshFulfillmentDeliveryMode } from './contracts/dsh-client-binding.contracts';
import { hostClientStates, type CreateOrderValues, type HostCartItem, type HostOrderSummary } from './dsh-client.navigation-bridge';
import { buildPaymentMethodsList } from './adapters/dshClientCheckoutAdapters';
import type { DshRoute } from './dsh-client.types';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import type { DshClientWltIntentEntry } from './dsh-client-wlt-payment-bridge';
import type { DshTrackingTimelineItem } from './hooks/useDshOrderTracking';
import type { DshDiscoveryStoresBridgeResult } from './shared/dsh-discovery-stores-bridge';
import type { DshClientState } from './dsh-client.types';
import type { DshCheckoutAuthContext } from '../shared/dsh-checkout-client';
import type { ActiveStore } from './hooks/useDshCheckout';
import type { DshStoreFixtureItem, DshDiscoveryStore } from '../shared/dshStoreProductCardModel';
import type { HomePromoRecord, MarketingGrowthRecord, MarketingVideoRecord } from '../shared/dsh-marketing-types';
import type { WltDshWalletPreviewState } from '../../../wlt/frontend/dsh/app-client/wlt-dsh-client.types';

function parsePrice(priceLabel?: string): number {
  if (!priceLabel) return 10.0;
  const match = priceLabel.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 10.0;
}

type DshClientRouteRendererProps = {
  categories: DshHomeCategory[];
  homeScreenState: 'ready' | 'loading' | 'empty' | 'error' | 'offline';
  route: DshRoute;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  dshAuthBearerToken: string | null | undefined;
  dshClientId: string | null | undefined;
  cartItems: HostCartItem[];
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  walletPreview: WltDshWalletPreviewState;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  paymentErrorMessage: string | undefined;
  checkoutState: 'ready' | 'loading' | 'payment-failed';
  setCheckoutState: (state: 'ready' | 'loading' | 'payment-failed') => void;
  createOrderValues: CreateOrderValues;
  setCreateOrderValues: React.Dispatch<React.SetStateAction<CreateOrderValues>>;
  handleConfirmCheckout: () => void;
  handleConfirmedOrderExecution: (payload?: { fulfillmentMode?: DshFulfillmentDeliveryMode; orderDraft?: Partial<CreateOrderValues>; wltPaymentRefId?: string }) => void;
  appearanceHydrated: boolean;
  appearanceMode: BThwaniAppearanceMode;
  setAppearanceMode: (mode: BThwaniAppearanceMode) => void;
  liveMarketingPrograms: MarketingGrowthRecord[];
  setSelectedOperationScreen: React.Dispatch<React.SetStateAction<ClientOperationScreenId>>;
  openTrackedOrder: (orderId?: string) => void;
  openCreateOrderJourney: () => void;
  returnHome: () => void;
  storeDetailState: 'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'not-found';
  activeStoreScreenStore: DshStoreGetScreenProps['store'] | undefined;
  activeStoreItems: DshStoreFixtureItem[];
  addItemToHostCart: (item: { id: string; name?: string; title?: string; priceLabel?: string; canonicalStoreId?: string; canonicalProductId?: string; sourceRecordId?: string; publishStage?: string }, payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string }) => void;
  handleOpenActiveStoreItems: () => void;
  handleOpenActiveStoreCart: (mode?: DshFulfillmentDeliveryMode) => void;
  fetchStoreDetail: (storeId: string, store: unknown, limit?: number) => () => void;
  activeStoreId: string;
  activeStore: DshDiscoveryStore;
  itemsQuery: string;
  setItemsQuery: (q: string) => void;
  itemsCategory: string;
  setItemsCategory: (c: string) => void;
  storeItemsEntryOrigin: string;
  setSelectedItemId: (id: string) => void;
  checkoutClientMemo: import('../shared/dsh-checkout-client').DshCheckoutClient | undefined;
  checkoutAuth: DshCheckoutAuthContext;
  onOpenService?: (serviceId: string) => void;
  selectedOperationScreen: ClientOperationScreenId;
  returnOrdersList: () => void;
  filteredOrders: HostOrderSummary[];
  ordersQuery: string;
  setOrdersQuery: (q: string) => void;
  handleReorderClick: (orderId: string) => void;
  trackingClientState: DshClientState;
  activeTrackedOrder: HostOrderSummary | undefined;
  trackingWltIntent: DshClientWltIntentEntry | undefined;
  liveOrderDetails: import('../shared/dsh-order-lifecycle-client').DshOrderDetailsResponse | null;
  trackingOrderValues: CreateOrderValues;
  trackingTimeline: DshTrackingTimelineItem[];
  reopenTracking: () => void;
  handleCancelOrder: () => void;
  handleSupportEscalation: (issueType: string, description: string) => Promise<void>;
  clientDiscoveryStoresBridge: DshDiscoveryStoresBridgeResult;
  serviceDialTrigger: number;
  favoriteOverrides: Record<string, boolean>;
  handleToggleFavorite: (storeId: string) => void;
  homeMarketingPromos: DshHomeGetPromo[];
  homePromos: HomePromoRecord[];
  liveMarketingShorts: MarketingVideoRecord[];
  clientVisibleHomeStores: DshHomeGetStore[];
  homeRecentOrders: DshHomeRecentOrder[];
  onExit?: () => void;
  handleOpenHomeCategory: (categoryId: string) => void;
  handleOpenHomeStoreCategory: (storeId: string, categoryId: string) => void;
  handleOpenHomeProduct: (storeId: string, itemId: string) => void;
  handleOpenHomeBenefits: (screenId?: string) => void;
  openHomeInlineSearch: () => void;
  recordMarketingBannerClick: ((id: string) => void) | undefined;
  recordMarketingBannerImpression: ((id: string) => void) | undefined;
  recordMarketingGrowthClick: ((id: string) => void) | undefined;
  recordMarketingGrowthImpression: ((id: string) => void) | undefined;
  sheinInlineOpen: boolean;
  setSheinInlineOpen: (open: boolean) => void;
  awnakInlineOpen: boolean;
  setAwnakInlineOpen: (open: boolean) => void;
  handleOpenHomeStore: (storeId: string) => void;
  homeSearchAutoOpenToken: number;
  handleRegisterBackHandler: ((handler: (() => boolean) | null) => void) | undefined;
  renderApprovedVideoReelsViewer: ((props: any) => React.ReactNode) | undefined;
  setHomeRetryToken: React.Dispatch<React.SetStateAction<number>>;
  openSupportFlow: () => void;
  bellSignalEvents: readonly import('../shared/dsh-signal-layer.model').DshSignalSummary[];
};

export function DshClientRouteRenderer({
  categories,
  homeScreenState,
  route,
  setRoute,
  dshAuthBearerToken,
  dshClientId,
  cartItems,
  selectedFulfillmentMode,
  walletPreview,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentErrorMessage,
  checkoutState,
  setCheckoutState,
  createOrderValues,
  setCreateOrderValues,
  handleConfirmCheckout,
  handleConfirmedOrderExecution,
  appearanceHydrated,
  appearanceMode,
  setAppearanceMode,
  liveMarketingPrograms,
  setSelectedOperationScreen,
  openTrackedOrder,
  openCreateOrderJourney,
  returnHome,
  storeDetailState,
  activeStoreScreenStore,
  activeStoreItems,
  addItemToHostCart,
  handleOpenActiveStoreItems,
  handleOpenActiveStoreCart,
  fetchStoreDetail,
  activeStoreId,
  activeStore,
  itemsQuery,
  setItemsQuery,
  itemsCategory,
  setItemsCategory,
  storeItemsEntryOrigin,
  setSelectedItemId,
  checkoutClientMemo,
  checkoutAuth,
  onOpenService,
  selectedOperationScreen,
  returnOrdersList,
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
  clientDiscoveryStoresBridge,
  serviceDialTrigger,
  favoriteOverrides,
  handleToggleFavorite,
  homeMarketingPromos,
  homePromos,
  liveMarketingShorts,
  clientVisibleHomeStores,
  homeRecentOrders,
  onExit,
  handleOpenHomeCategory,
  handleOpenHomeStoreCategory,
  handleOpenHomeProduct,
  handleOpenHomeBenefits,
  openHomeInlineSearch,
  recordMarketingBannerClick,
  recordMarketingBannerImpression,
  recordMarketingGrowthClick,
  recordMarketingGrowthImpression,
  sheinInlineOpen,
  setSheinInlineOpen,
  awnakInlineOpen,
  setAwnakInlineOpen,
  handleOpenHomeStore,
  homeSearchAutoOpenToken,
  handleRegisterBackHandler,
  renderApprovedVideoReelsViewer,
  setHomeRetryToken,
  openSupportFlow,
  bellSignalEvents,
}: DshClientRouteRendererProps) {
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
    const cartSubtotal = cartItems.reduce(
      (sum, item) => sum + parsePrice(item.priceLabel) * item.qty,
      0
    );
    const deliveryFeeNum = selectedFulfillmentMode === 'pickup' ? 0 : 1500;
    const cartTotal = cartSubtotal + deliveryFeeNum;

    const formattedBalance = walletPreview.balance !== null ? `${walletPreview.balance} ر.ي` : '...';
    const paymentMethods = buildPaymentMethodsList(formattedBalance, selectedPaymentMethod);

    return (
      <DshCheckoutIntentScreen
        state={checkoutState}
        address={createOrderValues.dropoffAddress || 'مسقط، الخوير، شارع المها، بناية رقم 123'}
        subtotal={`${cartSubtotal} ر.ي`}
        deliveryFee={`${deliveryFeeNum} ر.ي`}
        total={`${cartTotal} ر.ي`}
        eta={selectedFulfillmentMode === 'pickup' ? '15 - 20 دقيقة' : '30 - 45 دقيقة'}
        paymentMethods={paymentMethods}
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
          id: cartItems[0]?.id ?? 'cart-preview',
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
      const order = liveOrderDetails.order;
      if (order.status === 'CREATED') {
        liveClientState = hostClientStates.orderCreated;
        liveStatusLabel = 'قيد المراجعة';
      } else if (order.status === 'ACCEPTED') {
        liveClientState = hostClientStates.orderConfirmed;
        liveStatusLabel = 'تم القبول';
      } else if (order.status === 'READY_FOR_PICKUP') {
        liveClientState = hostClientStates.trackingActive;
        liveStatusLabel = 'جاهز للاستلام';
      } else if (order.status === 'DELIVERED') {
        liveClientState = hostClientStates.delivered;
        liveStatusLabel = 'تم التوصيل';
      } else if (order.status === 'CANCELLED') {
        liveClientState = hostClientStates.cancelled;
        liveStatusLabel = 'تم الإلغاء';
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

// Private helper to lookup operational states
import { getDshClientStateMeta } from '../shared/client-state';
