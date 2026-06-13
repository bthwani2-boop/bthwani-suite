# DSH Golden Slice = فول ستاك بثواني Golden Slice

**Status:** Canonical Governance Payload v2
**Owner:** `DSH Service Governance`

## Purpose

DSH is the first official golden slice. It must prove the governance model works across all relevant surfaces before the platform claims maturity.

## فول ستاك بثواني Operating Definition

فول ستاك بثواني هو معيار إغلاق DSH/WLT الذي يثبت أن:

- العميل
- الشريك
- الكابتن
- الميداني
- لوحة التحكم
- DSH backend
- WLT
- PostgreSQL
- Media Runtime
- OpenAPI
- shared contracts

تعمل كمنظومة واحدة، لا كسطوح منفصلة.

## DSH actors

| Actor | role_surface | owned_capabilities | shared_capabilities | control_panel_sections | wlt_dependency | media_dependency |
|---|---|---|---|---|---|---|
| Client | app-client | discovery, cart, checkout intent, tracking, support request | catalog-store, media-runtime, cart-checkout, order-lifecycle, support-escalation, notifications | operations, support, finance, catalogs, marketing | read-model/status only | store/product/support media read |
| Partner | app-partner | preparation, catalog override intent, partner operations, support request | catalog-store, media-runtime, order-lifecycle, partner-operations, support-escalation, wlt-finance-read-model | operations, catalogs, partners, support, finance | settlement/summary read-model only | catalog media read/write via runtime |
| Captain | app-captain | availability, assignment response, pickup/dropoff, PoD intent, support request | order-lifecycle, captain-delivery, media-runtime, support-escalation, notifications, wlt-finance-read-model | operations, support, finance | payout summary read-model only | PoD media via runtime |
| Field | app-field | store onboarding, document upload, visit submission, readiness escalation | field-readiness, media-runtime, support-escalation, catalog-store | partners, catalogs, support | none | documents/visit evidence via runtime |
| Operator | control-panel | operations intervention, support handling, governance navigation, platform policy | all capability read/control surfaces by section | dashboard, operations, support, finance, catalogs, partners, marketing, platform, administration, hr | finance read-model only | upload/list/link via media runtime |
| Finance | control-panel/WLT | WLT-owned ledger/payment/refund/settlement truth | wlt-finance-read-model | finance, dashboard | owner in WLT; DSH read-only | none |

## DSH flow closure

Minimum flows:

```text
store discovery
store details
cart
checkout
payment decision via WLT
order creation
partner acceptance/preparation
captain assignment
pickup
delivery
completion/rating
refund/issue path
ops intervention
```

## DSH must not own

- wallet balance,
- ledger mutation,
- final settlement,
- refund finalization,
- financial reconciliation.

These belong to WLT.

## DSH evidence matrices

### Surface matrix

```text
surface | screen | route | state coverage | screenshot | API binding | status
```

### Order state matrix

```text
state | actor who sees it | next actions | failure state | evidence
```

### Control-panel operations

```text
operation | permission | side effect | audit | rollback | evidence
```

### Full-Stack Capability Matrix

```text
capability | backend | openapi | shared | control-panel section | client | partner | captain | field | wlt | media | evidence
foundation | required | required | runtime/policies | dashboard/platform/administration | required | required | required | required | reference only | n/a | diff/guard/typecheck
actor-auth-permissions | required | required | policies | administration/platform | required | required | required | required | reference only | n/a | diff/guard/runtime
catalog-store | required | required | contracts/adapters/view-models | catalogs/partners/marketing | required | required | n/a | required | n/a | required | API/media/screenshots
media-runtime | required | required | media adapters | catalogs/support/marketing/platform | required | required | required | required | reference only | required | upload/read/list/screenshots
cart-checkout | required | required | checkout view-models/WLT adapter | operations/finance/platform | required | n/a | n/a | n/a | read-model/intent | n/a | runtime/WLT boundary
order-lifecycle | required | required | state-machine | operations/support/finance | required | required | required | n/a | status/read-model | optional support media | lifecycle proof
captain-delivery | required | required | delivery state-machine/media adapter | operations/support/finance | tracking | handoff | required | n/a | payout/refund read-model | PoD required | PoD runtime proof
partner-operations | required | required | operations adapters | operations/catalogs/partners/support | n/a | required | n/a | n/a | read-only if shown | catalog media | runtime/screenshots
field-readiness | required | required | readiness state-machine | partners/catalogs/support | n/a | consumes status | n/a | required | n/a | documents/evidence | runtime/screenshots
support-escalation | required | required | support state-machine | support/operations | required | required | required | required | reference if dispute | attachments | flow proof
wlt-finance-read-model | WLT-owned | WLT required | WLT read contracts | finance/dashboard | read-only | read-only | read-only | read-only | owner | n/a | no-mutation proof
control-panel-governance | policy only | optional | governance map | all current sections | n/a | n/a | n/a | n/a | read-only where finance | optional | section matrix
notifications | required | required | notification adapters | operations/support/platform | required | required | required | required | reference only | n/a | contract/UI proof
```

## Golden slice acceptance

DSH is not closed until:

- all required surfaces are mapped,
- WLT financial boundary is respected,
- UI uses ui-kit,
- API binding is typed,
- runtime evidence exists,
- control-panel ops are defined,
- warnings are classified,
- evidence pack is complete.
