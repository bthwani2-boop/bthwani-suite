'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelCompactPager,
  WebControlPanelDenseHeader,
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelLaneTabs,
  WebControlPanelMapCanvas,
  WebControlPanelMapPin,
  WebControlPanelMiniMapZone,
  WebControlPanelQueue,
  WebControlPanelRecommendation,
  WebControlPanelRouteLine,
  WebControlPanelStatusTag,
  WebControlPanelTertiaryFilters,
  WebControlPanelWorkbench,
} from '@bthwani/ui-kit/web';
import { GEO_HEATMAP_ZONES, type GeoHeatmapZone } from './geo-heatmap.preview-data';
import { translateDshRuntimeBindingStatus, type DshLifecycleStep, type DshSurfaceId, type DshUnifiedRecommendation } from '../shared';
import styles from '../shared/control-panel-surface.module.css';

const SUB_TABS = [
  { id: 'orders', label: 'الطلبات', affectedSurface: 'app-client' as const, lifecycleStep: 'tracking' as const },
  { id: 'captains', label: 'الكباتن', affectedSurface: 'app-captain' as const, lifecycleStep: 'delivery' as const },
  { id: 'stores', label: 'المتاجر', affectedSurface: 'app-partner' as const, lifecycleStep: 'partner-preparation' as const },
  { id: 'sla', label: 'الالتزام', affectedSurface: 'control-panel' as const, lifecycleStep: 'operations-monitoring' as const },
  { id: 'peak', label: 'الذروة', affectedSurface: 'control-panel' as const, lifecycleStep: 'operations-intervention' as const },
] as const;

const TERTIARY_FILTERS = ['الآن', '١٥ دقيقة', '٣٠ دقيقة', 'خطر عالٍ', 'نقص كباتن', 'ضغط متاجر'] as const;

const ZONE_LAYOUT: Record<string, {
  zone: { top: string; right: string; width: string; height: string };
  order: { top: string; right: string };
  captain: { top: string; right: string };
  store: { top: string; right: string };
  routePoints: string;
}> = {
  'N-01': {
    zone: { top: '7%', right: '8%', width: '28%', height: '28%' },
    order: { top: '18%', right: '18%' },
    captain: { top: '31%', right: '33%' },
    store: { top: '42%', right: '11%' },
    routePoints: '82,22 68,33 86,46',
  },
  'E-02': {
    zone: { top: '24%', right: '42%', width: '24%', height: '24%' },
    order: { top: '34%', right: '49%' },
    captain: { top: '44%', right: '62%' },
    store: { top: '55%', right: '45%' },
    routePoints: '54,36 40,46 58,58',
  },
  'C-03': {
    zone: { top: '42%', right: '22%', width: '20%', height: '20%' },
    order: { top: '49%', right: '29%' },
    captain: { top: '58%', right: '38%' },
    store: { top: '67%', right: '24%' },
    routePoints: '73,52 61,59 75,68',
  },
  'S-04': {
    zone: { top: '60%', right: '56%', width: '22%', height: '22%' },
    order: { top: '68%', right: '62%' },
    captain: { top: '76%', right: '73%' },
    store: { top: '84%', right: '58%' },
    routePoints: '41,70 28,77 43,86',
  },
};

const FILTER_LABELS: Record<string, string> = {
  orders: 'الطلبات',
  captains: 'الكباتن',
  stores: 'المتاجر',
  sla: 'الالتزام',
  peak: 'الذروة',
  'الآن': 'الآن',
  '١٥ دقيقة': '١٥ دقيقة',
  '٣٠ دقيقة': '٣٠ دقيقة',
  'خطر عالٍ': 'خطر عالٍ',
  'نقص كباتن': 'نقص كباتن',
  'ضغط متاجر': 'ضغط متاجر',
};

type GeoSubTabId = (typeof SUB_TABS)[number]['id'];
type GeoFilterId = (typeof TERTIARY_FILTERS)[number];

function resolveLifecycleStep(subTabId: GeoSubTabId): DshLifecycleStep {
  return SUB_TABS.find((tab) => tab.id === subTabId)?.lifecycleStep ?? 'operations-monitoring';
}

function resolveAffectedSurface(subTabId: GeoSubTabId): DshSurfaceId {
  return SUB_TABS.find((tab) => tab.id === subTabId)?.affectedSurface ?? 'control-panel';
}

