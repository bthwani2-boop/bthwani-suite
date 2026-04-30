import React from 'react';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_PROVIDER_KWDJOBCREATE() {
  const { t } = useI18n();
  const config = {
    service: 'kwd' as const,
    entityType: 'PROVIDER_KWDJOBCREATE',
    entityId: '',
    fields: [],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Kwd job create',
      subtitle: 'Screen for Kwd job create operation in KWD service',
    },
    actions: {
      submit: { label: t('web.control panel.operations.APP_PROVIDER_KWDJOBCREATE.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.APP_PROVIDER_KWDJOBCREATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/kwd',
      endpoints: {
        submit: 'kwd/job/create',
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


