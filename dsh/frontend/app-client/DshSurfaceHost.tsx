import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { Surface, Text, colorPalette } from '@bthwani/ui-kit';
import { DshSearchScreen } from './DshSearchScreen';
import { DshEntryScreen } from './DshEntryScreen';
import { DshClientBellScreen } from './DshClientBellScreen';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './DshHomeGetScreen';
import { DshMySpaceScreen } from './DshMySpaceScreen';
import { DshNotificationsScreen } from './DshNotificationsScreen';
import { DshBenefitsHubScreen } from './DshBenefitsHubScreen';
import { DshOrdersListScreen, DshTrackingScreen } from './checkoutTracking';
import { DshStoreGetScreen } from './DshStoreGetScreen';
import { DshStoreItemsScreen } from './DshStoreItemsScreen';
import { DshFavoriteToggleScreen } from './DshFavoriteToggleScreen';
import { DshFavoritesListScreen } from './DshFavoritesListScreen';
import { DshCartGetScreen } from './DshCartUnifiedScreen';
import { type ClientOperationScreenId, DshConversationHubScreen, DshOrderIssueHubScreen, DshProxyHubScreen, DshServiceSettingsHubScreen, DshZoneSetScreen, DshListingStatusUpdateScreen } from './DshClientOperationScreens';
import type { DshHomeApprovedVideoReelsViewerProps } from './DshHomeApprovedVideoReelsViewer';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
} from './dshHomeGetFixtures';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshDiscoveryStores,
  storeItemsByStoreId,
} from './storeFixtures';
import {
  getPublishedMarketingHomePromos,
  recordMarketingBannerClick,
  recordMarketingBannerImpression,
} from '../shared/banner-store';
import {
  getLiveMarketingGrowthItems,
  recordMarketingGrowthClick,
  recordMarketingGrowthImpression,
  type MarketingGrowthRecord,
} from '../shared/growth-store';
import { getDshClientStateMeta, type DshClientState } from './dshClientStateModel';
// checkout and tracking routes are consolidated in checkoutTracking
import { dshCategoryFixtures, dshCategoryListFixtures, getDshCategoryFixture } from './dshCategoriesFixtures';
import { dshPartnerIntakeItems } from '../shared/workflow';

export type DshRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'notifications'
  | 'store-items'
  | 'cart-get'
  | 'favorite-toggle'
  | 'favorites-list'
  | 'search'
  | 'store-get'
  | 'bell'
  | 'benefits'
  | 'conversation-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'service-settings'
  | 'zone-set'
  | 'orders-list'
  | 'tracking';

export type DshCommandTarget = 'home' | 'orders-list' | 'tracking' | 'bell' | 'create-order' | 'cart-get';

type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
};

type DshSurfaceHostProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
  renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
};

type CreateOrderValues = {
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note: string;
};

type HostOrderSummary = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  clientState: DshClientState;
};

type HostCartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  qty: number;
  storeId: string;
  storeName: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
};

type HostCanonicalMetadata = {
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
};

type HostCartInputItem = {
  id: string;
  name?: string;
  title?: string;
  priceLabel?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
};

type PublishedCategoryItem = {
  id: string;
  label: string;
  subtitle: string;
  renderMode?: 'stores' | 'manual-order';
  countLabel: string;
};

const publishedCategoryIds = new Set(
  dshPartnerIntakeItems
    .filter((item) => item.stage === 'published')
    .map((item) => dshCategoryFixtures.find((category) => category.label === item.categoryLabel)?.id)
    .filter((categoryId): categoryId is string => Boolean(categoryId)),
);

const publishedCategoryFixtures = dshCategoryFixtures.filter((category) => publishedCategoryIds.has(category.id));

const publishedCategoryListFixtures: PublishedCategoryItem[] = dshCategoryListFixtures;

const publishedPromoCategoryIds = new Set(publishedCategoryFixtures.map((category) => category.id));

function hasStoreTarget(storeId?: string) {
  return typeof storeId === 'string' && dshDiscoveryStores.some((store) => store.id === storeId);
}

function hasStoreCategoryTarget(storeId?: string, categoryId?: string) {
  if (!hasStoreTarget(storeId) || typeof categoryId !== 'string') {
    return false;
  }

  return (storeItemsByStoreId[storeId] ?? []).some((item) => item.categoryId === categoryId);
}

