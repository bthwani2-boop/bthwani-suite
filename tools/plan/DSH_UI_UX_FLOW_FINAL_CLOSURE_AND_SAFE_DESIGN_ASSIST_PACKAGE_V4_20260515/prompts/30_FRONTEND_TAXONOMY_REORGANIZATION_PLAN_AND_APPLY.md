# V4-3 — FRONTEND TAXONOMY ORGANIZATION PLAN AND APPLY

## Purpose

Reduce DSH frontend chaos after coverage/wiring evidence exists. Do not organize before proof.

## Canonical DSH frontend taxonomy

For each mobile surface:

```text
dsh/frontend/<surface>/
  index.ts
  <surface>.routes.ts
  <surface>.screen-registry.ts
  <surface>.types.ts
  screens/        route-level screens only
  workspaces/     multi-section operational surfaces
  sections/       reusable within DSH surface only
  sheets/         modal/bottom-sheet/small decisions
  states/         explicit visual/logic states
  data/           preview/demo/fixture data
  shared/         DSH-local helpers only; no local design system
```

For control panel:

```text
dsh/frontend/control-panel/
  operations/
  partners/
  marketing/
  finance/
  support/
  catalogs/
  shared/
```

## Allowed edits

- Move/rename DSH frontend files only when proven by matrix.
- Update imports/exports/registries accordingly.
- Create archive/staging classification docs.
- Do not permanently delete in this loop.

## Forbidden

- No ui-kit source edit.
- No WLT edit.
- No OpenAPI.
- No package/config/lockfile/CI.
- No broad visual redesign.

## Required outputs

- `dsh/docs/closure/DSH_FRONTEND_ORGANIZATION_MATRIX.csv`
- `dsh/docs/closure/DSH_FRONTEND_MOVE_RENAME_LOG.md`
- `dsh/docs/closure/DSH_V4_3_ORGANIZATION_EVIDENCE.md`

`DSH_FRONTEND_ORGANIZATION_MATRIX.csv` columns:

```csv
old_path,new_path,action,reason,owner_surface,import_updates_required,status,rollback_note
```

## Gate

V4-3 is complete only if:

- No broken imports.
- `tsc` is clean.
- `diff --check` is clean.
- No unrelated files changed.
- No permanent delete occurred.
