import React from 'react';
import { BackHandler, Platform, View, Text } from 'react-native';
import { DshSearchScreen } from './families/discovery/screens';
import { DshEntryScreen } from './families/entry/screens';
import { DshAwnakOrderCreateScreen } from './families/awnak/screens';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './families/home/screens';
import { DshMySpaceScreen } from './families/my_space/screens';
import { DshNotificationsScreen } from './families/notifications/screens';
import { DshBenefitsHubScreen } from './families/loyalty/screens';
import { DshOrdersListScreen, DshCreateOrderScreen, DshIntakeHubScreen, DshOrderSuccessState, DshTrackingScreen, DshDeliveryManagementHubScreen } from './families/placeholders/checkoutTracking';
import { DshSheinOrderCreateScreen } from './families/shein/screens';
import { DshStoreGetScreen, DshStoreItemsScreen } from './families/stores/screens';
import { DshCategoriesListScreen, DshCategoryGetScreen } from './families/categories/screens';
import { DshFavoriteToggleScreen, DshFavoritesListScreen } from './families/favorites/screens';
import { DshCartGetScreen } from './families/cart/screens';
import { DshClientSupportDirectoryScreen, clientSupportScreenRegistry, type ClientSupportScreenId, DshConversationHubScreen, DshOrderIssueHubScreen, DshProxyHubScreen, DshServiceSettingsHubScreen, DshTrustHubScreen, DshZoneSetScreen, DshListingStatusUpdateScreen } from './families/support/screens';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
} from './families/home/fixtures/dshHomeGetFixtures';
import {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshDiscoveryStores,
  storeItemsByStoreId,
} from './families/stores/fixtures';
import { getPublishedMarketingHomePromos, recordMarketingBannerClick } from '../shared/marketing/banner-store';
import { getLiveMarketingGrowthItems } from '../shared/marketing/growth-store';
// checkout/tracking screens consolidated into placeholders/checkoutTracking
import { dshCategoryFixtures, dshCategoryListFixtures, getDshCategoryFixture } from './families/categories/fixtures/dshCategoriesFixtures';
import { dshPartnerIntakeItems } from '../shared/partners/workflow';

export type DshRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'notifications'
  | 'store-items'
  | 'awnak-order-create'
  | 'cart-get'
  | 'categories-list'
  | 'category-get'
  | 'favorite-toggle'
  | 'favorites-list'
  | 'search'
  | 'store-get'
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
  | 'support-directory'
  | 'support-screen'
  | 'success'
  | 'orders-list'
  | 'tracking';

export type DshCommandTarget = 'home' | 'orders-list' | 'tracking' | 'create-order' | 'cart-get';

type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
};

type DshSurfaceHostProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
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
  pickupAddress: 'Riyadh Park, Gate 2',
  dropoffAddress: 'Olaya, King Fahad Road',
  contactName: 'Ahmad',
  contactPhone: '0501234567',
  note: '',
};

