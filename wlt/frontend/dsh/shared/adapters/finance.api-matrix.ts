/**
 * WLT DSH Finance — Screen / API / Domain Matrix.
 * Maps each canonical finance group to its WLT OpenAPI endpoint.
 * WLT has an HTTP+SQLite DSH finance runtime for the bound slice.
 * DSH role: view_only or initiate_only (no ledger write).
 *
 * Primary entries are keyed by CanonicalFinanceGroupId.
 * Legacy alias entries are kept for backward compatibility only — they map to
 * the canonical group via aliasFor; they are NOT the authoritative source.
 */

import type { CanonicalFinanceGroupId, FinanceWorkspaceInput } from '../contracts/financeRouting.types';

export type WltApiMethod = 'GET' | 'POST';
export type WltEndpointStatus = 'exact' | 'BLOCKED_BY_MISSING_WLT_CONTRACT';

export type DshFinanceApiBinding = {
  readonly screen: FinanceWorkspaceInput;
  readonly screenLabel: string;
  readonly wltEndpoint: string;
  readonly operationId: string;
  readonly httpMethod: WltApiMethod;
  readonly endpointStatus: WltEndpointStatus;
  readonly dshRole: 'view_only' | 'initiate_only';
  readonly requiresIdempotency: boolean;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' | 'WLT_DSH_RUNTIME_BOUND';
  readonly isImplemented: boolean;
  readonly ownerService: 'wlt';
  readonly forbiddenActions: readonly string[];
  readonly displayDomain: string;
  /** If set, this entry is a legacy alias pointing to the canonical group. */
  readonly aliasFor?: CanonicalFinanceGroupId;
};

// ─── Canonical Group Entries (authoritative) ──────────────────────────────────

const CANONICAL_MATRIX: readonly DshFinanceApiBinding[] = [
  {
    screen: 'financial-command-center',
    screenLabel: 'مركز القيادة المالية',
    wltEndpoint: '/wlt/dsh/control-panel/finance/overview',
    operationId: 'getControlPanelFinanceOverview',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'WLT_DSH_RUNTIME_BOUND',
    isImplemented: true,
    ownerService: 'wlt',
    forbiddenActions: ['ledger_write', 'settlement_approve', 'payout_release', 'close_day'],
    displayDomain: 'الإجماليات اليومية، المركز المالي الصافي، الفوارق، جاهزية الإغلاق',
  },
  {
    screen: 'ledger-order-finance',
    screenLabel: 'دفتر الأستاذ ومالية الطلبات',
    wltEndpoint: '/wlt/dsh/control-panel/ledger-entries',
    operationId: 'listControlPanelLedgerEntries',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'WLT_DSH_RUNTIME_BOUND',
    isImplemented: true,
    ownerService: 'wlt',
    forbiddenActions: ['journal_entry', 'balance_adjust', 'ledger_write', 'entry_delete'],
    displayDomain: 'قيود اليومية، ميزان المراجعة، دورة حياة الطلب المالي',
  },
  {
    screen: 'payments-wallets',
    screenLabel: 'المدفوعات والمحافظ',
    wltEndpoint: '/wlt/dsh/control-panel/payments-wallets',
    operationId: 'listControlPanelPaymentsWallets',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'WLT_DSH_RUNTIME_BOUND',
    isImplemented: true,
    ownerService: 'wlt',
    forbiddenActions: ['direct_transfer', 'bank_write', 'balance_debit', 'wallet_credit'],
    displayDomain: 'أرصدة المحافظ، طرق الدفع، كشوف حساب العملاء والكباتن',
  },
  {
    screen: 'settlements-payouts',
    screenLabel: 'التسويات والدفعات',
    wltEndpoint: '/wlt/dsh/control-panel/settlement-cycles',
    operationId: 'listControlPanelSettlementCycles',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'initiate_only',
    requiresIdempotency: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['settlement_approve', 'payout_release', 'cycle_close', 'direct_transfer'],
    displayDomain: 'دورات تسوية الشركاء، الكباتن، الميدانيين، متاجر التوصيل، والتحويلات البنكية',
  },
  {
    screen: 'refunds-disputes-holds',
    screenLabel: 'الاستردادات والنزاعات والحجوزات',
    wltEndpoint: '/wlt/dsh/control-panel/refund-queue',
    operationId: 'listControlPanelRefundQueue',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['refund_approve', 'refund_reject', 'hold_release', 'dispute_close'],
    displayDomain: 'قائمة حالات الاسترداد، النزاعات المفتوحة، المبالغ المحجوزة',
  },
  {
    screen: 'commissions-fees-promo',
    screenLabel: 'العمولات والرسوم والترويج',
    wltEndpoint: '/wlt/dsh/control-panel/commissions-fees',
    operationId: 'listControlPanelCommissionsFees',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['commission_adjust', 'fee_override', 'promo_credit', 'rate_write'],
    displayDomain: 'هياكل العمولات، رسوم المنصة، قسائم الترويج، الشركاء الترويجيون',
  },
  {
    screen: 'reconciliation-risk',
    screenLabel: 'المطابقة والمخاطر',
    wltEndpoint: '/wlt/dsh/control-panel/audit-events',
    operationId: 'listAuditEvents',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['audit_delete', 'event_suppress', 'risk_override', 'variance_close'],
    displayDomain: 'سجل أحداث التدقيق المالي، الفوارق، مؤشرات المخاطر، إغلاق اليوم',
  },
  {
    screen: 'reports-policies-approvals',
    screenLabel: 'التقارير والسياسات والاعتمادات',
    wltEndpoint: '/wlt/dsh/control-panel/reports',
    operationId: 'listControlPanelReports',
    httpMethod: 'GET',
    endpointStatus: 'exact',
    dshRole: 'view_only',
    requiresIdempotency: false,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    isImplemented: false,
    ownerService: 'wlt',
    forbiddenActions: ['report_delete', 'policy_write', 'approval_bypass', 'config_change'],
    displayDomain: 'تقارير مالية دورية، سياسات الدفع والتسوية، قرارات الاعتماد',
  },
] as const;

