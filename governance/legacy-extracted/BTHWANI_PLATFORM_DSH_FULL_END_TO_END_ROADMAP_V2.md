# Extracted Legacy Governance — BThwani Platform + DSH Full End-to-End Forensic Closure Roadmap

Status: LEGACY_EXTRACTED_CANONICAL_REVIEW
Source: $Source
Source SHA256: $Hash
Extraction session: $SessionId

## Extraction Rule

This file preserves rich content from docs/governance/ before the legacy root is deleted later.

This is not final canonical policy by itself. Any rule inside this extracted file must be promoted explicitly into a canonical governance file before it becomes active truth.

---
# BThwani Platform + DSH Full End-to-End Forensic Closure Roadmap

**Version:** 2.0
**Date:** 2026-04-28
**Target repo:** `C:\bthwani-suite`
**Primary service for first closure:** `DSH`
**Execution mode of this document:** Roadmap / forensic plan / correction protocol / verification contract.
**Important:** This document does **not** claim that the repository is already closed. It defines the exact evidence-based path required to reach closure.

---

## 0. Executive Verdict

The correct closure strategy for BThwani is not to continue screen-by-screen visual fixes. The platform has reached a stage where scattered fixes will increase drift unless the repo is first governed by strict ownership, boundary, flow, API, binding, integration, runtime, backend, security, testing, and evidence gates.

The required full end-to-end direction is:

```text
Branch Reality Proof
→ Platform Structure Forensics
→ DSH End-to-End Forensics
→ Platform Boundary Contract
→ DSH Logic / Flow Closure
→ DSH Gap Closure
→ UX / UI / RTL / State Closure
→ Technical Cleanup + Package Boundary Repair
→ Contract / API Forensics
→ API Types + API Clients Closure
→ Binding Layer Closure
→ Integration Closure
→ Runtime / Local Production-like Readiness
→ Backend / Service Readiness
→ Data / Persistence / Migration Closure
→ Security / RBAC / Privacy / Audit Closure
→ Observability / Monitoring / Incident Readiness
→ Test Pyramid + E2E Closure
→ Performance / Accessibility / Quality Gate
→ Production Readiness + Release / Cutover Gate
→ Generalize the DSH model to the remaining services
```

The critical decision is:

```text
DSH is not closed as screens.
DSH is closed as a full service system across:
app-client + app-partner + app-captain + app-field + control-panel
with webapp/website treated as [TBD] extensions unless repo evidence proves active DSH relation.
```

The closure must prove all of the following with evidence:

- Correct platform tree ownership.
- Apps are shell/host only.
- App-shells own only root/shell/navigation/provider/boot behavior.
- Surfaces own screens, flows, and service/surface experiences.
- `@bthwani/ui-kit` owns reusable design, tokens, states, headers, primitives, direction, and shared UI contracts.
- DSH logic is complete from customer request to partner operation, captain delivery, field/support involvement, control-panel oversight, and WLT/payment relationship.
- DSH contract/API/binding/integration/runtime/backend path is complete and verifiable.
- No package boundary leakage.
- No content leakage.
- No runtime/env/API leakage inside UI-only layers.
- No dead/orphan/noise files promoted as truth.
- No generic shared folders without explicit owner and proven consumers.
- No bloated screens, fragmented blocks named as screens, or route screens hidden inside ambiguous files.
- No final claim without an Evidence Pack.

---

## 1. Evidence Basis and Known Constraints

### 1.1 Source hierarchy

Use this priority when making any decision:

1. Latest explicit user instruction.
2. Approved Project Sources.
3. Repo evidence from files, commands, branches, and outputs.
4. Historical docs or prompt files as donor/reference only.
5. Anything unproven = `[TBD]`.

### 1.2 Current canonical base

Canonical repo path:

```text
C:\bthwani-suite
```

Canonical evidence root going forward:

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}
```

Canonical shell policy:

```text
PowerShell-only orchestration
Terminal-first
Evidence-first
CHECK → VERIFY → FORENSICS → APPLY → VERIFY
pnpm + Nx only
No npm
```

Canonical services:

```text
dsh, wlt, knz, arb, amn, esf, mrf, snd, kwd
```

Canonical surfaces:

```text
app-client
app-partner
app-captain
app-field
control-panel
webapp
website
```

Not canonical as standalone service:

```text
exchangeprice
hr
```

### 1.3 Current repo branch reality to verify before implementation

A read-only GitHub check showed:

- The repository exists as private under `bthwani2-boop/bthwani-suite`.
- `main` exists but must not be assumed as the latest implementation truth.
- `ghb/0101-20260428-203657-checkpoint` exists and appears to be a recent checkpoint branch.
- `main/package.json` is much lighter than the checkpoint branch, while the checkpoint branch contains broader workspace scripts and dependency locks.

Therefore, every execution session must begin by proving branch reality:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager log --oneline -n 10
git branch --list
```

**Decision:** Do not assume `main` is truth. The active implementation branch must be selected by evidence before APPLY.

### 1.4 Status vocabulary

Use only these statuses:

```text
TEMPLATE
TBD
UNPROVEN
VERIFIED
CLOSED
BLOCKED
STALE_PATH
DEPRECATED
REJECTED
```

`CLOSED` is forbidden unless all defined exit criteria pass with evidence.

---

## 2. Platform Closure Contract

### 2.1 Ownership contract

```text
apps/*
= Shell / host only

packages/app-shells
= Root shell behavior only

packages/surfaces
= Screens, flows, feature experiences, surface-owned and service-owned UI/UX

packages/ui-kit
= Central reusable design authority

contracts/*
= API/domain contracts if present and proven

packages/api-types
= Generated or contract-derived API types only

packages/api-clients
= Generated or contract-derived API clients only

services/*
= Service/backend/domain implementation if present and proven

governance
= Canonical governance and standards

tools/registry/runs
= Evidence packs only
```

### 2.2 Apps are shell only

Allowed in `apps/*`:

```text
- Expo / Next entry
- App.tsx / layout bootstrap
- routing mount
- provider bridge
- platform config
- metadata
- minimal environment wiring
```

Forbidden in `apps/*`:

```text
- Real screens
- Service flows
- Business/domain logic
- Reusable UI components
- Local headers/cards/buttons/lists/forms
- Local design tokens/colors/spacing/radius/elevation
- Mock service content
- DSH/WLT/ARB/etc domain logic
- Independent i18n/direction ownership
- Direct API/service client consumption unless explicitly approved as boot-only and proven
- Deep/private imports from package internals
```

Any breach is classified as:

```text
APP_SHELL_BREACH
APP_RUNTIME_LEAKAGE
APP_API_LEAKAGE
```

### 2.3 App-shells boundary

Allowed in `packages/app-shells`:

```text
- shell host components
- navigation bridge
- provider/root behavior
- boot-time platform bridging
- surface host orchestration
- minimal route state if not owned by a service flow
```

Forbidden in `packages/app-shells`:

```text
- Service screen bodies
- Large business logic
- Service-specific mock data
- Domain content
- DSH order lifecycle data arrays
- Partner/captain/field operational datasets that belong to surfaces or binding adapters
- UI component families that belong to ui-kit
- Direct backend integration ownership unless proven as boot/runtime provider bridge
```

Any breach is classified as:

```text
APP_SHELL_DOMAIN_LEAKAGE
APP_SHELL_SCREEN_LEAKAGE
APP_SHELL_CONTENT_LEAKAGE
APP_SHELL_API_BINDING_LEAKAGE
```

### 2.4 Surfaces boundary

Canonical structure:

```text
packages/surfaces/src/service-owned/<service>/<surface>
packages/surfaces/src/surface-owned/<surface>
packages/surfaces/src/public/<surface>.ts
```

Rules:

```text
service-owned/<service>/<surface>
= Flow/screen/experience for one service inside one surface

surface-owned/<surface>
= Surface-wide experience not owned by one service

public/<surface>.ts
= Public surface contract only
```

Forbidden:

```text
- service-owned owning root app shell
- surface-owned owning service-specific DSH/WLT/ARB logic
- service-owned importing another service-owned module without a proven contract
- public exports leaking internal parts/components unless intentionally part of the contract
- screen files directly owning backend URLs, secrets, environment resolution, or generated-client wiring
```

### 2.5 UI Kit authority

`@bthwani/ui-kit` owns:

