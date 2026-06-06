# DSH Operational Operating Model Gap Map

Status: PHASE_0_GAP_MAP
Scope: DSH operational truth only. No backend, OpenAPI, UI, preview data, or WLT financial mutation is introduced by this file.

## Executive Decision

DSH is not missing more screens as the first fix. DSH is missing a central operational operating model that can bind the four apps and the control panel to one auditable operating truth.

DSH owns the operational sequence:

```text
partner lead -> field visit -> store readiness -> catalog readiness -> client order
-> store preparation -> captain assignment -> pickup handoff -> delivery trip
-> proof of delivery -> COD event -> exception/support handling
-> operational closure -> settlement input event to WLT
```

WLT owns final money truth:

```text
wallet balance, payment authorization, ledger, payouts, refunds, reconciliation,
captain earnings, partner settlement accounting, financial mutation
```

DSH may generate settlement input events for WLT. DSH must not calculate, post, settle, refund, reconcile, or mutate financial truth.

## End-to-End DSH Journey

| Step | DSH operational truth | Surface visibility | WLT boundary |
|---|---|---|---|
| Partner lead/onboarding | Partner/store onboarding record tracks lead, documents, visit, location, media, and approval state | app-field, app-partner, control-panel | No WLT ownership |
| Field visit | Field visit evidence records readiness, risk, missing documents, and revisit need | app-field, control-panel | No WLT ownership |
| Store readiness | Store readiness state gates catalog and client visibility | app-partner, app-field, control-panel | No WLT ownership |
| Catalog readiness | Product identity, SKU/barcode, media key, publish stage, visibility, and availability are operational inputs | app-partner, app-client, app-field, control-panel | Price display is a snapshot only |
| Client discovery/cart | Client sees only approved stores and visible catalog summaries | app-client | Payment intent belongs to WLT |
| Checkout intent | DSH tracks checkout/order operational state; WLT authorizes payment | app-client, control-panel | WLT owns payment result and wallet semantics |
| Order created | Central order operational record stores owner, status, SLA, delivery mode, support, proof, COD, and settlement input state | all DSH surfaces by role | WLT reference is read-only |
| Partner accept/reject | Store preparation record tracks accept, reject reason, prep start, ETA, item issues, substitutions, and ready state | app-partner, control-panel | Reversal/refund remains WLT-owned |
| Captain assignment | Assignment record tracks candidates, WLT eligibility read-only snapshot, offer, accept/decline/no-show/reassign | app-captain, control-panel | Eligibility is read-only from WLT |
| Pickup handoff | Pickup proof records code, QR/barcode, photo, store/captain confirmation, mismatch, and audit need | app-partner, app-captain, control-panel | Settlement basis only, not accounting |
| Delivery trip | Trip record tracks assignment, pickup/dropoff milestones, distance/duration snapshots, failure/return, and proof state | app-client, app-captain, control-panel | No WLT mutation |
| Proof of delivery | Delivery proof tracks proof type, capture, verification, rejection, customer visibility, and audit | app-client, app-captain, control-panel | Proof may become WLT settlement evidence |
| COD event | COD event tracks expected/collected amounts, collector, discrepancy, reason, and WLT handoff status | app-captain, app-partner, control-panel | WLT owns COD liability and ledger |
| Exception/support | Exception and support links bind order, trip, ticket, owner, severity, required action, audit, rollback | all DSH surfaces by role | WLT reference is read-only |
| Operational closure | DSH verifies operational state and proof readiness | control-panel | No financial closure |
| Settlement input | DSH emits candidate event to WLT with snapshots and proof references | control-panel, wlt-finance | WLT accepts/rejects and accounts |

## Required DSH Operational Entities

| Entity | Owner | Purpose | Required status source | Visible surfaces | WLT impact | Gap type | Priority |
|---|---|---|---|---|---|---|---|
| DshPartnerStoreOperationalRecord | app-field | Track partner/store onboarding, documents, visit, media, delivery capability, approval, risk | onboarding lifecycle | app-field, app-partner, control-panel | none | missing central contract | P1 |
| DshCatalogOperationalItem | app-partner | Track product identity, SKU/barcode, media, publish, visibility, availability, approval | catalog readiness lifecycle | app-client, app-partner, app-field, control-panel | amount snapshot only | missing central contract | P1 |
| DshOrderOperationalRecord | app-client | Track order owner, delivery mode, payment mode, lifecycle, SLA, support, proof, COD, settlement input | order lifecycle | app-client, app-partner, app-captain, control-panel | read-only payment/WLT refs | missing central contract | P1 |
| DshDeliveryTrip | app-captain | Track trip assignment, pickup/dropoff milestones, proof, COD, failure/return, audit | trip lifecycle | app-client, app-partner, app-captain, control-panel | settlement input candidate only | missing central contract | P1 |
| DshCaptainAssignment | control-panel | Track candidates, selected captain, offer state, WLT eligibility snapshot, decline/no-show/reassign | assignment lifecycle | app-captain, control-panel | read-only eligibility | missing central contract | P1 |
| DshStorePreparationRecord | app-partner | Track accept/reject, prep, item issues, substitutions, ready, handoff, store-delivered | preparation lifecycle | app-partner, app-captain, control-panel | settlement input candidate only | missing central contract | P1 |
| DshPickupHandoffProof | app-partner | Track pickup evidence, confirmations, mismatch, missing/extra items, failure, audit | handoff proof lifecycle | app-partner, app-captain, control-panel | settlement proof candidate | missing central contract | P1 |
| DshDeliveryProof | app-captain | Track PoD capture, verification, rejection, expiration, audit | proof lifecycle | app-client, app-captain, control-panel | settlement proof candidate | missing central contract | P1 |
| DshCodCollectionEvent | app-captain | Track COD expected/collected, discrepancy, collector, WLT handoff | COD lifecycle | app-captain, app-partner, control-panel, wlt-finance | WLT liability candidate | missing central contract | P1 |
| DshOperationalException | control-panel | Track operational incident type, owner, severity, action, status, audit, rollback | exception lifecycle | all DSH surfaces by role | optional WLT audit candidate | missing central contract | P1 |
| DshSupportEscalationLink | control-panel | Link support ticket to order, trip, exception, WLT reference, visibility, resolution | support lifecycle | app-client, app-partner, app-captain, control-panel | read-only WLT reference | missing central contract | P1 |
| DshSettlementInputEvent | control-panel | Emit operational input event to WLT after DSH proof/readiness checks | settlement input lifecycle | control-panel, wlt-finance | WLT handoff only | missing central contract | P1 |
| DshControlPanelOperationRecord | control-panel | Define operation id, permission, input, validation, side effect class, audit, rollback, evidence | operation lifecycle | control-panel | read-only bridge where needed | missing central contract | P1 |

