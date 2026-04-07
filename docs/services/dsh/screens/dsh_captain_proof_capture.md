# dsh_captain_proof_capture

## Identity

- screen_id: dsh_captain_proof_capture
- label: Captain Proof Capture
- surface: app-captain
- actor: captain
- wave: W03
- route_candidate: dsh_captain_proof_capture

## Purpose

- Capture and submit delivery proof with explicit verification feedback.

## Primary CTA

- submit_delivery_proof

## Coverage

- operation_families: dsh_delivery_proof_and_verification
- journeys: dsh_journey_mainline_customer_to_delivery

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-captain/preview-routes.ts
- shell_routes: apps/mobile/app-captain/src/shell/routes.ts
- shell_navigation: apps/mobile/app-captain/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-captain/components/proof-capture-panel.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-captain/screens/dsh_captain_proof_capture/viewmodel.ts

## Required States

- loading, capture pending, verification required, upload failed, and verified states

## Guardrails

- Do not hide proof or completion logic inside the execution workspace.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

