# DSH Root Migration Notes

Status: ACTIVE_MIGRATION_NOTE

This pilot created the root scaffold and the root bridge entrypoint only.

No source files were moved.

Next DSH phase must decide whether to move frontend slices from:

```text
packages/surfaces/src/service-owned/dsh
```

to:

```text
dsh/frontend
```

That move is forbidden until evidence proves import parity, route and catalog parity, TypeScript safety, and runtime safety.