```text
- tokens
- colors
- typography
- spacing
- radius
- elevation
- motion
- direction helpers
- primitives
- headers/topbars/tickers
- reusable cards/buttons/lists/forms/modals/states
- reusable payment decision UI
- reusable order-linked chat UI if generic
- reusable RTL-safe interaction patterns
```

Forbidden outside UI Kit:

```text
- reusable UI component families
- local tokens
- local color systems
- local header families
- generic states implemented repeatedly
- random hardcoded colors
- duplicate design systems
```

Brand palette:

```text
Deep Blue: #0A2F5C
Orange:    #FF500D
White:     #FFFFFF
```

### 2.6 Shared folder governance

`shared` is allowed only if all are true:

```text
1. The folder has a bounded scope.
2. The owner is explicit.
3. There are at least two proven consumers.
4. It contains no service-specific content unless scoped to that service.
5. It is not a disguised ui-kit candidate.
6. It is not a disguised app-shells candidate.
7. It is not a dumping ground.
```

Classify every `shared/common/components/widgets/blocks/parts` folder as:

```text
LEGITIMATE_SCOPED_SHARED
TOO_GENERIC_SHARED
UI_KIT_CANDIDATE
APP_SHELLS_CANDIDATE
SURFACE_OWNED_CANDIDATE
SERVICE_OWNED_CANDIDATE
BINDING_CANDIDATE
API_CLIENT_CANDIDATE
DUPLICATE_CANDIDATE
ORPHAN_CANDIDATE
DEAD_CANDIDATE
[TBD]
```

---

## 3. Screen File Model Contract

The correct model for BThwani screens is:

```text
Feature / Flow Folder
→ Route Screen Files
→ parts / hooks / types
```

### 3.1 Correct structure example

```text
packages/surfaces/src/service-owned/dsh/app-partner/orders/
  index.ts
  OrdersScreen.tsx
  OrderDetailsScreen.tsx
  parts/
    OrderCard.tsx
    OrderTimeline.tsx
    OrderActionBar.tsx
    OrderDetailsSheet.tsx
  hooks/
    useOrdersViewModel.ts
  types.ts
```

### 3.2 Rules

- A `*Screen.tsx` file must represent a real route/page/surface entry.
- A card/row/section/block must never be named `Screen`.
- One large file containing many unrelated route screens is a bloated screen breach.
- A block extracted as its own fake screen is a fragmented screen breach.
- `index.ts` exports screen entries only, not private `parts`, unless proven intentional.
- Do not create one folder per page by default. Use a page folder only when the page has enough local complexity.
- Do not place all orders logic in one giant `order.tsx` file.
- Use feature folders like `orders`, `checkout`, `tracking`, `storefront`, `catalog`, `support`, `settings`, `finance`.
- Screens must consume view-state, not own raw backend calls directly.
- Any data dependency must be classified as `fixture`, `binding`, `api-client`, `service`, or `[TBD]`.

### 3.3 Classifications

Every UI file must be classified as exactly one primary owner:

```text
ROUTE_SCREEN
LOCAL_PART
FEATURE_COMPONENT
SURFACE_OWNED_COMPONENT
APP_SHELL_COMPONENT
UI_KIT_COMPONENT
FIXTURE_DATA
VIEW_MODEL
BINDING_ADAPTER
PUBLIC_EXPORT_CONTRACT
DEAD_ORPHAN_CANDIDATE
MISPLACED
DUPLICATE
LEGACY_STALE
[TBD]
```

---

## 4. DSH End-to-End Service Contract

DSH must be closed as a full service lifecycle.

### 4.1 DSH actors and surfaces

| Actor | Surface | DSH role |
|---|---|---|
| Customer | app-client | Discover store, build cart, checkout, pay, track, message, rate |
| Partner / Store | app-partner | Receive, accept/reject, prepare, mark ready, manage catalog, handle order issues |
| Captain | app-captain | Accept task, pickup, deliver, report issue, complete delivery |
| Field / Ops | app-field | Field support, inspection, verification, problem resolution if proven |
| Admin / Operations | control-panel | Monitor, govern, intervene, configure, audit, support |
| Wallet / Ledger relation | WLT | Payment, balance, settlement, refunds, partner/captain financial effect |
| Backend/API | services + api packages | Contract, validation, persistence, event, security, integration owner |

### 4.2 DSH primary lifecycle

```text
Store discovery
→ Storefront
→ Product selection
→ Cart
→ Checkout
→ Payment decision
→ Order created
→ Partner intake
→ Partner accept/reject
→ Partner prepare
→ Partner ready/handoff
→ Captain assignment
→ Captain pickup
→ Out for delivery
→ Customer tracking
→ Delivery confirmation
→ Rating
→ Settlement/refund/support paths
→ Control-panel monitoring and intervention
```

### 4.3 DSH required flow domains

```text
DSH-HOME
DSH-STORE-DISCOVERY
DSH-STOREFRONT
DSH-CATALOG
DSH-PRODUCT
DSH-CART
DSH-CHECKOUT
DSH-PAYMENT
DSH-ORDER-CREATION
DSH-PARTNER-INTAKE
DSH-PARTNER-PREPARE
DSH-PARTNER-HANDOFF
DSH-CAPTAIN-ASSIGNMENT
DSH-CAPTAIN-PICKUP
DSH-CAPTAIN-DELIVERY
DSH-CUSTOMER-TRACKING
DSH-ORDER-DETAILS
DSH-ORDER-CHAT
DSH-ISSUE-SUPPORT
DSH-RATING
DSH-WLT-RELATION
DSH-CONTROL-PANEL-OPERATIONS
DSH-CONTROL-PANEL-CATALOGS
DSH-CONTROL-PANEL-MARKETING
DSH-CONTROL-PANEL-FINANCE-RELATION
DSH-CONTROL-PANEL-GOVERNANCE
DSH-CONTRACT-API
DSH-BINDING
DSH-INTEGRATION
DSH-RUNTIME
DSH-BACKEND
DSH-SECURITY
DSH-OBSERVABILITY
DSH-TESTING
DSH-PRODUCTION
```

### 4.4 Expected DSH matrix fields

For every flow, produce this matrix:

```text
Flow ID
Flow Name
Business Meaning
Actor
Surface
Expected Screen / Route / Sheet / State
Expected Contract / API / Binding if applicable
Current Evidence Path
Current Status
Required Counterpart Surfaces
Required Backend/API Counterpart
Missing Links
Missing States
Missing Contracts
Owner Path
Decision
Priority P0/P1/P2
Verification Gate
```

### 4.5 DSH gap map fields

For every gap:

```text
Gap ID
Gap Type
Affected Flow
Surface / Layer
Expected
Current
Evidence Path
Impact
Priority
Closure Type
Target Owner Path
Suggested Files
Blocked By
Verification Gate
```

Gap types:

```text
MISSING_SCREEN
MISSING_ROUTE
MISSING_SHEET_DRAWER
MISSING_STATE
MISSING_LINK
MISSING_COUNTERPART_SURFACE
MISSING_CONTRACT
MISSING_OPERATION_ID
MISSING_API_TYPE
MISSING_API_CLIENT
MISSING_BINDING_ADAPTER
MISSING_RUNTIME_PROVIDER
MISSING_BACKEND_HANDLER
MISSING_PERSISTENCE_MODEL
MISSING_INTEGRATION_EVENT
MISSING_SECURITY_POLICY
MISSING_OBSERVABILITY_SIGNAL
MISSING_TEST_COVERAGE
OWNERSHIP_BREACH
UI_KIT_BREACH
APP_SHELL_BREACH
SURFACE_BOUNDARY_BREACH
PACKAGE_BOUNDARY_BREACH
API_BOUNDARY_BREACH
BINDING_BOUNDARY_BREACH
DUPLICATE_NOISE
ORPHAN_DEAD_CANDIDATE
RUNTIME_LEAKAGE
CONTENT_LEAKAGE
[TBD]
```

Closure types:

```text
ADD_SCREEN
ADD_ROUTE
ADD_SHEET
ADD_PART
ADD_STATE
ADD_LINK
ADD_CONTRACT_OPERATION
ADD_API_TYPE
GENERATE_API_CLIENT
ADD_BINDING_ADAPTER
ADD_RUNTIME_PROVIDER
ADD_BACKEND_HANDLER
ADD_PERSISTENCE_MODEL
ADD_INTEGRATION_EVENT
ADD_SECURITY_GUARD
ADD_OBSERVABILITY_SIGNAL
ADD_TEST
MOVE_EXISTING
RECLASSIFY
EXPOSE_PUBLIC_EXPORT
PROMOTE_TO_UI_KIT
PROMOTE_TO_APP_SHELLS
PROMOTE_TO_SURFACE_OWNED
REMOVE_DUPLICATE_LATER
MARK_TBD
BLOCKED
```

Important: not every gap means a new screen. Some gaps are better closed by a sheet, a state, a route link, a move, a contract operation, a binding adapter, a generated client, or a public export repair.

---

## 5. Severity Model

### P0 — Closure blocker

A P0 issue prevents DSH/platform closure.

Examples:

- App owns real service screens.
- App-shells contain DSH business data or operational flow bodies.
- DSH order lifecycle has no partner/captain counterpart.
- Payment flow appears without WLT/payment state clarity.
- Control-panel cannot monitor or intervene in DSH orders.
- Deep/private imports create boundary leakage.
- TypeScript cannot pass.
- Screen states are missing for core DSH flows.
- UI Kit imports or contracts are broken.
- A core DSH flow has no contract/API/binding path when binding mode is required.
- Generated API types/clients are missing or hand-written inconsistently.
- Runtime provider selection is uncontrolled or hardcoded.
- Security/RBAC/audit requirements are missing for admin/payment/order mutation flows.
- No test path exists for P0 flows.

### P1 — High risk / user or maintainability damage

Examples:

- Naming drift makes ownership unclear.
- Shared folders have multiple ambiguous owners.
- RTL layout is partially correct but element relationships are wrong.
- Duplicate headers/tickers/cards are present.
- Bloated screen files above agreed complexity limits.
- Orphan files are likely noise but not yet proven safe to remove.
- API operation naming is unstable or inconsistent.
- Binding adapters mix fixtures, API clients, and view-state in one file.
- Observability exists but lacks trace/correlation.

### P2 — Cleanup / enhancement / quality completion

Examples:

- Minor visual refinement.
- Small naming polish.
- Non-critical consolidation.
- Optional UX animation after flow closure.
- Documentation improvement after evidence is generated.
- Non-critical performance optimization.
- Additional dashboards after minimum observability closure.

---

# 6. Phase Roadmap

## Phase 0A — Platform Structure Forensics

**Goal:** Build a full reality map of the repo before any correction.
**Mode:** CHECK / VERIFY / FORENSICS only. No APPLY.

### 0A.1 Inputs

Scope:

```text
apps/mobile/app-client
apps/mobile/app-partner
apps/mobile/app-captain
apps/mobile/app-field
apps/web/control-panel
apps/web/webapp
apps/web/website
packages/app-shells
packages/surfaces
packages/ui-kit
packages/api-types
packages/api-clients
services
contracts
governance
tools
```

### 0A.2 Checks

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Then generate scans:

```text
repo tree scan
apps shell purity scan
app-shells boundary scan
surfaces boundary scan
ui-kit authority scan
shared folders scan
screen file model scan
orphan/dead/noise scan
deep imports scan
public exports leakage scan
hardcoded colors/tokens scan
runtime leakage scan
documentation/path drift scan
contracts/api tree scan
generated api types/clients scan
services/backend tree scan
```

### 0A.3 Required output files

```text
tools/registry/runs/{SESSION_ID}/
  SUMMARY.md
  status.txt
  evidence.json
  commands.log
  git-status.txt
  git-diff-check.txt
  tsc-noemit.txt
  platform-tree-map.md
  platform-ownership-matrix.md
  apps-shell-purity-report.md
  app-shells-boundary-report.md
  surfaces-boundary-report.md
  ui-kit-authority-report.md
  shared-folders-governance-report.md
  screen-file-model-report.md
  orphan-dead-noise-report.md
  deep-imports-report.md
  public-exports-leakage-report.md
  package-boundary-violations.md
  runtime-leakage-report.md
  path-drift-report.md
  contracts-api-tree-report.md
  api-types-clients-report.md
  services-backend-tree-report.md
  platform-cleanup-plan.md
```

### 0A.4 Exit criteria

Phase 0A exits only if:

- Every top-level repo ownership area has a matrix row.
- Every `apps/*` violation is classified.
- Every `shared/common/components/widgets/blocks/parts` folder is classified.
- Every detected deep/private import is listed with owner and consumer.
- Every suspected dead/orphan file is marked as candidate only, not deleted.
- Contract/API/backend trees are classified as `VERIFIED`, `UNPROVEN`, `BLOCKED`, or `[TBD]`.
- Every gap has evidence or `[TBD]` with a follow-up check.
- No APPLY was performed.

---

## Phase 0B — DSH End-to-End Forensics

**Goal:** Map DSH from business logic to files, screens, states, contracts, binding, and cross-surface obligations.
**Mode:** CHECK / VERIFY / FORENSICS only. No APPLY.

### 0B.1 Required DSH checks

```text
DSH service contract scan
DSH surface matrix
DSH flow matrix
DSH gap map
DSH ownership matrix
DSH screen model report
DSH app-client flow scan
DSH app-partner flow scan
DSH app-captain flow scan
DSH app-field flow scan
DSH control-panel flow scan
DSH WLT/payment relation scan
DSH webapp/website relation scan [TBD unless evidence exists]
DSH UI/UX/RTL/state scan
DSH content leakage scan
DSH runtime leakage scan
DSH contract/API scan
DSH binding scan
DSH backend/service scan
DSH integration/event scan
DSH orphan/noise scan
```

### 0B.2 Required output files

```text
dsh-service-contract.md
dsh-surface-matrix.md
dsh-flow-matrix.md
dsh-gap-map.md
dsh-screen-model-report.md
dsh-ownership-matrix.md
dsh-ui-ux-rtl-state-report.md
dsh-control-panel-report.md
dsh-wlt-relation-report.md
dsh-content-leakage-report.md
dsh-runtime-leakage-report.md
dsh-contract-api-report.md
dsh-binding-report.md
dsh-backend-service-report.md
dsh-integration-event-report.md
dsh-orphan-noise-report.md
dsh-closure-plan.md
```

### 0B.3 Exit criteria

Phase 0B exits only if:

- DSH is mapped across app-client, app-partner, app-captain, app-field, and control-panel.
- webapp/website are either proven related or marked `[TBD] / NO VERIFIED DSH SURFACE`.
- Every flow has Expected, Current, Gap, Decision.
- Every gap has priority P0/P1/P2.
- Every proposed closure type is classified.
- Contract/API/binding/backend gaps are explicitly classified, not silently ignored.
- No new screen is proposed without deciding if it should be Screen, Route, Sheet, Part, UI Kit, App Shell, Surface-Owned, Service-Owned, Binding Adapter, or API/Backend owner.
- No APPLY was performed.

---

## Phase 1 — Platform Boundary Contract Lock

**Goal:** Convert forensic findings into strict boundary rules before code movement.
**Mode:** L1/L2 depending on whether writing governance/contracts is allowed. If writing, APPLY must be isolated and evidence-backed.

### 1.1 Tasks

1. Lock `apps/* = shell/host only`.
2. Lock `app-shells = shell/root behavior only`.
3. Lock `surfaces = screens/flows/experiences`.
4. Lock `ui-kit = reusable design authority`.
5. Lock `contracts/api-types/api-clients/services` ownership.
6. Lock `service-owned` and `surface-owned` semantics.
7. Lock public exports and forbid private/deep imports.
8. Lock shared folder rules.
9. Lock screen file model rules.
10. Lock DSH first-vertical-slice closure model.
11. Lock API/binding/integration phases as forbidden until UI/Flow and contract gates prove readiness.

### 1.2 Required outputs

```text
platform-boundary-contract.md
app-shell-purity-contract.md
surface-screen-model-contract.md
shared-folder-governance-contract.md
public-export-contract.md
contract-api-boundary-contract.md
binding-layer-contract.md
runtime-provider-contract.md
```

### 1.3 Verification

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### 1.4 Exit criteria

- Boundary contracts exist in canonical governance or agreed evidence path.
- Every contract references an evidence path from Phase 0A/0B.
- No implementation files are changed unless explicitly allowed.
- No private import policy is ambiguous.
- API/binding/runtime ownership is explicit enough to prevent direct screen-to-backend drift.

