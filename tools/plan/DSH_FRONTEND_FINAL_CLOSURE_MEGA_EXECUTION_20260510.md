# DSH Frontend Final Closure — Mega Execution Package

> الهدف: تسريع التنفيذ بدون الرجوع لتحليل طويل، مع الحفاظ على الدقة والبوابات الرقمية.
> النطاق: DSH frontend كامل: لوحة التحكم + تطبيق العميل + تطبيق الشريك + تطبيق الكابتن + التطبيق الميداني.
> الريبو المحلي: `C:\bthwani-suite`
> GitHub: `bthwani2-boop/bthwani-suite`
> الفرع المرجعي الحالي: `ghb/0127-20260510-020924-governance`

---

## 0) قرار التشغيل

الأوامر السابقة كانت إما ضيقة جدًا أو واسعة بدون بوابات كافية. هذا الملف يعتمد **موجات تنفيذ كبيرة** بدل أوامر صغيرة، لكن كل موجة محكومة بقواعد منع التخريب:

- تنفيذ واسع داخل نطاق واضح.
- لا توقف بسبب غياب patch قديم أو evidence قديم.
- استخدم evidence السابقة كمدخل فقط، وليس كشرط تعطيل.
- ممنوع إعلان `PASS/CLOSED/100%` بدون:
  - `git diff --check = PASS`
  - `pnpm -w exec tsc --noEmit = PASS`
  - Evidence ZIP داخل `tools\registry\runs\<SESSION_ID>\<SESSION_ID>.zip`
  - Screenshot/visual evidence عند UI.

---

## 1) قواعد غير قابلة للكسر

```text
Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only
```

- لا Tamagui خارج `ui-kit`.
- لا `export *`.
- لا `any/as any` جديد.
- لا backend/API/runtime/binding/integration في هذه المرحلة.
- لا dependency جديدة.
- لا map SDK.
- لا route semantics جديدة.
- لا folders كثيرة.
- لا local design system.
- لا random colors / purple / glass / glow / hero.
- لا scroll داخلي أفقي أو رأسي داخل أقسام لوحة التحكم desktop.
- لا نصوص إنجليزية ظاهرة للمستخدم داخل واجهات DSH العربية.
- لا placeholder ضخم أو "قريبًا".
- لا تغييرات مالية خارج WLT.
- لا deep import بين التطبيقات ولوحة التحكم.
- لا تستخدم أو تذكر أي repo/path قديم باسم `bth`; الريبو الحالي فقط `C:\bthwani-suite`.

---

## 2) تصحيح مهم: الخريطة الحية / الحرارية

الخريطة ليست لكل التطبيقات.

المسموح فقط:

1. **لوحة التحكم → Operations**
   - خريطة تشغيل/إسناد حية كاملة.
   - تركز على:
     - الطلبات
     - تواجد/توزيع الكباتن
     - ضغط المتاجر
     - مناطق نقص التغطية
     - مخاطر الالتزام
     - التأخير
     - توصيات إعادة توزيع الكباتن

2. **تطبيق الكابتن**
   - خريطة كابتن فقط إن كانت موجودة أو مطلوبة.
   - تركز على:
     - مهمة الكابتن الحالية
     - الطريق للمتجر
     - الطريق للعميل
     - إثبات الاستلام/التسليم
     - عروض قريبة للكابتن نفسه فقط

ممنوع:
- خريطة حرارية في تطبيق العميل.
- خريطة حرارية في تطبيق الشريك.
- خريطة حرارية في التطبيق الميداني.
- عرض بيانات كل الكباتن أو ذكاء fleet داخل تطبيق الكابتن.

---

## 3) Evidence السابقة التي يجب استخدامها

لا تعيد التحليل من الصفر. اقرأ هذه المسارات أولًا:

