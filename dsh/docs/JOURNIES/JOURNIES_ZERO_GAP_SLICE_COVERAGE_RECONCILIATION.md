# JOURNIES Zero-Gap Slice Coverage Reconciliation

**Status before local script:** `TEMPLATE_REQUIRES_LOCAL_CENSUS`

Every live DSH/WLT/Auth/API/runtime/frontend/backend/control-panel/UI file must map to one or more slices, or be explicitly excluded with reason.

| Source item | Exists in live repo | Mentioned in slice docs | Decision | Required action |
|---|---:|---:|---|---|
| _run local census_ | pending | pending | `NEEDS_GIT_EVIDENCE` | run `Invoke-DshWltJourneysEvidenceGatedTreeCensus.ps1 -Apply` |
