# PHASE_EXECUTION_INDEX

## Purpose

This directory converts governing law into literal execution.

Use it when you need:

- exact phase order
- exact artifact expectations
- exact handoff rules
- exact gate companions
- a clear split between constitutional law and execution grammar

## Authority Split

- the main guide owns law, naming, ownership, boundaries, and adoption rules
- `docs/bootstrap/` owns bootstrap execution order and bootstrap gates for Phases `00` through `07`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md` owns cross-phase execution grammar for Phases `08` through `18`
- `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md` owns cross-phase execution grammar for Phases `19` through `24`
- `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md` owns gates for Phases `08` through `24`
- `docs/execution/phases/` owns literal phase manuals for Phases `00` through `27`

If a phase manual conflicts with constitutional law, the main guide wins.
If the main guide is intentionally abstract about exact action order inside a lawful phase, the relevant runbook and phase manual win.

## How To Use This Stack

1. confirm the current lawful phase in the main guide
2. open the runbook for the current lifecycle band
3. open the matching phase manual
4. execute entry checks before writing artifacts
5. update the correct service layer: `docs/services/<service>/` or `kdt/factory/<service>/`
6. run the matching gate before claiming completion
7. deposit evidence before opening the next phase

## Companion Files In This Directory

- `BTHWANI GUIDE — Generic Screen Execution Runbook.md`
- `BTHWANI GUIDE — Binding And Runtime Execution Runbook.md`
- `BTHWANI GUIDE — Post-Bootstrap Gate Pack.md`

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

### Service Truth And Screen Law Band

- `PHASE_08_ACTOR_CONTEXT_LOCK.md`
- `PHASE_09_OPERATION_LOCK.md`
- `PHASE_10_SURFACE_RESPONSIBILITY_LOCK.md`
- `PHASE_11_JOURNEY_LOCK.md`
- `PHASE_12_SCREEN_INVENTORY_AND_RATIONALIZATION.md`
- `PHASE_13_SCREEN_PURPOSE_LOCK.md`
- `PHASE_14_FLOW_COMPRESSION.md`

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

Some early DSH packs were created before this stronger execution stack existed.
When revisiting them:

- extend them in place where practical
- normalize toward the current manuals and runbooks
- do not rename blindly if doing so would break traceability without adding real value

## Layer Reminder

- `docs/services/<service>/` = stable service-foundation layer
- `kdt/factory/<service>/` = detailed execution layer

Do not confuse those two layers while executing service phases.