---
generatedFrom: governance/04_APPS_SHELL_ONLY_CONTRACT.md
generatedAt: 2026-04-30T04:48:37.1589170+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Apps And App-Shells Boundary Contract

## Purpose

Every app under `apps/` is a shell/host, and `packages/app-shells` owns reusable shell composition. Together they must boot the app, wire providers, route to packages, and expose the correct platform entry without owning product experience implementation.

## Applies To

```text
apps/mobile/app-client
apps/mobile/app-partner
apps/mobile/app-captain
apps/mobile/app-field
apps/web/control-panel
apps/web/webapp
apps/web/website
```

## Allowed Responsibilities

- app entrypoint
- platform boot
- root provider wiring
- navigation host
- route registration
- app-specific environment wiring
- surface composition through public package exports
- minimal platform glue required by Expo/Next

## App-Shell Responsibilities

`packages/app-shells` owns reusable shell behavior, root shell layout, shell-level navigation frame, global providers, and shell composition between apps and surfaces.

Allowed responsibilities:

- root shell components
- mobile and web shell wrappers
- global provider composition
- navigation chrome when reusable and not service-specific
- safe-area and platform shell utilities
- app-level account or scope sheets only when they are truly shell-level
- bridge between apps and surfaces through public exports

## Forbidden Responsibilities

- service-owned screen bodies
- business/domain logic
- local design systems
- reusable UI components
- hardcoded brand palettes
- mock domain data as real product data
- direct backend/service implementation
- cross-app imports
- deep imports into package internals

The same prohibition applies to `packages/app-shells`: it must not own service-specific screen bodies, domain-specific UI, reusable design-system primitives, or backend/API implementation.

## Required Consumption Model

Apps must consume:

```text
@bthwani/app-shells
@bthwani/surfaces public exports
@bthwani/ui-kit public exports only when necessary at app shell level
```

Apps must not bypass surface/app-shell ownership by importing internal files.

App shells may compose surfaces, but must not own their internals:

```text
app -> app-shell -> surface public export
```

`packages/app-shells/shared` is allowed only for shell-level shared code. It is not a dumping ground.

A shared shell file is allowed only if:

- it is used by more than one shell, or is deliberately prepared as shell-level shared infrastructure
- it does not include service-specific product body logic
- its consumers are documented or discoverable
- it does not duplicate ui-kit or surfaces responsibilities

## Screen Rule

If a file is a product screen, flow, widget, order board, dashboard, wallet experience, service experience, or page body, it belongs in `packages/surfaces`, not in `apps`.

## Verification

Any app file that contains screen/domain content is a boundary risk and must be moved only in a later boundary repair phase with consumer proof.

Any shell file containing service or domain tokens such as DSH orders, stores, products, wallets, captains, or merchant workflows is also a boundary risk and must be reviewed as a shell-ownership candidate.

