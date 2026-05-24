import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { BottomNavBar, Surface, Text, colorPalette } from '@bthwani/ui-kit';
import { DshEntryScreen } from './screens/EntryScreen';
import { DshClientBellScreen } from './screens/BellScreen';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './screens/HomeScreen';
import { DshMySpaceScreen } from './screens/MySpaceScreen';
import { DshNotificationsScreen } from './screens/NotificationsScreen';
import { DshBenefitsHubScreen } from './screens/BenefitsScreen';
import { DshOrdersListScreen, DshTrackingScreen } from './screens/OrdersTrackingScreens';
import { DshStoreGetScreen } from './screens/StoreScreen';
import { DshStoreItemsScreen } from './screens/StoreItemsScreen';
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
import { DshAddressLocationScreen } from './screens/AddressLocationScreen';
import { DshIdentityHubScreen, DshPreferencesHubScreen } from './screens/MySpaceSubScreens';
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
import { resolveDshDiscoveryStoresBridge } from './shared/dsh-discovery-stores-bridge';
import { resolveDshStoreClientVisibility } from '../shared/dsh-client-visibility.model';
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
const clientVisibleDiscoveryPreviewStores = dshDiscoveryStores.filter((store) => (
  resolveDshStoreClientVisibility({
    publishStage: store.publishStage,
    supportsPickup: store.supportsPickup,
    supportsPartnerDelivery: store.supportsPartnerDelivery,
    serviceLabel: store.serviceLabel,
    deliveryLabel: store.deliveryLabel,
    storeOpen: !store.statusLabel.includes('مغلق'),
  }).visible
));
const clientVisibleHomePreviewStores = dshHomeGetFixtureStores.filter((store) => (
  resolveDshStoreClientVisibility({
    publishStage: store.publishStage,
    supportsPickup: store.supportsPickup,
    supportsPartnerDelivery: store.supportsPartnerDelivery,
    serviceLabel: store.serviceLabel,
    deliveryLabel: store.deliveryLabel,
    storeOpen: store.statusTone === 'open',
  }).visible
));

const clientDiscoveryStoresBridge = resolveDshDiscoveryStoresBridge({
  previewHomeStores: clientVisibleHomePreviewStores,
  previewDiscoveryStores: clientVisibleDiscoveryPreviewStores,
});

const clientVisibleDiscoveryStores = clientDiscoveryStoresBridge.discoveryStores;
const clientVisibleHomeStores = clientDiscoveryStoresBridge.homeStores;

