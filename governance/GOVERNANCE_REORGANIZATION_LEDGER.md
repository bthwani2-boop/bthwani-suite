# Governance Reorganization Ledger

Status: ACTIVE_CANONICAL_LEDGER
Owner: BThwani Governance
Scope: governance merge, archive, alias, replacement, and delete-candidate decisions

## Purpose

This ledger records every structural governance decision made during control-plane cleanup.

No governance file may be merged, downgraded, archived, replaced, or marked as a later deletion candidate without an entry here.

## Decision Types

Allowed decision types:

- KEEP_CANONICAL
- REWRITE_CANONICAL
- MERGE_INTO_CANONICAL
- DOWNGRADE_TO_ALIAS
- MOVE_TO_ARCHIVE
- KEEP_AS_ARCHIVE
- DELETE_CANDIDATE_LATER
- DELETE_APPROVED

## Required Fields

Each entry must record:

- source path
- target path
- decision type
- reason
- proof status
- external reference impact
- current status
- notes

## Proof Status Vocabulary

Use one of:

- PROVEN_SAFE
- SAFE_WITH_ALIAS
- NEEDS_REFERENCE_REPAIR
- NEEDS_ARCHIVE_MOVE
- NEEDS_OWNER_DECISION
- BLOCKED_BY_ACTIVE_REFERENCE

## Active Entries

