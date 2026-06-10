<!--
BThwani DSH/WLT Human Sequential Closure — Journey-style organization
New canonical human-review folder: dsh/docs/journies-014-final-e2e-regression-readiness/
Source package reorganization: V3.1, generated 2026-06-08
Note: folder name intentionally follows user-requested spelling: journies-###-slug.
-->

# J-014 — Final End-to-End Regression and Release Readiness Gate

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
| Journey ID | `J-014` |
| Name | Final End-to-End Regression and Release Readiness Gate |
| Type | `foundation` |
| Primary Actors | developer, reviewer, operator |
| Control Panel / Domain Owner | quality/evidence |
| WLT Boundary | all WLT-owned evidence must be proven separately |
| Planning Status | `FINAL_GATE_ONLY_AFTER_ALL_PRIOR_JOURNEYS` |
| Business Outcome | The whole DSH/WLT multi-surface system is smoke-tested on local runtime, real device, and control-panel localhost before any PR/release claim. |

## 2) لماذا هذه الرحلة موجودة؟

هذه الرحلة تمنع إغلاقًا وهميًا لشاشة واحدة. المطلوب إثبات الدائرة كاملة عبر الأسطح المرتبطة: التطبيق، لوحة التحكم، الباكند، OpenAPI، binding، runtime، WLT عند المال، وملفات evidence.

## 3) ترتيب الشرائح داخل الرحلة

| Slice ID | Slice | Actor | Surface / Area | Outcome | File | Status |
|---|---|---|---|---|---|---|
| `DSH-SLICE-014A` | Full Client Order Happy Path | client/partner/captain/operator/WLT | all primary surfaces | client order appears and moves through all surfaces | `slices/j-014-final-end-to-end-regression-and-release-readiness-gate/DSH-SLICE-014A-full-client-order-happy-path.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-014B` | Failure and Recovery Regression | all actors | all primary surfaces | payment/order/delivery/support failures recover safely | `slices/j-014-final-end-to-end-regression-and-release-readiness-gate/DSH-SLICE-014B-failure-and-recovery-regression.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-014C` | Visual RTL and Design System Regression | all surfaces | mobile + control-panel | RTL/spacing/ui-kit/color system verified | `slices/j-014-final-end-to-end-regression-and-release-readiness-gate/DSH-SLICE-014C-visual-rtl-and-design-system-regression.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-014D` | Performance Smoke and Heavy File Regression | developer | runtime + code | startup/navigation/API latency acceptable | `slices/j-014-final-end-to-end-regression-and-release-readiness-gate/DSH-SLICE-014D-performance-smoke-and-heavy-file-regression.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-014E` | Evidence ZIP and PR Readiness Decision | reviewer | tools/registry/runs + git | final evidence package supports or blocks PR | `slices/j-014-final-end-to-end-regression-and-release-readiness-gate/DSH-SLICE-014E-evidence-zip-and-pr-readiness-decision.md` | NOT_CLOSED_BY_THIS_FILE |

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
| final `J-014` evidence zip | yes |

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
