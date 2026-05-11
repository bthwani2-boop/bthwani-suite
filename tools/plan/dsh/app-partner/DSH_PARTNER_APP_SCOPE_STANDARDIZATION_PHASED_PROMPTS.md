# DSH Partner App-Scope Standardization — Phased Copilot Prompts

Repo:

```text
C:\bthwani-suite
```

Execute these prompts sequentially in VS Code Copilot Chat.
Do not start the next phase until the current phase returns `PASS` or a documented `BLOCKED` with evidence.

Global rules for every phase:

```text
- Scope is DSH partner only, not app-client and not captain.
- No ARB inside dsh/frontend/app-partner.
- No wallet/finance ownership inside DSH. WLT owns wallet/balance/settlements/payouts/commission/money semantics.
- No backend/API/OpenAPI.
- No dependencies.
- No route semantics redesign.
- Preserve current UI appearance.
- No Tamagui outside @bthwani/ui-kit.
- No export *.
- No any/as any.
- No serviceId='core'.
- No full-file reformat.
- No line-ending normalization.
- No final delete; archive only if dead/unreferenced is proven.
- No old repo/path named bth; only C:\bthwani-suite.
- Produce evidence under tools/registry/runs/<SESSION_ID>.
```

---

## Phase P0 — Partner Truth Inventory

```text
نفّذ DSH_PARTNER_P0_TRUTH_INVENTORY فقط داخل C:\bthwani-suite.

Goal:
بناء حقيقة رقمية كاملة لتطبيق الشريك DSH فقط قبل أي نقل أو دمج. لا تعدّل source إلا whitespace-only إذا diff-check يفشل داخل النطاق.

Allowed scope:
- dsh/frontend/app-partner/**
- wlt/frontend/app-partner/dsh/**
- wlt/frontend/shared/finance/**
- app-partner/composition/**
- app-partner/shell/**
- app-partner/runtime/** للتحقق فقط
- dsh/frontend/shared/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**
- tools/registry/runs/** للأدلة

Execution:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Hard blocks:
- إذا HEAD المحلي لا يساوي origin HEAD: BLOCKED_REMOTE_MISMATCH.
- إذا توجد تعديلات خارج النطاق: BLOCKED_UNEXPECTED_LOCAL_CHANGES.
- إذا diff-check يفشل بسبب whitespace داخل النطاق فقط، أصلحه موضعيًا ثم أعد.

Inventory:
افحص كل الملفات داخل النطاق واستبعد:
node_modules, .next, .expo, .turbo, dist, build, coverage, tools/registry/runs, dsh/_archive.

صنف كل ملف:
SURFACE_ENTRY, SCREEN_ENTRY, SCREEN_PART, PREVIEW_DATA, PREVIEW_STORE, TYPE_CONTRACT, ROUTE_REGISTRY, SCREEN_REGISTRY, WLT_INTEGRATION_BRIDGE, WLT_INTEGRATION_PART, WLT_INTEGRATION_ADAPTER, SHARED_HELPER, STYLE_MODULE, PLACEHOLDER_COMPAT, WLT_OWNERSHIP_LEAK_REVIEW, ARB_LEAK_REVIEW, UNKNOWN_REQUIRES_REVIEW.

Checks:
- export_star count
- any/as any count
- Tamagui outside ui-kit count
- serviceId core count
- ARB references inside DSH partner count
- DSH-owned wallet/finance count
- placeholder screens count
- index barrel exports count
- missing routes/registry count
- preview data without contract count
- static data inside surface/shell count
- WLT bridge files count
- untracked source files count

Evidence:
Create tools\registry\runs\DSH_PARTNER_P0_TRUTH_INVENTORY-YYYYMMDD-HHMMSS\ with:
branch.txt, head.txt, origin-head.txt, git-status-short.txt, git-diff-name-status.txt, git-diff-check.txt, tsc-noemit.txt, scoped-files.csv, preliminary-classification.csv, blocker-inventory.json, blocker-inventory.txt, index-audit.txt, composition-shell-audit.txt, placeholder-compat-audit.txt, wlt-partner-bridge-audit.txt, finance-ownership-audit.txt, UNTRACKED_FILES.txt, P0_REPORT.md, ZIP بنفس اسم مجلد الجلسة.

PASS means inventory is complete only. It does not mean final closure.
```

