# BTHWANI GUIDE — Phase Bootstrap Runbook

## 1. Purpose

This runbook converts governing law into the first executable bootstrap sequence for `bthwani-suite`.

It answers one question only:

What must be created, reviewed, and locked first during bootstrap before post-bootstrap screen, contract, binding, and runtime work begins?

## 2. Scope And Authority

This runbook governs Phases `00` through `07` only.

It owns:

- literal bootstrap order
- bootstrap file and folder priorities
- bootstrap stop conditions
- bootstrap handoff to post-bootstrap execution

It does not own:

- screen census and registry execution
- preview registry execution after Journey Chain Master
- contract updates
- binding
- runtime truth or production-like proof

## 3. Observed Target Repo State

Observed target repo state for this session on 2026-04-06:

- workspace shell files are present
- approved app shells exist under `apps/mobile/` and `apps/web/`
- `packages/ui-kit/` exists
- `packages/surfaces/` exists as a preview-stage package
- `contracts/master/` exists
- `runtime/` does not exist yet

This means the current repo is already beyond the pure bootstrap shell.
This runbook remains the canonical bootstrap reference for reset or bootstrap-law review.
It does not require rollback of later lawful artifacts already present in the repo.

## 4. Bootstrap Hard Rules

1. Do not copy any app, package, service, or feature folder from the donor repo during bootstrap.
2. Do not create real service logic during bootstrap.
3. Do not create generated layers during bootstrap.
4. Do not create API clients during bootstrap.
5. Do not create runtime shells during bootstrap.
6. Do not create screen-census rows, preview route stubs, preview registries, or Expo Go routes before Journey Chain Master.
7. Do not treat UI Kit foundation work as permission to ingest screens.
8. Every phase must deposit evidence under `kdt/volatile/registry/runs/{SESSION_ID}/`.

## 5. Bootstrap Phase Order

### Phase 00 - Repo Reset Decision

Create or verify first:

- `docs/00_REPO_RESET_DECISION.md`
- `docs/01_DONOR_REPO_POLICY.md`

Lock in this phase:

- target repo is the clean build line
- donor repo is reference-only
- blind copy and big-bang rebuild are forbidden

Do not do here:

- feature implementation
- runtime setup
- package or app feature work

### Phase 01 - Governance Freeze

Create or verify next:

- `governance/OWNERSHIP.md`
- `governance/SCOPE_LOCK.md`
- `governance/REPO_BOUNDARY.md`
- `governance/EXECUTION_LAW.md`
- `governance/EVIDENCE_ROOT_RULE.md`
- `governance/CHANGE_ENTRY_RULE.md`
- `governance/MOVE_DONT_DELETE.md`

Lock in this phase:

- ownership boundaries
- scope boundaries
- evidence root
- move-don't-delete behavior

### Phase 02 - Reality Intake

Create or verify next:

- workspace shell files
- `docs/reality-intake/00_REALITY_INTAKE_SCOPE.md`
- `docs/reality-intake/01_REPO_CENSUS.md`
- `docs/reality-intake/02_CURRENT_SERVICES_MAP.md`
- `docs/reality-intake/03_CURRENT_SURFACES_MAP.md`
- `docs/reality-intake/04_CURRENT_SCREENS_INVENTORY.md`
- `docs/reality-intake/05_NOISE_DUPLICATION_DRIFT_REPORT.md`
- `docs/reality-intake/06_RUNTIME_TRUTH_REGISTER.md`

Lock in this phase:

- target reality is observed rather than assumed
- donor reality is observed rather than inherited
- runtime truth observations exist

### Phase 03 - Platform Value Lock

Create or verify next:

- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`

Lock in this phase:

- what matters now
- what is explicitly out
- why service candidates rank the way they do

### Phase 04 - Service Order

Create or verify next:

- `docs/services/00_SERVICE_BUILD_ORDER.md`

Lock in this phase:

- exactly one first service
- explicit rejection of multi-service deep start

### Phase 05 - Master Foundation Minimal

Create or verify next:

- `governance/SERVICE_CATALOG.md`
- `governance/SURFACE_CATALOG.md`
- `governance/OPERATION_CATALOG_TEMPLATE.md`
- `governance/OPENAPI_SOVEREIGNTY.md`
- `governance/DIRECTION_I18N_OWNERSHIP.md`
- `governance/APPROVED_SURFACE_NAMING.md`

Lock in this phase:

- naming truth
- surface truth
- minimal contract-governance truth

### Phase 06 - UI Kit Foundation

Create or verify next:

- `packages/ui-kit/` foundation package
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`

Lock in this phase:

- tokens
- typography
- spacing
- colors
- direction handling
- primitives
- state shells

UI Kit readiness checkpoint for the end of this phase:

- the foundation must be reviewable for later compatibility checks
- the foundation must not contain service widgets or business logic
- this checkpoint prepares screen-ingestion review later; it does not start screen work

### Phase 07 - First Service Foundation

Create or verify next:

- `docs/services/<service>/00_SERVICE_PROFILE.md`
- `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<service>/02_OPERATIONS_CATALOG.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- `docs/services/<service>/04_PRIMARY_FLOW_NOTES.md`
- `docs/services/<service>/05_NON_GOALS.md`

Lock in this phase:

- one service foundation only
- actors, operations, and participating surfaces
- explicit `app-field` classification

## 6. Bootstrap Exit Handoff

After Phase `07`, literal execution moves to:

- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md` for Phases `08` through `18`
- `docs/execution/BTHWANI GUIDE — Binding And Runtime Execution Runbook.md` for Phases `19` through `24`
- `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md` for post-bootstrap gates
- `docs/execution/phases/PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION.md` onward for exact phase manuals

Bootstrap does not authorize early preview.
No screen-census rows, Expo Go routes, or preview registry work may begin before Journey Chain Master.
