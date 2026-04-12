import React from 'react';
import {
  BthBox,
  BthButton,
  BthChip,
  BthCard,
  BthListItem,
  BthMobileScrollView,
  BthSearchField,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthTabs,
  BthText,
} from '@bthwani/ui-kit';

export type DshStoreItem = {
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

export type DshStoreItemsScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error';
  storeName: string;
  items: DshStoreItem[];
  query?: string;
  activeCategory?: string;
  onQueryChange?: (query: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  onOpenItem?: (itemId: string) => void;
  onOpenCart?: () => void;
  onBack?: () => void;
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
        title="No items found"
        description="Try another category or search term."
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Store items are unavailable"
      description="Retry to restore item discovery before cart review."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshStoreItemsScreen({
  state = 'ready',
  storeName,
  items,
  query = '',
  activeCategory = 'all',
  onQueryChange,
  onCategoryChange,
  onOpenItem,
  onOpenCart,
  onBack,
  onRetry,
}: DshStoreItemsScreenProps) {
  const categoryTabs = React.useMemo(() => {
    const uniqueCategories = Array.from(new Map(items.map((item) => [item.categoryId, item.categoryLabel])).entries());
    return [
      { value: 'all', label: 'All' },
      ...uniqueCategories.map(([value, label]) => ({ value, label })),
    ];
  }, [items]);

  const categoryFiltered = React.useMemo(() => {
    if (activeCategory === 'all') {
      return items;
    }

    return items.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, items]);

  const visibleItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((item) => {
      const haystack = `${item.name} ${item.subtitle} ${item.categoryLabel}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [categoryFiltered, query]);

  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry);
  }

  if (visibleItems.length === 0) {
    return renderNonReadyState('empty', onRetry);
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title={storeName}
          subtitle="Browse items, keep one next action, then move to cart review."
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label="Back to store" tone="secondary" onPress={onBack} />
          <BthButton label="Open cart" onPress={onOpenCart} />
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSearchField
          label="Find item"
          value={query}
          onChangeText={onQueryChange}
          hint="Search by product name, category, or short description."
        />
        <BthTabs
          items={categoryTabs}
          value={activeCategory}
          onValueChange={onCategoryChange}
          variant="pill"
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Store items"
          subtitle="Select an item to continue smoothly toward cart context."
          count={visibleItems.length}
        />
        <BthText role="caption" tone="muted">
          Tapping an item should stay the shortest path into cart review or add flow.
        </BthText>
        <BthBox gap={2}>
          {visibleItems.map((item) => (
            <BthCard
              key={item.id}
              title={item.name}
              subtitle={item.subtitle}
              footer={
                <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <BthChip label={item.priceLabel} selected />
                  <BthChip label={item.categoryLabel} />
                  {item.statusLabel ? <BthChip label={item.statusLabel} /> : null}
                  {item.preparationTime ? <BthChip label={item.preparationTime} /> : null}
                  {item.hasOptions ? <BthChip label="Options" /> : null}
                  {item.isAvailable === false ? <BthChip label="Unavailable" /> : null}
                </BthBox>
              }
              onPress={() => onOpenItem?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthText role="caption" tone="muted">
        UI/UX/Flow slice only: item selection and cart handoff are intentionally runtime-agnostic.
      </BthText>
    </BthMobileScrollView>
  );
}

export default DshStoreItemsScreen;