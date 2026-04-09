// Auto-generated screen for wlt_settlement_get
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildSettlementGetMock, type SettlementDetail, type Transaction } from '../../fixtures/settlement';

interface auto_wlt_settlement_getProps {
  settlementId?: string;
  
}

export const auto_wlt_settlement_get: React.FC<auto_wlt_settlement_getProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [settlement, setSettlement] = useState<SettlementDetail | null>(null);

  useEffect(() => {
    // Backend integration call
    const loadSettlement = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockSettlement = buildSettlementGetMock(t);

        setSettlement(mockSettlement);
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadSettlement();
  }, []);

  const getStatusColor = (status: SettlementDetail['status']) => {
    switch (status) {
      case 'completed': return BTHWANI_COLORS.success;
      case 'pending': return BTHWANI_COLORS.warning;
      case 'failed': return BTHWANI_COLORS.error;
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: SettlementDetail['status']) => {
    switch (status) {
      case 'completed': return t('wlt.settlement_status_completed');
      case 'pending': return t('wlt.settlement_status_pending');
      case 'failed': return t('wlt.settlement_status_failed');
      default: return status;
    }
  };

  const getTypeText = (type: SettlementDetail['type']) => {
    switch (type) {
      case 'merchant': return t('wlt.settlement_type_merchant');
      case 'provider': return t('wlt.settlement_type_provider');
      case 'partner': return t('wlt.settlement_type_partner');
      default: return type;
    }
  };

  const renderTransactionItem = (transaction: Transaction) => (
    <View key={transaction.id} style={[styles.transactionItem, { flexDirection: 'row', direction: layoutDirection }]}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        transaction.type === 'credit' ? styles.amountPositive : styles.amountNegative
      ]}>
        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} {settlement?.currency}
      </Text>
    </View>
  );

  const renderContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { textAlign: textAlignStart }]}>{t('wlt.settlement_details_title')}</Text>

      {/* Settlement Overview */}
      <View style={styles.overviewCard}>
        <View style={[styles.headerRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.reference}>{settlement?.reference}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(settlement!.status) }]}>
            <Text style={styles.statusText}>{getStatusText(settlement!.status)}</Text>
          </View>
        </View>

        <Text style={styles.description}>{settlement?.description}</Text>

        <View style={styles.amountSection}>
          <Text style={[styles.amountLabel, { textAlign: textAlignStart }]}>{t('wlt.settlement_amount_label')}</Text>
          <Text style={styles.amountValue}>
            {settlement?.amount.toLocaleString()} {settlement?.currency}
          </Text>
        </View>
      </View>

      {/* Settlement Details */}
      <View style={styles.detailsCard}>
        <Text style={[styles.sectionTitle, { textAlign: textAlignStart }]}>{t('wlt.settlement_info_title')}</Text>

        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={[styles.detailLabel, { textAlign: textAlignStart }]}>{t('wlt.settlement_type_label')}</Text>
          <Text style={styles.detailValue}>{getTypeText(settlement!.type)}</Text>
        </View>

        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.detailLabel}>{t('wlt.settlement_date')}</Text>
          <Text style={styles.detailValue}>{settlement?.date}</Text>
        </View>

        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.detailLabel}>{t('wlt.settlement_merchant_name')}</Text>
          <Text style={styles.detailValue}>{settlement?.merchantName}</Text>
        </View>
      </View>

      {/* Bank Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>{t('wlt.settlement_bank_title')}</Text>

        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.detailLabel}>{t('wlt.settlement_bank_name')}</Text>
          <Text style={styles.detailValue}>{settlement?.bankName}</Text>
        </View>

        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.detailLabel}>{t('wlt.settlement_account_number')}</Text>
          <Text style={styles.detailValue}>{settlement?.accountNumber}</Text>
        </View>
      </View>

      {/* Financial Summary */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>{t('wlt.settlement_financial_summary')}</Text>

        <View style={[styles.financialRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.financialLabel}>{t('wlt.settlement_total_transactions')}</Text>
          <Text style={styles.financialValue}>
            {settlement?.amount.toLocaleString()} {settlement?.currency}
          </Text>
        </View>

        <View style={[styles.financialRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.financialLabel}>{t('wlt.settlement_fees')}</Text>
          <Text style={styles.financialNegative}>
            -{settlement?.fees.toLocaleString()} {settlement?.currency}
          </Text>
        </View>

        <View style={[styles.financialRow, styles.netAmountRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.netAmountLabel}>{t('wlt.settlement_net_amount')}</Text>
          <Text style={styles.netAmountValue}>
            {settlement?.netAmount.toLocaleString()} {settlement?.currency}
          </Text>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsCard}>
        <Text style={[styles.sectionTitle, { textAlign: textAlignStart }]}>{t('wlt.settlement_transactions_included')}</Text>

        {settlement?.transactions.map(renderTransactionItem)}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>{t('wlt.settlement_download_details')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>{t('wlt.settlement_contact_support')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.securityNote}>
        <Text style={[styles.securityNoteText, { textAlign: textAlignStart }]}>
          🔒 {t('wlt.settlement_security_note')}
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <ScreenWrapper
      state={state}
      onErrorAction={() => {
        setState('loading');
        setTimeout(() => setState('content'), 1500);
      }}
    >
      {renderContent()}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.lg,
  },
  overviewCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  reference: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: BTHWANI_COLORS.onPrimary,
  },
  description: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  amountSection: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.sm,
  },
  amountLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.primary,
  },
  detailsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  detailValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  financialLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  financialValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  financialNegative: {
    fontSize: 14,
    color: BTHWANI_COLORS.error,
    fontWeight: '500',
  },
  netAmountRow: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.sm,
  },
  netAmountLabel: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '600',
  },
  netAmountValue: {
    fontSize: 18,
    color: BTHWANI_COLORS.success,
    fontWeight: 'bold',
  },
  transactionsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.outline,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  transactionDate: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountPositive: {
    color: BTHWANI_COLORS.success,
  },
  amountNegative: {
    color: BTHWANI_COLORS.error,
  },
  actionsContainer: {
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  downloadButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  contactButtonText: {
    color: BTHWANI_COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    backgroundColor: BTHWANI_COLORS.successContainer,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
  },
  securityNoteText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSuccessContainer,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default auto_wlt_settlement_get;

