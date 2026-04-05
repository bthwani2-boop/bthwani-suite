# BTHWANI GUIDE — Bootstrap Gate Checklists

## 1. Purpose

This document defines the evidence-backed exit conditions for bootstrap phases inside `bthwani-suite`.

It covers phases `00` through `07` only.

## 2. Evidence Root Rule

Every phase must deposit its proof under:

- `kdt/volatile/registry/runs/{SESSION_ID}/phase-00/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-01/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-02/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-03/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-04/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-05/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-06/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-07/`

## 3. Gate Format

Every gate below contains:

- gate purpose
- required repo artifacts
- required evidence artifacts
- pass conditions
- fail conditions
- content quality and coherence review

These gates do not validate file existence only.
They validate whether artifacts contain usable initial truth for the phase.

## 4. Gate Checklists

### GATE_PHASE_00_REPO_RESET_DECISION

#### Required repo artifacts

- `.gitignore`
- `README.md`
- `docs/00_REPO_RESET_DECISION.md`
- `docs/01_DONOR_REPO_POLICY.md`

#### Required evidence artifacts

- `phase-00/root-state.txt`
- `phase-00/decision-review.md`

#### Pass conditions

- target repo is declared the clean build line
- donor repo is declared reference-only
- no feature code exists yet
- no donor folder has been copied into the target repo

#### Fail conditions

- any app, package, service, or feature code is already present
- donor repo is still described as an active build line

### GATE_PHASE_01_GOVERNANCE_FREEZE

#### Required repo artifacts

- `governance/OWNERSHIP.md`
- `governance/SCOPE_LOCK.md`
- `governance/REPO_BOUNDARY.md`
- `governance/EXECUTION_LAW.md`
- `governance/EVIDENCE_ROOT_RULE.md`
- `governance/CHANGE_ENTRY_RULE.md`
- `governance/MOVE_DONT_DELETE.md`

#### Required evidence artifacts

- `phase-01/governance-file-index.txt`
- `phase-01/governance-review.md`

#### Pass conditions

- ownership is explicitly assigned
- scope boundaries are explicit
- evidence root is explicit
- move-don't-delete rule is explicit
- no broad implementation work has started

#### Fail conditions

- governance files exist but contradict each other
- evidence root is missing or ambiguous
- deletion is allowed without quarantine

### GATE_PHASE_02_REPO_SKELETON_AND_REALITY_INTAKE

#### Required repo artifacts

- `package.json`
- `pnpm-workspace.yaml`
- `nx.json`
- `tsconfig.base.json`
- `tsconfig.json`
- `apps/mobile/`
- `apps/web/`
- `services/`
- `packages/`
- `contracts/master/`
- `docs/reality-intake/00_REALITY_INTAKE_SCOPE.md`
- `docs/reality-intake/01_REPO_CENSUS.md`
- `docs/reality-intake/02_CURRENT_SERVICES_MAP.md`
- `docs/reality-intake/03_CURRENT_SURFACES_MAP.md`
- `docs/reality-intake/04_CURRENT_SCREENS_INVENTORY.md`
- `docs/reality-intake/05_NOISE_DUPLICATION_DRIFT_REPORT.md`
- `docs/reality-intake/06_RUNTIME_TRUTH_REGISTER.md`

#### Required evidence artifacts

- `phase-02/root-tree.txt`
- `phase-02/workspace-shell-review.md`
- `phase-02/reality-intake-index.md`
- `phase-02/content-depth-review.md`
- `phase-02/runtime-bootstrap-boundary.md`

#### Pass conditions

- repo skeleton exists in the correct top-level structure
- workspace shell files exist
- reality-intake scaffolds exist
- reality-intake artifacts contain actual initial observations, not headings or placeholders only
- no actual app project folder exists yet below `apps/mobile/` or `apps/web/`
- no real service implementation folder exists yet
- `runtime/` has not been created as speculative bootstrap shell

#### Fail conditions

- workspace shell files are missing
- reality-intake files are empty, placeholder-only, or mutually inconsistent
- app project folders already exist
- service implementation started before reality intake completion
- `runtime/` was created during bootstrap without later-phase justification

### GATE_PHASE_03_PLATFORM_VALUE_LOCK

#### Required repo artifacts

- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`

#### Required evidence artifacts

- `phase-03/value-lock-review.md`
- `phase-03/non-goals-review.md`

#### Pass conditions

- platform core value is defined
- non-goals are explicit
- first-release exclusions are explicit
- service priority reasoning and candidate ranking are explicit

#### Boundary note

Phase 03 documents priority reasoning only.
It does not finalize the first service.
The final first-service selection is made in `GATE_PHASE_04_SERVICE_ORDER`.

#### Fail conditions

- value lock is missing
- non-goals are absent
- service priority is arbitrary or undocumented

### GATE_PHASE_04_SERVICE_ORDER

#### Required repo artifacts

- `docs/services/00_SERVICE_BUILD_ORDER.md`

#### Required evidence artifacts

- `phase-04/service-order-decision.md`

#### Pass conditions

- exactly one first service slug is selected
- the reason for that selection is recorded
- multi-service parallel start is explicitly rejected

#### Fail conditions

- multiple first services are declared
- no selection reason exists

### GATE_PHASE_05_MASTER_FOUNDATION_MINIMAL

#### Required repo artifacts

- `governance/SERVICE_CATALOG.md`
- `governance/SURFACE_CATALOG.md`
- `governance/OPERATION_CATALOG_TEMPLATE.md`
- `governance/OPENAPI_SOVEREIGNTY.md`
- `governance/DIRECTION_I18N_OWNERSHIP.md`
- `governance/APPROVED_SURFACE_NAMING.md`

#### Required evidence artifacts

- `phase-05/master-foundation-review.md`
- `phase-05/catalog-consistency-check.md`
- `phase-05/content-depth-review.md`

#### Pass conditions

- approved service names are explicit
- approved surface names are explicit
- OpenAPI sovereignty rule is explicit
- direction/lang ownership is explicit
- service catalog, surface catalog, naming, and ownership artifacts are coherent with each other
- the official surface naming set explicitly includes `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, `webapp`, and `website`
- no full master detail expansion has started

#### Fail conditions

- service or surface naming is inconsistent
- OpenAPI rule is absent or ambiguous
- governance artifacts are placeholder-only or contradictory
- full master detail is being built prematurely

### GATE_PHASE_06_UI_KIT_FOUNDATION

#### Required repo artifacts

- `packages/ui-kit/package.json`
- `packages/ui-kit/project.json`
- `packages/ui-kit/tsconfig.json`
- `packages/ui-kit/src/index.ts`
- `packages/ui-kit/src/tokens/index.ts`
- `packages/ui-kit/src/typography/index.ts`
- `packages/ui-kit/src/spacing/index.ts`
- `packages/ui-kit/src/colors/index.ts`
- `packages/ui-kit/src/direction/index.ts`
- `packages/ui-kit/src/primitives/index.ts`
- `packages/ui-kit/src/states/index.ts`
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`

#### Required evidence artifacts

- `phase-06/ui-kit-foundation-inventory.md`
- `phase-06/token-scope-review.md`
- `phase-06/foundation-boundary-review.md`

#### Pass conditions

- ui-kit exists as foundation only
- tokens, primitives, direction, and state shells are scaffolded
- `FOUNDATION_SCOPE.md` explicitly defines what is in scope and out of scope
- ui-kit barrels and scope files contain real foundation definitions, not empty placeholders only
- no service-specific patterns exist yet
- no screen-driven patterns exist yet

#### Fail conditions

- cards, tracking blocks, filters, inbox patterns, or dashboard blocks already exist
- ui-kit package is copied from donor repo wholesale
- scope is undefined, contradictory, or mostly placeholder text

### GATE_PHASE_07_FIRST_SERVICE_FOUNDATION

For this gate, `<first-service>` means the service selected in `docs/services/00_SERVICE_BUILD_ORDER.md` during Phase 04.

#### Required repo artifacts

- `docs/services/<first-service>/00_SERVICE_PROFILE.md`
- `docs/services/<first-service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<first-service>/02_OPERATIONS_CATALOG.csv`
- `docs/services/<first-service>/03_SURFACE_MATRIX.csv`
- `docs/services/<first-service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/services/<first-service>/05_NON_GOALS.md`

#### Required evidence artifacts

- `phase-07/first-service-foundation-review.md`
- `phase-07/service-scope-signoff.md`
- `phase-07/content-depth-review.md`

#### Pass conditions

- one service foundation pack exists
- the first service has profile, actors, operations, surfaces, and non-goals documented
- the service pack contains actual first-service truth, not headings only
- `app-field` is classified explicitly in the service surface matrix
- actor, operation, and surface documents are coherent with each other
- no service implementation code exists yet
- no service-specific contracts exist yet
- no service-specific screen code exists yet

#### Fail conditions

- service implementation code appears before actor/operation/surface truth is documented
- multiple service foundation packs are started at once
- `app-field` is omitted or left implicit
- service foundation artifacts are empty, placeholder-only, or contradictory

## 5. Bootstrap Exit Rule

Bootstrap is complete only if all gates from `GATE_PHASE_00_REPO_RESET_DECISION` through `GATE_PHASE_07_FIRST_SERVICE_FOUNDATION` pass with evidence.

At that point the repo may enter:

- Actor/Context deepening
- Operation Lock refinement
- Surface Responsibility Lock
- Journey Lock
- Screen Inventory and Rationalization

It may not enter:

- Master OpenAPI detail build
- generated client creation
- binding
- runtime stack implementation

until the later guide phases are satisfied.