function resolveSeverity(zone: GeoHeatmapZone): DshUnifiedRecommendation['severity'] {
  if (zone.severity === 'danger') {
    return 'high';
  }

  if (zone.severity === 'warning') {
    return 'medium';
  }

  return 'low';
}

function resolveConfidence(zone: GeoHeatmapZone): DshUnifiedRecommendation['confidence'] {
  if (zone.confidence === 'عالية') {
    return 'high';
  }

  if (zone.confidence === 'متوسطة') {
    return 'medium';
  }

  return 'low';
}

function resolveStatusTone(zone: GeoHeatmapZone) {
  if (zone.severity === 'danger') {
    return 'danger' as const;
  }

  if (zone.severity === 'warning') {
    return 'warning' as const;
  }

  return 'success' as const;
}

function resolveRiskLabel(zone: GeoHeatmapZone) {
  if (zone.severity === 'danger') {
    return 'خطر عالٍ';
  }

  if (zone.severity === 'warning') {
    return 'خطر متوسط';
  }

  return 'مستقر';
}

function resolveStatusLabel(zone: GeoHeatmapZone, subTabId: GeoSubTabId) {
  if (subTabId === 'orders') {
    return `طلبات ${zone.demandOrders}`;
  }

  if (subTabId === 'captains') {
    return `كباتن ${zone.activeCaptains}`;
  }

  if (subTabId === 'stores') {
    return `ضغط ${zone.storePressure}`;
  }

  if (subTabId === 'sla') {
    return `التزام ${zone.slaRisk}`;
  }

  return `فجوة ${zone.supplyDemandGap}`;
}

function resolveRouteHint(hubHref: string, zoneId: string) {
  return `${hubHref}?workspace=geo-heatmap&zoneId=${zoneId}`;
}

function resolveMapPinLabel(zone: GeoHeatmapZone, subTabId: GeoSubTabId) {
  if (subTabId === 'orders') {
    return `${zone.demandOrders} طلب`;
  }

  if (subTabId === 'captains') {
    return `${zone.activeCaptains} كابتن`;
  }

  if (subTabId === 'stores') {
    return `ضغط ${zone.storePressure}`;
  }

  if (subTabId === 'sla') {
    return `التزام ${zone.slaRisk}`;
  }

  return `فجوة ${zone.supplyDemandGap > 0 ? '+' : ''}${zone.supplyDemandGap}`;
}

function matchesSubTab(zone: GeoHeatmapZone, subTabId: GeoSubTabId) {
  if (subTabId === 'orders') {
    return zone.filterKey === 'orders' || zone.demandOrders >= 18;
  }

  if (subTabId === 'captains') {
    return zone.filterKey === 'captains' || zone.activeCaptains >= 5;
  }

  if (subTabId === 'stores') {
    return zone.filterKey === 'stores' || zone.storePressure !== 'منخفض';
  }

  if (subTabId === 'sla') {
    return zone.slaRisk !== 'منخفض';
  }

  return zone.filterKey === 'peak' || zone.supplyDemandGap > 0;
}

function matchesFilter(zone: GeoHeatmapZone, filterId: GeoFilterId) {
  if (filterId === 'الآن') {
    return zone.demandOrders >= 12;
  }

  if (filterId === '١٥ دقيقة') {
    return zone.demandOrders >= 18 || zone.delayedPickups > 0;
  }

  if (filterId === '٣٠ دقيقة') {
    return true;
  }

  if (filterId === 'خطر عالٍ') {
    return zone.severity === 'danger' || zone.slaRisk === 'حرج';
  }

  if (filterId === 'نقص كباتن') {
    return zone.supplyDemandGap > 0;
  }

  return zone.storePressure === 'مرتفع' || zone.storePressure === 'حرج';
}

