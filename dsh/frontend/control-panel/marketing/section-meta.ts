import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';

const governance = getDshControlPanelGovernanceEntry('marketing');

export const sectionMeta = {
  id: 'marketing',
  surface: 'control-panel',
  placeholder: false,
  policyOwner: governance.policyOwner,
  escalationOwner: governance.escalationOwner,
  relatedRegistryFlowIds: governance.relatedRegistryFlowIds,
  notes: governance.notes,
} as const;
