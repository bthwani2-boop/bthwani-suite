# DSH Root Migration Notes

Status: ACTIVE_DOCS_BASELINE_NOTE
Decision: DOCS_ROOT_CONFIRMED

`dsh/` remains the current service root.
The current master execution sequence lives in:

```text
tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/00_START_HERE_MASTER_ROADMAP.md
```

Current frontend implementation remains rooted under:

```text
dsh/frontend
```

`app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel` remain the active DSH frontend surfaces in the current repo.

`packages/surfaces/src/service-owned/dsh` is not the active source of truth for this slice unless a separate evidence-backed decision restores it.

## Historical Docs Migration In P0-14

- `dsh/docs/archive/` was retired.
- `dsh/docs/closure/` was retired.
- Their still-useful frontend truths were promoted into:
	- `dsh/SERVICE_BLUEPRINT.md`
	- `dsh/docs/CLOSURE_DECISION_LOG.md`
	- `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md`
	- `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md`
	- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
	- `dsh/docs/SCREEN_API_MATRIX.md`
	- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
	- `dsh/docs/DSH_VISUAL_REVIEW.md`

## Current Docs Baseline

- `dsh/docs/README.md` is the docs index.
- `dsh/docs/DSH_VISUAL_REVIEW.md` is the active visual evidence ledger and queue.
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`, `dsh/docs/SCREEN_API_MATRIX.md`, and `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` remain the live service-state matrices.
- `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` stays as historical app-client/WLT context only.

This note does not imply runtime, backend, API, auth, or WLT closure.
Those remain blocked or evidence-pending exactly as stated in the live matrices above.
