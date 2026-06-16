// dsh/frontend/shared/partner/onboarding/partner-onboarding.view-model.ts
// Authority: shared/partner/onboarding — mapping options, summaries, and simulation helpers.
// No JSX. No ui-kit. No Tamagui.

import type { PartnerOnboardingDraft, PartnerOnboardingSectionId } from './partner-onboarding.types';
import type { OnboardingStoreFile } from './partner-onboarding-draft.model';

export const PARTNER_STORE_TYPE_OPTIONS = [
  { value: 'بقالة ومواد غذائية', label: 'بقالة ومواد غذائية' },
  { value: 'مطعم', label: 'مطعم / وجبات' },
  { value: 'مخبز وحلويات', label: 'مخبز وحلويات' },
  { value: 'صيدلية', label: 'صيدلية ومستحضرات تجميل' },
] as const;

export const PARTNER_MAIN_CATEGORY_OPTIONS = [
  { value: 'مطاعم', label: 'مأكولات ووجبات' },
  { value: 'بقالة ومواد غذائية', label: 'طازج وفواكه ومواد استهلاكية' },
  { value: 'مخابز', label: 'مخبوزات ومعجنات' },
  { value: 'حلويات ومشروبات', label: 'حلويات ومشروبات' },
] as const;

export const PARTNER_SUB_CATEGORY_OPTIONS = [
  { value: 'وجبات سريعة', label: 'وجبات سريعة' },
  { value: 'شعبي ويمني', label: 'شعبي ويمني' },
  { value: 'سوبرماركت', label: 'سوبرماركت / هايبر' },
  { value: 'معجنات وفطائر', label: 'معجنات وفطائر' },
] as const;

export function getOptionsWithFallback(defaultOpts: readonly { value: string; label: string }[], currentValue: string) {
  if (!currentValue) return defaultOpts;
  const exists = defaultOpts.some((opt) => opt.value === currentValue);
  if (exists) return defaultOpts;
  return [...defaultOpts, { value: currentValue, label: currentValue }];
}

export function resolvePartnerSectionSummaryLabel(draft: PartnerOnboardingDraft, sectionId: PartnerOnboardingSectionId): string {
  if (sectionId === 'basics') {
    const storeName = draft.basics.storeName.trim();
    const ownerName = draft.basics.ownerName.trim();
    return `المتجر: ${storeName || 'غير محدد'} · المالك: ${ownerName || 'غير محدد'}`;
  }
  if (sectionId === 'classification') {
    const main = draft.classification.mainCategory.trim();
    const sub = draft.classification.subCategory.trim();
    return `التصنيف: ${main || 'غير محدد'} · ${sub || 'غير محدد'}`;
  }
  if (sectionId === 'location') {
    const city = draft.location.city.trim();
    const zone = draft.location.zone.trim();
    const lat = draft.location.latitude.trim();
    const lng = draft.location.longitude.trim();
    return `الموقع: ${city || 'غير محدد'}، ${zone || 'غير محدد'} (${lat || '0'}, ${lng || '0'})`;
  }
  if (sectionId === 'photos') {
    const storefront = draft.photos.storefrontPhotoRef.trim();
    const interior = draft.photos.interiorPhotoRef.trim();
    return storefront || interior ? 'تم إرفاق صور الواجهة والتجهيزات الداخلية' : 'لم يتم رفع صور بعد';
  }
  if (sectionId === 'documents') {
    const cr = draft.documents.commercialRegistrationRef.trim();
    const id = draft.documents.ownerIdRef.trim();
    return cr || id ? 'تم إرفاق وثائق السجل التجاري والهوية للمراجعة' : 'لم ترفع أي مستندات';
  }
  if (sectionId === 'products') {
    const name = draft.products.featuredProductName.trim();
    const price = draft.products.featuredProductPrice.trim();
    return `المنتج: ${name || 'غير محدد'} · السعر: ${price || '0'} ر.ي`;
  }
  if (sectionId === 'offer') {
    const offer = draft.offer.preliminaryOffer.trim();
    const hours = draft.offer.operatingHours.trim();
    return `العمولة: ${offer || 'غير محدد'} · ساعات العمل: ${hours || 'غير محدد'}`;
  }
  if (sectionId === 'review') {
    const notes = draft.review.fieldNotes.trim();
    return `ملاحظات الزيارة: ${notes || 'لا توجد ملاحظات إضافية'}`;
  }
  return '';
}

// ── Simulation Helpers (mock-free pure transitions) ──────────────────────────

export type OnboardingLocationAutofill = {
  city: string;
  zone: string;
  latitude: string;
  longitude: string;
  landmark: string;
  addressLine: string;
  coverageSummary: string;
};

export function simulateGPSAutofill(): OnboardingLocationAutofill {
  return {
    city: 'الرياض',
    zone: 'حي العليا',
    latitude: '24.71358',
    longitude: '46.67529',
    landmark: 'برج المملكة - البوابة الشرقية',
    addressLine: 'طريق الملك فهد، حي العليا',
    coverageSummary: 'نطاق التغطية يغطي كامل مربع العليا وحطين',
  };
}

export function simulateOwnerNameOCR(): string {
  return 'عبدالرحمن بن ثنيان';
}

export function simulateCameraCapture(photoKey: string): string {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `img_${photoKey.replace('PhotoRef', '')}_upload_${randomSuffix}.jpg`;
}

// ── Stores view-model helpers ────────────────────────────────────────────────

import { matchesFieldStoreFilter } from '../../field/field.store-lifecycle';

export function resolveFilteredOnboardingStores(
  stores: readonly OnboardingStoreFile[],
  activeFilter: string,
  searchQuery: string,
): OnboardingStoreFile[] {
  const query = searchQuery.trim().toLowerCase();

  return stores.filter((store) => {
    if (!matchesFieldStoreFilter(store as any, activeFilter as any)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = `${store.name} ${store.category} ${store.location}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function resolvePriorityOnboardingStore(
  filteredStores: readonly OnboardingStoreFile[],
  stores: readonly OnboardingStoreFile[],
): OnboardingStoreFile | null {
  return filteredStores.find((store) => matchesFieldStoreFilter(store as any, 'ready'))
    ?? filteredStores[0]
    ?? stores.find((store) => matchesFieldStoreFilter(store as any, 'today'))
    ?? stores[0]
    ?? null;
}
