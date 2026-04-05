# BTHWANI GUIDE — Full Unified Governing & Execution Reference

## 1. Executive Verdict

### Source status

This guide is derived from an external planning transcript, but that transcript is not itself a canonical execution plan.
The transcript is treated as background reference material rather than an in-repo governing artifact because it mixes:

- direct answers
- repeated expansions
- teaching blocks for a beginner
- multiple rephrasings of the same sequence
- side branches
- temporary local conclusions

### Final verdict

The correct action is not to treat the transcript as the live governing artifact.
The correct action is to preserve it as reference material and maintain this file as the canonical governing plan for this repository.

## 2. Forensic Analysis Of The Source File

### 2.1 What the source file really is

The source material is a planning transcript for rebuilding the platform from absolute zero.
This guide retains the following adopted objectives from that planning work:

- create a new clean repository
- treat the legacy donor repository as a donor/reference source only
- rebuild service-by-service
- design screens and flows before contracts and binding
- update contracts only after UX needs are known
- bind only after contracts are verified
- run production-like verification only near closure
- seal every service with evidence

### 2.2 What is stable and should be preserved

The following ideas are adopted in this rewrite as canonical:

1. Do not repair entropy by copying entropy into a new repository.
2. The old repository should become a donor/reference repo, not the new build line.
3. The build order is not API-first and not binding-first.
4. The correct order is governance -> service truth -> screens/flows -> screen/api matrix -> gap map -> openapi -> generate/verify -> binding -> runtime -> evidence/seal.
5. UI Kit must be founded early, expanded from real screens, then stabilized before wide binding.
6. Work must proceed service-by-service, not by rebuilding the whole platform at once.
7. Extraction from the donor repo must be selective, evidence-based, and mostly `REBUILD_CLEAN` rather than `COPY_AS_IS`.

### 2.3 Structural defects in the source file itself

The source file has these internal defects as a document:

1. It is conversational, not canonical.
2. The same phase sequence is restated many times with different wording.
3. It mixes strategic law, tactical advice, examples, and persuasion in the same stream.
4. It moves across multiple abstraction layers without stable section boundaries.
5. It contains unresolved branches such as:
   - full master vs minimal master
   - UI Kit before screens vs UI Kit with screens
   - old repo reuse vs new repo rebuild
6. It includes several beginner-oriented re-explanations that add teaching value but also add noise.
7. It uses Arabic and English terms interchangeably without a fixed glossary.

### 2.4 Contradictions or ambiguities that must be resolved

This rewrite resolves the major ambiguities as follows:

#### A. Master timing

Resolved rule:

- build `Master Foundation Minimal` first
- do not build `Master Full` first

#### B. UI Kit timing

Resolved rule:

- UI Kit Foundation is built before screens
- UI Kit Expansion happens during screens
- UI Kit Stabilization happens before wide binding

There is no contradiction once foundation, expansion, and stabilization are separated.

#### C. OpenAPI source of truth

Resolved rule:

- old contracts may be referenced
- new canonical contract truth comes only after `Screen/API Matrix` and `Gap Map`
- therefore old OpenAPI is donor evidence, not new sovereignty by default

#### D. Role of the apps in the new repository

Resolved rule:

- apps are delivery surfaces
- services own service logic
- packages own shared reusable primitives and patterns
- contracts own API law
- apps should stay thin and surface-oriented

### 2.5 Terminology worth preserving

The following terms are retained as canonical terminology in this guide:

- Master Foundation Minimal
- Reality Intake
- Value Lock
- Actor/Context Lock
- Operation Lock
- Surface Responsibility Lock
- Journey Lock
- Screen Inventory
- Screen Rationalization
- Screen Purpose Lock
- Flow Compression
- Screen/API Matrix
- Gap Map
- Binding Chain
- Runtime Truth
- Minimal Necessary Runtime
- Evidence Pack
- Legacy Quarantine

## 3. Canonical Strategic Decision

The project should be rebuilt using this model:

- new repo = clean build line
- legacy donor repo = reference only
- transfer = selective and classified
- default migration decision = `REBUILD_CLEAN`

