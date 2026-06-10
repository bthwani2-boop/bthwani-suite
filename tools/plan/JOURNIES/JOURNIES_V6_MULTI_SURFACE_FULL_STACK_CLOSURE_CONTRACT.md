# JOURNIES V6 — Multi-Surface Full-Stack Closure Contract

**Project:** bthwani-suite\
**Scope:** DSH + WLT related surfaces\
**Target repository path:** `C:\bthwani-suite`\
**Target branch:** `fix/docker-local-runtime-standardization`\
**Package integration target:** `dsh/docs/JOURNIES/JOURNIES_V6_MULTI_SURFACE_FULL_STACK_CLOSURE_CONTRACT.md`
**Decision:** `FIX_REQUIRED_UNTIL_MULTI_SURFACE_FULL_STACK_CONTRACT_IS_APPLIED_TO_EVERY_SLICE_AND_EVIDENCE_PASSES`

---

## 0) Purpose

This file upgrades the current V5 journey/slice package into a stricter V6 execution standard.

The V5 package is a useful structure for journeys, slices, evidence gates, and execution order. However, V5 is not sufficient by itself for final full-stack closure because it does not force every slice to describe and prove the full operational behavior across all affected surfaces.

From V6 onward, every slice must be treated as a **Multi-Surface Full-Stack Closure Slice**, not as a standalone screen, API, component, document, or isolated backend task.

This file must be added to the package and treated as a mandatory root closure rule before running implementation.

---

## 1) Truth and Assurance Rule

No tool, agent, developer, or reviewer may claim absolute perfection merely because the package exists.

Allowed final assurance language:

```text
NO_KNOWN_GAPS_AFTER_EVIDENCE
```

Meaning:

```text
No known gaps remain after live code census, implementation, runtime verification, adversarial review, and evidence review.
```

Forbidden assurance language unless backed by final evidence and still scoped to known evidence:

```text
100% complete
Zero defects guaranteed
Impossible to find gaps
Production ready by claim
Ready without evidence
Closed by documentation only
```

Correct operating decision before final evidence:

```text
FIX_REQUIRED until every slice passes the V6 Multi-Surface Full-Stack Closure Contract and final regression evidence passes.
```

---

## 2) Governing Rule — Multi-Surface Final Closure

Every slice must be a **Multi-Surface Full-Stack Closure Slice**.

A slice is not complete unless it closes the operation across every affected surface:

```text
app-client
app-partner
app-captain
app-field
control-panel
backend/API
OpenAPI/binding/frontend clients
WLT when money is involved
Auth/RBAC/permissions
Docker runtime
MinIO/media runtime
PostgreSQL/data model
state machine
CTAs
failure paths
audit logs
notifications/signals when applicable
performance/on-demand retrieval
UI/UX/design system
runtime tests/smoke checks
evidence zip
```

If a slice appears to belong to one surface only, that is only the starting point. Its impact must still be checked across the other surfaces.

Examples:

```text
A client checkout slice must also inspect backend, OpenAPI, WLT, control-panel finance/ops visibility, Auth/RBAC, Docker runtime, states, failure paths, and evidence.

A backend API slice must also inspect app-client/app-partner/app-captain/app-field/control-panel clients, states, CTAs, error handling, permissions, OpenAPI binding, and screenshots where UI changes.

A media slice must also inspect MinIO, dsh_media_assets, API upload intent, frontend image consumers, control-panel media usage, Docker runtime, and fixture isolation.
```

---

## 3) Non-Negotiable Closure Decisions

Allowed decisions only:

