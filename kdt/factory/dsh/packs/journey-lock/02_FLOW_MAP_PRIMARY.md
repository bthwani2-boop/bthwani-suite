# 02_FLOW_MAP_PRIMARY

## Primary Happy Path

1. Customer enters DSH intent in `app-client` through `dsh_store_discovery`.
2. Customer builds the order and passes `dsh_cart_checkout_gate` in `app-client`.
3. Customer creates the order through `dsh_order_submit`, which places the order in `pending`.
4. Partner picks up store-side work through `dsh_partner_order_handling` in `app-partner`.
5. Captain receives and accepts the delivery through `dsh_captain_offer_and_acceptance` in `app-captain`, moving the order to `accepted`.
6. Captain executes delivery through `dsh_captain_delivery_execution`, advancing the order into `in_delivery`.
7. Captain completes proof through `dsh_delivery_proof_and_verification` when required.
8. Customer observes completion through `dsh_customer_order_tracking`, which reflects `completed`.

## Fast Path

1. Returning customer re-enters DSH in `app-client` with an already known store or intent.
2. Customer reaches checkout with minimal detours and submits the order.
3. Partner handles the order without needing internal ops intervention.
4. Captain accepts and completes delivery without exception handling.
5. Customer tracks the order to completion.

## Returning User Path

Returning-user handling is relevant for DSH because a customer may come back with an existing store preference, cart context, or order history. The clean path remains the same as the happy path, but it skips rediscovery overhead and goes directly to checkout or tracking depending on current intent.

## Primary Path Rules

- one customer entry surface only: `app-client`
- one partner execution surface only: `app-partner`
- one captain execution surface only: `app-captain`
- internal ops stay outside the happy path unless an exception or governance event appears
- customer tracking reflects state but does not re-own partner or captain actions