---

## Phase P1 — Data Contracts + Finance Ownership

```text
نفّذ DSH_PARTNER_P1_DATA_CONTRACT_FINANCE_OWNERSHIP فقط داخل C:\bthwani-suite.

Goal:
إغلاق فجوات data contract وبدء تصحيح ملكية المال للشريك DSH. WLT يملك wallet/finance، وDSH لا يملك شاشة Wallet/Finance مستقلة.

Allowed scope:
- dsh/frontend/app-partner/**/*.ts
- dsh/frontend/app-partner/**/*.tsx فقط للملفات المالية/preview المعنية
- wlt/frontend/app-partner/dsh/**
- wlt/frontend/shared/finance/**
- dsh/docs/**
- tools/registry/runs/** للأدلة

Forbidden:
- لا redesign.
- لا route semantics.
- لا نقل واسع للشاشات.
- لا حذف نهائي.
- لا تغيير قيم مالية أو labels.
- لا backend/API.

Execution:
1) Preflight git + diff-check + tsc.
2) أضف data contracts لكل preview-data في app-partner إذا ناقصة:
   dataKind='UI_PREVIEW_ONLY'
   runtimeTruth=false
   backendSource=false
   bindingSource=false
   timezoneSemantics حسب وجود الوقت
   moneySemantics='preview-only display values / not accounting source' للملفات المالية
3) افحص:
   parts/PartnerWalletPreview.tsx
   parts/PartnerFinanceBridgePanel.tsx
   data/partnerFinancePreviewData.ts
   أي settlement/commission/balance/payout في DSH.
4) إذا الملف DSH-owned ويعرض wallet/balance/settlement:
   - لا تغير UI.
   - صنفه WLT_OWNERSHIP_LEAK_REVIEW.
   - حضّر public bridge في wlt/frontend/app-partner/dsh/.
   - أنشئ/حدّث:
     wlt-dsh-partner.contract.ts
     wlt-dsh-partner.preview-data.ts
     wlt-dsh-partner.types.ts
     WltDshPartnerBridge.tsx
     index.ts explicit exports
5) لا تعلن أن التسريب المالي مغلق إلا إذا لم يبق DSH-owned wallet/finance UI أو تم تحويله إلى compat wrapper موثق مؤقتًا.

Verification:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- finance ownership gate:
  WLT contract exists, moneySemantics preview-only exists, DSH-owned wallet screen count, DSH-owned settlement/commission screen count.

Evidence:
tools\registry\runs\DSH_PARTNER_P1_DATA_CONTRACT_FINANCE_OWNERSHIP-YYYYMMDD-HHMMSS\:
finance-ownership-audit.txt, data-contracts-added.csv, wlt-bridge-created.txt, git-diff-check.txt, tsc-noemit.txt, LOCAL_CHANGE_REVIEW.patch, P1_REPORT.md, ZIP بنفس اسم مجلد الجلسة.
```

---

## Phase P2 — Structure + Routes + Screen Registry

