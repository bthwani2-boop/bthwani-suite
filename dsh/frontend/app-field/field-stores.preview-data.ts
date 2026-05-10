import {
  type DshCanonicalProductCard,
  type DshCanonicalPublishStage,
  type DshCanonicalStoreCard,
} from '../shared/dshStoreProductCardModel';

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

export type FieldOnboardingSectionId = 'basics' | 'classification' | 'location' | 'photos' | 'products' | 'offer' | 'review';

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
  'products',
  'offer',
  'review',
] as const;

export const fieldSectionLabels: Record<FieldOnboardingSectionId, string> = {
  basics: 'البيانات الأساسية',
  classification: 'النوع والتصنيف',
  location: 'الموقع والتغطية',
  photos: 'الصور',
  products: 'المنتجات الأولية',
  offer: 'العرض والاتفاق',
  review: 'المراجعة والإرسال',
};

function formatNowLabel() {
  try {
    const time = new Intl.DateTimeFormat('ar-SA', { hour: 'numeric', minute: '2-digit' }).format(new Date());
    return `اليوم ${time}`;
  } catch {
    return 'الآن';
  }
}

function resolveFieldCanonicalPublishStage(store: FieldStoreFile): DshCanonicalPublishStage {
  const status = resolveFieldStoreStatus(store);
  const lifecycleNote = store.lifecycleNote?.trim() ?? '';

  if (status === 'submitted') {
    return lifecycleNote.includes('مراجعة الشركاء') || store.draft.review.partnerReviewNote.trim().length > 0
      ? 'partner-review'
      : 'field-submitted';
  }

  if (status === 'offer-approved') {
    return lifecycleNote.includes('ظهر الشريك للعملاء') || lifecycleNote.includes('ظهر للعملاء')
      ? 'published-preview'
      : 'marketing-review';
  }

  return 'field-draft';
}

function formatFieldProductPriceLabel(price: string) {
  const trimmedPrice = price.trim();
  return trimmedPrice ? `${trimmedPrice} ر.س` : 'غير محدد';
}

function parseFieldProductPriceValue(price: string) {
  const normalizedPrice = Number(price.trim());
  return Number.isFinite(normalizedPrice) ? normalizedPrice : undefined;
}

function resolveFieldProductCategoryId(store: FieldStoreFile) {
  const mainCategory = store.draft.classification.mainCategory.trim();
  const subCategory = store.draft.classification.subCategory.trim();
  return `field:${mainCategory || 'general'}:${subCategory || 'general'}`;
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

  if (!draft.basics.storeName.trim()) missing.push('اسم المتجر');
  if (!draft.basics.ownerName.trim()) missing.push('اسم المالك');
  if (!draft.basics.ownerPhone.trim()) missing.push('جوال المالك');
  if (!draft.location.city.trim()) missing.push('المدينة');
  if (!draft.location.zone.trim()) missing.push('النطاق');
  if (!draft.location.latitude.trim() || !draft.location.longitude.trim() || !draft.location.landmark.trim()) missing.push('الإحداثية GPS');
  if (!draft.photos.storefrontPhotoRef.trim()) missing.push('صورة الواجهة');
  if (!draft.products.featuredProductName.trim()) missing.push('منتج افتتاحي واحد');
  if (!draft.offer.preliminaryOffer.trim()) missing.push('العرض أو الاتفاق المبدئي');
  if (!draft.offer.operatingHours.trim()) missing.push('ساعات العمل');

  return missing;
}

