import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../providers';
import { Icon, type IconName } from './icons';
import { colorPalette, sizes, spacing, radius, withAlpha } from '../foundation';

export type IconButtonProps = PressableProps & {
  name: IconName;
  size?: number;
  tone?: 'default' | 'brand' | 'inverse' | 'surface';
};

export function IconButton({ name, size = sizes.iconMd, tone = 'default', style, ...rest }: IconButtonProps) {
  const { theme } = useTheme();
  const backgroundColor =
    tone === 'brand' ? theme.brand : tone === 'inverse' ? theme.brand : tone === 'surface' ? theme.surface : 'transparent';
  const iconColor = tone === 'inverse' ? theme.brandContrast ?? theme.brand : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          minWidth: sizes.controlSm,
          minHeight: sizes.controlSm,
          padding: spacing[2],
          borderRadius: radius.xl,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed && backgroundColor === 'transparent' ? withAlpha(colorPalette.black, 0.04) : backgroundColor,
        },
        style as StyleProp<ViewStyle>,
      ]}
      {...rest}
    >
      <Icon name={name} size={size} color={iconColor} />
    </Pressable>
  );
}

export default IconButton;
