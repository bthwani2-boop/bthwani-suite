import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Share,
  StatusBar,
  Vibration,
  View,
} from 'react-native';
import {
  SearchTopBar,
  useBThwaniAppearance,
  useTheme,
  useUiText,
} from '@bthwani/ui-kit';
import { getDshClientStateMeta } from '../../data/client-state.preview-data';
import { useStoreGestureHandlers } from '../../hooks/useStoreGestureHandlers';
import { useStoreInlineSearch } from '../../hooks/useStoreInlineSearch';
import { useStoreMeasurementState } from '../../hooks/useStoreMeasurementState';
import { useStorePreviewState } from '../../hooks/useStorePreviewState';
import { StoreMeasurementSheet } from '../../sheets/StoreMeasurementSheet';
import type { DshStoreGetScreenShellProps } from '../../contracts/dsh-store-screen-props';
import { resolveDshImageSource } from '../../shared/resolve-image-source';
import {
  normalizeDisplayText,
  normalizeTagLabel,
  resolveMeasurementOptions,
  resolveStoreOperationalState,
} from '../../shared/store-formatting';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../../shared/dshStoreProductCardModel';
import { resolveDshStoreClientVisibility } from '../../../shared/dsh-client-visibility.model';
import { StoreHeroSection } from './StoreHeroSection';
import { StoreImagePreviewSheet } from './StoreImagePreviewSheet';
import { StoreMenuListSection } from './StoreMenuListSection';
import {
  StoreMissingState,
  StoreNonReadyState,
  StoreVisibilityBlockedState,
} from './StoreNonReadyState';
import { useStoreAppearanceChrome, useStoreMeasurementAppearance } from './store-appearance-chrome';
import { styles } from './store-screen.styles';
declare const __DEV__: boolean | undefined;
export const StoreScreenShell = React.memo(function StoreScreenShellComponent({
  appearanceMode,
  state = 'ready',
  store,
  menuItems = [],
  onOpenItems,
  onOpenCart,
  onAddItemToCart,
  onOpenBenefits,
  onBack: _onBack,
  onRetry,
  onSupport,
  isRTL,
  storeState,
  derivedItems,
  visibleItems,
  previewItems,
}: DshStoreGetScreenShellProps) {
  const { tokens } = useBThwaniAppearance();
  const { mode: themeMode, theme } = useTheme();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const isDarkGlass = appearanceMode === 'darkGlass' || themeMode === 'dark';
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
  const { selectedMode, setSelectedMode, selectedCategory, setSelectedCategory } = storeState;
  const { pickerItem, setPickerItem, pickerAnchor, setPickerAnchor } = storeState;
  const { selectedMeasureOption, setSelectedMeasureOption, selectedMeasureQty, setSelectedMeasureQty } = storeState;
  const { headerSearchVisible, setHeaderSearchVisible, headerSearchQuery, setHeaderSearchQuery } = storeState;
  const { addedItemLabel, setAddedItemLabel, previewItem, setPreviewItem } = storeState;
  const { favoriteIds, setFavoriteIds, isAddedToCart, setIsAddedToCart } = storeState;
  const { stickyThreshold, setStickyThreshold, previewActiveIndex, setPreviewActiveIndex } = storeState;
  const { clientVisibleItems, categories, deliveryModes } = derivedItems;
  const appearanceChrome = useStoreAppearanceChrome({ isDarkGlass, tokens });
  React.useEffect(() => {
    if (deliveryModes.length && !deliveryModes.some((mode: any) => mode.id === selectedMode)) {
      setSelectedMode(deliveryModes[0].id);
    }
  }, [deliveryModes, selectedMode, setSelectedMode]);
  React.useEffect(() => {
    if (categories.length && !categories.some((category: any) => category.id === selectedCategory)) {
      setSelectedCategory(categories[0]?.id ?? 'all');
    }
  }, [categories, selectedCategory, setSelectedCategory]);
  const storeCoverImageSource = React.useMemo(() => store ? resolveDshImageSource(store.imageUri) : undefined, [store]);
  const storeLogoImageSource = React.useMemo(
    () => store ? resolveDshImageSource(store.logoImageUri) || resolveDshImageSource('dsh.brand.logo.v1') : undefined,
    [store],
  );
  const listRef = React.useRef<any>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const previewListRef = React.useRef<any>(null);
  const previewScrollY = React.useRef(new Animated.Value(0)).current;
  const normalizedStoreName = normalizeDisplayText(store?.name);
  const normalizedStoreSubtitle = normalizeDisplayText(store?.subtitle);
  const normalizedEtaLabel = normalizeDisplayText(store?.etaLabel);
  const handleToggleFavorite = React.useCallback((id: string) => {
    setFavoriteIds((prev: ReadonlySet<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [setFavoriteIds]);
  const { openInlineSearch, closeInlineSearch } = useStoreInlineSearch({
    headerSearchVisible,
    setHeaderSearchVisible,
    headerSearchQuery,
    setHeaderSearchQuery,
  });
  const { previewAnim, openImagePreview, closeImagePreview } = useStorePreviewState({
    setPreviewItem,
    setPreviewActiveIndex,
    previewItems,
  });
  const {
    openMeasurementPicker,
    closeMeasurementPicker,
    handleAddToCart,
    handleGoToCart,
    handleContinueShopping,
  } = useStoreMeasurementState({
    setPickerItem,
    setSelectedMeasureOption,
    setSelectedMeasureQty,
    setPickerAnchor,
    setIsAddedToCart,
    setAddedItemLabel,
    onAddItemToCart,
    onOpenCart,
    pickerItem,
    selectedMeasureOption,
    selectedMeasureQty,
    selectedMode,
    resolveMeasurementOptions,
  });

  const changeCategory = React.useCallback((newId: string) => {
    if (newId === selectedCategory) return;
    setSelectedCategory(newId);
    if (Platform.OS !== 'web') Vibration.vibrate(8);
  }, [selectedCategory, setSelectedCategory]);

  const { previewPanResponder } = useStoreGestureHandlers({
    previewActiveIndex,
    previewItems,
    isRTL,
    setPreviewActiveIndex,
    setPreviewItem,
    previewListRef,
  });
  const activeMeasurementOptions = React.useMemo(
    () => (pickerItem ? resolveMeasurementOptions(pickerItem) : []),
    [pickerItem],
  );
  const measurePopoverTop = React.useMemo(
    () => Math.max(180, Math.min(pickerAnchor.y - 170, 640)),
    [pickerAnchor.y],
  );
  const measurementAppearance = useStoreMeasurementAppearance({ appearanceChrome, isDarkGlass, theme, tokens });

  const operationalState = React.useMemo(
    () => resolveStoreOperationalState(store?.statusLabel ?? '', store?.deliveryLabel, store?.serviceLabel),
    [store?.deliveryLabel, store?.serviceLabel, store?.statusLabel],
  );
  const storeVisibility = React.useMemo(() => resolveDshStoreClientVisibility({
    publishStage: store?.publishStage,
    deliveryModesReady: Boolean(store?.deliveryModes?.some((mode) => mode.isAvailable)),
    serviceabilityAvailable: operationalState !== 'area_unserviceable',
    serviceLabel: store?.serviceLabel,
    deliveryLabel: store?.deliveryLabel,
    storeOpen: operationalState === 'store_open',
    inZone: operationalState !== 'area_unserviceable',
  }), [operationalState, store?.deliveryLabel, store?.deliveryModes, store?.publishStage, store?.serviceLabel]);
  const operationalStateMeta = React.useMemo(() => getDshClientStateMeta(operationalState), [operationalState]);
  const showOperationalNotice = operationalState !== 'store_open';
  const supportActionLabel = operationalState === 'area_unserviceable' ? 'تحديث العنوان أو طلب الدعم' : 'طلب الدعم';
  const handleStoreShare = React.useCallback(async () => {
    try {
      await Share.share({ title: normalizedStoreName, message: `${normalizedStoreName} • ${normalizedStoreSubtitle}` });
    } catch {
      // sharing may be dismissed without completing the action
    }
  }, [normalizedStoreName, normalizedStoreSubtitle]);
  const openStoreItemPreview = React.useCallback((item?: DshStoreGetMenuItem | null) => {
    if (item) openImagePreview(item);
  }, [openImagePreview]);

  const listHeader = React.useMemo(() => (
    <>
      <StoreHeroSection
        store={store}
        storeText={storeText}
        visibleItems={visibleItems}
        clientVisibleItems={clientVisibleItems}
        menuItems={menuItems}
        normalizedStoreName={normalizedStoreName}
        normalizedStoreSubtitle={normalizedStoreSubtitle}
        normalizedEtaLabel={normalizedEtaLabel}
        storeCoverImageSource={storeCoverImageSource}
        storeLogoImageSource={storeLogoImageSource}
        operationalState={operationalState}
        operationalStateMeta={operationalStateMeta}
        showOperationalNotice={showOperationalNotice}
        supportActionLabel={supportActionLabel}
        onSupport={onSupport}
        onOpenCart={onOpenCart}
        onOpenItems={onOpenItems}
        onOpenBenefits={onOpenBenefits}
        handleStoreShare={handleStoreShare}
        openStoreItemPreview={openStoreItemPreview}
        changeCategory={changeCategory}
        setSelectedMode={setSelectedMode}
        selectedMode={selectedMode}
        deliveryModes={deliveryModes}
        scrollY={scrollY}
        stickyThreshold={stickyThreshold}
        setStickyThreshold={setStickyThreshold}
        viewportWidth={viewportWidth}
        appearanceChrome={appearanceChrome}
        isDarkGlass={isDarkGlass}
        isRTL={isRTL}
        styles={styles}
        openInlineSearch={openInlineSearch}
      />
    </>
  ), [appearanceChrome, changeCategory, clientVisibleItems, deliveryModes, handleStoreShare, isDarkGlass, isRTL, menuItems, normalizedEtaLabel, normalizedStoreName, normalizedStoreSubtitle, onOpenBenefits, onOpenCart, onOpenItems, onSupport, openInlineSearch, openStoreItemPreview, operationalState, operationalStateMeta, scrollY, selectedMode, setSelectedMode, setStickyThreshold, showOperationalNotice, stickyThreshold, store, storeCoverImageSource, storeLogoImageSource, storeText, supportActionLabel, visibleItems, viewportWidth]);

  if (state !== 'ready') {
    return (
      <StoreNonReadyState
        state={state}
        storeText={storeText}
        onRetry={onRetry}
        screenBackground={appearanceChrome.screenBackground}
        styles={styles}
      />
    );
  }
  if (!store) {
    return <StoreMissingState storeText={storeText} />;
  }
  if (!storeVisibility.visible && !__DEV__) {
    return <StoreVisibilityBlockedState storeVisibility={storeVisibility} onBack={_onBack} />;
  }

  return (
    <View style={[styles.screen, { backgroundColor: appearanceChrome.screenBackground }]}>
      <StatusBar animated barStyle={isDarkGlass ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      {storeCoverImageSource ? (
        <View style={styles.cbContainer} pointerEvents="none">
          <Image source={storeCoverImageSource} style={[styles.cbImage, { opacity: appearanceChrome.echoImageOpacity, transform: [{ scale: 1.1 }] }]} blurRadius={3} resizeMode="cover" />
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
        />
      )}

      <StoreMenuListSection
        listRef={listRef}
        scrollY={scrollY}
        visibleItems={visibleItems}
        categories={categories}
        selectedCategory={selectedCategory}
        changeCategory={changeCategory}
        listHeader={listHeader}
        headerSearchQuery={headerSearchQuery}
        normalizedStoreName={normalizedStoreName}
        storeText={storeText}
        storeLogoImageSource={storeLogoImageSource}
        favoriteIds={favoriteIds}
        openMeasurementPicker={openMeasurementPicker}
        openImagePreview={openImagePreview}
        handleToggleFavorite={handleToggleFavorite}
        isDarkGlass={isDarkGlass}
        stickyThreshold={stickyThreshold}
        appearanceChrome={appearanceChrome}
        tokens={tokens}
        styles={styles}
      />

      <StoreImagePreviewSheet
        previewItem={previewItem}
        previewItems={previewItems}
        previewAnim={previewAnim}
        previewPanResponder={previewPanResponder}
        previewListRef={previewListRef}
        previewScrollY={previewScrollY}
        viewportHeight={viewportHeight}
        viewportWidth={viewportWidth}
        previewActiveIndex={previewActiveIndex}
        setPreviewActiveIndex={setPreviewActiveIndex}
        setPreviewItem={setPreviewItem}
        closeImagePreview={closeImagePreview}
        appearanceChrome={appearanceChrome}
        styles={styles}
        isRTL={isRTL}
        favoriteIds={favoriteIds}
        store={store}
        normalizedStoreName={normalizedStoreName}
        storeLogoImageSource={storeLogoImageSource}
        handleToggleFavorite={handleToggleFavorite}
        openMeasurementPicker={openMeasurementPicker}
      />

      <StoreMeasurementSheet
        pickerItem={pickerItem}
        activeMeasurementOptions={activeMeasurementOptions}
        selectedMeasureOption={selectedMeasureOption}
        setSelectedMeasureOption={setSelectedMeasureOption}
        selectedMeasureQty={selectedMeasureQty}
        setSelectedMeasureQty={setSelectedMeasureQty}
        isAddedToCart={isAddedToCart}
        addedItemLabel={addedItemLabel}
        measurePopoverTop={measurePopoverTop}
        appearance={measurementAppearance}
        onClose={closeMeasurementPicker}
        onAddToCart={handleAddToCart}
        onGoToCart={handleGoToCart}
        onContinueShopping={handleContinueShopping}
      />
    </View>
  );
});

export default StoreScreenShell;
export type { DshStoreGetScreenProps, DshStoreGetScreenShellProps } from '../../contracts/dsh-store-screen-props';
