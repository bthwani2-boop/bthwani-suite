# 04_FLOW_MAP_FAILURE_RECOVERY

## Entry Condition

- the mainline journey has encountered a blocking condition, exception, or optional side-path trigger

## Preconditions

- the happy path and staff paths are already defined
- recovery must stay inside lawful owned surfaces whenever possible
- no preview or screen-level branching is introduced here

## Failure Path - Checkout Does Not Pass

1. Customer reaches `dsh_cart_checkout_gate`.
2. Validation or policy gating blocks submit.
3. Customer remains in `app-client` and resolves the blocking condition.
4. Customer retries submit only after the gate is cleared.

## Failure Path - Partner Cannot Progress The Order

1. Order enters `pending`.
2. Partner detects a fulfillment or readiness blocker in `app-partner`.
3. Partner uses `dsh_partner_store_maintenance` when the blocker is store-side.
4. If the blocker cannot be cleared locally, ops may intervene through `control-panel`.
5. Flow returns to partner handling or exits to cancellation when recovery fails.

## Failure Path - Captain Does Not Accept Or Cannot Complete

1. Order reaches the captain assignment stage.
2. Captain rejects or cannot complete the job.
3. Flow stays in the DSH operational path rather than leaking into a new surface.
4. Partner or ops handles the exception according to current operational ownership.
5. The order either returns to assignment, continues later, or ends in `cancelled`.

## Failure Path - Proxy Request Needs Internal Review

1. Customer initiates `dsh_proxy_request_flow` in `app-client`.
2. Internal approval, rejection, or scheduling work occurs in `control-panel`.
3. Outcome is reflected back to the customer without moving the customer into an internal surface.

## Recovery Path

- recovery must return the actor to the same lawful surface whenever possible
- recovery must prefer resuming the current operation family over opening a new competing path
- only real governance or exception conditions may pull the flow into `control-panel`

## Unavailable Or Disabled Path

- if field support is not enabled, `app-field` stays absent from the journey with no fallback surface pretending to own field work
- if proxy flow is not relevant, the mainline order path proceeds without `control-panel`
- if a payment method or financial check is unavailable, the journey blocks before submit and does not import wallet ownership into DSH

## Likely Failure Points Or Branch Logic

- checkout gating can block before order creation
- partner-side blockers can force temporary maintenance or ops intervention
- captain rejection or execution failure can force reassignment, delay, or cancellation
- proxy cases create a governed side path instead of widening the mainline path
- optional field absence must not trigger a fake fallback surface

## Completion Signal

- recovery succeeds when the actor returns to the same lawful surface and resumes the current operation family
- failure reaches a terminal end only when the journey resolves to `cancelled` or another already-locked terminal outcome