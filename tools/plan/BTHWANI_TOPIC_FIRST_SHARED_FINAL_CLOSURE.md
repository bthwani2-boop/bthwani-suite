# BTHWANI_TOPIC_FIRST_SHARED_FINAL_CLOSURE.md

**Project:** BThwani / `bthwani-suite`
**Branch:** `feat/dsh-surface-refactor`
**Canonical local repo:** `C:\bthwani-suite`
**Document status:** تنفيذ إلزامي — قرار معماري وتشغيلي
**Date:** 2026-06-14
**Closure session:** `BTHWANI_TOPIC_FIRST_SHARED_FINAL_CLOSURE`

---

## 0) القرار الحاسم

هذه المرحلة ليست تحسينًا تجميليًا وليست تنظيفًا اختياريًا.
هذه مرحلة إغلاق معماري إلزامية لتحويل DSH/WLT إلى فول ستاك موحد حقيقي.

القرار النهائي:

```text
shared = source of truth
apps/control-panel = UI-only consumers
```

ولا يوجد إغلاق 100% قبل أن تصبح هذه القاعدة مفروضة بالكود والحراس والأدلة.

---

## 1) نطاق الإغلاق الصحيح

يجب التعامل مع هذه المسارات كمنظومة واحدة، لا كتطبيقات منفصلة.

### 1.1 مصادر الحقيقة المشتركة

```text
C:\bthwani-suite\dsh\frontend\shared
C:\bthwani-suite\wlt\frontend\dsh\shared
```

هذه يجب أن تصبح العقل الموحد:

```text
DSH shared = كل منطق DSH حسب المواضيع
WLT DSH shared = كل منطق الماليات المرتبط بـ DSH حسب المواضيع
```

### 1.2 مسارات UI-only فقط

```text
C:\bthwani-suite\dsh\frontend\control-panel
C:\bthwani-suite\dsh\frontend\app-partner
C:\bthwani-suite\dsh\frontend\app-field
C:\bthwani-suite\dsh\frontend\app-client
C:\bthwani-suite\dsh\frontend\app-captain

C:\bthwani-suite\wlt\frontend\dsh\app-captain
C:\bthwani-suite\wlt\frontend\dsh\app-client
C:\bthwani-suite\wlt\frontend\dsh\app-field
C:\bthwani-suite\wlt\frontend\dsh\app-partner
C:\bthwani-suite\wlt\frontend\dsh\control-panel
```

هذه المسارات يجب أن تحتوي فقط على:

```text
screens
route shell
route renderer
UI composition
local visual state فقط
ui-kit rendering
copy خاص بالسطح
bindings خفيفة جدًا
```

ولا تحتوي على:

```text
business logic
API clients
runtime adapters
state machines
status maps
next action maps
media upload flow
order lifecycle
delivery lifecycle
catalog logic
field readiness
support escalation
payment/refund/settlement/payout/ledger logic
fallback/demo/mock/sample/preview runtime
```

---

## 2) اسم المرحلة

```text
BTHWANI_TOPIC_FIRST_SHARED_FINAL_CLOSURE
```

هدف المرحلة:

```text
تحويل shared إلى Topic-first SSOT
وتحويل كل app/control-panel إلى UI-only
وحذف/دمج/نقل/تقسيم كل ملف مخالف.
```

---

## 3) سبب القرار

المشكلة الأصلية كانت أن كل تطبيق يبني ما يخصه بشكل منفصل.

المشكلة بعد التحسين الجزئي أصبحت أخطر بشكل مختلف:

```text
تم نقل بعض منطق التطبيقات إلى shared،
لكن غالبًا كـ surface-specific shared hooks
بدل أن يصبح shared مبنيًا على مواضيع موحدة تخدم كل الأسطح.
```

هذا يخلق خطرًا مباشرًا:

```text
shared يتحول إلى مجلد يربط التطبيقات كلٌ على حدة،
بدل أن يكون مصدر حقيقة موحد للمواضيع:
products / stores / orders / checkout / delivery / media / support...
```

لذلك التقسيم يجب أن يكون **Topic-first / Domain-first** وليس Layer-first ولا Surface-first.

---

## 4) تعريف Topic-first

### 4.1 ممنوع أن يكون shared مبنيًا أساسًا على طبقات عامة

الوضع غير المقبول:

