// Canonical location: dsh/frontend/shared/view-models/control-panel/marketing/section-meta.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/section-meta.ts
// Note: This module resolves governance at import time via getDshControlPanelGovernanceEntry.

import { getDshControlPanelGovernanceEntry } from '../../control-panel/shared/dsh-control-panel-governance.map';

const governance = getDshControlPanelGovernanceEntry('marketing');

export const marketingSectionMeta = {
  id: 'marketing',
  surface: 'control-panel',
  placeholder: false,
  policyOwner: governance.policyOwner,
  escalationOwner: governance.escalationOwner,
  relatedRegistryFlowIds: governance.relatedRegistryFlowIds,
  notes: governance.notes,
} as const;
