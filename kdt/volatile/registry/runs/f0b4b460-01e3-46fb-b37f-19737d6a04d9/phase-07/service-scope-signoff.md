# Phase 07 W1 Scope Lock Note

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 07 - First Service Foundation`
- TargetService: `dsh`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `W1 Step 1 locked`
- BlockingGaps: `Phase 08 actor-context deepening and all later screen, contract, binding, and runtime phases remain unopened`
- NextAllowed: `Phase 07 W1 Step 2 - Bind phase boundaries`

## Objective

Define exactly what Phase 07 will touch for the `dsh` first-service foundation and reject all later-phase expansion.

## Current Handoff Opened

The active handoff set used for this scope lock is:

- `docs/services/00_SERVICE_BUILD_ORDER.md` -> selects `dsh` as the single first governed service
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md` -> preserves the shared Phase 06 UI boundary and prevents service-specific UI leakage
- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-06/ui-kit-foundation-inventory.md` -> confirms the required Phase 06 foundation artifacts exist
- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-06/foundation-boundary-review.md` -> confirms Phase 06 remains foundation-only and does not authorize service implementation
- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-07/phase-07-reentry-review.md` -> confirms the current accepted baseline remains the Phase 07 `dsh` foundation pack

## Source Of Truth

- primary service truth root: `docs/services/dsh/`
- current evidence root: `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-07/`

## Active Root Set

Read roots opened for this step:

- `docs/services/00_SERVICE_BUILD_ORDER.md`
- `docs/services/dsh/`
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`
- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-06/`
- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-07/`

Write root for this step:

- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-07/`

## In Scope

- lock `dsh` as the only active first-service foundation subject for Phase 07
- touch only service-foundation artifacts under `docs/services/dsh/`
- keep service profile truth at foundation depth only
- keep actor/context truth limited to bootstrap actor participation and normalized surface presence
- keep operation truth limited to foundation operation families and their owning surfaces
- keep surface truth limited to REQUIRED, OPTIONAL, and OUT ownership for official surfaces
- keep primary flow notes limited to the first-service foundation journey and bootstrap handoff depth
- keep non-goals explicit so later phases are not smuggled into current execution
- preserve clean ownership boundaries across `app-client`, `app-partner`, `app-captain`, optional `app-field`, and `control-panel`

## Out Of Scope

- exhaustive donor recovery beyond foundation depth
- entitlement expansion, actor legality deepening, or full actor-context proof for Phase 08+
- screen inventories, screen specs, preview registries, browseable previews, or retained-screen decisions
- contract detail, OpenAPI expansion, binding chains, generated clients, runtime stacks, or production-like proof
- finance, wallet, settlement, payout, or ledger ownership; those remain routed through `WLT`
- `webapp` and `website` as active DSH ownership surfaces for this phase
- starting any second service in parallel

## Deferred Set

- Phase 08 actor-context exhaustive extraction for `dsh`
- later operation-master, journey-chain, and screen-system phases
- later contract, binding, and runtime phases
- later UI Kit expansion driven by retained-screen proof only
- all non-`dsh` service execution

## Scope Validation

- scope is bounded to one service and one service-truth root -> PASS
- no hidden downstream implementation work is included -> PASS
- service drift outside `dsh` is explicitly excluded -> PASS
- Phase 06 shared-foundation boundary remains respected -> PASS

## Failure Conditions

- scope becomes vague or allows more than one service
- service foundation is treated as permission for screen, contract, binding, or runtime work
- finance ownership or generic website ownership is silently pulled into `dsh`
- donor naming or donor route sprawl is treated as canonical new-repo truth

## Stop Conditions

- stop if `docs/services/00_SERVICE_BUILD_ORDER.md` no longer selects `dsh`
- stop if `docs/services/dsh/` is missing or cannot be treated as the service truth root
- stop if the current evidence root cannot record this scope lock observably
- stop if an upstream handoff artifact needed for this step becomes unavailable or contradictory

## Scope Verdict

- `dsh` is the selected first service -> PASS
- service boundaries are explicit at bootstrap level -> PASS
- finance ownership is not misassigned to DSH -> PASS
- `control-panel` normalization is explicit and bounded to governance work -> PASS

## Evidence Capture

This scope-lock note is written to:

- `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-07/service-scope-signoff.md`

## Next Handoff

Pass this locked scope to Phase 07 W1 Step 2 only if the in-scope, out-of-scope, deferred, and active-root sets above remain explicit and unchanged.
