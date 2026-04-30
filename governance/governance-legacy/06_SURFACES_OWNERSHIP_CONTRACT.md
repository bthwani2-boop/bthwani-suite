---
generatedFrom: governance/06_SURFACES_OWNERSHIP_CONTRACT.md
generatedAt: 2026-04-30T04:48:37.1642104+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Surfaces Ownership Contract

Status: CANONICAL_CONTRACT
Owner: BThwani Governance
Scope: surface ownership, official surface identifiers, and public surface boundaries

## Purpose

`packages/surfaces` owns user-facing screens, flows, and experiences across apps and services.

## Canonical Structure

```text
packages/surfaces/src/public/{surface}.ts
packages/surfaces/src/service-owned/{service}/{surface}/...
packages/surfaces/src/surface-owned/{surface}/...
```

## Official Surface Identifiers

The only canonical internal surface names are:

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `control-panel`
- `webapp`
- `website`

These internal names are filesystem and contract truth. Visible labels do not replace them.

## service-owned

Use service-owned when the experience belongs to a specific service.

Example:

```text
packages/surfaces/src/service-owned/dsh/app-client/...
packages/surfaces/src/service-owned/dsh/app-partner/...
packages/surfaces/src/service-owned/dsh/app-captain/...
packages/surfaces/src/service-owned/dsh/app-field/...
packages/surfaces/src/service-owned/dsh/control-panel/...
```

service-owned may own:

- service screens
- service flows
- service-specific states
- service-specific local view models
- service-specific UI composition using ui-kit
- service-specific fixture/demo data only when clearly marked and dev-safe

service-owned must not own:

- reusable visual system
- app boot logic
- backend implementation
- cross-service implementation shortcuts

## surface-owned

Use surface-owned when the experience belongs to a surface globally and is not a specific service.

Examples:

- global account entry
- global notifications shell
- surface home shell
- global search shell
- cross-service hub surface

surface-owned must not secretly hold service-specific implementation.

## Public Exports

`packages/surfaces/src/public/*` is the public contract for app/app-shell consumption. Apps and app-shells should not deep import surface internals.

## Cross-Service Rule

A service-owned surface must not import another service-owned implementation directly. Use a shared contract, cross-service protocol, or platform-level composition later.

## Verification

Surface ownership must be checked by file path, import path, and semantic content.

## Provenance

This file now absorbs the live surface catalog and naming rules formerly split across `SURFACE_CATALOG.md`.

This file is the surface ownership authority.

