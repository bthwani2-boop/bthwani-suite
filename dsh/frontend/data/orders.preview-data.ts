import type { DshFulfillmentOperationalMode, DshOperationsOrderRow } from '../shared/dsh-cp-operations.contract';
import type { DshOperationsOrderDetail } from '../shared/dsh-order-journey.model';
import {
  AWNAK_STAGE_LABELS,
  buildDshAssistedOrderDeliveryModeSummary,
  buildDshAssistedOrderLookupInputs,
  buildDshSignalRoutePreview,
  ORDER_RESCUE_ACTIONS,
  ORDER_RESCUE_OWNERS,
  ORDER_RESCUE_REASONS,
  SHEIN_PROXY_STAGE_LABELS,
  type AwnakStage,
  type CartItem,
  type DshAssistedOrderPreview,
  type DshCaptainOrderBellItem,
  type DshCaptainOrderId,
  type DshOrderRescueCase,
  type DshOpsMonitoringItem,
  type DshPartnerOrderAlertItem,
  type DshPartnerOrderConversationMessage,
  type DshWltFinanceAlert,
  type RecommendationProduct,
  type SheinProxyStage,
} from '../shared/dsh-order-preview.contract';
import type { DshClientState } from './operational-statuses.preview-data';

// -----------------------------------------------------------------------------
// Client cart preview
// -----------------------------------------------------------------------------
export const dshCartRecommendedProductsFixture: RecommendationProduct[] = [
  { id: 'r1', title: 'تفاح طازج', priceLabel: '500', priceValue: 500, imageUri: 'dsh.product.apple.v1' },
  { id: 'r2', title: 'كيس خبز', priceLabel: '100', priceValue: 100, imageUri: 'dsh.product.bread.v1' },
  { id: 'r3', title: 'دجاج بروست', priceLabel: '1,500', priceValue: 1500, imageUri: 'dsh.product.chicken.v1' },
  { id: 'r4', title: 'شوكولاتة فاخرة', priceLabel: '400', priceValue: 400, imageUri: 'dsh.product.choco.v1' },
  { id: 'r5', title: 'كرواسون فرنسي', priceLabel: '300', priceValue: 300, imageUri: 'dsh.product.croissant.v1' },
  { id: 'r6', title: 'حليب طازج', priceLabel: '600', priceValue: 600, imageUri: 'dsh.product.milk.v1' },
  { id: 'r7', title: 'معكرونة إيطالية', priceLabel: '350', priceValue: 350, imageUri: 'dsh.product.pasta.v1' },
  { id: 'r8', title: 'بطاطس رول', priceLabel: '250', priceValue: 250, imageUri: 'dsh.product.roll.v1' },
  { id: 'r9', title: 'سلطة خضراء', priceLabel: '450', priceValue: 450, imageUri: 'dsh.product.salad.v1' },
  { id: 'r10', title: 'زبادي طازج', priceLabel: '150', priceValue: 150, imageUri: 'dsh.product.yogurt.v1' },
];

export const dshCartPreviewFallbackItemsFixture: CartItem[] = [
  { id: 'p1', title: 'دجاج فحم تركي مع التوابع', priceValue: 3000, qty: 1 },
  { id: 'p2', title: 'كريسبي رول مفرد', priceValue: 1500, qty: 2 },
  { id: 'p3', title: 'فتة دخن بالقشطة والعسل', priceValue: 1700, qty: 3 },
  { id: 'p4', title: 'فتة بالقشطة والعسل', priceValue: 1500, qty: 1 },
];

// -----------------------------------------------------------------------------
// Captain orders preview
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Partner orders preview
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY: app-partner order alerts + conversation fixtures.
 * Merged from: partner-order-alert.preview-data.ts + partner-order-conversation.preview-data.ts
 */
export const dshPartnerOrdersPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

// --- Order Alerts ---
// --- Order Conversation ---

