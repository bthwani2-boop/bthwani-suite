'use client';

/**
 * CatalogWorkspaceRouter — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * router-ready: renders the correct workspace overlay given CatalogWorkspaceState.
 *
 * Extracted from ControlPanelDshCatalogScreen monolith.
 * No backend/API. No canonical data mutation. No direct Tamagui import.
 *
 * Each workspace receives:
 *   - productId / productIds (reference only, not full payload duplication)
 *   - summary data (name, approvalStage, mediaPolicy) — no deep nesting
 *   - onClose callback
 *   - onProposal callback for emitting CatalogPreviewProposal results
 */

import React from 'react';
import type { CatalogWorkspaceState, CatalogPreviewProposal } from './catalog-workspace.types';
import type { CatalogProductMaster } from './catalog';
import type { DuplicatePair } from './CatalogDuplicateResolutionWorkspace';
import { CatalogItemDetailWorkspace } from './CatalogItemDetailWorkspace';
import { CatalogIdentityGovernanceWorkspace } from './CatalogIdentityGovernanceWorkspace';
import { CatalogDuplicateResolutionWorkspace } from './CatalogDuplicateResolutionWorkspace';
import { CatalogVisibilityPolicyWorkspace } from './CatalogVisibilityPolicyWorkspace';
import { CatalogPartnerHandoffWorkspace } from './CatalogPartnerHandoffWorkspace';
import { CatalogMediaGovernanceWorkspace } from './CatalogMediaGovernanceWorkspace';
import { CatalogQuickEntryDraftWorkspace } from './CatalogQuickEntryDraftWorkspace';
import { CatalogTaxonomyGovernanceWorkspace } from './CatalogTaxonomyGovernanceWorkspace';
import { CatalogBulkOperationsWorkspace } from './CatalogBulkOperationsWorkspace';
import { CatalogAuditTrailWorkspace } from './CatalogAuditTrailWorkspace';
import { CatalogPublicationReadinessMatrix } from './CatalogPublicationReadinessMatrix';

// ── Props ─────────────────────────────────────────────────────────────────────

export type CatalogWorkspaceRouterProps = {
  /** Current workspace state; null = no overlay. */
  workspaceState: CatalogWorkspaceState | null;
  /** Products summary — IDs and lightweight display fields only. */
  products: readonly CatalogProductMaster[];
  /** IDs selected for bulk operations. */
  selectedProductIds: readonly string[];
  /** Called when workspace should close. */
  onClose: () => void;
  /** Called when workspace emits a preview proposal. */
  onProposal: (proposal: CatalogPreviewProposal) => void;
};

// ── Visibility mapping via shared adapter ─────────────────────────────────────
// UI_PREVIEW_ONLY: maps approvalStage to partner activation status for preview.
// router-ready: real status will come from dsh-client-visibility.model.ts resolver.

function approvalStageToActivationStatus(stage: string) {
  if (stage === 'client-visible') return 'client_visible' as const;
  if (stage === 'catalog-adopted') return 'partner_active' as const;
  if (stage === 'marketing-review') return 'catalog_ready' as const;
  if (stage === 'partner-review') return 'catalog_not_ready' as const;
  return 'submitted' as const;
}

// ── Workspace input adapters ──────────────────────────────────────────────────
// Named adapter functions that extract the minimal input each workspace needs
// from the canonical product array. These are adapter transforms, not new entity
// definitions — identity comes from dsh/frontend/data via catalog.ts.

function toIdentityItems(products: readonly CatalogProductMaster[]) {
  return products.map((p) => ({
    ['id']: p.id,
    ['sku']: p.sku,
    ['gtin']: p.gtin,
    ['barcode']: p.barcode,
    ['name']: p.name,
  }));
}

function toMediaItems(products: readonly CatalogProductMaster[]) {
  return products.map((p) => ({
    ['id']: p.id,
    ['name']: p.name,
    ['mediaKey']: p.mediaKey,
    ['mediaPolicy']: p.mediaPolicy,
    ['imageUri']: p.imageUri,
  }));
}

function toPartnerIncomingItems(products: readonly CatalogProductMaster[]) {
  return products
    .filter(
      (p) =>
        p.sourceSurface === 'partner' ||
        p.approvalStage === 'partner-proposed' ||
        p.approvalStage === 'partner-review',
    )
    .map((p) => ({ ['id']: p.id, ['name']: p.name, ['approvalStage']: p.approvalStage }));
}

