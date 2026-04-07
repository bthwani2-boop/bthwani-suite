# dsh_proxy_request_review_workspace

## Identity

- screen_id: dsh_proxy_request_review_workspace
- label: Proxy Request Review Workspace
- surface: control-panel
- actor: ops
- wave: W04
- route_candidate: dsh_proxy_request_review_workspace

## Purpose

- Review one proxy case and commit the estimate, offer, or decision.

## Primary CTA

- commit_proxy_decision

## Coverage

- operation_families: dsh_proxy_request_flow
- journeys: dsh_journey_proxy_exception

## Target Files

- preview_registry: packages/surfaces/src/dsh/control-panel/preview-routes.ts
- shell_routes: apps/web/control-panel/src/shell/routes.ts
- shell_navigation: apps/web/control-panel/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/control-panel/components/proxy-review-panel.tsx
- viewmodel_target: packages/surfaces/src/dsh/control-panel/screens/dsh_proxy_request_review_workspace/viewmodel.ts

## Required States

- loading, decision pending, scheduled, committed, and retry states

## Guardrails

- Do not widen this workspace into a generic admin surface.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

