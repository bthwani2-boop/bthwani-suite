# 11_DONOR_DRIFT_DUPLICATION_REPORT

## Executive Summary

The donor DSH service is rich enough to recover truth from, but it is not numerically or structurally clean enough for blind carryover.

## Confirmed Drift Clusters

### 1. Operation Count Drift

- `DSH_SERVICE_SCOPE.md` still states `92` in-scope operations.
- `services/dsh/governance/operations/` currently exposes `96` dossier folders.
- `DSH_OPERATION_CATALOG.csv` currently exposes `98` rows.
- Risk: any downstream claim of donor numerical completeness is false unless the contradiction is recorded explicitly.

### 2. Shadow Governance Drift

- donor `services/dsh/governance/service-level/**` duplicates core service-level files.
- parity between the parent governance root and the shadow copy is not proven.
- Risk: two documentary roots can silently compete as truth.

### 3. Surface Sprawl And Screen Inflation

- donor census exposes `129` `surface_screen_auto` rows plus `19` web route shells and additional shared/support screens.
- clean target shell currently exposes `20` retained preview candidates only.
- Risk: donor route volume can be mistaken for clean target route necessity.

### 4. Boundary Leakage Toward Finance And Internal Ops

- donor route set includes `finance/dsh`, `analytics/dsh-orders`, `partner/store`, and service-catalog entries under MCPW.
- donor service scope also lets many operations appear in MCPW even when ownership belongs elsewhere.
- Risk: `control-panel` becomes a second execution app and `WLT` boundaries blur.

### 5. Controller-Level Runtime Noise

- donor `dsh.controller.ts` mixes endpoint evidence with in-memory maps, mock captain pools, pseudo-runtime state, and local helper logic.
- Risk: accidental carryover of mock or local-prod behavior into clean runtime truth.

## Confirmed Anti-Patterns

- one service, multiple numerical truths
- shadow governance copy without parity proof
- route-tree inflation disguised as scope coverage
- internal-ops mirror pressure against real actor ownership
- controller-centered state and runtime mixing

## Prevention Rules For The New Repo

- keep one numerical truth per service pack and record drift immediately when it appears
- keep one documentary root per active pack; shadow copies must remain reference-only until parity is proven
- compress donor screen sprawl into explicit canonical candidates before any implementation planning
- keep `control-panel` oversight-only unless a family is explicitly internal by evidence
- keep runtime truth out of controllers and out of `packages/surfaces`

## Final Verdict

- donor reference value: `HIGH`
- donor implant readiness: `LOW`
- clean target default: `REBUILD_CLEAN`