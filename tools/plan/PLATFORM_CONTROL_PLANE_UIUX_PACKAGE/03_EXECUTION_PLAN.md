# 03 — Execution Plan

## Phase 0 — Read-only diagnosis

Run diagnostics before writing:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager branch --show-current
git ls-files "dsh/frontend/control-panel/platform/*"
git grep -n "dsh/frontend/control-panel/control\|from './control'\|ControlPanelDshControl" -- . || $true
git grep -n "Campaign\|Seasonal\|Marketing\|Eid\|promo\|offer" -- dsh/frontend/control-panel/platform || $true
git grep -n "provider\.\|wlt\.\|VAR_" -- dsh/frontend/control-panel/platform || $true
```

Document results before applying.

## Phase 1 — Governance

Add:

```text
governance/30_PLATFORM_CONTROL_PLANE.md
```

from package file:

```text
07_GOVERNANCE_TO_ADD/30_PLATFORM_CONTROL_PLANE.md
```

Do not add many governance files.

## Phase 2 — Guard

Add:

```text
tools/guards/platform-control-plane-uiux.guard.mjs
```

from package file:

```text
08_GUARDS/platform-control-plane-uiux.guard.mjs
```

## Phase 3 — Platform shell UI

Modify:

```text
dsh/frontend/control-panel/platform/ControlPanelDshPlatformScreen.tsx
```

Goals:

- Make Overview visible.
- Add Services and Providers workspaces.
- Keep Vars and Appearance.
- Make inactive future workspaces teaser-only.
- Update copy from preview/debug to sovereign control plane.
- Keep all live action buttons disabled.

## Phase 4 — Services workspace

Create:

```text
dsh/frontend/control-panel/platform/Services/index.ts
dsh/frontend/control-panel/platform/Services/DshPlatformServicesWorkspace.tsx
dsh/frontend/control-panel/platform/Services/services.preview.ts
dsh/frontend/control-panel/platform/Services/services.types.ts
```

Use human labels.

## Phase 5 — Providers workspace

Create:

```text
dsh/frontend/control-panel/platform/Providers/index.ts
dsh/frontend/control-panel/platform/Providers/DshPlatformProvidersWorkspace.tsx
dsh/frontend/control-panel/platform/Providers/providers.preview.ts
dsh/frontend/control-panel/platform/Providers/providers.types.ts
```

Use masked key placeholders only.

## Phase 6 — Vars humanization

Do not rebuild Vars entirely unless necessary.

Correct:

- keys as secondary.
- Arabic user-facing titles as primary.
- human scope selector.
- service-first navigation.
- no long developer records as primary content.

## Phase 7 — Appearance humanization

Correct:

- app coverage.
- header primary/secondary color control preview.
- no campaign/marketing.
- no raw token names as primary user content.
- no hardcoded color policy.
- all action buttons disabled.

## Phase 8 — Verification

Run:

```powershell
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
node tools/guards/platform-control-plane-uiux.guard.mjs
```

## Phase 9 — Evidence

Create evidence zip under:

```text
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
```

The zip must include:

- git status
- git diff name-status
- git diff check
- tsc output
- guard output
- patch
- untracked files
- visual screenshot checklist

## Stop conditions

Stop and report BLOCKED if:

- TypeScript fails and fix is outside allowed scope.
- Required component is missing from ui-kit and adding ui-kit file would be necessary.
- Correcting imports would require broad unrelated changes.
- Runtime/API/backend is needed to proceed.
