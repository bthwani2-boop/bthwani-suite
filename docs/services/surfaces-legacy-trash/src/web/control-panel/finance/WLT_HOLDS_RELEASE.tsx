// Wlt holds release - Screen for wlt_hold_release operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_HOLDS_RELEASE() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_hold_release',
    entityType: 'hold',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_HOLDS_RELEASE.releaseHold'),
      subtitle: t('web.control panel.finance.WLT_HOLDS_RELEASE.releaseReservedHold'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        release: '/api/wlt/holds/{hold_id}/release',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


