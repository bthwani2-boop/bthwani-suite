'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getGrowthRecommendations,
  type GrowthRecommendation,
} from '../../shared/growth.preview-store';
import { mapStoreCommercialFeatures } from '../../shared/store-card-commercial-map';
import { CommercialParityPreview } from './commercial-parity-preview';
import type { PartnerOfferRecord } from '../../shared/partner-offer.preview-store';
import type { SubscriptionPlan, Entitlement } from '../../shared/loyalty.preview-store';
import type { CampaignRecord } from '../../shared/campaign.preview-store';

export type GrowthCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  setActiveTab?: (tab: string) => void;
};

const growthRecommendationsPageSize = 5;

export function GrowthCommandDeckScreen({ hubHref, operationsHref, setActiveTab }: GrowthCommandDeckScreenProps) {
  const { theme } = useTheme();
  const recommendations = React.useMemo(() => getGrowthRecommendations(), []);
  const [selectedRecId, setSelectedRecId] = React.useState<string | null>(recommendations[0]?.id || null);
  const [recommendationsPage, setRecommendationsPage] = React.useState(1);
  const sortedRecommendations = React.useMemo(
    () => [...recommendations].sort((a, b) => b.severity === 'critical' ? 1 : -1),
    [recommendations]
  );
  const totalPages = Math.max(1, Math.ceil(sortedRecommendations.length / growthRecommendationsPageSize));
  const visibleRecommendations = React.useMemo(() => {
    const startIndex = (recommendationsPage - 1) * growthRecommendationsPageSize;
    return sortedRecommendations.slice(startIndex, startIndex + growthRecommendationsPageSize);
  }, [recommendationsPage, sortedRecommendations]);

  const selectedRec = React.useMemo(
    () => recommendations.find(r => r.id === selectedRecId),
    [selectedRecId, recommendations]
  );

  React.useEffect(() => {
    setRecommendationsPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    if (!selectedRecId) {
      return;
    }

    const selectedIndex = sortedRecommendations.findIndex((item) => item.id === selectedRecId);
    if (selectedIndex < 0) {
      return;
    }

    setRecommendationsPage(Math.floor(selectedIndex / growthRecommendationsPageSize) + 1);
  }, [selectedRecId, sortedRecommendations]);

  const renderRecommendationIcon = (type: GrowthRecommendation['type']) => {
    switch (type) {
      case 'opportunity': return '';
      case 'gap': return '';
      case 'risk': return '';
      default: return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.danger;
      case 'high': return theme.warning;
      case 'medium': return theme.info;
      default: return theme.brandHeaderBackground;
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
      {
        id: 'off-1',
        title: 'خصم 20%',
        partnerName: 'شريك نمو',
        storeId: 'store-preview-1',
        storeLabel: 'المتجر التجريبي',
        productId: '',
        productLabel: '',
        category: 'العروض',
        offerType: 'discount',
        status: 'published',
        source: 'marketing',
        valueLabel: '20%',
        eligibility: 'الكل',
        displayBadge: 'خصم 20%',
      },
      {
        id: 'off-2',
        title: 'توصيل مجاني',
        partnerName: 'شريك نمو',
        storeId: 'store-preview-1',
        storeLabel: 'المتجر التجريبي',
        productId: '',
        productLabel: '',
        category: 'العروض',
        offerType: 'free-delivery',
        status: 'draft',
        source: 'marketing',
        valueLabel: 'توصيل مجاني',
        eligibility: 'الكل',
        displayBadge: 'توصيل مجاني',
      },
    ] as PartnerOfferRecord[],
    activeSubscriptions: [{ id: 'sub-pro', name: 'اشتراك برو', monthlyFee: 0, features: [], status: 'active' }] as SubscriptionPlan[],
    activeEntitlements: [{ id: 'ent-1', type: 'loyalty-reward', referenceId: 'sub-pro', status: 'active', source: 'loyalty' }] as Entitlement[],
    activeCampaigns: [] as CampaignRecord[],
    catalogFeatures: { priceMatch: true, hasNewProducts: false }
  }), []);

  const parityFeatures = React.useMemo(() => mapStoreCommercialFeatures(parityContext), [parityContext]);
  const styles = React.useMemo(() => StyleSheet.create({
    columnSurface: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 16,
      padding: 16,
    },
    queueBody: {
      flex: 1,
      minHeight: 0,
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
      borderBottomColor: theme.line,
    },
    detailLabel: {
      color: theme.textMuted,
      fontWeight: '700',
    },
    detailValue: {
      color: theme.brandHeaderBackground,
      fontWeight: '800',
    }
  }), [theme]);

  return (
    <Box gap={4} padding={4} style={{ flex: 1 }}>
      <Surface tone="raised" gap={2} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.line, padding: 16 }}>
        <Box gap={1}>
          <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: '800', letterSpacing: 0.5, textAlign: 'right' }}>مركز ذكاء النمو</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', textAlign: 'right' }}>التوصيات والفرص الذكية</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>يتم استنتاج هذه التوصيات بناءً على تحليل فجوات الكتالوج، الحملات، والولاء.</Text>
        </Box>
      </Surface>

      <Surface tone="inset" gap={3} style={{ borderRadius: 16, padding: 16, backgroundColor: theme.surfaceInset }}>
        <Box gap={1}>
          <Text role="titleSm" style={{ color: theme.brandHeaderBackground, fontWeight: '800' }}>معاينة التوافق التجاري</Text>
          <Text role="caption" tone="muted">يتم فحص مصادر البيانات لضمان عدم ظهور شارات بدون تصريح أو تضارب بين الحملات.</Text>
        </Box>
        <CommercialParityPreview features={parityFeatures} storeName="متجر النخبة (معاينة)" />
      </Surface>

      <Box layoutDirection="row" gap={4} style={{ flex: 1, flexWrap: 'wrap' }}>
        {/* Opportunity Queue */}
        <Box style={{ flex: 1, minWidth: 320 }}>
          <Surface tone="inset" gap={3} style={styles.columnSurface}>
            <View style={styles.headerRow}>
              <Text role="titleSm" style={{ color: theme.brandHeaderBackground }}>طابور الفرص والتوصيات</Text>
              <Text role="caption" tone="muted">{recommendations.length} توصية</Text>
            </View>

            <Box gap={3} style={styles.queueBody}>
                {visibleRecommendations.map((rec) => (
                  <View
                    key={rec.id}
                    style={{
                      flexDirection: 'row',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: selectedRecId === rec.id ? theme.brand : theme.line,
                      backgroundColor: theme.surface,
                      padding: 14,
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 32 }}>
                      <Text style={{ fontSize: 20 }}>{renderRecommendationIcon(rec.type)}</Text>
                    </View>
                    <Box style={{ flex: 1 }}>
                      <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, textAlign: 'right' }}>{rec.title}</Text>
                      <Text role="caption" style={{ color: getSeverityColor(rec.severity), fontWeight: '800', marginTop: 2, textAlign: 'right' }}>
                        الأهمية: {getSeverityLabel(rec.severity)}
                      </Text>
                      <Button label="عرض" size="sm" tone="ghost" onPress={() => setSelectedRecId(rec.id)} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
                    </Box>
                  </View>
                ))}
                <WebControlPanelCompactPager
                  page={recommendationsPage}
                  totalPages={totalPages}
                  summaryLabel={`عرض ${visibleRecommendations.length} من ${recommendations.length} توصيات`}
                  onPrevious={recommendationsPage > 1 ? () => setRecommendationsPage((currentPage) => currentPage - 1) : undefined}
                  onNext={recommendationsPage < totalPages ? () => setRecommendationsPage((currentPage) => currentPage + 1) : undefined}
                />
            </Box>
          </Surface>
        </Box>

        {/* Selected Insight Details & Next Actions */}
        <Box style={{ flex: 1.2, minWidth: 320 }}>
          {selectedRec ? (
            <Box gap={3} style={{ flex: 1 }}>
              <Surface tone="raised" gap={4} style={styles.columnSurface}>
                <View style={styles.headerRow}>
                  <Text role="titleSm" style={{ color: theme.brandHeaderBackground }}>تفاصيل التوصية</Text>
                  <Text role="caption" style={{ backgroundColor: theme.surfaceInset, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, fontWeight: '800' }}>{selectedRec.id}</Text>
                </View>

                <Box gap={2}>
                  <Text role="titleMd" style={{ color: theme.brandHeaderBackground, fontWeight: '900', textAlign: 'right' }}>{selectedRec.title}</Text>
                  <Text role="bodyMd" tone="muted" style={{ lineHeight: 22, textAlign: 'right' }}>{selectedRec.description}</Text>
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
                      <Text role="caption" style={{ ...styles.detailValue, color: theme.success }}>{getConfidenceLabel(selectedRec.confidence)}</Text>
                    </View>
                  </Box>
                </Surface>

                <Box gap={3} style={{ marginTop: 'auto' }}>
                  <Text role="caption" tone="muted" style={{ fontWeight: '800', textAlign: 'right' }}>الإجراء القادم المقترح</Text>
                  <Button
                    label={selectedRec.nextAction}
                    tone="primary"
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
              <Text role="bodyMd" tone="muted">اختر توصية لعرض التفاصيل</Text>
            </Surface>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default GrowthCommandDeckScreen;
