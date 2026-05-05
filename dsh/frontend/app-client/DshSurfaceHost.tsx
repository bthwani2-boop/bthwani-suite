import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { Surface, Text, colorPalette } from '@bthwani/ui-kit';
import { DshSearchScreen } from './discovery/screens';
import { DshEntryScreen } from './entry/screens';
import { DshClientBellScreen } from './bell';
import { DshAwnakOrderCreateScreen } from './awnak/screens';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './home/screens';
import { DshMySpaceScreen } from './my_space/screens';
import { DshNotificationsScreen } from './notifications/screens';
import { DshBenefitsHubScreen } from './subscriptions/screens';
import { DshOrdersListScreen, DshTrackingScreen } from './checkout/screens';
import { DshSheinOrderCreateScreen } from './shein/screens';
import { DshStoreGetScreen, DshStoreItemsScreen } from './stores/screens';
import { DshFavoriteToggleScreen, DshFavoritesListScreen } from './favorites/screens';
import { DshCartGetScreen } from './cart/screens';
import { DshClientOperationDirectoryScreen, clientOperationScreenRegistry, type ClientOperationScreenId, DshConversationHubScreen, DshOrderIssueHubScreen, DshProxyHubScreen, DshServiceSettingsHubScreen, DshZoneSetScreen, DshListingStatusUpdateScreen } from './operations/screens';
import type { DshHomeApprovedVideoReelsViewerProps } from './home/components/DshHomeApprovedVideoReelsViewer';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
} from './home/fixtures/dshHomeGetFixtures';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshDiscoveryStores,
  storeItemsByStoreId,
} from './stores/fixtures';
import {
  getPublishedMarketingHomePromos,
  recordMarketingBannerClick,
  recordMarketingBannerImpression,
} from '../shared/marketing/banner-store';
import {
  getLiveMarketingGrowthItems,
  recordMarketingGrowthClick,
  recordMarketingGrowthImpression,
  type MarketingGrowthRecord,
} from '../shared/marketing/growth-store';
import { getDshClientStateMeta, type DshClientState } from './shared/dshClientStateModel';
// checkout/tracking screens consolidated into checkout/screens
import { dshCategoryFixtures, dshCategoryListFixtures, getDshCategoryFixture } from './categories/fixtures/dshCategoriesFixtures';
import { dshPartnerIntakeItems } from '../shared/partners/workflow';

export type DshRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'notifications'
  | 'store-items'
  | 'awnak-order-create'
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
  | 'shein-order-create'
  | 'service-settings'
  | 'zone-set'
  | 'operations-directory'
  | 'operations-screen'
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

const checkoutCanonicalTargets: ClientOperationScreenId[] = [
  'checkout-gate',
  'estimate-get',
  'pricing-preview',
  'pricing-snapshot-get',
  'promo-apply',
];

const orderTrackingCanonicalTargets: ClientOperationScreenId[] = [
  'order-get',
  'order-status-get',
  'order-status-update',
  'order-receipt-get',
  'delivery-get',
  'delivery-track-get',
  'delivery-eta-get',
  'delivery-attempt-create',
  'delivery-attempts-list',
  'delivery-close',
  'order-proof-code-generate',
  'order-proof-verify',
];

const createJourneyTargets: ClientOperationScreenId[] = [
  'booking-create',
  'estimate-create',
  'external-order-create',
  'gas-refill-order-create',
  'order-create',
];

const deliveryManagementInternalTargets: ClientOperationScreenId[] = ['delivery-reassign'];


function commandTargetToRoute(target: DshCommandTarget): DshRoute {
  if (target === 'cart-get') {
    return 'cart-get';
  }



  if (target === 'orders-list') {
    return 'orders-list';
  }

  if (target === 'tracking') {
    return 'tracking';
  }

  if (target === 'bell') {
    return 'bell';
  }

  if (target === 'create-order') {
    return 'cart-get';
  }

  return 'home';
}

