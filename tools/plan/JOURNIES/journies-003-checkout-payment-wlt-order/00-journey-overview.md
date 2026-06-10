<!--
BThwani DSH/WLT Human Sequential Closure — Journey-style organization
New canonical human-review folder: dsh/docs/journies-003-checkout-payment-wlt-order/
Source package reorganization: V3.1, generated 2026-06-08
Note: folder name intentionally follows user-requested spelling: journies-###-slug.
-->

# J-003 — Checkout, Payment, WLT Bridge, Order Creation

> ملف رحلة بشري تفصيلي. الرحلة لا تغلق إلا بعد إغلاق كل شرائحها بأدلة مستقلة.


## القواعد الحاكمة الثابتة

- الريبو المحلي النشط الوحيد: `C:\bthwani-suite`.
- مرجع GitHub المطلوب: `fix/docker-local-runtime-standardization`؛ تم التعامل معه كمرجع قراءة فقط.
- لا GitHub write: لا commit، لا push، لا PR، لا merge من داخل هذه الحزمة.
- يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.
- كل شريحة ليست شاشة واحدة؛ هي سلسلة: Actor + Goal + Surface group + Operation + Evidence.
- لا انتقال إلى الشريحة التالية حتى تكون الشريحة الحالية: PASS بدليل، أو BLOCKED_WITH_REASON بسبب محدد، أو DEFERRED_WITH_REASON إلى شريحة محددة.
- WLT هو المالك الوحيد لأي wallet / ledger / refund / payout / settlement / reconciliation / money mutation.
- DSH لا ينفذ أي منطق مالي محلي ولا يلتف على WLT.
- يجب الالتزام بنظام الألوان المركزي، لا ألوان عشوائية ولا تصميم محلي مكرر.
- أي تصميم قابل لإعادة الاستخدام يجب أن يمر عبر `@bthwani/ui-kit` public exports؛ Tamagui داخلي داخل ui-kit فقط.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الشريحة فقط.
- خيار الاستدعاء/on-demand retrieval إلزامي: IDs/references/lean summaries/detail-on-open/pagination/caching/scoped payloads.
- بيانات وصور DSH التجريبية/التمهيدية/المعاينة مركزها فقط:
  - `dsh/frontend/data`
  - `dsh/frontend/media-fixtures`
- لا PASS / CLOSED / READY / 100% بدون evidence عملي: Git + typecheck/test + runtime/logs + screenshots عند UI.


## 1) Journey Identity

| Field | Value |
|---|---|
| Journey ID | `J-003` |
| Name | Checkout, Payment, WLT Bridge, Order Creation |
| Type | `business` |
| Primary Actors | client, WLT, partner, operator |
| Control Panel / Domain Owner | finance + operations |
| WLT Boundary | full WLT ownership for money/payment/ledger |
| Planning Status | `CURRENT_BLOCKED_REQUIRES_E2E_AUTH_WLT_PROOF` |
| Business Outcome | A client creates an order through serviceability, checkout intent, WLT payment, idempotent callback, DSH order creation, partner intake, and control-panel monitoring. |

## 2) لماذا هذه الرحلة موجودة؟

هذه الرحلة تمنع إغلاقًا وهميًا لشاشة واحدة. المطلوب إثبات الدائرة كاملة عبر الأسطح المرتبطة: التطبيق، لوحة التحكم، الباكند، OpenAPI، binding، runtime، WLT عند المال، وملفات evidence.

## 3) ترتيب الشرائح داخل الرحلة

| Slice ID | Slice | Actor | Surface / Area | Outcome | File | Status |
|---|---|---|---|---|---|---|
| `DSH-SLICE-003A` | Cart Serviceability and Auth Binding | client | app-client + Go backend | cart is serviceable and bound to client identity | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003A-cart-serviceability-and-auth-binding.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-003B` | Checkout Intent Address and Time Window | client | app-client + backend/OpenAPI | client selects address/time/options and receives valid checkout intent | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003B-checkout-intent-address-and-time-window.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-003C` | WLT Payment Bridge and Money Boundary | client/WLT | WLT + app-client + DSH read-only bridge | payment initiated/executed only by WLT | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003C-wlt-payment-bridge-and-money-boundary.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-003D` | Idempotent Order Creation Handoff | client/backend | DSH backend + OpenAPI + WLT callback | order created once, no duplicate retry side effects | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003D-idempotent-order-creation-handoff.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-003E` | Payment Failure and Support Entry | client/operator | app-client + control-panel | failed/expired payment exposes support-safe recovery | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003E-payment-failure-and-support-entry.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-003F` | Partner Order Intake After Payment | partner | app-partner + backend | paid/confirmed order appears to partner with correct status | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003F-partner-order-intake-after-payment.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-003G` | Checkout Control Panel Finance/Ops Visibility | operator | control-panel + WLT read-only bridge | operator monitors checkout without DSH money mutation | `slices/j-003-checkout-payment-wlt-bridge-order-creation/DSH-SLICE-003G-checkout-control-panel-finance-ops-visibility.md` | NOT_CLOSED_BY_THIS_FILE |

