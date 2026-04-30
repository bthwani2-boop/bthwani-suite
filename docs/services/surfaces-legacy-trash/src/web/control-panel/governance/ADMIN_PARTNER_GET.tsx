import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';

export default function MCPW_PARTNER_DRAFT_GET() {
  const config = {
    service: 'control panel' as const,
    entityType: "MCPW_PARTNER_DRAFT_GET",
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Partner draft get',
      subtitle: 'Screen for Partner draft get operation in CONTROL PANEL service',
    },
    api: {
      baseUrl: '/api/control panel',
      endpoints: {
        get: 'control panel/partners/drafts/{draft_id}',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


