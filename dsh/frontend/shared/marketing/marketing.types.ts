// Runtime-safe marketing types — records, statuses, campaign shapes.
// No JSX. No ui-kit. No Tamagui.

export type MarketingBannerActionType =
  | 'main_category'
  | 'sub_category'
  | 'store'
  | 'store_category'
  | 'product'
  | 'external'
  | 'subscription';

export type MarketingBannerAudience = 'home' | 'stores' | 'client' | 'all';
export type MarketingBannerStatus = 'draft' | 'published';
export type MarketingBannerMotionStyle = 'slide' | 'soft-parallax' | 'subtle-fade' | 'snap-focus';

export type MarketingBannerRecord = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  mediaKey?: string;
  accentColor?: string;
  audience: MarketingBannerAudience;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  actionTarget?: string;
  actionExtra?: string;
  ctaLabel?: string;
  partnerName?: string;
  position: number;
  clicks: number;
  impressions: number;
  scheduleStartHour?: number;
  scheduleEndHour?: number;
  updatedAt: string;
  templateId?: string;
  offerBadgeText?: string;
  offerBadgeColor?: string;
  offerBadgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  partnerLogoUrl?: string;
  partnerLogoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl?: string;
  overlayPosition?: 'center' | 'bottom' | 'top' | 'fill';
  overlayOpacity?: number;
  titlePlacement?: 'top' | 'center' | 'bottom';
  subtitlePlacement?: 'top' | 'center' | 'bottom';
  ctaPlacement?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  imageFit?: 'cover' | 'contain';
  motionStyle?: MarketingBannerMotionStyle;
  autoplayEnabled?: boolean;
  autoplayIntervalMs?: number;
  pauseOnInteraction?: boolean;
};

export type CampaignStatus = 'draft' | 'pending' | 'published' | 'paused' | 'archived';
export type CampaignGoal = 'awareness' | 'conversion' | 'retention' | 'acquisition';
export type CampaignAudience = 'all' | 'client' | 'operations' | 'targeted';
export type CampaignChannel = 'banner' | 'promo' | 'video' | 'ticker' | 'store-card';
export type CampaignPlacement = 'hero' | 'feed' | 'floating' | 'banner';
export type CampaignPriority = 'low' | 'normal' | 'high' | 'critical';
export type CampaignTargetType = 'home' | 'stores' | 'store' | 'category' | 'subcategory' | 'product' | 'offer' | 'campaign' | 'search' | 'custom';

export type CampaignRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: CampaignStatus;
  priority: CampaignPriority;
  goal: CampaignGoal;
  audience: CampaignAudience;
  channels: CampaignChannel[];
  placement: CampaignPlacement;
  targetType: CampaignTargetType;
  targetId: string;
  linkedBannerId?: string;
  linkedVideoId?: string;
  linkedOfferId?: string;
  linkedLoyaltyBenefitId?: string;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
};

export type HomePromoStatus =
  | 'draft'
  | 'review'
  | 'eligible'
  | 'active'
  | 'exhausted'
  | 'expired'
  | 'paused'
  | 'archived'
  | 'published';

export type HomePromoRecord = {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText?: string;
  accentColor?: string;
  imageUrl?: string;
  thumbnail?: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  status: HomePromoStatus;
  order: number;
  audienceScope?: 'all' | 'guest' | 'customer' | 'premium';
  placement: 'home-promo';
  updatedAt: string;
};

export type MarketingVideoStatus = 'published' | 'draft' | 'review' | 'paused';
export type MarketingVideoAudience = 'all' | 'client' | 'operations';
export type MarketingVideoSource = 'marketing' | 'partner';
export type MarketingVideoTargetType =
  | 'home'
  | 'stores'
  | 'store'
  | 'category'
  | 'subcategory'
  | 'product'
  | 'offer'
  | 'campaign'
  | 'search'
  | 'custom'
  | 'loyalty';

export type MarketingVideoRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  videoUrl: string;
  posterUrl: string;
  durationSeconds: number;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  ctaLabel: string;
  highlight: string;
  targetType: MarketingVideoTargetType;
  targetId: string;
  targetExtra?: string;
  order: number;
  impressions: number;
  clicks: number;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

export type MarketingGrowthFamily =
  | 'campaign'
  | 'promotion'
  | 'subscription'
  | 'shorts';
export type MarketingGrowthSource = 'marketing' | 'partner';
export type MarketingGrowthStatus = 'draft' | 'pending-marketing' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget =
  | 'home'
  | 'stores'
  | 'store'
  | 'category'
  | 'product'
  | 'search';

