import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { Surface, Text, colorPalette } from '@bthwani/ui-kit';
import { DshSearchScreen } from './screens/SearchScreen';
import { DshEntryScreen } from './screens/EntryScreen';
import { DshClientBellScreen } from './screens/BellScreen';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './screens/HomeScreen';
import { DshMySpaceScreen } from './screens/MySpaceScreen';
import { DshNotificationsScreen } from './screens/NotificationsScreen';
import { DshBenefitsHubScreen } from './screens/BenefitsScreen';
import { DshOrdersListScreen, DshTrackingScreen } from './screens/OrdersTrackingScreens';
import { DshStoreGetScreen } from './screens/StoreScreen';
import { DshStoreItemsScreen } from './screens/StoreItemsScreen';
import { DshFavoriteToggleScreen } from './screens/FavoriteToggleScreen';
import { DshFavoritesListScreen } from './screens/FavoritesScreen';
import { DshCartGetScreen } from './screens/CartScreen';
import {
  type ClientOperationScreenId,
  DshConversationHubScreen,
  DshOrderIssueHubScreen,
  DshProxyHubScreen,
  DshServiceSettingsHubScreen,
  DshZoneSetScreen,
  DshListingStatusUpdateScreen,
} from './screens/OperationScreens';
import type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
} from './data/home.preview-data';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshDiscoveryStores,
  storeItemsByStoreId,
} from './data/store.preview-data';
import {
  recordMarketingBannerClick,
  recordMarketingBannerImpression,
  getPublishedMarketingHomePromos,
} from '../shared/banner.preview-store';
import {
  getLiveMarketingGrowthItems,
  recordMarketingGrowthClick,
  recordMarketingGrowthImpression,
  type MarketingGrowthRecord,
} from '../shared/growth.preview-store';
import { getDshClientStateMeta, type DshClientState } from './data/client-state.preview-data';
import { getPublishedHomePromos } from '../shared/promo.preview-store';
import { dshCategoryFixtures, dshCategoryListFixtures } from './data/categories.preview-data';
import {
  isDshFulfillmentDeliveryMode,
  type DshClientCreateOrderRequest,
  type DshFulfillmentDeliveryMode,
} from './contracts/dsh-client-binding.contracts';
import { dshPartnerIntakeItems } from '../shared/workflow';
import type { DshClientSurfaceProps, DshCommandTarget, DshRoute } from './dsh-client.types';
import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import { WltHomeGetScreen } from '../../../wlt/frontend/app-client';

type CreateOrderValues = Pick<
  DshClientCreateOrderRequest,
  'fulfillmentMode' | 'pickupAddress' | 'dropoffAddress' | 'contactName' | 'contactPhone' | 'note'
>;

type HostOrderSummary = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  clientState: DshClientState;
  fulfillmentMode: DshFulfillmentDeliveryMode;
  pickupAddress: string;
  dropoffAddress: string;
  note?: string;
  orderNumber?: string;
  summary?: string;
  total?: string;
  location?: string;
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

function resolveStorePickupAddress(store: { subtitle?: string; name?: string }) {
  const subtitle = store.subtitle?.trim();
  if (subtitle) {
    return subtitle;
  }

  const name = store.name?.trim();
  if (name) {
    return name;
  }

  return 'موقع المتجر غير محدد';
}