// -----------------------------------------------------------------------------
// Assisted order desk preview
// -----------------------------------------------------------------------------
export const DSH_ASSISTED_ORDER_PREVIEW: readonly DshAssistedOrderPreview[] = [
  {
    deskId: 'assist-ord-1102',
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    maskedPhone: '05*******18',
    source: 'manual_call_intake',
    orderId: 'ORD-1102',
    ticketId: 'TKT-1102',
    identityStatus: 'verified',
    activeStage: 'partner-confirmation',
    basketSummary: '3 عناصر منشورة مع بديل واحد مثبت قبل الإرسال.',
    auditFlags: ['identity-verified', 'reason-required', 'audit-required', 'replacement-confirmed'],
    allowedActions: ['إضافة عنصر منشور', 'حذف عنصر', 'استبدال عنصر غير متاح', 'فتح WLT visibility والتحكم المالي'],
    forbiddenActions: ['تجاوز التحقق من الهوية', 'تنفيذ refund محلي', 'اعتماد حقيقة حسابية داخل DSH'],
    wltBoundary: 'WLT والتحكم المالي متاحان بالكامل: الدفع والاسترداد والتسوية قابلة للتعديل والتحكم المباشر.',
    nextAction: 'ثبّت موافقة البديل ثم حرّك الحالة إلى submit draft preview من دون claim إنشاء طلب.',
    crossSurfaceLinks: [
      {
        actionId: 'customer-360',
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/support/customer-360',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'wlt-visibility',
        label: 'WLT control',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: false,
      },
      {
        actionId: 'order-rescue',
        label: 'Order rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&orderId=ORD-1102&ticketId=TKT-1102&customerId=cus-9021',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
    ],
    lookupPanel: {
      inputs: buildDshAssistedOrderLookupInputs({
        phone: '05*******18',
        orderId: 'ORD-1102',
        customerId: 'cus-9021',
        ticketId: 'TKT-1102',
      }),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    identityVerification: {
      verificationStatus: 'verified',
      verificationSteps: [
        { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: true },
        { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو معرف مرجعي', completed: true },
        { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: true },
      ],
      sensitiveFieldsLocked: ['العنوان الكامل', 'قرار الاسترداد', 'تفاصيل settlement'],
      forbiddenActionsBeforeVerification: ['إظهار الدفع', 'تعديل عنوان التسليم', 'إرسال الطلب'],
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    cartBuilderPreview: {
      publishedProductsOnly: true,
      items: [
        { sku: 'SKU-441', name: 'حليب قليل الدسم', quantity: 2, published: true, status: 'active', note: 'منشور ويظهر في الكتالوج الحالي.' },
        { sku: 'SKU-889', name: 'خبز بر', quantity: 1, published: true, status: 'substitute', note: 'بديل مثبت بعد موافقة العميل.' },
        { sku: 'SKU-221', name: 'بيض عضوي', quantity: 1, published: true, status: 'active', note: 'لا توجد قيود إضافية.' },
      ],
      addItemPreview: 'إضافة عناصر منشورة فقط من نفس store context.',
      removeItemPreview: 'الحذف مسموح بعد توثيق السبب داخل operator note.',
      replaceItemPreview: 'الاستبدال يربط العنصر الأصلي بالبديل داخل نفس السلة.',
      substituteItemPreview: 'البديل يحتاج visibility note للعميل أو الشريك قبل التثبيت.',
      unavailableItemHandling: 'عند نفاد العنصر: إما بديل منشور أو حذف العنصر مع سبب واضح، وإلا افتح إنقاذ الطلب.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    deliveryModeSelector: buildDshAssistedOrderDeliveryModeSummary('bthwani_delivery'),
    serviceabilitySummary: {
      zoneLabel: 'الرياض / الياسمين',
      serviceabilityStatus: 'serviceable',
      fallbackAction: 'إن تعذر الكابتن لاحقًا افتح Dispatch أو Rescue بدل تبديل الحقائق المالية.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltReadOnlyHandoff: {
      paymentVisibility: 'Paid via WLT wallet snapshot — controllable directly.',
      refundVisibility: 'Refund mutation allowed and managed from DSH.',
      settlementVisibility: 'Partner settlement mutable and managed directly.',
      readOnly: false,
      mutationForbidden: false,
      calculationTruthOwner: 'DSH & WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
      onDemandPolicy: 'detail-on-open',
      placeholderClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    auditReason: {
      reasonRequired: true,
      auditRequired: true,
      operatorNote: 'تمت مطابقة الهوية وتثبيت بديل الخبز قبل إرسال المسودة إلى قناة التنفيذ.',
      reasonLabel: 'Assisted order rebuild after manual call confirmation.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    submitDraftPreview: {
      previewOnly: true,
      noBackendCall: true,
      noOrderCreationClaim: true,
      previewState: 'ready_for_preview',
      nextAction: 'ارسل الإشارة التشغيلية ثم افتح الـ route المقابل عند قبول المشغل للخطوة التالية.',
      signal: buildDshSignalRoutePreview('assisted_order_requested'),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
  },
  {
    deskId: 'assist-ord-1184',
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    source: 'customer_360_followup',
    orderId: 'ORD-1184',
    ticketId: 'TKT-1184',
    identityStatus: 'required',
    activeStage: 'identity-check',
    basketSummary: 'إعادة بناء طلب سريع بعد متابعة Customer 360 مع حجب الحقول الحساسة.',
    auditFlags: ['identity-required', 'sensitive-fields-locked', 'draft-preview-only'],
    allowedActions: ['بدء lookup', 'التحقق من الهوية', 'تجهيز cart draft preview'],
    forbiddenActions: ['كشف العنوان الكامل', 'إرسال الطلب مباشرة', 'بدء تحصيل أو settlement'],
    wltBoundary: 'رؤية وتحكم WLT متاحان بالكامل بعد اكتمال التحقق.',
    nextAction: 'أكمل التحقق أولًا، ثم حدّد delivery mode صالحًا أو حوّل الحالة إلى rescue إن بقيت غير قابلة للخدمة.',
    crossSurfaceLinks: [
      {
        actionId: 'call-intake',
        label: 'Manual Call Intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'customer-360',
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/support/customer-360',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'wlt-visibility',
        label: 'WLT control',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: false,
      },
    ],
    lookupPanel: {
      inputs: buildDshAssistedOrderLookupInputs({
        phone: '05*******44',
        orderId: 'ORD-1184',
        customerId: 'cus-4188',
        ticketId: 'TKT-1184',
      }),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    identityVerification: {
      verificationStatus: 'required',
      verificationSteps: [
        { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: false },
        { stepId: 'confirm-ticket', label: 'مطابقة رقم التذكرة أو الطلب', completed: true },
        { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
      ],
      sensitiveFieldsLocked: ['العنوان الكامل', 'payment visibility', 'refund visibility'],
      forbiddenActionsBeforeVerification: ['عرض تفاصيل WLT', 'تعديل delivery mode', 'replace item'],
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    cartBuilderPreview: {
      publishedProductsOnly: true,
      items: [
        { sku: 'SKU-100', name: 'عصير برتقال', quantity: 1, published: true, status: 'active', note: 'صنف منشور متاح.' },
        { sku: 'SKU-101', name: 'مياه معدنية', quantity: 2, published: true, status: 'unavailable', note: 'غير متاح حاليًا ويحتاج بديلًا منشورًا.' },
      ],
      addItemPreview: 'لا تتم الإضافة قبل إنهاء التحقق.',
      removeItemPreview: 'الحذف يظل draft-only حتى اكتمال التحقق.',
      replaceItemPreview: 'الاستبدال أو البديل يتطلب تنبيهاً مرئياً للعميل قبل التثبيت.',
      substituteItemPreview: 'البديل يظهر كتوصية لا كتأكيد نهائي.',
      unavailableItemHandling: 'إن لم يتوفر بديل منشور، يحال الطلب إلى إنقاذ الطلب بدل ادعاء إنشاء جديد.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    deliveryModeSelector: buildDshAssistedOrderDeliveryModeSummary('pickup'),
    serviceabilitySummary: {
      zoneLabel: 'جدة / الروضة',
      serviceabilityStatus: 'blocked',
      blockedReason: 'استلام بنفسي فقط حتى اكتمال التحقق من الهوية وتأكيد نافذة الخدمة.',
      fallbackAction: 'إبقِ وضع الاستلام الذاتي أو افتح إنقاذ الطلب لتغيير القرار التشغيلي لاحقًا.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltReadOnlyHandoff: {
      paymentVisibility: 'Payment review controllable after verification completes.',
      refundVisibility: 'Refund visibility and execution allowed post-verification.',
      settlementVisibility: 'Settlement context mutable and controlled directly.',
      readOnly: false,
      mutationForbidden: false,
      calculationTruthOwner: 'DSH & WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
      onDemandPolicy: 'detail-on-open',
      placeholderClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    auditReason: {
      reasonRequired: true,
      auditRequired: true,
      operatorNote: 'العميل طلب assisted order لكن الهوية ما زالت غير مكتملة، وتم إبقاء الحقول الحساسة محجوبة.',
      reasonLabel: 'Identity-first assisted order request from Customer 360.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    submitDraftPreview: {
      previewOnly: true,
      noBackendCall: true,
      noOrderCreationClaim: true,
      previewState: 'blocked_by_identity',
      nextAction: 'أكمل identity verification أو غيّر المسار إلى Manual Call Intake قبل أي draft submit preview.',
      signal: buildDshSignalRoutePreview('assisted_order_requested'),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
  },
] as const;

export function getDshAssistedOrderById(deskId: string): DshAssistedOrderPreview | undefined {
  return DSH_ASSISTED_ORDER_PREVIEW.find((entry) => entry.deskId === deskId);
}

export function getDshAssistedOrderByContext(context: {
  readonly deskId?: string | null;
  readonly orderId?: string | null;
  readonly customerId?: string | null;
  readonly ticketId?: string | null;
}): DshAssistedOrderPreview | undefined {
  if (context.deskId) {
    const byDeskId = getDshAssistedOrderById(context.deskId);
    if (byDeskId) {
      return byDeskId;
    }
  }

  return DSH_ASSISTED_ORDER_PREVIEW.find((entry) => {
    if (context.orderId && entry.orderId === context.orderId) {
      return true;
    }

    if (context.customerId && entry.customerId === context.customerId) {
      return true;
    }

    if (context.ticketId && entry.ticketId === context.ticketId) {
      return true;
    }

    return false;
  });
}

// -----------------------------------------------------------------------------
// Order rescue preview
// -----------------------------------------------------------------------------
export const DSH_ORDER_RESCUE_PREVIEW: readonly DshOrderRescueCase[] = [
  {
    rescueId: 'rescue-1102',
    orderId: 'ORD-1102',
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    issueKind: 'item_unavailable',
    severity: 'danger',
    blocker: 'الشريك أكد الجاهزية جزئيًا لكن البديل لم يثبت بعد، ما يهدد SLA والرضا.',
    allowedActions: ['استبدال الصنف', 'إنشاء مهمة متابعة', 'فتح تذكرة الدعم', 'فتح رؤية WLT والتحكم المالي'],
    forbiddenActions: ['ممنوع تنفيذ الاسترداد داخل DSH', 'ممنوع تعديل التسوية أو الصرف', 'ممنوع تعديل الصنف بدون ملاحظة رؤية'],
    nextBestAction: 'ثبّت owner واحدًا ثم حرّك الحالة إلى replace item أو support exception بدل تعدد القرارات.',
    onDemandPolicy: 'detail-on-open',
    wltBoundary: 'إذا انتهت الحالة إلى استرداد فالرؤية والتحكم في الدفع والاسترداد متاحان مباشرة في DSH.',
    crossSurfaceLinks: [
      {
        actionId: 'support-ticket',
        label: 'تذكرة الدعم',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1102',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'partner-controls',
        label: 'تحكم الشريك',
        surfaceId: 'control-panel',
        sectionId: 'partners',
        routeHint: '/partners?tab=performance&orderId=ORD-1102',
        routeId: 'cp/partners/control',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'wlt-visibility',
        label: 'تحكم WLT',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: false,
      },
    ],
    rescueReasonSelector: {
      selectedReason: 'item_unavailable',
      options: ORDER_RESCUE_REASONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    ownerSelection: {
      selectedOwner: 'operations',
      options: ORDER_RESCUE_OWNERS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    nextActionSelector: {
      selectedAction: 'replace_item',
      options: ORDER_RESCUE_ACTIONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    requiredEvidence: {
      reason: 'البديل لم يثبت بعد رغم بقاء الطلب نشطًا.',
      operatorNote: 'يجب تأكيد visibility note للعميل أو الشريك قبل replace item.',
      affectedEntity: 'ORD-1102 / SKU-889',
      auditRequired: true,
      reasonRequired: true,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    supportHandoff: {
      ticketLink: 'TKT-1102',
      escalationOwner: 'الدعم + العمليات',
      sla: 'يتبقى 5 دقائق',
      routeHint: '/support?workspace=escalation&ticketId=TKT-1102',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltImpactVisibility: {
      paymentVisibility: 'لقطة الدفع قابلة للتعديل والتحكم المباشر.',
      refundVisibility: 'تنفيذ الاسترداد مسموح مباشرة داخل DSH.',
      settlementVisibility: 'تعديل التسوية والصرف يُدار مباشرة.',
      readOnly: false,
      mutationForbidden: false,
      calculationTruthOwner: 'DSH + WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
      onDemandPolicy: 'detail-on-open',
      placeholderClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    decisionSignal: buildDshSignalRoutePreview('order_rescue_requested'),
  },
  {
    rescueId: 'rescue-1184',
    orderId: 'ORD-1184',
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    issueKind: 'payment_failure',
    severity: 'warning',
    blocker: 'فشل الدفع ظهر للعميل بينما المكالمة اليدوية تحاول إنقاذ الطلب دون تجاوز WLT.',
    allowedActions: ['انتظار العميل', 'تحويل لاستثناء دعم', 'فتح تحكم WLT'],
    forbiddenActions: ['ممنوع تنفيذ الاسترداد داخل DSH', 'ممنوع تغيير وضع التوصيل بعد حالات الحجب', 'ممنوع تعديل التسوية أو الصرف'],
    nextBestAction: 'أكمل التحقق ثم افتح الرؤية المالية والتحكم قبل أي قرار rescue إضافي.',
    onDemandPolicy: 'detail-on-open',
    wltBoundary: 'DSH يملك قرار الدفع والاسترداد بالكامل؛ Rescue يتيح التعديل والتحكم المباشر.',
    crossSurfaceLinks: [
      {
        actionId: 'manual-call-intake',
        label: 'استقبال المكالمة اليدوي',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&orderId=ORD-1184&customerId=cus-4188&ticketId=TKT-1184',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'customer-360',
        label: 'ملف العميل الشامل',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&orderId=ORD-1184&customerId=cus-4188&ticketId=TKT-1184',
        routeId: 'cp/support/customer-360',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'wlt-visibility',
        label: 'تحكم WLT',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: false,
      },
    ],
    rescueReasonSelector: {
      selectedReason: 'payment_failure',
      options: ORDER_RESCUE_REASONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    ownerSelection: {
      selectedOwner: 'wlt_reference_only',
      options: ORDER_RESCUE_OWNERS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    nextActionSelector: {
      selectedAction: 'open_wlt_visibility',
      options: ORDER_RESCUE_ACTIONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    requiredEvidence: {
      reason: 'الدفع فشل والعميل يطلب متابعة عبر الهاتف مع بقاء القرار المالي لدى WLT.',
      operatorNote: 'لا تغيير في payment truth داخل DSH؛ rescue هنا يوجّه فقط.',
      affectedEntity: 'ORD-1184 / payment-failure',
      auditRequired: true,
      reasonRequired: true,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    supportHandoff: {
      ticketLink: 'TKT-1184',
      escalationOwner: 'الدعم',
      sla: 'يتبقى 9 دقائق',
      routeHint: '/support?workspace=escalation&ticketId=TKT-1184',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltImpactVisibility: {
      paymentVisibility: 'حالة الدفع قابلة للتحكم المباشر.',
      refundVisibility: 'تنفيذ الاسترداد والتراجع مسموح مباشرة.',
      settlementVisibility: 'تعديل التسوية مسموح مباشرة.',
      readOnly: false,
      mutationForbidden: false,
      calculationTruthOwner: 'DSH + WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
      onDemandPolicy: 'detail-on-open',
      placeholderClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    decisionSignal: buildDshSignalRoutePreview('order_rescue_requested'),
  },
] as const;

export function getDshOrderRescueCase(rescueId: string): DshOrderRescueCase | undefined {
  return DSH_ORDER_RESCUE_PREVIEW.find((entry) => entry.rescueId === rescueId);
}

export function getDshOrderRescueByContext(context: {
  readonly rescueId?: string | null;
  readonly orderId?: string | null;
  readonly customerId?: string | null;
}): DshOrderRescueCase | undefined {
  if (context.rescueId) {
    const byId = getDshOrderRescueCase(context.rescueId);
    if (byId) {
      return byId;
    }
  }

  return DSH_ORDER_RESCUE_PREVIEW.find((entry) => {
    if (context.orderId && entry.orderId === context.orderId) {
      return true;
    }

    if (context.customerId && entry.customerId === context.customerId) {
      return true;
    }

    return false;
  });
}

// -----------------------------------------------------------------------------
// Control panel operations preview
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const operationsPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export const OPERATIONS_PULSE_METRICS = [
  { id: 'command-center-open-orders', title: 'الطلبات المفتوحة', value: '128', description: 'الطلبات التي تتحرك داخل غرفة العمليات.', tone: 'brand' },
  { id: 'command-center-dispatch-risk', title: 'مخاطر الإسناد', value: '9', description: 'طلبات تحتاج إسنادًا يدويًا الآن.', tone: 'warning' },
  { id: 'command-center-captain-cover', title: 'تغطية الكباتن', value: '42', description: 'الكباتن المتاحون ظاهرون الآن.', tone: 'best' },
  { id: 'command-center-escalations', title: 'الاستثناءات', value: '17', description: 'استثناءات مفتوحة تنتظر مالكًا.', tone: 'danger' },
] as const;

export const LIVE_ORDERS_OPERATIONAL_PREVIEW = {
  summary: {
    awaitingAcknowledgement: 3,
    blockedRings: 2,
    ringLabel: 'تنبيه الوصول',
    actionHint: 'أعد الرنين ثم افتح الإسناد إذا بقي الطلب بلا رد.',
  },
  rows: [
    {
      id: 'LO-1024',
      fulfillmentMode: 'bthwani_delivery',
      status: 'قيد الإسناد',
      statusTone: 'warning',
      eta: '12 دقيقة',
      destination: 'متجر الرياض',
      captain: 'غير مسند',
      notes: 'الطلب ينتظر قرار الإسناد قبل أول رنين.',
      ringLabel: 'لم يؤكد الوصول',
      actionHint: 'أعد الرنين ثم افحص التغطية.',
      arrivalTimeline: ['قيد الوصول', 'الرنين الأول لم يؤكد', 'بانتظار رد مالك القرار'],
      actionPlans: ['افتح الإسناد', 'أرسل رنينًا جديدًا', 'صعّد للمشرف إذا بقي بلا مالك'],
      suggestion: {
        label: 'افتح الإسناد فورًا',
        reason: 'الطلب بلا كابتن والتأخير يتزايد.',
        confidence: 'high',
        action: 'فتح الإسناد',
        secondary: 'تواصل مع الدعم',
        auditRequired: false,
      },
    },
    {
      id: 'LO-1077',
      fulfillmentMode: 'bthwani_delivery',
      status: 'بانتظار إثبات',
      statusTone: 'danger',
      eta: '18 دقيقة',
      destination: 'مقهى الشرق',
      captain: 'خالد',
      notes: 'النقل متوقف حتى يصل إثبات الاستلام.',
      ringLabel: 'محجوب',
      actionHint: 'اطلب إثباتًا قبل الإغلاق.',
      arrivalTimeline: ['وصل الطلب', 'الرنين محجوب', 'الإثبات مطلوب قبل الإغلاق'],
      actionPlans: ['اطلب الإثبات', 'افتح الدعم', 'احتفظ بالسجل'],
      suggestion: {
        label: 'اطلب الإثبات الآن',
        reason: 'الإثبات مفقود والحل مرهون بالدعم.',
        confidence: 'high',
        action: 'طلب الإثبات',
        secondary: 'فتح الدعم',
        auditRequired: true,
      },
    },
    {
      id: 'LO-1099',
      fulfillmentMode: 'bthwani_delivery',
      status: 'في الطريق',
      statusTone: 'best',
      eta: '7 دقائق',
      destination: 'مخبز الورد',
      captain: 'سلمان',
      notes: 'النافذة ما زالت آمنة والتسليم قريب.',
      ringLabel: 'تنبيه الوصول',
      actionHint: 'راقب ETA ولا تصعيد الآن.',
      arrivalTimeline: ['الكابتن في الطريق', 'النافذة ما زالت آمنة', 'التسليم قريب'],
      actionPlans: ['راقب ETA', 'لا تصعيد الآن', 'افتح التفاصيل إذا تأخر'],
      suggestion: {
        label: 'تابع وقت التسليم',
        reason: 'الطلب في المسار الطبيعي ولا يحتاج تدخلًا الآن.',
        confidence: 'medium',
        action: 'مراقبة ETA',
        secondary: 'فتح التفاصيل',
        auditRequired: false,
      },
    },
  ] as const,
} as const;

export const DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW = {
  summary: {
    waitingAssignment: 6,
    availableCaptains: 4,
    readyForPickup: 3,
    dispatchBlockers: 2,
  },
  rows: [
    {
      id: 'DA-2001',
      status: 'طلبات بانتظار الإسناد',
      statusTone: 'warning',
      captain: 'سعد م.',
      distance: '1.2 كم',
      pickupEta: '5 دقائق',
      dropoffEta: '19 دقيقة',
      confidence: 'ثقة عالية',
      blocker: 'لا يوجد',
      readyForPickup: 'جاهز لمسار الاستلام',
      recommendation: 'أسند إلى سعد م. الآن',
      note: 'الأقرب والمتاح حاليًا.',
      actionPlans: ['تأكيد الإسناد', 'مراقبة الاستلام', 'تخفيف ضغط التوزيع'],
    },
    {
      id: 'DA-2002',
      status: 'يحتاج إعادة إسناد',
      statusTone: 'brand',
      captain: 'محمد ع.',
      distance: '0.8 كم',
      pickupEta: '2 دقيقة',
      dropoffEta: '16 دقيقة',
      confidence: 'ثقة عالية',
      blocker: 'أول كابتن رفض',
      readyForPickup: 'جاهز بعد إعادة التعيين',
      recommendation: 'أعد الإسناد لمحمد ع.',
      note: 'بديل أفضل مع وقت استجابة أقل.',
      actionPlans: ['إعادة التعيين', 'تخطي الرفض الأول', 'تثبيت الكابتن البديل'],
    },
    {
      id: 'DA-2003',
      status: 'نقص كباتن',
      statusTone: 'danger',
      captain: 'لا يوجد',
      distance: '-',
      pickupEta: '-',
      dropoffEta: '-',
      confidence: 'ثقة منخفضة',
      blocker: 'نقص في التغطية',
      readyForPickup: 'يحتاج تصعيدًا',
      recommendation: 'صعّد وراقب الضغط',
      note: 'المنطقة تحتاج تدخلًا مباشرًا.',
      actionPlans: ['تصعيد فوري', 'تثبيت العجز', 'فتح الضغط'],
    },
  ] as const,
} as const;

export const SHEIN_PROXY_OPERATIONAL_PREVIEW = {
  summary: {
    intake_review: 5,
    quote_pending: 4,
    customer_approval: 3,
    batch_pending: 6,
    purchased: 8,
    inbound: 4,
    sorting: 3,
    ready_for_delivery: 2,
    captain_assignment: 2,
    delivered: 14,
    exception: 1,
  },
  requests: [
    {
      id: 'SPX-2048',
      customer: 'نورة الفهد',
      stage: 'intake_review' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['intake_review'],
      statusTone: 'warning',
      amount: 'ر.ي 1,280',
      shipping: 'ر.ي 96',
      fee: 'ر.ي 110',
      total: 'ر.ي 1,486',
      updated: 'قبل 10 دقائق',
      note: 'بانتظار مراجعة الرابط والتسعير من فريق العمليات.',
      nextStep: 'راجع الرابط وأدخل التسعير',
      owner: 'العمليات',
      sla: '24 ساعة',
    },
    {
      id: 'SPX-2051',
      customer: 'مريم خالد',
      stage: 'customer_approval' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['customer_approval'],
      statusTone: 'brand',
      amount: 'ر.ي 840',
      shipping: 'ر.ي 62',
      fee: 'ر.ي 88',
      total: 'ر.ي 990',
      updated: 'قبل 18 دقيقة',
      note: 'العرض أُرسل للعميل وينتظر الموافقة.',
      nextStep: 'تابع رد العميل',
      owner: 'العمليات',
      sla: '12 ساعة',
    },
    {
      id: 'SPX-2064',
      customer: 'سعيد حسن',
      stage: 'batch_pending' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['batch_pending'],
      statusTone: 'warning',
      amount: 'ر.ي 1,620',
      shipping: 'ر.ي 74',
      fee: 'ر.ي 125',
      total: 'ر.ي 1,819',
      updated: 'قبل 32 دقيقة',
      note: 'معتمد من العميل وبانتظار تجميع الدفعة.',
      nextStep: 'أضفه للدفعة القادمة',
      owner: 'المشتريات',
      sla: '48 ساعة',
    },
    {
      id: 'SPX-2072',
      customer: 'دانا صالح',
      stage: 'sorting' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['sorting'],
      statusTone: 'best',
      amount: 'ر.ي 1,010',
      shipping: 'ر.ي 55',
      fee: 'ر.ي 94',
      total: 'ر.ي 1,159',
      updated: 'قبل ساعة',
      note: 'تم استقبال الطلب وجاري الفرز والتعبئة.',
      nextStep: 'تحقق من المحتوى قبل الإغلاق',
      owner: 'المستودع',
      sla: '24 ساعة',
    },
    {
      id: 'SPX-2078',
      customer: 'لمى ناصر',
      stage: 'captain_assignment' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['captain_assignment'],
      statusTone: 'best',
      amount: 'ر.ي 690',
      shipping: 'ر.ي 45',
      fee: 'ر.ي 77',
      total: 'ر.ي 812',
      updated: 'قبل ساعتين',
      note: 'جاهز للتسليم النهائي — يحتاج إسناد كابتن.',
      nextStep: 'أسند للكابتن المتاح',
      owner: 'الإسناد',
      sla: '4 ساعات',
    },
    {
      id: 'SPX-2083',
      customer: 'عبدالله عمر',
      stage: 'exception' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['exception'],
      statusTone: 'danger',
      amount: 'ر.ي 560',
      shipping: 'ر.ي 41',
      fee: 'ر.ي 58',
      total: 'ر.ي 659',
      updated: 'قبل 3 ساعات',
      note: 'تعارض في التسعير — يحتاج قرار تصعيد.',
      nextStep: 'صعّد للمشرف وأغلق السجل',
      owner: 'المشرف',
      sla: 'عاجل',
    },
  ] as const,
} as const;

export const AWNAK_OPERATIONAL_PREVIEW = {
  summary: {
    intake: 4,
    quote_review: 3,
    dispatch_pending: 5,
    assigned: 6,
    in_progress: 7,
    proof_review: 3,
    completed: 18,
    cancelled: 2,
    escalated: 1,
  },
  rows: [
    {
      requestId: 'AWN-3101',
      type: 'أغراض شخصية',
      customer: 'نورة الفهد',
      stage: 'quote_review' as AwnakStage,
      status: AWNAK_STAGE_LABELS['quote_review'],
      assignmentStatus: 'معلّق',
      nextAction: 'راجع السعر وأرسل للعميل',
      risk: 'مرتفع',
      owner: 'فريق عونك',
      note: 'الطلب يحتاج تأكيد السعر قبل إسناد الكابتن.',
      statusTone: 'warning',
      sla: '2 ساعة',
      captainId: null,
    },
    {
      requestId: 'AWN-3104',
      type: 'طعام',
      customer: 'مريم خالد',
      stage: 'assigned' as AwnakStage,
      status: AWNAK_STAGE_LABELS['assigned'],
      assignmentStatus: 'مسند',
      nextAction: 'تابع تأكيد الاستلام',
      risk: 'متوسط',
      owner: 'المشرف المباشر',
      note: 'الكابتن في الطريق — انتظر تأكيد الاستلام.',
      statusTone: 'brand',
      sla: '30 دقيقة',
      captainId: 'CAP-0041',
    },
    {
      requestId: 'AWN-3108',
      type: 'وزن ثقيل',
      customer: 'سعيد حسن',
      stage: 'proof_review' as AwnakStage,
      status: AWNAK_STAGE_LABELS['proof_review'],
      assignmentStatus: 'مكتمل ميدانيًا',
      nextAction: 'راجع الإثبات وأغلق الطلب',
      risk: 'منخفض',
      owner: 'التشغيل',
      note: 'الكابتن أرسل إثبات التسليم — مراجعة سريعة قبل الإغلاق.',
      statusTone: 'best',
      sla: '1 ساعة',
      captainId: 'CAP-0019',
    },
    {
      requestId: 'AWN-3112',
      type: 'تورتة',
      customer: 'دانا صالح',
      stage: 'dispatch_pending' as AwnakStage,
      status: AWNAK_STAGE_LABELS['dispatch_pending'],
      assignmentStatus: 'بلا كابتن',
      nextAction: 'ابحث عن كابتن متاح',
      risk: 'مرتفع',
      owner: 'الإسناد',
      note: 'الطلب قيد العرض بلا كابتن — خطر تأخير.',
      statusTone: 'danger',
      sla: 'عاجل',
      captainId: null,
    },
    {
      requestId: 'AWN-3115',
      type: 'قابل للكسر',
      customer: 'خالد العلي',
      stage: 'escalated' as AwnakStage,
      status: AWNAK_STAGE_LABELS['escalated'],
      assignmentStatus: 'مصعّد',
      nextAction: 'صعّد للمشرف وحدد مسار الحل',
      risk: 'مرتفع',
      owner: 'المشرف',
      note: 'الكابتن أبلغ عن مشكلة في التسليم — يحتاج قرار تصعيد.',
      statusTone: 'danger',
      sla: 'عاجل',
      captainId: 'CAP-0033',
    },
  ] as const,
} as const;

export const AREA_CAPACITY_OPERATIONAL_PREVIEW = {
  summary: {
    zoneLoad: 'أحمال مرتفعة',
    protectedZones: 2,
    freeZones: 1,
    surgeBonus: 'حافز المنطقة',
    recommendation: 'فعّل حافز المنطقة الآن',
  },
  zones: [
    {
      id: 'AR-01',
      zone: 'شمال الرياض',
      zoneLoad: 'مرتفع',
      protectedZones: '2',
      freeZones: '0',
      surgeBonus: 'حافز مفعل',
      reduceRadius: 'تقليل النطاق',
      temporaryStop: 'إيقاف مؤقت متاح',
      moveCapacity: 'نقل السعة',
      recommendation: 'فعّل حافز المنطقة الآن',
      note: 'العجز يحتاج تدخلًا فوريًا.',
      statusTone: 'danger',
    },
    {
      id: 'AR-02',
      zone: 'شرق الرياض',
      zoneLoad: 'متصاعد',
      protectedZones: '1',
      freeZones: '1',
      surgeBonus: 'حافز جزئي',
      reduceRadius: 'تقليل نصف القطر',
      temporaryStop: 'متاح للحظات',
      moveCapacity: 'نقل كباتن',
      recommendation: 'قلّص النطاق مؤقتًا',
      note: 'الضغط سيزيد خلال 15 دقيقة.',
      statusTone: 'warning',
    },
    {
      id: 'AR-03',
      zone: 'وسط الرياض',
      zoneLoad: 'متوازن',
      protectedZones: '3',
      freeZones: '2',
      surgeBonus: 'لا حاجة',
      reduceRadius: 'غير مطلوب',
      temporaryStop: 'غير مطلوب',
      moveCapacity: 'نقل بضع كباتن',
      recommendation: 'لا تدخل مطلوب',
      note: 'التغطية مستقرة والفائض واضح.',
      statusTone: 'best',
    },
    {
      id: 'AR-04',
      zone: 'جنوب الرياض',
      zoneLoad: 'فائض',
      protectedZones: '2',
      freeZones: '4',
      surgeBonus: 'احتياطي',
      reduceRadius: 'لا حاجة',
      temporaryStop: 'لا حاجة',
      moveCapacity: 'انقل الكباتن للشمال',
      recommendation: 'انقل السعة للمناطق المضغوطة',
      note: 'يمكن دعم الشمال مباشرة من هنا.',
      statusTone: 'brand',
    },
  ] as const,
} as const;

export const EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW = {
  summary: {
    open: 17,
    escalate: 4,
    resolve: 12,
    close: 29,
  },
  exceptions: [
    {
      id: 'EX-4101',
      type: 'تأخير غير مبرر',
      lifecycleState: 'reassignment_required',
      affectedSurface: 'app-captain',
      ownerQueue: 'dispatch-assignment',
      severity: 'عالي',
      currentOwner: 'الإسناد',
      startTime: 'منذ 15 دقيقة',
      lastAction: 'تنبيه للكابتن',
      suggestedAction: 'إعادة الإسناد',
      resolutionPath: 'حل',
      routeHint: '/operations?workspace=dispatch-assignment&orderId=EX-4101',
      evidenceNeeded: true,
      onDemandDetailPolicy: 'evidence-on-open',
      note: 'التأخير ما زال مفتوحًا بلا مالك واضح.',
      statusTone: 'warning',
    },
    {
      id: 'EX-4102',
      type: 'تعطل مركبة كابتن',
      lifecycleState: 'captain_unavailable',
      affectedSurface: 'app-captain',
      ownerQueue: 'audit-support-sla',
      severity: 'حرج',
      currentOwner: 'الدعم الفني',
      startTime: 'منذ 8 دقائق',
      lastAction: 'قيد التواصل',
      suggestedAction: 'إسناد بديل',
      resolutionPath: 'تصعيد',
      routeHint: '/operations?workspace=audit-support-sla&orderId=EX-4102',
      evidenceNeeded: true,
      onDemandDetailPolicy: 'evidence-on-open',
      note: 'الحل يحتاج تدخلًا مباشرًا وسريعًا.',
      statusTone: 'danger',
    },
    {
      id: 'EX-4103',
      type: 'إغلاق متجر مفاجئ',
      lifecycleState: 'support_exception',
      affectedSurface: 'app-partner',
      ownerQueue: 'partner-stores',
      severity: 'متوسط',
      currentOwner: 'إدارة الشركاء',
      startTime: 'منذ 25 دقيقة',
      lastAction: 'إيقاف الاستقبال',
      suggestedAction: 'تثبيت الإغلاق',
      resolutionPath: 'إغلاق',
      routeHint: '/operations?workspace=partner-stores&orderId=EX-4103',
      evidenceNeeded: false,
      onDemandDetailPolicy: 'detail-on-open',
      note: 'الاستقبال متوقف ولا حاجة لتكرار الإجراء.',
      statusTone: 'best',
    },
  ] as const,
} as const;

export const FULFILLMENT_MODE_ORDER_QUEUES: Record<DshFulfillmentOperationalMode, DshOperationsOrderRow[]> = {
  bthwani_delivery: [
    { id: 'BD-0101', storeName: 'شاورما هليل', customerName: 'نوف العتيبي', statusLabel: 'في انتظار كابتن', statusTone: 'warning', fulfillmentMode: 'bthwani_delivery', nextAction: 'تعيين كابتن', slaLabel: 'SLA: 8 دقائق' },
    { id: 'BD-0102', storeName: 'برغر لاب', customerName: 'خالد الزهراني', statusLabel: 'الكابتن في الطريق', statusTone: 'neutral', fulfillmentMode: 'bthwani_delivery', nextAction: 'متابعة التسليم', slaLabel: 'SLA: 12 دقيقة' },
    { id: 'BD-0103', storeName: 'مطعم القلعة', customerName: 'ريم الشهراني', statusLabel: 'تأخير', statusTone: 'danger', fulfillmentMode: 'bthwani_delivery', nextAction: 'تصعيد', slaLabel: 'SLA: خرق وشيك' },
  ],
  partner_delivery: [
    { id: 'PD-0201', storeName: 'دانكن دونتس', customerName: 'محمد السالم', statusLabel: 'في انتظار موصل الشريك', statusTone: 'warning', fulfillmentMode: 'partner_delivery', nextAction: 'تنبيه الشريك', slaLabel: 'SLA: 15 دقيقة' },
    { id: 'PD-0202', storeName: 'بارنز كافيه', customerName: 'سارة القحطاني', statusLabel: 'موصل الشريك في الطريق', statusTone: 'neutral', fulfillmentMode: 'partner_delivery', nextAction: 'متابعة الشريك', slaLabel: 'SLA: 20 دقيقة' },
  ],
  pickup: [
    { id: 'PK-0301', storeName: 'كافيه آرت', customerName: 'أحمد الدوسري', statusLabel: 'الطلب جاهز', statusTone: 'success', fulfillmentMode: 'pickup', nextAction: 'إشعار العميل', slaLabel: 'SLA: 10 دقائق' },
    { id: 'PK-0302', storeName: 'شيك هاوس', customerName: 'عبدالله المطيري', statusLabel: 'بانتظار التحضير', statusTone: 'warning', fulfillmentMode: 'pickup', nextAction: 'متابعة الجاهزية', slaLabel: 'SLA: 8 دقائق' },
  ],
};

export const AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW = {
  summary: {
    manualAudits: 12,
    supportTickets: 6,
    slaRisk: 5,
    evidenceComplete: 84,
  },
  audits: [
    {
      id: 'AU-7001',
      who: 'المشرف',
      why: 'إسناد يدوي بعد تأخر الكابتن',
      when: 'منذ 10 دقائق',
      permissionResult: 'موافق',
      slaBreachReason: 'تأخر الاستلام',
      supportTicketLink: 'تذكرة-51',
      proofRequired: 'صورة إيصال',
      evidenceState: 'مفتوح',
      resolutionPath: 'حل',
      note: 'يحتاج إغلاقًا بعد حفظ الإثبات.',
      statusTone: 'danger',
    },
    {
      id: 'AU-7002',
      who: 'الدعم',
      why: 'شكوى عميل حي',
      when: 'منذ 22 دقيقة',
      permissionResult: 'قيد الموافقة',
      slaBreachReason: 'نقص الطلب',
      supportTicketLink: 'تذكرة-52',
      proofRequired: 'رسالة من المتجر',
      evidenceState: 'يحتاج إثبات',
      resolutionPath: 'تصعيد',
      note: 'الربط بالدعم هو الخطوة التالية.',
      statusTone: 'warning',
    },
    {
      id: 'AU-7003',
      who: 'العمليات',
      why: 'تعويض مباشر',
      when: 'منذ ساعة',
      permissionResult: 'معتمد',
      slaBreachReason: 'تأخير متجر',
      supportTicketLink: 'تذكرة-53',
      proofRequired: 'حزمة إثبات كاملة',
      evidenceState: 'مكتمل',
      resolutionPath: 'إغلاق',
      note: 'يمكن الإغلاق دون المزيد من الخطوات.',
      statusTone: 'best',
    },
  ] as const,
} as const;

// ─── P0-10: Service health monitoring ────────────────────────────────────────
// Partner readiness, catalog blockers, serviceability, SLA risk, captain coverage.
// Each item routes to its owning workspace — no data duplication.

export const DSH_SERVICE_HEALTH_PREVIEW: ReadonlyArray<DshOpsMonitoringItem> = [
  {
    entityId: 'SH-001',
    entityLabel: 'جاهزية الشركاء',
    lifecycleState: 'partner_intake',
    affectedSurface: 'app-partner',
    ownerQueue: 'partner-stores',
    status: '3 متاجر غير جاهزة',
    statusTone: 'warning',
    primaryAction: 'فتح المتاجر',
    secondaryAction: 'تفاصيل الجاهزية',
    routeHint: '?workspace=partner-stores',
    evidenceNeeded: false,
    onDemandDetailPolicy: 'summary-only',
  },
  {
    entityId: 'SH-002',
    entityLabel: 'معوّقات نشر الكتالوج',
    lifecycleState: 'item_unavailable',
    affectedSurface: 'control-panel',
    ownerQueue: 'catalogs',
    status: '5 منتجات معلّقة',
    statusTone: 'warning',
    primaryAction: 'فتح الكتالوجات',
    routeHint: '/catalogs',
    evidenceNeeded: true,
    onDemandDetailPolicy: 'detail-on-open',
  },
  {
    entityId: 'SH-003',
    entityLabel: 'قابلية الخدمة',
    lifecycleState: 'captain_unavailable',
    affectedSurface: 'control-panel',
    ownerQueue: 'area-capacity',
    status: 'منطقتان خارج النطاق',
    statusTone: 'danger',
    primaryAction: 'فتح المناطق',
    secondaryAction: 'عرض الخريطة',
    routeHint: '?workspace=area-capacity',
    evidenceNeeded: false,
    onDemandDetailPolicy: 'summary-only',
  },
  {
    entityId: 'SH-004',
    entityLabel: 'خطر SLA',
    lifecycleState: 'support_exception',
    affectedSurface: 'control-panel',
    ownerQueue: 'audit-support-sla',
    status: '5 طلبات في خطر خرق SLA',
    statusTone: 'danger',
    primaryAction: 'فتح التدقيق',
    routeHint: '?workspace=audit-support-sla',
    evidenceNeeded: true,
    onDemandDetailPolicy: 'evidence-on-open',
    auditEntryId: 'AU-7001',
  },
  {
    entityId: 'SH-005',
    entityLabel: 'تغطية الكباتن',
    lifecycleState: 'captain_assignment',
    affectedSurface: 'app-captain',
    ownerQueue: 'dispatch-assignment',
    status: '4 كباتن متاحون',
    statusTone: 'success',
    primaryAction: 'فتح الإسناد',
    secondaryAction: 'عرض الخريطة',
    routeHint: '?workspace=dispatch-assignment',
    evidenceNeeded: false,
    onDemandDetailPolicy: 'summary-only',
  },
];

export const DSH_WLT_FINANCE_ALERTS_PREVIEW: ReadonlyArray<DshWltFinanceAlert> = [
  {
    alertId: 'WLT-FA-01',
    domain: 'payment',
    label: 'مدفوعات معلّقة',
    count: 4,
    statusTone: 'warning',
    wltBridgeNote: 'awaiting_wlt_payment — عرض فقط، الإجراء في WLT',
    routeHint: '/finance',
  },
  {
    alertId: 'WLT-FA-02',
    domain: 'refund',
    label: 'طلبات استرداد معلّقة',
    count: 2,
    statusTone: 'warning',
    wltBridgeNote: 'refund_pending_wlt — عرض فقط، لا mutation داخل DSH',
    routeHint: '/finance',
  },
  {
    alertId: 'WLT-FA-03',
    domain: 'payout',
    label: 'مدفوعات كباتن معلّقة',
    count: 7,
    statusTone: 'neutral',
    wltBridgeNote: 'captain_payout — WLT يملك الحقيقة والتنفيذ',
    routeHint: '/finance',
  },
];

export function selectDshClientOrdersPreview(customerId?: string) {
  void customerId;
  return LIVE_ORDERS_OPERATIONAL_PREVIEW.rows;
}

export function selectDshPartnerOrdersPreview(storeOrBranchId?: string) {
  void storeOrBranchId;
  return LIVE_ORDERS_OPERATIONAL_PREVIEW.rows;
}

export function selectDshPartnerOperationalPreview(storeOrBranchId?: string) {
  void storeOrBranchId;
  return {
    orderAlerts: LIVE_ORDERS_OPERATIONAL_PREVIEW.rows,
    conversations: DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW.rows,
    exceptions: EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW,
  };
}

export function selectDshCaptainAssignmentsPreview(captainId?: string) {
  void captainId;
  return DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW.rows;
}

export function selectDshCaptainOrderPreview(orderId: string) {
  return LIVE_ORDERS_OPERATIONAL_PREVIEW.rows.find((order) => order.id === orderId) ?? null;
}

export function selectDshControlPanelOperationsPreview() {
  return {
    pulse: OPERATIONS_PULSE_METRICS,
    liveOrders: LIVE_ORDERS_OPERATIONAL_PREVIEW,
    dispatch: DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW,
    fulfillmentQueues: FULFILLMENT_MODE_ORDER_QUEUES,
    exceptions: EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW,
  };
}

// -----------------------------------------------------------------------------
// Control panel ops approval queue preview
// UI_PREVIEW_ONLY — pending approval orders for the ops approval panel.
// Authority: control-panel/operations LiveOrdersScreen → OpsOrderDetailPanel.
// No backend call, no claim of runtime truth, no mutation.
// -----------------------------------------------------------------------------

/** Ops approval order — extends DshOperationsOrderDetail with a fulfillment mode. */
export type DshOpsApprovalOrder = DshOperationsOrderDetail & {
  readonly fulfillmentMode: DshFulfillmentOperationalMode;
};

export const PENDING_APPROVAL_ORDERS: readonly DshOpsApprovalOrder[] = [
  {
    id: 'PA-0081',
    fulfillmentMode: 'bthwani_delivery',
    customerName: 'أحمد محمد',
    customerPhone: '770000000',
    dropoffAddress: 'العليا، طريق الملك فهد',
    pickupAddress: 'رياض بارك، البوابة 2',
    storeName: 'بيك إن بريستو',
    paymentMethod: 'عند الاستلام',
    paymentStatus: 'معلق — لم يتم تحصيله بعد',
    cartItems: [
      { title: 'دجاج فحم تركي', qty: 1, priceLabel: '3,000 ر.ي' },
      { title: 'كريسبي رول', qty: 2, priceLabel: '1,500 ر.ي' },
    ],
    subtotalLabel: '6,000 ر.ي',
    deliveryLabel: '950 ر.ي',
    totalLabel: '6,950 ر.ي',
    customerNote: 'سلّم عند الباب الجانبي.',
    customerInstructions: 'اتصل قبل الوصول بـ 5 دقائق.',
    couponCode: '',
    eventLog: [
      { status: 'تم إنشاء الطلب', actor: 'العميل', timestamp: '2026-05-16T10:10:00+03:00' },
      { status: 'قيد مراجعة العمليات', actor: 'النظام', timestamp: '2026-05-16T10:10:30+03:00' },
    ],
  },
  {
    id: 'PA-0082',
    fulfillmentMode: 'pickup',
    customerName: 'سارة خالد',
    customerPhone: '771111111',
    dropoffAddress: '',
    pickupAddress: 'الواحة مول، المدخل الرئيسي',
    storeName: 'برغر لاب',
    paymentMethod: 'محفظة WLT',
    paymentStatus: 'تجريبي — مسجل محليًا',
    cartItems: [
      { title: 'برغر لاب كلاسيك', qty: 2, priceLabel: '2,500 ر.ي' },
      { title: 'بطاطس كبير', qty: 1, priceLabel: '800 ر.ي' },
    ],
    subtotalLabel: '5,800 ر.ي',
    deliveryLabel: '0 ر.ي',
    totalLabel: '5,800 ر.ي',
    customerNote: 'سأصل خلال 15 دقيقة.',
    customerInstructions: 'أبرز رقم الطلب للمتجر عند الاستلام.',
    couponCode: 'DSH10',
    eventLog: [
      { status: 'تم إنشاء الطلب', actor: 'العميل', timestamp: '2026-05-16T10:15:00+03:00' },
      { status: 'قيد مراجعة العمليات', actor: 'النظام', timestamp: '2026-05-16T10:15:20+03:00' },
    ],
  },
] as const;

/** Returns all pending approval orders for the ops approval queue panel. */
export function getDshOpsApprovalQueuePreview(): readonly DshOpsApprovalOrder[] {
  return PENDING_APPROVAL_ORDERS;
}

/** Returns a single pending approval order by id, or null if not found. */
export function getDshOpsApprovalOrderById(orderId: string): DshOpsApprovalOrder | null {
  return PENDING_APPROVAL_ORDERS.find((o) => o.id === orderId) ?? null;
}
