# File-By-File Replacement Strategy

## Executive Verdict

The old package required a mixed strategy of `rewrite completely`, `replace`, `keep only as high-level law`, and `quarantine for migration review`.

## Replacement Matrix

| Path | Classification | Decision | Reason |
| --- | --- | --- | --- |
| `docs/execution/00_PHASE_EXECUTION_INDEX.md` | canonical execution index | rewrite completely | old phase order and terminology were weak-model dependent |
| `docs/bootstrap/BTHWANI GUIDE — Phase Bootstrap Runbook.md` | bootstrap handoff law | patch and harden | bootstrap remained structurally valid, but post-bootstrap entry language still used weak pre-registry wording |
| `docs/bootstrap/BTHWANI GUIDE — Bootstrap Gate Checklists.md` | bootstrap gate law | patch and harden | bootstrap gates needed exact preview and handoff wording under the new model |
| `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md` | canonical runbook | rewrite completely | lacked mandatory registries, grouping logic, proof logic, and explicit rejection of `TBD` |
| `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md` | canonical gate pack | rewrite completely | gates were too qualitative and did not enforce the full Phase 15-18 artifact set |
| `docs/governance/BTHWANI GUIDE — Full Unified Governing & Execution Reference.md` | constitutional reference | split and patch | governance law remained valuable, but execution lifecycle references required replacement |
| `docs/execution/phases/PHASE_07_FIRST_SERVICE_FOUNDATION.md` | bridge phase | rewrite completely | the bridge phase still used weaker non-uniform sections and needed exact proof and handoff |
| `docs/execution/phases/PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION.md` | service-truth phase manual | harden and keep | filename was correct but manual had to operate under stricter evidence grammar |
| `docs/execution/phases/PHASE_09_OPERATION_MASTER_EXTRACTION.md` | service-truth phase manual | harden and keep | filename was correct but manual had to operate under stricter evidence grammar |
| `docs/execution/phases/PHASE_10_SURFACE_COVERAGE_AND_WAVE_MATRIX.md` | service-truth phase manual | harden and keep | wave and provisional-group wording required tightening |
| `docs/execution/phases/PHASE_11_JOURNEY_CHAIN_MASTER.md` | service-truth phase manual | harden and keep | filename was correct but handoff rigor had to remain explicit |
| `docs/execution/phases/PHASE_12_SCREEN_MASTER_CENSUS_AND_NORMALIZATION.md` | service-truth phase manual | harden and keep | `TBD` had to be purged in favor of strict unresolved-status labels |
| `docs/execution/phases/PHASE_13_SCREEN_SPEC_AND_PURPOSE_SYSTEM.md` | service-truth phase manual | harden and keep | screen-spec pressure and downstream handoff wording required tightening |
| `docs/execution/phases/PHASE_14_GROUPING_AND_BUILD_ORDER.md` | service-truth phase manual | harden and keep | grouping/build-order truth needed to remain the sole lawful compression authority |
| `docs/execution/phases/PHASE_15_UI_KIT_EXPANSION.md` | downstream dependent phase | rewrite completely | it needed exact inputs, exact artifacts, exact proof, and current-scope-only shared-growth law |
| `docs/execution/phases/PHASE_16_STATE_LOCK.md` | downstream dependent phase | rewrite completely | it needed screen-state anatomy, exact proof, and bundle-scoped state coverage |
| `docs/execution/phases/PHASE_17_SCREEN_API_MATRIX.md` | downstream dependent phase | rewrite completely | it needed exact demand rows, limited-preview boundaries, and anti-vagueness enforcement |
| `docs/execution/phases/PHASE_18_GAP_MAP.md` | downstream dependent phase | rewrite completely | it needed exact contract-readiness logic and screen-proven gap records |
| `docs/execution/phases/PHASE_27_NEXT_SERVICE_REPEAT.md` | later loop phase | rewrite completely | it needed exact re-entry law, proof, and blocker handling |
| `packages/surfaces/docs/PHASE_12_SCOPE.md` | package-level companion scope | patch and reframe | the old phase meaning no longer matched the canonical execution ladder |
| `kdt/factory/dsh/**` | pre-reset service packs | quarantine for migration review | existing packs are mixed-depth and may encode old-model assumptions |

## Final Readiness Verdict

`ACCEPT_FOR_PACKAGING`