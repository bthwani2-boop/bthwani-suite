import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';

export default function APP_PROVIDER_KWDJOBAPPLY() {
  const config = {
    service: 'kwd' as const,
    entityType: 'PROVIDER_KWDJOBAPPLY',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Kwd job apply',
      subtitle: 'Screen for Kwd job apply operation in KWD service',
    },
    api: {
      baseUrl: '/api/kwd',
      endpoints: {
        get: 'kwd/job/apply',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}