```text
tools\registry\runs\A2_WEB_FOUNDATION_READINESS_AUDIT-20260510-030400
tools\registry\runs\B4_P5_DSH_SKIPPED_DATA_CONTRACT_CLOSURE-20260510-061926
tools\registry\runs\B4_P4_DSH_REMAINING_SMALL_DATA_CONTRACT_SWEEP-20260510-060904
tools\registry\runs\B4_P3_APP_CLIENT_FIXTURE_BUILDER_DATA_CONTRACT-20260510-054903
tools\registry\runs\B4_P2_APP_CLIENT_SMALL_FIXTURE_DATA_CONTRACT-20260510-054147
tools\registry\runs\B4_P2_APP_CLIENT_SMALL_FIXTURE_DATA_CONTRACT-20260510-054500
tools\registry\runs\B4_P1_FIXTURE_LOCATION_DATA_CONTRACT-20260510-053500
tools\registry\runs\DSH_FINAL_GATE_B2F_R1-20260510-052400
tools\registry\runs\DSH_FINAL_GATE_B2F-20260510-051800
tools\registry\runs\DSH_PREVIEW_FIXTURE_DATA_AUDIT_B2E_R1-20260510-050800
tools\registry\runs\DSH_PREVIEW_FIXTURE_DATA_AUDIT_B2E-20260510-060000
tools\registry\runs\DSH_SEMANTIC_OWNERSHIP_AUDIT_B2D-20260510-045348
tools\registry\runs\DSH_NAMING_CLASSIFICATION_CONTRACT_B2C-20260510-044245
tools\registry\runs\DSH_NAMING_CLASSIFICATION_CONTRACT_B2B-20260510-042300
tools\registry\runs\DSH_NAMING_CLASSIFICATION_CONTRACT-20260510-041800
tools\registry\runs\DSH_SCREEN_FILE_INVENTORY-20260510-040700
tools\registry\runs\BTHWANI_BASELINE_READINESS_MATRIX-20260510-040200
```

قاعدة مهمة:
- هذه Evidence لا تُستخدم كسبب BLOCK إلا إذا تعارضت مع HEAD الحالي.
- إذا كانت الشجرة نظيفة وHEAD مطابق للبعيد، نفّذ من HEAD الحالي مباشرة.

---

# WAVE 00 — Preflight + Evidence Condenser Script

انسخ وشغّل هذا في PowerShell قبل أي تنفيذ.
هذا لا يغير source files. ينتج ملخصًا سريعًا يقلل التكرار.

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$RunId = "DSH_FRONTEND_PREFLIGHT_CONDENSER-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $RunId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

git fetch origin

$branch = git branch --show-current
$head = git rev-parse HEAD
$originHead = git rev-parse "origin/$branch"
$status = git --no-pager status --short

$branch | Set-Content -Encoding UTF8 (Join-Path $Out "branch.txt")
$head | Set-Content -Encoding UTF8 (Join-Path $Out "head.txt")
$originHead | Set-Content -Encoding UTF8 (Join-Path $Out "origin-head.txt")
$status | Set-Content -Encoding UTF8 (Join-Path $Out "git-status-short.txt")

if ($head -ne $originHead) {
  "BLOCKED_REMOTE_MISMATCH" | Set-Content -Encoding UTF8 (Join-Path $Out "BLOCKED.txt")
  throw "BLOCKED_REMOTE_MISMATCH: local HEAD does not equal origin/$branch"
}

$SourceRoots = @(
  "dsh\frontend\app-client",
  "dsh\frontend\app-partner",
  "dsh\frontend\app-captain",
  "dsh\frontend\app-field",
  "dsh\frontend\control-panel",
  "dsh\frontend\shared",
  "ui-kit\src\web",
  "control-panel\shell"
)

$Files = Get-ChildItem -Path $SourceRoots -Recurse -Include *.ts,*.tsx,*.css,*.md -File -ErrorAction SilentlyContinue

$PatternMap = @{
  "tamagui_outside_uikit" = "from ['""]tamagui['""]|from ['""]@tamagui"
  "export_star" = "export\s+\*"
  "any_usage" = "\bas\s+any\b|:\s*any\b"
  "deep_import_between_apps" = "from ['""][.]{2,}\/app-client|from ['""][.]{2,}\/app-partner|from ['""][.]{2,}\/app-captain|from ['""][.]{2,}\/app-field"
  "internal_scroll" = "overflow-x\s*:\s*auto|overflow-x\s*:\s*scroll|overflow-y\s*:\s*auto|overflow-y\s*:\s*scroll"
  "large_whitespace" = "minHeight:\s*['""]?400px|min-height:\s*400px|hero|Hero|قريباً"
  "english_ui_terms" = "Open operations|Loading operations preview|Nothing to show yet|delayed pickups|pressure|owner surface|Support queue|Dashboard|Finance|Marketing|Catalogs|Partners|Geo|Hub|Core|Live|Manual|Crew|Stores|Capacity|Risk|Proof"
  "old_visual_noise" = "premiumGlass|glass|glow|purple|#8b5cf6|🎧|💰|⚙️"
  "false_runtime_claims" = "CONNECTED_RUNTIME|LIVE_BINDING|runtime truth|production-like truth"
}

$Audit = foreach ($key in $PatternMap.Keys) {
  $matches = $Files | Select-String -Pattern $PatternMap[$key] -ErrorAction SilentlyContinue
  [pscustomobject]@{
    check = $key
    count = @($matches).Count
    status = if (@($matches).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($matches) | Select-Object -First 25 | ForEach-Object {
      "$($_.Path):$($_.LineNumber): $($_.Line.Trim())"
    }) -join "`n"
  }
}