This means:

- no bulk copy of apps
- no bulk copy of services
- no bulk copy of packages
- no blind salvage of UI Kit
- no API-first rebuild
- no binding-first rebuild
- no full-stack-first rebuild

## 4. Repo Role Model

### 4.1 Donor repo

The legacy donor repository is treated as:

- donor evidence
- reference archive
- extraction source
- anti-pattern source
- naming history source
- flow knowledge source

The donor repo is not treated as:

- the new build line
- the new source of truth
- a place for broad future development
- a place for bulk migration from folder to folder

### 4.2 Clean repo

The new repository is treated as:

- the real build line
- the real ownership line
- the real canonical source of truth after adoption
- the clean product tree where no historical residue is allowed inside live structure
- the place where new structure is enforced

### 4.3 Clean Tree Exclusions

The clean repo must not contain historical or ambiguous tree roots inside the live product structure.

Forbidden inside the new tree:

- reference folders
- archive folders
- quarantine folders as product tree roots
- imported old structure copied for convenience
- `misc/`, `common/`, or `helpers/` roots without explicit ownership

Rule:

- historical material may be tracked by evidence, notes, or detached archival references
- historical material must not live inside `apps/`, `services/`, `packages/`, `contracts/`, or `runtime/` as a legacy holding area

### 4.4 Target repo identity

The canonical target repository for this guide is:

- repo name: `bthwani-suite`
- role: clean build line
- default expectation: all new governed implementation work lands here, not in the donor repo

This guide assumes clean build line first, external reference second.

The target repo is also locked to these truths:

- internal surface set: `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, `webapp`, `website`
- final web operational shell: `control-panel`
- final control-plane IA is defined in this guide, not inherited from donor structure
- ownership split: services own service logic, packages own shared reusable patterns, contracts own API law, apps deliver surfaces, runtime owns runtime truth execution

### 4.5 Approved clean surface naming

Use these names in the clean repo:

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `control-panel`
- `webapp`
- `website`

Legacy donor naming may appear only in reference or evidence context.

### 4.6 Internal Name vs Visible Label

Internal names, visible labels, and architectural descriptions must be kept distinct.

Canonical examples:

- internal web app name = `control-panel`
- visible label = `Control Panel`
- architectural description = `task-first control plane`
- internal mobile name = `app-client`
- visible label = `Client App`

Rule:

- code, paths, contracts, ownership, and package references use internal names
- navigation, UI copy, and business-facing labels use visible labels
- visible labels must not replace internal names in architecture or filesystem decisions

### 4.7 Control Panel Primary IA

The primary top-level IA for `control-panel` is:

- Dashboard
- Operations
- Finance
- Catalogs
- Support
- Partners
- Marketing
- Control

Rules:

- `control-panel` is one web app, not a cluster of separate admin apps
- the sections above are IA domains, not separate application roots
- `Control` is a lower-weight administrative zone for general system control and settings
- `Control` is not equal in day-to-day operational weight to `Operations`, `Finance`, `Catalogs`, or `Support`

### 4.8 Finance vs WLT Separation Rule

Finance and WLT must remain distinct in role.

- `Finance` = the visible financial workspace inside `control-panel`
- `WLT` = the backend financial service and money-moving runtime path

Rules:

- `WLT` is not a primary daily navigation section presented as a separate control-panel work area
- `Finance` may expose views, approvals, monitoring, and operator actions
- all money-moving behavior, settlements, ledger changes, payouts, refunds, and financial side effects route through `WLT` only
- other services must not duplicate `WLT` logic internally

### 4.9 Operational Ownership of Product, Partner, and Promotion

Ownership must be split clearly:

- `Catalogs` = product truth
- `Partners` = owner or store truth
- `Marketing` = promotional truth

This means:

- core product attributes and primary product imagery belong to `Catalogs`
- store ownership, partner relationship, onboarding, and partner-side entity truth belong to `Partners`
- featured placement, offers, banners, campaigns, and promotional emphasis belong to `Marketing`

### 4.10 app-field Classification Rule

`app-field` is an official surface.
It may be `REQUIRED`, `OPTIONAL`, or `OUT` per service, but it may not be ignored.

Rules:

- every service must classify `app-field` explicitly during Surface Responsibility Lock
- silence is invalid
- if `app-field` is `REQUIRED` or `OPTIONAL`, downstream journey, screen, API, and runtime work must account for it
- if `app-field` is `OUT`, the reason must be recorded explicitly

### 4.11 Target Repo Structure

Long-term target structure:

```text
bthwani-suite/
   apps/
      mobile/
         app-client/
         app-partner/
         app-captain/
         app-field/
      web/
         control-panel/
         webapp/
         website/
   services/
      <service>/
   packages/
      ui-kit/
      surfaces/
      api-types/
      api-clients/
   contracts/
      master/
   runtime/
      local/
         seed/
   docs/
   governance/
   tools/
   kdt/
      volatile/
         registry/
            runs/
