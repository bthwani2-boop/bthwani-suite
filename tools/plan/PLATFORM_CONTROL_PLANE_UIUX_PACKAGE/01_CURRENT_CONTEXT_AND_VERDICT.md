# 01 — Current Context and Verdict

## Current branch

```text
ghb/0145-20260516-155044-control-panel-dsh-ui-kit
```

## Current approved paths

```text
control-panel/runtime/app/platform/page.tsx
dsh/frontend/control-panel/platform/
dsh/frontend/control-panel/platform/Vars/
dsh/frontend/control-panel/platform/Appearance/
```

## Deprecated path

```text
dsh/frontend/control-panel/control/
```

Do not build on it.

## Current problem

The latest visual screenshots show that Platform currently behaves more like a long technical preview/debug records page than a sovereign administrative control room.

Visible examples that must stop being primary UI labels:

```text
provider.awnak.v2
provider.dispatch.router
provider.geo.zone-mapper
wlt.refunds.autoApprovalCap
scope & precedence
rollback target
test result
```

The administrative user should instead see human-control language:

```text
مزود الخرائط
مزود الرسائل SMS
مزود الدفع
تشغيل خدمة DSH
إخفاء خدمة عن العملاء
تغيير لون الهيدر الرئيسي
تغيير حد أهلية الكابتن
اختبار المزود
تفعيل المزود
تراجع عن آخر تغيير
```

## Decision

The idea is correct and implementable, but not as full runtime now.

```text
UI/UX flow now: REQUIRED and appropriate.
Runtime/API/secrets/live activation now: TOO EARLY and risky.
```

## Required pivot

From:

```text
technical preview records / developer debug / read-only map
```

To:

```text
sovereign platform control plane / human admin control / safe runtime-management UX
```

## Platform boundaries

### Inside Platform

- Service visibility and enablement.
- Sovereign service vars.
- App-wide platform colors and identity.
- Central providers and API-key entry flows.
- Rollouts / kill switches / visibility.
- Platform health and evidence.
- Audit and rollback.

### Outside Platform

- Catalog categories/subcategories/products: `Catalogs`.
- Marketing campaigns/offers/banners: `Marketing`.
- User access management: `Administration`.
- Daily order/field operations: `Operations`.
- Daily finance processing: `Finance`.

## Current phase acceptance

This package only asks for UI/UX correction and preparation.
It must not implement live runtime changes.
