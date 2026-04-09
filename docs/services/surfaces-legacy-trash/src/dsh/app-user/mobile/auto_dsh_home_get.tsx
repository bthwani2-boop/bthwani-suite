// DSH Home Screen - RTL/LTR Safe, Direction-aware Layout
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Fixed: Dimensions usage, direction-safe spacing, consistent tokens usage

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
  RefreshControl,
  useWindowDimensions, // Use window dimensions hook instead of direct Dimensions
  Modal,
  Alert,
  Animated,
  Easing,
  Vibration,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_COLORS,
} from '@bthwani/ui-kit';
import { readSurfaceBindingModeFromEnv } from '@bthwani/platform-utils/remote-control';
import { fetchDshHome } from '../../data/dshHomeApi';
import type {
  DshHomeDataMock,
  DshTickerMessage,
  DshPromoBox,
} from '../../data/dshHomeTypes';
import { buildDshHomeDataMock } from '../../fixtures/home';
import {
  getDshCategoryDetailSeed,
  getDshCategoriesSeed,
  DSH_CATEGORY_ICONS,
} from '../../dshCategoriesSeed';
import { resolveDevMediaUrl } from '../../../config';
import { getDshCategoryIconUrl } from '../../getDshCategoryIconUrl';
import type { DshDeliveryModeId } from '../../deliveryModes';
import UltimateBannerCarousel, {
  type BannerItem,
} from './UltimateBannerCarousel';
import CategoryClockDial, {
  type CategoryDialItem,
  type DialAnchorLayout,
} from './CategoryClockDial';
import {
  StoreCardPremium,
  type DshStoreCompactCardData,
} from '../../components/StoreCardPremium';
import {
  ServiceShortsFullscreenViewer,
  getShortsFeed,
  resolveShortCtaToNavigation,
} from '../../../shorts';
import type { ServiceShortItem } from '@bthwani/domain-types';
import { useI18n } from '@bthwani/ui-kit/i18n';
import { Ionicons } from '@expo/vector-icons';

const DSH_SHORTS_PLACEMENT = 'dsh_home_video_icon';

/** Placeholder when DEV_MEDIA_BASE is not set — ensures banner carousel always renders. */
const PLACEHOLDER_BANNER_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** عناوين صور أيقونات الفئات — مسار موحّد من getDshCategoryIconUrl (خلفيات بيضاء فقط) */

/** يعرض صورة الأيقونة من URL مع fallback إلى الإيموجي عند فشل التحميل أو عدم توفر base */
function CategoryIconImage({
  uri,
  emojiFallback,
  style,
}: {
  uri: string | null;
  emojiFallback: string;
  style: object;
}) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return <Text style={[style, { fontSize: 28 }]}>{emojiFallback}</Text>;
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode='cover'
      onError={() => setFailed(true)}
    />
  );
}

/**
 * بانر الصفحة الرئيسية DSH — يُتحكم فيه من لوحة التحكم.
 * نماذج كاملة: فئة رئيسية، فئة فرعية، متجر، شيء جديد (رابط/شاشة)، فئة داخل متجر، منتج محدد.
 */
interface DshBanner {
  id: string;
  title?: string;
  image_url?: string;
  description?: string;
  action_url?: string;
  /**
   * نوع النقر — كل النماذج الممكنة في DSH (التحكم من لوحة التحكم):
   * offer, main_category, sub_category, store, external, store_category, product,
   * subscription, category, support, cart, orders, addresses.
   */
  action_type?:
    | 'offer'
    | 'main_category'
    | 'sub_category'
    | 'store'
    | 'external'
    | 'store_category'
    | 'product'
    | 'subscription'
    | 'category'
    | 'support'
    | 'cart'
    | 'orders'
    | 'addresses';
  /** معرّف من لوحة التحكم: categoryId, storeId, productId, أو URL حسب action_type */
  action_target?: string;
  /** معرّف ثانٍ عند الحاجة: subcategoryId، storeId للمنتج، categorySlug داخل المتجر، إلخ */
  action_extra?: string;
  /** لون تمييز للبانر (اختياري) */
  accent_color?: string;
}

interface DshCategory {
  id: string;
  name: string;
  icon: string;
  screen: string;
  isPopular?: boolean;
  /** عند الضغط ينتقل إلى DshCategoryGet مع categoryId */
  categoryId?: string;
}

interface DshSpecialOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
}

interface DshRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image_url?: string;
  logo?: string;
  isOpen: boolean;
  distance: string;
  isFavorite?: boolean;
  /** متابعة المتجر — يتحول الزر إلى "تتابعه" والعدد يزداد Optimistic */
  isFollowing?: boolean;
  hasProDelivery?: boolean;
  hasOffer?: boolean;
  offerText?: string;
  hasNewProducts?: boolean;
  address?: string;
  followersCount?: number | string;
  serviceModes?: DshDeliveryModeId[];
  /** بثواني برو فقط — لا بثواني فاملي */
  subscriptionBadge?: 'pro' | null;
  subscriptionPackageChips?: string[];
  pointsMultiplier?: number;
  hasCouponAvailable?: boolean;
}

interface DshActiveOrder {
  id: string;
  restaurantName: string;
  eta: string;
  status: string;
}

interface DshRecentOrder {
  id: string;
  restaurantName: string;
  date: string;
  total: number;
}

interface DshAddress {
  id: string;
  label: string;
  description?: string;
}

type DshTickerKind = 'platform' | 'order' | 'promo';
type DshTickerSeverity = 'info' | 'success' | 'warning' | 'danger';

interface DshTicker extends DshTickerMessage {
  kind: DshTickerKind;
  severity: DshTickerSeverity;
}

interface DshHomeData {
  orders_today?: number;
  bookings_active?: number;
  revenue_today?: number;
  banners?: DshBanner[];
  categories?: DshCategory[];
  specialOffer?: DshSpecialOffer;
  allOffers?: DshSpecialOffer[];
  restaurants?: DshRestaurant[];
  /** متاجر لكل فئة رئيسية (نفس أسلوب المطاعم) — للعرض أسفل الفئة/الفرعية */
  storesByCategory?: Record<string, DshRestaurant[]>;
  /** طلب نشط واحد ينعكس في الشريط العلوي في Home Super Hub */
  activeOrder?: DshActiveOrder | null;
  /** آخر الطلبات المكتملة — لاستخدامها في "إعادة الطلب بسرعة" */
  recentOrders?: DshRecentOrder[];
  /** العنوان الافتراضي (Smart Default) لعرضه في الشريط العلوي */
  defaultAddress?: DshAddress | null;
  /** رسائل الشريط الإخباري (منصة / طلب / عروض قصيرة العمر) */
  tickerMessages?: DshTicker[];
  /** صناديق العروض الترويجية — تظهر في صف الفئات (من CONTROL PANEL) */
  promoBoxes?: DshPromoBox[];
  resolvedZone?: {
    zoneId: string;
    zoneName: string;
    source: 'manual' | 'gps';
  };
}

interface auto_dsh_home_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route?: { params?: Record<string, unknown> };
}

