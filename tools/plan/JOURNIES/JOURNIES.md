اعمل داخل الريبو الحالي فقط:
C:\bthwani-suite

الفرع المعتمد والأحدث:
fix/docker-local-runtime-standardization

المهمة:
نفّذ منظومة واحدة متكاملة تجمع بين:
1) مرحلة جرد ومطابقة وتقسيم عبر Agent Team إن كان متاحًا.
2) مرحلة تشطيب وإغلاق نهائي حقيقي ومتدرج لكل شرائح DSH وما يرتبط بها في WLT.
3) منع أي إغلاق صوري أو UI Preview أو اعتماد على fixtures.
4) إثبات الجاهزية العملية محليًا عبر Docker/API/Database/MinIO/WLT/Control Panel/Mobile apps فقط.

اسم المنهج الحاكم:
Evidence-Gated Closed-Loop Tree Execution Model
المنظومة الشجرية الحلقية المغلقة بالدليل.

المبدأ الأعلى:
لا تعتبر أي شيء جاهزًا أو مغلقًا بمجرد وجود خطة أو شريحة أو شاشة تعمل بصريًا. الإغلاق الحقيقي يعني أن الشريحة تعمل على runtime حي مثبت بالأدلة: Git + typecheck/test عند الحاجة + Docker/runtime/API logs + WLT boundary + MinIO media upload + Control Panel + screenshots عند الحاجة.

────────────────────────────────
0) الهدف النهائي المطلوب بعد آخر شريحة
────────────────────────────────

بعد إغلاق آخر شريحة بالأدلة، يجب أن يكون ممكنًا عمليًا:

- تشغيل Docker local stack.
- تشغيل DSH API.
- تشغيل Auth.
- تشغيل WLT API.
- تشغيل PostgreSQL.
- تشغيل MinIO.
- إنشاء/قراءة المتاجر والمنتجات من Backend/API/DB.
- رفع صور منتجات/متاجر/إثباتات عبر media API إلى MinIO.
- إنشاء طلب حقيقي من تطبيق العميل.
- تنفيذ serviceability/cart/checkout/order creation.
- عبور أي منطق مالي عبر WLT فقط.
- انتقال الطلب إلى الشريك.
- انتقال الطلب إلى الكابتن/التوصيل.
- ظهور الطلب والعمليات في لوحة التحكم.
- تشغيل happy path وfailure path.
- تشغيل الدعم/الإلغاء/الاسترجاع/المرتجع حسب الشرائح.
- التقاط screenshots وأدلة runtime لكل سطح عند الحاجة.
- إثبات أن كل شيء يعمل من runtime حقيقي وليس من fixtures أو UI preview.

لا تكتب أن هذا تحقق إلا بعد final evidence.

────────────────────────────────
1) القواعد غير القابلة للكسر
────────────────────────────────

ممنوع:
- لا push.
- لا commit.
- لا merge.
- لا PR.
- لا force.
- لا تغيير lockfiles أو dependencies إلا إذا كان blocker مثبت ويتطلب موافقة بشرية صريحة.
- لا حذف عشوائي.
- لا حذف dsh/frontend/data الآن.
- لا حذف dsh/frontend/media-fixtures الآن.
- لا rename واسع بدون evidence وخطة rollback.
- لا نقل مجلدات واسع بدون evidence وخطة rollback.
- لا تعديل GitHub عن بعد.
- لا تستخدم --dangerously-skip-permissions.
- لا تعتبر أي شريحة CLOSED / READY / PASS / 100%.
- لا تنتقل من شريحة إلى التالية إذا بقي blocker أو runtime violation أو missing evidence.
- لا تعتبر نجاح UI بصري كافيًا.
- لا تعتبر شاشة تعمل من fixtures مغلقة.
- لا تعتبر flow لا يمر عبر API/DB/Docker runtime مغلقًا.
- لا تنقل money mutation إلى DSH.
- لا تعدل ui-kit مباشرة إلا إذا ثبت أن المشكلة مركزية وغير قابلة للحل بالاستهلاك الصحيح، وعندها توقف واكتب BLOCKED_WITH_REASON واطلب موافقة بشرية.

القرارات المسموحة فقط:
- DONE
- FIX_REQUIRED
- BLOCKED
- NEEDS_EVIDENCE
- NEEDS_VISUAL_EVIDENCE

لا تستخدم:
PASS
READY
CLOSED
100%