| source_path | target_path | decision_type | reason | proof_status | external_reference_impact | current_status | notes |
|---|---|---|---|---|---|---|---|
| `governance/README.md` | `governance/README.md` | REWRITE_CANONICAL | Promote the directory entry into a true control-plane gateway instead of a phase note. | PROVEN_SAFE | NONE | COMPLETED | First slice implementation. |
| `governance/00_GOVERNANCE_INDEX.md` | `governance/00_GOVERNANCE_INDEX.md` | REWRITE_CANONICAL | Convert the index into the live classification matrix for canonical, transitional, alias, and archive content. | PROVEN_SAFE | LOW | COMPLETED | Remains path-stable for guard references while classifications continue to evolve. |
| `governance/GOVERNANCE_CONTROL_PLANE_STANDARD.md` | `governance/GOVERNANCE_CONTROL_PLANE_STANDARD.md` | REWRITE_CANONICAL | Make the file the explicit organization law for policies, standards, ledgers, archives, and alias files. | PROVEN_SAFE | NONE | COMPLETED | Control-plane organization law now anchors the governance package. |
| `governance/DIRECTION_I18N_OWNERSHIP.md` | `governance/DIRECTION_I18N_OWNERSHIP.md` | REWRITE_CANONICAL | Remove bootstrap-only metadata and convert direction ownership into a stable canonical policy. | PROVEN_SAFE | NONE | COMPLETED | Path kept stable; canonical owner and local consumer boundaries are now explicit. |
| `governance/20_SHARED_AND_STRUCTURE_BOUNDARY_CONTRACT.md` | `governance/03_PACKAGE_BOUNDARY_CONTRACT.md` and `governance/09_SHARED_FOLDER_GOVERNANCE.md` | MERGE_INTO_CANONICAL | Deep placement and shared-structure rules should not remain a parallel boundary authority beside the main package boundary contract and shared-folder law. | PROVEN_SAFE | NONE | COMPLETED | Unique placement and remediation rules merged into `03`; `GUARD_02` now points to `03` and `09`; file removed from the governance root. |
| `governance/05_APP_SHELLS_CONTRACT.md` | `governance/04_APPS_SHELL_ONLY_CONTRACT.md` | MERGE_INTO_CANONICAL | App-host and app-shell shell-only rules should not remain split across two adjacent boundary authorities. | PROVEN_SAFE | NONE | COMPLETED | Unique shell-composition, shared-shell, and surface-composition rules merged into `04`; guard config and package-boundary references now point to the surviving canonical file. |
| `governance/EVIDENCE_ROOT_RULE.md` | `governance/02_BRANCH_AND_EVIDENCE_POLICY.md` and `governance/18_EVIDENCE_PACK_STANDARD.md` | MERGE_INTO_CANONICAL | The file duplicates evidence-root authority and still contains bootstrap-only header metadata. | PROVEN_SAFE | NONE | COMPLETED | Alias removed after zero-live-consumer sweep across live governance, `.github/**`, `tools/guards/**`, and `tools/scripts/**`. |
| `governance/GOVERNANCE_SSOT_POLICY.md` | `governance/00_GOVERNANCE_INDEX.md` and `governance/GOVERNANCE_CLOSURE_STANDARD.md` | MERGE_INTO_CANONICAL | Source-of-truth rules should live in the control-plane index and closure standard, not a parallel file. | PROVEN_SAFE | NONE | COMPLETED | Alias removed after zero-live-consumer sweep across live governance, `.github/**`, `tools/guards/**`, and `tools/scripts/**`. |
| `governance/AGENT_GOVERNANCE_POLICY.md` | `governance/14_AGENT_EXECUTION_RULES.md` | MERGE_INTO_CANONICAL | Agent execution authority must be singular. Current file overlaps heavily with execution rules and patch review law. | SAFE_WITH_ALIAS | HIGH | COMPLETED | Canonical content merged; file downgraded to alias note pending reference repair in `.github/**` and `tools/scripts/**`. |
| `governance/EXECUTION_LAW.md` | `governance/14_AGENT_EXECUTION_RULES.md` | MERGE_INTO_CANONICAL | Phase, batching, and stop-condition rules should be subordinate to the main AI execution contract. | PROVEN_SAFE | NONE | COMPLETED | Alias removed after zero-live-consumer sweep across live governance, `.github/**`, `tools/guards/**`, and `tools/scripts/**`. |
| `governance/19_PATCH_REVIEW_PROTOCOL.md` | `governance/14_AGENT_EXECUTION_RULES.md` | MERGE_INTO_CANONICAL | Patch review must not remain a second active authority beside the AI execution law. | SAFE_WITH_ALIAS | MEDIUM | COMPLETED | Canonical patch-review rules merged; file downgraded to alias note because guard configuration still references the path. |
| `governance/SERVICE_CLOSURE_STANDARD.md` | `governance/10_SERVICE_CLOSURE_PROTOCOL.md` | MERGE_INTO_CANONICAL | Service closure should have one operational authority file. | PROVEN_SAFE | NONE | COMPLETED | Alias removed after zero-live-consumer sweep across live governance, `.github/**`, `tools/guards/**`, and `tools/scripts/**`. |
| `governance/GUARDS.md` | `governance/GOVERNANCE_GUARD_CATALOG.md` | MERGE_INTO_CANONICAL | Guard text governance must point to one catalog instead of a second overview file. | SAFE_WITH_ALIAS | MEDIUM | COMPLETED | Overview and GUARD-01 calibration merged into the catalog; file downgraded to alias note because guard config still references the path. |
| `governance/WARNING_BASELINE_CLASSIFICATION_POLICY.md` | `governance/WARNING_CLASSIFICATION_POLICY.md` | MERGE_INTO_CANONICAL | Warning classification must have one active authority. | PROVEN_SAFE | NONE | COMPLETED | Alias removed after zero-live-consumer sweep across live governance, `.github/**`, `tools/guards/**`, and `tools/scripts/**`. |
| `governance/MOVE_DONT_DELETE.md` | `governance/LEGACY_REFERENCE_CLEANUP_POLICY.md` | MERGE_INTO_CANONICAL | Deletion safety belongs with cleanup and deprecation governance, not a standalone bootstrap note. | PROVEN_SAFE | NONE | COMPLETED | Alias removed after zero-live-consumer sweep across live governance, `.github/**`, `tools/guards/**`, and `tools/scripts/**`. |
| `governance/BATCH_06_REFERENCE_REMEDIATION_LEDGER.md` | `governance/archive/batches/BATCH_06_REFERENCE_REMEDIATION_LEDGER.md` | MOVE_TO_ARCHIVE | Batch ledgers are historical evidence, not active policy authority. | PROVEN_SAFE | NONE | COMPLETED | Moved under `archive/batches/` to remove historical noise from the active governance root. |
| `governance/BATCH_07_ACTIVE_REFERENCE_CLOSE_LEDGER.md` | `governance/archive/batches/BATCH_07_ACTIVE_REFERENCE_CLOSE_LEDGER.md` | MOVE_TO_ARCHIVE | Batch ledgers are historical evidence, not active policy authority. | PROVEN_SAFE | NONE | COMPLETED | Moved under `archive/batches/` to remove historical noise from the active governance root. |
| `governance/BATCH_08_FINAL_DELETION_LEDGER.md` | `governance/archive/batches/BATCH_08_FINAL_DELETION_LEDGER.md` | MOVE_TO_ARCHIVE | Batch ledgers are historical evidence, not active policy authority. | PROVEN_SAFE | NONE | COMPLETED | Moved under `archive/batches/` to remove historical noise from the active governance root. |
| `governance/BATCH_11_GOVERNANCE_REBUILD_LEDGER.md` | `governance/archive/batches/BATCH_11_GOVERNANCE_REBUILD_LEDGER.md` | MOVE_TO_ARCHIVE | Batch ledgers are historical evidence, not active policy authority. | PROVEN_SAFE | NONE | COMPLETED | Moved under `archive/batches/` to remove historical noise from the active governance root. |
| `governance/legacy-extracted/**` | `governance/archive/legacy-extracted/` | MOVE_TO_ARCHIVE | Extracted legacy material is historical source material only and must not compete with canonical governance. | PROVEN_SAFE | LOW | COMPLETED | Root moved under `archive/legacy-extracted/`; governance, guard config, and agent references were repaired. |

## Current Slice Note

This session completed control-plane entry rewrites plus targeted canonical merges for evidence, agent execution, service closure, warning classification, cleanup safety, guard overview governance, and direction ownership normalization.

The batch-ledger and `legacy-extracted/` archive moves are complete. Zero-live-consumer alias cleanup is now complete for `EXECUTION_LAW.md`, `EVIDENCE_ROOT_RULE.md`, `SERVICE_CLOSURE_STANDARD.md`, `MOVE_DONT_DELETE.md`, `GOVERNANCE_SSOT_POLICY.md`, and `WARNING_BASELINE_CLASSIFICATION_POLICY.md`. Boundary consolidation is also underway: `20_SHARED_AND_STRUCTURE_BOUNDARY_CONTRACT.md` has been absorbed into `03_PACKAGE_BOUNDARY_CONTRACT.md`, and `05_APP_SHELLS_CONTRACT.md` has been absorbed into `04_APPS_SHELL_ONLY_CONTRACT.md`. Remaining later work is external reference repair for higher-fan-out transitional aliases plus any further boundary consolidation that still survives the same proof standard.