<!--
Canonical human-review path: dsh/docs/journies-000-foundation-remote-local-evidence-gate/000e-evidence-folder-and-zip-protocol.slice5.md
Original generated path: dsh/docs/slices/human-sequential-closure-v3/slices/J-000-foundation-remote-local-evidence-gate/DSH-SLICE-000E-evidence-folder-and-zip-protocol.md
Package: BTHWANI_DSH_WLT_JOURNIES_STYLE_ZERO_GAP_CLOSURE_SLICES_V3_1_20260608
Organization rule: one journey folder contains its overview, journey inventory, slice files, and closure checklist.
-->

# File Organization Contract

- Journey folder: `dsh/docs/journies-000-foundation-remote-local-evidence-gate/`
- Slice file: `dsh/docs/journies-000-foundation-remote-local-evidence-gate/000e-evidence-folder-and-zip-protocol.slice5.md`
- Slice order inside journey: `5` of `5`
- Closure style: human-readable, execution-ready, multi-surface, evidence-first.
- Zero-gap rule: do not mark this slice PASS until the slice file, `01-journey-inventory.md`, and the generated evidence all agree.

# DSH-SLICE-000E — Evidence Folder and ZIP Protocol

> ملف شريحة بشري تفصيلي قابل للتنفيذ اليدوي. لا يعتبر هذا الملف دليل إغلاق؛ الدليل يجب أن ينتج من الكود الحي وruntime وGit وscreenshots.


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


## 1) Identity

| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-000E` |
| Parent Journey | `J-000 — Foundation Remote / Local / Evidence Gate` |
| Journey Type | `foundation` |
| Business Outcome | standardize evidence folder and final zip naming |
| Primary Actor | `developer` |
| Primary Surface / Area | `tools/registry/runs` |
| Control Panel Owner | `governance + runtime` |
| WLT Boundary | `none unless finance proof is inspected` |
| Current Planning Status | `PASS` |
| Closure Rule | لا يغلق إلا بأدلة repo/runtime/Git/visual مطابقة |

## 2) السيناريو البشري المتسلسل

1. يبدأ الممثل الأساسي `developer` من السطح `tools/registry/runs`.
2. الهدف العملي: standardize evidence folder and final zip naming.
3. يجب أن تظهر الحالة الابتدائية بوضوح: loading/empty/error/offline/disabled عند الحاجة.
4. ينفذ المستخدم CTA الأساسي فقط بعد تحقق preconditions.
5. ينتقل الأثر إلى الأسطح الداعمة أو لوحة التحكم إن وجدت.
6. يتم تسجيل أي side effect في audit/logs/evidence.
7. إذا لمس التدفق المال، يجب أن يكون التنفيذ عبر WLT فقط.
8. تنتهي الشريحة عندما يمكن لمراجع بشري إعادة تشغيل السيناريو ومطابقة النتائج عبر كل سطح.

## 3) ملفات يجب فحصها قبل التنفيذ

- `dsh/SERVICE_BLUEPRINT.md`
- `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md`
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/DSH_VISUAL_REVIEW.md`

> القاعدة: القائمة أعلاه starting point. إذا كشف git grep أو registry أن الملف انتقل، سجّل `STALE_PATH` ولا تفترض.


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


## 4) Coverage Matrix

| Surface / Area | Classification | What must be proven | Evidence |
|---|---|---|---|
| `tools/registry/runs` | primary | ينفذ الهدف الأساسي للشريحة | screenshot/log/test |
| shared contracts/adapters | dependency | لا يوجد logic مكرر داخل screens | git diff + tsc |
| DSH backend/OpenAPI | dependency when API/runtime exists | contract/handler/test aligned | request/response + go test |
| control-panel | supporting when operator side effect exists | action/permission/audit/rollback | screenshot + log |
| WLT | dependency when money exists | WLT-only financial ownership | WLT evidence + no DSH mutation |
| data/media | dependency when preview/media exists | central source only | import scan + usage proof |

## 5) CTA Matrix

| CTA | Surface | Target | Precondition | Proof |
|---|---|---|---|---|
| Primary CTA | surface primary screen | business target | preconditions satisfied | must prove enabled/disabled |
| Retry / Recover | same surface | same operation retried safely | previous error/offline | must prove no duplicate side effect |
| Back / Cancel / Escalate | same or control-panel | safe exit or escalation | state allows it | must prove audit when side effect exists |

