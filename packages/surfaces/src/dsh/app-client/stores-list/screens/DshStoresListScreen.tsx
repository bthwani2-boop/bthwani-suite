import React from 'react';
import {
  BthBox,
  BthListItem,
  BthMobileScrollView,
  BthSearchField,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthTabs,
  BthText,
} from '@bthwani/ui-kit';

export type DshStoreListItem = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  isOffer?: boolean;
  isFavorite?: boolean;
  etaMinutes?: number;
};

export type DshStoresListScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error';
  items: DshStoreListItem[];
  query?: string;
  activeFilter?: 'all' | 'nearest' | 'offers' | 'favorites';
  onQueryChange?: (query: string) => void;
  onFilterChange?: (filter: 'all' | 'nearest' | 'offers' | 'favorites') => void;
  onOpenStore?: (storeId: string) => void;
  onRetry?: () => void;
};

function renderNonReadyState(state: 'loading' | 'empty' | 'error', onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No stores found"
        description="Try another filter or search term."
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Stores list is unavailable"
      description="Retry to restore discovery continuity."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshStoresListScreen({
  state = 'ready',
  items,
  query = '',
  activeFilter = 'all',
  onQueryChange,
  onFilterChange,
  onOpenStore,
  onRetry,
}: DshStoresListScreenProps) {
  const filteredByMode = React.useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === 'nearest') {
        return (item.etaMinutes ?? 999) <= 22;
      }

      if (activeFilter === 'offers') {
        return Boolean(item.isOffer);
      }

      if (activeFilter === 'favorites') {
        return Boolean(item.isFavorite);
      }

      return true;
    });
  }, [activeFilter, items]);

  const filteredItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return filteredByMode;
    }

    return filteredByMode.filter((item) => {
      const haystack = `${item.name} ${item.subtitle} ${item.meta}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [filteredByMode, query]);

  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry);
  }

  if (filteredItems.length === 0) {
    return renderNonReadyState('empty', onRetry);
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">Stores discovery</BthText>
        <BthText role="bodySm" tone="muted">
          Keep store selection compact and one-tap to details.
        </BthText>
      </BthBox>

      <BthSurface tone="inset" gap={3}>
        <BthSearchField
          label="Find store"
          value={query}
          onChangeText={onQueryChange}
          hint="Search by store name or category subtitle."
        />
        <BthTabs
          items={[
            { value: 'all', label: 'All' },
            { value: 'nearest', label: 'Nearest' },
            { value: 'offers', label: 'Offers' },
            { value: 'favorites', label: 'Favorites' },
          ]}
          value={activeFilter}
          onValueChange={(next) => onFilterChange?.(next)}
          variant="pill"
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Available stores"
          subtitle="Open store details to continue the delivery journey."
          count={filteredItems.length}
        />
        <BthBox gap={2}>
          {filteredItems.map((item) => (
            <BthListItem
              key={item.id}
              title={item.name}
              subtitle={item.subtitle}
              badgeLabel={item.statusLabel}
              meta={item.meta}
              onPress={() => onOpenStore?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}