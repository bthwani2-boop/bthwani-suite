import React from 'react';
import { Animated, Easing, Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Badge, Button } from './button';
import { Surface, Text } from '../primitives';

export type TopBarVariant = 'default' | 'surface' | 'brand';
export type BthTopBarVariant = TopBarVariant;

export type NewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
  variant?: TopBarVariant;
  marquee?: boolean;
  marqueeDurationMs?: number;
};

export type BthNewsTickerBarProps = NewsTickerBarProps;

export function NewsTickerBar({ statusLabel, message, onPress, variant = 'default', marquee = false, marqueeDurationMs = 18000 }: NewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand';
  const messageLines = isBrand ? 1 : 2;
  const verticalPadding = isBrand ? spacing[0] : spacing[2];
  const horizontalPadding = isBrand ? spacing[3] : spacing[4];
  const badgeStyle = isBrand
    ? {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.95)',
      }
    : undefined;
  const marqueeTranslateX = React.useRef(new Animated.Value(0)).current;
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [copyWidth, setCopyWidth] = React.useState(0);
  const shouldMarquee = marquee && viewportWidth > 0 && copyWidth > viewportWidth;
  const marqueeDistance = copyWidth + spacing[4];
  const marqueeStartOffset = direction === 'rtl' ? -marqueeDistance : 0;
  const marqueeEndOffset = direction === 'rtl' ? 0 : -marqueeDistance;

  React.useEffect(() => {
    marqueeTranslateX.stopAnimation();
    marqueeTranslateX.setValue(0);
    setViewportWidth(0);
    setCopyWidth(0);
  }, [message, marquee, marqueeTranslateX]);

  React.useEffect(() => {
    if (!shouldMarquee) {
      marqueeTranslateX.stopAnimation();
      marqueeTranslateX.setValue(marqueeStartOffset);
      return undefined;
    }

    marqueeTranslateX.setValue(marqueeStartOffset);

    const loop = Animated.loop(
      Animated.timing(marqueeTranslateX, {
        toValue: marqueeEndOffset,
        duration: marqueeDurationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { resetBeforeIteration: true },
    );

    loop.start();

    return () => {
      loop.stop();
      marqueeTranslateX.stopAnimation();
      marqueeTranslateX.setValue(marqueeStartOffset);
    };
  }, [marqueeDistance, marqueeDurationMs, marqueeStartOffset, marqueeEndOffset, marqueeTranslateX, shouldMarquee]);

  const messageTone = isBrand ? 'inverse' : 'default';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: verticalPadding,
          paddingHorizontal: horizontalPadding,
          borderRadius: radius.pill,
          backgroundColor: isBrand ? 'rgba(255, 255, 255, 0.12)' : theme.surfaceInset,
          borderWidth: isBrand ? 1 : 0,
          borderColor: isBrand ? 'rgba(255, 255, 255, 0.16)' : theme.line,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[2], alignItems: 'center' }}>
        <Badge label={statusLabel} tone="info" style={badgeStyle} />
        <View style={{ flex: 1, overflow: 'hidden', justifyContent: 'center' }} onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}>
          {shouldMarquee ? (
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ translateX: marqueeTranslateX }] }}>
              <View onLayout={(event) => setCopyWidth(event.nativeEvent.layout.width)} style={{ flexShrink: 0 }}>
                <Text role="bodySm" tone={messageTone} numberOfLines={1}>
                  {message}
                </Text>
              </View>
              <View style={{ width: spacing[4] }} />
              <View style={{ flexShrink: 0 }}>
                <Text role="bodySm" tone={messageTone} numberOfLines={1}>
                  {message}
                </Text>
              </View>
            </Animated.View>
          ) : (
            <Text role="bodySm" tone={messageTone} numberOfLines={messageLines} style={{ flex: 1 }}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const BthNewsTickerBar = NewsTickerBar;

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export type BthScreenHeaderProps = ScreenHeaderProps;

export function ScreenHeader({ title, subtitle, actionLabel, onActionPress }: ScreenHeaderProps) {
  return (
    <Surface tone="raised" padding={4} gap={2}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text role="titleSm">{title}</Text>
          {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
        </View>
        {actionLabel ? <Button label={actionLabel} size="sm" fullWidth={false} onPress={onActionPress} /> : null}
      </View>
    </Surface>
  );
}

export const BthScreenHeader = ScreenHeader;

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number | string;
  countTone?: React.ComponentProps<typeof Badge>['tone'];
  headingOrder?: 'title-first' | 'count-first';
};

export type BthSectionHeaderProps = SectionHeaderProps;

export function SectionHeader({ title, subtitle, trailing, count, countTone = 'default', headingOrder = 'title-first' }: SectionHeaderProps) {
  return (
    <View style={{ gap: spacing[2] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {headingOrder === 'count-first' && count != null ? <Badge label={String(count)} tone={countTone} /> : null}
          <View style={{ flex: 1, gap: spacing[1] }}>
            <Text role="titleSm">{title}</Text>
            {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
          </View>
          {headingOrder === 'title-first' && count != null ? <Badge label={String(count)} tone={countTone} /> : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}

export const BthSectionHeader = SectionHeader;

export type TabItem<Value extends string = string> = {
  value: Value;
  label: string;
  badgeLabel?: string;
  disabled?: boolean;
};

export type BthTabItem<Value extends string = string> = TabItem<Value>;

export type TabsProps<Value extends string = string> = {
  items: readonly TabItem<Value>[];
  value: Value;
  onValueChange?: (nextValue: Value) => void;
  stretch?: boolean;
  variant?: 'line' | 'pill';
  scrollable?: boolean;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export type BthTabsProps<Value extends string = string> = TabsProps<Value>;

export function Tabs<Value extends string = string>({ items, value, onValueChange, stretch = false, variant = 'line', scrollable = false, wrap = false, style, testID }: TabsProps<Value>) {
  const { theme } = useTheme();
  const content = (
    <View style={[{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', gap: spacing[2] }, style]} testID={testID}>
      {items.map((item) => {
        const selected = item.value === value;
        const tab = (
          <Pressable key={String(item.value)} accessibilityRole="tab" accessibilityState={{ selected, disabled: item.disabled }} disabled={item.disabled} onPress={() => onValueChange?.(item.value)} style={({ pressed }) => [{ flex: stretch ? 1 : undefined, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: variant === 'pill' ? radius.pill : radius.md, borderWidth: 1, borderColor: selected ? theme.brand : theme.line, backgroundColor: selected ? theme.brand : theme.surface, opacity: item.disabled ? 0.56 : pressed ? 0.9 : 1, alignItems: 'center', gap: spacing[1] }]}>
            <Text role="label" tone={selected ? 'inverse' : 'default'}>{item.label}</Text>
            {item.badgeLabel ? <Badge label={item.badgeLabel} /> : null}
          </Pressable>
        );
        return tab;
      })}
    </View>
  );

  return scrollable ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>{content}</ScrollView> : content;
}

export const BthTabs = Tabs;

export type TopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  mirrorInRtl?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type BthTopBarAction = TopBarAction;

export type TopBarProps = {
  title: string;
  subtitle?: string;
  locationLabel?: string;
  locationIcon?: React.ReactNode;
  onTitlePress?: () => void;
  titleAccessibilityLabel?: string;
  actions?: TopBarAction[];
  trailingAction?: TopBarAction;
  ticker?: NewsTickerBarProps;
  tabs?: TabsProps<string>;
  variant?: TopBarVariant;
  contentOffsetY?: number;
  style?: StyleProp<ViewStyle>;
};

export type BthTopBarProps = TopBarProps;

export function TopBar({ title, subtitle, locationLabel, locationIcon, onTitlePress, titleAccessibilityLabel, actions = [], trailingAction, ticker, tabs, variant = 'default', contentOffsetY = 0, style }: TopBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand';
  const resolvedContentOffsetY = contentOffsetY || (isBrand ? spacing[1] : 0);
  const titleTone = isBrand ? 'inverse' : 'default';

  function renderAction(action: TopBarAction) {
    const badgeAnchorStyle = direction === 'rtl' ? { left: -spacing[1] } : { right: -spacing[1] };
    const iconStyle = action.mirrorInRtl && direction === 'rtl' ? { transform: [{ scaleX: -1 }] } : undefined;
    const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;
    const actionSize = action.size ?? 'md';
    const actionBoxSize = actionSize === 'lg' ? 44 : actionSize === 'sm' ? 34 : isBrand ? 40 : 36;
    const iconScale = actionSize === 'lg' ? 1 : actionSize === 'sm' ? 0.88 : 0.94;

    return (
      <Pressable key={action.id} accessibilityRole="button" accessibilityLabel={action.accessibilityLabel} disabled={action.disabled} hitSlop={8} onPress={action.onPress} style={({ pressed }) => [{ padding: 0, opacity: action.disabled ? 0.56 : pressed ? 0.92 : 1 }]}>
        <View style={{ position: 'relative', width: actionBoxSize, height: actionBoxSize, alignItems: 'center', justifyContent: 'center' }}>
          {showBadge ? (
            <View style={[{ position: 'absolute', top: -spacing[1], zIndex: 1 }, badgeAnchorStyle]}>
              <Badge label={String(action.badgeCount)} tone={isBrand ? 'info' : 'danger'} />
            </View>
          ) : null}
          <View style={[{ alignItems: 'center', justifyContent: 'center', transform: [{ scale: iconScale }] }, iconStyle]}>{action.icon}</View>
        </View>
      </Pressable>
    );
  }

  return (
    <Surface tone={isBrand ? 'brand' : 'raised'} border={!isBrand} padding={isBrand ? 2 : 4} gap={isBrand ? 1 : 3} style={[isBrand ? { backgroundColor: theme.brand, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: spacing[1] } : undefined, style]}>
      {variant !== 'brand' && ticker ? <NewsTickerBar {...ticker} variant={variant} /> : null}
      <View style={[{ flexDirection: resolveRowDirection(direction), justifyContent: 'space-between', alignItems: locationLabel && isBrand ? 'flex-start' : 'center', gap: spacing[1] }, resolvedContentOffsetY ? { transform: [{ translateY: resolvedContentOffsetY }] } : null]}>
        <View style={{ flex: 1, gap: spacing[0] }}>
          {isBrand ? (
            <Pressable
              accessibilityRole={onTitlePress ? 'button' : 'text'}
              accessibilityLabel={titleAccessibilityLabel ?? title}
              disabled={!onTitlePress}
              hitSlop={8}
              onPress={onTitlePress}
              style={({ pressed }) => [{ opacity: pressed && onTitlePress ? 0.98 : 1 }]}
            >
              <Text role="titleSm" tone={titleTone} numberOfLines={1} style={{ flexShrink: 1 }}>
                {title}
                {subtitle ? <Text role="bodySm" tone={titleTone} style={{ opacity: 0.92 }}>{` ${subtitle}`}</Text> : null}
              </Text>
            </Pressable>
          ) : (
            <>
              <Text role="titleSm" tone="default">{title}</Text>
              {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
            </>
          )}
          {locationLabel ? (
            <View style={[{ flexDirection: resolveRowDirection(direction), gap: spacing[1], alignItems: 'center' }, isBrand ? { paddingHorizontal: spacing[2], paddingVertical: spacing[0], borderRadius: radius.pill, backgroundColor: 'rgba(255, 255, 255, 0.12)' } : null]}>
              {locationIcon}
              <Text role="bodySm" tone={isBrand ? 'inverse' : 'muted'} numberOfLines={1}>{locationLabel}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: isBrand ? spacing[2] : spacing[2], alignItems: 'center' }}>
          {actions.map(renderAction)}
          {trailingAction ? renderAction(trailingAction) : null}
        </View>
      </View>
      {variant === 'brand' && ticker ? <NewsTickerBar {...ticker} variant={variant} /> : null}
      {tabs ? <Tabs {...tabs} /> : null}
    </Surface>
  );
}

export const BthTopBar = TopBar;