const initialCreateOrderValues: CreateOrderValues = {
  fulfillmentMode: 'bthwani_delivery',
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
    title: 'مطعم حدة المركزي',
    orderNumber: '10021',
    subtitle: 'من حدة إلى باب اليمن',
    statusLabel: getDshClientStateMeta(hostClientStates.trackingActive).label,
    meta: 'الوصول المتوقع خلال 18 دقيقة',
    clientState: hostClientStates.trackingActive,
    fulfillmentMode: 'bthwani_delivery',
    pickupAddress: 'مطعم حدة المركزي',
    dropoffAddress: 'حدة، شارع الستين',
    note: 'اتصل قبل الوصول.',
    summary: 'برجر دجاج + بطاطس',
    total: '34.50 ر.ي',
    location: 'المنزل',
  },
  {
    id: 'dsh-10019',
    title: 'مخبز السبعين',
    orderNumber: '10019',
    subtitle: 'من السبعين إلى التحرير',
    statusLabel: getDshClientStateMeta(hostClientStates.delivered).label,
    meta: 'اليوم 03:10 م',
    clientState: hostClientStates.delivered,
    fulfillmentMode: 'partner_delivery',
    pickupAddress: 'مخبز السبعين',
    dropoffAddress: 'التحرير، شارع الزبيري',
    summary: '٣ منتجات طازجة',
    total: '22.00 ر.ي',
    location: 'العمل',
  },
  {
    id: 'dsh-10017',
    title: 'متجر شميلة',
    orderNumber: '10017',
    subtitle: 'من شميلة إلى التحرير',
    statusLabel: getDshClientStateMeta(hostClientStates.cancelled).label,
    meta: 'تم الإلغاء مع توضيح سبب الحالة',
    clientState: hostClientStates.cancelled,
    fulfillmentMode: 'pickup',
    pickupAddress: 'متجر شميلة',
    dropoffAddress: '',
    summary: 'شاورما دبل + عصير طازج',
    total: '15.00 ر.ي',
    location: 'فرع التحرير',
  },
  {
    id: 'dsh-10016',
    title: 'مطبخ مذبح السريع',
    orderNumber: '10016',
    subtitle: 'من مذبح إلى باب السلام',
    statusLabel: getDshClientStateMeta(hostClientStates.failed).label,
    meta: 'توجد حاجة إلى مسار تعافٍ أو دعم واضح',
    clientState: hostClientStates.failed,
    fulfillmentMode: 'bthwani_delivery',
    pickupAddress: 'مطبخ مذبح السريع',
    dropoffAddress: 'باب السلام، شارع 14',
    summary: 'وجبة غداء عائلية',
    total: '45.00 ر.ي',
    location: 'المنزل',
  },
  {
    id: 'dsh-10015',
    title: 'كافيه السنينة',
    orderNumber: '10015',
    subtitle: 'من السنينة إلى سعوان',
    statusLabel: getDshClientStateMeta(hostClientStates.refundPending).label,
    meta: 'الاسترداد ما يزال قيد المعالجة',
    clientState: hostClientStates.refundPending,
    fulfillmentMode: 'partner_delivery',
    pickupAddress: 'كافيه السنينة',
    dropoffAddress: 'سعوان، الشارع العام',
    summary: '١ قهوة تركية + دونات زعتر',
    total: '28.00 ر.ي',
    location: 'العمل',
  },
  {
    id: 'dsh-10014',
    title: 'متجر التحرير',
    orderNumber: '10014',
    subtitle: 'من التحرير إلى الجامعة',
    statusLabel: getDshClientStateMeta(hostClientStates.refunded).label,
    meta: 'تم تثبيت الأثر المالي النهائي للطلب',
    clientState: hostClientStates.refunded,
    fulfillmentMode: 'pickup',
    pickupAddress: 'متجر التحرير',
    dropoffAddress: '',
    summary: 'عصير برتقال عائلي',
    total: '12.00 ر.ي',
    location: 'فرع التحرير',
  },
  {
    id: 'dsh-10013',
    title: 'فرع الحصبة',
    orderNumber: '10013',
    subtitle: 'من الحصبة إلى بيت بوس',
    statusLabel: getDshClientStateMeta(hostClientStates.supportRequired).label,
    meta: 'هذه الحالة تحتاج متابعة دعم واضحة',
    clientState: hostClientStates.supportRequired,
    fulfillmentMode: 'partner_delivery',
    pickupAddress: 'فرع الحصبة',
    dropoffAddress: 'بيت بوس، شارع الخمسين',
    summary: 'معجنات مشكلة صفيحة',
    total: '32.00 ر.ي',
    location: 'العمل',
  },
  {
    id: 'dsh-10012',
    title: 'فرع فج عطان',
    orderNumber: '10012',
    subtitle: 'من فج عطان إلى السبعين',
    statusLabel: getDshClientStateMeta(hostClientStates.walletCreditVisible).label,
    meta: 'يوجد رصيد ظاهر للعميل داخل المحفظة',
    clientState: hostClientStates.walletCreditVisible,
    fulfillmentMode: 'bthwani_delivery',
    pickupAddress: 'فرع فج عطان',
    dropoffAddress: 'السبعين، شارع الجزائر',
    summary: 'بيتزا سوبر سوبريم وسط',
    total: '38.00 ر.ي',
    location: 'المنزل',
  },
  {
    id: 'dsh-10011',
    title: 'متجر باب اليمن',
    orderNumber: '10011',
    subtitle: 'من باب اليمن إلى حدة',
    statusLabel: getDshClientStateMeta(hostClientStates.walletRefundVisible).label,
    meta: 'تظهر معلومة الاسترداد المالي ضمن المسار',
    clientState: hostClientStates.walletRefundVisible,
    fulfillmentMode: 'pickup',
    pickupAddress: 'متجر باب اليمن',
    dropoffAddress: '',
    summary: 'كيكة الشوكولاتة الفاخرة',
    total: '55.00 ر.ي',
    location: 'فرع التحرير',
  },
];

