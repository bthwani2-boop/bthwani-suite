# control-panel Composition

Status: MIGRATION_SCAFFOLD

Target root for control-panel composition and service registry.

Allowed future role:

```text
compose dsh/frontend/control-panel
compose wlt/frontend/control-panel-wlt
compose knz/frontend/control-panel
compose arb/frontend/control-panel
compose amn/frontend/control-panel
compose esf/frontend/control-panel
compose mrf/frontend/control-panel
compose snd/frontend/control-panel
compose kwd/frontend/control-panel
```

This folder must not own service internals.

Phase 3 control-panel pilot does not change imports and does not move public surface registries.
