import * as React from 'react';
import { Modal, View, Pressable, Animated, Platform, Image, TouchableOpacity } from 'react-native';
import { Icon, Text,
  radius,
  spacing,
} from '@bthwani/ui-kit';

import type { DshStoreMenuItem as DshStoreGetMenuItem } from '../../../shared/dshStoreProductCardModel';
import type { useStoreAppearanceChrome } from './store-appearance-chrome';
import type { DshStoreGetScreenProps } from '../../contracts/dsh-store-screen-props';
import { normalizeDisplayText } from '../../shared/store-formatting';
import { resolveDshStoreMenuItemImageSource } from './StoreMenuItemCard';
import { stylesTokens, styles as storeScreenStyles } from './store-screen.styles';

type StoreImageViewerSheetProps = {
  viewerItem: DshStoreGetMenuItem | null | undefined;
  viewerItems: DshStoreGetMenuItem[];
  viewerAnim: Animated.Value;
  panResponder: { panHandlers: object };
  menuListRef: React.RefObject<Animated.FlatList<DshStoreGetMenuItem> | null>;
  menuScrollY: Animated.Value;
  viewportHeight: number;
  viewportWidth: number;
  viewerActiveIndex: number;
  setPreviewActiveIndex: (index: number) => void;
  setPreviewItem: (item: DshStoreGetMenuItem | null) => void;
  closeImagePreview: () => void;
  appearanceChrome: ReturnType<typeof useStoreAppearanceChrome>;
  styles: typeof storeScreenStyles;
  isRTL: boolean;
  favoriteIds: Set<string>;
  store: DshStoreGetScreenProps['store'];
  normalizedStoreName: string;
  storeLogoImageSource: import('react-native').ImageSourcePropType | null | undefined;
  handleToggleFavorite: (id: string) => void;
  openMeasurementPicker: (item: DshStoreGetMenuItem, position: { x: number; y: number }) => void;
};

const STORE_PREVIEW_INITIAL_NUM_TO_RENDER = 3;
const STORE_PREVIEW_MAX_TO_RENDER_PER_BATCH = 3;
const STORE_PREVIEW_WINDOW_SIZE = 5;
const STORE_PREVIEW_ITEM_GAP = 16;

