# dsh_proxy_requests_list

## Identity

- screen_id: dsh_proxy_requests_list
- label: Proxy Requests List
- surface: control-panel
- actor: ops
- wave: W04
- route_candidate: dsh_proxy_requests_list

## Purpose

- Expose the internal queue of proxy cases that require review.

## Primary CTA

- open_proxy_review_workspace

## Coverage

- operation_families: dsh_proxy_request_flow
- journeys: dsh_journey_proxy_exception

## Target Files

- preview_registry: packages/surfaces/src/dsh/control-panel/preview-routes.ts
- shell_routes: apps/web/control-panel/src/shell/routes.ts
- shell_navigation: apps/web/control-panel/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/control-panel/components/proxy-review-panel.tsx
- viewmodel_target: packages/surfaces/src/dsh/control-panel/screens/dsh_proxy_requests_list/viewmodel.ts

## Required States

- loading, empty queue, attention needed, and retry states

## Guardrails

- Keep proxy review separate from the mainline ops order board.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

