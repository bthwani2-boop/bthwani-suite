import React from 'react';
import { SearchField } from './field';
import { Icon } from './icons';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, StatusBar, View, type StyleProp, type ViewStyle } from 'react-native';
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
  const surfaceStyle: ViewStyle = isMain
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

export type MobileWorkspaceHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  iconSlot?: React.ReactNode;
  actions?: TopBarAction[];
  backLabel?: string;
  backIcon?: React.ComponentProps<typeof Icon>['name'];
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function MobileWorkspaceHeader({
  title,
  description,
  icon,
  iconSlot,
  actions = [],
  backLabel = 'العودة',
  backIcon = 'chevron-forward-outline',
  onBack,
  style,
}: MobileWorkspaceHeaderProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = resolveRowDirection(direction);
  const textAlign = direction === 'rtl' ? 'end' : 'start';
  const resolvedIcon = iconSlot ?? (icon ? <Icon name={icon} size={20} tone="brand" /> : <Icon name="grid-outline" size={20} tone="brand" />);

  function renderAction(action: TopBarAction) {
    const badgeAnchorStyle = direction === 'rtl' ? { left: -spacing[1] } : { right: -spacing[1] };
    const iconStyle = action.mirrorInRtl && direction === 'rtl' ? { transform: [{ scaleX: -1 }] } : undefined;
    const actionBoxSize = action.size === 'sm' ? 36 : action.size === 'lg' ? 42 : 40;
    const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;

    return (
      <Pressable
        key={action.id}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel}
        disabled={action.disabled}
        hitSlop={8}
        onPress={action.onPress}
        style={({ pressed }) => [{ padding: 0, opacity: action.disabled ? 0.56 : pressed ? 0.92 : 1 }]}
      >
        <View
          style={{
            position: 'relative',
            width: actionBoxSize,
            height: actionBoxSize,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: actionBoxSize / 2,
            backgroundColor: action.id === 'back' ? theme.brandSurface : theme.surface,
            borderWidth: 1,
            borderColor: action.id === 'back' ? theme.brand : theme.line,
            shadowColor: '#020617',
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          {showBadge ? (
            <View style={[{ position: 'absolute', top: -spacing[1], zIndex: 1 }, badgeAnchorStyle]}>
              <Badge label={String(action.badgeCount)} tone="danger" />
            </View>
          ) : null}
          <View style={[{ alignItems: 'center', justifyContent: 'center' }, iconStyle]}>{action.icon}</View>
        </View>
      </Pressable>
    );
  }

  const backAction = onBack
    ? {
        id: 'back',
        icon: <Icon name={backIcon} mirrored size={18} tone="inverse" />,
        accessibilityLabel: backLabel,
        onPress: onBack,
        size: 'lg' as const,
      }
    : null;

  return (
    <Surface
      tone="raised"
      border
      padding={3}
      gap={2}
      style={[
        {
          borderRadius: radius.xl,
          shadowColor: '#020617',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: spacing[3], minHeight: 56 }}>
        <View style={{ flex: 1, flexDirection: rowDirection, alignItems: 'center', gap: spacing[3], minWidth: 0 }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.lineStrong,
              flexShrink: 0,
            }}
          >
            {resolvedIcon}
          </View>

          <View style={{ flex: 1, minWidth: 0, gap: spacing[0], alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="titleMd" align={textAlign} numberOfLines={1}>
              {title}
            </Text>
            {description ? (
              <Text role="bodySm" tone="muted" align={textAlign} numberOfLines={2}>
                {description}
              </Text>
            ) : null}
          </View>
        </View>

        {actions.length || backAction ? (
          <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: spacing[2], flexShrink: 0 }}>
            {actions.map(renderAction)}
            {backAction ? renderAction(backAction) : null}
          </View>
        ) : null}
      </View>
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
  trailingAction?: {
    accessibilityLabel: string;
    icon: React.ReactNode;
    onPress?: () => void;
  };
};

function useReduceMotionEnabled() {
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) {
          setReduceMotionEnabled(enabled);
        }
      })
      .catch(() => {
        if (active) {
          setReduceMotionEnabled(false);
        }
      });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotionEnabled);

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduceMotionEnabled;
}

