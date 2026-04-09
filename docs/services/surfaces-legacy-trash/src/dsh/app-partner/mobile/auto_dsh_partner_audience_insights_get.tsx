import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenWrapper,
  semanticRoles,
  useI18n,
} from '@bthwani/ui-kit';
import { buildPartnerAudienceInsightsFixture } from '../../fixtures/partnerStaff';

export const AutoDshPartnerAudienceInsightsGet: React.FC = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const insights = useMemo(() => buildPartnerAudienceInsightsFixture(), []);

  return (
    <ScreenWrapper state='content'>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, textAlignStart]}>
          {t('dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.title')}
        </Text>

        <View style={styles.cardsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{insights.followersCount}</Text>
            <Text style={styles.metricLabel}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.followersCount'
              )}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{insights.repeatCustomers}</Text>
            <Text style={styles.metricLabel}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.repeatCustomers'
              )}
            </Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{insights.newCustomers}</Text>
            <Text style={styles.metricLabel}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.newCustomers'
              )}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{insights.conversionRate}%</Text>
            <Text style={styles.metricLabel}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.conversionRate'
              )}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, textAlignStart]}>
          {t(
            'dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.topWindows'
          )}
        </Text>
        {insights.topTimeWindows.map((item) => (
          <View key={item.label} style={styles.rowCard}>
            <Text style={[styles.rowTitle, textAlignStart]}>{item.label}</Text>
            <Text style={[styles.rowMeta, textAlignStart]}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_audience_insights_get.windowOrders',
                { count: item.orders }
              )}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  cardsRow: { flexDirection: 'row', gap: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.sm },
  metricCard: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  metricValue: { fontSize: 22, fontWeight: '700', color: semanticRoles.onSurface },
  metricLabel: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  rowCard: {
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    marginBottom: BTHWANI_SPACING.sm,
  },
  rowTitle: { fontSize: 14, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs },
  rowMeta: { fontSize: 12, color: semanticRoles.onSurfaceMuted },
});

export default AutoDshPartnerAudienceInsightsGet;
