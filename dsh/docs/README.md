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
- `dsh/docs/DSH_PHASE_3R_SCREEN_GAP_INVENTORY.md`
- `dsh/docs/DSH_PHASE_3R_OPERATING_LOGIC_MODEL.md`
- `dsh/docs/DSH_PHASE_3R_MANUAL_DESIGN_WORK_ORDER.md`
- `dsh/docs/DSH_PHASE_3R_PREVIEW_SCENARIOS.md`

Mobile closure docs:

- `dsh/docs/DSH_MOBILE_APPS_FINAL_CLOSURE.md`
- `dsh/docs/DSH_MOBILE_APPS_FINAL_CLOSURE_RUNBOOK.md`
- `dsh/docs/dsh-client-final-classification.csv`
- `dsh/docs/dsh-partner-final-classification.csv`
- `dsh/docs/dsh-captain-final-classification.csv`
- `dsh/docs/dsh-field-final-classification.csv`

Current live-code note:

- DSH-CAP-002 received preview-routing hardening in the shared marketing banner-store and control-panel deck, but runtime, API, and visual proof remain unproven.

Rules:

- No extra DSH docs unless a real evidence gap requires one.
- No API endpoint without a Screen/API Matrix row.
- No UI/UX/Flow closure without route, state, RTL, visual, and runtime evidence.
- No runtime truth from fixture/mock/preview data.
- No financial effect outside WLT.
- No local design system outside `@bthwani/ui-kit`.
