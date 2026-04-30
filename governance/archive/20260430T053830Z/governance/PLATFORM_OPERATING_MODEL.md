# PLATFORM_OPERATING_MODEL

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 05 - Master Foundation Minimal`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 05 active`
- BlockingGaps: `Only dsh is currently unlocked for governed execution; other services remain deferred for implementation packs, contracts, and runtime work`
- NextAllowed: `Use this as platform governance and cross-service operating law only; do not treat it as permission to implement every listed service`

## Purpose

This file locks the platform-wide operating model that sits above any individual surface shell or service pack.
It governs the financial path, mutable operating policy, control-panel role, cross-surface service attachment, and typed app account gates.
It does not unlock multi-service implementation beyond the current lawful service track.

## Core Operating Split

- services own business truth
- apps own consumption or operator experience
- `control-panel` owns administration, oversight, approvals, and policy operation
- `webapp` is the web shell of the client surface, not an independent service
- `website` is a marketing or informational surface, not a primary operating surface unless later governed evidence proves otherwise

## WLT-Only Financial Path Law

`WLT` is the only financial path for the platform whenever the platform itself carries financial effect.

Financial effect includes:

- collections
- fees
- commissions
- deposits
- refunds
- settlements
- disbursements
- ledger entries
- closing
- reconciliation

Rules:

- real money-moving behavior must route through `WLT` only
- `Finance` inside `control-panel` is an administrative and operational workspace, not an alternate money-moving owner
- non-financial services may expose finance-related views or actions only as approved user or operator entry into `WLT`

Forbidden:

- direct financial writes from any service other than `WLT`
- any direct financial handling from a surface, route, worker, or job outside `WLT` contracts
- any side-money channel or alternate financial path outside `WLT`

## Mutable Policy Law (`VAR_*`)

All mutable operating policy must be governed through `VAR_*`, not hardcoded inside execution logic.

This includes:

- limits
- fees
- timing windows
- providers
- retries and reattempt rules
- notifications
- distribution policies
- OTP policies
- business and operational policies

Required capabilities for every `VAR_*` family:

- enable or disable
- audit trail
- preview
- rollback

Override precedence from highest to lowest:

1. Store
2. Subcategory
3. Category
4. Zone
5. City
6. Region
7. Global

Rules:

- the official override precedence is mandatory
- mutable policy may not be buried in executable code
- preview and rollback are governance requirements, not optional tooling extras

## Control-Panel Domain Law

The top-level IA inside `control-panel` is:

- Dashboard
- Operations
- Finance
- Catalogs
- Support
- Partners
- Marketing
- Control

The `Control` domain contains:

- Platform
- Administration
- Governance
- HR

Rules:

- `control-panel` is one web app, not a cluster of separate admin apps
- the sections above are domains inside the same app
- `Finance` is the visible operational finance workspace; it does not replace `WLT`
- activation of `app-partner`, `app-captain`, and `app-field` is controlled from `control-panel` through approved code-based activation flows

## Approved Surface Interpretation

The active approved surfaces are:

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `webapp`
- `website`
- `control-panel`

Interpretation rules:

- `app-client` and `webapp` are one functional client surface with different shells
- `control-panel` is the administrative and operational surface
- `website` is marketing or informational by default and is out of primary operations unless later evidence proves a governed operating need
- a service may attach only to the surfaces justified by its operating model; unused approved surfaces stay out for that service

## Service-To-Surface Operating Matrix

This section locks platform intent and boundary truth for service attachment.
It does not authorize implementation packs for every service; `dsh` remains the current active service track.

### `dsh`

Surfaces:

- `app-client`: customer ordering, tracking, and payment entry into `WLT`
- `app-partner`: order management, acceptance, and preparation
- `app-captain`: execution, delivery, and proof of delivery
- `app-field`: partner onboarding and field activation support for `dsh`
- `webapp`: same client functional surface with a web shell
- `control-panel`: operations, support, partners, and finance administration

Rules:

- `dsh` is a multi-surface service, not a client-only service
- any platform financial effect inside `dsh` routes through `WLT` only

### `knz`

Surfaces:

- `app-client`: browsing, ads, and interaction
- `webapp`: same client functional surface with a web shell
- `control-panel`: governance and content or catalog oversight

Rules:

- no delivery platform for `knz`
- no `app-captain` role for `knz`
- no platform C2C settlement or platform wallet payment for item value
- `knz` currently carries no platform financial effect; any future platform financial effect must route through `WLT` only

### `amn`

Surfaces:

- `app-client`: ride or service request
- `app-captain`: trip execution
- `webapp`: same client functional surface with a web shell
- `control-panel`: policy, zone, and operational oversight

