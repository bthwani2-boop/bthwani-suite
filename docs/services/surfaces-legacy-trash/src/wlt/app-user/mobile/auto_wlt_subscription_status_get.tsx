// Auto-generated screen for wlt_subscription_status_get
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildWltSubscriptionStatusMock } from '../../fixtures/subscriptionStatus';

interface auto_wlt_subscription_status_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_wlt_subscription_status_get: React.FC<auto_wlt_subscription_status_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    // Backend integration call
    const loadSubscriptionStatus = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadSubscriptionStatus();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleRenew = () => {
    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 2000);
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const subscription = React.useMemo(() => buildWltSubscriptionStatusMock(t), [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colorTokens.success['600'];
      case 'expired': return colorTokens.error['500'];
      case 'suspended': return colorTokens.warning['500'];
      case 'cancelled': return colorTokens.neutral['500'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي الصلاحية';
      case 'suspended': return 'معلق';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (state === 'empty') {
    return (
      <ScreenWrapper
        state="empty"
        emptyMessage={t('surfaces.لا_يوجد_لديك_أي_اشتراك_نشط_حالياً')}
        emptyActionText={t('surfaces.استعرض_الخطط_المتاحة')}
        onEmptyAction={() => handleNavigate('WltSubscriptionPlansList')}
        screenName="auto_wlt_subscription_status_get"
        operationName="wlt_subscription_status_get"
      />
    );
  }

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>حالة الاشتراك</Text>

          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{subscription.planName}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.status) }]}>
                <Text style={styles.statusText}>{getStatusText(subscription.status)}</Text>
              </View>
            </View>

            <View style={styles.periodInfo}>
              <Text style={styles.periodLabel}>الفترة الحالية</Text>
              <Text style={styles.periodDates}>
                {subscription.currentPeriod.startDate} - {subscription.currentPeriod.endDate}
              </Text>
              <Text style={styles.daysRemaining}>
                متبقي {subscription.currentPeriod.daysRemaining} يوم
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مميزات الخطة</Text>
            <View style={styles.featuresList}>
              {subscription.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الاستخدام الحالي</Text>

            <View style={styles.usageCard}>
              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>السحوبات</Text>
                <Text style={styles.usageValue}>
                  {subscription.usage.withdrawals.used}/{subscription.usage.withdrawals.limit}
                </Text>
                <Text style={styles.usageUnit}>{subscription.usage.withdrawals.unit}</Text>
              </View>

              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>التحويلات</Text>
                <Text style={styles.usageValue}>
                  {subscription.usage.transfers.used}/{subscription.usage.transfers.limit}
                </Text>
                <Text style={styles.usageUnit}>{subscription.usage.transfers.unit}</Text>
              </View>

              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>تذاكر الدعم</Text>
                <Text style={styles.usageValue}>
                  {subscription.usage.supportTickets.used}/{subscription.usage.supportTickets.limit}
                </Text>
                <Text style={styles.usageUnit}>{subscription.usage.supportTickets.unit}</Text>
              </View>
            </View>
          </View>

          <View style={styles.billingCard}>
            <Text style={styles.sectionTitle}>معلومات الفوترة</Text>

            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>الرسوم الشهرية</Text>
              <Text style={[styles.billingValue, textAlignStart]}>{subscription.billing.monthlyFee} ريال</Text>
            </View>

            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>الفاتورة التالية</Text>
              <Text style={[styles.billingValue, textAlignStart]}>{subscription.billing.nextBilling}</Text>
            </View>

            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>طريقة الدفع</Text>
              <Text style={[styles.billingValue, textAlignStart]}>{subscription.billing.paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.actionsCard}>
            <TouchableOpacity style={styles.renewButton} onPress={handleRenew}>
              <Text style={styles.renewText}>تجديد الاشتراك</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.morePlansLink}
            onPress={() => handleNavigate('WltSubscriptionPlansList')}
          >
            <Text style={styles.morePlansText}>عرض كل الخطط المتاحة</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_حالة_الاشتراك')}
      errorMessage={t('surfaces.فشل_في_تحميل_حالة_الاشتراك')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_تجديد_الاشتراك_بنجاح')}
      successActionText={t('surfaces.العودة_لحالة_الاشتراك')}
      onSuccessAction={() => setState('content')}
      screenName="auto_wlt_subscription_status_get"
      operationName="wlt_subscription_status_get"
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
  planCard: {
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  periodInfo: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  periodLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  periodDates: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
    marginBottom: BTHWANI_SPACING.xs,
  },
  daysRemaining: {
    fontSize: 16,
    color: BTHWANI_COLORS.primary,
    fontWeight: '600',
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  featuresList: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  featureIcon: {
    color: BTHWANI_COLORS.primary,
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.sm,
    fontWeight: '600',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  usageCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  usageLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.primary,
  },
  usageUnit: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  billingCard: {
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
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  billingLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  billingValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  actionsCard: {
    margin: BTHWANI_SPACING.lg,
    gap: BTHWANI_SPACING.md,
  },
  renewButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  renewText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  morePlansLink: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  morePlansText: {
    fontSize: 14,
    color: BTHWANI_COLORS.primary,
    fontWeight: '600',
  },
});

export default auto_wlt_subscription_status_get;

