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
      void fieldRuntime.createStoreFromDraft(store).then(async (res) => {
        if (!res || !res.id) {
          throw new Error('No backend store ID returned on review submission confirmation.');
        }
        patchStore(store.id, (s) => submitFieldStoreForReview({
          ...s,
          syncStatus: 'backend' as const,
          backendStoreId: res.id,
        }));

        // Asynchronously sync any documents collected during the draft stage now that backendStoreId is available
        const docs = store.draft.documents;
        const photos = store.draft.photos;

        if (docs.commercialRegistrationRef) {
          try {
            await fieldRuntime.submitDocument(res.id, 'commercial_registration', docs.commercialRegistrationRef);
          } catch (e) {
            console.error('[field:sync-docs] Failed to submit CR document:', e);
          }
        }
        if (docs.ownerIdRef) {
          try {
            await fieldRuntime.submitDocument(res.id, 'identity_proof', docs.ownerIdRef);
          } catch (e) {
            console.error('[field:sync-docs] Failed to submit ID document:', e);
          }
        }
        if (docs.tradeLicenseRef) {
          try {
            await fieldRuntime.submitDocument(res.id, 'tax_certificate', docs.tradeLicenseRef);
          } catch (e) {
            console.error('[field:sync-docs] Failed to submit tax cert document:', e);
          }
        }
        if (photos.storefrontPhotoRef) {
          try {
            await fieldRuntime.submitDocument(res.id, 'storefront_photo', photos.storefrontPhotoRef);
          } catch (e) {
            console.error('[field:sync-docs] Failed to submit storefront photo:', e);
          }
        }
        if (photos.interiorPhotoRef) {
          try {
            await fieldRuntime.submitDocument(res.id, 'interior_photo', photos.interiorPhotoRef);
          } catch (e) {
            console.error('[field:sync-docs] Failed to submit interior photo:', e);
          }
        }
        pushRoute({ kind: 'visit', backendStoreId: res.id });
      }).catch((err) => {
        console.error('[field:submit-review] Error creating store from draft:', err);
        patchStore(store.id, (s) => ({
          ...s,
          syncStatus: 'sync-failed' as const,
          reviewFeedback: 'تعذر تأكيد المتجر من الخلفية. ابق في الإضافة ولا تفتح الزيارة حتى يتوفر backendStoreId.',
        }));
      });
    },
    [fieldRuntime, patchStore, pushRoute],
  );

  const handleDocumentUpload = React.useCallback(
    async (store: FieldStoreFile, kind: DshFieldDocumentKind, uploadedRef: string) => {
      if (store.backendStoreId) {
        await fieldRuntime.submitDocument(store.backendStoreId, kind, uploadedRef);
      }
      patchStore(store.id, (current) => applyFieldDocumentUploadToStore(current, kind, uploadedRef));
    },
    [fieldRuntime, patchStore],
  );

  return { stores, patchStore, handleCreateStore, handleSaveDraft, handleSubmitReview, handleDocumentUpload };
}
