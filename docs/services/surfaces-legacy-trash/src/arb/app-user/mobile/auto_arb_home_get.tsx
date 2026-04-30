// ARB Home Screen — ARB_UX_SPEC_FINAL
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content
// سلايدر فئات، عروض مختارة أفقية، حجوزات حديثة — نقرة واحدة للوصول

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import {
  buildArbHomeMock,
  type ArbBanner,
  type ArbHomeData,
  type ArbRecentBooking,
  type FeaturedOffer,
} from '../../hooks';
import {
  ArbCategoryPill,
  ArbOfferCard,
  ArbHorizontalSlider,
  ArbPrimaryCTA,
  ArbBottomSheet,
} from '../components';
import {
  ServiceShortsPreviewRail,
  ServiceShortsFullscreenViewer,
  getShortsFeed,
  resolveShortCtaToNavigation,
} from '../../../shorts';
import { resolveDevMediaUrl } from '../../../config';
import type { ServiceShortItem } from '@bthwani/domain-types';

const ARB_SHORTS_PLACEMENT = 'arb_home_below_hero';
const ARB_SHORTS_PLACEMENT_2 = 'arb_home_after_featured';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ArbCategory {
  id: string;
  name: string;
  icon: string;
}

interface auto_arb_home_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_arb_home_get: React.FC<auto_arb_home_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [homeData, setHomeData] = useState<ArbHomeData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>('accommodation');
  const [categoriesSheetVisible, setCategoriesSheetVisible] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [featuredOfferSheet, setFeaturedOfferSheet] = useState<FeaturedOffer | null>(null);
  const { t, isRTL } = useI18n();
  const [shortsItems, setShortsItems] = useState<ServiceShortItem[]>([]);
  const [shortsLoading, setShortsLoading] = useState(true);
  const [shortsViewerVisible, setShortsViewerVisible] = useState(false);
  const [shortsViewerIndex, setShortsViewerIndex] = useState(0);
  const [shortsViewerItems, setShortsViewerItems] = useState<ServiceShortItem[]>([]);
  const [shortsViewerPlacementId, setShortsViewerPlacementId] = useState(ARB_SHORTS_PLACEMENT);
  const [shortsItemsAfterFeatured, setShortsItemsAfterFeatured] = useState<ServiceShortItem[]>([]);
  const [shortsLoadingAfterFeatured, setShortsLoadingAfterFeatured] = useState(true);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        (navigation.navigate as (s: string, p?: Record<string, unknown>) => void)(screen, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    if (state !== 'content') return;
    setShortsLoading(true);
    setShortsLoadingAfterFeatured(true);
    setShortsItems(getShortsFeed('ARB', ARB_SHORTS_PLACEMENT));
    setShortsItemsAfterFeatured(getShortsFeed('ARB', ARB_SHORTS_PLACEMENT_2));
    setShortsLoading(false);
    setShortsLoadingAfterFeatured(false);
  }, [state]);

  const loadHomeData = useCallback(async () => {
    try {
      setState('loading');
      await new Promise(resolve => setTimeout(resolve, 1500));

      setHomeData(buildArbHomeMock(t));
      setState('content');
    } catch (error) {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData().finally(() => setRefreshing(false));
  }, [loadHomeData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return semanticRoles.success;
      case 'pending':
        return semanticRoles.warning;
      case 'cancelled':
        return semanticRoles.error;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t('surfaces.arb_status_confirmed');
      case 'pending':
        return t('surfaces.arb_status_pending');
      case 'cancelled':
        return t('surfaces.arb_status_cancelled');
      default:
        return status;
    }
  };

  const categories: ArbCategory[] = [
    { id: 'accommodation', name: t('surfaces.arb_category_accommodation'), icon: '🏨' },
    { id: 'chalets', name: t('surfaces.arb_category_chalets_resorts'), icon: '🏝️' },
    { id: 'halls', name: t('surfaces.arb_category_halls'), icon: '🎉' },
    { id: 'institutes', name: t('surfaces.arb_category_institutes'), icon: '📚' },
    { id: 'artists', name: t('surfaces.arb_category_artists'), icon: '🎤' },
  ];

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // يمكن لاحقاً ربط الفلترة فعلياً بقائمة العروض في ArbOffersSearch
  };

  const handleBannerScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (SCREEN_WIDTH - BTHWANI_SPACING.contentH * 2));
    if (!Number.isNaN(index)) {
      setActiveBannerIndex(index);
    }
  };

  if (state === 'content' && homeData) {
    return (
      <ScreenWrapper state='content'>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>{t('surfaces.arb_header_title')}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleNavigate('ArbOffersSearch')}
                  hitSlop={{ top: 12, bottom: 12, [isRTL ? 'right' : 'left']: 12, [isRTL ? 'left' : 'right']: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel={t('surfaces.arb_search_offers')}
                >
                  <Text style={styles.iconText}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleNavigate('ArbBookingsList')}
                  hitSlop={{ top: 12, bottom: 12, [isRTL ? 'right' : 'left']: 12, [isRTL ? 'left' : 'right']: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel={t('surfaces.arb_my_bookings')}
                >
                  <Text style={styles.iconText}>📋</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* سلايدر فئات أفقي — ArbCategoryPill */}
          <View style={styles.categoryTabsContainer}>
            <ArbHorizontalSlider>
              {categories.map(category => (
                <ArbCategoryPill
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  active={category.id === selectedCategoryId}
                  onPress={() => handleCategoryPress(category.id)}
                />
              ))}
              <TouchableOpacity
                style={styles.allCategoriesButton}
                onPress={() => setCategoriesSheetVisible(true)}
                hitSlop={{ top: 6, bottom: 6, [isRTL ? 'right' : 'left']: 6, [isRTL ? 'left' : 'right']: 6 }}
                accessibilityLabel={t('surfaces.arb_all_categories')}
              >
                <Text style={styles.allCategoriesText}>{t('surfaces.arb_all_categories')}</Text>
              </TouchableOpacity>
            </ArbHorizontalSlider>
          </View>

          {/* عروض مختارة لك — أولاً للمحتوى (أسهل تجربة) */}
          {homeData.featuredOffers && homeData.featuredOffers.length > 0 && (
            <View style={styles.featuredSection}>
              <Text style={[styles.sectionTitle, styles.featuredSectionTitle]}>{t('surfaces.arb_featured_offers')}</Text>
              <ArbHorizontalSlider>
                {homeData.featuredOffers.map(offer => (
                  <ArbOfferCard
                    key={offer.id}
                    id={offer.id}
                    title={offer.title}
                    location={offer.location}
                    price={offer.price}
                    imageUrl={offer.imageUrl}
                    rating={offer.rating}
                    reviews={offer.reviews}
                    variant="horizontal"
                    cardWidth={280}
                    onPress={() => setFeaturedOfferSheet(offer)}
                  />
                ))}
              </ArbHorizontalSlider>
            </View>
          )}

          {/* Service Shorts — rail after featured (Phase 2) */}
          <ServiceShortsPreviewRail
            items={shortsItemsAfterFeatured}
            state={shortsLoadingAfterFeatured ? 'loading' : shortsItemsAfterFeatured.length > 0 ? 'content' : 'empty'}
            sectionTitle={t('marketing.sec_shorts')}
            placementId={ARB_SHORTS_PLACEMENT_2}
            onCardPress={(_, index) => {
              setShortsViewerItems(shortsItemsAfterFeatured);
              setShortsViewerPlacementId(ARB_SHORTS_PLACEMENT_2);
              setShortsViewerIndex(index);
              setShortsViewerVisible(true);
            }}
          />

          {/* Hero Carousel */}
          {homeData.banners && homeData.banners.length > 0 && (
            <View style={styles.bannerCarouselWrapper}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleBannerScroll}
                scrollEventThrottle={16}
              >
                {homeData.banners.map((banner, index) => (
                  <View key={banner.id} style={styles.bannerContainer}>
                    {banner.image_url ? (
                      <Image
                        source={{ uri: banner.image_url }}
                        style={styles.bannerImage}
                        resizeMode='cover'
                      />
                    ) : (
                      <View style={[styles.bannerImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
                        <Text style={{ fontSize: 40 }}>🖼️</Text>
                      </View>
                    )}
                    <View style={styles.bannerOverlay}>
                      <Text style={styles.bannerTitle}>{banner.title}</Text>
                      <Text style={styles.bannerDescription}>
                        {banner.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              {homeData.banners.length > 1 && (
                <View style={styles.bannerDotsRow}>
                  {homeData.banners.map((banner, index) => (
                    <View
                      key={banner.id}
                      style={[
                        styles.bannerDot,
                        index === activeBannerIndex && styles.bannerDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Service Shorts — rail below hero (Phase 1) */}
          <ServiceShortsPreviewRail
            items={shortsItems}
            state={shortsLoading ? 'loading' : shortsItems.length > 0 ? 'content' : 'empty'}
            sectionTitle={t('marketing.sec_shorts')}
            placementId={ARB_SHORTS_PLACEMENT}
            onCardPress={(_, index) => {
              setShortsViewerItems(shortsItems);
              setShortsViewerPlacementId(ARB_SHORTS_PLACEMENT);
              setShortsViewerIndex(index);
              setShortsViewerVisible(true);
            }}
          />
          <ServiceShortsFullscreenViewer
            visible={shortsViewerVisible}
            items={shortsViewerItems.length > 0 ? shortsViewerItems : shortsItems}
            initialIndex={shortsViewerIndex}
            onClose={() => setShortsViewerVisible(false)}
            onCtaPress={(short) => {
              const { route_key, params } = resolveShortCtaToNavigation(short);
              handleNavigate(route_key, params);
              setShortsViewerVisible(false);
            }}
            language={isRTL ? 'ar' : 'en'}
            placementId={shortsViewerPlacementId}
          />

          {/* إحصائيات مدمجة — هوية هادئة */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{homeData.active_bookings}</Text>
              <Text style={styles.statLabel}>{t('surfaces.arb_stat_active')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{homeData.total_bookings}</Text>
              <Text style={styles.statLabel}>{t('surfaces.arb_stat_total_bookings')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {homeData.total_spent?.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>{t('surfaces.arb_currency_sar')}</Text>
            </View>
          </View>

          {/* وصول سريع — روابط نصية فقط + CTA واحد (بدون أيقونات ملونة) */}
          <View style={styles.quickAccessBar}>
            <ArbPrimaryCTA
              title={t('surfaces.arb_explore_offers')}
              onPress={() => handleNavigate('ArbOffersSearch')}
              fullWidth
            />
            <View style={styles.quickAccessLinks}>
              <TouchableOpacity
                onPress={() => handleNavigate('ArbBookingsList')}
                style={styles.quickAccessLink}
                hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
                accessibilityLabel={t('surfaces.arb_my_bookings')}
              >
                <Text style={styles.quickAccessLinkText}>{t('surfaces.arb_my_bookings')}</Text>
              </TouchableOpacity>
              <View style={styles.quickAccessDivider} />
              <TouchableOpacity
                onPress={() => handleNavigate('ArbAmendmentsList')}
                style={styles.quickAccessLink}
                hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
                accessibilityLabel={t('surfaces.arb_amendments')}
              >
                <Text style={styles.quickAccessLinkText}>{t('surfaces.arb_amendments')}</Text>
              </TouchableOpacity>
              <View style={styles.quickAccessDivider} />
              <TouchableOpacity
                onPress={() => handleNavigate('ArbBookingEscrowStatusGet')}
                style={styles.quickAccessLink}
                hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
                accessibilityLabel={t('surfaces.arb_escrow_status')}
              >
                <Text style={styles.quickAccessLinkText}>{t('surfaces.arb_escrow_status')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* حجوزات حديثة — مع حالة فارغة واضحة */}
          <View style={styles.recentBookingsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('surfaces.arb_recent_bookings')}</Text>
              <TouchableOpacity
                onPress={() => handleNavigate('ArbBookingsList')}
hitSlop={{ top: 10, bottom: 10, [isRTL ? 'right' : 'left']: 10, [isRTL ? 'left' : 'right']: 10 }}
              accessibilityLabel={t('surfaces.arb_see_all_bookings')}
              >
                <Text style={styles.seeAllText}>{t('surfaces.arb_see_all')}</Text>
              </TouchableOpacity>
            </View>
            {homeData.recentBookings && homeData.recentBookings.length > 0 ? (
              <>
              {homeData.recentBookings.map(booking => (
                <TouchableOpacity
                  key={booking.id}
                  style={styles.premiumBookingCard}
                  onPress={() => handleNavigate('ArbBookingGet')}
                  activeOpacity={0.78}
                  accessibilityLabel={`حجز ${booking.property}، ${getStatusText(booking.status)}`}
                >
                  {resolveDevMediaUrl('products/arb/prod_0001.jpg') ? (
                    <Image
                      source={{ uri: resolveDevMediaUrl('products/arb/prod_0001.jpg') }}
                      style={styles.premiumBookingImage}
                      resizeMode='cover'
                    />
                  ) : (
                    <View style={[styles.premiumBookingImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
                      <Text style={{ fontSize: 32 }}>🏠</Text>
                    </View>
                  )}
                  <View style={styles.premiumBookingContent}>
                    <View style={styles.premiumBookingTop}>
                      <View style={styles.premiumBookingInfo}>
                        <Text
                          style={styles.premiumBookingProperty}
                          numberOfLines={1}
                        >
                          {booking.property}
                        </Text>
                        <Text style={styles.premiumBookingId}>
                          {booking.id}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.premiumStatusBadge,
                          { backgroundColor: getStatusColor(booking.status) },
                        ]}
                      >
                        <Text style={styles.premiumStatusText}>
                          {getStatusText(booking.status)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.premiumBookingBottom}>
                      <Text style={styles.premiumBookingDate}>
                        📅 {booking.checkIn} — {booking.checkOut}
                      </Text>
                      {booking.total > 0 && (
                        <Text style={styles.premiumBookingPrice}>
                          {booking.total.toLocaleString()} {t('surfaces.arb_currency_sar')}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              </>
            ) : (
              <View style={styles.recentBookingsEmpty}>
                <Text style={styles.recentBookingsEmptyText}>{t('surfaces.arb_no_recent')}</Text>
                <Text style={styles.recentBookingsEmptyHint}>{t('surfaces.arb_explore_hint')}</Text>
                <TouchableOpacity
                  style={styles.recentBookingsEmptyButton}
                  onPress={() => handleNavigate('ArbOffersSearch')}
                >
                  <Text style={styles.recentBookingsEmptyButtonText}>{t('surfaces.arb_explore_offers')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sheet تفاصيل عرض مختار — CTA واحد {t('arb.app-client.mobile.auto_arb_home_get.bookNow')} */}
        <ArbBottomSheet
          visible={featuredOfferSheet !== null}
          onClose={() => setFeaturedOfferSheet(null)}
          title={featuredOfferSheet?.title}
        >
          {featuredOfferSheet ? (
            <>
              <Text style={[styles.sheetLocation, { textAlign: isRTL ? 'right' : 'left' }]}>📍 {featuredOfferSheet.location}</Text>
              {featuredOfferSheet.rating != null && (
                <Text style={[styles.sheetRating, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {featuredOfferSheet.rating} ({featuredOfferSheet.reviews} {t('surfaces.arb_reviews')})
                </Text>
              )}
              <Text style={[styles.sheetPrice, { textAlign: isRTL ? 'right' : 'left' }]}>{featuredOfferSheet.price}</Text>
              <Text style={[styles.sheetPolicyHint, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('surfaces.arb_policy_hint')}
              </Text>
              <ArbPrimaryCTA
                title={t('surfaces.arb_book_now')}
                onPress={() => {
                  setFeaturedOfferSheet(null);
                  handleNavigate('ArbBookingCreate');
                }}
              />
            </>
          ) : null}
        </ArbBottomSheet>

        {/* All Categories Sheet */}
        <Modal
          visible={categoriesSheetVisible}
          animationType='slide'
          transparent
          onRequestClose={() => setCategoriesSheetVisible(false)}
        >
          <View style={styles.categoriesModalBackdrop}>
            <View style={styles.categoriesModalContent}>
              <View style={styles.categoriesModalHeader}>
                <Text style={styles.categoriesModalTitle}>{t('surfaces.arb_all_categories')}</Text>
                <TouchableOpacity
                  onPress={() => setCategoriesSheetVisible(false)}
                >
                  <Text style={styles.categoriesModalClose}>{t('common.close')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoriesGrid}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryGridItem}
                    onPress={() => {
                      handleCategoryPress(category.id);
                      setCategoriesSheetVisible(false);
                      handleNavigate('ArbOffersSearch');
                    }}
                  >
                    <View style={styles.categoryGridIconCircle}>
                      <Text style={styles.categoryGridIcon}>
                        {category.icon}
                      </Text>
                    </View>
                    <Text style={styles.categoryGridLabel}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.arb_loading_home')}
      errorMessage={t('surfaces.arb_error_home')}
      onErrorAction={loadHomeData}
      screenName='auto_arb_home_get'
      operationName='arb_home_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
  },
  iconButton: {
    padding: BTHWANI_SPACING.sm,
  },
  iconText: {
    fontSize: 24,
  },
  categoryTabsContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
  },
  categoryTabsScroll: {
    alignItems: 'center',
    paddingBottom: BTHWANI_SPACING.sm,
  },
  categoryTab: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    marginEnd: BTHWANI_SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  categoryTabIcon: {
    fontSize: 16,
    marginStart: BTHWANI_SPACING.xs,
  },
  categoryTabIconActive: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
  },
  categoryTabLabel: {
    fontSize: 13,
    color: semanticRoles.onSurface,
  },
  categoryTabLabelActive: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontWeight: '600',
  },
  allCategoriesButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginEnd: BTHWANI_SPACING.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  allCategoriesText: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
  },
  bannerCarouselWrapper: {
    marginTop: BTHWANI_SPACING.md,
  },
  bannerContainer: {
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    backgroundColor: 'BTHWANI_COLORS.overlay55',
    padding: BTHWANI_SPACING.contentH,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.surface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  bannerDescription: {
    fontSize: 14,
    color: semanticRoles.surface,
    opacity: 0.9,
  },
  bannerDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.sm,
    marginTop: -BTHWANI_SPACING.md,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: semanticRoles.border,
    marginHorizontal: BTHWANI_SPACING.xs,
  },
  bannerDotActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: semanticRoles.border,
    marginHorizontal: BTHWANI_SPACING.contentH,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  quickAccessBar: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  quickAccessLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.xs,
  },
  quickAccessLink: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
  },
  quickAccessLinkText: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    fontWeight: '500',
  },
  quickAccessDivider: {
    width: 1,
    height: 14,
    backgroundColor: semanticRoles.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  featuredSection: {
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  featuredSectionTitle: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  sheetLocation: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  sheetRating: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  sheetPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.md,
  },
  sheetPolicyHint: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  recentBookingsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  recentBookingsEmpty: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  recentBookingsEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
  recentBookingsEmptyHint: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  recentBookingsEmptyButton: {
    marginTop: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
  },
  recentBookingsEmptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  seeAllText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  bookingProperty: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  bookingDates: {
    marginBottom: BTHWANI_SPACING.xs,
  },
  bookingDate: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  bookingTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginTop: BTHWANI_SPACING.xs,
  },
  // Premium Booking Card Styles (Inspired by Delivery Apps)
  premiumBookingCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  premiumBookingImage: {
    width: '100%',
    height: 160,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  premiumBookingContent: {
    padding: BTHWANI_SPACING.md,
  },
  premiumBookingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  premiumBookingInfo: {
    flex: 1,
  },
  premiumBookingProperty: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  premiumBookingId: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    fontWeight: '500',
  },
  premiumStatusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginStart: BTHWANI_SPACING.sm,
  },
  premiumStatusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  premiumBookingBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumBookingDate: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    flex: 1,
  },
  premiumBookingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginStart: BTHWANI_SPACING.sm,
  },
  categoriesModalBackdrop: {
    flex: 1,
    backgroundColor: 'BTHWANI_COLORS.overlay40',
    justifyContent: 'flex-end',
  },
  categoriesModalContent: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  categoriesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  categoriesModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.onSurface,
  },
  categoriesModalClose: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryGridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  categoryGridIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  categoryGridIcon: {
    fontSize: 24,
  },
  categoryGridLabel: {
    fontSize: 12,
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
});

export default auto_arb_home_get;

