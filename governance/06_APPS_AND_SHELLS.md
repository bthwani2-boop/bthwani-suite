# Apps and App-Shells Contract

## Purpose

Apps are deployable shells. App-shells are reusable composition frames. Neither should own reusable business logic or design-system authority.

## App responsibilities

Apps may own:

- app bootstrap
- runtime entrypoint
- platform-specific wiring
- navigation registration
- environment selection
- dev-client integration
- app-specific configuration
- final shell composition

Apps must not own:

- duplicated UI system
- service-specific business rules
- generated contract truth
- cross-service financial truth
- shared workflow logic that belongs in `packages/surfaces`

## App-shell responsibilities

`packages/app-shells` may own:

- shared shell frame
- providers composition
- layout frame
- navigation adapters
- route metadata adapters
- safe-area/top-level shell concerns

It must not own:

- DSH/WLT/KNZ/etc service internals
- per-service screen state machines
- API endpoint definitions
- money ledger truth

## App list

- `apps/mobile/app-client`
- `apps/mobile/app-partner`
- `apps/mobile/app-captain`
- `apps/mobile/app-field`
- `apps/web/control-panel`
- `apps/web/webapp`
- `apps/web/website`

## Shell acceptance gates

A shell change requires:

- affected app list
- route/navigation impact
- platform impact
- TypeScript verification
- runtime smoke proof when behavior changes
- screenshots for visual shell changes
