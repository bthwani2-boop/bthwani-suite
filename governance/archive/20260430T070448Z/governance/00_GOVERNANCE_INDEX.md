---
generatedFrom: governance/00_GOVERNANCE_INDEX.md
generatedAt: 2026-04-30T04:48:37.1112843+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# BThwani Governance Index

Status: CANONICAL_INDEX
Owner: BThwani Governance
Scope: canonical file classification, reading order, and authority routing

## How To Use This Index

This file classifies governance content into four authority states:

- `CANONICAL` — active authority for its subject
- `CANONICAL_NEEDS_NORMALIZATION` — active authority, but still needs rewrite or consolidation
- `TRANSITIONAL_ALIAS_OR_SUBORDINATE` — may still exist, but must not compete with a stronger canonical file
- `ARCHIVE_ONLY` — historical material only, never active authority

If a file is not listed here as canonical or canonical-needs-normalization, it must not be treated as a sovereign governance source.

## Canonical Roots

| Root | Role | Authority |
|---|---|---|
| `governance/` | Canonical governance control plane | CANONICAL |
| `tools/guards/` | Executable guard implementation | IMPLEMENTATION_ONLY |
| `tools/scripts/` | Controlled automation and diagnostics | IMPLEMENTATION_ONLY |
| `tools/registry/runs/` | Evidence output root | CANONICAL_OUTPUT_ONLY |
| `.github/workflows/` | CI enforcement | ENFORCEMENT_ONLY |
| `.github/agents/` | Agent operational behavior | DERIVED_ONLY |
| `.github/skills/` | Skill operational behavior | DERIVED_ONLY |

## Canonical Reading Order

| Order | File | Role | Status |
|---|---|---|---|
| 1 | `README.md` | control-plane entry | CANONICAL |
| 2 | `00_GOVERNANCE_INDEX.md` | authority classification index | CANONICAL |
| 3 | `GOVERNANCE_CONTROL_PLANE_STANDARD.md` | control-plane organization law | CANONICAL |
| 4 | `GOVERNANCE_REORGANIZATION_LEDGER.md` | structural cleanup ledger | CANONICAL |
| 5 | `02_BRANCH_AND_EVIDENCE_POLICY.md` | branch, checkpoint, and evidence workflow | CANONICAL |
| 6 | `18_EVIDENCE_PACK_STANDARD.md` | evidence pack schema | CANONICAL |
| 7 | `GOVERNANCE_CLOSURE_STANDARD.md` | closure and decision binding law | CANONICAL |
| 8 | `14_AGENT_EXECUTION_RULES.md` | AI execution and patch safety law | CANONICAL |
| 9 | `16_SECURITY_AND_SECRETS_POLICY.md` | security and secrets law | CANONICAL |
| 10 | `GOVERNANCE_GUARD_CATALOG.md` | guard authority catalog | CANONICAL |

## Canonical Domain Files

| File | Domain | Status | Notes |
|---|---|---|---|
| `01_PLATFORM_SSOT.md` | repository identity and ownership ladder | CANONICAL | Active platform truth. |
| `03_PACKAGE_BOUNDARY_CONTRACT.md` | package and structure boundaries | CANONICAL | Boundary, placement, and correction law. |
| `04_APPS_SHELL_ONLY_CONTRACT.md` | app host and app-shell boundary | CANONICAL | Combined host and shell ownership law. |
| `06_SURFACES_OWNERSHIP_CONTRACT.md` | surfaces ownership | CANONICAL | Surface ownership law. |
| `07_UI_KIT_AUTHORITY_CONTRACT.md` | ui-kit sovereignty | CANONICAL | Design authority law. |
| `08_SCREEN_FILE_MODEL_CONTRACT.md` | screen and route structure | CANONICAL | Screen model law. |
| `09_SHARED_FOLDER_GOVERNANCE.md` | shared folder governance | CANONICAL | Shared ownership law. |
| `10_SERVICE_CLOSURE_PROTOCOL.md` | service closure workflow | CANONICAL | Canonical service closure authority after merge. |
| `12_API_BINDING_RUNTIME_PROTOCOL.md` | API to binding order | CANONICAL | Order and ownership law. |
| `13_CI_GATES_CONTRACT.md` | CI and local gates | CANONICAL | Enforcement contract. |
| `17_TESTING_AND_PRODUCTION_READINESS.md` | verification ladder | CANONICAL | Testing and readiness law. |
| `RUNTIME_VERIFICATION_POLICY.md` | runtime proof rules | CANONICAL | Runtime-specific authority. |
| `TRACEABILITY_MATRIX_STANDARD.md` | requirement-to-proof traceability | CANONICAL | Distinct standard until proven redundant. |
| `SERVICE_BLUEPRINT_STANDARD.md` | live service blueprint structure | CANONICAL | Distinct from closure workflow. |
| `WARNING_CLASSIFICATION_POLICY.md` | warning taxonomy and promotion | CANONICAL | Primary warning authority. |
| `LEGACY_REFERENCE_CLEANUP_POLICY.md` | cleanup and deprecation law | CANONICAL | Primary cleanup authority. |
| `API_CONTRACT_POLICY.md` | API contract quality rules | CANONICAL | Contract authority. |
| `DIRECTION_I18N_OWNERSHIP.md` | i18n and direction ownership | CANONICAL | Canonical ownership rule for shared direction and reusable i18n foundations. |

