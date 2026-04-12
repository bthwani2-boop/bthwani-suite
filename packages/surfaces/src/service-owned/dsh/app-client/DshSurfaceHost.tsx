import React from 'react';
import { DshSearchScreen } from './families/discovery/screens';
import { DshEntryScreen } from './families/entry/screens';
import { DshAwnakOrderCreateScreen } from './families/awnak/screens';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './families/home/screens';
import { DshBenefitsHubScreen } from './families/loyalty/screens';
import { DshOrdersListScreen } from './families/orders/screens';
import { DshSheinInfoScreen } from './families/shein/screens';
import { DshStoresListScreen, DshStoreGetScreen, DshStoreDetailScreen, DshStoreItemsScreen, DshStoreItemsListScreen } from './families/stores/screens';
import { DshCategoriesListScreen, DshCategoryGetScreen } from './families/categories/screens';
import { DshFavoriteToggleScreen, DshFavoritesListScreen } from './families/favorites/screens';
import { DshCartGetScreen, DshCartInitScreen, DshCartItemAddScreen, DshCartItemRemoveScreen, DshCartItemUpdateScreen } from './families/cart/screens';
import { DshCheckoutHubScreen, DshReviewOrderScreen, DshCreateOrderScreen, DshIntakeHubScreen } from './families/checkout/screens';
import { DshTrackingScreen, DshDeliveryManagementHubScreen } from './families/tracking/screens';
import { DshClientSupportDirectoryScreen, clientSupportScreenRegistry, type ClientSupportScreenId, DshConversationHubScreen, DshOrderIssueHubScreen, DshProxyHubScreen, DshServiceSettingsHubScreen, DshTrustHubScreen, DshZoneSetScreen, DshListingStatusUpdateScreen } from './families/support/screens';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
} from './families/home/fixtures/dshHomeGetFixtures';
import { DshOrderSuccessState } from './families/orders/screens';
import { dshCategoryListFixtures, getDshCategoryFixture } from './families/categories/fixtures/dshCategoriesFixtures';

export type DshRoute =
  | 'home'
  | 'entry'
  | 'stores-list'
  | 'store-detail'
  | 'store-items'
  | 'store-items-list'
  | 'awnak-order-create'
  | 'cart-get'
  | 'cart-init'
  | 'cart-item-add'
  | 'cart-item-remove'
  | 'cart-item-update'
  | 'categories-list'
  | 'category-get'
  | 'favorite-toggle'
  | 'favorites-list'
  | 'search'
  | 'store-get'
  | 'create-order'
  | 'review'
  | 'checkout-workspace'
  | 'benefits'
  | 'conversation-workspace'
  | 'delivery-management-workspace'
  | 'intake-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'shein-info'
  | 'service-settings'
  | 'trust-workspace'
  | 'zone-set'
  | 'support-directory'
  | 'support-screen'
  | 'success'
  | 'orders-list'
  | 'tracking';

export type DshCommandTarget = 'home' | 'stores-list' | 'orders-list' | 'tracking' | 'create-order' | 'cart-get' | 'cart-init';

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

type StoreItem = {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
};

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

