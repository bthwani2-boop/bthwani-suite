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

## Phase boundary note
Phase 06 authorizes foundation hardening, primitives, direction, and shared state shells. Generic component folders currently exist in the package, but screen-family promotion and pilot validation surfaces remain blocked until later lawful phases prove retained-screen demand.

## Adoption intent
This package should eliminate local visual drift by making theme, typography, direction, state framing, and baseline building blocks flow from a single shared owner instead of being recreated per surface.
