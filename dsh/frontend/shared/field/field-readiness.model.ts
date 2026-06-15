// Canonical location: dsh/frontend/shared/field/field-readiness.model.ts
// Authority: dsh/frontend/shared/field — computing active store readiness, completion progress, and read-only flags.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { FieldStoreFile, FieldLeadStatus, FieldStatusTone } from './field.types';
import {
  resolveFieldCompletionPercent,
  isFieldStoreReadOnly,
  resolveFieldStoreStatus,
  resolveFieldStoreStatusLabel,
  resolveFieldStoreStatusTone,
  resolveFieldStoreLifecycleLabel,
  resolveFieldStoreNextActionLabel,
} from './field.store-lifecycle';

export function useFieldReadinessModel(store: FieldStoreFile | null) {
  return React.useMemo(() => {
    if (!store) {
      return {
        completionPercent: 0,
        readOnly: false,
        status: 'new-lead' as FieldLeadStatus,
        statusLabel: '',
        statusTone: 'default' as FieldStatusTone,
        lifecycleLabel: '',
        nextActionLabel: '',
      };
    }

    return {
      completionPercent: resolveFieldCompletionPercent(store.draft),
      readOnly: isFieldStoreReadOnly(store),
      status: resolveFieldStoreStatus(store),
      statusLabel: resolveFieldStoreStatusLabel(store),
      statusTone: resolveFieldStoreStatusTone(store),
      lifecycleLabel: resolveFieldStoreLifecycleLabel(store),
      nextActionLabel: resolveFieldStoreNextActionLabel(store),
    };
  }, [store]);
}
