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
  | 'client-discovery'
  | 'client-cart-checkout'
  | 'client-tracking-support'
  | 'partner-intake-prep'
  | 'partner-catalog-readiness'
  | 'captain-task-pickup'
  | 'captain-delivery-proof'
  | 'field-onboarding'
  | 'field-visit-evidence'
  | 'control-panel-ops'
  | 'control-panel-governance';

export type DshCrossSurfaceClosureItem = {
  surfaceId: DshSurfaceId;
  actor: DshActor;
  area: DshClosureArea;
  step: DshLifecycleStep;
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
    area: 'client-discovery',
    step: 'discovery',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'اكتشاف المتاجر',
    description: 'تم إغلاق مسار البحث والتصفح والكتالوج.',
    evidenceHint: 'دليل الاكتشاف - مكتمل',
    routeHint: '/app-client/discovery',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-cart-checkout',
    step: 'checkout',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'السلة والدفع',
    description: 'تم إغلاق مسار تأكيد الطلب والدفع الموحد.',
    evidenceHint: 'دليل السلة - مكتمل',
    routeHint: '/app-client/cart',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-tracking-support',
    step: 'tracking',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'التتبع والدعم',
    description: 'تم إغلاق مسار التتبع المباشر وحل المشكلات.',
    evidenceHint: 'دليل التتبع - مكتمل',
    routeHint: '/app-client/orders',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-intake-prep',
    step: 'order-intake',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'استقبال الطلبات',
    description: 'تم إغلاق مسار قبول الطلبات وتجهيزها.',
    evidenceHint: 'دليل الاستقبال - مكتمل',
    routeHint: '/app-partner/orders',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-catalog-readiness',
    step: 'catalog-governance',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'إدارة المتجر',
    description: 'تم إغلاق مسار الكتالوج وجاهزية الفرع.',
    evidenceHint: 'دليل المتجر - مكتمل',
    routeHint: '/app-partner/inventory',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-task-pickup',
    step: 'pickup',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'استلام المهمة',
    description: 'تم إغلاق مسار قبول المهمة والوصول والالتقاط.',
    evidenceHint: 'دليل الاستلام - مكتمل',
    routeHint: '/app-captain/orders',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-delivery-proof',
    step: 'delivery',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'التوصيل والإثبات',
    description: 'تم إغلاق مسار التوصيل للعميل ورفع الإثبات.',
    evidenceHint: 'دليل الإثبات - مكتمل',
    routeHint: '/app-captain/map',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-onboarding',
    step: 'onboarding',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'انضمام الشركاء',
    description: 'تم إغلاق مسار تهيئة المتاجر الميدانية.',
    evidenceHint: 'دليل الانضمام - مكتمل',
    routeHint: '/app-field/stores',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-visit-evidence',
    step: 'visit',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الزيارات والأدلة',
    description: 'تم إغلاق مسار الزيارة الميدانية وتوثيق الأدلة.',
    evidenceHint: 'دليل الزيارة - مكتمل',
    routeHint: '/app-field/visits',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    step: 'operations-monitoring',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الرقابة والتدخل',
    description: 'تم إغلاق غرف القيادة والإسناد والمتابعة الحية.',
    evidenceHint: 'دليل الرقابة - مكتمل',
    routeHint: '/operations',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-governance',
    step: 'finance-review',
    status: 'closed',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الحوكمة والمالية',
    description: 'تم إغلاق مصفوفة الحوكمة والمالية والتسويق.',
    evidenceHint: 'دليل الحوكمة - مكتمل',
    routeHint: '/finance',
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
