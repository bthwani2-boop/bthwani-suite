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

## Generated And Binding Truth Rule

When generated layers are introduced later, they remain derived truth only.

Rules:

- generated outputs must be produced from canonical contract truth under `contracts/master/`
- generated outputs may not become the canonical API source of truth
- generated outputs may not be hand-maintained as if they were source truth
- if generated output needs to change, update canonical contract truth first and regenerate from it

## Canonical Access Chain Rule

Apps, packages, and services may not invent side-contract truth or hidden client truth outside the lawful chain.

Rules:

- no app or package may introduce a private endpoint map, side contract, or alternate operation identity as if it were canonical truth
- once canonical binding begins in later phases, raw fetch and hidden endpoint literals are not lawful substitutes for the canonical client and binding chain
- convenience adapters may wrap lawful generated or bound outputs, but they may not redefine contract truth or operation identity

## Explicit Rejections

- reject API-first rebuild
- reject generated-client-first rebuild
- reject updating master contract shape before UX demand is known