## Transitional Alias Or Subordinate Files

| File or group | Canonical target | Why it is not sovereign |
|---|---|---|
| `AGENT_GOVERNANCE_POLICY.md` | `14_AGENT_EXECUTION_RULES.md` | Overlaps heavily with the AI execution law and still has active external references. |
| `19_PATCH_REVIEW_PROTOCOL.md` | `14_AGENT_EXECUTION_RULES.md` | Canonical patch-review authority has been merged into the AI execution law; the path remains only as an alias until guard references are repaired. |
| `GUARDS.md` | `GOVERNANCE_GUARD_CATALOG.md` | Overlapping overview and GUARD-01 calibration were merged; this path remains only as a transitional alias. |
| `GOVERNANCE_GUARD_EXECUTION_STANDARD.md` | `GOVERNANCE_GUARD_CATALOG.md` | Guard lifecycle standard remains active, but live inventory is owned only by the catalog. |
| `GUARD_*.md` | `GOVERNANCE_GUARD_CATALOG.md` | Guard-specific notes are subordinate to the catalog and executable guard files. |

## Archive-Only Material

| File or root | Status | Rule |
|---|---|---|
| `archive/legacy-extracted/` | ARCHIVE_ONLY | Historical extraction source only. |
| `archive/batches/BATCH_06_REFERENCE_REMEDIATION_LEDGER.md` | ARCHIVE_ONLY | Historical batch ledger, not active authority. |
| `archive/batches/BATCH_07_ACTIVE_REFERENCE_CLOSE_LEDGER.md` | ARCHIVE_ONLY | Historical batch ledger, not active authority. |
| `archive/batches/BATCH_08_FINAL_DELETION_LEDGER.md` | ARCHIVE_ONLY | Historical batch ledger, not active authority. |
| `archive/batches/BATCH_11_GOVERNANCE_REBUILD_LEDGER.md` | ARCHIVE_ONLY | Historical batch ledger, not active authority. |

## Non-Authoritative External Roots

| Root | Status | Rule |
|---|---|---|
| `docs/governance/` | TRANSITIONAL_REFERENCE_ONLY | Cannot override governance root. |
| `.github/agents/` | DERIVED_ONLY | Must derive from canonical governance. |
| `.github/skills/` | DERIVED_ONLY | Must derive from canonical governance. |
| `tools/guards/` | EXECUTABLE_ONLY | Enforces governance, does not author it. |
| `tools/scripts/` | EXECUTABLE_ONLY | Supports governance, does not author it. |

## Closure Rule

No governance change is accepted without:

- clean `git --no-pager diff --check`
- TypeScript pass when code or config writes are involved
- applicable guard verification
- evidence under `tools/registry/runs/{SESSION_ID}` when the scope requires it
- explicit recording of merge/archive/alias/delete-candidate decisions in `GOVERNANCE_REORGANIZATION_LEDGER.md`
- no unsupported claim of `READY`, `FINAL`, `CLOSED`, or `100%`

