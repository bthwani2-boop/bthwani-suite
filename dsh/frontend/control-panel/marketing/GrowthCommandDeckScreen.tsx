'use client';

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
import {
  getGrowthRecommendations,
  type GrowthRecommendation,
} from '../../shared/growth-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';

export type GrowthCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  setActiveTab?: (tab: string) => void;
};

export function GrowthCommandDeckScreen({ hubHref, operationsHref, setActiveTab }: GrowthCommandDeckScreenProps) {
  const recommendations = React.useMemo(() => getGrowthRecommendations(), []);
  const [selectedRecId, setSelectedRecId] = React.useState<string | null>(recommendations[0]?.id || null);

  const selectedRec = React.useMemo(
    () => recommendations.find(r => r.id === selectedRecId),
    [selectedRecId, recommendations]
  );

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
      case 'critical': return 'حرج جداً';
      case 'high': return 'مرتفع الأهمية';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return severity;
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'موثوقية عالية (نظام الذكاء)';
      case 'medium': return 'موثوقية متوسطة';
      case 'low': return 'موثوقية منخفضة';
      default: return confidence;
    }
  };

  const parityContext = React.useMemo(() => ({
    storeId: 'preview-store-1',
    activeOffers: [
      { id: 'off-1', title: 'خصم 20%', displayBadge: 'خصم 20%', status: 'published', offerType: 'discount' },
      { id: 'off-2', title: 'توصيل مجاني', displayBadge: 'توصيل مجاني', status: 'draft', offerType: 'free-delivery' }
    ] as any,
    activeSubscriptions: [{ id: 'sub-pro' }] as any,
    activeEntitlements: [] as any,
    activeCampaigns: [] as any,
    catalogFeatures: { priceMatch: true }
  }), []);

  const parityFeatures = React.useMemo(() => mapStoreCommercialFeatures(parityContext), [parityContext]);

  return (
    <Box gap={4} dir="rtl" padding={4} style={{ flex: 1 }}>
      <Surface tone="raised" gap={2} style={{ borderRadius: 16, borderWidth: 1, borderColor: 'rgba(10,47,92,0.05)', padding: 16 }}>
        <Box gap={1}>
          <Text role="caption" style={{ color: '#0A2F5C', fontWeight: '800', letterSpacing: 0.5, textAlign: 'right' }}>مركز ذكاء النمو</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', textAlign: 'right' }}>التوصيات والفرص الذكية</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>يتم استنتاج هذه التوصيات بناءً على تحليل فجوات الكتالوج، الحملات، والولاء.</Text>
        </Box>
      </Surface>

      <Surface tone="inset" gap={3} style={{ borderRadius: 16, padding: 16, backgroundColor: '#F8FAFC' }}>
        <Box gap={1}>
          <Text role="titleSm" style={{ color: '#0A2F5C', fontWeight: '800' }}>معاينة تطابق البيانات التجارية (Commercial Parity)</Text>
          <Text role="caption" tone="muted">يتم فحص مصادر البيانات لضمان عدم ظهور شارات بدون تصريح أو تضارب بين الحملات.</Text>
        </Box>
        <CommercialParityPreview features={parityFeatures} storeName="متجر النخبة (معاينة)" />
      </Surface>

      <Box layoutDirection="row" gap={4} style={{ flex: 1, flexWrap: 'wrap' }}>
        {/* Opportunity Queue */}
        <Box style={{ flex: 1, minWidth: 320 }}>
          <Surface tone="inset" gap={3} style={styles.columnSurface}>
            <View style={styles.headerRow}>
              <Text role="titleSm" style={{ color: '#0A2F5C' }}>طابور الفرص والتوصيات</Text>
              <Text role="caption" tone="muted">{recommendations.length} توصية</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              <Box gap={3}>
                {recommendations.sort((a, b) => b.severity === 'critical' ? 1 : -1).map((rec) => (
                  <View
                    key={rec.id}
                    style={{
                      flexDirection: 'row',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: selectedRecId === rec.id ? '#FF500D' : '#e5e7eb',
                      backgroundColor: '#ffffff',
                      padding: 14,
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 32 }}>
                      <Text style={{ fontSize: 20 }}>{renderRecommendationIcon(rec.type)}</Text>
                    </View>
                    <Box style={{ flex: 1 }}>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C', textAlign: 'right' }}>{rec.title}</Text>
                      <Text role="caption" style={{ color: getSeverityColor(rec.severity), fontWeight: '800', marginTop: 2, textAlign: 'right' }}>
                        الأهمية: {getSeverityLabel(rec.severity)}
                      </Text>
                      <Button label="عرض" size="sm" tone="ghost" onPress={() => setSelectedRecId(rec.id)} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
                    </Box>
                  </View>
                ))}
              </Box>
            </ScrollView>
          </Surface>
        </Box>

        {/* Selected Insight Details & Next Actions */}
        <Box style={{ flex: 1.2, minWidth: 320 }}>
          {selectedRec ? (
            <Box gap={3} style={{ flex: 1 }}>
              <Surface tone="raised" gap={4} style={styles.columnSurface}>
                <View style={styles.headerRow}>
                  <Text role="titleSm" style={{ color: '#0A2F5C' }}>تفاصيل التوصية</Text>
                  <Text role="caption" style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: 4, fontWeight: '800' }}>{selectedRec.id}</Text>
                </View>

                <Box gap={2}>
                  <Text role="titleMd" style={{ color: '#0A2F5C', fontWeight: '900', textAlign: 'right' }}>{selectedRec.title}</Text>
                  <Text role="body" tone="muted" style={{ lineHeight: 22, textAlign: 'right' }}>{selectedRec.description}</Text>
                </Box>

                <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 12 }}>
                  <Text role="caption" tone="muted" style={{ fontWeight: '800', textAlign: 'right' }}>تحليل المصدر والأثر</Text>
                  <Box gap={2}>
                    <View style={styles.detailRow}>
                      <Text role="caption" style={styles.detailLabel}>المالك:</Text>
                      <Text role="caption" style={styles.detailValue}>{selectedRec.owner}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text role="caption" style={styles.detailLabel}>المصدر:</Text>
                      <Text role="caption" style={styles.detailValue}>{selectedRec.source}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text role="caption" style={styles.detailLabel}>السطح المتأثر:</Text>
                      <Text role="caption" style={styles.detailValue}>{selectedRec.affectedSurface}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text role="caption" style={styles.detailLabel}>الموثوقية:</Text>
                      <Text role="caption" style={{ ...styles.detailValue, color: '#16A34A' }}>{getConfidenceLabel(selectedRec.confidence)}</Text>
                    </View>
                  </Box>
                </Surface>

                <Box gap={3} style={{ marginTop: 'auto' }}>
                  <Text role="caption" tone="muted" style={{ fontWeight: '800', textAlign: 'right' }}>الإجراء القادم المقترح</Text>
                  <Button
                    label={selectedRec.nextAction}
                    tone="brand"
                    onPress={() => {
                      if (setActiveTab) {
                        setActiveTab(selectedRec.actionTargetTab);
                      }
                    }}
                  />
                  <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 10 }}>سيتم توجيهك إلى تبويب: {selectedRec.actionTargetTab}</Text>
                </Box>
              </Surface>
            </Box>
          ) : (
            <Surface tone="inset" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }}>
              <Text role="body" tone="muted">اختر توصية لعرض التفاصيل</Text>
            </Surface>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  detailLabel: {
    color: '#64748B',
    fontWeight: '700',
  },
  detailValue: {
    color: '#0A2F5C',
    fontWeight: '800',
  }
});

export default GrowthCommandDeckScreen;
