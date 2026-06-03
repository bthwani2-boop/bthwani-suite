# DSH Operational Runtime/API Slices Plan

Scope: runtime/API planning only. This document does not add backend handlers, OpenAPI endpoints, generated clients, local demo data, or UI routes.

## Boundary

- DSH owns operational truth: onboarding evidence, catalog readiness, order lifecycle, preparation, assignment, trips, handoff, proof, COD event evidence, exceptions, support links, settlement input candidates, and control-panel operation records.
- WLT owns financial truth: ledger, payouts, refunds, reconciliation, wallet balance, captain earnings, partner settlement accounting, COD liability, and final settlement acceptance.
- DSH API slices may expose or submit settlement input candidates only. They must not mutate WLT financial state.
- Current screen and preview binding is metadata-bound through `dsh/frontend/shared/dsh-operational-surface-binding.ts`.
- Current Operations Room contracts are metadata-bound through `dsh/frontend/shared/dsh-control-panel-operations-room.ts`.

## Slice 001 - Existing Stores Read Model

- Purpose: keep the existing store read model as the first runtime dependency for client and partner store/catalog visibility.
- Candidate endpoint: current GET stores surface contract only.
- Owner: DSH.
- Surfaces: `app-client`, `app-partner`, `app-field`, `control-panel`.
- Operational entities: `partner-store-onboarding`, `catalog-readiness`.
- Required state: store active/readiness state, visibility state, media references, catalog readiness references.
- Proof: document/media/field evidence on demand.
- WLT boundary: no WLT impact.
- Status: existing runtime candidate; not expanded in this plan.

## Slice 002 - Partner Store Onboarding Runtime

- Purpose: persist field visit, document, media, location, readiness, and approval state for a store.
- Candidate endpoints:
  - `GET /dsh/operations/stores/{storeId}/onboarding`
  - `POST /dsh/operations/stores/{storeId}/onboarding-events`
- Surfaces: `app-field`, `app-partner`, `control-panel`.
- Operational entities: `partner-store-onboarding`, `catalog-readiness`, `control-panel-operation`.
- Request summary: storeId, partnerId, lifecycle event, actor, evidence refs, reason code.
- Response summary: onboarding status, missing proof, next owner, audit state, rollback hint.
- State machine: lead-created -> field-visit-scheduled -> field-visit-completed -> documents-collected -> store-approved -> store-active, with blocked state.
- Proof policy: document reference, field visit evidence, media reference, audit note.
- UI states: loading, empty, evidence-required, blocked, ready.
- WLT boundary: no WLT impact.
- Auth/audit: field and control-panel permissions; every approval/rejection writes operation record.
- Rollback: restore previous operational state.
- Observability: event count, blocked reason count, approval latency, evidence missing count.
- Test focus: invalid transition, missing proof, duplicate event id, audit required.
- Evidence needed: field screen screenshot, partner approval state screenshot, control-panel operation record screenshot.

## Slice 003 - Catalog Readiness Runtime

- Purpose: bind product identity, category, media, availability, and publish readiness to one operational record.
- Candidate endpoints:
  - `GET /dsh/operations/catalog/{productId}/readiness`
  - `POST /dsh/operations/catalog/{productId}/readiness-events`
- Surfaces: `app-client`, `app-partner`, `app-field`, `control-panel`.
- Operational entities: `catalog-readiness`, `partner-store-onboarding`.
- Request summary: productId, storeId, readiness event, media refs, category refs, actor, reason.
- Response summary: publish stage, missing prerequisites, visible surfaces, approval state.
- State machine: draft -> identity-ready -> media-ready -> category-ready -> approval-pending -> published, with hidden/blocked states.
- Proof policy: media reference and audit note.
- UI states: draft, pending review, published, hidden, blocked.
- WLT boundary: no WLT impact.
- Auth/audit: partner can submit; control-panel approves; field can attach field evidence.
- Rollback: restore previous readiness state.
- Observability: publish latency, blocked products, media missing, category mismatch.
- Test focus: publish without approval, local media duplication, invalid category, stale visibility.
- Evidence needed: app-client visible product state, partner readiness state, control-panel approval state.

## Slice 004 - Order Operational Truth Runtime

- Purpose: create one DSH order operational record from checkout intent through operational closure.
- Candidate endpoints:
  - `GET /dsh/operations/orders/{orderId}`
  - `POST /dsh/operations/orders/{orderId}/events`
