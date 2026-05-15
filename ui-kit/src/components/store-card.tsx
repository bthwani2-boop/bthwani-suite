import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Icon } from './icons';
import { useBThwaniAppearance, useTheme } from '../providers';

/**
 * STORE_CARD_PREMIUM_2026: MASTERPIECE EDITION
 * A high-fidelity, compact horizontal store card optimized for RTL.
 * Features: Fixed square image, circular logo overlay, image-overlaid metrics.
 */

// --- Constants ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = 114; // Slightly increased to prevent text clipping
const LOGO_SIZE = 54;
const CARD_RADIUS = 16;
const DARK_BLUE = '#0A2F5C';
const ORANGE = '#FF500D';
const GOLD = '#FFD700';

export interface ServiceToken {
  label: string;
}

export interface StoreCardPremiumItem {
  id: string;
  name: string;
  subtitle?: string;
  image: any;
  logoImage?: any;
  rating?: number | null;
  distanceKm?: number | null;
  isOpen: boolean;
  supportsPickup?: boolean;
  supportsPartnerDelivery?: boolean;
  isFavorite: boolean;
  followersCount?: number;
  hasBthwaniPro?: boolean;
  hasOffer?: boolean;
  offerText?: string;
  pointsMultiplier?: number;
  hasCouponAvailable?: boolean;
  locationLabel?: string;
  deliveryTimeLabel?: string;
  isPopular?: boolean;
}