```text
DONE
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

Forbidden decisions:

```text
PASS
READY
CLOSED
100%
```

Decision meaning:

| Decision | Meaning |
|---|---|
| `DONE` | The slice passed the full V6 contract and has required evidence. |
| `FIX_REQUIRED` | The slice has a known defect or incomplete requirement that can be fixed. |
| `BLOCKED` | A dependency, missing capability, unclear ownership, or external blocker prevents closure. |
| `NEEDS_EVIDENCE` | The implementation may exist, but evidence is insufficient. |
| `NEEDS_VISUAL_EVIDENCE` | UI changed or is involved, but screenshot/visual evidence is missing. |

No slice may move to `DONE` if any affected surface is unexamined, undocumented, unbound, untested, or not proven by evidence.

---

## 4) V5 Gap Statement

The current V5 package is structurally useful, but V6 must correct these gaps:

```text
V5 does not force every slice to explain what happens in app-client.
V5 does not force every slice to explain what happens in app-partner.
V5 does not force every slice to explain what happens in app-captain.
V5 does not force every slice to explain what happens in app-field.
V5 does not force every slice to map every affected control-panel section.
V5 does not force every slice to list every required API route, handler, repository, schema, migration, enum, transition, frontend client, and OpenAPI path.
V5 does not force every financial flow to be proven through WLT.
V5 does not force every media/image/file flow to be proven through MinIO/media API.
V5 does not force every Docker runtime dependency to be proven.
V5 does not force every Auth/RBAC permission and forbidden/unauthorized state to be proven.
V5 does not force every CTA, state, failure path, audit, notification, and rollback path to be enumerated.
V5 does not contain a mandatory Full Operation / Screen / Flow / Logic Census before execution.
```

Therefore:

```text
V5 = FIX_REQUIRED
V6 requirement = Add this contract and apply it to every slice before final implementation closure.
```

---

## 5) Phase 0.5 — Full Operation / Screen / Flow / Logic Census

Before applying any implementation change to any slice, create a full live-code census.

Do not assume the existing journey list is complete. Do not assume a screen is covered because its folder exists. Do not assume a flow is covered because one API exists. Do not assume control-panel coverage unless a concrete page/section/CTA/state exists. Do not assume WLT boundary is correct without tracing the financial flow.

### 5.1 Required Census Domains

The census must enumerate and classify all of the following:

#### A) Customer / app-client operations

```text
service discovery
store listing
store details
category browsing
product listing
product details
search/filter/sort
offers/campaigns/banners
cart add/update/remove
serviceability check
pricing/delivery fee preview
checkout
order creation
wallet/payment handoff to WLT
order tracking
order history
cancellation request
return/refund request
support ticket/contact
address/location flow
media/image display from runtime API only
loading/empty/error/offline/unauthorized/forbidden/disabled/success states
```

#### B) Partner / app-partner operations

```text
partner onboarding/readiness
store profile
store availability/open-close
catalog/product CRUD
product image upload through media API/MinIO
order receive
accept/reject order
preparation status
ready/handoff status
cancellation/rejection reasons
stock/availability updates
partner support/escalation
partner performance/finance read-only when applicable
all states and CTAs
```

#### C) Captain / app-captain operations

```text
captain availability
assignment receive
accept/decline assignment
pickup flow
dropoff flow
status transitions
proof of delivery
media/evidence upload through media API/MinIO
COD or finance boundary if present
failure/delay/unreachable customer
return/cancel handling
route/map/list states
offline/poor-network states
all states and CTAs
```

#### D) Field / app-field operations

```text
partner acquisition
partner lead intake
partner inspection
readiness checklist
field visit
evidence capture/upload through media API/MinIO
notes
onboarding approval/rejection handoff
partner activation
issue escalation
all states and CTAs
```

#### E) Control Panel operations

```text
DSH operations room
store/partner management
catalog moderation
order monitoring
order lifecycle control
support/customer service
captain operations
field operations
finance read-only / WLT links
refunds/settlements visibility through WLT boundary
platform section
vars/provider/runtime policy
permissions/RBAC
audit/history/logs
dashboards/KPIs
media asset management if present
loading/empty/error/unauthorized/forbidden states
all CTAs and destructive-action confirmations
```

#### F) WLT operations related to DSH

```text
wallet ownership
ledger ownership
payment authorization/capture if present
refund ownership
payout/settlement ownership
reconciliation ownership
DSH read-only finance references
DSH event-to-WLT contracts
finance boundary violations
```

Every financial item must be classified as exactly one of:

```text
WLT_OWNER
DSH_READ_ONLY
DSH_EVENT_TO_WLT
FINANCE_BOUNDARY_VIOLATION
```

#### G) Backend/API/Auth/OpenAPI/runtime operations

```text
every route
every handler
every repository method
every model/schema
every migration
every OpenAPI path
every frontend API client
every runtime binding
every auth guard
every permission check
every status enum
every transition rule
every webhook/event/callback if present
every media endpoint
every Docker/runtime dependency
```

#### H) Data/media/runtime isolation

```text
every import from dsh/frontend/data
every import from dsh/frontend/media-fixtures
every preview adapter
every mock array inside runtime screen
every fixture image used by runtime screen
every static media path
every MinIO/media API path
every dsh_media_assets dependency
every tolerated violation in guards
```

Every item must be classified as one of:

```text
DEV_ONLY_KEEP
RUNTIME_VIOLATION_PENDING
REQUIRED_ADDITION
BLOCKED_WITH_REASON
DELETE_AFTER_ZERO_IMPORTS
```

#### I) UI/UX/design coverage

```text
every screen
every modal
every sheet
every tab
every navigation entry
every primary CTA
every secondary CTA
every destructive CTA
every empty/loading/error/success/offline/disabled state
every repeated local component
every local style/token/design system
every ui-kit import
every Tamagui usage outside ui-kit
every hardcoded visual token
every RTL issue
every screenshot evidence requirement
```

#### J) Performance/refactor/cleanup coverage

```text
every large file
every file mixing UI + state + API + data
every repeated constant/data map
every repeated component/pattern
every eager load/overfetch candidate
every polling loop
every list without pagination/virtualization where needed
every dead-code candidate
every duplicate/conflict candidate
every stale reference
```

### 5.2 Required Census Evidence Files

Before any `APPLY`, create these evidence files:

```text
full-operation-census.json
full-screen-census.json
full-api-route-census.json
full-control-panel-census.json
full-wlt-finance-boundary-census.json
full-data-media-runtime-isolation-census.json
full-ui-state-cta-census.json
full-performance-large-file-census.json
slice-binding-map.json
uncovered-items-register.md
```

### 5.3 Census Binding Rule

No slice execution may start until every discovered operation, screen, API, CTA, state, flow, permission, event, media path, finance item, file, and control-panel section is assigned to one of:

```text
existing journey/slice
REQUIRED_ADDITION with target slice
BLOCKED_WITH_REASON with proof needed
DEFERRED_WITH_REASON with explicit reason
DEV_ONLY_KEEP with isolation proof
DELETE_AFTER_ZERO_IMPORTS with retirement condition
```

---

## 6) Mandatory Per-Slice Full-Stack Closure Contract

Every slice must contain and pass all contract sections below.

If a section is not applicable, it must still be present and explicitly marked:

```text
NOT_APPLICABLE_WITH_REASON: <reason>
```

Blank sections are not allowed.

---

### 6.1 Business Operation Contract

For every slice, define:

```text
What human/business operation does this slice close?
Who starts the operation?
Who receives it?
Who approves it?
Who rejects it?
Who escalates it?
Who closes it?
What is the initial state?
What is the final state?
What are the forbidden states?
What are the allowed transition rules?
What errors can happen?
What fallback occurs when each error happens?
What audit record is required?
What notification/signal is required, if any?
What evidence proves the business operation works?
```

Required output in slice:

```markdown
## Business Operation Contract
- Operation:
- Initiator:
- Receiver:
- Approver:
- Rejector:
- Escalation owner:
- Closure owner:
- Initial state:
- Final state:
- Forbidden states:
- Allowed transitions:
- Failure paths:
- Fallback behavior:
- Audit requirement:
- Notification requirement:
- Evidence required:
- Decision:
```

---

### 6.2 App-Client Contract

For every slice, define whether and how it affects the customer application.

Required checks:

```text
Does this slice appear in app-client?
Which screen(s)?
Which navigation entry?
Which primary CTA?
Which secondary CTAs?
Which destructive CTAs?
Which loading state?
Which empty state?
Which error state?
Which offline state?
Which unauthorized state?
Which forbidden state?
Which success state?
Which disabled state?
Which API client?
Which data source?
Which cache/pagination/detail-on-open behavior?
Which runtime evidence?
Which screenshot evidence?
Does it avoid dsh/frontend/data as runtime source?
Does it avoid dsh/frontend/media-fixtures as runtime media source?
```

Required output in slice:

```markdown
## App-Client Contract
- Applicable: YES/NO
- Screens:
- Navigation:
- Primary CTA:
- Secondary CTAs:
- Destructive CTAs:
- States:
  - loading:
  - empty:
  - error:
  - offline:
  - unauthorized:
  - forbidden:
  - success:
  - disabled:
