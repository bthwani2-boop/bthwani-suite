// CONTROL PANEL partner draft approve - Screen for mcpw_partner_draft_approve operation in CONTROL PANEL service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalHubScreen } from '@bthwani/surfaces/core/shared/hub';
import { useI18n } from '@bthwani/ui-kit';

export default function ADMIN_PARTNER_APPROVE() {
  const { t } = useI18n();
  const config = {
    service: 'control panel' as const,
    operationId: 'mcpw_partner_draft_approve',
    entityType: 'partner_draft',
    entityId: '',
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.governance.ADMIN_PARTNER_APPROVE.approvePartnerNomination'),
      subtitle: t('web.control panel.governance.ADMIN_PARTNER_APPROVE.approveNewPartnerNomination'),
    },
    api: {
      baseUrl: '/api/control panel',
      endpoints: {
        approve: '/api/control panel/partners/drafts/{draft_id}/approve',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalHubScreen config={config} />
    </StateManager>
  );
}