```text
نفّذ DSH_PARTNER_P2_STRUCTURE_ROUTES_REGISTRY فقط داخل C:\bthwani-suite.

Goal:
إنشاء الهيكل القياسي لتطبيق الشريك DSH فقط، مع routes وscreen registry. لا ARB ولا WalletScreen داخل DSH.

Target structure:
dsh/frontend/app-partner/
├─ index.ts
├─ DshPartnerSurface.tsx
├─ dsh-partner.routes.ts
├─ dsh-partner.screen-registry.ts
├─ dsh-partner.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/

Required screens:
- PartnerHomeScreen.tsx
- PartnerEntryScreen.tsx
- StoreProfileScreen.tsx
- OperationsScreen.tsx
- OrdersInboxScreen.tsx
- OrderDetailScreen.tsx
- OrderIssueScreen.tsx
- InventoryCatalogScreen.tsx
- PromotionsScreen.tsx
- NotificationsScreen.tsx
- PartnerSettingsScreen.tsx
- PartnerSupportScreen.tsx

Forbidden screens inside DSH:
- WalletScreen
- FinanceScreen
- ARB screens
- TypeSwitchScreen
- OrderAcceptScreen as independent route
- OrderRejectScreen as independent route
- QuickReplySetupScreen as independent route
- DocUploadScreen as independent route

Execution:
1) Preflight git + diff-check + tsc.
2) Create folders screens/parts/data/shared.
3) Convert DshPartnerHubSurface role:
   - Keep DshPartnerSurface.tsx as the public surface.
   - Preserve DshPartnerConsoleScreen as compat shim only if required.
   - Do not break app-partner/composition.
4) Create dsh-partner.routes.ts with route IDs:
   dsh-partner-home, dsh-partner-entry, dsh-partner-store-profile, dsh-partner-operations, dsh-partner-orders, dsh-partner-order-detail, dsh-partner-order-issue, dsh-partner-inventory, dsh-partner-promotions, dsh-partner-notifications, dsh-partner-settings, dsh-partner-support.
5) Create dsh-partner.screen-registry.ts with screenId, routeId, surfaceId='app-partner', ownerKind='service', ownerId='dsh', serviceId='dsh', ownerPath, componentName, screenKind, flowId, requiredStates, analytics.screenView, fallbackRouteId, releaseCriticality, status.
6) Move only safe route entries into screens/.
7) Move non-route UI chunks to parts/ only if imports are safely updated.
8) Move preview/static data to data/ only if no labels/values/order change.
9) Move helpers/types/mappers to shared/.
10) Update imports through resolved paths.

Verification:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- registry route coverage check
- no ARB screen inside DSH partner
- no wallet/finance screen inside DSH partner

Evidence:
tools\registry\runs\DSH_PARTNER_P2_STRUCTURE_ROUTES_REGISTRY-YYYYMMDD-HHMMSS\:
moves.csv, import-updates.csv, routes-registry-audit.txt, screen-registry-audit.txt, git-diff-check.txt, tsc-noemit.txt, LOCAL_CHANGE_REVIEW.patch, P2_REPORT.md, ZIP بنفس اسم مجلد الجلسة.
```

---

## Phase P3 — Public API + Placeholder Compatibility Cleanup

```text
نفّذ DSH_PARTNER_P3_PUBLIC_API_PLACEHOLDER_CLEANUP فقط داخل C:\bthwani-suite.

Goal:
تنظيف dsh/frontend/app-partner/index.ts وapp-partner/composition/index.ts وapp-partner/shell/PartnerSurfaceHost.tsx من export-star والbarrel الواسع والplaceholder noise، بدون كسر التشغيل.

Allowed scope:
- dsh/frontend/app-partner/index.ts
- dsh/frontend/app-partner/**
- app-partner/composition/**
- app-partner/shell/**
- tools/registry/runs/** للأدلة

Forbidden:
- لا backend/API.
- لا UI redesign.
- لا route semantics.
- لا WLT changes إلا إذا import يفرض public bridge.
- لا export *.
- لا any/as any.

Execution:
1) Preflight.
2) index.ts في dsh/frontend/app-partner:
   - لا يصدّر كل شيء.
   - public فقط:
     DshPartnerSurface
     DshPartnerConsoleScreen alias مؤقت إذا مطلوب
     dshPartnerRoutes
     dshPartnerScreenRegistry
     public partner types الضرورية
   - أي compatibility export يجب توثيقه بتعليق قصير.
3) app-partner/composition/index.ts:
   - استبدل export * من compat بتصديرات صريحة.
4) app-partner/shell/PartnerSurfaceHost.tsx:
   - افحص placeholders.
   - أي placeholder له route حقيقي يجب تحويله إلى شاشة/part أو إزالته إذا dead/unreferenced.
   - أي placeholder ضروري مؤقتًا يصنف COMPAT_PLACEHOLDER_PENDING_REMOVAL.
   - لا تعلن CLOSED إذا بقيت placeholders بدون سبب.
5) shell:
   - لا يحمل DSH/ARB mixing داخل DSH route.
   - إن وُجد ARB mixing، صنفه وابدأ بفصله فقط إذا آمن.
   - لا تكسر app-partner runtime.

Verification:
- export_star count = 0
- placeholder count documented
- index broad barrel removed
- git diff --check
- pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\DSH_PARTNER_P3_PUBLIC_API_PLACEHOLDER_CLEANUP-YYYYMMDD-HHMMSS\:
index-public-api-audit.csv, composition-export-audit.txt, placeholder-compat-audit.csv, compatibility-exports.txt, git-diff-check.txt, tsc-noemit.txt, LOCAL_CHANGE_REVIEW.patch, P3_REPORT.md, ZIP بنفس اسم مجلد الجلسة.
```

