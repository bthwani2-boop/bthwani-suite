import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  BthBox,
  BthMobileScrollView,
  BthStateView,
  BthText,
  radius,
  sizes,
  spacing,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
} from '../fixtures/dshHomeGetFixtures';
import {
  StoreCardPremium,
  type DshStoreCompactCardData,
} from '../components/StoreCardPremium';
import {
  HomeBannerCarousel,
  type HomeBannerCarouselItem,
} from '../components/HomeBannerCarousel';
import { dshCategoryFixtures } from '../../categories/fixtures/dshCategoriesFixtures';

export type DshHomeGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  categories?: DshHomeCategory[];
  promos?: DshHomeGetPromo[];
  stores?: DshHomeGetStore[];
  onBack?: () => void;
  onOpenList?: () => void;
  onOpenCategory?: (categoryId: string) => void;
  onOpenStoresList?: () => void;
  onOpenStoreCategory?: (storeId: string, categoryId: string) => void;
  onOpenProduct?: (storeId: string, itemId: string) => void;
  onOpenBenefits?: () => void;
  onOpenFavorites?: () => void;
  onOpenSearch?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenStore?: (storeId: string) => void;
  onRetry?: () => void;
};

export type DshHomeCategory = {
  id: string;
  label: string;
};

export type DshHomeBannerActionType = 'main_category' | 'sub_category' | 'store' | 'external' | 'store_category' | 'product' | 'subscription';

type DiscoveryFilter = 'all' | 'favorites' | 'nearest' | 'new' | 'offers';

export type DshHomeGetPromo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionType?: DshHomeBannerActionType;
  actionTarget?: string;
  actionExtra?: string;
  imageUrl?: string;
  accentColor?: string;
};

export type DshHomeGetStore = {
  id: string;
  name: string;
  address: string;
  imageUri?: string;
  rating?: number;
  statusLabel: string;
  statusTone: 'open' | 'closed';
  distanceLabel: string;
  deliveryLabel: string;
  serviceLabel: string;
  followerCount: number;
  multiplierLabel: string;
  subscriptionPackageChips?: string[];
  offerLabel?: string;
  isFavorite: boolean;
  isFollowing: boolean;
  hasOffer?: boolean;
};

const discoveryFilters: Array<{ value: DiscoveryFilter; label: string; iconName: React.ComponentProps<typeof Ionicons>['name'] }> = [
  { value: 'all', label: 'الكل', iconName: 'reorder-three-outline' },
  { value: 'favorites', label: 'المفضلة', iconName: 'heart-outline' },
  { value: 'nearest', label: 'الأقرب', iconName: 'locate-outline' },
  { value: 'new', label: 'الجديدة', iconName: 'sparkles-outline' },
  { value: 'offers', label: 'العروض', iconName: 'pricetag-outline' },
];

const categoryIconMap: Record<string, string> = {
  restaurants: '🍽️',
  grocery: '🛒',
  sweets_juices: '🍨',
  anaqati: '✨',
  bthwani_store: '🏪',
  home_projects: '🏠',
  awnak: '🧭',
  gas_refill: '⛽',
  shein: '🛍️',
  spare_parts: '🔧',
  honey_dates: '🍯',
  electronics: '📱',
};

function renderState(state: Exclude<NonNullable<DshHomeGetScreenProps['state']>, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="لا توجد بيانات عرض بعد"
        description="أعد المحاولة لاستعادة واجهة DSH الرئيسية واختصاراتها."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <BthStateView
        stateId="warning"
        title="الواجهة الرئيسية موقوفة مؤقتاً"
        description="أبقِ المحاولة مرئية حتى تعود هذه الواجهة للخدمة."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="تعذر تحميل الواجهة الرئيسية"
      description="أعد المحاولة ثم انتقل إلى الفئات أو الطلبات إذا لزم."
      actionLabel="إعادة المحاولة"
      onActionPress={onRetry}
    />
  );
}

