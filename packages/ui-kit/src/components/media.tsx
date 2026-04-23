import React from 'react';
import { Image, View, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';
import { radius, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { BthText } from '../primitives';

export type BthAvatarProps = {
  source?: ImageSourcePropType | string | null;
  label?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function BthAvatar({ source, label, size = 40, style }: BthAvatarProps) {
  const { theme } = useTheme();
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  return resolvedSource ? (
    <Image source={resolvedSource} style={[{ width: size, height: size, borderRadius: size / 2 }, style]} />
  ) : (
    <View style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.brandSurface }, style]}>
      <BthText role="label" tone="brand">{label ?? '•'}</BthText>
    </View>
  );
}

export type BthBannerProps = {
  source?: ImageSourcePropType | string | null;
  title?: string;
  subtitle?: string;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function BthBanner({ source, title, subtitle, height = 180, style }: BthBannerProps) {
  const { theme } = useTheme();
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  return (
    <View style={[{ minHeight: height, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: theme.surfaceInset, alignItems: 'center', justifyContent: 'center', gap: spacing[2] }, style]}>
      {resolvedSource ? <Image source={resolvedSource} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} /> : null}
      {title ? <BthText role="titleSm">{title}</BthText> : null}
      {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
    </View>
  );
}

export type BthImageProps = {
  source?: ImageSourcePropType | string | null;
  alt?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function BthImage({ source, alt, width = 160, height = 160, style }: BthImageProps) {
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  if (!resolvedSource) {
    return <View style={[{ width, height, borderRadius: radius.md, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' }, style]}><BthText role="caption" tone="soft">{alt ?? 'No image'}</BthText></View>;
  }

  return <Image source={resolvedSource} accessibilityLabel={alt} style={[{ width, height, borderRadius: radius.md }, style]} />;
}

export type BthLogoProps = {
  label?: string;
  source?: ImageSourcePropType | string | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function BthLogo({ label = 'Bthwani', source, size = 56, style }: BthLogoProps) {
  const resolvedSource = typeof source === 'string' ? { uri: source } : source ?? undefined;

  return resolvedSource ? (
    <Image source={resolvedSource} style={[{ width: size, height: size, borderRadius: radius.lg }, style]} />
  ) : (
    <View style={[{ width: size * 2, height: size, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(249, 115, 22, 0.12)' }, style]}>
      <BthText role="titleSm" tone="brand">{label}</BthText>
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
    return <BthText role="label">{mirrored ? '↔' : '•'}</BthText>;
  }

  return <>{icon}</>;
}