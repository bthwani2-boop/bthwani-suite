# DSH Root Migration Notes

Status: ACTIVE_FRONTEND_ROOT_NOTE

`dsh/` remains the current service root.

Current frontend implementation remains rooted under:

```text
dsh/frontend
```

`app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel` remain the active DSH frontend surfaces in this branch.

`packages/surfaces/src/service-owned/dsh` is not the active source of truth for this slice unless a separate evidence-backed decision restores it.

## Docs Migration In P0-14

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

This migration note does not imply runtime, backend, API, auth, or WLT closure.
Those remain blocked or evidence-pending exactly as stated in the live matrices above.
