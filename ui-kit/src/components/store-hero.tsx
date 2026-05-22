import React from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  type DimensionValue,
  type ImageSourcePropType,
} from 'react-native';
import { colorPalette, resolveRowDirection } from '../foundation';
import { useDirection, useTheme, useBThwaniAppearance } from '../providers';
import { Icon } from './icons';
import { GlassHeroOverlay } from './appearance';
import { Text } from '../primitives';

export type StoreHeroFulfillmentMode = {
  id: string;
  label: string;
  icon: import('./icons').IconName;
};

export type StoreHeroProps = {
  /** The large cover image at the top */
  coverImage?: ImageSourcePropType;
  /** The overlapping brand logo of the store */
  logoImage?: ImageSourcePropType;
  /** The primary name of the store */
  name: string;
  /** Label describing location (e.g. 'حي العليا · الرياض') */
  locationLabel?: string;
  /** State of operation: true for open, false for closed */
  isOpen?: boolean;
  /** Whether the store has the BThwani Pro membership badge */
  hasBthwaniPro?: boolean;
  /** Distance metric string (e.g. '2.1 كم') */
  distanceLabel?: string;
  /** Estimated Time of Arrival metric string (e.g. '18 دقيقة') */
  deliveryTimeLabel?: string;
  /** Score rating float value (e.g. 5.0) */
  rating?: number;

  // Actions
  onSearchPress?: () => void;
  onCartPress?: () => void;
  onSharePress?: () => void;
  onBackPress?: () => void;
  /** Optional slot to render on the opposite side of floating top actions bar */
  topOppositeAction?: React.ReactNode;

  // Scroll listener for parallax interpolation
  scrollY?: Animated.Value;

  // Bottom service delivery tabs
  deliveryModes?: readonly StoreHeroFulfillmentMode[];
  selectedMode?: string;
  onModeChange?: (id: string) => void;
  /**
   * 'interactive' (default) — tabs are pressable and update selectedMode.
   * 'readonly' — tabs are display-only status indicators with no press handler.
   *   Use 'readonly' in partner/operator surfaces where modes are not selectable by the viewer.
   */
  serviceModesBehavior?: 'interactive' | 'readonly';
};

