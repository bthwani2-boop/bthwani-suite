# PHASE_EXECUTION_INDEX

## Purpose

This directory is the execution operating system for post-bootstrap work.

Use it when you need:

- exact phase order
- exact artifact expectations
- exact handoff rules
- exact master-registry requirements
- exact grouping and build-order enforcement
- exact gate companions
- a clean split between constitutional law and literal manual procedure

## Authority Split

- the main guide owns law, naming, ownership, repo boundaries, and adoption rules
- `docs/bootstrap/` owns bootstrap execution order and bootstrap gates for Phases `00` through `07`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md` owns cross-phase execution grammar for Phases `08` through `18`
- `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md` owns cross-phase execution grammar for Phases `19` through `24`
- `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md` owns gates for Phases `08` through `24`
- `docs/execution/phases/` owns literal phase manuals for Phases `00` through `27`

If a phase manual conflicts with constitutional law, the main guide wins.
If constitutional law is intentionally abstract inside a lawful phase, the runbook and the phase manual win.

## Execution Reset Rule

Treat any post-bootstrap artifact built against the old `PHASE_08_ACTOR_CONTEXT_LOCK` through `PHASE_14_FLOW_COMPRESSION` model as `REFERENCE_ONLY` until it passes the new donor-coverage, registry-completeness, and handoff-integrity checks.

Treat the entire current execution package as `UNTRUSTED` until the current phase manual and current gate jointly prove:

- exact required artifacts exist under the exact required names
- required schema fields and exact markdown sections exist
- completion counts, duplicate checks, orphan checks, unmapped checks, contradiction checks, and handoff-integrity checks are explicit
- no completion claim depends on preview browseability, partial overlap, or qualitative narrative alone

No pack may satisfy a current gate by name similarity, file existence, or partial overlap alone.

## How To Use This Stack

1. confirm the current lawful phase in the main guide
2. open the runbook for the current lifecycle band
3. open the matching phase manual
4. confirm exact inputs and exact source-of-truth inputs exist before writing anything
5. confirm the donor source root is available for the current service if the phase requires exhaustive recovery
6. execute the manual work procedure exactly in order
7. run the matching gate before claiming completion
8. deposit evidence before opening the next phase
9. mark any unproven claim as `BLOCKED`, `GAP`, or `UNPROVEN`

## Companion Files In This Directory

- `BTHWANI GUIDE — Generic Screen Execution Runbook.md`
- `BTHWANI GUIDE — Binding And Runtime Execution Runbook.md`
- `BTHWANI GUIDE — Post-Bootstrap Gate Pack.md`

## Reset Diagnostic Pack

For the cross-service forensic reset record, use:

- `kdt/factory/_cross-service/index/EXECUTION_PACKAGE_RESET_INDEX.md`

## Phase Manual Set

### Bootstrap Band

- `PHASE_00_REPO_RESET_DECISION.md`
- `PHASE_01_GOVERNANCE_FREEZE.md`
- `PHASE_02_REALITY_INTAKE.md`
- `PHASE_03_PLATFORM_VALUE_LOCK.md`
- `PHASE_04_SERVICE_ORDER.md`
- `PHASE_05_MASTER_FOUNDATION_MINIMAL.md`
- `PHASE_06_UI_KIT_FOUNDATION.md`
- `PHASE_07_FIRST_SERVICE_FOUNDATION.md`

### Service Truth Recovery And Screen Operability Band

- `PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION.md`
- `PHASE_09_OPERATION_MASTER_EXTRACTION.md`
- `PHASE_10_SURFACE_COVERAGE_AND_WAVE_MATRIX.md`
- `PHASE_11_JOURNEY_CHAIN_MASTER.md`
- `PHASE_12_SCREEN_MASTER_CENSUS_AND_NORMALIZATION.md`
- `PHASE_13_SCREEN_SPEC_AND_PURPOSE_SYSTEM.md`
- `PHASE_14_GROUPING_AND_BUILD_ORDER.md`

### Screen Expansion And Contract Demand Band

- `PHASE_15_UI_KIT_EXPANSION.md`
- `PHASE_16_STATE_LOCK.md`
- `PHASE_17_SCREEN_API_MATRIX.md`
- `PHASE_18_GAP_MAP.md`

### Contract To Binding Band

- `PHASE_19_MASTER_CONTRACT_UPDATE.md`
- `PHASE_20_GENERATE_VERIFY.md`
- `PHASE_21_BINDING_LOCK.md`

### Runtime Proof And Closure Band

- `PHASE_22_RUNTIME_TRUTH_LOCK.md`
- `PHASE_23_RUNTIME_MODE_POLICY.md`
- `PHASE_24_PRODUCTION_LIKE_VERIFICATION.md`
- `PHASE_25_EVIDENCE_AND_SIGN_OFF.md`
- `PHASE_26_LEGACY_QUARANTINE.md`
- `PHASE_27_NEXT_SERVICE_REPEAT.md`

## Compatibility Note

Existing `kdt/factory/dsh/`, `docs/services/dsh/`, and `packages/surfaces/docs/PHASE_12_SCOPE.md` material that references the old Phase `08` through Phase `14` model is not deleted automatically by this index.

Current rule:

- use those artifacts as evidence or migration input only
- do not use them as direct completion proof for the rebuilt execution band
- migrate or quarantine them explicitly before reuse

## Layer Reminder

- `docs/services/<service>/` = stable service-foundation layer
- `kdt/factory/<service>/` = detailed execution layer

Do not confuse those two layers while executing service phases.