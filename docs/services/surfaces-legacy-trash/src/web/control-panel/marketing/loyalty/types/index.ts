/**
 * Loyalty types — SSoT from DSH_LOYALTY_MASTER_SPEC.md
 * قفل: scope_type فقط restaurants | grocery | all | night | week
 * اشتراك: pro فقط؛ مصدر الحقيقة LoyaltySubscriptionState
 */

// قفل النطاق — القيم المسموح بها فقط (لا restaurant بالمفرد)
export type LoyaltyScopeType =
  | 'restaurants'
  | 'grocery'
  | 'all'
  | 'night'
  | 'week';

// باقات بثواني برو — ليست Tiers مستقلة
export type BThwaniProBundleType =
  | 'individual'
  | 'family'
  | 'week'
  | 'night';

// مصدر حقيقة الاشتراك في منطق الولاء: مشترك = pro فقط
export interface LoyaltySubscriptionState {
  isSubscribedToPro: boolean;
  proBundleType?: BThwaniProBundleType;
  scopeType?: LoyaltyScopeType;
}

export type LoyaltyProgramKind =
  | 'subscription_benefit'
  | 'discount'
  | 'coupon'
  | 'points_rule'
  | 'reward'
  | 'cashback'
  | 'promotion_bundle';

export type LoyaltyFundingSource = 'merchant' | 'platform' | 'shared' | 'delivery_component';

export interface LoyaltyFundingSplit {
  merchantPct: number;
  platformPct: number;
  deliveryPct: number;
}

export interface LoyaltyTargeting {
  storeIds?: string[];
  categoryIds?: string[];
  subcategoryIds?: string[];
  storeCategoryIds?: string[];
  itemIds?: string[];
  scopeType?: LoyaltyScopeType;
  regionIds?: string[];
  cityIds?: string[];
  zoneIds?: string[];
  subscriptionTier?: 'pro';
}

export type LoyaltyProgramLifecycleStatus =
  | 'draft'
  | 'simulated'
  | 'approved'
  | 'active'
  | 'paused'
  | 'expired'
  | 'completed'
  | 'rolled_back';

export interface LoyaltyProgramDraft {
  kind: LoyaltyProgramKind;
  targeting: LoyaltyTargeting;
  funding: LoyaltyFundingSplit;
  dailyBudgetYer?: number;
  totalBudgetYer?: number;
  usageCapPerUser?: number;
  usageCapPerStore?: number;
  stackableWithCoupon?: boolean;
  stackableWithPoints?: boolean;
  stackableWithSubscription?: boolean;
}

export interface LoyaltyProgramOutcome {
  programId: string;
  programKind: LoyaltyProgramKind;
  startedAt: string;
  endedAt: string;
  eligibleUsersCount: number;
  activatedUsersCount: number;
  redemptionsCount: number;
  redemptionRatePct: number;
  ordersInfluencedCount: number;
  incrementalOrdersCount: number;
  incrementalRevenueYer: number;
  grossDiscountCostYer: number;
  merchantCostYer: number;
  platformCostYer: number;
  deliveryCostYer: number;
  commissionImpactYer: number;
  netImpactYer: number;
  roiPct: number;
  refundRatePct: number;
  cancelRatePct: number;
  abuseRatePct: number;
  predictedNetImpactYer?: number;
  predictionErrorPct?: number;
  successStatus: 'success' | 'mixed' | 'failed';
  recommendation: 'repeat' | 'repeat_with_changes' | 'stop';
  summaryReason: string[];
}

export interface LoyaltySuccessEvaluationInput {
  netImpactYer: number;
  roiPct: number;
  predictionErrorPct: number;
  abuseRatePct: number;
  refundRatePct: number;
  cancelRatePct: number;
}

export interface LoyaltySuccessEvaluationOutput {
  successStatus: 'success' | 'mixed' | 'failed';
  recommendation: 'repeat' | 'repeat_with_changes' | 'stop';
  reasons: string[];
}

export interface LoyaltyLiveMetrics {
  eligibleUsersCount: number;
  activatedUsersCount: number;
  redemptionsCount: number;
  redemptionRatePct: number;
  ordersInfluencedCount: number;
  incrementalOrdersCount: number;
  incrementalRevenueYer: number;
  grossDiscountCostYer: number;
  merchantCostYer: number;
  platformCostYer: number;
  deliveryCostYer: number;
  commissionImpactYer: number;
  netImpactYer: number;
  roiPct: number;
  budgetConsumedPct?: number;
  abuseRatePct?: number;
  refundRatePct?: number;
  cancelRatePct?: number;
}
