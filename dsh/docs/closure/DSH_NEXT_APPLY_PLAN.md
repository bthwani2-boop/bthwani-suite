# DSH Next Apply Plan — After Loop 3

Status: NEEDS_NEXT_LOOP
Current loop: 4 (DONE_LOCAL)
Next loop: 5 — Organize After Coverage
Date: 2026-05-15

---

## Loop 4 objective

Apply only P0/P1 missing logic skeletons proven in Loop 3 gap map. No implementation. No visual redesign. Skeletal TypeScript files only — placeholder screens, states, sheets, and WLT bridge references.

---

## Prerequisites (all must exist before Loop 4 starts)

| File | Status |
| --- | --- |
| `dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv` | DONE_LOCAL ✓ |
| `dsh/docs/closure/DSH_SCREEN_INVENTORY.csv` | DONE_LOCAL ✓ |
| `dsh/docs/closure/DSH_ROUTE_STATE_CTA_MATRIX.csv` | DONE_LOCAL ✓ |
| `dsh/docs/closure/DSH_DO_NOT_TOUCH.md` | DONE_LOCAL ✓ |
| Human review of Loop 3 evidence | PENDING |

---

## Loop 4 allowed actions (per Loop 4 prompt)

- Add missing route/screen/workspace skeleton (new .tsx file with TODO placeholder)
- Add missing state placeholder (enum value or state object extension)
- Add missing sheet/workspace placeholder (.tsx with TODO)
- Add missing route metadata (route registration in screen-registry.ts)
- Add missing control-panel mapping (new entry in CP section registry)
- Add missing WLT bridge reference placeholder without money semantics

---

## Loop 4 forbidden actions

- No visual redesign
- No CSS/theme/Tamagui changes
- No OpenAPI edits
- No backend/runtime/API implementation
- No WLT money logic
- No broad rename/move/delete
- No ui-kit changes

---

## Loop 4 skeleton targets — P0 (apply first)

| Gap ID | Actor | Surface | Skeleton to create | File target |
| --- | --- | --- | --- | --- |
| ML-025 | captain | app-captain | Register DshCaptainMapScreen in dsh-captain.screen-registry.ts; wire into DshCaptainPickupDropoffScreen | dsh/frontend/app-captain/dsh-captain.screen-registry.ts |
| ML-046 | ops | control-panel | Create SupportTicketListScreen.tsx skeleton | dsh/frontend/control-panel/support/SupportTicketListScreen.tsx |
| ML-047 | ops | control-panel | Create SupportTicketDetailWorkspace.tsx skeleton | dsh/frontend/control-panel/support/SupportTicketDetailWorkspace.tsx |
| ML-049 | ops | control-panel | Create SupportEscalationQueueScreen.tsx skeleton | dsh/frontend/control-panel/support/SupportEscalationQueueScreen.tsx |
| ML-040 | ops | control-panel | Create PartnerSettlementWorkspace.tsx skeleton (WLT bridge view-only) | dsh/frontend/control-panel/finance/PartnerSettlementWorkspace.tsx |
| ML-041 | ops | control-panel | Create CaptainPayoutWorkspace.tsx skeleton (WLT bridge view-only) | dsh/frontend/control-panel/finance/CaptainPayoutWorkspace.tsx |
| ML-042 | ops | control-panel | Create RefundQueueWorkspace.tsx skeleton (WLT bridge + refund-candidacy flag) | dsh/frontend/control-panel/finance/RefundQueueWorkspace.tsx |
| ML-006 | client | app-client | Add order-created STATE to DshCheckoutIntentScreen.tsx | dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx |
| ML-008 | client | app-client | Add refund-status STATE to OrdersTrackingScreens.tsx | dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx |
| ML-031 | captain | app-captain | Add rejected/retry STATE to DshCaptainPoDSubmissionScreen.tsx | dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx |
| ML-001 | ops | control-panel | Add approval action SECTION to ControlPanelDshPartnerApprovalsScreen.tsx | dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx |
| ML-020 | partner | app-partner | Add mark-ready CTA and ready-for-pickup STATE to OrdersInboxScreen.tsx | dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx |

---

## Loop 4 skeleton targets — P1 (apply after P0)

