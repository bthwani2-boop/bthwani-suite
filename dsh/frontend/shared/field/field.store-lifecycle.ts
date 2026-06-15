// Field store lifecycle helpers — draft management, status resolution, filter logic.
// No JSX. No ui-kit. No Tamagui.
// Draft IDs are UI-only handles; backend assigns the real id on sync.

import type {
  FieldStoreFile,
  FieldOnboardingDraft,
  FieldLeadStatus,
  FieldLeadFilter,
  FieldOnboardingSectionId,
  FieldSectionSummary,
  FieldDocumentRuntimeStatus,
} from './field.types';
import {
  fieldStatusLabels,
  fieldStatusTones,
  fieldSectionOrder,
  fieldSectionLabels,
} from './field.types';

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

export function createEmptyDraft(overrides?: Partial<FieldOnboardingDraft>): FieldOnboardingDraft {
  return {
    activeSectionId: 'basics',
    basics: { storeName: '', ownerName: '', ownerPhone: '', managerName: '' },
    classification: { storeType: '', mainCategory: '', subCategory: '' },
    location: { city: '', zone: '', addressLine: '', coverageSummary: '', latitude: '', longitude: '', landmark: '' },
    photos: { storefrontPhotoRef: '', interiorPhotoRef: '', signagePhotoRef: '' },
    documents: {
      commercialRegistrationRef: '',
      ownerIdRef: '',
      tradeLicenseRef: '',
      commercialRegistrationStatus: 'missing',
      ownerIdStatus: 'missing',
      tradeLicenseStatus: 'missing',
    },
    products: { featuredProductName: '', featuredProductPrice: '', sampleCatalogNote: '' },
    offer: { preliminaryOffer: '', operatingHours: '', deliveryReadiness: '', financeNote: '' },
    review: { fieldNotes: '', partnerReviewNote: '' },
    lastSavedLabel: 'لم تحفظ بعد',
    ...overrides,
  };
}

export function getFieldRequiredMissingItems(draft: FieldOnboardingDraft): string[] {
  const missing: string[] = [];
  const documentIsResolved = (ref: string, status: FieldDocumentRuntimeStatus) =>
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
    if (item.required) return !item.ref.trim() || (item.status !== 'uploaded' && item.status !== 'approved');
    return item.ref.trim().length > 0 && (item.status === 'needs_reupload' || item.status === 'rejected');
  }).length;

  const sectionMissing: Record<FieldOnboardingSectionId, number> = {
    basics: [draft.basics.storeName, draft.basics.ownerName, draft.basics.ownerPhone].filter((v) => !v.trim()).length,
    classification: [draft.classification.storeType, draft.classification.mainCategory].filter((v) => !v.trim()).length,
    location: [draft.location.city, draft.location.zone, draft.location.addressLine, draft.location.latitude, draft.location.longitude, draft.location.landmark].filter((v) => !v.trim()).length,
    photos: [draft.photos.storefrontPhotoRef, draft.photos.interiorPhotoRef].filter((v) => !v.trim()).length,
    documents: documentsMissing,
    products: [draft.products.featuredProductName, draft.products.featuredProductPrice].filter((v) => !v.trim()).length,
    offer: [draft.offer.preliminaryOffer, draft.offer.operatingHours].filter((v) => !v.trim()).length,
    review: getFieldRequiredMissingItems(draft).length,
  };

  return fieldSectionOrder.map((id) => ({
    id,
    label: fieldSectionLabels[id],
    complete: sectionMissing[id] === 0,
    missingCount: sectionMissing[id],
  }));
}

export function resolveFieldCompletionPercent(draft: FieldOnboardingDraft): number {
  const sections = resolveFieldSectionSummaries(draft);
  return Math.round((sections.filter((s) => s.complete).length / sections.length) * 100);
}