- API client:
- Data source:
- Media source:
- On-demand retrieval:
- Runtime evidence:
- Screenshot evidence:
- Fixture/runtime violation check:
- Decision:
```

---

### 6.3 App-Partner Contract

Required checks:

```text
Does this slice appear in app-partner?
Which store/catalog/order/readiness screen?
Which accept/reject/update/prepare/ready/cancel/escalate CTAs?
Are reasons captured for rejection/cancellation?
What readiness/availability rules apply?
What catalog/store/order states apply?
Which API binding is used?
Which evidence is required?
Which screenshots are required?
```

Required output in slice:

```markdown
## App-Partner Contract
- Applicable: YES/NO
- Screens:
- Primary CTA:
- Secondary CTAs:
- Reason capture:
- Readiness/availability rules:
- Catalog/store/order states:
- API binding:
- Data source:
- Media source:
- Evidence required:
- Screenshot evidence:
- Fixture/runtime violation check:
- Decision:
```

---

### 6.4 App-Captain Contract

Required checks:

```text
Does this slice appear in app-captain?
Assignment flow?
Accept/decline?
Pickup?
Delivery?
Failed delivery?
Return?
Proof of delivery?
Media upload?
Location/offline/poor-network states?
Payout/finance read-only, if any?
WLT boundary, if any?
Evidence?
```

Required output in slice:

```markdown
## App-Captain Contract
- Applicable: YES/NO
- Screens:
- Assignment flow:
- Accept/decline:
- Pickup:
- Delivery:
- Failed delivery:
- Return:
- Proof of delivery:
- Media upload:
- Location/offline states:
- Finance/WLT boundary:
- API binding:
- Evidence required:
- Screenshot evidence:
- Decision:
```

---

### 6.5 App-Field Contract

Required checks:

```text
Does this slice appear in app-field?
Lead intake?
Visit assignment?
Checklist?
Document capture?
Media upload?
Notes?
Approval/rejection handoff?
Escalation?
Partner activation?
Evidence?
```

Required output in slice:

```markdown
## App-Field Contract
- Applicable: YES/NO
- Screens:
- Lead intake:
- Visit assignment:
- Checklist:
- Document capture:
- Media upload:
- Notes:
- Approval/rejection handoff:
- Escalation:
- Partner activation:
- API binding:
- Evidence required:
- Screenshot evidence:
- Decision:
```

---

### 6.6 Control Panel Contract

Every slice must identify whether the control panel is affected.

Potential sections:

```text
Platform
Vars
Operations
Support
Partner Management
Captain Operations
Field Operations
Catalog
Finance
Audit
Dashboards
Media
Permissions/RBAC
```

Required checks:

```text
Which section is responsible?
Which page?
Which table/list?
Which filters?
Which details view?
Which CTAs?
Which states?
Which approve/reject/cancel/refund/escalate/rollback actions?
Which audit log?
Which permissions?
Which data source/API?
Which runtime evidence?
Which screenshot evidence?
```

Required output in slice:

```markdown
## Control Panel Contract
- Applicable: YES/NO
- Responsible section:
- Page/route:
- Table/list:
- Filters:
- Details view:
- Primary CTA:
- Secondary CTAs:
- Destructive CTAs:
- Actions:
  - approve:
  - reject:
  - cancel:
  - refund:
  - escalate:
  - rollback:
