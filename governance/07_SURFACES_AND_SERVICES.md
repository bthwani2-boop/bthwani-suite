# Surfaces and Services Registry

## Purpose

This file is the canonical registry of surfaces, services, service-to-surface ownership, and closure obligations.

## Canonical surfaces

| Surface | Canonical path / role | Owns | Must not own |
|---|---|---|---|
| `app-client` | Mobile customer shell/surface | customer entry, DSH/KNZ/AMN/ARB/WLT/ESF/MRF/SND/KWD customer journeys | service internals, design-system forks |
| `app-partner` | Mobile partner shell/surface | partner operations, DSH merchant/order/account journeys | money ledger truth, local UI kit |
| `app-captain` | Mobile captain shell/surface | captain task/order/service execution | partner/store ownership |
| `app-field` | Mobile field shell/surface | field ops, onboarding/inspection/verification flows | partner account truth |
| `control-panel` | Web admin/control room | platform ops, service admin, audit, reporting, support | direct screen-owned service logic outside surfaces |
| `webapp` | Public/authenticated web app | web customer/community flows | admin control-plane logic |
| `website` | marketing/public website | public marketing/info pages | app runtime/backend truth |
| `app-shells` | package-level shell composition | navigation/frame/providers/routing adapters | service-owned business screens |


## Canonical services

| Service | Name / domain | Canonical surfaces | Service-owned obligations |
|---|---|---|---|
| `dsh` | Delivery & Shopping | app-client, app-partner, app-captain, app-field, control-panel | store, catalog, basket, order, fulfillment, partner ops, captain/field handoff |
| `wlt` | Wallet / finance ledger | app-client, control-panel, cross-service finance | wallet, ledger, fees, commissions, refunds, settlement, reconciliation |
| `knz` | Kanz / rewards or offers domain | app-client, control-panel | campaign/reward flows, customer-facing earning/redemption evidence |
| `arb` | Partner/business enablement | app-client, app-partner, app-field, control-panel | partner onboarding/verification, business profile, operational modes |
| `amn` | Safety/security/service assurance | app-client, app-captain, control-panel | safety cases, trust signals, incident evidence, safety rules |
| `esf` | Community service family | app-client, webapp, control-panel | community service catalog/requests, ops proof |
| `mrf` | Community service family | app-client, webapp, control-panel | community service catalog/requests, ops proof |
| `snd` | Community service family | app-client, webapp, control-panel | community service catalog/requests, ops proof |
| `kwd` | Community service family | app-client, webapp, control-panel | community service catalog/requests, ops proof |


## Service-owned path

```text
packages/surfaces/src/service-owned/<service>/<surface>/
```

## Surface-owned path

```text
packages/surfaces/src/surface-owned/<surface>/
```

## Service-to-surface matrix

| Service | app-client | app-partner | app-captain | app-field | control-panel | webapp | website |
|---|---|---|---|---|---|---|---|
| `dsh` | yes | yes | yes | yes | yes | no | no |
| `wlt` | yes | no | no | no | yes | no | no |
| `knz` | yes | no | no | no | yes | no | no |
| `arb` | yes | yes | no | yes | yes | no | no |
| `amn` | yes | no | yes | no | yes | no | no |
| `esf` | yes | no | no | no | yes | yes | no |
| `mrf` | yes | no | no | no | yes | yes | no |
| `snd` | yes | no | no | no | yes | yes | no |
| `kwd` | yes | no | no | no | yes | yes | no |

## DSH priority

DSH is the first golden vertical slice. It must close through:

1. customer discovery/store/order
2. partner operations
3. captain/field execution where applicable
4. control-panel oversight
5. WLT financial binding for money paths
6. evidence and runtime verification

## WLT cross-service law

Any service may create financial intent, but final financial state belongs to WLT only.

## Blueprint law

Every service may have:

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

Blueprint files must contain verified truth only. Unknowns are `TBD`, not assumptions.

## Closure requirements per service

A service cannot be called closed without:

- service blueprint
- surface matrix
- role/permission model
- UI/UX/flow proof
- API/binding proof
- WLT proof if money is involved
- tests/guards
- runtime evidence
- traceability row
