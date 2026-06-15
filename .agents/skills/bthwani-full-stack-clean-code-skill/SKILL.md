---
name: bthwani-full-stack-clean-code-skill
description: Enforce evidence-based full-stack clean code across current BThwani roots without historical path assumptions, unsafe refactors, UI-only scope leakage, shared-code misuse, API drift, runtime breakage, or WLT financial logic drift.
version: 2026.06.15-v3
---

# bthwani-full-stack-clean-code-skill

## Purpose

Enforce clean, maintainable, minimal, readable, testable, ownership-safe code across the current BThwani stack.

This skill prevents code cleanup from becoming:

- uncontrolled refactor;
- hidden behavior change;
- UI drift;
- API contract breakage;
- generated-code mutation;
- runtime/env mutation;
- database behavior drift;
- WLT financial logic drift;
- shared-code dumping;
- cross-surface breakage;
- historical-path resurrection;
- broad AI-agent edits without evidence.

## Non-negotiable rule

This skill must never rely on historical paths, memory, assumed architecture, deleted paths, old snapshots, or donor layouts.

Before naming any shared, UI, frontend, backend, API, runtime, generated, database, or service path as active, prove it from the current branch.

Accepted path evidence:

- `pnpm-workspace.yaml`;
- `package.json`;
- direct file existence;
- import/export scan;
- guard output;
- Git tree evidence;
- user-provided terminal evidence;
- patch evidence.

If a path is not proven in the current branch, use:

```text
UNPROVEN_PATH
```

or:

```text
BLOCKED_NEEDS_PATH_EVIDENCE
```

Never invent packages paths (such as legacy packages subfolders) unless the current branch proves they exist.

## Current branch active roots

Known active workspace roots must be read from `pnpm-workspace.yaml` before use.

At the time this skill was authored, verified active roots are:

```text
webapp/runtime
website/runtime
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
ui-kit
dsh
wlt
```

Do not treat this list as permanent. Re-read current branch evidence before execution.

## Trigger contexts

Use this skill when the task involves any of:

- frontend code cleanup;
- backend code cleanup;
- API or OpenAPI impact review;
- generated client/type boundary review;
- runtime/env impact review;
- database/repository/query cleanup;
- DSH flow cleanup;
- WLT financial logic impact review;
- control panel code cleanup;
- mobile app code cleanup;
- UI Kit consumption or shared UI boundary review;
- shared-code promotion or cleanup;
- duplication removal;
- dead-code removal;
- file-size or component-size reduction;
- naming cleanup;
- type-safety cleanup;
- patch review for AI-generated code;
- deciding whether a cleanup is safe, too broad, duplicated, out of scope, or needs rollback.

## Non-trigger contexts

Do not use this as the main skill when the task is only:

- translation;
- product copy;
- marketing text;
- non-code documentation;
- screenshot-only visual diagnosis;
- dependency upgrade planning with no clean-code review;
- release planning with no code-level impact;
- pure Git command help with no code decision.

## Design notes

Trigger examples:

1. “Clean this DSH screen without changing behavior.”
2. “Review this Copilot patch and decide if the refactor is safe.”
3. “Find duplicated frontend/backend contract logic and decide what should move.”

Non-trigger examples:

1. “Translate this Arabic sentence to English.”
2. “Summarize this meeting note.”
3. “Explain what Docker is.”

## Operating modes

The agent must choose exactly one primary mode before acting.

```text
INSPECT_ONLY
UI_ONLY_CLEANUP
SHARED_CODE_REVIEW
APPLY_SAFE_CLEANUP
REVIEW_PATCH
FULL_STACK_IMPACT_CHECK
RUNTIME_VERIFICATION
BLOCKED_NEEDS_EVIDENCE
```

## Mode selection rule

Full-stack awareness is mandatory.

Full-stack editing is not automatic.

For every task, classify the intended edit scope as exactly one of:

```text
UI_ONLY
SHARED_ONLY
FRONTEND_ONLY
BACKEND_ONLY
API_CONTRACT
GENERATED_CODE_REVIEW_ONLY
DATABASE
RUNTIME_ENV
WLT_FINANCE
MULTI_SURFACE
FULL_STACK
```

Edit only inside the selected scope.

If a task starts as UI-only but reveals backend/API/runtime/database/WLT/generated-code/dependency work, do not fix it silently. Stop and mark:

```text
BLOCKED_BY_OUT_OF_SCOPE_LAYER
```

or:

```text
FOLLOW_UP_REQUIRED_NON_UI_SCOPE
```

## INSPECT_ONLY

Use when scope is broad, unclear, risky, or unproven.

Rules:

- Do not edit files.
- Do not create files unless evidence output is explicitly requested.
- Return exact file paths only when proven.
- Mark uncertain findings as `UNPROVEN`.
- Do not propose broad rewrites.
- Do not claim final closure.

Required output:

```text
mode: INSPECT_ONLY
scope:
paths_verified:
paths_unproven:
findings:
risks:
decision:
next_action:
```

## UI_ONLY_CLEANUP

Use when the user explicitly asks for UI-only work, screen cleanup, frontend-only cleanup, visual cleanup, layout cleanup, or component cleanup.

UI-only means the change is limited to:

- presentation;
- screen composition;
- local UI state;
- view-only mapping;
- layout;
- spacing structure;
- visual hierarchy;
- accessibility labels;
- loading/empty/error/success/offline/disabled rendering;
- approved UI Kit consumption.

UI-only does not mean full-stack editing.

### UI-only allowed scope

UI-only work may touch only proven current-branch frontend/UI paths.

Likely roots must be verified before use, such as:

```text
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
webapp/runtime
website/runtime
dsh/frontend
wlt/frontend
ui-kit
```

Do not treat any path as active until file existence or branch evidence proves it.

### UI-only forbidden scope

UI-only work must not touch:

```text
backend handlers
API contracts
OpenAPI source
generated clients
generated types
database queries
migrations
seed logic
runtime env
auth logic
payment logic
wallet logic
accounting logic
WLT financial calculations
package dependencies
lockfiles
CI/CD
native config
```

### UI-only API rule

UI-only code may consume an existing approved API/client/type.

UI-only code must not:

- change request shape;
- change response shape;
- manually redefine backend contracts;
- add fake runtime data as real behavior;
- hide backend/API failure with silent fallback;
- move backend validation truth into frontend;
- add frontend financial truth.

### UI-only visual preservation rule

If the task is code cleanup only, visual output must remain unchanged.

If the task changes visible UI, require:

```text
before screenshot when available
after screenshot
device or viewport
RTL/LTR context
state being reviewed
```

If screenshots are missing after visible UI change, use:

```text
NEEDS_VISUAL_EVIDENCE
```

### UI-only decision labels

Use one:

```text
UI_ONLY_PASS
UI_ONLY_FIX_REQUIRED
UI_ONLY_NEEDS_VISUAL_EVIDENCE
UI_ONLY_BLOCKED_BY_API_SCOPE
UI_ONLY_BLOCKED_BY_RUNTIME_SCOPE
UI_ONLY_BLOCKED_BY_WLT_SCOPE
UI_ONLY_BLOCKED_BY_GENERATED_CODE_SCOPE
UI_ONLY_REVERT_REQUIRED
```

## SHARED_CODE_REVIEW

Shared code must be earned, not assumed.

Shared code is not a dumping ground.

Do not create shared abstractions for imagined future reuse.
Do not move code to shared because it is duplicated once.
Do not merge similar code if business meaning differs.
Do not make service-specific behavior global.

### Shared path reality

Shared ownership must be discovered from the current branch before use.

Known shared-related candidates may include only paths proven in the current branch, such as:

```text
ui-kit
dsh/frontend/shared
wlt/frontend/dsh
```

