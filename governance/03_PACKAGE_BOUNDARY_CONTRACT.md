# Package Boundary Contract

## Purpose

This contract defines the mandatory ownership, dependency, placement, and correction boundaries for `C:\bthwani-suite`.

## Canonical Direction

```text
apps -> packages/app-shells -> packages/surfaces -> packages/ui-kit
surfaces -> packages/api-clients -> packages/api-types -> contracts
services -> contracts/api/domain implementation
```

The direction is conceptual. Actual imports must remain within public package exports and approved contracts.

## Placement Rule

Every file must have one clear owner.

Before a file is added, moved, or shared, the owning layer must be obvious:

- Is it app boot or host wiring?
- Is it shell, navigation, or provider behavior?
- Is it a screen, flow, or product experience?
- Is it reusable visual design?
- Is it API/client/runtime logic?
- Is it evidence only?

If ownership is unclear, the file is not correctly placed yet.

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

## Structural Placement Order

When a file is misclassified or newly introduced, decide placement in this order:

1. app boot, entry, host, or route wiring -> `apps/*`
2. shell, root navigation, provider, or platform frame behavior -> `packages/app-shells`
3. reusable visual design or domain-neutral interaction primitive -> `packages/ui-kit`
4. service-specific screen, flow, or product experience -> `packages/surfaces/src/service-owned/{service}/{surface}`
5. surface-global but not service-specific experience -> `packages/surfaces/src/surface-owned/{surface}`
6. API contract, API client, or runtime/backend implementation -> API/contracts/runtime layer
7. evidence output -> `tools/registry/runs/{SESSION_ID}`
8. if none apply -> owner decision required before movement

## Structure And Correction Rules

- Apps and app-shells remain host and shell only. Detailed host and shell rules stay in `04_APPS_SHELL_ONLY_CONTRACT.md`.
- Surfaces remain the owner of screens, flows, and product experiences. Detailed ownership rules stay in `06_SURFACES_OWNERSHIP_CONTRACT.md`.
- Shared-folder admission, consumer proof, and deletion safety for shared code stay in `09_SHARED_FOLDER_GOVERNANCE.md`.
- Public exports must stay small, explicit, and logic-free.
- Deep imports into implementation internals remain suspect unless explicitly approved and guarded.
- A shared file with one consumer is invalid by default and should move closer to its only consumer unless a documented second consumer exists.
- Product blocks such as order cards, store cards, wallet summaries, captain task items, and dashboard bodies are not automatically ui-kit candidates.
- A ui-kit candidate must be visual, reusable, domain-neutral, service-neutral, and compatible with the shared design system.

## Remediation Guardrails

- Boundary guards identify candidates; they do not authorize deletion by themselves.
- Any delete or move still requires zero-reference proof, consumer proof, owner decision, rollback path, evidence, `git --no-pager diff --check`, and `pnpm -w exec tsc --noEmit` when code-bearing paths are touched.
- Shared-folder structural guard expectations are owned jointly by this contract and `09_SHARED_FOLDER_GOVERNANCE.md`.

## Verification

Boundary work must be verified by:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Later guard phases must convert this contract into automated checks.
