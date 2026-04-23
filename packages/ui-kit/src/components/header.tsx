import React from 'react';
import { Animated, Easing, Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { BthBadge, BthButton } from './button';
import { BthSurface, BthText } from '../primitives';

export type BthTopBarVariant = 'default' | 'surface' | 'brand';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
  variant?: BthTopBarVariant;
  marquee?: boolean;
  marqueeDurationMs?: number;
};

export function BthNewsTickerBar({ statusLabel, message, onPress, variant = 'default', marquee = false, marqueeDurationMs = 18000 }: BthNewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand';
  const messageLines = isBrand ? 1 : 2;
  const verticalPadding = isBrand ? 0 : spacing[2];
  const horizontalPadding = isBrand ? spacing[3] : spacing[4];
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
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(marqueeTranslateX, {
          toValue: marqueeEndOffset,
          duration: marqueeDurationMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
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
      style={({ pressed }) => [{ paddingVertical: verticalPadding, paddingHorizontal: horizontalPadding, borderRadius: radius.pill, backgroundColor: isBrand ? 'rgba(255, 255, 255, 0.14)' : theme.surfaceInset, borderWidth: isBrand ? 1 : 0, borderColor: isBrand ? 'rgba(255, 255, 255, 0.14)' : theme.line, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[2], alignItems: 'center' }}>
        <BthBadge label={statusLabel} tone="info" />
        <View style={{ flex: 1, overflow: 'hidden', justifyContent: 'center' }} onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}>
          {shouldMarquee ? (
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ translateX: marqueeTranslateX }] }}>
              <View onLayout={(event) => setCopyWidth(event.nativeEvent.layout.width)} style={{ flexShrink: 0 }}>
                <BthText role="bodySm" tone={messageTone} numberOfLines={1}>
                  {message}
                </BthText>
              </View>
              <View style={{ width: spacing[4] }} />
              <View style={{ flexShrink: 0 }}>
                <BthText role="bodySm" tone={messageTone} numberOfLines={1}>
                  {message}
                </BthText>
              </View>
            </Animated.View>
          ) : (
            <BthText role="bodySm" tone={messageTone} numberOfLines={messageLines} style={{ flex: 1 }}>
              {message}
            </BthText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export type BthScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthScreenHeader({ title, subtitle, actionLabel, onActionPress }: BthScreenHeaderProps) {
  return (
    <BthSurface tone="raised" padding={4} gap={2}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        {actionLabel ? <BthButton label={actionLabel} size="sm" fullWidth={false} onPress={onActionPress} /> : null}
      </View>
    </BthSurface>
  );
}

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number | string;
  countTone?: React.ComponentProps<typeof BthBadge>['tone'];
  headingOrder?: 'title-first' | 'count-first';
};

