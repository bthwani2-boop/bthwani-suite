// Wlt holds create - Screen for wlt_hold_create operation in WLT service

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalFormScreen, type FormAdapter, type FormField } from '@bthwani/surfaces/core/shared/forms';
import { useI18n } from '@bthwani/ui-kit';

export default function WLT_HOLDS_CREATE() {
  const { t } = useI18n();
  const config = {
    service: 'wlt' as const,
    operationId: 'wlt_hold_create',
    entityType: 'hold',
    entityId: '',
    fields: [
      {
        key: 'amount',
        type: 'number' as const,
        label: t('web.control panel.finance.WLT_HOLDS_CREATE.amount'),
        placeholder: t('web.control panel.finance.WLT_HOLDS_CREATE.placeholder'),
        required: true,
        validation: {
          min: 0.01,
        },
      },
      {
        key: 'reason',
        type: 'textarea' as const,
        label: t('web.control panel.finance.WLT_HOLDS_CREATE.reason'),
        placeholder: t('web.control panel.finance.WLT_HOLDS_CREATE.placeholder_29'),
        required: true,
        validation: {
          maxLength: 500,
        },
      },
      {
        key: 'wallet_id',
        type: 'text' as const,
        label: t('web.control panel.finance.WLT_HOLDS_CREATE.walletId'),
        placeholder: t('web.control panel.finance.WLT_HOLDS_CREATE.placeholder_39'),
        required: true,
      },
    ] as FormField[],
    styling: {
      primaryColor: semanticRoles.primaryCTA,
      secondaryColor: semanticRoles.accent,
      title: t('web.control panel.finance.WLT_HOLDS_CREATE.createHold'),
      subtitle: t('web.control panel.finance.WLT_HOLDS_CREATE.createNewHold'),
    },
    actions: {
      submit: { label: t('web.control panel.finance.WLT_HOLDS_CREATE.create'), disabled: false },
      cancel: { label: t('web.control panel.finance.WLT_HOLDS_CREATE.cancelButton') },
    },
    api: {
      baseUrl: '/api/wlt',
      endpoints: {
        submit: '/api/wlt/holds',
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
        reason: data.reason || '',
        wallet_id: data.wallet_id,
      };
    },
    getFieldLabels: (): Record<string, string> => {
      return {
        amount: t('surfaces.المبلغ'),
        reason: t('surfaces.السبب'),
        wallet_id: t('surfaces.معرف_المحفظة'),
      };
    },
    getValidationMessages: (): Record<string, string> => {
      return {
        required: t('surfaces.هذا_الحقل_مطلوب'),
        invalid_number: t('surfaces.يجب_أن_يكون_رقماً'),
        min: t('surfaces.القيمة_أقل_من_الحد_الأدنى'),
      };
    },
  };

  return (
    <StateManager config={config}>
      <UniversalFormScreen config={config} adapter={adapter} />
    </StateManager>
  );
}


