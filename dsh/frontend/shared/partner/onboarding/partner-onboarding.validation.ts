// dsh/frontend/shared/partner/onboarding/partner-onboarding.validation.ts
// Authority: shared/partner/onboarding — validation rules for onboarding screens.
// No JSX. No ui-kit. No Tamagui.

import type { PartnerOnboardingDraft } from './partner-onboarding.types';

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
    const phone = draft.basics.ownerPhone.trim();
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


  // Products
  if (!draft.products.featuredProductName.trim()) {
    errs.featuredProductName = 'اسم المنتج الافتتاحي مطلوب لإطلاق الكتالوج';
  }
  if (!draft.products.featuredProductPrice.trim()) {
    errs.featuredProductPrice = 'سعر المنتج مطلوب';
  } else if (isNaN(Number(draft.products.featuredProductPrice)) || Number(draft.products.featuredProductPrice) <= 0) {
    errs.featuredProductPrice = 'سعر المنتج يجب أن يكون قيمة موجبة';
  }

  // Offer
  if (!draft.offer.preliminaryOffer.trim()) {
    errs.preliminaryOffer = 'الاتفاق أو العمولة المبدئية مطلوبة للتفعيل';
  }
  if (!draft.offer.operatingHours.trim()) {
    errs.operatingHours = 'ساعات العمل مطلوبة لجدولة التوصيل الميداني';
  }

  return errs;
}
