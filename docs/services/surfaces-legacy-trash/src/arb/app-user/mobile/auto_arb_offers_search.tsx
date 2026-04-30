// arb_offers_search — ARB_UX_SPEC_FINAL
// Surface: app-client | Service: arb
// Smart Default "عروض لليوم في مدينتي"، سلايدر فئات، بطاقات أكبر، انتقال لـ ArbOfferGet

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { ArbCategoryPill, ArbOfferCard, ArbHorizontalSlider } from '../components';
import { resolveDevMediaUrl } from '../../../config';
import { buildArbOffersSearchMock, type OfferHit } from '../../hooks';

interface auto_arb_offers_searchProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string, params?: object) => void };
}

type CategoryId = 'all' | 'hotels' | 'chalets' | 'resorts' | 'apartments';

export const auto_arb_offers_search: React.FC<auto_arb_offers_searchProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('content');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [resultsShown, setResultsShown] = useState(false);

  const offers = useMemo(
    () => buildArbOffersSearchMock(t, resolveDevMediaUrl),
    [t]
  );

  const categories = useMemo(() => [
    { id: 'all' as CategoryId, label: t('surfaces.arb_category_all'), icon: '📋' },
    { id: 'hotels' as CategoryId, label: t('surfaces.arb_category_hotels'), icon: '🏨' },
    { id: 'chalets' as CategoryId, label: t('surfaces.arb_category_chalets'), icon: '🏝️' },
    { id: 'resorts' as CategoryId, label: t('surfaces.arb_category_resorts'), icon: '🌴' },
    { id: 'apartments' as CategoryId, label: t('surfaces.arb_category_apartments'), icon: '🏢' },
  ], [t]);

  const handleNavigate = useCallback(
    (screen: string, params?: object) => {
      if (navigation?.navigate) (navigation.navigate as (s: string, p?: object) => void)(screen, params);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  /** Smart Default: نقرة واحدة لعروض لليوم في مدينتي */
  const handleTodayInMyCity = () => {
    setState('loading');
    setResultsShown(true);
    setTimeout(() => setState('content'), 600);
  };

  const handleSearch = () => {
    setState('loading');
    setResultsShown(true);
    setTimeout(() => setState('content'), 600);
  };

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 500);
  };

  const handleOfferPress = (offer: OfferHit) => {
    handleNavigate('ArbOfferGet', { offerId: offer.id });
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, textAlignStart]}>{t('surfaces.arb_search_offers')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            {t('surfaces.arb_search_subtitle')}
          </Text>

          <TouchableOpacity
            style={styles.smartDefaultCard}
            onPress={handleTodayInMyCity}
            activeOpacity={0.78}
            hitSlop={{ top: 8, bottom: 8, [isRTL ? 'right' : 'left']: 8, [isRTL ? 'left' : 'right']: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`${t('surfaces.arb_smart_default_title')}, ${t('surfaces.arb_smart_default_hint')}`}
          >
            <Text style={[styles.smartDefaultLabel, textAlignStart]}>{t('surfaces.arb_smart_default_title')}</Text>
            <Text style={[styles.smartDefaultHint, textAlignStart]}>{t('surfaces.arb_smart_default_hint')}</Text>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('surfaces.arb_search_placeholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType='search'
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSearch}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('surfaces.arb_show_results')}
            >
              <Text style={styles.primaryButtonText}>{t('surfaces.arb_show_results')}</Text>
            </TouchableOpacity>
          </View>

          {/* سلايدر فئات — ArbCategoryPill */}
          <View style={styles.categoriesContainer}>
            <ArbHorizontalSlider>
              {categories.map(cat => (
                <ArbCategoryPill
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon}
                  active={activeCategory === cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                />
              ))}
            </ArbHorizontalSlider>
          </View>

          {/* Results List — ArbOfferCard عمودي؛ حالة فارغة عند عدم وجود نتائج */}
          {resultsShown && (
            <>
              <Text style={[styles.resultsLabel, textAlignStart]}>
                {activeCategory === 'all' ? t('surfaces.arb_results_label') : categories.find(c => c.id === activeCategory)?.label}
              </Text>
              {offers.length > 0 ? (
                <View style={styles.resultsList}>
                  {offers.map(item => (
                    <View key={item.id} style={styles.resultCardWrap}>
                      <ArbOfferCard
                        id={item.id}
                        title={item.title}
                        location={item.location}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        rating={item.rating}
                        reviews={item.reviews}
                        variant='vertical'
                        onPress={() => handleOfferPress(item)}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyResults}>
                  <Text style={styles.emptyResultsTitle}>{t('surfaces.arb_empty_search')}</Text>
                  <Text style={styles.emptyResultsHint}>{t('surfaces.arb_empty_search_hint')}</Text>
                </View>
              )}
            </>
          )}

          {!resultsShown && (
            <Text style={styles.hintText}>{t('surfaces.arb_hint_tap_smart')}</Text>
          )}

          <View style={styles.listFooter} />
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.arb_search_loading')}
      errorMessage={t('surfaces.arb_search_error')}
      onErrorAction={handleRetry}
      screenName='auto_arb_offers_search'
      operationName='arb_offers_search'
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  smartDefaultCard: {
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  smartDefaultLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
  },
  smartDefaultHint: {
    fontSize: 13,
    color: (semanticRoles.primaryCTAText ?? semanticRoles.textInverse) as string,
    opacity: 0.9,
    marginTop: BTHWANI_SPACING.xs,
  },
  searchContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
    fontWeight: '600',
    fontSize: 15,
  },
  categoriesContainer: {
    marginTop: BTHWANI_SPACING.sm,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  resultsLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.lg,
  },
  resultsList: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
  },
  resultCardWrap: {
    marginBottom: BTHWANI_SPACING.md,
  },
  hintText: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.xl,
  },
  emptyResults: {
    paddingVertical: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  emptyResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
  emptyResultsHint: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  listFooter: {
    height: BTHWANI_SPACING.xl,
  },
});

export default auto_arb_offers_search;

