# JOURNIES Platform Control-Panel Role Map

**Purpose:** ensure Platform > Vars and the control-panel platform section are not skipped during DSH/WLT closure.

## Mandatory platform areas

| Area | Why it matters | Related journeys |
|---|---|---|
| Platform > Vars | provider/config/policy scope, precedence, rollback, audit preview | J-008, J-009, J-014 |
| Operations room | live orders, exceptions, dispatch, field/captain/partner actions | J-004, J-005, J-006, J-009 |
| Finance read-only panels | WLT-ledger/payment/refund/payout visibility without DSH mutation | J-003, J-004, J-005, J-010 |
| Catalog governance | product/catalog/publish conflict resolution | J-001, J-002 |
| Support / SLA | escalation, cancellation, refund bridge, exception queue | J-004, J-009, J-013 |
| Auth/RBAC | operator/partner/captain/field permissions | J-003, J-006, J-009, J-012 |

## Rule

A journey that touches provider policy, flags, rollout, finance visibility, operational command actions, or rollback/audit may not close until the Platform/Vars/control-panel dependency is classified in the slice and in the live census.
