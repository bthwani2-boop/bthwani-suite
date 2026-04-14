# BTHWANI_MASTER_EXECUTION_PLAYBOOK__SINGLE_FILE

Status: Locked Consolidated Draft  
Owner: BThwani  
Version: 1.0  
Last Updated: 2026-04-13  
Confidence: High  

---

## 0. Purpose of This File

This file is the **single consolidated execution playbook** for the BThwani platform at the current stage.

It exists to give one unified, normalized, implementation-grade reference that combines:
- product direction
- platform model
- service model
- repo structure and ownership
- architecture guardrails
- technical constraints
- quality bars
- app-client design and development framing
- control-panel IA direction
- DSH service locks and operational policy highlights
- phase-1 execution direction

This document is intentionally designed as a **single-file operating reference**.
It replaces fragmentation, scattered notes, duplicated summaries, and conflicting local interpretations.

It is not a full low-level implementation manual.
It is the **governing execution reference** to start and align design and development correctly.

---

## 1. Interpretation Rules

### 1.1 Reading rule
Read this file as a governed interpretation document, not as a brainstorming note.

### 1.2 Decision rule
If something is stated here as fixed, it is binding unless a newer locked decision explicitly supersedes it.

### 1.3 Normalization rule
Where legacy/reference material used older names such as `APP-USER`, this file normalizes them to current canonical names such as `app-client`.

### 1.4 Ownership rule
Correctness is not defined only by whether code runs.
Correctness is also defined by whether ownership, structure, and truth remain in the right place.

### 1.5 No-shortcut rule
A shortcut that violates ownership, financial path, or truth boundaries is not accepted as a valid shortcut.

---

## 2. Core Definitions

### 2.1 Service
A backend business service such as:
- DSH
- WLT
- KNZ
- ARB
- AMN
- ESF
- MRF
- SND
- KWD

### 2.2 Surface
A delivery surface or user-facing shell such as:
- app-client
- app-partner
- app-captain
- app-field
- control-panel
- webapp
- website

### 2.3 Ownership
The rule that each major category of truth must have one clear owner.

### 2.4 Truth
The canonical place where a category of logic, design, contract, runtime behavior, or policy actually belongs.

### 2.5 Guardrail
A rule that prevents local convenience from breaking platform coherence.

---

## 3. Platform Summary

BThwani is a governed multi-surface, multi-service platform.

It is not a collection of disconnected applications.
It is one product system designed to support consumer, partner, captain, field, and control-plane experiences inside a shared platform structure.

The platform must feel:
- premium
- clear
- trustworthy
- low-friction
- scalable
- role-correct
- operationally disciplined

It must not feel:
- improvised
- noisy
- fragmented
- duplicated
- structurally confused
- visually inconsistent
- financially ambiguous

---

## 4. Canonical Repo

The active canonical repository is:

`bthwani-suite`

No alternate repo or side root may replace it as the real execution line.

This means:
- no `/app/frontend` as the canonical product repo
- no `/app/backend` as the canonical backend repo
- no `/app/memory` as the canonical documentation root
- no alternate architecture roots outside `bthwani-suite`

This repo is the real build line, not just a reference container.

---

## 5. Canonical Surface Set

The approved internal surface names are:
- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `control-panel`
- `webapp`
- `website`

### Surface interpretation
- `app-client` = primary consumer mobile surface
- `app-partner` = partner-facing mobile surface
- `app-captain` = captain execution surface
- `app-field` = field-operations surface
- `control-panel` = unified operational and administrative web control plane
- `webapp` = browser shell for the same functional consumer surface as `app-client`
- `website` = public marketing/institutional website

### Universal surface rule
`app-client` and `webapp` are one functional surface with different shells.

This means:
- same consumer truth
- different shell and device behavior
- no semantic drift in core user-facing behavior

---

## 6. Canonical Service Set

The approved service set is:
- `dsh`
- `wlt`
- `knz`
- `arb`
- `amn`
- `esf`
- `mrf`
- `snd`
- `kwd`

