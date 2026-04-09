import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export interface KnzListingUpdateScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalFormScreenComponent: React.ElementType;
  useFormAdapterHook: any;
}

export const KnzListingUpdateScreen: React.FC<KnzListingUpdateScreenProps> = ({
  StateManagerComponent,
  UniversalFormScreenComponent,
  useFormAdapterHook,
}) => {
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
      title: t('web.control panel.operations.knz.KnzListingUpdateScreen.updateListing'),
      subtitle: t('web.control panel.operations.knz.KnzListingUpdateScreen.editKnzListing'),
    },
    actions: {
      submit: { label: t('web.control panel.operations.knz.KnzListingUpdateScreen.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.knz.KnzListingUpdateScreen.cancelButton') },
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

