# dsh_ops_order_detail_exception_workspace

## Identity

- screen_id: dsh_ops_order_detail_exception_workspace
- label: Ops Order Detail Exception Workspace
- surface: control-panel
- actor: ops
- wave: W04
- route_candidate: dsh_ops_order_detail_exception_workspace

## Purpose

- Apply narrow exception and reassignment work on one escalated case.

## Primary CTA

- apply_exception_resolution

## Coverage

- operation_families: dsh_ops_governance_controls
- journeys: dsh_journey_ops_governance_internal

## Target Files

- preview_registry: packages/surfaces/src/dsh/control-panel/preview-routes.ts
- shell_routes: apps/web/control-panel/src/shell/routes.ts
- shell_navigation: apps/web/control-panel/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/control-panel/components/exception-resolution-panel.tsx
- viewmodel_target: packages/surfaces/src/dsh/control-panel/screens/dsh_ops_order_detail_exception_workspace/viewmodel.ts

## Required States

- loading, intervention pending, resolution applied, and retry states

## Guardrails

- Do not let this workspace become a second partner or captain workspace.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

