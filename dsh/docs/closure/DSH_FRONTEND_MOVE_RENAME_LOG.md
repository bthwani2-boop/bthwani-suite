# DSH Frontend Move/Rename Log — V4

Date: 2026-05-15

---

## Files created (V4-3 taxonomy fixes)

| File | Reason |
|---|---|
| `dsh/frontend/app-client/sheets/index.ts` | Canonical taxonomy: sheets/ needs index.ts as surface export point |
| `dsh/frontend/app-captain/sheets/index.ts` | Canonical taxonomy: sheets/ needs index.ts |
| `dsh/frontend/app-partner/sheets/index.ts` | Canonical taxonomy: sheets/ needs index.ts |

## Files moved/renamed: NONE

No files moved or renamed in V4-3. All moves deferred to Loop 5 with import audit.

## Taxonomy gaps deferred to Loop 5

| Gap | Scope | Reason deferred |
|---|---|---|
| `parts/` → `sections/` rename (app-client) | 7 files | Import audit required; consumers unknown |
| `parts/` → `sections/` rename (app-partner) | TBD files | Import audit required |
| `parts/` → `sections/` rename (app-captain) | 1 file (OperationScreen.ts content verification first) | DUP-003 must resolve first |
| `app-field/types/` → flat type file | 1 directory | Verify single-file contents first |

## Why deferred

Moving or renaming files without a complete import audit risks breaking TypeScript compilation. The `parts/` directories are consumed by their surface's parent screens. Without running a grep-confirmed import map, any rename would require also updating all consumers. V4 chose stability over taxonomy purity for these directories.

## Import safety

All 6 index.ts changes (support, finance, partners + 3 sheets/index.ts creations) have zero import dependencies on other files — they only add exports. No existing file was modified to import these. TypeScript will not break.
