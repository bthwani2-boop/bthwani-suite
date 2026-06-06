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
	- `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md`
	- `dsh/docs/DSH_APPLICATIONS_AND_CONTROL_PANEL_SHARED_OWNER_DECISION.md`
	- `dsh/docs/DSH_UNIFIED_CLOSURE_MATRIX.md` — consolidated UI/UX flow and screen/API matrix
	- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`

## Current Docs Baseline

- `dsh/docs/README.md` is the docs index.
- `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md` is the active visual review ledger, slice manifest, closure log, and living roadmap.
- `dsh/docs/DSH_UNIFIED_CLOSURE_MATRIX.md` and `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` remain the live service-state matrices.

This note does not imply runtime, backend, API, auth, or WLT closure.
Those remain blocked or evidence-pending exactly as stated in the live matrices above.
