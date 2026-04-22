import React from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, radius, sizes, spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthBadge, type BthBadgeProps } from '../display';
import { BthButton } from '../actions/BthButton';
import { BthText } from '../../primitives';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
};

export function BthNewsTickerBar({ statusLabel, message, onPress }: BthNewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const tickerScrollRef = React.useRef<ScrollView>(null);
  const tickerContentWidthRef = React.useRef(0);
  const tickerOffsetRef = React.useRef(0);
  const tickerViewportWidthRef = React.useRef(0);
  const tickerGap = 80;
  const sanitizedMessage = message.trim();
  const barDirection = direction === 'rtl' ? 'row' : 'row-reverse';

  React.useEffect(() => {
    tickerOffsetRef.current = 0;
    tickerScrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [sanitizedMessage]);

  React.useEffect(() => {
    if (!sanitizedMessage) {
      return;
    }

    const interval = setInterval(() => {
      const totalWidth = tickerContentWidthRef.current;
      const viewportWidth = tickerViewportWidthRef.current;

      if (totalWidth <= 0 || viewportWidth <= 0 || totalWidth <= viewportWidth) {
        return;
      }

      const segmentWidth = (totalWidth - tickerGap) / 2;
      const resetAt = segmentWidth + tickerGap;

      if (tickerOffsetRef.current <= 0) {
        tickerOffsetRef.current = resetAt;
      }

      tickerOffsetRef.current -= 1;

      if (tickerOffsetRef.current <= 0) {
        tickerOffsetRef.current = resetAt;
      }

      tickerScrollRef.current?.scrollTo({ x: tickerOffsetRef.current, animated: false });
    }, 50);

    return () => clearInterval(interval);
  }, [sanitizedMessage]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${statusLabel}: ${sanitizedMessage}`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 30,
        borderRadius: 15,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.16)',
        paddingHorizontal: spacing[1],
        paddingVertical: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View
        style={{
          flexDirection: barDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[2],
        }}
      >
        <View
          style={{
            minWidth: 70,
            borderRadius: 12,
            backgroundColor: theme.info,
            paddingHorizontal: spacing[2],
            paddingVertical: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BthText role="caption" tone="inverse">{statusLabel}</BthText>
        </View>

        <ScrollView
          ref={tickerScrollRef}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{ flex: 1, minWidth: 0 }}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onLayout={(event) => {
            tickerViewportWidthRef.current = event.nativeEvent.layout.width;
          }}
          onContentSizeChange={(width) => {
            tickerContentWidthRef.current = width;
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 1,
            }}
          >
            <BthText role="bodySm" tone="inverse" numberOfLines={1} style={{ opacity: 0.95 }}>
              {sanitizedMessage}
            </BthText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingStart: tickerGap,
              paddingVertical: 1,
            }}
          >
            <BthText role="bodySm" tone="inverse" numberOfLines={1} style={{ opacity: 0.95 }}>
              {sanitizedMessage}
            </BthText>
          </View>
        </ScrollView>
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
    <View style={{ width: '100%', gap: spacing[3] }}>
      <View style={{ gap: spacing[1] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>
      {actionLabel && onActionPress ? <BthButton label={actionLabel} onPress={onActionPress} fullWidth={false} /> : null}
    </View>
  );
}

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number | string;
  countTone?: BthBadgeProps['tone'];
  headingOrder?: 'title-first' | 'count-first';
};

export function BthSectionHeader({
  title,
  subtitle,
  trailing,
  count,
  countTone = 'default',
  headingOrder = 'title-first'
}: BthSectionHeaderProps) {
  const { direction } = useDirection();
  const hasCount = count !== undefined && count !== null && String(count).trim().length > 0;

  return (
    <View style={{ width: '100%', flexDirection: resolveRowDirection(direction), justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', flexWrap: 'wrap', gap: spacing[2] }}>
          {headingOrder === 'count-first' && hasCount ? <BthBadge label={String(count)} tone={countTone} /> : null}
          <BthText role="titleSm">{title}</BthText>
          {headingOrder === 'title-first' && hasCount ? <BthBadge label={String(count)} tone={countTone} /> : null}
        </View>
        {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
      </View>
      {trailing}
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

export function BthTabs<Value extends string = string>({
  items,
  value,
  onValueChange,
  stretch = false,
  variant = 'line',
  scrollable = false,
  wrap = false,
  style,
  testID
}: BthTabsProps<Value>) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = resolveRowDirection(direction);

  const renderTabItems = () =>
    items.map((item) => {
      const selected = item.value === value;

      const resolveTabStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
        flex: wrap ? undefined : stretch ? 1 : undefined,
        flexBasis: wrap ? '31%' : undefined,
        maxWidth: wrap ? '31%' : undefined,
        minHeight: sizes.controlSm,
        borderRadius: variant === 'pill' ? radius.pill : radius.none,
        borderBottomWidth: variant === 'line' ? 3 : 0,
        borderBottomColor: variant === 'line' && selected ? theme.brand : 'transparent',
        backgroundColor: variant === 'pill' && selected ? theme.brandSurface : pressed ? theme.surfaceInset : 'transparent',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        alignItems: 'center',
        justifyContent: 'center',
        opacity: item.disabled ? opacities.disabled : pressed ? opacities.pressed : 1,
        gap: spacing[1]
      });

      return (
        <Pressable
          key={item.value}
          accessibilityRole="tab"
          accessibilityState={{ selected, disabled: item.disabled }}
          disabled={item.disabled}
          onPress={() => onValueChange?.(item.value)}
          style={resolveTabStyle}
        >
          <BthText role="bodyStrong" tone={selected ? 'brand' : item.disabled ? 'soft' : 'muted'} align="center">
            {item.label}
          </BthText>
          {item.badgeLabel ? <BthBadge label={item.badgeLabel} tone={selected ? 'brand' : 'default'} /> : null}
        </Pressable>
      );
    });

  if (scrollable && !wrap) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[
          {
            width: '100%',
            borderBottomWidth: variant === 'line' ? 1 : 0,
            borderBottomColor: variant === 'line' ? theme.line : 'transparent'
          },
          style
        ]}
        contentContainerStyle={{
          flexDirection: rowDirection,
          alignItems: 'stretch',
          gap: spacing[2],
          paddingBottom: variant === 'line' ? 1 : 0
        }}
        testID={testID}
      >
        {renderTabItems()}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: rowDirection,
          alignItems: 'stretch',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          gap: spacing[2],
          borderBottomWidth: variant === 'line' ? 1 : 0,
          borderBottomColor: variant === 'line' ? theme.line : 'transparent'
        },
        style
      ]}
      testID={testID}
    >
      {renderTabItems()}
    </View>
  );
}

export type BthTopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  mirrorInRtl?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type BthTopBarTicker = BthNewsTickerBarProps;

export type BthTopBarSurfaceProps = {
  variant?: 'surface';
  title: string;
  subtitle?: string;
  actions?: BthTopBarAction[];
  trailingAction?: BthTopBarAction;
  style?: StyleProp<ViewStyle>;
};

export type BthTopBarBrandProps = {
  variant: 'brand';
  title: string;
  subtitle?: string;
  locationLabel?: string;
  locationIcon?: React.ReactNode;
  actions?: BthTopBarAction[];
  leadingAction?: BthTopBarAction;
  trailingAction?: BthTopBarAction;
  mode?: 'standard' | 'centered';
  ticker?: BthTopBarTicker;
  style?: StyleProp<ViewStyle>;
};

export type BthTopBarProps = BthTopBarSurfaceProps | BthTopBarBrandProps;

type ActionTone = 'neutral' | 'accent' | 'ghost';

type ActionButtonProps = {
  action: BthTopBarAction;
  tone: ActionTone;
  badgeSide?: { left?: number; right?: number };
};

function ActionButton({ action, tone, badgeSide }: ActionButtonProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;
  const isGhost = tone === 'ghost';
  const isAccent = tone === 'accent';
  const shouldMirrorIcon = action.mirrorInRtl && direction === 'rtl';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel ?? action.id}
      onPress={action.onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: isGhost
            ? (pressed ? 'rgba(255,255,255,0.16)' : 'transparent')
            : isAccent
              ? theme.brandSurface
              : theme.surfaceRaised,
          borderColor: isGhost ? 'transparent' : isAccent ? theme.brand : theme.line,
          opacity: pressed ? 0.92 : 1,
          ...(!isGhost
            ? {
                shadowColor: isAccent ? '#f97316' : '#0f172a',
                shadowOpacity: isAccent ? 0.06 : 0.08,
                shadowRadius: isAccent ? 10 : 8,
                shadowOffset: { width: 0, height: isAccent ? 3 : 2 },
                elevation: 2,
              }
            : null),
        },
      ]}
    >
      <View style={shouldMirrorIcon ? { transform: [{ scaleX: -1 }] } : undefined}>
        {action.icon}
      </View>

      {showBadge ? (
        <View style={[styles.badge, badgeSide ?? styles.badgeRight, { backgroundColor: theme.warning }]}>
          <BthText role="caption" tone="inverse">
            {String(action.badgeCount)}
          </BthText>
        </View>
      ) : null}
    </Pressable>
  );
}

function SurfaceTopBar({ title, subtitle, actions = [], trailingAction, style }: BthTopBarSurfaceProps) {
  const { theme } = useTheme();
  const topInset = Platform.OS === 'android' ? Math.max(StatusBar.currentHeight ?? 0, 10) : 8;

  return (
    // Fixed header shell: render outside ScrollView content so the bar stays pinned and never scrolls with the page.
    <View style={[styles.surfaceShell, style]}>
      <View
        style={[
          styles.surfaceCard,
          {
            backgroundColor: theme.surfaceRaised,
            borderColor: theme.line,
            paddingTop: topInset + spacing[0],
            paddingBottom: spacing[0],
          },
        ]}
      >
        <View style={styles.surfaceRow}>
          <View style={styles.surfaceActionsRow}>
            {actions.map((action) => (
              <ActionButton key={action.id} action={action} tone="neutral" />
            ))}
          </View>

          <View style={styles.surfaceTitleBlock}>
            <BthText role="titleSm" tone="default" numberOfLines={2} align="center" style={styles.surfaceTitleText}>
              {title}
            </BthText>
            {subtitle ? (
              <BthText role="bodySm" tone="muted" numberOfLines={1} align="center" style={styles.surfaceSubtitleText}>
                {subtitle}
              </BthText>
            ) : null}
          </View>

          <View style={styles.surfaceTrailingSlot}>
            {trailingAction ? <ActionButton action={trailingAction} tone="accent" /> : <View style={styles.surfaceTrailingSpacer} />}
          </View>
        </View>
      </View>
    </View>
  );
}

function BrandTopBar({
  title,
  subtitle,
  locationLabel,
  locationIcon,
  actions = [],
  leadingAction,
  trailingAction,
  mode = 'standard',
  ticker,
  style,
}: BthTopBarBrandProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = resolveRowDirection(direction, true);
  const alignItems = direction === 'rtl' ? 'flex-end' : 'flex-start';
  const badgeSide = direction === 'rtl' ? { left: -2 } : { right: -2 };
  const topInset = Platform.OS === 'android' ? Math.max(StatusBar.currentHeight ?? 0, 12) : 6;

  return (
    <View
      style={[
        styles.brandShell,
        {
          backgroundColor: theme.brand,
          paddingTop: topInset,
          paddingBottom: spacing[1],
        },
        style,
      ]}
    >
      {mode === 'centered' ? (
        <View style={[styles.brandCenteredRow, { flexDirection: rowDirection }]}>
          <View style={styles.brandCenteredSlot}>
            {leadingAction ? <ActionButton action={leadingAction} tone="neutral" /> : null}
          </View>

          <View style={{ flex: 1, minWidth: 0, alignItems: 'center', marginStart: 6, marginEnd: 6 }}>
            <BthText role="titleMd" tone="inverse" numberOfLines={2} align="center">
              {title}
            </BthText>
            {subtitle ? (
              <BthText role="bodySm" tone="inverse" numberOfLines={1} align="center" style={{ opacity: 0.92 }}>
                {subtitle}
              </BthText>
            ) : null}

            {locationLabel ? (
              <View style={{ flexDirection: rowDirection, alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 1 }}>
                {locationIcon ?? <BthText role="caption" tone="inverse">•</BthText>}
                <BthText role="caption" tone="inverse" style={{ opacity: 0.9 }}>
                  {locationLabel}
                </BthText>
              </View>
            ) : null}
          </View>

          <View style={styles.brandCenteredSlot}>
            {trailingAction ? <ActionButton action={trailingAction} tone="accent" /> : null}
          </View>
        </View>
      ) : (
        <View style={[styles.brandRow, { flexDirection: rowDirection }]}>
          <View style={[styles.brandActionsRow, { flexDirection: rowDirection }]}>
            {actions.map((action) => (
              <ActionButton key={action.id} action={action} tone="ghost" badgeSide={badgeSide} />
            ))}
          </View>

          <View style={{ flex: 1, minWidth: 0, alignItems, marginStart: 6, marginEnd: 6 }}>
            <BthText role="titleMd" tone="inverse" numberOfLines={2} align="start">
              {title}
            </BthText>
            {subtitle ? (
              <BthText role="bodySm" tone="inverse" numberOfLines={1} align="start" style={{ opacity: 0.92 }}>
                {subtitle}
              </BthText>
            ) : null}

            {locationLabel ? (
              <View style={{ flexDirection: rowDirection, alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 1 }}>
                {locationIcon ?? <BthText role="caption" tone="inverse">•</BthText>}
                <BthText role="caption" tone="inverse" style={{ opacity: 0.9 }}>
                  {locationLabel}
                </BthText>
              </View>
            ) : null}
          </View>
        </View>
      )}

      {ticker ? <BthNewsTickerBar {...ticker} /> : null}
    </View>
  );
}

export function BthTopBar(props: BthTopBarProps) {
  if (props.variant === 'brand') {
    return <BrandTopBar {...props} />;
  }

  return <SurfaceTopBar {...props} />;
}

const styles = StyleSheet.create({
  surfaceShell: {
    width: '100%',
  },
  surfaceCard: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  surfaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
    minHeight: 56,
  },
  surfaceActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flexShrink: 0,
  },
  surfaceTitleBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  surfaceTitleText: {
    fontSize: 17,
    lineHeight: 22,
  },
  surfaceSubtitleText: {
    marginTop: 1,
    lineHeight: 16,
  },
  surfaceTrailingSlot: {
    flexShrink: 0,
  },
  surfaceTrailingSpacer: {
    width: 44,
    height: 44,
  },
  brandShell: {
    width: '100%',
    paddingHorizontal: spacing[4],
    gap: spacing[1],
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  brandRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[2],
  },
  brandCenteredRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[2],
  },
  brandCenteredSlot: {
    width: 44,
    alignItems: 'center',
  },
  brandActionsRow: {
    alignItems: 'center',
    gap: spacing[1],
    flexShrink: 0,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badge: {
    position: 'absolute',
    top: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRight: {
    right: -2,
  },
});

export default BthTopBar;
