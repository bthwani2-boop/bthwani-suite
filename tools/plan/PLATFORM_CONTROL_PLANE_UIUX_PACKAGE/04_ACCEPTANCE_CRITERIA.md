# 04 — Acceptance Criteria

## Decision states

Use only:

```text
DONE
BLOCKED
```

Do not claim:

```text
CLOSED
PASS 100%
FINAL
```

unless screenshot and verification evidence are present.

## Functional UI/UX acceptance

- `/platform` reads as sovereign control plane.
- It is clearly for top administration only.
- It is not a developer/debug screen.
- It is not Catalog/Marketing/Administration.
- It uses human-control language.
- It has Overview, Services, Vars, Providers, Appearance.
- Rollouts, Health, Audit & Rollback are represented as future/disabled or teaser.
- All live action buttons are disabled in UI/UX phase.
- No real API keys or secrets.
- Provider keys are masked only.
- No real mutation language like "تم التفعيل" unless explicitly preview-only.
- Appearance is app-wide platform identity, not campaign marketing.
- Vars are service/scoped human controls, not technical key tables.
- Providers are platform-wide defaults, not fragmented per-screen setup.

## Architecture acceptance

- No `dsh/frontend/control-panel/control/` dependency.
- No local design system.
- No Tamagui direct import outside ui-kit.
- No ui-kit modifications.
- No package/dependency changes.
- No backend/API/runtime/database changes.
- No hardcoded random colors.
- No frontend secrets.
- No env-only provider truth presented as final architecture.
- `@bthwani/ui-kit` public exports only for reusable UI.

## Governance acceptance

- `governance/30_PLATFORM_CONTROL_PLANE.md` exists.
- It defines Platform boundaries.
- It defines forbidden items.
- It states Platform is restricted to top administration only.
- It states every live change needs owner, reason, before/after, scope, impact, audit, rollback.
- It states API keys/secrets are never stored in frontend/code.
- It states Catalog/Marketing/Administration boundaries.

## Guard acceptance

- Guard exists and runs.
- Guard blocks forbidden content.
- Guard gives actionable errors.

## Evidence acceptance

Required evidence:

```text
git status --short
git diff --name-status
git diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
node tools/guards/platform-control-plane-uiux.guard.mjs
screenshot from /platform
```

## Visual acceptance

- RTL correct.
- Sidebar remains correct.
- No horizontal overflow.
- Cards are not huge technical log blocks.
- Page starts with control dashboard, not deep record list.
- The user can identify what to control within 5 seconds.
- Technical identifiers are secondary/caption only.
- Main actions are visible but disabled.
- Low-noise, premium, cohesive, central color system.