export function resolveFieldSectionSummaries(draft: FieldOnboardingDraft): FieldSectionSummary[] {
  const sectionMissing: Record<FieldOnboardingSectionId, number> = {
    basics: [draft.basics.storeName, draft.basics.ownerName, draft.basics.ownerPhone].filter((value) => !value.trim()).length,
    classification: [draft.classification.storeType, draft.classification.mainCategory].filter((value) => !value.trim()).length,
    location: [draft.location.city, draft.location.zone, draft.location.addressLine, draft.location.latitude, draft.location.longitude, draft.location.landmark].filter((value) => !value.trim()).length,
    photos: [draft.photos.storefrontPhotoRef, draft.photos.interiorPhotoRef].filter((value) => !value.trim()).length,
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

  if (status === 'offer-approved') {
    return 'منتهٍ للميداني';
  }

  if (status === 'submitted') {
    return 'بانتظار مراجعة الشركاء';
  }

  if (status === 'ready-for-onboarding') {
    return 'الملف مكتمل وجاهز للإرسال';
  }

  if (status === 'follow-up-required') {
    return 'هناك نواقص عملية قبل الإرسال';
  }

  if (status === 'offer-pending-approval') {
    return 'العرض ما زال تحت المراجعة';
  }

  return 'ملف انضمام قيد البناء';
}

export function resolveFieldStoreNextActionLabel(store: FieldStoreFile) {
  const status = resolveFieldStoreStatus(store);

  if (status === 'offer-approved') {
    return 'عرض السجل والعمولة';
  }

  if (status === 'submitted') {
    return 'انتظار قرار المراجعة';
  }

  if (status === 'ready-for-onboarding') {
    return 'إرسال للمراجعة';
  }

  if (status === 'follow-up-required') {
    return 'إكمال النواقص';
  }

  if (status === 'offer-pending-approval') {
    return 'مراجعة العرض';
  }

  return 'بدء ملف الانضمام';
}

export function isFieldStoreReadOnly(store: FieldStoreFile) {
  return resolveFieldStoreStatus(store) === 'submitted' || resolveFieldStoreStatus(store) === 'offer-approved';
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

export function syncFieldStoreFromDraft(store: FieldStoreFile): FieldStoreFile {
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

export function mapFieldStoreToCanonicalStoreCard(store: FieldStoreFile): DshCanonicalStoreCard {
  const storeName = store.draft.basics.storeName.trim() || store.name;
  const categoryLabel = store.draft.classification.mainCategory.trim() || store.category;
  const subcategoryLabel = store.draft.classification.subCategory.trim() || undefined;
  const branchLabel = `${store.draft.location.zone.trim() || store.location} • ${store.draft.location.city.trim() || 'الرياض'}`;
  const locationLabel = store.draft.location.addressLine.trim() || store.location;
  const operatingHoursLabel = store.draft.offer.operatingHours.trim() || 'غير محدد';
  const deliveryReadinessLabel = store.draft.offer.deliveryReadiness.trim() || 'غير محدد';
  const coverageSummary = store.draft.location.coverageSummary.trim() || store.location;
  const photoRef = store.draft.photos.storefrontPhotoRef.trim() || undefined;
  const featuredProductName = store.draft.products.featuredProductName.trim();
  const featuredProductPrice = store.draft.products.featuredProductPrice.trim();
  const reviewState = resolveFieldStoreStatus(store);
  const publishStage = resolveFieldCanonicalPublishStage(store);

  return {
    id: `canonical-store-field-${store.id}`,
    sourceRecordId: store.id,
    source: 'app-field',
    publishStage,
    storeName,
    branchLabel,
    cityLabel: store.draft.location.city.trim() || 'الرياض',
    categoryLabel,
    subcategoryLabel,
    addressLabel: locationLabel,
    zoneLabel: store.draft.location.zone.trim() || store.location,
    ownerName: store.draft.basics.ownerName.trim() || undefined,
    ownerPhone: store.draft.basics.ownerPhone.trim() || undefined,
    managerName: store.draft.basics.managerName.trim() || undefined,
    operatingHoursLabel,
    deliveryReadinessLabel,
    coverageSummary,
    latitude: store.draft.location.latitude.trim() || undefined,
    longitude: store.draft.location.longitude.trim() || undefined,
    landmark: store.draft.location.landmark.trim() || undefined,
    storefrontPhotoRef: photoRef,
    mediaKey: photoRef ? `${photoRef}.media` : undefined,
    imageUri: photoRef ? `${photoRef}.media` : undefined,
    statusLabel: resolveFieldStoreStatusLabel(store),
    statusTone: resolveFieldStoreStatusTone(store),
    rating: publishStage === 'published-preview' ? 4.9 : 4.6,
    distanceLabel: coverageSummary,
    etaLabel: operatingHoursLabel,
    deliveryLabel: deliveryReadinessLabel,
    serviceLabel: store.draft.offer.preliminaryOffer.trim() ? 'توصيل برو' : 'توصيل',
    deliveryFeeLabel: featuredProductPrice ? `السعر الافتتاحي ${featuredProductPrice} ر.س` : undefined,
    priceMatchLabel: featuredProductName ? `المنتج الافتتاحي ${featuredProductName}` : undefined,
    offerLabel: store.draft.offer.preliminaryOffer.trim() || undefined,
    followerCount: 4200,
    supportsPickup: true,
    supportsPartnerDelivery: true,
    hasBthwaniPro: true,
    hasNewProducts: Boolean(featuredProductName),
    hasCouponAvailable: Boolean(store.draft.offer.preliminaryOffer.trim()),
    canonicalProductId: featuredProductName ? `canonical-product-field-${store.id}-featured` : undefined,
  };
}

export function mapFieldStoreToCanonicalProductCard(store: FieldStoreFile): DshCanonicalProductCard | null {
  const featuredProductName = store.draft.products.featuredProductName.trim();

  if (!featuredProductName) {
    return null;
  }

  const priceLabel = formatFieldProductPriceLabel(store.draft.products.featuredProductPrice);
  const categoryLabel = store.draft.classification.subCategory.trim() || store.draft.classification.mainCategory.trim() || store.category;

  return {
    id: `canonical-product-field-${store.id}-featured`,
    sourceRecordId: store.id,
    storeId: `canonical-store-field-${store.id}`,
    source: 'app-field',
    publishStage: resolveFieldCanonicalPublishStage(store),
    name: featuredProductName,
    subtitle: store.draft.products.sampleCatalogNote.trim() || undefined,
    categoryId: resolveFieldProductCategoryId(store),
    categoryLabel,
    priceLabel,
    priceValue: parseFieldProductPriceValue(store.draft.products.featuredProductPrice),
    measurementType: 'piece',
    measurementOptions: ['حبة'],
    isAvailable: true,
    hasOptions: false,
    preparationTime: store.draft.offer.deliveryReadiness.trim() || undefined,
    canonicalStoreId: `canonical-store-field-${store.id}`,
    canonicalProductId: `canonical-product-field-${store.id}-featured`,
  };
}

function createSeedStore(overrides: Partial<FieldStoreFile>): FieldStoreFile {
  return syncFieldStoreFromDraft({
    id: overrides.id ?? `field-store-${Date.now()}`,
    source: overrides.source ?? 'candidate',
    name: overrides.name ?? 'فرصة ميدانية',
    category: overrides.category ?? 'قيد التحديد',
    location: overrides.location ?? 'الرياض',
    nextVisitLabel: overrides.nextVisitLabel ?? 'اليوم',
    assignedFieldMember: overrides.assignedFieldMember ?? 'ناصر القحطاني',
    lastUpdatedLabel: overrides.lastUpdatedLabel ?? 'اليوم',
    lockedStatus: overrides.lockedStatus,
    stageLabelOverride: overrides.stageLabelOverride,
    statusNoteOverride: overrides.statusNoteOverride,
    lifecycleNote: overrides.lifecycleNote,
    financeLabel: overrides.financeLabel ?? '0 ر.س',
    reviewFeedback: overrides.reviewFeedback,
    draft: overrides.draft ?? createEmptyDraft(),
  });
}

export function createManualFieldStore(): FieldStoreFile {
  return createSeedStore({
    id: `manual-${Date.now()}`,
    source: 'manual',
    name: 'ملف انضمام جديد',
    category: 'قيد التحديد',
    location: 'الرياض',
    nextVisitLabel: 'اليوم',
    lastUpdatedLabel: 'الآن',
    draft: createEmptyDraft({
      lastSavedLabel: 'مسودة جديدة',
    }),
  });
}

export function createFieldSeedStores(): FieldStoreFile[] {
  return [
    createSeedStore({
      id: 'lead-1',
      name: 'محمصة الساحة',
      category: 'مقاهٍ ومحمصات',
      location: 'حي الياسمين',
      nextVisitLabel: 'اليوم 5:30 م',
      financeLabel: 'بانتظار الإرسال',
      draft: createEmptyDraft({
        activeSectionId: 'offer',
        basics: {
          storeName: 'محمصة الساحة',
          ownerName: 'سعود الدوسري',
          ownerPhone: '0500000001',
          managerName: 'عبدالله',
        },
        classification: {
          storeType: 'مقهى',
          mainCategory: 'مقاهٍ ومحمصات',
          subCategory: 'قهوة مختصة',
        },
        location: {
          city: 'الرياض',
          zone: 'حي الياسمين',
          addressLine: 'طريق أنس بن مالك',
          coverageSummary: 'شمال الرياض',
          latitude: '24.8123',
          longitude: '46.6521',
          landmark: 'بجوار الصيدلية',
        },
        photos: {
          storefrontPhotoRef: 'واجهة رئيسية',
          interiorPhotoRef: '',
          signagePhotoRef: '',
        },
        products: {
          featuredProductName: '',
          featuredProductPrice: '',
          sampleCatalogNote: 'عينة الكتالوج ما زالت ناقصة.',
        },
        offer: {
          preliminaryOffer: 'خصم أول 3 أشهر + عمولة معيارية',
          operatingHours: '',
          deliveryReadiness: 'جاهز مبدئيًا',
          financeNote: 'بانتظار اعتماد نهائي.',
        },
        review: {
          fieldNotes: 'تمت مراجعة العرض المبدئي مع المالك.',
          partnerReviewNote: '',
        },
        lastSavedLabel: 'اليوم 4:55 م',
      }),
    }),
    createSeedStore({
      id: 'lead-2',
      name: 'بوفيه الشروق',
      category: 'بوفيهات',
      location: 'الملقا',
      nextVisitLabel: 'غدًا 1:00 م',
      financeLabel: 'راجع الملاحظات',
      reviewFeedback: 'معاد للتعديل: تحديث صورة الواجهة وتأكيد ساعات العمل.',
      lifecycleNote: 'عاد الملف للمراجعة الميدانية قبل إعادة الإرسال.',
      draft: createEmptyDraft({
        activeSectionId: 'photos',
        basics: {
          storeName: 'بوفيه الشروق',
          ownerName: 'فهد الشمري',
          ownerPhone: '0500000002',
          managerName: 'بدر',
        },
        classification: {
          storeType: 'مطعم خفيف',
          mainCategory: 'بوفيهات',
          subCategory: 'شاورما وسناك',
        },
        location: {
          city: 'الرياض',
          zone: 'الملقا',
          addressLine: 'شارع الأمير تركي',
          coverageSummary: 'شمال غرب الرياض',
          latitude: '24.7854',
          longitude: '46.6210',
          landmark: 'مقابل البنك',
        },
        photos: {
          storefrontPhotoRef: '',
          interiorPhotoRef: 'صورة داخلية أولية',
          signagePhotoRef: '',
        },
        products: {
          featuredProductName: 'وجبة شاورما',
          featuredProductPrice: '24',
          sampleCatalogNote: '',
        },
        offer: {
          preliminaryOffer: 'عرض مبدئي تحت المراجعة',
          operatingHours: '',
          deliveryReadiness: 'تحتاج متابعة',
          financeNote: '',
        },
        review: {
          fieldNotes: 'تحتاج مراجعة نهائية قبل إعادة الإرسال.',
          partnerReviewNote: 'معاد للتعديل',
        },
        lastSavedLabel: 'اليوم 1:20 م',
      }),
    }),
    createSeedStore({
      id: 'lead-3',
      name: 'مخبز الزاوية',
      category: 'مخابز',
      location: 'النرجس',
      nextVisitLabel: 'غدًا 10:30 ص',
      financeLabel: 'جاهز للإرسال',
      draft: createEmptyDraft({
        activeSectionId: 'review',
        basics: {
          storeName: 'مخبز الزاوية',
          ownerName: 'تركي العتيبي',
          ownerPhone: '0500000003',
          managerName: 'سلمان',
        },
        classification: {
          storeType: 'مخبز',
          mainCategory: 'مخابز',
          subCategory: 'مخبوزات يومية',
        },
        location: {
          city: 'الرياض',
          zone: 'النرجس',
          addressLine: 'طريق عثمان بن عفان',
          coverageSummary: 'شمال الرياض',
          latitude: '24.8244',
          longitude: '46.6821',
          landmark: 'أمام محطة الوقود',
        },
        photos: {
          storefrontPhotoRef: 'واجهة واضحة',
          interiorPhotoRef: 'الفرن ومنطقة الخدمة',
          signagePhotoRef: 'لوحة خارجية',
        },
        products: {
          featuredProductName: 'خبز بطاطس',
          featuredProductPrice: '8',
          sampleCatalogNote: 'المنتج الأول موثق بالكامل.',
        },
        offer: {
          preliminaryOffer: 'بداية بعمولة خفيفة',
          operatingHours: '6 ص - 11 م',
          deliveryReadiness: 'جاهز للتوصيل الخفيف',
          financeNote: 'مستحقات افتتاحية خفيفة.',
        },
        review: {
          fieldNotes: 'كل العناصر الأساسية مكتملة والملف جاهز للإرسال.',
          partnerReviewNote: '',
        },
        lastSavedLabel: 'اليوم 11:10 ص',
      }),
    }),
    createSeedStore({
      id: 'lead-4',
      name: 'مقهى الوادي',
      category: 'مقاهٍ',
      location: 'الصحافة',
      nextVisitLabel: 'اليوم 11:20 ص',
      financeLabel: 'قيد المراجعة',
      lifecycleNote: 'تم الإرسال للمراجعة وينتظر القرار، ولا يوجد إجراء ميداني جديد الآن.',
      draft: createEmptyDraft({
        activeSectionId: 'review',
        basics: {
          storeName: 'مقهى الوادي',
          ownerName: 'أحمد الحربي',
          ownerPhone: '0500000004',
          managerName: 'محمد',
        },
        classification: {
          storeType: 'مقهى',
          mainCategory: 'مقاهٍ',
          subCategory: 'قهوة وكيك',
        },
        location: {
          city: 'الرياض',
          zone: 'الصحافة',
          addressLine: 'طريق الأمير ناصر',
          coverageSummary: 'شمال الرياض',
          latitude: '24.8011',
          longitude: '46.6432',
          landmark: 'بجانب السوبرماركت',
        },
        photos: {
          storefrontPhotoRef: 'واجهة رئيسية',
          interiorPhotoRef: 'صالة الجلوس',
          signagePhotoRef: 'اللوحة الأمامية',
        },
        products: {
          featuredProductName: 'لاتيه',
          featuredProductPrice: '18',
          sampleCatalogNote: 'العينة الأولية جاهزة.',
        },
        offer: {
          preliminaryOffer: 'الملف المرسل ينتظر مراجعة الشركاء',
          operatingHours: '7 ص - 12 ص',
          deliveryReadiness: 'جاهز للتوصيل',
          financeNote: 'بانتظار التثبيت النهائي.',
        },
        review: {
          fieldNotes: 'أرسل الملف للمراجعة بعد استكمال كافة المتطلبات.',
          partnerReviewNote: 'بانتظار قرار الشركاء',
        },
        lastSavedLabel: 'اليوم 11:20 ص',
        submittedAt: new Date().toISOString(),
      }),
    }),
    createSeedStore({
      id: 'lead-5',
      name: 'تمور النخبة',
      category: 'مواد غذائية',
      location: 'اليرموك',
      nextVisitLabel: 'مكتمل',
      financeLabel: '420 ر.س',
      lockedStatus: 'offer-approved',
      stageLabelOverride: 'منتهٍ للميداني',
      lifecycleNote: 'اعتمد الملف داخل الشركاء وينتظر المراجعة التسويقية النهائية قبل الظهور للعملاء.',
      draft: createEmptyDraft({
        activeSectionId: 'review',
        basics: {
          storeName: 'تمور النخبة',
          ownerName: 'خالد المطيري',
          ownerPhone: '0500000005',
          managerName: 'عبدالعزيز',
        },
        classification: {
          storeType: 'متجر مواد غذائية',
          mainCategory: 'مواد غذائية',
          subCategory: 'تمور وهدايا',
        },
        location: {
          city: 'الرياض',
          zone: 'اليرموك',
          addressLine: 'شارع النجاح',
          coverageSummary: 'شرق الرياض',
          latitude: '24.7881',
          longitude: '46.7441',
          landmark: 'مقابل الحديقة',
        },
        photos: {
          storefrontPhotoRef: 'الواجهة مكتملة',
          interiorPhotoRef: 'الرفوف الداخلية',
          signagePhotoRef: 'صورة اللوحة',
        },
        products: {
          featuredProductName: 'علبة تمر فاخر',
          featuredProductPrice: '55',
          sampleCatalogNote: 'المنتج الافتتاحي موثق.',
        },
        offer: {
          preliminaryOffer: 'اعتماد كامل بعد الظهور للعملاء',
          operatingHours: '9 ص - 11 م',
          deliveryReadiness: 'جاهز',
          financeNote: 'تم تثبيت المستحق النهائي.',
        },
        review: {
          fieldNotes: 'أغلق الدور الميداني بعد اكتمال الاعتماد.',
          partnerReviewNote: 'اعتماد نهائي',
        },
        lastSavedLabel: 'أمس',
        submittedAt: new Date().toISOString(),
      }),
    }),
  ];
}
