نفّذ DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2 تنفيذًا عميقًا وشاملًا ومغلقًا داخل C:\bthwani-suite.

هذا ليس طلبًا مختصرًا. نفّذ التشخيص، التخطيط، التنفيذ، التحقق، ثم كرر دورة الإصلاح حتى PASS حقيقي، بدون تجاهل أي ملف داخل النطاق وبدون ترك ملفات غير مصنفة أو imports مكسورة.

الهدف:
إغلاق كل ما يتعلق بخدمة DSH داخل تطبيق العميل، مع اعتبار المنظومة كاملة:
- DSH client surface
- WLT-owned DSH bridge
- WLT finance support
- app-client shell/composition integration
- DSH shared frontend support
- docs/blueprint standardization

نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاقه 100% بالأدلة، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.

النطاق الإلزامي:
- dsh/frontend/app-client/**
- wlt/frontend/app-client/dsh/**
- wlt/frontend/shared/finance/**
- app-client/composition/**
- app-client/shell/**
- dsh/frontend/shared/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**

تصحيحات إلزامية:
1) لا توجد خدمة باسم core. ممنوع serviceId='core' أو ownerId='core'.
2) الشاشات العامة تستخدم ownerKind='app', ownerId='app-client'.
3) شاشات DSH تستخدم ownerKind='service', ownerId='dsh', serviceId='dsh'.
4) تكامل WLT المرتبط بـ DSH يستخدم ownerKind='integration', ownerId='wlt.dsh', serviceId='wlt', linkedServiceId='dsh'.
5) WLT يملك المال والمحفظة وmoney semantics.
6) DSH يملك تجربة الطلب/التوصيل/المتجر/السلة/التتبع/تفضيلات التوصيل.
7) لا تنقل wallet/account/profile إلى DSH.

أضف شاشة تفضيلات DSH:
- أضف شاشة PreferencesScreen.tsx داخل:
  dsh/frontend/app-client/screens/PreferencesScreen.tsx
- الشاشة تخص تفضيلات خدمة DSH فقط:
  تعليمات التسليم
  تفضيلات الاستبدال
  إشعارات الطلب داخل DSH
  طريقة التواصل مع الكابتن
  تفضيلات تسليم العنوان/الموقع
- لا تحتوي حساب عام أو profile أو wallet أو إعدادات أمان.
- أضفها إلى dsh-client.routes.ts و dsh-client.screen-registry.ts.
- screenId مقترح:
  client.dsh.preferences.delivery
- routeId مقترح:
  dsh-preferences
- flowId:
  dsh.preferences

الهيكل النهائي المطلوب لـ DSH client:
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

لا تنشئ مجلد feature لكل شاشة. التصنيف يكون داخل names و registry/classification وليس عبر تشعب مجلدات.

تبسيط WLT DSH bridge:
المسار wlt/frontend/app-client/dsh مرتبط بـ DSH checkout/payment لذلك يدخل في الإغلاق، لكنه لا يجب أن يكون متشعبًا. لا تجعله شاشة DSH ولا تنقله إلى DSH. اجعله WLT-owned bridge صغير:

wlt/frontend/app-client/dsh/
├─ index.ts
├─ WltDshClientBridge.tsx
├─ wlt-dsh-client.parts.tsx
├─ wlt-dsh-client.adapter.ts
├─ wlt-dsh-client.contract.ts
├─ wlt-dsh-client.preview-data.ts
├─ wlt-dsh-client.types.ts
└─ useWltDshWalletPreview.ts

إذا وجدت ملفات قديمة مثل:
- DshWltBalance.tsx
- DshWltConnector.tsx
- DshWltPaymentOption.tsx
- DshWltPaymentOptionsRow.tsx
- WltDshClientPaymentPreview.tsx
- hooks/useWlt.ts
فقم بدمجها أو نقلها إلى الهيكل المبسط أعلاه بدون كسر imports. إذا تعذر الدمج الآمن داخل نفس الرد، اتركها فقط إذا صنفتها كـ INTEGRATION_PART_PENDING_MERGE مع سبب واضح، لكن لا تعلن PASS النهائي إذا بقي التشعب بلا سبب.

قواعد التنفيذ:
- لا backend/API/OpenAPI.
- لا dependencies جديدة.
- لا route semantics redesign.
- حافظ على تصميم الواجهات الحالي.
- لا حذف نهائي؛ archive فقط عند dead/exact duplicate مثبت.
- لا Tamagui خارج ui-kit.
- لا export *.
- لا any/as any جديد.
- لا line-ending normalization.
- لا full-file reformat.
- لا تغيير data ids/order/labels/values.
- لا تستخدم أي repo/path قديم باسم bth؛ الريبو الحالي فقط C:\bthwani-suite.
- لا تتجاهل أي ملف داخل النطاق؛ كل ملف يجب أن يظهر في classification.

تشخيص أولي إلزامي:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git status --short
6) git diff --name-status
7) git diff --check
8) pnpm -w exec tsc --noEmit

إذا diff-check فشل بسبب whitespace داخل النطاق، أصلحه ثم أعد الفحص.
إذا tsc يفشل بسبب حالة سابقة، وثقه، لكن لا تعلن PASS حتى tsc النهائي PASS.

مرحلة الهيكلة:
- انقل DshSurfaceHost.tsx إلى DshClientSurface.tsx.
- غيّر الرمز الداخلي إلى DshClientSurface مع compatibility alias باسم DshSurfaceHost عند الحاجة.
- أنشئ/حدّث dsh-client.routes.ts.
- أنشئ/حدّث dsh-client.screen-registry.ts.
- انقل شاشات route/surface إلى screens/.
- انقل أجزاء UI غير route إلى parts/.
- انقل preview/static/contracts إلى data/.
- انقل helpers/mappers/media إلى shared/.
- حدّث imports بناءً على resolved old path -> new path، لا replace عشوائي.
- نظف index.ts ليصدّر public surface API فقط.

Screen Registry:
كل شاشة حقيقية داخل screens يجب أن تملك:
- screenId
- routeId
- surfaceId='app-client'
- ownerKind
- ownerId
- serviceId عند الحاجة
- linkedServiceId عند الحاجة
- ownerPath
- componentName
- screenKind
- flowId عند الحاجة
- requiredStates
- requiredPermissions عند الحاجة
- analytics.screenView
- deepLinkPath/fallbackRouteId عند الحاجة
- releaseCriticality
- status

ممنوع serviceId='core'.

مرحلة WLT bridge:
- وحّد WLT DSH bridge كـ WLT-owned.
- أنشئ contract/preview-data/types.
- أي money preview يجب أن يصرح:
  dataKind='UI_PREVIEW_ONLY'
  runtimeTruth=false
  backendSource=false
  bindingSource=false
  moneySemantics='preview-only display values / not accounting source'
- لا تجعل DSH يستورد WLT internals عشوائيًا. الهدف public bridge/contract.

مرحلة docs:
- حدّث dsh/SERVICE_BLUEPRINT.md بين markers:
  <!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:start -->
  <!-- DSH_CLIENT_APP_SCOPE_STANDARDIZATION:end -->
- أنشئ/حدّث:
  dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md
  dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md
  dsh/docs/dsh-client-final-classification.csv

مرحلة static gate:
افحص فقط product source، واستبعد:
node_modules, .next, .expo, .turbo, dist, build, coverage, tools/registry/runs, dsh/_archive

افحص:
- forbidden_core_service
- export_star
- any/as any
- Tamagui outside ui-kit
- deep imports between app-client/app-partner/app-captain/app-field
- old_visual_noise
- runtime_error_strings
- WLT/DSH ownership leakage
- unclassified files

مرحلة التكرار:
كرر حتى 3 دورات:
1) static gate
2) git diff --check
3) pnpm -w exec tsc --noEmit
4) إذا فشل import، أصلحه.
5) إذا فشل static gate، أصلح البوابة المحددة.
6) إذا فشل whitespace، أصلحه داخل النطاق فقط.
7) أعد الدورة.

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
  وتأكد عدم وجود أخطاء build/runtime.

Evidence:
أنشئ:
tools\registry\runs\DSH_CLIENT_APP_SCOPE_STANDARDIZATION_R2-YYYYMMDD-HHMMSS\

ضع:
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
- static-gate.txt/json
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

لا تعلن PASS إلا إذا:
- diff-check PASS
- tsc PASS
- static blockers = 0
- لا serviceId='core'
- PreferencesScreen مضافة ومصنفة ومسجلة
- WLT DSH bridge مصنف ومبسّط أو مبرر بدقة
- كل ملف داخل النطاق مصنف
- imports محدثة
- docs/blueprint محدثة
- لا route/backend/API changes
- لا visual redesign
