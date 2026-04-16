import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BthChip, BthHighlightsRail, BthStateView, BthText, colorPalette, useDirection, useUiText } from '@bthwani/ui-kit';
import { dshCategoryMeasurementPolicies } from '../../../../control-panel/catalogs/dsh/catalog';

export type DshStoreGetMenuItem = {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
  imageUri?: string;
};

export type DshStoreGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    etaLabel: string;
    deliveryFeeLabel: string;
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

function normalizeFollowersLabel(label: string | undefined, suffix: string) {
  if (!label) {
    return undefined;
  }

  const digits = label.match(/[\d.,]+/g)?.join('')?.trim();
  if (!digits) {
    return label;
  }

  const numericValue = Number(digits.replace(/,/g, ''));
  if (Number.isFinite(numericValue) && numericValue >= 1000) {
    const compactValue = Number.isInteger(numericValue / 1000)
      ? `${numericValue / 1000}`
      : `${(numericValue / 1000).toFixed(1).replace(/\.0$/, '')}`;
    return `${compactValue} ألف`;
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
    .replace(/Olaya Fresh Market/gi, 'أسواق العليا الطازجة')
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
    .replace(/\bSAR\b/gi, 'ر.س')
    .replace(/\s{2,}/g, ' ')
    .trim();
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

function formatCurrencyValue(value: number) {
  const normalized = value % 1 === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  return `${normalized} ر.س`;
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
}: {
  item: DshStoreGetMenuItem;
  isRTL: boolean;
  labels: { available: string; options: string; unavailable: string };
  partnerImageUri?: string;
  onAddPress?: (anchor: { x: number; y: number }) => void;
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
              <Image source={{ uri: partnerImageUri }} style={styles.menuPartnerTileImage} />
            ) : (
              <Ionicons name="storefront-outline" size={16} color={stylesTokens.orange} />
            )}
          </View>
          <Text style={styles.menuEmoji}>{getItemEmoji(item)}</Text>
          {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.menuImage} /> : null}
          <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.85}>
            <Ionicons name="heart" size={18} color={stylesTokens.orange} />
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

          <View style={[styles.menuChipRow, isRTL && styles.rowReverse]}>
            {normalizedDiscount ? (
              <View style={styles.discountChip}>
                <Text style={styles.discountChipText}>{normalizedDiscount}</Text>
              </View>
            ) : null}
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

  const deliveryModes = React.useMemo(() => getDeliveryModes(storeText), [storeText]);
  const itemLabels = React.useMemo(
    () => ({
      available: storeText.items.available,
      options: storeText.items.options,
      unavailable: storeText.items.unavailable,
    }),
    [storeText],
  );

  const customerVisibleItems = React.useMemo(
    () => menuItems.filter((item) => item.isAvailable !== false),
    [menuItems],
  );

  const categories = React.useMemo(() => {
    const storeCategories = (store?.categories ?? []).filter((category) =>
      customerVisibleItems.some((item) => item.categoryId === category.id),
    );
    const popularCount = customerVisibleItems.filter((item) => {
      const status = normalizeDisplayText(item.statusLabel ?? '');
      return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
    }).length;

    return [
      { id: 'all', label: 'جميع الأقسام', itemCount: customerVisibleItems.length, isPopular: true },
      { id: 'popular', label: 'الأكثر طلبًا', itemCount: popularCount || Math.min(customerVisibleItems.length, 4), isPopular: true },
      ...storeCategories,
    ];
  }, [customerVisibleItems, store?.categories]);

  const visibleItems = React.useMemo(() => {
    const scopedItems = (() => {
      if (selectedCategory === 'all') {
        return customerVisibleItems;
      }

      if (selectedCategory === 'popular') {
        const popularItems = customerVisibleItems.filter((item) => {
          const status = normalizeDisplayText(item.statusLabel ?? '');
          return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
        });

        return popularItems.length ? popularItems : customerVisibleItems.slice(0, Math.min(4, customerVisibleItems.length));
      }

      return customerVisibleItems.filter((item) => item.categoryId === selectedCategory);
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
  }, [customerVisibleItems, selectedCategory, headerSearchQuery]);

  const activeMeasurementOptions = React.useMemo(
    () => (pickerItem ? resolveMeasurementOptions(pickerItem) : []),
    [pickerItem],
  );

  const selectedMeasureUnitPrice = React.useMemo(() => {
    if (!pickerItem || !selectedMeasureOption) {
      return 0;
    }

    return resolveMeasurementUnitPrice(pickerItem, selectedMeasureOption);
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

  const normalizedFollowersLabel = normalizeFollowersLabel(store.followersLabel, storeText.get.followersSuffix);
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

  const smartRailItems = React.useMemo(() => {
    const featureImages = menuItems.map((item) => item.imageUri).filter((image): image is string => Boolean(image));
    const pickFeatureImage = (index: number) => featureImages[index] ?? store.imageUri;

    const storeDriven = [
      {
        id: `${store.id}-entry`,
        title: 'وصل حديثاً',
        subtitle: normalizedPriceMatchLabel,
        badge: getStatusLabel(store.statusLabel, storeText),
        image: pickFeatureImage(0),
        emoji: '🔥',
        onPress: onOpenItems,
      },
      normalizedFollowersLabel
        ? {
            id: `${store.id}-social`,
            title: 'موصى به',
            subtitle: normalizedFollowersLabel,
            badge: 'رائج',
            image: pickFeatureImage(1),
            emoji: '⭐',
            onPress: onOpenItems,
          }
        : null,
      ...(store.tags ?? []).slice(0, 2).map((tag, index) => ({
        id: `${store.id}-tag-${index}`,
        title: normalizeTagLabel(tag, storeText),
        subtitle: 'ميزة مفعلة داخل المتجر',
        badge: 'ميزة',
        image: pickFeatureImage(index + 2),
        emoji: '✨',
        onPress: onSupport,
      })),
    ].filter(Boolean) as Array<{ id: string; title: string; subtitle: string; badge?: string; image?: string; emoji?: string; onPress?: () => void }>;

    const productDriven = menuItems
      .filter((item) => item.isAvailable !== false)
      .slice(0, 12)
      .map((item) => ({
        id: `product-${item.id}`,
        title: normalizeDisplayText(item.name),
        subtitle: normalizeDisplayText(item.statusLabel ?? item.subtitle),
        badge: normalizeDisplayText(item.categoryLabel),
        image: item.imageUri ?? store.imageUri,
        emoji: getItemEmoji(item),
        onPress: onOpenItems,
      }));

    return [...storeDriven, ...productDriven].slice(0, 15);
  }, [menuItems, normalizedFollowersLabel, normalizedPriceMatchLabel, onOpenItems, onSupport, store.id, store.imageUri, store.statusLabel, store.tags, storeText]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topChrome}>
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
            <View style={styles.topChromeRow}>
              <View style={styles.headerEdgeSlot}>
                <View style={styles.actionsRow}>
                  <IconActionButton icon="share-social-outline" onPress={handleStoreShare} />
                  <IconActionButton icon="cart-outline" onPress={onOpenCart ?? onOpenItems} />
                  <IconActionButton icon="search-outline" onPress={openInlineSearch} />
                </View>
              </View>

              <View style={styles.titleBlock} pointerEvents="none">
                <Text style={styles.storeName} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82}>
                  {normalizedStoreName}
                </Text>
              </View>

              <View style={[styles.headerEdgeSlot, styles.headerEdgeSlotEnd]}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={onBack}
                  activeOpacity={0.8}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={stylesTokens.orange} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlowOrb} />

          <View style={[styles.heroIdentityRow, isRTL && styles.rowReverse]}>
            <View style={styles.heroAvatar}>
              <Ionicons name="storefront-outline" size={24} color={stylesTokens.orange} />
              {store.imageUri ? <Image source={{ uri: store.imageUri }} style={styles.heroAvatarImage} /> : null}
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
                  <View style={styles.topMetaChip}>
                    <Ionicons name="people-outline" size={13} color={stylesTokens.orange} />
                    <Text style={styles.topMetaChipText}>{normalizedFollowersLabel}</Text>
                  </View>
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
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoryRow, isRTL && styles.rowReverse]}
          >
            {categories.map((category) => {
              const selected = selectedCategory === category.id;
              return (
                <BthChip
                  key={category.id}
                  label={`${normalizeDisplayText(category.label)} ${CATEGORY_ICON[category.id] ?? '•'}`}
                  selected={selected}
                  tone="brand"
                  onPress={() => setSelectedCategory(category.id)}
                />
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.feedSection}>
          <View style={styles.feedList}>
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  isRTL={isRTL}
                  labels={itemLabels}
                  partnerImageUri={store.imageUri}
                  onAddPress={(anchor) => openMeasurementPicker(item, anchor)}
                />
              ))
            ) : (
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
            )}
          </View>
        </View>


      </ScrollView>

      <Modal visible={Boolean(pickerItem)} transparent animationType="fade" onRequestClose={closeMeasurementPicker}>
        <Pressable style={styles.measureOverlay} onPress={closeMeasurementPicker}>
          <View style={[styles.measurePopoverWrap, { top: measurePopoverTop }]} pointerEvents="box-none">
            <View style={styles.measurePopoverDock}>
              <View style={styles.measureOriginBubble}>
                <Ionicons name="cart-outline" size={22} color={stylesTokens.white} />
                <View style={styles.measureOriginPlusBadge}>
                  <Ionicons name="add" size={10} color={stylesTokens.orange} />
                </View>
              </View>

              <Pressable style={styles.measurePopoverCard} onPress={() => undefined}>
                {pickerItem ? (
                  <>
                    <View style={styles.measurePopoverHeader}>
                      <Text style={styles.measureSheetTitle}>{normalizeDisplayText(pickerItem.name)}</Text>
                      <Text style={styles.measureSheetSubtitle}>{resolveMeasurementLabel(pickerItem)}</Text>
                    </View>

                    <View style={styles.measureOptionsGrid}>
                      {activeMeasurementOptions.map((option) => {
                        const selected = selectedMeasureOption === option;
                        const optionPrice = formatCurrencyValue(resolveMeasurementUnitPrice(pickerItem, option));
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
                        <Ionicons name="remove" size={22} color="#8a94a6" />
                      </TouchableOpacity>

                      <View style={styles.measureQtyValuePill}>
                        <Text style={styles.measureQtyValueText}>{selectedMeasureQty}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.measureQtyPrimaryButton}
                        activeOpacity={0.9}
                        onPress={() => setSelectedMeasureQty((current) => current + 1)}
                      >
                        <Ionicons name="add" size={22} color={stylesTokens.white} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.measureFooterBar}>
                      <TouchableOpacity style={styles.measureContinueButton} activeOpacity={0.85} onPress={closeMeasurementPicker}>
                        <Ionicons name="bag-handle-outline" size={18} color="#6b7280" />
                        <Text style={styles.measureContinueText}>متابعة التسوق</Text>
                      </TouchableOpacity>

                      <View style={styles.measurePriceValueBox}>
                        <Text style={styles.measurePriceValueText}>{formatCurrencyValue(selectedMeasureTotalPrice || selectedMeasureUnitPrice)}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.measureConfirmButton}
                        activeOpacity={0.9}
                        onPress={() => {
                          closeMeasurementPicker();
                          onOpenCart?.();
                        }}
                      >
                        <Text style={styles.measureConfirmText}>أضف للسلة</Text>
                        <Ionicons name="cart-outline" size={18} color={stylesTokens.white} />
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
    paddingBottom: 28,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textAlignRight: {
    textAlign: 'right',
  },

  topChrome: {
    backgroundColor: '#f7f8fb',
    paddingTop: Platform.OS === 'android' ? 22 : 16,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  topChromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 4,
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: stylesTokens.white,
    borderRadius: 24,
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
    marginTop: 6,
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
    paddingTop: 4,
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
    marginTop: 6,
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
    marginTop: 8,
    marginHorizontal: 12,
    backgroundColor: stylesTokens.white,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    gap: 4,
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
    marginTop: 1,
    color: stylesTokens.muted,
    fontSize: 10.5,
    lineHeight: 14,
  },
  heroCompactMetaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
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
    marginTop: 8,
    gap: 8,
  },
  smartRailSection: {
    marginTop: 2,
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
    marginTop: 10,
    paddingHorizontal: 12,
  },
  categoryRow: {
    marginTop: 0,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    paddingVertical: 2,
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
    marginTop: 12,
    paddingHorizontal: 12,
  },
  feedList: {
    gap: 10,
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
    width: 58,
    height: 58,
    borderRadius: 29,
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
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  measurePopoverCard: {
    flex: 1,
    backgroundColor: stylesTokens.white,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d9e0ea',
    gap: 12,
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
    gap: 2,
  },
  measureSheetTitle: {
    color: stylesTokens.dark,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
  },
  measureSheetSubtitle: {
    color: stylesTokens.muted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  measureOptionsGrid: {
    flexDirection: 'row-reverse',
    gap: 10,
    justifyContent: 'space-between',
  },
  measureOptionChip: {
    flex: 1,
    minHeight: 72,
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: '#d9e0ea',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  measureOptionChipActive: {
    backgroundColor: stylesTokens.orange,
    borderColor: stylesTokens.orangeBorder,
  },
  measureOptionText: {
    color: stylesTokens.dark,
    fontSize: 12.5,
    fontWeight: '900',
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
    gap: 16,
    marginTop: 2,
  },
  measureQtyGhostButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d9e0ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureQtyPrimaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffb35c',
  },
  measureQtyValuePill: {
    minWidth: 90,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fffaf5',
    borderWidth: 1,
    borderColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  measureQtyValueText: {
    color: stylesTokens.dark,
    fontSize: 22,
    fontWeight: '900',
  },
  measureFooterBar: {
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9e0ea',
    marginTop: 4,
  },
  measureContinueButton: {
    flex: 1.1,
    backgroundColor: '#f8fafc',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  measureContinueText: {
    color: stylesTokens.dark,
    fontSize: 13,
    fontWeight: '800',
  },
  measurePriceValueBox: {
    minWidth: 112,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  measurePriceValueText: {
    color: stylesTokens.dark,
    fontSize: 18,
    fontWeight: '900',
  },
  measureConfirmButton: {
    flex: 1.3,
    backgroundColor: stylesTokens.orange,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  measureConfirmText: {
    color: stylesTokens.white,
    fontSize: 14,
    fontWeight: '900',
  },
  menuBody: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  menuBodyRTL: {
    alignItems: 'flex-end',
  },
  menuInfoZone: {
    width: '100%',
    minHeight: 60,
    justifyContent: 'flex-start',
    gap: 2,
    alignItems: 'flex-end',
  },
  menuCommerceZone: {
    width: '100%',
    justifyContent: 'flex-start',
    gap: 3,
    alignItems: 'flex-end',
    marginTop: -4,
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
    paddingVertical: 3,
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
  menuChipRow: {
    marginTop: -1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  smallChipPrimary: {
    backgroundColor: stylesTokens.orangeSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    paddingVertical: 5,
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
    zIndex: 1,
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
    marginTop: 14,
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
    marginTop: 12,
    paddingHorizontal: 12,
  },
});

export default DshStoreGetScreen;
