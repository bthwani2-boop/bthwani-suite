/**
 * DSH Cart Price — dsh_cart_price. Shared for app-partner.
 * Uses getCartPrice(cart_id, …) + onBack. Optional cart_id from props or route.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import type { DshCartPriceItem, DshCartPriceProps } from './types';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export type { DshCartPriceItem, DshCartPriceProps } from './types';

type State = 'idle' | 'loading' | 'normal' | 'error';

export function DshCartPrice({
  getCartPrice,
  onBack,
}: DshCartPriceProps) {
  const { t } = useI18n();
  const [state, setState] = useState<State>('idle');
  const [cartId, setCartId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [price, setPrice] = useState<DshCartPriceItem | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    const id = cartId.trim();
    if (!id) {
      setErrorMessage(t('dsh.DshCartPrice.placeholder'));
      setState('error');
      return;
    }
    setState('loading');
    setErrorMessage('');
    try {
      const data = await getCartPrice({
        cart_id: id,
        coupon_code: couponCode.trim() || undefined,
        include_delivery_fee: true,
      });
      setPrice(data ?? null);
      setState(data ? 'normal' : 'error');
      if (!data) setErrorMessage(t('dsh.DshCartPrice.priceNotFound'));
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCartPrice.errorMessage'));
      setState('error');
    }
  }, [getCartPrice, cartId, couponCode, t]);

  if (state === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{t('dsh.DshCartPrice.loading')}</Text>
      </View>
    );
  }

  if (state === 'normal' && price) {
    const subtotal = price.subtotal ?? price.subtotal_amount ?? 0;
    const delivery = price.delivery_fee ?? price.delivery_amount ?? 0;
    const tax = price.tax ?? price.tax_amount ?? 0;
    const total = price.total ?? price.total_amount ?? 0;
    const currency = price.currency ?? t('dsh.DshCartPrice.sar');

    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.label}>{t('dsh.DshCartPrice.subtotal')}</Text>
          <Text style={styles.value}>{subtotal.toLocaleString('ar-SA')} {currency}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{t('dsh.DshCartPrice.deliveryFee')}</Text>
          <Text style={styles.value}>{delivery.toLocaleString('ar-SA')} {currency}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{t('dsh.DshCartPrice.tax')}</Text>
          <Text style={styles.value}>{tax.toLocaleString('ar-SA')} {currency}</Text>
        </View>
        <View style={[styles.section, styles.totalRow]}>
          <Text style={styles.totalLabel}>{t('dsh.DshCartPrice.total')}</Text>
          <Text style={styles.totalValue}>{total.toLocaleString('ar-SA')} {currency}</Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.section}>
        <Text style={styles.label}>{t('dsh.DshCartPrice.cartIdLabel')}</Text>
        <TextInput
          style={styles.input}
          value={cartId}
          onChangeText={setCartId}
          placeholder={t('dsh.DshCartPrice.eg123e4567e8')}
          placeholderTextColor={colorTokens.neutral['400']}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>{t('dsh.DshCartPrice.couponLabel')}</Text>
        <TextInput
          style={styles.input}
          value={couponCode}
          onChangeText={setCouponCode}
          placeholder={t('dsh.DshCartPrice.couponPlaceholder')}
          placeholderTextColor={colorTokens.neutral['400']}
        />
      </View>
      {state === 'error' && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.primaryButton} onPress={load}>
        <Text style={styles.primaryButtonText}>{t('dsh.DshCartPrice.calculatePrice')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('common.back')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14 },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BTHWANI_COLORS.borderSubtle },
  label: { fontSize: 12, color: colorTokens.neutral['500'], marginBottom: 4 },
  value: { fontSize: 16 },
  totalRow: { borderBottomWidth: 0, marginTop: 8 },
  totalLabel: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  totalValue: { fontSize: 20, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: BTHWANI_COLORS.primaryMuted, borderRadius: 8, padding: 12, fontSize: 14 },
  errorText: { color: colorTokens.error['700'], marginHorizontal: 16, marginBottom: 8, textAlign: 'center' },
  primaryButton: { margin: 16, padding: 12, backgroundColor: colorTokens.success['700'], borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: BTHWANI_COLORS.surface, fontWeight: '600' },
  backButton: { margin: 16, padding: 12, backgroundColor: colorTokens.neutral['500'], borderRadius: 8, alignItems: 'center' },
  backButtonText: { color: BTHWANI_COLORS.surface, fontWeight: '600' },
});
