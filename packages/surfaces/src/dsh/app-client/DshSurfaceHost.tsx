import React from 'react';
import { DshCategoriesListScreen } from './categories-list/screens';
import { DshCategoryGetScreen } from './category-get/screens';
import { DshCartGetScreen } from './cart-get/screens';
import { DshCartInitScreen } from './cart-init/screens';
import { DshCartItemAddScreen } from './cart-item-add/screens';
import { DshCartItemRemoveScreen } from './cart-item-remove/screens';
import { DshCartItemUpdateScreen } from './cart-item-update/screens';
import { DshCreateOrderScreen } from './create-order/screens';
import { DshEntryScreen } from './entry/screens';
import { DshFavoriteToggleScreen } from './favorite-toggle/screens';
import { DshFavoritesListScreen } from './favorites-list/screens';
import { DshHomeGetScreen, type DshHomeGetPromo, type DshHomeGetStore } from './home-get/screens';
import { DshHomeScreen } from './home/screens';
import { DshOrderSuccessState } from './success/states';
import { DshOrdersListScreen } from './orders-list/screens';
import { DshSearchScreen } from './search/screens';
import { DshClientSupportDirectoryScreen, clientSupportScreenRegistry, type ClientSupportScreenId } from './support/screens';
import { DshStoreGetScreen } from './store-get/screens';
import { DshReviewOrderScreen } from './review/screens';
import { DshStoreDetailScreen } from './store-detail/screens';
import { DshStoreItemsScreen } from './store-items/screens';
import { DshStoreItemsListScreen } from './store-items-list/screens';
import { DshAwnakOrderCreateScreen } from './awnak-order-create/screens';
import { DshStoresListScreen } from './stores-list/screens';
import { DshTrackingScreen } from './tracking/screens';

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
  | 'home-get'
  | 'search'
  | 'store-get'
  | 'create'
  | 'review'
  | 'support-directory'
  | 'support-screen'
  | 'success'
  | 'orders'
  | 'tracking';

export type DshCommandTarget = 'home' | 'stores-list' | 'orders' | 'tracking' | 'create' | 'cart-get' | 'cart-init';

type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
};

type DshSurfaceHostProps = {
  command: DshNavigationCommand;
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
    isOffer: true,
    isFavorite: true,
  },
  {
    id: 'store-1002',
    name: 'Hittin Bakery',
    subtitle: 'Bread and pastries',
    statusLabel: 'Open',
    meta: 'ETA 25 min',
    etaMinutes: 25,
    isOffer: false,
    isFavorite: false,
  },
  {
    id: 'store-1003',
    name: 'Malqa Kitchen',
    subtitle: 'Prepared meals',
    statusLabel: 'Busy',
    meta: 'ETA 32 min',
    etaMinutes: 32,
    isOffer: true,
    isFavorite: false,
  },
];

const dshHomeGetPromos: DshHomeGetPromo[] = [
  { id: 'promo-1', title: 'تخفيضات', subtitle: 'خصم 30% على أول طلب', icon: '🔥' },
  { id: 'promo-2', title: 'تتبّع مباشر', subtitle: 'افتح الطلب النشط دون ضياع المسار', icon: '📍' },
  { id: 'promo-3', title: 'الفئات المختارة', subtitle: 'فئات قصيرة ومباشرة من نفس الواجهة', icon: '✨' },
];

const dshHomeGetStores: DshHomeGetStore[] = [
  {
    id: 'store-1001',
    name: 'مطعم القلعة',
    address: 'شارع التحرير، صنعاء',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '2.1 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'بثواني برو',
    followerCount: 11000,
    multiplierLabel: 'x2',
    offerLabel: 'خصم 20%',
    isFavorite: true,
    isFollowing: false,
    hasOffer: true,
  },
  {
    id: 'store-1002',
    name: 'مطاعم الأرض الخضراء',
    address: 'شارع حدة، جوار البنك',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '1.8 كم',
    deliveryLabel: 'كوبون',
    serviceLabel: 'استلم بنفسك',
    followerCount: 9000,
    multiplierLabel: 'x1',
    isFavorite: false,
    isFollowing: false,
    hasOffer: false,
  },
  {
    id: 'store-1003',
    name: 'مؤسسة الشيباني للمطاعم',
    address: 'شارع الزبيري، أمام الجامعة',
    statusLabel: 'مغلق',
    statusTone: 'closed',
    distanceLabel: '3.5 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'بثواني برو',
    followerCount: 9000,
    multiplierLabel: 'x3',
    offerLabel: 'خصم 15%',
    isFavorite: true,
    isFollowing: false,
    hasOffer: true,
  },
];