export interface StoreCardPremiumProps {
  item: StoreCardPremiumItem;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export const StoreCardPremium: React.FC<StoreCardPremiumProps> = ({
  item,
  onPress,
  onFavoritePress,
}) => {
  const { theme } = useTheme();
  const { tokens, mode } = useBThwaniAppearance();
  const pc = tokens.components.commerce.productCard;
  const bdg = tokens.components.badges;
  const isDark = mode === 'darkGlass';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: pc.backgroundColor, borderWidth: 1, borderColor: pc.rimLightColor, opacity: pressed ? 0.92 : 1 }]}
    >
      {/* Top-Left Status Icon (Absolute Leaf Premium) */}
      <View style={styles.absoluteStatusBadge}>
        <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Icon
            name={item.isOpen ? 'lock-open' : 'lock-closed'}
            size={16}
            color={item.isOpen ? theme.success : theme.danger}
          />
          <View style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            backgroundColor: item.isOpen ? theme.success : theme.danger,
            borderRadius: 4.5,
            width: 9,
            height: 9,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.surface,
          }}>
            <Icon name={item.isOpen ? 'checkmark' : 'remove'} size={5} color="#FFF" />
          </View>
        </View>
      </View>

      {/* Bottom-Left Favorite Button (Absolute Leaf Premium) */}
      <Pressable
        onPress={onFavoritePress}
        hitSlop={8}
        style={styles.absoluteFavoriteButton}
      >
        <Icon
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={16}
          color={ORANGE}
        />
      </Pressable>

      {/* Image Area (Right side in RTL) */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.mainImage} />

        {/* Metrics Overlay (Bottom-Left of Image) */}
        <View style={styles.imageMetricsOverlay}>
          <View style={styles.imageMetricItem}>
            <Icon name="star" size={10} color="#FFD700" />
            <Text style={styles.imageMetricText}>{item.rating?.toFixed(1) || '4.5'}</Text>
          </View>
          <View style={styles.imageMetricDivider} />
          <View style={styles.imageMetricItem}>
            <Icon name="people" size={10} color="#FFF" />
            <Text style={styles.imageMetricText}>
              {item.followersCount ? `${(item.followersCount / 1000).toFixed(0)}k` : '11k'}
            </Text>
          </View>
        </View>

        {/* Orange Logo Template (Bottom-right Overlay) */}
        <View style={styles.logoTemplateContainer}>
          <View style={[styles.logoOverlay, { borderColor: theme.surface }]}>
            <Image source={item.logoImage || item.image} style={styles.logoImage} />
          </View>
        </View>
      </View>

      {/* Content Area (Left side in RTL) */}
      <View style={styles.contentContainer}>
        {/* Row 1 & 2: Name + Location/Badges */}
        <View style={styles.textContent}>
          <View style={styles.headerRow}>
            <Text style={[styles.storeName, { color: pc.titleColor }]} numberOfLines={1}>
              {item.name}
            </Text>
          </View>

          <View style={styles.locationBadgeRow}>
            <View style={styles.locationCluster}>
              <Icon name="location-sharp" size={11} color={ORANGE} />
              <Text style={[styles.addressText, { color: tokens.textSecondary }]} numberOfLines={1}>
                {item.locationLabel || item.subtitle || 'الرياض'}
              </Text>
            </View>

            <View style={styles.badgeCluster}>
              {item.isPopular && (
                <View style={[styles.statusBadge, { backgroundColor: bdg.brand.backgroundColor, borderWidth: 1, borderColor: bdg.brand.borderColor }]}>
                  <Icon name="flame" size={10} color={bdg.brand.iconColor} />
                  <Text style={[styles.statusText, { color: bdg.brand.textColor }]}>رائج</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Row 3: Metrics Ribbon (Clean, No Background) */}
        <View style={styles.metricsRibbon}>
          <View style={styles.metricItem}>
            <Icon name="navigate-outline" size={10} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: tokens.textMuted }]}>{item.distanceKm?.toFixed(1) || '2.1'} كم</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Icon name="time-outline" size={10} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: tokens.textMuted }]}>{item.deliveryTimeLabel || '25-35 د'}</Text>
          </View>
        </View>

        {/* Row 4: Service Icons */}
        <View style={styles.servicesRow}>
          {item.supportsPartnerDelivery && (
            <View style={styles.serviceIconWrap}>
              <Icon name="bicycle-outline" size={14} color={tokens.textSecondary} />
              <Text style={[styles.serviceMiniText, { color: tokens.textSecondary }]}>توصيل</Text>
            </View>
          )}
          {item.supportsPickup && (
            <View style={styles.serviceIconWrap}>
              <Icon name="walk-outline" size={14} color={tokens.textSecondary} />
              <Text style={[styles.serviceMiniText, { color: tokens.textSecondary }]}>استلم</Text>
            </View>
          )}
          <View style={styles.serviceIconWrap}>
            <Icon name="flash-outline" size={14} color={ORANGE} />
            <Text style={[styles.serviceMiniText, { color: ORANGE }]}>ثواني</Text>
          </View>
        </View>

        {/* Row 5: Promo Chips */}
        <View style={styles.promoRow}>
          {item.hasBthwaniPro && (
            <View style={[styles.promoChip, { backgroundColor: isDark ? tokens.glassSurfaceStrong : '#0A2F5C', borderWidth: isDark ? 1 : 0, borderColor: isDark ? tokens.glassBorder : 'transparent' }]}>
              <Text style={[styles.promoChipTextPro, { color: isDark ? tokens.textPrimary : '#FFF' }]}>برو</Text>
            </View>
          )}
          {item.hasOffer && (
            <View style={[styles.promoChip, { backgroundColor: bdg.success.backgroundColor, borderWidth: 1, borderColor: bdg.success.borderColor }]}>
              <Text style={[styles.promoChipText, { color: bdg.success.textColor }]}>مجاني</Text>
            </View>
          )}
          {item.pointsMultiplier && item.pointsMultiplier > 1 && (
            <View style={[styles.promoChip, { backgroundColor: bdg.info.backgroundColor, borderWidth: 1, borderColor: bdg.info.borderColor }]}>
              <Text style={[styles.promoChipText, { color: bdg.info.textColor }]}>{item.pointsMultiplier}x نقاط</Text>
            </View>
          )}
          {item.hasCouponAvailable && (
            <View style={[styles.promoChip, { backgroundColor: bdg.promo.backgroundColor, borderWidth: 1, borderColor: bdg.promo.borderColor }]}>
              <Text style={[styles.promoChipText, { color: bdg.promo.textColor }]}>كوبون</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    height: IMAGE_SIZE,
    borderRadius: CARD_RADIUS,
    flexDirection: 'row-reverse',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'relative',
  },
  mainImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: CARD_RADIUS,
  },
  imageMetricsOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 47, 92, 0.85)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 4,
    maxWidth: 66, // Prevents overlap with the logo circle on the right while staying clear of the left corner curve
  },
  imageMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  imageMetricText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: 'Outfit-Bold',
  },
  imageMetricDivider: {
    width: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  logoTemplateContainer: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: LOGO_SIZE + 12,
    height: LOGO_SIZE + 12,
    borderRadius: (LOGO_SIZE + 12) / 2,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  absoluteStatusBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 30,
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 24,
    borderTopLeftRadius: CARD_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  absoluteFavoriteButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 30,
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 24,
    borderBottomLeftRadius: CARD_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoOverlay: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    borderWidth: 1, // Slimmer internal border
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    paddingRight: 12,
    paddingLeft: 45, // Leave space for absolute Status and Favorite actions
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 19, // Primary: Prominent & Dominant
    fontWeight: '800',
    color: '#0A2F5C',
    textAlign: 'right',
    fontFamily: 'Outfit-Bold',
    marginBottom: 0,
  },
  addressText: {
    fontSize: 11, // Even smaller and quieter
    color: '#718096',
    textAlign: 'right',
    fontFamily: 'Outfit-Regular',
    marginTop: -1,
  },
  locationBadgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationCluster: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  badgeCluster: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 9, // Smaller for clean hierarchy
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    marginRight: 2,
  },
  statusOrb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  metaText: {
    fontSize: 9, // Tertiary: Smallest possible for high-density elegance
    color: '#718096',
    fontFamily: 'Outfit-Medium',
  },
  deliveryBadgeText: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  metricsRibbon: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: 'flex-start',
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 3,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  metricDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  servicesRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16, // More space between services
  },
  serviceIconWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  serviceMiniText: {
    fontSize: 9,
    fontWeight: '600',
    color: DARK_BLUE,
  },
  promoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8, // Increased gap for better separation
    marginTop: 4,
  },
  promoChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  promoChipPro: {
    backgroundColor: DARK_BLUE,
  },
  promoChipTextPro: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  promoChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default StoreCardPremium;