- States:
- Audit log:
- Permissions/RBAC:
- API binding:
- Evidence required:
- Screenshot evidence:
- Decision:
```

---

### 6.7 Backend/API/OpenAPI Contract

Required checks:

```text
Every required route.
Every handler.
Every repository method.
Every model/schema.
Every migration.
Every enum.
Every status transition.
Every validation rule.
Every idempotency key if needed.
Every event/callback/webhook if present.
Every OpenAPI path.
Every frontend API client.
Every response shape.
Every error shape.
Every auth guard.
Every request/response/log evidence item.
```

Required output in slice:

```markdown
## Backend/API/OpenAPI Contract
- Applicable: YES/NO
- Routes:
- Handlers:
- Repository methods:
- Models/schemas:
- Migrations:
- Enums:
- Status transitions:
- Validation rules:
- Idempotency:
- Events/callbacks/webhooks:
- OpenAPI paths:
- Frontend API clients:
- Response shape:
- Error shape:
- Auth guards:
- Request/response/log evidence:
- Decision:
```

---

### 6.8 WLT Finance Contract

WLT is the sole owner of:

```text
wallet
ledger
payment
refund
payout
settlement
reconciliation
```

DSH may only:

```text
read finance state
emit event to WLT
store cross-service references when needed
show read-only finance views
```

Required classification:

```text
WLT_OWNER
DSH_READ_ONLY
DSH_EVENT_TO_WLT
FINANCE_BOUNDARY_VIOLATION
```

Required output in slice:

```markdown
## WLT Finance Contract
- Applicable: YES/NO
- Financial domain:
  - wallet:
  - payment:
  - ledger:
  - refund:
  - payout:
  - settlement:
  - reconciliation:
