# BThwani Platform Blueprint

> Canonical target path: `C:\bthwani-suite\governance\PLATFORM_BLUEPRINT.md`  
> Blueprint model: **Two blueprint types only**  
> Platform blueprint: `governance/PLATFORM_BLUEPRINT.md`  
> Service blueprint: `{service}/SERVICE_BLUEPRINT.md`  
> API contracts: OpenAPI files only, not blueprint files

---

## 0. Mandatory Agent Operating Contract

This file is the mandatory operating system for any AI agent or human developer working inside BThwani.

The agent or developer must read this file first, then read the relevant `{service}/SERVICE_BLUEPRINT.md` before touching any service-owned path.

This file defines platform truth, platform rules, execution order, verification gates, evidence requirements, decision language, anti-noise rules, and closure requirements.

This file must not duplicate service-specific truth. Service-specific facts, flows, statuses, evidence, gaps, and closure decisions must live only inside `{service}/SERVICE_BLUEPRINT.md`.

OpenAPI files are technical contract files only:

```text
master.openapi.yaml
auth.openapi.yaml
{service}/{service}.openapi.yaml
```

Any additional blueprint-style file for the same purpose is forbidden as architecture noise.

### 0.1 Required agent behavior

Before any work, the agent must:

1. Confirm the repo path is `C:\bthwani-suite`.
2. Confirm the active branch.
3. Inspect the current working tree.
4. Read `governance/PLATFORM_BLUEPRINT.md`.
5. Classify the task as one of: `platform`, `service`, `app/surface`, `contract`, `ui-kit`, `runtime`, `governance`, `evidence`, or `cleanup`.
6. If the task touches a service, read that service's `{service}/SERVICE_BLUEPRINT.md` first.
7. If the task touches an API contract, read the relevant OpenAPI file first.
8. If the task touches UI, verify the `@bthwani/ui-kit` boundary first.
9. Apply the smallest safe change that satisfies the task.
10. Run required verification.
11. Produce an evidence pack when the task changes architecture, service truth, contracts, runtime behavior, UI authority, guards, or release readiness.
12. Return exactly one decision from the allowed decision language.

### 0.2 Required non-guessing behavior

The agent must not guess missing truth.

If a fact is not present in repository files, OpenAPI contracts, service blueprints, evidence packs, or explicit task instructions, it must be marked as one of:

```text
TBD
UNPROVEN
NEEDS_EVIDENCE
BLOCKED
NOT CLOSED
```

The agent must not convert any unknown into `PASS`, `CLOSED`, `READY`, `READY_FOR_PR`, or `100%` without evidence.

---

## 1. Platform Canonical Truth

BThwani is a multi-service digital platform implemented as a **Modular Monolith Monorepo**.

The platform is not a set of unrelated apps. The platform is one system with multiple official surfaces and service-owned modules.

### 1.1 Highest ownership law

```text
service owns service truth
app owns shell/composition
ui-kit owns design authority
OpenAPI owns contract truth
evidence owns acceptance
```

### 1.2 Platform type

```text
BThwani = Multi-Service Modular Monolith Monorepo
```

Meaning:

- Services are first-class domain modules.
- Apps and surfaces are runtime/composition shells.
- Services own their domain, service flows, service frontend slices, service backend scope, service contracts, service gaps, and service evidence.
- Apps do not own business logic.
- UI system authority belongs to `@bthwani/ui-kit`.
- Platform contracts are centralized through root OpenAPI files.
- Service contracts are owned by each service.
- No microservices split is approved at this phase.
- No generic `core/` or `platform-core/` layer is approved at this phase.

### 1.3 Experience truth

BThwani must feel:

```text
premium
clear
trustworthy
low-friction
scalable
role-correct
operationally disciplined
```

BThwani must not feel:

```text
improvised
noisy
fragmented
duplicated
structurally confused
visually inconsistent
financially ambiguous
```

### 1.4 Quality truth

