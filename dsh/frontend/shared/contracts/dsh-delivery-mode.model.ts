/**
 * DSH Delivery Mode Model
 *
 * SSoT for delivery mode definitions across all DSH surfaces.
 * Each mode governs how an order is physically fulfilled:
 * cart behavior, checkout selection, partner preparation,
 * captain involvement, CP dispatch, tracking timeline,
 * handoff, support escalation, and notification events.
 *
 * WLT boundary: All delivery modes are financially owned by WLT.
 * DSH surfaces display mode data only — no financial mutation permitted.
 *
 * Mode rules (enforced at type and data level):
 * - bthwani_delivery : captain assignment + pickup + PoD all required
 * - partner_delivery : no captain; store courier manages fulfillment
 * - pickup           : no captain, no courier; client collects at store
 *
 * Surface display rules (enforced via forbiddenUiClaims and helper functions):
 * - Captain tracking shown ONLY for bthwani_delivery
 * - Dispatch queue entered ONLY for bthwani_delivery
 * - Dropoff address shown ONLY for bthwani_delivery and partner_delivery
 * - PoD required ONLY for bthwani_delivery
 * - Partner courier status shown ONLY for partner_delivery
 * - Store pickup instructions shown ONLY for pickup
 */

// ─── Canonical type ───────────────────────────────────────────────────────────
//
// This is the shared SSoT for the delivery mode identifier.
// Structurally identical to DshFulfillmentDeliveryMode in:
//   - dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts
//   - dsh/frontend/control-panel/operations/operations.types.ts
// Those files may import from here in future; for now all three are compatible
// structural aliases (same literal union).

export type DshFulfillmentDeliveryMode =
  | 'bthwani_delivery'
  | 'partner_delivery'
  | 'pickup';

// ─── Supporting types ─────────────────────────────────────────────────────────

export type DshDeliveryModeCaptainInvolvement =
  | 'full'   // Assignment + pickup + captain tracking + PoD all required
  | 'none';  // No captain — not dispatched, not tracked, not assigned

export type DshDeliveryModeTrackingStageFilter = {
  readonly showCaptainStages: boolean;
  readonly showPickupStoreInstructions: boolean;
  readonly showPartnerCourierStatus: boolean;
  readonly showDeliveryDropoffAddress: boolean;
};

// ─── Mode definition interface ────────────────────────────────────────────────
//
// One entry per delivery mode. All fields are readonly.
// No field is optional — every mode must declare explicit behavior for every axis.

export type DshDeliveryModeDefinition = {
  readonly modeId: DshFulfillmentDeliveryMode;
  /** Arabic label shown across all surfaces */
  readonly label: string;
  /** Ionicons / ui-kit icon token */
  readonly icon: string;
  /** Human-readable operational owner for CP operations views */
  readonly operationalOwner: string;
  /**
   * Financial owner — always 'WLT' for every mode.
   * DSH never mutates payment/fee/refund/payout data.
   */
  readonly financialOwner: 'WLT';

  // ── Actor flags ─────────────────────────────────────────────────────────
  readonly requiresCaptain: boolean;
  readonly requiresPartnerCourier: boolean;
  readonly requiresCustomerPickup: boolean;
  readonly captainInvolvement: DshDeliveryModeCaptainInvolvement;

  // ── Cart and checkout ────────────────────────────────────────────────────
  /** What the client cart section shows for this mode */
  readonly cartSummaryBehavior: string;
  /** Checkout-screen behavior and CTA for this mode */
  readonly clientCheckoutBehavior: string;

  // ── Partner preparation ─────────────────────────────────────────────────
  /** What the partner app prep workflow looks like under this mode */
  readonly partnerPreparationBehavior: string;

  // ── CP dispatch ──────────────────────────────────────────────────────────
  /** Whether this mode enters the captain dispatch assignment queue */
  readonly requiresDispatch: boolean;
  /** How CP operations views handle dispatch for this mode */
  readonly controlPanelDispatchBehavior: string;

  // ── Tracking timeline ───────────────────────────────────────────────────
  /** Describes which tracking stages are shown to the client for this mode */
  readonly trackingTimelineBehavior: string;
  readonly showCaptainTracking: boolean;
  readonly showPartnerCourierTracking: boolean;

  // ── Handoff ─────────────────────────────────────────────────────────────
  /** Describes the physical handoff flow for this mode */
  readonly handoffBehavior: string;

  // ── Support ──────────────────────────────────────────────────────────────
  /** Default support escalation path for issues in this mode */
  readonly supportFallback: string;

  // ── Notification events ──────────────────────────────────────────────────
  /** Signal event IDs that are relevant for this mode (subset of DshSignalEventId) */
  readonly notificationEvents: ReadonlyArray<string>;

  // ── WLT boundary ─────────────────────────────────────────────────────────
  /**
   * Always true — DSH never mutates financial data for any delivery mode.
   * Fees, refunds, payouts and settlements are WLT-owned and read-only in DSH.
   */
  readonly wltDisplayImpactOnly: true;

  // ── UI safety constraints ─────────────────────────────────────────────────
  /**
   * UI claims that are FORBIDDEN for this mode.
   * The display layer must not render these elements when this mode is active.
   */
  readonly forbiddenUiClaims: ReadonlyArray<string>;
};