export function BthSectionHeader({ title, subtitle, trailing, count, countTone = 'default', headingOrder = 'title-first' }: BthSectionHeaderProps) {
  return (
    <View style={{ gap: spacing[2] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {headingOrder === 'count-first' && count != null ? <BthBadge label={String(count)} tone={countTone} /> : null}
          <View style={{ flex: 1, gap: spacing[1] }}>
            <BthText role="titleSm">{title}</BthText>
            {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
          </View>
          {headingOrder === 'title-first' && count != null ? <BthBadge label={String(count)} tone={countTone} /> : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}

export type BthTabItem<Value extends string = string> = {
  value: Value;
  label: string;
  badgeLabel?: string;
  disabled?: boolean;
};

export type BthTabsProps<Value extends string = string> = {
  items: readonly BthTabItem<Value>[];
  value: Value;
  onValueChange?: (nextValue: Value) => void;
  stretch?: boolean;
  variant?: 'line' | 'pill';
  scrollable?: boolean;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function BthTabs<Value extends string = string>({ items, value, onValueChange, stretch = false, variant = 'line', scrollable = false, wrap = false, style, testID }: BthTabsProps<Value>) {
  const { theme } = useTheme();
  const content = (
    <View style={[{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', gap: spacing[2] }, style]} testID={testID}>
      {items.map((item) => {
        const selected = item.value === value;
        const tab = (
          <Pressable key={String(item.value)} accessibilityRole="tab" accessibilityState={{ selected, disabled: item.disabled }} disabled={item.disabled} onPress={() => onValueChange?.(item.value)} style={({ pressed }) => [{ flex: stretch ? 1 : undefined, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: variant === 'pill' ? radius.pill : radius.md, borderWidth: 1, borderColor: selected ? theme.brand : theme.line, backgroundColor: selected ? theme.brand : theme.surface, opacity: item.disabled ? 0.56 : pressed ? 0.9 : 1, alignItems: 'center', gap: spacing[1] }]}>
            <BthText role="label" tone={selected ? 'inverse' : 'default'}>{item.label}</BthText>
            {item.badgeLabel ? <BthBadge label={item.badgeLabel} /> : null}
          </Pressable>
        );
        return tab;
      })}
    </View>
  );

  return scrollable ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>{content}</ScrollView> : content;
}

export type BthTopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  mirrorInRtl?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type BthTopBarProps = {
  title: string;
  subtitle?: string;
  locationLabel?: string;
  locationIcon?: React.ReactNode;
  actions?: BthTopBarAction[];
  trailingAction?: BthTopBarAction;
  ticker?: BthNewsTickerBarProps;
  tabs?: BthTabsProps<string>;
  variant?: BthTopBarVariant;
  contentOffsetY?: number;
  style?: StyleProp<ViewStyle>;
};

export function BthTopBar({ title, subtitle, locationLabel, locationIcon, actions = [], trailingAction, ticker, tabs, variant = 'default', contentOffsetY = 0, style }: BthTopBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand';
  const brandHeadline = isBrand && subtitle ? `${title} ${subtitle}` : title;

  function renderAction(action: BthTopBarAction) {
    const badgeAnchorStyle = direction === 'rtl' ? { left: -spacing[1] } : { right: -spacing[1] };
    const iconStyle = action.mirrorInRtl && direction === 'rtl' ? { transform: [{ scaleX: -1 }] } : undefined;
    const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;

    return (
      <Pressable key={action.id} accessibilityRole="button" accessibilityLabel={action.accessibilityLabel} disabled={action.disabled} onPress={action.onPress} style={({ pressed }) => [{ padding: isBrand ? spacing[2] : spacing[2], opacity: action.disabled ? 0.56 : pressed ? 0.9 : 1 }]}>
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          {showBadge ? (
            <View style={[{ position: 'absolute', top: -spacing[1], zIndex: 1 }, badgeAnchorStyle]}>
              <BthBadge label={String(action.badgeCount)} tone={isBrand ? 'brand' : 'danger'} />
            </View>
          ) : null}
          <View style={iconStyle}>{action.icon}</View>
        </View>
      </Pressable>
    );
  }

  return (
    <BthSurface tone={isBrand ? 'brand' : 'raised'} border={!isBrand} padding={isBrand ? 2 : 4} gap={isBrand ? 1 : 3} style={[isBrand ? { backgroundColor: theme.brand, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 0 } : undefined, style]}>
      {variant !== 'brand' && ticker ? <BthNewsTickerBar {...ticker} variant={variant} /> : null}
      <View style={[{ flexDirection: resolveRowDirection(direction), justifyContent: 'space-between', alignItems: locationLabel && isBrand ? 'flex-start' : 'center', gap: spacing[2] }, isBrand && contentOffsetY ? { transform: [{ translateY: contentOffsetY }] } : null]}>
        <View style={{ flex: 1, gap: isBrand ? spacing[0] : spacing[1] }}>
          {isBrand ? (
            <BthText role="titleSm" tone="inverse" numberOfLines={1}>{brandHeadline}</BthText>
          ) : (
            <>
              <BthText role="titleSm" tone="default">{title}</BthText>
              {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
            </>
          )}
          {locationLabel ? (
            <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[1], alignItems: 'center' }}>
              {locationIcon}
              <BthText role="bodySm" tone={isBrand ? 'inverse' : 'muted'} numberOfLines={1}>{locationLabel}</BthText>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: isBrand ? spacing[2] : spacing[2], alignItems: 'center' }}>
          {actions.map(renderAction)}
          {trailingAction ? renderAction(trailingAction) : null}
        </View>
      </View>
      {variant === 'brand' && ticker ? <BthNewsTickerBar {...ticker} variant={variant} /> : null}
      {tabs ? <BthTabs {...tabs} /> : null}
    </BthSurface>
  );
}