const defaultTrackingOrderId = initialOrders[0]?.id ?? 'dsh-10021';

function commandTargetToRoute(target: DshCommandTarget): DshRoute {
  switch (target) {
    case 'home':
      return 'home';
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
      return 'home';
  }
}

export function DshClientSurface({ command, onExit, onOpenService, renderApprovedVideoReelsViewer }: DshClientSurfaceProps) {
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = useAppClientAppearance();
  const initialCanonicalStore = getStoreCanonicalMetadata('store-1001');
  const defaultFulfillmentMode: DshFulfillmentDeliveryMode = 'bthwani_delivery';
  const [route, setRoute] = React.useState<DshRoute>('home');
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<HostCartItem[]>([]);
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [trackingOrderOverride, setTrackingOrderOverride] = React.useState<Partial<CreateOrderValues> | null>(null);
  const [selectedFulfillmentMode, setSelectedFulfillmentMode] = React.useState<DshFulfillmentDeliveryMode>(defaultFulfillmentMode);
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
  const [reorderAlertMessage, setReorderAlertMessage] = React.useState<string | undefined>(undefined);
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('entitlements-get');
  const routeHistoryRef = React.useRef<DshRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const homeBackResolverRef = React.useRef<(() => boolean) | null>(null);

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
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.history.pushState({ route }, '');
        }
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      // Priority 1: dismiss transient modal overlays inside HomeScreen (categories, shorts, search, service dial).
      if (homeBackResolverRef.current?.()) return true;

      // Priority 2: close inline order forms (shein/awnak proxy).
      if (sheinInlineOpen) { setSheinInlineOpen(false); return true; }
      if (awnakInlineOpen) { setAwnakInlineOpen(false); return true; }

      // Priority 3: navigate back through route history.
      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
        setRoute(previousRoute);
        return true;
      }

      // Priority 4: at root with no open panels — delegate to host exit handler.
      if (onExit) { onExit(); return true; }

      return false;
    });

    return () => subscription.remove();
  }, [onExit, sheinInlineOpen, awnakInlineOpen]);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = (event: PopStateEvent) => {
      // Priority 1: dismiss transient modal overlays inside HomeScreen.
      if (homeBackResolverRef.current?.()) {
        window.history.pushState({ route }, '');
        return;
      }

      // Priority 2: close inline order forms.
      if (sheinInlineOpen) {
        setSheinInlineOpen(false);
        window.history.pushState({ route }, '');
        return;
      }
      if (awnakInlineOpen) {
        setAwnakInlineOpen(false);
        window.history.pushState({ route }, '');
        return;
      }

      // Priority 3: navigate back through route history.
      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
        setRoute(previousRoute);
      } else if (onExit) {
        onExit();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize/sync history state if empty
    if (!window.history.state || window.history.state.route !== route) {
      window.history.replaceState({ route }, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [route, onExit, sheinInlineOpen, awnakInlineOpen]);

  const filteredOrders = React.useMemo(() => {
    const query = ordersQuery.trim().toLowerCase();
    if (!query) {
      return initialOrders;
    }

    return initialOrders.filter((order) => {
      const haystack = `${order.title} ${order.orderNumber || ''} ${order.summary || ''} ${order.subtitle} ${order.statusLabel} ${order.meta}`.toLowerCase();
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
    setReorderAlertMessage(undefined);
    setRoute('cart-get');
  }, []);

  const handleReorderClick = React.useCallback((orderId: string) => {
    const order = initialOrders.find((o) => o.id === orderId);
    if (!order) return;

    // 1. Find store matching order title (store name)
    const matchedStore = dshDiscoveryStores.find((s) => s.name === order.title) ?? dshDiscoveryStores[0];
    setActiveStoreId(matchedStore.id);
    setActiveCanonicalStoreId(matchedStore.canonicalStoreId);

    // 2. Fetch products for store
    const storeProducts = storeItemsByStoreId[matchedStore.id] ?? [];

    // 3. Find matches by summary keywords
    const summaryText = order.summary || '';
    const keywords = summaryText.split(/[\s+\u2014\u2022•,]+/);
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
  }, [createOrderValues.note]);

  const openTrackedOrder = React.useCallback((
    orderId?: string,
    launchOverrides?: {
      fulfillmentMode?: DshFulfillmentDeliveryMode;
      orderDraft?: Partial<CreateOrderValues>;
    },
  ) => {
    const nextOrder = initialOrders.find((order) => order.id === orderId) ?? initialOrders[0];
    const nextFulfillmentMode = orderId
      ? nextOrder.fulfillmentMode
      : launchOverrides?.fulfillmentMode ?? selectedFulfillmentMode ?? nextOrder.fulfillmentMode ?? defaultFulfillmentMode;
    const nextOrderDraft = orderId
      ? {
          fulfillmentMode: nextOrder.fulfillmentMode,
          pickupAddress: nextOrder.pickupAddress,
          dropoffAddress: nextOrder.dropoffAddress,
          note: nextOrder.note ?? createOrderValues.note,
        }
      : launchOverrides?.orderDraft;

    setSelectedOrderId(nextOrder.id);
    setTrackingClientState(hostClientStates.trackingActive);
    setSelectedFulfillmentMode(nextFulfillmentMode);
    setTrackingOrderOverride(orderId ? null : nextOrderDraft ?? null);
    setCreateOrderValues((currentValues) => ({
      ...currentValues,
      ...nextOrderDraft,
      fulfillmentMode: nextFulfillmentMode,
    }));
    setRoute('tracking');
  }, [createOrderValues.note, defaultFulfillmentMode, selectedFulfillmentMode]);

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

  const handleConfirmedOrderExecution = React.useCallback((payload?: {
    fulfillmentMode?: DshFulfillmentDeliveryMode;
    orderDraft?: Partial<CreateOrderValues>;
  }) => {
    openTrackedOrder(undefined, {
      fulfillmentMode: payload?.fulfillmentMode ?? payload?.orderDraft?.fulfillmentMode ?? selectedFulfillmentMode,
      orderDraft: payload?.orderDraft,
    });
  }, [openTrackedOrder, selectedFulfillmentMode]);

  const activeStore = React.useMemo(
    () => dshDiscoveryStores.find((store) => store.id === activeStoreId) ?? dshDiscoveryStores[0],
    [activeStoreId],
  );

  const activeStoreItems = React.useMemo(() => storeItemsByStoreId[activeStore.id] ?? [], [activeStore.id]);
  const activeStoreCategories = React.useMemo(() => buildStoreCategories(activeStoreItems), [activeStoreItems]);
  const activeStoreDeliveryModes = React.useMemo(() => buildStoreDeliveryModes(activeStore), [activeStore]);
  const activeStoreTags = React.useMemo(() => buildStoreTags(activeStore), [activeStore]);
  const trackingOrderValues = React.useMemo<CreateOrderValues>(() => ({
    fulfillmentMode: trackingOrderOverride?.fulfillmentMode ?? activeTrackedOrder?.fulfillmentMode ?? createOrderValues.fulfillmentMode ?? selectedFulfillmentMode,
    pickupAddress: trackingOrderOverride?.pickupAddress ?? activeTrackedOrder?.pickupAddress ?? createOrderValues.pickupAddress,
    dropoffAddress: trackingOrderOverride?.dropoffAddress ?? activeTrackedOrder?.dropoffAddress ?? createOrderValues.dropoffAddress,
    contactName: createOrderValues.contactName,
    contactPhone: createOrderValues.contactPhone,
    note: trackingOrderOverride?.note ?? activeTrackedOrder?.note ?? createOrderValues.note,
  }), [activeTrackedOrder, createOrderValues, selectedFulfillmentMode, trackingOrderOverride]);
  const reopenTracking = React.useCallback(() => {
    openTrackedOrder(
      trackingOrderOverride ? undefined : activeTrackedOrder?.id,
      trackingOrderOverride
        ? {
            fulfillmentMode: trackingOrderValues.fulfillmentMode,
            orderDraft: trackingOrderOverride,
          }
        : undefined,
    );
  }, [activeTrackedOrder?.id, openTrackedOrder, trackingOrderOverride, trackingOrderValues.fulfillmentMode]);

  const selectedItem = React.useMemo(
    () => activeStoreItems.find((item) => item.id === selectedItemId) ?? activeStoreItems[0],
    [activeStoreItems, selectedItemId],
  );

  const addItemToHostCart = React.useCallback((
    item: HostCartInputItem,
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

  const liveMarketingPrograms = getLiveMarketingGrowthItems('client');
  const liveMarketingShorts = liveMarketingPrograms
    .filter((item) => item.family === 'shorts')
    .filter(isMarketingGrowthRouteValid);

  // Sanity check
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

  if (route === 'wlt-home') {
    return <WltHomeGetScreen onBack={() => setRoute('home')} />;
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
        onOpenAddresses={() => { setSelectedOperationScreen('entitlements-get'); setRoute('service-settings'); }}
        onOpenLocation={() => setRoute('zone-set')}
        onOpenIdentity={() => { setSelectedOperationScreen('entitlements-get'); setRoute('service-settings'); }}
        onOpenCommercial={() => { setSelectedOperationScreen('promo-apply'); setRoute('benefits'); }}
        onOpenAppearance={() => { setSelectedOperationScreen('service-modes-resolve'); setRoute('service-settings'); }}
        onOpenPreferences={() => { setSelectedOperationScreen('service-modes-resolve'); setRoute('service-settings'); }}
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
        appearanceMode={appearanceMode}
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
        onOpenCart={(mode) => {
          const nextFulfillmentMode = mode ?? selectedFulfillmentMode;
          setSelectedFulfillmentMode(nextFulfillmentMode);
          setCreateOrderValues((currentValues) => ({
            ...currentValues,
            fulfillmentMode: nextFulfillmentMode,
            pickupAddress: resolveStorePickupAddress(activeStore),
            dropoffAddress: nextFulfillmentMode === 'pickup' ? '' : currentValues.dropoffAddress,
          }));
          setRoute('cart-get');
        }}
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

  if (route === 'benefits') {
    return (
      <DshBenefitsHubScreen
        screenId={selectedOperationScreen as any}
        onPrimaryAction={returnHome}
        onSecondaryAction={returnHome}
        onRetry={() => setRoute('benefits')}
      />
    );
  }

  if (route === 'conversation-workspace') {
    return (
      <DshConversationHubScreen
        screenId={selectedOperationScreen as any}
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
        screenId={selectedOperationScreen as any}
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
        screenId={selectedOperationScreen as any}
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
      />
    );
  }

  if (route === 'tracking') {
    return (
      <DshTrackingScreen
        values={trackingOrderValues}
        clientState={trackingClientState}
        currentStatusLabel={activeTrackedOrder?.statusLabel}
        fulfillmentMode={trackingOrderValues.fulfillmentMode}
        timeline={trackingTimeline}
        onSupport={openSupportFlow}
        onRetry={reopenTracking}
        onNextAction={() => setRoute('orders-list')}
        onReorder={openCreateOrderJourney}
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

  return (
    <DshHomeGetScreen
      categories={dshCategoryListFixtures as any}
      promos={getPublishedMarketingHomePromos('home') as DshHomeGetPromo[]}
      homePromos={getPublishedHomePromos()}
      approvedVideoShorts={liveMarketingShorts}
      stores={dshHomeGetFixtureStores as any}
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
      onOpenWallet={() => setRoute('wlt-home')}
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
        setSelectedOperationScreen(screenId as any);
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
      }}
      sheinInlineVisible={sheinInlineOpen}
      onCloseSheinInline={() => setSheinInlineOpen(false)}
      awnakInlineVisible={awnakInlineOpen}
      onCloseAwnakInline={() => setAwnakInlineOpen(false)}
      homeBackResolverRef={homeBackResolverRef}
      renderApprovedVideoReelsViewer={renderApprovedVideoReelsViewer}
      onRetry={() => setRoute('home')}
    />
  );
}

export { DshClientSurface as DshSurfaceHost };
