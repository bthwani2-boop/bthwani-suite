# DSH Client R3 Fix Required — Split Copilot Execution Prompts

Repo:

```text
C:\bthwani-suite
```

استخدم هذه الأوامر بالترتيب داخل VS Code Copilot Chat. لا تنتقل من أمر إلى الذي بعده إلا إذا انتهى الأمر السابق بـ `PASS` أو `BLOCKED` موثق بأدلة. الهدف هو إغلاق R3 فقط، وليس فتح موجة هيكلة جديدة واسعة.

القواعد المشتركة لكل الأوامر:

```text
- لا backend/API/OpenAPI.
- لا dependencies جديدة.
- لا route semantics redesign.
- لا تغيير شكل الواجهات الحالي.
- لا تغيير data ids/order/labels/values/prices/media.
- لا Tamagui خارج ui-kit.
- لا export *.
- لا any/as any جديد.
- لا serviceId='core' أو ownerId='core'.
- لا full-file reformat.
- لا line-ending normalization.
- لا حذف نهائي؛ archive فقط عند dead/exact duplicate مثبت.
- لا تستخدم أو تذكر أي repo/path قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- لا تنقل ملكية wallet/payment/money من WLT إلى DSH.
- لا تعلن PASS بدون evidence رقمي.
```

---

## Prompt 1 — R3.0 Scope Truth Inventory

```text
نفّذ R3.0_DSH_CLIENT_SCOPE_TRUTH_INVENTORY فقط داخل C:\bthwani-suite.

الهدف:
بناء حقيقة رقمية دقيقة قبل أي تعديل إضافي. المطلوب تشخيص scoped source كامل، وتحديد blockers الحقيقية: stale classification, index exports, data inside screens, docs contradiction, WLT bridge sprawl, type export issues, serviceId core, static leaks, and untracked source files.

Allowed read/write scope:
- dsh/frontend/app-client/**
- wlt/frontend/app-client/dsh/**
- wlt/frontend/shared/finance/**
- app-client/composition/**
- app-client/shell/**
- dsh/frontend/shared/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**
- tools/registry/runs/** للأدلة فقط

Strict forbidden:
- لا تعدّل source files في هذه المرحلة إلا whitespace داخل النطاق إذا diff-check فشل.
- لا rename/move/delete/archive.
- لا docs edits خارج evidence.

Execution:
1) شغّل:
   git fetch origin
   git branch --show-current
   git rev-parse HEAD
   git rev-parse "origin/$(git branch --show-current)"
   git --no-pager status --short
   git --no-pager diff --name-status
   git --no-pager diff --check
   pnpm -w exec tsc --noEmit

2) إذا HEAD المحلي لا يساوي origin HEAD: توقف = BLOCKED_REMOTE_MISMATCH.
3) إذا توجد تعديلات محلية خارج النطاق: توقف = BLOCKED_UNEXPECTED_LOCAL_CHANGES.
4) إذا diff-check يفشل بسبب whitespace داخل النطاق فقط: أصلحه موضعيًا ثم أعد diff-check.
5) افحص product source فقط، واستبعد:
   node_modules, .next, .expo, .turbo, dist, build, coverage, tools/registry/runs, dsh/_archive.
6) أنشئ scoped inventory لكل ملف داخل النطاق، مع classification مبدئي:
   SCREEN_ENTRY, SCREEN_PART, PREVIEW_DATA, PREVIEW_STORE, TYPE_CONTRACT, ROUTE_REGISTRY,
   SCREEN_REGISTRY, SURFACE_ENTRY, INTEGRATION_BRIDGE, INTEGRATION_PART, INTEGRATION_ADAPTER,
   SHARED_HELPER, STYLE_MODULE, DOC, UNKNOWN_REQUIRES_REVIEW.
7) افحص blockers:
   - serviceId='core' أو ownerId='core'
   - export *
   - any/as any و React.ComponentType<any)
   - Tamagui outside ui-kit
   - deep imports بين app-client/app-partner/app-captain/app-field
   - old_visual_noise داخل primary scope
   - runtime_error_strings
   - preview data arrays داخل screens
   - dsh/docs/dsh-client-final-classification.csv contains missing paths
   - duplicate classification rows
   - scoped files missing from classification
   - docs/blueprint contradiction
   - WLT bridge file sprawl
   - invalid type re-exports in dsh-client.types.ts

Evidence:
أنشئ tools\registry\runs\R3_0_DSH_CLIENT_SCOPE_TRUTH_INVENTORY-YYYYMMDD-HHMMSS\ وضع:
- branch.txt
- head.txt
- origin-head.txt
- head-sync.txt
- git-status-short.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- scoped-files.csv
- preliminary-classification.csv
- blocker-inventory.json
- blocker-inventory.txt
- index-public-api-audit.txt
- preferences-screen-audit.txt
- wlt-bridge-audit.txt
- docs-consistency-audit.txt
- type-export-audit.txt
- classification-integrity-audit.txt
- UNTRACKED_FILES.txt
- R3_0_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

R3_0_REPORT.md يجب أن يحتوي:
- final verdict: PASS / FIX_REQUIRED / BLOCKED
- scoped files count
- unknown classification count
- stale classification paths count
- missing classification files count
- duplicate classification rows count
- serviceId core count
- export star count
- any/as any count
- Tamagui outside ui-kit count
- docs contradiction YES/NO
- WLT bridge sprawl YES/NO
- invalid type exports YES/NO
- diff-check result
- tsc result

PASS لهذه المرحلة يعني فقط: inventory صحيح ولا يوجد block يمنع التصحيح. لا يعني closure النهائي.
```