export const auto_dsh_home_get: React.FC<auto_dsh_home_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const resolveZoneFromRoute = useCallback(() => {
    const zoneId = String(
      route?.params?.zone_id ?? route?.params?.zoneId ?? 'zone_center'
    );
    const zoneName = String(
      route?.params?.zone_name ?? route?.params?.zoneName ?? 'وسط المدينة'
    );
    return { zoneId, zoneName, source: 'manual' as const };
  }, [route?.params]);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions(); // Safe responsive dimensions

  // Magnetic Focus Carousel tokens (moved inside component for SCREEN_WIDTH access)
  const CATEGORY_CAROUSEL_CARD_WIDTH = 72;
  const CATEGORY_GAP = BTHWANI_SPACING.xs; // Use semantic spacing
  const CATEGORY_CAROUSEL_ITEM_WIDTH =
    CATEGORY_CAROUSEL_CARD_WIDTH + CATEGORY_GAP;
  const CATEGORY_CAROUSEL_PADDING =
    SCREEN_WIDTH / 2 - CATEGORY_CAROUSEL_CARD_WIDTH / 2;
  // Carousel animation constants (moved inside component)
  const CAROUSEL_SCALE_FACTOR = 0.12;
  const CAROUSEL_SCALE_MIN = 0.88;
  const CAROUSEL_OPACITY_FACTOR = 0.4;
  const CAROUSEL_OPACITY_MIN = 0.6;
  const CAROUSEL_FOCUS_THRESHOLD = 0.5;

  // Direction-safe calculations
  const CATEGORY_CARD_SIZE =
    (SCREEN_WIDTH - BTHWANI_SPACING.contentH * 2 - BTHWANI_SPACING.md * 2) / 5;

  const [state, setState] = useState<ScreenState>('loading');
  const [homeData, setHomeData] = useState<DshHomeData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'nearest' | 'new' | 'offers' | 'favorites'
  >('all');
  const [categoriesSheetVisible, setCategoriesSheetVisible] = useState(false);
  /** الفئة الرئيسية المختارة — محتواها (فرعيات أو متاجر) يظهر أسفل الشاشة */
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  /** الفرعية المختارة — عند الضغط على فرعي تظهر متاجرها أسفلها */
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const scrollRef = useRef<ScrollView>(null);
  const categoryContentSectionYRef = useRef(0);
  const insets = useSafeAreaInsets();
  const tickerScrollRef = useRef<ScrollView>(null);
  const tickerContentWidthRef = useRef(0);
  const tickerOffsetRef = useRef(0);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  /** Rule 7 — 60fps: قيادة الأنيميشن من الـ native driver (لا setState أثناء السحب) */
  const categoryScrollXAnimated = useRef(new Animated.Value(0)).current;
  const categoryListRef = useRef<FlatList>(null);
  const categoryPendingActionRef = useRef<{
    index: number;
    targetScrollX: number;
    run: () => void;
  } | null>(null);
  const categoryLastActiveIndexRef = useRef(0);

  const categoriesAnchorRef = useRef<View>(null);
  const [dialAnchorLayout, setDialAnchorLayout] =
    useState<DialAnchorLayout | null>(null);
  /** تفضيلات محلية للقلب — لا تغيّر homeData */
  const [favoriteToggles, setFavoriteToggles] = useState<
    Record<string, boolean>
  >({});
  /** مؤشر الإعلان الحالي في صندوق العروض الدوار */
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  /** فاصل زمني بين الإعلانات (مللي ثانية) */
  const PROMO_ROTATION_INTERVAL = 4000;

  const [followToggles, setFollowToggles] = useState<Record<string, boolean>>(
    {}
  );
  const [followCounts, setFollowCounts] = useState<Record<string, number>>({});
  /** Service Shorts — fullscreen viewer via header video icon */
  const [shortsItems, setShortsItems] = useState<ServiceShortItem[]>([]);
  const [shortsViewerVisible, setShortsViewerVisible] = useState(false);
  const [shortsViewerIndex, setShortsViewerIndex] = useState(0);
  const [shortsViewerItems, setShortsViewerItems] = useState<
    ServiceShortItem[]
  >([]);
  const [shortsViewerPlacementId, setShortsViewerPlacementId] =
    useState(DSH_SHORTS_PLACEMENT);
  const shortsItemsRef = useRef<ServiceShortItem[]>([]);
  shortsItemsRef.current = shortsItems;
  const { t, isRTL, currentLanguage } = useI18n();

  // Direction-safe layout helpers
  const rowDirection = 'row';
  const textAlign = isRTL ? 'right' : 'left';
  const textAlignStart = isRTL ? 'right' : 'left';
  const textAlignEnd = isRTL ? 'left' : 'right';

  // Create styles inside component to access CATEGORY_CARD_SIZE and SCREEN_HEIGHT
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: semanticRoles.surface,
        },
        scrollView: {
          flex: 1,
        },
        zoneInfoCard: {
          marginHorizontal: BTHWANI_SPACING.contentH,
          marginTop: BTHWANI_SPACING.sm,
          marginBottom: BTHWANI_SPACING.sm,
          padding: BTHWANI_SPACING.md,
          backgroundColor: BTHWANI_COLORS.surface,
          borderRadius: BTHWANI_RADIUS.lg,
          borderWidth: 1,
          borderColor: semanticRoles.border,
        },
        zoneInfoTitle: {
          fontSize: 14,
          fontWeight: '700',
          color: semanticRoles.text,
        },
        zoneInfoSubtitle: {
          marginTop: BTHWANI_SPACING.xs,
          fontSize: 12,
          color: semanticRoles.textMuted,
        },
        // Strong Header
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: BTHWANI_SPACING.contentH,
          paddingTop: BTHWANI_SPACING.xl,
          paddingBottom: BTHWANI_SPACING.md,
          backgroundColor: semanticRoles.surface,
          borderBottomWidth: 1,
          borderBottomColor: semanticRoles.border,
        },
        headerLeft: {
          flex: 1,
        },
        headerTitle: {
          fontSize: 22,
          fontWeight: '700',
          color: semanticRoles.text,
          marginBottom: BTHWANI_SPACING.xs / 2,
        },
        headerSubtitle: {
          fontSize: 14,
          color: semanticRoles.textMuted,
        },
        headerActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: BTHWANI_SPACING.sm,
        },
        headerIconButton: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: semanticRoles.surfaceSubtle,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        },
        headerIcon: {
          fontSize: 20,
        },
        notificationBadge: {
          position: 'absolute',
          top: 4,
          end: 4,
          backgroundColor: semanticRoles.accent,
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
        },
        notificationBadgeText: {
          color: semanticRoles.textInverse,
          fontSize: 10,
          fontWeight: '700',
        },
        bannerCarouselWrap: {
          // Locale-agnostic: same size/layout in all languages. Force LTR so carousel never reflows.
          height: 228,
          marginTop: 0,
          marginBottom: 0,
          overflow: 'hidden',
          direction: 'ltr',
          backgroundColor: '#ffffff',
        },
        bannerSlide: {
          width: '100%', // Use percentage instead of fixed width
          height: 180,
          justifyContent: 'center',
          alignItems: 'center',
        },
        bannerSlideImage: {
          ...StyleSheet.absoluteFillObject,
          width: '100%', // Use percentage for responsive width
          height: 180,
        },
        bannerCard: {
          marginBottom: BTHWANI_SPACING.lg,
          alignItems: 'center',
          borderRadius: 24,
          overflow: 'visible',
          shadowColor: semanticRoles.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
        },
        bannerImage: {
          width: '100%',
          height: '100%',
        },
        bannerImagePlaceholder: {
          width: '100%',
          height: '100%',
          backgroundColor: semanticRoles.surfaceSubtle,
          justifyContent: 'center',
          alignItems: 'center',
        },
        bannerIcon: {
          fontSize: 64,
        },
        // Categories Horizontal Scroll — مسافة أقل بين شريط التقدّم والفئات؛ الفئات ثابتة يمين
        categoriesSection: {
          marginTop: -BTHWANI_SPACING.sm,
          marginBottom: BTHWANI_SPACING.sm,
        },
        categoriesRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 0,
        },
        // Categories Selector — زر الفئات + الفئة المختارة فقط
        categoriesSelectorSection: {
          marginVertical: 2,
          paddingHorizontal: BTHWANI_SPACING.sm,
        },
        categoriesSelectorRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        fixedIconsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: BTHWANI_SPACING.sm,
        },
        categoriesSelectorScroll: {
          flex: 1,
        },
        categoriesSelectorScrollContent: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingStart: BTHWANI_SPACING.xs,
          gap: BTHWANI_SPACING.sm,
        },
        categorySelectorCard: {
          alignItems: 'center',
          paddingVertical: 2,
        },
        categoryNameContainerSelected: {
          backgroundColor: BTHWANI_COLORS.accent,
        },
        categoryNameContainerSubActive: {
          backgroundColor: BTHWANI_COLORS.navyDark,
        },
        // Subcategory Selector Cards — بطاقات أفقية صغيرة وأنيقة (ui-kit tokens)
        subcategorySelectorCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: semanticRoles.surfaceSubtle,
          borderRadius: BTHWANI_RADIUS.full,
          paddingHorizontal: BTHWANI_SPACING.sm,
          paddingVertical: BTHWANI_SPACING.xs,
          gap: BTHWANI_SPACING.xs,
          shadowColor: semanticRoles.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 2,
        },
        subcategorySelectorCardActive: {
          backgroundColor: BTHWANI_COLORS.navyDark,
        },
        subcategoryIconContainer: {
          width: 42,
          height: 42,
          borderRadius: BTHWANI_RADIUS.full,
          backgroundColor: semanticRoles.surface,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        subcategoryIconImage: {
          width: 34,
          height: 34,
        },
        subcategoryName: {
          fontSize: 12,
          fontWeight: '600',
          color: semanticRoles.text,
        },
        subcategoryNameActive: {
          color: semanticRoles.textInverse,
        },
        // Video/Shorts Icon Styles
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
          backgroundColor: BTHWANI_COLORS.accent,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: BTHWANI_COLORS.accent,
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
          backgroundColor: BTHWANI_COLORS.accent,
        },
        // Promo Banner Styles (colors are dynamic from data)
        promoBannerCard: {
          minWidth: 200,
          height: 76,
          borderRadius: BTHWANI_RADIUS.lg,
          paddingHorizontal: BTHWANI_SPACING.md,
          paddingVertical: BTHWANI_SPACING.sm,
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        },
        promoBannerContent: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: BTHWANI_SPACING.sm,
        },
        promoBannerIconWrap: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        promoBannerIcon: {
          fontSize: 26,
        },
        promoBannerTextWrap: {
          flex: 1,
          alignItems: isRTL ? 'flex-start' : 'flex-end',
        },
        promoBannerBadge: {
          paddingHorizontal: BTHWANI_SPACING.sm,
          paddingVertical: 3,
          borderRadius: BTHWANI_RADIUS.sm,
          marginBottom: 3,
        },
        promoBannerBadgeText: {
          fontSize: 10,
          fontWeight: '800',
          color: '#FFFFFF',
        },
        promoBannerTitle: {
          fontSize: 14,
          fontWeight: '700',
        },
        promoBannerSubtitle: {
          fontSize: 11,
          fontWeight: '500',
        },
        promoDotsContainer: {
          position: 'absolute',
          bottom: 4,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        },
        promoDot: {
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
        promoDotActive: {
          backgroundColor: '#FFFFFF',
          width: 8,
        },
        categoriesScrollArea: {
          flex: 1,
        },
        /** عكس الحركة الأفقية: السحب يعمل بالاتجاه المعاكس */
        categoriesScrollFlipped: {
          flex: 1,
          transform: [{ scaleX: -1 }],
        },
        categoryCarouselItemFlipped: {
          transform: [{ scaleX: -1 }],
        },
        categoriesFixedCard: {
          alignItems: 'center',
          marginStart: BTHWANI_SPACING.xs, // Use semantic spacing instead of hardcoded -8
        },
        categoriesScrollContainer: {
          paddingHorizontal: BTHWANI_SPACING.contentH,
          gap: BTHWANI_SPACING.md,
        },
        categoryCard: {
          width: CATEGORY_CARD_SIZE,
          alignItems: 'center',
          paddingVertical: BTHWANI_SPACING.sm,
        },
        categoryCardCarousel: {
          /* العرض ثابت؛ المقياس والشفافية من interpolation (Magnetic Carousel) */
        },
        categoryCardShadow: {
          elevation: 3,
          shadowColor: semanticRoles.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
        },
        categoryCardHighlighted: {
          backgroundColor: semanticRoles.primaryCTA,
          borderRadius: BTHWANI_RADIUS.lg,
          paddingVertical: BTHWANI_SPACING.md,
        },
        categoryIconContainer: {
          width: 52,
          height: 52,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2,
        },
        categoryIconContainerHighlighted: {
          // No special highlight for naked icon
        },
        categoryIcon: {
          fontSize: 28,
        },
        categoryIconImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        },
        categoryNameContainer: {
          backgroundColor: semanticRoles.primaryCTA,
          paddingHorizontal: BTHWANI_SPACING.sm,
          paddingVertical: 5,
          borderRadius: BTHWANI_RADIUS.full,
          minWidth: 56,
        },
        categoryName: {
          fontSize: 11,
          fontWeight: '700',
          color: '#FFFFFF',
          textAlign: 'center',
        },
        categoryNameHighlighted: {
          fontWeight: '800',
        },
        // Floating Main Categories Sheet — لوحة عائمة من الأسفل (مواصفات دقيقة)
        categoriesSheetContainer: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        categoriesSheetBackdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: BTHWANI_COLORS.overlay25,
        },
        categoriesSheetPanel: {
          backgroundColor: BTHWANI_COLORS.surfaceOverlay90,
          borderTopStartRadius: BTHWANI_RADIUS.xl, // Use semantic border radius
          borderTopEndRadius: BTHWANI_RADIUS.xl, // Direction-safe radius
          maxHeight: '70%', // Use percentage instead of calculation
          paddingHorizontal: BTHWANI_SPACING.contentH,
          shadowColor: semanticRoles.shadow,
          shadowOffset: { width: 0, height: -BTHWANI_SPACING.sm },
          shadowOpacity: 0.16,
          shadowRadius: BTHWANI_SPACING.lg,
        },
        categoriesSheetHandle: {
          width: 40,
          height: 4,
          borderRadius: BTHWANI_RADIUS.xs,
          backgroundColor: BTHWANI_COLORS.overlay18,
          alignSelf: 'center',
          marginTop: BTHWANI_SPACING.sm,
          marginBottom: BTHWANI_SPACING.sm,
        },
        categoriesSheetTitle: {
          fontSize: 20,
          fontWeight: '800',
          color: semanticRoles.onSurface,
          textAlign: 'center',
          marginBottom: BTHWANI_SPACING.lg,
        },
        categoriesSheetScroll: {
          maxHeight: SCREEN_HEIGHT * 0.55,
        },
        categoriesSheetGridWrap: {
          paddingBottom: BTHWANI_SPACING.lg,
        },
        categoriesSheetGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: BTHWANI_SPACING.md, // Use semantic spacing
        },
        categoriesSheetCard: {
          width: '31%',
          minHeight: 110,
          paddingVertical: BTHWANI_SPACING.sm,
          paddingHorizontal: BTHWANI_SPACING.xs,
          alignItems: 'center',
        },
        categoriesSheetCardIcon: {
          width: 64,
          height: 64,
          marginBottom: 2,
        },
        categoriesSheetCardIconImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        },
        categoriesSheetCardNameContainer: {
          backgroundColor: semanticRoles.primaryCTA,
          paddingHorizontal: BTHWANI_SPACING.sm,
          paddingVertical: 5,
          borderRadius: BTHWANI_RADIUS.full,
          minWidth: 56,
        },
        categoriesSheetCardName: {
          fontSize: 12,
          fontWeight: '700',
          textAlign: 'center',
          color: '#FFFFFF',
        },
        categoriesSheetCardActive: {
          // Active state
        },
        categoriesSheetCardNameContainerActive: {
          backgroundColor: BTHWANI_COLORS.accent,
        },
        categoriesSheetCardNameActive: {
          fontWeight: '800',
        },
        categoriesDailClosing: {
          backgroundColor: semanticRoles.surfaceSubtle,
          paddingVertical: BTHWANI_SPACING.md,
          borderRadius: BTHWANI_RADIUS.lg,
          marginBottom: BTHWANI_SPACING.md,
          paddingHorizontal: BTHWANI_SPACING.sm,
          alignItems: 'center',
        },
        categoriesDailText: {
          fontSize: 12,
          color: semanticRoles.textMuted,
          fontWeight: '600',
          textAlign: 'center',
        },
        // Restaurants Section
        sectionCategoryLabel: {
          fontSize: 18,
          fontWeight: '700',
          color: semanticRoles.onSurface,
          paddingHorizontal: BTHWANI_SPACING.contentH,
          marginBottom: BTHWANI_SPACING.xs,
        },
        categoryContentBlock: {
          paddingHorizontal: BTHWANI_SPACING.contentH,
          marginBottom: BTHWANI_SPACING.md,
        },
        sheinCtaCard: {
          backgroundColor: semanticRoles.surface,
          borderRadius: BTHWANI_RADIUS.lg,
          padding: BTHWANI_SPACING.contentH,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: semanticRoles.border,
        },
        sheinCtaIcon: { fontSize: 48, marginBottom: BTHWANI_SPACING.sm },
        sheinCtaTitle: {
          fontSize: 18,
          fontWeight: '700',
          color: semanticRoles.onSurface,
          marginBottom: BTHWANI_SPACING.xs,
        },
        sheinCtaSub: { fontSize: 14, color: semanticRoles.textMuted },
        subcategoriesRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: BTHWANI_SPACING.sm,
          marginBottom: BTHWANI_SPACING.lg,
        },
        subcategoryChip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: semanticRoles.surface,
          paddingVertical: BTHWANI_SPACING.sm,
          paddingHorizontal: BTHWANI_SPACING.contentH,
          borderRadius: BTHWANI_RADIUS.lg,
          borderWidth: 1,
          borderColor: semanticRoles.border,
        },
        subcategoryChipActive: {
          borderColor: semanticRoles.primaryCTA,
          backgroundColor: semanticRoles.surfaceSubtle,
        },
        subcategoryChipIconWrap: {
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginEnd: BTHWANI_SPACING.xs,
        },
        subcategoryChipIcon: {
          fontSize: 14,
        },
        subcategoryChipText: {
          fontSize: 13,
          fontWeight: '600',
          color: semanticRoles.text,
        },
        emptyMessage: {
          fontSize: 14,
          color: semanticRoles.textMuted,
          textAlign: 'center',
          paddingVertical: BTHWANI_SPACING.lg,
        },
        errorContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: BTHWANI_SPACING.contentH,
        },
        errorIcon: {
          fontSize: 64,
          marginBottom: BTHWANI_SPACING.md,
        },
        errorTitle: {
          fontSize: 18,
          fontWeight: '700',
          color: semanticRoles.onSurface,
          marginBottom: BTHWANI_SPACING.sm,
        },
        errorMessage: {
          fontSize: 14,
          color: semanticRoles.textMuted,
          textAlign: 'center',
          marginBottom: BTHWANI_SPACING.lg,
        },
        retryButton: {
          paddingHorizontal: BTHWANI_SPACING.lg,
          paddingVertical: BTHWANI_SPACING.md,
          backgroundColor: semanticRoles.primaryCTA,
          borderRadius: BTHWANI_RADIUS.md,
        },
        retryButtonText: {
          fontSize: 16,
          fontWeight: '600',
          color: semanticRoles.textInverse,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        loadingSpinner: {
          fontSize: 48,
        },
        restaurantCard: {
          backgroundColor: semanticRoles.surface,
          borderRadius: BTHWANI_RADIUS.lg,
          marginBottom: BTHWANI_SPACING.sm,
          overflow: 'hidden',
          shadowColor: semanticRoles.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        },
        restaurantImage: {
          width: '100%',
          height: 160,
          backgroundColor: semanticRoles.surfaceSubtle,
        },
        restaurantCardContent: {
          paddingHorizontal: BTHWANI_SPACING.md,
          paddingVertical: BTHWANI_SPACING.sm,
        },
        restaurantCardHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: BTHWANI_SPACING.xs,
        },
        restaurantName: {
          fontSize: 16,
          fontWeight: '600',
          color: semanticRoles.text,
          flex: 1,
        },
        restaurantRating: {
          fontSize: 12,
          fontWeight: '600',
          color: semanticRoles.accent,
          marginStart: BTHWANI_SPACING.xs,
        },
        restaurantCuisine: {
          fontSize: 13,
          color: semanticRoles.textMuted,
          marginBottom: BTHWANI_SPACING.xs,
        },
        restaurantInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        restaurantDistance: {
          fontSize: 12,
          color: semanticRoles.textMuted,
          marginEnd: BTHWANI_SPACING.sm,
        },
        restaurantDeliveryTime: {
          fontSize: 12,
          color: semanticRoles.textMuted,
          marginEnd: BTHWANI_SPACING.sm,
        },
        restaurantDeliveryFee: {
          fontSize: 12,
          fontWeight: '600',
          color: semanticRoles.text,
        },
        // Ticker — عداد الطلبات النشطة أسفل المنطقة المقفلة أثناء السحب (Slow scrolling zone)
        tickerSection: {
          backgroundColor: semanticRoles.surface,
          borderTopWidth: 1,
          borderTopColor: semanticRoles.border,
          paddingStart: BTHWANI_SPACING.xl * 2, // Use semantic spacing calculation
        },
        tickerContent: {
          paddingHorizontal: BTHWANI_SPACING.contentH,
          paddingVertical: BTHWANI_SPACING.xs,
        },
        tickerText: {
          fontSize: 11,
          color: semanticRoles.textMuted,
        },
        // Tab styles — نفس أسلوب واجهة المتجر (كبسولات: غير محدد رمادي، محدد برتقالي)
        restaurantsSection: {
          paddingHorizontal: BTHWANI_SPACING.sm,
          marginBottom: BTHWANI_SPACING.xs,
        },
        tabsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: BTHWANI_SPACING.xs,
          marginBottom: BTHWANI_SPACING.sm,
        },
        tabsScrollContent: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: BTHWANI_SPACING.sm,
          paddingHorizontal: BTHWANI_SPACING.sm,
        },
        tab: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: BTHWANI_SPACING.md,
          paddingVertical: BTHWANI_SPACING.sm,
          borderRadius: BTHWANI_RADIUS.full,
          backgroundColor: BTHWANI_COLORS.gray100 ?? '#F3F4F6',
          gap: 6,
        },
        tabActive: {
          backgroundColor: BTHWANI_COLORS.accent ?? semanticRoles.primaryCTA,
        },
        tabText: {
          fontSize: 13,
          fontWeight: '600',
          color: BTHWANI_COLORS.gray700 ?? semanticRoles.textMuted,
        },
        tabTextActive: {
          color: '#FFFFFF',
          fontWeight: '700',
        },
        categoryTabIcon: {
          fontSize: 16,
        },
        tabSubcategory: {
          paddingHorizontal: BTHWANI_SPACING.sm,
        },
        restaurantsList: {
          gap: BTHWANI_SPACING.xs,
        },
        restaurantCardWrapper: {
          marginBottom: 4,
        },
        bottomSpacing: {
          height: BTHWANI_SPACING.md,
        },
        storesList: {
          gap: BTHWANI_SPACING.xs,
        },
        emptyStoresMessage: {
          paddingVertical: BTHWANI_SPACING.lg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        emptyStoresText: {
          fontSize: 14,
          color: BTHWANI_COLORS.onSurfaceMuted,
          textAlign: 'center',
        },
        subcategoryChipIconImage: {
          width: '100%',
          height: '100%',
        },
        subcategoryChipLabel: {
          fontSize: 13,
          fontWeight: '600',
          color: semanticRoles.text,
        },
        // Ticker bar styles
        tickerBar: {
          backgroundColor: semanticRoles.surface,
          borderBottomWidth: 1,
          borderBottomColor: semanticRoles.surfaceSubtle,
          paddingBottom: BTHWANI_SPACING.xs / 6,
        },
        tickerBarOuter: {
          flexDirection: 'row',
        },
        tickerBarClip: {
          flex: 1,
        },
        tickerMarqueeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: BTHWANI_SPACING.contentH,
          paddingTop: BTHWANI_SPACING.xs,
          paddingBottom: BTHWANI_SPACING.xs / 6,
        },
        tickerSegment: {
          paddingTop: BTHWANI_SPACING.xs,
          paddingBottom: BTHWANI_SPACING.xs / 6,
        },
        tickerSegmentSpacer: {
          paddingStart: BTHWANI_SPACING.xl * 2,
        },
      }),
    [CATEGORY_CARD_SIZE, SCREEN_HEIGHT]
  );

  const rest = useMemo(
    () => [
      {
        id: '1',
        name: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore1Name'),
        cuisine: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore1Cuisine'),
        rating: 5.0,
        deliveryTime: t(
          'dsh.app-client.mobile.auto_dsh_home_get.mockStore1DeliveryTime'
        ),
        deliveryFee: 5,
        isOpen: true,
        distance: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore1Distance'),
        isFavorite: true,
        hasProDelivery: true,
      },
      {
        id: '2',
        name: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore2Name'),
        cuisine: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore2Cuisine'),
        rating: 4.8,
        deliveryTime: t(
          'dsh.app-client.mobile.auto_dsh_home_get.mockStore2DeliveryTime'
        ),
        deliveryFee: 3,
        isOpen: true,
        distance: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore2Distance'),
        isFavorite: false,
        hasProDelivery: false,
      },
      {
        id: '3',
        name: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore3Name'),
        cuisine: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore3Cuisine'),
        rating: 4.9,
        deliveryTime: t(
          'dsh.app-client.mobile.auto_dsh_home_get.mockStore3DeliveryTime'
        ),
        deliveryFee: 7,
        isOpen: false,
        distance: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore3Distance'),
        isFavorite: true,
        hasProDelivery: true,
      },
      {
        id: '4',
        name: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore4Name'),
        cuisine: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore4Cuisine'),
        rating: 4.6,
        deliveryTime: t(
          'dsh.app-client.mobile.auto_dsh_home_get.mockStore4DeliveryTime'
        ),
        deliveryFee: 5,
        isOpen: true,
        distance: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore4Distance'),
        isFavorite: false,
        hasProDelivery: false,
      },
      {
        id: '5',
        name: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore5Name'),
        cuisine: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore5Cuisine'),
        rating: 4.3,
        deliveryTime: t(
          'dsh.app-client.mobile.auto_dsh_home_get.mockStore5DeliveryTime'
        ),
        deliveryFee: 3,
        isOpen: true,
        distance: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore5Distance'),
        isFavorite: false,
        hasProDelivery: true,
      },
      {
        id: '6',
        name: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore6Name'),
        cuisine: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore6Cuisine'),
        rating: 4.8,
        deliveryTime: t(
          'dsh.app-client.mobile.auto_dsh_home_get.mockStore6DeliveryTime'
        ),
        deliveryFee: 7,
        isOpen: false,
        distance: t('dsh.app-client.mobile.auto_dsh_home_get.mockStore6Distance'),
        isFavorite: true,
        hasProDelivery: false,
      },
    ],
    [t, currentLanguage] // Add currentLanguage dependency for proper re-rendering
  );

  const categoriesDialItems: CategoryDialItem[] = useMemo(() => {
    const list = homeData?.categories?.filter(c => c.id !== 'all') ?? [];
    return list.map(c => ({
      id: c.id,
      key: c.categoryId ?? c.id,
      title: c.name,
      iconUrl: getDshCategoryIconUrl(c.categoryId ?? c.id),
      emojiFallback: c.icon,
    }));
  }, [homeData?.categories, isRTL, currentLanguage]); // Add currentLanguage dependency

  const closeCategoriesSheet = useCallback(() => {
    setCategoriesSheetVisible(false);
  }, []);

  useEffect(() => {
    if (state !== 'content') return;
    setShortsItems(getShortsFeed('DSH', 'dsh_home_below_hero'));
  }, [state]);

  const openShortsViewer = useCallback(() => {
    const items = shortsItemsRef.current;
    setShortsViewerItems(items);
    setShortsViewerPlacementId(DSH_SHORTS_PLACEMENT);
    setShortsViewerIndex(0);
    setShortsViewerVisible(true);
  }, []);

  useEffect(() => {
    if (route?.params?.openShorts === true && state === 'content') {
      openShortsViewer();
    }
  }, [route?.params?.openShorts, state, openShortsViewer]);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        (
          navigation.navigate as (
            s: string,
            p?: Record<string, unknown>
          ) => void
        )(screen, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  const loadHomeData = useCallback(async () => {
    try {
      setState('loading');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const bannerBase = (path: string) => {
        const url = resolveDevMediaUrl(path);
        return url ? `${url}?v=2` : undefined;
      };

      const surfaceBindingMode = readSurfaceBindingModeFromEnv();
      let raw: DshHomeDataMock;
      if (surfaceBindingMode === 'design') {
        raw = buildDshHomeDataMock(t);
      } else {
        try {
          raw = await fetchDshHome();
        } catch (fetchErr) {
          if (surfaceBindingMode === 'partial') {
            if (__DEV__) {
              console.warn('[DSH Home] partial binding: ', fetchErr);
            }
            raw = buildDshHomeDataMock(t);
          } else {
            throw fetchErr;
          }
        }
      }
      const allCats = getDshCategoriesSeed(t);
      const categories: DshCategory[] = [
        {
          id: 'all',
          name: t('dsh.app-client.mobile.auto_dsh_home_get.allCategoriesLabel'),
          icon: '📂',
          screen: 'DshCategoriesList',
          isPopular: false,
        },
        ...allCats.map(c => ({
          id: c.id,
          name: c.name,
          icon: DSH_CATEGORY_ICONS[c.id] ?? '📦',
          screen: 'DshCategoryGet',
          categoryId: c.id,
          isPopular: c.id === 'restaurants',
        })),
      ];
      const base = { ...raw, categories };
      const resolvedZone = resolveZoneFromRoute();
      // Important: Do NOT hide any main/subcategory based on zone.
      // Zones are for delivery/config, while category catalog visibility must stay 100%.
      const firstBannerPath = 'banners/dsh/banner_002.jpg';
      const firstBannerUrl = bannerBase(firstBannerPath);
      if (__DEV__ && !firstBannerUrl) {
        console.warn(
          '[DSH] Banner images unavailable: media base not configured.'
        );
      }
      const restWithImages = (base.restaurants ?? []).map((r, i) => ({
        ...r,
        image_url:
          resolveDevMediaUrl(
            'stores/dsh/store_' + String(i + 1).padStart(3, '0') + '.jpg'
          ) || undefined,
      })) as DshRestaurant[];
      const banners: DshBanner[] = (base.banners ?? []).map((b, i) => {
        const resolved = bannerBase(
          'banners/dsh/banner_' + String(i + 2).padStart(3, '0') + '.jpg'
        );
        return {
          ...b,
          image_url: resolved ?? PLACEHOLDER_BANNER_IMAGE,
        };
      }) as DshBanner[];
      setHomeData({
        ...base,
        banners,
        categories,
        restaurants: restWithImages,
        storesByCategory: {
          restaurants: restWithImages,
          ...base.storesByCategory,
        } as Record<string, DshRestaurant[]>,
        resolvedZone,
      });
      setState('content');
    } catch (error) {
      setState('error');
    }
  }, [t, resolveZoneFromRoute]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // شريط أخباري: تحريك أفقي تلقائي (ماركوي) بالاتجاه المعاكس
  const TICKER_GAP = 80;
  useEffect(() => {
    const step = 1;
    const interval = setInterval(() => {
      const total = tickerContentWidthRef.current;
      if (total <= 0) return;
      const segmentWidth = (total - TICKER_GAP) / 2;
      const resetAt = segmentWidth + TICKER_GAP;
      if (tickerOffsetRef.current <= 0) tickerOffsetRef.current = resetAt;
      tickerOffsetRef.current -= step;
      if (tickerOffsetRef.current <= 0) {
        tickerOffsetRef.current = resetAt;
      }
      tickerScrollRef.current?.scrollTo({
        x: tickerOffsetRef.current,
        animated: false,
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // صندوق العروض الدوار: تبديل تلقائي بين الإعلانات
  const activePromos = useMemo(() => {
    return (homeData?.promoBoxes ?? [])
      .filter(p => p.is_active)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 4);
  }, [homeData?.promoBoxes]);

  useEffect(() => {
    if (activePromos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPromoIndex(prev => (prev + 1) % activePromos.length);
    }, PROMO_ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [activePromos.length]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  }, [loadHomeData]);

  const handleRetry = () => {
    loadHomeData();
  };

  const handlePlannedShortcut = (label: string) => {
    switch (label) {
      case t('dsh.app-client.mobile.auto_dsh_home_get.categoryFilterAll'):
        handleNavigate('UserAddressesList');
        break;
      case t('dsh.app-client.mobile.auto_dsh_home_get.categoryFilterRestaurants'):
        handleNavigate('WltHome');
        break;
      case t('dsh.app-client.mobile.auto_dsh_home_get.categoryFilterGrocery'):
        handleNavigate('WltSubscriptionStatusGet');
        break;
      case t('dsh.app-client.mobile.auto_dsh_home_get.categoryFilterStores'):
        handleNavigate('SupportTickets');
        break;
      case t('dsh.app-client.mobile.auto_dsh_home_get.categoryFilterOther'):
        handleNavigate('DshOrdersList');
        break;
      default:
        Alert.alert(
          t('dsh.app-client.mobile.auto_dsh_home_get.alertComingSoonTitle'),
          t('dsh.app-client.mobile.auto_dsh_home_get.alertComingSoonBody', {
            label,
          })
        );
    }
  };

  // الهيدر داخل الشاشة لم يعد ضرورياً لأن شريط التطبيق العلوي الأزرق يغطي الإشعارات/الحساب/البحث
  const renderHeader = () => null;

  const renderTickerBar = () => {
    if (!homeData) return null;

    const messages: string[] = [];
    const now = Date.now();

    const baseTickers: DshTicker[] = (homeData.tickerMessages ??
      []) as DshTicker[];
    baseTickers
      .filter(msg => {
        const startsOk = !msg.starts_at || now >= Date.parse(msg.starts_at);
        const endsOk = !msg.ends_at || now <= Date.parse(msg.ends_at);
        return startsOk && endsOk && msg.message?.trim();
      })
      .forEach(msg => {
        messages.push(msg.message.trim());
      });

    if (homeData.defaultAddress?.label) {
      messages.push(
        t('dsh.app-client.mobile.auto_dsh_home_get.tickerDeliverTo', {
          address: homeData.defaultAddress.label,
        })
      );
    }

    if (homeData.activeOrder?.restaurantName && homeData.activeOrder?.eta) {
      messages.push(
        t('dsh.app-client.mobile.auto_dsh_home_get.tickerActiveOrder', {
          restaurantName: homeData.activeOrder.restaurantName,
          eta: homeData.activeOrder.eta,
        })
      );
    }

    if (!messages.length) return null;

    const tickerText = messages.join('   •   ');

    const textBlock = (
      <Text style={styles.tickerText} numberOfLines={1}>
        {tickerText}
      </Text>
    );

    return (
      <View
        style={[
          styles.tickerBar,
          styles.tickerBarOuter,
          { marginTop: -(insets.top + 6 + 10) },
        ]}
      >
        <ScrollView
          ref={tickerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          style={styles.tickerBarClip}
          contentContainerStyle={styles.tickerMarqueeRow}
          onContentSizeChange={w => {
            if (w > 0) tickerContentWidthRef.current = w;
          }}
        >
          <View style={styles.tickerSegment}>{textBlock}</View>
          <View style={[styles.tickerSegment, styles.tickerSegmentSpacer]}>
            {textBlock}
          </View>
        </ScrollView>
      </View>
    );
  };

  // Cinematic Depth Hero Carousel — بطاقة رئيسية + peek جانبي + scale + rotateY خفيف (لا انثناء/تقليب/طي)
  const onBannerPress = useCallback(
    (banner: DshBanner) => {
      const target = (banner.action_target ?? '').trim();
      const extra = (banner.action_extra ?? '').trim();

      switch (banner.action_type) {
        case 'subscription':
          handleNavigate('WltSubscriptionStatusGet');
          return;
        case 'offer':
          handleNavigate('DshStoresList');
          return;
        case 'main_category':
        case 'category':
          if (target) {
            handleNavigate('DshCategoryGet', { categoryId: target });
          } else {
            handleNavigate('DshCategoriesList');
          }
          return;
        case 'sub_category':
          handleNavigate('DshCategoryGet', {
            categoryId: target || 'grocery',
            subcategoryId: extra || undefined,
          });
          return;
        case 'store':
          if (target) {
            handleNavigate('DshStoreGet', { storeId: target });
          } else {
            handleNavigate('DshStoresList');
          }
          return;
        case 'external':
          if (target.startsWith('http://') || target.startsWith('https://')) {
            Linking.openURL(target).catch(() => {});
          } else if (target) {
            handleNavigate(target);
          }
          return;
        case 'store_category':
          if (target) {
            handleNavigate('DshStoreItemsList', {
              storeId: target,
              initialCategory: extra || undefined,
            });
          } else {
            handleNavigate('DshStoresList');
          }
          return;
        case 'product':
          if (target && extra) {
            handleNavigate('DshStoreItemsList', {
              storeId: extra,
              productId: target,
            });
          } else if (extra) {
            handleNavigate('DshStoreItemsList', { storeId: extra });
          } else {
            handleNavigate('DshStoresList');
          }
          return;
        case 'support':
          handleNavigate('SupportTickets');
          return;
        case 'cart':
          handleNavigate('DshCartGet');
          return;
        case 'orders':
          handleNavigate('DshOrdersList');
          return;
        case 'addresses':
          handleNavigate('UserAddressesList');
          return;
        default:
          handleNavigate('DshStoresList');
      }
    },
    [handleNavigate]
  );

  const renderBanner = () => {
    const banners = homeData?.banners ?? [];
    const items: BannerItem[] = banners.map(b => ({
      id: b.id,
      imageUrl: b?.image_url ?? PLACEHOLDER_BANNER_IMAGE,
      accentColor: b.accent_color ?? undefined,
    }));
    if (items.length === 0) return null;

    return (
      <View style={[styles.bannerCarouselWrap, { width: SCREEN_WIDTH }]}>
        <UltimateBannerCarousel
          banners={items}
          width={SCREEN_WIDTH}
          height={220}
          rtl={isRTL}
          onBannerPress={b => {
            const banner = banners.find(bb => bb.id === b.id) ?? banners[0];
            if (banner) onBannerPress(banner);
          }}
        />
      </View>
    );
  };

  const scrollToCategoryContent = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: categoryContentSectionYRef.current,
        animated: true,
      });
    }, 100);
  }, []);

  // Magnetic Focus Carousel — Rule 1–7: native driver, FlatList, interpolate, icon stability
  const runCategoryAction = useCallback(
    (category: DshCategory) => {
      if (category.id === 'all') {
        setCategoriesSheetVisible(true);
        return;
      }
      if (category.categoryId === 'shein') {
        handleNavigate('DshExternalOrderCreate');
        return;
      }
      if (category.categoryId === 'awnak') {
        handleNavigate('DshAwnakOrderCreate');
        return;
      }
      if (category.categoryId) {
        setSelectedCategoryId(category.categoryId);
        setSelectedSubcategoryId(null);
        scrollToCategoryContent();
      } else {
        handleNavigate(category.screen);
      }
    },
    [handleNavigate, scrollToCategoryContent]
  );

  const SCROLL_MATCH_THRESHOLD = 20;
  const updateSelectionFromScroll = useCallback(
    (contentOffsetX: number) => {
      const list = homeData?.categories?.filter(c => c.id !== 'all') ?? [];
      if (!list.length) return;
      const hasFixed = homeData?.categories?.some(c => c.id === 'all');
      const listWidth =
        SCREEN_WIDTH -
        (hasFixed ? CATEGORY_CAROUSEL_CARD_WIDTH + CATEGORY_GAP : 0);
      const paddingStart = hasFixed ? 0 : CATEGORY_CAROUSEL_PADDING;
      const viewportCenter = contentOffsetX + listWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      list.forEach((_, i) => {
        const center =
          paddingStart +
          i * CATEGORY_CAROUSEL_ITEM_WIDTH +
          CATEGORY_CAROUSEL_CARD_WIDTH / 2;
        const d = Math.abs(center - viewportCenter);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setSelectedCategoryIndex(best);
      if (categoryLastActiveIndexRef.current !== best) {
        categoryLastActiveIndexRef.current = best;
        if (Platform.OS !== 'web') {
          Vibration.vibrate(8);
        }
      }
      const pending = categoryPendingActionRef.current;
      if (
        pending &&
        Math.abs(contentOffsetX - pending.targetScrollX) <=
          SCROLL_MATCH_THRESHOLD
      ) {
        categoryPendingActionRef.current = null;
        pending.run();
      }
    },
    [homeData?.categories]
  );

  const renderCarouselItem = useCallback(
    ({ item: category, index }: { item: DshCategory; index: number }) => {
      const restCategories =
        homeData?.categories?.filter(c => c.id !== 'all') ?? [];
      const isFirstCategory = index === 0;
      const isLastCategory = index === restCategories.length - 1;
      const hasFixed = homeData?.categories?.some(c => c.id === 'all');
      const paddingStart = hasFixed ? 0 : CATEGORY_CAROUSEL_PADDING;
      const listWidth =
        SCREEN_WIDTH -
        (hasFixed ? CATEGORY_CAROUSEL_CARD_WIDTH + CATEGORY_GAP : 0);
      const centerScroll =
        paddingStart +
        index * CATEGORY_CAROUSEL_ITEM_WIDTH +
        CATEGORY_CAROUSEL_CARD_WIDTH / 2 -
        listWidth / 2;
      const W = CATEGORY_CAROUSEL_ITEM_WIDTH;
      /** استيفاء بسبع نقاط لحركة أوضح دون قفزات (سلاسة scale/opacity) */
      const inputRange = [
        centerScroll - 3 * W,
        centerScroll - 2 * W,
        centerScroll - W,
        centerScroll,
        centerScroll + W,
        centerScroll + 2 * W,
        centerScroll + 3 * W,
      ];
      const scaleMid = (1 + CAROUSEL_SCALE_MIN) / 2;
      const scaleAnim = categoryScrollXAnimated.interpolate({
        inputRange,
        outputRange: [
          CAROUSEL_SCALE_MIN,
          CAROUSEL_SCALE_MIN,
          scaleMid,
          1,
          scaleMid,
          CAROUSEL_SCALE_MIN,
          CAROUSEL_SCALE_MIN,
        ],
        extrapolate: 'clamp',
      });
      const opacityMid = (1 + CAROUSEL_OPACITY_MIN) / 2;
      const opacityAnim = categoryScrollXAnimated.interpolate({
        inputRange,
        outputRange: [
          CAROUSEL_OPACITY_MIN,
          CAROUSEL_OPACITY_MIN,
          opacityMid,
          1,
          opacityMid,
          CAROUSEL_OPACITY_MIN,
          CAROUSEL_OPACITY_MIN,
        ],
        extrapolate: 'clamp',
      });
      const labelOpacityAnim = categoryScrollXAnimated.interpolate({
        inputRange,
        outputRange: [0.85, 0.85, 0.92, 1, 0.92, 0.85, 0.85],
        extrapolate: 'clamp',
      });
      /** Rule 5 — Icon stability */
      const iconScaleAnim = categoryScrollXAnimated.interpolate({
        inputRange,
        outputRange: [
          1 / CAROUSEL_SCALE_MIN,
          1 / CAROUSEL_SCALE_MIN,
          1 / scaleMid,
          1,
          1 / scaleMid,
          1 / CAROUSEL_SCALE_MIN,
          1 / CAROUSEL_SCALE_MIN,
        ],
        extrapolate: 'clamp',
      });
      /** Parallax خفيف بسبع نقاط */
      const iconParallaxX = categoryScrollXAnimated.interpolate({
        inputRange,
        outputRange: [8, 5, 2, 0, -2, -5, -8],
        extrapolate: 'clamp',
      });

      const onPress = () => {
        const targetScrollX =
          paddingStart + index * CATEGORY_CAROUSEL_ITEM_WIDTH;
        if (index === selectedCategoryIndex) {
          runCategoryAction(category);
          return;
        }
        categoryPendingActionRef.current = {
          index,
          targetScrollX,
          run: () => runCategoryAction(category),
        };
        categoryListRef.current?.scrollToOffset({
          offset: targetScrollX,
          animated: true,
        });
        setSelectedCategoryIndex(index);
      };

      return (
        <View style={styles.categoryCarouselItemFlipped}>
          <Pressable
            style={[
              styles.categoryCard,
              styles.categoryCardCarousel,
              {
                width: CATEGORY_CAROUSEL_CARD_WIDTH,
                marginEnd: CATEGORY_GAP,
                minHeight: 96,
                justifyContent: 'center',
              },
            ]}
            onPress={onPress}
            hitSlop={{
              top: 32,
              bottom: 32,
              [isRTL ? 'right' : 'left']: isLastCategory ? 72 : 48,
              [isRTL ? 'left' : 'right']: isFirstCategory ? 72 : 48,
            }}
            android_ripple={{
              color: BTHWANI_COLORS.overlay06,
              borderless: true,
            }}
          >
            <Animated.View
              style={[
                {
                  alignItems: 'center',
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
                styles.categoryCardShadow,
              ]}
            >
              <Animated.View
                style={{
                  transform: [
                    { scale: iconScaleAnim },
                    { translateX: iconParallaxX },
                  ],
                }}
              >
                <View style={styles.categoryIconContainer}>
                  <CategoryIconImage
                    uri={getDshCategoryIconUrl(
                      category.categoryId ?? category.id
                    )}
                    emojiFallback={category.icon}
                    style={styles.categoryIconImage}
                  />
                </View>
              </Animated.View>
              <Animated.View
                style={[
                  styles.categoryNameContainer,
                  { opacity: labelOpacityAnim },
                ]}
              >
                <Text style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      );
    },
    [
      categoryScrollXAnimated,
      homeData?.categories,
      selectedCategoryIndex,
      runCategoryAction,
    ]
  );

  const AnimatedFlatList = useMemo(
    () => Animated.createAnimatedComponent(FlatList<DshCategory>),
    []
  );

  const renderCategoriesSelector = () => {
    const categories = homeData?.categories;
    if (!categories?.length) return null;

    const allItem = categories.find(c => c.id === 'all');
    const selectedCategory = selectedCategoryId
      ? categories.find(c => c.id === selectedCategoryId)
      : null;

    // Get subcategories for the selected category
    const categoryDetail = selectedCategoryId
      ? getDshCategoryDetailSeed(selectedCategoryId, t)
      : null;
    const subcategories = categoryDetail?.subcategories ?? [];

    return (
      <View style={styles.categoriesSelectorSection}>
        <View style={styles.categoriesSelectorRow}>
          {/* الأيقونات الثابتة: فيديو + الفئات */}
          <View style={styles.fixedIconsContainer}>
            {/* زر الفيديو/Shorts - يفتح عارض الفيديو */}
            <TouchableOpacity
              style={styles.categorySelectorCard}
              onPress={openShortsViewer}
              activeOpacity={0.8}
            >
              <View style={styles.videoIconContainer}>
                <View style={styles.videoPlayIcon}>
                  <View style={styles.videoPlayTriangle} />
                </View>
              </View>
              <View
                style={[
                  styles.categoryNameContainer,
                  styles.videoNameContainer,
                ]}
              >
                <Text style={styles.categoryName} numberOfLines={1}>
                  {t('dsh.app-client.mobile.auto_dsh_home_get.videoLabel') ||
                    'فيديو'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* زر الفئات - يفتح الدائرة */}
            <View ref={categoriesAnchorRef} collapsable={false}>
              <TouchableOpacity
                style={styles.categorySelectorCard}
                onPress={() => {
                  categoriesAnchorRef.current?.measureInWindow(
                    (x, y, width, height) => {
                      setDialAnchorLayout({ x, y, width, height });
                      setCategoriesSheetVisible(true);
                    }
                  );
                }}
                activeOpacity={0.8}
              >
                <View style={styles.categoryIconContainer}>
                  <CategoryIconImage
                    uri={getDshCategoryIconUrl(allItem?.categoryId ?? 'all')}
                    emojiFallback={allItem?.icon ?? '📂'}
                    style={styles.categoryIconImage}
                  />
                </View>
                <View style={styles.categoryNameContainer}>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {allItem?.name ??
                      t(
                        'dsh.app-client.mobile.auto_dsh_home_get.allCategoriesLabel'
                      )}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* الجزء المتحرك: الفئة المختارة + الفئات الفرعية + الصندوق الترويجي */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesSelectorScrollContent}
            style={styles.categoriesSelectorScroll}
          >
            {/* الفئة المختارة - تظهر بجوار زر الفئات */}
            {selectedCategory && selectedCategory.id !== 'all' && (
              <TouchableOpacity
                style={styles.categorySelectorCard}
                onPress={() => runCategoryAction(selectedCategory)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryIconContainer}>
                  <CategoryIconImage
                    uri={getDshCategoryIconUrl(
                      selectedCategory.categoryId ?? selectedCategory.id
                    )}
                    emojiFallback={selectedCategory.icon}
                    style={styles.categoryIconImage}
                  />
                </View>
                <View
                  style={[
                    styles.categoryNameContainer,
                    styles.categoryNameContainerSelected,
                  ]}
                >
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {selectedCategory.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* الفئات الفرعية - بطاقات أفقية صغيرة وجذابة */}
            {subcategories.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.subcategorySelectorCard,
                  selectedSubcategoryId === s.id &&
                    styles.subcategorySelectorCardActive,
                ]}
                onPress={() => setSelectedSubcategoryId(s.id)}
                activeOpacity={0.8}
              >
                <View style={styles.subcategoryIconContainer}>
                  <CategoryIconImage
                    uri={getDshCategoryIconUrl(s.id)}
                    emojiFallback={getSubcategoryIcon(s.slug)}
                    style={styles.subcategoryIconImage}
                  />
                </View>
                <Text
                  style={[
                    styles.subcategoryName,
                    selectedSubcategoryId === s.id &&
                      styles.subcategoryNameActive,
                  ]}
                  numberOfLines={1}
                >
                  {s.name || s.id}
                </Text>
              </TouchableOpacity>
            ))}

            {/* صندوق العروض الدوار — إعلان واحد يتبدل تلقائيًا (حتى 4 إعلانات) */}
            {activePromos.length > 0 &&
              (() => {
                const promo =
                  activePromos[currentPromoIndex % activePromos.length];
                if (!promo) return null;
                return (
                  <TouchableOpacity
                    key={`promo-rotating-${promo.id}`}
                    style={[
                      styles.promoBannerCard,
                      { backgroundColor: promo.bg_color },
                    ]}
                    onPress={() => {
                      if (
                        promo.action_type === 'screen' ||
                        promo.action_type === 'subscription'
                      ) {
                        handleNavigate(promo.action_target as any);
                      } else if (promo.action_type === 'url') {
                        Linking.openURL(promo.action_target);
                      } else if (promo.action_type === 'deeplink') {
                        Linking.openURL(promo.action_target);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.promoBannerContent}>
                      <View style={styles.promoBannerIconWrap}>
                        <Text style={styles.promoBannerIcon}>{promo.icon}</Text>
                      </View>
                      <View style={styles.promoBannerTextWrap}>
                        <View
                          style={[
                            styles.promoBannerBadge,
                            { backgroundColor: promo.badge_color },
                          ]}
                        >
                          <Text style={styles.promoBannerBadgeText}>
                            {promo.badge}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.promoBannerTitle,
                            { color: promo.text_color },
                          ]}
                          numberOfLines={1}
                        >
                          {promo.title}
                        </Text>
                        <Text
                          style={[
                            styles.promoBannerSubtitle,
                            { color: `${promo.text_color}CC` },
                          ]}
                          numberOfLines={1}
                        >
                          {promo.subtitle}
                        </Text>
                      </View>
                    </View>
                    {/* مؤشر عدد الإعلانات */}
                    {activePromos.length > 1 && (
                      <View style={styles.promoDotsContainer}>
                        {activePromos.map((_, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.promoDot,
                              idx === currentPromoIndex &&
                                styles.promoDotActive,
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })()}
          </ScrollView>
        </View>
      </View>
    );
  };

  const formatFollowers = (n?: number | string): string => {
    if (n == null) return '0';
    const num = typeof n === 'string' ? parseInt(n, 10) : n;
    if (Number.isNaN(num)) return String(n);
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  const toFollowCountNum = (n?: number | string): number => {
    if (n == null) return 0;
    const num = typeof n === 'string' ? parseInt(n, 10) : n;
    return Number.isNaN(num) ? 0 : num;
  };

  const toggleRestaurantFollow = useCallback(
    (restaurant: DshRestaurant, e: any) => {
      e?.stopPropagation?.();
      const effective =
        followToggles[restaurant.id] ?? restaurant.isFollowing ?? false;
      const next = !effective;
      const base =
        followCounts[restaurant.id] ??
        toFollowCountNum(restaurant.followersCount);
      setFollowToggles(prev => ({ ...prev, [restaurant.id]: next }));
      setFollowCounts(prev => ({
        ...prev,
        [restaurant.id]: next ? base + 1 : Math.max(0, base - 1),
      }));
      // Note: persist follow/unfollow with rollback on failure (wired via repository when available).
    },
    [followToggles, followCounts]
  );

  // تحويل مسافة النص إلى عدد (مثل "2.5 كم" أو "2.5" → 2.5)
  const parseDistanceKm = (d?: string): number | null => {
    if (d == null || d === '') return null;
    const num = parseFloat(d.replace(/[^\d.]/g, '').trim());
    return Number.isNaN(num) ? null : num;
  };

  // Render Restaurant Card — StoreCardPremium مع item
  const renderRestaurantCard = (restaurant: DshRestaurant) => {
    const effectiveFavorite =
      favoriteToggles[restaurant.id] ?? restaurant.isFavorite ?? false;
    const effectiveFollowing =
      followToggles[restaurant.id] ?? restaurant.isFollowing ?? false;
    const displayFollowCount =
      followCounts[restaurant.id] != null
        ? followCounts[restaurant.id]
        : toFollowCountNum(restaurant.followersCount);
    const modes = restaurant.serviceModes ?? ['pickup', 'merchant_delivery'];
    const hasPickup = modes.includes('pickup');
    const hasMerchant = modes.includes('merchant_delivery');
    const showProBadge =
      restaurant.subscriptionBadge === 'pro' ||
      restaurant.hasProDelivery === true;
    const subtitle = restaurant.address ?? restaurant.cuisine ?? '';

    const cardItem: DshStoreCompactCardData = {
      id: restaurant.id,
      name: restaurant.name,
      subtitle: subtitle || ' ',
      image:
        restaurant.logo || restaurant.image_url
          ? { uri: restaurant.logo || restaurant.image_url || '' }
          : { uri: 'https://via.placeholder.com/52?text=🏪' },
      rating: restaurant.rating ?? null,
      distanceKm: parseDistanceKm(restaurant.distance),
      isOpen: restaurant.isOpen,
      supportsPickup: hasPickup,
      supportsPartnerDelivery: hasMerchant,
      isFavorite: effectiveFavorite,
      isFollowing: effectiveFollowing,
      followersCount: displayFollowCount,
      hasBthwaniPro: showProBadge,
      hasNewProducts: restaurant.hasNewProducts ?? false,
      hasOffer: restaurant.hasOffer ?? false,
      offerText: restaurant.offerText,
      subscriptionPackageChips: restaurant.subscriptionPackageChips,
      pointsMultiplier: restaurant.pointsMultiplier,
      hasCouponAvailable: restaurant.hasCouponAvailable ?? false,
    };

    return (
      <View key={restaurant.id} style={styles.restaurantCardWrapper}>
        <StoreCardPremium
          item={cardItem}
          onPress={id => {
            if (selectedCategoryId === 'gas_refill') {
              handleNavigate('DshGasRefillOrderCreate', {
                stationId: id,
                storeId: id,
                subcategoryId: selectedSubcategoryId || 'gas_refill_refill',
              });
            } else {
              handleNavigate('DshStoreGet', { storeId: id });
            }
          }}
          onToggleFavorite={id => {
            setFavoriteToggles(prev => ({
              ...prev,
              [id]: !(favoriteToggles[id] ?? restaurant.isFavorite ?? false),
            }));
          }}
          onToggleFollow={id => {
            const effective =
              followToggles[id] ?? restaurant.isFollowing ?? false;
            const base =
              followCounts[id] ?? toFollowCountNum(restaurant.followersCount);
            setFollowToggles(prev => ({ ...prev, [id]: !effective }));
            setFollowCounts(prev => ({
              ...prev,
              [id]: effective ? Math.max(0, base - 1) : base + 1,
            }));
          }}
          onPressSubscriptionChip={id => {
            if (onNavigate) onNavigate('DshStoreProDetails', { storeId: id });
            else if (navigation)
              navigation.navigate('DshStoreProDetails', { storeId: id });
          }}
        />
      </View>
    );
  };

  /** أيقونة فرعية حسب slug (نفس أسلوب DshCategoryDetail) */
  const getSubcategoryIcon = (slug?: string): string => {
    if (!slug) return '📂';
    const m: Record<string, string> = {
      'vegetables-fruits': '🥬',
      'meat-fish-chicken': '🥩',
      'roasted-spices': '🌰',
      bakeries: '🍞',
      'deals-bundle': '📦',
      'fresh-juices': '🧃',
      sweets: '🍰',
      'ice-cream': '🍦',
      perfumes: '🌸',
      'accessories-beauty': '💄',
      clothing: '👕',
      refill: '⛽',
      'refill-repair': '🔧⛽',
      'buy-refill': '🛒⛽',
    };
    return m[slug] ?? '📂';
  };

  /** شريط موحّد: فلاتر ثم لكل فئة رئيسية [الرئيسية] + [فرعياتها مباشرة إن وُجدت ومختارة] ثم الفئة التالية */
  const renderUnifiedCategoryBar = () => {
    const mainCategories = getDshCategoriesSeed(t);
    const tabRowDir = {};
    const grayColor = BTHWANI_COLORS.gray700 ?? '#374151';

    return (
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.tabsScrollContent,
            isRTL && { direction: 'rtl' },
          ]}
        >
          {/* فلاتر التبويب */}
          {[
            {
              id: 'all',
              label: t('dsh.app-client.mobile.auto_dsh_home_get.tabAll'),
              icon: 'list' as const,
            },
            {
              id: 'favorites',
              label: t('dsh.app-client.mobile.auto_dsh_home_get.tabFavorites'),
              icon: 'heart-outline' as const,
            },
            {
              id: 'nearest',
              label: t('dsh.app-client.mobile.auto_dsh_home_get.tabNearest'),
              icon: 'locate-outline' as const,
            },
            {
              id: 'new',
              label: t('dsh.app-client.mobile.auto_dsh_home_get.tabNew'),
              icon: 'sparkles-outline' as const,
            },
            {
              id: 'offers',
              label: t('dsh.app-client.mobile.auto_dsh_home_get.tabOffers'),
              icon: 'pricetag-outline' as const,
            },
          ].map(({ id, label, icon }) => (
            <TouchableOpacity
              key={`filter-${id}`}
              style={[
                styles.tab,
                selectedTab === id && styles.tabActive,
                tabRowDir,
              ]}
              onPress={() => {
                setSelectedTab(
                  id as 'all' | 'nearest' | 'new' | 'offers' | 'favorites'
                );
                if (id === 'all') {
                  setSelectedCategoryId(null);
                  setSelectedSubcategoryId(null);
                }
              }}
            >
              <Ionicons
                name={icon}
                size={16}
                color={selectedTab === id ? '#FFF' : grayColor}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === id && styles.tabTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
          {/* فئات رئيسية — بعد كل رئيسية تظهر فرعياتها مباشرة إن كانت هي المختارة */}
          {mainCategories.map(cat => {
            const isSelected = selectedCategoryId === cat.id;
            const iconEmoji = DSH_CATEGORY_ICONS[cat.id] ?? '📂';
            const detail = getDshCategoryDetailSeed(cat.id, t);
            const subcategories = detail?.subcategories ?? [];

            return (
              <React.Fragment key={`main-${cat.id}`}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    isSelected && styles.tabActive,
                    tabRowDir,
                  ]}
                  onPress={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedSubcategoryId(null);
                  }}
                >
                  <Text style={styles.categoryTabIcon}>{iconEmoji}</Text>
                  <Text
                    style={[styles.tabText, isSelected && styles.tabTextActive]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
                {/* فرعيات هذه الفئة مباشرة بجوارها — فقط عند اختيار هذه الفئة */}
                {isSelected &&
                  subcategories.map(sub => {
                    const isSubSelected = selectedSubcategoryId === sub.id;
                    return (
                      <TouchableOpacity
                        key={`sub-${sub.id}`}
                        style={[
                          styles.tab,
                          styles.tabSubcategory,
                          isSubSelected && styles.tabActive,
                          tabRowDir,
                        ]}
                        onPress={() => setSelectedSubcategoryId(sub.id)}
                      >
                        <Text
                          style={[
                            styles.tabText,
                            isSubSelected && styles.tabTextActive,
                          ]}
                        >
                          {sub.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  /** قسم محتوى الفئة الموحد: فرعيات (إن وُجدت) ثم متاجر أسفل؛ شي إن = طلب يدوي فقط */
  const renderCategoryContentSection = () => {
    if (!selectedCategoryId) {
      return renderRestaurantsList();
    }
    if (selectedCategoryId === 'shein') {
      return (
        <View style={styles.categoryContentBlock}>
          <Text style={styles.sectionCategoryLabel}>
            {t(
              'dsh.app-client.mobile.auto_dsh_home_get.sectionCategoryLabelShein'
            )}
          </Text>
          <TouchableOpacity
            style={styles.sheinCtaCard}
            onPress={() => handleNavigate('DshExternalOrderCreate')}
            activeOpacity={0.8}
          >
            <Text style={styles.sheinCtaIcon}>👗</Text>
            <Text style={styles.sheinCtaTitle}>
              {t('dsh.app-client.mobile.auto_dsh_home_get.sheinCtaTitle')}
            </Text>
            <Text style={styles.sheinCtaSub}>
              {t('dsh.app-client.mobile.auto_dsh_home_get.sheinCtaSub')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (selectedCategoryId === 'awnak') {
      return (
        <View style={styles.categoryContentBlock}>
          <Text style={styles.sectionCategoryLabel}>
            {t(
              'dsh.app-client.mobile.auto_dsh_home_get.sectionCategoryLabelAwnak'
            )}
          </Text>
          <TouchableOpacity
            style={styles.sheinCtaCard}
            onPress={() => handleNavigate('DshAwnakOrderCreate')}
            activeOpacity={0.8}
          >
            <Text style={styles.sheinCtaIcon}>🤝</Text>
            <Text style={styles.sheinCtaTitle}>
              {t('dsh.app-client.mobile.auto_dsh_home_get.awnakCtaTitle')}
            </Text>
            <Text style={styles.sheinCtaSub}>
              {t('dsh.app-client.mobile.auto_dsh_home_get.awnakCtaSub')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    const categoryDetail = getDshCategoryDetailSeed(selectedCategoryId, t);
    const categoryName = categoryDetail?.name ?? selectedCategoryId;
    const storeKey = selectedSubcategoryId || selectedCategoryId;
    const stores = homeData?.storesByCategory?.[storeKey] ?? [];

    const filteredStores = stores.filter(store => {
      if (selectedTab === 'favorites') return store.isFavorite;
      if (selectedTab === 'new') return (store.rating ?? 0) >= 4.7;
      if (selectedTab === 'offers') return store.hasOffer === true;
      if (selectedTab === 'nearest')
        return parseFloat(store.distance || '999') < 2.5;
      return true;
    });

    return (
      <View style={styles.categoryContentBlock}>
        {renderUnifiedCategoryBar()}
        <View style={styles.storesList}>
          {filteredStores.length > 0 ? (
            filteredStores.map(store => renderRestaurantCard(store))
          ) : (
            <View style={styles.emptyStoresMessage}>
              <Text style={styles.emptyStoresText}>
                {t('dsh.app-client.mobile.auto_dsh_home_get.noStoresInFilter')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Render Restaurants List with Tabs
  const renderRestaurantsList = () => {
    if (!homeData?.restaurants || homeData.restaurants.length === 0)
      return null;

    const filteredRestaurants = homeData.restaurants.filter(restaurant => {
      if (selectedTab === 'favorites') return restaurant.isFavorite;
      if (selectedTab === 'new') return restaurant.rating >= 4.7;
      if (selectedTab === 'offers') return restaurant.hasOffer === true;
      if (selectedTab === 'nearest')
        return parseFloat(restaurant.distance) < 2.5;
      return true;
    });

    return (
      <View style={styles.restaurantsSection}>
        {renderUnifiedCategoryBar()}
        <View style={styles.restaurantsList}>
          {filteredRestaurants.map(restaurant =>
            renderRestaurantCard(restaurant)
          )}
        </View>
      </View>
    );
  };

  if (state === 'content' && homeData) {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          {/* شريط الأخبار ملاصق للهيدر العلوي (خارج الـ ScrollView) */}
          {renderTickerBar()}

          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Strong Header (مغطي بالهيدر الأزرق العام) */}
            {renderHeader()}

            {/* Large Promotional Banner */}
            {renderBanner()}

            <ServiceShortsFullscreenViewer
              visible={shortsViewerVisible}
              items={
                shortsViewerItems.length > 0 ? shortsViewerItems : shortsItems
              }
              initialIndex={shortsViewerIndex}
              onClose={() => setShortsViewerVisible(false)}
              onCtaPress={short => {
                const { route_key, params } =
                  resolveShortCtaToNavigation(short);
                handleNavigate(route_key, params);
                setShortsViewerVisible(false);
              }}
              language={currentLanguage?.startsWith('ar') ? 'ar' : 'en'}
              placementId={shortsViewerPlacementId}
            />

            {/* Categories Horizontal Scroll */}
            {renderCategoriesSelector()}

            {/* محتوى الفئة — نفس الأسلوب لكل فئة: فرعيات ثم متاجر أسفل (شي إن: طلب يدوي فقط) */}
            <View
              onLayout={e => {
                categoryContentSectionYRef.current = e.nativeEvent.layout.y;
              }}
            >
              {renderCategoryContentSection()}
            </View>
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* BTHWANI Clock Dial Categories — واجهة فئات دائرية منبثقة من زر الفئات */}
          <CategoryClockDial
            visible={categoriesSheetVisible}
            anchorLayout={dialAnchorLayout}
            items={categoriesDialItems}
            onClose={closeCategoriesSheet}
            onSelect={item => {
              if (item.key === 'shein') {
                handleNavigate('DshExternalOrderCreate');
              } else if (item.key) {
                setSelectedCategoryId(item.key);
                setSelectedSubcategoryId(null);
                scrollToCategoryContent();
              }
            }}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_home_get.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_home_get.errorMessage')}
      onErrorAction={handleRetry}
      screenName='auto_dsh_home_get'
      operationName='dsh_home_get'
    />
  );
};

export default auto_dsh_home_get;

