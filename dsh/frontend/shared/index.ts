// --- Commercial Preview Contract (UI_PREVIEW_ONLY) ---
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
  DshCatalogDomainId,
  DshCatalogMainCategoryId,
  DshCatalogMeasurementKind,
  DshCatalogMeasurementPolicy,
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

export { resolveDshImageSource } from './resolve-dsh-image-source';

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

export type {
  AwnakStage,
  CartItem,
  DshAssistedOrderCartItem,
  DshAssistedOrderCartItemStatus,
  DshAssistedOrderDeliveryModeOption,
  DshAssistedOrderIdentityStatus,
  DshAssistedOrderPreview,
  DshAssistedOrderStage,
  DshCaptainOrderAction,
  DshCaptainOrderBellItem,
  DshCaptainOrderId,
  DshCaptainOrderMessage,
  DshCaptainOrderMode,
  DshCaptainOrderProofStatus,
  DshCaptainOrdersScreenState,
  DshCaptainOrderServiceType,
  DshCaptainOrderStage,
  DshGlobalControlLink,
  DshLookupFieldId,
  DshLookupInputPreview,
  DshOpsMonitoringItem,
  DshOrderRescueCase,
  DshOrderRescueNextActionId,
  DshOrderRescueOwner,
  DshOrderRescueReason,
  DshOrderRescueSeverity,
  DshPartnerOrderAlertId,
  DshPartnerOrderAlertItem,
  DshPartnerOrderAlertStatus,
  DshPartnerOrderConversationMessage,
  DshPartnerOrderConversationMode,
  DshPartnerOrderConversationVisibility,
  DshPreviewPlaceholderStatus,
  DshReadOnlyFinanceVisibility,
  DshRouteHintedAction,
  DshSignalRoutePreview,
  DshVerificationStatus,
  DshVerificationStepPreview,
  DshWltFinanceAlert,
  RecommendationProduct,
  SheinProxyStage,
} from './dsh-order-preview.contract';
export {
  AWNAK_STAGE_LABELS,
  buildDshAssistedOrderDeliveryModeOptions,
  buildDshAssistedOrderDeliveryModeSummary,
  buildDshAssistedOrderLookupInputs,
  buildDshSignalRoutePreview,
  DISPATCH_LIFECYCLE_STATE_MAP,
  EXCEPTION_TICKET_MAP,
  ORDER_RESCUE_ACTIONS,
  ORDER_RESCUE_OWNERS,
  ORDER_RESCUE_REASONS,
  SHEIN_PROXY_STAGE_LABELS,
  shouldShowDshPartnerOrderConversation,
} from './dsh-order-preview.contract';

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
  DSH_ORDER_LIFECYCLE_STATES,
  getDshLifecycleStateMetadata,
  DSH_ORDER_INTERVENTION_STATES,
  getDshOrderInterventionState,
} from './dsh-order-journey.model';

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

export type { DshServiceId, DiscoveryFilter } from './dsh-discovery.contract';
export { dshDiscoveryContractMeta } from './dsh-discovery.contract';

export type {
  DshFieldStoreVisitErrors,
  DshFieldStoreVisitState,
  DshFieldStoreVisitValues,
  DshFieldVisitEvidenceItem,
} from './dsh-field-visit.contract';
export { dshFieldVisitContractMeta } from './dsh-field-visit.contract';

export type {
  AppearanceStatus,
  AppearanceScope,
  AppearanceRisk,
  AppearanceOwner,
  AppearanceRecord,
  ProviderCategory,
  ProviderEnvironment,
  ProviderStatus,
  ProviderOwner,
  ProviderRecord,
  ServiceStatus,
  ServiceClientVisibility,
  ServiceScope,
  ServiceOwner,
  ServiceRisk,
  ServiceRecord,
  DshPlatformVarOwner,
  DshPlatformVarStatus,
  DshPlatformVarScope,
  DshPlatformVarRisk,
  DshPlatformVarRecord,
  DshPlatformProviderControlRecord,
  DshPlatformScopeLayer,
  DshPlatformSimulationScenario,
  DshPlatformAuditEntry,
} from './dsh-cp-platform.contract';
export { dshCpPlatformContractMeta } from './dsh-cp-platform.contract';

export type { DshFulfillmentOperationalMode, DshOperationsOrderRow } from './dsh-cp-operations.contract';
export { dshCpOperationsContractMeta } from './dsh-cp-operations.contract';

export type {
  AdminRoleId,
  PlatformPermissionId,
  AdminUserStatus,
  AdminRole,
  MockAdminUser,
  PlatformPermission,
} from './dsh-cp-administration.contract';
export { dshCpAdministrationContractMeta } from './dsh-cp-administration.contract';

export type {
  StoreDeliveryModeEntry,
} from './dsh-store-builders';
export {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshStoreBuildersContractMeta,
} from './dsh-store-builders';

export {
  resolvePreviewColor,
  dshPreviewColorContractMeta,
} from './dsh-preview-color';

// --- Catalog Central Adapter (UI_PREVIEW_ONLY) ---
// Maps central data (dsh/frontend/data) to surface view models.
// Surfaces consume through this adapter — they do NOT own catalog identity.
// Owner: dsh/frontend/shared (adapter layer)
// Central data: dsh/frontend/data/products.preview-data.ts, categories.preview-data.ts
// Media: dsh/frontend/media-fixtures (resolved via resolve-dsh-image-source.ts)
export type {
  CatalogPartnerInventoryItem,
  PartnerInventoryDetail,
} from './catalog-central-adapter';
export {
  buildCentralPartnerInventoryItems,
  CENTRAL_PRODUCT_DETAIL_LOOKUP,
} from './catalog-central-adapter';