Do not treat this list as complete.
Do not create or name new shared roots without branch evidence.

### ui-kit ownership

`ui-kit` is the current root package for `@bthwani/ui-kit`.

It may own approved reusable UI primitives, visual contracts, web/mobile/next exports, and shared design behavior.

Do not reference legacy package structures (such as the old packages subdirectory for ui-kit).

Screens and surfaces should not create parallel local design systems when approved UI Kit ownership exists.

### DSH shared ownership

DSH shared code must remain inside proven DSH-owned paths only.

Known branch-evidence examples may include:

```text
dsh/frontend/shared
dsh/frontend/shared/contracts/openapi
```

DSH shared code must not become a dumping ground for one-screen-only logic or WLT financial behavior.

### WLT / DSH integration ownership

WLT-DSH integration code must remain inside proven WLT/DSH integration paths only.

Known branch-evidence examples may include:

```text
wlt/frontend/dsh
wlt/frontend/dsh/shared/contracts/openapi
```

Financial behavior must not be moved into UI or generic shared utilities.

### Shared code may own

Shared code may own only when proven:

- reusable UI primitives;
- shared layout patterns;
- view-only helpers with multiple real consumers;
- generated or approved API client/type consumption boundaries;
- pure utilities with no service-specific side effects;
- stable constants that are not backend or WLT domain truth.

### Shared code must not own

Shared code must not own:

- one-screen-only logic;
- one-flow-only logic;
- WLT financial calculations outside WLT-approved boundary;
- backend validation truth;
- runtime environment decisions;
- API behavior;
- database logic;
- temporary glue code;
- manually copied backend contracts;
- service-specific business rules disguised as generic utilities.

### Shared promotion rule

Do not move code into shared unless all are proven:

```text
2+ real consumers exist
path exists in current branch
ownership is clear
public API is explicit
behavior is stable
no generated-code ownership violation
no circular dependency risk
no service-specific behavior becomes global
typecheck or targeted guard can verify consumers
```

If reuse is expected but not proven, use:

```text
KEEP_LOCAL_UNTIL_SECOND_CONSUMER
```

### Shared cleanup allowed

Allowed under safe cleanup only when proven:

- remove duplicate pure helper after behavior equivalence is proven;
- move repeated UI primitive usage into existing approved shared UI ownership;
- tighten shared internal type names without public contract break;
- clarify internal names without public API change;
- remove dead shared export only after proving no consumers.

### Shared cleanup forbidden

Forbidden under clean-code cleanup:

- creating a new shared abstraction for one consumer;
- creating a new shared root path without evidence;
- changing public exports without consumer scan;
- moving domain logic into generic shared code;
- moving WLT financial logic into DSH or UI;
- editing generated API types manually;
- merging similar code with different business meaning;
- introducing circular imports;
- inventing package paths from memory.

### Shared decision labels

Use exactly one per shared candidate:

```text
KEEP_LOCAL
KEEP_LOCAL_UNTIL_SECOND_CONSUMER
KEEP_SHARED
PROMOTE_TO_EXISTING_SHARED_OWNER
MOVE_TO_OWNER
MERGE_DUPLICATE
SPLIT_SERVICE_SPECIFIC
BLOCKED_NEEDS_CONSUMER_SCAN
BLOCKED_PUBLIC_API_RISK
BLOCKED_NEEDS_PATH_EVIDENCE
UNPROVEN_PATH
```

### Required shared checks

Before changing shared code, check:

```text
path existence
imports
exports
public entrypoints
consumer surfaces
package boundaries
circular dependency risk
generated-code ownership
typecheck
```

## APPLY_SAFE_CLEANUP

Use only when the issue is proven, scope is narrow, and behavior preservation is possible.

Allowed examples:

