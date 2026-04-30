import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper, ScreenState, semanticRoles, BTHWANI_COLORS, BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getDshPartnerOrdersList } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { buildPartnerStaffAnalyticsFixture } from '../../fixtures/partnerStaff';

type EmployeeStat = {
  employeePhone: string;
  acceptedCount: number;
  deliveredCount: number;
  successRate: number;
};

export const AutoDshPartnerStaffAnalyticsGet: React.FC = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const [state, setState] = useState<ScreenState>('loading');
  const [summary, setSummary] = useState({
    totalOrders: 0,
    successfulOrders: 0,
    rejectedOrders: 0,
    topEmployeePhone: null as string | null,
  });
  const [employeeStats, setEmployeeStats] = useState<EmployeeStat[]>([]);

  const load = useCallback(async () => {
    setState('loading');
    try {
      const orders = await getDshPartnerOrdersList();
      if (orders.length === 0) {
        const fallback = buildPartnerStaffAnalyticsFixture();
        setSummary({
          totalOrders: fallback.totalOrders,
          successfulOrders: fallback.successfulOrders,
          rejectedOrders: fallback.rejectedOrders,
          topEmployeePhone: fallback.topEmployeePhone,
        });
        setEmployeeStats(fallback.byEmployee);
        setState('content');
        return;
      }

      const totalOrders = orders.length;
      const successfulOrders = orders.filter((o) => o.status === 'store_delivered' || o.status === 'handed_off' || o.status === 'delivered').length;
      const rejectedOrders = orders.filter((o) => o.status === 'cancelled' || o.status === 'rejected').length;
      const acceptedByMap = new Map<string, { accepted: number; delivered: number }>();
      orders.forEach((o) => {
        const phone = (o.acceptedByEmployeePhone ?? '').trim();
        if (!phone) return;
        const current = acceptedByMap.get(phone) ?? { accepted: 0, delivered: 0 };
        current.accepted += 1;
        if (o.status === 'store_delivered' || o.status === 'handed_off' || o.status === 'delivered') {
          current.delivered += 1;
        }
        acceptedByMap.set(phone, current);
      });

      const byEmployee: EmployeeStat[] = Array.from(acceptedByMap.entries())
        .map(([employeePhone, counts]) => ({
          employeePhone,
          acceptedCount: counts.accepted,
          deliveredCount: counts.delivered,
          successRate: counts.accepted > 0 ? Number(((counts.delivered / counts.accepted) * 100).toFixed(1)) : 0,
        }))
        .sort((a, b) => b.acceptedCount - a.acceptedCount);

      setSummary({
        totalOrders,
        successfulOrders,
        rejectedOrders,
        topEmployeePhone: byEmployee[0]?.employeePhone ?? null,
      });
      setEmployeeStats(byEmployee);
      setState('content');
    } catch {
      const fallback = buildPartnerStaffAnalyticsFixture();
      setSummary({
        totalOrders: fallback.totalOrders,
        successfulOrders: fallback.successfulOrders,
        rejectedOrders: fallback.rejectedOrders,
        topEmployeePhone: fallback.topEmployeePhone,
      });
      setEmployeeStats(fallback.byEmployee);
      setState('content');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.loadingMessage')}
        screenName="auto_dsh_partner_staff_analytics_get"
        operationName="dsh_partner_staff_analytics_get"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, textAlignStart]}>
          {t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.title')}
        </Text>
        <View style={styles.cardsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{summary.totalOrders}</Text>
            <Text style={styles.metricLabel}>{t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.totalOrders')}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{summary.successfulOrders}</Text>
            <Text style={styles.metricLabel}>{t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.successfulOrders')}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{summary.rejectedOrders}</Text>
            <Text style={styles.metricLabel}>{t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.rejectedOrders')}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.topEmployee')}
          </Text>
          <Text style={[styles.topValue, textAlignStart]}>
            {summary.topEmployeePhone ?? t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.notAvailable')}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.byEmployee')}
          </Text>
          {employeeStats.map((item) => (
            <View key={item.employeePhone} style={styles.rowCard}>
              <Text style={[styles.rowTitle, textAlignStart]}>{item.employeePhone}</Text>
              <Text style={[styles.rowMeta, textAlignStart]}>
                {t('dsh.app-partner.mobile.auto_dsh_partner_staff_analytics_get.employeeRow', {
                  accepted: item.acceptedCount,
                  delivered: item.deliveredCount,
                  rate: item.successRate,
                })}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.lg },
  cardsRow: { flexDirection: 'row', gap: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.lg },
  metricCard: { flex: 1, borderRadius: BTHWANI_RADIUS.md, padding: BTHWANI_SPACING.md, backgroundColor: BTHWANI_COLORS.surface, borderWidth: 1, borderColor: semanticRoles.outline },
  metricValue: { fontSize: 22, fontWeight: '700', color: semanticRoles.onSurface },
  metricLabel: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  section: { marginBottom: BTHWANI_SPACING.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.sm },
  topValue: { fontSize: 16, color: semanticRoles.primaryCTA, fontWeight: '700' },
  rowCard: { borderRadius: BTHWANI_RADIUS.md, padding: BTHWANI_SPACING.md, backgroundColor: BTHWANI_COLORS.surface, borderWidth: 1, borderColor: semanticRoles.outline, marginBottom: BTHWANI_SPACING.sm },
  rowTitle: { fontSize: 14, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs },
  rowMeta: { fontSize: 12, color: semanticRoles.onSurfaceMuted },
});

export default AutoDshPartnerStaffAnalyticsGet;