function hasProductTarget(storeId?: string, productId?: string) {
  if (!hasStoreTarget(storeId) || typeof productId !== 'string') {
    return false;
  }

  return (storeItemsByStoreId[storeId] ?? []).some((item) => item.id === productId);
}

function isMarketingGrowthRouteValid(item: MarketingGrowthRecord): boolean {
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
}

function getStoreCanonicalMetadata(storeId: string): HostCanonicalMetadata {
  const store = dshDiscoveryStores.find((entry) => entry.id === storeId);
  return {
    canonicalStoreId: store?.canonicalStoreId,
    sourceRecordId: store?.sourceRecordId,
    publishStage: store?.publishStage,
  };
}

function getProductCanonicalMetadata(storeId: string, productId: string): HostCanonicalMetadata {
  const storeMetadata = getStoreCanonicalMetadata(storeId);
  const product = (storeItemsByStoreId[storeId] ?? []).find((entry) => entry.id === productId);

  return {
    canonicalStoreId: product?.canonicalStoreId ?? storeMetadata.canonicalStoreId,
    canonicalProductId: product?.canonicalProductId,
    sourceRecordId: product?.sourceRecordId ?? storeMetadata.sourceRecordId,
    publishStage: product?.publishStage ?? storeMetadata.publishStage,
  };
}

function resolvePublishedHomePromos() {
  const applyPublishingRules = (promos: DshHomeGetPromo[]) => promos.filter((promo) => {
    if (promo.actionType === 'main_category' || promo.actionType === 'sub_category') {
      return promo.actionTarget ? publishedPromoCategoryIds.has(promo.actionTarget) : false;
    }

    if (promo.actionType === 'store') {
      return hasStoreTarget(promo.actionTarget);
    }

    if (promo.actionType === 'store_category') {
      return hasStoreCategoryTarget(promo.actionTarget, promo.actionExtra);
    }

    if (promo.actionType === 'product') {
      return hasProductTarget(promo.actionExtra, promo.actionTarget);
    }

    return true;
  });

  const marketingPromos = applyPublishingRules(getPublishedMarketingHomePromos('all') as DshHomeGetPromo[]);
  if (marketingPromos.length > 0) {
    return marketingPromos;
  }

  return applyPublishingRules(dshHomeGetFixturePromos as DshHomeGetPromo[]);
}

const initialCreateOrderValues: CreateOrderValues = {
  pickupAddress: 'رياض بارك، البوابة 2',
  dropoffAddress: 'العليا، طريق الملك فهد',
  contactName: 'أحمد',
  contactPhone: '770000000',
  note: 'لا توجد ملاحظات',
};

const hostClientStates = {
  quote: 'quote',
  serviceability: 'serviceability',
  areaUnserviceable: 'area_unserviceable',
  cartEmpty: 'cart_empty',
  cartReady: 'cart_ready',
  checkoutReady: 'checkout_ready',
  paymentPending: 'payment_pending',
  paymentFailed: 'payment_failed',
  itemUnavailable: 'item_unavailable',
  orderCreated: 'order_created',
  orderConfirmed: 'order_confirmed',
  trackingActive: 'tracking_active',
  delivered: 'delivered',
  cancelled: 'cancelled',
  failed: 'failed',
  refundPending: 'refund_pending',
  refunded: 'refunded',
  supportRequired: 'support_required',
  walletCreditVisible: 'wallet_credit_visible',
  walletRefundVisible: 'wallet_refund_visible',
} as const;

