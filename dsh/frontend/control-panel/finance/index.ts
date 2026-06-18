// DSH finance â€” barrel re-export only.
// All logic (registry, types, api-matrix, hub rendering) lives in wlt/frontend/dsh/control-panel/.

// Hub screen
export { WltDshFinanceHubHost as ControlPanelDshFinanceHubScreen } from '../../shared/wlt/generated/wlt_frontend_dsh_control_panel_screens_WltDshFinanceHubHost.facade';
export type { WltDshFinanceHubHostProps as ControlPanelDshFinanceScreenProps } from '../../shared/wlt/generated/wlt_frontend_dsh_control_panel_screens_WltDshFinanceHubHost.facade';

// Finance routing types
export type {
  CanonicalFinanceGroupId,
  FinancePanelId,
  FinanceViewState,
  FinanceGroupMeta,
  FinanceNormalizationResult,
} from '../../shared/wlt/generated/wlt_frontend_dsh_shared.facade';

// Finance routing helpers
export {
  FINANCE_CANONICAL_GROUPS,
  FINANCE_CANONICAL_GROUP_IDS,
  FINANCE_NAV_GROUPS,
  buildFinanceHref,
  getFinanceGroupMeta,
  normalizeFinanceLocation,
} from '../../shared/wlt/generated/wlt_frontend_dsh_shared.facade';
