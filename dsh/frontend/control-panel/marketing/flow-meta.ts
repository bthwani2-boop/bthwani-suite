import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';

const governance = getDshControlPanelGovernanceEntry('marketing');

export const flowMeta = {
  id: 'marketing',
  owner: 'marketing',
  ownerKind: 'section',
  placeholder: false,
  policyOwner: governance.policyOwner,
  escalationOwner: governance.escalationOwner,
  relatedRegistryFlowIds: governance.relatedRegistryFlowIds,
  notes: governance.notes,
} as const;