$Audit | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $Out "static-audit.json")
$Audit | Format-Table -AutoSize | Out-String -Width 500 | Set-Content -Encoding UTF8 (Join-Path $Out "static-audit-table.txt")

$EvidenceRoots = @(
  "tools\registry\runs\B4_P5_DSH_SKIPPED_DATA_CONTRACT_CLOSURE-20260510-061926",
  "tools\registry\runs\B4_P4_DSH_REMAINING_SMALL_DATA_CONTRACT_SWEEP-20260510-060904",
  "tools\registry\runs\DSH_FINAL_GATE_B2F_R1-20260510-052400",
  "tools\registry\runs\DSH_PREVIEW_FIXTURE_DATA_AUDIT_B2E_R1-20260510-050800",
  "tools\registry\runs\DSH_SCREEN_FILE_INVENTORY-20260510-040700"
)

$EvidenceSummary = foreach ($p in $EvidenceRoots) {
  [pscustomobject]@{
    path = $p
    exists = Test-Path $p
    files = if (Test-Path $p) { @(Get-ChildItem -Path $p -File -ErrorAction SilentlyContinue).Count } else { 0 }
  }
}

$EvidenceSummary | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 (Join-Path $Out "prior-evidence-summary.json")

git --no-pager diff --check | Set-Content -Encoding UTF8 (Join-Path $Out "git-diff-check.txt")
pnpm -w exec tsc --noEmit *> (Join-Path $Out "tsc-noemit.txt")

Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$RunId.zip") -Force

Write-Host "PREFLIGHT_OUT=$Out"
Write-Host "PREFLIGHT_ZIP=$(Join-Path $Out "$RunId.zip")"
```

---

# WAVE 01 — Mega Frontend Ownership + Classification Closure

هذا ينفذ تصنيف وتنظيم منطقي واسع، لا redesign.

```text
نفّذ WAVE 01: DSH Frontend Ownership + Classification Mega Closure.

Repo: C:\bthwani-suite

Goal:
إغلاق تصنيف وتنظيم وملكية ملفات DSH frontend عبر لوحة التحكم والتطبيقات الأربعة، باستخدام evidence السابقة، بدون إعادة تحليل طويل وبدون rename عشوائي.

Use evidence first:
- اقرأ latest preflight condenser output إن وجد.
- اقرأ B2B/B2C/B2D/B2E/B2F reports.
- اقرأ B4_P1/P2/P3/P4/P5 reports.
- لا توقف بسبب أن patch قديم غير موجود؛ نفّذ من HEAD الحالي.

Allowed source scope:
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**/*.md
- dsh/frontend/app-client/**/*.ts
- dsh/frontend/app-client/**/*.tsx
- dsh/frontend/app-partner/**/*.ts
- dsh/frontend/app-partner/**/*.tsx
- dsh/frontend/app-captain/**/*.ts
- dsh/frontend/app-captain/**/*.tsx
- dsh/frontend/app-field/**/*.ts
- dsh/frontend/app-field/**/*.tsx
- dsh/frontend/control-panel/**/*.ts
- dsh/frontend/control-panel/**/*.tsx
- dsh/frontend/shared/**/*.ts
- dsh/frontend/shared/**/*.tsx

Strict exclusions:
- لا backend/API/runtime/binding/integration.
- لا app shell route semantics changes.
- لا delete نهائي.
- لا archive إلا إذا أُثبت الملف orphan/dead ولا يوجد import/consumer، والarchive فقط إلى:
  dsh/_archive/frontend/<SESSION_ID>/
- لا تستخدم dsh/frontend/Archive.
- لا rename واسع. rename فقط إذا:
  1) الملف مصنف خطأ بوضوح.
  2) import/export/registry proof واضح.
  3) rollback path موثق.
- لا تغير UI visual layout في هذه الموجة.
- لا Tamagui خارج ui-kit.
- لا export *.
- لا any/as any.

Required:
1) أنشئ/حدّث matrix داخل docs أو shared report يثبت:
   - app-client ownership
   - app-partner ownership
   - app-captain ownership
   - app-field ownership
   - control-panel ownership
   - shared ownership
2) صنّف كل screen/data/store/fixture/helper في DSH frontend إلى:
   - SCREEN_ENTRY
   - SCREEN_PART
   - PREVIEW_DATA
   - FIXTURE
   - STORE_PREVIEW
   - SHARED_HELPER
   - ROUTE_ADAPTER
   - DEAD_CANDIDATE
   - AMBIGUOUS_BLOCKED
