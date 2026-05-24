import * as React from 'react';
import { Animated, type ImageSourcePropType } from 'react-native';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../../shared/dshStoreProductCardModel';
import { MenuItemCard } from './StoreMenuItemCard';

const STORE_MENU_CARD_HEIGHT = 126;
const STORE_MENU_CARD_GAP = 2;
export const STORE_MENU_SNAP_INTERVAL = STORE_MENU_CARD_HEIGHT + STORE_MENU_CARD_GAP;

// ---------------------------------------------------------------------------
// StoreMenuListItem
// Memoized card with parallax scroll animation.
// Extracted from StoreScreenContent.tsx to isolate per-item renders from
// the measurement picker, image preview, and gesture state.
// ---------------------------------------------------------------------------
export const StoreMenuListItem = React.memo(function StoreMenuListItem({
  item,
  index,
  scrollY,
  partnerImageSource,
  isFavorited,
  onOpenMeasurementPicker,
  onOpenImagePreview,
  onToggleFavorite,
}: {
  item: DshStoreGetMenuItem;
  index: number;
  scrollY: Animated.Value;
  partnerImageSource?: ImageSourcePropType | string | null;
  isFavorited: boolean;
  onOpenMeasurementPicker: (item: DshStoreGetMenuItem, anchor?: { x: number; y: number }) => void;
  onOpenImagePreview: (item: DshStoreGetMenuItem) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const inputRange = [
    (index - 1) * STORE_MENU_SNAP_INTERVAL,
    index * STORE_MENU_SNAP_INTERVAL,
    (index + 1) * STORE_MENU_SNAP_INTERVAL,
  ];
  const scale = scrollY.interpolate({ inputRange, outputRange: [0.986, 1, 0.986], extrapolate: 'clamp' });
  const translateY = scrollY.interpolate({ inputRange, outputRange: [8, 0, 8], extrapolate: 'clamp' });
  const opacity = scrollY.interpolate({ inputRange, outputRange: [0.9, 1, 0.9], extrapolate: 'clamp' });

  const handleAddPress = React.useCallback(
    (anchor?: { x: number; y: number }) =>
      onOpenMeasurementPicker(item, anchor ?? { x: 32, y: 360 }),
    [item, onOpenMeasurementPicker],
  );

  const handleFavoritePress = React.useCallback(() => {
    onToggleFavorite(item.id);
  }, [item.id, onToggleFavorite]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }, { translateY }],
          opacity,
          marginBottom: STORE_MENU_CARD_GAP,
          marginHorizontal: 12,
        },
      ]}
      pointerEvents="box-none"
    >
      <MenuItemCard
        item={item}
        partnerImageSource={partnerImageSource}
        onAddPress={handleAddPress}
        onImagePress={onOpenImagePreview}
        onFavoritePress={handleFavoritePress}
        isFavorited={isFavorited}
      />
    </Animated.View>
  );
});
