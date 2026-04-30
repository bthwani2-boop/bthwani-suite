import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export interface KnzListingDeleteScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalFormScreenComponent: React.ElementType;
  useFormAdapterHook: any;
}

export const KnzListingDeleteScreen: React.FC<KnzListingDeleteScreenProps> = ({
  StateManagerComponent,
  UniversalFormScreenComponent,
  useFormAdapterHook,
}) => {
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
      title: t('web.control panel.operations.knz.KnzListingDeleteScreen.deleteListingAlt'),
      subtitle: t('web.control panel.operations.knz.KnzListingDeleteScreen.deleteKnzListing'),
    },
    actions: {
      submit: { label: t('web.control panel.operations.knz.KnzListingDeleteScreen.delete'), disabled: false },
      cancel: { label: t('web.control panel.operations.knz.KnzListingDeleteScreen.cancelButton') },
    },
    api: {
      baseUrl: '/api/knz',
      endpoints: {
        submit: 'knz/listings/{listing_id}',
      },
    },
  };

  const adapter = useFormAdapterHook(config.service);

  return (
    <StateManagerComponent config={config}>
      <UniversalFormScreenComponent config={config} adapter={adapter} />
    </StateManagerComponent>
  );
};

