<!--
BThwani DSH/WLT Human Sequential Closure — Journey-style organization
New canonical human-review folder: dsh/docs/journies-006-partner-onboarding-field-readiness/
Source package reorganization: V3.1, generated 2026-06-08
Note: folder name intentionally follows user-requested spelling: journies-###-slug.
-->

# J-006 — Partner Onboarding and Field Readiness

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
| Journey ID | `J-006` |
| Name | Partner Onboarding and Field Readiness |
| Type | `business` |
| Primary Actors | partner, field, operator |
| Control Panel / Domain Owner | operations |
| WLT Boundary | none |
| Planning Status | `REOPENED_BLOCKED_BY_AUTH_AND_LIVE_DB_PROOF` |
| Business Outcome | A partner joins, field verifies, documents are captured, control-panel approves, partner becomes ready, and first catalog publish can start. |

## 2) لماذا هذه الرحلة موجودة؟

هذه الرحلة تمنع إغلاقًا وهميًا لشاشة واحدة. المطلوب إثبات الدائرة كاملة عبر الأسطح المرتبطة: التطبيق، لوحة التحكم، الباكند، OpenAPI، binding، runtime، WLT عند المال، وملفات evidence.

## 3) ترتيب الشرائح داخل الرحلة

| Slice ID | Slice | Actor | Surface / Area | Outcome | File | Status |
|---|---|---|---|---|---|---|
| `DSH-SLICE-006A` | Partner Join Request and Lead Intake | partner | app-partner/web/control-panel | partner submits join/onboarding request | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006A-partner-join-request-and-lead-intake.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-006B` | Control Panel Lead Triage and Field Assignment | operator | control-panel + app-field | operator reviews lead and assigns field visit | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006B-control-panel-lead-triage-and-field-assignment.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-006C` | Field Visit Execution and Notes | field | app-field + backend | field submits visit summary/follow-up/location | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006C-field-visit-execution-and-notes.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-006D` | Document Capture and Media Reference | field/partner | app-field + central media/data | documents use mediaKey references and central media owner | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006D-document-capture-and-media-reference.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-006E` | Control Panel Approval Rejection Escalation | operator | control-panel + backend | approve/reject/escalate readiness with audit | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006E-control-panel-approval-rejection-escalation.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-006F` | Partner Activation and First Catalog Readiness | partner/operator | app-partner + control-panel | partner moves from onboarding to catalog-ready | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006F-partner-activation-and-first-catalog-readiness.md` | NOT_CLOSED_BY_THIS_FILE |
| `DSH-SLICE-006G` | End-to-End Onboarding Closure Proof | partner/field/operator | app-field + app-partner + control-panel | full circle proof from request to activation | `slices/j-006-partner-onboarding-and-field-readiness/DSH-SLICE-006G-end-to-end-onboarding-closure-proof.md` | NOT_CLOSED_BY_THIS_FILE |

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
| final `J-006` evidence zip | yes |

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
