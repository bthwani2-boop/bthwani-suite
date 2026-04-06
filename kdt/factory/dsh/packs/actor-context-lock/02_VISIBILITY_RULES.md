# 02_VISIBILITY_RULES

## Primary Visibility Rules

- `app-client` is the customer entry surface for current DSH first-service work
- `app-partner` is the partner fulfillment surface for current DSH first-service work
- `app-captain` is the captain execution surface for current DSH first-service work
- `control-panel` is the internal DSH operational oversight surface
- `app-field` is support-only and optional for current DSH first-service work

## Exclusion Rules

- `webapp` is not a current DSH first-service surface
- `website` is not a current DSH first-service surface
- finance-only ownership is not a DSH actor context and must not be folded into DSH actor lock
- partner, captain, and customer core jobs must not collapse into one shared surface context

## Boundary Rules

- actor visibility is service-owned, not app-owned
- normalized target names must be used in the target repo even when donor source uses `APP_USER` or `MCPW`
- actor contexts defined here are sufficient for Operation Lock input, but not yet a substitute for operation-by-operation surface coverage
