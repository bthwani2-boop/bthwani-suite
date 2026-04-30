import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_LISTING_KNZLISTINGCREATE() {
  const { t } = useI18n();
  const config = {
    service: 'knz' as const,
    entityType: "LISTING_KNZLISTINGCREATE",
    entityId: '',
    fields: [
      
    ],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Knz listing create',
      subtitle: 'Screen for Knz listing create operation in KNZ service',
    },
    actions: {
      submit: { label: t('web.control panel.operations.APP_LISTING_KNZLISTINGCREATE.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.APP_LISTING_KNZLISTINGCREATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/knz',
      endpoints: {
        submit: 'knz/listings',
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


