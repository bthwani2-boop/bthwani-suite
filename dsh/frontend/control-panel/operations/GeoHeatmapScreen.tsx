'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { GEO_HEATMAP_ZONES } from './geo-heatmap.preview-data';
import { type DshUnifiedRecommendation } from '../shared';
import styles from './dsh-surface.module.css';

const SUB_TABS = [
  { id: 'orders', label: 'الطلبات' },
  { id: 'captains', label: 'الكباتن' },
  { id: 'stores', label: 'المتاجر' },
  { id: 'sla', label: 'SLA' },
  { id: 'peak', label: 'الذروة' },
] as const;

const TERTIARY_FILTERS = ['الآن', '١٥ دقيقة', '٣٠ دقيقة', 'خطر عالٍ', 'نقص كباتن', 'ضغط متاجر'] as const;

const FILTER_LABELS: Record<string, string> = {
  orders: 'الطلبات',
  captains: 'الكباتن',
  stores: 'المتاجر',
  sla: 'SLA',
  peak: 'الذروة',
  'الآن': 'الآن',
  '١٥ دقيقة': '١٥ دقيقة',
  '٣٠ دقيقة': '٣٠ دقيقة',
  'خطر عالٍ': 'خطر عالٍ',
  'نقص كباتن': 'نقص كباتن',
  'ضغط متاجر': 'ضغط متاجر',
};

function buildRecommendation(zoneId: string, zoneName: string, action: string, impact: string, ownerSurface: string, confidence: DshUnifiedRecommendation['confidence'], severity: DshUnifiedRecommendation['severity'], reason: string, evidence: string): DshUnifiedRecommendation {
  return {
    id: `geo-${zoneId}`,
    surface: ownerSurface,
    severity,
    confidence,
    affectedEntity: zoneName,
    reason,
    evidence,
    nextAction: action,
    owner: ownerSurface,
    expectedImpact: impact,
    primaryActionLabel: 'تنفيذ الآن',
    secondaryActionLabel: 'فتح الدليل',
  };
}

