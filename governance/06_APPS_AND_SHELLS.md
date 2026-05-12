# Apps and Shells

**Status:** Canonical Governance Payload v2
**Owner:** `App Shell Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 04_APPS_SHELL_ONLY_CONTRACT, APPROVED_SURFACE_NAMING, platform app roots

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## App shell principle

Apps are runtime shells. They should mount navigation, providers, platform runtime, and surface entrypoints. They must not duplicate reusable design systems, service-owned business flows, or API contract truth.

## Canonical app roots

| App root | Surface | Allowed ownership | Forbidden ownership |
| --- | --- | --- | --- |
| app-client | app-client | mobile bootstrap, navigation, permissions, surface mount | service logic, local UI system |
| app-partner | app-partner | partner shell, navigation, runtime glue | DSH/WLT ownership, local brand components |
| app-captain | app-captain | captain shell, device permissions, route mount | order state machine outside surfaces |
| app-field | app-field | field shell and route mount | partner/field business logic duplication |
| control-panel | control-panel | Next shell, admin layout mount, auth shell | domain service ownership |
| webapp | webapp | web runtime shell | control-panel operations |
| website | website | marketing shell | live service operations |

## Legacy bridge roots

- legacy nested mobile app roots from earlier layouts
- legacy nested web app roots from earlier layouts

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
