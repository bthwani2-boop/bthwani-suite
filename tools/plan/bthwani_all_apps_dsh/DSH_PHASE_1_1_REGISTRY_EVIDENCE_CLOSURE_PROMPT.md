# DSH Phase 1.1 — Registry Evidence Closure + Consumption Baseline Prompt

انسخ هذا الأمر إلى VS Code/Copilot داخل `C:\bthwani-suite`.

```text
نفّذ Phase 1.1 فقط داخل C:\bthwani-suite.

الهدف:
تصحيح وإغلاق فجوات Phase 1 الخاصة بـ DSH Flow Registry & Reachability Baseline قبل الانتقال لأي Phase 2. هذه ليست مرحلة UI redesign وليست backend/API. المطلوب جعل registry قابلة للاعتماد كـ baseline حقيقي، مع evidence كامل، وبدون تكرار أو dead imports أو claims رقمية غير صحيحة.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المظلة إلزامية:
DSH منظومة واحدة بين app-client / app-partner / app-captain / app-field / control-panel / WLT finance reference. يجب احترام on-demand retrieval: registry = metadata فقط، IDs/references/summaries أولًا، والتفاصيل الثقيلة عند الفتح فقط.

سبب هذه المرحلة:
مراجعة Phase 1 أظهرت أن التنفيذ اتجاهه صحيح لكنه ليس 100%:
- evidence غير مكتمل: staged/untracked files لم تُراجع بpatch كامل.
- summary قال 31 partner flows بينما dsh-partner.types.ts يحتوي 27 operational IDs فعليًا.
- dsh-flow-registry.ts موجود ومصدّر، لكن استهلاكه الفعلي ضعيف جدًا.
- PartnerSupportScreen يستورد isDshHiddenCompatFlow لكنه لا يستخدمه فعليًا.
- dsh-partner.types.ts ما زال source مستقل موازي للregistry.
- .gitattributes و tools/plan artifacts ظهرت خارج changed-files summary.

نطاق الملفات المسموح:
- dsh/frontend/shared/dsh-flow-registry.ts
- dsh/frontend/shared/index.ts
- dsh/frontend/app-partner/dsh-partner.types.ts
- dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx
- dsh/frontend/app-partner/DshPartnerSurface.tsx فقط إذا احتجت guard routing محدود بلا UI redesign
- dsh/frontend/control-panel/** فقط إن كان الربط خفيفًا جدًا مع getDshEscalationFlows بدون شاشة جديدة
- tools/registry/runs/{SESSION_ID}/ evidence فقط
- لا تعدّل app-client/app-captain/app-field في APPLY هذه المرحلة؛ افحص فقط واكتب TODO للمرحلة التالية إن لزم.

ممنوع:
- ممنوع backend/API/database/runtime mutation.
- ممنوع تعديل dependencies أو lockfile.
- ممنوع إنشاء UI-kit files.
- ممنوع import Tamagui خارج ui-kit.
- ممنوع broad refactor.
- ممنوع redesign للشاشات.
- ممنوع نقل أو حذف ملفات.
- ممنوع تغيير معاني flows الحالية.
- ممنوع جعل العميل/الكابتن/الميداني يستهلكون registry بشكل واسع في هذه المرحلة.
- ممنوع ادعاء PASS/CLOSED/100%.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر ضمن نطاق هذه المرحلة فقط.

CHECK قبل APPLY:
1) شغّل وسجّل:
   git branch --show-current
   git rev-parse HEAD
   git --no-pager status --short
   git --no-pager diff --stat
   git --no-pager diff --name-status
   git --no-pager diff --cached --stat
   git --no-pager diff --cached --name-status
   git ls-files --others --exclude-standard

2) افحص:
- هل dsh/frontend/shared/dsh-flow-registry.ts tracked أم untracked؟
- هل توجد staged files من Phase 0 أو tools/plan؟
- هل .gitattributes ضمن scope ومقصودة؟
- هل changed-files summary السابق ناقص؟
- هل DSH_PARTNER_OPERATIONAL_FLOW_IDS = 27 أو رقم آخر؟ لا تفترض 31.

APPLY المطلوب:

A) Evidence correctness
- لا تترك أي staged/untracked ambiguity.
- لا تغيّر staged state بنفسك إلا إذا كان هذا هو وضع Copilot المحلي؛ فقط وثّق بدقة.
- أنشئ evidence جديد داخل:
  tools/registry/runs/DSH_PHASE_1_1_REGISTRY_EVIDENCE_CLOSURE-YYYYMMDD-HHMMSS/
- ZIP باسم SESSION_ID نفسه.
- يجب أن يحتوي:
  SUMMARY.md
  changed-files.txt
  source-vs-evidence-scope.csv
  registry-validation.csv
  registry-consumption.csv
  route-reachability-validation.csv
  git-status.txt
  git-diff-stat.txt
  git-diff-name-status.txt
  git-diff-check.txt
  git-staged-diff-stat.txt
  git-staged-name-status.txt
  git-staged-diff-check.txt
  git-untracked-files.txt
  tsc-noemit.txt
  guard-tamagui-import-boundary.txt أو GUARD_NOT_FOUND
  guard-i18n-direction-mobile-control-panel.txt أو GUARD_NOT_FOUND
  LOCAL_CHANGE_REVIEW.patch
  LOCAL_CHANGE_STAGED_REVIEW.patch إذا وجد staged diff
  UNTRACKED_FILES_MANIFEST.txt إذا وجدت untracked files
  {SESSION_ID}.zip

B) Registry validation
في dsh-flow-registry.ts:
- أضف utility تحقق read-only إذا مفيد، بدون side effects، مثل:
  getDshFlowRegistryStats()
  getDshFlowRegistryValidationSummary()
  أو دوال صغيرة آمنة مشابهة.
- لا تضف payloads ضخمة.
- لا تضف React/UI.
- تحقق أن كل entry لديه:
  id, label, domain, ownerSurface, visibleSurfaces, visibility, onDemandPolicy, allowedActions, forbiddenActions.
- تحقق أن كل financialImpact=true له onDemandPolicy='finance-preview-only' وownerSurface='wlt-finance' أو notes واضحة إن خالف.
- تحقق أن hiddenCompat=true له visibility='hidden-compat'.
- تحقق أن visible primary/contextual flows لا تشمل hidden compat.
- لا تكرر IDs.

C) Partner mapping alignment
في dsh-partner.types.ts:
- لا تكتف بتعليق عام.
- أضف mapping/validation constants خفيفة من دون circular import إن أمكن.
- إن كان الاستيراد من shared registry إلى types يسبب circular risk، لا تستورد؛ بدلاً من ذلك أضف export واضح:
  DSH_PARTNER_OPERATIONAL_FLOW_IDS_EXPECTED_COUNT = DSH_PARTNER_OPERATIONAL_FLOW_IDS.length
  أو helper محلي يثبت العدد الحقيقي.
- صحح أي comment يقول 31 إذا الرقم الفعلي 27.
- تأكد أن hidden compat operational flow IDs متطابقة مع registry أو وثّق الفرق بدقة.

D) PartnerSupportScreen cleanup
- إذا بقي import isDshHiddenCompatFlow غير مستخدم فعليًا، إما استخدمه في guard فعلي أو احذفه.
- لا تترك import ميت.
- لا تضف comments طويلة داخل كل data row إذا كان يمكن جعل guard مركزيًا.
- أضف helper خفيف مثل:
  const shouldOpenSupportRouteForFlow = (flowId) => !isDshHiddenCompatFlow(flowId) && mappedRoute != null
  أو استخدم existing hidden compat helpers من dsh-partner.types.ts.
- الهدف: منع hidden compat من الظهور/الفتح primary بسلوك فعلي، لا بتعليق فقط.
- لا تعيد تصميم UI.

E) Route reachability baseline truth
- route-reachability-validation.csv يجب أن يميز بين:
  PROVEN_REACHABLE_BY_ROUTE
  SCREEN_EXISTS_ONLY
  HIDDEN_COMPAT
  SUMMARY_ONLY_TBD
  CONTROL_PANEL_OWNER_TBD
- لا تكتب REACHABLE لأي flow فقط لأن screenHint string موجود.
- app-client/app-captain/app-field/control-panel entries التي لم تُستهلك registry فعليًا يجب أن تكون SUMMARY_ONLY_TBD أو SCREEN_EXISTS_ONLY لا REACHABLE نهائي.

F) Artifacts/scope accounting
- إذا .gitattributes مقصودة، اذكرها في changed-files/source-vs-evidence-scope.
- إذا tools/plan/bthwani_all_apps_dsh artifacts مقصودة، اذكرها كplan/evidence artifacts وليس source changes.
- إذا ليست مقصودة، لا تحذفها تلقائيًا؛ ضع BLOCKED_REVIEW_REQUIRED في summary.

G) Verification
بعد APPLY شغّل:
  git --no-pager status --short
  git --no-pager diff --stat
  git --no-pager diff --name-status
  git --no-pager diff --check
  git --no-pager diff --cached --stat
  git --no-pager diff --cached --name-status
  git --no-pager diff --cached --check
  pnpm -w exec tsc --noEmit

ثم إن وجدت guards في package.json:
  pnpm run guard:tamagui-import-boundary
  pnpm run guard:i18n-direction:mobile-control-panel

H) Acceptance Criteria
- لا يوجد import ميت جديد.
- لا توجد claims رقمية خاطئة.
- registry validation يثبت عدد entries والـ partner count الحقيقي.
- hidden compat له guard فعلي أو mapping يمنع فتحه primary.
- evidence يغطي tracked + staged + untracked.
- .gitattributes/tools plan artifacts إما accounted أو BLOCKED_REVIEW_REQUIRED.
- TypeScript يمر.
- diff check يمر tracked/staged.
- لا backend/API/dependency/lockfile touched.

الرد النهائي المطلوب:
- Decision: DONE / BLOCKED فقط، لا PASS ولا CLOSED ولا 100%.
- SESSION_ID
- changed source files
- evidence/artifact files
- registry entries count
- partner operational IDs count الحقيقي
- hidden compat count
- finance preview count
- route validation status summary
- staged/untracked accounting
- verification results
- zip path
- ما بقي بعد Phase 1.1
```
