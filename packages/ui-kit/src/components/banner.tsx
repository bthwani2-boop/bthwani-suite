import React from 'react';
import { Animated, FlatList, Pressable, StyleSheet, View, useWindowDimensions, type ImageSourcePropType, type NativeScrollEvent, type NativeSyntheticEvent, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Text } from '../primitives';

export type BannerCarouselItem = {
  id: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  cta?: string;
  image?: ImageSourcePropType | null;
  imageUrl?: string;
  accentColor?: string;
  onPress?: () => void;
};

export type BannerCarouselVariant = 'main' | 'secondary';

export type BannerCarouselProps = {
  banners: BannerCarouselItem[];
  variant?: BannerCarouselVariant;
  width?: number;
  height?: number;
  fullBleed?: boolean;
  itemWidth?: number;
  itemGap?: number;
  autoPlayInterval?: number;
  resumeAfterMs?: number;
  onBannerPress?: (item: BannerCarouselItem) => void;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_AUTO_PLAY_INTERVAL_MS = 3400;
const DEFAULT_RESUME_AFTER_MS = 1100;
const CARD_INSET = 56;
const ITEM_GAP = 8;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function BannerCarousel({
  banners,
  variant = 'main',
  width: widthProp,
  height = 172,
  fullBleed = false,
  itemWidth,
  itemGap,
  autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL_MS,
  resumeAfterMs = DEFAULT_RESUME_AFTER_MS,
  onBannerPress,
  style,
}: BannerCarouselProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  const isSecondary = variant === 'secondary';
  const isCompactSecondary = isSecondary && height <= 104;
  const isPeekSecondary = isSecondary && !fullBleed;

  const resolvedWidth = widthProp ?? measuredWidth ?? windowWidth;
  const isRtl = direction === 'rtl';
  const count = banners.length;
  const loopedBanners = React.useMemo(
    () => (count > 1 ? [banners[count - 1], ...banners, banners[0]] : banners),
    [banners, count],
  );
  const loopedCount = loopedBanners.length;

  const listRef = React.useRef<FlatList<BannerCarouselItem>>(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(count > 1 ? 1 : 0);
  const autoplayTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const defaultSecondaryInset = isPeekSecondary ? CARD_INSET : 0;
  const defaultSecondaryGap = isPeekSecondary ? ITEM_GAP : 0;
  const resolvedItemWidth = itemWidth ?? Math.max(0, resolvedWidth - defaultSecondaryInset);
  const resolvedItemGap = itemGap ?? defaultSecondaryGap;
  const snapInterval = resolvedItemWidth + resolvedItemGap;
  const horizontalPadding = isSecondary ? Math.max(0, resolvedWidth / 2 - snapInterval / 2) : 0;
  const decelerationRate = isSecondary ? 'normal' : 'fast';
  const snapAlignment = isSecondary ? 'center' : 'start';
  const styles = React.useMemo(() => createStyles(theme, isCompactSecondary), [theme, isCompactSecondary]);
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

  React.useEffect(() => {
    if (resolvedWidth <= 0) {
      return;
    }

    const current = activeIndexRef.current;
    const offset = snapOffsets[current] ?? current * snapInterval;
    listRef.current?.scrollToOffset({ offset, animated: false });
  }, [resolvedWidth, snapOffsets, snapInterval]);

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
    (item: BannerCarouselItem, index: number) => `${item.id}-${index}`,
    [],
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: BannerCarouselItem; index: number }) => {
      const resolvedImageSource: ImageSourcePropType | null =
        item.image ?? (item.imageUrl ? { uri: item.imageUrl } : null);

      const inputRange = [
        (index - 2) * snapInterval,
        (index - 1) * snapInterval,
        index * snapInterval,
        (index + 1) * snapInterval,
        (index + 2) * snapInterval,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: isSecondary ? [0.94, 0.985, 1, 0.985, 0.94] : [0.9, 0.95, 1, 0.95, 0.9],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: isSecondary ? [0.78, 0.9, 1, 0.9, 0.78] : [0.62, 0.8, 1, 0.8, 0.62],
        extrapolate: 'clamp',
      });

      const translateX = scrollX.interpolate({
        inputRange,
        outputRange: isSecondary ? [-5, -2, 0, 2, 5] : [-8, -4, 0, 4, 8],
        extrapolate: 'clamp',
      });

      const shadowOpacity = scrollX.interpolate({
        inputRange,
        outputRange: isSecondary ? [0.06, 0.1, 0.16, 0.1, 0.06] : [0.08, 0.13, 0.2, 0.13, 0.08],
        extrapolate: 'clamp',
      });

      const mediaShift = scrollX.interpolate({
        inputRange,
        outputRange: isSecondary ? [-3, -1, 0, 1, 3] : [-6, -3, 0, 3, 6],
        extrapolate: 'clamp',
      });

      const cardAnimatedStyle = isSecondary
        ? {
            opacity,
            shadowOpacity,
            transform: [{ translateX }, { scale }],
          }
        : {
            opacity: 1,
            shadowOpacity: 0,
            transform: [{ translateX: 0 }, { scale: 1 }],
          };

      const mediaAnimatedStyle = isSecondary
        ? { transform: [{ translateX: mediaShift }] }
        : { transform: [{ translateX: 0 }] };

      const cardBackground = resolvedImageSource
        ? isSecondary
          ? theme.surface
          : 'transparent'
        : item.accentColor ?? theme.brand;

      return (
        <View style={[styles.itemWrap, { width: snapInterval, height }]}>
          <Pressable
            style={{ width: resolvedItemWidth, height }}
            onPress={() => {
              item.onPress?.();
              onBannerPress?.(item);
            }}
            onTouchStart={pauseAutoplay}
          >
            <Animated.View
              style={[
                styles.card,
                isSecondary ? styles.cardSecondary : styles.cardMain,
                {
                  width: resolvedItemWidth,
                  height,
                  backgroundColor: cardBackground,
                },
                cardAnimatedStyle,
              ]}
            >
              {resolvedImageSource ? (
                <>
                  <Animated.Image
                    source={resolvedImageSource}
                    style={[styles.image, mediaAnimatedStyle]}
                    resizeMode="cover"
                  />
                  {isSecondary ? (
                    <View style={styles.secondaryOverlay}>
                      <View style={[styles.secondaryTopRow, { flexDirection: resolveRowDirection(direction) }]}>
                        {item.badge ? (
                          <View style={styles.secondaryBadgePill}>
                            <Animated.Text style={styles.secondaryBadgeText} numberOfLines={1}>
                              {item.badge}
                            </Animated.Text>
                          </View>
                        ) : (
                          <View />
                        )}
                        {item.cta ? (
                          <View style={[styles.secondaryCtaPill, { backgroundColor: item.accentColor ?? theme.brand }]}>
                            <Animated.Text style={styles.secondaryCtaText} numberOfLines={1}>
                              {item.cta}
                            </Animated.Text>
                          </View>
                        ) : null}
                      </View>

                      {(item.title || item.subtitle) ? (
                        <View style={styles.secondaryCopyBlock}>
                          {item.title ? <Animated.Text style={styles.secondaryOverlayTitle} numberOfLines={2}>{item.title}</Animated.Text> : null}
                          {item.subtitle ? <Animated.Text style={styles.secondaryOverlaySubtitle} numberOfLines={2}>{item.subtitle}</Animated.Text> : null}
                        </View>
                      ) : null}
                    </View>
                  ) : item.title || item.subtitle ? (
                    <View style={styles.overlay}>
                      {item.title ? <Animated.Text style={styles.overlayTitle}>{item.title}</Animated.Text> : null}
                      {item.subtitle ? <Animated.Text style={styles.overlaySubtitle}>{item.subtitle}</Animated.Text> : null}
                    </View>
                  ) : null}
                </>
              ) : (
                <Animated.View
                  style={[
                    isSecondary ? styles.imageFallbackSecondary : styles.imageFallback,
                    {
                      backgroundColor: item.accentColor ?? theme.brand,
                      transform: [{ translateX: 0 }],
                    },
                  ]}
                >
                  {isSecondary ? (
                    <View style={styles.secondaryFallbackContent}>
                      {item.badge ? (
                        <View style={styles.secondaryBadgePill}>
                          <Animated.Text style={styles.secondaryBadgeText} numberOfLines={1}>
                            {item.badge}
                          </Animated.Text>
                        </View>
                      ) : null}

                      {(item.title || item.subtitle) ? (
                        <View style={styles.secondaryCopyBlock}>
                          {item.title ? <Animated.Text style={styles.secondaryOverlayTitle} numberOfLines={2}>{item.title}</Animated.Text> : null}
                          {item.subtitle ? <Animated.Text style={styles.secondaryOverlaySubtitle} numberOfLines={2}>{item.subtitle}</Animated.Text> : null}
                        </View>
                      ) : null}

                      {item.cta ? (
                        <View style={[styles.secondaryCtaPill, { backgroundColor: item.accentColor ?? theme.brand }]}>
                          <Animated.Text style={styles.secondaryCtaText} numberOfLines={1}>
                            {item.cta}
                          </Animated.Text>
                        </View>
                      ) : null}
                    </View>
                  ) : item.title || item.subtitle ? (
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
    [height, onBannerPress, pauseAutoplay, resolvedItemWidth, scrollX, snapInterval, styles, theme],
  );

  const handleLayout = React.useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      if (widthProp != null) {
        return;
      }

      const nextWidth = Math.round(event.nativeEvent.layout.width);
      setMeasuredWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
    },
    [widthProp],
  );

  if (!count) {
    return null;
  }

  return (
    <View onLayout={handleLayout} style={[styles.root, { width: widthProp ?? '100%', height: height + (isSecondary ? (isCompactSecondary ? spacing[2] : spacing[4]) : 0) }, style]}>
      <Animated.FlatList
        ref={listRef}
        horizontal
        data={loopedBanners}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate={decelerationRate}
        snapToInterval={snapInterval}
        snapToAlignment={snapAlignment}
        disableIntervalMomentum
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingVertical: isSecondary ? (isCompactSecondary ? spacing[0] : spacing[1]) : 0,
          flexDirection: 'row',
        }}
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
        <View style={[styles.progressRow, { flexDirection: resolveRowDirection(direction), bottom: isSecondary ? 0 : spacing[1] }]}>
          {banners.map((item, index) => {
            const active = index === activeIndex;

            return (
              <View
                key={item.id}
                style={[
                  styles.progressTrack,
                  active && {
                    width: 22,
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

function createStyles(theme: ReturnType<typeof useTheme>['theme'], isCompactSecondary: boolean) {
  const secondaryCardRadius = isCompactSecondary ? 22 : 30;
  const secondaryOverlayPadding = isCompactSecondary ? 10 : 18;
  const secondaryOverlayGap = isCompactSecondary ? 6 : 10;
  const secondaryCopyGap = isCompactSecondary ? 2 : 4;
  const secondaryBadgePaddingVertical = isCompactSecondary ? 2 : spacing[1];
  const secondaryBadgePaddingHorizontal = isCompactSecondary ? spacing[1] : spacing[2];
  const secondaryCtaPaddingVertical = isCompactSecondary ? 2 : spacing[1];
  const secondaryCtaPaddingHorizontal = isCompactSecondary ? spacing[2] : spacing[3];

  return StyleSheet.create({
    root: {
      overflow: 'visible',
      backgroundColor: 'transparent',
      alignSelf: 'stretch',
    },
    itemWrap: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
      backgroundColor: 'transparent',
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
    cardMain: {
      borderWidth: 0,
      borderColor: 'transparent',
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      backgroundColor: 'transparent',
    },
    cardSecondary: {
      borderRadius: secondaryCardRadius,
      borderWidth: 1,
      borderColor: theme.line,
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
      padding: isCompactSecondary ? 12 : 18,
      justifyContent: 'center',
    },
    imageFallbackSecondary: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.surfaceRaised,
      padding: isCompactSecondary ? 12 : 18,
      justifyContent: 'space-between',
    },
    fallbackContent: {
      gap: isCompactSecondary ? 4 : 6,
      alignItems: 'center',
    },
    secondaryFallbackContent: {
      ...StyleSheet.absoluteFillObject,
      padding: secondaryOverlayPadding,
      justifyContent: 'space-between',
      alignItems: 'stretch',
      backgroundColor: 'rgba(2,6,23,0.22)',
    },
    fallbackTitle: {
      color: '#ffffff',
      fontSize: isCompactSecondary ? 18 : 25,
      fontWeight: '800',
      lineHeight: isCompactSecondary ? 22 : 30,
      textAlign: 'center',
    },
    fallbackSubtitle: {
      color: 'rgba(255,255,255,0.96)',
      fontSize: isCompactSecondary ? 11 : 15,
      fontWeight: '600',
      lineHeight: isCompactSecondary ? 14 : 19,
      textAlign: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      padding: isCompactSecondary ? 14 : 22,
      backgroundColor: 'rgba(2,6,23,0.22)',
      gap: isCompactSecondary ? 4 : 6,
      alignItems: 'center',
    },
    secondaryOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'space-between',
      padding: secondaryOverlayPadding,
      backgroundColor: 'rgba(2,6,23,0.26)',
      gap: secondaryOverlayGap,
    },
    secondaryTopRow: {
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: secondaryOverlayGap,
    },
    secondaryCopyBlock: {
      gap: secondaryCopyGap,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    overlayTitle: {
      color: '#ffffff',
      fontSize: isCompactSecondary ? 18 : 23,
      fontWeight: '800',
      lineHeight: isCompactSecondary ? 22 : 28,
      textAlign: 'center',
    },
    overlaySubtitle: {
      color: 'rgba(255,255,255,0.96)',
      fontSize: isCompactSecondary ? 11 : 14,
      fontWeight: '600',
      lineHeight: isCompactSecondary ? 14 : 18,
      textAlign: 'center',
    },
    secondaryOverlayTitle: {
      color: '#ffffff',
      fontSize: isCompactSecondary ? 15 : 20,
      fontWeight: '800',
      lineHeight: isCompactSecondary ? 18 : 24,
      textAlign: 'center',
    },
    secondaryOverlaySubtitle: {
      color: 'rgba(255,255,255,0.92)',
      fontSize: isCompactSecondary ? 11 : 13,
      fontWeight: '600',
      lineHeight: isCompactSecondary ? 14 : 17,
      textAlign: 'center',
    },
    secondaryBadgePill: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.92)',
      borderRadius: radius.pill,
      paddingHorizontal: secondaryBadgePaddingHorizontal,
      paddingVertical: secondaryBadgePaddingVertical,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.24)',
    },
    secondaryBadgeText: {
      color: '#0f172a',
      fontSize: isCompactSecondary ? 10 : 11,
      fontWeight: '800',
      lineHeight: isCompactSecondary ? 12 : 14,
    },
    secondaryCtaPill: {
      alignSelf: 'flex-end',
      borderRadius: radius.pill,
      paddingHorizontal: secondaryCtaPaddingHorizontal,
      paddingVertical: secondaryCtaPaddingVertical,
    },
    secondaryCtaText: {
      color: '#ffffff',
      fontSize: isCompactSecondary ? 10 : 11,
      fontWeight: '800',
      lineHeight: isCompactSecondary ? 12 : 14,
    },
    progressRow: {
      position: 'absolute',
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    progressTrack: {
      width: 7,
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.surfaceInset,
    },
  });
}
