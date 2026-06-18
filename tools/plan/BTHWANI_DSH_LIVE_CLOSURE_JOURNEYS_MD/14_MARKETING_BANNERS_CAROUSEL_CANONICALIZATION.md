---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: مركزة البنرات والكاروسيل
---

# 14 — مركزة البنرات والكاروسيل

## القاعدة

أي شيء مرتبط بالبنرات أو الكاروسيل أو الحملات التسويقية أو العروض يجب أن يكون عقله في:

```text
C:\bthwani-suite\dsh\frontend\shared\marketing
```

الأسطح التي تعرضه تبقى UI-only:

```text
dsh/frontend/app-client
dsh/frontend/control-panel/marketing
dsh/frontend/app-partner عند الحاجة
```

## ما يذهب إلى shared/marketing

```text
banner data model
campaign model
carousel policy
visibility rules
placement rules
media mapping
CTA target mapping
publish status mapping
marketing validation
read model transforms
API binding adapters إذا كانت DSH marketing runtime
```

## ما يبقى في UI roots

```text
banner-client-ui.tsx
banner-control-panel-ui.tsx
banner-partner-ui.tsx
visual layout
surface copy
click handler that calls shared route/command
```

## ممنوع

```text
banner policy داخل app-client
campaign status map داخل control-panel
carousel sorting داخل surface
hardcoded banner IDs
preview banner arrays
fallback fake banners when API fails
separate banner logic per surface
```

## تنفيذ الرحلة

```text
1. Search: banner, carousel, campaign, promo, offer, marketing.
2. Classify each file.
3. Create/normalize shared/marketing canonical files only when real content exists.
4. Move logic, keep UI renderers in roots.
5. Delete duplicates after graph proof.
6. Verify no remaining banner/carousel business logic outside shared/marketing.
```

## أمر بحث أولي

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

Select-String -Path "dsh\frontend\**\*.ts","dsh\frontend\**\*.tsx" `
  -Pattern "banner|carousel|campaign|promo|offer|marketing" `
  -CaseSensitive:$false |
  Select-Object Path,LineNumber,Line
```

## قرار الإغلاق

لا تغلق Marketing/Banners حتى تكون النتيجة:

```text
shared/marketing owns logic
surface roots own UI only
no preview/demo/fallback banner runtime
no duplicate policy/status map
no broken imports
build/tsc/guards pass
```
