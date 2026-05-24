import * as React from 'react';
import { Image, Pressable, ScrollView, FlatList, Platform, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';

import {
  BannerCarousel,
  type BannerCarouselItem,
  Box,
  BThwaniFilterRail,
  BThwaniFilterSwipeBoundary,
  CategoryOrbitCarousel,
  Icon,
  SearchTopBar,
  StateView,
  StoreCardPremium,
  type StoreCardPremiumItem,
  Text,
  ModernPremiumHeader,
  colorPalette,
  withAlpha,
  resolveRowDirection,
  resolveTextAlign,
  spacing,
  ServiceOrbitCarousel,
  type OrbitAnchorLayout,
  type OrbitCarouselItem,
  type BThwaniFilterRailItem,
  type Direction,
  useDirection,
  useTheme,
  useUiText,
} from '@bthwani/ui-kit';
import { DshAwnakOrderCreateScreen } from '../AwnakOrderCreateScreen';
import { DshSheinOrderCreateScreen } from '../SheinOrderCreateScreen';
import {
  DshHomeApprovedVideoReelsViewer,
  type DshHomeApprovedVideoReelsViewerProps,
} from '../ApprovedVideoReelsViewer';
import {
  CategoryHubIcon,
  CategoryIconImage,
  CategorySelectorItem,
} from './HomeCategoryCarousel';
import { EmptyFeed } from './HomeStoreFeed';
import {
  DSH_CATEGORY_ICONS as categoryIconMap,
  DSH_SUBCATEGORY_ICONS as subcategoryIconMap,
} from '../../data/categories.preview-data';
import {
  dshHomeDiscoveryFilterFixtures as discoveryFilters,
  dshHomeServiceDialFixtures,
} from '../../data/home.preview-data';
import {
  normalizeHomePromoActionType,
  resolveHomeCategoryContext,
  resolveHomePromoPublishStage,
} from '../../shared/home-promo-mappers';
import {
  buildHomeCategoryFilterId,
  buildHomeModeFilterId,
  HOME_CATEGORY_FILTER_PREFIX,
  HOME_MODE_FILTER_PREFIX,
  resolveHomeStoresForCategory,
} from '../../shared/home-search-helpers';
import { useHomeState } from '../../hooks/useHomeState';
import { getDshCategoryIconUrl } from '../../shared/get-dsh-category-icon-url';
import { resolveDshImageSource } from '../../shared/resolve-image-source';
import type { MarketingGrowthRecord } from '../../../shared/growth.preview-store';
import type { MarketingVideoRecord } from '../../../shared/video.preview-store';
import type { DshPartnerActivationStatus } from '../../../shared/dsh-partner-activation.model';
import { resolveDshStoreClientVisibility } from '../../../shared/dsh-client-visibility.model';
import {
  getMarketingTickerItems,
  buildMarketingTickerPlan,
} from '../../../shared/news-ticker.preview-store';
import { getPublishedHomePromos, type HomePromoRecord } from '../../../shared/promo.preview-store';
import {
  getHomePromoVisibilityRecord,
  getMarketingVideoVisibilityRecord,
  isMarketingRenderable,
} from '../../../shared/marketing-visibility.contract';

import { canRenderInClientSurface } from '../../../shared/workflow';

import type {
  DshHomeCategory,
  DiscoveryFilter,
  StorePagerPage,
  DshHomeGetPromo,
  DshHomeGetStore,
  DshHomeRecentOrder,
  DshServiceId,
} from '../../contracts/dsh-home-types';

export type DshHomeGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  categories?: DshHomeCategory[];
  promos?: DshHomeGetPromo[];
  homePromos?: HomePromoRecord[];
  stores?: DshHomeGetStore[];
  recentOrders?: DshHomeRecentOrder[];
  approvedVideoShorts?: MarketingVideoRecord[];
  onBack?: () => void;
  onOpenEntry?: () => void;
  onOpenMySpace?: () => void;
  onOpenNotifications?: () => void;
  onOpenCart?: () => void;
  onOpenWallet?: () => void;
  onOpenService?: (serviceId: DshServiceId) => void;
  onOpenList?: () => void;
  onOpenCategory?: (categoryId: string) => void;
  onOpenDiscovery?: () => void;
  onOpenStoreCategory?: (storeId: string, categoryId: string) => void;
  onOpenProduct?: (storeId: string, itemId: string) => void;
  onOpenBenefits?: (screenId?: string) => void;
  onOpenFavorites?: () => void;
  favoriteOverrides?: Record<string, boolean>;
  onToggleFavorite?: (storeId: string) => void;
  onOpenSearch?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenStore?: (storeId: string) => void;
  onPromoClick?: (promoId: string) => void;
  onPromoImpression?: (promoId: string) => void;
  onVideoCtaClick?: (itemId: string) => void;
  onVideoImpression?: (itemId: string) => void;
  onOpenSheinInfo?: () => void;
  sheinInlineVisible?: boolean;
  onCloseSheinInline?: () => void;
  awnakInlineVisible?: boolean;
  onCloseAwnakInline?: () => void;
  onRegisterBackHandler?: (handler: (() => boolean) | null) => void;
  renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
  onRetry?: () => void;
  notificationCount?: number;
  cartCount?: number;
  serviceDialTrigger?: number;
  searchAutoOpenToken?: number;
};

function resolveDshHomeStoreImageSource(imageUri?: string, publishStage?: string): ImageSourcePropType | undefined {
  if (!canRenderInClientSurface(publishStage, 'store')) {
    return undefined;
  }
  return resolveDshImageSource(imageUri);
}

function resolveDshHomeBannerImageSource(imageUrl?: string): ImageSourcePropType | undefined {
  return resolveDshImageSource(imageUrl);
}

type CategoryDialItem = OrbitCarouselItem;
type DialAnchorLayout = OrbitAnchorLayout;
type HomeStoreCardEntry = {
  item: StoreCardPremiumItem;
  storeId: string;
  baseFavorite?: boolean;
};

const serviceDialAnchorLayout: DialAnchorLayout = {
  x: spacing[3],
  y: spacing[14],
  width: 46,
  height: 46,
};

const serviceDialItems: CategoryDialItem[] = dshHomeServiceDialFixtures;

// Internal resolveTickerBanner removed. Using buildMarketingTickerPlan from store.