3) عالج أكبر عدد آمن من:
   - duplicate fixture/data contract gaps
   - wrongly named non-screen components
   - preview data داخل screen إن كان يمكن استخراجه بأمان
   - dead content المؤكد
   - English visible text الواضح
4) لا تلمس heatmap placement إلا بتوثيق القاعدة:
   - control-panel operations فقط.
   - app-captain captain-scoped فقط.
   - لا app-client/app-partner/app-field heatmap.
5) إذا احتجت تعديل ملفات كثيرة:
   - غيّر حتى 60 ملفًا كحد أعلى.
   - لا تلمس أكثر من 8 ملفات ضخمة > 700 سطر.
   - لا full-file reformat.
   - لا line-ending normalization.

Verification:
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\WAVE_01_DSH_FRONTEND_OWNERSHIP_CLASSIFICATION_CLOSURE-YYYYMMDD-HHMMSS\

Report must include:
- previous evidence used: YES/NO
- files scanned count
- files changed count
- files moved/renamed count
- files archived count
- classification matrix
- dead candidates handled
- ambiguous skipped list
- ids changed: NO unless justified
- routes changed: NO
- UI visual changed: NO
- runtime/backend changed: NO
- tsc result
- diff-check result
- final verdict

Do not declare PASS unless diff-check and tsc pass.
```

---

# WAVE 02 — Control Panel Viewport + Workbench Closure

هذه موجة UI/UX واسعة للوحة التحكم فقط: تغلق الفراغات، scroll، التبويبات، والتوصيات.

```text
نفّذ WAVE 02: DSH Control Panel Viewport + Workbench Mega Closure.

Repo: C:\bthwani-suite

Goal:
إغلاق UI/UX/Flow للوحة تحكم DSH كـ command/control room desktop viewport-bound بدون scroll داخلي، مع كل الأقسام كـ workbenches عملية.

Allowed files:
- ui-kit/src/web.ts
- ui-kit/src/web/index.ts
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/control-surface.tsx
- control-panel/shell/ControlPanelSurfaceHost.tsx
- control-panel/shell/control-panel-shell.module.css
- dsh/frontend/control-panel/**/*.ts
- dsh/frontend/control-panel/**/*.tsx
- dsh/frontend/control-panel/**/*.css

Forbidden:
- لا backend/API/runtime.
- لا map SDK.
- لا dependencies.
- لا Tamagui خارج ui-kit.
- لا export *.
- لا any جديد.
- لا route semantics change.
- لا local design system.
- لا DSH domain data داخل ui-kit.
- لا app-client/app-partner/app-captain/app-field edits في هذه الموجة.
- لا full-file reformat.

Required implementation:
1) ui-kit control-panel primitives:
   - تأكد من وجود أو اكتمال:
     - WebControlPanelViewport
     - WebControlPanelWorkbench
     - WebControlPanelDenseHeader
     - WebControlPanelSplitPane
     - WebControlPanelQueue
     - WebControlPanelCompactPager
     - WebControlPanelInspectorShell
     - WebControlPanelRecommendation
     - WebControlPanelActionCluster
     - WebControlPanelLaneTabs
     - WebControlPanelTertiaryFilters
     - WebControlPanelMapCanvas
     - WebControlPanelMapPin
     - WebControlPanelRouteLine
   - لا scroll داخلي داخل primitives.
   - لا domain data.

2) Shell/viewport:
   - rail يمين في RTL.
   - stage يسار rail.
   - no stage compression.
   - desktop section body بلا overflow-x/y auto/scroll.
   - إزالة minHeight 400/hero/wrappers.
   - لا فراغ كبير؛ استخدم split pane, inspector, compact queue, recommendation.

3) Sections to close:
   - Dashboard
   - Operations
   - Finance
   - Support
   - Catalogs
   - Partners
   - Marketing
   - Control

4) Per section:
   - compact dense header
   - signal/KPI strip
   - primary workbench
   - max 5 rows visible
   - compact pager
   - inspector/detail
   - recommendation
   - tabs/subtabs/filters functional
   - no duplicated content
   - no English visible text
   - no hero/landing cards

5) Support:
   - remove old support design completely.
   - queues:
     - دعم العميل
     - دعم الشريك
     - دعم الكابتن
     - دعم الميدان
     - النزاعات
     - التصعيد
     - مخاطر الالتزام
   - every row has owner/evidence/nextAction/recommendation.

6) Finance:
   - remove inline styles / emoji / premiumGlass / as any.
   - flows:
     - التسويات
     - تحصيل الدفع عند الاستلام
     - الاستردادات
     - مدفوعات الشركاء
     - مدفوعات الكباتن
     - السجل المالي
     - المخاطر والتدقيق
   - no finance truth outside WLT; this is UI preview/admin context.

