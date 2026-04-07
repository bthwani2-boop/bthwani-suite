# dsh_field_activation_workspace

## Identity

- screen_id: dsh_field_activation_workspace
- label: Field Activation Workspace
- surface: app-field
- actor: field
- wave: W05
- route_candidate: dsh_field_activation_workspace

## Purpose

- Record optional activation, geo pin, and visit outcomes when field support is real.

## Primary CTA

- record_activation_or_visit_result

## Coverage

- operation_families: dsh_field_activation_support
- journeys: dsh_journey_field_support_optional

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-field/preview-routes.ts
- shell_routes: apps/mobile/app-field/src/shell/routes.ts
- shell_navigation: apps/mobile/app-field/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-field/components/field-activation-form.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-field/screens/dsh_field_activation_workspace/viewmodel.ts

## Required States

- loading, field unavailable, geo pin pending, visit log pending, and save error states

## Guardrails

- Keep app-field optional and narrow.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

