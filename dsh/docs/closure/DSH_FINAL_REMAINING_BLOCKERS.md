# DSH Final Remaining Blockers

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

This file documents all blockers that prevent full runtime closure. Each blocker has a reason and a contract reference. These are NOT code defects — they are intentional holds pending API contract or WLT bridge readiness.

---

## P0 Contract Blockers

| Blocker | Contract | Gap | Affected file | Notes |
|---|---|---|---|---|
| Client order cancellation API not proven | CG-009 (POST /dsh/orders/:orderId/cancel) | ML-007 | app-client/sheets/CancelOrderSheet.tsx | Sheet exported; not mounted; WLT refund handoff required |
| Payment result from WLT not proven | CG-004 / CG-005 | ML-006 ML-009 | DshCheckoutIntentScreen.tsx | order-created state present; error state now explicit; WLT callback not implemented |
| Refund status WLT bridge not ready | WLT refund bridge (CG-035) | ML-008 | OrdersTrackingScreens.tsx | DSH must show WLT refund status read-only; WLT must expose endpoint |
| Partner settlement WLT bridge not ready | CG-033 | ML-040 | finance/PartnerSettlementWorkspace.tsx | Skeleton exported; mount when CG-033 proven |
| Captain payout WLT bridge not ready | CG-034 | ML-041 | finance/CaptainPayoutWorkspace.tsx | Skeleton exported; mount when CG-034 proven |
| Refund queue WLT bridge not ready | CG-035 + CG-030 | ML-042 | finance/RefundQueueWorkspace.tsx | Two contracts needed |
| Support ticket API not proven | CG-032 (READ+STREAM) | ML-046..ML-052 | control-panel/support/* | 7 support screens exported; none mounted |
| Escalation queue API not proven | CG-032 (READ+STREAM) | ML-049 | control-panel/support/SupportEscalationQueueScreen.tsx | Field escalation → ops inbox loop broken until proven |

## P0 WLT Bridge Blockers

| Blocker | Owner | Gap | Notes |
|---|---|---|---|
| WLT partner wallet bridge | WLT | ML-040 ML-042 | DO NOT implement DSH-side; WLT provides read bridge |
| WLT captain payout bridge | WLT | ML-041 | DO NOT implement DSH-side |
| WLT commission breakdown | WLT | ML-043 | DO NOT implement DSH-side |
| WLT platform fee audit | WLT | ML-044 | DO NOT implement DSH-side |
| WLT field commission | WLT | ML-045 | DO NOT implement DSH-side |

## P1 Contract Blockers

| Blocker | Contract | Gap | Affected file |
|---|---|---|---|
| Captain offer decline API | CG-015 | ML-024 | app-captain/sheets/OfferDeclineSheet.tsx |
| Partner acceptance timer API | CG-021 (acceptance_window_seconds) | ML-016 | app-partner/sheets/AcceptanceTimerSheet.tsx |
| Captain availability API | CG-019 | ML-026 | DshCaptainSurface.tsx or DshCaptainOrdersScreen.tsx |
| Ops↔client messaging | CG-030 | ML-050 | control-panel/support/OpsClientMessagingWorkspace.tsx |
| Ops↔partner messaging | CG-030 | ML-051 | control-panel/support/OpsPartnerMessagingWorkspace.tsx |
| Ops↔captain messaging | CG-031 | ML-052 | control-panel/support/OpsCaptainMessagingWorkspace.tsx |
| Partner deactivation API | partner mgmt API | ML-038 | control-panel/partners/PartnerDeactivationWorkspace.tsx |
| Audit trail detail API | audit detail API | ML-035 | control-panel/operations/AuditTrailDetailWorkspace.tsx |

## Source TODO markers (in unchanged files — documented here per V4-2 rule)

All 21 TODO markers in DSH source files are contract-blocker notes, NOT implementation gaps. They are in unchanged source and reference the relevant CG contract numbers above. Each TODO will be removed from source only when the corresponding contract is proven.

## Owner decisions required (not code blockers)

| Decision | Affected | Notes |
|---|---|---|
| god-file split plan | OperationScreens.tsx (6 screens); DshCaptainSurface.tsx (7 screens) | Human owner must confirm split before Loop 5 executes |
| parts/ → sections/ rename | app-client, app-partner, app-captain | Import audit required first |
| Availability toggle placement | DshCaptainSurface.tsx vs DshCaptainOrdersScreen.tsx | ML-026; ML-017 — placement decision needed |
| Partner video submission ownership | InventoryCatalogScreen vs PromotionsScreen | ML-023 — who owns the video in catalog vs promo |
