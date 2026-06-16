// dsh/frontend/shared/partner/onboarding/partner-onboarding.lifecycle.ts
// Authority: shared/partner/onboarding — lifecycle, status, completion and progress logic.
// No JSX. No ui-kit. No Tamagui.

import type {
  PartnerOnboardingDraft,
  PartnerOnboardingSectionId,
  PartnerDocumentRuntimeStatus,
} from './partner-onboarding.types';
import {
  partnerSectionOrder,
  partnerSectionLabels,
} from './partner-onboarding.types';
import type { OnboardingStoreFile } from './partner-onboarding-draft.model';

export function createEmptyDraft(overrides?: Partial<PartnerOnboardingDraft>): PartnerOnboardingDraft {
  return {
    activeSectionId: 'basics',
    basics: { storeName: '', ownerName: '', ownerPhone: '', managerName: '' },
    classification: { storeType: '', mainCategory: '', subCategory: '' },
    location: { city: '', zone: '', addressLine: '', coverageSummary: '', latitude: '', longitude: '', landmark: '' },
    photos: { storefrontPhotoRef: '', interiorPhotoRef: '', signagePhotoRef: '' },
    documents: {
      commercialRegistrationRef: '',
      identityProofRef: '',
      taxCertificateRef: '',
      commercialRegistrationStatus: 'missing',
      identityProofStatus: 'missing',
      taxCertificateStatus: 'missing',
    },
    products: { items: [], sampleCatalogNote: '' },
    offer: { preliminaryOffer: '', operatingHours: '', deliveryReadiness: '', financeNote: '' },
    review: { fieldNotes: '', partnerReviewNote: '' },
    lastSavedLabel: 'لم تحفظ بعد',
    ...overrides,
  };
}

export function getPartnerRequiredMissingItems(draft: PartnerOnboardingDraft): string[] {
  const missing: string[] = [];
  const documentIsResolved = (ref: string, status: PartnerDocumentRuntimeStatus) =>
    ref.trim().length > 0 && (status === 'uploaded' || status === 'approved');

  if (!draft.basics.storeName.trim()) missing.push('اسم المتجر');
  if (!draft.basics.ownerName.trim()) missing.push('اسم المالك');
  if (!draft.basics.ownerPhone.trim()) missing.push('جوال المالك');
  if (!draft.location.city.trim()) missing.push('المدينة');
  if (!draft.photos.storefrontPhotoRef.trim()) missing.push('صورة الواجهة');
  if (!documentIsResolved(draft.documents.commercialRegistrationRef, draft.documents.commercialRegistrationStatus)) missing.push('السجل التجاري');
  if (!documentIsResolved(draft.documents.identityProofRef, draft.documents.identityProofStatus)) missing.push('هوية المالك');
  if (draft.documents.taxCertificateRef.trim() && (draft.documents.taxCertificateStatus === 'needs_reupload' || draft.documents.taxCertificateStatus === 'rejected')) {
    missing.push('رخصة التجارة تحتاج معالجة');
  }
  if (!draft.offer.preliminaryOffer.trim()) missing.push('العرض أو الاتفاق المبدئي');
  if (!draft.offer.operatingHours.trim()) missing.push('ساعات العمل');
  return missing;
}

export type PartnerSectionSummary = {
  id: PartnerOnboardingSectionId;
  label: string;
  complete: boolean;
  missingCount: number;
};

export function resolvePartnerSectionSummaries(draft: PartnerOnboardingDraft): PartnerSectionSummary[] {
  const documentsMissing = [
    { ref: draft.documents.commercialRegistrationRef, status: draft.documents.commercialRegistrationStatus, required: true },
    { ref: draft.documents.identityProofRef, status: draft.documents.identityProofStatus, required: true },
    { ref: draft.documents.taxCertificateRef, status: draft.documents.taxCertificateStatus, required: false },
  ].filter((item) => {
    if (item.required) return !item.ref.trim() || (item.status !== 'uploaded' && item.status !== 'approved');
    return item.ref.trim().length > 0 && (item.status === 'needs_reupload' || item.status === 'rejected');
  }).length;

  const sectionMissing: Record<PartnerOnboardingSectionId, number> = {
    basics: [draft.basics.storeName, draft.basics.ownerName, draft.basics.ownerPhone].filter((v) => !v.trim()).length,
    classification: [draft.classification.storeType, draft.classification.mainCategory].filter((v) => !v.trim()).length,
    location: [draft.location.city, draft.location.addressLine].filter((v) => !v.trim()).length,
    photos: [draft.photos.storefrontPhotoRef, draft.photos.interiorPhotoRef].filter((v) => !v.trim()).length,
    documents: documentsMissing,
    products: !draft.products.items || draft.products.items.length === 0 ? 1 : 0,
    offer: [draft.offer.preliminaryOffer, draft.offer.operatingHours].filter((v) => !v.trim()).length,
    review: getPartnerRequiredMissingItems(draft).length,
  };

  return partnerSectionOrder.map((id) => ({
    id,
    label: partnerSectionLabels[id],
    complete: sectionMissing[id] === 0,
    missingCount: sectionMissing[id],
  }));
}

export function resolvePartnerCompletionPercent(draft: PartnerOnboardingDraft): number {
  const sections = resolvePartnerSectionSummaries(draft);
  return Math.round((sections.filter((s) => s.complete).length / sections.length) * 100);
}

