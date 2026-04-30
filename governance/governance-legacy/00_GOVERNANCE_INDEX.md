# BThwani Governance Index

Status: CANONICAL_INDEX
Owner: BThwani Governance
Scope: active governance authority map, reading order, and archive boundary

## Operating Rule

The active governance root is limited to exactly 20 files total.

Those 20 files are split into:

- 16 canonical authority files
- 4 required transitional root files retained temporarily for compatibility or structural trace

Any governance file not listed below is one of:

- merged source material whose unique rules must live in a canonical file
- a historical ledger or planning artifact
- a transitional alias that must not compete with canonical authority
- archive-only material

No extra root file may claim live authority beside this set.

## Canonical Roots

| Root | Role | Authority |
| --- | --- | --- |
| `governance/` | canonical textual control plane | CANONICAL |
| `governance/archive/` | historical material preserved after merge | ARCHIVE_ONLY |
| `tools/guards/` | executable guard implementation | IMPLEMENTATION_ONLY |
| `tools/scripts/` | controlled automation and diagnostics | IMPLEMENTATION_ONLY |
| `tools/registry/runs/` | evidence output root | CANONICAL_OUTPUT_ONLY |
| `.github/workflows/` | CI enforcement | ENFORCEMENT_ONLY |
| `.github/agents/` | derived agent behavior | DERIVED_ONLY |
| `.github/skills/` | derived skill behavior | DERIVED_ONLY |

## Active Canonical Set

| Order | File | Canonical role | Consolidation scope |
| --- | --- | --- | --- |
| 1 | `00_GOVERNANCE_INDEX.md` | authority index | active-set definition and classification |
| 2 | `01_PLATFORM_SSOT.md` | platform truth | repo truth, names, ownership ladder, surface/service set |
| 3 | `02_BRANCH_AND_EVIDENCE_POLICY.md` | branch and evidence law | branch reality, destructive-change proof, checkpoint accounting, evidence pack schema |
| 4 | `03_PACKAGE_BOUNDARY_CONTRACT.md` | package boundary law | package placement, shared-folder and boundary ownership |
| 5 | `04_APPS_SHELL_ONLY_CONTRACT.md` | app-shell law | app host and shell-only ownership |
| 6 | `06_SURFACES_OWNERSHIP_CONTRACT.md` | surface ownership law | surface catalog, naming, service-owned vs surface-owned split |
| 7 | `07_UI_KIT_AUTHORITY_CONTRACT.md` | design system law | ui-kit sovereignty, Tamagui, brand, RTL and shared direction |
| 8 | `08_SCREEN_FILE_MODEL_CONTRACT.md` | screen and route law | screen file structure and route ownership |
| 9 | `10_SERVICE_CLOSURE_PROTOCOL.md` | service closure law | service catalog, golden-slice sequence, blueprint standard, closure guardrails |
| 10 | `12_API_BINDING_RUNTIME_PROTOCOL.md` | integration law | OpenAPI sovereignty, contract quality, binding and runtime closure |
| 11 | `13_CI_GATES_CONTRACT.md` | CI and gate law | gradual gating, report-only readiness, workflow discipline |
| 12 | `14_AGENT_EXECUTION_RULES.md` | AI execution law | AI execution, patch review, agent validation, agent change traceability |
| 13 | `17_TESTING_AND_PRODUCTION_READINESS.md` | verification law | testing pyramid, runtime proof, traceability, verification matrix |
| 14 | `GOVERNANCE_CONTROL_PLANE_STANDARD.md` | organization law | file classes, alias discipline, archive structure, naming discipline |
| 15 | `GOVERNANCE_CLOSURE_STANDARD.md` | closure law | binding decisions, scope rules, finalization, cleanup, and security closure discipline |
| 16 | `GOVERNANCE_GUARD_CATALOG.md` | guard law | guard inventory, warning classification, severity promotion, implementation map |

## Transitional Root Files

These four files remain at the root temporarily for compatibility or traceability, but they are not canonical authority:

