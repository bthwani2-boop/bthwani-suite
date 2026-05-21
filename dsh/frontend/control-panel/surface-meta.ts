import { DSH_CONTROL_PANEL_SECTION_IDS } from './shared/dsh-control-panel-governance.map';

export const surfaceMeta = {
  id: 'control-panel',
  owner: 'dsh',
  placeholder: false,
  sections: DSH_CONTROL_PANEL_SECTION_IDS,
  policyOwner: 'control-panel',
  escalationOwner: 'control-panel',
} as const;
