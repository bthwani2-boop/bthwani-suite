# PHASE_02_REALITY_INTAKE

## 1. Purpose

Observe current target and donor reality before design decisions accelerate.

## 2. Why This Phase Exists

This phase prevents the clean repo from inheriting donor structure, route clutter, or runtime assumptions without evidence.

## 3. Preconditions / Entry Conditions

- governance core is complete enough to define boundaries
- workspace shell work is lawful
- no one is treating assumptions as observed truth

## 4. Inputs

- the governing reference
- bootstrap runbook
- current repo tree
- donor repo for observation only

## 5. Allowed Work

- create the workspace shell
- create or verify top-level structural roots
- write reality-intake artifacts
- observe services, surfaces, screens, routes, packages, contracts, and runtime truth sources

## 6. Forbidden Work

- real service implementation
- actual app feature implementation
- runtime shell creation
- contract detail build
- generated layers

## 7. Exact Execution Order

1. verify or create root shell files and governed top-level folders
2. create or verify `docs/reality-intake/`
3. write the scope of the intake
4. capture the current repo census
5. map current services
6. map current surfaces
7. inventory current screens and routes at the observation level
8. record duplication, drift, and noise findings
9. record runtime truth observations
10. review the intake for placeholders, missing sections, and hidden assumptions

## 8. Required Decisions

- what counts as observed target reality
- what counts as observed donor reality
- what remains `BLOCKED`, `GAP`, or `UNPROVEN`
- what runtime truth sources currently exist or do not exist

## 9. Required Artifacts

- `package.json`
- `pnpm-workspace.yaml`
- `nx.json`
- `tsconfig.base.json`
- `tsconfig.json`
- `docs/reality-intake/00_REALITY_INTAKE_SCOPE.md`
- `docs/reality-intake/01_REPO_CENSUS.md`
- `docs/reality-intake/02_CURRENT_SERVICES_MAP.md`
- `docs/reality-intake/03_CURRENT_SURFACES_MAP.md`
- `docs/reality-intake/04_CURRENT_SCREENS_INVENTORY.md`
- `docs/reality-intake/05_NOISE_DUPLICATION_DRIFT_REPORT.md`
- `docs/reality-intake/06_RUNTIME_TRUTH_REGISTER.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-02/root-tree.txt`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-02/workspace-shell-review.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-02/reality-intake-index.md`

## 10. Artifact Schema Expectations

`01_REPO_CENSUS.md` must include:

- major roots
- existing apps, packages, services, and docs roots
- current shell status

`04_CURRENT_SCREENS_INVENTORY.md` must include:

- observed screen families or route families
- evidence source
- whether the item is target-side or donor-side observation

`06_RUNTIME_TRUTH_REGISTER.md` must include:

- known truth sources
- known non-truth sources
- missing runtime areas
- uncertainty markers

## 11. Cross-File Updates

- ensure README and governance files do not contradict observed repo reality
- if the current repo is beyond pure bootstrap shell, note that explicitly rather than forcing rollback language

## 12. Surface Impact

- surface existence may be observed
- surface implementation remains forbidden

## 13. UI Kit Impact

- UI Kit existence may be observed
- no service-specific UI Kit growth is allowed yet

## 14. Contract Impact

- current contract roots may be observed
- no detail contract build is allowed yet

## 15. Runtime Impact

- runtime truth sources may be observed
- `runtime/` creation remains forbidden in bootstrap

## 16. Validation Checklist

- workspace shell files exist
- reality-intake docs have real observations
- target and donor observations are not blurred together
- runtime truth register exists
- no speculative runtime root was created

## 17. Exit Criteria

- repo reality is documented well enough to support value decisions
- donor observation is documented well enough to prevent blind carryover

## 18. Failure Modes / Common Mistakes

- writing headings with no observations
- confusing donor observations with target truth
- silently assuming runtime truth sources

## 19. Anti-Patterns

- "the donor repo structure is probably good enough"
- "we can skip runtime truth observation until later"
- "screen inventory can wait until screen implementation"

## 20. Handoff To Next Phase

Deliver:

- workspace shell
- observed target and donor reality
- explicit runtime observations

Next lawful file: `PHASE_03_PLATFORM_VALUE_LOCK.md`