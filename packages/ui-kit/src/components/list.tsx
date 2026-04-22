import React from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { bthColors, bthRadius, bthSpacing } from '../foundation';

export type BthListItemData = {
  key: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

export type BthListProps = {
  items: ReadonlyArray<BthListItemData>;
  onItemPress?: (item: BthListItemData, event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function BthList({ items, onItemPress, style }: BthListProps) {
  return (
    <View style={[styles.list, style]}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={(event) => onItemPress?.(item, event)} style={styles.item}>
          <View style={styles.itemText}>
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
          </View>
          {item.meta ? <Text style={styles.meta}>{item.meta}</Text> : null}
        </Pressable>
      ))}
    </View>
  );
}

export const BthListItem = BthList;

const styles = StyleSheet.create({
  list: {
    gap: bthSpacing.sm,
  },
  item: {
    alignItems: 'center',
    backgroundColor: bthColors.surface.card,
    borderColor: bthColors.line.soft,
    borderRadius: bthRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: bthSpacing.md,
    justifyContent: 'space-between',
    padding: bthSpacing.md,
  },
  itemText: {
    flex: 1,
  },
  title: {
    color: bthColors.text.strong,
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    color: bthColors.text.muted,
    fontSize: 13,
    marginTop: bthSpacing.xs,
  },
  meta: {
    color: bthColors.brand.orange,
    fontSize: 12,
    fontWeight: '800',
  },
});
