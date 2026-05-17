# DSH V6 Phase 2 — Skeleton Wiring Evidence

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## Scope

Phase 2 audits every skeleton-status gap row and classifies each file's wiring state. "Wired" means: file exists, exported from its module index, and imported/consumed by the parent screen or surface routing.

---

## Summary

| Classification | Count | Gap IDs |
|---|---|---|
| WIRED_NEEDS_VISUAL_REVIEW | 5 | ML-001, ML-005, ML-009, ML-029, ML-031 |
| WIRED_BLOCKED_BY_CONTRACT | 7 | ML-006, ML-017, ML-018, ML-019, ML-020, ML-026, ML-018 |
| WIRED_BLOCKED_BY_WLT | 1 | ML-008 |
| REGISTERED_NOT_INTEGRATED | 1 | ML-025 |
| EXPORTED_NOT_MOUNTED_BLOCKED_BY_CONTRACT | 14 | ML-007, ML-016, ML-024, ML-032, ML-033, ML-034, ML-038, ML-046, ML-047, ML-048, ML-049, ML-050, ML-051, ML-052 |
| EXPORTED_NOT_MOUNTED_BLOCKED_BY_WLT | 6 | ML-040, ML-041, ML-042, ML-043, ML-044, ML-045 |
| ORPHAN_SKELETON | 2 | ML-002, ML-035 |

Total classified: 36 rows (34 SKELETON_ADDED + 1 WIRED + 1 WIRED_IN_FLOW from Phase 1)

---

## Orphan skeletons requiring Phase 3 wiring

### ML-002 — DocumentVerificationSection.tsx

- **File:** `dsh/frontend/app-field/sections/DocumentVerificationSection.tsx`
- **Problem:** File exports `DocumentVerificationSection` but is not imported by `DshFieldStoreOnboardingScreen.tsx` and has no `sections/index.ts` for re-export
- **V6 action:** Create `app-field/sections/index.ts` exporting `DocumentVerificationSection`; add import in `DshFieldStoreOnboardingScreen.tsx`

### ML-035 — AuditTrailDetailWorkspace.tsx

- **File:** `dsh/frontend/control-panel/operations/AuditTrailDetailWorkspace.tsx`
- **Problem:** File exports `AuditTrailDetailWorkspace` but is not exported from `control-panel/operations/index.ts` and not imported by `AuditSupportSlaScreen.tsx`
- **V6 action:** Add export to `control-panel/operations/index.ts`; verify AuditSupportSlaScreen references it

---

## Registered-not-integrated

### ML-025 — DshCaptainMapScreen.tsx

- **File:** `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx`
- **Registry:** Registered in `dsh-captain.screen-registry.ts` as `captain.dsh.orders.map`
- **Problem:** Screen is registered but not linked from `DshCaptainPickupDropoffScreen.tsx` — no navigation trigger exists
- **V6 action:** Add map navigation trigger in DshCaptainPickupDropoffScreen (Phase 3)

---

## Exported-not-mounted (all BLOCKED — no action needed in V6)

These 20 skeleton files are properly exported from their module indexes but not mounted in runtime routing because their API contracts are not proven. No V6 code change needed — they will be mounted when contracts are proven.

| Gap | File | Blocker |
|---|---|---|
| ML-007 | app-client/sheets/CancelOrderSheet.tsx | CG-009 |
| ML-016 | app-partner/sheets/AcceptanceTimerSheet.tsx | CG-021 |
| ML-024 | app-captain/sheets/OfferDeclineSheet.tsx | CG-015 |
| ML-032/ML-050 | OpsClientMessagingWorkspace.tsx | CG-030/031 |
| ML-033/ML-051 | OpsPartnerMessagingWorkspace.tsx | CG-030/031 |
| ML-034/ML-052 | OpsCaptainMessagingWorkspace.tsx | CG-030/031 |
| ML-038 | PartnerDeactivationWorkspace.tsx | partner mgmt API |
| ML-040 | PartnerSettlementWorkspace.tsx | WLT CG-033 |
| ML-041 | CaptainPayoutWorkspace.tsx | WLT CG-034 |
| ML-042 | RefundQueueWorkspace.tsx | WLT CG-035 |
| ML-043 | CommissionBreakdownWorkspace.tsx | WLT commission bridge |
| ML-044 | PlatformFeeAuditWorkspace.tsx | WLT fee bridge |
| ML-045 | FieldCommissionWorkspace.tsx | WLT field commission |
| ML-046 | SupportTicketListScreen.tsx | CG-032 |
| ML-047 | SupportTicketDetailWorkspace.tsx | CG-032 |
| ML-048 | SupportSlaDashboardScreen.tsx | SLA metrics API |
| ML-049 | SupportEscalationQueueScreen.tsx | CG-032 |

---

## Gate result

| Check | Result |
|---|---|
| All skeleton rows classified | YES — 36/36 |
| Orphan skeletons identified | 2 (ML-002, ML-035) — will be wired in Phase 3 |
| No new orphans created in V6 | YES |
| Registered-not-integrated | 1 (ML-025) — integration trigger added in Phase 3 |

```
PHASE_2_GATE: GREEN — 2 orphans and 1 integration gap to be resolved in Phase 3
```