## 6) State Matrix

| State | Required | Meaning | Proof |
|---|---|---|---|
| loading | yes | initial API/runtime wait | screenshot/log |
| empty | when applicable | no data or no eligible item | screenshot |
| error | yes | API/domain/parse failure | screenshot/log |
| offline | mobile surfaces yes | network unavailable | screenshot/log |
| disabled | when CTA precondition missing | CTA cannot run | screenshot |
| blocked | when auth/permission/WLT missing | specific blocker text | screenshot/log |
| success | yes | business outcome completed | screenshot/log |

## 7) ما يجب إضافته أو إصلاحه عند اكتشافه

- أضف أي شاشة ناقصة لازمة لإغلاق السيناريو داخل مالكها الصحيح.
- أضف state ناقص فقط إذا كان داخل نطاق الشريحة ويؤثر على تجربة المستخدم أو التشغيل.
- أضف endpoint أو schema فقط إذا كان السيناريو لا يغلق بدونه وبعد إثبات عدم وجود بديل قائم.
- أضف typed client/transport بدل direct fetch داخل screen عند وجود boundary مشترك.
- أضف audit/permission/rollback في لوحة التحكم عند وجود operator side effect.
- أضف tests للحالات 200/201/400/401/403/404/409/500 حسب الشريحة.

## 8) ما يجب حذفه/تنظيفه/توحيده عند ثبوته

- احذف أو retired أي كود ميت مثبت بعد import/usage scan.
- احذف التكرار فقط إذا ثبت أنه demo/local copy أو dead branch ولا يملك consumer حي.
- لا تحذف ملفات runtime/contract/shared قبل git grep وtypecheck.
- لا تنقل shared UI إلى ui-kit بدون موافقة بشرية إذا كان يتطلب ملف ui-kit جديد.
- لا تنشئ design system محلي داخل surface/screen/app.

## 9) On-Demand Retrieval Contract

- لا تحمل full objects إلى كل سطح.
- استعمل list summaries ثم detail-on-open.
- الصور والوسائط عبر `mediaKey` أو reference فقط.
- الطلبات الطويلة يجب أن تدعم pagination/filters.
- لا تضف polling ثابت عالي التكرار؛ استخدم backoff/event/WebSocket حسب ما يثبته النطاق.
- لا تنسخ نفس data في app-client/app-partner/control-panel.

## 10) UI/UX + RTL Contract

- النص العربي يمين، والأيقونة مع النص في cluster واحد.
- لا تستخدم `space-between` يفصل الأيقونة عن النص العربي في row واحد.
- action/chevron في الطرف المقابل الصحيح.
- كل CTA له disabled/blocked/error state واضح.
- استخدم central color system ولا تضف ألوان عشوائية.
- أي reusable component يجب أن يأتي من `@bthwani/ui-kit` public exports، ولا تفتح ui-kit file جديد بدون موافقة بشرية إذا كان جديدًا.

## 11) Runtime / API / Backend Contract

- إذا وجدت API: حدّد operationId/request/response/errors/auth.
- إذا وجدت Go handler: غطّ الحالات المناسبة 200/201/400/401/403/404/409/500 حسب العملية.
- إذا وجدت DB query: افحص indexes وN+1.
- إذا وجدت callback أو retry: أضف idempotency أو أثبت وجوده.
- إذا runtime مطلوب ولم يثبت: القرار `NEEDS_RUNTIME_EVIDENCE`.

## 12) WLT / Finance Boundary

- التصنيف الحالي: `none unless finance proof is inspected`.
- ممنوع تنفيذ wallet/ledger/refund/payout/settlement داخل DSH.
- إذا الشريحة تحتاج contract مالي غير موجود: القرار `NEEDS_WLT_CONTRACT`.
- شاشة DSH/control-panel التي تعرض مالًا يجب أن تكون read-only من WLT أو عبر bridge موثق.

## 13) Manual Execution Checklist

