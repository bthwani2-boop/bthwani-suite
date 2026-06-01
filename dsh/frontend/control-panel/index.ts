export { surfaceMeta as DSH_SURFACE_META } from './surface-meta';
export { surfaceCatalog as DSH_SURFACE_CATALOG } from './surface-catalog';
export { DshControlPanelSurfaceHost } from './DshControlPanelSurfaceHost';
export type { DshControlPanelSurfaceHostProps } from './DshControlPanelSurfaceHost';
export { ControlPanelDshClosureDashboardScreen, ControlPanelDshClosureEvidenceStream } from './dashboard';
export { ControlPanelDshFinanceHubScreen, ControlPanelDshFinanceScreen, ControlPanelDshSettlementScreen, ControlPanelDshCodReconciliationScreen, ControlPanelDshRefundQueueScreen, ControlPanelDshRiskAuditScreen, ControlPanelDshCaptainFinanceScreen, ControlPanelDshStoreDeliveryFinanceScreen } from './finance';
export { ControlPanelDshCatalogScreen, ControlPanelDshCatalogApprovalScreen, ControlPanelDshListingGovernanceScreen, ControlPanelDshCatalogCategoriesScreen } from './catalogs';
export { ControlPanelDshSupportQueueScreen, ControlPanelDshDisputeResolutionScreen, ControlPanelDshSupportHubScreen } from './support';
export { ControlPanelDshPartnerApprovalsScreen, ControlPanelDshPartnerActivationScreen, ControlPanelDshPartnerDocumentReviewScreen } from './partners';
export { ControlPanelDshOperationsScreen, DshOperationsHubSurface, buildOperationsHref, coerceOperationsPanel, normalizeOperationsLocation } from './operations';
export { ControlPanelDshMarketingScreen, ControlPanelDshMarketingApprovalScreen, ControlPanelDshVideoSubmissionsReviewScreen } from './marketing';
export { ControlPanelDshPlatformScreen, DshPlatformVarsWorkspace, DshPlatformAppearanceWorkspace, DshPlatformServicesWorkspace, DshPlatformProvidersWorkspace, DshPlatformRolloutsWorkspace, DshPlatformHealthWorkspace, DshPlatformAuditWorkspace } from './platform';
export { ControlPanelDshAdministrationScreen } from './administration';
export { ControlPanelHrScreen, HR_WORKSPACE_REGISTRY, type HrWorkspaceId, type HrWorkspaceMeta } from './hr';
export {
  DSH_CROSS_SURFACE_CLOSURE_MAP,
  DSH_CONTROL_PANEL_GOVERNANCE_MAP,
  DSH_CONTROL_PANEL_GOVERNANCE_LIST,
  DSH_CONTROL_PANEL_SECTION_IDS,
  ControlPanelDshActionQueue,
  ControlPanelDshDecisionBoard,
  ControlPanelDshWorkspaceFrame,
  getDshControlPanelGovernanceEntry,
  getDshControlPanelGovernanceEntries,
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceSectionsForSurface,
  resolveDshControlPanelSectionLabel,
  type DshControlPanelGovernanceEntry,
  type DshControlPanelSectionId,
} from './shared';
