import React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { borders, radius, resolveRowDirection, sizes, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Text } from '../primitives';

type PressableStyle = StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType) {
  return typeof style === 'function' ? style(state) : style;
}

export type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

export type ButtonProps = PressableProps & {
  label: string;
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
  tone = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth = true,
  leadingAccessory,
  trailingAccessory,
  icon,
  iconPosition = 'leading',
  style,
  ...rest
}: ButtonProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const resolvedDisabled = disabled || loading;
  const resolvedLeadingAccessory = leadingAccessory ?? (icon && iconPosition === 'leading' ? icon : null);
  const resolvedTrailingAccessory = trailingAccessory ?? (icon && iconPosition === 'trailing' ? icon : null);

  const toneConfig = {
    primary: { backgroundColor: theme.brand, borderColor: theme.brand, labelColor: theme.brandContrast },
    secondary: { backgroundColor: theme.surface, borderColor: theme.lineStrong, labelColor: theme.text },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent', labelColor: theme.brand },
    danger: { backgroundColor: theme.danger, borderColor: theme.danger, labelColor: '#FFFFFF' },
    success: { backgroundColor: theme.success, borderColor: theme.success, labelColor: '#FFFFFF' },
  }[tone];

  const sizeConfig = {
    sm: { minHeight: sizes.controlSm, paddingHorizontal: spacing[3], textRole: 'label' as const },
    md: { minHeight: sizes.controlMd, paddingHorizontal: spacing[4], textRole: 'bodyStrong' as const },
    lg: { minHeight: sizes.controlLg, paddingHorizontal: spacing[5], textRole: 'bodyStrong' as const },
  }[size];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={resolvedDisabled}
      style={({ pressed }) => [
        {
          width: fullWidth ? '100%' : undefined,
          minHeight: sizeConfig.minHeight,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: size === 'lg' ? radius.xl : radius.lg,
          borderWidth: tone === 'ghost' ? 0 : borders.hairline,
          borderColor: toneConfig.borderColor,
          backgroundColor: toneConfig.backgroundColor,
          opacity: resolvedDisabled ? 0.56 : pressed ? 0.9 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: resolveRowDirection(direction),
          gap: spacing[2],
        },
        resolvePressableStyle(style, { pressed } as PressableStateCallbackType),
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={toneConfig.labelColor} /> : null}
      {resolvedLeadingAccessory}
      <Text role={sizeConfig.textRole} style={{ color: toneConfig.labelColor }}>
        {label}
      </Text>
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
  const { theme } = useTheme();
  const palette = {
    default: { backgroundColor: theme.surfaceInset, textColor: theme.textMuted, borderColor: theme.line },
    brand: { backgroundColor: theme.brandSurface, textColor: theme.brand, borderColor: theme.brandSurface },
    success: { backgroundColor: theme.successSurface, textColor: theme.successText, borderColor: theme.successSurface },
    warning: { backgroundColor: theme.warningSurface, textColor: theme.warningText, borderColor: theme.warningSurface },
    danger: { backgroundColor: theme.dangerSurface, textColor: theme.dangerText, borderColor: theme.dangerSurface },
    info: { backgroundColor: theme.infoSurface, textColor: theme.infoText, borderColor: theme.infoSurface },
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
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  onPress?: () => void;
};

export function Chip({ label, selected = false, tone = 'default', onPress }: ChipProps) {
  const { theme } = useTheme();
  const toneScheme = {
    default: { accent: theme.lineStrong, surface: theme.surface, label: theme.text, selectedSurface: theme.surfaceInset, selectedLabel: theme.text },
    brand: { accent: theme.brand, surface: theme.surface, label: theme.brand, selectedSurface: theme.brand, selectedLabel: theme.brandContrast },
    success: { accent: theme.success, surface: theme.surface, label: theme.success, selectedSurface: theme.successSurface, selectedLabel: theme.success },
    warning: { accent: theme.warning, surface: theme.surface, label: theme.warning, selectedSurface: theme.warningSurface, selectedLabel: theme.warning },
    danger: { accent: theme.danger, surface: theme.surface, label: theme.danger, selectedSurface: theme.dangerSurface, selectedLabel: theme.danger },
    info: { accent: theme.info, surface: theme.surface, label: theme.info, selectedSurface: theme.infoSurface, selectedLabel: theme.info },
  }[tone];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: selected ? toneScheme.accent : theme.line,
          backgroundColor: selected ? toneScheme.selectedSurface : toneScheme.surface,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text role="label" style={{ color: selected ? toneScheme.selectedLabel : toneScheme.label }}>
        {label}
      </Text>
    </Pressable>
  );
}

