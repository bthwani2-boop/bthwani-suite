---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: بوابة الفرع والـ runtime
---

# 03 — بوابة الفرع والـ runtime قبل اليدوي

## الهدف

تثبيت أن العمل يتم على الفرع الصحيح والكود الحي، لا على ذاكرة أو preview.

## أوامر baseline

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git fetch origin
git branch --show-current
git rev-parse HEAD
git status --short
git --no-pager diff --check

pnpm install --frozen-lockfile
pnpm -w exec tsc --noEmit
```

## تشغيل الـ stack

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

docker compose -f .\docker-compose.local.yml up -d --build
docker compose -f .\docker-compose.local.yml ps
```

لا تشغل compose فرعي لـ `dsh/backend` إذا كان root compose يملك نفس أسماء الحاويات. root compose هو نقطة الدخول الموحدة للتطوير المحلي.

## Health checks

```powershell
Invoke-WebRequest -Uri "http://localhost:18082/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8080/stores" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:18083/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:9000/minio/health/live" -UseBasicParsing
```

## Control Panel env

```powershell
$env:NEXT_PUBLIC_DSH_API_BASE_URL = "http://localhost:8080"
$env:NEXT_PUBLIC_AUTH_BASE_URL = "http://localhost:18082"
$env:EXPO_PUBLIC_AUTH_BASE_URL = "http://localhost:18082"
$env:NEXT_PUBLIC_WLT_DSH_API_BASE_URL = "http://localhost:18083"
$env:BTHWANI_ENV = "local"
$env:BTHWANI_LOCAL_LIVE_TEST = "1"

pnpm --dir control-panel/runtime dev
```

## blockers الحالية التي يعاد التحقق منها

لا تعتمد على أنها مغلقة حتى يثبت ذلك بالأوامر:

- `DshPartnerActivationStatus` export في `../../shared` أثناء build.
- أي `Cannot find module` داخل Control Panel build.
- أي `has no exported member` داخل Control Panel build.
- أي `Attempted import error` داخل Next stderr.
- أي `conflicting star exports` داخل shared barrels.

Webpack cache warning وحده ليس blocker إذا اختفت import/export/build errors.
