# dsh_client_proxy_request_entry

## Identity

- screen_id: dsh_client_proxy_request_entry
- label: Client Proxy Request Entry
- surface: app-client
- actor: customer
- wave: W04
- route_candidate: dsh_client_proxy_request_entry

## Purpose

- Capture the customer-side proxy exception request in one clean form.

## Primary CTA

- submit_proxy_request

## Coverage

- operation_families: dsh_proxy_request_flow
- journeys: dsh_journey_proxy_exception

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/components/proxy-form.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_proxy_request_entry/viewmodel.ts

## Required States

- loading, validation failure, submit pending, and submit failed states

## Guardrails

- Keep the proxy branch separate from the mainline DSH order flow.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

