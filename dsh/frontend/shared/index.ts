// --- Commercial Preview Contract (SCAFFOLD — WLT binding pending J-010) ---
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
  resolveApprovalStageMeta,
  resolveNextOwner,
  transitionApprovalStage,
  translateEntityType,
  translateOwner,
  translateStage,
  upsertApprovalRecord,
  getDynamicUiAudits,
  type ApprovalStageTone,
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
  getDshFinanceImpactFlows,
  getDshFlowPolicySummary,
  getDshFlowRegistryStats,
  getDshFlowRegistryValidationSummary,
  resolveDshOnDemandPolicyLabel,
} from './dsh-flow-registry';

export type {
  DshAnyOperationalRecord,
  DshCaptainAssignment,
  DshCaptainAssignmentStatus,
  DshCatalogOperationalItem,
  DshCatalogReadinessStatus,
  DshCodCollectionEvent,
  DshCodCollectionStatus,
  DshControlPanelOperationRecord,
  DshControlPanelOperationalWorkspace,
  DshControlPanelSideEffectClassification,
  DshDeliveryProof,
  DshDeliveryProofStatus,
  DshDeliveryTrip,
  DshDeliveryTripStatus,
  DshOperationalActionPolicy,
  DshOperationalAuditPolicy,
  DshOperationalAuditState,
  DshOperationalBaseRecord,
  DshOperationalBoundaryPolicy,
  DshOperationalClosureStatus,
  DshOperationalDataClassification,
  DshOperationalEntityId,
  DshOperationalEntityKind,
  DshOperationalException,
  DshOperationalExceptionStatus,
  DshOperationalExceptionType,
  DshOperationalProofRequirement,
  DshOperationalRollbackHint,
  DshOperationalWltImpact,
  DshOrderOperationalRecord,
  DshOrderOperationalStatus,
  DshPartnerStoreOnboardingStatus,
  DshPartnerStoreOperationalRecord,
  DshPickupHandoffProof,
  DshPickupHandoffStatus,
  DshSettlementInputEvent,
  DshSettlementInputEventType,
  DshSettlementInputStatus,
  DshStorePreparationRecord,
  DshStorePreparationStatus,
  DshSupportEscalationLink,
  DshSupportEscalationStatus,
  DshWltOwnershipBoundary,
} from './dsh-operational.contract';
export { dshOperationalContractMeta } from './dsh-operational.contract';

export type {
  DshOperationalLifecycleSource,
  DshOperationalRegistryEntry,
} from './dsh-operational-registry';
export {
  DSH_OPERATIONAL_REGISTRY,
  assertDshDoesNotOwnFinancialMutation,
  dshOperationalRegistryMeta,
  getDshOperationalEntriesBySurface,
  getDshOperationalEntriesByWorkspace,
  getDshOperationalEntriesWithWltImpact,
  getDshOperationalEntryById,
  getDshOperationalRegistry,
} from './dsh-operational-registry';

export type {
  DshControlPanelOperationsSummary,
  DshOperationalSurfaceSummary,
} from './dsh-operational-summary-adapter';
export {
  buildDshCodQueueSummary,
  buildDshControlPanelOperationsSummary,
  buildDshExceptionQueueSummary,
  buildDshOperationalSummaryForSurface,
  buildDshPodReviewSummary,
  buildDshSettlementInputSummary,
  buildDshTripSummaryForOrder,
  dshOperationalSummaryAdapterMeta,
  getDshOperationalSummaryRegistryEntry,
} from './dsh-operational-summary-adapter';

export type {
  DshOperationalRuntimeBindingStatus,
  DshOperationalScreenBinding,
} from './dsh-operational-surface-binding';
export {
  DSH_OPERATIONAL_SCREEN_BINDINGS,
  dshOperationalSurfaceBindingMeta,
  getDshOperationalSummariesForScreen,
  getDshOperationalScreenBindingByScreenId,
  getDshOperationalScreenBindings,
  getDshOperationalScreenBindingsByRegistryEntry,
  getDshOperationalScreenBindingsBySurface,
} from './dsh-operational-surface-binding';

export type {
  DshOperationsRoomWorkspace,
  DshOperationsRoomWorkspaceStatus,
} from './dsh-control-panel-operations-room';
export {
  DSH_CONTROL_PANEL_OPERATIONS_ROOM,
  dshControlPanelOperationsRoomMeta,
  getDshControlPanelOperationsRoom,
  getDshOperationsRoomWorkspaceById,
  getDshOperationsRoomWorkspacesByGroup,
  getDshOperationsRoomWorkspacesForRegistryEntry,
} from './dsh-control-panel-operations-room';

