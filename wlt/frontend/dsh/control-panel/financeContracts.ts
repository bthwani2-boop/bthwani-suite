// ─── Wallet Domain Model ───────────────────────────────────────────
export type {
  WalletActorType,
  WalletTransactionStatus,
  WalletTransactionEventKind,
  WalletBalanceBucket,
  WalletTransactionLine,
  WalletAccount,
  WalletStatement,
  WalletCashBag,
  WalletDepositProof,
  WalletRefundImpact,
  WalletPaymentSplit,
} from './models/wallet.types';

// ─── Wallet Event Matrix ───────────────────────────────────────────
export type {
  DeliveryMode,
  PaymentMethodMode,
  WalletImpactDirection,
  WalletActorImpact,
  WalletEventMatrixRow,
} from './models/walletEventMatrix.types';
export {
  WALLET_EVENT_MATRIX,
  getWalletEventMatrixRow,
  getWalletEventMatrixForDeliveryMode,
  getWalletEventMatrixForPaymentMethod,
} from './models/walletEventMatrix.types';

export type { FinanceProvider } from './models/financeProviders.types';
export { financeProviders } from './models/financeProviders.types';

// ─── DSH Finance Preview (event kinds, actors, record shapes) ─────

export type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinanceActor,
  WltDshFinanceBindingState,
  WltDshFinanceEventKind,
  WltDshFinanceOwnership,
  WltDshFinancePreviewMetadata,
  WltDshFinancePreviewRecord,
  WltDshFinanceStatusTone,
  WltDshFinanceTone,
  WltDshFulfillmentMode,
  WltDshOrderCommissionBreakdown,
  WltDshOrderLineItemApplicability,
  WltDshPartnerModeRatePreview,
  WltDshPaymentMethod,
  WltDshPaymentOptionPreview,
  WltDshPaymentPreviewState,
  WltFieldFinanceSnapshot,
  WltPartnerFinanceSnapshot,
} from './models/dshFinance.types';

export {
  formatWltYer,
  WLT_DSH_FINANCE_OWNERSHIP,
  getWltDshFinancePreviewMetadata,
} from './models/dshFinance.types';

// ─── Partner Statements ────────────────────────────────────────────
export type {
  WltDshPartnerStatement,
  WltDshPartnerStoreLine,
} from './models/partnerStatement.types';

// ─── Captain Statements ────────────────────────────────────────────
export type {
  WltDshCaptainCodBag,
  WltDshCaptainEarningLine,
  WltDshCaptainStatement,
} from './models/captainStatement.types';

export {
  getFallbackCaptainFinancePreview as getWltCaptainFinancePreview,
  getFallbackCaptainFinanceSnapshot as getWltCaptainFinanceSnapshot,
  getFallbackControlPanelFinancePreview as getWltControlPanelFinancePreview,
  getFallbackClientPaymentPreview as getWltDshClientPaymentPreview,
  getFallbackFinanceRecordsForActor as getWltDshFinanceRecordsForActor,
  getFallbackFinanceSummaryForActor as getWltDshFinanceSummaryForActor,
  getFallbackOrderCommissionBreakdown as getWltDshOrderCommissionBreakdown,
  getFallbackPaymentOptionsPreview as getWltDshPaymentOptionsPreview,
  getFallbackStoreDeliveryFinancePreview as getWltDshStoreDeliveryFinancePreview,
  getFallbackFieldFinancePreview as getWltFieldFinancePreview,
  getFallbackFieldFinanceSnapshot as getWltFieldFinanceSnapshot,
  getFallbackPartnerFinanceSnapshot as getWltPartnerFinanceSnapshot,
  getFallbackPartnerSettlementPreview as getWltPartnerSettlementPreview,
  resolveFallbackFinanceEventKindForPaymentMethod as resolveWltDshFinanceEventKindForPaymentMethod,
  resolveFallbackPaymentPreviewState as resolveWltDshPaymentPreviewState,
  WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW,
} from './adapters/wltDshFinanceFallback.adapter';

// ─── Chart of Accounts ─────────────────────────────────────────────

export type {
  WltAccountType,
  WltAccountClass,
  WltAccountCode,
  WltSubledgerId,
  WltAccount,
} from './models/chartOfAccounts.types';
export {
  WLT_CHART_OF_ACCOUNTS,
  WLT_CHART_OF_ACCOUNTS_CONTRACT,
  getWltAccountByCode,
  getWltControlAccounts,
  getWltAccountsByType,
} from './models/chartOfAccounts.types';

// ─── Subledger Matrix ──────────────────────────────────────────────

