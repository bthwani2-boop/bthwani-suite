import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  View,
  type ImageSourcePropType,
  type PressableProps,
  type PressableStateCallbackType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colorPalette, radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Badge } from './button';
import { EmptyState } from './state';
import { Divider, Surface, Text } from '../primitives';

const cardWidth = Dimensions.get('window').width - 28;
const compactGap = 10;

type PressableStyle = PressableProps['style'];

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType): StyleProp<ViewStyle> {
  return typeof style === 'function' ? style(state) : style;
}

export type HighlightsRailItem = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  cta?: string;
  image?: ImageSourcePropType | string | null;
  emoji?: string;
  onPress?: () => void;
};

export type HighlightsRailProps = {
  items: HighlightsRailItem[];
  maxItems?: number;
  variant?: 'default' | 'mediaCompact';
  style?: StyleProp<ViewStyle>;
};

export function HighlightsRail({ items, maxItems = 5, variant = 'default', style }: HighlightsRailProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRTL = direction === 'rtl';
  const compact = variant === 'mediaCompact';
  const visibleItems = items.slice(0, maxItems);
  const [railWidth, setRailWidth] = React.useState(Dimensions.get('window').width);
  const compactCardWidth = compact ? Math.max(216, Math.round(railWidth * 0.64)) : 168;
  const compactStep = compactCardWidth + compactGap;
  const compactPeekInset = compact ? Math.max(0, Math.round((railWidth - compactCardWidth) / 2)) : 0;
  const compactLoopItems = React.useMemo(
    () => (compact && visibleItems.length > 1 ? [...visibleItems, ...visibleItems, ...visibleItems, ...visibleItems, ...visibleItems] : visibleItems),
    [compact, visibleItems]
  );
  const listRef = React.useRef<FlatList<HighlightsRailItem>>(null);
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
      autoIndexRef.current -= 1;
      listRef.current?.scrollToOffset({ offset: autoIndexRef.current * compactStep, animated: true });
    }, 2400);

    return () => {
      clearTimeout(startTimer);
      clearInterval(timer);
    };
  }, [compact, compactStep, middleLoopStart, railWidth, visibleItems.length]);

  const handleMomentumEnd = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
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

  const renderCard = (item: HighlightsRailItem, embedded = false) => {
    const imageSource = resolveImageSource(item.image);

    if (compact) {
      return (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          style={[
            {
              width: compactCardWidth,
              minHeight: 148,
              borderRadius: 18,
              overflow: 'hidden',
              backgroundColor: theme.surfaceRaised,
              borderColor: theme.line,
              borderWidth: 1,
            },
          ]}
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.brandSurface }}>
            <Text role="titleLg">{item.emoji ?? '✨'}</Text>
          </View>
          {imageSource ? <Image source={imageSource} style={{ position: 'absolute', inset: 0 }} /> : null}
          <View style={{ position: 'absolute', inset: 0, backgroundColor: colorPalette.overlaySoft }} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing[3], backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <Text role="label" tone="inverse" numberOfLines={2} align="center">
              {item.title}
            </Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={item.id}
        onPress={item.onPress}
        style={[
          {
            width: cardWidth,
            minHeight: 92,
            borderRadius: 22,
            padding: spacing[3],
            borderWidth: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            backgroundColor: theme.surfaceRaised,
            borderColor: theme.line,
          },
          embedded ? { width: '100%', minHeight: 84 } : null,
        ]}
      >
        <View style={{ gap: spacing[2], flex: 1 }}>
          {item.badge ? (
            <View style={{ alignSelf: 'flex-start', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radius.pill, backgroundColor: theme.warning }}>
              <Text role="label" style={{ color: theme.brandContrast }}>
                {item.badge}
              </Text>
            </View>
          ) : null}

          <Text role="titleMd" tone="default" numberOfLines={1} align="end">
            {item.title}
          </Text>

          <Text role="bodySm" tone="muted" numberOfLines={2} align="end">
            {item.subtitle}
          </Text>

          {item.cta ? (
            <View style={{ alignSelf: 'flex-start', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: radius.pill, backgroundColor: theme.brand }}>
              <Text role="label" tone="inverse">
                {item.cta}
              </Text>
            </View>
          ) : null}
        </View>

        {imageSource ? (
          <Image source={imageSource} style={{ width: 80, height: 80, borderRadius: radius.md }} />
        ) : (
          <View style={{ width: 80, height: 80, borderRadius: radius.md, backgroundColor: theme.brandSurface, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}>
            <Text role="titleLg" tone="default">
              {item.emoji ?? '✨'}
            </Text>
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
        contentContainerStyle={compact ? { paddingHorizontal: compactPeekInset } : { paddingHorizontal: 12 }}
        snapToInterval={compact ? compactStep : cardWidth + 12}
        snapToAlignment={compact ? 'center' : 'start'}
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

export type KeyValueItem = {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  helperText?: string;
};

export type KeyValueListProps = {
  items: readonly KeyValueItem[];
  dense?: boolean;
  dividers?: boolean;
};

export function KeyValueList({ items, dense = false, dividers = true }: KeyValueListProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <View style={{ width: '100%', gap: dense ? spacing[2] : spacing[3] }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={`${item.label}-${index}`} style={{ gap: spacing[2] }}>
            <View
              style={{
                width: '100%',
                flexDirection: resolveRowDirection(direction),
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: spacing[3],
              }}
            >
              <Text role={dense ? 'caption' : 'label'} tone="muted">
                {item.label}
              </Text>
              <View style={{ flex: 1, gap: spacing[1], alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end' }}>
                {typeof item.value === 'string' || typeof item.value === 'number' ? (
                  <Text role={dense ? 'bodySm' : 'bodyStrong'} tone={item.tone ?? 'default'}>
                    {String(item.value)}
                  </Text>
                ) : (
                  item.value
                )}
                {item.helperText ? <Text role="caption" tone="soft">{item.helperText}</Text> : null}
              </View>
            </View>
            {dividers && !isLast ? <Divider color={theme.line} /> : null}
          </View>
        );
      })}
    </View>
  );
}

export type ListItemProps = React.ComponentProps<typeof Pressable> & {
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
};

export function ListItem({ title, subtitle, meta, badgeLabel, style, ...rest }: ListItemProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: '100%',
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: 18,
          backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
          padding: spacing[4],
          gap: spacing[2],
        },
        resolvePressableStyle(style, { pressed }),
      ]}
      {...rest}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text role="bodyStrong">{title}</Text>
          {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
        </View>
        {badgeLabel ? <Badge label={badgeLabel} tone="brand" /> : null}
      </View>
      {meta ? <Text role="caption" tone="soft">{meta}</Text> : null}
    </Pressable>
  );
}

