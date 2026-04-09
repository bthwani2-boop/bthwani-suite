import React from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, radius, spacing, sizes } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthCheckboxProps = {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  error?: string;
  onCheckedChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function BthCheckbox({
  label,
  description,
  checked,
  disabled = false,
  error,
  onCheckedChange,
  style
}: BthCheckboxProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      flexDirection: resolveRowDirection(direction),
      alignItems: 'flex-start',
      gap: spacing[3],
      opacity: disabled ? opacities.disabled : pressed ? opacities.pressed : 1
    },
    style
  ];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={resolveStyle}
    >
      <View
        style={{
          width: sizes.iconLg,
          height: sizes.iconLg,
          marginTop: 1,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: error ? theme.danger : checked ? theme.brand : theme.lineStrong,
          backgroundColor: disabled ? theme.disabledSurface : checked ? theme.brand : theme.surface,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {checked ? <BthText role="label" tone="inverse">✓</BthText> : null}
      </View>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</BthText>
        {description ? <BthText role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</BthText> : null}
        {error ? <BthText role="caption" tone="danger">{error}</BthText> : null}
      </View>
    </Pressable>
  );
}