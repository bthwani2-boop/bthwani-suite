# dsh_partner_order_workspace

## Identity

- screen_id: dsh_partner_order_workspace
- label: Partner Order Workspace
- surface: app-partner
- actor: partner
- wave: W02
- route_candidate: dsh_partner_order_workspace

## Purpose

- Advance one partner-owned order through acceptance, preparation, readiness, and handoff.

## Primary CTA

- advance_order_to_next_partner_state

## Coverage

- operation_families: dsh_partner_order_handling|dsh_customer_order_chat
- journeys: dsh_journey_mainline_customer_to_delivery|dsh_journey_partner_block_recovery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-partner/preview-routes.ts
- shell_routes: apps/mobile/app-partner/src/shell/routes.ts
- shell_navigation: apps/mobile/app-partner/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-partner/components/partner-workspace-action-bar.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-partner/screens/dsh_partner_order_workspace/viewmodel.ts

## Required States

- loading, progress pending, handoff pending, and partner block states

## Guardrails

- Do not absorb store maintenance or control-panel exception work into this workspace.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

