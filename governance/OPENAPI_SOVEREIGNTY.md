# OPENAPI_SOVEREIGNTY

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 05 - Master Foundation Minimal`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 05 active`
- BlockingGaps: `Screen/API matrix and gap map do not exist yet`
- NextAllowed: `Treat donor OpenAPI as evidence only until later phases`

## Sovereignty Rule

OpenAPI is not the first source of truth during bootstrap.

Canonical contract location for the clean repo:

- `contracts/master/`

The canonical contract becomes authoritative only after:

- service truth is defined
- journeys and screens have exposed actual data and action needs
- screen/API matrix work is complete
- gap analysis is complete

## Donor Contract Rule

- donor contracts may be consulted as evidence
- donor contracts may not override clean target sovereignty automatically
- no full master contract detail may be built during bootstrap phases 00-07

## Rogue Contract Truth Prohibition

- no app shell may define private canonical contract truth outside `contracts/master/`
- no package may become an alternate source of API sovereignty
- donor contract files remain evidence inputs only until the clean repo reaches the lawful contract phases

## Explicit Rejections

- reject API-first rebuild
- reject generated-client-first rebuild
- reject updating master contract shape before UX demand is known
