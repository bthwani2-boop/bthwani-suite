import {
  DSH_DELIVERY_MODE_DEFINITIONS,
  getDshDeliveryModeDefinition,
  type DshFulfillmentDeliveryMode,
} from './dsh-delivery-mode.model';
import type { DshControlPanelSectionId } from './dsh-governance.map';
import type { DshOnDemandPolicy, DshSurfaceId } from './dsh-flow-registry';
import {
  getDshSignalActorRoute,
  type DshSignalEventKind,
  type DshSignalPriority,
} from './dsh-signal-layer.model';
import type { DshOrderLifecycleStatus } from './dsh-order-journey.model';

export type RecommendationProduct = {
  id: string;
  title: string;
  priceLabel: string;
  priceValue: number;
  imageUri?: string;
  description?: string;
};

export type CartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  priceValue?: number;
  qty?: number;
  storeId?: string;
  storeName?: string;
};

export type DshCaptainOrderId = string;
export type DshCaptainOrderServiceType = 'standard' | 'awnak' | 'shein-final-mile';
export type DshCaptainOrderMode =
  | 'full'
  | 'inbox'
  | 'detail'
  | 'chat'
  | 'bell'
  | 'accept'
  | 'offer-reject'
  | 'pickup'
  | 'deliver'
  | 'proof'
  | 'orders-list'
  | 'orders-offers-list'
  | 'order-get'
  | 'order-details';
export type DshCaptainOrderStage = 'offer' | 'accepted' | 'pickup' | 'delivery' | 'proof' | 'closed';

export type DshCaptainOrderBellItem = {
  id: DshCaptainOrderId;
  serviceType: DshCaptainOrderServiceType;
  readonly fulfillmentMode: 'bthwani_delivery';
  title: string;
  subtitle: string;
  meta: string;
};

export type DshCaptainOrderMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  side: 'start' | 'end';
};

export type DshCaptainOrderAction =
  | 'accept'
  | 'order-offer-reject'
  | 'pickup'
  | 'deliver'
  | 'proof-upload'
  | 'back-to-inbox'
  | 'next-order';

export type DshCaptainOrderProofStatus = 'idle' | 'pending' | 'uploaded' | 'verified' | 'failed';
export type DshCaptainOrdersScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'delivered'
  | 'error'
  | 'availability-toggle'
  | 'offer-accepting'
  | 'offer-accepted'
  | 'loading-assignment';

export type DshPartnerOrderAlertId =
  | 'order_needs_accept'
  | 'order_sla_risk'
  | 'order_ready'
  | 'order_handoff_pending'
  | 'order_issue_required'
  | 'order_rejected'
  | 'order_store_delivered';
export type DshPartnerOrderAlertStatus = 'new' | 'seen';
export type DshPartnerOrderAlertItem = {
  id: string;
  orderId: string;
  alertId: DshPartnerOrderAlertId;
  title: string;
  description: string;
  timeLabel: string;
  status: DshPartnerOrderAlertStatus;
  urgent?: boolean;
};

export type DshPartnerOrderConversationMode = DshFulfillmentDeliveryMode;
export type DshPartnerOrderConversationMessage = {
  id: string;
  authorLabel: string;
  body: string;
  timestampLabel: string;
  acknowledged?: boolean;
};
export type DshPartnerOrderConversationVisibility = 'enabled' | 'disabled-for-mode';

export function shouldShowDshPartnerOrderConversation(
  mode: DshPartnerOrderConversationMode
): DshPartnerOrderConversationVisibility {
  return mode === 'bthwani_delivery' ? 'disabled-for-mode' : 'enabled';
}

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
  readonly readOnly: boolean;
  readonly mutationForbidden: boolean;
  readonly calculationTruthOwner: string;
  readonly routeHint: string;
  readonly onDemandPolicy: string;
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
  if (priority === 'urgent') return 'عاجل';
  if (priority === 'important') return 'مهم';
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