export function GeoHeatmapScreen({ hubHref, subGroup }: { hubHref: string; subGroup?: string }) {
  const [activeSubTab, setActiveSubTab] = React.useState(subGroup ?? 'orders');
  const [activeFilter, setActiveFilter] = React.useState<(typeof TERTIARY_FILTERS)[number] | 'الآن'>('الآن');
  const [selectedZoneId, setSelectedZoneId] = React.useState(GEO_HEATMAP_ZONES[0]?.id ?? '');

  React.useEffect(() => {
    if (subGroup) {
      setActiveSubTab(subGroup);
    }
  }, [subGroup]);

  const selectedZone = GEO_HEATMAP_ZONES.find((zone) => zone.id === selectedZoneId) ?? GEO_HEATMAP_ZONES[0];
  const filteredZones = GEO_HEATMAP_ZONES.filter((zone) => {
    if (activeSubTab === 'orders') {
      return zone.demandOrders >= 18;
    }
    if (activeSubTab === 'captains') {
      return zone.activeCaptains >= 5;
    }
    if (activeSubTab === 'stores') {
      return zone.storePressure !== 'منخفض';
    }
    if (activeSubTab === 'sla') {
      return zone.slaRisk !== 'منخفض';
    }
    return true;
  });

  const selectedRecommendation = selectedZone
    ? buildRecommendation(
        selectedZone.id,
        selectedZone.name,
        selectedZone.recommendedAction,
        selectedZone.expectedImpact,
        selectedZone.ownerSurface,
        selectedZone.confidence === 'عالية' ? 'high' : selectedZone.confidence === 'متوسطة' ? 'medium' : 'low',
        selectedZone.severity === 'danger' ? 'high' : selectedZone.severity === 'warning' ? 'medium' : 'low',
        `الطلب ${selectedZone.demandOrders} مقابل كباتن نشطين ${selectedZone.activeCaptains} ونقص ${selectedZone.supplyDemandGap}`,
        `delayed pickups ${selectedZone.delayedPickups} / SLA ${selectedZone.slaRisk} / pressure ${selectedZone.storePressure}`,
      )
    : undefined;

  return (
    <Box gap={3} dir="rtl">
      <div className={styles.operationsCockpitContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>الخريطة الحرارية</h2>
          <p className={styles.sectionSubtitle}>طلب وسعة ومخاطر تشغيلية في مساحة واحدة بلا SDK خارجي.</p>
        </div>

        <div className={styles.navigationCockpit}>
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.operationsTab} ${tab.id === activeSubTab ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveSubTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.filterDock}>
          {TERTIARY_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.operationsTab} ${filter === activeFilter ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {FILTER_LABELS[filter]}
            </button>
          ))}
        </div>

        <Box gap={3} className={styles.operationsGridTwoCol}>
          <Box gap={2} className={styles.operationsCompactPanel}>
            <Text role="titleSm">مصفوفة المناطق</Text>
            <div style={{ display: 'grid', gap: '8px' }}>
              {filteredZones.map((zone) => {
                const recommendation = buildRecommendation(
                  zone.id,
                  zone.name,
                  zone.recommendedAction,
                  zone.expectedImpact,
                  zone.ownerSurface,
                  zone.confidence === 'عالية' ? 'high' : zone.confidence === 'متوسطة' ? 'medium' : 'low',
                  zone.severity === 'danger' ? 'high' : zone.severity === 'warning' ? 'medium' : 'low',
                  `طلب ${zone.demandOrders} مع فجوة ${zone.supplyDemandGap} وإثبات متأخر ${zone.delayedPickups}`,
                  `كباتن نشطون ${zone.activeCaptains} / ضغط متاجر ${zone.storePressure}`,
                );

                return (
                  <WebControlPanelDecisionRow
                    key={zone.id}
                    entityId={zone.id}
                    entityLabel={`${zone.name} · الطلبات ${zone.demandOrders} · الكباتن ${zone.activeCaptains}`}
                    status={zone.slaRisk}
                    statusTone={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : 'success'}
                    risk={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : 'neutral'}
                    recommendation={zone.recommendedAction}
                    reason={`فجوة السعة ${zone.supplyDemandGap} · إثباتات متأخرة ${zone.delayedPickups}`}
                    sla={`ضغط المتاجر: ${zone.storePressure} · ثقة ${zone.confidence}`}
                    primaryAction={{ id: `${zone.id}-apply`, label: 'تنفيذ الآن', onAction: () => setSelectedZoneId(zone.id) }}
                    secondaryAction={{ id: `${zone.id}-inspect`, label: 'تثبيت النطاق', onAction: () => setSelectedZoneId(zone.id) }}
                    onInspect={() => setSelectedZoneId(zone.id)}
                  />
                );
              })}
            </div>
          </Box>

          <WebControlPanelInspectorShell title={`تفاصيل ${selectedZone?.name ?? ''}`} onClose={() => setSelectedZoneId(filteredZones[0]?.id ?? GEO_HEATMAP_ZONES[0]?.id ?? '')}>
            <Box gap={2}>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الطلب</Text>
                  <Text role="bodySm">{selectedZone?.demandOrders ?? 0}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الكباتن النشطون</Text>
                  <Text role="bodySm">{selectedZone?.activeCaptains ?? 0}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الكباتن الخاملون</Text>
                  <Text role="bodySm">{selectedZone?.idleCaptains ?? 0}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">فجوة العرض/الطلب</Text>
                  <Text role="bodySm">{selectedZone?.supplyDemandGap ?? 0}</Text>
                </Box>
              </div>

              <WebControlPanelRecommendation
                title="توصية المنطقة"
                reason={selectedRecommendation ? `لماذا؟ ${selectedRecommendation.reason} · ما الدليل؟ ${selectedRecommendation.evidence} · ما الأثر المتوقع؟ ${selectedRecommendation.expectedImpact}` : 'اختر منطقة لعرض التوصية.'}
                confidence={selectedRecommendation?.confidence ?? 'medium'}
                auditTag={selectedRecommendation?.owner ?? 'operations'}
                primaryAction={selectedRecommendation ? { id: `${selectedRecommendation.id}-primary`, label: selectedRecommendation.primaryActionLabel } : undefined}
                secondaryAction={selectedRecommendation ? { id: `${selectedRecommendation.id}-secondary`, label: selectedRecommendation.secondaryActionLabel } : undefined}
              />

              <WebControlPanelActionCluster
                primary={{ id: 'deploy', label: 'تنفيذ الخطة' }}
                secondary={{ id: 'proof', label: 'فتح الدليل' }}
              />

              <Box gap={1}>
                <WebControlPanelStatusTag label={`SLA ${selectedZone?.slaRisk ?? ''}`} tone={selectedZone?.slaRisk === 'حرج' ? 'danger' : selectedZone?.slaRisk === 'مرتفع' ? 'warning' : 'success'} />
                <WebControlPanelStatusTag label={`الضغط ${selectedZone?.storePressure ?? ''}`} tone={selectedZone?.storePressure === 'حرج' || selectedZone?.storePressure === 'مرتفع' ? 'warning' : 'success'} />
                <WebControlPanelStatusTag label={`الذروة ${activeFilter}`} tone="info" />
              </Box>
            </Box>
          </WebControlPanelInspectorShell>
        </Box>
      </div>
    </Box>
  );
}

export default GeoHeatmapScreen;
