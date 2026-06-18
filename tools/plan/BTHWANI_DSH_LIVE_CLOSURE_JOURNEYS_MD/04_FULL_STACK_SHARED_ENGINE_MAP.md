---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: خريطة العقل الموحد
---

# 04 — خريطة العقل الموحد Full-stack Shared Engine

## DSH shared

`dsh/frontend/shared` هو العقل التشغيلي الموحد لكل DSH. لا يكون مجرد barrel imports. يجب أن يحتوي الحقيقة التشغيلية للموضوعات.

### موضوعات DSH التي تملكها shared

| الموضوع | مكانه الكانوني | يمنع وجوده في roots |
|---|---|---|
| stores/discovery | `dsh/frontend/shared/stores` أو `discovery` | store policy, visibility, serviceability |
| catalog/products/categories | `dsh/frontend/shared/catalog`, `products`, `categories` | catalog state/status maps |
| media runtime | `dsh/frontend/shared/media` | upload runtime, MinIO adapters |
| cart/checkout | `dsh/frontend/shared/cart`, `checkout` | cart calculations, checkout intent builders |
| orders | `dsh/frontend/shared/orders` | order lifecycle, status transitions |
| captain/delivery | `dsh/frontend/shared/captain`, `delivery` | captain lifecycle and next-actions |
| partner | `dsh/frontend/shared/partner` | activation/readiness rules |
| field | `dsh/frontend/shared/field` | onboarding/sync/document state |
| support | `dsh/frontend/shared/support` | escalation and case state |
| notifications | `dsh/frontend/shared/notifications` | notification runtime and read state |
| marketing | `dsh/frontend/shared/marketing` | banners, carousel, campaigns, offers |
| platform/control-panel models | `dsh/frontend/shared/platform`, topic folders | control-panel read models that are not UI |

## WLT shared

`wlt/frontend/dsh/shared` هو العقل المالي لكل ما يتعلق بـ DSH. DSH يملك boundary refs فقط.

### موضوعات WLT التي تملكها shared

| الموضوع | مكانه الكانوني |
|---|---|
| wallet | `wlt/frontend/dsh/shared/wallet` |
| payments | `wlt/frontend/dsh/shared/payments` |
| refunds | `wlt/frontend/dsh/shared/refunds` |
| settlements | `wlt/frontend/dsh/shared/settlements` |
| payouts/commissions | `wlt/frontend/dsh/shared/payouts`, `commissions` |
| ledger/reconciliation | `wlt/frontend/dsh/shared/ledger`, `reconciliation` |
| finance control-panel read models | `wlt/frontend/dsh/shared/control-panel` أو topic مناسب |
| boundary contracts | `wlt/frontend/dsh/shared/contracts` |

## جذور UI-only

### DSH roots


- `C:\bthwani-suite\dsh\frontend\app-captain`
- `C:\bthwani-suite\dsh\frontend\app-client`
- `C:\bthwani-suite\dsh\frontend\app-field`
- `C:\bthwani-suite\dsh\frontend\app-partner`
- `C:\bthwani-suite\dsh\frontend\control-panel`


### WLT DSH roots


- `C:\bthwani-suite\wlt\frontend\dsh\app-captain`
- `C:\bthwani-suite\wlt\frontend\dsh\app-client`
- `C:\bthwani-suite\wlt\frontend\dsh\app-field`
- `C:\bthwani-suite\wlt\frontend\dsh\app-partner`
- `C:\bthwani-suite\wlt\frontend\dsh\control-panel`


## قاعدة القرار

أي ملف في root يحتوي على business/runtime/API/state-machine/status-map/next-action/financial logic يجب نقله إلى shared المناسب، ثم تحديث المستهلكين، ثم حذف/دمج الملف القديم إذا ثبت أنه لم يعد مستخدمًا.