---

## Phase P4 — WLT Partner DSH Bridge Simplification

```text
نفّذ DSH_PARTNER_P4_WLT_BRIDGE_SIMPLIFICATION فقط داخل C:\bthwani-suite.

Goal:
تبسيط wlt/frontend/app-partner/dsh كـ WLT-owned bridge مرتبط بسياق DSH partner، وليس mini-app متشعب.

Target:
wlt/frontend/app-partner/dsh/
├─ index.ts
├─ WltDshPartnerBridge.tsx
├─ wlt-dsh-partner.parts.tsx
├─ wlt-dsh-partner.adapter.ts
├─ wlt-dsh-partner.contract.ts
├─ wlt-dsh-partner.preview-data.ts
├─ wlt-dsh-partner.types.ts
└─ useWltDshPartnerWalletPreview.ts

Execution:
1) Preflight.
2) Inventory WLT bridge files.
3) Replace export * in WLT index with explicit exports.
4) Ensure contract:
   dataKind='UI_PREVIEW_ONLY'
   runtimeTruth=false
   backendSource=false
   bindingSource=false
   moneySemantics='preview-only display values / not accounting source'
   ownerKind='integration'
   ownerId='wlt.dsh'
   serviceId='wlt'
   linkedServiceId='dsh'
   surfaceId='app-partner'
5) Merge small presentation parts into wlt-dsh-partner.parts.tsx if safe.
6) Keep separate files only if public compatibility requires it, and document why.
7) DSH must not import WLT internals except public bridge/index/contract.

Verification:
- WLT bridge explicit index
- no export *
- no serviceId core
- moneySemantics present
- tsc PASS
- diff-check PASS

Evidence:
tools\registry\runs\DSH_PARTNER_P4_WLT_BRIDGE_SIMPLIFICATION-YYYYMMDD-HHMMSS\:
wlt-bridge-inventory.csv, wlt-bridge-merge-decisions.csv, ownership-contract-audit.txt, git-diff-check.txt, tsc-noemit.txt, LOCAL_CHANGE_REVIEW.patch, P4_REPORT.md, ZIP بنفس اسم مجلد الجلسة.
```

---

## Phase P5 — Classification + Docs/Blueprint Consistency

```text
نفّذ DSH_PARTNER_P5_CLASSIFICATION_DOCS_CONSISTENCY فقط داخل C:\bthwani-suite.

Goal:
إعادة توليد classification من الملفات الموجودة فعليًا فقط، وتحديث dsh/SERVICE_BLUEPRINT.md وdsh/docs بحيث يصبح لدينا معيار قابل للتكرار لخدمة/تطبيق آخر.

Allowed scope:
- dsh/docs/**
- dsh/SERVICE_BLUEPRINT.md
- dsh/frontend/app-partner/**
- wlt/frontend/app-partner/dsh/**
- wlt/frontend/shared/finance/**
- app-partner/composition/**
- app-partner/shell/**
- dsh/frontend/shared/**
- tools/registry/runs/** للأدلة

Execution:
1) Preflight.
2) Generate actual scoped source list.
3) Create/update:
   dsh/docs/dsh-partner-final-classification.csv
4) Required columns:
   path,layer,ownerKind,ownerId,serviceId,linkedServiceId,classification,status
5) Integrity:
   - every scoped source file appears exactly once
   - no missing path
   - no duplicate path rows
   - no stale path
6) Update:
   dsh/SERVICE_BLUEPRINT.md
   dsh/docs/DSH_PARTNER_APP_SCOPE_STANDARDIZATION.md
   dsh/docs/DSH_PARTNER_APP_SCOPE_STANDARDIZATION_RUNBOOK.md
7) Docs must not claim CLOSED if gates are not proven.
8) Docs must mention:
   - DSH partner only
   - no ARB
   - WLT owns money
   - canonical screens
   - target structure
   - closure gates

Verification:
- classification paths not found = 0
- missing scoped files = 0
- duplicate rows = 0
- docs contradiction = NO
- git diff --check
- pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\DSH_PARTNER_P5_CLASSIFICATION_DOCS_CONSISTENCY-YYYYMMDD-HHMMSS\:
scoped-source-truth.csv, classification-integrity.json, classification-integrity.txt, docs-consistency-audit.txt, git-diff-check.txt, tsc-noemit.txt, LOCAL_CHANGE_REVIEW.patch, P5_REPORT.md, ZIP بنفس اسم مجلد الجلسة.
```

