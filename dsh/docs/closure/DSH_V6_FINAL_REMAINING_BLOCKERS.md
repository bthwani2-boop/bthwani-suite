# DSH V6 Final Remaining Blockers

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

All blockers preventing full runtime closure. These are intentional holds — NOT code defects.

---

## P0 Contract Blockers (unchanged from V4 — none proven yet)

| Blocker | Contract | Gap | Affected file | Notes |
|---|---|---|---|---|
| Client order cancellation API not proven | CG-009 | ML-007 | app-client/sheets/CancelOrderSheet.tsx | Sheet exported; not mounted; WLT refund handoff required |
| Payment result from WLT not proven | CG-004/005 | ML-006/009 | DshCheckoutIntentScreen.tsx | Error state WIRED; WLT callback not implemented |
| Quote loading states | CG-004 | ML-015 | DshCheckoutIntentScreen.tsx | quote-loading state WIRED; API not proven |
| Retry on blocked state | CG-004 | ML-010 | DshCheckoutIntentScreen.tsx | retry Button WIRED; API not proven |
| Refund status WLT bridge not ready | WLT refund bridge (CG-035) | ML-008 | OrdersTrackingScreens.tsx | BLOCKED_BY_WLT |
| Partner settlement WLT bridge not ready | CG-033 | ML-040 | finance/PartnerSettlementWorkspace.tsx | BLOCKED_BY_WLT |
| Captain payout WLT bridge not ready | CG-034 | ML-041 | finance/CaptainPayoutWorkspace.tsx | BLOCKED_BY_WLT |
| Refund queue WLT bridge not ready | CG-035+CG-030 | ML-042 | finance/RefundQueueWorkspace.tsx | BLOCKED_BY_WLT |
| Support ticket API not proven | CG-032 | ML-046..ML-052 | control-panel/support/* | 7 support screens exported; none mounted |
| Escalation queue API not proven | CG-032 | ML-049 | support/SupportEscalationQueueScreen.tsx | BLOCKED_BY_CONTRACT |

## P1 Contract Blockers

| Blocker | Contract | Gap | Affected file |
|---|---|---|---|
| Captain offer decline API | CG-015 | ML-024 | app-captain/sheets/OfferDeclineSheet.tsx |
| Partner acceptance timer API | CG-021 | ML-016 | app-partner/sheets/AcceptanceTimerSheet.tsx |
| Captain availability API | CG-019 | ML-026 | DshCaptainSurface.tsx |
| Ops↔client messaging | CG-030 | ML-050 | support/OpsClientMessagingWorkspace.tsx |
| Ops↔partner messaging | CG-030 | ML-051 | support/OpsPartnerMessagingWorkspace.tsx |
| Ops↔captain messaging | CG-031 | ML-052 | support/OpsCaptainMessagingWorkspace.tsx |
| Partner deactivation API | partner mgmt API | ML-038 | partners/PartnerDeactivationWorkspace.tsx |
| Audit trail detail API | audit detail API | ML-035 | operations/AuditTrailDetailWorkspace.tsx |
| Item approval API | catalog approval API | ML-053 | catalogs/ItemApprovalSection.tsx |
| Catalog publish API | catalog publish API | ML-054 | catalogs/CatalogPublishingGateSection.tsx |
| Captain offer accept flow | CG-014 | ML-027/028 | DshCaptainOrdersScreen.tsx |
| Captain-assigned state API | captain assignment API | ML-021 | OrdersInboxScreen.tsx |

## P0 WLT Bridge Blockers (DO NOT implement DSH-side)

| Blocker | Owner | Gap |
|---|---|---|
| WLT partner wallet bridge | WLT | ML-040 ML-042 |
| WLT captain payout bridge | WLT | ML-041 |
| WLT commission breakdown | WLT | ML-043 |
| WLT platform fee audit | WLT | ML-044 |
| WLT field commission | WLT | ML-045 |

## Owner Decisions Required (9 gaps — not code blockers)

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

## Explicitly Deferred (1 gap)

| Gap | Reason |
|---|---|
| ML-039 PartnerPerformanceWorkspace | P2; partner analytics API not proven; deferred to Loop 7 |

## God-file split plan

Documented in `DSH_V6_GOD_FILE_SPLIT_DECISIONS.md`. Three files, all require human owner approval before Loop 7 split:
- `OperationScreens.tsx` (app-client) — 6 screens
- `DshCaptainSurface.tsx` (app-captain) — 7 screens
- `PartnerHubScreen.tsx` (app-partner) — 3 screens

## BLOCKED_BY_CONTRACT comments (source markers)

All 21 former TODO markers are now `BLOCKED_BY_CONTRACT` or `BLOCKED_BY_WLT` comments. Zero `TODO/FIXME/XXX` remain in `dsh/frontend`.