────────────────────────────────
2) قاعدة حاسمة: لم نعد في وضع UI Preview
────────────────────────────────

يجب عزل المسارين التاليين فورًا كـ DEV_ONLY / PREVIEW_ONLY فقط:

C:\bthwani-suite\dsh\frontend\data
C:\bthwani-suite\dsh\frontend\media-fixtures

dsh/frontend/data:
- DEV_ONLY_PREVIEW_DATA فقط.
- ليس runtime truth.
- ليس API source.
- ليس backend data.
- ليس binding source.
- لا يستخدم لإغلاق أي شريحة.
- أي runtime import منه داخل app-client/app-partner/app-captain/app-field/control-panel يعتبر blocker.

dsh/frontend/media-fixtures:
- DEV_ONLY_MEDIA_FIXTURES فقط.
- ليس runtime media storage.
- لا يستخدم كصور runtime.
- لا ينسخ إلى Docker image.
- لا يعمل bind mount له كحل runtime.
- لا تخدم /media-fixtures داخل Docker.
- أي شاشة runtime تستخدمه كصورة منتج/متجر/طلب/إثبات/تفتيش تعتبر blocker.

المسار الحي الصحيح للبيانات:
Backend/API/PostgreSQL.

المسار الحي الصحيح للصور والملفات:
MinIO/S3-compatible object storage
+
dsh_media_assets
+
media runtime API.

مسار الصور الفعلي:
- POST /media/upload-intents
- PUT file bytes to MinIO
- POST /media/{media_id}/complete
- GET /media
- GET /media/{media_id}
- DELETE /media/{media_id}

Docker media runtime:
- Docker يجب أن يستخدم MinIO/S3 للصور والملفات.
- bucket المحلي: bthwani-media-local.
- metadata داخل PostgreSQL table: dsh_media_assets.
- WLT لا يملك media storage ولا يستدعي media endpoints، بل يخزن media_id references فقط عند الحاجة.

سياسة العزل والحذف:
- المرحلة الحالية: عزل صارم.
- لا تحذف dsh/frontend/data أو dsh/frontend/media-fixtures الآن.
- يسمح بحذفهما أو retire لاحقًا فقط بعد إثبات:
  - صفر runtime imports منهما.
  - نجاح media-fixtures runtime guard.
  - نجاح typecheck.
  - نجاح runtime smoke.
  - نجاح Docker runtime.
  - نجاح upload intent/complete إلى MinIO.
  - عدم وجود أي شاشة أو flow أو لوحة تحكم أو Docker path يعتمد عليهما.
- أي حذف قبل ذلك ممنوع.

────────────────────────────────
3) مصادر إلزامية يجب قراءتها قبل أي تنفيذ
────────────────────────────────

اقرأ هذه المصادر أولًا ولا تعتمد على الذاكرة:

- dsh/docs/JOURNIES
- dsh/docs/JOURNIES/JOURNIES_METHOD_EVIDENCE_GATED_CLOSED_LOOP_TREE.md
- dsh/docs/JOURNIES/JOURNIES_ZERO_GAP_EXECUTION_ORDER.md
- dsh/docs/JOURNIES/JOURNIES_PRE_STORE_READINESS_GATE.md
- dsh/docs/JOURNIES/JOURNIES_PLATFORM_CONTROL_PANEL_ROLE_MAP.md
- dsh/docs/JOURNIES/JOURNIES_DESIGN_SURFACE_LENS_AND_UIKIT_GATE.md
- DSH_SLICE_COVERAGE_MANIFEST.md أينما وجد في الفرع الحالي
- dsh/frontend/data/DEV_ONLY_BOUNDARY.md
- dsh/frontend/media-fixtures/README.md
- tools/guards/media-fixtures-runtime-guard.mjs
- dsh/frontend/shared/dev-fixtures-isolation-guard.ts
- dsh/backend/internal/http/media_runtime_handler.go
- dsh/backend/docker-compose.local.yml
- dsh/backend/Dockerfile.dsh-api
- docker-compose.local.yml
- dsh/backend
- dsh/frontend
- wlt
- ui-kit
- control-panel/runtime
- auth.openapi.yaml

إذا تعذر الوصول لأي مصدر إلزامن، لا تفترض محتواه. صنّفه:
BLOCKED_WITH_REASON
أو
NEEDS_EVIDENCE

────────────────────────────────
4) Phase 0 — Preflight Census / Evidence Gate
────────────────────────────────

ابدأ بمرحلة فحص فقط. لا تنفذ أي تعديل واسع قبلها.

