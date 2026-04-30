// بثواني برو — كتالوج الفئات والباقات (مصدر البيانات: التسويق من CONTROL PANEL)
// Surface: app-client | GET categories → GET bundles?category_id
// §30 States: Loading / Error / Content
// scope_type من API: قيم مقفولة فقط — restaurants | grocery | all | night | week (لا restaurant بالمفرد)

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

type CategoryItem = { id: string; name_ar: string; scope_type: string; is_active: boolean; sort_order?: number };
type BundleItem = { id: string; category_id: string; name_ar: string; bundle_type: string; price_yer?: number; duration_days?: number; max_orders?: number; is_active?: boolean; sort_order?: number };

export const auto_dsh_subscription_pro_catalog: React.FC<Props> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('loading');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [bundlesLoading, setBundlesLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/categories`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب الفئات');
      setCategories(Array.isArray(json?.data) ? json.data : []);
      setState('content');
    } catch {
      setState('error');
    }
  }, []);

  const fetchBundles = useCallback(async (categoryId: string) => {
    setBundlesLoading(true);
    setBundles([]);
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/bundles?category_id=${encodeURIComponent(categoryId)}`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب الباقات');
      setBundles(Array.isArray(json?.data) ? json.data : []);
      setSelectedCategoryId(categoryId);
    } catch {
      setBundles([]);
    } finally {
      setBundlesLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleRetry = () => {
    setState('content');
    void fetchCategories();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_pro_catalog.loadingMessage')}
        screenName="auto_dsh_subscription_pro_catalog"
        operationName="dsh_subscription_categories_get"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_pro_catalog.errorLoadMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_subscription_pro_catalog"
        operationName="dsh_subscription_categories_get"
      />
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>بثواني برو</Text>
        <Text style={[styles.subtitle, textAlignStart]}>اختر الفئة ثم الباقة المناسبة</Text>

        {categories.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>لا توجد فئات متاحة حالياً. سيتم إضافتها من لوحة التحكم (التسويق).</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionLabel, textAlignStart]}>الفئات</Text>
            <FlatList
              horizontal
              keyExtractor={(item) => item.id}
              data={categories}
              contentContainerStyle={styles.categoriesRow}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryChip, selectedCategoryId === item.id && styles.categoryChipSelected]}
                  onPress={() => fetchBundles(item.id)}
                >
                  <Text style={[styles.categoryChipText, selectedCategoryId === item.id && styles.categoryChipTextSelected]}>{item.name_ar}</Text>
                </TouchableOpacity>
              )}
            />

            {selectedCategoryId && (
              <>
                <Text style={[styles.sectionLabel, textAlignStart]}>الباقات — {selectedCategory?.name_ar ?? selectedCategoryId}</Text>
                {bundlesLoading ? (
                  <Text style={[styles.mutedText, textAlignStart]}>جاري جلب الباقات...</Text>
                ) : bundles.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>لا توجد باقات لهذه الفئة حالياً.</Text>
                  </View>
                ) : (
                  <FlatList
                    keyExtractor={(item) => item.id}
                    data={bundles}
                    contentContainerStyle={styles.bundlesList}
                    renderItem={({ item }) => (
                      <View style={styles.bundleCard}>
                        <Text style={[styles.bundleName, textAlignStart]}>{item.name_ar}</Text>
                        {item.price_yer != null && (
                          <Text style={[styles.bundlePrice, textAlignStart]}>{item.price_yer} ر.ي / {item.duration_days ?? '—'} يوم</Text>
                        )}
                        <TouchableOpacity
                          style={styles.ctaButton}
                          onPress={() => handleNavigate('DshSubscriptionUpgradePost', { bundleId: item.id, categoryId: item.category_id, bundleName_ar: item.name_ar })}
                        >
                          <Text style={styles.ctaButtonText}>اشترك</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.lg },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.sm },
  categoriesRow: { flexGrow: 0, gap: BTHWANI_SPACING.sm, paddingVertical: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.md },
  categoryChip: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    marginStart: BTHWANI_SPACING.sm,
  },
  categoryChipSelected: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  categoryChipText: { fontSize: 14, color: semanticRoles.onSurface },
  categoryChipTextSelected: { color: semanticRoles.primaryCTAText },
  bundlesList: { paddingBottom: BTHWANI_SPACING.xl },
  bundleCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  bundleName: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  bundlePrice: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  ctaButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  ctaButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  emptyCard: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.lg, borderRadius: BTHWANI_RADIUS.md },
  emptyText: { fontSize: 14, color: semanticRoles.onSurfaceMuted, textAlign: 'center' },
  mutedText: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
});

export default auto_dsh_subscription_pro_catalog;

