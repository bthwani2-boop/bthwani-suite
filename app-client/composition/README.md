# app-client Composition

Status: MIGRATION_SCAFFOLD

Target root for app-client composition and service registry.

Allowed future role:

```text
compose dsh/frontend/app-client
compose wlt/frontend/app-client
compose knz/frontend/app-client
compose arb/frontend/app-client
compose amn/frontend/app-client
compose esf/frontend/app-client
compose mrf/frontend/app-client
compose snd/frontend/app-client
compose kwd/frontend/app-client
```

This folder must not own service internals.

Phase 3 app-client pilot does not change imports and does not move public surface registries.