const dshDiscoveryStores = [
  {
    id: 'store-1001',
    name: 'Olaya Fresh Market',
    subtitle: 'Groceries and daily essentials',
    statusLabel: 'Open',
    meta: 'ETA 18 min',
    etaMinutes: 18,
    distanceKm: 2.1,
    rating: 5,
    isOffer: true,
    isFavorite: true,
    isFollowing: false,
    imageUri: '',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'توصيل برو',
    followerCount: 11000,
    multiplierLabel: 'x2',
    subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
    offerLabel: 'خصم 20%',
    hasBthwaniPro: true,
    hasNewProducts: true,
    hasCouponAvailable: false,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  },
  {
    id: 'store-1002',
    name: 'Hittin Bakery',
    subtitle: 'Bread and pastries',
    statusLabel: 'Open',
    meta: 'ETA 25 min',
    etaMinutes: 25,
    distanceKm: 1.8,
    rating: 4.8,
    isOffer: false,
    isFavorite: false,
    isFollowing: false,
    imageUri: '',
    deliveryLabel: 'كوبون',
    serviceLabel: 'توصيل برو',
    followerCount: 9000,
    multiplierLabel: 'x1',
    subscriptionPackageChips: ['كوبون', 'توصيل مجاني'],
    hasBthwaniPro: true,
    hasNewProducts: false,
    hasCouponAvailable: true,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  },
  {
    id: 'store-1003',
    name: 'Malqa Kitchen',
    subtitle: 'Prepared meals',
    statusLabel: 'Busy',
    meta: 'ETA 32 min',
    etaMinutes: 32,
    distanceKm: 3.5,
    rating: 4.9,
    isOffer: true,
    isFavorite: false,
    isFollowing: false,
    imageUri: '',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'توصيل برو',
    followerCount: 23400,
    multiplierLabel: 'x3',
    subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
    offerLabel: 'خصم 15%',
    hasBthwaniPro: true,
    hasNewProducts: true,
    hasCouponAvailable: false,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  },
];

const storeItemsByStoreId: Record<string, StoreItem[]> = {
  'store-1001': [
    {
      id: 'item-apple-1',
      name: 'Royal Gala Apples',
      subtitle: 'Fresh box, 1 kg',
      priceLabel: '18 SAR',
      categoryId: 'fresh',
      categoryLabel: 'Fresh',
      statusLabel: 'Popular',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-15 min',
    },
    {
      id: 'item-milk-1',
      name: 'Organic Milk',
      subtitle: '1.5L chilled bottle',
      priceLabel: '11 SAR',
      categoryId: 'dairy',
      categoryLabel: 'Dairy',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '5-10 min',
    },
    {
      id: 'item-bread-1',
      name: 'Whole Wheat Bread',
      subtitle: 'Daily fresh bakery',
      priceLabel: '7 SAR',
      categoryId: 'bakery',
      categoryLabel: 'Bakery',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-20 min',
    },
  ],
  'store-1002': [
    {
      id: 'item-croissant-1',
      name: 'Butter Croissant',
      subtitle: 'Baked every morning',
      priceLabel: '9 SAR',
      categoryId: 'bakery',
      categoryLabel: 'Bakery',
      statusLabel: 'Best seller',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '8-12 min',
    },
    {
      id: 'item-cake-1',
      name: 'Chocolate Slice',
      subtitle: 'Single serving',
      priceLabel: '14 SAR',
      categoryId: 'sweets',
      categoryLabel: 'Sweets',
      isAvailable: true,
      hasOptions: true,
      preparationTime: '12-18 min',
    },
  ],
  'store-1003': [
    {
      id: 'item-pasta-1',
      name: 'Creamy Pasta Box',
      subtitle: 'Prepared meal ready to dispatch',
      priceLabel: '29 SAR',
      categoryId: 'meals',
      categoryLabel: 'Meals',
      statusLabel: 'Chef pick',
      isAvailable: true,
      hasOptions: true,
      preparationTime: '20-25 min',
    },
    {
      id: 'item-salad-1',
      name: 'Garden Salad',
      subtitle: 'Light and fresh bowl',
      priceLabel: '21 SAR',
      categoryId: 'healthy',
      categoryLabel: 'Healthy',
      isAvailable: true,
      hasOptions: false,
      preparationTime: '10-15 min',
    },
  ],
};

