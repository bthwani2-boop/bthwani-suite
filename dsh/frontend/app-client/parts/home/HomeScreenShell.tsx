import * as React from 'react';
import { Platform, SectionList, View } from 'react-native';
import { BThwaniFilterSwipeBoundary, StateView, spacing } from '@bthwani/ui-kit';

import { HomeFilterRailSection } from './HomeFilterRailSection';
import { HomeHeaderSection } from './HomeHeaderSection';
import { HomeCategoryDialSection, HomeServiceDialSection } from './HomeOrbitSections';
import { HomePromoSection } from './HomePromoSection';
import { HomeStoreFeedSection, type HomeStoreCardEntry } from './HomeStoreFeedSection';
import { HomeVideoReelsSection } from './HomeVideoReelsSection';
import type { DshHomeGetScreenProps, DshHomeCategory } from '../../contracts/dsh-home-types';
import type { useHomeState } from '../../hooks/useHomeState';
import type { useHomeDerivedStores } from '../../hooks/useHomeDerivedStores';
import type { useHomePromoHandlers } from '../../hooks/useHomePromoHandlers';
import type { useHomeFilterRail } from '../../hooks/useHomeFilterRail';
import type { useHomeVideoHandlers } from '../../hooks/useHomeVideoHandlers';
import type { useHomeTickerState } from '../../hooks/useHomeTickerState';

export interface HomeScreenShellProps {
  props: DshHomeGetScreenProps;
  state: 'loading' | 'empty' | 'offline' | 'disabled' | 'error' | 'ready' | string;
  onRetry?: () => void;
  isRtl: boolean;
  viewportWidth: number;
  theme: any;
  uiText: any;
  styles: any;
  categoriesAnchorRef: React.RefObject<any>;
  homeState: ReturnType<typeof useHomeState>;
  derivedStores: ReturnType<typeof useHomeDerivedStores>;
  promoHandlers: ReturnType<typeof useHomePromoHandlers>;
  filterRail: ReturnType<typeof useHomeFilterRail>;
  videoHandlers: ReturnType<typeof useHomeVideoHandlers>;
  ticker: ReturnType<typeof useHomeTickerState>;
  debouncedInlineSearchQuery: string;
  handleOpenMySpace: () => void;
  handleOpenCartFromHeader: () => void;
  selectCategoryPage: (categoryId: string, animated?: boolean) => void;
  activeHomePromo: any;
  openInlineSearch: () => void;
  closeInlineSearch: () => void;
  openServiceDial: () => void;
}

function renderState(state: 'loading' | 'empty' | 'offline' | 'disabled' | 'error' | 'ready' | string, onRetry?: () => void) {
  const titles: Record<string, string> = {
    loading: 'جاري التحميل...',
    empty: 'لا توجد بيانات عرض بعد',
    offline: 'أنت غير متصل بالإنترنت',
    disabled: 'الواجهة الرئيسية موقوفة مؤقتاً',
    error: 'تعذر تحميل الواجهة الرئيسية',
  };
  const descriptions: Record<string, string> = {
    loading: 'يرجى الانتظار بينما نقوم بتجهيز تجربتك المخصصة.',
    empty: 'أعد المحاولة لاستعادة الواجهة الرئيسية واختصاراتها.',
    offline: 'يرجى التحقق من اتصالك بالشبكة للمتابعة.',
    disabled: 'أبقِ المحاولة مرئية حتى تعود هذه الواجهة للخدمة.',
    error: 'أعد المحاولة ثم انتقل إلى الفئات أو الطلبات إذا لزم.',
  };
  return (
    <StateView
      stateId={state === 'offline' ? 'offline' : state === 'loading' ? 'loading' : state === 'disabled' ? 'warning' : 'recoverableError'}
      title={titles[state === 'error' ? 'error' : state] || titles.error}
      description={descriptions[state === 'error' ? 'error' : state] || descriptions.error}
      actionLabel={state !== 'loading' ? 'إعادة المحاولة' : undefined}
      onActionPress={onRetry}
    />
  );
}