function hexToRgba(hex: string, alpha = 0.9) {
  const clean = (hex || '#ffffff').replace('#', '').trim();
  const short = clean.length === 3;
  const r = parseInt(short ? clean[0] + clean[0] : clean.slice(0, 2), 16);
  const g = parseInt(short ? clean[1] + clean[1] : clean.slice(2, 4), 16);
  const b = parseInt(short ? clean[2] + clean[2] : clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StoreHero({
  coverImage,
  logoImage,
  name,
  locationLabel,
  isOpen = true,
  hasBthwaniPro = false,
  distanceLabel,
  deliveryTimeLabel,
  rating,
  onSearchPress,
  onCartPress,
  onSharePress,
  onBackPress,
  topOppositeAction,
  scrollY,
  deliveryModes = [],
  selectedMode,
  onModeChange,
  serviceModesBehavior = 'interactive',
}: StoreHeroProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const { theme: tokens } = useTheme();
  const { mode: appearanceMode } = useBThwaniAppearance();
  const isDarkGlass = appearanceMode === 'darkGlass';

  // Fallback ScrollY if not animated externally
  const localScrollY = React.useRef(new Animated.Value(0)).current;
  const activeScrollY = scrollY || localScrollY;

  const appearanceChrome = React.useMemo(() => {
    return {
      heroOverlay: tokens.components?.overlays?.heroOverlay || 'rgba(0,0,0,0.3)',
      heroFadeRGB: isDarkGlass ? '22, 22, 28' : '255, 255, 255',
      heroFadeMaxAlpha: isDarkGlass ? 0.82 : 0.88,
      actionBackgroundGlass: isDarkGlass ? hexToRgba(colorPalette.black, 0.35) : hexToRgba(colorPalette.white, 0.45),
      actionBorderGlass: isDarkGlass ? hexToRgba(colorPalette.white, 0.22) : hexToRgba(colorPalette.black, 0.12),
      primaryText: isDarkGlass ? colorPalette.white : colorPalette.ink,
      secondaryText: isDarkGlass ? tokens.glassMutedText || 'rgba(255,255,255,0.7)' : colorPalette.inkMuted,
    };
  }, [isDarkGlass, tokens]);

  // Multiband gradient array for bottom fade-out effect on the cover image
  const reverseFeatherBands = React.useMemo(() => {
    const bgBase = isDarkGlass ? '22, 22, 28' : '255, 255, 255';
    return Array.from({ length: 6 }, (_, i) => {
      const step = i / 5;
      const alpha = Math.pow(step, 2) * (isDarkGlass ? 1 : 1);
      return {
        key: String(i),
        bottom: i * 2,
        backgroundColor: `rgba(${bgBase}, ${alpha.toFixed(3)})`,
      };
    });
  }, [isDarkGlass]);

  const ORANGE = colorPalette.brand;
  const DARK_BLUE = colorPalette.infoStrong;
  const GOLD = colorPalette.warning;

  return (
    <View style={styles.heroPremiumWrap}>
      <View style={styles.heroCoverWrap}>
        {coverImage ? (
          <Animated.Image
            source={coverImage}
            style={[
              styles.heroCoverImage,
              {
                transform: [
                  {
                    scale: activeScrollY.interpolate({
                      inputRange: [-200, 0, 480],
                      outputRange: [1.3, 1, 1.1],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    translateY: activeScrollY.interpolate({
                      inputRange: [-200, 0, 480],
                      outputRange: [-60, 0, 80],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
        ) : (
          <View style={styles.heroCoverPlaceholder} />
        )}
        <GlassHeroOverlay
          strength={isDarkGlass ? 'strong' : 'default'}
          style={[styles.heroCoverOverlay, { backgroundColor: appearanceChrome.heroOverlay }]}
        />

        {/* Multi-band feathered overlay gradient above cover */}
        <View style={styles.heroCoverFade} pointerEvents="none">
          {Array.from({ length: 120 }, (_, i) => {
            const t = i / 119;
            const alpha = Math.pow(t, 1.5) * appearanceChrome.heroFadeMaxAlpha;
            const bg = `rgba(${appearanceChrome.heroFadeRGB}, ${alpha.toFixed(3)})`;
            return (
              <View
                key={i}
                style={[styles.heroCoverFadeBand, { top: `${(t * 100).toFixed(2)}%` as DimensionValue, backgroundColor: bg }]}
              />
            );
          })}
        </View>

        {/* Floating Top Actions Bar */}
        <View style={[styles.heroTopActions, isRTL && styles.rowReverse]} pointerEvents="box-none">
          <View style={styles.heroTopActionsLeft} pointerEvents="box-none">
            {onSearchPress && (
              <TouchableOpacity
                style={[
                  styles.heroActionCircle,
                  {
                    backgroundColor: appearanceChrome.actionBackgroundGlass,
                    borderColor: appearanceChrome.actionBorderGlass,
                  },
                ]}
                activeOpacity={0.7}
                onPress={onSearchPress}
                hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
              >
                <Icon name="search-outline" size={22} color={isDarkGlass ? colorPalette.white : appearanceChrome.primaryText} />
              </TouchableOpacity>
            )}
            {onCartPress && (
              <TouchableOpacity
                style={[
                  styles.heroActionCircle,
                  {
                    backgroundColor: appearanceChrome.actionBackgroundGlass,
                    borderColor: appearanceChrome.actionBorderGlass,
                  },
                ]}
                activeOpacity={0.7}
                onPress={onCartPress}
                hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
              >
                <Icon name="cart-outline" size={22} color={isDarkGlass ? colorPalette.white : appearanceChrome.primaryText} />
              </TouchableOpacity>
            )}
            {onSharePress && (
              <TouchableOpacity
                style={[
                  styles.heroActionCircle,
                  {
                    backgroundColor: appearanceChrome.actionBackgroundGlass,
                    borderColor: appearanceChrome.actionBorderGlass,
                  },
                ]}
                activeOpacity={0.7}
                onPress={onSharePress}
                hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
              >
                <Icon name="share-outline" size={22} color={isDarkGlass ? colorPalette.white : appearanceChrome.primaryText} />
              </TouchableOpacity>
            )}
          </View>

          {topOppositeAction ? (
            <View pointerEvents="box-none">
              {topOppositeAction}
            </View>
          ) : (
            onBackPress && (
              <TouchableOpacity
                style={[
                  styles.heroActionCircle,
                  {
                    backgroundColor: appearanceChrome.actionBackgroundGlass,
                    borderColor: appearanceChrome.actionBorderGlass,
                  },
                ]}
                activeOpacity={0.7}
                onPress={onBackPress}
                hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
              >
                <Icon
                  name={isRTL ? 'chevron-forward' : 'chevron-back'}
                  size={22}
                  color={isDarkGlass ? colorPalette.white : appearanceChrome.primaryText}
                />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <View style={styles.contentBlock}>
        {/* Identity & Status Card */}
        <View style={styles.heroLuxuryCard}>
          {/* Identity Cluster */}
          <View style={[styles.heroLuxuryIdentityRow, isRTL && styles.rowReverse]}>
            <View style={[styles.heroLuxuryInfo, isRTL ? styles.alignEnd : styles.alignStart]}>
              <Text style={[styles.heroNameText, { color: appearanceChrome.primaryText }]} numberOfLines={1}>
                {name}
              </Text>
              {locationLabel && (
                <View style={[styles.heroLocationRow, isRTL && styles.rowReverse]}>
                  <Icon name="location-sharp" size={14} color={ORANGE} />
                  <Text style={[styles.heroLocationText, { color: appearanceChrome.secondaryText }]} numberOfLines={1}>
                    {locationLabel}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.heroStatusBadge,
                  isRTL && styles.rowReverse,
                  {
                    backgroundColor: isOpen ? hexToRgba(colorPalette.success, 0.12) : hexToRgba(colorPalette.danger, 0.12),
                    borderColor: isOpen ? hexToRgba(colorPalette.success, 0.25) : hexToRgba(colorPalette.danger, 0.25),
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <View
                  style={[
                    styles.heroStatusDot,
                    { backgroundColor: isOpen ? colorPalette.success : colorPalette.danger },
                  ]}
                />
                <Text
                  style={[
                    styles.heroStatusText,
                    { color: isOpen ? colorPalette.success : colorPalette.danger },
                  ]}
                >
                  {isOpen ? 'مفتوح الآن' : 'مغلق الآن'}
                </Text>
              </View>
            </View>
            {logoImage && (
              <View
                style={[
                  styles.heroLogoWrap,
                  {
                    backgroundColor: colorPalette.white,
                    borderColor: isDarkGlass ? hexToRgba(colorPalette.white, 0.1) : hexToRgba(colorPalette.black, 0.05),
                  },
                ]}
              >
                <Image source={logoImage} style={styles.heroLogoImage} />
              </View>
            )}
          </View>

          {/* Metrics Chips Row */}
          <View style={[styles.heroLuxuryMetricsRow, isRTL && styles.rowReverse]}>
            <View style={styles.metricsRowReverseFeather} pointerEvents="none">
              {reverseFeatherBands.map((band) => (
                <View
                  key={band.key}
                  style={[
                    styles.metricsRowReverseFeatherBand,
                    { bottom: band.bottom, backgroundColor: band.backgroundColor },
                  ]}
                />
              ))}
            </View>

            {hasBthwaniPro && (
              <View style={[styles.heroFeatureChip, styles.heroBadgePro]}>
                <Text style={styles.heroBadgeText}>برو</Text>
              </View>
            )}
            {distanceLabel && (
              <View
                style={[
                  styles.heroFeatureChip,
                  isRTL && styles.rowReverse,
                  { backgroundColor: isDarkGlass ? hexToRgba(colorPalette.white, 0.1) : hexToRgba(colorPalette.black, 0.04) },
                ]}
              >
                <Icon name="navigate-outline" size={12} color={appearanceChrome.secondaryText} />
                <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]}>{distanceLabel}</Text>
              </View>
            )}
            {deliveryTimeLabel && (
              <View
                style={[
                  styles.heroFeatureChip,
                  isRTL && styles.rowReverse,
                  { backgroundColor: isDarkGlass ? hexToRgba(colorPalette.white, 0.1) : hexToRgba(colorPalette.black, 0.04) },
                ]}
              >
                <Icon name="time-outline" size={12} color={appearanceChrome.secondaryText} />
                <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]}>{deliveryTimeLabel}</Text>
              </View>
            )}
            {rating !== undefined && (
              <View
                style={[
                  styles.heroFeatureChip,
                  isRTL && styles.rowReverse,
                  { backgroundColor: isDarkGlass ? hexToRgba(colorPalette.white, 0.1) : hexToRgba(colorPalette.black, 0.04) },
                ]}
              >
                <Icon name="star" size={12} color={GOLD} />
                <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]}>
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Delivery & Service Modes Tab Bar */}
          {deliveryModes.length > 0 && (
            <View
              style={[
                styles.heroLuxuryDeliveryRow,
                isRTL && styles.rowReverse,
                { backgroundColor: isDarkGlass ? hexToRgba(colorPalette.black, 0.2) : hexToRgba(colorPalette.black, 0.04) },
              ]}
            >
              {deliveryModes.map((mode) => {
                const active = selectedMode === mode.id;
                const isReadonly = serviceModesBehavior === 'readonly';
                const chip = (
                  <View
                    key={mode.id}
                    style={[
                      styles.heroLuxuryDeliveryChip,
                      active && !isReadonly && {
                        backgroundColor: isDarkGlass ? hexToRgba(colorPalette.white, 0.15) : colorPalette.white,
                      },
                      isReadonly && styles.heroLuxuryDeliveryChipReadonly,
                    ]}
                  >
                    <View style={[styles.heroLuxuryDeliveryContent, isRTL && styles.rowReverse]}>
                      <Text
                        style={[
                          styles.heroLuxuryDeliveryTitle,
                          { color: active && !isReadonly ? ORANGE : appearanceChrome.secondaryText },
                        ]}
                        numberOfLines={1}
                      >
                        {mode.label}
                      </Text>
                      <Icon
                        name={mode.icon}
                        size={14}
                        color={active && !isReadonly ? ORANGE : appearanceChrome.secondaryText}
                      />
                    </View>
                  </View>
                );
                if (isReadonly) {
                  return chip;
                }
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.heroLuxuryDeliveryChip,
                      active && {
                        backgroundColor: isDarkGlass ? hexToRgba(colorPalette.white, 0.15) : colorPalette.white,
                      },
                    ]}
                    onPress={() => onModeChange?.(mode.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.heroLuxuryDeliveryContent, isRTL && styles.rowReverse]}>
                      <Text
                        style={[
                          styles.heroLuxuryDeliveryTitle,
                          { color: active ? ORANGE : appearanceChrome.secondaryText },
                        ]}
                        numberOfLines={1}
                      >
                        {mode.label}
                      </Text>
                      <Icon
                        name={mode.icon}
                        size={14}
                        color={active ? ORANGE : appearanceChrome.secondaryText}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroPremiumWrap: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  heroCoverWrap: {
    height: 480,
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  heroCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroCoverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colorPalette.ink,
  },
  heroCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTopActions: {
    position: 'absolute',
    top: 32,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  heroTopActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroActionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  heroLuxuryCard: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
    gap: 16,
  },
  heroLuxuryIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroLuxuryInfo: {
    flex: 1,
    gap: 2,
  },
  heroLuxuryMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricsRowReverseFeather: {
    position: 'absolute',
    top: -16,
    bottom: -32,
    left: -32,
    right: -32,
    zIndex: -1,
  },
  metricsRowReverseFeatherBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  heroLuxuryDeliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 16,
    gap: 4,
  },
  heroLuxuryDeliveryChip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLuxuryDeliveryChipReadonly: {
    opacity: 0.72,
  },
  heroLuxuryDeliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroLuxuryDeliveryTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Outfit-Bold',
  },
  heroLogoWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colorPalette.brand,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.black,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroLogoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heroNameText: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Outfit-Bold',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroLocationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Outfit-Medium',
    fontWeight: '700',
  },
  heroStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
    marginTop: 4,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroStatusText: {
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Outfit-Bold',
  },
  heroFeatureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    minHeight: 32,
  },
  heroFeatureValue: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Outfit-Bold',
  },
  heroBadgePro: {
    backgroundColor: colorPalette.infoStrong,
    borderColor: 'transparent',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: colorPalette.white,
    fontFamily: 'Outfit-Bold',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  heroCoverFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    overflow: 'hidden',
  },
  heroCoverFadeBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentBlock: {
    marginTop: -140,
    paddingBottom: 8,
  },
});