function commandTargetToRoute(target: DshCommandTarget): DshRoute {
  if (target === 'cart-get') {
    return 'cart-get';
  }

  if (target === 'cart-init') {
    return 'cart-init';
  }

  if (target === 'stores-list') {
    return 'stores-list';
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
  const sheinTargets: ClientSupportScreenId[] = ['shein-info'];
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

  if (sheinTargets.includes(screenId)) {
    return 'shein-info';
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
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [ordersQuery, setOrdersQuery] = React.useState('');
  const [storesQuery, setStoresQuery] = React.useState('');
  const [storesFilter, setStoresFilter] = React.useState<'all' | 'nearest' | 'offers' | 'favorites'>('all');
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<ClientSupportScreenId>('checkout-gate');

  React.useEffect(() => {
    setRoute(commandTargetToRoute(command.target));
  }, [command]);

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
      setRoute('review');
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
      setRoute('review');
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

    if (screenId === 'listing-status-update' || screenId === 'service-modes-resolve' || screenId === 'zone-set' || screenId === 'entitlements-get' || screenId === 'shein-info') {
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

      if (screenId === 'shein-info') {
        setRoute('shein-info');
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

  const activeStoreCategories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Map(activeStoreItems.map((item) => [item.categoryId, item.categoryLabel])).entries());
    return uniqueCategories.map(([id, label], index) => ({
      id,
      label,
      itemCount: activeStoreItems.filter((item) => item.categoryId === id).length,
      isPopular: index === 0,
    }));
  }, [activeStoreItems]);

  const activeStoreDeliveryModes = React.useMemo(() => ([
    {
      id: 'delivery' as const,
      name: 'Delivery',
      isAvailable: true,
      estimatedTime: activeStore.meta,
      fee: 12,
    },
    {
      id: 'pickup' as const,
      name: 'Pickup',
      isAvailable: true,
      estimatedTime: '15 min',
      fee: 0,
    },
  ]), [activeStore.meta]);

  const activeStoreTags = React.useMemo(() => {
    const tags = [
      activeStore.hasBthwaniPro ? 'Bthwani Pro' : null,
      activeStore.isOffer ? 'Offer live' : null,
      activeStore.distanceKm != null ? `${activeStore.distanceKm} km` : null,
      activeStore.supportsPickup ? 'Pickup' : null,
      activeStore.supportsPartnerDelivery ? 'Partner delivery' : null,
    ].filter(Boolean) as string[];

    return tags;
  }, [activeStore.distanceKm, activeStore.hasBthwaniPro, activeStore.isOffer, activeStore.supportsPartnerDelivery, activeStore.supportsPickup]);

  const selectedItem = React.useMemo(
    () => activeStoreItems.find((item) => item.id === selectedItemId) ?? activeStoreItems[0],
    [activeStoreItems, selectedItemId],
  );

  if (route === 'entry') {
    return (
      <DshEntryScreen
        onStartDelivery={() => setRoute('cart-get')}
        onBrowseStores={() => setRoute('stores-list')}
        onOpenOrders={() => setRoute('orders-list')}
        onRetry={() => setRoute('entry')}
      />
    );
  }

  if (route === 'stores-list') {
    return (
      <DshStoresListScreen
        items={dshDiscoveryStores}
        query={storesQuery}
        activeFilter={storesFilter}
        onQueryChange={setStoresQuery}
        onFilterChange={setStoresFilter}
        onOpenFavorites={() => setRoute('favorites-list')}
        onOpenStore={(storeId) => {
          setActiveStoreId(storeId);
          setRoute('store-get');
        }}
        onRetry={() => setRoute('stores-list')}
      />
    );
  }

  if (route === 'store-detail') {
    return (
      <DshStoreDetailScreen
        store={{
          id: activeStore.id,
          name: activeStore.name,
          subtitle: activeStore.subtitle,
          statusLabel: activeStore.statusLabel,
          etaLabel: activeStore.meta,
          deliveryFeeLabel: 'Delivery fee 12 SAR',
          followersLabel: `${activeStore.followerCount.toLocaleString()} followers`,
          priceMatchLabel: activeStore.isOffer ? 'Price match live' : 'Standard pricing',
          tags: activeStoreTags,
          categories: activeStoreCategories,
          deliveryModes: activeStoreDeliveryModes,
          highlights: [
            'High confidence fulfillment history',
            'Stable handoff quality for first-time orders',
            'Strong packaging and on-time readiness',
          ],
        }}
        onOpenMenu={() => setRoute('store-items-list')}
        onStartDelivery={() => setRoute('store-items-list')}
        onOpenTracking={() => setRoute('tracking')}
        onRetry={() => setRoute('store-detail')}
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
          deliveryFeeLabel: 'Delivery fee 12 SAR',
          followersLabel: `${activeStore.followerCount.toLocaleString()} followers`,
          priceMatchLabel: activeStore.isOffer ? 'Price match live' : 'Standard pricing',
          tags: activeStoreTags,
          categories: activeStoreCategories,
          deliveryModes: activeStoreDeliveryModes,
        }}
        menuItems={activeStoreItems}
        onOpenItems={() => setRoute('store-items-list')}
        onBack={() => setRoute('stores-list')}
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
        onBack={() => setRoute('store-detail')}
        onRetry={() => setRoute('store-items')}
      />
    );
  }

  if (route === 'store-items-list') {
    return (
      <DshStoreItemsListScreen
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
        onBack={() => setRoute('store-detail')}
        onRetry={() => setRoute('store-items-list')}
      />
    );
  }

  if (route === 'cart-get') {
    return (
      <DshCartGetScreen
        store={{
          id: activeStore.id,
          name: activeStore.name,
          subtitle: activeStore.subtitle,
          statusLabel: activeStore.statusLabel,
          ratingLabel: '4.8 / 5 quality confidence',
        }}
        activeOrder={{
          id: selectedItem?.id ?? 'cart-preview',
          title: selectedItem ? `Cart includes ${selectedItem.name}` : 'Cart ready for checkout',
          subtitle: selectedItem
            ? `${selectedItem.subtitle} from ${activeStore.name}`
            : `Items from ${activeStore.name}`,
          meta: selectedItem ? selectedItem.priceLabel : 'Review items and continue',
          statusLabel: 'Ready',
        }}
        statusTitle="Cart context confirmed"
        statusDescription="Initialize the cart session before moving into the checkout route."
        onOpenStore={() => setRoute('store-get')}
        onOpenOrder={() => setRoute('review')}
        onContinue={() => setRoute('cart-init')}
        onRetry={() => setRoute('cart-get')}
      />
    );
  }

  if (route === 'cart-init') {
    return (
      <DshCartInitScreen
        state="success"
        cartId={`${activeStore.id}-cart`}
        storeName={activeStore.name}
        summaryLabel={selectedItem ? `Prepared with ${selectedItem.name}` : 'Prepared without a selected item'}
        summaryDescription={selectedItem ? `${selectedItem.subtitle} · ${selectedItem.priceLabel}` : 'Context is ready for the next checkout step.'}
        onOpenCart={() => setRoute('cart-item-add')}
        onBack={() => setRoute('cart-get')}
        onRetry={() => setRoute('cart-init')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'cart-item-add') {
    return (
      <DshCartItemAddScreen
        cartId={`${activeStore.id}-cart`}
        storeName={activeStore.name}
        suggestedItemName={selectedItem?.name ?? 'Royal Gala Apples'}
        suggestedQuantity={1}
        suggestedInstructions={selectedItem ? `Add ${selectedItem.subtitle}` : 'Handle with care'}
        onExecuteAdd={() => undefined}
        onOpenCart={() => setRoute('cart-item-remove')}
        onBack={() => setRoute('cart-init')}
        onRetry={() => setRoute('cart-item-add')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'cart-item-remove') {
    return (
      <DshCartItemRemoveScreen
        cartId={`${activeStore.id}-cart`}
        storeName={activeStore.name}
        suggestedCartItemId={selectedItem?.id ?? 'item-apple-1'}
        suggestedItemLabel={selectedItem ? selectedItem.name : 'Selected cart item'}
        onExecuteRemove={() => undefined}
        onOpenCart={() => setRoute('cart-item-update')}
        onBack={() => setRoute('cart-item-add')}
        onRetry={() => setRoute('cart-item-remove')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'cart-item-update') {
    return (
      <DshCartItemUpdateScreen
        cartId={`${activeStore.id}-cart`}
        suggestedCartItemId={selectedItem?.id ?? 'item-apple-1'}
        suggestedQuantity={2}
        suggestedNotes={selectedItem ? `Update ${selectedItem.name}` : 'Adjust quantity as needed'}
        onExecuteUpdate={() => undefined}
        onOpenCart={() => setRoute('categories-list')}
        onBack={() => setRoute('cart-item-remove')}
        onRetry={() => setRoute('cart-item-update')}
        onSupport={openSupportDirectory}
      />
    );
  }

  if (route === 'categories-list') {
    return (
      <DshCategoriesListScreen
        items={dshCategoryListFixtures}
        onOpenCategory={(categoryId) => {
          setItemsCategory(categoryId);
          setRoute('category-get');
        }}
        onOpenFavorites={() => setRoute('favorites-list')}
        onBack={() => setRoute('cart-item-update')}
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
          label: category?.label ?? (itemsCategory === 'all' ? 'All categories' : itemsCategory),
          subtitle: category?.subtitle ?? 'Compact category detail for the current discovery context.',
          summary: category?.subcategories.length
            ? `Main category with ${category.subcategories.length} subcategories ready for discovery.`
            : 'Open the list view to continue with the selected category.',
          itemCountLabel: category?.subcategories.length ? `${category.subcategories.length} subcategories` : 'Category detail ready',
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
          { id: 'store-1001', name: 'Olaya Fresh Market', subtitle: 'Groceries and daily essentials', meta: 'Favorite store' },
          { id: 'item-apple-1', name: 'Royal Gala Apples', subtitle: 'Fresh box, 1 kg', meta: 'Saved item' },
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
        onContinue={() => setRoute('review')}
      />
    );
  }

  if (route === 'awnak-order-create') {
    return (
      <DshAwnakOrderCreateScreen
        onBack={openSupportDirectory}
        onContinue={() => setRoute('review')}
      />
    );
  }

  if (route === 'review') {
    return (
      <DshReviewOrderScreen
        blocks={reviewBlocks}
        onEdit={() => setRoute('create-order')}
        onSubmit={() => setRoute('success')}
      />
    );
  }

  if (route === 'checkout-workspace') {
    return (
      <DshCheckoutHubScreen
        screenId={selectedSupportScreen as 'checkout-gate' | 'estimate-get' | 'pricing-preview' | 'pricing-snapshot-get' | 'promo-apply'}
        onPrimaryAction={() => setRoute('review')}
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

  if (route === 'shein-info') {
    return (
      <DshSheinInfoScreen
        onPrimaryAction={() => setRoute('stores-list')}
        onSecondaryAction={openSupportDirectory}
        onRetry={() => setRoute('shein-info')}
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
        screenId={selectedSupportScreen as 'listing-status-update' | 'service-modes-resolve' | 'zone-set' | 'shein-info'}
        onPrimaryAction={() => setRoute(selectedSupportScreen === 'shein-info' ? 'stores-list' : 'home')}
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
      promos={dshHomeGetFixturePromos as DshHomeGetPromo[]}
      stores={dshHomeGetFixtureStores as DshHomeGetStore[]}
      onBack={onExit}
      onOpenList={() => setRoute('categories-list')}
      onOpenCategory={(categoryId) => {
        setItemsCategory(categoryId);
        setRoute('category-get');
      }}
      onOpenStoresList={() => setRoute('stores-list')}
      onOpenStoreCategory={(storeId, categoryId) => {
        setActiveStoreId(storeId);
        setItemsCategory(categoryId);
        setRoute('store-items-list');
      }}
      onOpenProduct={(storeId, itemId) => {
        setActiveStoreId(storeId);
        setSelectedItemId(itemId);
        setRoute('cart-get');
      }}
      onOpenBenefits={() => setRoute('benefits')}
      onOpenFavorites={() => setRoute('favorites-list')}
      onOpenSearch={() => setRoute('search')}
      onOpenStore={(storeId) => {
        setActiveStoreId(storeId);
        setItemsQuery('');
        setItemsCategory('all');
        setSelectedItemId('');
        setRoute('store-get');
      }}
      onRetry={() => setRoute('home')}
    />
  );
}

export default DshSurfaceHost;