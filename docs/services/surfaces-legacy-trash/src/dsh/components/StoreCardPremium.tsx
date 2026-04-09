import React, { memo, useMemo } from 'react';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { ServiceShortItem } from '@bthwani/domain-types';
import { useI18n } from '@bthwani/ui-kit';

export type ServiceToken = {
  icon?: React.ReactNode;
  label: string;
};

export type SubscriptionLaneData = {
  title?: string;
  packageChips?: string[];
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

type StoreCardPremiumProps = {
  item?: DshStoreCompactCardData;
  onPress?: (id: string) => void;
  id?: string;
  name?: string;
  subtitle?: string;
  image?: ImageSourcePropType | { uri: string };

  rating?: number | null;
  distanceKm?: number | null;
  isOpen?: boolean;
  supportsPickup?: boolean;
  supportsPartnerDelivery?: boolean;
  serviceTokens?: ServiceToken[];

  isFavorite?: boolean;
  isFollowing?: boolean;
  followersCount?: number | null;

  hasBthwaniPro?: boolean;
  subscriptionPackageChips?: string[];
  onPressSubscriptionChip?: (storeId: string) => void;
  hasNewProducts?: boolean;
  hasOffer?: boolean;
  offerText?: string;
  pointsMultiplier?: number;
  hasCouponAvailable?: boolean;

  onPressCard?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleFollow?: (id: string) => void;

  /** Phase 2: optional linked short — when set, shows video badge on card; onShortPress opens fullscreen viewer */
  linkedShort?: ServiceShortItem | null;
  onShortPress?: () => void;

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

function formatFollowers(value?: number | null, isRTL?: boolean): string {
  const n = Number(value ?? 0);
  if (n >= 1_000_000) {
    const val = Math.round(n / 1_000_000);
    return isRTL ? `${val} مليون` : `${val}M`;
  }
  if (n >= 1_000) {
    const val = Math.round(n / 1_000);
    return isRTL ? `${val} ألف` : `${val}k`;
  }
  return `${n}`;
}

function formatDistance(
  value: number | null | undefined,
  t: (key: string) => string
): string {
  if (value == null || Number.isNaN(value))
    return t('dsh.components.StoreCardPremium.distanceSuffix');
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} ${t('dsh.components.StoreCardPremium.km')}`;
}

function formatRating(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toFixed(1);
}

function noop() {}

function defaultServiceTokens(
  supportsPickup: boolean,
  supportsPartnerDelivery: boolean,
  t: (key: string) => string
): ServiceToken[] {
  const tokens: ServiceToken[] = [];
  if (supportsPickup) {
    tokens.push({
      icon: (
        <MaterialIcons
          name='directions-walk'
          size={13}
          color={BTHWANI_COLORS.onSurfaceMuted}
        />
      ),
      label: t('dsh.components.StoreCardPremium.pickupLabel'),
    });
  }
  if (supportsPartnerDelivery) {
    tokens.push({
      icon: (
        <FontAwesome6
          name='motorcycle'
          size={12}
          color={BTHWANI_COLORS.onSurfaceMuted}
        />
      ),
      label: t('dsh.components.StoreCardPremium.partnerDeliveryLabel'),
    });
  }
  return tokens;
}

export const StoreCardPremium = memo(function StoreCardPremium(
  props: StoreCardPremiumProps
) {
  const fromItem = props.item != null;
  const id = fromItem ? props.item.id : (props.id ?? '');
  const name = fromItem ? props.item.name : (props.name ?? '');
  const subtitle = fromItem ? props.item.subtitle : (props.subtitle ?? '');
  const image = fromItem ? props.item.image : (props.image ?? { uri: '' });
  const rating = fromItem ? props.item.rating : props.rating;
  const distanceKm = fromItem ? props.item.distanceKm : props.distanceKm;
  const isOpen = fromItem ? props.item.isOpen : (props.isOpen ?? false);
  const supportsPickup = fromItem
    ? props.item.supportsPickup
    : (props.supportsPickup ?? false);
  const supportsPartnerDelivery = fromItem
    ? props.item.supportsPartnerDelivery
    : (props.supportsPartnerDelivery ?? false);
  const serviceTokensProp = fromItem
    ? props.item.serviceTokens
    : props.serviceTokens;
  const isFavorite = fromItem
    ? props.item.isFavorite
    : (props.isFavorite ?? false);
  const isFollowing = fromItem
    ? props.item.isFollowing
    : (props.isFollowing ?? false);
  const followersCount = fromItem
    ? props.item.followersCount
    : (props.followersCount ?? 0);
  const hasBthwaniPro = fromItem
    ? props.item.hasBthwaniPro
    : (props.hasBthwaniPro ?? false);
  const subscriptionPackageChips = fromItem
    ? props.item.subscriptionPackageChips
    : props.subscriptionPackageChips;
  const hasNewProducts = fromItem
    ? props.item.hasNewProducts
    : (props.hasNewProducts ?? false);
  const hasOffer = fromItem ? props.item.hasOffer : (props.hasOffer ?? false);
  const offerText = fromItem ? props.item.offerText : props.offerText;
  const pointsMultiplier = fromItem
    ? props.item.pointsMultiplier
    : props.pointsMultiplier;
  const hasCouponAvailable = fromItem
    ? props.item.hasCouponAvailable
    : (props.hasCouponAvailable ?? false);
  const onPressCard = fromItem
    ? (props.onPress ?? noop)
    : (props.onPressCard ?? noop);
  const onToggleFavorite = props.onToggleFavorite ?? noop;
  const onToggleFollow = props.onToggleFollow ?? noop;
  const onPressSubscriptionChip = props.onPressSubscriptionChip;
  const linkedShort = props.linkedShort;
  const onShortPress = props.onShortPress ?? noop;
  const { t, isRTL } = useI18n();
  const styles = useMemo(() => createStyles(isRTL), [isRTL]);
  const { style, testID } = props;

  const followersLabel = formatFollowers(followersCount, isRTL);

  const serviceTokens = useMemo(
    () =>
      serviceTokensProp ??
      defaultServiceTokens(supportsPickup, supportsPartnerDelivery, t),
    [serviceTokensProp, supportsPickup, supportsPartnerDelivery, t]
  );

  // الصورة المرفقة: مغلق/مفتوح ومفضلة في الجهة اليسرى؛ اسم المطعم وكل النصوص بجوار الشعار (يمين)
  return (
    <Pressable
      testID={testID}
      onPress={() => onPressCard(id)}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.detailsBlock}>
        <View style={styles.rightCol}>
          <View style={styles.imageWrap}>
            <Image source={image} style={styles.image} resizeMode='cover' />
            {linkedShort != null && linkedShort !== undefined ? (
              <Pressable
                onPress={e => {
                  e?.stopPropagation?.();
                  onShortPress();
                }}
                style={styles.shortVideoBadge}
                hitSlop={8}
                accessibilityLabel={t('marketing.shorts_video_badge')}
                accessibilityRole='button'
              >
                <Ionicons
                  name='videocam'
                  size={16}
                  color={BTHWANI_COLORS.surface}
                />
              </Pressable>
            ) : null}
            {/* شارات الصورة — شريط سفلي */}
            {(hasNewProducts || hasOffer) && (
              <View style={styles.imageRibbon}>
                {hasNewProducts && (
                  <View style={styles.ribbonBadgeNew}>
                    <Text style={styles.ribbonText}>
                      {t('dsh.components.StoreCardPremium.newProductsBadge')}
                    </Text>
                  </View>
                )}
                {hasOffer && offerText && (
                  <View style={styles.ribbonBadgeOffer}>
                    <Text style={styles.ribbonText} numberOfLines={1}>
                      {offerText}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={styles.metricsBar}>
            {/* نجمة التقييم مع مضاعف النقاط */}
            <View style={styles.ratingSection}>
              <View style={styles.starRatingWrap}>
                <View style={styles.starOutline}>
                  <Ionicons
                    name='star-outline'
                    size={16}
                    color={BTHWANI_COLORS.warning}
                  />
                </View>
                <View
                  style={[
                    styles.starFillMask,
                    { width: `${Math.min(100, ((rating ?? 0) / 5) * 100)}%` },
                  ]}
                >
                  <Ionicons
                    name='star'
                    size={16}
                    color={BTHWANI_COLORS.warning}
                  />
                </View>
              </View>
              {pointsMultiplier != null && pointsMultiplier > 1 && (
                <View style={styles.pointsMultiplierInline}>
                  <Text style={styles.pointsMultiplierInlineText}>
                    x{pointsMultiplier}
                  </Text>
                </View>
              )}
            </View>
            {/* أيقونة المتابعين */}
            <Pressable
              onPress={() => onToggleFollow(id)}
              style={styles.followersWrap}
            >
              <Text style={styles.followersText} numberOfLines={1}>
                {followersLabel}
              </Text>
              <View style={styles.followIconWrap}>
                <Ionicons
                  name='people-outline'
                  size={18}
                  color={BTHWANI_COLORS.neutral900}
                  style={{ transform: [{ scaleX: -1 }] }}
                />
                <View style={styles.followPlusBadge}>
                  <Ionicons
                    name='add'
                    size={8}
                    color={BTHWANI_COLORS.surface}
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.centerCol}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
          <View
            style={[styles.serviceRow, { minHeight: SERVICE_LANE_MIN_HEIGHT }]}
          >
            <Text numberOfLines={1} style={styles.serviceRowText}>
              {formatDistance(distanceKm, t)}
            </Text>
            {serviceTokens.map((token, index) => (
              <React.Fragment key={index}>
                <Text style={styles.serviceRowDot}> • </Text>
                <Text numberOfLines={1} style={styles.serviceRowText}>
                  {token.label}
                </Text>
              </React.Fragment>
            ))}
          </View>
          <View
            style={[
              styles.subscriptionRow,
              { minHeight: SUBSCRIPTION_LANE_HEIGHT },
            ]}
          >
            {hasBthwaniPro ? (
              <>
                <Pressable
                  onPress={() => onPressSubscriptionChip?.(id)}
                  style={({ pressed }) => [
                    styles.proBadge,
                    pressed && styles.proBadgePressed,
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name='flash'
                    size={10}
                    color={BTHWANI_COLORS.surface}
                  />
                  <Text style={styles.proBadgeText}>
                    {t('dsh.components.StoreCardPremium.proBadgeText')}
                  </Text>
                </Pressable>
                {subscriptionPackageChips?.length
                  ? subscriptionPackageChips.map(chip => (
                      <View key={chip} style={styles.packageChip}>
                        <Text style={styles.packageChipText} numberOfLines={1}>
                          {chip}
                        </Text>
                      </View>
                    ))
                  : null}
                {hasCouponAvailable && (
                  <View style={styles.couponChip}>
                    <Ionicons
                      name='ticket-outline'
                      size={10}
                      color={BTHWANI_COLORS.info}
                    />
                  </View>
                )}
              </>
            ) : hasCouponAvailable ? (
              <View style={styles.couponChipStandalone}>
                <Ionicons
                  name='ticket-outline'
                  size={12}
                  color={BTHWANI_COLORS.info}
                />
                <Text style={styles.couponChipText}>
                  {t('dsh.components.StoreCardPremium.couponAvailable')}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.leftCol}>
        <View
          style={[
            styles.statusPill,
            isOpen ? styles.statusPillOpen : styles.statusPillClosed,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isOpen ? styles.statusDotOpen : styles.statusDotClosed,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isOpen ? styles.statusTextOpen : styles.statusTextClosed,
            ]}
          >
            {isOpen
              ? t('dsh.components.StoreCardPremium.openLabel')
              : t('dsh.components.StoreCardPremium.closedLabel')}
          </Text>
        </View>
        <Pressable
          hitSlop={10}
          onPress={() => onToggleFavorite(id)}
          style={styles.favoriteBtn}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={
              isFavorite ? BTHWANI_COLORS.danger : BTHWANI_COLORS.neutral400
            }
          />
        </Pressable>
      </View>
    </Pressable>
  );
});

function createStyles(isRTL: boolean) {
  return StyleSheet.create({
    card: {
      height: CARD_HEIGHT,
      borderRadius: CARD_RADIUS,
      backgroundColor: BTHWANI_COLORS.surface,
      borderWidth: 1,
      borderColor: BTHWANI_COLORS.neutral400,
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'stretch',
      shadowColor: BTHWANI_COLORS.onPrimaryContainer,
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      overflow: 'hidden',
    },

    cardPressed: {
      opacity: 0.98,
    },

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
      backgroundColor: BTHWANI_COLORS.successBg,
      borderWidth: 1,
      borderColor: BTHWANI_COLORS.emerald,
    },

    statusPillClosed: {
      backgroundColor: BTHWANI_COLORS.danger,
    },

    statusDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
    },

    statusDotOpen: {
      backgroundColor: BTHWANI_COLORS.emerald,
    },

    statusDotClosed: {
      backgroundColor: BTHWANI_COLORS.surface,
    },

    statusText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '700',
    },

    statusTextOpen: {
      color: BTHWANI_COLORS.emeraldDark,
    },

    statusTextClosed: {
      color: BTHWANI_COLORS.surface,
    },

    favoriteBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
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
      backgroundColor: BTHWANI_COLORS.accent,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
    },

    ribbonBadgeOffer: {
      backgroundColor: BTHWANI_COLORS.danger,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
    },

    ribbonText: {
      fontSize: 7,
      lineHeight: 9,
      fontWeight: '700',
      color: BTHWANI_COLORS.surface,
    },

    ratingSection: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 3,
    },

    pointsMultiplierInline: {
      backgroundColor: BTHWANI_COLORS.warning,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 4,
    },

    pointsMultiplierInlineText: {
      fontSize: 8,
      lineHeight: 10,
      fontWeight: '800',
      color: BTHWANI_COLORS.neutral900,
    },

    couponChip: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#E0F2FE',
      alignItems: 'center',
      justifyContent: 'center',
    },

    couponChipStandalone: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#E0F2FE',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 10,
    },

    couponChipText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '600',
      color: BTHWANI_COLORS.info,
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
      color: BTHWANI_COLORS.onPrimaryContainer,
    },

    subtitle: {
      marginTop: 0,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '400',
      color: BTHWANI_COLORS.onSurfaceMuted,
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
      color: BTHWANI_COLORS.onSurfaceMuted,
    },

    serviceRowDot: {
      fontSize: 11,
      color: BTHWANI_COLORS.gray400,
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
      backgroundColor: BTHWANI_COLORS.infoLight,
      borderWidth: 1,
      borderColor: BTHWANI_COLORS.info,
      flexDirection: 'row',
      direction: isRTL ? 'rtl' : 'ltr',
      alignItems: 'center',
      gap: 3,
    },

    proBadgePressed: {
      opacity: 0.9,
      backgroundColor: BTHWANI_COLORS.infoMid,
    },

    proBadgeText: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '800',
      color: BTHWANI_COLORS.surface,
      textAlign: isRTL ? 'right' : 'left',
    },

    packageChip: {
      height: 18,
      paddingHorizontal: 6,
      borderRadius: 9,
      backgroundColor: BTHWANI_COLORS.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },

    packageChipText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '700',
      color: BTHWANI_COLORS.slate600,
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
      backgroundColor: BTHWANI_COLORS.surfaceVariant,
      borderWidth: 1,
      borderColor: BTHWANI_COLORS.borderSubtle,
      position: 'relative',
    },

    shortVideoBadge: {
      position: 'absolute',
      bottom: 4,
      end: 4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'BTHWANI_COLORS.overlay55',
      alignItems: 'center',
      justifyContent: 'center',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    metricsBar: {
      height: METRICS_BAR_HEIGHT,
      width: '100%',
      maxWidth: IMAGE_SIZE + 4,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 0,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
    },

    starRatingWrap: {
      width: 16,
      height: 16,
      position: 'relative',
    },

    starOutline: {
      position: 'absolute',
      top: 0,
      start: 0,
    },

    starFillMask: {
      position: 'absolute',
      top: 0,
      start: 0,
      height: 16,
      overflow: 'hidden',
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
      color: BTHWANI_COLORS.neutral900,
    },

    followIconWrap: {
      position: 'relative',
    },

    followPlusBadge: {
      position: 'absolute',
      bottom: -2,
      start: -2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: BTHWANI_COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