const initialOrders: HostOrderSummary[] = [
  {
    id: 'dsh-10021',
    title: 'طلب #10021',
    subtitle: 'من حدة إلى باب اليمن',
    statusLabel: getDshClientStateMeta(hostClientStates.trackingActive).label,
    meta: 'الوصول المتوقع خلال 18 دقيقة',
    clientState: hostClientStates.trackingActive,
  },
  {
    id: 'dsh-10019',
    title: 'طلب #10019',
    subtitle: 'من السبعين إلى التحرير',
    statusLabel: getDshClientStateMeta(hostClientStates.delivered).label,
    meta: 'اليوم 03:10 م',
    clientState: hostClientStates.delivered,
  },
  {
    id: 'dsh-10017',
    title: 'طلب #10017',
    subtitle: 'من شميلة إلى التحرير',
    statusLabel: getDshClientStateMeta(hostClientStates.cancelled).label,
    meta: 'تم الإلغاء مع توضيح سبب الحالة',
    clientState: hostClientStates.cancelled,
  },
  {
    id: 'dsh-10016',
    title: 'طلب #10016',
    subtitle: 'من مذبح إلى باب السلام',
    statusLabel: getDshClientStateMeta(hostClientStates.failed).label,
    meta: 'توجد حاجة إلى مسار تعافٍ أو دعم واضح',
    clientState: hostClientStates.failed,
  },
  {
    id: 'dsh-10015',
    title: 'طلب #10015',
    subtitle: 'من السنينة إلى سعوان',
    statusLabel: getDshClientStateMeta(hostClientStates.refundPending).label,
    meta: 'الاسترداد ما يزال قيد المعالجة',
    clientState: hostClientStates.refundPending,
  },
  {
    id: 'dsh-10014',
    title: 'طلب #10014',
    subtitle: 'من التحرير إلى الجامعة',
    statusLabel: getDshClientStateMeta(hostClientStates.refunded).label,
    meta: 'تم تثبيت الأثر المالي النهائي للطلب',
    clientState: hostClientStates.refunded,
  },
  {
    id: 'dsh-10013',
    title: 'طلب #10013',
    subtitle: 'من الحصبة إلى بيت بوس',
    statusLabel: getDshClientStateMeta(hostClientStates.supportRequired).label,
    meta: 'هذه الحالة تحتاج متابعة دعم واضحة',
    clientState: hostClientStates.supportRequired,
  },
  {
    id: 'dsh-10012',
    title: 'طلب #10012',
    subtitle: 'من فج عطان إلى السبعين',
    statusLabel: getDshClientStateMeta(hostClientStates.walletCreditVisible).label,
    meta: 'يوجد رصيد ظاهر للعميل داخل المحفظة',
    clientState: hostClientStates.walletCreditVisible,
  },
  {
    id: 'dsh-10011',
    title: 'طلب #10011',
    subtitle: 'من باب اليمن إلى حدة',
    statusLabel: getDshClientStateMeta(hostClientStates.walletRefundVisible).label,
    meta: 'تظهر معلومة الاسترداد المالي ضمن المسار',
    clientState: hostClientStates.walletRefundVisible,
  },
];

const defaultTrackingOrderId = initialOrders[0]?.id ?? 'dsh-10021';

function commandTargetToRoute(target: DshCommandTarget): DshRoute {
  switch (target) {
    case 'cart-get':
      return 'cart-get';
    case 'orders-list':
      return 'orders-list';
    case 'tracking':
      return 'tracking';
    case 'bell':
      return 'bell';
    case 'create-order':
      return 'cart-get';
    default:
      return 'orders-list';
  }
}

