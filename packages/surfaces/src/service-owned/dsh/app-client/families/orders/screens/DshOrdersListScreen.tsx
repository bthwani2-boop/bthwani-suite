import React from 'react';
import {
  BthBox,
  BthButton,
  BthListItem,
  BthMobileScrollView,
  BthSearchField,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthTabs,
  BthText,
} from '@bthwani/ui-kit';

export type DshOrderListItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
};

export type DshOrdersListScreenProps = {
  state?: 'ready' | 'loading' | 'empty';
  items: DshOrderListItem[];
  query?: string;
  onQueryChange?: (query: string) => void;
  onOpenOrder?: (orderId: string) => void;
};

type DshOrdersListFilter = 'all' | 'in-transit' | 'delivered';

function getOrdersListFilterLabel(filter: DshOrdersListFilter) {
  if (filter === 'in-transit') {
    return 'In transit';
  }

  if (filter === 'delivered') {
    return 'Delivered';
  }

  return 'All';
}

function matchesOrdersListFilter(item: DshOrderListItem, filter: DshOrdersListFilter) {
  const statusLabel = item.statusLabel.toLowerCase();

  if (filter === 'in-transit') {
    return statusLabel.includes('transit') || statusLabel.includes('progress') || statusLabel.includes('ready');
  }

  if (filter === 'delivered') {
    return statusLabel.includes('delivered') || statusLabel.includes('complete');
  }

  return true;
}

function renderNonReadyState(state: 'loading' | 'empty', onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  return (
    <BthStateView
      stateId="empty"
      title="No orders yet"
      description="Try another filter or search term."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshOrdersListScreen({
  state = 'ready',
  items,
  query = '',
  onQueryChange,
  onOpenOrder,
}: DshOrdersListScreenProps) {
  const [activeFilter, setActiveFilter] = React.useState<DshOrdersListFilter>('all');

  const filteredItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter = matchesOrdersListFilter(item, activeFilter);
      if (!matchesFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = `${item.title} ${item.subtitle} ${item.statusLabel} ${item.meta}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeFilter, items, query]);

  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty' || filteredItems.length === 0) {
    return renderNonReadyState('empty');
  }

  const latestOrderId = filteredItems[0]?.id ?? items[0]?.id;

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">Orders list</BthText>
        <BthText role="bodySm" tone="muted">
          Returning-user list pattern with lightweight search and one-tap status filters.
        </BthText>
      </BthBox>

      <BthSurface tone="inset" gap={3}>
        <BthSearchField
          label="Find order"
          value={query}
          onChangeText={onQueryChange}
          hint="Search by title, status, or ETA to narrow the queue fast."
        />
        <BthTabs
          items={[
            { value: 'all', label: getOrdersListFilterLabel('all') },
            { value: 'in-transit', label: getOrdersListFilterLabel('in-transit') },
            { value: 'delivered', label: getOrdersListFilterLabel('delivered') },
          ]}
          value={activeFilter}
          onValueChange={(nextFilter) => setActiveFilter(nextFilter as DshOrdersListFilter)}
          variant="pill"
        />
      </BthSurface>

      {onOpenOrder && latestOrderId ? (
        <BthBox layoutDirection="row" justify="space-between" align="center">
          <BthText role="caption" tone="muted">
            Showing {filteredItems.length} {getOrdersListFilterLabel(activeFilter).toLowerCase()} orders
          </BthText>
          <BthButton label="Open latest" tone="ghost" onPress={() => onOpenOrder(latestOrderId)} />
        </BthBox>
      ) : null}

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Recent orders"
          subtitle="Open order should take the user to the next clear action with one tap."
          count={filteredItems.length}
        />
        <BthBox gap={2}>
          {filteredItems.map((item) => (
            <BthListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={item.meta}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}