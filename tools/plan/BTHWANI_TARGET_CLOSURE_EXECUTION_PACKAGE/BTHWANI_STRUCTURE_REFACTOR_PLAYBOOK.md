# BTHWANI STRUCTURE REFACTOR PLAYBOOK — V7

## 1. Default topic structure

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
<topic>.drawers.tsx
<topic>.sheets.tsx
```

## 2. Never create by default

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

## 3. Design-preserving refactor

Before moving code, identify:

```text
component files
CSS/module.css
style objects
className mappings
UI-kit components
layout wrappers
icons
spacing tokens
direction/layout logic
```

Refactor must preserve:

```text
visual hierarchy
layout
classNames/styles
RTL/LTR behavior
visible text
interaction behavior
```

Visual change requires reason and evidence.

## 4. Topic decision

Topic is product/flow meaning, not technical bucket.

Allowed topic examples:

```text
products
categories
approvals
media-review
checkout
orders
vars
provider-policy
campaigns
support
refunds
```

Forbidden topic names:

```text
components
cards
hooks
ui
forms
tables
shared2
panels
layout
helpers
common
new
v2
test
temp
```

## 5. Role file escalation thresholds

A flat role file may escalate to a nested folder **only** when the threshold is met. Escalate the overloaded type only; keep all other role files flat.

```text
<topic>.parts.tsx    → nested parts/ folder allowed when: >250 lines OR 4+ large components
<topic>.hooks.ts     → nested hooks/ folder allowed when: >220 lines OR many independent hooks
<topic>.adapters.ts  → nested adapters/ folder allowed when: >180 lines OR multiple independent adapters
<topic>.drawers.tsx  → nested drawers/ folder allowed when: >2 heavy drawers
<topic>.sheets.tsx   → nested sheets/ folder allowed when: >2 heavy sheets
<topic>.states.tsx   → nested states/ folder allowed when: multiple large independent states
<topic>.model.ts     → nested model/ folder allowed when: many independent types/enums that cannot be read in one file
```

Document every escalation in the File Boundary Matrix with the exact threshold evidence.

## 5a. NO_STACKING_RULE

```text
Never add new code over dead / duplicate / leaked code.
Remove or retire first. Then add.
shared-fake demotion is mandatory before adding new shared code.
```

## 5b. Shared demotion criteria

Demote a file from `shared/` to its owning topic when any of the following is true:

```text
used only once
name is generic but content is domain-specific
contains data/fixtures/media paths
contains state specific to one screen
imports from a specific topic
depends on a specific route
hides ownership
state machine belongs to a single surface
```

Promote to `shared/` only when:

```text
used by 2+ real owners now (not "may be used later")
name and function are general
no source data or media fixtures inside
no business truth belonging to one topic
does not break ownership
no equivalent already exists in ui-kit
```

## 5c. Topic Detection Algorithm

Run Steps A–E before any file movement. Output results in Topic Candidate Matrix and Topic Decision Matrix.

```text
Step A — Domain map discovery
  What screens/tabs/panels/journeys are visible?
  What operations does the user perform?
  What entities: product/category/order/campaign/partner/refund/ticket/vars?
  What lifecycle states: draft/pending/approved/active/blocked/hidden/failed?
  What actions: approve/publish/assign/refund/escalate/merge/preview/rollback?

Step B — Topic Candidate Matrix
  For each candidate: name / user/product meaning / visible entry / owner /
  main entity / main actions / state lifecycle / data/media source /
  linked surfaces / should be topic? yes/no / reason

Step C — 8-condition gate test
  A candidate becomes a topic only if it passes 4+ of these:
  1. has product meaning
  2. has a clear owner
  3. has a UI or flow entry point
  4. has its own state or actions or data mapping
  5. can be named after a domain (not a technical type)
  6. a new developer understands it from the name alone
  7. separating it reduces complexity, not increases fragmentation
  8. has clear boundaries with other topics
  If fewer than 4 pass, make it a part/hook/helper inside an existing topic.

Step D — Split vs merge decision
  Split: has own route/tab/workspace, different owner, different lifecycle,
         different actions, independent data model, own testable surface.
  Merge: used only within one topic, no independent lifecycle,
         is a small component/drawer/helper, name is not product-domain.

Step E — Name validation
  Valid: short, domain/product-based, readable without opening files, kebab-case.
  Invalid: contains component/card/hook/ui/form/table/filter/panel/layout/v2/temp.
```

## 6. File boundary rules

A file must have one clear owner.

Split if it has:

```text
multiple route/tab owners
UI + state + data + logic combined
mock arrays
many render functions
large internal components
heavy drawer/sheet
business truth in screen
```

Merge/demote if:

```text
shared used once
role file empty
wrapper does nothing
topic name is technical
nested folder does not meet threshold
```

## 7. Mandatory File Boundary Matrix

Before restructuring, output the following matrix for every file:

```text
file path | current role | correct role | current issues | exact evidence | target folder/file | should be flat? | role file needed? | role file can be removed? | nested folder allowed? | split needed? | merge needed? | move needed? | delete/retire? | owner reason | shared status | risk | priority | safe now? | design impact | design preservation action
```

## 8. Mandatory Demo Data / Media Centralization Matrix

For any demo data or media within `TARGET_SCOPE`, output this matrix:

```text
current file/path | entity type (product/media/etc) | current owner | should be central? | central target path | duplicate/conflict? | demo-only? | safe to delete/regenerate? | adapter needed? | consumers to update | risk | action (keep/move/centralize/block)
```

**Rule:** `dsh/frontend/data` and `dsh/frontend/media-fixtures` are the absolute source of truth for DSH demo resources. Eliminate local duplicate mocks entirely.
