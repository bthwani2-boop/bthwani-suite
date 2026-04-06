import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';
import { useTheme } from '../../hooks';
import { radius, spacing, sizes } from '../../foundation/tokens';
import { BthText } from '../../primitives';

export type BthButtonProps = PressableProps & {
  label: string;
  tone?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
};

export function BthButton({
  label,
  tone = 'primary',
  loading = false,
  disabled,
  fullWidth = true,
  style,
  ...rest
}: BthButtonProps) {
  const { theme } = useTheme();

  const scheme = {
    primary: {
      backgroundColor: theme.brand,
      borderColor: theme.brand,
      labelTone: 'default' as const,
      labelColor: theme.brandContrast
    },
    secondary: {
      backgroundColor: theme.surface,
      borderColor: theme.line,
      labelTone: 'default' as const,
      labelColor: theme.text
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      labelTone: 'brand' as const,
      labelColor: theme.brand
    },
    danger: {
      backgroundColor: theme.danger,
      borderColor: theme.danger,
      labelTone: 'default' as const,
      labelColor: '#FFFFFF'
    }
  }[tone];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          minHeight: sizes.controlMd,
          width: fullWidth ? '100%' : undefined,
          paddingHorizontal: spacing[4],
          borderRadius: radius.pill,
          borderWidth: tone === 'ghost' ? 0 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing[2],
          backgroundColor: scheme.backgroundColor,
          borderColor: scheme.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1
        },
        style as never
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={scheme.labelColor} />
      ) : (
        <View>
          <BthText role="bodyStrong" style={{ color: scheme.labelColor }} align="center">
            {label}
          </BthText>
        </View>
      )}
    </Pressable>
  );
}
