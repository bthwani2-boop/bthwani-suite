import React from 'react';
import { SearchField } from './field';
import { Icon } from './icons';
import { Animated, Easing, Pressable, ScrollView, StatusBar, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Badge, Button } from './button';
import { Surface, Text } from '../primitives';

export type TopBarVariant = 'default' | 'surface' | 'brand' | 'main' | 'secondary';

function isMainHeaderVariant(variant: TopBarVariant) {
  return variant === 'brand' || variant === 'main';
}

export type SearchTopBarProps = {
  value: string;
  onChangeText?: (value: string) => void;
  onClose?: () => void;
  placeholder?: string;
  hint?: string;
  closeAccessibilityLabel?: string;
  autoFocus?: boolean;
  variant?: TopBarVariant;
  style?: StyleProp<ViewStyle>;
};

export function SearchTopBar({ value, onChangeText, onClose, placeholder, hint, closeAccessibilityLabel = 'إغلاق البحث', autoFocus = false, variant = 'main', style }: SearchTopBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isMain = isMainHeaderVariant(variant);
  const surfaceStyle = isMain
    ? {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        paddingTop: spacing[0],
        paddingBottom: spacing[0],
        shadowColor: '#020617',
        shadowOpacity: 0.14,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      }
    : {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        paddingTop: spacing[1],
        paddingBottom: spacing[1],
        shadowColor: '#020617',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      };

  return (
    <Surface
      tone={isMain ? 'brandHeader' : 'raised'}
      border={!isMain}
      padding={isMain ? 1 : 2}
      gap={1}
      style={[surfaceStyle, style]}
    >
      <StatusBar
        animated
        barStyle={isMain ? 'light-content' : 'dark-content'}
        backgroundColor={isMain ? theme.brandHeaderStatusBar : theme.surface}
      />
      <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: spacing[2] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeAccessibilityLabel}
          hitSlop={8}
          onPress={onClose}
          style={({ pressed }) => [{ width: isMain ? 40 : 36, height: isMain ? 40 : 36, borderRadius: isMain ? 20 : 18, alignItems: 'center', justifyContent: 'center', backgroundColor: isMain ? theme.brandHeaderSurface : theme.surface, borderWidth: 1, borderColor: isMain ? theme.brandHeaderStroke : theme.line, opacity: pressed ? 0.92 : 1 }]}
        >
          <Icon name="close-outline" size={20} tone={isMain ? 'inverse' : 'default'} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <SearchField
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoFocus={autoFocus}
            style={{ minHeight: isMain ? 44 : 42 }}
          />
        </View>
      </View>

      {hint ? <Text role="caption" tone={isMain ? 'inverse' : 'muted'} style={isMain ? { opacity: 0.82 } : undefined}>{hint}</Text> : null}
    </Surface>
  );
}

export type NewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
  variant?: TopBarVariant;
  marquee?: boolean;
  marqueeDurationMs?: number;
  marqueePauseMs?: number;
  trailingAction?: {
    accessibilityLabel: string;
    icon: React.ReactNode;
    onPress?: () => void;
  };
};

