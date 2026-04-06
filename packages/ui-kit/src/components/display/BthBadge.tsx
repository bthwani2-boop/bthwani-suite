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
  const backgroundColor = {
    default: theme.backgroundAlt,
    brand: theme.brand,
    success: theme.successSurface,
    warning: theme.warningSurface,
    danger: theme.dangerSurface,
    info: theme.infoSurface
  }[tone];

  const textTone = tone === 'brand' ? 'default' : tone;
  const textColor = tone === 'brand' ? theme.brandContrast : undefined;

  return (
    <View style={[{ alignSelf: 'flex-start', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: radius.pill, backgroundColor }, style]}>
      <BthText role="label" tone={textTone as never} style={textColor ? { color: textColor } : undefined}>{label}</BthText>
    </View>
  );
}