function buildRecommendation(zone: GeoHeatmapZone, subTabId: GeoSubTabId, hubHref: string): DshUnifiedRecommendation {
  return {
    id: `geo-${zone.id}-${subTabId}`,
    surface: 'control-panel',
    sourceSurface: 'control-panel',
    affectedSurface: resolveAffectedSurface(subTabId),
    actor: 'operator',
    lifecycleStep: resolveLifecycleStep(subTabId),
    entityId: zone.id,
    entityLabel: zone.name,
    status: resolveStatusLabel(zone, subTabId),
    risk: resolveRiskLabel(zone),
    severity: resolveSeverity(zone),
    confidence: resolveConfidence(zone),
    affectedEntity: zone.name,
    reason: `الطلبات ${zone.demandOrders} مقابل كباتن نشطين ${zone.activeCaptains} وفجوة ${zone.supplyDemandGap}`,
    evidence: `التقاطات متأخرة ${zone.delayedPickups} · الالتزام ${zone.slaRisk} · ضغط المتاجر ${zone.storePressure}`,
    nextAction: zone.recommendedAction,
    owner: 'مركز العمليات',
    expectedImpact: zone.expectedImpact,
    primaryActionLabel: 'تثبيت الإجراء',
    secondaryActionLabel: 'عرض الدليل',
    counterpartRouteHint: resolveRouteHint(hubHref, zone.id),
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
  };
}