| Gap ID | Actor | Surface | Skeleton to create | File target |
| --- | --- | --- | --- | --- |
| ML-007 | client | app-client | Create CancelOrderSheet.tsx skeleton with reason selection | dsh/frontend/app-client/sheets/CancelOrderSheet.tsx |
| ML-016 | partner | app-partner | Create AcceptanceTimerSheet.tsx skeleton with countdown | dsh/frontend/app-partner/sheets/AcceptanceTimerSheet.tsx |
| ML-024 | captain | app-captain | Create OfferDeclineSheet.tsx skeleton with reason selection | dsh/frontend/app-captain/sheets/OfferDeclineSheet.tsx |
| ML-026 | captain | app-captain | Add availability-toggle STATE to DshCaptainSurface.tsx or DshCaptainEntryScreen.tsx | dsh/frontend/app-captain/screens/DshCaptainEntryScreen.tsx |
| ML-035 | ops | control-panel | Create AuditTrailDetailWorkspace.tsx skeleton | dsh/frontend/control-panel/operations/AuditTrailDetailWorkspace.tsx |
| ML-038 | ops | control-panel | Create PartnerDeactivationWorkspace.tsx skeleton | dsh/frontend/control-panel/partners/PartnerDeactivationWorkspace.tsx |
| ML-043 | ops | control-panel | Create CommissionBreakdownWorkspace.tsx skeleton (WLT bridge) | dsh/frontend/control-panel/finance/CommissionBreakdownWorkspace.tsx |
| ML-044 | ops | control-panel | Create PlatformFeeAuditWorkspace.tsx skeleton (WLT bridge) | dsh/frontend/control-panel/finance/PlatformFeeAuditWorkspace.tsx |
| ML-045 | ops | control-panel | Create FieldCommissionWorkspace.tsx skeleton (WLT bridge) | dsh/frontend/control-panel/finance/FieldCommissionWorkspace.tsx |
| ML-048 | ops | control-panel | Create SupportSlaDashboardScreen.tsx skeleton | dsh/frontend/control-panel/support/SupportSlaDashboardScreen.tsx |
| ML-050 | ops | control-panel | Create OpsClientMessagingWorkspace.tsx skeleton | dsh/frontend/control-panel/support/OpsClientMessagingWorkspace.tsx |
| ML-051 | ops | control-panel | Create OpsPartnerMessagingWorkspace.tsx skeleton | dsh/frontend/control-panel/support/OpsPartnerMessagingWorkspace.tsx |
| ML-052 | ops | control-panel | Create OpsCaptainMessagingWorkspace.tsx skeleton | dsh/frontend/control-panel/support/OpsCaptainMessagingWorkspace.tsx |
| ML-002 | field | app-field | Add DocumentVerificationSection.tsx skeleton to DshFieldStoreOnboardingScreen | dsh/frontend/app-field/sections/DocumentVerificationSection.tsx |
| ML-005 | field | app-field | Add activated/exit STATE to DshFieldStoreOnboardingScreen.tsx | dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx |
| ML-017 | partner | app-partner | Add availability-toggle STATE to PartnerHubScreen.tsx or PartnerEntryScreen.tsx | dsh/frontend/app-partner/screens/PartnerEntryScreen.tsx |
| ML-018..ML-019 | partner | app-partner | Add preparation-started and preparing STATEs to OrdersInboxScreen.tsx | dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx |
| ML-029 | captain | app-captain | Add out-for-delivery and navigating-to-dropoff STATEs to DshCaptainPickupDropoffScreen.tsx | dsh/frontend/app-captain/screens/DshCaptainPickupDropoffScreen.tsx |

---

## Loop 4 per-item rules (from Loop 4 prompt)

- Cite gap_id in code comment only if useful and low-noise
- Update gap status in DSH_MISSING_LOGIC_AND_UI_GAPS.csv: MISSING → `SKELETON_ADDED_NEEDS_VISUAL_REVIEW`
- Update DSH_UI_REVIEW_QUEUE.md to move screen to review-ready status
- Update DSH_SCREEN_INVENTORY.csv if a new screen is registered

---

## Loop 4 verification commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
```

---

## Gate before Loop 5 (Organize After Coverage)

Loop 5 cannot start until:

- All P0 skeleton targets in this plan are applied and TypeScript-clean
- DSH_MISSING_LOGIC_AND_UI_GAPS.csv updated: all P0 rows → `SKELETON_ADDED_NEEDS_VISUAL_REVIEW`
- DshCaptainMapScreen.tsx registered in dsh-captain.screen-registry.ts
- CP support section has at minimum: SupportTicketListScreen + SupportTicketDetailWorkspace
- CP finance section has at minimum: PartnerSettlementWorkspace + CaptainPayoutWorkspace + RefundQueueWorkspace
- git diff --check passes
- pnpm -w exec tsc --noEmit passes
- Human has reviewed Loop 4 diff

---

## Status after Loop 4

```text
DONE_LOCAL / NEEDS_NEXT_LOOP
```
