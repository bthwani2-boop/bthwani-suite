// Auto-generated screen for captain_payments
// Surface: app-captain | Service: dsh
// Operation: GET /api/captain/payments
// Description: Captain payments and financial transactions overview

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildCaptainPaymentsMock, type PaymentRecord, type PaymentStats } from '../../hooks';

interface AutoCaptainPaymentsProps {
  navigation?: any;
}

export const AutoCaptainPayments: React.FC<AutoCaptainPaymentsProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { records, stats } = buildCaptainPaymentsMock(t);
      setPaymentRecords(records);
      setPaymentStats(stats);
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadPaymentData();
  }, [loadPaymentData]);

  const filteredRecords = paymentRecords.filter(record => {
    if (selectedFilter === 'all') return true;
    return record.status === selectedFilter;
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'withdrawal': return '💸';
      case 'bonus': return '🎁';
      case 'penalty': return '⚠️';
      case 'refund': return '↩️';
      default: return '💳';
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'withdrawal': return colorTokens.error['500'];
      case 'bonus': return colorTokens.success['600'];
      case 'penalty': return colorTokens.warning['500'];
      case 'refund': return colorTokens.primary['500'];
      default: return colorTokens.neutral['500'];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colorTokens.success['600'];
      case 'pending': return colorTokens.warning['500'];
      case 'failed': return colorTokens.error['500'];
      default: return colorTokens.neutral['500'];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('surfaces.dsh_status_completed');
      case 'pending': return t('surfaces.dsh_status_pending');
      case 'failed': return t('surfaces.dsh_status_failed');
      default: return t('surfaces.dsh_status_unspecified');
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

  if (error || !paymentStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || t('surfaces.dsh_payments_empty')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPaymentData}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {[
          { key: 'all', label: t('surfaces.arb_filter_all') },
          { key: 'completed', label: t('surfaces.dsh_filter_completed') },
          { key: 'pending', label: t('surfaces.arb_filter_pending') }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.selectedFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.key && styles.selectedFilterTabText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Payment Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>إحصائيات المدفوعات</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{paymentStats.totalPaid.toFixed(2)}</Text>
              <Text style={styles.statLabel}>إجمالي المدفوعات</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{paymentStats.pendingPayments.toFixed(2)}</Text>
              <Text style={styles.statLabel}>قيد الانتظار</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{paymentStats.monthlyAverage.toFixed(2)}</Text>
              <Text style={styles.statLabel}>متوسط شهري</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {paymentStats.lastPayment ? paymentStats.lastPayment.amount.toFixed(2) : t('dsh.app-captain.mobile.auto_captain_payments.emptyShort')}
              </Text>
              <Text style={styles.statLabel}>آخر دفعة</Text>
              {paymentStats.lastPayment && (
                <Text style={styles.statSubLabel}>{paymentStats.lastPayment.date}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Payment Records */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>سجل المعاملات المالية</Text>
          <FlatList
            data={filteredRecords}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <View style={styles.recordLeft}>
                  <Text style={styles.recordIcon}>{getPaymentIcon(item.type)}</Text>
                  <View style={styles.recordDetails}>
                    <Text style={styles.recordDescription}>{item.description}</Text>
                    <Text style={styles.recordDate}>{item.date}</Text>
                    {item.reference && (
                      <Text style={styles.recordReference}>المرجع: {item.reference}</Text>
                    )}
                    {item.paymentMethod && (
                      <Text style={styles.recordMethod}>الطريقة: {item.paymentMethod}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.recordRight}>
                  <Text style={[styles.recordAmount, { color: getPaymentColor(item.type) }]}>
                    {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)} ريال
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusBadgeText}>{getStatusText(item.status)}</Text>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('captain_settlements')}
        >
          <Text style={styles.primaryButtonText}>طلب سحب</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.surface.secondary,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedFilterTab: {
    backgroundColor: colorTokens.primary['500'],
  },
  filterTabText: {
    fontSize: 14,
    color: colorTokens.text.tertiary,
    fontWeight: '600',
  },
  selectedFilterTabText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colorTokens.text.tertiary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colorTokens.error['500'],
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colorTokens.primary['500'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '48%',
    backgroundColor: colorTokens.surface.secondary,
    borderRadius: 8,
    padding: 12,
    margin: '1%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colorTokens.text.tertiary,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 10,
    color: colorTokens.text.disabled,
    marginTop: 2,
  },
  recordsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 16,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  recordIcon: {
    fontSize: 20,
    marginEnd: 12,
    marginTop: 2,
  },
  recordDetails: {
    flex: 1,
  },
  recordDescription: {
    fontSize: 14,
    color: colorTokens.neutral['800'],
    marginBottom: 4,
    lineHeight: 18,
  },
  recordDate: {
    fontSize: 12,
    color: colorTokens.text.tertiary,
    marginBottom: 2,
  },
  recordReference: {
    fontSize: 11,
    color: colorTokens.text.tertiary,
    marginBottom: 1,
  },
  recordMethod: {
    fontSize: 11,
    color: colorTokens.text.tertiary,
  },
  recordRight: {
    alignItems: 'flex-end',
  },
  recordAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colorTokens.border.light,
  },
  primaryButton: {
    backgroundColor: colorTokens.success['600'],
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AutoCaptainPayments;
