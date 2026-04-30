/**
 * DSH Categories List — dsh_categories_list. Shared across app-client, app-captain, app-partner, app-field.
 * Uses getCategories (generated client) + onBack injected by each app.
 * WAVE 8: Layout direction (start/end) from useI18n().isRTL only; header uses direction (ltr/rtl) + row so content follows start/end. Same for all screens.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { DshCategoryItem, DshCategoriesListProps } from './types';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getDshCategoriesSeedList } from './dshCategoriesSeed';

export type { DshCategoryItem, DshCategoriesListProps } from './types';

type State = 'loading' | 'normal' | 'empty' | 'error';

export function DshCategoriesList({
  getCategories,
  onBack,
  onCategoryPress,
}: DshCategoriesListProps) {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<State>('loading');
  const [categories, setCategories] = useState<DshCategoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const load = useCallback(async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const list = await getCategories();
      const resolved = list?.length ? list : (__DEV__ ? getDshCategoriesSeedList(t) : []);
      setCategories(resolved);
      setState(resolved.length ? 'normal' : 'empty');
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCategoriesList.errorMessage'));
      setState('error');
    }
  }, [getCategories, t]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('dsh.categories.title')}</Text>
      </View>

      {state === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colorTokens.error['800']} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      )}

      {state === 'empty' && (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>{t('dsh.categories.empty_title')}</Text>
          <Text style={styles.emptyMessage}>
            {t('dsh.categories.empty_message')}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('common.error')}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'normal' && (
        <FlatList
          data={categories}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onCategoryPress?.(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>{item.name || item.id}</Text>
              {item.slug ? (
                <Text style={styles.cardSub} numberOfLines={1}>
                  {item.slug}
                </Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorTokens.neutral['900'],
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: colorTokens.neutral['600'],
    textAlign: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colorTokens.error['700'],
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colorTokens.error['800'],
    borderRadius: 8,
  },
  retryText: { fontSize: 16, color: colorTokens.surface.primary, fontWeight: '600' },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colorTokens.surface.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colorTokens.neutral['200'],
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colorTokens.neutral['900'] },
  cardSub: { fontSize: 14, color: colorTokens.neutral['600'], marginTop: 4 },
});

