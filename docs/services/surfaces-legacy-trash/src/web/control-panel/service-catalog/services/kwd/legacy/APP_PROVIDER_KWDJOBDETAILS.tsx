import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';

export default function APP_PROVIDER_KWDJOBDETAILS() {
  const config = {
    service: 'kwd' as const,
    entityType: 'PROVIDER_KWDJOBDETAILS',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Kwd job details',
      subtitle: 'Screen for Kwd job details operation in KWD service',
    },
    api: {
      baseUrl: '/api/kwd',
      endpoints: {
        get: 'kwd/job/details',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}

