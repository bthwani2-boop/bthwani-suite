# dsh_captain_offers_list

## Identity

- screen_id: dsh_captain_offers_list
- label: Captain Offers List
- surface: app-captain
- actor: captain
- wave: W03
- route_candidate: dsh_captain_offers_list

## Purpose

- Expose the available delivery offers that can be claimed by the captain.

## Primary CTA

- accept_delivery_offer

## Coverage

- operation_families: dsh_captain_offer_and_acceptance
- journeys: dsh_journey_mainline_customer_to_delivery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-captain/preview-routes.ts
- shell_routes: apps/mobile/app-captain/src/shell/routes.ts
- shell_navigation: apps/mobile/app-captain/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-captain/components/captain-offer-card.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-captain/screens/dsh_captain_offers_list/viewmodel.ts

## Required States

- loading, empty offers, offer expired, and retry states

## Guardrails

- Do not open execution details before an offer is claimed.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