Each service is a backend/service truth owner.
None of them should dissolve into generic UI or be replaced by ad hoc surface-only interpretations.

---

## 7. Service Billing Classification

### PAID services
These services have financial effects and must route them through WLT only:
- `dsh`
- `amn`
- `arb`
- `wlt`

### FREE services
These services have no independent financial channel by default:
- `esf`
- `kwd`
- `mrf`
- `snd`

### Special case: KNZ
KNZ does not allow platform C2C payment for item price and does not provide platform delivery.
Any future platform-side financial effect related to KNZ must route through WLT only.

---

## 8. WLT Supreme Financial Rule

WLT is the **only financial path** for the entire platform.

This includes:
- collection
- fees
- commissions
- deposits
- refunds
- settlements
- payouts
- ledger entries
- reconciliation
- batch runs
- exports
- financial closures

### Absolutely forbidden
- any service writing financially outside WLT
- any surface writing financially outside WLT
- any control-panel route acting as a parallel money channel
- any endpoint/job/webhook creating financial effects outside WLT contracts and guards

### Control-panel finance rule
`finance/` inside control-panel is UI/administration/monitoring only.
All financial actions must call WLT contracts and remain guarded.

---

## 9. Actor Capability Lock

### Supreme rule
Every user account in partner/field/captain apps has one capability only.

Single Capability = Single Path = Single UI = Single Permission Set

This is server-enforced, not merely hidden by UI.

### Type field matrix
- `app-partner` → `partner_type` → `DSH` or `ARB`
- `app-field` → `field_type` → `DSH` or `ARB`
- `app-captain` → `captain_type` → `DSH` or `AMN`

### Properties
- required field
- single value only
- set from control-panel provisioning only
- included in claims
- enforced server-side on service-specific access

### Deterministic boot rule
After login, the app builds one path based on the type claim.
There are no in-app service switches for these actor apps.

---

## 10. Policies-as-Data Rule

Operationally changeable policy must be managed as policy data, not silently hardcoded as runtime truth.

Examples include:
- limits
- fees
- hours
- providers
- retry
- timeout
- notifications
- dispatch
- meta/OTP integrations
- settlement rules
- commercial overrides

### Override priority
Highest to lowest, when supported and enabled:
1. Store
2. Subcategory
3. Category
4. Zone
5. City
6. Region
7. Global

### Required policy properties
Every policy-like key should support:
- enable/disable
- audit trail
- preview
- rollback

---

## 11. Meta / External Communication Lock

Currently allowed Meta usage is tightly limited.

Allowed:
1. OTP via WhatsApp Business
2. DSH partner quick reply (WhatsApp first, then SMS)

Everything else is off by default unless explicitly approved later.

### Mandatory controls for messaging integrations
- secrets in vault only
- secret rotation discipline
- webhook authenticity
- replay protection
- idempotency for critical transitions
- no raw PII in logs

---

## 12. High-Risk Change Triggers

The following are high-risk and must be explicitly flagged before execution:
- WLT-only financial path rules
- guard thresholds/enforcement
- policy override algorithm/scopes
- control-panel canonical root/hostnames
- secrets/PII/logging/retention rules
- generated-only contract/client discipline
- service billing classification
- service ↔ surface associations
- actor capability lock/type field definitions
- server enforcement of actor types
- deterministic app boot behavior

---

## 13. Repo Ownership Map

This is the non-negotiable ownership map for `bthwani-suite`:

- `apps/` = delivery apps only
- `services/` = backend truth only
- `packages/ui-kit/` = design sovereignty only
- `packages/app-shells/` = shell ownership only
- `packages/surfaces/` = service-owned UI flows only
- `packages/api-types/` = generated types only
- `packages/api-clients/` = generated clients + thin adapters only
- `contracts/` = API sovereignty only
- `runtime/` = local runtime orchestration only
- `docs/` = execution documentation only
- `governance/` = binding rules only
- `tools/` = engineering tooling only

Any mixing between these layers is a direct architecture violation.

---

