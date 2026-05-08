'use client';

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
import {
  getGrowthRecommendations,
  type GrowthRecommendation,
} from '../../shared/growth-store';
import { getCampaignKpis } from '../../shared/campaign-store';
import { getPartnerOfferKpis } from '../../shared/partner-offer-store';
import { getLoyaltyKpis } from '../../shared/loyalty-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';

export type GrowthCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  setActiveTab?: (tab: string) => void;
};

export function GrowthCommandDeckScreen(_: GrowthCommandDeckScreenProps) {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#D97706';
      case 'medium': return '#0284C7';
      default: return '#0A2F5C';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'حرج';
      case 'high': return 'مرتفع';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return severity;
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'موثوقية عالية';
      case 'medium': return 'موثوقية متوسطة';
      case 'low': return 'موثوقية منخفضة';
      default: return confidence;
    }
  };

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px', boxSizing: 'border-box' }}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 16, borderWidth: 1, borderColor: 'rgba(10,47,92,0.05)', overflow: 'hidden', padding: 16 }}>
        <View style={styles.headerRow}>
          <Box gap={1}>
            <Text role="caption" style={{ color: '#0A2F5C', fontWeight: '800', letterSpacing: 0.5, textAlign: 'right' }}>الذكاء التجاري</Text>
            <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', textAlign: 'right' }}>مؤشرات النمو والتوصيات</Text>
          </Box>
        </View>

        {/* Global Overview reading from independent stores */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: '#EFF6FF', borderColor: 'rgba(0,0,0,0.03)' }]}>
            <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10, textAlign: 'right', width: '100%' }}>الحملات النشطة</Text>
            <Text role="titleLg" style={{ color: '#1E40AF', fontWeight: '900', fontSize: 22, textAlign: 'right', width: '100%' }}>{campaignKpis.active}</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#F0FDF4', borderColor: 'rgba(0,0,0,0.03)' }]}>
            <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10, textAlign: 'right', width: '100%' }}>عروض جاهزة للتسويق</Text>
            <Text role="titleLg" style={{ color: '#166534', fontWeight: '900', fontSize: 22, textAlign: 'right', width: '100%' }}>{offerKpis.marketingReady}</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#FFFBEB', borderColor: 'rgba(0,0,0,0.03)' }]}>
            <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10, textAlign: 'right', width: '100%' }}>مشتركي الولاء</Text>
            <Text role="titleLg" style={{ color: '#92400E', fontWeight: '900', fontSize: 22, textAlign: 'right', width: '100%' }}>{loyaltyKpis.subscriptions}</Text>
          </View>
        </View>
      </Surface>

      <View style={styles.columnsWrap}>
        {/* Next Best Action / Opportunity Queue */}
        <View style={styles.column}>
          <Surface tone="inset" gap={3} style={styles.columnSurface}>
            <View style={styles.headerRow}>
              <Text role="titleSm" style={{ color: '#0A2F5C' }}>طابور الفرص والتوصيات</Text>
              <Text role="caption" tone="muted">{recommendations.length} إجراء مقترح</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              <Box gap={3}>
                {recommendations.sort((a, b) => b.impactScore - a.impactScore).map((rec) => (
                  <View key={rec.id} style={styles.listCard}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 40 }}>
                      <Text style={{ fontSize: 24 }}>{renderRecommendationIcon(rec.type)}</Text>
                    </View>
                    <View style={styles.listTextWrap}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text role="bodyStrong" style={{ color: '#0A2F5C', flex: 1, textAlign: 'right' }}>{rec.title}</Text>
                        <Text role="caption" style={{ color: getSeverityColor(rec.severity), fontWeight: '800' }}>
                          أهمية: {getSeverityLabel(rec.severity)}
                        </Text>
                      </View>
                      <Text role="caption" tone="muted" style={{ marginTop: 4, lineHeight: 18, textAlign: 'right' }}>
                        {rec.description}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, color: '#475569', fontWeight: '800' }}>المالك: {rec.owner}</Text>
                        </View>
                        <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, color: '#475569', fontWeight: '800' }}>المصدر: {rec.source}</Text>
                        </View>
                        <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, color: '#475569', fontWeight: '800' }}>{getConfidenceLabel(rec.confidence)}</Text>
                        </View>
                        <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, color: '#475569', fontWeight: '800' }}>السطح المتأثر: {rec.affectedSurface}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 12 }}>
                        <Button label={rec.nextAction} tone="secondary" fullWidth={false} onPress={() => {
                          if (_.setActiveTab) {
                            _.setActiveTab(rec.actionTargetTab);
                          }
                        }} style={{ paddingHorizontal: 12, paddingVertical: 4, minHeight: 0 }} />
                      </View>
                    </View>
                  </View>
                ))}
              </Box>
            </ScrollView>
          </Surface>
        </View>

        {/* Risk / Gap Indicators & Store Card Preview */}
        <View style={styles.column}>
          <Box gap={3} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Surface tone="raised" gap={3} style={styles.columnSurface}>
              <View style={styles.headerRow}>
                <Text role="titleSm" style={{ color: '#0A2F5C' }}>مؤشرات المخاطر والفجوات</Text>
              </View>
              <ScrollView style={{ flex: 1, maxHeight: 200 }}>
                <Box gap={2}>
                  {recommendations.filter(r => r.type === 'risk' || r.type === 'gap').map(rec => (
                    <View key={rec.id} style={styles.riskCard}>
                       <Text style={{ fontSize: 16 }}>{renderRecommendationIcon(rec.type)}</Text>
                       <Text role="caption" style={{ color: '#475569', flex: 1, textAlign: 'right' }}>
                         {rec.description}
                       </Text>
                    </View>
                  ))}
                  {recommendations.filter(r => r.type === 'risk' || r.type === 'gap').length === 0 && (
                    <Text role="caption" tone="muted" style={{ textAlign: 'center', padding: 20 }}>لا توجد مخاطر مسجلة حالياً.</Text>
                  )}
                </Box>
              </ScrollView>
            </Surface>

            <Surface tone="raised" gap={3} style={styles.columnSurface}>
              <View style={styles.headerRow}>
                <Text role="titleSm" style={{ color: '#0A2F5C' }}>التحقق التجاري للبطاقات (Parity)</Text>
              </View>
              <View style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                <Text role="caption" tone="muted" style={{ marginBottom: 8, textAlign: 'right' }}>بطاقة متجر بمشاكل تضارب (محاكاة)</Text>
                <CommercialParityPreview
                  features={mapStoreCommercialFeatures({
                    storeId: 'test-store',
                    activeOffers: [{ id: 'mock', displayBadge: 'خصم 20%', offerType: 'discount' } as any],
                    activeSubscriptions: [],
                    activeEntitlements: [],
                    activeCampaigns: [{ id: 'c1', title: 'عروض الخريف', channels: ['store-card'] } as any],
                    catalogFeatures: { priceMatch: false }
                  })}
                  storeName="محمصة دانكن (اختبار التطابق)"
                />
              </View>
            </Surface>
          </Box>
        </View>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  columnsWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  column: {
    flex: 1,
    minWidth: 320,
  },
  columnSurface: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    minWidth: 140,
    flexGrow: 1,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
    alignItems: 'flex-start',
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 12,
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
