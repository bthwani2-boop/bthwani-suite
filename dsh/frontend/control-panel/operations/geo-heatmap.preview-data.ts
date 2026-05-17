import type { DshSurfaceId } from '../shared';

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const geoHeatmapPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type GeoHeatmapZone = {
  id: string;
  name: string;
  demandOrders: number;
  activeCaptains: number;
  idleCaptains: number;
  supplyDemandGap: number;
  delayedPickups: number;
  slaRisk: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  storePressure: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  recommendedAction: string;
  expectedImpact: string;
  ownerSurface: DshSurfaceId;
  confidence: 'عالية' | 'متوسطة' | 'منخفضة';
  filterKey: 'orders' | 'captains' | 'stores' | 'sla' | 'peak';
  severity: 'best' | 'warning' | 'danger' | 'brand';
};

export const GEO_HEATMAP_ZONES: readonly GeoHeatmapZone[] = [
  {
    id: 'N-01',
    name: 'شمال الرياض',
    demandOrders: 42,
    activeCaptains: 6,
    idleCaptains: 1,
    supplyDemandGap: 8,
    delayedPickups: 5,
    slaRisk: 'حرج',
    storePressure: 'مرتفع',
    recommendedAction: 'انقل كباتن من الجنوب وفعّل حافز المنطقة فورًا',
    expectedImpact: 'خفض التأخير 18٪ خلال 30 دقيقة',
    ownerSurface: 'control-panel',
    confidence: 'عالية',
    filterKey: 'peak',
    severity: 'danger',
  },
  {
    id: 'E-02',
    name: 'شرق الرياض',
    demandOrders: 31,
    activeCaptains: 5,
    idleCaptains: 2,
    supplyDemandGap: 4,
    delayedPickups: 2,
    slaRisk: 'مرتفع',
    storePressure: 'متوسط',
    recommendedAction: 'وسّع الاستقبال مؤقتًا واحتفظ بنطاق ضيق',
    expectedImpact: 'تخفيف الضغط 12٪',
    ownerSurface: 'control-panel',
    confidence: 'عالية',
    filterKey: 'orders',
    severity: 'warning',
  },
  {
    id: 'C-03',
    name: 'وسط الرياض',
    demandOrders: 18,
    activeCaptains: 8,
    idleCaptains: 4,
    supplyDemandGap: -2,
    delayedPickups: 0,
    slaRisk: 'منخفض',
    storePressure: 'منخفض',
    recommendedAction: 'انقل الفائض إلى الشمال عند الحاجة',
    expectedImpact: 'رفع التغطية للمناطق المضغوطة',
    ownerSurface: 'control-panel',
    confidence: 'متوسطة',
    filterKey: 'captains',
    severity: 'best',
  },
  {
    id: 'S-04',
    name: 'جنوب الرياض',
    demandOrders: 12,
    activeCaptains: 9,
    idleCaptains: 5,
    supplyDemandGap: -6,
    delayedPickups: 0,
    slaRisk: 'منخفض',
    storePressure: 'منخفض',
    recommendedAction: 'حافظ على السعة الحالية وراقب التحويلات',
    expectedImpact: 'استقرار الخدمة مع فائض متاح',
    ownerSurface: 'control-panel',
    confidence: 'متوسطة',
    filterKey: 'stores',
    severity: 'brand',
  },
];
