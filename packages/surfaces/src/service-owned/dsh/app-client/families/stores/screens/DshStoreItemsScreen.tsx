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
  useUiText,
} from '@bthwani/ui-kit';

export type DshStoreItem = {
  id: string;
  name: string;
  subtitle?: string;
  priceLabel?: string;
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

function renderNonReadyState(
  state: 'loading' | 'empty' | 'error',
  storeText: ReturnType<typeof useUiText>['storeScreen'],
  onRetry?: () => void,
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title={storeText.states.itemsEmptyTitle}
        description={storeText.states.itemsEmptyDescription}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title={storeText.states.itemsErrorTitle}
      description={storeText.states.itemsErrorDescription}
      actionLabel={storeText.states.retry}
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
  const uiText = useUiText();
  const storeText = uiText.storeScreen;

  const categoryTabs = React.useMemo(() => {
    const uniqueCategories = Array.from(new Map(items.map((item) => [item.categoryId, item.categoryLabel])).entries());
    return [
      { value: 'all', label: storeText.filters.all },
      ...uniqueCategories.map(([value, label]) => ({ value, label })),
    ];
  }, [items, storeText.filters.all]);

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
    return renderNonReadyState(state, storeText, onRetry);
  }

  if (visibleItems.length === 0) {
    return renderNonReadyState('empty', storeText, onRetry);
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title={storeName}
          subtitle={storeText.items.browseSubtitle}
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label={storeText.items.backToStore} tone="secondary" onPress={onBack} />
          <BthButton label={storeText.items.openCart} onPress={onOpenCart} />
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSearchField
          label={storeText.items.searchLabel}
          value={query}
          onChangeText={onQueryChange}
          hint={storeText.items.searchHint}
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
          title={storeText.items.sectionTitle}
          subtitle={storeText.items.sectionSubtitle}
          count={visibleItems.length}
        />
        <BthText role="caption" tone="muted">
          {storeText.items.sectionHint}
        </BthText>
        <BthBox gap={2}>
          {visibleItems.map((item) => (
            <BthCard
              key={item.id}
              title={item.name}
              subtitle={item.subtitle}
              footer={
                <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <BthChip label={item.priceLabel ?? ''} selected />
                  <BthChip label={item.categoryLabel} />
                  {item.statusLabel ? <BthChip label={item.statusLabel} /> : null}
                  {item.preparationTime ? <BthChip label={item.preparationTime} /> : null}
                  {item.hasOptions ? <BthChip label={storeText.items.options} /> : null}
                  {item.isAvailable === false ? <BthChip label={storeText.items.unavailable} /> : null}
                </BthBox>
              }
              onPress={() => onOpenItem?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthText role="caption" tone="muted">
        {storeText.items.runtimeNote}
      </BthText>
    </BthMobileScrollView>
  );
}

export default DshStoreItemsScreen;