```text
shared/
  contracts/
  adapters/
  view-models/
  policies/
  state-machines/
```

هذا يعيد التشتت داخل shared؛ لأن منطق المنتج مثلًا يتوزع بين `contracts` و`adapters` و`view-models` و`policies`.

### 4.2 المطلوب

الوضع الصحيح:

```text
shared/
  products/
  stores/
  catalog/
  discovery/
  cart/
  checkout/
  orders/
  delivery/
  captain/
  partner/
  field/
  support/
  media/
  notifications/
  operations/
  marketing/
  platform/
  control-panel/
  finance-boundary/
  runtime/
  full-stack/
  presentation-models/
```

داخل كل topic توضع طبقاته الداخلية فقط:

```text
*.types.ts
*.contracts.ts
*.api.ts
*.adapters.ts
*.view-models.ts
*.policies.ts
*.lifecycle.ts عند الحاجة
*.guards.ts عند الحاجة
index.ts
```

القاعدة:

```text
الموضوع أولًا، الطبقة ثانيًا.
```

---

## 5) الهيكل النهائي المطلوب لـ DSH shared

```text
dsh/frontend/shared/
  full-stack/
  runtime/
  identity-access/
  products/
  stores/
  catalog/
  discovery/
  cart/
  checkout/
  orders/
  delivery/
  captain/
  partner/
  field/
  support/
  media/
  notifications/
  operations/
  marketing/
  platform/
  control-panel/
  finance-boundary/
  presentation-models/
  index.ts
```

### 5.1 `full-stack/`

الغرض: خريطة قدرات فول ستاك، التغطية، وإثبات أن كل موضوع يخدم الأسطح والأقسام المطلوبة.

يحتوي:

```text
capabilities.ts
capability-map.ts
capability-coverage.types.ts
topic-coverage.types.ts
surface-coverage.types.ts
control-panel-coverage.types.ts
index.ts
```

ممنوع داخله:
- UI
- API calls
- runtime state
- surface-specific hooks

### 5.2 `runtime/`

الغرض: سياق التشغيل العام، env، auth، platform vars، feature flags، offline policy، error policy.

يحتوي:

```text
runtime.types.ts
runtime-context.ts
runtime-errors.ts
runtime-auth.ts
runtime-environment.ts
platform-vars/
feature-flags/
offline-policy/
index.ts
```

### 5.3 `identity-access/`

الغرض: actors, roles, permissions, surface visibility.

يحتوي:

```text
actors.types.ts
roles.types.ts
permissions.policy.ts
surface-visibility.policy.ts
actor-capability-map.ts
index.ts
```

### 5.4 `products/`

الغرض: كل ما يتعلق بالمنتجات كدومين موحد يخدم العميل، الشريك، الكتالوج، التسويق، ولوحة التحكم.

يحتوي:

```text
products.types.ts
products.contracts.ts
products.api.ts
products.adapters.ts
products.view-models.ts
products.media.ts
products.policies.ts
products.validation.ts
index.ts
```

ينقل إليه من app-client/app-partner/control-panel:
- product card mapping
- product media display models
- product edit models غير UI
- menu item to product card mappers
- product visibility rules
- product validation
- product category linking

### 5.5 `stores/`

الغرض: المتاجر، الجاهزية، الهوية، النطاق، العنوان، الخدمة، availability.

يحتوي:

```text
stores.types.ts
stores.contracts.ts
stores.api.ts
stores.adapters.ts
stores.view-models.ts
stores.readiness.ts
stores.serviceability.ts
stores.policies.ts
index.ts
```

ينقل إليه:
- store profile model
- store search helpers غير UI
- store formatting
- store readiness
- partner store scope policies
- field store onboarding contract

### 5.6 `catalog/`

الغرض: taxonomy, categories, publication, approvals, catalog governance, inventory links.

يحتوي:

```text
catalog.types.ts
catalog.contracts.ts
catalog.api.ts
catalog.adapters.ts
catalog.publication.ts
catalog.taxonomy.ts
catalog.conflicts.ts
catalog.approvals.ts
catalog.view-models.ts
index.ts
```

ينقل إليه:
- category model
- taxonomy logic
- catalog publishing gates
- catalog duplicate resolution logic
- category control room non-UI logic
- product/catalog governance logic من control-panel

### 5.7 `discovery/`

الغرض: home feed, store discovery, search, category rails, promo feed projection.