- rename local variable/function for clarity;
- simplify condition without behavior change;
- extract a pure helper inside the same file;
- remove unreachable local branch;
- remove duplicate local expression;
- tighten internal type without public contract change;
- reduce JSX noise without visual output change;
- clarify error handling without changing error contract;
- add a small guard only when behavior is already defined.

Forbidden in this mode:

- moving files;
- deleting files;
- renaming files;
- changing public exports;
- changing API contracts;
- changing database schema;
- changing financial behavior;
- changing navigation architecture;
- changing dependencies or lockfiles;
- changing generated code;
- broad formatting;
- multi-surface redesign;
- runtime/env mutation.

If safe cleanup requires refactor, stop and mark:

```text
BLOCKED_NEEDS_EXPLICIT_REFACTOR_SCOPE
```

## REVIEW_PATCH

Use when reviewing existing local or PR changes.

Review must check:

- changed files match scope;
- untracked files are accounted for;
- staged files are accounted for;
- no forbidden files were touched;
- no public API change is hidden as cleanup;
- no generated code was manually changed;
- no WLT financial behavior drift exists;
- no UI-only leakage occurred;
- no runtime/env/db behavior drift exists;
- no broad formatting or unrelated refactor exists;
- verification evidence exists.

Required decision:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
REVERT_REQUIRED
```

## FULL_STACK_IMPACT_CHECK

Use when a change may cross layers.

Check this chain when relevant:

```text
UI
state
API client
OpenAPI/API contract
backend handler
domain service
repository/database
runtime/env
tests/evidence
```

If one layer changes but linked layers are not updated or verified, decision must be:

```text
FIX_REQUIRED
```

or:

```text
NEEDS_EVIDENCE
```

Full-stack impact check does not authorize editing every layer. It authorizes identifying the required layer-specific follow-up.

## RUNTIME_VERIFICATION

Use when code compiles but behavior must be proven.

Required for:

- API behavior;
- backend behavior;
- database access;
- order/cart/serviceability flows;
- payment/wallet/accounting flows;
- WLT finance behavior;
- multi-surface interactions;
- mobile navigation behavior;
- control panel actions;
- visible UI behavior;
- runtime/env/provider behavior.

If runtime proof is missing, use:

```text
NEEDS_RUNTIME_EVIDENCE
```

## Full-stack ownership boundaries

### Frontend

Frontend may own:

- presentation;
- screen state;
- user interaction;
- local view models;
- UI composition;
- approved API client calls;
- rendering of loading/empty/error/success/offline/disabled states.

Frontend must not own:

- WLT financial calculations;
- backend validation truth;
- permanent business truth;
- duplicated API contracts;
- hardcoded backend data models;
- runtime provider truth;
- database behavior;
- local design systems when UI Kit should own the pattern.

### Backend

Backend may own:

- domain validation;
- service logic;
- persistence orchestration;
- API behavior;
- error contracts;
- idempotency;
- authorization;
- data access boundaries.

Backend must not own:

- UI formatting;
- frontend display labels as domain truth;
- duplicated client-only assumptions;
- silent fallback behavior that hides errors.

### API / OpenAPI / clients

API contract changes must be explicit.

Any request/response shape change requires checking:

- backend handler;
- OpenAPI or contract source;
- generated/shared API types;
- frontend consumers;
- tests or runtime evidence.

No API-breaking cleanup is allowed under a clean-code label.

### Generated code

Generated code is review-only by default.

Do not manually edit generated clients, generated types, OpenAPI outputs, or derived artifacts unless explicitly in scope and the generator/update path is proven.

If generated output is stale, mark:

```text
GENERATED_CODE_REGEN_REQUIRED
```

or:

```text
BLOCKED_NEEDS_GENERATOR_EVIDENCE
```

### Database / repository

Database cleanup must not change data behavior silently.

Before changing queries, migrations, seeds, repositories, or persistence behavior, prove:

- current consumer;
- expected data shape;
- failure mode;
- migration impact;
- seed/runtime impact;
- rollback path.

### WLT finance logic

Financial logic must remain owned by WLT or its proven approved boundary.

Forbidden under clean-code cleanup:

- moving financial calculations into UI;
- duplicating wallet/payment/accounting math in DSH surfaces;
- changing rounding, fees, balances, settlement, refunds, ledger behavior, or accounting rules without explicit scope;
- hiding financial behavior inside display helpers;
- using UI formatting as financial truth.

## Clean Code rules

1. Make code obvious before making it abstract.
2. Prefer clear names over comments that explain bad names.
3. Keep functions/components focused on one responsibility.
4. Keep business rules out of render blocks.
5. Keep financial logic out of UI.
6. Keep backend validation as backend truth.
7. Avoid duplicated contracts between frontend and backend.
8. Avoid broad abstractions before at least two proven consumers need them.
9. Avoid hidden side effects in helpers.
10. Avoid magic strings, magic numbers, unsafe casts, and unjustified `any`.
11. Avoid mixing fetch, transform, render, and mutation in one component.
12. Avoid silent fallbacks that hide real failures.
13. Avoid cleanup that changes behavior without tests or runtime evidence.
14. Avoid deleting, moving, or renaming files without import/export/consumer proof.
15. Preserve visual output during code cleanup unless the user explicitly requests visual change.
16. Preserve public contracts unless the user explicitly scopes contract change.

## Cleanup vs Refactor

### Clean Code Cleanup

Allowed when narrow and behavior-preserving:

```text
rename local symbol
simplify condition
extract local pure helper
remove unreachable local branch
remove duplicated local expression
tighten internal type
reduce JSX noise without visual change
clarify error handling without contract change
```

### Refactor

Requires explicit scope and stronger evidence:

```text
move files
delete files
rename files
split modules
change exports
change public types
change API contracts
change route ownership
change state model
change data flow
change database access pattern
change runtime configuration
change generated-code flow
change financial logic ownership
change shared package boundaries
```

If cleanup requires refactor, stop and mark:

```text
BLOCKED_NEEDS_EXPLICIT_REFACTOR_SCOPE
```

## Complexity flags

Flag a file/unit for review when any applies:

```text
file exceeds 500 lines
function exceeds 80 lines
component mixes fetch + transform + render + mutation
same logic appears in 3+ places
business rule appears inside UI render
API response is manually redefined in frontend
financial calculation exists outside WLT boundary
component has many unrelated state variables
error/loading/empty states are missing or scattered
helper has hidden side effects
public export is unclear or unused
generated-code ownership is unclear
```

These flags do not automatically authorize refactor. They require scoped action.

## Priority rules

When many issues are found:

1. Fix correctness and safety first.
2. Fix ownership violations second.
3. Fix API/type contract drift third.
4. Fix generated-code boundary violations fourth.
5. Fix WLT financial boundary violations fifth.
6. Fix duplication sixth.
7. Fix naming/readability seventh.
8. Fix visual/code organization last.

If more than 5 issues are found, do not fix everything at once unless explicitly requested.

Group findings and apply only the highest-impact safe slice.

## Anti-hallucination rules

The agent must not:

- mention unproven paths;
- revive deleted architecture;
- refer to historical packages subdirectories unless proven current;
- assume generated clients exist;
- assume API clients exist;
- assume tests exist;
- assume a service root exists because it appeared in old docs;
- assume local uncommitted changes are visible;
- claim current branch state without evidence.

Use:

```text
UNPROVEN
TBD
NEEDS_EVIDENCE
BLOCKED_NEEDS_PATH_EVIDENCE
```

## Forbidden actions

- No broad “clean all code” execution.
- No repo-wide formatting as a side effect.
- No dependency changes.
- No lockfile changes.
- No generated file changes unless explicitly approved.
- No backend/API/runtime changes for UI-only cleanup.
- No UI redesign during code cleanup.
- No public contract change under cleanup.
- No database behavior change without explicit scope.
- No financial behavior change without explicit scope.
- No deleting files based on intuition.
- No moving logic across ownership boundaries without proof.
- No new shared root paths without branch evidence.
- No claiming `PASS`, `CLOSED`, `READY`, `SAFE`, `FINAL`, or `100%` without evidence.

## Required verification

Minimum after any code change:

```text
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Add targeted checks when relevant:

