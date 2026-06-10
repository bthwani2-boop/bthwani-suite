import * as React from 'react';
import { View } from 'react-native';
import { Box, StoreCardPremium, type StoreCardPremiumItem } from '@bthwani/ui-kit';

import { DshAwnakOrderCreateScreen } from '../AwnakOrderCreateScreen';
import { DshSheinOrderCreateScreen } from '../SheinOrderCreateScreen';
import { EmptyFeed } from './HomeStoreFeed';
import type { HomeScreenShellProps } from './HomeScreenShell';

export type HomeStoreCardEntry = {
  item: StoreCardPremiumItem;
  storeId: string;
  baseFavorite?: boolean;
};

// ---------------------------------------------------------------------------
// HomeStoreCardItem
// Memoized card component used as FlatList/SectionList renderItem.
// Isolates per-card renders from Home screen orchestration.
// ---------------------------------------------------------------------------
export const HomeStoreCardItem = React.memo(function HomeStoreCardItem({
  entry,
  onOpenStore,
  onToggleFavorite,
  setLocalFavoriteToggles,
}: {
  entry: HomeStoreCardEntry;
  onOpenStore?: (storeId: string) => void;
  onToggleFavorite?: (storeId: string) => void;
  setLocalFavoriteToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const handlePress = React.useCallback(() => {
    onOpenStore?.(entry.storeId);
  }, [entry.storeId, onOpenStore]);

  const handleFavoritePress = React.useCallback(() => {
    if (onToggleFavorite) {
      onToggleFavorite(entry.storeId);
      return;
    }

    setLocalFavoriteToggles((current) => ({
      ...current,
      [entry.storeId]: !(current[entry.storeId] ?? entry.baseFavorite),
    }));
  }, [entry.baseFavorite, entry.storeId, onToggleFavorite, setLocalFavoriteToggles]);

  return (
    <StoreCardPremium
      item={entry.item}
      onPress={onOpenStore ? handlePress : undefined}
      onFavoritePress={handleFavoritePress}
    />
  );
});

// ---------------------------------------------------------------------------
// HomeStoreFeedItemWrapper
// Thin View wrapper for SectionList renderItem to maintain gap/padding rules.
// ---------------------------------------------------------------------------
export const HomeStoreFeedItemWrapper = React.memo(function HomeStoreFeedItemWrapper({
  entry,
  onOpenStore,
  onToggleFavorite,
  setLocalFavoriteToggles,
  style,
}: {
  entry: HomeStoreCardEntry;
  onOpenStore?: (storeId: string) => void;
  onToggleFavorite?: (storeId: string) => void;
  setLocalFavoriteToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  style?: object;
}) {
  return (
    <View style={style}>
      <HomeStoreCardItem
        entry={entry}
        onOpenStore={onOpenStore}
        onToggleFavorite={onToggleFavorite}
        setLocalFavoriteToggles={setLocalFavoriteToggles}
      />
    </View>
  );
});

export const HomeStoreFeedSection = React.memo(function HomeStoreFeedSection({
  entry,
  props,
  styles,
  setLocalFavoriteToggles,
  derivedStores,
  debouncedInlineSearchQuery,
  selectCategoryPage,
}: Pick<HomeScreenShellProps, 'props' | 'styles' | 'derivedStores' | 'debouncedInlineSearchQuery' | 'selectCategoryPage'> & {
  entry: HomeStoreCardEntry | 'empty';
  setLocalFavoriteToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  if (entry === 'empty') {
    if (derivedStores.activeStorePage?.renderMode === 'manual-order') {
      return (
        <View style={styles.storeListContent}>
          <Box gap={3}>
            {derivedStores.activeStorePage.categoryId === 'shein' && props.sheinInlineVisible ? (
              <DshSheinOrderCreateScreen
                embedded
                onClose={() => {
                  props.onCloseSheinInline?.();
                  selectCategoryPage('all');
                }}
              />
            ) : null}
            {derivedStores.activeStorePage.categoryId === 'awnak' && props.awnakInlineVisible ? (
              <DshAwnakOrderCreateScreen
                embedded
                onClose={() => {
                  props.onCloseAwnakInline?.();
                  selectCategoryPage('all');
                }}
              />
            ) : null}
            {!props.sheinInlineVisible && !props.awnakInlineVisible && (
              <EmptyFeed query={debouncedInlineSearchQuery} styles={styles} />
            )}
          </Box>
        </View>
      );
    }

    return (
      <View style={styles.storeListContent}>
        <EmptyFeed query={debouncedInlineSearchQuery} styles={styles} />
      </View>
    );
  }

  return (
    <View style={styles.storeListContent}>
      <HomeStoreCardItem
        entry={entry}
        onOpenStore={props.onOpenStore}
        onToggleFavorite={props.onToggleFavorite}
        setLocalFavoriteToggles={setLocalFavoriteToggles}
      />
    </View>
  );
});
