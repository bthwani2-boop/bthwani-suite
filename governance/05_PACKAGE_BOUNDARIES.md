# Package Boundaries

**Status:** Canonical Governance Payload v2
**Owner:** `Package Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0106-20260430-221753-governance`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 03_PACKAGE_BOUNDARY_CONTRACT, UI Kit public entrypoint cleanup, package boundary guardrails

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Package role matrix

| Package | Role | Public API rule |
|---|---|---|
| `@bthwani/ui-kit` | Design authority | Only public exports from defined entrypoints. |
| `@bthwani/surfaces` | Surface and service-owned flows | Public entries per surface/service; no deep app imports. |
| `@bthwani/app-shells` | Shared shell composition | Shell exports only. |
| `@bthwani/api-types` | API type definitions | Generated/contract-derived types. |
| `@bthwani/api-clients` | Typed API clients | No UI state; no visual policy. |
| `@bthwani/media-fixtures` | Media/test fixtures | Not runtime truth. |

## Import policy

Allowed:

```ts
import { Button, Card } from '@bthwani/ui-kit';
import { DshClientSurface } from '@bthwani/surfaces';
import { createDshClient } from '@bthwani/api-clients';
```

Forbidden unless explicitly allowed by package owner:

```ts
import { XStack } from 'tamagui'; // outside ui-kit
import { Something } from '@bthwani/ui-kit/src/internal/...';
import { DshStoreCard } from '../../packages/surfaces/src/...';
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
rg "from ['\"]tamagui['\"]" apps packages/surfaces
rg "export \*" packages/ui-kit/src packages/surfaces/src
```

## Consumer impact note

A package public API change must state:

- changed export,
- consumers found,
- migration path,
- alias plan,
- rollback path,
- evidence path.

{standard_footer()}
