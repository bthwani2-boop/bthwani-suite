import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
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
import { useStoreGestureHandlers } from '../../hooks/useStoreGestureHandlers';
import { useStoreInlineSearch } from '../../hooks/useStoreInlineSearch';
import { useStoreMeasurementState } from '../../hooks/useStoreMeasurementState';
import { useStoreImageViewerState } from '../../hooks/useStoreImageViewerState';
import { useStoreShellDerivedState } from '../../hooks/useStoreShellDerivedState';
import { StoreMeasurementSheet } from '../../sheets/StoreMeasurementSheet';
import type { DshStoreGetScreenShellProps } from '../../contracts/dsh-store-screen-props';
import type { DshStoreMenuItem as DshStoreGetMenuItem } from '../../../shared/products';
import { resolveMeasurementOptions } from '../../../shared/stores';
import { StoreHeroSection } from './StoreHeroSection';
import { StoreImageViewerSheet } from './StoreImageViewerSheet';
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
  viewerItems,
}: DshStoreGetScreenShellProps) {
  const { tokens } = useBThwaniAppearance();
  const { mode: themeMode, theme } = useTheme();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const isDarkGlass = appearanceMode === 'darkGlass' || themeMode === 'dark';
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
  const { selectedMode, setSelectedMode, selectedCategory, setSelectedCategory, pickerItem, setPickerItem, pickerAnchor, setPickerAnchor } = storeState;
  const { selectedMeasureOption, setSelectedMeasureOption, selectedMeasureQty, setSelectedMeasureQty, headerSearchVisible, setHeaderSearchVisible, headerSearchQuery, setHeaderSearchQuery } = storeState;
  const { addedItemLabel, setAddedItemLabel, viewerItem, setPreviewItem, favoriteIds, setFavoriteIds, isAddedToCart, setIsAddedToCart } = storeState;
  const { stickyThreshold, setStickyThreshold, viewerActiveIndex, setPreviewActiveIndex } = storeState;
  const { clientVisibleItems, categories, deliveryModes } = derivedItems;
  const appearanceChrome = useStoreAppearanceChrome({ isDarkGlass, tokens });

  const { viewerAnim, openImageViewer, closeImageViewer } = useStoreImageViewerState({ setPreviewItem, setPreviewActiveIndex, viewerItems });

  // Derived store display values, operational/visibility state, and share/preview/toggle handlers owned by hook
  const {
    storeCoverImageSource,
    storeLogoImageSource,
    normalizedStoreName,
    normalizedStoreSubtitle,
    normalizedEtaLabel,
    operationalState,
    storeVisibility,
    operationalStateMeta,
    showOperationalNotice,
    supportActionLabel,
    handleStoreShare,
    openStoreItemPreview,
    handleToggleFavorite,
  } = useStoreShellDerivedState(store, openImageViewer, setFavoriteIds);

  React.useEffect(() => {
    if (deliveryModes.length && !deliveryModes.some((mode) => mode.id === selectedMode)) {
      setSelectedMode(deliveryModes[0].id);
    }
  }, [deliveryModes, selectedMode, setSelectedMode]);
  React.useEffect(() => {
    if (categories.length && !categories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory(categories[0]?.id ?? 'all');
    }
  }, [categories, selectedCategory, setSelectedCategory]);

  const listRef = React.useRef<FlatList<DshStoreGetMenuItem> | null>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const menuListRef = React.useRef<FlatList<DshStoreGetMenuItem> | null>(null);
  const menuScrollY = React.useRef(new Animated.Value(0)).current;

  const { openInlineSearch, closeInlineSearch } = useStoreInlineSearch({ headerSearchVisible, setHeaderSearchVisible, headerSearchQuery, setHeaderSearchQuery });
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

  const { panResponder } = useStoreGestureHandlers({
    viewerActiveIndex,
    viewerItems,
    isRTL,
    setPreviewActiveIndex,
    setPreviewItem,
    menuListRef,
  });

  const activeMeasurementOptions = React.useMemo(() => (pickerItem ? resolveMeasurementOptions(pickerItem) : []), [pickerItem]);
  const measurePopoverTop = React.useMemo(() => Math.max(180, Math.min(pickerAnchor.y - 170, 640)), [pickerAnchor.y]);
  const measurementAppearance = useStoreMeasurementAppearance({ appearanceChrome, isDarkGlass, theme, tokens });

  const listHeader = React.useMemo(() => (
    <StoreHeroSection
      store={store}
      storeText={storeText}
      visibleItems={visibleItems}
      clientVisibleItems={clientVisibleItems}
      menuItems={menuItems}
      normalizedStoreName={normalizedStoreName}
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
      isRTL={isRTL}
      styles={styles}
      openInlineSearch={openInlineSearch}
      onBack={_onBack}
    />
  ), [appearanceChrome, changeCategory, clientVisibleItems, deliveryModes, handleStoreShare, isRTL, menuItems, normalizedEtaLabel, normalizedStoreName, onOpenBenefits, onOpenCart, onOpenItems, onSupport, openInlineSearch, openStoreItemPreview, operationalState, operationalStateMeta, scrollY, selectedMode, setSelectedMode, setStickyThreshold, showOperationalNotice, stickyThreshold, store, storeCoverImageSource, storeLogoImageSource, storeText, supportActionLabel, visibleItems, viewportWidth, _onBack]);

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
        openImageViewer={openImageViewer}
        handleToggleFavorite={handleToggleFavorite}
        isDarkGlass={isDarkGlass}
        stickyThreshold={stickyThreshold}
        appearanceChrome={appearanceChrome}
        tokens={tokens}
        styles={styles}
      />

      <StoreImageViewerSheet
        viewerItem={viewerItem}
        viewerItems={viewerItems}
        viewerAnim={viewerAnim}
        panResponder={panResponder}
        menuListRef={menuListRef}
        menuScrollY={menuScrollY}
        viewportHeight={viewportHeight}
        viewportWidth={viewportWidth}
        viewerActiveIndex={viewerActiveIndex}
        setPreviewActiveIndex={setPreviewActiveIndex}
        setPreviewItem={setPreviewItem}
        closeImagePreview={closeImageViewer}
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