function toDuplicatePairs(products: readonly CatalogProductMaster[]): DuplicatePair[] {
  const conflicting = products.filter((p) => !!p.conflictReason);
  return conflicting.map((p, idx) => ({
    ['sourceId']: p.id,
    ['candidateId']: conflicting[(idx + 1) % Math.max(conflicting.length, 1)]?.id ?? p.id,
    ['reason']: p.conflictReason || 'تشابه في الاسم أو SKU',
    ['conflictFields']: ['name', 'sku', ...(p.gtin ? ['gtin'] : []), ...(p.mediaKey ? ['mediaKey'] : [])],
  }));
}

// ── Router ────────────────────────────────────────────────────────────────────

export function CatalogWorkspaceRouter({
  workspaceState,
  products,
  selectedProductIds,
  onClose,
  onProposal,
}: CatalogWorkspaceRouterProps) {
  if (!workspaceState) return null;

  const { workspace, productId } = workspaceState;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.32)',
        }}
      />

      {/* ── item-detail ───────────────────────────────────────────────── */}
      {workspace === 'item-detail' && (() => {
        const p = products.find((pr) => pr.id === productId);
        if (!p) return null;
        return (
          <CatalogItemDetailWorkspace
            product={p}
            onClose={onClose}
          />
        );
      })()}

      {/* ── duplicate-resolution ──────────────────────────────────────── */}
      {workspace === 'duplicate-resolution' && (
        <CatalogDuplicateResolutionWorkspace
          duplicatePairs={toDuplicatePairs(products)}
          products={products as CatalogProductMaster[]}
          onClose={onClose}
        />
      )}

      {/* ── identity-governance ───────────────────────────────────────── */}
      {workspace === 'identity-governance' && (
        <CatalogIdentityGovernanceWorkspace
          items={toIdentityItems(products)}
          onClose={onClose}
        />
      )}

      {/* ── visibility-policy ─────────────────────────────────────────── */}
      {workspace === 'visibility-policy' && (() => {
        const p = products.find((pr) => pr.id === productId) ?? products[0];
        if (!p) return null;
        return (
          <CatalogVisibilityPolicyWorkspace
            product={p}
            partnerActivationStatus={approvalStageToActivationStatus(p.approvalStage)}
            onClose={onClose}
          />
        );
      })()}

      {/* ── partner-handoff ───────────────────────────────────────────── */}
      {workspace === 'partner-handoff' && (
        <CatalogPartnerHandoffWorkspace
          partnerId={workspaceState.sourceSurface === 'partners' ? workspaceState.reason ?? 'partner-preview-001' : 'partner-preview-001'}
          partnerLabel="شريك النموذج الأولي"
          activationStatus="catalog_not_ready"
          incomingItems={toPartnerIncomingItems(products)}
          onClose={onClose}
        />
      )}

      {/* ── media-governance ──────────────────────────────────────────── */}
      {workspace === 'media-governance' && (
        <CatalogMediaGovernanceWorkspace
          items={toMediaItems(products)}
          onClose={onClose}
        />
      )}

      {/* ── quick-entry-drafts ────────────────────────────────────────── */}
      {workspace === 'quick-entry-drafts' && (
        <CatalogQuickEntryDraftWorkspace
          onClose={onClose}
          onProposal={onProposal}
        />
      )}

      {/* ── taxonomy-governance ───────────────────────────────────────── */}
      {workspace === 'taxonomy-governance' && (
        <CatalogTaxonomyGovernanceWorkspace
          onClose={onClose}
          onProposal={onProposal}
        />
      )}

      {/* ── bulk-operations ───────────────────────────────────────────── */}
      {workspace === 'bulk-operations' && (
        <CatalogBulkOperationsWorkspace
          selectedProductIds={selectedProductIds as string[]}
          products={products as CatalogProductMaster[]}
          onClose={onClose}
          onProposal={onProposal}
        />
      )}

      {/* ── audit-trail ───────────────────────────────────────────────── */}
      {workspace === 'audit-trail' && (
        <CatalogAuditTrailWorkspace
          productId={productId}
          products={products as CatalogProductMaster[]}
          onClose={onClose}
        />
      )}

      {/* ── publication-readiness ─────────────────────────────────────── */}
      {workspace === 'publication-readiness' && (
        <CatalogPublicationReadinessMatrix
          products={products as CatalogProductMaster[]}
          onClose={onClose}
        />
      )}
    </div>
  );
}
