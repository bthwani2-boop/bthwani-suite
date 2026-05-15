# DSH Next Loop Plan — After Loop 2

Status: NEEDS_NEXT_LOOP
Current loop: 2 (DONE_LOCAL)
Next loop: 3 — Missing Logic and UI Gap Map
Date: 2026-05-15

## Loop 3 objective

Compare existing inventory (Loop 1) against lifecycle coverage (Loop 2) and produce full gap maps.
Assign every MISSING and PARTIAL lifecycle point a concrete placement decision.
Do not implement. Do not reorganize. Gap mapping only.

---

## Loop 3 input sources (read-only)

| Source | Feed into |
|---|---|
| `dsh/docs/closure/DSH_EXISTING_COVERAGE_INVENTORY.csv` | Gap map: existing vs required |
| `dsh/docs/closure/DSH_SCREEN_INVENTORY.csv` | Route/state/CTA matrix |
| `dsh/docs/closure/DSH_MOBILE_APPS_SURFACE_MAP.csv` | Per-surface gap classification |
| `dsh/docs/closure/DSH_CONTROL_PANEL_SECTION_MAP.csv` | CP gap classification |
| `dsh/docs/closure/DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX.csv` | 113 lifecycle rows — MISSING/PARTIAL inputs |
| `dsh/docs/closure/DSH_EXCEPTION_AND_SETTLEMENT_MATRIX.csv` | 25 exception cases — MISSING/PARTIAL inputs |
| `dsh/docs/closure/DSH_ACTOR_JOURNEY_MATRIX.md` | 156 journey points — 33 MISSING, 21 PARTIAL |
| `tools/plan/DSH_CLOSED_LOOP_EXECUTION_PACKAGE_FINAL_20260515/prompts/40_LOOP_3_MISSING_LOGIC_AND_UI_GAP_MAP.md` | Loop 3 prompt |

## Loop 3 output files (all new under `dsh/docs/closure/`)

| File | Template |
|---|---|
| `DSH_ROUTE_STATE_CTA_MATRIX.csv` | `templates/DSH_ROUTE_STATE_CTA_MATRIX.headers.csv` |
| `DSH_SCREEN_API_MATRIX.csv` | `templates/DSH_SCREEN_API_MATRIX.headers.csv` |
| `DSH_CONTRACT_GAP_MAP.csv` | `templates/DSH_CONTRACT_GAP_MAP.headers.csv` |
| `DSH_MISSING_LOGIC_AND_UI_GAPS.csv` | `templates/DSH_MISSING_LOGIC_AND_UI_GAPS.headers.csv` |
| `DSH_UI_REVIEW_QUEUE.md` | (new — visual review queue for human) |
| `DSH_LOOP_3_EVIDENCE.md` | (new) |
| `DSH_NEXT_APPLY_PLAN.md` | (new — replaces NEXT_LOOP_PLAN; feeds Loop 4) |

> Note: `DSH_SCREEN_INVENTORY.csv` may also be updated in Loop 3 to annotate route/state/CTA details.

---

## Loop 3 must-resolve list (33 MISSING + 21 PARTIAL = 54 targets)

### P0 MISSING (must have Loop 3 placement decision)

| ID | Gap | Actor | Proposed Placement |
| --- | --- | --- | --- |
| CAP-09 | DshCaptainMapScreen.tsx — unregistered | captain | SCREEN — register in screen-registry (Loop 4) |
| SP-01 | Support ticket list | ops | SCREEN in control-panel/support/ |
| SP-02 | Support ticket detail/response | ops | WORKSPACE in control-panel/support/ |
| SP-03 | SLA dashboard | ops | SCREEN in control-panel/support/ |
| SP-04 | Escalation queue | ops | SCREEN in control-panel/support/ |
| SP-05 | Ops↔client messaging workspace | ops | WORKSPACE in control-panel/support/ |
| SP-06 | Ops↔partner messaging workspace | ops | WORKSPACE in control-panel/support/ |
| SP-07 | Ops↔captain messaging workspace | ops | WORKSPACE in control-panel/support/ |
| FN-02 | Partner settlement WLT bridge workspace | ops | WLT_BRIDGE WORKSPACE in control-panel/finance/ |
| FN-03 | Captain payout WLT bridge workspace | ops | WLT_BRIDGE WORKSPACE in control-panel/finance/ |
| FN-04 | Refund management queue | ops | WLT_BRIDGE WORKSPACE in control-panel/finance/ |
| FN-05 | Commission breakdown | ops | WLT_BRIDGE WORKSPACE in control-panel/finance/ |
| FN-06 | Platform fee audit | ops | WLT_BRIDGE WORKSPACE in control-panel/finance/ |
| FN-07 | Field commission workspace | ops | WLT_BRIDGE WORKSPACE in control-panel/finance/ |
| C-21 | Client refund status (WLT bridge) | client | WLT_BRIDGE STATE in OrdersTrackingScreens.tsx |
| F-08 | Ops activation approval (field escalation) | ops | OPS_ACTION SECTION in ControlPanelDshPartnerApprovalsScreen |