```

### 4.12 Bootstrap Repo Structure

Bootstrap structure for the current initial execution window:

```text
bthwani-suite/
   package.json
   pnpm-workspace.yaml
   nx.json
   tsconfig.base.json
   tsconfig.json
   apps/
      mobile/
      web/
   services/
   packages/
      ui-kit/
   contracts/
      master/
   docs/
      reality-intake/
      platform/
      services/
   governance/
   tools/
   kdt/
      volatile/
         registry/
            runs/
```

Rules:

- this is the bootstrap shell that should be reached by the end of Phase 07
- it is intentionally smaller than the long-term target structure
- individual surface app folders are not required during bootstrap
- `packages/surfaces/` is a target structure element, not a bootstrap requirement
- `runtime/` is not part of the mandatory bootstrap shell for Phases 00-07
- `runtime/` is introduced only when later runtime seed or local stack work is actually justified by post-bootstrap phases

### 4.13 Monorepo Tooling Decision

This guide is not tooling-neutral for bootstrap.

Official decision:

- bootstrap monorepo shell = `pnpm + Nx + TypeScript`

This means:

- `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, and `tsconfig.json` are canonical bootstrap shell files
- `project.json` is introduced when a concrete package, app, or service shell is created
- `tools/` is allowed for cross-workspace tooling only, not as a miscellaneous dump root

## 5. Bootstrap Operational Boundary

### 5.1 Boundary

This guide is the long-term governing reference for the full rebuild lifecycle.

The current initial execution window is narrower:

- this main guide = full governing framework
- bootstrap runbook = exact initial creation order
- bootstrap gate checklists = exit conditions for Phases 00-07 only

Rule:

- Phases 00-07 are the active operational boundary for initial repo creation
- later phases remain governed by this guide, but are not unlocked by bootstrap scaffolding alone
- if a practical execution conflict appears during Phases 00-07, the bootstrap runbook and bootstrap gate checklists take precedence for execution timing and scope, while this guide remains the long-term governing frame

### 5.2 Controlled Parallelism Rule

Allowed parallelism is limited to:

- the current primary service under execution
- UI Kit growth directly demanded by that current service
- shared packages or shared services only when they unblock that current service

Forbidden parallelism:

- deep execution of multiple consumer services at the same time
- multiple binding tracks at the same time
- multiple runtime stacks at the same time
- parallel service waves before the first current service is sealed with evidence

### 5.3 Gate Quality Rule

Gate review must verify more than file existence.

Every gate review must confirm:

- artifact existence
- non-empty content
- non-placeholder content
- sufficient initial depth for the phase
- cross-file consistency
- no contradiction with adjacent governance files

A gate does not pass merely because the named file exists.

### 5.4 Bootstrap Exit Boundary

After gates for Phases 00-07 pass, the repo may proceed to:

- Actor/Context deepening
- Operation Lock refinement
- Surface Responsibility Lock
- Journey Lock
- Screen Inventory

After bootstrap, the repo may not yet proceed to:

- binding
- runtime stack implementation
- generated layers
- master detail build