---

## Phase 2 — DSH Logic / Flow Closure Plan

**Goal:** Decide exactly what DSH must contain from start to finish.
**Mode:** Planning + minimal contract writing only.

### 2.1 Flow closure matrix

For each flow domain, define:

- Actor.
- Surface.
- Trigger.
- Entry screen.
- Required states.
- Required counterpart surface.
- Required control-panel oversight.
- Required WLT/payment relation.
- Required contract/API operation if applicable.
- Required binding adapter if applicable.
- Exit condition.
- Verification commands.

### 2.2 Mandatory flows

```text
Client discovery
Client store selection
Client product selection
Cart
Checkout
Payment decision
Order created
Partner intake
Partner accept/reject
Partner preparation
Partner ready / handoff
Captain assignment
Captain pickup
Delivery in progress
Customer tracking
Order details
Order chat
Order issue / support
Rating
Refund / settlement relation
Control-panel monitoring
Control-panel intervention
```

### 2.3 Exit criteria

- Every DSH flow has one owner path.
- Every DSH flow has a surface role.
- Every DSH flow has a known closure type.
- Every missing item is P0/P1/P2.
- Every P0 has an implementation target path.
- Every flow that requires live behavior has a future API/binding owner or `[TBD]` blocker.

---

## Phase 3 — DSH Gap Closure Implementation

**Goal:** Implement missing DSH logic surface-by-surface, without breaking boundaries.
**Mode:** L2/L3 FAAV.

### 3.1 Execution order

```text
1. app-client DSH
2. app-partner DSH
3. app-captain DSH
4. app-field DSH
5. control-panel DSH
6. WLT/payment relation
7. webapp/website only if proven related
```

### 3.2 Rules

- One surface per wave.
- One flow per micro-task.
- No repo-wide rewrite.
- No broad delete.
- No new shared folder unless governance proves it.
- No local design components.
- No new screen before screen model classification.
- Any new reusable component goes to UI Kit only if at least two consumers or platform-level reuse is proven.
- No live API wiring unless the phase explicitly enters binding/integration.

### 3.3 Micro-task template

```text
TASK_ID:
SURFACE:
FLOW:
GAP_ID:
CURRENT EVIDENCE:
EXPECTED:
OWNER PATH:
CLOSURE TYPE:
FILES TO TOUCH:
RISK:
APPLY BUDGET:
VERIFY COMMANDS:
ROLLBACK PATH:
```

### 3.4 Apply budget

Recommended:

```text
5–10 lines: ideal micro-change
11–25 lines: allowed if isolated
26+ lines: split unless a full file replacement is explicitly reviewed and justified
```

### 3.5 Exit criteria

- Every implemented gap has before/after evidence.
- Every implemented gap has route/export/import verification.
- Every implemented gap has TypeScript verification.
- Every implemented DSH screen has loading/empty/error/success/offline/disabled strategy.
- Every implemented screen respects RTL and UI Kit contracts.

---

## Phase 4 — DSH UX / UI / RTL / State Closure

**Goal:** Make DSH visually, directionally, and interaction-wise complete.

### 4.1 UX laws

- One primary CTA per screen.
- Core task in 1 click when possible, max 2 clicks for primary flows.
- Smart defaults.
- Progressive disclosure.
- No dead controls.
- No confusing labels.
- No unclear Arabic/LTR mixing.
- No unexplained disabled payment/wallet state.
- No hidden required step without visible state/feedback.

### 4.2 RTL laws

- Arabic text is right-aligned in rows and forms.
- Icon + text cluster stays on the right for RTL rows.
- Chevron/action lives on the opposite side.
- No accidental `space-between` separation between icon and label.
- Directional icons use a central direction API.
- No physical-side layout when logical start/end is needed.
- Control-panel sidebar position is language-aware.

### 4.3 State laws

Every DSH screen must cover:

```text
loading
empty
error
success
offline
disabled
pending
retry
blocked
```

### 4.4 Visual laws

- Brand palette from tokens only.
- No random blues/oranges/greys.
- Header/topbar/ticker from central owner.
- Cards/forms/lists/buttons/states from UI Kit or approved surface parts.
- No local design system.

### 4.5 Required reports

```text
dsh-ux-click-count-report.md
dsh-rtl-proof-report.md
dsh-state-coverage-report.md
dsh-visual-drift-report.md
dsh-ui-kit-consumption-report.md
```

### 4.6 Exit criteria

- Every P0/P1 UX issue is closed or blocked with reason.
- Every core flow has click-count target documented.
- Every screen state is covered.
- Every RTL row pattern passes inspection.
- No random color usage remains in DSH closure scope.

---

## Phase 5 — Technical Cleanup + Package Boundary Repair

**Goal:** Remove noise only after ownership and flow truth are proven.

### 5.1 Cleanup order

```text
1. Confirm consumers/references.
2. Confirm route/export usage.
3. Confirm no runtime dependency.
4. Move misplaced files when target owner is proven.
5. Replace imports through public exports.
6. Reclassify fragmented screens into parts.
7. Split bloated screens into parts only where needed.
8. Delete dead/orphan files only after zero-consumer proof and rollback path.
9. Verify.
```

### 5.2 Never do

```text
- blind global delete
- blind global replace
- delete based on filename only
- move a file without import/export consumer proof
- remove old aliases and introduce new API break in same task
- mix DSH logic closure with global UI Kit refactor
- mix UI/UX closure with contract/API/binding work unless phase explicitly allows it
```

### 5.3 Required reports

```text
cleanup-candidates.md
move-manifest.md
delete-manifest.md
public-export-repair-report.md
deep-import-repair-report.md
post-cleanup-verify-report.md
```

### 5.4 Exit criteria

- Every deleted file has zero-consumer proof.
- Every moved file has updated import/export proof.
- Every public export repair has tsc proof.
- No unintended files changed.
- Rollback path exists for each high-risk change.

---

## Phase 6 — DSH UI/Flow Final Evidence Gate

**Goal:** Decide whether the UI/Flow/Boundary part of DSH is closed or still blocked.
**Important:** This is not full production closure. Full closure continues through API, binding, integration, runtime, backend, security, testing, and production gates.

### 6.1 Required commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:i18n-direction
pnpm run guard:i18n-direction:mobile-control-panel
```

If available and safe:

```powershell
pnpm nx run-many --target=build --projects=control-panel,webapp,website,app-client,app-partner,app-captain,app-field --parallel=7
```

### 6.2 Required final reports

```text
dsh-ui-flow-closure-summary.md
dsh-final-flow-coverage.md
dsh-final-state-coverage.md
dsh-final-rtl-proof.md
dsh-final-boundary-proof.md
dsh-final-ui-kit-proof.md
dsh-final-orphan-proof.md
dsh-final-risk-register.md
```

### 6.3 UI/FLOW CLOSED definition

DSH UI/Flow can only be marked `CLOSED` if:

- All P0 UI/Flow gaps closed.
- All P1 UI/Flow gaps closed or explicitly accepted with evidence and owner approval.
- All surfaces have verified DSH role or `[TBD]/not applicable` proof.
- No app owns DSH screens.
- No app-shell owns DSH screen bodies or service content.
- No DSH reusable UI duplicates UI Kit.
- No unapproved deep/private imports.
- No core flow lacks states.
- No RTL blocker remains.
- TypeScript passes.
- Evidence pack exists.

If any condition fails, status must be:

```text
BLOCKED
```

not `CLOSED`.

---

# 7. Runtime/API/Integration Extension Phases

These phases make the roadmap truly full end-to-end. They must not be executed before Phase 0A/0B and Phase 1 prove ownership and boundaries. They may start after UI/Flow closure reaches a stable enough state and contract ownership is proven.

---

## Phase 7 — Contract / OpenAPI / Domain Contract Forensics

**Goal:** Determine whether the service contract truth exists, where it lives, whether it is consistent, and whether DSH has complete operation coverage.

**Mode:** CHECK / VERIFY / FORENSICS first. APPLY only after contract authority is proven.

### 7.1 Scope

```text
contracts
governance
packages/api-types
packages/api-clients
services
packages/surfaces/src/service-owned/dsh
tools/scripts
```

### 7.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
Get-ChildItem -Recurse -Force -File contracts,packages,services,tools -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match 'openapi|swagger|contract|api|client|types|schema|dto' } |
  Select-Object FullName
```