// ─── DSH_DELIVERY_MODE_DEFINITIONS ───────────────────────────────────────────
//
// Three entries — one per mode. Order: bthwani_delivery first (platform default),
// then partner_delivery, then pickup.

export const DSH_DELIVERY_MODE_DEFINITIONS: ReadonlyArray<DshDeliveryModeDefinition> = [
  // ── bthwani_delivery ──────────────────────────────────────────────────────
  {
    modeId: 'bthwani_delivery',
    label: 'توصيل بثواني',
    icon: 'bicycle-outline',
    operationalOwner: 'DSH Operations + Captain',
    financialOwner: 'WLT',

    requiresCaptain: true,
    requiresPartnerCourier: false,
    requiresCustomerPickup: false,
    captainInvolvement: 'full',

    cartSummaryBehavior:
      'يعرض وقت التوصيل المقدر (ETA) ورسوم الخدمة — كلاهما من WLT بصيغة عرض فقط.',
    clientCheckoutBehavior:
      'يختار العميل توصيل بثواني كقناة التوصيل — يظهر ETA والرسوم من WLT. لا تحرير مالي داخل DSH.',

    partnerPreparationBehavior:
      'يجهّز الشريك الطلب ويضغط "جاهز للاستلام" — يُشغّل تعيين الكابتن تلقائيًا.',

    requiresDispatch: true,
    controlPanelDispatchBehavior:
      'يدخل قائمة انتظار التعيين — يختار المشرف الكابتن يدويًا أو تتم العملية تلقائيًا بحسب المنطقة والتوفر.',

    trackingTimelineBehavior:
      'يعرض كل المراحل: تعيين كابتن → في الطريق للاستلام → وصل للمتجر → استلم الطلب → في الطريق إليك → قريب → عند الباب → قرع الجرس → تسليم → إثبات تسليم.',
    showCaptainTracking: true,
    showPartnerCourierTracking: false,

    handoffBehavior:
      'الكابتن يستلم من المتجر ويسلّم للعميل وجهًا لوجه — مطلوب إثبات التسليم (PoD) قبل إغلاق المهمة.',

    supportFallback:
      'تصعيد للعمليات عبر نظام تذاكر الدعم — يُربط بمعرّف الطلب والكابتن.',

    notificationEvents: [
      'order_created',
      'captain_assigned',
      'captain_declined',
      'reassignment_required',
      'picked_up',
      'near_customer',
      'bell_rang',
      'delivered',
      'delivery_failed',
    ],

    wltDisplayImpactOnly: true,

    forbiddenUiClaims: [
      'show-partner-courier-tracking',   // No partner courier in this mode
      'show-pickup-only-instructions',   // Client does not collect at store
      'hide-captain-assignment',         // Captain assignment is required
      'skip-proof-of-delivery',          // PoD is mandatory
      'show-store-location-as-dropoff',  // Dropoff is client address, not store
    ],
  },

  // ── partner_delivery ──────────────────────────────────────────────────────
  {
    modeId: 'partner_delivery',
    label: 'توصيل المتجر',
    icon: 'storefront-outline',
    operationalOwner: 'Partner / Store Courier',
    financialOwner: 'WLT',

    requiresCaptain: false,
    requiresPartnerCourier: true,
    requiresCustomerPickup: false,
    captainInvolvement: 'none',

    cartSummaryBehavior:
      'يعرض توصيل المتجر كخيار — ETA تقديري من الشريك، لا رسوم تعيين كابتن إضافية.',
    clientCheckoutBehavior:
      'يختار العميل توصيل المتجر — لا كابتن، لا تتبع GPS للكابتن، يظهر ETA من المتجر.',

    partnerPreparationBehavior:
      'يجهّز الشريك الطلب وينظّم التوصيل عبر موصله الخاص — لا تعيين كابتن من المنصة.',

    requiresDispatch: false,
    controlPanelDispatchBehavior:
      'لا يدخل قائمة تعيين الكابتن — يُراقَب فقط كـ store-delivery monitoring في لوحة العمليات.',

    trackingTimelineBehavior:
      'مراحل محدودة: استلم المتجر الطلب → موصل المتجر في الطريق → تم التسليم. لا مراحل كابتن.',
    showCaptainTracking: false,
    showPartnerCourierTracking: true,

    handoffBehavior:
      'موصل المتجر يسلّم للعميل مباشرة — PoD اختياري حسب سياسة الشريك المتفق عليها.',

    supportFallback:
      'تواصل مع الشريك أولًا → تصعيد للعمليات إذا لم يُحل خلال SLA المتفق عليه.',

    notificationEvents: [
      'order_created',
      'partner_accepted',
      'partner_rejected',
      'delivered',
      'delivery_failed',
    ],

    wltDisplayImpactOnly: true,

    forbiddenUiClaims: [
      'show-captain-tracking',           // No captain in this mode
      'show-captain-assignment',         // No captain assignment
      'show-captain-bell-event',         // No captain bell
      'show-proof-of-delivery-captain',  // PoD is partner-managed, not captain
      'enter-dispatch-queue',            // Not dispatched by platform
    ],
  },

  // ── pickup ─────────────────────────────────────────────────────────────────
  {
    modeId: 'pickup',
    label: 'استلام بنفسك',
    icon: 'bag-handle-outline',
    operationalOwner: 'Client + Store',
    financialOwner: 'WLT',

    requiresCaptain: false,
    requiresPartnerCourier: false,
    requiresCustomerPickup: true,
    captainInvolvement: 'none',

    cartSummaryBehavior:
      'يعرض موقع المتجر ووقت الجاهزية التقديري — لا رسوم توصيل.',
    clientCheckoutBehavior:
      'يختار العميل الاستلام بنفسه — يظهر موقع المتجر وتعليمات الاستلام. لا كابتن. لا موصل.',

    partnerPreparationBehavior:
      'يجهّز الشريك الطلب ويُشير إلى الجاهزية — العميل هو من يأتي للاستلام.',

    requiresDispatch: false,
    controlPanelDispatchBehavior:
      'لا يدخل قائمة الإسناد إطلاقًا — يُراقَب فقط كـ store-readiness (العميل يستلم).',

    trackingTimelineBehavior:
      'مراحل الاستلام فقط: استلم المتجر الطلب → قيد التجهيز → جاهز للاستلام → إشعار العميل → تأكيد الاستلام. لا كابتن. لا موصل.',
    showCaptainTracking: false,
    showPartnerCourierTracking: false,

    handoffBehavior:
      'العميل يصل للمتجر ويستلم بنفسه — لا توصيل. لا PoD مطلوب.',

    supportFallback:
      'تواصل مع المتجر مباشرة → تصعيد للعمليات عند عدم الحل.',

    notificationEvents: [
      'order_created',
      'partner_accepted',
      'partner_ready',
      'delivered',
    ],

    wltDisplayImpactOnly: true,

    forbiddenUiClaims: [
      'show-captain-tracking',           // No captain in pickup mode
      'show-captain-assignment',         // No captain assignment
      'show-captain-bell-event',         // No captain bell
      'show-partner-courier-tracking',   // No courier
      'show-dropoff-address',            // No dropoff — client goes to store
      'enter-dispatch-queue',            // Not dispatched
      'require-proof-of-delivery',       // No PoD in pickup mode
    ],
  },
] as const;