---

## Prompt 2 — R3.1 Preferences Data + Type Export Fix

```text
نفّذ R3.1_PREFERENCES_DATA_AND_TYPE_EXPORT_FIX فقط داخل C:\bthwani-suite.

Goal:
إغلاق مشكلتين محددتين:
1) PreferencesScreen لا يجب أن يحتوي preview/static rows داخل الشاشة.
2) dsh-client.types.ts لا يجب أن يعيد تصدير types غير موجودة أو مكسورة.

Allowed source scope:
- dsh/frontend/app-client/screens/PreferencesScreen.tsx
- dsh/frontend/app-client/data/preferences.preview-data.ts
- dsh/frontend/app-client/dsh-client.screen-registry.ts
- dsh/frontend/app-client/dsh-client.routes.ts
- dsh/frontend/app-client/dsh-client.types.ts
- dsh/frontend/app-client/contracts/**
- dsh/frontend/app-client/data/**
- tools/registry/runs/** للأدلة فقط

Strict forbidden:
- لا UI visual change.
- لا route semantics change.
- لا تغيير labels/values/order داخل preferenceCards.
- لا backend/API.
- لا WLT changes في هذه المرحلة.
- لا index.ts cleanup في هذه المرحلة.
- لا full-file reformat.
- لا export *.
- لا any/as any جديد.

Before edit:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Hard block:
- إذا HEAD المحلي لا يساوي origin HEAD: BLOCKED_REMOTE_MISMATCH.
- إذا توجد تعديلات خارج النطاق: BLOCKED_UNEXPECTED_LOCAL_CHANGES.

Execution A — Preferences data extraction:
1) افتح dsh/frontend/app-client/screens/PreferencesScreen.tsx.
2) إذا يحتوي preferenceCards أو arrays/static rows:
   - أنشئ dsh/frontend/app-client/data/preferences.preview-data.ts.
   - انقل preferenceCards إليه بدون تغيير labels/values/order.
   - أضف تعليق: UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
   - أضف contract باسم dshClientPreferencesPreviewDataContract:
     dataKind: 'UI_PREVIEW_ONLY'
     runtimeTruth: false
     backendSource: false
     bindingSource: false
     timezoneSemantics: 'not_applicable'
     moneySemantics: 'not_applicable'
   - PreferencesScreen يستورد preferenceCards من data file فقط.
   - لا تضف metadata داخل rows.
3) تأكد أن PreferencesScreen مسجلة في routes/registry بالقيم:
   screenId: client.dsh.preferences.delivery
   routeId: dsh-preferences
   flowId: dsh.preferences
   ownerKind: service
   ownerId: dsh
   serviceId: dsh

Execution B — type exports:
1) افتح dsh/frontend/app-client/dsh-client.types.ts.
2) افحص exports التالية وأي export آخر من contracts:
   DshClientOrderBindingSnapshot
   DshClientStoreBindingSnapshot
3) ابحث عن الاستخدام الحقيقي لهذه types في النطاق.
4) إذا النوع غير موجود في source contract:
   - إن كان هناك شكل واضح مطابق في contract، أضف type صحيحًا بدون fake runtime truth.
   - وإلا احذف/استبدل export إذا غير مستخدم.
   - إذا مستخدم، أصلح الاستيراد أو عرّف type minimal الصحيح من contract الموجود.
5) لا تترك broken type export.

Verification:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- PreferencesScreen contains no preferenceCards array
- preferences.preview-data.ts exists
- data contract exists
- serviceId core count = 0
- broken type export count = 0

Evidence:
أنشئ tools\registry\runs\R3_1_PREFERENCES_DATA_AND_TYPE_EXPORT_FIX-YYYYMMDD-HHMMSS\ وضع:
- branch.txt
- head.txt
- origin-head.txt
- git-status-short.txt
- git-diff-name-status.txt
- preferences-data-extraction.txt
- type-export-audit.txt
- git-diff-check.txt
- tsc-noemit.txt
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILES.txt
- R3_1_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

Do not declare PASS unless:
- PreferencesScreen no longer contains preview/static rows.
- preferences.preview-data.ts contains data contract.
- no labels/order/values changed.
- dsh-client.types.ts has no broken exports.
- diff-check PASS.
- tsc PASS.
```

