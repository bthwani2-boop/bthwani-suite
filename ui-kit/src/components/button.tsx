import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { borders, radius, resolveRowDirection, sizes, spacing } from '../foundation';
import { useBThwaniAppearance, useDirection } from '../providers';
import { Text } from '../primitives';

type PressableStyle = StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType) {
  return typeof style === 'function' ? style(state) : style;
}

export type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'brand' | 'warning' | 'info' | 'default' | 'glass' | 'glassStrong';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label?: string;
  children?: React.ReactNode;
  variant?: ButtonTone;
  onClick?: PressableProps['onPress'];
  tone?: ButtonTone;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leadingAccessory?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
};

export function Button({
  label,
  children,
  tone,
  variant,
  onClick,
  size = 'md',
  loading = false,
  disabled,
  fullWidth = true,
  leadingAccessory,
  trailingAccessory,
  icon,
  iconPosition = 'leading',
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const { direction } = useDirection();
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const resolvedDisabled = disabled || loading;
  const resolvedLeadingAccessory = leadingAccessory ?? (icon && iconPosition === 'leading' ? icon : null);
  const resolvedTrailingAccessory = trailingAccessory ?? (icon && iconPosition === 'trailing' ? icon : null);
  const toneConfig = {
    primary: appearanceTokens.components.buttons.primary,
    brand: appearanceTokens.components.buttons.brand,
    secondary: appearanceTokens.components.buttons.secondary,
    ghost: appearanceTokens.components.buttons.ghost,
    danger: appearanceTokens.components.buttons.danger,
    success: appearanceTokens.components.buttons.success,
    warning: appearanceTokens.components.buttons.warning,
    info: appearanceTokens.components.buttons.info,
    default: appearanceTokens.components.buttons.default,
    glass: appearanceTokens.components.buttons.glass,
    glassStrong: appearanceTokens.components.buttons.glassStrong,
  }[tone ?? variant ?? 'primary'];

  const sizeConfig = {
    sm: { minHeight: sizes.controlSm, paddingHorizontal: spacing[3], textRole: 'label' as const },
    md: { minHeight: sizes.controlMd, paddingHorizontal: spacing[4], textRole: 'bodyStrong' as const },
    lg: { minHeight: sizes.controlLg, paddingHorizontal: spacing[5], textRole: 'bodyStrong' as const },
  }[size];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={resolvedDisabled}
      onPress={onPress ?? onClick}
      style={({ pressed }) => {
        const palette = resolvedDisabled ? toneConfig.disabled : pressed ? toneConfig.pressed : toneConfig.default;

        return [
          {
            width: fullWidth ? '100%' : undefined,
            minHeight: sizeConfig.minHeight,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            borderRadius: size === 'lg' ? radius.xl : radius.lg,
            borderWidth: tone === 'ghost' ? 0 : borders.hairline,
            borderColor: palette.borderColor,
            backgroundColor: palette.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: resolveRowDirection(direction),
            gap: spacing[2],
          },
          palette.shadow,
          resolvePressableStyle(style, { pressed } as PressableStateCallbackType),
        ];
      }}
      {...rest}
    >
      {loading ? <ActivityIndicator color={(resolvedDisabled ? toneConfig.disabled : toneConfig.default).iconColor} /> : null}
      {resolvedLeadingAccessory}
      {label ? (
        <Text
          role={sizeConfig.textRole}
          style={{
            color: (resolvedDisabled ? toneConfig.disabled : toneConfig.default).textColor,
          }}
        >
          {label}
        </Text>
      ) : typeof children === 'string' || typeof children === 'number' ? (
        <Text
          role={sizeConfig.textRole}
          style={{
            color: (resolvedDisabled ? toneConfig.disabled : toneConfig.default).textColor,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {resolvedTrailingAccessory}
    </Pressable>
  );
}

export type BadgeProps = {
  label: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, tone = 'default', style }: BadgeProps) {
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const palette = {
    default: appearanceTokens.components.badges.neutral,
    brand: appearanceTokens.components.badges.brand,
    success: appearanceTokens.components.badges.success,
    warning: appearanceTokens.components.badges.warning,
    danger: appearanceTokens.components.badges.danger,
    info: appearanceTokens.components.badges.info,
  }[tone];

  return (
    <Pressable
      accessibilityRole="text"
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor,
        },
        style,
      ]}
      disabled
    >
      <Text role="label" style={{ color: palette.textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

export type ChipProps = {
  label: string;
  selected?: boolean;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'glass' | 'glassStrong';
  onPress?: () => void;
};

export function Chip({ label, selected = false, tone = 'default', onPress }: ChipProps) {
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const basePalette = {
    default: appearanceTokens.components.chips.default,
    brand: appearanceTokens.components.badges.brand,
    success: appearanceTokens.components.badges.success,
    warning: appearanceTokens.components.badges.warning,
    danger: appearanceTokens.components.badges.danger,
    info: appearanceTokens.components.badges.info,
    glass: appearanceTokens.components.chips.glass,
    glassStrong: appearanceTokens.components.chips.glassSelected,
  }[tone];
  const selectedPalette = tone === 'glass' || tone === 'glassStrong'
    ? appearanceTokens.components.chips.glassSelected
    : appearanceTokens.components.chips.selected;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => {
        const palette = selected ? selectedPalette : basePalette;
        const pressedPalette = selected
          ? selectedPalette
          : tone === 'glass' || tone === 'glassStrong'
            ? appearanceTokens.components.chips.glassSelected
            : appearanceTokens.components.chips.selected;

        return [
          {
            alignSelf: 'flex-start',
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: (pressed ? pressedPalette : palette).borderColor,
            backgroundColor: (pressed ? pressedPalette : palette).backgroundColor,
          },
        ];
      }}
    >
      <Text role="label" style={{ color: (selected ? selectedPalette : basePalette).textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}
