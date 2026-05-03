export type DshSurfaceId = 'client' | 'partner' | 'captain' | 'field' | 'control-panel';

export type DshClosureStatus = 'closed' | 'needs-evidence' | 'needs-ui-flow' | 'blocked';

export type DshClosureArea =
  | 'client-order'
  | 'partner-order'
  | 'captain-order'
  | 'field-onboarding'
  | 'field-visit'
  | 'control-panel-operations'
  | 'control-panel-finance'
  | 'control-panel-support'
  | 'control-panel-catalogs'
  | 'control-panel-partners'
  | 'control-panel-marketing'
  | 'control-panel-control';

export type DshCrossSurfaceClosureItem = {
  surfaceId: DshSurfaceId;
  area: DshClosureArea;
  status: DshClosureStatus;
  title: string;
  description: string;
  evidenceHint: string;
  routeHint: string;
};

export const DSH_CROSS_SURFACE_CLOSURE_MAP: readonly DshCrossSurfaceClosureItem[] = [
  {
    surfaceId: 'client',
    area: 'client-order',
    status: 'closed',
    title: 'client order',
    description: 'طلبات العميل الأساسية مغلقة ولا تحتاج إعادة فتح واجهة.',
    evidenceHint: 'screen and guard proof',
    routeHint: '/app-client/orders',
  },
  {
    surfaceId: 'partner',
    area: 'partner-order',
    status: 'closed',
    title: 'partner order',
    description: 'مسار الشريك الطلبي مغلق مع بقاء الحراس فقط.',
    evidenceHint: 'export and route proof',
    routeHint: '/app-partner/orders',
  },
  {
    surfaceId: 'captain',
    area: 'captain-order',
    status: 'needs-evidence',
    title: 'captain order',
    description: 'تحتاج الشهادة الداعمة لإغلاق root exposure بالكامل.',
    evidenceHint: 'root export proof',
    routeHint: '/app-captain/orders',
  },
  {
    surfaceId: 'field',
    area: 'field-onboarding',
    status: 'needs-ui-flow',
    title: 'field onboarding',
    description: 'الفلو الميداني يحتاج إعادة تنظيم خفيفة على مستوى الأسماء والربط.',
    evidenceHint: 'structured flow proof',
    routeHint: '/app-field/stores',
  },
  {
    surfaceId: 'field',
    area: 'field-visit',
    status: 'needs-ui-flow',
    title: 'field visit',
    description: 'الزيارة الميدانية يجب أن تبقى ضمن onboarding/visit flow.',
    evidenceHint: 'visit and geo pin proof',
    routeHint: '/app-field/visits',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-operations',
    status: 'needs-evidence',
    title: 'operations',
    description: 'العمليات تحتاج خريطة إغلاق خاصة قبل اعتباره مقفلاً بالكامل.',
    evidenceHint: 'workspace evidence',
    routeHint: '/operations',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-finance',
    status: 'needs-evidence',
    title: 'finance',
    description: 'المالية ظاهرة لكن تحتاج لقطات closure evidence أوضح.',
    evidenceHint: 'finance matrix',
    routeHint: '/operations?workspace=finance',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-support',
    status: 'needs-ui-flow',
    title: 'support',
    description: 'الدعم يحتاج مسارات issue/dispute وليست صفحات عامة.',
    evidenceHint: 'support queue evidence',
    routeHint: '/operations?workspace=issues',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-catalogs',
    status: 'closed',
    title: 'catalogs',
    description: 'كتالوج DSH مغلق ويحتاج فقط عرض قراءة أعلى.',
    evidenceHint: 'catalog approval proof',
    routeHint: '/operations?workspace=catalogs',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-partners',
    status: 'closed',
    title: 'partners',
    description: 'شريك التحكم يظهر كقراءة مغلقة مع قرائن واضحة.',
    evidenceHint: 'partner activation proof',
    routeHint: '/operations?workspace=partners',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-marketing',
    status: 'closed',
    title: 'marketing',
    description: 'الموافقات التسويقية بقيت ضمن control-room ولا تحتاج إعادة فتح.',
    evidenceHint: 'marketing approval proof',
    routeHint: '/operations?workspace=marketing',
  },
  {
    surfaceId: 'control-panel',
    area: 'control-panel-control',
    status: 'needs-evidence',
    title: 'control',
    description: 'طبقة السيادة والحوكمة تحتاج proof matrix نهائية.',
    evidenceHint: 'guard status proof',
    routeHint: '/control',
  },
];

export function getDshClosureItemsBySurface(surfaceId: DshSurfaceId) {
  return DSH_CROSS_SURFACE_CLOSURE_MAP.filter((item) => item.surfaceId === surfaceId);
}

export function getDshClosureItemsByStatus(status: DshClosureStatus) {
  return DSH_CROSS_SURFACE_CLOSURE_MAP.filter((item) => item.status === status);
}
