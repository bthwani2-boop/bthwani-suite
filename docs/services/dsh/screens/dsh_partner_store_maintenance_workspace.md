# dsh_partner_store_maintenance_workspace

## Identity

- screen_id: dsh_partner_store_maintenance_workspace
- label: Partner Store Maintenance Workspace
- surface: app-partner
- actor: partner
- wave: W03
- route_candidate: dsh_partner_store_maintenance_workspace

## Purpose

- Repair store readiness, delivery zones, and maintenance blockers outside the main order workspace.

## Primary CTA

- apply_store_readiness_fix

## Coverage

- operation_families: dsh_partner_store_maintenance
- journeys: dsh_journey_partner_block_recovery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-partner/preview-routes.ts
- shell_routes: apps/mobile/app-partner/src/shell/routes.ts
- shell_navigation: apps/mobile/app-partner/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-partner/components/partner-maintenance-form.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-partner/screens/dsh_partner_store_maintenance_workspace/viewmodel.ts

## Required States

- loading, save pending, save success, and save error states

## Guardrails

- Keep store maintenance separate from the partner order execution surface.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