| File | Status | Canonical target or role |
| --- | --- | --- |
| `19_PATCH_REVIEW_PROTOCOL.md` | TRANSITIONAL_ALIAS | `14_AGENT_EXECUTION_RULES.md` |
| `AGENT_GOVERNANCE_POLICY.md` | TRANSITIONAL_ALIAS | `14_AGENT_EXECUTION_RULES.md` |
| `GUARDS.md` | TRANSITIONAL_ALIAS | `GOVERNANCE_GUARD_CATALOG.md` |
| `GOVERNANCE_REORGANIZATION_LEDGER.md` | TRANSITIONAL_TRACE | required structural decision history until external consumers are repaired |

## Reading Order

Read the active set in this order for decisions:

1. `00_GOVERNANCE_INDEX.md`
2. `GOVERNANCE_CONTROL_PLANE_STANDARD.md`
3. `GOVERNANCE_CLOSURE_STANDARD.md`
4. `01_PLATFORM_SSOT.md`
5. `02_BRANCH_AND_EVIDENCE_POLICY.md`
6. `14_AGENT_EXECUTION_RULES.md`
7. `17_TESTING_AND_PRODUCTION_READINESS.md`
8. `GOVERNANCE_GUARD_CATALOG.md`

## Merge Families

These source families must be absorbed into the active set and then archived:

| Source family | Canonical target |
| --- | --- |
| `README.md` | `00_GOVERNANCE_INDEX.md` |
| `OWNERSHIP.md`, `REPO_BOUNDARY.md`, `REPO_BOUNDARIES_AND_OWNERSHIP.md`, `APPROVED_SURFACE_NAMING.md`, `ARCHITECTURE_LOCK.md`, `PLATFORM_OPERATING_MODEL.md`, `PLATFORM_BLUEPRINT*.md`, `ARCHITECTURE_GUARDRAILS.md`, `GOVERNANCE_SSOT.md` | `01_PLATFORM_SSOT.md` |
| `BRANCH_AND_CHECKPOINT_POLICY.md`, `EVIDENCE_AND_CLOSURE_GATES.md`, `CHANGE_ENTRY_RULE.md`, `18_EVIDENCE_PACK_STANDARD.md`, `EVIDENCE_PACK_TEMPLATE.md` | `02_BRANCH_AND_EVIDENCE_POLICY.md` |
| `SURFACE_CATALOG.md` | `06_SURFACES_OWNERSHIP_CONTRACT.md` |
| `TAMAGUI_INTEGRATION_LAW.md`, `DIRECTION_I18N_OWNERSHIP.md`, `UI_UX_GUARDRAILS.md` | `07_UI_KIT_AUTHORITY_CONTRACT.md` |
| `09_SHARED_FOLDER_GOVERNANCE.md` | `03_PACKAGE_BOUNDARY_CONTRACT.md` |
| `11_DSH_GOLDEN_SLICE_PROTOCOL.md`, `SERVICE_CATALOG.md`, `SERVICE_BLUEPRINT_STANDARD.md`, `SERVICE_BLUEPRINT_TEMPLATE.md`, `SERVICE_CLOSURE_GUARDRAILS.md`, `OPERATION_CATALOG_TEMPLATE.md` | `10_SERVICE_CLOSURE_PROTOCOL.md` |
| `API_CONTRACT_POLICY.md`, `OPENAPI_SOVEREIGNTY.md`, `FLOW_API_BINDING_RUNTIME_GUARDRAILS.md` | `12_API_BINDING_RUNTIME_PROTOCOL.md` |
| `CI_GRADUAL_GATE_POLICY.md`, `CI_REPORT_ONLY_READINESS_PLAN.md` | `13_CI_GATES_CONTRACT.md` |
| `19_PATCH_REVIEW_PROTOCOL.md`, `AGENT_GOVERNANCE_POLICY.md`, `AI_EXECUTION_GOVERNANCE.md`, `AGENT_UPDATE_VALIDATION_CHECKLIST.md`, `AGENT_CHANGE_LEDGER_POLICY.md` | `14_AGENT_EXECUTION_RULES.md` |
| `16_SECURITY_AND_SECRETS_POLICY.md`, `SECURITY_AND_SECRETS_GUARDRAILS.md` | `GOVERNANCE_CLOSURE_STANDARD.md` |
| `RUNTIME_VERIFICATION_POLICY.md`, `TRACEABILITY_MATRIX_STANDARD.md`, `TRACEABILITY_MATRIX.md`, `VERIFICATION_MATRIX.md` | `17_TESTING_AND_PRODUCTION_READINESS.md` |
| `CLEANUP_AND_DEPRECATION_POLICY.md`, `LEGACY_REFERENCE_CLEANUP_POLICY.md`, `SCOPE_LOCK.md`, `GOVERNANCE_FINALIZATION_PROTOCOL.md`, `GOVERNANCE_CLOSURE_DECISION.md` | `GOVERNANCE_CLOSURE_STANDARD.md` |
| `GUARDS.md`, `GOVERNANCE_GUARD_EXECUTION_STANDARD.md`, `GUARDRAILS_INDEX.md`, `GUARD_IMPLEMENTATION_MAP.md`, `GUARD_SEVERITY_PROMOTION_POLICY.md`, `WARNING_CLASSIFICATION_POLICY.md`, `WARNING_BASELINE_CLASSIFICATION_MATRIX.md`, `TOP_WARNING_FAMILY_ACTION_PLAN.md`, `GUARD_*.md` | `GOVERNANCE_GUARD_CATALOG.md` |

