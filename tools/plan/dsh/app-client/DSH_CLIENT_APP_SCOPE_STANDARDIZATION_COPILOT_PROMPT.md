نفّذ DSH_CLIENT_APP_SCOPE_STANDARDIZATION تنفيذًا جذريًا مغلقًا من الألف إلى الياء داخل C:\bthwani-suite.

الهدف:
إغلاق كل ما يتعلق بخدمة DSH داخل تطبيق العميل، ليس كتطبيق منفصل، بل كجزء من منظومة BThwani المتكاملة. يجب أن يشمل التنفيذ DSH client نفسه، وتكامل WLT المرتبط بـ DSH داخل app-client، والتحقق من app-client shell/composition، وتحديث dsh/SERVICE_BLUEPRINT.md و dsh/docs حتى يصبح نفس الأسلوب قابلاً للتكرار على أي خدمة/تطبيق آخر.

نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاقه 100% بالأدلة، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.

المسارات الأساسية:
- dsh/frontend/app-client/**
- wlt/frontend/app-client/dsh/**
- wlt/frontend/shared/finance/**
- app-client/composition/**
- app-client/shell/**
- dsh/frontend/shared/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**

تصحيح معماري إلزامي:
- لا توجد خدمة باسم core. ممنوع استخدام serviceId='core'.
- الشاشات العامة في app-client ليست خدمة، بل ownerKind='app' و ownerId='app-client'.
- شاشات DSH تكون ownerKind='service', ownerId='dsh', serviceId='dsh'.
- تكامل WLT المرتبط بـ DSH يكون ownerKind='integration', ownerId='wlt.dsh', serviceId='wlt', linkedServiceId='dsh'.
- WLT يملك المال والمحفظة وmoney semantics.
- DSH يملك تجربة الطلب/التوصيل/السلة/المتجر/التتبع.
- التكامل بين DSH و WLT يجب أن يكون عبر bridge/contract public واضح، وليس deep imports عشوائية.

المعيار البنيوي النهائي المطلوب:

dsh/frontend/app-client/
├─ index.ts
├─ DshClientSurface.tsx
├─ dsh-client.routes.ts
├─ dsh-client.screen-registry.ts
├─ dsh-client.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/

wlt/frontend/app-client/dsh/
├─ index.ts
├─ wlt-dsh-client.contract.ts
├─ wlt-dsh-client.preview-data.ts
├─ wlt-dsh-client.types.ts
├─ WltDshClientPaymentPreview.tsx
├─ WltDshBalancePreview.tsx
├─ WltDshConnectorPanel.tsx
├─ WltDshPaymentOption.tsx
├─ WltDshPaymentOptionsRow.tsx
└─ hooks/useWltDshWalletPreview.ts

قواعد ممنوعة:
- لا backend/API/OpenAPI.
- لا dependencies جديدة.
- لا route semantics changes.
- لا redesign.
- حافظ على مظهر الشاشات الحالي.
- لا حذف نهائي؛ archive فقط عند dead/exact duplicate مثبت.
- لا Tamagui خارج ui-kit.
- لا export *.
- لا any/as any جديد.
- لا line-ending normalization.
- لا full-file reformat.
- لا تغيير data ids/order/labels/values.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- لا تنقل WLT money semantics إلى DSH.

تشخيص أولي إلزامي:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git status --short
6) git diff --name-status
7) git diff --check
8) pnpm -w exec tsc --noEmit

إذا diff-check فشل فقط بسبب whitespace داخل النطاق، أصلحه آليًا ثم أعد diff-check.
إذا tsc كان يفشل قبل التنفيذ، وثقه ولا تتجاهله؛ بعد التنفيذ يجب أن يكون PASS حتى تعلن PASS.

مرحلة التنفيذ 1 — هيكلة DSH client:
- انقل DshSurfaceHost.tsx إلى DshClientSurface.tsx.
- غيّر الرمز الداخلي إلى DshClientSurface مع alias compatibility باسم DshSurfaceHost عند الحاجة حتى لا تكسر app-client composition.
- أنشئ dsh-client.routes.ts.
- أنشئ dsh-client.screen-registry.ts.
- انقل الشاشات route/surface إلى screens/.
- انقل الأجزاء غير route إلى parts/.
- انقل preview/static/contracts إلى data/.
- انقل helpers/mappers/media/types المساعدة إلى shared/.
- حدّث جميع relative imports بناءً على resolved old path -> new path، لا بمجرد replace عشوائي.
- نظّف index.ts بحيث لا يصدّر كل شيء، بل فقط public surface API:
  DshClientSurface / DshSurfaceHost alias / ApprovedVideoReelsViewer / dshClientRoutes / dshClientScreenRegistry / public types المطلوبة.

مرحلة التنفيذ 2 — WLT DSH bridge:
- أدخل wlt/frontend/app-client/dsh ضمن النطاق.
- وحّد التسميات إلى WltDsh* لأن المالك WLT.
- أنشئ index.ts.
- أنشئ wlt-dsh-client.contract.ts.
- أنشئ wlt-dsh-client.preview-data.ts.
- أنشئ wlt-dsh-client.types.ts.
- أعد تسمية hook إلى useWltDshWalletPreview.ts.
- لا تجعل DSH يستورد WLT internals عشوائيًا؛ الهدف public bridge/contract واضح.
- أي preview money values يجب أن توثق:
  dataKind='UI_PREVIEW_ONLY'
  runtimeTruth=false
  backendSource=false
  bindingSource=false
  moneySemantics='preview-only display values / not accounting source'

مرحلة التنفيذ 3 — تنظيف التسريب والتكرار والميت:
- افحص فقط product source، واستبعد:
  node_modules, .next, .expo, .turbo, dist, build, coverage, tools/registry/runs, dsh/_archive
- افحص:
  operations_css_leak
  export_star
  any/as any
  Tamagui outside ui-kit
  deep imports بين app-client/app-partner/app-captain/app-field
  old_visual_noise
  runtime_error_strings
  NewsTickerBar Animated remnants
- أرشف exact duplicate/dead فقط إذا no imports/no route/no registry/no composition/no shell refs.
- archive المسموح فقط:
  dsh/_archive/frontend/<SESSION_ID>/<same-relative-path>
- لا تدمج screens عشوائيًا.

مرحلة التنفيذ 4 — docs and blueprint:
- حدّث C:\bthwani-suite\dsh\SERVICE_BLUEPRINT.md بقسم واضح بين markers:
  <!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->
  <!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->
- أنشئ/حدّث:
  dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md
  dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md
  dsh/docs/dsh-client-final-classification.csv
- يجب أن توضح docs:
  scope rings
  ownership rules
  no core service
  WLT-owned DSH integration
  canonical DSH client structure
  repeatable runbook لأي خدمة أخرى.

مرحلة التنفيذ 5 — gates المتكررة:
نفّذ حلقة تحقق وإصلاح حتى 3 دورات:
- static gate
- git diff --check
- pnpm -w exec tsc --noEmit
- إذا فشل diff-check بسبب whitespace أصلحه داخل النطاق فقط ثم أعد.
- إذا فشل tsc بسبب imports بعد move، أصلح imports ثم أعد.
- إذا فشل static gate، أصلح البوابة المحددة ثم أعد.
- لا تعلن PASS حتى تمر كل البوابات.

Runtime smoke:
- إذا adb متاح: التقط app-client logcat وتأكد عدم وجود:
  Cannot read property 'default' of undefined
  property is not writable
  NewsTickerBar
  FATAL EXCEPTION
  AndroidRuntime
- إذا control-panel يعمل على 3000 أو 3010: اختبر:
  /
  /operations
  /finance
  /support
  /partners
  /marketing
  وتأكد عدم وجود:
  Box is not defined
  Expected '</'
  Module not found
  Can't resolve
  React is not defined
  Internal Server Error
  Build Error
  Runtime Error

Evidence:
أنشئ:
tools\registry\runs\DSH_CLIENT_APP_SCOPE_STANDARDIZATION-YYYYMMDD-HHMMSS\

ضع داخله:
- branch.txt
- head.txt
- origin-head.txt
- head-sync.txt
- git-status-before.txt
- git-diff-name-status-before.txt
- baseline-diff-check.txt
- baseline-tsc-noemit.txt
- moves.csv
- import-updates.csv
- fixes.csv
- docs-updates.csv
- static-gate.txt
- static-gate.json
- runtime-smoke.csv
- dsh-client-final-classification.csv
- git-status-final.txt
- git-diff-name-status-final.txt
- git-diff-check.txt
- tsc-noemit.txt
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILES.txt
- FINAL_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

FINAL_REPORT.md يجب أن يحتوي فقط:
- FINAL_VERDICT
- moved/standardized files count
- import updates count
- fixes count
- docs updates count
- classification rows count
- diff-check PASS/FAIL
- tsc PASS/FAIL
- static gate PASS/FAIL
- runtime smoke result
- next step only if PASS

لا تعلن PASS إلا إذا:
- diff-check PASS
- tsc PASS
- static blocker counts = 0
- imports محدثة
- docs/blueprint محدثة
- لا untracked source files غير موثقة
- لا route/backend/API changes
- لا visual redesign
- لا WLT money ownership leak إلى DSH
- لا serviceId='core'
