# DSH Docs Index

Status: ACTIVE_FRONTEND_CLOSURE_TRUTH
Decision: DSH_UIUX_FLOW_LOGICALLY_READY_FOR_VISUAL_REVIEW

Purpose:
Lean index for the current DSH docs baseline. Service-state truth lives in the live matrices and visual ledger below. Older P0-xx sequencing remains historical context only.

## Current Master Sequence

- `tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/00_START_HERE_MASTER_ROADMAP.md`

## Canonical Code Truth

- `dsh/SERVICE_BLUEPRINT.md`
- `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
- `dsh/frontend/shared/dsh-flow-registry.ts`
- `dsh/frontend/app-client/dsh-client.screen-registry.ts`
- `dsh/frontend/app-partner/dsh-partner.screen-registry.ts`
- `dsh/frontend/app-captain/dsh-captain.screen-registry.ts`
- `dsh/frontend/app-field/dsh-field.screen-registry.ts`
- `dsh/frontend/control-panel/operations/operations.registry.ts`
- `dsh/frontend/control-panel/finance/finance.registry.ts`

## Live Docs Truth

- `dsh/docs/MIGRATION.md`
- `dsh/docs/DSH_VISUAL_REVIEW.md`
- `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md`
- `dsh/docs/slices/`
- `dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md`
- `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md`
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/CLOSURE_DECISION_LOG.md`

## Historical Focused References

- `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` — app-client + WLT boundary history only
- `dsh/docs/CLOSURE_DECISION_LOG.md` — append-only history; old `PASS` rows do not override the live matrices

## Retired Trees

- `dsh/docs/archive/` was retired after the still-useful frontend truths were absorbed into the files above.
- `dsh/docs/closure/` was retired after closure truth moved into live registries plus the lean matrices above.
- Historical artifacts under `tools/plan/**` are archival only unless the current forward-only package restates them.

## Rules

- No runtime truth from fixture, preview, seed, or local-state data.
- No DSH-owned money semantics outside WLT.
- No API or backend claim without a matching row in `SCREEN_API_MATRIX.md`.
- No frontend closure claim without route proof, screen proof, required states, visual evidence, and runtime proof or an explicit blocker.
- No DSH slice can start or close without a row-complete manifest under `dsh/docs/slices/`.
- No branch-specific instruction may live in `dsh/docs/command.md` or `dsh/docs/DSH_VISUAL_REVIEW.md`.
- DSH slices are cross-surface business/operational journeys, not isolated surface rows. A slice closes a complete business outcome across all related surfaces or explicitly classifies each surface as excluded/blocked/deferred with reason.
- Live matrices (`UI_UX_FLOW_CLOSURE_MATRIX.md`, `SCREEN_API_MATRIX.md`, `RUNTIME_EVIDENCE_MATRIX.md`, `DSH_VISUAL_REVIEW.md`) are evidence inventories; they do not define standalone slices.
- DSH domain preview data lives in `dsh/frontend/data`. Surfaces own only presentation adapters, view models, labels, layout state, and screen-only UI fixtures. Never duplicate contradictory customers/products/categories/orders across DSH surfaces.
- Never treat preview/fixtures as runtime/API truth.
- `tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523` follows the same cross-surface slice model defined in `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md`.
- On-demand retrieval is the default: do not push bulk data across all surfaces; use references/IDs/lean summaries/lazy loading/pagination/caching when documenting future slice models.
