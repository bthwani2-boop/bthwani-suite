# BTHWANI GUIDE — Full Unified Governing & Execution Reference

## 1. Canonical Status And Authority

### 1.1 Purpose

This file is the constitutional guide for work inside `bthwani-suite`.

It defines:

- repo sovereignty
- naming law
- ownership law
- boundary law
- lifecycle order
- evidence and adoption law
- donor consultation law
- companion-document precedence

It does not replace runbooks, gates, or phase manuals.
It governs them.

### 1.2 Authority Resolution

Resolve authority in this order:

1. current verified repo reality
2. repo-local approved governance artifacts
3. this guide for long-term law, ownership, naming, and phase legality
4. `docs/bootstrap/BTHWANI GUIDE — Phase Bootstrap Runbook.md` for literal bootstrap execution order in Phases `00` through `07`
5. `docs/bootstrap/BTHWANI GUIDE — Bootstrap Gate Checklists.md` for bootstrap gates in Phases `00` through `07`
6. `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md` for literal execution across Phases `08` through `18`
7. `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md` for literal execution across Phases `19` through `24`
8. `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md` for gates across Phases `08` through `24`
9. `docs/execution/phases/PHASE_00_REPO_RESET_DECISION.md` through `docs/execution/phases/PHASE_27_NEXT_SERVICE_REPEAT.md` for exact phase manuals
10. donor material from `bthfinal` as evidence only

Current architecture-lock questions resolve first through `governance/ARCHITECTURE_LOCK.md` as a repo-local approved governance artifact.

If a companion document violates naming law, ownership law, boundary law, or phase law, this guide wins.

### 1.3 Current Verified Repo Reality

Current verified repo realities include:

