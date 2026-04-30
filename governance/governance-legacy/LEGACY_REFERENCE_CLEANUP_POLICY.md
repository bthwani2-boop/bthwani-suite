---
generatedFrom: governance/LEGACY_REFERENCE_CLEANUP_POLICY.md
generatedAt: 2026-04-30T04:48:37.8038990+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Legacy Reference Cleanup Policy

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: legacy paths, legacy evidence roots, old standalone token noise, and destructive cleanup safety

## 1. Cleanup Targets

The following are not canonical active truth:

- `docs/governance/`
- legacy evidence roots outside `tools/registry/runs/`
- old standalone repo, path, or token noise
- donor-only or bootstrap-only aliases that are not part of BThwani naming

## 2. Required Treatment

Each legacy reference must be classified before removal:

- MIGRATE_TO_CANONICAL
- REPLACE_WITH_CANONICAL
- ACCEPTED_LEGACY_REFERENCE
- REJECTED
- DELETE_APPROVED

## 3. Allowed Names

Allowed names include:

- BThwani
- bthwani
- bthwani-suite
- `@bthwani/*`
- `bthwani2-boop/bthwani-suite`

## 4. Forbidden Active Usage

Old standalone repo, path, or donor aliases must not be used as active project truth, package truth, service truth, path truth, or execution target.

## 5. Move Or Quarantine Before Delete

Destructive removal is not the default response to a mistaken, outdated, or misplaced artifact.

Before deleting a meaningful artifact:

1. identify why the artifact is wrong, outdated, or misplaced
2. snapshot or move the artifact into a traceable quarantine location when needed
3. record the reason in the relevant evidence pack
4. only then remove the live copy if removal is truly necessary

Preferred quarantine location:

```text
tools/registry/runs/{SESSION_ID}/phase-XX/quarantine/
```

Do not silently delete governance, bootstrap, or cleanup artifacts without evidence.

## 6. Deletion Rule

A legacy file or folder may be deleted only after:

- unique content extraction
- owner approval when required
- evidence run
- rollback path
- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit` when applicable
- active guards proving `Errors: 0` when the guard exists for that scope