export function StoreImageViewerSheet({
  viewerItem,
  viewerItems,
  viewerAnim,
  panResponder,
  menuListRef,
  menuScrollY,
  viewportHeight,
  viewportWidth,
  viewerActiveIndex,
  setPreviewActiveIndex,
  setPreviewItem,
  closeImagePreview,
  appearanceChrome,
  styles,
  isRTL,
  favoriteIds,
  store,
  normalizedStoreName,
  storeLogoImageSource,
  handleToggleFavorite,
  openMeasurementPicker,
}: StoreImageViewerSheetProps) {
  const viewerItemWidth = viewportWidth * 0.92;
  const viewerItemHeight = viewportHeight * 0.54;
  const previewSnapInterval = viewerItemHeight + STORE_PREVIEW_ITEM_GAP;

  const renderPreviewItem = React.useCallback(({ item, index }: { item: DshStoreGetMenuItem; index: number }) => {
    const inputRange = [
      (index - 1) * previewSnapInterval,
      index * previewSnapInterval,
      (index + 1) * previewSnapInterval,
    ];
    const scale = menuScrollY.interpolate({ inputRange, outputRange: [0.94, 1, 0.94], extrapolate: 'clamp' });
    const opacity = menuScrollY.interpolate({ inputRange, outputRange: [0.7, 1, 0.7], extrapolate: 'clamp' });

    return (
      <Animated.View
        style={[
          styles.previewCard,
          {
            width: viewerItemWidth,
            height: viewerItemHeight,
            marginVertical: STORE_PREVIEW_ITEM_GAP / 2,
            backgroundColor: appearanceChrome.modalSurface,
            borderColor: appearanceChrome.modalBorder,
            borderWidth: 1,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.previewImageWrap} pointerEvents="box-none">
          <TouchableOpacity
            style={[styles.previewDetailsFavoriteButton, { position: 'absolute', top: 12, right: 12, zIndex: 12 }]}
            onPress={() => handleToggleFavorite(item.id)}
          >
            <View style={styles.previewFavoriteCircle}>
              <Icon name={favoriteIds.has(item.id) ? 'heart' : 'heart-outline'} size={20} color={stylesTokens.orange} />
            </View>
          </TouchableOpacity>

          <Image source={resolveDshStoreMenuItemImageSource(item)} style={styles.previewImage} resizeMode="cover" />

          {storeLogoImageSource ? (
            <View style={[styles.previewPartnerBadge, { position: 'absolute', bottom: 20, right: 12, zIndex: 13 }]} pointerEvents="none">
              <View style={styles.previewPartnerBadgeImageContainer}>
                <Image source={storeLogoImageSource} style={styles.previewPartnerBadgeImage} resizeMode="contain" />
              </View>
            </View>
          ) : null}

          <View
            style={[
              styles.previewDetailsBox,
              {
                backgroundColor: stylesTokens.whiteOverlay,
                borderColor: appearanceChrome.modalBorder,
                borderWidth: 1,
                borderRadius: radius.xl,
                margin: spacing[3],
                padding: spacing[3],
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={[styles.previewDetailsContent, { flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', paddingRight: isRTL ? 56 : 0, paddingLeft: isRTL ? 0 : 8 }]}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text role="labelLg" weight="black" style={[styles.previewDetailsTitle, { color: appearanceChrome.primaryText }]} numberOfLines={1}>{normalizeDisplayText(item.name)}</Text>
                {store ? <Text role="caption" weight="black" style={[styles.previewStoreName, { color: appearanceChrome.accent, marginHorizontal: 4 }]}>· {normalizedStoreName}</Text> : null}
              </View>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                {item.priceLabel ? <Text role="headingSm" weight="black" style={[styles.previewDetailsPrice, { color: appearanceChrome.primaryText }]}>{normalizeDisplayText(item.priceLabel)}</Text> : null}
                {item.discountLabel ? <Text role="caption" weight="bold" style={[styles.previewDetailsDiscount, { color: appearanceChrome.accent, marginHorizontal: 6 }]}>{normalizeDisplayText(item.discountLabel)}</Text> : null}
                {item.subtitle ? <Text role="caption" style={[styles.previewDetailsSubtitle, { color: appearanceChrome.secondaryText }]}>· {normalizeDisplayText(item.subtitle)}</Text> : null}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.previewActionButton, { backgroundColor: stylesTokens.orange, padding: 10, borderRadius: radius.md2 }]}
              onPress={() => {
                openMeasurementPicker(item, { x: viewportWidth / 2, y: viewportHeight / 2 });
                closeImagePreview();
              }}
            >
              <View style={{ position: 'relative' }}>
                <Icon name="cart-outline" size={20} color={stylesTokens.white} />
                <View style={[styles.previewActionPlusBadge, { backgroundColor: stylesTokens.white, borderColor: stylesTokens.orange }]}>
                  <Icon name="add" size={8} color={stylesTokens.orange} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }, [
    appearanceChrome,
    closeImagePreview,
    favoriteIds,
    handleToggleFavorite,
    isRTL,
    normalizedStoreName,
    openMeasurementPicker,
    viewerItemHeight,
    viewerItemWidth,
    menuScrollY,
    previewSnapInterval,
    store,
    storeLogoImageSource,
    styles,
    viewportHeight,
    viewportWidth,
  ]);

  return (
    <Modal visible={Boolean(viewerItem)} transparent animationType="fade" onRequestClose={closeImagePreview}>
      <View style={[styles.previewOverlay, { backgroundColor: appearanceChrome.overlay }]}>
        <Pressable style={styles.previewBackdrop} onPress={closeImagePreview} />
        <Animated.View
          style={[
            styles.previewWrap,
            {
              opacity: viewerAnim,
              transform: [{ scale: viewerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.FlatList
            ref={menuListRef}
            data={viewerItems}
            renderItem={renderPreviewItem}
            keyExtractor={(item: DshStoreGetMenuItem) => `preview-${item.id}`}
            horizontal={false}
            initialNumToRender={STORE_PREVIEW_INITIAL_NUM_TO_RENDER}
            maxToRenderPerBatch={STORE_PREVIEW_MAX_TO_RENDER_PER_BATCH}
            windowSize={STORE_PREVIEW_WINDOW_SIZE}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            snapToInterval={previewSnapInterval}
            snapToAlignment="center"
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: menuScrollY } } }],
              { useNativeDriver: true },
            )}
            contentContainerStyle={{
              paddingVertical: (viewportHeight - viewerItemHeight) / 2 - STORE_PREVIEW_ITEM_GAP / 2,
            }}
            initialScrollIndex={viewerActiveIndex !== -1 ? viewerActiveIndex : 0}
            getItemLayout={(_, index) => ({
              length: previewSnapInterval,
              offset: previewSnapInterval * index,
              index,
            })}
            onMomentumScrollEnd={(event: { nativeEvent: { contentOffset: { y: number } } }) => {
              const index = Math.round(event.nativeEvent.contentOffset.y / previewSnapInterval);
              if (index >= 0 && index < viewerItems.length) {
                setPreviewActiveIndex(index);
                setPreviewItem(viewerItems[index]);
              }
            }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
