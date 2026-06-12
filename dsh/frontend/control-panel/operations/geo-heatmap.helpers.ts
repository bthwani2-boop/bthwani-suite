// Pure resolver helpers for GeoHeatmapScreen.
// All functions are stateless — no hooks, no imports from React.
// Extracted to keep GeoHeatmapScreen under 330 lines.

import type { DshLifecycleStep, DshSurfaceId, DshUnifiedRecommendation } from '../shared';

export type GeoHeatmapZone = {
  id: (string);
  name: (string);
  severity: 'danger' | 'warning' | 'best' | string;
  confidence: string;
  demandOrders: number;
  activeCaptains: number;
  storePressure: string;
  slaRisk: string;
  supplyDemandGap: number;
  delayedPickups: number;
  filterKey: string;
  recommendedAction: string;
  expectedImpact: string;
};

export type GeoSubTabId = 'orders' | 'captains' | 'stores' | 'sla' | 'peak';
export type GeoFilterId = 'الآن' | '١٥ دقيقة' | '٣٠ دقيقة' | 'خطر عالٍ' | 'نقص كباتن' | 'ضغط متاجر';

const SUB_TAB_META: Record<GeoSubTabId, { affectedSurface: DshSurfaceId; lifecycleStep: DshLifecycleStep }> = {
  orders: { affectedSurface: 'app-client', lifecycleStep: 'tracking' },
  captains: { affectedSurface: 'app-captain', lifecycleStep: 'delivery' },
  stores: { affectedSurface: 'app-partner', lifecycleStep: 'partner-preparation' },
  sla: { affectedSurface: 'control-panel', lifecycleStep: 'operations-monitoring' },
  peak: { affectedSurface: 'control-panel', lifecycleStep: 'operations-intervention' },
};

export function resolveLifecycleStep(subTabId: GeoSubTabId): DshLifecycleStep {
  return SUB_TAB_META[subTabId]?.lifecycleStep ?? 'operations-monitoring';
}

export function resolveAffectedSurface(subTabId: GeoSubTabId): DshSurfaceId {
  return SUB_TAB_META[subTabId]?.affectedSurface ?? 'control-panel';
}

export function resolveSeverity(zone: GeoHeatmapZone): DshUnifiedRecommendation['severity'] {
  if (zone.severity === 'danger') return 'high';
  if (zone.severity === 'warning') return 'medium';
  return 'low';
}

export function resolveConfidence(zone: GeoHeatmapZone): DshUnifiedRecommendation['confidence'] {
  if (zone.confidence === 'عالية') return 'high';
  if (zone.confidence === 'متوسطة') return 'medium';
  return 'low';
}

export function resolveStatusTone(zone: GeoHeatmapZone): 'danger' | 'warning' | 'success' {
  if (zone.severity === 'danger') return 'danger';
  if (zone.severity === 'warning') return 'warning';
  return 'success';
}

export function resolveRiskLabel(zone: GeoHeatmapZone): string {
  if (zone.severity === 'danger') return 'خطر عالٍ';
  if (zone.severity === 'warning') return 'خطر متوسط';
  return 'مستقر';
}

export function resolveStatusLabel(zone: GeoHeatmapZone, subTabId: GeoSubTabId): string {
  if (subTabId === 'orders') return `طلبات ${zone.demandOrders}`;
  if (subTabId === 'captains') return `كباتن ${zone.activeCaptains}`;
  if (subTabId === 'stores') return `ضغط ${zone.storePressure}`;
  if (subTabId === 'sla') return `التزام ${zone.slaRisk}`;
  return `فجوة ${zone.supplyDemandGap}`;
}

export function resolveRouteHint(hubHref: string, zoneId: string): string {
  return `${hubHref}?workspace=geo-heatmap&zoneId=${zoneId}`;
}

export function resolveMapPinLabel(zone: GeoHeatmapZone, subTabId: GeoSubTabId): string {
  if (subTabId === 'orders') return `${zone.demandOrders} طلب`;
  if (subTabId === 'captains') return `${zone.activeCaptains} كابتن`;
  if (subTabId === 'stores') return `ضغط ${zone.storePressure}`;
  if (subTabId === 'sla') return `التزام ${zone.slaRisk}`;
  return `فجوة ${zone.supplyDemandGap > 0 ? '+' : ''}${zone.supplyDemandGap}`;
}

export function matchesSubTab(zone: GeoHeatmapZone, subTabId: GeoSubTabId): boolean {
  if (subTabId === 'orders') return zone.filterKey === 'orders' || zone.demandOrders >= 18;
  if (subTabId === 'captains') return zone.filterKey === 'captains' || zone.activeCaptains >= 5;
  if (subTabId === 'stores') return zone.filterKey === 'stores' || zone.storePressure !== 'منخفض';
  if (subTabId === 'sla') return zone.slaRisk !== 'منخفض';
  return zone.filterKey === 'peak' || zone.supplyDemandGap > 0;
}

export function matchesFilter(zone: GeoHeatmapZone, filterId: GeoFilterId): boolean {
  if (filterId === 'الآن') return zone.demandOrders >= 12;
  if (filterId === '١٥ دقيقة') return zone.demandOrders >= 18 || zone.delayedPickups > 0;
  if (filterId === '٣٠ دقيقة') return true;
  if (filterId === 'خطر عالٍ') return zone.severity === 'danger' || zone.slaRisk === 'حرج';
  if (filterId === 'نقص كباتن') return zone.supplyDemandGap > 0;
  return zone.storePressure === 'مرتفع' || zone.storePressure === 'حرج';
}

export function buildRecommendation(zone: GeoHeatmapZone, subTabId: GeoSubTabId, hubHref: string): DshUnifiedRecommendation {
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
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
  };
}
