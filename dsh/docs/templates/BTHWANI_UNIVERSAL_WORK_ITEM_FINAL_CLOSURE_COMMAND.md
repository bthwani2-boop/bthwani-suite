# BThwani Universal Work Item Final Closure Command

**File name:** `BTHWANI_UNIVERSAL_WORK_ITEM_FINAL_CLOSURE_COMMAND.md`
**Language:** English
**Purpose:** A reusable command for VS Code / Gemini / Copilot Agent to close any BThwani work item from A to Z, whether the target is a single slice or a full journey, across DSH, WLT, or DSH/WLT boundaries.
**Canonical local repo:** `C:\bthwani-suite`
**Default GitHub mode:** Read-only. No PR, merge, push, branch mutation, or GitHub write unless explicitly requested by the human.
**Core rule:** No `PASS`, `CLOSED`, `READY`, or `100%` claim without real repo/runtime/Git/visual evidence.

---

## 1. How to Use

Replace only these placeholders before sending the command to the local agent:

```text
[WORK_ITEM_TYPE] = SLICE or JOURNEY

[DOMAIN] = DSH or WLT or DSH_WLT or OTHER

[WORK_ITEM_FILE_PATH] = path to the slice or journey file to close

[SESSION_ID] = unique session id, for example:
DSH_WLT_JOURNEY_001_FINAL_CLOSURE-20260605-153000

[EXECUTION_MODE] =
ONE_SLICE_ONLY
JOURNEY_PLAN_ONLY
JOURNEY_APPLY_SEQUENTIAL
```

Use:

```text
ONE_SLICE_ONLY
```

when the target is one slice only.

Use:

```text
JOURNEY_PLAN_ONLY
```

when the target is a journey and the agent must analyze, order, and prepare the closure plan only, without applying code changes.

Use:

```text
JOURNEY_APPLY_SEQUENTIAL
```

when the target is a full journey and the agent must close it slice by slice, with independent evidence for each slice.

---

## 2. Universal Closure Command