## 4) Dependency Order

1. اقرأ foundational docs والمصفوفات والregistries.
2. أغلق data/contracts/API/backend قبل UI عندما تعتمد UI عليها.
3. أغلق frontend states/CTAs/navigation بعد ثبوت contract أو blocker.
4. أغلق control-panel/audit/permission عند وجود operator action.
5. أغلق WLT boundary قبل أي claim مالي.
6. حدّث truth docs فقط بعد evidence.
7. لا تفتح الشريحة التالية إذا بقي TBD.


## طبقات الإغلاق المطلوبة

| الطبقة | المطلوب فحصه أو تعديله داخل نطاق الشريحة |
|---|---|
| Docs truth | ملف الشريحة، ملف الرحلة، manifest/matrices المرتبطة، عدم وجود تناقض PASS/PENDING |
| OpenAPI/API | endpoint، operationId، request/response، error cases، auth، idempotency عند الحاجة |
| Go backend | handler، repository، migrations، tests، logs، DB indexes، error handling |
| Typed clients/binding | shared contracts، transport، error types، no direct fetch in screens إذا كان مخالفًا |
| Frontend UI code | screen/route/CTA/state/navigation، RTL، loading/empty/error/offline/disabled/success |
| Control panel | owner/action/audit/rollback/permission/live-vs-preview |
| Runtime | local Docker/Postgres/API/Next/Expo/ADB/scrcpy proof حسب الشريحة |
| Data/media | central source only، no local divergent fixtures، mediaKey/reference |
| WLT | read-only/authorized WLT API/event فقط، no local money mutation |
| Evidence | tools/registry/runs/{{SESSION_ID}}/{{SESSION_ID}}.zip مع ملفات الإثبات |


## 5) Cross-Surface Impact Map

| Surface | Default classification in this journey | Required proof |
|---|---|---|
| app-client | primary/supporting/dependency حسب الشريحة | screenshots + runtime state |
| app-partner | primary/supporting/dependency حسب الشريحة | screenshots + runtime state |
| app-captain | primary/supporting/dependency حسب الشريحة | screenshots + runtime state |
| app-field | primary/supporting/dependency حسب الشريحة | screenshots + runtime state |
| control-panel | owner/supporting عند operator action | localhost screenshots + audit/logs |
| DSH backend/OpenAPI | dependency عند أي runtime/API | request/response + tests |
| WLT | dependency عند أي مال | WLT evidence + no DSH mutation |
| data/media | dependency عند preview/media | central owner + no local copies |

## 6) Human Review Workflow

- افتح كل slice file بالترتيب.
- نفذ الشريحة فقط.
- احفظ evidence لكل شريحة.
- ارجع إلى هذا الملف وسجّل القرار.
- لا تغيّر status الرحلة إلى PASS إلا إذا كل child slice PASS أو PASS_WITH_WARNINGS غير مانعة ومثبتة.

## 7) Journey-Level Evidence Required

| Evidence | Required |
|---|---|
| child slice evidence folder per slice | yes |
| child slice final decision file | yes |
| journey summary | yes |
| git status/diff/typecheck | yes |
| go test when backend touched | yes |
| visual screenshots for every touched UI | yes |
| runtime logs/request/response when runtime touched | yes |
| final `J-003` evidence zip | yes |

## 8) Journey Closure Decision

| Condition | Decision |
|---|---|
| All child slices PASS with evidence | PASS |
| Some non-blocking warning fully documented | PASS_WITH_WARNINGS |
| Any child slice has missing code/logic/test/evidence | FIX_REQUIRED / NEEDS_EVIDENCE |
| Any required runtime/API proof missing | NEEDS_RUNTIME_EVIDENCE |
| Any UI/control-panel proof missing | NEEDS_VISUAL_EVIDENCE |
| Any missing WLT contract needed for money | NEEDS_WLT_CONTRACT |
| External blocker explicit | BLOCKED_WITH_REASON |
| Intentionally moved to named later journey/slice | DEFERRED_WITH_REASON |

## 9) جاهزية الرحلة للانتقال

لا تنتقل إلى الرحلة التالية حتى:
- كل فجوة داخل الرحلة resolved أو blocked/deferred بسبب محدد.
- لا يوجد أي TBD.
- لا يوجد تناقض بين slice file وmanifest/matrix/evidence.
- لا توجد ملفات untracked أو staged غير موثقة.
