# LOOP 4 — Add Missing Logic Skeletons Only

## Objective

Apply only P0/P1 missing logic skeletons that were proven in Loop 3. No visual redesign.

## Prerequisite

Required:
```text
dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv
dsh/docs/closure/DSH_SCREEN_INVENTORY.csv
dsh/docs/closure/DSH_ROUTE_STATE_CTA_MATRIX.csv
dsh/docs/closure/DSH_DO_NOT_TOUCH.md
```

If missing, `BLOCKED`.

## Allowed actions

Only when backed by Loop 3 rows:
- add missing route/screen/workspace skeleton,
- add missing state placeholder,
- add missing sheet/workspace placeholder,
- add missing route metadata,
- add missing control-panel mapping,
- add missing WLT bridge reference placeholder without money semantics.

## Forbidden

- No visual redesign.
- No arbitrary CSS/theme changes.
- No OpenAPI edits.
- No backend/runtime/API implementation.
- No WLT money logic changes.
- No broad rename/move/delete.
- No ui-kit changes unless a gap row explicitly says `PROMOTE_TO_UI_KIT_LATER`; even then do not implement promotion in this loop.

## Per-item rule

For each applied gap:
- cite gap_id in code comment only if useful and low-noise,
- update the gap status in docs to `SKELETON_ADDED_NEEDS_VISUAL_REVIEW`,
- update review queue.

## Verification

Run:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
```

## Final response

`DONE_LOCAL`, `BLOCKED`, or `NEEDS_NEXT_LOOP` only.
