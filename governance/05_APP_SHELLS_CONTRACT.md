# App Shells Contract

## Purpose

`packages/app-shells` owns reusable shell behavior, root shell layout, shell-level navigation frame, global providers, and app boot composition.

## Allowed Responsibilities

- root shell components
- mobile/web shell wrappers
- global provider composition
- navigation chrome when reusable and not service-specific
- safe-area and platform shell utilities
- app-level account or scope sheets only when they are shell-level
- bridge between apps and surfaces through public exports

## Forbidden Responsibilities

- service-specific screen bodies
- order cards, store cards, catalog flows, captain task boards as product body
- reusable design-system tokens or component families
- backend/API implementation
- service-owned business decisions
- domain-specific UI that belongs to surfaces

## Shared Folder Rule

`packages/app-shells/shared` is allowed only for shell-level shared code. It is not a dumping ground.

A shared file is allowed only if:

- it is used by more than one shell, or is deliberately prepared as shell-level shared infrastructure
- it does not include service-specific product body logic
- its consumers are documented or discoverable
- it does not duplicate ui-kit or surfaces responsibilities

## Relationship to Surfaces

App shells may compose surfaces, but must not own their internals.

```text
app -> app-shell -> surface public export
```

## Verification

Any shell file containing service/domain tokens such as DSH orders, stores, products, wallets, captains, or merchant workflows must be reviewed as a boundary candidate.
