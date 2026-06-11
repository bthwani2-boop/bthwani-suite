/**
 * DSH Captain Navigation Bridge
 * CONTRACT_SCAFFOLD — Not UI preview. This file is live runtime code.
 * contractState 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' means the WLT/COD settlement binding is scaffolded (J-010).
 *
 * Maps captain operational state to:
 *   - which route/screen the captain surface should show
 *   - what COD state is (display + WLT intent, no mutation)
 *   - what happens after PoD submission (downstream notifications)
 *   - how support escalation maps to control-panel context
 *   - which orders are visible per delivery mode
 *
 * No API calls, no backend mutations. All WLT interaction is display-only.
 */

import type { DshCaptainRoute } from './dsh-captain.types';
import type { DshCaptainOrderStage } from '../shared/dsh-order-preview.contract';
import type { DshFulfillmentDeliveryMode } from '../shared/dsh-delivery-mode.model';
import type { DshSignalEventKind } from '../shared/dsh-signal-layer.model';
import { getHandoffsForSurface, type DshOrderLifecycleHandoff } from '../shared/dsh-order-lifecycle-handoffs';

// ─── Captain lifecycle state ──────────────────────────────────────────────────

export type DshCaptainLifecycleState =
  | 'offline'           // Not available, not receiving offers
  | 'available'         // Online, waiting for offers
  | 'offer_received'    // Received an order offer — bell screen
  | 'accepted'          // Accepted offer — heading to pickup
  | 'at_pickup'         // Arrived at store — awaiting handoff
  | 'picked_up'         // Order picked up — heading to customer
  | 'near_customer'     // Approaching customer location
  | 'at_door'           // At customer door
  | 'pod_pending'       // Waiting to upload proof of delivery
  | 'pod_uploaded'      // PoD uploaded — order closing
  | 'order_closed'      // Order complete — returning to available
  | 'exception_active'  // Pickup/delivery exception — reporting required
  | 'support_escalated' // Escalated to support — blocked from new offers
  | 'store_courier';    // Store courier mode — different flow rules

// ─── Route mapping ────────────────────────────────────────────────────────────

export type DshCaptainRouteMapping = {
  readonly lifecycleState: DshCaptainLifecycleState;
  readonly primaryRoute: DshCaptainRoute;
  readonly label: string;
  readonly canReceiveNewOffers: boolean;
  readonly isBlocked: boolean;
  readonly blockReason?: string;
};

export const DSH_CAPTAIN_ROUTE_MAP: readonly DshCaptainRouteMapping[] = [
  { lifecycleState: 'offline',           primaryRoute: 'home',             label: 'غير متصل — الصفحة الرئيسية',              canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'available',         primaryRoute: 'home',             label: 'متاح — ينتظر عروض الطلبات',               canReceiveNewOffers: true,  isBlocked: false },
  { lifecycleState: 'offer_received',    primaryRoute: 'bell',             label: 'عرض طلب جديد — شاشة الإشعار',            canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'accepted',          primaryRoute: 'detail',           label: 'قبل الطلب — في الطريق للاستلام',          canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'at_pickup',         primaryRoute: 'pickup-dropoff',   label: 'وصل للمتجر — انتظار الاستلام',            canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'picked_up',         primaryRoute: 'pickup-dropoff',   label: 'استلم الطلب — في الطريق للعميل',          canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'near_customer',     primaryRoute: 'pickup-dropoff',   label: 'قريب من العميل',                          canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'at_door',           primaryRoute: 'pickup-dropoff',   label: 'عند الباب — جاهز للتسليم',                canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'pod_pending',       primaryRoute: 'pod-submission',   label: 'رفع إثبات التسليم',                       canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'pod_uploaded',      primaryRoute: 'home',             label: 'PoD مرفوع — إغلاق الطلب',                 canReceiveNewOffers: false, isBlocked: false },
  { lifecycleState: 'order_closed',      primaryRoute: 'home',             label: 'الطلب مغلق — عودة للتوفر',               canReceiveNewOffers: true,  isBlocked: false },
  { lifecycleState: 'exception_active',  primaryRoute: 'support-screen',   label: 'استثناء نشط — الإبلاغ مطلوب',             canReceiveNewOffers: false, isBlocked: true, blockReason: 'يجب إغلاق الاستثناء الحالي أولًا' },
  { lifecycleState: 'support_escalated', primaryRoute: 'support-screen',   label: 'مصعّد للدعم — محجوب من العروض الجديدة',   canReceiveNewOffers: false, isBlocked: true, blockReason: 'ينتظر قرار فريق الدعم' },
  { lifecycleState: 'store_courier',     primaryRoute: 'inbox',            label: 'وضع موصل المتجر — قائمة التوصيلات',        canReceiveNewOffers: true,  isBlocked: false },
] as const;

