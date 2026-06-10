# 02 — Human Slice Template

استخدم هذا القالب إذا ظهرت شريحة جديدة أثناء التنفيذ.


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


## Identity

| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-XXX` |
| Parent Journey | `J-XXX` |
| Business Outcome | [write measurable outcome] |
| Primary Actor | [client/partner/captain/field/operator/WLT/developer] |
| Actor Chain | [ordered actor chain] |
| Operation Chain | [ordered operations] |
| Primary Surface | [surface] |
| Supporting Surfaces | [surfaces] |
| Dependency Surfaces | [surfaces] |
| Excluded Surfaces + Reason | [explicit reasons] |
| Control Panel Owner | [none/operations/finance/platform/catalog] |
| WLT Boundary | [none/read-only/full owner/needs contract] |
| Auth Boundary | [public/client/partner/captain/field/operator] |
| Vars Boundary | [none/platform vars/provider policy] |
| Data Ownership | [domain/api/preview/fixture/WLT] |
| API/Runtime Boundary | [endpoint or none] |


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


## Coverage Matrix

| Surface | Classification | Screen/Endpoint | Required states | Evidence |
|---|---|---|---|---|
| [surface] | primary/supporting/dependency/excluded | [path] | [states] | [proof] |

## CTA Matrix

| CTA | Surface | Target | Precondition | Evidence |
|---|---|---|---|---|
| [CTA] | [surface] | [target] | [precondition] | [proof] |

## Missing Logic / Screen / Process Proposals

| ID | Item | Classification | Required Action | Decision |
|---|---|---|---|---|
| GAP-XXX-01 | [gap] | REQUIRED_ADDITION / BLOCKED_WITH_REASON / DEFERRED_WITH_REASON | [action] | [decision] |

## Final Decision

PASS is forbidden unless all evidence exists.
