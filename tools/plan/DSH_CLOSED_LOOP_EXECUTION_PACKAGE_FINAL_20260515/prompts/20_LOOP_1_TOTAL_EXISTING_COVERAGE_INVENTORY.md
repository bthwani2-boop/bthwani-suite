# LOOP 1 — Total Existing Coverage Inventory

## Objective

Inventory everything that exists before any cleanup, organization, or missing-flow implementation.

## Allowed writes only

```text
dsh/docs/closure/DSH_EXISTING_COVERAGE_INVENTORY.csv
dsh/docs/closure/DSH_CONTROL_PANEL_SECTION_MAP.csv
dsh/docs/closure/DSH_MOBILE_APPS_SURFACE_MAP.csv
dsh/docs/closure/DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.csv
dsh/docs/closure/DSH_DO_NOT_TOUCH.md
dsh/docs/closure/DSH_LOOP_1_EVIDENCE.md
dsh/docs/closure/DSH_NEXT_LOOP_PLAN.md
```

## Inspect scope

```text
dsh/frontend/app-client
dsh/frontend/app-partner
dsh/frontend/app-captain
dsh/frontend/app-field
dsh/frontend/control-panel
dsh/frontend/control-panel/operations
dsh/frontend/control-panel/partners
dsh/frontend/control-panel/marketing
dsh/frontend/control-panel/finance
dsh/frontend/control-panel/support
dsh/frontend/control-panel/catalogs
dsh/frontend/control-panel/shared
control-panel/shell
control-panel/runtime
wlt/frontend/app-client/dsh
wlt/frontend/app-partner/dsh
wlt/frontend/app-captain/dsh
wlt/frontend/app-field/dsh
wlt/frontend/shared/finance
app-client/shell
app-client/composition
app-partner/shell
app-partner/composition
app-captain/shell
app-captain/composition
app-field/shell
app-field/composition
```

## Classification vocabulary

```text
REAL_SCREEN
WORKSPACE
SECTION
SHEET
STATE
FIXTURE_PREVIEW_DATA
BRIDGE
ROUTE_META
REGISTRY
CONTROL_PANEL_SECTION
WLT_FINANCE_BRIDGE
APP_SHELL_MOUNT
DOC
DEAD_CANDIDATE
DUPLICATE_CANDIDATE
TBD
```

## CSV requirements

Use exactly the headers in:
```text
templates/DSH_EXISTING_COVERAGE_INVENTORY.headers.csv
templates/DSH_CONTROL_PANEL_SECTION_MAP.headers.csv
templates/DSH_MOBILE_APPS_SURFACE_MAP.headers.csv
templates/DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.headers.csv
```

## Important

- Do not infer dead code without import/reference evidence.
- Do not classify delete-safe unless proven unreferenced.
- Do not move/rename/delete.
- Mark uncertain items `TBD`.

## Verification

Run:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
git ls-files --others --exclude-standard
```

## Final response

`DONE_LOCAL`, `BLOCKED`, or `NEEDS_NEXT_LOOP` only.