export function getCaptainRouteForLifecycle(
  state: DshCaptainLifecycleState,
): DshCaptainRouteMapping {
  return DSH_CAPTAIN_ROUTE_MAP.find((m) => m.lifecycleState === state)
    ?? DSH_CAPTAIN_ROUTE_MAP[0]!;
}

// ─── Order stage → captain lifecycle ─────────────────────────────────────────

export type DshCaptainOrderStageMapping = {
  readonly orderStage: DshCaptainOrderStage;
  readonly captainLifecycleState: DshCaptainLifecycleState;
  readonly captainRoute: DshCaptainRoute;
  /** Can this stage be skipped in store_courier mode? */
  readonly skipInStoreCourierMode: boolean;
};

export const DSH_CAPTAIN_ORDER_STAGE_MAP: readonly DshCaptainOrderStageMapping[] = [
  { orderStage: 'offer',    captainLifecycleState: 'offer_received', captainRoute: 'bell',           skipInStoreCourierMode: false },
  { orderStage: 'accepted', captainLifecycleState: 'accepted',       captainRoute: 'detail',         skipInStoreCourierMode: false },
  { orderStage: 'pickup',   captainLifecycleState: 'at_pickup',      captainRoute: 'pickup-dropoff', skipInStoreCourierMode: false },
  { orderStage: 'delivery', captainLifecycleState: 'picked_up',      captainRoute: 'pickup-dropoff', skipInStoreCourierMode: false },
  { orderStage: 'proof',    captainLifecycleState: 'pod_pending',     captainRoute: 'pod-submission', skipInStoreCourierMode: true },
  { orderStage: 'closed',   captainLifecycleState: 'order_closed',   captainRoute: 'home',           skipInStoreCourierMode: false },
] as const;

export function getCaptainLifecycleForOrderStage(
  stage: DshCaptainOrderStage,
  isStoreCourierMode: boolean,
): DshCaptainOrderStageMapping {
  const entry = DSH_CAPTAIN_ORDER_STAGE_MAP.find((m) => m.orderStage === stage);
  if (!entry) return DSH_CAPTAIN_ORDER_STAGE_MAP[0]!;
  // Store courier skips PoD — return home immediately after delivery
  if (isStoreCourierMode && entry.skipInStoreCourierMode) {
    return { ...entry, captainLifecycleState: 'order_closed', captainRoute: 'home' };
  }
  return entry;
}

// ─── Delivery mode inbox filter ───────────────────────────────────────────────

export type DshCaptainInboxModeFilter = {
  readonly mode: DshFulfillmentDeliveryMode;
  /** Should orders with this delivery mode appear in captain inbox? */
  readonly visibleInInbox: boolean;
  /** Why invisible (if not visible) */
  readonly hiddenReason?: string;
  /** Label shown in captain app for this mode */
  readonly modeLabel: string;
};