## Cross-Surface Ownership Matrix

| Surface | May own | May see | Forbidden |
|---|---|---|---|
| app-client | Client order visibility, tracking visibility, support context | trip status, payment/WLT status read-only, support escalation state | partner internals, captain internals, financial mutation |
| app-partner | preparation, item issue, substitution, ready state, handoff, partner delivery state, catalog readiness | settlement input status read-only | ledger, payout, refund accounting, captain route control |
| app-captain | assignment decision, pickup, trip milestones, PoD, COD collection event capture | WLT eligibility read-only, partner ready/handoff state | captain earnings calculation, settlement accounting |
| app-field | onboarding, visit evidence, readiness evidence | store publish/readiness outcome | catalog runtime ownership, financial policy, settlement |
| control-panel | queues, commands, audit, rollback, approvals, operational intervention | all DSH operational records, WLT bridge read-only | local service state machine duplication, WLT money logic |
| wlt-finance | final financial truth | DSH settlement input events and operational proof references | DSH trip/dispatch ownership |

## Control Panel Operations Room Gap Map

| Workspace | Purpose | Required operations | Current path if exists | Missing pieces |
|---|---|---|---|---|
| Orders Queue | Monitor operational order owner, SLA, exception, support, settlement input state | inspect, route, hold, escalate | dsh/frontend/control-panel/operations | needs central operational registry entry |
| Trips Board | Monitor trip status, pickup/dropoff, proof, failure/return | inspect, intervene, escalate | dsh/frontend/control-panel/operations | needs trip entity contract |
| Captain Assignment Board | Track candidates, eligibility read-only, accept/decline/no-show/reassign | assign, reassign preview, audit | DispatchAssignmentScreen.tsx | needs assignment entity contract |
| Store Preparation SLA | Track accept/reject/preparing/item issue/substitution/ready/handoff | inspect, escalate, audit | operations live-orders group | needs preparation entity contract |
| Pickup/Handoff Monitor | Track code/QR/barcode/photo/mismatch/store delay | inspect proof, require evidence, audit | live-orders proofs subgroup | needs pickup proof contract |
| PoD Review Queue | Review proof type, submitted/accepted/rejected/audit required | inspect proof, mark review state, escalate | live-orders proofs subgroup | needs delivery proof contract |
| COD Discrepancy Queue | Track expected/collected/discrepancy/WLT handoff | inspect, handoff to WLT, audit | finance is WLT-owned | needs COD event contract without DSH ledger |
| Exception Queue | Track type/severity/owner/status/action/audit | triage, assign, resolve, escalate | ExceptionsEscalationsScreen.tsx | needs exception entity contract |
| Support Escalation Queue | Link ticket/order/trip/exception/WLT reference | route, link, resolve, rollback note | support workspaces | needs support link contract |
| Settlement Inputs Preview | Show DSH input ready/pending/sent/accepted/rejected by WLT | inspect, retry policy preview, audit | finance bridge | needs settlement input entity contract |
| WLT Finance Bridge | Make WLT ownership explicit | read-only navigation/reference | dsh/frontend/control-panel/finance | no DSH financial mutation allowed |
| Audit & Rollback | Track operation history, permission, evidence, rollback hint | inspect, document rollback, audit | AuditSupportSlaScreen.tsx | needs operation record contract |

## Settlement Boundary

DSH may generate settlement input events only.

DSH must not own:

```text
ledger, payouts, refunds, reconciliation, wallet balance,
captain earnings, partner settlement accounting, financial mutation
```

WLT owns final financial truth and may accept, reject, reconcile, or account for DSH settlement input events.

## Implementation Phasing

1. Phase 1: contracts only under `dsh/frontend/shared`.
2. Phase 2: operational registry only under `dsh/frontend/shared`.
3. Phase 3: preview adapters and central preview data only under `dsh/frontend/data` and `dsh/frontend/shared`.
4. Phase 4: bind current surfaces without route inflation.
5. Phase 5: control-panel Operations Room workspaces.
6. Phase 6: DSH to WLT bridge contract expansion.
7. Phase 7: runtime/API slice plan, no backend execution until approved.
8. Phase 8: visual/runtime evidence gate after UI binding.

## Acceptance Gates

No claim may be promoted without:

- route/screen proof,
- state proof,
- runtime/data classification,
- cross-surface proof,
- visual evidence when UI changes,
- WLT boundary proof,
- TypeScript proof,
- git diff proof.

This phase does not change UI, backend, OpenAPI, generated clients, local demo data, or WLT financial ownership.