- root workspace shell files already exist: `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, and `tsconfig.json`
- approved app shells already exist under `apps/mobile/` and `apps/web/`
- `packages/ui-kit/` already exists
- `packages/surfaces/` already exists and currently serves preview-stage work
- `contracts/master/` already exists
- `governance/ARCHITECTURE_LOCK.md` now records the current approved architecture lock for workspace foundation, canonical surface set, canonical clean service set, ownership split, and `wlt`-owned rates capability isolation
- `runtime/` does not exist yet
- the current first governed service is `dsh`
- `docs/services/dsh/` already contains first-service foundation artifacts
- `kdt/factory/dsh/` already contains detailed packs through the current screen-purpose band

### 1.4 Interpretation Rule

Historical statements such as "do not create yet" remain phase-timing law.
They are not rollback instructions.

Rules:

- do not force the repo backward because an earlier phase described a smaller shell
- existing lawful post-bootstrap artifacts do not retroactively invalidate bootstrap law
- revise companions when repo reality advances materially so future readers are not asked to decode stale future-tense guidance

## 2. Repo Sovereignty And Core Strategy

### 2.1 Repo Sovereignty Law

`bthwani-suite` is the active clean build line.

`bthfinal` is a frozen donor and reference source.

This means:

- the target repo owns current naming truth
- the target repo owns current ownership truth
- the target repo owns current structure truth
- the donor repo may be inspected, traced, compared, and selectively extracted from
- the donor repo may not define the clean repo by force

### 2.2 Clean Build-Line Decision

The canonical migration decision model is:

- new repo = clean build line
- donor repo = reference only
- transfer = selective and classified
- default adoption decision = `REBUILD_CLEAN`

Do not:

- copy donor apps or services blindly
- copy donor packages blindly
- let donor naming leak into clean targets
- treat donor structure as the default clean structure

### 2.3 Canonical Lifecycle Order

The canonical lifecycle order is:

1. repo law and ownership
2. service truth
3. surface responsibility and journey truth
4. screen inventory and screen purpose
5. screen-driven UI Kit expansion and state coverage
6. Screen/API Matrix and Gap Map
7. contract update
8. generation and verification
9. binding
10. runtime truth and production-like proof
11. evidence seal and next-service unlock

### 2.4 Hard Prohibitions

Do not:

- rebuild by copying donor entropy into the target repo
- start multiple deep service tracks before the current service is sealed
- start with API-first rebuild
- start with binding-first rebuild
- start with runtime-first rebuild
- let app shells own service truth
- let fixtures or static assets act as canonical runtime truth
- bypass the canonical ownership and binding chain on lawful operation paths
- claim proof levels that the current phase has not actually earned

## 3. Naming And Surface Law

### 3.1 Approved Surface Registry

The approved internal surface set is:

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `control-panel`
- `webapp`
- `website`

No additional internal surface becomes canonical unless repo-local governance explicitly approves it.

### 3.2 Current First-Service Lock

The current governed first service is:

- `dsh`

Rules:

- all other services remain deferred until `dsh` is sealed with evidence
- service-order decisions remain formal artifacts, not chat assumptions

### 3.3 Internal Name vs Visible Label vs IA Domain

Keep these layers distinct:

- internal name = code and filesystem identity
- visible label = user-facing label
- IA domain = architectural or navigation grouping

Canonical example:

- internal name = `control-panel`
- visible label = `Control Panel`
- IA domain = `Operations`

Rules:

- code, paths, contracts, ownership, and package references use internal names
- UI copy and navigation labels use visible labels
- IA domains do not replace internal names in filesystem or architecture

### 3.4 Control-Panel IA Law

The top-level IA for `control-panel` is:

- Dashboard
- Operations
- Finance
- Catalogs
- Support
- Partners
- Marketing
- Control

Rules:

- `control-panel` is one web app, not a cluster of admin apps
- the IA items above are domains, not application roots
- `Control` is an administrative zone, not a competing daily-ops surface equal to `Operations`, `Finance`, `Catalogs`, or `Support`

### 3.5 Finance vs WLT Separation

Keep these roles distinct:

- `Finance` = visible financial workspace inside `control-panel`
- `WLT` = backend financial service and money-moving runtime path

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

- `WLT` is not a primary navigation section inside `control-panel`
- `Finance` may expose views, approvals, monitoring, and operator actions
- money-moving behavior routes through `WLT` only
- other services may not duplicate `WLT` logic internally
- no side-money path, direct financial write path, or alternate financial runtime path may exist outside `WLT`
- companion operating-law details live in `governance/PLATFORM_OPERATING_MODEL.md`

### 3.6 Mutable Policy Through `VAR_*`

All mutable operating policy must be governed through `VAR_*` rather than hardcoded into execution logic.

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

Required capabilities:

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

- mutable operating policy may not be buried inside executable code
- override precedence is part of platform law, not an implementation preference
- if a policy needs to change without a code redeploy, it belongs in `VAR_*`

### 3.7 Cross-Surface Service Attachment Law

Platform-wide service-to-surface attachment is governed centrally.

Rules:

- `app-client` and `webapp` are one functional client surface with different shells
- `website` is marketing or informational by default, not a primary operating surface unless governed evidence proves otherwise
- `dsh` is a multi-surface service spanning `app-client`, `app-partner`, `app-captain`, `app-field`, `webapp`, and `control-panel`
- `knz` does not gain delivery or captain surfaces
- `amn` attaches to client, captain, web, and control-panel operation only
- `arb` attaches to client, partner, field, web, and control-panel operation only
- `wlt` is the only platform financial path and may be administered from `control-panel` without creating a second money-moving runtime
- deferred services may inherit this law without gaining implementation authorization from it alone
- the canonical operating matrix lives in `governance/PLATFORM_OPERATING_MODEL.md`

### 3.8 Typed App Account Gate Law

Typed actor apps must remain explicitly gated by approved type fields.

Current approved gates:

- `app-partner` -> `partner_type` -> `DSH` or `ARB`
- `app-field` -> `field_type` -> `DSH` or `ARB`
- `app-captain` -> `captain_type` -> `DSH` or `AMN`

Rules:

- a typed account may not operate in multiple governed service types at the same time unless governance is amended first
- entitlements, activation, and route access must stay consistent with the approved type field and `control-panel` activation rules
- if a new typed actor gate is needed later, it must enter governance before it enters implementation

### 3.9 Catalogs vs Partners vs Marketing Separation

Keep these ownership zones distinct:

- `Catalogs` = product truth
- `Partners` = owner or store truth
- `Marketing` = promotional truth

This means:

- core product attributes and core product imagery belong to `Catalogs`
- store ownership, onboarding, and partner truth belong to `Partners`
- offers, banners, campaigns, and promotional emphasis belong to `Marketing`

### 3.10 app-field Classification Law

`app-field` is an approved official surface.
It may be `REQUIRED`, `OPTIONAL`, or `OUT` per service, but it may not be ignored.

Rules:

- every service must classify `app-field` explicitly during Phase `10`
- if platform operating law already records `app-field` participation for a service, downstream service packs must remain consistent with that law unless governance is amended first
- if `app-field` is `REQUIRED` or `OPTIONAL`, downstream journey, screen, API, and runtime work must account for it
- if `app-field` is `OUT`, the reason must be recorded explicitly

### 3.11 Donor Name Normalization Law

When donor artifacts use old internal names, normalize them in clean outputs as follows:

- `mcpw` -> `control-panel`
- `app-user` -> `app-client`

Preserve donor names only in source trace when accuracy requires it.

## 4. Ownership, Boundaries, And Workspace Law

### 4.1 Ownership Model

Ownership is explicit by decision right and artifact boundary.

Use these ownership roles:

- repo governance owner: phase legality, evidence law, companion precedence, repo boundary law
- UI Kit owner: tokens, spacing, typography, direction, primitives, shared state shells
- contract owner: canonical contract law inside `contracts/master/`
- service owner: actors, operations, states, surface participation, service non-goals
- surface delivery owner: thin app-shell delivery only
- runtime owner: runtime truth wiring, mode policy, seed boundaries, availability behavior

### 4.2 Conflict Resolution Order

If ownership conflicts arise, resolve them in this order:

1. repo governance owner for phase legality
2. service owner for service truth
3. contract owner for contract law
4. UI Kit owner for shared design-system law
5. runtime owner for runtime truth behavior
6. surface delivery owner for thin delivery implementation

### 4.3 Boundary Law

Use these boundaries strictly:

- services own service truth
- apps deliver surfaces and remain thin
- packages own shared reusable patterns and utilities
- contracts own API law
- runtime owns runtime-truth execution behavior
- screen truth belongs to the owning service, not the app shell

Rules:

- `control-panel` may not become a convenience catch-all for unowned service behavior
- app shells may not redefine service truth
- packages may not silently absorb service-specific truth as if it were shared law
- cross-service work must be classified into `_shared` or `_cross-service`

### 4.4 Clean Tree Exclusions

Forbidden inside the live clean tree:

- `reference/`
- `archive/`
- `quarantine/` as live product roots
- copied donor subtrees kept for convenience
- `misc/`, `common/`, or `helpers/` roots without explicit ownership

Historical material may exist in evidence or detached archival references, but not as live product-tree content.

### 4.5 Workspace And Tooling Law

The official workspace tooling stack is:

- `pnpm`
- `Nx`
- `TypeScript`

Rules:

- root `package.json` and root `pnpm-lock.yaml` are the canonical home for workspace toolchain truth
- the currently governed workspace toolchain versions are `node`, `pnpm`, `nx`, and `typescript`
- run workspace tasks with `pnpm nx ...`
- installs that change the workspace dependency graph must start from the repo root only
- app roots and package roots are not canonical install roots for workspace graph changes
- local `node_modules/` folders under apps or packages are install artifacts of the workspace, not separate ownership truth
- do not treat package-local `node_modules/` as permission to manage a second dependency graph from that subtree
- use `project.json` only for real apps, packages, or services
- keep TypeScript strictness enabled unless governance explicitly changes it
- use `tools/` for governed workspace tooling only
- path aliases do not replace ownership or package-boundary discipline

Toolchain ownership rules:

- no app or package may silently redefine the canonical `node`, `pnpm`, `nx`, or `typescript` version for the workspace
- if a workspace infrastructure version changes, update the root toolchain truth first instead of normalizing drift through a leaf package
- package-local support dependencies do not become workspace toolchain truth just because they currently exist in one package

Mobile workspace execution rules:

- the current mobile app roots are shell packages, not standalone Expo ownership roots
- no app root may become the canonical install or run root for Expo or React Native by convenience
- Expo Go legality in screen phases governs preview timing only; it does not grant app-local ownership of installs or runtime tooling
- until a lawful mobile runtime phase explicitly opens, do not add ad hoc Expo install or run workflows under app roots as if they were canonical
- when lawful mobile execution is introduced later, the canonical run entrypoints must be repo-root owned commands, targets, or governed scripts first; app-local wrappers are secondary only if they do not redefine toolchain truth

Surface shell and preview execution rules:

- web and mobile surfaces follow the same shell-readiness law once a surface is classified as `REQUIRED` or `OPTIONAL`
- shell readiness may prepare boot, navigation, theme, direction, and repo-root owned serve or build entrypoints before candidate screens exist
- shell browseability or smoke-build success proves shell integrity only; it does not prove screen readiness, binding, runtime truth, or production-like behavior
- web and mobile shell entrypoints must remain repo-root owned commands, targets, or governed scripts rather than app-root sovereignty

EAS Build future ownership rule:

- `EAS Build`, if adopted later, is a mobile packaging or distribution path only
- `EAS Build` is not a prerequisite for shell readiness, Journey Lock, or Phase `12` preview
- `EAS Build` does not by itself raise proof level to binding, runtime truth, or production-like verification
- when adopted later, `EAS Build` must be invoked through workspace-governed commands, Nx targets, or scripts first; app-local wrappers are secondary only

React / React Native / Expo central future ownership rule:

- during bootstrap and shell-first phases, `react`, `react-native`, and `expo` may appear as support dependencies in leaf apps or packages where technically required, but no leaf app or leaf package may define or redefine the canonical workspace version policy for them
- no app or package may act as an independent authority for `react`, `react-native`, or `expo`
- no app-local upgrade, downgrade, or SDK transition is allowed as a sovereignty decision
- canonical version truth for these packages must remain workspace-governed and approval-driven
- when lawful mobile runtime ownership opens, version policy, upgrade policy, and SDK policy for these packages must be defined from the workspace governance path first
- app-level divergence is forbidden unless an explicit approved exception is recorded in repo governance

### 4.6 Service Artifact Layer Split

Use two service artifact layers on purpose.

`docs/services/<service>/` owns:

- stable service-foundation summaries
- actor, operation, and surface baseline truth
- readable service reference material

`kdt/factory/<service>/` owns:

- requests
- working packs
- exports
- evidence
- phase indexes
- later execution truth after bootstrap foundation

## 5. Companion Document System

### 5.1 Main Guide Role

This guide owns:

- law
- naming
- ownership
- phase legality
- boundary rules
- adoption rules

It should remain concise, stable, and referential.

### 5.2 Bootstrap Companion Set

Bootstrap execution is split across:

- `docs/bootstrap/BTHWANI GUIDE — Phase Bootstrap Runbook.md`
- `docs/bootstrap/BTHWANI GUIDE — Bootstrap Gate Checklists.md`
- `docs/execution/phases/PHASE_00_REPO_RESET_DECISION.md`
- `docs/execution/phases/PHASE_01_GOVERNANCE_FREEZE.md`
- `docs/execution/phases/PHASE_02_REALITY_INTAKE.md`
- `docs/execution/phases/PHASE_03_PLATFORM_VALUE_LOCK.md`
- `docs/execution/phases/PHASE_04_SERVICE_ORDER.md`
- `docs/execution/phases/PHASE_05_MASTER_FOUNDATION_MINIMAL.md`
- `docs/execution/phases/PHASE_06_UI_KIT_FOUNDATION.md`
- `docs/execution/phases/PHASE_07_FIRST_SERVICE_FOUNDATION.md`

### 5.3 Post-Bootstrap Companion Set

Post-bootstrap execution is split across:

- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`
- `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md`
- `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md`
- `docs/execution/phases/PHASE_08_ACTOR_CONTEXT_LOCK.md`
- continuing through `docs/execution/phases/PHASE_27_NEXT_SERVICE_REPEAT.md`