## 14. Canonical Tree

```text
bthwani-suite/
├─ .github/
│  └─ workflows/
├─ apps/
│  ├─ mobile/
│  │  ├─ app-client/
│  │  ├─ app-partner/
│  │  ├─ app-captain/
│  │  └─ app-field/
│  └─ web/
│     ├─ control-panel/
│     ├─ webapp/
│     └─ website/
├─ services/
│  ├─ dsh/
│  ├─ wlt/
│  ├─ knz/
│  ├─ arb/
│  ├─ amn/
│  ├─ esf/
│  ├─ mrf/
│  ├─ snd/
│  └─ kwd/
├─ packages/
│  ├─ ui-kit/
│  ├─ app-shells/
│  ├─ surfaces/
│  ├─ api-types/
│  └─ api-clients/
├─ contracts/
│  └─ master/
├─ runtime/
│  ├─ local/
│  └─ shared/
├─ docs/
├─ governance/
├─ tools/
│  ├─ scripts/
│  ├─ generators/
│  ├─ checks/
│  ├─ automation/
│  └─ registry/
├─ package.json
├─ pnpm-workspace.yaml
├─ nx.json
├─ tsconfig.base.json
├─ tsconfig.json
├─ .gitignore
└─ README.md
```

### Note on evidence root
If a separate evidence root is kept, it must not violate the repo ownership interpretation or silently become a product/runtime truth root.

---

## 15. Root-by-Root Technical Meaning

### .github/workflows/
Contains only CI/CD, checks, build/test/release automation.
Must not contain platform business code or UI source.

### apps/
Contains runnable and publishable applications only.
Apps must remain thin.
They may compose shells, surfaces, ui-kit, and client layers.
They may not become sovereignty roots.

### services/
Contains real service-side logic and backend truth.
Each service owns its backend domain logic, orchestration, policies, infrastructure adapters, and service-local contracts.

### packages/ui-kit/
Single owner of the design system.
Contains:
- foundation
- primitives
- components
- patterns
- state shells
- root wrappers/providers

Must not contain:
- service-specific flows
- backend logic
- generated API code

### packages/app-shells/
Owns app and web shell framing.
Contains:
- layout shells
- route framing
- navigation framing
- shell-level guards
- section mounting

Must not contain:
- service-specific business logic
- API transport
- backend code

### packages/surfaces/
Owns service-specific UI flows.
Canonical path pattern:
`packages/surfaces/src/<service>/<surface>/<flow-id>/`

Flow package may contain:
- fixtures
- screens
- sheets
- states
- sections
- hooks
- viewmodels
- flow.meta.ts
- index.ts

Must not contain:
- repositories
- persistence
- contracts sovereignty
- cross-app shell ownership

### packages/api-types/
Generated types only.
No manual business logic.

### packages/api-clients/
Generated clients + thin adapters only.
No business rules, no screen logic, no contract authorship.

### contracts/
Single API law root.
Contains master OpenAPI, fragments, spectral rules, and generated contract artifacts.
No controllers, clients, repositories, or UI logic.

### runtime/
Local/runtime orchestration only.
Contains:
- seed
- env templates
- compose/manifests
- shared runtime helpers

No business UI, no service domain code, no contracts truth.

### docs/
Execution and analysis documentation.
Contains platform maps, service profiles, design-system docs, architecture notes, runbooks, and decisions.

### governance/
Binding policy layer.
Contains repo laws, naming laws, standards, decisions, and checklists.

### tools/
Engineering support only.
Contains scripts, generators, checks, automation, and registry artifacts.
No product or runtime truth.

---

## 16. apps/ Technical Rules

Apps are delivery surfaces only.

### Mobile app shape
Each mobile app may contain:
- `src/entry/`
- `src/bootstrap/`
- `src/providers/`
- `src/navigation/`
- `src/platform/`
- `src/bridges/`
- `assets/`
- `app.config.ts`
- `eas.json`
- `package.json`
- `tsconfig.json`

