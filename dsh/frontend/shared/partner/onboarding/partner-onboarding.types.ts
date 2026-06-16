// dsh/frontend/shared/partner/onboarding/partner-onboarding.types.ts
// Authority: shared/partner/onboarding — partner onboarding types and status structures.
// No JSX. No ui-kit. No Tamagui.

import type { DshFulfillmentDeliveryMode } from '../../delivery';

export type PartnerFulfillmentMode = DshFulfillmentDeliveryMode;

export type PartnerFulfillmentModeAgreement = {
  mode: PartnerFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  commissionRatePreview: string;
  settlementBasis: string;
  operationalReadiness: 'ready' | 'pending' | 'unavailable';
};

export type PartnerOnboardingSectionId =
  | 'basics'
  | 'classification'
  | 'location'
  | 'photos'
  | 'documents'
  | 'products'
  | 'offer'
  | 'review';

export type PartnerDocumentRuntimeStatus = 'missing' | 'uploaded' | 'approved' | 'needs_reupload' | 'rejected';

export type PartnerOnboardingDraft = {
  activeSectionId: PartnerOnboardingSectionId;
  basics: { storeName: string; ownerName: string; ownerPhone: string; managerName: string };
  classification: { storeType: string; mainCategory: string; subCategory: string };
  location: { city: string; zone: string; addressLine: string; coverageSummary: string; latitude: string; longitude: string; landmark: string };
  photos: { storefrontPhotoRef: string; interiorPhotoRef: string; signagePhotoRef: string };
  documents: {
    commercialRegistrationRef: string;
    ownerIdRef: string;
    tradeLicenseRef: string;
    commercialRegistrationStatus: PartnerDocumentRuntimeStatus;
    ownerIdStatus: PartnerDocumentRuntimeStatus;
    tradeLicenseStatus: PartnerDocumentRuntimeStatus;
  };
  products: { featuredProductName: string; featuredProductPrice: string; sampleCatalogNote: string };
  offer: { preliminaryOffer: string; operatingHours: string; deliveryReadiness: string; financeNote: string };
  review: { fieldNotes: string; partnerReviewNote: string };
  lastSavedLabel: string;
  submittedAt?: string;
};

export const partnerSectionOrder: readonly PartnerOnboardingSectionId[] = [
  'basics',
  'classification',
  'location',
  'photos',
  'documents',
  'products',
  'offer',
  'review',
] as const;

export const partnerSectionLabels: Record<PartnerOnboardingSectionId, string> = {
  basics: 'البيانات الأساسية',
  classification: 'النوع والتصنيف',
  location: 'الموقع والتغطية',
  photos: 'الصور',
  documents: 'التحقق من المستندات',
  products: 'المنتجات الأولية',
  offer: 'العرض والاتفاق',
  review: 'المراجعة والإرسال',
};