يحتوي:

```text
discovery.types.ts
discovery.api.ts
discovery.adapters.ts
discovery.search.ts
discovery.home-feed.ts
discovery.view-models.ts
index.ts
```

ينقل إليه:
- home search helpers
- home promo mappers
- discovery stores bridge/client/transport إذا كانت runtime مشتركة
- home category derivation
- store feed projections

### 5.8 `cart/`

الغرض: cart model, item quantities, totals before checkout, cart policies.

يحتوي:

```text
cart.types.ts
cart.model.ts
cart.calculations.ts
cart.policies.ts
cart.view-models.ts
index.ts
```

ينقل إليه:
- cart state المنطقي
- cart calculations
- cart display model
- cart validation

ممنوع:
- payment mutation
- wallet mutation

### 5.9 `checkout/`

الغرض: checkout intent, checkout view model, checkout readiness, payment selection boundary.

يحتوي:

```text
checkout.types.ts
checkout.intent.ts
checkout.adapters.ts
checkout.view-models.ts
checkout.policies.ts
checkout.actions.ts
index.ts
```

ينقل إليه:
- checkout presenter
- checkout adapters
- checkout intent model
- non-financial payment display model

يربط WLT عبر:

```text
finance-boundary/
```

وليس عبر WLT app-client.

### 5.10 `orders/`

الغرض: order lifecycle, order detail projection, tracking, cancellation, issue linking.

يحتوي:

```text
orders.types.ts
orders.contracts.ts
orders.api.ts
orders.adapters.ts
orders.lifecycle.ts
orders.tracking.ts
orders.actions.ts
orders.view-models.ts
index.ts
```

ينقل إليه:
- order tracking
- orders list model
- order issue model
- initial/seed orders إن كانت runtime يجب حذفها أو نقلها كـ dev-only test fixture
- command target to order route policies

### 5.11 `delivery/`

الغرض: delivery lifecycle, pickup/dropoff, assignment, dispatch state.

يحتوي:

```text
delivery.types.ts
delivery.lifecycle.ts
delivery.actions.ts
delivery.adapters.ts
delivery.view-models.ts
delivery.policies.ts
index.ts
```

ينقل إليه:
- delivery lifecycle
- pickup/dropoff action model
- delivery status mapping
- store courier lifecycle

### 5.12 `captain/`

الغرض: captain-specific domain غير UI: availability, GPS status, captain operation model, captain route policies.

يحتوي:

```text
captain.types.ts
captain.availability.ts
captain.gps.ts
captain.route-policy.ts
captain.actions.ts
captain.view-models.ts
captain.support.ts
index.ts
```

ينقل إليه:
- CaptainAvailabilityStatus
- CaptainGpsStatus
- CaptainAppMode
- captain availability meta
- route command mapping
- captain account/domain model

ملاحظة: PoD media لا يوضع هنا بالكامل؛ يوضع في `media/pod` مع ربط من `captain`.

### 5.13 `partner/`

الغرض: partner readiness, orders inbox model, catalog participation, store scope, partner support model.

يحتوي:

```text
partner.types.ts
partner.readiness.ts
partner.orders.ts
partner.catalog.ts
partner.store-scope.ts
partner.support.ts
partner.view-models.ts
index.ts
```

ينقل إليه:
- partner scope
- runtime partner profile model
- partner actionable handoffs
- partner order action model
- partner support context builders

### 5.14 `field/`

الغرض: field onboarding, visits, documents, readiness escalation, offline draft policy.

يحتوي:

```text
field.types.ts
field.onboarding.ts
field.visits.ts
field.documents.ts
field.readiness.ts
field.escalation.ts
field.offline-draft.ts
field.view-models.ts
index.ts
```

ينقل إليه:
- field store creation model
- visit values/errors
- document upload state
- readiness escalation
- route stack إذا كان business workflow
- offline queue/sync policy

### 5.15 `support/`

الغرض: tickets, chat, escalations, support command routing, attachments.

يحتوي:

```text
support.types.ts
support.api.ts
support.chat.ts
support.escalation.ts
support.attachments.ts
support.routing.ts
support.view-models.ts
index.ts
```

ينقل إليه:
- support command contexts
- issue category resolvers
- support escalation queue model
- support chat routing
- ticket detail model غير UI

### 5.16 `media/`

الغرض: كل Media Runtime موحد.

