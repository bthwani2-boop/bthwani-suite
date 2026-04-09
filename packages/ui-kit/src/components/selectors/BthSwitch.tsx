import React from 'react';
import { Switch, View, Pressable, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthSwitchProps = {
  label: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
  onValueChange?: (nextValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function BthSwitch({
  label,
  description,
  value,
  disabled = false,
  onValueChange,
  style
}: BthSwitchProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      flexDirection: resolveRowDirection(direction, true),
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
      opacity: disabled ? opacities.disabled : pressed ? opacities.pressed : 1
    },
    style
  ];

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={resolveStyle}
    >
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</BthText>
        {description ? <BthText role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</BthText> : null}
      </View>
      <Switch
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? theme.brandContrast : theme.surfaceRaised}
        trackColor={{ false: theme.lineStrong, true: theme.brand }}
        ios_backgroundColor={theme.lineStrong}
      />
    </Pressable>
  );
}