function resolveCellAlignment(direction: 'rtl' | 'ltr', align: 'start' | 'center' | 'end') {
  if (align === 'center') return 'center';
  if (align === 'end') return direction === 'rtl' ? 'flex-start' : 'flex-end';
  return direction === 'rtl' ? 'flex-end' : 'flex-start';
}

export type DataTableColumn<Row extends Record<string, unknown>> = {
  id: string;
  header: string;
  renderCell: (row: Row) => React.ReactNode;
  align?: 'start' | 'center' | 'end';
  grow?: number;
};

export type DataTableProps<Row extends Record<string, unknown>> = {
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  rowKey: keyof Row | ((row: Row, index: number) => string);
  caption?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  dense?: boolean;
  language?: string;
};

export function DataTable<Row extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  caption,
  emptyTitle,
  emptyDescription,
  dense = false,
  language,
}: DataTableProps<Row>) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowGap = dense ? spacing[2] : spacing[3];

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} language={language} />;
  }

  const resolveRowId = (row: Row, index: number) => (typeof rowKey === 'function' ? rowKey(row, index) : String(row[rowKey]));

  return (
    <Surface tone="raised" padding={0} gap={0} radiusToken="xl" style={{ overflow: 'hidden' }}>
      {caption ? (
        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] }}>
          <Text role="caption" tone="muted">
            {caption}
          </Text>
        </View>
      ) : null}

      <View style={{ flexDirection: resolveRowDirection(direction), paddingHorizontal: spacing[4], paddingBottom: spacing[2], gap: spacing[3] }}>
        {columns.map((column) => (
          <View key={column.id} style={{ flex: column.grow ?? 1, alignItems: resolveCellAlignment(direction, column.align ?? 'start') }}>
            <Text role="label" tone="muted">
              {column.header}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 1, backgroundColor: theme.line }}>
        {rows.map((row, index) => (
          <View key={resolveRowId(row, index)} style={{ flexDirection: resolveRowDirection(direction), gap: rowGap, paddingHorizontal: spacing[4], paddingVertical: dense ? spacing[2] : spacing[3], backgroundColor: theme.surface }}>
            {columns.map((column) => (
              <View key={column.id} style={{ flex: column.grow ?? 1, alignItems: resolveCellAlignment(direction, column.align ?? 'start') }}>
                {column.renderCell(row)}
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={{ height: 1, backgroundColor: theme.line, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl }} />
    </Surface>
  );
}