في Phase 0 تحقق من:

- branch الحالي.
- git status.
- وجود dsh/docs/JOURNIES.
- وجود مجلدات journies-*.
- كل مجلد journies-* يحتوي:
  - 00-journey-overview.md
  - 01-journey-inventory.md
  - 99-journey-closure-checklist.md
  - ملف slice واحد على الأقل.
- كل ملف *.slice*.md يحتوي:
  Pre-Execution Live Census
- كل 01-journey-inventory.md يحتوي:
  Live Project Census Binding
- ملفات الجرد الرئيسية موجودة:
  - JOURNIES_ZERO_GAP_LIVE_PROJECT_INVENTORY.md
  - JOURNIES_ZERO_GAP_SLICE_COVERAGE_RECONCILIATION.md
  - JOURNIES_ZERO_GAP_DUPLICATION_CONFLICT_DEAD_CODE_REGISTER.md
  - JOURNIES_ZERO_GAP_LARGE_FILE_AND_PERFORMANCE_REGISTER.md
  - JOURNIES_ZERO_GAP_MISSING_REQUIRED_ADDITIONS_REGISTER.md
  - JOURNIES_ZERO_GAP_EXECUTION_ORDER.md
  - JOURNIES_ZERO_GAP_FINAL_AUDIT_DECISION.md
- وجود Docker/MinIO/media runtime files.
- وجود guard الخاص بعزل media-fixtures/preview-data.
- وجود DSH/WLT/Auth/OpenAPI/runtime files المطلوبة.

شغّل أو افحص:
- tools/guards/media-fixtures-runtime-guard.mjs
- أي guard أو script موجود متعلق بـ preview/data/media/runtime boundary.
- git --no-pager status --short
- git --no-pager diff --name-status
- git --no-pager diff --check

أنشئ evidence session تحت:
tools/registry/runs/DSH_WLT_FINAL_CLOSURE_PHASE0-YYYYMMDD-HHMMSS

ويجب أن يحتوي على الأقل:
- 01-git-branch.txt
- 02-git-status-before.txt
- 03-journeys-structure-check.md
- 04-required-files-check.md
- 05-preview-data-media-boundary-check.md
- 06-guard-output.txt
- 07-git-diff-name-status.txt
- 08-git-diff-check.txt
- 09-phase0-decision.md
- DSH_WLT_FINAL_CLOSURE_PHASE0-YYYYMMDD-HHMMSS.zip

اسم zip يجب أن يطابق SESSION_ID نفسه.

إذا فشلت Phase 0:
توقف واكتب:
BLOCKED
مع السبب ومسار evidence zip.

────────────────────────────────
5) Phase 1 — Agent Team Census & Parallel Mapping
────────────────────────────────

بعد Phase 0 فقط، شغّل Agent Team إذا كانت الميزة متاحة.

إذا كانت Agent Team / Teammates غير متاحة في هذه الجلسة، لا تنفذ المهمة بشكل عشوائي أو واسع.
توقف واكتب:
BLOCKED_WITH_REASON: Agent Team / Teammates unavailable in this Claude Code session.

إذا كانت متاحة:
أنشئ Agent Team من 5 teammates فقط.
التوازي مسموح للجرد والتحليل فقط.
التنفيذ الفعلي APPLY يكون لاحقًا بشكل متسلسل شريحة بشريحة، وليس بالتوازي.

قواعد عامة لكل teammate:
- يبدأ بخطة قصيرة داخل نطاقه.
- لا يعدل الكود الحي.
- لا ينشئ ملفات خارج evidence إلا إذا طلب lead ذلك صراحة.
- لا يوسع النطاق.
- لا يكرر نفس finding بدون cross-reference.
- يربط كل finding برحلة وشريحة محددة داخل dsh/docs/JOURNIES.
- أي شيء غير مثبت لا يتركه عامًا؛ يحوله إلى BLOCKED_WITH_REASON أو REQUIRED_ADDITION مع سبب واضح وفحص مطلوب.
- لا يكتب PASS / READY / CLOSED / 100%.
- يستخدم التصنيفات المحددة فقط.

