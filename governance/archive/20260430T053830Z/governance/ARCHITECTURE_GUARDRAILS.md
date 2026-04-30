# Architecture Guardrails

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Core architecture contract

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

## 2. Allowed root responsibilities

| Root | Responsibility |
|---|---|
| `apps/` | App host/runtime/build shell |
| `packages/app-shells/` | Root shell and app wiring |
| `packages/surfaces/src/public/` | Public surface contracts |
| `packages/surfaces/src/service-owned/<service>/` | Service-specific screens, flows, states, and blueprints |
| `packages/surfaces/src/surface-owned/` | Surface-global experience not owned by one service |
| `packages/ui-kit/` | Reusable design system, tokens, primitives, variants |
| `packages/api-types/` | Shared API types/contracts when applicable |
| `packages/api-clients/` | API clients and request binding when applicable |
| `services/` | Service runtime/backend/domain when applicable |
| `governance/` | Textual policy source |
| `tools/guards/` | Executable guard implementation |

## 3. Forbidden architecture drift

Forbidden unless explicitly approved with evidence:

```text
apps importing from service-owned internals
screens/surfaces/apps importing tamagui directly
local design systems outside ui-kit
duplicate headers/buttons/cards owned outside ui-kit
deep imports that bypass public exports
source code importing tools/registry/runs
runtime code depending on evidence output
service-owned paths owning generic reusable UI
app-shells owning business/domain truth
governance policy duplicated inside tools/guards
```

## 4. UI-kit authority

`@bthwani/ui-kit` is the only reusable visual system authority.

Rules:

- Tamagui may be used inside ui-kit.
- Screens/surfaces/apps consume public ui-kit exports only.
- Random colors are forbidden.
- Reusable components must not be duplicated locally.
- UI patterns must remain cohesive across web/mobile.

## 5. Public export rule

Cross-boundary access must go through public exports.

Deep imports require explicit policy exception, documented risk, owner approval, and verification.

## 6. Architecture acceptance criteria

A change affecting architecture is not accepted until:

```text
changed files match scope
imports respect boundaries
exports are explicit
typecheck passes
relevant guards pass
rollback exists
patch is reviewable
decision is recorded
```
