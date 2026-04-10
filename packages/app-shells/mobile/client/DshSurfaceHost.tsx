import React from 'react';
import { dsh } from '@bthwani/surfaces';

const {
  DshCartGetScreen,
  DshCreateOrderScreen,
  DshEntryScreen,
  DshHomeScreen,
  DshOrderSuccessState,
  DshOrdersListScreen,
  DshReviewOrderScreen,
  DshStoreDetailScreen,
  DshStoreItemsScreen,
  DshStoresListScreen,
  DshTrackingScreen,
} = dsh.dshAppClient;

export type DshRoute =
  | 'home'
  | 'entry'
  | 'stores-list'
  | 'store-detail'
  | 'store-items'
  | 'cart-get'
  | 'create'
  | 'review'
  | 'success'
  | 'orders'
  | 'tracking';

export type DshCommandTarget = 'home' | 'stores-list' | 'orders' | 'tracking' | 'create';

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
        onStartDelivery={() => setRoute('create')}
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
        onOpenStore={(storeId) => {
          setActiveStoreId(storeId);
          setRoute('store-detail');
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
        onOpenMenu={() => setRoute('store-items')}
        onStartDelivery={() => setRoute('store-items')}
        onOpenTracking={() => setRoute('tracking')}
        onRetry={() => setRoute('store-detail')}
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
        statusDescription="Proceed to create order with clear next action and recoverable fallback."
        onOpenStore={() => setRoute('store-detail')}
        onOpenOrder={() => setRoute('review')}
        onContinue={() => setRoute('create')}
        onRetry={() => setRoute('cart-get')}
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
        onSupport={() => setRoute('orders')}
        onRetry={() => setRoute('tracking')}
        onNextAction={() => setRoute('orders')}
      />
    );
  }

  return (
    <DshHomeScreen
      onStartDelivery={() => setRoute('create')}
      onContinueOrder={() => setRoute('review')}
      onOpenOrders={() => setRoute('orders')}
      onOpenTracking={() => setRoute('tracking')}
      onOpenCategory={(categoryId) => {
        if (categoryId === 'all') {
          setStoresFilter('all');
          setRoute('stores-list');
          return;
        }

        if (categoryId === 'offers') {
          setStoresFilter('offers');
          setRoute('stores-list');
          return;
        }

        if (categoryId === 'favorites') {
          setStoresFilter('favorites');
          setRoute('stores-list');
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
        setRoute('store-detail');
      }}
      onRetry={() => setRoute('home')}
    />
  );
}

export default DshSurfaceHost;