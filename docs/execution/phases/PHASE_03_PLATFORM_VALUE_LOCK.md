# PHASE_03_PLATFORM_VALUE_LOCK

## 1. Purpose

Define what the platform is worth rebuilding now and what is explicitly out.

## 2. Why This Phase Exists

This phase prevents the project from starting every service, feature, and dream at once.

## 3. Preconditions / Entry Conditions

- reality intake exists with actual observations
- the repo can distinguish current truth from donor residue

## 4. Inputs

- reality-intake artifact set
- repo reset decision
- governance core

## 5. Allowed Work

- write value lock
- rank service candidates
- write non-goals and exclusions
- clarify first-release focus

## 6. Forbidden Work

- first-service execution before service-order lock
- broad feature decomposition for every service
- implementation justified by value assumptions alone

## 7. Exact Execution Order

1. review the reality-intake outputs
2. write `00_PLATFORM_VALUE_LOCK.md`
3. write `01_SERVICE_PRIORITY_LIST.md`
4. write `02_NON_GOALS_REGISTER.md`
5. check for contradictions between platform value and observed reality
6. record evidence for why excluded items are out now

## 8. Required Decisions

- what the platform must do now
- what is explicitly out for the current cycle
- which services rank highest and why
- what value is deferred rather than denied forever

## 9. Required Artifacts

- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-03/value-lock-review.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-03/non-goals-review.md`

## 10. Artifact Schema Expectations

`00_PLATFORM_VALUE_LOCK.md` must include:

- core platform promise
- intended first-release value
- what must be proven early

`01_SERVICE_PRIORITY_LIST.md` must include:

- candidate service slugs
- relative priority
- why each service sits where it sits

`02_NON_GOALS_REGISTER.md` must include:

- excluded areas
- why they are excluded now
- whether they are future candidates or true non-goals

## 11. Cross-File Updates

- ensure the service build-order file is not created yet as if it were already decided
- ensure value language does not contradict observed runtime or surface reality

## 12. Surface Impact

- no surface execution starts here
- surface value may influence service ranking, not screen work

## 13. UI Kit Impact

- no UI Kit expansion work is allowed here

## 14. Contract Impact

- no contract detail work is allowed here

## 15. Runtime Impact

- runtime importance may be discussed at a policy level only
- runtime implementation remains forbidden

## 16. Validation Checklist

- platform value is explicit
- first-release exclusions are explicit
- service priorities have reasons
- non-goals are not a hand-wavy dump

## 17. Exit Criteria

- the repo knows what it is trying to prove first
- the repo knows what it is not trying to prove first

## 18. Failure Modes / Common Mistakes

- treating every service as equally urgent
- using value language with no operational consequence
- writing non-goals that are really unresolved goals

## 19. Anti-Patterns

- "we will decide priorities while building"
- "everything matters now"
- "non-goals are negative and should not be written"

## 20. Handoff To Next Phase

Deliver:

- explicit value lock
- ranked service list
- explicit non-goals

Next lawful file: `PHASE_04_SERVICE_ORDER.md`