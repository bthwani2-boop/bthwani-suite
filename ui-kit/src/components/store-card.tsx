import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../providers';

/**
 * STORE_CARD_PREMIUM_2026: MASTERPIECE EDITION
 * A high-fidelity, compact horizontal store card optimized for RTL.
 * Features: Fixed square image, circular logo overlay, image-overlaid metrics.
 */

// --- Constants ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = 114; // Slightly increased to prevent text clipping
const LOGO_SIZE = 38;
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

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.surface }]}
    >
      {/* Top-Left Status Badge (Absolute) */}
      <View style={styles.absoluteStatusBadge}>
        <View style={[styles.statusBadge, { backgroundColor: item.isOpen ? '#F0FFF4' : '#FFF5F5' }]}>
          <View style={[styles.dot, { backgroundColor: item.isOpen ? theme.success : theme.danger }]} />
          <Text style={[styles.statusText, { color: item.isOpen ? theme.success : theme.danger }]}>
            {item.isOpen ? 'مفتوح' : 'مغلق'}
          </Text>
        </View>
      </View>

      {/* Bottom-Left Favorite Button (Absolute) */}
      <TouchableOpacity
        onPress={onFavoritePress}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        style={styles.absoluteFavoriteButton}
      >
        <Ionicons
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={item.isFavorite ? ORANGE : theme.textMuted}
        />
      </TouchableOpacity>

      {/* Image Area (Right side in RTL) */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.mainImage} />

        {/* Metrics Overlay (Bottom-Left of Image) */}
        <View style={styles.imageMetricsOverlay}>
          <View style={styles.imageMetricItem}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.imageMetricText}>{item.rating?.toFixed(1) || '4.5'}</Text>
          </View>
          <View style={styles.imageMetricDivider} />
          <View style={styles.imageMetricItem}>
            <Ionicons name="people" size={12} color="#FFF" />
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
        <View style={styles.textContent}>
          {/* Row 1: Name */}
          <View style={styles.headerRow}>
            <Text style={styles.storeName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>

          {/* Row 2: Location & Badges */}
          <View style={styles.locationBadgeRow}>
            <View style={styles.locationCluster}>
              <Ionicons name="location-sharp" size={14} color={ORANGE} />
              <Text style={styles.addressText} numberOfLines={1}>
                {item.locationLabel || item.subtitle || 'الرياض'}
              </Text>
            </View>

            <View style={styles.badgeCluster}>
              {item.isPopular && (
                <View style={[styles.statusBadge, { backgroundColor: '#FFF5F0' }]}>
                  <Ionicons name="flame" size={10} color={ORANGE} />
                  <Text style={[styles.statusText, { color: ORANGE, fontSize: 11 }]}>رائج</Text>
                </View>
              )}
            </View>
          </View>

        {/* Row 3: Metrics Ribbon (Only Distance/Time) */}
        <View style={[styles.metricsRibbon, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.metricItem}>
            <Ionicons name="navigate-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{item.distanceKm?.toFixed(1) || '2.1'} كم</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Ionicons name="time-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{item.deliveryTimeLabel || '25-35 د'}</Text>
          </View>
        </View>

        {/* Row 4: Service Icons */}
        <View style={styles.servicesRow}>
          {item.supportsPartnerDelivery && (
            <View style={styles.serviceIconWrap}>
              <Ionicons name="bicycle-outline" size={14} color={DARK_BLUE} />
              <Text style={styles.serviceMiniText}>توصيل</Text>
            </View>
          )}
          {item.supportsPickup && (
            <View style={styles.serviceIconWrap}>
              <Ionicons name="walk-outline" size={14} color={DARK_BLUE} />
              <Text style={styles.serviceMiniText}>استلم</Text>
            </View>
          )}
          <View style={styles.serviceIconWrap}>
            <Ionicons name="flash-outline" size={14} color={ORANGE} />
            <Text style={[styles.serviceMiniText, { color: ORANGE }]}>ثواني</Text>
          </View>
        </View>

        {/* Row 5: Promo Chips (Max 4) */}
        <View style={styles.promoRow}>
          {item.hasBthwaniPro && (
            <View style={[styles.promoChip, styles.promoChipPro]}>
              <Text style={styles.promoChipTextPro}>برو</Text>
            </View>
          )}
          {item.hasOffer && (
            <View style={[styles.promoChip, { backgroundColor: '#F0FFF4' }]}>
              <Text style={[styles.promoChipText, { color: theme.success }]}>مجاني</Text>
            </View>
          )}
          {item.pointsMultiplier && item.pointsMultiplier > 1 && (
            <View style={[styles.promoChip, { backgroundColor: '#EBF8FF' }]}>
              <Text style={[styles.promoChipText, { color: '#2B6CB0' }]}>{item.pointsMultiplier}x نقاط</Text>
            </View>
          )}
          {item.hasCouponAvailable && (
            <View style={[styles.promoChip, { backgroundColor: '#FFF5F0' }]}>
              <Text style={[styles.promoChipText, { color: ORANGE }]}>كوبون</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
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
    marginBottom: 16,
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
    left: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 47, 92, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  imageMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  imageMetricText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  imageMetricDivider: {
    width: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  logoTemplateContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: LOGO_SIZE + 8, // More compact
    height: LOGO_SIZE + 8,
    borderRadius: (LOGO_SIZE + 8) / 2,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20, // Ensure it's above the rating ribbon
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  absoluteStatusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 30,
  },
  absoluteFavoriteButton: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    zIndex: 30,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#0A2F5C',
    textAlign: 'right',
    fontFamily: 'Outfit-Bold',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#4A5568', // Improved contrast for readability
    textAlign: 'right',
    fontFamily: 'Outfit-Regular',
    marginBottom: 4,
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
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#555', // Darker for better contrast
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
    fontSize: 11,
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
