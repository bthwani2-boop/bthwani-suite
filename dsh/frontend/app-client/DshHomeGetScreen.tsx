import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';

import {
  Box,
  CategoryOrbitCarousel,
  Icon,
  BannerCarousel,
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
import { DshAwnakOrderCreateScreen } from './DshAwnakOrderCreateScreen';
import { DshSheinOrderCreateScreen } from './DshSheinOrderCreateScreen';
import {
  DshHomeApprovedVideoReelsViewer,
  type DshHomeApprovedVideoReelsViewerProps,
} from './DshHomeApprovedVideoReelsViewer';
import { getDshCategoryIconUrl } from './getDshCategoryIconUrl';
import { resolveDshImageSource } from './resolve-image-source';
import type { MarketingGrowthRecord } from '../shared/growth-store';
import { getMarketingTickerItems, buildMarketingTickerPlan } from '../shared/news-ticker-store';

function resolveDshHomeStoreImageSource(imageUri?: string): ImageSourcePropType | undefined {
  return resolveDshImageSource(imageUri);
}

function resolveDshHomeBannerImageSource(imageUrl?: string): ImageSourcePropType | undefined {
  return resolveDshImageSource(imageUrl);
}

type CategoryDialItem = OrbitCarouselItem;
type DialAnchorLayout = OrbitAnchorLayout;

export type DshHomeGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  categories?: DshHomeCategory[];
  promos?: DshHomeGetPromo[];
  stores?: DshHomeGetStore[];
  recentOrders?: DshHomeRecentOrder[];
  approvedVideoShorts?: MarketingGrowthRecord[];
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

function resolveTickerBanner(
  now: Date,
  recentOrders: DshHomeRecentOrder[],
  locationLabel: string,
) {
  const isOpen = isWithinOperatingHours(now, 8, 23);
  const tickerLines: string[] = [];
  const statusLabel = isOpen ? 'مباشر' : 'مغلق';

  if (locationLabel.trim()) {
    tickerLines.push(`التوصيل إلى ${locationLabel.trim()}`);
  }

  recentOrders.slice(0, 2).forEach((order, index) => {
    tickerLines.push(`${index === 0 ? 'الطلب النشط' : 'طلب سابق'}: ${order.subtitle} · ${order.meta}`);
  });

  return {
    isOpen,
    statusLabel,
    message: tickerLines.length ? tickerLines.join('   •   ') : 'استعرض المتاجر والطلبات النشطة',
  };
}

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
  styles: any;
  theme: any;
}) {
  return (
    <Pressable style={styles.categorySelectorCard} onPress={onPress}>
      <View
        style={[
          styles.categoryIconContainer,
          isHub && styles.categoryHubIconContainer,
          isVideo && styles.videoIconContainer,
          isSelected && { backgroundColor: theme.brand },
        ]}
      >
        {icon}
      </View>
      <View style={[styles.categoryNameContainer, isSelected && styles.categoryNameContainerSelected]}>
        <Text role="bodySm" style={[styles.categoryName, isSelected && { color: theme.textInverse }]} numberOfLines={1}>
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
  styles: any;
  theme: any;
}) {
  return (
    <Pressable
      style={[
        styles.filterChip,
        {
          backgroundColor: isActive ? theme.brand : theme.surfaceRaised,
          borderColor: isActive ? theme.brand : 'transparent',
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
function EmptyFeed({ query, styles }: { query?: string; styles: any }) {
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
}: DshHomeGetScreenProps) {
  const { direction, language: resolvedLanguage } = useDirection();
  const currentLanguage = resolvedLanguage ?? 'ar';
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
  const resolvedStores = stores ?? [];
  const resolvedRecentOrders = recentOrders ?? [];

  const categoryItems = React.useMemo(() => {
    return resolvedCategories;
  }, [resolvedCategories]);

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
        icon: categoryIconMap[category.id] ?? '📂',
      })),
    [categoryItems]
  );

  React.useEffect(() => {
    if (resolvedPromos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((current) => (current + 1) % resolvedPromos.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [resolvedPromos]);

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

        setInlineSearchVisible(true);
        return;
      }

      onOpenDiscovery?.();
    },
    [onOpenBenefits, onOpenDiscovery, onOpenProduct, onOpenSearch, onOpenSheinInfo, onOpenStore, onOpenStoreCategory, onPromoClick, resolveHomeCategoryContext]
  );

  const activePromo = resolvedPromos[activePromoIndex % resolvedPromos.length] ?? null;
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
  }, [activePromo?.id, onPromoImpression, resolvedPromos.length]);

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
  // Marketing-driven banner carousel items: promos are the single source of truth for banner content and routing.
  const bannerItems = resolvedPromos.map((promo) => ({
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle,
    image: resolveDshHomeBannerImageSource(promo.mediaKey ?? promo.imageUrl),
    imageUrl: promo.imageUrl ?? promo.mediaKey,
    accentColor: promo.accentColor,
    onPress: resolveBannerPress(promo),
  }));
  const [isTickerPaused, setIsTickerPaused] = React.useState(false);
  const [isTickerHidden, setIsTickerHidden] = React.useState(false);

  const tickerState = React.useMemo(() => {
    if (isTickerHidden) {
      return null;
    }

    const plan = buildMarketingTickerPlan(currentTime, 'home');
    const activeItem = plan.activeItem;

    if (!activeItem) {
      return {
        ...resolveTickerBanner(currentTime, resolvedRecentOrders, uiText.topBar.location),
        isMarketing: false,
      };
    }

    return {
      isOpen: true,
      statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
      message: activeItem.message,
      isMarketing: true,
      actionTarget: activeItem.actionTarget,
    };
  }, [currentLanguage, currentTime, isTickerHidden, resolvedRecentOrders, uiText.topBar.location]);

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
      iconUrl: getDshCategoryIconUrl(category.id),
      emojiFallback: categoryIconMap[category.id] ?? '📂',
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
      iconUrl: getDshCategoryIconUrl(selectedCategoryFixture.id),
      emojiFallback: categoryIconMap[selectedCategoryFixture.id] ?? '📂',
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

  const openCategoriesDial = React.useCallback(() => {
    categoriesAnchorRef.current?.measureInWindow((x, y, width, height) => {
      setCategoriesDialLayout({ x, y, width, height });
      setCategoriesSheetVisible(true);
    });
  }, []);
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
            statusLabel: tickerState?.statusLabel ?? '',
            message: tickerState?.isMarketing
              ? `${isTickerPaused ? '⏸️' : ''} ${tickerState.message}`
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
          <BannerCarousel
            banners={bannerItems}
            height={230}
            variant="secondary"
            width={viewportWidth}
            style={styles.bannerCarouselFullBleed}
          />
        ) : null}

        <View style={styles.homeHighlightsPanel}>
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
                        uri={null}
                        emojiFallback={categoryIconMap[selectedCategoryFixture.id] ?? '📂'}
                        style={styles.categoryIconImage}
                      />
                    }
                    onPress={() => setActiveSubcategoryId(null)}
                    styles={styles}
                    theme={theme}
                  />
                )}
              </View>

              {activePromo && (
                <Pressable
                  style={[
                    styles.heroPromoCard,
                    styles.heroPromoCardInline,
                    activePromo.accentColor ? { backgroundColor: activePromo.accentColor } : null,
                  ]}
                  onPress={openInlineSearch}
                >
                  <View style={styles.heroPromoContent}>
                    <View style={styles.heroPromoIconWrap}>
                      <Text role="titleLg" style={styles.heroIcon}>
                        {activePromo.icon}
                      </Text>
                    </View>
                    <View style={styles.heroPromoTextWrap}>
                      <View style={styles.heroPromoBadge}>
                        <Text role="bodySm" style={styles.heroPromoBadgeText}>
                          {activePromo.title}
                        </Text>
                      </View>
                      <Text role="titleSm" style={styles.heroPromoTitle} numberOfLines={1}>
                        {promoDiscount || activePromo.subtitle.slice(0, 15)}
                      </Text>
                      <Text role="titleSm" style={styles.heroPromoSubtitle} numberOfLines={1}>
                        {promoTail || activePromo.subtitle.slice(15) || 'المزيد من التفاصيل'}
                      </Text>
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
                        uri={null}
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
        </View>

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
                const card: StoreCardPremiumItem = {
                  id: store.id,
                  name: store.name,
                  subtitle: store.address,
                  image: resolveDshHomeStoreImageSource(store.mediaKey),
                  rating: store.rating ?? null,
                  distanceKm: Number.parseFloat(store.distanceLabel.replace(/[^\d.]/g, '')) || null,
                  isOpen: store.statusTone === 'open',
                  supportsPickup: true,
                  supportsPartnerDelivery: true,
                  serviceTokens: [{ label: store.deliveryLabel }, { label: store.serviceLabel }],
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
    },
    brandTopBarShell: {
      marginTop: spacing[0],
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      overflow: 'hidden',
      paddingTop: spacing[3],
      paddingBottom: spacing[3],
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
      shadowColor: colorPalette.black,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    bannerCarouselFullBleed: {
      marginHorizontal: -spacing[3],
      marginTop: -spacing[2],
      marginBottom: -spacing[1], // Reduce gap below
      overflow: 'visible', // Prevent clipping
    },
    homeHighlightsPanel: {
      marginTop: spacing[0],
      marginBottom: spacing[2],
      padding: spacing[3],
      borderRadius: 28,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.line,
      shadowColor: colorPalette.black,
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    categoriesSelectorSection: {
      marginBottom: spacing[1],
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
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: theme.brandSurface,
      borderWidth: 1.5,
      borderColor: colorPalette.brand,
      justifyContent: 'center',
      alignItems: 'center',
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
      borderRadius: 16,
      backgroundColor: theme.surfaceInset,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    categoryHubIconContainer: {
      backgroundColor: theme.brandSurface,
      borderWidth: 1,
      borderColor: colorPalette.brandStrong,
    },
    categoryIconImage: {
      width: 32,
      height: 32,
    },
    categoryNameContainerSelected: {
      backgroundColor: theme.brand,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    heroPromoCard: {
      flex: 1,
      height: 80,
      borderRadius: 20,
      backgroundColor: theme.brandStrong, // Premium Deep Blue
      padding: 12,
      justifyContent: 'center',
      shadowColor: colorPalette.black,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    heroPromoCardInline: {
      maxWidth: 180,
    },
    heroPromoContent: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: 10,
    },
    heroPromoIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroIcon: {
      fontSize: 24,
    },
    heroPromoTextWrap: {
      flex: 1,
      gap: 1,
    },
    heroPromoBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
      backgroundColor: theme.brand,
      marginBottom: 2,
    },
    heroPromoBadgeText: {
      color: colorPalette.white,
      fontWeight: '900',
      fontSize: 9,
    },
    heroPromoTitle: {
      color: colorPalette.white,
      fontWeight: '900',
      fontSize: 15,
      lineHeight: 18,
    },
    heroPromoSubtitle: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 10,
      fontWeight: '700',
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
      paddingVertical: spacing[2],
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
      height: 36,
      borderRadius: 18,
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
      marginTop: spacing[1],
      flex: 1,
    },
    storeListContent: {
      gap: spacing[3],
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
