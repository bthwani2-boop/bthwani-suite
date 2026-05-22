export type DshSurfaceId = 'app-client' | 'app-partner' | 'app-captain' | 'app-field' | 'control-panel';

export type DshLegacySurfaceId = 'client' | 'partner' | 'captain' | 'field';

export type DshSurfaceLookupId = DshSurfaceId | DshLegacySurfaceId;

export type DshClosureDomain =
  | 'client-discovery'
  | 'client-checkout'
  | 'client-tracking-support'
  | 'partner-operations'
  | 'partner-catalog'
  | 'captain-operations'
  | 'field-operations'
  | 'control-panel-operations'
  | 'control-panel-support'
  | 'control-panel-finance';

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
  | 'blocked-by-contract'
  | 'blocked-by-wlt';

export type DshRuntimeBindingStatus =
  | 'UI_PREVIEW_ONLY'
  | 'NEEDS_BINDING_LATER'
  | 'NEEDS_RUNTIME_EVIDENCE'
  | 'BLOCKED'
  | 'BLOCKED_BY_CONTRACT'
  | 'BLOCKED_BY_WLT';

export type DshClosureEvidenceStatus =
  | 'captured'
  | 'needs-visual-evidence'
  | 'verified-ui-flow'
  | 'blocked-by-contract'
  | 'blocked-by-wlt';

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
    case 'BLOCKED_BY_CONTRACT':
      return 'محجوب بسبب العقد';
    case 'BLOCKED_BY_WLT':
      return 'محجوب بسبب WLT';
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
  | 'control-panel-support'
  | 'control-panel-governance';

export type DshCrossSurfaceClosureItem = {
  surfaceId: DshSurfaceId;
  actor: DshActor;
  area: DshClosureArea;
  domain: DshClosureDomain;
  step: DshLifecycleStep;
  status: DshClosureStatus;
  runtimeBindingStatus: DshRuntimeBindingStatus;
  title: string;
  description: string;
  routeHint: string;
  screenOwner: string;
  primaryAction: string;
  requiredStates: readonly string[];
  evidenceStatus: DshClosureEvidenceStatus;
  remainingBlocker: string;
  crossSurfaceDependencies: readonly string[];
  wltBoundary: string;
  visualEvidenceRequired: boolean;
  evidenceHint: string;
  /**
   * Proof metadata — مطلوبة قبل الترقية إلى 'verified-ui-flow'.
   * غيابها يعني أن الإغلاق غير مكتمل بصرف النظر عن status.
   */
  readonly routeProof?: string;
  readonly screenProof?: string;
  readonly stateCoverageProof?: string;
  readonly crossSurfaceProof?: string;
};

