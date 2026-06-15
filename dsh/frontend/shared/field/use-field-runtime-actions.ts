import React from 'react';
import {
  createDshFieldDocumentHttpClient,
  resolveDshFieldDocumentBaseUrl,
  type DshFieldDocumentKind,
} from './dsh-field-document-client';
import {
  createDshFieldStoreOnboardingHttpClient,
  resolveDshFieldStoreOnboardingBaseUrl,
} from './dsh-field-store-onboarding-client';
import {
  createDshFieldVisitHttpClient,
  resolveDshFieldVisitBaseUrl,
} from './dsh-field-visit-client';
import type { FieldStoreFile } from './field.types';

export type DshFieldVisitDraftValues = {
  readonly visitSummary: string;
  readonly followUpAction: string;
};

export function applyFieldDocumentUploadToStore(
  store: FieldStoreFile,
  kind: DshFieldDocumentKind,
  uploadedRef: string,
): FieldStoreFile {
  const docs = { ...store.draft.documents };
  const photos = { ...store.draft.photos };

  if (kind === 'commercial_registration') {
    docs.commercialRegistrationStatus = 'uploaded';
    docs.commercialRegistrationRef = uploadedRef;
  } else if (kind === 'identity_proof') {
    docs.ownerIdStatus = 'uploaded';
    docs.ownerIdRef = uploadedRef;
  } else if (kind === 'tax_certificate') {
    docs.tradeLicenseStatus = 'uploaded';
    docs.tradeLicenseRef = uploadedRef;
  } else if (kind === 'storefront_photo') {
    photos.storefrontPhotoRef = uploadedRef;
  } else if (kind === 'interior_photo') {
    photos.interiorPhotoRef = uploadedRef;
  }

  return {
    ...store,
    lastUpdatedLabel: 'الآن',
    draft: {
      ...store.draft,
      documents: docs,
      photos,
    },
  };
}

export function useFieldRuntimeActions() {
  const fieldStoreOnboardingClient = React.useMemo(
    () => createDshFieldStoreOnboardingHttpClient(resolveDshFieldStoreOnboardingBaseUrl()),
    [],
  );
  const fieldVisitClient = React.useMemo(
    () => createDshFieldVisitHttpClient(resolveDshFieldVisitBaseUrl()),
    [],
  );
  const fieldDocumentClient = React.useMemo(
    () => createDshFieldDocumentHttpClient(resolveDshFieldDocumentBaseUrl()),
    [],
  );

  const createStoreFromDraft = React.useCallback(
    (store: FieldStoreFile) => {
      const name = (store.draft.basics.storeName || store.name).trim();
      const address = (store.draft.location.addressLine || store.location).trim();
      const categoryId = (store.draft.classification.mainCategory || store.category).trim();

      return fieldStoreOnboardingClient.createFieldStore({
        name: name || store.name,
        address: address || store.location,
        category_id: categoryId || undefined,
        supports_pickup: false,
        supports_partner_delivery: true,
      });
    },
    [fieldStoreOnboardingClient],
  );

  const submitVisit = React.useCallback(
    (storeId: string, values: DshFieldVisitDraftValues) =>
      fieldVisitClient.createFieldVisit(storeId, {
        visit_summary: values.visitSummary.trim(),
        follow_up_action: values.followUpAction.trim(),
        evidence_media_keys: [],
        location_confidence: 'manual_confirmed',
      }),
    [fieldVisitClient],
  );

  const submitDocument = React.useCallback(
    (storeId: string, kind: DshFieldDocumentKind, uploadedRef: string) =>
      fieldDocumentClient.createFieldDocument(storeId, {
        document_kind: kind,
        media_key: uploadedRef,
      }),
    [fieldDocumentClient],
  );

  return {
    createStoreFromDraft,
    submitVisit,
    submitDocument,
  } as const;
}