- Owner:
- DSH role:
- WLT API/event/contract:
- Read-only references:
- Boundary classification:
- Finance evidence required:
- Violations:
- Decision:
```

No financial slice may be `DONE` without WLT evidence.

---

### 6.9 Media/MinIO Contract

Runtime images/files must use:

```text
MinIO/S3-compatible object storage
dsh_media_assets
media runtime API
```

Required media API path:

```text
POST /media/upload-intents
PUT file bytes to MinIO
POST /media/{media_id}/complete
GET /media
GET /media/{media_id}
DELETE /media/{media_id}
```

Required checks:

```text
Does this slice include images/files?
What file type: product/store/document/POD/inspection/support?
Does it use media API?
Does it use MinIO?
Does it store metadata in dsh_media_assets?
Does it create upload intent?
Does it PUT to MinIO?
Does it complete upload?
Does it GET media?
Does it avoid runtime media-fixtures?
Does Docker prove MinIO path?
```

Required output in slice:

```markdown
## Media/MinIO Contract
- Applicable: YES/NO
- File/media type:
- Media API endpoints:
- MinIO bucket:
- Metadata table:
- Upload intent evidence:
- PUT evidence:
- Complete evidence:
- GET evidence:
- Docker/MinIO health evidence:
- media-fixtures runtime usage:
- Decision:
```

---

### 6.10 Data Runtime Contract

Runtime data must come from:

```text
Backend/API/PostgreSQL
```

Not from:

```text
dsh/frontend/data
dsh/frontend/media-fixtures
local mock arrays inside runtime screens
preview adapters as final implementation
```

Required output in slice:

```markdown
## Data Runtime Contract
- Runtime data source:
- API endpoint:
- DB table/model:
- Frontend client:
- Cache strategy:
- Pagination:
- Detail-on-open:
- Preview-data imports:
- media-fixtures imports:
- Local mock arrays:
- Preview adapter usage:
- Runtime violation classification:
- Decision:
```

---

### 6.11 State Machine Contract

Required checks:

```text
Every status.
Allowed transitions.
Forbidden transitions.
Actor allowed per transition.
UI state for each transition.
Backend validation.
Audit record.
Notification if any.
Failure recovery.
Concurrent update behavior.
Repeated action behavior.
```

Required output in slice:

```markdown
## State Machine Contract
- Statuses:
- Allowed transitions:
- Forbidden transitions:
- Actor permissions per transition:
- UI state per transition:
- Backend validation:
- Audit record:
- Notification/signal:
- Failure recovery:
- Concurrent update behavior:
- Double-submit behavior:
- Decision:
```

---

### 6.12 Security/Auth/RBAC Contract

Required checks:

```text
Who can read?
Who can create?
Who can update?
Who can delete?
Who can approve/reject/refund/cancel/escalate?
What token/session behavior applies?
What happens when token expires?
What unauthorized UX appears?
What forbidden UX appears?
Which backend middleware applies?
Which control-panel permission applies?
Which audit evidence is required?
```

Required output in slice:

```markdown
## Security/Auth/RBAC Contract
- Read permission:
- Create permission:
- Update permission:
- Delete permission:
- Approve/reject permission:
- Refund/cancel/escalate permission:
- Token/session behavior:
- Expired token behavior:
- Unauthorized UX:
- Forbidden UX:
- Backend middleware:
- Control-panel permission:
- Audit evidence:
- Decision:
```

---

### 6.13 Notification/Signal Contract

Required checks:

```text
Does this slice create a notification?
Who receives it?
When is it sent?
How duplicate notifications are prevented?
Read/unread state?
Preferences?
Source of truth?
Finance notifications must come from WLT/event contract.
```

Required output in slice:

```markdown
## Notification/Signal Contract
- Applicable: YES/NO
- Trigger:
- Recipient:
- Channel:
- Duplicate prevention:
- Read/unread state:
- Preferences:
- Source of truth:
- Finance boundary:
- Evidence required:
- Decision:
```

---

### 6.14 Performance Contract

Required checks:

```text
Does the slice contain list/feed/history?
Pagination or explicit finite-size justification.
Virtualized list when needed.
No overfetching.
No eager detail loading.
No N+1 media/product query.
Caching.
Retry/backoff.
Polling limit.
Large-file split if needed.
No file mixing UI + state + API + data without reason.
```

Required output in slice:

```markdown
## Performance Contract
- List/feed/history:
- Pagination:
- Virtualization:
- Detail-on-open:
- Overfetching check:
- N+1 check:
- Caching:
- Retry/backoff:
- Polling limit:
- Large file check:
- Split required:
- Evidence required:
- Decision:
```

---

### 6.15 UX/UI/Design Contract

Required checks:

```text
Every screen.
Every modal.
Every sheet.
Every tab.
Every CTA.
Every state.
RTL.
Accessibility basics.
Destructive confirmation.
No Tamagui outside ui-kit.
No deep imports.
No local design system.
No hardcoded random tokens.
Screenshot evidence.
```

Required output in slice:

```markdown
## UX/UI/Design Contract
- Screens:
- Modals:
- Sheets:
- Tabs:
- Primary CTA:
- Secondary CTAs:
- Destructive CTAs:
- States:
- RTL:
- Accessibility basics:
- Destructive confirmation:
- UI-kit usage:
- Tamagui outside ui-kit:
- Deep imports:
- Local design system:
- Hardcoded tokens:
- Screenshot evidence:
- Decision:
```

---

### 6.16 Test/Evidence Contract

Required evidence per slice:

```text
git status
git diff name-status
git diff check
typecheck
tests when available/runtime-relevant
runtime smoke
Docker smoke when runtime/Docker is affected
media smoke when images/files are affected
WLT smoke when finance is affected
control-panel smoke when control-panel is affected
screenshots when UI is affected
final slice decision
slice evidence zip
```

Required output in slice:

```markdown
## Test/Evidence Contract
- git status:
- git diff name-status:
- git diff check:
- typecheck:
- tests:
- runtime smoke:
- Docker smoke:
- media smoke:
- WLT smoke:
- control-panel smoke:
- screenshots:
- evidence zip:
- final decision:
```

---

### 6.17 Adversarial Review Contract

After implementation and before `DONE`, review the slice against these scenarios:

```text
What if the user double-clicks or submits twice?
What if the network drops?
What if the token expires?
What if the partner rejects?
What if the captain declines or never accepts?
What if payment fails?
What if MinIO is unavailable?
What if WLT is unavailable?
What if the operation repeats?
What if the state changes from another device?
What if permission is insufficient?
What if required data is missing?
What if image upload fails?
What if rollback is required?
What if audit is required?
What if the order is cancelled mid-flow?
What if a stale UI submits an outdated transition?
What if a retry duplicates an event?
What if a list grows to large size?
What if a file exceeds accepted size/type?
What if a control-panel operator performs a destructive action?
```

Any unresolved issue becomes:

```text
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

