import type { DshFulfillmentDeliveryMode } from './dsh-delivery-mode.model';

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

export type FieldLeadSource = 'candidate' | 'manual';

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

export type FieldDocumentPreviewStatus =
  | 'missing'
  | 'uploaded'
  | 'approved'
  | 'needs_reupload'
  | 'rejected';

export type FieldOnboardingDraft = {
  activeSectionId: FieldOnboardingSectionId;
  basics: {
    storeName: string;
    ownerName: string;
    ownerPhone: string;
    managerName: string;
  };
  classification: {
    storeType: string;
    mainCategory: string;
    subCategory: string;
  };
  location: {
    city: string;
    zone: string;
    addressLine: string;
    coverageSummary: string;
    latitude: string;
    longitude: string;
    landmark: string;
  };
  photos: {
    storefrontPhotoRef: string;
    interiorPhotoRef: string;
    signagePhotoRef: string;
  };
  documents: {
    commercialRegistrationRef: string;
    ownerIdRef: string;
    tradeLicenseRef: string;
    commercialRegistrationStatus: FieldDocumentPreviewStatus;
    ownerIdStatus: FieldDocumentPreviewStatus;
    tradeLicenseStatus: FieldDocumentPreviewStatus;
  };
  products: {
    featuredProductName: string;
    featuredProductPrice: string;
    sampleCatalogNote: string;
  };
  offer: {
    preliminaryOffer: string;
    operatingHours: string;
    deliveryReadiness: string;
    financeNote: string;
  };
  review: {
    fieldNotes: string;
    partnerReviewNote: string;
  };
  lastSavedLabel: string;
  submittedAt?: string;
};

