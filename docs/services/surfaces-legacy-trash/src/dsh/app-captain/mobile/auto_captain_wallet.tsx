// Auto-generated screen for captain_wallet
// Surface: app-captain | Service: dsh (shared with AMN — نفس المحتوى والأسلوب)
// Operation: GET /api/captain/wallet
// Description: Captain wallet balance and transaction history — unified for DSH and AMN

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components/ServiceIcon';
import { useCaptainType } from '../../../mobile/app-captain/CaptainTypeContext';
import { buildCaptainWalletMock, type WalletData, type Transaction } from '../../hooks';

interface AutoCaptainWalletProps {
  navigation?: any;
}

export const AutoCaptainWallet: React.FC<AutoCaptainWalletProps> = ({ navigation }) => {
  const { t } = useI18n();
  const { captainType } = useCaptainType();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAmn = captainType === 'amn';

  const loadWalletData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { walletData: data, transactions: txns } = buildCaptainWalletMock(t, isAmn);
      setWalletData(data);
      setTransactions(txns);
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  }, [captainType, t]);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const handleWithdraw = () => {
    if (walletData && walletData.availableForWithdrawal > 0) {
      navigation.navigate('captain_settlements');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning': return '💰';
      case 'withdrawal': return '💸';
      case 'bonus': return '🎁';
      default: return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earning': return semanticRoles.stateSuccess?.icon ?? BTHWANI_COLORS.successGreen;
      case 'withdrawal': return semanticRoles.stateError?.icon ?? BTHWANI_COLORS.danger;
      case 'bonus': return semanticRoles.stateWarning?.icon ?? BTHWANI_COLORS.warning;
      default: return semanticRoles.textMuted;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('surfaces.dsh_wallet_loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !walletData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || t('surfaces.dsh_wallet_empty')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWalletData}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getTransactionIconName = (type: string): 'payments' | 'account-balance' | 'card-giftcard' => {
    switch (type) {
      case 'earning': return 'payments';
      case 'withdrawal': return 'account-balance';
      case 'bonus': return 'card-giftcard';
      default: return 'payments';
    }
  };

  const serviceSubtitle = isAmn ? t('surfaces.dsh_captain_ride') : t('surfaces.dsh_captain_delivery');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('surfaces.captain_wallet')}</Text>
          <Text style={styles.subtitle}>{serviceSubtitle} — {t('surfaces.dsh_wallet_subtitle')}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t('dsh.app-captain.mobile.auto_captain_wallet.balanceLabel')}</Text>
            <Text style={styles.balanceAmount}>{walletData.balance.toFixed(2)} ريال</Text>
            <Text style={styles.availableText}>
              متاح للسحب: {walletData.availableForWithdrawal.toFixed(2)} ريال
            </Text>
            <TouchableOpacity
              style={[styles.withdrawButton, walletData.availableForWithdrawal <= 0 && styles.disabledButton]}
              onPress={handleWithdraw}
              disabled={walletData.availableForWithdrawal <= 0}
            >
              <Text style={[styles.withdrawButtonText, walletData.availableForWithdrawal <= 0 && styles.disabledButtonText]}>
                طلب سحب
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transferToCustomerButton}
              onPress={() => navigation?.navigate?.('wlt_captain_transfer_to_customer')}
              activeOpacity={0.7}
            >
              <Text style={styles.transferToCustomerButtonText}>{t('dsh.app-captain.mobile.auto_captain_wallet.transferButtonText')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topupButton}
              onPress={() => navigation?.navigate?.('wlt_topup')}
              activeOpacity={0.7}
            >
              <Text style={styles.topupButtonText}>{t('dsh.app-captain.mobile.auto_captain_wallet.topupButtonText')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sudadButton}
              onPress={() => navigation?.navigate?.('wlt_sudad_home')}
              activeOpacity={0.7}
            >
              <Text style={styles.sudadButtonText}>{t('dsh.app-captain.mobile.auto_captain_wallet.sudadButtonText')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>{t('dsh.app-captain.mobile.auto_captain_wallet.sectionTitleSummary')}</Text>
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{walletData.totalEarnings.toFixed(2)}</Text>
                <Text style={styles.statLabel}>{t('dsh.app-captain.mobile.auto_captain_wallet.statLabelProfits')}</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{walletData.totalWithdrawals.toFixed(2)}</Text>
                <Text style={styles.statLabel}>{t('dsh.app-captain.mobile.auto_captain_wallet.statLabelWithdrawals')}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>سجل المعاملات</Text>
          <View style={styles.sectionCard}>
            {transactions.map((item, idx) => (
              <View key={item.id} style={[styles.transactionItem, idx < transactions.length - 1 && styles.transactionItemBorder]}>
                <View style={styles.transactionLeft}>
                  <View style={styles.menuItemIcon}>
                    <ServiceIcon name={getTransactionIconName(item.type)} size={22} color={semanticRoles.primaryCTA} />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                    <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>
                      {getStatusText(item.status, t)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, { color: getTransactionColor(item.type) }]}>
                  {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)} ريال
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation?.navigate('platform_captain_earnings_get')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <ServiceIcon name="account-balance-wallet" size={22} color={semanticRoles.primaryCTA} />
              </View>
              <Text style={styles.menuItemLabel}>الذهاب إلى شاشة الأرباح</Text>
            </View>
            <ServiceIcon name="chevron-left" size={20} color={semanticRoles.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return semanticRoles.stateSuccess?.icon ?? BTHWANI_COLORS.successGreen;
    case 'pending': return semanticRoles.stateWarning?.icon ?? BTHWANI_COLORS.warning;
    case 'failed': return semanticRoles.stateError?.icon ?? BTHWANI_COLORS.danger;
    default: return semanticRoles.textMuted;
  }
};

const getStatusText = (status: string, translate: (key: string) => string) => {
  switch (status) {
    case 'completed': return translate('dsh.app-captain.mobile.auto_captain_wallet.statusCompleted');
    case 'pending': return translate('dsh.app-captain.mobile.auto_captain_wallet.statusPending');
    case 'failed': return translate('dsh.app-captain.mobile.auto_captain_wallet.statusFailed');
    default: return translate('dsh.app-captain.mobile.auto_captain_wallet.statusUnknown');
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scrollView: { flex: 1 },
  contentContainer: { paddingBottom: BTHWANI_SPACING.xl * 2 },
  content: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
  },
  header: {
    paddingVertical: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  retryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  retryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  availableText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  withdrawButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  withdrawButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  transferToCustomerButton: {
    marginTop: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
    alignItems: 'center',
  },
  transferToCustomerButtonText: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
    fontWeight: '600',
  },
  topupButton: {
    marginTop: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.stateSuccess?.icon ?? BTHWANI_COLORS.successGreen,
    alignItems: 'center',
  },
  topupButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  sudadButton: {
    marginTop: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
  },
  sudadButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  disabledButtonText: {
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
  statsRow: {
    flexDirection: 'row',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  transactionLeft: {
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  transactionDetails: { flex: 1 },
  transactionDescription: {
    fontSize: 15,
    color: semanticRoles.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: BTHWANI_SPACING.xl,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default AutoCaptainWallet;
