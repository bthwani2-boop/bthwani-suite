import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_CAPTURE_MRFCLAIMCREATE() {
  const { t } = useI18n();
  const config = {
    service: 'mrf' as const,
    entityType: 'CAPTURE_MRFCLAIMCREATE',
    entityId: '',
    fields: [],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Mrf claim create',
      subtitle: 'Screen for Mrf claim create operation in MRF service',
    },
    actions: {
      submit: {
        label: t('web.control panel.operations.APP_CAPTURE_MRFCLAIMCREATE.save'),
        disabled: false,
      },
      cancel: {
        label: t('web.control panel.operations.APP_CAPTURE_MRFCLAIMCREATE.cancelButton'),
      },
    },
    api: {
      baseUrl: '/api/mrf',
      endpoints: {
        submit: 'mrf/claims/create',
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


