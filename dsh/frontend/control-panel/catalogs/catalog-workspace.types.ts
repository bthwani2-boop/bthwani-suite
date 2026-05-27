/**
 * Catalog Workspace Types — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * router-ready: state model mirrors future deep-link params
 * Not URL binding yet — internal state only in this iteration.
 *
 * CatalogWorkspaceId enumerates all catalog operational workspaces.
 * CatalogWorkspaceState captures routing context per workspace open.
 * CatalogPreviewProposal replaces local runtime-like mutations; every
 *   create/edit/barcode/visibility operation that would need an API
 *   emits a proposal record instead of modifying canonical data.
 */

// ── Workspace IDs ─────────────────────────────────────────────────────────────

export type CatalogWorkspaceId =
  | 'overview'
  | 'item-detail'
  | 'identity-governance'
  | 'duplicate-resolution'
  | 'visibility-policy'
  | 'partner-handoff'
  | 'media-governance'
  | 'quick-entry-drafts'
  | 'taxonomy-governance'
  | 'bulk-operations'
  | 'audit-trail'
  | 'publication-readiness';

// ── Workspace State ───────────────────────────────────────────────────────────

/**
 * router-ready: maps directly to future URL query params:
 *   ?workspace=<id>&productId=<id>&source=<surface>&reason=<reason>
 * Not URL binding yet — managed via React state only.
 */
export type CatalogWorkspaceState = {
  workspace: CatalogWorkspaceId;
  productId?: string;
  sourceSurface?: 'catalogs' | 'partners' | 'marketing' | 'app-partner' | 'app-field' | 'app-client';
  reason?: string;
};

// ── Preview Proposal ──────────────────────────────────────────────────────────

/**
 * Replaces local runtime-like mutations.
 * No canonical data is modified by UI. Each action that would call an API
 * emits a CatalogPreviewProposal which is displayed as a result banner.
 */
export type CatalogPreviewProposalType =
  | 'create-product'
  | 'edit-product'
  | 'barcode-reservation'
  | 'visibility-change'
  | 'price-change'
  | 'category-change'
  | 'media-policy-change'
  | 'bulk-approve'
  | 'bulk-send-marketing'
  | 'bulk-request-fix'
  | 'conflict-resolution'
  | 'taxonomy-mapping';

export type CatalogPreviewProposalStatus =
  | 'draft'
  | 'blocked'
  | 'ready-for-api';

export type CatalogPreviewProposalOwner =
  | 'control-panel-catalogs'
  | 'control-panel-marketing'
  | 'control-panel-partners';

export type CatalogPreviewProposal = {
  readonly id: string;
  readonly type: CatalogPreviewProposalType;
  readonly productId?: string;
  readonly productIds?: readonly string[];
  readonly label: string;
  readonly status: CatalogPreviewProposalStatus;
  readonly owner: CatalogPreviewProposalOwner;
  readonly note: string;
  readonly apiBoundary?: string;
};

// ── Workspace Surface Map ─────────────────────────────────────────────────────

/**
 * Declares which surface owns each catalog workspace.
 * Used for handoff routing and owner attribution.
 */
export const CATALOG_WORKSPACE_OWNERS: Record<CatalogWorkspaceId, CatalogPreviewProposalOwner> = {
  'overview': 'control-panel-catalogs',
  'item-detail': 'control-panel-catalogs',
  'identity-governance': 'control-panel-catalogs',
  'duplicate-resolution': 'control-panel-catalogs',
  'visibility-policy': 'control-panel-catalogs',
  'partner-handoff': 'control-panel-catalogs',
  'media-governance': 'control-panel-catalogs',
  'quick-entry-drafts': 'control-panel-catalogs',
  'taxonomy-governance': 'control-panel-catalogs',
  'bulk-operations': 'control-panel-catalogs',
  'audit-trail': 'control-panel-catalogs',
  'publication-readiness': 'control-panel-catalogs',
};
