'use client';

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Box, Button, Surface, Text, useDirection } from '@bthwani/ui-kit';
import {
  getGrowthRecommendations,
  type GrowthRecommendation,
} from '../../shared/growth-store';
import { getCampaignKpis } from '../../shared/campaign-store';
import { getPartnerOfferKpis } from '../../shared/partner-offer-store';
import { getLoyaltyKpis } from '../../shared/loyalty-store';

export type GrowthCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

export function GrowthCommandDeckScreen(_: GrowthCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  const recommendations = React.useMemo(() => getGrowthRecommendations(), []);

  // Aggregate data from independent stores
  const campaignKpis = React.useMemo(() => getCampaignKpis(), []);
  const offerKpis = React.useMemo(() => getPartnerOfferKpis(), []);
  const loyaltyKpis = React.useMemo(() => getLoyaltyKpis(), []);

  const renderRecommendationIcon = (type: GrowthRecommendation['type']) => {
    switch (type) {
      case 'opportunity': return '💡';
      case 'gap': return '🎯';
      case 'risk': return '⚠️';
      default: return '📌';
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 8) return '#DC2626'; // High Priority (Red)
    if (score >= 6) return '#D97706'; // Medium Priority (Amber)
    return '#0A2F5C'; // Normal (Brand Blue)
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <Box gap={4} style={{ padding: '24px' }}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 24, borderWidth: 1, borderColor: 'rgba(10,47,92,0.05)', overflow: 'hidden' }}>
        <View style={[styles.headerRow, isRtl && styles.rowReverse, { padding: 4 }]}>
          <Box gap={1}>
            <Text role="caption" style={{ color: '#0A2F5C', fontWeight: '800', letterSpacing: 0.5 }}>الذكاء التجاري</Text>
            <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900' }}>مؤشرات النمو والتوصيات</Text>
          </Box>
        </View>

        {/* Global Overview reading from independent stores */}
        <View style={[styles.kpiGrid, isRtl && styles.rowReverse]}>
          <View style={[styles.kpiCard, { backgroundColor: '#EFF6FF', borderColor: 'rgba(0,0,0,0.03)' }]}>
            <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10 }}>الحملات النشطة</Text>
            <Text role="titleLg" style={{ color: '#1E40AF', fontWeight: '900', fontSize: 22 }}>{campaignKpis.active}</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#F0FDF4', borderColor: 'rgba(0,0,0,0.03)' }]}>
            <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10 }}>عروض جاهزة للتسويق</Text>
            <Text role="titleLg" style={{ color: '#166534', fontWeight: '900', fontSize: 22 }}>{offerKpis.marketingReady}</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#FFFBEB', borderColor: 'rgba(0,0,0,0.03)' }]}>
            <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10 }}>مشتركي الولاء</Text>
            <Text role="titleLg" style={{ color: '#92400E', fontWeight: '900', fontSize: 22 }}>{loyaltyKpis.subscriptions}</Text>
          </View>
        </View>
      </Surface>

      <View style={[styles.columnsWrap, isRtl && styles.rowReverse]}>

        {/* Next Best Action / Opportunity Queue */}
        <View style={styles.column}>
          <Surface tone="inset" gap={3} style={{ flex: 1, minHeight: 400 }}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm" style={{ color: '#0A2F5C' }}>طابور الفرص والتوصيات</Text>
              <Text role="caption" tone="muted">{recommendations.length} إجراء مقترح</Text>
            </View>

            <ScrollView style={{ maxHeight: 500 }}>
              <Box gap={3}>
                {recommendations.sort((a, b) => b.impactScore - a.impactScore).map((rec) => (
                  <View key={rec.id} style={[styles.listCard, isRtl && styles.rowReverse]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 40 }}>
                      <Text style={{ fontSize: 24 }}>{renderRecommendationIcon(rec.type)}</Text>
                    </View>
                    <View style={styles.listTextWrap}>
                      <Box layoutDirection={isRtl ? 'row-reverse' : 'row'} align="center" gap={2}>
                        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{rec.title}</Text>
                        <Text role="caption" style={{ color: getImpactColor(rec.impactScore), fontWeight: '800' }}>
                          تأثير: {rec.impactScore}/10
                        </Text>
                      </Box>
                      <Text role="caption" tone="muted" style={{ marginTop: 4, lineHeight: 18 }}>
                        {rec.description}
                      </Text>
                      <Box layoutDirection={isRtl ? 'row-reverse' : 'row'} justify="flex-start" style={{ marginTop: 8 }}>
                        <Button label={rec.actionLabel} tone="secondary" fullWidth={false} style={{ paddingHorizontal: 12, paddingVertical: 4, minHeight: 0 }} />
                      </Box>
                    </View>
                  </View>
                ))}
              </Box>
            </ScrollView>
          </Surface>
        </View>

        {/* Risk / Gap Indicators */}
        <View style={styles.column}>
          <Surface tone="raised" gap={3} style={{ flex: 1 }}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm" style={{ color: '#0A2F5C' }}>مؤشرات المخاطر والفجوات</Text>
            </View>
            <Box gap={2}>
              {recommendations.filter(r => r.type === 'risk' || r.type === 'gap').map(rec => (
                <View key={rec.id} style={[styles.riskCard, isRtl && styles.rowReverse]}>
                   <Text style={{ fontSize: 16 }}>{renderRecommendationIcon(rec.type)}</Text>
                   <Text role="caption" style={{ color: '#475569', flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                     {rec.description}
                   </Text>
                </View>
              ))}
              {recommendations.filter(r => r.type === 'risk' || r.type === 'gap').length === 0 && (
                <Text role="caption" tone="muted" style={{ textAlign: 'center', padding: 20 }}>لا توجد مخاطر مسجلة حالياً.</Text>
              )}
            </Box>
          </Surface>
        </View>

      </View>
    </Box>
    </div>
  );
}

const styles = StyleSheet.create({
  columnsWrap: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  column: {
    flex: 1,
    minWidth: 320,
    gap: 16,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    minWidth: 140,
    flexGrow: 1,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  listTextWrap: {
    flex: 1,
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  }
});

export default GrowthCommandDeckScreen;