```text
frontend lint/test/build
backend test/build
API contract generation/check
OpenAPI diff/check
generated-client regeneration/check
runtime smoke test
database query/migration check
mobile runtime check
control panel runtime check
screenshot evidence
```

If verification cannot run, record:

```text
VERIFICATION_NOT_RUN
reason:
risk:
next_required_command:
```

## Evidence contract

Every decision must include:

```text
branch:
commit_sha:
mode:
scope:
paths_verified:
paths_unproven:
files_reviewed:
files_changed:
git_status:
diff_stat:
diff_name_status:
diff_check:
typecheck:
targeted_tests:
runtime_evidence:
visual_evidence:
generated_code_result:
api_contract_result:
financial_logic_result:
risks:
decision:
```

If evidence is missing, use:

```text
NEEDS_EVIDENCE
```

If UI changed and screenshots are missing, use:

```text
NEEDS_VISUAL_EVIDENCE
```

If behavior changed and runtime proof is missing, use:

```text
NEEDS_RUNTIME_EVIDENCE
```

## Scoring rubric

Score each changed file from 0 to 2:

```text
scope_safety:
path_evidence:
readability:
ownership_correctness:
type_safety:
api_contract_safety:
runtime_safety:
shared_boundary_safety:
ui_only_boundary_safety:
wlt_finance_safety:
verification:
```

