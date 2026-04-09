import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export interface DshCartItemAddScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalFormScreenComponent: React.ElementType;
  useFormAdapterHook: any;
}

export const DshCartItemAddScreen: React.FC<DshCartItemAddScreenProps> = ({
  StateManagerComponent,
  UniversalFormScreenComponent,
  useFormAdapterHook,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'dsh' as const,
    operationId: 'dsh_cart_item_add',
    entityType: 'CART_ITEM_DSHCARTITEMADD',
    entityId: '',
    fields: [
      {
        name: 'menuItemId',
        type: 'string',
        label: t('web.control panel.operations.dsh.DshCartItemAddScreen.menuItemId'),
        required: true,
        placeholder: t('web.control panel.operations.dsh.DshCartItemAddScreen.placeholder'),
      },
      {
        name: 'quantity',
        type: 'number',
        label: t('web.control panel.operations.dsh.DshCartItemAddScreen.quantity'),
        required: true,
        min: 1,
        placeholder: t('web.control panel.operations.dsh.DshCartItemAddScreen.placeholder_36'),
      },
      {
        name: 'customizations',
        type: 'object',
        label: t('web.control panel.operations.dsh.DshCartItemAddScreen.specializations'),
        required: false,
        placeholder: t('web.control panel.operations.dsh.DshCartItemAddScreen.optionalLabel'),
      },
    ],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.operations.dsh.DshCartItemAddScreen.addToCart'),
      subtitle: t('web.control panel.operations.dsh.DshCartItemAddScreen.addDshCartItem'),
    },
    actions: {
      submit: { label: t('web.control panel.operations.dsh.DshCartItemAddScreen.add'), disabled: false },
      cancel: { label: t('web.control panel.operations.dsh.DshCartItemAddScreen.cancelButton') },
    },
    api: {
      baseUrl: '/api/dsh',
      endpoints: {
        submit: 'dsh/cart/items',
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

