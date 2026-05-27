export { dshCatalogMetrics, dshCatalogCategories, dshCatalogProducts } from './catalog';
export type {
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification,
  CatalogProductMaster,
} from './catalog';
export { ControlPanelDshCatalogScreen } from './ControlPanelDshCatalogScreen';
export { ControlPanelDshCatalogApprovalScreen, ControlPanelDshListingGovernanceScreen } from './CatalogGovernanceScreens';
export { ControlPanelDshCatalogCategoriesScreen } from './ControlPanelDshCatalogCategoriesScreen';
export { default } from './CatalogGovernanceScreens';

// ML-053: Item approval section — UI_PREVIEW_ONLY flow implemented (catalog approval API not yet bound)
export { ItemApprovalSection } from './ItemApprovalSection';
export type { ItemApprovalSectionProps } from './ItemApprovalSection';

// ML-054: Catalog publishing gate section — UI_PREVIEW_ONLY flow implemented (catalog publish API not yet bound)
export { CatalogPublishingGateSection } from './CatalogPublishingGateSection';
export type { CatalogPublishingGateSectionProps } from './CatalogPublishingGateSection';

// CAT-S01: Item detail workspace — single product detail-on-open
export { CatalogItemDetailWorkspace } from './CatalogItemDetailWorkspace';
export type { CatalogItemDetailWorkspaceProps } from './CatalogItemDetailWorkspace';

// CAT-S03: Identity governance workspace — SKU/GTIN/barcode (replaces mapping/gtin + approvals/barcode subtabs)
export { CatalogIdentityGovernanceWorkspace } from './CatalogIdentityGovernanceWorkspace';
export type { CatalogIdentityGovernanceWorkspaceProps } from './CatalogIdentityGovernanceWorkspace';

// CAT-S02: Duplicate resolution workspace — pair-by-pair merge/reject/keep (replaces mapping/duplicates subtab)
export { CatalogDuplicateResolutionWorkspace } from './CatalogDuplicateResolutionWorkspace';
export type { CatalogDuplicateResolutionWorkspaceProps, DuplicatePair } from './CatalogDuplicateResolutionWorkspace';

// CAT-S04: Visibility policy workspace — client visibility gate (replaces mapping/visibility-policy + publishing subtabs)
export { CatalogVisibilityPolicyWorkspace } from './CatalogVisibilityPolicyWorkspace';
export type { CatalogVisibilityPolicyWorkspaceProps } from './CatalogVisibilityPolicyWorkspace';

// CAT-S07: Partner handoff workspace — bridge from partners/app-partner into catalog onboarding
export { CatalogPartnerHandoffWorkspace } from './CatalogPartnerHandoffWorkspace';
export type { CatalogPartnerHandoffWorkspaceProps } from './CatalogPartnerHandoffWorkspace';

// CAT-S06: Media governance workspace — media ownership separation (replaces mapping/media + approvals/media subtabs)
export { CatalogMediaGovernanceWorkspace } from './CatalogMediaGovernanceWorkspace';
export type { CatalogMediaGovernanceWorkspaceProps } from './CatalogMediaGovernanceWorkspace';

// ── Phase 2 Workspaces — operational closure ──────────────────────────────────

// Shared workspace types — router-ready state model
export type {
  CatalogWorkspaceId,
  CatalogWorkspaceState,
  CatalogPreviewProposal,
  CatalogPreviewProposalType,
  CatalogPreviewProposalStatus,
  CatalogPreviewProposalOwner,
} from './catalog-workspace.types';
export { CATALOG_WORKSPACE_OWNERS } from './catalog-workspace.types';

// Workspace orchestration router — extracted from monolith
// UI_PREVIEW_ONLY / router-ready
export { CatalogWorkspaceRouter } from './CatalogWorkspaceRouter';
export type { CatalogWorkspaceRouterProps } from './CatalogWorkspaceRouter';

// CAT-S08: Quick entry drafts — replaces inline add-product modal (no local product mutation)
// UI_PREVIEW_ONLY: emits CatalogPreviewProposal — not yet bound to API
export { CatalogQuickEntryDraftWorkspace } from './CatalogQuickEntryDraftWorkspace';
export type { CatalogQuickEntryDraftWorkspaceProps } from './CatalogQuickEntryDraftWorkspace';

// CAT-S09: Taxonomy governance — category tree governance (extracted from monolith)
// UI_PREVIEW_ONLY: all actions produce proposals — not yet bound to API
export { CatalogTaxonomyGovernanceWorkspace } from './CatalogTaxonomyGovernanceWorkspace';
export type { CatalogTaxonomyGovernanceWorkspaceProps } from './CatalogTaxonomyGovernanceWorkspace';

// CAT-S10: Bulk operations — controlled batch actions with selectedProductIds
// Carbon batch action principle: disabled when no selection, rollback note per action
// UI_PREVIEW_ONLY: emits CatalogPreviewProposal — not yet bound to API
export { CatalogBulkOperationsWorkspace } from './CatalogBulkOperationsWorkspace';
export type { CatalogBulkOperationsWorkspaceProps } from './CatalogBulkOperationsWorkspace';

// CAT-S11: Audit trail — derivation summary + detail-on-open
// UI_PREVIEW_ONLY: derived from product state — not yet bound to audit API
export { CatalogAuditTrailWorkspace } from './CatalogAuditTrailWorkspace';
export type { CatalogAuditTrailWorkspaceProps } from './CatalogAuditTrailWorkspace';

// CAT-S12: Publication readiness matrix — full gate before client-facing publish
// Uses shared resolver mapApprovalStageToPartnerActivationStatus (no local visibility mapping)
// UI_PREVIEW_ONLY: derived from product state — not yet bound to readiness API
export { CatalogPublicationReadinessMatrix } from './CatalogPublicationReadinessMatrix';
export type { CatalogPublicationReadinessMatrixProps } from './CatalogPublicationReadinessMatrix';
