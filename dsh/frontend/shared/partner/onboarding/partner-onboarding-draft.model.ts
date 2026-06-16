// dsh/frontend/shared/partner/onboarding/partner-onboarding-draft.model.ts
// Authority: shared/partner/onboarding — managing local store draft state and synchronization.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { PartnerOnboardingDraft, PartnerFulfillmentModeAgreement } from './partner-onboarding.types';
import { createEmptyDraft } from './partner-onboarding.lifecycle';

export type OnboardingStoreFile = {
  id: string;
  source: 'candidate' | 'manual' | 'local-draft' | 'backend';
  draftLocalId?: string;
  backendStoreId?: string;
  syncStatus?: 'local-draft' | 'backend' | 'syncing' | 'sync-failed';
  name: string;
  category: string;
  location: string;
  nextVisitLabel: string;
  assignedFieldMember: string;
  lastUpdatedLabel: string;
  lockedStatus?: string;
  stageLabelOverride?: string;
  statusNoteOverride?: string;
  lifecycleNote?: string;
  financeLabel: string;
  reviewFeedback?: string;
  draft: PartnerOnboardingDraft;
  fulfillmentAgreements?: readonly PartnerFulfillmentModeAgreement[];
};

let draftIdCounter = 0;
function generateDraftId(prefix: string): string {
  draftIdCounter += 1;
  return `${prefix}-${draftIdCounter}`;
}

function formatNowLabel() {
  try {
    const time = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit' }).format(new Date());
    return `اليوم ${time}`;
  } catch {
    return 'الآن';
  }
}

export function touchOnboardingStoreDraft(store: OnboardingStoreFile, note?: string): OnboardingStoreFile {
  const draftName = store.draft.basics.storeName.trim();
  const draftCategory = store.draft.classification.mainCategory.trim();
  const draftLocation = store.draft.location.zone.trim();

  return {
    ...store,
    name: draftName || store.name,
    category: draftCategory || store.category,
    location: draftLocation || store.location,
    lastUpdatedLabel: 'الآن',
    lifecycleNote: note ?? store.lifecycleNote,
    draft: { ...store.draft, lastSavedLabel: formatNowLabel() },
  };
}

export function submitOnboardingStoreForReview(store: OnboardingStoreFile): OnboardingStoreFile {
  const draftName = store.draft.basics.storeName.trim();
  const draftCategory = store.draft.classification.mainCategory.trim();
  const draftLocation = store.draft.location.zone.trim();

  return {
    ...store,
    name: draftName || store.name,
    category: draftCategory || store.category,
    location: draftLocation || store.location,
    lastUpdatedLabel: 'الآن',
    lifecycleNote: 'أُرسل الملف إلى مراجعة الشركاء، والميداني ينتظر القرار.',
    draft: {
      ...store.draft,
      lastSavedLabel: formatNowLabel(),
      submittedAt: new Date().toISOString(),
    },
  };
}

export function createManualOnboardingStore(): OnboardingStoreFile {
  const draftLocalId = generateDraftId('field-store-local-draft');
  const emptyDraft = createEmptyDraft({ lastSavedLabel: 'مسودة جديدة' });
  return {
    id: draftLocalId,
    source: 'local-draft',
    draftLocalId,
    syncStatus: 'local-draft',
    name: 'ملف انضمام جديد',
    category: 'قيد التحديد',
    location: 'الرياض',
    nextVisitLabel: 'اليوم',
    assignedFieldMember: 'المندوب الميداني',
    lastUpdatedLabel: 'الآن',
    financeLabel: 'لا توجد بيانات مالية بعد',
    draft: emptyDraft,
  };
}

