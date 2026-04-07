# 09_BINDING_AND_RUNTIME_NOTES

## Mandatory Header

- WorkMode: `BINDING TRACE MODE`
- CurrentPhase: `Phase 08-12 evidence synthesis`
- TargetService: `dsh`
- RequestType: `binding_chain_extract`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `binding and runtime truth classified for planning only`
- BlockingGaps: `no clean target binding chain exists yet; donor chain remains evidence only`
- NextAllowed: `derive clean binding targets in docs/services/dsh/20_BINDING_TARGETS.csv`

## Confirmed Donor Chain Segments

- donor surfaces use `packages/surfaces/src/dsh/hooks/**` and actor-specific auto screens as the first UI binding layer
- donor API access exists under `packages/api-clients/src/dsh/**` and `packages/api-clients/src/lib/dsh/**`
- donor backend entry exists in `services/dsh/src/controllers/dsh.controller.ts`
- donor backend mixes lawful endpoint evidence with in-memory maps, mock captain pools, and local state holders inside the controller itself
- donor runtime variables are explicitly visible for the proxy branch only in `runtime/vars/dsh/shein-proxy.yaml`
- donor state ownership also appears in `packages/states/src/lib/slices/dsh-slice.ts`, which is evidence of centralized state pressure but not a clean target ownership decision

## Binding Reality Classification

- confirmed fact: donor generated or semi-generated clients exist
- confirmed fact: donor surface hooks are numerous and actor-specific
- confirmed fact: donor controller contains both operational endpoints and mock/in-memory runtime behavior
- inferred conclusion: donor binding is useful as chain evidence but not safe for direct adoption
- rejected carryover: direct reuse of donor controller logic as clean target runtime truth

## Runtime Truth Classification

- `runtime/vars/dsh/shein-proxy.yaml` -> `EXTRACT_PARTIAL`
  - reason: explicit runtime toggle evidence for proxy behavior
- donor controller mock maps and local in-memory stores -> `REFERENCE_ONLY`
  - reason: proves lifecycle concepts but not clean runtime truth
- donor fixtures under `packages/surfaces/src/dsh/fixtures/**` -> `REFERENCE_ONLY`
  - reason: useful for preview and state modeling only
- donor local-prod helpers under `apps/backend/api-host/src/local-prod/**` -> `REFERENCE_ONLY`
  - reason: preview-only clues and no clean ownership guarantee

## Clean Target Recommendation

- build future screen-level viewmodels in `packages/surfaces/src/dsh/<surface>/<screen_id>/viewmodel.ts`
- build future service methods under `services/dsh/src/application/**` only after contract and binding phases open lawfully
- keep runtime truth out of `packages/surfaces` and out of thin app shells
- treat all current target preview routes as `fixtures-only` until W08 and W09 are opened by the execution pack

## Current Readiness Verdict

- donor binding evidence available: `YES`
- clean target binding chain present: `NO`
- donor runtime truth fully reusable: `NO`
- clean target should default to `REBUILD_CLEAN`: `YES`