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
} from './wallet.types';

// ─── Wallet Event Matrix ───────────────────────────────────────────
export type {
  DeliveryMode,
  PaymentMethodMode,
  WalletImpactDirection,
  WalletActorImpact,
  WalletEventMatrixRow,
} from './walletEventMatrix.types';
export {
  WALLET_EVENT_MATRIX,
  getWalletEventMatrixRow,
  getWalletEventMatrixForDeliveryMode,
  getWalletEventMatrixForPaymentMethod,
} from './walletEventMatrix.types';

export type { FinanceProvider } from './financeProviders.types';
export { financeProviders } from './financeProviders.types';

// ─── DSH Finance Preview (event kinds, actors, record shapes) ─────

export type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinanceActor,
  WltDshFinanceBindingState,
  WltDshFinanceEventKind,
  WltDshFinanceOwnership,
  WltDshFinanceReadModelMetadata,
  WltDshFinanceSummaryRecord,
  WltDshFinanceStatusTone,
  WltDshFinanceTone,
  WltDshFulfillmentMode,
  WltDshOrderCommissionBreakdown,
  WltDshOrderLineItemApplicability,
  WltDshPartnerModeRate,
  WltDshPaymentMethod,
  WltDshPaymentOption,
  WltDshPaymentState,
  WltFieldFinanceSnapshot,
  WltPartnerFinanceSnapshot,
} from './dshFinance.types';

export {
  formatWltYer,
  WLT_DSH_FINANCE_OWNERSHIP,
  getWltDshFinanceReadModelMetadata,
  resolveWltDshFinanceEventKindForPaymentMethod,
} from './dshFinance.types';

// ─── Partner Statements ────────────────────────────────────────────
export type {
  WltDshPartnerStatement,
  WltDshPartnerStoreLine,
} from './partnerStatement.types';

// ─── Captain Statements ────────────────────────────────────────────
export type {
  WltDshCaptainCodBag,
  WltDshCaptainEarningLine,
  WltDshCaptainStatement,
} from './captainStatement.types';


// ─── Chart of Accounts ─────────────────────────────────────────────

export type {
  WltAccountType,
  WltAccountClass,
  WltAccountCode,
  WltSubledgerId,
  WltAccount,
} from './chartOfAccounts.types';
export {
  WLT_CHART_OF_ACCOUNTS,
  WLT_CHART_OF_ACCOUNTS_CONTRACT,
  getWltAccountByCode,
  getWltControlAccounts,
  getWltAccountsByType,
} from './chartOfAccounts.types';

// ─── Subledger Matrix ──────────────────────────────────────────────

export type { WltSubledgerEntry } from './subledger.types';
export {
  WLT_SUBLEDGER_MATRIX,
  WLT_SUBLEDGER_MATRIX_CONTRACT,
  getWltSubledgerById,
  getWltCloseGateSubledgers,
  getWltSubledgerForEventKind,
} from './subledger.types';

// ─── Posting Rules ─────────────────────────────────────────────────

export type { WltPostingRule } from './postingRules.types';
export {
  WLT_POSTING_RULES,
  WLT_POSTING_RULES_CONTRACT,
  getWltPostingRuleForEvent,
  getWltCloseGateBlockingRules,
} from './postingRules.types';

// ─── Maker-Checker ─────────────────────────────────────────────────

export type {
  WltMakerCheckerState,
  WltMakerCheckerRole,
  WltMakerCheckerPermission,
  WltMakerCheckerRecord,
  WltRbacPreviewRole,
} from './makerChecker.types';
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
} from './makerChecker.types';

// ─── Audit Pack ────────────────────────────────────────────────────

export type {
  WltAuditPackStatus,
  WltAuditEventType,
  WltAuditEvent,
  WltAuditEvidenceItem,
  WltAuditException,
  WltAuditApproval,
  WltAuditPack,
} from './auditPack.types';
export {
  WLT_AUDIT_PACK_STATUS_LABELS,
  WLT_AUDIT_PACK_CONTRACT,
  buildWltAuditPackPreview,
} from './auditPack.types';

// ─── Trial Balance ─────────────────────────────────────────────────

export type { WltTrialBalanceLine, WltTrialBalance } from './trialBalance.types';
export { WLT_TRIAL_BALANCE_CONTRACT, buildWltTrialBalancePreview } from '../reconciliation/buildTrialBalance';

// ─── Financial Center ──────────────────────────────────────────────

export type {
  WltLedgerEntryKind,
  WltLedgerEntryStatus,
  WltLedgerEntry,
  WltAccountPositionLine,
  WltFinancialCenterSection,
  WltFinancialCenterBlockingVariance,
  WltFinancialCenter,
} from './financialCenter.types';
export { buildWltFinancialCenter, WLT_FINANCIAL_CENTER_CONTRACT } from '../control-panel/buildFinancialCenter';

// ─── Finance Contract Types ────────────────────────────────────────

export type { WltDshControlPanelPreviewContract } from './financeContract.types';

export type { WltDshSettlementOrderRow, WltDshStoreSettlementStatement } from './storeSettlement.types';

// ─── Field Agent Commission Types ──────────────────────────────────

export type {
  WltDshFieldCommissionStoreLine,
  WltDshFieldCommissionStatement,
} from './fieldCommission.types';

// ─── Account Statement Types ───────────────────────────────────────

export type {
  WltDshAccountStatementActor,
  WltDshAccountStatementLine,
  WltDshAccountStatement,
} from './accountStatement.types';

// ─── Settlement Calendar Types ─────────────────────────────────────

export type { WltDshSettlementCalendarCycle } from './settlementCalendar.types';

// ─── Refund Ledger Types ───────────────────────────────────────────

export type { WltDshRefundLedgerCase } from './refundLedger.types';