## 6. Canonical Build Order

This is the stable ordered plan extracted from the transcript.

### Phase 00 - Repo Reset Decision

#### Goal

Fix the strategic decision before any build activity.

#### Actions

- declare the new repo as the build line
- declare the old repo as donor/reference only
- prohibit blind copy
- prohibit big-bang rebuild
- prohibit simultaneous multi-service execution at start

#### Outputs

- repo reset decision note
- donor policy note

### Phase 01 - Governance Freeze

#### Goal

Freeze the minimum laws that prevent early chaos.

#### Actions

- define ownership law
- define scope law
- define repo boundary law
- define execution law
- define evidence law
- define change-entry rules
- define move-don't-delete rule

#### Outputs

- governance core
- scope lock
- evidence root rule
- change entry point law

#### Canonical evidence root

Use this evidence root pattern for governed proof artifacts:

- `kdt/volatile/registry/runs/{SESSION_ID}/`

### Phase 02 - Reality Intake

#### Goal

Understand the donor repo as it is, not as desired.

#### Actions

- census current services
- census current surfaces
- census current screens
- census routes
- census current contracts
- census generated layers
- census package structure
- census service structure
- identify duplication
- identify drift
- identify noise
- identify legacy
- identify runtime truth sources

#### Outputs

- reality report
- repo census
- current services map
- current surfaces map
- current screens inventory
- noise/duplication/drift report
- runtime truth observations

#### Reality Intake Completion Rule

Reality Intake is not complete merely because scaffolding files exist.

Phase 02 exits only when there is actual initial content for:

- current services map
- current surfaces map
- current screens inventory
- noise and drift findings
- runtime truth observations

Scaffolding without content is not completion.

### Phase 03 - Platform Value Lock

#### Goal

Define what is actually worth rebuilding now.

#### Actions

- define core platform value
- define non-goals
- define excluded first-release scope
- define what must remain simple
- define what must complete in 1-2 taps where relevant

#### Outputs

- platform value lock
- service priority rationale and candidate ranking
- non-goals register

#### Boundary note

Phase 03 documents service priority reasoning.
It does not finalize the first service.
The final first-service selection is made in Phase 04.

### Phase 04 - Service Order

#### Goal

Prevent parallel chaos.

#### Actions

- pick the first service only
- justify why it is first
- refuse to start multiple services together

#### Selection criteria

- architectural leverage
- cross-surface significance
- ability to expose real UI Kit needs
- ability to expose real contract needs

#### Outputs

- service build order
- selected first-service identifier and justification

### Phase 05 - Master Foundation Minimal

#### Goal

Establish law before implementation.

#### Actions

- define structure and ownership
- define service catalog
- define operation catalog skeleton
- define surface catalog
- define direction/lang ownership
- define OpenAPI sovereignty rule

#### Outputs

- ownership map
- service catalog
- operation catalog skeleton
- surface catalog
- direction/i18n ownership rule
- openapi sovereignty rule

#### Explicit restriction

Do not expand into full master detail yet.

### Phase 06 - UI Kit Foundation

#### Goal

Create the minimum reusable design system base before screen work.

#### Build now

- tokens
- color system
- typography system
- spacing scale
- radius
- elevation/shadows
- icon policy
- motion basics
- state shells
- RTL/LTR rules
- direction/lang ownership hooks or rules
- base primitives
- layout laws
- basic form patterns
- feedback/status shells

#### Do not fully build yet

- every card type
- every list type
- every sheet type
- every service-specific pattern
- every advanced variant

#### Outputs

- UI Kit Foundation
- primitive components
- state shells
- design token core

### Phase 07 - First Service Foundation

#### Goal

Start one service only with strict scope.

#### Actions

- define service profile
- define primary job
- define secondary jobs
- define non-goals
- define actors
- define surfaces
- define operations
- define shared dependencies

#### Outputs

- service foundation pack

### Phase 08 - Actor/Context Lock

#### Goal

Lock who sees what and where.

#### Actions

- define primary actor
- define secondary actor
- define who must not see the service
- define proper surface per actor
- define visibility rules

