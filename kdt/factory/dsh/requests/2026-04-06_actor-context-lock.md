# DSH Actor/Context Lock Request

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 08 - Actor/Context Lock`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `in progress`
- BlockingGaps: `Operation lock and journey lock have not started yet`
- NextAllowed: `Create actor/context lock pack for dsh only`

## Exact Scope

- refine the bootstrap DSH actor/context foundation into a post-bootstrap actor/context lock
- define who sees DSH, where they see it, and where they must not see it
- keep all output service-scoped under `kdt/factory/dsh/`

## Desired Outputs

- refined actor/context matrix
- visibility rules
- target-fit summary
- evidence index