7) Marketing:
   - fix large bulk action button.
   - turn it into compact toolbar/action cluster.
   - primary action واحد.
   - secondary actions صغيرة.
   - no large CTA card/banner.

8) Recommendations:
   - unified recommendation model/UI visible in:
     - Dashboard
     - Operations
     - Finance
     - Support
     - Catalogs
     - Partners
     - Marketing
     - Control
   - every recommendation answers:
     - لماذا؟
     - ماذا أفعل؟
     - ما الدليل؟
     - من المالك؟
     - ما الأثر المتوقع؟

9) Tabs:
   - every primary tab changes view.
   - every secondary tab changes rows/filter/inspector.
   - every tertiary filter changes visible set.
   - no decorative tabs.
   - no "قريباً".

Verification:
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\WAVE_02_DSH_CONTROL_PANEL_VIEWPORT_WORKBENCH_CLOSURE-YYYYMMDD-HHMMSS\

Report must include:
- changed files grouped by section
- removed scroll sources
- removed whitespace sources
- support old design removed yes/no
- finance weak patterns removed yes/no
- marketing bulk action fixed yes/no
- recommendations coverage matrix
- tabs coverage matrix
- Arabic/RTL risk matrix
- final verdict

Do not declare PASS unless diff-check and tsc pass.
```

---

# WAVE 03 — Control Panel Live Map + App-Captain Scoped Map Closure

هذه موجة الخريطة. لا تضف الخريطة لكل التطبيقات.

```text
نفّذ WAVE 03: DSH Live Map Correct Placement Closure.

Repo: C:\bthwani-suite

Goal:
إغلاق الخريطة الحية/الحرارية في المواضع الصحيحة فقط:
1) لوحة التحكم / العمليات: live dispatch map.
2) تطبيق الكابتن: captain-scoped map فقط إذا موجود أو مطلوب.
ولا شيء في تطبيق العميل/الشريك/الميداني.

Allowed files:
- dsh/frontend/control-panel/operations/GeoHeatmapScreen.tsx
- dsh/frontend/control-panel/operations/geo-heatmap.preview-data.ts
- dsh/frontend/control-panel/operations/operations.registry.ts
- dsh/frontend/control-panel/operations/operations.types.ts
- dsh/frontend/control-panel/operations/operations.preview-data.ts
- dsh/frontend/control-panel/operations/dsh-surface.module.css
- dsh/frontend/control-panel/shared/*.ts
- dsh/frontend/control-panel/shared/*.tsx
- dsh/frontend/app-captain/**/*.ts
- dsh/frontend/app-captain/**/*.tsx
- dsh/frontend/shared/**/*.ts
- dsh/frontend/shared/**/*.tsx
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx

Strict exclusions:
- لا تعدّل app-client لخريطة.
- لا تعدّل app-partner لخريطة.
- لا تعدّل app-field لخريطة.
- لا map SDK.
- لا dependencies.
- لا backend/API/runtime.
- لا expose admin fleet intelligence داخل app-captain.
- لا deep import بين app-captain/control-panel.
- لا route semantics change.

Control Panel map requirements:
1) canvas شبه خريطة داخل viewport.
2) shows:
   - order pins
   - captain pins
   - store pins for pickup pressure only
   - route line: store → captain → customer
   - zone load
   - supply-demand gap
   - captain availability/presence
   - delayed pickup risk
   - commitment risk
3) sub-tabs:
   - الطلبات
   - الكباتن
   - المتاجر
   - الالتزام
   - الذروة
4) filters:
   - الآن
   - ١٥ دقيقة
   - ٣٠ دقيقة
   - خطر عالٍ
   - نقص كباتن
   - ضغط متاجر
5) every tab/filter changes visible pins/zones.
6) clicking zone/order/captain/store changes inspector.
7) inspector shows:
   - type
   - status
   - risk
   - evidence
   - next action
   - expected impact
   - runtimeBindingStatus

Captain map requirements:
1) First inspect whether captain map exists.
2) If exists: improve only captain-scoped flow.
3) If missing and required: add/strengthen route/map view for:
   - current task
   - route to store
   - route to customer
   - pickup/delivery proof context
   - nearby eligible offers only for this captain if preview data already supports it
4) Do not show all captains.
5) Do not show admin heatmap/fleet intelligence.
6) No map SDK.
7) No new dependency.

Verification:
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\WAVE_03_DSH_LIVE_MAP_CORRECT_PLACEMENT_CLOSURE-YYYYMMDD-HHMMSS\

