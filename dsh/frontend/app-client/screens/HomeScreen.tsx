import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { useDirection, useTheme, useUiText } from '@bthwani/ui-kit';

import { useHomeState } from '../hooks/useHomeState';
import { useHomeBackHandler } from '../hooks/useHomeBackHandler';
import { useHomeDerivedStores } from '../hooks/useHomeDerivedStores';
import { useHomePromoHandlers } from '../hooks/useHomePromoHandlers';
import { useHomeFilterRail } from '../hooks/useHomeFilterRail';
import { useHomeVideoHandlers } from '../hooks/useHomeVideoHandlers';
import { useHomeTickerState } from '../hooks/useHomeTickerState';
import { useDebounce } from '../hooks/useDebounce';
import { resolveDshImageSource } resolve-image-source';
import { HomeScreenShell } from '../parts/home/HomeScreenShell';
import { buildHomeScreenStyles } from '../parts/home/home-screen.styles';
import type { DshHomeGetPromo, DshHomeGetStore } from '../contracts/dsh-home-types';
import type { DshHomeGetScreenProps } from '../contracts/dsh-home-screen-props';
function resolveDshHomeBannerImageSource(imageUrl?: string): ReturnType<typeof resolveDshImageSource> {
  return resolveDshImageSource(imageUrl);
}

