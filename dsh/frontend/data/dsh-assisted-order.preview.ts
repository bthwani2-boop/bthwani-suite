import type { DshControlPanelSectionId } from '../shared/dsh-governance.map';
import {
  DSH_DELIVERY_MODE_DEFINITIONS,
  getDshDeliveryModeDefinition,
  type DshFulfillmentDeliveryMode,
} from '../shared/dsh-delivery-mode.model';
import type { DshOnDemandPolicy, DshSurfaceId } from '../shared/dsh-flow-registry';
import {
  getDshSignalActorRoute,
  type DshSignalEventKind,
  type DshSignalPriority,
} from '../shared/dsh-signal-layer.model';

export type DshPreviewPlaceholderStatus =
  | 'ACCEPTED_PREVIEW_LABEL'
  | 'BLOCKED_BY_CONTRACT'
  | 'BLOCKED_BY_WLT'
  | 'MUST_REPLACE_WITH_PREVIEW_UI'
  | 'DEAD_PLACEHOLDER_REMOVE';

export type DshLookupFieldId = 'phone' | 'orderId' | 'customerId' | 'ticketId';

export type DshLookupInputPreview = {
  readonly key: DshLookupFieldId;
  readonly label: string;
  readonly value: string;
  readonly summaryFirst: true;
};

export type DshVerificationStatus = 'required' | 'verified' | 'blocked';

export type DshVerificationStepPreview = {
  readonly stepId: string;
  readonly label: string;
  readonly completed: boolean;
};

export type DshSignalRoutePreview = {
  readonly signalKind: DshSignalEventKind;
  readonly routeId: string;
  readonly auditRequired: boolean;
  readonly priority: DshSignalPriority;
  readonly priorityLabel: string;
};

export type DshRouteHintedAction = {
  readonly actionId: string;
  readonly label: string;
  readonly routeHint: string;
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly routeId?: string;
  readonly readOnly?: boolean;
  readonly auditRequired?: boolean;
  readonly reasonRequired?: boolean;
};

export type DshReadOnlyFinanceVisibility = {
  readonly paymentVisibility: string;
  readonly refundVisibility: string;
  readonly settlementVisibility?: string;
  readonly readOnly: true;
  readonly mutationForbidden: true;
  readonly calculationTruthOwner: 'WLT';
  readonly routeHint: string;
  readonly onDemandPolicy: 'finance-preview-only';
  readonly placeholderClassification: DshPreviewPlaceholderStatus;
};

export type DshGlobalControlLink = DshRouteHintedAction & {
  readonly surfaceId: DshSurfaceId;
  readonly sectionId: DshControlPanelSectionId;
};

export type DshAssistedOrderIdentityStatus = DshVerificationStatus;

export type DshAssistedOrderStage =
  | 'identity-check'
  | 'basket-rebuild'
  | 'partner-confirmation'
  | 'wlt-visibility'
  | 'ready-to-submit';

export type DshAssistedOrderCartItemStatus = 'active' | 'substitute' | 'unavailable';

export type DshAssistedOrderCartItem = {
  readonly sku: string;
  readonly name: string;
  readonly quantity: number;
  readonly published: true;
  readonly status: DshAssistedOrderCartItemStatus;
  readonly note: string;
};

export type DshAssistedOrderDeliveryModeOption = {
  readonly modeId: DshFulfillmentDeliveryMode;
  readonly label: string;
  readonly requiresDispatch: boolean;
  readonly requiresCaptain: boolean;
  readonly supportFallback: string;
};

