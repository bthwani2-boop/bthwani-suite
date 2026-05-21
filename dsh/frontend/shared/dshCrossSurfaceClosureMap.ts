export type DshSurfaceId = 'app-client' | 'app-partner' | 'app-captain' | 'app-field' | 'control-panel';

export type DshLegacySurfaceId = 'client' | 'partner' | 'captain' | 'field';

export type DshSurfaceLookupId = DshSurfaceId | DshLegacySurfaceId;

/**
 * DSH Closure Status — دقيق وغير وهمي.
 *
 * القواعد:
 * - 'verified-ui-flow'        : يتطلب routeProof + screenProof + stateCoverageProof + visualEvidenceStatus='captured' + crossSurfaceProof.
 * - 'preview-ready'           : شاشات مسجّلة ومربوطة بمسارات، لكن لا يوجد visual evidence بعد.
 * - 'needs-visual-evidence'   : شاشات موجودة لكن يغيب إثبات بصري.
 * - 'needs-cross-surface-proof': يحتاج إثبات تناسق عبر الأسطح (actor-to-actor).
 * - 'blocked-by-contract'     : محجوب بسبب عقد backend/API غير جاهز.
 * - 'blocked-by-wlt'          : محجوب لأن القرار/المصدر يعود لـ WLT حصرًا.
 * - 'needs-evidence'          : يحتاج أي دليل (إرث).
 * - 'needs-ui-flow'           : لم يُبنَ المسار بعد (إرث).
 * - 'blocked'                 : محجوب عام (إرث).
 *
 * ممنوع: استخدام 'closed' إلا بعد توفر جميع الإثباتات الخمسة في حقول الـ proof.
 */
export type DshClosureStatus =
  | 'verified-ui-flow'
  | 'preview-ready'
  | 'needs-visual-evidence'
  | 'needs-cross-surface-proof'
  | 'blocked-by-contract'
  | 'blocked-by-wlt'
  | 'needs-evidence'
  | 'needs-ui-flow'
  | 'blocked';

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

export type DshClosureProofStatus = 'captured' | 'pending' | 'missing';

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
  /**
   * Proof metadata — مطلوبة قبل الترقية إلى 'verified-ui-flow'.
   * غيابها يعني أن الإغلاق غير مكتمل بصرف النظر عن status.
   */
  readonly routeProof?: string;
  readonly screenProof?: string;
  readonly stateCoverageProof?: string;
  readonly visualEvidenceStatus?: DshClosureProofStatus;
  readonly crossSurfaceProof?: string;
  readonly remainingUiFlowGap?: string;
};

