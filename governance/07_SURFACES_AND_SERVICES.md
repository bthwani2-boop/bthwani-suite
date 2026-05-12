# Surfaces and Services Registry

**Status:** Canonical Governance Payload v2
**Owner:** `Service/Surface Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** SURFACES_OWNERSHIP_CONTRACT, APPROVED_SURFACE_NAMING, PLATFORM_BLUEPRINT, ARCHITECTURE_LOCK

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Surface registry

| Surface | Canonical path concept | Primary package owner | Closure evidence |
| --- | --- | --- | --- |
| app-client | `<service>/frontend/app-client` | service frontend + app shell | screens, states, routes, visual evidence, API binding |
| app-partner | `<service>/frontend/app-partner` | service frontend + app shell | orders/ops/account evidence |
| app-captain | `<service>/frontend/app-captain` | service frontend + app shell | assignment/trip/state evidence |
| app-field | `<service>/frontend/app-field` | service frontend + app shell | field workflow evidence |
| control-panel | `<service>/frontend/control-panel` | service frontend + web shell | control room evidence |
| webapp | `<service>/frontend/webapp` | service frontend + web shell | web runtime evidence |
| website | `website` plus service-fed content when approved | website shell | marketing/content evidence |

## Service registry

| Service | Canonical status | Must have | Must not do |
| --- | --- | --- | --- |
| dsh | canonical first golden slice | service blueprint, client/partner/captain/field/control-panel flows, API matrix | own wallet ledger truth |
| wlt | canonical financial owner | ledger, settlement, refund, fee/commission truth, reconciliation | delegate money mutation to DSH/control-panel |
| knz | canonical service | blueprint before closure | invent financial ledger |
| arb | canonical service/domain | clear service interpretation and surfaces | become undefined bucket |
| amn | canonical safety/trust | incident, verification, assurance contracts | hide security evidence |
| esf | community service | community surface/control-panel flow | pretend to be standalone without blueprint |
| mrf | community service | community surface/control-panel flow | duplicate DSH/WLT ownership |
| snd | community service | community surface/control-panel flow | duplicate DSH/WLT ownership |
| kwd | community service | community surface/control-panel flow | duplicate DSH/WLT ownership |

## Service-to-surface matrix

| Service | app-client | app-partner | app-captain | app-field | control-panel | webapp | website |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dsh | YES | YES | YES | YES | YES | TBD | TBD |
| wlt | YES | TBD-view-only | NO unless approved | NO unless approved | YES | TBD | NO |
| knz | YES | NO unless approved | NO | NO | YES | TBD | TBD |
| arb | YES | YES | NO unless approved | YES | YES | TBD | TBD |
| amn | YES | TBD | YES | TBD | YES | NO unless approved | NO |
| esf | YES | NO | NO | NO | YES | YES | TBD |
| mrf | YES | NO | NO | NO | YES | YES | TBD |
| snd | YES | NO | NO | NO | YES | YES | TBD |
| kwd | YES | NO | NO | NO | YES | YES | TBD |

`TBD` means not proven as closed. It must not be implemented as a fact without a blueprint and evidence.

## Service closure minimum

Each service-surface pair that claims closure needs:

- user/actor goal,
- screen/route path,
- state model,
- UI owner,
- API/binding owner,
- evidence artifacts,
- test/verification,
- rollback/disable path,
- control-panel operation entry where applicable.

## Non-canonical standalone services

`exchangeprice` and `hr` are not standalone canonical services unless future governance promotes them with evidence. HR is a control-panel/internal domain, not a service in the nine-service catalog.
