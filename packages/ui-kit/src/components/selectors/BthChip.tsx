import React from 'react';
import { Pressable, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { opacities, radius, spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useTheme } from '../../hooks';

export type BthChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function BthChip({ label, selected = false, onPress }: BthChipProps) {
  const { theme } = useTheme();

  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [{
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: selected ? theme.brand : theme.line,
    backgroundColor: selected ? theme.brandSurface : theme.surface,
    opacity: pressed ? opacities.pressed : 1
  }];

  return (
    <Pressable
      onPress={onPress}
      style={resolveStyle}
    >
      <BthText role="label" style={{ color: selected ? theme.brand : theme.text }}>{label}</BthText>
    </Pressable>
  );
}
