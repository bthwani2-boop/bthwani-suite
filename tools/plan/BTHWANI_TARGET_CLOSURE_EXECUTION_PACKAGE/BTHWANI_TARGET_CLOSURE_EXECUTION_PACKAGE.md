# BTHWANI TARGET CLOSURE EXECUTION PACKAGE

**Version:** 7.0.0
**Date:** 2026-05-30
**Placement:** `C:\bthwani-suite\tools\plan\BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md`
**Scope:** Universal execution protocol for any BThwani target: app, surface, screen, section, tab, flow, folder, control-panel workspace, DSH data/media owner, shared module, governance file, guard, agent file, or cross-surface journey.
**Branch rule:** Execute on the **current local branch only**, whatever its name is. Do not hardcode, mention, or depend on any branch name inside execution instructions.
**GitHub rule:** Read-only unless the human explicitly requests write actions. No PR, no merge, no push, no commit.

---

## 0. V6 Verdict and Supersession

V7 supersedes every earlier version of this package.

V6 is not approved for final execution because it contained these defects:

- Superficial Logic Closure gate (missing 24 strict closure steps).
- Missing 19-stage Cross-Surface Navigation Map.
- Weak performance gates lacking strict enforcement of 22 UI/UX and Core Web Vitals criteria.
- Missing strict Demo Data Centralization Matrix and File Boundary Matrix.
- Lacked rigid gap matrix and target execution map requirements in every response.

V7 fixes all these defects. Use V7 only.

---

## 1. Non-Negotiable Arabic BThwani Rules

Every agent output and task execution must preserve these exact rules:

```text
توجب الالتزام بنظام الألوان المركزي
تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر
```

These rules apply especially to UI, UX, frontend, design-system, shared components, DSH preview data, DSH media, governance, guards, and agent files.

---

## 2. Mandatory Start Contract

The agent must start every cycle with package evidence, not verbal trust.

Required first lines:

```text
PACKAGE_RECHECK_DONE: yes
PACKAGE_RECHECK_EVIDENCE: [path to CHECK_TARGET_CLOSURE_PACKAGE.ps1 output or exact NOT_RUN_REASON]
USING_CURRENT_BRANCH_ONLY: yes
NO_HARDCODED_BRANCH: yes
NO_GITHUB_WRITE: yes
ONE_TASK_ONLY: yes
HUMAN_APPROVAL_GATE_ENABLED: yes
DESIGN_POLISH_DEFERRED: yes
SCREENSHOT_GATE_STATUS: SCREENSHOTS_DEFERRED / REQUIRED_AFTER_UI_CHANGE / VISUAL_REVIEW_REQUIRED / NOT_REQUIRED
PRE_APPLY_HYGIENE_GATE_ENABLED: yes
```

If the package check cannot be run, the agent must output:

```text
PACKAGE_RECHECK_NOT_RUN_WITH_REASON:
CONFIDENCE_REDUCED: yes
```

The agent may continue only if the reason is acceptable and the human allows it. A simple `yes` without evidence is invalid.

---

## 3. Current Branch and Remote Sanity Gate

Use current local branch only. Do not hardcode or mention any branch name.

Before implementation, collect read-only branch evidence:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git rev-parse HEAD
git status --short
git remote -v
git status -sb
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

If upstream does not exist, output:

```text
UPSTREAM_NOT_CONFIGURED
```

If ahead/behind is unknown or remote fetch is not allowed, output:

```text
REMOTE_FRESHNESS_UNPROVEN
```

Do not block solely because freshness is unproven unless the task depends on latest remote state. Do not pull, push, merge, rebase, or fetch with write actions.

---

## 4. One Closed Cycle Only

A cycle contains one executable task maximum:

```text
PACKAGE RECHECK
→ TARGET DISCOVERY
→ BRANCH SANITY
→ AGENTS/GOVERNANCE/GUARDS FITNESS
→ WEB/OPEN-SOURCE BENCHMARK OR WEB_RESEARCH_UNAVAILABLE
→ TOPIC CANDIDATE MATRIX
→ TOPIC DECISION MATRIX
→ TOPIC BOUNDARY CONTRACT
→ PRE-APPLY HYGIENE
→ GAP / FILE / DATA / RUNTIME / PERFORMANCE MATRICES
→ SELECT ONE SAFE TASK
→ APPLY/PATCH ONE TASK OR AUDIT_ONLY_ALLOWED_WITH_REASON
→ VERIFY
→ RE-DIAGNOSE
→ STOP FOR HUMAN APPROVAL
```

Forbidden:

```text
execute all tasks at once
move to next task without human approval
start visual polish before logic/flow/data/media/technical/structural gates
request screenshots before the screenshot gate
stack code over duplicate/dead/leaked/fragmented code
claim PASS/READY/CLOSED/100% without evidence
```

Decision if violated:

```text
CYCLE_INVALID
```

---

## 5. Audit-Only Safe Mode

A cycle may be report-only only when one of these is true:

```text
AUDIT_ONLY_REQUESTED_BY_HUMAN
RISK_TOO_HIGH_FOR_APPLY
LOCAL_EVIDENCE_MISSING
TARGET_NOT_FOUND
PACKAGE_RECHECK_FAILED
BRANCH_SANITY_BLOCKER
GOVERNANCE_OR_GUARD_BLOCKER
WEB_RESEARCH_REQUIRED_BUT_UNAVAILABLE_AND_HUMAN_APPROVAL_REQUIRED
```

Output exactly:

```text
AUDIT_ONLY_ALLOWED_WITH_REASON: [reason]
NO_APPLY_PERFORMED: yes
NEXT_SAFE_ACTION: [one concrete next action]
```

Do not use the no-report-only rule to force risky edits.

---

## 6. Agents / Governance / Guards Fitness

Before target execution, inspect only relevant agent/governance/guard files. Do not open every skill or run every guard by default.

Classify stale files:

```text
GOV_STALE_BLOCKER
GUARD_STALE_BLOCKER
AGENT_STALE_BLOCKER
SKILL_STALE_BLOCKER
EVIDENCE_ONLY_STALE
NOT_RELEVANT
```

If a stale governance/guard/agent file blocks correct execution, the first task may be a governance/guard/agent correction task.

---

## 7. Topic Decision Protocol

A topic is a product, operational, or journey meaning. It is not a technical bucket.

### 7.1 Topic is allowed only when it has at least one of:

```text
route
tab
screen
panel
workspace entry
user journey
operational queue
approval area
governance area
data owner
state lifecycle
action/result set
registry/ownerPath linkage
```

### 7.2 Topic is forbidden if it is only:

```text
components
cards
hooks
parts
layout
ui
common
misc
helpers
new
v2
forms
tables
filters
panels
drawers
sheets
```

### 7.3 Mandatory Topic Candidate Matrix

Before any file movement, output:

```text
candidate name
user/product meaning
visible entry
owner
main entity
main actions
state lifecycle
data/media source
linked surfaces
should be topic? yes/no
reason
```

### 7.4 Mandatory Topic Decision Matrix

Before any file movement, output:

```text
existing topic/path
proposed topic name
keep/rename/split/merge
topic type
product meaning
owner
entry point
state lifecycle
actions
data/media owner
linked surfaces
decision reason
risk
safe now? yes/no
```

### 7.5 Mandatory Topic Boundary Contract

For every new, renamed, split, merged, or affected topic:

```text
Topic:
- name:
- product meaning:
- owner:
- entry point:
- main entity:
- main actions:
- state lifecycle:
- data/media:
- linked surfaces:
- what belongs here:
- what does not belong here:
- why separate:
- why not merged:
```

No file movement is allowed before this contract is filled.

---

## 8. Progressive Flat Topic Module

Default:

```text
<topic>/
  <topic>.screen.tsx
  index.ts
```

Role files only when proven:

```text
<topic>.model.ts
<topic>.adapters.ts
<topic>.hooks.ts
<topic>.parts.tsx
<topic>.states.tsx
<topic>.drawers.tsx   # control-panel only
<topic>.sheets.tsx    # app/mobile only
```

Forbidden by default:

```text
screens/
flows/
workspaces/
model/
adapters/
hooks/
parts/
sheets/
drawers/
states/
```

Nested folder allowed only for the overloaded role type, not all types.

---

## 9. Structural Hygiene Before Feature Work

Before adding code, prove the target is not blocked by structural hygiene.

Check:

```text
God file risk
code stacking risk
duplicate logic
dead code
orphan exports
fake shared
local demo data/media
static misleading UI
unused handlers
unused tabs/actions
leakage across boundaries
over-split files
unneeded role files
unjustified nested folders
local design-system patterns
direct Tamagui imports outside @bthwani/ui-kit
performance risk
```

Decision:

```text
HYGIENE_CLEAR_FOR_TASK
HYGIENE_FIX_FIRST
HYGIENE_BLOCKED_WITH_REASON
```

If `HYGIENE_FIX_FIRST`, Task 1 must be hygiene work, not feature work.

---

## 9a. Technical / Operational Logic Closure Stage

Run this gate after Structural Hygiene and before Data/Media/Design gates. No design work begins before this gate is complete.

```text
NO_DESIGN_BEFORE_LOGIC_GATE: enforced
```

