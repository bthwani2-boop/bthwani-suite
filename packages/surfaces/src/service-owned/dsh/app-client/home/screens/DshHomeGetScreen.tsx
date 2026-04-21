import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import {
  BthUnifiedMobileTopBar,
  BthBox,
  BthListItem,
  BthStateView,
  BthSurface,
  BthText,
  radius,
  resolveRowDirection,
  resolveTextAlign,
  sizes,
  spacing,
  type Direction,
  useDirection,
  useTheme,
  useUiText,
} from '@bthwani/ui-kit';
import {
  dshHomeGetFixturePromos,
  dshHomeGetFixtureStores,
  dshHomeGetFixtureTickerBanner,
} from '../fixtures/dshHomeGetFixtures';
import {
  StoreCardPremium,
  type DshStoreCompactCardData,
} from '../components/StoreCardPremium';
import {
  HomeBannerCarousel,
  type HomeBannerCarouselItem,
} from '../components/HomeBannerCarousel';
import {
  dshCategoryFixtures,
  DSH_CATEGORY_ICONS,
} from '../../categories/fixtures/dshCategoriesFixtures';
import { getDshCategoryFixture } from '../../categories/fixtures/dshCategoriesFixtures';
import { DshSheinOrderCreateScreen } from '../../shein/screens';
import { DshAwnakOrderCreateScreen } from '../../awnak/screens';
import {
  DshHomeApprovedVideoReelsViewer,
  type DshHomeApprovedVideoReelsViewerProps,
} from '../components/DshHomeApprovedVideoReelsViewer';
import CategoryClockDial, {
  type CategoryDialItem,
  type DialAnchorLayout,
} from '../components/CategoryClockDial';
import { getDshCategoryIconUrl } from '../../categories/utils/getDshCategoryIconUrl';
import type { MarketingGrowthRecord } from '../../../shared/marketing/growth-store';

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
  categoryId?: string;
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
  bthwani_store: '🏪',
  home_projects: '🏠',
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
    return <BthText role="titleLg" style={style}>{emojiFallback}</BthText>;
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

function CategoryHubIcon() {
  return (
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#FF8A00',
        borderWidth: 1,
        borderColor: '#FFB35C',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF8A00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.26,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
      }}
    >
      <View style={{ position: 'absolute', left: 7, top: 12 }}>
        <View style={{ width: 20, height: 7, borderRadius: 999, backgroundColor: '#FFFFFF', marginBottom: 4 }} />
        <View style={{ width: 22, height: 7, borderRadius: 999, backgroundColor: '#FFFFFF', marginBottom: 4 }} />
        <View
          style={{
            width: 19,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#FFFFFF',
            transform: [{ skewX: '-24deg' }],
          }}
        />
      </View>

      <View style={{ position: 'absolute', top: 4, right: 11, alignItems: 'center', gap: 2 }}>
        <View style={{ width: 2, height: 7, borderRadius: 999, backgroundColor: '#FFF7E9' }} />
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <View style={{ width: 2, height: 6, borderRadius: 999, backgroundColor: '#FFF7E9', transform: [{ rotate: '-30deg' }] }} />
          <View style={{ width: 2, height: 6, borderRadius: 999, backgroundColor: '#FFF7E9', transform: [{ rotate: '30deg' }] }} />
        </View>
      </View>

      <BthText
        role="titleLg"
        style={{
          position: 'absolute',
          right: 0,
          bottom: -1,
          fontSize: 28,
          lineHeight: 30,
          transform: [{ rotate: '-2deg' }],
        }}
      >
        ☝️
      </BthText>
    </View>
  );
}

function MySpaceIcon() {
  return (
    <View
      style={{
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 13,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.95)',
          backgroundColor: 'rgba(255,255,255,0.10)',
        }}
      />
      <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.96)',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <Ionicons name="person" size={10} color="#FFFFFF" />
      </View>
      <Ionicons
        name="sparkles"
        size={7}
        color="#FFF8DE"
        style={{ position: 'absolute', top: 1, right: 0, transform: [{ rotate: '14deg' }] }}
      />
      <Ionicons
        name="sparkles"
        size={6}
        color="#FFF8DE"
        style={{ position: 'absolute', top: 4, left: 1, transform: [{ rotate: '-12deg' }] }}
      />
    </View>
  );
}

function isWithinOperatingHours(now: Date, openHour: number, closeHour: number) {
  const currentHour = now.getHours();

  if (openHour === closeHour) {
    return true;
  }

  if (openHour < closeHour) {
    return currentHour >= openHour && currentHour < closeHour;
  }

  return currentHour >= openHour || currentHour < closeHour;
}

