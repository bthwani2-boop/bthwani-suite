import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

export interface UltimateBannerItem {
  id: string;
  imageUrl?: string;
  accentColor?: string;
  onPress?: () => void;
}

/** Legacy alias used by auto_dsh_home_get */
export type BannerItem = UltimateBannerItem;

const AUTO_PLAY_INTERVAL_MS = 4500;

type Props = {
  banners: UltimateBannerItem[];
  width?: number;
  height?: number;
  /** true = Arabic: scroll left→right. false = English: scroll right→left. */
  rtl?: boolean;
  /** Auto-advance interval in ms. 0 = disabled. Default 4500. */
  autoPlayInterval?: number;
  onBannerPress?: (item: UltimateBannerItem) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function UltimateBannerCarousel({
  banners,
  width: widthProp,
  height = 220,
  rtl = false,
  autoPlayInterval = AUTO_PLAY_INTERVAL_MS,
  onBannerPress,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const width = widthProp ?? windowWidth;
  const count = banners.length;
  const listRef = useRef<FlatList<UltimateBannerItem>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const centerCardWidth = Math.min(width * 0.76, width - 72);
  const itemGap = 12;
  const snapInterval = centerCardWidth + itemGap;
  // Padding so that at offset i*snapInterval the center of item i is at viewport center
  const horizontalPadding = width / 2 - snapInterval / 2;

  // Exact scroll offsets so each item center lands on viewport center (100% centered)
  const snapOffsets = useMemo(
    () => Array.from({ length: count }, (_, i) => i * snapInterval),
    [count, snapInterval]
  );

  const inverted = rtl && Platform.OS !== 'web';

  useEffect(() => {
    if (count <= 1 || autoPlayInterval <= 0) return;
    const timer = setInterval(() => {
      const current = activeIndexRef.current;
      const next = rtl ? (current - 1 + count) % count : (current + 1) % count;
      setActiveIndex(next);
      const offset = snapOffsets[next] ?? next * snapInterval;
      listRef.current?.scrollToOffset({ offset, animated: true });
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [count, rtl, autoPlayInterval, snapInterval, snapOffsets]);

  const computeIndex = useCallback(
    (offsetX: number) => {
      const raw = Math.round(offsetX / snapInterval);
      return clamp(raw, 0, Math.max(0, count - 1));
    },
    [snapInterval, count]
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = computeIndex(e.nativeEvent.contentOffset.x);
      setActiveIndex(next);
    },
    [computeIndex]
  );

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX]
  );

  const keyExtractor = useCallback((item: UltimateBannerItem) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: UltimateBannerItem; index: number }) => {
      const inputRange = [
        (index - 2) * snapInterval,
        (index - 1) * snapInterval,
        index * snapInterval,
        (index + 1) * snapInterval,
        (index + 2) * snapInterval,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 0.96, 1, 0.96, 0.9],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 0.92, 1, 0.92, 0.7],
        extrapolate: 'clamp',
      });

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [4, 2, 0, 2, 4],
        extrapolate: 'clamp',
      });

      const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [-6, -3, 0, 3, 6],
        extrapolate: 'clamp',
      });

      const shadowOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.03, 0.06, 0.08, 0.06, 0.03],
        extrapolate: 'clamp',
      });

      return (
        <View style={[styles.itemWrap, { width: snapInterval, height }]}>
          <Pressable
            style={{ width: centerCardWidth }}
            onPress={() => {
              item.onPress?.();
              onBannerPress?.(item);
            }}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  width: centerCardWidth,
                  height: height - 12,
                  opacity,
                  shadowOpacity,
                  transform: [{ translateX }, { translateY }, { scale }],
                },
              ]}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode='cover'
                />
              ) : (
                <View style={styles.imageFallback} />
              )}
            </Animated.View>
          </Pressable>
        </View>
      );
    },
    [centerCardWidth, height, onBannerPress, scrollX, snapInterval]
  );

  if (!count) return null;

  return (
    <View style={[styles.root, { width, height: height + 8 }]}>
      <Animated.FlatList
        ref={listRef}
        horizontal
        data={banners}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate='fast'
        snapToOffsets={snapOffsets}
        snapToAlignment='center'
        disableIntervalMomentum
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
        }}
        getItemLayout={(_: unknown, index: number) => ({
          length: snapInterval,
          offset: index * snapInterval,
          index,
        })}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        inverted={inverted}
      />

      {count > 1 && (
        <View style={[styles.indicators, rtl && styles.indicatorsRtl]}>
          {banners.map((item, i) => {
            const active = i === activeIndex;
            return (
              <View
                key={item.id}
                style={[
                  styles.indicator,
                  active && {
                    width: 18,
                    backgroundColor: item.accentColor ?? BTHWANI_COLORS.accent,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    direction: 'ltr',
    backgroundColor: '#ffffff',
  },

  itemWrap: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    paddingTop: 2,
  },

  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 0,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 0,
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
  },

  indicators: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },

  indicatorsRtl: {
    flexDirection: 'row-reverse',
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: BTHWANI_COLORS.overlay20,
  },
});