export function NewsTickerBar({ statusLabel, message, onPress, variant = 'default', marquee = false, marqueeDurationMs = 18000, trailingAction }: NewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand' || variant === 'main';
  const reducedMotionEnabled = useReduceMotionEnabled();
  const badgeTone = isBrand ? 'default' : 'info';
  const messageTone = isBrand ? 'inverse' : 'default';
  const messageLines = isBrand ? 1 : 2;
  const verticalPadding = isBrand ? spacing[0] : spacing[2];
  const horizontalPadding = isBrand ? spacing[1] : spacing[4];
  const actionButtonSize = isBrand ? 56 : 38;
  const trailingActionInset = -spacing[3];
  const tickerPaddingEnd = trailingAction
    ? horizontalPadding + Math.max(spacing[2], actionButtonSize - Math.abs(trailingActionInset))
    : horizontalPadding;
  const badgeStyle = isBrand
    ? {
        backgroundColor: theme.brandHeaderSurfaceStrong,
        borderColor: theme.brandHeaderSurfaceStrong,
        paddingHorizontal: spacing[1],
        paddingVertical: spacing[0],
      }
    : undefined;
  const marqueeTranslateX = React.useRef(new Animated.Value(0)).current;
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [copyWidth, setCopyWidth] = React.useState(0);
  const marqueeGap = isBrand ? spacing[2] : spacing[4];
  const estimatedCopyWidth = React.useMemo(
    () => Math.max(viewportWidth + spacing[6], Math.round(message.trim().length * (isBrand ? 10.5 : 9))),
    [isBrand, message, viewportWidth],
  );
  const effectiveCopyWidth = copyWidth > 0 ? copyWidth : estimatedCopyWidth;
  const marqueeDistance = effectiveCopyWidth > 0 ? effectiveCopyWidth + marqueeGap : 0;
  const shouldMarquee = marquee && !reducedMotionEnabled && viewportWidth > 0 && marqueeDistance > 0 && (effectiveCopyWidth > viewportWidth || message.length > 18);
  const marqueeCopyCount = shouldMarquee ? Math.max(2, Math.ceil((viewportWidth + marqueeDistance) / marqueeDistance)) : 1;
  const marqueeStartOffset = direction === 'rtl' ? -marqueeDistance : 0;
  const marqueeEndOffset = direction === 'rtl' ? 0 : -marqueeDistance;

  React.useEffect(() => {
    marqueeTranslateX.stopAnimation();
    marqueeTranslateX.setValue(0);
    setViewportWidth(0);
    setCopyWidth(0);
  }, [direction, marquee, marqueeTranslateX, message]);

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
        useNativeDriver: false,
        isInteraction: false,
      }),
      { resetBeforeIteration: true },
    );

    loop.start();

    return () => {
      loop.stop();
      marqueeTranslateX.stopAnimation();
      marqueeTranslateX.setValue(marqueeStartOffset);
    };
  }, [marqueeDurationMs, marqueeEndOffset, marqueeStartOffset, marqueeTranslateX, shouldMarquee]);

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
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={onPress ? `${statusLabel} · ${message}` : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: verticalPadding,
          paddingStart: horizontalPadding,
          paddingEnd: tickerPaddingEnd,
          borderRadius: isBrand ? radius.lg : radius.pill,
          backgroundColor: isBrand ? theme.brandHeaderSurfaceStrong : theme.surfaceInset,
          borderWidth: isBrand ? 1 : 0,
          borderColor: isBrand ? theme.brandHeaderStroke : theme.line,
          opacity: pressed ? 0.9 : 1,
          overflow: 'visible',
        },
      ]}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[0], alignItems: 'center' }}>
        <Badge label={statusLabel} tone={badgeTone} style={badgeStyle} />
        <View style={{ flex: 1, minWidth: 0, overflow: 'hidden', justifyContent: 'center' }} onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}>
          {measurementNode}
          {shouldMarquee ? (
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ translateX: marqueeTranslateX }] }}>
              {Array.from({ length: marqueeCopyCount }).map((_, index) => (
                <View key={`${statusLabel}-${index}`} style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
                  <Text role="bodySm" tone={messageTone} numberOfLines={1} style={{ flexShrink: 0 }}>
                    {message}
                  </Text>
                  {index < marqueeCopyCount - 1 ? <View style={{ width: marqueeGap }} /> : null}
                </View>
              ))}
            </Animated.View>
          ) : (
            <Text role="bodySm" tone={messageTone} numberOfLines={messageLines} style={{ flex: 1, minWidth: 0 }}>
              {message}
            </Text>
          )}
        </View>
      </View>
      {trailingAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={trailingAction.accessibilityLabel}
          onPress={trailingAction.onPress}
          hitSlop={10}
          style={({ pressed }) => [
            {
              position: 'absolute',
              top: '50%',
              width: actionButtonSize,
              height: actionButtonSize,
              marginTop: -actionButtonSize / 2,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.92 : 1,
              zIndex: 3,
              ...(direction === 'rtl' ? { left: trailingActionInset } : { right: trailingActionInset }),
            },
          ]}
        >
          {trailingAction.icon}
        </Pressable>
      ) : null}
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
  titleSlot?: React.ReactNode;
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
  actionsOffsetY?: number;
  style?: StyleProp<ViewStyle>;
};

