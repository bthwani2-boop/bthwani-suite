---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: قواعد جذور التطبيقات UI-only
---

# 05 — قواعد جذور التطبيقات UI-only

## الجذور المشمولة

### DSH


- `C:\bthwani-suite\dsh\frontend\app-captain`
- `C:\bthwani-suite\dsh\frontend\app-client`
- `C:\bthwani-suite\dsh\frontend\app-field`
- `C:\bthwani-suite\dsh\frontend\app-partner`
- `C:\bthwani-suite\dsh\frontend\control-panel`


### WLT DSH


- `C:\bthwani-suite\wlt\frontend\dsh\app-captain`
- `C:\bthwani-suite\wlt\frontend\dsh\app-client`
- `C:\bthwani-suite\wlt\frontend\dsh\app-field`
- `C:\bthwani-suite\wlt\frontend\dsh\app-partner`
- `C:\bthwani-suite\wlt\frontend\dsh\control-panel`


## المسموح داخل الجذور

```text
screens
route renderer
navigation bridge
surface shell
UI parts
UI components الخاصة بالسطح فقط
type-only contracts
visual-only local state
surface copy
thin bindings مع shared
```

## الممنوع داخل الجذور

```text
business logic
runtime logic
API clients
lifecycle logic
state machines
status maps
next-action maps
cart/order/checkout/catalog logic
delivery/captain lifecycle
field sync logic
media upload runtime
support escalation logic
finance logic
mock/demo/preview/fallback runtime
Date.now أو Math.random كـ runtime IDs
silent catch يخفي فشل runtime
```

## نمط root مقبول

```text
<root>/
  index.ts
  <Surface>.tsx
  <RouteRenderer أو navigation-bridge>.tsx|ts
  <types>.ts

  contracts/
    type-only فقط

  screens/
    أسماء الشاشات الحالية كما هي

  parts/
    UI فقط

  components/
    UI خاص بهذا السطح فقط عند الحاجة

  hooks/
    visual-only فقط عند الحاجة
```

لا تنشئ مجلدات فارغة. لا تنشئ files رفيعة لا تضيف قيمة. إذا كان المكون reusable بين أكثر من سطح، مكانه `packages/ui-kit`.

## فحص أي root

لكل ملف داخل root:

```text
1. هل يحتوي API call؟ MOVE_TO_DSH_SHARED_TOPIC أو MOVE_TO_WLT_SHARED_TOPIC.
2. هل يحتوي status map؟ MOVE_TO_SHARED.
3. هل يحتوي lifecycle؟ MOVE_TO_SHARED.
4. هل يحتوي finance؟ MOVE_TO_WLT_SHARED_TOPIC.
5. هل هو UI-only؟ KEEP_UI_SCREEN أو KEEP_UI_PART.
6. هل هو route renderer؟ KEEP_ROUTE_RENDERER.
7. هل هو type-only؟ KEEP_TYPE_ONLY_CONTRACT.
8. هل هو duplicated UI pattern؟ MOVE_TO_UI_KIT.
```