---

## Phase P6 — Final Closure Gate

```text
نفّذ DSH_PARTNER_P6_FINAL_CLOSURE_GATE فقط داخل C:\bthwani-suite.

Goal:
بوابة الإغلاق النهائي لتطبيق الشريك DSH فقط. لا تضف ميزات. لا refactor جديد. أثبت فقط أن الإغلاق تم.

Checks:
1) git fetch origin
2) git branch --show-current
3) git rev-parse HEAD
4) git rev-parse "origin/$(git branch --show-current)"
5) git --no-pager status --short
6) git --no-pager diff --name-status
7) git --no-pager diff --check
8) pnpm -w exec tsc --noEmit

Static gates:
- serviceId core count = 0
- export * count = 0
- any/as any count = 0
- Tamagui outside ui-kit count = 0
- DSH-owned wallet/finance count = 0
- ARB inside DSH partner count = 0
- placeholder without reason count = 0
- classification stale paths = 0
- missing scoped classification = 0
- duplicate classification rows = 0
- docs contradiction = NO
- index barrel broad exports = NO

Runtime smoke:
If possible:
pnpm --dir app-partner/runtime exec expo start --dev-client --host lan --port 8082 --clear
If port busy, use next free port and record.
Open Android if available.
Capture:
adb logcat -d -v time ReactNativeJS:V ReactNative:V Expo:V AndroidRuntime:E *:S
Must not show:
Cannot read property 'default' of undefined
property is not writable
FATAL EXCEPTION
AndroidRuntime

Evidence:
tools\registry\runs\DSH_PARTNER_P6_FINAL_CLOSURE_GATE-YYYYMMDD-HHMMSS\:
branch.txt, head.txt, origin-head.txt, head-sync.txt, git-status-short.txt, git-diff-name-status.txt, git-diff-check.txt, tsc-noemit.txt, static-gate.json, static-gate.txt, classification-integrity.json, public-api-gate.txt, placeholder-gate.txt, finance-ownership-gate.txt, docs-consistency-gate.txt, runtime-smoke.txt, app-partner-adb-logcat.txt if available, LOCAL_CHANGE_REVIEW.patch, UNTRACKED_FILES.txt, P6_FINAL_CLOSURE_REPORT.md, ZIP بنفس اسم مجلد الجلسة.

Do not declare PASS unless:
- diff-check PASS
- tsc PASS
- all static gates PASS
- classification integrity PASS
- finance ownership PASS
- no ARB in DSH partner
- no unexpected untracked source
- runtime PASS or SKIPPED_WITH_REASON
```

---

## Optional Commit/Push Prompt — after P6 PASS only

```text
نفّذ commit/push آمن فقط إذا DSH_PARTNER_P6_FINAL_CLOSURE_GATE أعطى PASS.

Repo:
C:\bthwani-suite

Execution:
1) git --no-pager status --short
2) git --no-pager diff --check
3) pnpm -w exec tsc --noEmit
4) git add -A
5) git --no-pager diff --cached --check
6) pnpm -w exec tsc --noEmit
7) git commit -m "chore: close dsh partner app scope"
8) git push origin (git branch --show-current)
9) git --no-pager status --short

Hard block:
- no commit if diff-check fails
- no commit if tsc fails
- no commit if unexpected untracked source exists
```
