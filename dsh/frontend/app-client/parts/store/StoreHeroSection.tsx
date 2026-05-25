import * as React from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import {
  BannerCarousel,
  Icon,
  StoreHero,
  Text,
  type BannerCarouselItem,
} from '@bthwani/ui-kit';

import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../../shared/dshStoreProductCardModel';
import {
  isDeliveryBenefitLabel,
  normalizeDisplayText,
  normalizeTagLabel,
} from '../../shared/store-formatting';
import { isNewItem, isOfferItem } from '../../shared/store-search-helpers';
import { resolveDshStoreMenuItemImageSource } from './StoreMenuItemCard';
import { stylesTokens } from './store-screen.styles';

export const StoreHeroSection = React.memo(function StoreHeroSection({
  store,
  storeText,
  visibleItems,
  clientVisibleItems,
  menuItems,
  normalizedStoreName,
  normalizedEtaLabel,
  storeCoverImageSource,
  storeLogoImageSource,
  operationalState,
  operationalStateMeta,
  showOperationalNotice,
  supportActionLabel,
  onSupport,
  onOpenCart,
  onOpenItems,
  onOpenBenefits,
  openInlineSearch,
  handleStoreShare,
  openStoreItemPreview,
  changeCategory,
  setSelectedMode,
  selectedMode,
  deliveryModes,
  scrollY,
  stickyThreshold,
  setStickyThreshold,
  viewportWidth,
  appearanceChrome,
  isRTL,
  styles,
}: any) {
  const isProBlocked = store?.commercialSourceMap?.['hasBthwaniPro']?.conflictStatus === 'blocker';
  const benefitChips = React.useMemo(
    () =>
      Array.from(
        new Set(
          [
            (isProBlocked ? false : store?.hasBthwaniPro) ? 'بثواني برو' : null,
            ...(store?.subscriptionPackageChips ?? []),
            store?.deliveryLabel ?? null,
            store?.serviceLabel ?? null,
          ].filter(Boolean) as string[],
        ),
      )
        .map((chip) => normalizeTagLabel(chip, storeText.get))
        .filter((chip) => !isDeliveryBenefitLabel(chip, storeText.get))
        .slice(0, 3),
    [isProBlocked, store, storeText.get],
  );

  const firstVisibleItem = React.useMemo(
    () => visibleItems[0] ?? clientVisibleItems[0] ?? null,
    [clientVisibleItems, visibleItems],
  );
  const firstOfferItem = React.useMemo(
    () => visibleItems.find((item: DshStoreGetMenuItem) => isOfferItem(item)) ?? clientVisibleItems.find((item: DshStoreGetMenuItem) => isOfferItem(item)) ?? firstVisibleItem,
    [clientVisibleItems, firstVisibleItem, visibleItems],
  );
  const firstNewItem = React.useMemo(
    () => visibleItems.find((item: DshStoreGetMenuItem) => isNewItem(item)) ?? clientVisibleItems.find((item: DshStoreGetMenuItem) => isNewItem(item)) ?? firstVisibleItem,
    [clientVisibleItems, firstVisibleItem, visibleItems],
  );

  const resolveFeaturePress = React.useCallback((label: string) => {
    const normalized = normalizeDisplayText(label).toLowerCase();
    if (normalized.includes('برو') || normalized.includes('أولوية') || normalized.includes('pro')) {
      onOpenBenefits?.();
      if (!onOpenBenefits && firstVisibleItem) openStoreItemPreview(firstVisibleItem);
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
    if (firstVisibleItem) openStoreItemPreview(firstVisibleItem);
  }, [changeCategory, firstVisibleItem, onOpenBenefits, openStoreItemPreview, setSelectedMode]);

  const smartRailItems = React.useMemo<BannerCarouselItem[]>(() => {
    const featureImages = menuItems.map((item: DshStoreGetMenuItem) => resolveDshStoreMenuItemImageSource(item));
    const pickFeatureImage = (index: number) => featureImages[index] ?? storeCoverImageSource;
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
            cta: 'صفّ',
            onPress: () => changeCategory('new'),
          }
        : null,
      ...(benefitChips ?? []).slice(0, 3).map((chip: string, index: number) => ({
        id: `${storeId}-benefit-${index}`,
        title: normalizeTagLabel(chip, storeText.get),
        subtitle: 'ميزة مرتبطة بهذا المتجر',
        badge: chip.includes('برو') || chip.includes('أولوية') ? 'اشتراك' : chip.includes('كوبون') || chip.includes('خصم') || chip.includes('عرض') ? 'عرض' : 'ميزة',
        image: pickFeatureImage(index + 3) ?? null,
        cta: 'افتح',
        onPress: () => resolveFeaturePress(chip),
      })),
    ].filter(Boolean) as BannerCarouselItem[];

    const productDriven = clientVisibleItems.slice(0, 12).map((item: DshStoreGetMenuItem) => ({
      id: `product-${item.id}`,
      title: normalizeDisplayText(item.name),
      subtitle: normalizeDisplayText(item.statusLabel ?? item.subtitle),
      badge: normalizeDisplayText(item.categoryLabel),
      image: resolveDshStoreMenuItemImageSource(item) ?? null,
      cta: 'تفاصيل',
      onPress: () => openStoreItemPreview(item),
    }));

    return [...storeDriven, ...productDriven].slice(0, 15);
  }, [benefitChips, changeCategory, clientVisibleItems, firstNewItem, firstOfferItem, firstVisibleItem, menuItems, openStoreItemPreview, resolveFeaturePress, store, storeCoverImageSource, storeText]);

  return (
    <>
      <StoreHero
        coverImage={storeCoverImageSource}
        logoImage={storeLogoImageSource}
        name={normalizedStoreName}
        locationLabel={store.locationLabel || 'حي العليا · الرياض'}
        isOpen={operationalState === 'store_open'}
        hasBthwaniPro={store.hasBthwaniPro}
        distanceLabel={store.distanceLabel || '2.1 كم'}
        deliveryTimeLabel={store.deliveryTimeLabel || normalizedEtaLabel}
        rating={store.rating}
        onSearchPress={openInlineSearch}
        onCartPress={() => {
          if (onOpenCart) onOpenCart(selectedMode);
          else onOpenItems?.();
        }}
        onSharePress={handleStoreShare}
        scrollY={scrollY}
        deliveryModes={deliveryModes}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />

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
          },
        ]}
      >
        <Text style={[styles.stickyHeaderTitle, { color: appearanceChrome.primaryText }]}>
          {normalizedStoreName}
        </Text>
      </Animated.View>

      {showOperationalNotice ? (
        <View
          style={[
            styles.storeStateNotice,
            operationalState === 'area_unserviceable' ? styles.storeStateNoticeDanger : styles.storeStateNoticeWarning,
            { backgroundColor: appearanceChrome.subtleSurface, borderColor: appearanceChrome.cardBorder },
            { marginHorizontal: 16, marginTop: 12, marginBottom: 8 },
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
              <Text style={[styles.storeStateNoticeActionText, { color: stylesTokens.orange }]}>{supportActionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

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

      <View onLayout={(event) => setStickyThreshold(event.nativeEvent.layout.y)} style={[styles.sectionHeader, { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }]}>
        <Text style={[styles.sectionTitle, { color: appearanceChrome.primaryText }]}>قائمة الأصناف</Text>
      </View>
    </>
  );
});
