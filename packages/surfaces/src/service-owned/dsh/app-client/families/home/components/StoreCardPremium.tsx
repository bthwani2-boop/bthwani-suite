import React, { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resolveTextAlign, useDirection, useTheme } from '@bthwani/ui-kit';

export type ServiceToken = {
  label: string;
};

export type DshStoreCompactCardData = {
  id: string;
  name: string;
  subtitle: string;
  image: ImageSourcePropType | { uri: string };
  rating?: number | null;
  distanceKm?: number | null;
  isOpen: boolean;
  supportsPickup: boolean;
  supportsPartnerDelivery: boolean;
  serviceTokens?: ServiceToken[];
  isFavorite: boolean;
  isFollowing: boolean;
  followersCount: number;
  hasBthwaniPro?: boolean;
  subscriptionPackageChips?: string[];
  hasNewProducts?: boolean;
  hasOffer?: boolean;
  offerText?: string;
  pointsMultiplier?: number;
  hasCouponAvailable?: boolean;
};

export type StoreCardPremiumProps = {
  item: DshStoreCompactCardData;
  onPress?: (id: string) => void;
  onPressSubscriptionChip?: (storeId: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleFollow?: (id: string) => void;
  style?: ViewStyle;
  testID?: string;
};

const CARD_HEIGHT = 98;
const CARD_RADIUS = 14;
const IMAGE_SIZE = 58;
const STATUS_HEIGHT = 22;
const METRICS_BAR_HEIGHT = 24;
const SERVICE_LANE_MIN_HEIGHT = 18;
const SUBSCRIPTION_LANE_HEIGHT = 20;
const LEFT_COL_WIDTH = 48;

function formatFollowers(value?: number): string {
  const count = Number(value ?? 0);
  if (count >= 1_000_000) {
    return `${Math.round(count / 1_000_000)} مليون`;
  }
  if (count >= 1_000) {
    return `${Math.round(count / 1_000)} ألف`;
  }
  return `${count}`;
}

function formatDistance(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }

  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} كم`;
}

function buildServiceTokens(supportsPickup: boolean, supportsPartnerDelivery: boolean): ServiceToken[] {
  const tokens: ServiceToken[] = [];

  if (supportsPickup) {
    tokens.push({ label: 'استلام بنفسك' });
  }

  if (supportsPartnerDelivery) {
    tokens.push({ label: 'توصيل المتجر' });
  }

  return tokens;
}

export const StoreCardPremium = memo(function StoreCardPremium({
  item,
  onPress,
  onPressSubscriptionChip,
  onToggleFavorite,
  onToggleFollow,
  style,
  testID,
}: StoreCardPremiumProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, resolveTextAlign(direction)), [direction, theme]);
  const serviceTokens = item.serviceTokens ?? buildServiceTokens(item.supportsPickup, item.supportsPartnerDelivery);
  const followersLabel = formatFollowers(item.followersCount);
  const ratingValue = item.rating == null || Number.isNaN(item.rating) ? 5 : item.rating;
  const imageSource = typeof item.image === 'object' && 'uri' in item.image ? item.image.uri : '';
  const hasImage = Boolean(imageSource);

  return (
    <Pressable
      testID={testID}
      onPress={() => onPress?.(item.id)}
      style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
    >
      <View style={styles.detailsBlock}>
        <View style={styles.rightCol}>
          <View style={styles.imageWrap}>
            {hasImage ? (
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            {(item.hasNewProducts || item.hasOffer) ? (
              <View style={styles.imageRibbon}>
                {item.hasNewProducts ? (
                  <View style={styles.ribbonBadgeNew}>
                    <Text style={styles.ribbonText}>جديد</Text>
                  </View>
                ) : null}
                {item.hasOffer && item.offerText ? (
                  <View style={styles.ribbonBadgeOffer}>
                    <Text style={styles.ribbonText} numberOfLines={1}>{item.offerText}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>

          <View style={styles.metricsBar}>
            <View style={styles.ratingSection}>
              <View style={styles.starRatingWrap}>
                <View style={styles.starOutline}>
                  <Ionicons name="star-outline" size={16} color={theme.warning} />
                </View>
                <View style={[styles.starFillMask, { width: `${Math.min(100, (ratingValue / 5) * 100)}%` }]}>
                  <Ionicons name="star" size={16} color={theme.warning} />
                </View>
              </View>

              {item.pointsMultiplier != null && item.pointsMultiplier > 1 ? (
                <View style={styles.pointsMultiplierInline}>
                  <Text style={styles.pointsMultiplierInlineText}>x{item.pointsMultiplier}</Text>
                </View>
              ) : null}
            </View>

            <Pressable onPress={() => onToggleFollow?.(item.id)} style={styles.followersWrap}>
              <Text style={styles.followersText} numberOfLines={1}>{followersLabel}</Text>
              <View style={styles.followIconWrap}>
                <Ionicons name="people-outline" size={18} color={theme.text} style={{ transform: [{ scaleX: -1 }] }} />
                <View style={styles.followPlusBadge}>
                  <Ionicons name="add" size={8} color={theme.textInverse} />
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.centerCol}>
          <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{item.subtitle}</Text>

          <View style={[styles.serviceRow, { minHeight: SERVICE_LANE_MIN_HEIGHT }]}>
            <Text numberOfLines={1} style={styles.serviceRowText}>{formatDistance(item.distanceKm)}</Text>
            {serviceTokens.map((token, index) => (
              <React.Fragment key={`${item.id}-${index}`}>
                <Text style={styles.serviceRowDot}> • </Text>
                <Text numberOfLines={1} style={styles.serviceRowText}>{token.label}</Text>
              </React.Fragment>
            ))}
          </View>

          <View style={[styles.subscriptionRow, { minHeight: SUBSCRIPTION_LANE_HEIGHT }]}>
            {item.hasBthwaniPro ? (
              <>
                <Pressable
                  onPress={() => onPressSubscriptionChip?.(item.id)}
                  style={({ pressed }) => [styles.proBadge, pressed && styles.proBadgePressed]}
                  hitSlop={8}
                >
                  <Ionicons name="flash" size={10} color={theme.textInverse} />
                  <Text style={styles.proBadgeText}>ثواني برو</Text>
                </Pressable>

                {item.subscriptionPackageChips?.length ? item.subscriptionPackageChips.map((chip) => (
                  <View key={chip} style={styles.packageChip}>
                    <Text style={styles.packageChipText} numberOfLines={1}>{chip}</Text>
                  </View>
                )) : null}

                {item.hasCouponAvailable ? (
                  <View style={styles.couponChip}>
                    <Ionicons name="ticket-outline" size={10} color={theme.info} />
                  </View>
                ) : null}
              </>
            ) : item.hasCouponAvailable ? (
              <View style={styles.couponChipStandalone}>
                <Ionicons name="ticket-outline" size={12} color={theme.info} />
                <Text style={styles.couponChipText}>قسيمة متاحة</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.leftCol}>
        <View style={[styles.statusPill, item.isOpen ? styles.statusPillOpen : styles.statusPillClosed]}>
          <View style={[styles.statusDot, item.isOpen ? styles.statusDotOpen : styles.statusDotClosed]} />
          <Text style={[styles.statusText, item.isOpen ? styles.statusTextOpen : styles.statusTextClosed]}>
            {item.isOpen ? 'مفتوح' : 'مغلق'}
          </Text>
        </View>

        <Pressable hitSlop={10} onPress={() => onToggleFavorite?.(item.id)} style={styles.favoriteBtn}>
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={item.isFavorite ? theme.danger : theme.textSoft}
          />
        </Pressable>
      </View>
    </Pressable>
  );
});

function createStyles(theme: ReturnType<typeof useTheme>['theme'], textAlign: 'left' | 'right' | 'center') {
  return StyleSheet.create({
    card: {
      height: CARD_HEIGHT,
      borderRadius: CARD_RADIUS,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.line,
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'stretch',
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      overflow: 'hidden',
    },
    cardPressed: { opacity: 0.98 },
    detailsBlock: {
      flex: 1,
      flexDirection: 'row',
      minWidth: 0,
      alignItems: 'stretch',
    },
    leftCol: {
      width: LEFT_COL_WIDTH,
      marginEnd: 6,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 2,
    },
    statusPill: {
      height: STATUS_HEIGHT,
      paddingHorizontal: 6,
      borderRadius: STATUS_HEIGHT / 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    statusPillOpen: {
      backgroundColor: theme.successSurface,
      borderWidth: 1,
      borderColor: theme.success,
    },
    statusPillClosed: {
      backgroundColor: theme.danger,
    },
    statusDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
    },
    statusDotOpen: { backgroundColor: theme.success },
    statusDotClosed: { backgroundColor: theme.textInverse },
    statusText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '700',
    },
    statusTextOpen: { color: theme.successText },
    statusTextClosed: { color: theme.textInverse },
    favoriteBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    rightCol: {
      width: IMAGE_SIZE + 4,
      marginEnd: 4,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    imageWrap: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.line,
      position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.surfaceRaised,
    },
    imageRibbon: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingVertical: 2,
      borderBottomStartRadius: 8,
      borderBottomEndRadius: 8,
    },
    ribbonBadgeNew: {
      backgroundColor: theme.brand,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
    },
    ribbonBadgeOffer: {
      backgroundColor: theme.danger,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
    },
    ribbonText: {
      fontSize: 7,
      lineHeight: 9,
      fontWeight: '700',
      color: theme.textInverse,
    },
    metricsBar: {
      height: METRICS_BAR_HEIGHT,
      width: '100%',
      maxWidth: IMAGE_SIZE + 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 0,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
    },
    ratingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    starRatingWrap: {
      width: 16,
      height: 16,
      position: 'relative',
    },
    starOutline: { position: 'absolute', top: 0, start: 0 },
    starFillMask: {
      position: 'absolute',
      top: 0,
      start: 0,
      height: 16,
      overflow: 'hidden',
    },
    pointsMultiplierInline: {
      backgroundColor: theme.warning,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 4,
    },
    pointsMultiplierInlineText: {
      fontSize: 8,
      lineHeight: 10,
      fontWeight: '800',
      color: theme.text,
    },
    followersWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    followersText: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '600',
      color: theme.text,
    },
    followIconWrap: { position: 'relative' },
    followPlusBadge: {
      position: 'absolute',
      bottom: -2,
      start: -2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerCol: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginEnd: 4,
    },
    name: {
      fontSize: 15,
      lineHeight: 18,
      fontWeight: '700',
      color: theme.text,
      textAlign,
    },
    subtitle: {
      marginTop: 0,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '400',
      color: theme.textMuted,
      textAlign,
    },
    serviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
    },
    serviceRowText: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '500',
      color: theme.textMuted,
    },
    serviceRowDot: {
      fontSize: 11,
      color: theme.textSoft,
    },
    subscriptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 4,
      flexWrap: 'nowrap',
    },
    proBadge: {
      height: 20,
      paddingHorizontal: 8,
      borderRadius: 10,
      backgroundColor: theme.infoSurface,
      borderWidth: 1,
      borderColor: theme.info,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    proBadgePressed: {
      opacity: 0.9,
      backgroundColor: theme.infoSurface,
    },
    proBadgeText: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '800',
      color: theme.infoText,
    },
    packageChip: {
      height: 18,
      paddingHorizontal: 6,
      borderRadius: 9,
      backgroundColor: theme.surfaceRaised,
      justifyContent: 'center',
      alignItems: 'center',
    },
    packageChipText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '700',
      color: theme.textMuted,
    },
    couponChip: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.infoSurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    couponChipStandalone: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.infoSurface,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 10,
    },
    couponChipText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '600',
      color: theme.infoText,
    },
  });
}

export default StoreCardPremium;