export function NewsTickerBar({ statusLabel, message, onPress, variant = 'default', marquee = false, marqueeDurationMs = 18000, marqueePauseMs = 850, trailingAction }: NewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand' || variant === 'main';
  const badgeTone = isBrand ? 'default' : 'info';
  const messageLines = isBrand ? 1 : 2;
  const verticalPadding = isBrand ? spacing[1] : spacing[2];
  const horizontalPadding = isBrand ? spacing[2] : spacing[4];
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
  const marqueeGap = spacing[4];
  const marqueeDistance = copyWidth + marqueeGap;
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
        Animated.timing(marqueeTranslateX, {
          toValue: marqueeEndOffset,
          duration: marqueeDurationMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(marqueePauseMs),
      ]),
      { resetBeforeIteration: true },
    );

    loop.start();

    return () => {
      loop.stop();
      marqueeTranslateX.stopAnimation();
      marqueeTranslateX.setValue(marqueeStartOffset);
    };
  }, [marqueeDistance, marqueeDurationMs, marqueePauseMs, marqueeStartOffset, marqueeEndOffset, marqueeTranslateX, shouldMarquee]);

  const messageTone = isBrand ? 'inverse' : 'default';
  const actionButtonSize = isBrand ? 40 : 38;

  const measurementNode = (
    <View
      pointerEvents="none"
      onLayout={(event) => setCopyWidth(event.nativeEvent.layout.width)}
      style={{ position: 'absolute', opacity: 0, left: 0, top: 0 }}
    >
      <Text role="bodySm" tone={messageTone} numberOfLines={1} style={{ flexShrink: 0 }}>
        {message}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: verticalPadding,
          paddingHorizontal: horizontalPadding,
          borderRadius: isBrand ? radius.lg : radius.pill,
          backgroundColor: isBrand ? theme.brandHeaderSurfaceStrong : theme.surfaceInset,
          borderWidth: isBrand ? 1 : 0,
          borderColor: isBrand ? theme.brandHeaderStroke : theme.line,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[2], alignItems: 'center' }}>
        <Badge label={statusLabel} tone={badgeTone} style={badgeStyle} />
        <View style={{ flex: 1, minWidth: 0, overflow: 'hidden', justifyContent: 'center' }} onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}>
          {measurementNode}
          {shouldMarquee ? (
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ translateX: marqueeTranslateX }] }}>
              <View style={{ flexShrink: 0 }}>
                <Text role="bodySm" tone={messageTone} numberOfLines={1} style={{ flexShrink: 0 }}>
                  {message}
                </Text>
              </View>
              <View style={{ width: spacing[4] }} />
              <View style={{ flexShrink: 0 }}>
                <Text role="bodySm" tone={messageTone} numberOfLines={1} style={{ flexShrink: 0 }}>
                  {message}
                </Text>
              </View>
            </Animated.View>
          ) : (
            <Text role="bodySm" tone={messageTone} numberOfLines={messageLines} style={{ flex: 1, minWidth: 0 }}>
              {message}
            </Text>
          )}
        </View>
        {trailingAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={trailingAction.accessibilityLabel}
            onPress={trailingAction.onPress}
            hitSlop={8}
            style={({ pressed }) => [
              {
                width: actionButtonSize,
                height: actionButtonSize,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            {trailingAction.icon}
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

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

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number | string;
  countTone?: React.ComponentProps<typeof Badge>['tone'];
  headingOrder?: 'title-first' | 'count-first';
};

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

export type TabItem<Value extends string = string> = {
  value: Value;
  label: string;
  badgeLabel?: string;
  disabled?: boolean;
};

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
  layoutMode?: 'default' | 'balanced-secondary' | 'relaxed-main';
  contentOffsetY?: number;
  style?: StyleProp<ViewStyle>;
};

export function TopBar({ title, subtitle, locationLabel, locationIcon, onTitlePress, titleAccessibilityLabel, actions = [], trailingAction, ticker, tabs, variant = 'default', layoutMode = 'default', contentOffsetY = 0, style }: TopBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isMain = isMainHeaderVariant(variant);
  const useBalancedSecondary = !isMain && layoutMode === 'balanced-secondary';
  const useRelaxedMain = isMain && layoutMode === 'relaxed-main';
  const resolvedContentOffsetY = contentOffsetY || (isMain ? (useRelaxedMain ? spacing[2] : spacing[1]) : spacing[1]);
  const titleTone = isMain ? 'inverse' : 'default';
  const titleAlign = direction === 'rtl' ? 'end' : 'start';

  function resolveActionBoxSize(action: TopBarAction, isBackAction = action.id === 'back') {
    const actionSize = action.size ?? (isBackAction && !isMain ? 'lg' : 'md');
    if (actionSize === 'lg') {
      return isMain ? 40 : 42;
    }
    if (actionSize === 'sm') {
      return isMain ? 34 : 36;
    }
    return isMain ? 38 : 40;
  }

  const leadingClusterWidth = actions.length
    ? actions.reduce((width, action, index) => width + resolveActionBoxSize(action) + (index < actions.length - 1 ? spacing[2] : 0), 0)
    : 40;
  const trailingWidth = trailingAction ? resolveActionBoxSize(trailingAction) : 40;
  const balancedSideWidth = useBalancedSecondary ? Math.max(leadingClusterWidth, trailingWidth, 40) : undefined;

  function renderAction(action: TopBarAction) {
    const isBackAction = action.id === 'back';
    const badgeAnchorStyle = direction === 'rtl' ? { left: -spacing[1] } : { right: -spacing[1] };
    const iconStyle = action.mirrorInRtl && direction === 'rtl' ? { transform: [{ scaleX: -1 }] } : undefined;
    const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;
    const actionSize = action.size ?? (isBackAction && !isMain ? 'lg' : 'md');
    const actionBoxSize = resolveActionBoxSize(action, isBackAction);
    const iconScale = actionSize === 'lg' ? (isMain ? 0.96 : 1) : actionSize === 'sm' ? (isMain ? 0.88 : 0.9) : isMain ? 0.92 : 0.94;
    const actionBackgroundColor = isMain ? theme.brandHeaderSurface : isBackAction ? theme.brandSurface : theme.surface;
    const actionBorderColor = isMain ? theme.brandHeaderStroke : isBackAction ? theme.brand : theme.line;

    return (
      <Pressable key={action.id} accessibilityRole="button" accessibilityLabel={action.accessibilityLabel} disabled={action.disabled} hitSlop={8} onPress={action.onPress} style={({ pressed }) => [{ padding: 0, opacity: action.disabled ? 0.56 : pressed ? 0.92 : 1 }]}>
        <View style={{ position: 'relative', width: actionBoxSize, height: actionBoxSize, alignItems: 'center', justifyContent: 'center', borderRadius: actionBoxSize / 2, backgroundColor: actionBackgroundColor, borderWidth: 1, borderColor: actionBorderColor, shadowColor: '#020617', shadowOpacity: isMain ? 0 : 0.08, shadowRadius: isMain ? 0 : 10, shadowOffset: { width: 0, height: isMain ? 0 : 2 }, elevation: isMain ? 0 : 2 }}>
          {showBadge ? (
            <View style={[{ position: 'absolute', top: -spacing[1], zIndex: 1 }, badgeAnchorStyle]}>
              <Badge label={String(action.badgeCount)} tone={isMain ? 'info' : 'danger'} />
            </View>
          ) : null}
          <View style={[{ alignItems: 'center', justifyContent: 'center', transform: [{ scale: iconScale }] }, iconStyle]}>{action.icon}</View>
        </View>
      </Pressable>
    );
  }

  const surfaceStyle = isMain
    ? {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        paddingTop: useRelaxedMain ? spacing[1] : spacing[0],
        paddingBottom: useRelaxedMain ? spacing[1] : spacing[0],
        shadowColor: '#020617',
        shadowOpacity: 0.14,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      }
    : {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        paddingTop: spacing[1],
        paddingBottom: spacing[1],
        shadowColor: '#020617',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      };

  const contentRowStyle = [
    {
      flexDirection: isMain ? resolveRowDirection(direction) : 'row',
      justifyContent: 'space-between',
      alignItems: isMain ? 'flex-start' : 'center',
      gap: isMain ? spacing[1] : spacing[2],
      minHeight: isMain ? (useRelaxedMain ? 76 : 72) : 58,
    },
    resolvedContentOffsetY ? { transform: [{ translateY: resolvedContentOffsetY }] } : null,
  ];

  const mainTitleInline = (
    <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'flex-start', gap: spacing[1], flexShrink: 1, minWidth: 0, maxWidth: '100%' }}>
      <Text role="titleLg" tone={titleTone} numberOfLines={1} align={titleAlign} style={{ flexShrink: 1 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text role="bodySm" tone={titleTone} numberOfLines={1} align={titleAlign} style={{ opacity: 0.96, flexShrink: 1 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  const centeredSecondaryTitle = (
    <View style={{ flex: 1, minWidth: 0, gap: spacing[0], alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[1] }}>
      <Text role="titleSm" tone={titleTone} numberOfLines={1} align="center">
        {title}
      </Text>
      {subtitle ? (
        <Text role="bodySm" tone="muted" numberOfLines={1} align="center">
          {subtitle}
        </Text>
      ) : null}
      {locationLabel ? (
        <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[1], alignItems: 'center', justifyContent: 'center' }}>
          {locationIcon}
          <Text role="bodySm" tone="muted" numberOfLines={1} align="center">
            {locationLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );

  if (!isMain) {
    const titleInset = useBalancedSecondary && balancedSideWidth != null ? balancedSideWidth + spacing[2] : spacing[2];
    return (
      <Surface tone="raised" border padding={3} gap={2} style={[surfaceStyle, style]}>
        <StatusBar animated barStyle="dark-content" backgroundColor={theme.surface} />
        {ticker ? <NewsTickerBar {...ticker} variant={variant} /> : null}
        <View style={contentRowStyle}>
          <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center', flexShrink: 0, width: balancedSideWidth, justifyContent: 'flex-start' }}>
            {actions.map(renderAction)}
          </View>
          <View style={{ flex: 1, minWidth: 0, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', left: titleInset, right: titleInset, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} pointerEvents="box-none">
              {onTitlePress ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={titleAccessibilityLabel ?? title}
                  disabled={!onTitlePress}
                  hitSlop={8}
                  onPress={onTitlePress}
                  style={({ pressed }) => [{ opacity: pressed && onTitlePress ? 0.98 : 1, alignItems: 'center', justifyContent: 'center', flex: 1, minWidth: 0 }]}
                >
                  {centeredSecondaryTitle}
                </Pressable>
              ) : (
                centeredSecondaryTitle
              )}
            </View>
          </View>
          <View style={{ flexShrink: 0, width: balancedSideWidth, alignItems: 'flex-end', justifyContent: 'center' }}>
            {trailingAction ? renderAction(trailingAction) : <View style={{ width: 40, height: 40 }} />}
          </View>
        </View>
        {tabs ? <Tabs {...tabs} /> : null}
      </Surface>
    );
  }

  return (
    <Surface tone="brandHeader" border={false} padding={1} gap={0} style={[surfaceStyle, style]}>
      <StatusBar animated barStyle="light-content" backgroundColor={theme.brandHeaderStatusBar} />
      <View style={contentRowStyle}>
        <View style={{ flex: 1, gap: useRelaxedMain ? spacing[2] : spacing[1], alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
          <Pressable
            accessibilityRole={onTitlePress ? 'button' : 'text'}
            accessibilityLabel={titleAccessibilityLabel ?? title}
            disabled={!onTitlePress}
            hitSlop={8}
            onPress={onTitlePress}
            style={({ pressed }) => [{ opacity: pressed && onTitlePress ? 0.98 : 1 }]}
          >
            {mainTitleInline}
          </Pressable>
          {locationLabel ? (
            <View style={[{ flexDirection: resolveRowDirection(direction), gap: spacing[1], alignItems: 'center' }, isMain ? { alignSelf: direction === 'rtl' ? 'flex-end' : 'flex-start', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radius.pill, backgroundColor: theme.brandHeaderSurfaceStrong, borderWidth: 1, borderColor: theme.brandHeaderStroke } : null]}>
              {locationIcon}
              <Text role="bodySm" tone="inverse" numberOfLines={1} align={titleAlign} style={isMain ? { opacity: 0.96 } : undefined}>{locationLabel}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {actions.map(renderAction)}
          {trailingAction ? renderAction(trailingAction) : null}
        </View>
      </View>
      {isMain && ticker ? <NewsTickerBar {...ticker} variant={variant} /> : null}
      {tabs ? <Tabs {...tabs} /> : null}
    </Surface>
  );
}

