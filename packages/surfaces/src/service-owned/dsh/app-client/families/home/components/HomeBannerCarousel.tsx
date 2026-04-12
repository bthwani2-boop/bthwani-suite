import React from 'react';
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
import { useTheme } from '@bthwani/ui-kit';

export type HomeBannerCarouselItem = {
  id: string;
  imageUrl?: string;
  accentColor?: string;
  onPress?: () => void;
};

type Props = {
  banners: HomeBannerCarouselItem[];
  width?: number;
  height?: number;
  rtl?: boolean;
  autoPlayInterval?: number;
  resumeAfterMs?: number;
  onBannerPress?: (item: HomeBannerCarouselItem) => void;
};

const DEFAULT_AUTO_PLAY_INTERVAL_MS = 3400;
const DEFAULT_RESUME_AFTER_MS = 1100;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function HomeBannerCarousel({
  banners,
  width: widthProp,
  height = 172,
  rtl = true,
  autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL_MS,
  resumeAfterMs = DEFAULT_RESUME_AFTER_MS,
  onBannerPress,
}: Props) {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const width = widthProp ?? windowWidth;
  const count = banners.length;
  const listRef = React.useRef<FlatList<HomeBannerCarouselItem>>(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);
  const autoplayTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const centerCardWidth = Math.max(0, width - 44);
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const itemGap = 14;
  const snapInterval = centerCardWidth + itemGap;
  const horizontalPadding = Math.max(0, width / 2 - snapInterval / 2);
  const snapOffsets = React.useMemo(
    () => Array.from({ length: count }, (_, index) => index * snapInterval),
    [count, snapInterval]
  );

  const clearResumeTimer = React.useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const stopAutoplay = React.useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplay = React.useCallback(() => {
    stopAutoplay();

    if (count <= 1 || autoPlayInterval <= 0) {
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      const current = activeIndexRef.current;
      const next = rtl ? (current - 1 + count) % count : (current + 1) % count;
      activeIndexRef.current = next;
      setActiveIndex(next);
      const offset = snapOffsets[next] ?? next * snapInterval;
      listRef.current?.scrollToOffset({ offset, animated: true });
    }, autoPlayInterval);
  }, [autoPlayInterval, count, rtl, snapInterval, snapOffsets, stopAutoplay]);

  React.useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
      clearResumeTimer();
    };
  }, [clearResumeTimer, startAutoplay, stopAutoplay]);

  const pauseAutoplay = React.useCallback(() => {
    stopAutoplay();
    clearResumeTimer();
    if (count <= 1 || autoPlayInterval <= 0) {
      return;
    }
    resumeTimerRef.current = setTimeout(() => {
      startAutoplay();
    }, resumeAfterMs);
  }, [autoPlayInterval, clearResumeTimer, count, resumeAfterMs, startAutoplay, stopAutoplay]);

  const computeIndex = React.useCallback(
    (offsetX: number) => clamp(Math.round(offsetX / snapInterval), 0, Math.max(0, count - 1)),
    [count, snapInterval]
  );

  const onMomentumScrollEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = computeIndex(event.nativeEvent.contentOffset.x);
      activeIndexRef.current = next;
      setActiveIndex(next);
      clearResumeTimer();
      if (count > 1 && autoPlayInterval > 0) {
        startAutoplay();
      }
    },
    [autoPlayInterval, clearResumeTimer, computeIndex, count, startAutoplay]
  );

  const onScroll = React.useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true }),
    [scrollX]
  );

  const keyExtractor = React.useCallback((item: HomeBannerCarouselItem) => item.id, []);

  const renderItem = React.useCallback(
    ({ item, index }: { item: HomeBannerCarouselItem; index: number }) => {
      const inputRange = [
        (index - 2) * snapInterval,
        (index - 1) * snapInterval,
        index * snapInterval,
        (index + 1) * snapInterval,
        (index + 2) * snapInterval,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.88, 0.94, 1, 0.94, 0.88],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.58, 0.76, 1, 0.76, 0.58],
        extrapolate: 'clamp',
      });

      const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [-10, -6, 0, 6, 10],
        extrapolate: 'clamp',
      });

      const shadowOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.08, 0.14, 0.22, 0.14, 0.08],
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
            onTouchStart={pauseAutoplay}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  width: centerCardWidth,
                  height: height - 12,
                  opacity,
                  shadowOpacity,
                  transform: [{ translateX }, { scale }],
                },
              ]}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.imageFallback} />
              )}
            </Animated.View>
          </Pressable>
        </View>
      );
    },
    [centerCardWidth, height, onBannerPress, pauseAutoplay, scrollX, snapInterval, styles]
  );

  if (!count) {
    return null;
  }

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
        decelerationRate="fast"
        snapToOffsets={snapOffsets}
        snapToAlignment="center"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        getItemLayout={(_: unknown, index: number) => ({
          length: snapInterval,
          offset: index * snapInterval,
          index,
        })}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={pauseAutoplay}
        onTouchStart={pauseAutoplay}
        onTouchEnd={pauseAutoplay}
        inverted={rtl && Platform.OS !== 'web'}
      />

      {count > 1 && (
        <View style={[styles.progressRow, rtl && styles.progressRowRtl]}>
          {banners.map((item, index) => {
            const active = index === activeIndex;
            return (
              <View
                key={item.id}
                style={[
                  styles.progressTrack,
                  active && {
                    width: 18,
                    backgroundColor: item.accentColor ?? theme.brand,
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

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    root: {
      overflow: 'visible',
      backgroundColor: theme.surface,
      direction: 'ltr',
    },
    itemWrap: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: theme.surface,
      paddingTop: 2,
    },
    card: {
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: theme.surface,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 18,
      elevation: 3,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    imageFallback: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.surfaceRaised,
    },
    progressRow: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    progressRowRtl: {
      flexDirection: 'row-reverse',
    },
    progressTrack: {
      width: 7,
      height: 3,
      borderRadius: 999,
      backgroundColor: theme.surfaceInset,
    },
  });
}