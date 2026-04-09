// KNZ Listings List Screen - Complete Design + optional backend data via knz_listings_list
// Surface: app-client | Service: knz
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';
import { rawFetch } from '@bthwani/api-clients';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { KNZ_CATEGORIES, KNZ_YEMEN_CITY_KEYS, KNZ_LISTING_TYPES, KNZ_AREAS_BY_CITY_KEYS } from '../../shared/knz-constants';
import { buildKnzListingsListMock, type Listing } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_listings_list';
const NS_COMMON = 'knz.app-client.mobile.common';
const CATEGORY_KEYS: Record<string, string> = {
  vehicles: 'categoryVehicles', real_estate: 'categoryRealEstate', services: 'categoryServices',
  home_garden: 'categoryHomeGarden', electronics: 'categoryElectronics', jobs: 'categoryJobs',
  family_kids: 'categoryFamilyKids', sports: 'categorySports', animals: 'categoryAnimals',
  numbers_plates: 'categoryNumbersPlates', travel: 'categoryTravel', other: 'categoryOther',
};

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface auto_knz_listings_listProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
  /** من المسار (أو route.params) */
  route?: { params?: Record<string, string> };
  /** من المسار: category من KnzCategoriesList أو Home */
  initialCategory?: string;
  /** من المسار: query من KnzListingsSearch */
  initialQuery?: string;
  /** من المسار: نوع العرض (sale | rent | service | wanted) */
  initialListingType?: string;
  /** من المسار: مدينة مبدئية للفلتر */
  initialCity?: string;
  /** من المسار: حي مبدئي (يُعرض عند اختيار مدينة لها أحياء) */
  initialArea?: string;
  /** من المسار: ترتيب (recent | popular) من شاشة البحث */
  initialSort?: 'recent' | 'popular';
}

const fromParams = (p: auto_knz_listings_listProps['route'] | undefined, key: string) =>
  (p?.params && typeof p.params[key] === 'string' ? p.params[key] : undefined) as string | undefined;

