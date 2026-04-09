import React from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, radius, spacing, sizes } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthRadioProps = {
  label: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthRadio({ label, description, selected, disabled = false, onSelect, style }: BthRadioProps) {
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
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onSelect}
      style={resolveStyle}
    >
      <View
        style={{
          width: sizes.iconLg,
          height: sizes.iconLg,
          marginTop: 1,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: selected ? theme.brand : theme.lineStrong,
          backgroundColor: disabled ? theme.disabledSurface : theme.surface,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {selected ? (
          <View
            style={{
              width: sizes.iconSm - 2,
              height: sizes.iconSm - 2,
              borderRadius: radius.pill,
              backgroundColor: theme.brand
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</BthText>
        {description ? <BthText role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</BthText> : null}
      </View>
    </Pressable>
  );
}