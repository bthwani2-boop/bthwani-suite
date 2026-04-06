# BTHWANI GUIDE — Phase Bootstrap Runbook

## 1. Purpose

This runbook converts the governing guide into the first executable bootstrap sequence for the target repo `bthwani-suite`.

It answers one question only:

What must be created first, in exact file and folder order, inside the target repo during bootstrap before real service implementation begins?

## 2. Observed Target Repo State

Observed target repo state for this session on 2026-04-06:

- repo: `bthwani-suite`
- current visible content includes `.git/`, `.github/`, and `docs/`
- workspace shell files such as `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, and `tsconfig.json` are not present yet
- no bootstrap app shells, service implementation folders, or `runtime/` tree are present yet

This means bootstrap still starts from pre-implementation state, but not from a completely empty directory.

## 3. Bootstrap Scope

This runbook covers only these phases:

- Phase 00 - Repo Reset Decision
- Phase 01 - Governance Freeze
- Phase 02 - Repo Skeleton And Reality Intake Scaffolding
- Phase 03 - Platform Value Lock
- Phase 04 - Service Order
- Phase 05 - Master Foundation Minimal
- Phase 06 - UI Kit Foundation
- Phase 07 - First Service Foundation

This runbook does not include:

- actual screen implementation
- API implementation
- binding
- runtime stack implementation
- creation of `runtime/` as part of the mandatory bootstrap shell
- production-like verification

## 3.1 Bootstrap Execution Precedence

During Phases 00-07, this runbook and the bootstrap gate checklists govern execution timing and scope.

If a broader statement in the main governing guide could be interpreted to justify earlier expansion, this runbook wins for bootstrap execution.

## 4. Hard Rules Before Creation

1. Do not copy any app, package, service, or feature folder from the donor repo during bootstrap.
2. Do not create real service logic during bootstrap.
3. Do not create generated layers during bootstrap.
4. Do not create API clients during bootstrap.
5. Do not create full surface apps during bootstrap.
6. Do not create service-specific UI Kit patterns during bootstrap.
7. Every phase must record evidence under `kdt/volatile/registry/runs/{SESSION_ID}/`.
8. Do not create `runtime/` during mandatory bootstrap; runtime shell creation starts only after bootstrap when a later phase truly requires runtime seed or local stack work.

## 5. Root Folder Model To Reach By End Of Bootstrap

```text
bthwani-suite/
  .gitignore
  README.md
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
      docs/
      src/
        tokens/
        typography/
        spacing/
        colors/
        direction/
        primitives/
        states/
  contracts/
    master/
  docs/
    reality-intake/
    platform/
    services/
      <first-service>/
  governance/
  tools/
  kdt/
    volatile/
      registry/
        runs/
