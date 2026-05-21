import React from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  PanResponder,
  FlatList,
  StatusBar,
  Vibration,
  Dimensions,
  Platform,
  Share,
  StyleSheet,

  TouchableOpacity,
  View,
  type DimensionValue,
  type ImageSourcePropType,
} from 'react-native';
// Removed Ionicons import
import {
  BannerCarousel,
  BThwaniFilterRail,
  BThwaniFilterSwipeBoundary,
  Button,
  Chip,
  GlassHeroOverlay,
  Icon,
  ProductCard,
  SearchTopBar,
  StateView,
  Text,
  Toast,
  CartConfirmationBlock,
  colorPalette,
  useBThwaniAppearance,
  useDirection,
  useTheme,
  useUiText,
  type BannerCarouselItem,
  type BThwaniAppearanceMode,
  type BThwaniFilterRailItem,
} from '@bthwani/ui-kit';
import { dshCategoryMeasurementPolicies } from '../../shared/catalog';
import { formatDshStoreFollowersLabel } from '../shared/store-profile';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import { getDshClientStateMeta } from '../data/client-state.preview-data';
import { type DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import { mapMenuItemToProductCard } from '../shared/map-menu-item-to-product-card';
import { canRenderInClientSurface } from '../../shared/workflow';
import {
  type DshFulfillmentDeliveryMode,
  getDshFulfillmentDeliveryModeMeta,
} from '../contracts/dsh-client-binding.contracts';

// Menu item view-model is shared locally to keep the screen fixture-free.

export type DshStoreGetScreenProps = {
  appearanceMode?: BThwaniAppearanceMode;
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    etaLabel: string;
    deliveryFeeLabel: string;
    followersCount?: number;
    followersLabel?: string;
    priceMatchLabel?: string;
    imageUri?: string;
    deliveryLabel?: string;
    serviceLabel?: string;
    subscriptionPackageChips?: string[];
    hasBthwaniPro?: boolean;
    publishStage?: string;
    commercialSourceMap?: import('../../shared/store-card-commercial-map').CommercialSourceMap;
    tags?: string[];
    categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
    deliveryModes?: Array<{ id: DshFulfillmentDeliveryMode; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
    // PREMIUM 2026 ENHANCEMENTS (Synced from DshHomeGetStore)
    rating?: number;
    distanceLabel?: string;
    multiplierLabel?: string;
    offerLabel?: string;
    hasOffer?: boolean;
    hasNewProducts?: boolean;
    hasCouponAvailable?: boolean;
    locationLabel?: string;
    deliveryTimeLabel?: string;
    isPopular?: boolean;
    logoImageUri?: string;
  };
  menuItems?: DshStoreGetMenuItem[];
  onOpenItems?: () => void;
  onOpenSearch?: () => void;
  onOpenCart?: (mode?: DshFulfillmentDeliveryMode) => void;
  onAddItemToCart?: (
    item: DshStoreGetMenuItem,
    payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string }
  ) => void;
  onOpenBenefits?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

function getAllDeliveryModes(): Array<{ id: DshFulfillmentDeliveryMode; label: string; icon: string }> {
  return (
    ['bthwani_delivery', 'partner_delivery', 'pickup'] as const
  ).map((id) => {
    const meta = getDshFulfillmentDeliveryModeMeta(id);
    return { id, label: meta.label, icon: meta.icon };
  });
}

const CATEGORY_EMOJI: Record<string, string> = {
  fresh: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  meals: '🍲',
  healthy: '🥗',
  sweets: '🍰',
};

const CATEGORY_ICON: Record<string, string> = {
  popular: '🔥',
  fresh: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  meals: '🍲',
  healthy: '🥗',
  sweets: '🍰',
};


function normalizeFollowersLabel(value: number | string | undefined, suffix: string) {
  if (typeof value === 'number') {
    return formatDshStoreFollowersLabel(value, suffix);
  }

  if (!value) {
    return undefined;
  }

  const normalizedValue = normalizeDisplayText(value);
  if (normalizedValue.includes('ألف') || normalizedValue.includes('مليون')) {
    return normalizedValue;
  }

  const digits = normalizedValue.match(/[\d.,]+/g)?.join('')?.trim();
  if (!digits) {
    return normalizedValue;
  }

  const numericValue = Number(digits.replace(/,/g, ''));
  if (Number.isFinite(numericValue) && numericValue >= 1000) {
    return formatDshStoreFollowersLabel(numericValue, suffix);
  }

  return suffix ? `${digits} ${suffix}` : digits;
}

function normalizePriceMatchLabel(label: string | undefined, fallback: string) {
  if (!label) {
    return fallback;
  }

  const normalized = label.trim().toLowerCase();
  if (normalized.includes('price') || normalized.includes('standard')) {
    return fallback;
  }

  return label;
}

function normalizeTagLabel(tag: string, storeText: ReturnType<typeof useUiText>['storeScreen']) {
  const normalized = tag.trim().toLowerCase();

  if (normalized.includes('pro')) return 'بثواني برو';
  if (normalized.includes('pickup')) return storeText.get.pickup;
  if (normalized.includes('partner delivery') || normalized.includes('store delivery')) return storeText.get.storeDelivery;
  if (normalized.includes('offer')) return 'عرض مباشر';
  if (normalized.includes('km')) return tag.replace(/km/i, 'كم');

  return tag;
}

function isDeliveryBenefitLabel(tag: string, storeText: ReturnType<typeof useUiText>['storeScreen']) {
  const normalized = normalizeDisplayText(tag).trim().toLowerCase();

  return normalized === normalizeDisplayText(storeText.get.storeDelivery).toLowerCase()
    || normalized === normalizeDisplayText(storeText.get.pickup).toLowerCase()
    || normalized === normalizeDisplayText(storeText.get.platformDelivery).toLowerCase()
    || normalized.includes('توصيل المتجر')
    || normalized.includes('استلم بنفسك')
    || normalized.includes('توصيل بثواني');
}

function normalizeDisplayText(value?: string) {
  if (!value) return '';

  return value
    .replace(/Hadda Fresh Market/gi, 'أسواق العليا الطازجة')
    .replace(/Hittin Bakery/gi, 'مخبز حطين')
    .replace(/Malqa Kitchen/gi, 'مطبخ الملقا')
    .replace(/Groceries and daily essentials/gi, 'مقاضي يومية ومنتجات طازجة')
    .replace(/Bread and pastries/gi, 'مخبوزات وخبز يومي')
    .replace(/Prepared meals/gi, 'وجبات جاهزة يومياً')
    .replace(/Royal Gala Apples/gi, 'تفاح رويال غالا')
    .replace(/Organic Milk/gi, 'حليب عضوي')
    .replace(/Whole Wheat Bread/gi, 'خبز قمح كامل')
    .replace(/Butter Croissant/gi, 'كرواسون زبدة')
    .replace(/Chocolate Slice/gi, 'شريحة شوكولاتة')
    .replace(/Creamy Pasta Box/gi, 'باستا كريمية')
    .replace(/Garden Salad/gi, 'سلطة جاردن')
    .replace(/Fresh box, 1 kg/gi, 'صندوق طازج 1 كجم')
    .replace(/1\.5L chilled bottle/gi, 'عبوة مبردة 1.5 لتر')
    .replace(/Daily fresh bakery/gi, 'مخبوز يومي طازج')
    .replace(/Baked every morning/gi, 'يخبز طازجًا كل صباح')
    .replace(/Single serving/gi, 'حصة فردية جاهزة')
    .replace(/Prepared meal ready to dispatch/gi, 'وجبة جاهزة للإرسال')
    .replace(/Light and fresh bowl/gi, 'طبق خفيف وطازج')
    .replace(/Popular/gi, 'الأكثر طلبًا')
    .replace(/Best seller/gi, 'الأكثر مبيعًا')
    .replace(/Chef pick/gi, 'اختيار الشيف')
    .replace(/Fresh/gi, 'طازج')
    .replace(/Dairy/gi, 'ألبان')
    .replace(/Bakery/gi, 'مخبوزات')
    .replace(/Meals/gi, 'وجبات')
    .replace(/Healthy/gi, 'صحي')
    .replace(/Sweets/gi, 'حلويات')
    .replace(/ETA\s*/gi, '')
    .replace(/\bmin\b/gi, 'دقيقة')
    .replace(/\bYER\b/gi, 'ر.ي')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

type DshStoreOperationalState = 'area_unserviceable' | 'store_closed' | 'store_open';
function resolveStoreOperationalState(statusLabel: string, deliveryLabel?: string, serviceLabel?: string): DshStoreOperationalState {
  const normalized = [statusLabel, deliveryLabel, serviceLabel]
    .filter(Boolean)
    .join(' ')
    .trim()
    .toLowerCase();

  if (
    normalized.includes('area_unserviceable')
    || normalized.includes('unserviceable')
    || normalized.includes('outside coverage')
    || normalized.includes('خارج التغطية')
    || normalized.includes('خارج النطاق')
    || normalized.includes('غير مخدوم')
  ) {
    return 'area_unserviceable';
  }

  if (normalized.includes('closed') || normalized.includes('مغلق')) {
    return 'store_closed';
  }

  return 'store_open';
}


function resolveDshStoreMenuItemImageSource(item: DshStoreGetMenuItem): ImageSourcePropType | undefined {
  if (!canRenderInClientSurface(item.publishStage, 'product-media')) {
    return undefined;
  }
  return resolveDshImageSource(item.imageUri);
}

function resolveDshStoreCoverImageSource(store?: DshStoreGetScreenProps['store']): ImageSourcePropType | undefined {
  if (!canRenderInClientSurface(store?.publishStage, 'store')) {
    return undefined;
  }
  return resolveDshImageSource(store?.imageUri);
}
function getItemEmoji(item: DshStoreGetMenuItem) {
  return CATEGORY_EMOJI[item.categoryId] ?? '🍽️';
}

function resolveMeasurementOptions(item: DshStoreGetMenuItem) {
  if (item.measurementOptions?.length) {
    return item.measurementOptions;
  }

  return dshCategoryMeasurementPolicies[item.categoryId]?.options ?? ['حبة', '2 حبة'];
}


function extractPriceValue(priceLabel?: string) {
  const normalized = Number((priceLabel ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(normalized) ? normalized : 0;
}

function resolveMeasurementMultiplier(option: string) {
  const normalized = option.trim();

  if (normalized.includes('250')) return 0.25;
  if (normalized.includes('500')) return 0.5;
  if (normalized.includes('1 كجم')) return 1;
  if (normalized.includes('2 حبة')) return 2;
  if (normalized.includes('4 حبة')) return 4;
  if (normalized.includes('6 حبة')) return 6;
  if (normalized.includes('ربع')) return 0.25;
  if (normalized.includes('نصف')) return 0.5;
  if (normalized.includes('نفر')) return 1;

  return 1;
}

function pickBackdropColor(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('تفاح') || n.includes('apple') || n.includes('gala')) return colorPalette.successSoft;
  if (n.includes('حليب') || n.includes('milk')) return colorPalette.infoSoft;
  if (n.includes('خبز') || n.includes('bread')) return colorPalette.brandSoft;
  return colorPalette.pageBackground;
}

function hexToRgba(hex: string, alpha = 0.9) {
  const clean = (hex || colorPalette.white).replace('#', '').trim();
  const short = clean.length === 3;
  const r = parseInt(short ? clean[0] + clean[0] : clean.slice(0, 2), 16);
  const g = parseInt(short ? clean[1] + clean[1] : clean.slice(2, 4), 16);
  const b = parseInt(short ? clean[2] + clean[2] : clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getOverlayColor(name: string, alpha = 0.88) {
  return hexToRgba(pickBackdropColor(name), alpha);
}

function formatCurrencyValue(value: number) {
  const normalized = value % 1 === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  return `${normalized} ر.ي`;
}

function resolveMeasurementUnitPrice(item: DshStoreGetMenuItem, option: string) {
  return extractPriceValue(item.priceLabel) * resolveMeasurementMultiplier(option);
}

function renderNonReadyState(
  state: 'loading' | 'empty' | 'error' | 'offline' | 'disabled',
  storeText: ReturnType<typeof useUiText>['storeScreen'],
  onRetry?: () => void,
) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title={storeText.states.storeEmptyTitle}
        description={storeText.states.storeEmptyDescription}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title={storeText.states.storeErrorTitle}
      description={storeText.states.storeErrorDescription}
      actionLabel={storeText.states.retry}
      onActionPress={onRetry}
    />
  );
}


function MenuItemCard({
  item,
  partnerImageSource,
  onAddPress,
  onImagePress,
  onFavoritePress,
  isFavorited,
}: {
  item: DshStoreGetMenuItem;
  partnerImageSource?: ImageSourcePropType | string | null;
  onAddPress?: (anchor?: { x: number; y: number }) => void;
  onImagePress?: (item: DshStoreGetMenuItem) => void;
  onFavoritePress?: () => void;
  isFavorited?: boolean;
}) {
  const productCard = mapMenuItemToProductCard(item);

  return (
    <ProductCard
      {...productCard}
      title={normalizeDisplayText(productCard.title)}
      subtitle={normalizeDisplayText(productCard.subtitle)}
      statusLabel={normalizeDisplayText(item.statusLabel ?? productCard.statusLabel ?? '') || undefined}
      categoryLabel={normalizeDisplayText(item.categoryLabel ?? productCard.categoryLabel ?? '') || undefined}
      preparationTime={normalizeDisplayText(item.preparationTime ?? productCard.preparationTime ?? '') || undefined}
      imageSource={resolveDshStoreMenuItemImageSource(item)}
      partnerImageSource={partnerImageSource}
      onAdd={onAddPress}
      onImagePress={onImagePress ? () => onImagePress(item) : undefined}
      onFavorite={onFavoritePress}
      isFavorited={isFavorited}
    />
  );
}

type DshStoreGetScreenContentProps = DshStoreGetScreenProps & {
  appearanceMode: BThwaniAppearanceMode;
};

export function DshStoreGetScreen(props: DshStoreGetScreenProps) {
  const appearanceMode = props.appearanceMode ?? 'lightPremium';
  return <DshStoreGetScreenContent {...props} appearanceMode={appearanceMode} />;
}

function DshStoreGetScreenContent({
  appearanceMode,
  state = 'ready',
  store,
  menuItems = [],
  onOpenItems,
  onOpenSearch: _onOpenSearch,
  onOpenCart,
  onAddItemToCart,
  onOpenBenefits,
  onBack: _onBack,
  onRetry,
  onSupport,
}: DshStoreGetScreenContentProps) {
  const sm = store?.commercialSourceMap;
  const isProBlocked = sm?.['hasBthwaniPro']?.conflictStatus === 'blocker';
  const isPriceMatchBlocked = sm?.['priceMatchLabel']?.conflictStatus === 'blocker';

  const { tokens } = useBThwaniAppearance();
  const { direction } = useDirection();
  const { mode: themeMode, theme } = useTheme();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const isDarkGlass = appearanceMode === 'darkGlass' || themeMode === 'dark';
  const isRTL = direction === 'rtl';
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
  const [selectedMode, setSelectedMode] = React.useState<DshFulfillmentDeliveryMode>('bthwani_delivery');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [pickerItem, setPickerItem] = React.useState<DshStoreGetMenuItem | null>(null);
  const [selectedMeasureOption, setSelectedMeasureOption] = React.useState<string | null>(null);
  const [selectedMeasureQty, setSelectedMeasureQty] = React.useState(1);
  const [pickerAnchor, setPickerAnchor] = React.useState({ x: 32, y: 360 });
  const [headerSearchVisible, setHeaderSearchVisible] = React.useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = React.useState('');
  const [addedItemLabel, setAddedItemLabel] = React.useState('');
  const [previewItem, setPreviewItem] = React.useState<DshStoreGetMenuItem | null>(null);
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());
  const [isAddedToCart, setIsAddedToCart] = React.useState(false);

  const appearanceChrome = React.useMemo(() => ({
    accent: tokens.colors.accentOrange,
    activeActionBackground: tokens.actionSelectedBackground,
    activeActionBorder: tokens.components.commerce.deliverySelectedBorder,
    cardBackground: isDarkGlass ? tokens.colors.surfaceRaised : tokens.colors.surfacePrimary,
    cardBorder: isDarkGlass ? tokens.colors.glassBorder : tokens.colors.borderSubtle,
    modalBorder: tokens.components.overlays.modalBorder,
    modalSurface: tokens.components.overlays.modalSurface,
    overlay: tokens.components.overlays.modalBackdrop,
    overlaySoft: isDarkGlass ? tokens.colors.overlaySoft : stylesTokens.overlaySoft,
    primaryText: tokens.colors.textPrimary,
    screenBackground: tokens.appBackground,
    secondaryText: tokens.colors.textSecondary,
    strongSurface: isDarkGlass ? tokens.glassSurfaceStrong : tokens.colors.surfacePrimary,
    subtleSurface: isDarkGlass ? tokens.glassSurface : tokens.colors.surfaceRaised,
    heroOverlay: tokens.components.overlays.heroOverlay,
    actionBackgroundGlass: isDarkGlass ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.45)',
    actionBorderGlass: isDarkGlass ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.12)',
    identityDockBackground: isDarkGlass ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.88)',
    identityDockBorder: isDarkGlass ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
    echoImageOpacity: isDarkGlass ? 0.6 : 1,
    cbWashColor: isDarkGlass ? 'rgba(22, 22, 28, 0.82)' : 'rgba(255, 255, 255, 0.88)',
    heroFadeRGB: isDarkGlass ? '22, 22, 28' : '255, 255, 255',
    heroFadeMaxAlpha: isDarkGlass ? 0.82 : 0.88,
    // REVERSE FEATHER GRADIENT (Metrics Row Transition)
    metricsFeatherColor: isDarkGlass ? tokens.colors.surfaceRaised : stylesTokens.white,
  }), [isDarkGlass, tokens]);

  const handleToggleFavorite = React.useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const closeImagePreview = React.useCallback(() => setPreviewItem(null), []);

  const deliveryModes = React.useMemo(() => {
    if (store?.deliveryModes?.length) {
      return store.deliveryModes
        .filter((m) => m.isAvailable)
        .map((m) => {
          const meta = getDshFulfillmentDeliveryModeMeta(m.id);
          return { id: m.id, label: meta.label, icon: meta.icon };
        });
    }
    return getAllDeliveryModes();
  }, [store?.deliveryModes]);

  React.useEffect(() => {
    if (deliveryModes.length === 0) {
      return;
    }

    if (deliveryModes.some((mode) => mode.id === selectedMode)) {
      return;
    }

    setSelectedMode(deliveryModes[0].id);
  }, [deliveryModes, selectedMode]);

  const storeCoverImageSource = React.useMemo(() => {
    if (!store) return undefined;
    // Global Rule: Square frame always uses store cover image
    return resolveDshImageSource(store.imageUri);
  }, [store]);

  const storeLogoImageSource = React.useMemo(() => {
    if (!store) return undefined;
    // Global Rule: Circular frame always uses store logo image
    // Fallback to brand logo only if store logo is missing, never use cover image
    return resolveDshImageSource(store.logoImageUri) || resolveDshImageSource('dsh.brand.logo.v1');
  }, [store]);

  const fallbackMenuItems = React.useMemo<DshStoreGetMenuItem[]>(() => menuItems ?? [], [menuItems]);

  const previewPartnerBadge = storeLogoImageSource ? (
    <View style={styles.previewPartnerBadge} pointerEvents="none">
      <View style={styles.previewPartnerBadgeImageContainer}>
        <Image source={storeLogoImageSource} style={styles.previewPartnerBadgeImage} resizeMode="contain" />
      </View>
    </View>
  ) : null;

  const clientVisibleItems = React.useMemo(
    () => fallbackMenuItems.filter((item) => item.isAvailable !== false && canRenderInClientSurface(item.publishStage, 'product')),
    [fallbackMenuItems],
  );

  const isOfferItem = React.useCallback((item: DshStoreGetMenuItem) => {
    if ((item as Record<string, unknown>).isOffer) return true;
    if (item.discountLabel) return true;
    if (item.oldPriceLabel && item.priceLabel) return true;
    const d = normalizeDisplayText(item.discountLabel ?? '').toLowerCase();
    if (d.includes('%') || /\d+%/.test(d)) return true;
    return false;
  }, []);

  const isNewItem = React.useCallback((item: DshStoreGetMenuItem) => {
    if (item.isNew) return true;
    const s = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
    if (s.includes('وصل') || s.includes('جديد') || s.includes('حديث')) return true;
    return false;
  }, []);

  const isFavoriteItem = React.useCallback((item: DshStoreGetMenuItem) => {
    if (item.isFavorite || item.isFavorited) return true;
    const s = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
    if (s.includes('مفضل') || s.includes('مفضلة')) return true;
    // fallback: check tags or category label
    if (normalizeDisplayText(item.categoryLabel ?? '').toLowerCase().includes('مفضل')) return true;
    return false;
  }, []);

  const categories = React.useMemo(() => {
    const storeCategories = (store?.categories ?? []).filter((category) =>
      clientVisibleItems.some((item) => item.categoryId === category.id),
    );
    const popularCount = clientVisibleItems.filter((item) => {
      const status = normalizeDisplayText(item.statusLabel ?? '');
      return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
    }).length;

    const favoritesCount = clientVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id)).length;
    const newCount = clientVisibleItems.filter(isNewItem).length;
    const offersCount = clientVisibleItems.filter(isOfferItem).length;

    return [
      { id: 'all', label: 'جميع الأقسام', itemCount: clientVisibleItems.length, isPopular: true },
      { id: 'popular', label: 'الأكثر طلبًا', itemCount: popularCount || Math.min(clientVisibleItems.length, 4), isPopular: true },
      { id: 'favorites', label: 'المفضلة', itemCount: favoritesCount },
      { id: 'new', label: 'الجديدة', itemCount: newCount },
      { id: 'offers', label: 'العروض', itemCount: offersCount },
      ...storeCategories,
    ];
  }, [clientVisibleItems, store?.categories, isFavoriteItem, isNewItem, isOfferItem, favoriteIds]);

  const CARD_HEIGHT = 126;
  const CARD_GAP = 2;
  const SNAP_INTERVAL = CARD_HEIGHT + CARD_GAP;

  const listRef = React.useRef<FlatList<DshStoreGetMenuItem> | null>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [stickyThreshold, setStickyThreshold] = React.useState(1000);


  // Preview carousel state
  const previewListRef = React.useRef<FlatList<DshStoreGetMenuItem> | null>(null);
  const [previewActiveIndex, setPreviewActiveIndex] = React.useState(-1);
  const previewScrollY = React.useRef(new Animated.Value(0)).current;
  const previewAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (previewItem) {
      Animated.spring(previewAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      previewAnim.setValue(0);
    }
  }, [previewItem, previewAnim]);

  const PREVIEW_ITEM_WIDTH = viewportWidth * 0.92;
  const PREVIEW_ITEM_HEIGHT = viewportHeight * 0.54;
  const PREVIEW_ITEM_GAP = 16;
  const PREVIEW_SNAP_INTERVAL = PREVIEW_ITEM_HEIGHT + PREVIEW_ITEM_GAP;

  const openImagePreview = React.useCallback((item: DshStoreGetMenuItem) => {
    const index = previewItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setPreviewActiveIndex(index);
      setPreviewItem(item);
    }
  }, [previewItems]);

  const resolveItemsForCategory = React.useCallback((categoryId: string) => {
    const scopedItems = (() => {
      if (categoryId === 'all') {
        return clientVisibleItems;
      }

      if (categoryId === 'popular') {
        const popularItems = clientVisibleItems.filter((item) => {
          const status = normalizeDisplayText(item.statusLabel ?? '');
          return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
        });

        return popularItems.length ? popularItems : clientVisibleItems.slice(0, Math.min(4, clientVisibleItems.length));
      }

      if (categoryId === 'favorites') {
        return clientVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id));
      }

      if (categoryId === 'new') {
        return clientVisibleItems.filter((item) => isNewItem(item));
      }

      if (categoryId === 'offers') {
        return clientVisibleItems.filter((item) => isOfferItem(item));
      }

      return clientVisibleItems.filter((item) => item.categoryId === categoryId);
    })();

    const normalizedQuery = headerSearchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return scopedItems;
    }

    return scopedItems.filter((item) => {
      const searchableText = [
        normalizeDisplayText(item.name),
        normalizeDisplayText(item.subtitle),
        normalizeDisplayText(item.categoryLabel),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [clientVisibleItems, headerSearchQuery, isFavoriteItem, isNewItem, isOfferItem, favoriteIds]);

  const visibleItems = React.useMemo(() => resolveItemsForCategory(selectedCategory), [resolveItemsForCategory, selectedCategory]);
  const previewItems = visibleItems;

  React.useEffect(() => {
    if (!categories.length) {
      return;
    }

    if (categories.some((category) => category.id === selectedCategory)) {
      return;
    }

    setSelectedCategory(categories[0]?.id ?? 'all');
  }, [categories, selectedCategory]);

  const changeCategory = React.useCallback((newId: string) => {
    if (newId === selectedCategory) return;
    setSelectedCategory(newId);
    try { Vibration.vibrate(8); } catch { /* noop */ }
  }, [selectedCategory]);

  const categoryRailItems = React.useMemo<BThwaniFilterRailItem[]>(
    () =>
      categories.map((category) => ({
        id: category.id,
        label: normalizeDisplayText(category.label),
        icon: CATEGORY_ICON[category.id]
          ? <Text style={{ fontSize: 14 }}>{CATEGORY_ICON[category.id]}</Text>
          : ({ selected }) => (
              <Icon
                name={
                  category.id === 'all' ? 'reorder-three-outline' :
                  category.id === 'favorites' ? 'heart-outline' :
                  category.id === 'new' ? 'sparkles-outline' :
                  category.id === 'offers' ? 'pricetag-outline' :
                  'grid-outline'
                }
                size={16}
                color={selected ? (isDarkGlass ? colorPalette.brand : colorPalette.white) : (isDarkGlass ? tokens.glassMutedText : appearanceChrome.secondaryText)}
              />
            ),
      })),
    [appearanceChrome.secondaryText, categories, isDarkGlass, tokens.glassMutedText],
  );

  // Dual-Axis Navigation PanResponder for Preview
  // Wide hit area covering the entire wrap
  const previewPanResponder = React.useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Intercept only for clear horizontal swipes. Vertical moves are passed to the FlatList.
        return Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 20;
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx } = gestureState;
        const threshold = 40;

        if (Math.abs(dx) > threshold) {
          const direction = dx > 0 ? -1 : 1;
          const adjustedDirection = isRTL ? -direction : direction;
          const nextIndex = previewActiveIndex + adjustedDirection;

          if (nextIndex >= 0 && nextIndex < previewItems.length) {
            setPreviewActiveIndex(nextIndex);
            setPreviewItem(previewItems[nextIndex]);
            previewListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          }
        }
      },
    }),
    [previewActiveIndex, previewItems, isRTL]
  );

  const renderPreviewItem = React.useCallback(({ item, index }: { item: DshStoreGetMenuItem, index: number }) => {
    const inputRange = [
      (index - 1) * PREVIEW_SNAP_INTERVAL,
      index * PREVIEW_SNAP_INTERVAL,
      (index + 1) * PREVIEW_SNAP_INTERVAL,
    ];

    const scale = previewScrollY.interpolate({
      inputRange,
      outputRange: [0.94, 1, 0.94],
      extrapolate: 'clamp',
    });

    const opacity = previewScrollY.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[
        styles.previewCard,
        {
          width: PREVIEW_ITEM_WIDTH,
          height: PREVIEW_ITEM_HEIGHT,
          marginVertical: PREVIEW_ITEM_GAP / 2,
          backgroundColor: appearanceChrome.modalSurface,
          borderColor: appearanceChrome.modalBorder,
          borderWidth: 1,
          opacity,
          transform: [{ scale }]
        }
      ]}>
        <View style={styles.previewImageWrap} pointerEvents="box-none">
          <TouchableOpacity
            style={[styles.previewDetailsFavoriteButton, { position: 'absolute', top: 12, right: 12, zIndex: 12 }]}
            onPress={() => handleToggleFavorite(item.id)}
          >
            <View style={styles.previewFavoriteCircle}>
              <Icon name={favoriteIds.has(item.id) ? 'heart' : 'heart-outline'} size={20} color={stylesTokens.orange} />
            </View>
          </TouchableOpacity>

          <Image
            source={resolveDshStoreMenuItemImageSource(item)}
            style={styles.previewImage}
            resizeMode="cover"
          />

          {storeLogoImageSource ? (
            <View style={[styles.previewPartnerBadge, { position: 'absolute', bottom: 20, right: 12, zIndex: 13 }]} pointerEvents="none">
              <View style={styles.previewPartnerBadgeImageContainer}>
                <Image source={storeLogoImageSource} style={styles.previewPartnerBadgeImage} resizeMode="contain" />
              </View>
            </View>
          ) : null}

          <View style={[styles.previewDetailsBox, {
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            borderRadius: 24,
            margin: 12,
            padding: 12,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }]} pointerEvents="box-none">
            <View style={[styles.previewDetailsContent, { flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', paddingRight: isRTL ? 56 : 0, paddingLeft: isRTL ? 0 : 8 }]}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={[styles.previewDetailsTitle, { color: appearanceChrome.primaryText, fontSize: 16 }]} numberOfLines={1}>{normalizeDisplayText(item.name)}</Text>
                {store ? <Text style={[styles.previewStoreName, { color: appearanceChrome.accent, marginHorizontal: 4, fontSize: 12 }]}>· {normalizedStoreName}</Text> : null}
              </View>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                {item.priceLabel ? <Text style={[styles.previewDetailsPrice, { color: appearanceChrome.primaryText, fontSize: 18, fontWeight: '900' }]}>{normalizeDisplayText(item.priceLabel)}</Text> : null}
                {item.discountLabel ? <Text style={[styles.previewDetailsDiscount, { color: appearanceChrome.accent, marginHorizontal: 6, fontSize: 12, fontWeight: '700' }]}>{normalizeDisplayText(item.discountLabel)}</Text> : null}
                {item.subtitle ? <Text style={[styles.previewDetailsSubtitle, { color: appearanceChrome.secondaryText, fontSize: 12 }]}>· {normalizeDisplayText(item.subtitle)}</Text> : null}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.previewActionButton, { backgroundColor: stylesTokens.orange, padding: 10, borderRadius: 16 }]}
              onPress={() => {
                openMeasurementPicker(item, { x: viewportWidth / 2, y: viewportHeight / 2 });
                closeImagePreview();
              }}
            >
              <View style={{ position: 'relative' }}>
                <Icon name="cart-outline" size={20} color={stylesTokens.white} />
                <View style={[styles.previewActionPlusBadge, { backgroundColor: stylesTokens.white, borderColor: stylesTokens.orange }]}>
                  <Icon name="add" size={8} color={stylesTokens.orange} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }, [previewScrollY, PREVIEW_SNAP_INTERVAL, PREVIEW_ITEM_WIDTH, PREVIEW_ITEM_HEIGHT, PREVIEW_ITEM_GAP, appearanceChrome, storeLogoImageSource, favoriteIds, isRTL, store, normalizedStoreName, handleToggleFavorite, openMeasurementPicker, closeImagePreview, viewportWidth, viewportHeight]);

  const activeMeasurementOptions = React.useMemo(
    () => (pickerItem ? resolveMeasurementOptions(pickerItem) : []),
    [pickerItem],
  );

  const selectedMeasureUnitPrice = React.useMemo(() => {
    if (!pickerItem || !selectedMeasureOption) {
      return 0;
    }

    return resolveMeasurementUnitPrice(pickerItem!, selectedMeasureOption);
  }, [pickerItem, selectedMeasureOption]);

  const selectedMeasureTotalPrice = React.useMemo(
    () => selectedMeasureUnitPrice * selectedMeasureQty,
    [selectedMeasureQty, selectedMeasureUnitPrice],
  );

  const measurePopoverTop = React.useMemo(
    () => Math.max(180, Math.min(pickerAnchor.y - 170, 640)),
    [pickerAnchor.y],
  );

  const openMeasurementPicker = React.useCallback((item: DshStoreGetMenuItem, anchor?: { x: number; y: number }) => {
    const options = resolveMeasurementOptions(item);
    setPickerItem(item);
    setPickerAnchor(anchor ?? { x: 32, y: 360 });
    setSelectedMeasureQty(1);
    setSelectedMeasureOption(options[0] ?? null);
  }, []);

  const handlePreviewAddToCart = React.useCallback(() => {
    if (!previewItem) {
      return;
    }

    openMeasurementPicker(previewItem, { x: 200, y: 420 });
    closeImagePreview();
  }, [previewItem, openMeasurementPicker, closeImagePreview]);

  const handlePreviewFavoritePress = React.useCallback(() => {
    if (!previewItem) {
      return;
    }

    handleToggleFavorite(previewItem.id);
  }, [handleToggleFavorite, previewItem]);

  const closeMeasurementPicker = React.useCallback(() => {
    setPickerItem(null);
    setSelectedMeasureOption(null);
    setSelectedMeasureQty(1);
    setIsAddedToCart(false);
  }, []);

  const openInlineSearch = React.useCallback(() => {
    setHeaderSearchVisible(true);
  }, []);

  const closeInlineSearch = React.useCallback(() => {
    setHeaderSearchVisible(false);
    setHeaderSearchQuery('');
  }, []);

  const handleAddToCart = React.useCallback(() => {
    if (!pickerItem || pickerItem.isAvailable === false) {
      return;
    }

    onAddItemToCart?.(pickerItem, {
      quantity: Number.isFinite(selectedMeasureQty) && selectedMeasureQty > 0 ? selectedMeasureQty : 1,
      measurementOption: selectedMeasureOption,
      deliveryMode: selectedMode,
    });

    setAddedItemLabel(normalizeDisplayText(pickerItem!.name));
    setIsAddedToCart(true);
  }, [pickerItem, onAddItemToCart, selectedMeasureOption, selectedMeasureQty, selectedMode]);

  const handleGoToCart = React.useCallback(() => {
    setIsAddedToCart(false);
    closeMeasurementPicker();
    onOpenCart?.(selectedMode);
  }, [closeMeasurementPicker, onOpenCart, selectedMode]);

  const handleContinueShopping = React.useCallback(() => {
    setIsAddedToCart(false);
    closeMeasurementPicker();
  }, [closeMeasurementPicker]);

  const normalizedFollowersLabel = normalizeFollowersLabel(store?.followersCount ?? store?.followersLabel, storeText.get.followersSuffix);
  const normalizedPriceMatchLabel = isPriceMatchBlocked ? undefined : normalizePriceMatchLabel(store?.priceMatchLabel, storeText.get.priceMatch);
  const normalizedStoreName = normalizeDisplayText(store?.name);
  const normalizedStoreSubtitle = normalizeDisplayText(store?.subtitle);
  const normalizedEtaLabel = normalizeDisplayText(store?.etaLabel);
  const operationalState = React.useMemo(
    () => resolveStoreOperationalState(store?.statusLabel ?? '', store?.deliveryLabel, store?.serviceLabel),
    [store?.deliveryLabel, store?.serviceLabel, store?.statusLabel],
  );
  const operationalStateMeta = React.useMemo(() => getDshClientStateMeta(operationalState), [operationalState]);
  const showOperationalNotice = operationalState !== 'store_open';
  const supportActionLabel = operationalState === 'area_unserviceable' ? 'تحديث العنوان أو طلب الدعم' : 'طلب الدعم';
  const handleStoreShare = React.useCallback(async () => {
    try {
      await Share.share({
        title: normalizedStoreName,
        message: `${normalizedStoreName} • ${normalizedStoreSubtitle}`,
      });
    } catch {
      // sharing may be dismissed without completing the action
    }
  }, [normalizedStoreName, normalizedStoreSubtitle]);

  const benefitChips = Array.from(
    new Set(
      [
        (isProBlocked ? false : store?.hasBthwaniPro) ? 'بثواني برو' : null,
        ...(store?.subscriptionPackageChips ?? []),
        store?.deliveryLabel ?? null,
        store?.serviceLabel ?? null,
      ].filter(Boolean) as string[],
    ),
  )
    .map((chip) => normalizeTagLabel(chip, storeText))
    .filter((chip) => !isDeliveryBenefitLabel(chip, storeText))
    .slice(0, 3);

  const firstVisibleItem = React.useMemo(
    () => visibleItems[0] ?? clientVisibleItems[0] ?? null,
    [clientVisibleItems, visibleItems],
  );

  const firstOfferItem = React.useMemo(
    () => visibleItems.find((item) => isOfferItem(item)) ?? clientVisibleItems.find((item) => isOfferItem(item)) ?? firstVisibleItem,
    [clientVisibleItems, firstVisibleItem, isOfferItem, visibleItems],
  );

  const firstNewItem = React.useMemo(
    () => visibleItems.find((item) => isNewItem(item)) ?? clientVisibleItems.find((item) => isNewItem(item)) ?? firstVisibleItem,
    [clientVisibleItems, firstVisibleItem, isNewItem, visibleItems],
  );

  const openStoreItemPreview = React.useCallback((item?: DshStoreGetMenuItem | null) => {
    if (!item) {
      return;
    }

    openImagePreview(item);
  }, [openImagePreview]);

  const resolveFeaturePress = React.useCallback((label: string) => {
    const normalized = normalizeDisplayText(label).toLowerCase();

    if (normalized.includes('برو') || normalized.includes('أولوية') || normalized.includes('pro')) {
      if (onOpenBenefits) {
        onOpenBenefits();
        return;
      }

      if (firstVisibleItem) {
        openStoreItemPreview(firstVisibleItem);
      }

      return;
    }

    if (normalized.includes('كوبون') || normalized.includes('خصم') || normalized.includes('عرض') || normalized.includes('offer')) {
      changeCategory('offers');
      return;
    }

    if (normalized.includes('جديد') || normalized.includes('new')) {
      changeCategory('new');
      return;
    }

    if (normalized.includes('استلم') || normalized.includes('pickup')) {
      setSelectedMode('pickup');
      return;
    }

    if (normalized.includes('متجر') || normalized.includes('store delivery') || normalized.includes('partner')) {
      setSelectedMode('partner_delivery');
      return;
    }

    if (normalized.includes('توصيل') || normalized.includes('بثواني')) {
      setSelectedMode('bthwani_delivery');
      return;
    }

    if (firstVisibleItem) {
      openStoreItemPreview(firstVisibleItem);
    }
  }, [changeCategory, firstVisibleItem, onOpenBenefits, openStoreItemPreview]);

  const smartRailItems = React.useMemo<BannerCarouselItem[]>(() => {
    const featureImages = menuItems.map((item) => resolveDshStoreMenuItemImageSource(item));
    const pickFeatureImage = (index: number) => featureImages[index] ?? resolveDshStoreCoverImageSource(store);
    const storeId = store?.id ?? '';

    const storeDriven = [
      firstVisibleItem
        ? {
            id: `${storeId}-entry`,
            title: 'وصل حديثاً',
            subtitle: 'الأسعار مطابقة للمطعم',
            badge: 'معاينة',
            image: pickFeatureImage(0) ?? null,
            cta: 'افتح',
            onPress: () => openStoreItemPreview(firstVisibleItem),
          }
        : null,
      firstOfferItem
        ? {
            id: `${storeId}-offers`,
            title: 'عروض حصرية',
            subtitle: 'خصومات تصل إلى 25%',
            badge: 'عرض',
            image: pickFeatureImage(1) ?? null,
            cta: 'استعرض',
            onPress: () => changeCategory('offers'),
          }
        : null,
      firstNewItem && firstNewItem.id !== firstVisibleItem?.id && firstNewItem.id !== firstOfferItem?.id
        ? {
            id: `${storeId}-new`,
            title: 'الجديد لدينا',
            subtitle: 'استعرض أحدث المنتجات',
            badge: 'جديد',
            image: pickFeatureImage(2) ?? null,
            cta: 'صفِّ',
            onPress: () => changeCategory('new'),
          }
        : null,
      ...(benefitChips ?? []).slice(0, 3).map((chip, index) => ({
        id: `${storeId}-benefit-${index}`,
        title: normalizeTagLabel(chip, storeText),
        subtitle: 'ميزة مرتبطة بهذا المتجر',
        badge: chip.includes('برو') || chip.includes('أولوية') ? 'اشتراك' : chip.includes('كوبون') || chip.includes('خصم') || chip.includes('عرض') ? 'عرض' : 'ميزة',
        image: pickFeatureImage(index + 3) ?? null,
        cta: 'افتح',
        onPress: () => resolveFeaturePress(chip),
      })),
    ].filter(Boolean) as BannerCarouselItem[];

    const productDriven = menuItems
      .filter((item) => item.isAvailable !== false)
      .slice(0, 12)
      .map((item) => ({
        id: `product-${item.id}`,
        title: normalizeDisplayText(item.name),
        subtitle: normalizeDisplayText(item.statusLabel ?? item.subtitle),
        badge: normalizeDisplayText(item.categoryLabel),
        image: resolveDshStoreMenuItemImageSource(item) ?? null,
        cta: 'تفاصيل',
        onPress: () => openStoreItemPreview(item),
      }));

    return [...storeDriven, ...productDriven].slice(0, 15);
  }, [benefitChips, changeCategory, firstNewItem, firstOfferItem, firstVisibleItem, menuItems, openStoreItemPreview, resolveFeaturePress, store, storeText]);

  if (state !== 'ready') {
    return <View style={[styles.blockingState, { backgroundColor: appearanceChrome.screenBackground }]}>{renderNonReadyState(state, storeText, onRetry)}</View>;
  }

  if (!store) {
    return (
      <StateView
        stateId="blockingError"
        title={storeText.states.contextMissingTitle}
        description={storeText.states.contextMissingDescription}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: appearanceChrome.screenBackground }]}>
      <StatusBar
        animated
        barStyle={isDarkGlass ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {storeCoverImageSource ? (
        <View style={styles.cbContainer} pointerEvents="none">
          <Image
            source={storeCoverImageSource}
            style={[styles.cbImage, { opacity: appearanceChrome.echoImageOpacity, transform: [{ scale: 1.1 }] }]}
            blurRadius={3}
            resizeMode="cover"
          />
          <View style={[styles.cbMilkyWash, { backgroundColor: appearanceChrome.cbWashColor }]} />
        </View>
      ) : null}
      {headerSearchVisible && (
        <SearchTopBar
          value={headerSearchQuery}
          onChangeText={setHeaderSearchQuery}
          onClose={closeInlineSearch}
          variant="secondary"
          autoFocus
          placeholder={`ابحث داخل ${normalizedStoreName}`}
          hint={`بحث محلي داخل ${normalizedStoreName} فقط للوصول السريع إلى الأصناف.`}
        />
      )}

        <View style={styles.feedSection}>
          <BThwaniFilterSwipeBoundary
            items={categoryRailItems}
            selectedId={selectedCategory}
            onSelectedIdChange={changeCategory}
            style={styles.feedList}
            testID="store-category-swipe-boundary"
          >
            <Animated.FlatList
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              ref={(r) => { listRef.current = r as unknown as FlatList<DshStoreGetMenuItem> | null; }}
              data={visibleItems as DshStoreGetMenuItem[]}
              keyExtractor={(item) => (item as DshStoreGetMenuItem).id}
              ListHeaderComponent={
                <>
                  <View style={[styles.heroPremiumWrap, { backgroundColor: 'transparent' }]}>
                    <View style={[styles.heroCoverWrap, { backgroundColor: 'transparent' }]}>
                      {storeCoverImageSource ? (
                        <Animated.Image
                          source={storeCoverImageSource}
                          style={[
                            styles.heroCoverImage,
                            {
                              transform: [
                                {
                                  scale: scrollY.interpolate({
                                    inputRange: [-200, 0, 480],
                                    outputRange: [1.3, 1, 1.1],
                                    extrapolate: 'clamp',
                                  }),
                                },
                                {
                                  translateY: scrollY.interpolate({
                                    inputRange: [-200, 0, 480],
                                    outputRange: [-60, 0, 80],
                                    extrapolate: 'clamp',
                                  }),
                                },
                              ],
                            }
                          ]}
                        />
                      ) : (
                        <View style={styles.heroCoverPlaceholder} />
                      )}
                      <GlassHeroOverlay strength={isDarkGlass ? 'strong' : 'default'} style={[styles.heroCoverOverlay, { backgroundColor: appearanceChrome.heroOverlay }]} />

                      <View style={styles.heroCoverFade} pointerEvents="none">
                        {Array.from({ length: 120 }, (_, i) => {
                          const t = i / 119;
                          const alpha = Math.pow(t, 1.5) * appearanceChrome.heroFadeMaxAlpha;
                          const bg = `rgba(${appearanceChrome.heroFadeRGB}, ${alpha.toFixed(3)})`;
                          return <View key={i} style={[styles.heroCoverFadeBand, { top: `${(t * 100).toFixed(2)}%` as DimensionValue, backgroundColor: bg }]} />;
                        })}
                      </View>

                      <View style={[styles.heroTopActions, isRTL && styles.rowReverse]} pointerEvents="box-none">
                        <View style={styles.heroTopActionsLeft} pointerEvents="box-none">
                          <TouchableOpacity
                            style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackgroundGlass, borderColor: appearanceChrome.actionBorderGlass }]}
                            activeOpacity={0.7}
                            onPress={openInlineSearch}
                            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
                          >
                            <Icon name="search-outline" size={22} color={isDarkGlass ? stylesTokens.white : appearanceChrome.primaryText} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackgroundGlass, borderColor: appearanceChrome.actionBorderGlass }]}
                            activeOpacity={0.7}
                            onPress={() => {
                              if (onOpenCart) {
                                onOpenCart(selectedMode);
                                return;
                              }
                              onOpenItems?.();
                            }}
                            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
                          >
                            <Icon name="cart-outline" size={22} color={isDarkGlass ? stylesTokens.white : appearanceChrome.primaryText} />
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackgroundGlass, borderColor: appearanceChrome.actionBorderGlass }]}
                          activeOpacity={0.7}
                          onPress={handleStoreShare}
                          hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
                        >
                          <Icon name="share-outline" size={22} color={isDarkGlass ? stylesTokens.white : appearanceChrome.primaryText} />
                        </TouchableOpacity>
                      </View>

                      {/* Sticky Header Overlay */}
                      <Animated.View
                        pointerEvents="box-none"
                        style={[
                          styles.stickyHeaderContent,
                          {
                            opacity: scrollY.interpolate({
                              inputRange: [200, 300, Math.max(301, stickyThreshold - 80), Math.max(302, stickyThreshold - 20)],
                              outputRange: [0, 1, 1, 0],
                              extrapolate: 'clamp',
                            }),
                            backgroundColor: appearanceChrome.modalSurface,
                            borderColor: appearanceChrome.modalBorder,
                          }
                        ]}
                      >
                        <Text style={[styles.stickyHeaderTitle, { color: appearanceChrome.primaryText }]}>
                          {normalizedStoreName}
                        </Text>
                      </Animated.View>


                    </View>
                  </View>

                  {showOperationalNotice ? (
                    <View
                      style={[
                        styles.storeStateNotice,
                        operationalState === 'area_unserviceable' ? styles.storeStateNoticeDanger : styles.storeStateNoticeWarning,
                        { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.cardBorder },
                        { marginHorizontal: 16, marginTop: 12, marginBottom: 8 }
                      ]}
                    >
                      <View style={styles.storeStateNoticeIconWrap}>
                        <Icon
                          name={operationalState === 'area_unserviceable' ? 'alert-circle' : 'warning'}
                          size={24}
                          color={operationalState === 'area_unserviceable' ? stylesTokens.red : stylesTokens.warning}
                        />
                      </View>
                      <View style={styles.storeStateNoticeCopy}>
                        <Text style={[styles.storeStateNoticeTitle, { color: appearanceChrome.primaryText }, isRTL && styles.textAlignRight]}>{operationalStateMeta.title}</Text>
                        <Text style={[styles.storeStateNoticeDescription, { color: appearanceChrome.secondaryText }, isRTL && styles.textAlignRight]}>
                          {operationalStateMeta.description}
                        </Text>
                      </View>
                      {onSupport && (
                        <TouchableOpacity style={styles.storeStateNoticeAction} onPress={onSupport}>
                           <Text style={[styles.storeStateNoticeActionText, { color: ORANGE }]}>{supportActionLabel}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : null}


                  <View style={styles.contentBlock}>
                    {/* Luxury Store Card */}
                    <View style={styles.heroLuxuryCard}>
                      {/* ROW 1: Identity Cluster */}
                      <View style={styles.heroLuxuryIdentityRow}>
                        <View style={styles.heroLuxuryInfo}>
                          <Text style={[styles.heroNameText, { color: appearanceChrome.primaryText }]} numberOfLines={1}>{normalizedStoreName}</Text>
                          <View style={styles.heroLocationRow}>
                            <Icon name="location-sharp" size={14} color={ORANGE} />
                            <Text style={[styles.heroLocationText, { color: appearanceChrome.secondaryText }]} numberOfLines={1}>{store.locationLabel || 'حي العليا · الرياض'}</Text>
                          </View>
                          <View style={[styles.heroStatusBadge, { backgroundColor: operationalState === 'store_open' ? hexToRgba(stylesTokens.green, 0.12) : hexToRgba(stylesTokens.red, 0.12), borderColor: operationalState === 'store_open' ? hexToRgba(stylesTokens.green, 0.25) : hexToRgba(stylesTokens.red, 0.25) }]}>
                            <View style={[styles.heroStatusDot, { backgroundColor: operationalState === 'store_open' ? stylesTokens.green : stylesTokens.red }]} />
                            <Text style={[styles.heroStatusText, { color: operationalState === 'store_open' ? stylesTokens.green : stylesTokens.red }]}>
                              {operationalState === 'store_open' ? 'مفتوح الآن' : 'مغلق الآن'}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.heroLogoWrap, { backgroundColor: stylesTokens.white, borderColor: isDarkGlass ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                          <Image
                            source={storeLogoImageSource || resolveDshImageSource('dsh.brand.logo.v1')}
                            style={styles.heroLogoImage}
                          />
                        </View>
                      </View>

                      {/* ROW 2: Metrics Chips */}
                      <View style={[styles.heroLuxuryMetricsRow, { position: 'relative' }]}>
                        {/* Reverse Feather Gradient Blend (Multi-Band) */}
                        <View style={styles.metricsRowReverseFeather} pointerEvents="none">
                          {Array.from({ length: 40 }, (_, i) => {
                            const t = i / 39;
                            const alpha = Math.pow(t, 1.5) * appearanceChrome.heroFadeMaxAlpha;
                            const bg = `rgba(${appearanceChrome.heroFadeRGB}, ${alpha.toFixed(3)})`;
                            return <View key={i} style={[styles.metricsRowReverseFeatherBand, { bottom: `${(t * 100).toFixed(2)}%` as DimensionValue, backgroundColor: bg }]} />;
                          })}
                        </View>

                        {store.hasBthwaniPro && (
                          <View style={[styles.heroFeatureChip, styles.heroBadgePro]}>
                            <Text style={styles.heroBadgeText}>برو</Text>
                          </View>
                        )}
                        <View style={[styles.heroFeatureChip, { backgroundColor: isDarkGlass ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' }]}>
                          <Icon name="navigate-outline" size={12} color={appearanceChrome.secondaryText} />
                          <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]}>{store.distanceLabel || '2.1 كم'}</Text>
                        </View>
                        <View style={[styles.heroFeatureChip, { backgroundColor: isDarkGlass ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' }]}>
                          <Icon name="time-outline" size={12} color={appearanceChrome.secondaryText} />
                          <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]}>{store.deliveryTimeLabel || normalizedEtaLabel}</Text>
                        </View>
                        <View style={[styles.heroFeatureChip, { backgroundColor: isDarkGlass ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' }]}>
                          <Icon name="star" size={12} color={GOLD} />
                          <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]}>{store.rating?.toFixed(1) || '5.0'}</Text>
                        </View>
                      </View>

                      {/* ROW 3: Delivery Options */}
                      <View style={[styles.heroLuxuryDeliveryRow, { backgroundColor: isDarkGlass ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)' }]}>
                        {deliveryModes.map((mode) => {
                          const active = selectedMode === mode.id;
                          return (
                            <TouchableOpacity key={mode.id} style={[styles.heroLuxuryDeliveryChip, active && { backgroundColor: isDarkGlass ? 'rgba(255,255,255,0.15)' : stylesTokens.white }]} onPress={() => setSelectedMode(mode.id)} activeOpacity={0.8}>
                              <View style={styles.heroLuxuryDeliveryContent}>
                                <Text style={[styles.heroLuxuryDeliveryTitle, { color: active ? ORANGE : appearanceChrome.secondaryText }]} numberOfLines={1}>{mode.label}</Text>
                                <Icon name={mode.icon} size={14} color={active ? ORANGE : appearanceChrome.secondaryText} />
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {smartRailItems.length ? (
                      <BannerCarousel
                        banners={smartRailItems}
                        width={viewportWidth}
                        height={142}
                        variant="secondary"
                        fullBleed
                        autoPlayInterval={4000}
                        autoPlayDirection="backward"
                        itemWidth={Math.round(viewportWidth * 0.62)}
                        itemGap={12}
                        style={styles.smartRailSection}
                      />
                    ) : null}

                    <View
                      onLayout={(e) => setStickyThreshold(e.nativeEvent.layout.y)}
                      style={[styles.sectionHeader, { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }]}
                    >
                      <Text style={[styles.sectionTitle, { color: appearanceChrome.primaryText }]}>قائمة الأصناف</Text>
                    </View>

                    <View style={styles.sectionBlock}>
                      <BThwaniFilterRail
                        items={categoryRailItems}
                        selectedId={selectedCategory}
                        onSelectedIdChange={changeCategory}
                        variant={isDarkGlass ? 'glass' : 'default'}
                        testID="store-category-rail"
                      />
                    </View>
                  </View>
                </>
              }
              renderItem={({ item, index }) => {
                const inputRange = [(index - 1) * SNAP_INTERVAL, index * SNAP_INTERVAL, (index + 1) * SNAP_INTERVAL];
                const scale = scrollY.interpolate({ inputRange, outputRange: [0.986, 1, 0.986], extrapolate: 'clamp' });
                const translateY = scrollY.interpolate({ inputRange, outputRange: [8, 0, 8], extrapolate: 'clamp' });
                const opacity = scrollY.interpolate({ inputRange, outputRange: [0.9, 1, 0.9], extrapolate: 'clamp' });

                return (
                  <Animated.View style={[{ transform: [{ scale }, { translateY }], opacity, marginBottom: CARD_GAP, marginHorizontal: 12 }]}
                    pointerEvents="box-none"
                  >
                    {
                      (() => {
                        return (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            partnerImageSource={storeLogoImageSource}
                            onAddPress={(anchor) => openMeasurementPicker(item, anchor ?? { x: 32, y: 360 })}
                            onImagePress={openImagePreview}
                            onFavoritePress={() => handleToggleFavorite(item.id)}
                            isFavorited={favoriteIds.has(item.id)}
                          />
                        );
                      })()
                    }
                  </Animated.View>
                );
              }}
              showsVerticalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              contentContainerStyle={{ paddingBottom: 60 }}
              ListEmptyComponent={
                <View style={styles.emptyFeed}>
                  <Text style={styles.emptyFeedEmoji}>{headerSearchQuery.trim() ? '🔎' : '🍽️'}</Text>
                  <Text style={styles.emptyFeedTitle}>
                    {headerSearchQuery.trim() ? 'لا توجد نتائج داخل هذا المتجر' : storeText.get.emptyCategoryTitle}
                  </Text>
                  <Text style={styles.emptyFeedText}>
                    {headerSearchQuery.trim()
                      ? `جرّب البحث باسم منتج أو قسم آخر داخل ${normalizedStoreName}.`
                      : storeText.get.emptyCategoryDescription}
                  </Text>
                </View>
              }
            />
          </BThwaniFilterSwipeBoundary>

          {/* Premium Glass Sticky Categories Overlay - Docked at 0 */}
          <Animated.View
            style={[
              styles.stickyCategoriesOverlay,
              {
                backgroundColor: isDarkGlass ? 'rgba(22, 22, 28, 0.94)' : 'rgba(255, 255, 255, 0.94)',
                borderBottomColor: appearanceChrome.modalBorder,
                transform: [{
                  translateY: scrollY.interpolate({
                    inputRange: [0, Math.max(1, stickyThreshold)],
                    outputRange: [stickyThreshold, 0],
                    extrapolate: 'clamp',
                  })
                }],
                opacity: scrollY.interpolate({
                  inputRange: [stickyThreshold - 120, stickyThreshold - 20],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                paddingTop: Platform.OS === 'ios' ? 48 : 28, // Respecting status bar while docked at 0
              }
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.stickyCategoriesContent}>
              <View style={[styles.sectionHeader, { paddingHorizontal: 16, marginBottom: 8 }]}>
                <Text style={[styles.sectionTitle, { color: appearanceChrome.primaryText, fontSize: 16 }]}>قائمة الأصناف</Text>
              </View>
              <View style={styles.sectionBlock}>
                <BThwaniFilterRail
                  items={categoryRailItems}
                  selectedId={selectedCategory}
                  onSelectedIdChange={changeCategory}
                  variant={isDarkGlass ? 'glass' : 'default'}
                  sticky
                  testID="store-category-rail-sticky"
                />
              </View>
            </View>
          </Animated.View>
        </View>

      {/* Removed detached Cart Decision Modal and Toast */}
      <Modal visible={Boolean(previewItem)} transparent animationType="fade" onRequestClose={closeImagePreview}>
        <View style={[styles.previewOverlay, { backgroundColor: appearanceChrome.overlay }]}>
          <Pressable style={styles.previewBackdrop} onPress={closeImagePreview} />
          <Animated.View
            style={[
              styles.previewWrap,
              {
                opacity: previewAnim,
                transform: [{ scale: previewAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }]
              }
            ]}
            {...previewPanResponder.panHandlers}
          >
            <Animated.FlatList
              ref={previewListRef}
              data={previewItems}
              renderItem={renderPreviewItem}
              keyExtractor={(item) => `preview-${item.id}`}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              snapToInterval={PREVIEW_SNAP_INTERVAL}
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: previewScrollY } } }],
                { useNativeDriver: true }
              )}
              contentContainerStyle={{
                paddingVertical: (viewportHeight - PREVIEW_ITEM_HEIGHT) / 2 - PREVIEW_ITEM_GAP / 2,
              }}
              initialScrollIndex={previewActiveIndex !== -1 ? previewActiveIndex : 0}
              getItemLayout={(_, index) => ({
                length: PREVIEW_SNAP_INTERVAL,
                offset: PREVIEW_SNAP_INTERVAL * index,
                index,
              })}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.y / PREVIEW_SNAP_INTERVAL);
                if (index >= 0 && index < previewItems.length) {
                  setPreviewActiveIndex(index);
                  setPreviewItem(previewItems[index]);
                }
              }}
            />
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={Boolean(pickerItem)} transparent animationType="fade" onRequestClose={closeMeasurementPicker}>
        <Pressable style={[styles.measureOverlay, { backgroundColor: appearanceChrome.overlaySoft }]} onPress={closeMeasurementPicker}>
          <View style={[styles.measurePopoverWrap, { top: measurePopoverTop }]} pointerEvents="box-none">
            <View style={styles.measurePopoverDock}>
              <View style={[styles.measureOriginBubble, { backgroundColor: appearanceChrome.activeActionBackground }]}>
                <Icon name="cart-outline" size={18} color={isDarkGlass ? theme.brandContrast : stylesTokens.white} />
                <View style={styles.measureOriginPlusBadge}>
                  <Icon name="add" size={10} color={appearanceChrome.accent} />
                </View>
              </View>

              <Pressable style={[styles.measurePopoverCard, { backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder }]} onPress={(event) => event.stopPropagation()}>
                {pickerItem ? (
                  <>
                    <View style={styles.measurePopoverHeader}>
                      <Text style={[styles.measureSheetTitle, { color: appearanceChrome.primaryText }]}>{normalizeDisplayText(pickerItem!.name)}</Text>
                    </View>

                    {isAddedToCart ? (
                      <CartConfirmationBlock
                        title="تمت إضافة المنتج للسلة"
                        subtitle={addedItemLabel ? `${addedItemLabel}${selectedMeasureOption ? ` (${selectedMeasureOption})` : ''}` : undefined}
                        onGoToCart={handleGoToCart}
                        onContinueShopping={handleContinueShopping}
                        isDarkGlass={isDarkGlass}
                      />
                    ) : (
                      <>
                        <View style={styles.measureOptionsGrid}>
                          {activeMeasurementOptions.map((option) => {
                            const selected = selectedMeasureOption === option;
                            const optionPrice = formatCurrencyValue(resolveMeasurementUnitPrice(pickerItem!, option));
                            return (
                              <TouchableOpacity
                                key={option}
                                style={[
                                  styles.measureOptionChip,
                                  { backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder },
                                  selected && styles.measureOptionChipActive,
                                  selected ? { backgroundColor: appearanceChrome.activeActionBackground, borderColor: appearanceChrome.activeActionBorder } : null,
                                ]}
                                activeOpacity={0.88}
                                onPress={() => setSelectedMeasureOption(option)}
                              >
                                <Text style={[styles.measureOptionText, { color: selected ? (isDarkGlass ? theme.brandContrast : stylesTokens.white) : appearanceChrome.primaryText }, selected && styles.measureOptionTextActive]}>{option}</Text>
                                <Text style={[styles.measureOptionPriceText, { color: selected ? (isDarkGlass ? tokens.glassMutedText : stylesTokens.orangeSoft) : appearanceChrome.secondaryText }, selected && styles.measureOptionPriceTextActive]}>{optionPrice}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        <View style={styles.measureQtyRow}>
                          <TouchableOpacity
                            style={[styles.measureQtyGhostButton, { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.modalBorder }]}
                            activeOpacity={0.85}
                            onPress={() => setSelectedMeasureQty((current) => Math.max(1, current - 1))}
                          >
                            <Icon name="remove" size={18} color={appearanceChrome.secondaryText} />
                          </TouchableOpacity>

                          <View style={[styles.measureQtyValuePill, { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.modalBorder }]}>
                            <Text style={[styles.measureQtyValueText, { color: appearanceChrome.primaryText }]}>{selectedMeasureQty}</Text>
                          </View>

                          <TouchableOpacity
                            style={[styles.measureQtyPrimaryButton, { backgroundColor: appearanceChrome.activeActionBackground, borderColor: appearanceChrome.activeActionBorder }]}
                            activeOpacity={0.9}
                            onPress={() => setSelectedMeasureQty((current) => current + 1)}
                          >
                            <Icon name="add" size={18} color={isDarkGlass ? theme.brandContrast : stylesTokens.white} />
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.measureFooterBar, { borderColor: appearanceChrome.modalBorder }]}>
                          <View style={[styles.measurePriceValueBox, { backgroundColor: appearanceChrome.modalSurface }]}>
                            <Text style={[styles.measurePriceValueText, { color: appearanceChrome.primaryText }]}>{formatCurrencyValue(selectedMeasureTotalPrice || selectedMeasureUnitPrice)}</Text>
                          </View>

                          <TouchableOpacity
                            style={[styles.measureConfirmButton, { backgroundColor: appearanceChrome.activeActionBackground }]}
                            activeOpacity={0.9}
                            onPress={handleAddToCart}
                          >
                            <Text style={[styles.measureConfirmText, { color: isDarkGlass ? theme.brandContrast : stylesTokens.white }]}>أضف للسلة</Text>
                            <Icon name="cart-outline" size={16} color={isDarkGlass ? theme.brandContrast : stylesTokens.white} />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </>
                ) : null}
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const stylesTokens = {
  orange: colorPalette.brand,
  orangeSoft: colorPalette.brandSurface,
  orangeBorder: colorPalette.brandStrong,
  brandSoft: colorPalette.brandSoft,
  white: colorPalette.white,
  dark: colorPalette.ink,
  muted: colorPalette.inkMuted,
  light: colorPalette.surfaceAlt,
  line: colorPalette.line,
  lineStrong: colorPalette.lineStrong,
  chip: colorPalette.surfaceInset,
  chipText: colorPalette.inkMuted,
  green: colorPalette.success,
  blue: colorPalette.infoStrong,
  infoSurface: colorPalette.infoSoft,
  infoBorder: colorPalette.info,
  infoText: colorPalette.infoStrong,
  warning: colorPalette.warning,
  warningSurface: colorPalette.warningSoft,
  warningText: colorPalette.warningStrong,
  red: colorPalette.danger,
  black: colorPalette.black,
  overlaySoft: hexToRgba(colorPalette.brandStrong, 0.06),
  overlayDense: hexToRgba(colorPalette.brandStrong, 0.42),
  overlay: colorPalette.overlay,
  whiteOverlay: hexToRgba(colorPalette.white, 0.96),
};

const DARK_BLUE = stylesTokens.blue;
const ORANGE = stylesTokens.orange;
const GOLD = stylesTokens.warning;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colorPalette.pageBackground,
  },
  blockingState: {
    flex: 1,
    backgroundColor: colorPalette.pageBackground,
    justifyContent: 'center',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textAlignRight: {
    textAlign: 'right',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: colorPalette.brandSurface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.brandStrong,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 5,
      },
    }),
  },

  // PREMIUM HERO 2026
  heroPremiumWrap: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  heroCoverWrap: {
    height: 480,
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  heroCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroCoverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: stylesTokens.dark,
  },
  heroCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTopActions: {
    position: 'absolute',
    top: 32,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  heroTopActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroActionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  stickyHeaderContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 100 : 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  stickyHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Outfit-Bold',
  },
  heroLuxuryCard: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
    gap: 16,
  },
  heroLuxuryIdentityRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  heroLuxuryInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  heroLuxuryMetricsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricsRowReverseFeather: {
    position: 'absolute',
    top: -16,
    bottom: -32,
    left: -32,
    right: -32,
    zIndex: -1,
  },
  metricsRowReverseFeatherBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  heroLuxuryDeliveryRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 4,
    borderRadius: 16,
    gap: 4,
  },
  heroLuxuryDeliveryChip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLuxuryDeliveryContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  heroLuxuryDeliveryTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Outfit-Bold',
  },
  heroLogoWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: stylesTokens.white,
    borderWidth: 2,
    borderColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroLogoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heroNameText: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Outfit-Bold',
    textAlign: 'right',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  heroLocationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  heroLocationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Outfit-Medium',
    fontWeight: '700',
  },
  heroStatusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
    marginTop: 4,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroStatusText: {
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Outfit-Bold',
  },
  heroFeatureChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    minHeight: 32,
  },
  heroFeatureValue: {
    fontSize: 12,
    fontWeight: '800',
    color: stylesTokens.white,
    fontFamily: 'Outfit-Bold',
  },
  heroBadgePro: {
    backgroundColor: DARK_BLUE,
    borderColor: 'transparent',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: stylesTokens.white,
    fontFamily: 'Outfit-Bold',
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Outfit-Bold',
  },
  storeStateNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 14,
    marginTop: 4,
  },
  storeStateNoticeWarning: {
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    borderColor: 'rgba(255, 149, 0, 0.25)',
  },
  storeStateNoticeDanger: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderColor: 'rgba(255, 59, 48, 0.25)',
  },
  storeStateNoticeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeStateNoticeCopy: {
    flex: 1,
    gap: 2,
    alignItems: 'flex-end',
  },
  storeStateNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Outfit-Bold',
  },
  storeStateNoticeDescription: {
    color: stylesTokens.muted,
    fontSize: 11.5,
    lineHeight: 17,
    fontFamily: 'Outfit-Regular',
  },
  storeStateNoticeAction: {
    paddingHorizontal: 8,
    alignSelf: 'stretch',
  },
  storeStateNoticeActionText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
  },
  contentBlock: {
    width: '100%',
    overflow: 'hidden',
    marginTop: -140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  smartRailSection: {
    marginTop: 12,
    marginBottom: -6,
  },
  modePill: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: stylesTokens.white,
    borderColor: stylesTokens.orange,
  },
  modePillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modePillInnerActive: {
    flexDirection: 'row',
  },
  modePillLabel: {
    color: stylesTokens.dark,
    fontSize: 13,
    fontWeight: '700',
  },
  modePillLabelActive: {
    color: stylesTokens.orange,
  },

  sectionBlock: {
    marginTop: 0,
    paddingHorizontal: 12,
    width: '100%',
  },
  feedSection: {
    flex: 1,
    minHeight: 0,
  },
  feedList: {
    flex: 1,
  },
  stickyCategoriesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 110,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    elevation: 8,
    shadowColor: stylesTokens.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  stickyCategoriesContent: {
    width: '100%',
  },

  menuActionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuActionPlusBadge: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureOverlay: {
    flex: 1,
    backgroundColor: stylesTokens.overlaySoft,
  },
  previewOverlay: {
    flex: 1,
    position: 'relative',
    backgroundColor: stylesTokens.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  previewWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  previewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: stylesTokens.white,
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  previewImageWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: stylesTokens.light,
  },
  previewSwipeLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  previewImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewPartnerBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: stylesTokens.orange,
    borderWidth: 2,
    borderColor: stylesTokens.white,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 5,
      },
    }),
  },
  previewPartnerBadgeImageContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: stylesTokens.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPartnerBadgeImage: {
    width: '100%',
    height: '100%',
  },
  previewEmoji: {
    position: 'absolute',
    top: 36,
    right: 36,
    fontSize: 72,
    zIndex: 2,
    opacity: 0.18,
  },
  previewDetailsBox: {
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  previewDetailsContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  previewDetailsContentRTL: {
    alignItems: 'flex-end',
  },
  previewDetailsTitle: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
  },
  previewStoreName: {
    color: stylesTokens.orange,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 2,
  },
  previewDetailsSubtitle: {
    color: stylesTokens.muted,
    fontSize: 11,
    marginBottom: 0,
  },
  previewDetailsDiscount: {
    color: stylesTokens.red,
    fontSize: 12,
    fontWeight: '900',
  },
  previewDetailsPrice: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
  },
  previewFavoriteCircle: {
    width: 44,
    height: 44,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: stylesTokens.orange,
  },
  previewDetailsFavoriteButton: {
    zIndex: 12,
  },
  previewActionButton: {
    width: 44,
    height: 44,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  previewActionPlusBadge: {
    position: 'absolute',
    top: -3,
    left: -5,
    backgroundColor: stylesTokens.white,
    borderRadius: 5,
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewDetailsMetaRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  measurePopoverWrap: {
    position: 'absolute',
    left: 10,
    right: 10,
  },
  measurePopoverDock: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  measureOriginBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: stylesTokens.orangeSoft,
  },
  measureOriginPlusBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
  },
  measurePopoverCard: {
    flex: 1,
    maxWidth: 280,
    backgroundColor: stylesTokens.white,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 5,
      },
    }),
  },
  measurePopoverHeader: {
    alignItems: 'flex-end',
    gap: 1,
  },
  measureSheetTitle: {
    color: stylesTokens.dark,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
  },
  measureOptionsGrid: {
    flexDirection: 'row-reverse',
    gap: 4,
    justifyContent: 'space-between',
  },
  measureOptionChip: {
    flex: 1,
    minHeight: 48,
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  measureOptionChipActive: {
    backgroundColor: stylesTokens.orange,
    borderColor: stylesTokens.orangeBorder,
  },
  measureOptionText: {
    color: stylesTokens.dark,
    fontSize: 12,
    fontWeight: '800',
  },
  measureOptionTextActive: {
    color: stylesTokens.white,
  },
  measureOptionPriceText: {
    color: stylesTokens.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  measureOptionPriceTextActive: {
    color: stylesTokens.orangeSoft,
  },
  measureQtyRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  measureQtyGhostButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: stylesTokens.light,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureQtyPrimaryButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: stylesTokens.orange,
  },
  measureQtyValuePill: {
    minWidth: 56,
    height: 38,
    borderRadius: 16,
    backgroundColor: stylesTokens.brandSoft,
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  measureQtyValueText: {
    color: stylesTokens.dark,
    fontSize: 15,
    fontWeight: '900',
  },
  measureFooterBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    marginTop: 4,
  },
  measurePriceValueBox: {
    minWidth: 72,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  measurePriceValueText: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
  },
  measureConfirmButton: {
    flex: 1,
    backgroundColor: stylesTokens.orange,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  measureConfirmText: {
    color: stylesTokens.white,
    fontSize: 13.5,
    fontWeight: '900',
  },
  emptyFeed: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 18,
    backgroundColor: stylesTokens.light,
    marginHorizontal: 12,
  },
  emptyFeedEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyFeedTitle: {
    color: stylesTokens.dark,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyFeedText: {
    marginTop: 4,
    color: stylesTokens.muted,
    fontSize: 12,
    textAlign: 'center',
  },

  cbContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cbImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cbMilkyWash: {
    ...StyleSheet.absoluteFillObject,
  },
  heroCoverFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    overflow: 'hidden',
  },
  heroCoverFadeBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DshStoreGetScreen;
