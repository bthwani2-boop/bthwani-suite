# Apps and Shells

**Status:** Canonical Governance Payload v2
**Owner:** `App Shell Governance`

## App shell principle

Apps are runtime shells. They should mount navigation, providers, platform runtime, and surface entrypoints. They must not duplicate reusable design systems, service-owned business flows, or API contract truth.

## Canonical app roots

| App root | Surface | Allowed ownership | Forbidden ownership |
| --- | --- | --- | --- |
| `app-client/runtime` | app-client | mobile bootstrap, navigation, permissions, surface mount | service logic, local UI system |
| `app-partner/runtime` | app-partner | partner shell, navigation, runtime glue | DSH/WLT ownership, local brand components |
| `app-captain/runtime` | app-captain | captain shell, device permissions, route mount | order state machine outside surfaces |
| `app-field/runtime` | app-field | field shell and route mount | partner/field business logic duplication |
| `control-panel/runtime` | control-panel | Next shell, admin layout mount, auth shell | domain service ownership |
| `webapp/runtime` | webapp | web runtime shell | control-panel operations |
| `website/runtime` | website | marketing shell | live service operations |

The top-level app folders are containers. The active workspace roots are the `*/runtime` directories listed above.

## Retired path patterns

- nested mobile app roots from earlier layouts
- nested web app roots from earlier layouts

## Shell-only allowed work

- configure app providers,
- set platform navigation,
- wire public surface exports,
- handle platform-specific permissions,
- handle environment bootstrap,
- delegate UI to `@bthwani/ui-kit` and surfaces,
- delegate API to clients/contracts.

## Shell forbidden work

- direct Tamagui usage outside `@bthwani/ui-kit`,
- local Header/Card/Button systems,
- local service catalogs,
- local fee/commission/refund formulas,
- local screen state standards,
- direct mutable policy,
- hardcoded provider selection,
- hidden API endpoint definitions.

## App state and navigation evidence

UI/navigation changes require:

- target app,
- target route,
- before/after screenshot when visual,
- route/back behavior note when mobile,
- TypeScript verification,
- no unrelated app changes.

## Surface mounting law

A shell imports only stable public entrypoints. If the needed entrypoint does not exist, update the owning package first with evidence, not a deep import workaround.

## Mobile app special rules

- Expo Dev Client is canonical development model.
- Expo Go is not production/development truth.
- Native dependency changes require explicit rebuild classification.
- Hardware back behavior must be verified when navigation changes.
