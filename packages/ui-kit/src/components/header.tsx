import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { bthColors, bthRadius, bthSpacing } from '../foundation';
import { BthButton } from './button';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export function BthNewsTickerBar({ statusLabel, message, onPress }: BthNewsTickerBarProps) {
  return (
    <Pressable onPress={onPress} style={styles.ticker}>
      <Text style={styles.tickerStatus}>{statusLabel}</Text>
      <Text style={styles.tickerMessage}>{message}</Text>
    </Pressable>
  );
}

export type BthScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: (event: GestureResponderEvent) => void;
};

export function BthScreenHeader({ title, subtitle, actionLabel, onActionPress }: BthScreenHeaderProps) {
  return (
    <View style={styles.screenHeader}>
      <View style={styles.headerTextBlock}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel ? <BthButton size="sm" onPress={onActionPress}>{actionLabel}</BthButton> : null}
    </View>
  );
}

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number;
};

export function BthSectionHeader({ title, subtitle, trailing, count }: BthSectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.headerTextBlock}>
        <Text style={styles.sectionTitle}>{title}{typeof count === 'number' ? ' (' + String(count) + ')' : ''}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

export type BthTabItem<Value extends string = string> = {
  value: Value;
  label: string;
};

export type BthTabsProps<Value extends string = string> = {
  items: ReadonlyArray<BthTabItem<Value>>;
  value: Value;
  onValueChange: (value: Value) => void;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function BthTabs<Value extends string = string>({
  items,
  value,
  onValueChange,
  scrollable = false,
  style,
  testID,
}: BthTabsProps<Value>) {
  const content = (
    <View style={[styles.tabs, style]} testID={testID}>
      {items.map((item) => {
        const active = item.value === value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onValueChange(item.value)}
            style={[styles.tab, active ? styles.tabActive : undefined]}
          >
            <Text style={[styles.tabText, active ? styles.tabTextActive : undefined]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (!scrollable) return content;

  return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{content}</ScrollView>;
}

export type BthTopBarAction = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export type BthTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: ReadonlyArray<BthTopBarAction>;
  ticker?: BthNewsTickerBarProps;
  tabs?: BthTabsProps<string>;
  style?: StyleProp<ViewStyle>;
};

export function BthTopBar({ title, subtitle, actions = [], ticker, tabs, style }: BthTopBarProps) {
  return (
    <View style={[styles.topBar, style]}>
      {ticker ? <BthNewsTickerBar {...ticker} /> : null}
      <View style={styles.topBarMain}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.screenTitle}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.actions}>
          {actions.map((action) => (
            <BthButton key={action.label} size="sm" tone="muted" onPress={action.onPress}>{action.label}</BthButton>
          ))}
        </View>
      </View>
      {tabs ? <BthTabs {...tabs} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ticker: {
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderRadius: bthRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: bthSpacing.sm,
    paddingHorizontal: bthSpacing.md,
    paddingVertical: bthSpacing.sm,
  },
  tickerStatus: {
    color: bthColors.brand.orange,
    fontSize: 12,
    fontWeight: '800',
  },
  tickerMessage: {
    color: bthColors.text.body,
    flex: 1,
    fontSize: 13,
  },
  topBar: {
    gap: bthSpacing.md,
  },
  topBarMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: bthSpacing.md,
    justifyContent: 'space-between',
  },
  screenHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: bthSpacing.md,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: bthSpacing.md,
    justifyContent: 'space-between',
  },
  headerTextBlock: {
    flex: 1,
  },
  screenTitle: {
    color: bthColors.text.strong,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionTitle: {
    color: bthColors.text.strong,
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: bthColors.text.muted,
    fontSize: 14,
    marginTop: bthSpacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: bthSpacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    gap: bthSpacing.sm,
  },
  tab: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    paddingHorizontal: bthSpacing.md,
    paddingVertical: bthSpacing.sm,
  },
  tabActive: {
    borderBottomColor: bthColors.brand.orange,
  },
  tabText: {
    color: bthColors.text.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: bthColors.brand.orange,
  },
});