export type FieldStoreFile = {
  id: string;
  source: FieldLeadSource;
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
  'basics',
  'classification',
  'location',
  'photos',
  'documents',
  'products',
  'offer',
  'review',
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

function formatNowLabel() {
  try {
    const time = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit' }).format(new Date());
    return `اليوم ${time}`;
  } catch {
    return 'الآن';
  }
}

export function createEmptyDraft(overrides?: Partial<FieldOnboardingDraft>): FieldOnboardingDraft {
  return {
    activeSectionId: 'basics',
    basics: {
      storeName: '',
      ownerName: '',
      ownerPhone: '',
      managerName: '',
    },
    classification: {
      storeType: '',
      mainCategory: '',
      subCategory: '',
    },
    location: {
      city: '',
      zone: '',
      addressLine: '',
      coverageSummary: '',
      latitude: '',
      longitude: '',
      landmark: '',
    },
    photos: {
      storefrontPhotoRef: '',
      interiorPhotoRef: '',
      signagePhotoRef: '',
    },
    documents: {
      commercialRegistrationRef: '',
      ownerIdRef: '',
      tradeLicenseRef: '',
      commercialRegistrationStatus: 'missing',
      ownerIdStatus: 'missing',
      tradeLicenseStatus: 'missing',
    },
    products: {
      featuredProductName: '',
      featuredProductPrice: '',
      sampleCatalogNote: '',
    },
    offer: {
      preliminaryOffer: '',
      operatingHours: '',
      deliveryReadiness: '',
      financeNote: '',
    },
    review: {
      fieldNotes: '',
      partnerReviewNote: '',
    },
    lastSavedLabel: 'لم تحفظ بعد',
    ...overrides,
  };
}

export function getFieldRequiredMissingItems(draft: FieldOnboardingDraft) {
  const missing: string[] = [];
  const documentIsResolved = (ref: string, status: FieldDocumentPreviewStatus) =>
    ref.trim().length > 0 && (status === 'uploaded' || status === 'approved');

  if (!draft.basics.storeName.trim()) missing.push('اسم المتجر');
  if (!draft.basics.ownerName.trim()) missing.push('اسم المالك');
  if (!draft.basics.ownerPhone.trim()) missing.push('جوال المالك');
  if (!draft.location.city.trim()) missing.push('المدينة');
  if (!draft.location.zone.trim()) missing.push('النطاق');
  if (!draft.location.latitude.trim() || !draft.location.longitude.trim() || !draft.location.landmark.trim()) missing.push('الإحداثية GPS');
  if (!draft.photos.storefrontPhotoRef.trim()) missing.push('صورة الواجهة');
  if (!documentIsResolved(draft.documents.commercialRegistrationRef, draft.documents.commercialRegistrationStatus)) missing.push('السجل التجاري');
  if (!documentIsResolved(draft.documents.ownerIdRef, draft.documents.ownerIdStatus)) missing.push('هوية المالك');
  if (draft.documents.tradeLicenseRef.trim() && (draft.documents.tradeLicenseStatus === 'needs_reupload' || draft.documents.tradeLicenseStatus === 'rejected')) {
    missing.push('رخصة التجارة تحتاج معالجة');
  }
  if (!draft.products.featuredProductName.trim()) missing.push('منتج افتتاحي واحد');
  if (!draft.offer.preliminaryOffer.trim()) missing.push('العرض أو الاتفاق المبدئي');
  if (!draft.offer.operatingHours.trim()) missing.push('ساعات العمل');

  return missing;
}

export function resolveFieldSectionSummaries(draft: FieldOnboardingDraft): FieldSectionSummary[] {
  const documentsMissing = [
    { ref: draft.documents.commercialRegistrationRef, status: draft.documents.commercialRegistrationStatus, required: true },
    { ref: draft.documents.ownerIdRef, status: draft.documents.ownerIdStatus, required: true },
    { ref: draft.documents.tradeLicenseRef, status: draft.documents.tradeLicenseStatus, required: false },
  ].filter((item) => {
    if (item.required) {
      return !item.ref.trim() || (item.status !== 'uploaded' && item.status !== 'approved');
    }
    return item.ref.trim().length > 0 && (item.status === 'needs_reupload' || item.status === 'rejected');
  }).length;

  const sectionMissing: Record<FieldOnboardingSectionId, number> = {
    basics: [draft.basics.storeName, draft.basics.ownerName, draft.basics.ownerPhone].filter((value) => !value.trim()).length,
    classification: [draft.classification.storeType, draft.classification.mainCategory].filter((value) => !value.trim()).length,
    location: [draft.location.city, draft.location.zone, draft.location.addressLine, draft.location.latitude, draft.location.longitude, draft.location.landmark].filter((value) => !value.trim()).length,
    photos: [draft.photos.storefrontPhotoRef, draft.photos.interiorPhotoRef].filter((value) => !value.trim()).length,
    documents: documentsMissing,
    products: [draft.products.featuredProductName, draft.products.featuredProductPrice].filter((value) => !value.trim()).length,
    offer: [draft.offer.preliminaryOffer, draft.offer.operatingHours].filter((value) => !value.trim()).length,
    review: getFieldRequiredMissingItems(draft).length,
  };

  return fieldSectionOrder.map((id) => ({
    id,
    label: fieldSectionLabels[id],
    complete: sectionMissing[id] === 0,
    missingCount: sectionMissing[id],
  }));
}

export function resolveFieldCompletionPercent(draft: FieldOnboardingDraft) {
  const sections = resolveFieldSectionSummaries(draft);
  const complete = sections.filter((section) => section.complete).length;
  return Math.round((complete / sections.length) * 100);
}

export function resolveFieldStoreStatus(store: FieldStoreFile): FieldLeadStatus {
  if (store.lockedStatus) {
    return store.lockedStatus;
  }

  if (store.draft.submittedAt) {
    return 'submitted';
  }

  const missing = getFieldRequiredMissingItems(store.draft);
  const hasAnyData = [
    store.draft.basics.storeName,
    store.draft.basics.ownerName,
    store.draft.classification.storeType,
    store.draft.location.addressLine,
    store.draft.offer.preliminaryOffer,
    store.draft.review.fieldNotes,
  ].some((value) => value.trim().length > 0);

  if (missing.length === 0) {
    return 'ready-for-onboarding';
  }

  if (store.reviewFeedback) {
    return 'follow-up-required';
  }

  if (store.draft.offer.preliminaryOffer.trim() && store.draft.basics.storeName.trim() && store.draft.location.city.trim()) {
    return 'offer-pending-approval';
  }

  if (hasAnyData) {
    return 'follow-up-required';
  }

  return 'new-lead';
}

export function resolveFieldStoreStatusLabel(store: FieldStoreFile) {
  return store.statusNoteOverride ?? fieldStatusLabels[resolveFieldStoreStatus(store)];
}

export function resolveFieldStoreStatusTone(store: FieldStoreFile) {
  return fieldStatusTones[resolveFieldStoreStatus(store)];
}

export function resolveFieldStoreLifecycleLabel(store: FieldStoreFile) {
  if (store.lifecycleNote) {
    return store.lifecycleNote;
  }

  const status = resolveFieldStoreStatus(store);

  if (status === 'offer-approved') return 'منتهٍ للميداني';
  if (status === 'submitted') return 'بانتظار مراجعة الشركاء';
  if (status === 'ready-for-onboarding') return 'الملف مكتمل وجاهز للإرسال';
  if (status === 'follow-up-required') return 'هناك نواقص عملية قبل الإرسال';
  if (status === 'offer-pending-approval') return 'العرض ما زال تحت المراجعة';
  return 'ملف انضمام قيد البناء';
}

export function resolveFieldStoreNextActionLabel(store: FieldStoreFile) {
  const status = resolveFieldStoreStatus(store);

  if (status === 'offer-approved') return 'عرض السجل والعمولة';
  if (status === 'submitted') return 'انتظار قرار المراجعة';
  if (status === 'ready-for-onboarding') return 'إرسال للمراجعة';
  if (status === 'follow-up-required') return 'إكمال النواقص';
  if (status === 'offer-pending-approval') return 'مراجعة العرض';
  return 'بدء ملف الانضمام';
}

export function isFieldStoreReadOnly(store: FieldStoreFile) {
  const status = resolveFieldStoreStatus(store);
  return status === 'submitted' || status === 'offer-approved';
}

export function matchesFieldStoreFilter(store: FieldStoreFile, filter: FieldLeadFilter) {
  const status = resolveFieldStoreStatus(store);

  if (filter === 'all') return true;
  if (filter === 'today') return store.nextVisitLabel.includes('اليوم');
  if (filter === 'ready') return status === 'ready-for-onboarding';
  if (filter === 'follow-up') return status === 'follow-up-required';
  if (filter === 'pending') return status === 'new-lead' || status === 'offer-pending-approval';
  if (filter === 'submitted') return status === 'submitted';
  if (filter === 'done') return status === 'offer-approved';
  return true;
}

export function resolveFieldFilterCounts(stores: readonly FieldStoreFile[]): Record<FieldLeadFilter, number> {
  return {
    all: stores.length,
    today: stores.filter((store) => matchesFieldStoreFilter(store, 'today')).length,
    ready: stores.filter((store) => matchesFieldStoreFilter(store, 'ready')).length,
    'follow-up': stores.filter((store) => matchesFieldStoreFilter(store, 'follow-up')).length,
    pending: stores.filter((store) => matchesFieldStoreFilter(store, 'pending')).length,
    submitted: stores.filter((store) => matchesFieldStoreFilter(store, 'submitted')).length,
    done: stores.filter((store) => matchesFieldStoreFilter(store, 'done')).length,
  };
}

function syncFieldStoreFromDraft(store: FieldStoreFile): FieldStoreFile {
  return {
    ...store,
    name: store.draft.basics.storeName.trim() || store.name,
    category: store.draft.classification.mainCategory.trim() || store.category,
    location: store.draft.location.zone.trim() || store.location,
  };
}

export function touchFieldStoreDraft(store: FieldStoreFile, note?: string): FieldStoreFile {
  return syncFieldStoreFromDraft({
    ...store,
    lastUpdatedLabel: 'الآن',
    lifecycleNote: note ?? store.lifecycleNote,
    draft: {
      ...store.draft,
      lastSavedLabel: formatNowLabel(),
    },
  });
}

export function submitFieldStoreForReview(store: FieldStoreFile): FieldStoreFile {
  return syncFieldStoreFromDraft({
    ...store,
    lastUpdatedLabel: 'الآن',
    lifecycleNote: 'أُرسل الملف إلى مراجعة الشركاء، والميداني ينتظر القرار.',
    draft: {
      ...store.draft,
      lastSavedLabel: formatNowLabel(),
      submittedAt: new Date().toISOString(),
    },
  });
}

function createBaseStore(overrides?: Partial<FieldStoreFile>): FieldStoreFile {
  return syncFieldStoreFromDraft({
    id: overrides?.id ?? `field-store-${Date.now()}`,
    source: overrides?.source ?? 'manual',
    name: overrides?.name ?? 'ملف انضمام جديد',
    category: overrides?.category ?? 'قيد التحديد',
    location: overrides?.location ?? 'الرياض',
    nextVisitLabel: overrides?.nextVisitLabel ?? 'اليوم',
    assignedFieldMember: overrides?.assignedFieldMember ?? 'المندوب الميداني',
    lastUpdatedLabel: overrides?.lastUpdatedLabel ?? 'الآن',
    lockedStatus: overrides?.lockedStatus,
    stageLabelOverride: overrides?.stageLabelOverride,
    statusNoteOverride: overrides?.statusNoteOverride,
    lifecycleNote: overrides?.lifecycleNote,
    financeLabel: overrides?.financeLabel ?? 'لا توجد بيانات مالية بعد',
    reviewFeedback: overrides?.reviewFeedback,
    draft: overrides?.draft ?? createEmptyDraft(),
    fulfillmentAgreements: overrides?.fulfillmentAgreements,
  });
}

export function createManualFieldStore(): FieldStoreFile {
  return createBaseStore({
    id: `manual-${Date.now()}`,
    draft: createEmptyDraft({
      lastSavedLabel: 'مسودة جديدة',
    }),
  });
}

export function createFieldSeedStores(): FieldStoreFile[] {
  return [];
}
