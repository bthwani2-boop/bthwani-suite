/**
 * DSH Store Get - Premium Store Detail Screen
 * Clean modern design following best delivery app patterns
 * Surfaces package — auto screen for: DshStoreGet
 */
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ScreenWrapper,
  ScreenState,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  semanticRoles,
  BTHWANI_COLORS,
  useDirection,
  useI18n,
} from '@bthwani/ui-kit';
import {
  buildDshStoreGetMock,
  type StoreDetail,
  type MenuItem,
  type StoreCategory,
} from '../../fixtures/storeGet';

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  primary: BTHWANI_COLORS.primary,
  primaryDark: '#084080',
  primaryLight: '#1A5FAC',
  accent: BTHWANI_COLORS.accent,
  accentDark: BTHWANI_COLORS.accentDark,
  success: BTHWANI_COLORS.successGreen,
  danger: BTHWANI_COLORS.danger,
  warning: BTHWANI_COLORS.warning,
  info: BTHWANI_COLORS.info,
  amber: BTHWANI_COLORS.amber,
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: BTHWANI_COLORS.gray300,
  gray400: BTHWANI_COLORS.gray400,
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  surface: BTHWANI_COLORS.surface,
  background: BTHWANI_COLORS.background,
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: StoreHeader - Clean minimal header with store name and actions
// ═══════════════════════════════════════════════════════════════════════════
interface StoreHeaderProps {
  storeName: string;
  onBack: () => void;
  onSearch: () => void;
  onCart: () => void;
  onAccount: () => void;
  onShare: () => void;
  isRTL: boolean;
}

const StoreHeader = memo(function StoreHeader({
  storeName,
  onBack,
  onSearch,
  onCart,
  onAccount,
  onShare,
  isRTL,
}: StoreHeaderProps) {
  return (
    <View style={styles.storeHeader}>
      <View style={styles.storeHeaderRow}>
        {isRTL ? (
          <>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='arrow-forward' size={26} color={COLORS.accent} />
            </TouchableOpacity>

            <Text style={styles.storeHeaderTitleCenter} numberOfLines={1}>
              {storeName}
            </Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onShare}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name='share-social-outline'
                  size={22}
                  color={COLORS.gray600}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onCart}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name='cart-outline' size={22} color={COLORS.gray600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onSearch}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name='search-outline' size={22} color={COLORS.gray600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onAccount}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name='person-outline' size={22} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='arrow-back' size={26} color={COLORS.accent} />
            </TouchableOpacity>

            <Text style={styles.storeHeaderTitleCenter} numberOfLines={1}>
              {storeName}
            </Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onShare}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name='share-social-outline'
                  size={22}
                  color={COLORS.gray600}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onCart}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name='cart-outline' size={22} color={COLORS.gray600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onSearch}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name='search-outline' size={22} color={COLORS.gray600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={onAccount}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name='person-outline' size={22} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
});

// نوع وضع التوصيل: توصيل بثواني | استلم بنفسك | توصيل المتجر
export type DeliveryMode = 'delivery' | 'pickup' | 'store_delivery';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: StoreInfoCard - Store details with rating, reviews, delivery toggle
// ═══════════════════════════════════════════════════════════════════════════
interface StoreInfoCardProps {
  store: StoreDetail;
  selectedMode: DeliveryMode;
  onModeChange: (mode: DeliveryMode) => void;
  isRTL: boolean;
}

