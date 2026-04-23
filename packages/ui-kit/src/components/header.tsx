import React from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '../foundation';
import { useTheme } from '../providers';
import { BthBadge, BthButton } from './button';
import { BthSurface, BthText } from '../primitives';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
};

export function BthNewsTickerBar({ statusLabel, message, onPress }: BthNewsTickerBarProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ paddingVertical: spacing[2], paddingHorizontal: spacing[4], backgroundColor: 'rgba(15, 23, 42, 0.04)', opacity: pressed ? 0.9 : 1 }]}>
      <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
        <BthBadge label={statusLabel} tone="info" />
        <BthText role="bodySm">{message}</BthText>
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
  accessibilityLabel?: string;
};

export type BthTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: BthTopBarAction[];
  trailingAction?: BthTopBarAction;
  ticker?: BthNewsTickerBarProps;
  tabs?: BthTabsProps<string>;
  style?: StyleProp<ViewStyle>;
};

export function BthTopBar({ title, subtitle, actions = [], trailingAction, ticker, tabs, style }: BthTopBarProps) {
  return (
    <BthSurface tone="raised" padding={4} gap={3} style={style}>
      {ticker ? <BthNewsTickerBar {...ticker} /> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {actions.map((action) => (
            <Pressable key={action.id} accessibilityLabel={action.accessibilityLabel} onPress={action.onPress} style={{ padding: spacing[2] }}>
              {action.icon}
              {action.badgeCount ? <BthBadge label={String(action.badgeCount)} tone="danger" /> : null}
            </Pressable>
          ))}
          {trailingAction ? (
            <Pressable accessibilityLabel={trailingAction.accessibilityLabel} onPress={trailingAction.onPress} style={{ padding: spacing[2] }}>
              {trailingAction.icon}
              {trailingAction.badgeCount ? <BthBadge label={String(trailingAction.badgeCount)} tone="danger" /> : null}
            </Pressable>
          ) : null}
        </View>
      </View>
      {tabs ? <BthTabs {...tabs} /> : null}
    </BthSurface>
  );
}