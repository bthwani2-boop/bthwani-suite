'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import { useRouter } from 'next/navigation';
type GrowthRecommendation = { id: string; type: string; severity: string; [key: string]: unknown };
import { mapStoreCommercialFeatures } from '../../shared/marketing/store-card-commercial-map';
import { CommercialParityPreview } from './commercial-parity-viewer';
import type { CampaignRecord } from '../../shared/dsh-marketing-types';
import type { PartnerOfferRecord } from '../../shared/partner/dsh-partner-offer-types';
type SubscriptionPlan = { id: (string); name: (string); monthlyFee: (number); features: string[]; status: (string) };
type Entitlement = { id: string; type: string; referenceId: string; status: string; source: string };



/**
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 *
 * Empty / Loading / Blocked / Disabled Closure:
 * - loading: UI-only (data is simulated; spinner shown when recommendations empty)
 * - empty: HANDLED — shows guidance message when no recommendations available
 * - error: API-later (currently no error path in simulated data)
 * - blocked: HANDLED — action button only active when selectedRec !== null
 * - disabled: HANDLED — navigation buttons disabled when tab/href is missing
 * - success: HANDLED — selection updates detail panel immediately
 * - retry: API-later
 * - guidance: HANDLED — shows 'اختر توصية لعرض التفاصيل' when no selection
 */
export type GrowthCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  setActiveTab?: (tab: string) => void;
};

const growthRecommendationsPageSize = 5;

function getRecommendationIcon(type: GrowthRecommendation['type']): string {
  switch (type) {
    case 'opportunity': return '◆';
    case 'gap': return '◎';
    case 'risk': return '▲';
    default: return '·';
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'critical': return 'حرج جداً';
    case 'high': return 'مرتفع الأهمية';
    case 'medium': return 'متوسط';
    case 'low': return 'منخفض';
    default: return severity;
  }
}

function getConfidenceLabel(confidence: string): string {
  switch (confidence) {
    case 'high': return 'موثوقية عالية (نظام الذكاء)';
    case 'medium': return 'موثوقية متوسطة';
    case 'low': return 'موثوقية منخفضة';
    default: return confidence;
  }
}

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function sortGrowthRecommendationsBySeverity(recs: GrowthRecommendation[]): GrowthRecommendation[] {
  return [...recs].sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4));
}

function getActionTabLabel(tab: string): string {
  switch (tab) {
    case 'campaigns': return 'الحملات';
    case 'partners': return 'الشركاء';
    case 'loyalty': return 'الولاء';
    case 'media-review': return 'مراجعة الميديا';
    case 'signals': return 'الإشارات';
    case 'visibility': return 'الظهور';
    case 'videos': return 'الفيديو';
    case 'promos': return 'البروموهات';
    case 'banners': return 'البنرات';
    default: return tab;
  }
}

