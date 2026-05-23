# 06 — API / Binding / Backend / DB Roadmap

## لا API لكل شاشة

API يكون لكل عملية أو احتياج بيانات، وليس لكل شاشة.

مثال:
- StoreScreen قد يحتاج أكثر من endpoint.
- `POST /dsh/client/cart/items` قد يستخدم من StoreScreen وProductDetails وSearch وFavorites.

## ترتيب الاستخراج

```text
Flow
→ Screen/API Matrix
→ OpenAPI endpoint
→ Typed client
→ Binding
→ Backend handler
→ DB query/table
→ Runtime proof
```

## متى نكتب `dsh.openapi.yaml`؟

فقط عندما توجد شريحة تحقق:

```text
visual evidence
+ runtime need
+ screen/api row
+ actor/permission
+ states
+ WLT/Auth boundary
```

## أول endpoint مرشح لاحقًا

بعد الدليل فقط:

```text
GET /dsh/client/stores
```

لأنه:
- بسيط.
- read-oriented.
- لا يبدأ بالماليات.
- يخدم local runtime proof.

## Typed client

الشاشة لا تكتب:

```ts
fetch('/dsh/client/stores')
```

الصحيح:

```ts
dshClient.listClientStores(...)
```

## Backend

لا يبدأ الآن. يبدأ بعد contract-bound slice.

## Database

قاعدة البيانات لا تحدد قبل العملية.

للمنصة الحالية، PostgreSQL هي القاعدة الأساسية المفضلة لأن البيانات مترابطة: orders, stores, partners, captains, audit, roles, state transitions.

MongoDB مؤجل لحالات document-heavy مثبتة فقط.

## WLT

أي:
- ledger
- wallet
- payment
- refund
- payout
- settlement
- commission
- fees

يكون WLT-owned، لا DSH-owned.

## auth

`auth.openapi.yaml` مركزي. الخدمات تعلن security/permissions فقط.
