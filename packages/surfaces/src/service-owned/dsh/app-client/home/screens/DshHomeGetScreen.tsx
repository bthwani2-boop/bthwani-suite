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
import { DshAwnakOrderCreateScreen } from '../../awnak/screens';
import { DshSheinOrderCreateScreen } from '../../shein/screens';
import {
  DshHomeApprovedVideoReelsViewer,
  type DshHomeApprovedVideoReelsViewerProps,
} from '../components/DshHomeApprovedVideoReelsViewer';
import { getDshCategoryIconUrl } from '../../categories/utils/getDshCategoryIconUrl';
import { resolveDshImageSource } from '../../shared/resolve-image-source';
import type { MarketingGrowthRecord } from '../../../shared/marketing/growth-store';

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
  onOpenBenefits?: () => void;
  onOpenFavorites?: () => void;
  onOpenSearch?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenStore?: (storeId: string) => void;
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
  width: 52,
  height: 52,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff7f0',
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
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#173a6a',
    borderTopColor: '#ff6a00',
  },
  needle: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 17,
    borderRadius: 999,
    backgroundColor: '#173a6a',
    transform: [{ rotate: '24deg' }],
  },
  planeWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
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
        <Icon name="paper-plane" size={14} color="#FF6A00" />
      </View>
    </View>
  );
}

