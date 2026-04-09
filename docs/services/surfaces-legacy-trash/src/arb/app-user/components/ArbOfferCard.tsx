// ARB UX Design System — ArbOfferCard
// بطاقة عرض واحدة (للقائمة العمودية أو الأفقية) — صورة، عنوان، موقع، سعر، تقييم، حالة
// ARB_UX_DESIGN_SYSTEM §4.2

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';

import { useI18n } from '@bthwani/ui-kit';
/** شارة اختيارية على البطاقة (مرجع Viator-style — ARB_UX_REFERENCE_VIATOR_STYLE) */
export type ArbOfferCardBadge = 'special_offer' | 'popular' | 'limited' | 'ending_soon';

export interface ArbOfferCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  status?: 'available' | 'closed' | string;
  onPress: () => void;
  variant?: 'vertical' | 'horizontal';
  cardWidth?: number;
  /** سعر قديم عند وجود خصم — يُعرض مشطوباً */
  originalPrice?: string;
  /** شارة فوق الصورة: عرض خاص، الأكثر طلباً، كمية محدودة، تنتهي قريباً */
  badge?: ArbOfferCardBadge;
}

function renderStars(rating: number = 0) {
  const stars = Math.round(Math.min(rating, 5));
  return '⭐'.repeat(stars);
}

export const ArbOfferCard: React.FC<ArbOfferCardProps> = ({
  title,
  location,
  price,
  imageUrl,
  rating,
  reviews,
  status,
  onPress,
  variant = 'vertical',
  cardWidth,
  originalPrice,
  badge,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const badgeLabels = useMemo<Record<ArbOfferCardBadge, string>>(
    () => ({
      special_offer: t('arb.app-client.components.ArbOfferCard.specialOffer'),
      popular: t('arb.app-client.components.ArbOfferCard.mostRequested'),
      limited: t('arb.app-client.components.ArbOfferCard.limitedQuantity'),
      ending_soon: t('arb.app-client.components.ArbOfferCard.endingSoon'),
    }),
    [t]
  );
  const [imageError, setImageError] = useState(false);
  const isHorizontal = variant === 'horizontal';

  const imageStyle = isHorizontal
    ? [styles.imageHorizontal, cardWidth ? { width: cardWidth - BTHWANI_SPACING.contentH * 2 } : undefined]
    : styles.imageVertical;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isHorizontal && styles.cardHorizontal,
        cardWidth && { width: cardWidth },
      ]}
      onPress={onPress}
      activeOpacity={0.78}
      hitSlop={{ top: 4, bottom: 4, [isRTL ? 'right' : 'left']: 4, [isRTL ? 'left' : 'right']: 4 }}
      accessibilityRole="button"
      accessibilityLabel={`${title}، ${location}، ${price}`}
    >
      <View style={[styles.imageWrap, isHorizontal && styles.imageWrapHorizontal]}>
        {imageError ? (
          <View style={[imageStyle, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>{t('common.no_image')}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={imageStyle}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
        {status === 'closed' ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{t('common.closed')}</Text>
          </View>
        ) : badge ? (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>{badgeLabels[badge]}</Text>
          </View>
        ) : null}
        {rating != null && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, textAlignStart]} numberOfLines={isHorizontal ? 2 : 2}>
          {title}
        </Text>
        <Text style={[styles.location, textAlignStart]} numberOfLines={1}>
          {location}
        </Text>
        {!isHorizontal && rating != null && reviews != null && (
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{renderStars(rating)}</Text>
            <Text style={styles.reviews}>{rating} ({reviews})</Text>
          </View>
        )}
        <View style={styles.priceRow}>
          {originalPrice ? (
            <>
              <Text style={styles.originalPrice}>{originalPrice}</Text>
              <Text style={[styles.price, textAlignStart]}>{price}</Text>
            </>
          ) : (
            <Text style={[styles.price, textAlignStart]}>{price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHorizontal: {
    width: 280,
  },
  imageWrap: {
    position: 'relative',
  },
  imageWrapHorizontal: {
    width: '100%',
  },
  imageVertical: {
    width: '100%',
    height: 160,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  imageHorizontal: {
    width: '100%',
    height: 140,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
  },
  statusBadge: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    start: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.error,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 11,
    fontWeight: '700',
  },
  promoBadge: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    start: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  promoBadgeText: {
    color: semanticRoles.onSurface,
    fontSize: 11,
    fontWeight: '600',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.sm,
    end: BTHWANI_SPACING.sm,
    backgroundColor: 'BTHWANI_COLORS.overlay',
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  ratingBadgeText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  location: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xs,
  },
  stars: {
    fontSize: 11,
    marginEnd: BTHWANI_SPACING.xs,
  },
  reviews: {
    fontSize: 11,
    color: semanticRoles.onSurfaceMuted,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  originalPrice: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    textDecorationLine: 'line-through',
    marginEnd: BTHWANI_SPACING.sm,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
});

export default ArbOfferCard;

