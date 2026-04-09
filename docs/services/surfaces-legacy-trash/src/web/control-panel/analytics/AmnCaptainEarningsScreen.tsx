// Amn captain earnings get - Screen for amn_captain_earnings_get operation in AMN service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export interface AmnCaptainEarningsScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalHubScreenComponent: React.ElementType;
}

export const AmnCaptainEarningsScreen: React.FC<AmnCaptainEarningsScreenProps> = ({
  StateManagerComponent,
  UniversalHubScreenComponent,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'amn' as const,
    operationId: 'amn_captain_earnings_get',
    entityType: 'captain_earnings',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.analytics.AmnCaptainEarningsScreen.captainEarnings'),
      subtitle: t('web.control panel.analytics.AmnCaptainEarningsScreen.amnCaptainEarningsView'),
    },
    api: {
      baseUrl: '/api/amn',
      endpoints: {
        get: '/api/amn/captain/earnings',
      },
    },
  };

  return (
    <StateManagerComponent config={config}>
      <UniversalHubScreenComponent config={config} />
    </StateManagerComponent>
  );
};