### 5.4 Companion Precedence

Use this split deliberately:

- main guide = constitutional law
- runbooks = cross-phase execution grammar
- gate documents = pass or fail thresholds
- phase manuals = literal phase-by-phase execution order

### 5.5 How To Use The Stack

For any serious work:

1. confirm the lawful phase in this guide
2. open the companion runbook for the current band
3. open the matching phase manual
4. execute the matching gate before claiming completion
5. update `docs/services/<service>/` and `kdt/factory/<service>/` in the correct layer

## 6. Lifecycle Bands And Phase Ladder

### 6.1 Bootstrap Band: Phases 00 Through 07

- Phase `00`: lock the clean build-line decision
- Phase `01`: freeze governance before structural growth
- Phase `02`: capture current repo and donor reality
- Phase `03`: lock platform value and non-goals
- Phase `04`: select exactly one first service
- Phase `05`: lock minimal master naming and contract governance
- Phase `06`: build UI Kit foundation only
- Phase `07`: lock the first-service foundation only

Execution authority:

- bootstrap runbook
- bootstrap gate checklist
- phase manuals `PHASE_00` through `PHASE_07`

### 6.2 Service-Truth And Screen-Law Band: Phases 08 Through 14

- Phase `08`: lock actors and visibility contexts
- Phase `09`: lock canonical operations before screens
- Phase `10`: lock surface responsibility and activation waves
- Phase `11`: lock journeys before candidate screens
- Phase `12`: inventory and rationalize candidate screens
- Phase `13`: lock family, purpose, CTA, entry, exit, and required states
- Phase `14`: compress routes, steps, and decision noise

