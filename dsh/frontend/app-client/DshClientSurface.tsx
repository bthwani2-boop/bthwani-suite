import React from 'react';
import { Platform, View } from 'react-native';
import { BottomNavBar, Text, colorPalette } from '@bthwani/ui-kit';
import { DshEntryScreen } from './screens/EntryScreen';
import { DshClientBellScreen } from './screens/BellScreen';
import {
  DshHomeGetScreen,
  type DshHomeCategory,
  type DshHomeGetPromo,
  type DshHomeGetStore,
} from './screens/HomeScreen';
import { DshMySpaceScreen } from './screens/MySpaceScreen';
import { DshNotificationsScreen } from './screens/NotificationsScreen';
import { DshBenefitsHubScreen } from './screens/BenefitsScreen';
import { DshOrdersListScreen } from './screens/DshOrdersListScreen';
import { DshTrackingScreen } from './screens/DshTrackingScreen';
import { DshStoreGetScreen } from './screens/StoreScreen';
import { DshStoreItemsScreen } from './screens/StoreItemsScreen';
import { DshCartGetScreen } from './screens/CartScreen';
import { DshCheckoutIntentScreen } from './screens/DshCheckoutIntentScreen';
import { useWltDshWalletPreview } from '../../../wlt/frontend/dsh/app-client';
import type { ClientOperationScreenId } from './screens/parts/OperationScreenView';
import { DshConversationHubScreen } from './screens/DshConversationHubScreen';
import { DshOrderIssueHubScreen } from './screens/DshOrderIssueHubScreen';
import { DshProxyHubScreen } from './screens/DshProxyHubScreen';
import { DshServiceSettingsHubScreen } from './screens/DshServiceSettingsHubScreen';
import { DshZoneSetScreen } from './screens/DshZoneSetScreen';
import { DshListingStatusUpdateScreen } from './screens/DshListingStatusUpdateScreen';
import { DshAddressLocationScreen } from './screens/AddressLocationScreen';
import { DshIdentityHubScreen } from './screens/DshIdentityHubScreen';
import { DshPreferencesHubScreen } from './screens/DshPreferencesHubScreen';
import { dshHomeGetFixtureStores } from '../data/stores.preview-data';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshDiscoveryStores,
  storeItemsByStoreId,
} from '../data/stores.preview-data';
import {
  recordMarketingBannerClick,
  recordMarketingBannerImpression,
  getPublishedMarketingHomePromos,
} from '../data/marketing.preview-data';
import {
  getLiveMarketingGrowthItems,
  recordMarketingGrowthClick,
  recordMarketingGrowthImpression,
  type MarketingGrowthRecord,
} from '../data/marketing.preview-data';
import { getDshClientStateMeta, type DshClientState } from '../data/operational-statuses.preview-data';
import { getPublishedHomePromos } from '../data/marketing.preview-data';
import { dshCategoryListFixtures } from '../data/categories.preview-data';
import {
  isDshFulfillmentDeliveryMode,
  type DshFulfillmentDeliveryMode,
} from './contracts/dsh-client-binding.contracts';
import { resolveDshDiscoveryStoresBridge, type DshDiscoveryStoresBridgeResult } from './shared/dsh-discovery-stores-bridge';
import { resolveDshDiscoveryStoresRuntimeConfig } from './shared/dsh-discovery-stores-runtime-config';
import { createDshDiscoveryStoresClient, isDshDiscoveryStoresOfflineError } from './shared/dsh-discovery-stores-transport';
import { resolveDshStoreClientVisibility } from '../shared/dsh-client-visibility.model';
import { createDshProductApiHttpClient } from '../shared/dsh-product-api.transport';
import {
  createDshOrderLifecycleHttpClient,
  type DshOrderItemInput,
  createDshCheckoutHttpClient,
  type DshCheckoutAuthContext,
  PlatformVarsProvider,
  usePlatformVars,
  FeatureFlagProvider,
  useFeatureFlag,
} from '../shared';
import type { DshClientSurfaceProps, DshCommandTarget, DshRoute } from './dsh-client.types';
import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import { WltHomeGetScreen } from '../../../wlt/frontend/app-client-wlt';

import {
  type CreateOrderValues,
  type HostOrderSummary,
  type HostCartItem,
  type HostCanonicalMetadata,
  hostClientStates,
  clientVisibleDiscoveryPreviewStores,
  clientVisibleHomePreviewStores,
  initialOrders,
  initialCreateOrderValues,
  commandTargetToRoute,
  resolveStorePickupAddress,
  publishedPromoCategoryIds,
} from './dsh-client.navigation-bridge';
import {
  getClientWltIntentForState,
  type DshClientWltIntentEntry,
} from './dsh-client-wlt-payment-bridge';
import { useDshNavigation, useDshOrderTracking, useDshCheckout } from './hooks';