export const DSH_CAPTAIN_INBOX_MODE_FILTERS: readonly DshCaptainInboxModeFilter[] = [
  {
    mode: 'bthwani_delivery',
    visibleInInbox: true,
    modeLabel: 'توصيل بثواني',
  },
  {
    mode: 'partner_delivery',
    visibleInInbox: false,
    hiddenReason: 'توصيل المتجر لا يحتاج كابتن — موصل الشريك يتولى التوصيل',
    modeLabel: 'توصيل المتجر',
  },
  {
    mode: 'pickup',
    visibleInInbox: false,
    hiddenReason: 'الاستلام الذاتي لا يُسند للكابتن — العميل يستلم من المتجر',
    modeLabel: 'استلام بنفسك',
  },
] as const;

export function isCaptainInboxVisibleForMode(mode: DshFulfillmentDeliveryMode): boolean {
  return DSH_CAPTAIN_INBOX_MODE_FILTERS.find((f) => f.mode === mode)?.visibleInInbox ?? false;
}

// ─── COD state model ──────────────────────────────────────────────────────────

export type DshCaptainCodState =
  | 'no_cod'                // Order paid digitally — no cash collected
  | 'cod_pending_pickup'    // Cash will be collected at delivery
  | 'cod_collected'         // Cash in captain's possession — WLT liability
  | 'cod_deposit_required'  // Captain must deposit at collection point
  | 'cod_deposited'         // Captain deposited — WLT processing
  | 'cod_settled';          // WLT confirmed settlement

export type DshCaptainCodEntry = {
  readonly orderId: string;
  readonly amountLabel: string;
  readonly state: DshCaptainCodState;
  readonly label: string;
  readonly actionRequired: boolean;
  readonly actionLabel: string;
  /**
   * WLT intent — display only.
   * Actual COD settlement is WLT-owned: CONTRACT_SCAFFOLD_PREVIEW_ONLY
   */
  readonly wltIntentLabel: string;
  readonly wltReadOnly: true;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
};

export const DSH_CAPTAIN_COD_STATE_META: Record<DshCaptainCodState, {
  label: string;
  actionRequired: boolean;
  actionLabel: string;
  wltIntentLabel: string;
}> = {
  no_cod:               { label: 'دفع رقمي — لا نقد',               actionRequired: false, actionLabel: '',                                wltIntentLabel: 'لا أثر COD على WLT' },
  cod_pending_pickup:   { label: 'COD — ينتظر التحصيل',              actionRequired: false, actionLabel: '',                                wltIntentLabel: 'WLT يتتبع الطلب (قيد التحصيل)' },
  cod_collected:        { label: 'COD محصّل — في حيازة الكابتن',    actionRequired: true,  actionLabel: 'إيداع COD في نقطة التحصيل',        wltIntentLabel: 'WLT: ذمة COD قيد الإيداع' },
  cod_deposit_required: { label: 'إيداع COD مطلوب',                  actionRequired: true,  actionLabel: 'إيداع المبلغ قبل نهاية الدورة',   wltIntentLabel: 'WLT: تسوية COD قيد الانتظار' },
  cod_deposited:        { label: 'COD مُودَع — بانتظار WLT',         actionRequired: false, actionLabel: '',                                wltIntentLabel: 'WLT يعالج الإيداع' },
  cod_settled:          { label: 'COD مُسوَّى — مكتمل',              actionRequired: false, actionLabel: '',                                wltIntentLabel: 'WLT أكّد التسوية' },
};

export function buildCaptainCodEntry(
  orderId: string,
  amountLabel: string,
  state: DshCaptainCodState,
): DshCaptainCodEntry {
  const meta = DSH_CAPTAIN_COD_STATE_META[state];
  return {
    orderId,
    amountLabel,
    state,
    label: meta.label,
    actionRequired: meta.actionRequired,
    actionLabel: meta.actionLabel,
    wltIntentLabel: meta.wltIntentLabel,
    wltReadOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  };
}

// ─── PoD downstream notifications ────────────────────────────────────────────

export type DshCaptainPodDownstreamTarget = {
  readonly surface: 'app-client' | 'app-partner' | 'control-panel' | 'wlt-finance';
  readonly notificationLabel: string;
  readonly stateChange: string;
  /** Is this a UI preview only notification (no backend)? */
  readonly previewOnly: true;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
};