export type {
  DshWltSettlementBridgeRule,
  DshWltSettlementInputCandidate,
  DshWltSettlementInputReadiness,
  DshWltSettlementInputValidationResult,
  DshWltSettlementSourceEntity,
  DshWltTargetCapability,
} from './dsh-wlt-settlement-bridge.contract';
export {
  DSH_WLT_SETTLEMENT_BRIDGE_RULES,
  assertNoDshFinancialSettlementOwnership,
  buildWltSettlementInputCandidate,
  buildWltSettlementInputCandidateFromEvent,
  classifyWltTargetCapability,
  dshWltSettlementBridgeContractMeta,
  getDshWltSettlementBridgeRule,
  getDshWltSettlementBridgeRules,
  validateDshSettlementInputReadiness,
} from './dsh-wlt-settlement-bridge.contract';

export type {
  AwnakStage,
  CartItem,
  DshAssistedOrderCartItem,
  DshAssistedOrderCartItemStatus,
  DshAssistedOrderDeliveryModeOption,
  DshAssistedOrderIdentityStatus,
  DshAssistedOrder,
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
  DshLookupInput,
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
  DshPlaceholderStatus,
  DshReadOnlyFinanceVisibility,
  DshRouteHintedAction,
  DshSignalRoute,
  DshVerificationStatus,
  DshVerificationStep,
  DshWltFinanceAlert,
  RecommendationProduct,
  SheinProxyStage,
} from './dsh-order.contract';
export {
  AWNAK_STAGE_LABELS,
  buildDshAssistedOrderDeliveryModeOptions,
  buildDshAssistedOrderDeliveryModeSummary,
  buildDshAssistedOrderLookupInputs,
  buildDshSignalRoute,
  DISPATCH_LIFECYCLE_STATE_MAP,
  EXCEPTION_TICKET_MAP,
  ORDER_RESCUE_ACTIONS,
  ORDER_RESCUE_OWNERS,
  ORDER_RESCUE_REASONS,
  SHEIN_PROXY_STAGE_LABELS,
  shouldShowDshPartnerOrderConversation,
} from './dsh-order.contract';

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
  DSH_SIGNAL_EVENTS,
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
  DSH_AUDIT_ENTRIES,
  DSH_MAKER_CHECKER_MATRIX,
  DSH_REASON_EVIDENCE_POLICY,
  getDshRoleCanPerform,
  getDshRolePermission,
  getDshRollbackAllowed,
  getDshSectionAuditPolicy,
  getDshRoleArabicName,
  getDshAuditEntryById,
  getDshAuditEntries,
  resolveAuditEntry,
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
  DshCreateFieldVisitRequest,
  DshCreateFieldVisitResponse,
  DshFieldVisitClient,
  DshFieldVisitError,
} from './dsh-field-visit-client';
export {
  createDshFieldVisitHttpClient,
  isDshFieldVisitOfflineError,
  resolveDshFieldVisitBaseUrl,
} from './dsh-field-visit-client';

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
  resolveColorToken,
  dshColorResolverMeta,
} from './dsh-color-resolver';

// --- Catalog Central Adapter (DEV_ONLY offline fallback) ---
// Maps archived seed catalog data to surface view models.
// Surfaces consume through this adapter — they do NOT own catalog identity.
// Owner: dsh/frontend/shared (adapter layer)
// Runtime catalog identity and media must come from DSH API/runtime media assets.
export type {
  CatalogPartnerInventoryItem,
  PartnerInventoryDetail,
} from './catalog-central-adapter';
export {
  buildCentralPartnerInventoryItems,
  CENTRAL_PRODUCT_DETAIL_LOOKUP,
} from './catalog-central-adapter';

// --- Checkout client (J-003A / 003B / 003E) ---
export type {
  DshCheckoutFetchFn,
  DshCheckoutAuthContext,
  DshCheckoutOfflineError,
  DshCheckoutHttpError,
  DshCheckoutError,
  DshCartServiceabilityResponse,
  DshCheckoutIntentItem,
  DshCheckoutIntentRequest,
  DshCheckoutIntentResponse,
  DshCancelCheckoutIntentResponse,
  DshCheckoutClient,
} from './dsh-checkout-client';
export {
  isDshCheckoutOfflineError,
  createDshCheckoutHttpClient,
} from './dsh-checkout-client';

