// Auto-generated screen for captain_earnings_history
// Surface: app-captain | Service: dsh
// Operation: GET /api/captain/earnings/history
// Description: Captain earnings history and detailed breakdown

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildCaptainEarningsHistoryMock, type EarningsRecord, type SummaryStats } from '../../hooks';

interface AutoCaptainEarningsHistoryProps {
  navigation?: any;
}

export const AutoCaptainEarningsHistory: React.FC<AutoCaptainEarningsHistoryProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [earningsHistory, setEarningsHistory] = useState<EarningsRecord[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEarningsHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { earningsHistory: history, summaryStats: stats } = buildCaptainEarningsHistoryMock(t);
      setEarningsHistory(history);
      setSummaryStats(stats);
    } catch (err) {
      setError(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, t]);

  useEffect(() => {
    loadEarningsHistory();
  }, [loadEarningsHistory]);

  const toggleExpanded = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const getDetailIcon = (type: string) => {
    switch (type) {
      case 'delivery': return '🚚';
      case 'bonus': return '🎁';
      case 'deduction': return '⚠️';
      default: return '💰';
    }
  };

  const getDetailColor = (type: string) => {
    switch (type) {
      case 'delivery': return semanticRoles.stateSuccess?.icon ?? BTHWANI_COLORS.successGreen;
      case 'bonus': return semanticRoles.stateWarning?.icon ?? BTHWANI_COLORS.warning;
      case 'deduction': return semanticRoles.stateError?.icon ?? BTHWANI_COLORS.danger;
      default: return semanticRoles.textMuted;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('surfaces.dsh_earnings_loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !summaryStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || t('surfaces.dsh_earnings_empty')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEarningsHistory}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('surfaces.dsh_earnings_title')}</Text>
        <Text style={styles.subtitle}>{t('surfaces.dsh_earnings_subtitle')}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.periodCard}>
            {[
              { key: 'day', label: t('surfaces.dsh_period_daily') },
              { key: 'week', label: t('surfaces.dsh_period_weekly') },
              { key: 'month', label: t('surfaces.dsh_period_monthly') },
              { key: 'year', label: t('surfaces.dsh_period_yearly') },
            ].map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[styles.periodButton, selectedPeriod === period.key && styles.selectedPeriod]}
                onPress={() => setSelectedPeriod(period.key as 'day' | 'week' | 'month' | 'year')}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === period.key && styles.selectedPeriodText]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>ملخص الأرباح</Text>
          <View style={styles.sectionCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summaryStats.totalEarnings.toFixed(2)}</Text>
                <Text style={styles.statLabel}>إجمالي الأرباح</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summaryStats.totalDeliveries}</Text>
                <Text style={styles.statLabel}>عدد التوصيلات</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summaryStats.averagePerDelivery.toFixed(2)}</Text>
                <Text style={styles.statLabel}>متوسط للتوصيلة</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{summaryStats.bestDay.earnings.toFixed(2)}</Text>
                <Text style={styles.statLabel}>أفضل يوم</Text>
                <Text style={styles.statSubLabel}>{summaryStats.bestDay.date}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>تفاصيل الأرباح اليومية</Text>
          {earningsHistory.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <TouchableOpacity
                style={styles.recordHeader}
                onPress={() => toggleExpanded(record.id)}
              >
                <View style={styles.recordLeft}>
                  <Text style={styles.recordDate}>{record.date}</Text>
                  <Text style={styles.recordDeliveries}>{record.deliveriesCount} توصيلة</Text>
                </View>
                <View style={styles.recordRight}>
                  <Text style={styles.recordEarnings}>{record.netEarnings.toFixed(2)} ريال</Text>
                  <Text style={styles.recordDetails}>
                    {record.totalEarnings.toFixed(2)} + {record.bonuses.toFixed(2)} - {record.deductions.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedRecord === record.id && (
                <View style={styles.recordDetailsExpanded}>
                  {record.details.map((detail, index) => (
                    <View key={index} style={[styles.detailItem, index === record.details.length - 1 && styles.detailItemLast]}>
                      <View style={styles.detailLeft}>
                        <Text style={styles.detailIcon}>{getDetailIcon(detail.type)}</Text>
                        <View style={styles.detailInfo}>
                          <Text style={styles.detailDescription}>{detail.description}</Text>
                          {detail.orderId && (
                            <Text style={styles.detailOrderId}>#{detail.orderId}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={[styles.detailAmount, { color: getDetailColor(detail.type) }]}>
                        {detail.amount > 0 ? '+' : ''}{detail.amount.toFixed(2)} ريال
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  scrollView: { flex: 1 },
  contentContainer: { paddingBottom: BTHWANI_SPACING.xl * 2 },
  content: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
  },
  periodCard: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: 4,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.md,
  },
  selectedPeriod: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  periodButtonText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  selectedPeriodText: {
    color: semanticRoles.primaryCTAText,
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
  sectionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
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
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 10,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  recordCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: BTHWANI_SPACING.md,
  },
  recordLeft: { flex: 1 },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: 2,
  },
  recordDeliveries: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  recordRight: { alignItems: 'flex-end' },
  recordEarnings: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: 2,
  },
  recordDetails: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  recordDetailsExpanded: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  detailItemLast: {
    borderBottomWidth: 0,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.sm,
  },
  detailInfo: { flex: 1 },
  detailDescription: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: 2,
  },
  detailOrderId: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  detailAmount: {
    fontSize: 14,
    fontWeight: '600',
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
});

export default AutoCaptainEarningsHistory;