const dshHomeGetTickerMessage = 'المساحة مخصصة للشريط الإخباري • اطلب إلى المنزل أو افتح الطلب النشط خلال خطوة واحدة';

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
    },
    {
      id: 'item-milk-1',
      name: 'Organic Milk',
      subtitle: '1.5L chilled bottle',
      priceLabel: '11 SAR',
      categoryId: 'dairy',
      categoryLabel: 'Dairy',
    },
    {
      id: 'item-bread-1',
      name: 'Whole Wheat Bread',
      subtitle: 'Daily fresh bakery',
      priceLabel: '7 SAR',
      categoryId: 'bakery',
      categoryLabel: 'Bakery',
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
    },
    {
      id: 'item-cake-1',
      name: 'Chocolate Slice',
      subtitle: 'Single serving',
      priceLabel: '14 SAR',
      categoryId: 'sweets',
      categoryLabel: 'Sweets',
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
    },
    {
      id: 'item-salad-1',
      name: 'Garden Salad',
      subtitle: 'Light and fresh bowl',
      priceLabel: '21 SAR',
      categoryId: 'healthy',
      categoryLabel: 'Healthy',
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

  if (target === 'orders') {
    return 'orders';
  }

  if (target === 'tracking') {
    return 'tracking';
  }

  if (target === 'create') {
    return 'create';
  }

  return 'home';
}