Required output in slice:

```markdown
## Adversarial Review Contract
- Double-submit:
- Network failure:
- Expired token:
- Actor rejection/decline:
- Payment failure:
- MinIO unavailable:
- WLT unavailable:
- Repeated operation:
- Concurrent state change:
- Insufficient permission:
- Missing data:
- Image upload failure:
- Rollback required:
- Audit required:
- Stale UI transition:
- Duplicate retry/event:
- Large list behavior:
- Invalid file size/type:
- Destructive control-panel action:
- Decision:
```

---

## 7) Per-Slice DONE Rule

A slice may be marked `DONE` only if all are true:

```text
Every affected app is covered.
Every affected control-panel section is covered.
Every API/backend/runtime dependency is covered.
Every WLT boundary is covered where finance exists.
Every media/MinIO flow is covered where images/files exist.
Every data source is runtime-safe.
Every state and CTA is covered.
Every failure path is covered.
Every Auth/RBAC permission is covered.
Every performance risk is resolved or justified.
Every UI/design requirement has screenshots when applicable.
Every test/evidence requirement is present.
No runtime import exists from dsh/frontend/data.
No runtime import exists from dsh/frontend/media-fixtures.
No fixture is used as runtime proof.
No blocker remains.
No unclassified item remains.
No tolerated guard violation remains unbound to a slice/register.
```

If any item is false, decision is not `DONE`.

---

## 8) Required V6 Addition to Every Slice File

Every `*.slice*.md` file must include this section, filled with concrete content:

```markdown
---

# V6 Multi-Surface Full-Stack Closure Contract

## V6 Decision
- Decision: FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE / DONE
- Reason:
- Evidence path:

## Affected Surfaces
- app-client:
- app-partner:
- app-captain:
- app-field:
- control-panel:
- backend/API:
- OpenAPI/binding:
- WLT:
- Auth/RBAC:
- Docker/runtime:
- MinIO/media:
- PostgreSQL/data:
- notifications/signals:
- performance:
- UI/UX/design:

## Business Operation Contract
...

## App-Client Contract
...

## App-Partner Contract
...

## App-Captain Contract
...

## App-Field Contract
...

## Control Panel Contract
...

## Backend/API/OpenAPI Contract
...

## WLT Finance Contract
...

## Media/MinIO Contract
...

## Data Runtime Contract
...

## State Machine Contract
...

## Security/Auth/RBAC Contract
...

## Notification/Signal Contract
...

## Performance Contract
...

## UX/UI/Design Contract
...

## Test/Evidence Contract
...

## Adversarial Review Contract
...

## Final Slice DONE Gate
- All affected surfaces covered: YES/NO
- Runtime data source proven: YES/NO
- Runtime media source proven: YES/NO/NOT_APPLICABLE
- WLT boundary proven: YES/NO/NOT_APPLICABLE
- Control panel covered: YES/NO/NOT_APPLICABLE
- Auth/RBAC covered: YES/NO
- States/CTAs covered: YES/NO
- Failure paths covered: YES/NO
- Performance covered: YES/NO
- Visual evidence attached: YES/NO/NOT_APPLICABLE
- Runtime evidence attached: YES/NO
- Docker evidence attached: YES/NO/NOT_APPLICABLE
- No fixture runtime imports: YES/NO
- No blockers: YES/NO
- Final decision:
```

---

## 9) Required V6 Root Evidence Files

The upgraded package must require these root files:

