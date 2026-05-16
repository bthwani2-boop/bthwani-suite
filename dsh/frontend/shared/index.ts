// --- Commercial Marketing Contract (UI_PREVIEW_ONLY) ---

export type {
  LoyaltyStatus,
  LoyaltyAudience,
  LoyaltyLane,
  LoyaltyRecord,
  LoyaltyProgram,
  LoyaltyTier,
  LoyaltyReward,
  SubscriptionPlan,
  Entitlement,
  EarningRule,
  RedemptionRule,
} from './loyalty.preview-store';
export {
  loyaltyStoreDataContract,
  getLoyaltyItems,
  getLoyaltyKpis,
  upsertLoyaltyItem,
  removeLoyaltyItem,
  getLoyaltyPrograms,
  getSubscriptionPlans,
  getLoyaltyTiers,
  getLoyaltyRewards,
  getEntitlements,
} from './loyalty.preview-store';

export type {
  PartnerOfferType,
  PartnerOfferStatus,
  PartnerOfferSource,
  PartnerOfferTarget,
  PartnerOfferRecord,
} from './partner-offer.preview-store';
export {
  partnerOfferStoreDataContract,
  getPartnerOfferItems,
  getPartnerOfferKpis,
  upsertPartnerOfferItem,
  approvePartnerOfferItem,
  publishPartnerOfferItem,
  pausePartnerOfferItem,
  rejectPartnerOfferItem,
  archivePartnerOfferItem,
  removePartnerOfferItem,
  isPartnerOfferClientVisible,
} from './partner-offer.preview-store';

export type {
  CampaignStatus,
  CampaignGoal,
  CampaignAudience,
  CampaignChannel,
  CampaignPlacement,
  CampaignPriority,
  CampaignTargetType,
  CampaignRecord,
} from './campaign.preview-store';
export {
  campaignStoreDataContract,
  getCampaignItems,
  getCampaignKpis,
  upsertCampaignItem,
  toggleCampaignStatus,
  duplicateCampaignItem,
  removeCampaignItem,
} from './campaign.preview-store';

export type {
  HomePromoStatus,
  HomePromoRecord,
} from './promo.preview-store';
export {
  promoStoreDataContract,
  getHomePromoItems,
  getPublishedHomePromos,
  isPromoClientVisible,
  upsertHomePromoItem,
  removeHomePromoItem,
  toggleHomePromoStatus,
} from './promo.preview-store';

export type {
  CommercialSource,
  CommercialSourceMap,
  StoreCommercialContext,
  CommercialBadge,
} from './store-card-commercial-map';
export {
  mapStoreCommercialFeatures,
  CommercialParityPreview,
  conflictList,
} from './store-card-commercial-map';

export type {
	DshCatalogApprovalStage,
	DshCatalogMeasurementKind,
	DshCatalogMeasurementPolicy,
	DshCatalogNode,
	DshCatalogNodeKind,
	DshCatalogPipelineStep,
} from './catalog';
export {
	dshCatalogMetrics,
	dshCatalogNodes,
	dshCatalogPipeline,
	dshCategoryMeasurementPolicies,
} from './catalog';

export type {
	MarketingBannerActionType,
	MarketingBannerAudience,
	MarketingBannerMotionStyle,
	MarketingBannerRecord,
	MarketingBannerStatus,
} from './banner.preview-store';
export {
	bannerStoreDataContract,
	computeMarketingBannerQuality,
	duplicateMarketingBannerItem,
	getMarketingBannerItems,
	getMarketingBannerKpis,
	getPublishedMarketingHomePromos,
	isMarketingBannerLive,
	mapMarketingBannerToPromo,
	recordMarketingBannerClick,
	recordMarketingBannerImpression,
	removeMarketingBannerItem,
	toggleMarketingBannerStatus,
	upsertMarketingBannerItem,
} from './banner.preview-store';

