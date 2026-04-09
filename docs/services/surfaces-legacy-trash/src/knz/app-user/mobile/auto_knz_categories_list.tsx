// KNZ Categories List — من KNZ_CATEGORIES، نقرة واحدة → KnzListingsList مع category
// Surface: app-client | Service: knz
// §30 States: Content (قائمة ثابتة من الثوابت) + عدّ ديناميكي من knz_categories_list إن توفر
// مرجع: kdt/analysis/knz/KNZ_OPENSOOQ_YEMENMAZAD_ANALYSIS §4

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_CATEGORIES, KNZ_CATEGORY_MOCK_COUNTS } from '../../shared/knz-constants';
import { rawFetch } from '@bthwani/api-clients';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

const CATEGORY_ICONS: Record<string, string> = {
  vehicles: '🚗',
  real_estate: '🏠',
  services: '🛠️',
  home_garden: '🪑',
  electronics: '💻',
  jobs: '💼',
  family_kids: '👶',
  sports: '⚽',
  animals: '🐦',
  numbers_plates: '🔢',
  travel: '✈️',
  other: '📦',
};

interface auto_knz_categories_listProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
}

export const auto_knz_categories_list: React.FC<auto_knz_categories_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { isRTL, t } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(KNZ_CATEGORY_MOCK_COUNTS);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await rawFetch(`${baseUrl}/api/knz/categories`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) return;
        const json = await res.json();
        const cats = json?.data?.categories as Array<{ code?: string; count?: number }> | undefined;
        if (!Array.isArray(cats)) return;
        const next: Record<string, number> = { ...categoryCounts };
        for (const c of cats) {
          if (c?.code) {
            next[c.code] = typeof c.count === 'number' ? c.count : 0;
          }
        }
        setCategoryCounts(next);
      } catch {
        // في حال فشل النداء نحتفظ بالعدّ الثابت
      }
    };
    void loadCounts();
    // نريد أن تعمل مرة واحدة عند فتح الشاشة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>التصنيفات</Text>
        <Text style={styles.subtitle}>اختر تصنيفاً لعرض الإعلانات</Text>
        <View style={[styles.grid, { flexDirection: 'row', direction: layoutDirection }]}>
          {KNZ_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.code];
            const label = t(cat.labelKey);
            return (
              <TouchableOpacity
                key={cat.code}
                style={styles.card}
                onPress={() => handleNavigate('KnzListingsList', { category: cat.code })}
                activeOpacity={0.7}
              >
                <Text style={styles.icon}>{CATEGORY_ICONS[cat.code] ?? '📦'}</Text>
                <Text style={styles.label}>{label}</Text>
                {count != null && count > 0 && (
                  <Text style={styles.count}>{count.toLocaleString('ar-SA')} إعلان</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
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
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -BTHWANI_SPACING.sm,
  },
  card: {
    width: '33.333%',
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: BTHWANI_SPACING.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  count: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
});

export default auto_knz_categories_list;

