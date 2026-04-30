// Wlt exports statements - Screen for wlt_statements_export operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_EXPORTS_STATEMENTS() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_statements_export',
    entityType: 'statements_export',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_EXPORTS_STATEMENTS.exportStatements'),
      subtitle: t('web.control panel.finance.WLT_EXPORTS_STATEMENTS.exportFinancialStatements'),
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        export: '/api/wlt/statements/export',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