- [ ] قرأت ملفات agents/skills/governance ذات العلاقة.
- [ ] قرأت ملف الشريحة والرحلة والmanifest والمصفوفات المرتبطة.
- [ ] نفذت git snapshot قبل التعديل.
- [ ] حصرت الملفات التي ستتأثر.
- [ ] أصلحت الناقص داخل scope.
- [ ] نظفت التكرار/الميت/التشظي المثبت داخل scope.
- [ ] شغلت typecheck/test المناسب.
- [ ] أخذت runtime logs/request/response إن لزم.
- [ ] أخذت screenshots للـ UI/control-panel إن لزم.
- [ ] حدثت truth docs بدون تناقض.
- [ ] أنشأت evidence zip باسم SESSION_ID.zip.


## بروتوكول التنفيذ اليدوي

1. اقرأ ملف الرحلة أولًا ثم ملف الشريحة.
2. انسخ أمر التنفيذ من قسم "أمر الوكيل المحلي" إلى VS Code/Copilot/Gemini فقط لهذه الشريحة.
3. اطلب من الوكيل: inspect first، ثم يحدد الملفات التي سيلمسها قبل أي تعديل.
4. نفّذ CHECK محليًا قبل التعديل:
   ```powershell
   Set-Location -LiteralPath "C:\bthwani-suite"
   git branch --show-current
   git --no-pager status --short
   git --no-pager diff --check
   git ls-files --others --exclude-standard
   ```
5. عند وجود تعديل كود، شغّل التحقق المناسب:
   ```powershell
   Set-Location -LiteralPath "C:\bthwani-suite"
   pnpm -w exec tsc --noEmit
   ```
   وإذا لمست Go backend:
   ```powershell
   Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
   go test ./...
   ```
6. عند UI أو رحلة تشغيلية: خذ screenshot/record من الجهاز الحقيقي عبر ADB/Scrcpy ومن localhost للوحة التحكم.
7. صدّر evidence في:
   `tools/registry/runs/{{SESSION_ID}}/`
   ثم اضغطه باسم:
   `{{SESSION_ID}}.zip`
8. لا تعتمد على كلام الوكيل. القرار يعتمد على الملفات والمخرجات فقط.


## 14) Evidence Required

| Evidence | Required? | File / Location |
|---|---|---|
| Git status before/after | yes | `tools/registry/runs/{SESSION_ID}/01-context.txt` |
| Git diff check | yes | `tools/registry/runs/{SESSION_ID}/03-verification.txt` |
| TypeScript | yes for TS changes | `pnpm -w exec tsc --noEmit` output |
| Go tests | when backend touched | `go test ./...` output |
| Runtime request/response | when API/runtime touched | logs/request/response files |
| Visual screenshots | when UI/control-panel touched | screenshots folder |
| Final ZIP | yes | `tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip` |

## 15) Gap Log During Execution

| Gap ID | Finding | Classification | Owner | Required Action | Decision |
|---|---|---|---|---|---|
| GAP-000E-01 | [fill during execution] | REQUIRED_ADDITION / BLOCKED_WITH_REASON / DEFERRED_WITH_REASON | [owner] | [action] | [decision] |

## 16) Closure Decision

| Field | Value |
|---|---|
| Slice Decision | PASS |
| Allowed final decisions | PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED_WITH_REASON / DEFERRED_WITH_REASON / NEEDS_VISUAL_EVIDENCE / NEEDS_RUNTIME_EVIDENCE / NEEDS_WLT_CONTRACT / NEEDS_EVIDENCE / REVERT_REQUIRED |
| PASS allowed? | فقط بعد evidence كامل |
| Next Slice Allowed? | فقط بعد PASS أو blocker/defer موثق بدون TBD |

## 17) أمر الوكيل المحلي الجاهز للنسخ

