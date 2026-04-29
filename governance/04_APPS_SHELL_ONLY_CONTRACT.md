# Apps Shell-Only Contract

## Purpose

Every app under `apps/` is a shell/host. It must boot the app, wire providers, route to packages, and expose the correct platform entry. It must not own product experience implementation.

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

## Required Consumption Model

Apps must consume:

```text
@bthwani/app-shells
@bthwani/surfaces public exports
@bthwani/ui-kit public exports only when necessary at app shell level
```

Apps must not bypass surface/app-shell ownership by importing internal files.

## Screen Rule

If a file is a product screen, flow, widget, order board, dashboard, wallet experience, service experience, or page body, it belongs in `packages/surfaces`, not in `apps`.

## Verification

Any app file that contains screen/domain content is a boundary risk and must be moved only in a later boundary repair phase with consumer proof.