// ─── Lookup function ──────────────────────────────────────────────────────────

/**
 * Returns the full mode definition for a given delivery mode.
 * Non-nullable — all three modes are always covered in the constant.
 */
export function getDshDeliveryModeDefinition(
  mode: DshFulfillmentDeliveryMode,
): DshDeliveryModeDefinition {
  // DSH_DELIVERY_MODE_DEFINITIONS covers all three union members — find() is always non-null.
  return DSH_DELIVERY_MODE_DEFINITIONS.find((d) => d.modeId === mode) as DshDeliveryModeDefinition;
}

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Arabic actor label for a delivery mode.
 * Used by operations, dispatch, support, and signal surfaces.
 *
 * bthwani_delivery → 'الكابتن'
 * partner_delivery → 'موصل المتجر'
 * pickup           → 'العميل'
 */
export function getDshDeliveryModeActorLabel(mode: DshFulfillmentDeliveryMode): string {
  switch (mode) {
    case 'bthwani_delivery': return 'الكابتن';
    case 'partner_delivery': return 'موصل المتجر';
    case 'pickup':           return 'العميل';
  }
}

/**
 * Returns true only for bthwani_delivery.
 *
 * Guard for: captain dispatch queue, captain assignment UI,
 * captain tracking cards, bell event display, and PoD flow.
 */
