import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthChip,
  BthListItem,
  BthMobileScrollView,
  BthNewsTickerBar,
  BthSectionHeader,
  BthSegmentedControl,
  BthStateView,
  BthSurface,
  BthTabs,
  BthText,
} from '@bthwani/ui-kit';

export type DshHomeScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error';

export type DshHomeCategory = {
  id: string;
  label: string;
};

export type DshHomeStore = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  etaMinutes: number;
  hasOffer?: boolean;
  isFavorite?: boolean;
};

export type DshHomePromo = {
  id: string;
  title: string;
  subtitle: string;
};

export type DshHomeScreenProps = {
  state?: DshHomeScreenState;
  categories?: DshHomeCategory[];
  featuredStores?: DshHomeStore[];
  promos?: DshHomePromo[];
  onStartDelivery?: () => void;
  onContinueOrder?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenCategory?: (categoryId: string) => void;
  onOpenStore?: (storeId: string) => void;
  onRetry?: () => void;
};

const defaultCategories: DshHomeCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'nearest', label: 'Nearby' },
  { id: 'offers', label: 'Offers' },
  { id: 'favorites', label: 'Favorites' },
];

const defaultPromos: DshHomePromo[] = [
  {
    id: 'promo-fast-delivery',
    title: 'Fast delivery window',
    subtitle: 'Start from one store and keep the flow compact.',
  },
  {
    id: 'promo-confidence',
    title: 'Confidence-first tracking',
    subtitle: 'Open orders quickly whenever confidence is needed.',
  },
];

const defaultStores: DshHomeStore[] = [
  {
    id: 'store-1001',
    name: 'Olaya Fresh Market',
    subtitle: 'Groceries and daily essentials',
    statusLabel: 'Open',
    meta: 'ETA 18 min',
    etaMinutes: 18,
    hasOffer: true,
    isFavorite: true,
  },
  {
    id: 'store-1002',
    name: 'Hittin Bakery',
    subtitle: 'Bread and pastries',
    statusLabel: 'Open',
    meta: 'ETA 25 min',
    etaMinutes: 25,
    hasOffer: false,
    isFavorite: false,
  },
  {
    id: 'store-1003',
    name: 'Malqa Kitchen',
    subtitle: 'Prepared meals',
    statusLabel: 'Busy',
    meta: 'ETA 32 min',
    etaMinutes: 32,
    hasOffer: true,
    isFavorite: false,
  },
];

type DshHomeFeedMode = 'stores' | 'orders' | 'tracking';