export const DSH_CROSS_SURFACE_CLOSURE_MAP: readonly DshCrossSurfaceClosureItem[] = [
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-discovery',
    step: 'discovery',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'اكتشاف المتاجر',
    description: 'شاشات الاكتشاف والبحث والكتالوج مسجّلة ومعاينتها جاهزة. لا يوجد visual evidence أو runtime binding بعد.',
    evidenceHint: 'يحتاج: visual capture لـ HomeScreen, SearchScreen, StoreScreen',
    routeHint: '/app-client/discovery',
    routeProof: 'dsh-home, dsh-search, dsh-store — registered in dsh-client.screen-registry.ts',
    screenProof: 'DshHomeGetScreen, DshSearchScreen, DshStoreGetScreen — VERIFIED in registry',
    stateCoverageProof: 'loading, empty, error, success, offline — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'store visibility gate (active+published+serviceable), promo/catalog binding, delivery mode badges',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-cart-checkout',
    step: 'checkout',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'السلة والدفع',
    description: 'شاشات السلة والدفع والـ checkout-intent مسجّلة. حالات WLT (awaiting_wlt_payment, payment_failed, payment_confirmed) ناقصة كمسار UI.',
    evidenceHint: 'يحتاج: visual capture + تغطية حالات payment lifecycle',
    routeHint: '/app-client/cart',
    routeProof: 'dsh-cart, dsh-checkout-intent — registered in dsh-client.screen-registry.ts',
    screenProof: 'DshCartGetScreen (VERIFIED), DshCheckoutIntentScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, error, blocked, retry — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'awaiting_wlt_payment / payment_failed / payment_confirmed / order_draft / order_creation_failed states — UI فقط',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-tracking-support',
    step: 'tracking',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'التتبع والدعم',
    description: 'شاشات التتبع والطلبات وإبلاغ المشاكل مسجّلة ومعاينتها جاهزة. حالات الإلغاء والاسترداد ودعم الاستثناءات ناقصة.',
    evidenceHint: 'يحتاج: visual capture + cancellation/refund/support-exception states',
    routeHint: '/app-client/orders',
    routeProof: 'dsh-orders, dsh-tracking, dsh-order-issue-workspace — registered in dsh-client.screen-registry.ts',
    screenProof: 'DshOrdersListScreen (VERIFIED), DshTrackingScreen (VERIFIED), DshOrderIssueHubScreen (VERIFIED)',
    stateCoverageProof: 'loading, error, success, offline, retry, blocked, cancelled — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'cancellation_requested, refund_pending_wlt, refund_completed_wlt, support_exception, rating_pending states — UI فقط',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-intake-prep',
    step: 'order-intake',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'استقبال الطلبات',
    description: 'شاشات صندوق الطلبات والقبول والمشاكل مسجّلة ومعاينتها جاهزة. حالات lifecycle كاملة (accept/reject/prepare/ready/handoff) تحتاج اكتمال UI.',
    evidenceHint: 'يحتاج: visual capture + acceptance timer + item_unavailable + preparation_delayed + mark_ready states',
    routeHint: '/app-partner/orders',
    routeProof: 'dsh-partner-orders, dsh-partner-order-issue, dsh-partner-order-rejection — registered in dsh-partner.screen-registry.ts',
    screenProof: 'OrdersInboxScreen (VERIFIED), OrderIssueScreen (VERIFIED), DshPartnerOrderRejectionScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success, offline, blocked, retry — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'acceptance timer UI, reject reason, item_unavailable, preparation_delayed, mark_ready, handoff state — UI فقط',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-catalog-readiness',
    step: 'catalog-governance',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'إدارة المتجر',
    description: 'شاشة كتالوج المخزون مسجّلة ومعاينتها جاهزة. مسار barcode/GTIN/scanning/publishing كمنظومة كاملة غير مثبت.',
    evidenceHint: 'يحتاج: visual capture + barcode scan states + duplicate detection + publishing gate + client visibility status',
    routeHint: '/app-partner/inventory',
    routeProof: 'dsh-partner-inventory — registered in dsh-partner.screen-registry.ts',
    screenProof: 'InventoryCatalogScreen (VERIFIED)',
    stateCoverageProof: 'loading, empty, error, success, offline — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'barcode scan preview states, duplicate detection, category mapping, item approval, publishing status, client visibility indicator — UI فقط',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-task-pickup',
    step: 'pickup',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'استلام المهمة',
    description: 'شاشات pickup-dropoff والخريطة مسجّلة. حالات lifecycle كاملة (arrive_pickup, waiting, picked_up, pickup_failed) تحتاج اكتمال UI.',
    evidenceHint: 'يحتاج: visual capture + pickup flow states + accept/decline flow + availability model',
    routeHint: '/app-captain/orders',
    routeProof: 'dsh-captain-inbox, dsh-captain-pickup-dropoff, dsh-captain-map — registered in dsh-captain.screen-registry.ts',
    screenProof: 'CaptainOrdersInboxScreen (VERIFIED), DshCaptainPickupDropoffScreen (READY_FOR_REVIEW), DshCaptainMapScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'availability model (online/offline/busy), accept/decline flow + reason, arrive_pickup, pickup_failed, handoff_mismatch — UI فقط',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-delivery-proof',
    step: 'delivery',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'التوصيل والإثبات',
    description: 'شاشة PoD Submission مسجّلة. حالات delivery lifecycle (arrived_dropoff, delivery_failed, proof policy) تحتاج اكتمال UI.',
    evidenceHint: 'يحتاج: visual capture + PoD states + delivery_failed + proof policy gate',
    routeHint: '/app-captain/map',
    routeProof: 'dsh-captain-pod-submission, dsh-captain-map — registered in dsh-captain.screen-registry.ts',
    screenProof: 'DshCaptainPoDSubmissionScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, success, error, retry — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'arrived_dropoff, delivered, delivery_failed, proof_of_delivery gate, button alternative for every swipe/drag — UI فقط',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-onboarding',
    step: 'onboarding',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'انضمام الشركاء',
    description: 'شاشات تأهيل المتاجر الميدانية مسجّلة ومعاينتها جاهزة. حالات وثائق التحقق (missing/uploaded/rejected/approved) ناقصة.',
    evidenceHint: 'يحتاج: visual capture + document states + handoff-to-CP flow',
    routeHint: '/app-field/stores',
    routeProof: 'dsh-field-stores, dsh-field-onboarding — registered in dsh-field.screen-registry.ts',
    screenProof: 'DshFieldStoresScreen (VERIFIED), DshFieldStoreOnboardingScreen (VERIFIED)',
    stateCoverageProof: 'loading, empty, error, success, offline — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'document states (missing/uploaded/rejected/approved/needs-reupload), readiness result states, CP handoff — UI فقط',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-visit-evidence',
    step: 'visit',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الزيارات والأدلة',
    description: 'شاشات الزيارة الميدانية وتصعيد الجاهزية مسجّلة. حالات visit evidence (photo_required/uploaded/location_confirmed) تحتاج اكتمال UI.',
    evidenceHint: 'يحتاج: visual capture + visit evidence states + readiness result',
    routeHint: '/app-field/visits',
    routeProof: 'dsh-field-visit, dsh-field-readiness-escalation — registered in dsh-field.screen-registry.ts',
    screenProof: 'DshFieldStoreVisitScreen (VERIFIED), DshFieldReadinessEscalationScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success, offline, disabled — declared',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'visit evidence states (photo_required/uploaded/location_confirmed/needs_revisit), readiness result (ready/needs-fix/escalated/rejected) — UI فقط',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    step: 'operations-monitoring',
    status: 'needs-cross-surface-proof',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الرقابة والتدخل',
    description: 'شاشات عمليات لوحة التحكم (CommandCenter, LiveOrders, Dispatch) موجودة لكن التنسيق عبر الأسطح مع lifecycle الموحد غير مثبت.',
    evidenceHint: 'يحتاج: إثبات ربط CommandCenter بـ dsh-order-journey.model + cross-surface consistency مع app-captain/app-partner',
    routeHint: '/operations',
    routeProof: 'TBD — control-panel operations screens not in scope of screen-registry files read',
    screenProof: 'TBD',
    stateCoverageProof: 'TBD',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'lifecycle state binding, dispatch board (bthwani_delivery only), reassignment_required action, heatmap separation, AuditSupportSlaScreen source — UI فقط',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-governance',
    step: 'finance-review',
    status: 'blocked-by-wlt',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'الحوكمة والمالية',
    description: 'قسم المالية داخل DSH هو عرض للقراءة فقط. المصدر الحقيقي هو WLT حصرًا. أي mutation مالي ممنوع من DSH.',
    evidenceHint: 'يحتاج: تأكيد Source: WLT على كل بطاقة مالية + blocked-by-wlt banner واضح في كل workspace',
    routeHint: '/finance',
    routeProof: 'TBD — control-panel finance screens not in scope of screen-registry files read',
    screenProof: 'TBD',
    stateCoverageProof: 'TBD',
    visualEvidenceStatus: 'missing',
    crossSurfaceProof: undefined,
    remainingUiFlowGap: 'Source: WLT label على كل card, mutation ممنوعة, PartnerSettlement/CaptainPayout/RefundQueue/Commission/PlatformFee/FieldCommission — read-only UI فقط',
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
