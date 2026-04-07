# dsh_client_category_or_store_detail

## Identity

- screen_id: dsh_client_category_or_store_detail
- label: Client Category Or Store Detail
- surface: app-client
- actor: customer
- wave: W01
- route_candidate: dsh_client_category_or_store_detail

## Purpose

- Show one clean store or category detail surface with item selection and cart-affecting actions.

## Primary CTA

- add_or_adjust_cart

## Coverage

- operation_families: dsh_store_discovery
- journeys: dsh_journey_mainline_customer_to_delivery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-client/preview-routes.ts
- shell_routes: apps/mobile/app-client/src/shell/routes.ts
- shell_navigation: apps/mobile/app-client/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-client/components/store-category-cards.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-client/screens/dsh_client_category_or_store_detail/viewmodel.ts

## Required States

- loading, filtered empty, item unavailable, and ready detail states

## Guardrails

- Do not merge checkout or tracking concerns into the detail screen.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

