---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: رحلة 03 — Partner Activation
---

# رحلة 03 — تفعيل الشريك ولوحة التحكم

## الهدف

تفعيل الشريك من Control Panel وربطه بمتجر حقيقي وحالات readiness/catalog/visibility.

## مالك المنطق

- partner readiness/activation: `dsh/frontend/shared/partner`.
- store visibility gates: `dsh/frontend/shared/stores` أو `discovery`.
- control-panel read model: shared topic، لا root control-panel.

## blocker معروف يعاد فحصه

`DshPartnerActivationStatus` يجب أن يكون type مركزيًا مصدّرًا من shared أو topic الصحيح، لا type محلي داخل `catalogs.listing-governance.tsx`.

## ممنوع

- `getPartnerActivationStatus` دون تصدير type إذا استهلكته شاشات.
- status map منفصل داخل catalogs/control-panel.
- UI-only screen يملك activation truth.


## قاعدة إلزامية قبل لمس أي ملف في هذه الرحلة

كل ملف يتم لمسه يجب أن يحصل على قرار واحد فقط من مصفوفة التصنيف. لا يسمح بقرارات عامة مثل `clean` أو `refactor later`.

قبل النقل أو الدمج أو الحذف:

```text
imports
exports
barrel exports
routes
screen registry
navigation
runtime consumers
API clients
OpenAPI generated consumers
tests/stories
text search
```

إذا ظهر منطق يخدم أكثر من سطح، ينقل إلى `dsh/frontend/shared/<topic>` أو `wlt/frontend/dsh/shared/<topic>` حسب الملكية، وليس إلى root تطبيق آخر. الأسطح تبقى UI-only.

## بوابة الرحلة

لا تعلن إغلاق الرحلة إلا بعد:

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run openapi:lint:dsh
pnpm run openapi:types:dsh
pnpm run openapi:lint:wlt
pnpm run openapi:types:wlt
pnpm run guard:no-broken-imports
pnpm run guard:depcruise:live-boundaries
pnpm run guard:ui-kit-central-design-ownership
pnpm run guard:tamagui-import-boundary
node tools/guards/guard-service-runtime.mjs --service dsh
node tools/guards/guard-service-runtime.mjs --service wlt
```

إذا تم لمس backend، أضف اختباراته الخاصة. إذا تم لمس runtime UI، أضف HTTP/visual/runtime evidence.
