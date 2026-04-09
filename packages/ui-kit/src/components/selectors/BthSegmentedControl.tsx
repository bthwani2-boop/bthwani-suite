import React from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, radius, spacing, sizes } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthSegmentedOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export type BthSegmentedControlProps<Value extends string = string> = {
  options: readonly BthSegmentedOption<Value>[];
  value: Value;
  onValueChange?: (nextValue: Value) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BthSegmentedControl<Value extends string = string>({
  options,
  value,
  onValueChange,
  size = 'md',
  fullWidth = true,
  style
}: BthSegmentedControlProps<Value>) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const sizeConfig = {
    sm: { minHeight: sizes.controlSm, textRole: 'label' as const },
    md: { minHeight: sizes.controlMd, textRole: 'bodyStrong' as const }
  }[size];

  return (
    <View
      style={[
        {
          width: fullWidth ? '100%' : undefined,
          flexDirection: resolveRowDirection(direction),
          alignItems: 'stretch',
          gap: spacing[2],
          padding: spacing[2],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: theme.line,
          backgroundColor: theme.surfaceInset
        },
        style
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const disabled = option.disabled;

        const resolveOptionStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [{
          flex: fullWidth ? 1 : undefined,
          minHeight: sizeConfig.minHeight,
          paddingHorizontal: spacing[4],
          borderRadius: radius.pill,
          backgroundColor: selected ? theme.brand : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? opacities.disabled : pressed ? opacities.pressed : 1
        }];

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onValueChange?.(option.value)}
            style={resolveOptionStyle}
          >
            <BthText role={sizeConfig.textRole} tone={selected ? 'inverse' : disabled ? 'soft' : 'default'} align="center">
              {option.label}
            </BthText>
          </Pressable>
        );
      })}
    </View>
  );
}