export type DshAssistedOrderPreview = {
  readonly deskId: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly source: 'manual_call_intake' | 'customer_360_followup';
  readonly orderId?: string;
  readonly ticketId?: string;
  readonly identityStatus: DshAssistedOrderIdentityStatus;
  readonly activeStage: DshAssistedOrderStage;
  readonly basketSummary: string;
  readonly auditFlags: readonly string[];
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly wltBoundary: string;
  readonly nextAction: string;
  readonly crossSurfaceLinks: readonly DshGlobalControlLink[];
  readonly lookupPanel: {
    readonly inputs: readonly DshLookupInputPreview[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly identityVerification: {
    readonly verificationStatus: DshVerificationStatus;
    readonly verificationSteps: readonly DshVerificationStepPreview[];
    readonly sensitiveFieldsLocked: readonly string[];
    readonly forbiddenActionsBeforeVerification: readonly string[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly cartBuilderPreview: {
    readonly publishedProductsOnly: true;
    readonly items: readonly DshAssistedOrderCartItem[];
    readonly addItemPreview: string;
    readonly removeItemPreview: string;
    readonly replaceItemPreview: string;
    readonly substituteItemPreview: string;
    readonly unavailableItemHandling: string;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly deliveryModeSelector: {
    readonly selectedMode: DshFulfillmentDeliveryMode;
    readonly options: readonly DshAssistedOrderDeliveryModeOption[];
    readonly selectedModeSummary: string;
    readonly forbiddenLifecycleStates: readonly string[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly serviceabilitySummary: {
    readonly zoneLabel: string;
    readonly serviceabilityStatus: 'serviceable' | 'blocked';
    readonly blockedReason?: string;
    readonly fallbackAction: string;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly wltReadOnlyHandoff: DshReadOnlyFinanceVisibility;
  readonly auditReason: {
    readonly reasonRequired: true;
    readonly auditRequired: true;
    readonly operatorNote: string;
    readonly reasonLabel: string;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly submitDraftPreview: {
    readonly previewOnly: true;
    readonly noBackendCall: true;
    readonly noOrderCreationClaim: true;
    readonly previewState: 'ready_for_preview' | 'blocked_by_identity' | 'blocked_by_serviceability';
    readonly nextAction: string;
    readonly signal: DshSignalRoutePreview;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
};

function translateSignalPriority(priority: DshSignalPriority): string {
  if (priority === 'urgent') {
    return 'عاجل';
  }

  if (priority === 'important') {
    return 'مهم';
  }

  return 'اعتيادي';
}

export function buildDshSignalRoutePreview(signalKind: DshSignalEventKind): DshSignalRoutePreview {
  const route = getDshSignalActorRoute(signalKind);
  return {
    signalKind,
    routeId: route?.routeId ?? 'cp/operations',
    auditRequired: route?.auditRequired ?? false,
    priority: route?.priority ?? 'normal',
    priorityLabel: translateSignalPriority(route?.priority ?? 'normal'),
  };
}

function buildLookupInputs(values: {
  readonly phone: string;
  readonly orderId?: string;
  readonly customerId: string;
  readonly ticketId?: string;
}): readonly DshLookupInputPreview[] {
  return [
    { key: 'phone', label: 'phone', value: values.phone, summaryFirst: true },
    { key: 'orderId', label: 'orderId', value: values.orderId ?? '—', summaryFirst: true },
    { key: 'customerId', label: 'customerId', value: values.customerId, summaryFirst: true },
    { key: 'ticketId', label: 'ticketId', value: values.ticketId ?? '—', summaryFirst: true },
  ] as const;
}

function buildDeliveryModeOptions(): readonly DshAssistedOrderDeliveryModeOption[] {
  return DSH_DELIVERY_MODE_DEFINITIONS.map((definition) => ({
    modeId: definition.modeId,
    label: definition.label,
    requiresDispatch: definition.requiresDispatch,
    requiresCaptain: definition.requiresCaptain,
    supportFallback: definition.supportFallback,
  }));
}

function buildDeliveryModeSummary(modeId: DshFulfillmentDeliveryMode): {
  readonly selectedMode: DshFulfillmentDeliveryMode;
  readonly options: readonly DshAssistedOrderDeliveryModeOption[];
  readonly selectedModeSummary: string;
  readonly forbiddenLifecycleStates: readonly string[];
  readonly previewClassification: DshPreviewPlaceholderStatus;
} {
  const mode = getDshDeliveryModeDefinition(modeId);
  return {
    selectedMode: modeId,
    options: buildDeliveryModeOptions(),
    selectedModeSummary: `${mode.label} · ${mode.controlPanelDispatchBehavior}`,
    forbiddenLifecycleStates: ['delivered', 'cancelled', 'refund_pending_wlt', 'settlement_ready_wlt'],
    previewClassification: 'ACCEPTED_PREVIEW_LABEL',
  };
}

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
    allowedActions: ['إضافة عنصر منشور', 'حذف عنصر', 'استبدال عنصر غير متاح', 'فتح WLT visibility للقراءة فقط'],
    forbiddenActions: ['تجاوز التحقق من الهوية', 'تنفيذ refund محلي', 'اعتماد حقيقة حسابية داخل DSH'],
    wltBoundary: 'WLT يظهر للقراءة فقط: الدفع والاسترداد والتسوية تبقى خارج Assisted Order.',
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
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'finance-preview-only',
        readOnly: true,
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
      inputs: buildLookupInputs({
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
      unavailableItemHandling: 'عند نفاد العنصر: إما بديل منشور أو remove item مع reason واضح، وإلا افتح Order Rescue.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    deliveryModeSelector: buildDeliveryModeSummary('bthwani_delivery'),
    serviceabilitySummary: {
      zoneLabel: 'Riyadh / Al Yasmin',
      serviceabilityStatus: 'serviceable',
      fallbackAction: 'إن تعذر الكابتن لاحقًا افتح Dispatch أو Rescue بدل تبديل الحقائق المالية.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltReadOnlyHandoff: {
      paymentVisibility: 'Paid via WLT wallet snapshot — read-only.',
      refundVisibility: 'No active refund mutation from DSH.',
      settlementVisibility: 'Partner settlement remains WLT-owned and hidden from mutation.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
      onDemandPolicy: 'finance-preview-only',
      placeholderClassification: 'BLOCKED_BY_WLT',
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
    wltBoundary: 'رؤية WLT المالية متاحة كمرجع فقط عند فتحها وبعد اكتمال التحقق.',
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
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'finance-preview-only',
        readOnly: true,
      },
    ],
    lookupPanel: {
      inputs: buildLookupInputs({
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
      replaceItemPreview: 'replace/substitute يتطلب customer visibility note.',
      substituteItemPreview: 'البديل يظهر كتوصية لا كتأكيد نهائي.',
      unavailableItemHandling: 'إن لم يتوفر بديل منشور، يحال الطلب إلى Order Rescue بدل ادعاء إنشاء جديد.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    deliveryModeSelector: buildDeliveryModeSummary('pickup'),
    serviceabilitySummary: {
      zoneLabel: 'Jeddah / Al Rawdah',
      serviceabilityStatus: 'blocked',
      blockedReason: 'pickup only until identity verification and service window confirmation complete.',
      fallbackAction: 'إبقِ الوضع pickup أو افتح Order Rescue لتغيير القرار التشغيلي لاحقًا.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltReadOnlyHandoff: {
      paymentVisibility: 'Payment review hidden until verification completes.',
      refundVisibility: 'Refund visibility stays read-only and blocked pre-verification.',
      settlementVisibility: 'No settlement context exposed in Assisted Order.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
      onDemandPolicy: 'finance-preview-only',
      placeholderClassification: 'BLOCKED_BY_WLT',
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
