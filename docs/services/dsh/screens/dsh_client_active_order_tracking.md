# dsh_client_active_order_tracking

## Identity

- screen_id: dsh_client_active_order_tracking
- label: Client Active Order Tracking
- surface: app-client
- actor: customer
- wave: W02
- route_candidate: dsh_client_active_order_tracking

## Purpose

- Reflect the active or terminal order lifecycle back to the customer.

## Primary CTA

- refresh_tracking

## Coverage

- operation_families: dsh_customer_order_tracking|dsh_customer_order_chat
- journeys: dsh_journey_mainline_customer_to_delivery|dsh_journey_customer_tracking_resume

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/components/tracking-timeline.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_active_order_tracking/viewmodel.ts

## Required States

- loading, partial propagation, retry, terminal complete, and cancelled states

## Guardrails

- Do not turn tracking into a second execution workspace.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

