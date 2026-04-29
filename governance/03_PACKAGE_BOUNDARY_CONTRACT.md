# Package Boundary Contract

## Purpose

This contract defines the mandatory ownership and dependency boundaries for `C:\bthwani-suite`.

## Canonical Direction

```text
apps -> packages/app-shells -> packages/surfaces -> packages/ui-kit
surfaces -> packages/api-clients -> packages/api-types -> contracts
services -> contracts/api/domain implementation
```

The direction is conceptual. Actual imports must remain within public package exports and approved contracts.

## Package Roles

| Area | Role | Must Not Own |
|---|---|---|
| `apps/*` | host/shell only | service screens, business logic, reusable design system, API implementation |
| `packages/app-shells` | root shell behavior, navigation frame, providers, boot composition | service-owned screen bodies, domain logic, reusable visual system |
| `packages/surfaces` | screens, flows, experiences, surface orchestration | reusable design tokens, backend implementation, app boot logic |
| `packages/ui-kit` | reusable design authority | service/domain content, app-specific flow logic, API calls |
| `packages/api-types` | API type contracts when present | UI, runtime networking, service business logic |
| `packages/api-clients` | typed API clients when present | UI, screens, app shell, backend implementation |
| `contracts` | OpenAPI/contract source when present | UI, screens, shell logic |
| `services` | backend/domain runtime when present | UI screens, app-shell behavior, ui-kit components |

## Import Rules

- Apps consume public exports only.
- App shells consume public exports only.
- Surfaces consume `@bthwani/ui-kit` public exports for UI.
- UI kit must not import from apps, surfaces, app-shells, services, or service-owned code.
- Service-owned surfaces must not cross-import another service implementation without an explicit contract.
- Surface-owned code must not secretly own service-specific logic.
- Deep imports are suspect unless explicitly approved and guarded.
- Public exports must be small, intentional, and stable.

## Forbidden Patterns

- `apps/*` importing another app.
- `packages/ui-kit` importing service/surface/app implementation.
- `packages/app-shells` importing service-owned screen bodies.
- `packages/surfaces` importing app code.
- Service-owned DSH importing service-owned AMN/ARB/KNZ/etc directly.
- Local design-system tokens in apps, app-shells, or surfaces.
- Hardcoded random brand colors outside ui-kit/foundation.

## Verification

Boundary work must be verified by:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Later guard phases must convert this contract into automated checks.
