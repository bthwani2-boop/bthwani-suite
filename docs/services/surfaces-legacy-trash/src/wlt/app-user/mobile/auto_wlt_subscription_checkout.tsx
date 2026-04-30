// Auto-generated screen for wlt_subscription_checkout
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface auto_wlt_subscription_checkoutProps {
  
}

export const auto_wlt_subscription_checkout: React.FC<auto_wlt_subscription_checkoutProps> = (props) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');
  const [selectedPlan, setSelectedPlan] = useState('gold');

  const paymentmethods = useMemo(
    () => [
      { id: 'card', label: t('wlt.app-client.mobile.auto_wlt_subscription_checkout.creditCard'), icon: '💳' },
      { id: 'wallet', label: t('wlt.app-client.mobile.auto_wlt_subscription_checkout.eWallet'), icon: '📱' },
      { id: 'bank', label: t('wlt.app-client.mobile.auto_wlt_subscription_checkout.bankTransfer'), icon: '🏦' }
    ],
    [t]
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubscribe = () => {
    if (!selectedPlan || !paymentMethod) {
      setState('error');
      return;
    }

    setState('loading');
    setTimeout(() => {
      // Simulate subscription success (85% success rate)
      const mockSuccess = 0 > 0.15;
      setState(mockSuccess ? 'success' : 'error');
    }, 3000);
  };

  const handleRetry = () => {
    setState('content');
  };

  const subscriptionPlans = {
    gold: {
      name: t('surfaces.الخطة_الذهبية'),
      price: { monthly: 29.99, yearly: 299.99 },
      features: [
        t('surfaces.سحب_غير_محدود'),
        t('surfaces.تحويل_فوري'),
        t('surfaces.رسوم_مخفضة'),
        t('surfaces.دعم_فني_247'),
        t('surfaces.تقارير_شهرية'),
        t('surfaces.أولوية_في_المعالجة')
      ]
    },
    platinum: {
      name: t('surfaces.الخطة_البلاتينية'),
      price: { monthly: 49.99, yearly: 499.99 },
      features: [
        t('surfaces.جميع_مميزات_الذهبية'),
        t('surfaces.تحليلات_متقدمة'),
        t('surfaces.إدارة_متعددة_الحسابات'),
        t('surfaces.API_خاص'),
        t('surfaces.مدير_حساب_مخصص'),
        t('surfaces.تدريب_مجاني')
      ]
    }
  };


  const currentPlan = subscriptionPlans[selectedPlan as keyof typeof subscriptionPlans];
  const planPrice = currentPlan.price[billingCycle];
  const savings = billingCycle === 'yearly' ? currentPlan.price.monthly * 12 - planPrice : 0;

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>الاشتراك في الخدمة</Text>
          <Text style={styles.subtitle}>اختر الخطة المناسبة لاحتياجاتك</Text>

          <View style={styles.planSelection}>
            <Text style={styles.sectionTitle}>اختر الخطة</Text>

            {Object.entries(subscriptionPlans).map(([key, plan]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.planCard,
                  selectedPlan === key && styles.selectedPlan
                ]}
                onPress={() => setSelectedPlan(key)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={[styles.planBadge, selectedPlan === key && styles.selectedBadge]}>
                    <Text style={[styles.planBadgeText, selectedPlan === key && styles.selectedBadgeText]}>
                      {selectedPlan === key ? t('surfaces.مختار') : t('surfaces.اختر')}
                    </Text>
                  </View>
                </View>

                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>
                    {plan.price[billingCycle]} ريال
                  </Text>
                  <Text style={styles.planPeriod}>
                    /{billingCycle === 'monthly' ? t('surfaces.شهرياً') : t('surfaces.سنوياً')}
                  </Text>
                  {billingCycle === 'yearly' && savings > 0 && (
                    <Text style={styles.savingsText}>
                      توفير {savings.toFixed(2)} ريال
                    </Text>
                  )}
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <Text key={index} style={styles.planFeature}>
                      • {feature}
                    </Text>
                  ))}
                  {plan.features.length > 3 && (
                    <Text style={styles.moreFeatures}>
                      و {plan.features.length - 3} مميزات أخرى...
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.billingSection}>
            <Text style={styles.sectionTitle}>دورة الفوترة</Text>
            <View style={styles.billingToggle}>
              <TouchableOpacity
                style={[
                  styles.billingOption,
                  billingCycle === 'monthly' && styles.selectedBilling
                ]}
                onPress={() => setBillingCycle('monthly')}
              >
                <Text style={[
                  styles.billingText,
                  billingCycle === 'monthly' && styles.selectedBillingText
                ]}>
                  شهري
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.billingOption,
                  billingCycle === 'yearly' && styles.selectedBilling
                ]}
                onPress={() => setBillingCycle('yearly')}
              >
                <Text style={[
                  styles.billingText,
                  billingCycle === 'yearly' && styles.selectedBillingText
                ]}>
                  سنوي (خصم 20%)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>طريقة الدفع</Text>
            <View style={styles.paymentmethods}>
              {paymentmethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    paymentMethod === method.id && styles.selectedPayment
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                  <Text style={[
                    styles.paymentLabel,
                    paymentMethod === method.id && styles.selectedPaymentText
                  ]}>
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>ملخص الطلب</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>الخطة المختارة</Text>
              <Text style={[styles.summaryValue, textAlignStart]}>{currentPlan.name}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>دورة الفوترة</Text>
              <Text style={[styles.summaryValue, textAlignStart]}>
                {billingCycle === 'monthly' ? 'شهري' : 'سنوي'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>طريقة الدفع</Text>
              <Text style={[styles.summaryValue, textAlignStart]}>
                {paymentmethods.find(m => m.id === paymentMethod)?.label}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>المجموع</Text>
              <Text style={styles.totalValue}>{planPrice} ريال</Text>
            </View>
          </View>

          <View style={styles.termsBanner}>
            <Text style={styles.termsText}>
              بالضغط على t('surfaces.اشترك_الآن') أنت توافق على شروط الخدمة وسياسة الخصوصية
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.subscribeButton, (!selectedPlan || !paymentMethod) && styles.disabledButton]}
            onPress={handleSubscribe}
            disabled={!selectedPlan || !paymentMethod}
          >
            <Text style={[styles.subscribeText, (!selectedPlan || !paymentMethod) && styles.disabledText]}>
              اشترك الآن
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_معالجة_الاشتراك')}
      errorMessage={t('surfaces.فشل_في_إتمام_الاشتراك_يرجى_المحاولة')}
      onErrorAction={handleRetry}
      successMessage={`تم الاشتراك بنجاح في ${currentPlan.name}!`}
      successActionText={t('surfaces.ابدأ_الاستخدام')}
      onSuccessAction={() => setState('content')}
      screenName="auto_wlt_subscription_checkout"
      operationName="wlt_subscription_checkout"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  planSelection: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  planCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPlan: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: colorTokens.primary['50'],
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  planBadge: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  selectedBadge: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  planBadgeText: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
    fontWeight: '500',
  },
  selectedBadgeText: {
    color: BTHWANI_COLORS.onPrimary,
  },
  planPricing: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  planPeriod: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  savingsText: {
    fontSize: 12,
    color: colorTokens.success['600'],
    fontWeight: '600',
    marginTop: BTHWANI_SPACING.xs,
  },
  planFeatures: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
  },
  planFeature: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
    lineHeight: 18,
  },
  moreFeatures: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
    fontStyle: 'italic',
  },
  billingSection: {
    padding: BTHWANI_SPACING.contentH,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xs,
  },
  billingOption: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.md,
  },
  selectedBilling: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  billingText: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  selectedBillingText: {
    color: BTHWANI_COLORS.onPrimary,
  },
  paymentSection: {
    padding: BTHWANI_SPACING.contentH,
  },
  paymentmethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentMethod: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  selectedPayment: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: colorTokens.success['50'],
  },
  paymentIcon: {
    fontSize: 24,
    marginBottom: BTHWANI_SPACING.sm,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
  },
  selectedPaymentText: {
    color: BTHWANI_COLORS.primary,
  },
  summaryCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  summaryValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  termsBanner: {
    backgroundColor: colorTokens.warning['100'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: colorTokens.warning['500'],
  },
  termsText: {
    fontSize: 14,
    color: colorTokens.warning['800'],
    textAlign: 'center',
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: BTHWANI_COLORS.onSurfaceMuted,
  },
  subscribeText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: BTHWANI_COLORS.surface,
  },
});

export default auto_wlt_subscription_checkout;