export function GeoHeatmapScreen({ hubHref, subGroup }: { hubHref: string; subGroup?: string }) {
  const [activeSubTab, setActiveSubTab] = React.useState(subGroup ?? 'orders');
  const [activeFilter, setActiveFilter] = React.useState<GeoFilterId>('الآن');
  const [selectedZoneId, setSelectedZoneId] = React.useState(GEO_HEATMAP_ZONES[0]?.id ?? '');

  React.useEffect(() => {
    if (subGroup) {
      setActiveSubTab(subGroup);
    }
  }, [subGroup]);

  const candidateZones = GEO_HEATMAP_ZONES.filter((zone) => matchesSubTab(zone, activeSubTab as GeoSubTabId));
  const filteredZones = candidateZones.filter((zone) => matchesFilter(zone, activeFilter));
  const visibleZones = (filteredZones.length > 0 ? filteredZones : candidateZones).slice(0, 5);
  const selectedZone = visibleZones.find((zone) => zone.id === selectedZoneId) ?? visibleZones[0] ?? GEO_HEATMAP_ZONES[0];
  const selectedRecommendation = selectedZone ? buildRecommendation(selectedZone, activeSubTab as GeoSubTabId, hubHref) : undefined;

  React.useEffect(() => {
    if (selectedZone && selectedZone.id !== selectedZoneId) {
      setSelectedZoneId(selectedZone.id);
    }
  }, [selectedZone, selectedZoneId]);

  const currentPage = visibleZones.length === 0 ? 1 : 1;
  const selectedZoneLayout = selectedZone ? ZONE_LAYOUT[selectedZone.id] : undefined;

  return (
    <Box gap={3}>
      <WebControlPanelWorkbench
        header={
          <WebControlPanelDenseHeader
            eyebrow="عمليات لوحة التحكم"
            title="خريطة الإسناد الحي"
            description="الطلبات الحية وتمركز الكباتن وضغط المتاجر ومخاطر الالتزام في مشهد واحد بلا SDK خارجي."
            metrics={[
              { id: 'zone-count', label: 'المناطق المرئية', value: String(visibleZones.length) },
              { id: 'active-orders', label: 'إجمالي الطلبات', value: String(visibleZones.reduce((sum, zone) => sum + zone.demandOrders, 0)) },
              { id: 'active-captains', label: 'الكباتن النشطون', value: String(visibleZones.reduce((sum, zone) => sum + zone.activeCaptains, 0)) },
            ]}
          />
        }
        controls={
          <Box gap={2}>
            <Text role="bodySm" tone="muted">
              هذه الخريطة operational preview خاصة بلوحة التحكم وتعرض إشارات الطلبات والكباتن والمتاجر summary-first من دون أي binding خرائط خارجي أو mutation ميداني.
            </Text>
            <WebControlPanelLaneTabs
              ariaLabel="لوحات الخريطة"
              items={SUB_TABS.map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeSubTab }))}
              onSelect={(nextTabId: string) => setActiveSubTab(nextTabId)}
            />
            <WebControlPanelTertiaryFilters
              ariaLabel="مرشحات الخريطة"
              items={TERTIARY_FILTERS.map((filter) => ({ id: filter, label: FILTER_LABELS[filter], active: filter === activeFilter }))}
              onSelect={(nextFilterId: string) => setActiveFilter(nextFilterId as GeoFilterId)}
            />
          </Box>
        }
        main={
          <Box gap={3}>
            <WebControlPanelMapCanvas
              legend={
                <div className={styles.surfaceActionWrap}>
                  <WebControlPanelStatusTag label="الطلب والسعة" tone="info" />
                  <WebControlPanelStatusTag label="مخاطر الالتزام" tone="warning" />
                  <WebControlPanelStatusTag label="معاينة فقط" tone="neutral" />
                </div>
              }
            >
              {selectedZoneLayout ? (
                <WebControlPanelRouteLine
                  points={selectedZoneLayout.routePoints}
                  tone={selectedZone?.severity === 'danger' ? 'danger' : selectedZone?.severity === 'warning' ? 'warning' : 'success'}
                />
              ) : null}
              {visibleZones.map((zone) => {
                const layout = ZONE_LAYOUT[zone.id];
                if (!layout) return null;

                const isSelected = zone.id === selectedZoneId;

                return (
                  <React.Fragment key={zone.id}>
                    <WebControlPanelMiniMapZone
                      label={zone.name}
                      tone={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : zone.severity === 'best' ? 'success' : 'neutral'}
                      width={layout.zone.width}
                      height={layout.zone.height}
                      position={{ top: layout.zone.top, right: layout.zone.right }}
                      onSelect={() => setSelectedZoneId(zone.id)}
                    />
                    {/* Always show at least one pin for every visible zone */}
                    {!isSelected && (
                      <WebControlPanelMapPin
                        label={resolveMapPinLabel(zone, activeSubTab as GeoSubTabId)}
                        tone={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : 'success'}
                        position={
                          activeSubTab === 'orders'
                            ? layout.order
                            : activeSubTab === 'captains'
                              ? layout.captain
                              : layout.store
                        }
                        onSelect={() => setSelectedZoneId(zone.id)}
                      />
                    )}
                    {/* For the selected zone, show all three pins to represent "Live Dispatch" context */}
                    {isSelected && (
                      <>
                        <WebControlPanelMapPin
                          label={`${zone.demandOrders} طلب`}
                          tone="neutral"
                          position={layout.order}
                          onSelect={() => setSelectedZoneId(zone.id)}
                        />
                        <WebControlPanelMapPin
                          label={`${zone.activeCaptains} كابتن`}
                          tone="success"
                          position={layout.captain}
                          onSelect={() => setSelectedZoneId(zone.id)}
                        />
                        <WebControlPanelMapPin
                          label={`ضغط ${zone.storePressure}`}
                          tone="warning"
                          position={layout.store}
                          onSelect={() => setSelectedZoneId(zone.id)}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </WebControlPanelMapCanvas>

            <WebControlPanelQueue
              title="مصفوفة المناطق"
              meta="حتى ٥ صفوف مرئية في هذا المشهد مع تثبيت المنطقة المختارة في المفتش."
              pager={
                <WebControlPanelCompactPager
                  page={currentPage}
                  totalPages={1}
                  summaryLabel="المشهد الحالي"
                />
              }
            >
              {visibleZones.map((zone) => {
                const recommendation = buildRecommendation(zone, activeSubTab as GeoSubTabId, hubHref);

                return (
                  <WebControlPanelDecisionRow
                    key={zone.id}
                    entityId={zone.id}
                    entityLabel={`${zone.name} · الطلبات ${zone.demandOrders} · الكباتن ${zone.activeCaptains}`}
                    status={resolveStatusLabel(zone, activeSubTab as GeoSubTabId)}
                    statusTone={resolveStatusTone(zone)}
                    risk={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : 'neutral'}
                    recommendation={zone.recommendedAction}
                    reason={`فجوة السعة ${zone.supplyDemandGap} · التقاطات متأخرة ${zone.delayedPickups}`}
                    sla={`الالتزام ${zone.slaRisk} · ضغط المتاجر ${zone.storePressure} · ثقة ${zone.confidence}`}
                    primaryAction={{ id: `${zone.id}-select`, label: 'تثبيت المنطقة', onAction: () => setSelectedZoneId(zone.id) }}
                    secondaryAction={{ id: `${zone.id}-guide`, label: recommendation.secondaryActionLabel, onAction: () => setSelectedZoneId(zone.id) }}
                    onInspect={() => setSelectedZoneId(zone.id)}
                  />
                );
              })}
            </WebControlPanelQueue>
          </Box>
        }
        inspector={
          <WebControlPanelInspectorShell
            title={selectedZone ? `تفاصيل ${selectedZone.name}` : 'تفاصيل المنطقة'}
            onClose={() => setSelectedZoneId(visibleZones[0]?.id ?? GEO_HEATMAP_ZONES[0]?.id ?? '')}
          >
            <Box gap={2}>
              <Box gap={2}>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">نوع الكيان</Text>
                  <Text role="bodySm">منطقة تشغيلية</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الحالة الحالية</Text>
                  <Text role="bodySm">{selectedRecommendation?.status ?? 'غير محدد'}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الخطر</Text>
                  <Text role="bodySm">{selectedRecommendation?.risk ?? 'مستقر'}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">حالة الربط</Text>
                  <Text role="bodySm">{translateDshRuntimeBindingStatus(selectedRecommendation?.runtimeBindingStatus ?? 'UI_PREVIEW_ONLY')}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الدليل</Text>
                  <Text role="bodySm">{selectedRecommendation?.evidence ?? 'لا يوجد تحديد بعد'}</Text>
                </Box>
                <Box padding={2} border radiusToken="lg" background="surfaceRaised">
                  <Text role="caption" tone="muted">الأثر المتوقع</Text>
                  <Text role="bodySm">{selectedRecommendation?.expectedImpact ?? 'لا يوجد تقدير بعد'}</Text>
                </Box>
              </Box>

              <WebControlPanelRecommendation
                title="التوصية الحالية"
                reason={selectedRecommendation ? `${selectedRecommendation.reason} · ${selectedRecommendation.evidence}` : 'اختر منطقة لعرض التوصية.'}
                confidence={selectedRecommendation?.confidence ?? 'medium'}
                auditTag={translateDshRuntimeBindingStatus(selectedRecommendation?.runtimeBindingStatus ?? 'UI_PREVIEW_ONLY')}
                primaryAction={selectedRecommendation ? { id: `${selectedRecommendation.id}-primary`, label: selectedRecommendation.primaryActionLabel, onAction: () => setSelectedZoneId(selectedZone?.id ?? '') } : undefined}
                secondaryAction={selectedRecommendation ? { id: `${selectedRecommendation.id}-secondary`, label: selectedRecommendation.secondaryActionLabel, onAction: () => setSelectedZoneId(selectedZone?.id ?? '') } : undefined}
              />

              <WebControlPanelActionCluster
                primary={{ id: 'apply-plan', label: 'تثبيت القرار', onAction: () => setSelectedZoneId(selectedZone?.id ?? '') }}
                secondary={{ id: 'show-evidence', label: 'عرض الدليل', onAction: () => setSelectedZoneId(selectedZone?.id ?? '') }}
              />

              <Box gap={1}>
                <WebControlPanelStatusTag label={`مخاطر الالتقاط ${selectedZone?.delayedPickups ?? 0}`} tone={(selectedZone?.delayedPickups ?? 0) > 0 ? 'danger' : 'success'} />
                <WebControlPanelStatusTag label={`الالتزام ${selectedZone?.slaRisk ?? 'منخفض'}`} tone={selectedZone?.slaRisk === 'حرج' ? 'danger' : selectedZone?.slaRisk === 'مرتفع' ? 'warning' : 'success'} />
                <WebControlPanelStatusTag label={`ضغط المتاجر ${selectedZone?.storePressure ?? 'منخفض'}`} tone={selectedZone?.storePressure === 'حرج' || selectedZone?.storePressure === 'مرتفع' ? 'warning' : 'success'} />
                <WebControlPanelStatusTag label={`فجوة السعة ${selectedZone?.supplyDemandGap ?? 0}`} tone={(selectedZone?.supplyDemandGap ?? 0) > 5 ? 'danger' : 'info'} />
                <WebControlPanelStatusTag label={`المرشح ${activeFilter}`} tone="info" />
              </Box>
            </Box>
          </WebControlPanelInspectorShell>
        }
      />
    </Box>
  );
}

export default GeoHeatmapScreen;
