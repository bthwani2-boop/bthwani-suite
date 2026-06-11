// Runtime-safe marketing types extracted from preview-data ownership so live
// surfaces can depend on contracts without importing preview stores.

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
