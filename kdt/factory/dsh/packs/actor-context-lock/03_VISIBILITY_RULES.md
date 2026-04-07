# 03_VISIBILITY_RULES

## Included Actors

- `customer` is included on `app-client` as the primary external DSH entry actor.
- `partner` is included on `app-partner` as the primary fulfillment actor.
- `captain` is included on `app-captain` as the primary execution actor.
- `ops` is included on `control-panel` as the primary internal oversight actor.
- `field` is included on `app-field` only as an optional support actor when field support tasks are present.

## Excluded Actors

- `webapp_public` is excluded from current DSH first-service ownership.
- `website_public` is excluded from current DSH first-service ownership.
- finance-only ownership is excluded from DSH actor context and remains outside this phase.

## Why Each Exclusion Exists

- `webapp_public` is excluded because reviewed target and donor evidence do not establish `webapp` as a lawful DSH first-service surface.
- `website_public` is excluded because reviewed target and donor evidence do not establish `website` as a lawful DSH first-service surface.
- finance-only ownership is excluded because money-moving and financial ownership remain isolated through `WLT`, not `dsh`.

## Context Changes That Affect Visibility Legally

- `field` visibility becomes lawful only when activation, geo pin, visit log, or comparable support tasks are actually present.
- `ops` visibility is lawful for oversight, intervention, governance, and exception-heavy flows, not as a substitute for customer, partner, or captain task execution.
- `customer` visibility remains lawful for discovery, cart, checkout, and tracking contexts, but not for partner-only or captain-only execution contexts.
- `partner` visibility remains lawful for store readiness, order handling, and handoff contexts, but not for customer checkout or internal ops governance contexts.
- `captain` visibility remains lawful for offers, acceptance, execution, and proof contexts, but not for customer discovery or partner-only store operation contexts.

## Boundary Rules

- actor visibility is service-owned, not app-owned
- normalized target names must be used in the target repo even when donor source uses `APP_USER` or `MCPW`
- actor contexts defined here are sufficient for Operation Lock input, but not yet a substitute for operation-by-operation surface coverage