function resolveTickerBanner(
  now: Date,
  recentOrders: DshHomeRecentOrder[],
  locationLabel: string,
  languageCode: string,
) {
  const fixture = dshHomeGetFixtureTickerBanner;
  const isOpen = isWithinOperatingHours(now, fixture.openHour, fixture.closeHour);
  const tickerLines: string[] = [];
  const isEnglish = languageCode === 'en';

  if (locationLabel.trim()) {
    tickerLines.push(
      isEnglish
        ? `Delivering to ${locationLabel.trim()}`
        : `التوصيل إلى ${locationLabel.trim()}`,
    );
  }

  recentOrders.slice(0, 2).forEach((order, index) => {
    tickerLines.push(
      isEnglish
        ? `${index === 0 ? 'Active order' : 'Recent order'}: ${order.subtitle} · ${order.meta}`
        : `${index === 0 ? 'الطلب النشط' : 'طلب سابق'}: ${order.subtitle} · ${order.meta}`,
    );
  });

  return {
    fixture,
    isOpen,
    statusLabel: isOpen ? fixture.openStatusLabel : fixture.closedStatusLabel,
    message: tickerLines.length ? tickerLines.join('   •   ') : isOpen ? fixture.openMessage : fixture.closedMessage,
  };
}

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
  const { theme } = useTheme();
  const uiText = useUiText();
  const styles = React.useMemo(() => createStyles(direction), [direction]);
  const categoriesAnchorRef = React.useRef<View>(null);
  const [categoriesSheetVisible, setCategoriesSheetVisible] = React.useState(false);
  const [categoriesDialLayout, setCategoriesDialLayout] = React.useState<DialAnchorLayout | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = React.useState<string | null>(null);
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);
  const [favoriteToggles, setFavoriteToggles] = React.useState<Record<string, boolean>>({});
  const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
  const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});
  const [shortsVisible, setShortsVisible] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(() => new Date());
  const [inlineSearchVisible, setInlineSearchVisible] = React.useState(false);
  const [inlineSearchQuery, setInlineSearchQuery] = React.useState('');
  const categoryItems = React.useMemo(() => {
    if (categories) {
      return categories;
    }

    return dshCategoryFixtures.map((category) => ({
      id: category.id,
      label: category.label,
    }));
  }, [categories]);
  const visibleCategoryFixtures = React.useMemo(
    () => {
      if (categories) {
        return categories
          .map((category) => getDshCategoryFixture(category.id))
          .filter((fixture): fixture is NonNullable<ReturnType<typeof getDshCategoryFixture>> => Boolean(fixture));
      }

      return dshCategoryFixtures;
    },
    [categories],
  );
  const selectedCategoryFixture = React.useMemo(
    () =>
      activeCategoryId && activeCategoryId !== 'all'
        ? visibleCategoryFixtures.find((category) => category.id === activeCategoryId) ?? null
        : null,
    [activeCategoryId, visibleCategoryFixtures]
  );
  const selectedCategoryLabel =
    selectedCategoryFixture?.label ??
    'الفئات';
  const selectedSubcategories = selectedCategoryFixture?.subcategories ?? [];
  React.useEffect(() => {
    if (!visibleCategoryFixtures.length) {
      return;
    }

    if (!activeCategoryId || activeCategoryId === 'all') {
      return;
    }

    if (!visibleCategoryFixtures.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(visibleCategoryFixtures[0].id);
      setActiveSubcategoryId(null);
    }
  }, [activeCategoryId, visibleCategoryFixtures]);
  const allCategoryRailItems = React.useMemo(
    () =>
      visibleCategoryFixtures.map((category) => ({
        ...category,
        icon: categoryIconMap[category.id] ?? '📂',
      })),
    [visibleCategoryFixtures]
  );

  React.useEffect(() => {
    if (promos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((current) => (current + 1) % promos.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [promos]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const visibleStores = React.useMemo(() => {
    const categoryScopedStores =
      activeCategoryId && activeCategoryId !== 'all'
        ? stores.filter((store) => (store.categoryId ? store.categoryId === activeCategoryId : true))
        : stores;

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
  }, [activeCategoryId, activeFilter, favoriteToggles, inlineSearchQuery, stores]);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const resolveHomeCategoryContext = React.useCallback((targetId?: string) => {
    if (!targetId) {
      return null;
    }

    const matchedCategory = visibleCategoryFixtures.find((category) => category.id === targetId);
    if (matchedCategory) {
      return { categoryId: matchedCategory.id, subcategoryId: null as string | null };
    }

    const parentCategory = visibleCategoryFixtures.find((category) =>
      category.subcategories?.some((subcategory) => subcategory.id === targetId),
    );

    if (parentCategory) {
      return { categoryId: parentCategory.id, subcategoryId: targetId };
    }

    return null;
  }, [visibleCategoryFixtures]);

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

  const activePromo = promos[activePromoIndex % promos.length] ?? dshHomeGetFixturePromos[0];
  const promoDiscount = activePromo.subtitle.match(/\d+%/)?.[0] ?? '30%';
  const promoTail = activePromo.subtitle.replace(promoDiscount, '').trim();

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
  const bannerItems: HomeBannerCarouselItem[] = promos.map((promo) => ({
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle,
    imageUrl: promo.imageUrl,
    accentColor: promo.accentColor,
    onPress: resolveBannerPress(promo),
  }));
  const tickerState = React.useMemo(
    () => resolveTickerBanner(currentTime, recentOrders, uiText.topBar.location, currentLanguage),
    [currentLanguage, currentTime, recentOrders, uiText.topBar.location]
  );
  const openInlineSearch = React.useCallback(() => {
    setInlineSearchVisible(true);
  }, []);

  const closeInlineSearch = React.useCallback(() => {
    setInlineSearchVisible(false);
    setInlineSearchQuery('');
  }, []);

  const tickerAction = onOpenOrders ?? onOpenTracking ?? openInlineSearch;
  const categoriesDialItems = React.useMemo<CategoryDialItem[]>(() => {
    return visibleCategoryFixtures.map((category) => ({
      id: category.id,
      key: category.id,
      title: category.label,
      iconUrl: getDshCategoryIconUrl(category.id),
      emojiFallback: DSH_CATEGORY_ICONS[category.id] ?? '📂',
    }));
  }, [visibleCategoryFixtures]);

  const showSheinInline = sheinInlineVisible;
  const showAwnakInline = awnakInlineVisible;

  const activeCategoryDialItem = React.useMemo<CategoryDialItem | null>(() => {
    if (!selectedCategoryFixture) {
      return null;
    }

    return {
      id: selectedCategoryFixture.id,
      key: selectedCategoryFixture.id,
      title: selectedCategoryLabel,
      iconUrl: getDshCategoryIconUrl(selectedCategoryFixture.id),
      emojiFallback: DSH_CATEGORY_ICONS[selectedCategoryFixture.id] ?? '📂',
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
        <View style={styles.inlineSearchHeader}>
          <View style={[styles.inlineSearchHeaderRow, direction === 'rtl' && { flexDirection: 'row-reverse' }]}>
            <Pressable style={styles.inlineSearchCloseButton} onPress={closeInlineSearch}>
              <Ionicons name="close-outline" size={20} color="#111827" />
            </Pressable>
            <View style={styles.inlineSearchInputWrap}>
              <Ionicons name="search-outline" size={18} color="#ff6a00" />
              <TextInput
                value={inlineSearchQuery}
                onChangeText={setInlineSearchQuery}
                placeholder="ابحث عن متجر أو فئة داخل DSH"
                placeholderTextColor="#94a3b8"
                style={styles.inlineSearchInput}
                textAlign={direction === 'rtl' ? 'right' : 'left'}
                autoFocus
              />
            </View>
          </View>
          <BthText role="caption" style={styles.inlineSearchHint}>
            بحث عام سريع داخل تجربة DSH الحالية للوصول إلى المتاجر والمسارات بدون مغادرة الصفحة.
          </BthText>
        </View>
      ) : (
        <BthUnifiedMobileTopBar
          title={uiText.topBar.brandName}
          subtitle={uiText.topBar.brandTagline}
          locationLabel={uiText.topBar.location}
          locationIcon={<Ionicons name="location-outline" size={14} color="#FFFFFF" />}
          actions={[
            {
              id: 'my-space',
              icon: <MySpaceIcon />,
              accessibilityLabel: 'مساحتي',
              onPress: () => {
                if (onOpenMySpace) {
                  onOpenMySpace();
                  return;
                }

                onOpenEntry?.();
              },
            },
            {
              id: 'notifications',
              icon: <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />,
              badgeCount: 5,
              accessibilityLabel: 'الإشعارات',
              onPress: onOpenNotifications,
            },
            {
              id: 'cart',
              icon: <Ionicons name="cart-outline" size={21} color="#FFFFFF" />,
              accessibilityLabel: 'السلة',
              onPress: onOpenCart,
            },
            {
              id: 'search',
              icon: <Ionicons name="search-outline" size={21} color="#FFFFFF" />,
              accessibilityLabel: 'بحث',
              onPress: openInlineSearch,
            },
          ]}
          ticker={{
            statusLabel: tickerState.statusLabel,
            message: tickerState.message,
            onPress: tickerAction,
          }}
        />
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing[3], gap: spacing[2], flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {inlineSearchVisible ? (
          <BthSurface tone="raised" padding={3} gap={2}>
            <BthText role="titleSm">نتائج البحث داخل DSH</BthText>
            <BthText role="bodySm" tone="muted">
              {inlineSearchQuery.trim()
                ? `يتم الآن تصفية المتاجر والمسارات المتاحة حسب: ${inlineSearchQuery}`
                : 'ابدأ بكتابة اسم متجر أو خدمة أو فئة، وستظهر النتائج مباشرة في نفس الصفحة.'}
            </BthText>
          </BthSurface>
        ) : (
          <View style={styles.carouselViewport}>
            <HomeBannerCarousel banners={bannerItems} />
          </View>
        )}

        {showSheinInline ? (
          <BthBox gap={3}>
            <DshSheinOrderCreateScreen embedded onClose={onCloseSheinInline} />
          </BthBox>
        ) : null}

        {showAwnakInline ? (
          <BthBox gap={3}>
            <DshAwnakOrderCreateScreen embedded onClose={onCloseAwnakInline} />
          </BthBox>
        ) : null}

        <View style={styles.categoriesSelectorSection}>
          <View style={styles.categoriesSelectorRow}>
            <View style={styles.fixedIconsContainer}>
              <Pressable style={styles.categorySelectorCard} onPress={() => setShortsVisible(true)}>
                <View style={styles.videoIconContainer}>
                  <View style={styles.videoPlayIcon}>
                    <View style={styles.videoPlayTriangle} />
                  </View>
                </View>
                <View style={[styles.categoryNameContainer, styles.videoNameContainer]}>
                  <BthText role="bodySm" style={styles.categoryName} numberOfLines={1}>فيديو</BthText>
                </View>
              </Pressable>

              <View ref={categoriesAnchorRef} collapsable={false}>
                <Pressable style={styles.categorySelectorCard} onPress={openCategoriesDial}>
                  <View style={[styles.categoryIconContainer, styles.categoryHubIconContainer]}>
                    <CategoryHubIcon />
                  </View>
                  <View style={styles.categoryNameContainer}>
                    <BthText role="bodySm" style={styles.categoryName} numberOfLines={1}>الفئات</BthText>
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
                    <BthText role="bodySm" style={styles.categoryName} numberOfLines={1}>
                      {selectedCategoryLabel}
                    </BthText>
                  </View>
                </Pressable>
              ) : null}
            </View>

            <Pressable style={[styles.heroPromoCard, styles.heroPromoCardInline]} onPress={openInlineSearch}>
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

            {selectedSubcategoryCards.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
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
                      <BthText role="titleSm" style={styles.subcategoryEmoji}>
                        {subcategory.emoji}
                      </BthText>
                    </View>
                    <BthText role="bodySm" style={[styles.subcategoryName, activeSubcategoryId === subcategory.id && styles.subcategoryNameActive]} numberOfLines={1}>
                      {subcategory.title}
                    </BthText>
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
              setActiveCategoryId('all');
              setActiveSubcategoryId(null);
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
              <BthText
                role="bodySm"
                style={[
                  styles.filterChipLabel,
                  { color: activeCategoryId === 'all' ? theme.textInverse : theme.textMuted },
                ]}
                numberOfLines={1}
              >
                الكل
              </BthText>
            </View>
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
                  setActiveCategoryId(category.id);
                  setActiveSubcategoryId(null);
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
                  <BthText
                    role="bodySm"
                    style={[
                      styles.filterChipLabel,
                      { color: isActive ? theme.textInverse : theme.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {category.label}
                  </BthText>
                </View>
              </Pressable>
            );
          })}
          </ScrollView>
        </View>

        <BthBox gap={3}>
          {visibleStores.map((store, index) => {
            const card: DshStoreCompactCardData = {
              id: store.id,
              name: store.name,
              subtitle: store.address,
              image: { uri: store.imageUri ?? '' },
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
          })}
        </BthBox>

        <CategoryClockDial
          visible={categoriesSheetVisible}
          anchorLayout={categoriesDialLayout}
          items={categoriesDialItems}
          onClose={() => setCategoriesSheetVisible(false)}
          onSelect={(item) => {
            setActiveCategoryId(item.key);
            setActiveSubcategoryId(null);
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
  inlineSearchHeader: {
    backgroundColor: '#ff6a00',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 8,
  },
  inlineSearchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineSearchInputWrap: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffd3ad',
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  inlineSearchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 0,
  },
  inlineSearchCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineSearchHint: {
    color: '#fff7ed',
    lineHeight: 16,
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
  carouselViewport: {
    gap: 4,
    marginTop: 0,
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
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  videoPlayIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FF6A00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  videoPlayTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 0,
    borderBottomWidth: 9,
    borderTopWidth: 9,
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginStart: 3,
  },
  videoNameContainer: {
    backgroundColor: '#FF6A00',
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
    minWidth: 240,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
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
    flexDirection: rowDirection,
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