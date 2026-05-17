# Package Boundaries

**Status:** Canonical Governance Payload v2
**Owner:** `Package Governance`

## Package role matrix

| Boundary | Role | Public API rule |
|---|---|---|
| `@bthwani/ui-kit` | Design authority | Only public exports from defined entrypoints. |
| `<service>/frontend/<surface>` public entrypoint | Service-owned surface flow | Export stable surface entry; no deep imports into another app/runtime. |
| `<service>/frontend/shared` | Service-local shared UI/state glue | Shared within one service only. |
| `<service>/backend/contracts.ts` | Service contract entrypoint | Generated or contract-derived types stay behind service-local backend boundaries. |
| `<service>/backend/client.ts` | Typed API clients | No UI state; no visual policy. |
| service-local fixture roots such as `dsh/media-fixtures` | Media/test fixtures | Not runtime truth. |

## Import policy

Allowed:

```text
@bthwani/ui-kit
<service>/frontend/<surface> public entrypoint
<service>/backend/client typed client
```

Forbidden unless explicitly allowed by package owner:

```ts
import { XStack } from 'tamagui'; // outside ui-kit
import { Something } from '@bthwani/ui-kit/src/internal/...';
import { DshStoreCard } from '../../other-service/frontend/...';
```

## Export policy

- Prefer named exports.
- Avoid `export *` when it weakens ownership clarity.
- Every public export must be documented or covered by a package contract.
- Breaking public export changes require consumer scan and checkpoint.
- Compatibility alias is allowed only for public API migration, not for internal cleanup.

## TypeScript law

Forbidden:

```text
unjustified any
implicit broad unknown-to-any casts
silent type suppression
ts-ignore without owner/expiry
runtime schema drift from OpenAPI
```

Allowed only with evidence:

```text
narrow unknown
validated parsing
compat alias
typed adapter
```

## Package boundary evidence

Minimum package boundary change evidence:

```powershell
pnpm -w exec tsc --noEmit
git --no-pager diff --check
rg "from ['\"]tamagui['\"]" app-client app-partner app-captain app-field control-panel webapp website dsh wlt knz arb amn esf mrf snd kwd
rg "export \*" ui-kit/src dsh/frontend
```

## Consumer impact note

A package public API change must state:

- changed export,
- consumers found,
- migration path,
- alias plan,
- rollback path,
- evidence path.