### Web app shape
Each web app may contain:
- `src/app/`
- `src/middleware/`
- `src/entry/`
- `public/`
- `next.config.ts`
- `package.json`
- `tsconfig.json`

### apps must not contain
- deep business rules
- service repositories
- duplicated API contracts
- design system sovereignty
- service truth

---

## 17. services/ Technical Rules

Each service owns its backend truth.

Recommended internal structure:
- `module.ts`
- `api/`
- `application/`
- `domain/`
- `infrastructure/`
- `policies/`
- `events/`
- `jobs/`
- `queries/`
- `commands/`
- `contracts/`
- `test/`

### services must not contain
- screens
- app UI
- ui-kit components
- route shells
- local surface hacks

---

## 18. packages/ui-kit/ Technical Rules

`ui-kit` is the single design sovereignty owner.

Recommended structure:
- `foundation/` = colors, spacing, typography, radius, motion, breakpoints, z-index, direction foundations
- `primitives/` = low-level building blocks
- `components/` = reusable visual components
- `patterns/` = reusable screen-level patterns
- `state/` = loading, empty, error, offline, success, disabled shells
- `root/` = theme providers, locale providers, portal ownership, root wrappers
- `index.ts` = public exports

### ui-kit must not contain
- service-specific flows
- backend logic
- generated API code
- service-owned business copy that belongs in service flows

---

## 19. app-shells/ Technical Rules

`app-shells` owns shell framing only.

Contains:
- mobile shell layouts
- tab/stack shell composition
- web route shells
- page framing
- top/side navigation structures
- shell-level guards
- layout composition

Must not contain:
- service-specific business logic
- API transport
- backend code
- design sovereignty

---

## 20. surfaces/ Technical Rules

`surfaces` owns service-specific UI flows per service and per surface.

### Canonical organization
`packages/surfaces/src/<service>/<surface>/<flow-id>/`

### Each flow may include
- `fixtures/`
- `screens/`
- `sheets/`
- `states/`
- `sections/`
- `hooks/`
- `viewmodels/`
- `flow.meta.ts`
- `index.ts`

### surfaces must not contain
- repositories
- persistence
- contract truth
- generated client truth
- cross-app shell ownership

---

## 21. contracts/ Technical Rules

`contracts/master/` is the only API sovereignty root.

### Structure
- `openapi/master.openapi.yaml`
- `openapi/fragments/<service>/...`
- `openapi/spectral/`
- `generated/`

### contracts must not contain
- controllers
- clients
- repositories
- UI logic

---

## 22. runtime/ Technical Rules

`runtime/` exists only for local/runtime orchestration.

### local/
- `seed/`
- `env/`
- `compose/`

### shared/
- shared runtime helpers
- common local infra configs

### runtime must not contain
- business UI
- service domain truth
- contract truth

---

## 23. docs/ Technical Rules

`docs/` contains execution and analysis documents.

Recommended areas:
- `platform/`
- `architecture/`
- `services/<service>/`
- `design-system/`
- `operations/`
- `decisions/`

Service docs may include:
- service profile
- actors
- operations
- surface matrix
- journeys
- screen registry
- screen/API matrix
- gap map
- acceptance checklists

---

## 24. governance/ Technical Rules

`governance/` contains binding policy.

Recommended areas:
- `policies/`
- `standards/`
- `decisions/`
- `checklists/`

Examples:
- repo laws
- ownership laws
- naming laws
- runtime laws
- release laws
- coding standards
- UI standards
- testing standards
- approved architectural decisions

---

## 25. tools/ Technical Rules

`tools/` contains engineering support only.

Recommended areas:
- `scripts/`
- `generators/`
- `checks/`
- `automation/`
- `registry/`

### registry shape (if used)
`tools/registry/runs/{SESSION_ID}/`
with:
- `summary.txt`
- `evidence.json`
- `actions.json`
- `logs/`
- `reports/`
- `artifacts/`

### tools must not contain
- app runtime truth
- business data
- UI source
- canonical contracts

---

## 26. Surface ↔ Service Matrix