التصنيفات الإلزامية:
- COVERED
- PARTIAL
- UNCOVERED
- DUPLICATE_CONFIRMED
- DUPLICATE_CANDIDATE
- DEAD_CODE_CANDIDATE
- CONFLICT_CONFIRMED
- CONFLICT_CANDIDATE
- LARGE_FILE_SPLIT_REQUIRED
- PERFORMANCE_RISK
- REQUIRED_ADDITION
- STALE_REFERENCE
- BLOCKED_WITH_REASON
- DEFERRED_WITH_REASON
- KEEP_WITH_REASON
- WLT_OWNER
- DSH_READ_ONLY
- DSH_EVENT_TO_WLT
- FINANCE_BOUNDARY_VIOLATION
- RUNTIME_VIOLATION_PENDING
- NEEDS_RUNTIME_EVIDENCE
- NEEDS_VISUAL_EVIDENCE
- NEEDS_GIT_EVIDENCE

────────────────────────
teammate 1: foundation-runtime-evidence
────────────────────────

النطاق المسموح:
- docker-compose.local.yml
- dsh/backend/docker-compose.local.yml
- dsh/backend/Dockerfile.dsh-api
- scripts المتعلقة بالruntime المحلي
- tools/scripts
- tools/registry/runs
- dsh/docs/JOURNIES foundation/pre-store/evidence
- Docker/local ports/runtime readiness

المطلوب:
- جرد runtime/local/docker/evidence.
- كشف blockers.
- كشف evidence gaps.
- التأكد من Root Orchestrator وDSH/WLT compose boundaries.
- التأكد من MinIO requirements للـ media slices.
- عدم تعديل runtime الفعلي.
- عدم تعديل compose في هذه المرحلة.

المخرجات:
04-teammate-findings-foundation-runtime-evidence.md

────────────────────────
teammate 2: dsh-backend-api-auth
────────────────────────

النطاق المسموح:
- dsh/backend
- auth.openapi.yaml
- أي OpenAPI/API/binding/runtime مرتبط مباشرة بـ DSH/Auth

المطلوب:
- جرد routes.
- جرد handlers.
- جرد repositories.
- جرد models/schemas.
- جرد migrations عند الحاجة.
- جرد OpenAPI/API contracts.
- جرد media runtime endpoints.
- مطابقة كل route/API مع journey/slice.
- كشف dead code candidates.
- كشف duplicate candidates.
- كشف conflicts.
- لا تنقل أي money mutation إلى DSH.
- أي منطق يمس wallet/ledger/refund/payout/settlement يصنف:
  WLT_OWNER أو DSH_EVENT_TO_WLT أو FINANCE_BOUNDARY_VIOLATION

المخرجات:
05-teammate-findings-dsh-backend-api-auth.md

────────────────────────
teammate 3: dsh-mobile-surfaces
────────────────────────

النطاق المسموح:
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/data
- dsh/frontend/media-fixtures
- dsh/frontend/shared

المطلوب:
- جرد screens.
- جرد components.
- جرد hooks.
- جرد clients.
- جرد adapters.
- جرد CTAs.
- جرد states:
  loading / empty / error / success / disabled / offline / unauthorized / forbidden / pending / approved / rejected / delivered / returned / refunded / cancelled / failed
- كشف الشاشات الناقصة.
- كشف التكرار.
- كشف الملفات الضخمة.
- كشف الملفات المختلطة UI + state + API + data.
- كشف runtime imports من dsh/frontend/data.
- كشف runtime imports من dsh/frontend/media-fixtures.
- فرض on-demand retrieval:
  IDs / lean summaries / detail-on-open / pagination / caching / deferred detail fetching.
- تثبيت أن data/media-fixtures DEV_ONLY/PREVIEW_ONLY ولا تستخدم لإغلاق أي runtime.
- لا تعدل ui-kit.

المخرجات:
06-teammate-findings-dsh-mobile-surfaces.md

────────────────────────
teammate 4: control-panel-platform-ops
────────────────────────

النطاق المسموح:
- control-panel/runtime
- أقسام DSH/WLT/Platform/Vars/Operations/Support/Partner/Captain/Field/Finance داخل لوحة التحكم
- dsh/docs/JOURNIES/JOURNIES_PLATFORM_CONTROL_PANEL_ROLE_MAP.md

المطلوب:
- جرد أقسام لوحة التحكم المرتبطة بـ DSH/WLT.
- تحديد دور قسم المنصة Platform.
- تحديد دور Vars/Provider policy.
- جرد permissions/RBAC إن وجدت.
- كشف الصفحات الناقصة.
- كشف states الناقصة.
- كشف gaps بين لوحة التحكم والتطبيقات.
- كشف أي اعتماد preview/fixtures داخل control-panel.
- لا تبدأ تنفيذ UI قبل ثبوت API/runtime/permissions اللازمة.
- لا تنقل operational business logic إلى ui-kit.

