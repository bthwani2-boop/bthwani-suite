// DSH finance — barrel re-export only.
// All logic (registry, types, api-matrix, hub rendering) lives in wlt/frontend/control-panel/dsh/.

// Hub screen
export { WltDshFinanceHubHost as ControlPanelDshFinanceHubScreen } from '../../../../wlt/frontend/control-panel/dsh/screens/WltDshFinanceHubHost';
export type { WltDshFinanceHubHostProps as ControlPanelDshFinanceScreenProps } from '../../../../wlt/frontend/control-panel/dsh/screens/WltDshFinanceHubHost';

// Finance routing types
export type {
  CanonicalFinanceGroupId,
  FinancePanelId,
  FinanceViewState,
  FinanceGroupMeta,
  FinanceNormalizationResult,
} from '../../../../wlt/frontend/control-panel/dsh/models/financeRouting.types';

// Finance routing helpers
export {
  FINANCE_CANONICAL_GROUPS,
  FINANCE_CANONICAL_GROUP_IDS,
  FINANCE_NAV_GROUPS,
  buildFinanceHref,
  getFinanceGroupMeta,
  normalizeFinanceLocation,
} from '../../../../wlt/frontend/control-panel/dsh/constants/finance.registry';