#### Outputs

- actor context matrix

### Phase 09 - Operation Lock

#### Goal

Lock official operations before screens.

#### Actions

- define operation name
- define operation purpose
- define primary actor
- define secondary actor if needed
- define state effect
- verify correct service ownership
- verify whether the operation spans more than one surface

#### Outputs

- operations catalog
- status lifecycle

### Phase 10 - Surface Responsibility Lock

#### Goal

Define where each operation lives.

#### Actions

- mark each surface as `REQUIRED`, `OPTIONAL`, or `OUT`
- define entry point
- define ownership
- define why it exists
- define which operation it serves

#### Outputs

- surface matrix
- operation surface coverage

### Phase 11 - Journey Lock

#### Goal

Design the journey before the screen.

#### Actions

- define happy path
- define fast path
- define returning user path if relevant
- define staff path
- define failure path
- define recovery path
- define unavailable/disabled path

#### Outputs

- primary flow map
- staff flow map
- failure/recovery flow map

### Phase 12 - Screen Inventory And Rationalization

#### Goal

Stop screen inflation early.

#### Actions

- inventory all candidate screens
- classify each item as `Keep`, `Merge`, `Convert`, `Internal`, or `Move to Legacy`
- determine whether each item is really a screen, sheet, modal, section, inline step, or state

#### Outputs

- screen catalog
- screen rationalization report

### Phase 13 - Canonical Families And Screen Purpose Lock

#### Goal

Make every screen lawful and obvious.

#### Actions

- assign family
- assign purpose
- assign primary CTA
- assign secondary actions
- define entry and exit
- define required states

#### Typical families

- Entry
- List
- Detail
- Form
- Review/Confirm
- Tracking
- Search/Filter
- Picker
- Settings
- Sheet/Modal Companion

#### Outputs

- screen family map
- screen purpose lock

### Phase 14 - Flow Compression

#### Goal

Reduce routes, steps, and decision points.

#### Actions

- merge excess screens
- convert minor steps into sheets
- hide advanced content
- reduce branching noise

#### Outputs

- flow compression report
- click budget

### Phase 15 - UI Kit Expansion From Real Screens

#### Goal

Let real screens drive reusable patterns.

#### Add only what real screens prove necessary

- card families
- list patterns
- filter/search patterns
- sheet patterns
- review blocks
- tracking patterns
- CTA bars
- header patterns
- section shells
- task-first control-plane patterns
- service reusable patterns

#### Output

- UI Kit Expansion v1

### Phase 16 - State Lock

#### Goal

Complete state coverage before API design.

#### Required state review

- loading
- empty
- filtered empty
- offline
- disabled
- unauthorized
- forbidden
- not found
- upstream error
- validation error
- duplicate submit
- success
- stale data
- archived

#### Output

- state coverage matrix

### Phase 17 - Screen/API Matrix

#### Goal

Allow screens to define API need.

#### Actions

For each screen determine:

- required data
- required actions
- request count
- whether requests are excessive
- whether summary endpoints are needed
- whether action endpoints are needed
- whether aggregation endpoints are needed

#### Outputs

- screen/api matrix

### Phase 18 - Gap Map

#### Goal

Expose what the current contract cannot serve.

#### Questions

- what does the current contract fail to serve?
- where is there overfetch?
- where is there underfit?
- where is a new shape required?
- where is a new operation required?
- where is there drift?

#### Outputs

- gap map

### Phase 19 - Master OpenAPI Update

#### Goal

Update the official contract only after UX demand is known.

#### Actions

- add official operations
- tune schemas
- prevent rogue endpoints
- prevent raw fetch patterns
- unify error shapes

#### Outputs

- openapi change set
- updated master openapi

### Phase 20 - Generate / Verify

#### Goal

Turn the contract into verified generated layers.

#### Actions

- generate api types
- generate api clients
- verify parity
- verify drift
- verify implementation fit
- verify error shapes

#### Outputs

- generated layers
- verify report
- contract parity report