### DSH
- `app-client` = ordering, tracking, payments through WLT, customer-side flows
- `app-partner` = merchant order management and fulfillment coordination
- `app-captain` = dispatch and delivery execution
- `app-field` = onboarding partners and field support for DSH rollout
- `webapp` = same functional consumer surface as `app-client`
- `control-panel` = ops, support, partner, finance, monitoring

### KNZ
- `app-client` = browsing/listings/interactions
- `webapp` = same functional consumer surface
- `control-panel` = governance/moderation/catalog controls

### AMN
- `app-client` = trip request and user-side flows
- `app-captain` = captain-side execution
- `webapp` = same functional consumer surface
- `control-panel` = safety policies, zones, oversight

### ARB
- `app-client` = booking/escrow/dispute/closure flows
- `app-partner` = provider-side handling
- `app-field` = operational support where applicable
- `webapp` = same functional consumer surface
- `control-panel` = disputes, audits, policy enforcement

### WLT
- `app-client` = wallet/top-up/history/refunds exposure per policy
- `app-partner` = finance visibility and payouts exposure per policy
- `app-captain` = finance visibility and settlement exposure per policy
- `app-field` = finance visibility where policy allows
- `webapp` = same functional consumer surface for user-side finance flows
- `control-panel` = finance UI/admin only

### ESF
- `app-client`
- `webapp`
- `control-panel`

### KWD
- `app-client`
- `webapp`
- `control-panel`

### MRF
- `app-client`
- `webapp`
- `control-panel`

### SND
- `app-client`
- `app-partner` where applicable by service design
- `webapp`
- `control-panel`

---

## 27. Service Summaries for Design and Development

### DSH
Core delivery and shopping service.
Design emphasis:
- discovery
- cart/checkout
- tracking
- customer confidence
- communication
- WLT-coupled payment states

### WLT
Wallet and financial path.
Design emphasis:
- clarity
- trust
- balance visibility
- payment entry
- history
- refund/status confidence

### KNZ
Marketplace experience.
Design emphasis:
- browsing
- search
- listing detail
- clarity of no platform C2C payment / no platform delivery

### ARB
Booking/escrow/dispute-oriented service.
Design emphasis:
- trust
- state clarity
- guarded transitions
- closure confidence

### AMN
Trip/transport/safety-oriented service.
Design emphasis:
- request simplicity
- safety clarity
- zone/service understanding
- trip state confidence

### ESF
Free matching/support service.
Design emphasis:
- humanity
- urgency
- clarity
- low noise

### KWD
Free job board service.
Design emphasis:
- discoverability
- search clarity
- listing readability
- low clutter

### MRF
Lost/found + safe communication service.
Design emphasis:
- safety
- report clarity
- trustworthy detail
- secure communication states

### SND
Free service-request/matching service.
Design emphasis:
- request initiation
- matching state clarity
- simple follow-up
- low friction

---

## 28. app-client Detailed Design Framing

`app-client` is the primary consumer mobile surface.
It must feel like one coherent consumer product, not nine disconnected mini-apps.

### app-client must include
- entry and session restore
- home / service hub
- search / discovery entry
- notifications center
- wallet entry
- profile/account area
- support/help entry
- service-specific journeys

### app-client must never include
- partner operations
- captain operations
- field operations
- admin workspace logic
- backend truth
- service repositories
- contract authorship
- alternate design system truth

### app-client design start order
1. global app framing
2. home/service hub
3. notifications / wallet entry / profile entry
4. DSH first slice
5. WLT user-facing finance entry
6. KNZ / ARB / AMN
7. ESF / KWD / MRF / SND
8. shared empty/error/offline states

### recommended first vertical slice
Start with DSH because it forces the richest and most valuable consumer pattern:
- discovery
- selection
- cart
- checkout
- status tracking
- finance coupling

---

## 29. Control-Panel IA

Canonical control-panel top-level sections:
- dashboard
- operations
- finance
- catalogs
- support
- partners
- marketing
- community-services
- control

Control children:
- platform
- administration
- governance
- hr

