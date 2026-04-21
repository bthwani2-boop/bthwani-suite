import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colorPalette } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

const cardWidth = Dimensions.get('window').width - 28;
const compactCardWidth = 168;
const compactGap = 10;

export type BthHighlightsRailItem = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  cta?: string;
  image?: ImageSourcePropType | string | null;
  emoji?: string;
  onPress?: () => void;
};

export type BthHighlightsRailProps = {
  items: BthHighlightsRailItem[];
  maxItems?: number;
  variant?: 'default' | 'mediaCompact';
  style?: StyleProp<ViewStyle>;
};

export function BthHighlightsRail({ items, maxItems = 5, variant = 'default', style }: BthHighlightsRailProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRTL = direction === 'rtl';
  const compact = variant === 'mediaCompact';
  const visibleItems = items.slice(0, maxItems);
  const [railWidth, setRailWidth] = React.useState(Dimensions.get('window').width);
  const compactStep = compactCardWidth + compactGap;
  const compactPeekInset = Math.max(0, Math.round((railWidth - compactCardWidth) / 2));
  const compactLoopItems = React.useMemo(
    () => (compact && visibleItems.length > 1
      ? [...visibleItems, ...visibleItems, ...visibleItems, ...visibleItems, ...visibleItems]
      : visibleItems),
    [compact, visibleItems]
  );
  const listRef = React.useRef<FlatList<BthHighlightsRailItem>>(null);
  const middleLoopStart = visibleItems.length * 2;
  const autoIndexRef = React.useRef(middleLoopStart);

  React.useEffect(() => {
    if (!compact || visibleItems.length <= 1) {
      return;
    }

    autoIndexRef.current = middleLoopStart;
    const startTimer = setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: middleLoopStart * compactStep, animated: false });
    }, 0);

    const timer = setInterval(() => {
      autoIndexRef.current += 1;
      listRef.current?.scrollToOffset({ offset: autoIndexRef.current * compactStep, animated: true });
    }, 2400);

    return () => {
      clearTimeout(startTimer);
      clearInterval(timer);
    };
  }, [compact, compactStep, middleLoopStart, railWidth, visibleItems.length]);

  const handleMomentumEnd = React.useCallback((event: any) => {
    if (!compact || visibleItems.length <= 1) {
      return;
    }

    const rawOffset = event.nativeEvent.contentOffset.x;
    const rawIndex = Math.round(rawOffset / compactStep);
    const lowerBound = middleLoopStart;
    const upperBound = middleLoopStart + visibleItems.length - 1;

    if (rawIndex > upperBound) {
      const normalizedIndex = rawIndex - visibleItems.length;
      autoIndexRef.current = normalizedIndex;
      listRef.current?.scrollToOffset({ offset: normalizedIndex * compactStep, animated: false });
      return;
    }

    if (rawIndex < lowerBound) {
      const normalizedIndex = rawIndex + visibleItems.length;
      autoIndexRef.current = normalizedIndex;
      listRef.current?.scrollToOffset({ offset: normalizedIndex * compactStep, animated: false });
      return;
    }

    autoIndexRef.current = rawIndex;
  }, [compact, compactStep, middleLoopStart, visibleItems.length]);

  if (!visibleItems.length) {
    return null;
  }

  const resolveImageSource = (image?: ImageSourcePropType | string | null): ImageSourcePropType | undefined => {
    if (!image) {
      return undefined;
    }

    return typeof image === 'string' ? { uri: image } : image;
  };

  const renderCard = (item: BthHighlightsRailItem, embedded = false) => {
    const imageSource = resolveImageSource(item.image);

    if (compact) {
      return (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          style={[
            styles.cardCompact,
            {
              backgroundColor: theme.surfaceRaised,
              borderColor: theme.line,
            },
          ]}
        >
          <View style={[styles.imageCompactFallback, { backgroundColor: theme.brandSurface, borderColor: theme.line }]}>
            <BthText role="titleLg">{item.emoji ?? '✨'}</BthText>
          </View>
          {imageSource ? <Image source={imageSource} style={styles.imageCompactFull} /> : null}
          <View style={styles.compactOverlay} />
          <View style={[styles.compactFooterGlass, { backgroundColor: colorPalette.overlaySoft }] }>
            <BthText role="label" tone="inverse" numberOfLines={2} align="center" style={styles.compactTitle}>
              {item.title}
            </BthText>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={item.id}
        onPress={item.onPress}
        style={[
          styles.card,
          embedded && styles.cardEmbedded,
          {
            backgroundColor: theme.surfaceRaised,
            borderColor: theme.line,
          },
        ]}
      >
        <View style={styles.content}>
          {item.badge ? (
            <View style={[styles.badge, { backgroundColor: theme.warning }]}> 
              <BthText role="label" style={{ color: theme.brandContrast }}>
                {item.badge}
              </BthText>
            </View>
          ) : null}

          <BthText role="titleMd" tone="default" numberOfLines={1} align="end">
            {item.title}
          </BthText>

          <BthText role="bodySm" tone="muted" numberOfLines={2} align="end" style={styles.subtitle}>
            {item.subtitle}
          </BthText>

          {item.cta ? (
            <View style={[styles.cta, { backgroundColor: theme.brand }]}> 
              <BthText role="label" tone="inverse">
                {item.cta}
              </BthText>
            </View>
          ) : null}
        </View>

        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={[styles.imageFallback, { backgroundColor: theme.brandSurface, borderColor: theme.line }]}>
            <BthText role="titleLg" tone="default">
              {item.emoji ?? '✨'}
            </BthText>
          </View>
        )}
      </Pressable>
    );
  };

  if (visibleItems.length === 1 && !compact) {
    return <View style={style}>{renderCard(visibleItems[0], true)}</View>;
  }

  return (
    <View style={style} onLayout={(event) => setRailWidth(event.nativeEvent.layout.width)}>
      <FlatList
        ref={listRef}
        data={compact ? compactLoopItems : visibleItems}
        horizontal
        inverted={compact ? false : isRTL}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (compact ? `${item.id}-${index}` : item.id)}
        contentContainerStyle={compact ? [styles.listContentCompact, { paddingHorizontal: compactPeekInset }] : styles.listContent}
        snapToInterval={compact ? compactStep : cardWidth + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        bounces={false}
        removeClippedSubviews={false}
        initialNumToRender={compact ? compactLoopItems.length : visibleItems.length}
        maxToRenderPerBatch={compact ? compactLoopItems.length : 10}
        windowSize={compact ? 7 : 5}
        onMomentumScrollEnd={handleMomentumEnd}
        getItemLayout={compact ? (_data, index) => ({ length: compactStep, offset: compactStep * index, index }) : undefined}
        ItemSeparatorComponent={() => <View style={{ width: compact ? compactGap : 12 }} />}
        renderItem={({ item }) => renderCard(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
  },
  listContentCompact: {
    paddingHorizontal: 0,
  },
  card: {
    width: cardWidth,
    minHeight: 92,
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardEmbedded: {
    width: '100%',
    minHeight: 84,
  },
  cardCompact: {
    width: compactCardWidth,
    minHeight: 136,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  imageCompactFull: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  imageCompactFallback: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.04)',
  },
  compactFooterGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 44,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  compactTitle: {
    textAlign: 'center',
    fontWeight: '900',
    lineHeight: 20,
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingStart: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    lineHeight: 18,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginStart: 10,
  },
  imageFallback: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginStart: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
