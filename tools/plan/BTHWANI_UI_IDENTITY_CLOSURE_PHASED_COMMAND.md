# BTHWANI UI IDENTITY CLOSURE — PHASED EXECUTION COMMAND

> **Purpose:** Execute BThwani UI identity unification safely, gradually, and with evidence.
> **Target repo:** `C:\bthwani-suite`
> **Canonical GitHub repo:** `bthwani2-boop/bthwani-suite`
> **Mode:** phased execution with mandatory human approval after every phase.
> **Decision rule:** no `PASS`, `READY`, `CLOSED`, or `100%` claim without verifiable evidence.

---

## 0. Final professional decision

Adopt one central design contract only:

```text
Contract file count = 1
Canonical contract file = governance/08_UI_KIT_AND_BRAND.md
```

Do **not** create separate contract files such as:

```text
UI_COLORS_CONTRACT.md
UI_ICONS_CONTRACT.md
UI_BUTTONS_CONTRACT.md
UI_RTL_CONTRACT.md
UI_FONTS_CONTRACT.md
```

Those would create fragmentation, duplicated authority, and future drift.

Guards are not contract files. Guards are enforcement tools for the single contract.

Expected files in the first governance stage:

```text
1. governance/08_UI_KIT_AND_BRAND.md
2. tools/guards/guard-ui-kit-central-design-ownership.mjs
3. tools/guards/guard-ui-kit-central-design-ownership.config.json
4. tools/guards/guard-platform-vars-control.mjs or config when relevant
5. tools/guards/guard-manifest.json only if needed
6. package.json only if a missing guard script must be exposed
```

Expected new files inside `ui-kit`: **0 by default**.

---