function renderState(state: Exclude<NonNullable<DshHomeGetScreenProps['state']>, 'ready'>, onRetry?: () => void) {
  const titles = {
    loading: 'جاري التحميل...',
    empty: 'لا توجد بيانات عرض بعد',
    offline: 'أنت غير متصل بالإنترنت',
    disabled: 'الواجهة الرئيسية موقوفة مؤقتاً',
    error: 'تعذر تحميل الواجهة الرئيسية',
  };

  const descriptions = {
    loading: 'يرجى الانتظار بينما نقوم بتجهيز تجربتك المخصصة.',
    empty: 'أعد المحاولة لاستعادة الواجهة الرئيسية واختصاراتها.',
    offline: 'يرجى التحقق من اتصالك بالشبكة للمتابعة.',
    disabled: 'أبقِ المحاولة مرئية حتى تعود هذه الواجهة للخدمة.',
    error: 'أعد المحاولة ثم انتقل إلى الفئات أو الطلبات إذا لزم.',
  };

  return (
    <StateView
      stateId={state === 'offline' ? 'offline' : state === 'loading' ? 'loading' : state === 'disabled' ? 'warning' : 'recoverableError'}
      title={titles[state === 'error' ? 'error' : state] || titles.error}
      description={descriptions[state === 'error' ? 'error' : state] || descriptions.error}
      actionLabel={state !== 'loading' ? 'إعادة المحاولة' : undefined}
      onActionPress={onRetry}
    />
  );
}

const ACTIVE_PROMO_INTERVAL_MS = 5000;