// ─── Legacy Alias Entries (compatibility — not authoritative) ─────────────────

const LEGACY_ALIAS_MATRIX: readonly DshFinanceApiBinding[] = [
  { screen: 'overview', screenLabel: 'مركز اليوم المالي', aliasFor: 'financial-command-center', wltEndpoint: '/wlt/dsh/control-panel/finance/overview', operationId: 'getControlPanelFinanceOverview', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['ledger_write', 'settlement_approve', 'payout_release'], displayDomain: 'إجمالي التدفقات، الفوارق، حالة الإغلاق المالي لليوم' },
  { screen: 'cod-reconciliation', screenLabel: 'مطابقة COD', aliasFor: 'reconciliation-risk', wltEndpoint: '/wlt/dsh/captain/cod-liabilities', operationId: 'getCaptainCodLiabilities', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['cod_release', 'cod_write_off', 'liability_close'], displayDomain: 'ذمم COD المعلقة لكل كابتن' },
  { screen: 'settlements', screenLabel: 'التسويات', aliasFor: 'settlements-payouts', wltEndpoint: '/wlt/dsh/partner/settlement-cycles', operationId: 'getPartnerSettlementCycles', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['settlement_approve', 'payout_release', 'cycle_close'], displayDomain: 'دورات تسوية الشركاء والكباتن والميدانيين' },
  { screen: 'payouts', screenLabel: 'المدفوعات', aliasFor: 'settlements-payouts', wltEndpoint: '/wlt/dsh/control-panel/payout-decisions', operationId: 'createPayoutDecision', httpMethod: 'POST', endpointStatus: 'exact', dshRole: 'initiate_only', requiresIdempotency: true, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['direct_transfer', 'bank_write', 'balance_debit'], displayDomain: 'قرارات تحضير المدفوعات — DSH يُعدّ القرار فقط، WLT ينفذه' },
  { screen: 'captain-eligibility', screenLabel: 'أهلية الكابتن', aliasFor: 'settlements-payouts', wltEndpoint: '/wlt/dsh/captain/eligibility', operationId: 'getCaptainEligibility', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['eligibility_override', 'balance_credit', 'block_lift'], displayDomain: 'رصيد الضمان والأهلية لكل كابتن' },
  { screen: 'refunds', screenLabel: 'الاستردادات', aliasFor: 'refunds-disputes-holds', wltEndpoint: '/wlt/dsh/control-panel/refund-queue', operationId: 'listControlPanelRefundQueue', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['refund_approve', 'refund_reject', 'refund_write'], displayDomain: 'قائمة حالات الاسترداد والنزاعات' },
  { screen: 'ledger', screenLabel: 'دفتر الأستاذ', aliasFor: 'ledger-order-finance', wltEndpoint: '/wlt/dsh/control-panel/ledger-entries', operationId: 'listControlPanelLedgerEntries', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['journal_entry', 'balance_adjust', 'ledger_write'], displayDomain: 'قيود اليومية وميزان المراجعة العام' },
  { screen: 'risk-audit', screenLabel: 'الفروقات والتدقيق', aliasFor: 'reconciliation-risk', wltEndpoint: '/wlt/dsh/control-panel/audit-events', operationId: 'listAuditEvents', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['audit_delete', 'event_suppress', 'risk_override'], displayDomain: 'سجل أحداث التدقيق المالي' },
  { screen: 'captain-finance', screenLabel: 'مالية الكباتن', aliasFor: 'settlements-payouts', wltEndpoint: '/wlt/dsh/captain/cod-liabilities', operationId: 'getCaptainCodLiabilities', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'WLT_DSH_RUNTIME_BOUND', isImplemented: true, ownerService: 'wlt', forbiddenActions: ['payout_release', 'cod_write_off', 'commission_adjust'], displayDomain: 'COD والمستحقات والعمولات لكباتن بثواني حصراً' },
  { screen: 'store-delivery-finance', screenLabel: 'مالية توصيل المتجر', aliasFor: 'commissions-fees-promo', wltEndpoint: '/wlt/dsh/store-delivery/finance-summary', operationId: 'getStoreDeliveryFinanceSummary', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['courier_payout', 'fee_adjust', 'compensation_override'], displayDomain: 'عمولات ورسوم موصلي المتاجر — مفصولة عن كباتن بثواني' },
] as const;

export const FINANCE_API_MATRIX: readonly DshFinanceApiBinding[] = [
  ...CANONICAL_MATRIX,
  ...LEGACY_ALIAS_MATRIX,
];

/** Look up by screen id — canonical groups take priority over legacy aliases. */
export function getFinanceApiBinding(screen: FinanceWorkspaceInput): DshFinanceApiBinding | undefined {
  // Canonical first
  const canonical = CANONICAL_MATRIX.find((b) => b.screen === screen);
  if (canonical) return canonical;
  // Fall back to legacy aliases
  return LEGACY_ALIAS_MATRIX.find((b) => b.screen === screen);
}

/** Look up canonical entry by CanonicalFinanceGroupId only. */
export function getCanonicalFinanceApiBinding(group: CanonicalFinanceGroupId): DshFinanceApiBinding | undefined {
  return CANONICAL_MATRIX.find((b) => b.screen === group);
}

export const FINANCE_IDEMPOTENCY_SCREENS = FINANCE_API_MATRIX
  .filter((b) => b.requiresIdempotency)
  .map((b) => b.screen);
