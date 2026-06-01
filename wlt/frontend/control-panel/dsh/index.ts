// screens
export { FinancialCenterScreen } from './screens/FinancialCenterScreen';
export { LedgerScreen } from './screens/LedgerScreen';
export { AuditCloseScreen } from './screens/AuditCloseScreen';
export { DailyReconciliationWorkbench } from './screens/DailyReconciliationWorkbench';
export { CaptainPayoutWorkspace } from './screens/CaptainPayoutWorkspace';
export type { CaptainPayoutWorkspaceProps } from './screens/CaptainPayoutWorkspace';
export { CommissionBreakdownWorkspace } from './screens/CommissionBreakdownWorkspace';
export type { CommissionBreakdownWorkspaceProps } from './screens/CommissionBreakdownWorkspace';
export { FieldCommissionWorkspace } from './screens/FieldCommissionWorkspace';
export type { FieldCommissionWorkspaceProps } from './screens/FieldCommissionWorkspace';
export { PlatformFeeAuditWorkspace } from './screens/PlatformFeeAuditWorkspace';
export type { PlatformFeeAuditWorkspaceProps } from './screens/PlatformFeeAuditWorkspace';

// FinanceHubScreens (old hub screens — used by DSH)
export * from './screens/FinanceHubScreens';

// components
export { WltBoundaryBanner } from './components/WltBoundaryBanner';
export { WltDshAccountStatement } from './components/WltDshAccountStatement';
export { WltDshRefundLedger } from './components/WltDshRefundLedger';
export { WltDshSettlementCalendar } from './components/WltDshSettlementCalendar';
export { WltDshStoreSettlementStatement } from './components/WltDshStoreSettlementStatement';
export { LedgerEntriesTable } from './components/LedgerEntriesTable';
export { TrialBalancePanel } from './components/TrialBalancePanel';
export { WltDshFinanceControlPanelContent, WltDshFinanceControlPanelPreview } from './components/WltDshFinanceControlPanelPreview';

// finance routing (types + registry + api-matrix)
export type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState, FinanceGroupMeta, FinanceNormalizationResult } from './models/financeRouting.types';
export { FINANCE_CANONICAL_GROUPS, FINANCE_NAV_GROUPS, FINANCE_CANONICAL_GROUP_IDS, normalizeFinanceLocation, buildFinanceHref, getFinanceGroupMeta } from './constants/finance.registry';
export { FINANCE_API_MATRIX, getFinanceApiBinding } from './adapters/finance.api-matrix';
export type { DshFinanceApiBinding } from './adapters/finance.api-matrix';

// hub host screen
export { ControlPanelFinanceHubHost, ControlPanelDshFinanceHubScreen } from './screens/ControlPanelFinanceHubHost';
export type { ControlPanelDshFinanceScreenProps } from './screens/ControlPanelFinanceHubHost';

// public contracts barrel
export * as wltDshFinanceContracts from './financeContracts';
