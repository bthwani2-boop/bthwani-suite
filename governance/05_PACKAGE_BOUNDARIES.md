# Package Boundaries

## Purpose

This file controls package-level public APIs, internal folders, barrels, deep imports, and compatibility.

## Package role matrix

| Package | Public role |
|---|---|
| `@bthwani/ui-kit` | design authority and reusable UI exports |
| `@bthwani/surfaces` | service-owned and surface-owned screens/flows |
| `@bthwani/app-shells` | app frames, providers, route/shell composition |
| `@bthwani/api-types` | shared/generated contract types |
| `@bthwani/api-clients` | typed API clients/adapters |
| service packages | backend/runtime service code |

## Export policy

- Public API must be explicit.
- Avoid `export *` when it weakens contract clarity or creates drift.
- Public exports must be stable or intentionally versioned.
- Internal modules must remain internal.
- Any public API rename requires compatibility plan or evidence that no consumers exist.

## Deep import policy

Forbidden unless explicitly documented:

```text
@bthwani/ui-kit/src/...
@bthwani/surfaces/src/...
packages/*/src/internal/...
```

Allowed:

```text
import { ... } from "@bthwani/ui-kit"
import { ... } from "@bthwani/surfaces"
```

## TypeScript policy

- No new `any` unless documented as contained and temporary.
- No type suppression without issue/evidence.
- No public type drift without contract review.
- `pnpm -w exec tsc --noEmit` is a baseline verification command for code changes.

## Boundary evidence

Package changes must include:

- changed exports
- impacted imports
- consumer list
- TypeScript output
- guard output if available
- rollback plan
