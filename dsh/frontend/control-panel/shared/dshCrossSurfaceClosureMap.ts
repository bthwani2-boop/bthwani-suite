export type DshSurfaceId = 'app-client' | 'app-partner' | 'app-captain' | 'app-field' | 'control-panel';

export type DshLegacySurfaceId = 'client' | 'partner' | 'captain' | 'field';

export type DshSurfaceLookupId = DshSurfaceId | DshLegacySurfaceId;

export type DshClosureStatus = 'closed' | 'needs-evidence' | 'needs-ui-flow' | 'blocked';

export type DshRuntimeBindingStatus = 'UI_PREVIEW_ONLY' | 'NEEDS_BINDING_LATER' | 'NEEDS_RUNTIME_EVIDENCE' | 'BLOCKED';

export function translateDshRuntimeBindingStatus(status: DshRuntimeBindingStatus): string {
  switch (status) {
    case 'UI_PREVIEW_ONLY':
      return 'معاينة واجهة فقط';
    case 'NEEDS_BINDING_LATER':
      return 'يحتاج ربطًا لاحقًا';
    case 'NEEDS_RUNTIME_EVIDENCE':
      return 'يحتاج دليل تشغيل';
    case 'BLOCKED':
      return 'محجوب';
    default:
      return status;
  }
}

export type DshActor = 'client' | 'partner' | 'captain' | 'field' | 'operator';

export type DshLifecycleStep =
  | 'discovery'
  | 'cart'
  | 'checkout'
  | 'order-intake'
  | 'partner-preparation'
  | 'pickup'
  | 'delivery'
  | 'tracking'
  | 'support'
  | 'rating'
  | 'onboarding'
  | 'visit'
  | 'operations-monitoring'
  | 'operations-intervention'
  | 'finance-review'
  | 'catalog-governance';

export type DshCounterpartLink = {
  surfaceId: DshSurfaceId;
  routeHint: string;
  label: string;
  runtimeBindingStatus: DshRuntimeBindingStatus;
};

export type DshCrossSurfaceSignal = {
  id: string;
  sourceSurface: DshSurfaceId;
  affectedSurface: DshSurfaceId;
  actor: DshActor;
  lifecycleStep: DshLifecycleStep;
  entityId: string;
  entityLabel: string;
  status: string;
  risk: string;
  owner: string;
  evidence: string;
  nextAction: string;
  expectedImpact: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  counterpartRouteHint: string;
  runtimeBindingStatus: DshRuntimeBindingStatus;
  counterpartLinks?: readonly DshCounterpartLink[];
};

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
  | 'control-panel-platform';

export type DshCrossSurfaceClosureItem = {
  surfaceId: DshSurfaceId;
  actor: DshActor;
  area: DshClosureArea;
  status: DshClosureStatus;
  runtimeBindingStatus: DshRuntimeBindingStatus;
  title: string;
  description: string;
  evidenceHint: string;
  routeHint: string;
};

export const DSH_CROSS_SURFACE_CLOSURE_MAP: readonly DshCrossSurfaceClosureItem[] = [
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-order',
    status: 'needs-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'رحلة العميل',
    description: 'طلبات العميل الأساسية تحتاج evidence branch قبل أي claim إغلاق.',
    evidenceHint: 'دليل فحص الشاشة والحماية',
    routeHint: '/app-client/orders',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-order',
    status: 'needs-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'رحلة الشريك',
    description: 'مسار الشريك الطلبي يحتاج evidence قبل اعتباره مغلقًا.',
    evidenceHint: 'دليل تصدير المسارات',
    routeHint: '/app-partner/orders',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-order',
    status: 'needs-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'رحلة الكابتن',
    description: 'تحتاج الشهادة الداعمة لإغلاق root exposure بالكامل.',
    evidenceHint: 'دليل التصدير الرئيسي',
    routeHint: '/app-captain/orders',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-onboarding',
    status: 'needs-ui-flow',
    runtimeBindingStatus: 'NEEDS_BINDING_LATER',
    title: 'تهيئة الميدان',
    description: 'الفلو الميداني يحتاج إعادة تنظيم خفيفة على مستوى الأسماء والربط.',
    evidenceHint: 'دليل المسار المنظم',
    routeHint: '/app-field/stores',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-visit',
    status: 'needs-ui-flow',
    runtimeBindingStatus: 'NEEDS_BINDING_LATER',
    title: 'زيارة ميدانية',
    description: 'الزيارة الميدانية يجب أن تبقى ضمن onboarding/visit flow.',
    evidenceHint: 'دليل الزيارة والتحديد الجغرافي',
    routeHint: '/app-field/visits',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-operations',
    status: 'needs-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'عمليات لوحة التحكم',
    description: 'العمليات تحتاج خريطة إغلاق خاصة قبل اعتباره مقفلاً بالكامل.',
    evidenceHint: 'دليل مساحة العمل',
    routeHint: '/operations',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-finance',
    status: 'needs-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'المالية',
    description: 'المالية ظاهرة لكن تحتاج لقطات closure evidence أوضح.',
    evidenceHint: 'مصفوفة المالية',
    routeHint: '/finance',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-support',
    status: 'needs-ui-flow',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الدعم',
    description: 'الدعم يحتاج مسارات issue/dispute وليست صفحات عامة.',
    evidenceHint: 'دليل طابور الدعم',
    routeHint: '/operations?workspace=issues',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-catalogs',
    status: 'needs-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الكتالوجات',
    description: 'كتالوج DSH يحتاج evidence قبل أي claim إغلاق.',
    evidenceHint: 'دليل اعتماد الكتالوج',
    routeHint: '/catalogs',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-partners',
    status: 'needs-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الشركاء',
    description: 'بوابة الشركاء تحتاج evidence قبل وصفها بالمغلقة.',
    evidenceHint: 'دليل تفعيل الشريك',
    routeHint: '/partners',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-marketing',
    status: 'needs-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'التسويق',
    description: 'الموافقات التسويقية تحتاج evidence قبل claim الإغلاق.',
    evidenceHint: 'دليل اعتماد التسويق',
    routeHint: '/marketing',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-platform',
    status: 'needs-evidence',
    runtimeBindingStatus: 'NEEDS_BINDING_LATER',
    title: 'التحكم والمنصة',
    description: 'طبقة المنصة تحتاج proof matrix نهائية.',
    evidenceHint: 'دليل حالة الحماية',
    routeHint: '/platform',
  },
];

export function resolveDshSurfaceId(surfaceId: DshSurfaceLookupId): DshSurfaceId {
  if (surfaceId === 'client') {
    return 'app-client';
  }

  if (surfaceId === 'partner') {
    return 'app-partner';
  }

  if (surfaceId === 'captain') {
    return 'app-captain';
  }

  if (surfaceId === 'field') {
    return 'app-field';
  }

  return surfaceId;
}

export function getDshClosureItemsBySurface(surfaceId: DshSurfaceLookupId) {
  const resolvedSurfaceId = resolveDshSurfaceId(surfaceId);
  return DSH_CROSS_SURFACE_CLOSURE_MAP.filter((item) => item.surfaceId === resolvedSurfaceId);
}

export function getDshClosureItemsByStatus(status: DshClosureStatus) {
  return DSH_CROSS_SURFACE_CLOSURE_MAP.filter((item) => item.status === status);
}
