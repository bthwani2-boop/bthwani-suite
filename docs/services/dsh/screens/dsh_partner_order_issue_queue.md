# dsh_partner_order_issue_queue

## Identity

- screen_id: dsh_partner_order_issue_queue
- label: Partner Order Issue Queue
- surface: app-partner
- actor: partner
- wave: W04
- route_candidate: dsh_partner_order_issue_queue

## Purpose

- Collect issue-driven partner cases that may need resolution or escalation.

## Primary CTA

- open_issue_case

## Coverage

- operation_families: dsh_partner_order_handling|dsh_customer_order_chat
- journeys: dsh_journey_partner_block_recovery|dsh_journey_ops_governance_internal

## Target Files

- preview_registry: packages/surfaces/src/dsh/app-partner/preview-routes.ts
- shell_routes: apps/mobile/app-partner/src/shell/routes.ts
- shell_navigation: apps/mobile/app-partner/src/shell/navigation.ts
- component_target: packages/surfaces/src/dsh/app-partner/components/issue-queue-list.tsx
- viewmodel_target: packages/surfaces/src/dsh/app-partner/screens/dsh_partner_order_issue_queue/viewmodel.ts

## Required States

- loading, empty queue, resolution pending, and retry states

## Guardrails

- Keep issue handling subordinate to partner ownership and not a control-panel mirror.

## Deferred Notes

- Binding opens in W08. Runtime proof opens in W09.

