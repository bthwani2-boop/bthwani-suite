import * as React from 'react';
import { Animated, FlatList, Platform, View, type ImageSourcePropType } from 'react-native';
import {
  BThwaniFilterSwipeBoundary,
  Icon,
  Text,
  colorPalette,
  type BThwaniFilterRailItem,
} from '@bthwani/ui-kit';
import type { DshStoreMenuItem as DshStoreGetMenuItem } from 'presentation-models/dshStoreProductCardModel';
import type { DshStoreSearchCategory } from 'store-search-helpers';
import type { DshFulfillmentDeliveryMode } from '../../contracts/dsh-client-binding.contracts';
import { MenuItemCard } from './StoreMenuItemCard';
import { DSH_STORE_CATEGORY_ICONS as CATEGORY_ICON } from 'contracts/category-icons';
import { normalizeDisplayText } from 'store-formatting';
import { StoreFilterRailSection } from './StoreFilterRailSection';
import type { styles as storeScreenStyles } from './store-screen.styles';

const STORE_MENU_CARD_HEIGHT = 126;
const STORE_MENU_CARD_GAP = 2;
export const STORE_MENU_SNAP_INTERVAL = STORE_MENU_CARD_HEIGHT + STORE_MENU_CARD_GAP;

// ---------------------------------------------------------------------------
// StoreMenuListItem
// Memoized card with parallax scroll animation.
// Isolates per-item renders from measurement, preview, and gesture state.
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

type StoreMenuListSectionProps = {
  listRef: React.RefObject<import('react-native').FlatList<DshStoreGetMenuItem> | null>;
  scrollY: import('react-native').Animated.Value;
  visibleItems: DshStoreGetMenuItem[];
  categories: DshStoreSearchCategory[];
  selectedCategory: string;
  changeCategory: (id: string) => void;
  listHeader: React.ReactElement;
  headerSearchQuery: string;
  normalizedStoreName: string;
  storeText: { get: { emptyCategoryTitle: string; emptyCategoryDescription: string } };
  storeLogoImageSource: import('react-native').ImageSourcePropType | string | null | undefined;
  favoriteIds: ReadonlySet<string>;
  openMeasurementPicker: (item: DshStoreGetMenuItem, anchor?: { x: number; y: number }) => void;
  openImageViewer: (item: DshStoreGetMenuItem) => void;
  handleToggleFavorite: (itemId: string) => void;
  isDarkGlass: boolean;
  stickyThreshold: number;
  appearanceChrome: ReturnType<typeof import('./store-appearance-chrome').useStoreAppearanceChrome>;
  tokens: { glassMutedText: string };
  styles: typeof storeScreenStyles;
};

export const StoreMenuListSection = React.memo(function StoreMenuListSection({
  listRef,
  scrollY,
  visibleItems,
  categories,
  selectedCategory,
  changeCategory,
  listHeader,
  headerSearchQuery,
  normalizedStoreName,
  storeText,
  storeLogoImageSource,
  favoriteIds,
  openMeasurementPicker,
  openImageViewer,
  handleToggleFavorite,
  isDarkGlass,
  stickyThreshold,
  appearanceChrome,
  tokens,
  styles,
}: StoreMenuListSectionProps) {
  const categoryRailItems = React.useMemo<BThwaniFilterRailItem[]>(
    () =>
      categories.map((category) => ({
        id: category.id,
        label: normalizeDisplayText(category.label),
        icon: CATEGORY_ICON[category.id]
          ? <Text role="bodyMd" style={{}}>{CATEGORY_ICON[category.id]}</Text>
          : ({ selected }: { selected: boolean }) => (
              <Icon
                name={
                  category.id === 'all' ? 'reorder-three-outline' :
                  category.id === 'favorites' ? 'heart-outline' :
                  category.id === 'new' ? 'sparkles-outline' :
                  category.id === 'offers' ? 'pricetag-outline' :
                  'grid-outline'
                }
                size={16}
                color={selected ? (isDarkGlass ? colorPalette.brand : colorPalette.white) : (isDarkGlass ? tokens.glassMutedText : appearanceChrome.secondaryText)}
              />
            ),
      })),
    [appearanceChrome.secondaryText, categories, isDarkGlass, tokens.glassMutedText],
  );

  const resolvedListHeader = React.useMemo(() => (
    <>
      {listHeader}
      <StoreFilterRailSection
        categoryRailItems={categoryRailItems}
        selectedCategory={selectedCategory}
        changeCategory={changeCategory}
        isDarkGlass={isDarkGlass}
        scrollY={scrollY}
        stickyThreshold={stickyThreshold}
        appearanceChrome={appearanceChrome}
        styles={styles}
      />
    </>
  ), [appearanceChrome, categoryRailItems, changeCategory, isDarkGlass, listHeader, scrollY, selectedCategory, stickyThreshold, styles]);

  const renderStoreMenuItem = React.useCallback(({ item, index }: { item: DshStoreGetMenuItem; index: number }) => (
    <StoreMenuListItem
      item={item}
      index={index}
      scrollY={scrollY}
      partnerImageSource={storeLogoImageSource}
      isFavorited={favoriteIds.has(item.id)}
      onOpenMeasurementPicker={openMeasurementPicker}
      onOpenImagePreview={openImageViewer}
      onToggleFavorite={handleToggleFavorite}
    />
  ), [favoriteIds, handleToggleFavorite, openImageViewer, openMeasurementPicker, scrollY, storeLogoImageSource]);

  const listEmptyComponent = React.useMemo(() => (
    <View style={styles.emptyFeed}>
      <Text style={styles.emptyFeedEmoji}>{headerSearchQuery.trim() ? '🔎' : '🍽️'}</Text>
      <Text weight="black" style={styles.emptyFeedTitle}>
        {headerSearchQuery.trim() ? 'لا توجد نتائج داخل هذا المتجر' : storeText.get.emptyCategoryTitle}
      </Text>
      <Text style={styles.emptyFeedText}>
        {headerSearchQuery.trim()
          ? `جرّب البحث باسم منتج أو قسم آخر داخل ${normalizedStoreName}.`
          : storeText.get.emptyCategoryDescription}
      </Text>
    </View>
  ), [headerSearchQuery, normalizedStoreName, storeText.get.emptyCategoryDescription, storeText.get.emptyCategoryTitle, styles]);

  return (
    <View style={styles.feedSection}>
      <BThwaniFilterSwipeBoundary
        items={categoryRailItems}
        selectedId={selectedCategory}
        onSelectedIdChange={changeCategory}
        style={styles.feedList}
        testID="store-category-swipe-boundary"
      >
        <Animated.FlatList
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          ref={(ref) => {
            listRef.current = ref as unknown as FlatList<DshStoreGetMenuItem> | null;
          }}
          data={visibleItems as DshStoreGetMenuItem[]}
          keyExtractor={(item) => (item as DshStoreGetMenuItem).id}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews={Platform.OS !== 'web'}
          ListHeaderComponent={resolvedListHeader}
          renderItem={renderStoreMenuItem}
          showsVerticalScrollIndicator={false}
          snapToInterval={STORE_MENU_SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={listEmptyComponent}
        />
      </BThwaniFilterSwipeBoundary>
      <StoreFilterRailSection
        mode="sticky"
        categoryRailItems={categoryRailItems}
        selectedCategory={selectedCategory}
        changeCategory={changeCategory}
        isDarkGlass={isDarkGlass}
        scrollY={scrollY}
        stickyThreshold={stickyThreshold}
        appearanceChrome={appearanceChrome}
        styles={styles}
      />
    </View>
  );
});
