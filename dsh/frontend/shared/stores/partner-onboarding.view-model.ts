// dsh/frontend/shared/stores/onboarding/partner-onboarding.view-model.ts
// Authority: dsh/frontend/shared/stores — shared DSH stores/onboarding/review domain.
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
    const id = draft.documents.identityProofRef.trim();
    return cr || id ? 'تم إرفاق وثائق السجل التجاري والهوية للمراجعة' : 'لم ترفع أي مستندات';
  }
  if (sectionId === 'products') {
    const count = draft.products.items?.length ?? 0;
    return `عدد المنتجات المرفوعة: ${count}`;
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