export const HomeScreenShell = React.memo(function HomeScreenShellComponent({
  props,
  state,
  onRetry,
  isRtl,
  viewportWidth,
  theme,
  uiText,
  styles,
  categoriesAnchorRef,
  homeState,
  derivedStores,
  debouncedInlineSearchQuery,
  handleOpenMySpace,
  handleOpenCartFromHeader,
  promoHandlers,
  filterRail,
  videoHandlers,
  ticker,
  selectCategoryPage,
  activeHomePromo,
  openInlineSearch,
  closeInlineSearch,
  openServiceDial,
}: HomeScreenShellProps) {
  const fallbackCategoriesDialLayout = React.useMemo(() => ({
    x: isRtl ? Math.max(spacing[3], viewportWidth - spacing[3] - 54) : spacing[3],
    y: spacing[14],
    width: 54,
    height: 54,
  }), [isRtl, viewportWidth]);

  const openCategoriesDial = React.useCallback(() => {
    const openSheet = (layout?: { x: number; y: number; width: number; height: number }) => {
      homeState.setCategoriesDialLayout(layout ?? fallbackCategoriesDialLayout);
      homeState.setCategoriesSheetVisible(true);
    };
    if (!categoriesAnchorRef.current?.measureInWindow) {
      openSheet();
      return;
    }
    categoriesAnchorRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
      const hasValidLayout = [x, y, width, height].every((value) => Number.isFinite(value)) && width > 0 && height > 0;
      openSheet(hasValidLayout ? { x, y, width, height } : fallbackCategoriesDialLayout);
    });
  }, [fallbackCategoriesDialLayout, homeState, categoriesAnchorRef]);

  const listData = React.useMemo(
    () => derivedStores.activeHomeStoreCards.length ? derivedStores.activeHomeStoreCards : ['empty'],
    [derivedStores.activeHomeStoreCards],
  );
  const containerWidth = viewportWidth;
  const sidePeek = Math.max(spacing[1], Math.min(spacing[4], Math.round(containerWidth * 0.045)));
  const resolvedItemGap = Math.max(spacing[1], Math.min(spacing[2], Math.round(containerWidth * 0.018)));
  const baseCardWidth = Math.max(256, Math.min(326, Math.round(containerWidth - (sidePeek * 2) - (resolvedItemGap * 2))));
  const cardWidth = Math.max(220, Math.round(baseCardWidth * 0.84));
  const cardHeight = Math.max(160, Math.round(cardWidth * 0.78));

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  return (
    <View style={styles.screenRoot}>
      <HomeHeaderSection
        props={props}
        homeState={homeState}
        uiText={uiText}
        styles={styles}
        isRtl={isRtl}
        ticker={ticker}
        openInlineSearch={openInlineSearch}
        closeInlineSearch={closeInlineSearch}
        openServiceDial={openServiceDial}
        handleOpenCartFromHeader={handleOpenCartFromHeader}
        handleOpenMySpace={handleOpenMySpace}
      />

      <BThwaniFilterSwipeBoundary
        items={filterRail.homeFilterRailItems}
        selectedId={homeState.activeRailItemId}
        onSelectedIdChange={filterRail.handleHomeFilterRailChange}
        style={{ flex: 1 }}
        testID="home-filter-swipe-boundary"
      >
        <SectionList
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: spacing[3],
            paddingTop: spacing[0],
            paddingBottom: 150,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          sections={[{ data: listData }]}
          keyExtractor={(item: HomeStoreCardEntry | 'empty', index) => (item === 'empty' ? `empty-${index}` : item.storeId)}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews={Platform.OS !== 'web'}
          ListHeaderComponent={
            <HomePromoSection
              props={props}
              theme={theme}
              styles={styles}
              homeState={homeState}
              bannerItems={promoHandlers.bannerItems}
              activeHomePromo={activeHomePromo}
              promoHandlers={promoHandlers}
              selectedCategoryFixture={filterRail.selectedCategoryFixture}
              selectedCategoryLabel={filterRail.selectedCategoryLabel}
              selectedSubcategoryCards={filterRail.selectedSubcategoryCards}
              activeCategoryDialItem={filterRail.activeCategoryDialItem}
              categoriesAnchorRef={categoriesAnchorRef}
              openCategoriesDial={openCategoriesDial}
              containerWidth={containerWidth}
              cardHeight={cardHeight}
              resolvedItemGap={resolvedItemGap}
            />
          }
          renderSectionHeader={() => (
            <HomeFilterRailSection filterRail={filterRail} homeState={homeState} styles={styles} />
          )}
          renderItem={({ item: entry }: { item: HomeStoreCardEntry | 'empty' }) => (
            <HomeStoreFeedSection
              entry={entry}
              props={props}
              styles={styles}
              setLocalFavoriteToggles={homeState.setLocalFavoriteToggles}
              derivedStores={derivedStores}
              debouncedInlineSearchQuery={debouncedInlineSearchQuery}
              selectCategoryPage={selectCategoryPage}
            />
          )}
          ListFooterComponent={
            <HomeVideoReelsSection props={props} homeState={homeState} videoHandlers={videoHandlers} />
          }
        />
      </BThwaniFilterSwipeBoundary>

      <HomeCategoryDialSection
        props={props}
        homeState={homeState}
        categoriesDialItems={filterRail.categoriesDialItems}
        selectCategoryPage={selectCategoryPage}
      />
      <HomeServiceDialSection props={props} homeState={homeState} />
    </View>
  );
});