المخرجات:
07-teammate-findings-control-panel-platform-ops.md

────────────────────────
teammate 5: wlt-finance-ui-kit-performance
────────────────────────

النطاق المسموح:
- wlt بالكامل
- ui-kit من ناحية الاستهلاك والملكية العامة فقط
- dsh/docs/JOURNIES/JOURNIES_DESIGN_SURFACE_LENS_AND_UIKIT_GATE.md

المطلوب:
- تثبيت WLT كمالك وحيد لأي:
  wallet / ledger / refund / payout / settlement / reconciliation
- كشف أي خلط مالي بين DSH وWLT.
- تصنيف كل اعتماد مالي:
  WLT_OWNER
  DSH_READ_ONLY
  DSH_EVENT_TO_WLT
  FINANCE_BOUNDARY_VIOLATION
- جرد design drift.
- كشف local design systems.
- كشف Tamagui خارج ui-kit.
- كشف deep imports من ui-kit/src أو @bthwani/ui-kit/src.
- كشف hardcoded visual tokens والألوان العشوائية.
- كشف large files/performance risks.
- لا تعدل ui-kit.
- إذا ثبت أن المشكلة مركزية ولا يمكن حلها بالاستهلاك الصحيح، اكتب:
  BLOCKED_WITH_REASON: ui-kit central change requires human approval.

المخرجات:
08-teammate-findings-wlt-finance-ui-kit-performance.md

مهمة lead في Phase 1:
- لا يعمل بدل teammates.
- ينسق فقط.
- يرفض أي teammate يخلط النطاقات.
- يرفض أي نتيجة لا تربط findings بالرحلات والشرائح.
- يجمع نتائج teammates في evidence session.
- يحدث ملفات الجرد داخل dsh/docs/JOURNIES فقط إذا كانت documentation/evidence.
- لا يعدل الكود الحي.
- لا يعتبر أي شريحة مغلقة.

Evidence Phase 1:
داخل:
tools/registry/runs/CLAUDE_TEAM_DSH_WLT_CENSUS-YYYYMMDD-HHMMSS

أنشئ:
- 01-git-status-before.txt
- 02-agent-team-plan.md
- 03-teammate-scopes.md
- 04-teammate-findings-foundation-runtime-evidence.md
- 05-teammate-findings-dsh-backend-api-auth.md
- 06-teammate-findings-dsh-mobile-surfaces.md
- 07-teammate-findings-control-panel-platform-ops.md
- 08-teammate-findings-wlt-finance-ui-kit-performance.md
- 09-coverage-reconciliation.json
- 10-duplication-conflict-dead-code-register.json
- 11-large-file-performance-register.json
- 12-missing-required-additions-register.json
- 13-git-diff.patch
- 14-final-decision.md
- CLAUDE_TEAM_DSH_WLT_CENSUS-YYYYMMDD-HHMMSS.zip

قبل إنهاء Phase 1 شغّل:
- git --no-pager status --short
- git --no-pager diff --name-status
- git --no-pager diff --check

قرار Phase 1:
- DONE إذا اكتمل الجرد والمطابقة بالأدلة ويسمح بالانتقال إلى تنفيذ الشرائح.
- FIX_REQUIRED إذا توجد مشاكل في الجرد يمكن إصلاحها.
- BLOCKED إذا يوجد مانع.
- NEEDS_EVIDENCE إذا الأدلة ناقصة.

إذا Phase 1 ليست DONE، لا تبدأ Phase 2.

────────────────────────────────
6) Phase 2 — Sequential Slice Closure
────────────────────────────────

بعد Phase 1 فقط، ابدأ تنفيذ الشرائح من dsh/docs/JOURNIES حسب ترتيب:
JOURNIES_ZERO_GAP_EXECUTION_ORDER.md

لا تنفذ شريحة عامة.
لا تدمج أكثر من شريحة في تعديل واحد إلا إذا كانت dependency blocker موثقة.
APPLY يجب أن يكون متسلسلًا، شريحة واحدة في كل مرة.

ترتيب التنفيذ الإلزامي:
1) Foundation / local runtime / Docker / evidence gates.
2) Data/media isolation and runtime migration blockers.
3) DSH backend/API/Auth.
4) WLT finance boundary.
5) DSH mobile surfaces:
   app-client
   app-partner
   app-captain
   app-field
