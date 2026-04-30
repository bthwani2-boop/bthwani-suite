# Platform SSoT

This file defines the current canonical platform truth for BThwani.

## Canonical Repository

| Item | Decision |
|---|---|
| Local repo path | `C:\bthwani-suite` |
| GitHub repo | `bthwani2-boop/bthwani-suite` |
| Current checkpoint branch candidate | `ghb/0102-20260429-015636-packages` |
| Package manager | `pnpm` |
| Evidence root | `tools/registry/runs/{SESSION_ID}` |

The branch must be verified by branch evidence. Do not assume `main` is absolute truth without Branch Reality evidence.

## Legacy Naming Rules

Forbidden as active targets:

- old standalone repo/path named `bth`
- `app-user`
- `mcpw`
- `kdt/volatile/registry/runs`
- old local repo path `C:\Users\b\Documents\GitHub\bthwani-suite`

Allowed current names:

- `bthwani`
- `BThwani`
- `@bthwani/*`
- `bthwani-suite`

## Governance Ownership

`governance/` is the canonical governance SSoT.

`docs/governance/` is transitional/reference/archive until reconciled. It may contain useful historical or planning material, but it must not override canonical files under `governance/`.

## Platform Ownership Model

| Area | Ownership Decision |
|---|---|
| `apps/*` | Shell/Host only. |
| `packages/app-shells` | shell/root behavior only. |
| `packages/surfaces` | screens, flows, and experiences. |
| `packages/surfaces/src/service-owned/{service}/{surface}` | service-specific surface implementation. |
| `packages/surfaces/src/surface-owned/{surface}` | surface-level non-service-specific experience. |
| `packages/ui-kit` | reusable design authority only. |
| `packages/api-types` | generated/shared API types when present. |
| `packages/api-clients` | API client layer when present. |
| `contracts` | OpenAPI/contracts when present. |
| `services` | backend/service runtime when present. |

## Current Product Scope

BThwani contains multiple services and multiple surfaces. DSH is the first intended golden slice after governance is stabilized. No DSH closure starts before governance verification allows it.

## Architecture Rule

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

No local design systems are allowed in apps, app-shells, or surfaces.

## UI Identity

BThwani visual identity is premium, cohesive, low-noise, RTL-correct, and 2026-ready.

Core colors:

- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`

Other colors require controlled design-system justification.
