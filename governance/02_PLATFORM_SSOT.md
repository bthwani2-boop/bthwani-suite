# Platform SSoT

## Canonical repository

- Local repo: `C:\bthwani-suite`
- GitHub repo: `bthwani2-boop/bthwani-suite`
- Canonical governance root: `governance/`
- Canonical evidence root: `tools/registry/runs/{SESSION_ID}/`

## Stack

`Node.js / TypeScript / pnpm / Nx / React / React Native / Expo / Next.js / NestJS`

Expo Development Build / Dev Client is canonical for mobile development. Expo Go is not the canonical development model.

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


## Non-service capabilities

| Name | Status | Rule |
|---|---|---|
| `hr` | internal domain/capability | Control-panel domain only; not a standalone canonical service. |
| `exchangeprice` | non-canonical standalone service | May exist only as capability/provider logic if explicitly proven and owned. |

## Financial sovereignty

All money-state truth belongs to `wlt`.

No other service may own final truth for:

- wallet balance
- ledger entries
- fees
- commissions
- refunds
- settlement
- reconciliation
- financial audit
- payout status

Other services may show financial UI only through documented WLT contracts or read models.

## Canonical naming

Preserve valid names:

- `BThwani`
- `bthwani-suite`
- `@bthwani/*`
- `bthwani2-boop/bthwani-suite`

Forbidden as active target:

- old standalone repo/path/name `bth`

## Source-of-truth categories

| Category | Meaning |
|---|---|
| `Canonical` | approved rule or path to follow |
| `Current` | actual state found in repo |
| `Legacy` | historical donor/reference |
| `Temporary` | accepted short-lived state |
| `TBD` | not proven yet |

## Promotion rule

A fact becomes SSoT only after:

1. Repo evidence or source evidence proves it.
2. It does not contradict higher-order policy.
3. It is recorded in the proper governance owner file.
4. The evidence pack captures the decision.
