import React from 'react';
import { Pressable, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { opacities, radius, spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useTheme } from '../../hooks';

export type BthChipProps = {
  label: string;
  selected?: boolean;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  onPress?: () => void;
};

export function BthChip({ label, selected = false, tone = 'default', onPress }: BthChipProps) {
  const { theme } = useTheme();

  const toneScheme = {
    default: {
      accent: theme.lineStrong,
      surface: theme.surface,
      label: theme.text,
      selectedSurface: theme.surfaceInset,
      selectedLabel: theme.text
    },
    brand: {
      accent: theme.brand,
      surface: theme.surface,
      label: theme.brand,
      selectedSurface: theme.brandSurface,
      selectedLabel: theme.brand
    },
    success: {
      accent: theme.success,
      surface: theme.surface,
      label: theme.success,
      selectedSurface: theme.successSurface,
      selectedLabel: theme.success
    },
    warning: {
      accent: theme.warning,
      surface: theme.surface,
      label: theme.warning,
      selectedSurface: theme.warningSurface,
      selectedLabel: theme.warning
    },
    danger: {
      accent: theme.danger,
      surface: theme.surface,
      label: theme.danger,
      selectedSurface: theme.dangerSurface,
      selectedLabel: theme.danger
    },
    info: {
      accent: theme.info,
      surface: theme.surface,
      label: theme.info,
      selectedSurface: theme.infoSurface,
      selectedLabel: theme.info
    }
  }[tone];

  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [{
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: selected ? toneScheme.accent : theme.line,
    backgroundColor: selected ? toneScheme.selectedSurface : toneScheme.surface,
    opacity: pressed ? opacities.pressed : 1
  }];

  return (
    <Pressable
      onPress={onPress}
      style={resolveStyle}
    >
      <BthText role="label" style={{ color: selected ? toneScheme.selectedLabel : toneScheme.label }}>{label}</BthText>
    </Pressable>
  );
}
