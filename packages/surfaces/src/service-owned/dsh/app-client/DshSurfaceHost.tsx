import React from 'react';
import { BackHandler, Platform, View, Text } from 'react-native';
import { DshSearchScreen } from './discovery/screens';
import { DshEntryScreen } from './entry/screens';
import { DshClientBellScreen } from './bell';
import { DshAwnakOrderCreateScreen } from './awnak/screens';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './home/screens';
import { DshMySpaceScreen } from './my_space/screens';
import { DshNotificationsScreen } from './notifications/screens';
import { DshBenefitsHubScreen } from './subscriptions/screens';
import { DshOrdersListScreen, DshCreateOrderScreen, DshIntakeHubScreen, DshOrderSuccessState, DshTrackingScreen, DshDeliveryManagementHubScreen } from './checkout/screens';
import { DshSheinOrderCreateScreen } from './shein/screens';
import { DshStoreGetScreen, DshStoreItemsScreen } from './stores/screens';
import { DshFavoriteToggleScreen, DshFavoritesListScreen } from './favorites/screens';
import { DshCartGetScreen } from './cart/screens';
import { DshClientOperationDirectoryScreen, clientOperationScreenRegistry, type ClientOperationScreenId, DshConversationHubScreen, DshOrderIssueHubScreen, DshProxyHubScreen, DshServiceSettingsHubScreen, DshTrustHubScreen, DshZoneSetScreen, DshListingStatusUpdateScreen } from './operations/screens';
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
import { getPublishedMarketingHomePromos, recordMarketingBannerClick } from '../shared/marketing/banner-store';
import { getLiveMarketingGrowthItems } from '../shared/marketing/growth-store';
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
  | 'create-order'
  | 'checkout-workspace'
  | 'benefits'
  | 'conversation-workspace'
  | 'delivery-management-workspace'
  | 'intake-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'shein-order-create'
  | 'service-settings'
  | 'trust-workspace'
  | 'zone-set'
  | 'operations-directory'
  | 'operations-screen'
  | 'success'
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
const publishedProductIds = new Set(
  dshPartnerIntakeItems
    .filter((item) => item.stage === 'published')
    .map((item) => item.id),
);

