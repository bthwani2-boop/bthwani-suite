# DSH Docs Noise Reduction Plan — Loop 0

Status: DONE_LOCAL (classification only — no archive/delete in this loop)
Loop: 0
Date: 2026-05-15

## Rule

Do not archive or delete in Loop 0.
Classification only. Actions execute in Loop 5 after coverage is proven.

## Classification key

| Label | Meaning |
|---|---|
| `KEEP_SHORT_INDEX` | Canonical index; keep minimal, no content growth |
| `MERGE_INTO_CLOSURE` | Feeds Loop 1–6 matrices; merge before Loop 3 |
| `ARCHIVE_CANDIDATE` | Old phase artifacts; archive in Loop 5, not before |
| `DELETE_CANDIDATE` | No value in any loop; flag for user decision |
| `DO_NOT_TOUCH` | Active ownership/decision record; no edits without explicit approval |
| `TBD` | Requires reading full content before classifying |

---

## `dsh/SERVICE_BLUEPRINT.md`

| Field | Value |
|---|---|
| Classification | `KEEP_SHORT_INDEX` |
| Reason | Canonical service truth anchor; referenced by README and closure matrix |
| Loop action | No touch |

---

## `dsh/docs/README.md`

| Field | Value |
|---|---|
| Classification | `KEEP_SHORT_INDEX` |
| Reason | Already lean index pointing to active docs; status ACTIVE_LEAN_CLOSURE_CONTROL |
| Loop action | No touch — update only if new closure files added |

---

## `dsh/docs/MIGRATION.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | Migration note referenced by README; history record |
| Loop action | No touch |

---

## `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | Status ACTIVE_CLOSURE_CONTROL; live route anchors and evidence blockers; feeds Loop 1 directly |
| Loop action | Read-only source in Loop 1 |

---

## `dsh/docs/SCREEN_API_MATRIX.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | Status ACTIVE_CLOSURE_CONTROL; NOT_READY_FOR_API gate; canonical screen-to-API anchor |
| Loop action | Read-only source in Loop 3 |

---

## `dsh/docs/CLOSURE_DECISION_LOG.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | Active decision log; append-only; must not be restructured |
| Loop action | Append evidence entries in Loop 4–6 only |

---

## `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | Evidence matrix for runtime state; may still have active blocker rows |
| Loop action | Read-only source in Loop 2 |

---

## `dsh/docs/DSH_FORENSIC_INVENTORY.md`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Forensic screen inventory feeds Loop 1 existing coverage inventory |
| Loop action | Read in Loop 1; summarize into DSH_EXISTING_COVERAGE_INVENTORY |

---

## `dsh/docs/DSH_PHASE_3R_SCREEN_GAP_INVENTORY.md`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Screen gap inventory feeds Loop 3 missing logic/UI gap map |
| Loop action | Read in Loop 3; merge into DSH_MISSING_LOGIC_AND_UI_GAPS |

---

## `dsh/docs/DSH_PHASE_3R_OPERATING_LOGIC_MODEL.md`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Operating logic model feeds Loop 2 global lifecycle coverage |
| Loop action | Read in Loop 2; merge into DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX |

---

## `dsh/docs/DSH_PHASE_3R_MANUAL_DESIGN_WORK_ORDER.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Phase 3R work order artifact; work order superseded by current package execution |
| Loop action | Archive in Loop 5 after coverage proven |

---

## `dsh/docs/DSH_PHASE_3R_PREVIEW_SCENARIOS.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Preview/fixture scenario file; not a runtime truth source |
| Loop action | Archive in Loop 5; flag any scenario that maps to a real missing state |

---

## `dsh/docs/DSH_MOBILE_APPS_FINAL_CLOSURE.md`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Mobile surface closure doc feeds Loop 1 mobile surface map |
| Loop action | Read in Loop 1; merge into DSH_MOBILE_APPS_SURFACE_MAP |

---

## `dsh/docs/DSH_MOBILE_APPS_FINAL_CLOSURE_RUNBOOK.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Old runbook artifact from mobile closure phase; superseded by current package |
| Loop action | Archive in Loop 5 |

---

## `dsh/docs/dsh-client-final-classification.csv`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Client screen classification CSV feeds Loop 1 existing coverage inventory |
| Loop action | Read in Loop 1; incorporate into DSH_EXISTING_COVERAGE_INVENTORY |

---

## `dsh/docs/dsh-partner-final-classification.csv`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Partner screen classification CSV feeds Loop 1 |
| Loop action | Read in Loop 1 |

---

## `dsh/docs/dsh-captain-final-classification.csv`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Captain screen classification CSV feeds Loop 1 |
| Loop action | Read in Loop 1 |

---

## `dsh/docs/dsh-field-final-classification.csv`

| Field | Value |
|---|---|
| Classification | `MERGE_INTO_CLOSURE` |
| Reason | Field screen classification CSV feeds Loop 1 |
| Loop action | Read in Loop 1 |

---

## `dsh/docs/GATE_REPORT_DSH_FRONTEND_CLOSURE_FINAL_20260510.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Gate report from 2026-05-10 phase; evidence artifact, not active control |
| Loop action | Archive in Loop 5 |

---

## `dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Scope standardization doc from a prior phase; content superseded by forensic inventory |
| Loop action | Archive in Loop 5 |

---

## `dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Runbook from prior standardization phase |
| Loop action | Archive in Loop 5 |

---

## `dsh/docs/DSH_PARTNER_APP_SCOPE_STANDARDIZATION.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Partner scope standardization doc from prior phase |
| Loop action | Archive in Loop 5 |

---

## `dsh/docs/DSH_PARTNER_APP_SCOPE_STANDARDIZATION_RUNBOOK.md`

| Field | Value |
|---|---|
| Classification | `ARCHIVE_CANDIDATE` |
| Reason | Runbook from prior partner standardization phase |
| Loop action | Archive in Loop 5 |

---

## `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | Active ownership decision record for Control Panel shared ownership; must not be changed without explicit approval |
| Loop action | Read-only source in Loop 2 |

---

## `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md`

| Field | Value |
|---|---|
| Classification | `DO_NOT_TOUCH` |
| Reason | WLT-related roadmap; touching WLT semantics is forbidden; read-only source only |
| Loop action | No touch |

---

## Summary counts

| Classification | Count |
|---|---|
| KEEP_SHORT_INDEX | 2 |
| DO_NOT_TOUCH | 6 |
| MERGE_INTO_CLOSURE | 8 |
| ARCHIVE_CANDIDATE | 9 |
| DELETE_CANDIDATE | 0 |
| TBD | 0 |
| **Total** | **25** |

(Includes `dsh/SERVICE_BLUEPRINT.md` + 24 `dsh/docs/` files)
