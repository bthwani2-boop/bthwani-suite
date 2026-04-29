# Extracted Legacy Governance — PLATFORM_BLUEPRINT.md

Status: LEGACY_EXTRACTED_CANONICAL_REVIEW
Source: $Source
Source SHA256: $Hash
Extraction session: $SessionId

## Extraction Rule

This file preserves rich content from docs/governance/ before the legacy root is deleted later.

This is not final canonical policy by itself. Any rule inside this extracted file must be promoted explicitly into a canonical governance file before it becomes active truth.

---
# PLATFORM_BLUEPRINT.md

**Version:** 2.0 regenerated-final
**Date:** 2026-04-29
**Repository:** `bthwani2-boop/bthwani-suite`
**Canonical local target:** `C:\bthwani-suite`
**Execution mode:** READ-ONLY platform blueprint. This document does not modify the repository and does not claim the repository is already closed. It defines the evidence-based platform blueprint and the required target truth.

---

## 0. Executive Summary

BThwani is a multi-service, multi-surface platform. It should not be treated as scattered screens. It must be governed as a complete operating system across:

- Mobile apps: `app-client`, `app-partner`, `app-captain`, `app-field`.
- Web apps: `control-panel`, `webapp`, `website`.
- Canonical services: `dsh`, `wlt`, `knz`, `arb`, `amn`, `esf`, `mrf`, `snd`, `kwd`.
- Platform packages: `ui-kit`, `app-shells`, `surfaces`, `api-types`, `api-clients`.
- Runtime/backend/service layer: `services`, `contracts`, generated clients, binding adapters, providers.
- Governance/evidence: `governance`, `docs/governance`, `tools/registry/runs`.

The platform must be closed through evidence, not appearance. The correct high-level model is:

```text
apps/*                  = Shell / host only
packages/app-shells     = Root shell behavior only
packages/surfaces       = Screens, flows, service-owned and surface-owned experiences
packages/ui-kit         = Central reusable design authority
contracts/*             = API/domain contracts if present and proven
packages/api-types      = Contract-derived API types
packages/api-clients    = Contract-derived API clients
services/*              = Backend/domain implementation if present and proven
governance              = Canonical standards and policies
docs/governance         = Transitional until reconciled
tools/registry/runs     = Evidence packs only
```

The first closure target should be DSH because it crosses the customer, partner, captain, field/ops, control-panel, wallet/payment, and backend/API boundaries. DSH is the golden vertical slice for proving the whole platform.

---

## 1. Platform Vision

### 1.1 What BThwani is

BThwani is a unified service platform that connects customers, stores/partners, captains, field teams, operations, finance/wallet, marketing, support, and administrators through a consistent design system and governed service architecture.

### 1.2 Core value

BThwani should provide:

- One coherent customer experience.
- One partner/store operating model.
- One captain task/delivery model.
- One field support/inspection model where proven.
- One control-panel governance and operations model.
- One wallet/ledger financial authority.
- One UI kit and visual language.
- One evidence-first execution system.

### 1.3 Primary users and roles

| Role | Main surfaces | Required responsibility |
|---|---|---|
| Customer | app-client, webapp if proven | Discover, order, pay, track, rate, request support |
| Partner / Store | app-partner | Receive, accept/reject, prepare, handoff, manage catalog |
| Captain | app-captain | Accept task, pickup, deliver, confirm, report issue |
| Field / Ops | app-field | Field support, inspection, verification, issue resolution if proven |
| Admin / Operations | control-panel | Monitor, intervene, configure, govern |
| Marketing | control-panel | Campaigns, offers, visibility, approvals |
| Support | control-panel, app-field if proven | Issues, disputes, help center |
| Finance / Wallet | WLT + control-panel | Balance, payment, refund, settlement, ledger |
| Public visitor | website, webapp if proven | Public landing and discovery |

### 1.4 Governing principles

```text
Evidence before claims.
No CLOSED without evidence.
No local design system.
No screens inside apps.
No service screen bodies in app-shells.
No direct screen-to-backend coupling.
No deletion before zero-consumer proof.
Anything unproven = [TBD].
```

---

## 2. Repository Reality

### 2.1 Branch reality

The repository is private. The default branch `main` must not be assumed as implementation truth. Current checkpoint evidence indicates `ghb/0101-20260428-203657-checkpoint` has broader workspace scripts, dependency locks, and guards than `main`.

