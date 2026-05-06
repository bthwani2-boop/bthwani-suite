# DSH-ARCHIVE-020 Archive Manifest

## Archived Items

### 1. app-captain orphan placeholder host
- Original path: `dsh/frontend/app-captain/DshSurfaceHost.tsx`
- Archive path: `dsh/_archive/frontend/DSH_ARCHIVE_020_ACTIVE_FRONTEND_CLEANUP-20260506-225900/app-captain/DshSurfaceHost.tsx`
- Reason: orphan placeholder host outside the active captain shell/composition chain
- Import count: `0` outside the file itself
- Render count: `0`
- Route/host count: `0`
- Evidence source:
  - `grep_search` found only self hits for `DshSurfaceHost(` in the captain file
  - no export in `dsh/frontend/app-captain/index.ts`
  - no shell/composition usage in `app-captain/shell/PartnerSurfaceHost` equivalent chain
- Why safe:
  - not an active route screen
  - not a nested internal screen in use
  - not a navigation or CTA target
  - not a compatibility alias
  - not a fixture or source-authority owner
  - `pnpm -w exec tsc --noEmit` remained clean immediately after `git mv`
- Rollback command:
  - `git mv dsh/_archive/frontend/DSH_ARCHIVE_020_ACTIVE_FRONTEND_CLEANUP-20260506-225900/app-captain/DshSurfaceHost.tsx dsh/frontend/app-captain/DshSurfaceHost.tsx`
