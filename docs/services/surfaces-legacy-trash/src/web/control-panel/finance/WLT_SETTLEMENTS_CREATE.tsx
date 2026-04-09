// Wlt settlements create - Screen for wlt_settlement_create operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, type FormAdapter, type FormField } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_SETTLEMENTS_CREATE() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_settlement_create',
    entityType: 'settlement',
    entityId: '',
    fields: [
      {
        key: 'amount',
        type: 'number' as const,
        label: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.amount'),
        placeholder: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.placeholder'),
        required: true,
        validation: {
          min: 0.01,
        },
      },
      {
        key: 'description',
        type: 'textarea' as const,
        label: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.description'),
        placeholder: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.placeholder_29'),
        required: false,
        validation: {
          maxLength: 500,
        },
      },
      {
        key: 'partner_id',
        type: 'text' as const,
        label: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.partnerId'),
        placeholder: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.placeholder_39'),
        required: true,
      },
    ] as FormField[],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.createNewSettlement'),
      subtitle: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.createNewFinancialSettlement'),
    },
    actions: {
      submit: { label: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.create'), disabled: false },
      cancel: { label: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        submit: '/api/wlt/settlements',
      },
    },
  };

  const adapter: FormAdapter = {
    validateField: (field: FormField, value: unknown): { valid: boolean; error?: string } => {
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return { valid: false, error: `${field.label} مطلوب` };
      }
      if (field.type === 'number' && value !== undefined && value !== null) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return { valid: false, error: `${field.label} يجب أن يكون رقماً` };
        }
        if (field.validation?.min !== undefined && numValue < field.validation.min) {
          return { valid: false, error: `${field.label} يجب أن يكون ${field.validation.min} على الأقل` };
        }
      }
      return { valid: true };
    },
    transformOutgoingData: (data: Record<string, unknown>): unknown => {
      return {
        amount: Number(data.amount),
        description: data.description || '',
        partner_id: data.partner_id,
      };
    },
    getFieldLabels: (): Record<string, string> => {
      return {
        amount: 'المبلغ',
        description: t('web.control panel.finance.WLT_SETTLEMENTS_CREATE.description'),
        partner_id: t('surfaces.معرف_الشريك'),
      };
    },
    getValidationMessages: (): Record<string, string> => {
      return {
        required: 'هذا الحقل مطلوب',
        invalid_number: 'يجب أن يكون رقماً',
        min: 'القيمة أقل من الحد الأدنى',
      };
    },
  };

  return (
    <StateManager config={config}>
      <UniversalFormScreen config={config} adapter={adapter} />
    </StateManager>
  );
}