export function DshSurfaceHost({ command }: DshSurfaceHostProps) {
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
    setRoute('support-screen');
  }, []);

  const handleSupportPrimaryAction = React.useCallback((screenId: ClientSupportScreenId) => {
    const awnakTargets: ClientSupportScreenId[] = ['awnak-order-create'];
    const createTargets: ClientSupportScreenId[] = ['booking-create', 'estimate-create', 'external-order-create', 'gas-refill-order-create', 'order-create'];
    const deliveryTargets: ClientSupportScreenId[] = ['delivery-attempt-create', 'delivery-attempts-list', 'delivery-close', 'delivery-eta-get', 'delivery-get', 'delivery-reassign', 'delivery-track-get', 'order-status-get', 'order-status-update'];
    const checkoutTargets: ClientSupportScreenId[] = ['checkout-gate', 'estimate-get', 'pricing-preview', 'pricing-snapshot-get', 'promo-apply'];
    const orderTargets: ClientSupportScreenId[] = ['order-accept', 'order-cancel', 'order-complete', 'order-get', 'order-issue-flag', 'order-proof-code-generate', 'order-proof-verify', 'order-receipt-get'];
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
      setRoute('create');
      return;
    }

    if (checkoutTargets.includes(screenId)) {
      setRoute('review');
      return;
    }

    if (deliveryTargets.includes(screenId)) {
      setRoute('tracking');
      return;
    }

    if (orderTargets.includes(screenId)) {
      setRoute('orders');
      return;
    }

    if (reviewTargets.includes(screenId)) {
      setRoute('review');
      return;
    }

    if (reviewHistoryTargets.includes(screenId)) {
      setRoute('orders');
      return;
    }

    if (subscriptionTargets.includes(screenId) || loyaltyTargets.includes(screenId)) {
      setRoute('home-get');
      return;
    }

    if (screenId === 'chat-read-ack' || screenId === 'chat-send') {
      setRoute('orders');
      return;
    }

    if (proxyRequestTargets.includes(screenId)) {
      setRoute('review');
      return;
    }

    if (proxyRejectTargets.includes(screenId)) {
      setRoute('orders');
      return;
    }

    if (proxyTrackingTargets.includes(screenId)) {
      setRoute('tracking');
      return;
    }

    if (screenId === 'listing-status-update' || screenId === 'service-modes-resolve' || screenId === 'zone-set' || screenId === 'entitlements-get' || screenId === 'shein-info') {
      setRoute('home');
      return;
    }

    setRoute('orders');
  }, []);

  const activeStore = React.useMemo(
    () => dshDiscoveryStores.find((store) => store.id === activeStoreId) ?? dshDiscoveryStores[0],
    [activeStoreId],
  );

  const activeStoreItems = React.useMemo(() => storeItemsByStoreId[activeStore.id] ?? [], [activeStore.id]);

  const selectedItem = React.useMemo(
    () => activeStoreItems.find((item) => item.id === selectedItemId) ?? activeStoreItems[0],
    [activeStoreItems, selectedItemId],
  );

  if (route === 'entry') {
    return (
      <DshEntryScreen
        onStartDelivery={() => setRoute('cart-get')}
        onBrowseStores={() => setRoute('stores-list')}
        onOpenOrders={() => setRoute('orders')}
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
        }}
        onOpenItems={() => setRoute('store-detail')}
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
        onOpenStore={() => setRoute('store-detail')}
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
        items={[
          { id: 'fresh', label: 'Fresh', subtitle: 'Produce and chilled essentials', countLabel: '12 items' },
          { id: 'bakery', label: 'Bakery', subtitle: 'Bread and pastry selection', countLabel: '8 items' },
          { id: 'meals', label: 'Meals', subtitle: 'Prepared ready-to-order items', countLabel: '10 items' },
        ]}
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
    return (
      <DshCategoryGetScreen
        category={{
          id: itemsCategory,
          label: itemsCategory === 'all' ? 'All categories' : itemsCategory,
          subtitle: 'Compact category detail for the current discovery context.',
          summary: 'Open the list view to continue with the selected category.',
          itemCountLabel: 'Category detail ready',
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

  if (route === 'home-get') {
    return (
      <DshHomeGetScreen
        tickerMessage={dshHomeGetTickerMessage}
        promos={dshHomeGetPromos}
        stores={dshHomeGetStores}
        onOpenList={() => setRoute('stores-list')}
        onOpenFavorites={() => setRoute('favorites-list')}
        onOpenSearch={() => setRoute('search')}
        onOpenStore={(storeId) => {
          setActiveStoreId(storeId);
          setRoute('store-get');
        }}
        onReturnHome={() => setRoute('home')}
        onRetry={() => setRoute('home-get')}
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
        onBack={() => setRoute('home-get')}
        onRetry={() => setRoute('search')}
      />
    );
  }

  if (route === 'create') {
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
        onEdit={() => setRoute('create')}
        onSubmit={() => setRoute('success')}
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

  if (route === 'orders') {
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
        onNextAction={() => setRoute('orders')}
      />
    );
  }

  return (
    <DshHomeScreen
      onStartDelivery={() => setRoute('cart-get')}
      onContinueOrder={() => setRoute('review')}
      onOpenDiscovery={() => setRoute('home-get')}
      onOpenSearch={() => setRoute('search')}
      onOpenOrders={() => setRoute('orders')}
      onOpenTracking={() => setRoute('tracking')}
      onOpenCategory={(categoryId) => {
        if (categoryId === 'all') {
          setStoresFilter('all');
          setRoute('categories-list');
          return;
        }

        if (categoryId === 'offers') {
          setStoresFilter('offers');
          setRoute('categories-list');
          return;
        }

        if (categoryId === 'favorites') {
          setStoresFilter('favorites');
          setRoute('favorites-list');
          return;
        }

        if (categoryId === 'nearest') {
          setStoresFilter('nearest');
          setRoute('stores-list');
          return;
        }

        setRoute('stores-list');
      }}
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