export function buildDshAssistedOrderLookupInputs(values: {
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

export function buildDshAssistedOrderDeliveryModeOptions(): readonly DshAssistedOrderDeliveryModeOption[] {
  return DSH_DELIVERY_MODE_DEFINITIONS.map((definition) => ({
    modeId: definition.modeId,
    label: definition.label,
    requiresDispatch: definition.requiresDispatch,
    requiresCaptain: definition.requiresCaptain,
    supportFallback: definition.supportFallback,
  }));
}

export function buildDshAssistedOrderDeliveryModeSummary(modeId: DshFulfillmentDeliveryMode): {
  readonly selectedMode: DshFulfillmentDeliveryMode;
  readonly options: readonly DshAssistedOrderDeliveryModeOption[];
  readonly selectedModeSummary: string;
  readonly forbiddenLifecycleStates: readonly string[];
  readonly previewClassification: DshPreviewPlaceholderStatus;
} {
  const mode = getDshDeliveryModeDefinition(modeId);
  return {
    selectedMode: modeId,
    options: buildDshAssistedOrderDeliveryModeOptions(),
    selectedModeSummary: `${mode.label} · ${mode.controlPanelDispatchBehavior}`,
    forbiddenLifecycleStates: ['delivered', 'cancelled', 'refund_pending_wlt', 'settlement_ready_wlt'],
    previewClassification: 'ACCEPTED_PREVIEW_LABEL',
  };
}

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
  readonly decisionSignal: DshSignalRoutePreview;
};

export const ORDER_RESCUE_REASONS: readonly DshOrderRescueReason[] = [
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

export const ORDER_RESCUE_OWNERS: readonly DshOrderRescueOwner[] = [
  'support',
  'operations',
  'partner',
  'captain',
  'wlt_reference_only',
] as const;

export const ORDER_RESCUE_ACTIONS: readonly DshOrderRescueNextActionId[] = [
  'replace_item',
  'remove_item',
  'wait_customer',
  'change_delivery_mode',
  'reassign_captain',
  'convert_to_support_exception',
  'create_follow_up_task',
  'open_wlt_visibility',
] as const;

export type SheinProxyStage =
  | 'intake_review'
  | 'quote_pending'
  | 'customer_approval'
  | 'batch_pending'
  | 'purchased'
  | 'inbound'
  | 'sorting'
  | 'ready_for_delivery'
  | 'captain_assignment'
  | 'delivered'
  | 'exception';

export const SHEIN_PROXY_STAGE_LABELS: Record<SheinProxyStage, string> = {
  intake_review: 'مراجعة الطلب',
  quote_pending: 'بانتظار التسعير',
  customer_approval: 'موافقة العميل',
  batch_pending: 'بانتظار الدفعة',
  purchased: 'تم الشراء',
  inbound: 'في الطريق للاستقبال',
  sorting: 'قيد الفرز',
  ready_for_delivery: 'جاهز للتسليم',
  captain_assignment: 'إسناد الكابتن',
  delivered: 'تم التسليم',
  exception: 'استثناء',
};

export type AwnakStage =
  | 'intake'
  | 'quote_review'
  | 'dispatch_pending'
  | 'assigned'
  | 'in_progress'
  | 'proof_review'
  | 'completed'
  | 'cancelled'
  | 'escalated';

export const AWNAK_STAGE_LABELS: Record<AwnakStage, string> = {
  intake: 'استلام الطلب',
  quote_review: 'مراجعة السعر',
  dispatch_pending: 'قيد الإسناد',
  assigned: 'تم الإسناد',
  in_progress: 'قيد التنفيذ',
  proof_review: 'مراجعة الإثبات',
  completed: 'مكتمل',
  cancelled: 'ملغى',
  escalated: 'مصعّد',
};

export type DshOpsMonitoringItem = {
  readonly entityId: string;
  readonly entityLabel: string;
  readonly lifecycleState: string;
  readonly affectedSurface: 'control-panel' | 'app-client' | 'app-partner' | 'app-captain' | 'app-field';
  readonly ownerQueue: string;
  readonly status: string;
  readonly statusTone: 'neutral' | 'success' | 'warning' | 'danger';
  readonly primaryAction: string;
  readonly secondaryAction?: string;
  readonly routeHint: string;
  readonly evidenceNeeded: boolean;
  readonly onDemandDetailPolicy: 'summary-only' | 'detail-on-open' | 'evidence-on-open';
  readonly supportTicketId?: string;
  readonly auditEntryId?: string;
};

export type DshWltFinanceAlert = {
  readonly alertId: string;
  readonly domain: 'payment' | 'refund' | 'settlement' | 'payout' | 'commission';
  readonly label: string;
  readonly count: number;
  readonly statusTone: 'neutral' | 'success' | 'warning' | 'danger';
  readonly wltBridgeNote: string;
  readonly routeHint: string;
};

export const EXCEPTION_TICKET_MAP: Readonly<Record<string, { supportTicketId: string; auditEntryId?: string }>> = {
  'EX-4101': { supportTicketId: 'TK-5101', auditEntryId: 'AU-7001' },
  'EX-4102': { supportTicketId: 'TK-5102', auditEntryId: 'AU-7002' },
  'EX-4103': { supportTicketId: 'TK-5103', auditEntryId: undefined },
};

export const DISPATCH_LIFECYCLE_STATE_MAP: Readonly<Record<string, DshOrderLifecycleStatus>> = {
  'DA-2001': 'captain_assignment',
  'DA-2002': 'reassignment_required',
  'DA-2003': 'captain_unavailable',
};