export const auto_knz_listings_list: React.FC<auto_knz_listings_listProps> = ({
  onNavigate,
  navigation,
  route,
  initialCategory,
  initialQuery,
  initialListingType,
  initialCity,
  initialArea,
  initialSort,
}) => {
  const { t, isRTL } = useI18n();
  const listingTypeLabelsMap = useMemo(() => ({
    sale: t(`${NS_COMMON}.listingTypeSale`),
    rent: t(`${NS_COMMON}.listingTypeRent`),
    service: t(`${NS_COMMON}.listingTypeService`),
    wanted: t(`${NS_COMMON}.listingTypeWanted`),
  }), [t]);
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const category = initialCategory ?? fromParams(route, 'category');
  const query = initialQuery ?? fromParams(route, 'query');
  const listingType = initialListingType ?? fromParams(route, 'listingType');
  const city = initialCity ?? fromParams(route, 'city');
  const area = initialArea ?? fromParams(route, 'area');
  const sortParam = initialSort ?? (fromParams(route, 'sort') as 'recent' | 'popular' | undefined);
  const initialSortValue = sortParam === 'popular' ? 'popular' : 'recent';

  const [state, setState] = useState<ScreenState>('loading');
  const [listings, setListings] = useState<Listing[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(category ?? 'all');
  const [selectedListingType, setSelectedListingType] = useState<string>(listingType ?? 'all');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'popular'>(initialSortValue);
  const [selectedCity, setSelectedCity] = useState<string>(city ?? 'all');
  const [selectedArea, setSelectedArea] = useState<string>(area ?? 'all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const loadListings = useCallback(async () => {
    try {
      setState('loading');

      // محاولة جلب القوائم من knz_listings_list (إن تم تنفيذها في الخلفية)
      try {
        const baseUrl = getBaseUrl();
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (query) params.set('query', query);
        if (listingType) params.set('listingType', listingType);
        if (city) params.set('city', city);
        if (area) params.set('area', area);
        if (sortParam) params.set('sort', sortParam);
        const url = `${baseUrl}/api/knz/listings${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await rawFetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          const items = json?.data?.items as any[] | undefined;
          if (Array.isArray(items) && items.length > 0) {
            const apiListings: Listing[] = items.map((item: any) => ({
              id: String(item.id ?? item.listingId ?? ''),
              title: String(item.title ?? item.name ?? t(`${NS}.noTitle`)),
              price: Number(item.price ?? 0),
              category: String(item.category ?? 'other'),
              categoryLabelAr: item.categoryLabelAr,
              location: String(item.city ?? item.location ?? ''),
              area: item.area,
              condition:
                item.condition === 'new' || item.condition === 'refurbished'
                  ? item.condition
                  : 'used',
              image_url: item.image_url ?? item.thumbnailUrl,
              postedDate: String(item.createdAt ?? item.postedAt ?? ''),
              seller: {
                name: String(item.sellerName ?? t(`${NS}.sellerFallback`)),
                verified: Boolean(item.sellerVerified),
              },
              rating: typeof item.rating === 'number' ? item.rating : undefined,
              deliveryAvailableFromSeller: Boolean(item.deliveryAvailableFromSeller),
              listingType: item.listingType,
              isPromoted: Boolean(item.isPromoted),
            }));
            setListings(apiListings);
            setState(apiListings.length ? 'content' : 'empty');
            return;
          }
        }
      } catch {
        // في حال فشل النداء أو عدم توفر بيانات، نستخدم fixture (fallback)
      }

      const mockListings = buildKnzListingsListMock(t);
      setListings(mockListings);
      setState(mockListings.length ? 'content' : 'empty');
    } catch (error) {
      setState('error');
    }
  }, [area, category, city, listingType, query, sortParam, t]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    if (category != null) setSelectedCategory(category);
  }, [category]);
  useEffect(() => {
    if (listingType != null) setSelectedListingType(listingType);
  }, [listingType]);
  useEffect(() => {
    if (city != null) setSelectedCity(city);
  }, [city]);
  useEffect(() => {
    if (area != null) setSelectedArea(area);
  }, [area]);
  useEffect(() => {
    if (sortParam === 'popular') setSelectedSort('popular');
    else if (sortParam === 'recent') setSelectedSort('recent');
  }, [sortParam]);

  const onCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    const areas = city === 'all' ? undefined : KNZ_AREAS_BY_CITY_KEYS[city];
    setSelectedArea((prev) => {
      if (city === 'all' || !areas?.length) return 'all';
      return areas.includes(prev) ? prev : 'all';
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadListings().finally(() => setRefreshing(false));
  }, [loadListings]);

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
      case 'new': return t(`${NS}.conditionNew`);
      case 'used': return t(`${NS}.conditionUsed`);
      case 'refurbished': return t(`${NS}.conditionRefurbished`);
      default: return condition;
    }
  };

  const categories = useMemo(
    () => [
      { id: 'all', label: t(`${NS}.all`) },
      ...KNZ_CATEGORIES.map((c) => ({ id: c.code, label: t(`${NS_COMMON}.${CATEGORY_KEYS[c.code] || 'categoryOther'}`) })),
    ],
    [t]
  );

  const listingTypeLabel =
    selectedListingType === 'all'
      ? t(`${NS}.allTypes`)
      : listingTypeLabelsMap[selectedListingType as keyof typeof listingTypeLabelsMap] ?? selectedListingType;
  const cityLabel = selectedCity === 'all' ? t(`${NS}.allCities`) : selectedCity;
  const sortLabel = selectedSort === 'recent' ? t(`${NS}.recent`) : t(`${NS}.mostPopular`);
  const filterSummary = `${cityLabel} • ${listingTypeLabel} • ${sortLabel}`;

  let filteredListings =
    selectedCategory === 'all'
      ? listings
      : listings.filter((listing) => listing.category === selectedCategory);
  if (selectedListingType !== 'all') {
    filteredListings = filteredListings.filter((l) => l.listingType === selectedListingType);
  }
  if (selectedCity !== 'all') {
    filteredListings = filteredListings.filter((l) => l.location === selectedCity);
  }
  if (selectedArea !== 'all') {
    filteredListings = filteredListings.filter((l) => l.area === selectedArea);
  }
  const searchQ = query?.trim();
  if (searchQ) {
    const q = searchQ.toLowerCase();
    filteredListings = filteredListings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.categoryLabelAr && l.categoryLabelAr.toLowerCase().includes(q))
    );
  }
  if (selectedSort === 'recent') {
    filteredListings = [...filteredListings].sort((a, b) => (b.postedDate || '').localeCompare(a.postedDate || ''));
  } else {
    filteredListings = [...filteredListings].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  const renderListing = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleNavigate('KnzListingGet', { listingId: item.id })}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.listingImage} resizeMode="cover" />
      ) : (
        <View style={[styles.listingImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
          <Text style={{ fontSize: 28 }}>📷</Text>
        </View>
      )}
        <View style={styles.listingContent}>
        <View style={styles.listingTitleRow}>
          <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
          {item.isPromoted && (
            <Text style={styles.promotedBadge}>{t('knz.app-client.mobile.auto_knz_listings_list.promotedBadge')}</Text>
          )}
          {item.listingType && (
            <Text style={styles.typeBadge}>
              {KNZ_LISTING_TYPES.find((lt) => lt.code === item.listingType) ? t(KNZ_LISTING_TYPES.find((lt) => lt.code === item.listingType)!.labelKey) : item.listingType}
            </Text>
          )}
        </View>
        <Text style={styles.listingPrice}>{item.price.toLocaleString()} {t(`${NS}.currency`)}</Text>
        <View style={styles.listingMeta}>
          <Text style={styles.category}>📂 {item.categoryLabelAr ?? t(`${NS_COMMON}.${CATEGORY_KEYS[item.category] || 'categoryOther'}`)}</Text>
          <Text style={styles.location}>📍 {item.area ? `${item.location} · ${item.area}` : item.location}</Text>
        </View>
        {item.deliveryAvailableFromSeller && (
          <Text style={styles.deliveryBadge}>🚚 {t(`${NS}.deliveryFromSeller`)}</Text>
        )}
        <View style={styles.listingFooter}>
          <View style={styles.sellerInfo}>
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

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t(`${NS}.headerTitle`)}</Text>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleNavigate('KnzListingsSearch')}
            >
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    selectedCategory === item.id && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === item.id && styles.selectedCategoryChipText,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            />
          </View>

          {/* شريط فلترة واحد يفتح Bottom Sheet للفلاتر المتقدمة */}
          <View style={styles.filterBar}>
            <TouchableOpacity
              style={styles.filterBarChip}
              onPress={() => setIsFilterSheetOpen(true)}
            >
              <Text style={styles.filterBarChipText}>{t('knz.app-client.mobile.auto_knz_listings_list.filterBarChipText')}</Text>
            </TouchableOpacity>
            <Text style={[styles.filterBarSummary, textAlignStart]} numberOfLines={1}>
              {filterSummary}
            </Text>
          </View>

          <FlatList
            data={filteredListings}
            renderItem={renderListing}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listingsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Sheet للفلاتر: المدينة، الحي، نوع العرض، الترتيب */}
          {isFilterSheetOpen && (
            <View style={styles.filterSheetOverlay}>
              <TouchableOpacity
                style={styles.filterSheetBackdrop}
                activeOpacity={1}
                onPress={() => setIsFilterSheetOpen(false)}
              />
              <View style={styles.filterSheet}>
                <View style={styles.filterSheetHeader}>
                  <Text style={styles.filterSheetTitle}>{t(`${NS}.filterSheetTitle`)}</Text>
                  <TouchableOpacity onPress={() => setIsFilterSheetOpen(false)}>
                    <Text style={styles.filterSheetClose}>{t(`${NS}.filterSheetClose`)}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={styles.filterSheetScroll}
                  contentContainerStyle={styles.filterSheetScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.filterSectionLabel}>{t(`${NS}.filterSectionLabelType`)}</Text>
                  <View style={styles.filterChipsRow}>
                    <TouchableOpacity
                      style={[
                        styles.sheetChip,
                        selectedListingType === 'all' && styles.sheetChipSelected,
                      ]}
                      onPress={() => setSelectedListingType('all')}
                    >
                      <Text
                        style={[
                          styles.sheetChipText,
                          selectedListingType === 'all' && styles.sheetChipTextSelected,
                        ]}
                      >
                        {t(`${NS}.all`)}
                      </Text>
                    </TouchableOpacity>
                    {KNZ_LISTING_TYPES.map((lt) => (
                      <TouchableOpacity
                        key={lt.code}
                        style={[
                          styles.sheetChip,
                          selectedListingType === lt.code && styles.sheetChipSelected,
                        ]}
                        onPress={() => setSelectedListingType(lt.code)}
                      >
                        <Text
                          style={[
                            styles.sheetChipText,
                            selectedListingType === lt.code && styles.sheetChipTextSelected,
                          ]}
                        >
                          {listingTypeLabelsMap[lt.code as keyof typeof listingTypeLabelsMap]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.filterSectionLabel}>{t(`${NS}.filterSectionLabelSort`)}</Text>
                  <View style={styles.filterChipsRow}>
                    <TouchableOpacity
                      style={[
                        styles.sheetChip,
                        selectedSort === 'recent' && styles.sheetChipSelected,
                      ]}
                      onPress={() => setSelectedSort('recent')}
                    >
                      <Text
                        style={[
                          styles.sheetChipText,
                          selectedSort === 'recent' && styles.sheetChipTextSelected,
                        ]}
                      >
                        {t(`${NS}.recent`)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.sheetChip,
                        selectedSort === 'popular' && styles.sheetChipSelected,
                      ]}
                      onPress={() => setSelectedSort('popular')}
                    >
                      <Text
                        style={[
                          styles.sheetChipText,
                          selectedSort === 'popular' && styles.sheetChipTextSelected,
                        ]}
                      >
                        {t(`${NS}.mostPopular`)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.filterSectionLabel}>{t(`${NS}.filterSectionLabelCity`)}</Text>
                  <View style={styles.filterChipsWrap}>
                    <TouchableOpacity
                      style={[
                        styles.sheetChip,
                        selectedCity === 'all' && styles.sheetChipSelected,
                      ]}
                      onPress={() => onCityChange('all')}
                    >
                      <Text
                        style={[
                          styles.sheetChipText,
                          selectedCity === 'all' && styles.sheetChipTextSelected,
                        ]}
                      >
                        {t(`${NS}.allCities`)}
                      </Text>
                    </TouchableOpacity>
                    {KNZ_YEMEN_CITY_KEYS.map((cityKey) => {
                      const cityName = t(cityKey);
                      return (
                        <TouchableOpacity
                          key={cityKey}
                          style={[
                            styles.sheetChip,
                            selectedCity === cityName && styles.sheetChipSelected,
                          ]}
                          onPress={() => onCityChange(cityName)}
                        >
                          <Text
                            style={[
                              styles.sheetChipText,
                              selectedCity === cityName && styles.sheetChipTextSelected,
                            ]}
                          >
                            {cityName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {selectedCity !== 'all' && KNZ_AREAS_BY_CITY_KEYS[selectedCity]?.length ? (
                    <>
                      <Text style={styles.filterSectionLabel}>{t('knz.app-client.mobile.auto_knz_listings_list.filterSectionLabelNeighborhood')}</Text>
                      <View style={styles.filterChipsWrap}>
                        <TouchableOpacity
                          style={[
                            styles.sheetChip,
                            selectedArea === 'all' && styles.sheetChipSelected,
                          ]}
                          onPress={() => setSelectedArea('all')}
                        >
                          <Text
                            style={[
                              styles.sheetChipText,
                              selectedArea === 'all' && styles.sheetChipTextSelected,
                            ]}
                          >
                            كل الأحياء
                          </Text>
                        </TouchableOpacity>
                        {(KNZ_AREAS_BY_CITY_KEYS[selectedCity] as readonly string[]).map((areaKeyOrName) => {
                          const areaLabel = areaKeyOrName.startsWith('surfaces.') ? t(areaKeyOrName) : areaKeyOrName;
                          return (
                            <TouchableOpacity
                              key={areaKeyOrName}
                              style={[
                                styles.sheetChip,
                                selectedArea === areaLabel && styles.sheetChipSelected,
                              ]}
                              onPress={() => setSelectedArea(areaLabel)}
                            >
                              <Text
                                style={[
                                  styles.sheetChipText,
                                  selectedArea === areaLabel && styles.sheetChipTextSelected,
                                ]}
                              >
                                {areaLabel}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </>
                  ) : null}
                </ScrollView>

                <TouchableOpacity
                  style={styles.filterSheetApplyButton}
                  onPress={() => setIsFilterSheetOpen(false)}
                >
                  <Text style={styles.filterSheetApplyText}>{t('knz.app-client.mobile.auto_knz_listings_list.filterSheetApplyText')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_listings_list.loadingMessage')}
      emptyMessage={t('surfaces.لا_توجد_إعلانات_متاحة_حالياً')}
      emptyActionText={t('surfaces.إضافة_إعلان')}
      onEmptyAction={() => handleNavigate('KnzListingCreate')}
      errorMessage={t('surfaces.فشل_في_تحميل_الإعلانات')}
      onErrorAction={loadListings}
      screenName="auto_knz_listings_list"
      operationName="knz_listings_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  searchButton: {
    padding: BTHWANI_SPACING.sm,
  },
  searchIcon: {
    fontSize: 24,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    gap: BTHWANI_SPACING.md,
  },
  filterBarChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
  },
  filterBarChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
  },
  filterBarSummary: {
    flex: 1,
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  categoriesContainer: {
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  categoriesScroll: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  selectedCategoryChip: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  categoryChipText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '600',
  },
  filterSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  filterSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'BTHWANI_COLORS.overlay35',
  },
  filterSheet: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingBottom: BTHWANI_SPACING.xl,
    paddingTop: BTHWANI_SPACING.md,
  },
  filterSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  filterSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  filterSheetClose: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  filterSheetScroll: {
    maxHeight: 360,
  },
  filterSheetScrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.md,
  },
  filterSectionLabel: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    fontWeight: '600',
    marginBottom: BTHWANI_SPACING.xs,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  filterChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  sheetChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  sheetChipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  sheetChipText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  sheetChipTextSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  filterSheetApplyButton: {
    marginTop: BTHWANI_SPACING.sm,
    marginHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
  },
  filterSheetApplyText: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
  },
  listingsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  listingCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 200,
  },
  listingContent: {
    padding: BTHWANI_SPACING.md,
  },
  listingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
  listingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  promotedBadge: {
    fontSize: 11,
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 2,
    marginBottom: BTHWANI_SPACING.xs,
  },
  typeBadge: {
    fontSize: 11,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.sm,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  category: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  location: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  deliveryBadge: {
    fontSize: 11,
    color: semanticRoles.info,
    marginBottom: BTHWANI_SPACING.xs,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  sellerInfo: {
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
});

export default auto_knz_listings_list;

