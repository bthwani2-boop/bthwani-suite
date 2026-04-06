# FOUNDATION_SCOPE

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 06 - UI Kit Foundation`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 06 active`
- BlockingGaps: `No screen-driven pattern expansion is allowed yet`
- NextAllowed: `Foundation only`

## In Scope

- token core
- typography scale
- spacing scale
- color palette
- shared direction rules
- primitive set definition
- foundation state names

## Out Of Scope

- service-specific cards
- inbox patterns
- tracking blocks
- dashboard widgets
- filter systems
- screen-family patterns
- route-aware components

## Why Service-Specific UI Is Out

- service widgets would smuggle service truth into a shared package before Phase 15 proves reuse from real retained screens
- service-owned screen families must remain with the owning service until screen demand is explicit and reusable across lawful surfaces
- adding service widgets now would bypass the bootstrap law that foundation must stay generic and reviewable only

## Why Screen Ingestion Is Not Allowed Yet

- this phase creates reviewable primitives and shared state shells only; it does not authorize candidate-screen work by itself
- screen ingestion starts only after later service truth, journey, and screen phases define actual retained screens
- visual completion of a foundation package is not proof that screen-level components are lawful or reusable yet

## Rule

This package exists only as shared UI foundation at this phase.
It must not absorb service truth or screen-specific component families yet.
