import React from 'react';
import { View, Image, Pressable, type StyleProp, type ViewStyle, type ImageStyle } from 'react-native';
import { spacing, radius, sizes } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthCard } from './BthCard';
import { BthText } from '../../primitives';
import { BthBadge } from './BthBadge';

export type ProductCardPrice = {
  value?: number;
  label?: string;
  currency?: string;
};

export type BthProductCardProps = {
  id?: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
  price?: ProductCardPrice;
  oldPrice?: ProductCardPrice;
  discountLabel?: string;
  badges?: string[];
  isFavorited?: boolean;
  onAdd?: (anchor?: { x: number; y: number }) => void;
  onFavorite?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthProductCard({
  title,
  subtitle,
  imageUri,
  price,
  oldPrice,
  discountLabel,
  badges = [],
  isFavorited,
  onAdd,
  onFavorite,
  onPress,
  style,
}: BthProductCardProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const imageSize = 120;

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
      <View style={{ flex: 1 }}>
        <View style={{ gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>

        <View style={{ marginTop: spacing[3], gap: spacing[1] }}>
          {price?.label ? (
            <BthText role="bodyStrong" style={{ color: theme.brand }}>
              {price.label}
            </BthText>
          ) : null}

          {oldPrice?.label ? (
            <BthText role="caption" tone="muted">
              {oldPrice.label}
            </BthText>
          ) : null}
        </View>

        <View style={{ marginTop: spacing[3], flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {badges.slice(0, 3).map((b) => (
            <BthBadge key={b} label={b} tone="default" />
          ))}
        </View>
      </View>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: imageSize, height: imageSize, borderRadius: radius.md }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ width: imageSize, height: imageSize, borderRadius: radius.md, backgroundColor: theme.surfaceInset }} />
      )}
    </View>
  );

  const footer = (
    <View style={{ position: 'relative', marginTop: spacing[3] }}>
      {discountLabel ? <BthBadge label={discountLabel} tone="warning" /> : null}
    </View>
  );

  return (
    <BthCard onPress={onPress} footer={footer} style={style}>
      <View>
        {content}
        <Pressable
          onPressIn={(e) => {
            const { pageX, pageY } = e.nativeEvent;
            onAdd?.({ x: pageX, y: pageY });
          }}
          style={{
            position: 'absolute',
            right: spacing[4],
            bottom: spacing[4],
            width: sizes.controlMd,
            height: sizes.controlMd,
            borderRadius: radius.pill,
            backgroundColor: theme.brand,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          accessibilityRole="button"
        >
          <BthText role="bodyStrong" style={{ color: theme.brandContrast }}>+</BthText>
        </Pressable>

        <Pressable
          onPressIn={() => {
            onFavorite?.();
          }}
          style={{
            position: 'absolute',
            left: spacing[4],
            top: spacing[4],
            width: sizes.iconLg,
            height: sizes.iconLg,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          accessibilityRole="button"
        >
          <BthText role="label" style={{ color: isFavorited ? theme.danger : theme.text }}>♡</BthText>
        </Pressable>
      </View>
    </BthCard>
  );
}
