# Legacy Reference Cleanup Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: legacy paths, legacy evidence roots, and old standalone token noise

## 1. Cleanup targets

The following are not canonical active truth:

- `docs/governance/`
- legacy evidence roots outside `tools/registry/runs/`
- old standalone repo/path/token noise
- donor-only or bootstrap-only aliases that are not part of BThwani naming

## 2. Required treatment

Each legacy reference must be classified before removal:

- MIGRATE_TO_CANONICAL
- REPLACE_WITH_CANONICAL
- ACCEPTED_LEGACY_REFERENCE
- REJECTED
- DELETE_APPROVED

## 3. Allowed names

Allowed names include:

- BThwani
- bthwani
- bthwani-suite
- `@bthwani/*`
- `bthwani2-boop/bthwani-suite`

## 4. Forbidden active usage

Old standalone repo/path names and donor aliases must not be used as active project truth, package truth, service truth, path truth, or execution target.

## 5. Deletion rule

A legacy file or folder may be deleted only after:

- unique content extraction
- owner approval
- evidence run
- rollback path
- `git diff --check`
- `tsc --noEmit`
- active guards proving `Errors: 0`