const initialOrders = [
  {
    id: 'dsh-10021',
    title: 'Order #10021',
    subtitle: 'Riyadh Park to Olaya',
    statusLabel: 'In transit',
    meta: 'ETA 18 min',
  },
  {
    id: 'dsh-10019',
    title: 'Order #10019',
    subtitle: 'Hittin to Al Malqa',
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

  if (target === 'create-order') {
    return 'create-order';
  }

  return 'home';
}

function supportScreenToRoute(screenId: ClientSupportScreenId): DshRoute {
  const intakeTargets: ClientSupportScreenId[] = ['booking-create', 'estimate-create', 'external-order-create', 'gas-refill-order-create'];
  const checkoutTargets: ClientSupportScreenId[] = ['checkout-gate', 'estimate-get', 'pricing-preview', 'pricing-snapshot-get', 'promo-apply'];
  const conversationTargets: ClientSupportScreenId[] = ['chat-read-ack', 'chat-send'];
  const deliveryManagementTargets: ClientSupportScreenId[] = ['delivery-attempt-create', 'delivery-attempts-list', 'delivery-close', 'delivery-reassign'];
  const subscriptionTargets: ClientSupportScreenId[] = ['subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post'];
  const loyaltyTargets: ClientSupportScreenId[] = ['loyalty-points-redeem', 'loyalty-points-user-balance', 'loyalty-points-user-history', 'entitlements-get'];
  const proxyTargets: ClientSupportScreenId[] = ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review', 'proxy-request-reject', 'proxy-request-tracking'];
  const settingsTargets: ClientSupportScreenId[] = ['service-modes-resolve'];
  const listingTargets: ClientSupportScreenId[] = ['listing-status-update'];
  const externalTargets: ClientSupportScreenId[] = ['gas-refill-order-create'];
  const zoneTargets: ClientSupportScreenId[] = ['zone-set'];
  const issueTargets: ClientSupportScreenId[] = ['order-issue-flag'];
  const trustTargets: ClientSupportScreenId[] = ['order-proof-code-generate', 'order-proof-verify', 'order-escrow-hold', 'order-escrow-release'];

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

  return 'support-screen';
}

export function DshSurfaceHost({ command, onExit }: DshSurfaceHostProps) {
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
  const [storeItemsEntryOrigin, setStoreItemsEntryOrigin] = React.useState<'home' | 'store-get'>('home');
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<ClientSupportScreenId>('checkout-gate');
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
        { id: 'base', label: 'Delivery fee', value: '22 SAR' },
        { id: 'eta', label: 'Estimated time', value: '25 min' },
      ],
    }),
    [createOrderValues],
  );

  const trackingTimeline = React.useMemo(
    () => [
      { id: 'created', title: 'Order created', detail: 'Your request was confirmed.', done: true },
      { id: 'assigned', title: 'Captain assigned', detail: 'A captain accepted your order.', done: true },
      { id: 'pickup', title: 'Pickup in progress', detail: 'Captain is heading to pickup location.', done: false },
      { id: 'dropoff', title: 'On the way to dropoff', detail: 'Live tracking will appear here.', done: false },
    ],
    [],
  );

  const handleCreateOrderChange = React.useCallback((field: keyof CreateOrderValues, value: string) => {
    setCreateOrderValues((current) => ({ ...current, [field]: value }));
  }, []);

  const openSupportDirectory = React.useCallback(() => {
    setRoute('support-directory');
  }, []);

  const openSupportScreen = React.useCallback((screenId: ClientSupportScreenId) => {
    setSelectedSupportScreen(screenId);
    setRoute(supportScreenToRoute(screenId));
  }, []);

  const handleSupportPrimaryAction = React.useCallback((screenId: ClientSupportScreenId) => {
    const awnakTargets: ClientSupportScreenId[] = ['awnak-order-create'];
    const createTargets: ClientSupportScreenId[] = ['booking-create', 'estimate-create', 'external-order-create', 'gas-refill-order-create', 'order-create'];
    const deliveryTargets: ClientSupportScreenId[] = ['delivery-attempt-create', 'delivery-attempts-list', 'delivery-close', 'delivery-eta-get', 'delivery-get', 'delivery-reassign', 'delivery-track-get', 'order-status-get', 'order-status-update'];
    const checkoutTargets: ClientSupportScreenId[] = ['checkout-gate', 'estimate-get', 'pricing-preview', 'pricing-snapshot-get', 'promo-apply'];
    const orderTargets: ClientSupportScreenId[] = ['order-accept', 'order-cancel', 'order-complete', 'order-get', 'order-receipt-get'];
    const issueTargets: ClientSupportScreenId[] = ['order-issue-flag'];
    const trustTargets: ClientSupportScreenId[] = ['order-proof-code-generate', 'order-proof-verify', 'order-escrow-hold', 'order-escrow-release'];
    const reviewTargets: ClientSupportScreenId[] = ['order-rate', 'review-create'];
    const reviewHistoryTargets: ClientSupportScreenId[] = ['reviews-list'];
    const subscriptionTargets: ClientSupportScreenId[] = ['subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post'];
    const loyaltyTargets: ClientSupportScreenId[] = ['loyalty-points-redeem', 'loyalty-points-user-balance', 'loyalty-points-user-history'];
    const proxyRequestTargets: ClientSupportScreenId[] = ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review'];
    const proxyRejectTargets: ClientSupportScreenId[] = ['proxy-request-reject'];
    const proxyTrackingTargets: ClientSupportScreenId[] = ['proxy-request-tracking'];

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
    ['DshCategoriesListScreen', (DshCategoriesListScreen as unknown) as any],
    ['DshCategoryGetScreen', (DshCategoryGetScreen as unknown) as any],
    ['DshFavoriteToggleScreen', (DshFavoriteToggleScreen as unknown) as any],
    ['DshFavoritesListScreen', (DshFavoritesListScreen as unknown) as any],
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
    console.error('DshSurfaceHost missing imports:', missing);
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
        subscriptionLabel={subscriptionMarketingProgram ? `${subscriptionMarketingProgram.title} · ${subscriptionMarketingProgram.highlight}` : undefined}
        offersLabel={campaignMarketingProgram ? `${campaignMarketingProgram.title} · ${campaignMarketingProgram.highlight}` : undefined}
        discountsLabel={promoMarketingProgram ? `${promoMarketingProgram.title} · ${promoMarketingProgram.routeTarget}` : undefined}
        marketingPrograms={liveMarketingPrograms.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          meta: item.routeTarget,
          badgeLabel: item.family === 'subscription' ? 'اشتراك' : item.family === 'promotion' ? 'برومو' : item.family === 'shorts' ? 'شورتات' : 'حملة',
        }))}
        onOpenBenefits={() => {
          setSelectedSupportScreen('entitlements-get');
          setRoute('benefits');
        }}
        onOpenSubscriptions={() => {
          setSelectedSupportScreen('subscription-family-get');
          setRoute('benefits');
        }}
        onOpenPreferences={() => {
          setSelectedSupportScreen('service-modes-resolve');
          setRoute('service-settings');
        }}
        onOpenOffers={() => setRoute('home')}
        onOpenDiscounts={() => {
          setSelectedSupportScreen('promo-apply');
          setRoute('checkout-workspace');
        }}
        onOpenOrders={() => setRoute('orders-list')}
        onChangeAddress={() => {
          setSelectedSupportScreen('zone-set');
          setRoute('service-settings');
        }}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('my-space')}
      />
    );
  }

  if (route === 'notifications') {
    return (
      <DshNotificationsScreen
        onOpenMySpace={() => setRoute('my-space')}
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
          deliveryFeeLabel: 'رسوم التوصيل 12 ر.س',
          followersLabel: `${activeStore.followerCount.toLocaleString()} متابع`,
          priceMatchLabel: 'الأسعار مطابقة للمطعم',
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
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('store-get')}
        onSupport={openSupportDirectory}
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
    // Build a demo cart with a few items from the active store so the cart screen
    // demonstrates a multi-item, interactive experience instead of a single-line preview.
    const parsePriceLabel = (label?: string) => {
      if (!label) return 0;
      const n = Number(String(label).replace(/[^0-9.,-]/g, '').replace(',', '.'));
      return Number.isFinite(n) ? n : 0;
    };

    const demoCartItems = activeStoreItems.slice(0, 3).map((it) => ({
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
        items={demoCartItems}
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
        onOpenOrder={() => setRoute('create-order')}
        onContinue={() => setRoute('create-order')}
        onRetry={() => setRoute('cart-get')}
      />
      );
  }

  if (route === 'categories-list') {
    return (
      <DshCategoriesListScreen
        items={publishedCategoryListFixtures}
        onOpenCategory={(categoryId) => {
          setItemsCategory(categoryId);
          if (categoryId === 'shein') {
            setSheinInlineOpen(true);
            setRoute('home');
            return;
          }

          setRoute(categoryId === 'awnak' ? 'awnak-order-create' : 'category-get');
        }}
        onOpenFavorites={() => setRoute('favorites-list')}
        onBack={() => setRoute('home')}
        onRetry={() => setRoute('categories-list')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'category-get') {
    const category = getDshCategoryFixture(itemsCategory);
    return (
      <DshCategoryGetScreen
        category={{
          id: category?.id ?? itemsCategory,
          label: category?.label ?? (itemsCategory === 'all' ? 'جميع الفئات' : itemsCategory),
          subtitle: category?.subtitle ?? 'تفاصيل مختصرة للفئة الحالية داخل مسار الاستكشاف.',
          summary: category?.subcategories.length
            ? `فئة رئيسية تحتوي على ${category.subcategories.length} فئات فرعية جاهزة للاستكشاف.`
            : 'افتح قائمة الفئات للمتابعة مع هذه الفئة.',
          itemCountLabel: category?.subcategories.length ? `${category.subcategories.length} فئات فرعية` : 'تفاصيل الفئة جاهزة',
          subcategories: category?.subcategories,
        }}
        onOpenList={() => setRoute('store-items')}
        onBack={() => setRoute('categories-list')}
        onRetry={() => setRoute('category-get')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'favorite-toggle') {
    return (
      <DshFavoriteToggleScreen
        itemLabel={selectedItem?.name ?? 'Saved item'}
        currentFavorite={Boolean(activeStore.isOffer)}
        onToggleFavorite={() => undefined}
        onOpenFavorites={() => setRoute('favorites-list')}
        onBack={() => setRoute('category-get')}
        onRetry={() => setRoute('favorite-toggle')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'favorites-list') {
    return (
      <DshFavoritesListScreen
        items={[
          { id: 'store-1001', name: 'أسواق العليا الطازجة', subtitle: 'مقاضي يومية ومنتجات طازجة', meta: 'متجر مفضل' },
          { id: 'item-apple-1', name: 'تفاح رويال غالا', subtitle: 'صندوق طازج 1 كجم', meta: 'عنصر محفوظ' },
        ]}
        onOpenItem={() => setRoute('favorite-toggle')}
        onBack={() => setRoute('categories-list')}
        onRetry={() => setRoute('favorites-list')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'search') {
    return (
      <DshSearchScreen
        query={storesQuery}
        results={filteredSearchStores.map((store) => ({ id: store.id, title: store.name, subtitle: store.subtitle, meta: store.meta }))}
        onQueryChange={setStoresQuery}
        onOpenCategories={() => setRoute('categories-list')}
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
        onChange={handleCreateOrderChange}
        onContinue={() => setRoute('create-order')}
      />
    );
  }

  if (route === 'awnak-order-create') {
    return (
      <DshAwnakOrderCreateScreen
        onBack={openSupportDirectory}
        onContinue={() => setRoute('create-order')}
      />
    );
  }

  if (route === 'shein-order-create') {
    return (
      <DshSheinOrderCreateScreen
        onBack={() => setRoute('categories-list')}
      />
    );
  }

  /* 'review' route removed — review is shown inline inside the create-order flow. */

  if (route === 'checkout-workspace') {
    // Render the create-order screen inline instead of a separate checkout wrapper
    return (
      <DshCreateOrderScreen
        screenId={selectedSupportScreen as 'checkout-gate' | 'estimate-get' | 'pricing-preview' | 'pricing-snapshot-get' | 'promo-apply'}
        onPrimaryAction={() => setRoute('create-order')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('checkout-workspace')}
      />
    );
  }

  if (route === 'intake-workspace') {
    return (
      <DshIntakeHubScreen
        screenId={selectedSupportScreen as 'booking-create' | 'estimate-create' | 'external-order-create' | 'gas-refill-order-create'}
        onPrimaryAction={() => setRoute(selectedSupportScreen === 'estimate-create' ? 'checkout-workspace' : 'create-order')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('intake-workspace')}
      />
    );
  }

  if (route === 'benefits') {
    return (
      <DshBenefitsHubScreen
        screenId={selectedSupportScreen as 'subscription-family-get' | 'subscription-family-members-get' | 'subscription-family-members-post' | 'subscription-pro-catalog' | 'subscription-sync' | 'subscription-tier-get' | 'subscription-upgrade-post' | 'loyalty-points-redeem' | 'loyalty-points-user-balance' | 'loyalty-points-user-history' | 'entitlements-get'}
        onPrimaryAction={() => setRoute('home')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('benefits')}
      />
    );
  }

  if (route === 'conversation-workspace') {
    return (
      <DshConversationHubScreen
        screenId={selectedSupportScreen as 'chat-read-ack' | 'chat-send'}
        onPrimaryAction={() => setRoute('orders-list')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('conversation-workspace')}
      />
    );
  }

  if (route === 'delivery-management-workspace') {
    return (
      <DshDeliveryManagementHubScreen
        screenId={selectedSupportScreen as 'delivery-attempt-create' | 'delivery-attempts-list' | 'delivery-close' | 'delivery-reassign'}
        onPrimaryAction={() => setRoute('tracking')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('delivery-management-workspace')}
      />
    );
  }

  if (route === 'order-issue-workspace') {
    return (
      <DshOrderIssueHubScreen
        onPrimaryAction={() => setRoute('orders-list')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('order-issue-workspace')}
      />
    );
  }

  if (route === 'proxy-workspace') {
    return (
      <DshProxyHubScreen
        screenId={selectedSupportScreen as 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking'}
        onPrimaryAction={() => setRoute(selectedSupportScreen === 'proxy-request-tracking' ? 'tracking' : 'orders-list')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('proxy-workspace')}
      />
    );
  }

  if (route === 'trust-workspace') {
    return (
      <DshTrustHubScreen
        screenId={selectedSupportScreen as 'order-proof-code-generate' | 'order-proof-verify' | 'order-escrow-hold' | 'order-escrow-release'}
        onPrimaryAction={() => setRoute('orders-list')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('trust-workspace')}
      />
    );
  }

  if (route === 'listing-status-update') {
    return (
      <DshListingStatusUpdateScreen
        onPrimaryAction={() => setRoute('home')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('listing-status-update')}
      />
    );
  }

  if (route === 'zone-set') {
    return (
      <DshZoneSetScreen
        onPrimaryAction={() => setRoute('home')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('zone-set')}
      />
    );
  }

  if (route === 'service-settings') {
    return (
      <DshServiceSettingsHubScreen
        screenId={selectedSupportScreen as 'listing-status-update' | 'service-modes-resolve' | 'zone-set'}
        onPrimaryAction={() => {
          setRoute('home');
        }}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('service-settings')}
      />
    );
  }

  if (route === 'success') {
    return <DshOrderSuccessState onNext={() => setRoute('tracking')} />;
  }

  if (route === 'support-directory') {
    return <DshClientSupportDirectoryScreen onOpenScreen={openSupportScreen} />;
  }

  if (route === 'support-screen') {
    const SelectedSupportScreen = clientSupportScreenRegistry[selectedSupportScreen];

    return (
      <SelectedSupportScreen
        onPrimaryAction={() => handleSupportPrimaryAction(selectedSupportScreen)}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('support-screen')}
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
        currentStatusLabel="On route"
        timeline={trackingTimeline}
        onSupport={openSupportDirectory}
        onRetry={() => setRoute('tracking')}
        onNextAction={() => setRoute('orders-list')}
      />
    );
  }

  return (
    <DshHomeGetScreen
      categories={dshCategoryListFixtures}
      promos={resolvePublishedHomePromos() as DshHomeGetPromo[]}
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
      onOpenList={() => setRoute('categories-list')}
      onOpenCategory={(categoryId) => {
        setItemsCategory(categoryId);
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

        setRoute('category-get');
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
        setSelectedSupportScreen('entitlements-get');
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
      onRetry={() => setRoute('home')}
    />
  );
}

export default DshSurfaceHost;