const StoreInfoCard = memo(function StoreInfoCard({
  store,
  selectedMode,
  onModeChange,
  isRTL,
}: StoreInfoCardProps) {
  const { t } = useI18n();
  const logoUri =
    (store as any)?.logoThumbnailUrl ||
    (store as any)?.thumbnailUrl ||
    (store as any)?.logoUrl ||
    (store as any)?.imageUrl;

  return (
    <View style={styles.storeInfoCard}>
      {/* Store meta row (rating + status + delivery + price match + logo) */}
      <View style={[styles.storeMetaRow, isRTL && styles.rowReverse]}>
        <View style={styles.storeLogoBox}>
          {typeof logoUri === 'string' && logoUri.length > 0 ? (
            <Image
              source={{ uri: logoUri }}
              style={styles.storeLogoImage}
              resizeMode='cover'
            />
          ) : (
            <Text
              style={styles.storeLogoFallback}
              accessibilityLabel='store-logo'
            >
              {store.coverImage || store.image || '🏬'}
            </Text>
          )}
        </View>

        <View style={styles.storeMetaContent}>
          <View style={[styles.storeMetaLine, isRTL && styles.rowReverse]}>
            <View style={[styles.ratingInline, isRTL && styles.rowReverse]}>
              <Ionicons name='star' size={14} color={COLORS.amber} />
              <Text style={styles.ratingValue}>{store.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCountInline}>
                ({store.reviews.toLocaleString()}{' '}
                {t('dsh.app-client.mobile.auto_dsh_store_get.reviewsLabel')})
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                store.isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  !store.isOpen && styles.statusPillTextClosed,
                ]}
              >
                {
                  store.isOpen
                    ? t('dsh.app-client.mobile.auto_dsh_store_get.statusOpen')
                    : t('dsh.app-client.mobile.auto_dsh_store_get.statusClosed')
                }
              </Text>
            </View>

            <View style={[styles.deliveryTimeInfo, isRTL && styles.rowReverse]}>
              <Ionicons name='time-outline' size={16} color={COLORS.gray500} />
              <Text style={styles.deliveryTimeText}>{store.deliveryTime}</Text>
            </View>

            {store.priceMatch && (
              <View style={styles.priceMatchBadge}>
                <Text style={styles.priceMatchText}>
                  {t('dsh.app-client.mobile.auto_dsh_store_get.priceMatchBadge')}
                </Text>
              </View>
            )}
          </View>

          {/* عدد المتابعين */}
          {store.followersCount != null && store.followersCount >= 0 && (
            <View
              style={[
                styles.storeMetaLine,
                styles.followersRow,
                isRTL && styles.rowReverse,
              ]}
            >
              <Ionicons
                name='people-outline'
                size={14}
                color={COLORS.gray500}
              />
              <Text style={styles.followersText}>
                {store.followersCount.toLocaleString()}{' '}
                {t('dsh.app-client.mobile.auto_dsh_store_get.followersLabel')}
              </Text>
            </View>
          )}

          {/* الاشتراكات المتوفرة */}
          {(store.hasBthwaniPro ||
            (store.subscriptionPackageChips &&
              store.subscriptionPackageChips.length > 0)) && (
            <View
              style={[
                styles.subscriptionSection,
                { alignItems: isRTL ? 'flex-end' : 'flex-start' },
              ]}
            >
              <Text
                style={[
                  styles.subscriptionSectionTitle,
                  {
                    textAlign: isRTL ? 'right' : 'left',
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                {t(
                  'dsh.app-client.mobile.auto_dsh_store_get.subscriptionsAvailable'
                )}
              </Text>
              <View
                style={[
                  styles.subscriptionChipsRow,
                  isRTL && styles.rowReverse,
                ]}
              >
                {store.hasBthwaniPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>
                      {t('dsh.app-client.mobile.auto_dsh_store_get.proBadge')}
                    </Text>
                  </View>
                )}
                {store.subscriptionPackageChips?.map(chip => (
                  <View key={chip} style={styles.subscriptionChip}>
                    <Text style={styles.subscriptionChipText}>{chip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Delivery Mode Toggle — توصيل المتجر | استلم بنفسك | توصيل بثواني */}
      <View
        style={[styles.deliveryToggleContainer, isRTL && styles.rowReverse]}
      >
        <TouchableOpacity
          style={[
            styles.deliveryToggleButton,
            selectedMode === 'store_delivery' && styles.deliveryToggleActive,
          ]}
          onPress={() => onModeChange('store_delivery')}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.deliveryToggleButtonInner,
              isRTL && styles.rowReverse,
            ]}
          >
            <Text
              style={[
                styles.deliveryToggleText,
                selectedMode === 'store_delivery' &&
                  styles.deliveryToggleTextActive,
              ]}
            >
              {t('dsh.app-client.mobile.auto_dsh_store_get.storeDelivery')}
            </Text>
            <Ionicons
              name='car-outline'
              size={18}
              color={
                selectedMode === 'store_delivery' ? COLORS.accent : COLORS.white
              }
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deliveryToggleButton,
            selectedMode === 'pickup' && styles.deliveryToggleActive,
          ]}
          onPress={() => onModeChange('pickup')}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.deliveryToggleButtonInner,
              isRTL && styles.rowReverse,
            ]}
          >
            <Text
              style={[
                styles.deliveryToggleText,
                selectedMode === 'pickup' && styles.deliveryToggleTextActive,
              ]}
            >
              {t('dsh.app-client.mobile.auto_dsh_store_get.pickup')}
            </Text>
            <Ionicons
              name='storefront'
              size={18}
              color={selectedMode === 'pickup' ? COLORS.accent : COLORS.white}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deliveryToggleButton,
            selectedMode === 'delivery' && styles.deliveryToggleActive,
          ]}
          onPress={() => onModeChange('delivery')}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.deliveryToggleButtonInner,
              isRTL && styles.rowReverse,
            ]}
          >
            <Text
              style={[
                styles.deliveryToggleText,
                selectedMode === 'delivery' && styles.deliveryToggleTextActive,
              ]}
            >
              {t('dsh.app-client.mobile.auto_dsh_store_get.bthwaniDelivery')}
            </Text>
            <Ionicons
              name='bicycle'
              size={18}
              color={selectedMode === 'delivery' ? COLORS.accent : COLORS.white}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Pickup Location Info */}
      {selectedMode === 'pickup' && (
        <View style={styles.pickupInfoContainer}>
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name='navigate' size={16} color={COLORS.accent} />
            <Text style={styles.mapButtonText}>
              {t('dsh.app-client.mobile.auto_dsh_store_get.openMap')}
            </Text>
          </TouchableOpacity>
          <View style={[styles.pickupAddressRow, isRTL && styles.rowReverse]}>
            <Text style={styles.pickupAddressLabel}>
              {t('dsh.app-client.mobile.auto_dsh_store_get.pickupAddressPrefix')}
            </Text>
            <View
              style={[styles.pickupAddressDetail, isRTL && styles.rowReverse]}
            >
              <Ionicons name='location' size={14} color={COLORS.accent} />
              <Text style={styles.pickupAddressText}>{store.address}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: CategoryTab - Horizontal category chip with icon
// ═══════════════════════════════════════════════════════════════════════════
interface CategoryTabProps {
  category: StoreCategory;
  isSelected: boolean;
  onPress: () => void;
  isRTL: boolean;
}

const CategoryTab = memo(function CategoryTab({
  category,
  isSelected,
  onPress,
  isRTL,
}: CategoryTabProps) {
  return (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        isSelected && styles.categoryTabActive,
        isRTL && styles.rowReverse,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {category.icon && (
        <Text style={styles.categoryTabIcon}>{category.icon}</Text>
      )}
      <Text
        style={[
          styles.categoryTabText,
          isSelected && styles.categoryTabTextActive,
        ]}
      >
        {category.name}
      </Text>
      {category.isPopular && (
        <Ionicons name='flame' size={12} color={COLORS.accent} />
      )}
    </TouchableOpacity>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: ProductCard - Clean product card matching reference design
// ═══════════════════════════════════════════════════════════════════════════
interface ProductCardProps {
  item: MenuItem;
  quantity: number;
  onAddToCart: (item: MenuItem) => void;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onShowOptions: (item: MenuItem) => void;
  onToggleFavorite: (item: MenuItem) => void;
  onAddWithOption?: (
    item: MenuItem,
    optionId: string,
    optionPrice: number
  ) => void;
  onCloseOptions?: () => void;
  isRTL: boolean;
  isOptionsExpanded?: boolean;
  options?: { id: string; name: string; price: number }[];
}

const ProductCard = memo(function ProductCard({
  item,
  quantity,
  onAddToCart,
  onQuantityChange,
  onShowOptions,
  onToggleFavorite,
  onAddWithOption,
  onCloseOptions,
  isRTL,
  isOptionsExpanded = false,
  options = [],
}: ProductCardProps) {
  const { t } = useI18n();
  const hasDiscount =
    (item.discountPercent != null && item.discountPercent > 0) ||
    (item.originalPrice != null && item.originalPrice > item.price);
  const computedDiscountPercent =
    item.discountPercent ??
    (item.originalPrice != null && item.originalPrice > 0
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100
        )
      : 0);
  const imageUrl = item.thumbnailUrl || item.imageUrl;
  const currencyLabel =
    item.currency || t('dsh.app-client.mobile.auto_dsh_store_get.currency');
  const isOutOfStock = item.stockQuantity === 0;
  const isUnavailable = item.isAvailable === false || isOutOfStock;
  const primaryCtaLabel = isUnavailable
    ? isOutOfStock
      ? t('dsh.app-client.mobile.auto_dsh_store_get.outOfStock')
      : t('dsh.app-client.mobile.auto_dsh_store_get.unavailable')
    : item.hasOptions
      ? t('dsh.app-client.mobile.auto_dsh_store_get.showOptions')
      : t('dsh.app-client.mobile.auto_dsh_store_get.addToCart');

  return (
    <View
      style={[
        styles.productCard,
        isUnavailable && styles.productCardUnavailable,
        isOptionsExpanded && styles.productCardExpanded,
      ]}
    >
      <View
        style={[styles.productCardInner, isRTL && styles.productCardInnerRTL]}
      >
        {/* Product Image - يمين في RTL، يسار في LTR */}
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImageAsset}
              resizeMode='cover'
            />
          ) : (
            <Text style={styles.productImage}>{item.image}</Text>
          )}
          {isUnavailable ? (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableBadgeText} numberOfLines={1}>
                {primaryCtaLabel}
              </Text>
            </View>
          ) : null}
          {/* Favorite Button - دائري برتقالي على الصورة */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={item.isFavorite ? COLORS.danger : COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* Product Details — قالب ثابت: عنوان → وصف → وقت → سعر (بدون تداخل) */}
        <View
          style={[styles.productDetails, isRTL && styles.productDetailsRTL]}
        >
          <Text
            style={[styles.productName, isRTL && styles.textAlignEnd]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.productDescription, isRTL && styles.textAlignEnd]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View style={[styles.productMeta, isRTL && styles.rowReverse]}>
            <Ionicons name='time-outline' size={12} color={COLORS.gray400} />
            <Text style={styles.productMetaText} numberOfLines={1}>
              {item.preparationTime}
            </Text>
          </View>
          {/* صف سعر موحد: خصم (إن وُجد) ثم سعر قديم ثم سعر — بدون wrap أو تداخل */}
          <View
            style={[styles.productPriceRow, isRTL && styles.productPriceRowRTL]}
          >
            {hasDiscount && computedDiscountPercent > 0 ? (
              <View style={styles.discountBadge} pointerEvents='none'>
                <Text style={styles.discountBadgeText} numberOfLines={1}>
                  {computedDiscountPercent}%
                </Text>
              </View>
            ) : (
              <View style={styles.discountBadgePlaceholder} />
            )}
            {hasDiscount && item.originalPrice != null ? (
              <Text
                style={[
                  styles.originalPriceInline,
                  isRTL && styles.textAlignEnd,
                ]}
                numberOfLines={1}
              >
                {item.originalPrice.toLocaleString()} {currencyLabel}
              </Text>
            ) : null}
            <Text
              style={[styles.productPrice, isRTL && styles.textAlignEnd]}
              numberOfLines={1}
            >
              {item.price.toLocaleString()}
              <Text style={styles.currencyText}> {currencyLabel}</Text>
            </Text>
          </View>
        </View>

        {/* الركن السفلي: منتقي كمية (عند وجودها) أو زر الإجراء — عمود كامل قابل للضغط لزر اليد/السلة */}
        <View
          style={[
            styles.productActionColumn,
            isRTL && styles.productActionColumnRTL,
          ]}
          pointerEvents='box-none'
          collapsable={false}
        >
          {!isUnavailable && quantity > 0 ? (
            <View style={[styles.quantitySelector, isRTL && styles.rowReverse]}>
              <TouchableOpacity
                style={styles.quantitySelectorButton}
                onPress={() => onQuantityChange(item.id, quantity - 1)}
                activeOpacity={0.8}
                accessibilityLabel={t(
                  'dsh.app-client.mobile.auto_dsh_store_get.decreaseQuantity'
                )}
                accessibilityRole='button'
              >
                <Ionicons name='remove' size={16} color={COLORS.accent} />
              </TouchableOpacity>
              <Text style={styles.quantitySelectorValue} numberOfLines={1}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={styles.quantitySelectorButton}
                onPress={() => onQuantityChange(item.id, quantity + 1)}
                activeOpacity={0.8}
                accessibilityLabel={t(
                  'dsh.app-client.mobile.auto_dsh_store_get.increaseQuantity'
                )}
                accessibilityRole='button'
              >
                <Ionicons name='add' size={16} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.productActionColumnTouchable,
                isUnavailable && styles.productActionIconButtonDisabled,
              ]}
              disabled={isUnavailable}
              onPress={() => {
                if (isUnavailable) return;
                if (item.hasOptions) {
                  onShowOptions(item);
                } else {
                  onAddToCart(item);
                }
              }}
              activeOpacity={0.7}
              accessibilityLabel={primaryCtaLabel}
              accessibilityRole='button'
            >
              <View
                style={[
                  styles.productActionIconButton,
                  item.hasOptions && styles.productActionIconButtonOptions,
                  isUnavailable && styles.productActionIconButtonDisabled,
                ]}
                pointerEvents='none'
              >
                {isUnavailable ? (
                  <Ionicons
                    name='close-circle-outline'
                    size={20}
                    color={COLORS.gray400}
                  />
                ) : item.hasOptions ? (
                  <Ionicons
                    name={isRTL ? 'hand-left-outline' : 'hand-right-outline'}
                    size={20}
                    color={COLORS.white}
                  />
                ) : (
                  <Ionicons name='cart-outline' size={20} color={COLORS.white} />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Options Bubbles — انبثاق من البطاقة عند الضغط على اليد */}
      {isOptionsExpanded &&
      options.length > 0 &&
      onAddWithOption &&
      onCloseOptions ? (
        <OptionsBubblesRow
          key={`bubbles-${item.id}`}
          item={item}
          options={options}
          isRTL={isRTL}
          onSelect={(optionId, optionPrice) => {
            onAddWithOption(item, optionId, optionPrice);
            onCloseOptions();
          }}
          onClose={onCloseOptions}
        />
      ) : null}

      {/* Divider */}
      <View style={styles.productDivider} />
    </View>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: OptionsBubblesRow - فقاعات الخيارات (ربع، نصف، حبة) مع انبثاق
// ═══════════════════════════════════════════════════════════════════════════
interface OptionsBubblesRowProps {
  item: MenuItem;
  options: { id: string; name: string; price: number }[];
  isRTL: boolean;
  onSelect: (optionId: string, optionPrice: number) => void;
  onClose: () => void;
}

const OptionsBubblesRow = memo(function OptionsBubblesRow({
  options,
  isRTL,
  onSelect,
  onClose,
}: OptionsBubblesRowProps) {
  const { t } = useI18n();
  const anims = useRef(
    options.map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (anims.length !== options.length) return;
    Animated.stagger(
      70,
      anims.map(({ scale, opacity }) =>
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 6,
            tension: 100,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, [options.length]);

  return (
    <View style={[styles.optionsBubblesWrap, isRTL && styles.rowReverse]}>
      {options.map((opt, i) => (
        <Animated.View
          key={opt.id}
          style={[
            styles.optionsBubbleOuter,
            {
              opacity: anims[i]?.opacity ?? 1,
              transform: [{ scale: anims[i]?.scale ?? 1 }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.optionsBubble}
            onPress={() => onSelect(opt.id, opt.price)}
            activeOpacity={0.85}
            accessibilityLabel={`${opt.name} ${opt.price}`}
            accessibilityRole='button'
          >
            <Text
              style={[styles.optionsBubbleLabel, isRTL && styles.textAlignEnd]}
              numberOfLines={1}
            >
              {opt.name}
            </Text>
            <Text
              style={[styles.optionsBubblePrice, isRTL && styles.textAlignEnd]}
              numberOfLines={1}
            >
              {opt.price.toLocaleString()}{' '}
              {t('dsh.app-client.mobile.auto_dsh_store_get.currency')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
      <TouchableOpacity
        style={styles.optionsBubbleClose}
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel={t(
          'dsh.app-client.mobile.auto_dsh_store_get.closeOptions'
        )}
        accessibilityRole='button'
      >
        <Ionicons name='close-circle' size={24} color={COLORS.gray500} />
      </TouchableOpacity>
    </View>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: OptionsBottomSheet - Product options selector (الخيارات المتوفرة) — احتياطي
// ═══════════════════════════════════════════════════════════════════════════
interface OptionsBottomSheetProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    optionId?: string,
    optionPrice?: number
  ) => void;
  isRTL: boolean;
}

const OptionsBottomSheet = memo(function OptionsBottomSheet({
  visible,
  item,
  onClose,
  onAddToCart,
  isRTL,
}: OptionsBottomSheetProps) {
  const { t } = useI18n();
  if (!item) return null;

  const defaultOptions = item.optionGroups?.[0]?.options || [
    {
      id: 'quarter',
      name: t('dsh.app-client.mobile.auto_dsh_store_get.quarter'),
      price: Math.round(item.price * 0.4),
    },
    {
      id: 'half',
      name: t('dsh.app-client.mobile.auto_dsh_store_get.half'),
      price: Math.round(item.price * 0.7),
    },
    {
      id: 'whole',
      name: t('dsh.app-client.mobile.auto_dsh_store_get.whole'),
      price: item.price,
    },
  ];

  const handleAddWithOption = (optionId: string, optionPrice: number) => {
    onAddToCart(item, optionId, optionPrice);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable style={styles.bottomSheetOverlay} onPress={onClose}>
        <Pressable
          style={styles.bottomSheetContainer}
          onPress={e => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.bottomSheetHeader, isRTL && styles.rowReverse]}>
            <Text
              style={[styles.bottomSheetTitle, isRTL && styles.textAlignEnd]}
            >
              {t('dsh.app-client.mobile.auto_dsh_store_get.availableOptions')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='close' size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View
            style={[styles.bottomSheetProductInfo, isRTL && styles.rowReverse]}
          >
            <Text style={styles.bottomSheetProductEmoji}>{item.image}</Text>
            <View style={styles.bottomSheetProductDetails}>
              <Text
                style={[
                  styles.bottomSheetProductName,
                  isRTL && styles.textAlignEnd,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.bottomSheetProductDesc,
                  isRTL && styles.textAlignEnd,
                ]}
                numberOfLines={1}
              >
                {item.description}
              </Text>
            </View>
          </View>

          {/* Options List */}
          <View style={styles.optionsList}>
            {defaultOptions.map(option => (
              <View
                key={option.id}
                style={[styles.optionRow, isRTL && styles.rowReverse]}
              >
                <Text style={[styles.optionName, isRTL && styles.textAlignEnd]}>
                  {option.name}
                </Text>
                <View
                  style={[styles.optionPriceAction, isRTL && styles.rowReverse]}
                >
                  <View style={styles.optionPriceBadge}>
                    <Text style={styles.optionPriceText}>
                      {option.price.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.optionAddButton}
                    onPress={() => handleAddWithOption(option.id, option.price)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionAddButtonText}>
                      {t('dsh.app-client.mobile.auto_dsh_store_get.addToCart')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Handle Bar */}
          <View style={styles.bottomSheetHandle} />
        </Pressable>
      </Pressable>
    </Modal>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT: DshStoreGetScreen
// ═══════════════════════════════════════════════════════════════════════════
export function DshStoreGetScreen() {
  const { direction } = useDirection();
  const { t } = useI18n();
  const isRTL = direction === 'rtl';
  const categoryScrollRef = useRef<ScrollView>(null);

  // State Management
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeliveryMode, setSelectedDeliveryMode] =
    useState<DeliveryMode>('delivery');
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedItemForOptions, setSelectedItemForOptions] =
    useState<MenuItem | null>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(
    {}
  );

  // Load store data
  const loadStoreData = useCallback(async () => {
    try {
      setScreenState('loading');
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = buildDshStoreGetMock(t);
      setStore(data.store);
      setMenuItems(data.menuItems);
      const favSet = new Set(
        data.menuItems.filter(i => i.isFavorite).map(i => i.id)
      );
      setFavorites(favSet);
      setScreenState('content');
    } catch {
      setScreenState('error');
    }
  }, [t]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStoreData();
    setRefreshing(false);
  }, [loadStoreData]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return menuItems;
    if (selectedCategory === 'favorites') {
      return menuItems.filter(item => favorites.has(item.id));
    }
    if (selectedCategory === 'popular') {
      return menuItems.filter(item => item.isPopular);
    }
    return menuItems.filter(item => item.categoryId === selectedCategory);
  }, [menuItems, selectedCategory, favorites]);

  const handleQuantityChange = useCallback(
    (itemId: string, newQuantity: number) => {
      setCartQuantities(prev => {
        const next = { ...prev };
        if (newQuantity <= 0) {
          delete next[itemId];
        } else {
          next[itemId] = newQuantity;
        }
        return next;
      });
    },
    []
  );

  const handleAddToCart = useCallback(
    (item: MenuItem, _optionId?: string, _optionPrice?: number) => {
      setCartQuantities(prev => ({
        ...prev,
        [item.id]: (prev[item.id] ?? 0) + 1,
      }));
    },
    []
  );

  const handleShowOptions = useCallback((item: MenuItem) => {
    setSelectedItemForOptions(prev => (prev?.id === item.id ? null : item));
  }, []);

  const handleCloseOptions = useCallback(() => {
    setSelectedItemForOptions(null);
  }, []);

  const getOptionsForItem = useCallback((item: MenuItem | null) => {
    if (!item) return [];
    const defaultOptions = item.optionGroups?.[0]?.options ?? [
      {
        id: 'quarter',
        name: t('dsh.app-client.mobile.auto_dsh_store_get.quarter'),
        price: Math.round(item.price * 0.4),
      },
      {
        id: 'half',
        name: t('dsh.app-client.mobile.auto_dsh_store_get.half'),
        price: Math.round(item.price * 0.7),
      },
      {
        id: 'whole',
        name: t('dsh.app-client.mobile.auto_dsh_store_get.whole'),
        price: item.price,
      },
    ];
    return defaultOptions;
  }, [t]);

  const handleAddWithOption = useCallback(
    (item: MenuItem, _optionId: string, _optionPrice: number) => {
      setCartQuantities(prev => ({
        ...prev,
        [item.id]: (prev[item.id] ?? 0) + 1,
      }));
      setSelectedItemForOptions(null);
    },
    []
  );

  const handleToggleFavorite = useCallback((item: MenuItem) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleAccount = useCallback(() => {
    console.log('Navigate to account');
  }, []);

  const handleBack = useCallback(() => {
    console.log('Navigate back');
  }, []);

  const handleCart = useCallback(() => {
    console.log('Navigate to cart');
  }, []);

  const handleSearch = useCallback(() => {
    console.log('Open search');
  }, []);

  const handleShare = useCallback(() => {
    console.log('Share store');
  }, []);

  const renderProductItem = useCallback(
    (item: MenuItem) => {
      const itemWithFavorite = { ...item, isFavorite: favorites.has(item.id) };
      const isExpanded = selectedItemForOptions?.id === item.id;
      const options = isExpanded ? getOptionsForItem(item) : [];
      return (
        <ProductCard
          key={item.id}
          item={itemWithFavorite}
          quantity={cartQuantities[item.id] ?? 0}
          onAddToCart={handleAddToCart}
          onQuantityChange={handleQuantityChange}
          onShowOptions={handleShowOptions}
          onToggleFavorite={handleToggleFavorite}
          onAddWithOption={handleAddWithOption}
          onCloseOptions={handleCloseOptions}
          isRTL={isRTL}
          isOptionsExpanded={isExpanded}
          options={options}
        />
      );
    },
    [
      favorites,
      cartQuantities,
      selectedItemForOptions,
      getOptionsForItem,
      handleAddToCart,
      handleQuantityChange,
      handleShowOptions,
      handleToggleFavorite,
      handleAddWithOption,
      handleCloseOptions,
      isRTL,
    ]
  );

  // Error retry
  const handleRetry = useCallback(() => {
    loadStoreData();
  }, [loadStoreData]);

  return (
    <ScreenWrapper
      state={screenState}
      onErrorAction={handleRetry}
      errorActionText={t('common.retry')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_store_get.errorMessage')}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_store_get.loadingMessage')}
    >
      <StatusBar barStyle='dark-content' backgroundColor={COLORS.white} />
      <View style={styles.container}>
        {store && (
          <>
            {/* Clean Store Header */}
            <StoreHeader
              storeName={store.name}
              onBack={handleBack}
              onSearch={handleSearch}
              onCart={handleCart}
              onAccount={handleAccount}
              onShare={handleShare}
              isRTL={isRTL}
            />

            {/* كل المحتوى داخل ScrollView واحد — بطاقة المتجر وتبديل التوصيل والتصنيفات تتحرك مع الأسفل عند التصفح */}
            <ScrollView
              style={styles.productsContainer}
              contentContainerStyle={styles.productsContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.accent}
                />
              }
            >
              {/* Store Info Card with Delivery Toggle — يختفي للأعلى عند التمرير */}
              <StoreInfoCard
                store={store}
                selectedMode={selectedDeliveryMode}
                onModeChange={setSelectedDeliveryMode}
                isRTL={isRTL}
              />

              {/* Category Tabs */}
              <View style={styles.categorySection}>
                <ScrollView
                  ref={categoryScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScroll}
                  nestedScrollEnabled
                >
                  {store.categories.map(category => (
                    <CategoryTab
                      key={category.id}
                      category={category}
                      isSelected={selectedCategory === category.id}
                      onPress={() => handleCategoryChange(category.id)}
                      isRTL={isRTL}
                    />
                  ))}
                </ScrollView>
              </View>

              {/* Products List */}
              {filteredItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🍽️</Text>
                  <Text style={styles.emptyTitle}>
                    {t('dsh.app-client.mobile.auto_dsh_store_get.noItemsTitle')}
                  </Text>
                  <Text style={styles.emptyText}>
                    {t('dsh.app-client.mobile.auto_dsh_store_get.noItemsText')}
                  </Text>
                </View>
              ) : (
                filteredItems.map(renderProductItem)
              )}
            </ScrollView>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES - Clean modern design matching reference app
// ═══════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  rowReverse: {
    flexDirection: 'row',
  },
  textAlignEnd: {
    textAlign: 'auto',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },

  // Store Header - Clean minimal design (مسافة سفلية مخفّضة)
  storeHeader: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  storeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeHeaderTitleCenter: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
    marginHorizontal: BTHWANI_SPACING.md,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },

  // Store Info Card (حواشٍ رأسية مخفّضة)
  storeInfoCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  storeLogoBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeLogoImage: {
    width: '100%',
    height: '100%',
  },
  storeLogoFallback: {
    fontSize: 22,
  },
  storeMetaContent: {
    flex: 1,
    marginHorizontal: BTHWANI_SPACING.md,
  },
  storeMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    rowGap: BTHWANI_SPACING.xs,
    columnGap: BTHWANI_SPACING.md,
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  reviewCountInline: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: '500',
  },
  priceMatchBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  priceMatchText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  followersRow: {
    marginTop: BTHWANI_SPACING.xs,
  },
  followersText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginStart: 4,
  },
  subscriptionSection: {
    marginTop: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.xs,
  },
  subscriptionSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray600,
    marginBottom: 2,
  },
  subscriptionChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  subscriptionChip: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  subscriptionChipText: {
    fontSize: 11,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  proBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  proBadgeText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
  },

  // Delivery Toggle — ثلاث كبسولات بزوايا دائرية ومسافات، حد برتقالي وظل
  deliveryToggleContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: 999,
    padding: 5,
    marginBottom: BTHWANI_SPACING.sm,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  deliveryToggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: BTHWANI_SPACING.xs,
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    minWidth: 0,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  deliveryToggleButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deliveryToggleActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.accent,
  },
  deliveryToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  deliveryToggleTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },

  // Pickup Info
  pickupInfoContainer: {
    backgroundColor: COLORS.gray50,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.sm,
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  pickupAddressRow: {
    alignItems: 'flex-end',
  },
  pickupAddressLabel: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  pickupAddressDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickupAddressText: {
    fontSize: 13,
    color: semanticRoles.text,
    fontWeight: '500',
  },

  // Status Pill
  statusPill: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: 6,
    borderRadius: BTHWANI_RADIUS.full,
  },
  statusOpen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  statusPillTextClosed: {
    color: COLORS.danger,
  },
  deliveryTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTimeText: {
    fontSize: 12,
    color: COLORS.gray500,
  },

  // Category Section
  categorySection: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  categoryScroll: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    gap: BTHWANI_SPACING.sm,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: COLORS.gray100,
    gap: BTHWANI_SPACING.xs,
  },
  categoryTabActive: {
    backgroundColor: COLORS.accent,
  },
  categoryTabIcon: {
    fontSize: 16,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray700,
  },
  categoryTabTextActive: {
    color: COLORS.white,
  },

  // Products (مسافة علوية مخفّضة بعد التصنيفات)
  productsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  productsContent: {
    paddingTop: BTHWANI_SPACING.xs,
    paddingBottom: BTHWANI_SPACING.xl,
  },

  // Product Card — حجم ثابت لجميع البطاقات (ارتفاع = ارتفاع الصورة)
  productCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: BTHWANI_SPACING.md,
    marginVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    minHeight: 97,
    height: 97,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productCardInner: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: BTHWANI_SPACING.sm,
    alignItems: 'stretch',
    height: 96,
  },
  productCardInnerRTL: {
    direction: 'rtl',
  },
  productDetails: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 0,
    minWidth: 0,
    justifyContent: 'flex-start',
  },
  productDetailsRTL: {
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: 1,
    lineHeight: 20,
    height: 28,
  },
  productDescription: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 18,
    marginBottom: 1,
    height: 26,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 1,
    height: 16,
  },
  productMetaText: {
    fontSize: 13,
    color: COLORS.gray500,
    flex: 1,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 20,
    flexWrap: 'nowrap',
  },
  productPriceRowRTL: {
    flexDirection: 'row',
  },
  discountBadgePlaceholder: {
    width: 32,
    height: 18,
  },
  originalPriceInline: {
    fontSize: 13,
    color: COLORS.gray400,
    textDecorationLine: 'line-through',
    maxWidth: 72,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.text,
    flex: 1,
    minWidth: 0,
  },
  currencyText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray500,
  },
  productActionColumn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
    minWidth: 44,
  },
  productActionColumnRTL: {
    alignItems: 'flex-end',
  },
  /** منطقة لمس كاملة لعمود الإجراء (يد/سلة) — أسهل من ضغط الدائرة الصغيرة */
  productActionColumnTouchable: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  productActionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productActionIconButtonOptions: {
    backgroundColor: COLORS.primary,
  },
  productActionIconButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 4,
    gap: 4,
    minWidth: 76,
    height: 32,
  },
  quantitySelectorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantitySelectorValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  addButtonOptions: {
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  productImageContainer: {
    width: 96,
    height: 96,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    fontSize: 50,
  },
  productImageAsset: {
    width: '100%',
    height: '100%',
  },
  unavailableBadge: {
    position: 'absolute',
    top: BTHWANI_SPACING.xs,
    start: BTHWANI_SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.full,
  },
  unavailableBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.xs,
    end: BTHWANI_SPACING.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDivider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginHorizontal: BTHWANI_SPACING.md,
  },
  productCardExpanded: {
    height: undefined,
    minHeight: 97,
  },
  productCardUnavailable: {
    opacity: 0.92,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  discountBadge: {
    width: 32,
    height: 18,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: COLORS.warning,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  discountBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.black,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  emptyText: {
    fontSize: 14,
    color: semanticRoles.textSecondary,
    textAlign: 'center',
  },

  // Options Bottom Sheet
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xxl,
    paddingHorizontal: BTHWANI_SPACING.lg,
    maxHeight: '70%',
  },
  bottomSheetHandle: {
    position: 'absolute',
    top: BTHWANI_SPACING.xs,
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.sm,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  bottomSheetProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
    backgroundColor: COLORS.gray100,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.lg,
  },
  bottomSheetProductEmoji: {
    fontSize: 40,
  },
  bottomSheetProductDetails: {
    flex: 1,
  },
  bottomSheetProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: 4,
  },
  bottomSheetProductDesc: {
    fontSize: 13,
    color: semanticRoles.textSecondary,
  },
  optionsList: {
    gap: BTHWANI_SPACING.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
    flex: 1,
  },
  optionPriceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  optionPriceBadge: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    minWidth: 60,
    alignItems: 'center',
  },
  optionPriceText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  optionAddButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  optionAddButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Options Bubbles (فقاعات الخيارات)
  optionsBubblesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    marginTop: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.xs,
  },
  optionsBubbleOuter: {
    margin: 0,
  },
  optionsBubble: {
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BTHWANI_RADIUS.full,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsBubbleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: 2,
  },
  optionsBubblePrice: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
  },
  optionsBubbleClose: {
    padding: BTHWANI_SPACING.xs,
    marginStart: BTHWANI_SPACING.xs,
  },
});

export { DshStoreGetScreen as auto_dsh_store_get };
export default DshStoreGetScreen;

