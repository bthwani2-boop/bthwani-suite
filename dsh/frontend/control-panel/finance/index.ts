// DSH finance â€” barrel re-export only.
// All logic (registry, types, api-matrix, hub rendering) lives in wlt/frontend/dsh/control-panel/.

// Hub screen
export { WltDshFinanceHubHost as ControlPanelDshFinanceHubScreen } from '../../../../wlt/frontend/dsh/control-panel/screens/WltDshFinanceHubHost';
export type { WltDshFinanceHubHostProps as ControlPanelDshFinanceScreenProps } from '../../../../wlt/frontend/dsh/control-panel/screens/WltDshFinanceHubHost';

// Finance routing types
export type {
  CanonicalFinanceGroupId,
  FinancePanelId,
  FinanceViewState,
  FinanceGroupMeta,
  FinanceNormalizationResult,
} from '../../../../wlt/frontend/dsh/shared';

// Finance routing helpers
export {
  FINANCE_CANONICAL_GROUPS,
  FINANCE_CANONICAL_GROUP_IDS,
  FINANCE_NAV_GROUPS,
  buildFinanceHref,
  getFinanceGroupMeta,
  normalizeFinanceLocation,
} from '../../../../wlt/frontend/dsh/shared';
