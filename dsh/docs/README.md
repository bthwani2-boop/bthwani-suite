# DSH Docs Index

Status: ACTIVE_FRONTEND_CLOSURE_TRUTH
Decision: DSH_UIUX_FLOW_LOGICALLY_READY_FOR_VISUAL_REVIEW
Version: 2026-06-06-v3

Purpose:
Lean index for the current DSH docs baseline. Service-state truth lives in the live matrices, slice manifest, coverage index, visual ledger, and append-only decision log below. Older P0-xx sequencing and planning files are archival context only.

---

## Active Service & Root Baseline

- **Current Service Root:** `dsh/` remains the current active service root.
- **Master Execution Sequence:** `tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/00_START_HERE_MASTER_ROADMAP.md`
- **Active Frontend Root:** `dsh/frontend/` is the active root for current frontend implementations.
- **Active Surfaces:** `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel` are the active frontend surfaces in the current repository.
- **Inactive Source:** `packages/surfaces/src/service-owned/dsh` is NOT the active source of truth for this slice unless a separate evidence-backed decision restores it.

---

## Live Docs Truth

- `dsh/docs/README.md` — lean docs index only.
- `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` — journey and slice closure protocol.
- `dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md` — source-area to journey/slice map.
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` — UI/UX flow evidence rows.
- `dsh/docs/SCREEN_API_MATRIX.md` — screen/API candidate and binding readiness rows.
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` — runtime proof rows and blockers.
- `dsh/docs/DSH_VISUAL_REVIEW.md` — visual evidence ledger only.
- `dsh/docs/CLOSURE_DECISION_LOG.md` — append-only historical decision log only; it does not override the live matrices.
- `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` — control-panel/shared ownership policy.
- `dsh/docs/slices/` — per-journey and per-slice manifests.
- `dsh/docs/templates/` — reusable command/templates only.

## Archived Root Docs

The following root-level planning/history files live under `dsh/docs/archive/` and must not be treated as current closure truth:

- `BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md`
- `MIGRATION.md`
- `DSH_FILE_SIZE_RISK_MATRIX.md`
- `DSH_MASTER_CLOSURE_MATRIX.md`
- `DSH_UNIFIED_CLOSURE_MATRIX.md`
- `DSH_OPERATIONAL_OPERATING_MODEL_GAP_MAP.md`
- `DSH_OPERATIONAL_RUNTIME_API_SLICES_PLAN.md`
- `command.md`

---

## Retired Trees

- `dsh/docs/archive/` stores historical references only. It is not live closure truth.
- `dsh/docs/closure/` was retired after closure truth moved into live registries plus the target matrices.
- Historical artifacts under `tools/plan/**` are archival only unless the current forward-only package restates them.

---

## General Rules & Constraints

- **No Runtime Truth from Fixtures:** No runtime truth may be derived from fixture, preview, seed, or local-state data.
- **Financial Boundary:** WLT owns all payment, wallet, settlement, payout, refund, ledger, and money semantics. DSH surfaces are strictly read-only bridges with zero financial mutation capability.
- **No Orphan Surfaces:** No surface without a route, no route without an owner, no screen without a primary action, and no CTA without a navigation target.
- **No-Gap Policy:** No missing screen, process, state, or dependency may be closed silently. Any gap must be recorded as `REQUIRED_ADDITION` (must be resolved before closure) or `BLOCKED_WITH_REASON`.
- **E2E Slice Closure:** A slice closes a complete business outcome across all related surfaces or explicitly classifies each surface as excluded/blocked/deferred with reason.
- **Visual Evidence requirement:** No visual `PASS` can override missing runtime/API/database proof. All screenshots must live under `tools/registry/runs/<SESSION_ID>/screenshots/`.
- **On-Demand Retrieval:** Do not push bulk data across surfaces; use references/IDs/lean summaries/lazy loading/pagination/caching when documenting future slice models.
- **Root Docs Naming Rule:** New root docs must be an index, manifest, matrix, append-only log, visual ledger, template, or per-slice manifest. Files named `MASTER`, `UNIFIED`, `FINAL`, `ROADMAP`, `PLAN`, `GAP_MAP`, `COMMAND`, or `MIGRATION` do not stay in the root unless they are the only proven source of truth.

This index and its rules do not imply runtime, backend, API, auth, or WLT closure unless explicitly verified by E2E evidence in the live matrices and evidence root.
