# dsh_client_entry_discovery_home

## Identity

- screen_id: dsh_client_entry_discovery_home
- label: Client Entry Discovery Home
- surface: app-client
- actor: customer
- wave: W01
- route_candidate: dsh_client_entry_discovery_home

## Purpose

- Reveal the lawful DSH entry surface for categories, stores, and first discovery decisions.

## Primary CTA

- select_store_or_category

## Coverage

- operation_families: dsh_store_discovery
- journeys: dsh_journey_mainline_customer_to_delivery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_entry_discovery_home/page-shell.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_entry_discovery_home/viewmodel.ts

## Required States

- loading, empty discovery, retry, and ready selection context

## Guardrails

- Do not leak partner, captain, or proxy flow into the main discovery shell.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

