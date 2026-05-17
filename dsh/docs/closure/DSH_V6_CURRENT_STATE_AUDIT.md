# DSH V6 Current-State Audit

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability
Audit basis: Read actual files — no reliance on prior READY/DONE claims

---

## 1. Git State

| Item | Value |
|---|---|
| Branch | ghb/0142-20260515-053913-verify-ui-kit-stability |
| git status --short | CLEAN — no modified or untracked files |
| git diff --name-status HEAD | EMPTY — no uncommitted changes |
| Most recent commit | 8b814ee2 chore: checkpoint dsh final closure package |

---

## 2. Forbidden Diff Check

| File / Pattern | Status |
|---|---|
| dsh/dsh.openapi.yaml | NOT changed |
| wlt/frontend/** | NOT changed |
| @bthwani/ui-kit source | NOT changed |
| package.json / lockfiles | NOT changed |
| CI / Nx / generated files | NOT changed |

All forbidden boundaries respected.

---

## 3. Source File Count

| Path | Count |
|---|---|
| dsh/frontend/**/*.tsx + *.ts | 224 files |
| dsh/docs/closure/ | 43 files |

---

## 4. Gap Map State (DSH_MISSING_LOGIC_AND_UI_GAPS.csv)

Total rows: 54 (ML-001..ML-054)

| Status | Count | Gap IDs |
|---|---|---|
| SKELETON_ADDED_NEEDS_VISUAL_REVIEW | 34 | ML-001,002,005,006,007,008,016,017,018,019,020,024,025,026,029,031,032,033,034,035,038,040,041,042,043,044,045,046,047,048,049,050,051,052 |
| NEEDS_SKELETON | 9 | ML-003,004,012,013,014,022,039,053,054 |
| NEEDS_DESIGN | 11 | ML-009,010,011,015,021,023,027,028,030,036,037 |

Phase 3 gate requires: zero NEEDS_SKELETON, zero NEEDS_DESIGN.

### NEEDS_SKELETON detail

| Gap | Description | Planned V6 action |
|---|---|---|
| ML-003 | app-field/DshFieldStoreVisitScreen — photo evidence section | Create VisitEvidenceSection.tsx skeleton |
| ML-004 | app-field/DshFieldReadinessEscalationScreen — pending/approved/rejected states | Add state UI skeleton |
| ML-012 | app-client/MySpaceScreen — loyalty rewards section | OWNER_DECISION_REQUIRED (placement TBD) |
| ML-013 | app-client/MySpaceScreen — subscriptions section | OWNER_DECISION_REQUIRED (placement TBD) |
| ML-014 | app-client/StoreScreen — video reels section | OWNER_DECISION_REQUIRED (placement TBD) |
| ML-022 | ops — ops↔partner messaging thread differentiation | BLOCKED_BY_CONTRACT (CG-030/031) |
| ML-039 | control-panel/partners — partner analytics workspace | EXPLICITLY_DEFERRED_WITH_REASON (analytics API gap) |
| ML-053 | control-panel/catalogs — item approval section | Create ItemApprovalSection.tsx skeleton |
| ML-054 | control-panel/catalogs — catalog publishing gate | Create CatalogPublishingGateSection.tsx skeleton |

### NEEDS_DESIGN detail