### 7.3 FORENSICS

Produce:

```text
contract-authority-report.md
openapi-inventory-report.md
dsh-operation-coverage-report.md
operation-id-stability-report.md
contract-drift-report.md
api-schema-gap-map.md
```

### 7.4 Contract laws

- One master contract authority only.
- No duplicate OpenAPI truth.
- `operationId` must be stable, unique, and service-prefixed.
- Every DSH P0 flow that requires backend behavior must map to a contract operation or explicit `[TBD]`.
- No screen or app invents API shape locally.
- DTO/schema changes require generated type/client verification.

### 7.5 APPLY

Allowed only after contract authority is proven:

```text
- Add missing contract operation.
- Rename unstable operationId only with migration proof.
- Remove duplicate contract source only after consumer proof.
- Mark unsupported flow as BLOCKED rather than inventing contract.
```

### 7.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

If a contract generation command exists, run it and capture output; otherwise mark:

```text
CONTRACT_GENERATION_COMMAND: [TBD]
```

### 7.7 Exit criteria

- Contract authority proven.
- DSH P0 operation coverage matrix complete.
- Missing contract operations classified P0/P1/P2.
- No duplicate contract truth remains unclassified.
- All contract changes have generated type/client follow-up or BLOCKED reason.

---

## Phase 8 — API Types + API Clients Closure

**Goal:** Ensure API types and clients are generated or contract-derived only, stable, consumed through public paths, and not hand-written in UI layers.

### 8.1 Scope

```text
packages/api-types
packages/api-clients
contracts
services
packages/surfaces
apps
```

### 8.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File packages\api-types,packages\api-clients -ErrorAction SilentlyContinue |
  Select-Object FullName
```

### 8.3 FORENSICS

Produce:

```text
api-types-authority-report.md
api-clients-authority-report.md
generated-only-compliance-report.md
manual-client-drift-report.md
api-public-export-report.md
api-consumer-map.md
```

### 8.4 Laws

- Generated-only where generation exists.
- No hand-written client duplicates generated client.
- No UI screen imports generated client directly unless the binding contract explicitly allows it.
- API clients expose stable public entrypoints.
- Types and clients must match contract version.
- No `any` as API escape hatch unless documented as temporary BLOCKED debt.

### 8.5 APPLY

Allowed examples:

```text
- Regenerate API types/clients from proven contract.
- Repair public exports.
- Replace manual client imports with generated public client.
- Move direct screen API consumption into binding adapter.
```

### 8.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

If generation scripts exist:

```powershell
pnpm run <api-generation-script>
```

If not:

```text
API_GENERATION_SCRIPT: [TBD]
```

### 8.7 Exit criteria

- Every API type/client owner is classified.
- Every DSH API consumer path is mapped.
- Manual clients are eliminated or BLOCKED.
- Direct UI-to-client violations are moved to binding plan or BLOCKED.
- TypeScript passes.

---

## Phase 9 — Binding Layer Closure

**Goal:** Connect UI/flows to data sources through a controlled binding layer without leaking runtime/API/backend concerns into screens.

### 9.1 Binding contract

The correct binding direction:

```text
Screen / Surface
→ View Model / Binding Adapter
→ API Client / Fixture Provider / Runtime Provider
→ Backend / Service
```

Forbidden:

```text
Screen → fetch/backend URL
Screen → env variable parsing
Screen → direct generated client unless proven and isolated
Screen → hardcoded LAN/IP
Screen → secret/token ownership
```

### 9.2 Binding modes

Use these modes as a temporary development layer only:

```text
design
partial
binding
```

Definitions:

```text
design
= Fully local deterministic presentation data. No live IO.

partial
= Controlled hybrid. Some proven data may bind, but critical live operations remain guarded.

binding
= Live contract/API path active, verified, and reversible.
```

Rules:

- Modes are controlled centrally.
- No per-screen secret mode logic.
- No permanent dependency on design/partial gates after production closure.
- Mode resolver must be removable after final binding closure.
- Mode must be visible in evidence.

### 9.3 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "fetch\(|axios|localhost|192\.168|EXPO_PUBLIC|process\.env|USE_FIXTURES|design|partial|binding" -ErrorAction SilentlyContinue
```

### 9.4 FORENSICS

Produce:

```text
binding-owner-map.md
binding-mode-report.md
direct-api-consumption-report.md
fixture-provider-report.md
runtime-provider-report.md
dsh-binding-gap-map.md
```

### 9.5 APPLY

Allowed examples:

```text
- Create or repair binding adapter for a single DSH flow.
- Move direct API consumption out of screen.
- Centralize design/partial/binding resolver.
- Replace hardcoded fixture/runtime switches with central provider.
```

### 9.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### 9.7 Exit criteria

- Every DSH P0 flow has mode status: design / partial / binding / BLOCKED.
- No screen owns runtime/API/env logic.
- Binding mode source is centralized.
- Fixture data ownership is classified.
- Live binding is never enabled without contract/API verification.

---

## Phase 10 — Integration Closure

**Goal:** Verify all cross-surface and cross-service relations for DSH.

### 10.1 DSH integration domains

```text
DSH ↔ WLT payment / balance / settlement / refund
DSH ↔ app-client order creation / tracking / rating
DSH ↔ app-partner intake / prepare / ready / issue handling
DSH ↔ app-captain pickup / delivery / issue / completion
DSH ↔ app-field support / verification if proven
DSH ↔ control-panel monitoring / intervention / catalogs / marketing / finance relation
DSH ↔ notifications / chat / support if proven
DSH ↔ webapp / website only if repo evidence proves relation
```

### 10.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "dsh|wlt|order|payment|wallet|settlement|refund|notification|chat|support|captain|partner" -ErrorAction SilentlyContinue
```

### 10.3 FORENSICS

Produce:

```text
dsh-integration-matrix.md
dsh-wlt-integration-report.md
dsh-order-lifecycle-integration-report.md
dsh-notification-chat-support-report.md
dsh-control-panel-integration-report.md
cross-surface-event-map.md
integration-gap-map.md
```

### 10.4 APPLY

Allowed examples:

```text
- Add missing link between proven existing screens/flows.
- Add integration adapter for a single flow.
- Add event/command mapping if contract/backend owner is proven.
- Mark cross-service gap as BLOCKED if target owner not proven.
```

### 10.5 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### 10.6 Exit criteria

- Every DSH lifecycle transition has a source, target, and owner.
- Every DSH↔WLT interaction has state, failure, retry, and audit strategy.
- Every control-panel intervention has permissions and audit classification.
- No cross-service dependency is implicit or hidden.
- All unresolved integration items are BLOCKED with owner path.

---

## Phase 11 — Runtime / Local Production-like Readiness

**Goal:** Create a local runtime model that simulates production as much as safely possible, without changing code paths later during deployment.

### 11.1 Runtime laws

- Provider switching is centralized.
- Environment selection is centralized.
- No screen owns runtime provider decisions.
- No hardcoded LAN/IP in production path.
- Local media/data servers are development-only and documented.
- Moving to production should be provider/config switch, not code rewrite.
- Runtime mode must be reproducible from root commands.

### 11.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File . |
  Where-Object { $_.Name -match '\.env|docker|compose|runtime|provider|config|server|mock|fixture' } |
  Select-Object FullName
```

### 11.3 FORENSICS

Produce:

```text
runtime-provider-map.md
environment-variable-report.md
local-production-simulation-plan.md
fixture-media-runtime-report.md
runtime-start-stop-report.md
runtime-risk-register.md
```

### 11.4 APPLY

Allowed examples:

```text
- Add root runtime command only after existing commands are proven.
- Centralize environment provider.
- Document local media/mock provider.
- Add safe stop→verify→start scripts.
```

### 11.5 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm -w exec tsc --noEmit
pnpm nx run-many --target=build --projects=control-panel,webapp,website,app-client,app-partner,app-captain,app-field --parallel=7
```

If full build is too heavy or blocked:

```text
BUILD_GATE: BLOCKED with reason and partial verification evidence
```

### 11.6 Exit criteria

- Local runtime map exists.
- All startup commands are verified or marked BLOCKED.
- No production path depends on temporary fixture server.
- No runtime config is hidden in screens.
- Provider switching path is documented and testable.

---

## Phase 12 — Backend / Service Readiness

**Goal:** Verify and close service/backend readiness for DSH and related services.

### 12.1 Backend domains

```text
DSH service module
WLT relation service
Order service
Catalog service
Partner/store service
Captain assignment/delivery service
Support/issue service
Notification/chat service if proven
Control-panel/admin service
```

### 12.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File services -ErrorAction SilentlyContinue |
  Select-Object FullName
```