### community-services section
`community-services` is the IA area for:
- `esf`
- `kwd`
- `mrf`
- `snd`

This is a control-plane grouping decision, not a reason to merge backend services into one service.

---

## 30. DSH Service Lock Highlights

DSH is the most detailed current service and should be treated as the strongest candidate for first deep extraction and implementation patterning.

### DSH identity
DSH is the core delivery and shopping service.
It is a PAID service and all financial effects route through WLT only.

### DSH key realities
- multiple delivery patterns may exist
- partner controls store delivery-mode configuration within policy constraints
- customer-facing subscription naming uses one approved product family naming direction
- WLT, ARB, geolocation, notifications, and quick-reply communication are critical integrations

### DSH chat/media highlights
Customer-facing communication should support richer confidence-oriented media where applicable, including image attachment/capture and other communication modes appropriate to the journey.

### DSH commercial policies
Commercial policies such as commissions, incentives, settlements, captain payouts, and field payouts must be policy-driven, governable, previewable, and WLT-integrated.

### DSH operational policy highlights
Current reference material strongly supports the need for:
- service-level time targets
- compensation policy
- penalty policy
- edge-case handling
- enhanced privacy messaging
- unified wallet/loyalty interpretation where approved

### DSH interpretation rule
Do not treat DSH as just one screen set.
It is the service most likely to define the first strong reusable execution pattern for the platform.

---

## 31. Quality Bars

### Structural quality
A feature fails if it works while violating ownership.

### UX quality
A flow fails if the user cannot quickly understand what to do next.

### State quality
Every important journey must account for loading, empty, error, offline, disabled, and success conditions.

### Financial quality
Any financial behavior outside WLT is unacceptable.

### Direction quality
RTL-first and ar/en support are mandatory.

### Maintainability quality
No duplicate truth, no hidden ownership, no local convenience architecture.

### Scalability quality
The structure must survive new services, flows, and screens without collapsing into ambiguity.

---

## 32. Phase-1 Execution Direction

Phase 1 is not broad platform explosion.
Phase 1 is foundation correctness first.

### Phase-1 must achieve
- ownership clarity
- correct package interpretation
- app-shell discipline
- ui-kit sovereignty discipline
- service-owned flow discipline
- contract/client discipline
- WLT-only finance interpretation
- actor capability lock understanding

### Recommended phase-1 execution style
- foundations first
- one controlled path second
- pattern confirmation before expansion

### Recommended first controlled path
A strong recommended bias is:
- shared foundations
- app-client/webapp consumer equivalence
- control-panel IA framing
- DSH vertical slice
- WLT-coupled payment/finance entry discipline where needed

---

## 33. Open Areas

The following may still remain open until explicitly locked later:
- exact first implementation milestone breakdown
- exact service-by-service implementation order beyond initial controlled path
- deeper low-level engineering design
- full contract detail
- exhaustive runtime-local orchestration detail

These must not be silently assumed.

---

## 34. What Must Never Happen Again

The following are explicitly rejected as operating models:
- creating alternative repo roots for convenience
- treating `bthwani-suite` as reference only while real work happens elsewhere
- introducing alternate package names that compete with canonical ones
- merging distinct services under convenience umbrella services like `community-service`
- adding gateway/auth/notification services as canonical truth without explicit approved architecture decision
- creating documentation roots outside the approved repo/package/document structure as new truth centers

---

## 35. Final Execution Rule

Build inside the approved repo, inside the approved ownership model, under the approved service/surface interpretation, with WLT as the only financial path, and with app-client/webapp treated as one functional consumer surface.

Any solution that breaks those rules is incorrect, even if it appears productive in the short term.

---

## 36. Final Summary

This document should now be treated as the single-file operational reference for:
- product/platform understanding
- service/surface relationships
- repo ownership
- architecture guardrails
- technical standards
- DSH-first design/development direction
- quality discipline
- phase-1 execution boundaries

It is the normalized answer to scattered notes, conflicting structures, and duplicated summaries.
