import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';

import {
  Box,
  CategoryOrbitCarousel,
  Icon,
  SearchTopBar,
  StateView,
  StoreCardPremium,
  type StoreCardPremiumItem,
  Surface,
  Text,
  TopBar,
  colorPalette,
  radius,
  resolveRowDirection,
  resolveTextAlign,
  sizes,
  spacing,
  ServiceOrbitCarousel,
  type OrbitAnchorLayout,
  type OrbitCarouselItem,
  type Direction,
  useDirection,
  useTheme,
  useUiText,
} from '@bthwani/ui-kit';
import { DshAwnakOrderCreateScreen } from '../parts/AwnakOrderCreateScreen';
import { DshSheinOrderCreateScreen } from '../parts/SheinOrderCreateScreen';
import {
  DshHomeApprovedVideoReelsViewer,
  type DshHomeApprovedVideoReelsViewerProps,
} from '../parts/ApprovedVideoReelsViewer';
import { getDshCategoryIconUrl } from '../shared/get-dsh-category-icon-url';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import type { MarketingGrowthRecord } from '../../shared/growth.preview-store';
import type { MarketingVideoRecord } from '../../shared/video.preview-store';
import {
  getMarketingTickerItems,
  buildMarketingTickerPlan,
  type MarketingNewsTickerItem,
} from '../../shared/news-ticker.preview-store';
import { getPublishedHomePromos, type HomePromoRecord } from '../../shared/promo.preview-store';

import { canRenderInClientSurface } from '../../shared/workflow';

function resolveDshHomeStoreImageSource(imageUri?: string, publishStage?: string): ImageSourcePropType | undefined {
  if (!canRenderInClientSurface(publishStage, 'store')) {
    return undefined;
  }
  return resolveDshImageSource(imageUri);
}

function resolveDshHomeBannerImageSource(imageUrl?: string): ImageSourcePropType | undefined {
  return resolveDshImageSource(imageUrl);
}

function normalizeHomePromoActionType(targetType: string): DshHomeBannerActionType | undefined {
  if (targetType === 'category') {
    return 'main_category';
  }

  switch (targetType) {
    case 'main_category':
    case 'sub_category':
    case 'store':
    case 'external':
    case 'store_category':
    case 'product':
    case 'subscription':
      return targetType;
    default:
      return undefined;
  }
}

function resolveHomePromoPublishStage(status: HomePromoRecord['status']) {
  return status === 'published' ? 'published-preview' : 'draft';
}

type CategoryDialItem = OrbitCarouselItem;
type DialAnchorLayout = OrbitAnchorLayout;

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
  onOpenService?: (serviceId: DshServiceId) => void;
  onOpenList?: () => void;
  onOpenCategory?: (categoryId: string) => void;
  onOpenDiscovery?: () => void;
  onOpenStoreCategory?: (storeId: string, categoryId: string) => void;
  onOpenProduct?: (storeId: string, itemId: string) => void;
  onOpenBenefits?: (screenId?: string) => void;
  onOpenFavorites?: () => void;
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
  renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
  onRetry?: () => void;
};

export type DshHomeCategory = {
  id: string;
  label: string;
  subtitle?: string;
  countLabel?: string;
  renderMode?: 'stores' | 'manual-order';
  emojiFallback?: string;
  subcategories?: Array<{
    id: string;
    label: string;
    subtitle: string;
  }>;
};

export type DshHomeBannerActionType = 'main_category' | 'sub_category' | 'store' | 'external' | 'store_category' | 'product' | 'subscription';

type DiscoveryFilter = 'all' | 'favorites' | 'nearest' | 'new' | 'offers';

type StorePagerPage = {
  categoryId: string;
  renderMode: 'stores' | 'manual-order';
  stores: DshHomeGetStore[];
};

type DshHomeGetStyles = ReturnType<typeof createStyles>;
type DshHomeTheme = ReturnType<typeof useTheme>['theme'];

export type DshHomeGetPromo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionType?: DshHomeBannerActionType;
  actionTarget?: string;
  actionExtra?: string;
  mediaKey?: string;
  imageUrl?: string;
  accentColor?: string;
  ctaLabel?: string;
  templateId?: string;
  partnerLogoUrl?: string;
  partnerLogoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offerBadgeText?: string;
  offerBadgeColor?: string;
  offerBadgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl?: string;
  overlayPosition?: 'center' | 'bottom' | 'top' | 'fill';
  overlayOpacity?: number;
  titlePlacement?: 'top' | 'center' | 'bottom';
  subtitlePlacement?: 'top' | 'center' | 'bottom';
  ctaPlacement?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  imageFit?: 'cover' | 'contain';
  motionStyle?: 'slide' | 'soft-parallax' | 'subtle-fade' | 'snap-focus';
  autoplayEnabled?: boolean;
  autoplayIntervalMs?: number;
  pauseOnInteraction?: boolean;
};

export type DshHomeGetStore = {
  id: string;
  name: string;
  address: string;
  categoryId?: string;
  mediaKey?: string;

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
  hasBthwaniPro?: boolean;
  hasNewProducts?: boolean;
  hasCouponAvailable?: boolean;
  publishStage?: string;
  commercialSourceMap?: import('../../shared/store-card-commercial-map').CommercialSourceMap;
};

