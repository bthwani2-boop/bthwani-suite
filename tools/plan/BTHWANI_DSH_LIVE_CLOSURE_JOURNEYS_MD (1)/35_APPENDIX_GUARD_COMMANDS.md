---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: ملحق أوامر guards
---

# 35 — ملحق أوامر guards

## Git

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
```

## TypeScript/build

```powershell
pnpm -w exec tsc --noEmit
pnpm --dir control-panel/runtime build
```

## OpenAPI

```powershell
pnpm run openapi:lint:dsh
pnpm run openapi:types:dsh
pnpm run openapi:lint:wlt
pnpm run openapi:types:wlt
```

## Runtime guards

```powershell
node tools/guards/guard-service-runtime.mjs --service dsh
node tools/guards/guard-service-runtime.mjs --service wlt
pnpm run guard:service-postgres-runtime
```

## Boundary/ownership guards

```powershell
pnpm run guard:ui-only-surfaces
pnpm run guard:ui-only-file-volume
pnpm run guard:surface-lightweight-bindings
pnpm run guard:dsh-shared-ownership
pnpm run guard:wlt-dsh-ui-only-bindings
pnpm run guard:wlt-dsh-shared-ownership
pnpm run guard:depcruise:live-boundaries
pnpm run guard:no-broken-imports
pnpm run guard:real-media-runtime
pnpm run guard:jscpd:live
pnpm run guard:ui-kit-central-design-ownership
pnpm run guard:tamagui-import-boundary
```

إذا كان script غير موجود في `package.json`، لا تخترعه كنجاح. صنّفه `BLOCKED_NEEDS_EVIDENCE` أو استبدله بفحص موجود ثم حدّث governance لاحقًا.