A feature fails even if it appears to work when it breaks ownership, direction, contracts, evidence, security, financial routing, or maintainability.

Platform quality dimensions:

| Quality Area | Non-negotiable rule |
|---|---|
| Structural quality | A feature fails if it works but breaks ownership. |
| UX quality | A flow fails if the user cannot quickly understand the next step. |
| State quality | Important journeys must cover loading, empty, error, offline, disabled, success, pending, retry, and blocked states as applicable. |
| Financial quality | Any financial effect outside WLT is rejected. |
| Direction quality | Arabic/RTL correctness is mandatory wherever Arabic UI exists. |
| Maintainability | No duplicate truth, hidden ownership, or local convenience architecture. |
| Scalability | The structure must support new services, screens, and flows without ambiguity. |

---

## 2. Canonical Repository Map

The current canonical model is root-first.

### 2.1 Official root contracts

```text
master.openapi.yaml
auth.openapi.yaml
```

### 2.2 Official governance blueprint

```text
governance/PLATFORM_BLUEPRINT.md
```

### 2.3 Official apps and surfaces

```text
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
webapp/runtime
website/runtime
```

### 2.4 Official UI authority

```text
ui-kit
```

### 2.5 Official services

```text
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

### 2.6 Canonical structure rule

Any path not listed in this file is not canonical platform truth unless it is explicitly proven and this file is updated with evidence.

The workspace must not contain legacy workspace globs such as `packages/*` after package retirement is proven and applied.

---

## 3. Apps, Roles, Permissions, and Responsibilities Matrix

Apps are shell/composition layers. They host role-specific experiences and consume service-owned surfaces/contracts.

Apps must not own service business logic, service contracts, service domain rules, reusable design primitives, auth truth, or financial truth.

### 3.1 Official surfaces

| Surface | Primary role | Meaning | Owns | Does not own |
|---|---|---|---|---|
| `app-client` | Customer | Primary mobile customer surface | entry, bootstrap, routing, providers, composition, customer shell | service logic, partner logic, captain logic, field logic, backend logic, API contracts, design system |
| `webapp` | Customer web user | Functional web counterpart to `app-client` | web shell, web runtime, customer composition | semantic drift from `app-client`, service logic, backend truth |
| `app-partner` | Partner / merchant / service provider | Partner operations and fulfillment surface | partner runtime, partner composition, partner shell | service domain logic, auth truth, wallet internals, independent registration truth |
| `app-captain` | Captain / driver / executor | Delivery/trip execution surface | captain runtime, captain composition, execution UX shell | pricing logic, payment logic, service internals, backend truth |
| `app-field` | Field agent | Field onboarding and partner acquisition/support surface | field runtime, field composition, field workflow shell | platform auth, service internals, independent service truth |
| `control-panel` | Admin / operations / support | Web-first operational control room | admin composition, monitoring, intervention UI, operational control views | financial truth outside WLT, service business ownership, alternate backend truth |
| `website` | Public visitor | Public marketing/corporate site | public content shell, public entry experience | live service execution logic, service contracts, financial or admin flows |

### 3.2 Customer surface equivalence rule

```text
app-client and webapp are one functional consumer surface with different shells.
```

Meaning:

- They share the same customer semantic truth.
- Their core behavior must not drift.
- Differences are allowed only when caused by shell/device behavior.
- Any customer-flow divergence must be documented and justified.

### 3.3 Account activation rules

| Surface | Open registration | Activation owner | Capability field |
|---|---:|---|---|
| `app-client` | Allowed when product policy enables it | Auth/platform policy | customer identity/profile |
| `app-partner` | No open registration | `control-panel` | `partner_type = DSH | ARB` |
| `app-captain` | No open registration | `control-panel` | `captain_type = DSH | AMN` |
| `app-field` | No open registration | `control-panel` | `field_type = DSH | ARB` |
| `control-panel` | Admin-controlled | Admin/platform policy | admin role/capabilities |
| `webapp` | Mirrors customer policy | Auth/platform policy | customer identity/profile |
| `website` | Public | N/A | public visitor |

### 3.4 App shell-only rule

Allowed in apps:

```text
entry
bootstrap
routing mount
providers
platform config
metadata
minimal environment wiring
composition shell
role-specific host layout
```

Forbidden in apps:

```text
real service screens as app-owned truth
business/domain logic
reusable UI families
local design tokens
mock service content as truth
service domain logic
independent i18n/direction ownership
direct backend/API ownership
deep/private imports
parallel financial logic
```

---

## 4. Service Registry and Service Routing Rules

The platform service registry is a routing map only. It does not duplicate service truth.

For service-specific facts, the agent must read the service blueprint.

| Service | Meaning | Type | Root | Blueprint | OpenAPI |
|---|---|---|---|---|---|
| `dsh` | Shopping and delivery | Paid service | `dsh/` | `dsh/SERVICE_BLUEPRINT.md` | `dsh/dsh.openapi.yaml` |
| `wlt` | BThwani wallet, payments, ledger, settlements | Financial platform path | `wlt/` | `wlt/SERVICE_BLUEPRINT.md` | `wlt/wlt.openapi.yaml` |
| `knz` | Open marketplace for new/used goods | Marketplace | `knz/` | `knz/SERVICE_BLUEPRINT.md` | `knz/knz.openapi.yaml` |
| `amn` | Taxi / passenger transport | Paid service | `amn/` | `amn/SERVICE_BLUEPRINT.md` | `amn/amn.openapi.yaml` |
| `arb` | Bookings: hotels, halls, facilities, providers | Paid service | `arb/` | `arb/SERVICE_BLUEPRINT.md` | `arb/arb.openapi.yaml` |
| `esf` | Blood donation and matching | Free / humanitarian by default | `esf/` | `esf/SERVICE_BLUEPRINT.md` | `esf/esf.openapi.yaml` |
| `kwd` | Jobs and work opportunities | Free by default | `kwd/` | `kwd/SERVICE_BLUEPRINT.md` | `kwd/kwd.openapi.yaml` |
| `mrf` | Lost and found | Free by default | `mrf/` | `mrf/SERVICE_BLUEPRINT.md` | `mrf/mrf.openapi.yaml` |
| `snd` | Specialized service requests and provider matching | Free by default unless model changes | `snd/` | `snd/SERVICE_BLUEPRINT.md` | `snd/snd.openapi.yaml` |

### 4.1 Service ownership law

Each service owns:

```text
service purpose
service business meaning
service frontend slices
service backend scope
service domain rules
service OpenAPI contract
service gap map
service screen/API matrix
service state ledger
service evidence
service closure decision
```

Each service does not own:

```text
app runtime shell
master.openapi.yaml
auth.openapi.yaml
ui-kit primitives
other service internals
WLT financial truth unless the service is WLT
control-panel shell itself
```

### 4.2 Service ↔ surface association rule

A service may appear in multiple surfaces, but service truth remains service-owned.

Surfaces provide shell, role, navigation, and composition. Services provide service meaning, service flows, service-owned UI slices, contracts, and state.

---

## 5. Financial Law and WLT-Only Path

WLT is the only financial path for the entire platform.

Any financial effect must pass through WLT contracts and WLT-owned truth.

### 5.1 WLT-owned financial effects

WLT owns:

```text
collection
fees
commissions
deposits
refunds
settlements
payouts
ledger entries
reconciliation
batch runs
exports
financial closures
wallet balance
loyalty ledger
gifted balance where product policy enables it
```

### 5.2 Financial prohibitions

Forbidden:

```text
any service writing financial effects outside WLT
any surface writing financial effects outside WLT
any control-panel route acting as a parallel financial channel
any endpoint/job/webhook creating financial truth outside WLT contracts
any direct ledger mutation outside WLT
```

### 5.3 Control-panel finance rule

```text
control-panel/finance = UI/admin/monitoring only.
WLT owns financial truth.
```

### 5.4 Surface wallet/payment access

| Surface | Allowed financial access |
|---|---|
| `app-client` | balance, top-up, pay, settle, transfer, subscriptions, gifted balance through WLT |
| `app-partner` | financial overview, payouts, settlements, ledger, wallet operations by permission through WLT |
| `app-captain` | balance, earnings, payouts, settlements, wallet operations by permission through WLT |
| `app-field` | balance, payouts, settlement/wallet operations by permission through WLT |
| `control-panel` | monitoring, administration, support, reconciliation views through WLT contracts only |
| `webapp` | customer financial operations through WLT when enabled |
| `website` | no live financial operations unless explicitly approved through WLT-backed public flow |

### 5.5 KNZ special financial rule

KNZ does not provide platform delivery by default.

KNZ must not create C2C item-price payment flows through the platform unless explicitly approved later through WLT.

Any future financial effect related to KNZ must pass through WLT only.

---

## 6. Contract Model

OpenAPI files are technical contracts only. They are not proof of implementation.

### 6.1 Root contract files

```text
master.openapi.yaml = platform contract index
auth.openapi.yaml = platform authentication/authorization contract
```

### 6.2 Service contract files

```text
{service}/{service}.openapi.yaml = service contract
```

### 6.3 Master OpenAPI rule

`master.openapi.yaml` must remain a lightweight index.

It may reference:

```text
x-bthwani-platform-contracts:
  auth: ./auth.openapi.yaml

x-bthwani-service-contracts:
  dsh: ./dsh/dsh.openapi.yaml
  wlt: ./wlt/wlt.openapi.yaml
  knz: ./knz/knz.openapi.yaml
  arb: ./arb/arb.openapi.yaml
  amn: ./amn/amn.openapi.yaml
  esf: ./esf/esf.openapi.yaml
  mrf: ./mrf/mrf.openapi.yaml
  snd: ./snd/snd.openapi.yaml
  kwd: ./kwd/kwd.openapi.yaml
```

It must not become a God API, business logic container, or endpoint dumping ground.

### 6.4 Auth OpenAPI rule

`auth.openapi.yaml` is a platform contract for identity, sessions, authentication, authorization, roles, permissions, capability type checks, and current principal discovery.

It is not a `core/` implementation and not a business service.

### 6.5 Screen/API Matrix before OpenAPI

No endpoint may be created because the agent expects it may be needed.

Before changing OpenAPI, the service blueprint must document:

```text
screen/flow needing data
screen/flow needing action
required state or transition
current gap
contract need
owner path
evidence path
```

### 6.6 Gap Map before contract change

No OpenAPI change without a documented gap.

```text
No OpenAPI change without a documented gap.
No endpoint without screen/flow need.
No schema without usage demand.
```

### 6.7 OpenAPI is not implementation proof

OpenAPI means:

```text
Contract exists.
```

OpenAPI does not mean:

```text
Binding done.
Integration done.
Runtime done.
Service closed.
Production ready.
```

### 6.8 Contract-to-binding order

The correct order is:

```text
Flow / Screen Need
→ Screen/API Matrix
→ Gap Map
→ OpenAPI Contract
→ Generated/typed client or verified typed boundary
→ Binding Adapter / ViewModel
→ Screen State
→ Runtime Evidence
```

---

## 7. UI/UX and UI Kit Authority

`@bthwani/ui-kit` is the single design operating system for all BThwani interfaces.

### 7.1 Import and ownership law

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

Services and apps own business meaning, flow decisions, and data behavior.

UI Kit owns visual and interaction authority.

### 7.2 UI Kit owns

```text
tokens
colors
typography
spacing
radius
motion
direction helpers
primitives
headers/topbars/tickers
cards/buttons/lists/forms/modals/states
themes
overlays
shared UI contracts
RTL-safe reusable patterns
state and feedback families
```

### 7.3 UI Kit does not own

```text
business logic
service truth
backend logic
API contracts
runtime truth
screen-specific decisions
service-specific widgets before reuse evidence
route-aware screen logic
```

### 7.4 Visual identity

Official identity anchors:

```text
Deep Blue: #0A2F5C
Orange: #FF500D
White: #FFFFFF
```

These colors define the brand anchor, not a prison. The UI system may use controlled semantic tints, shades, neutral scales, accessibility-safe variants, and state colors when needed to create a strong, comfortable, premium, readable interface.

Random colors, local palettes, and duplicate token systems are forbidden.

### 7.5 UX philosophy

BThwani UI must optimize for:

```text
clarity before decoration
action before ornament
flow before density
trust before showmanship
consistency before arbitrary variety
system before improvisation
scalability before quick hacks
accessibility as quality
Arabic/RTL as a first-class origin, not a patch
reduced hesitation, error, and time-to-goal
```

### 7.6 Premium definition

Premium does not mean:

```text
excessive glass effects
heavy shadows
showcase animation
visual noise
stacked effects
```

Premium means:

```text
calm visual hierarchy
precise spacing and proportion
strong information hierarchy
controlled color balance
trustworthy components
soft disciplined motion
premium without noise
```

### 7.7 RTL and language law

Where Arabic UI exists:

```text
Arabic text must be right-aligned in rows/forms.
Icon + text cluster must stay on the right for RTL rows.
Chevron/action must be on the opposite side.
No accidental space-between separation between icon and label.
Directional icons must use central direction handling.
Logical start/end must be preferred over physical left/right.
Control-panel sidebar must be language-aware.
Arabic/English typography mapping must be centrally owned.
```

### 7.8 Screen file model

A screen is a route/page/surface entry.

A card, row, section, or block is not a screen.

Rules:

```text
*Screen.tsx must represent a real route/page/surface entry.
Do not name cards, rows, sections, or blocks as Screen.
A giant file containing many screens is a breach.
A fragment named Screen without route/page/surface entry meaning is a breach.
index.ts exports screen entries only unless a public contract intentionally exposes more.
A screen consumes view-state; it must not own raw backend calls.
```

---

## 8. Control Panel Canonical Model

`control-panel` is the web-first operational control room.

It is not a collection of scattered admin pages.

### 8.1 Top-level IA

Approved top-level sections:

```text
dashboard
operations
finance
catalogs
support
partners
marketing
community-services
control
```

### 8.2 Control children

Approved children under `control`:

```text
platform
administration
hr
```

A separate `governance` child under `control` is not approved in this blueprint. Governance truth belongs in repository governance files and guard outputs, not as a duplicated control-panel IA bucket unless explicitly proven later.

### 8.3 Community services grouping

`community-services` includes:

```text
esf
kwd
mrf
snd
```

### 8.4 Finance rule

`control-panel/finance` is UI/admin/monitoring only. WLT owns financial truth.

### 8.5 VAR / mutable policy placement

Any mutable policy must be represented as policy/config truth, not hardcoded UI truth.

Examples:

```text
VAR_DSH_DELIVERY_FEE
VAR_DSH_SERVICE_FEE
VAR_WLT_SETTLEMENT_WINDOW
VAR_AMN_OTP_RETRY_LIMIT
VAR_PROVIDER_PAYMENT_PRIORITY
VAR_STORE_COMMISSION_RATE
VAR_ZONE_SURGE_MULTIPLIER
```

Mutable policy override priority:

```text
Store
→ Subcategory
→ Category
→ Zone
→ City
→ Region
→ Global
```

Policy override logic must be centrally owned, contract-backed, tested, and auditable before it can affect production-like behavior.

---

## 9. Execution Algorithm

The platform execution sequence is mandatory.

### 9.1 Universal execution sequence

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

### 9.2 Service-deep closure rule

Deep closure is service-by-service.

Only one primary service may be closed deeply at a time.

DSH is the recommended first deep-closure service unless repository evidence changes that decision.

### 9.3 UX before API rule

The service must prove screen/flow need before contract expansion.

The correct discovery sequence for service UI/API work is:

```text
Actors
→ Operations
→ Lifecycle
→ Surface Coverage
→ Journeys
→ Screen Inventory
→ Route Rationalization
→ Purpose / CTA
→ State Coverage
→ Screen/API Matrix
→ Gap Map
→ OpenAPI Contract
```

### 9.4 First binding rule

First binding must be small.

It must be:

```text
one small flow
one screen or one bounded chain
one client/boundary
verification before expansion
```

Binding expansion must be gradual:

```text
flow-by-flow
or surface-by-surface
```

No service-wide binding jump is allowed without evidence.

### 9.5 Runtime truth rule

Fixture, mock, preview, or seed data is not runtime truth.

Runtime source must be classified:

```text
mock
fixture
seed
preview
runtime truth
production-like truth
```

Any fake readiness must be disclosed.

### 9.6 Runtime mode rule

Do not default to full-stack runtime for every phase.

Choose runtime mode based on the current phase and evidence need.

### 9.7 Cleanup order

Cleanup cannot start before ownership and consumer proof.

Correct cleanup order:

```text
confirm consumers/references
confirm route/export usage
confirm no runtime dependency
move misplaced files only when owner is proven
replace imports through public exports
reclassify fake screens into parts
split bloated screens only when needed
delete dead/orphan only after zero-consumer proof
verify
```

Forbidden cleanup:

```text
blind global delete
blind global replace
delete based on filename only
move without import/export proof
mix service closure with global ui-kit refactor
mix UI/UX closure with API/binding unless phase allows
```

---

## 10. Platform Gates

Platform gates define what `PASS` means. Service blueprints record each service's status against these gates.

### 10.1 UI / UX / Flow Gate

PASS requires:

```text
actors identified
operations identified
lifecycle mapped
surface coverage mapped
journeys mapped
screen/route/sheet/state inventory exists
primary CTA understood
states covered where applicable
RTL/direction verified where applicable
ui-kit boundary respected
no app-owned service screen bodies
no unexplained visual drift
evidence exists
```

### 10.2 Binding Gate

PASS requires:

```text
contract or typed boundary exists
client/boundary generated or verified
one bounded flow uses it
screen/view-state consumes it through approved layer
TypeScript passes
evidence exists
```

### 10.3 Integration Gate

PASS requires:

```text
approved public interface, typed client, or domain event
no deep/private service import
no direct foreign data ownership
no copied service logic
integration behavior verified
evidence exists
```

### 10.4 API / Contract Gate

PASS requires:

```text
OpenAPI file exists
contract state is explicit
endpoints are real or marked TBD
no fake endpoint claims
schemas exist only when usage is proven
screen/API matrix and gap map justify contract changes
evidence exists
```

### 10.5 Runtime Gate

PASS requires:

```text
runtime mode classified
happy path verified where in scope
failure path verified where in scope
recovery path verified where in scope
control-panel/staff path verified where in scope
persistence verified where in scope
fake/mock/fixture source disclosed
runtime evidence exists
```

### 10.6 Security / RBAC / Privacy / Audit Gate

PASS requires:

```text
actor type enforced server-side where relevant
role/capability rules documented
PII/secrets/logging/retention risks reviewed
audit path defined for sensitive operations
financial operations routed through WLT
no secret leakage
no unauthorized control-plane path
```

### 10.7 Observability / Testing / Performance / Accessibility Gate

PASS requires, according to scope:

```text
TypeScript
lint/diff-check
unit tests
component tests
integration tests
E2E or critical path proof
visual/RTL proof
accessibility review
production-like runtime checks
observability signal for P0 flows
performance review for critical paths
```

WCAG 2.2 is the accessibility floor for shared UI and enabled production-like flows.

### 10.8 Evidence Gate

PASS requires an evidence pack when the task changes platform truth, service truth, contracts, guards, runtime behavior, UI authority, financial behavior, or release readiness.

---

## 11. Service Blueprint Contract

Each service must have exactly one service blueprint file:

```text
{service}/SERVICE_BLUEPRINT.md
```

It is the service truth file only. It must apply this platform blueprint without duplicating it.

### 11.1 Required structure for every service blueprint

```md
# {SERVICE} Service Blueprint

## 1. Service Truth
## 2. Ownership and Boundaries
## 3. Actors, Personas, and Capabilities
## 4. Surface Matrix
## 5. Operation Registry
## 6. Journey and Lifecycle Map
## 7. Screen / Route / Sheet / State Inventory
## 8. Screen/API Matrix
## 9. Gap Map
## 10. Contract, Backend, and Domain State
## 11. Binding, Integration, and Runtime State
## 12. Security, RBAC/ABAC, Privacy, and Audit State
## 13. Observability, Testing, Performance, and Accessibility State
## 14. Control-Panel Relation
## 15. Evidence, Decision, and Next Action
```

### 11.2 Service blueprint must not include

```text
platform philosophy
platform-wide decision language explanations
platform-wide UI kit doctrine
platform-wide execution algorithm
other service details
contracts copied from OpenAPI
large generated dumps
noisy screen lists without status and evidence
```

### 11.3 Service blueprint must include status, not platform rule repetition

Example:

```text
Platform says: what Binding Gate PASS means.
Service says: Binding Status = TBD/PASS/FIX_REQUIRED and Evidence = path.
```

---

## 12. Verification, Evidence, Scripts, and Guards

### 12.1 Evidence root

The canonical evidence root is:

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}
```

Required handoff ZIP location:

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}\_HANDOFF.zip
```

### 12.2 Canonical scripts path

Repository scripts belong under:

```text
tools/scripts
```

### 12.3 Canonical guards path

Repository guards belong under:

```text
tools/guards
```

### 12.4 Guard catalog rule

Each guard must have:

```text
id
owner
severity
scope
command
output
evidence path
classification
```

A guard must not invent policy. A guard applies policy already defined by repository governance, this platform blueprint, service blueprints, or explicit contract files.

### 12.5 Baseline verification commands

For ordinary code/config changes:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm nx show projects
pnpm -w exec tsc --noEmit
pnpm run guard:service-blueprint
```

For broader changes:

```powershell
pnpm run precommit:fast
```

For UI authority changes:

```powershell
pnpm run guard:tamagui-import-boundary
pnpm run guard:tamagui-law
```

For runtime/release-related changes, run the relevant app/runtime build or smoke command and capture output in the evidence pack.

### 12.6 Evidence pack minimum contents

```text
SUMMARY.md
evidence.json
git-status.txt
git-diff-stat.txt
git-name-status.txt
git-diff-check.txt
tsc-noemit.txt
nx-projects.txt
guard outputs
runtime/build outputs when in scope
remaining-risks.md
_HANDOFF.zip
```

### 12.7 Traceability requirement

Every non-trivial requirement or change must be traceable to:

```text
id
source
owner
service
surface
flow
screen/route
contract
binding
test proof
runtime/visual proof
evidence
status
next action
```

---

## 13. Decision Protocol

Only these decisions are allowed:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
NO_ACTION_REQUIRED
```

### 13.1 PASS

Use only when all required checks for the scope passed and evidence exists where required.

### 13.2 PASS_WITH_WARNINGS

Use only when required gates pass but documented non-blocking risks remain.

### 13.3 FIX_REQUIRED

Use when the task is understood and safe to continue, but verification or standards failed.

### 13.4 BLOCKED

Use when progress would require unsafe assumptions, missing files, missing evidence, branch mismatch, dirty unrelated worktree state, access failure, or destructive action without proof.

### 13.5 READY_FOR_PR

Allowed only when:

```text
working tree is understood
scope is complete
diff-check passes
tsc passes
required guards pass
runtime/build evidence exists when in scope
service blueprints updated when service truth changed
OpenAPI updated when contract truth changed
evidence pack exists when required
remaining risks are documented
```

### 13.6 No 100% CLOSED without evidence

Forbidden without evidence:

```text
100% CLOSED
FINAL COMPLETE
PRODUCTION READY
READY
GO
FULLY DONE
```

---

## 14. Production Readiness Standard

Production readiness is not proven by TypeScript or build alone.

### 14.1 GO criteria

A GO decision requires:

```text
branch reality proven
working tree understood
TypeScript passes
builds pass or blockers documented
contract/API/client generation verified or not required
binding paths closed or intentionally partial with warning
runtime provider centralized
backend readiness verified or explicitly out of scope
security/RBAC/audit gates pass for enabled flows
observability/runbook exists for P0 flows
minimum test strategy passes
rollback plan exists
evidence pack exists
```

If any required criterion fails:

```text
RELEASE_STATUS: BLOCKED
```

---

## 15. High-Risk Change Triggers

The following changes are high risk and must be explicitly identified before execution:

```text
WLT-only financial path
guard thresholds/enforcement
policy override algorithm/scopes
control-panel canonical root/hostnames
secrets/PII/logging/retention
generated-only contract/client discipline
service billing classification
service ↔ surface associations
actor capability lock/type fields
server enforcement of actor types
deterministic app boot behavior
OpenAPI contract changes
runtime provider changes
ui-kit public API changes
service ownership moves
financial operation routing
```

High-risk changes require evidence and should not be bundled with unrelated cleanup.

---

## 16. Forbidden Noise, Drift, and Duplication

Forbidden:

```text
additional blueprint files for the same purpose
SURFACE_BLUEPRINT.md
UI_KIT_BLUEPRINT.md
SERVICE_FLOWS.md
SERVICE_SURFACES.md
SERVICE_BACKEND_CONTRACT.md
SERVICE_CLOSURE_CHECKLIST.md
core/
platform-core/
local design systems
local token systems
Tamagui outside ui-kit
screen-by-screen random visual fixes
UI-first closure
API-first closure
binding-first closure
runtime-first closure
production claim before evidence
deletion before zero-consumer proof
broad cleanup before ownership proof
service closure without related surfaces classified
financial behavior outside WLT
final claim without evidence pack
deep/private imports between services
service logic in app runtime
mock/fixture/seed treated as runtime truth
business policy hardcoded in mutable UI paths
```

---

## 17. Current Canonical References

### 17.1 Platform files

```text
governance/PLATFORM_BLUEPRINT.md
master.openapi.yaml
auth.openapi.yaml
```

### 17.2 Service files

```text
dsh/SERVICE_BLUEPRINT.md
wlt/SERVICE_BLUEPRINT.md
knz/SERVICE_BLUEPRINT.md
arb/SERVICE_BLUEPRINT.md
amn/SERVICE_BLUEPRINT.md
esf/SERVICE_BLUEPRINT.md
mrf/SERVICE_BLUEPRINT.md
snd/SERVICE_BLUEPRINT.md
kwd/SERVICE_BLUEPRINT.md
```

### 17.3 Service contract files

```text
dsh/dsh.openapi.yaml
wlt/wlt.openapi.yaml
knz/knz.openapi.yaml
arb/arb.openapi.yaml
amn/amn.openapi.yaml
esf/esf.openapi.yaml
mrf/mrf.openapi.yaml
snd/snd.openapi.yaml
kwd/kwd.openapi.yaml
```

---

## 18. Final Operating Summary

```text
PLATFORM_BLUEPRINT.md defines the method.
SERVICE_BLUEPRINT.md records service state.
OpenAPI defines contract truth.
Evidence proves claims.
WLT owns financial truth.
ui-kit owns design authority.
Apps own shell/composition only.
Services own service truth.
No extra blueprint files.
No closure without evidence.
```
