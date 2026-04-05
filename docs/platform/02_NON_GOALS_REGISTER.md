# 02_NON_GOALS_REGISTER

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 03 - Platform Value Lock`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 03 active`
- BlockingGaps: `Later implementation phases are not unlocked`
- NextAllowed: `Use these non-goals to reject premature expansion`

## Current Non-Goals

The following are explicitly out of scope at this stage:

- rebuilding all services in parallel
- copying donor repo structure for convenience
- detailed master OpenAPI construction
- generated API clients or generated API types
- binding implementation
- runtime stack creation in the target repo
- production-like verification
- service-specific UI Kit patterns
- full screen implementation
- performance tuning or optimization work

## First-Release Exclusions

The first governed release wave must exclude:

- second-service execution before the first service is sealed with evidence
- full control-panel breadth across all IA domains at once
- broad finance tooling beyond what the first chosen service actually requires
- donor parity as a success condition
- full route trees for every surface

## Explicit Rejection Rules

- reject “rebuild the whole platform first”
- reject “generate clients before UX demand is known”
- reject “start runtime to discover the model later”
- reject “use donor naming as current truth”
- reject “treat placeholder scaffolds as completion”

## Why These Non-Goals Exist

- to protect bootstrap focus
- to keep one service under governance at a time
- to avoid importing donor entropy into the clean repo
- to delay runtime and binding cost until they are justified
