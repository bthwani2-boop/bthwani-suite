# Platform SSoT

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: repository truth, naming, architecture locks, ownership map, active surfaces, and active service set

## Canonical Repository

| Item | Decision |
| --- | --- |
| Local repo path | `C:\bthwani-suite` |
| GitHub repo | `bthwani2-boop/bthwani-suite` |
| Package manager | `pnpm` |
| Evidence root | `tools/registry/runs/{SESSION_ID}` |
| Legacy donor repo | `bthfinal` is read-only reference only |

Branch reality is verified by evidence, not by assumption.

## Protected Active Names

Allowed active identifiers:

- `bthwani`
- `BThwani`
- `@bthwani/*`
- `bthwani-suite`

Forbidden as active truth:

- old standalone repo/path named `bth`
- `app-user`
- `mcpw`
- `kdt/volatile/registry/runs`
- donor folder names promoted without explicit governance approval

## Canonical Surface Set

Official internal surface identifiers are:

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `control-panel`
- `webapp`
- `website`

`control-panel` is the operational web surface. It is not a service slug.

## Canonical Service Set

Active governance service slugs are:

- `amn`
- `arb`
- `dsh`
- `esf`
- `knz`
- `kwd`
- `mrf`
- `snd`
- `wlt`

Additional clarifications:

- `dsh` is the first governed golden slice.
- `hr` is an internal control-panel domain, not a canonical standalone platform service.
- `exchangeprice` is not a standalone clean service; exchange-rate capability belongs under `wlt`.
- Financial and rates-related clean architecture must follow the WLT-only path unless governance explicitly replaces it.

## Ownership Ladder

| Area | Owner |
| --- | --- |
| `governance/` | governance control plane |
| `apps/*` | app host/runtime shell only |
| `packages/app-shells` | shell and root behavior only |
| `packages/surfaces/src/service-owned/<service>/` | service-specific screens, flows, and local state |
| `packages/surfaces/src/surface-owned/` | cross-service surface experience |
| `packages/surfaces/src/public/` | public surface contracts |
| `packages/ui-kit` | reusable design authority only |
| `contracts` | OpenAPI/contracts when present |
| `packages/api-types` and `packages/api-clients` | generated/shared contract layer when present |
| `services` | backend/service runtime |

## Architecture Lock

The canonical architecture ladder is:

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

Additional platform locks:

- apps remain shell hosts and must not become design-system owners
- surfaces own product experience, not reusable design primitives
- ui-kit owns tokens, reusable components, and provider-level design behavior
- donor structures may inform migration but never override clean target ownership

## Visual Identity

BThwani visual DNA is premium, practical, low-noise, modern, and RTL-correct.

Core colors:

- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`

No random palette or second design system is allowed outside ui-kit.

## Provenance

This file absorbs the live authority previously split across `OWNERSHIP.md`, `REPO_BOUNDARY.md`, `REPO_BOUNDARIES_AND_OWNERSHIP.md`, `APPROVED_SURFACE_NAMING.md`, `ARCHITECTURE_LOCK.md`, `ARCHITECTURE_GUARDRAILS.md`, `PLATFORM_OPERATING_MODEL.md`, `PLATFORM_BLUEPRINT.md`, `PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md`, and `GOVERNANCE_SSOT.md`.

This file is the platform truth source.

