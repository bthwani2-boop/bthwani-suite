import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export interface KnzListingCreateScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalFormScreenComponent: React.ElementType;
  useFormAdapterHook: any;
}

export const KnzListingCreateScreen: React.FC<KnzListingCreateScreenProps> = ({
  StateManagerComponent,
  UniversalFormScreenComponent,
  useFormAdapterHook,
}) => {
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
      title: t('web.control panel.operations.knz.KnzListingCreateScreen.createNewListing'),
      subtitle: t('web.control panel.operations.knz.KnzListingCreateScreen.addKnzListing'),
    },
    actions: {
      submit: { label: t('web.control panel.operations.knz.KnzListingCreateScreen.save'), disabled: false },
      cancel: { label: t('web.control panel.operations.knz.KnzListingCreateScreen.cancelButton') },
    },
    api: {
      baseUrl: '/api/knz',
      endpoints: {
        submit: 'knz/listings',
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

