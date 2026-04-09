# @bthwani/ui-kit

`@bthwani/ui-kit` is the centralized UI authority package for BThwani. It is not treated as a generic component dump; it is the single source of truth for foundational visual language, direction behavior, shared state families, and the base primitives that later screens must consume.

## What this hardening pass strengthens

- richer semantic color and surface roles for premium light/dark rendering
- direction and language-aware helpers that own start/end behavior centrally
- explicit state catalog for mandatory loading/empty/error/offline/recovery families
- stronger primitives so spacing, borders, surface tone, and layout direction stay centralized
- cleaner adoption readiness through `@bthwani/ui-kit` path mapping for the workspace

## Current package layers

- `foundation/tokens`
- `foundation/themes`
- `foundation/direction`
- `providers`
- `hooks`
- `primitives`
- `states`
- `components`
- `patterns`
- `adapters`
- `docs`

## Governance sources

- parent authority: [docs/BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./docs/BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)
- execution plan: [docs/BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./docs/BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)
- ownership and precedence: [docs/OWNERSHIP_AND_RULES.md](./docs/OWNERSHIP_AND_RULES.md)
- component constitution: [docs/COMPONENT_CONSTITUTION.md](./docs/COMPONENT_CONSTITUTION.md)
- accessibility law: [docs/ACCESSIBILITY_LAW.md](./docs/ACCESSIBILITY_LAW.md)
- token governance: [docs/TOKEN_GOVERNANCE_LAW.md](./docs/TOKEN_GOVERNANCE_LAW.md)
- pattern promotion: [docs/PATTERN_PROMOTION_CONTRACT.md](./docs/PATTERN_PROMOTION_CONTRACT.md)
- quality gates and screen entry: [docs/QUALITY_GATES_AND_SCREEN_ENTRY.md](./docs/QUALITY_GATES_AND_SCREEN_ENTRY.md)

## Runtime outputs

- token output APIs now live under `foundation/tokens/outputs`
- theme output APIs now live under `foundation/themes/outputs`
- web root CSS variables are generated from the same theme source consumed by native modes
- generated proof artifacts are written to [docs/generated/proof-manifest.md](./docs/generated/proof-manifest.md) and adjacent output files via `pnpm nx run ui-kit:build-outputs`

## Proof stack

- live lab exports: `BthComponentLab`, `BthStateGallery`
- hosted preview route: `website:/ui-kit`
- visual regression and interaction proof: `apps/web/website/playwright.config.ts` and `apps/web/website/e2e/ui-kit-preview.spec.ts`
- verification targets: `pnpm nx run ui-kit:typecheck`, `pnpm nx run ui-kit:build-outputs`, `pnpm nx run ui-kit:proof`

## Phase boundary note

Phase 06 authorizes foundation hardening, primitives, direction, and shared state shells. Generic component folders currently exist in the package, but screen-family promotion and pilot validation surfaces remain blocked until later lawful phases prove retained-screen demand.

## Adoption intent

This package should eliminate local visual drift by making theme, typography, direction, state framing, and baseline building blocks flow from a single shared owner instead of being recreated per surface.

- hosted preview boundary: `packages/ui-kit/docs/HOSTED_PREVIEW_BOUNDARY_DECISION.md`

