/**
 * DSH Order Lifecycle Handoffs — Cross-Surface Transition Model
 * CONTRACT_SCAFFOLD — Not UI preview. This file is live runtime code.
 * contractState 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' marks transitions pending WLT live-wire (J-010).
 *
 * SSoT for what happens to every surface when an order transitions between states.
 * Each handoff entry declares:
 *   - which stage transition triggers it
 *   - which surface owns the transition
 *   - what each downstream surface observes/does
 *   - what the WLT financial impact is (display only — no mutation)
 *   - which signal is emitted
 *
 * Consumers: captain bridge, field bridge, client-wlt bridge, control-panel support.
 * Do NOT duplicate delivery-mode logic here — import from dsh-delivery-mode.model.ts.
 */

import type { DshOrderJourneyStageId } from './orders.state-machine';
import type { DshFulfillmentDeliveryMode } from '../delivery';
import type { DshSignalEventKind } from './dsh-signal-layer.model';
import type { DshSurfaceId } from '../runtime/dsh-flow-registry';

// ─── Handoff actor ────────────────────────────────────────────────────────────

export type DshHandoffActor =
  | 'client'
  | 'partner'
  | 'captain'
  | 'field'
  | 'operations'
  | 'support'
  | 'system'
  | 'wlt';

// ─── Per-surface observation ──────────────────────────────────────────────────

export type DshSurfaceHandoffObservation = {
  /** Surface that receives this observation */
  readonly surfaceId: DshSurfaceId;
  /** Concise label for what this surface sees at this transition point */
  readonly label: string;
  /** What UI state or screen the surface should enter */
  readonly uiStateHint: string;
  /** Is any action required from this surface? */
  readonly actionRequired: boolean;
  /** Action label if actionRequired=true (empty string otherwise) */
  readonly actionLabel: string;
  /** Is this surface read-only for this transition? */
  readonly readOnly: boolean;
  /**
   * Delivery modes for which this observation applies.
   * Empty array = applies to all modes.
   */
  readonly applicableModes: readonly DshFulfillmentDeliveryMode[];
};

// ─── WLT financial impact (display only) ─────────────────────────────────────

export type DshHandoffWltImpact = {
  /** Financial event kind — display label only, no mutation */
  readonly eventKind: 'payment' | 'fee' | 'refund' | 'cod_accrual' | 'settlement_trigger' | 'none';
  /** Arabic description shown in WLT finance preview */
  readonly displayLabel: string;
  /** Is this a WLT debit (money leaves wallet/platform)? */
  readonly isDebit: boolean;
  /** Is this a WLT credit (money enters wallet/account)? */
  readonly isCredit: boolean;
  /** Always true — DSH never writes to WLT ledger */
  readonly dshReadOnly: true;
  /** CONTRACT_SCAFFOLD_PREVIEW_ONLY marker */
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
};

// ─── Handoff entry ────────────────────────────────────────────────────────────

export type DshOrderLifecycleHandoff = {
  /** Stable identifier for this handoff */
  readonly handoffId: string;
  /** Stage the order is leaving */
  readonly fromStage: DshOrderJourneyStageId | null;
  /** Stage the order is entering */
  readonly toStage: DshOrderJourneyStageId;
  /** Who triggers this transition */
  readonly triggerActor: DshHandoffActor;
  /** Arabic description of what's happening */
  readonly description: string;
  /** Delivery modes where this handoff is relevant. Empty = all modes. */
  readonly applicableModes: readonly DshFulfillmentDeliveryMode[];
  /** Per-surface observations */
  readonly surfaceObservations: readonly DshSurfaceHandoffObservation[];
  /** WLT financial impact */
  readonly wltImpact: DshHandoffWltImpact;
  /** Signal emitted at this transition (undefined = no signal) */
  readonly signalKind?: DshSignalEventKind;
  /** Should this transition be recorded in the audit log? */
  readonly auditRequired: boolean;
};

// ─── No WLT impact helper ─────────────────────────────────────────────────────

const NO_WLT_IMPACT: DshHandoffWltImpact = {
  eventKind: 'none',
  displayLabel: 'لا أثر مالي مباشر',
  isDebit: false,
  isCredit: false,
  dshReadOnly: true,
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
};