function resolvePublishedHomePromos() {
  const applyPublishingRules = (promos: DshHomeGetPromo[]) => promos.filter((promo) => {
    if (promo.actionType === 'main_category' || promo.actionType === 'sub_category') {
      return promo.actionTarget ? publishedPromoCategoryIds.has(promo.actionTarget) : false;
    }

    if (promo.actionType === 'product') {
      return promo.actionTarget ? publishedProductIds.has(promo.actionTarget) : false;
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

const initialOrders = [
  {
    id: 'dsh-10021',
    title: 'Order #10021',
    subtitle: 'Hadda to Bab Al-Yemen',
    statusLabel: 'In transit',
    meta: 'ETA 18 min',
  },
  {
    id: 'dsh-10019',
    title: 'Order #10019',
    subtitle: 'Sabeen to Tahrir',
    statusLabel: 'Delivered',
    meta: 'Today 03:10 PM',
  },
];


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
    return 'create-order';
  }

  return 'home';
}

function operationScreenToRoute(screenId: ClientOperationScreenId): DshRoute {
  const intakeTargets: ClientOperationScreenId[] = ['booking-create', 'estimate-create', 'external-order-create', 'gas-refill-order-create'];
  const checkoutTargets: ClientOperationScreenId[] = ['checkout-gate', 'estimate-get', 'pricing-preview', 'pricing-snapshot-get', 'promo-apply'];
  const conversationTargets: ClientOperationScreenId[] = ['chat-read-ack', 'chat-send'];
  const deliveryManagementTargets: ClientOperationScreenId[] = ['delivery-attempt-create', 'delivery-attempts-list', 'delivery-close', 'delivery-reassign'];
  const subscriptionTargets: ClientOperationScreenId[] = ['subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post'];
  const loyaltyTargets: ClientOperationScreenId[] = ['loyalty-points-redeem', 'loyalty-points-user-balance', 'loyalty-points-user-history', 'entitlements-get'];
  const proxyTargets: ClientOperationScreenId[] = ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review', 'proxy-request-reject', 'proxy-request-tracking'];
  const settingsTargets: ClientOperationScreenId[] = ['service-modes-resolve'];
  const listingTargets: ClientOperationScreenId[] = ['listing-status-update'];
  const externalTargets: ClientOperationScreenId[] = ['gas-refill-order-create'];
  const zoneTargets: ClientOperationScreenId[] = ['zone-set'];
  const issueTargets: ClientOperationScreenId[] = ['order-issue-flag'];
  const trustTargets: ClientOperationScreenId[] = ['order-proof-code-generate', 'order-proof-verify', 'order-escrow-hold', 'order-escrow-release'];

  if (intakeTargets.includes(screenId)) {
    return 'intake-workspace';
  }

  if (externalTargets.includes(screenId)) {
    return 'intake-workspace';
  }

  if (checkoutTargets.includes(screenId)) {
    return 'checkout-workspace';
  }

  if (conversationTargets.includes(screenId)) {
    return 'conversation-workspace';
  }

  if (deliveryManagementTargets.includes(screenId)) {
    return 'delivery-management-workspace';
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

  if (externalTargets.includes(screenId)) {
    return 'intake-workspace';
  }

  if (zoneTargets.includes(screenId)) {
    return 'zone-set';
  }

  if (issueTargets.includes(screenId)) {
    return 'order-issue-workspace';
  }

  if (trustTargets.includes(screenId)) {
    return 'trust-workspace';
  }

  return 'operations-screen';
}

export function DshSurfaceHost({ command, onExit, onOpenService, renderApprovedVideoReelsViewer }: DshSurfaceHostProps) {
  const [route, setRoute] = React.useState<DshRoute>('home');
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [ordersQuery, setOrdersQuery] = React.useState('');
  const [storesQuery, setStoresQuery] = React.useState('');
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('checkout-gate');
  const routeHistoryRef = React.useRef<DshRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);

  React.useEffect(() => {
    setRoute(commandTargetToRoute(command.target));
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

  const reviewBlocks = React.useMemo(
    () => ({
      route: [
        { id: 'pickup', label: 'Pickup', value: createOrderValues.pickupAddress || 'Not provided' },
        { id: 'dropoff', label: 'Dropoff', value: createOrderValues.dropoffAddress || 'Not provided' },
      ],
      contact: [
        { id: 'name', label: 'Contact name', value: createOrderValues.contactName || 'Not provided' },
        { id: 'phone', label: 'Contact phone', value: createOrderValues.contactPhone || 'Not provided' },
      ],
      pricing: [
        { id: 'base', label: 'Delivery fee', value: '22 YER' },
        { id: 'eta', label: 'Estimated time', value: '25 min' },
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

  const openOperationDirectory = React.useCallback(() => {
    setRoute('operations-directory');
  }, []);

  const openOperationScreen = React.useCallback((screenId: ClientOperationScreenId) => {
    setSelectedOperationScreen(screenId);
    setRoute(operationScreenToRoute(screenId));
  }, []);

  const handleOperationPrimaryAction = React.useCallback((screenId: ClientOperationScreenId) => {
    const awnakTargets: ClientOperationScreenId[] = ['awnak-order-create'];
    const createTargets: ClientOperationScreenId[] = ['booking-create', 'estimate-create', 'external-order-create', 'gas-refill-order-create', 'order-create'];
    const deliveryTargets: ClientOperationScreenId[] = ['delivery-attempt-create', 'delivery-attempts-list', 'delivery-close', 'delivery-eta-get', 'delivery-get', 'delivery-reassign', 'delivery-track-get', 'order-status-get', 'order-status-update'];
    const checkoutTargets: ClientOperationScreenId[] = ['checkout-gate', 'estimate-get', 'pricing-preview', 'pricing-snapshot-get', 'promo-apply'];
    const orderTargets: ClientOperationScreenId[] = ['order-accept', 'order-cancel', 'order-complete', 'order-get', 'order-receipt-get'];
    const issueTargets: ClientOperationScreenId[] = ['order-issue-flag'];
    const trustTargets: ClientOperationScreenId[] = ['order-proof-code-generate', 'order-proof-verify', 'order-escrow-hold', 'order-escrow-release'];
    const reviewTargets: ClientOperationScreenId[] = ['order-rate', 'review-create'];
    const reviewHistoryTargets: ClientOperationScreenId[] = ['reviews-list'];
    const subscriptionTargets: ClientOperationScreenId[] = ['subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post'];
    const loyaltyTargets: ClientOperationScreenId[] = ['loyalty-points-redeem', 'loyalty-points-user-balance', 'loyalty-points-user-history'];
    const proxyRequestTargets: ClientOperationScreenId[] = ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review'];
    const proxyRejectTargets: ClientOperationScreenId[] = ['proxy-request-reject'];
    const proxyTrackingTargets: ClientOperationScreenId[] = ['proxy-request-tracking'];

    if (awnakTargets.includes(screenId)) {
      setRoute('awnak-order-create');
      return;
    }

    if (createTargets.includes(screenId)) {
      setRoute(screenId === 'order-create' ? 'create-order' : 'intake-workspace');
      return;
    }

    if (checkoutTargets.includes(screenId)) {
      setRoute('create-order');
      return;
    }

    if (deliveryTargets.includes(screenId)) {
      setRoute(
        screenId === 'delivery-attempt-create' || screenId === 'delivery-attempts-list' || screenId === 'delivery-close' || screenId === 'delivery-reassign'
          ? 'delivery-management-workspace'
          : 'tracking',
      );
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
      setRoute('trust-workspace');
      return;
    }

    if (reviewTargets.includes(screenId)) {
      setRoute('create-order');
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
  }, []);

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

  const liveMarketingPrograms = getLiveMarketingGrowthItems('client');
  const liveMarketingShorts = liveMarketingPrograms.filter((item) => item.family === 'shorts');
  const subscriptionMarketingProgram = liveMarketingPrograms.find((item) => item.family === 'subscription');
  const promoMarketingProgram = liveMarketingPrograms.find((item) => item.family === 'promotion');
  const campaignMarketingProgram = liveMarketingPrograms.find((item) => item.family === 'campaign');

  // Sanity check: if any imported screen component is undefined, show a clear error
  const importedScreens = [
    ['DshSearchScreen', (DshSearchScreen as unknown) as any],
    ['DshEntryScreen', (DshEntryScreen as unknown) as any],
    ['DshAwnakOrderCreateScreen', (DshAwnakOrderCreateScreen as unknown) as any],
    ['DshHomeGetScreen', (DshHomeGetScreen as unknown) as any],
    ['DshMySpaceScreen', (DshMySpaceScreen as unknown) as any],
    ['DshNotificationsScreen', (DshNotificationsScreen as unknown) as any],
    ['DshBenefitsHubScreen', (DshBenefitsHubScreen as unknown) as any],
    ['DshOrdersListScreen', (DshOrdersListScreen as unknown) as any],
    ['DshCreateOrderScreen', (DshCreateOrderScreen as unknown) as any],
    ['DshIntakeHubScreen', (DshIntakeHubScreen as unknown) as any],
    ['DshOrderSuccessState', (DshOrderSuccessState as unknown) as any],
    ['DshTrackingScreen', (DshTrackingScreen as unknown) as any],
    ['DshDeliveryManagementHubScreen', (DshDeliveryManagementHubScreen as unknown) as any],
    ['DshSheinOrderCreateScreen', (DshSheinOrderCreateScreen as unknown) as any],
    ['DshStoreGetScreen', (DshStoreGetScreen as unknown) as any],
    ['DshStoreItemsScreen', (DshStoreItemsScreen as unknown) as any],
    ['DshFavoriteToggleScreen', (DshFavoriteToggleScreen as unknown) as any],
    ['DshFavoritesListScreen', (DshFavoritesListScreen as unknown) as any],
    ['DshClientBellScreen', (DshClientBellScreen as unknown) as any],
    ['DshCartGetScreen', (DshCartGetScreen as unknown) as any],
    ['DshConversationHubScreen', (DshConversationHubScreen as unknown) as any],
    ['DshOrderIssueHubScreen', (DshOrderIssueHubScreen as unknown) as any],
    ['DshProxyHubScreen', (DshProxyHubScreen as unknown) as any],
    ['DshServiceSettingsHubScreen', (DshServiceSettingsHubScreen as unknown) as any],
    ['DshTrustHubScreen', (DshTrustHubScreen as unknown) as any],
    ['DshZoneSetScreen', (DshZoneSetScreen as unknown) as any],
    ['DshListingStatusUpdateScreen', (DshListingStatusUpdateScreen as unknown) as any],
  ];

  const missing = importedScreens.filter(([, v]) => typeof v === 'undefined').map(([n]) => String(n));
  if (missing.length > 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Missing components</Text>
        <Text style={{ color: 'white' }}>{missing.join(', ')}</Text>
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
        onOpenTracking={() => setRoute('tracking')}
        onRepeatOrder={() => setRoute('create-order')}
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
        onOpenTracking={() => setRoute('tracking')}
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
        onSupport={openOperationDirectory}
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
    // Build a cart preview with a few items from the active store so the cart screen
    // demonstrates a multi-item, interactive experience instead of a single-line preview.
    const parsePriceLabel = (label?: string) => {
      if (!label) return 0;
      const n = Number(String(label).replace(/[^0-9.,-]/g, '').replace(',', '.'));
      return Number.isFinite(n) ? n : 0;
    };

    const cartPreviewItems = activeStoreItems.slice(0, 3).map((it) => ({
      id: it.id,
      title: it.name,
      subtitle: it.subtitle,
      priceValue: Number(it.priceValue ?? parsePriceLabel(it.priceLabel)),
      qty: 1,
    }));

    return (
      <DshCartGetScreen
        store={{
          id: activeStore.id,
          name: activeStore.name,
          subtitle: activeStore.subtitle,
          statusLabel: activeStore.statusLabel,
          ratingLabel: '4.8 / 5 quality confidence',
        }}
        // provide structured items to the cart screen so it can render a true basket
        items={cartPreviewItems}
        activeOrder={{
          id: selectedItem?.id ?? 'cart-preview',
          title: selectedItem ? `Cart includes ${selectedItem.name}` : 'Cart ready for checkout',
          subtitle: selectedItem
            ? `${selectedItem.subtitle} from ${activeStore.name}`
            : `Items from ${activeStore.name}`,
          meta: selectedItem ? (selectedItem.priceLabel ?? 'Review items and continue') : 'Review items and continue',
          statusLabel: 'Ready',
        }}
        statusTitle="Cart context confirmed"
        statusDescription="Initialize the cart session before moving into the checkout route."
        onOpenStore={() => setRoute('store-get')}
        onOpenService={onOpenService}
        onOpenOrder={() => setRoute('create-order')}
        onContinue={() => setRoute('create-order')}
        onRetry={() => setRoute('cart-get')}
      />
      );
  }

  if (route === 'favorite-toggle') {
    return (
      <DshFavoriteToggleScreen
        itemLabel={selectedItem?.name ?? 'Saved item'}
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

  if (route === 'create-order') {
    return (
      <DshCreateOrderScreen
        values={createOrderValues}
        timeline={trackingTimeline}
        onChange={handleCreateOrderChange}
        onContinue={() => setRoute('create-order')}
        onBack={() => setRoute('cart-get')}
      />
    );
  }

  if (route === 'awnak-order-create') {
    return (
      <DshAwnakOrderCreateScreen
        onBack={openOperationDirectory}
        onContinue={() => setRoute('create-order')}
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

  /* 'review' route removed — review is shown inline inside the create-order flow. */

  if (route === 'checkout-workspace') {
    // Render the create-order screen inline instead of a separate checkout wrapper
    return (
      <DshCreateOrderScreen
        screenId={selectedOperationScreen as 'checkout-gate' | 'estimate-get' | 'pricing-preview' | 'pricing-snapshot-get' | 'promo-apply'}
        onPrimaryAction={() => setRoute('create-order')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('checkout-workspace')}
      />
    );
  }

  if (route === 'intake-workspace') {
    return (
      <DshIntakeHubScreen
        screenId={selectedOperationScreen as 'booking-create' | 'estimate-create' | 'external-order-create' | 'gas-refill-order-create'}
        onPrimaryAction={() => setRoute(selectedOperationScreen === 'estimate-create' ? 'checkout-workspace' : 'create-order')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('intake-workspace')}
      />
    );
  }

  if (route === 'benefits') {
    return (
      <DshBenefitsHubScreen
        screenId={selectedOperationScreen as 'subscription-family-get' | 'subscription-family-members-get' | 'subscription-family-members-post' | 'subscription-pro-catalog' | 'subscription-sync' | 'subscription-tier-get' | 'subscription-upgrade-post' | 'loyalty-points-redeem' | 'loyalty-points-user-balance' | 'loyalty-points-user-history' | 'entitlements-get'}
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

  if (route === 'delivery-management-workspace') {
    return (
      <DshDeliveryManagementHubScreen
        screenId={selectedOperationScreen as 'delivery-attempt-create' | 'delivery-attempts-list' | 'delivery-close' | 'delivery-reassign'}
        onPrimaryAction={() => setRoute('tracking')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('delivery-management-workspace')}
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

  if (route === 'trust-workspace') {
    return (
      <DshTrustHubScreen
        screenId={selectedOperationScreen as 'order-proof-code-generate' | 'order-proof-verify' | 'order-escrow-hold' | 'order-escrow-release'}
        onPrimaryAction={() => setRoute('orders-list')}
        onSecondaryAction={openOperationDirectory}
        onRetry={() => setRoute('trust-workspace')}
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

  if (route === 'success') {
    return <DshOrderSuccessState onNext={() => setRoute('tracking')} />;
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
        onOpenOrder={() => setRoute('tracking')}
      />
    );
  }

  if (route === 'tracking') {
    return (
      <DshTrackingScreen
        values={createOrderValues}
        currentStatusLabel="في الطريق"
        timeline={trackingTimeline}
        onBell={() => setRoute('bell')}
        onSupport={openOperationDirectory}
        onRetry={() => setRoute('tracking')}
        onNextAction={() => setRoute('orders-list')}
      />
    );
  }

  if (route === 'bell') {
    return (
      <DshClientBellScreen
        onOpenTracking={() => setRoute('tracking')}
        onOpenOrders={() => setRoute('orders-list')}
        onBack={() => setRoute('tracking')}
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
      onOpenTracking={() => setRoute('tracking')}
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