### Phase 21 - Binding Lock

#### Goal

Start real implementation only now.

#### Canonical chain

Screen -> ViewModel/Hook -> API Client -> Proxy if needed -> Controller -> Service -> Repository -> Runtime Truth -> Audit/Trace

#### Law

One operation = one chain.

#### Outputs

- binding chain map
- proxy route map
- viewmodel normalization

### Phase 22 - Runtime Truth Lock

#### Goal

Prevent fake truth.

#### Actions

- define real live truth source
- define allowed seed/demo data
- define forbidden mock/fixture truth for canonical operation paths
- define behavior when runtime is unavailable
- define provider control-plane ownership

#### Outputs

- truth source register
- truth source classification
- runtime availability lock

### Phase 23 - Runtime Mode Policy

#### Goal

Use only the runtime level needed by the phase.

#### Runtime modes that must remain distinct

- visual-only preview
- limited-api preview
- canonical local stack activation
- production-like proof mode

#### Exact rule

- use the runtime and server matrix in Section 10.3
- no phase may activate more runtime than its matrix allows
- visual preview is not proof
- limited-api preview is not proof
- production-like mode is reserved for closure proof only

#### Core principle

Minimal Necessary Runtime

#### Outputs

- runtime mode policy per phase
- preview and simulation policy

### Phase 24 - Production-Like Verification

#### Goal

Prove the first service works end-to-end.

#### Verify

- happy path
- failure path
- recovery path
- staff path
- all participating surfaces in the target flow
- persistence
- real-time propagation where the operation requires it
- local media and storage behavior where relevant
- local domains where relevant
- postgres/redis/minio or equivalent canonical runtime stack if actually required
- provider switching readiness from the backend/control plane only when relevant
- no stale compose assumptions
- no runtime fixture truth

#### Outputs

- production-like proof
- e2e reports
- runtime health report
- persistence verify
- propagation verify where required
- media or storage verify where required

### Phase 25 - Evidence / Guards / Final Sign-Off

#### Goal

Seal the service with proof.

#### Gather

- evidence pack
- guards report
- parity proof
- UI snapshots where appropriate
- click budget before/after if meaningful
- no duplicate endpoints proof
- no fallback proof
- binding proof
- final sign-off

#### Outputs

- final evidence index
- guards report
- service seal status

### Phase 26 - Legacy Quarantine

#### Goal

Retire leftovers safely.

#### Actions

- classify old material
- move it, do not delete it blindly
- keep quarantine outside the live clean product tree
- scan for live imports/references
- prevent live references to quarantined material
- document what was isolated

#### Outputs

- legacy quarantine map
- detached archive reference if needed
- live reference scan
- post-move verify

### Phase 27 - Repeat For Next Service

#### Goal

Scale correctly.

#### Rule

Repeat the same cycle for the next service.
Do not switch to rebuilding whole surfaces in one wave.
Build operation-by-operation across required surfaces only.

## 7. Hard Prohibitions

The source file is strongest and most stable on the following prohibitions.
These are preserved here as hard law.

Do not:

- start with `Master Full`
- start with `Screens Only`
- start with APIs first
- start with binding first
- start with runtime first
- start with full stack every day
- start multiple services together
- move large legacy code blindly
- delete legacy code directly without quarantine
- inflate UI Kit before demand is proven
- design screens before operations are locked
- update OpenAPI before Screen/API Matrix and Gap Map
- bind screens before purpose, flow, and states are clear
- create `reference/`, `archive/`, or `quarantine/` roots inside the clean product tree
- create `misc/`, `common/`, or `helpers/` roots without explicit ownership
- treat `app-field` as ignorable or leave it unclassified
- let fixtures, seeds, or static assets become runtime truth
- run multiple deep service tracks, binding tracks, or runtime stacks in parallel

## 8. Canonical UI Kit Timing Rule

The source transcript repeats UI Kit timing often.
This is the final cleaned rule:

### Stage A - Foundation

Before screens:

- tokens
- typography
- spacing
- colors
- primitives
- state shells
- direction rules

