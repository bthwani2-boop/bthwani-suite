/**
 * COMMERCIAL PREVIEW CONTRACT — DEV_ONLY (offline fallback, not UI preview mode)
 *
 * Single source of truth for all commercial domain types in DSH preview/UI layer.
 * This file is the authoritative type contract. Individual preview-stores implement
 * the data layer; this contract defines the shape.
 *
 * NOT runtime truth. NOT backend/API/binding source.
 * All values are UI preview fixtures for development/preview only.
 */
export const commercialContractMeta = {
  dataKind: 'DEV_OFFLINE_FALLBACK',
  version: '2.0.0',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

// ---------------------------------------------------------------------------
// Lifecycle Statuses (unified across all commercial domains)
// ---------------------------------------------------------------------------

export type CommercialLifecycleStatus =
  | 'draft'
  | 'inbound'
  | 'eligible'
  | 'review'
  | 'marketing-ready'
  | 'scheduled'
  | 'active'
  | 'published'
  | 'paused'
  | 'exhausted'
  | 'expired'
  | 'archived'
  | 'rejected'
  | 'cancelled';

export function isClientVisibleStatus(status: CommercialLifecycleStatus): boolean {
  return status === 'active' || status === 'published';
}

export function isReviewableStatus(status: CommercialLifecycleStatus): boolean {
  return status === 'inbound' || status === 'review';
}

export function isTerminalStatus(status: CommercialLifecycleStatus): boolean {
  return status === 'exhausted' || status === 'expired' || status === 'archived' || status === 'rejected' || status === 'cancelled';
}

// ---------------------------------------------------------------------------
// Audience
// ---------------------------------------------------------------------------

export type CommercialAudience =
  | 'all'
  | 'guest'
  | 'customer'
  | 'subscriber'
  | 'premium'
  | 'operations'
  | 'partner';

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------

export type CommercialPlacement =
  | 'home-hero'
  | 'home-feed'
  | 'store-card'
  | 'store-header'
  | 'store-menu'
  | 'cart'
  | 'checkout'
  | 'search'
  | 'notifications'
  | 'benefits'
  | 'news-ticker'
  | 'banner'
  | 'video-feed';

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------

export type CommercialEligibility = {
  audienceScope: CommercialAudience;
  requiresSubscriptionId?: string;
  requiresLoyaltyTierId?: string;
  minimumOrderValue?: number;
  maximumDiscountValue?: number;
  maxRedemptionsTotal?: number;
  maxRedemptionsPerUser?: number;
  validFrom?: string;
  validUntil?: string;
};

// ---------------------------------------------------------------------------
// Earning & Redemption Rules
// ---------------------------------------------------------------------------

export type CommercialEarningRule = {
  id: string;
  programId: string;
  description: string;
  pointsMultiplier: number;
  appliesTo: 'all' | 'category' | 'partner' | 'store';
  appliesToId?: string;
};

export type CommercialRedemptionRule = {
  id: string;
  programId?: string;
  description: string;
  pointsValue?: number;
  discountValue?: number;
  discountType?: 'fixed' | 'percentage' | 'free-delivery';
  expirationDays?: number;
  maxUsageCount?: number;
};

// ---------------------------------------------------------------------------
// Conflict Detection
// ---------------------------------------------------------------------------

export type CommercialConflictSeverity = 'none' | 'warning' | 'blocker';

export type CommercialConflict = {
  conflictId: string;
  severity: CommercialConflictSeverity;
  reason: string;
  sourceA?: string;
  sourceB?: string;
};

// ---------------------------------------------------------------------------
// Source Map
// ---------------------------------------------------------------------------

export type CommercialSourceEntry = {
  sourceOwner: 'loyalty' | 'subscription' | 'partner-offer' | 'campaign' | 'promo' | 'catalog' | 'system';
  sourceRecordId: string;
  lifecycleStatus: CommercialLifecycleStatus;
  conflictSeverity: CommercialConflictSeverity;
  conflictReason?: string;
};

export type CommercialSourceMap = Record<string, CommercialSourceEntry>;

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

export type CommercialMeasurement = {
  impressions: number;
  clicks: number;
  conversions?: number;
  redemptions?: number;
  ctr?: number;
};

// ---------------------------------------------------------------------------
// Loyalty Program
// ---------------------------------------------------------------------------

export type CommercialProgram = {
  id: string;
  name: string;
  type: 'loyalty' | 'subscription' | 'partner-benefit';
  description: string;
  currencyLabel?: string;
  status: CommercialLifecycleStatus;
};

export type LoyaltyTierBenefit = {
  id: string;
  label: string;
  description?: string;
};

export type LoyaltyTier = {
  id: string;
  programId: string;
  name: string;
  minimumPoints: number;
  benefits: LoyaltyTierBenefit[];
  earningMultiplier?: number;
};

export type LoyaltyReward = {
  id: string;
  programId: string;
  title: string;
  description?: string;
  pointsCost: number;
  status: CommercialLifecycleStatus;
  redemptionRule?: CommercialRedemptionRule;
  eligibility?: CommercialEligibility;
};

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------

export type SubscriptionPlan = {
  id: string;
  name: string;
  monthlyFee: number;
  weeklyFee?: number;
  features: string[];
  status: CommercialLifecycleStatus;
  tier?: 'weekly' | 'monthly' | 'family';
};

// ---------------------------------------------------------------------------
// Entitlement
// ---------------------------------------------------------------------------

export type CommercialEntitlement = {
  id: string;
  userId?: string;
  type: 'subscription' | 'loyalty-tier' | 'loyalty-reward' | 'partner-benefit';
  referenceId: string;
  status: 'active' | 'expired' | 'pending';
  expiresAt?: string;
  source: 'subscription' | 'loyalty' | 'promotion';
  benefitLabel?: string;
};

// ---------------------------------------------------------------------------
// Partner Offer
// ---------------------------------------------------------------------------

export type PartnerOfferKind = 'discount' | 'free-delivery' | 'bundle' | 'buy-x-get-y' | 'coupon';
export type PartnerOfferSource = 'partner' | 'field' | 'marketing' | 'catalog';
export type PartnerOfferTarget = 'store' | 'product' | 'category';

export type PartnerOffer = {
  id: string;
  title: string;
  partnerName: string;
  storeId: string;
  storeLabel: string;
  productId?: string;
  productLabel?: string;
  category?: string;
  offerKind: PartnerOfferKind;
  status: CommercialLifecycleStatus;
  source: PartnerOfferSource;
  target?: PartnerOfferTarget;
  valueLabel: string;
  displayBadge: string;
  eligibility?: CommercialEligibility;
  placement?: CommercialPlacement;
  marginRiskNote?: string;
  rejectionReason?: string;
  linkedCampaignId?: string;
  measurement?: CommercialMeasurement;
  activeFromDate?: string;
  activeToDate?: string;
};

// ---------------------------------------------------------------------------
// Promo / Coupon
// ---------------------------------------------------------------------------

export type CommercialCoupon = {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed' | 'free-delivery';
  discountValue: number;
  status: CommercialLifecycleStatus;
  eligibility: CommercialEligibility;
  redemptionRule: CommercialRedemptionRule;
  linkedCampaignId?: string;
  placement?: CommercialPlacement;
  measurement?: CommercialMeasurement;
};

// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------

export type CommercialCampaign = {
  id: string;
  title: string;
  subtitle?: string;
  status: CommercialLifecycleStatus;
  priority: 'low' | 'normal' | 'high' | 'critical';
  goal: 'awareness' | 'conversion' | 'retention' | 'acquisition';
  audience: CommercialAudience;
  placements: CommercialPlacement[];
  channels: Array<'banner' | 'promo' | 'video' | 'ticker' | 'store-card' | 'growth'>;
  targetType: 'home' | 'stores' | 'store' | 'category' | 'subcategory' | 'product' | 'offer' | 'search';
  targetId?: string;
  linkedOfferId?: string;
  linkedLoyaltyBenefitId?: string;
  linkedBannerId?: string;
  linkedVideoId?: string;
  startDate?: string;
  endDate?: string;
  measurement: CommercialMeasurement;
};

// ---------------------------------------------------------------------------
// Commercial Projection (what app-client surfaces receive)
// ---------------------------------------------------------------------------

export type CommercialBadge = {
  label: string;
  source: 'partner' | 'loyalty' | 'subscription' | 'campaign' | 'catalog';
  tone?: 'brand' | 'warning' | 'success' | 'info' | 'danger';
};

export type CommercialProjection = {
  storeId?: string;
  badges: CommercialBadge[];
  offerLabel?: string;
  hasCouponAvailable: boolean;
  deliveryFeeLabel?: string;
  hasBthwaniPro: boolean;
  subscriptionChips: string[];
  hasLoyaltyReward: boolean;
  priceMatchLabel?: string;
  sourceMap: CommercialSourceMap;
  conflicts: CommercialConflict[];
  isClientVisible: boolean;
};

export function buildEmptyProjection(storeId?: string): CommercialProjection {
  return {
    storeId,
    badges: [],
    offerLabel: undefined,
    hasCouponAvailable: false,
    deliveryFeeLabel: undefined,
    hasBthwaniPro: false,
    subscriptionChips: [],
    hasLoyaltyReward: false,
    priceMatchLabel: undefined,
    sourceMap: {},
    conflicts: [],
    isClientVisible: false,
  };
}

// ---------------------------------------------------------------------------
// Lifecycle transition helpers
// ---------------------------------------------------------------------------

export const PARTNER_OFFER_LIFECYCLE: CommercialLifecycleStatus[] = [
  'inbound', 'review', 'marketing-ready', 'published', 'paused', 'archived', 'rejected',
];

export const CAMPAIGN_LIFECYCLE: CommercialLifecycleStatus[] = [
  'draft', 'scheduled', 'published', 'paused', 'archived',
];

export const PROMO_LIFECYCLE: CommercialLifecycleStatus[] = [
  'draft', 'eligible', 'active', 'exhausted', 'expired', 'paused', 'archived',
];

export const SUBSCRIPTION_LIFECYCLE: CommercialLifecycleStatus[] = [
  'draft', 'active', 'paused', 'expired', 'cancelled',
];

export const LOYALTY_LIFECYCLE: CommercialLifecycleStatus[] = [
  'active', 'paused', 'archived',
];

// Required fields validation for PartnerOffer before publish
export function validatePartnerOfferForPublish(offer: Partial<PartnerOffer>): string[] {
  const errors: string[] = [];
  if (!offer.title?.trim()) errors.push('عنوان العرض مطلوب');
  if (!offer.partnerName?.trim()) errors.push('اسم الشريك مطلوب');
  if (!offer.storeId?.trim()) errors.push('معرف المتجر مطلوب');
  if (!offer.offerKind) errors.push('نوع العرض مطلوب');
  if (!offer.valueLabel?.trim()) errors.push('قيمة العرض مطلوبة');
  if (!offer.displayBadge?.trim()) errors.push('شارة العرض مطلوبة');
  if (offer.status !== 'marketing-ready') errors.push('يجب أن يكون العرض في حالة "جاهز للتسويق" قبل النشر');
  return errors;
}

// ---------------------------------------------------------------------------
// Client Presentation Types (app-client adapter layer)
// ---------------------------------------------------------------------------

export type SubscriptionClientCard = {
  id: 'weekly' | 'monthly' | 'family';
  title: string;
  price: string;
  cadence: string;
  note: string;
  highlight: string;
  current?: boolean;
  featured?: boolean;
};

export type LoyaltyClientMetric = {
  label: string;
  value: string;
  helperText: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
};

export type LoyaltyClientSectionItem = {
  label: string;
  value: string;
  helperText?: string;
  tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

export type LoyaltyClientSection = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
  items: LoyaltyClientSectionItem[];
};

export type LoyaltyClientBenefits = {
  title: string;
  subtitle: string;
  note: string;
  metrics: LoyaltyClientMetric[];
  sections: LoyaltyClientSection[];
};

// ---------------------------------------------------------------------------
// Status Normalization
// ---------------------------------------------------------------------------

const ALL_LIFECYCLE_STATUSES: CommercialLifecycleStatus[] = [
  'draft', 'inbound', 'eligible', 'review', 'marketing-ready', 'scheduled',
  'active', 'published', 'paused', 'exhausted', 'expired', 'archived', 'rejected', 'cancelled',
];

export function normalizeCommercialStatus(status: string): CommercialLifecycleStatus | undefined {
  return ALL_LIFECYCLE_STATUSES.includes(status as CommercialLifecycleStatus)
    ? (status as CommercialLifecycleStatus)
    : undefined;
}

// ---------------------------------------------------------------------------
// Eligibility Evaluation
// ---------------------------------------------------------------------------

export type CommercialEligibilityContext = {
  userId?: string;
  subscriptionId?: string;
  loyaltyTierId?: string;
  orderValue?: number;
  isGuest?: boolean;
};

export function evaluateCommercialEligibility(
  eligibility: CommercialEligibility | undefined,
  context: CommercialEligibilityContext,
): boolean {
  if (!eligibility) return true;
  const { audienceScope, requiresSubscriptionId, requiresLoyaltyTierId, minimumOrderValue } = eligibility;
  if (audienceScope === 'guest' && !context.isGuest) return false;
  if (audienceScope === 'subscriber' && !context.subscriptionId) return false;
  if (audienceScope === 'premium' && !context.loyaltyTierId) return false;
  if (requiresSubscriptionId && context.subscriptionId !== requiresSubscriptionId) return false;
  if (requiresLoyaltyTierId && context.loyaltyTierId !== requiresLoyaltyTierId) return false;
  if (minimumOrderValue !== undefined && (context.orderValue ?? 0) < minimumOrderValue) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Conflict Evaluation
// ---------------------------------------------------------------------------

export function evaluateCommercialConflicts(sourceMap: CommercialSourceMap): CommercialConflict[] {
  return Object.entries(sourceMap)
    .filter(([, entry]) => entry.conflictSeverity !== 'none')
    .map(([key, entry]) => ({
      conflictId: key,
      severity: entry.conflictSeverity,
      reason: entry.conflictReason ?? key,
      sourceA: entry.sourceRecordId,
    }));
}

// ---------------------------------------------------------------------------
// Projection Builder
// ---------------------------------------------------------------------------

export type CommercialProjectionInput = {
  storeId?: string;
  partnerOffers?: PartnerOffer[];
  campaigns?: CommercialCampaign[];
  subscriptionPlans?: SubscriptionPlan[];
  entitlements?: CommercialEntitlement[];
  sourceMap?: CommercialSourceMap;
};

export function buildCommercialProjection(input: CommercialProjectionInput): CommercialProjection {
  const badges: CommercialBadge[] = [];
  const sourceMap: CommercialSourceMap = input.sourceMap ?? {};

  const visibleOffers = (input.partnerOffers ?? []).filter(o => isClientVisibleStatus(o.status));
  visibleOffers.slice(0, 2).forEach(o => badges.push({ label: o.displayBadge, source: 'partner' }));

  (input.campaigns ?? [])
    .filter(c => isClientVisibleStatus(c.status) && c.placements?.includes('store-card'))
    .slice(0, 1)
    .forEach(c => badges.push({ label: `حملة: ${c.title}`, source: 'campaign' }));

  const hasPro = (input.subscriptionPlans ?? []).some(s => s.id === 'sub-pro' && isClientVisibleStatus(s.status));
  if (hasPro) badges.push({ label: '⚡ بثواني برو', source: 'subscription' });

  const hasReward = (input.entitlements ?? []).some(e => e.type === 'loyalty-reward' && e.status === 'active');
  if (hasReward) badges.push({ label: 'مكافأة ولاء', source: 'loyalty' });

  const conflicts = evaluateCommercialConflicts(sourceMap);
  const hasBlocker = conflicts.some(c => c.severity === 'blocker');

  return {
    storeId: input.storeId,
    badges: hasBlocker ? [] : badges,
    offerLabel: visibleOffers[0]?.displayBadge,
    hasCouponAvailable: visibleOffers.some(o => o.offerKind === 'coupon'),
    deliveryFeeLabel: visibleOffers.some(o => o.offerKind === 'free-delivery') ? 'توصيل مجاني' : undefined,
    hasBthwaniPro: hasPro,
    subscriptionChips: hasPro ? ['بثواني برو', 'توصيل سريع'] : [],
    hasLoyaltyReward: hasReward,
    sourceMap,
    conflicts,
    isClientVisible: !hasBlocker && badges.length > 0,
  };
}

// ---------------------------------------------------------------------------
// Client Card Mappers
// ---------------------------------------------------------------------------

export function mapSubscriptionPlansToClientCards(plans: SubscriptionPlan[]): SubscriptionClientCard[] {
  const tierIdMap: Record<string, 'weekly' | 'monthly' | 'family'> = {
    weekly: 'weekly',
    monthly: 'monthly',
    family: 'family',
  };
  return plans.map((plan) => {
    const cardId = tierIdMap[plan.tier ?? ''] ?? (plan.id.includes('weekly') ? 'weekly' : plan.id.includes('family') ? 'family' : 'monthly');
    return {
      id: cardId,
      title: plan.name,
      price: String(plan.weeklyFee ?? plan.monthlyFee),
      cadence: plan.weeklyFee ? 'ريال / أسبوع' : 'ريال / شهر',
      note: plan.features.join(' • '),
      highlight: cardId === 'family' ? 'الأكثر شمولاً' : cardId === 'monthly' ? 'الخيار المتوازن' : 'أسرع بداية',
      featured: cardId === 'monthly',
      current: cardId === 'weekly',
    };
  });
}

export function mapLoyaltyProgramToClientBenefits(
  programName: string,
  rewards: LoyaltyReward[],
  tiers: LoyaltyTier[],
): LoyaltyClientBenefits {
  const activeTier = tiers[tiers.length - 1];
  const tierLabel = activeTier?.name ?? 'فضي';
  const activeRewards = rewards.filter(r => isClientVisibleStatus(r.status));

  return {
    title: 'الولاء والمكافآت',
    subtitle: `برنامج ${programName} — ${tierLabel}`,
    note: 'بيانات معاينة للولاء.',
    metrics: [
      { label: 'المستوى الحالي', value: tierLabel, helperText: `${activeTier?.minimumPoints ?? 0} نقطة للتأهل`, tone: 'brand' },
      { label: 'مكافآت متاحة', value: String(activeRewards.length), helperText: 'قابلة للاسترداد', tone: 'info' },
      { label: 'المزايا النشطة', value: String(activeTier?.benefits?.length ?? 0), helperText: 'مرتبطة بمستواك', tone: 'success' },
    ],
    sections: mapRewardsToClientSections(rewards, activeTier),
  };
}

export function mapRewardsToClientSections(rewards: LoyaltyReward[], tier?: LoyaltyTier): LoyaltyClientSection[] {
  const activeRewards = rewards.filter(r => isClientVisibleStatus(r.status));
  if (activeRewards.length === 0) return [];
  return [
    {
      title: 'المكافآت المتاحة',
      subtitle: 'استبدل نقاطك بهذه المكافآت',
      badgeLabel: 'متاح',
      tone: 'info',
      items: activeRewards.map(r => ({
        label: r.title,
        value: `${r.pointsCost} نقطة`,
        helperText: r.description ?? 'يمكن الاسترداد الآن',
        tone: 'info' as const,
      })),
    },
    ...(tier?.benefits?.length
      ? [{
          title: 'مزايا المستوى',
          subtitle: `المزايا المرتبطة بمستوى ${tier.name}`,
          badgeLabel: tier.name,
          tone: 'success' as const,
          items: tier.benefits.map(b => ({
            label: b.label,
            value: 'مفعّل',
            helperText: b.description,
            tone: 'success' as const,
          })),
        }]
      : []),
  ];
}

export function mapPartnerOfferToCommercialOffer(
  offer: { title: string; displayBadge: string; status: string },
): CommercialBadge | null {
  const status = normalizeCommercialStatus(offer.status);
  if (!status || !isClientVisibleStatus(status)) return null;
  return { label: offer.displayBadge || offer.title, source: 'partner' };
}

export function mapCampaignToCommercialProjection(campaign: CommercialCampaign): Partial<CommercialProjection> {
  if (!isClientVisibleStatus(campaign.status)) return {};
  const badges: CommercialBadge[] = campaign.placements.includes('store-card')
    ? [{ label: `حملة: ${campaign.title}`, source: 'campaign' }]
    : [];
  return { badges, isClientVisible: badges.length > 0 };
}
