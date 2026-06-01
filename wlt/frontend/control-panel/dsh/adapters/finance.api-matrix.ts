/**
 * WLT DSH Finance — Screen / API / Domain Matrix.
 * Maps each canonical finance group to its WLT OpenAPI endpoint.
 * CONTRACT_SCAFFOLD_PREVIEW_ONLY — no backend implemented yet.
 * DSH role: view_only or initiate_only (no ledger write).
 */

import type { CanonicalFinanceGroupId, FinanceWorkspaceInput } from '../models/financeRouting.types';

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
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly isImplemented: false;
  readonly ownerService: 'wlt';
  readonly forbiddenActions: readonly string[];
  readonly displayDomain: string;
};

export const FINANCE_API_MATRIX: readonly DshFinanceApiBinding[] = [
  { screen: 'overview', screenLabel: 'مركز اليوم المالي', wltEndpoint: '/wlt/dsh/control-panel/finance/overview', operationId: 'getControlPanelFinanceOverview', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['ledger_write', 'settlement_approve', 'payout_release'], displayDomain: 'إجمالي التدفقات، الفوارق، حالة الإغلاق المالي لليوم' },
  { screen: 'cod-reconciliation', screenLabel: 'مطابقة COD', wltEndpoint: '/wlt/dsh/captain/cod-liabilities', operationId: 'getCaptainCodLiabilities', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['cod_release', 'cod_write_off', 'liability_close'], displayDomain: 'ذمم COD المعلقة لكل كابتن' },
  { screen: 'settlements', screenLabel: 'التسويات', wltEndpoint: '/wlt/dsh/partner/settlement-cycles', operationId: 'getPartnerSettlementCycles', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['settlement_approve', 'payout_release', 'cycle_close'], displayDomain: 'دورات تسوية الشركاء والكباتن والميدانيين' },
  { screen: 'payouts', screenLabel: 'المدفوعات', wltEndpoint: '/wlt/dsh/control-panel/payout-decisions', operationId: 'createPayoutDecision', httpMethod: 'POST', endpointStatus: 'exact', dshRole: 'initiate_only', requiresIdempotency: true, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['direct_transfer', 'bank_write', 'balance_debit'], displayDomain: 'قرارات تحضير المدفوعات — DSH يُعدّ القرار فقط، WLT ينفذه' },
  { screen: 'captain-eligibility', screenLabel: 'أهلية الكابتن', wltEndpoint: '/wlt/dsh/captain/eligibility', operationId: 'getCaptainEligibility', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['eligibility_override', 'balance_credit', 'block_lift'], displayDomain: 'رصيد الضمان والأهلية لكل كابتن' },
  { screen: 'refunds', screenLabel: 'الاستردادات', wltEndpoint: '/wlt/dsh/control-panel/refund-queue', operationId: 'listControlPanelRefundQueue', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['refund_approve', 'refund_reject', 'refund_write'], displayDomain: 'قائمة حالات الاسترداد والنزاعات' },
  { screen: 'ledger', screenLabel: 'دفتر الأستاذ', wltEndpoint: '/wlt/dsh/control-panel/ledger-entries', operationId: 'listControlPanelLedgerEntries', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['journal_entry', 'balance_adjust', 'ledger_write'], displayDomain: 'قيود اليومية وميزان المراجعة العام' },
  { screen: 'risk-audit', screenLabel: 'الفروقات والتدقيق', wltEndpoint: '/wlt/dsh/control-panel/audit-events', operationId: 'listAuditEvents', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['audit_delete', 'event_suppress', 'risk_override'], displayDomain: 'سجل أحداث التدقيق المالي' },
  { screen: 'captain-finance', screenLabel: 'مالية الكباتن', wltEndpoint: '/wlt/dsh/captain/cod-liabilities', operationId: 'getCaptainCodLiabilities', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['payout_release', 'cod_write_off', 'commission_adjust'], displayDomain: 'COD والمستحقات والعمولات لكباتن بثواني حصراً' },
  { screen: 'store-delivery-finance', screenLabel: 'مالية توصيل المتجر', wltEndpoint: '/wlt/dsh/store-delivery/finance-summary', operationId: 'getStoreDeliveryFinanceSummary', httpMethod: 'GET', endpointStatus: 'exact', dshRole: 'view_only', requiresIdempotency: false, contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY', isImplemented: false, ownerService: 'wlt', forbiddenActions: ['courier_payout', 'fee_adjust', 'compensation_override'], displayDomain: 'عمولات ورسوم موصلي المتاجر — مفصولة عن كباتن بثواني' },
] as const;

export function getFinanceApiBinding(screen: FinanceWorkspaceInput): DshFinanceApiBinding | undefined {
  return FINANCE_API_MATRIX.find((b) => b.screen === screen);
}

export const FINANCE_IDEMPOTENCY_SCREENS = FINANCE_API_MATRIX
  .filter((b) => b.requiresIdempotency)
  .map((b) => b.screen);