// ─── Handoff table ────────────────────────────────────────────────────────────

export const DSH_ORDER_LIFECYCLE_HANDOFFS: readonly DshOrderLifecycleHandoff[] = [

  // ── 1. Payment pending ────────────────────────────────────────────────────
  {
    handoffId: 'payment_pending',
    fromStage: null,
    toStage: 'payment_pending',
    triggerActor: 'client',
    description: 'العميل يُرسل طلب الدفع — WLT يتحقق من صحة الوسيلة والرصيد',
    applicableModes: [],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'شاشة تأكيد الدفع تُعرض', uiStateHint: 'payment_pending', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'control-panel', label: 'لا إجراء — WLT يعالج', uiStateHint: 'monitoring', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
    ],
    wltImpact: { eventKind: 'payment', displayLabel: 'بدء تحقق الدفع من WLT', isDebit: false, isCredit: false, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: undefined,
    auditRequired: false,
  },

  // ── 2. Payment failed ─────────────────────────────────────────────────────
  {
    handoffId: 'payment_failed',
    fromStage: 'payment_pending',
    toStage: 'payment_failed',
    triggerActor: 'wlt',
    description: 'WLT رفض الدفع — العميل يرى رسالة الفشل ويجب إعادة المحاولة أو تغيير الوسيلة',
    applicableModes: [],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'رسالة فشل الدفع + خيار إعادة المحاولة', uiStateHint: 'payment_failed', actionRequired: true, actionLabel: 'إعادة المحاولة أو تغيير الوسيلة', readOnly: false, applicableModes: [] },
      { surfaceId: 'control-panel', label: 'تنبيه payment_failed في Operations', uiStateHint: 'alert', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
    ],
    wltImpact: { eventKind: 'payment', displayLabel: 'فشل الدفع — لا خصم نهائي', isDebit: false, isCredit: false, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'payment_failed',
    auditRequired: true,
  },

  // ── 3. Order submitted → operations review ────────────────────────────────
  {
    handoffId: 'order_submitted_to_ops',
    fromStage: 'payment_pending',
    toStage: 'order_submitted',
    triggerActor: 'system',
    description: 'الدفع نجح — الطلب يدخل قائمة مراجعة العمليات',
    applicableModes: [],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'شاشة تتبع تُعرض — "قيد المراجعة"', uiStateHint: 'order_created', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'app-partner', label: 'لا إشعار بعد — ينتظر موافقة العمليات', uiStateHint: 'waiting', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'app-captain', label: 'لا إسناد بعد', uiStateHint: 'not_applicable', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'الطلب يظهر في قائمة Operations للمراجعة', uiStateHint: 'operations_review', actionRequired: true, actionLabel: 'موافقة أو رفض الطلب', readOnly: false, applicableModes: [] },
    ],
    wltImpact: { eventKind: 'payment', displayLabel: 'تأكيد الدفع — WLT احتجز المبلغ', isDebit: true, isCredit: false, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'order_created',
    auditRequired: false,
  },

  // ── 4. Operations approved ────────────────────────────────────────────────
  {
    handoffId: 'operations_approved',
    fromStage: 'order_submitted',
    toStage: 'operations_approved',
    triggerActor: 'operations',
    description: 'مشرف العمليات يوافق على الطلب — يُرسَل للشريك للتجهيز',
    applicableModes: [],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'تحديث التتبع — "تم التأكيد"', uiStateHint: 'order_confirmed', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'app-partner', label: 'إشعار طلب جديد يصل — يجب قبوله', uiStateHint: 'new_order_alert', actionRequired: true, actionLabel: 'قبول الطلب والبدء بالتجهيز', readOnly: false, applicableModes: [] },
      { surfaceId: 'app-captain', label: 'لا إسناد بعد — ينتظر جاهزية المتجر', uiStateHint: 'waiting', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'الطلب انتقل لـ "قيد التجهيز عند الشريك"', uiStateHint: 'monitoring', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
    ],
    wltImpact: NO_WLT_IMPACT,
    signalKind: 'partner_accepted',
    auditRequired: true,
  },

  // ── 5. Partner rejected ───────────────────────────────────────────────────
  {
    handoffId: 'partner_rejected',
    fromStage: 'order_submitted',
    toStage: 'partner_rejected',
    triggerActor: 'partner',
    description: 'الشريك رفض الطلب — يجب تصعيد للعمليات وإشعار العميل',
    applicableModes: [],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'إشعار: "المتجر غير قادر على تلبية طلبك"', uiStateHint: 'exception', actionRequired: true, actionLabel: 'تواصل مع الدعم أو اختر بديلًا', readOnly: false, applicableModes: [] },
      { surfaceId: 'app-partner', label: 'سجل رفض الطلب يُعرض', uiStateHint: 'rejected_record', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'control-panel', label: 'تنبيه عاجل: partner_rejected — يجب إجراء rescue', uiStateHint: 'rescue_required', actionRequired: true, actionLabel: 'فتح Order Rescue', readOnly: false, applicableModes: [] },
    ],
    wltImpact: { eventKind: 'refund', displayLabel: 'استرداد محتمل — WLT يُقيّم', isDebit: false, isCredit: true, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'partner_rejected_order',
    auditRequired: true,
  },

  // ── 6. Ready for pickup → captain assigned ────────────────────────────────
  {
    handoffId: 'ready_for_pickup_captain_assigned',
    fromStage: 'ready_for_pickup',
    toStage: 'captain_assigned',
    triggerActor: 'operations',
    description: 'المتجر جهّز الطلب — يُسند كابتن ويبدأ التتبع',
    applicableModes: ['bthwani_delivery'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'تتبع: "تم تعيين الكابتن"', uiStateHint: 'tracking_active', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-partner', label: 'حالة الطلب: "في انتظار الكابتن"', uiStateHint: 'waiting_captain', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-captain', label: 'عرض طلب جديد يصل — يجب قبوله', uiStateHint: 'bell_offer', actionRequired: true, actionLabel: 'قبول الطلب', readOnly: false, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'إسناد الكابتن مرئي في Operations', uiStateHint: 'dispatch_monitoring', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
    ],
    wltImpact: NO_WLT_IMPACT,
    signalKind: 'captain_assigned',
    auditRequired: false,
  },

  // ── 7. Captain declined → reassignment ───────────────────────────────────
  {
    handoffId: 'captain_declined_reassignment',
    fromStage: 'captain_assigned',
    toStage: 'exception',
    triggerActor: 'captain',
    description: 'الكابتن رفض الطلب — يجب إعادة الإسناد من العمليات',
    applicableModes: ['bthwani_delivery'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'لا تغيير مرئي — التتبع يظل "قيد التعيين"', uiStateHint: 'tracking_active', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-captain', label: 'الطلب يُزال من قائمة الكابتن', uiStateHint: 'offer_declined', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'تنبيه: captain_declined — إعادة إسناد مطلوبة', uiStateHint: 'reassignment_required', actionRequired: true, actionLabel: 'إسناد كابتن آخر', readOnly: false, applicableModes: ['bthwani_delivery'] },
    ],
    wltImpact: NO_WLT_IMPACT,
    signalKind: 'captain_declined',
    auditRequired: true,
  },

  // ── 8. Picked up ──────────────────────────────────────────────────────────
  {
    handoffId: 'picked_up',
    fromStage: 'captain_assigned',
    toStage: 'picked_up',
    triggerActor: 'captain',
    description: 'الكابتن استلم الطلب من المتجر — يبدأ التوصيل',
    applicableModes: ['bthwani_delivery'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'تتبع: "في الطريق إليك"', uiStateHint: 'tracking_active', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-partner', label: 'حالة الطلب: "تم الاستلام"', uiStateHint: 'order_picked_up', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-captain', label: 'شاشة التوصيل تُعرض — الخريطة + عنوان العميل', uiStateHint: 'pickup_dropoff', actionRequired: true, actionLabel: 'متابعة للتسليم', readOnly: false, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'مرحلة: "الكابتن في الطريق" في Operations', uiStateHint: 'live_tracking', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
    ],
    wltImpact: { eventKind: 'cod_accrual', displayLabel: 'COD في حيازة الكابتن — ذمة معلقة لـ WLT', isDebit: false, isCredit: false, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'picked_up',
    auditRequired: false,
  },

  // ── 9. Delivered + PoD ────────────────────────────────────────────────────
  {
    handoffId: 'delivered_pod',
    fromStage: 'enroute_to_customer',
    toStage: 'post_delivery',
    triggerActor: 'captain',
    description: 'الكابتن سلّم الطلب ورفع إثبات التسليم (PoD) — يُغلق الطلب ويبدأ حساب التسوية',
    applicableModes: ['bthwani_delivery'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'تتبع: "تم التسليم" + تقييم اختياري', uiStateHint: 'delivered', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-partner', label: 'الطلب يُغلق — حالة: "تم التوصيل"', uiStateHint: 'order_closed', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-captain', label: 'شاشة ما بعد التسليم — COD + ملخص', uiStateHint: 'post_delivery', actionRequired: true, actionLabel: 'تأكيد إيداع COD', readOnly: false, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'الطلب يُغلق في Operations + يُضاف لقائمة COD المستحقة', uiStateHint: 'closed_pending_settlement', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'wlt-finance', label: 'بدء احتساب تسوية الكابتن — COD + عمولة', uiStateHint: 'settlement_calculation', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
    ],
    wltImpact: { eventKind: 'settlement_trigger', displayLabel: 'PoD أكّد التسليم — WLT يبدأ احتساب التسوية', isDebit: false, isCredit: true, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'delivered',
    auditRequired: true,
  },

  // ── 10. Delivery failed → rescue ──────────────────────────────────────────
  {
    handoffId: 'delivery_failed_rescue',
    fromStage: 'enroute_to_customer',
    toStage: 'exception',
    triggerActor: 'captain',
    description: 'فشل التسليم — يجب تصعيد للدعم وفتح Order Rescue',
    applicableModes: ['bthwani_delivery'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'إشعار: "تعذّر التسليم" + خيار الدعم', uiStateHint: 'exception', actionRequired: true, actionLabel: 'التواصل مع الدعم', readOnly: false, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'app-captain', label: 'شاشة الإبلاغ عن العائق — سبب + ملاحظة', uiStateHint: 'delivery_exception_report', actionRequired: true, actionLabel: 'إبلاغ عن سبب الفشل', readOnly: false, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'تنبيه عاجل: delivery_failed — Order Rescue مطلوب', uiStateHint: 'rescue_required', actionRequired: true, actionLabel: 'فتح Order Rescue', readOnly: false, applicableModes: ['bthwani_delivery'] },
    ],
    wltImpact: { eventKind: 'refund', displayLabel: 'استرداد محتمل — WLT يُقيّم حسب سياسة الإلغاء', isDebit: false, isCredit: true, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'delivery_failed',
    auditRequired: true,
  },

  // ── 11. Cancellation → refund ─────────────────────────────────────────────
  {
    handoffId: 'cancelled_refund_pending',
    fromStage: 'cancellation_requested',
    toStage: 'refund_pending',
    triggerActor: 'system',
    description: 'الطلب مُلغى — WLT يُعالج الاسترداد',
    applicableModes: [],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'إشعار: "جارٍ معالجة الاسترداد"', uiStateHint: 'refund_pending', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'app-partner', label: 'الطلب يُغلق بحالة ملغى', uiStateHint: 'order_cancelled', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'app-captain', label: 'الطلب يُزال من القائمة', uiStateHint: 'order_removed', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['bthwani_delivery'] },
      { surfaceId: 'control-panel', label: 'سجل الإلغاء + تتبع الاسترداد في Finance', uiStateHint: 'refund_monitoring', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
      { surfaceId: 'wlt-finance', label: 'قيد استرداد في دفتر الأستاذ', uiStateHint: 'refund_ledger_entry', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: [] },
    ],
    wltImpact: { eventKind: 'refund', displayLabel: 'WLT يُعالج الاسترداد إلى وسيلة الدفع الأصلية', isDebit: false, isCredit: true, dshReadOnly: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' },
    signalKind: 'refund_pending_wlt',
    auditRequired: true,
  },

  // ── 12. Partner delivery: partner accepted → store courier dispatched ─────
  {
    handoffId: 'partner_delivery_dispatched',
    fromStage: 'order_received',
    toStage: 'preparing',
    triggerActor: 'partner',
    description: 'توصيل المتجر: الشريك قبل الطلب وأرسل موصله',
    applicableModes: ['partner_delivery'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'تتبع: "موصل المتجر في الطريق"', uiStateHint: 'tracking_active', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['partner_delivery'] },
      { surfaceId: 'app-partner', label: 'حالة الطلب: "موصل مُرسَل"', uiStateHint: 'courier_dispatched', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['partner_delivery'] },
      { surfaceId: 'control-panel', label: 'مراقبة store-delivery في Operations', uiStateHint: 'store_delivery_monitoring', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['partner_delivery'] },
    ],
    wltImpact: NO_WLT_IMPACT,
    signalKind: 'partner_accepted',
    auditRequired: false,
  },

  // ── 13. Pickup: store ready → client collect ──────────────────────────────
  {
    handoffId: 'pickup_ready_client_collect',
    fromStage: 'preparing',
    toStage: 'delivered',
    triggerActor: 'partner',
    description: 'استلام بنفسك: المتجر جاهز — العميل يُخطَر ويأتي للاستلام',
    applicableModes: ['pickup'],
    surfaceObservations: [
      { surfaceId: 'app-client', label: 'إشعار: "طلبك جاهز للاستلام"', uiStateHint: 'pickup_ready', actionRequired: true, actionLabel: 'اذهب للاستلام', readOnly: false, applicableModes: ['pickup'] },
      { surfaceId: 'app-partner', label: 'حالة: "ينتظر العميل"', uiStateHint: 'waiting_client', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['pickup'] },
      { surfaceId: 'control-panel', label: 'مراقبة store-readiness في Operations', uiStateHint: 'monitoring', actionRequired: false, actionLabel: '', readOnly: true, applicableModes: ['pickup'] },
    ],
    wltImpact: NO_WLT_IMPACT,
    signalKind: undefined,
    auditRequired: false,
  },
] as const;

