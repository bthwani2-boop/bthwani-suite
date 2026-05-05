# control-panel Runtime

Status: MIGRATION_SCAFFOLD

Target root for control-panel runtime boot, environment wiring, and platform entry.

Current runtime remains under:

```text
apps/web/control-panel
```

Current known runtime commands remain owned by the existing app project until a later verified migration phase:

```text
pnpm --dir apps/web/control-panel dev
pnpm --dir apps/web/control-panel build
```

Phase 3 control-panel pilot does not move runtime files and does not change Nx or project configuration.
