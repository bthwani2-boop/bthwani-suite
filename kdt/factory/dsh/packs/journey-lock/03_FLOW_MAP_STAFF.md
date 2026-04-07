# 03_FLOW_MAP_STAFF

## Entry Condition

- a non-customer actor enters only through the surface they already own in the accepted surface lock

## Preconditions

- actor ownership and surface ownership are already explicit
- `control-panel` remains narrowed to governance, intervention, and proxy-only internal work
- field participation stays optional and evidence-backed only

## Partner Path

1. Partner enters active DSH work in `app-partner`.
2. Partner reviews the pending order and store readiness state.
3. Partner performs `dsh_partner_order_handling`.
4. If store readiness or configuration is blocking fulfillment, partner performs `dsh_partner_store_maintenance`.
5. Partner exits after handoff readiness is achieved.

## Captain Path

1. Captain enters available work in `app-captain`.
2. Captain performs `dsh_captain_offer_and_acceptance`.
3. Captain performs `dsh_captain_delivery_execution`.
4. Captain performs `dsh_delivery_proof_and_verification` when required.
5. Captain exits after the delivery reaches a terminal customer-visible state.

## Internal Ops Path

1. Ops enters DSH internal work through `control-panel`.
2. Ops monitors active flows and exceptions through `dsh_ops_governance_controls`.
3. If a proxy-request case exists, ops participates in the internal branch of `dsh_proxy_request_flow`.
4. Ops intervenes only when governance, exception handling, or approval work is required.
5. Ops exits once the exception or governance condition is cleared.

## Optional Field Path

1. Field enters DSH support work in `app-field` only when activation or visit support is required.
2. Field performs `dsh_field_activation_support`.
3. Field exits after store activation or visit support evidence is recorded.

## Likely Failure Points Or Branch Logic

- partner blockers may require store maintenance before handoff can continue
- captain rejection or inability to complete may return the flow to reassignment or intervention
- ops enters only when governance, exception, or proxy review is actually required
- field remains absent unless activation or visit support is truly part of the current branch

## Completion Signal

- partner exits once handoff readiness is achieved or the branch is terminated
- captain exits once delivery reaches a terminal customer-visible state
- ops exits once the governance or exception condition is cleared
- field exits once support evidence is recorded and no further field action is required

## Staff Path Rules

- staff paths are lawful only when they stay inside their owned surfaces
- partner, captain, and field flows must not be collapsed into `control-panel`
- `control-panel` is for oversight and intervention, not the default execution home of partner or captain work