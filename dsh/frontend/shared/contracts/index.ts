// DSH Contracts — data shapes, type definitions, identity models
// NOTE: commercial-contract aliases are preserved explicitly to avoid CommercialBadge conflict
export type {
  CommercialLifecycleStatus,
  CommercialAudience,
  CommercialPlacement,
  CommercialEligibility,
  CommercialEarningRule,
  CommercialRedemptionRule,
  CommercialConflictSeverity,
  CommercialConflict,
  CommercialSourceEntry,
  CommercialSourceMap as CommercialContractSourceMap,
  CommercialMeasurement,
  CommercialProgram,
  LoyaltyTierBenefit,
  LoyaltyTier as CommercialLoyaltyTier,
  LoyaltyReward as CommercialLoyaltyReward,
  SubscriptionPlan as CommercialSubscriptionPlan,
  CommercialEntitlement,
  PartnerOffer,
  PartnerOfferKind,
  PartnerOfferSource as CommercialPartnerOfferSource,
  PartnerOfferTarget as CommercialPartnerOfferTarget,
  CommercialCoupon,
  CommercialCampaign,
  CommercialBadge as CommercialContractBadge,
  CommercialProjection,
  SubscriptionClientCard,
  LoyaltyClientMetric,
  LoyaltyClientSectionItem,
  LoyaltyClientSection,
  LoyaltyClientBenefits,
  CommercialEligibilityContext,
  CommercialProjectionInput,
} from './commercial-contract';
export {
  commercialContractMeta,
  isClientVisibleStatus,
  isReviewableStatus,
  isTerminalStatus,
  buildEmptyProjection,
  validatePartnerOfferForPublish,
  PARTNER_OFFER_LIFECYCLE,
  CAMPAIGN_LIFECYCLE,
  PROMO_LIFECYCLE,
  SUBSCRIPTION_LIFECYCLE,
  LOYALTY_LIFECYCLE,
  normalizeCommercialStatus,
  evaluateCommercialEligibility,
  evaluateCommercialConflicts,
  buildCommercialProjection,
  mapSubscriptionPlansToClientCards,
  mapLoyaltyProgramToClientBenefits,
  mapRewardsToClientSections,
  mapPartnerOfferToCommercialOffer,
  mapCampaignToCommercialProjection,
} from './commercial-contract';

export * from './marketing-visibility.contract';
export * from './catalog';
export * from './dsh-operational.contract';
export * from './dsh-operational-registry';
export * from './dsh-order.contract';
export * from './dsh-wlt-settlement-bridge.contract';
export * from './dsh-delivery-mode.model';
export * from './dsh-signal-layer.model';
export * from './dsh-discovery.contract';
export * from './dsh-field-visit.contract';
export * from './dsh-partner-activation.model';
export * from './dsh-product-identity.model';
export * from './category-icons';
export * from './dsh-client-visibility.model';
export * from './dsh-fulfillment-surface-visibility';
export * from './dsh-marketing-types';
export * from './dsh-partner-offer-types';
export * from './field-store-model';
export * from './dsh-order-lifecycle-handoffs';
export type { components, operations, paths } from './openapi';
