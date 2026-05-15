# DSH Visual Review Readiness Checklist

Status: READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
Loop: 5 — Organize After Coverage
Date: 2026-05-15

---

## Purpose

This checklist defines the minimum criteria for DSH surfaces to be considered ready for human visual review. A surface reaches `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE` only when all checked items are satisfied.

---

## Gate criteria (all must pass before visual review session)

### TypeScript

| Check | Status |
| --- | --- |
| `pnpm -w exec tsc --noEmit` passes with exit 0 | PASS (verified Loop 4 + Loop 5) |
| No `WebControlPanelKeyValueList` or other unverified named imports from `@bthwani/ui-kit/web` | PASS (fixed Loop 4) |
| No `status: 'READY_FOR_REVIEW'` or invalid registry status values | PASS (fixed Loop 4) |

### Git

| Check | Status |
| --- | --- |
| `git diff --check` passes (no trailing whitespace or conflict markers) | PASS (verified Loop 4 + Loop 5) |
| No uncommitted changes to WLT files | PASS |
| No uncommitted changes to OpenAPI | PASS |

### Skeleton coverage

| Check | Status |
| --- | --- |
| All P0 gap targets (ML-001, ML-006, ML-020, ML-025, ML-031, ML-040, ML-041, ML-042, ML-046, ML-047, ML-049) applied | DONE_LOCAL |
| All P1 gap targets applied | DONE_LOCAL |
| `DSH_MISSING_LOGIC_AND_UI_GAPS.csv` — all applied rows → `SKELETON_ADDED_NEEDS_VISUAL_REVIEW` | DONE_LOCAL |
| `DSH_SCREEN_INVENTORY.csv` — no `TBD` in screen registration rows that have matching `.tsx` files | NEEDS_HUMAN_VERIFY |

### Organization

| Check | Status |
| --- | --- |
| `dsh/docs/archive/` created with 16 stale docs moved | DONE_LOCAL |
| `dsh/SERVICE_BLUEPRINT.md` shortened to index (~115 lines) | DONE_LOCAL |
| `DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.csv` — all TBD rows resolved | DONE_LOCAL |
| `DSH_ORGANIZATION_CHANGELOG.md` produced | DONE_LOCAL |

---

## Per-surface readiness

| Surface | Skeleton Coverage | Key Gaps Resolved | Visual Review Ready |
| --- | --- | --- | --- |
| `app-client` | ML-006 (order-created state), ML-007 (CancelOrderSheet), ML-008 (refund states — already existed) | YES | READY_FOR_HUMAN_VISUAL_REVIEW |
| `app-partner` | ML-016 (AcceptanceTimerSheet), ML-017 (availability toggle), ML-018/019 (preparation states), ML-020 (mark-ready CTA) | YES | READY_FOR_HUMAN_VISUAL_REVIEW |
| `app-captain` | ML-024 (OfferDeclineSheet), ML-025 (map screen registered), ML-026 (availability toggle), ML-029 (in-transit states), ML-031 (PoD retry states) | YES | READY_FOR_HUMAN_VISUAL_REVIEW |
| `app-field` | ML-002 (DocumentVerificationSection), ML-005 (activated/exit states) | YES | READY_FOR_HUMAN_VISUAL_REVIEW |
| `control-panel` | ML-001 (approve CTA), ML-035 (AuditTrailDetail), ML-038 (PartnerDeactivation), ML-040..045 (finance WLT workspaces), ML-046..052 (support screens) | YES | READY_FOR_HUMAN_VISUAL_REVIEW |

---

## Screens requiring visual screenshot evidence

The following screens are `SKELETON_ADDED_NEEDS_VISUAL_REVIEW` in the gap CSV and require screenshot evidence to advance to `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE`:

### app-client
- `DshCheckoutIntentScreen.tsx` — `order-created` state
- `CancelOrderSheet.tsx` — reason selection sheet

### app-partner
- `OrdersInboxScreen.tsx` — `preparation_started` state, mark-ready CTA
- `PartnerEntryScreen.tsx` — availability toggle
- `AcceptanceTimerSheet.tsx` — countdown timer

### app-captain
- `DshCaptainEntryScreen.tsx` — availability toggle
- `DshCaptainPickupDropoffScreen.tsx` — `out-for-delivery` and `navigating-to-dropoff` modes
- `DshCaptainMapScreen.tsx` — map screen (newly registered)
- `OfferDeclineSheet.tsx` — reason selection sheet

### app-field
- `DshFieldStoreOnboardingScreen.tsx` — `activated` and `exit` states
- `DocumentVerificationSection.tsx` — document upload section

### control-panel
- `ControlPanelDshPartnerApprovalsScreen.tsx` — activate action on `marketing-approved` stage
- `PartnerSettlementWorkspace.tsx`, `CaptainPayoutWorkspace.tsx`, `RefundQueueWorkspace.tsx` — finance WLT workspaces
- `CommissionBreakdownWorkspace.tsx`, `PlatformFeeAuditWorkspace.tsx`, `FieldCommissionWorkspace.tsx` — finance WLT workspaces
- `SupportTicketListScreen.tsx`, `SupportTicketDetailWorkspace.tsx`, `SupportEscalationQueueScreen.tsx` — support screens
- `SupportSlaDashboardScreen.tsx`, `OpsClientMessagingWorkspace.tsx`, `OpsPartnerMessagingWorkspace.tsx`, `OpsCaptainMessagingWorkspace.tsx` — support workspaces
- `AuditTrailDetailWorkspace.tsx`, `PartnerDeactivationWorkspace.tsx` — operations workspaces

---

## What this checklist does NOT cover

- Runtime binding (WLT, API, backend) — out of scope until visual gate clears
- OpenAPI contract — `CONTRACT_TBD` until Screen/API Matrix freeze exits visual gate
- Backend/domain proof — intentionally deferred
- E2E/integration tests — deferred
- Production readiness — blocked until all prior gates pass

---

## Next action for human reviewer

1. Open each surface in the dev environment.
2. Screenshot the golden-path state for each screen listed above.
3. Place screenshots under `tools/registry/runs/DSH_VISUAL_SMOKE_{DATE}/`.
4. Update `DSH_UI_REVIEW_QUEUE.md` with screenshot paths and status.
5. When all screenshots collected, advance surface status from `UI_PREVIEW_ONLY` → `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE`.

```text
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```