export type DshHomeRecentOrder = {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  meta: string;
  statusLabel: string;
};

type DshServiceId = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

const serviceDialAnchorLayout: DialAnchorLayout = {
  x: spacing[3],
  y: spacing[14],
  width: 46,
  height: 46,
};

const serviceDialItems: CategoryDialItem[] = [
  {
    id: 'service-dsh',
    key: 'dsh',
    title: 'توصيل',
    iconUrl: null,
    emojiFallback: '🚚',
  },
  {
    id: 'service-knz',
    key: 'knz',
    title: 'كنز',
    iconUrl: null,
    emojiFallback: '🪙',
  },
  {
    id: 'service-amn',
    key: 'amn',
    title: 'أمان',
    iconUrl: null,
    emojiFallback: '🛡️',
  },
  {
    id: 'service-arb',
    key: 'arb',
    title: 'عربون',
    iconUrl: null,
    emojiFallback: '💳',
  },
  {
    id: 'service-wlt',
    key: 'wlt',
    title: 'المحفظة',
    iconUrl: null,
    emojiFallback: '👛',
  },
  {
    id: 'service-esf',
    key: 'esf',
    title: 'أسعفني',
    iconUrl: null,
    emojiFallback: '🩺',
  },
  {
    id: 'service-kwd',
    key: 'kwd',
    title: 'كوادر',
    iconUrl: null,
    emojiFallback: '🧰',
  },
  {
    id: 'service-mrf',
    key: 'mrf',
    title: 'معروف',
    iconUrl: null,
    emojiFallback: '🏷️',
  },
  {
    id: 'service-snd',
    key: 'snd',
    title: 'سند',
    iconUrl: null,
    emojiFallback: '🤝',
  },
];

const serviceLauncherMarkStyles = StyleSheet.create({
  root: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colorPalette.brandSurface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orbit: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colorPalette.brandStrong,
    borderTopColor: colorPalette.brand,
  },
  needle: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 5,
    height: 15,
    borderRadius: 999,
    backgroundColor: colorPalette.brandStrong,
    transform: [{ rotate: '24deg' }],
  },
  planeWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.white,
  },
});

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
  sweets_juices: '🧃',
  anaqati: '👗',
  wani_store: '🏪',
  home_projects: '🏠',
  cloud_kitchens: '🍳',
  awnak: '🤝',
  gas_refill: '⛽',
  shein: '🛍️',
  spare_parts: '🔧',
  honey_dates: '🍯',
  electronics: '📱',
};

const subcategoryIconMap: Record<string, string> = {
  grocery_vegetables_fruits: '🥬',
  grocery_meat_fish_chicken: '🥩',
  grocery_roasted_spices: '🌰',
  grocery_bakeries: '🍞',
  grocery_deals_bundle: '🎁',
  sweets_juices_fresh: '🧃',
  sweets_juices_sweets: '🍰',
  sweets_juices_icecream: '🍦',
  anaqati_perfumes: '🌸',
  anaqati_accessories_beauty: '💄',
  anaqati_clothing: '👕',
  gas_refill_refill: '🧯',
  gas_refill_repair: '🛠️',
  gas_refill_buy: '🧰',
};

