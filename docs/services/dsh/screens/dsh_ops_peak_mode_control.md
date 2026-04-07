# dsh_ops_peak_mode_control

## Identity

- screen_id: dsh_ops_peak_mode_control
- label: Ops Peak Mode Control
- surface: control-panel
- actor: ops
- wave: W04
- route_candidate: dsh_ops_peak_mode_control

## Purpose

- Control the peak-mode policy and show safe conflict feedback.

## Primary CTA

- apply_peak_mode_change

## Coverage

- operation_families: dsh_ops_governance_controls
- journeys: dsh_journey_ops_governance_internal

## Target Files

- preview_registry: packages/surfaces/src/dsh/control-panel/preview-routes.ts
- shell_routes: apps/web/control-panel/src/shell/routes.ts
- shell_navigation: apps/web/control-panel/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/control-panel/components/peak-mode-toggle-card.tsx
- viewmodel_target: packages/surfaces/src/dsh/control-panel/screens/dsh_ops_peak_mode_control/viewmodel.ts

## Required States

- loading, toggle pending, policy conflict, and save error states

## Guardrails

- Keep peak-mode policy separate from order workspace concerns.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