## Archive-Only Families

The following files are historical, analytical, or execution-tracking artifacts and must not remain active authority after consolidation:

- `AGENT_CHANGE_LEDGER.md`
- `BATCH_*.md`
- `DOCS_GOVERNANCE_*.md`
- `GOVERNANCE_AUDIT_FALSE_POSITIVE_CLASSIFICATION.md`
- `GOVERNANCE_CANDIDATE_RESOLUTION_MATRIX.md`
- `GOVERNANCE_CANONICAL.md`
- `GOVERNANCE_CANONICALIZATION_QUEUE.md`
- `GOVERNANCE_CLEANUP_CANDIDATES.md`
- `GOVERNANCE_CLOSEOUT_ROADMAP.md`
- `GOVERNANCE_CONSOLIDATION_DECISION_MATRIX.md`
- `GOVERNANCE_DEDICATED_MERGE_DELETE_PLAN.md`
- `GOVERNANCE_DEEP_DEDUP_ANALYSIS_MATRIX.md`
- `GOVERNANCE_DUPLICATE_CONTRADICTION_REGISTER.md`
- `GOVERNANCE_FILE_CLASSIFICATION_MATRIX.md`
- `GOVERNANCE_MASTER_CONTROL_PLANE.md`
- `GOVERNANCE_MERGE_DECISIONS.md`
- `GOVERNANCE_PACKAGE_MANIFEST.json`
- `GOVERNANCE_REORGANIZATION_LEDGER.md` remains at root as transitional trace, not canonical authority
- `GOVERNANCE_TECHNICAL_DEBT_PRIORITIZATION_MATRIX.md`
- `LEGACY_REFERENCE_CLEANUP_MATRIX.md`
- `TAMAGUI_UI_KIT_REACT_NATIVE_BRIDGE_CLASSIFICATION.json`

`GOVERNANCE_REORGANIZATION_LEDGER.md` remains mandatory structural trace, but it is not canonical policy authority.

## Closure Rule

No governance consolidation is accepted without:

- a governance root count of exactly 20 files total
- clean `git --no-pager diff --check`
- explicit merge and archive entries in `GOVERNANCE_REORGANIZATION_LEDGER.md`
- verification that archived files no longer compete with active authority
- no unsupported claim of `READY`, `FINAL`, `CLOSED`, or `100%`

This index is binding for governance-file authority routing.