function hasStoreTarget(storeId?: string) {
  return typeof storeId === 'string' && clientVisibleDiscoveryStores.some((store) => store.id === storeId);
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
  const store = clientVisibleDiscoveryStores.find((entry) => entry.id === storeId) ?? dshDiscoveryStores.find((entry) => entry.id === storeId);
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
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');
  const [homeSearchAutoOpenToken, setHomeSearchAutoOpenToken] = React.useState(0);
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [activeCanonicalStoreId, setActiveCanonicalStoreId] = React.useState<string | undefined>(initialCanonicalStore.canonicalStoreId);
  const [activeCanonicalProductId, setActiveCanonicalProductId] = React.useState<string | undefined>(undefined);
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(defaultTrackingOrderId);
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [reorderAlertMessage, setReorderAlertMessage] = React.useState<string | undefined>(undefined);
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('entitlements-get');
  const [serviceDialTrigger, setServiceDialTrigger] = React.useState(0);
  const routeHistoryRef = React.useRef<DshRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const homeBackResolverRef = React.useRef<(() => boolean) | null>(null);
  const handleRegisterBackHandler = React.useCallback((handler: (() => boolean) | null) => {
    homeBackResolverRef.current = handler;
  }, []);
  const openHomeInlineSearch = React.useCallback(() => {
    setRoute('home');
    setHomeSearchAutoOpenToken((token) => token + 1);
  }, []);

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
        if (route === 'home') {
          routeHistoryRef.current = ['home'];
        } else {
          // Prevent navigation loops by trimming history if route already exists in stack
          const routeIndex = routeHistoryRef.current.indexOf(route);
          if (routeIndex !== -1) {
            routeHistoryRef.current = routeHistoryRef.current.slice(0, routeIndex + 1);
          } else {
            routeHistoryRef.current.push(route);
          }
        }
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

  const activeTrackedOrder = React.useMemo(
    () => initialOrders.find((order) => order.id === selectedOrderId) ?? initialOrders[0],
    [selectedOrderId],
  );

  const trackingOrderValues = React.useMemo<CreateOrderValues>(() => ({
    fulfillmentMode: trackingOrderOverride?.fulfillmentMode ?? activeTrackedOrder?.fulfillmentMode ?? createOrderValues.fulfillmentMode ?? selectedFulfillmentMode,
    pickupAddress: trackingOrderOverride?.pickupAddress ?? activeTrackedOrder?.pickupAddress ?? createOrderValues.pickupAddress,
    dropoffAddress: trackingOrderOverride?.dropoffAddress ?? activeTrackedOrder?.dropoffAddress ?? createOrderValues.dropoffAddress,
    contactName: createOrderValues.contactName,
    contactPhone: createOrderValues.contactPhone,
    note: trackingOrderOverride?.note ?? activeTrackedOrder?.note ?? createOrderValues.note,
  }), [activeTrackedOrder, createOrderValues, selectedFulfillmentMode, trackingOrderOverride]);

  const trackingTimeline = React.useMemo(() => {
    const mode = trackingOrderValues.fulfillmentMode;
    if (mode === 'partner_delivery') {
      return [
        { id: 'store-prep', title: 'يجهّز المتجر الطلب', detail: 'المتجر يجهّز طلبك ويسلّمه لموصله.', done: true },
        { id: 'store-courier-pickup', title: 'موصل المتجر في الطريق', detail: 'موصل المتجر يتجه إليك — هذا ليس كابتن بثواني.', done: false },
        { id: 'delivered', title: 'تم التوصيل', detail: 'استلمت طلبك من موصل المتجر.', done: false },
      ];
    }
    if (mode === 'pickup') {
      return [
        { id: 'prep', title: 'يجهّز المتجر الطلب', detail: 'طلبك قيد التجهيز في المتجر.', done: true },
        { id: 'ready', title: 'الطلب جاهز للاستلام', detail: 'توجّه للمتجر لاستلام طلبك.', done: false },
        { id: 'picked-up', title: 'استلمت طلبك', detail: 'تم تأكيد استلامك للطلب من المتجر.', done: false },
      ];
    }
    // bthwani_delivery
    return [
      { id: 'route', title: 'الكابتن في الطريق', detail: 'كابتن بثواني متجه إليك الآن.', done: true },
      { id: 'arrived', title: 'وصل الكابتن', detail: 'الكابتن وصل وينتظر تسليم الطلب.', done: false },
      { id: 'received', title: 'استلمت طلبك', detail: 'بعد الاستلام تظهر تقييمات المنتج والكابتن.', done: false },
    ];
  }, [trackingOrderValues.fulfillmentMode]);

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
    () => clientVisibleDiscoveryStores.find((store) => store.id === activeStoreId) ?? clientVisibleDiscoveryStores[0] ?? dshDiscoveryStores[0],
    [activeStoreId],
  );

  const activeStoreItems = React.useMemo(() => storeItemsByStoreId[activeStore.id] ?? [], [activeStore.id]);
  const activeStoreCategories = React.useMemo(() => buildStoreCategories(activeStoreItems), [activeStoreItems]);
  const activeStoreDeliveryModes = React.useMemo(() => buildStoreDeliveryModes(activeStore), [activeStore]);
  const activeStoreTags = React.useMemo(() => buildStoreTags(activeStore), [activeStore]);
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
        onOpenAddressesLocation={() => setRoute('addresses-location')}
        onOpenIdentity={() => setRoute('identity')}
        onOpenCommercial={() => { setSelectedOperationScreen('promo-apply'); setRoute('benefits'); }}
        onOpenAppearance={() => { setSelectedOperationScreen('service-modes-resolve'); setRoute('service-settings'); }}
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
        onBack={returnHome}
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

  const clientBottomNavBar = (
    <BottomNavBar
      activeId="home"
      direction="rtl"
      launcherLabel="الخدمات"
      launcherIcon="grid"
      onLauncherPress={() => setServiceDialTrigger((t) => t + 1)}
      onSelect={(id) => {
        if (id === 'favorites') setRoute('home');
        if (id === 'orders') setRoute('orders-list');
        if (id === 'wallet') setRoute('wlt-home');
        if (id === 'profile') setRoute('my-space');
      }}
      items={[
        { id: 'favorites', label: 'المفضلة', icon: 'heart-outline', activeIcon: 'heart' },
        { id: 'orders', label: 'طلباتي', icon: 'receipt-outline', activeIcon: 'receipt' },
        { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', activeIcon: 'wallet' },
        { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
      ]}
    />
  );

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: 80 }}>
        <DshHomeGetScreen
          state={clientDiscoveryStoresBridge.state}
          serviceDialTrigger={serviceDialTrigger}
          favoriteOverrides={favoriteOverrides}
      onToggleFavorite={(storeId) => {
        const currentStore = clientVisibleHomeStores.find((s) => s.id === storeId) || clientVisibleDiscoveryStores.find((s) => s.id === storeId);
        const currentVal = favoriteOverrides[storeId] ?? currentStore?.isFavorite ?? false;
        setFavoriteOverrides((previous) => ({
          ...previous,
          [storeId]: !currentVal,
        }));
      }}
      categories={dshCategoryListFixtures as any}
      promos={getPublishedMarketingHomePromos('home') as DshHomeGetPromo[]}
      homePromos={getPublishedHomePromos()}
      approvedVideoShorts={liveMarketingShorts}
      stores={clientVisibleHomeStores as any}
      recentOrders={[
        {
          id: 'home-recent-order-1',
          storeId: clientVisibleHomeStores[0]?.id ?? 'store-1001',
          title: 'الطلب النشط',
          subtitle: clientVisibleHomeStores[0]?.name ?? 'مطعم القلعة',
          meta: `${clientVisibleHomeStores[0]?.distanceLabel ?? '2.1 كم'} · ${clientVisibleHomeStores[0]?.deliveryLabel ?? 'توصيل مجاني'}`,
          statusLabel: clientVisibleHomeStores[0]?.statusTone === 'open' ? 'مباشر' : 'مغلق',
        },
        {
          id: 'home-recent-order-2',
          storeId: clientVisibleHomeStores[1]?.id ?? 'store-1002',
          title: 'آخر طلب',
          subtitle: clientVisibleHomeStores[1]?.name ?? 'مطاعم الأرض الخضراء',
          meta: `${clientVisibleHomeStores[1]?.distanceLabel ?? '1.8 كم'} · ${clientVisibleHomeStores[1]?.serviceLabel ?? 'توصيل برو'}`,
          statusLabel: clientVisibleHomeStores[1]?.statusTone === 'open' ? 'مباشر' : 'مغلق',
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
      searchAutoOpenToken={homeSearchAutoOpenToken}
      sheinInlineVisible={sheinInlineOpen}
      onCloseSheinInline={() => setSheinInlineOpen(false)}
      awnakInlineVisible={awnakInlineOpen}
      onCloseAwnakInline={() => setAwnakInlineOpen(false)}
      onRegisterBackHandler={handleRegisterBackHandler}
      renderApprovedVideoReelsViewer={renderApprovedVideoReelsViewer}
      onRetry={() => setRoute('home')}
    />
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        {clientBottomNavBar}
      </View>
    </View>
  );
}

export { DshClientSurface as DshSurfaceHost };