Report must include:
- control-panel map status
- app-captain map status
- no app-client map changes
- no app-partner map changes
- no app-field map changes
- map layers
- filter behavior
- inspector behavior
- tsc result
- diff-check result
- final verdict
```

---

# WAVE 04 — Cross-App DSH Journey Closure

هذه تغلق الربط المنطقي بين لوحة التحكم والتطبيقات الأربعة، بدون binding حقيقي.

```text
نفّذ WAVE 04: DSH Cross-App Journey Closure.

Repo: C:\bthwani-suite

Goal:
إغلاق UI/UX/Flow لمنظومة DSH عبر التطبيقات الأربعة ولوحة التحكم، كـ UI_PREVIEW_ONLY، بدون API/runtime.

Allowed files:
- dsh/frontend/app-client/**/*.ts
- dsh/frontend/app-client/**/*.tsx
- dsh/frontend/app-partner/**/*.ts
- dsh/frontend/app-partner/**/*.tsx
- dsh/frontend/app-captain/**/*.ts
- dsh/frontend/app-captain/**/*.tsx
- dsh/frontend/app-field/**/*.ts
- dsh/frontend/app-field/**/*.tsx
- dsh/frontend/control-panel/**/*.ts
- dsh/frontend/control-panel/**/*.tsx
- dsh/frontend/shared/**/*.ts
- dsh/frontend/shared/**/*.tsx
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/**/*.md

Forbidden:
- لا backend/API/runtime/binding.
- لا deep imports بين التطبيقات.
- لا route semantics changes.
- لا heatmap في app-client/app-partner/app-field.
- لا admin data في actor apps.
- لا false runtime claim.
- لا app shell rebuild.
- لا dependencies.

Required:
1) Cross-surface typed preview contract:
   - sourceSurface
   - affectedSurface
   - actor
   - lifecycleStep
   - entityId
   - entityLabel
   - status
   - risk
   - owner
   - evidence
   - nextAction
   - expectedImpact
   - primaryActionLabel
   - secondaryActionLabel
   - counterpartRouteHint
   - runtimeBindingStatus

2) Lifecycle coverage:
   - العميل يكتشف/يختار/يسلة/يدفع/ينشئ الطلب/يتتبع/يدعم/يقيم
   - الشريك يقبل/يرفض/يجهز/يعلن جاهز/يبلغ مشكلة عنصر
   - الكابتن يقبل/يتجه للمتجر/يصل/يستلم/يتجه للعميل/يسلم/يرفع إثبات
   - الميداني يفعّل/يزور/يثبت/يصعّد
   - لوحة التحكم تراقب/تتدخل/توصي/تدقق
   - المالية عبر WLT preview فقط

3) Each actor app must expose or already have UI preview flow for its role:
   app-client:
   - discovery
   - store/product/cart
   - checkout
   - order tracking
   - support
   - rating/refund trigger preview

   app-partner:
   - order intake
   - accept/reject
   - preparation
   - ready for pickup
   - item issue
   - store readiness
   - catalog

   app-captain:
   - offers/tasks
   - accept
   - to store
   - arrived
   - pickup
   - to customer
   - delivery
   - proof
   - support
   - captain-scoped map if applicable

   app-field:
   - store activation
   - field visit
   - evidence
   - issue/escalation

4) Control panel must show counterpart for every core step:
   - which surface produced the signal
   - which surface is affected
   - what operator can do
   - evidence
   - owner
   - runtimeBindingStatus

5) No duplicate content between app-aware tabs.

Verification:
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\WAVE_04_DSH_CROSS_APP_JOURNEY_CLOSURE-YYYYMMDD-HHMMSS\

Report must include:
- lifecycle matrix
- app-client coverage
- app-partner coverage
- app-captain coverage
- app-field coverage
- control-panel counterpart coverage
- missing counterpart surfaces
- no deep imports
- no false runtime claim
- tsc result
- diff-check result
- final verdict
```

---

# WAVE 05 — Dead Content + Duplication + Naming Cleanup

هذه موجة تنظيف واسعة، لكنها لا تحذف بدون دليل.

```text
نفّذ WAVE 05: DSH Dead Content Duplication Naming Cleanup.

Repo: C:\bthwani-suite

Goal:
إغلاق التسرب والمحتوى الميت والتكرار والتسمية الخاطئة داخل DSH frontend، بعد اكتمال التصنيف والرحلات.

Allowed files:
- dsh/frontend/**/*.ts
- dsh/frontend/**/*.tsx
- dsh/frontend/**/*.css
- dsh/docs/**/*.md
- dsh/SERVICE_BLUEPRINT.md