```text
Execute a complete final closure for the specified work item only inside the current repository:

C:\bthwani-suite

Work item type:
[WORK_ITEM_TYPE]

Operational domain:
[DOMAIN]

Target work item path:
[WORK_ITEM_FILE_PATH]

Task / SESSION_ID:
[SESSION_ID]

Execution mode:
[EXECUTION_MODE]

Execute this request completely and radically from A to Z within the specified scope only. Do not move to another scope. Do not claim PASS, CLOSED, READY, or 100% unless the required digital, runtime, Git, and visual evidence proves it.

Goal:
Close the specified work item with maximum precision and with zero gaps, zero missing logic, zero duplication, zero errors, zero contradictions, zero noise, zero weak operation, zero scattering, zero failures, and zero defects.

============================================================
0) Decision Rules
============================================================

You are not allowed to write:

PASS
CLOSED
READY
100%

unless actual evidence proves the claim.

If any in-scope defect remains:
FIX_REQUIRED

If the blocker is external or requires a decision outside the current authority:
BLOCKED_WITH_REASON

If the work is intentionally deferred by a clear decision:
DEFERRED_WITH_REASON

If visual proof is missing:
NEEDS_VISUAL_EVIDENCE

If runtime/API/DB/log proof is missing:
NEEDS_RUNTIME_EVIDENCE

If evidence is incomplete:
NEEDS_EVIDENCE

If the change is unsafe or outside scope:
REVERT_REQUIRED

============================================================
1) Governing Principle
============================================================

This is not a docs-only task.

You must analyze, review, modify, add, and correct everything required to close the specified work item across all directly related layers:

- docs
- frontend
- backend
- API / OpenAPI
- typed clients / transports
- runtime
- DB and logs when needed
- data and media
- control-panel
- app-client
- app-partner
- app-captain
- app-field
- WLT / finance boundary when needed
- guards / scripts / tests
- evidence

Do not merely record a missing item if it is inside the scope. Fix it.

If a missing item is outside the scope, classify it only and do not force it into the current work item:

- OUT_OF_SCOPE_WITH_REASON
- REQUIRED_ADDITION_IN_ANOTHER_SLICE
- BLOCKED_WITH_REASON
- DEFERRED_WITH_REASON

============================================================
2) Slice Scope vs Journey Scope
============================================================

If [WORK_ITEM_TYPE] = SLICE:

- Close the specified slice only.
- Do not close other slices.
- You may update other slices only to record a dependency, gap, status, or blocker discovered during the current slice closure.

If [WORK_ITEM_TYPE] = JOURNEY:

- Read the journey file.
- Extract every child slice.
- Order the child slices by dependency.
- Use this order unless live evidence proves a better order:

  1. foundations / data / media / contracts
  2. API / backend / runtime
  3. frontend / screen / CTA / states
  4. control-panel / operations / audit
  5. WLT / finance boundary
  6. evidence / docs truth sync

- Do not modify everything in one uncontrolled pass.
- If [EXECUTION_MODE] = JOURNEY_PLAN_ONLY:
  - Create a closure plan only.
  - Do not modify production code.
  - Do not apply fixes.
- If [EXECUTION_MODE] = JOURNEY_APPLY_SEQUENTIAL:
  - Close every child slice one by one.
  - Create independent evidence for every child slice.
  - Do not claim PASS for the journey unless all child slices are PASS or non-blocking PASS_WITH_WARNINGS with evidence.

============================================================
3) Strict Constraints
============================================================

- No PR.
- No merge.
- No main modification.
- No GitHub write.
- Work only on the current local branch.
- Do not use or mention any old repository/path named bth as an active target. The only active local repository is C:\bthwani-suite.
- Do not rely on memory or assumptions.
- Read live files first.
- Do not modify @bthwani/ui-kit unless evidence proves the issue belongs to a central shared owner. If a ui-kit change is required, stop and request human approval before implementation.
- For any UI work, enforce:
  Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only.
- The central color system must be followed.
- Noise, duplication, dead code, leakage, fragmentation, and scattering must be removed, treated, and corrected inside the current scope only.
- Do not copy large data across surfaces.
- Apply on-demand retrieval by default:
  IDs, references, lean summaries, detail-on-open, pagination, caching, scoped payloads.
- Do not change dependencies, lockfiles, CI, package scripts, or generated files unless explicitly required by the current scope and proven by evidence.
- Do not delete, move, or rename files without evidence, expected impact, and rollback instructions.
- Do not silence errors. Fix the root cause if it is inside scope.

============================================================
4) Mandatory Financial SSoT Rule
============================================================

WLT is the only Financial Source of Truth.

WLT owns:

- wallet
- ledger
- refund
- payout
- settlement
- reconciliation
- money mutation
- financial transaction state
- financial audit trail
- accounting impact

DSH does not own and must not implement any money mutation.

Any financial need inside DSH must become one of these:

- read/display from WLT,
- authorized WLT API call,
- event/request sent to WLT,
- documented WLT bridge,
- or BLOCKED_WITH_REASON if the WLT contract does not exist.

Forbidden:

- DSH wallet mutation.
- DSH ledger mutation.
- DSH refund mutation.
- DSH payout mutation.
- DSH settlement mutation.
- DSH financial workaround.
- Local financial logic inside DSH screens, DSH backend, control-panel, or apps to bypass WLT.

If [DOMAIN] includes WLT or DSH_WLT:

- Prove WLT ownership before editing.
- Any UI that displays money/payment/settlement/refund/payout must consume WLT-owned data or a documented WLT contract.
- Any action with financial impact must pass through WLT API/event/authorization.
- If the WLT contract is missing, the correct decision is BLOCKED_WITH_REASON or NEEDS_WLT_CONTRACT, not local financial implementation.

============================================================
5) DSH Data and Media SSoT Rules
============================================================

If [DOMAIN] includes DSH:

- Every DSH experimental/demo/mock/seed/preview data item must be centrally owned under:

  dsh/frontend/data

- Every DSH media/image/visual fixture must be centrally owned under:

  dsh/frontend/media-fixtures

- Do not create local divergent demo data or media inside screens, surfaces, apps, or control-panel.
- Use IDs, mediaKey, references, and lean summaries.
- Do not duplicate full objects across every surface.
- If divergent demo copies exist inside the current scope, safely consolidate them to the central owner and update consumers.

============================================================
6) Mandatory Pre-Execution Reading
============================================================

Before implementation, read the relevant agent files and skills, apply what is relevant precisely, and do not rely on memory or assumptions.

Read if present:

- AGENTS.md
- .agents/**
- .agents/skills/**/SKILL.md
- governance/**
- tools/plan/** if referenced by the target work item

If the domain includes DSH, read if present:

- dsh/docs/README.md
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
- dsh/docs/SCREEN_API_MATRIX.md
- dsh/docs/DSH_VISUAL_REVIEW.md
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md

If the domain includes WLT, read if present:

- wlt/** docs / contracts / blueprints
- any finance / ledger / wallet / settlement docs
- any WLT manifest, matrix, decision log, or closure log

Always read:

- [WORK_ITEM_FILE_PATH]
- every route, screen, backend, API, client, data, media, control-panel, WLT, test, guard, and script file referenced by the target work item or required to close it.

If any reference file is missing:

- Record it in evidence as MISSING_REFERENCE.
- Do not assume its content.

============================================================
7) Reality Scan
============================================================

Extract from the target work item:

- Work Item ID
- Work Item Type
- Domain
- Parent Journey
- child slice list if the work item is a Journey
- business outcome
- actor chain
- primary surface
- supporting surfaces
- dependency surfaces
- excluded surfaces + reason
- route/screen owners
- CTAs
- required states
- API/runtime boundary
- backend owner
- data/media owner
- WLT boundary
- vars/provider boundary
- auth/permission boundary
- visual evidence requirement
- runtime evidence requirement
- current status
- blockers
- exit gate
- next action

Verify:

- Is the current status supported by evidence or only a claim?
- Does the evidence path exist and is it reviewable under tools/registry/runs?
- Are there stale paths or moved files?
- Does one file say PASS while another matrix/log says PENDING for the same proof?
- Is the missing item inside scope and must be fixed now?
- Is the missing item outside scope and must be linked to another work item?

Search in a targeted way, not randomly, for:

- Work Item ID
- Slice IDs
- Journey ID
- screen names
- route names
- endpoint names
- operation IDs
- CTA labels
- state labels
- data/media keys
- registry rows
- related guards/scripts/tests
- WLT financial contracts if money/payment/ledger/refund/payout/settlement appears

============================================================
8) Cross-Surface Impact Map
============================================================

Before modifying files, document a short impact map inside the evidence folder:

- surfaces touched by the work item
- surfaces excluded and why
- upstream / downstream / lateral dependencies
- related SSoT files
- data/media owner
- API/runtime owner
- backend owner
- control-panel owner if present
- WLT boundary if present
- auth/vars/provider boundary if present
- what will be modified inside scope
- what will only be recorded as an external dependency/gap

Classify every finding:

- IN_SCOPE_FIX_NOW
- IN_SCOPE_DOC_SYNC_NOW
- OUT_OF_SCOPE_WITH_REASON
- REQUIRED_ADDITION_IN_ANOTHER_SLICE
- BLOCKED_WITH_REASON
- DEFERRED_WITH_REASON

============================================================
9) Full Implementation Closure
============================================================

Close every in-scope gap.

If OpenAPI is missing or inaccurate:

- Modify the correct OpenAPI file inside scope.
- Verify:
  - operationId
  - parameters
  - request schema
  - response schema
  - error states
  - auth boundary
  - WLT/finance boundary when relevant
- Do not add endpoints outside scope.

If backend is missing:

- Modify handler / repository / domain / migration / tests as needed.
- Prove required cases based on scope:
  - 200
  - 201
  - 400
  - 401
  - 403
  - 404
  - 409
  - 500
- Do not add business semantics outside scope.
- Do not implement financial mutations outside WLT.

If typed client / transport is missing:

- Modify the correct client / transport / type owner.
- Do not use direct fetch inside screens if the project boundary forbids it.
- Make errors explicit:
  - offline
  - http
  - parse
  - domain
  - auth
  - permission
  - WLT contract missing when relevant

If frontend flow is missing:

- Modify screen / route / CTA / state / runtime-visible behavior.
- Prove:
  - loading
  - empty
  - error
  - offline
  - success
  - blocked
  - disabled
- Enforce strict RTL:
  - icon + text in one cluster
  - text right-aligned
  - chevrons/actions on the correct opposite side
  - no space-between layout that separates an icon from Arabic text inside the same row
- Do not redesign unrelated areas.
- Use the central color system.

If control-panel is part of the scope:

- Close:
  - owner
  - action
  - audit
  - rollback
  - state
  - permission
  - preview/live distinction
- Clearly classify:
  - LIVE_API_BOUND
  - LOCAL_PREVIEW_ONLY
- Do not make preview buttons look like they write to DB if they are preview-only.
- Do not implement financial control-panel actions outside WLT ownership.

If data/media is scattered:

- Bind it to the correct central owner.
- Do not create local divergent demo copies.
- Use IDs, mediaKey, and references.
- Do not load full duplicated objects across every surface.

If a WLT boundary exists:

- Preserve WLT ownership.
- Do not add ledger/refund/payout/settlement/wallet mutation outside WLT.
- Document read/display/authorization/financial impact clearly.
- If the WLT financial contract is missing:
  - BLOCKED_WITH_REASON or NEEDS_WLT_CONTRACT.
  - Do not implement local financial logic.

If Auth / Vars / Provider policy blocks closure:

- Do not write PASS.
- Record BLOCKED_WITH_REASON with exact evidence.
- Update the affected truth files.

============================================================
10) Runtime / Evidence
============================================================

Create this evidence folder:

tools/registry/runs/[SESSION_ID]/

Write these files only at the root of the evidence folder:

01-context.txt

Include:
- session information
- git status before
- work item type
- domain
- execution mode
- scope map
- files inspected
- before status
- cross-surface impact map

02-implementation.txt

Include:
- implementation summary
- what changed in each layer:
  - docs
  - OpenAPI
  - backend
  - typed client
  - frontend
  - runtime
  - data/media
  - control-panel
  - WLT boundary
  - guards/scripts/tests
- write N/A for any layer not touched and explain why.

03-verification.txt

Include:
- git status --short
- git diff --check
- pnpm exec tsc --noEmit
- go test ./... when Go backend is touched
- related guards if present
- runtime request/response when required
- DB/log evidence when required
- visual proof or screenshot path when required

04-final-decision.txt

Include:
- final decision
- exact reason
- whether the work item is PASS or not
- if not PASS, write only the shortest next step

If [WORK_ITEM_TYPE] = JOURNEY and [EXECUTION_MODE] = JOURNEY_APPLY_SEQUENTIAL:

- Create a subfolder for each child slice:

  tools/registry/runs/[SESSION_ID]/slices/[SLICE_ID]/

- Each child slice must have its own:
  - context
  - implementation
  - verification
  - final decision
- The final journey decision depends on child slice decisions.

When local runtime is required:

- Use the approved project runtime commands exactly.
- Do not change them.
- Do not reinvent them.
- If runtime is unavailable:
  - BLOCKED_WITH_REASON or NEEDS_RUNTIME_EVIDENCE.
- Do not write PASS if runtime evidence is required and missing.

============================================================
11) Docs Truth Sync
============================================================

Update only the truth files affected by the current work item.

If the domain includes DSH, update as needed:

- [WORK_ITEM_FILE_PATH]
- dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
- dsh/docs/SCREEN_API_MATRIX.md
- dsh/docs/DSH_VISUAL_REVIEW.md
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md
- dsh/SERVICE_BLUEPRINT.md if service-level truth changed

If the domain includes WLT, update the corresponding WLT truth files if present:

- WLT blueprint / manifest / matrix / decision log
- finance / ledger / wallet / settlement docs
- WLT API contract docs
- WLT evidence matrix if present

Do not create new truth files unless required to close the scope and proven by evidence.

If [WORK_ITEM_TYPE] = JOURNEY:

- Update the journey file.
- Update every child slice status according to evidence.
- Do not make the journey PASS if any child slice is:
  - FIX_REQUIRED
  - BLOCKED_WITH_REASON
  - NEEDS_EVIDENCE
  - NEEDS_RUNTIME_EVIDENCE
  - NEEDS_VISUAL_EVIDENCE

No contradictions are allowed:

- One file must not say PASS while another says PENDING for the same proof.
- If a contradiction appears, fix it or set the decision to FIX_REQUIRED.

============================================================
12) Verification Commands
============================================================

Run and record results inside the evidence folder:

- git status --short
- git diff --check
- pnpm exec tsc --noEmit

If the implementation touched Go backend:

- Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
- go test ./...

If related guards exist:

- Run them.
- Record the output.

If errors appear:

- Fix them if they are inside scope.
- If they are outside scope, classify them clearly.
- Do not claim PASS.

============================================================
13) Evidence ZIP
============================================================

Create a ZIP inside the same evidence folder named:

[SESSION_ID].zip

Final path:

tools/registry/runs/[SESSION_ID]/[SESSION_ID].zip

Do not use _HANDOFF.zip.

============================================================
14) Final Decision
============================================================

Write one final decision only:

- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED_WITH_REASON
- DEFERRED_WITH_REASON
- NEEDS_VISUAL_EVIDENCE
- NEEDS_RUNTIME_EVIDENCE
- NEEDS_WLT_CONTRACT
- NEEDS_EVIDENCE
- REVERT_REQUIRED

PASS conditions for a slice:

- all in-scope items are closed
- diff check is clean
- typecheck or required test is recorded
- runtime evidence exists if runtime is required
- visual evidence exists if UI changed
- docs truth is synced
- no contradiction exists between matrices/logs/slice files
- no untracked/staged risks remain undocumented
- no financial logic exists outside WLT ownership

PASS conditions for a journey:

- every child slice is PASS or non-blocking PASS_WITH_WARNINGS
- no child slice is BLOCKED, FIX_REQUIRED, NEEDS_EVIDENCE, NEEDS_RUNTIME_EVIDENCE, or NEEDS_VISUAL_EVIDENCE
- journey truth is synced
- evidence exists for every child slice
- evidence zip exists
- no financial logic exists outside WLT ownership

============================================================
15) Required Final Output
============================================================

Return a short final report containing:

- Work Item ID.
- Work Item Type.
- Domain.
- Parent Journey.
- Execution Mode.
- modified files only.
- before/after status.
- what was analyzed and reviewed.
- what changed in:
  - docs
  - backend
  - OpenAPI
  - typed client
  - frontend
  - runtime
  - data/media
  - control-panel
  - WLT boundary
  - guards/scripts/tests
- for journeys: child slice list and decision for each slice.
- any other work item updated, and why.
- evidence folder.
- evidence zip.
- results of:
  - git status --short
  - git diff --check
  - pnpm exec tsc --noEmit
  - go test ./... when required
  - guards when required
- GAP / BLOCKED / DEFERRED rows if any.
- final decision.

If the final decision is not PASS, write the exact reason and the next step only.
```

