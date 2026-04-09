import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_LISTING_KNZLISTINGDELETE() {
  const { t } = useI18n();
  const config = {
    service: 'knz' as const,
    entityType: "LISTING_KNZLISTINGDELETE",
    entityId: '',
    fields: [
      
    ],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.operations.APP_LISTING_KNZLISTINGDELETE.knzListingDelete'),
      subtitle: t('web.control panel.operations.APP_LISTING_KNZLISTINGDELETE.screenForKnz'),
    },
    actions: {
      submit: { label: t('web.control panel.operations.APP_LISTING_KNZLISTINGDELETE.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.APP_LISTING_KNZLISTINGDELETE.cancelButton') },
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


