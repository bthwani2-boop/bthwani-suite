/**
 * DSH Checkout Payment Method Select — dsh_checkout_payment_method_select. Shared for app-partner.
 * Uses selectPaymentMethod({ order_id, payment_method_id }) + onBack.
 */

import React, { useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import type { DshCheckoutPaymentMethodSelectProps } from './types';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';

export type { DshCheckoutPaymentMethodSelectProps } from './types';

type State = 'idle' | 'loading' | 'success' | 'error';

export function DshCheckoutPaymentMethodSelect({
  selectPaymentMethod,
  onBack,
}: DshCheckoutPaymentMethodSelectProps) {
  const { t } = useI18n();
  const [state, setState] = useState<State>('idle');
  const [orderId, setOrderId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async () => {
    const oid = orderId.trim();
    const pmid = paymentMethodId.trim();
    if (!oid || !pmid) {
      setErrorMessage(t('dsh.DshCheckoutPaymentMethodSelect.placeholder'));
      setState('error');
      return;
    }
    setState('loading');
    setErrorMessage('');
    try {
      await selectPaymentMethod({ order_id: oid, payment_method_id: pmid });
      setState('success');
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCheckoutPaymentMethodSelect.errorMessage'));
      setState('error');
    }
  };

  if (state === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{t('dsh.DshCheckoutPaymentMethodSelect.loadingText')}</Text>
      </View>
    );
  }

  if (state === 'success') {
    return (
      <View style={styles.centered}>
        <Text style={styles.successText}>{t('dsh.DshCheckoutPaymentMethodSelect.successText')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.section}>
        <Text style={styles.label}>معرف الطلب (order_id)</Text>
        <TextInput
          style={styles.input}
          value={orderId}
          onChangeText={setOrderId}
          placeholder="UUID"
          placeholderTextColor={colorTokens.neutral['400']}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>معرف طريقة الدفع (payment_method_id)</Text>
        <TextInput
          style={styles.input}
          value={paymentMethodId}
          onChangeText={setPaymentMethodId}
          placeholder="UUID"
          placeholderTextColor={colorTokens.neutral['400']}
        />
      </View>
      {state === 'error' && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.primaryButton} onPress={submit}>
        <Text style={styles.primaryButtonText}>تعيين طريقة الدفع</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>رجوع</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14 },
  successText: { color: colorTokens.success['700'], fontSize: 16, marginBottom: 16, textAlign: 'center' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BTHWANI_COLORS.borderSubtle },
  label: { fontSize: 12, color: colorTokens.neutral['500'], marginBottom: 4 },
  input: { borderWidth: 1, borderColor: BTHWANI_COLORS.primaryMuted, borderRadius: 8, padding: 12, fontSize: 14 },
  errorText: { color: colorTokens.error['700'], marginHorizontal: 16, marginBottom: 8, textAlign: 'center' },
  primaryButton: { margin: 16, padding: 12, backgroundColor: colorTokens.success['700'], borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: BTHWANI_COLORS.surface, fontWeight: '600' },
  backButton: { margin: 16, padding: 12, backgroundColor: colorTokens.neutral['500'], borderRadius: 8, alignItems: 'center' },
  backButtonText: { color: BTHWANI_COLORS.surface, fontWeight: '600' },
});
