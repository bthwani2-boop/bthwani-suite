# LOOP 5 — Organize Only After Coverage

## Objective

Reduce file/docs noise after inventory and missing skeleton coverage. This loop is not design work.

## Prerequisites

Must exist:
```text
DSH_EXISTING_COVERAGE_INVENTORY.csv
DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.csv
DSH_DO_NOT_TOUCH.md
DSH_MISSING_LOGIC_AND_UI_GAPS.csv
```

## Allowed actions

Only if backed by classification:
- shorten `dsh/SERVICE_BLUEPRINT.md` into an index,
- consolidate docs into `dsh/docs/closure`,
- archive docs proven stale into `dsh/docs/archive`,
- rename/move only classified files,
- merge only duplicate candidates with evidence,
- update imports/exports caused by approved moves.

## Forbidden

- No permanent delete unless explicitly approved by user after patch review.
- No broad refactor.
- No package/config/dependency changes.
- No screen redesign.
- No OpenAPI edits.
- No backend/runtime/API.

## Required write docs

```text
dsh/docs/closure/DSH_ORGANIZATION_CHANGELOG.md
dsh/docs/closure/DSH_LOOP_5_EVIDENCE.md
dsh/docs/closure/DSH_VISUAL_REVIEW_READINESS_CHECKLIST.md
```

## Verification

Run full evidence command including TypeScript.

## Final response

`DONE_LOCAL`, `BLOCKED`, or `NEEDS_NEXT_LOOP` only.