6) Control Panel / Platform / Vars / Operations / Finance / Support.
7) Media upload and image flows.
8) Order lifecycle end-to-end.
9) Support/cancel/refund/return/failure paths.
10) Performance/refactor/cleanup.
11) Final regression/readiness.
12) Pre-store readiness فقط بعد كل ما سبق.

لكل شريحة نفّذ الدورة التالية:

────────────────
A) CHECK
────────────────

- اقرأ ملف الشريحة.
- اقرأ journey inventory.
- استخرج الملفات والأسطح والـ APIs والـ CTAs والـ states المرتبطة.
- تحقق هل الشريحة تعتمد على dsh/frontend/data.
- تحقق هل الشريحة تعتمد على dsh/frontend/media-fixtures.
- تحقق هل الشريحة تمس WLT أو money boundary.
- تحقق هل لها control-panel dependency.
- تحقق هل لها Docker/runtime dependency.
- تحقق هل لها UI-kit/design-system dependency.
- تحقق هل لها media upload dependency.
- تحقق هل لها Auth/RBAC dependency.
- تحقق هل لها test/runtime/screenshot evidence requirement.

────────────────
B) FORENSICS
────────────────

صنّف كل gap باستخدام التصنيفات المحددة فقط:
- COVERED
- PARTIAL
- UNCOVERED
- DUPLICATE_CONFIRMED
- DUPLICATE_CANDIDATE
- DEAD_CODE_CANDIDATE
- CONFLICT_CONFIRMED
- CONFLICT_CANDIDATE
- LARGE_FILE_SPLIT_REQUIRED
- PERFORMANCE_RISK
- REQUIRED_ADDITION
- STALE_REFERENCE
- BLOCKED_WITH_REASON
- DEFERRED_WITH_REASON
- KEEP_WITH_REASON
- WLT_OWNER
- DSH_READ_ONLY
- DSH_EVENT_TO_WLT
- FINANCE_BOUNDARY_VIOLATION
- RUNTIME_VIOLATION_PENDING
- NEEDS_RUNTIME_EVIDENCE
- NEEDS_VISUAL_EVIDENCE
- NEEDS_GIT_EVIDENCE

أي gap يجب أن يذكر:
- path
- السبب
- الأثر
- الشريحة المسؤولة
- الإجراء المطلوب
- الدليل المطلوب للإغلاق

────────────────
C) APPLY
────────────────

نفّذ فقط ما يلزم لإغلاق الشريحة الحالية.

مسموح:
- ترحيل runtime data من preview إلى API/DB.
- ترحيل runtime images من fixtures إلى MinIO/media API.
- إضافة API/binding ناقص.
- إصلاح شاشة أو flow ناقص.
- إصلاح CTA/state ناقص.
- إصلاح control-panel section مرتبط.
- إصلاح WLT bridge إذا كان ماليًا.
- إزالة duplicate after proving consumers.
- تفكيك ملف ضخم إذا كان blocker للشريحة.
- تحسين التصميم عبر استهلاك @bthwani/ui-kit public exports فقط.
- إضافة evidence/docs اللازمة للشريحة.
- إضافة tests إذا كانت مطلوبة ومناسبة.

ممنوع:
- استخدام fixtures كحل runtime.
- نقل money mutation إلى DSH.
- تعديل ui-kit مباشرة بدون موافقة عند الحاجة.
- توسيع النطاق خارج الشريحة.
- حذف dsh/frontend/data أو dsh/frontend/media-fixtures الآن.
- تجاهل control-panel/platform role.
- تجاهل Docker/MinIO runtime.
- تعديل dependency/lockfile دون موافقة بشرية.

────────────────
D) VERIFY
────────────────

بعد كل شريحة شغّل ما يناسبها:

دائمًا:
- git --no-pager status --short
- git --no-pager diff --name-status
- git --no-pager diff --check

حسب نوع الشريحة:
- typecheck المناسب إن كان متاحًا.
- tests المناسبة إن كانت موجودة.
- runtime smoke إذا الشريحة runtime/API.
- Docker smoke إذا الشريحة تمس docker/runtime.
- media upload smoke إذا الشريحة تمس الصور.
- WLT smoke إذا الشريحة مالية.
- Auth/RBAC smoke إذا الشريحة تمس الصلاحيات.
- Control Panel smoke إذا الشريحة تمس اللوحة.
- screenshot/visual evidence إذا الشريحة UI.

────────────────
E) EVIDENCE
────────────────

