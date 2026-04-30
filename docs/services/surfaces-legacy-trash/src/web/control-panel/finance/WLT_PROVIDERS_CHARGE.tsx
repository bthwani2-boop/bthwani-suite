// Wlt providers charge - Screen for wlt_provider_charge operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_PROVIDERS_CHARGE() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_provider_charge',
    entityType: 'provider_charge',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_PROVIDERS_CHARGE.providerCharging'),
      subtitle: t('web.control panel.finance.WLT_PROVIDERS_CHARGE.providerAccountCharging'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        charge: '/api/wlt/providers/{provider_id}/charge',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


