/**
 * DSH Client ↔ WLT Payment Bridge
 * LIVE — WLT backend binding is active (J-003).
 *
 * Maps client-side payment states to WLT intents for display purposes.
 * Defines the exact boundary between what DSH shows and what WLT owns.
 *
 * Rules (non-negotiable):
 *   - DSH NEVER writes to WLT ledger, wallet, or payment systems.
 *   - DSH NEVER computes fees, commissions, refund amounts, or balances.
 *   - DSH displays WLT-provided values in read-only format only.
 *   - contractState 'LIVE' means the WLT backend binding is active and
 *     payment sessions flow through WLT POST /payment/sessions.
 *
 * Consumers: DshClientSurface (checkout/tracking), dsh-client.navigation-bridge.ts
 */

import type { DshClientState } from '../shared/client-state';
import type { DshFulfillmentDeliveryMode } from '../shared/dsh-delivery-mode.model';
import type { DshSignalEventKind } from '../shared/dsh-signal-layer.model';

// ─── WLT intent types ─────────────────────────────────────────────────────────

export type DshWltIntentKind =
  | 'payment_initiation'   // Client initiates payment — WLT validates and deducts
  | 'payment_hold'         // WLT holds amount pending order confirmation
  | 'payment_capture'      // WLT captures held amount after order confirmed
  | 'payment_release'      // WLT releases hold if order cancelled before capture
  | 'refund_initiation'    // WLT initiates refund to original payment method
  | 'refund_completion'    // WLT confirms refund is processed
  | 'wallet_credit'        // WLT credits client wallet (promo, refund to wallet)
  | 'wallet_debit'         // WLT debits client wallet for purchase
  | 'no_wlt_action';       // No WLT action at this client state

export type DshWltIntentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'not_applicable';

// ─── Client state → WLT intent mapping ───────────────────────────────────────

export type DshClientWltIntentEntry = {
  readonly clientState: DshClientState;
  readonly intentKind: DshWltIntentKind;
  readonly label: string;
  readonly statusHint: DshWltIntentStatus;
  /** What the client UI should show while WLT processes */
  readonly clientUiHint: string;
  /** Is a wallet balance visible to the client at this state? */
  readonly walletBalanceVisible: boolean;
  /** Is refund eligibility visible? */
  readonly refundEligibilityVisible: boolean;
  /** Signal emitted when WLT completes this intent */
  readonly completionSignal?: DshSignalEventKind;
  readonly dshReadOnly: true;
  readonly mutationForbidden: true;
  readonly contractState: 'LIVE';
};

