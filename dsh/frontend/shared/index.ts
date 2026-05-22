// --- Commercial Preview Contract (UI_PREVIEW_ONLY) — unified type contract ---
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
} from './commercial.preview-contract';
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
} from './commercial.preview-contract';

export type {
	MarketingRouteHint,
	MarketingVisibilityApprovalStatus,
	MarketingVisibilityContentType,
	MarketingVisibilityDisplayStatus,
	MarketingVisibilityRecord,
	MarketingVisibilityTargetSurface,
} from './marketing-visibility.contract';
export {
	DSH_LOYALTY_UI_BOUNDARY_NOTE,
	getCampaignVisibilityRecord,
	getHomePromoVisibilityRecord,
	getLoyaltyVisibilityRecord,
	getMarketingVideoVisibilityRecord,
	getPartnerOfferVisibilityRecord,
	isMarketingRenderable,
	marketingVisibilityContractMeta,
	resolveMarketingVisibility,
} from './marketing-visibility.contract';

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
  conflictList,
} from './store-card-commercial-map';

export type {
	DshCatalogApprovalStage,
	DshCatalogDomainId,
	DshCatalogMainCategoryId,
	DshCatalogMeasurementKind,
	DshCatalogMeasurementPolicy,
	DshCatalogNode,
	DshCatalogNodeKind,
	DshCatalogPipelineStep,
	DshCatalogSubcategoryId,
	DshProductFacetId,
	DshInventoryHierarchyFilter,
	DshProductTaxonomyLabels,
} from './catalog';
export {
	DSH_DOMAIN_LABELS,
	DSH_MAIN_CATEGORY_LABELS,
	DSH_PRODUCT_FACET_LABELS,
	DSH_SUBCATEGORY_LABELS,
	DSH_OPERATIONAL_FACETS,
	isDshOperationalFacet,
	dshCatalogMetrics,
	dshCatalogNodes,
	dshCatalogPipeline,
	dshCategoryMeasurementPolicies,
	getDshTaxonomyLabel,
	getDshActiveFilterSummary,
	getDshCatalogDomains,
	getDshMainCategories,
	getDshSubcategories,
	getDshProductFacets,
	resolveDshProductTaxonomy,
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

// --- Shared Media Resolver ---
export { resolveDshImageSource } from './resolve-dsh-image-source';

// --- DSH Flow Registry — Phase 1 Baseline (DSH_PHASE_1_FLOW_REGISTRY-20260521-054141) ---
// Phase 1.1 closure: DSH_PHASE_1_1_REGISTRY_EVIDENCE_CLOSURE-20260521-061309
// Phase 2 closure: DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION-20260521
// Single canonical cross-surface registry: ownership · visibility · escalation · on-demand policy.
// See dsh-flow-registry.ts for full authoring notes and forbidden-action contract.
export type {
  DshSurfaceId,
  DshFlowDomain,
  DshFlowVisibility,
  DshOnDemandPolicy,
  DshFlowRegistryEntry,
	DshFlowClosureActor,
	DshFlowClosureDomain,
	DshFlowClosureEvidenceStatus,
	DshFlowClosureRuntimeBindingStatus,
	DshFlowClosureSummary,
  DshFlowPolicySummary,
  DshFlowRegistryStats,
  DshFlowRegistryValidationResult,
} from './dsh-flow-registry';
export {
  DSH_FLOW_REGISTRY,
	DSH_FLOW_CLOSURE_SUMMARY,
  getDshFlowById,
	getDshFlowClosureSummary,
	getDshFlowClosureSummaryForSurface,
  getDshFlowsForSurface,
  getDshVisibleFlowsForSurface,
  getDshRenderableFlowsForSurface,
  getDshPrimaryFlowsForSurface,
  getDshContextualFlowsForSurface,
  isDshHiddenCompatFlow,
  getDshEscalationFlows,
  getDshEscalationFlowsForSurface,
  getDshFinancePreviewFlows,
  getDshFlowPolicySummary,
  getDshFlowRegistryStats,
  getDshFlowRegistryValidationSummary,
} from './dsh-flow-registry';

// --- DSH Control Panel Governance Map — cross-surface shared owner ---
// Phase 5 closure: DSH_PHASE_5_FINAL_LOGIC_CLOSURE-20260521-071500
// Moved here from dsh/frontend/control-panel/shared/ — mobile surfaces import from here only.
// control-panel/shared/dsh-control-panel-governance.map.ts is now a compat re-export shim.
export type {
  DshControlPanelSectionId,
  DshControlPanelGovernanceEntry,
} from './dsh-governance.map';
export {
  DSH_CONTROL_PANEL_SECTION_IDS,
  DSH_CONTROL_PANEL_GOVERNANCE_MAP,
  DSH_CONTROL_PANEL_GOVERNANCE_LIST,
  getDshControlPanelGovernanceEntry,
  getDshControlPanelGovernanceEntries,
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceSectionsForSurface,
  resolveDshControlPanelSectionLabel,
} from './dsh-governance.map';

// --- DSH Partner Onboarding Journey Map — cross-surface canonical reference ---
// Phase: DSH_TOPIC_1_PARTNER_ONBOARDING_CLOSURE-20260521-182600
export type {
  DshPartnerJourneyStepId,
  DshPartnerJourneyStep,
  DshPartnerLifecycleStage,
  DshPartnerJourneyControlPanelSection,
} from './dsh-partner-onboarding-journey.map';
export {
  DSH_PARTNER_ONBOARDING_JOURNEY,
  getDshPartnerJourneyStep,
  getDshPartnerJourneyStepsForSurface,
  resolveDshPartnerLifecycleStageLabel,
  resolveNextJourneyStepForStage,
  resolveCpSectionForLifecycleStage,
} from './dsh-partner-onboarding-journey.map';

// --- DSH Order Journey Shared Model ---
export type {
	DshOrderJourneyStageId,
	DshOrderJourneyStage,
	DshOrderJourneyActor,
	DshOrderJourneyEvent,
	DshOrderLifecycleStatus,
	DshSmartProximityState,
	DshSmartTrackingSnapshot,
	DshCaptainHeartbeatSnapshot,
	DshCaptainBellEvent,
	DshOperationsDecisionKind,
	DshOperationsDecisionPayload,
	DshOperationsOrderDetail,
	DshPartnerPreparationStage,
	// P0-02 additions
	DshOrderLifecycleActorOwner,
	DshOrderLifecycleWltImplication,
	DshOrderLifecycleDeliveryModeImpact,
	DshOrderLifecycleStateAction,
	DshOrderLifecycleStateMetadata,
  DshOrderInterventionFlowId,
  DshOrderInterventionState,
} from './dsh-order-journey.model';
export {
	DSH_ORDER_JOURNEY_STEPS,
	mapLifecycleToJourneyStage,
	mapOperationsDecisionToLifecycle,
	// P0-02 additions
	DSH_ORDER_LIFECYCLE_STATES,
	getDshLifecycleStateMetadata,
  DSH_ORDER_INTERVENTION_STATES,
  getDshOrderInterventionState,
} from './dsh-order-journey.model';

// --- P0-03: DSH Delivery Mode Model ---
export type {
	DshFulfillmentDeliveryMode,
	DshDeliveryModeCaptainInvolvement,
	DshDeliveryModeTrackingStageFilter,
	DshDeliveryModeDefinition,
} from './dsh-delivery-mode.model';
export {
	DSH_DELIVERY_MODE_DEFINITIONS,
	getDshDeliveryModeDefinition,
	getDshDeliveryModeActorLabel,
	isDshModeDispatchRequired,
	isDshModeCaptainTrackingVisible,
	getDshModeTrackingStageFilter,
	isDshFulfillmentDeliveryMode,
} from './dsh-delivery-mode.model';

// --- P0-04: DSH Partner Activation Model ---
// Cross-surface SSoT for partner activation lifecycle and client visibility.
// Authority: control-panel/partners owns all activation/deactivation decisions.
// app-field: evidence collection only — never activates.
// app-partner: reads readiness status — never self-activates.
// app-client: sees store ONLY when status = 'client_visible'.
export type {
	DshPartnerActivationStatus,
	DshPartnerVisibilityBadge,
	DshPartnerActivationActorSurface,
	DshPartnerReadinessCheckItem,
	DshPartnerActivationStateMetadata,
} from './dsh-partner-activation.model';
export {
	DSH_PARTNER_ACTIVATION_STATES,
	getDshPartnerActivationStateMetadata,
	isDshPartnerClientVisible,
	isDshPartnerActivationComplete,
	getDshPartnerVisibilityBadge,
	getDshPartnerVisibilityBadgeLabel,
	getDshPartnerVisibilityBadgeTone,
	getDshPartnerReadinessChecklist,
	getDshPartnerActivationStatusLabel,
} from './dsh-partner-activation.model';

// --- P0-05: DSH Product Identity Model ---
// SSoT for product approval pipeline, barcode scan states, publishing gate
// prerequisites, and client visibility rules.
// Authority: control-panel/catalogs owns all approval and publishing decisions.
// app-partner: submits and edits local overrides only.
// app-field: submits initial entries and evidence — never approves or publishes.
// app-client: sees ONLY products where approvalStatus = 'client_visible'.
export type {
	DshProductIdentityApprovalStatus,
	DshProductPublishingStatus,
	DshProductClientVisibilityStatus,
	DshBarcodeSearchState,
	DshProductCategoryMappingStatus,
	DshProductDuplicateStatus,
	DshProductPublishingPrerequisite,
	DshProductIdentityRecord,
	DshProductApprovalStateMetadata,
} from './dsh-product-identity.model';
export {
	DSH_PRODUCT_APPROVAL_PIPELINE,
	getDshProductApprovalStateMetadata,
	isDshProductClientVisible,
	isDshProductPublishingBlocked,
	getDshProductPublishingPrerequisites,
	getDshBarcodeSearchStateLabel,
	getDshProductApprovalStatusLabel,
	getDshProductApprovalStatusTone,
} from './dsh-product-identity.model';

// --- P0-08: DSH Signal Layer Model ---
// Centralized signal type contract for all DSH actor surfaces.
// On-demand retrieval: lists show summaries only; detail opens on explicit action.
// Every signal has a routeId — no orphan signals without destination.
// WLT finance signals (refund_pending_wlt, refund_completed_wlt, settlement_ready_wlt) are read-only display.
export type {
  DshSignalEventKind,
  DshSignalRecipientSurface,
  DshSignalRecipientRole,
  DshSignalEntityType,
  DshSignalPriority,
  DshSignalAction,
  DshSignalOnDemandPolicy,
  DshSignalEvent,
  DshSignalSummary,
  DshSignalActorRoute,
} from './dsh-signal-layer.model';
export {
  DSH_SIGNAL_ACTOR_ROUTES,
  DSH_SIGNAL_PREVIEW_EVENTS,
  getDshSignalEventLabel,
  getDshSignalEventTone,
  getDshSignalActorRoute,
  getDshSignalRouteForSurface,
  getDshSignalSummaries,
  getDshSignalDetail,
  getDshSignalUnreadCount,
  isDshSignalAuditRequired,
} from './dsh-signal-layer.model';

// --- P0-06: Support Ticket Model ---
// Cross-surface SSoT for support ticket lifecycle, message timelines, SLA classification,
// and escalation routing.
// Authority: control-panel/support owns all resolution and escalation decisions.
// app-client: support visible inside order context only.
// app-partner: support linked to order / catalog / handoff context only.
// app-captain: handoff / delivery / PoD context only.
// WLT boundary: financial-impact tickets display read-only preview tags — no DSH mutation.
export type {
	DshSupportTicketStatus,
	DshSupportTicketActorKind,
	DshSupportTicketMessage,
	DshSupportTicket,
} from './operations-support.preview';
export {
	getDshSupportTicketStatusLabel,
	getDshSupportTicketStatusTone,
	DSH_DEMO_SUPPORT_TICKETS,
	getDshSupportTicketById,
} from './operations-support.preview';

// --- P0-09: DSH Role & Permission Model ---
// UI-only RBAC preview — no runtime auth, no backend RBAC binding.
// Covers 10 sensitive decision points in DSH control-panel.
// WLT boundary: finance mutations always forbidden inside DSH.
// Authority: control-panel/partners owns activation/deactivation;
//            control-panel/catalogs owns approval/publishing;
//            control-panel/operations owns dispatch/SLA/escalation;
//            control-panel/finance reads only — WLT owns all mutations.
export type {
  DshRoleId,
  DshPermissionSection,
  DshSensitiveActionId,
  DshRolePermissionEntry,
  DshAuditEntryDecision,
  DshAuditEntry,
  DshMakerCheckerMatrixEntry,
  DshReasonEvidencePolicy,
} from './dsh-role-permission.model';
export {
  DSH_ROLE_PERMISSIONS,
  DSH_AUDIT_PREVIEW_ENTRIES,
  DSH_MAKER_CHECKER_MATRIX,
  DSH_REASON_EVIDENCE_POLICY,
  getDshRoleCanPerform,
  getDshRolePermission,
  getDshRollbackAllowed,
  getDshSectionAuditPolicy,
  getDshRoleArabicName,
  getDshAuditEntryById,
} from './dsh-role-permission.model';

export type {
  DshGlobalControlLink,
  DshAssistedOrderIdentityStatus,
  DshAssistedOrderStage,
  DshAssistedOrderPreview,
} from './dsh-assisted-order.preview';
export {
  DSH_ASSISTED_ORDER_PREVIEW,
  getDshAssistedOrderById,
} from './dsh-assisted-order.preview';

export type {
  DshCustomer360VerificationStatus,
  DshCustomer360Record,
} from './dsh-customer-360.preview';
export {
  DSH_CUSTOMER_360_PREVIEW,
  getDshCustomer360Record,
  getDshCustomer360SectionOwnerLabel,
} from './dsh-customer-360.preview';

export type {
  DshCallIntakeVerificationStep,
  DshCallIntakePreview,
} from './dsh-call-intake.preview';
export {
  DSH_CALL_INTAKE_PREVIEW,
  getDshCallIntakePreview,
} from './dsh-call-intake.preview';

export type {
  DshOrderRescueSeverity,
  DshOrderRescueCase,
} from './dsh-order-rescue.preview';
export {
  DSH_ORDER_RESCUE_PREVIEW,
  getDshOrderRescueCase,
} from './dsh-order-rescue.preview';

export type {
  DshOpsInterventionPlaybook,
} from './dsh-ops-intervention-playbook.preview';
export {
  DSH_OPS_INTERVENTION_PLAYBOOKS,
  getDshOpsInterventionPlaybook,
} from './dsh-ops-intervention-playbook.preview';