### Stage B - Expansion

During screens:

- cards
- lists
- filters
- sheets
- review blocks
- tracking patterns
- control-plane task patterns

### Stage C - Stabilization

Before wide binding:

- cleanup
- canonicalization
- de-duplication
- locking critical patterns

## 9. Canonical Contract Timing Rule

The donor repo may inform contract thinking, but it does not define new sovereignty automatically.

Final rule:

1. Screens and flows mature first.
2. Screen/API Matrix exposes demand.
3. Gap Map exposes missing contract behavior.
4. Only then is Master OpenAPI updated.
5. Only then are generated layers created.
6. Only then does binding start.

## 10. Runtime, Preview, And Asset Rules

### 10.1 Design Assets, Fixtures, and Runtime Seed Rule

Static images, design assets, and fixtures are allowed during design and early screen work.
They are not allowed to become operational truth.

Use this separation:

- visual assets = images, icons, and static media for presentation only
- fixtures = visual-only or test-only example data for screens and flows
- runtime seed = controlled local initialization data for runtime services
- runtime truth = the actual operational data path used by the live bound chain

Hard law:

- fixtures may support visual review, UX review, and test scenarios
- runtime seed may initialize local services
- neither fixtures nor static assets may become canonical truth for bound operations
- seed data is not a substitute for runtime truth
- runtime truth is established only in Phases 22-24

### 10.2 Canonical Asset and Fixture Locations

Use these locations:

- `apps/*/src/assets/` = visual-only static media
- `packages/surfaces/src/<service>/<surface>/<flow>/fixtures/` = visual-only or test-only example data
- `runtime/local/seed/` = runtime-only local initialization data

Rules:

- `apps/*/src/assets/` must not store business truth
- `packages/surfaces/src/<service>/<surface>/<flow>/fixtures/` must not be imported as canonical runtime data sources
- `runtime/local/seed/` may initialize local services, but it is still not the same as live runtime truth
- `runtime/local/seed/` is a canonical location only once runtime work actually begins after bootstrap
- `packages/surfaces/` is a target structure location, not a bootstrap requirement

### 10.3 Runtime and Server Requirements by Phase

#### Phases 00-05

- documents, governance, and workspace shell only
- browser or static review only if needed
- no api-host
- no proxy
- no postgres, redis, or minio
- no local domains
- no real-time propagation
- no `app-field` runtime activation

#### Phases 06-11

- surface-only preview is allowed
- Expo Go is allowed for mobile visual review
- browser preview is allowed for `control-panel`, `webapp`, and `website`
- fixtures are allowed for visual or test use only
- no canonical api-host by default
- no postgres, redis, or minio
- no local domains unless a surface shell absolutely requires them
- `app-field` may be visually explored, but not treated as bound runtime truth

#### Phases 12-14

- visual preview and journey validation remain primary
- limited api-host preview is allowed only when needed to validate screen or API assumptions
- proxy or local domains are allowed only when required to validate real routing or auth seams
- no full canonical local stack
- no production-like proof
- real-time remains out unless the journey cannot be reviewed without it

#### Phases 15-18

- screen-driven UI Kit growth continues
- limited-api preview is allowed
- targeted runtime seed is allowed for local verification
- no full production-like stack
- no generated layers yet
- `app-field` enters only if the service matrix classified it as `REQUIRED` or `OPTIONAL`

#### Phases 19-20

- api-host and generation verification are allowed
- generated layers may be created and checked
- targeted postgres, redis, minio, or equivalent services are allowed only if contract verification actually requires them
- proxy or local domains may be activated if the contract path requires them
- full end-to-end proof is still not the goal

#### Phase 21

- binding begins
- canonical local api-host and the real bound chain may run
- proxy and local domains may run if they are part of the real chain
- `app-field` may enter real implementation only if already classified and justified
- real-time propagation may be enabled only for operations that truly require it

#### Phases 22-24

- runtime truth is locked
- the canonical local stack may run in full where required
- postgres, redis, minio, local media or storage behavior, and persistence are verified where relevant
- all participating surfaces in the target flow must be exercised together
- provider switching readiness is checked from the backend or control plane only
- this is proof mode, not the default mode for every earlier phase

