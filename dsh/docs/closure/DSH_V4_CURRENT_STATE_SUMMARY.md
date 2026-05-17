# DSH V4 Current State Summary

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## Gap status (post V4-1 repair)

| Status | Count | Note |
|---|---|---|
| SKELETON_ADDED_NEEDS_VISUAL_REVIEW | 31 | Skeleton exists; visual review needed |
| NEEDS_SKELETON | 12 | No skeleton yet — P2 deferred or P1 pending |
| NEEDS_DESIGN | 11 | State/section must be added to existing screen |
| **Total** | **54** | All gaps tracked |

## Priority breakdown

| Priority | Count | Key areas |
|---|---|---|
| P0 | 13 | Captain map, partner ready-state, refund visibility, settlement, payout, support queue |
| P1 | 36 | Messaging, timers, states, screens |
| P2 | 5 | ML-012, ML-013, ML-014, ML-023, ML-039 — all deferred |

## Surface coverage

| Surface | Registered screens | Skeleton/design needed | Runtime proven |
|---|---|---|---|
| app-client | 22 | 10 gaps | 0 |
| app-partner | 14 | 8 gaps | 0 |
| app-captain | 18 | 8 gaps | 0 |
| app-field | 9 | 5 gaps | 0 |
| control-panel | varies | 23 gaps | 0 |
| **Total** | **63** | **54 gaps** | **0** |

No screen is runtime-proven. All are UI_PREVIEW_ONLY. No API contract is proven.

## Contract gap summary

- 36 API contract gaps (CG-001..CG-036)
- P0 contract gaps: 22
- P1 contract gaps: 14
- All status: NEEDS_CONTRACT_GAP — OpenAPI not yet touched

## Skeleton inventory

- 17 unreferenced skeleton files identified
- All 17 will be classified in DSH_SKELETON_WIRING_MATRIX.csv (V4-2)

## TODO markers

- 21 TODO markers in 18 DSH source files
- All are contract-blocker notes (CG-series or WLT bridge)
- No TODO is in a file changed in V4

## Key blockers

1. **API contracts not proven** — all 63 screens are UI_PREVIEW_ONLY
2. **WLT bridge not ready** — finance workspaces, refund status, captain payout, partner settlement all BLOCKED_BY_WLT
3. **god-file risk** — DshCaptainSurface.tsx hosts 7 screens; split deferred to Loop 5

## What V4 can do

- V4-2: Wire 17 skeletons to surface indexes → classify in matrix
- V4-3: Confirm taxonomy conformance; create sheets indexes
- V4-4: Apply safe preliminary design baseline to P0/P1 screens
- V4-5: Produce final human review gate evidence