export type { WltSubledgerEntry } from './models/subledger.types';
export {
  WLT_SUBLEDGER_MATRIX,
  WLT_SUBLEDGER_MATRIX_CONTRACT,
  getWltSubledgerById,
  getWltCloseGateSubledgers,
  getWltSubledgerForEventKind,
} from './models/subledger.types';

// ─── Posting Rules ─────────────────────────────────────────────────

export type { WltPostingRule } from './models/postingRules.types';
export {
  WLT_POSTING_RULES,
  WLT_POSTING_RULES_CONTRACT,
  getWltPostingRuleForEvent,
  getWltCloseGateBlockingRules,
} from './models/postingRules.types';

// ─── Maker-Checker ─────────────────────────────────────────────────

export type {
  WltMakerCheckerState,
  WltMakerCheckerRole,
  WltMakerCheckerPermission,
  WltMakerCheckerRecord,
  WltRbacPreviewRole,
} from './models/makerChecker.types';
export {
  WLT_MAKER_CHECKER_STATE_LABELS,
  WLT_MAKER_CHECKER_TRANSITIONS,
  WLT_MAKER_CHECKER_CONTRACT,
  WLT_RBAC_PREVIEW_ROLES,
  getWltMakerCheckerStateLabel,
  getWltNextTransitions,
  isWltTerminalState,
  getWltRbacRoleById,
  buildWltMakerCheckerRecord,
} from './models/makerChecker.types';

// ─── Audit Pack ────────────────────────────────────────────────────

export type {
  WltAuditPackStatus,
  WltAuditEventType,
  WltAuditEvent,
  WltAuditEvidenceItem,
  WltAuditException,
  WltAuditApproval,
  WltAuditPack,
} from './models/auditPack.types';
export {
  WLT_AUDIT_PACK_STATUS_LABELS,
  WLT_AUDIT_PACK_CONTRACT,
  buildWltAuditPackPreview,
} from './models/auditPack.types';

// ─── Trial Balance ─────────────────────────────────────────────────

export type { WltTrialBalanceLine, WltTrialBalance } from './models/trialBalance.types';
export { WLT_TRIAL_BALANCE_CONTRACT, buildWltTrialBalancePreview } from './selectors/buildTrialBalance';

// ─── Financial Center ──────────────────────────────────────────────

export type {
  WltLedgerEntryKind,
  WltLedgerEntryStatus,
  WltLedgerEntry,
  WltAccountPositionLine,
  WltFinancialCenterSection,
  WltFinancialCenterBlockingVariance,
  WltFinancialCenter,
} from './models/financialCenter.types';
export { buildWltFinancialCenter, WLT_FINANCIAL_CENTER_CONTRACT } from './selectors/buildFinancialCenter';

// ─── Finance Contract Types ────────────────────────────────────────

export type { WltDshControlPanelPreviewContract } from './models/financeContract.types';

export type { WltDshSettlementOrderRow, WltDshStoreSettlementStatement } from './models/storeSettlement.types';

// ─── Field Agent Commission Types ──────────────────────────────────

export type {
  WltDshFieldCommissionStoreLine,
  WltDshFieldCommissionStatement,
} from './models/fieldCommission.types';

// ─── Account Statement Types ───────────────────────────────────────

export type {
  WltDshAccountStatementActor,
  WltDshAccountStatementLine,
  WltDshAccountStatement,
} from './models/accountStatement.types';

// ─── Settlement Calendar Types ─────────────────────────────────────

export type { WltDshSettlementCalendarCycle } from './models/settlementCalendar.types';

// ─── Refund Ledger Types ───────────────────────────────────────────

export type { WltDshRefundLedgerCase } from './models/refundLedger.types';

// ─── Preview Data (adapted via WLT adapters) ─────────────────────

export {
  getFallbackAccountStatementsPreview as getWltDshAccountStatementsPreview,
  getFallbackRefundLedgerPreview as getWltDshRefundLedgerPreview,
  getFallbackSettlementCalendarPreview as getWltDshSettlementCalendarPreview,
  getFallbackStoreSettlementStatementsPreview as getWltDshStoreSettlementStatementsPreview,
  getFallbackFieldCommissionStatementsPreview as getWltFieldCommissionStatementsPreview,
  getFallbackPartnerSettlementStatementsPreview as getWltDshPartnerSettlementStatementsPreview,
  getFallbackCaptainSettlementStatementsPreview as getWltDshCaptainSettlementStatementsPreview,
  WLT_DSH_CONTROL_PANEL_FINANCE_CONTRACT,
} from './adapters/wltDshFinanceFallback.adapter';
