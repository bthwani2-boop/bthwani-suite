// KNZ Home Screen - Complete Design with Images & design seed (+ optional API counts via knz_home_get)
// Surface: app-client | Service: knz
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Strong, Clean, Organized - Similar to DSH Home with BTHWANI Colors + Images

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { rawFetch } from '@bthwani/api-clients';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_CATEGORIES, KNZ_YEMEN_CITY_KEYS, KNZ_LISTING_TYPES, KNZ_CATEGORY_MOCK_COUNTS } from '../../shared/knz-constants';
import { resolveDevMediaUrl } from '../../../config';
import { buildKnzHomeMockData } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_home_get';
const NS_COMMON = 'knz.app-client.mobile.common';
const NS_LIST = 'knz.app-client.mobile.auto_knz_listings_list';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = BTHWANI_SPACING.md;
const CATEGORY_CARD_WIDTH = (SCREEN_WIDTH - BTHWANI_SPACING.contentH * 2 - GRID_GAP) / 2;
const BANNER_HEIGHT = 180;
const CATEGORY_ICONS: Record<string, string> = {
  vehicles: '🚗',
  real_estate: '🏠',
  services: '🛠️',
  home_garden: '🪑',
  electronics: '💻',
  jobs: '💼',
  family_kids: '👶',
  sports: '⚽',
  animals: '🐦',
  numbers_plates: '🔢',
  travel: '✈️',
  other: '📦',
};

export interface KnzBanner {
  id: string;
  title?: string;
  image_url?: string;
  description?: string;
  action_url?: string;
}

export interface KnzCategory {
  id: string;
  code: string;
  name: string;
  icon: string;
  screen: string;
  params?: Record<string, string>;
  isPopular?: boolean;
  count?: number;
}

export interface KnzFeaturedListing {
  id: string;
  title: string;
  price: number;
  category: string;
  categoryLabelAr: string;
  location: string;
  image_url?: string;
  condition: 'new' | 'used' | 'refurbished';
  seller: {
    name: string;
    verified: boolean;
  };
  rating?: number;
  deliveryAvailableFromSeller?: boolean;
  listingType?: string;
}

export interface KnzHomeData {
  total_listings?: number;
  favorites_count?: number;
  my_listings?: number;
  banners?: KnzBanner[];
  categories?: KnzCategory[];
  featuredListings?: KnzFeaturedListing[];
  recentListings?: KnzFeaturedListing[];
}

interface auto_knz_home_getProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
}