function operationScreenToRoute(screenId: ClientOperationScreenId): DshRoute {
  const conversationTargets: ClientOperationScreenId[] = ['chat-read-ack', 'chat-send'];
  const subscriptionTargets: ClientOperationScreenId[] = ['subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post'];
  const loyaltyTargets: ClientOperationScreenId[] = ['loyalty-points-redeem', 'loyalty-points-client-balance', 'loyalty-points-client-history', 'entitlements-get'];
  const proxyTargets: ClientOperationScreenId[] = ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review', 'proxy-request-reject', 'proxy-request-tracking'];
  const settingsTargets: ClientOperationScreenId[] = ['service-modes-resolve'];
  const listingTargets: ClientOperationScreenId[] = ['listing-status-update'];
  const zoneTargets: ClientOperationScreenId[] = ['zone-set'];
  const issueTargets: ClientOperationScreenId[] = ['order-issue-flag'];
  const trustTargets: ClientOperationScreenId[] = ['order-proof-code-generate', 'order-proof-verify', 'order-escrow-hold', 'order-escrow-release'];

  if (checkoutCanonicalTargets.includes(screenId)) {
    return 'cart-get';
  }

  if (orderTrackingCanonicalTargets.includes(screenId)) {
    return 'tracking';
  }

  if (createJourneyTargets.includes(screenId)) {
    return 'cart-get';
  }

  if (conversationTargets.includes(screenId)) {
    return 'conversation-workspace';
  }

  if (deliveryManagementInternalTargets.includes(screenId)) {
    return 'tracking';
  }

  if (subscriptionTargets.includes(screenId) || loyaltyTargets.includes(screenId)) {
    return 'benefits';
  }

  if (proxyTargets.includes(screenId)) {
    return 'proxy-workspace';
  }

  if (settingsTargets.includes(screenId)) {
    return 'service-settings';
  }

  if (listingTargets.includes(screenId)) {
    return 'listing-status-update';
  }

  if (zoneTargets.includes(screenId)) {
    return 'zone-set';
  }

  if (issueTargets.includes(screenId)) {
    return 'order-issue-workspace';
  }

  if (trustTargets.includes(screenId)) {
    return 'tracking';
  }

  return 'operations-screen';
}

