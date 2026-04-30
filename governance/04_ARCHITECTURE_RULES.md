# Architecture Rules

## Core architecture ladder

`Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only`

## Dependency direction

Allowed:

```text
apps -> packages/app-shells -> packages/surfaces -> packages/ui-kit
apps -> packages/api-clients -> packages/api-types
services -> contracts/master
packages/api-types/api-clients -> contracts/master
```

Forbidden:

```text
packages/ui-kit -> apps
packages/ui-kit -> service-owned surfaces
services -> apps
screens -> Tamagui directly
screens -> local duplicated design system
surface-owned -> service-owned internals without contract
```

## Service-owned vs surface-owned

- `packages/surfaces/src/service-owned/<service>/<surface>/` owns service-specific user journeys.
- `packages/surfaces/src/surface-owned/<surface>/` owns generic surface experiences shared across services.
- A global notification/search/control pattern is surface-owned unless it requires service-specific state or action.

## Boundary decision protocol

Before moving code across ownership boundaries:

1. Identify current owner.
2. Identify target owner.
3. Identify consumers.
4. Check public exports.
5. Check runtime routes.
6. Check tests/guards.
7. Record evidence.
8. Apply only inside approved scope.

## State coverage law

Every screen/flow affected by implementation must define or preserve:

- loading
- empty
- error
- success
- offline
- disabled
- permission denied
- partial data
- retry

## No hidden runtime law

A UI improvement may not silently introduce API, backend, binding, persistence, or environment behavior unless the task explicitly includes that phase.

## Architecture acceptance

A change is architecture-safe only when:

- imports respect allowed direction
- public exports are intentional
- package boundaries remain clear
- no local fork of a central component appears
- `tsc` and relevant guards pass
- diff scope matches the task
