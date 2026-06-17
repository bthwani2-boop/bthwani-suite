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
| real media runtime and media API/storage ownership | Runtime media | Runtime truth is backend/API/storage guarded by `guard:real-media-runtime`. |

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

## Workspace model — monorepo with central installation

BThwani is a single monorepo with central installation from the root. This model is non-negotiable.

| Rule | Canonical behavior |
|---|---|
| Installation root | `C:\bthwani-suite` only — run `pnpm install` from root |
| Lockfile | One `pnpm-lock.yaml` at the monorepo root; no lockfile inside any service |
| Workspace definition | `pnpm-workspace.yaml` at root is the single workspace roots source |
| Service isolation | Each service is logically independent but not a separate repo or install target |
| Filtered execution | Run service scripts via `pnpm --filter @bthwani/<service> run <script>` from root |
| `node_modules` | Only at root; never inside a service directory |

### Active workspace packages (now)

| Package name | Path | Status |
|---|---|---|
| `@bthwani/dsh` | `dsh/` | ACTIVE — has `package.json` with verifiable scripts |
| `@bthwani/wlt` | `wlt/` | ACTIVE — has `package.json` with verifiable scripts |

### Reserved service slots (future)

The following services are reserved service slots. They have code structure but are NOT active workspace packages:

`knz`, `arb`, `amn`, `esf`, `mrf`, `snd`, `kwd`

These must NOT have a `package.json` until real implementation begins. Activation requires:
1. A real `package.json` with a verifiable `check` script (not an echo placeholder).
2. A `SERVICE_BLUEPRINT.md` in `<service>/docs/`.
3. An approved OpenAPI contract file.
4. The service added to `pnpm-workspace.yaml` (uncommented).

### Orchestration package rules

Active service packages (`dsh`, `wlt`) are orchestration packages — not standalone Node projects:
- No independent `dependencies` or `devDependencies` unless directly required by a verifiable script.
- All shared tooling (spectral, typescript, etc.) installs at the monorepo root.
- Scripts must be verifiable (real command output, not echo-only) to count as a check.

Guard enforcement: `tools/guards/guard-service-workspace-model.mjs` (ID: `GUARD_SERVICE_WORKSPACE_MODEL`)

## Package boundary evidence

Minimum package boundary change evidence:

```powershell
git --no-pager diff --check
# Prefer targeted typecheck for the affected package/export surface.
# Workspace `tsc` is reserved for broad export churn, architecture changes, or explicit human request.
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