function CategoryHubIcon() {
  return (
    <Ionicons name="grid-outline" size={22} color="#FF6A00" />
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

function renderState(state: Exclude<NonNullable<DshHomeGetScreenProps['state']>, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا توجد بيانات عرض بعد"
        description="أعد المحاولة لاستعادة الواجهة الرئيسية واختصاراتها."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return <StateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <StateView
        stateId="warning"
        title="الواجهة الرئيسية موقوفة مؤقتاً"
        description="أبقِ المحاولة مرئية حتى تعود هذه الواجهة للخدمة."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
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
  onOpenSheinInfo,
  approvedVideoShorts = [],
  sheinInlineVisible = false,
  onCloseSheinInline,
  awnakInlineVisible = false,
  onCloseAwnakInline,
  renderApprovedVideoReelsViewer,
  onRetry,
  onOpenEntry,
}: DshHomeGetScreenProps) {
  const { direction, language: resolvedLanguage } = useDirection();
  const currentLanguage = resolvedLanguage ?? 'ar';
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const { theme } = useTheme();
  const uiText = useUiText();
  const styles = React.useMemo(() => createStyles(direction), [direction]);
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
          onOpenBenefits();
          return;
        }

        setInlineSearchVisible(true);
        return;
      }

      onOpenDiscovery?.();
    },
    [onOpenBenefits, onOpenDiscovery, onOpenProduct, onOpenSearch, onOpenSheinInfo, onOpenStore, onOpenStoreCategory, resolveHomeCategoryContext]
  );

  const activePromo = resolvedPromos[activePromoIndex % resolvedPromos.length] ?? null;
  const promoDiscount = activePromo?.subtitle.match(/\d+%/)?.[0] ?? '';
  const promoTail = activePromo ? activePromo.subtitle.replace(promoDiscount, '').trim() : '';
  const tickerAction = activePromo ? resolveBannerPress(activePromo) : undefined;

  const resolveVideoCtaPress = React.useCallback(
    (item: MarketingGrowthRecord) => {
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
        onOpenBenefits?.();
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
    [onOpenBenefits, onOpenCart, onOpenDiscovery, onOpenList, onOpenProduct, onOpenSearch, onOpenSheinInfo, onOpenStore, onOpenStoreCategory, resolveHomeCategoryContext]
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
  const tickerState = React.useMemo(
    () => resolveTickerBanner(currentTime, resolvedRecentOrders, uiText.topBar.location),
    [currentTime, resolvedRecentOrders, uiText.topBar.location]
  );
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

  React.useEffect(() => {
    if (sheinInlineVisible) {
      selectCategoryPage('shein');
    }
  }, [selectCategoryPage, sheinInlineVisible]);

  React.useEffect(() => {
    if (awnakInlineVisible) {
      selectCategoryPage('awnak');
    }
  }, [awnakInlineVisible, selectCategoryPage]);

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
          locationIcon={<Icon name="location-outline" size={12} color="#FFFFFF" />}
          contentOffsetY={spacing[2]}
          actionsOffsetY={spacing[2]}
          actions={[
            {
              id: 'my-space',
              icon: <Icon name="person" size={20} color="#FFFFFF" />,
              size: 'lg',
              accessibilityLabel: 'مساحتي',
              onPress: handleOpenMySpace,
            },
            {
              id: 'notifications',
              icon: <Icon name="notifications-outline" size={24} color="#FFFFFF" />,
              accessibilityLabel: 'الإشعارات',
              onPress: onOpenNotifications,
            },
            {
              id: 'cart',
              icon: <Icon name="cart-outline" size={24} color="#FFFFFF" />,
              accessibilityLabel: 'السلة',
              onPress: onOpenCart,
            },
            {
              id: 'search',
              icon: <Icon name="search-outline" size={24} color="#FFFFFF" />,
              accessibilityLabel: 'بحث',
              onPress: openInlineSearch,
            },
          ]}
          ticker={{
            statusLabel: tickerState.statusLabel,
            message: tickerState.message,
            onPress: tickerAction,
            marquee: true,
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
        contentContainerStyle={{ paddingHorizontal: spacing[3], paddingVertical: spacing[0], gap: spacing[0], flexGrow: 1 }}
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
            height={184}
            variant="secondary"
            width={viewportWidth}
            style={styles.bannerCarouselFullBleed}
          />
        ) : null}

        <View style={styles.categoriesSelectorSection}>
          <View style={styles.categoriesSelectorRow}>
            <View style={styles.fixedIconsContainer}>
              <Pressable style={styles.categorySelectorCard} onPress={() => setShortsVisible(true)}>
                <View style={styles.videoIconContainer}>
                  <Ionicons name="play" size={22} color="#FF6A00" />
                </View>
                <View style={styles.categoryNameContainer}>
                  <Text role="bodySm" style={styles.categoryName} numberOfLines={1}>فيديو</Text>
                </View>
              </Pressable>

              <View ref={categoriesAnchorRef} collapsable={false}>
                <Pressable style={styles.categorySelectorCard} onPress={openCategoriesDial}>
                  <View style={[styles.categoryIconContainer, styles.categoryHubIconContainer]}>
                    <CategoryHubIcon />
                  </View>
                  <View style={styles.categoryNameContainer}>
                    <Text role="bodySm" style={styles.categoryName} numberOfLines={1}>الفئات</Text>
                  </View>
                </Pressable>
              </View>

              {selectedCategoryFixture ? (
                <Pressable
                  style={styles.categorySelectorCard}
                  onPress={() => setActiveSubcategoryId(null)}
                >
                  <View style={styles.categoryIconContainer}>
                    <CategoryIconImage
                      uri={null}
                      emojiFallback={categoryIconMap[selectedCategoryFixture.id] ?? '📂'}
                      style={styles.categoryIconImage}
                    />
                  </View>
                  <View style={[styles.categoryNameContainer, styles.categoryNameContainerSelected]}>
                    <Text role="bodySm" style={styles.categoryName} numberOfLines={1}>
                      {selectedCategoryLabel}
                    </Text>
                  </View>
                </Pressable>
              ) : null}
            </View>

            {activePromo ? (
              <Pressable style={[styles.heroPromoCard, styles.heroPromoCardInline]} onPress={openInlineSearch}>
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
                      {promoDiscount}
                    </Text>
                    <Text role="titleSm" style={styles.heroPromoSubtitle} numberOfLines={1}>
                      {promoTail || 'على أول طلب'}
                    </Text>
                  </View>
                </View>

                <View style={styles.heroPagerRow}>
                  <View style={styles.heroPagerActive} />
                </View>
              </Pressable>
            ) : null}

            {selectedSubcategoryCards.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                decelerationRate="fast"
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
                    <Text role="bodySm" style={[styles.subcategoryName, activeSubcategoryId === subcategory.id && styles.subcategoryNameActive]} numberOfLines={1}>
                      {subcategory.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>

        <View style={styles.filtersRow}>
          <Pressable
            style={[
              styles.filterChip,
              styles.filterChipCategory,
              {
                backgroundColor: activeCategoryId === 'all' ? theme.brand : theme.surfaceRaised,
                borderColor: activeCategoryId === 'all' ? theme.brand : 'transparent',
              },
            ]}
            onPress={() => {
              selectCategoryPage('all');
            }}
          >
            <View style={styles.filterChipContent}>
              <View style={styles.filterChipIconWrap}>
                <Ionicons
                  name="menu-outline"
                  size={16}
                  color={activeCategoryId === 'all' ? theme.textInverse : theme.textMuted}
                />
              </View>
              <Text
                role="bodySm"
                style={[
                  styles.filterChipLabel,
                  { color: activeCategoryId === 'all' ? theme.textInverse : theme.textMuted },
                ]}
                numberOfLines={1}
              >
                الكل
              </Text>
            </View>
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            decelerationRate="fast"
            contentContainerStyle={styles.filtersRowScrollContent}
            style={styles.filtersRowScroll}
          >
            {discoveryFilters.filter((filter) => filter.value !== 'all').map((filter) => {
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
                  <Text
                    role="bodySm"
                    style={[
                      styles.filterChipLabel,
                      { color: isActive ? theme.textInverse : theme.textMuted },
                    ]}
                  >
                    {filter.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}

            {allCategoryRailItems.filter((category) => category.id !== 'all').map((category) => {
            const isActive = category.id === activeCategoryId;

            return (
              <Pressable
                key={category.id}
                style={[
                  styles.filterChip,
                  styles.filterChipCategory,
                  {
                    backgroundColor: isActive ? theme.brand : theme.surfaceRaised,
                    borderColor: isActive ? theme.brand : 'transparent',
                  },
                ]}
                onPress={() => {
                  selectCategoryPage(category.id);
                  if (category.id === 'awnak') {
                    onOpenCategory?.('awnak');
                    return;
                  }

                  if (category.id === 'shein') {
                    onOpenSheinInfo?.();
                  }
                }}
              >
                <View style={styles.filterChipContent}>
                  <View style={styles.filterChipIconWrap}>
                    <CategoryIconImage
                      uri={null}
                      emojiFallback={category.icon}
                      style={styles.filterChipIcon}
                    />
                  </View>
                  <Text
                    role="bodySm"
                    style={[
                      styles.filterChipLabel,
                      { color: isActive ? theme.textInverse : theme.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {category.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
          </ScrollView>
        </View>

        <View style={styles.storeListViewport}>
          <View style={styles.storeListContent}>
            {activeStorePage?.renderMode === 'manual-order' ? (
              <Box gap={3}>
                {activeStorePage.categoryId === 'shein' ? (
                  <DshSheinOrderCreateScreen
                    embedded
                    onClose={() => {
                      onCloseSheinInline?.();
                      selectCategoryPage('all');
                    }}
                  />
                ) : activeStorePage.categoryId === 'awnak' ? (
                  <DshAwnakOrderCreateScreen
                    embedded
                    onClose={() => {
                      onCloseAwnakInline?.();
                      selectCategoryPage('all');
                    }}
                  />
                ) : null}
              </Box>
            ) : activeStorePage?.stores.length ? (
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
            ) : (
              <View style={styles.emptyFeed}>
                <Text style={styles.emptyFeedEmoji}>{inlineSearchQuery.trim() ? '🔎' : '🍽️'}</Text>
                <Text style={styles.emptyFeedTitle}>
                  {inlineSearchQuery.trim() ? 'لا توجد نتائج داخل هذه الفئة' : 'لا توجد متاجر لهذه الفئة بعد'}
                </Text>
                <Text style={styles.emptyFeedText}>
                  {inlineSearchQuery.trim()
                    ? 'جرّب تغيير البحث أو انتقل إلى فئة أخرى.'
                    : 'أضف fixtures لهذه الفئة كي تظهر هنا.'}
                </Text>
              </View>
            )}
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
            }) ?? (
              <DshHomeApprovedVideoReelsViewer
                visible={shortsVisible}
                items={approvedVideoReels}
                initialIndex={0}
                onClose={() => setShortsVisible(false)}
                onCtaPress={resolveVideoCtaPress}
              />
            ))
          : null}
      </ScrollView>
    </View>
  );
}

function createStyles(direction: Direction) {
  const rowDirection = resolveRowDirection(direction);
  const textAlign = resolveTextAlign(direction);

  return StyleSheet.create({
  activeOrderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  activeOrderHeader: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 8,
  },
  activeOrderStatusPill: {
    backgroundColor: '#eafff6',
    borderWidth: 1,
    borderColor: '#45d2a0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeOrderStatusText: {
    color: '#0f9d66',
    fontWeight: '800',
    fontSize: 11,
  },
  activeOrderTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 14,
    flex: 1,
  },
  activeOrderMetaRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  activeOrderMetaText: {
    color: '#6b7280',
    fontSize: 12,
    flex: 1,
    textAlign,
  },
  activeOrderEtaText: {
    color: '#ff6a00',
    fontWeight: '800',
    fontSize: 12,
  },
  activeOrderFooterRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeOrderAction: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff4e9',
    borderWidth: 1,
    borderColor: '#ffc38f',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeOrderActionText: {
    color: '#ff6a00',
    fontWeight: '800',
    fontSize: 12,
  },
  screenRoot: {
    flex: 1,
  },
  brandTopBarOffset: {
    marginTop: spacing[0],
  },
  brandTopBarShell: {
    marginTop: spacing[0],
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  bannerCarouselFullBleed: {
    marginHorizontal: -spacing[3],
  },
  storeListViewport: {
    marginTop: spacing[2],
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  storeListContent: {
    width: '100%',
    gap: spacing[2],
    alignSelf: 'stretch',
  },
  emptyFeed: {
    borderWidth: 1,
    borderColor: '#e6eaf1',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFeedEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  emptyFeedTitle: {
    color: '#1f2937',
    fontWeight: '800',
    fontSize: 14,
    textAlign,
  },
  emptyFeedText: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
    textAlign,
  },
  storeListCard: {
    width: '100%',
    alignSelf: 'stretch',
  },
  activeOrderStatusLabel: {
    color: '#6b7280',
    fontSize: 11,
  },
  recentOrdersSection: {
    gap: 10,
  },
  recentOrdersHeader: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentOrdersTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 14,
  },
  recentOrdersSubtitle: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
  },
  recentOrdersHeaderAction: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  recentOrdersHeaderActionText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 11,
  },
  recentOrdersRow: {
    flexDirection: rowDirection,
    gap: 10,
  },
  recentOrderCard: {
    width: 212,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  recentOrderCardTop: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  recentOrderBadge: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff4e9',
    borderWidth: 1,
    borderColor: '#ffc38f',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recentOrderBadgeText: {
    color: '#ff6a00',
    fontWeight: '800',
    fontSize: 11,
  },
  recentOrderTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 13,
    flex: 1,
    textAlign,
  },
  recentOrderSubtitle: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 13,
    textAlign,
  },
  recentOrderMeta: {
    color: '#6b7280',
    fontSize: 11,
    textAlign,
  },
  recentOrderFooter: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentOrderStatusPill: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recentOrderStatusText: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  recentOrderCTA: {
    color: '#ff6a00',
    fontWeight: '800',
    fontSize: 12,
  },
  shortsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  shortsPanel: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 18,
    maxHeight: '72%',
  },
  shortsHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
    marginBottom: 10,
  },
  shortsHeader: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shortsTitle: {
    color: '#111827',
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  shortsCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortsList: {
    gap: 10,
    paddingBottom: 10,
  },
  shortsCard: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    gap: 10,
  },
  shortsCardPromo: {
    backgroundColor: '#fff4e9',
    borderColor: '#ffc38f',
  },
  shortsCardStore: {
    backgroundColor: '#f1f5ff',
    borderColor: '#c7d2fe',
  },
  shortsCardTracking: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  shortsCardTopRow: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    gap: 10,
  },
  shortsPlayBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ff6a00',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  shortsCardTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  shortsCardTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 14,
    textAlign,
  },
  shortsCardSubtitle: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    textAlign,
  },
  shortsCardFooter: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shortsCardFooterText: {
    color: '#ff6a00',
    fontWeight: '700',
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
    flexDirection: rowDirection,
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
    flexDirection: rowDirection,
    alignItems: 'stretch',
    gap: 8,
  },
  categoriesSelectorSection: {
    marginTop: 0,
    marginBottom: 0,
  },
  categoriesSelectorRow: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    gap: 4,
  },
  categoriesSelectorScroll: {
    flex: 1,
  },
  categoriesSelectorScrollContent: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 0,
  },
  fixedIconsContainer: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    gap: 4,
    flexShrink: 0,
  },
  categorySelectorCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    alignSelf: 'flex-start',
  },
  categorySelectorCardActive: {
    transform: [{ translateY: -1 }],
  },
  videoIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFF4E8',
    borderWidth: 1,
    borderColor: '#FFD6B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F4F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 2,
  },
  categoryHubIconContainer: {
    backgroundColor: '#FFF4E8',
    borderWidth: 1,
    borderColor: '#FFD6B0',
  },
  categoryIconImage: {
    width: 42,
    height: 42,
    fontSize: 32,
    lineHeight: 32,
  },
  categoryNameContainer: {
    alignItems: 'center',
    minHeight: 20,
  },
  categoryNameContainerSelected: {
    backgroundColor: '#FF6A00',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryName: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  subcategorySelectorCard: {
    flexDirection: rowDirection,
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  subcategorySelectorCardActive: {
    backgroundColor: '#0D2F67',
  },
  subcategoryIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcategoryEmoji: {
    fontSize: 16,
  },
  subcategoryName: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  subcategoryNameActive: {
    color: '#FFFFFF',
  },
  selectorRail: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    justifyContent: 'flex-start',
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
  heroPromoCardInline: {
    flex: 1,
    minWidth: 168,
    maxWidth: 204,
    alignSelf: 'flex-start',
  },
  heroPromoContent: {
    flexDirection: rowDirection,
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
    alignItems: 'center',
    gap: 3,
  },
  heroPromoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignSelf: 'center',
  },
  heroPromoBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 10,
    textAlign: 'center',
  },
  heroPromoTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
  },
  heroPromoSubtitle: {
    color: '#ffd3d3',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 13,
  },
  heroIcon: {
    color: '#fff',
    fontSize: 26,
    lineHeight: 24,
  },
  categoryRail: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'flex-start',
  },
  categoryRailItem: {
    minHeight: 42,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E6EAF1',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    flexDirection: rowDirection,
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
    color: '#4B5563',
    textAlign: 'center',
  },
  categoryRailLabelActive: {
    color: '#C2410C',
  },
  heroPagerRow: {
    alignItems: 'center',
  },
  heroPagerActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  quickActionBottomRow: {
    flexDirection: rowDirection,
    alignItems: 'stretch',
    gap: 8,
  },
  quickActionSecondary: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#0d2f67',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTertiary: {
    flex: 0.95,
    borderRadius: 21,
    backgroundColor: '#ff6a00',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionChipContent: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 6,
  },
  quickActionLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  filtersRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
  filtersRowScroll: {
    flex: 1,
  },
  filtersRowScrollContent: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: spacing[1],
  },
  filterChip: {
    minHeight: sizes.controlSm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filterChipCategory: {
    flexShrink: 0,
  },
  filterChipFixed: {
    flexShrink: 0,
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
    fontSize: 14,
    lineHeight: 16,
  },
  filterChipLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
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
    flexDirection: rowDirection,
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
    flexDirection: rowDirection,
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
    flexDirection: rowDirection,
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
    textAlign,
    fontSize: 18,
    lineHeight: 22,
  },
  storeAddress: {
    color: '#6d7584',
    textAlign,
    fontSize: 13,
    lineHeight: 16,
  },
  storeDistanceLine: {
    color: '#5b6372',
    textAlign,
    fontSize: 13,
    lineHeight: 16,
  },
  storeMetaChipRow: {
    flexDirection: rowDirection,
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
    flexDirection: rowDirection,
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
}

export default DshHomeGetScreen;