### 12.3 FORENSICS

Produce:

```text
backend-service-map.md
dsh-backend-readiness-report.md
service-module-boundary-report.md
controller-handler-report.md
business-invariant-report.md
backend-gap-map.md
```

### 12.4 Backend laws

- Services own domain/business rules, not screens.
- Controllers/handlers must validate inputs and outputs.
- Idempotency required for order/payment mutations.
- Backend operations must map to contract operations.
- No side-money: WLT is the only financial authority if proven by project rule.
- Control-panel finance operations require strict audit/authorization.
- Errors must be structured and consumable by UI state layer.

### 12.5 APPLY

Allowed examples:

```text
- Add missing service handler only after contract exists.
- Add validation for a proven API operation.
- Add backend invariant guard.
- Add structured error mapping.
```

### 12.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm -w exec tsc --noEmit
```

If backend-specific tests exist:

```powershell
pnpm nx run-many --target=test --projects=<backend-projects> --parallel=3
```

### 12.7 Exit criteria

- Every DSH backend-owned operation has owner path.
- Every P0 mutation has validation, authorization, idempotency, and audit plan.
- Every backend gap is P0/P1/P2.
- No frontend-only workaround replaces missing backend truth.

---

## Phase 13 — Data Model / Persistence / Migration Closure

**Goal:** Ensure DSH data has a coherent model across local/dev/prod paths.

### 13.1 Data domains

```text
store
branch
product
category
cart
order
order item
payment intent
wallet ledger relation
captain task
delivery status
issue/support case
rating
notification/chat if proven
audit event
```

### 13.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File . |
  Where-Object { $_.Name -match 'schema|model|entity|migration|seed|fixture|prisma|drizzle|typeorm|sql|mongo|db' } |
  Select-Object FullName
```

### 13.3 FORENSICS

Produce:

```text
dsh-data-model-report.md
persistence-owner-report.md
migration-readiness-report.md
fixture-vs-real-data-report.md
data-gap-map.md
```

### 13.4 Laws

- Fixtures are not production data.
- Seed data must be classified and removable.
- Persistent models must map to contract/API shapes or service DTOs.
- Order/payment/ledger data must be audit-safe.
- Migration path must be reversible or backed up.
- No UI file owns canonical data model.

### 13.5 APPLY

Allowed examples:

```text
- Add missing data model only after backend/contract decision.
- Add migration only after schema owner is proven.
- Move fixture data out of screen into fixture owner.
```

### 13.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### 13.7 Exit criteria

- DSH data domains are mapped.
- Fixtures vs real data are separated.
- Data persistence gaps are classified.
- Migration risk register exists.
- No production data path is hidden in UI/shell.

---

## Phase 14 — Security / RBAC / Privacy / Audit Closure

**Goal:** Protect DSH operations, control-panel actions, financial flows, and user data.

### 14.1 Security domains

```text
authentication
authorization
RBAC/ABAC
actor capability
control-panel permissions
partner/captain/field access
WLT/payment authorization
HMAC/webhook if applicable
privacy masking
secrets handling
audit trail
rate limiting / abuse controls
```

### 14.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx,.\**\*.json -Pattern "auth|role|permission|rbac|abac|hmac|secret|token|audit|privacy|mask|webhook|rate" -ErrorAction SilentlyContinue
```

### 14.3 FORENSICS

Produce:

```text
security-surface-map.md
rbac-abac-report.md
dsh-action-permission-matrix.md
privacy-masking-report.md
secrets-leakage-report.md
audit-trail-report.md
security-gap-map.md
```

### 14.4 Laws

- Control-panel mutations require explicit permission.
- Partner/captain/field capabilities must be separated.
- Payment/WLT actions require stronger authorization.
- Sensitive data must be masked in UI/logs where required.
- No secret in repo code.
- Audit trail required for financial/admin/order status mutations.
- Webhook/HMAC rules must be classified if external callbacks exist.

### 14.5 APPLY

Allowed examples:

```text
- Add permission guard.
- Add audit metadata.
- Remove leaked secret-like string if verified.
- Add privacy masking helper from central owner.
```

### 14.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### 14.7 Exit criteria

- Every DSH mutation has authorization classification.
- Every control-panel DSH action has role/capability owner.
- WLT/payment interaction has security gate.
- No secrets remain unclassified.
- Privacy masking gaps are P0/P1/P2.

---

## Phase 15 — Observability / Monitoring / Incident Readiness

**Goal:** Ensure DSH can be diagnosed in production-like runtime.

### 15.1 Observability domains

```text
structured logs
trace/correlation id
metrics
health checks
error boundaries
user-visible error mapping
backend error mapping
critical event audit
control-panel monitoring
incident runbook
```

### 15.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "log|logger|trace|metric|health|monitor|error|boundary|audit|incident" -ErrorAction SilentlyContinue
```

### 15.3 FORENSICS

Produce:

```text
observability-map.md
dsh-critical-event-map.md
error-boundary-report.md
health-check-report.md
incident-readiness-report.md
observability-gap-map.md
```

### 15.4 Laws

- Every P0 flow has error visibility.
- Every backend mutation has trace/audit strategy.
- Every runtime provider has startup/health strategy.
- Every user-facing error maps to UI state.
- Control-panel must expose operational risk signals for DSH.

### 15.5 APPLY

Allowed examples:

```text
- Add missing error boundary usage.
- Add structured event point.
- Add health check only after backend owner is proven.
- Add incident runbook file if governance path is proven.
```

### 15.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### 15.7 Exit criteria

- DSH P0 events observable.
- Error states mapped from backend/binding to UI.
- Incident checklist exists for order/payment/delivery failures.
- No silent failure path in core DSH lifecycle.

---

## Phase 16 — Test Pyramid + E2E Closure

**Goal:** Prove DSH behavior through the right levels of tests.

### 16.1 Test layers

```text
static checks
type checks
unit tests
contract tests
binding adapter tests
integration tests
E2E tests
visual/RTL checks
accessibility checks
performance smoke checks
```

### 16.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File . |
  Where-Object { $_.Name -match 'test|spec|e2e|playwright|jest|vitest|detox|maestro|storybook|accessibility|a11y' } |
  Select-Object FullName
```

### 16.3 FORENSICS

Produce:

```text
test-inventory-report.md
dsh-test-coverage-map.md
contract-test-report.md
integration-test-report.md
e2e-readiness-report.md
visual-rtl-test-report.md
test-gap-map.md
```

### 16.4 Minimum DSH test coverage

```text
Client checkout happy path
Client checkout failure path
Payment disabled/insufficient/unavailable state
Partner accepts/rejects order
Partner marks order ready
Captain pickup/delivery transition
Control-panel order monitoring/intervention
WLT/payment relation behavior
RTL layout smoke
Offline/error/empty states
```

### 16.5 APPLY

Allowed examples:

```text
- Add one unit test for one binding adapter.
- Add one contract test for one operation.
- Add one E2E smoke for one P0 lifecycle path.
- Add visual RTL smoke only after target runner is proven.
```

### 16.6 VERIFY

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm -w exec tsc --noEmit
```

If test scripts exist:

```powershell
pnpm nx run-many --target=test --all --parallel=3
```

If not:

```text
TEST_RUNNER: [TBD]
```

### 16.7 Exit criteria

- Test runners discovered or `[TBD]`.
- Every P0 DSH flow has at least one planned or implemented test gate.
- No production closure without E2E smoke strategy.
- Broken or absent tests are not ignored; they are BLOCKED.

---

## Phase 17 — Performance / Accessibility / Quality Gate

**Goal:** Ensure DSH and core surfaces are fast, accessible, and maintainable.

### 17.1 Domains

```text
bundle size
render performance
mobile memory pressure
large list performance
image/media loading
accessibility labels
keyboard/focus navigation for web/control-panel
touch target size
RTL accessibility
form errors
loading skeletons
```