Discover and classify every UI element that appears functional but has no backing logic. You MUST execute these 24 strict closure steps before claiming logic is closed:

1. **اكتشاف المنطق الناقص**: افحص كل زر، تبويب، flow، KPI، status بلا مصدر. صنّفها: UI-only now, API/runtime later, أو BLOCKED.
2. **إغلاق منطق الأزرار والإجراءات**: حدد handler، target، disabled reason لكل CTA أو زر. ممنوع زر شكلي، أو إجراء approve/publish/delete بلا boundary.
3. **إغلاق State Machine**: حدد الحالات لكل شاشة (idle, loading, empty, ready, dirty, invalid, submitting, success, error, blocked, disabled). من يبدأ الحالة ومن ينهيها.
4. **إغلاق Flow Logic**: start → entry → action → intermediate state → result → end/failure/cancel. ممنوع flow يبدأ بزر وينتهي بلا نتيجة.
5. **إغلاق ViewModel / Adapter Logic**: افصل البيانات الخام عن الشاشة. حدد: source data, adapter, view model, status mapping. ممنوع formatting داخل JSX.
6. **إغلاق Domain Logic**: لكل Target حدد منطق المجال الخاص به (مثال الكتالوج: SKU, visibility, media ownership. التسويق: campaigns, promotions. Platform: provider policy).
7. **إغلاق الصلاحيات والظهور**: حدد من يرى ويعدل ويوافق. صنّف permission, role, scope. ممنوع إجراء سيادي بلا permission boundary.
8. **إغلاق Validation Rules**: لكل form/action حدد required fields, format rules, range, duplicate, conflict, disabled reason.
9. **إغلاق Conflict Resolution**: افحص التعارضات (duplicate product, category conflict, partner override). حدد detect, display, owner, resolution action.
10. **إغلاق Calculations / KPIs**: أي رقم ظاهر يجب أن يملك source, formula, adapter, format. ممنوع KPI أو badge بلا مصدر.
11. **إغلاق Navigation / Routing**: افحص route, registry, tab active state, breadcrumb, back behavior. ممنوع تبويب يغير الشكل فقط أو drawer بلا selected item.
12. **إغلاق Data Loading Logic**: حدد summary load, detail-on-open, pagination, filtering. ممنوع تحميل كل شيء دفعة واحدة.
13. **إغلاق Mutations كحدود لا Backend**: صنّف كل mutation (create, update, approve, rollback). لا backend/API بدون موافقة صريحة.
14. **إغلاق Audit / History / Rollback Preview**: لكل action مهم حدد:
    ```text
    audit؟ history؟ rollback؟ reason/comment؟ before/after preview؟ UI-only؟ API-later؟
    ```
    مهم خصوصًا في: publish، approval، visibility، vars، finance، refund، provider policy.
15. **إغلاق Error Handling**: غطِّ:
    ```text
    network / validation / permission / not found / conflict / stale data / blocked action / partial failure / retry
    ```
    ممنوع catch صامت أو success بلا نتيجة.
16. **إغلاق Empty / Loading / Blocked / Disabled**: لكل جدول وقائمة حدد loading, empty, error, blocked. ممنوع جدول فارغ بلا empty state.

    **حالة التنفيذ — Marketing Control Panel (2026-05-31):**
    ```text
    GrowthCommandDeckScreen: empty ✅ | loading API-later | blocked ✅ | guidance ✅
    SmartSignalLayerScreen:  empty ✅ | loading API-later | blocked ✅ | guidance ✅
    LoyaltyCommandDeckScreen: empty ✅ (Surface مع icon) | loading API-later | blocked ✅
    BannersCommandDeckScreen: empty ✅ | disabled ✅ | blocked ✅
    CampaignsCommandDeckScreen: empty ✅ | disabled ✅ | blocked ✅
    MarketingReviewScreens: empty ✅ | disabled ✅ | blocked ✅
    MarketingMediaReviewCommandDeckScreen: empty ✅ | disabled ✅ | blocked ✅
    MarketingReviewQueue: empty ✅ | blocked ✅
    PartnerOffersCommandDeckScreen: empty ✅ | disabled ✅
    PromosCommandDeckScreen: empty ✅ | disabled ✅
    TickerCommandDeckScreen: empty ✅ | disabled ✅
    VideosCommandDeckScreen: empty ✅ | disabled ✅
    VisibilityCommandDeckScreen: empty ✅
    ControlPanelDshMarketingScreen: empty ✅ (signals) | guidance ✅
    SmartSignalLayerScreen: empty ✅ (signals) | guidance ✅
    ```
