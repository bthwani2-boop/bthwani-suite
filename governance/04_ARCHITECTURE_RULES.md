# Architecture Rules

**Status:** Canonical Governance Payload v2
**Owner:** `Architecture Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** ARCHITECTURE_LOCK, ARCHITECTURE_GUARDRAILS, SURFACES_OWNERSHIP_CONTRACT, SCREEN_FILE_MODEL_CONTRACT

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Canonical dependency direction

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

For domain UI:

```text
app shell
→ packages/app-shells
→ packages/surfaces public entry
→ service-owned or surface-owned implementation
→ @bthwani/ui-kit
```

## Ownership lanes

| Lane | Path | Owns | Must not own |
|---|---|---|---|
| App shell | `apps/*` | bootstrapping, navigation mount, platform runtime | design system, service logic, reusable domain UI |
| App shells package | `packages/app-shells` | shared shell composition | domain business logic |
| Surface-owned | `packages/surfaces/src/surface-owned/*` | shared surface experiences | service-specific workflow |
| Service-owned | `packages/surfaces/src/service-owned/<service>/<surface>` | service vertical flow | global shell or unrelated service |
| UI Kit | `packages/ui-kit` | tokens, primitives, reusable components | service business rules |
| API types/clients | `packages/api-*` | typed contracts/clients | UI behavior |
| Services | `services/*` | backend domain implementation | UI policy |

## Service-owned vs surface-owned

Use service-owned when the feature cannot exist without a specific service lifecycle.

Examples:

```text
DSH order timeline
DSH store catalog
DSH captain assignment
WLT settlement ledger
AMN incident review
```

Use surface-owned when the feature is global to a surface:

```text
global notifications
global account shell
global app search
control-panel home frame
```

If a global feature links to a service, the shell remains surface-owned and the service-specific detail remains service-owned.

## Screen file law

A screen file may orchestrate but must not become a local platform:

Allowed:

- compose imported public components,
- call public surface/service entrypoints,
- pass typed props,
- handle navigation glue.

Forbidden:

- local tokens,
- local primitive library,
- duplicated cards/buttons/headers,
- direct Tamagui import outside ui-kit,
- direct backend fetch if API client exists,
- hidden service state machine.

## State law

Every visible flow must define or inherit states:

```text
loading
empty
error
success
offline
disabled
permission-denied
partial-data
```

State components should be centralized through `@bthwani/ui-kit` unless service-specific.

## Cross-service law

Cross-service behavior requires an explicit boundary contract. DSH may request WLT financial projections; it may not mutate WLT ledger. Control panel may operate across services; it may not become owner of their domain truths.

## Architecture acceptance

A change passes this file only when:

- changed paths match ownership lane,
- imports follow dependency direction,
- no local design/API/service truth is introduced,
- cross-service contracts are typed and evidenced,
- diff contains no broad refactor outside scope.