export const DshHomeGetScreen = React.memo(function DshHomeGetScreenComponent(
  props: DshHomeGetScreenProps
) {
  const { state = 'ready', categories, promos, stores, homePromos, approvedVideoShorts = [] } = props;
  const { onOpenList, onOpenCategory, onOpenDiscovery, onOpenStoreCategory, onOpenProduct } = props;
  const { onOpenBenefits, onOpenSearch, onOpenCart, onOpenOrders, onOpenTracking, onOpenStore } = props;
  const { onOpenMySpace, onOpenSheinInfo, onOpenEntry, onRegisterBackHandler, onRetry } = props;
  const { onPromoClick, onPromoImpression, onVideoCtaClick } = props;
  const { sheinInlineVisible = false, awnakInlineVisible = false } = props;
  const { favoriteOverrides, serviceDialTrigger, searchAutoOpenToken = 0 } = props;

  const { direction, language: resolvedLanguage } = useDirection();
  const currentLanguage = resolvedLanguage ?? 'ar';
  const isRtl = direction === 'rtl';
  const { width: viewportWidth } = useWindowDimensions();
  const { theme } = useTheme();
  const uiText = useUiText();
  const styles = React.useMemo(() => buildHomeScreenStyles(direction, theme), [direction, theme]);
  const categoriesAnchorRef = React.useRef<null>(null);

  const homeState = useHomeState();
  const favoriteToggles = favoriteOverrides ?? homeState.localFavoriteToggles;
  const lastSearchAutoOpenTokenRef = React.useRef(0);
  const debouncedInlineSearchQuery = useDebounce(homeState.inlineSearchQuery, 250);

  const derivedStores = useHomeDerivedStores({
    stores,
    homePromos,
    categories,
    activeCategoryId: homeState.activeCategoryId,
    activeFilter: homeState.activeFilter,
    favoriteToggles,
    followToggles: homeState.followToggles,
    followCounts: homeState.followCounts,
    debouncedInlineSearchQuery,
  });

  React.useEffect(() => {
    if (serviceDialTrigger) {
      homeState.setServiceDialVisible(true);
    }
  }, [serviceDialTrigger, homeState.setServiceDialVisible]);

  React.useEffect(() => {
    if (!searchAutoOpenToken || searchAutoOpenToken === lastSearchAutoOpenTokenRef.current) {
      return;
    }
    lastSearchAutoOpenTokenRef.current = searchAutoOpenToken;
    homeState.setInlineSearchQuery('');
    homeState.setInlineSearchVisible(true);
  }, [searchAutoOpenToken, homeState.setInlineSearchQuery, homeState.setInlineSearchVisible]);

  const handleOpenMySpace = React.useCallback(() => {
    if (onOpenMySpace) {
      onOpenMySpace();
      return;
    }
    onOpenEntry?.();
  }, [onOpenEntry, onOpenMySpace]);

  const handleOpenCartFromHeader = React.useCallback(() => {
    onOpenCart?.();
  }, [onOpenCart]);

  const resolvedCategories = React.useMemo(() => categories ?? [], [categories]);
  const categoryItems = React.useMemo(() => resolvedCategories, [resolvedCategories]);

  const promoHandlers = useHomePromoHandlers({
    categoryItems,
    promos,
    activePromoIndex: homeState.activePromoIndex,
    resolveBannerImageSource: resolveDshHomeBannerImageSource,
    setActiveCategoryId: homeState.setActiveCategoryId,
    setActiveSubcategoryId: homeState.setActiveSubcategoryId,
    setActiveFilter: homeState.setActiveFilter,
    setInlineSearchVisible: homeState.setInlineSearchVisible,
    onPromoClick,
    onPromoImpression,
    onOpenSheinInfo,
    onOpenStore,
    onOpenDiscovery,
    onOpenList,
    onOpenOrders,
    onOpenTracking,
    onOpenBenefits,
    onOpenProduct,
    onOpenSearch,
    onOpenStoreCategory,
  });

  const selectCategoryPage = React.useCallback((categoryId: string, _animated = true) => {
    homeState.setActiveCategoryId(categoryId);
    homeState.setActiveSubcategoryId(null);
  }, [homeState.setActiveCategoryId, homeState.setActiveSubcategoryId]);

  React.useEffect(() => {
    if (!categoryItems.length) return;
    if (!homeState.activeCategoryId || homeState.activeCategoryId === 'all') return;
    if (!categoryItems.some((category) => category.id === homeState.activeCategoryId)) {
      homeState.setActiveCategoryId('all');
      homeState.setActiveSubcategoryId(null);
    }
  }, [homeState.activeCategoryId, categoryItems, homeState.setActiveCategoryId, homeState.setActiveSubcategoryId]);

  const filterRail = useHomeFilterRail({
    theme,
    styles,
    categoryItems,
    activeFilter: homeState.activeFilter,
    setActiveFilter: homeState.setActiveFilter,
    activeCategoryId: homeState.activeCategoryId,
    activeRailItemId: homeState.activeRailItemId,
    setActiveRailItemId: homeState.setActiveRailItemId,
    selectCategoryPage,
    onOpenCategory,
    onOpenSheinInfo,
  });

  React.useEffect(() => {
    const timer = globalThis.setInterval(() => {
      homeState.setCurrentTime(new Date());
    }, 60000);
    return () => globalThis.clearInterval(timer);
  }, [homeState.setCurrentTime]);

  useHomeBackHandler({
    categoriesSheetVisible: homeState.categoriesSheetVisible,
    shortsVisible: homeState.shortsVisible,
    inlineSearchVisible: homeState.inlineSearchVisible,
    serviceDialVisible: homeState.serviceDialVisible,
    activeCategoryId: homeState.activeCategoryId,
    categoryItems,
    sheinInlineVisible,
    awnakInlineVisible,
    selectCategoryPage,
    setCategoriesSheetVisible: homeState.setCategoriesSheetVisible,
    setInlineSearchQuery: homeState.setInlineSearchQuery,
    setInlineSearchVisible: homeState.setInlineSearchVisible,
    setServiceDialVisible: homeState.setServiceDialVisible,
    setShortsVisible: homeState.setShortsVisible,
    onRegisterBackHandler,
  });

  const activeHomePromo = derivedStores.resolvedHomePromos[0] ?? null;

  const videoHandlers = useHomeVideoHandlers({
    categoryItems,
    approvedVideoShorts,
    resolveTargetPartnerStatus: derivedStores.resolveTargetPartnerStatus,
    setActiveCategoryId: homeState.setActiveCategoryId,
    setActiveSubcategoryId: homeState.setActiveSubcategoryId,
    setShortsVisible: homeState.setShortsVisible,
    onVideoCtaClick,
    onOpenSheinInfo,
    onOpenList,
    onOpenStore,
    onOpenDiscovery,
    onOpenStoreCategory,
    onOpenProduct,
    onOpenBenefits,
    onOpenSearch,
  });

  const ticker = useHomeTickerState({
    isTickerHidden: homeState.isTickerHidden,
    currentTime: homeState.currentTime,
    currentLanguage,
    tickerAction: promoHandlers.tickerAction,
    onOpenOrders,
    onOpenTracking,
    onOpenDiscovery,
  });

  const openInlineSearch = React.useCallback(() => {
    homeState.setInlineSearchVisible(true);
  }, [homeState.setInlineSearchVisible]);

  const closeInlineSearch = React.useCallback(() => {
    homeState.setInlineSearchVisible(false);
    homeState.setInlineSearchQuery('');
  }, [homeState.setInlineSearchQuery, homeState.setInlineSearchVisible]);

  const openServiceDial = React.useCallback(() => {
    homeState.setServiceDialVisible(true);
  }, [homeState.setServiceDialVisible]);

  return (
    <HomeScreenShell
      props={props}
      state={state}
      onRetry={onRetry}
      isRtl={isRtl}
      viewportWidth={viewportWidth}
      theme={theme}
      uiText={uiText}
      styles={styles}
      categoriesAnchorRef={categoriesAnchorRef}
      homeState={homeState}
      derivedStores={derivedStores}
      debouncedInlineSearchQuery={debouncedInlineSearchQuery}
      handleOpenMySpace={handleOpenMySpace}
      handleOpenCartFromHeader={handleOpenCartFromHeader}
      promoHandlers={promoHandlers}
      selectCategoryPage={selectCategoryPage}
      filterRail={filterRail}
      activeHomePromo={activeHomePromo}
      videoHandlers={videoHandlers}
      ticker={ticker}
      openInlineSearch={openInlineSearch}
      closeInlineSearch={closeInlineSearch}
      openServiceDial={openServiceDial}
    />
  );
});

export type { DshHomeGetPromo, DshHomeGetScreenProps, DshHomeGetStore };
