# dsh_client_checkout_confirm

## Identity

- screen_id: dsh_client_checkout_confirm
- label: Client Checkout Confirm
- surface: app-client
- actor: customer
- wave: W01
- route_candidate: dsh_client_checkout_confirm

## Purpose

- Apply the clean checkout gate and confirm a valid order intent.

## Primary CTA

- submit_order

## Coverage

- operation_families: dsh_cart_checkout_gate|dsh_order_submit
- journeys: dsh_journey_mainline_customer_to_delivery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/components/checkout-confirmation-block.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_checkout_confirm/viewmodel.ts

## Required States

- loading, validation failure, submit pending, and submit failed states

## Guardrails

- Do not let WLT ownership or payment implementation leak into this screen.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

