// Canonical location: dsh/frontend/shared/view-models/control-panel/marketing/flow-meta.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/flow-meta.ts
// Note: resolves governance at import time.

import { getDshControlPanelGovernanceEntry } from '../../control-panel/shared/dsh-control-panel-governance.map';

const governance = getDshControlPanelGovernanceEntry('marketing');

export const marketingFlowMeta = {
  id: 'dsh',
  owner: 'marketing',
  ownerKind: 'section',
  placeholder: false,
  policyOwner: governance.policyOwner,
  escalationOwner: governance.escalationOwner,
  relatedRegistryFlowIds: governance.relatedRegistryFlowIds,
  notes: governance.notes,
} as const;
