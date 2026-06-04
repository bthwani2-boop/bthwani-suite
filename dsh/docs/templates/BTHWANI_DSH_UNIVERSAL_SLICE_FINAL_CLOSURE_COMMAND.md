# أمر موحّد لإغلاق أي شريحة DSH نهائيًا

**اسم الملف:** `BTHWANI_DSH_UNIVERSAL_SLICE_FINAL_CLOSURE_COMMAND.md`
**الغرض:** أمر واحد قابل لإعادة الاستخدام داخل VS Code / Gemini / Copilot Agent لإغلاق أي شريحة DSH من الألف إلى الياء، مع السماح بتحليل وتعديل كل طبقات الشريحة داخل نطاقها: docs، frontend، backend، OpenAPI، runtime، data/media، control-panel، WLT boundary، tests، guards، evidence.

---

## طريقة الاستخدام

استبدل القيم التالية فقط قبل إرسال الأمر للوكيل:

```text
[SLICE_FILE_PATH] = مسار ملف الشريحة المطلوب إغلاقها
[SESSION_ID] = اسم جلسة فريد، مثل:
DSH_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE-20260604-153000
```

ثم انسخ الأمر من القسم التالي كما هو.

---

## الأمر النهائي الموحد

```text
نفّذ إغلاقًا نهائيًا كاملًا للشريحة المحددة فقط داخل الريبو الحالي:
C:\bthwani-suite

الشريحة المستهدفة:
[SLICE_FILE_PATH]

اسم المهمة / SESSION_ID:
[SESSION_ID]

نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاق الشريحة بالأدلة داخل نطاقها، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، صفر تناقض، صفر ضجيج، صفر ضعف في المنطق والتشغيل، صفر تشتت، صفر فشل، وصفر عيوب.

تنبيه مهم:
لا تكتب PASS أو CLOSED أو READY أو 100% إلا إذا كانت الأدلة الفعلية تثبت ذلك. إذا بقي نقص واحد، فالقرار FIX_REQUIRED أو BLOCKED_WITH_REASON أو DEFERRED_WITH_REASON حسب الحالة.

============================================================
1) المبدأ الحاكم
============================================================

هذه ليست مهمة docs فقط.

 must تحليل ومراجعة وتعديل وإضافة وتصحيح كل ما يلزم لإغلاق الشريحة فعليًا من كل الطبقات، بشرط أن يكون داخل نطاق الشريحة أو مرتبطًا بها مباشرة.

الطبقات التي يجب فحصها وتعديلها عند الحاجة:
- dsh/docs/**
- dsh/dsh.openapi.yaml
- dsh/backend/**
- dsh/frontend/**
- dsh/frontend/shared/**
- dsh/frontend/data/**
- dsh/frontend/media-fixtures/**
- dsh/domain/** إن وجد
- tools/guards/** إذا كان guard مرتبطًا بالشريحة
- tools/scripts/** إذا كان script مرتبطًا بالشريحة
- tools/registry/runs/** للأدلة فقط
- control-panel/runtime/app/** فقط إذا كانت الشريحة تلمس route أو surface في لوحة التحكم
- wlt/** فقط إذا كانت الشريحة تحتوي WLT boundary أو finance bridge، مع الحفاظ على WLT ownership وعدم إضافة DSH money mutation

لا تكتفِ بتسجيل النقص إذا كان داخل نطاق الشريحة. إذا كان النقص داخل نطاق الشريحة، عالجه. إذا كان خارجها، صنّفه واربطه بالشريحة الصحيحة.

============================================================
2) القيود الصارمة
============================================================

- لا PR.
- لا merge.
- لا تعديل main.
- لا GitHub write.
- نفّذ على الفرع المحلي الحالي فقط.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- لا تعدّل @bthwani/ui-kit إلا إذا أثبتت أن المشكلة في مالك مركزي مشترك. إذا احتجت تغيير ui-kit، توقف واطلب موافقة بشرية قبل التنفيذ.
- عند أي UI work: Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui داخليًا داخل ui-kit فقط.
- توجب الالتزام بنظام الألوان المركزي عند أي تعديل UI.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الشريحة فقط.
- لا تنسخ بيانات ضخمة بين الأسطح. طبّق on-demand retrieval: IDs، references، lean summaries، detail-on-open، pagination، caching.
- كل DSH experimental/demo/mock/seed/preview data يجب أن يكون مصدره المركزي dsh/frontend/data.
- كل DSH media/image fixtures يجب أن يكون مصدرها المركزي dsh/frontend/media-fixtures.
- لا تضف DSH money mutation. WLT يملك wallet/money/ledger/refund/payout/settlement إلا إذا أثبتت وثائق WLT غير ذلك.
- لا تغيّر شرائح أخرى لإغلاقها عشوائيًا. يمكن تحديثها فقط لتسجيل dependency أو gap أو status مرتبط بما ظهر أثناء تنفيذ الشريحة الحالية.
- لا تعتمد على الذاكرة أو افتراضات سابقة. اقرأ الملفات الحية أولًا.

============================================================
3) قراءة إلزامية قبل التنفيذ
============================================================

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

اقرأ إلزاميًا:
- AGENTS.md
- dsh/docs/README.md
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md
- dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
- dsh/docs/SCREEN_API_MATRIX.md
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md
- dsh/docs/CLOSURE_DECISION_LOG.md
- [SLICE_FILE_PATH]

اقرأ كل ملفات route/screen/backend/API/client/data/media/control-panel المذكورة داخل الشريحة أو المطلوبة لإغلاقها.

اقرأ skills ذات العلاقة:
- .agents/skills/bthwani-current-workspace-authority/SKILL.md
- .agents/skills/bthwani-integrated-system-umbrella-contract/SKILL.md
- .agents/skills/bthwani-screen-flow-binding-contract/SKILL.md
- .agents/skills/bthwani-api-contract-client-boundary/SKILL.md
- .agents/skills/bthwani-data-fixture-simulation-contract/SKILL.md
- .agents/skills/bthwani-on-demand-retrieval-contract/SKILL.md
- .agents/skills/bthwani-finance-ledger-contract/SKILL.md عند وجود WLT/finance/money boundary

إذا أي ملف skill غير موجود، سجّل ذلك في evidence كـ MISSING_REFERENCE ولا تفترض محتواه.

============================================================
4) Reality Scan
============================================================

استخرج من ملف الشريحة:
- Slice ID
- Parent Journey
- business outcome
- actor chain
- primary surface
- supporting surfaces
- dependency surfaces
- excluded surfaces + reason
- route/screen owners
- CTAs
- required states
- API/runtime boundary
- data/media owner
- WLT boundary
- vars/provider boundary
- auth/permission boundary
- visual evidence requirement
- runtime evidence requirement
- current status
- blockers
- exit gate
- next action

تحقق:
- هل status الحالي مدعوم بالأدلة أو مجرد claim؟
- هل evidence path موجود وقابل للمراجعة داخل tools/registry/runs؟
- هل الشريحة تشير إلى مسارات قديمة أو ملفات منقولة؟
- هل الشريحة تقول PASS بينما matrix أخرى تقول PENDING؟
- هل يوجد نقص داخل نطاق الشريحة يجب إصلاحه بدل توثيقه فقط؟
- هل يوجد نقص خارج نطاق الشريحة يجب ربطه بشريحة أخرى؟

ابحث بشكل مستهدف، لا بشكل عشوائي، عن:
- Slice ID
- screen names
- route names
- endpoint names
- operation IDs
- CTA labels
- state labels
- data/media keys
- registry rows
- related guards/scripts

============================================================
5) Cross-Surface Impact Map
============================================================

قبل التعديل، وثّق خريطة تأثير قصيرة داخل evidence:
- الأسطح التي تلمسها الشريحة.
- الأسطح المستبعدة وسبب الاستبعاد.
- الشرائح upstream / downstream / lateral المتأثرة.
- ملفات SSoT ذات العلاقة.
- data/media owner.
- API/runtime owner.
- control-panel owner إذا موجود.
- WLT boundary إذا موجود.
- Auth/Vars/Provider boundary إذا موجود.
- ماذا سيتم تعديله داخل الشريحة.
- ماذا سيتم تسجيله فقط كـ dependency/gap خارج الشريحة.

قاعدة:
إذا ظهر شيء خارج الشريحة، لا تدخله بالقوة داخلها. صنّفه:
- REQUIRED_ADDITION
- FIX_REQUIRED
- BLOCKED_WITH_REASON
- DEFERRED_WITH_REASON
- OUT_OF_SCOPE_WITH_REASON

============================================================
6) Full Implementation Closure
============================================================

أغلق كل نقص داخل نطاق الشريحة.

إذا OpenAPI ناقص أو غير دقيق:
- عدّل dsh/dsh.openapi.yaml.
- تحقق من operationId، parameters، request/response schema، error states، auth/WLT boundary.
- لا تضف endpoint خارج نطاق الشريحة.

إذا backend ناقص:
- عدّل handler/repository/domain/migrations/tests داخل dsh/backend حسب الحاجة.
- أثبت 200/400/404/500 أو الحالات المطلوبة حسب الشريحة.
- لا تضف business semantics خارج الشريحة.

إذا typed client/transport ناقص:
- عدّل client/transport/types داخل dsh/frontend/shared أو app-specific shared.
- امنع direct fetch داخل screens إذا القاعدة تمنعه.
- اجعل errors واضحة: offline/http/parse/domain حسب الحاجة.

إذا frontend flow ناقص:
- عدّل screen/route/CTA/states/runtime-visible behavior.
- أثبت loading/empty/error/offline/success/blocked/disabled حسب ما تطلبه الشريحة.
- راعِ RTL بصرامة: icon+text clustering، text right-align، chevrons/actions في الجهة الصحيحة، لا space-between يفصل الأيقونة عن النص في صف عربي.
- لا تعمل redesign خارج الحاجة.
- استخدم نظام الألوان المركزي.

إذا control-panel جزء من الشريحة:
- أغلق owner/action/audit/rollback/state.
- ميّز LIVE_API_BOUND عن LOCAL_PREVIEW_ONLY.
- لا تجعل أزرار preview تبدو كأنها تكتب في DB.

إذا data/media مشتتة:
- اربطها بالمالك المركزي:
  dsh/frontend/data
  dsh/frontend/media-fixtures
- لا تنشئ نسخ demo محلية متضاربة داخل screens/surfaces.
- استخدم IDs/mediaKey/references بدل نسخ ضخمة.

إذا WLT boundary موجود:
- حافظ على WLT ownership.
- DSH يقرأ أو يعرض bridge فقط ما لم توجد أدلة صريحة بخلاف ذلك.
- لا تضف ledger/refund/payout/settlement mutation داخل DSH.

إذا Auth/Vars/Provider policy مانعة:
- لا تزور PASS.
- سجّل BLOCKED_WITH_REASON بدليل واضح.
- حدّث الشريحة والمانيفست والفهرس.

============================================================
7) Runtime / Evidence
============================================================

أنشئ evidence folder:
tools/registry/runs/[SESSION_ID]/

أربعة ملفات فقط:

**01-context.txt** — معلومات الجلسة + git status قبل + scope map + ملفات مفحوصة + حالة ما قبل التنفيذ.

**02-implementation.txt** — ملخص التنفيذ + أدلة كل طبقة لمستها الشريحة (API/OpenAPI، backend، frontend/screen، runtime request-response، DB/log، states، cross-surface). اكتب "N/A" لأي طبقة لم تُلمس.

**03-verification.txt** — نتائج التحقق: git diff --check، tsc --noEmit، go test عند لمس Go، نتائج guards، visual proof أو مسار screenshots.

**04-final-decision.txt** — القرار النهائي (PASS / FIX_REQUIRED / BLOCKED_WITH_REASON / ...) مع السبب الدقيق والخطوة التالية إن لم يكن PASS.

عند الحاجة لتشغيل runtime محلي، استخدم أوامر التشغيل المعتمدة للمشروع كما هي، ولا تغيّرها أو تعيد اختراعها. إذا لم تكن البيئة المحلية متاحة أو كان جهاز/خادم مطلوب غير شغال، سجّل BLOCKED_WITH_REASON ولا تكتب PASS.

============================================================
8) Docs Truth Sync
============================================================

حدّث كل ملف حقيقة يتأثر بالشريحة:
- [SLICE_FILE_PATH]
- dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md
- dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md إذا تغير UI/flow evidence
- dsh/docs/SCREEN_API_MATRIX.md إذا تغير API/screen readiness
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md إذا تغير runtime proof
- dsh/docs/CLOSURE_DECISION_LOG.md append-only
- dsh/SERVICE_BLUEPRINT.md إذا تغيرت service-level truth
- أي شريحة أخرى متأثرة فقط لتسجيل dependency/gap/status، وليس لإغلاقها عشوائيًا

في ملف الشريحة يجب أن تكون الحقول النهائية واضحة:
- Current Status
- Blocking Reason
- Scope
- Coverage Matrix
- CTA Matrix
- State Matrix
- Cross-Surface Impact
- Evidence and Gates
- Decision
- Dependency
- Next Action

قاعدة التناسق:
لا يجوز أن يقول ملف PASS وملف آخر PENDING لنفس الإثبات. إذا حدث ذلك، أصلح التناقض أو اجعل القرار FIX_REQUIRED.

============================================================
9) Verification
============================================================

شغّل وسجّل النتائج داخل evidence folder:
- git status --short
- git diff --check
- pnpm exec tsc --noEmit

إذا لمس التنفيذ backend Go:
- cd dsh/backend
- go test ./...

إذا توجد guards مرتبطة بالشريحة:
- شغّلها وسجّل نتائجها.

إذا ظهرت أخطاء:
- أصلحها إن كانت داخل نطاق الشريحة.
- إذا كانت خارج النطاق، صنّفها بوضوح ولا تدّعي PASS.

============================================================
10) Evidence ZIP
============================================================

أنشئ ZIP داخل نفس evidence folder باسم:
[SESSION_ID].zip

مثال:
tools/registry/runs/[SESSION_ID]/[SESSION_ID].zip

لا تستخدم _HANDOFF.zip.

============================================================
11) Final Decision
============================================================

اكتب القرار النهائي بدقة:
- PASS إذا أُغلقت الشريحة بالكامل بالأدلة.
- PASS_WITH_WARNINGS إذا أُغلقت الشريحة لكن بقيت تحذيرات غير مانعة وموثقة.
- FIX_REQUIRED إذا بقي نقص داخل نطاق الشريحة.
- BLOCKED_WITH_REASON إذا يوجد مانع خارجي حقيقي مثل WLT/auth/provider/runtime unavailable.
- DEFERRED_WITH_REASON إذا النطاق مؤجل بقرار واضح.
- NEEDS_VISUAL_EVIDENCE إذا بقي visual proof ناقصًا.
- NEEDS_RUNTIME_EVIDENCE إذا بقي runtime proof ناقصًا.

لا تكتب CLOSED أو 100% إذا لم تكن الأدلة كاملة.

============================================================
12) المخرجات النهائية المطلوبة
============================================================

أعد تقريرًا مختصرًا يحتوي:
- Slice ID.
- Parent Journey.
- الملفات المعدلة فقط.
- قبل/بعد الحالة.
- ما تم تحليله ومراجعته.
- ما تم تعديله في:
  docs
  backend
  OpenAPI
  frontend
  runtime
  data/media
  control-panel
  WLT boundary
  guards/scripts
- ما تم تحديثه في الشرائح الأخرى إن وجد، ولماذا.
- evidence folder.
- evidence zip.
- نتائج:
  git status --short
  git diff --check
  pnpm exec tsc --noEmit
  go test ./... عند اللزوم
  guards عند اللزوم
- GAP/BLOCKED/DEFERRED rows إن وجدت.
- القرار النهائي.

إذا كان القرار ليس PASS، اكتب السبب المحدد والخطوة التالية فقط.
```
