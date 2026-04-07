# dsh_ops_orders_board

## Identity

- screen_id: dsh_ops_orders_board
- label: Ops Orders Board
- surface: control-panel
- actor: ops
- wave: W04
- route_candidate: dsh_ops_orders_board

## Purpose

- Provide the internal oversight board for DSH cases and attention-needed orders.

## Primary CTA

- open_exception_workspace

## Coverage

- operation_families: dsh_ops_governance_controls
- journeys: dsh_journey_ops_governance_internal

## Target Files

- preview_registry: packages/surfaces/src/dsh/control-panel/preview-routes.ts
- shell_routes: apps/web/control-panel/src/shell/routes.ts
- shell_navigation: apps/web/control-panel/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/control-panel/components/ops-filter-bar.tsx
- viewmodel_target: packages/surfaces/src/dsh/control-panel/screens/dsh_ops_orders_board/viewmodel.ts

## Required States

- loading, empty board, attention needed, and retry states

## Guardrails

- Keep this screen oversight-only and do not mirror partner or captain execution.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

