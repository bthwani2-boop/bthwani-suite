import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export interface WalletBalanceGetScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalHubScreenComponent: React.ElementType;
}

export const WalletBalanceGetScreen: React.FC<WalletBalanceGetScreenProps> = ({
  StateManagerComponent,
  UniversalHubScreenComponent,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    entityType: 'WALLET_WLTBALANCEGET',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.operations.wallet.WalletBalanceGetScreen.walletBalance'),
      subtitle: t('web.control panel.operations.wallet.WalletBalanceGetScreen.viewWltWalletBalance'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        get: 'wlt/balance',
      },
    },
  };

  return (
    <StateManagerComponent config={config}>
      <UniversalHubScreenComponent config={config} />
    </StateManagerComponent>
  );
};

