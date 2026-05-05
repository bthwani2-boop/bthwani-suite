# DSH Docs Index

Status: ACTIVE_LEAN_CLOSURE_CONTROL

This folder contains only the minimum DSH closure-control documents required to close DSH without noise.

Canonical truth:

- `dsh/SERVICE_BLUEPRINT.md`

Contract truth:

- `dsh/dsh.openapi.yaml`

Existing migration note:

- `dsh/docs/MIGRATION.md`

Lean closure docs:

- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/DSH_FORENSIC_INVENTORY.md`
- `dsh/docs/CLOSURE_DECISION_LOG.md`

Current live-code note:

- DSH-CAP-002 received preview-routing hardening in the shared marketing banner-store and control-panel deck, but runtime, API, and visual proof remain unproven.

Rules:

- No extra DSH docs unless a real evidence gap requires one.
- No API endpoint without a Screen/API Matrix row.
- No UI/UX/Flow closure without route, state, RTL, visual, and runtime evidence.
- No runtime truth from fixture/mock/preview data.
- No financial effect outside WLT.
- No local design system outside `@bthwani/ui-kit`.
