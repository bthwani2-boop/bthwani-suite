# BTHWANI GUIDE — Bootstrap Gate Checklists

## 1. Purpose

This document defines the evidence-backed exit conditions for bootstrap phases inside `bthwani-suite`.

It covers Phases `00` through `07` only.

These gates remain bootstrap-law references for reset scenarios.
Later lawful artifacts already present in the repo do not retroactively fail earlier bootstrap gates.

## 2. Evidence Root Rule

Every bootstrap phase must deposit proof under:

- `kdt/volatile/registry/runs/{SESSION_ID}/phase-00/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-01/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-02/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-03/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-04/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-05/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-06/`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-07/`

## 3. Gate Format

Each gate validates:

- required repo artifacts
- required evidence artifacts
- pass conditions
- fail conditions
- content depth and coherence

These gates do not validate file existence only.

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
- blind copy is rejected explicitly
- no feature code is being justified by this phase

#### Fail conditions

- donor repo is still described as an active build line
- feature implementation has already started under Phase `00`

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

- ownership is explicit
- scope boundaries are explicit
- evidence root is explicit
- move-don't-delete law is explicit
- no broad implementation work has started

#### Fail conditions

- governance files contradict each other
- evidence root is missing or ambiguous
- deletion is allowed without quarantine

### GATE_PHASE_02_REPO_SKELETON_AND_REALITY_INTAKE

#### Required repo artifacts

- workspace shell files
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

#### Pass conditions

- target structure is present at the correct top level
- reality-intake files contain actual initial observations
- runtime truth observations exist
- no speculative runtime shell has been created

#### Fail conditions

- reality-intake files are placeholders only
- repo structure is present but not observed
- `runtime/` was created during bootstrap

### GATE_PHASE_03_PLATFORM_VALUE_LOCK

#### Required repo artifacts

- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`

#### Required evidence artifacts

- `phase-03/value-lock-review.md`
- `phase-03/non-goals-review.md`

#### Pass conditions

- platform value is explicit
- non-goals are explicit
- ranking rationale exists for service candidates

#### Fail conditions

- value lock is vague
- service ranking is arbitrary or undocumented

### GATE_PHASE_04_SERVICE_ORDER

#### Required repo artifacts

- `docs/services/00_SERVICE_BUILD_ORDER.md`

#### Required evidence artifacts

- `phase-04/service-order-decision.md`

#### Pass conditions

- exactly one first service is selected
- the reason for selection is recorded
- parallel deep start is rejected explicitly

#### Fail conditions

- multiple first services are declared
- no reason exists for the first-service choice

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

#### Pass conditions

- service naming is explicit
- surface naming is explicit
- OpenAPI sovereignty is explicit
- direction and i18n ownership are explicit
- no full contract detail expansion has started

#### Fail conditions

- service or surface naming is inconsistent
- contract governance is ambiguous
- full master detail is being built prematurely

### GATE_PHASE_06_UI_KIT_FOUNDATION

#### Required repo artifacts

- `packages/ui-kit/` foundation package
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`

#### Required evidence artifacts

- `phase-06/ui-kit-foundation-inventory.md`
- `phase-06/token-scope-review.md`
- `phase-06/foundation-boundary-review.md`

#### Pass conditions

- UI Kit exists as foundation only
- tokens, spacing, typography, direction, primitives, and state shells are scaffolded
- the package is reviewable for later compatibility checks
- no service-specific widgets or business logic exist in the foundation layer

#### Fail conditions

- service-specific widgets entered the foundation layer
- business logic entered `packages/ui-kit/`
- UI Kit foundation is too vague to support later readiness review

### GATE_PHASE_07_FIRST_SERVICE_FOUNDATION

#### Required repo artifacts

- `docs/services/<service>/00_SERVICE_PROFILE.md`
- `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<service>/02_OPERATIONS_CATALOG.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/services/<service>/05_NON_GOALS.md`

#### Required evidence artifacts

- `phase-07/service-foundation-review.md`
- `phase-07/first-service-consistency-check.md`

#### Pass conditions

- one service foundation exists with real content
- actors, operations, and surfaces are explicit
- `app-field` is classified explicitly
- bootstrap handoff to post-bootstrap execution is clear

#### Fail conditions

- multiple service foundations are active
- service foundation is placeholder-only
- `app-field` is missing
- preview work has already started before Journey Chain Master

Preview work here includes screen-census rows, preview route stubs, preview registries, and Expo Go route exposure.

## 5. Bootstrap Exit Handoff

Bootstrap is complete only when all gates from `GATE_PHASE_00_REPO_RESET_DECISION` through `GATE_PHASE_07_FIRST_SERVICE_FOUNDATION` pass with evidence.

After bootstrap, use:

- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`
- `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md`
- `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md`

for all post-bootstrap execution and gate work.