function renderNonReadyState(state: DshHomeScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No discovery data yet"
        description="Retry to restore categories and nearby stores."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Home is unavailable"
      description="Retry first, then continue from orders if needed."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshHomeScreen({
  state = 'ready',
  categories = defaultCategories,
  featuredStores = defaultStores,
  promos = defaultPromos,
  onStartDelivery,
  onContinueOrder,
  onOpenOrders,
  onOpenTracking,
  onOpenCategory,
  onOpenStore,
  onRetry,
}: DshHomeScreenProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>(
    categories[0]?.id ?? 'all'
  );
  const [activeFeedMode, setActiveFeedMode] =
    React.useState<DshHomeFeedMode>('stores');
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);

  React.useEffect(() => {
    if (!categories.length) {
      return;
    }

    const exists = categories.some((category) => category.id === activeCategory);
    if (!exists) {
      setActiveCategory(categories[0].id);
    }
  }, [activeCategory, categories]);

  React.useEffect(() => {
    if (promos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((current) => (current + 1) % promos.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [promos]);

  const promo = promos[activePromoIndex % Math.max(promos.length, 1)];

  const filteredStores = React.useMemo(() => {
    return featuredStores.filter((store) => {
      if (activeCategory === 'nearest') {
        return store.etaMinutes <= 22;
      }

      if (activeCategory === 'offers') {
        return Boolean(store.hasOffer);
      }

      if (activeCategory === 'favorites') {
        return Boolean(store.isFavorite);
      }

      return true;
    });
  }, [activeCategory, featuredStores]);

  const categoryTabs = React.useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.label,
      })),
    [categories]
  );

  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry);
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Delivery home"
          subtitle="One confidence-first home for discovery, order continuation, and tracking clarity."
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label="Start delivery" onPress={onStartDelivery} />
          <BthButton label="Open orders" tone="secondary" onPress={onOpenOrders} />
        </BthBox>
      </BthSurface>

      <BthNewsTickerBar
        statusLabel="Live"
        message="Keep one clear next action, one fallback, and zero route noise."
        onPress={onOpenOrders}
      />

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Journey mode"
          subtitle="Switch context without leaving the home surface."
        />
        <BthSegmentedControl
          options={[
            { value: 'stores', label: 'Stores' },
            { value: 'orders', label: 'Orders' },
            { value: 'tracking', label: 'Tracking' },
          ]}
          value={activeFeedMode}
          onValueChange={(mode) => setActiveFeedMode(mode)}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Discovery filters"
          subtitle="Keep filter options compact and confidence-oriented."
        />
        <BthBox layoutDirection="row" gap={2}>
          {activeCategory !== 'all' ? (
            <BthChip
              label={`Filter: ${categories.find((x) => x.id === activeCategory)?.label ?? activeCategory}`}
              selected
              onPress={() => {
                setActiveCategory('all');
                onOpenCategory?.('all');
              }}
            />
          ) : null}
        </BthBox>
        <BthTabs
          items={categoryTabs}
          value={activeCategory}
          onValueChange={(nextCategory) => {
            setActiveCategory(nextCategory);
            onOpenCategory?.(nextCategory);
          }}
          variant="pill"
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Active promotion"
          subtitle="Use one active promo card at a time to reduce visual noise."
        />
        <BthBox gap={3}>
          {promo ? (
            <BthCard
              key={promo.id}
              title={promo.title}
              subtitle={promo.subtitle}
              footer={<BthButton label="Open offer" tone="ghost" onPress={onStartDelivery} />}
            />
          ) : null}
          <BthBox layoutDirection="row" gap={2}>
            {promos.map((promoItem, index) => (
              <BthChip
                key={promoItem.id}
                label={String(index + 1)}
                selected={index === activePromoIndex}
                onPress={() => setActivePromoIndex(index)}
              />
            ))}
          </BthBox>
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title={activeFeedMode === 'stores' ? 'Nearby stores' : activeFeedMode === 'orders' ? 'Order continuity' : 'Tracking continuity'}
          subtitle={
            activeFeedMode === 'stores'
              ? 'Store open action must stay one tap away.'
              : activeFeedMode === 'orders'
                ? 'Resume current order flow with minimal branching.'
                : 'Keep tracking and support actions visible.'
          }
          count={filteredStores.length}
        />
        {activeFeedMode === 'stores' ? (
          <BthBox gap={2}>
            {filteredStores.map((store) => (
              <BthListItem
                key={store.id}
                title={store.name}
                subtitle={store.subtitle}
                badgeLabel={store.statusLabel}
                meta={store.meta}
                onPress={onOpenStore ? () => onOpenStore(store.id) : undefined}
              />
            ))}
          </BthBox>
        ) : activeFeedMode === 'orders' ? (
          <BthCard
            title="Continue from your latest cart"
            subtitle="Return to review with one clear action and one fallback path."
            footer={<BthButton label="Continue order" onPress={onContinueOrder} />}
          />
        ) : (
          <BthCard
            title="Tracking remains open"
            subtitle="Delay and support actions remain reachable without extra route hops."
            footer={<BthButton label="Track active order" onPress={onOpenTracking} />}
          />
        )}
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="Journey continuity"
          subtitle="Expose one dominant next action with one fallback path."
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label="Continue order" tone="secondary" onPress={onContinueOrder} />
          <BthButton label="Track active order" onPress={onOpenTracking} />
        </BthBox>
        <BthText role="caption" tone="muted">
          This home is UI/UX/Flow only. API, binding, and runtime wiring remain deferred.
        </BthText>
      </BthSurface>
    </BthMobileScrollView>
  );
}