// ── Onboarding Store Status mappings ───────────────────────────────────────────

export type OnboardingLeadStatus =
  | 'new-lead'
  | 'offer-pending-approval'
  | 'offer-approved'
  | 'follow-up-required'
  | 'ready-for-onboarding'
  | 'submitted';

export function resolveOnboardingStoreStatus(store: OnboardingStoreFile): OnboardingLeadStatus {
  if (store.lockedStatus) {
    if (store.lockedStatus === 'offer-approved') return 'offer-approved';
    if (store.lockedStatus === 'submitted') return 'submitted';
    if (store.lockedStatus === 'ready-for-onboarding') return 'ready-for-onboarding';
    if (store.lockedStatus === 'follow-up-required') return 'follow-up-required';
    if (store.lockedStatus === 'offer-pending-approval') return 'offer-pending-approval';
  }
  if (store.draft.submittedAt) return 'submitted';

  const missing = getPartnerRequiredMissingItems(store.draft);
  const hasAnyData = [
    store.draft.basics.storeName,
    store.draft.basics.ownerName,
    store.draft.classification.storeType,
    store.draft.location.addressLine,
    store.draft.offer.preliminaryOffer,
    store.draft.review.fieldNotes,
  ].some((v) => v.trim().length > 0);

  if (missing.length === 0) {
    const hasProducts = store.draft.products.items && store.draft.products.items.length > 0;
    const hasClassification = store.draft.classification.storeType.trim() && store.draft.classification.mainCategory.trim();
    if (!hasProducts || !hasClassification) {
      return 'follow-up-required';
    }
    return 'ready-for-onboarding';
  }
  if (store.reviewFeedback) return 'follow-up-required';
  if (store.draft.offer.preliminaryOffer.trim() && store.draft.basics.storeName.trim() && store.draft.location.city.trim()) {
    return 'offer-pending-approval';
  }
  if (hasAnyData) return 'follow-up-required';
  return 'new-lead';
}

export const onboardingStatusLabels: Record<OnboardingLeadStatus, string> = {
  'new-lead': 'فرصة جديدة',
  'offer-pending-approval': 'بانتظار اعتماد العرض',
  'offer-approved': 'العرض معتمد',
  'follow-up-required': 'تحتاج متابعة',
  'ready-for-onboarding': 'جاهز للإضافة',
  submitted: 'مرسل للمراجعة',
};

export const onboardingStatusTones: Record<OnboardingLeadStatus, 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info'> = {
  'new-lead': 'default',
  'offer-pending-approval': 'warning',
  'offer-approved': 'success',
  'follow-up-required': 'warning',
  'ready-for-onboarding': 'success',
  submitted: 'brand',
};

export function resolveOnboardingStoreStatusLabel(store: OnboardingStoreFile): string {
  return store.statusNoteOverride ?? onboardingStatusLabels[resolveOnboardingStoreStatus(store)];
}

export function resolveOnboardingStoreStatusTone(store: OnboardingStoreFile) {
  return onboardingStatusTones[resolveOnboardingStoreStatus(store)];
}

export function resolveOnboardingStoreLifecycleLabel(store: OnboardingStoreFile): string {
  if (store.lifecycleNote) return store.lifecycleNote;
  const status = resolveOnboardingStoreStatus(store);
  if (status === 'offer-approved') return 'منتهٍ للميداني';
  if (status === 'submitted') return 'بانتظار مراجعة الشركاء';
  if (status === 'ready-for-onboarding') return 'الملف مكتمل وجاهز للإرسال';
  if (status === 'follow-up-required') {
    const missing = getPartnerRequiredMissingItems(store.draft);
    if (missing.length === 0) {
      const hasProducts = store.draft.products.items && store.draft.products.items.length > 0;
      const hasClassification = store.draft.classification.storeType.trim() && store.draft.classification.mainCategory.trim();
      if (!hasProducts || !hasClassification) {
        return 'بانتظار تحديد تصنيف المتجر ورفع المنتجات الابتدائية لتفعيله';
      }
    }
    return 'هناك نواقص عملية قبل الإرسال';
  }
  if (status === 'offer-pending-approval') return 'العرض ما زال تحت المراجعة';
  return 'ملف انضمام قيد البناء';
}

export function resolveOnboardingStoreNextActionLabel(store: OnboardingStoreFile): string {
  const status = resolveOnboardingStoreStatus(store);
  if (status === 'offer-approved') return 'عرض السجل والعمولة';
  if (status === 'submitted') return 'انتظار قرار المراجعة';
  if (status === 'ready-for-onboarding') return 'إرسال للمراجعة';
  if (status === 'follow-up-required') {
    const missing = getPartnerRequiredMissingItems(store.draft);
    if (missing.length === 0) {
      const hasProducts = store.draft.products.items && store.draft.products.items.length > 0;
      const hasClassification = store.draft.classification.storeType.trim() && store.draft.classification.mainCategory.trim();
      if (!hasProducts || !hasClassification) {
        return 'تصنيف المتجر والمنتجات';
      }
    }
    return 'إكمال النواقص';
  }
  if (status === 'offer-pending-approval') return 'مراجعة العرض';
  return 'بدء ملف الانضمام';
}

export function isOnboardingStoreReadOnly(store: OnboardingStoreFile): boolean {
  const status = resolveOnboardingStoreStatus(store);
  return status === 'submitted' || status === 'offer-approved';
}
