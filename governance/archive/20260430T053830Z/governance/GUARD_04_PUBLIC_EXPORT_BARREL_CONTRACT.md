# GUARD-04 — Public Export / Barrel Contract Guard

## Purpose

GUARD-04 protects public package entrypoints, public export gateway files, barrel files, and package subpath export contracts from unsafe cleanup.

Direct import scans can falsely classify public gateways, index barrels, and package exports as unused. This guard creates a protection layer before dead-code cleanup.

## What It Checks

- package `src/public` files
- `index.ts` / `index.tsx` barrel files
- `export * from ...` usage
- `package.json` exports maps
- public files that are not explicitly represented in package exports

## Initial Calibration

This guard is intentionally CHECK-only and warning-first.

Current known baseline from probe:

```text
PublicFiles: 8
BarrelFiles: 294
ExportStarFindings: 289
MissingPublicPackageExportMappings: 1
```

Because export-star usage is currently widespread, GUARD-04 must not treat it as an error until a separate migration plan exists.

## Decisions

```text
PASS_PUBLIC_EXPORT_BARREL_CONTRACT
READY_FOR_PUBLIC_EXPORT_BARREL_REVIEW_WITH_WARNINGS
BLOCKED_BY_PUBLIC_EXPORT_BARREL_CONTRACT
```

## Rule

This guard never deletes, moves, renames, or rewrites files.

No public export, barrel, or package export mapping may be removed based only on dead-code or orphan-code scans.

Any cleanup touching these files requires:

```text
consumer proof
package export proof
runtime/route proof if relevant
owner decision
rollback path
git diff --check PASS
pnpm -w exec tsc --noEmit PASS
GUARD-01/02/03/04 rerun
_HANDOFF.zip
```
