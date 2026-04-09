// KNZ Listings Search — حقل بحث + (اختياري) مدينة ونوع عرض → نقرة "بحث" تنقل لـ KnzListingsList مفلترة
// Surface: app-client | Service: knz
// §30 States: Content (أبسط مسار: اكتب ثم ابحث؛ خياراً حدد مدينة/نوع)
// Contract (Phase 0.3 خيار ب): النتائج عبر KnzListingsList بمعامل query، city، listingType، category.

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_CATEGORIES, KNZ_YEMEN_CITIES, KNZ_LISTING_TYPES } from '../../shared/knz-constants';

interface auto_knz_listings_searchProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
}

export const auto_knz_listings_search: React.FC<auto_knz_listings_searchProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const NS = 'knz.app-client.mobile.auto_knz_listings_search';
    const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedListingType, setSelectedListingType] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'popular'>('recent');

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const handleSearch = useCallback(() => {
    const q = query.trim();
    const params: Record<string, string> = {};
    if (q) params.query = q;
    if (selectedCity !== 'all') params.city = selectedCity;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedListingType !== 'all') params.listingType = selectedListingType;
    params.sort = selectedSort;
    handleNavigate('KnzListingsList', params);
  }, [query, selectedCity, selectedCategory, selectedListingType, selectedSort, handleNavigate]);

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t(`${NS}.title`)}</Text>
        <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, textAlignStart]}
            placeholder={t(`${NS}.placeholder`)}
            placeholderTextColor={semanticRoles.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>{t(`${NS}.searchButton`)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>{t(`${NS}.filterCityLabel`)}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedCity === 'all' && styles.filterChipSelected]}
              onPress={() => setSelectedCity('all')}
            >
              <Text style={[styles.filterChipText, selectedCity === 'all' && styles.filterChipTextSelected]}>{t('knz.app-client.mobile.auto_knz_listings_list.all')}</Text>
            </TouchableOpacity>
            {KNZ_YEMEN_CITIES.slice(0, 8).map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.filterChip, selectedCity === city && styles.filterChipSelected]}
                onPress={() => setSelectedCity(city)}
              >
                <Text style={[styles.filterChipText, selectedCity === city && styles.filterChipTextSelected]}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>التصنيف (اختياري)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipSelected]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextSelected]}>الكل</Text>
            </TouchableOpacity>
            {KNZ_CATEGORIES.slice(0, 8).map((c) => (
              <TouchableOpacity
                key={c.code}
                style={[styles.filterChip, selectedCategory === c.code && styles.filterChipSelected]}
                onPress={() => setSelectedCategory(c.code)}
              >
                <Text style={[styles.filterChipText, selectedCategory === c.code && styles.filterChipTextSelected]}>{c.labelAr}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>نوع العرض (اختياري)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedListingType === 'all' && styles.filterChipSelected]}
              onPress={() => setSelectedListingType('all')}
            >
              <Text style={[styles.filterChipText, selectedListingType === 'all' && styles.filterChipTextSelected]}>الكل</Text>
            </TouchableOpacity>
            {KNZ_LISTING_TYPES.map((t) => (
              <TouchableOpacity
                key={t.code}
                style={[styles.filterChip, selectedListingType === t.code && styles.filterChipSelected]}
                onPress={() => setSelectedListingType(t.code)}
              >
                <Text style={[styles.filterChipText, selectedListingType === t.code && styles.filterChipTextSelected]}>{t.labelAr}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>الترتيب</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedSort === 'recent' && styles.filterChipSelected]}
              onPress={() => setSelectedSort('recent')}
            >
              <Text style={[styles.filterChipText, selectedSort === 'recent' && styles.filterChipTextSelected]}>أحدث</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedSort === 'popular' && styles.filterChipSelected]}
              onPress={() => setSelectedSort('popular')}
            >
              <Text style={[styles.filterChipText, selectedSort === 'popular' && styles.filterChipTextSelected]}>الأكثر رواجاً</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>تصفح حسب التصنيف</Text>
          <View style={styles.chipsRow}>
            {KNZ_CATEGORIES.slice(0, 6).map((cat) => (
              <TouchableOpacity
                key={cat.code}
                style={styles.chip}
                onPress={() => handleNavigate('KnzListingsList', { category: cat.code })}
              >
                <Text style={styles.chipText}>{cat.labelAr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleNavigate('KnzListingCreate')}
        >
          <Text style={styles.addButtonText}>+ أضف إعلانك</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.lg,
  },
  input: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
  },
  searchButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderTopRightRadius: BTHWANI_RADIUS.lg - 1,
    borderBottomRightRadius: BTHWANI_RADIUS.lg - 1,
  },
  searchButtonText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: BTHWANI_SPACING.md,
  },
  filterLabel: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    fontWeight: '600',
    marginBottom: BTHWANI_SPACING.xs,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  filterChipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  filterChipText: { fontSize: 13, color: semanticRoles.text },
  filterChipTextSelected: { color: semanticRoles.primaryCTA, fontWeight: '600' },
  quickSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  chip: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  chipText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default auto_knz_listings_search;

