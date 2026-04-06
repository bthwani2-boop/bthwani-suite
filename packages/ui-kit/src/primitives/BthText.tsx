import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useDirection, useTheme } from '../hooks';
import { fontFamilies, textRoles, type TextRole } from '../foundation/tokens';
import { resolveTextAlign } from '../foundation/direction';

export type BthTextProps = {
  children: React.ReactNode;
  role?: TextRole;
  tone?: 'default' | 'muted' | 'soft' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  align?: 'start' | 'center' | 'end';
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

export function BthText({ children, role = 'bodyMd', tone = 'default', align = 'start', numberOfLines, style }: BthTextProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const toneColor = {
    default: theme.text,
    muted: theme.textMuted,
    soft: theme.textSoft,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info
  }[tone];

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          ...textRoles[role],
          color: toneColor,
          textAlign: resolveTextAlign(direction, align),
          writingDirection: direction,
          fontFamily: direction === 'rtl' ? fontFamilies.arabic : fontFamilies.latin
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}
