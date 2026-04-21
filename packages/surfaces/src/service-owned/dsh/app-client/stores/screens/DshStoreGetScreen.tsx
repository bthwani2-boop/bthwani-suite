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
  Vibration,
  Dimensions,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
  type ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resolveSeedMediaSource, type BthSeedMediaKey } from '@bthwani/media-fixtures';
import { BthButton, BthChip, BthHighlightsRail, BthMobileTopBar, BthStateView, BthText, BthToast, colorPalette, useDirection, useUiText, BthProductCard } from '@bthwani/ui-kit';
import { dshCategoryMeasurementPolicies } from '../../../shared/catalog/catalog';
import { formatDshStoreFollowersLabel } from '../../shared/store-profile';
import { storeItemsByStoreId, type DshStoreFixtureItem as DshStoreGetMenuItem } from '../fixtures';
import { mapMenuItemToProductCard } from '../adapters/mapMenuItemToProductCard';

// Menu item type is imported from fixtures for consistency across surfaces

export type DshStoreGetScreenProps = {
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
    tags?: string[];
    categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
    deliveryModes?: Array<{ id: 'delivery' | 'pickup'; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
  };
  menuItems?: DshStoreGetMenuItem[];
  onOpenItems?: () => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
  onOpenBenefits?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

type DeliveryMode = 'delivery' | 'pickup' | 'store_delivery';

function getDeliveryModes(storeText: ReturnType<typeof useUiText>['storeScreen']): Array<{
  id: DeliveryMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
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

const DSH_STORE_PRODUCT_MEDIA_KEY_BY_CATEGORY: Record<string, BthSeedMediaKey> = {
  fresh: 'dsh.product.apple.v1',
  dairy: 'dsh.product.milk.v1',
  bakery: 'dsh.product.croissant.v1',
  meals: 'dsh.product.chicken.v1',
  healthy: 'dsh.product.salad.v1',
  sweets: 'dsh.product.choco.v1',
};

function resolveDshStoreMenuItemMediaKey(item: DshStoreGetMenuItem): BthSeedMediaKey {
  const haystack = normalizeDisplayText(
    [
      item.id,
      item.name,
      item.subtitle,
      item.categoryId,
      item.categoryLabel,
    ]
      .filter(Boolean)
      .join(' '),
  ).toLowerCase();

  if (haystack.includes('milk') || haystack.includes('حليب') || haystack.includes('ألبان')) return 'dsh.product.milk.v1';
  if (haystack.includes('croissant') || haystack.includes('كرواسون') || haystack.includes('مخبوز')) return 'dsh.product.croissant.v1';
  if (haystack.includes('bread') || haystack.includes('خبز')) return 'dsh.product.bread.v1';
  if (haystack.includes('choco') || haystack.includes('شوكولات')) return 'dsh.product.choco.v1';
  if (haystack.includes('chicken') || haystack.includes('دجاج')) return 'dsh.product.chicken.v1';
  if (haystack.includes('pasta') || haystack.includes('باستا')) return 'dsh.product.pasta.v1';
  if (haystack.includes('roll') || haystack.includes('لفافة')) return 'dsh.product.roll.v1';
  if (haystack.includes('salad') || haystack.includes('سلطة')) return 'dsh.product.salad.v1';
  if (haystack.includes('yogurt') || haystack.includes('زبادي')) return 'dsh.product.yogurt.v1';
  if (haystack.includes('apple') || haystack.includes('تفاح')) return 'dsh.product.apple.v1';

  return DSH_STORE_PRODUCT_MEDIA_KEY_BY_CATEGORY[item.categoryId] ?? 'dsh.product.apple.v1';
}

function resolveDshStoreMenuItemImageSource(item: DshStoreGetMenuItem): ImageSourcePropType {
  return resolveSeedMediaSource(resolveDshStoreMenuItemMediaKey(item)) as ImageSourcePropType;
}

function resolveDshStoreCoverMediaKey(store?: DshStoreGetScreenProps['store']): BthSeedMediaKey {
  const haystack = normalizeDisplayText(
    [
      store?.id,
      store?.name,
      store?.subtitle,
    ]
      .filter(Boolean)
      .join(' '),
  ).toLowerCase();

  if (haystack.includes('حطين') || haystack.includes('bakery') || haystack.includes('مخبز')) {
    return 'dsh.store.hittin.cover.v1';
  }

  if (haystack.includes('ملقا') || haystack.includes('kitchen') || haystack.includes('مطعم') || haystack.includes('مطبخ')) {
    return 'dsh.store.malqa.cover.v1';
  }

  return 'dsh.store.hadda.cover.v1';
}

function resolveDshStoreCoverImageSource(store?: DshStoreGetScreenProps['store']): ImageSourcePropType {
  return resolveSeedMediaSource(resolveDshStoreCoverMediaKey(store)) as ImageSourcePropType;
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

function pickSampleBackgroundColor(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('تفاح') || n.includes('apple') || n.includes('gala')) return '#eaf9e6';
  if (n.includes('حليب') || n.includes('milk')) return '#eaf4ff';
  if (n.includes('خبز') || n.includes('bread')) return '#fff6e8';
  return '#f3f4f6';
}

function hexToRgba(hex: string, alpha = 0.9) {
  const clean = (hex || '#ffffff').replace('#', '').trim();
  const short = clean.length === 3;
  const r = parseInt(short ? clean[0] + clean[0] : clean.slice(0, 2), 16);
  const g = parseInt(short ? clean[1] + clean[1] : clean.slice(2, 4), 16);
  const b = parseInt(short ? clean[2] + clean[2] : clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getOverlayColor(name: string, alpha = 0.88) {
  return hexToRgba(pickSampleBackgroundColor(name), alpha);
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
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title={storeText.states.storeEmptyTitle}
        description={storeText.states.storeEmptyDescription}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title={storeText.states.storeErrorTitle}
      description={storeText.states.storeErrorDescription}
      actionLabel={storeText.states.retry}
      onActionPress={onRetry}
    />
  );
}

function IconActionButton({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name={icon} size={20} color={stylesTokens.dark} />
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
  icon: keyof typeof Ionicons.glyphMap;
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
        <Ionicons
          name={icon}
          size={18}
          color={active ? stylesTokens.orange : stylesTokens.muted}
        />
      </View>
    </TouchableOpacity>
  );
}

function MenuItemCard({
  item,
  isRTL,
  labels,
  partnerImageUri,
  onAddPress,
  onImagePress,
  onFavoritePress,
  isFavorited,
}: {
  item: DshStoreGetMenuItem;
  isRTL: boolean;
  labels: { available: string; options: string; unavailable: string };
  partnerImageUri?: ImageSourcePropType | string;
  onAddPress?: (anchor: { x: number; y: number }) => void;
  onImagePress?: (item: DshStoreGetMenuItem) => void;
  onFavoritePress?: () => void;
  isFavorited?: boolean;
}) {
  const normalizedName = normalizeDisplayText(item.name);
  const normalizedSubtitle = normalizeDisplayText(item.subtitle);
  const normalizedPrice = normalizeDisplayText(item.priceLabel);
  const normalizedOldPrice = item.oldPriceLabel ? normalizeDisplayText(item.oldPriceLabel) : undefined;
  const normalizedDiscount = item.discountLabel ? normalizeDisplayText(item.discountLabel) : undefined;
  const normalizedPrep = item.preparationTime ? normalizeDisplayText(item.preparationTime) : undefined;
  const normalizedCategory = normalizeDisplayText(item.categoryLabel);
  const normalizedStatus = item.statusLabel ? normalizeDisplayText(item.statusLabel) : undefined;

  return (
    <View style={[styles.menuCard, isRTL && styles.menuCardRTL]}>
      <View style={styles.menuImageWrap}>
        <View style={styles.menuImageCard}>
          <View style={styles.menuPartnerTile}>
            {partnerImageUri ? (
              <Image
                source={typeof partnerImageUri === 'string' ? { uri: partnerImageUri } : partnerImageUri}
                style={styles.menuPartnerTileImage}
              />
            ) : (
              <Ionicons name="storefront-outline" size={16} color={stylesTokens.orange} />
            )}
          </View>
          <Text style={styles.menuEmoji}>{getItemEmoji(item)}</Text>
          {
            (() => {
              const imageSource = resolveDshStoreMenuItemImageSource(item);
              return (
                <Pressable onPress={() => onImagePress?.(item)} style={styles.menuImagePressable} accessibilityRole="imagebutton">
                  <Image source={imageSource} style={styles.menuImage} />
                </Pressable>
              );
            })()
          }
          <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.85} onPress={onFavoritePress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={18} color={stylesTokens.orange} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.menuBody, isRTL && styles.menuBodyRTL]}>
        <View style={styles.menuInfoZone}>
          <Text style={[styles.menuTitle, isRTL && styles.textAlignRight]} numberOfLines={2}>
            {normalizedName}
          </Text>
          <Text style={[styles.menuSubtitle, isRTL && styles.textAlignRight]} numberOfLines={2}>
            {normalizedSubtitle}
          </Text>
          {normalizedPrep ? (
            <View style={[styles.menuTimingRow, isRTL && styles.rowReverse]}>
              <Ionicons name="time-outline" size={14} color={stylesTokens.muted} />
              <Text style={styles.menuPrep} numberOfLines={1}>
                {normalizedPrep}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.menuCommerceZone}>
          <View style={[styles.menuPriceRow, isRTL && styles.rowReverse]}>
            <Text style={[styles.menuPrice, isRTL && styles.textAlignRight]} numberOfLines={1}>
              {normalizedPrice}
            </Text>
            {normalizedOldPrice ? (
              <Text style={styles.menuOldPrice} numberOfLines={1}>
                {normalizedOldPrice}
              </Text>
            ) : null}
          </View>

          {normalizedDiscount ? (
            <View style={styles.menuDiscountRow}>
              <View style={styles.discountChip}>
                <Text style={styles.discountChipText}>{normalizedDiscount}</Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.menuChipRow, isRTL && styles.rowReverse]}>
            {normalizedStatus ? (
              <View style={styles.smallChipPrimary}>
                <Text style={styles.smallChipPrimaryText}>{normalizedStatus}</Text>
              </View>
            ) : null}
            <View style={styles.smallChipLight}>
              <Text style={styles.smallChipLightText}>{normalizedCategory}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.menuActionRail, isRTL && styles.menuActionRailRTL]}>
        <TouchableOpacity
          style={styles.menuActionBadge}
          activeOpacity={0.85}
          onPress={(event: GestureResponderEvent) =>
            onAddPress?.({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
          }
        >
          <Ionicons
            name="cart-outline"
            size={18}
            color={stylesTokens.white}
          />
          <View style={styles.menuActionPlusBadge}>
            <Ionicons name="add" size={10} color={stylesTokens.orange} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function DshStoreGetScreen({
  state = 'ready',
  store,
  menuItems = [],
  onOpenItems,
  onOpenSearch,
  onOpenCart,
  onOpenBenefits,
  onBack,
  onRetry,
  onSupport,
}: DshStoreGetScreenProps) {
  const { direction } = useDirection();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const isRTL = direction === 'rtl';
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
  const [previewItem, setPreviewItem] = React.useState<(DshStoreGetMenuItem & { partnerImageUri?: ImageSourcePropType | string }) | null>(null);
  const [isFollowingStore, setIsFollowingStore] = React.useState(false);

  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());

  const handleToggleFavorite = React.useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openImagePreview = React.useCallback(
    (item: DshStoreGetMenuItem, partnerImageUri?: ImageSourcePropType | string) => setPreviewItem({ ...item, partnerImageUri }),
    [],
  );
  const closeImagePreview = React.useCallback(() => setPreviewItem(null), []);

  const deliveryModes = React.useMemo(() => getDeliveryModes(storeText), [storeText]);
  const itemLabels = React.useMemo(
    () => ({
      available: storeText.items.available,
      options: storeText.items.options,
      unavailable: storeText.items.unavailable,
    }),
    [storeText],
  );

  const storeCoverImageSource = React.useMemo(() => (store ? resolveDshStoreCoverImageSource(store) : undefined), [store]);
  const fallbackMenuItems = React.useMemo(() => {
    if (menuItems.length) {
      return menuItems;
    }

    if (store?.id && storeItemsByStoreId[store.id]?.length) {
      return storeItemsByStoreId[store.id];
    }

    return storeItemsByStoreId['store-1001'];
  }, [menuItems, store?.id]);

  const customerVisibleItems = React.useMemo(
    () => fallbackMenuItems.filter((item) => item.isAvailable !== false),
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
    if ((item as any).isNew) return true;
    const s = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
    if (s.includes('وصل') || s.includes('جديد') || s.includes('حديث')) return true;
    return false;
  }, []);

  const isFavoriteItem = React.useCallback((item: DshStoreGetMenuItem) => {
    if ((item as any).isFavorite || (item as any).isFavorited) return true;
    const s = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
    if (s.includes('مفضل') || s.includes('مفضلة')) return true;
    // fallback: check tags or category label
    if (normalizeDisplayText(item.categoryLabel ?? '').toLowerCase().includes('مفضل')) return true;
    return false;
  }, []);

  const categories = React.useMemo(() => {
    const storeCategories = (store?.categories ?? []).filter((category) =>
      customerVisibleItems.some((item) => item.categoryId === category.id),
    );
    const popularCount = customerVisibleItems.filter((item) => {
      const status = normalizeDisplayText(item.statusLabel ?? '');
      return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
    }).length;

    const favoritesCount = customerVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id)).length;
    const newCount = customerVisibleItems.filter(isNewItem).length;
    const offersCount = customerVisibleItems.filter(isOfferItem).length;

    return [
      { id: 'all', label: 'جميع الأقسام', itemCount: customerVisibleItems.length, isPopular: true },
      { id: 'popular', label: 'الأكثر طلبًا', itemCount: popularCount || Math.min(customerVisibleItems.length, 4), isPopular: true },
      { id: 'favorites', label: 'المفضلة', itemCount: favoritesCount },
      { id: 'new', label: 'الجديدة', itemCount: newCount },
      { id: 'offers', label: 'العروض', itemCount: offersCount },
      ...storeCategories,
    ];
  }, [customerVisibleItems, store?.categories, isFavoriteItem, isNewItem, isOfferItem, favoriteIds]);

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

  // Staging preview (next card) shown while user drags
  const [stagingPreviewItem, setStagingPreviewItem] = React.useState<(DshStoreGetMenuItem & { partnerImageUri?: ImageSourcePropType | string }) | null>(null);
  const [stagingType, setStagingType] = React.useState<'category' | 'item' | null>(null);
  const [stagingSign, setStagingSign] = React.useState<number>(1);

  const STAGE_OFFSET_X = Dimensions.get('window').width + 220;
  const stageOffsetPosX = React.useRef(new Animated.Value(STAGE_OFFSET_X)).current;
  const stageOffsetNegX = React.useRef(new Animated.Value(-STAGE_OFFSET_X)).current;

  const STAGE_OFFSET_Y = Dimensions.get('window').height * 0.6;
  const stageOffsetPosY = React.useRef(new Animated.Value(STAGE_OFFSET_Y)).current;
  const stageOffsetNegY = React.useRef(new Animated.Value(-STAGE_OFFSET_Y)).current;

  // Throttle & prefetch helpers to avoid heavy work on every move event
  const lastStagingUpdateRef = React.useRef<number>(0);
  const STAGING_THROTTLE_MS = 90; // ms between staging updates
  const prefetchedUrisRef = React.useRef<Record<string, boolean>>({});
  const stagingIdRef = React.useRef<string | null>(null);

  const trySetStaging = React.useCallback((nextPreview: (DshStoreGetMenuItem & { partnerImageUri?: ImageSourcePropType | string }) | null, type: 'category' | 'item' | null, sign: number) => {
    const now = Date.now();
    if (!nextPreview) {
      stagingIdRef.current = null;
      try { setStagingPreviewItem(null); setStagingType(null); setStagingSign(1); } catch {}
      return;
    }

    if (stagingIdRef.current === nextPreview.id && stagingType === type) {
      return; // already staged
    }

    if (now - lastStagingUpdateRef.current < STAGING_THROTTLE_MS) {
      return; // throttle frequent moves
    }

    lastStagingUpdateRef.current = now;

    const uri = nextPreview.imageUri;
    if (uri && !prefetchedUrisRef.current[uri]) {
      // mark as prefetched to avoid repeating
      prefetchedUrisRef.current[uri] = true;
      // prefetch asynchronously then set staging (don't await on main thread)
      Image.prefetch(uri).finally(() => {
        stagingIdRef.current = nextPreview.id;
        try { setStagingPreviewItem(nextPreview); setStagingType(type); setStagingSign(sign); } catch {}
      });
    } else {
      stagingIdRef.current = nextPreview.id;
      try { setStagingPreviewItem(nextPreview); setStagingType(type); setStagingSign(sign); } catch {}
    }
  }, [stagingType]);

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
        return customerVisibleItems;
      }

      if (categoryId === 'popular') {
        const popularItems = customerVisibleItems.filter((item) => {
          const status = normalizeDisplayText(item.statusLabel ?? '');
          return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
        });

        return popularItems.length ? popularItems : customerVisibleItems.slice(0, Math.min(4, customerVisibleItems.length));
      }

      if (categoryId === 'favorites') {
        return customerVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id));
      }

      if (categoryId === 'new') {
        return customerVisibleItems.filter((item) => isNewItem(item));
      }

      if (categoryId === 'offers') {
        return customerVisibleItems.filter((item) => isOfferItem(item));
      }

      return customerVisibleItems.filter((item) => item.categoryId === categoryId);
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
  }, [customerVisibleItems, headerSearchQuery, isFavoriteItem, isNewItem, isOfferItem, favoriteIds]);

  const changeCategory = React.useCallback((newId: string) => {
    if (newId === selectedCategory) return;
    Animated.sequence([
      Animated.timing(transitionAnim, { toValue: 0.96, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setSelectedCategory(newId);
      // ensure list resets to top of new section
      try { listRef.current?.scrollToOffset({ offset: 0, animated: false }); } catch {}
      Animated.timing(transitionAnim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
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
    setPreviewItem({ ...nextItem, partnerImageUri: storeCoverImageSource });
  }, [previewCurrentIndex, previewItem, previewItems, storeCoverImageSource]);

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
      setPreviewItem({ ...nextCategoryItems[0], partnerImageUri: storeCoverImageSource });
    }
  }, [categories, changeCategory, resolveItemsForCategory, selectedCategory, storeCoverImageSource]);

  const previewPanResponder = React.useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 6 || Math.abs(dy) > 6;
      },
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 6 || Math.abs(dy) > 6;
      },
      onPanResponderGrant: () => {
        previewDrag.stopAnimation();
        // subtle lift when grabbing
        Animated.spring(previewScale, { toValue: 1.04, useNativeDriver: true, friction: 6, tension: 100 }).start();
        previewRotate.setValue(0);
      },
      onPanResponderMove: (_evt, gestureState) => {
        // more responsive movement multiplier for quicker feedback
        const dampX = gestureState.dx * 0.36;
        const dampY = gestureState.dy * 0.36;
        previewDrag.setValue({ x: dampX, y: dampY });
        // smaller, smoother rotation mapping
        previewRotate.setValue(gestureState.dx * 0.045);

        // staging logic: reveal next card immediately while dragging
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // horizontal staging
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
              const nextPreview = { ...nextCategoryItems[0], partnerImageUri: storeCoverImageSource } as (DshStoreGetMenuItem & { partnerImageUri?: ImageSourcePropType | string });
              trySetStaging(nextPreview, 'category', toLeft ? 1 : -1);
            } else {
              // clear staging if no candidate
              trySetStaging(null, null, 1);
            }
          } else if (stagingPreviewItem) {
            setStagingPreviewItem(null);
            setStagingType(null);
          }

        // vertical staging
        } else if (absDy > absDx && absDy > 8) {
          if (previewCurrentIndex !== -1) {
            const toUp = dy < 0;
            const candidateItemIndex = Math.max(0, Math.min(previewItems.length - 1, previewCurrentIndex + (toUp ? 1 : -1)));
            if (candidateItemIndex !== previewCurrentIndex) {
              const nextPreview = { ...previewItems[candidateItemIndex], partnerImageUri: storeCoverImageSource } as (DshStoreGetMenuItem & { partnerImageUri?: ImageSourcePropType | string });
              trySetStaging(nextPreview, 'item', toUp ? 1 : -1);
            } else {
              trySetStaging(null, null, 1);
            }
          }
        } else {
          // clear if movement is not directional enough
          trySetStaging(null, null, 1);
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

          Animated.timing(previewDrag.x, { toValue: offX, duration: outDuration, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
            try { movePreviewByCategoryOffset(dirOffset); } catch {}
            // place new card off-screen on opposite side and slide in quickly
            previewDrag.setValue({ x: -offX, y: 0 });
            Animated.parallel([
              Animated.timing(previewDrag.x, { toValue: 0, duration: Math.max(180, Math.floor(280 - speedAdj / 1.5)), easing: Easing.out(Easing.cubic), useNativeDriver: true }),
              Animated.spring(previewScale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 90 }),
              Animated.timing(previewRotate, { toValue: 0, duration: 180, useNativeDriver: true }),
            ]).start(() => { stagingIdRef.current = null; try { setStagingPreviewItem(null); setStagingType(null); } catch {} });
            try { Vibration.vibrate(8); } catch {}
          });
        };

        const performItemSwipe = (dirOffset: number, offY: number) => {
          const base = 260;
          const speedAdjY = Math.min(220, Math.abs(vy) * 300);
          const outDurationY = Math.max(120, Math.floor(base - speedAdjY));

          Animated.timing(previewDrag.y, { toValue: offY, duration: outDurationY, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
            movePreviewByItemOffset(dirOffset);
            previewDrag.setValue({ x: 0, y: -offY });
            Animated.parallel([
              Animated.timing(previewDrag.y, { toValue: 0, duration: Math.max(160, Math.floor(240 - speedAdjY / 1.5)), easing: Easing.out(Easing.cubic), useNativeDriver: true }),
              Animated.spring(previewScale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 90 }),
              Animated.timing(previewRotate, { toValue: 0, duration: 160, useNativeDriver: true }),
            ]).start(() => { stagingIdRef.current = null; try { setStagingPreviewItem(null); setStagingType(null); } catch {} });
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
            Animated.spring(previewDrag, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 7, tension: 90 }),
            Animated.spring(previewScale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 90 }),
            Animated.timing(previewRotate, { toValue: 0, duration: 160, useNativeDriver: true }),
          ]).start(() => { stagingIdRef.current = null; try { setStagingPreviewItem(null); setStagingType(null); } catch {} });
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(previewDrag, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 7, tension: 90 }),
          Animated.spring(previewScale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 90 }),
          Animated.timing(previewRotate, { toValue: 0, duration: 160, useNativeDriver: true }),
        ]).start(() => { stagingIdRef.current = null; try { setStagingPreviewItem(null); setStagingType(null); } catch {} });
      },
      onShouldBlockNativeResponder: () => true,
    }),
    [isRTL, movePreviewByCategoryOffset, movePreviewByItemOffset, previewDrag, categories, selectedCategory, previewItems, previewCurrentIndex, storeCoverImageSource, stagingPreviewItem, stagingType]
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

  const openMeasurementPicker = React.useCallback((item: DshStoreGetMenuItem, anchor: { x: number; y: number }) => {
    const options = resolveMeasurementOptions(item);
    setPickerItem(item);
    setPickerAnchor(anchor);
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
    if (!pickerItem) {
      return;
    }

    setAddedItemLabel(normalizeDisplayText(pickerItem!.name));
    closeMeasurementPicker();
    setCartToastVisible(true);
    setCartDecisionVisible(true);
  }, [pickerItem, closeMeasurementPicker]);

  const handleGoToCart = React.useCallback(() => {
    setCartDecisionVisible(false);
    setCartToastVisible(false);
    onOpenCart?.();
  }, [onOpenCart]);

  const handleContinueShopping = React.useCallback(() => {
    setCartDecisionVisible(false);
  }, []);

  if (state !== 'ready') {
    return <View style={styles.blockingState}>{renderNonReadyState(state, storeText, onRetry)}</View>;
  }

  if (!store) {
    return (
      <BthStateView
        stateId="blockingError"
        title={storeText.states.contextMissingTitle}
        description={storeText.states.contextMissingDescription}
      />
    );
  }

  const normalizedFollowersLabel = normalizeFollowersLabel(store.followersCount ?? store.followersLabel, storeText.get.followersSuffix);
  const normalizedPriceMatchLabel = normalizePriceMatchLabel(store.priceMatchLabel, storeText.get.priceMatch);
  const normalizedStoreName = normalizeDisplayText(store.name);
  const normalizedStoreSubtitle = normalizeDisplayText(store.subtitle);
  const normalizedEtaLabel = normalizeDisplayText(store.etaLabel);
  const handleStoreShare = React.useCallback(async () => {
    try {
      await Share.share({
        title: normalizedStoreName,
        message: `${normalizedStoreName} • ${normalizedStoreSubtitle}`,
      });
    } catch {
      // no-op: sharing can be dismissed by the user
    }
  }, [normalizedStoreName, normalizedStoreSubtitle]);

  const benefitChips = Array.from(
    new Set(
      [
        store.hasBthwaniPro ? 'بثواني برو' : null,
        ...(store.subscriptionPackageChips ?? []),
        store.deliveryLabel ?? null,
        store.serviceLabel ?? null,
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 3);

  const firstVisibleItem = React.useMemo(
    () => visibleItems[0] ?? customerVisibleItems[0] ?? null,
    [customerVisibleItems, visibleItems],
  );

  const firstOfferItem = React.useMemo(
    () => visibleItems.find((item) => isOfferItem(item)) ?? customerVisibleItems.find((item) => isOfferItem(item)) ?? firstVisibleItem,
    [customerVisibleItems, firstVisibleItem, isOfferItem, visibleItems],
  );

  const firstNewItem = React.useMemo(
    () => visibleItems.find((item) => isNewItem(item)) ?? customerVisibleItems.find((item) => isNewItem(item)) ?? firstVisibleItem,
    [customerVisibleItems, firstVisibleItem, isNewItem, visibleItems],
  );

  const openStoreItemPreview = React.useCallback((item?: DshStoreGetMenuItem | null) => {
    if (!item) {
      return;
    }

    openImagePreview(item, store.imageUri);
  }, [openImagePreview, store.imageUri]);

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

  const smartRailItems = React.useMemo(() => {
    const featureImages = menuItems.map((item) => resolveDshStoreMenuItemImageSource(item));
    const pickFeatureImage = (index: number) => featureImages[index] ?? resolveDshStoreCoverImageSource(store);

    const storeDriven = [
      firstVisibleItem
        ? {
            id: `${store.id}-entry`,
            title: 'وصل حديثاً',
            subtitle: normalizedPriceMatchLabel,
            badge: getStatusLabel(store.statusLabel, storeText),
            image: pickFeatureImage(0),
            emoji: '🔥',
            cta: 'معاينة',
            onPress: () => openStoreItemPreview(firstVisibleItem),
          }
        : null,
      firstOfferItem
        ? {
            id: `${store.id}-social`,
            title: 'موصى به',
            subtitle: normalizedFollowersLabel ?? 'الأكثر تفاعلاً في هذا المتجر',
            badge: 'رائج',
            image: pickFeatureImage(1),
            emoji: '⭐',
            cta: 'افتح',
            onPress: () => openStoreItemPreview(firstOfferItem),
          }
        : null,
      firstNewItem && firstNewItem.id !== firstVisibleItem?.id && firstNewItem.id !== firstOfferItem?.id
        ? {
            id: `${store.id}-new`,
            title: 'الجديد الآن',
            subtitle: 'استعرض أحدث العناصر داخل المتجر',
            badge: 'جديد',
            image: pickFeatureImage(2),
            emoji: '🆕',
            cta: 'صفِّ',
            onPress: () => changeCategory('new'),
          }
        : null,
      ...(benefitChips ?? []).slice(0, 3).map((chip, index) => ({
        id: `${store.id}-benefit-${index}`,
        title: normalizeTagLabel(chip, storeText),
        subtitle: 'ميزة مرتبطة بهذا المتجر',
        badge: chip.includes('برو') || chip.includes('أولوية') ? 'اشتراك' : chip.includes('كوبون') || chip.includes('خصم') || chip.includes('عرض') ? 'عرض' : 'ميزة',
        image: pickFeatureImage(index + 3),
        emoji: chip.includes('برو') || chip.includes('أولوية') ? '⭐' : chip.includes('كوبون') || chip.includes('خصم') || chip.includes('عرض') ? '💸' : '✨',
        cta: 'افتح',
        onPress: () => resolveFeaturePress(chip),
      })),
    ].filter(Boolean) as Array<{ id: string; title: string; subtitle: string; badge?: string; cta?: string; image?: string; emoji?: string; onPress?: () => void }>;

    const productDriven = menuItems
      .filter((item) => item.isAvailable !== false)
      .slice(0, 12)
      .map((item) => ({
        id: `product-${item.id}`,
        title: normalizeDisplayText(item.name),
        subtitle: normalizeDisplayText(item.statusLabel ?? item.subtitle),
        badge: normalizeDisplayText(item.categoryLabel),
        image: resolveDshStoreMenuItemImageSource(item),
        emoji: getItemEmoji(item),
        cta: 'تفاصيل',
        onPress: () => openStoreItemPreview(item),
      }));

    return [...storeDriven, ...productDriven].slice(0, 15);
  }, [benefitChips, changeCategory, firstNewItem, firstOfferItem, firstVisibleItem, menuItems, normalizedFollowersLabel, normalizedPriceMatchLabel, openStoreItemPreview, resolveFeaturePress, store, storeText]);

  return (
    <View style={styles.screen}>
      {headerSearchVisible ? (
        <View style={styles.inlineSearchShell}>
          <View style={[styles.inlineSearchRow, isRTL && styles.rowReverse]}>
            <TouchableOpacity
              style={styles.inlineSearchCloseButton}
              onPress={closeInlineSearch}
              activeOpacity={0.85}
            >
              <Ionicons name="close-outline" size={20} color={stylesTokens.dark} />
            </TouchableOpacity>

            <View style={styles.inlineSearchFieldWrap}>
              <Ionicons name="search-outline" size={18} color={stylesTokens.orange} />
              <TextInput
                value={headerSearchQuery}
                onChangeText={setHeaderSearchQuery}
                placeholder={`ابحث داخل ${normalizedStoreName}`}
                placeholderTextColor="#94a3b8"
                style={styles.inlineSearchInput}
                autoFocus
                returnKeyType="search"
                textAlign="right"
              />
            </View>
          </View>

          <Text style={[styles.inlineSearchHint, isRTL && styles.textAlignRight]}>
            {`بحث محلي داخل ${normalizedStoreName} فقط للوصول السريع إلى الأصناف.`}
          </Text>
        </View>
      ) : (
        <BthMobileTopBar
          title={normalizedStoreName}
          actions={[
            {
              id: 'share',
              icon: <Ionicons name="share-social-outline" size={20} color={stylesTokens.dark} />,
              accessibilityLabel: 'مشاركة المتجر',
              onPress: handleStoreShare,
            },
            {
              id: 'cart',
              icon: <Ionicons name="cart-outline" size={20} color={stylesTokens.dark} />,
              accessibilityLabel: 'السلة',
              onPress: onOpenCart ?? onOpenItems,
            },
            {
              id: 'search',
              icon: <Ionicons name="search-outline" size={20} color={stylesTokens.dark} />,
              accessibilityLabel: 'بحث',
              onPress: openInlineSearch,
            },
          ]}
          trailingAction={{
            id: 'back',
            icon: <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={stylesTokens.orange} />,
            accessibilityLabel: 'رجوع',
            onPress: onBack,
          }}
        />
      )}

        <View style={styles.feedSection}>
          <Animated.View style={[styles.feedList, { opacity: transitionAnim, transform: [{ scale: transitionAnim }] }]} {...panResponder.panHandlers}>
            <Animated.FlatList
              ref={(r) => { listRef.current = r as unknown as FlatList<DshStoreGetMenuItem> | null; }}
              data={visibleItems as DshStoreGetMenuItem[]}
              keyExtractor={(item) => (item as DshStoreGetMenuItem).id}
              ListHeaderComponent={
                <>
                  <View style={styles.heroCard}>
                    <View style={styles.heroGlowOrb} />

                    <View style={[styles.heroIdentityRow, isRTL && styles.rowReverse]}>
                      <View style={styles.heroAvatar}>
                        <Ionicons name="storefront-outline" size={24} color={stylesTokens.orange} />
                        {store ? <Image source={resolveDshStoreCoverImageSource(store)} style={styles.heroAvatarImage} /> : null}
                      </View>

                      <View style={[styles.heroIdentityContent, isRTL && styles.heroIdentityContentRTL]}>
                        <View style={[styles.heroTopRow, isRTL && styles.rowReverse]}>
                          <View style={[styles.heroTitleInfo, isRTL && styles.heroTitleInfoRTL]}>
                            <Text style={[styles.heroInlineName, isRTL && styles.textAlignRight]} numberOfLines={1}>
                              {normalizedStoreName}
                            </Text>
                            <Text style={[styles.heroInlineSubtitle, isRTL && styles.textAlignRight]} numberOfLines={1}>
                              {normalizedStoreSubtitle}
                            </Text>
                          </View>

                          <View style={styles.heroBadgePrimary}>
                            <Text style={styles.heroBadgePrimaryText}>{getStatusLabel(store.statusLabel, storeText)}</Text>
                          </View>
                        </View>

                        <View style={[styles.heroCompactMetaRow, isRTL && styles.rowReverse]}>
                          {normalizedFollowersLabel ? (
                            <TouchableOpacity
                              style={[styles.topMetaChip, styles.followMetaChip, isFollowingStore && styles.followMetaChipActive]}
                              activeOpacity={0.85}
                              onPress={() => setIsFollowingStore((prev) => !prev)}
                              accessibilityRole="button"
                              accessibilityLabel={isFollowingStore ? 'تمت المتابعة' : 'متابعة المتجر'}
                            >
                              <Ionicons
                                name={isFollowingStore ? 'checkmark' : 'add'}
                                size={13}
                                color={isFollowingStore ? stylesTokens.white : stylesTokens.orange}
                              />
                              <Text style={[styles.topMetaChipText, isFollowingStore && styles.followMetaChipTextActive]}>
                                {normalizedFollowersLabel}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          <View style={styles.topMetaChip}>
                            <Ionicons name="time-outline" size={13} color={stylesTokens.orange} />
                            <Text style={styles.topMetaChipText}>{normalizedEtaLabel}</Text>
                          </View>
                          <View style={styles.topMetaChip}>
                            <Ionicons name="star" size={13} color="#f59e0b" />
                            <Text style={styles.topMetaChipText}>{storeText.get.ratingValue}</Text>
                          </View>
                        </View>

                        {benefitChips.length ? (
                          <View style={styles.subscriptionBlock}>
                            <View style={[styles.tagRow, isRTL && styles.rowReverse]}>
                              {benefitChips.map((chip) => {
                                const isPrimaryBenefit = chip.includes('برو') || chip.includes('مجاني');
                                return (
                                  <View key={`${store.id}-${chip}`} style={[styles.tagChip, isPrimaryBenefit && styles.tagChipAccent]}>
                                    <Ionicons
                                      name={isPrimaryBenefit ? 'sparkles-outline' : 'checkmark-circle-outline'}
                                      size={11}
                                      color={isPrimaryBenefit ? stylesTokens.white : stylesTokens.orange}
                                    />
                                    <Text style={[styles.tagChipText, isPrimaryBenefit && styles.tagChipTextAccent]}>{chip}</Text>
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.deliveryControlCluster}>
                      <View style={styles.modeStripWrapInline}>
                        <View style={[styles.modeStrip, isRTL && styles.rowReverse]}>
                          {deliveryModes.map((mode) => (
                            <ModePill
                              key={mode.id}
                              label={mode.label}
                              icon={mode.icon}
                              active={selectedMode === mode.id}
                              onPress={() => setSelectedMode(mode.id)}
                            />
                          ))}
                        </View>
                      </View>

                      {smartRailItems.length ? (
                        <BthHighlightsRail
                          items={smartRailItems}
                          maxItems={15}
                          variant="mediaCompact"
                          style={styles.smartRailSection}
                        />
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.sectionBlock}>
                    <ScrollView
                      horizontal
                      ref={(r) => { chipsScrollRef.current = r; }}
                      onLayout={(e) => setChipsContainerWidth(e.nativeEvent.layout.width)}
                      showsHorizontalScrollIndicator={false}
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
                            <BthChip
                              label={`${normalizeDisplayText(category.label)} ${CATEGORY_ICON[category.id] ?? '•'}`}
                              selected={selected}
                              tone="brand"
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
                            isRTL={isRTL}
                            labels={itemLabels}
                            partnerImageUri={storeCoverImageSource}
                            onAddPress={(anchor) => openMeasurementPicker(item, anchor ?? { x: 32, y: 360 })}
                            onImagePress={(it) => openImagePreview(it, storeCoverImageSource)}
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
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
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

      <BthToast
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
          <View style={styles.cartDecisionCard} pointerEvents="box-none">
            <Text style={styles.cartDecisionTitle}>تمت الإضافة للسلة</Text>
            <Text style={styles.cartDecisionSubtitle}>{addedItemLabel ? `${addedItemLabel} أضيفت بنجاح إلى السلة.` : 'تمت الإضافة إلى السلة بنجاح.'}</Text>
            <View style={styles.cartDecisionActions}>
              <BthButton label="انتقال للسلة" tone="primary" fullWidth onPress={handleGoToCart} />
              <BthButton label="متابعة التسوق" tone="secondary" fullWidth onPress={handleContinueShopping} />
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal visible={Boolean(previewItem)} transparent animationType="fade" onRequestClose={closeImagePreview}>
        <View style={styles.previewOverlay}>
          <Pressable style={styles.previewBackdrop} onPress={closeImagePreview} />
          <View style={styles.previewWrap} pointerEvents="box-none">
            {stagingPreviewItem ? (
              (() => {
                // choose appropriate offset node for staging transform
                const stageX = stagingSign === 1 ? stageOffsetPosX : stageOffsetNegX;
                const stageY = stagingSign === 1 ? stageOffsetPosY : stageOffsetNegY;
                const stageTranslateX = Animated.add(previewDrag.x, stageX);
                const stageTranslateY = Animated.add(previewDrag.y, stageY);
                const stageOpacity = stagingType === 'category'
                  ? previewDrag.x.interpolate({ inputRange: stagingSign === 1 ? [-24, 0] : [0, 24], outputRange: [1, 0], extrapolate: 'clamp' })
                  : previewDrag.y.interpolate({ inputRange: stagingSign === 1 ? [-24, 0] : [0, 24], outputRange: [1, 0], extrapolate: 'clamp' });

                return (
                  <Animated.View
                    pointerEvents="none"
                    collapsable={false}
                    style={[
                      styles.previewCard,
                      { position: 'absolute', left: 0, right: 0, zIndex: 1, opacity: stageOpacity, transform: stagingType === 'category' ? [{ translateX: stageTranslateX }] : [{ translateY: stageTranslateY }] },
                    ]}
                  >
                    <View style={styles.previewImageWrap} pointerEvents="box-none">
                      <View style={styles.previewPartnerTile} pointerEvents="box-none">
                        {store ? (
                          <Image source={resolveDshStoreCoverImageSource(store)} style={styles.previewPartnerImage} />
                        ) : (
                          <Ionicons name="storefront-outline" size={20} color={stylesTokens.orange} />
                        )}
                      </View>

                      <Text style={styles.previewEmoji}>{getItemEmoji(stagingPreviewItem)}</Text>

                      <Image
                        source={resolveDshStoreMenuItemImageSource(stagingPreviewItem)}
                        style={styles.previewImage}
                      />

                      {
                        (() => {
                          const overlayColor = getOverlayColor(normalizeDisplayText(stagingPreviewItem.name), 0.86);
                          return (
                            <View style={[styles.previewDetailsBox, { backgroundColor: overlayColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}> 
                              <View style={[styles.previewDetailsContent, isRTL ? styles.previewDetailsContentRTL : null]}>
                                {store ? <Text style={[styles.previewStoreName, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizedStoreName}</Text> : null}
                                <Text style={[styles.previewDetailsTitle, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(stagingPreviewItem.name)}</Text>
                                {stagingPreviewItem.subtitle ? <Text style={[styles.previewDetailsSubtitle, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(stagingPreviewItem.subtitle)}</Text> : null}

                                <View style={[styles.previewDetailsMetaRow, isRTL ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                                  {stagingPreviewItem.priceLabel ? <Text style={[styles.previewDetailsPrice, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(stagingPreviewItem.priceLabel)}</Text> : null}
                                  {stagingPreviewItem.discountLabel ? <Text style={[styles.previewDetailsDiscount, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(stagingPreviewItem.discountLabel)}</Text> : null}
                                </View>
                              </View>

                              <View style={[styles.previewDetailsFavoriteButton, { opacity: 0.95 }]}>
                                <Ionicons name={favoriteIds.has(stagingPreviewItem.id) ? 'heart' : 'heart-outline'} size={18} color={stylesTokens.orange} />
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
                <View style={styles.previewSwipeLayer} pointerEvents="auto" {...previewPanResponder.panHandlers} />
                <View style={styles.previewImageWrap} pointerEvents="box-none">
                  <View style={styles.previewPartnerTile} pointerEvents="box-none">
                    {store ? (
                      <Image source={resolveDshStoreCoverImageSource(store)} style={styles.previewPartnerImage} />
                    ) : (
                      <Ionicons name="storefront-outline" size={20} color={stylesTokens.orange} />
                    )}
                  </View>

                  <Text style={styles.previewEmoji}>{getItemEmoji(previewItem!)}</Text>

                  <Image
                    source={resolveDshStoreMenuItemImageSource(previewItem!)}
                    style={styles.previewImage}
                  />

                  {
                    (() => {
                      const overlayColor = getOverlayColor(normalizeDisplayText(previewItem!.name), 0.86);
                      return (
                        <View style={[styles.previewDetailsBox, { backgroundColor: overlayColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}> 
                          <View style={[styles.previewDetailsContent, isRTL ? styles.previewDetailsContentRTL : null]}>
                            {store ? <Text style={[styles.previewStoreName, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizedStoreName}</Text> : null}
                            <Text style={[styles.previewDetailsTitle, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.name)}</Text>
                            {previewItem!.subtitle ? <Text style={[styles.previewDetailsSubtitle, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.subtitle)}</Text> : null}

                            <View style={[styles.previewDetailsMetaRow, isRTL ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                              {previewItem!.priceLabel ? <Text style={[styles.previewDetailsPrice, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.priceLabel)}</Text> : null}
                              {previewItem!.discountLabel ? <Text style={[styles.previewDetailsDiscount, isRTL && styles.textAlignRight]} numberOfLines={1}>{normalizeDisplayText(previewItem!.discountLabel)}</Text> : null}
                            </View>
                          </View>

                          <TouchableOpacity style={styles.previewDetailsFavoriteButton} activeOpacity={0.9} onPress={() => handleToggleFavorite(previewItem!.id)}>
                            <Ionicons name={favoriteIds.has(previewItem!.id) ? 'heart' : 'heart-outline'} size={18} color={stylesTokens.orange} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.menuActionBadge, styles.previewActionButton]}
                            activeOpacity={0.85}
                            onPress={() => handlePreviewAddToCart()}
                          >
                            <Ionicons name="cart-outline" size={18} color={stylesTokens.white} />
                            <View style={styles.menuActionPlusBadge}>
                              <Ionicons name="add" size={10} color={stylesTokens.orange} />
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
        <Pressable style={styles.measureOverlay} onPress={closeMeasurementPicker}>
          <View style={[styles.measurePopoverWrap, { top: measurePopoverTop }]} pointerEvents="box-none">
            <View style={styles.measurePopoverDock}>
              <View style={styles.measureOriginBubble}>
                <Ionicons name="cart-outline" size={18} color={stylesTokens.white} />
                <View style={styles.measureOriginPlusBadge}>
                  <Ionicons name="add" size={10} color={stylesTokens.orange} />
                </View>
              </View>

              <Pressable style={styles.measurePopoverCard} onPress={(event) => event.stopPropagation()}>
                {pickerItem ? (
                  <>
                    <View style={styles.measurePopoverHeader}>
                      <Text style={styles.measureSheetTitle}>{normalizeDisplayText(pickerItem!.name)}</Text>
                    </View>

                    <View style={styles.measureOptionsGrid}>
                      {activeMeasurementOptions.map((option) => {
                        const selected = selectedMeasureOption === option;
                        const optionPrice = formatCurrencyValue(resolveMeasurementUnitPrice(pickerItem!, option));
                        return (
                          <TouchableOpacity
                            key={option}
                            style={[styles.measureOptionChip, selected && styles.measureOptionChipActive]}
                            activeOpacity={0.88}
                            onPress={() => setSelectedMeasureOption(option)}
                          >
                            <Text style={[styles.measureOptionText, selected && styles.measureOptionTextActive]}>{option}</Text>
                            <Text style={[styles.measureOptionPriceText, selected && styles.measureOptionPriceTextActive]}>{optionPrice}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={styles.measureQtyRow}>
                      <TouchableOpacity
                        style={styles.measureQtyGhostButton}
                        activeOpacity={0.85}
                        onPress={() => setSelectedMeasureQty((current) => Math.max(1, current - 1))}
                      >
                        <Ionicons name="remove" size={18} color="#8a94a6" />
                      </TouchableOpacity>

                      <View style={styles.measureQtyValuePill}>
                        <Text style={styles.measureQtyValueText}>{selectedMeasureQty}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.measureQtyPrimaryButton}
                        activeOpacity={0.9}
                        onPress={() => setSelectedMeasureQty((current) => current + 1)}
                      >
                        <Ionicons name="add" size={18} color={stylesTokens.white} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.measureFooterBar}>
                      <View style={styles.measurePriceValueBox}>
                        <Text style={styles.measurePriceValueText}>{formatCurrencyValue(selectedMeasureTotalPrice || selectedMeasureUnitPrice)}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.measureConfirmButton}
                        activeOpacity={0.9}
                        onPress={handleAddToCart}
                      >
                        <Text style={styles.measureConfirmText}>أضف للسلة</Text>
                        <Ionicons name="cart-outline" size={16} color={stylesTokens.white} />
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
  white: colorPalette.white,
  dark: colorPalette.ink,
  muted: colorPalette.inkMuted,
  light: colorPalette.surfaceAlt,
  line: colorPalette.line,
  chip: colorPalette.surfaceInset,
  chipText: colorPalette.inkMuted,
  green: colorPalette.success,
  blue: colorPalette.infoStrong,
  red: colorPalette.danger,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  blockingState: {
    flex: 1,
    backgroundColor: '#f7f8fb',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f7f8fb',
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
    borderColor: '#edf0f5',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
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
    borderColor: '#fde7cf',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
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
    borderColor: '#fed7aa',
    backgroundColor: '#fffaf5',
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9edf3',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
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
    color: '#1b2430',
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
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
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
    gap: 4,
    backgroundColor: stylesTokens.white,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e8ebf0',
  },
  topMetaChipText: {
    color: stylesTokens.dark,
    fontSize: 10.5,
    fontWeight: '700',
  },
  followMetaChip: {
    backgroundColor: '#fffaf5',
    borderColor: '#fed7aa',
  },
  followMetaChipActive: {
    backgroundColor: stylesTokens.orange,
    borderColor: stylesTokens.orange,
  },
  followMetaChipTextActive: {
    color: stylesTokens.white,
  },
  headerMetaText: {
    color: stylesTokens.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bbf7d0',
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

  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: 2,
    marginHorizontal: 0,
    width: '100%',
    backgroundColor: stylesTokens.white,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroGlowOrb: {
    position: 'absolute',
    top: -10,
    left: -8,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(249,115,22,0.08)',
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
    borderColor: '#fed7aa',
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
  heroCompactMetaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  heroBadgePrimary: {
    backgroundColor: '#ff6a00',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgePrimaryText: {
    color: stylesTokens.white,
    fontSize: 11,
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
    color: '#cbd5e1',
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
    marginTop: 0,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: stylesTokens.light,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: stylesTokens.line,
  },
  heroStatValue: {
    color: stylesTokens.dark,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
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
    gap: 6,
    justifyContent: 'flex-end',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff7ed',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagChipAccent: {
    backgroundColor: stylesTokens.orange,
    borderColor: stylesTokens.orange,
  },
  tagChipText: {
    color: stylesTokens.orange,
    fontSize: 11,
    fontWeight: '800',
  },
  tagChipTextAccent: {
    color: stylesTokens.white,
  },
  modeStripWrapInline: {
    marginTop: 0,
  },
  modeStrip: {
    backgroundColor: stylesTokens.light,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 999,
    padding: 4,
    gap: 6,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.orange,
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  modePill: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPillSelected: {
    backgroundColor: '#fff7ed',
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
        shadowColor: '#000',
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
    borderColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
  },
  previewOverlay: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.54)',
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
  previewSwipeLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  previewImageWrap: {
    width: '100%',
    height: 420,
    backgroundColor: stylesTokens.light,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewPartnerTile: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 56,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewPartnerImage: {
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
    borderColor: '#fed7aa',
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
    borderColor: '#fed7aa',
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
    borderColor: '#fff7ed',
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
    borderColor: '#fed7aa',
  },
  measurePopoverCard: {
    flex: 1,
    maxWidth: 280,
    backgroundColor: stylesTokens.white,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d9e0ea',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
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
    borderColor: '#d9e0ea',
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
    color: '#fff7ed',
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d9e0ea',
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
    borderColor: '#ffb35c',
  },
  measureQtyValuePill: {
    minWidth: 56,
    height: 38,
    borderRadius: 16,
    backgroundColor: '#fffaf5',
    borderWidth: 1,
    borderColor: '#fed7aa',
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
    borderColor: '#d9e0ea',
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
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
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
    borderColor: '#d9e0ea',
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
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
  menuBody: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: 'flex-start',
    gap: 3,
    alignItems: 'flex-end',
  },
  menuBodyRTL: {
    alignItems: 'flex-end',
  },
  menuInfoZone: {
    width: '100%',
    minHeight: 50,
    justifyContent: 'flex-start',
    gap: 1,
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  menuCommerceZone: {
    width: '100%',
    justifyContent: 'flex-start',
    gap: 1,
    alignItems: 'flex-end',
    marginTop: 0,
    flexShrink: 1,
  },
  menuTitle: {
    color: stylesTokens.dark,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  menuSubtitle: {
    color: stylesTokens.muted,
    fontSize: 11.5,
    marginTop: 1,
    lineHeight: 15,
  },
  menuTimingRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    gap: 4,
    flexWrap: 'wrap',
  },
  menuPriceRow: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    gap: 6,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  menuPrice: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
  },
  menuOldPrice: {
    color: stylesTokens.muted,
    fontSize: 10.5,
    fontWeight: '700',
    textDecorationLine: 'line-through',
  },
  discountChip: {
    backgroundColor: '#fef2f2',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  discountChipText: {
    color: '#dc2626',
    fontSize: 10,
    fontWeight: '900',
  },
  menuPrep: {
    color: stylesTokens.muted,
    fontSize: 10.5,
    fontWeight: '600',
  },
  menuDiscountRow: {
    marginTop: 0,
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuChipRow: {
    marginTop: 0,
    width: '100%',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  smallChipPrimary: {
    backgroundColor: stylesTokens.orangeSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  smallChipPrimaryText: {
    color: stylesTokens.orange,
    fontSize: 11,
    fontWeight: '800',
  },
  smallChipLight: {
    backgroundColor: stylesTokens.chip,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  smallChipLightText: {
    color: stylesTokens.chipText,
    fontSize: 11,
    fontWeight: '700',
  },
  smallChipDanger: {
    backgroundColor: '#fef2f2',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallChipDangerText: {
    color: stylesTokens.red,
    fontSize: 11,
    fontWeight: '700',
  },
  menuImageWrap: {
    width: 176,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  menuImageCard: {
    flex: 1,
    width: '100%',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#f3f4f6',
    borderWidth: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  menuPartnerTile: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 44,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    zIndex: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuPartnerTileImage: {
    width: '100%',
    height: '100%',
  },
  menuEmoji: {
    fontSize: 48,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    end: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
    zIndex: 3,
  },

  menuImagePressable: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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


