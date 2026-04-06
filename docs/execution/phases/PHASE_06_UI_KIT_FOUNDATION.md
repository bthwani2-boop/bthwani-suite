# PHASE_06_UI_KIT_FOUNDATION

## 1. Purpose

Build shared UI foundation only and prepare it for later screen-ingestion review without turning it into a feature library.

## 2. Why This Phase Exists

This phase prevents later screen work from either inventing primitives ad hoc or polluting UI Kit with service-specific widgets too early.

## 3. Preconditions / Entry Conditions

- minimal naming and ownership law is complete
- package boundaries are explicit
- no service-specific UI pressure is being smuggled in as shared law

## 4. Inputs

- approved surface naming
- direction and i18n ownership law
- package boundary law

## 5. Allowed Work

- create the `packages/ui-kit/` foundation shell
- define tokens, typography, spacing, colors, direction utilities, primitives, and state shells
- define scope boundaries in `FOUNDATION_SCOPE.md`
- prepare evidence for later UI Kit compatibility review

## 6. Forbidden Work

- service-specific widgets
- queue, tracking, inbox, or dashboard families tied to one service
- business logic in UI Kit
- preview screens inside UI Kit

## 7. Exact Execution Order

1. create or verify the `packages/ui-kit/` package shell
2. define the package entry points and TypeScript configuration
3. add token exports
4. add typography exports
5. add spacing exports
6. add color exports
7. add direction utilities
8. add base primitives
9. add shared state shells
10. write `FOUNDATION_SCOPE.md` with in-scope and out-of-scope boundaries
11. review the package for service leakage and business logic leakage
12. deposit evidence for later compatibility review

## 8. Required Decisions

- what belongs in the foundation layer now
- what is explicitly out until real screens demand it
- whether exports are clean enough for later screen ingestion review

## 9. Required Artifacts

- `packages/ui-kit/package.json`
- `packages/ui-kit/project.json`
- `packages/ui-kit/tsconfig.json`
- `packages/ui-kit/src/index.ts`
- `packages/ui-kit/src/tokens/index.ts`
- `packages/ui-kit/src/typography/index.ts`
- `packages/ui-kit/src/spacing/index.ts`
- `packages/ui-kit/src/colors/index.ts`
- `packages/ui-kit/src/direction/index.ts`
- `packages/ui-kit/src/primitives/index.ts`
- `packages/ui-kit/src/states/index.ts`
- `packages/ui-kit/docs/FOUNDATION_SCOPE.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-06/ui-kit-foundation-inventory.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-06/token-scope-review.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-06/foundation-boundary-review.md`

## 10. Artifact Schema Expectations

`FOUNDATION_SCOPE.md` must include:

- what is in scope now
- what is explicitly out now
- why service-specific UI is out
- why screen ingestion is not yet allowed from this phase alone

`foundation-boundary-review.md` must include:

- service leakage check
- business logic leakage check
- export cleanliness check
- readiness notes for later compatibility gate

## 11. Cross-File Updates

- ensure UI Kit naming matches governance naming and direction law
- ensure no preview or screen registry files exist under UI Kit

## 12. Surface Impact

- no surface screens or app-shell preview routes are allowed from this phase alone

## 13. UI Kit Impact

- this phase defines the entire lawful scope of UI Kit work in bootstrap
- the result must be reviewable later by a compatibility gate before screens start

## 14. Contract Impact

- no contract work is allowed

## 15. Runtime Impact

- no runtime work is allowed

## 16. Validation Checklist

- UI Kit exists as a package
- the package contains foundation exports only
- no service widgets exist
- no business logic exists
- the package is reviewable for later compatibility checks

## 17. Exit Criteria

- UI Kit foundation exists with clean exports and explicit scope boundaries

## 18. Failure Modes / Common Mistakes

- adding service widgets because they seem reusable later
- mixing business logic into primitives
- treating visual completion as readiness proof without a later compatibility gate

## 19. Anti-Patterns

- "let's put this screen family in UI Kit now and decide later"
- "state shells can stay local until screens arrive"
- "preview components belong in UI Kit"

## 20. Handoff To Next Phase

Deliver:

- UI Kit foundation package
- scope boundaries
- evidence for later compatibility review

Next lawful file: `PHASE_07_FIRST_SERVICE_FOUNDATION.md`