Mandatory branch reality commands:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager log --oneline -n 20
git branch --list
```

### 2.2 Workspace reality

The workspace pattern is:

```text
apps/*
apps/*/*
services/*
packages/*
```

This means apps, nested apps, services, and packages are all formal workspace areas.

### 2.3 Tooling reality

The platform should be treated as:

```text
pnpm
Nx
Expo Dev Client
Next.js
React
React Native
React Native Web
TypeScript
Tamagui
@bthwani/ui-kit
@bthwani/app-shells
@bthwani/surfaces
```

Root commands and `pnpm` are canonical. `npm` is not canonical.

### 2.4 Canonical / current / legacy / TBD

| Item | Status | Decision |
|---|---|---|
| `C:\bthwani-suite` | Canonical | Use this path only |
| `bthwani2-boop/bthwani-suite` | Canonical GitHub repo | Read-only unless explicit write task |
| `governance` | Canonical candidate | Make SSoT after audit |
| `docs/governance` | Transitional | Reconcile and deduplicate |
| `tools/registry/runs` | Canonical evidence root | Use for new evidence |
| `kdt/volatile/registry/runs` | Legacy/transitional if present | Do not use as new evidence root |
| `app-client` | Canonical | Do not use old `app-user` |
| `control-panel` | Canonical | Do not use old `mcpw` except as legacy evidence |
| `main` | Unproven as current implementation truth | Must pass Branch Reality Gate |
| `ghb/*checkpoint*` | Candidate current truth | Must be selected by evidence |

---

## 3. Apps / Surfaces Blueprint

### 3.1 Universal app rule

All apps are shell/host only.

Allowed in `apps/*`:

```text
Expo / Next entry
root bootstrap
route mounting
provider bridge
platform config
metadata
minimal runtime wiring
```

Forbidden in `apps/*`:

```text
real screens
service flows
business/domain logic
reusable UI components
headers/cards/buttons/lists/forms
local tokens/colors/spacing/radius/elevation
mock service content
DSH/WLT/ARB/etc domain logic
independent i18n/direction ownership
direct backend/API binding
deep/private package imports
```

### 3.2 app-client

**Role:** Customer-facing mobile app.

**Expected DSH responsibilities:**

- DSH entry.
- Store discovery.
- Storefront.
- Product browsing.
- Cart.
- Checkout.
- Payment/wallet decision.
- Order tracking.
- Order details.
- Order chat/support.
- Rating.

**Risks:**

- App-specific files exceeding shell rule.
- Customer flow not linked to partner/captain/control-panel counterparts.
- Payment state shown without WLT authority.

**Owner paths:**

```text
apps/mobile/app-client = shell only
packages/app-shells/mobile/client = root shell behavior
packages/surfaces/src/service-owned/dsh/app-client = DSH customer flow
packages/surfaces/src/surface-owned/app-client = app-client surface-wide flow
```

### 3.3 app-partner

**Role:** Store/partner operations app.

**Expected DSH responsibilities:**

- Store identity.
- Orders inbox.
- New/active orders.
- Order details.
- Accept/reject.
- Preparation.
- Ready/handoff.
- Inventory/catalog.
- Offers/marketing relation if proven.
- Wallet/settlement relation if proven.

**Risks:**

- Partner shell becoming a DSH business logic container.
- Store data and operational arrays living in app-shells.
- Mixed DSH/ARB context without strict service context.

### 3.4 app-captain

**Role:** Delivery/task execution app.

**Expected DSH responsibilities:**

- Availability state.
- GPS/runtime status.
- Available task.
- Accept/decline.
- Pickup from store.
- Deliver to customer.
- Confirm delivery.
- Report issue.
- Earnings relation if proven.

**Risk:** Availability/GPS should be inline operational toggles, not separate screen flows unless route evidence proves otherwise.

### 3.5 app-field

**Role:** Field support, inspection, verification, issue resolution.

**DSH status:** `[TBD]` unless repo evidence proves DSH field role.

Do not invent DSH field screens without evidence.

### 3.6 control-panel

**Role:** Admin, operations, governance, finance, marketing, support.

**Expected DSH responsibilities:**

- Overview.
- Orders operations.
- Stores.
- Catalogs.
- Marketing/offers.
- Support/disputes.
- Finance/settlement relation.
- Monitoring.
- Governance/quality.
- Settings/policies.

**Risks:**

- Sidebar RTL/writing direction issues.
- DSH duplicated under operations/marketing/catalogs without domain ownership.
- Control panel becoming pages instead of command center.
- Admin mutations without RBAC/audit.

### 3.7 webapp

**Role:** Public/customer web app if proven.

**DSH status:** `[TBD]` unless evidence proves active DSH route or flow.

### 3.8 website

**Role:** Marketing/public landing.

**DSH status:** `[TBD]` unless evidence proves active DSH landing/content.

---

## 4. Services Catalog

### 4.1 Canonical services

```text
dsh, wlt, knz, arb, amn, esf, mrf, snd, kwd
```

`exchangeprice` and `hr` are not canonical standalone services unless future repo evidence proves otherwise.

### 4.2 DSH

DSH is the first golden vertical slice.

Required lifecycle:

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
→ Settlement/refund/support
→ Control-panel monitoring/intervention
```

Required closure dimensions:

```text
UI
UX
Flow
RTL
State
Ownership
Screen model
UI Kit authority
Contracts
API types
API clients
Binding
Integration
Runtime
Backend
Data
Security
Observability
Testing
Production readiness
```

### 4.3 WLT

WLT is the financial authority.

Expected relation:

```text
wallet
balance
payment
ledger
refund
settlement
partner financial relation
captain earnings relation
control-panel finance monitoring
```

DSH must not own money truth locally.

### 4.4 KNZ

Must be closed only after surface matrix and service contract are proven.

### 4.5 ARB

Operational service, likely partner/field/control-panel related. Must not be mixed with DSH without strict service context.

### 4.6 AMN

Operational/security/safety-related service if proven. Requires role and permission clarity.

### 4.7 ESF / MRF / SND / KWD

Community-service bundle candidates. Likely app-client/control-panel oriented, but each needs its own service contract, matrix, gap map, and final evidence gate.

---

## 5. Surface × Service Matrix

| Service | app-client | app-partner | app-captain | app-field | control-panel | webapp | website |
|---|---|---|---|---|---|---|---|
| DSH | Required | Required | Required | TBD/proven | Required | TBD | TBD |
| WLT | Required relation | Finance relation | Earnings relation | TBD | Finance/admin relation | TBD | TBD |
| KNZ | Expected/TBD | TBD | TBD | TBD | Expected/TBD | TBD | TBD |
| ARB | TBD | Expected/TBD | TBD | Expected/TBD | Expected/TBD | TBD | TBD |
| AMN | Expected/TBD | TBD | Expected/TBD | TBD | Expected/TBD | TBD | TBD |
| ESF | Expected/TBD | Not proven | Not proven | TBD | Community services | TBD | TBD |
| MRF | Expected/TBD | Not proven | Not proven | TBD | Community services | TBD | TBD |
| SND | Expected/TBD | Not proven | Not proven | TBD | Community services | TBD | TBD |
| KWD | Expected/TBD | Not proven | Not proven | TBD | Community services | TBD | TBD |

Legend:

```text
Required = needed by target platform logic
Expected/TBD = likely but must be proven
TBD/proven = do not invent until evidence
Not proven = no active claim
```

---

## 6. UI / UX / Flow Blueprint

### 6.1 Visual identity

```text
Deep Blue: #0A2F5C
Orange:    #FF500D
White:     #FFFFFF
```

### 6.2 Design spirit

```text
premium
modern
clean
low-noise
RTL-correct
fast
practical
cohesive
2026-level
```

### 6.3 UX laws

- One primary CTA per screen.
- Core task in one click where possible.
- No dead controls.
- No unexplained disabled states.
- No unclear Arabic/English mixing.
- No crowded cards.
- No meaningless filters.
- No hidden required steps.
- Progressive disclosure for complex forms.

### 6.4 RTL laws

- Arabic text aligns right.
- Icon + text stay in one right-side cluster.
- Chevron/action sits opposite.
- Avoid wrong `space-between`.
- Use logical start/end when direction matters.
- Control-panel sidebar is language-aware.
- No accidental centered Arabic row text.

### 6.5 State laws

Every screen must define:

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

---

## 7. Design System and UI Kit Authority

Rule:

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

UI Kit owns:

```text
tokens
typography
spacing
radius
elevation
motion
direction helpers
primitives
headers/topbars/tickers
buttons
cards
forms
lists
modals/sheets
states
payment decision UI when generic
order-linked chat UI when generic
media primitives
```

Forbidden outside UI Kit:

```text
local design tokens
local color palettes
local reusable button/card/header systems
generic empty/loading/error components repeated locally
random hardcoded brand colors
```

Surfaces may own feature-specific screen parts, but not reusable platform UI families.

---

## 8. Architecture Blueprint

### 8.1 Dependency direction

```text
apps → app-shells → surfaces → ui-kit
surfaces → binding adapters → api clients → backend/services
contracts → api-types/api-clients
services → contracts/domain/backend
```

### 8.2 Forbidden coupling

```text
ui-kit → surfaces/apps
app-shells → service screen bodies
apps → package internals
screen → backend URL
screen → generated client directly without binding contract
surface-owned → service-specific domain logic
service-owned/<service> → another service without contract
```

### 8.3 Public exports

Public consumption should go through stable package entrypoints only:

```text
@bthwani/ui-kit
@bthwani/app-shells
@bthwani/surfaces/<surface>
@bthwani/api-types
@bthwani/api-clients
```

---

## 9. API / Contracts / Binding Blueprint

Target chain:

```text
Contract / OpenAPI
→ generated API types
→ generated API clients
→ binding adapter / view model
→ surface screen
```

Contract laws:

- One contract authority.
- Stable service-prefixed `operationId`.
- Validated request/response schemas.
- Structured errors.
- Generated clients/types after contract change.
- UI never invents API shape.

Binding laws:

```text
Screen / Surface
→ View Model / Binding Adapter
→ API Client / Fixture Provider / Runtime Provider
→ Backend / Service
```

Forbidden:

```text
Screen → fetch()
Screen → localhost/LAN IP
Screen → process.env parsing
Screen → secret/token ownership
Screen → direct generated client without binding contract
```

Binding modes:

```text
design  = deterministic local presentation
partial = controlled hybrid
binding = live verified API/backend path
```

---

## 10. Runtime / Dev Workflow Blueprint

Canonical commands:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:i18n-direction
pnpm run guard:i18n-direction:mobile-control-panel
pnpm nx run-many --target=build --projects=control-panel,webapp,website,app-client,app-partner,app-captain,app-field --parallel=7
```

Runtime laws:

- No `npm`.
- No Expo Go as canonical mobile path.
- Expo Dev Client is canonical for mobile.
- Runtime provider selection is centralized.
- No hardcoded LAN/IP in production path.
- Fixtures are not production data.
- Production switch must not require screen rewrites.

---

## 11. Governance / Evidence / Quality Gates

### 11.1 Governance paths

```text
C:\bthwani-suite\governance
C:\bthwani-suite\docs\governance
```

Decision:

- `governance` should become canonical.
- `docs/governance` is transitional unless proven otherwise.
- Duplicate standards must be reconciled.
- Conflicting policies must be eliminated or marked deprecated.

### 11.2 Evidence root

```text
tools/registry/runs/{SESSION_ID}
```

Evidence pack should include:

```text
SUMMARY.md
status.txt
evidence.json
commands.log
git-status.txt
git-diff-check.txt
tsc-noemit.txt
risk-register.md
```

### 11.3 Quality gates

```text
Scope Gate
Branch Reality Gate
Path Gate
Import/Export Gate
App Shell Purity Gate
UI Kit Authority Gate
Screen Model Gate
RTL Gate
State Coverage Gate
API Contract Gate
Binding Gate
Integration Gate
Runtime Gate
Backend Gate
Data Gate
Security Gate
Observability Gate
Test Gate
Performance/Accessibility Gate
Evidence Gate
```

---

## 12. Current Critical Issues

### BLOCKER

| Issue | Impact | Required action |
|---|---|---|
| Branch truth not proven | Wrong base may invalidate work | Run Branch Reality Gate |
| DSH not mapped across all surfaces | Cannot close service lifecycle | Build DSH Flow Matrix + Gap Map |
| Apps/shells/surfaces boundary risk | Ownership drift | App Shell Purity + Boundary Forensics |
| API/binding unclear | No production closure | Contract/API/Binding phases |
| Governance split | Conflicting SSoT | Governance reconciliation |

### HIGH

- Shared folders may be dumping grounds.
- Screens may be bloated or fragmented.
- Local UI components may compete with UI Kit.
- Runtime/API leakage may exist in UI/shell layers.
- DSH/WLT payment relation may be unclear.
- Control-panel may contain duplicated DSH domains.

### MEDIUM

- Naming drift.
- Orphan/noise files.
- Weak test evidence.
- Incomplete observability.
- Documentation duplication.

---

## 13. Canonical Decisions

1. `apps/*` are shell-only.
2. `app-shells` owns shell/root behavior only.
3. `surfaces` owns screens and flows.
4. `service-owned/<service>/<surface>` owns service experience inside a surface.
5. `surface-owned/<surface>` owns general surface experience.
6. `ui-kit` is the only reusable design authority.
7. DSH is the first golden vertical slice.
8. WLT owns wallet/payment/ledger truth.
9. API/contracts/binding are mandatory before production closure.
10. `governance` should be the final SSoT after audit.
11. `tools/registry/runs` is the evidence root.
12. Unproven facts are `[TBD]`.

---

## 14. Final Platform Blueprint Verdict

```text
PLATFORM_BLUEPRINT_STATUS: TARGET BLUEPRINT READY
REPOSITORY_CLOSURE_STATUS: UNPROVEN UNTIL EVIDENCE PACKS PASS
DSH_CLOSURE_STATUS: FIRST GOLDEN SLICE / NOT CLOSED UNTIL VERIFIED
API_BINDING_STATUS: TBD UNTIL CONTRACT/API/BINDING FORENSICS
PRODUCTION_STATUS: BLOCKED UNTIL FINAL GATES PASS
```

The platform can reach full closure only through the execution roadmap.
