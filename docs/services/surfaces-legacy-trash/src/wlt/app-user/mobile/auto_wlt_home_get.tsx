// WLT Home Screen - Wallet Service
// Surface: app-client | Service: wlt
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Strong, Clean, Organized - Wallet Focus

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildWltHomeMock, type WltHomeData } from '../../fixtures/home';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface auto_wlt_home_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_wlt_home_get: React.FC<auto_wlt_home_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [homeData, setHomeData] = useState<WltHomeData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        navigation.navigate(screen, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  const loadHomeData = useCallback(async () => {
    try {
      setState('loading');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setHomeData(buildWltHomeMock(t, semanticRoles));
      setState('content');
    } catch (error) {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData().finally(() => setRefreshing(false));
  }, [loadHomeData]);

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return semanticRoles.stateSuccess.icon;
      case 'withdrawal': return semanticRoles.stateWarning.icon;
      case 'transfer': return semanticRoles.stateInfo.icon;
      case 'payment': return semanticRoles.stateError.icon;
      case 'refund': return semanticRoles.stateSuccess.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit': return t('surfaces.إيداع');
      case 'withdrawal': return t('surfaces.سحب');
      case 'transfer': return t('surfaces.تحويل');
      case 'payment': return t('surfaces.دفع');
      case 'refund': return t('surfaces.استرداد');
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.icon;
      case 'completed': return semanticRoles.stateSuccess.icon;
      case 'failed': return semanticRoles.stateError.icon;
      case 'cancelled': return semanticRoles.textMuted;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('surfaces.قيد_الانتظار');
      case 'completed': return t('surfaces.مكتمل');
      case 'failed': return t('surfaces.فشل');
      case 'cancelled': return t('surfaces.ملغي');
      default: return status;
    }
  };

  if (state === 'content' && homeData) {
    return (
      <ScreenWrapper state="content">
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Balance Card — يظهر أولاً (العنوان في هيدر التطبيق عند فتح WLT) */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t('surfaces.الرصيد_المتاح')}</Text>
            <Text style={styles.balanceAmount}>{homeData.available_balance?.toFixed(2)} ر.س</Text>
            {homeData.pending_balance && homeData.pending_balance > 0 && (
              <Text style={styles.pendingBalance}>
                {t('surfaces.قيد_الانتظار')}: {homeData.pending_balance.toFixed(2)} ر.س
              </Text>
            )}
          </View>

          {/* CTA رئيسي: شحن الرصيد — نقرة واحدة */}
          <View style={styles.primaryCtaSection}>
            <TouchableOpacity
              style={[styles.primaryCtaButton, { flexDirection: 'row', direction: layoutDirection }]}
              onPress={() => handleNavigate('WltTopup')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryCtaIcon}>💳</Text>
              <Text style={styles.primaryCtaLabel}>{t('surfaces.شحن_الرصيد')}</Text>
            </TouchableOpacity>
          </View>

          {/* إجراءات سريعة أخرى */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>{t('surfaces.إجراءات_أخرى')}</Text>
            <View style={[styles.quickActionsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {homeData.quickActions?.filter(a => a.screen !== 'WltTopup').map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => handleNavigate(action.screen, action.params)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Text style={styles.quickActionIconText}>{action.icon}</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{action.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.recentTransactionsSection}>
            <View style={[styles.sectionHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.sectionTitle}>{t('surfaces.المعاملات_الأخيرة')}</Text>
              <TouchableOpacity onPress={() => handleNavigate('WltTransactionsList')}>
                <Text style={styles.seeAllText}>
                  {homeData.recentTransactions?.length ? t('surfaces.عرض_الكل') : t('surfaces.المعاملات')}
                </Text>
              </TouchableOpacity>
            </View>
            {homeData.recentTransactions && homeData.recentTransactions.length > 0 ? (
              <>
              {homeData.recentTransactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionCard}
                  onPress={() => handleNavigate('WltTransactionsList')}
                >
                  <View style={[styles.transactionHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                    <View style={[styles.transactionTypeBadge, { backgroundColor: getTransactionTypeColor(transaction.type) }]}>
                      <Text style={styles.transactionTypeText}>{getTransactionTypeText(transaction.type)}</Text>
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionId}>{transaction.id}</Text>
                      <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    </View>
                    <View style={styles.transactionAmountContainer}>
                      <Text style={[
                        styles.transactionAmount,
                        { color: transaction.amount > 0 ? semanticRoles.stateSuccess.icon : semanticRoles.text }
                      ]}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} ر.س
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.transactionFooter, { flexDirection: 'row', direction: layoutDirection }]}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(transaction.status)}</Text>
                    </View>
                    <Text style={styles.transactionTime}>{transaction.timestamp}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              </>
            ) : (
              <View style={styles.emptyTransactions}>
                <Text style={styles.emptyTransactionsText}>
                  {t('surfaces.لا_توجد_معاملات_حديثة')}
                </Text>
                <Text style={styles.emptyTransactionsHint}>
                  {t('surfaces.ستظهر_معاملاتك_هنا')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_المحفظة')}
      errorMessage={t('surfaces.فشل_في_تحميل_المحفظة')}
      onErrorAction={loadHomeData}
      screenName="auto_wlt_home_get"
      operationName="wlt_home_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  balanceCard: {
    backgroundColor: semanticRoles.primaryCTA,
    margin: BTHWANI_SPACING.lg,
    marginTop: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCtaSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  primaryCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.xl,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    gap: BTHWANI_SPACING.sm,
  },
  primaryCtaIcon: {
    fontSize: 28,
  },
  primaryCtaLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  balanceLabel: {
    fontSize: 14,
    color: semanticRoles.primaryCTAText,
    marginBottom: BTHWANI_SPACING.sm,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
    marginBottom: BTHWANI_SPACING.xs,
  },
  pendingBalance: {
    fontSize: 12,
    color: semanticRoles.primaryCTAText,
    opacity: 0.8,
  },
  quickActionsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - BTHWANI_SPACING.contentH * 2 - BTHWANI_SPACING.md * 2) / 3,
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  seeAllText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  recentTransactionsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  emptyTransactions: {
    paddingVertical: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  emptyTransactionsText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  emptyTransactionsHint: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
    opacity: 0.8,
  },
  transactionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  transactionTypeBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginEnd: BTHWANI_SPACING.sm,
  },
  transactionTypeText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionId: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
});

export default auto_wlt_home_get;