```text
dsh/docs/JOURNIES/JOURNIES_V6_MULTI_SURFACE_FULL_STACK_CLOSURE_CONTRACT.md
dsh/docs/JOURNIES/JOURNIES_V6_FULL_OPERATION_SCREEN_FLOW_LOGIC_CENSUS.md
dsh/docs/JOURNIES/JOURNIES_V6_SLICE_BINDING_MAP.md
dsh/docs/JOURNIES/JOURNIES_V6_UNCOVERED_ITEMS_REGISTER.md
dsh/docs/JOURNIES/JOURNIES_V6_ADVERSARIAL_REVIEW_REGISTER.md
dsh/docs/JOURNIES/JOURNIES_V6_FINAL_RUNTIME_READINESS_GATE.md
```

If only one file can be added, this file is the controlling root file and the other files may be generated during execution as evidence outputs.

---

## 10) Required V6 Evidence Outputs

Before implementation:

```text
full-operation-census.json
full-screen-census.json
full-api-route-census.json
full-control-panel-census.json
full-wlt-finance-boundary-census.json
full-data-media-runtime-isolation-census.json
full-ui-state-cta-census.json
full-performance-large-file-census.json
slice-binding-map.json
uncovered-items-register.md
```

Per slice:

```text
01-slice-scope.md
02-files-inspected.txt
03-files-changed.txt
04-git-status.txt
05-git-diff-name-status.txt
06-git-diff-check.txt
07-typecheck.txt
08-tests.txt
09-runtime-smoke.txt
10-docker-smoke.txt
11-media-upload-smoke.txt
12-wlt-boundary-check.txt
13-control-panel-check.txt
14-visual-evidence.md
15-adversarial-review.md
16-final-slice-decision.md
{SESSION_ID}.zip
```

Final regression:

```text
git-status-final.txt
git-diff-name-status-final.txt
git-diff-check-final.txt
typecheck-final.txt
tests-final.txt
docker-stack-status.txt
dsh-api-smoke.txt
auth-smoke.txt
wlt-api-smoke.txt
minio-smoke.txt
media-upload-intent-complete-smoke.txt
client-order-happy-path.txt
partner-order-flow.txt
captain-delivery-flow.txt
field-readiness-flow.txt
control-panel-ops-flow.txt
wlt-finance-boundary-flow.txt
failure-cancel-refund-flow.txt
preview-fixtures-runtime-guard.txt
zero-runtime-imports-from-data-media-fixtures.txt
screenshots-index.md
adversarial-final-review.md
final-decision.md
DSH_WLT_FINAL_REGRESSION-YYYYMMDD-HHMMSS.zip
```

---

## 11) Preview/Data/Media Isolation Rule

The project is no longer in UI Preview mode for closure.

These paths are DEV/PREVIEW only:

```text
dsh/frontend/data
dsh/frontend/media-fixtures
```

`dsh/frontend/data`:

```text
DEV_ONLY_PREVIEW_DATA only.
Not runtime truth.
Not API source.
Not backend data.
Not binding source.
Cannot be used to close a slice.
Runtime imports are blockers.
```

`dsh/frontend/media-fixtures`:

```text
DEV_ONLY_MEDIA_FIXTURES only.
Not runtime media storage.
Not runtime images.
Not copied into Docker image.
Not bind-mounted as runtime solution.
Not served as /media-fixtures in Docker.
Runtime image usage is blocker.
```

Correct runtime path:

```text
Backend/API/PostgreSQL for data.
MinIO/S3-compatible object storage + dsh_media_assets + media runtime API for images/files.
```

Do not delete these folders immediately.

Retire/delete only after evidence proves:

```text
zero runtime imports
media-fixtures runtime guard passes
typecheck passes
runtime smoke passes
Docker runtime passes
upload intent/complete to MinIO passes
no app/control-panel/Docker/runtime flow depends on them
```

---

## 12) Control Panel Minimum Closure Map

Every slice must explicitly examine whether it affects any of these sections:

```text
Platform
Vars
Operations
Support
Partner Management
Captain Operations
Field Operations
Catalog
Finance
Audit
Dashboards
Media
Permissions/RBAC
```

Control panel closure is required if the operation needs monitoring, approval, rejection, rollback, audit, exception handling, permissions, configuration, operational control, finance visibility, or support handling.

A flow is not complete if the application works but the control panel cannot observe, control, audit, or support the required operational behavior.

---

## 13) WLT Minimum Closure Map

Any financial operation must be traced through WLT.

Financial domains:

```text
wallet
payment
ledger
refund
payout
settlement
reconciliation
```

DSH may not own or duplicate financial mutation logic.

Any DSH-side financial mutation is:

```text
FINANCE_BOUNDARY_VIOLATION
```