Execution authority:

- generic screen execution runbook
- post-bootstrap gate pack
- phase manuals `PHASE_08` through `PHASE_14`

### 6.3 Screen-Driven Expansion And Contract-Demand Band: Phases 15 Through 18

- Phase `15`: grow UI Kit only from real retained screens
- Phase `16`: complete state coverage
- Phase `17`: map screen-proven API demand
- Phase `18`: convert API demand into explicit contract gaps

Execution authority:

- generic screen execution runbook
- post-bootstrap gate pack
- phase manuals `PHASE_15` through `PHASE_18`

### 6.4 Contract-To-Bound-Chain Band: Phases 19 Through 21

- Phase `19`: update the canonical contract only after screen proof exists
- Phase `20`: generate and verify derived layers
- Phase `21`: bind screens through the canonical chain

Execution authority:

- binding and runtime execution runbook
- post-bootstrap gate pack
- phase manuals `PHASE_19` through `PHASE_21`

### 6.5 Runtime Proof And Closure Band: Phases 22 Through 27

- Phase `22`: lock runtime truth sources and boundaries
- Phase `23`: lock runtime mode policy and proof language
- Phase `24`: run production-like verification
- Phase `25`: gather final evidence and guards
- Phase `26`: quarantine legacy leftovers safely
- Phase `27`: unlock the next service only after seal proof exists