export type {
	GrowthRecommendation,
	GrowthRecommendationType,
	MarketingGrowthAudience,
	MarketingGrowthFamily,
	MarketingGrowthRecord,
	MarketingGrowthRouteTarget,
	MarketingGrowthSource,
	MarketingGrowthStatus,
} from './growth.preview-store';
export {
	approveMarketingGrowthItem,
	duplicateMarketingGrowthItem,
	getGrowthRecommendations,
	getLiveMarketingGrowthItems,
	getMarketingGrowthItems,
	getMarketingGrowthKpis,
	growthStoreDataContract,
	pauseMarketingGrowthItem,
	removeMarketingGrowthItem,
	submitMarketingGrowthItem,
	toggleMarketingGrowthStatus,
	upsertMarketingGrowthItem,
} from './growth.preview-store';

export type {
	ApprovalEntityType,
	ApprovalRecord,
	ApprovalRecordMetadata,
	ApprovalSourceSurface,
	ApprovalStage,
	AuditTrailEntry,
	ClientVisibilityOptions,
	DshPartnerIntakeItem,
	DshPartnerIntakeMetric,
	DshPartnerIntakeSource,
	DshPartnerIntakeStage,
	DshPromotionCandidate,
	DshPromotionIntentStatus,
} from './workflow';
export {
	canRenderInClientSurface,
	dshPartnerApprovalLanes,
	dshPartnerIntakeItems,
	dshPartnerIntakeMetrics,
	dshPromotionCandidates,
	getAllApprovalRecords,
	getCatalogQueueRecords,
	getClientVisibleRecords,
	getMarketingQueueRecords,
	getPartnerQueueRecords,
	isCatalogOwnedMedia,
	isClientVisibleStage,
	isLegacyPublishedPreview,
	isPartnerOwnedException,
	moveApprovalRecordToStage,
	resolveNextOwner,
	transitionApprovalStage,
	translateEntityType,
	translateOwner,
	translateStage,
	upsertApprovalRecord,
} from './workflow';

export type {
	MarketingNewsTickerAudience,
	MarketingNewsTickerDeliveryMode,
	MarketingNewsTickerItem,
	MarketingNewsTickerKind,
	MarketingNewsTickerLocale,
	MarketingNewsTickerPreview,
	MarketingNewsTickerPriority,
	MarketingNewsTickerSeverity,
	MarketingNewsTickerSource,
	MarketingNewsTickerStatus,
	MarketingTickerPlan,
	MarketingTickerPlanEntry,
	MarketingTickerPlanLane,
	MarketingTickerPlanReason,
	MarketingTickerPlanState,
} from './news-ticker.preview-store';
export {
	buildMarketingTickerPlan,
	createMarketingTickerDraft,
	getMarketingTickerItems,
	markMarketingTickerDisplayed,
	newsTickerStoreDataContract,
	pauseAllMarketingTickers,
	removeMarketingTickerItem,
	resolveMarketingTickerAudienceLabel,
	resolveMarketingTickerDeliveryLabel,
	resolveMarketingTickerKindLabel,
	resolveMarketingTickerPlanReasonLabel,
	resolveMarketingTickerPreviewForItem,
	resolveMarketingTickerPriorityLabel,
	resolveMarketingTickerSourceLabel,
	resolveMarketingTickerStatusLabel,
	resolveMarketingTickerTargetLabel,
	toggleMarketingTickerPinned,
	toggleMarketingTickerStatus,
	upsertMarketingTickerItem,
} from './news-ticker.preview-store';

// --- DSH Approval Pipeline SSOT v1 ---
// partner-intake-store was consolidated into workflow.ts

export type {
	MediaPolicyKind,
	MediaReviewRecord,
} from './marketing-review.preview-store';
export {
	approveMediaReviewItem,
	getMarketingReviewItems,
	getMediaReviewItem,
	getMediaReviewItems,
	getMediaReviewKpis,
	rejectMediaReviewItem,
	requestMediaFix,
	sendMediaToCatalog,
	upsertMediaReviewItem,
} from './marketing-review.preview-store';
export {
	activateClientVisible,
	adoptCatalogCentral,
	adoptCatalogException,
	catalogAdoptionRecords,
	getCatalogAdoptionItems,
	getClientVisibleItems,
	rejectFromCatalog,
	returnToMarketing,
} from './catalog-adoption.preview-store';