Rules:

- any platform financial effect inside `amn` routes through `WLT` only

### `arb`

Surfaces:

- `app-client`: booking, deposit, disputes, and closeout
- `app-partner`: provider or partner-side operation
- `app-field`: field onboarding and partner activation support for `arb`
- `webapp`: same client functional surface with a web shell
- `control-panel`: disputes, audit, policy, and operations

Rules:

- any deposit, refund, or settlement controlled by the platform routes through `WLT` only
- customer settlement mode may be `WLT`-mediated, mixed `WLT` plus cash, or cash-only per approved service policy; cash handling does not authorize an alternate in-platform financial channel outside `WLT`

### `wlt`

Surfaces:

- `app-client`: wallet, top-up, history, payments, and refunds subject to policy
- `app-partner`: financial capabilities allowed by role and permission
- `app-captain`: financial capabilities allowed by role and permission
- `app-field`: financial capabilities allowed by role and permission
- `webapp`: same client functional surface with a web shell
- `control-panel`: financial administration and oversight only

Rules:

- `WLT` is the sole platform financial path
- `control-panel` may administer `WLT`, but it does not become a second financial runtime

Rates capability split:

- donor `exchangeprice` is adopted as a `wlt`-owned rates capability, not as an independent financial owner
- `wlt-core` owns `ledger`, `balances`, `settlement`, and `payouts`
- `wlt-rates` owns read-only exchange-rate access and snapshot records only
- `wlt-rates-adapter` owns provider fetch and synchronization only
- `wlt-rates-store` owns isolated rate storage only

Forbidden:

- any direct `wlt-rates*` access to wallet-sensitive logic or storage beyond approved interfaces
- any ledger, balance, settlement, or payout ownership outside `wlt-core`
- any use of exchange-rate plumbing to create a side-money path or alternate financial write path

### `esf`

Surfaces:

- `app-client`: service consumption, matching, request, or support as defined by service truth
- `webapp`: same client functional surface with a web shell
- `control-panel`: catalog or administrative support

Rules:

- `esf` is free
- `esf` has no independent financial channel
- if a future platform financial effect is ever approved, it must route through `WLT` only

### `kwd`

Surfaces:

- `app-client`: jobs, search, and ads
- `webapp`: same client functional surface with a web shell
- `control-panel`: catalog or administrative support

Rules:

- `kwd` is free
- any future platform financial effect must route through `WLT` only

### `mrf`

Surfaces:

- `app-client`: reports and safe communication
- `webapp`: same client functional surface with a web shell
- `control-panel`: catalog or administrative support

Rules:

- `mrf` is free
- any future platform financial effect must route through `WLT` only

### `snd`

Surfaces:

- `app-client`: request, matching, or core service consumption
- `app-partner`: provider flows when the approved service model includes them
- `webapp`: same client functional surface with a web shell
- `control-panel`: catalog or administrative support

Rules:

- `snd` is free by default
- `snd` has no independent financial channel unless a future explicit platform decision routes financial effect through `WLT`

## Unspecified Catalog Services

The official service catalog also includes `hr`.
This file does not grant it implicit multi-surface scope or special financial behavior.

Until separate governed law exists for it:

- it remains bound by `governance/SERVICE_CATALOG.md`
- it may not create alternate financial ownership or a side-money path
- it may not infer surface scope merely because other services are defined here

## Typed App Account Matrix

| App | Type Field | Allowed Values | Meaning |
| --- | --- | --- | --- |
| `app-partner` | `partner_type` | `DSH`, `ARB` | Selects whether the partner account operates in `dsh` or `arb` |
| `app-field` | `field_type` | `DSH`, `ARB` | Selects whether the field account operates in `dsh` or `arb` |
| `app-captain` | `captain_type` | `DSH`, `AMN` | Selects whether the captain account operates in `dsh` or `amn` |

Detailed rules:

- `app-partner`: a partner account may be `DSH` or `ARB`, but not both at the same time
- `app-field`: a field account may be `DSH` or `ARB`, but not both at the same time
- `app-captain`: a captain account may be `DSH` or `AMN`, but not both at the same time
- activation and entitlement must stay consistent with `control-panel` approval and code-based enablement flows

## Enforcement Implications

- a finance screen outside `WLT` may orchestrate, approve, monitor, or review, but it may not own money movement
- a service or surface change that introduces mutable fees, limits, provider switches, or OTP logic without `VAR_*` is non-compliant
- a service or surface change that introduces a second financial write path is non-compliant
- a deferred service may inherit governance law from this file, but it may not skip service packs, contracts, or phase gates because of it