export function DshSurfaceHost({ command, onExit, onOpenService, renderApprovedVideoReelsViewer }: DshSurfaceHostProps) {
  const [route, setRoute] = React.useState<DshRoute>('home');
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<HostCartItem[]>([]);
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [trackingClientState, setTrackingClientState] = React.useState<DshClientState>(hostClientStates.trackingActive);
  const [ordersQuery, setOrdersQuery] = React.useState('');
  const [storesQuery, setStoresQuery] = React.useState('');
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(defaultTrackingOrderId);
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('checkout-gate');
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

  const reviewBlocks = React.useMemo(
    () => ({
      route: [
        { id: 'pickup', label: 'الاستلام', value: createOrderValues.pickupAddress || 'غير محدد' },
        { id: 'dropoff', label: 'التسليم', value: createOrderValues.dropoffAddress || 'غير محدد' },
      ],
      contact: [
        { id: 'name', label: 'اسم جهة التواصل', value: createOrderValues.contactName || 'غير محدد' },
        { id: 'phone', label: 'جوال جهة التواصل', value: createOrderValues.contactPhone || 'غير محدد' },
      ],
      pricing: [
        { id: 'base', label: 'رسوم التوصيل', value: '22 ر.ي' },
        { id: 'eta', label: 'الوقت المتوقع', value: '25 دقيقة' },
      ],
    }),
    [createOrderValues],
  );

  const trackingTimeline = React.useMemo(
    () => [
      { id: 'route', title: 'في الطريق', detail: 'الطلب متجه إلى العميل الآن.', done: true },
      { id: 'arrived', title: 'وصل للعميل', detail: 'الطلب وصل إلى العميل وهو بانتظار الاستلام.', done: false },
      { id: 'received', title: 'استلم العميل الطلب', detail: 'بعد الاستلام تظهر تقييمات المنتج والكابتن.', done: false },
    ],
    [],
  );

  const handleCreateOrderChange = React.useCallback((field: keyof CreateOrderValues, value: string) => {
    setCreateOrderValues((current) => ({ ...current, [field]: value }));
  }, []);

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

  const handleConfirmedOrderExecution = React.useCallback(() => {
    openTrackedOrder();
  }, [openTrackedOrder]);

  const openOperationDirectory = React.useCallback(() => {
    setRoute('operations-directory');
  }, []);

  const openOperationScreen = React.useCallback((screenId: ClientOperationScreenId) => {
    setSelectedOperationScreen(screenId);
    setRoute(operationScreenToRoute(screenId));
  }, []);

  const handleOperationPrimaryAction = React.useCallback((screenId: ClientOperationScreenId) => {
    const awnakTargets: ClientOperationScreenId[] = ['awnak-order-create'];
    const orderTargets: ClientOperationScreenId[] = ['order-accept', 'order-cancel', 'order-complete'];
    const issueTargets: ClientOperationScreenId[] = ['order-issue-flag'];
    const trustTargets: ClientOperationScreenId[] = ['order-proof-code-generate', 'order-proof-verify', 'order-escrow-hold', 'order-escrow-release'];
    const reviewTargets: ClientOperationScreenId[] = ['order-rate', 'review-create'];
    const reviewHistoryTargets: ClientOperationScreenId[] = ['reviews-list'];
    const subscriptionTargets: ClientOperationScreenId[] = ['subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post'];
    const loyaltyTargets: ClientOperationScreenId[] = ['loyalty-points-redeem', 'loyalty-points-client-balance', 'loyalty-points-client-history'];
    const proxyRequestTargets: ClientOperationScreenId[] = ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review'];
    const proxyRejectTargets: ClientOperationScreenId[] = ['proxy-request-reject'];
    const proxyTrackingTargets: ClientOperationScreenId[] = ['proxy-request-tracking'];

    if (awnakTargets.includes(screenId)) {
      setRoute('awnak-order-create');
      return;
    }

    if (checkoutCanonicalTargets.includes(screenId)) {
      setRoute('cart-get');
      return;
    }

    if (orderTrackingCanonicalTargets.includes(screenId)) {
      openTrackedOrder();
      return;
    }

    if (createJourneyTargets.includes(screenId)) {
      openCreateOrderJourney();
      return;
    }

    if (orderTargets.includes(screenId)) {
      setRoute('orders-list');
      return;
    }

    if (issueTargets.includes(screenId)) {
      setRoute('order-issue-workspace');
      return;
    }

    if (trustTargets.includes(screenId)) {
      openTrackedOrder();
      return;
    }

    if (reviewTargets.includes(screenId)) {
      openCreateOrderJourney();
      return;
    }

    if (reviewHistoryTargets.includes(screenId)) {
      setRoute('orders-list');
      return;
    }

    if (subscriptionTargets.includes(screenId) || loyaltyTargets.includes(screenId)) {
      setRoute('benefits');
      return;
    }

    if (screenId === 'chat-read-ack' || screenId === 'chat-send') {
      setRoute('conversation-workspace');
      return;
    }

    if (proxyRequestTargets.includes(screenId)) {
      setRoute('proxy-workspace');
      return;
    }

    if (proxyRejectTargets.includes(screenId)) {
      setRoute('proxy-workspace');
      return;
    }

    if (proxyTrackingTargets.includes(screenId)) {
      setRoute('proxy-workspace');
      return;
    }

    if (screenId === 'listing-status-update' || screenId === 'service-modes-resolve' || screenId === 'zone-set' || screenId === 'entitlements-get') {
      if (screenId === 'entitlements-get') {
        setRoute('benefits');
        return;
      }

      if (screenId === 'listing-status-update') {
        setRoute('listing-status-update');
        return;
      }

      if (screenId === 'zone-set') {
        setRoute('zone-set');
        return;
      }

      setRoute('service-settings');
      return;
    }

    setRoute('orders-list');
  }, [openCreateOrderJourney, openTrackedOrder]);

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
    item: { id: string; name?: string; title?: string; priceLabel?: string },
    payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string },
  ) => {
    const normalizedQty = Number.isFinite(payload?.quantity) && (payload?.quantity ?? 0) > 0 ? Number(payload?.quantity) : 1;
    const nextTitle = item.name?.trim() || item.title?.trim() || item.id;

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
          },
        ];
      }

      return current.map((entry, index) => (
        index === existingIndex
          ? {
              ...entry,
              qty: entry.qty + normalizedQty,
            }
          : entry
      ));
    });
  }, [activeStore.id, activeStore.name]);

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
    ['DshAwnakOrderCreateScreen', DshAwnakOrderCreateScreen as unknown],
    ['DshHomeGetScreen', DshHomeGetScreen as unknown],
    ['DshMySpaceScreen', DshMySpaceScreen as unknown],
    ['DshNotificationsScreen', DshNotificationsScreen as unknown],
    ['DshBenefitsHubScreen', DshBenefitsHubScreen as unknown],
    ['DshOrdersListScreen', DshOrdersListScreen as unknown],
    ['DshTrackingScreen', DshTrackingScreen as unknown],
    ['DshSheinOrderCreateScreen', DshSheinOrderCreateScreen as unknown],
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
        onSupport={openOperationDirectory}
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
        onSupport={openOperationDirectory}
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
          setActiveStoreId(resultId);
          setRoute('store-get');
        }}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('search')}
      />
    );
  }

  if (route === 'awnak-order-create') {
    return (
      <DshAwnakOrderCreateScreen
        onBack={openOperationDirectory}
        onContinue={openCreateOrderJourney}
      />
    );
  }

  if (route === 'shein-order-create') {
    return (
      <DshSheinOrderCreateScreen
        onBack={() => setRoute('home')}
      />
    );
  }

  /* 'review' route removed — review stays inside the cart/tracking client journey. */

  if (route === 'benefits') {
    return (
      <DshBenefitsHubScreen
        screenId={selectedOperationScreen as 'subscription-family-get' | 'subscription-family-members-get' | 'subscription-family-members-post' | 'subscription-pro-catalog' | 'subscription-sync' | 'subscription-tier-get' | 'subscription-upgrade-post' | 'loyalty-points-redeem' | 'loyalty-points-client-balance' | 'loyalty-points-client-history' | 'entitlements-get'}
        onPrimaryAction={() => setRoute('home')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('benefits')}
      />
    );
  }

  if (route === 'conversation-workspace') {
    return (
      <DshConversationHubScreen
        screenId={selectedOperationScreen as 'chat-read-ack' | 'chat-send'}
        onPrimaryAction={() => setRoute('orders-list')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('conversation-workspace')}
      />
    );
  }

  if (route === 'order-issue-workspace') {
    return (
      <DshOrderIssueHubScreen
        onPrimaryAction={() => setRoute('orders-list')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('order-issue-workspace')}
      />
    );
  }

  if (route === 'proxy-workspace') {
    return (
      <DshProxyHubScreen
        screenId={selectedOperationScreen as 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking'}
        onPrimaryAction={() => setRoute(selectedOperationScreen === 'proxy-request-tracking' ? 'tracking' : 'orders-list')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('proxy-workspace')}
      />
    );
  }

  if (route === 'listing-status-update') {
    return (
      <DshListingStatusUpdateScreen
        onPrimaryAction={() => setRoute('home')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('listing-status-update')}
      />
    );
  }

  if (route === 'zone-set') {
    return (
      <DshZoneSetScreen
        onPrimaryAction={() => setRoute('home')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('zone-set')}
      />
    );
  }

  if (route === 'service-settings') {
    return (
      <DshServiceSettingsHubScreen
        screenId={selectedOperationScreen as 'listing-status-update' | 'service-modes-resolve' | 'zone-set'}
        onPrimaryAction={() => {
          setRoute('home');
        }}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('service-settings')}
      />
    );
  }

  if (route === 'operations-directory') {
    return <DshClientOperationDirectoryScreen onOpenScreen={openOperationScreen} />;
  }

  if (route === 'operations-screen') {
    const SelectedOperationScreen = clientOperationScreenRegistry[selectedOperationScreen];

    return (
      <SelectedOperationScreen
        onPrimaryAction={() => handleOperationPrimaryAction(selectedOperationScreen)}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('operations-screen')}
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
        clientState={hostClientStates.trackingActive}
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
        setActiveStoreId(storeId);
        setItemsCategory(categoryId);
        setStoreItemsEntryOrigin('home');
        setRoute('store-items');
      }}
      onOpenProduct={(storeId, itemId) => {
        setActiveStoreId(storeId);
        setSelectedItemId(itemId);
        setRoute('cart-get');
      }}
      onOpenBenefits={() => {
        setSelectedOperationScreen('entitlements-get');
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
        setActiveStoreId(storeId);
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