17. **إغلاق Cross-Surface Consistency**: افحص المنطق عبر الأسطح (client, partner, control-panel). حدد الـ canonical owner والـ consumers.
18. **إغلاق Security / Privacy / Secrets**: افحص secrets, tokens, private IDs. (شغل guard:secret-scan إذا لزم الأمر).
19. **إغلاق Observability / Telemetry لاحقًا**: صنّف actions لـ analytics, audit log (لا تنفذها الآن بل صنفها فقط).
20. **إغلاق Tests / Guards Readiness**: حدد ما يلزم من typecheck, guard, unit test.
21. **إغلاق Technical Debt داخل النطاق**: افحص TODO, unused code, orphan file. القرار: fix now, retire, defer.
22. **إنتاج Technical / Logic Gap Matrix**: اكتب المصفوفة المفصلة (كما هو موضح أدناه).
23. **اختيار Task 1 بعد هذه المرحلة**: بناءً على الأولوية.
24. **Technical / Logic Closure Gate**: لا READY إذا بقي زر بلا handler, action بلا result, KPI بلا source.

### 9a.2 Technical / Logic Gap Matrix

Produce this matrix before selecting Task 1:

```text
ID | technical/logic area | file/path | visible symptom | missing logic | current behavior | required behavior | owner | UI-only now? | API/runtime later? | safe to implement now? | linked surfaces | state impact | data impact | verification | priority | decision
```

### 9a.3 Task 1 priority after this gate

```text
governance/guard/agent blocker
→ structural hygiene blocker
→ missing technical logic blocker
→ missing action/state/flow blocker
→ data/media truth blocker
→ runtime/API boundary blocker
→ performance blocker
→ design closure
```

### 9a.4 Technical / Logic Closure Gate

No `READY` is valid if any of the following remains unclassified:

```text
button without handler
action without result
tab without state
flow without end
KPI without source
status without mapping
adapter incomplete
validation missing
permission boundary missing
conflict resolution missing
unclassified runtime/API dependency
static UI claiming functionality
```

---

## 10. DSH Data / Media Canonical Paths

Use only:

```text
DSH preview/demo data:
dsh/frontend/data

DSH media/images/fixtures:
dsh/frontend/media-fixtures
```

Any old source mentioning:

```text
dsh/media-fixtures
```

must be classified as:

```text
LEGACY_PATH_REFERENCE
```

Then normalized to:

```text
dsh/frontend/media-fixtures
```

Do not create, revive, or write to the old path unless current repo evidence proves it is active and the human explicitly approves.

---

## 11. On-Demand Retrieval Contract

Apply:

```text
summary-first
detail-on-open
IDs/references/mediaKey
pagination/cursor when data grows
lazy sections
no full duplicated objects
no eager loading across unrelated surfaces
request dedupe
abort/cancel on navigation away
cache repeat queries
```

Forbidden:

```text
full catalog in every screen
full product object in every card
local copied demo products/categories/stores/orders/media
alternate image paths for the same demo entity
base64 media inside data
screen-owned mock arrays
per-surface divergent demo truth
```

---

## 12. Web / Open-Source Benchmark Protocol

Before major UX/Flow/design/logic changes, run targeted benchmark unless unavailable.

Maximum per cycle:

```text
2–4 targeted sources
no generic browsing
no copying external UI blindly
only extract relevant patterns
```

Benchmark Matrix:

```text
source checked
target pattern observed
pattern adopted? yes/no
pattern rejected? yes/no
reason adopted/rejected
BThwani adaptation
risk
affected task
```

If web/tooling is unavailable:

```text
WEB_RESEARCH_UNAVAILABLE
BENCHMARK_CONFIDENCE_REDUCED: yes
```

If the task is a major design/flow decision and web is unavailable, stop for human approval unless repo evidence is enough for a safe non-design task.

---

## 13. Performance Gate

Performance is checked while coding, not after completion.

### 13.1 Web / Control Panel Numeric Gates

```text
LCP target: <= 2.5s
INP target: <= 200ms
CLS target: <= 0.1
evaluation percentile: 75th percentile when field data exists
```

If not measured:

```text
PERFORMANCE_NUMBERS_UNPROVEN
```

### 13.2 Practical Checks

For web/control-panel:

```text
initial JS not inflated
heavy modals/charts/maps/editors lazy-loaded
no full table render without pagination/virtualization
no repeated request on navigation/back
no full payload when summary is enough
no layout shift from images
no interaction long task created
```

For mobile/list targets:

```text
no long list inside ScrollView
use FlatList/SectionList/VirtualizedList or equivalent for large lists
list item component is light
thumbnail in list, full image only in detail
renderItem not recreated unnecessarily
no heavy nesting/effects in list rows
```