Execution authority:

- binding and runtime execution runbook for Phases `22` through `24`
- post-bootstrap gate pack for Phases `22` through `24`
- phase manuals `PHASE_22` through `PHASE_27`

## 7. Artifact, Evidence, And Adoption Law

### 7.1 Mandatory Working Header

Every serious task, pack, review, extraction, or audit should state:

- `WorkMode`
- `CurrentPhase`
- `TargetService`
- `RequestType`
- `PrimaryRepo`
- `LegacyRepo`
- `PackStatus`
- `BlockingGaps`
- `NextAllowed`

If a value is unknown, mark it `TBD` and explain why.

### 7.2 Request Classification

Every serious request must declare one primary request type.

Approved classifications are:

- `bootstrap_law_work`
- `bootstrap_artifact_work`
- `service_operations_extract`
- `service_screen_logic_extract`
- `service_surface_map_extract`
- `service_flow_extract`
- `screen_api_matrix_extract`
- `binding_chain_extract`
- `runtime_truth_extract`
- `contract_extract`
- `ui_pattern_extract`
- `violation_audit`
- `anti_pattern_pack`
- `prevention_guidance_pack`
- `cross_service_pack`
- `target_fit_review`
- `source_to_target_pack`

### 7.3 Evidence Markers

Serious artifacts must distinguish between:

- `confirmed fact`
- `inferred conclusion`
- `tentative interpretation`
- `[TBD]`
- `rejected carryover`
- `blocked`

### 7.4 Target-Fit Law

No output is implant-ready until it is checked against:

- correct target path
- naming alignment
- ownership alignment
- duplication risk
- phase legality
- package or service boundary fit

### 7.5 Implant Decision Matrix

Every serious extracted or adapted candidate must be classified as one of:

- `COPY_AS_IS`
- `EXTRACT_PARTIAL`
- `REBUILD_CLEAN`
- `REFERENCE_ONLY`
- `REJECT`

Default to `REBUILD_CLEAN` unless the carryover is small, isolated, low-risk, naming-clean, and target-fit.

### 7.6 Pack Roots

Service-scoped pack material belongs under:

- `kdt/factory/<service>/requests/`
- `kdt/factory/<service>/packs/`
- `kdt/factory/<service>/exports/`
- `kdt/factory/<service>/evidence/`
- `kdt/factory/<service>/index/`

Shared roots are:

- `kdt/factory/_shared/`
- `kdt/factory/_cross-service/`

