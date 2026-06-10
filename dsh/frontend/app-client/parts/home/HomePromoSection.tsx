import * as React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { BannerCarousel, Icon, Text, colorPalette, spacing } from '@bthwani/ui-kit';

import { CategoryHubIcon, CategoryIconImage, CategorySelectorItem } from './HomeCategoryCarousel';
import { normalizeHomePromoActionType } from '../../shared/home-promo-mappers';
import type { DshHomeGetPromo } from '../../contracts/dsh-home-types';
import type { HomeScreenShellProps } from './HomeScreenShell';

const ACTIVE_PROMO_INTERVAL_MS = 5000;

type HomePromoSectionProps = Pick<HomeScreenShellProps, 'props' | 'theme' | 'styles' | 'homeState' | 'promoHandlers' | 'activeHomePromo' | 'categoriesAnchorRef'> & {
  bannerItems: HomeScreenShellProps['promoHandlers']['bannerItems'];
  selectedCategoryFixture: HomeScreenShellProps['filterRail']['selectedCategoryFixture'];
  selectedCategoryLabel: string;
  selectedSubcategoryCards: Array<{ id: string; emoji?: string; title: string; subtitle?: string }>;
  activeCategoryDialItem: HomeScreenShellProps['filterRail']['activeCategoryDialItem'];
  openCategoriesDial: () => void;
  containerWidth: number;
  cardHeight: number;
  resolvedItemGap: number;
};

export const HomePromoSection = React.memo(function HomePromoSection({
  props,
  theme,
  styles,
  homeState,
  bannerItems,
  activeHomePromo,
  promoHandlers,
  selectedCategoryFixture,
  selectedCategoryLabel,
  selectedSubcategoryCards,
  activeCategoryDialItem,
  categoriesAnchorRef,
  openCategoriesDial,
  containerWidth,
  cardHeight,
  resolvedItemGap,
}: HomePromoSectionProps) {
  return (
    <>
      {homeState.inlineSearchVisible ? null : bannerItems.length ? (
        <BannerCarousel
          banners={bannerItems as import('@bthwani/ui-kit').BannerCarouselItem[]}
          variant="secondary"
          height={cardHeight + spacing[6]}
          fullBleed={false}
          autoPlayInterval={ACTIVE_PROMO_INTERVAL_MS}
          itemGap={resolvedItemGap}
          onIndexChange={homeState.setActivePromoIndex}
          onBannerPress={(item) => {
            if (props.onPromoClick) props.onPromoClick(item.id);
          }}
          style={{
            marginLeft: -spacing[3],
            marginRight: -spacing[3],
            width: containerWidth,
          }}
        />
      ) : null}

      <View style={styles.categoriesSelectorSection}>
        <View style={styles.categoriesSelectorRow}>
          <View style={styles.fixedIconsContainer}>
            <CategorySelectorItem
              isVideo
              label="فيديو"
              icon={<Icon name="play" size={22} color={colorPalette.brand} />}
              onPress={() => homeState.setShortsVisible(true)}
              styles={styles}
              theme={theme}
            />

            <View ref={categoriesAnchorRef} collapsable={false}>
              <CategorySelectorItem
                isHub
                label="الفئات"
                icon={<CategoryHubIcon />}
                onPress={openCategoriesDial}
                styles={styles}
                theme={theme}
              />
            </View>

            {selectedCategoryFixture && (
              <CategorySelectorItem
                isSelected
                label={selectedCategoryLabel}
                icon={
                  <CategoryIconImage
                    uri={activeCategoryDialItem?.iconUrl ?? null}
                    emojiFallback={activeCategoryDialItem?.emojiFallback ?? '📂'}
                    style={styles.categoryIconImage}
                  />
                }
                onPress={() => homeState.setActiveSubcategoryId(null)}
                styles={styles}
                theme={theme}
              />
            )}
          </View>

          {activeHomePromo && (
            <Pressable
              style={styles.heroPromoCard}
              onPress={() => {
                const promo = activeHomePromo;
                const mockPromo: DshHomeGetPromo = {
                  id: promo.id,
                  title: promo.title,
                  subtitle: promo.subtitle,
                  icon: '✨',
                  actionType: normalizeHomePromoActionType(promo.targetType),
                  actionTarget: promo.targetId,
                };
                promoHandlers.resolveBannerPress(mockPromo)();
              }}
            >
              {activeHomePromo.imageUrl && (
                <Image
                  source={{ uri: activeHomePromo.imageUrl }}
                  style={styles.heroPromoBackground}
                  resizeMode="cover"
                />
              )}
              <View style={styles.heroPromoContent}>
                <View style={styles.heroPromoIconContainer}>
                  {activeHomePromo.thumbnail ? (
                    <Image
                      source={{ uri: activeHomePromo.thumbnail }}
                      style={styles.heroPromoMascot}
                      resizeMode="contain"
                    />
                  ) : (
                    <Icon name="ribbon-outline" size={32} color={colorPalette.warning} />
                  )}
                </View>
                <View style={styles.heroPromoTextWrap}>
                  <Text weight="black" style={styles.heroPromoTitle} numberOfLines={1}>
                    بثواني برو
                  </Text>
                  <Text weight="bold" style={styles.heroPromoSubtitle} numberOfLines={1}>
                    {activeHomePromo.subtitle}
                  </Text>
                  {activeHomePromo.ctaText && (
                    <View style={styles.heroPromoCtaButton}>
                      <Text weight="black" style={styles.heroPromoCtaText}>
                        {activeHomePromo.ctaText}
                      </Text>
                      <Icon name="chevron-back" size={10} color="var(--bthwani-brand-contrast)" />
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}

          {selectedSubcategoryCards.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.categoriesSelectorScrollContent}
              style={styles.categoriesSelectorScroll}
            >
              {selectedSubcategoryCards.map((subcategory) => (
                <Pressable
                  key={subcategory.id}
                  style={[
                    styles.subcategorySelectorCard,
                    homeState.activeSubcategoryId === subcategory.id && styles.subcategorySelectorCardActive,
                  ]}
                  onPress={() => homeState.setActiveSubcategoryId(subcategory.id)}
                >
                  <View style={styles.subcategoryIconContainer}>
                    <Text role="titleSm" style={styles.subcategoryEmoji}>
                      {subcategory.emoji}
                    </Text>
                  </View>
                  <Text
                    role="bodySm"
                    weight="bold"
                    style={[
                      styles.subcategoryName,
                      homeState.activeSubcategoryId === subcategory.id && styles.subcategoryNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {subcategory.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
});
