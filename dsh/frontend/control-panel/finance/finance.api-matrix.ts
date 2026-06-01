/**
 * P7 — Finance Screen / API / Domain Matrix
 *
 * يربط كل شاشة مالية في DSH بمسار WLT OpenAPI المقابل.
 * CONTRACT_SCAFFOLD_PREVIEW_ONLY — لا backend منفذ بعد.
 * DSH دور: view_only أو initiate_only (لا ledger write مباشر).
 *
 * المصدر: wlt/wlt.openapi.yaml v0.2.0-scaffold
 */

import type { CanonicalFinanceGroupId } from './finance.types';

export type WltApiMethod = 'GET' | 'POST';

export type DshFinanceApiBinding = {
  readonly screen: CanonicalFinanceGroupId;
  readonly screenLabel: string;
  // WLT OpenAPI endpoint
  readonly wltEndpoint: string;
  readonly operationId: string;
  readonly httpMethod: WltApiMethod;
  // DSH capability on this endpoint
  readonly dshRole: 'view_only' | 'initiate_only';
  // Idempotency-Key required on POST mutations
  readonly requiresIdempotency: boolean;
  // Contract state — all scaffold only, no backend
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly isImplemented: false;
  // Domain ownership
  readonly ownerService: 'wlt';
  // Forbidden DSH actions for this screen
  readonly forbiddenActions: readonly string[];
  // What this screen reads/displays
  readonly displayDomain: string;
};

export const FINANCE_API_MATRIX: readonly DshFinanceApiBinding[] = [
  {
    screen: 'overview',
    screenLabel: 'مركز اليوم المالي',
    wltEndpoint: '/wlt/dsh/control-panel/finance/overview',
    operationId: 'getControlPanelFinanceOverview',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['ledger_write', 'settlement_approve', 'payout_release'],
    displayDomain: 'إجمالي التدفقات، الفوارق، حالة الإغلاق المالي لليوم',
  },
  {
    screen: 'cod-reconciliation',
    screenLabel: 'مطابقة COD',
    wltEndpoint: '/wlt/dsh/captain/cod-liabilities',
    operationId: 'getCaptainCodLiabilities',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['cod_release', 'cod_write_off', 'liability_close'],
    displayDomain: 'ذمم COD المعلقة لكل كابتن — المتوقع vs الفعلي vs الفارق',
  },
  {
    screen: 'settlements',
    screenLabel: 'التسويات',
    wltEndpoint: '/wlt/dsh/partner/settlement-cycles',
    operationId: 'getPartnerSettlementCycles',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['settlement_approve', 'payout_release', 'cycle_close'],
    displayDomain: 'دورات تسوية الشركاء والكباتن والميدانيين',
  },
  {
    screen: 'payouts',
    screenLabel: 'المدفوعات',
    wltEndpoint: '/wlt/dsh/control-panel/payout-decisions',
    operationId: 'createPayoutDecision',
    httpMethod: 'POST',
    dshRole: 'initiate_only',
    requiresIdempotency: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['direct_transfer', 'bank_write', 'balance_debit'],
    displayDomain: 'قرارات إطلاق المدفوعات — DSH يُعدّ القرار فقط، WLT ينفذه',
  },
  {
    screen: 'captain-eligibility',
    screenLabel: 'أهلية الكابتن',
    wltEndpoint: '/wlt/dsh/captain/eligibility',
    operationId: 'getCaptainEligibility',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['eligibility_override', 'balance_credit', 'block_lift'],
    displayDomain: 'رصيد الضمان والأهلية لكل كابتن — من مؤهل ومن يحتاج شحن',
  },
  {
    screen: 'refunds',
    screenLabel: 'الاستردادات',
    wltEndpoint: '/wlt/dsh/control-panel/reconciliation-runs',
    operationId: 'listReconciliationRuns',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['refund_approve', 'refund_reject', 'refund_write'],
    displayDomain: 'طلبات الاسترداد والنزاعات عبر دورات المطابقة — WLT يقرر النتيجة؛ endpoint استرداد مستقل لم يُعرَّف في scaffold بعد',
  },
  {
    screen: 'ledger',
    screenLabel: 'دفتر الأستاذ',
    wltEndpoint: '/wlt/dsh/control-panel/finance/overview',
    operationId: 'getControlPanelFinanceOverview',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['journal_entry', 'balance_adjust', 'ledger_write'],
    displayDomain: 'قيود اليومية وميزان المراجعة — endpoint دفتر الأستاذ المستقل لم يُعرَّف في WLT scaffold بعد؛ يستخدم overview كبديل مؤقت',
  },
  {
    screen: 'risk-audit',
    screenLabel: 'الفروقات والتدقيق',
    wltEndpoint: '/wlt/dsh/control-panel/audit-events',
    operationId: 'listAuditEvents',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['audit_delete', 'event_suppress', 'risk_override'],
    displayDomain: 'سجل أحداث التدقيق المالي — كل فارق غير صفري يدخل هنا',
  },
  {
    screen: 'captain-finance',
    screenLabel: 'مالية الكباتن',
    wltEndpoint: '/wlt/dsh/captain/cod-liabilities',
    operationId: 'getCaptainCodLiabilities',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['payout_release', 'cod_write_off', 'commission_adjust'],
    displayDomain: 'COD والمستحقات والعمولات لكباتن بثواني (bthwani_captain_mode) حصراً',
  },
  {
    screen: 'store-delivery-finance',
    screenLabel: 'مالية توصيل المتجر',
    wltEndpoint: '/wlt/dsh/field/commissions',
    operationId: 'getFieldCommissions',
    httpMethod: 'GET',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['courier_payout', 'fee_adjust', 'compensation_override'],
    displayDomain: 'عمولات ورسوم موصلي المتاجر (store_courier_mode) — مفصولة عن كباتن بثواني؛ يستخدم field/commissions كأقرب endpoint متاح في scaffold',
  },
] as const;

/** Lookup matrix entry by screen ID */
export function getFinanceApiBinding(screen: CanonicalFinanceGroupId): DshFinanceApiBinding | undefined {
  return FINANCE_API_MATRIX.find((b) => b.screen === screen);
}

/** Returns all screens that require Idempotency-Key (POST mutations) */
export const FINANCE_IDEMPOTENCY_SCREENS = FINANCE_API_MATRIX
  .filter((b) => b.requiresIdempotency)
  .map((b) => b.screen);
