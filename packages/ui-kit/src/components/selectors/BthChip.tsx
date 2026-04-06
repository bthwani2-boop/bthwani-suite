import React from 'react';
import { Pressable } from 'react-native';
import { radius, spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useTheme } from '../../hooks';

export type BthChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function BthChip({ label, selected = false, onPress }: BthChipProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? theme.brand : theme.line,
        backgroundColor: selected ? theme.brand : theme.surface
      }}
    >
      <BthText role="label" style={{ color: selected ? theme.brandContrast : theme.text }}>{label}</BthText>
    </Pressable>
  );
}
