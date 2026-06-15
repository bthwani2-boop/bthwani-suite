// Canonical location: dsh/frontend/shared/field/field-draft.model.ts
// Authority: dsh/frontend/shared/field — local store draft list + backend sync lifecycle.
// Rule: draft stores (no backend ID) are local-only until backend confirms syncStatus:'backend'.
//       Callers must not treat a draft store as runtime truth before that confirmation.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import {
  createManualFieldStore,
  submitFieldStoreForReview,
} from './field.store-lifecycle';
import type { FieldStoreFile, DshFieldRouteState } from './field.types';
import type { DshFieldDocumentKind } from './dsh-field-document-client';
import {
  useFieldRuntimeActions,
  applyFieldDocumentUploadToStore,
} from './use-field-runtime-actions';

type FieldRuntime = ReturnType<typeof useFieldRuntimeActions>;
type PushRoute = (route: DshFieldRouteState) => void;

export function useFieldDraftModel({
  fieldRuntime,
  pushRoute,
}: {
  fieldRuntime: FieldRuntime;
  pushRoute: PushRoute;
}) {
  const [stores, setStores] = React.useState<FieldStoreFile[]>([]);

  const patchStore = React.useCallback(
    (storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => {
      setStores((current) => current.map((s) => (s.id === storeId ? updater(s) : s)));
    },
    [],
  );

  const handleCreateStore = React.useCallback(() => {
    const nextStore = createManualFieldStore();
    setStores((current) => [
      {
        ...nextStore,
        draft: {
          ...nextStore.draft,
          basics: { ...nextStore.draft.basics, storeName: nextStore.name },
          location: { ...nextStore.draft.location, city: nextStore.location },
        },
      },
      ...current,
    ]);
    pushRoute({ kind: 'onboarding', storeId: nextStore.id });
  }, [pushRoute]);

  const handleSaveDraft = React.useCallback((storeId: string) => {
    patchStore(storeId, (s) => ({
      ...s,
      lastUpdatedLabel: 'الآن',
      draft: { ...s.draft, lastSavedLabel: 'الآن' },
    }));
  }, [patchStore]);

  const handleSubmitReview = React.useCallback(
    (store: FieldStoreFile) => {
      patchStore(store.id, (s) => ({ ...s, syncStatus: 'syncing' as const }));
      void fieldRuntime.createStoreFromDraft(store).then(() => {
        patchStore(store.id, (s) => ({ ...s, syncStatus: 'backend' as const }));
      }).catch(() => {
        patchStore(store.id, (s) => ({ ...s, syncStatus: 'sync-failed' as const }));
      });
      patchStore(store.id, submitFieldStoreForReview);
      pushRoute({ kind: 'visit', storeId: store.id });
    },
    [fieldRuntime, patchStore, pushRoute],
  );

  const handleDocumentUpload = React.useCallback(
    async (store: FieldStoreFile, kind: DshFieldDocumentKind, uploadedRef: string) => {
      await fieldRuntime.submitDocument(store.id, kind, uploadedRef);
      patchStore(store.id, (current) => applyFieldDocumentUploadToStore(current, kind, uploadedRef));
    },
    [fieldRuntime, patchStore],
  );

  return { stores, patchStore, handleCreateStore, handleSaveDraft, handleSubmitReview, handleDocumentUpload };
}
