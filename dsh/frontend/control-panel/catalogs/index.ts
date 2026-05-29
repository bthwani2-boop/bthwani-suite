export { dshCatalogMetrics, dshCatalogCategories, dshCatalogProducts } from './catalogs.data';
export type {
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification,
  CatalogProductMaster,
} from './catalogs.data';
export { ControlPanelDshCatalogScreen } from './catalogs.screen';
export { ControlPanelDshCatalogApprovalScreen, ControlPanelDshListingGovernanceScreen } from './CatalogGovernanceScreens';
export { CategoriesScreen, CategoriesScreen as ControlPanelDshCatalogCategoriesScreen } from './catalogs.categories';
export { default } from './CatalogGovernanceScreens';

export { ItemApprovalScreen } from './catalogs.approvals';
export type { ItemApprovalScreenProps } from './catalogs.approvals';

export { ListingGovernanceScreen } from './catalogs.listing-governance';
export type { ListingGovernanceScreenProps } from './catalogs.listing-governance';

// CAT-S01: Item detail workspace — single product detail-on-open
export { CatalogItemDetailWorkspace } from './drawers/item-detail.drawer';
export type { CatalogItemDetailWorkspaceProps } from './drawers/item-detail.drawer';

// CAT-S03: Identity governance workspace — SKU/GTIN/barcode (replaces mapping/gtin + approvals/barcode subtabs)
export { CatalogIdentityGovernanceWorkspace } from './drawers/identity-governance.drawer';
export type { CatalogIdentityGovernanceWorkspaceProps } from './drawers/identity-governance.drawer';

// CAT-S02: Duplicate resolution workspace — pair-by-pair merge/reject/keep (replaces mapping/duplicates subtab)
export { CatalogDuplicateResolutionWorkspace } from './drawers/duplicate-resolution.drawer';
export type { CatalogDuplicateResolutionWorkspaceProps, DuplicatePair } from './drawers/duplicate-resolution.drawer';

// CAT-S04: Visibility policy workspace — client visibility gate (replaces mapping/visibility-policy + publishing subtabs)
export { CatalogVisibilityPolicyWorkspace } from './drawers/visibility-policy.drawer';
export type { CatalogVisibilityPolicyWorkspaceProps } from './drawers/visibility-policy.drawer';

// CAT-S07: Partner handoff workspace — bridge from partners/app-partner into catalog onboarding
export { CatalogPartnerHandoffWorkspace } from './drawers/partner-handoff.drawer';
export type { CatalogPartnerHandoffWorkspaceProps } from './drawers/partner-handoff.drawer';

// CAT-S06: Media governance workspace — media ownership separation (replaces mapping/media + approvals/media subtabs)
export { CatalogMediaGovernanceWorkspace } from './drawers/media-governance.drawer';
export type { CatalogMediaGovernanceWorkspaceProps } from './drawers/media-governance.drawer';

// ── Phase 2 Workspaces — operational closure ──────────────────────────────────

// Shared workspace types — router-ready state model
export type {
  CatalogWorkspaceId,
  CatalogWorkspaceState,
  CatalogPreviewProposal,
  CatalogPreviewProposalType,
  CatalogPreviewProposalStatus,
  CatalogPreviewProposalOwner,
} from './catalogs.model';
export { CATALOG_WORKSPACE_OWNERS } from './catalogs.model';

// Workspace orchestration router — extracted from monolith
// UI_PREVIEW_ONLY / router-ready
export { CatalogWorkspaceRouter } from './drawers/catalog-workspace-router';
export type { CatalogWorkspaceRouterProps } from './drawers/catalog-workspace-router';

// CAT-S08: Quick entry drafts — replaces inline add-product modal (no local product mutation)
// UI_PREVIEW_ONLY: emits CatalogPreviewProposal — not yet bound to API
export { CatalogQuickEntryDraftWorkspace } from './drawers/quick-entry-draft.drawer';
export type { CatalogQuickEntryDraftWorkspaceProps } from './drawers/quick-entry-draft.drawer';

// CAT-S09: Taxonomy governance — category tree governance (extracted from monolith)
// UI_PREVIEW_ONLY: all actions produce proposals — not yet bound to API
export { CatalogTaxonomyGovernanceWorkspace } from './drawers/taxonomy-governance.drawer';
export type { CatalogTaxonomyGovernanceWorkspaceProps } from './drawers/taxonomy-governance.drawer';

// CAT-S10: Bulk operations — controlled batch actions with selectedProductIds
// Carbon batch action principle: disabled when no selection, rollback note per action
// UI_PREVIEW_ONLY: emits CatalogPreviewProposal — not yet bound to API
export { CatalogBulkOperationsWorkspace } from './drawers/bulk-operations.drawer';
export type { CatalogBulkOperationsWorkspaceProps } from './drawers/bulk-operations.drawer';

// CAT-S11: Audit trail — derivation summary + detail-on-open
// UI_PREVIEW_ONLY: derived from product state — not yet bound to audit API
export { CatalogAuditTrailWorkspace } from './drawers/audit-trail.drawer';
export type { CatalogAuditTrailWorkspaceProps } from './drawers/audit-trail.drawer';

// CAT-S12: Publication readiness matrix — full gate before client-facing publish
// Uses shared resolver mapApprovalStageToPartnerActivationStatus (no local visibility mapping)
// UI_PREVIEW_ONLY: derived from product state — not yet bound to readiness API
export { CatalogPublicationReadinessMatrix } from './drawers/publication-readiness.drawer';
export type { CatalogPublicationReadinessMatrixProps } from './drawers/publication-readiness.drawer';

// CAT-S13: Adoption queue — final catalog adoption step (marketing-approved → catalog-adopted → client-visible)
// The ONLY workspace that controls final client-visibility activation
// UI_PREVIEW_ONLY: emits CatalogPreviewProposal — not yet bound to adoption API
export { CatalogAdoptionQueueWorkspace } from './drawers/adoption-queue.drawer';
export type { CatalogAdoptionQueueWorkspaceProps } from './drawers/adoption-queue.drawer';
