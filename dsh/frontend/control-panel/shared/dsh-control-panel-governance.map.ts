/**
 * DSH Control Panel Governance Map — compatibility re-export shim
 * SESSION: DSH_PHASE_5_FINAL_LOGIC_CLOSURE-20260521-071500
 *
 * Governance owner moved to dsh/frontend/shared/dsh-governance.map.ts
 * so mobile surfaces can consume it without importing from control-panel internals.
 *
 * This file re-exports everything from shared so control-panel-internal consumers
 * continue to work without modification.
 *
 * Do NOT add new governance logic here. All changes go to dsh/frontend/shared/dsh-governance.map.ts.
 */

export type {
  DshControlPanelSectionId,
  DshControlPanelGovernanceEntry,
} from '../../shared/dsh-governance.map';

export {
  DSH_CONTROL_PANEL_SECTION_IDS,
  DSH_CONTROL_PANEL_GOVERNANCE_MAP,
  DSH_CONTROL_PANEL_GOVERNANCE_LIST,
  getDshControlPanelGovernanceEntry,
  getDshControlPanelGovernanceEntries,
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceSectionsForSurface,
  resolveDshControlPanelSectionLabel,
} from '../../shared/dsh-governance.map';
