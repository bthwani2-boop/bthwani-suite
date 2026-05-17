# DSH Client App-Scope Standardization

## Purpose

This document defines the repeatable structure for closing a service-owned customer surface inside `app-client` without turning the service into its own app shell and without leaking financial ownership out of WLT.

## Scope Rings

1. `dsh/frontend/app-client/**`
2. `wlt/frontend/app-client/dsh/**`
3. `wlt/frontend/shared/finance/**`
4. `app-client/composition/**`
5. `app-client/shell/**`
6. `dsh/frontend/shared/**`

## Ownership Rules

- App-owned screens use `ownerKind: 'app'` and `ownerId: 'app-client'`.
- DSH-owned screens use `ownerKind: 'service'`, `ownerId: 'dsh'`, and `serviceId: 'dsh'`.
- WLT-owned DSH integration uses `ownerKind: 'integration'`, `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, and `linkedServiceId: 'dsh'`.
- No `core` service may appear in client-surface metadata for this closure.

## Canonical DSH Client Structure

```text
dsh/frontend/app-client/
├─ index.ts
├─ DshClientSurface.tsx
├─ dsh-client.routes.ts
├─ dsh-client.screen-registry.ts
├─ dsh-client.types.ts
├─ screens/
├─ parts/
├─ data/
└─ shared/
```

## DSH Preferences Rule

`PreferencesScreen` belongs to DSH only when it covers service-specific delivery preferences such as delivery instructions, substitution behavior, DSH notifications, captain contact preference, and location handoff preference.

The screen must not absorb profile, wallet, identity, security, or global account settings.

## WLT Bridge Rule

DSH may consume WLT wallet/payment preview behavior only through a public bridge path under `wlt/frontend/app-client/dsh/**`.

Any preview-only money or wallet values must remain annotated as preview-only and non-accounting.

## Current Execution Note

This standardization is closed. The live DSH host consumes canonical `screens/`, `parts/`, `data/`, and `shared/` entrypoints, and the WLT DSH bridge exposes canonical root files under `wlt/frontend/app-client/dsh/`.

Static closure gates passed, and runtime evidence was captured for the reachable control-panel runtime and the connected adb environment in the active evidence pack.
