import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
  View
} from 'react-native';
import { useDirection, useTheme } from '../../hooks';
import { opacities, radius, spacing, sizes } from '../../foundation/tokens';
import { resolveRowDirection } from '../../foundation/direction';
import { BthText } from '../../primitives';

export type BthButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

export type BthButtonProps = PressableProps & {
  label: string;
  tone?: BthButtonTone;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leadingAccessory?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
};

export function BthButton({
  label,
  tone = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth = true,
  leadingAccessory,
  trailingAccessory,
  style,
  ...rest
}: BthButtonProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const schemeByTone: Record<BthButtonTone, { backgroundColor: string; borderColor: string; labelColor: string }> = {
    primary: {
      backgroundColor: theme.brand,
      borderColor: theme.brand,
      labelColor: theme.brandContrast
    },
    secondary: {
      backgroundColor: theme.surface,
      borderColor: theme.lineStrong,
      labelColor: theme.text
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      labelColor: theme.brand
    },
    danger: {
      backgroundColor: theme.danger,
      borderColor: theme.danger,
      labelColor: '#FFFFFF'
    },
    success: {
      backgroundColor: theme.success,
      borderColor: theme.success,
      labelColor: '#FFFFFF'
    }
  };

  const sizeConfig = {
    sm: { minHeight: sizes.controlSm, paddingHorizontal: spacing[3], textRole: 'label' as const },
    md: { minHeight: sizes.controlMd, paddingHorizontal: spacing[4], textRole: 'bodyStrong' as const },
    lg: { minHeight: sizes.controlLg, paddingHorizontal: spacing[5], textRole: 'bodyStrong' as const }
  }[size];

  const scheme = schemeByTone[tone];
  const resolvedDisabled = disabled || loading;
  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      minHeight: sizeConfig.minHeight,
      width: fullWidth ? '100%' : undefined,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: radius.pill,
      borderWidth: tone === 'ghost' ? 0 : 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: resolveRowDirection(direction),
      gap: spacing[2],
      backgroundColor: resolvedDisabled ? theme.disabledSurface : scheme.backgroundColor,
      borderColor: resolvedDisabled ? theme.disabledSurface : scheme.borderColor,
      opacity: resolvedDisabled ? opacities.disabled : pressed ? opacities.pressed : 1
    },
    typeof style === 'function' ? style({ pressed }) : style
  ];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={resolvedDisabled}
      style={resolveStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={scheme.labelColor} />
      ) : (
        <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: spacing[2] }}>
          {leadingAccessory}
          <BthText role={sizeConfig.textRole} style={{ color: resolvedDisabled ? theme.disabledText : scheme.labelColor }} align="center">
            {label}
          </BthText>
          {trailingAccessory}
        </View>
      )}
    </Pressable>
  );
}