### 7.7 Evidence Root And Gate Quality

Use this evidence root pattern for governed proof artifacts:

- `kdt/volatile/registry/runs/{SESSION_ID}/`

No phase passes on file existence alone.
Gate review must confirm:

- artifact existence
- non-placeholder content
- sufficient phase depth
- adjacent artifact coherence
- target-fit where required
- absence of forbidden early work

## 8. Preview, Binding, Runtime, And Proof Law

### 8.1 Candidate vs Bound Screen

Keep these states distinct:

- candidate screen = inventory, preview, rationalization, and purpose-lock stage
- bound screen = connected to the canonical generated and runtime-backed chain

Candidate screens may begin only after Journey Lock.
Bound screens may begin only in Phase `21`.

### 8.2 Shell, Preview, And Packaging Distinction

Keep these states distinct:

- `shell readiness`
- `visual-only preview`
- `limited-api preview`
- `canonical local truth`
- `production-like proof`
- `packaging build`

Rules:

- `shell readiness` means the target web or mobile shell can boot and host lawful preview entrypoints; it does not mean screen truth is ready
- `packaging build` means a web or mobile artifact can be produced for integrity or distribution review; it does not upgrade proof level by itself
- Expo Go and browser preview are preview tools, not proof instruments by themselves
- `EAS Build` is a packaging or distribution tool, not a proof instrument by itself

### 8.3 Runtime Truth Classification

Every preview or runtime path should be classified as one of:

- `fixture`
- `simulated response`
- `runtime seed`
- `limited-api preview`
- `canonical local truth`
- `production-like proof`

### 8.4 Proof Claim Restriction Rule

Do not claim:

- `end-to-end working` from fixture preview alone
- `runtime verified` from simulated responses alone
- `production-like` when a critical participating surface is absent
- `bound` when raw fetch remains on the canonical path

## 9. Donor Extraction And Quarantine Protocol

### 9.1 Donor Consultation Order

Use this order:

1. define what the target repo needs
2. locate a specific donor candidate for that need
3. trace dependencies and ownership
4. classify the candidate
5. normalize naming and remove donor noise
6. run target-fit review
7. package, rebuild, reference, or reject

### 9.2 Carryover Eligibility Test

Direct carryover is eligible only when the candidate is:

- small
- isolated
- clearly understood
- low-dependency
- naming-normalized
- ownership-clear
- free of hidden runtime assumptions
- able to pass target-fit review

If these conditions fail, prefer `EXTRACT_PARTIAL`, `REFERENCE_ONLY`, or `REBUILD_CLEAN`.

### 9.3 Quarantine Law

When old material must be retired:

- move it instead of deleting blindly
- keep quarantine outside the live clean tree
- scan for live references
- verify no active path still imports or depends on the quarantined material

### 9.4 Final Operating Rule

Build the new repository from clean law and real service truth.
Use the donor repo as a quarry of evidence, not as the source of authority.

## 10. Canonical Glossary

Use these terms consistently:

- `Reality Intake` = governed census of actual donor and target truth
- `Value Lock` = explicit statement of what is worth rebuilding now and what is not
- `Actor/Context Lock` = explicit actor visibility and surface participation model
- `Operation Lock` = official service operation set before screen growth
- `Surface Responsibility Lock` = explicit mapping of operations to surfaces and waves
- `Journey Lock` = explicit happy, failure, recovery, and support journeys before candidate screens
- `Screen Inventory` = complete catalog of candidate screens and related units
- `Screen Rationalization` = keep, merge, convert, internal, or move-to-legacy classification of candidates
- `Screen Purpose Lock` = family, purpose, CTA, entry, exit, and required-state definition per retained candidate
- `Flow Compression` = removal of unnecessary steps, routes, or decision points
- `Screen/API Matrix` = screen-proven API demand register
- `Gap Map` = register of contract underfit, overfetch, missing operations, or drift
- `Binding Chain` = canonical path from screen through API, service, repository, and runtime truth
- `Preview Registry` = phase-correct registry of preview routes and fixture locations before binding
- `Runtime Truth` = the real operational truth source used by lawful bound paths
- `Minimal Necessary Runtime` = the lowest runtime mode sufficient for the current phase
- `Evidence Pack` = proof set that supports phase completion or service seal
- `Legacy Quarantine` = detached retirement zone for old material kept outside the live clean tree
