# DSH Root Migration Notes

Status: ACTIVE_MIGRATION_NOTE

`dsh/` is the target and current service root for this parity phase.

Current frontend implementation is rooted under:

```text
dsh/frontend
```

`app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel` are currently present under `dsh/frontend`.

`packages/surfaces/src/service-owned/dsh` is not the current source of truth for this root parity slice unless a separate evidence-backed decision restores it.

This migration note does not imply backend, runtime, API, or Expo/Metro closure.
Those remain `NEEDS_EVIDENCE` until verified in this branch.

Future phases must still prove import parity, route/catalog parity, TypeScript safety, and runtime safety before deeper closure is claimed.