export const DSH_CROSS_SURFACE_CLOSURE_MAP: readonly DshCrossSurfaceClosureItem[] = [
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-discovery',
    domain: 'client-discovery',
    step: 'discovery',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'اكتشاف المتاجر',
    description: 'شاشات الاكتشاف والبحث والكتالوج صارت مرتبطة ببوابة رؤية موحدة للعميل. المنطق مكتمل، والمتبقي لقطات المراجعة البصرية فقط.',
    screenOwner: 'dsh/frontend/app-client/screens/HomeScreen.tsx + SearchScreen.tsx + StoreScreen.tsx',
    primaryAction: 'فتح وجهة أو متجر أو فئة من سطح الاكتشاف.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'لا توجد فجوة منطقية نشطة في discovery بعد توحيد gate الرؤية. المتبقي screenshots وproof بصري على هذا الفرع.',
    crossSurfaceDependencies: [
      'control-panel marketing publish controls',
      'app-partner inventory and availability readiness',
      'shared marketing visibility contract',
    ],
    wltBoundary: 'لا توجد ملكية مالية لـ WLT في discovery. تبدأ حدود WLT بعد checkout intent فقط.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لـ HomeScreen وSearchScreen وStoreScreen بعد بوابة الرؤية الموحدة.',
    routeHint: '/app-client/discovery',
    routeProof: 'dsh-home, dsh-search, dsh-store — registered in dsh-client.screen-registry.ts',
    screenProof: 'DshHomeGetScreen, DshSearchScreen, DshStoreGetScreen — VERIFIED in registry',
    stateCoverageProof: 'loading, empty, error, success, offline — declared',
    crossSurfaceProof: 'HomeScreen وDshClientSurface وStoreScreen أصبحت تستهلك resolveDshStoreClientVisibility() من shared gate واحد، ما يربط partner activation + catalog publish + delivery readiness + serviceability قبل أي ظهور للمتجر أو promo target داخل app-client.',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-cart-checkout',
    domain: 'client-checkout',
    step: 'checkout',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_BINDING_LATER',
    title: 'السلة والدفع',
    description: 'السلة وcheckout intent يستهلكان lifecycle state model الموحّد مع إبقاء الدفع read-only عند WLT. المنطق حاضر، والمتبقي visual/runtime evidence فقط.',
    screenOwner: 'dsh/frontend/app-client/screens/CartScreen.tsx + DshCheckoutIntentScreen.tsx',
    primaryAction: 'مراجعة السلة ثم تأكيد checkout intent قبل تفويض قرار الدفع.',
    requiredStates: ['loading', 'error', 'blocked', 'retry'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات الدفع والفشل والإنشاء موجودة في shared lifecycle + screens، لكن لا توجد screenshots أو runtime proof على هذا الفرع.',
    crossSurfaceDependencies: [
      'wlt app-client bridge',
      'control-panel finance preview',
      'app-partner order-intake visibility',
    ],
    wltBoundary: 'WLT يملك قرار الدفع، wallet semantics، refund execution، ومعنى settlement بالكامل.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لحالات payment_failed وorder_creation_failed وbridge read-only مع WLT.',
    routeHint: '/app-client/cart',
    routeProof: 'dsh-cart, dsh-checkout-intent — registered in dsh-client.screen-registry.ts',
    screenProof: 'DshCartGetScreen (VERIFIED), DshCheckoutIntentScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, error, blocked, retry — declared',
    crossSurfaceProof: 'CartScreen وDshCheckoutIntentScreen وdsh-order-journey.model وdsh-signal-layer.model تتشارك حالات awaiting_wlt_payment وpayment_failed وorder_creation_failed مع routeId موحد للدعم وfinance preview، مع بقاء mutation المالي محجوبًا لـ WLT.',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-tracking-support',
    domain: 'client-tracking-support',
    step: 'tracking',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'التتبع والدعم',
    description: 'سطح التتبع ومساحة المشاكل يستهلكان journey/signal/support models الموحدة. المتبقي هو الإثبات البصري والتشغيلي فقط.',
    screenOwner: 'dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx + OperationScreens.tsx',
    primaryAction: 'فتح تسلسل الطلب أو مساحة المشكلة من سياق الطلب الحالي.',
    requiredStates: ['loading', 'error', 'success', 'offline', 'retry', 'blocked', 'cancelled'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات cancellation_requested وrefund_pending_wlt وsupport_exception وrating_pending مغطاة منطقيًا، لكن لم تُلتقط screenshots أو runtime evidence بعد.',
    crossSurfaceDependencies: [
      'app-partner order acceptance and preparation states',
      'app-captain pickup and delivery milestones',
      'control-panel support and audit lanes',
    ],
    wltBoundary: 'WLT يملك تنفيذ refund وأي adjustment مالي فقط.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لحالات cancellation/refund/support-exception/rating handoff.',
    routeHint: '/app-client/orders',
    routeProof: 'dsh-orders, dsh-tracking, dsh-order-issue-workspace — registered in dsh-client.screen-registry.ts',
    screenProof: 'DshOrdersListScreen (VERIFIED), DshTrackingScreen (VERIFIED), DshOrderIssueHubScreen (VERIFIED)',
    stateCoverageProof: 'loading, error, success, offline, retry, blocked, cancelled — declared',
    crossSurfaceProof: 'OrdersTrackingScreens وOperationScreens تشاركان dsh-order-journey.model مع control-panel/support وfinance bridge، بينما refund_pending_wlt يظل read-only وsupport_exception/audit_required يذهبان إلى escalationOwner = control-panel عبر signal layer.',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-intake-prep',
    domain: 'partner-operations',
    step: 'order-intake',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'استقبال الطلبات',
    description: 'صندوق الطلبات ومسارات الرفض والمشاكل مربوطة بحالات journey والدعم والhandoff. المتبقي visual/runtime evidence فقط.',
    screenOwner: 'dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx + OperationScreens.tsx + DshPartnerOrderRejectionScreen.tsx',
    primaryAction: 'قبول الطلب أو رفضه أو إدخاله في مسار التحضير.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'blocked', 'retry'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات item_unavailable وpreparation_delayed وhandoff موجودة منطقيًا في screens/shared models، لكن يلزم screenshots وproof تشغيلي على هذا الفرع.',
    crossSurfaceDependencies: [
      'app-client order-created visibility',
      'app-captain pickup readiness',
      'control-panel operations intervention lanes',
    ],
    wltBoundary: 'WLT لا يدخل إلا إذا نتج عن الرفض reversal مالي لاحق.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لمسارات accept/reject/prepare/ready/handoff exception.',
    routeHint: '/app-partner/orders',
    routeProof: 'dsh-partner-orders, dsh-partner-order-issue, dsh-partner-order-rejection — registered in dsh-partner.screen-registry.ts',
    screenProof: 'OrdersInboxScreen (VERIFIED), OrderIssueScreen (VERIFIED), DshPartnerOrderRejectionScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success, offline, blocked, retry — declared',
    crossSurfaceProof: 'OrdersInboxScreen وDshPartnerOrderRejectionScreen وoperations-support.preview تتشارك item_unavailable وpreparation_delayed وhandoff_mismatch مع control-panel exceptions وapp-client tracking، ما يثبت handoff order created → partner intake → preparing → ready-for-pickup.',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-catalog-readiness',
    domain: 'partner-catalog',
    step: 'catalog-governance',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'إدارة المتجر',
    description: 'شاشة المخزون تستهلك هوية المنتج والباركود والنشر من shared model موحد. المنطق جاهز، والمتبقي visual evidence فقط.',
    screenOwner: 'dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx',
    primaryAction: 'تحديث جاهزية العنصر ونطاق ظهوره قبل النشر.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'barcode/duplicate/publishing/client-visibility مسدودة منطقيًا في shared model + inventory/catalog gate، لكن لا توجد screenshots بعد.',
    crossSurfaceDependencies: [
      'app-client storefront visibility',
      'control-panel catalogs governance',
      'control-panel marketing visibility contract',
    ],
    wltBoundary: 'لا توجد ملكية مالية هنا؛ التأثير محصور في جاهزية الكتالوج والرؤية.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لمسارات barcode وduplicate وpublishing gate وclient visibility.',
    routeHint: '/app-partner/inventory',
    routeProof: 'dsh-partner-inventory — registered in dsh-partner.screen-registry.ts',
    screenProof: 'InventoryCatalogScreen (VERIFIED)',
    stateCoverageProof: 'loading, empty, error, success, offline — declared',
    crossSurfaceProof: 'InventoryCatalogScreen وCatalogPublishingGateSection وControlPanelDshMarketingScreen أصبحت تستهلك resolveDshProductClientVisibility() وgetDshProductPublishingPrerequisites() نفسها، ما يربط product approval + store activation gate + storefront visibility من الشريك إلى الكتالوج إلى العميل.',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-task-pickup',
    domain: 'captain-operations',
    step: 'pickup',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'استلام المهمة',
    description: 'مسارات الاستلام والخريطة مربوطة بعقد dispatch/lifecycle الموحّد مع إبقاء queue الكباتن محصورة في bthwani_delivery. المتبقي visual/runtime evidence فقط.',
    screenOwner: 'dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx + DshCaptainPickupDropoffScreen.tsx + DshCaptainMapScreen.tsx',
    primaryAction: 'قبول الإسناد ثم إكمال handoff والاستلام.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'retry'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات captain_decline وpickup_failed وhandoff_mismatch وreassignment_required مغطاة منطقيًا، لكن يلزم screenshots وproof runtime فقط.',
    crossSurfaceDependencies: [
      'app-partner ready-for-pickup state',
      'control-panel dispatch assignment',
      'app-client tracking milestone visibility',
    ],
    wltBoundary: 'لا توجد ملكية مالية مباشرة في pickup flow.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لمسارات assignment/accept/decline/pickup/handoff exception.',
    routeHint: '/app-captain/orders',
    routeProof: 'dsh-captain-inbox, dsh-captain-pickup-dropoff, dsh-captain-map — registered in dsh-captain.screen-registry.ts',
    screenProof: 'CaptainOrdersInboxScreen (VERIFIED), DshCaptainPickupDropoffScreen (READY_FOR_REVIEW), DshCaptainMapScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success — declared',
    crossSurfaceProof: 'DshCaptainOrdersScreen وDshCaptainPickupDropoffScreen وDispatchAssignmentScreen تشترك في dsh-order-journey.model، وDispatchAssignment يفرض boundary صريحة أن captain dispatch لا يدخل إلا أوامر bthwani_delivery، مع reroute واضح عند captain_decline/reassignment_required.',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-delivery-proof',
    domain: 'captain-operations',
    step: 'delivery',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'التوصيل والإثبات',
    description: 'إثبات التسليم ومسار الفشل يستهلكان shared lifecycle/support models مع PoD gate واضح. المتبقي visual/runtime evidence فقط.',
    screenOwner: 'dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx + DshCaptainMapScreen.tsx',
    primaryAction: 'تأكيد الوصول ثم رفع إثبات التسليم أو فتح مسار الفشل.',
    requiredStates: ['loading', 'success', 'error', 'retry'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات delivered وdelivery_failed وproof_of_delivery مغطاة في screens/shared models، لكن يلزم screenshots وruntime proof بعد.',
    crossSurfaceDependencies: [
      'app-client delivered and rating surface',
      'control-panel audit and support review lanes',
    ],
    wltBoundary: 'WLT لا يظهر هنا إلا إذا تحولت الشكوى لاحقًا إلى أثر مالي.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لمسارات PoD/delivery_failed/post-delivery handoff.',
    routeHint: '/app-captain/map',
    routeProof: 'dsh-captain-pod-submission, dsh-captain-map — registered in dsh-captain.screen-registry.ts',
    screenProof: 'DshCaptainPoDSubmissionScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, success, error, retry — declared',
    crossSurfaceProof: 'DshCaptainPoDSubmissionScreen وDshCaptainMapScreen وOrdersTrackingScreens وSupportHubScreens تشترك في delivered/delivery_failed/proof_of_delivery، ما يثبت الانتقال من dropoff إلى client rating أو support escalation مع audit note عند الحاجة.',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-onboarding',
    domain: 'field-operations',
    step: 'onboarding',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'انضمام الشركاء',
    description: 'شاشات stores + onboarding صارت تعرض حالات الوثائق والجاهزية داخل الملف نفسه بدل اختصار documents=0. المتبقي visual evidence فقط.',
    screenOwner: 'dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx + DshFieldStoreOnboardingScreen.tsx',
    primaryAction: 'فتح مرشح المتجر ثم إدخال ملف التأهيل وتحويله للمراجعة.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات الوثائق والجاهزية مغطاة منطقيًا داخل onboarding flow، لكن يلزم screenshots لإثبات العرض النهائي على هذا الفرع.',
    crossSurfaceDependencies: [
      'control-panel partner approval workflow',
      'app-partner store readiness ownership',
    ],
    wltBoundary: 'لا توجد ملكية مالية في onboarding flow.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لحالات documents + readiness + handoff-to-CP.',
    routeHint: '/app-field/stores',
    routeProof: 'dsh-field-stores, dsh-field-onboarding — registered in dsh-field.screen-registry.ts',
    screenProof: 'DshFieldStoresScreen (VERIFIED), DshFieldStoreOnboardingScreen (VERIFIED)',
    stateCoverageProof: 'loading, empty, error, success, offline — declared',
    crossSurfaceProof: 'DshFieldStoreOnboardingScreen وDocumentVerificationSection وresolveFieldSectionSummaries() تشترك الآن في عدّ الوثائق الفعلية وحالة readiness، ما يربط field onboarding بقرار control-panel/partners بدل تجاوز documents section كفجوة عامة.',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-visit-evidence',
    domain: 'field-operations',
    step: 'visit',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'الزيارات والأدلة',
    description: 'الزيارة الميدانية وتصعيد الجاهزية يطبقان on-demand evidence contract مع نتيجة واضحة للعودة للمسار. المتبقي visual evidence فقط.',
    screenOwner: 'dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx + DshFieldReadinessEscalationScreen.tsx',
    primaryAction: 'التقاط دليل الزيارة ثم رفع تصعيد الجاهزية عند الحاجة.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled', 'blocked', 'retry'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'حالات الزيارة والتصعيد مرتبطة منطقيًا، لكن لا توجد screenshots أو runtime proof لهذا المسار بعد.',
    crossSurfaceDependencies: [
      'control-panel partner approvals',
      'app-partner readiness ownership',
      'app-field history and account surfaces',
    ],
    wltBoundary: 'أي finance visibility لاحقة تبقى WLT-owned وخارج visit/readiness flow.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لزيارة الميدان وفتح الأدلة ونتيجة readiness.',
    routeHint: '/app-field/visits',
    routeProof: 'dsh-field-visit, dsh-field-readiness-escalation — registered in dsh-field.screen-registry.ts',
    screenProof: 'DshFieldStoreVisitScreen (VERIFIED), DshFieldReadinessEscalationScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success, offline, disabled — declared',
    crossSurfaceProof: 'DshFieldStoreVisitScreen وVisitEvidenceSection وDshFieldReadinessEscalationScreen يلتزمون بسياسة evidence-on-open نفسها الموجودة في flow registry، ويربطون الزيارة بمالك التصعيد في control-panel/support دون فتح surface مالية أو تشغيلية خارج السياق.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-monitoring',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'الرقابة والتدخل',
    description: 'شاشات عمليات لوحة التحكم صارت مربوطة بمسار lifecycle الموحد، وصف الاستثناءات/الدعم، وحدود الخريطة control-panel only. المتبقي الآن هو visual evidence فقط.',
    screenOwner: 'dsh/frontend/control-panel/operations/operations.registry.ts + CommandCenterScreen.tsx + DispatchAssignmentScreen.tsx + ExceptionsEscalationsScreen.tsx + AuditSupportSlaScreen.tsx + GeoHeatmapScreen.tsx',
    primaryAction: 'فحص المخاطر العابرة للأسطح ثم توجيه التدخل التشغيلي التالي.',
    requiredStates: ['success', 'error', 'retry', 'blocked'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'اللقطات الحالية والـ runtime evidence ما زالت غير ملتقطة على هذا الفرع.',
    crossSurfaceDependencies: [
      'app-client tracking and support context',
      'app-partner preparation and readiness lanes',
      'app-captain assignment and proof milestones',
      'shared signal layer model',
    ],
    wltBoundary: 'لا توجد ملكية مالية مباشرة في operations surface.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لـ CommandCenter وDispatchAssignment وExceptionsEscalations وAuditSupportSla وGeoHeatmap بعد التعديلات الحالية.',
    routeHint: '/operations',
    routeProof: 'operations.registry.ts يثبت /operations عبر buildOperationsHref ويطبع workspaces: command-center, live-orders, dispatch-assignment, exceptions-escalations, audit-support-sla, geo-heatmap.',
    screenProof: 'CommandCenterScreen.tsx + DispatchAssignmentScreen.tsx + ExceptionsEscalationsScreen.tsx + AuditSupportSlaScreen.tsx + GeoHeatmapScreen.tsx موجودة ومستخدمة في control-panel operations surface.',
    stateCoverageProof: 'DispatchAssignment يستهلك DISPATCH_LIFECYCLE_STATE_MAP + getDshLifecycleStateMetadata؛ ExceptionsEscalations يربط EXCEPTION_TICKET_MAP بتذاكر الدعم/audit؛ AuditSupportSla يفتح detail route بدل console/debug path؛ GeoHeatmap يعلن boundary صريحة أنه CP-only summary-first.',
    crossSurfaceProof: 'التناظر actor-to-actor صار مثبتًا في الكود: حالات captain_unavailable / reassignment_required في control-panel تعتمد نفس dsh-order-journey.model المستهلك في app-captain/app-client، وصف الاستثناءات يربط support/audit handoff، وheatmap تبقى control-panel only بدل خلطها بأسطح التشغيل الأخرى.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-support',
    domain: 'control-panel-support',
    step: 'support',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'Customer 360 وManual Call Intake',
    description: 'قسم الدعم يملك Customer 360 وCall Intake داخل shell الحالي مع quick actions إلى Assisted Order وOrder Rescue وWLT visibility read-only.',
    screenOwner: 'SupportHubScreens.tsx + Customer360Workspace.tsx + ManualCallIntakeWorkspace.tsx',
    primaryAction: 'فتح العميل أو المكالمة اليدوية ثم توجيه الحالة إلى order, ticket, assisted-order, rescue, أو WLT reference.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'blocked'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'المنطق والروابط موجودة، لكن screenshots وruntime proof لمسار الهوية والربط المتقاطع ما زالت ناقصة.',
    crossSurfaceDependencies: [
      'app-client order context',
      'control-panel operations assisted order',
      'wlt finance visibility',
    ],
    wltBoundary: 'الرؤية المالية هنا مرجعية فقط، وأي refund/settlement/payout يبقى مملوكًا لـ WLT.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لـ Customer 360 وCall Intake مع identity gate وWLT read-only panel.',
    routeHint: '/support',
    routeProof: 'SupportHubScreens.tsx يبني تبويبات customer-360 وcall-intake داخل /support من دون route جديدة.',
    screenProof: 'Customer360Workspace.tsx + ManualCallIntakeWorkspace.tsx موجودتان ومربوطتان داخل support hub.',
    stateCoverageProof: 'verification required / verified / blocked + quick actions + WLT visibility notes معلنة في shared previews.',
    crossSurfaceProof: 'Customer 360 وCall Intake يستهلكان shared previews نفسها مع quick links إلى Assisted Order وOrder Rescue وWLT reference، ما يثبت handoff حقيقي بين الدعم والعمليات والمرجع المالي.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-intervention',
    status: 'needs-visual-evidence',
    runtimeBindingStatus: 'NEEDS_RUNTIME_EVIDENCE',
    title: 'Assisted Order وOrder Rescue',
    description: 'العمليات توسعت داخل shell نفسها لإدارة assisted-order-desk وorder-rescue مع playbooks مدمجة داخل command-center والاستثناءات.',
    screenOwner: 'OperationsHubScreen.tsx + AssistedOrderDeskScreen.tsx + OrderRescueScreen.tsx + CommandCenterScreen.tsx + ExceptionsEscalationsScreen.tsx',
    primaryAction: 'فتح التدخل التشغيلي المناسب أو playbook القرار التالي من نفس قسم العمليات.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'blocked'],
    evidenceStatus: 'needs-visual-evidence',
    remainingBlocker: 'تدفقات التدخل والإنقاذ مربوطة، لكن visual/runtime evidence للمشغل النهائي ما زالت مفقودة.',
    crossSurfaceDependencies: [
      'support customer 360 and call intake',
      'app-partner readiness and disputes',
      'wlt preview-only finance references',
    ],
    wltBoundary: 'أي قرار مالي يظهر كمرجع فقط داخل rescue أو assisted-order ولا يتحول إلى mutation.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لـ assisted-order-desk وorder-rescue وplaybook cards داخل command-center/exceptions.',
    routeHint: '/operations',
    routeProof: 'operations.registry.ts يضيف assisted-order-desk وorder-rescue كـ workspace tabs داخل /operations.',
    screenProof: 'AssistedOrderDeskScreen.tsx + OrderRescueScreen.tsx + command-center/exceptions playbook sections موجودة ومستخدمة في hub.',
    stateCoverageProof: 'verified/pending identity + blocker + next-best-action + WLT boundary تظهر من shared preview layer عند الفتح فقط.',
    crossSurfaceProof: 'العمليات تستهلك DSH_ASSISTED_ORDER_PREVIEW وDSH_ORDER_RESCUE_PREVIEW وDSH_OPS_INTERVENTION_PLAYBOOKS مع handoff واضح إلى support/partners/finance.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-governance',
    domain: 'control-panel-finance',
    step: 'finance-review',
    status: 'blocked-by-wlt',
    runtimeBindingStatus: 'BLOCKED_BY_WLT',
    title: 'الحوكمة والمالية',
    description: 'قسم المالية داخل DSH يعرض WLT bridge للقراءة فقط. الملكية المالية والحقيقة المحاسبية خارج DSH بالكامل.',
    screenOwner: 'dsh/frontend/control-panel/finance/FinanceHubScreen.tsx + FinanceHubScreens.tsx + WLT bridge workspaces',
    primaryAction: 'فحص عرض مالي read-only مع إبقاء كل القرار المالي خارج DSH.',
    requiredStates: ['loading', 'error', 'success', 'blocked'],
    evidenceStatus: 'blocked-by-wlt',
    remainingBlocker: 'settlement وrefund وpayout وcommission وledger تبقى WLT-owned؛ DSH لا يملك mutation مالي هنا.',
    crossSurfaceDependencies: [
      'wlt/frontend/shared/finance preview data',
      'partner/captain/field bridge workspaces',
    ],
    wltBoundary: 'حد WLT كامل: settlement, payout, refund, commission, ledger, reconciliation كلها خارج DSH.',
    visualEvidenceRequired: true,
    evidenceHint: 'يحتاج: visual capture لـ WltBoundaryBanner عبر workspaces المالية مع بقاء القرار المالي محجوبًا بـ WLT.',
    routeHint: '/finance',
    routeProof: 'DshControlPanelSurfaceHost.tsx يوجّه /finance إلى ControlPanelDshFinanceHubScreen، وFinanceHubScreen.tsx يبني المسارات الداخلية عبر buildFinanceHref وFINANCE_ACTIVE_GROUPS.',
    screenProof: 'FinanceHubScreen.tsx + WltBoundaryBanner.tsx + PartnerSettlementWorkspace.tsx + CaptainPayoutWorkspace.tsx + RefundQueueWorkspace.tsx + PlatformFeeAuditWorkspace.tsx + FieldCommissionWorkspace.tsx تثبت أن كل workspace مالي يعرض bridge panel أو boundary banner واضحًا.',
    stateCoverageProof: 'FinanceHubScreen يحمّل getWltControlPanelFinancePreview() من wlt/frontend/shared/finance/dshFinancePreview؛ FinanceHubScreens.tsx يوسم overview/settlements/refunds/payouts/ledger/risk-audit كلها كـ WLT-owned read-only previews؛ WltBoundaryBanner يفرض شارة "WLT — عرض فقط".',
    crossSurfaceProof: 'العقد عبر الأسطح واضح: DSH control-panel يقرأ من WLT preview، بينما app-client وعمليات DSH لا تملك أي financial mutation. بقاء status = blocked-by-wlt مقصود لأنه يمنع نقل ملكية القرار المالي إلى DSH.',
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
