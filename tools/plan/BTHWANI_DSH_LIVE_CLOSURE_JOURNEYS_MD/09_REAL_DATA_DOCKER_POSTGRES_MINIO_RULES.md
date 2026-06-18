---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: بيانات حقيقية
---

# 09 — بيانات حقيقية عبر Docker/Postgres/MinIO

## القاعدة

لم نعد في وضع UI Preview. الوضع الحالي هو live local runtime:

```text
Docker
PostgreSQL
MinIO
DSH API
AUTH API
WLT API
Control Panel
mobile/runtime surfaces عند الحاجة
```

## ممنوع

```text
preview data as runtime truth
demo fallback when API fails
mock order/cart/payment/store runtime
hardcoded runtime IDs
Date.now/Math.random IDs
silent catch returns fake success
localStorage as source of truth for server state
```

## مسموح فقط

- fixtures معزولة dev-only إذا كانت خلف flag صريح ولا تدخل runtime الطبيعي.
- seed data في PostgreSQL مع دليل migration/seed واضح.
- media fixtures فقط لتجهيز MinIO/Postgres، لا كحقيقة UI مستقلة.

## Media runtime

أي media/product/banner image يجب أن يمر عبر:

```text
metadata in PostgreSQL
binary/object in MinIO
API contract
shared/media or shared/marketing model
surface UI renderer
```

## بوابة real data

```powershell
pnpm run guard:real-media-runtime
pnpm run guard:service-postgres-runtime
node tools/guards/guard-service-runtime.mjs --service dsh
node tools/guards/guard-service-runtime.mjs --service wlt
```