### P1 MISSING

| ID | Gap | Actor | Proposed Placement |
| --- | --- | --- | --- |
| C-11 | Order created confirmation after WLT handoff | client | STATE in DshCheckoutIntentScreen.tsx or new skeleton |
| C-20 | Client order cancellation flow | client | SHEET or SCREEN from OrdersTrackingScreens.tsx |
| CAP-05 | Captain offer decline with reason | captain | SHEET within DshCaptainOrdersScreen.tsx |
| CAP-25 | Captain availability toggle | captain | STATE within DshCaptainSurface.tsx or DshCaptainOrdersScreen.tsx |
| P-07 | Partner acceptance timer/countdown | partner | SHEET within OrdersInboxScreen.tsx |
| PT-05 | Partner deactivation | ops | OPS_ACTION within CP partners section |
| PT-06 | Partner performance review | ops | WORKSPACE in control-panel/partners/ |
| O-15..O-17 | Ops→client/partner/captain messaging | ops | WORKSPACE (shared messaging hub) in CP support |
| CT-04 | Item approval workflow | ops | OPS_ACTION SECTION in ControlPanelDshCatalogScreen.tsx |
| CT-05 | Catalog publishing gate | ops | OPS_ACTION SECTION in ControlPanelDshCatalogScreen.tsx |

### PARTIAL targets (21 points)

All PARTIAL points from DSH_ACTOR_JOURNEY_MATRIX.md must have an explicit Loop 3 placement decision:
F-04, F-06, F-09, C-17, C-25, C-26, C-32, P-09, P-10, P-11, P-12, P-14, P-25,
CAP-04, CAP-12, CAP-16, O-05, O-06, EX-01..EX-03, EX-11, EX-12, EX-14, EX-16, EX-22.

---

## Loop 3 hard rules

- Do not implement any gap
- Do not edit OpenAPI (`dsh.openapi.yaml`)
- Do not invent endpoints
- Do not edit registries (read-only)
- Use `NEEDS_CONTRACT_GAP` for inferred API needs — record in DSH_CONTRACT_GAP_MAP.csv
- Classify every gap placement: SCREEN / WORKSPACE / SECTION / SHEET / STATE / EVENT / NOTIFICATION / OPS_ACTION / WLT_BRIDGE / AUDIT_RECORD / TBD
- Include P0/P1/P2 priority on every row
- Include risk_if_ignored on every row
- Include owner actor and counterpart
- After completing: run `git diff --check` and `pnpm -w exec tsc --noEmit`

---

## Priority gaps from Loop 2 to address in Loop 3

| Gap | Priority | Loop 3 action |
|---|---|---|
| DshCaptainMapScreen unregistered | P0 | Place in DSH_MISSING_LOGIC_AND_UI_GAPS.csv; flag for Loop 4 registration |
| CP Support section entirely empty | P0 | Gap-map all 7 SP points to concrete placements |
| CP Finance 6 sub-workspaces missing | P0 | Gap-map all 6 FN points as WLT_BRIDGE WORKSPACE entries |
| Client cancellation flow missing | P1 | Gap-map C-20 as SHEET from tracking screen |
| Client refund WLT bridge missing | P0 | Gap-map C-21 as WLT_BRIDGE STATE |
| Partner acceptance timer missing | P1 | Gap-map P-07 as SHEET within inbox |
| Captain offer decline missing | P1 | Gap-map CAP-05 as SHEET |
| Captain availability toggle missing | P1 | Gap-map CAP-25 as STATE |
| OperationScreens.tsx god-screen split | P1 | Map each of 6 screens to correct placement in DSH_ROUTE_STATE_CTA_MATRIX |
| DshCaptainSurface.tsx god-file split | P1 | Map each of 7 screens to correct placement in DSH_ROUTE_STATE_CTA_MATRIX |
| All ops messaging surfaces missing | P1 | Gap-map O-15/O-16/O-17 + SP-05/SP-06/SP-07 as WORKSPACE entries |

---

## Gate before Loop 4

Loop 4 (Add Missing Logic Skeletons Only) cannot start until:

- `DSH_ROUTE_STATE_CTA_MATRIX.csv` has a row for every registered screen (63 screens from Loop 1)
- `DSH_MISSING_LOGIC_AND_UI_GAPS.csv` has a row for all 33 MISSING + 21 PARTIAL points
- `DSH_CONTRACT_GAP_MAP.csv` exists with all inferred API needs
- `DSH_SCREEN_API_MATRIX.csv` maps every screen to its API surface
- `DSH_UI_REVIEW_QUEUE.md` lists every screen requiring human visual review
- `DSH_LOOP_3_EVIDENCE.md` exists and reports `READY_FOR_LOOP_4_WITH_EVIDENCE`
- Human has reviewed Loop 3 evidence

---

## Status after Loop 2

```
DONE_LOCAL / NEEDS_NEXT_LOOP
```
