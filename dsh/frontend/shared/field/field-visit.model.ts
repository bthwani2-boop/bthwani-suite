// Canonical location: dsh/frontend/shared/field/field-visit.model.ts
// Authority: dsh/frontend/shared/field — visit form state, validation, and backend submission.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type {
  FieldStoreFile,
  DshFieldRouteState,
  DshFieldStoreVisitValues,
  DshFieldStoreVisitErrors,
} from './field.types';
import { validateVisitFields, hasVisitErrors } from './field.visit-policy';
import type { useFieldRuntimeActions } from './use-field-runtime-actions';

type FieldRuntime = ReturnType<typeof useFieldRuntimeActions>;
type PatchStore = (storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => void;
type PushRoute = (route: DshFieldRouteState) => void;

export function useFieldVisitModel({
  fieldRuntime,
  patchStore,
  pushRoute,
}: {
  fieldRuntime: FieldRuntime;
  patchStore: PatchStore;
  pushRoute: PushRoute;
}) {
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});
  const [visitErrors, setVisitErrors] = React.useState<Record<string, DshFieldStoreVisitErrors>>({});

  const handleVisitValueChange = React.useCallback(
    (storeId: string, values: DshFieldStoreVisitValues, field: keyof DshFieldStoreVisitValues, value: string) => {
      setVisitValues((current) => ({ ...current, [storeId]: { ...values, [field]: value } }));
      setVisitErrors((current) => {
        const next = { ...current[storeId] };
        delete next[field];
        return { ...current, [storeId]: next };
      });
    },
    [],
  );

  const handleVisitSubmit = React.useCallback(
    (store: FieldStoreFile, fallbackValues: DshFieldStoreVisitValues) => {
      const nextValues = visitValues[store.id] ?? fallbackValues;
      const nextErrors = validateVisitFields(nextValues);
      if (hasVisitErrors(nextErrors)) {
        setVisitErrors((current) => ({ ...current, [store.id]: nextErrors }));
        return;
      }
      if (!store.backendStoreId) {
        throw new Error('لا يمكن تسجيل زيارة ميدانية قبل تأكيد المتجر الخلفي وحصوله على معرّف معتمد (backendStoreId غير متوفر).');
      }
      patchStore(store.id, (s) => ({ ...s, syncStatus: 'syncing' as const }));
      void fieldRuntime.submitVisit(store.backendStoreId, nextValues).then(() => {
        patchStore(store.id, (s) => ({ ...s, syncStatus: 'backend' as const }));
      }).catch((err) => {
        console.error('[field:submit-visit] Error submitting visit:', err);
        patchStore(store.id, (s) => ({ ...s, syncStatus: 'sync-failed' as const }));
      });
      patchStore(store.id, (current) => ({
        ...current,
        lifecycleNote: nextValues.visitSummary.trim() || current.lifecycleNote,
        reviewFeedback: nextValues.followUpAction.trim() || current.reviewFeedback,
        lastUpdatedLabel: 'الآن',
      }));
      pushRoute({ kind: 'history' });
    },
    [fieldRuntime, patchStore, pushRoute, visitValues],
  );

  return { visitValues, visitErrors, handleVisitValueChange, handleVisitSubmit };
}
