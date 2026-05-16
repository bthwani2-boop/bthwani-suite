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

## Adjacent Section Boundary Acceptance

- Platform does not display category management UI.
- Platform does not display campaign or offer management UI.
- Platform does not display user or role management UI.
- Platform Overview may show non-actionable handoff indicators only (informational text, no mutations).
- A service hidden by Platform must not be implicitly marketable or listable in Catalogs.
- No Catalog category can override Platform service visibility.
- No Marketing campaign can override Platform kill switch or service availability.
- No user can access Platform without Administration-granted role.
- Handoff indicators in Overview are text/cards only -- no new tabs, no management flows.

## UI Mock Design Acceptance Criteria

- [ ] Overview workspace is a sovereign dashboard (not a list of technical records)
- [ ] Overview contains three informational handoff cards for Catalogs, Marketing, Administration
- [ ] Services workspace exists with >= 5 mock service records
- [ ] Services mock records use human Arabic labels as primary headings
- [ ] Services cards show disabled buttons: تشغيل / إيقاف / إظهار / إخفاء / صيانة / rollback
- [ ] Providers workspace exists with >= 5 mock provider records
- [ ] Provider credentials are always masked (never real keys)
- [ ] Provider cards show disabled buttons: إضافة مفتاح / اختبار الاتصال / تفعيل / إيقاف / rollback
- [ ] Vars workspace uses human-readable labels (not raw VAR_ keys) as primary headings
- [ ] Vars workspace shows >= 5 human-labeled variable records
- [ ] Appearance workspace is scoped to platform identity only (no campaigns, no marketing)
- [ ] Appearance workspace shows >= 5 token-mapped color records
- [ ] Rollouts workspace renders as a teaser (preview, all controls disabled)
- [ ] Health workspace renders as a teaser (preview, all controls disabled)
- [ ] Audit & Rollback workspace renders as a teaser (preview, all controls disabled)
- [ ] No Catalogs category management UI exists inside Platform
- [ ] No Marketing campaign management UI exists inside Platform
- [ ] No Administration user management UI exists inside Platform
- [ ] No real API keys or secrets exist anywhere in Platform UI files
- [ ] No runtime mutations or API calls are triggered from Platform UI
- [ ] No enabled Apply/Activate/Save/Rollback buttons (all are disabled)
- [ ] All labels are RTL correct
- [ ] No horizontal overflow or clipping
- [ ] Administrative user understands what can be controlled here in a future runtime phase
