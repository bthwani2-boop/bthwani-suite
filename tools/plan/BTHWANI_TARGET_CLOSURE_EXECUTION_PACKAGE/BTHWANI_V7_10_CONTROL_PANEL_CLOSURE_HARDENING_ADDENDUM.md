# BTHWANI V7.10 CONTROL PANEL CLOSURE HARDENING ADDENDUM

Version: 7.10
Date: 2026-06-01
Placement:
`C:\bthwani-suite\tools\plan\BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE\BTHWANI_V7_10_CONTROL_PANEL_CLOSURE_HARDENING_ADDENDUM.md`

Status:
Hardening addendum for V7. This file does not replace V7. It adds mandatory proof gates for control-panel closure gaps that were not fully proven by the base package.

## 0. Non-Negotiable Closure Rule

No section, lane, tab, workspace, or surface is closed until every applicable V7.10 gate below is proven by local repo evidence.

Required evidence root:

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}\{SESSION_ID}.zip
```

Required closure language:

```text
UNPROVEN
BLOCKED_WITH_REASON
NOT_APPLICABLE_WITH_REASON
REVIEW_REQUIRED
```

Forbidden closure language without evidence:

```text
100%
CLOSED
READY
PASS
FINAL
```

Universal BThwani rules:

```text
توجب الالتزام بنظام الألوان المركزي
تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر
```

Reusable or repeatable design must be centralized through `@bthwani/ui-kit`. Do not create local reusable design patterns inside screens.

DSH demo, mock, seed, preview data, and media must be centrally owned only under:

```text
dsh/frontend/data
dsh/frontend/media-fixtures
```

Other files may contain only imports, references, adapters, mappers, consumers, IDs, references, and `mediaKey` values.

On-demand retrieval is required:

```text
summary-first
detail-on-open
IDs/references/mediaKey
pagination or cursor when data grows
lazy sections
no full duplicated objects
no eager loading across unrelated surfaces
```

Visual polish must not start before logic, flow, data, media, and performance gates are classified.

## 1. Large File / God File Gate

A source file is blocked if it exceeds either threshold unless the exception is justified with local evidence:

```text
soft warning: > 500 physical lines or > 60 KB
hard blocker: > 800 physical lines or > 100 KB
```

Mandatory classification:

```text
screen
model
adapter
states
drawers
parts
registry
types
data consumer
legacy/dead
```

Required matrix:

```text
file | owner | affected surfaces | physical lines | size KB | role classification | visible symptom | missing proof | required evidence | allowed action | forbidden action | verification | decision status
```

Allowed action:

```text
split by proven role ownership
preserve progressive flat topic module
keep behavior unchanged unless a logic gate requires a bounded fix
```

Forbidden action:

```text
split for aesthetics only
create nested folders without a proven overloaded role
stack new code over dead, duplicate, leaked, or fragmented code
move files before Topic Decision Matrix and Topic Boundary Contract when movement is involved
```

Decision:

```text
LARGE_FILE_CLEAR
LARGE_FILE_SPLIT_REQUIRED
LARGE_FILE_BLOCKED_WITH_REASON
```

## 2. Performance / Browsing Speed Gate

Performance must be checked while coding, not after completion.

Control-panel and web practical checks:

```text
no full dataset loaded into initial screen when summary is enough
no full table/list render without pagination, virtualization, or capped rows
no heavy chart/map/editor/modal mounted before user opens it
no image layout shift; reserve dimensions/aspect for image/media cards
no local duplicated objects copied into cards
no per-render sort/filter/map over large arrays without a memoized view model
no repeated request or state reset on tab/back navigation
no hidden expensive effects in tab content
no global re-render caused by local tab/drawer state
no large inline mock arrays inside .tsx screens
```

Numeric targets when measured:

```text
LCP <= 2.5s
INP <= 200ms
CLS <= 0.1
75th percentile when field data exists
```

If not measured:

```text
PERFORMANCE_NUMBERS_UNPROVEN
PERFORMANCE_RISK_MATRIX_REQUIRED
```

Required matrix:

```text
area | owner | affected files/surfaces | current loading shape | browsing symptom | missing proof | required evidence | allowed action | forbidden action | verification | decision status
```

Allowed action:

```text
summary-first payloads
detail-on-open sections
IDs/references/mediaKey instead of full nested objects
pagination, cursor, virtualization, capped rows, lazy loading
memoized view models for sort/filter/group work
```

Forbidden action:

```text
claim measured improvement without measurement
load every tab or detail panel at first render
duplicate full objects across tabs, cards, or surfaces
hide expensive logic inside visual polish work
```

Decision:

```text
PERFORMANCE_CLEAR
PERFORMANCE_FIX_FIRST
PERFORMANCE_NUMBERS_UNPROVEN_WITH_RISK_MATRIX
PERFORMANCE_BLOCKED_WITH_REASON
```

## 3. Support / Disputes / Escalations Anti-Confusion Gate

Support must behave as a control-panel-first command workspace, not repeated informational tabs.

Canonical support workspace model:

```text
Support Command Center
Intake / Tickets
Disputes
Escalations
SLA / Priority
Refund / Compensation handoff
Evidence / Conversation
Resolution / Close
Audit / History
```

Every support tab must have:

```text
distinct operational meaning
unique primary entity
unique queue or lifecycle state
unique action set
clear owner
clear output/result
no duplicated KPI, copy, cards, or placeholder lists from another tab
no button/icon without handler or disabled reason
no tab whose only difference is text labels
```

Mandatory support tab dedupe matrix:

```text
tab | owner | affected files/surfaces | user purpose | primary entity | lifecycle state | primary actions | output/result | shared data? | duplicate content risk | missing proof | required evidence | allowed action | forbidden action | verification | merge/split/keep | decision status
```

Allowed action:

```text
merge duplicated tabs
split overloaded tabs by lifecycle
disable API-later actions with reason
route support actions by explicit ID or route intent
```

Forbidden action:

```text
copy another support tab and rename labels
show refund, compensation, dispute, or escalation controls without ownership boundary
use text matching as the action router when route intent or ID exists
```

Decision:

```text
SUPPORT_TABS_CLEAR
SUPPORT_TAB_DUPLICATION_FIX_REQUIRED
SUPPORT_WORKSPACE_REMODEL_REQUIRED
SUPPORT_BLOCKED_WITH_REASON
```

## 4. Finance / WLT Bridge Completion Gate

Finance is not closed until the control-panel financial operating model and WLT bridge are classified.

Minimum finance domains:

```text
Finance Overview
Ledger / Journal
Wallets / Balances
Transactions
Orders financial settlement
Partner payouts
Captain payouts
Refunds
Compensation
Fees / commission
Tax / invoice
Reconciliation
Disputes financial impact
Promotions / coupons financial impact
Risk holds / blocked funds
Provider / payment gateway status
Audit / rollback preview
Reports / exports
```

Required matrix:

```text
domain | owner | affected files/surfaces | route/tab/screen | source data | current UI state | missing logic | linked surfaces | WLT bridge needed? | API later? | safe UI-only now? | missing proof | required evidence | allowed action | forbidden action | verification | priority | decision status
```

Allowed action:

```text
classify WLT ownership
show read-only or preview state with evidence
disable finance mutations until API/runtime boundary exists
use audit/rollback preview language for important financial actions
```

Forbidden action:

```text
implement backend, API, runtime, database, payment, or provider changes without explicit approval
claim ledger, payout, refund, reconciliation, or settlement closure from UI-only proof
create finance demo rows inside screens
```

Decision:

```text
FINANCE_CLEAR
FINANCE_WLT_GAPS_FIX_REQUIRED
FINANCE_API_LATER_CLASSIFIED
FINANCE_BLOCKED_BY_WLT
FINANCE_BLOCKED_WITH_REASON
```

## 5. Registry / Types Coverage Gate

Every control-panel section must have a registry or owner entry and a typed section contract, unless explicitly marked `NOT_REQUIRED_WITH_REASON`.

Required sections:

```text
dashboard
operations
finance
support
partners
catalogs
marketing
platform
administration
hr
```

For each section prove:

```text
route/entry exists
registry or section descriptor exists
types/model exists or NOT_REQUIRED_WITH_REASON
ownerPath exists
navigation label exists
tab model exists when internal tabs exist
action contract exists for command bar actions
no duplicate owner for the same section
```

Required matrix:

```text
section | owner | affected files/surfaces | route/entry | registry file | types/model file | ownerPath | navigation label | tabs typed? | actions typed? | linked surfaces | missing proof | required evidence | allowed action | forbidden action | verification | decision status
```

Allowed action:

```text
add or correct registry references
add local type references only when they are package-owned and in scope
use adapters/consumers rather than duplicating section truth
```

Forbidden action:

```text
create duplicate owners for one section
invent API/backend contracts
hide untyped command actions behind generic string handlers
```

Decision:

```text
REGISTRY_TYPES_CLEAR
REGISTRY_TYPES_FIX_REQUIRED
SECTION_OWNER_CONFLICT
REGISTRY_TYPES_BLOCKED_WITH_REASON
```

## 6. Demo Data / Media Centralization Gate

All DSH experimental, demo, mock, seed, preview data, and media must be centrally owned only under:

```text
dsh/frontend/data
dsh/frontend/media-fixtures
```

Other apps, surfaces, and control-panel files may contain only:

```text
imports
references
adapters
mappers
consumers
IDs/references/mediaKey
```

Forbidden:

```text
local const demo... = [...] inside screen files
local mock orders/products/stores/campaigns/tickets/finance rows in .tsx
alternate local image paths for the same demo entity
screen-owned sample objects
duplicated full objects across tabs/surfaces
old dsh/media-fixtures as an active path
base64 media inside data
```

Required matrix:

```text
file | owner | affected files/surfaces | local demo/data/media symptom | entity type | current owner | canonical owner | missing proof | required evidence | allowed action | forbidden action | verification | safe now? | linked consumers | decision status
```

Allowed action:

```text
move demo truth to dsh/frontend/data
move media fixtures to dsh/frontend/media-fixtures
replace full objects in screens with IDs, references, adapters, or mediaKey
mark old dsh/media-fixtures only as LEGACY_PATH_REFERENCE
```

Forbidden action:

```text
create new screen-local demo arrays
copy the same demo entity across surfaces
activate old dsh/media-fixtures
bundle full media payloads into screen data
```

Decision:

```text
DEMO_DATA_CLEAR
DEMO_DATA_CENTRALIZATION_FIX_REQUIRED
DEMO_MEDIA_PATH_FIX_REQUIRED
DEMO_DATA_BLOCKED_WITH_REASON
```

## 7. Functional UI Logic Gate

No visible control is acceptable unless it has a defined behavior boundary.

Required matrix for every button, icon, CTA, dropdown, tab, KPI, badge, and action:

```text
element | owner | affected files/surfaces | visible label/icon | handler | disabled reason | result state | source/mapping | audit needed? | API later? | safe UI-only? | missing proof | required evidence | allowed action | forbidden action | verification | decision status
```

Forbidden:

```text
icon-only action without accessible label
clickable-looking static element
approve/publish/refund/rollback/delete action without confirmation or boundary
tab that changes visual active state only but not content/state
command bar action without action map
KPI, badge, or status without source and mapping
```

Allowed action:

```text
wire a local handler when behavior is UI-only and in scope
disable API-later actions with explicit reason
add route intent or ID-based action mapping
add source and formula mapping for KPI/badge/status
```

Forbidden action:

```text
create hidden runtime mutation
call backend/API/database/provider without approval
show destructive actions without confirmation, audit, rollback preview, or disabled boundary
```

Decision:

```text
FUNCTIONAL_UI_CLEAR
HANDLER_OR_DISABLED_REASON_FIX_REQUIRED
ACTION_BOUNDARY_FIX_REQUIRED
FUNCTIONAL_UI_BLOCKED_WITH_REASON
```

## 8. Execution Priority

When multiple issues exist, execute in this order:

```text
1. package/agent/governance blocker
2. registry/types coverage blocker
3. large file / god file blocker
4. functional UI/action blocker
5. support duplication/confusion blocker
6. finance/WLT missing domain blocker
7. demo data/media centralization blocker
8. performance blocker
9. visual design closure
```

Execution rules:

```text
one task per cycle
current local branch only
no commit / push / PR / merge
no dependencies or lockfile changes
no API/backend/runtime/database mutation
no movement to the next task without human approval
```

If the current target hits an earlier blocker, stop there and return:

```text
BLOCKED_WITH_REASON
NEXT_SAFE_ACTION
REVIEW_REQUIRED
```

## 9. Hard Stop

Do not claim:

```text
100%
CLOSED
READY
PASS
FINAL
```

until local evidence proves all applicable V7.10 matrices are either:

```text
evidence-proven
NOT_APPLICABLE_WITH_REASON
BLOCKED_WITH_REASON
```

Hard-stop matrix:

```text
claim attempted | owner | affected files/surfaces | missing gate | missing evidence | required evidence path | allowed replacement wording | forbidden wording | verification | decision status
```

Allowed replacement wording:

```text
REVIEW_REQUIRED
UNPROVEN
BLOCKED_WITH_REASON
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
API_LATER_CLASSIFIED
PERFORMANCE_NUMBERS_UNPROVEN_WITH_RISK_MATRIX
```

Final decision for a V7.10 control-panel closure cycle must remain conservative unless the evidence package proves otherwise.