```text
نفّذ هذا الطلب داخل الريبو الحالي فقط: C:\bthwani-suite.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المطلوب: إغلاق الشريحة التالية فقط، بدون الانتقال لأي شريحة أخرى:

- Work item type: SLICE
- Domain: DSH_WLT إذا ظهر أي مال/WLT، وإلا DSH
- Parent Journey: J-000 — Foundation Remote / Local / Evidence Gate
- Slice: DSH-SLICE-000E — Evidence Folder and ZIP Protocol
- Primary actor: developer
- Primary surface/area: tools/registry/runs
- Business outcome: standardize evidence folder and final zip naming
- SESSION_ID: DSH-SLICE-000E_FINAL_CLOSURE-YYYYMMDD-HHMMSS

طبّق الملف الحاكم:
dsh/docs/templates/BTHWANI_UNIVERSAL_WORK_ITEM_FINAL_CLOSURE_COMMAND.md

التزم بالمظلة والمنظومة المتكاملة وخيار الاستدعاء/on-demand retrieval.
توجب الالتزام بنظام الألوان المركزي.
تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الشريحة فقط.
احفظ WLT كمالك وحيد لأي wallet/ledger/refund/payout/settlement/money mutation.

نفّذ CHECK → VERIFY → FORENSICS → APPLY → VERIFY.
قبل التعديل: اذكر الملفات التي ستفحصها وتلمسها ولماذا.
أثناء التنفيذ: أضف الناقص، عالج الخطأ، صحح المنطق، نظف التكرار/الميت/التشظي داخل نطاق الشريحة.
بعد التنفيذ: لا تكتب PASS أو CLOSED أو 100% إلا إذا توفرت الأدلة العملية.

الأدلة المطلوبة:
- git status --short
- git diff --check
- pnpm -w exec tsc --noEmit
- go test ./... إذا تم لمس dsh/backend
- runtime request/response/logs إذا كانت الشريحة API/runtime
- screenshots من الجهاز الحقيقي/localhost إذا كانت UI/control-panel
- evidence folder: tools/registry/runs/DSH-SLICE-000E_FINAL_CLOSURE-YYYYMMDD-HHMMSS/
- evidence zip: tools/registry/runs/DSH-SLICE-000E_FINAL_CLOSURE-YYYYMMDD-HHMMSS/DSH-SLICE-000E_FINAL_CLOSURE-YYYYMMDD-HHMMSS.zip

اكتب القرار النهائي فقط من:
PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED_WITH_REASON / DEFERRED_WITH_REASON / NEEDS_VISUAL_EVIDENCE / NEEDS_RUNTIME_EVIDENCE / NEEDS_WLT_CONTRACT / NEEDS_EVIDENCE / REVERT_REQUIRED

```


---

## Pre-Execution Live Census

**Generated by package:** `BTHWANI_DSH_WLT_JOURNIES_EVIDENCE_GATED_TREE_V5_20260610`
**Target branch:** `fix/docker-local-runtime-standardization`
**Purpose:** prevent false closure before executing this slice.

### Required live census before APPLY

Do not execute this slice until the local census has classified the following:

| Area | Required classification |
|---|---|
| Candidate files | every related source file identified from live repo, not only docs |
| Duplicate risk | `DUPLICATE_CONFIRMED`, `DUPLICATE_CANDIDATE`, or `KEEP_WITH_REASON` |
| Conflict risk | `CONFLICT_CONFIRMED`, `CONFLICT_CANDIDATE`, or `KEEP_WITH_REASON` |
| Missing additions | `REQUIRED_ADDITION`, `BLOCKED_WITH_REASON`, or `DEFERRED_WITH_REASON` |
| Large/heavy files | `LARGE_FILE_SPLIT_REQUIRED`, `PERFORMANCE_RISK`, or `KEEP_WITH_REASON` |
| API/runtime/binding | endpoint/client/handler/repository/model/openapi path mapped or blocked |
| UI/UX/RTL/design | central color system + `@bthwani/ui-kit` ownership checked |
| Platform/Vars | control-panel platform dependency classified when relevant |
| WLT finance | `WLT_OWNER`, `DSH_READ_ONLY`, `DSH_EVENT_TO_WLT`, or `FINANCE_BOUNDARY_VIOLATION` |
| Evidence gate | Git/typecheck/test/runtime/screenshot evidence named before closure |

### Required commands before slice implementation

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
.\tools\scripts\Invoke-DshWltJourneysEvidenceGatedTreeCensus.ps1 -Apply
.\tools\scripts\Test-DshWltJourneysEvidenceGatedTreeCensus.ps1
```

### Closure prohibition

This slice may not be marked `PASS`, `CLOSED`, `READY`, `100%`, or store-ready if any item remains `UNCOVERED`, `PARTIAL`, `CONFLICT`, `STALE_REFERENCE`, `REQUIRED_ADDITION`, `NEEDS_RUNTIME_EVIDENCE`, `NEEDS_VISUAL_EVIDENCE`, or `NEEDS_GIT_EVIDENCE` without a documented blocker and target slice.