---

## Prompt 3 — R3.2 DSH Client Public API Cleanup

```text
نفّذ R3.2_DSH_CLIENT_PUBLIC_API_CLEANUP فقط داخل C:\bthwani-suite.

Goal:
تنظيف dsh/frontend/app-client/index.ts بحيث يصبح public API مقصودًا ونظيفًا وليس barrel ضخمًا يصدّر كل screens/parts/data/contracts بلا ضرورة.

Allowed source scope:
- dsh/frontend/app-client/index.ts
- app-client/composition/**
- app-client/shell/**
- dsh/frontend/app-client/DshClientSurface.tsx
- dsh/frontend/app-client/dsh-client.routes.ts
- dsh/frontend/app-client/dsh-client.screen-registry.ts
- dsh/frontend/app-client/dsh-client.types.ts
- dsh/frontend/app-client/parts/ApprovedVideoReelsViewer.tsx
- tools/registry/runs/** للأدلة فقط

Strict forbidden:
- لا تعديل screens غير مذكورة.
- لا تعديل data files.
- لا WLT changes.
- لا route semantics change.
- لا UI changes.
- لا export *.
- لا any/as any جديد.
- لا full-file reformat.

Before edit:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Execution:
1) افتح dsh/frontend/app-client/index.ts.
2) ابنِ audit كامل لكل export حالي:
   - export name
   - source path
   - used by app-client/composition?
   - used by app-client/shell?
   - used by any other external surface?
   - internal only?
   - safe to remove?
   - compatibility required?
3) قلّص index.ts إلى public exports فقط:
   مسموح:
   - DshClientSurface
   - DshSurfaceHost alias فقط للتوافق المؤقت إذا composition/shell يعتمد عليه
   - DshClientSurfaceProps / DshSurfaceHostProps / DshCommandTarget / DshRoute
   - dshClientRoutes + route types
   - dshClientScreenRegistry + registry type
   - DshHomeApprovedVideoReelsViewer فقط إذا مستخدم خارجيًا
   - types العامة المطلوبة فعليًا من app-client/composition أو shell
4) ممنوع بقاء index.ts يصدّر:
   - كل screens
   - كل parts
   - كل data
   - preview-store internals
   - fixture data
   - private helpers
   إلا إذا يوجد usage خارجي حقيقي يفرض compatibility.
5) أي compatibility export يجب أن يكون موثقًا بتعليق قصير:
   Temporary compatibility export; remove after dependent surface imports are migrated.
6) لا تكسر imports الحالية.
7) لا تستخدم deep import بين apps.

Verification:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- export * count = 0
- direct screen exports from index.ts either 0 or justified compatibility list
- direct data exports from index.ts either 0 or justified compatibility list

Evidence:
أنشئ tools\registry\runs\R3_2_DSH_CLIENT_PUBLIC_API_CLEANUP-YYYYMMDD-HHMMSS\ وضع:
- branch.txt
- head.txt
- origin-head.txt
- git-status-short.txt
- git-diff-name-status.txt
- index-public-api-audit.csv
- compatibility-exports.txt
- removed-exports.txt
- git-diff-check.txt
- tsc-noemit.txt
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILES.txt
- R3_2_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

Do not declare PASS unless:
- index.ts is no longer a broad barrel.
- export * count = 0.
- tsc PASS.
- diff-check PASS.
- all compatibility exports documented.
```

---

## Prompt 4 — R3.3 WLT DSH Bridge Simplification

