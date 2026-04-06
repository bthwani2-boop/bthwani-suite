# PHASE_04_SERVICE_ORDER

## 1. Purpose

Select exactly one first service and reject uncontrolled parallel deep start.

## 2. Why This Phase Exists

This phase prevents the repo from fragmenting into multiple partial service tracks before one service has truth, proof, and closure.

## 3. Preconditions / Entry Conditions

- platform value lock exists
- service priority reasoning exists
- the repo is ready to pick one first service

## 4. Inputs

- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`

## 5. Allowed Work

- choose the first service
- justify the choice
- reject parallel deep service start

## 6. Forbidden Work

- selecting multiple first services
- starting service implementation without formal order lock
- pretending the first service is obvious without evidence

## 7. Exact Execution Order

1. review the service priority list
2. choose exactly one first service
3. write `docs/services/00_SERVICE_BUILD_ORDER.md`
4. record the reason for selection and the rejection of parallel deep start
5. cross-check that the chosen service aligns with platform value and current reality

## 8. Required Decisions

- the first service slug
- why it is first
- why other services are deferred

## 9. Required Artifacts

- `docs/services/00_SERVICE_BUILD_ORDER.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-04/service-order-decision.md`

## 10. Artifact Schema Expectations

`00_SERVICE_BUILD_ORDER.md` must include:

- ordered service list or at least first-service lock plus deferred set
- explicit first service
- rationale
- no-parallel-deep-start rule

`service-order-decision.md` must include:

- evidence used
- rejected alternatives
- any remaining `[TBD]` risks

## 11. Cross-File Updates

- keep platform value lock and service order aligned
- do not start per-service foundation files for multiple services

## 12. Surface Impact

- no surface execution begins yet
- surface implications remain service-selection context only

## 13. UI Kit Impact

- no service-specific UI Kit work begins yet

## 14. Contract Impact

- no service-specific contract work begins yet

## 15. Runtime Impact

- no runtime work begins yet

## 16. Validation Checklist

- exactly one first service is selected
- the reason is documented
- the repo does not pretend multiple services are equally active

## 17. Exit Criteria

- the first service is locked clearly enough to support service-foundation work

## 18. Failure Modes / Common Mistakes

- choosing one public first service while secretly starting another
- picking a first service with no evidence trail

## 19. Anti-Patterns

- "we can start three services lightly"
- "the order is obvious and does not need a file"

## 20. Handoff To Next Phase

Deliver:

- explicit first-service selection
- explicit rejection of deep parallel start

Next lawful file: `PHASE_05_MASTER_FOUNDATION_MINIMAL.md`