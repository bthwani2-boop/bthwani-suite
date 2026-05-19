# BThwani — React Compiler Readiness Closure Command

**Purpose:** أمر تنفيذ موحد لإغلاق React Compiler readiness في `bthwani-suite` تدريجيًا وبالأدلة.
**Target repo:** `C:\bthwani-suite`
**Target branch:** `ghb/0161-20260519-054426-dsh`
**Delivery:** انسخ محتوى قسم **VS Code / Copilot Command** كاملًا وضعه في VS Code Copilot Chat.
**Rule:** لا يوجد ادعاء `PASS / CLOSED / 100%` بدون Evidence Pack ومرور البوابات النهائية.

---

## VS Code / Copilot Command

```text
نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاقه بالأدلة، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.

المهمة:
إغلاق ملف React Compiler readiness بالكامل وبشكل تدريجي على الفرع الحالي `ghb/0161-20260519-054426-dsh` داخل الريبو الحالي فقط:
C:\bthwani-suite

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

السياق المثبت:
- React Compiler مفعّل في Next عبر `reactCompiler: true` في:
  - control-panel/runtime/next.config.mjs
  - webapp/runtime/next.config.mjs
  - website/runtime/next.config.mjs
- React Compiler مفعّل في Expo عبر `expo.experiments.reactCompiler = true` في:
  - app-client/runtime/app.json
  - app-partner/runtime/app.json
  - app-captain/runtime/app.json
  - app-field/runtime/app.json
- root package.json يحتوي:
  - babel-plugin-react-compiler
  - eslint-plugin-react-compiler
- eslint.config.mjs يحتوي rule:
  - react-compiler/react-compiler

الهدف النهائي:
تثبيت إضافة React Compiler بشكل صحيح، إزالة أي ضجيج/ملفات evidence دخلت الريبو بالخطأ، تصحيح أي تعليق أو إعداد غير دقيق، تشغيل كل بوابات التحقق، جمع وتحليل كل تحذيرات React Compiler، ثم تصحيح كل الملفات ذات العلاقة تدريجيًا حتى لا يبقى أي blocker أو warning مؤثر مرتبط بـ React Compiler readiness في web أو mobile أو packages أو surfaces أو ui-kit consumers.

ممنوع:
- لا تحذف React Compiler.
- لا تعطل `reactCompiler: true`.
- لا تضف `react-compiler-runtime` عشوائيًا.
- لا تغيّر dependencies أو lockfile إلا إذا ثبت blocker حقيقي، وتوقف قبل ذلك وعلّم BLOCKED.
- لا تعمل حذف جماعي لـ useMemo / useCallback / React.memo / memo.
- لا تعمل refactor واسع غير مطلوب.
- لا تلمس ملفات غير مرتبطة.
- لا تنشئ design system محلي.
- لا تستورد Tamagui مباشرة داخل screens/surfaces/apps.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- لا تدّعي PASS / CLOSED / 100% بدون أدلة تشغيل فعلية.
- لا تترك evidence/output files في root.
- لا تستخدم `_HANDOFF.zip`؛ يجب تسمية ZIP بنفس اسم SESSION_ID.

قواعد BThwani الإلزامية:
- تعامل مع BThwani كمنظومة واحدة متعددة الأسطح، وليس كتطبيق منفصل.
- افحص تأثير React Compiler على web + mobile + packages + surfaces + ui-kit consumers.
- Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only.
- توجب الالتزام بنظام الألوان المركزي عند لمس أي UI.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- أي reusable/repeatable UI أو pattern يجب أن يبقى في @bthwani/ui-kit ولا يُكرر محليًا.
- لا تضخم @bthwani/ui-kit ولا تضف ملفات UI-kit جديدة إلا إذا ثبتت ضرورة غير قابلة للتفاوض، وعندها توقف وعلّم BLOCKED قبل الإضافة.

طريقة التنفيذ:
نفّذ على مراحل صغيرة. لا تنتقل من مرحلة إلى التالية إذا فشلت البوابة الحالية. أصلح السبب الجذري فقط، ثم أعد تشغيل البوابة. أي فشل غير قابل للإصلاح ضمن النطاق الحالي يجب أن ينتهي بـ BLOCKED مع دليل واضح.

PHASE 0 — Snapshot / Scope Gate
1. شغّل:
   - git branch --show-current
   - git --no-pager status --short
   - git --no-pager diff --check
2. إذا ظهرت تغييرات محلية غير مرتبطة، توقف وعلّم BLOCKED.
3. حدّد فقط الملفات المرتبطة بـ React Compiler:
   - package.json
   - pnpm-lock.yaml إن تغيّر سابقًا أو احتاج تحقق
   - eslint.config.mjs
   - next.config.mjs لكل web/control-panel/website
   - app.json لكل تطبيق Expo
   - ملفات TS/TSX التي تظهر في warnings/failures من lint/build/typecheck فقط
4. لا تلمس أي ملف خارج هذه القائمة إلا إذا أثبتت الأدلة أنه سبب مباشر لفشل React Compiler readiness.

PHASE 1 — Noise Cleanup Gate
1. تحقق هل هذه الملفات tracked داخل Git:
   - LOCAL_CHANGE_REVIEW.patch
   - LOCAL_CHANGE_UNTRACKED_FILES.txt
   - LOCAL_CHANGE_STATUS.txt
   - LOCAL_CHANGE_DIFF_STAT.txt
   - LOCAL_CHANGE_NAME_STATUS.txt
   - LOCAL_CHANGE_DIFF_CHECK.txt
   - surfaces_tsc_output.txt
   - أي ملف output/evidence مؤقت مشابه في root
2. إذا كانت موجودة ومتعقبة وهي ملفات evidence/output وليست source، احذفها من Git فقط.
3. لا تحذف أي ملف آخر.
4. أعد تشغيل:
   - git --no-pager status --short
   - git --no-pager diff --name-status
   - git --no-pager diff --check

PHASE 2 — Config Accuracy Gate
1. راجع React Compiler config في:
   - control-panel/runtime/next.config.mjs
   - webapp/runtime/next.config.mjs
   - website/runtime/next.config.mjs
   - app-client/runtime/app.json
   - app-partner/runtime/app.json
   - app-captain/runtime/app.json
   - app-field/runtime/app.json
2. لا تغيّر القيم إذا كانت صحيحة.
3. في eslint.config.mjs:
   - أبقِ rule: "react-compiler/react-compiler": "warn"
   - إذا كان التعليق يقول إن runtime compiler غير مفعل، صححه إلى:
     // React Compiler readiness gate; compiler is enabled in Next/Expo surface configs.
4. لا تحوّل warning إلى error في هذه المرحلة.

PHASE 3 — Baseline Verification Gate
شغّل هذه الأوامر بالترتيب وسجّل النتيجة داخل evidence لاحقًا:
- pnpm -w exec tsc --noEmit
- pnpm run lint:workspace
- pnpm --dir control-panel/runtime build
- pnpm --dir webapp/runtime build
- pnpm --dir website/runtime build
- pnpm --dir app-client/runtime exec expo config --json
- pnpm --dir app-partner/runtime exec expo config --json
- pnpm --dir app-captain/runtime exec expo config --json
- pnpm --dir app-field/runtime exec expo config --json

PHASE 4 — React Compiler Findings Classification
إذا ظهرت warnings/errors، صنّف كل finding حسب النوع:
- Render side effect
- Mutation داخل render
- Hook misuse
- Unstable dependency
- Next client/server boundary
- UI-kit/Tamagui ownership violation
- Manual memo noise غير مؤثر

لا تصلح manual memo noise الآن إلا إذا كان مرتبطًا بفشل حقيقي.

PHASE 5 — P0 Fixes Only
صحح كل P0 blocker في كل الملفات ذات العلاقة:
- hooks violations
- mutation أثناء render
- side effects داخل render
- client/server boundary errors
- imports/exports التي تكسر build
- React Compiler warnings المؤثرة التي تمنع readiness

نفّذ التصحيح تدريجيًا:
ملف واحد أو مجموعة صغيرة مرتبطة → تحقق → ثم انتقل للذي بعده.

بعد كل دفعة صغيرة شغّل الأقل:
- pnpm -w exec tsc --noEmit
- pnpm run lint:workspace
- git --no-pager diff --check

PHASE 6 — P1 Fixes
بعد إغلاق P0 فقط، صحح P1:
- unstable object/function creation إذا كان يؤثر على compiler أو lint
- props mutation
- shared arrays/objects mutation
- UI-kit consumer patterns التي تسبب compiler warning
- أي تضارب مع boundary:
  Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only

لا تغيّر الشكل البصري إلا إذا كان التغيير ضروريًا لمنع كسر أو warning. إذا لمست UI، حافظ على RTL correctness ونظام الألوان المركزي.

PHASE 7 — P2 Review without Broad Apply
راجع فقط:
- useMemo
- useCallback
- React.memo
- memo
- large files
- heavy imports

لا تحذفها جماعيًا. اكتب قائمة مختصرة بما يمكن تنظيفه لاحقًا، لكن لا تنفذ P2 cleanup إلا إذا كان مرتبطًا بفشل حالي مثبت.

PHASE 8 — Full React Compiler Inventory Gate
قبل أي ادعاء إغلاق، نفّذ inventory كامل واكتب نتائجه في evidence.

1. ابحث في الريبو كاملًا عن:
   - reactCompiler
   - babel-plugin-react-compiler
   - eslint-plugin-react-compiler
   - react-compiler/react-compiler
   - react-compiler-runtime
   - "use memo"
   - "use no memo"
   - babel.config
   - next.config
   - expo.experiments
   - React.memo
   - useMemo
   - useCallback

2. صنّف النتائج:
   - Config فعلي
   - Dependency فعلي
   - ESLint readiness
   - Memoization موجود لكنه غير مؤثر
   - Opt-in / opt-out directive
   - Suspicious / يحتاج تصحيح
   - Noise/output/evidence لا يجب أن يكون داخل Git

3. لا تعدّل useMemo/useCallback/React.memo إلا إذا ظهر فشل مثبت مرتبط بها.

PHASE 9 — Lockfile / Dependency Consistency Gate
تحقق من أن package.json و pnpm-lock.yaml متطابقان منطقيًا.

1. شغّل:
   - pnpm why babel-plugin-react-compiler
   - pnpm why eslint-plugin-react-compiler
   - pnpm why react
   - pnpm why react-dom
   - pnpm why react-native

2. تحقق أن:
   - React version موحد حسب overrides.
   - لا توجد React 18 family غير مفسرة.
   - لا يوجد react-compiler-runtime إلا إذا كان مطلوبًا بدليل.
   - لا يوجد duplicate compiler package versions غير مفسرة.

3. إذا احتاج pnpm-lock.yaml تغييرًا:
   - لا تغيّره تلقائيًا إلا إذا كان lockfile غير متطابق فعليًا.
   - إن تغيّر، سجّل السبب واعتبره HIGH-RISK gate.

PHASE 10 — Mobile Bundling Gate
لا يكفي expo config لإغلاق mobile. يجب إثبات أن bundling يمر لكل تطبيق Expo.

شغّل bundle/export smoke لكل سطح mobile، واكتب المخرجات داخل evidence folder فقط، وليس في root:

- app-client
- app-partner
- app-captain
- app-field

استخدم expo export أو أقرب أمر bundling آمن متاح في package scripts، بدون EAS وبدون native rebuild، إلا إذا ثبتت ضرورة native build.

إذا كان الأمر ثقيلًا أو غير مدعوم في أحد التطبيقات:
- لا تتجاهله.
- اكتب BLOCKED مع السبب الدقيق.
- اذكر الأمر الذي فشل ومخرجه.
- لا تدّعي إغلاق mobile 100% بدون bundle/build smoke أو سبب BLOCKED مثبت.

PHASE 11 — Web Runtime Build Gate
بالإضافة إلى build الحالي، تحقق أن React Compiler فعليًا لا يكسر:
- control-panel
- webapp
- website

لكل سطح:
1. شغّل build.
2. افحص logs لأي React Compiler warning/error.
3. افحص Next client/server boundary errors.
4. افحص أي dynamic/server/client misuse.
5. لا تصلح boundary بشكل سطحي؛ أصلح السبب الجذري فقط.

PHASE 12 — Root Evidence/Noise Prevention Gate
ممنوع ترك ملفات evidence/output في root.

تحقق من:
- LOCAL_CHANGE_REVIEW.patch
- LOCAL_CHANGE_UNTRACKED_FILES.txt
- LOCAL_CHANGE_STATUS.txt
- LOCAL_CHANGE_DIFF_STAT.txt
- LOCAL_CHANGE_NAME_STATUS.txt
- LOCAL_CHANGE_DIFF_CHECK.txt
- surfaces_tsc_output.txt
- أي ملف output مؤقت مشابه

إذا كانت tracked:
- احذفها من Git إذا ثبت أنها evidence/output وليست source.

إذا كانت untracked:
- لا تضفها للcommit.
- انقل evidence إلى tools/registry/runs/{SESSION_ID}/ فقط.

تحقق من .gitignore:
- إذا كان لا يمنع LOCAL_CHANGE_* من الدخول مجددًا، أضف rule محدودًا وواضحًا فقط:
  LOCAL_CHANGE_*
- لا تضف ignore واسع يخفي ملفات source.
- لا تعدّل .gitignore إلا إذا ثبتت الحاجة.

PHASE 13 — Evidence Pack Gate
أنشئ مجلد evidence موحد:

tools/registry/runs/REACT_COMPILER_READINESS-YYYYMMDD-HHMMSS/

واكتب داخله:

- SUMMARY.md
- evidence.json
- git-branch.txt
- git-status-before.txt
- git-status-after.txt
- git-diff-name-status.txt
- git-diff-stat.txt
- git-diff-check.txt
- react-compiler-inventory.txt
- dependency-why.txt
- tsc-noemit.txt
- lint-workspace.txt
- build-control-panel.txt
- build-webapp.txt
- build-website.txt
- expo-config-app-client.txt
- expo-config-app-partner.txt
- expo-config-app-captain.txt
- expo-config-app-field.txt
- mobile-bundle-app-client.txt
- mobile-bundle-app-partner.txt
- mobile-bundle-app-captain.txt
- mobile-bundle-app-field.txt
- remaining-warnings.md
- changed-files-rationale.md

ثم اضغط نفس مجلد الجلسة إلى:
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip

لا تستخدم _HANDOFF.zip.

PHASE 14 — CI / Workflow Awareness Gate
افحص هل توجد GitHub Actions أو workflows مرتبطة بـ lint/build/typecheck.

إذا وجدت:
- لا تعدّلها.
- فقط سجّل هل React Compiler addition يحتاج تحديث CI.
- إذا كانت CI لا تشغّل lint/build المطلوب، اكتب توصية فقط ولا تغيّر workflow إلا بطلب صريح.

إذا لم توجد:
- سجّل NO_CI_WORKFLOW_FOUND في evidence.

PHASE 15 — Final Verification Gates
لا تعتبر المهمة منتهية حتى تمر هذه البوابات:

- git --no-pager status --short
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- pnpm run lint:workspace
- pnpm --dir control-panel/runtime build
- pnpm --dir webapp/runtime build
- pnpm --dir website/runtime build
- pnpm --dir app-client/runtime exec expo config --json
- pnpm --dir app-partner/runtime exec expo config --json
- pnpm --dir app-captain/runtime exec expo config --json
- pnpm --dir app-field/runtime exec expo config --json
- mobile bundle/export smoke لكل app-client/app-partner/app-captain/app-field أو BLOCKED مثبت لكل تطبيق لم يمر.

PHASE 16 — Final Definition of Done
لا تستخدم PASS أو CLOSED أو 100% إلا إذا تحقق كل التالي:

1. لا توجد ملفات evidence/output متتبعة داخل root.
2. React Compiler config موجود وصحيح في كل web/mobile surfaces.
3. eslint.config.mjs تعليقه صحيح ولا يحتوي معلومة مضللة.
4. package.json و pnpm-lock متسقان.
5. pnpm why لا يكشف duplicate/invalid React/compiler dependency غير مفسر.
6. tsc يمر.
7. lint يمر بدون React Compiler warning غير مصنف أو غير معالج.
8. web builds تمر:
   - control-panel
   - webapp
   - website
9. Expo config يمر:
   - app-client
   - app-partner
   - app-captain
   - app-field
10. mobile bundle/export smoke يمر أو يوجد BLOCKED مفسر بدليل لكل تطبيق لم يمر.
11. كل P0/P1 React Compiler findings مغلقة أو مصنفة بدليل.
12. لا يوجد تعديل UI غير ضروري.
13. لا يوجد Tamagui import boundary violation جديد.
14. لا يوجد تغيير dependency/config غير مبرر.
15. evidence pack موجود ومضغوط باسم {SESSION_ID}.zip.

إذا فشل أي بند:
- القرار النهائي FIX_REQUIRED أو BLOCKED.
- اذكر البند الفاشل.
- لا تدّعي الإغلاق النهائي.

PHASE 17 — Final Output Format
أعطني النتيجة بهذا الشكل فقط:

Decision:
PASS / FIX_REQUIRED / BLOCKED

React Compiler Closure:
- Web: PASS / FAIL / BLOCKED
- Mobile config: PASS / FAIL / BLOCKED
- Mobile bundle: PASS / FAIL / BLOCKED
- ESLint readiness: PASS / FAIL / BLOCKED
- TypeScript: PASS / FAIL / BLOCKED
- Dependencies/lockfile: PASS / FAIL / BLOCKED
- Evidence/noise cleanup: PASS / FAIL / BLOCKED
- CI/workflow awareness: PASS / FAIL / BLOCKED

Changed files:
- path: reason

Deleted noise/evidence files:
- path: reason

Warnings before:
- number

Warnings after:
- number

Remaining warnings:
- none / list with path + reason

Evidence:
- evidence folder path
- zip path

Do not claim 100% if any item above is FAIL or BLOCKED.
```

---

## Local Evidence Export After Copilot Finishes

بعد انتهاء Copilot، شغّل هذا في PowerShell فقط إذا احتجت Patch Review من ChatGPT. لا تضف ملفات `LOCAL_CHANGE_*` للـ commit.

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check

pnpm -w exec tsc --noEmit
pnpm run lint:workspace

git --no-pager diff -- . > ".\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > ".\LOCAL_CHANGE_UNTRACKED_FILES.txt"
```

إذا ظهرت ملفات `??` في `git status`، لا تعمل commit قبل مراجعتها. ارفع `LOCAL_CHANGE_REVIEW.patch` ومخرجات الأوامر هنا للمراجعة قبل الكومِت.

---

## Acceptance Rule

هذا الأمر لا يعني أن الإغلاق النهائي مضمون بالكلام. الإغلاق النهائي يتحقق فقط إذا أعاد الوكيل:

```text
Decision: PASS
```

ومعه Evidence Pack كامل، وكل أسطر React Compiler Closure = `PASS`، ولا يوجد أي `FAIL` أو `BLOCKED`.
