import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_PROVIDER_KWDLISTINGCREATE() {
  const { t } = useI18n();
  const config = {
    service: 'kwd' as const,
    entityType: 'PROVIDER_KWDLISTINGCREATE',
    entityId: '',
    fields: [],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Kwd listing create',
      subtitle: 'Screen for Kwd listing create operation in KWD service',
    },
    actions: {
      submit: { label: t('web.control panel.operations.APP_PROVIDER_KWDLISTINGCREATE.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.APP_PROVIDER_KWDLISTINGCREATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/kwd',
      endpoints: {
        submit: 'kwd/listing/create',
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


