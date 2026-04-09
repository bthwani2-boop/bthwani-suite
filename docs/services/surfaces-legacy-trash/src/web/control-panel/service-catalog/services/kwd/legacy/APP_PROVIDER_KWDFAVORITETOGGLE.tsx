import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';

export default function APP_PROVIDER_KWDFAVORITETOGGLE() {
  const config = {
    service: 'kwd' as const,
    entityType: 'PROVIDER_KWDFAVORITETOGGLE',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Kwd favorite toggle',
      subtitle: 'Screen for Kwd favorite toggle operation in KWD service',
    },
    api: {
      baseUrl: '/api/kwd',
      endpoints: {
        get: 'kwd/favorite/toggle',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}