أنشئ evidence لكل شريحة تحت:
tools/registry/runs/{SLICE_ID}-YYYYMMDD-HHMMSS

ويجب أن يحتوي حسب الحاجة:
- 01-slice-scope.md
- 02-files-inspected.txt
- 03-files-changed.txt
- 04-git-status.txt
- 05-git-diff-name-status.txt
- 06-git-diff-check.txt
- 07-typecheck.txt
- 08-tests.txt
- 09-runtime-smoke.txt
- 10-docker-smoke.txt
- 11-media-upload-smoke.txt
- 12-wlt-boundary-check.txt
- 13-control-panel-check.txt
- 14-visual-evidence.md
- 15-final-slice-decision.md
- {SESSION_ID}.zip

اسم zip يجب أن يطابق SESSION_ID نفسه.

────────────────
F) DECISION
────────────────

قرار كل شريحة يجب أن يكون واحدًا فقط:
- DONE إذا اكتملت بالأدلة.
- FIX_REQUIRED إذا بقي خلل قابل للإصلاح.
- BLOCKED إذا يوجد blocker يمنع الإغلاق.
- NEEDS_EVIDENCE إذا الأدلة ناقصة.
- NEEDS_VISUAL_EVIDENCE إذا UI بلا screenshots.

لا تنتقل للشريحة التالية إلا إذا القرار DONE.
إذا القرار ليس DONE، توقف أو أصلح داخل نفس الشريحة فقط.

────────────────────────────────
7) قواعد WLT المالية
────────────────────────────────

- WLT هو المالك الوحيد لأي:
  wallet / ledger / refund / payout / settlement / reconciliation
- DSH يسمح له فقط:
  DSH_READ_ONLY
  أو
  DSH_EVENT_TO_WLT
- أي mutation مالي داخل DSH يصنف:
  FINANCE_BOUNDARY_VIOLATION
- لا تغلق أي checkout/payment/refund/order-finance slice بدون WLT evidence.
- لا تكرر ledger logic داخل DSH.
- لا تستخدم DSH كمالك للمحفظة أو التسوية أو الاسترجاع.
- أي علاقة بين order/payment/refund يجب أن توثق event/contract boundary.

────────────────────────────────
8) قواعد Control Panel / Platform
────────────────────────────────

- يجب أخذ قسم المنصة Platform/Vars في الاعتبار.
- أي provider/runtime vars/policy/control-plane يجب أن يظهر في لوحة التحكم أو في مسار platform مناسب.
- لا تعتبر flow مكتملًا إذا التطبيق يعمل لكن لوحة التحكم لا تعرض/تتحكم/تراقب الجزء المطلوب.
- لا تبدأ control-panel UI قبل ثبوت API/runtime/permissions اللازمة.
- يجب جرد Operations/Support/Partner/Captain/Field/Finance.
- يجب جرد states والـ CTAs والـ permissions.
- أي نقص في قسم المنصة أو Vars يصنف REQUIRED_ADDITION أو BLOCKED_WITH_REASON.

────────────────────────────────
9) قواعد UI-kit والهوية البصرية
────────────────────────────────

- كل reusable design يجب أن يستهلك @bthwani/ui-kit public exports.
- لا Tamagui خارج ui-kit.
- لا deep imports من ui-kit/src أو @bthwani/ui-kit/src.
- لا local design system.
- لا hardcoded visual tokens عشوائية.
- لا تضخم ui-kit.
- لا تنقل business logic إلى ui-kit.
- أي تغيير مرئي يحتاج screenshot evidence.
- لا تعدل ui-kit إلا إذا ثبت أنه owner مركزي مطلوب، وعندها توقف واطلب موافقة بشرية.
- كل شاشة يجب أن تراعي RTL/loading/empty/error/success/offline/disabled عند الحاجة.

────────────────────────────────
10) قواعد الأداء و on-demand retrieval
────────────────────────────────

ممنوع:
- eager loading واسع.
- overfetching.
- تحميل كل التفاصيل لكل الأسطح.
- polling غير محدود.
- inline arrays/objects كبيرة داخل render path.
- تكرار data/constants داخل screens.
- دمج UI + state + API + data في ملف ضخم بدون سبب.

مطلوب:
- IDs / references.
- lean summaries.
- detail-on-open.
- pagination.
- caching.
- deferred detail fetching.
- virtualized lists عند الحاجة.
- split boundaries عند وجود LARGE_FILE_SPLIT_REQUIRED.