```

`runtime/` is intentionally absent from the mandatory bootstrap shell.

## 6. Exact Phase Bootstrap Sequence

### Phase 00 - Repo Reset Decision

#### Create folders first

1. `docs/`
2. `kdt/volatile/registry/runs/`

#### Create files next

1. `.gitignore`
2. `README.md`
3. `docs/00_REPO_RESET_DECISION.md`
4. `docs/01_DONOR_REPO_POLICY.md`

#### Minimum content intent

- `.gitignore`: exclude transient build output, dependency folders, and runtime noise
- `README.md`: identify `bthwani-suite` as the new clean build line
- `00_REPO_RESET_DECISION.md`: declare clean-repo strategy and no-blind-copy law
- `01_DONOR_REPO_POLICY.md`: declare donor repo as reference-only and extraction-only

#### Do not create yet

- `apps/mobile/app-client/`
- `apps/mobile/app-partner/`
- `apps/mobile/app-captain/`
- `apps/mobile/app-field/`
- `apps/web/control-panel/`
- `apps/web/webapp/`
- `apps/web/website/`
- any feature code

### Phase 01 - Governance Freeze

#### Create folders first

1. `governance/`

#### Create files next

1. `governance/OWNERSHIP.md`
2. `governance/SCOPE_LOCK.md`
3. `governance/REPO_BOUNDARY.md`
4. `governance/EXECUTION_LAW.md`
5. `governance/EVIDENCE_ROOT_RULE.md`
6. `governance/CHANGE_ENTRY_RULE.md`
7. `governance/MOVE_DONT_DELETE.md`

#### Minimum content intent

- `OWNERSHIP.md`: who owns ui-kit, contracts, services, screens, runtime
- `SCOPE_LOCK.md`: what bootstrap may and may not touch
- `REPO_BOUNDARY.md`: donor repo vs target repo boundaries
- `EXECUTION_LAW.md`: no binding-first, no runtime-first, no big-bang
- `EVIDENCE_ROOT_RULE.md`: lock `kdt/volatile/registry/runs/{SESSION_ID}/`
- `CHANGE_ENTRY_RULE.md`: every change must have phase and reason
- `MOVE_DONT_DELETE.md`: quarantine before delete

#### Do not create yet

- service folders with implementation code
- contracts beyond root placeholders

### Phase 02 - Repo Skeleton And Reality Intake Scaffolding

#### Create folders first

1. `apps/mobile/`
2. `apps/web/`
3. `services/`
4. `packages/`
5. `contracts/master/`
6. `docs/reality-intake/`
7. `docs/platform/`
8. `docs/services/`
9. `tools/`

#### Create files next

1. `package.json`
2. `pnpm-workspace.yaml`
3. `nx.json`
4. `tsconfig.base.json`
5. `tsconfig.json`
6. `docs/reality-intake/00_REALITY_INTAKE_SCOPE.md`
7. `docs/reality-intake/01_REPO_CENSUS.md`
8. `docs/reality-intake/02_CURRENT_SERVICES_MAP.md`
9. `docs/reality-intake/03_CURRENT_SURFACES_MAP.md`
10. `docs/reality-intake/04_CURRENT_SCREENS_INVENTORY.md`
11. `docs/reality-intake/05_NOISE_DUPLICATION_DRIFT_REPORT.md`
12. `docs/reality-intake/06_RUNTIME_TRUTH_REGISTER.md`

#### Minimum content intent

- `package.json`: root workspace shell only, not full feature scripts
- `pnpm-workspace.yaml`: workspace package boundaries for `apps/**`, `services/**`, `packages/**`
- `nx.json`: minimal monorepo orchestration shell
- `tsconfig.base.json`: strict workspace compiler base
- `tsconfig.json`: workspace root extender
- reality-intake docs: donor observation scaffolds only

#### Do not create yet

- root OpenAPI document contents
- real service projects
- real app projects
- generated package aliases for services not yet selected
- `runtime/`
- `runtime/local/seed/`

### Phase 03 - Platform Value Lock

#### Create files next

1. `docs/platform/00_PLATFORM_VALUE_LOCK.md`
2. `docs/platform/01_SERVICE_PRIORITY_LIST.md`
3. `docs/platform/02_NON_GOALS_REGISTER.md`

#### Minimum content intent

- `00_PLATFORM_VALUE_LOCK.md`: what the platform must do now
- `01_SERVICE_PRIORITY_LIST.md`: ranked service candidates and selection reasoning, but not the final first-service lock
- `02_NON_GOALS_REGISTER.md`: what is intentionally out of scope

#### Do not create yet

- extra service docs for all services
- advanced feature breakdowns

### Phase 04 - Service Order

#### Create files next

1. `docs/services/00_SERVICE_BUILD_ORDER.md`

#### Minimum content intent

- one ordered list only
- clear final first-service selection and rule
- no parallel start of multiple services

The service slug selected here becomes `<first-service>` in Phase 07.

#### Do not create yet

- second service foundation pack
- full cross-service plan packs

### Phase 05 - Master Foundation Minimal

#### Create files next

1. `governance/SERVICE_CATALOG.md`
2. `governance/SURFACE_CATALOG.md`
3. `governance/OPERATION_CATALOG_TEMPLATE.md`
4. `governance/OPENAPI_SOVEREIGNTY.md`
5. `governance/DIRECTION_I18N_OWNERSHIP.md`
6. `governance/APPROVED_SURFACE_NAMING.md`

#### Minimum content intent

- `SERVICE_CATALOG.md`: official service names only
- `SURFACE_CATALOG.md`: official surfaces only
- `OPERATION_CATALOG_TEMPLATE.md`: required fields for operation definition
- `OPENAPI_SOVEREIGNTY.md`: OpenAPI is canonical only after UX demand is defined
- `DIRECTION_I18N_OWNERSHIP.md`: one owner for lang/dir behavior
- `APPROVED_SURFACE_NAMING.md`: `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, `webapp`, `website`

#### Do not create yet

- full master contract schemas
- generated clients
- feature-specific OpenAPI paths

### Phase 06 - UI Kit Foundation

#### Create folders first

1. `packages/ui-kit/`
2. `packages/ui-kit/docs/`
3. `packages/ui-kit/src/`
4. `packages/ui-kit/src/tokens/`
5. `packages/ui-kit/src/typography/`
6. `packages/ui-kit/src/spacing/`
7. `packages/ui-kit/src/colors/`
8. `packages/ui-kit/src/direction/`
9. `packages/ui-kit/src/primitives/`
10. `packages/ui-kit/src/states/`

#### Create files next

1. `packages/ui-kit/package.json`
2. `packages/ui-kit/project.json`
3. `packages/ui-kit/tsconfig.json`
4. `packages/ui-kit/src/index.ts`
5. `packages/ui-kit/src/tokens/index.ts`
6. `packages/ui-kit/src/typography/index.ts`
7. `packages/ui-kit/src/spacing/index.ts`
8. `packages/ui-kit/src/colors/index.ts`
9. `packages/ui-kit/src/direction/index.ts`
10. `packages/ui-kit/src/primitives/index.ts`
11. `packages/ui-kit/src/states/index.ts`
12. `packages/ui-kit/docs/FOUNDATION_SCOPE.md`

#### Minimum content intent

- package shell only
- token and primitive export barrels only
- no service-specific UI patterns
- no dashboard blocks
- no inbox cards yet
- no tracking blocks yet

#### Do not create yet

- `packages/ui-kit/src/cards/`
- `packages/ui-kit/src/filters/`
- `packages/ui-kit/src/tracking/`
- `packages/ui-kit/src/service-specific/`

### Phase 07 - First Service Foundation

Use `<first-service>` below to mean the service selected in `docs/services/00_SERVICE_BUILD_ORDER.md` during Phase 04.

#### Create folders first

1. `docs/services/<first-service>/`

#### Create files next

1. `docs/services/<first-service>/00_SERVICE_PROFILE.md`
2. `docs/services/<first-service>/01_ACTOR_CONTEXT_MATRIX.csv`
3. `docs/services/<first-service>/02_OPERATIONS_CATALOG.csv`
4. `docs/services/<first-service>/03_SURFACE_MATRIX.csv`
5. `docs/services/<first-service>/04_PRIMARY_FLOW_NOTES.md`
6. `docs/services/<first-service>/05_NON_GOALS.md`

#### Minimum content intent

- service truth only
- no screen code yet
- no API code yet
- no binding yet
- no runtime logic yet

#### Do not create yet

- `services/<first-service>/` implementation code
- `contracts/master/<first-service>/` endpoint contracts
- `apps/mobile/app-client/` `<first-service>` screens
- `apps/web/control-panel/` `<first-service>` control-plane UI

## 7. Bootstrap Order Summary

The first actual creation sequence inside `bthwani-suite` is this:

1. root decision docs and evidence path
2. governance law files
3. repo skeleton and workspace shell files
4. reality-intake scaffolds
5. platform value lock files
6. service build order file
7. master foundation governance files
8. ui-kit foundation scaffold
9. first-service documentation pack

## 8. What Not To Build During Bootstrap

Do not create during bootstrap:

- production API code
- generated API clients
- service repositories
- database schemas
- real surface application folders
- route trees
- control-panel dashboards
- service-specific UI kit patterns
- full runtime stack

## 9. Bootstrap Completion Condition

Bootstrap is complete only when:

1. the repo has its law, shell, and evidence root
2. the repo has workspace shell files
3. the repo has UI Kit Foundation scaffold only
4. the first service has documentation truth only
5. no service implementation code or binding has started

At that point the repo is ready to enter actor/context, operation, surface, and journey work for the first service.

## 10. Post-Bootstrap Mobile Preview Handoff

This runbook stops at Phase 07.
The following note clarifies the earliest lawful entry points immediately after bootstrap exit.

### App shell timing

- do not create individual mobile surface app shells during bootstrap
- after bootstrap exit, create a thin `apps/mobile/<surface>/` shell only after `Surface Responsibility Lock` classifies that surface as `REQUIRED` or `OPTIONAL`
- the default earliest point for mobile app shell creation is `Phase 10`

### Expo Go routes and screens timing

- do not add real preview routes or candidate screens for Expo Go before `Journey Lock`
- the default earliest point for Expo Go route and screen entry is `Phase 12`
- `Phase 13` is the first stabilization point where those screens should have clear purpose, CTA, and required states

### Fixtures-only timing

- `fixtures-only` is the default and expected mode for preview screens in `Phases 12-14`
- in `Phases 15-18`, fixtures remain valid for preview and state coverage, and `limited-api` preview is allowed only when there is a concrete validation need
- from `Phase 21` onward, fixtures may support edge-state preview only and may not remain the primary source for a lawful operational path

For the governing version of this rule set, see `docs/governance/BTHWANI GUIDE — Full Unified Governing & Execution Reference.md`, Section `10.5 App Shell, Expo Go Routes, and Fixtures Entry Rule`.
