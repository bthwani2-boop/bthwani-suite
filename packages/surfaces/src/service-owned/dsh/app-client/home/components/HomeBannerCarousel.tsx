import React from 'react';
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { resolveRowDirection, useDirection, useTheme } from '@bthwani/ui-kit';

export type HomeBannerCarouselItem = {
  id: string;
  title?: string;
  subtitle?: string;
  image?: ImageSourcePropType | null;
  imageUrl?: string;
  accentColor?: string;
  onPress?: () => void;
};

type Props = {
  banners: HomeBannerCarouselItem[];
  width?: number;
  height?: number;
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
  autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL_MS,
  resumeAfterMs = DEFAULT_RESUME_AFTER_MS,
  onBannerPress,
}: Props) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  const width = widthProp ?? windowWidth;
  const isRtl = direction === 'rtl';
  const count = banners.length;
  const loopedBanners = React.useMemo(
    () => (count > 1 ? [banners[count - 1], ...banners, banners[0]] : banners),
    [banners, count],
  );
  const loopedCount = loopedBanners.length;

  const listRef = React.useRef<FlatList<HomeBannerCarouselItem>>(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(count > 1 ? 1 : 0);
  const autoplayTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const centerCardWidth = Math.max(0, width - 56);
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const itemGap = 8;
  const snapInterval = centerCardWidth + itemGap;
  const horizontalPadding = Math.max(0, width / 2 - snapInterval / 2);

  const snapOffsets = React.useMemo(
    () => Array.from({ length: loopedCount }, (_, index) => index * snapInterval),
    [loopedCount, snapInterval],
  );

  const toRealIndex = React.useCallback(
    (loopedIndex: number) => {
      if (count <= 1) {
        return 0;
      }

      if (loopedIndex <= 0) {
        return count - 1;
      }

      if (loopedIndex >= loopedCount - 1) {
        return 0;
      }

      return loopedIndex - 1;
    },
    [count, loopedCount],
  );

  const jumpToLoopedIndex = React.useCallback(
    (nextLoopedIndex: number) => {
      const offset = nextLoopedIndex * snapInterval;
      activeIndexRef.current = nextLoopedIndex;
      listRef.current?.scrollToOffset({ offset, animated: false });
    },
    [snapInterval],
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
      const next = isRtl
        ? (current - 1 + loopedCount) % loopedCount
        : (current + 1) % loopedCount;

      activeIndexRef.current = next;
      setActiveIndex(toRealIndex(next));

      const offset = snapOffsets[next] ?? next * snapInterval;
      listRef.current?.scrollToOffset({ offset, animated: true });
    }, autoPlayInterval);
  }, [autoPlayInterval, count, isRtl, loopedCount, snapInterval, snapOffsets, stopAutoplay, toRealIndex]);

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
    (offsetX: number) => clamp(Math.round(offsetX / snapInterval), 0, Math.max(0, loopedCount - 1)),
    [loopedCount, snapInterval],
  );

  const onMomentumScrollEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = computeIndex(event.nativeEvent.contentOffset.x);

      if (count > 1) {
        if (next <= 0) {
          jumpToLoopedIndex(loopedCount - 2);
          setActiveIndex(count - 1);
          clearResumeTimer();

          if (autoPlayInterval > 0) {
            startAutoplay();
          }

          return;
        }

        if (next >= loopedCount - 1) {
          jumpToLoopedIndex(1);
          setActiveIndex(0);
          clearResumeTimer();

          if (autoPlayInterval > 0) {
            startAutoplay();
          }

          return;
        }
      }

      activeIndexRef.current = next;
      setActiveIndex(toRealIndex(next));
      clearResumeTimer();

      if (count > 1 && autoPlayInterval > 0) {
        startAutoplay();
      }
    },
    [autoPlayInterval, clearResumeTimer, computeIndex, count, jumpToLoopedIndex, loopedCount, startAutoplay, toRealIndex],
  );

  const onScroll = React.useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true }),
    [scrollX],
  );

  const keyExtractor = React.useCallback(
    (item: HomeBannerCarouselItem, index: number) => `${item.id}-${index}`,
    [],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: HomeBannerCarouselItem; index: number }) => {
      const resolvedImageSource = item.image ?? (item.imageUrl ? { uri: item.imageUrl } : null);

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

      const mediaShift = scrollX.interpolate({
        inputRange,
        outputRange: [-8, -4, 0, 4, 8],
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
                  height,
                  opacity,
                  shadowOpacity,
                  transform: [{ translateX }, { scale }],
                  backgroundColor: resolvedImageSource ? theme.surface : item.accentColor ?? theme.brand,
                },
              ]}
            >
              {resolvedImageSource ? (
                <>
                  <Animated.Image
                    source={resolvedImageSource}
                    style={[styles.image, { transform: [{ translateX: mediaShift }] }]}
                    resizeMode="cover"
                  />
                  {item.title || item.subtitle ? (
                    <View style={styles.overlay}>
                      {item.title ? (
                        <View>
                          <Animated.Text style={styles.overlayTitle}>{item.title}</Animated.Text>
                        </View>
                      ) : null}
                      {item.subtitle ? (
                        <View>
                          <Animated.Text style={styles.overlaySubtitle}>{item.subtitle}</Animated.Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </>
              ) : (
                <Animated.View
                  style={[
                    styles.imageFallback,
                    {
                      backgroundColor: item.accentColor ?? theme.brand,
                      transform: [{ translateX: mediaShift }],
                    },
                  ]}
                >
                  {item.title || item.subtitle ? (
                    <View style={styles.fallbackContent}>
                      {item.title ? <Animated.Text style={styles.fallbackTitle}>{item.title}</Animated.Text> : null}
                      {item.subtitle ? <Animated.Text style={styles.fallbackSubtitle}>{item.subtitle}</Animated.Text> : null}
                    </View>
                  ) : null}
                </Animated.View>
              )}
            </Animated.View>
          </Pressable>
        </View>
      );
    },
    [centerCardWidth, height, onBannerPress, pauseAutoplay, scrollX, snapInterval, styles, theme],
  );

  if (!count) {
    return null;
  }

  return (
    <View style={[styles.root, { width, height: height + 4 }]}>
      <Animated.FlatList
        ref={listRef}
        horizontal
        data={loopedBanners}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToOffsets={snapOffsets}
        snapToAlignment="center"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, flexDirection: 'row' }}
        initialScrollIndex={count > 1 ? 1 : 0}
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
      />

      {count > 1 ? (
        <View style={[styles.progressRow, { flexDirection: resolveRowDirection(direction) }]}>
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
      ) : null}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    root: {
      overflow: 'visible',
      backgroundColor: theme.surface,
      alignSelf: 'center',
    },
    itemWrap: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: theme.surface,
      paddingTop: 0,
    },
    card: {
      borderRadius: 28,
      overflow: 'hidden',
      backgroundColor: theme.surface,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
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
      padding: 18,
      justifyContent: 'center',
    },
    fallbackContent: {
      gap: 6,
      alignItems: 'center',
    },
    fallbackTitle: {
      color: '#ffffff',
      fontSize: 25,
      fontWeight: '800',
      lineHeight: 30,
      textAlign: 'center',
    },
    fallbackSubtitle: {
      color: 'rgba(255,255,255,0.95)',
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 19,
      textAlign: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      padding: 22,
      backgroundColor: 'rgba(0,0,0,0.24)',
      gap: 6,
      alignItems: 'center',
    },
    overlayTitle: {
      color: '#ffffff',
      fontSize: 23,
      fontWeight: '800',
      lineHeight: 28,
      textAlign: 'center',
    },
    overlaySubtitle: {
      color: 'rgba(255,255,255,0.96)',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
      textAlign: 'center',
    },
    progressRow: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    progressTrack: {
      width: 7,
      height: 3,
      borderRadius: 999,
      backgroundColor: theme.surfaceInset,
    },
  });
}
