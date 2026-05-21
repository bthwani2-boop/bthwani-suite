# DSH Phase 5 Final Logic Closure Prompt

انسخ هذا الأمر إلى VS Code Copilot / agent داخل `C:\bthwani-suite`.

```text
نفّذ Phase 5 داخل C:\bthwani-suite كمرحلة إغلاق منطق DSH قبل مراجعة التصميم، بدون تسويف وبدون broad refactor عشوائي.

اسم المرحلة:
DSH_PHASE_5_FINAL_LOGIC_GOVERNANCE_AND_DEPENDENCY_CLOSURE

الهدف:
إغلاق منطق DSH من ناحية ownership / registry / governance / routing / on-demand / عدم التكرار / عدم التناقض عبر:
- app-client
- app-partner
- app-captain
- app-field
- control-panel
- WLT reference عند الأثر المالي

هذه المرحلة ليست مراجعة تصميم ولا redesign. التصميم والـ screenshots التفصيلية ستأتي لاحقًا. المطلوب الآن إغلاق المنطق والاستدعاء ومنع التكرار والتسرب والتناقض.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المظلة إلزامية:
BThwani منظومة واحدة متعددة الأسطح. لا يجوز أن يستورد أي mobile surface من control-panel internals. البيانات المشتركة التي تحتاجها الموبايل ولوحة التحكم يجب أن تكون في dsh/frontend/shared أو owner مشترك مناسب.

ممنوع:
- ممنوع backend/API/database/runtime mutation.
- ممنوع dependency/lockfile changes.
- ممنوع import Tamagui خارج @bthwani/ui-kit.
- ممنوع إنشاء design system محلي.
- ممنوع hardcoded colors.
- ممنوع finance mutation من DSH.
- ممنوع إظهار hidden-compat/internal/disabled كـ primary.
- ممنوع جعل control-panel نسخة من الموبايل.
- ممنوع جعل mobile يملك policies/approvals/finance/catalog governance.
- ممنوع حذف ملفات أو نقل كبير بدون دليل.
- ممنوع استخدام أو ذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- ممنوع claim PASS/CLOSED/100% بدون evidence.

توجب الالتزام بنظام الألوان المركزي.
تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر ضمن نطاق DSH فقط.

CHECK قبل APPLY:
1) افحص:
- dsh/frontend/shared/dsh-flow-registry.ts
- dsh/frontend/shared/index.ts
- dsh/frontend/control-panel/shared/dsh-control-panel-governance.map.ts
- dsh/frontend/control-panel/shared/index.ts
- dsh/frontend/app-client/**
- dsh/frontend/app-partner/**
- dsh/frontend/app-captain/**
- dsh/frontend/app-field/**
- dsh/frontend/control-panel/**
- control-panel/runtime/app/**
- wlt/frontend/** فقط reference عند financialImpact

2) استخرج قبل التعديل:
- كل import من app-client/app-partner/app-captain/app-field إلى dsh/frontend/control-panel/**.
- كل governance helper مستخدم في mobile.
- كل registry/governance helper مستخدم في control-panel.
- كل root page في control-panel runtime.
- كل section في control-panel governance map.
- كل route/screen مرتبط بـ DSH.
- كل TBD/placeholder/legacy/deprecated له أثر منطقي حقيقي.

3) قبل APPLY اطبع خطة قصيرة:
- files to modify
- why each file is necessary
- imports to replace
- files forbidden
- expected evidence

APPLY المطلوب:

A) نقل ownership المشترك إلى shared
- أنشئ أو استخدم ملفًا مشتركًا مناسبًا داخل:
  dsh/frontend/shared/dsh-governance.map.ts
  أو اسم قريب من نمط المشروع.
- انقل/استخرج منه منطق governance العام المستخدم عبر الموبايل ولوحة التحكم:
  - DSH_CONTROL_PANEL_SECTION_IDS
  - DshControlPanelSectionId
  - DshControlPanelGovernanceEntry
  - DSH_CONTROL_PANEL_GOVERNANCE_MAP
  - DSH_CONTROL_PANEL_GOVERNANCE_LIST
  - getDshControlPanelGovernanceEntry
  - getDshControlPanelGovernanceEntries
  - findDshControlPanelGovernanceSectionByFlowId
  - getDshControlPanelGovernanceSectionsForSurface
  - resolveDshControlPanelSectionLabel
- لا تضف React ولا UI ولا side effects ولا backend.
- أبقِ الملف pure data/types/helpers فقط.

B) compatibility exports
- حدّث dsh/frontend/shared/index.ts ليصدر governance map/helpers من shared.
- حدّث dsh/frontend/control-panel/shared/index.ts ليعيد التصدير من shared فقط، حتى لا تنكسر imports الموجودة داخل control-panel.
- لا تجعل mobile يستورد من control-panel/shared بعد الآن.

C) remove mobile -> control-panel dependency leakage
استبدل كل imports التالية في mobile surfaces:
- app-client
- app-partner
- app-captain
- app-field
من:
  ../../control-panel/shared
إلى:
  ../../shared أو المسار الصحيح للـ shared governance owner.

Acceptance في هذا البند:
- grep لا يجد أي import من dsh/frontend/app-* إلى dsh/frontend/control-panel/**.
- لا يوجد import نسبي يحتوي `control-panel/shared` داخل app-client/app-partner/app-captain/app-field.

D) final logic route/screen matrix
أنشئ evidence يثبت:
- كل mobile surface والـ screens التي تمس DSH.
- كل control-panel section root page.
- كل governance section.
- كل registry flow مهم وربطه بالمالك.
- كل finance-preview flow وأنه read-only/reference.
- كل hidden-compat/internal وأنه غير primary.
- كل section owner:
  operations, support, finance, catalogs, partners, marketing, platform, administration.

E) no design work
- لا تغيّر الشكل إلا لتصحيح import/logic labels ضرورية.
- لا تضف screens كبيرة جديدة.
- لا redesign.
- لا screenshots إلزامية لهذه المرحلة إلا checklist فقط؛ التصميم سيأتي لاحقًا.

F) cleanup محدود
- أزل imports ميتة بعد النقل.
- أزل duplicate local owner labels إذا صار shared governance يوفرها.
- لا تحذف ملفات legacy مثل control-panel/control إلا إذا ثبت أنها غير مستخدمة وآمنة، وغالبًا اكتفِ بتصنيفها في evidence كـ legacy/not-mounted.

Evidence:
أنشئ:
SESSION_ID = DSH_PHASE_5_FINAL_LOGIC_CLOSURE-YYYYMMDD-HHMMSS

داخل:
tools/registry/runs/{SESSION_ID}/

أنتج:
- SUMMARY.md
- changed-files.txt
- shared-governance-move.csv
- mobile-control-panel-import-before.csv
- mobile-control-panel-import-after.csv
- final-dsh-route-screen-matrix.csv
- final-section-governance-matrix.csv
- final-flow-owner-matrix.csv
- final-on-demand-matrix.csv
- final-hidden-compat-check.csv
- final-finance-safety-check.csv
- final-control-panel-root-pages.csv
- legacy-not-mounted-classification.csv
- duplicate-noise-cleanup.csv
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- guard-tamagui-import-boundary.txt
- guard-i18n-direction-mobile-control-panel.txt
- LOCAL_CHANGE_REVIEW.patch
- LOCAL_CHANGE_UNTRACKED_FILES.txt
- {SESSION_ID}.zip

Verification commands:
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel

Mandatory custom checks:
- grep/app scan must prove 0 mobile imports from control-panel/shared.
- grep/app scan must prove 0 app-* imports from dsh/frontend/control-panel/**.
- registry validation summary must be valid.
- governance sections count must be 8.
- runtime root pages for operations/support/finance/catalogs/partners/marketing/platform/administration must exist.

Acceptance criteria:
1) governance shared owner exists outside control-panel internals.
2) mobile surfaces import governance only from shared owner.
3) control-panel remains able to re-export/use governance.
4) no mobile → control-panel dependency leakage.
5) all four mobile apps remain linked to correct owners.
6) all important control-panel sections remain represented.
7) no hidden-compat/internal/disabled primary rendering.
8) finance-preview remains read-only/reference-only.
9) no backend/API/database/runtime mutation.
10) no dependency/lockfile changes.
11) TypeScript passes.
12) guards pass.
13) diff check passes.
14) evidence zip exists with exact name {SESSION_ID}.zip.
15) final report states either LOGIC_READY_FOR_VISUAL_REVIEW or FIX_REQUIRED.

الرد النهائي المطلوب:
- Decision: LOGIC_READY_FOR_VISUAL_REVIEW / FIX_REQUIRED / BLOCKED فقط.
- SESSION_ID
- changed files
- mobile-control-panel imports before/after
- governance owner before/after
- sections covered
- route/screen matrix status
- hidden-compat result
- finance safety result
- on-demand result
- verification results
- zip path
- لا تقل CLOSED/100% إلا إذا كل الأدلة أعلاه مطابقة.
```
