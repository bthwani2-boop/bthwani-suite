import React from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  PanResponder,
  ScrollView,
  FlatList,
  StatusBar,
  Vibration,
  Dimensions,
  Platform,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
  type ImageSourcePropType,
} from 'react-native';
// Removed Ionicons import
import {
  BannerCarousel,
  BThwaniAppearanceProvider,
  Button,
  Chip,
  GlassHeroOverlay,
  Icon,
  ProductCard,
  SearchTopBar,
  StateView,
  Text,
  Toast,
  colorPalette,
  useBThwaniAppearance,
  useDirection,
  useTheme,
  useUiText,
  type BannerCarouselItem,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';
import { dshCategoryMeasurementPolicies } from '../../shared/catalog';
import { formatDshStoreFollowersLabel } from '../shared/store-profile';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import { getDshClientStateMeta, type DshClientState } from '../data/client-state.preview-data';
import { type DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import { mapMenuItemToProductCard } from '../shared/map-menu-item-to-product-card';
import { canRenderInClientSurface } from '../../shared/workflow';

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
    deliveryModes?: Array<{ id: 'delivery' | 'pickup'; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
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
  onOpenCart?: () => void;
  onAddItemToCart?: (
    item: DshStoreGetMenuItem,
    payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string }
  ) => void;
  onOpenBenefits?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

type DeliveryMode = 'delivery' | 'pickup' | 'store_delivery';

function getDeliveryModes(storeText: ReturnType<typeof useUiText>['storeScreen']): Array<{
  id: DeliveryMode;
  label: string;
  icon: string;
}> {
  return [
    { id: 'store_delivery', label: storeText.get.storeDelivery, icon: 'storefront-outline' },
    { id: 'pickup', label: storeText.get.pickup, icon: 'bag-handle-outline' },
    { id: 'delivery', label: storeText.get.platformDelivery, icon: 'bicycle-outline' },
  ];
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
  all: '📋',
  popular: '🔥',
  favorites: '❤️',
  new: '🆕',
  offers: '💸',
  fresh: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  meals: '🍲',
  healthy: '🥗',
  sweets: '🍰',
};

function getStatusLabel(statusLabel: string, storeText: ReturnType<typeof useUiText>['storeScreen']) {
  const normalized = statusLabel.trim().toLowerCase();
  if (normalized.includes('open') || normalized.includes('مفتوح')) return 'مفتوح';
  if (normalized.includes('busy') || normalized.includes('مشغول')) return 'مشغول';
  if (normalized.includes('closed') || normalized.includes('مغلق')) return 'مغلق';
  if (normalized.includes('popular')) return 'الأكثر طلبًا';
  if (normalized.includes('best seller')) return 'الأكثر مبيعًا';
  if (normalized.includes('chef')) return 'اختيار الشيف';
  return normalizeDisplayText(statusLabel) || storeText.get.platformDelivery;
}

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

function resolveMeasurementLabel(item: DshStoreGetMenuItem) {
  return dshCategoryMeasurementPolicies[item.categoryId]?.label ?? 'اختر الكمية المناسبة';
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

function IconActionButton({ icon, onPress }: { icon: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name={icon as any} size={20} color={stylesTokens.dark} />
    </TouchableOpacity>
  );
}

function ModePill({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.modePill, active && styles.modePillActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.modePillInner, active && styles.modePillInnerActive]}>
        <Text style={[styles.modePillLabel, active && styles.modePillLabelActive]} numberOfLines={1}>
          {label}
        </Text>
        <Icon
          name={icon as any}
          size={18}
          color={active ? stylesTokens.orange : stylesTokens.muted}
        />
      </View>
    </TouchableOpacity>
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

  return (
    <BThwaniAppearanceProvider mode={appearanceMode}>
      <DshStoreGetScreenContent {...props} appearanceMode={appearanceMode} />
    </BThwaniAppearanceProvider>
  );
}

function DshStoreGetScreenContent({
  appearanceMode,
  state = 'ready',
  store,
  menuItems = [],
  onOpenItems,
  onOpenSearch,
  onOpenCart,
  onAddItemToCart,
  onOpenBenefits,
  onBack,
  onRetry,
  onSupport,
}: DshStoreGetScreenContentProps) {
  const sm = store?.commercialSourceMap;
  const isProBlocked = sm?.['hasBthwaniPro']?.conflictStatus === 'blocker';
  const isPriceMatchBlocked = sm?.['priceMatchLabel']?.conflictStatus === 'blocker';
  const isCouponBlocked = sm?.['hasCouponAvailable']?.conflictStatus === 'blocker';
  const isOfferBlocked = sm?.['offerLabel']?.conflictStatus === 'blocker';

  const { tokens } = useBThwaniAppearance();
  const { direction } = useDirection();
  const { mode: themeMode, theme } = useTheme();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const isDarkGlass = appearanceMode === 'darkGlass' || themeMode === 'dark';
  const isRTL = direction === 'rtl';
  const viewportWidth = Dimensions.get('window').width;
  const [selectedMode, setSelectedMode] = React.useState<DeliveryMode>('store_delivery');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [pickerItem, setPickerItem] = React.useState<DshStoreGetMenuItem | null>(null);
  const [selectedMeasureOption, setSelectedMeasureOption] = React.useState<string | null>(null);
  const [selectedMeasureQty, setSelectedMeasureQty] = React.useState(1);
  const [pickerAnchor, setPickerAnchor] = React.useState({ x: 32, y: 360 });
  const [headerSearchVisible, setHeaderSearchVisible] = React.useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = React.useState('');
  const [cartToastVisible, setCartToastVisible] = React.useState(false);
  const [cartDecisionVisible, setCartDecisionVisible] = React.useState(false);
  const [addedItemLabel, setAddedItemLabel] = React.useState('');
  const [previewItem, setPreviewItem] = React.useState<DshStoreGetMenuItem | null>(null);
  const [isFollowingStore, setIsFollowingStore] = React.useState(false);

  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());

  const appearanceChrome = React.useMemo(() => ({
    accent: tokens.accent,
    actionBackground: isDarkGlass ? tokens.glassSurfaceStrong : tokens.glassSurface,
    actionBorder: tokens.glassBorder,
    actionIcon: tokens.glassText,
    activeActionBackground: tokens.actionSelectedBackground,
    activeActionBorder: tokens.accent,
    activeActionIcon: isDarkGlass ? theme.brandContrast : tokens.accent,
    cardBackground: isDarkGlass ? tokens.surfaceRaised : theme.surface,
    cardBorder: isDarkGlass ? tokens.glassBorder : theme.line,
    labelText: isDarkGlass ? tokens.glassMutedText : theme.textMuted,
    modalBorder: isDarkGlass ? tokens.glassBorder : theme.line,
    modalSurface: isDarkGlass ? tokens.surfaceRaised : theme.surface,
    overlay: isDarkGlass ? tokens.heroOverlayStrong : stylesTokens.overlay,
    overlaySoft: isDarkGlass ? tokens.heroOverlay : stylesTokens.overlaySoft,
    primaryText: isDarkGlass ? tokens.glassText : theme.text,
    promoBackground: isDarkGlass ? tokens.promoCardBackground : tokens.promoCardBackground,
    screenBackground: tokens.appBackground,
    secondaryText: isDarkGlass ? tokens.textSecondary : theme.textMuted,
    selectionBackground: isDarkGlass ? tokens.actionSelectedBackground : tokens.chipSelectedBackground,
    selectionText: isDarkGlass ? theme.brandContrast : tokens.accent,
    statusBadgeBackground: isDarkGlass ? tokens.glassSurfaceStrong : theme.success,
    statusBadgeBorder: isDarkGlass ? tokens.glassBorder : theme.success,
    statusDot: theme.success,
    strongSurface: isDarkGlass ? tokens.glassSurfaceStrong : tokens.surface,
    subtleSurface: isDarkGlass ? tokens.glassSurface : theme.surfaceRaised,
    heroOverlay: isDarkGlass ? tokens.heroOverlayStrong : tokens.heroOverlayStrong,
  }), [isDarkGlass, theme, tokens]);

  const handleToggleFavorite = React.useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openImagePreview = React.useCallback((item: DshStoreGetMenuItem) => setPreviewItem(item), []);
  const closeImagePreview = React.useCallback(() => setPreviewItem(null), []);

  const deliveryModes = React.useMemo(() => getDeliveryModes(storeText), [storeText]);

  const storeCoverImageSource = React.useMemo(() => {
    if (!store) return undefined;
    // Force burger cover for Al Olaya to match design parity 100%
    if (store.name?.includes('العليا') || store.id === 'store-1001') {
      return resolveDshImageSource('dsh.store.hittin.cover.v1');
    }
    return resolveDshStoreCoverImageSource(store);
  }, [store]);

  const storeLogoImageSource = React.useMemo(() => {
    if (!store) return undefined;
    // Force circular burger logo for Al Olaya to match design parity 100%
    if (store.name?.includes('العليا') || store.id === 'store-1001') {
      return resolveDshImageSource('dsh.store.hittin.logo.v1');
    }
    return resolveDshImageSource(store.logoImageUri || store.imageUri);
  }, [store]);
  const fallbackMenuItems = React.useMemo<DshStoreGetMenuItem[]>(() => menuItems ?? [], [menuItems]);
  const previewPartnerBadge = storeCoverImageSource ? (
    <View style={styles.previewPartnerBadge} pointerEvents="none">
      <Image source={storeCoverImageSource} style={styles.previewPartnerBadgeImage} resizeMode="cover" />
    </View>
  ) : null;

  const clientVisibleItems = React.useMemo(
    () => fallbackMenuItems.filter((item) => item.isAvailable !== false && canRenderInClientSurface(item.publishStage, 'product')),
    [fallbackMenuItems],
  );

  const isOfferItem = React.useCallback((item: DshStoreGetMenuItem) => {
    if ((item as any).isOffer) return true;
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
  const transitionAnim = React.useRef(new Animated.Value(1)).current;
  const previewDrag = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const previewScale = React.useRef(new Animated.Value(1)).current;
  const previewRotate = React.useRef(new Animated.Value(0)).current; // degrees-ish proxy
  // tighter rotation range for a premium subtle feel
  const previewRotateDeg = previewRotate.interpolate({ inputRange: [-200, 200], outputRange: ['-6deg', '6deg'], extrapolate: 'clamp' });

  // Preview peek (next card) shown while dragging
  const [previewPeekItem, setPreviewPeekItem] = React.useState<DshStoreGetMenuItem | null>(null);
  const [previewPeekType, setPreviewPeekType] = React.useState<'category' | 'item' | null>(null);
  const [previewPeekSign, setPreviewPeekSign] = React.useState<number>(1);

  const STAGE_OFFSET_X = Dimensions.get('window').width + 220;
  const stageOffsetPosX = React.useRef(new Animated.Value(STAGE_OFFSET_X)).current;
  const stageOffsetNegX = React.useRef(new Animated.Value(-STAGE_OFFSET_X)).current;

  const STAGE_OFFSET_Y = Dimensions.get('window').height * 0.6;
  const stageOffsetPosY = React.useRef(new Animated.Value(STAGE_OFFSET_Y)).current;
  const stageOffsetNegY = React.useRef(new Animated.Value(-STAGE_OFFSET_Y)).current;

  // Throttle & prefetch helpers to avoid heavy work on every move event
  const lastPreviewPeekUpdateRef = React.useRef<number>(0);
  const PREVIEW_PEEK_THROTTLE_MS = 90; // ms between preview-peek updates
  const prefetchedUrisRef = React.useRef<Record<string, boolean>>({});
  const previewPeekIdRef = React.useRef<string | null>(null);

  const trySetPreviewPeek = React.useCallback((nextPreview: DshStoreGetMenuItem | null, type: 'category' | 'item' | null, sign: number) => {
    const now = Date.now();
    if (!nextPreview) {
      previewPeekIdRef.current = null;
      try { setPreviewPeekItem(null); setPreviewPeekType(null); setPreviewPeekSign(1); } catch {}
      return;
    }

    if (previewPeekIdRef.current === nextPreview.id && previewPeekType === type) {
      return; // already staged
    }

    if (now - lastPreviewPeekUpdateRef.current < PREVIEW_PEEK_THROTTLE_MS) {
      return; // throttle frequent moves
    }

    lastPreviewPeekUpdateRef.current = now;

    const uri = nextPreview.imageUri;
    if (uri && !prefetchedUrisRef.current[uri]) {
      // mark as prefetched to avoid repeating
      prefetchedUrisRef.current[uri] = true;
      // prefetch asynchronously then set the preview peek (don't await on main thread)
      Image.prefetch(uri).finally(() => {
        previewPeekIdRef.current = nextPreview.id;
        try { setPreviewPeekItem(nextPreview); setPreviewPeekType(type); setPreviewPeekSign(sign); } catch {}
      });
    } else {
      previewPeekIdRef.current = nextPreview.id;
      try { setPreviewPeekItem(nextPreview); setPreviewPeekType(type); setPreviewPeekSign(sign); } catch {}
    }
  }, [previewPeekType]);

  const chipsScrollRef = React.useRef<ScrollView | null>(null);
  const chipLayoutsRef = React.useRef<Record<string, { x: number; width: number }>>({});
  const [chipsContainerWidth, setChipsContainerWidth] = React.useState(0);

  const scrollChipIntoView = React.useCallback((categoryId: string) => {
    const layout = chipLayoutsRef.current[categoryId];
    if (!layout || !chipsContainerWidth || !chipsScrollRef.current) return;
    const centerOffset = chipsContainerWidth / 2 - layout.width / 2;
    const targetX = Math.max(0, layout.x - centerOffset);
    try {
      chipsScrollRef.current.scrollTo({ x: targetX, animated: true });
    } catch {
      // ignore
    }
  }, [chipsContainerWidth]);

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

  const changeCategory = React.useCallback((newId: string) => {
    if (newId === selectedCategory) return;
    Animated.sequence([
      Animated.timing(transitionAnim, { toValue: 0.96, duration: 120, useNativeDriver: false }),
    ]).start(() => {
      setSelectedCategory(newId);
      // ensure list resets to top of new section
      try { listRef.current?.scrollToOffset({ offset: 0, animated: false }); } catch {}
      Animated.timing(transitionAnim, { toValue: 1, duration: 260, useNativeDriver: false }).start();
      // subtle haptic
      try { Vibration.vibrate(8); } catch {}
      scrollChipIntoView(newId);
    });
  }, [selectedCategory, transitionAnim, scrollChipIntoView]);

  const panResponder = React.useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12;
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx } = gestureState;
        const threshold = Math.max(60, Dimensions.get('window').width * 0.08);
        const currentIndex = categories.findIndex((c) => c.id === selectedCategory);
        if (currentIndex === -1) return;
        const nextIndex = Math.min(currentIndex + 1, categories.length - 1);
        const prevIndex = Math.max(currentIndex - 1, 0);

        if (isRTL) {
          if (dx < -threshold && prevIndex !== currentIndex) {
            changeCategory(categories[prevIndex].id);
          } else if (dx > threshold && nextIndex !== currentIndex) {
            changeCategory(categories[nextIndex].id);
          }
        } else {
          if (dx < -threshold && nextIndex !== currentIndex) {
            changeCategory(categories[nextIndex].id);
          } else if (dx > threshold && prevIndex !== currentIndex) {
            changeCategory(categories[prevIndex].id);
          }
        }
      },
    }),
    [categories, selectedCategory, isRTL, changeCategory]
  );

  React.useEffect(() => {
    previewDrag.setValue({ x: 0, y: 0 });
  }, [previewDrag, previewItem?.id]);

  const visibleItems = React.useMemo(() => resolveItemsForCategory(selectedCategory), [resolveItemsForCategory, selectedCategory]);
  const previewItems = visibleItems;
  const previewCurrentIndex = React.useMemo(() => {
    if (!previewItem) return -1;
    return previewItems.findIndex((item) => item.id === previewItem.id);
  }, [previewItem, previewItems]);

  const movePreviewByItemOffset = React.useCallback((offset: number) => {
    if (!previewItem || previewCurrentIndex === -1 || !previewItems.length) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(previewItems.length - 1, previewCurrentIndex + offset));
    if (nextIndex === previewCurrentIndex) {
      return;
    }

    const nextItem = previewItems[nextIndex];
    setPreviewItem(nextItem);
  }, [previewCurrentIndex, previewItem, previewItems]);

  const movePreviewByCategoryOffset = React.useCallback((offset: number) => {
    if (!categories.length) {
      return;
    }

    const currentIndex = categories.findIndex((category) => category.id === selectedCategory);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(categories.length - 1, currentIndex + offset));
    if (nextIndex === currentIndex) {
      return;
    }

    const nextCategoryId = categories[nextIndex].id;
    changeCategory(nextCategoryId);

    const nextCategoryItems = resolveItemsForCategory(nextCategoryId);
    if (nextCategoryItems.length) {
      setPreviewItem(nextCategoryItems[0]);
    }
  }, [categories, changeCategory, resolveItemsForCategory, selectedCategory]);

  const previewPanResponder = React.useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10;
      },
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10;
      },
      onPanResponderGrant: () => {
        previewDrag.stopAnimation();
        // subtle lift when grabbing
        Animated.spring(previewScale, { toValue: 1.04, useNativeDriver: false, friction: 6, tension: 100 }).start();
        previewRotate.setValue(0);
      },
      onPanResponderMove: (_evt, gestureState) => {
        // more responsive movement multiplier for quicker feedback
        const dampX = gestureState.dx * 0.36;
        const dampY = gestureState.dy * 0.36;
        previewDrag.setValue({ x: dampX, y: dampY });
        // smaller, smoother rotation mapping
        previewRotate.setValue(gestureState.dx * 0.045);

        // preview-peek logic: reveal the next card immediately while dragging
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // horizontal preview peek
        if (absDx >= absDy && absDx > 8) {
          const toLeft = dx < 0;
          const currentCatIndex = categories.findIndex((c) => c.id === selectedCategory);
          let candidateCatIndex = currentCatIndex;
          if (isRTL) {
            candidateCatIndex = dx < 0 ? Math.max(currentCatIndex - 1, 0) : Math.min(currentCatIndex + 1, categories.length - 1);
          } else {
            candidateCatIndex = dx < 0 ? Math.min(currentCatIndex + 1, categories.length - 1) : Math.max(currentCatIndex - 1, 0);
          }

          if (candidateCatIndex !== currentCatIndex) {
            const nextCategoryItems = resolveItemsForCategory(categories[candidateCatIndex].id);
              if (nextCategoryItems.length) {
              const nextPreview = nextCategoryItems[0];
              trySetPreviewPeek(nextPreview, 'category', toLeft ? 1 : -1);
            } else {
              // clear the preview peek if there is no candidate
              trySetPreviewPeek(null, null, 1);
            }
          } else if (previewPeekItem) {
            setPreviewPeekItem(null);
            setPreviewPeekType(null);
          }

        // vertical preview peek
        } else if (absDy > absDx && absDy > 8) {
          if (previewCurrentIndex !== -1) {
            const toUp = dy < 0;
            const candidateItemIndex = Math.max(0, Math.min(previewItems.length - 1, previewCurrentIndex + (toUp ? 1 : -1)));
            if (candidateItemIndex !== previewCurrentIndex) {
              const nextPreview = previewItems[candidateItemIndex];
              trySetPreviewPeek(nextPreview, 'item', toUp ? 1 : -1);
            } else {
              trySetPreviewPeek(null, null, 1);
            }
          }
        } else {
          // clear if movement is not directional enough
          trySetPreviewPeek(null, null, 1);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx, dy, vx, vy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        // lower distance threshold and lower velocity threshold for snappier reactions
        const threshold = Math.max(36, Dimensions.get('window').width * 0.06);
        const velocityThreshold = 0.55; // quick flick sensitivity (easier to trigger)
        const isHorizontal = absDx >= absDy;

        const performCategorySwipe = (dirOffset: number, offX: number) => {
          // adapt animation duration to flick velocity for faster, smoother feel
          const base = 320;
          const speedAdj = Math.min(260, Math.abs(vx) * 300);
          const outDuration = Math.max(120, Math.floor(base - speedAdj));

          Animated.timing(previewDrag.x, { toValue: offX, duration: outDuration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
            try { movePreviewByCategoryOffset(dirOffset); } catch {}
            // place new card off-screen on opposite side and slide in quickly
            previewDrag.setValue({ x: -offX, y: 0 });
            Animated.parallel([
              Animated.timing(previewDrag.x, { toValue: 0, duration: Math.max(180, Math.floor(280 - speedAdj / 1.5)), easing: Easing.out(Easing.cubic), useNativeDriver: false }),
              Animated.spring(previewScale, { toValue: 1, useNativeDriver: false, friction: 6, tension: 90 }),
              Animated.timing(previewRotate, { toValue: 0, duration: 180, useNativeDriver: false }),
            ]).start(() => { previewPeekIdRef.current = null; try { setPreviewPeekItem(null); setPreviewPeekType(null); } catch {} });
            try { Vibration.vibrate(8); } catch {}
          });
        };

        const performItemSwipe = (dirOffset: number, offY: number) => {
          const base = 260;
          const speedAdjY = Math.min(220, Math.abs(vy) * 300);
          const outDurationY = Math.max(120, Math.floor(base - speedAdjY));

          Animated.timing(previewDrag.y, { toValue: offY, duration: outDurationY, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
            movePreviewByItemOffset(dirOffset);
            previewDrag.setValue({ x: 0, y: -offY });
            Animated.parallel([
              Animated.timing(previewDrag.y, { toValue: 0, duration: Math.max(160, Math.floor(240 - speedAdjY / 1.5)), easing: Easing.out(Easing.cubic), useNativeDriver: false }),
              Animated.spring(previewScale, { toValue: 1, useNativeDriver: false, friction: 6, tension: 90 }),
              Animated.timing(previewRotate, { toValue: 0, duration: 160, useNativeDriver: false }),
            ]).start(() => { previewPeekIdRef.current = null; try { setPreviewPeekItem(null); setPreviewPeekType(null); } catch {} });
            try { Vibration.vibrate(6); } catch {}
          });
        };

        if (isHorizontal && (absDx > threshold || Math.abs(vx) > velocityThreshold)) {
          // horizontal swipe: detect logical category offset mapping
          const toLeft = dx < 0;
          const offX = (toLeft ? -1 : 1) * (Dimensions.get('window').width + 220);
          // map to movePreviewByCategoryOffset same as before
          if (isRTL) {
            // RTL mapping preserves earlier logic
            performCategorySwipe(toLeft ? -1 : 1, offX);
          } else {
            performCategorySwipe(toLeft ? 1 : -1, offX);
          }
        } else if (!isHorizontal && (absDy > threshold || Math.abs(vy) > velocityThreshold)) {
          const toUp = dy < 0;
          const offY = (toUp ? -1 : 1) * (Dimensions.get('window').height * 0.6);
          performItemSwipe(toUp ? 1 : -1, offY);
        } else {
          // gentle return to center
          Animated.parallel([
            Animated.spring(previewDrag, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 7, tension: 90 }),
            Animated.spring(previewScale, { toValue: 1, useNativeDriver: false, friction: 8, tension: 90 }),
            Animated.timing(previewRotate, { toValue: 0, duration: 160, useNativeDriver: false }),
          ]).start(() => { previewPeekIdRef.current = null; try { setPreviewPeekItem(null); setPreviewPeekType(null); } catch {} });
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(previewDrag, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 7, tension: 90 }),
          Animated.spring(previewScale, { toValue: 1, useNativeDriver: false, friction: 8, tension: 90 }),
          Animated.timing(previewRotate, { toValue: 0, duration: 160, useNativeDriver: false }),
        ]).start(() => { previewPeekIdRef.current = null; try { setPreviewPeekItem(null); setPreviewPeekType(null); } catch {} });
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    }),
    [isRTL, movePreviewByCategoryOffset, movePreviewByItemOffset, previewDrag, categories, selectedCategory, previewItems, previewCurrentIndex, previewRotate, previewScale, resolveItemsForCategory]
  );

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
    closeMeasurementPicker();
    setCartToastVisible(true);
    setCartDecisionVisible(true);
  }, [pickerItem, closeMeasurementPicker, onAddItemToCart, selectedMeasureOption, selectedMeasureQty, selectedMode]);

  const handleGoToCart = React.useCallback(() => {
    setCartDecisionVisible(false);
    setCartToastVisible(false);
    onOpenCart?.();
  }, [onOpenCart]);

  const handleContinueShopping = React.useCallback(() => {
    setCartDecisionVisible(false);
  }, []);

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

  const normalizedFollowersLabel = normalizeFollowersLabel(store.followersCount ?? store.followersLabel, storeText.get.followersSuffix);
  const normalizedPriceMatchLabel = isPriceMatchBlocked ? undefined : normalizePriceMatchLabel(store.priceMatchLabel, storeText.get.priceMatch);
  const normalizedStoreName = normalizeDisplayText(store.name);
  const normalizedStoreSubtitle = normalizeDisplayText(store.subtitle);
  const normalizedEtaLabel = normalizeDisplayText(store.etaLabel);
  const operationalState = React.useMemo(
    () => resolveStoreOperationalState(store.statusLabel, store.deliveryLabel, store.serviceLabel),
    [store.deliveryLabel, store.serviceLabel, store.statusLabel],
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
        (isProBlocked ? false : store.hasBthwaniPro) ? 'بثواني برو' : null,
        ...(store.subscriptionPackageChips ?? []),
        store.deliveryLabel ?? null,
        store.serviceLabel ?? null,
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

    if (normalized.includes('متجر') || normalized.includes('store delivery')) {
      setSelectedMode('store_delivery');
      return;
    }

    if (normalized.includes('توصيل')) {
      setSelectedMode('delivery');
      return;
    }

    if (firstVisibleItem) {
      openStoreItemPreview(firstVisibleItem);
    }
  }, [changeCategory, firstVisibleItem, onOpenBenefits, openStoreItemPreview]);

  const smartRailItems = React.useMemo<BannerCarouselItem[]>(() => {
    const featureImages = menuItems.map((item) => resolveDshStoreMenuItemImageSource(item));
    const pickFeatureImage = (index: number) => featureImages[index] ?? resolveDshStoreCoverImageSource(store);

    const storeDriven = [
      firstVisibleItem
        ? {
            id: `${store.id}-entry`,
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
            id: `${store.id}-offers`,
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
            id: `${store.id}-new`,
            title: 'الجديد لدينا',
            subtitle: 'استعرض أحدث المنتجات',
            badge: 'جديد',
            image: pickFeatureImage(2) ?? null,
            cta: 'صفِّ',
            onPress: () => changeCategory('new'),
          }
        : null,
      ...(benefitChips ?? []).slice(0, 3).map((chip, index) => ({
        id: `${store.id}-benefit-${index}`,
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
  }, [benefitChips, changeCategory, firstNewItem, firstOfferItem, firstVisibleItem, menuItems, normalizedFollowersLabel, normalizedPriceMatchLabel, openStoreItemPreview, resolveFeaturePress, store, storeText]);

  return (
    <View style={[styles.screen, { backgroundColor: appearanceChrome.screenBackground }]}>
      <StatusBar
        animated
        barStyle={isDarkGlass ? 'light-content' : 'dark-content'}
        backgroundColor={appearanceChrome.screenBackground}
      />
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
          <Animated.View style={[styles.feedList, { opacity: transitionAnim, transform: [{ scale: transitionAnim }] }]} {...panResponder.panHandlers}>
            <FlatList
              ref={(r) => { listRef.current = r as unknown as FlatList<DshStoreGetMenuItem> | null; }}
              data={visibleItems as DshStoreGetMenuItem[]}
              keyExtractor={(item) => (item as DshStoreGetMenuItem).id}
              ListHeaderComponent={
                <>
                  <View style={[styles.heroPremiumWrap, { backgroundColor: appearanceChrome.cardBackground, borderWidth: 1, borderColor: appearanceChrome.cardBorder }]}>
                    <View style={[styles.heroCoverWrap, { backgroundColor: appearanceChrome.cardBackground }]}>
                      {storeCoverImageSource ? <Image source={storeCoverImageSource} style={styles.heroCoverImage} /> : <View style={styles.heroCoverPlaceholder} />}
                      <GlassHeroOverlay strength={isDarkGlass ? 'strong' : 'default'} style={[styles.heroCoverOverlay, { backgroundColor: appearanceChrome.heroOverlay }]} />

                      {/* Top Overlay Actions */}
                      <View style={styles.heroTopActions}>
                        <View style={styles.heroTopActionsLeft}>
                          <TouchableOpacity style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackground, borderColor: appearanceChrome.actionBorder, borderWidth: 1 }]} activeOpacity={0.7} onPress={handleStoreShare}>
                            <Icon name="share-outline" size={20} color={appearanceChrome.actionIcon} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackground, borderColor: appearanceChrome.actionBorder, borderWidth: 1 }]} activeOpacity={0.7} onPress={onOpenCart ?? onOpenItems}>
                            <Icon name="cart-outline" size={20} color={appearanceChrome.actionIcon} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackground, borderColor: appearanceChrome.actionBorder, borderWidth: 1 }]} activeOpacity={0.7} onPress={openInlineSearch}>
                            <Icon name="search-outline" size={20} color={appearanceChrome.actionIcon} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.heroTopActionsRight}>
                          <TouchableOpacity style={[styles.heroActionCircle, { backgroundColor: appearanceChrome.actionBackground, borderColor: appearanceChrome.actionBorder, borderWidth: 1 }]} activeOpacity={0.7}>
                            <Icon name="scan-outline" size={20} color={appearanceChrome.actionIcon} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Identity Section (Logo + Info) */}
                      <View style={styles.heroIdentitySection}>
                        <View style={styles.heroLogoWrap}>
                          <Image
                            source={storeLogoImageSource || resolveDshImageSource('dsh.brand.logo.v1')}
                            style={styles.heroLogoImage}
                          />
                        </View>
                        <View style={styles.heroInfoCluster}>
                          <Text style={styles.heroNameText} numberOfLines={2}>{normalizedStoreName}</Text>
                          <View style={styles.heroLocationRow}>
                            <Icon name="location-sharp" size={16} color={appearanceChrome.actionIcon} />
                            <Text style={styles.heroLocationText}>{store.locationLabel || 'حي العليا، الرياض'}</Text>
                          </View>
                          <View style={[styles.heroStatusBadge, { backgroundColor: appearanceChrome.statusBadgeBackground, borderWidth: 1, borderColor: appearanceChrome.statusBadgeBorder }]}>
                            <View style={[styles.heroStatusDot, { backgroundColor: appearanceChrome.statusDot }]} />
                            <Text style={styles.heroStatusText}>{store?.statusLabel || 'مفتوح'}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.heroGridsLayer}>
                        {/* ROW 1: Metrics (4 Items) */}
                        <View style={styles.heroFeatureGrid}>
                          <View style={[styles.heroFeatureChip, { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.cardBorder }]}>
                            <Icon name="people-outline" size={18} color={appearanceChrome.accent} />
                            <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]} numberOfLines={1}>{normalizedFollowersLabel || '11 ألف'}</Text>
                            <Text style={[styles.heroFeatureLabel, { color: appearanceChrome.labelText }]}>ثقة المجتمع</Text>
                          </View>

                          <View style={[styles.heroFeatureChip, { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.cardBorder }]}>
                            <Icon name="time-outline" size={18} color={appearanceChrome.accent} />
                            <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]} numberOfLines={1}>{store.deliveryTimeLabel || normalizedEtaLabel}</Text>
                            <Text style={[styles.heroFeatureLabel, { color: appearanceChrome.labelText }]}>متوسط التوصيل</Text>
                          </View>

                          <View style={[styles.heroFeatureChip, { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.cardBorder }]}>
                            <Icon name="star" size={18} color={appearanceChrome.accent} />
                            <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]} numberOfLines={1}>{store.rating?.toFixed(1) || '5.0'}</Text>
                            <Text style={[styles.heroFeatureLabel, { color: appearanceChrome.labelText }]}>تقييم المتجر</Text>
                          </View>

                          {store.hasBthwaniPro && (
                            <View style={[styles.heroFeatureChip, { backgroundColor: appearanceChrome.strongSurface, borderColor: appearanceChrome.cardBorder }]}>
                              <Icon name="sparkles" size={18} color={appearanceChrome.accent} />
                              <Text style={[styles.heroFeatureValue, { color: appearanceChrome.primaryText }]} numberOfLines={1}>بثواني برو</Text>
                              <Text style={[styles.heroFeatureLabel, { color: appearanceChrome.labelText }]}>تجربة مميزة</Text>
                            </View>
                          )}
                        </View>

                        {/* ROW 2: Delivery Options (3 Items) */}
                        <View style={styles.heroDeliveryGrid}>
                          {deliveryModes.map((mode) => {
                            const active = selectedMode === mode.id;
                            let subtitle = '';
                            if (mode.id === 'store_delivery') subtitle = 'من أسطول المتجر';
                            if (mode.id === 'pickup') subtitle = 'جاهز للاستلام';
                            if (mode.id === 'delivery') subtitle = 'توصيل بثواني';

                            return (
                              <TouchableOpacity
                                key={mode.id}
                                style={[
                                  styles.heroDeliveryChip,
                                  {
                                    backgroundColor: active ? appearanceChrome.activeActionBackground : appearanceChrome.actionBackground,
                                    borderColor: active ? appearanceChrome.activeActionBorder : appearanceChrome.actionBorder,
                                  },
                                  active && styles.heroDeliveryChipActive,
                                ]}
                                onPress={() => setSelectedMode(mode.id)}
                                activeOpacity={0.8}
                              >
                                <View style={styles.heroDeliveryChipTextContent}>
                                  <Text style={[styles.heroDeliveryChipTitle, { color: active ? appearanceChrome.activeActionIcon : appearanceChrome.primaryText }, active && styles.heroDeliveryChipTitleActive]} numberOfLines={1}>
                                    {mode.label}
                                  </Text>
                                  <Text style={[styles.heroDeliveryChipSubtitle, { color: active ? appearanceChrome.activeActionIcon : appearanceChrome.labelText }]} numberOfLines={1}>{subtitle}</Text>
                                </View>
                                <Icon name={mode.icon} size={22} color={active ? appearanceChrome.activeActionIcon : appearanceChrome.actionIcon} />
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  </View>

                  {showOperationalNotice ? (
                    <View
                      style={[
                        styles.storeStateNotice,
                        operationalState === 'area_unserviceable' ? styles.storeStateNoticeDanger : styles.storeStateNoticeWarning,
                        { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.cardBorder },
                        { marginHorizontal: 16, marginTop: 16, marginBottom: 8 }
                      ]}
                    >
                      <View style={styles.storeStateNoticeCopy}>
                        <Text style={[styles.storeStateNoticeTitle, { color: appearanceChrome.primaryText }, isRTL && styles.textAlignRight]}>{operationalStateMeta.title}</Text>
                        <Text style={[styles.storeStateNoticeDescription, { color: appearanceChrome.secondaryText }, isRTL && styles.textAlignRight]}>
                          {operationalStateMeta.description}
                        </Text>
                      </View>
                      {onSupport ? (
                        <View style={styles.storeStateNoticeAction}>
                          <Button label={supportActionLabel} tone={isDarkGlass ? 'glass' : 'secondary'} onPress={onSupport} />
                        </View>
                      ) : null}
                    </View>
                  ) : null}


                    {smartRailItems.length ? (
                      <BannerCarousel
                        banners={smartRailItems}
                        width={viewportWidth}
                        height={108}
                        variant="secondary"
                        fullBleed
                        itemWidth={Math.round(viewportWidth * 0.58)}
                        itemGap={12}
                        style={styles.smartRailSection}
                      />
                    ) : null}

                  <View style={styles.sectionBlock}>
                    <ScrollView
                      horizontal
                      ref={(r) => { chipsScrollRef.current = r; }}
                      onLayout={(e) => setChipsContainerWidth(e.nativeEvent.layout.width)}
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled
                      decelerationRate="fast"
                      contentContainerStyle={[styles.categoryRow, isRTL && styles.rowReverse]}
                    >
                      {categories.map((category) => {
                        const selected = selectedCategory === category.id;
                        return (
                          <View
                            key={category.id}
                            onLayout={(e) => {
                              chipLayoutsRef.current[category.id] = {
                                x: e.nativeEvent.layout.x,
                                width: e.nativeEvent.layout.width,
                              };
                            }}
                          >
                            <Chip
                              label={`${normalizeDisplayText(category.label)} ${CATEGORY_ICON[category.id] ?? '•'}`}
                              selected={selected}
                              tone={isDarkGlass ? (selected ? 'glassStrong' : 'glass') : 'brand'}
                              onPress={() => changeCategory(category.id)}
                            />
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                </>
              }
              renderItem={({ item, index }) => {
                const inputRange = [(index - 1) * SNAP_INTERVAL, index * SNAP_INTERVAL, (index + 1) * SNAP_INTERVAL];
                const scale = scrollY.interpolate({ inputRange, outputRange: [0.986, 1, 0.986], extrapolate: 'clamp' });
                const translateY = scrollY.interpolate({ inputRange, outputRange: [8, 0, 8], extrapolate: 'clamp' });
                const opacity = scrollY.interpolate({ inputRange, outputRange: [0.9, 1, 0.9], extrapolate: 'clamp' });

                return (
                  <Animated.View style={[{ transform: [{ scale }, { translateY }], opacity, marginBottom: CARD_GAP }]}
                    pointerEvents="box-none"
                  >
                    {
                      (() => {
                        return (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            partnerImageSource={storeCoverImageSource}
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
              onScroll={(event) => {
                scrollY.setValue(event.nativeEvent.contentOffset.y);
              }}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 28 }}
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
          </Animated.View>
        </View>

      <Toast
        visible={cartToastVisible}
        title="تمت الإضافة إلى السلة"
        description={addedItemLabel ? `${addedItemLabel} أضيفت بنجاح.` : 'تمت الإضافة إلى السلة.'}
        tone="success"
        actionLabel="عرض السلة"
        onActionPress={handleGoToCart}
        onDismiss={() => setCartToastVisible(false)}
      />

      <Modal visible={cartDecisionVisible} transparent animationType="fade" onRequestClose={handleContinueShopping}>
        <Pressable style={styles.cartDecisionOverlay} onPress={handleContinueShopping}>
          <View style={[styles.cartDecisionCard, { backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder }]} pointerEvents="box-none">
            <Text style={[styles.cartDecisionTitle, { color: appearanceChrome.primaryText }]}>تمت الإضافة للسلة</Text>
            <Text style={[styles.cartDecisionSubtitle, { color: appearanceChrome.secondaryText }]}>{addedItemLabel ? `${addedItemLabel} أضيفت بنجاح إلى السلة.` : 'تمت الإضافة إلى السلة بنجاح.'}</Text>
            <View style={styles.cartDecisionActions}>
              <Button label="انتقال للسلة" tone={isDarkGlass ? 'glassStrong' : 'primary'} fullWidth onPress={handleGoToCart} />
              <Button label="متابعة التسوق" tone={isDarkGlass ? 'glass' : 'secondary'} fullWidth onPress={handleContinueShopping} />
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal visible={Boolean(previewItem)} transparent animationType="fade" onRequestClose={closeImagePreview}>
        <View style={[styles.previewOverlay, { backgroundColor: appearanceChrome.overlay }]}>
          <Pressable style={styles.previewBackdrop} onPress={closeImagePreview} />
          <View style={styles.previewWrap} pointerEvents="box-none">
            {previewPeekItem ? (
              (() => {
                // choose the appropriate offset node for the preview-peek transform
                const stageX = previewPeekSign === 1 ? stageOffsetPosX : stageOffsetNegX;
                const stageY = previewPeekSign === 1 ? stageOffsetPosY : stageOffsetNegY;
                const stageTranslateX = Animated.add(previewDrag.x, stageX);
                const stageTranslateY = Animated.add(previewDrag.y, stageY);
                const stageOpacity = previewPeekType === 'category'
                  ? previewDrag.x.interpolate({ inputRange: previewPeekSign === 1 ? [-24, 0] : [0, 24], outputRange: [1, 0], extrapolate: 'clamp' })
                  : previewDrag.y.interpolate({ inputRange: previewPeekSign === 1 ? [-24, 0] : [0, 24], outputRange: [1, 0], extrapolate: 'clamp' });

                return (
                  <Animated.View
                    pointerEvents="none"
                    collapsable={false}
                    style={[
                      styles.previewCard,
                      { backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder, borderWidth: 1 },
                      { position: 'absolute', left: 0, right: 0, zIndex: 1, opacity: stageOpacity, transform: previewPeekType === 'category' ? [{ translateX: stageTranslateX }] : [{ translateY: stageTranslateY }] },
                    ]}
                  >
                    <View style={styles.previewImageWrap} pointerEvents="box-none">
                      {previewPartnerBadge}

                      <Text style={styles.previewEmoji}>{getItemEmoji(previewPeekItem)}</Text>

                      <Image
                        source={resolveDshStoreMenuItemImageSource(previewPeekItem)}
                        style={styles.previewImage}
                      />

                      {
                        (() => {
                          const overlayColor = getOverlayColor(normalizeDisplayText(previewPeekItem.name), 0.86);
                          return (
                            <View style={[styles.previewDetailsBox, { backgroundColor: isDarkGlass ? appearanceChrome.strongSurface : overlayColor, borderColor: appearanceChrome.modalBorder, borderWidth: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }]} pointerEvents="box-none">
                              <View style={[styles.previewDetailsContent, isRTL ? styles.previewDetailsContentRTL : null]}>
                                {store ? <Text style={[styles.previewStoreName, { color: appearanceChrome.accent }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizedStoreName}</Text> : null}
                                <Text style={[styles.previewDetailsTitle, { color: appearanceChrome.primaryText }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewPeekItem.name)}</Text>
                                {previewPeekItem.subtitle ? <Text style={[styles.previewDetailsSubtitle, { color: appearanceChrome.secondaryText }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewPeekItem.subtitle)}</Text> : null}

                                <View style={[styles.previewDetailsMetaRow, isRTL ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                                  {previewPeekItem.priceLabel ? <Text style={[styles.previewDetailsPrice, { color: appearanceChrome.primaryText }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewPeekItem.priceLabel)}</Text> : null}
                                  {previewPeekItem.discountLabel ? <Text style={[styles.previewDetailsDiscount, { color: appearanceChrome.accent }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewPeekItem.discountLabel)}</Text> : null}
                                </View>
                              </View>

                              <View style={[styles.previewDetailsFavoriteButton, { opacity: 0.95, backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder }]}>
                                <Icon name={favoriteIds.has(previewPeekItem.id) ? 'heart' : 'heart-outline'} size={18} color={appearanceChrome.accent} />
                              </View>
                            </View>
                          );
                        })()
                      }
                    </View>
                  </Animated.View>
                );
              })()
            ) : null}

            {previewItem ? (
              <Animated.View
                style={[
                  styles.previewCard,
                  { backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder, borderWidth: 1 },
                  {
                    transform: [
                      { translateX: previewDrag.x },
                      { translateY: previewDrag.y },
                      { rotate: previewRotateDeg },
                      { scale: previewScale },
                    ],
                    zIndex: 2,
                  },
                ]}
                collapsable={false}
              >
                <View style={styles.previewImageWrap} pointerEvents="box-none">
                  <View style={styles.previewSwipeLayer} {...previewPanResponder.panHandlers} />

                  {previewPartnerBadge}

                  <Text style={styles.previewEmoji}>{getItemEmoji(previewItem!)}</Text>

                  <Image
                    source={resolveDshStoreMenuItemImageSource(previewItem!)}
                    style={styles.previewImage}
                  />

                  {
                    (() => {
                      const overlayColor = getOverlayColor(normalizeDisplayText(previewItem!.name), 0.86);
                      return (
                        <View style={[styles.previewDetailsBox, { backgroundColor: isDarkGlass ? appearanceChrome.strongSurface : overlayColor, borderColor: appearanceChrome.modalBorder, borderWidth: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }]} pointerEvents="box-none">
                          <View style={[styles.previewDetailsContent, isRTL ? styles.previewDetailsContentRTL : null]} pointerEvents="none">
                            {store ? <Text style={[styles.previewStoreName, { color: appearanceChrome.accent }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizedStoreName}</Text> : null}
                            <Text style={[styles.previewDetailsTitle, { color: appearanceChrome.primaryText }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.name)}</Text>
                            {previewItem!.subtitle ? <Text style={[styles.previewDetailsSubtitle, { color: appearanceChrome.secondaryText }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.subtitle)}</Text> : null}

                            <View style={[styles.previewDetailsMetaRow, isRTL ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                              {previewItem!.priceLabel ? <Text style={[styles.previewDetailsPrice, { color: appearanceChrome.primaryText }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.priceLabel)}</Text> : null}
                              {previewItem!.discountLabel ? <Text style={[styles.previewDetailsDiscount, { color: appearanceChrome.accent }, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.discountLabel)}</Text> : null}
                            </View>
                          </View>

                          <TouchableOpacity style={[styles.previewDetailsFavoriteButton, { backgroundColor: appearanceChrome.modalSurface, borderColor: appearanceChrome.modalBorder }]} activeOpacity={0.9} onPress={handlePreviewFavoritePress}>
                            <Icon name={favoriteIds.has(previewItem!.id) ? 'heart' : 'heart-outline'} size={18} color={appearanceChrome.accent} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.menuActionBadge, styles.previewActionButton, { backgroundColor: appearanceChrome.activeActionBackground }]}
                            activeOpacity={0.85}
                            onPress={() => handlePreviewAddToCart()}
                          >
                            <Icon name="cart-outline" size={18} color={isDarkGlass ? theme.brandContrast : stylesTokens.white} />
                            <View style={styles.menuActionPlusBadge}>
                              <Icon name="add" size={10} color={appearanceChrome.accent} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })()
                  }
                </View>
              </Animated.View>
            ) : null}
          </View>
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

const DARK_BLUE = '#0A2F5C';
const ORANGE = '#FF500D';
const GOLD = '#FFD700';

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
  scroll: {
    flex: 1,
    backgroundColor: colorPalette.pageBackground,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textAlignRight: {
    textAlign: 'right',
  },

  topChrome: {
    backgroundColor: stylesTokens.white,
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  topChromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 4,
    minHeight: 76,
    paddingHorizontal: 12,
    paddingTop: 22,
    paddingBottom: 4,
    backgroundColor: stylesTokens.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: colorPalette.brandSurface,
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.brandStrong,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inlineSearchShell: {
    minHeight: 68,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: stylesTokens.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colorPalette.brandSoft,
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.brandStrong,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inlineSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineSearchFieldWrap: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorPalette.brandSoft,
    backgroundColor: colorPalette.pageBackground,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  inlineSearchInput: {
    flex: 1,
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingVertical: 0,
  },
  inlineSearchCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colorPalette.pageBackground,
    borderWidth: 1,
    borderColor: colorPalette.brandSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineSearchHint: {
    marginTop: 8,
    color: stylesTokens.muted,
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 16,
  },
  headerEdgeSlot: {
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 6,
    elevation: 6,
  },
  headerEdgeSlotEnd: {
    justifyContent: 'flex-end',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 8,
    marginTop: 0,
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
  topChromeSpacer: {
    flex: 1,
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 6,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexShrink: 1,
    paddingTop: 0,
  },
  titleBlockRTL: {
    alignItems: 'stretch',
  },
  storeName: {
    color: stylesTokens.dark,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  storeSubtitle: {
    color: stylesTokens.muted,
    fontSize: 11,
    marginTop: 1,
    lineHeight: 14,
    textAlign: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colorPalette.brandSoft,
    borderWidth: 1,
    borderColor: colorPalette.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  headerMetaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  topMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    backgroundColor: colorPalette.brandSoft,
    borderRadius: 999,
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: colorPalette.brand,
    minHeight: 18,
  },
  topMetaChipText: {
    color: stylesTokens.dark,
    fontSize: 8.5,
    fontWeight: '700',
    lineHeight: 10,
  },
  followMetaChipTextActive: {
    color: stylesTokens.orange,
  },
  headerMetaText: {
    color: stylesTokens.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: colorPalette.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colorPalette.success,
  },
  statusPillText: {
    color: stylesTokens.green,
    fontSize: 11,
    fontWeight: '800',
  },
  ratingText: {
    color: stylesTokens.dark,
    fontSize: 12,
    fontWeight: '800',
  },

  // PREMIUM HERO 2026
  heroPremiumWrap: {
    marginBottom: 20,
    backgroundColor: stylesTokens.white,
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.brandStrong,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroCoverWrap: {
    height: 480,
    width: '100%',
    position: 'relative',
    backgroundColor: stylesTokens.dark,
  },
  heroCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroCoverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
  heroCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTopActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  heroTopActionsLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  heroTopActionsRight: {
    flexDirection: 'row',
    gap: 12,
  },
  heroActionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  heroIdentitySection: {
    position: 'absolute',
    top: 100,
    right: 20,
    left: 20,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 16,
    zIndex: 50,
  },
  heroLogoWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: stylesTokens.white,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  heroLogoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroInfoCluster: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 10,
  },
  heroNameText: {
    fontSize: 32,
    fontWeight: '900',
    color: stylesTokens.white,
    fontFamily: 'Outfit-Bold',
    textAlign: 'right',
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroLocationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  heroLocationText: {
    fontSize: 16,
    color: stylesTokens.white,
    fontFamily: 'Outfit-Medium',
    fontWeight: '700',
  },
  heroStatusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  heroStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  heroStatusText: {
    fontSize: 15,
    fontWeight: '900',
    color: stylesTokens.white,
    fontFamily: 'Outfit-Bold',
  },

  heroGridsLayer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    gap: 10,
  },
  heroFeatureGrid: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  heroFeatureChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 4,
    height: 85,
  },
  heroFeatureTextCenter: {
    alignItems: 'center',
  },
  heroFeatureValue: {
    fontSize: 15,
    fontWeight: '900',
    color: stylesTokens.white,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
  },
  heroFeatureLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Outfit-Medium',
  },

  heroDeliveryGrid: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  heroDeliveryChip: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
    height: 70,
  },
  heroDeliveryChipActive: {
    borderColor: ORANGE,
    backgroundColor: 'rgba(255, 80, 13, 0.15)',
    borderWidth: 1.5,
  },
  heroDeliveryChipTextContent: {
    alignItems: 'flex-end',
    gap: 1,
    flex: 1,
  },
  heroDeliveryChipTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: stylesTokens.white,
    textAlign: 'right',
    fontFamily: 'Outfit-Bold',
  },
  heroDeliveryChipTitleActive: {
    color: ORANGE,
  },
  heroDeliveryChipSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
    fontWeight: '700',
    fontFamily: 'Outfit-Medium',
  },

  heroIdentityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroAvatar: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: stylesTokens.orangeSoft,
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroAvatarImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  heroAvatarText: {
    color: stylesTokens.white,
    fontSize: 20,
    fontWeight: '900',
  },
  heroIdentityContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 2,
  },
  heroIdentityContentRTL: {
    alignItems: 'flex-end',
  },
  heroTopRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroTitleInfo: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  heroTitleInfoRTL: {
    alignItems: 'flex-end',
  },
  heroInlineName: {
    color: stylesTokens.dark,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  heroInlineSubtitle: {
    marginTop: 0,
    color: stylesTokens.muted,
    fontSize: 10.5,
    lineHeight: 14,
  },
  storeHeaderTitle: {
    color: stylesTokens.dark,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
    maxWidth: '100%',
    flexShrink: 1,
    minWidth: 0,
    textAlign: 'center',
  },
  heroCompactMetaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  heroBadgePrimary: {
    backgroundColor: stylesTokens.infoSurface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: stylesTokens.infoBorder,
  },
  heroBadgePrimaryText: {
    color: stylesTokens.infoText,
    fontSize: 10.5,
    fontWeight: '800',
  },
  heroBadgeGhost: {
    backgroundColor: stylesTokens.light,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: stylesTokens.line,
  },
  heroBadgeGhostText: {
    color: stylesTokens.dark,
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: stylesTokens.white,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  heroSubtitle: {
    color: stylesTokens.lineStrong,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  heroMetaCaption: {
    color: stylesTokens.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  heroStatsRow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  heroStatLabel: {
    color: stylesTokens.muted,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
  },
  deliveryControlCluster: {
    marginTop: 2,
    gap: 4,
  },
  storeStateNotice: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  storeStateNoticeWarning: {
    backgroundColor: stylesTokens.orangeSoft,
    borderColor: colorPalette.borderSubtle,
  },
  storeStateNoticeDanger: {
    backgroundColor: stylesTokens.orangeSoft,
    borderColor: stylesTokens.warning,
  },
  storeStateNoticeCopy: {
    gap: 4,
    alignItems: 'flex-end',
  },
  storeStateNoticeTitle: {
    color: stylesTokens.dark,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  storeStateNoticeDescription: {
    color: stylesTokens.muted,
    fontSize: 11.5,
    lineHeight: 17,
  },
  storeStateNoticeAction: {
    alignSelf: 'stretch',
  },
  smartRailSection: {
    marginTop: 0,
    marginHorizontal: -12,
    marginBottom: -6,
  },
  subscriptionBlock: {
    marginTop: 1,
    alignItems: 'flex-end',
    alignSelf: 'stretch',
  },
  tagRow: {
    marginTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'flex-end',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    backgroundColor: stylesTokens.brandSoft,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    paddingHorizontal: 5,
    paddingVertical: 0,
    minHeight: 18,
  },
  tagChipAccent: {
    backgroundColor: stylesTokens.orangeSoft,
    borderColor: colorPalette.borderSubtle,
  },
  tagChipText: {
    color: stylesTokens.dark,
    fontSize: 8.5,
    fontWeight: '700',
    lineHeight: 10,
  },
  tagChipTextAccent: {
    color: stylesTokens.warningText,
  },
  modeStripWrapInline: {
    marginTop: 0,
  },
  modeStrip: {
    backgroundColor: colorPalette.surfaceInset,
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
    height: 54,
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
    paddingHorizontal: 0,
    width: '100%',
  },
  categoryRow: {
    marginTop: 0,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'flex-end',
    paddingVertical: 0,
  },
  categoryPill: {
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPillSelected: {
    backgroundColor: stylesTokens.orangeSoft,
    borderColor: stylesTokens.orange,
  },
  categoryPillIcon: {
    fontSize: 12,
    color: stylesTokens.chipText,
    fontWeight: '800',
  },
  categoryPillIconSelected: {
    color: stylesTokens.orange,
  },
  categoryPillText: {
    color: stylesTokens.chipText,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryPillTextSelected: {
    color: stylesTokens.orange,
  },

  feedSection: {
    flex: 1,
    minHeight: 0,
    marginTop: 2,
    paddingHorizontal: 12,
  },
  feedList: {
    flex: 1,
    gap: 2,
  },

  menuCard: {
    backgroundColor: stylesTokens.white,
    borderRadius: 18,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    height: 126,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
  menuCardRTL: {
    flexDirection: 'row-reverse',
  },
  menuActionRail: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    paddingLeft: 8,
  },
  menuActionRailRTL: {
    alignItems: 'center',
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
    paddingHorizontal: 18,
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  previewWrap: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  previewCard: {
    width: '100%',
    maxWidth: 760,
    borderRadius: 16,
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    backgroundColor: stylesTokens.white,
  },
  previewImageWrap: {
    width: '100%',
    height: 420,
    backgroundColor: stylesTokens.light,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    top: 18,
    left: 18,
    width: 44,
    height: 36,
    borderRadius: 12,
    backgroundColor: stylesTokens.whiteOverlay,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    zIndex: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
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
  previewFavoriteButton: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    zIndex: 5,
  },
  previewDetailsBox: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    zIndex: 6,
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
    marginTop: 6,
  },
  previewDetailsPrice: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
  },
  previewDetailsCartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewDetailsFavoriteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    zIndex: 3,
    elevation: 3,
  },
  previewActionButton: {
    zIndex: 3,
    elevation: 3,
  },
  previewDetailsMetaRow: {
    marginTop: 4,
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
  measureSheetSubtitle: {
    color: stylesTokens.muted,
    fontSize: 11,
    fontWeight: '600',
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
  cartDecisionOverlay: {
    flex: 1,
    backgroundColor: stylesTokens.overlayDense,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cartDecisionCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: stylesTokens.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cartDecisionTitle: {
    color: stylesTokens.dark,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  cartDecisionSubtitle: {
    color: stylesTokens.muted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  cartDecisionActions: {
    gap: 10,
  },
  emptyFeed: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 18,
    backgroundColor: stylesTokens.light,
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

  fullMenuLink: {
    marginTop: 8,
    marginHorizontal: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: stylesTokens.orangeSoft,
    borderWidth: 1,
    borderColor: stylesTokens.orangeBorder,
  },
  fullMenuLinkText: {
    color: stylesTokens.orange,
    fontSize: 13,
    fontWeight: '800',
  },
  footerNoteWrap: {
    marginTop: 8,
    paddingHorizontal: 12,
  },
});

export default DshStoreGetScreen;
