import React from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { BthBadge, BthButton } from './button';
import { BthSurface, BthText } from '../primitives';

export type BthTopBarVariant = 'default' | 'brand';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
  variant?: BthTopBarVariant;
};

export function BthNewsTickerBar({ statusLabel, message, onPress, variant = 'default' }: BthNewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ paddingVertical: spacing[2], paddingHorizontal: spacing[4], borderRadius: radius.pill, backgroundColor: isBrand ? 'rgba(255, 255, 255, 0.14)' : theme.surfaceInset, borderWidth: isBrand ? 1 : 0, borderColor: isBrand ? 'rgba(255, 255, 255, 0.14)' : theme.line, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[2], alignItems: 'center' }}>
        <BthBadge label={statusLabel} tone="info" />
        <BthText role="bodySm" tone={isBrand ? 'inverse' : 'default'} numberOfLines={2} style={{ flex: 1 }}>{message}</BthText>
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
  style?: StyleProp<ViewStyle>;
};

export function BthTopBar({ title, subtitle, locationLabel, locationIcon, actions = [], trailingAction, ticker, tabs, variant = 'default', style }: BthTopBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isBrand = variant === 'brand';

  function renderAction(action: BthTopBarAction) {
    const badgeAnchorStyle = direction === 'rtl' ? { left: -spacing[1] } : { right: -spacing[1] };
    const iconStyle = action.mirrorInRtl && direction === 'rtl' ? { transform: [{ scaleX: -1 }] } : undefined;
    const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;

    return (
      <Pressable key={action.id} accessibilityRole="button" accessibilityLabel={action.accessibilityLabel} disabled={action.disabled} onPress={action.onPress} style={({ pressed }) => [{ padding: spacing[2], opacity: action.disabled ? 0.56 : pressed ? 0.9 : 1 }]}>
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
    <BthSurface tone={isBrand ? 'brand' : 'raised'} border={!isBrand} padding={4} gap={3} style={[isBrand ? { backgroundColor: theme.brand } : undefined, style]}>
      {variant !== 'brand' && ticker ? <BthNewsTickerBar {...ticker} variant={variant} /> : null}
      <View style={{ flexDirection: resolveRowDirection(direction), justifyContent: 'space-between', alignItems: locationLabel && isBrand ? 'flex-start' : 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="titleSm" tone={isBrand ? 'inverse' : 'default'}>{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone={isBrand ? 'inverse' : 'muted'}>{subtitle}</BthText> : null}
          {locationLabel ? (
            <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[1], alignItems: 'center' }}>
              {locationIcon}
              <BthText role="bodySm" tone={isBrand ? 'inverse' : 'muted'} numberOfLines={1}>{locationLabel}</BthText>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[2], alignItems: 'center' }}>
          {actions.map(renderAction)}
          {trailingAction ? renderAction(trailingAction) : null}
        </View>
      </View>
      {variant === 'brand' && ticker ? <BthNewsTickerBar {...ticker} variant={variant} /> : null}
      {tabs ? <BthTabs {...tabs} /> : null}
    </BthSurface>
  );
}