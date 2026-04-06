import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useDirection, useTheme } from '../hooks';
import { fontWeights, resolveFontFamily, resolveTextRole, type FontFamilyToken, type FontWeightToken, type TextRole } from '../foundation/tokens';
import { resolveTextAlign } from '../foundation/direction';

export type BthTextProps = {
  children: React.ReactNode;
  role?: TextRole;
  tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  align?: 'start' | 'center' | 'end';
  family?: FontFamilyToken;
  weight?: FontWeightToken;
  allowFontScaling?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

export function BthText({
  children,
  role = 'bodyMd',
  tone = 'default',
  align = 'start',
  family,
  weight,
  allowFontScaling = true,
  numberOfLines,
  style
}: BthTextProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const roleStyle = resolveTextRole(role);
  const resolvedFamily = family ?? (role === 'code' ? 'mono' : role.startsWith('display') || role === 'hero' ? 'display' : 'latin');
  const toneColor = {
    default: theme.text,
    muted: theme.textMuted,
    soft: theme.textSoft,
    inverse: theme.textInverse,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info
  }[tone];

  return (
    <Text
      allowFontScaling={allowFontScaling}
      numberOfLines={numberOfLines}
      style={[
        {
          ...roleStyle,
          fontWeight: weight ? fontWeights[weight] : roleStyle.fontWeight,
          color: toneColor,
          textAlign: resolveTextAlign(direction, align),
          writingDirection: direction,
          fontFamily: resolveFontFamily(direction, resolvedFamily)
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}