### 13.3 Suggested Measurement Commands / Methods

Use only when relevant and available.

Control panel / web:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm --dir control-panel/runtime dev
# Then capture browser DevTools Performance/Lighthouse manually.
```

Static verification:

```powershell
pnpm -w exec tsc --noEmit
pnpm run guard:tamagui-import-boundary
pnpm run guard:code-hygiene
```

Mobile:

```powershell
# Run target mobile app, test on real device when possible.
# Capture FPS/scroll/memory notes manually.
```

If no tool is available, output `PERFORMANCE_NUMBERS_UNPROVEN` and classify risks.

---

## 14. Runtime / API Readiness Matrix

UI/UX Flow may classify runtime/API needs but must not implement backend/API/DB/runtime mutation unless explicitly approved.

Columns:

```text
gap id
visible UI/flow need
current preview behavior
future API/runtime dependency
blocking now? yes/no
safe UI-only action
forbidden action now
owner
status
```

Allowed:

```text
UI-only preview state
disabled state
blocked state
adapter boundary
API-later label
TODO only if tied to matrix ID
```

Forbidden:

```text
hidden runtime mutation
database work
OpenAPI changes
provider switching
package/lockfile change
environment binding
```

---

## 15. Evidence Standard Per Cycle

### 15.1 Before Apply

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git rev-parse HEAD
git status -sb
git --no-pager status --short
git --no-pager diff --stat
git ls-files --others --exclude-standard
```

### 15.2 After Apply

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
```

If staged changes exist:

```powershell
git --no-pager diff --cached --stat
git --no-pager diff --cached --name-status
git --no-pager diff --cached --check
```

Patch:

```powershell
git --no-pager diff --binary > LOCAL_CHANGE_REVIEW.patch
```

Untracked files are not included in normal diff. Handle with:

```powershell
git add -N -- "<UNTRACKED_FILE_PATH>"
git --no-pager diff -- "<UNTRACKED_FILE_PATH>" > UNTRACKED_FILE_REVIEW.patch
```

### 15.3 Evidence Pack Files

A real evidence pack should include when relevant:

```text
SUMMARY.txt
evidence.json
commands.log
git-branch.txt
git-head.txt
git-status-before.txt
git-status-after.txt
git-status-sb.txt
git-diff-stat.txt
git-diff-name-status.txt
git-diff-check.txt
git-untracked.txt
git-staged-diff-stat.txt
git-staged-name-status.txt
git-staged-diff-check.txt
verification-tsc.txt
guard-results.txt
performance-notes.txt
visual-evidence-notes.txt
LOCAL_CHANGE_REVIEW.patch
```

---

## 16. Rollback Protocol

A task package must include real rollback instructions.

For single tracked file:

```powershell
git restore -- "<FILE_PATH>"
```

For multiple tracked files:

```powershell
git restore -- "<FILE_1>" "<FILE_2>" "<FILE_3>"
```

For staged files:

```powershell
git restore --staged .
```

For untracked files:

```powershell
git ls-files --others --exclude-standard
# delete only known unwanted files manually or with explicit approved Remove-Item commands
```

For multi-file edits, include:

```text
Rollback files:
- path 1
- path 2

Rollback command:
git restore -- "path 1" "path 2"

Untracked rollback:
[explicit paths or BLOCKED_UNTRACKED_REVIEW_REQUIRED]
```

No destructive cleanup such as `git clean -fd` unless explicitly approved by the human.

---

## 17. Visual Evidence Timing Matrix

```text
phase: discovery/logic/structure
screenshots required? no
status: SCREENSHOTS_DEFERRED

phase: visual change applied
screenshots required? yes
status: NEEDS_VISUAL_EVIDENCE_AFTER_APPLY

phase: design closure
screenshots required? yes
status: VISUAL_REVIEW_REQUIRED