// --- WLT Payment Session client (DSH → WLT, J-003C LIVE) ---
export type {
  WltPaymentSessionFetchFn,
  WltPaymentSessionAuth,
  DshToWltCreatePaymentSessionRequest,
  WltPaymentSessionResponse,
  WltPaymentSessionOfflineError,
  WltPaymentSessionHttpError,
  WltPaymentSessionError,
  WltPaymentSessionClient,
} from './dsh-wlt-payment-session.client';
export { createWltPaymentSessionClient } from './dsh-wlt-payment-session.client';

// --- Order Lifecycle client ---
export type {
  DshOrderRecord,
  DshOrderItemRecord,
  DshOrderStatusEventRecord,
  DshSupportEscalationRecord,
  DshOrderItemInput,
  DshCreateOrderRequest,
  DshCreateOrderResponse,
  DshUpdateOrderStatusRequest,
  DshCreateSupportEscalationRequest,
  DshOrderDetailsResponse,
  DshListOrdersQuery,
  DshListOrdersResponse,
  DshOrderLifecycleClient,
} from './dsh-order-lifecycle-client';
export {
  isDshOrderApiOfflineError,
  resolveDshOrderApiBaseUrl,
  createDshOrderLifecycleHttpClient,
} from './dsh-order-lifecycle-client';

export type {
  DshCreateFieldStoreRequest,
  DshCreateFieldStoreResponse,
  DshFieldStoreOnboardingClient,
  DshFieldStoreOnboardingError,
} from './dsh-field-store-onboarding-client';
export {
  createDshFieldStoreOnboardingHttpClient,
  isDshFieldStoreOnboardingOfflineError,
  resolveDshFieldStoreOnboardingBaseUrl,
} from './dsh-field-store-onboarding-client';

export type {
  DshFieldDocumentKind,
  DshFieldDocumentStatus,
  DshCreateFieldDocumentRequest,
  DshFieldDocumentRecord,
  DshFieldDocumentClient,
  DshFieldDocumentError,
} from './dsh-field-document-client';
export {
  createDshFieldDocumentHttpClient,
  isDshFieldDocumentOfflineError,
  resolveDshFieldDocumentBaseUrl,
} from './dsh-field-document-client';


export type {
  CreateFieldReadinessEscalationRequest,
  FieldReadinessEscalationRecord,
  UpdateFieldReadinessEscalationRequest,
  ListFieldReadinessEscalationsResponse,
  CreateFieldReadinessApprovalRequest,
  FieldReadinessApprovalRecord,
  DshFieldReadinessClient,
} from './dsh-field-readiness-client';
export {
  resolveDshFieldReadinessBaseUrl,
  createDshFieldReadinessHttpClient,
} from './dsh-field-readiness-client';

// --- Operations Runtime Adapter ---
export type {
  DshRuntimeOrderRow,
  DshRuntimeOrdersResult,
} from './dsh-operational-runtime-adapter';
export {
  dshOperationalRuntimeAdapterMeta,
  fetchDshRuntimeOrders,
  isDshRuntimeAvailable,
} from './dsh-operational-runtime-adapter';

// --- Platform Vars Infrastructure (DSH-SLICE-008A) ---
export type { PlatformVarsConfig } from './platform/PlatformVarsProvider';
export {
  PlatformVarsProvider,
  usePlatformVars,
  PlatformVarsRegistry,
} from './platform/PlatformVarsProvider';

// --- Feature Flags & Rollout (DSH-SLICE-008B) ---
export type { FeatureFlagsConfig } from './platform/FeatureFlagProvider';
export {
  FeatureFlagProvider,
  useFeatureFlag,
  FeatureFlagsRegistry,
} from './platform/FeatureFlagProvider';

// --- DEV Fixture Isolation Guard (J-007) ---
export type { FixtureEvidenceEntry } from './dev-fixtures-isolation-guard';
export {
  DSH_FIXTURE_EVIDENCE,
  guardDevFixture,
  getFixtureEvidenceSummary,
} from './dev-fixtures-isolation-guard';

// --- Notifications Client (J-013) ---
export type {
  DshNotificationRecord,
  DshNotificationsListResponse,
  DshNotificationsQuery,
  DshNotificationsClientConfig,
} from './dsh-notifications-client';
export {
  listNotifications,
  markNotificationRead,
} from './dsh-notifications-client';

// --- Auth Client (J-012) ---
export type {
  DshAuthActorRole,
  DshAuthState,
  DshAuthSessionResponse,
  DshAuthSurfacePermissions,
  DshAuthPermissionsResponse,
  DshAuthClientConfig,
} from './dsh-auth-client';
export {
  verifyAuthSession,
  getAuthPermissions,
  resolveDshAuthBaseUrl,
} from './dsh-auth-client';