export const DSH_CLIENT_WLT_INTENT_MAP: readonly DshClientWltIntentEntry[] = [

  // Pre-order states — no WLT action
  { clientState: 'quote',               intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — مرحلة التسعير',             statusHint: 'not_applicable', clientUiHint: 'يُعرض السعر التقديري فقط', walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'serviceability',      intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — فحص التغطية',              statusHint: 'not_applicable', clientUiHint: 'فحص قابلية التوصيل جارٍ',  walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'store_open',          intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — المتجر مفتوح',             statusHint: 'not_applicable', clientUiHint: '',                           walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'store_closed',        intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — المتجر مغلق',              statusHint: 'not_applicable', clientUiHint: '',                           walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'area_unserviceable',  intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — خارج التغطية',             statusHint: 'not_applicable', clientUiHint: '',                           walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'item_unavailable',    intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — عنصر غير متاح',            statusHint: 'not_applicable', clientUiHint: '',                           walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'cart_empty',          intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — السلة فارغة',              statusHint: 'not_applicable', clientUiHint: '',                           walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'cart_ready',          intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — السلة جاهزة',             statusHint: 'not_applicable', clientUiHint: '',                           walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },

  // Checkout — WLT quote becomes real
  { clientState: 'checkout_ready',      intentKind: 'payment_initiation',  label: 'WLT يُهيئ الدفع — اختيار الوسيلة',        statusHint: 'pending',        clientUiHint: 'اختر وسيلة الدفع',          walletBalanceVisible: true,  refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },

  // Payment in flight
  { clientState: 'payment_pending',     intentKind: 'payment_hold',        label: 'WLT يحتجز المبلغ — جارٍ التحقق',          statusHint: 'processing',     clientUiHint: 'جارٍ تأكيد الدفع...',       walletBalanceVisible: true,  refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'payment_failed',      intentKind: 'payment_release',     label: 'WLT أطلق الاحتجاز — الدفع فشل',          statusHint: 'failed',         clientUiHint: 'فشل الدفع — أعد المحاولة',  walletBalanceVisible: true,  refundEligibilityVisible: false, completionSignal: 'payment_failed', dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },

  // Order live
  { clientState: 'order_created',       intentKind: 'payment_capture',     label: 'WLT يستكمل الخصم — الطلب أُنشئ',          statusHint: 'processing',     clientUiHint: 'تم الطلب — جارٍ التأكيد',   walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'order_confirmed',     intentKind: 'no_wlt_action',       label: 'WLT أكّد الخصم — الطلب مؤكد',            statusHint: 'completed',      clientUiHint: 'الطلب مؤكد',                walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'tracking_active',     intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — الطلب في التوصيل',         statusHint: 'not_applicable', clientUiHint: 'تتبع طلبك',                  walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },

  // Completion
  { clientState: 'delivered',           intentKind: 'no_wlt_action',       label: 'WLT يُغلق المعاملة — تم التسليم',          statusHint: 'completed',      clientUiHint: 'تم تسليم طلبك',             walletBalanceVisible: false, refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'cancelled',           intentKind: 'refund_initiation',   label: 'WLT يُبدأ الاسترداد — الطلب ملغى',        statusHint: 'processing',     clientUiHint: 'جارٍ معالجة الاسترداد',    walletBalanceVisible: false, refundEligibilityVisible: true,  completionSignal: 'refund_pending_wlt', dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'failed',              intentKind: 'refund_initiation',   label: 'WLT يُبدأ الاسترداد — الطلب فشل',         statusHint: 'processing',     clientUiHint: 'جارٍ معالجة الاسترداد',    walletBalanceVisible: false, refundEligibilityVisible: true,  completionSignal: 'refund_pending_wlt', dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },

  // Refund flow
  { clientState: 'refund_pending',      intentKind: 'refund_initiation',   label: 'WLT يُعالج الاسترداد',                     statusHint: 'processing',     clientUiHint: 'جارٍ استرداد المبلغ...',   walletBalanceVisible: true,  refundEligibilityVisible: true,  completionSignal: 'refund_pending_wlt', dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'refunded',            intentKind: 'refund_completion',   label: 'WLT أكّد الاسترداد الكامل',               statusHint: 'completed',      clientUiHint: 'تم استرداد المبلغ',         walletBalanceVisible: true,  refundEligibilityVisible: false, completionSignal: 'refund_completed_wlt', dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },

  // Support / wallet states
  { clientState: 'support_required',    intentKind: 'no_wlt_action',       label: 'لا إجراء WLT — ينتظر قرار الدعم',         statusHint: 'pending',        clientUiHint: 'تواصل مع الدعم',            walletBalanceVisible: false, refundEligibilityVisible: true,  dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'wallet_credit_visible', intentKind: 'wallet_credit',     label: 'WLT أودع رصيد في المحفظة — مرئي للعميل',  statusHint: 'completed',      clientUiHint: 'رصيد أُضيف لمحفظتك',       walletBalanceVisible: true,  refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
  { clientState: 'wallet_refund_visible', intentKind: 'wallet_credit',     label: 'WLT أكّد استرداد إلى المحفظة',            statusHint: 'completed',      clientUiHint: 'تم رد المبلغ لمحفظتك',     walletBalanceVisible: true,  refundEligibilityVisible: false, dshReadOnly: true, mutationForbidden: true, contractState: 'LIVE' },
] as const;

// ─── Payment method → WLT debit intent ───────────────────────────────────────

export type DshClientPaymentMethodWltEntry = {
  readonly methodId: string;
  readonly methodLabel: string;
  readonly intentKind: 'wallet_debit' | 'payment_initiation';
  /** Is balance deducted from WLT wallet? */
  readonly fromWltWallet: boolean;
  /** Is this an external payment gateway (card, bank, telecom)? */
  readonly externalGateway: boolean;
  readonly wltOwner: 'wlt';
  readonly dshReadOnly: true;
  readonly contractState: 'LIVE';
};

export const DSH_CLIENT_PAYMENT_METHOD_WLT_MAP: readonly DshClientPaymentMethodWltEntry[] = [
  { methodId: 'wallet',       methodLabel: 'محفظة بثواني',     intentKind: 'wallet_debit',         fromWltWallet: true,  externalGateway: false, wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'card',         methodLabel: 'بطاقة ائتمانية',   intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'mastercard',   methodLabel: 'ماستر كارد',        intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'jawal',        methodLabel: 'جوالي',             intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'jeeb',         methodLabel: 'محفظة جيب',         intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'cash',         methodLabel: 'نقد',               intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: false, wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'one_cash',     methodLabel: 'ONE كاش',           intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'karimi',       methodLabel: 'بنك الكريمي',       intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'eazy',         methodLabel: 'ايزي',              intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'saba',         methodLabel: 'سباكاش',            intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'shamel',       methodLabel: 'شامل موني',         intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'mobile_money', methodLabel: 'موبايل موني',       intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'tadamon',      methodLabel: 'بنك التضامن',       intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { methodId: 'pace',         methodLabel: 'بيس',               intentKind: 'payment_initiation',   fromWltWallet: false, externalGateway: true,  wltOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
] as const;

// ─── COD delivery mode payment bridge ────────────────────────────────────────

/**
 * COD is only available for bthwani_delivery.
 * For partner_delivery and pickup, cash collection policies differ.
 */
export type DshClientCodPaymentEntry = {
  readonly mode: DshFulfillmentDeliveryMode;
  readonly codAllowed: boolean;
  readonly codReason: string;
  readonly wltCodOwner: 'wlt';
  readonly dshReadOnly: true;
  readonly contractState: 'LIVE';
};

export const DSH_CLIENT_COD_BY_MODE: readonly DshClientCodPaymentEntry[] = [
  { mode: 'bthwani_delivery', codAllowed: true,  codReason: 'الكابتن يحصّل النقد عند التسليم — WLT يتتبع ذمة COD', wltCodOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { mode: 'partner_delivery', codAllowed: false, codReason: 'موصل المتجر لا يحصّل نقد عبر WLT حالياً',             wltCodOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
  { mode: 'pickup',           codAllowed: false, codReason: 'الاستلام الذاتي لا يشمل تحصيل COD',                  wltCodOwner: 'wlt', dshReadOnly: true, contractState: 'LIVE' },
] as const;

// ─── Lookup functions ─────────────────────────────────────────────────────────

export function getClientWltIntentForState(
  state: DshClientState,
): DshClientWltIntentEntry | undefined {
  return DSH_CLIENT_WLT_INTENT_MAP.find((e) => e.clientState === state);
}

export function getPaymentMethodWltEntry(
  methodId: string,
): DshClientPaymentMethodWltEntry | undefined {
  return DSH_CLIENT_PAYMENT_METHOD_WLT_MAP.find((e) => e.methodId === methodId);
}

export function isCodAllowedForMode(mode: DshFulfillmentDeliveryMode): boolean {
  return DSH_CLIENT_COD_BY_MODE.find((e) => e.mode === mode)?.codAllowed ?? false;
}

/**
 * Returns true if the client should see wallet balance at the given state.
 * Delegates decision to the intent map — no inline logic.
 */
export function shouldShowWalletBalanceAtState(state: DshClientState): boolean {
  return getClientWltIntentForState(state)?.walletBalanceVisible ?? false;
}

/**
 * Returns true if the client should see refund eligibility at the given state.
 */
export function shouldShowRefundEligibilityAtState(state: DshClientState): boolean {
  return getClientWltIntentForState(state)?.refundEligibilityVisible ?? false;
}
