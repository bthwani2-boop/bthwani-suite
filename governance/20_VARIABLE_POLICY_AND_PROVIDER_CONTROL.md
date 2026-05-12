# Variable Policy and Provider Control

**Status:** Canonical Governance Payload v2
**Owner:** `Mutable Policy Governance`

## VAR law

Any mutable business/runtime value that can change by service, store, city, zone, category, provider, rollout, or operational mode must be treated as `VAR_*`.

## Examples

```text
VAR_DSH_DELIVERY_FEE
VAR_DSH_SMALL_ORDER_FEE
VAR_DSH_STORE_COMMISSION_RATE
VAR_DSH_ZONE_SURGE_MULTIPLIER
VAR_WLT_SETTLEMENT_WINDOW
VAR_WLT_REFUND_POLICY
VAR_AMN_OTP_RETRY_LIMIT
VAR_PROVIDER_PAYMENT_PRIORITY
VAR_CAPTAIN_ASSIGNMENT_RADIUS
```

## Precedence

Default precedence:

```text
Store
→ Subcategory
→ Category
→ Zone
→ City
→ Region
→ Service
→ Global
```

A service may define a narrower precedence only with evidence and owner approval.

## Provider control plane

Provider selection, provider priority, provider failover, and provider rollout must be controlled through explicit policy, not scattered env-only logic.

Provider policy record:

```text
provider_id
service
capability
priority
fallback
region/scope
status
owner
last_changed_by
evidence
rollback
```

## Change requirements

A `VAR_*` change requires:

- owner,
- reason,
- before/after,
- scope,
- preview/simulation where possible,
- audit log,
- rollback,
- evidence pack.

## Forbidden

- hardcoded fee/commission/refund formula inside screen,
- env-only provider truth for live runtime,
- hidden fallback without monitoring,
- store-specific policy in code,
- mutable value with no owner or rollback.

## WLT relationship

Any `VAR_*` that affects money settlement, refunds, commissions, fees, or wallet balance must be approved by WLT governance and must produce financial audit evidence.
