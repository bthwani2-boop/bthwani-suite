'use client';

/**
 * CatalogWorkspaceRouter — SCAFFOLD: ربط API قيد التنفيذ
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
import type { CatalogWorkspaceState, CatalogPreviewProposal } from '../catalogs.model';
import type { CatalogProductMaster } from '../catalogs.data';
import type { DuplicatePair } from './duplicate-resolution.drawer';
import { CatalogItemDetailWorkspace } from './item-detail.drawer';
import { CatalogIdentityGovernanceWorkspace } from './identity-governance.drawer';
import { CatalogDuplicateResolutionWorkspace } from './duplicate-resolution.drawer';
import { CatalogVisibilityPolicyWorkspace } from './visibility-policy.drawer';
import { CatalogPartnerHandoffWorkspace } from './partner-handoff.drawer';
import { CatalogMediaGovernanceWorkspace } from './media-governance.drawer';
import { CatalogQuickEntryDraftWorkspace } from './quick-entry-draft.drawer';
import { CatalogTaxonomyGovernanceWorkspace } from './taxonomy-governance.drawer';
import { CatalogBulkOperationsWorkspace } from './bulk-operations.drawer';
import { CatalogAuditTrailWorkspace } from './audit-trail.drawer';
import { CatalogPublicationReadinessMatrix } from './publication-readiness.drawer';
import { CatalogAdoptionQueueWorkspace } from './adoption-queue.drawer';

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
// SCAFFOLD: maps approvalStage to partner activation status for preview.
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
// definitions — identity comes from the catalog model, not workspace-local drafts.

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
          products={products}
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
      {workspace === 'partner-handoff' && (() => {
        // GAP-L05 fix: resolve partner identity from workspaceState, not a hardcoded placeholder
        const resolvedPartnerId   = workspaceState.partnerId ?? workspaceState.reason ?? 'partner-preview-001';
        const resolvedPartnerLabel = workspaceState.partnerLabel ?? 'شريك';
        // Derive activation status from actual product data for this partner
        const partnerItems = toPartnerIncomingItems(products);
        const hasClientVisible = partnerItems.some((p) => p.approvalStage === 'client-visible');
        const hasCatalogAdopted = partnerItems.some((p) => p.approvalStage === 'catalog-adopted');
        const resolvedActivationStatus = hasClientVisible
          ? ('client_visible' as const)
          : hasCatalogAdopted
            ? ('partner_active' as const)
            : partnerItems.length > 0
              ? ('catalog_not_ready' as const)
              : ('submitted' as const);
        return (
          <CatalogPartnerHandoffWorkspace
            partnerId={resolvedPartnerId}
            partnerLabel={resolvedPartnerLabel}
            activationStatus={resolvedActivationStatus}
            incomingItems={partnerItems}
            onClose={onClose}
          />
        );
      })()}


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
          selectedProductIds={selectedProductIds}
          products={products}
          onClose={onClose}
          onProposal={onProposal}
        />
      )}

      {/* ── audit-trail ───────────────────────────────────────────────── */}
      {workspace === 'audit-trail' && (
        <CatalogAuditTrailWorkspace
          productId={productId}
          products={products}
          onClose={onClose}
        />
      )}

      {/* ── publication-readiness ─────────────────────────────────────── */}
      {workspace === 'publication-readiness' && (
        <CatalogPublicationReadinessMatrix
          products={products}
          onClose={onClose}
        />
      )}

      {/* ── adoption-queue ────────────────────────────────────────────── */}
      {workspace === 'adoption-queue' && (
        <CatalogAdoptionQueueWorkspace
          onClose={onClose}
          onProposal={onProposal}
        />
      )}
    </div>
  );
}