### 17.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "accessibilityLabel|aria-|FlatList|ScrollView|Image|memo|useMemo|useCallback|lazy|Suspense" -ErrorAction SilentlyContinue
```

### 17.3 FORENSICS

Produce:

```text
performance-risk-report.md
accessibility-report.md
mobile-list-performance-report.md
media-loading-report.md
quality-gate-report.md
```

### 17.4 Exit criteria

- No obvious P0 performance trap in DSH core flows.
- Critical interactive elements have accessibility labels.
- Control-panel primary navigation is keyboard/focus-safe or BLOCKED.
- Large lists are classified for virtualization/pagination.
- Media-heavy surfaces have loading/error fallback.

---

## Phase 18 — Production Readiness + Release / Cutover Gate

**Goal:** Decide if the platform is ready for production-like release or still blocked.

### 18.1 Production readiness domains

```text
branch reality
clean working tree
typecheck
build
contracts
api generation
binding modes
runtime providers
backend health
data/persistence
security
observability
tests
deployment config
rollback
release notes
operator runbook
```

### 18.2 CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm nx run-many --target=build --projects=control-panel,webapp,website,app-client,app-partner,app-captain,app-field --parallel=7
```

### 18.3 FORENSICS

Produce:

```text
production-readiness-report.md
release-risk-register.md
rollback-plan.md
deployment-config-report.md
operator-runbook.md
final-go-no-go-report.md
```

### 18.4 GO criteria

Production-like `GO` is allowed only if:

- Branch reality is proven.
- Working tree status is understood.
- TypeScript passes.
- Builds pass or every build blocker has evidence and owner.
- Contract/API/client generation is verified or not required.
- DSH binding paths are closed or intentionally design/partial with release warning.
- Runtime provider selection is centralized.
- Backend/service readiness is verified or explicitly out of release scope.
- Security/RBAC/audit gates pass for all enabled flows.
- Observability and incident runbook exist for P0 flows.
- Test strategy passes minimum P0 coverage.
- Rollback plan exists.

If any GO criterion fails:

```text
RELEASE_STATUS: BLOCKED
```

---

## Phase 19 — Generalize DSH Model to Remaining Services

After DSH is closed, copy the closure method, not the files.

### 19.1 Recommended service order

```text
1. WLT — because it intersects payment, wallet, settlement, refunds.
2. ARB / AMN — because they involve operational multi-surface flows.
3. KNZ — lighter surface set.
4. ESF / MRF / SND / KWD — community-services bundle.
```

### 19.2 Generalization requirements

For each service:

```text
SERVICE_CONTRACT
SURFACE_MATRIX
FLOW_MATRIX
GAP_MAP
SCREEN_MODEL_REPORT
OWNERSHIP_MATRIX
UI/UX/RTL/STATE_REPORT
CONTRACT_API_REPORT
BINDING_REPORT
INTEGRATION_REPORT
RUNTIME_REPORT
BACKEND_SERVICE_REPORT
SECURITY_REPORT
OBSERVABILITY_REPORT
TEST_REPORT
CLOSURE_PLAN
FINAL_EVIDENCE_GATE
```

### 19.3 Exit criteria

- Every service has explicit surfaces.
- Every service has no hidden screens in apps.
- Every service has no local design system.
- Every service has contract/API/binding status.
- Every service has evidence-based closure status.

---

# 7. Forensic Script Pack Proposal

Use PowerShell as the orchestration shell. Supporting Node/TypeScript scripts can exist if already aligned with repo tooling, but PowerShell remains the command policy.

## 7.1 CHECK scripts

```text
CHECK_PLATFORM_TREE.ps1
CHECK_APP_SHELL_PURITY.ps1
CHECK_PACKAGE_BOUNDARIES.ps1
CHECK_SHARED_FOLDERS.ps1
CHECK_SCREEN_FILE_MODEL.ps1
CHECK_UI_KIT_AUTHORITY.ps1
CHECK_CONTRACT_API_TREE.ps1
CHECK_API_TYPES_CLIENTS.ps1
CHECK_BINDING_LAYER.ps1
CHECK_RUNTIME_PROVIDERS.ps1
CHECK_BACKEND_SERVICES.ps1
CHECK_SECURITY_GUARDS.ps1
CHECK_OBSERVABILITY.ps1
CHECK_TEST_INVENTORY.ps1
CHECK_DSH_SURFACE_MATRIX.ps1
CHECK_DSH_FLOW_MATRIX.ps1
CHECK_DSH_GAP_MAP.ps1
CHECK_DSH_RTL_STATE_COVERAGE.ps1
CHECK_DSH_ORPHANS_NOISE.ps1
```

## 7.2 FORENSICS scripts

```text
FORENSICS_PLATFORM_OWNERSHIP.ps1
FORENSICS_PUBLIC_EXPORT_LEAKAGE.ps1
FORENSICS_DEEP_IMPORTS.ps1
FORENSICS_CONTRACT_DRIFT.ps1
FORENSICS_API_CLIENT_DRIFT.ps1
FORENSICS_BINDING_MODES.ps1
FORENSICS_INTEGRATION_MATRIX.ps1
FORENSICS_RUNTIME_READINESS.ps1
FORENSICS_BACKEND_READINESS.ps1
FORENSICS_SECURITY_AUDIT.ps1
FORENSICS_OBSERVABILITY_MAP.ps1
FORENSICS_TEST_COVERAGE.ps1
FORENSICS_DSH_CROSS_SURFACE_FLOW.ps1
FORENSICS_DSH_CONTENT_LEAKAGE.ps1
FORENSICS_CONTROL_PANEL_DSH_PATHS.ps1
FORENSICS_WLT_DSH_PAYMENT_RELATION.ps1
```

## 7.3 APPLY scripts

Only after evidence:

```text
APPLY_MOVE_MISPLACED_SCREEN.ps1
APPLY_RECLASSIFY_SCREEN_PART.ps1
APPLY_REPAIR_PUBLIC_EXPORT.ps1
APPLY_REPAIR_DEEP_IMPORTS.ps1
APPLY_REMOVE_DEAD_ORPHAN.ps1
APPLY_CONTRACT_OPERATION.ps1
APPLY_GENERATE_API_CLIENTS.ps1
APPLY_BINDING_ADAPTER.ps1
APPLY_RUNTIME_PROVIDER_REPAIR.ps1
APPLY_BACKEND_HANDLER.ps1
APPLY_SECURITY_GUARD.ps1
APPLY_OBSERVABILITY_SIGNAL.ps1
APPLY_TEST_COVERAGE.ps1
APPLY_DSH_GAP_CLOSURE_<SURFACE>_<FLOW>.ps1
```

## 7.4 VERIFY scripts

```text
VERIFY_PLATFORM_BOUNDARIES.ps1
VERIFY_CONTRACT_API_CLOSURE.ps1
VERIFY_API_TYPES_CLIENTS.ps1
VERIFY_BINDING_LAYER.ps1
VERIFY_INTEGRATION_CLOSURE.ps1
VERIFY_RUNTIME_READINESS.ps1
VERIFY_BACKEND_READINESS.ps1
VERIFY_SECURITY_CLOSURE.ps1
VERIFY_OBSERVABILITY.ps1
VERIFY_TEST_COVERAGE.ps1
VERIFY_PRODUCTION_READINESS.ps1
VERIFY_DSH_FLOW_COVERAGE.ps1
VERIFY_DSH_STATE_COVERAGE.ps1
VERIFY_DSH_UI_KIT_CONSUMPTION.ps1
VERIFY_DSH_RTL_LAYOUT.ps1
VERIFY_DSH_FINAL_GATE.ps1
```

## 7.5 Mandatory script header