- Surfaces: `app-client`, `app-partner`, `app-captain`, `control-panel`.
- Operational entities: `order-operational-truth`, `store-preparation`, `delivery-trip`, `support-escalation`.
- Request summary: orderId, lifecycle event, actor, owner surface, support refs, WLT read-only ref.
- Response summary: lifecycle status, current owner, SLA state, exception state, support state, settlement input readiness.
- State machine: serviceability-checked -> order-created -> partner-accepted -> preparing -> ready-for-pickup -> out-for-delivery -> delivered -> operationally-closed, with failed/returned/cancelled branches.
- Proof policy: support ticket reference, audit note, WLT reference.
- UI states: order summary, tracking, blocked, support-linked, delivered.
- WLT boundary: WLT read-only payment/refund references only.
- Auth/audit: control-panel and owning actor can transition allowed states; protected transitions require audit.
- Rollback: restore previous operational state or open exception.
- Observability: transition latency, stuck owner, SLA risk, exception rate.
- Test focus: invalid lifecycle transition, missing WLT reference when required, protected rollback, surface visibility.
- Evidence needed: client order screen, partner inbox, captain task, control-panel order detail.

## Slice 005 - Dispatch, Trip, Handoff, and PoD Runtime

- Purpose: bind assignment, trip milestones, pickup handoff, and delivery proof into one operational chain.
- Candidate endpoints:
  - `GET /dsh/operations/trips/{tripId}`
  - `POST /dsh/operations/trips/{tripId}/events`
  - `POST /dsh/operations/handoffs/{handoffId}/events`
  - `POST /dsh/operations/proofs/{proofId}/events`
- Surfaces: `app-client`, `app-partner`, `app-captain`, `control-panel`.
- Operational entities: `captain-assignment`, `delivery-trip`, `pickup-handoff`, `proof-of-delivery`.
- Request summary: tripId, orderId, assignmentId, proof refs, milestone, actor, reason.
- Response summary: assignment state, trip state, proof state, next required action, exception marker.
- State machine: assignment-pending -> assigned -> accepted -> arrived-pickup -> pickup-verified -> picked-up -> out-for-delivery -> pod-submitted -> delivered, with reassigned/failed/returned branches.
- Proof policy: pickup code, QR/barcode, photo evidence, OTP/PIN, signature, audit note.
- UI states: captain task, partner handoff, client tracking, control-panel review.
- WLT boundary: settlement input candidate only; no captain earnings calculation.
- Auth/audit: captain/partner proof submission; control-panel review and reassignment.
- Rollback: reassign owner, open exception, or restore previous milestone.
- Observability: assignment timeout, no-show rate, handoff mismatch, PoD rejection.
- Test focus: milestone order, proof mismatch, reassignment audit, delivery without accepted proof.
- Evidence needed: captain pickup/dropoff, partner handoff, client tracking, control-panel proof review.

## Slice 006 - COD Collection Event Runtime

- Purpose: record COD expected/collected/discrepancy operational facts and prepare WLT liability review candidates.
- Candidate endpoints:
  - `GET /dsh/operations/cod/{codEventId}`
  - `POST /dsh/operations/cod/{codEventId}/events`
- Surfaces: `app-captain`, `app-partner`, `control-panel`, `wlt-finance`.
- Operational entities: `cod-collection`, `settlement-input-bridge`.
- Request summary: codEventId, orderId, tripId, expected amount snapshot, collected amount snapshot, collector, reason.
- Response summary: collection status, discrepancy amount, WLT handoff status, audit state.
- State machine: expected -> collected-full/collected-partial/not-collected -> discrepancy-detected -> handoff-to-wlt-pending -> handoff-to-wlt-completed/audit-required.
- Proof policy: COD amount snapshot, WLT reference, audit note.
- UI states: expected, collected, discrepancy, WLT pending, audit required.
- WLT boundary: WLT owns liability, ledger, reconciliation, settlement.
- Auth/audit: captain/partner courier submit; control-panel reviews discrepancy.
- Rollback: WLT review required.
- Observability: discrepancy rate, handoff latency, rejected candidates.
- Test focus: amount snapshot only, missing discrepancy reason, DSH ledger mutation blocked.
- Evidence needed: captain COD state, control-panel COD queue, WLT read-only bridge row.

## Slice 007 - Exceptions and Support Runtime

- Purpose: keep operational exceptions and support tickets linked to source order/trip/proof/COD context.
- Candidate endpoints:
  - `GET /dsh/operations/exceptions/{exceptionId}`
  - `POST /dsh/operations/exceptions/{exceptionId}/events`
  - `POST /dsh/operations/support-links/{ticketId}/events`
