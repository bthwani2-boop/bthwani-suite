# DSH Client App Scope Standardization R2 Status

## Control Path

- Control folder: `tools/plan/dsh`
- Scope root: `dsh/frontend/app-client`
- WLT bridge root: `wlt/frontend/app-client/dsh`

### Completed Slices

- Introduced `DshClientSurface` as the canonical app-client-facing boundary and merged `DshSurfaceHost` logic into it for a clean single entry point.
- Added passive route and screen registries for the DSH client surface.
- Added `PreferencesScreen` and wired it from `DshMySpaceScreen` through the live host route flow.
- Replaced DSH cart deep WLT imports with the public WLT bridge index.
- Created canonical `screens/`, `parts/`, `data/`, and `shared/` entrypoints and switched the live DSH host to consume them.
- Created canonical WLT DSH bridge files at the root of `wlt/frontend/app-client/dsh` and removed legacy compatibility internals.
- Updated ownership metadata so DSH cart can explicitly declare WLT integration through `linkedServiceId: 'wlt'`.
- Standardized `index.ts` to export directly from canonical subdirectories and removed 45+ legacy compatibility wrappers from the root of `dsh/frontend/app-client`.
- Updated `dsh-client.types.ts` to point to canonical paths.
- Verified system integrity with `pnpm -w exec tsc --noEmit` after full cleanup.

## Current Live Canonical Paths

- `dsh/frontend/app-client/DshClientSurface.tsx`
- `dsh/frontend/app-client/dsh-client.routes.ts`
- `dsh/frontend/app-client/dsh-client.screen-registry.ts`
- `dsh/frontend/app-client/screens/*`
- `dsh/frontend/app-client/parts/*`
- `dsh/frontend/app-client/data/*`
- `dsh/frontend/app-client/shared/*`
- `wlt/frontend/app-client/dsh/index.ts`
- `wlt/frontend/app-client/dsh/useWltDshWalletPreview.ts`
- `wlt/frontend/app-client/dsh/wlt-dsh-client.adapter.ts`
- `wlt/frontend/app-client/dsh/WltDshClientBridge.tsx`
- `wlt/frontend/app-client/dsh/wlt-dsh-client.parts.tsx`

## Remaining Slices

- None. Standardized and Cleaned.

## Latest Static Validation

- `git --no-pager diff --check`: pass
- `pnpm -w exec tsc --noEmit`: pass
- Scoped `rg` static gate for root-level legacy files: pass (zero matches)

## Evidence Pack

- `tools/registry/runs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2-a56985ba/`

## Runtime Evidence

- `control-panel-route-smoke.csv`
- `adb-devices.txt`
- `app-client-adb-logcat.txt`

## Notes

- Windows line-ending normalization was required for `getDshCategoryIconUrl.ts` during the process.
- The strategy has transitioned from additive/compatibility-first to full-canonical cleanup.