Forbidden:
- لا delete نهائي بدون archive + proof.
- لا archive إلى dsh/frontend/Archive.
- لا backend/API/runtime.
- لا route semantics changes.
- لا move واسع بدون import graph proof.
- لا reformat كامل.
- لا line-ending normalization.
- لا Tamagui خارج ui-kit.
- لا export *.
- لا any جديد.

Required:
1) Use evidence and current import graph.
2) Identify:
   - dead files
   - duplicate fixtures
   - duplicate stores
   - duplicate component patterns
   - wrongly named Screen files
   - screen parts named as screens
   - local design systems
   - CSS duplication
   - unused classes
3) Apply cleanup only when:
   - no imports/consumers
   - registry not referencing it
   - route not referencing it
   - screenshot/visual flow not requiring it
4) For dead source files:
   - move to dsh/_archive/frontend/<SESSION_ID>/ with same relative path.
   - generate rollback command.
5) For naming:
   - rename only when low risk and imports can be updated safely.
   - otherwise write BLOCKED_RENAME_CANDIDATE in report.
6) For duplicate content:
   - consolidate into existing shared helper or preview-data only if ownership is clear.
   - no UI kit domain data.
7) For CSS:
   - remove unused classes only if proven.
   - do not move CSS patterns into new local design system.

Verification:
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Evidence:
tools\registry\runs\WAVE_05_DSH_DEAD_DUPLICATE_NAMING_CLEANUP-YYYYMMDD-HHMMSS\

Report must include:
- files scanned
- files archived
- files renamed
- duplicates consolidated
- skipped risky candidates
- rollback commands
- no route regression
- tsc result
- diff-check result
- final verdict
```

---

# WAVE 06 — Final Gate Script

شغّل هذا بعد الموجات. لا تعتمد الإغلاق بدونه.

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"
$RunId = "DSH_FRONTEND_FINAL_CLOSURE_GATE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $RunId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

git branch --show-current | Tee-Object -FilePath (Join-Path $Out "00_branch.txt")
git rev-parse HEAD | Tee-Object -FilePath (Join-Path $Out "00_head.txt")
git --no-pager status --short | Tee-Object -FilePath (Join-Path $Out "01_git_status_short.txt")
git --no-pager diff --stat | Tee-Object -FilePath (Join-Path $Out "02_git_diff_stat.txt")
git --no-pager diff --name-status | Tee-Object -FilePath (Join-Path $Out "03_git_name_status.txt")
git --no-pager diff --check | Tee-Object -FilePath (Join-Path $Out "04_git_diff_check.txt")
pnpm -w exec tsc --noEmit *> (Join-Path $Out "05_tsc_noemit.txt")

$Roots = @(
  "dsh\frontend\app-client",
  "dsh\frontend\app-partner",
  "dsh\frontend\app-captain",
  "dsh\frontend\app-field",
  "dsh\frontend\control-panel",
  "dsh\frontend\shared",
  "ui-kit\src\web",
  "control-panel\shell"
)

$Files = Get-ChildItem -Path $Roots -Recurse -Include *.ts,*.tsx,*.css,*.md -File -ErrorAction SilentlyContinue

$Patterns = @{
  "tamagui_outside_uikit" = "from ['""]tamagui['""]|from ['""]@tamagui"
  "export_star" = "export\s+\*"
  "any_usage" = "\bas\s+any\b|:\s*any\b"
  "deep_import_between_apps" = "from ['""][.]{2,}\/app-client|from ['""][.]{2,}\/app-partner|from ['""][.]{2,}\/app-captain|from ['""][.]{2,}\/app-field"
  "internal_scroll_control_panel" = "overflow-x\s*:\s*auto|overflow-x\s*:\s*scroll|overflow-y\s*:\s*auto|overflow-y\s*:\s*scroll"
  "large_whitespace_sources" = "minHeight:\s*['""]?400px|min-height:\s*400px|hero|Hero|قريباً"
  "english_ui_terms" = "Open operations|Loading operations preview|Nothing to show yet|delayed pickups|pressure|owner surface|Support queue|Dashboard|Finance|Marketing|Catalogs|Partners|Geo|Hub|Core|Live|Manual|Crew|Stores|Capacity|Risk|Proof"
  "old_visual_noise" = "premiumGlass|glass|glow|purple|#8b5cf6|🎧|💰|⚙️"
  "false_runtime_claims" = "CONNECTED_RUNTIME|LIVE_BINDING|runtime truth|production-like truth"
  "forbidden_archive_path" = "dsh/frontend/Archive|dsh/frontend/archive|dsh/frontend/_archive"
}

$Audit = foreach ($key in $Patterns.Keys) {
  $regex = $Patterns[$key]
  $matches = $Files | Select-String -Pattern $regex -ErrorAction SilentlyContinue

  [pscustomobject]@{
    check = $key
    count = @($matches).Count
    status = if (@($matches).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($matches) | Select-Object -First 30 | ForEach-Object {
      "$($_.Path):$($_.LineNumber): $($_.Line.Trim())"
    }) -join "`n"
  }
}