Every PowerShell script must begin with:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
```

---

# 8. Master Checklist

## 8.1 Platform checklist

- [ ] Active branch proven.
- [ ] `main` vs current checkpoint reality documented.
- [ ] Apps shell-only verified.
- [ ] App-shells boundary verified.
- [ ] Surfaces ownership verified.
- [ ] UI Kit authority verified.
- [ ] Public exports audited.
- [ ] Deep imports audited.
- [ ] Shared folders classified.
- [ ] Screen file model audited.
- [ ] Orphan/dead/noise files listed.
- [ ] No deletion before consumer proof.
- [ ] Evidence pack created.

## 8.2 DSH UI/Flow checklist

- [ ] DSH service contract defined.
- [ ] DSH surface matrix built.
- [ ] DSH flow matrix built.
- [ ] DSH gap map built.
- [ ] DSH ownership matrix built.
- [ ] DSH screen model report built.
- [ ] app-client DSH gaps classified.
- [ ] app-partner DSH gaps classified.
- [ ] app-captain DSH gaps classified.
- [ ] app-field DSH role proven or `[TBD]`.
- [ ] control-panel DSH coverage classified.
- [ ] WLT/payment relation classified.
- [ ] webapp/website DSH relation proven or `[TBD]`.
- [ ] UI Kit violations listed.
- [ ] RTL violations listed.
- [ ] State gaps listed.
- [ ] Content leakage listed.
- [ ] Runtime leakage listed.
- [ ] Final closure blockers classified P0/P1/P2.

## 8.3 API / Binding / Integration checklist

- [ ] Contract authority proven.
- [ ] DSH operation coverage mapped.
- [ ] operationId uniqueness verified.
- [ ] API types owner verified.
- [ ] API clients owner verified.
- [ ] Generated-only policy verified.
- [ ] Binding owner path verified.
- [ ] Direct screen-to-API violations listed.
- [ ] design/partial/binding modes centralized.
- [ ] DSH↔WLT integration mapped.
- [ ] DSH order lifecycle integration mapped.
- [ ] Control-panel intervention integration mapped.
- [ ] Integration blockers classified P0/P1/P2.

## 8.4 Runtime / Backend / Data checklist

- [ ] Runtime provider map exists.
- [ ] Local production-like runtime plan exists.
- [ ] Backend services tree classified.
- [ ] DSH backend readiness mapped.
- [ ] Persistence/data model mapped.
- [ ] Fixtures vs real data separated.
- [ ] Migrations classified.
- [ ] Startup/build commands verified or BLOCKED.

## 8.5 Security / Observability / Testing / Production checklist

- [ ] RBAC/ABAC matrix exists.
- [ ] Payment/WLT authorization classified.
- [ ] Control-panel admin actions audited.
- [ ] Secrets leakage scan completed.
- [ ] Privacy masking report exists.
- [ ] Observability map exists.
- [ ] Incident runbook exists.
- [ ] Test inventory exists.
- [ ] P0 DSH E2E path planned or implemented.
- [ ] Production readiness report exists.
- [ ] Rollback plan exists.
- [ ] GO/BLOCKED decision is evidence-based.

## 8.6 Implementation checklist

- [ ] Each task has TASK_ID.
- [ ] Each task has owner path.
- [ ] Each task has DoD.
- [ ] Each task has risk classification.
- [ ] Each task has rollback path.
- [ ] Each APPLY is limited and evidence-backed.
- [ ] Each VERIFY is executed after APPLY.
- [ ] No task mixes unrelated domains.
- [ ] No final status without evidence.

---

# 9. Recommended Copilot Commands

## 9.1 First command — diagnostic only

Use this as the first execution command. It is intentionally diagnostic-only.

```text
نفّذ Phase 0A + Phase 0B فقط داخل C:\bthwani-suite:

0A) Platform Structure Forensics
0B) DSH End-to-End Forensics

الوضع:
CHECK / VERIFY / FORENSICS فقط.
ممنوع APPLY بالكامل.

الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

ممنوع:
- لا تحذف.
- لا تنقل.
- لا تعمل rename.
- لا تصلح imports.
- لا تضف شاشات.
- لا تضف مكونات.
- لا تغيّر UI.
- لا تدخل API/Backend/Integration/Runtime في التنفيذ؛ فقط صنّف فجواتها كجزء من التقرير.
- لا تستخدم npm.
- لا تستخدم Expo Go كمسار canonical.
- لا تعلن CLOSED أو 100%.

Architecture Contract:
apps/* = Shell/Host فقط.
packages/app-shells = shell/root behavior فقط.
packages/surfaces = screens/flows/experiences.
packages/ui-kit = reusable design authority.
contracts/packages/api-types/packages/api-clients/services = contract/API/runtime/backend ownership حسب الإثبات.
service-owned/<service>/<surface> = تجربة خدمة داخل سطح.
surface-owned/<surface> = تجربة عامة للسطح.
Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only.

النطاق:
- apps/mobile/app-client
- apps/mobile/app-partner
- apps/mobile/app-captain
- apps/mobile/app-field
- apps/web/control-panel
- apps/web/webapp
- apps/web/website
- packages/app-shells
- packages/surfaces
- packages/ui-kit
- packages/api-types
- packages/api-clients
- contracts
- services
- governance
- tools

Phase 0A:
افحص هيكل المنصة من الألف إلى الياء:
App Shell Purity / Package Boundary / Shared Folder Governance / Screen File Model / UI Kit Authority / App Shells Boundary / Surfaces Boundary / Contract/API tree / Backend services tree / Dead/Noise/Orphan.

Phase 0B:
حلل DSH من الألف إلى الياء عبر:
app-client + app-partner + app-captain + app-field + control-panel
وافحص webapp/website فقط إذا ظهر دليل ارتباط فعلي.

ابن Expected DSH Service Contract ثم قارن Expected ضد Current وأنشئ:
DSH Logic/Flow Matrix / DSH Gap Map / DSH Screen Model Report / DSH Ownership Matrix / DSH UI/UX/RTL/State Gap Report / DSH Contract/API Report / DSH Binding Report / DSH Backend Report / DSH Integration Report.

لكل Gap حدد:
Missing Screen / Missing Route / Missing Sheet / Missing State / Missing Link / Missing Contract / Missing API Type / Missing API Client / Missing Binding / Missing Backend / Missing Integration / Ownership Breach / UI Kit Breach / App Shell Breach / Duplicate/Noise / Orphan/Dead Candidate / [TBD].

لا تعتبر كل gap شاشة جديدة.
قبل أي اقتراح إضافة، قرر هل الإغلاق الصحيح:
Add Screen / Add Route / Add Sheet / Add Part / Move Existing / Expose Export / Promote to ui-kit / Promote to app-shells / Add Contract / Generate API Client / Add Binding Adapter / Add Backend Handler / Add Integration Event / Remove Duplicate لاحقًا / Mark [TBD].

Evidence Pack:
أنشئ تحت:
tools/registry/runs/{SESSION_ID}

أي سكربت PowerShell يجب أن يبدأ بـ:
Set-Location -LiteralPath "C:\bthwani-suite"

شغّل فقط فحوص آمنة:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit إذا كان آمنًا ومتاحًا.

استخدم statuses:
VERIFIED لما ثبت بالدليل.
UNPROVEN لما لم يثبت.
BLOCKED لأي خطر يمنع القرار.
[TBD] لأي شيء يحتاج فحص لاحق.

في النهاية أعطني ملخصًا قصيرًا:
DONE / BLOCKED لكل Gate مع مسارات الأدلة.
```

## 9.2 Later command — API / Binding / Integration phase

Use only after Phase 0A/0B and UI/Flow boundary gates produce evidence.

```text
نفّذ Phase 7 إلى Phase 10 فقط داخل C:\bthwani-suite:
Contract/API Forensics → API Types/Clients Closure → Binding Layer Closure → Integration Closure.

لا تبدأ APPLY قبل أن تثبت contract authority وowner paths.
لا تربط الشاشات مباشرة بالـ API.
لا تستخدم runtime/env/fetch داخل screens.
أي live binding يجب أن يمر عبر binding adapter مركزي وpublic API client.

المطلوب:
- contract-authority-report.md
- dsh-operation-coverage-report.md
- api-types-authority-report.md
- api-clients-authority-report.md
- binding-owner-map.md
- direct-api-consumption-report.md
- dsh-integration-matrix.md
- dsh-wlt-integration-report.md
- integration-gap-map.md

VERIFY:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

---

# 10. Final Rule

Do not aim for a visually pleasing DSH first. Aim for a provable DSH.
Do not aim for live binding before flow and contract truth. Aim for a safe end-to-end chain.

The correct full closure sequence is:

```text
Truth
→ Ownership
→ Flow
→ Gap
→ Model
→ Implement UI/Flow
→ UX/UI/RTL/State
→ Cleanup
→ Contract
→ API Types / API Clients
→ Binding
→ Integration
→ Runtime
→ Backend
→ Data
→ Security
→ Observability
→ Tests
→ Performance / Accessibility
→ Production Readiness
→ Evidence
```

Any shortcut that jumps directly to UI, deletion, API, live binding, or production risks recreating the same fragmentation under a new technical layer.
