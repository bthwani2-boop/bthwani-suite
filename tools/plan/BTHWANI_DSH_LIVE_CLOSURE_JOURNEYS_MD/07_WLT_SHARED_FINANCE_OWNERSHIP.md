---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: ملكية WLT shared المالية
---

# 07 — ملكية WLT shared المالية

## القاعدة

`wlt/frontend/dsh/shared` هو العقل المالي الموحد لكل ماليات DSH. لا يوجد finance truth داخل DSH roots ولا داخل DSH shared إلا كـ boundary/reference.

## ما يملكه WLT shared

```text
wallet
payments
refunds
settlements
payouts
commissions
ledger
reconciliation
financial formatting
finance read models
control-panel finance models
boundary contracts
```

## ما لا يملكه DSH

DSH لا يحسب:

```text
wallet balances
ledger entries
refund eligibility as financial truth
settlement amounts
payout decisions
commissions
reconciliation results
```

DSH يحتفظ بالمراجع:

```text
wlt_payment_ref_id
wlt_refund_ref_id
wlt_settlement_ref_id
wlt_callback_event_id
```

## قرارات النقل

| المحتوى | القرار |
|---|---|
| wallet summary format | `MOVE_TO_WLT_SHARED_TOPIC` |
| payment session state | `MOVE_TO_WLT_SHARED_TOPIC` |
| refund process status | `MOVE_TO_WLT_SHARED_TOPIC` |
| settlement calendar | `MOVE_TO_WLT_SHARED_TOPIC` |
| ledger table read model | `MOVE_TO_WLT_SHARED_TOPIC` |
| UI card يعرض finance data فقط | يبقى UI-only في السطح، ويقرأ من WLT shared |

## بوابة WLT shared

```powershell
pnpm run guard:wlt-dsh-shared-ownership
pnpm run guard:wlt-dsh-ui-only-bindings
node tools/guards/guard-service-runtime.mjs --service wlt
pnpm run guard:service-postgres-runtime
```