const HomeStoreCardItem = React.memo(function HomeStoreCardItem({
  entry,
  onOpenStore,
  onToggleFavorite,
  setLocalFavoriteToggles,
}: {
  entry: HomeStoreCardEntry;
  onOpenStore?: (storeId: string) => void;
  onToggleFavorite?: (storeId: string) => void;
  setLocalFavoriteToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const handlePress = React.useCallback(() => {
    onOpenStore?.(entry.storeId);
  }, [entry.storeId, onOpenStore]);

  const handleFavoritePress = React.useCallback(() => {
    if (onToggleFavorite) {
      onToggleFavorite(entry.storeId);
      return;
    }

    setLocalFavoriteToggles((current) => ({
      ...current,
      [entry.storeId]: !(current[entry.storeId] ?? entry.baseFavorite),
    }));
  }, [entry.baseFavorite, entry.storeId, onToggleFavorite, setLocalFavoriteToggles]);

  return (
    <StoreCardPremium
      item={entry.item}
      onPress={onOpenStore ? handlePress : undefined}
      onFavoritePress={handleFavoritePress}
    />
  );
});

export function DshHomeGetScreen({
  state = 'ready',
  categories,
  promos,
  stores,
  recentOrders: _recentOrders = [],
  onBack: _onBack,
  onOpenList,
  onOpenCategory,
  onOpenDiscovery,
  onOpenStoreCategory,
  onOpenProduct,
  onOpenBenefits,
  onOpenFavorites: _onOpenFavorites,
  onOpenSearch,
  onOpenCart,
  onOpenOrders,
  onOpenTracking,
  onOpenWallet,
  onOpenMySpace,
  onOpenNotifications,
  onOpenService,
  onOpenStore,
  onPromoClick,
  onPromoImpression,
  onVideoCtaClick,
  onVideoImpression,
  onOpenSheinInfo,
  sheinInlineVisible = false,
  onCloseSheinInline,
  awnakInlineVisible = false,
  onCloseAwnakInline,
  onRegisterBackHandler,
  approvedVideoShorts = [],
  renderApprovedVideoReelsViewer,
  onRetry,
  onOpenEntry,
  homePromos,
  notificationCount = 5,
  cartCount = 2,
  favoriteOverrides,
  onToggleFavorite,
  serviceDialTrigger,
  searchAutoOpenToken = 0,
}: DshHomeGetScreenProps) {
  const { direction, language: resolvedLanguage } = useDirection();
  const currentLanguage = resolvedLanguage ?? 'ar';
  const isRtl = direction === 'rtl';
  const { width: viewportWidth } = useWindowDimensions();
  const { theme } = useTheme();
  const uiText = useUiText();
  const styles = React.useMemo(() => createStyles(direction, theme), [direction, theme]);
  const categoriesAnchorRef = React.useRef<View>(null);
  const {
    categoriesSheetVisible,
    setCategoriesSheetVisible,
    categoriesDialLayout,
    setCategoriesDialLayout,
    activeFilter,
    setActiveFilter,
    activeCategoryId,
    setActiveCategoryId,
    activeRailItemId,
    setActiveRailItemId,
    activeSubcategoryId,
    setActiveSubcategoryId,
    activePromoIndex,
    setActivePromoIndex,
    localFavoriteToggles,
    setLocalFavoriteToggles,
    followToggles,
    followCounts,
    shortsVisible,
    setShortsVisible,
    currentTime,
    setCurrentTime,
    inlineSearchVisible,
    setInlineSearchVisible,
    inlineSearchQuery,
    setInlineSearchQuery,
    serviceDialVisible,
    setServiceDialVisible,
    isTickerHidden,
  } = useHomeState();
  const favoriteToggles = favoriteOverrides ?? localFavoriteToggles;
  const promoImpressionIdsRef = React.useRef<Set<string>>(new Set());
  const lastSearchAutoOpenTokenRef = React.useRef(0);

  React.useEffect(() => {
    if (serviceDialTrigger) {
      setServiceDialVisible(true);
    }
  }, [serviceDialTrigger, setServiceDialVisible]);

  React.useEffect(() => {
    if (!searchAutoOpenToken || searchAutoOpenToken === lastSearchAutoOpenTokenRef.current) {
      return;
    }

    lastSearchAutoOpenTokenRef.current = searchAutoOpenToken;
    setInlineSearchQuery('');
    setInlineSearchVisible(true);
  }, [searchAutoOpenToken, setInlineSearchQuery, setInlineSearchVisible]);

  const handleOpenMySpace = React.useCallback(() => {
    if (onOpenMySpace) {
      onOpenMySpace();
      return;
    }

    onOpenEntry?.();
  }, [onOpenEntry, onOpenMySpace]);

  const handleOpenCartFromHeader = React.useCallback(() => {
    onOpenCart?.();
  }, [onOpenCart]);

  const resolvedCategories = React.useMemo(() => categories ?? [], [categories]);
  const resolvedPromos = React.useMemo(() => promos ?? [], [promos]);

  const containerWidth = viewportWidth;
  const sidePeek = Math.max(spacing[1], Math.min(spacing[4], Math.round(containerWidth * 0.045)));
  const resolvedItemGap = Math.max(spacing[1], Math.min(spacing[2], Math.round(containerWidth * 0.018)));
  const baseCardWidth = Math.max(256, Math.min(326, Math.round(containerWidth - (sidePeek * 2) - (resolvedItemGap * 2))));
  const cardWidth = Math.max(220, Math.round(baseCardWidth * 0.84));
  const cardHeight = Math.max(160, Math.round(cardWidth * 0.78));
  const resolvedStoresWithVisibility = React.useMemo(() => (
    (stores ?? []).map((store) => ({
      ...store,
      clientVisibility: resolveDshStoreClientVisibility({
        publishStage: store.publishStage,
        supportsPickup: store.supportsPickup,
        supportsPartnerDelivery: store.supportsPartnerDelivery,
        serviceabilityAvailable: store.serviceabilityAvailable,
        catalogPublished: store.catalogPublished,
        serviceLabel: store.serviceLabel,
        deliveryLabel: store.deliveryLabel,
        storeOpen: store.statusTone === 'open',
      }),
    }))
  ), [stores]);
  const resolvedStores = React.useMemo(
    () => resolvedStoresWithVisibility.filter((store) => store.clientVisibility.visible),
    [resolvedStoresWithVisibility],
  );
  const storeVisibilityById = React.useMemo(
    () => new Map(resolvedStoresWithVisibility.map((store) => [store.id, store.clientVisibility])),
    [resolvedStoresWithVisibility],
  );
  const resolveTargetPartnerStatus = React.useCallback((targetType: string, targetId?: string): DshPartnerActivationStatus | undefined => {
    if (targetType !== 'store' || !targetId) {
      return undefined;
    }

    return storeVisibilityById.get(targetId)?.activationStatus;
  }, [storeVisibilityById]);

  const resolvedHomePromos = React.useMemo(
    () => (homePromos ?? getPublishedHomePromos()).filter((promo) => {
      const visibility = getHomePromoVisibilityRecord(promo, {
        targetSurface: 'home',
        partnerStatus: resolveTargetPartnerStatus(promo.targetType, promo.targetId),
      });

      return isMarketingRenderable(visibility)
        && canRenderInClientSurface(resolveHomePromoPublishStage(promo.status), 'promo');
    }),
    [homePromos, resolveTargetPartnerStatus],
  );

  const categoryItems = React.useMemo(() => {
    return resolvedCategories;
  }, [resolvedCategories]);

  const categoryPageIds = React.useMemo(() => ['all', ...categoryItems.map((category) => category.id)], [categoryItems]);

  const resolveStoresForCategory = React.useCallback((categoryId: string) => {
    return resolveHomeStoresForCategory({
      categoryId,
      stores: resolvedStores,
      activeFilter,
      favoriteToggles,
      query: inlineSearchQuery,
    });
  }, [activeFilter, favoriteToggles, inlineSearchQuery, resolvedStores]);

  const storePagerItems = React.useMemo<StorePagerPage[]>(() => (
    categoryPageIds.map((categoryId) => {
      const category = categoryItems.find((entry) => entry.id === categoryId);
      const renderMode = category?.renderMode ?? 'stores';

      return {
        categoryId,
        renderMode,
        stores: renderMode === 'manual-order' ? [] : resolveStoresForCategory(categoryId),
      };
    })
  ), [categoryItems, categoryPageIds, resolveStoresForCategory]);

  const activeStorePage = React.useMemo(
    () => storePagerItems.find((page) => page.categoryId === activeCategoryId) ?? storePagerItems[0] ?? null,
    [activeCategoryId, storePagerItems],
  );
  const activeHomeStoreCards = React.useMemo(() => {
    if (!activeStorePage?.stores.length) {
      return [];
    }

    return activeStorePage.stores.map((store, index) => {
      const sm = store.commercialSourceMap;
      const isOfferBlocked = sm?.['offerLabel']?.conflictStatus === 'blocker';
      const isProBlocked = sm?.['hasBthwaniPro']?.conflictStatus === 'blocker';
      const isCouponBlocked = sm?.['hasCouponAvailable']?.conflictStatus === 'blocker';
      const isPriceMatchBlocked = sm?.['priceMatchLabel']?.conflictStatus === 'blocker';
      const isNewProductsBlocked = sm?.['hasNewProducts']?.conflictStatus === 'blocker' || sm?.['new-product-leak']?.conflictStatus === 'blocker';

      const item: StoreCardPremiumItem = {
        id: store.id,
        name: store.name,
        subtitle: store.address,
        image: resolveDshHomeStoreImageSource(store.imageUri ?? store.mediaKey, store.publishStage),
        rating: store.rating ?? null,
        distanceKm: Number.parseFloat((store.distanceLabel || '').replace(/[^\d.]/g, '')) || null,
        isOpen: store.statusTone === 'open',
        supportsPickup: sm?.['supportsPickup']?.conflictStatus !== 'blocker',
        supportsPartnerDelivery: sm?.['supportsPartnerDelivery']?.conflictStatus !== 'blocker',
        serviceTokens: [
          { label: store.deliveryLabel },
          { label: isPriceMatchBlocked ? undefined : store.serviceLabel }
        ].filter(t => t.label),
        isFavorite: favoriteToggles[store.id] ?? store.isFavorite,
        isFollowing: followToggles[store.id] ?? store.isFollowing,
        followersCount: followCounts[store.id] ?? store.followerCount,
        hasBthwaniPro: isProBlocked ? false : store.hasBthwaniPro,
        subscriptionPackageChips: isProBlocked ? [] : (store.subscriptionPackageChips ?? [store.deliveryLabel, store.serviceLabel].filter(Boolean) as string[]),
        hasNewProducts: isNewProductsBlocked ? false : store.hasNewProducts,
        hasOffer: isOfferBlocked ? false : store.hasOffer,
        offerText: isOfferBlocked ? undefined : store.offerLabel,
        pointsMultiplier: Number.parseInt((store.multiplierLabel || '').replace(/[^\d]/g, ''), 10) || (index === 2 ? 3 : index === 0 ? 2 : 1),
        hasCouponAvailable: isCouponBlocked ? false : store.hasCouponAvailable,
        locationLabel: store.locationLabel,
        deliveryTimeLabel: store.deliveryTimeLabel,
        isPopular: store.isPopular,
        logoImage: resolveDshHomeStoreImageSource(store.logoImageUri, store.publishStage),
      };

      return {
        item,
        storeId: store.id,
        baseFavorite: store.isFavorite,
      };
    });
  }, [activeStorePage, favoriteToggles, followCounts, followToggles]);

  const selectCategoryPage = React.useCallback((categoryId: string, _animated = true) => {
    setActiveCategoryId(categoryId);
    setActiveSubcategoryId(null);
  }, [setActiveCategoryId, setActiveSubcategoryId]);

  const selectedCategoryFixture = React.useMemo(
    () =>
      activeCategoryId && activeCategoryId !== 'all'
        ? categoryItems.find((category) => category.id === activeCategoryId) ?? null
        : null,
    [activeCategoryId, categoryItems]
  );
  const selectedCategoryLabel =
    selectedCategoryFixture?.label ??
    'الفئات';
  const selectedSubcategories = React.useMemo(
    () => selectedCategoryFixture?.subcategories ?? [],
    [selectedCategoryFixture],
  );
  React.useEffect(() => {
    if (!categoryItems.length) {
      return;
    }

    if (!activeCategoryId || activeCategoryId === 'all') {
      return;
    }

    if (!categoryItems.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId('all');
      setActiveSubcategoryId(null);
    }
  }, [activeCategoryId, categoryItems, setActiveCategoryId, setActiveSubcategoryId]);
  const allCategoryRailItems = React.useMemo(
    () =>
      categoryItems.map((category) => ({
        ...category,
        iconUrl: getDshCategoryIconUrl(category.id),
        icon: categoryIconMap[category.id] ?? '📂',
      })),
    [categoryItems]
  );

  const homeFilterRailItems = React.useMemo<BThwaniFilterRailItem[]>(
    () => [
      {
        id: buildHomeCategoryFilterId('all'),
        label: 'الكل',
        icon: ({ selected }) => (
          <Icon
            name="menu-outline"
            size={16}
            color={selected ? theme.textInverse : theme.textMuted}
          />
        ),
      },
      ...discoveryFilters
        .filter((filter) => filter.value !== 'all')
        .map((filter) => ({
          id: buildHomeModeFilterId(filter.value),
          label: filter.label,
          icon: ({ selected }: { selected: boolean }) => (
            <Icon
              name={filter.iconName as React.ComponentProps<typeof Icon>['name']}
              size={16}
              color={selected ? theme.textInverse : theme.textMuted}
            />
          ),
        })),
      ...allCategoryRailItems
        .filter((category) => category.id !== 'all')
        .map((category) => ({
          id: buildHomeCategoryFilterId(category.id),
          label: category.label,
          icon: (
            <CategoryIconImage
              uri={category.iconUrl ?? null}
              emojiFallback={category.icon}
              style={styles.filterChipIcon}
            />
          ),
        })),
    ],
    [allCategoryRailItems, styles.filterChipIcon, theme.textInverse, theme.textMuted],
  );

  const handleHomeFilterRailChange = React.useCallback((itemId: string) => {
    setActiveRailItemId(itemId);

    if (itemId.startsWith(HOME_MODE_FILTER_PREFIX)) {
      setActiveFilter(itemId.slice(HOME_MODE_FILTER_PREFIX.length) as DiscoveryFilter);
      return;
    }

    if (itemId.startsWith(HOME_CATEGORY_FILTER_PREFIX)) {
      const categoryId = itemId.slice(HOME_CATEGORY_FILTER_PREFIX.length);
      selectCategoryPage(categoryId);

      if (categoryId === 'awnak') {
        onOpenCategory?.('awnak');
      }

      if (categoryId === 'shein') {
        onOpenSheinInfo?.();
      }
    }
  }, [onOpenCategory, onOpenSheinInfo, selectCategoryPage, setActiveFilter, setActiveRailItemId]);

  const isHomeFilterRailItemSelected = React.useCallback((item: BThwaniFilterRailItem) => {
    if (item.id.startsWith(HOME_MODE_FILTER_PREFIX)) {
      return item.id === buildHomeModeFilterId(activeFilter);
    }

    if (item.id.startsWith(HOME_CATEGORY_FILTER_PREFIX)) {
      return item.id === buildHomeCategoryFilterId(activeCategoryId);
    }

    return false;
  }, [activeCategoryId, activeFilter]);

  React.useEffect(() => {
    const categoryRailItemId = buildHomeCategoryFilterId(activeCategoryId || 'all');
    if (activeRailItemId.startsWith(HOME_CATEGORY_FILTER_PREFIX) && activeRailItemId !== categoryRailItemId) {
      setActiveRailItemId(categoryRailItemId);
    }
  }, [activeCategoryId, activeRailItemId, setActiveRailItemId]);

  React.useEffect(() => {
    if (!homeFilterRailItems.some((item) => item.id === activeRailItemId)) {
      setActiveRailItemId(buildHomeCategoryFilterId(activeCategoryId || 'all'));
    }
  }, [activeCategoryId, activeRailItemId, homeFilterRailItems, setActiveRailItemId]);

  React.useEffect(() => {
    const timer = globalThis.setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => globalThis.clearInterval(timer);
  }, [setCurrentTime]);

  const homeBackHandler = React.useCallback(() => {
    if (categoriesSheetVisible) { setCategoriesSheetVisible(false); return true; }
    if (shortsVisible) { setShortsVisible(false); return true; }
    if (inlineSearchVisible) { setInlineSearchVisible(false); setInlineSearchQuery(''); return true; }
    if (serviceDialVisible) { setServiceDialVisible(false); return true; }
    if (activeCategoryId !== 'all') {
      const matched = categoryItems.find((c) => c.id === activeCategoryId);
      if (matched?.renderMode === 'manual-order') {
        const formShowing = (activeCategoryId === 'shein' && sheinInlineVisible) ||
                            (activeCategoryId === 'awnak' && awnakInlineVisible);
        if (!formShowing) { selectCategoryPage('all'); return true; }
      }
    }
    return false;
  }, [
    categoriesSheetVisible,
    shortsVisible,
    inlineSearchVisible,
    serviceDialVisible,
    activeCategoryId,
    categoryItems,
    sheinInlineVisible,
    awnakInlineVisible,
    selectCategoryPage,
    setCategoriesSheetVisible,
    setInlineSearchQuery,
    setInlineSearchVisible,
    setServiceDialVisible,
    setShortsVisible,
  ]);

  React.useEffect(() => {
    onRegisterBackHandler?.(homeBackHandler);
    return () => { onRegisterBackHandler?.(null); };
  }, [onRegisterBackHandler, homeBackHandler]);

  const resolveBannerPress = React.useCallback(
    (promo: DshHomeGetPromo) => () => {
      if (promo.id) {
        onPromoClick?.(promo.id);
      }

      if (promo.actionType === 'main_category' || promo.actionType === 'sub_category') {
        const nextHomeContext = resolveHomeCategoryContext(categoryItems, promo.actionTarget);

        if (nextHomeContext) {
          setActiveCategoryId(nextHomeContext.categoryId);
          setActiveSubcategoryId(nextHomeContext.subcategoryId);
          return;
        }

        if (promo.actionTarget === 'shein' && onOpenSheinInfo) {
          onOpenSheinInfo();
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (promo.actionType === 'store') {
        if (promo.actionTarget && onOpenStore) {
          onOpenStore(promo.actionTarget);
          return;
        }

        if (onOpenDiscovery) {
          onOpenDiscovery();
          return;
        }

        setInlineSearchVisible(true);
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

        if (onOpenDiscovery) {
          onOpenDiscovery();
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

        setInlineSearchVisible(true);
        return;
      }

      if (promo.actionType === 'subscription') {
        if (onOpenBenefits) {
          onOpenBenefits(promo.actionTarget);
          return;
        }
        onOpenDiscovery?.();
        return;
      }

      if (promo.actionType === 'external') {
        if (promo.actionTarget === 'home') {
          setActiveCategoryId('all');
          setActiveSubcategoryId(null);
          setActiveFilter('all');
          return;
        }

        if (promo.actionTarget === 'stores' || promo.actionTarget === 'DshStoresList') {
          onOpenList?.();
          return;
        }

        if (promo.actionTarget === 'offers') {
          if (promo.actionExtra && onOpenStore) {
            onOpenStore(promo.actionExtra);
            return;
          }

          setActiveFilter('offers');
          onOpenDiscovery?.();
          return;
        }

        if (promo.actionTarget === 'orders-list' || promo.actionTarget === 'orders') {
          onOpenOrders?.();
          return;
        }

        if (promo.actionTarget === 'tracking') {
          onOpenTracking?.();
          return;
        }

        if (promo.actionTarget === 'entitlements-get' || promo.actionTarget === 'loyalty') {
          onOpenBenefits?.('entitlements-get');
          return;
        }

        if (promo.actionTarget === 'campaign') {
          onOpenDiscovery?.();
          return;
        }

        onOpenDiscovery?.();
        return;
      }

    // Fallback for unknown actions
    onOpenDiscovery?.();
    },
    [
      activeFilter,
      categoryItems,
      onOpenBenefits,
      onOpenDiscovery,
      onOpenList,
      onOpenOrders,
      onOpenProduct,
      onOpenSearch,
      onOpenSheinInfo,
      onOpenStore,
      onOpenStoreCategory,
      onOpenTracking,
      onPromoClick,
      setActiveCategoryId,
      setActiveFilter,
      setActiveSubcategoryId,
      setInlineSearchVisible,
    ]
  );

  const bannerItems = React.useMemo<BannerCarouselItem[]>(() => (
    resolvedPromos.map((promo) => ({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle,
      badge: promo.offerBadgeText,
      cta: promo.ctaLabel,
      image: resolveDshHomeBannerImageSource(promo.imageUrl ?? promo.mediaKey),
      accentColor: promo.accentColor,
      onPress: () => {
        if (onPromoClick) onPromoClick(promo.id);
        resolveBannerPress(promo)();
      },
    }))
  ), [resolvedPromos, onPromoClick, resolveBannerPress]);

  const currentBannerPromo = bannerItems.length ? bannerItems[activePromoIndex % bannerItems.length] ?? null : null;
  const activePromo = currentBannerPromo;
  const activeHomePromo = resolvedHomePromos[0] ?? null;
  const tickerAction = activePromo ? resolveBannerPress(activePromo) : undefined;

  React.useEffect(() => {
    if (!activePromo?.id || !onPromoImpression) {
      return;
    }

    if (promoImpressionIdsRef.current.has(activePromo.id)) {
      return;
    }

    promoImpressionIdsRef.current.add(activePromo.id);
    onPromoImpression(activePromo.id);
  }, [activePromo?.id, onPromoImpression, bannerItems.length]);

  const resolveVideoCtaPress = React.useCallback(
    (item: MarketingGrowthRecord) => {
      onVideoCtaClick?.(item.id);
      setShortsVisible(false);

      if (item.routeTarget === 'main_category' || item.routeTarget === 'sub_category') {
        const nextHomeContext = resolveHomeCategoryContext(categoryItems, item.routeTargetId);

        if (nextHomeContext) {
          setActiveCategoryId(nextHomeContext.categoryId);
          setActiveSubcategoryId(nextHomeContext.subcategoryId);
          return;
        }

        if (item.routeTargetId === 'shein' && onOpenSheinInfo) {
          onOpenSheinInfo();
          return;
        }

        onOpenList?.();
        return;
      }

      if (item.routeTarget === 'store') {
        if (item.routeTargetId && onOpenStore) {
          onOpenStore(item.routeTargetId);
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (item.routeTarget === 'store_category') {
        if (item.routeTargetId && item.routeTargetExtra && onOpenStoreCategory) {
          onOpenStoreCategory(item.routeTargetId, item.routeTargetExtra);
          return;
        }

        if (item.routeTargetId && onOpenStore) {
          onOpenStore(item.routeTargetId);
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (item.routeTarget === 'product') {
        if (item.routeTargetExtra && item.routeTargetId && onOpenProduct) {
          onOpenProduct(item.routeTargetExtra, item.routeTargetId);
          return;
        }

        if (item.routeTargetExtra && onOpenStore) {
          onOpenStore(item.routeTargetExtra);
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (item.routeTarget === 'subscription' || item.routeTarget === 'subscription-family-get' || item.routeTarget === 'entitlements-get') {
        onOpenBenefits?.(item.routeTarget);
        return;
      }

      if (item.routeTarget === 'search') {
        onOpenSearch?.();
        return;
      }

      if (item.routeTarget === 'promo-apply') {
        onOpenBenefits?.('offers');
        return;
      }

      if (onOpenDiscovery) {
        onOpenDiscovery();
        return;
      }

      onOpenList?.();
    },
    [
      categoryItems,
      onOpenBenefits,
      onOpenDiscovery,
      onOpenList,
      onOpenProduct,
      onOpenSearch,
      onOpenSheinInfo,
      onOpenStore,
      onOpenStoreCategory,
      onVideoCtaClick,
      setActiveCategoryId,
      setActiveSubcategoryId,
      setShortsVisible,
    ]
  );

  const approvedVideoReels = React.useMemo(() => approvedVideoShorts.filter((video) => {
    const visibility = getMarketingVideoVisibilityRecord(video, {
      targetSurface: 'home',
      partnerStatus: resolveTargetPartnerStatus(video.targetType, video.targetId),
    });

    return isMarketingRenderable(visibility);
  }), [approvedVideoShorts, resolveTargetPartnerStatus]);
  const tickerState = React.useMemo(() => {
    if (isTickerHidden) {
      return null;
    }

    const clientPlan = buildMarketingTickerPlan(currentTime, 'client', getMarketingTickerItems());
    const activeItem = clientPlan.activeItem;

    if (!activeItem) {
      return {
        isOpen: true,
        statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
        message: currentLanguage === 'ar' ? 'استعرض المتاجر والطلبات النشطة' : 'Browse stores and active orders',
        isMarketing: false,
      };
    }

    return {
      isOpen: true,
      statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
      message: activeItem.message,
      isMarketing: true,
      actionTarget: activeItem.actionTarget,
      needsBinding: true,
    };
  }, [currentLanguage, currentTime, isTickerHidden]);

  const handleTickerAction = React.useCallback(() => {
    if (!tickerState) return;

    if (tickerState.isMarketing) {
      if (tickerState.actionTarget === 'orders') {
        onOpenOrders?.();
      } else if (tickerState.actionTarget === 'tracking') {
        onOpenTracking?.();
      } else if (tickerState.actionTarget === 'promo') {
        onOpenDiscovery?.(); // Fallback for promo
      }
    } else if (tickerAction) {
      tickerAction();
    }
  }, [tickerState, tickerAction, onOpenOrders, onOpenTracking, onOpenDiscovery]);
  const openInlineSearch = React.useCallback(() => {
    setInlineSearchVisible(true);
  }, [setInlineSearchVisible]);

  const closeInlineSearch = React.useCallback(() => {
    setInlineSearchVisible(false);
    setInlineSearchQuery('');
  }, [setInlineSearchQuery, setInlineSearchVisible]);

  const openServiceDial = React.useCallback(() => {
    setServiceDialVisible(true);
  }, [setServiceDialVisible]);

  const categoriesDialItems = React.useMemo<CategoryDialItem[]>(() => {
    return categoryItems.map((category) => ({
      id: category.id,
      key: category.id,
      title: category.label,
      subtitle: category.subtitle,
      iconUrl: getDshCategoryIconUrl(category.id),
      emojiFallback: category.emojiFallback ?? categoryIconMap[category.id] ?? '📂',
    }));
  }, [categoryItems]);

  const activeCategoryDialItem = React.useMemo<CategoryDialItem | null>(() => {
    if (!selectedCategoryFixture) {
      return null;
    }

    return {
      id: selectedCategoryFixture.id,
      key: selectedCategoryFixture.id,
      title: selectedCategoryLabel,
      subtitle: selectedCategoryFixture.subtitle,
      iconUrl: getDshCategoryIconUrl(selectedCategoryFixture.id),
      emojiFallback: selectedCategoryFixture.emojiFallback ?? categoryIconMap[selectedCategoryFixture.id] ?? '📂',
    };
  }, [selectedCategoryFixture, selectedCategoryLabel]);

  const selectedSubcategoryCards = React.useMemo(
    () =>
      selectedSubcategories.map((subcategory) => ({
        id: subcategory.id,
        title: subcategory.label,
        subtitle: subcategory.subtitle,
        emoji: subcategoryIconMap[subcategory.id] ?? '📌',
      })),
    [selectedSubcategories]
  );

  const fallbackCategoriesDialLayout = React.useMemo<DialAnchorLayout>(() => ({
    x: isRtl ? Math.max(spacing[3], viewportWidth - spacing[3] - 54) : spacing[3],
    y: spacing[14],
    width: 54,
    height: 54,
  }), [isRtl, viewportWidth]);

  const openCategoriesDial = React.useCallback(() => {
    const openSheet = (layout?: DialAnchorLayout | null) => {
      setCategoriesDialLayout(layout ?? fallbackCategoriesDialLayout);
      setCategoriesSheetVisible(true);
    };

    if (!categoriesAnchorRef.current?.measureInWindow) {
      openSheet();
      return;
    }

    categoriesAnchorRef.current.measureInWindow((x, y, width, height) => {
      const hasValidLayout = [x, y, width, height].every((value) => Number.isFinite(value)) && width > 0 && height > 0;
      openSheet(hasValidLayout ? { x, y, width, height } : fallbackCategoriesDialLayout);
    });
  }, [fallbackCategoriesDialLayout, setCategoriesDialLayout, setCategoriesSheetVisible]);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const stickyFilterIndex = inlineSearchVisible || bannerItems.length > 0 ? 2 : 1;

  return (
    <View style={styles.screenRoot}>
      {inlineSearchVisible ? (
        <SearchTopBar
          value={inlineSearchQuery}
          onChangeText={setInlineSearchQuery}
          onClose={closeInlineSearch}
          variant="main"
          autoFocus
          placeholder="ابحث عن متجر، خدمة، أو فئة..."
          style={styles.brandTopBarShell}
        />
      ) : (
        <ModernPremiumHeader
          title={uiText.topBar.brandName}
          locationLabel={uiText.topBar.location}
          onSearchPress={openInlineSearch}
          onCartPress={handleOpenCartFromHeader}
          onNotificationsPress={onOpenNotifications}
          onProfilePress={handleOpenMySpace}
          onLauncherPress={openServiceDial}
          notificationCount={notificationCount}
          cartCount={cartCount}
          searchPlaceholder="ماذا تريد أن تطلب اليوم؟"
          tickerMessage={tickerState?.message ?? ''}
          onTickerPress={handleTickerAction}
          onLocationPress={undefined}
          direction={isRtl ? 'rtl' : 'ltr'}
        />
      )}

      <ScrollView
        style={{ flex: 1 }}
        stickyHeaderIndices={[stickyFilterIndex]}
        contentContainerStyle={{
          paddingHorizontal: spacing[3],
          paddingTop: spacing[0],
          paddingBottom: 150,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {inlineSearchVisible ? null : bannerItems.length ? (
          <BannerCarousel
            banners={bannerItems}
            variant="secondary"
            height={cardHeight + spacing[6]}
            fullBleed={false}
            autoPlayInterval={ACTIVE_PROMO_INTERVAL_MS}
            itemGap={resolvedItemGap}
            onIndexChange={setActivePromoIndex}
            onBannerPress={(item) => {
              if (onPromoClick) onPromoClick(item.id);
            }}
            style={{
              marginLeft: -spacing[3],
              marginRight: -spacing[3],
              width: containerWidth,
            }}
          />
        ) : null}

        <View style={styles.categoriesSelectorSection}>
          <View style={styles.categoriesSelectorRow}>
            <View style={styles.fixedIconsContainer}>
              <CategorySelectorItem
                isVideo
                label="فيديو"
                icon={<Icon name="play" size={22} color={colorPalette.brand} />}
                onPress={() => setShortsVisible(true)}
                styles={styles}
                theme={theme}
              />

              <View ref={categoriesAnchorRef} collapsable={false}>
                <CategorySelectorItem
                  isHub
                  label="الفئات"
                  icon={<CategoryHubIcon />}
                  onPress={openCategoriesDial}
                  styles={styles}
                  theme={theme}
                />
              </View>

              {selectedCategoryFixture && (
                <CategorySelectorItem
                  isSelected
                  label={selectedCategoryLabel}
                  icon={
                    <CategoryIconImage
                      uri={activeCategoryDialItem?.iconUrl ?? null}
                      emojiFallback={activeCategoryDialItem?.emojiFallback ?? categoryIconMap[selectedCategoryFixture.id] ?? '📂'}
                      style={styles.categoryIconImage}
                    />
                  }
                  onPress={() => setActiveSubcategoryId(null)}
                  styles={styles}
                  theme={theme}
                />
              )}
            </View>

            {activeHomePromo && (
              <Pressable
                style={styles.heroPromoCard}
                onPress={() => {
                  const promo = activeHomePromo;
                  const mockPromo: DshHomeGetPromo = {
                    id: promo.id,
                    title: promo.title,
                    subtitle: promo.subtitle,
                    icon: '✨',
                    actionType: normalizeHomePromoActionType(promo.targetType),
                    actionTarget: promo.targetId,
                  };
                  resolveBannerPress(mockPromo)();
                }}
              >
                {activeHomePromo.imageUrl && (
                  <Image
                    source={resolveDshHomeBannerImageSource(activeHomePromo.imageUrl)}
                    style={styles.heroPromoBackground}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.heroPromoContent}>
                  <View style={styles.heroPromoIconContainer}>
                    {activeHomePromo.thumbnail ? (
                      <Image
                        source={resolveDshHomeBannerImageSource(activeHomePromo.thumbnail)}
                        style={styles.heroPromoMascot}
                        resizeMode="contain"
                      />
                    ) : (
                      <Icon name="ribbon-outline" size={32} color={colorPalette.warning} />
                    )}
                  </View>
                  <View style={styles.heroPromoTextWrap}>
                    <Text style={styles.heroPromoTitle} numberOfLines={1}>
                      بثواني برو
                    </Text>
                    <Text style={styles.heroPromoSubtitle} numberOfLines={1}>
                      {activeHomePromo.subtitle}
                    </Text>
                    {activeHomePromo.ctaText && (
                      <View style={styles.heroPromoCtaButton}>
                        <Text style={styles.heroPromoCtaText}>
                          {activeHomePromo.ctaText}
                        </Text>
                        <Icon name="chevron-back" size={10} color="white" />
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            )}

            {selectedSubcategoryCards.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                contentContainerStyle={styles.categoriesSelectorScrollContent}
                style={styles.categoriesSelectorScroll}
              >
                {selectedSubcategoryCards.map((subcategory) => (
                  <Pressable
                    key={subcategory.id}
                    style={[
                      styles.subcategorySelectorCard,
                      activeSubcategoryId === subcategory.id && styles.subcategorySelectorCardActive,
                    ]}
                    onPress={() => setActiveSubcategoryId(subcategory.id)}
                  >
                    <View style={styles.subcategoryIconContainer}>
                      <Text role="titleSm" style={styles.subcategoryEmoji}>
                        {subcategory.emoji}
                      </Text>
                    </View>
                    <Text
                      role="bodySm"
                      style={[
                        styles.subcategoryName,
                        activeSubcategoryId === subcategory.id && styles.subcategoryNameActive,
                      ]}
                      numberOfLines={1}
                    >
                      {subcategory.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        <BThwaniFilterRail
          items={homeFilterRailItems}
          selectedId={activeRailItemId}
          onSelectedIdChange={handleHomeFilterRailChange}
          isSelected={isHomeFilterRailItemSelected}
          sticky
          style={styles.filtersRail}
          testID="home-filter-rail"
        />

        <BThwaniFilterSwipeBoundary
          items={homeFilterRailItems}
          selectedId={activeRailItemId}
          onSelectedIdChange={handleHomeFilterRailChange}
          style={styles.storeListViewport}
          testID="home-filter-swipe-boundary"
        >
          <View style={styles.storeListContent}>
            {activeStorePage?.renderMode === 'manual-order' ? (
              <Box gap={3}>
                {activeStorePage.categoryId === 'shein' && sheinInlineVisible ? (
                  <DshSheinOrderCreateScreen
                    embedded
                    onClose={() => {
                      onCloseSheinInline?.();
                      selectCategoryPage('all');
                    }}
                  />
                ) : null}
                {activeStorePage.categoryId === 'awnak' && awnakInlineVisible ? (
                  <DshAwnakOrderCreateScreen
                    embedded
                    onClose={() => {
                      onCloseAwnakInline?.();
                      selectCategoryPage('all');
                    }}
                  />
                ) : null}
                {!sheinInlineVisible && !awnakInlineVisible && (
                  <EmptyFeed query={inlineSearchQuery} styles={styles} />
                )}
              </Box>
            ) : null}

            {activeHomeStoreCards.length ? (
              <FlatList
                data={activeHomeStoreCards}
                keyExtractor={(entry) => entry.storeId}
                scrollEnabled={false}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={7}
                removeClippedSubviews={Platform.OS !== 'web'}
                renderItem={React.useCallback(({ item: entry }) => (<HomeStoreCardItem entry={entry} onOpenStore={onOpenStore} onToggleFavorite={onToggleFavorite} setLocalFavoriteToggles={setLocalFavoriteToggles} />), [onOpenStore, onToggleFavorite, setLocalFavoriteToggles])}
              />
            ) : activeStorePage?.renderMode !== 'manual-order' ? (
              <EmptyFeed query={inlineSearchQuery} styles={styles} />
            ) : null}
          </View>
        </BThwaniFilterSwipeBoundary>

        {shortsVisible
          ? (renderApprovedVideoReelsViewer?.({
              visible: shortsVisible,
              items: approvedVideoReels,
              initialIndex: 0,
              onClose: () => setShortsVisible(false),
              onCtaPress: resolveVideoCtaPress,
              onItemImpression: (item) => onVideoImpression?.(item.id),
            }) ?? (
              <DshHomeApprovedVideoReelsViewer
                visible={shortsVisible}
                items={approvedVideoReels}
                initialIndex={0}
                onClose={() => setShortsVisible(false)}
                onCtaPress={resolveVideoCtaPress}
                onItemImpression={(item) => onVideoImpression?.(item.id)}
              />
            ))
          : null}
      </ScrollView>

      <CategoryOrbitCarousel
        visible={categoriesSheetVisible}
        anchorLayout={categoriesDialLayout}
        items={categoriesDialItems}
        onClose={() => setCategoriesSheetVisible(false)}
        onSelect={(item) => {
          selectCategoryPage(item.key);
          setCategoriesSheetVisible(false);
          if (item.key === 'awnak') {
            onOpenCategory?.('awnak');
            return;
          }

          if (item.key === 'shein') {
            onOpenSheinInfo?.();
          }
        }}
      />

      <ServiceOrbitCarousel
        visible={serviceDialVisible}
        anchorLayout={serviceDialAnchorLayout}
        items={serviceDialItems}
        onClose={() => setServiceDialVisible(false)}
        onSelect={(item) => {
          setServiceDialVisible(false);

          if (item.key === 'dsh') {
            return;
          }

          if (item.key === 'wlt') {
            onOpenWallet?.();
            return;
          }

          onOpenService?.(item.key as DshServiceId);
        }}
      />

    </View>
  );
}

function createStyles(direction: Direction, theme: ReturnType<typeof useTheme>['theme']) {
  const rowDirection = resolveRowDirection(direction);
  const textAlign = resolveTextAlign(direction);

  return StyleSheet.create({
    screenRoot: {
      flex: 1,
      backgroundColor: theme.background,
      position: 'relative',
    },
    brandTopBarShell: {
      marginTop: spacing[0],
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'visible',
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      backgroundColor: colorPalette.brand,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: colorPalette.black,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderBottomWidth: 1,
      borderBottomColor: withAlpha(colorPalette.white, 0.1),
    },
    premiumBannerSection: {
      marginTop: spacing[0],
      marginBottom: 0,
      paddingHorizontal: 0,
      alignSelf: 'stretch',
    },
    premiumBannerScrollContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumBannerCard: {
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: colorPalette.surfaceRaised,
      elevation: 6,
      shadowColor: colorPalette.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    premiumBannerCardActive: {
      borderColor: withAlpha(colorPalette.white, 0.2),
      borderWidth: 1,
      shadowOpacity: 0.18,
      shadowRadius: 20,
    },
    premiumBannerImageWrap: {
      flex: 1,
      position: 'relative',
      backgroundColor: colorPalette.surfaceRaised,
    },
    premiumBannerImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      zIndex: 2,
    },
    premiumBannerOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 3,
    },
    bannerBrandAccentLine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '36%',
      backgroundColor: withAlpha(colorPalette.white, 0.08),
      zIndex: 3,
    },
    premiumBannerBottomShade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '54%',
      backgroundColor: withAlpha(colorPalette.black, 0.4),
      zIndex: 3,
    },
    premiumBannerLogoWrap: {
      position: 'absolute',
      top: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colorPalette.white,
      padding: 3,
      elevation: 6,
      zIndex: 5,
    },
    premiumBannerLogo: {
      width: '100%',
      height: '100%',
    },
    premiumBannerBadge: {
      position: 'absolute',
      top: 14,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      elevation: 6,
      zIndex: 5,
    },
    premiumBannerBadgeText: {
      color: colorPalette.white,
      fontSize: 11,
      fontWeight: '900',
    },
    premiumBannerContent: {
      flex: 1,
      paddingHorizontal: 14,
      paddingTop: 40,
      paddingBottom: 14,
      zIndex: 4,
      justifyContent: 'flex-end',
    },
    premiumBannerTitle: {
      color: colorPalette.white,
      fontSize: 17,
      fontWeight: '900',
      textShadowColor: withAlpha(colorPalette.black, 0.4),
      textShadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      lineHeight: 20,
      textAlign,
    },
    premiumBannerSubtitle: {
      color: withAlpha(colorPalette.white, 0.95),
      fontSize: 10,
      fontWeight: '600',
      marginTop: 3,
      textShadowColor: withAlpha(colorPalette.black, 0.3),
      textShadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      lineHeight: 13,
      textAlign,
    },
    premiumBannerCta: {
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      alignSelf: 'flex-start',
      elevation: 5,
      zIndex: 5,
    },
    premiumBannerCtaText: {
      fontSize: 10,
      fontWeight: '900',
    },
    premiumCarouselControls: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    premiumCarouselControlsRtl: {
      flexDirection: 'row-reverse',
    },
    premiumIndicatorRow: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      backgroundColor: withAlpha(colorPalette.black, 0.3),
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    premiumIndicator: {
      width: 5,
      height: 5,
      borderRadius: 999,
      backgroundColor: withAlpha(colorPalette.white, 0.4),
    },
    premiumIndicatorActive: {
      width: 18,
      height: 6,
      backgroundColor: colorPalette.white,
    },
    premiumPauseBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: withAlpha(colorPalette.black, 0.4),
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoriesSelectorSection: {
      marginBottom: spacing[1], // Reduced from spacing[2]
    },
    categoriesSelectorRow: {
      flexDirection: rowDirection,
      alignItems: 'flex-start',
      gap: 4, // Further reduced to minimize space as requested
    },
    fixedIconsContainer: {
      flexDirection: rowDirection,
      alignItems: 'flex-start',
      gap: 8,
      flexShrink: 0,
    },
    categorySelectorCard: {
      alignItems: 'center',
      gap: 4,
    },
    videoIconContainer: {
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.line,
    },
    categoryNameContainer: {
      alignItems: 'center',
      minHeight: 18,
    },
    categoryName: {
      color: theme.text,
      fontWeight: '700',
      fontSize: 11,
      textAlign: 'center',
    },
    categoryIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 20, // More premium rounded corner
      backgroundColor: theme.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 0.5,
      borderColor: withAlpha(colorPalette.black, 0.05),
      shadowColor: colorPalette.black,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 2,
    },
    categoryIconContainerSelected: {
      backgroundColor: theme.brandSurface,
      borderColor: theme.brand,
      borderWidth: 1.5,
    },
    categoryHubIconContainer: {
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.line,
    },
    categoryIconImage: {
      width: 32,
      height: 32,
    },
    categoryNameContainerSelected: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    heroPromoCard: {
      flex: 1.6,
      height: 74, // Matches the height of CategorySelectorItem (56 icon + 4 gap + 14 text)
      borderRadius: 18,
      backgroundColor: colorPalette.surfaceAlt,
      borderWidth: 1,
      borderColor: colorPalette.surfaceInset,
      paddingHorizontal: 12,
      justifyContent: 'center',
      overflow: 'hidden',
      elevation: 2,
      shadowColor: colorPalette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    heroPromoBackground: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      opacity: 0.03,
    },
    heroPromoContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      zIndex: 2,
    },
    heroPromoIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: withAlpha(colorPalette.warning, 0.08),
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroPromoMascot: {
      width: 36,
      height: 36,
    },
    heroPromoTextWrap: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 1, // Tight vertical spacing to prevent distortion
    },
    heroPromoTitle: {
      color: colorPalette.brandStrong,
      fontWeight: '900',
      fontSize: 15, // Slightly larger for prominence
      lineHeight: 18,
      textAlign: 'right',
    },
    heroPromoSubtitle: {
      color: colorPalette.inkMuted,
      fontSize: 9,
      fontWeight: '700',
      marginTop: 0,
      textAlign: 'right',
      marginBottom: 2,
    },
    heroPromoCtaButton: {
      backgroundColor: colorPalette.brand,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      height: 22, // Fixed height for consistency
      borderRadius: 8,
      gap: 3,
    },
    heroPromoCtaText: {
      color: colorPalette.white,
      fontSize: 9,
      fontWeight: '900',
    },
    heroPagerRow: {
      marginTop: 4,
      alignItems: 'center',
    },
    heroPagerActive: {
      width: 12,
      height: 3,
      borderRadius: 2,
      backgroundColor: withAlpha(colorPalette.white, 0.3),
    },
    categoriesSelectorScroll: {
      flex: 1,
    },
    categoriesSelectorScrollContent: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: 8,
    },
    subcategorySelectorCard: {
      flexDirection: rowDirection,
      alignItems: 'center',
      backgroundColor: theme.surfaceInset,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
      borderWidth: 1,
      borderColor: theme.line,
    },
    subcategorySelectorCardActive: {
      backgroundColor: theme.brand,
      borderColor: theme.brand,
    },
    subcategoryIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subcategoryEmoji: {
      fontSize: 14,
    },
    subcategoryName: {
      color: theme.text,
      fontWeight: '700',
      fontSize: 12,
    },
    subcategoryNameActive: {
      color: theme.textInverse,
    },
    filtersRail: {
      marginHorizontal: -spacing[3],
      paddingHorizontal: spacing[3],
      paddingTop: 0, // Removed top padding
      paddingBottom: spacing[2], // Reduced from spacing[3]
    },
    filterChipIcon: {
      width: 16,
      height: 16,
    },
    storeListViewport: {
      marginTop: 0, // Removed top margin for direct transition
      flex: 1,
    },
    storeListContent: {
      gap: spacing[1], // Adjusted to 4px for a clean, tight distance between cards
      paddingBottom: spacing[8],
    },
    emptyFeed: {
      borderRadius: 24,
      backgroundColor: theme.surface,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.line,
    },
    emptyFeedEmoji: {
      fontSize: 48,
    },
    emptyFeedTitle: {
      color: theme.text,
      textAlign: 'center',
    },
    emptyFeedText: {
      color: theme.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    storeListCard: {
      width: '100%',
    },
  });
}

export default DshHomeGetScreen;