```text
نفّذ R3.3_WLT_DSH_BRIDGE_SIMPLIFICATION فقط داخل C:\bthwani-suite.

Goal:
إغلاق تشعب wlt/frontend/app-client/dsh بوصفه WLT-owned DSH integration bridge صغير وواضح، بدون نقل wallet/payment/money إلى DSH وبدون تغيير UI.

Allowed source scope:
- wlt/frontend/app-client/dsh/**
- wlt/frontend/shared/finance/**
- dsh/frontend/app-client/screens/CartScreen.tsx
- dsh/frontend/app-client/DshClientSurface.tsx
- dsh/frontend/app-client/dsh-client.screen-registry.ts
- dsh/frontend/app-client/dsh-client.routes.ts
- app-client/composition/**
- tools/registry/runs/** للأدلة فقط

Strict forbidden:
- لا نقل WLT bridge إلى DSH.
- لا نقل money semantics إلى DSH.
- لا UI visual change.
- لا route semantics change.
- لا backend/API.
- لا dependencies.
- لا export *.
- لا any/as any جديد.
- لا حذف نهائي بدون proving no refs.

Target preferred structure:
wlt/frontend/app-client/dsh/
├─ index.ts
├─ WltDshClientBridge.tsx
├─ wlt-dsh-client.parts.tsx
├─ wlt-dsh-client.adapter.ts
├─ wlt-dsh-client.contract.ts
├─ wlt-dsh-client.preview-data.ts
├─ wlt-dsh-client.types.ts
└─ useWltDshWalletPreview.ts

Before edit:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Execution:
1) Inventory all files under wlt/frontend/app-client/dsh/**.
2) Classify each file:
   BRIDGE_ENTRY, INTEGRATION_PART, INTEGRATION_ADAPTER, INTEGRATION_HOOK,
   PREVIEW_DATA, TYPE_CONTRACT, DEAD_UNREFERENCED, PENDING_MERGE_WITH_REASON.
3) Ensure wlt-dsh-client.contract.ts contains:
   dataKind: 'UI_PREVIEW_ONLY'
   runtimeTruth: false
   backendSource: false
   bindingSource: false
   moneySemantics: 'preview-only display values / not accounting source'
   ownerKind: 'integration'
   ownerId: 'wlt.dsh'
   serviceId: 'wlt'
   linkedServiceId: 'dsh'
   surfaceId: 'app-client'
4) If separate files exist:
   - WltDshBalancePreview.tsx
   - WltDshConnectorPanel.tsx
   - WltDshPaymentOption.tsx
   - WltDshPaymentOptionsRow.tsx
   - WltDshClientPaymentPreview.tsx
   - hooks/useWlt.ts
   Evaluate safe merge:
   - If simple and only used by WLT bridge, merge into wlt-dsh-client.parts.tsx.
   - If public/external, keep but export through index.ts and classify as INTEGRATION_PART_PUBLIC_COMPAT.
   - If hooks/useWlt.ts exists, rename/migrate to useWltDshWalletPreview.ts if safe.
5) Ensure DSH imports WLT through public bridge only. If not safe, document BLOCKED_DEEP_WLT_IMPORT.
6) index.ts must export public bridge API only. No export *.

Verification:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- WLT DSH serviceId = wlt
- linkedServiceId = dsh
- serviceId core count = 0
- export * count = 0
- moneySemantics present
- deep WLT ownership leakage into DSH count = 0 or documented blocker

Evidence:
أنشئ tools\registry\runs\R3_3_WLT_DSH_BRIDGE_SIMPLIFICATION-YYYYMMDD-HHMMSS\ وضع:
- branch.txt
- head.txt
- origin-head.txt
- git-status-short.txt
- git-diff-name-status.txt
- wlt-bridge-inventory.csv
- wlt-bridge-audit.txt
- wlt-bridge-merge-decisions.csv
- ownership-leakage-check.txt
- git-diff-check.txt
- tsc-noemit.txt
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILES.txt
- R3_3_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

Do not declare PASS unless:
- WLT bridge ownership is explicit.
- no serviceId core.
- contract is correct.
- index.ts has no export *.
- tsc PASS.
- diff-check PASS.
- any remaining separate bridge part is justified.
```

---

## Prompt 5 — R3.4 Classification + Docs Consistency

