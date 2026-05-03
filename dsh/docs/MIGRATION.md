# DSH Root Migration Notes

Status: ACTIVE_MIGRATION_NOTE

This pilot now includes a partial frontend slice move into the root service.

Moved frontend implementation from:

```text
packages/surfaces/src/service-owned/dsh
```

to:

```text
dsh/frontend
```

`control-panel`, `app-partner`, `app-captain`, and `app-field` now live under `dsh/frontend`.
`app-client` and `shared` were returned to `packages/surfaces/src/service-owned/dsh` after Expo/Metro runtime evidence showed root-owned resolution breakage.
Future phases must prove import parity, route and catalog parity, TypeScript safety, and runtime safety before claiming deeper closure.