export function usePartnerOnboardingDraftModel({
  onboardingRuntime,
  pushRoute,
}: {
  onboardingRuntime: {
    createStoreFromDraft: (store: OnboardingStoreFile) => Promise<{ id: string }>;
    submitDocument: (storeId: string, kind: string, uploadedRef: string) => Promise<unknown>;
  };
  pushRoute: (route: { kind: string; storeId?: string; backendStoreId?: string }) => void;
}) {
  const [stores, setStores] = React.useState<OnboardingStoreFile[]>([]);

  const patchStore = React.useCallback(
    (storeId: string, updater: (store: OnboardingStoreFile) => OnboardingStoreFile) => {
      setStores((current) => current.map((s) => (s.id === storeId ? updater(s) : s)));
    },
    [],
  );

  const handleCreateStore = React.useCallback(() => {
    const nextStore = createManualOnboardingStore();
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
    patchStore(storeId, (s) => touchOnboardingStoreDraft(s));
  }, [patchStore]);

  const handleSubmitReview = React.useCallback(
    (store: OnboardingStoreFile) => {
      patchStore(store.id, (s) => ({ ...s, syncStatus: 'syncing' as const }));
      void onboardingRuntime.createStoreFromDraft(store).then(async (res) => {
        if (!res || !res.id) {
          throw new Error('No backend store ID returned on review submission confirmation.');
        }
        patchStore(store.id, (s) => submitOnboardingStoreForReview({
          ...s,
          syncStatus: 'backend' as const,
          backendStoreId: res.id,
        }));

        const docs = store.draft.documents;
        const photos = store.draft.photos;

        if (docs.commercialRegistrationRef) {
          try {
            await onboardingRuntime.submitDocument(res.id, 'commercial_registration', docs.commercialRegistrationRef);
          } catch (e) {
            console.error('[partner-onboarding:sync-docs] Failed to submit CR document:', e);
          }
        }
        if (docs.identityProofRef) {
          try {
            await onboardingRuntime.submitDocument(res.id, 'identity_proof', docs.identityProofRef);
          } catch (e) {
            console.error('[partner-onboarding:sync-docs] Failed to submit ID document:', e);
          }
        }
        if (docs.taxCertificateRef) {
          try {
            await onboardingRuntime.submitDocument(res.id, 'tax_certificate', docs.taxCertificateRef);
          } catch (e) {
            console.error('[partner-onboarding:sync-docs] Failed to submit tax cert document:', e);
          }
        }
        if (photos.storefrontPhotoRef) {
          try {
            await onboardingRuntime.submitDocument(res.id, 'storefront_photo', photos.storefrontPhotoRef);
          } catch (e) {
            console.error('[partner-onboarding:sync-docs] Failed to submit storefront photo:', e);
          }
        }
        if (photos.interiorPhotoRef) {
          try {
            await onboardingRuntime.submitDocument(res.id, 'interior_photo', photos.interiorPhotoRef);
          } catch (e) {
            console.error('[partner-onboarding:sync-docs] Failed to submit interior photo:', e);
          }
        }
        pushRoute({ kind: 'visit', backendStoreId: res.id });
      }).catch((err) => {
        console.error('[partner-onboarding:submit-review] Error creating store from draft:', err);
        patchStore(store.id, (s) => ({
          ...s,
          syncStatus: 'sync-failed' as const,
          reviewFeedback: 'تعذر تأكيد المتجر من الخلفية. ابق في الإضافة ولا تفتح الزيارة حتى يتوفر backendStoreId.',
        }));
      });
    },
    [onboardingRuntime, patchStore, pushRoute],
  );

  const handleDocumentUpload = React.useCallback(
    async (store: OnboardingStoreFile, kind: string, uploadedRef: string) => {
      if (store.backendStoreId) {
        await onboardingRuntime.submitDocument(store.backendStoreId, kind, uploadedRef);
      }
      patchStore(store.id, (current) => {
        const docs = { ...current.draft.documents };
        const photos = { ...current.draft.photos };

        if (kind === 'commercial_registration') {
          docs.commercialRegistrationStatus = 'uploaded';
          docs.commercialRegistrationRef = uploadedRef;
        } else if (kind === 'identity_proof') {
          docs.identityProofStatus = 'uploaded';
          docs.identityProofRef = uploadedRef;
        } else if (kind === 'tax_certificate') {
          docs.taxCertificateStatus = 'uploaded';
          docs.taxCertificateRef = uploadedRef;
        } else if (kind === 'storefront_photo') {
          photos.storefrontPhotoRef = uploadedRef;
        } else if (kind === 'interior_photo') {
          photos.interiorPhotoRef = uploadedRef;
        }

        return {
          ...current,
          lastUpdatedLabel: 'الآن',
          draft: {
            ...current.draft,
            documents: docs,
            photos,
          },
        };
      });
    },
    [onboardingRuntime, patchStore],
  );

  return { stores, setStores, patchStore, handleCreateStore, handleSaveDraft, handleSubmitReview, handleDocumentUpload };
}
