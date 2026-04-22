import React from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { bthColors, bthRadius, bthSpacing } from '../foundation';

export type BthImageProps = {
  source: ImageSourcePropType;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function BthImage({ source, height = 160, radius = bthRadius.xl, style }: BthImageProps) {
  return (
    <View style={[styles.imageFrame, { height, borderRadius: radius }, style]}>
      <Image source={source} style={styles.image} resizeMode="cover" />
    </View>
  );
}

export const BthBanner = BthImage;

export type BthAvatarProps = {
  label: string;
  source?: ImageSourcePropType;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function BthAvatar({ label, source, size = 40, style }: BthAvatarProps) {
  return (
    <View style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }, style]}>
      {source ? <Image source={source} style={styles.image} resizeMode="cover" /> : <Text style={styles.avatarText}>{label.slice(0, 2)}</Text>}
    </View>
  );
}

export type BthLogoProps = {
  label?: string;
};

export function BthLogo({ label = 'BThwani' }: BthLogoProps) {
  return (
    <View style={styles.logo}>
      <View style={styles.logoMark} />
      <Text style={styles.logoText}>{label}</Text>
    </View>
  );
}

export function DirectionalIcon({ label = '›' }: { label?: string }) {
  return <Text style={styles.icon}>{label}</Text>;
}

const styles = StyleSheet.create({
  imageFrame: {
    backgroundColor: bthColors.surface.raised,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: bthColors.surface.raised,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: bthColors.brand.orange,
    fontSize: 13,
    fontWeight: '800',
  },
  logo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: bthSpacing.sm,
  },
  logoMark: {
    backgroundColor: bthColors.brand.orange,
    borderRadius: bthRadius.pill,
    height: 24,
    width: 24,
  },
  logoText: {
    color: bthColors.brand.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  icon: {
    color: bthColors.text.muted,
    fontSize: 20,
    fontWeight: '800',
  },
});