export const auto_knz_home_get: React.FC<auto_knz_home_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [homeData, setHomeData] = useState<KnzHomeData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerListRef = useRef<FlatList<KnzBanner>>(null);
  const bannerAutoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) {
        navigation.navigate(screen, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  const loadHomeData = useCallback(async () => {
    try {
      setState('loading');

      const mockData: KnzHomeData = buildKnzHomeMockData(t);

      // محاولة جلب عدّ الفئات الحقيقي من knz_home_get (إن توفر backend)
      try {
        const baseUrl = getBaseUrl();
        const res = await rawFetch(`${baseUrl}/api/knz/home`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          const apiCategories = json?.data?.categories as
            | Array<{ code?: string; name?: string; count?: number }>
            | undefined;
          if (Array.isArray(apiCategories)) {
            const counts: Record<string, number> = {};
            for (const cat of apiCategories) {
              if (cat?.code) {
                counts[cat.code] = typeof cat.count === 'number' ? cat.count : 0;
              }
            }
            if (mockData.categories) {
              mockData.categories = mockData.categories.map((c) =>
                c.code !== 'all'
                  ? { ...c, count: counts[c.code] ?? c.count }
                  : c,
              );
            }
          }
        }
      } catch {
        // في حال فشل النداء، نستمر ببيانات الـ mock بدون تغيير
      }

      setHomeData(mockData);
      setState('content');
    } catch (error) {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // بانر يتحرك أفقياً بشكل تلقائي — تمرير كل 3.5 ثانية
  useEffect(() => {
    const banners = homeData?.banners ?? [];
    if (banners.length <= 1) return;
    bannerAutoScrollInterval.current = setInterval(() => {
      setBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        bannerListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
    return () => {
      if (bannerAutoScrollInterval.current) {
        clearInterval(bannerAutoScrollInterval.current);
        bannerAutoScrollInterval.current = null;
      }
    };
  }, [homeData?.banners]);

  const onBannerScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const idx = Math.round(offset / SCREEN_WIDTH);
      if (idx >= 0 && homeData?.banners && idx < homeData.banners.length) {
        setBannerIndex(idx);
      }
    },
    [homeData?.banners]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData().finally(() => setRefreshing(false));
  }, [loadHomeData]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return semanticRoles.success;
      case 'used': return semanticRoles.warning;
      case 'refurbished': return semanticRoles.info;
      default: return semanticRoles.textMuted;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return t(`${NS_LIST}.conditionNew`);
      case 'used': return t(`${NS_LIST}.conditionUsed`);
      case 'refurbished': return t(`${NS_LIST}.conditionRefurbished`);
      default: return condition;
    }
  };

  const renderCategory = (category: KnzCategory) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => handleNavigate(category.screen, category.params)}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
      </View>
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryName, textAlignStart]} numberOfLines={1}>
          {category.name}
        </Text>
        {category.count != null && category.count > 0 && (
          <Text style={[styles.categoryCount, textAlignStart]}>
            {t(`${NS}.listingCount`, { count: category.count.toLocaleString('ar-SA') })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedListing = ({ item }: { item: KnzFeaturedListing }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => handleNavigate('KnzListingGet', { listingId: item.id })}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.featuredImage} resizeMode="cover" />
      ) : (
        <View style={[styles.featuredImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
          <Text style={{ fontSize: 32 }}>📷</Text>
        </View>
      )}
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>{t(`${NS}.featuredBadge`)}</Text>
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.featuredPrice}>{item.price.toLocaleString()} {t(`${NS}.currency`)}</Text>
        <View style={styles.featuredMeta}>
          <Text style={styles.featuredCategory}>📂 {item.categoryLabelAr}</Text>
          <Text style={styles.featuredLocation}>📍 {item.location}</Text>
        </View>
        {item.listingType && (
          <Text style={styles.typeBadge}>{KNZ_LISTING_TYPES.find((lt) => lt.code === item.listingType) ? t(KNZ_LISTING_TYPES.find((lt) => lt.code === item.listingType)!.labelKey) : item.listingType}</Text>
        )}
        {item.deliveryAvailableFromSeller && (
          <Text style={styles.deliveryBadge}>🚚 {t(`${NS}.deliveryFromSeller`)}</Text>
        )}
        <View style={styles.featuredFooter}>
          <View style={styles.sellerRow}>
            <Text style={styles.sellerName}>
              {item.seller.name} {item.seller.verified && '✅'}
            </Text>
            {item.rating && (
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            )}
          </View>
          <View style={[
            styles.conditionBadge,
            { backgroundColor: getConditionColor(item.condition) }
          ]}>
            <Text style={styles.conditionText}>
              {getConditionText(item.condition)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentListing = ({ item }: { item: KnzFeaturedListing }) => (
    <TouchableOpacity
      style={styles.recentCard}
      onPress={() => handleNavigate('KnzListingGet', { listingId: item.id })}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.recentImage} resizeMode="cover" />
      ) : (
        <View style={[styles.recentImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
          <Text style={{ fontSize: 24 }}>📷</Text>
        </View>
      )}
      <View style={styles.recentContent}>
        <Text style={styles.recentTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.recentPrice}>{item.price.toLocaleString()} {t(`${NS}.currency`)}</Text>
        <View style={styles.recentMeta}>
          <Text style={styles.recentCategory}>{item.categoryLabelAr}</Text>
          <Text style={styles.recentLocation}>📍 {item.location}</Text>
        </View>
        {item.listingType && (
          <Text style={styles.typeBadge}>{KNZ_LISTING_TYPES.find((lt) => lt.code === item.listingType) ? t(KNZ_LISTING_TYPES.find((lt) => lt.code === item.listingType)!.labelKey) : item.listingType}</Text>
        )}
        {item.deliveryAvailableFromSeller && (
          <Text style={styles.deliveryBadge}>🚚 {t(`${NS}.deliveryFromSeller`)}</Text>
        )}
        <View style={styles.recentFooter}>
          <Text style={styles.recentSeller}>
            {item.seller.name} {item.seller.verified && '✅'}
          </Text>
          <View style={[
            styles.conditionBadgeSmall,
            { backgroundColor: getConditionColor(item.condition) }
          ]}>
            <Text style={styles.conditionTextSmall}>
              {getConditionText(item.condition)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (state === 'content' && homeData) {
    return (
      <ScreenWrapper state="content">
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header: حسابي (يسار) ← كنز (وسط) ← مفضلة + محادثات (يمين) */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.headerAccountButton}
                onPress={() => handleNavigate('KnzAccount')}
                activeOpacity={0.7}
                accessibilityLabel={t(`${NS}.myAccount`)}
                accessibilityRole="button"
              >
                <Text style={styles.headerAccountIcon}>👤</Text>
                <Text style={styles.headerAccountLabel}>{t(`${NS}.accountLabel`)}</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t(`${NS}.headerTitleKnz`)}</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleNavigate('KnzFavoritesList')}
                >
                  <Text style={styles.iconText}>❤️</Text>
                  {homeData.favorites_count && homeData.favorites_count > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{homeData.favorites_count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleNavigate('KnzChatThreadList')}
                >
                  <Text style={styles.iconText}>💬</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* شريط بحث ثابت — نقرة واحدة → شاشة البحث */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => handleNavigate('KnzListingsSearch')}
            activeOpacity={0.7}
          >
            <Text style={styles.searchBarIcon}>🔍</Text>
            <Text style={styles.searchBarPlaceholder}>{t(`${NS}.searchPlaceholder`)}</Text>
          </TouchableOpacity>

          {/* اختصارات Chips — أحدث، الأكثر مشاهدة، السعر الأقل، قريب مني */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleNavigate('KnzListingsList', { sort: 'newest' })}
            >
              <Text style={styles.chipText}>{t(`${NS}.chipNewest`)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleNavigate('KnzListingsList', { sort: 'popular' })}
            >
              <Text style={styles.chipText}>{t(`${NS}.chipPopular`)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleNavigate('KnzListingsList', { sort: 'price_asc' })}
            >
              <Text style={styles.chipText}>{t(`${NS}.chipPriceAsc`)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleNavigate('KnzListingsList', { near_me: '1' })}
            >
              <Text style={styles.chipText}>{t(`${NS}.chipNearMe`)}</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* بانر يتحرك أفقياً بشكل تلقائي */}
          {homeData.banners && homeData.banners.length > 0 && (
            <View style={styles.bannerCarouselWrap}>
              <FlatList<KnzBanner>
                ref={bannerListRef}
                data={homeData.banners}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onBannerScroll}
                onScrollToIndexFailed={() => {}}
                keyExtractor={(item) => item.id}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.bannerSlide}
                    activeOpacity={1}
                    onPress={() => item.action_url && handleNavigate('KnzListingsList')}
                  >
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={styles.bannerSlideImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.bannerSlideImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
                        <Text style={{ fontSize: 48 }}>🖼️</Text>
                      </View>
                    )}
                    <View style={styles.bannerSlideOverlay}>
                      <Text style={styles.bannerSlideTitle}>{item.title}</Text>
                      {item.description ? (
                        <Text style={styles.bannerSlideDesc}>{item.description}</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                )}
              />
              {homeData.banners.length > 1 && (
                <View style={styles.bannerDots}>
                  {homeData.banners.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.bannerDot,
                      i === bannerIndex && styles.bannerDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* CTA واحد فقط: أضف إعلان */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryCTA}
              onPress={() => handleNavigate('KnzListingCreate')}
            >
              <Text style={styles.primaryCTAIcon}>➕</Text>
              <Text style={styles.primaryCTAText}>{t(`${NS}.addListing`)}</Text>
            </TouchableOpacity>
          </View>

          {/* التصنيفات — 4 بطاقات رئيسية تشبه اليمن مزاد */}
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t(`${NS}.categoriesTitle`)}</Text>
              <TouchableOpacity onPress={() => handleNavigate('KnzCategoriesList')}>
                <Text style={styles.seeAllText}>{t(`${NS}.seeAll`)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {homeData.categories?.slice(0, 4).map(renderCategory)}
            </View>
          </View>

          {/* Quick Access - Cart & Chat */}
          <View style={styles.quickAccessSection}>
            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => handleNavigate('KnzCartGet')}
            >
              <Text style={styles.quickAccessIcon}>🛒</Text>
              <Text style={styles.quickAccessLabel}>السلة</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => handleNavigate('KnzChatThreadList')}
            >
              <Text style={styles.quickAccessIcon}>💬</Text>
              <Text style={styles.quickAccessLabel}>المحادثات</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => handleNavigate('KnzListingsSearch')}
            >
              <Text style={styles.quickAccessIcon}>🔍</Text>
              <Text style={styles.quickAccessLabel}>البحث</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => handleNavigate('KnzAuctionsList')}
            >
              <Text style={styles.quickAccessIcon}>🔨</Text>
              <Text style={styles.quickAccessLabel}>مزاد أونلاين</Text>
            </TouchableOpacity>
          </View>

          {/* Featured Listings */}
          {homeData.featuredListings && homeData.featuredListings.length > 0 && (
            <View style={styles.featuredSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>إعلانات مميزة</Text>
                <TouchableOpacity onPress={() => handleNavigate('KnzListingsList')}>
                  <Text style={styles.seeAllText}>عرض الكل</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={homeData.featuredListings}
                renderItem={renderFeaturedListing}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScroll}
              />
            </View>
          )}

          {/* Recent Listings */}
          {homeData.recentListings && homeData.recentListings.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t(`${NS}.recentSectionTitle`)}</Text>
                <TouchableOpacity onPress={() => handleNavigate('KnzListingsList')}>
                  <Text style={styles.seeAllText}>عرض الكل</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={homeData.recentListings}
                renderItem={renderRecentListing}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentScroll}
              />
            </View>
          )}

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('KnzListingsList')}>
              <Text style={styles.statValue}>{homeData.total_listings?.toLocaleString()}</Text>
              <Text style={styles.statLabel}>{t(`${NS}.statLabelAvailable`)}</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('KnzFavoritesList')}>
              <Text style={styles.statValue}>{homeData.favorites_count}</Text>
              <Text style={styles.statLabel}>في المفضلة</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleNavigate('KnzMyListings')}>
              <Text style={styles.statValue}>{homeData.my_listings}</Text>
              <Text style={styles.statLabel}>{t(`${NS}.statLabelMyListings`)}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_home_get.loadingMessage')}
      errorMessage={t('surfaces.فشل_في_تحميل_الصفحة_الرئيسية')}
      onErrorAction={loadHomeData}
      screenName="auto_knz_home_get"
      operationName="knz_home_get"
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
  headerSpacer: {
    width: 48,
  },
  headerAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    minWidth: 72,
  },
  headerAccountIcon: {
    fontSize: 18,
    marginStart: BTHWANI_SPACING.xs,
  },
  headerAccountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
  },
  iconButton: {
    position: 'relative',
    padding: BTHWANI_SPACING.sm,
  },
  iconText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    end: 0,
    backgroundColor: semanticRoles.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: semanticRoles.surface,
    fontSize: 10,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  searchBarIcon: {
    fontSize: 18,
    marginStart: BTHWANI_SPACING.sm,
  },
  searchBarPlaceholder: {
    fontSize: 15,
    color: semanticRoles.textMuted,
  },
  chipsContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  chip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  chipText: {
    fontSize: 13,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  ctaSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  primaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    gap: BTHWANI_SPACING.sm,
  },
  primaryCTAIcon: {
    fontSize: 20,
  },
  primaryCTAText: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
  },
  categoriesGrid: {
    flexDirection: 'column',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
  },
  bannerCarouselWrap: {
    marginTop: BTHWANI_SPACING.md,
    marginHorizontal: 0,
    height: BANNER_HEIGHT,
  },
  bannerSlide: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bannerSlideImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  bannerSlideOverlay: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    backgroundColor: 'BTHWANI_COLORS.overlayMid',
  },
  bannerSlideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.surface,
  },
  bannerSlideDesc: {
    fontSize: 12,
    color: semanticRoles.surface,
    opacity: 0.95,
    marginTop: 2,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    gap: 6,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: semanticRoles.border,
  },
  bannerDotActive: {
    backgroundColor: semanticRoles.primaryCTA,
    width: 8,
    height: 8,
    borderRadius: 4,
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
    backgroundColor: 'BTHWANI_COLORS.overlay',
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
  quickActionsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoriesSection: {
    marginTop: BTHWANI_SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  seeAllText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  categoryCard: {
    width: '100%',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  featuredSection: {
    marginTop: BTHWANI_SPACING.xl,
  },
  featuredScroll: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  featuredCard: {
    width: 280,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  featuredBadge: {
    position: 'absolute',
    top: BTHWANI_SPACING.md,
    end: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  featuredBadgeText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  featuredContent: {
    padding: BTHWANI_SPACING.md,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.sm,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  featuredCategory: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  featuredLocation: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  typeBadge: { fontSize: 11, color: semanticRoles.primaryCTA, fontWeight: '600', marginTop: BTHWANI_SPACING.xs },
  deliveryBadge: {
    fontSize: 11,
    color: semanticRoles.info,
    marginTop: BTHWANI_SPACING.xs,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  sellerRow: {
    flex: 1,
  },
  sellerName: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  rating: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  conditionBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  conditionText: {
    color: semanticRoles.surface,
    fontSize: 10,
    fontWeight: '600',
  },
  quickAccessSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.lg,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    marginHorizontal: BTHWANI_SPACING.xs,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAccessIcon: {
    fontSize: 28,
    marginBottom: BTHWANI_SPACING.xs,
  },
  quickAccessLabel: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentSection: {
    marginTop: BTHWANI_SPACING.xl,
  },
  recentScroll: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  recentCard: {
    width: 200,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentImage: {
    width: '100%',
    height: 120,
  },
  recentContent: {
    padding: BTHWANI_SPACING.md,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  recentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  recentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  recentCategory: {
    fontSize: 11,
    color: semanticRoles.textMuted,
  },
  recentLocation: {
    fontSize: 11,
    color: semanticRoles.textMuted,
  },
  recentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xs,
  },
  recentSeller: {
    fontSize: 11,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  conditionBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  conditionTextSmall: {
    color: semanticRoles.surface,
    fontSize: 9,
    fontWeight: '600',
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
});

export default auto_knz_home_get;