/**
 * After captain submits PoD, these downstream events are expected.
 * All are preview-only — actual delivery requires WLT + backend.
 */
export const DSH_CAPTAIN_POD_DOWNSTREAM: readonly DshCaptainPodDownstreamTarget[] = [
  {
    surface: 'app-client',
    notificationLabel: 'إشعار: "تم تسليم طلبك"',
    stateChange: 'client state → delivered',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    surface: 'app-partner',
    notificationLabel: 'تحديث حالة الطلب: "تم التوصيل"',
    stateChange: 'partner order list → delivered',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    surface: 'control-panel',
    notificationLabel: 'الطلب يُغلق في Operations + يُضاف لـ COD pending settlement',
    stateChange: 'ops order → closed + finance cod list → new entry',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    surface: 'wlt-finance',
    notificationLabel: 'بدء احتساب تسوية الكابتن (COD + عمولة)',
    stateChange: 'wlt settlement queue → captain entry added',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
] as const;

// ─── Support escalation context ───────────────────────────────────────────────

export type DshCaptainSupportEscalationContext = {
  readonly escalationReason: string;
  readonly captainRoute: DshCaptainRoute;
  readonly controlPanelSection: 'operations' | 'support';
  readonly controlPanelWorkspace: string;
  readonly signalKind: DshSignalEventKind;
  readonly priority: 'normal' | 'important' | 'urgent';
  readonly label: string;
};

export const DSH_CAPTAIN_SUPPORT_ESCALATION_MAP: readonly DshCaptainSupportEscalationContext[] = [
  {
    escalationReason: 'pickup_failed',
    captainRoute: 'support-screen',
    controlPanelSection: 'operations',
    controlPanelWorkspace: 'order-rescue',
    signalKind: 'order_rescue_requested',
    priority: 'urgent',
    label: 'فشل الاستلام — يحتاج Order Rescue',
  },
  {
    escalationReason: 'delivery_failed',
    captainRoute: 'support-screen',
    controlPanelSection: 'operations',
    controlPanelWorkspace: 'order-rescue',
    signalKind: 'order_rescue_requested',
    priority: 'urgent',
    label: 'فشل التسليم — يحتاج Order Rescue',
  },
  {
    escalationReason: 'customer_unreachable',
    captainRoute: 'support-screen',
    controlPanelSection: 'support',
    controlPanelWorkspace: 'customer-360',
    signalKind: 'ticket_escalated',
    priority: 'important',
    label: 'العميل غير متاح — تواصل مع الدعم',
  },
  {
    escalationReason: 'address_issue',
    captainRoute: 'support-screen',
    controlPanelSection: 'support',
    controlPanelWorkspace: 'manual-call-intake',
    signalKind: 'manual_call_intake_requested',
    priority: 'important',
    label: 'مشكلة عنوان — الدعم يتواصل مع العميل',
  },
  {
    escalationReason: 'cod_dispute',
    captainRoute: 'account-finance',
    controlPanelSection: 'support',
    controlPanelWorkspace: 'customer-360',
    signalKind: 'ticket_escalated',
    priority: 'important',
    label: 'نزاع COD — مراجعة مالية مطلوبة',
  },
] as const;

export function getCaptainEscalationContext(
  reason: string,
): DshCaptainSupportEscalationContext | undefined {
  return DSH_CAPTAIN_SUPPORT_ESCALATION_MAP.find((e) => e.escalationReason === reason);
}

// ─── Lifecycle handoff integration ───────────────────────────────────────────

/**
 * Returns all lifecycle handoffs that require an action from the captain surface.
 * Import from dsh-order-lifecycle-handoffs to get full cross-surface picture.
 */
export function getCaptainActionableHandoffs(): readonly DshOrderLifecycleHandoff[] {
  return getHandoffsForSurface('app-captain').filter((h) =>
    h.surfaceObservations.some((o) => o.surfaceId === 'app-captain' && o.actionRequired),
  );
}
