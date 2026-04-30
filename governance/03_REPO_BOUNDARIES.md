# Repository Boundaries and Root Ownership

## Purpose

This file defines what each top-level repository root may own and what it must not own.

## Top-level root ownership

| Root | Status | Owns | Must not own |
|---|---|---|---|
| `apps/` | canonical | deployable shells and app-specific entrypoints | reusable business logic, design system, service truth |
| `packages/ui-kit/` | canonical | tokens, primitives, components, providers, public UI exports | app-specific service flow logic |
| `packages/surfaces/` | canonical | service-owned and surface-owned screens/flows | app shell navigation truth |
| `packages/app-shells/` | canonical | shell frames, route adapters, provider composition | service internals |
| `packages/api-types/` | canonical | generated/shared types from contracts | handwritten runtime behavior without source contract |
| `packages/api-clients/` | canonical | typed clients/adapters | UI layout or service ownership |
| `services/` | canonical | backend/runtime service implementations | frontend design authority |
| `contracts/master/` | canonical when present | public API contract source | generated mirror-only copies |
| `governance/` | canonical | policy, evidence requirements, guard catalog | runtime code or unverified legacy authority |
| `tools/guards/` | execution | guard implementations | policy authority beyond governance |
| `tools/scripts/` | execution | deterministic scripts | policy authority beyond governance |
| `tools/registry/runs/` | evidence output | run artifacts | source policy |
| `.github/workflows/` | CI execution | workflow enforcement | policy authority beyond governance |
| `.github/agents/` | AI agent definitions | agent execution surface | governance replacement |
| `.github/skills/` | AI skill definitions | skill registry | governance replacement |

## Legacy and archive roots

Any legacy root must be explicitly classified as one of:

- `LEGACY_REFERENCE`
- `ARCHIVE`
- `TRANSITIONAL`
- `DEPRECATED`
- `REJECTED`

No legacy root may be imported from or cited as active truth without a migration decision.

## Forbidden boundary drift

- No local design system under `apps/`.
- No direct Tamagui import outside allowed UI-kit internals.
- No service-owned business flow inside app shell.
- No runtime API truth hidden in UI files.
- No generated evidence treated as policy.
- No deletion of roots without dependency/reference audit.

## Required boundary evidence

For any change crossing roots, provide:

- changed files
- dependency/import impact
- public API impact
- consumer impact
- guard result
- rollback plan