export type MarketingGrowthRecord = {
  id: string;
  title: string;
  subtitle: string;
  family: MarketingGrowthFamily;
  status: MarketingGrowthStatus;
  audience: MarketingGrowthAudience;
  source: MarketingGrowthSource;
  routeTarget: MarketingGrowthRouteTarget;
  routeTargetId?: string;
  routeTargetExtra?: string;
  ctaLabel: string;
  highlight: string;
  metricValue: string;
  accentColor: string;
  impressions: number;
  clicks: number;
};

// ── Control-Panel Editor Types ─────────────────────────────────────────────

export type MarketingControlView =
  | 'visibility'
  | 'ticker'
  | 'banners'
  | 'promos'
  | 'video'
  | 'campaigns'
  | 'partners'
  | 'media-review'
  | 'loyalty'
  | 'growth'
  | 'signals'
  | 'approval-queue'
  | 'video-review';

export type MarketingCommandDeckTab =
  | 'ticker'
  | 'banners'
  | 'promos'
  | 'video'
  | 'campaigns'
  | 'partners'
  | 'media-review'
  | 'loyalty'
  | 'growth'
  | 'signals';

export type MarketingReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export type MarketingReviewItem = {
  id: string;
  type: 'banner' | 'video' | 'promo';
  title: string;
  submittedAt: string;
  status: MarketingReviewStatus;
  submittedBy: string;
};

// ── Banner Editor Types ─────────────────────────────────────────────────────

export type SmartBannerTargetType =
  | 'home' | 'stores' | 'store' | 'category' | 'subcategory'
  | 'product' | 'offer' | 'subscription' | 'campaign' | 'tracking'
  | 'orders' | 'loyalty' | 'custom';

export type SmartTargetSummary = {
  type?: SmartBannerTargetType;
  id?: string;
  label: string;
  targetId?: string;
  targetLabel?: string;
  finalRoute?: string;
};

export type BannerImageFit = 'cover' | 'contain';
export type BannerLogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type EditorTab = 'content' | 'media' | 'target' | 'publish';
export type SmartTargetStoreFilter = 'all' | 'offers' | 'favorites' | 'available';

export type BannerDraft = Record<
  | 'title'
  | 'subtitle'
  | 'imageUrl'
  | 'ctaLabel'
  | 'highlight'
  | 'targetId'
  | 'targetExtra'
  | 'actionTarget'
  | 'actionExtra'
  | 'partnerName'
  | 'position'
  | 'templateId'
  | 'offerBadgeText'
  | 'offerBadgeColor'
  | 'offerBadgePosition'
  | 'partnerLogoUrl'
  | 'partnerLogoPosition'
  | 'overlayImageUrl'
  | 'overlayPosition'
  | 'titlePlacement'
  | 'motionStyle'
  | 'autoplayIntervalMs'
  | 'order',
  string
> & {
  id?: string;
  mediaKey?: string;
  accentColor?: string;
  actionType?: MarketingBannerRecord['actionType'];
  status: MarketingBannerStatus;
  audience: MarketingBannerAudience;
  targetType: SmartBannerTargetType;
  motion: MarketingBannerMotionStyle;
  imageFit: BannerImageFit;
  logoPosition: BannerLogoPosition;
  partnerLogoPosition: BannerLogoPosition;
  overlayImageUrl?: string;
  autoplayEnabled?: boolean;
  pauseOnInteraction?: boolean;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
  subscriptionId?: string;
};

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

// ── Video Editor Types ─────────────────────────────────────────────────────

export type VideoDraft = Record<
  | 'title'
  | 'subtitle'
  | 'videoUrl'
  | 'posterUrl'
  | 'durationSeconds'
  | 'ctaLabel'
  | 'highlight'
  | 'targetId'
  | 'targetExtra'
  | 'order',
  string
> & {
  id?: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  targetType: MarketingVideoTargetType;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

export type VideoEditorWorkspaceTab = 'content' | 'media' | 'target' | 'publish';

export const VIDEO_TARGET_TYPE_OPTIONS: Array<{
  value: MarketingVideoTargetType;
  label: string;
  description: string;
}> = [
  { value: 'home', label: 'الرئيسية', description: 'يُوجه المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح لائحة المتاجر من صفحة التصفح الرئيسية.' },
  { value: 'store', label: 'متجر', description: 'يُوجه الفيديو لمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يُوجه الفيديو لفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يُوجه الفيديو لمنتج داخل المتجر المحدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض مستواها قيد عرض غير ملزم.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح واجهة حملة رابحة ذمن اللوحة الحالية.' },
  { value: 'search', label: 'بحث', description: 'يفتح واجهة البحث.' },
  { value: 'custom', label: 'مخصص', description: 'مساق محدد ومأخوذ رابطها لا يعكس الخيارات الملزمة.' },
];

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

export const TARGET_TYPE_OPTIONS = VIDEO_TARGET_TYPE_OPTIONS;