$Audit | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $Out "06_static_audit.json")
$Audit | Format-Table -AutoSize | Out-String -Width 600 | Tee-Object -FilePath (Join-Path $Out "06_static_audit_table.txt")

$Coverage = @(
  [pscustomobject]@{ surface="app-client"; required="discovery/store/cart/checkout/tracking/support/rating"; screenshot_required="YES" },
  [pscustomobject]@{ surface="app-partner"; required="accept/reject/preparation/ready/item issue/readiness/catalog"; screenshot_required="YES" },
  [pscustomobject]@{ surface="app-captain"; required="offers/accept/to-store/pickup/to-customer/delivery/proof/support/captain-map-if-present"; screenshot_required="YES" },
  [pscustomobject]@{ surface="app-field"; required="activation/visit/evidence/escalation"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-dashboard"; required="workbench/recommendation/no-scroll/no-whitespace"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-operations"; required="live orders/dispatch/live map/exceptions/audit"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-finance"; required="WLT preview only/settlements/COD/refunds/payout/risk"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-support"; required="client/partner/captain/field support/disputes/escalation"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-catalogs"; required="client catalog/partner catalog/quality/adoption"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-partners"; required="approvals/readiness/store pressure/field visit"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-marketing"; required="campaign/media/growth/compact bulk action"; screenshot_required="YES" },
  [pscustomobject]@{ surface="control-panel-control"; required="admin/governance/platform/HR workspace"; screenshot_required="YES" }
)

$Coverage | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $Out "07_required_coverage_matrix.json")
$Coverage | Format-Table -AutoSize | Out-String -Width 600 | Tee-Object -FilePath (Join-Path $Out "07_required_coverage_matrix.txt")

git --no-pager diff -- . > (Join-Path $Out "LOCAL_CHANGE_REVIEW.patch")
git ls-files --others --exclude-standard > (Join-Path $Out "UNTRACKED_FILES.txt")

Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$RunId.zip") -Force

Write-Host ""
Write-Host "FINAL_GATE_FOLDER=$Out"
Write-Host "FINAL_GATE_ZIP=$(Join-Path $Out "$RunId.zip")"
```

---

## 7) معيار القبول النهائي

لا تعتمد الإغلاق إلا إذا:

| Gate | المطلوب |
|---|---:|
| git diff --check | 0 |
| pnpm -w exec tsc --noEmit | 0 |
| Tamagui outside ui-kit | 0 |
| export star | 0 |
| any/as any جديد | 0 |
| deep imports between apps | 0 |
| false runtime claims | 0 |
| forbidden archive path | 0 |
| internal control-panel scroll | 0 |
| large whitespace sources | 0 |
| English visible DSH terms | 0 |
| old visual noise | 0 |
| duplicate tab content | 0 |
| non-functional tabs | 0 |
| control-panel live dispatch map | PASS |
| app-captain scoped map if present/required | PASS |
| app-client no heatmap | PASS |
| app-partner no heatmap | PASS |
| app-field no heatmap | PASS |
| recommendations coverage | all control-panel sections |
| screenshot evidence | all listed surfaces |
| evidence zip name | exactly session folder name |

---

## 8) ماذا ترفع بعد كل موجة

ارفع فقط ZIP الخاص بالموجة، وليس كامل `tools/registry/runs`.

مثال:

```text
tools\registry\runs\WAVE_02_DSH_CONTROL_PANEL_VIEWPORT_WORKBENCH_CLOSURE-YYYYMMDD-HHMMSS\WAVE_02_DSH_CONTROL_PANEL_VIEWPORT_WORKBENCH_CLOSURE-YYYYMMDD-HHMMSS.zip
```

لا ترفع `trash.zip` ولا كل مجلد runs.

---

## 9) أمر Commit/Push آمن بعد انتهاء موجة PASS

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --check
if ($LASTEXITCODE -ne 0) { throw "diff check failed" }

pnpm -w exec tsc --noEmit
if ($LASTEXITCODE -ne 0) { throw "tsc failed" }

git add -A
git --no-pager diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "cached diff check failed" }

git commit -m "chore: close dsh frontend wave"
git push origin (git branch --show-current)
git --no-pager status --short
```
