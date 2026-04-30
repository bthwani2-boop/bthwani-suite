// Auto-generated screen for dsh_checkout_gate
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// الدفع: WLT | COD | WLT+COD — SSoT: checkoutConstants.ts

import { getDshPaymentOptions, type DshPaymentMethodType } from '../../checkoutConstants';
import { rawFetch } from '@bthwani/api-clients';
export type { DshPaymentMethodType };

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildDshCheckoutGateOrderSummaryMock } from '../../hooks';

interface auto_dsh_checkout_gateProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { storeId?: string } };
}

export const auto_dsh_checkout_gate: React.FC<auto_dsh_checkout_gateProps> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const paymentOptions = useMemo(() => getDshPaymentOptions(t), [t]);
  const [state, setState] = useState<ScreenState>('loading');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<DshPaymentMethodType>('wlt');
  const storeId = route?.params?.storeId ?? null;

  const loadCheckout = useCallback(async () => {
    try {
      const url = `${getBaseUrl()}/api/dsh/checkout/gate`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Gate check failed');
      setState('content');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => { void loadCheckout(); }, [loadCheckout]);

  const handleRetry = () => {
    setState('loading');
    void loadCheckout();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) {
      (navigation.navigate as (s: string, p?: Record<string, unknown>) => void)(screen, params);
    } else if (onNavigate) {
      (onNavigate as (s: string, p?: Record<string, unknown>) => void)(screen, params);
    }
  };

  const selectedPaymentLabel = paymentOptions.find((o) => o.id === selectedPaymentMethod)?.label ?? paymentOptions[0].label;

  const orderSummary = useMemo(() => buildDshCheckoutGateOrderSummaryMock(t), [t]);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>بوابة الدفع والتأكيد</Text>
            <Text style={styles.subtitle}>يرجى مراجعة الطلب قبل المتابعة</Text>
          </View>

          <View style={styles.orderSummary}>
            <Text style={[styles.sectionTitle, textAlignStart]}>ملخص الطلب</Text>

            {orderSummary.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Text style={styles.itemName}>
                  {item.quantity}× {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  {item.quantity * item.price} ريال
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
              <Text style={styles.summaryValue}>{orderSummary.subtotal} ريال</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>رسوم التوصيل</Text>
              <Text style={styles.summaryValue}>{orderSummary.deliveryFee} ريال</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>الضريبة (15%)</Text>
              <Text style={styles.summaryValue}>{orderSummary.tax} ريال</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>المجموع الكلي</Text>
              <Text style={styles.totalValue}>{orderSummary.total} ريال</Text>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <Text style={[styles.sectionTitle, textAlignStart]}>معلومات التوصيل</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 العنوان:</Text>
              <Text style={styles.infoValue}>شارع الملك فيصل، الرياض</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⏱️ الوقت المتوقع:</Text>
              <Text style={styles.infoValue}>30-45 دقيقة</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💳 طريقة الدفع:</Text>
              <Text style={styles.infoValue}>{selectedPaymentLabel}</Text>
            </View>
          </View>

          <View style={styles.paymentMethods}>
            <Text style={[styles.sectionTitle, textAlignStart]}>طريقة الدفع (واحدة لكل طلب)</Text>
            {paymentOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.paymentOption, selectedPaymentMethod === opt.id && styles.paymentOptionSelected]}
                onPress={() => setSelectedPaymentMethod(opt.id)}
              >
                <Text style={styles.paymentIcon}>{opt.icon}</Text>
                <View style={styles.paymentOptionTextWrap}>
                  <Text style={styles.paymentText}>{opt.label}</Text>
                  <Text style={styles.paymentBalance}>{opt.description}</Text>
                </View>
                {selectedPaymentMethod === opt.id && <Text style={styles.paymentCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.specialInstructions}>
            <Text style={[styles.sectionTitle, textAlignStart]}>تعليمات خاصة (اختياري)</Text>
            <TouchableOpacity style={styles.instructionButton}>
              <Text style={styles.instructionText}>إضافة تعليمات للطلب</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleNavigate('DshServiceModesResolve', {
              paymentMethod: selectedPaymentMethod,
              ...(storeId != null && { storeId }),
            })}
          >
            <Text style={styles.confirmText}>اختيار طريقة التوصيل ومتابعة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('DshCartGet')}>
            <Text style={styles.backText}>العودة للسلة</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_checkout_gate.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_checkout_gate.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_checkout_gate"
      operationName="dsh_checkout_gate"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  orderSummary: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemName: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: semanticRoles.textMuted,
    marginVertical: BTHWANI_SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.textMuted,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  deliveryInfo: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    flex: 1,
  },
  paymentMethods: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  paymentOptionSelected: {
    backgroundColor: semanticRoles.primaryCTA + '18',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
  },
  paymentIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
  },
  paymentOptionTextWrap: {
    flex: 1,
  },
  paymentText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  paymentBalance: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  paymentCheck: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
    marginEnd: BTHWANI_SPACING.sm,
  },
  specialInstructions: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionButton: {
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  confirmButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  confirmText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  backText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_checkout_gate;

