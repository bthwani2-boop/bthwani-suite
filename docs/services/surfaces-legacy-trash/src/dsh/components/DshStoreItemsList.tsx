/**
 * DSH Store Items List — Pure UI Component
 * Displays a list of store items with loading, empty, and error states.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { DshStoreItem } from '../types';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

type State = 'loading' | 'normal' | 'empty' | 'error';

export interface DshStoreItemsListProps {
  /** Current state of the component */
  state: State;
  /** List of store items to display */
  items: DshStoreItem[];
  /** Error message to show when state is 'error' */
  errorMessage?: string;
  /** Store name to display in header */
  storeName?: string;
  /** Callback when back button is pressed */
  onBack?: () => void;
  /** Callback when retry button is pressed */
  onRetry?: () => void;
  /** Callback when an item is pressed */
  onItemPress?: (item: DshStoreItem) => void;
}

export function DshStoreItemsList({
  state,
  items,
  errorMessage = '',
  storeName: storeNameProp,
  onBack,
  onRetry,
  onItemPress,
}: DshStoreItemsListProps) {
  const { t, isRTL } = useI18n();
  const storeName = storeNameProp ?? t('dsh.components.DshStoreItemsList.storeProducts');
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const menuArrow = isRTL ? '←' : '→';
  const backLabel = `${menuArrow} ${t('dsh.components.DshStoreItemsList.backText')}`;
  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{backLabel}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {storeName}
        </Text>
      </View>

      {state === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colorTokens.error['800']} />
          <Text style={styles.loadingText}>{t('dsh.components.DshStoreItemsList.loadingText')}</Text>
        </View>
      )}

      {state === 'empty' && (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>{t('dsh.components.DshStoreItemsList.emptyTitle')}</Text>
          <Text style={styles.emptyMessage}>{t('dsh.components.DshStoreItemsList.emptyMessage')}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryText}>{t('dsh.components.DshStoreItemsList.retryText')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {state === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('dsh.components.DshStoreItemsList.errorTitle')}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryText}>{t('dsh.components.DshStoreItemsList.retryText')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {state === 'normal' && (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onItemPress?.(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.cardSub} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              {item.price != null && (
                <Text style={styles.cardPrice}>{item.price.toFixed(2)} ر.س</Text>
              )}
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
  title: { flex: 1, fontSize: 18, fontWeight: '600', color: colorTokens.neutral['900'] },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: colorTokens.neutral['600'] },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colorTokens.neutral['900'], marginBottom: 8 },
  emptyMessage: { fontSize: 14, color: colorTokens.neutral['600'], textAlign: 'center', marginBottom: 16 },
  errorTitle: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.danger, marginBottom: 8 },
  errorMessage: { fontSize: 14, color: colorTokens.neutral['600'], textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: colorTokens.error['800'], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { fontSize: 16, color: BTHWANI_COLORS.surface, fontWeight: '600' },
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
  cardPrice: { fontSize: 16, fontWeight: '600', color: colorTokens.error['800'], marginTop: 8 },
});

export default DshStoreItemsList;