export function isDshModeDispatchRequired(mode: DshFulfillmentDeliveryMode): boolean {
  return mode === 'bthwani_delivery';
}

/**
 * Returns true only for bthwani_delivery.
 *
 * Guard for: captain-tracking section, proximity state display,
 * bell event card, and proof-of-delivery screen.
 */
export function isDshModeCaptainTrackingVisible(mode: DshFulfillmentDeliveryMode): boolean {
  return mode === 'bthwani_delivery';
}

/**
 * Returns the tracking stage filter configuration for a delivery mode.
 * Use to conditionally render timeline stages in OrdersTrackingScreens
 * and the CP live-orders view.
 *
 * Rules:
 * - showCaptainStages:           bthwani_delivery only
 * - showPickupStoreInstructions: pickup only
 * - showPartnerCourierStatus:    partner_delivery only
 * - showDeliveryDropoffAddress:  bthwani_delivery and partner_delivery (not pickup)
 */
export function getDshModeTrackingStageFilter(
  mode: DshFulfillmentDeliveryMode,
): DshDeliveryModeTrackingStageFilter {
  return {
    showCaptainStages:            mode === 'bthwani_delivery',
    showPickupStoreInstructions:  mode === 'pickup',
    showPartnerCourierStatus:     mode === 'partner_delivery',
    showDeliveryDropoffAddress:   mode !== 'pickup',
  };
}

/**
 * Type guard — returns true if the value is a valid DshFulfillmentDeliveryMode.
 * Safe to call with any unknown string from API or user input.
 */
export function isDshFulfillmentDeliveryMode(
  value: string | null | undefined,
): value is DshFulfillmentDeliveryMode {
  return value === 'bthwani_delivery' || value === 'partner_delivery' || value === 'pickup';
}
