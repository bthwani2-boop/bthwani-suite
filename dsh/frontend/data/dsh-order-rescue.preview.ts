import type { DshOnDemandPolicy } from '../shared/dsh-flow-registry';
import {
  buildDshSignalRoutePreview,
  type DshGlobalControlLink,
  type DshPreviewPlaceholderStatus,
  type DshReadOnlyFinanceVisibility,
} from './dsh-assisted-order.preview';

export type DshOrderRescueSeverity = 'warning' | 'danger';

export type DshOrderRescueReason =
  | 'item_unavailable'
  | 'customer_not_reachable'
  | 'store_closed_after_order'
  | 'captain_no_show'
  | 'captain_declined'
  | 'pickup_failed'
  | 'handoff_mismatch'
  | 'delivery_failed'
  | 'address_issue'
  | 'payment_failure'
  | 'wlt_visibility';

export type DshOrderRescueOwner = 'support' | 'operations' | 'partner' | 'captain' | 'wlt_reference_only';

export type DshOrderRescueNextActionId =
  | 'replace_item'
  | 'remove_item'
  | 'wait_customer'
  | 'change_delivery_mode'
  | 'reassign_captain'
  | 'convert_to_support_exception'
  | 'create_follow_up_task'
  | 'open_wlt_visibility';

export type DshOrderRescueCase = {
  readonly rescueId: string;
  readonly orderId: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly issueKind: DshOrderRescueReason;
  readonly severity: DshOrderRescueSeverity;
  readonly blocker: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly nextBestAction: string;
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly wltBoundary: string;
  readonly crossSurfaceLinks: readonly DshGlobalControlLink[];
  readonly rescueReasonSelector: {
    readonly selectedReason: DshOrderRescueReason;
    readonly options: readonly DshOrderRescueReason[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly ownerSelection: {
    readonly selectedOwner: DshOrderRescueOwner;
    readonly options: readonly DshOrderRescueOwner[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly nextActionSelector: {
    readonly selectedAction: DshOrderRescueNextActionId;
    readonly options: readonly DshOrderRescueNextActionId[];
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly requiredEvidence: {
    readonly reason: string;
    readonly operatorNote: string;
    readonly affectedEntity: string;
    readonly auditRequired: true;
    readonly reasonRequired: true;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly supportHandoff: {
    readonly ticketLink: string;
    readonly escalationOwner: string;
    readonly sla: string;
    readonly routeHint: string;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly wltImpactVisibility: DshReadOnlyFinanceVisibility;
  readonly decisionSignal: ReturnType<typeof buildDshSignalRoutePreview>;
};

const ORDER_RESCUE_REASONS: readonly DshOrderRescueReason[] = [
  'item_unavailable',
  'customer_not_reachable',
  'store_closed_after_order',
  'captain_no_show',
  'captain_declined',
  'pickup_failed',
  'handoff_mismatch',
  'delivery_failed',
  'address_issue',
  'payment_failure',
  'wlt_visibility',
] as const;

const ORDER_RESCUE_OWNERS: readonly DshOrderRescueOwner[] = [
  'support',
  'operations',
  'partner',
  'captain',
  'wlt_reference_only',
] as const;

const ORDER_RESCUE_ACTIONS: readonly DshOrderRescueNextActionId[] = [
  'replace_item',
  'remove_item',
  'wait_customer',
  'change_delivery_mode',
  'reassign_captain',
  'convert_to_support_exception',
  'create_follow_up_task',
  'open_wlt_visibility',
] as const;

export const DSH_ORDER_RESCUE_PREVIEW: readonly DshOrderRescueCase[] = [
  {
    rescueId: 'rescue-1102',
    orderId: 'ORD-1102',
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    issueKind: 'item_unavailable',
    severity: 'danger',
    blocker: 'الشريك أكد الجاهزية جزئيًا لكن البديل لم يثبت بعد، ما يهدد SLA والرضا.',
    allowedActions: ['replace item', 'create follow-up task', 'فتح ticket support', 'فتح WLT visibility للقراءة فقط'],
    forbiddenActions: ['no refund execution in DSH', 'no settlement/payout mutation', 'no item mutation without visibility note'],
    nextBestAction: 'ثبّت owner واحدًا ثم حرّك الحالة إلى replace item أو support exception بدل تعدد القرارات.',
    onDemandPolicy: 'detail-on-open',
    wltBoundary: 'إذا انتهت الحالة إلى استرداد فالرؤية فقط داخل DSH والتنفيذ في WLT.',
    crossSurfaceLinks: [
      {
        actionId: 'support-ticket',
        label: 'Support ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1102',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'partner-controls',
        label: 'Partner controls',
        surfaceId: 'control-panel',
        sectionId: 'partners',
        routeHint: '/partners?tab=performance&orderId=ORD-1102',
        routeId: 'cp/partners/control',
        onDemandPolicy: 'detail-on-open',
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
      escalationOwner: 'Support + Operations',
      sla: 'يتبقى 5 دقائق',
      routeHint: '/support?workspace=escalation&ticketId=TKT-1102',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltImpactVisibility: {
      paymentVisibility: 'Payment snapshot visible only as a reference.',
      refundVisibility: 'Refund execution blocked in DSH.',
      settlementVisibility: 'Settlement / payout mutation remains WLT-owned.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
      onDemandPolicy: 'finance-preview-only',
      placeholderClassification: 'BLOCKED_BY_WLT',
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
    allowedActions: ['wait customer', 'convert to support exception', 'open WLT visibility'],
    forbiddenActions: ['no refund execution in DSH', 'no delivery mode change after forbidden lifecycle states', 'no settlement/payout mutation'],
    nextBestAction: 'أكمل التحقق ثم افتح الرؤية المالية كمرجع فقط قبل أي قرار rescue إضافي.',
    onDemandPolicy: 'detail-on-open',
    wltBoundary: 'WLT يملك قرار الدفع والاسترداد بالكامل؛ Rescue يكتفي بتجميع السياق وتوجيه القرار.',
    crossSurfaceLinks: [
      {
        actionId: 'manual-call-intake',
        label: 'Manual Call Intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&orderId=ORD-1184&customerId=cus-4188&ticketId=TKT-1184',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'customer-360',
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&orderId=ORD-1184&customerId=cus-4188&ticketId=TKT-1184',
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
      escalationOwner: 'Support',
      sla: 'يتبقى 9 دقائق',
      routeHint: '/support?workspace=escalation&ticketId=TKT-1184',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    wltImpactVisibility: {
      paymentVisibility: 'Payment failure visible from WLT route only.',
      refundVisibility: 'Refund visibility available on open, no execution.',
      settlementVisibility: 'No settlement mutation allowed.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
      onDemandPolicy: 'finance-preview-only',
      placeholderClassification: 'BLOCKED_BY_WLT',
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
