/**
 * DSH Category Detail — dsh_category_get. Shared for app-partner.
 * Uses getCategory(id) + categoryId + onBack injected by app.
 * WAVE 8: Layout direction (start/end) from useI18n().isRTL only; headers and subcardsGrid use direction (ltr/rtl) + row so content follows start/end. Same for all screens.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import type { DshCategoryDetailItem, DshCategoryDetailProps } from './types';
import { colorTokens } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { getDshCategoryDetailSeed } from './dshCategoriesSeed';
import { getDshCategoryIconUrl } from './getDshCategoryIconUrl';

export type { DshCategoryDetailItem, DshCategoryDetailProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = BTHWANI_SPACING.md;
const CARD_WIDTH = (SCREEN_WIDTH - BTHWANI_SPACING.contentH * 2 - CARD_GAP) / 2;

/** أيقونة فرعية حسب slug للبطاقات — عملي وواضح */
function getSubcategoryIcon(slug?: string): string {
  if (!slug) return '📂';
  const m: Record<string, string> = {
    'vegetables-fruits': '🥬',
    'meat-fish-chicken': '🥩',
    'roasted-spices': '🌰',
    bakeries: '🍞',
    'deals-bundle': '📦',
    'fresh-juices': '🧃',
    sweets: '🍰',
    'ice-cream': '🍦',
    perfumes: '🌸',
    'accessories-beauty': '💄',
    clothing: '👕',
  };
  return m[slug] ?? '📂';
}

/** يعرض صورة الأيقونة من URL مع fallback إلى الإيموجي (مسار موحّد — خلفيات بيضاء فقط) */
function CategoryIconImage({
  uri,
  emojiFallback,
  style,
}: {
  uri: string | null;
  emojiFallback: string;
  style: object;
}) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return <Text style={[styles.subCardIcon]}>{emojiFallback}</Text>;
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

type State = 'loading' | 'normal' | 'error';

export function DshCategoryDetail({
  getCategory,
  categoryId,
  onBack,
}: DshCategoryDetailProps) {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<State>('loading');
  const [category, setCategory] = useState<DshCategoryDetailItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const load = useCallback(async () => {
    if (!categoryId?.trim()) {
      setState('error');
      setErrorMessage(t('dsh.DshCategoryDetail.errorLoadMessage'));
      return;
    }
    setState('loading');
    setErrorMessage('');
    try {
      let data = await getCategory(categoryId);
      if (!data && __DEV__) data = getDshCategoryDetailSeed(categoryId, t) ?? null;
      setCategory(data ?? null);
      setState(data ? 'normal' : 'error');
      if (!data) setErrorMessage(t('dsh.DshCategoryDetail.errorNoDataMessage'));
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCategoryDetail.errorGenericMessage'));
      setState('error');
    }
  }, [getCategory, categoryId, t]);

  useEffect(() => {
    load();
  }, [load]);

  if (state === 'loading') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← رجوع</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCategoryDetail.title')}</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colorTokens.error['800']} />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← رجوع</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCategoryDetail.title')}</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('dsh.DshCategoryDetail.errorTitle')}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t('dsh.DshCategoryDetail.retryText')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category?.name ?? t('dsh.DshCategoryDetail.fallbackCategoryName')}</Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{category?.name ?? categoryId}</Text>
          {category?.slug ? (
            <Text style={styles.cardSub}>Slug: {category.slug}</Text>
          ) : null}
          {category?.item_count != null ? (
            <Text style={styles.cardSub}>عدد العناصر: {category.item_count}</Text>
          ) : null}
        </View>
        {category?.subcategories?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dsh.DshCategoryDetail.sectionTitleSubcategories')}</Text>
            <View style={[styles.subcardsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {category.subcategories.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.subCard}
                  activeOpacity={0.7}
                  accessibilityLabel={s.name || s.id}
                  accessibilityRole="button"
                >
                  <View style={styles.subCardIconWrap}>
                    <CategoryIconImage
                      uri={getDshCategoryIconUrl(s.id)}
                      emojiFallback={getSubcategoryIcon(s.slug)}
                      style={styles.subCardIconImage}
                    />
                  </View>
                  <Text style={styles.subCardTitle} numberOfLines={2}>
                    {s.name || s.id}
                  </Text>
                  <Text style={styles.subCardHint}>{t('dsh.DshCategoryDetail.subCardHint')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colorTokens.neutral['100'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorTokens.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: colorTokens.neutral['200'],
  },
  backBtn: { marginEnd: 12 },
  backText: { fontSize: 16, color: colorTokens.error['800'] },
  title: { fontSize: 18, fontWeight: '600', color: colorTokens.neutral['900'] },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: colorTokens.neutral['600'] },
  errorTitle: { fontSize: 18, fontWeight: '600', color: colorTokens.error['700'], marginBottom: 8 },
  errorMessage: { fontSize: 14, color: colorTokens.neutral['500'], textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colorTokens.error['800'],
    borderRadius: 8,
  },
  retryText: { fontSize: 16, color: colorTokens.surface.primary, fontWeight: '600' },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colorTokens.surface.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colorTokens.neutral['200'],
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colorTokens.neutral['900'] },
  cardSub: { fontSize: 14, color: colorTokens.neutral['600'], marginTop: 8 },
  section: { marginTop: 8 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colorTokens.neutral['900'],
    marginBottom: BTHWANI_SPACING.md,
  },
  subcardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  subCard: {
    width: CARD_WIDTH,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  subCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.sm,
    overflow: 'hidden',
  },
  subCardIcon: { fontSize: 26 },
  subCardIconImage: { width: 48, height: 48 },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  subCardHint: {
    fontSize: 12,
    fontWeight: '500',
    color: semanticRoles.primaryCTA,
  },
});
