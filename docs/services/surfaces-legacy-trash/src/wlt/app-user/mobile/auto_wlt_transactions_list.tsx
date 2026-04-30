// Auto-generated screen for wlt_transactions_list
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildWltTransactionsListMock, type Transaction } from '../../fixtures/transactionsList';

interface auto_wlt_transactions_listProps {
  
}

export const auto_wlt_transactions_list: React.FC<auto_wlt_transactions_listProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    // Backend integration call
    const loadTransactions = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate different states
        const mockSuccess = 0 > 0.08; // 92% success rate
        const mockHasTransactions = 0 > 0.05; // 95% have transactions

        if (!mockSuccess) {
          setState('error');
        } else if (!mockHasTransactions) {
          setState('empty');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadTransactions();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const transactions = React.useMemo(() => buildWltTransactionsListMock(t), [t]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit': return '📈';
      case 'debit': return '📉';
      case 'transfer': return '💸';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colorTokens.success['600'];
      case 'pending': return colorTokens.warning['500'];
      case 'failed': return colorTokens.error['500'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'قيد الانتظار';
      case 'failed': return t('surfaces.فاشل');
      default: return status;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'credit') return transaction.type === 'credit';
    if (filter === 'debit') return transaction.type === 'debit';
    return true;
  });

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionCard}>
      <View style={[styles.transactionHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={[styles.transactionType, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.transactionIcon}>{getTransactionIcon(item.type)}</Text>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            {item.counterparty && (
              <Text style={styles.transactionCounterparty}>إلى: {item.counterparty}</Text>
            )}
          </View>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            item.type === 'credit' && styles.creditAmount,
            item.type === 'debit' && styles.debitAmount
          ]}>
            {item.type === 'credit' ? '+' : '-'}{item.amount} {item.currency}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.transactionFooter, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.transactionDate}>{item.date} في {item.time}</Text>
        <Text style={styles.transactionReference}>المرجع: {item.reference}</Text>
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={styles.title}>سجل المعاملات</Text>
          <Text style={styles.subtitle}>جميع معاملات محفظتك المالية</Text>

          <View style={[styles.filterTabs, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                الكل ({transactions.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'credit' && styles.activeFilterTab]}
              onPress={() => setFilter('credit')}
            >
              <Text style={[styles.filterText, filter === 'credit' && styles.activeFilterText]}>
                الإيرادات ({transactions.filter(t => t.type === 'credit').length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'debit' && styles.activeFilterTab]}
              onPress={() => setFilter('debit')}
            >
              <Text style={[styles.filterText, filter === 'debit' && styles.activeFilterText]}>
                المصروفات ({transactions.filter(t => t.type === 'debit').length})
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionItem}
            contentContainerStyle={styles.transactionsList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>ملخص الفترة</Text>
            <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.summaryLabel}>إجمالي الإيرادات</Text>
              <Text style={[styles.summaryValue, styles.creditAmount]}>
                +{transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)} ريال
              </Text>
            </View>
            <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.summaryLabel}>إجمالي المصروفات</Text>
              <Text style={[styles.summaryValue, styles.debitAmount]}>
                -{transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)} ريال
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.netRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.netLabel}>صافي التغيير</Text>
              <Text style={styles.netValue}>
                {transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0) -
                 transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)} ريال
              </Text>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_سجل_المعاملات')}
      emptyMessage={t('surfaces.لا_توجد_معاملات_حتى_الآن')}
      emptyActionText={t('surfaces.إجراء_معاملة')}
      onEmptyAction={() => setState('content')}
      errorMessage={t('surfaces.فشل_في_تحميل_سجل_المعاملات')}
      onErrorAction={handleRetry}
      screenName="auto_wlt_transactions_list"
      operationName="wlt_transactions_list"
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
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xs,
  },
  filterTab: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.md,
  },
  activeFilterTab: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  activeFilterText: {
    color: BTHWANI_COLORS.onPrimary,
  },
  transactionsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  transactionCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  transactionType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionCounterparty: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: BTHWANI_SPACING.sm,
  },
  creditAmount: {
    color: colorTokens.success['600'],
  },
  debitAmount: {
    color: colorTokens.error['500'],
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
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  transactionReference: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
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
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  netRow: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  netLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  netValue: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
});

export default auto_wlt_transactions_list;