function CategoryIconImage({
  uri,
  emojiFallback,
  style,
}: {
  uri: string | null;
  emojiFallback: string;
  style: object;
}) {
  const [failed, setFailed] = React.useState(false);

  if (!uri || failed) {
    return <Text role="titleLg" style={style}>{emojiFallback}</Text>;
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

function DshServiceLauncherMark() {
  return (
    <View style={serviceLauncherMarkStyles.root}>
      <View style={serviceLauncherMarkStyles.orbit} />
      <View style={serviceLauncherMarkStyles.needle} />
      <View style={serviceLauncherMarkStyles.planeWrap}>
        <Icon name="paper-plane" size={12} color={colorPalette.brand} />
      </View>
    </View>
  );
}

function CategoryHubIcon() {
  return (
    <Ionicons name="grid-outline" size={22} color={colorPalette.brand} />
  );
}

function isWithinOperatingHours(now: Date, openHour: number, closeHour: number) {
  const currentHour = now.getHours();

  if (openHour < closeHour) {
    return currentHour >= openHour && currentHour < closeHour;
  }

  return currentHour >= openHour || currentHour < closeHour;
}

function dedupeMarketingTickerItems(items: ReadonlyArray<MarketingNewsTickerItem>) {
  const seenIds = new Set<string>();

  return items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
}

// Internal resolveTickerBanner removed. Using buildMarketingTickerPlan from store.

/**
 * Internal helper for Category selection items
 */
function CategorySelectorItem({
  label,
  icon,
  onPress,
  isSelected,
  isHub,
  isVideo,
  styles,
  theme,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  isSelected?: boolean;
  isHub?: boolean;
  isVideo?: boolean;
  styles: DshHomeGetStyles;
  theme: DshHomeTheme;
}) {
  return (
    <Pressable style={styles.categorySelectorCard} onPress={onPress}>
      <View
        style={[
          styles.categoryIconContainer,
          isHub && styles.categoryHubIconContainer,
          isVideo && styles.videoIconContainer,
          isSelected && styles.categoryIconContainerSelected,
        ]}
      >
        {icon}
      </View>
      <View style={[styles.categoryNameContainer]}>
        <Text role="bodySm" style={[styles.categoryName, isSelected && { color: theme.brand }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Internal helper for Filter Chips
 */
function FilterChipItem({
  label,
  icon,
  onPress,
  isActive,
  styles,
  theme,
}: {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  isActive: boolean;
  styles: DshHomeGetStyles;
  theme: DshHomeTheme;
}) {
  return (
    <Pressable
      style={[
        styles.filterChip,
        {
          backgroundColor: isActive ? theme.brand : 'transparent',
          borderColor: isActive ? theme.brand : theme.line,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.filterChipContent}>
        {icon && <View style={styles.filterChipIconWrap}>{icon}</View>}
        <Text
          role="bodySm"
          style={[styles.filterChipLabel, { color: isActive ? theme.textInverse : theme.textMuted }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

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

/**
 * Empty state helper to reduce redundancy
 */
function EmptyFeed({ query, styles }: { query?: string; styles: DshHomeGetStyles }) {
  const isSearch = Boolean(query?.trim());
  return (
    <View style={styles.emptyFeed}>
      <Text style={styles.emptyFeedEmoji}>{isSearch ? '🔎' : '🍽️'}</Text>
      <Text role="titleSm" style={styles.emptyFeedTitle}>
        {isSearch ? 'لا توجد نتائج داخل هذه الفئة' : 'لا توجد متاجر لهذه الفئة بعد'}
      </Text>
      <Text role="bodySm" style={styles.emptyFeedText}>
        {isSearch ? 'جرّب تغيير البحث أو انتقل إلى فئة أخرى.' : 'أضف متاجر لهذه الفئة كي تظهر هنا.'}
      </Text>
    </View>
  );
}

export function DshHomeGetScreen({
  state = 'ready',
  categories,
  promos,
  stores,
  recentOrders = [],
  onBack,
  onOpenList,
  onOpenCategory,
  onOpenDiscovery,
  onOpenStoreCategory,
  onOpenProduct,
  onOpenBenefits,
  onOpenFavorites,
  onOpenSearch,
  onOpenCart,
  onOpenOrders,
  onOpenTracking,
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
  approvedVideoShorts = [],
  renderApprovedVideoReelsViewer,
  onRetry,
  onOpenEntry,
  homePromos,
}: DshHomeGetScreenProps) {
  const { direction, language: resolvedLanguage } = useDirection();
  const currentLanguage = resolvedLanguage ?? 'ar';
  const isRtl = direction === 'rtl';
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const { theme } = useTheme();
  const uiText = useUiText();
  const styles = React.useMemo(() => createStyles(direction, theme), [direction, theme]);
  const categoriesAnchorRef = React.useRef<View>(null);
  const [categoriesSheetVisible, setCategoriesSheetVisible] = React.useState(false);
  const [categoriesDialLayout, setCategoriesDialLayout] = React.useState<DialAnchorLayout | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
  const [activeCategoryId, setActiveCategoryId] = React.useState<string>('all');
  const [activeSubcategoryId, setActiveSubcategoryId] = React.useState<string | null>(null);
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);
  const promoScrollRef = React.useRef<React.ElementRef<typeof ScrollView> | null>(null);
  const [favoriteToggles, setFavoriteToggles] = React.useState<Record<string, boolean>>({});
  const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
  const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});
  const [shortsVisible, setShortsVisible] = React.useState(false);
  const promoImpressionIdsRef = React.useRef<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = React.useState(() => new Date());
  const [inlineSearchVisible, setInlineSearchVisible] = React.useState(false);
  const [inlineSearchQuery, setInlineSearchQuery] = React.useState('');
  const [serviceDialVisible, setServiceDialVisible] = React.useState(false);
  const handleOpenMySpace = React.useCallback(() => {
    if (onOpenMySpace) {
      onOpenMySpace();
      return;
    }

    onOpenEntry?.();
  }, [onOpenEntry, onOpenMySpace]);

  const resolvedCategories = categories ?? [];
  const resolvedPromos = promos ?? [];
  const resolvedHomePromos = (homePromos ?? getPublishedHomePromos()).filter((promo) => (
    canRenderInClientSurface(resolveHomePromoPublishStage(promo.status), 'promo')
  ));

  const containerWidth = viewportWidth;
  const sidePeek = Math.max(spacing[1], Math.min(spacing[4], Math.round(containerWidth * 0.045)));
  const itemGap = Math.max(spacing[1], Math.min(spacing[2], Math.round(containerWidth * 0.018)));
  const baseCardWidth = Math.max(256, Math.min(326, Math.round(containerWidth - (sidePeek * 2) - (itemGap * 2))));
  const cardWidth = Math.max(220, Math.round(baseCardWidth * 0.84));
  const cardHeight = Math.max(160, Math.round(cardWidth * 0.78));
  const itemWidth = cardWidth + itemGap;
  const horizontalPadding = Math.max(0, Math.round((containerWidth - cardWidth) / 2));
  const resolvedStores = (stores ?? []).filter((store) => canRenderInClientSurface(store.publishStage, 'store'));
  const resolvedRecentOrders = recentOrders ?? [];

  const categoryItems = React.useMemo(() => {
    return resolvedCategories;
  }, [resolvedCategories]);

  const bannerItems = React.useMemo(() => (
    resolvedPromos.map((promo) => ({
      ...promo,
      image: resolveDshHomeBannerImageSource(promo.imageUrl ?? promo.mediaKey),
    }))
  ), [resolvedPromos]);
  const [isCarouselUserPaused, setIsCarouselUserPaused] = React.useState(false);
  const [isCarouselInteractionPaused, setIsCarouselInteractionPaused] = React.useState(false);
  const interactionResumeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCarouselPaused = isCarouselUserPaused || isCarouselInteractionPaused;

  const categoryPageIds = React.useMemo(() => ['all', ...categoryItems.map((category) => category.id)], [categoryItems]);

  const resolveStoresForCategory = React.useCallback((categoryId: string) => {
    const categoryScopedStores =
      categoryId && categoryId !== 'all'
        ? resolvedStores.filter((store) => (store.categoryId ? store.categoryId === categoryId : false))
        : resolvedStores;

    const filteredByMode = categoryScopedStores.filter((store) => {
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

    const normalizedQuery = inlineSearchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return filteredByMode;
    }

    return filteredByMode.filter((store) => {
      const haystack = [
        store.name,
        store.address,
        store.deliveryLabel,
        store.serviceLabel,
        store.offerLabel ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
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

  const selectCategoryPage = React.useCallback((categoryId: string, _animated = true) => {
    setActiveCategoryId(categoryId);
    setActiveSubcategoryId(null);
  }, []);

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
  const selectedSubcategories = selectedCategoryFixture?.subcategories ?? [];
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
  }, [activeCategoryId, categoryItems]);
  const allCategoryRailItems = React.useMemo(
    () =>
      categoryItems.map((category) => ({
        ...category,
        iconUrl: getDshCategoryIconUrl(category.id),
        icon: categoryIconMap[category.id] ?? '📂',
      })),
    [categoryItems]
  );

  const currentBannerPromo = bannerItems.length ? bannerItems[activePromoIndex % bannerItems.length] ?? null : null;
  const activePromoMotionStyle = currentBannerPromo?.motionStyle ?? 'slide';
  const activePromoAutoplayEnabled = currentBannerPromo?.autoplayEnabled ?? true;
  const activePromoAutoplayIntervalMs = Math.max(2500, currentBannerPromo?.autoplayIntervalMs ?? 4500);
  const activePromoPauseOnInteraction = currentBannerPromo?.pauseOnInteraction ?? true;

  const clearInteractionResumeTimer = React.useCallback(() => {
    if (interactionResumeTimeoutRef.current) {
      clearTimeout(interactionResumeTimeoutRef.current);
      interactionResumeTimeoutRef.current = null;
    }
  }, []);

  const scheduleCarouselResume = React.useCallback(() => {
    if (!activePromoPauseOnInteraction || isCarouselUserPaused) {
      return;
    }

    clearInteractionResumeTimer();
    interactionResumeTimeoutRef.current = setTimeout(() => {
      setIsCarouselInteractionPaused(false);
      interactionResumeTimeoutRef.current = null;
    }, 2200);
  }, [activePromoPauseOnInteraction, clearInteractionResumeTimer, isCarouselUserPaused]);

  React.useEffect(() => () => {
    clearInteractionResumeTimer();
  }, [clearInteractionResumeTimer]);

  React.useEffect(() => {
    if (bannerItems.length <= 1 || isCarouselPaused || !activePromoAutoplayEnabled) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((current) => {
        const next = (current + 1) % bannerItems.length;
        promoScrollRef.current?.scrollTo({ x: next * itemWidth, animated: true });
        return next;
      });
    }, activePromoAutoplayIntervalMs);

    return () => clearInterval(interval);
  }, [activePromoAutoplayEnabled, activePromoAutoplayIntervalMs, bannerItems.length, isCarouselPaused, itemWidth]);

  React.useEffect(() => {
    if (!bannerItems.length) {
      return;
    }

    if (activePromoIndex >= bannerItems.length) {
      setActivePromoIndex(0);
    }
  }, [activePromoIndex, bannerItems.length]);

  React.useEffect(() => {
    if (!bannerItems.length) {
      return;
    }

    const nextIndex = Math.min(activePromoIndex, bannerItems.length - 1);
    promoScrollRef.current?.scrollTo({ x: nextIndex * itemWidth, animated: false });
  }, [activePromoIndex, bannerItems.length, itemWidth, viewportWidth]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const resolveHomeCategoryContext = React.useCallback((targetId?: string) => {
    if (!targetId) {
      return null;
    }

    const matchedCategory = categoryItems.find((category) => category.id === targetId);
    if (matchedCategory) {
      return { categoryId: matchedCategory.id, subcategoryId: null as string | null };
    }

    const parentCategory = categoryItems.find((category) =>
      category.subcategories?.some((subcategory) => subcategory.id === targetId),
    );

    if (parentCategory) {
      return { categoryId: parentCategory.id, subcategoryId: targetId };
    }

    return null;
  }, [categoryItems]);

  const resolveBannerPress = React.useCallback(
    (promo: DshHomeGetPromo) => () => {
      if (promo.id) {
        onPromoClick?.(promo.id);
      }

      if (promo.actionType === 'main_category' || promo.actionType === 'sub_category') {
        const nextHomeContext = resolveHomeCategoryContext(promo.actionTarget);

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
    [activeFilter, onOpenBenefits, onOpenDiscovery, onOpenList, onOpenOrders, onOpenProduct, onOpenSearch, onOpenSheinInfo, onOpenStore, onOpenStoreCategory, onOpenTracking, onPromoClick, resolveHomeCategoryContext]
  );

  const activePromo = currentBannerPromo;
  const activeHomePromo = resolvedHomePromos[0] ?? null;
  const promoDiscount = activePromo?.subtitle.match(/\d+%/)?.[0] ?? '';
  const promoTail = activePromo ? activePromo.subtitle.replace(promoDiscount, '').trim() : '';
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
        const nextHomeContext = resolveHomeCategoryContext(item.routeTargetId);

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
        onOpenCart?.();
        return;
      }

      if (onOpenDiscovery) {
        onOpenDiscovery();
        return;
      }

      onOpenList?.();
    },
    [onOpenBenefits, onOpenCart, onOpenDiscovery, onOpenList, onOpenProduct, onOpenSearch, onOpenSheinInfo, onOpenStore, onOpenStoreCategory, onVideoCtaClick, resolveHomeCategoryContext]
  );

  const approvedVideoReels = approvedVideoShorts.length > 0 ? approvedVideoShorts : [];
  const [isTickerPaused, setIsTickerPaused] = React.useState(false);
  const [isTickerHidden, setIsTickerHidden] = React.useState(false);

  const tickerState = React.useMemo(() => {
    if (isTickerHidden) {
      return null;
    }

    const homeTickerItems = getMarketingTickerItems('home');
    const previewTickerItems = dedupeMarketingTickerItems([
      ...homeTickerItems,
      ...getMarketingTickerItems('client'),
    ]).map((item) => (
      item.audience === 'client'
        ? { ...item, audience: 'all' as const }
        : item
    ));

    const homePlan = buildMarketingTickerPlan(currentTime, 'home', homeTickerItems);
    const previewPlan = buildMarketingTickerPlan(currentTime, 'all', previewTickerItems);
    const suppressedPreviewItem =
      previewPlan.suppressedEntries.find((entry) => entry.item.status === 'published')?.item ?? null;
    const activeItem = homePlan.activeItem ?? previewPlan.activeItem ?? suppressedPreviewItem;

    if (!activeItem) {
      return {
        isOpen: true,
        statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
        message: currentLanguage === 'ar' ? 'استعرض المتاجر والطلبات النشطة' : 'Browse stores and active orders',
        isMarketing: false,
      };
    }

    const isSuppressedPreview = !homePlan.activeItem && !previewPlan.activeItem && Boolean(suppressedPreviewItem);

    return {
      isOpen: true,
      statusLabel: isSuppressedPreview
        ? (currentLanguage === 'ar' ? 'معاينة' : 'Preview')
        : (currentLanguage === 'ar' ? 'مباشر' : 'Live'),
      message: activeItem.message,
      isMarketing: true,
      actionTarget: activeItem.actionTarget,
      needsBinding: true,
    };
  }, [currentLanguage, currentTime, isTickerHidden]);

  const handleTickerAction = React.useCallback(() => {
    if (!tickerState) return;

    if (tickerState.isMarketing) {
      setIsTickerPaused(p => !p); // Toggle pause on click
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
  }, []);

  const closeInlineSearch = React.useCallback(() => {
    setInlineSearchVisible(false);
    setInlineSearchQuery('');
  }, []);

  const openServiceDial = React.useCallback(() => {
    setServiceDialVisible(true);
  }, []);

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
  }, [fallbackCategoriesDialLayout]);
return (
    <View style={styles.screenRoot}>
      {inlineSearchVisible ? (
        <SearchTopBar
          value={inlineSearchQuery}
          onChangeText={setInlineSearchQuery}
          onClose={closeInlineSearch}
          variant="main"
          autoFocus
          placeholder="ابحث عن متجر أو فئة داخل الواجهة الحالية"
          hint="بحث عام سريع داخل التجربة الحالية للوصول إلى المتاجر والمسارات بدون مغادرة الصفحة."
          style={styles.brandTopBarShell}
        />
      ) : (
        <TopBar
          variant="main"
          layoutMode="default"
          title={uiText.topBar.brandName}
          subtitle={uiText.topBar.brandTagline}
          onTitlePress={handleOpenMySpace}
          locationLabel={uiText.topBar.location}
          locationIcon={<Icon name="location-outline" size={12} color={colorPalette.white} />}
          contentOffsetY={spacing[0]}
          actionsOffsetY={spacing[0]}
          actions={[
            {
              id: 'my-space',
              icon: <Icon name="person" size={20} color={colorPalette.white} />,
              size: 'lg',
              accessibilityLabel: 'مساحتي',
              onPress: handleOpenMySpace,
            },
            {
              id: 'notifications',
              icon: <Icon name="notifications-outline" size={24} color={colorPalette.white} />,
              accessibilityLabel: 'الإشعارات',
              onPress: onOpenNotifications,
            },
            {
              id: 'cart',
              icon: <Icon name="cart-outline" size={24} color={colorPalette.white} />,
              accessibilityLabel: 'السلة',
              onPress: onOpenCart,
            },
            {
              id: 'search',
              icon: <Icon name="search-outline" size={24} color={colorPalette.white} />,
              accessibilityLabel: 'بحث',
              onPress: openInlineSearch,
            },
          ]}
          ticker={{
            statusLabel: tickerState?.statusLabel ?? (currentLanguage === 'ar' ? 'مباشر' : 'Live'),
            message: tickerState?.isMarketing
              ? `${isTickerPaused ? '⏸️ ' : ''}${tickerState.message}`
              : (tickerState?.message ?? ''),
            onPress: handleTickerAction,
            marquee: tickerState?.isMarketing ? !isTickerPaused : true,
            marqueeDurationMs: 14000,
            trailingAction: {
              accessibilityLabel: 'الخدمات',
              onPress: openServiceDial,
              icon: <DshServiceLauncherMark />,
            },
          }}
        />
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing[3],
          paddingTop: spacing[0],
          paddingBottom: spacing[12],
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {inlineSearchVisible ? (
          <Surface tone="raised" padding={3} gap={2}>
            <Text role="titleSm">نتائج البحث داخل الواجهة الحالية</Text>
            <Text role="bodySm" tone="muted">
              {inlineSearchQuery.trim()
                ? `يتم الآن تصفية المتاجر والمسارات المتاحة حسب: ${inlineSearchQuery}`
                : 'ابدأ بكتابة اسم متجر أو خدمة أو فئة، وستظهر النتائج مباشرة في نفس الصفحة.'}
            </Text>
          </Surface>
        ) : bannerItems.length ? (
          <View style={[
            styles.premiumBannerSection,
            {
              marginLeft: -spacing[3],
              marginRight: -spacing[3],
              width: containerWidth,
              height: cardHeight + spacing[6],
            },
          ]}>
             <ScrollView
                ref={promoScrollRef}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled
                decelerationRate="fast"
                snapToInterval={itemWidth}
                snapToAlignment="center"
                disableIntervalMomentum={false}
                onScrollBeginDrag={() => {
                  if (activePromoPauseOnInteraction) {
                    clearInteractionResumeTimer();
                    setIsCarouselInteractionPaused(true);
                  }
                }}
                onMomentumScrollEnd={(event) => {
                  const x = event.nativeEvent.contentOffset.x;
                  const index = Math.round(x / itemWidth);
                  if (index !== activePromoIndex && index >= 0 && index < bannerItems.length) {
                    setActivePromoIndex(index);
                  }
                  scheduleCarouselResume();
                }}
                onScrollEndDrag={() => {
                  scheduleCarouselResume();
                }}
                contentContainerStyle={[
                  styles.premiumBannerScrollContent,
                  {
                    paddingHorizontal: horizontalPadding,
                    flexDirection: 'row',
                  }
                ]}
             >
               {bannerItems.map((promo, index) => {
                  const isActive = index === activePromoIndex;
                  const motionStyle = promo.motionStyle ?? activePromoMotionStyle;
                  const cardMotionStyle =
                    motionStyle === 'subtle-fade'
                      ? { opacity: isActive ? 1 : 0.78, transform: [{ scale: isActive ? 1 : 0.965 }] }
                      : motionStyle === 'soft-parallax'
                        ? { transform: [{ scale: isActive ? 1 : 0.97 }] }
                        : motionStyle === 'snap-focus'
                          ? { transform: [{ scale: isActive ? 1 : 0.952 }] }
                          : { transform: [{ scale: isActive ? 1 : 0.972 }] };
                  const imageMotionStyle =
                    motionStyle === 'soft-parallax'
                      ? { transform: [{ scale: isActive ? 1.08 : 1.02 }] }
                      : motionStyle === 'snap-focus'
                        ? { transform: [{ scale: isActive ? 1.03 : 1 }] }
                        : null;
                  return (
                    <Pressable
                      key={promo.id || index}
                      onPress={() => {
                        if (activePromoPauseOnInteraction) {
                          clearInteractionResumeTimer();
                          setIsCarouselInteractionPaused(true);
                          scheduleCarouselResume();
                        }
                        resolveBannerPress(promo)();
                      }}
                      style={[
                        styles.premiumBannerCard,
                        { width: cardWidth, marginEnd: index < bannerItems.length - 1 ? itemGap : 0 },
                        cardMotionStyle,
                        isActive && styles.premiumBannerCardActive
                      ]}
                    >
                      <View style={[styles.premiumBannerImageWrap, { height: cardHeight }]}>
                        <Image
                          source={promo.image}
                          style={[styles.premiumBannerImage, imageMotionStyle]}
                          resizeMode={promo.imageFit === 'contain' ? 'contain' : 'cover'}
                        />
                        <View style={[styles.premiumBannerOverlay, { backgroundColor: promo.accentColor ? `${promo.accentColor}29` : 'rgba(0,0,0,0.08)' }]} />
                        <View style={styles.bannerBrandAccentLine} />
                        <View style={styles.premiumBannerBottomShade} />

                        {promo.partnerLogoUrl && (
                          <View style={[
                            styles.premiumBannerLogoWrap,
                            promo.partnerLogoPosition === 'top-right' ? { right: 18 } : promo.partnerLogoPosition === 'bottom-right' ? { right: 18, bottom: 18, top: undefined } : promo.partnerLogoPosition === 'bottom-left' ? { left: 18, bottom: 18, top: undefined } : { left: 18 }
                          ]}>
                            <Image source={resolveDshHomeBannerImageSource(promo.partnerLogoUrl)} style={styles.premiumBannerLogo} resizeMode="contain" />
                          </View>
                        )}

                        {promo.offerBadgeText && (
                          <View style={[
                            styles.premiumBannerBadge,
                            { backgroundColor: promo.offerBadgeColor || colorPalette.brandStrong },
                            promo.offerBadgePosition === 'top-left' ? { left: 18, top: 20 } : { right: 18, top: 20 }
                          ]}>
                            <Text style={styles.premiumBannerBadgeText}>{promo.offerBadgeText}</Text>
                          </View>
                        )}

                        <View style={[
                          styles.premiumBannerContent,
                          promo.titlePlacement === 'center' ? { justifyContent: 'center' } : { justifyContent: 'flex-end' }
                        ]}>
                          <Box gap={1}>
                             <Text style={styles.premiumBannerTitle} numberOfLines={1}>{promo.title}</Text>
                             <Text style={styles.premiumBannerSubtitle} numberOfLines={1}>{promo.subtitle}</Text>
                          </Box>

                          <View style={[styles.premiumBannerCta, { backgroundColor: colorPalette.white }]}>
                            <Text style={[styles.premiumBannerCtaText, { color: promo.accentColor || colorPalette.brand }]}>
                              {promo.ctaLabel || 'اكتشف الآن'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
               })}
             </ScrollView>

             <View style={[styles.premiumCarouselControls, isRtl && styles.premiumCarouselControlsRtl]}>
                <View style={styles.premiumIndicatorRow}>
                  {bannerItems.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.premiumIndicator,
                        i === activePromoIndex && styles.premiumIndicatorActive,
                      ]}
                    />
                  ))}
                </View>
                {bannerItems.length > 1 && (
                  <Pressable
                    style={styles.premiumPauseBtn}
                    onPress={() => {
                      clearInteractionResumeTimer();
                      setIsCarouselInteractionPaused(false);
                      setIsCarouselUserPaused((current) => !current);
                    }}
                  >
                    <Ionicons
                      name={isCarouselUserPaused ? 'play-circle' : 'pause-circle'}
                      size={16}
                      color={colorPalette.white}
                    />
                  </Pressable>
                )}
             </View>
          </View>
        ) : null}

        <Box gap={0}>
          <View style={styles.categoriesSelectorSection}>
            <View style={styles.categoriesSelectorRow}>
              <View style={styles.fixedIconsContainer}>
                <CategorySelectorItem
                  isVideo
                  label="فيديو"
                  icon={<Ionicons name="play" size={22} color={colorPalette.brand} />}
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
                    {activeHomePromo.thumbnail && (
                      <Image
                        source={resolveDshHomeBannerImageSource(activeHomePromo.thumbnail)}
                        style={styles.heroPromoMascot}
                        resizeMode="contain"
                      />
                    )}
                    <View style={styles.heroPromoTextWrap}>
                      <Text style={styles.heroPromoTitle} numberOfLines={1}>
                        {activeHomePromo.title}
                      </Text>
                      <Text style={styles.heroPromoSubtitle} numberOfLines={1}>
                        {activeHomePromo.subtitle}
                      </Text>
                      {activeHomePromo.ctaText && (
                        <Text style={styles.heroPromoCtaLink}>
                          {activeHomePromo.ctaText}
                        </Text>
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

          <View style={styles.filtersRow}>
            <FilterChipItem
              label="الكل"
              isActive={activeCategoryId === 'all'}
              icon={<Ionicons name="menu-outline" size={16} color={activeCategoryId === 'all' ? theme.textInverse : theme.textMuted} />}
              onPress={() => selectCategoryPage('all')}
              styles={styles}
              theme={theme}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.filtersRowScrollContent}
              style={styles.filtersRowScroll}
            >
              {discoveryFilters
                .filter((filter) => filter.value !== 'all')
                .map((filter) => (
                  <FilterChipItem
                    key={filter.value}
                    label={filter.label}
                    isActive={filter.value === activeFilter}
                    icon={<Ionicons name={filter.iconName} size={16} color={filter.value === activeFilter ? theme.textInverse : theme.textMuted} />}
                    onPress={() => setActiveFilter(filter.value)}
                    styles={styles}
                    theme={theme}
                  />
                ))}

              {allCategoryRailItems
                .filter((category) => category.id !== 'all')
                .map((category) => (
                  <FilterChipItem
                    key={category.id}
                    label={category.label}
                    isActive={category.id === activeCategoryId}
                    icon={
                      <CategoryIconImage
                        uri={category.iconUrl ?? null}
                        emojiFallback={category.icon}
                        style={styles.filterChipIcon}
                      />
                    }
                    onPress={() => {
                      selectCategoryPage(category.id);
                      if (category.id === 'awnak') onOpenCategory?.('awnak');
                      if (category.id === 'shein') onOpenSheinInfo?.();
                    }}
                    styles={styles}
                    theme={theme}
                  />
                ))}
            </ScrollView>
          </View>
        </Box>

        <View style={styles.storeListViewport}>
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

            {activeStorePage?.stores.length ? (
              activeStorePage.stores.map((store, index) => {
                const sm = store.commercialSourceMap;
                const isOfferBlocked = sm?.['offerLabel']?.conflictStatus === 'blocker';
                const isProBlocked = sm?.['hasBthwaniPro']?.conflictStatus === 'blocker';
                const isCouponBlocked = sm?.['hasCouponAvailable']?.conflictStatus === 'blocker';
                const isPriceMatchBlocked = sm?.['priceMatchLabel']?.conflictStatus === 'blocker';
                const isNewProductsBlocked = sm?.['hasNewProducts']?.conflictStatus === 'blocker' || sm?.['new-product-leak']?.conflictStatus === 'blocker';

                const card: StoreCardPremiumItem = {
                  id: store.id,
                  name: store.name,
                  subtitle: store.address,
                  image: resolveDshHomeStoreImageSource(store.imageUri ?? store.mediaKey, store.publishStage),
                  rating: store.rating ?? null,
                  distanceKm: Number.parseFloat(store.distanceLabel.replace(/[^\d.]/g, '')) || null,
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
                  subscriptionPackageChips: isProBlocked ? [] : (store.subscriptionPackageChips ?? [store.deliveryLabel, store.serviceLabel]),
                  hasNewProducts: isNewProductsBlocked ? false : store.hasNewProducts,
                  hasOffer: isOfferBlocked ? false : store.hasOffer,
                  offerText: isOfferBlocked ? undefined : store.offerLabel,
                  pointsMultiplier: Number.parseInt(store.multiplierLabel.replace(/[^\d]/g, ''), 10) || (index === 2 ? 3 : index === 0 ? 2 : 1),
                  hasCouponAvailable: isCouponBlocked ? false : store.hasCouponAvailable,
                };

                return (
                  <StoreCardPremium
                    key={store.id}
                    item={card}
                    style={styles.storeListCard}
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
                    onPressSubscriptionChip={openInlineSearch}
                  />
                );
              })
            ) : activeStorePage?.renderMode !== 'manual-order' ? (
              <EmptyFeed query={inlineSearchQuery} styles={styles} />
            ) : null}
          </View>
        </View>

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
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      overflow: 'hidden',
      paddingTop: spacing[3],
      paddingBottom: spacing[3],
      backgroundColor: colorPalette.brand,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowColor: colorPalette.black,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    premiumBannerSection: {
      marginTop: spacing[1],
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    premiumBannerCardActive: {
      borderColor: 'rgba(255,255,255,0.2)',
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
      backgroundColor: 'rgba(255,255,255,0.08)',
      zIndex: 3,
    },
    premiumBannerBottomShade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '54%',
      backgroundColor: 'rgba(2, 8, 18, 0.4)',
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
      textShadowColor: 'rgba(0,0,0,0.4)',
      textShadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      lineHeight: 20,
      textAlign,
    },
    premiumBannerSubtitle: {
      color: 'rgba(255,255,255,0.95)',
      fontSize: 10,
      fontWeight: '600',
      marginTop: 3,
      textShadowColor: 'rgba(0,0,0,0.3)',
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
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    premiumIndicator: {
      width: 5,
      height: 5,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.4)',
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
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoriesSelectorSection: {
      marginBottom: spacing[1], // Reduced from spacing[2]
    },
    categoriesSelectorRow: {
      flexDirection: rowDirection,
      alignItems: 'flex-start',
      gap: 12,
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
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor: theme.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.line,
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
      flex: 1.2,
      height: 82, // Slightly taller for better presence
      borderRadius: 16, // Harmonized radius for 2026
      backgroundColor: '#0A2F5C',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 12,
      justifyContent: 'center',
      marginRight: 8,
      overflow: 'hidden',
    },
    heroPromoBackground: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      opacity: 0.35, // Increased visibility for templates
    },
    heroPromoContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      zIndex: 2, // Ensure content stays on top of background
    },
    heroPromoMascot: {
      width: 45,
      height: 55,
    },
    heroPromoTextWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 4,
    },
    heroPromoTitle: {
      color: colorPalette.white,
      fontWeight: '900',
      fontSize: 14,
      lineHeight: 18,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
    },
    heroPromoSubtitle: {
      color: '#FF500D',
      fontSize: 11,
      fontWeight: '800',
      marginTop: -1,
      textAlign: 'center',
    },
    heroPromoCtaLink: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 10,
      fontWeight: '900',
      marginTop: 1,
      textDecorationLine: 'underline',
      textAlign: 'center',
    },
    heroPagerRow: {
      marginTop: 4,
      alignItems: 'center',
    },
    heroPagerActive: {
      width: 12,
      height: 3,
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    filtersRow: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: spacing[2],
      paddingTop: 0, // Removed top padding
      paddingBottom: spacing[2], // Reduced from spacing[3]
    },
    filtersRowScroll: {
      flex: 1,
    },
    filtersRowScrollContent: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: spacing[2],
    },
    filterChip: {
      height: 32,
      borderRadius: 16,
      paddingHorizontal: 12,
      flexDirection: rowDirection,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.line,
    },
    filterChipCategory: {
      paddingRight: 16,
    },
    filterChipContent: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: 6,
    },
    filterChipIconWrap: {
      width: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterChipIcon: {
      width: 16,
      height: 16,
    },
    filterChipLabel: {
      fontSize: 12,
      fontWeight: '800',
    },
    storeListViewport: {
      marginTop: 0, // Removed top margin for direct transition
      flex: 1,
    },
    storeListContent: {
      gap: spacing[4], // Increased for balanced 2026 hierarchy
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