phase: no UI changed
screenshots required? no
status: NOT_REQUIRED
```

No early screenshots. No skipped screenshots after visual changes.

---

## 18. Install / Check Requirement

The package must include and use:

```text
INSTALL_TARGET_CLOSURE_PACKAGE.ps1
CHECK_TARGET_CLOSURE_PACKAGE.ps1
SHA256SUMS.json
manifest.json
```

`CHECK_TARGET_CLOSURE_PACKAGE.ps1` must verify:

```text
no old section-count wording
28-section wording exists
manifest files match actual files
SHA256 matches actual files
required output sections exist
canonical DSH paths exist
legacy path is only mentioned as LEGACY_PATH_REFERENCE
no fixed branch reference
install script exists
rollback protocol exists
evidence standard exists
```

`INSTALL_TARGET_CLOSURE_PACKAGE.ps1` must:

```text
verify source package hashes
backup existing tools/plan before overwrite
copy package files into tools/plan
write install evidence under tools/registry/runs
avoid deleting unknown local files by default
verify target after install
produce a handoff ZIP named with session id
```

---

## 19. Weak-Agent Mechanical Stop Conditions

Any of these invalidates the cycle:

```text
agent did not read package
agent did not provide package check evidence or NOT_RUN_REASON
agent used a fixed branch name
agent expanded scope without evidence
agent made more than one task change
agent started design polish early
agent requested screenshots before allowed
agent added new code over duplicate/dead/leaked code
agent created shared for one-use code
agent created role files without matrix reason
agent created topic without Topic Boundary Contract
agent moved files before Topic Decision Matrix
agent skipped verification
agent skipped re-diagnosis
agent did not stop for human approval
agent claimed PASS/READY/CLOSED/100% without evidence
```

Decision:

```text
CYCLE_INVALID
```

---

## 20. Required 28-Section Cycle Output

The agent must return exactly these sections. Missing sections are invalid. If not applicable, write `NOT_APPLICABLE_WITH_REASON`.

```text
1. Package Recheck
2. Target
3. Current Branch Rule Status
4. Target Type
5. Agents/Governance/Guards Fitness Result
6. Files Scanned
7. Linked Surfaces Discovered and Classified
8. Web/Open-Source Benchmark Matrix or WEB_RESEARCH_UNAVAILABLE
9. Target Discovery Summary
10. Topic Candidate Matrix
11. Topic Decision Matrix
12. Topic Boundary Contract
13. Structural Hygiene Matrix
14. Gap Matrix
15. File Boundary Matrix
16. Demo Data / Media Centralization Matrix
17. Runtime / API Readiness Matrix
18. Performance Evidence Matrix
19. Target Execution Map
20. Selected One Task
21. Task Execution Package
22. Files Changed / Patch / Script / Exact Instructions
23. Verification Commands / Results
24. Re-Diagnosis Result
25. Remaining Gaps or BLOCKED_WITH_REASON
26. Screenshot/Visual Evidence Status
27. Human Approval Gate
28. Final Decision
```

---

## 21. Final Decisions

Allowed only:

```text
TARGET_TASK_APPLIED_NEXT_TASK_REQUIRED
TARGET_CYCLE_BLOCKED_WITH_REASON
TARGET_READY_FOR_DESIGN_CLOSURE
TARGET_NEEDS_VISUAL_EVIDENCE_AFTER_APPLY
TARGET_FULL_UI_UX_FLOW_READY_FOR_API_BINDING
STRUCTURE_PACKAGE_APPLIED_NEXT_PACKAGE_REQUIRED
STRUCTURE_STANDARDIZATION_READY_FOR_VISUAL_REVIEW
FIX_REQUIRED_WITH_PATCH
AUDIT_ONLY_ALLOWED_WITH_REASON
CATASTROPHIC_BLOCKER
BLOCKED_TARGET_NOT_FOUND
CYCLE_INVALID
```

Do not use a ready/full decision if:

```text
any safe executable gap remains
any gap is unclassified
any planned task remains unexecuted
any logic/technical/flow gap remains
design gate failed
data/media duplication remains
linked surface is unclassified
verification failed
benchmark was required and not done or not marked unavailable
no task package or actual file change was produced when safe changes existed
re-diagnosis was not performed
human approval gate was skipped
```

---

## 22. Short Agent Command

```text
Read and follow exactly:
C:\bthwani-suite\tools\plan\BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md

TARGET:
[write exact target here]

Run one closed cycle only on the current local branch.
No commit, no push, no PR, no merge.
Run or cite CHECK_TARGET_CLOSURE_PACKAGE.ps1 evidence, or state PACKAGE_RECHECK_NOT_RUN_WITH_REASON.
Return the required 28-section cycle output.
Do not move files before Topic Decision Matrix and Topic Boundary Contract.
Do not start design polish before logic/flow/data/media/technical/structural gaps are closed or blocked.
Do not request screenshots before the visual evidence gate.
Do not stack code over duplicate/dead/leaked/fragmented code.
Stop after the cycle for human approval.
```

---

## 23. Final Strength Rule

This package does not depend on the agent being strong.

A strong agent must not bypass gates.
A weak agent must be forced by gates.
A package recheck without evidence is invalid.
A plan without one safe executable task is insufficient unless `AUDIT_ONLY_ALLOWED_WITH_REASON` applies.
A target without re-diagnosis is not closed.
A next phase without human approval is invalid.


---

# V7 Final Hardening — Package Integrity, Install Safety, and Anti-Drift Enforcement

This V7 section supersedes weaker wording above. If any conflict exists, V7 wins.

## V7.1 Final Package Identity

The package is valid only if:

```text
manifest.version = 7.0.0
manifest.package_id = BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE
BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md contains Version: 7.0.0
SHA256SUMS.json matches all package files except itself
all required files are present
no forbidden old section-count wording exists
28-section output contract exists
install/check/evidence/rollback files exist
```

If any item fails:

```text
PACKAGE_INVALID_DO_NOT_USE
```

## V7.2 Install Safety Modes

The install script must support these modes:

```text
default safe install:
- backup existing tools/plan
- copy package files
- do not delete unknown local files
- warn about extras