// ─── Lookup functions ─────────────────────────────────────────────────────────

/**
 * Returns all handoffs that involve a given surface as an active participant.
 */
export function getHandoffsForSurface(surfaceId: DshSurfaceId): readonly DshOrderLifecycleHandoff[] {
  return DSH_ORDER_LIFECYCLE_HANDOFFS.filter((h) =>
    h.surfaceObservations.some((o) => o.surfaceId === surfaceId),
  );
}

/**
 * Returns all handoffs where a surface has an action required.
 */
export function getActionableHandoffsForSurface(surfaceId: DshSurfaceId): readonly DshOrderLifecycleHandoff[] {
  return DSH_ORDER_LIFECYCLE_HANDOFFS.filter((h) =>
    h.surfaceObservations.some((o) => o.surfaceId === surfaceId && o.actionRequired),
  );
}

/**
 * Returns the observation for a specific surface within a handoff.
 */
export function getSurfaceObservation(
  handoff: DshOrderLifecycleHandoff,
  surfaceId: DshSurfaceId,
): DshSurfaceHandoffObservation | undefined {
  return handoff.surfaceObservations.find((o) => o.surfaceId === surfaceId);
}

/**
 * Returns all handoffs for a given delivery mode (plus mode-agnostic ones).
 */
export function getHandoffsForDeliveryMode(
  mode: DshFulfillmentDeliveryMode,
): readonly DshOrderLifecycleHandoff[] {
  return DSH_ORDER_LIFECYCLE_HANDOFFS.filter(
    (h) => h.applicableModes.length === 0 || h.applicableModes.includes(mode),
  );
}

/**
 * Returns all handoffs that trigger a WLT financial event.
 */
export function getHandoffsWithWltImpact(): readonly DshOrderLifecycleHandoff[] {
  return DSH_ORDER_LIFECYCLE_HANDOFFS.filter((h) => h.wltImpact.eventKind !== 'none');
}

/**
 * Returns all handoffs that require audit recording.
 */
export function getAuditableHandoffs(): readonly DshOrderLifecycleHandoff[] {
  return DSH_ORDER_LIFECYCLE_HANDOFFS.filter((h) => h.auditRequired);
}