يحتوي:

```text
media.types.ts
media.api.ts
media.upload-flow.ts
media.asset-linking.ts
media.identity.ts
media.view-models.ts
media.policies.ts
pod/
catalog/
field-documents/
support-attachments/
marketing/
index.ts
```

المسار الموحد:

```text
create upload intent
PUT to storage
complete upload
persist metadata
link entity
read/list
```

ممنوع:
- base64 placeholder
- local uri كحقيقة runtime
- manual media key
- fixture media key

### 5.17 `notifications/`

الغرض: notification fetching, bell state, notification read model.

يحتوي:

```text
notifications.types.ts
notifications.api.ts
notifications.adapters.ts
notifications.view-models.ts
notifications.policies.ts
index.ts
```

ينقل إليه:
- bell state
- notification list fetching
- notification screen model

### 5.18 `operations/`

الغرض: control-panel operations: live orders, dispatch, SLA, rescue, exceptions, audit.

يحتوي:

```text
operations.types.ts
operations.orders.ts
operations.dispatch.ts
operations.sla.ts
operations.exceptions.ts
operations.audit.ts
operations.view-models.ts
index.ts
```

ينقل إليه:
- command center models
- dispatch assignment logic
- SLA calculations
- order rescue models
- geo heatmap helpers إذا كانت business/runtime وليست purely visual

### 5.19 `marketing/`

الغرض: campaigns, banners, promos, videos, loyalty, visibility, smart signals.

يحتوي:

```text
marketing.types.ts
marketing.campaigns.ts
marketing.banners.ts
marketing.videos.ts
marketing.promos.ts
marketing.visibility.ts
marketing.media.ts
marketing.view-models.ts
index.ts
```

ينقل إليه:
- banner/video target utils
- section meta إذا كان non-UI
- marketing permission contracts
- marketing review queue models
- campaign/offers visibility rules

### 5.20 `platform/`

الغرض: platform vars, providers, rollouts, services, health, audit.

يحتوي:

```text
platform.types.ts
platform-vars.ts
platform-providers.ts
platform-rollouts.ts
platform-services.ts
platform-health.ts
platform-audit.ts
platform.view-models.ts
index.ts
```

القاعدة:
- إذا API موجود: API-backed.
- إذا API ناقص: read-only / contract-required / disabled-by-policy.
- ممنوع local apply يوحي بتطبيق حقيقي.

### 5.21 `control-panel/`

الغرض: control panel section ownership, section map, governance, composition models فقط.

يحتوي:

```text
control-panel.sections.ts
control-panel.ownership.ts
control-panel.capabilities.ts
control-panel.navigation.ts
control-panel.view-models.ts
index.ts
```

ممنوع أن يصبح بديلًا عن topics.
أي منطق catalog يبقى في `catalog/`، وأي منطق operations يبقى في `operations/`.

### 5.22 `finance-boundary/`

الغرض: DSH read-only bridge إلى WLT.

يحتوي:

```text
dsh-wlt-read-model.types.ts
dsh-wlt-boundary.policy.ts
dsh-wlt-surface-projection.ts
dsh-wlt-view-models.ts
index.ts
```

ممنوع:
- money mutation
- wallet mutation
- refund/settlement/payout mutation

### 5.23 `presentation-models/`

الغرض: data-only UI models المشتركة.

يحتوي:

```text
empty-state.model.ts
loading-state.model.ts
error-state.model.ts
status-label.model.ts
action-label.model.ts
navigation-label.model.ts
index.ts
```

ممنوع:
- JSX
- ui-kit
- Tamagui
- CSS
- StyleSheet

---

## 6) الهيكل النهائي المطلوب لـ WLT DSH shared

```text
wlt/frontend/dsh/shared/
  wallet/
  payments/
  refunds/
  settlements/
  payouts/
  commissions/
  ledger/
  reconciliation/
  control-panel/
  boundary/
  clients/
  formatters/
  index.ts
```

### 6.1 `wallet/`

```text
wallet.types.ts
wallet.client.ts
wallet.read-model.ts
wallet.session.ts
wallet.view-models.ts
wallet.policies.ts
index.ts
```

يخدم:
- app-client wallet UI
- control-panel wallet summary
- DSH finance-boundary read-only

### 6.2 `payments/`

```text
payments.types.ts
payments.client.ts
payments.intent.ts
payments.session.ts
payments.deeplink.policy.ts
payments.view-models.ts
index.ts
```

يخدم:
- checkout payment selector
- WLT payment screen/binding
- DSH checkout boundary

ممنوع:
- fallback order ID مثل `dsh-checkout`
- hardcoded payment deep link داخل adapter عام بدون policy

### 6.3 `refunds/`

```text
refunds.types.ts
refunds.client.ts
refunds.read-model.ts
refunds.policies.ts
refunds.view-models.ts
index.ts
```

### 6.4 `settlements/`

```text
settlements.types.ts
settlements.client.ts
settlements.partner.ts
settlements.store.ts
settlements.calendar.ts
settlements.view-models.ts
index.ts
```

### 6.5 `payouts/`

```text
payouts.types.ts
payouts.captain.ts
payouts.view-models.ts
payouts.policies.ts
index.ts
```

### 6.6 `commissions/`

```text
commissions.types.ts
commissions.field.ts
commissions.view-models.ts
index.ts
```

### 6.7 `ledger/`

```text
ledger.types.ts
ledger.client.ts
ledger.read-model.ts
ledger.projections.ts
ledger.readonly-policy.ts
index.ts
```

### 6.8 `reconciliation/`

```text
reconciliation.types.ts
reconciliation.daily.ts
reconciliation.audit.ts
reconciliation.trial-balance.ts
index.ts
```

### 6.9 `control-panel/`

```text
finance-center.view-model.ts
trial-balance.view-model.ts
statements.view-model.ts
audit.view-model.ts
wallet-control-center.view-model.ts
index.ts
```

### 6.10 `boundary/`

```text
wlt-dsh-boundary.policy.ts
dsh-finance-read-model.types.ts
finance-ownership.policy.ts
index.ts
```

### 6.11 `clients/`

```text
wlt-dsh-typed-client.ts
http-client.types.ts
index.ts
```

### 6.12 `formatters/`

```text
money.format.ts
finance-labels.ts
finance-status-labels.ts
index.ts
```

---

## 7) قواعد الاستيراد

### 7.1 القاعدة الذهبية

```text
UI roots import shared.
shared must not import UI roots.
```

ممنوع داخل `dsh/frontend/shared`:

```text
../app-client
../app-partner
../app-captain
../app-field
../control-panel
../../wlt/frontend/dsh/app-client
../../wlt/frontend/dsh/app-partner
../../wlt/frontend/dsh/app-captain
../../wlt/frontend/dsh/app-field
../../wlt/frontend/dsh/control-panel
```

مسموح:

```text
dsh/frontend/shared/* → dsh/frontend/shared/*
dsh/frontend/app-* → dsh/frontend/shared/*
dsh/frontend/control-panel → dsh/frontend/shared/*
dsh/frontend/shared/finance-boundary → wlt/frontend/dsh/shared/*
wlt/frontend/dsh/app-* → wlt/frontend/dsh/shared/*
wlt/frontend/dsh/control-panel → wlt/frontend/dsh/shared/*
```

### 7.2 منع الدورات

المسموح من topics إلى topics:

```text
checkout → cart, orders, finance-boundary
delivery → orders, captain, media
captain → delivery, orders, support, media
partner → stores, products, catalog, orders, support
field → stores, media, support
operations → orders, delivery, captain, support
marketing → products, stores, media
control-panel → topic view-models فقط
```

الممنوع:
- `products` يستورد `app-client`
- `stores` يستورد `control-panel`
- `orders` يستورد `captain surface`
- `checkout` يستورد `wlt app-client`
- `shared` يستورد أي screen أو component

---

## 8) قاعدة UI-only لكل مسار

### 8.1 المسموح داخل UI-only roots

```text
screens/
parts/
sheets/
components/ بشرط UI فقط
route renderer
route shell
surface shell
screen registry
route definitions
ui copy
local visual state
ui-kit rendering
```

### 8.2 الممنوع داخل UI-only roots

```text
API clients
fetch/list/update/create/delete
runtime adapters
state machines
business policies
status maps
next action maps
media upload
lifecycle actions
WLT typed client
ledger/payment/refund/settlement/payout logic
fallback/demo/mock/sample/preview runtime
Date.now runtime IDs
silent catch
large hooks
large presenters
large adapters
```

### 8.3 قرارات الملفات المخالفة

أي ملف مخالف يأخذ قرارًا واحدًا:

```text
MOVE_TO_DSH_SHARED
MOVE_TO_WLT_DSH_SHARED
MOVE_TO_UI_KIT
MERGE_DUPLICATE
SPLIT_BY_TOPIC
RETIRE_DEAD
KEEP_UI_ONLY
```

---

## 9) مصفوفة قرار كل مسار

| المسار | القرار |
|---|---|
| `dsh/frontend/shared` | يتحول إلى DSH Topic-first SSOT |
| `dsh/frontend/control-panel` | UI-only sections فقط |
| `dsh/frontend/app-client` | UI-only client surface |
| `dsh/frontend/app-partner` | UI-only partner surface |
| `dsh/frontend/app-captain` | UI-only captain surface |
| `dsh/frontend/app-field` | UI-only field surface |
| `wlt/frontend/dsh/shared` | WLT Topic-first finance SSOT |
| `wlt/frontend/dsh/app-client` | UI/binding فقط |
| `wlt/frontend/dsh/app-partner` | UI/binding فقط |
| `wlt/frontend/dsh/app-captain` | UI/binding فقط |
| `wlt/frontend/dsh/app-field` | UI/binding فقط |
| `wlt/frontend/dsh/control-panel` | finance UI فقط |

---

## 10) مهام التنفيذ

### المرحلة A — تثبيت الحراس قبل النقل

أضف/قوّي:

```text
guard:shared-topic-first-structure
guard:shared-must-not-import-ui-roots
guard:no-surface-model-god-hooks
guard:wlt-topic-first-structure
guard:no-wlt-dev-fallback-ids
guard:capability-map-topic-coverage
guard:ui-only-surfaces
guard:dsh-shared-no-ui
guard:wlt-dsh-ui-only-bindings
```

شروطها:

```text
1. dsh/frontend/shared/index.ts لا يصدّر contracts/adapters/view-models كطبقات رئيسية إلا compatibility مؤقت.
2. كل capability يجب أن تشير إلى topic واحد أو أكثر.
3. shared ممنوع يستورد app-client/app-partner/app-captain/app-field/control-panel.
4. أي hook في shared باسم useDsh*SurfaceModel فوق حد معين يفشل.
5. WLT shared ممنوع يحتوي client-dev/default checkout fallback.
6. WLT app roots تبقى wrappers فقط.
7. UI roots ممنوع تحتوي business/runtime/API/finance/media logic.
8. DSH shared ممنوع يحتوي JSX/ui-kit/Tamagui.
```

### المرحلة B — إنشاء Topic Ownership Matrix

أنتج:

```text
tools/registry/runs/BTHWANI_TOPIC_FIRST_SHARED_FINAL_CLOSURE-YYYYMMDD-HHMMSS/topic-ownership-matrix.json
```

لكل ملف في النطاق:

```json
{
  "path": "",
  "current_owner": "",
  "target_topic": "",
  "decision": "",
  "reason": "",
  "imports_in": [],
  "imports_out": [],
  "ui_root_consumer": [],
  "backend_or_openapi_link": [],
  "wlt_link": [],
  "media_link": [],
  "delete_after_move": false,
  "guard_required": []
}
```

### المرحلة C — تحويل DSH shared إلى Topic-first

1. إنشاء مجلدات topics المطلوبة.
2. نقل الملفات الحالية من layer-first إلى topics.
3. تحويل root `index.ts` إلى topic gateway فقط.
4. منع root layer exports العشوائية.
5. تحديث imports في UI roots.
6. تشغيل TypeScript بعد كل دفعة نقل.

### المرحلة D — تفكيك Surface Model God Hooks

لا تترك هذه الملفات كجامع منطق ضخم:

```text
useDshClientSurfaceModel
useDshCaptainSurfaceModel
useDshFieldSurfaceModel
useDshPartnerSurfaceModel
```

التحويل الصحيح:

```text
surface model = composition رفيع
topic model = منطق فعلي
```

مثال العميل:

```text
client-surface.model.ts يستدعي:
  stores.view-model
  products.view-model
  cart.model
  checkout.model
  orders-tracking.model
  notifications.model
  marketing.model
```

مثال الكابتن:

```text
captain-surface.model.ts يستدعي:
  captain.availability
  captain.gps
  delivery.lifecycle
  delivery.actions
  media/pod/upload-flow
  support/captain-support
  orders/captain-order
```

