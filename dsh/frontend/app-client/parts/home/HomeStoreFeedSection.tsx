import * as React from 'react';
import { View } from 'react-native';
import { StoreCardPremium, type StoreCardPremiumItem } from '@bthwani/ui-kit';

export type HomeStoreCardEntry = {
  item: StoreCardPremiumItem;
  storeId: string;
  baseFavorite?: boolean;
};

// ---------------------------------------------------------------------------
// HomeStoreCardItem
// Memoized card component used as FlatList/SectionList renderItem.
// Extracted from HomeScreenContent.tsx to isolate per-card renders.
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
