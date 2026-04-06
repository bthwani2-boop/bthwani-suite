import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useTheme } from '../../hooks';

export type BthBadgeProps = {
  label: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  style?: StyleProp<ViewStyle>;
};

export function BthBadge({ label, tone = 'default', style }: BthBadgeProps) {
  const { theme } = useTheme();
  const palette = {
    default: { backgroundColor: theme.surfaceInset, textColor: theme.textMuted, borderColor: theme.line },
    brand: { backgroundColor: theme.brandSurface, textColor: theme.brand, borderColor: theme.brandSurface },
    success: { backgroundColor: theme.successSurface, textColor: theme.successText, borderColor: theme.successSurface },
    warning: { backgroundColor: theme.warningSurface, textColor: theme.warningText, borderColor: theme.warningSurface },
    danger: { backgroundColor: theme.dangerSurface, textColor: theme.dangerText, borderColor: theme.dangerSurface },
    info: { backgroundColor: theme.infoSurface, textColor: theme.infoText, borderColor: theme.infoSurface }
  }[tone];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor
        },
        style
      ]}
    >
      <BthText role="label" style={{ color: palette.textColor }}>{label}</BthText>
    </View>
  );
}
