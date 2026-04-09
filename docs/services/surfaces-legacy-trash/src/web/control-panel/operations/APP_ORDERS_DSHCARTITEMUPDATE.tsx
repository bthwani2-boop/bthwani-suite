import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function APP_ORDERS_DSHCARTITEMUPDATE() {
  const { t } = useI18n();
  const config = {
    service: 'dsh' as const,
    entityType: "ORDERS_DSHCARTITEMUPDATE",
    entityId: '',
    fields: [
      
    ],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: 'Dsh cart item update',
      subtitle: 'Screen for Dsh cart item update operation in DSH service',
    },
    actions: {
      submit: { label: t('web.control panel.operations.APP_ORDERS_DSHCARTITEMUPDATE.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.APP_ORDERS_DSHCARTITEMUPDATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/dsh',
      endpoints: {
        submit: 'dsh/cart/items/{item_id}',
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


