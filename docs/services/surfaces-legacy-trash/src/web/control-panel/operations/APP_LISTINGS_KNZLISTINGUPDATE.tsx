import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_LISTINGS_KNZLISTINGUPDATE() {
  const { t } = useI18n();
  const config = {
    service: 'knz' as const,
    entityType: "LISTINGS_KNZLISTINGUPDATE",
    entityId: '',
    fields: [
      
    ],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Knz listing update',
      subtitle: 'Screen for Knz listing update operation in KNZ service',
    },
    actions: {
      submit: { label: t('web.control panel.operations.APP_LISTINGS_KNZLISTINGUPDATE.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.APP_LISTINGS_KNZLISTINGUPDATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/knz',
      endpoints: {
        submit: 'knz/listings/{listing_id}',
      },
    },
  };

  const adapter = useFormAdapter(config.service);

  return (
    <StateManager config={config}>
      <UniversalFormScreen config={config} adapter={adapter} />
    </StateManager>
  );
}


