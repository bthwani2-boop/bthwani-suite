# LOOP 3 — Missing Logic/UI Gap Map

## Objective

Compare existing inventory against lifecycle coverage and produce missing gap maps. Do not implement.

## Allowed writes only

```text
dsh/docs/closure/DSH_SCREEN_INVENTORY.csv
dsh/docs/closure/DSH_ROUTE_STATE_CTA_MATRIX.csv
dsh/docs/closure/DSH_SCREEN_API_MATRIX.csv
dsh/docs/closure/DSH_CONTRACT_GAP_MAP.csv
dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv
dsh/docs/closure/DSH_UI_REVIEW_QUEUE.md
dsh/docs/closure/DSH_LOOP_3_EVIDENCE.md
dsh/docs/closure/DSH_NEXT_APPLY_PLAN.md
```

## Input files

```text
dsh/docs/closure/DSH_EXISTING_COVERAGE_INVENTORY.csv
dsh/docs/closure/DSH_CONTROL_PANEL_SECTION_MAP.csv
dsh/docs/closure/DSH_MOBILE_APPS_SURFACE_MAP.csv
dsh/docs/closure/DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX.csv
dsh/docs/closure/DSH_EXCEPTION_AND_SETTLEMENT_MATRIX.csv
```

If any input is missing, report `BLOCKED`.

## Rules

- Do not implement gaps.
- Do not edit OpenAPI.
- Do not invent endpoints.
- Use `NEEDS_CONTRACT_GAP` for inferred API needs.
- Classify each gap placement:
  `SCREEN`, `WORKSPACE`, `SECTION`, `SHEET`, `STATE`, `EVENT`, `NOTIFICATION`, `OPS_ACTION`, `WLT_BRIDGE`, `AUDIT_RECORD`, `TBD`.
- Include priority P0/P1/P2.
- Include risk if ignored.
- Include owner and counterpart actor.

## CSV requirements

Use exactly the headers in:
```text
templates/DSH_SCREEN_INVENTORY.headers.csv
templates/DSH_ROUTE_STATE_CTA_MATRIX.headers.csv
templates/DSH_SCREEN_API_MATRIX.headers.csv
templates/DSH_CONTRACT_GAP_MAP.headers.csv
templates/DSH_MISSING_LOGIC_AND_UI_GAPS.headers.csv
```

## Final condition

If all files are complete, report:
```text
READY_FOR_LOOP_4_WITH_EVIDENCE
```
inside `DSH_LOOP_3_EVIDENCE.md`, but final response still must be `DONE_LOCAL` or `BLOCKED`.
