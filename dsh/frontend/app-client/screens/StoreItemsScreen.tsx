import React from 'react';
import {
  Box,
  Button,
  Chip,
  Card,
  MobileScrollView,
  SearchField,
  SectionHeader,
  StateView,
  Surface,
  Tabs,
  Text,
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
  /** P0-05: Client visibility derived from product approval pipeline.
   *  'visible' = client can add to cart.
   *  'unavailable' = client sees item but cannot add (out of stock / partner off).
   *  'hidden' / 'removed' = item must NOT render to client — filter before passing. */
  clientVisibilityStatus?: 'visible' | 'unavailable' | 'hidden' | 'removed';
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
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title={storeText.states.itemsEmptyTitle}
        description={storeText.states.itemsEmptyDescription}
      />
    );
  }

  return (
    <StateView
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
    // P0-05: Gate — items that are hidden or removed from the catalog must not render.
    // 'visible' and 'unavailable' are both client-renderable (unavailable shows disabled state).
    // If clientVisibilityStatus is absent, fall back to isAvailable for backward compat.
    const gatePassed = categoryFiltered.filter((item) => {
      const cvs = item.clientVisibilityStatus;
      if (cvs === 'hidden' || cvs === 'removed') return false;
      return true;
    });

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return gatePassed;
    }

    return gatePassed.filter((item) => {
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
    <MobileScrollView padding={4} gap={3}>
      <Surface tone="brand" gap={3}>
        <SectionHeader
          title={storeName}
          subtitle={storeText.items.browseSubtitle}
        />
        <Box layoutDirection="row" gap={2}>
          <Button label={storeText.items.backToStore} tone="secondary" onPress={onBack} />
          <Button label={storeText.items.openCart} onPress={onOpenCart} />
        </Box>
      </Surface>

      <Surface tone="inset" gap={3}>
        <SearchField
          label={storeText.items.searchLabel}
          value={query}
          onChangeText={onQueryChange}
          hint={storeText.items.searchHint}
        />
        <Tabs
          items={categoryTabs}
          value={activeCategory}
          onValueChange={onCategoryChange}
          variant="pill"
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title={storeText.items.sectionTitle}
          subtitle={storeText.items.sectionSubtitle}
          count={visibleItems.length}
        />
        <Text role="caption" tone="muted">
          {storeText.items.sectionHint}
        </Text>
        <Box gap={2}>
          {visibleItems.map((item) => {
            // P0-05: Resolve item availability — clientVisibilityStatus takes precedence.
            const isItemUnavailable =
              item.clientVisibilityStatus === 'unavailable' ||
              (item.clientVisibilityStatus === undefined && item.isAvailable === false);
            return (
              <Card
                key={item.id}
                title={item.name}
                subtitle={isItemUnavailable ? storeText.items.unavailable : item.subtitle}
                footer={
                  <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                    {isItemUnavailable ? (
                      <Chip label={storeText.items.unavailable} tone="danger" />
                    ) : (
                      <Chip label={item.priceLabel ?? ''} selected />
                    )}
                    <Chip label={item.categoryLabel} />
                    {item.statusLabel && !isItemUnavailable ? <Chip label={item.statusLabel} /> : null}
                    {item.preparationTime && !isItemUnavailable ? <Chip label={item.preparationTime} /> : null}
                    {item.hasOptions && !isItemUnavailable ? <Chip label={storeText.items.options} /> : null}
                  </Box>
                }
                onPress={isItemUnavailable ? undefined : () => onOpenItem?.(item.id)}
              />
            );
          })}
        </Box>
      </Surface>

      <Text role="caption" tone="muted">
        {storeText.items.runtimeNote}
      </Text>
    </MobileScrollView>
  );
}

export default DshStoreItemsScreen;
