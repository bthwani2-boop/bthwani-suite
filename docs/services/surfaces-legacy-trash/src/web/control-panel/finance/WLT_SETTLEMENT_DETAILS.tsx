// Wlt settlement details - Screen for wlt_settlement_get operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_SETTLEMENT_DETAILS() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_settlement_get',
    entityType: 'settlement',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_SETTLEMENT_DETAILS.settlementDetails'),
      subtitle: t('web.control panel.finance.WLT_SETTLEMENT_DETAILS.viewSettlementDetails'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        get: '/api/wlt/settlements/{settlement_id}',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