export function resolveFieldStoreStatus(store: FieldStoreFile): FieldLeadStatus {
  if (store.lockedStatus) return store.lockedStatus;
  if (store.draft.submittedAt) return 'submitted';

  const missing = getFieldRequiredMissingItems(store.draft);
  const hasAnyData = [
    store.draft.basics.storeName,
    store.draft.basics.ownerName,
    store.draft.classification.storeType,
    store.draft.location.addressLine,
    store.draft.offer.preliminaryOffer,
    store.draft.review.fieldNotes,
  ].some((v) => v.trim().length > 0);

  if (missing.length === 0) return 'ready-for-onboarding';
  if (store.reviewFeedback) return 'follow-up-required';
  if (store.draft.offer.preliminaryOffer.trim() && store.draft.basics.storeName.trim() && store.draft.location.city.trim()) {
    return 'offer-pending-approval';
  }
  if (hasAnyData) return 'follow-up-required';
  return 'new-lead';
}

export function resolveFieldStoreStatusLabel(store: FieldStoreFile): string {
  return store.statusNoteOverride ?? fieldStatusLabels[resolveFieldStoreStatus(store)];
}

export function resolveFieldStoreStatusTone(store: FieldStoreFile) {
  return fieldStatusTones[resolveFieldStoreStatus(store)];
}

export function resolveFieldStoreLifecycleLabel(store: FieldStoreFile): string {
  if (store.lifecycleNote) return store.lifecycleNote;
  const status = resolveFieldStoreStatus(store);
  if (status === 'offer-approved') return 'منتهٍ للميداني';
  if (status === 'submitted') return 'بانتظار مراجعة الشركاء';
  if (status === 'ready-for-onboarding') return 'الملف مكتمل وجاهز للإرسال';
  if (status === 'follow-up-required') return 'هناك نواقص عملية قبل الإرسال';
  if (status === 'offer-pending-approval') return 'العرض ما زال تحت المراجعة';
  return 'ملف انضمام قيد البناء';
}

export function resolveFieldStoreNextActionLabel(store: FieldStoreFile): string {
  const status = resolveFieldStoreStatus(store);
  if (status === 'offer-approved') return 'عرض السجل والعمولة';
  if (status === 'submitted') return 'انتظار قرار المراجعة';
  if (status === 'ready-for-onboarding') return 'إرسال للمراجعة';
  if (status === 'follow-up-required') return 'إكمال النواقص';
  if (status === 'offer-pending-approval') return 'مراجعة العرض';
  return 'بدء ملف الانضمام';
}

export function isFieldStoreReadOnly(store: FieldStoreFile): boolean {
  const status = resolveFieldStoreStatus(store);
  return status === 'submitted' || status === 'offer-approved';
}

export function matchesFieldStoreFilter(store: FieldStoreFile, filter: FieldLeadFilter): boolean {
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
    today: stores.filter((s) => matchesFieldStoreFilter(s, 'today')).length,
    ready: stores.filter((s) => matchesFieldStoreFilter(s, 'ready')).length,
    'follow-up': stores.filter((s) => matchesFieldStoreFilter(s, 'follow-up')).length,
    pending: stores.filter((s) => matchesFieldStoreFilter(s, 'pending')).length,
    submitted: stores.filter((s) => matchesFieldStoreFilter(s, 'submitted')).length,
    done: stores.filter((s) => matchesFieldStoreFilter(s, 'done')).length,
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
    draft: { ...store.draft, lastSavedLabel: formatNowLabel() },
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
    id: overrides?.id ?? generateDraftId('field-store'),
    source: overrides?.source ?? 'backend',
    draftLocalId: overrides?.draftLocalId,
    syncStatus: overrides?.syncStatus ?? 'backend',
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
  const draftLocalId = generateDraftId('field-store-local-ui-draft');
  return createBaseStore({
    id: draftLocalId,
    source: 'local-ui-draft',
    draftLocalId,
    syncStatus: 'local-ui-draft',
    draft: createEmptyDraft({ lastSavedLabel: 'مسودة جديدة' }),
  });
}

export function createFieldSeedStores(): FieldStoreFile[] {
  return [];
}