### المرحلة E — منع shared من استيراد app roots

أي imports مثل:

```text
shared → app-client
shared → app-partner
shared → app-captain
shared → app-field
shared → control-panel
shared → wlt/frontend/dsh/app-*
```

يجب إصلاحها فورًا بنقل النوع/الوظيفة إلى shared topic مناسب أو حذفها.

### المرحلة F — تحويل WLT shared إلى Topic-first

1. إنشاء topics مالية:
   - wallet
   - payments
   - refunds
   - settlements
   - payouts
   - commissions
   - ledger
   - reconciliation
   - control-panel
   - boundary
   - clients
   - formatters

2. نقل:
   - `client-wallet-session.model.ts` إلى `wallet/`
   - `client-wallet-runtime.adapter.ts` إلى `wallet/` و`payments/`
   - ledger projections إلى `ledger/`
   - statements إلى `control-panel/`
   - settlement logic إلى `settlements/`
   - payout logic إلى `payouts/`
   - field commission logic إلى `commissions/`

3. تصفير fallback/dev IDs:
   - `client-dev-*`
   - `dsh-checkout`
   - `demo`
   - `mock`
   - `fallback`

### المرحلة G — تحويل UI roots إلى consumers فقط

لكل UI root:

```text
1. احتفظ بالشاشات والـ JSX.
2. انقل المنطق إلى topic مناسب.
3. استبدل imports لتأتي من shared topic.
4. احذف wrappers التي لا تضيف قيمة.
5. ادمج الملفات الصغيرة المتكررة.
6. لا تغيّر التصميم إلا لإزالة wording مزيف أو preview/local.
```

### المرحلة H — Backend/OpenAPI consistency

يجب فحص:

```text
dsh/backend
dsh/openapi
wlt/backend إن وجد
wlt/openapi إن وجد
```

والتأكد من:

```text
1. كل topic له backend/OpenAPI owner واضح إن احتاج.
2. UI لا يستدعي fetch مباشرة.
3. shared/api أو topic/api هو المدخل الوحيد.
4. generated OpenAPI types لا تعيش في app roots.
5. أي endpoint ناقص يتحول إلى contract-required state واضح، لا fallback.
```

### المرحلة I — حذف/دمج/تقسيم

بعد النقل:

```text
RETIRE_DEAD: لا imports ولا routes ولا registry ولا tests.
MERGE_DUPLICATE: نفس الغرض مكرر في أكثر من ملف.
SPLIT_BY_TOPIC: ملف ضخم يحتوي أكثر من موضوع.
MOVE_TO_UI_KIT: أي reusable visual component.
```

يجب إنتاج:

```text
moved-files-report.json
retired-files-report.json
merged-files-report.json
split-files-report.json
```

---

## 11) حماية التصميم الحالي

ممنوع تدمير الواجهات.

القواعد:

```text
1. لا تغيّر JSX إلا عند الضرورة.
2. لا تغيّر layout.
3. لا تغيّر spacing.
4. لا تغيّر hierarchy.
5. لا تغيّر colors/tokens.
6. لا تنقل UI reusable إلى shared.
7. أي UI reusable يذهب إلى ui-kit.
8. انقل logic فقط.
9. الشاشة تستقبل props/model من shared وتعرض بنفس الشكل.
10. أي تغيير بصري يحتاج visual evidence.
```

---

## 12) أوامر التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check

pnpm -w exec tsc --noEmit

pnpm run guard:shared-topic-first-structure
pnpm run guard:shared-must-not-import-ui-roots
pnpm run guard:no-surface-model-god-hooks
pnpm run guard:wlt-topic-first-structure
pnpm run guard:no-wlt-dev-fallback-ids
pnpm run guard:capability-map-topic-coverage
pnpm run guard:ui-only-surfaces
pnpm run guard:dsh-shared-no-ui
pnpm run guard:wlt-dsh-ui-only-bindings
pnpm run guard:bthwani-full-stack:strict
pnpm run guard:dsh-zero-gap-runtime-boundaries
pnpm run guard:depcruise:live-boundaries
pnpm run guard:jscpd:live
pnpm run guard:ui-kit-central-design-ownership
pnpm run guard:tamagui-import-boundary
```

إذا تم لمس backend:

```powershell
go test ./...
```

إذا تم لمس Docker/runtime:

```powershell
docker compose -f .\docker-compose.local.yml config
```

---

## 13) أدلة الإغلاق المطلوبة

يجب إنشاء:

```text
tools/registry/runs/BTHWANI_TOPIC_FIRST_SHARED_FINAL_CLOSURE-YYYYMMDD-HHMMSS/
  SUMMARY.md
  evidence.json
  topic-ownership-matrix.json
  moved-files-report.json
  retired-files-report.json
  merged-files-report.json
  split-files-report.json
  shared-topic-coverage.json
  ui-only-roots-report.json
  guard-results.log
  typecheck.log
  diff-check.txt
  visual-evidence-index.md
  final-decision.md
  _HANDOFF.zip
