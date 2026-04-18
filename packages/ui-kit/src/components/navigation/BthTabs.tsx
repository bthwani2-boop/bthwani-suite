import React from 'react';
import { Pressable, ScrollView, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, radius, spacing, sizes } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';
import { BthBadge } from '../display';

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