export function DshSurfaceHost({ command, onExit, onOpenService, renderApprovedVideoReelsViewer }: DshSurfaceHostProps) {
  const initialCanonicalStore = getStoreCanonicalMetadata('store-1001');
  const [route, setRoute] = React.useState<DshRoute>('home');
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<HostCartItem[]>([]);
  const [createOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [trackingClientState, setTrackingClientState] = React.useState<DshClientState>(hostClientStates.trackingActive);
  const [ordersQuery, setOrdersQuery] = React.useState('');
  const [storesQuery, setStoresQuery] = React.useState('');
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [activeCanonicalStoreId, setActiveCanonicalStoreId] = React.useState<string | undefined>(initialCanonicalStore.canonicalStoreId);
  const [activeCanonicalProductId, setActiveCanonicalProductId] = React.useState<string | undefined>(undefined);
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(defaultTrackingOrderId);
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('entitlements-get');
  const routeHistoryRef = React.useRef<DshRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);

  React.useEffect(() => {
    const nextRoute = commandTargetToRoute(command.target);

    if (nextRoute === 'tracking') {
      setSelectedOrderId(defaultTrackingOrderId);
      setTrackingClientState(hostClientStates.trackingActive);
    }

    setRoute(nextRoute);
  }, [command]);

  React.useEffect(() => {
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1];

    if (route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
        setRoute(previousRoute);
        return true;
      }

      if (onExit) {
        onExit();
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [onExit]);

  const filteredOrders = React.useMemo(() => {
    const query = ordersQuery.trim().toLowerCase();
    if (!query) {
      return initialOrders;
    }

    return initialOrders.filter((order) => {
      const haystack = `${order.title} ${order.subtitle} ${order.statusLabel} ${order.meta}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [ordersQuery]);

  const filteredSearchStores = React.useMemo(() => {
    const query = storesQuery.trim().toLowerCase();
    if (!query) {
      return dshDiscoveryStores;
    }

    return dshDiscoveryStores.filter((store) => {
      const haystack = `${store.name} ${store.subtitle} ${store.statusLabel} ${store.meta}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [storesQuery]);

  const activeTrackedOrder = React.useMemo(
    () => initialOrders.find((order) => order.id === selectedOrderId) ?? initialOrders[0],
    [selectedOrderId],
  );

  const trackingTimeline = React.useMemo(
    () => [
      { id: 'route', title: 'في الطريق', detail: 'الطلب متجه إلى العميل الآن.', done: true },
      { id: 'arrived', title: 'وصل للعميل', detail: 'الطلب وصل إلى العميل وهو بانتظار الاستلام.', done: false },
      { id: 'received', title: 'استلم العميل الطلب', detail: 'بعد الاستلام تظهر تقييمات المنتج والكابتن.', done: false },
    ],
    [],
  );

  const openCreateOrderJourney = React.useCallback(() => {
    setRoute('cart-get');
  }, []);

  const openTrackedOrder = React.useCallback((orderId?: string) => {
    const nextOrder = initialOrders.find((order) => order.id === orderId) ?? initialOrders[0];

    setSelectedOrderId(nextOrder.id);
    setTrackingClientState(hostClientStates.trackingActive);
    setRoute('tracking');
  }, []);

  const openSupportFlow = React.useCallback(() => {
    setSelectedOperationScreen('order-issue-flag');
    setRoute('order-issue-workspace');
  }, []);

  const returnHome = React.useCallback(() => {
    setRoute('home');
  }, []);

  const returnOrdersList = React.useCallback(() => {
    setRoute('orders-list');
  }, []);

  const handleConfirmedOrderExecution = React.useCallback(() => {
    openTrackedOrder();
  }, [openTrackedOrder]);

  const activeStore = React.useMemo(
    () => dshDiscoveryStores.find((store) => store.id === activeStoreId) ?? dshDiscoveryStores[0],
    [activeStoreId],
  );

  const activeStoreItems = React.useMemo(() => storeItemsByStoreId[activeStore.id] ?? [], [activeStore.id]);

  const activeStoreCategories = React.useMemo(() => buildStoreCategories(activeStoreItems), [activeStoreItems]);

  const activeStoreDeliveryModes = React.useMemo(() => buildStoreDeliveryModes(activeStore.meta), [activeStore.meta]);

  const activeStoreTags = React.useMemo(() => buildStoreTags(activeStore), [activeStore]);

  const selectedItem = React.useMemo(
    () => activeStoreItems.find((item) => item.id === selectedItemId) ?? activeStoreItems[0],
    [activeStoreItems, selectedItemId],
  );

  const addItemToHostCart = React.useCallback((
    item: HostCartInputItem,
    payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string },
  ) => {
    const normalizedQty = Number.isFinite(payload?.quantity) && (payload?.quantity ?? 0) > 0 ? Number(payload?.quantity) : 1;
    const nextTitle = item.name?.trim() || item.title?.trim() || item.id;
    const canonicalMetadata: HostCanonicalMetadata = {
      canonicalStoreId: item.canonicalStoreId ?? activeCanonicalStoreId ?? activeStore.canonicalStoreId,
      canonicalProductId: item.canonicalProductId ?? activeCanonicalProductId,
      sourceRecordId: item.sourceRecordId ?? activeStore.sourceRecordId,
      publishStage: item.publishStage ?? activeStore.publishStage,
    };

    setActiveCanonicalStoreId(canonicalMetadata.canonicalStoreId);
    setActiveCanonicalProductId(canonicalMetadata.canonicalProductId);

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
  }, [activeCanonicalProductId, activeCanonicalStoreId, activeStore]);

  const liveMarketingPrograms = getLiveMarketingGrowthItems('client');
  const liveMarketingShorts = liveMarketingPrograms
    .filter((item) => item.family === 'shorts')
    .filter(isMarketingGrowthRouteValid);
  const subscriptionMarketingProgram = liveMarketingPrograms.find((item) => item.family === 'subscription');
  const promoMarketingProgram = liveMarketingPrograms.find((item) => item.family === 'promotion');
  const campaignMarketingProgram = liveMarketingPrograms.find((item) => item.family === 'campaign');

  // Sanity check: if any imported screen component is undefined, show a clear error
  const importedScreens: Array<[string, unknown]> = [
    ['DshSearchScreen', DshSearchScreen as unknown],
    ['DshEntryScreen', DshEntryScreen as unknown],
    ['DshHomeGetScreen', DshHomeGetScreen as unknown],
    ['DshMySpaceScreen', DshMySpaceScreen as unknown],
    ['DshNotificationsScreen', DshNotificationsScreen as unknown],
    ['DshBenefitsHubScreen', DshBenefitsHubScreen as unknown],
    ['DshOrdersListScreen', DshOrdersListScreen as unknown],
    ['DshTrackingScreen', DshTrackingScreen as unknown],
    ['DshStoreGetScreen', DshStoreGetScreen as unknown],
    ['DshStoreItemsScreen', DshStoreItemsScreen as unknown],
    ['DshFavoriteToggleScreen', DshFavoriteToggleScreen as unknown],
    ['DshFavoritesListScreen', DshFavoritesListScreen as unknown],
    ['DshClientBellScreen', DshClientBellScreen as unknown],
    ['DshCartGetScreen', DshCartGetScreen as unknown],
    ['DshConversationHubScreen', DshConversationHubScreen as unknown],
    ['DshOrderIssueHubScreen', DshOrderIssueHubScreen as unknown],
    ['DshProxyHubScreen', DshProxyHubScreen as unknown],
    ['DshServiceSettingsHubScreen', DshServiceSettingsHubScreen as unknown],
    ['DshZoneSetScreen', DshZoneSetScreen as unknown],
    ['DshListingStatusUpdateScreen', DshListingStatusUpdateScreen as unknown],
  ];

  const missing = importedScreens.filter(([, v]) => typeof v === 'undefined').map(([n]) => String(n));
  if (missing.length > 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: colorPalette.brandStrong, fontSize: 18, fontWeight: '700', marginBottom: 12 }}>مكوّنات مفقودة</Text>
        <Text style={{ color: colorPalette.brandStrong }}>{missing.join(', ')}</Text>
      </View>
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
        marketingPrograms={liveMarketingPrograms.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          meta: item.routeTarget,
          badgeLabel: item.family === 'subscription' ? 'اشتراك' : item.family === 'promotion' ? 'برومو' : item.family === 'shorts' ? 'شورتات' : 'حملة',
        }))}
        onOpenOrders={() => setRoute('orders-list')}
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
        onOpenSearch={() => setRoute('search')}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('notifications')}
      />
    );
  }

  if (route === 'store-get') {
    return (
      <DshStoreGetScreen
        store={{
          id: activeStore.id,
          name: activeStore.name,
          subtitle: activeStore.subtitle,
          statusLabel: activeStore.statusLabel,
          etaLabel: activeStore.meta,
          deliveryFeeLabel: activeStore.deliveryFeeLabel ?? 'رسوم التوصيل 12 ر.ي',
          followersCount: activeStore.followerCount,
          priceMatchLabel: activeStore.priceMatchLabel ?? 'الأسعار مطابقة للمطعم',
          imageUri: activeStore.imageUri,
          deliveryLabel: activeStore.deliveryLabel,
          serviceLabel: activeStore.serviceLabel,
          subscriptionPackageChips: activeStore.subscriptionPackageChips,
          hasBthwaniPro: activeStore.hasBthwaniPro,
          tags: activeStoreTags,
          categories: activeStoreCategories,
          deliveryModes: activeStoreDeliveryModes,
        }}
        menuItems={activeStoreItems}
        onAddItemToCart={addItemToHostCart}
        onOpenItems={() => {
          setStoreItemsEntryOrigin('store-get');
          setRoute('store-items');
        }}
        onOpenSearch={() => {
          setItemsQuery('');
          setStoreItemsEntryOrigin('store-get');
          setRoute('store-items');
        }}
        onOpenCart={() => setRoute('cart-get')}
        onOpenBenefits={() => {
          setSelectedOperationScreen('entitlements-get');
          setRoute('benefits');
        }}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('store-get')}
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
        onOpenStore={() => setRoute('store-get')}
        onOpenService={onOpenService}
        onOpenOrder={handleConfirmedOrderExecution}
        onContinue={handleConfirmedOrderExecution}
        onRetry={() => setRoute('cart-get')}
      />
      );
  }

  if (route === 'favorite-toggle') {
    return (
      <DshFavoriteToggleScreen
        itemLabel={selectedItem?.name ?? 'عنصر محفوظ'}
        currentFavorite={favoriteOverrides[selectedItem?.id ?? activeStore.id] ?? Boolean(activeStore.isOffer)}
        onToggleFavorite={() => {
          const favoriteKey = selectedItem?.id ?? activeStore.id;
          setFavoriteOverrides((previous) => ({
            ...previous,
            [favoriteKey]: !(previous[favoriteKey] ?? Boolean(activeStore.isOffer)),
          }));
        }}
        onOpenFavorites={() => setRoute('favorites-list')}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('favorite-toggle')}
        onSupport={openSupportFlow}
      />
    );
  }

  if (route === 'favorites-list') {
    return (
      <DshFavoritesListScreen
        items={[
          {
            id: activeStore.id,
            name: activeStore.name,
            subtitle: activeStore.subtitle,
            meta: activeStore.isFavorite ? 'متجر مفضل' : 'متجر محفوظ',
          },
          { id: 'item-apple-1', name: 'تفاح رويال غالا', subtitle: 'صندوق طازج 1 كجم', meta: 'عنصر محفوظ' },
        ]}
        onOpenItem={() => setRoute('favorite-toggle')}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('favorites-list')}
        onSupport={openSupportFlow}
      />
    );
  }

  if (route === 'search') {
    return (
      <DshSearchScreen
        query={storesQuery}
        results={filteredSearchStores.map((store) => ({ id: store.id, title: store.name, subtitle: store.subtitle, meta: store.meta }))}
        onQueryChange={setStoresQuery}
        onOpenCategories={() => setRoute('home')}
        onOpenFavorites={() => setRoute('favorites-list')}
        onOpenResult={(resultId) => {
          const nextStoreMetadata = getStoreCanonicalMetadata(resultId);
          setActiveStoreId(resultId);
          setActiveCanonicalStoreId(nextStoreMetadata.canonicalStoreId);
          setActiveCanonicalProductId(undefined);
          setRoute('store-get');
        }}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('search')}
      />
    );
  }

  /* 'review' route removed — review stays inside the cart/tracking client journey. */

  if (route === 'benefits') {
    return (
      <DshBenefitsHubScreen
        screenId={selectedOperationScreen as 'subscription-family-get' | 'subscription-family-members-get' | 'subscription-family-members-post' | 'subscription-pro-catalog' | 'subscription-sync' | 'subscription-tier-get' | 'subscription-upgrade-post' | 'loyalty-points-redeem' | 'loyalty-points-client-balance' | 'loyalty-points-client-history' | 'entitlements-get'}
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
      />
    );
  }

  if (route === 'tracking') {
    return (
      <DshTrackingScreen
        values={createOrderValues}
        clientState={trackingClientState}
        currentStatusLabel={activeTrackedOrder?.statusLabel}
        timeline={trackingTimeline}
        onSupport={openSupportFlow}
        onRetry={() => openTrackedOrder(activeTrackedOrder?.id)}
        onNextAction={() => setRoute('orders-list')}
          onReorder={openCreateOrderJourney}
      />
    );
  }

  if (route === 'bell') {
    return (
      <DshClientBellScreen
        onOpenTracking={() => openTrackedOrder(activeTrackedOrder?.id)}
        onOpenOrders={() => setRoute('orders-list')}
        onBack={() => openTrackedOrder(activeTrackedOrder?.id)}
        onRetry={() => setRoute('bell')}
      />
    );
  }

  return (
    <DshHomeGetScreen
      categories={dshCategoryListFixtures}
      promos={resolvePublishedHomePromos() as DshHomeGetPromo[]}
      approvedVideoShorts={liveMarketingShorts}
      stores={dshHomeGetFixtureStores as DshHomeGetStore[]}
      recentOrders={[
        {
          id: 'home-recent-order-1',
          storeId: dshHomeGetFixtureStores[0]?.id ?? 'store-1001',
          title: 'الطلب النشط',
          subtitle: dshHomeGetFixtureStores[0]?.name ?? 'مطعم القلعة',
          meta: `${dshHomeGetFixtureStores[0]?.distanceLabel ?? '2.1 كم'} · ${dshHomeGetFixtureStores[0]?.deliveryLabel ?? 'توصيل مجاني'}`,
          statusLabel: dshHomeGetFixtureStores[0]?.statusTone === 'open' ? 'مباشر' : 'مغلق',
        },
        {
          id: 'home-recent-order-2',
          storeId: dshHomeGetFixtureStores[1]?.id ?? 'store-1002',
          title: 'آخر طلب',
          subtitle: dshHomeGetFixtureStores[1]?.name ?? 'مطاعم الأرض الخضراء',
          meta: `${dshHomeGetFixtureStores[1]?.distanceLabel ?? '1.8 كم'} · ${dshHomeGetFixtureStores[1]?.serviceLabel ?? 'توصيل برو'}`,
          statusLabel: dshHomeGetFixtureStores[1]?.statusTone === 'open' ? 'مباشر' : 'مغلق',
        },
      ]}
      onBack={onExit}
      onOpenEntry={() => setRoute('entry')}
      onOpenMySpace={() => setRoute('my-space')}
      onOpenNotifications={() => setRoute('notifications')}
      onOpenCart={() => setRoute('cart-get')}
      onOpenService={onOpenService}
      onOpenList={() => setRoute('home')}
      onOpenCategory={(categoryId) => {
        if (categoryId === 'shein') {
          setSheinInlineOpen(true);
          setRoute('home');
          return;
        }

        if (categoryId === 'awnak') {
          setAwnakInlineOpen(true);
          setRoute('home');
          return;
        }

        setRoute('home');
      }}
      onOpenDiscovery={() => setRoute('home')}
      onOpenStoreCategory={(storeId, categoryId) => {
        const nextStoreMetadata = getStoreCanonicalMetadata(storeId);
        setActiveStoreId(storeId);
        setActiveCanonicalStoreId(nextStoreMetadata.canonicalStoreId);
        setActiveCanonicalProductId(undefined);
        setItemsCategory(categoryId);
        setStoreItemsEntryOrigin('home');
        setRoute('store-items');
      }}
      onOpenProduct={(storeId, itemId) => {
        const nextProductMetadata = getProductCanonicalMetadata(storeId, itemId);
        setActiveStoreId(storeId);
        setActiveCanonicalStoreId(nextProductMetadata.canonicalStoreId);
        setActiveCanonicalProductId(nextProductMetadata.canonicalProductId);
        setSelectedItemId(itemId);
        setRoute('cart-get');
      }}
      onOpenBenefits={(screenId) => {
        setSelectedOperationScreen(screenId ?? 'entitlements-get');
        setRoute('benefits');
      }}
      onOpenFavorites={() => setRoute('favorites-list')}
      onOpenSearch={() => setRoute('search')}
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
      onOpenStore={(storeId) => {
        const nextStoreMetadata = getStoreCanonicalMetadata(storeId);
        setActiveStoreId(storeId);
        setActiveCanonicalStoreId(nextStoreMetadata.canonicalStoreId);
        setActiveCanonicalProductId(undefined);
        setItemsQuery('');
        setItemsCategory('all');
        setSelectedItemId('');
        setRoute('store-get');
      }}
      sheinInlineVisible={sheinInlineOpen}
      onCloseSheinInline={() => setSheinInlineOpen(false)}
      awnakInlineVisible={awnakInlineOpen}
      onCloseAwnakInline={() => setAwnakInlineOpen(false)}
      renderApprovedVideoReelsViewer={renderApprovedVideoReelsViewer}
      onRetry={() => setRoute('home')}
    />
  );
}

export default DshSurfaceHost;