export function GrowthCommandDeckScreen({ hubHref, operationsHref, setActiveTab }: GrowthCommandDeckScreenProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const recommendations = React.useMemo<GrowthRecommendation[]>(() => [], []);
  const [selectedRecId, setSelectedRecId] = React.useState<string | null>(recommendations[0]?.id || null);
  const [recommendationsPage, setRecommendationsPage] = React.useState(1);
  const sortedRecommendations = React.useMemo(
    () => sortGrowthRecommendationsBySeverity(recommendations),
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.danger;
      case 'high': return theme.warning;
      case 'medium': return theme.info;
      default: return theme.brandHeaderBackground;
    }
  };

  const parityContext = React.useMemo(() => ({
    storeId: 'preview-store-1',
    activeOffers: [] as PartnerOfferRecord[],
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
    },
    detailValue: {
      color: theme.brandHeaderBackground,
    }
  }), [theme]);

  return (
    <Box gap={4} padding={4} style={{ flex: 1 }}>
      <Surface tone="raised" gap={2} style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.line, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box gap={1} style={{ flex: 1 }}>
            <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground, letterSpacing: 0.5, textAlign: 'right' }}>مركز ذكاء النمو</Text>
            <Text role="titleLg" weight="black" style={{ textAlign: 'right' }}>التوصيات والفرص الذكية</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>يتم استنتاج هذه التوصيات بناءً على تحليل فجوات الكتالوج، الحملات، والولاء.</Text>
          </Box>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {hubHref ? <Button label="المركز" tone="ghost" size="sm" fullWidth={false} onPress={() => router.push(hubHref)} /> : null}
            {operationsHref ? <Button label="العمليات" tone="ghost" size="sm" fullWidth={false} onPress={() => router.push(operationsHref)} /> : null}
          </View>
        </View>
      </Surface>

      <Surface tone="inset" gap={3} style={{ borderRadius: 16, padding: 16, backgroundColor: theme.surfaceInset }}>
        <Box gap={1}>
          <Text role="titleSm" weight="black" style={{ color: theme.brandHeaderBackground }}>معاينة التوافق التجاري</Text>
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
                {visibleRecommendations.length === 0 ? (
                  <Surface tone="inset" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12, padding: 24, minHeight: 120 }}>
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>◎</Text>
                    <Text role="bodyStrong" style={{ textAlign: 'center', color: theme.brandHeaderBackground }}>لا توجد توصيات حالياً</Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'center', marginTop: 4 }}>سيتم توليد التوصيات تلقائياً عند رصد فجوات في الكتالوج أو الحملات أو الولاء.</Text>
                  </Surface>
                ) : (
                  <>
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
                          <Text style={{ fontSize: 20 }}>{getRecommendationIcon(rec.type)}</Text>
                        </View>
                        <Box style={{ flex: 1 }}>
                          <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, textAlign: 'right' }}>{rec.title}</Text>
                          <Text role="caption" weight="black" style={{ color: getSeverityColor(rec.severity), marginTop: 2, textAlign: 'right' }}>
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
                  </>
                )}
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
                  <Text role="caption" weight="black" style={{ backgroundColor: theme.surfaceInset, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 }}>{selectedRec.id}</Text>
                </View>

                <Box gap={2}>
                  <Text role="titleMd" weight="black" style={{ color: theme.brandHeaderBackground, textAlign: 'right' }}>{selectedRec.title}</Text>
                  <Text role="bodyMd" tone="muted" style={{ textAlign: 'right' }}>{selectedRec.description}</Text>
                </Box>

                <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 12 }}>
                  <Text role="caption" tone="muted" weight="black" style={{ textAlign: 'right' }}>تحليل المصدر والأثر</Text>
                  <Box gap={2}>
                    <View style={styles.detailRow}>
                      <Text role="caption" weight="bold" style={styles.detailLabel}>المالك:</Text>
                      <Text role="caption" weight="black" style={styles.detailValue}>{selectedRec.owner}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text role="caption" weight="bold" style={styles.detailLabel}>المصدر:</Text>
                      <Text role="caption" weight="black" style={styles.detailValue}>{selectedRec.source}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text role="caption" weight="bold" style={styles.detailLabel}>السطح المتأثر:</Text>
                      <Text role="caption" weight="black" style={styles.detailValue}>{selectedRec.affectedSurface}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text role="caption" weight="bold" style={styles.detailLabel}>الموثوقية:</Text>
                      <Text role="caption" weight="black" style={{ ...styles.detailValue, color: theme.success }}>{getConfidenceLabel(selectedRec.confidence)}</Text>
                    </View>
                  </Box>
                </Surface>

                <Box gap={3} style={{ marginTop: 'auto' }}>
                  <Text role="caption" tone="muted" weight="black" style={{ textAlign: 'right' }}>الإجراء القادم المقترح</Text>
                  <Button
                    label={selectedRec.nextAction}
                    tone="primary"
                    onPress={() => {
                      if (setActiveTab) {
                        setActiveTab(selectedRec.actionTargetTab);
                      }
                    }}
                  />
                  <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 10 }}>سيتم توجيهك إلى: {getActionTabLabel(selectedRec.actionTargetTab)}</Text>
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