لا تغلق شاشة feed/list/order/history بدون pagination أو دليل أن الحجم محدود ومبرر.

────────────────────────────────
11) قواعد البيانات والصور
────────────────────────────────

- لا runtime import من dsh/frontend/data.
- لا runtime import من dsh/frontend/media-fixtures.
- لا local mock arrays داخل شاشة runtime.
- لا preview adapters كحل نهائي.
- كل بيانات runtime يجب أن تأتي من API/DB.
- كل صور runtime يجب أن تأتي من MinIO/media API.
- fixtures تبقى فقط preview/test/storybook/seed isolated.
- fixtures لا تستخدم كدليل تشغيل.
- أي tolerated violation في guard لا يعتبر إغلاقًا.
- tolerated violation يجب أن يدخل في missing additions أو runtime violation register ويرتبط بشريحة.

────────────────────────────────
12) قواعد Docker
────────────────────────────────

Docker local يجب أن يثبت تشغيل:
- DSH API
- Auth
- WLT API
- PostgreSQL
- MinIO عند media slices

لا تعتبر media slice مغلقة بدون:
- MinIO healthy.
- migration dsh_media_assets موجودة/مطبقة إذا كانت مطلوبة.
- upload intent smoke.
- PUT to MinIO smoke.
- complete smoke.
- GET media smoke.
- عدم استخدام media-fixtures.

لا تعتبر Docker جاهزًا إذا الصور تأتي من media-fixtures.

────────────────────────────────
13) Final Regression / Practical Runtime Readiness
────────────────────────────────

بعد انتهاء كل الشرائح، أنشئ Final Regression Evidence تحت:
tools/registry/runs/DSH_WLT_FINAL_REGRESSION-YYYYMMDD-HHMMSS

ويجب أن يحتوي:
- git-status-final.txt
- git-diff-name-status-final.txt
- git-diff-check-final.txt
- typecheck-final.txt
- tests-final.txt
- docker-stack-status.txt
- dsh-api-smoke.txt
- auth-smoke.txt
- wlt-api-smoke.txt
- minio-smoke.txt
- media-upload-intent-complete-smoke.txt
- client-order-happy-path.txt
- partner-order-flow.txt
- captain-delivery-flow.txt
- control-panel-ops-flow.txt
- wlt-finance-boundary-flow.txt
- failure-cancel-refund-flow.txt
- preview-fixtures-runtime-guard.txt
- zero-runtime-imports-from-data-media-fixtures.txt
- screenshots-index.md
- final-decision.md
- DSH_WLT_FINAL_REGRESSION-YYYYMMDD-HHMMSS.zip

Final decision فقط:
- DONE إذا أصبحت الخدمة قابلة للتجريب العملي الحقيقي محليًا بالأدلة.
- FIX_REQUIRED إذا بقيت مشاكل.
- BLOCKED إذا يوجد مانع.
- NEEDS_EVIDENCE إذا نقصت الأدلة.
- NEEDS_VISUAL_EVIDENCE إذا نقصت screenshots لتغييرات UI.

لا تكتب:
PASS
READY
CLOSED
100%

────────────────────────────────
14) المخرجات النهائية المطلوبة في رد Claude Code
────────────────────────────────

في نهاية المهمة اكتب فقط ملخصًا عمليًا يتضمن:

- عدد الرحلات التي تمت معالجتها.
- عدد الشرائح التي تمت معالجتها.
- عدد الشرائح:
  DONE
  FIX_REQUIRED
  BLOCKED
  NEEDS_EVIDENCE
  NEEDS_VISUAL_EVIDENCE
- أهم blockers المتبقية.
- هل أصبح يمكن عمل طلب حقيقي من التطبيق أم لا.
- هل رفع الصور إلى MinIO يعمل أم لا.
- هل WLT boundary سليم أم لا.
- هل control-panel يغطي العمليات أم لا.
- هل لا يوجد runtime import من dsh/frontend/data أو dsh/frontend/media-fixtures أم لا.
- مسار final evidence zip.
- القرار النهائي:
  DONE / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE فقط.

تذكير نهائي:
هذه ليست مهمة UI preview.
هذه ليست مهمة جرد فقط.
هذه ليست مهمة تحسين عام.
هذه مهمة إغلاق شريحي حقيقي ومتدرج على الكود حي، مشروط بالأدلة، ويمنع الانتقال أو الادعاء حتى يثبت runtime الحقيقي كل شيء.