## 1. Non-negotiable architecture law

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports only
→ Tamagui internally inside ui-kit only
```

### Allowed

```text
- Screens consume @bthwani/ui-kit public exports.
- ui-kit may use Tamagui internally when useful.
- Existing ui-kit files may receive carefully bounded variants/types/props.
- Surface-specific composition remains in the surface.
```

### Forbidden

```text
- Direct import from tamagui outside ui-kit.
- Direct import from @tamagui/* outside ui-kit.
- Deep import from @bthwani/ui-kit/src or ui-kit/src outside ui-kit.
- Local design systems in apps/surfaces.
- Local tokens/theme/palette/style recipes when reusable.
- Hardcoded random colors when a semantic token exists.
- Free-form design editing from Platform Vars.
- Moving business logic/API/runtime state/DSH-WLT behavior into ui-kit.
- Creating new ui-kit files unless human-approved with evidence.
```

---

## 2. Identity scope to unify

Every reusable visual pattern must have exactly one central owner.

```text
Colors / semantic roles            → ui-kit/foundation
Typography / text roles / fonts    → ui-kit/foundation + Text roles
Spacing / radius / elevation       → ui-kit/foundation
Motion / opacity / z-index         → ui-kit/foundation
Icons / icon buttons               → Icon / IconButton / DirectionalIcon
Buttons / actions                  → Button / StickyActionBar / action variants
Cards / surfaces / sheets          → Card / Surface / SheetFrame / Dialog / Modal
Badges / chips / status tags       → Badge / Chip / WebControlPanelStatusTag
Headers / top bars                 → ScreenHeader / MobileWorkspaceHeader / WebControlPanel*
Navigation chrome                  → BottomNavBar / Web rail / tabs
States                             → StateView / LoadingState / EmptyState / ErrorState / SuccessState
Forms                              → TextField / SelectField / Checkbox / Radio / Switch
Lists / rows / dense tables        → ListItem / OptionRow / DataTable / WebControlPanelQueue
Banners / hero / marketing         → Banner / BannerCarousel / StoreHero / WebMissionHeroCard
Media/image display                → Image/media components + central DSH fixture policy
RTL/direction/language             → ui-kit direction helpers and providers only
Accessibility/touch/focus          → ui-kit component contracts
Performance                        → lean payloads, no duplicated heavy visual data, no eager UI inflation
```

---

## 3. Surface-first contract

Identity must be central, but each surface keeps its own product purpose.

```text
Control Panel-first:
Dense, operational, KPI, queue, inspector, map, policy, vars, audit, rollback.

Website-first:
Public marketing, hero, trust, conversion, storytelling, SEO.
Design redesign is deferred for now; only contract/guard/inventory now.

Webapp-first:
Authenticated web experience, account/order/wallet/service flows.
Design redesign is deferred for now; only contract/guard/inventory now.

Mobile-first:
Touch-first, safe-area, bottom nav, one-primary-action, state clarity, speed.

Client-first:
Marketing discovery, banners, store/product cards, checkout, tracking.

Partner-first:
Inventory, order handling, product media, availability, rejection, operational clarity.

Captain-first:
Fast field execution, pickup/dropoff, status transitions, POD, COD, fail/return.

Field-first:
Visits, readiness, inspection, checklists, field onboarding.
```

---

## 4. Typography and fonts contract

Typography is part of the same single contract file. Do not create a separate fonts contract.

### Required rules

```text
- All surfaces must consume typography through ui-kit Text roles or approved primitives.
- fontFamily outside ui-kit is forbidden unless explicitly allowlisted for technical bridge code.
- repeated fontSize/fontWeight/lineHeight outside ui-kit must be replaced by Text roles or tokenized variants.
- Arabic, Latin, display, and mono font families are owned centrally.
- density differences between mobile/control-panel/website/webapp must be expressed through roles/profiles, not local CSS/StyleSheet recipes.
```

### Human approval required before choosing actual brand fonts

Do not download, embed, or add font files without explicit human approval. Font files must not be shared back to the user.

---

## 5. Platform Vars design policy contract

Platform Vars may control **approved design policies**, not raw design internals.

### Correct flow

```text
Platform > Vars
→ approved design policy/profile only
→ ui-kit resolver/theme output
→ surfaces consume @bthwani/ui-kit public exports
```

### Allowed Design Vars

```text
VAR_UI_APPEARANCE_MODE = lightPremium | darkGlass
VAR_UI_FONT_PROFILE = arabic-system | arabic-premium | arabic-readable
VAR_UI_DENSITY_PROFILE = compact | comfortable | spacious
VAR_UI_RADIUS_PROFILE = soft | balanced | sharp
VAR_UI_MOTION_PROFILE = reduced | standard | expressive
VAR_UI_MARKETING_EMPHASIS = calm | premium | campaign
VAR_UI_CONTROL_PANEL_DENSITY = compact | balanced
```

### Forbidden Design Vars

```text
- free HEX input
- free font family text input
- free token-by-token editing
- direct mutation of ui-kit source from control panel
- financial/WLT logic inside design vars
- bypassing audit/rollback
- applying runtime mutations without backend/API/DB contract and human approval
```

### Current stage

```text
Platform Vars stage = preview/control-room policy only
No backend mutation
No database write
No runtime binding
No provider switching
No financial var mutation
```

Binding Platform Vars to real runtime design behavior is a later phase and requires separate human approval.

---

## 6. Closed-loop execution law

Every phase must run as a closed loop:

```text
1. Scope declaration
2. Evidence snapshot
3. Minimal implementation or audit
4. Verification commands
5. Evidence pack
6. Human-readable decision: DONE / BLOCKED / NEEDS_REVIEW
7. Stop and request human approval before the next phase
```

No phase may proceed automatically to the next phase.

---

## 7. Noise cleanup law

The execution must clean noise without unsafe deletion.

```text
Required:
- identify duplicate local design recipes
- identify dead visual styles
- identify unused local design objects
- identify local token aliases
- identify scattered repeated components
- classify before deletion: reusable / screen-specific / dead / legacy / risky
- delete only after replacement and verification
- preserve business logic and runtime behavior
```

Forbidden:

```text
- broad deletion without evidence
- deleting files because they look old
- deleting docs/evidence needed for traceability
- moving DSH/WLT behavior into ui-kit
- fixing design by changing backend/API/finance logic
```

---

## 8. Premium Visual Identity & Performance Standards

To ensure a visual identity that combines luxury, practicality, and high performance across all surfaces, the following standards must be strictly enforced:

### A. Central Brand Colors & Visual Contrast (الألوان والتباين البصري)
* **Core Brand Identity:** Trust via `deepBlue` (`#0A2F5C`), primary action emphasis via `orange` (`#FF500D`), and clean surfaces via `white` (`#FFFFFF`).
* **Visual depth:** Enhance premium quality using semantic roles and presets from `lightPremium` and `darkGlass` (e.g. `deepBlueElevated` or `offWhite`).
* **High Contrast:** Ensure strong readability (e.g., white text on `deepBlue` backgrounds, or `deepBlue`/`ink` text on light surfaces).
* **No local colors:** Hardcoded, raw color hexes are forbidden outside `@bthwani/ui-kit`.

### B. Typography & Text Relationships (الخطوط وتنسيق النصوص)
* **Standardized Roles:** Use typography scale and text roles defined in `foundation.ts` (e.g. `hero`, `titleXl`, `bodyMd`). No custom font families, inline `fontFamily` strings, or manual font size overrides.
* **Hierarchical Balance:** Maintain visual balance between headlines (using bold display weights) and readable body copy (using regular weights).

### C. Iconography & Graphical Integrity (العناصر الرسومية والأيقونات)
* **Unified Icons:** All icons and icon buttons must reside within the central design system and be exported via `@bthwani/ui-kit/Icon` or `IconButton`.
* **Standard sizing:** Sizing must align to the scale specified in `rawSizingScale` (16, 20, 24 pixels).
* **No raw styling:** Developers must not override size or color values manually; instead, specify the centralized `tone` and `size` properties.

### D. Spacing, Radius, & Depth (الفراغات والأركان والظلال)
* **Generous spacing:** Follow raw spacing scale (`rawSpacingScale`). Maintain adequate margins and paddings around components (such as doubling space around key headings).
* **Consistent corners:** Utilize standard radius sizes (`radius md` or `lg` from `rawRadiusScale`).
* **Cohesive depth:** Use central `shadowPresets` (raised, overlay, floating) to build depth without creating visual clutter or battery/perf drain.

### E. Component Architecture & Header Law (مكونات وهندسة الواجهات)
* **Reusable Primitives:** Elements such as buttons, cards, headers, status tags, sheets, and banners must be centralized in `@bthwani/ui-kit`.
* **Header Law Compliance:** Orange headers for top-level pages, white headers for sub-pages, and dense admin top bars for control panels.

### F. RTL Alignment & Logical Flow (محاذاة الاتجاهات واللغة العربية)
* **RTL correctness:** Align text to the right for Arabic content. Keep icon + label clustered as a single unit on the right side in rows, with action/chevron buttons on the left.
* **Layout integrity:** Avoid `space-between` layouts that separate icons from their associated text. Ensure zero text-clipping.

### G. Performance, Loading, & Lazy-first Policy (الأداء والتحميل الفائق)
* **Asset Optimization:** Use SVG icons or icon fonts instead of heavy images.
* **Eager vs Lazy rendering:** Implement lazy loading for images and list views. Ensure screen loading, empty, and error states consume central `StateView` primitives.
* **Lean Motion:** Utilize motion values from `rawMotionScale` (120ms to 320ms) for transitions. Avoid heavy CSS filter shadows.

### H. Verification & Visual Evidence Gate (بوابة التحقق البصري)
* **Evidence contract:** Every UI change must document before/after screenshots, viewport size, RTL alignment validation, CTA visibility check, and zero-clipping verification.

---

# PHASED EXECUTION COMMAND FOR AGENT / COPILOT

Use the following command exactly. Execute one phase only at a time and stop for human approval.

```text
اعمل داخل الريبو الحالي فقط: C:\bthwani-suite.

المطلوب: تنفيذ برنامج BTHWANI_UI_IDENTITY_CLOSURE على مراحل مغلقة، صارمة، ومتسلسلة، مع طلب موافقة الإنسان بعد كل مرحلة قبل الانتقال لما بعدها.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

الهدف النهائي:
توحيد هوية BThwani التصميمية والتسويقية والعملية عبر جميع الأسطح من خلال @bthwani/ui-kit كمالك مركزي وحيد لكل تصميم قابل لإعادة الاستخدام، مع الحفاظ على اختلاف كل سطح حسب مبدأ first الخاص به، ومنع التضخم والتكرار والضجيج والفشل والانحراف البصري.

القواعد غير القابلة للكسر:
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only.
- Tamagui مسموح داخل @bthwani/ui-kit فقط وممنوع خارجه.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- عدد ملفات الكونتراكت = 1 فقط: governance/08_UI_KIT_AND_BRAND.md.
- لا تنشئ ملفات contract جديدة.
- لا تضخم ui-kit.
- لا تنشئ ملفات جديدة داخل ui-kit إلا بعد إثبات الضرورة وطلب موافقة الإنسان.
- لا تنقل business logic أو API أو runtime state أو DSH/WLT-specific behavior إلى ui-kit.
- لا تنقل one-off screen layout إلى ui-kit.
- webapp وwebsite: جهّز contract/guards/inventory فقط الآن، وأجّل redesign البصري لمرحلة لاحقة.
- Platform Vars للتصميم تكون presets/profiles فقط، لا free HEX ولا free font ولا token editor مفتوح.
- WLT يبقى المالك الوحيد لأي منطق مالي.
- لا تدّعِ PASS أو CLOSED أو 100% بدون evidence قابل للتحقق.

نفّذ بنظام الدوائر المغلقة:
Scope → Evidence → Apply/Audit → Verify → Evidence Pack → Decision → STOP FOR HUMAN APPROVAL.

ابدأ من Phase 0 فقط، ولا تنتقل إلى Phase 1 إلا بعد موافقة الإنسان.
```

---

## Phase 0 — Current branch truth and evidence gate

### Goal
Verify the real current local state before any design work.

### Scope
No source edits.

### Required checks

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git rev-parse HEAD
git status --short
git --no-pager diff --stat
git --no-pager diff --check
git ls-files --others --exclude-standard
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel
```

### Required output

```text
- current branch
- current commit
- local modified/staged/untracked inventory
- guard results
- CI/GitHub state if available
- decision: DONE / BLOCKED / NEEDS_REVIEW
- STOP: request human approval
```

### Human approval gate

```text
Do not continue to Phase 1 until the human approves Phase 0 evidence.
```

---

## Phase 1 — Single contract hardening only

### Goal
Update only the single central contract file.

### Allowed file

```text
governance/08_UI_KIT_AND_BRAND.md
```

### Add or strengthen sections

```text
- BTHWANI_UI_IDENTITY_CONTRACT_V1
- Ownership Contract
- Boundary Contract
- Reusable Pattern Contract
- Typography & Font Ownership Contract
- Platform Design Vars Policy Contract
- Lane-first Contract
- Noise Cleanup Contract
- Closed-loop Execution Contract
- Human Approval Gate Contract
- Evidence Gate Contract
```

### Forbidden

```text
- no ui-kit source edits
- no package.json edits
- no lockfile edits
- no new contract files
- no redesign
```

### Verify

```powershell
git --no-pager diff -- governance/08_UI_KIT_AND_BRAND.md
git --no-pager diff --check
```

### Human approval gate

Stop and ask human to approve the contract text before Phase 2.

---

## Phase 2 — Guard strengthening without broad redesign

### Goal
Make the contract enforceable with minimal guard changes.

### Preferred files

```text
tools/guards/guard-ui-kit-central-design-ownership.mjs
tools/guards/guard-ui-kit-central-design-ownership.config.json
tools/guards/guard-platform-vars-control.mjs or config if design vars rules already belong there
tools/guards/guard-manifest.json only if required
package.json only if a missing script is required
```

### Guard coverage to add or strengthen

```text
- local color palettes/tokens/themes outside ui-kit
- local typography/fontFamily/fontSize/fontWeight repeated outside ui-kit
- local StyleSheet design recipes that look reusable
- duplicated Button/Card/Header/State/Nav/Form/Badge/Chip patterns
- direct icon color/size/container drift outside ui-kit
- lane misuse: control-panel vs webapp vs website vs mobile
- design vars free HEX/free font/token editor bypass
- ui-kit new file inflation without allowlist
```

### Forbidden

```text
- no redesign
- no moving components
- no ui-kit component refactor unless separately approved
```

### Verify

```powershell
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel
# run the strengthened/new guard script
# run targeted node syntax check for changed guard files
git --no-pager diff --check
```

### Human approval gate

Stop and ask human to approve guard behavior before Phase 3.

---

## Phase 3 — Numeric UI identity audit

### Goal
Produce a full inventory of design drift without applying fixes.

### Audit targets

```text
ui-kit
dsh/frontend
wlt/frontend
app-client
app-partner
app-captain
app-field
control-panel
webapp
website
```

### Classify every finding

```text
- file
- surface
- pattern type
- owner expected
- reusable or screen-specific
- severity: BLOCKER / HIGH / MEDIUM / LOW
- suggested phase
- safe action
- evidence line
```

### Required categories

```text
- Tamagui/deep import boundary
- local tokens/themes/palettes
- local typography/font drift
- icon drift
- button/card/header/state/nav drift
- RTL/layout drift
- control-panel/webapp/website/mobile lane drift
- Platform Vars design policy gaps
- ui-kit internal hardcoded visual values
- dead/noisy/duplicate design code
```

### Human approval gate

Stop and ask human to approve the prioritized fix order before Phase 4.

---

## Phase 4 — Minimal ui-kit contract hardening

### Goal
Only strengthen existing ui-kit components/types/variants where audit proves necessary.

### Allowed approach

```text
- use existing ui-kit files first
- add props/variants/types inside existing files
- use Tamagui only internally inside ui-kit if helpful
- preserve public compatibility
- no new ui-kit files unless human-approved
```

### Candidate areas

```text
- Icon / IconButton / DirectionalIcon
- Text roles / typography resolver
- Button variants
- Card/Surface variants
- Badge/Chip status tones
- StateView families
- navigation/header variants
```

### Forbidden

```text
- no mass migration
- no redesign of all screens
- no business logic movement
```

### Human approval gate

Stop after evidence and ask approval before consumer migrations.

---

## Phase 5A — Client-first consumer adoption

### Goal
Unify repeated marketing/client patterns in app-client only.

### Scope examples

```text
home
store
product cards
banner/hero/offer patterns
cart/checkout visible states
tracking visible states
bottom navigation
icons/buttons/chips/cards used repeatedly
```

### Rules

```text
- no API/runtime/flow rewrite
- no WLT finance mutation
- no broad redesign
- replace local reusable recipes with ui-kit public exports
- keep screen composition local
```

### Evidence

```text
- typecheck/build targeted
- guards
- screenshots for affected client screens
```

### Human approval gate

Stop before partner/captain/field.

---

## Phase 5B — Partner-first consumer adoption

### Goal
Unify inventory/order/media/status/form patterns in partner app.

### Human approval gate

Stop before captain/field.

---

## Phase 5C — Captain-first and Field-first consumer adoption

### Goal
Unify operational mobile patterns shared by captain and field.

### Focus

```text
status rows
action clusters
POD/failure/return states
visit/readiness/checklists
operational cards
icons/chips/buttons
```

### Human approval gate

Stop before control-panel.

---

## Phase 5D — Control Panel-first adoption

### Goal
Unify control panel sections through WebControlPanel* lane.

### Focus

```text
KPI strips
queues
inspectors
workspace tabs
dense headers
platform/vars screens
operations/order views
```

### Human approval gate

Stop before webapp/website inventory.

---

## Phase 5E — Webapp/Website inventory only

### Goal
Prepare webapp/website for future redesign without redesign now.

### Allowed

```text
- boundary checks
- inventory
- guard coverage
- no direct Tamagui/deep imports
- no local design system
```

### Forbidden

```text
- no visual redesign
- no marketing hero changes
- no public website refactor
```

### Human approval gate

Stop before any future webapp/website design phase.

---

## Phase 6 — Platform Vars design policy preview

### Goal
Prepare Platform > Vars to preview safe design profiles.

### Allowed

```text
- preview/control-room only
- allowlisted VAR_UI_* profiles
- simulation of impact
- audit/rollback preview
```

### Forbidden

```text
- no free HEX
- no free font input
- no backend mutation
- no DB write
- no runtime binding
- no WLT financial mutation
```

### Human approval gate

Stop before any runtime binding phase.

---

## Phase 7 — Visual evidence and performance gate

### Required screenshots if affected

```text
app-client: home/store/cart/checkout/tracking
app-partner: hub/orders/inventory/product media
app-captain: jobs/status/POD/failure
app-field: stores/visit/readiness
control-panel: dashboard/platform/vars/orders/operations
webapp/website: only if touched
```

### Required checks

```text
- RTL correctness
- clipping/overflow
- spacing/alignment
- primary CTA visibility
- icon/text/chevron placement
- loading/empty/error states
- performance risk: no heavy eager visual payloads
```

### Human approval gate

Stop before final closure claim.

---

## Phase 8 — Final closure decision

### Required before closure

```text
- all changed files listed
- all guards pass
- diff-check passes
- targeted typecheck/build passes
- screenshots supplied for affected UI
- no untracked files ignored
- no local design drift remains in accepted scope
- human approval after every previous phase is documented
```

### Allowed decisions

```text
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_VISUAL_EVIDENCE
READY_FOR_PR
```

Do not use `CLOSED` or `100%` unless every gate has verifiable evidence.

---

## Phase evidence pack naming

Every phase must generate evidence under:

```text
tools\registry\runs\{SESSION_ID}\
```

Zip name must be exactly:

```text
{SESSION_ID}.zip
```

No `_HANDOFF.zip` naming.

---

## Minimal local evidence command template

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$IssueCode = "UI_IDENTITY_PHASE_EVIDENCE"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

git branch --show-current > (Join-Path $RunRoot "git-branch.txt") 2>&1
git rev-parse HEAD > (Join-Path $RunRoot "git-head.txt") 2>&1
git status --short > (Join-Path $RunRoot "git-status.txt") 2>&1
git --no-pager diff --stat > (Join-Path $RunRoot "git-diff-stat.txt") 2>&1
git --no-pager diff --name-status > (Join-Path $RunRoot "git-diff-name-status.txt") 2>&1
git --no-pager diff --check > (Join-Path $RunRoot "git-diff-check.txt") 2>&1
git ls-files --others --exclude-standard > (Join-Path $RunRoot "git-untracked.txt") 2>&1
pnpm run guard:tamagui-import-boundary > (Join-Path $RunRoot "guard-tamagui-import-boundary.txt") 2>&1
pnpm run guard:i18n-direction:mobile-control-panel > (Join-Path $RunRoot "guard-i18n-direction-mobile-control-panel.txt") 2>&1

[pscustomobject]@{
  decision = "NEEDS_REVIEW"
  sessionId = $SessionId
  evidenceRoot = $RunRoot
  note = "Phase evidence only. Review logs before claiming pass."
} | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 (Join-Path $RunRoot "evidence.json")

$Zip = Join-Path $RunRoot "$SessionId.zip"
Get-ChildItem -LiteralPath $RunRoot -File |
  Where-Object { $_.Name -ne "$SessionId.zip" } |
  Compress-Archive -DestinationPath $Zip -Force

Write-Host "SESSION_ID=$SessionId"
Write-Host "EVIDENCE_ROOT=$RunRoot"
Write-Host "EVIDENCE_ZIP=$Zip"
```
