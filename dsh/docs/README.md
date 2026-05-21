# DSH Docs Index

Status: ACTIVE_FRONTEND_CLOSURE_TRUTH

Purpose:
Lean index for the live DSH frontend closure truth after P0-02 through P0-14.

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

## Lean Docs

- `dsh/docs/MIGRATION.md`
- `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md`
- `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md`
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/CLOSURE_DECISION_LOG.md`
- `dsh/docs/DSH_VISUAL_REVIEW.md`

## Retired Trees

- `dsh/docs/archive/` was retired after the still-useful frontend truths were absorbed into the files above.
- `dsh/docs/closure/` was retired after closure truth moved into live registries plus the lean matrices above.
- Historical artifacts under `tools/plan/**` may still mention retired paths. Treat those references as archival only.

## Rules

- No runtime truth from fixture, preview, seed, or local-state data.
- No DSH-owned money semantics outside WLT.
- No API or backend claim without a matching row in `SCREEN_API_MATRIX.md`.
- No frontend closure claim without route proof, screen proof, required states, visual evidence, and runtime proof or an explicit blocker.
