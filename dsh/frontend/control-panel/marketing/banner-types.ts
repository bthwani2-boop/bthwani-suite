// Authority: control-panel/marketing — banner domain types and constants.
// Extracted from BannersCommandDeckScreen as part of Giant Screen split.

import type {
  MarketingBannerAudience,
  MarketingBannerStatus,
  MarketingBannerActionType,
  MarketingBannerMotionStyle,
} from '../../data/legacy-preview/marketing.preview-data';

export type BannerDraft = Record<
  | 'title'
  | 'subtitle'
  | 'mediaKey'
  | 'accentColor'
  | 'actionTarget'
  | 'actionExtra'
  | 'ctaLabel'
  | 'partnerName'
  | 'imageUrl'
  | 'position'
  | 'templateId'
  | 'offerBadgeText'
  | 'offerBadgeColor'
  | 'partnerLogoUrl'
  | 'overlayImageUrl',
  string
> & {
  id?: string;
  audience: MarketingBannerAudience;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  offerBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  partnerLogoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayPosition: 'center' | 'bottom' | 'top' | 'fill';
  titlePlacement: 'top' | 'center' | 'bottom';
  imageFit: 'cover' | 'contain';
  targetType: SmartBannerTargetType;
  motionStyle: MarketingBannerMotionStyle;
  autoplayEnabled: boolean;
  autoplayIntervalMs: string;
  pauseOnInteraction: boolean;
};

export type SmartBannerTargetType =
  | 'home'
  | 'stores'
  | 'store'
  | 'category'
  | 'subcategory'
  | 'product'
  | 'offer'
  | 'subscription'
  | 'campaign'
  | 'tracking'
  | 'orders'
  | 'loyalty'
  | 'custom';

export type SmartTargetSummary = {
  label: string;
  finalRoute: string;
  targetLabel: string;
  targetId: string;
};

export type SmartTargetStoreFilter = 'all' | 'offers' | 'favorites' | 'available';
export type EditorWorkspaceTab = 'content' | 'media' | 'target';
export type BannerImageFit = BannerDraft['imageFit'];
export type BannerLogoPosition = BannerDraft['partnerLogoPosition'];

export type BannerTemplate = {
  readonly id: string;
  readonly label: string;
  readonly accent: string;
  readonly badge: string;
  readonly cta: string;
  readonly icon: string;
};

export const BANNER_TEMPLATES: readonly BannerTemplate[] = [
  { id: 'restaurant', label: 'مطعم', accent: 'danger', badge: 'خصم 20%', cta: 'اطلب الآن', icon: '🍽' },
  { id: 'fashion', label: 'متجر أزياء', accent: 'info', badge: 'وصل حديثاً', cta: 'تسوق الآن', icon: '👗' },
  { id: 'tech', label: 'إلكترونيات', accent: 'brandStrong', badge: 'الأكثر مبيعاً', cta: 'اشترِ الآن', icon: '💻' },
  { id: 'pro', label: 'اشتراك برو', accent: 'warning', badge: 'شهر مجاني', cta: 'اشترك الآن', icon: '⭐' },
];

export const SMART_TARGET_OPTIONS: ReadonlyArray<{ value: SmartBannerTargetType; label: string; description: string }> = [
  { value: 'home', label: 'الرئيسية', description: 'يعيد المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح قائمة المتاجر أو تجربة التصفح العامة.' },
  { value: 'store', label: 'متجر', description: 'يربط البنر بمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يربط البنر بفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يربط البنر بمنتج داخل متجر محدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض متجرًا فيه عرض نشط وملفت.' },
  { value: 'subscription', label: 'اشتراك', description: 'يفتح مسار الاشتراكات والمزايا.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح وجهة حملات عامة ضمن القناة الحالية.' },
  { value: 'tracking', label: 'التتبع', description: 'يربط البنر بمسار تتبع الطلب.' },
  { value: 'orders', label: 'الطلبات', description: 'يربط البنر بقائمة الطلبات.' },
  { value: 'loyalty', label: 'الولاء', description: 'يفتح سياق الولاء أو الاستحقاقات.' },
  { value: 'custom', label: 'مخصص', description: 'مسار محدود ومضبوط عندما لا تكفي الخيارات المنظمة.' },
];

export const SUBSCRIPTION_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  // { value: 'entitlements-get', label: 'المزايا الأساسية' },
  // { value: 'subscription-family-get', label: 'اشتراك العائلة' },
];

export const BANNER_MOTION_OPTIONS: ReadonlyArray<{ value: MarketingBannerMotionStyle; label: string; description: string }> = [
  { value: 'slide', label: 'انسياب', description: 'انتقال نظيف وهادئ بين الشرائح.' },
  { value: 'soft-parallax', label: 'بارالاكس ناعم', description: 'عمق بصري خفيف للصورة أثناء التركيز.' },
  { value: 'subtle-fade', label: 'تلاشي خفيف', description: 'يبرز البطاقة الفعالة بهدوء بصري.' },
  { value: 'snap-focus', label: 'تركيز سناب', description: 'تكبير وتركيز بسيط على الشريحة الفعالة.' },
];

export const IMAGE_FIT_TAB_ITEMS: ReadonlyArray<{ value: BannerImageFit; label: string }> = [
  { value: 'cover', label: 'كامل' },
  { value: 'contain', label: 'مناسب' },
];

export const LOGO_POSITION_TAB_ITEMS: ReadonlyArray<{ value: BannerLogoPosition; label: string }> = [
  { value: 'top-left', label: 'أعلى يسار' },
  { value: 'top-right', label: 'أعلى يمين' },
  { value: 'bottom-left', label: 'أسفل يسار' },
  { value: 'bottom-right', label: 'أسفل يمين' },
];