No checkout/payment/refund/payout/settlement/reconciliation slice may be `DONE` without WLT evidence.

---

## 14) Docker/Runtime Minimum Closure Map

Docker/local runtime closure must prove, when relevant:

```text
DSH API running
Auth running
WLT API running
PostgreSQL running
MinIO running for media slices
correct ports/env
no backend service using Expo/Metro reserved ports
media upload path uses MinIO, not media-fixtures
runtime smoke passes
```

Docker readiness cannot be claimed from compose files alone. It must be proven by runtime evidence.

---

## 15) Performance Minimum Closure Map

Every list/history/feed/order/catalog screen must have one of:

```text
pagination
virtualization
finite-size justification
on-demand detail loading
```

Every media/product-heavy flow must check:

```text
no N+1 media fetch
no eager full detail load
no duplicated large inline arrays
no repeated constants in screens
no uncontrolled polling
retry/backoff policy
```

Any file mixing UI + state + API + data in a way that blocks maintainability or runtime performance must be classified:

```text
LARGE_FILE_SPLIT_REQUIRED
```

---

## 16) Required Agent/Claude Code Instruction Insert

Use this insertion in Claude Code before implementation:

```text
Before executing any slice, upgrade the slice to the V6 Multi-Surface Full-Stack Closure Contract. Do not implement or close the slice until it explicitly covers app-client, app-partner, app-captain, app-field, control-panel, backend/API, OpenAPI/binding, Auth/RBAC, WLT if money exists, MinIO/media if images/files exist, Docker/runtime, data source, state machine, CTAs, failure paths, notifications, audit, performance, UI/UX/design, tests, evidence, and adversarial review. If any surface is not applicable, mark NOT_APPLICABLE_WITH_REASON. If any surface is missing or unclear, decision is FIX_REQUIRED, BLOCKED, NEEDS_EVIDENCE, or NEEDS_VISUAL_EVIDENCE. DONE is forbidden until all affected surfaces are proven by evidence.
```

---

## 17) Package Upgrade Decision

Current package status:

```text
V5 = FIX_REQUIRED
```

Required upgrade:

```text
V6 = add this file + apply the contract to every one of the 84 slices + generate Phase 0.5 full live-code census + regenerate evidence.
```

No V5 slice should be treated as final closure until it passes V6.

---

## 18) Final Readiness Gate

Final readiness is allowed only when all are true:

```text
Every journey processed.
Every slice processed.
Every discovered operation bound to a slice or blocker.
Every discovered screen bound to a slice or blocker.
Every API route bound to a slice or blocker.
Every control-panel section bound to a slice or blocker.
Every WLT financial path classified and proven.
Every media path uses MinIO/media API or is DEV_ONLY_KEEP.
Every runtime import from dsh/frontend/data is removed or isolated as DEV_ONLY.
Every runtime import from dsh/frontend/media-fixtures is removed or isolated as DEV_ONLY.
Every UI change has screenshot evidence.
Every runtime path has smoke evidence.
Every Docker-dependent slice has Docker evidence.
Every media-dependent slice has MinIO upload/complete/get evidence.
Every financial slice has WLT evidence.
Every blocker is resolved or explicitly remains BLOCKED.
Final adversarial review has no unresolved high-impact gap.
```

Allowed final decision:

```text
DONE
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

No other final decision is valid.

---

## 19) Self-Validation Checklist for This File

This file intentionally includes:

```text
V5 gap statement
V6 governing rule
Phase 0.5 full census
Mandatory per-slice full-stack contract
Multi-surface app contracts
Control panel contract
Backend/API/OpenAPI contract
WLT finance contract
Media/MinIO contract
Data runtime isolation contract
State machine contract
Security/Auth/RBAC contract
Notification/signal contract
Performance contract
UX/UI/design contract
Test/evidence contract
Adversarial review contract
DONE gate
Required evidence files
Preview/data/media isolation rule
Final readiness gate
```

This file does not claim final perfection. It enforces a stronger process to reach:

```text
NO_KNOWN_GAPS_AFTER_EVIDENCE
```

---

## 20) Installation Instruction

Add this file to the package at:

```text
dsh/docs/JOURNIES/JOURNIES_V6_MULTI_SURFACE_FULL_STACK_CLOSURE_CONTRACT.md
```

Then update the package README / manifest / execution order to require this file before any Phase 2 implementation.

Recommended package decision after adding this file but before applying it to all slices:

```text
PACKAGE_UPGRADED_TO_V6_RULESET
SLICE_CONTENT_STILL_FIX_REQUIRED_UNTIL_EACH_SLICE_IS_REGENERATED_WITH_THE_V6_CONTRACT_AND_EVIDENCE_PASSES
```
