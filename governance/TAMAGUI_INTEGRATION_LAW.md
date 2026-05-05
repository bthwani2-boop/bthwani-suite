# Tamagui Integration Law

Status: CANONICAL
Scope: BThwani UI architecture and guard enforcement
Owner: Governance / UI Kit

## Law

Tamagui is approved only as a private implementation engine.

The only normal source scope allowed to import Tamagui directly is packages/ui-kit/**.

The only root-level build-time exception is the exact file tamagui.build.ts.

This is an exact-path build-time exception.

Tamaguiprovider must be owned by UI Kit only.

foundation.ts is the design-token source of truth.

tamagui-config.ts is an adapter only.

Any violation is a governance blocker.

## Import Contract

Screen / Surface / App code must import public UI primitives and patterns from @bthwani/ui-kit public exports.

Screen / Surface / App code must not import from tamagui or @tamagui/*.

## Runtime Contract

TamaguiProvider ownership stays inside the UI Kit provider layer. Apps and surfaces consume the composed provider through the approved public UI Kit integration only.

## Design Token Contract

BThwani identity colors are governed through UI Kit tokens and foundation files. Do not create a local design system in apps or surfaces.

## Enforcement

The following guards enforce this law:

```text
pnpm -w run guard:tamagui-law
pnpm -w run guard:tamagui-import-boundary
```

Violations must be fixed at the source or explicitly documented as blocked with evidence.