| Gap | Description | Planned V6 action |
|---|---|---|
| ML-009 | DshCheckoutIntentScreen — payment-failed error state | CSV already fixed (error state implemented in V4-4) → WIRED_IN_FLOW_NEEDS_VISUAL_REVIEW |
| ML-010 | DshCheckoutIntentScreen — retry CTA on blocked state | Add retry CTA to blocked state handler |
| ML-011 | OperationScreens — thread_type UI differentiation | OWNER_DECISION_REQUIRED (god-file constraint) |
| ML-015 | DshCheckoutIntentScreen — quote loading states | Add quote-loading skeleton state |
| ML-021 | OrdersTrackingScreens — captain-assigned state | Add captain-assigned state to live tracking |
| ML-023 | InventoryCatalogScreen/PromotionsScreen — video ownership | OWNER_DECISION_REQUIRED (placement decision) |
| ML-027 | DshCaptainOrdersScreen — offer-accept confirmation state | Add accept-confirmation state |
| ML-028 | DshCaptainOrdersScreen — order detail state in god-file | OWNER_DECISION_REQUIRED (god-file split required) |
| ML-030 | control-panel/DispatchAssignmentScreen — manual assign UI | OWNER_DECISION_REQUIRED (god-file split required) |
| ML-036 | control-panel/DispatchAssignmentScreen — auto-assign config | OWNER_DECISION_REQUIRED (god-file split required) |
| ML-037 | control-panel/ExceptionsEscalationsScreen — reassign trigger | OWNER_DECISION_REQUIRED (placement decision) |

---

## 5. TODO Marker Audit

19 source files contain TODO/FIXME/XXX markers. All are contract-blocker notes in committed skeleton files. Phase 4 will remove these from source and document them in the cleanup changelog.

| File | Note |
|---|---|
| app-captain/sheets/OfferDeclineSheet.tsx | CG-015 contract blocker |
| app-client/sheets/CancelOrderSheet.tsx | CG-009 contract blocker |
| app-field/sections/DocumentVerificationSection.tsx | field doc contract |
| app-partner/sheets/AcceptanceTimerSheet.tsx | CG-021 contract blocker |
| control-panel/finance/CaptainPayoutWorkspace.tsx | CG-034 WLT blocker |
| control-panel/finance/CommissionBreakdownWorkspace.tsx | WLT blocker |
| control-panel/finance/FieldCommissionWorkspace.tsx | WLT blocker |
| control-panel/finance/PartnerSettlementWorkspace.tsx | CG-033 WLT blocker |
| control-panel/finance/PlatformFeeAuditWorkspace.tsx | WLT blocker |
| control-panel/finance/RefundQueueWorkspace.tsx | CG-035 WLT blocker |
| control-panel/operations/AuditTrailDetailWorkspace.tsx | audit detail API blocker |
| control-panel/partners/PartnerDeactivationWorkspace.tsx | partner mgmt API blocker |
| control-panel/support/OpsCaptainMessagingWorkspace.tsx | CG-031 blocker |
| control-panel/support/OpsClientMessagingWorkspace.tsx | CG-030 blocker |
| control-panel/support/OpsPartnerMessagingWorkspace.tsx | CG-030 blocker |
| control-panel/support/SupportEscalationQueueScreen.tsx | CG-032 blocker |
| control-panel/support/SupportSlaDashboardScreen.tsx | CG-032 blocker |
| control-panel/support/SupportTicketDetailWorkspace.tsx | CG-032 blocker |
| control-panel/support/SupportTicketListScreen.tsx | CG-032 blocker |

---

## 6. God-File Candidates

| File | Screens inside | V6 action |
|---|---|---|
| OperationScreens.tsx | 6 screens (ops issue, thread, messaging) | OWNER_DECISION_REQUIRED — document split plan, do not split without approval |
| DshCaptainSurface.tsx | 7 screens (captain surface hub) | OWNER_DECISION_REQUIRED — document split plan |
| PartnerHubScreen.tsx | 3 screens (partner hub, conversation panel) | OWNER_DECISION_REQUIRED — document split plan |

---

## 7. Audit Conclusion

| Item | Result |
|---|---|
| Forbidden diffs | NONE |
| NEEDS_SKELETON gaps | 9 — must resolve in Phase 3 |
| NEEDS_DESIGN gaps | 11 — must resolve in Phase 3 |
| TODO markers in source | 19 — must remove in Phase 4 |
| God-files | 3 — must document in Phase 4 |
| CSV discrepancy (ML-009) | V4-4 implemented error state but CSV not updated — fix in Phase 1 |
| TypeScript state | Unknown — will verify in Phase 6 |

```
AUDIT_COMPLETE — PROCEEDING_TO_PHASE_1
```
