import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type StyleProp, type TextStyle } from 'react-native';
import { useDirection, useTheme } from '../providers';

export type IconTone = 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type IconProps = {
  name: IconName;
  size?: number;
  tone?: IconTone;
  color?: string;
  mirrored?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 20, tone = 'default', color, mirrored = false, style }: IconProps) {
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
