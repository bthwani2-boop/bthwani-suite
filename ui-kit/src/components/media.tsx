import React from 'react';
import { Image as RNImage, View, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';
import { colorPalette, radius, spacing, withAlpha } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Text } from '../primitives';

export type AvatarProps = {
  source?: ImageSourcePropType | string | null;
  label?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function Avatar({ source, label, size = 40, style }: AvatarProps) {
  const { theme } = useTheme();
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  return resolvedSource ? (
    <RNImage source={resolvedSource} style={[{ width: size, height: size, borderRadius: size / 2 }, style]} />
  ) : (
    <View style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.brandSurface }, style]}>
      <Text role="label" tone="brand">{label ?? '•'}</Text>
    </View>
  );
}

export type BannerProps = {
  source?: ImageSourcePropType | string | null;
  title?: string;
  subtitle?: string;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function Banner({ source, title, subtitle, height = 180, style }: BannerProps) {
  const { theme } = useTheme();
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  return (
    <View style={[{ minHeight: height, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: theme.surfaceInset, alignItems: 'center', justifyContent: 'center', gap: spacing[2] }, style]}>
      {resolvedSource ? <RNImage source={resolvedSource} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} /> : null}
      {title ? <Text role="titleSm">{title}</Text> : null}
      {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
    </View>
  );
}

export type ImageProps = {
  source?: ImageSourcePropType | string | null;
  alt?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function Image({ source, alt, width = 160, height = 160, style }: ImageProps) {
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  if (!resolvedSource) {
    return <View style={[{ width, height, borderRadius: radius.md, backgroundColor: withAlpha(colorPalette.black, 0.06), alignItems: 'center', justifyContent: 'center' }, style]}><Text role="caption" tone="soft">{alt ?? 'No image'}</Text></View>;
  }

  return <RNImage source={resolvedSource} accessibilityLabel={alt} style={[{ width, height, borderRadius: radius.md }, style]} />;
}

export type LogoProps = {
  label?: string;
  source?: ImageSourcePropType | string | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ label = 'BThwani', source, size = 56, style }: LogoProps) {
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  return resolvedSource ? (
    <RNImage source={resolvedSource} style={[{ width: size, height: size, borderRadius: radius.lg }, style]} />
  ) : (
    <View style={[{ width: size * 2, height: size, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(249, 115, 22, 0.12)' }, style]}>
      <Text role="titleSm" tone="brand">{label}</Text>
    </View>
  );
}

export type DirectionalIconProps = {
  rtlIcon?: React.ReactNode;
  ltrIcon?: React.ReactNode;
  mirrored?: boolean;
};

export function DirectionalIcon({ rtlIcon, ltrIcon, mirrored = false }: DirectionalIconProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const icon = isRTL ? (rtlIcon ?? ltrIcon) : (ltrIcon ?? rtlIcon);

  if (!icon) {
    return <Text role="label">{mirrored ? '↔' : '•'}</Text>;
  }

  return <>{icon}</>;
}