export function TopBar({ title, subtitle, titleSlot, locationLabel, locationIcon, onTitlePress, titleAccessibilityLabel, actions = [], trailingAction, ticker, tabs, variant = 'default', layoutMode = 'default', contentOffsetY = 0, actionsOffsetY = 0, style }: TopBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isMain = isMainHeaderVariant(variant);
  const useBalancedSecondary = !isMain && layoutMode === 'balanced-secondary';
  const useRelaxedMain = isMain && layoutMode === 'relaxed-main';
  const resolvedContentOffsetY = contentOffsetY || (isMain ? (useRelaxedMain ? spacing[1] : spacing[0]) : spacing[1]);
  const titleTone = isMain ? 'inverse' : 'default';
  const titleAlign = direction === 'rtl' ? 'end' : 'start';

  function resolveActionBoxSize(action: TopBarAction, isBackAction = action.id === 'back') {
    const actionSize = action.size ?? (isBackAction && !isMain ? 'lg' : 'md');
    if (actionSize === 'lg') {
      return isMain ? 36 : 42;
    }
    if (actionSize === 'sm') {
      return isMain ? 32 : 36;
    }
    return isMain ? 34 : 40;
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

  const surfaceStyle: ViewStyle = isMain
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

  const contentRowStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: isMain ? resolveRowDirection(direction) : 'row',
      justifyContent: 'space-between',
      alignItems: isMain ? 'flex-start' : 'center',
      gap: isMain ? spacing[0] : spacing[2],
      minHeight: isMain ? (useRelaxedMain ? 70 : 66) : 58,
    },
    resolvedContentOffsetY ? { transform: [{ translateY: resolvedContentOffsetY }] } : null,
  ];

  const mainTitleInline = useRelaxedMain ? (
    <View style={{ gap: spacing[0], flexShrink: 1, minWidth: 0, maxWidth: '100%', alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start', justifyContent: 'center' }}>
      <Text role="titleLg" tone={titleTone} numberOfLines={1} align={titleAlign} style={{ flexShrink: 1, width: '100%' }}>
        {title}
      </Text>
      {subtitle ? (
        <Text role="bodySm" tone={titleTone} numberOfLines={1} align={titleAlign} style={{ opacity: 0.94, flexShrink: 1, width: '100%' }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  ) : (
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
    <View style={{ width: '100%', minWidth: 0, gap: spacing[0], alignItems: 'center', justifyContent: 'center' }}>
      <Text role="titleSm" tone={titleTone} numberOfLines={1} align="center" style={{ flexShrink: 1, minWidth: 0, width: '100%' }}>
        {title}
      </Text>
      {subtitle ? (
        <Text role="bodySm" tone="muted" numberOfLines={1} align="center" style={{ flexShrink: 1, minWidth: 0, width: '100%' }}>
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
    const titleInset = spacing[2];
    const resolvedSecondaryTitle = titleSlot ?? centeredSecondaryTitle;
    return (
      <Surface tone="raised" border padding={3} gap={2} style={[surfaceStyle, style]}>
        <StatusBar animated barStyle="dark-content" backgroundColor={theme.surface} />
        {ticker ? <NewsTickerBar {...ticker} variant={variant} /> : null}
        <View style={contentRowStyle}>
          <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center', flexShrink: 0, width: balancedSideWidth, justifyContent: 'flex-start' }}>
            {actions.map(renderAction)}
          </View>
          <View style={{ flex: 1, minWidth: 0, paddingHorizontal: titleInset, alignItems: 'center', justifyContent: 'center' }}>
            {onTitlePress ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={titleAccessibilityLabel ?? title}
                disabled={!onTitlePress}
                hitSlop={8}
                onPress={onTitlePress}
                style={({ pressed }) => [{ opacity: pressed ? 0.98 : 1, alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0 }]}
              >
                {resolvedSecondaryTitle}
              </Pressable>
            ) : (
              resolvedSecondaryTitle
            )}
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
        <View style={{ flex: 1, gap: useRelaxedMain ? spacing[1] : spacing[0], alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
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
            <View style={[{ flexDirection: resolveRowDirection(direction), gap: spacing[1], alignItems: 'center' }, isMain ? { alignSelf: direction === 'rtl' ? 'flex-end' : 'flex-start', paddingHorizontal: spacing[2], paddingVertical: spacing[0], borderRadius: radius.pill, backgroundColor: theme.brandHeaderSurfaceStrong, borderWidth: 1, borderColor: theme.brandHeaderStroke } : null]}>
              {locationIcon}
              <Text role="bodySm" tone="inverse" numberOfLines={1} align={titleAlign} style={isMain ? { opacity: 0.96 } : undefined}>{locationLabel}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          <View style={[{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }, isMain && actionsOffsetY ? { transform: [{ translateY: actionsOffsetY }] } : null]}>
            {actions.map(renderAction)}
          </View>
          {trailingAction ? renderAction(trailingAction) : null}
        </View>
      </View>
      {isMain && ticker ? (
        <View style={{ marginTop: -spacing[1], overflow: 'visible' }}>
          <NewsTickerBar {...ticker} variant={variant} />
        </View>
      ) : null}
      {tabs ? <Tabs {...tabs} /> : null}
    </Surface>
  );
}
