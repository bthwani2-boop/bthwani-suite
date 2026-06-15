// DSH Field App — store lifecycle types, onboarding drafts, visit contracts, surface routing.
// No JSX. No ui-kit. No Tamagui.

import type { DshFulfillmentDeliveryMode } from '../delivery';

export type FieldFulfillmentMode = DshFulfillmentDeliveryMode;

export type FieldFulfillmentModeAgreement = {
  mode: FieldFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  commissionRatePreview: string;
  settlementBasis: string;
  operationalReadiness: 'ready' | 'pending' | 'unavailable';
};

export type FieldStatusTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type FieldLeadSource = 'candidate' | 'manual' | 'local-ui-draft' | 'backend';

export type FieldLeadStatus =
  | 'new-lead'
  | 'visit-planned'
  | 'offer-pending-approval'
  | 'offer-approved'
  | 'appointment-scheduled'
  | 'visited'
  | 'follow-up-required'
  | 'ready-for-onboarding'
  | 'submitted';

export type FieldLeadFilter = 'all' | 'today' | 'ready' | 'follow-up' | 'pending' | 'submitted' | 'done';

export type DshFieldSurfaceId = 'stores' | 'onboarding' | 'visits' | 'finance' | 'profile';

export type FieldOnboardingSectionId =
  | 'basics'
  | 'classification'
  | 'location'
  | 'photos'
  | 'documents'
  | 'products'
  | 'offer'
  | 'review';

export type FieldDocumentRuntimeStatus = 'missing' | 'uploaded' | 'approved' | 'needs_reupload' | 'rejected';
/** @deprecated Use FieldDocumentRuntimeStatus */
export type FieldDocumentPreviewStatus = FieldDocumentRuntimeStatus;
export type FieldDocumentStatus = FieldDocumentRuntimeStatus;

export type FieldOnboardingDraft = {
  activeSectionId: FieldOnboardingSectionId;
  basics: { storeName: string; ownerName: string; ownerPhone: string; managerName: string };
  classification: { storeType: string; mainCategory: string; subCategory: string };
  location: { city: string; zone: string; addressLine: string; coverageSummary: string; latitude: string; longitude: string; landmark: string };
  photos: { storefrontPhotoRef: string; interiorPhotoRef: string; signagePhotoRef: string };
  documents: {
    commercialRegistrationRef: string;
    ownerIdRef: string;
    tradeLicenseRef: string;
    commercialRegistrationStatus: FieldDocumentRuntimeStatus;
    ownerIdStatus: FieldDocumentRuntimeStatus;
    tradeLicenseStatus: FieldDocumentRuntimeStatus;
  };
  products: { featuredProductName: string; featuredProductPrice: string; sampleCatalogNote: string };
  offer: { preliminaryOffer: string; operatingHours: string; deliveryReadiness: string; financeNote: string };
  review: { fieldNotes: string; partnerReviewNote: string };
  lastSavedLabel: string;
  submittedAt?: string;
};

export type FieldStoreFile = {
  id: string;
  source: FieldLeadSource;
  draftLocalId?: string;
  syncStatus?: 'local-ui-draft' | 'backend' | 'syncing' | 'sync-failed';
  name: string;
  category: string;
  location: string;
  nextVisitLabel: string;
  assignedFieldMember: string;
  lastUpdatedLabel: string;
  lockedStatus?: FieldLeadStatus;
  stageLabelOverride?: string;
  statusNoteOverride?: string;
  lifecycleNote?: string;
  financeLabel: string;
  reviewFeedback?: string;
  draft: FieldOnboardingDraft;
  fulfillmentAgreements?: readonly FieldFulfillmentModeAgreement[];
};

export type FieldSectionSummary = {
  id: FieldOnboardingSectionId;
  label: string;
  complete: boolean;
  missingCount: number;
};

// ── Surface routing types ──────────────────────────────────────────────────

export type DshFieldRoute =
  | 'stores'
  | 'onboarding'
  | 'visit'
  | 'account'
  | 'profile'
  | 'history'
  | 'finance'
  | 'readiness-escalation'
  | 'document-upload';

export type DshFieldRouteState =
  | { kind: 'stores' }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'visit'; storeId: string }
  | { kind: 'account' }
  | { kind: 'profile' }
  | { kind: 'history' }
  | { kind: 'finance' }
  | { kind: 'readiness-escalation'; storeId: string }
  | { kind: 'document-upload'; storeId: string };

export type DshFieldCommandTarget = DshFieldRoute;

export type DshFieldNavigationCommand = {
  token: number;
  target: DshFieldCommandTarget;
  storeId?: string;
};

export type DshFieldSurfaceProps = {
  command?: DshFieldNavigationCommand;
  onExit?: () => void;
};

export type DshFieldSurfaceHostProps = DshFieldSurfaceProps;

// ── Visit contract ─────────────────────────────────────────────────────────

export const dshFieldVisitContractMeta = {
  dataKind: 'SCAFFOLD_PENDING_BINDING',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export type DshFieldStoreVisitState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitErrors = Partial<Record<keyof DshFieldStoreVisitValues, string>>;

// ── Labels and constants ───────────────────────────────────────────────────

export const fieldStatusLabels: Record<FieldLeadStatus, string> = {
  'new-lead': 'فرصة جديدة',
  'visit-planned': 'زيارة مخططة',
  'offer-pending-approval': 'بانتظار اعتماد العرض',
  'offer-approved': 'العرض معتمد',
  'appointment-scheduled': 'جاهز للزيارة',
  visited: 'بانتظار تسجيل النتيجة',
  'follow-up-required': 'تحتاج متابعة',
  'ready-for-onboarding': 'جاهز للإضافة',
  submitted: 'مرسل للمراجعة',
};

export const fieldStatusTones: Record<FieldLeadStatus, FieldStatusTone> = {
  'new-lead': 'default',
  'visit-planned': 'info',
  'offer-pending-approval': 'warning',
  'offer-approved': 'success',
  'appointment-scheduled': 'brand',
  visited: 'info',
  'follow-up-required': 'warning',
  'ready-for-onboarding': 'success',
  submitted: 'brand',
};

export const fieldFilterOptions: readonly { id: FieldLeadFilter; label: string; tone: FieldStatusTone }[] = [
  { id: 'all', label: 'الكل', tone: 'default' },
  { id: 'today', label: 'اليوم', tone: 'brand' },
  { id: 'ready', label: 'جاهز للإضافة', tone: 'success' },
  { id: 'follow-up', label: 'تحتاج متابعة', tone: 'warning' },
  { id: 'pending', label: 'بانتظار اعتماد', tone: 'info' },
  { id: 'submitted', label: 'مرسل', tone: 'brand' },
  { id: 'done', label: 'منتهٍ للميداني', tone: 'success' },
] as const;

export const fieldSectionOrder: readonly FieldOnboardingSectionId[] = [
  'basics', 'classification', 'location', 'photos', 'documents', 'products', 'offer', 'review',
] as const;

export const fieldSectionLabels: Record<FieldOnboardingSectionId, string> = {
  basics: 'البيانات الأساسية',
  classification: 'النوع والتصنيف',
  location: 'الموقع والتغطية',
  photos: 'الصور',
  documents: 'التحقق من المستندات',
  products: 'المنتجات الأولية',
  offer: 'العرض والاتفاق',
  review: 'المراجعة والإرسال',
};
