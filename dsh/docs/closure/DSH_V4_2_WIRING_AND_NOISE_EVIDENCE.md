# DSH V4-2 — Wiring Gaps and Dead/Noise Evidence

Loop: V4-2
Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## Summary of wiring changes

### Source files changed

| File | Change | Reason |
|---|---|---|
| `dsh/frontend/control-panel/support/index.ts` | Added 7 skeleton exports | ML-046..ML-052 — wire support screens to surface |
| `dsh/frontend/control-panel/finance/index.ts` | Added 6 WLT workspace exports | ML-040..ML-045 — wire finance workspaces to surface |
| `dsh/frontend/control-panel/partners/index.ts` | Added 1 workspace export + type | ML-038 — wire partner deactivation workspace |
| `dsh/frontend/app-client/sheets/index.ts` | Created — exports CancelOrderSheet | ML-007 — wire client sheet to surface API |
| `dsh/frontend/app-captain/sheets/index.ts` | Created — exports OfferDeclineSheet | ML-024 — wire captain sheet to surface API |
| `dsh/frontend/app-partner/sheets/index.ts` | Created — exports AcceptanceTimerSheet | ML-016 — wire partner sheet to surface API |

### No changes to

- Workspace .tsx files (TODOs remain in unchanged source, documented in blockers)
- dsh.openapi.yaml
- WLT source
- ui-kit source
- Screen registries (captain map was already registered)
- package.json / lockfiles / CI

---

## Skeleton classification (17 files)

| File | Gap | Status | Wiring |
|---|---|---|---|
| finance/PartnerSettlementWorkspace.tsx | ML-040 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_WLT (CG-033) |
| finance/CaptainPayoutWorkspace.tsx | ML-041 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_WLT (CG-034) |
| finance/RefundQueueWorkspace.tsx | ML-042 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_WLT (CG-035+CG-030) |
| finance/CommissionBreakdownWorkspace.tsx | ML-043 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_WLT |
| finance/PlatformFeeAuditWorkspace.tsx | ML-044 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_WLT |
| finance/FieldCommissionWorkspace.tsx | ML-045 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_WLT |
| partners/PartnerDeactivationWorkspace.tsx | ML-038 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT |
| support/SupportTicketListScreen.tsx | ML-046 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-032) |
| support/SupportTicketDetailWorkspace.tsx | ML-047 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-032) |
| support/SupportSlaDashboardScreen.tsx | ML-048 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-032) |
| support/SupportEscalationQueueScreen.tsx | ML-049 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-032) |
| support/OpsClientMessagingWorkspace.tsx | ML-050 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-030) |
| support/OpsPartnerMessagingWorkspace.tsx | ML-051 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-030) |
| support/OpsCaptainMessagingWorkspace.tsx | ML-052 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported; BLOCKED_BY_CONTRACT (CG-031) |
| app-client/sheets/CancelOrderSheet.tsx | ML-007 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported via sheets/index.ts; BLOCKED_BY_CONTRACT (CG-009) |
| app-captain/sheets/OfferDeclineSheet.tsx | ML-024 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported via sheets/index.ts; BLOCKED_BY_CONTRACT (CG-015) |
| app-partner/sheets/AcceptanceTimerSheet.tsx | ML-016 | SKELETON_ADDED_NEEDS_VISUAL_REVIEW | Exported via sheets/index.ts; BLOCKED_BY_CONTRACT (CG-021) |

**All 17 unreferenced skeletons are now classified. Zero orphan skeletons remain.**

---

## TODO marker handling

All 21 TODO markers are in **unchanged** DSH source files (only index.ts and sheets/index.ts files were changed — none of them contained TODO markers). Per V4-2 rules, TODOs in unchanged source are permitted and documented in `DSH_FINAL_REMAINING_BLOCKERS.md` (V4-5).

No TODO comment was added or introduced in V4-2.

---

## Dead/noise classification

- 7 god-file/name-clash candidates → `OWNER_DECISION_REQUIRED` (no deletion, no split without human approval)
- 5+ fixture/preview data files → `FIXTURE_PREVIEW_DATA` (archive in Loop 6, not V4)
- DshCaptainMapScreen → already `RESOLVED` in Loop 4

No files deleted. No files permanently removed.

---

## V4-2 Gate

| Check | Result |
|---|---|
| Every skeleton classified | YES — 17/17 in DSH_SKELETON_WIRING_MATRIX.csv |
| Every wired file has proof | YES — 6 index.ts files updated; 3 sheets/index.ts created |
| No orphan skeletons | YES — all classified as BLOCKED_BY_CONTRACT or BLOCKED_BY_WLT |
| No new arbitrary screens | COMPLIED |
| No OpenAPI edits | COMPLIED |
| No WLT edits | COMPLIED |
| No ui-kit edits | COMPLIED |
| No permanent deletion | COMPLIED |
| TODO markers in unchanged source only | COMPLIED |
| DSH_SKELETON_WIRING_MATRIX.csv produced | YES |
| DSH_FRONTEND_DEAD_NOISE_CLEANUP_MATRIX.csv produced | YES |

```
V4-2 GATE: GREEN
```