export function DshHomeGetScreen({
  state = 'ready',
  categories,
  promos = dshHomeGetFixturePromos,
  stores = dshHomeGetFixtureStores,
  onBack,
  onOpenList,
  onOpenCategory,
  onOpenStoresList,
  onOpenStoreCategory,
  onOpenProduct,
  onOpenBenefits,
  onOpenFavorites,
  onOpenSearch,
  onOpenOrders,
  onOpenTracking,
  onOpenStore,
  onRetry,
}: DshHomeGetScreenProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
  const [activeCategoryId, setActiveCategoryId] = React.useState<string>('restaurants');
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);
  const [favoriteToggles, setFavoriteToggles] = React.useState<Record<string, boolean>>({});
  const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
  const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});
  const categoryItems = React.useMemo(() => {
    if (categories?.length) {
      return categories;
    }

    return dshCategoryFixtures.slice(0, 6).map((category) => ({
      id: category.id,
      label: category.label,
    }));
  }, [categories]);

  React.useEffect(() => {
    if (promos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((current) => (current + 1) % promos.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [promos]);

  const visibleStores = React.useMemo(() => {
    return stores.filter((store) => {
      const isFavorite = favoriteToggles[store.id] ?? store.isFavorite;

      if (activeFilter === 'favorites') {
        return isFavorite;
      }

      if (activeFilter === 'nearest') {
        return store.distanceLabel === '1.8 كم' || store.distanceLabel === '2.1 كم';
      }

      if (activeFilter === 'new') {
        return Boolean(store.hasOffer);
      }

      if (activeFilter === 'offers') {
        return Boolean(store.hasOffer || store.offerLabel);
      }

      return true;
    });
  }, [activeFilter, favoriteToggles, stores]);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const resolveBannerPress = React.useCallback(
    (promo: DshHomeGetPromo) => () => {
      if (promo.actionType === 'main_category' || promo.actionType === 'sub_category') {
        if (promo.actionTarget && onOpenCategory) {
          onOpenCategory(promo.actionTarget);
          return;
        }

        onOpenList?.();
        return;
      }

      if (promo.actionType === 'store') {
        if (promo.actionTarget && onOpenStore) {
          onOpenStore(promo.actionTarget);
          return;
        }

        if (onOpenStoresList) {
          onOpenStoresList();
          return;
        }

        onOpenSearch?.();
        return;
      }

      if (promo.actionType === 'store_category') {
        if (promo.actionTarget && promo.actionExtra && onOpenStoreCategory) {
          onOpenStoreCategory(promo.actionTarget, promo.actionExtra);
          return;
        }

        if (promo.actionTarget && onOpenStore) {
          onOpenStore(promo.actionTarget);
          return;
        }

        if (onOpenStoresList) {
          onOpenStoresList();
          return;
        }

        onOpenList?.();
        return;
      }

      if (promo.actionType === 'product') {
        if (promo.actionExtra && promo.actionTarget && onOpenProduct) {
          onOpenProduct(promo.actionExtra, promo.actionTarget);
          return;
        }

        if (promo.actionExtra && onOpenStore) {
          onOpenStore(promo.actionExtra);
          return;
        }

        onOpenSearch?.();
        return;
      }

      if (promo.actionType === 'subscription') {
        if (onOpenBenefits) {
          onOpenBenefits();
          return;
        }

        onOpenSearch?.();
        return;
      }

      if (onOpenStoresList) {
        onOpenStoresList();
        return;
      }

      onOpenSearch?.();
    },
    [onOpenBenefits, onOpenCategory, onOpenList, onOpenProduct, onOpenSearch, onOpenStore, onOpenStoreCategory, onOpenStoresList]
  );

  const activePromo = promos[activePromoIndex % promos.length] ?? dshHomeGetFixturePromos[0];
  const promoDiscount = activePromo.subtitle.match(/\d+%/)?.[0] ?? '30%';
  const promoTail = activePromo.subtitle.replace(promoDiscount, '').trim();
  const primaryStore = stores[0] ?? null;
  const tickerFacts = React.useMemo(
    () => [
      primaryStore ? `${primaryStore.name} · ${primaryStore.deliveryLabel}` : 'أقرب متجر متاح الآن',
      activePromo.title ? `${activePromo.title} · ${promoDiscount}` : promoDiscount,
      primaryStore ? `${primaryStore.serviceLabel} · ${primaryStore.distanceLabel}` : 'توصيل سريع',
    ],
    [activePromo.title, primaryStore, promoDiscount]
  );
  const bannerItems: HomeBannerCarouselItem[] = promos.map((promo) => ({
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle,
    imageUrl: promo.imageUrl,
    accentColor: promo.accentColor,
    onPress: resolveBannerPress(promo),
  }));

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <View style={styles.homeTopBar}>
        <View style={[styles.homeTopBarRow, direction === 'rtl' && styles.homeTopBarRowRtl]}>
          <View style={[styles.homeTopBarActions, direction === 'rtl' && styles.homeTopBarActionsRtl]}>
            <Pressable style={styles.homeTopIconButton} onPress={onOpenSearch}>
              <Ionicons name="search-outline" size={18} color={theme.textInverse} />
            </Pressable>
            <Pressable style={styles.homeTopIconButton} onPress={onOpenFavorites}>
              <Ionicons name="heart-outline" size={18} color={theme.textInverse} />
            </Pressable>
            <Pressable style={styles.homeTopIconButton} onPress={onOpenOrders}>
              <Ionicons name="notifications-outline" size={18} color={theme.textInverse} />
            </Pressable>
            <Pressable style={styles.homeTopIconButton} onPress={onOpenTracking}>
              <Ionicons name="time-outline" size={18} color={theme.textInverse} />
            </Pressable>
          </View>

          <View style={[styles.homeTopTitleWrap, direction === 'rtl' && styles.homeTopTitleWrapRtl]}>
            <BthText role="titleSm" style={styles.homeTopTitle}>بواني تحقق الأماني</BthText>
            <BthText role="bodySm" style={styles.homeTopSubtitle}>المساحة مخصصة للشريط الإخباري</BthText>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.homeTickerRow, direction === 'rtl' && styles.homeTickerRowRtl]}
        >
          {tickerFacts.map((fact, index) => (
            <Pressable
              key={`${fact}-${index}`}
              style={[
                styles.homeTickerChip,
                index === 0 && styles.homeTickerChipAccent,
              ]}
              onPress={index === 0 && primaryStore && onOpenStore ? () => onOpenStore(primaryStore.id) : index === 2 ? onOpenTracking : undefined}
            >
              <BthText role="bodySm" style={[styles.homeTickerChipText, index === 0 && styles.homeTickerChipTextAccent]} numberOfLines={1}>
                {fact}
              </BthText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.carouselViewport}>
        <HomeBannerCarousel banners={bannerItems} rtl={direction === 'rtl'} />
      </View>

      <View style={styles.heroRow}>
        <Pressable style={styles.heroPromoCard} onPress={onOpenSearch ?? onOpenList}>
          <View style={styles.heroPromoContent}>
            <View style={styles.heroPromoIconWrap}>
              <BthText role="titleLg" style={styles.heroIcon}>
                {activePromo.icon}
              </BthText>
            </View>

            <View style={styles.heroPromoTextWrap}>
              <View style={styles.heroPromoBadge}>
                <BthText role="bodySm" style={styles.heroPromoBadgeText}>
                  {activePromo.title}
                </BthText>
              </View>
              <BthText role="titleSm" style={styles.heroPromoTitle} numberOfLines={1}>
                {promoDiscount}
              </BthText>
              <BthText role="titleSm" style={styles.heroPromoSubtitle} numberOfLines={1}>
                {promoTail || 'على أول طلب'}
              </BthText>
            </View>
          </View>

          <View style={styles.heroPagerRow}>
            <View style={styles.heroPagerActive} />
          </View>
        </Pressable>

        <View style={styles.quickActionsCluster}>
          <View style={styles.quickActionBottomRow}>
            <Pressable style={styles.quickActionSecondary} onPress={onOpenList}>
              <View style={styles.quickActionChipContent}>
                <Ionicons name="menu-outline" size={16} color="#ffffff" />
                <BthText role="bodySm" style={styles.quickActionLabel}>الفئات</BthText>
              </View>
            </Pressable>
            <Pressable style={styles.quickActionTertiary} onPress={onOpenSearch}>
              <View style={styles.quickActionChipContent}>
                <Ionicons name="videocam-outline" size={15} color="#ffffff" />
                <BthText role="bodySm" style={styles.quickActionLabel}>فيديو</BthText>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.categoryRail,
          direction === 'rtl' && styles.categoryRailRtl,
        ]}
      >
        {categoryItems.map((category) => {
          const isActive = category.id === activeCategoryId;
          const icon = categoryIconMap[category.id] ?? '📂';

          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryRailItem,
                isActive && styles.categoryRailItemActive,
              ]}
              onPress={() => {
                setActiveCategoryId(category.id);
                if (onOpenCategory) {
                  onOpenCategory(category.id);
                  return;
                }

                onOpenList?.();
              }}
            >
              <BthText role="bodySm" style={styles.categoryRailIcon}>
                {icon}
              </BthText>
              <BthText
                role="bodySm"
                style={[
                  styles.categoryRailLabel,
                  isActive && styles.categoryRailLabelActive,
                ]}
                numberOfLines={1}
              >
                {category.label}
              </BthText>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.filtersRow,
          direction === 'rtl' && styles.filtersRowRtl,
        ]}
      >
        {discoveryFilters.map((filter) => {
          const isActive = filter.value === activeFilter;
          return (
            <Pressable
              key={filter.value}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? theme.brand : theme.surfaceRaised,
                  borderColor: isActive ? theme.brand : 'transparent',
                },
              ]}
              onPress={() => setActiveFilter(filter.value)}
            >
              <View style={styles.filterChipContent}>
                <Ionicons
                  name={filter.iconName}
                  size={16}
                  color={isActive ? theme.textInverse : theme.textMuted}
                />
                <BthText
                  role="bodySm"
                  style={[
                    styles.filterChipLabel,
                    { color: isActive ? theme.textInverse : theme.textMuted },
                  ]}
                >
                  {filter.label}
                </BthText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <BthBox gap={3}>
        {visibleStores.map((store, index) => {
          const card: DshStoreCompactCardData = {
            id: store.id,
            name: store.name,
            subtitle: store.address,
            image: { uri: store.imageUri ?? '' },
            rating: store.rating ?? (store.hasOffer ? 5 : 4.8),
            distanceKm: Number.parseFloat(store.distanceLabel.replace(/[^\d.]/g, '')) || null,
            isOpen: store.statusTone === 'open',
            supportsPickup: true,
            supportsPartnerDelivery: true,
            serviceTokens: [
              { label: store.deliveryLabel },
              { label: store.serviceLabel },
            ],
            isFavorite: favoriteToggles[store.id] ?? store.isFavorite,
            isFollowing: followToggles[store.id] ?? store.isFollowing,
            followersCount: followCounts[store.id] ?? store.followerCount,
            hasBthwaniPro: store.hasOffer !== false,
            subscriptionPackageChips: store.subscriptionPackageChips ?? [store.deliveryLabel, store.serviceLabel],
            hasNewProducts: store.hasOffer === true,
            hasOffer: store.hasOffer,
            offerText: store.offerLabel,
            pointsMultiplier: Number.parseInt(store.multiplierLabel.replace(/[^\d]/g, ''), 10) || (index === 2 ? 3 : index === 0 ? 2 : 1),
            hasCouponAvailable: store.hasOffer === false,
          };

          return (
            <StoreCardPremium
              key={store.id}
              item={card}
              onPress={onOpenStore ? () => onOpenStore(store.id) : undefined}
              onToggleFavorite={(id) => {
                setFavoriteToggles((current) => ({
                  ...current,
                  [id]: !(current[id] ?? store.isFavorite),
                }));
              }}
              onToggleFollow={(id) => {
                const isFollowing = followToggles[id] ?? store.isFollowing;
                const baseCount = followCounts[id] ?? store.followerCount;
                setFollowToggles((current) => ({ ...current, [id]: !isFollowing }));
                setFollowCounts((current) => ({
                  ...current,
                  [id]: isFollowing ? Math.max(0, baseCount - 1) : baseCount + 1,
                }));
              }}
              onPressSubscriptionChip={onOpenSearch}
            />
          );
        })}
      </BthBox>
    </BthMobileScrollView>
  );
}

