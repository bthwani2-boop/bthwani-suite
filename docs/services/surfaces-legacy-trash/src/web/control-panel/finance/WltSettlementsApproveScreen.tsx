import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, useFormAdapter } from '@bthwani/surfaces/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export interface WltSettlementsApproveScreenProps {
  StateManagerComponent: React.ElementType;
  UniversalFormScreenComponent: React.ElementType;
  useFormAdapterHook: any;
}

export const WltSettlementsApproveScreen: React.FC<WltSettlementsApproveScreenProps> = ({
  StateManagerComponent,
  UniversalFormScreenComponent,
  useFormAdapterHook,
}) => {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_settlements_settlement_id_approve_post',
    entityType: 'SETTLEMENT_WLTSETTLEMENTSSETTLEMENTIDAPPROVEPOST',
    entityId: '',
    fields: [
      {
        name: t('surfaces.approvalNotes'),
        type: 'string',
        label: t('web.control panel.finance.WltSettlementsApproveScreen.approvalNotes'),
        required: false,
        placeholder: t('web.control panel.finance.WltSettlementsApproveScreen.placeholder'),
      },
    ],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WltSettlementsApproveScreen.approveSettlement'),
      subtitle: t('web.control panel.finance.WltSettlementsApproveScreen.approveFinancialSettlement'),
    },
    actions: {
      submit: { label: t('web.control panel.finance.WltSettlementsApproveScreen.approval'), disabled: false },
      cancel: { label: t('web.control panel.finance.WltSettlementsApproveScreen.cancelButton') },
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        submit: 'wlt/settlements/{settlementId}/approve',
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

