# DSH V7 Final Remaining Blockers

Date: 2026-05-16
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

All blockers preventing full runtime closure. These are intentional holds — NOT code defects.

---

## P0 Contract Blockers

| Blocker | Contract | Gap | Affected file | Notes |
|---|---|---|---|---|
| Client order cancellation API not proven | CG-009 | ML-007 | app-client/sheets/CancelOrderSheet.tsx | Sheet exported; not mounted; WLT refund handoff required |
| Payment result from WLT not proven | CG-004/005 | ML-006/009 | DshCheckoutIntentScreen.tsx | Error state WIRED; WLT callback not implemented; route not in DshClientSurface |
| Quote loading states | CG-004 | ML-015 | DshCheckoutIntentScreen.tsx | quote-loading state WIRED; API not proven |
| Retry on blocked state | CG-004 | ML-010 | DshCheckoutIntentScreen.tsx | retry Button WIRED; API not proven |
| Refund status WLT bridge not ready | WLT refund bridge CG-035 | ML-008 | OrdersTrackingScreens.tsx | BLOCKED_BY_WLT |
| Partner settlement WLT bridge not ready | CG-033 | ML-040 | finance/PartnerSettlementWorkspace.tsx | BLOCKED_BY_WLT; surface not mounted |
| Captain payout WLT bridge not ready | CG-034 | ML-041 | finance/CaptainPayoutWorkspace.tsx | BLOCKED_BY_WLT; surface not mounted |
| Refund queue WLT bridge not ready | CG-035+CG-030 | ML-042 | finance/RefundQueueWorkspace.tsx | BLOCKED_BY_WLT; surface not mounted |
| Support ticket API not proven | CG-032 | ML-046..ML-052 | control-panel/support/* | 7 support screens exported; surface not mounted |
| Escalation queue API not proven | CG-032 | ML-049 | support/SupportEscalationQueueScreen.tsx | BLOCKED_BY_CONTRACT |

## P1 Contract Blockers

| Blocker | Contract | Gap | Affected file | Notes |
|---|---|---|---|---|
| Captain offer decline API | CG-015 | ML-024 | app-captain/sheets/OfferDeclineSheet.tsx | Sheet not mounted |
| Partner acceptance timer API | CG-021 | ML-016 | app-partner/sheets/AcceptanceTimerSheet.tsx | Sheet not mounted |
| Captain availability API | CG-019 | ML-026 | DshCaptainSurface.tsx | Toggle state WIRED; API not proven |
| Ops↔client messaging | CG-030 | ML-050 | support/OpsClientMessagingWorkspace.tsx | Surface not mounted |
| Ops↔partner messaging | CG-030 | ML-051 | support/OpsPartnerMessagingWorkspace.tsx | Surface not mounted |
| Ops↔captain messaging | CG-031 | ML-052 | support/OpsCaptainMessagingWorkspace.tsx | Surface not mounted |
| Partner deactivation API | partner mgmt API | ML-038 | partners/PartnerDeactivationWorkspace.tsx | Surface not mounted |
| Audit trail detail API | audit detail API | ML-035 | operations/AuditTrailDetailWorkspace.tsx | NOW WIRED as toggle panel — skeleton only; data from API pending |
| Item approval API | catalog approval API | ML-053 | catalogs/ItemApprovalSection.tsx | NOW WIRED in approvals/quality tab — demo data only; API pending |
| Catalog publish API | catalog publish API | ML-054 | catalogs/CatalogPublishingGateSection.tsx | NOW WIRED in approvals/pricing tab — demo data only; API pending |
| Captain offer accept flow | CG-014 | ML-027/028 | DshCaptainOrdersScreen.tsx | Accept skeleton WIRED; offer detail state OWNER_DECISION_REQUIRED |
| Captain-assigned state API | captain assignment API | ML-021 | OrdersInboxScreen.tsx | State skeleton WIRED; API not proven |
| Captain PoD submission API | CG-018 | ML-031 | DshCaptainPoDSubmissionScreen.tsx | NOW WIRED — confirm button disabled until photo captured; photo capture API not proven |

## P0 WLT Bridge Blockers (DO NOT implement DSH-side)

| Blocker | Owner | Gap |
|---|---|---|
| WLT partner wallet bridge | WLT | ML-040 ML-042 |
| WLT captain payout bridge | WLT | ML-041 |
| WLT commission breakdown | WLT | ML-043 |
| WLT platform fee audit | WLT | ML-044 |
| WLT field commission | WLT | ML-045 |

## Owner Decisions Required (9 gaps — not code blockers, unchanged from V6)

| Decision | Gap | Notes |
|---|---|---|
| thread_type flag placement | ML-011 | God-file split required first |
| Loyalty section placement | ML-012 | Section vs standalone route decision |
| Subscriptions section placement | ML-013 | Section vs standalone route decision |
| Video reels placement | ML-014 | HomeScreen vs StoreScreen decision |
| Partner video ownership | ML-023 | Inventory vs Promotions decision |
| Offer detail state placement | ML-028 | God-file split plan approval |
| Captain support workspace split | ML-030 | God-file split plan approval |
| Auto-assign config UX | ML-036 | Which parameters to expose |
| Reassign trigger placement | ML-037 | Layout decision in ExceptionsEscalationsScreen |

## Explicitly Deferred (1 gap, unchanged)

| Gap | Reason |
|---|---|
| ML-039 PartnerPerformanceWorkspace | P2; partner analytics API not proven; deferred to Loop 8 |

## God-file Split Plan (unchanged from V6)

Documented in `DSH_V6_GOD_FILE_SPLIT_DECISIONS.md`. Three files require human owner approval:
- `OperationScreens.tsx` (app-client) — 6 screens
- `DshCaptainSurface.tsx` (app-captain) — 7 screens (now also handles map/pickup-dropoff/pod-submission)
- `PartnerHubScreen.tsx` (app-partner) — 3 screens

## Surface Architecture Decisions Required (new in V7)

| Decision | Affected files | Notes |
|---|---|---|
| DshControlPanelSurfaceHost multi-module routing | ML-001/032-052 | Extending host to mount catalogs/support/finance/partners requires architectural decision |
| DshClientSurface checkout-intent route | ML-006/009 | Mounting DshCheckoutIntentScreen requires WLT integration + CartScreen nav changes |
