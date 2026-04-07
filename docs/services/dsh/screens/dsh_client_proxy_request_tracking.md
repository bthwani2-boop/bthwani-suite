# dsh_client_proxy_request_tracking

## Identity

- screen_id: dsh_client_proxy_request_tracking
- label: Client Proxy Request Tracking
- surface: app-client
- actor: customer
- wave: W04
- route_candidate: dsh_client_proxy_request_tracking

## Purpose

- Reflect proxy case review, decision, and scheduling back to the customer.

## Primary CTA

- refresh_proxy_status

## Coverage

- operation_families: dsh_proxy_request_flow
- journeys: dsh_journey_proxy_exception

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/components/proxy-status-timeline.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_proxy_request_tracking/viewmodel.ts

## Required States

- loading, pending review, decision reflected, closed, and retry states

## Guardrails

- Do not merge proxy tracking with mainline order tracking.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