### 10.4 Surface Preview and Simulation Rule

Use preview modes deliberately:

- Expo Go = early mobile visual preview and interaction smoke for Phases 06-18
- browser = enough for most `control-panel`, `webapp`, and `website` visual review, and for many flow reviews before binding
- visual-only preview = layout, content hierarchy, CTA clarity, and state presentation only
- limited-api preview = targeted contract or screen/API validation only
- production-like preview = reserved for Phase 24 proof with required surfaces, persistence, propagation, and canonical runtime behavior

Preview law:

- visual preview is not runtime proof
- limited-api preview is not production-like proof
- production-like proof cannot be claimed from Expo Go or browser-only shells alone

## 11. DSH Example In Clean Form

This section is illustrative only.
It demonstrates method and ordering.
It does not select `DSH` as the first bootstrap service.
The actual first-service decision is made in Phase 04 and recorded in `docs/services/00_SERVICE_BUILD_ORDER.md`.

### DSH primary job

Client places order -> partner accepts and prepares -> captain receives and fulfills -> all relevant surfaces track the status clearly.

### Possible DSH surface classification

- `app-client` = REQUIRED
- `app-partner` = REQUIRED
- `app-captain` = REQUIRED
- `control-panel` = REQUIRED
- `app-field` = OPTIONAL or REQUIRED if field rollout or onboarding support is part of actual service truth
- `webapp` or `website` = OPTIONAL or OUT depending on actual service truth

### DSH actors

- app-client user
- app-partner operator
- app-captain driver
- control-panel operator

### DSH high-level rebuild order

1. define DSH service profile
2. define DSH operations
3. define DSH actor or surface responsibilities
4. draw DSH journeys
5. inventory and rationalize DSH screens
6. lock DSH screen families and CTAs
7. expand UI Kit only for DSH screen needs
8. complete state coverage
9. build DSH screen or api matrix
10. build DSH gap map
11. update master openapi for DSH
12. generate and verify layers
13. bind DSH screens to canonical chain
14. lock DSH runtime truth
15. prove DSH with production-like verification
16. seal DSH with evidence

## 12. Exact New File Purpose

This file serves as the canonical long-term planning artifact for new repo creation in this repository.
Any external planning transcript remains reference material only.

## 13. Final Operational Rule

When donor consultation is needed, the need in the new repo must drive the search in the donor repo.

Correct flow:

1. define what the new repo needs
2. search the donor repo for a specific useful candidate only
3. classify the candidate
4. rebuild clean or extract partially
5. validate in the new repo

Incorrect flow:

1. browse the donor repo randomly
2. gather interesting files
3. move them into the new repo
4. try to make them fit later

## 14. Final One-Line Rule

Build the new repository from clean law and real service truth, and use the old repository only as a donor quarry that must never be copied blindly into the new system.

## 15. Companion Execution Artifacts

Use these companion documents with this guide:

- `BTHWANI GUIDE — Phase Bootstrap Runbook.md`
- `BTHWANI GUIDE — Bootstrap Gate Checklists.md`

This guide remains the governing reference.
The bootstrap runbook defines exact first file and folder creation order.
The bootstrap gate checklists define evidence-backed exit conditions for bootstrap phases.
The two companion artifacts are operational tools for Phases 00-07 only.
During Phases 00-07, they override any broader interpretation in this guide that would cause premature expansion.

## 16. Appendix A - Donor Extraction Decision Matrix

This appendix is intentionally minimal.
It is secondary guidance, not the center of the clean build line.

### 16.1 Minimal donor rules

- consult the donor repo only after a concrete new-repo need is defined
- default donor decision = `REBUILD_CLEAN`
- direct carryover is limited to isolated, clearly understood assets or verified schema fragments
- large flows, apps, services, and UI patterns remain reference-only unless explicitly proven otherwise
- detailed extraction logic belongs in donor-specific working packs, not in the main governing guide