```text
نفّذ R3.4_CLASSIFICATION_AND_DOCS_CONSISTENCY فقط داخل C:\bthwani-suite.

Goal:
إعادة توليد classification من الحقيقة الحالية فقط، وإغلاق تناقض docs/blueprint. لا يجوز أن يقول أي doc CLOSED إذا gates لم تمر. لا يجوز أن يحتوي CSV على ملفات غير موجودة أو rows مكررة أو ملفات scoped missing.

Allowed source scope:
- dsh/docs/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/frontend/app-client/**
- wlt/frontend/app-client/dsh/**
- wlt/frontend/shared/finance/**
- app-client/composition/**
- app-client/shell/**
- dsh/frontend/shared/**
- tools/registry/runs/** للأدلة فقط

Strict forbidden:
- لا UI/source functional changes إلا docs/csv.
- لا rename/move.
- لا backend/API.
- لا export changes.
- لا route changes.
- لا full-file reformat.

Before edit:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Execution A — classification:
1) Generate source truth list from actual files only in scoped paths.
2) Exclude generated/cache/vendor/evidence/archive paths.
3) Recreate dsh/docs/dsh-client-final-classification.csv.
4) Required columns:
   path, layer, ownerKind, ownerId, serviceId, linkedServiceId, classification, status
5) Every scoped source file appears exactly once.
6) No path in CSV can point to missing file.
7) No duplicate path rows.
8) No stale rows for removed files.

Execution B — docs consistency:
1) Read:
   dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION.md
   dsh/docs/DSH_CLIENT_APP_SCOPE_STANDARDIZATION_RUNBOOK.md
   dsh/SERVICE_BLUEPRINT.md
2) Ensure all agree on status:
   - If gates passed in current evidence: CLOSED_WITH_EVIDENCE.
   - If tsc/diff/static not proven: FIX_REQUIRED or PASS_WITH_WARNINGS, not CLOSED.
3) Remove contradiction: doc says closed but blueprint says in progress = forbidden.
4) Keep docs focused on:
   - DSH app-client scope rings
   - no serviceId core
   - WLT-owned DSH bridge
   - PreferencesScreen policy
   - repeatable method for next services

Verification:
- classification paths not found = 0
- scoped files missing from classification = 0
- duplicate classification rows = 0
- docs contradiction = NO
- forbidden core service in docs/registry = 0
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit

Evidence:
أنشئ tools\registry\runs\R3_4_CLASSIFICATION_AND_DOCS_CONSISTENCY-YYYYMMDD-HHMMSS\ وضع:
- branch.txt
- head.txt
- origin-head.txt
- git-status-short.txt
- git-diff-name-status.txt
- scoped-source-truth.csv
- classification-integrity.json
- classification-integrity.txt
- docs-consistency-audit.txt
- git-diff-check.txt
- tsc-noemit.txt
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILES.txt
- R3_4_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

Do not declare PASS unless:
- stale classification paths = 0.
- missing scoped files = 0.
- duplicate classification rows = 0.
- docs/blueprint contradiction = NO.
- diff-check PASS.
- tsc PASS.
```

---

## Prompt 6 — R3.5 Final Closure Gate

