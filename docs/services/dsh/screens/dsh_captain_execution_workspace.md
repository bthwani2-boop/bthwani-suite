# dsh_captain_execution_workspace

## Identity

- screen_id: dsh_captain_execution_workspace
- label: Captain Execution Workspace
- surface: app-captain
- actor: captain
- wave: W03
- route_candidate: dsh_captain_execution_workspace

## Purpose

- Advance one accepted delivery across pickup, transit, and completion-ready steps.

## Primary CTA

- advance_delivery_step

## Coverage

- operation_families: dsh_captain_offer_and_acceptance|dsh_captain_delivery_execution|dsh_customer_order_chat
- journeys: dsh_journey_mainline_customer_to_delivery|dsh_journey_captain_block_recovery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-captain/preview-routes.ts
- shell_routes: apps/mobile/app-captain/src/shell/routes.ts
- shell_navigation: apps/mobile/app-captain/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-captain/components/captain-execution-timeline.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-captain/screens/dsh_captain_execution_workspace/viewmodel.ts

## Required States

- loading, step pending, captain block, reconnect, and completion-ready states

## Guardrails

- Do not leak wallet, settlement, or ops ownership into captain execution.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