```

---

## 14) معايير القبول

لا تقبل النتيجة إلا إذا تحقق كل ما يلي:

```text
1. DSH shared أصبح Topic-first.
2. WLT shared أصبح Topic-first.
3. shared لا يستورد app/control-panel.
4. UI roots لا تحتوي business/runtime/API/finance/media logic.
5. كل topic يخدم أكثر من سطح عند الحاجة.
6. لا surface-specific god hook يجمع كل شيء.
7. WLT لا يحتوي fallback/dev runtime IDs.
8. capability map أصبح topic-aware.
9. OpenAPI/generated types مملوكة من shared.
10. TypeScript ينجح.
11. كل الحراس تنجح.
12. لا duplicates مؤثرة.
13. لا dead code.
14. لا preview/demo/mock/sample/fallback runtime.
15. لا تدمير للتصميم.
16. visual evidence موجود للواجهات المتأثرة.
```

---

## 15) قرارات الرفض

ارفض الإغلاق إذا وجد أي مما يلي:

```text
shared imports app-root
WLT shared imports WLT app-root
UI root contains runtime adapter
UI root contains API client
UI root contains state machine
UI root contains payment/ledger/refund/settlement/payout logic
shared remains layer-first as primary structure
surface model hook contains multiple unrelated topics
fallback/dev ID in runtime
visual evidence missing after UI change
guards skipped
TypeScript failed
```

---

## 16) القرار النهائي المقبول

القرار المقبول الوحيد بعد التنفيذ:

```text
TOPIC_FIRST_SHARED_CLOSED_WITH_EVIDENCE
```

الممنوع:

```text
PASS_WITH_WARNINGS
REPORT_ONLY
DEFERRED
FIX_REQUIRED_WITH_EXACT_PATHS
CLOSED_WITHOUT_RUNTIME
CLOSED_WITHOUT_VISUAL
CLOSED_WITHOUT_GUARDS
CLOSED_WITHOUT_TOPIC_OWNERSHIP
```

---

## 17) أمر التنفيذ المختصر للوكيل

```text
نفّذ مرحلة BTHWANI_TOPIC_FIRST_SHARED_FINAL_CLOSURE داخل C:\bthwani-suite وعلى الفرع feat/dsh-surface-refactor.

حوّل dsh/frontend/shared إلى Topic-first SSOT، وحوّل wlt/frontend/dsh/shared إلى Topic-first finance SSOT، واجعل كل app/control-panel في DSH/WLT UI-only consumers فقط.

ابدأ بالحراس، ثم topic ownership matrix، ثم النقل الموضوعي، ثم تفكيك surface god hooks، ثم منع shared imports من app roots، ثم WLT topic-first، ثم تنظيف UI roots، ثم حذف/دمج/تقسيم، ثم التحقق الكامل.

ممنوع أي ادعاء إغلاق قبل:
TypeScript pass,
guards pass,
topic ownership matrix,
moved/retired/merged/split reports,
visual evidence,
final-decision.md.
```

---

## 18) النتيجة المطلوبة

النهاية الصحيحة ليست فقط أن يقل عدد الملفات.

النهاية الصحيحة:

```text
كل ملف في مكانه الصحيح.
كل موضوع له مالك واحد.
كل تطبيق يستهلك shared بدل أن يبني منطقًا خاصًا.
كل قسم في لوحة التحكم يستخدم نفس topics.
كل الماليات تمر عبر WLT shared.
كل UI يبقى محافظًا على التصميم الحالي.
كل الحراس تمنع الرجوع للكوارث السابقة.
```

هذا هو شرط فول ستاك بثواني الحقيقي.
