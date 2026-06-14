// Canonical location: dsh/frontend/shared/contracts/marketing/banner-types.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/banner-types.ts

import type { MarketingBannerRecord } from '../dsh-marketing-types';

export type BannerDraft = Record<
  | 'title'
  | 'subtitle'
  | 'imageUrl'
  | 'ctaLabel'
  | 'highlight'
  | 'targetId'
  | 'targetExtra'
  | 'order',
  string
> & {
  id?: string;
  status: MarketingBannerStatus;
  audience: MarketingBannerAudience;
  targetType: SmartBannerTargetType;
  motion: MarketingBannerMotionStyle;
  imageFit: BannerImageFit;
  logoPosition: BannerLogoPosition;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
  subscriptionId?: string;
};

export type MarketingBannerStatus = 'published' | 'draft' | 'review' | 'paused';
export type MarketingBannerAudience = 'all' | 'client' | 'operations';
export type SmartBannerTargetType =
  | 'home' | 'stores' | 'store' | 'category' | 'subcategory'
  | 'product' | 'offer' | 'subscription' | 'campaign' | 'tracking'
  | 'orders' | 'loyalty' | 'custom';
export type SmartTargetSummary = {
  type: SmartBannerTargetType;
  id?: string;
  label: string;
};
export type MarketingBannerMotionStyle = 'slide' | 'soft-parallax' | 'subtle-fade' | 'snap-focus';
export type BannerImageFit = 'cover' | 'contain';
export type BannerLogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type EditorTab = 'content' | 'media' | 'target' | 'publish';

export const SMART_TARGET_OPTIONS: ReadonlyArray<{ value: SmartBannerTargetType; label: string; description: string }> = [
  { value: 'home', label: 'الرئيسية', description: 'يُوجه المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح لائحة المتاجر من صفحة التصفح الرئيسية.' },
  { value: 'store', label: 'متجر', description: 'يُوجه المستخدم لمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يُوجه المستخدم لفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يُوجه المستخدم لمنتج داخل متجر محدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض مستواها قيد عرض غير ملزم.' },
  { value: 'subscription', label: 'اشتراكات', description: 'يفتح مساق الاشتراكات للمستاخر.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح واجهة حملة رابحة ذمن اللوحة الحالية.' },
  { value: 'tracking', label: 'التتبع', description: 'يُوجه المستخدم لمساق تتبع الطلب.' },
  { value: 'orders', label: 'الطلبات', description: 'يُوجه المستخدم للائحة الطلبات.' },
  { value: 'loyalty', label: 'الولاء', description: 'يفتح سياق الولاء من الاستحقاقات.' },
  { value: 'custom', label: 'مخصص', description: 'مساق محدد ومأخوذ رابطها لا يعكس الخيارات الملزمة.' },
];

export const SUBSCRIPTION_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [];

export const BANNER_MOTION_OPTIONS: ReadonlyArray<{ value: MarketingBannerMotionStyle; label: string; description: string }> = [
  { value: 'slide', label: 'انسيابي', description: 'انتقال خفيف مع تتابع البطاقات.' },
  { value: 'soft-parallax', label: 'تأثير باراللاكس', description: 'حركة تأثير لطيف للصفحة ذات طابع التصميم.' },
  { value: 'subtle-fade', label: 'إخفائي لطيف', description: 'يستبدل البطاقات العمودية بتأثير هادئ.' },
  { value: 'snap-focus', label: 'أحكام لقطة', description: 'تركيز وأحكام تسجيل سريع على الصفحة العمودية.' },
];

export const IMAGE_FIT_TAB_ITEMS: ReadonlyArray<{ value: BannerImageFit; label: string }> = [
  { value: 'cover', label: 'تغطي' },
  { value: 'contain', label: 'تناسب' },
];

export const LOGO_POSITION_TAB_ITEMS: ReadonlyArray<{ value: BannerLogoPosition; label: string }> = [
  { value: 'top-left', label: 'أعلى يسار' },
  { value: 'top-right', label: 'أعلى يمين' },
  { value: 'bottom-left', label: 'أسفل يسار' },
  { value: 'bottom-right', label: 'أسفل يمين' },
];
