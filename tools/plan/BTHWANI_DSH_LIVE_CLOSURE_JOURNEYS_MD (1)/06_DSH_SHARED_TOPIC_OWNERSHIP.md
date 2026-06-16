---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: ملكية DSH shared
---

# 06 — ملكية DSH shared حسب الموضوع

## القاعدة

`dsh/frontend/shared` هو مصدر الحقيقة لكل DSH runtime/business/read-model logic.

## بنية topics المقترحة

```text
dsh/frontend/shared/
  auth/
  stores/
  discovery/
  partner/
  field/
  catalog/
  products/
  categories/
  media/
  marketing/
  cart/
  checkout/
  orders/
  delivery/
  captain/
  support/
  notifications/
  platform/
  control-panel/
  contracts/
```

لا تفرض إعادة تسمية جماعية. أنشئ أو نظّم فقط عند وجود محتوى حقيقي.

## أمثلة نقل

| المحتوى | القرار |
|---|---|
| banner carousel policy | `MOVE_TO_DSH_SHARED_TOPIC` إلى `shared/marketing` |
| order status transition | `MOVE_TO_DSH_SHARED_TOPIC` إلى `shared/orders` |
| captain pickup/delivery next action | `MOVE_TO_DSH_SHARED_TOPIC` إلى `shared/captain` أو `delivery` |
| media upload intent runtime | `MOVE_TO_DSH_SHARED_TOPIC` إلى `shared/media` |
| control-panel table read model | `MOVE_TO_DSH_SHARED_TOPIC` إلى topic الخاص به، لا root control-panel |
| generic button/card/modal | `MOVE_TO_UI_KIT` |

## قاعدة barrels

Barrel files مثل `shared/index.ts` لا يجوز أن تخلق تضارب exports أو تخفي موضوعات متضاربة. عند وجود conflict:

- لا تستخدم `export *` عشوائيًا.
- صدّر explicit names.
- استخدم aliases عندما يكون الاسم عامًا في أكثر من topic.
- لا تكسر المستهلكين دون تحديث imports.

## بوابة DSH shared

```powershell
pnpm run guard:dsh-shared-ownership
pnpm run guard:no-broken-imports
pnpm run guard:depcruise:live-boundaries
pnpm -w exec tsc --noEmit
```
