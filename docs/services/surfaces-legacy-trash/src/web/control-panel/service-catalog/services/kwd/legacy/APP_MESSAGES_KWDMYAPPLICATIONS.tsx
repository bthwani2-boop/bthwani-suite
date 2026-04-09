import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';

export default function APP_MESSAGES_KWDMYAPPLICATIONS() {
  const config = {
    service: 'kwd' as const,
    entityType: 'MESSAGES_KWDMYAPPLICATIONS',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Kwd my applications',
      subtitle: 'Screen for Kwd my applications operation in KWD service',
    },
    api: {
      baseUrl: '/api/kwd',
      endpoints: {
        get: 'kwd/my/applications',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}