---

## 3. Recommended Placeholder Example

```text
[WORK_ITEM_TYPE] = SLICE
[DOMAIN] = DSH_WLT
[WORK_ITEM_FILE_PATH] = dsh/docs/slices/DSH_SLICE_001B_STORE_DETAILS.md
[SESSION_ID] = DSH_WLT_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE-20260605-153000
[EXECUTION_MODE] = ONE_SLICE_ONLY
```

For a full journey:

```text
[WORK_ITEM_TYPE] = JOURNEY
[DOMAIN] = DSH_WLT
[WORK_ITEM_FILE_PATH] = dsh/docs/journeys/DSH_JOURNEY_001_STORE_DISCOVERY.md
[SESSION_ID] = DSH_WLT_JOURNEY_001_STORE_DISCOVERY_FINAL_CLOSURE-20260605-153000
[EXECUTION_MODE] = JOURNEY_APPLY_SEQUENTIAL
```

---

## 4. Notes

- Use this command for local agent execution only.
- It is intentionally strict.
- It prevents false closure claims.
- It protects WLT as the only financial source of truth.
- It keeps DSH data/media centralized.
- It supports both slice-level and journey-level closure.
- It supports backend, frontend, API, binding, integration, runtime, documentation, evidence, and cross-surface consistency.
- The local environment assumes a real device is connected via ADB (with Scrcpy active) for all mobile applications, and localhost is running for the control panel.
