// Auto-generated screen for earnings_get
// Surface: app-captain | Service: platform
// Operation: GET /api/platform/captain/earnings
// Description: Unified earnings screen - works across DSH and AMN captain types (no KNZ per policy)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components/ServiceIcon';
import { useCaptainType } from '../../../mobile/app-captain/CaptainTypeContext';
import { buildPlatformCaptainEarningsGetMock, type EarningsData, type RecentTransaction } from '../../fixtures/captainEarningsGet';

interface AutoPlatformCaptainEarningsGetProps {
  navigation?: any;
  route?: {
    params?: {
      service_mode?: 'DSH' | 'AMN';
    };
  };
}

export const AutoPlatformCaptainEarningsGet: React.FC<AutoPlatformCaptainEarningsGetProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const menuArrow = isRTL ? '←' : '→';
  const NS = 'platform.app-captain.mobile.auto_platform_captain_earnings_get';
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const { captainType } = useCaptainType();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceMode, setServiceMode] = useState<'DSH' | 'AMN'>('DSH');

  useEffect(() => {
    const fromParams = route?.params?.service_mode;
    const fromType = captainType === 'amn' ? 'AMN' : 'DSH';
    const mode = fromParams ?? fromType;
    setServiceMode(mode);
  }, [route?.params?.service_mode, captainType]);

  useEffect(() => {
    loadEarningsData();
  }, [serviceMode]);

  const loadEarningsData = useCallback(async () => {
    try {
      setIsLoading(true);

      const { earnings: data, transactions: txns } = buildPlatformCaptainEarningsGetMock(t, serviceMode);
      setEarnings(data);
      setTransactions(txns);
    } catch (error) {
      Alert.alert(
        t(`${NS}.alertError`),
        t('surfaces.فشل_في_تحميل_بيانات_الأرباح'),
        [{ text: t(`${NS}.alertOk`) }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [serviceMode]);

  const getServiceDisplayName = (mode: string) => {
    switch (mode) {
      case 'DSH': return t('surfaces.توصيل_وتسوق');
      case 'AMN': return `🚕 ${t(`${NS}.captainDisplayName`)}`;
      default: return mode;
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${earnings?.currency || 'SAR'}`;
  };

  const formatCompactCurrency = (amount: number) => {
    const cur = earnings?.currency || 'SAR';
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)} ألف ${cur}`;
    return `${amount.toFixed(0)} ${cur}`;
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'trip': return t('surfaces.رحلة');
      case 'delivery': return 'توصيل';
      case 'bonus': return t('surfaces.مكافأة');
      case 'penalty': return t('surfaces.خصم');
      default: return type;
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return semanticRoles.stateSuccess?.icon ?? BTHWANI_COLORS.successGreen;
      case 'pending': return semanticRoles.stateWarning?.icon ?? BTHWANI_COLORS.warning;
      case 'cancelled': return semanticRoles.stateError?.icon ?? BTHWANI_COLORS.danger;
      default: return semanticRoles.textMuted;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري تحميل بيانات الأرباح...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!earnings) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>لم يتم العثور على بيانات الأرباح</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEarningsData}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const moreLinks: Array<{ label: string; screen: string; icon: 'account-balance' | 'list' | 'payment' | 'assessment' }> = [
    { label: t('platform.app-captain.mobile.auto_platform_captain_earnings_get.settlements'), screen: 'captain_settlements', icon: 'account-balance' },
    { label: t('platform.app-captain.mobile.auto_platform_captain_earnings_get.earningsLog'), screen: 'captain_earnings_history', icon: 'list' },
    { label: t('platform.app-captain.mobile.auto_platform_captain_earnings_get.payouts'), screen: 'captain_payments', icon: 'payment' },
    { label: t('platform.app-captain.mobile.auto_platform_captain_earnings_get.financialReports'), screen: 'captain_financial_reports', icon: 'assessment' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>الأرباح والإحصائيات</Text>
          <Text style={styles.subtitle}>{getServiceDisplayName(earnings.service_mode)}</Text>
          <Text style={styles.lastUpdate}>
            آخر تحديث: {new Date(earnings.last_updated).toLocaleString('ar-SA')}
          </Text>
        </View>

        <View style={styles.content}>
          {/* ملخص الأرباح — داخل بطاقة واحدة */}
          <Text style={styles.sectionTitle}>ملخص الأرباح</Text>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{formatCompactCurrency(earnings.total_earnings)}</Text>
                <Text style={styles.summaryLabel}>إجمالي الأرباح</Text>
              </View>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{formatCompactCurrency(earnings.monthly_earnings)}</Text>
                <Text style={styles.summaryLabel}>هذا الشهر</Text>
              </View>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{formatCurrency(earnings.today_earnings)}</Text>
                <Text style={styles.summaryLabel}>اليوم</Text>
              </View>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{formatCurrency(earnings.pending_payments)}</Text>
                <Text style={styles.summaryLabel}>في الانتظار</Text>
                <Text style={styles.pendingLabel}>(قيد المراجعة)</Text>
              </View>
            </View>
          </View>

          {/* الإحصائيات + التقييم — داخل بطاقة واحدة */}
          <Text style={styles.sectionTitle}>الإحصائيات وتقييمك</Text>
          <View style={styles.statsCard}>
            <View style={[styles.statsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{earnings.transaction_count.toLocaleString('ar-SA')}</Text>
                <Text style={styles.statLabel}>عدد الرحلات / المعاملات</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.ratingStars}>⭐ {earnings.average_rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>تقييمك — استمرّ بهذا المستوى</Text>
              </View>
            </View>
            <View style={[styles.weeklyRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.weeklyLabel}>هذا الأسبوع</Text>
              <Text style={styles.weeklyValue}>{formatCurrency(earnings.weekly_earnings)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_earnings_get.comingSoon'), t('platform.app-captain.mobile.auto_platform_captain_earnings_get.comingSoon'))}
          >
            <Text style={styles.withdrawButtonText}>{t(`${NS}.withdrawButton`)}</Text>
          </TouchableOpacity>

          {/* Earnings & Wallet */}
          <View style={[styles.earningsWalletRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.earningsWalletCard}>
              <Text style={styles.earningsWalletLabel}>{t(`${NS}.labelEarnings`)}</Text>
              <Text style={styles.earningsWalletValue}>{formatCurrency(earnings.today_earnings)}</Text>
              <Text style={styles.earningsWalletHint}>{t(`${NS}.labelToday`)}</Text>
            </View>
            <TouchableOpacity
              style={styles.earningsWalletCard}
              onPress={() => navigation?.navigate('captain_wallet')}
              activeOpacity={0.8}
            >
              <Text style={styles.earningsWalletLabel}>{t(`${NS}.labelWallet`)}</Text>
              <Text style={styles.earningsWalletChevron}>{menuArrow}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>{t(`${NS}.sectionMore`)}</Text>
          <View style={styles.sectionCard}>
            {moreLinks.map((item, idx) => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.menuItem, idx < moreLinks.length - 1 && styles.menuItemBorder, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => navigation?.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuItemLeft, { flexDirection: 'row', direction: layoutDirection }]}>
                  <View style={styles.menuItemIcon}>
                    <ServiceIcon name={item.icon} size={22} color={semanticRoles.primaryCTA} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <ServiceIcon name="chevron-left" size={20} color={semanticRoles.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* المعاملات الأخيرة */}
          <Text style={styles.sectionTitle}>المعاملات الأخيرة</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={[styles.transactionHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.transactionAmount}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getTransactionStatusColor(transaction.status) }]}>
                  <Text style={styles.statusBadgeText}>
                    {transaction.status === 'completed' ? 'مكتمل' :
                     transaction.status === 'pending' ? t('surfaces.معلق') : t('surfaces.ملغي')}
                  </Text>
                </View>
              </View>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionType}>{getTransactionTypeText(transaction.type)}</Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleString('ar-SA')}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.detailsButton} onPress={() => {
            Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_earnings_get.fullEarningsDetailsComingSoon'), t('platform.app-captain.mobile.auto_platform_captain_earnings_get.fullEarningsDetailsComingSoon'));
          }}>
            <Text style={styles.detailsButtonText}>عرض التفاصيل الكاملة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  content: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  loadingText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorText: {
    fontSize: 16,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  retryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  retryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  lastUpdate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryCell: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.xs,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  pendingLabel: {
    fontSize: 10,
    color: semanticRoles.stateWarning?.icon ?? BTHWANI_COLORS.warning,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.lg,
  },
  statRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingStars: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  weeklyLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  weeklyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  withdrawButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.lg,
  },
  withdrawButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  earningsWalletRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.lg,
  },
  earningsWalletCard: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  earningsWalletLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  earningsWalletValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
  },
  earningsWalletHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  earningsWalletChevron: {
    fontSize: 20,
    color: semanticRoles.primaryCTA,
    marginTop: 4,
  },
  transactionCard: {
    marginTop: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: semanticRoles.stateSuccess?.icon ?? BTHWANI_COLORS.successGreen,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusBadgeText: {
    color: semanticRoles.surface,
    fontSize: 10,
    fontWeight: '600',
  },
  transactionDescription: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionType: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionDate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  detailsButton: {
    marginTop: BTHWANI_SPACING.lg,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoPlatformCaptainEarningsGet;
