// CONTROL PANEL partner draft reject - Screen for mcpw_partner_draft_reject operation in CONTROL PANEL service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export default function ADMIN_PARTNER_REJECT() {
  const { t } = useI18n();
  const config = {
    service: 'control panel' as const,
    operationId: 'mcpw_partner_draft_reject',
    entityType: 'partner_draft',
    entityId: '',
    features: {
      metrics: false,
      quickActions: true,
      recentActivity: false,
      alerts: false,
      charts: false,
      filters: false,
    },
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.governance.ADMIN_PARTNER_REJECT.rejectPartnerNomination'),
      subtitle: t('web.control panel.governance.ADMIN_PARTNER_REJECT.rejectNewPartnerNomination'),
    },
    api: {
      baseUrl: '/api/control panel',
      endpoints: {
        reject: '/api/control panel/partners/drafts/{draft_id}/reject',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


