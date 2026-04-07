# dsh_partner_orders_board

## Identity

- screen_id: dsh_partner_orders_board
- label: Partner Orders Board
- surface: app-partner
- actor: partner
- wave: W02
- route_candidate: dsh_partner_orders_board

## Purpose

- Expose the current partner order queue without overloading the detailed workspace.

## Primary CTA

- open_next_order_workspace

## Coverage

- operation_families: dsh_partner_order_handling
- journeys: dsh_journey_mainline_customer_to_delivery|dsh_journey_partner_block_recovery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-partner/preview-routes.ts
- shell_routes: apps/mobile/app-partner/src/shell/routes.ts
- shell_navigation: apps/mobile/app-partner/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-partner/components/partner-queue-card.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-partner/screens/dsh_partner_orders_board/viewmodel.ts

## Required States

- loading, empty queue, refresh, and attention-needed states

## Guardrails

- Do not collapse the order queue into control-panel governance views.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

