// Canonical location: dsh/frontend/shared/view-models/control-panel/operations/operations-flow-meta.ts
// Authority: dsh/frontend/shared — moved from control-panel/operations/flow-meta.ts

import { getDshControlPanelGovernanceEntry } from '../../../control-panel/dsh-governance.map';

const governance = getDshControlPanelGovernanceEntry('operations');

export const operationsFlowMeta = {
  id: 'dsh',
  owner: 'operations',
  ownerKind: 'section',
  placeholder: false,
  policyOwner: governance.policyOwner,
  escalationOwner: governance.escalationOwner,
  relatedRegistryFlowIds: governance.relatedRegistryFlowIds,
  notes: governance.notes,
} as const;
