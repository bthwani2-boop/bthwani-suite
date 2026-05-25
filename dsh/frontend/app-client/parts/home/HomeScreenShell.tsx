import * as React from 'react';
import { Platform, SectionList, View } from 'react-native';
import { BThwaniFilterSwipeBoundary, StateView, spacing } from '@bthwani/ui-kit';

import { HomeFilterRailSection } from './HomeFilterRailSection';
import { HomeHeaderSection } from './HomeHeaderSection';
import { HomeCategoryDialSection, HomeServiceDialSection } from './HomeOrbitSections';
import { HomePromoSection } from './HomePromoSection';
import { HomeStoreFeedSection } from './HomeStoreFeedSection';
import { HomeVideoReelsSection } from './HomeVideoReelsSection';

function renderState(state: any, onRetry?: () => void) {
  const titles: any = {
    loading: 'جاري التحميل...',
    empty: 'لا توجد بيانات عرض بعد',
    offline: 'أنت غير متصل بالإنترنت',
    disabled: 'الواجهة الرئيسية موقوفة مؤقتاً',
    error: 'تعذر تحميل الواجهة الرئيسية',
  };
  const descriptions: any = {
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
  activeHomeStoreCards,
  selectCategoryPage,
  selectedCategoryFixture,
  selectedCategoryLabel,
  filterRail,
  bannerItems,
  activeHomePromo,
  videoHandlers,
  ticker,
  openInlineSearch,
  closeInlineSearch,
  openServiceDial,
  categoriesDialItems,
  activeCategoryDialItem,
  selectedSubcategoryCards,
}: any) {
  const fallbackCategoriesDialLayout = React.useMemo(() => ({
    x: isRtl ? Math.max(spacing[3], viewportWidth - spacing[3] - 54) : spacing[3],
    y: spacing[14],
    width: 54,
    height: 54,
  }), [isRtl, viewportWidth]);

  const openCategoriesDial = React.useCallback(() => {
    const openSheet = (layout?: any) => {
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
    () => activeHomeStoreCards.length ? activeHomeStoreCards : ['empty'],
    [activeHomeStoreCards],
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
          keyExtractor={(item: any, index) => (item === 'empty' ? `empty-${index}` : item.storeId)}
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
              bannerItems={bannerItems}
              activeHomePromo={activeHomePromo}
              promoHandlers={promoHandlers}
              selectedCategoryFixture={selectedCategoryFixture}
              selectedCategoryLabel={selectedCategoryLabel}
              selectedSubcategoryCards={selectedSubcategoryCards}
              activeCategoryDialItem={activeCategoryDialItem}
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
          renderItem={({ item: entry }: any) => (
            <HomeStoreFeedSection
              entry={entry}
              props={props}
              styles={styles}
              homeState={homeState}
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
        categoriesDialItems={categoriesDialItems}
        selectCategoryPage={selectCategoryPage}
      />
      <HomeServiceDialSection props={props} homeState={homeState} />
    </View>
  );
});
