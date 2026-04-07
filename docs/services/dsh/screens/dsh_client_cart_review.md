# dsh_client_cart_review

## Identity

- screen_id: dsh_client_cart_review
- label: Client Cart Review
- surface: app-client
- actor: customer
- wave: W01
- route_candidate: dsh_client_cart_review

## Purpose

- Review selected items, totals, and cart mutations before checkout.

## Primary CTA

- proceed_to_checkout

## Coverage

- operation_families: dsh_cart_checkout_gate
- journeys: dsh_journey_mainline_customer_to_delivery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/components/cart-summary-block.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_cart_review/viewmodel.ts

## Required States

- loading, empty cart, mutation pending, and recovery states

## Guardrails

- Do not hide pricing or mutation failure inside checkout.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