const styles = StyleSheet.create({
  homeTopBar: {
    backgroundColor: '#ff6a00',
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  homeTopBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  homeTopBarRowRtl: {
    flexDirection: 'row-reverse',
  },
  homeTopBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeTopBarActionsRtl: {
    flexDirection: 'row-reverse',
  },
  homeTopIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeTopTitleWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  homeTopTitleWrapRtl: {
    alignItems: 'flex-start',
  },
  homeTopTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16,
  },
  homeTopSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  homeTickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeTickerRowRtl: {
    flexDirection: 'row-reverse',
  },
  homeTickerChip: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  homeTickerChipAccent: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  homeTickerChipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  homeTickerChipTextAccent: {
    color: '#ff6a00',
  },
  carouselViewport: {
    gap: 14,
    marginTop: -2,
  },
  carouselStage: {
    height: 238,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6eaf1',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  carouselDotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 9,
  },
  carouselDot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#d5d8df',
  },
  carouselDotActive: {
    width: 34,
    backgroundColor: '#ff6a00',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  heroPromoCard: {
    flex: 1,
    minWidth: 200,
    height: 76,
    borderRadius: 18,
    backgroundColor: '#f54747',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  heroPromoContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  heroPromoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroPromoTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  heroPromoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  heroPromoBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 10,
  },
  heroPromoTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
  },
  heroPromoSubtitle: {
    color: '#ffd3d3',
    fontWeight: '500',
    textAlign: 'right',
    fontSize: 11,
    lineHeight: 13,
  },
  heroIcon: {
    color: '#fff',
    fontSize: 26,
    lineHeight: 24,
  },
  categoryRail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
  },
  categoryRailRtl: {
    direction: 'rtl',
  },
  categoryRailItem: {
    minHeight: 42,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E6EAF1',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  categoryRailItemActive: {
    backgroundColor: '#FFF4E9',
    borderColor: '#FF6A00',
  },
  categoryRailIcon: {
    fontSize: 14,
  },
  categoryRailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  categoryRailLabelActive: {
    color: '#C2410C',
  },
  heroPagerRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  heroPagerActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  quickActionsCluster: {
    width: 124,
    flexShrink: 0,
  },
  quickActionBottomRow: {
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    gap: 8,
  },
  quickActionSecondary: {
    flex: 1.05,
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#0d2f67',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTertiary: {
    flex: 0.95,
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#ff6a00',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionChipContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  quickActionLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
  },
  filtersRowRtl: {
    direction: 'rtl',
  },
  filterChip: {
    minHeight: sizes.controlSm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filterChipContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  filterChipLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  storeCard: {
    borderWidth: 1.5,
    borderColor: '#d8dce4',
    borderRadius: 28,
    backgroundColor: '#fff',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  storeCardTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusChip: {
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: '#eafff6',
    borderWidth: 1.2,
    borderColor: '#45d2a0',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipClosed: {
    backgroundColor: '#ffeded',
    borderColor: '#ff4f4f',
  },
  statusChipText: {
    color: '#15a26b',
    fontWeight: '700',
  },
  statusChipTextClosed: {
    color: '#d33939',
  },
  storeImageStub: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#eef2f7',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e7ee',
  },
  storeImageOverlayRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 4,
    gap: 4,
    zIndex: 2,
  },
  storeImageCore: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 6,
    borderRadius: 14,
    backgroundColor: '#e8edf3',
    opacity: 0.92,
    overflow: 'hidden',
  },
  storeImageCoreGlow: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  storeBadgeHot: {
    minHeight: 20,
    borderRadius: 10,
    backgroundColor: '#ff6a00',
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
  },
  storeOfferRibbon: {
    backgroundColor: '#ff5b41',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 9,
    alignItems: 'center',
  },
  storeOfferRibbonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  storeBodyRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    alignItems: 'flex-start',
  },
  favoriteColumn: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  storeContentColumn: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  storeTitle: {
    color: '#1c2330',
    fontWeight: '800',
    textAlign: 'right',
    fontSize: 18,
    lineHeight: 22,
  },
  storeAddress: {
    color: '#6d7584',
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 16,
  },
  storeDistanceLine: {
    color: '#5b6372',
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 16,
  },
  storeMetaChipRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  metaChip: {
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: '#eef1f6',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaChipText: {
    color: '#657082',
    fontWeight: '700',
  },
  metaChipBlue: {
    backgroundColor: '#d7efff',
  },
  metaChipBlueText: {
    color: '#2d74be',
    fontWeight: '800',
  },
  storeFooterRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    marginTop: 10,
  },
  storeScorePill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff1cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeMultiplierPill: {
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: '#f8b12b',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeMultiplierText: {
    color: '#332300',
    fontWeight: '800',
  },
  storeFollowersText: {
    color: '#454f5c',
    fontWeight: '700',
    fontSize: 12,
  },
  storeFollowAdd: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeFollowAddText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
  },
  storeFollowAdded: {
    backgroundColor: '#0d9b65',
  },
});

export default DshHomeGetScreen;