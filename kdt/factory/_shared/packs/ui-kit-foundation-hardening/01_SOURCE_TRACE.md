# Source Trace

## Source 1 — Legacy Repo Screen Reality

- `apps/web/mcpw/app/**/page.tsx` proved heavy `page`-driven control-panel routing and preserved the continuity need for the internal name normalization `mcpw -> control-panel`
- `apps/mobile/app-user/**` proved the old end-user surface naming that must normalize to `app-client`
- donor screen families repeatedly exposed search, list/detail, card, state, section-header, and sheet-style composition demand

## Source 2 — Legacy Repo UI Kit Concepts

- `packages/ui-kit/src/foundation/typography/typography.ts` proved the need for richer typography roles, weight tiers, and semantic text mapping
- `packages/ui-kit/src/foundation/layout/contracts.ts` proved that logical spacing and content-width contracts belong centrally, not inside screens
- `packages/ui-kit/src/patterns/states/AppStatePrimitives.tsx` and `packages/ui-kit/src/testing/gallery/UiKitReferenceGallery.tsx` proved the mandatory state-family set: loading, empty, no-results, success, warning, recoverable error, blocking error, offline, unauthorized, and not-found
- `packages/ui-kit/src/foundation/semantics/semantic-roles.ts` proved the value of richer semantic roles, but also showed legacy overgrowth and service-specific leakage that should not be copied blindly

## Source 3 — Current New Repo UI Kit Reality

- current `packages/ui-kit` already had generic components and pattern shells, but lacked explicit `states/` ownership and richer semantic/direction contracts
- the root export surface existed, but path aliases for `@bthwani/ui-kit` were missing from the workspace
- the package documentation and Phase 06 evidence no longer matched the actual file tree and export surface

## Classification Summary

- `KEEP_NAME_REBUILD_CLEAN`: `mcpw -> control-panel`, `app-user -> app-client`
- `KEEP_PATTERN_REBUILD_CLEAN`: state families, logical direction helpers, search/list/detail building blocks, card/header/sheet primitives
- `KEEP_CONCEPT_ONLY`: canonical layout contracts and premium semantic color hierarchy
- `REJECT_AS_LEGACY_NOISE`: service-specific semantic branches like `captainState`, preview galleries as authority, and overgrown auth/navigation/runtime concerns inside ui-kit
- `QUARANTINE_FOR_REFERENCE`: donor testing gallery, old public export maze, and service-driven shell wiring