- Surfaces: `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, `wlt-finance`.
- Operational entities: `operational-exception`, `support-escalation`.
- Request summary: exceptionId, ticketId, source ids, type, severity, owner surface, required action, WLT read-only reference.
- Response summary: status, current owner, required action, linked ticket, WLT reference, rollback hint.
- State machine: opened -> triaged -> assigned -> waiting-* -> resolved/escalated/audit-required -> closed.
- Proof policy: support ticket reference, WLT reference, audit note.
- UI states: linked, waiting owner, escalated, resolved, audit required.
- WLT boundary: WLT read-only or settlement/audit candidate only.
- Auth/audit: source owner can open; control-panel owns triage; critical cases require audit.
- Rollback: restore previous state or operator review.
- Observability: exception age, owner wait time, escalation rate, WLT wait count.
- Test focus: close without owner, detach ticket, financial conversion blocked.
- Evidence needed: exception queue, support link panel, surface-visible blocked state.

## Slice 008 - Settlement Input Bridge Runtime

- Purpose: generate, validate, send, and record WLT response for DSH operational settlement input candidates.
- Candidate endpoints:
  - `GET /dsh/operations/settlement-inputs/{eventId}`
  - `POST /dsh/operations/settlement-inputs/{eventId}/validate`
  - `POST /dsh/operations/settlement-inputs/{eventId}/handoff`
- Surfaces: `control-panel`, `wlt-finance`.
- Operational entities: `settlement-input-bridge`, `cod-collection`, `proof-of-delivery`, `operational-exception`.
- Request summary: eventType, source operational record, required ids, proof snapshots, amount/COD snapshots, exception snapshot.
- Response summary: readiness, missing ids, missing proof, WLT target capability, handoff status, rejection reason.
- State machine: not-ready -> ready -> pending-handoff -> sent-to-wlt -> accepted-by-wlt/rejected-by-wlt/needs-reconciliation -> closed.
- Proof policy: pickup code, photo evidence, COD amount snapshot, WLT reference, audit note.
- UI states: not ready, ready for WLT, sent, accepted, rejected, needs reconciliation.
- WLT boundary: WLT owns final financial truth.
- Auth/audit: DSH can prepare and send candidates; WLT response is recorded as external state.
- Rollback: WLT review required.
- Observability: candidate readiness, rejection rate, missing proof, retry count.
- Test focus: unsupported event type, missing proof, forbidden amount/COD snapshot, DSH financial mutation blocked.
- Evidence needed: settlement input preview, WLT bridge row, rejection state.

## Slice 009 - Control-Panel Operation Records Runtime

- Purpose: record operation id, permission, input, validation, side effect, audit log, rollback hint, and evidence for control-panel actions.
- Candidate endpoints:
  - `GET /dsh/operations/audit/{operationId}`
  - `POST /dsh/operations/audit/{operationId}/events`
- Surfaces: `control-panel`.
- Operational entities: `control-panel-operation`.
- Request summary: operationId, source record id, action, actor, input hash, validation result, evidence refs.
- Response summary: audit state, rollback hint, side effect classification, permission result.
- State machine: recorded -> reviewed -> rollback-requested -> rollback-approved/rollback-rejected -> closed.
- Proof policy: audit note.
- UI states: recorded, review, rollback requested, closed.
- WLT boundary: no WLT impact unless source record references WLT read-only context.
- Auth/audit: every mutation candidate writes operation record; protected operations require maker-checker.
- Rollback: operator review required.
- Observability: mutation count, rollback count, validation failure, missing evidence.
- Test focus: missing operation id, missing permission, side effect misclassification, rollback without previous state.
- Evidence needed: Operations Room audit workspace.

## Slice 010 - Cross-Surface Operational Summary Runtime

- Purpose: provide a lean summary view for each surface without loading heavy proof/media/detail payloads.
- Candidate endpoint:
  - `GET /dsh/operations/surfaces/{surfaceId}/summary`
- Surfaces: `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`.
- Operational entities: all DSH operational registry entries.
- Request summary: surfaceId, optional order/store/trip filters, pagination cursor.
- Response summary: summary cards only, registry entry id, owner, status, evidence available flag, detail ref.
- State machine: read-only summary.
- Proof policy: evidence loaded on open only.
- UI states: summary, empty, filtered, needs evidence, blocked.
- WLT boundary: read-only references and settlement input candidate markers only.
- Auth/audit: read permission by surface and role.
- Rollback: not applicable.
- Observability: summary latency, detail-on-open rate, evidence-on-open rate.
- Test focus: no heavy payload, pagination, hidden surface leakage, WLT finance leakage.
- Evidence needed: all bound surface screenshots after UI render binding.

## Implementation Order

1. Confirm screen/registry binding coverage in TypeScript.
2. Add runtime read model for existing stores without expanding financial behavior.
3. Add order operational truth read endpoint.
4. Add trip/handoff/proof runtime endpoints.
5. Add exception/support runtime endpoints.
6. Add COD event endpoint with WLT boundary guard.
7. Add settlement input validation endpoint.
8. Add control-panel operation record endpoint.
9. Add cross-surface summary endpoint.
10. Capture screenshots and update evidence matrices only after visual binding is rendered.