```text
نفّذ R3.5_DSH_CLIENT_FINAL_CLOSURE_GATE فقط داخل C:\bthwani-suite.

Goal:
بوابة الإغلاق النهائي بعد R3.1/R3.2/R3.3/R3.4. لا تضف ميزات. لا تعمل refactor جديد. المطلوب فقط إثبات أن DSH app-client scope أصبح نظيفًا ومغلقًا بالأدلة.

Allowed scope:
- read/check:
  dsh/frontend/app-client/**
  wlt/frontend/app-client/dsh/**
  wlt/frontend/shared/finance/**
  app-client/composition/**
  app-client/shell/**
  dsh/frontend/shared/**
  dsh/SERVICE_BLUEPRINT.md
  dsh/docs/**
- write only evidence under tools/registry/runs/**
- allowed whitespace-only fix inside scope if diff-check fails only for whitespace

Strict forbidden:
- لا feature work.
- لا rename/move.
- لا index cleanup جديد إلا إذا gate يثبت blocker مباشر.
- لا docs rewrite جديد إلا إذا contradiction gate يفشل.
- لا UI change.
- لا backend/API.
- لا route semantics.

Before any verdict:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Hard block:
- If local HEAD != origin HEAD: BLOCKED_REMOTE_MISMATCH.
- If unexpected dirty files outside scope: BLOCKED_UNEXPECTED_LOCAL_CHANGES.
- If untracked source files exist and are not evidence/docs intentionally created: FIX_REQUIRED_UNTRACKED_SOURCE.

Closure checks:
1) Static gate:
   - serviceId core count = 0
   - ownerId core count = 0
   - export * count = 0
   - Tamagui outside ui-kit count = 0
   - any/as any in primary scope count = 0
   - deep imports between app-client/app-partner/app-captain/app-field count = 0
   - runtime error strings count = 0
   - preview data inside screens count = 0
   - stale classification paths count = 0
   - missing scoped files from classification count = 0
   - duplicate classification rows count = 0
   - docs/blueprint contradiction = NO
   - WLT money ownership leak into DSH = NO

2) Public API gate:
   - dsh/frontend/app-client/index.ts is not a broad barrel.
   - no export *.
   - compatibility exports are listed and justified.
   - DshClientSurface public.
   - DshSurfaceHost alias only if needed.
   - routes and registry public.
   - no broad data/fixture exports.

3) Preferences gate:
   - PreferencesScreen exists.
   - preferences.preview-data.ts exists.
   - PreferencesScreen imports preview data.
   - PreferencesScreen does not contain static rows.
   - routeId dsh-preferences exists.
   - screenId client.dsh.preferences.delivery exists.

4) WLT bridge gate:
   - wlt-dsh-client.contract.ts exists.
   - moneySemantics preview-only exists.
   - ownerKind integration, ownerId wlt.dsh, serviceId wlt, linkedServiceId dsh.
   - bridge index has no export *.
   - remaining separate parts either merged or justified.
   - DSH does not own wallet/money.

5) Runtime smoke:
   App-client:
   - If Metro can be run, run:
     pnpm --dir app-client/runtime exec expo start --dev-client --host lan --port 8081 --clear
     If 8081 busy, use 8085 and record.
   - Open Android if available.
   - Capture adb logcat.
   - Must not contain runtime fatal/default/property errors.

   Control-panel:
   - If running on 3000 or 3010, test:
     /, /operations, /finance, /support, /partners, /marketing
   - Must not contain build/runtime error strings.

Evidence:
أنشئ tools\registry\runs\R3_5_DSH_CLIENT_FINAL_CLOSURE_GATE-YYYYMMDD-HHMMSS\ وضع:
- branch.txt
- head.txt
- origin-head.txt
- head-sync.txt
- git-status-short.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- static-gate.json
- static-gate.txt
- public-api-gate.txt
- preferences-gate.txt
- wlt-bridge-gate.txt
- classification-integrity.json
- docs-consistency-gate.txt
- runtime-smoke.txt
- app-client-adb-logcat.txt if available
- control-panel-route-smoke.txt if available
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILES.txt
- R3_5_FINAL_CLOSURE_REPORT.md
- ZIP بنفس اسم مجلد الجلسة

R3_5_FINAL_CLOSURE_REPORT.md must contain:
- final verdict: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED
- diff-check PASS/FAIL
- tsc PASS/FAIL
- static gate PASS/FAIL
- public API gate PASS/FAIL
- preferences gate PASS/FAIL
- WLT bridge gate PASS/FAIL
- classification integrity PASS/FAIL
- docs consistency PASS/FAIL
- runtime smoke PASS/FAIL/SKIPPED_WITH_REASON
- UI changed: NO
- route semantics changed: NO
- backend/API changed: NO
- ready for commit/push: YES/NO

Do not declare PASS unless:
- diff-check PASS
- tsc PASS
- static gate PASS
- classification integrity PASS
- docs consistency PASS
- public API gate PASS
- preferences gate PASS
- WLT bridge gate PASS
- no unexpected untracked source
- runtime smoke PASS or explicitly SKIPPED_WITH_REASON without runtime errors in available logs
```

---

## Optional Commit Prompt — only after Prompt 6 returns PASS

```text
نفّذ commit/push آمن فقط إذا R3_5_DSH_CLIENT_FINAL_CLOSURE_GATE أعطى PASS.

Repo:
C:\bthwani-suite

Execution:
1) git --no-pager status --short
2) git --no-pager diff --check
3) pnpm -w exec tsc --noEmit
4) git add -A
5) git --no-pager diff --cached --check
6) pnpm -w exec tsc --noEmit
7) git commit -m "chore: close dsh client app scope"
8) git push origin (git branch --show-current)
9) git --no-pager status --short

Hard block:
- لا commit إذا diff-check fails.
- لا commit إذا tsc fails.
- لا commit إذا توجد untracked source files غير مقصودة.
- لا push إذا commit فشل.
```