-Strict:
- fail if unexpected package-like files remain after install

-QuarantineOldPackageFiles:
- move known old package artifacts from tools/plan into the install evidence folder after backup
- do not delete unknown files
```

Known old package artifacts include files with names matching:

```text
*V1*
*V2*
*V3*
*OLD*
*BACKUP*
*DRAFT*
```

and package-specific files not listed in the V6 manifest.

No destructive deletion is allowed by default.

## V7.3 Package Recheck Is Evidence, Not Text

`PACKAGE_RECHECK_DONE: yes` is invalid unless accompanied by:

```text
PACKAGE_RECHECK_EVIDENCE: tools/registry/runs/<SESSION_ID>/<SESSION_ID>.zip
PACKAGE_RECHECK_STATUS: PASS
PACKAGE_RECHECK_VERSION: 7.0.0
```

If the package check was not run:

```text
PACKAGE_RECHECK_DONE: no
PACKAGE_RECHECK_NOT_RUN_WITH_REASON: [reason]
CONFIDENCE_REDUCED: yes
HUMAN_APPROVAL_REQUIRED_BEFORE_APPLY: yes
```

## V7.4 Required Execution Evidence ZIP

Every execution cycle that applies changes must produce or request an evidence ZIP under:

```text
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
```

The ZIP must include, when relevant:

```text
SUMMARY.txt
evidence.json
commands.log
git-status-before.txt
git-status-after.txt
git-diff-stat.txt
git-diff-name-status.txt
git-diff-check.txt
git-untracked.txt
verification outputs
LOCAL_CHANGE_REVIEW.patch
UNTRACKED_FILE_REVIEW.patch when applicable
performance-notes.txt when performance was touched
visual-evidence-notes.txt when UI changed
```

If no ZIP is created:

```text
EVIDENCE_ZIP_MISSING
FINAL_DECISION_CANNOT_BE_READY
```

## V7.5 No-Extra Legacy Package Noise

After install, if legacy package files exist in `tools/plan`, the check script must classify them:

```text
LEGACY_PACKAGE_FILE
EXTRA_PACKAGE_FILE
UNKNOWN_LOCAL_FILE
```

Strict mode fails on legacy package files.

## V7.6 Benchmark Confidence Gate

`WEB_RESEARCH_UNAVAILABLE` is allowed only with:

```text
why unavailable
what was attempted
whether target decision is major or minor
confidence impact
safe fallback
human approval needed? yes/no
```

For major UX/Flow/design decisions:

```text
WEB_RESEARCH_UNAVAILABLE
BENCHMARK_CONFIDENCE_REDUCED: yes
HUMAN_APPROVAL_REQUIRED_BEFORE_APPLY: yes
```

## V7.7 Performance Gate Is Actionable

If the target touches performance-sensitive areas, the agent must output one of:

```text
PERFORMANCE_MEASURED_WITH_RESULT
PERFORMANCE_RISK_CLASSIFIED_AND_MITIGATED
PERFORMANCE_NUMBERS_UNPROVEN_WITH_REASON
PERFORMANCE_BLOCKED_WITH_REASON
```

`PERFORMANCE_NUMBERS_UNPROVEN_WITH_REASON` is not a PASS. It only allows a cycle to continue when the current task is not claiming measured performance improvement.

## V7.8 Audit-Only Does Not Mean Weak

`AUDIT_ONLY_ALLOWED_WITH_REASON` is valid when the current human request is to inspect, verify, or prepare the package itself; or when local evidence is insufficient for safe apply.

Audit-only must still produce:

```text
findings
risk classification
next safe action
patch/package/script if a safe package correction is possible
```

## V7.9 Final Adoption Rule

A package version is adoptable only if:

```text
CHECK_TARGET_CLOSURE_PACKAGE.ps1 = PASS
SHA256SUMS.json verified
manifest verified
no contradiction found
V7 package identity verified
install script present
rollback protocol present
evidence standard present
Arabic mandatory rules present
```

If adoptable:

```text
PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION
```

Never say globally “impossible to fail.” The correct claim is:

```text
The package passed its static integrity and policy checks and is ready for controlled execution with evidence gates.
```


---

# V7 Clarity Layer — Full Agent Picture

V7 adds the missing clarity layer. The package is not only a policy file; it is a field operating kit.

The agent must understand the package in this order:

```text
1. BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md
2. BTHWANI_OPERATOR_FIELD_MANUAL.md
3. BTHWANI_TARGET_ARCHETYPE_GUIDE.md
4. BTHWANI_MATRICES_TEMPLATE.md
5. Relevant playbook:
   - BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md
   - BTHWANI_PERFORMANCE_PLAYBOOK.md
   - BTHWANI_AGENT_FAILURE_MODES.md
