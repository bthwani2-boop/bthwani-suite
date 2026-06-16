// dsh/frontend/shared/field/use-field-runtime-actions.ts
// Authority: shared/field — API action binders utilizing partner and documents clients.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import {
  createPartnerDocumentHttpClient,
  resolvePartnerDocumentBaseUrl,
} from '../partner/documents';
import {
  createPartnerStoreOnboardingHttpClient,
  resolvePartnerStoreOnboardingBaseUrl,
} from '../partner/onboarding';
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
  kind: string,
  uploadedRef: string,
): FieldStoreFile {
  const docs = { ...store.draft.documents };
  const photos = { ...store.draft.photos };

  if (kind === 'commercial_registration') {
    docs.commercialRegistrationStatus = 'uploaded';
    docs.commercialRegistrationRef = uploadedRef;
  } else if (kind === 'identity_proof' || kind === 'id_card') {
    docs.ownerIdStatus = 'uploaded';
    docs.ownerIdRef = uploadedRef;
  } else if (kind === 'tax_certificate' || kind === 'trade_license') {
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
      documents: docs as any,
      photos,
    },
  };
}

export function useFieldRuntimeActions() {
  const partnerStoreOnboardingClient = React.useMemo(
    () => createPartnerStoreOnboardingHttpClient(resolvePartnerStoreOnboardingBaseUrl()),
    [],
  );
  const fieldVisitClient = React.useMemo(
    () => createDshFieldVisitHttpClient(resolveDshFieldVisitBaseUrl()),
    [],
  );
  const partnerDocumentClient = React.useMemo(
    () => createPartnerDocumentHttpClient(resolvePartnerDocumentBaseUrl()),
    [],
  );

  const createStoreFromDraft = React.useCallback(
    (store: FieldStoreFile) => {
      const name = (store.draft.basics.storeName || store.name).trim();
      const address = (store.draft.location.addressLine || store.location).trim();
      const categoryId = (store.draft.classification.mainCategory || store.category).trim();

      return partnerStoreOnboardingClient.createStore({
        name: name || store.name,
        address: address || store.location,
        category_id: categoryId || undefined,
        supports_pickup: false,
        supports_partner_delivery: true,
      });
    },
    [partnerStoreOnboardingClient],
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
    (storeId: string, kind: any, uploadedRef: string) =>
      partnerDocumentClient.createDocument(storeId, {
        document_kind: kind,
        media_key: uploadedRef,
      }),
    [partnerDocumentClient],
  );

  return {
    createStoreFromDraft,
    submitVisit,
    submitDocument,
  } as const;
}
