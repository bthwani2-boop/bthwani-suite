import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { type StyleProp, type TextStyle } from 'react-native';
import { useDirection, useTheme } from '../providers';

export type BthIconTone = 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type BthIconName = React.ComponentProps<typeof Ionicons>['name'];

export type BthIconProps = {
  name: BthIconName;
  size?: number;
  tone?: BthIconTone;
  color?: string;
  mirrored?: boolean;
  style?: StyleProp<TextStyle>;
};

export function BthIcon({ name, size = 20, tone = 'default', color, mirrored = false, style }: BthIconProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const toneColor = {
    default: theme.text,
    muted: theme.textMuted,
    soft: theme.textSoft,
    inverse: theme.brandContrast,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info,
  }[tone];
  const resolvedColor = color ?? toneColor;
  const shouldMirror = mirrored && direction === 'rtl';

  return <Ionicons name={name} size={size} color={resolvedColor} style={[shouldMirror ? { transform: [{ scaleX: -1 }] } : undefined, style]} />;
}