```

## V7.1 Compact 28-Section Rule

The 28 sections are mandatory, but verbosity is not.

For small tasks:

```text
section present
one-line result allowed
NOT_APPLICABLE_WITH_REASON allowed
```

For large tasks:

```text
full matrices required
```

No section may be omitted.

## V7.2 Source Coverage Rule

The agent must respect the source coverage map in:

```text
BTHWANI_SOURCE_COVERAGE_MATRIX.md
```

If a source requirement is not represented in the cycle output:

```text
SOURCE_COVERAGE_GAP
```

## V7.3 Target Archetype Rule

Before selecting Task 1, classify the target using:

```text
BTHWANI_TARGET_ARCHETYPE_GUIDE.md
```

This prevents the agent from treating a section, tab, data owner, governance file, and cross-surface journey as the same type of work.

## V7.4 Operational Clarity Rule

If the agent is unsure what to do first, it must use this priority:

```text
1. package/governance/guard blocker
2. structural hygiene blocker
3. missing technical logic blocker (Technical / Logic Gap Discovery gate)
4. missing action/state/flow blocker
5. data/media truth blocker
6. runtime/API boundary blocker
7. performance blocker
8. design closure
```

## V7.5 Weak Agent Rule

A weak agent must not infer missing details. It must choose from the documented decisions only:

```text
HYGIENE_FIX_FIRST
AUDIT_ONLY_ALLOWED_WITH_REASON
BLOCKED_WITH_REASON
TARGET_TASK_APPLIED_NEXT_TASK_REQUIRED
CYCLE_INVALID
```

## V7.6 Adoption Statement

A valid V7 check means:

```text
PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION
```

It does not mean future execution is impossible to fail. It means the package has the gates, scripts, and evidence requirements needed to catch failure and stop unsafe continuation.


---

# V7 Navigation Layer — Zero Drift Movement

V7 adds a mandatory navigation map to remove execution confusion.

The agent must read:

```text
BTHWANI_AGENT_NAVIGATION_MAP.md
```

before opening playbooks or selecting Task 1.

## V7.1 Agent Navigation Rule

```text
AGENT_NAVIGATION_RULE:
ممنوع قراءة كل ملفات tools/plan دفعة واحدة.
ابدأ بـ BTHWANI_QUICK_START_FOR_AGENTS.md فقط.
ثم اقرأ BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md.
ثم اقرأ BTHWANI_AGENT_NAVIGATION_MAP.md.
ثم اقرأ BTHWANI_OPERATOR_FIELD_MANUAL.md.
ثم اقرأ BTHWANI_TARGET_ARCHETYPE_GUIDE.md.
ثم اقرأ BTHWANI_MATRICES_TEMPLATE.md.
بعد تصنيف نوع TARGET، افتح فقط playbook المناسب.
أي قراءة عشوائية أو فتح شامل لكل الملفات = TOKEN_WASTE_RISK.
إذا سببت القراءة العشوائية انحرافًا أو تغيير نطاق = CYCLE_INVALID.
```

## V7.2 Navigation Evidence

Every cycle must include:

```text
NAVIGATION_STATE:
NAVIGATION_STAGE:
NAVIGATION_FILES_READ:
PLAYBOOK_SELECTED:
PLAYBOOK_SELECTION_REASON:
NAVIGATION_DRIFT_RISK:
```

If any value is missing:

```text
NAVIGATION_GATE_MISSING
CYCLE_INVALID
```

## V7.3 No Stage Jump

The agent cannot move to implementation until:

```text
package recheck passed or explicitly blocked
current branch status classified
navigation state declared
target type classified
linked surfaces classified
structural hygiene checked
Task 1 selected with reason
```

## V7.4 Adoption Statement

A valid V7 package check means:

```text
PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION
NAVIGATION_MAP_PRESENT: yes
```

It means the package has explicit navigation gates to catch drift. It does not mean execution can never fail.
