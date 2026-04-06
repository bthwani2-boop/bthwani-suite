# 02_SURFACE_DECISION_RULES

## Core Rules

### Rule 1 - Entry surface owns the start

If a DSH action begins in a customer, partner, captain, field, or internal ops context, the matching clean surface owns the operation start.

### Rule 2 - Mirror visibility is not ownership

If another surface only reflects downstream state, that surface remains `OUT` for the operation unless the evidence proves direct action responsibility.

### Rule 3 - Control-panel is narrowed

`control-panel` exists for true internal governance, intervention, and the proxy-request path. It is not a default mirror for customer, partner, or captain operation families.

### Rule 4 - App-field stays conditional

`app-field` remains an optional service surface overall. When a field-specific family is active, that family lives in `app-field` rather than leaking into `control-panel` or customer surfaces.

### Rule 5 - Excluded web surfaces stay out

`webapp` and `website` remain `OUT` because no reviewed target or donor evidence makes them first-service DSH operation surfaces.

### Rule 6 - Finance is not imported here

Financial settlement, ledger, wallet, payout, and refund truth remain outside this DSH surface lock and continue to route through `WLT` when relevant.

## Clean Model Notes

- `app-client` owns customer entry, checkout, order submission, customer tracking, customer-side chat, and proxy initiation
- `app-partner` owns partner-side handling and store maintenance
- `app-captain` owns offer acceptance, delivery execution, proof, and captain-side chat participation
- `app-field` owns activation support only when that path is enabled
- `control-panel` owns internal governance and explicit proxy approvals or interventions

## Explicit Non-Goals

- do not recreate donor route sprawl inside the clean model
- do not treat every order-status reflection as a multi-surface operation family
- do not reopen screen or journey design inside this phase