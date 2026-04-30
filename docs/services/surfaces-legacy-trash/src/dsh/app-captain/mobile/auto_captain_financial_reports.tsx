// Auto-generated screen for captain_financial_reports
// Surface: app-captain | Service: dsh
// Operation: GET /api/captain/reports/financial
// Description: Captain financial reports and analytics

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildFinancialReportMock, type FinancialReport } from '../../hooks';

interface AutoCaptainFinancialReportsProps {
  navigation?: any;
}

export const AutoCaptainFinancialReports: React.FC<AutoCaptainFinancialReportsProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFinancialReport();
  }, [selectedPeriod]);

  const loadFinancialReport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // const response = await api.get(`/api/captain/reports/financial?period=${selectedPeriod}`);

      const mockReport = buildFinancialReportMock(t);

      setReport(mockReport);
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_captain_financial_reports.errorMessage'));
      } finally {
      setIsLoading(false);
    }
  };

  const generateReport = () => {
    
    };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري تحميل التقرير المالي...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || t('surfaces.dsh_report_empty')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFinancialReport}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {[
          { key: 'monthly', label: t('surfaces.dsh_period_monthly') },
          { key: 'quarterly', label: t('surfaces.dsh_period_quarterly') },
          { key: 'yearly', label: t('surfaces.dsh_period_yearly') }
        ].map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod(period.key as any)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period.key && styles.selectedPeriodText
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Report Header */}
        <View style={styles.headerCard}>
          <Text style={styles.reportTitle}>التقرير المالي</Text>
          <Text style={styles.reportPeriod}>{report.period}</Text>
          <TouchableOpacity style={styles.generateButton} onPress={generateReport}>
            <Text style={styles.generateButtonText}>إنشاء تقرير PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>ملخص مالي</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{report.totalEarnings.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>إجمالي الإيرادات</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colorTokens.error['500'] }]}>{report.totalDeductions.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>إجمالي الخصومات</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colorTokens.success['600'] }]}>{report.netIncome.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>صافي الدخل</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colorTokens.warning['500'] }]}>{report.finalAmount.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>المبلغ النهائي</Text>
            </View>
          </View>
        </View>

        {/* Income Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>تفصيل الإيرادات</Text>
          <View style={styles.breakdownList}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>إيرادات التوصيل</Text>
              <Text style={[styles.breakdownValue, { color: colorTokens.success['600'] }]}>
                +{report.breakdown.deliveries.toFixed(2)} ريال
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>المكافآت</Text>
              <Text style={[styles.breakdownValue, { color: colorTokens.primary['500'] }]}>
                +{report.breakdown.bonuses.toFixed(2)} ريال
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>الغرامات</Text>
              <Text style={[styles.breakdownValue, { color: colorTokens.error['500'] }]}>
                {report.breakdown.penalties.toFixed(2)} ريال
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>إيرادات أخرى</Text>
              <Text style={[styles.breakdownValue, { color: report.breakdown.otherIncome >= 0 ? colorTokens.success['600'] : colorTokens.error['500'] }]}>
                {report.breakdown.otherIncome >= 0 ? '+' : ''}{report.breakdown.otherIncome.toFixed(2)} ريال
              </Text>
            </View>
          </View>
        </View>

        {/* Tax Information */}
        <View style={styles.taxCard}>
          <Text style={styles.sectionTitle}>معلومات الضرائب</Text>
          <View style={styles.taxInfo}>
            <Text style={styles.taxLabel}>مبلغ الضريبة المستقطعة:</Text>
            <Text style={styles.taxValue}>{report.taxAmount.toFixed(2)} ريال</Text>
          </View>
          <Text style={styles.taxNote}>
            * الضرائب محسوبة وفقاً للأنظمة المالية المعمول بها
          </Text>
        </View>

        {/* Performance Trends */}
        <View style={styles.trendsCard}>
          <Text style={styles.sectionTitle}>الاتجاهات والأداء</Text>
          <View style={styles.trendsList}>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>معدل النمو</Text>
              <Text style={[styles.trendValue, { color: report.trends.growth >= 0 ? colorTokens.success['600'] : colorTokens.error['500'] }]}>
                {report.trends.growth >= 0 ? '+' : ''}{report.trends.growth.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>متوسط يومي</Text>
              <Text style={styles.trendValue}>{report.trends.averageDaily.toFixed(2)} ريال</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>أفضل شهر</Text>
              <Text style={styles.trendValue}>{report.trends.bestMonth}</Text>
            </View>
          </View>
        </View>

        {/* سجل الأرباح والمدفوعات من شاشة الأرباح ← المزيد (تفادي التكرار) */}
        <View style={styles.navigationCard}>
          <Text style={styles.sectionTitle}>تقارير أخرى</Text>
          <TouchableOpacity
            style={styles.backToEarningsButton}
            onPress={() => navigation.navigate('platform_captain_earnings_get')}
            activeOpacity={0.7}
          >
            <Text style={styles.backToEarningsButtonText}>الذهاب إلى شاشة الأرباح</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.surface.secondary,
  },
  periodSelector: {
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
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriod: {
    backgroundColor: colorTokens.primary['500'],
  },
  periodButtonText: {
    fontSize: 14,
    color: colorTokens.text.tertiary,
    fontWeight: '600',
  },
  selectedPeriodText: {
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
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 4,
  },
  reportPeriod: {
    fontSize: 16,
    color: colorTokens.text.tertiary,
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: colorTokens.success['600'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: colorTokens.surface.secondary,
    borderRadius: 8,
    padding: 12,
    margin: '1%',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colorTokens.text.tertiary,
    textAlign: 'center',
  },
  breakdownCard: {
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
  breakdownList: {
    marginTop: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colorTokens.surface.tertiary,
  },
  breakdownLabel: {
    fontSize: 14,
    color: colorTokens.neutral['800'],
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  taxCard: {
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
  taxInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taxLabel: {
    fontSize: 14,
    color: colorTokens.neutral['800'],
  },
  taxValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorTokens.warning['500'],
  },
  taxNote: {
    fontSize: 12,
    color: colorTokens.text.tertiary,
    fontStyle: 'italic',
  },
  trendsCard: {
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
  trendsList: {
    marginTop: 8,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colorTokens.surface.tertiary,
  },
  trendLabel: {
    fontSize: 14,
    color: colorTokens.neutral['800'],
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colorTokens.success['600'],
  },
  navigationCard: {
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
  backToEarningsButton: {
    backgroundColor: colorTokens.primary['500'],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  backToEarningsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AutoCaptainFinancialReports;
