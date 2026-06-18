// dsh/frontend/shared/stores/onboarding/partner-onboarding.validation.ts
// Authority: dsh/frontend/shared/stores — shared DSH stores/onboarding/review domain.
// No JSX. No ui-kit. No Tamagui.

import type { PartnerOnboardingDraft } from './partner-onboarding.types';

export function normalizeDigits(str: string): string {
  return str
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776));
}

export function validatePartnerOnboarding(draft: PartnerOnboardingDraft): Record<string, string | undefined> {
  const errs: Record<string, string | undefined> = {};

  // Basics
  if (!draft.basics.storeName.trim()) {
    errs.storeName = 'اسم المتجر مطلوب لتحديد الهوية الميدانية';
  }
  if (!draft.basics.ownerName.trim()) {
    errs.ownerName = 'اسم المالك مطلوب للمطابقة القانونية';
  }
  if (!draft.basics.ownerPhone.trim()) {
    errs.ownerPhone = 'رقم جوال المالك مطلوب للتواصل المباشر';
  } else {
    const phone = normalizeDigits(draft.basics.ownerPhone.trim());
    const isValidYemen = /^(77|73|71|70|78)[0-9]{7}$/.test(phone);
    const isValidSaudi = /^(05|5)[0-9]{8}$/.test(phone);
    if (!isValidYemen && !isValidSaudi) {
      errs.ownerPhone = 'صيغة الجوال غير صحيحة (٩ أرقام تبدأ بـ 7 لليمن أو 05/5 للسعودية)';
    }
  }

  // Location
  if (!draft.location.city.trim()) {
    errs.city = 'المدينة مطلوبة لتوزيع التغطية';
  }

  // Offer
  if (!draft.offer.preliminaryOffer.trim()) {
    errs.preliminaryOffer = 'الاتفاق أو العمولة المبدئية مطلوبة للتفعيل';
  } else {
    const rawOffer = normalizeDigits(draft.offer.preliminaryOffer.trim());
    const numericOffer = parseFloat(rawOffer.replace(/%/g, ''));
    if (isNaN(numericOffer) || numericOffer <= 0 || numericOffer > 100) {
      errs.preliminaryOffer = 'نسبة العمولة المبدئية يجب أن تكون قيمة صالحة بين 1% و 100%';
    }
  }

  if (!draft.offer.operatingHours.trim()) {
    errs.operatingHours = 'ساعات العمل مطلوبة لجدولة التوصيل الميداني';
  } else {
    const rawHours = normalizeDigits(draft.offer.operatingHours.trim());
    const numericHours = parseInt(rawHours, 10);
    if (!isNaN(numericHours) && String(numericHours) === rawHours && (numericHours <= 0 || numericHours > 24)) {
      errs.operatingHours = 'ساعات العمل اليومية يجب أن تكون قيمة صالحة بين 1 و 24 ساعة';
    }
  }

  return errs;
}

export function validateOnboardingProduct(name: string, price: string): string | undefined {
  if (!name.trim()) {
    return 'اسم المنتج مطلوب';
  }
  const cleanPrice = normalizeDigits(price.trim());
  if (!cleanPrice) {
    return 'سعر المنتج مطلوب';
  }
  const numericPrice = parseFloat(cleanPrice);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return 'سعر المنتج يجب أن يكون قيمة موجبة';
  }
  return undefined;
}
