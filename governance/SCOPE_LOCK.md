# SCOPE_LOCK

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `Repo skeleton and workspace shell are not started yet`
- NextAllowed: `Phase 01 governance files only`

## Scope Lock

Phase 01 exists to freeze the minimum laws that prevent early chaos.

## In Scope During Phase 01

- create and refine files under `governance/`
- refine bootstrap docs only to resolve governance contradictions
- create evidence for `phase-01/`
- clarify ownership, boundaries, execution law, evidence law, change-entry law, and move-don't-delete law

## Out Of Scope During Phase 01

- workspace shell files such as `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, and `tsconfig.json`
- `apps/`, `services/`, `packages/`, and `contracts/master/` scaffold creation
- ui-kit package creation
- service foundation packs
- screen inventories
- OpenAPI construction
- generated layers
- binding
- runtime stack creation
- feature implementation code

## Do Not Create Yet

- `apps/mobile/`
- `apps/web/`
- `services/`
- `packages/`
- `contracts/master/`
- `tools/`
- `runtime/`

## Do Not Start Yet

- feature development
- service-specific design work
- service-specific contracts
- multi-service planning packs
- donor extraction packs beyond boundary policy

## Scope Enforcement Rule

Any requested change that crosses into Phase 02 or later must be rejected or deferred until the current phase passes with evidence.

## Phase 01 Exit Rule

Phase 01 may close only when:

- required governance files exist
- required evidence files exist
- scope boundaries are explicit
- evidence root is explicit
- move-don't-delete behavior is explicit
- no broad implementation work has started