Reject if any of these are below 2:

```text
scope_safety
path_evidence
ownership_correctness
api_contract_safety when API is affected
ui_only_boundary_safety when UI-only is claimed
wlt_finance_safety when finance is affected
verification
```

## Output contract

```text
skill: bthwani-full-stack-clean-code-skill
mode:
task_scope:
edit_scope_classification:
paths_verified:
paths_unproven:
full_stack_layers_checked:
files_reviewed:
files_changed:
issues_found:
actions_taken:
shared_code_result:
ui_only_result:
ownership_boundary_result:
api_contract_result:
generated_code_result:
runtime_result:
database_result:
financial_logic_result:
type_safety_result:
visual_result:
verification:
score:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE / NEEDS_RUNTIME_EVIDENCE / REVERT_REQUIRED
next_action:
```

## Decision rules

Use `PASS` only when:

- scope is respected;
- all active paths are proven;
- changed files match the task;
- no unrelated refactor exists;
- ownership boundaries are respected;
- shared code is not misused;
- UI-only scope did not leak;
- API/runtime impact is checked when relevant;
- generated code was not manually mutated unless explicitly scoped;
- financial logic remains in the approved WLT boundary;
- diff check passes;
- typecheck or equivalent verification passes;
- staged and untracked files are accounted for;
- runtime evidence exists when behavior changed;
- visual evidence exists when UI changed.

Use `PASS_WITH_WARNINGS` only when warnings are known, documented, non-blocking, and accepted.

Use `FIX_REQUIRED` when the direction is correct but clean-code, ownership, type, API, generated-code, runtime, UI, shared, or WLT issues remain.

Use `BLOCKED` when safe scope is unclear or required evidence is missing.

Use `NEEDS_EVIDENCE` when Git diff, changed files, typecheck, path proof, or relevant verification is missing.

Use `NEEDS_VISUAL_EVIDENCE` when UI changed but screenshots are missing.

Use `NEEDS_RUNTIME_EVIDENCE` when behavior changed but runtime proof is missing.

Use `REVERT_REQUIRED` when the change widens scope, touches forbidden files, breaks ownership, changes contracts silently, mutates generated code without scope, moves financial logic incorrectly, or hides behavior changes under cleanup.
