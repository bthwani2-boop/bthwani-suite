---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: الموانع الحالية التي يعاد التحقق منها
---

# 36 — الموانع الحالية التي يعاد التحقق منها

هذه القائمة ليست دليلًا على أن الموانع ما زالت موجودة. هي قائمة إعادة فحص قبل الاختبار اليدوي الحي.

## Control Panel build blockers

أعيد فحص:

```text
Cannot find module '../../shared/permissions/administration.types'
AdminRoleId missing export
PlatformPermissionId missing export
DshPartnerActivationStatus missing export from ../../shared
```

## Next dev warnings التي لا يسمح ببقائها إذا كانت import/export

```text
Attempted import error
conflicting star exports
has no exported member
Cannot find module
```

## WLT guard config

أعيد فحص أن WLT allowed routes موجودة وأن:

```powershell
node tools/guards/guard-service-runtime.mjs --service wlt
```

يمر بدون fail.

## Webpack cache warning

إذا بقي فقط:

```text
PackFileCacheStrategy unexpected end of file
Caching failed for pack
```

بعد مسح `.next/cache` مرة واحدة، ومر build/tsc/routes/guards، يصنف:

```text
WEBPACK_CACHE_WARNING_NON_BLOCKING
```

ولا يبرر refactor منطقي.

## Working tree expected categories

صنّف كل ملف:

```text
dsh-openapi.types.ts = GENERATED_EXPECTED_SYNC إذا نتج من openapi:types:dsh
next-env.d.ts = NEXT_ENV_GENERATED_VOLATILE إذا عدله Next فقط
guard-service-runtime.config.json = WLT_ALLOWED_ROUTES_GUARD_CONFIG_FIX
client-store.model.ts = CONTROL_PANEL_IMPORT_FIX
discovery/index.ts = SHARED_BARREL_CONFLICT_FIX
shared/permissions/administration.types.ts = ADMINISTRATION_TYPES_EXPORT_FIX
```

أي ملف إضافي يحتاج قرار من `11_FILE_DECISION_MATRIX.md`.