const defaultTrackingOrderId = initialOrders[0]?.id ?? 'dsh-10021';

function parsePrice(priceLabel?: string): number {
  if (!priceLabel) return 10.0;
  const match = priceLabel.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 10.0;
}

function resolveCheckoutAuthContext(
  authToken?: string,
  devClientId?: string,
  dshAuthBearerToken?: string | null,
  dshClientId?: string | null,
): DshCheckoutAuthContext {
  const bearerToken = (authToken ?? dshAuthBearerToken ?? undefined)?.trim();
  if (bearerToken) return { bearerToken };

  const clientId = (devClientId ?? dshClientId ?? 'client-101').trim();
  return { clientId };
}

const CLIENT_BOTTOM_NAV_ITEMS = [
  { id: 'favorites', label: 'الرئيسية', icon: 'home-outline', activeIcon: 'home' },
  { id: 'orders', label: 'طلباتي', icon: 'receipt-outline', activeIcon: 'receipt' },
  { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
] as const;

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

  // â”€â”€ Runtime bridge state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Initialise with preview fallback so the first render is always populated.
  // The transport useEffect below switches to loading â†’ success/error/offline
  // when a runtime config (EXPO_PUBLIC_DSH_API_BASE_URL) is present.
  const [runtimeBridge, setRuntimeBridge] = React.useState<DshDiscoveryStoresBridgeResult>(() =>
    resolveDshDiscoveryStoresBridge({
      previewHomeStores: clientVisibleHomePreviewStores,
      previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
    }),
  );

  const [homeRetryToken, setHomeRetryToken] = React.useState(0);

  // Aliases that match the previous module-level names so all downstream code
  // reads from the live bridge state instead of static preview constants.
  const clientDiscoveryStoresBridge = runtimeBridge;
  const clientVisibleDiscoveryStores = runtimeBridge.discoveryStores;
  const clientVisibleHomeStores = runtimeBridge.homeStores;

  // â”€â”€ Route-validation helpers (closed over the live store list) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const hasStoreTarget = React.useCallback((storeId?: string): boolean => {
    return typeof storeId === 'string' && clientVisibleDiscoveryStores.some((store) => store.id === storeId);
  }, [clientVisibleDiscoveryStores]);

  const hasStoreCategoryTarget = React.useCallback((storeId?: string, categoryId?: string): boolean => {
    if (!hasStoreTarget(storeId) || typeof categoryId !== 'string') {
      return false;
    }
    return (storeItemsByStoreId[storeId] ?? []).some((item) => item.categoryId === categoryId);
  }, [hasStoreTarget]);

  const hasProductTarget = React.useCallback((storeId?: string, productId?: string): boolean => {
    if (!hasStoreTarget(storeId) || typeof productId !== 'string') {
      return false;
    }
    return (storeItemsByStoreId[storeId] ?? []).some((item) => item.id === productId);
  }, [hasStoreTarget]);

  const isMarketingGrowthRouteValid = React.useCallback((item: MarketingGrowthRecord): boolean => {
    if (
      item.routeTarget === 'home'
      || item.routeTarget === 'search'
      || item.routeTarget === 'promo-apply'
      || item.routeTarget === 'subscription'
      || item.routeTarget === 'subscription-family-get'
      || item.routeTarget === 'entitlements-get'
    ) {
      return true;
    }

    if (item.routeTarget === 'main_category' || item.routeTarget === 'sub_category') {
      return item.routeTargetId ? publishedPromoCategoryIds.has(item.routeTargetId) : false;
    }

    if (item.routeTarget === 'store') {
      return hasStoreTarget(item.routeTargetId);
    }

    if (item.routeTarget === 'store_category') {
      return hasStoreCategoryTarget(item.routeTargetId, item.routeTargetExtra);
    }

    if (item.routeTarget === 'product') {
      return hasProductTarget(item.routeTargetExtra, item.routeTargetId);
    }

    return false;
  }, [hasProductTarget, hasStoreCategoryTarget, hasStoreTarget]);

  const getStoreCanonicalMetadata = React.useCallback((storeId: string): HostCanonicalMetadata => {
    const store =
      clientVisibleDiscoveryStores.find((entry) => entry.id === storeId)
      ?? dshDiscoveryStores.find((entry) => entry.id === storeId);
    return {
      canonicalStoreId: store?.canonicalStoreId,
      sourceRecordId: store?.sourceRecordId,
      publishStage: store?.publishStage,
    };
  }, [clientVisibleDiscoveryStores]);

  const getProductCanonicalMetadata = React.useCallback((storeId: string, productId: string): HostCanonicalMetadata => {
    const storeMetadata = getStoreCanonicalMetadata(storeId);
    const product = (storeItemsByStoreId[storeId] ?? []).find((entry) => entry.id === productId);
    return {
      canonicalStoreId: product?.canonicalStoreId ?? storeMetadata.canonicalStoreId,
      canonicalProductId: product?.canonicalProductId,
      sourceRecordId: product?.sourceRecordId ?? storeMetadata.sourceRecordId,
      publishStage: product?.publishStage ?? storeMetadata.publishStage,
    };
  }, [getStoreCanonicalMetadata]);

  const initialCanonicalStore = getStoreCanonicalMetadata('store-1001');
  const checkoutAuth = React.useMemo(
    () => resolveCheckoutAuthContext(authToken, devClientId, dshAuthBearerToken, dshClientId),
    [authToken, devClientId, dshAuthBearerToken, dshClientId],
  );
  const walletPreview = useWltDshWalletPreview(checkoutAuth.clientId, checkoutAuth.bearerToken);

  // Navigation: route, back-stack, Android BackHandler, web popstate
  const {
    route, setRoute,
    sheinInlineOpen, setSheinInlineOpen,
    awnakInlineOpen, setAwnakInlineOpen,
    homeSearchAutoOpenToken, openHomeInlineSearch,
    handleRegisterBackHandler,
  } = useDshNavigation({ command, onExit });

  // Shared order/cart/store state (not owned by any hook)
  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const [selectedFulfillmentMode, setSelectedFulfillmentMode] = React.useState<DshFulfillmentDeliveryMode>(defaultFulfillmentMode);
  const [cartItems, setCartItems] = React.useState<HostCartItem[]>([]);
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [serviceabilityLoading, setServiceabilityLoading] = React.useState(false);
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [activeStoreDetail, setActiveStoreDetail] = React.useState<any | null>(null);
  const [storeDetailState, setStoreDetailState] = React.useState<'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'not-found'>('loading');
  const [activeStoreItemsState, setActiveStoreItemsState] = React.useState<any[]>([]);
  const [activeCanonicalStoreId, setActiveCanonicalStoreId] = React.useState<string | undefined>(initialCanonicalStore.canonicalStoreId);
  const [activeCanonicalProductId, setActiveCanonicalProductId] = React.useState<string | undefined>(undefined);
  const [, setSelectedItemId] = React.useState<string>('');
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [reorderAlertMessage, setReorderAlertMessage] = React.useState<string | undefined>(undefined);
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('entitlements-get');
  const [serviceDialTrigger, setServiceDialTrigger] = React.useState(0);

  // Active store — computed early so tracking + checkout hooks can receive it
  const activeStore = React.useMemo(
    () => clientVisibleDiscoveryStores.find((store) => store.id === activeStoreId) ?? clientVisibleDiscoveryStores[0] ?? dshDiscoveryStores[0],
    [activeStoreId, clientVisibleDiscoveryStores],
  );

  // Order tracking: selectedOrderId, ordersListState, live polling, timeline, callbacks
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
    route, checkoutAuth, createOrderValues, selectedFulfillmentMode,
    defaultFulfillmentMode, setRoute, setSelectedFulfillmentMode, setCreateOrderValues,
  });

  // When a command drives to tracking, reset to the default order
  React.useEffect(() => {
    if (commandTargetToRoute(command.target) === 'tracking') {
      setSelectedOrderId(defaultTrackingOrderId);
      setTrackingClientState(hostClientStates.trackingActive);
    }
  }, [command, setSelectedOrderId, setTrackingClientState]);


  // â”€â”€ Runtime transport effect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Runs once on mount. When EXPO_PUBLIC_DSH_API_BASE_URL is set:
  //   1. Immediately signals loading state (bridge.state = 'loading').
  //   2. Calls GET /stores via the typed client + HTTP transport.
  //   3. On success: passes the real API response into the bridge â†’ 'ready'/'empty'.
  //   4. On network failure: bridge.state = 'offline'.
  //   5. On HTTP/parse error: bridge.state = 'error'.
  // When no config is set the bridge stays on 'preview-fallback' (initial state).
  React.useEffect(() => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();

    if (!config) {
      // No API base URL configured â€” stay on the preview fallback path.
      return undefined;
    }

    let cancelled = false;

    // Signal loading immediately so the screen renders a skeleton.
    setRuntimeBridge(
      resolveDshDiscoveryStoresBridge({
        previewHomeStores: clientVisibleHomePreviewStores,
        previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
        state: 'loading',
      }),
    );

    const client = createDshDiscoveryStoresClient(config);

    client.listDiscoveryStores().then((response) => {
      if (cancelled) return;
      setRuntimeBridge(
        resolveDshDiscoveryStoresBridge({
          response,
          previewHomeStores: clientVisibleHomePreviewStores,
          previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
        }),
      );
    }).catch((err: unknown) => {
      if (cancelled) return;
      const bridgeState = isDshDiscoveryStoresOfflineError(err) ? 'offline' : 'error';
      setRuntimeBridge(
        resolveDshDiscoveryStoresBridge({
          previewHomeStores: clientVisibleHomePreviewStores,
          previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
          state: bridgeState,
        }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [homeRetryToken]);



  const openCreateOrderJourney = React.useCallback(() => {
    setReorderAlertMessage(undefined);
    setRoute('cart-get');
  }, []);

  const handleReorderClick = React.useCallback((orderId: string) => {
    const order = initialOrders.find((o) => o.id === orderId);
    if (!order) return;

    // 1. Find store matching order title (store name)
    const matchedStore = clientVisibleDiscoveryStores.find((s) => s.name === order.title) ?? clientVisibleDiscoveryStores[0] ?? dshDiscoveryStores[0];
    setActiveStoreId(matchedStore.id);
    setActiveCanonicalStoreId(matchedStore.canonicalStoreId);

    // 2. Fetch products for store
    const storeProducts = storeItemsByStoreId[matchedStore.id] ?? [];

    // 3. Find matches by summary keywords
    const summaryText = order.summary || '';
    const keywords = summaryText.split(/[\s+\u2014\u2022â€¢,]+/);
    let matchedProducts = storeProducts.filter((p) =>
      keywords.some((kw) => kw.length > 1 && (p.name.includes(kw) || (p.subtitle && p.subtitle.includes(kw))))
    );

    // Fallback if no match
    if (matchedProducts.length === 0) {
      matchedProducts = storeProducts.slice(0, 2);
    }

    // 4. Map to cart items
    const newCartItems = matchedProducts.map((p, idx) => ({
      id: p.id,
      title: p.name,
      priceLabel: p.priceLabel,
      qty: idx === 0 ? 1 : 2, // realistic quantities
      storeId: matchedStore.id,
      storeName: matchedStore.name,
      canonicalStoreId: matchedStore.canonicalStoreId,
      publishStage: p.publishStage || 'published-preview',
    }));

    setCartItems(newCartItems);

    // 5. Update order values
    setCreateOrderValues((current) => ({
      ...current,
      fulfillmentMode: order.fulfillmentMode ?? 'bthwani_delivery',
      pickupAddress: order.pickupAddress || matchedStore.name,
      dropoffAddress: order.dropoffAddress || '',
      note: order.note || 'لا توجد ملاحظات',
    }));
    setSelectedFulfillmentMode(order.fulfillmentMode ?? 'bthwani_delivery');

    // 6. Set reorder alert message to notify user
    setReorderAlertMessage('تنبيه: تم نسخ السلة من طلبك السابق وتحديث الأسعار ومطابقتها مباشرة مع المتجر بنجاح.');

    // 7. Route to cart-get
    setRoute('cart-get');
  }, [clientVisibleDiscoveryStores]);


  const handleConfirmedOrderExecution = React.useCallback((payload?: {
    fulfillmentMode?: DshFulfillmentDeliveryMode;
    orderDraft?: Partial<CreateOrderValues>;
    wltPaymentRefId?: string;
  }) => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (config && cartItems.length > 0) {
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + parsePrice(item.priceLabel) * item.qty,
        0
      );

      const items: DshOrderItemInput[] = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        price: parsePrice(item.priceLabel),
      }));

      const orderClient = createDshOrderLifecycleHttpClient(config.baseUrl, undefined, checkoutAuth);
      orderClient.createOrder({
        store_id: activeStore.id,
        client_id: checkoutAuth.clientId ?? 'client-101',
        total_price: totalPrice,
        wlt_payment_ref_id: payload?.wltPaymentRefId,
        items,
      }).then((resp) => {
        const liveOrder = resp.order;
        const nextOrderSummary: HostOrderSummary = {
          id: liveOrder.id,
          title: activeStore.name,
          subtitle: activeStore.subtitle || activeStore.name,
          statusLabel: 'مباشر',
          meta: `التوصيل Â· ${totalPrice} ر.ي`,
          clientState: hostClientStates.trackingActive,
          fulfillmentMode: (payload?.fulfillmentMode ?? selectedFulfillmentMode) as DshFulfillmentDeliveryMode,
          pickupAddress: activeStore.name,
          dropoffAddress: payload?.orderDraft?.dropoffAddress || '',
          note: payload?.orderDraft?.note || 'تم الإنشاء برمجياً',
          orderNumber: liveOrder.id.replace('ord-', '').slice(0, 8),
          summary: cartItems.map(item => `${item.qty}x ${item.title}`).join(' ، '),
          total: `${totalPrice} ر.ي`,
        };

        setOrdersListState((current) => [nextOrderSummary, ...current]);
        setSelectedOrderId(liveOrder.id);
        setTrackingClientState(hostClientStates.trackingActive);
        setTrackingOrderOverride(null);
        setCreateOrderValues((current) => ({
          ...current,
          fulfillmentMode: nextOrderSummary.fulfillmentMode,
          dropoffAddress: nextOrderSummary.dropoffAddress,
          note: nextOrderSummary.note,
        }));
        setSelectedFulfillmentMode(nextOrderSummary.fulfillmentMode);
        setCartItems([]);
        setRoute('tracking');
      }).catch((err) => {
        console.error("Failed to place live order:", err);
        openTrackedOrder(undefined, {
          fulfillmentMode: payload?.fulfillmentMode ?? payload?.orderDraft?.fulfillmentMode ?? selectedFulfillmentMode,
          orderDraft: payload?.orderDraft,
        });
      });
    } else {
      openTrackedOrder(undefined, {
        fulfillmentMode: payload?.fulfillmentMode ?? payload?.orderDraft?.fulfillmentMode ?? selectedFulfillmentMode,
        orderDraft: payload?.orderDraft,
      });
    }
  }, [checkoutAuth, openTrackedOrder, selectedFulfillmentMode, cartItems, activeStore,
    setOrdersListState, setSelectedOrderId, setTrackingClientState, setTrackingOrderOverride,
    setCreateOrderValues, setSelectedFulfillmentMode, setCartItems, setRoute]);

  // Payment state, wallet intent, checkout confirmation
  const {
    selectedPaymentMethod, setSelectedPaymentMethod,
    checkoutState, setCheckoutState,
    paymentErrorMessage,
    checkoutIntentId, setCheckoutIntentId,
    checkoutClientMemo,
    handleConfirmCheckout,
  } = useDshCheckout({
    cartItems, activeStore, selectedFulfillmentMode, checkoutAuth, walletPreview,
    createOrderValues, onOrderExecute: handleConfirmedOrderExecution,
  });

  const fetchStoreDetail = React.useCallback((storeId: string, store: typeof dshDiscoveryStores[number]) => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) {
      setActiveStoreDetail({
        id: store.id,
        name: store.name,
        address: store.subtitle,
        category_id: undefined,
        image_url: store.imageUri,
        logo_image_url: store.logoImageUri,
        rating: store.rating,
        distance_label: store.distanceKm ? `${store.distanceKm} كم` : '0 كم',
        delivery_label: store.deliveryLabel,
        service_label: store.serviceLabel,
        status_label: store.statusLabel,
        status_tone: store.statusLabel?.includes('مغلق') ? 'closed' : 'open',
        has_offer: store.isOffer,
        offer_label: store.offerLabel,
        publish_stage: store.publishStage || 'published-preview',
        contact_number: store.id === 'store-1001' ? '+967-1-444333' : store.id === 'store-1002' ? '+967-1-555666' : store.id === 'store-1003' ? '+967-1-777888' : '+967-1-999000',
        opening_hours: store.id === 'store-1001' ? '08:00 - 23:00' : store.id === 'store-1002' ? '06:00 - 22:00' : store.id === 'store-1003' ? '09:00 - 21:00' : '16:00 - 02:00',
        catalog_summary: store.id === 'store-1001' ? 'Over 1,200 fresh groceries and daily essentials' : store.id === 'store-1002' ? 'Fresh bread, cakes, and pastries baked daily' : store.id === 'store-1003' ? 'Convenient local grocery staples and snacks' : 'Late-night snacks, soft drinks, and convenience items',
        partner_readiness_status: 'ready',
        catalog_quality_status: 'approved',
        catalog_pricing_status: 'approved',
        marketing_visibility_status: 'active',
      });
      setActiveStoreItemsState([]);
      setStoreDetailState('ready');
      return () => {};
    }

    setStoreDetailState('loading');
    let cancelled = false;

    const client = createDshDiscoveryStoresClient(config);
    const prodClient = createDshProductApiHttpClient(config.baseUrl);

    Promise.all([
      client.getDiscoveryStore(storeId),
      prodClient.listProducts(storeId, { limit: 100 })
    ]).then(([storeResp, productsResp]) => {
      if (cancelled) return;
      setActiveStoreDetail(storeResp);

      const mappedItems = (productsResp.products || []).map((p: any) => {
        const isAvailable = p.available_override !== false;
        let clientVisibilityStatus: 'visible' | 'unavailable' | 'hidden' | 'removed' = 'hidden';
        if (p.approval_status === 'catalog_adopted' || p.approval_status === 'client_visible') {
          clientVisibilityStatus = isAvailable ? 'visible' : 'unavailable';
        } else if (p.approval_status === 'rejected') {
          clientVisibilityStatus = 'removed';
        } else {
          clientVisibilityStatus = 'hidden';
        }
        return {
          id: p.id,
          name: p.name,
          subtitle: p.description || '',
          priceLabel: p.price_override || p.base_price_label,
          categoryId: p.category_id || 'general',
          categoryLabel: p.category_id === 'grocery' || p.category_id === 'fresh' ? 'بقالة' : p.category_id === 'bakery' ? 'مخبوزات' : 'عام',
          isAvailable,
          clientVisibilityStatus,
          publishStage: (p.approval_status || '').replace(/_/g, '-') as any,
        };
      });

      setActiveStoreItemsState(mappedItems);
      setStoreDetailState('ready');
    }).catch((err) => {
      if (cancelled) return;
      let detailErrorState: 'offline' | 'not-found' | 'error' = 'error';
      if (isDshDiscoveryStoresOfflineError(err) || (typeof err === 'object' && err !== null && (err as any).kind === 'offline')) {
        detailErrorState = 'offline';
      } else if (typeof err === 'object' && err !== null && (err as any).kind === 'http' && (err as any).status === 404) {
        detailErrorState = 'not-found';
      }
      setStoreDetailState(detailErrorState);
    });

    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (route !== 'store-get') return undefined;
    if (!activeStoreId) return undefined;
    return fetchStoreDetail(activeStoreId, activeStore);
  }, [activeStoreId, route, activeStore, fetchStoreDetail]);

  const activeStoreItems = React.useMemo(() => activeStoreItemsState.length > 0 ? activeStoreItemsState : (storeItemsByStoreId[activeStore.id] ?? []), [activeStoreItemsState, activeStore.id]);
  const activeStoreCategories = React.useMemo(() => buildStoreCategories(activeStoreItems), [activeStoreItems]);
  const activeStoreDeliveryModes = React.useMemo(() => buildStoreDeliveryModes(activeStore), [activeStore]);
  const activeStoreTags = React.useMemo(() => buildStoreTags(activeStore), [activeStore]);

  const activeStoreScreenStore = React.useMemo(() => {
    const s = activeStoreDetail || activeStore;
    const tags = activeStoreDetail ? buildStoreTags({
      id: s.id,
      name: s.name,
      subtitle: s.address || '',
      statusLabel: s.status_label || '',
      meta: s.delivery_label || '',
      etaMinutes: 0,
      distanceKm: Number.parseFloat(s.distance_label) || 0,
      rating: s.rating ?? 0,
      isOffer: s.has_offer || false,
      isFavorite: false,
      isFollowing: false,
      imageUri: s.image_url || '',
      deliveryLabel: s.delivery_label || '',
      serviceLabel: s.service_label || '',
      followerCount: 0,
      multiplierLabel: 'x1',
      subscriptionPackageChips: [],
      offerLabel: s.offer_label || '',
      hasBthwaniPro: false,
      hasNewProducts: false,
      hasCouponAvailable: false,
      supportsPickup: s.supports_pickup || false,
      supportsPartnerDelivery: s.supports_partner_delivery || false,
      publishStage: s.publish_stage || '',
      logoImageUri: s.logo_image_url || '',
    } as any) : activeStoreTags;

    const deliveryModes = activeStoreDetail ? buildStoreDeliveryModes({
      meta: s.delivery_label || '',
      supportsPickup: s.supports_pickup || false,
      supportsPartnerDelivery: s.supports_partner_delivery || false,
    }) : activeStoreDeliveryModes;

    return {
      id: s.id,
      name: s.name,
      subtitle: s.address || s.subtitle || '',
      statusLabel: s.status_label || s.statusLabel || '',
      etaLabel: s.delivery_label || s.meta || s.etaLabel || '',
      deliveryFeeLabel: s.deliveryFeeLabel ?? 'رسوم التوصيل 12 ر.ي',
      followersCount: s.followerCount || 0,
      priceMatchLabel: s.priceMatchLabel ?? 'الأسعار مطابقة للمطعم',
      imageUri: s.image_url || s.imageUri || '',
      deliveryLabel: s.delivery_label || s.deliveryLabel || '',
      serviceLabel: s.service_label || s.serviceLabel || '',
      subscriptionPackageChips: s.subscriptionPackageChips || [],
      hasBthwaniPro: s.hasBthwaniPro || false,
      tags: tags,
      categories: activeStoreCategories,
      deliveryModes: deliveryModes,
      contactNumber: s.contact_number || s.contactNumber || '',
      openingHours: s.opening_hours || s.openingHours || '',
      catalogSummary: s.catalog_summary || s.catalogSummary || '',
    };
  }, [activeStoreDetail, activeStore, activeStoreTags, activeStoreDeliveryModes, activeStoreCategories]);

  const addItemToHostCart = React.useCallback((
    item: HostCartItem & { name?: string },
    _payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string },
  ) => {
    setReorderAlertMessage(undefined);
    const normalizedQty = Number.isFinite(_payload?.quantity) && (_payload?.quantity ?? 0) > 0 ? Number(_payload?.quantity) : 1;
    const nextTitle = item.name?.trim() || item.title?.trim() || item.id;
    const canonicalMetadata: HostCanonicalMetadata = {
      canonicalStoreId: item.canonicalStoreId ?? activeCanonicalStoreId ?? activeStore.canonicalStoreId,
      canonicalProductId: item.canonicalProductId ?? activeCanonicalProductId,
      sourceRecordId: item.sourceRecordId ?? activeStore.sourceRecordId,
      publishStage: item.publishStage ?? activeStore.publishStage,
    };
    const nextFulfillmentMode = isDshFulfillmentDeliveryMode(_payload?.deliveryMode)
      ? _payload.deliveryMode
      : defaultFulfillmentMode;
    const storePickupAddress = resolveStorePickupAddress(activeStore);

    setActiveCanonicalStoreId(canonicalMetadata.canonicalStoreId);
    setActiveCanonicalProductId(canonicalMetadata.canonicalProductId);
    setSelectedFulfillmentMode(nextFulfillmentMode);
    setCreateOrderValues((currentValues) => ({
      ...currentValues,
      fulfillmentMode: nextFulfillmentMode,
      pickupAddress: storePickupAddress,
      dropoffAddress: nextFulfillmentMode === 'pickup' ? '' : currentValues.dropoffAddress,
    }));

    setCartItems((current) => {
      const existingIndex = current.findIndex((entry) => entry.id === item.id && entry.storeId === activeStore.id);
      if (existingIndex === -1) {
        return [
          ...current,
          {
            id: item.id,
            title: nextTitle,
            priceLabel: item.priceLabel,
            qty: normalizedQty,
            storeId: activeStore.id,
            storeName: activeStore.name,
            canonicalStoreId: canonicalMetadata.canonicalStoreId,
            canonicalProductId: canonicalMetadata.canonicalProductId,
            sourceRecordId: canonicalMetadata.sourceRecordId,
            publishStage: canonicalMetadata.publishStage,
          },
        ];
      }

      return current.map((entry, index) => (
        index === existingIndex
          ? {
              ...entry,
              qty: entry.qty + normalizedQty,
              canonicalStoreId: entry.canonicalStoreId ?? canonicalMetadata.canonicalStoreId,
              canonicalProductId: entry.canonicalProductId ?? canonicalMetadata.canonicalProductId,
              sourceRecordId: entry.sourceRecordId ?? canonicalMetadata.sourceRecordId,
              publishStage: entry.publishStage ?? canonicalMetadata.publishStage,
            }
          : entry
      ));
    });
  }, [activeCanonicalProductId, activeCanonicalStoreId, activeStore, defaultFulfillmentMode]);

  const liveMarketingPrograms = React.useMemo(() => getLiveMarketingGrowthItems('client'), []);
  const liveMarketingShorts = React.useMemo(
    () => liveMarketingPrograms
      .filter((item) => item.family === 'shorts')
      .filter(isMarketingGrowthRouteValid),
    [isMarketingGrowthRouteValid, liveMarketingPrograms],
  );
  const homeMarketingPromos = React.useMemo(() => getPublishedMarketingHomePromos('home') as DshHomeGetPromo[], []);
  const homePromos = React.useMemo(() => getPublishedHomePromos(), []);
  const homeRecentOrders = React.useMemo(() => [
    {
      id: 'home-recent-order-1',
      storeId: clientVisibleHomeStores[0]?.id ?? 'store-1001',
      title: 'الطلب النشط',
      subtitle: clientVisibleHomeStores[0]?.name ?? 'مطعم القلعة',
      meta: `${clientVisibleHomeStores[0]?.distanceLabel ?? '2.1 كم'} Â· ${clientVisibleHomeStores[0]?.deliveryLabel ?? 'توصيل مجاني'}`,
      statusLabel: clientVisibleHomeStores[0]?.statusTone === 'open' ? 'مباشر' : 'مغلق',
    },
    {
      id: 'home-recent-order-2',
      storeId: clientVisibleHomeStores[1]?.id ?? 'store-1002',
      title: 'آخر طلب',
      subtitle: clientVisibleHomeStores[1]?.name ?? 'مطاعم الأرض الخضراء',
      meta: `${clientVisibleHomeStores[1]?.distanceLabel ?? '1.8 كم'} Â· ${clientVisibleHomeStores[1]?.serviceLabel ?? 'توصيل برو'}`,
      statusLabel: clientVisibleHomeStores[1]?.statusTone === 'open' ? 'مباشر' : 'مغلق',
    },
  ], [clientVisibleHomeStores]);

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

  const handleOpenActiveStoreItems = React.useCallback(() => {
    setStoreItemsEntryOrigin('store-get');
    setRoute('store-items');
  }, []);

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
  }, [activeStore, selectedFulfillmentMode]);

  const handleToggleHomeFavorite = React.useCallback((storeId: string) => {
    const currentStore = clientVisibleHomeStores.find((s) => s.id === storeId) || clientVisibleDiscoveryStores.find((s) => s.id === storeId);
    const currentVal = favoriteOverrides[storeId] ?? currentStore?.isFavorite ?? false;
    setFavoriteOverrides((previous) => ({
      ...previous,
      [storeId]: !currentVal,
    }));
  }, [clientVisibleDiscoveryStores, clientVisibleHomeStores, favoriteOverrides]);

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
  }, [isAwnakEnabled]);

  const handleOpenHomeStoreCategory = React.useCallback((storeId: string, categoryId: string) => {
    const nextStoreMetadata = getStoreCanonicalMetadata(storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(nextStoreMetadata.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setItemsCategory(categoryId);
    setStoreItemsEntryOrigin('home');
    setRoute('store-items');
  }, [getStoreCanonicalMetadata]);

  const handleOpenHomeProduct = React.useCallback((storeId: string, itemId: string) => {
    const nextProductMetadata = getProductCanonicalMetadata(storeId, itemId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(nextProductMetadata.canonicalStoreId);
    setActiveCanonicalProductId(nextProductMetadata.canonicalProductId);
    setSelectedItemId(itemId);
    setRoute('cart-get');
  }, [getProductCanonicalMetadata]);

  const handleOpenHomeBenefits = React.useCallback((screenId?: string) => {
    setSelectedOperationScreen(screenId as ClientOperationScreenId);
    setRoute('benefits');
  }, []);

  const handleOpenHomeStore = React.useCallback((storeId: string) => {
    if (!hasStoreTarget(storeId)) {
      return;
    }
    const nextStoreMetadata = getStoreCanonicalMetadata(storeId);
    setActiveStoreId(storeId);
    setActiveCanonicalStoreId(nextStoreMetadata.canonicalStoreId);
    setActiveCanonicalProductId(undefined);
    setItemsQuery('');
    setItemsCategory('all');
    setSelectedItemId('');
    setRoute('store-get');
  }, [getStoreCanonicalMetadata, hasStoreTarget]);

  const handleClientBottomNavSelect = React.useCallback((id: string) => {
    if (id === 'favorites') setRoute('home');
    if (id === 'orders') setRoute('orders-list');
    if (id === 'wallet') setRoute('wlt-home');
    if (id === 'profile') setRoute('my-space');
  }, []);

  const handleServiceLauncherPress = React.useCallback(() => {
    setServiceDialTrigger((token) => token + 1);
  }, []);


  const missing = importedScreens.filter(([, v]) => typeof v === 'undefined').map(([n]) => String(n));
  if (missing.length > 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: colorPalette.brandStrong, fontSize: 18, fontWeight: '700', marginBottom: 12 }}>مكوّنات مفقودة</Text>
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

    const paymentMethods = [
      { id: 'wallet', label: `المحفظة (الرصيد: ${formattedBalance})`, icon: 'wallet-outline', isSelected: selectedPaymentMethod === 'wallet' },
      { id: 'cod', label: 'الدفع عند الاستلام (COD)', icon: 'cash-outline', isSelected: selectedPaymentMethod === 'cod' },
    ];

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

    return (
      <DshCartGetScreen
        clientState={cartClientState}
        fulfillmentMode={selectedFulfillmentMode}
        reorderAlertMessage={reorderAlertMessage}
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
        onOpenOrder={async () => {
          setCheckoutIntentId(null);
          setRoute('checkout-intent');
        }}
        onContinue={async () => {
          setCheckoutIntentId(null);
          setRoute('checkout-intent');
        }}
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
        onOpenTracking={reopenTracking}
        onOpenOrders={() => setRoute('orders-list')}
        onBack={reopenTracking}
        onRetry={() => setRoute('bell')}
      />
    );
  }

  const bottomNavActiveId: 'favorites' | 'orders' | 'wallet' | 'profile' =
    route === 'orders-list' ? 'orders'
    : route === 'wlt-home' ? 'wallet'
    : route === 'my-space' ? 'profile'
    : 'favorites';

  const clientBottomNavBar = (
    <BottomNavBar
      activeId={bottomNavActiveId}
      direction="rtl"
      launcherLabel="الخدمات"
      launcherIcon="grid"
      onLauncherPress={handleServiceLauncherPress}
      onSelect={handleClientBottomNavSelect}
      items={CLIENT_BOTTOM_NAV_ITEMS}
    />
  );

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
        <DshHomeGetScreen
          state={clientDiscoveryStoresBridge.state}
          serviceDialTrigger={serviceDialTrigger}
          favoriteOverrides={favoriteOverrides}
      onToggleFavorite={handleToggleHomeFavorite}
      categories={dshCategoryListFixtures as DshHomeCategory[]}
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
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        {clientBottomNavBar}
      </View>
    </View>
  );
}

export { DshClientSurface as DshSurfaceHost };
