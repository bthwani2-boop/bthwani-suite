import type { DshOnDemandPolicy } from '../shared/dsh-flow-registry';
import { getDshSectionAuditPolicy } from '../shared/dsh-role-permission.model';
import {
  buildDshSignalRoutePreview,
  type DshGlobalControlLink,
  type DshLookupInputPreview,
  type DshPreviewPlaceholderStatus,
  type DshRouteHintedAction,
  type DshSignalRoutePreview,
  type DshVerificationStatus,
  type DshVerificationStepPreview,
} from './dsh-assisted-order.preview';

export type DshCallIntakeReason =
  | 'late_order'
  | 'missing_item'
  | 'wrong_item'
  | 'payment_refund_visibility'
  | 'delivery_failed'
  | 'captain_behavior'
  | 'partner_behavior'
  | 'app_issue'
  | 'assisted_order_request'
  | 'other';

export type DshCallIntakeCloseOutcome =
  | 'resolved'
  | 'escalated'
  | 'follow_up_required'
  | 'transferred_to_ops'
  | 'duplicate'
  | 'blocked_identity';

export type DshCallIntakeVerificationStep = DshVerificationStepPreview;

export type DshCallIntakePreview = {
  readonly intakeId: string;
  readonly source: 'external_phone_manual';
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly verificationSteps: readonly DshCallIntakeVerificationStep[];
  readonly sensitiveFieldsLocked: readonly string[];
  readonly orderContext?: string;
  readonly ticketContext?: string;
  readonly issueSummary: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly nextAction: string;
  readonly quickActions: readonly DshGlobalControlLink[];
  readonly lookupPanel: {
    readonly inputs: readonly DshLookupInputPreview[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly callReasonSelector: {
    readonly selectedReason: DshCallIntakeReason;
    readonly options: readonly DshCallIntakeReason[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly identityVerificationResult: {
    readonly verificationStatus: DshVerificationStatus;
    readonly verificationSteps: readonly DshCallIntakeVerificationStep[];
    readonly sensitiveFieldsLocked: readonly string[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly ticketPreview: {
    readonly mode: 'create' | 'link';
    readonly ticketId: string;
    readonly summary: string;
    readonly routeHint: string;
    readonly auditRequired: boolean;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly transferContextToOperations: readonly DshRouteHintedAction[];
  readonly closeCallOutcome: {
    readonly outcome: DshCallIntakeCloseOutcome;
    readonly summary: string;
    readonly auditRequired: boolean;
    readonly signal: DshSignalRoutePreview;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly auditRequired: boolean;
};

const CALL_REASON_OPTIONS: readonly DshCallIntakeReason[] = [
  'late_order',
  'missing_item',
  'wrong_item',
  'payment_refund_visibility',
  'delivery_failed',
  'captain_behavior',
  'partner_behavior',
  'app_issue',
  'assisted_order_request',
  'other',
] as const;

const manualCallAuditRequired = getDshSectionAuditPolicy('support-escalation');

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

export const DSH_CALL_INTAKE_PREVIEW: readonly DshCallIntakePreview[] = [
  {
    intakeId: 'call-9021',
    source: 'external_phone_manual',
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    verificationSteps: [
      { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: true },
      { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: true },
      { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: true },
    ],
    sensitiveFieldsLocked: ['العنوان الكامل', 'عرض WLT المالي', 'أوامر الاسترداد'],
    orderContext: 'ORD-1184',
    ticketContext: 'TKT-1184',
    issueSummary: 'العميل يريد assisted order request من مكالمة خارجية بعد تعثر التطبيق.',
    allowedActions: ['تثبيت المصدر اليدوي', 'فتح Customer 360', 'ربط أو إنشاء ticket preview', 'تحويل إلى العمليات'],
    forbiddenActions: ['تغيير source', 'إظهار الحقول الحساسة قبل التحقق', 'بدء refund أو settlement'],
    onDemandPolicy: 'detail-on-open',
    nextAction: 'أنشئ ticket preview ثم حوّل الحالة إلى Assisted Order Desk مع السياق الكامل.',
    quickActions: [
      {
        actionId: 'customer-360',
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/support/customer-360',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'assisted-order',
        label: 'Assisted Order Desk',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
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
    callReasonSelector: {
      selectedReason: 'assisted_order_request',
      options: CALL_REASON_OPTIONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    identityVerificationResult: {
      verificationStatus: 'verified',
      verificationSteps: [
        { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: true },
        { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: true },
        { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: true },
      ],
      sensitiveFieldsLocked: ['إبقاء WLT في وضع القراءة فقط حتى بعد التحقق'],
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    ticketPreview: {
      mode: 'create',
      ticketId: 'TKT-1184',
      summary: 'Create ticket preview only: linked to order/customer and flagged for ops handoff.',
      routeHint: '/support?workspace=queue&ticketId=TKT-1184',
      auditRequired: true,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    transferContextToOperations: [
      {
        actionId: 'transfer-assisted-order',
        label: 'to assisted-order-desk',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-order-rescue',
        label: 'to order-rescue',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-support-escalation',
        label: 'to support escalation',
        routeHint: '/support?workspace=escalation&ticketId=TKT-1184',
        routeId: 'cp/support/escalation',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
    ],
    closeCallOutcome: {
      outcome: 'transferred_to_ops',
      summary: 'المكالمة انتهت بتحويل واضح إلى العمليات بعد تحقق الهوية وتثبيت السبب.',
      auditRequired: true,
      signal: buildDshSignalRoutePreview('manual_call_intake_requested'),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    auditRequired: manualCallAuditRequired,
  },
  {
    intakeId: 'call-4410',
    source: 'external_phone_manual',
    customerId: 'cus-9910',
    customerName: 'سارة الحربي',
    maskedPhone: '05*******92',
    verificationSteps: [
      { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: false },
      { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: false },
      { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
    ],
    sensitiveFieldsLocked: ['العنوان الكامل', 'طريقة الدفع', 'رؤية WLT'],
    ticketContext: 'TKT-4410',
    issueSummary: 'المتصل يريد payment/refund visibility بلا تحقق مكتمل.',
    allowedActions: ['طلب تحقق إضافي', 'ربط ticket موجود', 'تصعيد للدعم عند الهوية المحجوبة'],
    forbiddenActions: ['إظهار قرار الاسترداد', 'بدء assisted order', 'افتراض incoming call popup'],
    onDemandPolicy: 'detail-on-open',
    nextAction: 'ابقِ الحقول الحساسة محجوبة واربط المكالمة بتذكرة الدعم بدلاً من أي handoff تشغيلي مباشر.',
    quickActions: [
      {
        actionId: 'support-ticket',
        label: 'Support ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-4410&callId=call-4410',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'wlt-visibility',
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&customerId=cus-9910',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'finance-preview-only',
        readOnly: true,
      },
    ],
    lookupPanel: {
      inputs: buildLookupInputs({
        phone: '05*******92',
        customerId: 'cus-9910',
        ticketId: 'TKT-4410',
      }),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    callReasonSelector: {
      selectedReason: 'payment_refund_visibility',
      options: CALL_REASON_OPTIONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    identityVerificationResult: {
      verificationStatus: 'blocked',
      verificationSteps: [
        { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: false },
        { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: false },
        { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
      ],
      sensitiveFieldsLocked: ['payment visibility', 'refund visibility', 'address details'],
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    ticketPreview: {
      mode: 'link',
      ticketId: 'TKT-4410',
      summary: 'Link existing ticket preview only and keep finance as WLT read-only visibility.',
      routeHint: '/support?workspace=queue&ticketId=TKT-4410',
      auditRequired: true,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    transferContextToOperations: [
      {
        actionId: 'transfer-assisted-order-blocked',
        label: 'to assisted-order-desk',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-9910&ticketId=TKT-4410&callId=call-4410',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-order-rescue-blocked',
        label: 'to order-rescue',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-9910&ticketId=TKT-4410&callId=call-4410',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-support-escalation-blocked',
        label: 'to support escalation',
        routeHint: '/support?workspace=escalation&ticketId=TKT-4410',
        routeId: 'cp/support/escalation',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
    ],
    closeCallOutcome: {
      outcome: 'blocked_identity',
      summary: 'الهوية لم تكتمل، لذا أغلقت المكالمة كحالة blocked identity مع بقاء WLT مرجعًا فقط.',
      auditRequired: true,
      signal: buildDshSignalRoutePreview('manual_call_intake_requested'),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    auditRequired: manualCallAuditRequired,
  },
] as const;

export function getDshCallIntakePreview(intakeId: string): DshCallIntakePreview | undefined {
  return DSH_CALL_INTAKE_PREVIEW.find((entry) => entry.intakeId === intakeId);
}

export function getDshCallIntakeByContext(context: {
  readonly intakeId?: string | null;
  readonly customerId?: string | null;
  readonly orderId?: string | null;
  readonly ticketId?: string | null;
}): DshCallIntakePreview | undefined {
  if (context.intakeId) {
    const byId = getDshCallIntakePreview(context.intakeId);
    if (byId) {
      return byId;
    }
  }

  return DSH_CALL_INTAKE_PREVIEW.find((entry) => {
    if (context.customerId && entry.customerId === context.customerId) {
      return true;
    }

    if (context.orderId && entry.orderContext === context.orderId) {
      return true;
    }

    if (context.ticketId && entry.ticketContext === context.ticketId) {
      return true;
    }

    return false;
  });
}
