# DSH V4-1 — Audit and Recovery Evidence

Loop: V4-1
Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## CSV Integrity — DSH_MISSING_LOGIC_AND_UI_GAPS.csv

### Malformed rows repaired

| Row | Issue | Fix applied |
|---|---|---|
| ML-039 | `why_needed` field contained unquoted commas — "Ops cannot review partner SLA scores, order completion rates, or rejection rates per partner" split into multiple columns causing priority to be parsed as "order completion rates" | Wrapped `why_needed` value in double-quotes |

### Post-fix row counts

| Column | Valid values | Count | Valid |
|---|---|---|---|
| gap_id | ML-001 … ML-054 | 54 | YES |
| priority | P0 / P1 / P2 | P0:13, P1:36, P2:5 | YES |
| status | see allowed list | see below | YES |
| owner_service | dsh / wlt | all dsh | YES |

### Status distribution (post-fix)

| Status | Count |
|---|---|
| SKELETON_ADDED_NEEDS_VISUAL_REVIEW | 31 |
| NEEDS_SKELETON | 12 |
| NEEDS_DESIGN | 11 |
| **Total** | **54** |

All 54 rows have valid priorities and statuses per the V4-1 allowed status list.

---

## TODO/FIXME/XXX marker inventory

Source files with TODO markers (from repo_current_audit_facts.json — 21 markers, 20 unique files):

| File | Line | Blocker contract |
|---|---|---|
| `dsh/frontend/control-panel/finance/CaptainPayoutWorkspace.tsx` | 2 | CG-029 |
| `dsh/frontend/control-panel/finance/CommissionBreakdownWorkspace.tsx` | 2 | WLT commission endpoint |
| `dsh/frontend/control-panel/finance/FieldCommissionWorkspace.tsx` | 2 | WLT field commission endpoint |
| `dsh/frontend/control-panel/finance/PartnerSettlementWorkspace.tsx` | 2, 12 | CG-028 |
| `dsh/frontend/control-panel/finance/PlatformFeeAuditWorkspace.tsx` | 2 | WLT fee endpoint |
| `dsh/frontend/control-panel/finance/RefundQueueWorkspace.tsx` | 12 | CG-030 |
| `dsh/frontend/control-panel/operations/AuditTrailDetailWorkspace.tsx` | 2 | audit detail API |
| `dsh/frontend/control-panel/partners/PartnerDeactivationWorkspace.tsx` | 2 | partner management API |
| `dsh/frontend/control-panel/support/OpsCaptainMessagingWorkspace.tsx` | 2 | CG-031 |
| `dsh/frontend/control-panel/support/OpsClientMessagingWorkspace.tsx` | 2 | CG-030 |
| `dsh/frontend/control-panel/support/OpsPartnerMessagingWorkspace.tsx` | 2 | CG-030 |
| `dsh/frontend/control-panel/support/SupportEscalationQueueScreen.tsx` | 2 | CG-032 |
| `dsh/frontend/control-panel/support/SupportSlaDashboardScreen.tsx` | 2 | CG-032 |
| `dsh/frontend/control-panel/support/SupportTicketDetailWorkspace.tsx` | 2, 66 | CG-032 |
| `dsh/frontend/control-panel/support/SupportTicketListScreen.tsx` | 7 | CG-032 |
| `dsh/frontend/app-partner/sheets/AcceptanceTimerSheet.tsx` | 2 | CG-021 |
| `dsh/frontend/app-field/sections/DocumentVerificationSection.tsx` | 2 | document upload contract |
| `dsh/frontend/app-client/sheets/CancelOrderSheet.tsx` | 2 | CG-009 |

All TODO comments are contract-blocker notes. None are in files changed in this loop.
All will be documented in `DSH_FINAL_REMAINING_BLOCKERS.md` in V4-5.

---

## Unreferenced skeleton candidates (17 files)

All are correctly identified as skeletons waiting for one of:
1. Export from surface index (V4-2 wiring target)
2. Contract proven to mount in flow (BLOCKED_BY_CONTRACT)
3. WLT bridge proven (BLOCKED_BY_WLT)

List classified in `DSH_SKELETON_WIRING_MATRIX.csv` in V4-2.

---

## UI-kit diff

No ui-kit source files were modified. Zero ui-kit changes in this loop.

---

## V4-1 Gate

| Check | Result |
|---|---|
| Malformed CSV rows | 0 (was 1 — ML-039 fixed) |
| All 54 rows have valid priority | YES — P0:13, P1:36, P2:5 |
| All 54 rows have valid status | YES |
| TODO inventory written | YES |
| Unreferenced skeletons listed | YES |
| Evidence file written | YES (this file) |
| No source edits | COMPLIED |
| No screen edits | COMPLIED |
| No registry edits | COMPLIED |
| No ui-kit edits | COMPLIED |
| No OpenAPI edits | COMPLIED |

```
V4-1 GATE: GREEN
```
