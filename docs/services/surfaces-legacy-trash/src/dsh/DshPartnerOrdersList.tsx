/**
 * DSH Partner Orders List — dsh_partner_orders_list. Shared for app-partner.
 * Uses getOrders (generated client) + onBack injected by app.
 * WAVE 7: Central i18n only; no stale locale (all UI via t(); useCallback deps include t).
 * WAVE 8: Layout direction (start/end) from useI18n().isRTL only; header uses direction (ltr/rtl) + flexDirection row so content follows start/end. Same for all screens.
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
import type { DshPartnerOrderItem, DshPartnerOrdersListProps } from './types';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export type { DshPartnerOrderItem, DshPartnerOrdersListProps } from './types';

type State = 'loading' | 'normal' | 'empty' | 'error';

export function DshPartnerOrdersList({ getOrders, onBack }: DshPartnerOrdersListProps) {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<State>('loading');
  const [orders, setOrders] = useState<DshPartnerOrderItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const load = useCallback(async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const list = await getOrders();
      setOrders(list ?? []);
      setState(list?.length ? 'normal' : 'empty');
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshPartnerOrdersList.errorMessage'));
      setState('error');
    }
  }, [getOrders, t]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>{t('dsh.DshPartnerOrdersList.backText')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('dsh.DshPartnerOrdersList.title')}</Text>
      </View>

      {state === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colorTokens.error['800']} />
          <Text style={styles.loadingText}>{t('dsh.DshPartnerOrdersList.loadingText')}</Text>
        </View>
      )}

      {state === 'empty' && (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>{t('dsh.DshPartnerOrdersList.emptyTitle')}</Text>
          <Text style={styles.emptyMessage}>{t('dsh.DshPartnerOrdersList.emptyMessage')}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t('dsh.DshPartnerOrdersList.retryText')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('dsh.DshPartnerOrdersList.errorTitle')}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t('dsh.DshPartnerOrdersList.retryText')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'normal' && (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <Text style={styles.cardTitle}>{t('dsh.DshPartnerOrdersList.cardTitle', { id: item.id })}</Text>
              {item.status ? (
                <Text style={styles.cardSub}>{t('dsh.DshPartnerOrdersList.cardStatus', { status: item.status })}</Text>
              ) : null}
              {item.total != null ? (
                <Text style={styles.cardSub}>{t('dsh.DshPartnerOrdersList.cardTotal', { total: String(item.total) })}</Text>
              ) : null}
              {item.customer_name ? (
                <Text style={styles.cardSub}>{t('dsh.DshPartnerOrdersList.cardCustomer', { name: item.customer_name })}</Text>
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
